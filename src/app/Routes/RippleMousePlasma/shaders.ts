export const vertexShader = `
uniform float time;
uniform vec2 resolution;
void main()
{
	gl_Position = vec4(position, 1.0);
}`;

export const fragmentShader = `
uniform vec2 u_resolution;
uniform vec3 u_mouse;
uniform bool u_mousemoved;
uniform float u_time;
uniform sampler2D u_noise;
uniform sampler2D u_buffer;
uniform sampler2D u_environment;
uniform sampler2D u_texture;
uniform bool u_renderpass;
uniform int u_frame;

#define PI 3.141592653589793
#define TAU 6.283185307179586
#define pow2(x) (x * x)
#define OCTAVES 8

const float bias = .2;
const float scale = 10.;
const float power = 10.1;

// blur constants
const float blurMultiplier = 0.95;
const float blurStrength = 4.98;
const int samples = 8;
const float sigma = float(samples) * 0.25;


vec2 hash2(vec2 p)
{
	vec2 o = texture2D( u_noise, (p+0.5)/256.0, -100.0 ).xy;
	return o;
}

float gaussian(vec2 i) {
	return 1.0 / (2.0 * PI * pow2(sigma)) * exp(-((pow2(i.x) + pow2(i.y)) / (2.0 * pow2(sigma))));
}

vec3 hash33(vec3 p){

	float n = sin(dot(p, vec3(7, 157, 113)));
	return fract(vec3(2097152, 262144, 32768)*n);
}

vec3 blur(sampler2D sp, vec2 uv, vec2 scale) {
	vec3 col = vec3(0.0);
	float accum = 0.0;
	float weight;
	vec2 offset;

	for (int x = -samples / 2; x < samples / 2; ++x) {
			for (int y = -samples / 2; y < samples / 2; ++y) {
					offset = vec2(x, y);
					weight = gaussian(offset);
					col += texture2D(sp, uv + scale * offset).rgb * weight;
					accum += weight;
			}
	}

	return col / accum;
}

vec3 hsb2rgb( in vec3 c ){
	vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
													 6.0)-3.0)-1.0,
									 0.0,
									 1.0 );
	rgb = rgb*rgb*(3.0-2.0*rgb);
	return c.z * mix( vec3(1.0), rgb, c.y);
}

vec3 domain(vec2 z){
	return vec3(hsb2rgb(vec3(atan(z.y,z.x)/TAU,1.,1.)));
}
vec3 colour(vec2 z) {
		return domain(z);
}

const float delta = .005;


vec4 renderRipples() {
	vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
	vec3 e = vec3(vec2(3.6)/u_resolution.xy,0.);
	vec2 sample = gl_FragCoord.xy / u_resolution.xy;
	float ratio = u_resolution.x / u_resolution.y;
	vec2 mouse = u_mouse.xy - uv;

	vec4 fragcolour = texture2D(u_buffer, sample);

	float shade = 0.;

	if(u_mousemoved == false) {
		float t = u_time * 4.;
		mouse = vec2(cos(t)*1.5, sin(t*2.)) * .3 - sample + .5;
		shade = smoothstep(.02 + abs(sin(u_time*10.) * .006), .0, length(mouse));
	}

	// float shade = 1. - smoothstep(.1, .15, length(mouse));
	if(u_mouse.z == 1.) {
		shade = smoothstep(.02 + abs(sin(u_time*10.) * .006), .0, length(mouse));
	}
	if(mod(u_time, .1) >= .095) {
		vec2 hash = hash2(vec2(u_time*2., sin(u_time*10.)))*3.-1.;
		shade += smoothstep(.012, .0, length(uv-hash+.5));
	}
	// shade -= (smoothstep(.185, .0, length(mouse))-shade)*2.;

	vec4 texcol = fragcolour;

	float d = shade * 2.;

	float t = texture2D(u_buffer, sample-e.zy, 1.).x;
	float r = texture2D(u_buffer, sample-e.xz, 1.).x;
	float b = texture2D(u_buffer, sample+e.xz, 1.).x;
	float l = texture2D(u_buffer, sample+e.zy, 1.).x;

	// float t = texture2D(u_buffer, sample + vec2(0., -delta*ratio)).x;
	// float r = texture2D(u_buffer, sample + vec2(delta, 0.)).x;
	// float b = texture2D(u_buffer, sample + vec2(0., delta*ratio)).x;
	// float l = texture2D(u_buffer, sample + vec2(-delta, 0.)).x;

	// fragcolour = (fragcolour + t + r + b + l) / 5.;
	d += -(texcol.y-.5)*2. + (t + r + b + l - 2.);
	d *= .99;
	d *= float(u_frame > 5);
	d = d*.5+.5;

	fragcolour = vec4(d, texcol.x, 0, 0);

	return fragcolour;
}




//   Naive environment mapping. Pass the reflected vector and pull back the texture position for that ray.
vec3 envMap(vec3 rd, vec3 sn, float scale){

	// rd.xy -= u_time*.2; // This just sort of compensates for the camera movement
	// rd.xy -= movement;
	rd *= 1.; // scale the whole thing down a but from the scaled UVs

	vec3 col = texture2D(u_environment, rd.xy - .5).rgb*2.;
	col *= normalize(col);
	// col *= vec3(1., 1., 1.2);
	// col *= vec3(hash2(rd.xy).y * .5 + .5);

	return col;

}

float bumpMap(vec2 uv, float height, inout vec3 colourmap) {


	vec3 shade;

	vec2 sample = gl_FragCoord.xy / u_resolution.xy;
	sample += uv;
	vec2 ps = vec2(1.0) / u_resolution.xy;

	shade = vec3(blur(u_buffer, sample, ps*blurStrength));
	// shade = texture2D(u_buffer, sample).rgb;
	// shade = vec3(shade.y * shade.y);

	return 1. - shade.x * height;
}
float bumpMap(vec2 uv, float height) {
	vec3 colourmap;
	return bumpMap(uv, height, colourmap);
}

vec4 renderPass(vec2 uv, inout float distortion) {
	vec3 surfacePos = vec3(uv, 0.0);
	vec3 ray = normalize(vec3(uv, 1.));
	// vec3 lightPos = vec3(cos(u_time / 2.) * 2., sin(u_time / 2.) * 2., -3.);
	vec3 lightPos = vec3(cos(u_time * .5 + 2.) * 2., 1. + sin(u_time * .5 + 2.) * 2., -3.);
	vec3 normal = vec3(0., 0., -1);

	vec2 sampleDistance = vec2(.005, 0.);

	vec3 colourmap;

	float fx = bumpMap(sampleDistance.xy, .2);
	float fy = bumpMap(sampleDistance.yx, .2);
	float f = bumpMap(vec2(0.), .2, colourmap);

	distortion = f;

	fx = (fx-f)/sampleDistance.x;
	fy = (fy-f)/sampleDistance.x;
	normal = normalize( normal + vec3(fx, fy, 0) * 0.2 );

	// specular = max(0.0, min(1.0, bias + scale * (1.0 + length(camPos-sp * surfNormal)) * power));
	float shade = bias + (scale * pow(1.0 + dot(normalize(surfacePos-vec3(uv, -3.0)), normal), power));

	vec3 lightV = lightPos - surfacePos;
	float lightDist = max(length(lightV), 0.001);
	lightV /= lightDist;

	vec3 lightColour = vec3(.8, .8, 1.);

	float shininess = .8;
	float brightness = 1.;

	float falloff = 0.1;
	float attenuation = 1./(1.0 + lightDist*lightDist*falloff);

	float diffuse = max(dot(normal, lightV), 0.);
	float specular = pow(max(dot( reflect(-lightV, normal), -ray), 0.), 52.) * shininess;

	// vec3 tex = texture2D(u_environment, (reflect(vec3(uv, -1.), normal)).xy ).rgb;
	vec3 reflect_ray = reflect(vec3(uv, 1.), normal * 1.);
	// The reflect ray is the ray wwe use to determine the reflection.
	// We use the UV less the movement (to account for "environment") to the surface normal
	vec3 tex = envMap(reflect_ray, normal, 1.5) * (shade + .5); // Fake environment mapping.

	vec3 texCol = (vec3(.4, .6, .9) + tex * brightness) * .5;

	float metalness = (1. - colourmap.x);
	metalness *= metalness;

	vec3 colour = (texCol * (diffuse*vec3(1, .97, .92)*2. + 0.5) + lightColour*specular * f * 2. * metalness)*attenuation*1.5;
	// colour *= 1.5;

	// return vec4(shade);
	return vec4(colour, 1.);
}

void main() {

	vec4 fragcolour = vec4(0);

	if(u_renderpass) {
		fragcolour = renderRipples();
	} else {


		vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
		vec2 sample = gl_FragCoord.xy / u_resolution.xy;
		// uv.x += sin(u_time*.5);
		// sample.x += sin(u_time*.05);

		float distortion;
		vec4 reflections = renderPass(uv, distortion);


	const float aMult = 2.293;
	const float bMult = 4.15;
	const float cMult = 2.2;

	uv *= 8. + (distortion);
	uv.x += u_time;
	uv.y += sin(u_time);
	uv += distortion*40.;

	float a=1.0;
	float b=1.0;
	float c=1.0;
	float d=0.0;
	for(int s=0;s<OCTAVES;s++) {
		vec2 r;
		r=vec2(cos(uv.y*a-d+u_time/b),sin(uv.x*a-d+u_time/b))/c;
				r+=vec2(-r.y,r.x)*0.3;
		uv.xy+=r;

		a *= aMult;
		b *= bMult;
		c *= cMult;
		d += 0.05+0.1*u_time*b;
	}
	fragcolour = vec4(
		sin(uv.x)*0.5+0.5,
		sin((uv.x+uv.y+sin(u_time*0.5))*0.5)*0.3+0.3,
		sin(uv.y+u_time)*0.3+0.3,
		1.0);

		// fragcolour += (texture2D(u_buffer, sample+.03).x)*.1 - .1;
		fragcolour += reflections*reflections*.5;
		// fragcolour = texture2D(u_buffer, sample + fragcolour.rg * .005);
		// // fragcolour = vec4(fragcolour.x * fragcolour.x);
	}

	gl_FragColor = fragcolour ;
}`;

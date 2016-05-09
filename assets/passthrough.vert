attribute vec4 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vColor;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
    vColor = aColor;
}

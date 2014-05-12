(function() {
  try {
    var gl      = makeGl('gl')
    var program = makeProgram(gl, ['vertex-shader', 'fragment-shader'])
    gl.useProgram(program)

    var positionLocation = getAttributeLocation(gl, program, 'a_position')
    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER, 
      new Float32Array([
          -1.0, -1.0, 
           1.0, -1.0, 
          -1.0,  1.0, 
          -1.0,  1.0, 
           1.0, -1.0, 
           1.0,  1.0]),
      gl.STATIC_DRAW)
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, true, 0, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 6)

  } catch (err) {
    console.log(err)
  }

  function makeGl(id) {
    var canvas = document.getElementById(id)
    var gl = canvas.getContext('experimental-webgl')
    if (!gl) {
      throw new Error('no webgl context available')
    }
    return gl
  }

  function makeProgram(gl, shaderIds) {
    var shaders = shaderIds.map(function(id) {
      var script = document.getElementById(id)
      if (!script) {
        throw new Error('unable to find shader with id: ' + id)
      }
      var type   = null
      switch(script.getAttribute('type')) {
        case 'x-shader/x-fragment':
          type = gl.FRAGMENT_SHADER
          break
        case 'x-shader/x-vertex':
          type = gl.VERTEX_SHADER
          break
      }
      if (!type) {
        throw new Error('unknown shader type')
      }
      var shader = gl.createShader(type)
      gl.shaderSource(shader, script.text)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        throw new Error(gl.getShaderInfoLog(shader))
      }
      return shader
    })
    var program = gl.createProgram()
    shaders.forEach(function(shader) {
      gl.attachShader(program, shader)
    })
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      shaders.forEach(function(shader) {
        gl.deleteShader(shader)
      })
      throw new Error('unable to link program')
    }
    return program
  }

  function getAttributeLocation(gl, program, attribute) {
    var location = gl.getAttribLocation(program, attribute)
    if (location == -1) {
      throw new Error('unable to locate attribute: ' + attribute)
    }
    return location
  }

  function getUniformLocation(gl, program, uniform) {
    var location = gl.getUniformLocation(program, uniform)
    if (location == -1) {
      throw new Error('unable to locate uniform: ' + uniform)
    }
    return location
  }
})()


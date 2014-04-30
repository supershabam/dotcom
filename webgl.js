(function() {
  try {
    var context = doCreateContext('webGLCanvas')
    // offscreen
    var mouseX = -1000
    var mouseY = -1000

    document.addEventListener('mousemove', function trackMouseEvent(e) {
      mouseX = e.pageX
      mouseY = e.pageY
    })

    var vertices = []
    var velocities = []
    var i

    for (i = 0; i < 4; ++i) {
      vertices.push(0, 0, 1.83)
      velocities.push(
        (Math.random() * 2 - 1) * 0.05,
        (Math.random() * 2 - 1) * 0.05,
        (Math.random() * 0.02) + 0.93
      )
    }
    vertices = new Float32Array(vertices)
    velocities = new Float32Array(velocities)

    function animate() {
      setTimeout(animate, 1000)

      var i, n = vertices.length, p, bp;
      var ratio = window.innerWidth / window.innerHeight
      for( i = 0; i < 4; i+=2 )
      {
        bp = i*3;
        // copy old positions
        vertices[bp] = vertices[bp+3];
        vertices[bp+1] = vertices[bp+4];
        
        // inertia
        velocities[bp] *= velocities[bp+2];
        velocities[bp+1] *= velocities[bp+2];
        
        // horizontal
        p = vertices[bp+3];
        p += velocities[bp];
        if ( p < -ratio ) {
          p = -ratio;
          velocities[bp] = Math.abs(velocities[bp]);
        } else if ( p > ratio ) {
          p = ratio;
          velocities[bp] = -Math.abs(velocities[bp]);
        }
        vertices[bp+3] = p;
        
        // vertical
        p = vertices[bp+4];
        p += velocities[bp+1];
        if ( p < -1 ) {
          p = -1;
          velocities[bp+1] = Math.abs(velocities[bp+1]);
        } else if ( p > 1 ) {
          p = 1;
          velocities[bp+1] = -Math.abs(velocities[bp+1]);
          
        }
        vertices[bp+4] = p;
        
        if ( true )
        {
          var dx = mouseX - vertices[bp],
              dy = mouseY - vertices[bp+1],
              d = Math.sqrt(dx * dx + dy * dy);
              if ( d < 2 )
              {
                if ( d < .03 )
                {
                  vertices[bp+3] = (Math.random() * 2 - 1)*ratio;
                  vertices[bp+4] = Math.random() * 2 - 1;
                  velocities[bp] = 0;
                  velocities[bp+1] = 0;
                } else {
                  dx /= d;
                  dy /= d;
                  d = ( 2 - d ) / 2;
                  d *= d;
                  velocities[bp] += dx * d * .01;
                  velocities[bp+1] += dy * d * .01;
                }
              }
        }
      }
      context.lineWidth(2);
      console.log(vertices)
      context.bufferData(context.ARRAY_BUFFER, vertices, context.DYNAMIC_DRAW);
      
      context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
      context.drawArrays( context.LINES, 0, 3 );
      context.flush();
    }
    animate()
  } catch (err) {
    console.log(err)
  }

  function doCreateContext(id) {
    var canvas = document.getElementById(id)
    var context = canvas.getContext('experimental-webgl')
    if (!context) {
      throw new Error('Unable to create webgl context')
    }

    var vertexShader   = compileShader(context, context.VERTEX_SHADER, 'shader-vs')
    var fragmentShader = compileShader(context, context.FRAGMENT_SHADER, 'shader-fs')

    var program = createProgram(context, [vertexShader, fragmentShader])
    context.useProgram(program)
    
    var vertexPosition = context.getAttribLocation(program, 'vertexPosition')
    context.enableVertexAttribArray(vertexPosition)
    context.clearColor(0.0, 0.0, 0.0, 0.0)
    context.clearDepth(1.0)
    context.enable(context.BLEND)
    context.disable(context.DEPTH_TEST)
    context.blendFunc(context.SRC_ALPHA, context.ONE)
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT)

    var perspectiveMatrix = getPerspectiveMatrix(window.innerWidth / window.innerHeight)
    var modelViewMatrix = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
    context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer())
    context.vertexAttribPointer(vertexPosition, 3.0, context.FLOAT, false, 0, 0)
    var uModelViewMatrix = context.getUniformLocation(program, 'modelViewMatrix')
    var uPerspectiveMatrix = context.getUniformLocation(program, 'perspectiveMatrix')
    context.uniformMatrix4fv(uModelViewMatrix, false, perspectiveMatrix)
    context.uniformMatrix4fv(uPerspectiveMatrix, false, modelViewMatrix)

    // resize
    function updateContext() {
      context.viewport(0, 0, window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', _.throttle(updateContext, 100))
    updateContext()
    
    return context
  }

  function compileShader(context, type, id) {
    var shaderScript = document.getElementById(id)
    var shader = context.createShader(type)
    context.shaderSource(shader, shaderScript.text)
    context.compileShader(shader)
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      context.deleteShader(shader)
      throw new Error('could not compile the shader with id: ' + id)
    }
    return shader
  }

  function createProgram(context, shaders) {
    var program = context.createProgram()
    shaders.forEach(function(shader) {
      context.attachShader(program, shader)
    })
    context.linkProgram(program)
    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      shaders.forEach(function(shader) {
        context.deleteProgram(shader)
      })
      context.deleteProgram(program)
      throw new Error('unable to create shader program')
    }
    return program
  }

  function getPerspectiveMatrix(aspectRatio) {
    var fieldOfView = 30.0
    var nearPlane = 1.0
    var farPlane = 10000.0
    var top = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0)
    var bottom = -top
    var right = top * aspectRatio
    var left = -right
    var a = (right + left) / (right - left)
    var b = (top + bottom) / (top - bottom)
    var c = (farPlane + nearPlane) / (farPlane - nearPlane)
    var d = (2 * farPlane * nearPlane) / (farPlane - nearPlane)
    var x = (2 * nearPlane) / (right - left)
    var y = (2 * nearPlane) / (top - bottom)
    var perspectiveMatrix = new Float32Array([
      x, 0, a, 0,
      0, y, b, 0,
      0, 0, c, d,
      0, 0, -1, 0
    ])
    return perspectiveMatrix
  }
})()

var gl;

var yVar = 0.0;
var xVar = 0.0;
var yLoc;
var xLoc;
var speed = 5;
var points = [];
var colors = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( .9, .9, .9, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vertices = [
		vec2(   0,     0 ),
		vec2(   0,    .1 ),
		vec2( -.1, -0.05 ),
		vec2(  .1, -0.05 )
	];

	initShape( vertices[0], vertices[1], vertices[2], vertices[3] );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    yLoc = gl.getUniformLocation(program, "yVar");
	xLoc = gl.getUniformLocation(program, "xVar");

	document.addEventListener('keydown', function(event) { 	
		
		if (event.keyCode == 87) { yVar += .01; }
		if (event.keyCode == 83) { yVar -= .01; }
		if (event.keyCode == 68) { xVar += .01; }
		if (event.keyCode == 65) { xVar -= .01; }
		if (event.keyCode == 49) { xVar = 0; yVar = 0; }
		
	}, false);
	
    render();
};

function triangle( a, b, c, color )
{
    var baseColors = [
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 1.0, 0.0),
        vec3(0.0, 0.0, 1.0),
        vec3(0.0, 0.0, 0.0)
    ];

    colors.push( baseColors[color] );
    points.push( a );
    colors.push( baseColors[color] );
    points.push( b );
    colors.push( baseColors[color] );
    points.push( c );
}

function initShape( a, b, c, d )
{
    triangle( a, b, c, 0 );
    triangle( a, c, d, 1 );
    triangle( a, b, d, 2 );
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
	
    gl.uniform1f(yLoc, yVar);
	gl.uniform1f(xLoc, xVar);

	gl.drawArrays( gl.TRIANGLES, 0, points.length );

    setTimeout(
        function () {requestAnimFrame( render );},
        speed
    );
}

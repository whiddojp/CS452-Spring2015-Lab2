
//John Whiddon
//0284759
//Lab2

var gl;

var y = 0.0;
var x = 0.0;
var yLoc, xLoc;
var xLock, yLock;
var colors = [];
var points = [];
var speed = .01;
var colorVert = [ 1,0,0,1,1,2,0,2,2,2,0,2,2,1,1 ];
var vertices = [
		//main bottom
		mat3( vec3( -.015, 0, 5 ),vec3( .015, 0, 5 ),vec3( 0, -.06, 5 ) ),		
		mat3( vec3( .018, 0, 5 ), vec3( .05, 0, 5 ), vec3( .0015, -.06, 5 ) ),		
		mat3( vec3( -.018, 0, 5 ), vec3( -.05, 0, 5 ), vec3( -.0015, -.06, 5) ),		
		
		//bottom strips
		mat3( vec3( .04, 0, 5 ), vec3( .047, 0, 5 ), vec3( .0015, -.06, 5 ) ),		
		mat3( vec3( -.04, 0, 5 ), vec3( -.047, 0, 5 ), vec3( -.0015, -.06, 5 ) ),		
		
		//right top
		mat3( vec3( .05, .003, 5 ), vec3( .03, .002, 5 ), vec3(  .03, .04, 5 ) ),		
		mat3( vec3( .028, .002, 5 ), vec3( .028, .04, 5 ), vec3( .018, .042, 5 ) ),		
		mat3( vec3( .025, .0021, 5 ), vec3( .003, .0015, 5 ), vec3( .022, .019, 5 ) ),		
		mat3( vec3( .001, .041, 5 ), vec3( .016, .042, 5 ), vec3( .021, .0205, 5 ) ),
		
		//left top
		mat3( vec3( -.05, .003, 5 ), vec3( -.03, .002, 5 ), vec3(  -.03, .04, 5 ) ),		
		mat3( vec3( -.028, .002, 5 ), vec3( -.028, .04, 5 ), vec3( -.018, .042, 5 ) ),		
		mat3( vec3( -.025, .0021, 5 ), vec3( -.003, .0015, 5 ), vec3( -.022, .019, 5 ) ),		
		mat3( vec3( -.001, .041, 5 ), vec3( -.016, .042, 5 ), vec3( -.021, .0205, 5 ) ),		
		
		//square
		mat3( vec3( 0, .003, 5 ), vec3( 0, .04, 5 ), vec3( .02, .02, 5 ) ),		
		mat3( vec3( 0, .003, 5 ), vec3( 0, .04, 5 ), vec3( -.02, .02, 5 ) )			
];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
		
    //
    //  Configure WebGL
	//
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }	
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( .9, .9, .9, 1.0 );	
	gl.enable(gl.DEPTH_TEST);
	
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

	//
	//initialize shape
	//
	createShape();	

    
	//
	//  Load shaders and initialize attribute buffers
    //
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
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	//
	// Set up Global Variables
	//   
    yLoc = gl.getUniformLocation(program, "y");
	xLoc = gl.getUniformLocation(program, "x");	

	//
	// Add event listeners
	//
	document.addEventListener('keydown', function(event) { 	
		
		if (event.keyCode == 87) { if (y < .94) { y += .0125; } }
		if (event.keyCode == 83) { if (y > -.94) { y -= .0125; } }
		if (event.keyCode == 68) { if (x < .94) { x += .0125; } }
		if (event.keyCode == 65) { if (x > -.94) { x -= .0125; } }
		if (event.keyCode == 49) { x = 0; y = 0; }
		
	}, false);
	
    render();
};

//
// Function to create triangles from three points
//
function triangle( a, b, c, color )
{
    var baseColors = [
        vec3( .3, .3, 1 ), //blue
        vec3( .7, .1, .1 ), //red
        vec3( .6, .6, 1 ), //light blue
    ];

    colors.push( baseColors[color] );
    points.push( a );
    colors.push( baseColors[color] );
    points.push( b );
    colors.push( baseColors[color] );
    points.push( c );
}

//
// Set up final shape
//
function createShape()
{
	var triMat;
    for (i = 0; i < vertices.length; i++)
	{	
		triMat = vertices[i];			
		triangle(triMat[0], triMat[1], triMat[2], colorVert[i]);	
	};
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	
    gl.uniform1f(yLoc, y);
	gl.uniform1f(xLoc, x);

	gl.drawArrays( gl.TRIANGLES, 0, points.length );

    setTimeout(
        function () {requestAnimFrame( render );},
        speed
    );
}

/*
    sim.js
    Simulation for coloumb potential 

    Achmad Zacky Fairuza | https://github.com/azfairuza/uts

    Use in HTML file :
    <script src="sim.js"></script>

    20190322
    2218 Start creating at home

    20190323
    2215 Finish at home
*/

// define global variable for visual
var taIn, taOut, taOut1, btnClear, btnRead, btnLoad, btnStart, btnInfo, canOut;

// Define global variables for simulation
var tstep , tbeg , tend , tdata , tproc , proc , t, Ndata , idata ;

// Define global variables for coordinates
var xmin , ymin , xmax , ymax , XMIN , YMIN , XMAX , YMAX ;

// Define global variable for parameter
var gacc, kcol, gcol;

//Define variables for two particle
var m1, D1, x1, y1, vx1, vy1, q1;
var m2, D2, x2, y2, vx2, vy2, q2;

main();

function main()
{
    createAndArrangeElement();
    showInfo();
}

function createAndArrangeElement()
{
    var hi = document.createElement("h1");
    hi.innerHTML = "2-D Particle Simulation in Coloumb Potential";
   
    taIn = document.createElement("textarea");
    taIn.style.width = "193px";
    taIn.style.height = "244px";
    taIn.style.float = "left";
    taIn.style.overflowY = "scroll";

    taOut = document.createElement("textarea");
    taOut.style.width = "193px";
    taOut.style.height = "244px";
    taOut.style.float = "left";
    taOut.style.overflowY = "scroll";

    taOut1 = document.createElement("textarea");
    taOut1.style.width = "444px";
    taOut1.style.height = "142px";
    taOut1.style.float = "left";
    taOut1.style.overflowY = "scroll";

    canOut = document.createElement("canvas");
    canOut.width = "350";
    canOut.height = "350";
    canOut.style.widht = canOut.widht + "px";
    canOut.style.height = canOut.height + "px";
    canOut.style.border = "#aaa 1px solid";
    canOut.style.float = "left";
    canOut.style.paddingRight = "2px";
    var cx = canOut.getContext("2d");
    cx.fillStyle = "#fff";
	cx.fillRect(0, 0, canOut.width , canOut.height );
	XMIN = 0;
	YMIN = canOut.height ;
	XMAX = canOut.width ;
	YMAX = 0;

    btnClear = document.createElement("button");
    btnClear.innerHTML = "Clear";
    btnClear.style.width = "93px";
    btnClear.style.height = "70px";
    btnClear.style.float = "left";
    btnClear.addEventListener("click", clickBtn);

    btnLoad = document.createElement("button");
    btnLoad.innerHTML = "Load";
    btnLoad.style.width = "93px";
    btnLoad.style.height = "70px";
    btnLoad.style.float = "left";
    btnLoad.addEventListener("click", clickBtn);

    btnRead = document.createElement("button");
    btnRead.innerHTML = "Read";
    btnRead.style.width = "93px";
    btnRead.style.height = "70px";
    btnRead.style.float = "left";
    btnRead.disabled = true;
    btnRead.addEventListener("click", clickBtn);

    btnStart = document.createElement("button");
    btnStart.innerHTML = "Start";
    btnStart.style.width = "93px";
    btnStart.style.height = "70px";
    btnStart.style.float = "left";
    btnStart.disabled = true;
    btnStart.addEventListener("click", clickBtn);

    btnInfo = document.createElement("button");
    btnInfo.innerHTML = "Info";
    btnInfo.style.width = "93px";
    btnInfo.style.height = "70px";
    btnInfo.style.float = "left";
    btnInfo.addEventListener("click", clickBtn);

    var div1 = document.createElement("div");
    div1.style.width = "650px";
    div1.style.height = "500px";
    div1.style.float = "left";
    div1.style.border = "#aaa 1px solid";

    var div2 = document.createElement("div");
    div2.style.width = "197px";
    div2.style.height = "499px";
    div2.style.float = "left";
    div2.style.border = "#aaa 1px solid";

    var div3 = document.createElement("div");
    div3.style.width = "449px";
    div3.style.height = "499px";
    div3.style.float = "left";
    div3.style.border = "#aaa 1px solid";

    var div4 = document.createElement("div");
    div4.style.width = "93px";
    div4.style.height = "350px";
    div4.style.float = "left";
    div4.style.border = "#aaa 1px solid";
    
    document.body.append(hi);
    document.body.append(div1);
        div1.append(div2);
            div2.append(taIn);
            div2.append(taOut);
        div1.append(div3);
            div3.append(div4);
                div4.append(btnClear);
                div4.append(btnLoad);
                div4.append(btnRead);
                div4.append(btnStart);
                div4.append(btnInfo);
            div3.append(canOut);
            div3.append(taOut1);
}

function clickBtn()
{
    var target = event.target;
    var cap = target.innerHTML;

    if(cap == "Clear")
    {
        clearAll();
        btnRead.disabled = true;
        btnStart.disabled = true;
        tout(taOut, "Clear All except this element");
    } 
    else if(cap == "Load")
    {
        loadParameters(taIn);
        btnRead.disabled = false;
        tout(taOut, "Parameters are being loaded");
    }
    else if(cap == "Read")
    {
        readParameters(taIn);
        initParameters();
        tout(taOut, "Parameters are read");
        clearCanvas();
        drawCanvas();
        tout(taOut, "grains being generated");
        btnStart.disabled = false;
    }
    else if(cap == "Start")
    {
        btnStart.innerHTML = "Stop";
        btnRead.disabled = true;
        btnLoad.disabled = true;
        btnClear.disabled = true;
        taIn.disabled = true;
        tout(taOut, "Simulation is started!");
        proc = setInterval(simulate, tproc);
    }
    else if(cap == "Stop")
    {
        btnStart.innerHTML = "Start";
        btnRead.disabled = false;
        btnLoad.disabled = false;
        btnClear.disabled = false;
        taIn.disabled = false;
        tout(taOut, "Simulation is stopped!");
        clearInterval(proc);
    }
    else if(cap == "Info")
    {
        showInfo();
    }
}
function simulate()
{
    // Stop simulation
    if (t >= tend)
    {
        tout(taOut, "Simulation stopped, t = end");
        btnStart.innerHTML = "Start";
        btnStart.disabled = true;
        btnRead.disabled = false;
        btnLoad.disabled = false;
        btnClear.disabled = false;
        taIn.disabled = false;
        clearInterval(proc);
    }
    if (idata == Ndata)
    {
        var digit = -Math.floor(Math.log10(tdata));
        var tt = t.toExponential(digit);
        
        if(t == tbeg ) {
			dout(taOut1, "# t x1 y1 v1x v1y x2 y2 v2x v2y \n");
        }
        
        dout(taOut1, 
            tt + " "
            + x1.toFixed(digit + 1) + " "
            + y1.toFixed(digit + 1) + " "
            + vx1.toFixed(digit + 1) + " "
            + vy1.toFixed(digit + 1) + " "
            + x2.toFixed(digit + 1) + " "
            + y2.toFixed(digit + 1) + " "
            + vx2.toFixed(digit + 1) + " "
            + vy2.toFixed(digit + 1) + "\n"
        );

        if(t >= tend){
			dout(taOut1, "\n");
        }
        
        idata = 0;
        clearCanvas();
        drawCanvas();
    }

    var Fx1, Fx2, Fy1, Fy2, F1, F2;
    Fx1 = 0;
    Fx2 = 0;
    Fy1 = 0;
    Fy2 = 0;

    //calculate distance and vector
    var Rx1 = x2 - x1;
    var Ry1 = y2 - y1;
    var R = Math.sqrt((Rx1*Rx1)+(Ry1*Ry1));
    var VRx1 = Rx1/R;
    var VRy1 = Ry1/R;

    //calculate coloumb force due to charge
    var S = Math.sign
    var Fcoloumb = (8.99*10^9)*q1*q2/(R*R);
    Fx1 += -Fcoloumb*VRx1;
    Fx2 += Fcoloumb*VRx1;
    Fy1 += -Fcoloumb*VRy1;
    Fy2 += Fcoloumb*VRy1;

    //calculate force due to earth gravity
    var Fg1, Fg2;
    Fg1 = m1*-gacc;
    Fg2 = m2*-gacc;
    Fy1 += Fg1;
    Fy2 += Fg2;

    //calculate force due to collision with the walls
    var w1 = [(xmin - x1), (xmax - x1), (ymin - y1), (ymax - y1)];
    var w2 = [(xmin - x2), (xmax - x2), (ymin - y2), (ymax - y2)];
    for (var i = 0; i < 4; i++)
    {
        var ksi = Math.max(0, 0.25*D1 - Math.abs(w1[i]));
        var vx = vx1;
        var vy = vy1;
        var v = Math.sqrt((vx*vx)+(vy*vy));
        var ksidot = v*Math.sign(ksi);
        var Fn = kcol*ksi + gcol*ksidot;
        var Vw1 = w1[i]/Math.abs(w1[i]);
        if(i < 2)
        {
            Fx1 += -Fn*Vw1;
        }
        else 
        {
            Fy1 += -Fn*Vw1;
        }
    }
    for (var i = 0; i < 4; i++)
    {
        var ksi = Math.max(0, 0.25*D2 - Math.abs(w2[i]));
        var vx = vx2;
        var vy = vy2;
        var v = Math.sqrt((vx*vx)+(vy*vy));
        var ksidot = v*Math.sign(ksi);
        var Fn = kcol*ksi + gcol*ksidot;
        var Vw1 = w2[i]/Math.abs(w2[i]);
        if(i < 2)
        {
            Fx2 += -Fn*Vw1;
        }
        else 
        {
            Fy2 += -Fn*Vw1;
        }
    }

    //calculate force due to collision between grains
    var ksi = Math.max(0, (0.5*(D1+D2) - R));
    var vx = vx2 - vx1;
    var vy = vy2 - vy1;
    var v = Math.sqrt((vx*vx)+(vy*vy));
    var ksidot = v * Math.sign(ksi);
    var Fn = kcol*ksi + gcol*ksidot;
    Fx1 += -Fn*VRx1;
    Fx2 += Fn*VRx1;
    Fy1 += -Fn*VRy1;
    Fy2 += Fn*VRy1;


    //calculate acceleration, velocity and position
    var ax1, ay1, ax2, ay2;
    ax1 = Fx1/m1;
    ax2 = Fx2/m2;
    ay1 = Fy1/m1;
    ay2 = Fy2/m2;

    vx1 = vx1 + ax1*tstep;
    vx2 = vx2 + ax2*tstep;
    vy1 = vy1 + ay1*tstep;
    vy2 = vy2 + ay2*tstep;

    x1 = x1 + vx1*tstep;
    x2 = x2 + vx2*tstep;
    y1 = y1 + vy1*tstep;
    y2 = y2 + vy2*tstep;

    //increase time
    idata ++;
    t += tstep;
    
}
function initParameters()
{
    t = tbeg ;
	Ndata = Math.floor( tdata / tstep );
	idata = Ndata ;
}

function readParameters()
{
    var lines = arguments[0].value;

    // Get parameters information
	gacc = getValue(lines , "GACC");
	kcol = getValue(lines , "KCOL");
	gcol = getValue(lines , "GCOL");

	// Get simulation information
	tstep = getValue(lines , "TSTEP");
	tbeg = getValue(lines , "TBEG");
	tend = getValue(lines , "TEND");
	tdata = getValue(lines , "TDATA");
	tproc = getValue(lines , "TPROC");
	
	// Get coordinates information
	xmin = getValue(lines , "XMIN");
	ymin = getValue(lines , "YMIN");
	xmax = getValue(lines , "XMAX");
    ymax = getValue(lines , "YMAX");
    
    // Get grains information
    m1 = getValue(lines , "MSS1");
    m2 = getValue(lines , "MSS2");
    x1 = getValue(lines , "XPS1");
    y1 = getValue(lines , "YPS1");
    x2 = getValue(lines , "XPS2");
    y2 = getValue(lines , "YPS2");
    vx1 = getValue(lines , "VLX1");
    vy1 = getValue(lines , "VLY1");
    vx2 = getValue(lines , "VLX2");
    vy2 = getValue(lines , "VLY2");
    q1 = getValue(lines , "CHG1");
    q2 = getValue(lines , "CHG2");
    D1 = getValue(lines, "DIA1");
    D2 = getValue(lines, "DIA2");
}

function loadParameters()
{
    var lines = "";
	lines += "# Parameters \n";
	lines += "GACC 0\n"; // Gravitation m/s2
	lines += "KCOL 10000\n"; // Normal constant N/m
	lines += "GCOL 5\n"; // Normal constant N/m
	
	lines += "\n";
	lines += "# Simulation\n";
	lines += "TSTEP 0.001\n"; // Time step s
	lines += "TBEG 0\n"; // Initial time s
	lines += "TEND 2\n"; // Final time s
	lines += "TDATA 0.02\n"; // Data period s
	lines += "TPROC 1\n"; // Event period ms

	lines += "\n";
	lines += "# Coordinates\n";
	lines += "XMIN -0.500\n"; // xmin m
	lines += "YMIN 0\n"; // ymin m
	lines += "XMAX 0.500\n"; // xmax m
	lines += "YMAX 0.500\n"; // ymax m

	lines += "\n";
	lines += "# Grains\n";
    lines += "MSS1 0.05\n"; // mass of grain1 kg
    lines += "MSS2 0.05\n"; // mass of grain2 kg
    lines += "XPS1 0.2\n"; // x position of grain1 m
    lines += "YPS1 0.25\n"; // y position of grain1 m
    lines += "XPS2 -0.2\n"; // x position of grain2 m
    lines += "YPS2 0.25\n"; // y position of grain2 m
    lines += "VLX1 0\n"; // x component velocity of grain1 m/s
    lines += "VLY1 0\n"; // y component velocity of grain1 m/s
    lines += "VLX2 0\n"; // x component velocity of grain2 m/s
    lines += "VLY2 0\n"; // y component velocity of grain2 m/s
    lines += "CHG1 -0.007\n"; //charge of grain1 uC
    lines += "CHG2 0.01\n"; //charge of grain2 uC
    lines += "DIA1 0.03\n"; //diameter of grain1 m
    lines += "DIA2 0.03\n"; //diameter of grain2 m

	var ta = arguments[0];
	ta.value = lines ;
	ta.scrollTop = ta.scrollHeight ;
}

function getValue(lines , key) {
	var value = undefined ;
	var line = lines.split("\n");
	var N = line.length ;
	for (var i = 0; i < N; i++) {
		var col = line[i].split(" ");
		if( col[0] == key) {
			value = parseFloat(col[1]) ;
		}	
	}
	return value ;
}

function drawCanvas()
{
    var cx = canOut.getContext("2d");

    var xx = x1;
    var yy = y1;
    var R1 = transform(xx, yy);
    var R2 = transform(xx + 0.5*D1, yy);

    cx.beginPath();
    cx.arc(R1.X, R1.Y, (R2.X - R1.X), 0, 2 * Math.PI );
    cx.fillStyle = "#a8f";
    cx.closePath();
    cx.fill();

    cx.beginPath();
    cx.lineWidth = 1;
    cx.arc(R1.X, R1.Y, (R2.X - R1.X), 0, 2 * Math.PI);
    cx.strokeStyle = "#000";
    cx.stroke();

    var xx = x2;
    var yy = y2;
    var R1 = transform(xx, yy);
    var R2 = transform(xx + 0.5*D2, yy);

    cx.beginPath();
    cx.arc(R1.X, R1.Y, (R2.X - R1.X), 0, 2 * Math.PI );
    cx.fillStyle = "#a33";
    cx.closePath();
    cx.fill();

    cx.beginPath();
    cx.lineWidth = 1;
    cx.arc(R1.X, R1.Y, (R2.X - R1.X), 0, 2 * Math.PI);
    cx.strokeStyle = "#000";
    cx.stroke();

    // Transform real coordinates to canvas coordinates
    function transform(xx , yy) 
    {
		var XX = (xx - xmin ) / ( xmax - xmin ) * ( XMAX - XMIN )+ XMIN ;
		var YY = (yy - ymin ) / ( ymax - ymin ) * ( YMAX - YMIN )+ YMIN ;
		return {X: XX , Y: YY };
	}

}

// Display text in an output textarea
function tout()
{
	var taOut0 = arguments[0];
	var msg = arguments[1];
    taOut0.value += msg;
    taOut0.value += "\n\n";
	taOut0.scrollTop = taOut0.scrollHeight ;
}
function dout()
{
	var taOut0 = arguments[0];
	var msg = arguments[1];
    taOut0.value += msg;
	taOut0.scrollTop = taOut0.scrollHeight ;
}

function clearAll()
{
    taIn.value = "";
    taOut.value = "";
    taOut1.value = "";
    clearCanvas();
}

function clearCanvas()
{
    var cx = canOut.getContext("2d");
    cx.fillStyle = "#fff";
    cx.fillRect(0, 0, 350, 350);
}

function showInfo()
{
    tout(taOut, "~~ Welcome ~~ \n\n" 
    + "to 2-D Particle Simulation "
    + "in Coloumb Potential\n\n"
    + "Created by : \n"
    + "Achmad Zacky Fairuza\n"
    + "NIM : 10215005")
}
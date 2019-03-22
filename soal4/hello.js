var ta;

main();

function main()
{
    creataAndArrangeElement(ta);
    loadTextTo(ta);
}

function creataAndArrangeElement()
{
    var arg0 = document.createElement("textarea");
    arg0.id = arguments[0];
    arg0.style.width = "400px";
    arg0.style.height = "100px";
    arg0.style.float = "center";

    document.body.append(arg0);
}

function loadTextTo()
{
    var id = arguments[0];
    var contain = document.getElementById(id);
    contain.value = "Hello, Achmad Zacky Fairuza"
    + " yang ber-NIM 10215005!";
}
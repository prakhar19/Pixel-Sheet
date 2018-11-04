var image = document.createElement('img');

function loadImage(image_file) {
    fr = new FileReader();
    fr.onload = function() {document.getElementById('image-display').src = image.src = fr.result;}
    fr.readAsDataURL(image_file);
}


function startConversion() {
    if(!image.src) return;

    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    console.log(image_data);
    convert(image_data);
}


function convert(image_data) {
    image_pixels = image_data.data;

    console.log(rgbaToRgb([255, 255, 255, 1]));
}

function rgbaToRgb(rgba, background = [255, 255, 255]) {
    var rgb = [];
    var alpha = rgba[3];

    rgb[0] = Math.round(((1 - alpha) * background[0]) + (alpha * rgba[0]));
    rgb[1] = Math.round(((1 - alpha) * background[1]) + (alpha * rgba[1]));
    rgb[2] = Math.round(((1 - alpha) * background[2]) + (alpha * rgba[2]));
 
    return rgb;
}
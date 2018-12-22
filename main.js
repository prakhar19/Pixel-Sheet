var image = document.createElement('img');

function loadImage(image_file) {
    fr = new FileReader();
    fr.onload = function() {document.getElementById('image-display').src = image.src = fr.result;};
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
    var rgb = [];

    var excel = $JExcel.new();
    excel.set(0, undefined, undefined, undefined, excel.addStyle({ border: 'none, none, none, none' }));
    
    for(var i = 0; i < image.height; i++) {
        for(var j = 0; j < image.width; j++) {
            index = (i * image.width) + j;
            
            pixel_color = [ image_data.data[4*index], image_data.data[4*index + 1], image_data.data[4*index + 2], image_data.data[4*index + 3] ];
            rgb[index] = rgbaToRgb(pixel_color, [255, 255, 255]);
            
            excel.set(0, j, i*3,'', excel.addStyle({ fill: '#' + $JExcel.rgbToHex(rgb[index][0], 0, 0) }));
            excel.set(0, j, i*3 + 1, '', excel.addStyle({ fill: '#' + $JExcel.rgbToHex(0, rgb[index][1], 0) }));
            excel.set(0, j, i*3 + 2, '', excel.addStyle({ fill: '#' + $JExcel.rgbToHex(0, 0, rgb[index][2]) }));
        }
    }
    console.log(rgb);
    
    excel.generate('Image.xlsx');
}

function rgbaToRgb(rgba, background = [255, 255, 255]) {
    var rgb = [];
    var alpha = rgba[3]/255;

    rgb[0] = Math.round(((1 - alpha) * background[0]) + (alpha * rgba[0]));
    rgb[1] = Math.round(((1 - alpha) * background[1]) + (alpha * rgba[1]));
    rgb[2] = Math.round(((1 - alpha) * background[2]) + (alpha * rgba[2]));
 
    return rgb;
}
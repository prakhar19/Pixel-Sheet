var image = document.createElement('img');
var image_name = 'Image';

function loadImage(image_file) {
    // Load the image in the image container and the "image" element
    fr = new FileReader();
    fr.onload = function() {document.getElementById('image-display').src = image.src = fr.result};
    fr.readAsDataURL(image_file);
    
    // Save the filename of the image for use later
    image_name = image_file.name.substring(0, image_file.name.lastIndexOf('.'));
}

function rgbaToRgb(rgba, background = [255, 255, 255]) {
    var rgb = [];
    var alpha = rgba[3]/255;

    rgb[0] = Math.round(((1 - alpha) * background[0]) + (alpha * rgba[0]));
    rgb[1] = Math.round(((1 - alpha) * background[1]) + (alpha * rgba[1]));
    rgb[2] = Math.round(((1 - alpha) * background[2]) + (alpha * rgba[2]));
 
    return rgb;
}

function convert() {
    if(!image.src) return;

    var image_data = getPixelData();
    
    createExcel(image_data);
}

function getPixelData() {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function createExcel(image_data) {
    var excel = $JExcel.new();
    
    
    excel.set(0, undefined, undefined, undefined, excel.addStyle({ border: 'none, none, none, none' }));

    // Set cell width & height
    for(var i = 0; i < image.width; i++) {
        excel.set(0, i, undefined, 3);
    }
    for(var i = 0; i < image.height * 3; i++) {
        excel.set(0, undefined, i, 9);
    }


    var rgb = [];
    for(var i = 0; i < image.height; i++) {
        for(var j = 0; j < image.width; j++) {
            index = (i * image.width) + j;
            
            pixel_color = [ image_data.data[4*index], image_data.data[4*index + 1], image_data.data[4*index + 2], image_data.data[4*index + 3] ];
            rgb[index] = rgbaToRgb(pixel_color, [255, 255, 255]);
            
            excel.set(0, j, i*3, '', excel.addStyle({ fill: '#' + $JExcel.rgbToHex(rgb[index][0], 0, 0) }));
            excel.set(0, j, i*3 + 1, '', excel.addStyle({ fill: '#' + $JExcel.rgbToHex(0, rgb[index][1], 0) }));
            excel.set(0, j, i*3 + 2, '', excel.addStyle({ fill: '#' + $JExcel.rgbToHex(0, 0, rgb[index][2]) }));
        }
    }
    
    excel.generate(image_name + '.xlsx');
}
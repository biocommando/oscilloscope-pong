let processor
const start = async (text) => {

    const img = document.querySelector('#myImg')
    const canvas = document.createElement('canvas');
    let w = 180, h = 50
    if (!text) {
        w = img.width;
        h = img.height;
    }
    canvas.width = w;
    canvas.height = h;
    if (!text) {
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    } else {
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        const msg = text.split(';')[0]
        const font = text.split(';')[1]
        ctx.font = font || "22px Arial";
        ctx.fillText(msg, 90, 25);
    }
    const pixelData = canvas.getContext('2d').getImageData(0, 0, w, h).data;
    let pixels = []
    const PX_LEN = 4
    const getPix = (x,y) => {
            //x = img.width - 1 - x
            const px_r = pixelData[(x + y * w) * PX_LEN]
            const px_g = pixelData[(x + y * w) * PX_LEN + 1]
            const px_b = pixelData[(x + y * w) * PX_LEN + 2]
            return {px_r, px_g, px_b}
        
    }
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            const {px_r, px_g, px_b} = getPix(x, y)
            if (!(px_r === 255 && px_g === 255 && px_b === 255)) {
                pixels.push({x, y, c: px_r | (px_g << 8) | (px_b << 16)})
            }
            //if (px_r === 255 && px_g === 0 && px_b === 0) pixels.push({x, y})
        }
    }
    console.log(pixels)
    if (processor) return processor.port.postMessage({pixels});
        
    const audioCtx = new AudioContext(/*{
        latencyHint: 'playback'
    }*/)
    await audioCtx.audioWorklet.addModule('xy-drawer.js')
    processor = new AudioWorkletNode(audioCtx, 'xy-drawer', { outputChannelCount: [2] })
    await processor.connect(audioCtx.destination)
    processor.port.postMessage({resolution: {w: 200, h: 200}})
    processor.port.postMessage({pixels})
}
/*for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
        const {px_r, px_g, px_b} = getPix(x, y)
        if (px_r === 0 && px_g === 0 && px_b === 255) pixels.push({x, y})
    }
}*/

//pixels = pixels.sort((a,b)=>a.c-b.c)
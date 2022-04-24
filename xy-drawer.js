class XyDrawer extends AudioWorkletProcessor {
    
    constructor() {
        super()
        this.port.onmessage = e => this.handlePortEvent(e.data)
        this.pixels = []
        this.resolution = {w: 100, h: 100}
        this.pxidx = 0
    }
    
    handlePortEvent(data) {
        if (data.resolution !== undefined) {
            this.resolution = data.resolution
        } else if (data.pixels !== undefined) {
            this.pixels = [
                ...data.pixels.map(px => ({ x: 0.1+0.9*px.x / this.resolution.w, y: -0.1-0.9*px.y / this.resolution.h })),
                ...data.pixels.map(px => ({ x: -0.1-0.9*px.x / this.resolution.w, y: 0.1+0.9*px.y / this.resolution.h })),        
            ]
            this.pxidx = 0
        }
    }
    
    process (inputs, outputDevices, parameters) {
        if (this.pixels.length === 0) return true
        
        const dev1OutputChannels = outputDevices[0]
        const channel1LeftBuffer = dev1OutputChannels[0]
        const channel1RightBuffer = dev1OutputChannels[1]
        
        // let pxidx = 0
        
        for (let i = 0; i < channel1LeftBuffer.length; i++) {
            if (this.pxidx >= this.pixels.length) this.pxidx = 0;
            channel1LeftBuffer[i] = this.pixels[this.pxidx].x
            channel1RightBuffer[i] = this.pixels[this.pxidx].y
            this.pxidx++
        }
        return true
    }

}

registerProcessor('xy-drawer', XyDrawer)
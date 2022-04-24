let processor
const start = async (givenProjectId) => {

    if (processor) return;
        
    const audioCtx = new AudioContext(/*{
        latencyHint: 'playback'
    }*/)
    await audioCtx.audioWorklet.addModule('xy-drawer.js')
    processor = new AudioWorkletNode(audioCtx, 'xy-drawer', { outputChannelCount: [2] })
    await processor.connect(audioCtx.destination)
    processor.port.postMessage({resolution: {w: 200, h: 200}})
    
    document.body.onkeydown = event => {
        const c = event.code.replace('Key', '')
        if (c === 'X') {
            paddleADir = -1
        }
        if (c === 'Z') {
            paddleADir = 1
        }
        if (c === 'M') {
            paddleBDir = -1
        }
        if (c === 'N') {
            paddleBDir = 1
        }
    }
    setInterval(() => {
        if (paddleADir < 0 && paddleA > 0) paddleA -= 4
        if (paddleADir > 0 && paddleA < 199) paddleA += 4
        if (paddleBDir < 0 && paddleB > 0) paddleB -= 4
        if (paddleBDir > 0 && paddleB < 199) paddleB += 4
        ball[0] += ballDir[0] * 3
        ball[1] += ballDir[1] * 3
        if (ball[0] > 199) {ball[0] = 199; ballDir[0] *= -1}
        else if (ball[0] < 0) {ball[0] = 0; ballDir[0] *= -1}
        else if (ball[1] > 185 && ballDir[1] === 1 && Math.abs(paddleA - ball[0]) < 32) {ballDir[1] *= -1;ballDir[0] = Math.random() < 0.5 ? -1 : 1;}
        else if (ball[1] < 15 && ballDir[1] === -1 && Math.abs(paddleB - ball[0]) < 32) {ballDir[1] *= -1;ballDir[0] = Math.random() < 0.5 ? -1 : 1;}
        else if (ball[1] < 5) {ball[1] = 195; ball[0]=paddleA; ballDir = [0,-1]}
        else if (ball[1] > 195) {ball[1] = 15; ball[0]=paddleB; ballDir = [0,1]}
        
        if (processor) {
            processor.port.postMessage({pixels: [
                ...new Array(48/2).fill(0).map((_,i) => ({ x: paddleA + Math.floor(i/2) - 12, y: 190 + i%2 })),
                ...new Array(48/2).fill(0).map((_,i) => ({ x: paddleB + Math.floor(i/2) - 12, y: 10 + i%2 })),
                ...new Array(32/2).fill(0).map((_,i) => ({ x: ball[0] + Math.floor(i/2) - 8, y: ball[1] + i%2 })),
            ]})
        }
    }, 25)
}

let paddleA = 100
let paddleB = 100
let ball = [100,100]
let ballDir = [0, 1]
let paddleADir = 0
let paddleBDir = 0

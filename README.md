# oscilloscope-pong
Pong that can be played on an oscilloscope set to XY mode using PC's audio output as the signal input

See it in action:
https://www.instagram.com/p/B6-YTWsl3kO/?igshid=1d56khilqswgw

**How does the drawing work?**

For the drawing to work correctly the output from an audio interface or sound card needs to be connected to the oscilloscope's inputs so that left channel goes to CH1 and right channel to CH2. The oscilloscope needs to be set to XY mode with vertical offset set to CH2.

The drawing is done by plotting "pixels" on the screen so that the pixel's position (x, y) is projected to a stereo audio sample where the left channel voltage level is set according to the x coordinate and right channel according to the y coordinate. The audio processing loop plots a repeating signal that contains the whole picture that will be plotted. The left / right channel waveforms that are produced contains the (x, y) projections as is on the first half period and on the second half period the same as on the first half but inverted. This inverting is done to remove the DC offset from the signal that would distort the picture if the DC component becomes blocked by the hardware. The signal is offset from the center by a constant value (+- 0.1) so that cropping the picture would be easier on the oscilloscope.

The length of the waveform is dependent on the samplerate and the amount of pixels plotted. At the moment the number of pixels plotted is always 128 which seems to be the default buffer length but the waveform is actually independent from the buffer size.

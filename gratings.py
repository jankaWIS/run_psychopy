import psychopy.visual
import psychopy.event

win = psychopy.visual.Window(
    size=[400, 400],
    units="pix",
    fullscr=False # Set to True for full screen
)

grating = psychopy.visual.GratingStim(
    win=win,
    units="pix",
    size=[150, 150]
)

grating.draw()

win.flip()

psychopy.event.waitKeys()

win.close()

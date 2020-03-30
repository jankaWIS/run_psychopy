import psychopy.visual
import psychopy.event
import psychopy.misc

win = psychopy.visual.Window(
    size=[400, 400],
    units="pix",
    fullscr=False,
    color=[1, 1, 1]
)

circle = psychopy.visual.Circle(
    win=win,
    units="pix",
    fillColor=[-1] * 3,
    lineColor=[-1] * 3,
    edges=128
)

# 'test' circles
circle.radius = 12

test_offset = 100

for offset in [-1, +1]:

    circle.pos = [test_offset * offset, 0]

    circle.draw()

# 'surround' circles
surr_thetas = [0, 72, 144,  216,  288]
surr_r = 50

for i_surr in range(len(surr_thetas)):

    [surr_pos_x, surr_pos_y] = psychopy.misc.pol2cart(
        surr_thetas[i_surr],
        surr_r
    )
    surr_pos_x = surr_pos_x + test_offset

    circle.pos = [surr_pos_x, surr_pos_y]
    circle.radius = 25
    circle.draw()

win.flip()

win.getMovieFrame()
psychopy.event.waitKeys()

win.close()
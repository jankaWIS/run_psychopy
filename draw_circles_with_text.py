import numpy as np
import psychopy.visual
from psychopy import monitors

screen_sizes = []
for mon in monitors.getAllMonitors():
    print(mon, monitors.Monitor(mon).getSizePix())
    screen_sizes.append(monitors.Monitor(mon).getSizePix())

screen_size = screen_sizes[0]

# Colours
gray = '#969696'
black = '#000000'
white = '#FFFFFF'
red = '#FF0000'
green = '#00FF00'

radius_pix = [np.floor(screen_size[0] / 16), np.floor(screen_size[0] / 16)]
n_edges = 512

# Parameters
safe_value = 5

win = psychopy.visual.Window(
    size=screen_size,
    units="pix",
    fullscr=False,
    color=gray
)

####################
#    Instructions
####################

instructions = psychopy.visual.TextStim(
    win=win,
    color=black,
    wrapWidth=np.floor(5 * screen_size[1] / 6),
)

instructions.text = """
In this game you will be presented with different gambles in which you can gain or lose money. On every
trial you will see 2 possible gambles, you must decide within few seconds which gamble you prefer by pressing
“1” or “2”.\n
\n
At the end of the experiment, the computer will randomly choose one of the gambles you selected and
draw a lottery to determine if you will gain or lose the amount in it.\n
\n
Press spacebar to see an example.
"""

instructions.draw()
win.flip()

psychopy.event.waitKeys()

instructions_example = psychopy.visual.TextStim(
    win=win,
    color=black,
    wrapWidth=np.floor(5 * screen_size[1] / 6),
    anchorVert='bottom'
)

instructions_example.text = """
Example
\n
Two gambles are presented – numbers represent the amount that
you can gain or lose (plus or minus sign) in NIS, color circles
represent the probability – the % of the circle painted in green
is the probability to gain the amount written with plus, red is
the lost probability\n
\n
In this example – gamble one is gaining 10 vs. losing 4 NIS with
probability 50 % each, while gamble 2 is gaining 5 NIS for sure.
"""
instructions_example.draw()

instructions_spacebar = psychopy.visual.TextStim(
    win=win,
    color=black,
    pos=(0, -np.floor(screen_size[1] / 3))
)

instructions_spacebar.text = """Press spacebar to continue."""
instructions_spacebar.size = 0.8
instructions_spacebar.draw()

safe_circle = psychopy.visual.Circle(
    win=win,
    radius=radius_pix,
    units="pix",
    edges=n_edges,
    fillColor=green,
    lineColor=black
)

safe_circle.pos = [np.floor(screen_size[0] / 6), -np.floor(screen_size[1] / 6)]
safe_text = psychopy.visual.TextStim(win, text='+' + str(safe_value), color=black)
safe_text.pos = [np.floor(screen_size[0] / 6), -np.floor(screen_size[1] / 6)]

safe_circle.draw()
safe_text.draw()

gain_circle = psychopy.visual.Polygon(
    win=win,
    radius=radius_pix,
    units="pix",
    edges=n_edges,
    fillColor=green,
    lineColor=black
)
gain_circle.vertices = gain_circle.vertices[:int(n_edges / 2) + 1]
gain_circle.pos = [-np.floor(screen_size[0] / 6), -np.floor(screen_size[1] / 6)]
gain_text = psychopy.visual.TextStim(win, text='+' + str(10), color=black)
gain_text.pos = [-np.floor(screen_size[0] / 6) + np.floor(radius_pix[0] / 2), -np.floor(screen_size[1] / 6)]

loss_circle = psychopy.visual.Polygon(
    win=win,
    radius=radius_pix,
    units="pix",
    edges=n_edges,
    fillColor=red,
    lineColor=black
)
loss_circle.vertices = loss_circle.vertices[int(n_edges / 2) + 1:]
loss_circle.pos = [-np.floor(screen_size[0] / 6), -np.floor(screen_size[1] / 6)]
loss_text = psychopy.visual.TextStim(win, text='-' + str(4), color=black)
loss_text.pos = [-np.floor(screen_size[0] / 6) - np.floor(radius_pix[0] / 2), -np.floor(screen_size[1] / 6)]

gain_circle.draw()
loss_circle.draw()
gain_text.draw()
loss_text.draw()

win.flip()

psychopy.event.waitKeys()

####################
#    Experiment
####################

safe_circle = psychopy.visual.Circle(
    win=win,
    radius=radius_pix,
    units="pix",
    edges=n_edges,
    fillColor=green,
    lineColor=black
)

safe_circle.pos = [np.floor(screen_size[0] / 6), 0]  # np.floor(screen_size[1]/2)]
safe_text = psychopy.visual.TextStim(win, text=str(safe_value), color=black)
safe_text.pos = [np.floor(screen_size[0] / 6), 0]

safe_circle.draw()
safe_text.draw()

gain_circle = psychopy.visual.Polygon(
    win=win,
    radius=radius_pix,
    units="pix",
    edges=n_edges,
    fillColor=green,
    lineColor=black
)
gain_circle.vertices = gain_circle.vertices[:int(n_edges / 2) + 1]
gain_circle.pos = [-np.floor(screen_size[0] / 6), 0]  # np.floor(screen_size[1]/2)]

loss_circle = psychopy.visual.Polygon(
    win=win,
    radius=radius_pix,
    units="pix",
    edges=n_edges,
    fillColor=red,
    lineColor=black
)
loss_circle.vertices = loss_circle.vertices[int(n_edges / 2) + 1:]
loss_circle.pos = [-np.floor(screen_size[0] / 6), 0]  # np.floor(screen_size[1]/2)]

gain_circle.draw()
loss_circle.draw()

win.flip()

psychopy.event.waitKeys()

win.close()

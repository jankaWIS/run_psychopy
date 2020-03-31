import csv
import os
import sys
from datetime import date

import numpy as np
# import psychopy.visual
from psychopy import monitors, core, visual, event, gui

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


# Functions
# https://github.com/marsja/psypy/blob/master/SART/SART.py
def experimentInfo():
    expName = u'Risk Aversion'
    expInfo = {'Subject ID': '', 'Age': '',
               'Sex': ['Male', 'Female']}
    expInfo[u'date'] = date.today().strftime("%d-%m-%Y")
    infoDlg = gui.DlgFromDict(dictionary=expInfo,
                              title=expName, fixed=None)
    # datafile = u'Data' + os.path.sep + u'DATA_SART.csv'
    if infoDlg.OK:
        return expInfo
    else:
        return 'Cancelled'


def show_safe_circle(win, radius_pix=radius_pix, n_edges=n_edges, safe_value=safe_value,
                     x_pos=np.floor(screen_size[0] / 6), y_pos=0,
                     x_pos_text=np.floor(screen_size[0] / 6), y_pos_text=0
                     ):
    """
    Shows green circle on the right side with black text safe_value
    :param win: screen to show it on
    :param radius_pix: radius of circle
    :param n_edges: it is a polygon so how smooth it will be
    """
    safe_circle = visual.Circle(
        win=win,
        radius=radius_pix,
        units="pix",
        edges=n_edges,
        fillColor=green,
        lineColor=black
    )

    safe_circle.pos = [x_pos, y_pos]  # np.floor(screen_size[1]/2)]
    safe_text = visual.TextStim(win, text=str(safe_value), color=black)
    safe_text.pos = [x_pos_text, y_pos_text]

    safe_circle.draw()
    safe_text.draw()


def show_gain_halfcircle(win, gain_value, radius_pix=radius_pix, n_edges=n_edges,
                         x_pos=-np.floor(screen_size[0] / 6), y_pos=0,
                         x_pos_text=-np.floor(screen_size[0] / 6) + np.floor(radius_pix[0] / 2), y_pos_text=0
                         ):
    """
    Shows half green circle on the left-left side with black text +gain
    :param win: screen to show it on
    :param radius_pix: radius of circle
    :param n_edges: it is a polygon so how smooth it will be
    """
    gain_circle = visual.Polygon(
        win=win,
        radius=radius_pix,
        units="pix",
        edges=n_edges,
        fillColor=green,
        lineColor=black
    )

    gain_circle.vertices = gain_circle.vertices[:int(n_edges / 2) + 1]
    gain_circle.pos = [x_pos, y_pos]  # np.floor(screen_size[1]/2)]
    gain_text = visual.TextStim(win, text='+' + str(gain_value), color=black)
    gain_text.pos = [x_pos_text, y_pos_text]

    gain_circle.draw()
    gain_text.draw()


def show_loss_halfcircle(win, loss_value, radius_pix=radius_pix, n_edges=n_edges,
                         x_pos=-np.floor(screen_size[0] / 6), y_pos=0,
                         x_pos_text=-np.floor(screen_size[0] / 6) - np.floor(radius_pix[0] / 2), y_pos_text=0
                         ):
    """
    Shows half green circle on the left-left side with black text +gain
    :param win: screen to show it on
    :param radius_pix: radius of circle
    :param n_edges: it is a polygon so how smooth it will be
    """
    loss_circle = visual.Polygon(
        win=win,
        radius=radius_pix,
        units="pix",
        edges=n_edges,
        fillColor=red,
        lineColor=black
    )

    loss_circle.vertices = loss_circle.vertices[int(n_edges / 2) + 1:]
    loss_circle.pos = [x_pos, y_pos]  # np.floor(screen_size[1]/2)]
    loss_text = visual.TextStim(win, text='-' + str(loss_value), color=black)
    loss_text.pos = [x_pos_text, y_pos_text]

    loss_circle.draw()
    loss_text.draw()


def runTrials(win, trial_sequence):
    """
    Run experiment, receives trial sequence and stimuli, returns choice and reaction times
    :param win: screen to be plotted it on
    :param trial_sequence:
    :return: choice and RT arrays
    """
    response_choice = np.zeros(len(trial_sequence))  # []
    response_RT = np.zeros(len(trial_sequence))  # []
    timer = core.Clock()
    for i, trial in enumerate(trial_sequence):
        timer.reset()
        show_safe_circle(win)
        show_gain_halfcircle(win, gain_value=trial[0])
        show_loss_halfcircle(win, loss_value=trial[1])
        win.flip()

        # https://discourse.psychopy.org/t/numbers-on-the-right-side-of-the-keyboard-are-not-working/1728/3
        keys = event.waitKeys(keyList=['escape', '1', '2', 'num_1', 'num_2', 'left', 'right'])
        for thisKey in keys:
            if thisKey in ['1', 'left', 'num_1']:
                # trial_RT = timer.getTime()
                # trial_choice = 1  # take risk
                response_RT[i] = timer.getTime()
                response_choice[i] = 1  # take risk

            elif thisKey in ['2', 'right', 'num_2']:
                # trial_RT = timer.getTime()
                # trial_choice = 0  # take safe
                response_RT[i] = timer.getTime()
                response_choice[i] = 0  # take safe

            elif thisKey == 'escape':
                core.quit()  # abort experiment

            else:
                response_RT[i] = -1
                response_choice[i] = -1  # no response
        event.clearEvents()  # clear other (eg mouse) events - they clog the buffer

        # response_choice.append(trial_choice)
        #response_RT.append(trial_RT)

    return response_choice, response_RT


def generate_gamble_values(min_gain=10, max_gain=40, step_gain=2, min_loss=10, max_loss=40, step_loss=2):
    """
    Creates a matrix of all combinations of gains and losses within given range (min,max,step) and randomly shuffles them
    min_gain/loss: int, minimum value for gain/loss
    max_gain: int, maximum value for gain/loss
    step_gain: int, step by which it should increase gain/loss
    :return:
    gamble_values: array of all possible combinations of gains and losses (pairs [gain,loss])
    indices_invers: array of indices to remap back the choices/selections to the pairs gain/loss

    Use sorted_choice = choice[indices_invers].reshape(len(lossvalues),len(gainvalues)) to get the 2D array back

    Example:
    >>> generate_gamble_values(min_gain=6,max_gain=10,step_gain=2,min_loss=4,max_loss=8,step_loss=1)[0]
    [[ 6  7], [ 6  5], [ 6  8], [10  6], [10  7], [10  8], [ 6  4], [ 8  6], [ 8  7], [ 8  4], [10  4], [ 8  8], [10  5], [ 6  6], [ 8  5]]


    """
    # Initialize parameters
    gainvalues = np.arange(min_gain, max_gain + step_gain, step_gain)
    lossvalues = np.arange(max_loss, min_loss - step_loss, -step_loss)

    gains = np.tile(gainvalues, len(lossvalues))  # repeat matrix
    losses = np.repeat(lossvalues, len(gainvalues))  # repeat each element
    indices = np.arange(len(gainvalues) * len(lossvalues))  # get all indices
    np.random.shuffle(indices)  # randomize their order
    indices_invers = np.argsort(indices)  # CRUCIAL: argsort gives me the inverse of the indices, it returns indices\
    # so that I can then remap back the choices to the values/places where they belong
    gamble_values = np.asarray([(gains[i], losses[i]) for i in indices])  # generate randomly all pairs of gains/losses

    return gamble_values, indices_invers


def makeDir(dirname):
    import os
    if not os.path.isdir(dirname):
        os.makedirs(dirname)


# Check existence
expinfo = experimentInfo()  # with while not I can check input, not done TODO
if expinfo == 'Cancelled':
    print('User cancelled')
    core.quit()

data_path = 'subj' + expinfo['Subject ID'] + "_" + expinfo['date']
if os.path.exists(data_path):
    sys.exit("Data path " + data_path + " already exists!")
else:
    makeDir(data_path)

# start screen
win = visual.Window(
    size=screen_size,
    units="pix",
    fullscr=False,
    color=gray
)

####################
#    Instructions
####################

instructions = visual.TextStim(
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

event.waitKeys()

instructions_example = visual.TextStim(
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

instructions_spacebar = visual.TextStim(
    win=win,
    color=black,
    pos=(0, -np.floor(screen_size[1] / 3))
)

instructions_spacebar.text = """Press spacebar to continue."""
instructions_spacebar.size = 0.8
instructions_spacebar.draw()

y_pos_example = -np.floor(screen_size[1] / 6)
show_safe_circle(win, y_pos=y_pos_example, y_pos_text=y_pos_example)
show_gain_halfcircle(win, gain_value=10, y_pos=y_pos_example, y_pos_text=y_pos_example)
show_loss_halfcircle(win, loss_value=4, y_pos=y_pos_example, y_pos_text=y_pos_example)
win.flip()

event.waitKeys()

####################
#    Experiment
####################

experimental_values, order_values = generate_gamble_values(min_gain=2, max_gain=4, min_loss=2, max_loss=4)

choice, RT = runTrials(win, experimental_values)

instructions_spacebar.text = """Press spacebar to end."""
instructions_spacebar.draw()
win.flip()
event.waitKeys()

print('choice: ', choice)
print('RT: ', RT)

# save everything
expinfo['Order of values'] = experimental_values
expinfo['Reverse indices'] = order_values
expinfo['Choice'] = choice
expinfo['Choices sorted'] = choice[order_values]
expinfo['RT'] = RT
print(expinfo)

# with open(data_path+'/experimental_Data', 'w') as csvfile:
#     writer = csv.DictWriter(csvfile, fieldnames=expinfo.keys())
#     writer.writeheader()
#     for data in expinfo:
#         writer.writerow(data)

with open(data_path + '/experimental_Data', 'w') as csv_file:
    writer = csv.writer(csv_file)
    for key, value in expinfo.items():
        writer.writerow([key, value])

# with open('dict.csv') as csv_file:
#     reader = csv.reader(csv_file)
#     mydict = dict(reader)
win.close()

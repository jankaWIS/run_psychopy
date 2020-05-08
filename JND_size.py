"""measure your JND in orientation using a staircase method"""
import os
from datetime import date

import numpy as np
from psychopy import core, monitors  # , visual, gui, data, event
from psychopy import event
from psychopy import visual


# Functions
def get_response(response_RT, response_choice, response_correct, err, correct, first_error):
    # https://discourse.psychopy.org/t/numbers-on-the-right-side-of-the-keyboard-are-not-working/1728/3
    keys = event.waitKeys(maxWait=time_limit, keyList=['escape', '1', '2', 'num_1', 'num_2', 'left', 'right'])
    # returns None if no-response, else returns list

    if keys is None:
        # response_RT[trial] = -1
        # response_choice[trial] = -1  # no response
        response_RT.append(-1)
        response_choice.append(-1)
        response_correct.append(-1)

    elif any(elem in ['1', 'left', 'num_1'] for elem in keys):
        # response_RT[i] = trialClock.getTime()
        # response_choice[i] = 1  # Correct
        # Correct
        response_RT.append(trialClock.getTime())
        response_choice.append(1)
        response_correct.append(1)
        correct += 1

    elif any(elem in ['2', 'right', 'num_2'] for elem in keys):
        # response_RT[i] = timer.getTime()
        # response_choice[i] = 0
        # Incorrect
        response_RT.append(trialClock.getTime())
        response_choice.append(1)
        response_correct.append(1)
        err += 1
        if not first_error:
            first_error = 1

    elif 'escape' in keys:
        core.quit()  # abort experiment
    event.clearEvents()  # clear other (eg mouse) events - they clog the buffer


# Colours
gray = '#7F7F7F'  # 127 127 127 # '#969696'
black = '#000000'
white = '#FFFFFF'
red = '#FF0000'
green = '#00FF00'

# Define variables
screen_sizes = []
for mon in monitors.getAllMonitors():
    print(mon, monitors.Monitor(mon).getSizePix())
    screen_sizes.append(monitors.Monitor(mon).getSizePix())

screen_size = screen_sizes[0]

path2stim = './stimuli/croped_images_360x360_px/'

subj = 'test'
refSize = 360  # 7.35 #360 #px #screen_size//4 # 73.5 mm
init_ratio = 0.3  # 30 % bigger/smaller (for smaller take - sign)
dif = int(np.round(refSize * init_ratio))  # starting difference between Ref and Test
time_limit = 3  # max RT in sec

# Randomly choose stimuli
stim_name = np.random.choice(os.listdir(path2stim))
stim_path = os.path.join(path2stim, stim_name)

game_on = True
ratio = 2  # how far they are from each other
err = 0  # cumulative error count
trial = 0
prev = 1
first_error = 0
testSize_arr = [2 * [refSize + dif]]  # create a list of all test sizes throughout the experiment
testSize = testSize_arr[0]

# Generate array of ISI for 500 ms
isi = np.zeros(200) + 0.5
order = np.zeros(200)
response_RT = []
response_choice = []
response_correct = []

# make a text file to save data
expInfo = {'observer': subj, 'refSize': 0}
expInfo['dateStr'] = date.today().strftime("%d-%m-%Y")  # data.getDateStr()  # add the current time

fileName = expInfo['observer'] + '_' + expInfo['dateStr']
dataFile = open(fileName + '.csv', 'w')  # a simple text file with 'comma-separated-values'
dataFile.write('targetSide,oriIncrement,correct\n')

# start screen
win = visual.Window(
    size=screen_size,
    units="pix",
    fullscr=False,
    color=gray
)

# Create reference stimuli
ref_stim = visual.ImageStim(
    win=win,
    image=stim_path,
    units="pix",
    size=refSize
)

# Define fixation cross
fixation = visual.GratingStim(win, color=black,
                              tex=None, mask='cross', size=refSize // 10)

asterisk = visual.GratingStim(win, color=green,
                              tex=None, mask='raisedCos', size=refSize // 10)

# Start global time
globalClock = core.Clock()

# display instructions and wait
message1 = visual.TextStim(win, color=black, pos=(0, 0),
                           text="""
     Your goal is to identify which of the stimuli is bigger.
    Press left arrow or "1" if you think the first stimuli is bigger and
    right arrow or 2 if the second stimuli is the bigger.  
    """)
message2 = visual.TextStim(win, color=black, pos=(0, -np.floor(screen_size[1] / 3)),
                           text='Hit a key when ready.')

message1.draw()
message2.draw()
# show drawn text
win.flip()
#  pause until there's a keypress
event.waitKeys()

while game_on:
    correct = 0  # count correct answers in the trial
    thisKey = None

    # Create test stimuli
    test_stim = visual.ImageStim(
        win=win,
        image=stim_path,
        units="pix",
        size=testSize
    )

    # test order
    if np.random.rand() < 1:  # 0.5:
        # BiggerSmaller, ie Test(2) followed by Ref(1)
        order[trial] = 2

        # Show sequence, Test(2) Ref(1)
        trialClock = core.Clock()

        test_stim.draw()
        win.flip()
        core.wait(isi[trial])

        win.flip()  # show gray screen
        core.wait(isi[trial])

        ref_stim.draw()
        win.flip()
        core.wait(isi[trial])

        asterisk.draw()
        win.flip()

        # get response
        # https://discourse.psychopy.org/t/numbers-on-the-right-side-of-the-keyboard-are-not-working/1728/3
        keys = event.waitKeys(maxWait=time_limit, keyList=['escape', '1', '2', 'num_1', 'num_2', 'left', 'right'])
        # returns None if no-response, else returns list

        if keys is None:
            # response_RT[trial] = -1
            # response_choice[trial] = -1  # no response
            response_RT.append(-1)
            response_choice.append(-1)
            response_correct.append(-1)

        elif any(elem in ['1', 'left', 'num_1'] for elem in keys):
            # response_RT[i] = trialClock.getTime()
            # response_choice[i] = 1  # Correct
            # Correct
            response_RT.append(trialClock.getTime())
            response_choice.append(1)
            response_correct.append(1)
            correct += 1

        elif any(elem in ['2', 'right', 'num_2'] for elem in keys):
            # response_RT[i] = timer.getTime()
            # response_choice[i] = 0
            # Incorrect
            response_RT.append(trialClock.getTime())
            response_choice.append(2)
            response_correct.append(0)
            err += 1
            if not first_error:
                first_error = 1

        elif 'escape' in keys:
            core.quit()  # abort experiment
        event.clearEvents()  # clear other (eg mouse) events - they clog the buffer

        trial += 1
        fixation.draw()
        win.flip()
        core.wait(1)

        # Check the other order of the pair, SB
        order[trial] = 1

        # Show sequence, Ref(1) Test(2)
        trialClock = core.Clock()

        ref_stim.draw()
        win.flip()
        core.wait(isi[trial])

        win.flip()  # show gray screen
        core.wait(isi[trial])

        test_stim.draw()
        win.flip()
        core.wait(isi[trial])

        asterisk.draw()
        win.flip()

        # get response
        # https://discourse.psychopy.org/t/numbers-on-the-right-side-of-the-keyboard-are-not-working/1728/3
        keys = event.waitKeys(maxWait=time_limit, keyList=['escape', '1', '2', 'num_1', 'num_2', 'left', 'right'])
        # returns None if no-response, else returns list

        if keys is None:
            # response_RT[trial] = -1
            # response_choice[trial] = -1  # no response
            response_RT.append(-1)
            response_choice.append(-1)
            response_correct.append(-1)

        elif any(elem in ['2', 'right', 'num_2'] for elem in keys):
            # response_RT[i] = trialClock.getTime()
            # response_choice[i] = 1  # Correct
            # Correct
            response_RT.append(trialClock.getTime())
            response_choice.append(2)
            response_correct.append(1)
            correct += 1

        elif any(elem in ['1', 'left', 'num_1'] for elem in keys):
            # response_RT[i] = timer.getTime()
            # response_choice[i] = 0
            # Incorrect
            response_RT.append(trialClock.getTime())
            response_choice.append(1)
            response_correct.append(0)
            err += 1
            if not first_error:
                first_error = 1

        elif 'escape' in keys:
            core.quit()  # abort experiment
        event.clearEvents()  # clear other (eg mouse) events - they clog the buffer

        trial += 1
        fixation.draw()
        win.flip()
        core.wait(1)


    else:
        # SmallerBigger
        pass

    # Change size
    if correct == 2:  # decrease
        JND = dif  # TODO

        # Testing stopping criteria
        if err >= 6:
            game_on = False
            break

        # Decrase the step size
        if not prev and (ratio * 0.9) < 1:
            ratio *= 0.9

        dif //= ratio  # decrease step
        testSize = refSize + dif  # decrease the difference
        testSize_arr.append(2 * [testSize])
        prev = 1

    else:
        # Decrease the difference
        if prev and (ratio * 0.9) < 1:
            ratio *= 0.9

        # Decrease the difference, take the maximum of absolute value of the difference if the dif is
        # bigger than initial ratio
        dif = int(np.sign(init_ratio) * np.round(min(np.abs(dif * ratio), np.abs(refSize * init_ratio))))
        testSize = refSize + dif
        testSize_arr.append(2 * [testSize])

# abort experiment
core.quit()

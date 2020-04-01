import numpy as np
from psychopy import core, visual, event

# create window and stimuli
win = visual.Window([800, 600], allowGUI=True,
                    monitor='testMonitor', units='deg')

fixation = visual.GratingStim(win, color=-1, colorSpace='rgb',
                              tex=None, mask='circle', size=0.2)
# and some handy clocks to keep track of time
globalClock = core.Clock()
trialClock = core.Clock()

# display instructions and wait
message1 = visual.TextStim(win, pos=[0, +3], text='Hit a key when ready.')
message2 = visual.TextStim(win, pos=[0, -3],
                           text="Then press left or right if even or odd")
message1.draw()
message2.draw()
fixation.draw()
win.flip()  # to show our newly drawn 'stimuli'
# pause until there's a keypress
event.waitKeys()

test_seq = [np.random.randint(0, 10) for i in range(10)]
response = []

screen_text = visual.TextStim(win, text=None,
                              alignHoriz="center", color='black')


def runTrials(trial_sequence):
    """
    Run experiment, receives trial sequence and stimuli, returns choice and reaction times
    :param trial_sequence:
    :return:
    """
    response_choice = []
    response_RT = []
    timer = core.Clock()
    # targetFrames = int(self.frameR * .25)
    # itiFrames = int(self.frameR * .9)
    for trial in trial_sequence:
        timer.reset()
        # for frame in range(self.targetFrames):
        #     visualTarget = trial['Stimulus']
        #     self.presentStimulus('text', visualTarget)
        # for frame in range(self.itiFrames):
        #     self.presentStimulus('image', self.mask)

        keys = event.getKeys(keyList=['escape', '1', '2', 'left', 'right'])
        for thisKey in keys:
            if thisKey in ['1', 'left']:
                trial_RT = timer.getTime()
                trial_choice = 1  # take risk

            elif thisKey in ['2', 'right']:
                trial_RT = timer.getTime()
                trial_choice = 0  # take safe

            elif thisKey == 'escape':
                core.quit()  # abort experiment
        event.clearEvents()  # clear other (eg mouse) events - they clog the buffer

        response_choice.append(trial_choice)
        response_RT.append(trial_RT)

    return response_choice, response_RT


for thisIncrement in test_seq:  # will continue the staircase until it terminates!
    # set location of stimuli
    screen_text.setText(str(thisIncrement))
    screen_text.draw()
    fixation.draw()
    win.flip()

    # get response
    thisResp = None
    while thisResp == None:
        allKeys = event.waitKeys()
        for thisKey in allKeys:
            if thisKey == 'left':
                thisResp = 1  # correct

            elif thisKey == 'right':
                thisResp = 0  # correct

            elif thisKey in ['q', 'escape']:
                core.quit()  # abort experiment
        event.clearEvents()  # clear other (eg mouse) events - they clog the buffer

    response.append(thisResp)
    # wait 500ms; but use a loop of x frames for more accurate timing
    core.wait(0.5)

core.wait(1)

print(response)
print(test_seq)
win.close()
core.quit()

# while timer.getTime() <= 10:
#     # max_time = core.CountdownTimer(5)
#     # while max_time.getTime() > 0:
#     # https://discourse.psychopy.org/t/numbers-on-the-right-side-of-the-keyboard-are-not-working/1728/3
#     keys = event.getKeys(keyList=['escape', '1', '2', 'num_1', 'num_2', 'left', 'right'])
#     for thisKey in keys:
#         if thisKey in ['1', 'left', 'num_1']:
#             # trial_RT = timer.getTime()
#             # trial_choice = 1  # take risk
#             response_RT[i] = timer.getTime()
#             response_choice[i] = 1  # take risk
#             break
#
#         elif thisKey in ['2', 'right', 'num_2']:
#             # trial_RT = timer.getTime()
#             # trial_choice = 0  # take safe
#             response_RT[i] = timer.getTime()
#             response_choice[i] = 0  # take safe
#             break
#
#         elif thisKey == 'escape':
#             core.quit()  # abort experiment
#     break  # break from while loop
#
# if keys is None:
#     response_RT[i] = -1
#     response_choice[i] = -1  # no response
# event.clearEvents()  # clear other (eg mouse) events - they clog the buffer

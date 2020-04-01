# https://www.djmannion.net/psych_programming/vision/tog_ac/tog_ac.html
import os
import sys
from datetime import date

import numpy as np
import psychopy.gui
from psychopy import gui


# https://github.com/marsja/psypy/blob/master/SART/SART.py
def experimentInfo():
    expName = u'Risk Aversion'
    expInfo = {'Subject Id': '', 'Age': '',
               'Sex': ['Male', 'Female']}
    expInfo[u'date'] = date.today().strftime("%d-%m-%Y")
    infoDlg = gui.DlgFromDict(dictionary=expInfo,
                              title=expName, fixed=None)
    # datafile = u'Data' + os.path.sep + u'DATA_SART.csv'
    if infoDlg.OK:
        return expInfo
    else:
        return 'Cancelled'


x = experimentInfo()
print(x)

# Get input from the user
gui = psychopy.gui.Dlg()

gui.addField("Subject ID:")
gui.addField("Age:")
gui.addField("Gender:")

gui.show()

subj_id = gui.data[0]
age = gui.data[1]
gender = gui.data[2]

date = date.today().strftime("%d-%m-%Y")
#str(date.today()) # yyyy-mm-dd

data_path = 'subj'+subj_id + "_" + date + ".txt" #".tsv"

if os.path.exists(data_path):
    sys.exit("Data path " + data_path + " already exists!")

# Setup
exp_data = []

# save
np.savetxt(data_path, exp_data, delimiter="\t")

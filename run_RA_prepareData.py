import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns


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


# print(generate_gamble_values(min_gain=6,max_gain=10,step_gain=2,min_loss=4,max_loss=8,step_loss=1)[0])
min_gain = 10
max_gain = 60
step_gain = 2
min_loss = 10
max_loss = 40
step_loss = 2

# Initialize parameters
gainvalues = np.arange(min_gain, max_gain + step_gain, step_gain)
lossvalues = np.arange(max_loss, min_loss - step_loss, -step_loss)

gains = np.tile(gainvalues, len(lossvalues))  # repeat matrix
losses = np.repeat(lossvalues, len(gainvalues))  # repeat each element
indices = np.arange(len(gainvalues) * len(lossvalues))
np.random.shuffle(indices)
indices_invers = np.argsort(indices)
gamble_values = np.asarray([(gains[i], losses[i]) for i in indices])

# print(gamble_values)
sns.heatmap(gains[indices].reshape(len(gainvalues), len(lossvalues)))
plt.show()

# simulate
choice = np.zeros(len(gainvalues) * len(lossvalues))

for i, gamble in enumerate(gamble_values):
    print(gamble[0], gamble[1])
    # if gamble[0]>35:
    #     choice[i]=1
    #     print('yes, ', gamble[0])
    # else:
    #     choice[i]=0
    choice[i] = gamble[0] + gamble[1]
    # print(choice[i])

sorted_choice = choice[indices_invers]

sns.heatmap(sorted_choice.reshape(len(lossvalues), len(gainvalues)))
# sns.heatmap(choice.reshape(len(gainvalues), len(lossvalues)))
plt.show()

# Solution by Ido
gainvalues = np.arange(min_gain, max_gain + step_gain, step_gain)
lossvalues = np.arange(max_loss, min_loss - step_loss, -step_loss)
# vals = length(GV);
safe = 5  # value of constant gain for choice paradigm test

randchk = np.zeros((len(gainvalues), len(lossvalues)))
choice = np.zeros((len(gainvalues), len(lossvalues)))
# riskSafeChoice = zeros(vals,vals);

for ii_ind in range(len(gainvalues) * len(lossvalues)):
    # WaitSecs(0.5);
    Gp = np.random.randint(len(gainvalues))
    Lp = np.random.randint(len(lossvalues))
    while randchk[Gp, Lp] != 0:
        Gp = np.random.randint(len(gainvalues))
        Lp = np.random.randint(len(lossvalues))

    randchk[Gp, Lp] = 1
    choice[Gp, Lp] = gainvalues[Gp]
# LossAveOrder(ii_ind,:)=[GV(Gp) LV(Lp)]
sns.heatmap(choice.reshape(len(gainvalues), len(lossvalues)))
plt.show()

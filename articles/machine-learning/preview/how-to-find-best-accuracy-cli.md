# How to find runs with best accuracy and lowest duration
Given multiple runs, one use case is to find runs with best accuracy. One approach is to use CLI with a JMESPATH query.
In the following example, four runs are created with accuracy values of 0, 0.98, 1, and 1. Runs are filtered if they are in the range [`MaxAccuracy-Threshold`, `MaxAccuracy`] where `Threshold = .03`.

## Sample Data
If you don't have existing run histories with `Accuracy` value, the steps below will generate run histories for querying:

First, create a python file in the workbench, name it `log_accuracy.py`, and paste in the following code:
```python
from azureml.logging import get_azureml_logger

logger = get_azureml_logger()

accuracy_value = 0.5

if len(sys.argv) > 1:
     accuracy_value = float(sys.argv[1])

logger.log("Accuracy", accuracy_value)
```

Next, create a file `run.py`, and paste in the following code:
```python
import os

accuracy_values = [0, 0.98, 1.0, 1.0]
for value in accuracy_values:
    os.system('az ml experiment submit -c local ./log_accuracy.py {}'.format(value))
```

Lastly, open command line through workbench. Then run command `python run.py` to submit experiments. After script finishes, you should see four more runs under `Run History`.

## Querying the Run History
The first command finds the max accuracy value.

    az ml history list --query '@[?Accuracy != null] | max_by(@, &Accuracy).Accuracy'

Using this accuracy value (`1`) and threshold value (`0.03`), the second command will filter runs using `Accuracy` then sort runs by `duration` ascending.

    az ml history list --query '@[?Accuracy >= sum(`[1, -0.03]`)] | sort_by(@, &duration)'

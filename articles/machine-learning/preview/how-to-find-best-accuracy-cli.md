---
title: How to find runs with best accuracy and lowest duration | Microsoft Docs
description: An end-to-end use case to find best accuracy through CLI using Azure Machine Learning Workbench
services: machine-learning
author: totekp
ms.author: kefzhou
manager: akannava
ms.reviewer: akannava, haining, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/29/2017
---
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
    
If you use powershell, the code below will use local variables to store threshold and max accuracy.

     $threshold = 0.03
     $max_accuracy_value = az ml history list --query '@[?Accuracy != null] | max_by(@, &Accuracy).Accuracy'
     az ml history list --query '@[?Accuracy >= sum(`[{0}, -{1}]`)] | sort_by(@, &duration)' -f $max_accuracy_value, $threshold


## Next Steps
- For more information on logging, see [How to Use Run History and Model Metrics in Azure Machine Learning Workbench](how-to-use-run-history-model-metrics.md).    

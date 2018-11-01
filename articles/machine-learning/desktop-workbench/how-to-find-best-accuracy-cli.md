---
title: Find runs with the best accuracy and lowest duration in Azure Machine Learning Workbench | Microsoft Docs
description: An end-to-end use case to find best accuracy through CLI by using Azure Machine Learning Workbench
services: machine-learning
author: totekp
ms.author: kefzhou
manager: akannava
ms.reviewer: akannava, haining, mldocs, jmartens, jasonwhowell
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 09/29/2017

ROBOTS: NOINDEX
---
# Find runs with the best accuracy and lowest duration
Given multiple runs, one use case is to find runs with the best accuracy. One approach is to use the command-line interface (CLI) with a [JMESPath](http://jmespath.org/) query. For more information on how to use JMESPath in the Azure CLI, see [Use JMESPath queries with Azure CLI](https://docs.microsoft.com/cli/azure/query-azure-cli?view=azure-cli-latest). In the following example, four runs are created with accuracy values of 0, 0.98, 1, and 1. Runs are filtered if they are in the range `[MaxAccuracy-Threshold, MaxAccuracy]` where `Threshold = .03`.

## Sample data
If you don't have existing runs with an `Accuracy` value, the following steps generate runs for querying.

First, create a Python file in the Azure Machine Learning Workbench, name it `log_accuracy.py`, and paste in the following code:
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

Lastly, open the CLI through Workbench and run the command `python run.py` to submit four experiments. After the script finishes, you should see four more runs in the `Run History` tab.

## Query the run history
The first command finds the max accuracy value.
```powershell
az ml history list --query '@[?Accuracy != null] | max_by(@, &Accuracy).Accuracy'
```

Using this max accuracy value of `1` and a threshold value of `0.03`, the second command filters runs by using `Accuracy` and then sorts runs by `duration` ascending.
```powershell
az ml history list --query '@[?Accuracy >= sum(`[1, -0.03]`)] | sort_by(@, &duration)'
```
> [!NOTE]
> If you want a strict upper-bound check, the query format is ``@[?Accuracy >= sum(`[$max_accuracy_value, -$threshold]`) && Accuracy <= `$max_accuracy_value`]``

If you use PowerShell, the following code uses local variables to store threshold and max accuracy:
```powershell
$threshold = 0.03
$max_accuracy_value = az ml history list --query '@[?Accuracy != null] | max_by(@, &Accuracy).Accuracy'
$find_runs_query = '@[?Accuracy >= sum(`[{0}, -{1}]`)] | sort_by(@, &duration)' -f $max_accuracy_value, $threshold
az ml history list --query $find_runs_query
```

## Next steps
For more information on logging, see [How to use run history and model metrics in Azure Machine Learning Workbench](how-to-use-run-history-model-metrics.md).    

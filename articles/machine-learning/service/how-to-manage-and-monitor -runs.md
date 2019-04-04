---
title: Manage and monitor runs
titleSuffix: Azure Machine Learning service
description: Learn how to manage and monitor training runs
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: roastala
author: rastala
manager: cgronlun
ms.reviewer: nibaccam
ms.date: 3/25/2019

---

# Manage and monitor runs with Azure Machine Learning

The Azure Machine Learning service provides various methods to monitor, organize, and manage your runs for training and experimentation.

This how-to shows examples of the following tasks:

* [Monitor run performance](#monitor)
* [Create child runs](#children)
* [Cancel or fail runs](#cancel)
* [Tag and find runs](#tag)

## Prerequisites

You'll need the following:

* An Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

* An Azure Machine Learning service workspace. See [Create an Azure Machine Learning service workspace](https://docs.microsoft.com/azure/machine-learning/service/setup-create-workspace).

* The [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py) installed (version 1.0.21 or later). To install or update to the latest version of the SDK, go to the [Install/update the SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py) page. 

    To check your version of the Azure Machine Learning SDK use the following code.

    ```Python
    print(azureml.core.VERSION)
    ```

<a name="monitor"></a>

## Start, status, and complete a run 

Before you start a run, import the necessary packages

```Python
import azureml.core
from azureml.core import Workspace, Experiment, Run
from azureml.core import ScriptRunConfig
```

Initiate a run  with `start_logging()`.

```Python
ws = Workspace.from_config()
exp = Experiment(workspace=ws, name="explore-runs")
notebook_run = exp.start_logging()

notebook_run.log(name="message", value="Hello from run!")
```

Get the status of the run with `get_status()`.

```Python
print(notebook_run.get_status())
```

To get additional details about the run use `get_details()`.

```Python
notebook_run.get_details()
```

When your run finishes successfully, use the `complete()` method to mark it as complete.

```Python
notebook_run.complete()
print(notebook_run.get_status())
```

You can also use Python's `with...as` pattern. In this context, the run will automatically mark itself as complete when the run is out of scope. This way you don't need to manually mark the run as complete.

```Python
with exp.start_logging() as notebook_run:
    notebook_run.log(name="message", value="Hello from run!")
    print("Is it still running?",notebook_run.get_status())
    
print("Has it completed?",notebook_run.get_status())
```

<a name="children"></a>

## Create child runs

You can use child runs to group together related runs, for example for different hyperparameter tuning iterations.

This code example uses the `hello_with_children.py` script to create a batch of 5 child runs from within a submitted run.

```Python
!more hello_with_children.py
run_config = ScriptRunConfig(source_directory='.', script='hello_with_children.py')

local_script_run = exp.submit(run_config)
local_script_run.wait_for_completion(show_output=True)
print(local_script_run.get_status())

with exp.start_logging() as parent_run:
    for c,count in enumerate(range(5)):
        with parent_run.child_run() as child:
            child.log(name="Hello from child run", value=c)
```

> [!NOTE] Child runs complete automatically as they move out of scope

You can also start child runs one by one, but because each creation results in a network call it's less efficient than submitting a batch of runs.

 Use the `get_children()` method to query the child runs of a specific parent,.

```Python
list(parent_run.get_children())
```

<a name="cancel"></a>

## Cancel and Fail runs

Stop a run during execution, for example if there is a long running iteration that isn't converging, you can use the `cancel()` method.

```Python
run_config = ScriptRunConfig(source_directory='.', script='hello_with_delay.py')

local_script_run = exp.submit(run_config)
print("Did the run start?",local_script_run.get_status())

local_script_run.cancel()
print("Did the run cancel?",local_script_run.get_status())
```

With the `fail()` method, you can mark a run as failed. This is useful in scenarios when the run finishes, but contains an error like the incorrect training script was used.

```Python
local_script_run = exp.submit(run_config)
local_script_run.fail()

print(local_script_run.get_status())
```

<a name="tag"></a>

## Tag and find runs

In Azure Machine Learning service, you can use properties and tags to help organize and query your runs for important information.

### Add properties and tags

For example, the following code adds the "author" property to the run:

```Python
local_script_run.add_properties({"author":"azureml-user"})
print(local_script_run.get_properties())
```

Properties are immutable, which is useful as a permanent record for auditing purposes. The following code will result in an error, since we already assigned "azureml-user" as the "author" property in the preceding code.

```Python
try:
    local_script_run.add_properties({"author":"different-user"})
except Exception as e:
    print(e)
```

Whereas tags are changeable:

```Python
local_script_run.tag("quality", "great run")
print(local_script_run.get_tags())

local_script_run.tag("quality", "fantastic run")
print(local_script_run.get_tags())
```

You can also add a simple string tag. It appears in the tag dictionary with value of `None`

```Python
local_script_run.tag("worth another look")
print(local_script_run.get_tags())
```

### Query properties and tags
You can query runs within an experiment that match specific properties and tags.

```Python
list(exp.get_runs(properties={"author":"azureml-user"},tags={"quality":"fantastic run"}))
list(exp.get_runs(properties={"author":"azureml-user"},tags="worth another look"))
```

## Next steps

* To learn more about logging APIs, see the [logging API notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/logging-api/logging-api.ipynb)

* For additional information about managing runs, see the [manage runs notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training/manage-runs)

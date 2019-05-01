---
title: Start, monitor, and cancel training runs in Python
titleSuffix: Azure Machine Learning service
description: Learn how to start, set the status of, tag, and organize your machine-learning experiments. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: roastala
author: rastala
manager: cgronlun
ms.reviewer: nibaccam
ms.date: 04/05/2019

---

# Start, monitor, and cancel training runs in Python

The [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py) provides various methods to monitor, organize, and manage your runs for training and experimentation.

This article shows examples of the following tasks:

* Monitor run performance.
* Cancel or fail runs.
* Create child runs.
* Tag and find runs.

## Prerequisites

You'll need the following items:

* An Azure subscription. If you don’t have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](https://aka.ms/AMLFree) today.

* An [Azure Machine Learning service workspace](setup-create-workspace.md).

* The Azure Machine Learning SDK for Python (version 1.0.21 or later). To install or update to the latest version of the SDK, see [Install or update the SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py).

    To check your version of the Azure Machine Learning SDK, use the following code:

    ```Python
    print(azureml.core.VERSION)
    ```

## Start a run and its logging process

Set up your experiment by importing the [Workspace](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py), [Experiment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment.experiment?view=azure-ml-py), [Run](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py), and [ScriptRunConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.scriptrunconfig?view=azure-ml-py) classes from the [azureml.core](https://docs.microsoft.com/python/api/azureml-core/azureml.core?view=azure-ml-py) package.

```Python
import azureml.core
from azureml.core import Workspace, Experiment, Run
from azureml.core import ScriptRunConfig

ws = Workspace.from_config()
exp = Experiment(workspace=ws, name="explore-runs")
```

Start a run and its logging process with the [`start_logging()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment(class)?view=azure-ml-py#start-logging--args----kwargs-) method.

```Python
notebook_run = exp.start_logging()

notebook_run.log(name="message", value="Hello from run!")
```

## Monitor the status of a run

Get the status of a run with the [`get_status()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#get-status--) method.

```Python
print(notebook_run.get_status())
```

To get additional details about the run, use the [`get_details()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py#get-details--) method.

```Python
notebook_run.get_details()
```

When your run finishes successfully, use the [`complete()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#complete--set-status-true-) method to mark it as completed.

```Python
notebook_run.complete()
print(notebook_run.get_status())
```

If you use Python's `with...as` pattern, the run will automatically mark itself as completed when the run is out of scope. You don't need to manually mark the run as completed.

```Python
with exp.start_logging() as notebook_run:
    notebook_run.log(name="message", value="Hello from run!")
    print("Is it still running?",notebook_run.get_status())

print("Has it completed?",notebook_run.get_status())
```

## Cancel or fail runs

 If you notice a mistake or if your run is taking too long to finish, use the [`cancel()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#cancel--) method to stop the run before it finishes and mark it as canceled.

```Python
run_config = ScriptRunConfig(source_directory='.', script='hello_with_delay.py')

local_script_run = exp.submit(run_config)
print("Did the run start?",local_script_run.get_status())

local_script_run.cancel()
print("Did the run cancel?",local_script_run.get_status())
```

If your run finishes, but it contains an error (for example, the incorrect training script was used), you can use the [`fail()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#fail-error-details-none---set-status-true-) method to mark it as failed.

```Python
local_script_run = exp.submit(run_config)
local_script_run.fail()

print(local_script_run.get_status())
```

## Create child runs

Create child runs to group together related runs, such as for different hyperparameter-tuning iterations.

This code example uses the `hello_with_children.py` script to create a batch of five child runs from within a submitted run by using the [`child_run()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#child-run-name-none--run-id-none--outputs-none-) method:

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

> [!NOTE]
> As they move out of scope, child runs are automatically marked as completed.

You can also start child runs one by one, but because each creation results in a network call, it's less efficient than submitting a batch of runs.

To query the child runs of a specific parent, use the [`get_children()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#get-children-recursive-false--tags-none--properties-none--type-none--status-none---rehydrate-runs-true-) method.

```Python
list(parent_run.get_children())
```

## Tag and find runs

In Azure Machine Learning service, you can use properties and tags to help organize and query your runs for important information.

### Add properties and tags

To add searchable metadata to your runs, use the [`add_properties()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#add-properties-properties-) method. For example, the following code adds the `"author"` property to the run:

```Python
local_script_run.add_properties({"author":"azureml-user"})
print(local_script_run.get_properties())
```

Properties are immutable, so they create a permanent record for auditing purposes. The following code example results in an error, because we already added `"azureml-user"` as the `"author"` property value in the preceding code:

```Python
try:
    local_script_run.add_properties({"author":"different-user"})
except Exception as e:
    print(e)
```

Unlike properties, tags are changeable. To add searchable and meaningful information for consumers of your experiment, use the [`tag()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#tag-key--value-none-) method.

```Python
local_script_run.tag("quality", "great run")
print(local_script_run.get_tags())

local_script_run.tag("quality", "fantastic run")
print(local_script_run.get_tags())
```

You can also add simple string tags. When these tags appear in the tag dictionary, they have a value of `None`.

```Python
local_script_run.tag("worth another look")
print(local_script_run.get_tags())
```

### Query properties and tags

You can query runs within an experiment to return a list of runs that match specific properties and tags.

```Python
list(exp.get_runs(properties={"author":"azureml-user"},tags={"quality":"fantastic run"}))
list(exp.get_runs(properties={"author":"azureml-user"},tags="worth another look"))
```

## Example notebooks

The following notebooks demonstrate the concepts in this article:

* To learn more about the logging APIs, see the [logging API notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/logging-api/logging-api.ipynb).

* For more information about managing runs with the Azure Machine Learning SDK, see the [manage runs notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/training/manage-runs).

## Next steps

* To learn how to log metrics for your experiments, see [Log metrics during training runs](how-to-track-experiments.md).
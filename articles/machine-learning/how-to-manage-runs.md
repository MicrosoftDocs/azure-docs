---
title: Start, monitor, and cancel training runs in Python
titleSuffix: Azure Machine Learning
description: Learn how to start, set the status of, tag, and organize your machine-learning experiments.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: roastala
author: rastala
manager: cgronlun
ms.reviewer: nibaccam
ms.date: 01/09/2020
ms.custom: tracking-python
---

# Start, monitor, and cancel training runs in Python
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

The [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py), [Machine Learning CLI](reference-azure-machine-learning-cli.md), and [Azure Machine Learning studio](https://ml.azure.com) provide various methods to monitor, organize, and manage your runs for training and experimentation.

This article shows examples of the following tasks:

* Monitor run performance.
* Cancel or fail runs.
* Create child runs.
* Tag and find runs.

## Prerequisites

You'll need the following items:

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

* An [Azure Machine Learning workspace](how-to-manage-workspace.md).

* The Azure Machine Learning SDK for Python (version 1.0.21 or later). To install or update to the latest version of the SDK, see [Install or update the SDK](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py).

    To check your version of the Azure Machine Learning SDK, use the following code:

    ```python
    print(azureml.core.VERSION)
    ```

* The [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) and [CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).

## Start a run and its logging process

### Using the SDK

Set up your experiment by importing the [Workspace](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py), [Experiment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment.experiment?view=azure-ml-py), [Run](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py), and [ScriptRunConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.scriptrunconfig?view=azure-ml-py) classes from the [azureml.core](https://docs.microsoft.com/python/api/azureml-core/azureml.core?view=azure-ml-py) package.

```python
import azureml.core
from azureml.core import Workspace, Experiment, Run
from azureml.core import ScriptRunConfig

ws = Workspace.from_config()
exp = Experiment(workspace=ws, name="explore-runs")
```

Start a run and its logging process with the [`start_logging()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment(class)?view=azure-ml-py#start-logging--args----kwargs-) method.

```python
notebook_run = exp.start_logging()
notebook_run.log(name="message", value="Hello from run!")
```

### Using the CLI

To start a run of your experiment, use the following steps:

1. From a shell or command prompt, use the Azure CLI to authenticate to your Azure subscription:

    ```azurecli-interactive
    az login
    ```
    
    [!INCLUDE [select-subscription](../../includes/machine-learning-cli-subscription.md)] 

1. Attach a workspace configuration to the folder that contains your training script. Replace `myworkspace` with your Azure Machine Learning workspace. Replace `myresourcegroup` with the Azure resource group that contains your workspace:

    ```azurecli-interactive
    az ml folder attach -w myworkspace -g myresourcegroup
    ```

    This command creates a `.azureml` subdirectory that contains example runconfig and conda environment files. It also contains a `config.json` file that is used to communicate with your Azure Machine Learning workspace.

    For more information, see [az ml folder attach](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/folder?view=azure-cli-latest#ext-azure-cli-ml-az-ml-folder-attach).

2. To start the run, use the following command. When using this command, specify the name of the runconfig file (the text before \*.runconfig if you are looking at your file system) against the -c parameter.

    ```azurecli-interactive
    az ml run submit-script -c sklearn -e testexperiment train.py
    ```

    > [!TIP]
    > The `az ml folder attach` command created a `.azureml` subdirectory, which contains two example runconfig files.
    >
    > If you have a Python script that creates a run configuration object programmatically, you can use [RunConfig.save()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfiguration?view=azure-ml-py#save-path-none--name-none--separate-environment-yaml-false-) to save it as a runconfig file.
    >
    > For more example runconfig files, see [https://github.com/MicrosoftDocs/pipelines-azureml/](https://github.com/MicrosoftDocs/pipelines-azureml/).

    For more information, see [az ml run submit-script](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/run?view=azure-cli-latest#ext-azure-cli-ml-az-ml-run-submit-script).

### Using Azure Machine Learning studio

To start a submit a pipeline run in the designer (preview), use the following steps:

1. Set a default compute target for your pipeline.

1. Select **Run** at the top of the pipeline canvas.

1. Select an Experiment to group your pipeline runs.

## Monitor the status of a run

### Using the SDK

Get the status of a run with the [`get_status()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#get-status--) method.

```python
print(notebook_run.get_status())
```

To get the run ID, execution time, and additional details about the run, use the [`get_details()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py#get-details--) method.

```python
print(notebook_run.get_details())
```

When your run finishes successfully, use the [`complete()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#complete--set-status-true-) method to mark it as completed.

```python
notebook_run.complete()
print(notebook_run.get_status())
```

If you use Python's `with...as` design pattern, the run will automatically mark itself as completed when the run is out of scope. You don't need to manually mark the run as completed.

```python
with exp.start_logging() as notebook_run:
    notebook_run.log(name="message", value="Hello from run!")
    print(notebook_run.get_status())

print(notebook_run.get_status())
```

### Using the CLI

1. To view a list of runs for your experiment, use the following command. Replace `experiment` with the name of your experiment:

    ```azurecli-interactive
    az ml run list --experiment-name experiment
    ```

    This command returns a JSON document that lists information about runs for this experiment.

    For more information, see [az ml experiment list](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/experiment?view=azure-cli-latest#ext-azure-cli-ml-az-ml-experiment-list).

2. To view information on a specific run, use the following command. Replace `runid` with the ID of the run:

    ```azurecli-interactive
    az ml run show -r runid
    ```

    This command returns a JSON document that lists information about the run.

    For more information, see [az ml run show](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/run?view=azure-cli-latest#ext-azure-cli-ml-az-ml-run-show).


### Using Azure Machine Learning studio

To view the number of active runs for your experiment in the studio.

1. Navigate to the **Experiments** section.. 

1. Select an experiment.

    In the experiment page, you can see the number of active compute targets and the duration for each run. 

1. Select a specific run number.

1. In the **Logs** tab, you can find diagnostic and error logs for your pipeline run.


## Cancel or fail runs

If you notice a mistake or if your run is taking too long to finish, you can cancel the run.

### Using the SDK

To cancel a run using the SDK, use the [`cancel()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#cancel--) method:

```python
run_config = ScriptRunConfig(source_directory='.', script='hello_with_delay.py')
local_script_run = exp.submit(run_config)
print(local_script_run.get_status())

local_script_run.cancel()
print(local_script_run.get_status())
```

If your run finishes, but it contains an error (for example, the incorrect training script was used), you can use the [`fail()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)#fail-error-details-none--error-code-none---set-status-true-) method to mark it as failed.

```python
local_script_run = exp.submit(run_config)
local_script_run.fail()
print(local_script_run.get_status())
```

### Using the CLI

To cancel a run using the CLI, use the following command. Replace `runid` with the ID of the run

```azurecli-interactive
az ml run cancel -r runid -w workspace_name -e experiment_name
```

For more information, see [az ml run cancel](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/run?view=azure-cli-latest#ext-azure-cli-ml-az-ml-run-cancel).

### Using Azure Machine Learning studio

To cancel a run in the studio, using the following steps:

1. Go to the running pipeline in either the **Experiments** or **Pipelines** section. 

1. Select the pipeline run number you want to cancel.

1. In the toolbar, select **Cancel**


## Create child runs

Create child runs to group together related runs, such as for different hyperparameter-tuning iterations.

> [!NOTE]
> Child runs can only be created using the SDK.

This code example uses the `hello_with_children.py` script to create a batch of five child runs from within a submitted run by using the [`child_run()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#child-run-name-none--run-id-none--outputs-none-) method:

```python
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

To create many child runs efficiently, use the [`create_children()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run.run?view=azure-ml-py#create-children-count-none--tag-key-none--tag-values-none-) method. Because each creation results in a network call, 
creating a batch of runs is more efficient than creating them one by one.

### Submit child runs

Child runs can also be submitted from a parent run. This allows you to create hierarchies of parent and child runs. 

You may wish your child runs to use a different run configuration than the parent run. For instance, you might use a less-powerful, CPU-based configuration for the parent, while using GPU-based configurations for your children. Another common desire is to pass each child different arguments and data. To customize a child run, pass a `RunConfiguration` object to the child's `ScriptRunConfig` constructor. This code example, which would be part of the parent `ScriptRunConfig` object's script:

- Creates a `RunConfiguration` retrieving a named compute resource `"gpu-compute"`
- Iterates over different argument values to be passed to the children `ScriptRunConfig` objects
- Creates and submits a new child run, using the custom compute resource and argument
- Blocks until all of the child runs complete

```python
# parent.py
# This script controls the launching of child scripts
from azureml.core import Run, ScriptRunConfig, RunConfiguration

run_config_for_aml_compute = RunConfiguration()
run_config_for_aml_compute.target = "gpu-compute"
run_config_for_aml_compute.environment.docker.enabled = True 

run = Run.get_context()

child_args = ['Apple', 'Banana', 'Orange']
for arg in child_args: 
    run.log('Status', f'Launching {arg}')
    child_config = ScriptRunConfig(source_directory=".", script='child.py', arguments=['--fruit', arg], run_config = run_config_for_aml_compute)
    # Starts the run asynchronously
    run.submit_child(child_config)

# Experiment will "complete" successfully at this point. 
# Instead of returning immediately, block until child runs complete

for child in run.get_children():
    child.wait_for_completion()
```

To create many child runs with identical configurations, arguments, and inputs efficiently, use the [`create_children()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run.run?view=azure-ml-py#create-children-count-none--tag-key-none--tag-values-none-) method. Because each creation results in a network call, creating a batch of runs is more efficient than creating them one by one.

Within a child run, you can view the parent run ID:

```python
## In child run script
child_run = Run.get_context()
child_run.parent.id
```

### Query child runs

To query the child runs of a specific parent, use the [`get_children()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#get-children-recursive-false--tags-none--properties-none--type-none--status-none---rehydrate-runs-true-) method. 
The ``recursive = True`` argument allows you to query a nested tree of children and grandchildren.

```python
print(parent_run.get_children())
```

## Tag and find runs

In Azure Machine Learning, you can use properties and tags to help organize and query your runs for important information.

### Add properties and tags

#### Using the SDK

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

Unlike properties, tags are mutable. To add searchable and meaningful information for consumers of your experiment, use the [`tag()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#tag-key--value-none-) method.

```Python
local_script_run.tag("quality", "great run")
print(local_script_run.get_tags())

local_script_run.tag("quality", "fantastic run")
print(local_script_run.get_tags())
```

You can also add simple string tags. When these tags appear in the tag dictionary as keys, they have a value of `None`.

```Python
local_script_run.tag("worth another look")
print(local_script_run.get_tags())
```

#### Using the CLI

> [!NOTE]
> Using the CLI, you can only add or update tags.

To add or update a tag, use the following command:

```azurecli-interactive
az ml run update -r runid --add-tag quality='fantastic run'
```

For more information, see [az ml run update](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/run?view=azure-cli-latest#ext-azure-cli-ml-az-ml-run-update).

### Query properties and tags

You can query runs within an experiment to return a list of runs that match specific properties and tags.

#### Using the SDK

```Python
list(exp.get_runs(properties={"author":"azureml-user"},tags={"quality":"fantastic run"}))
list(exp.get_runs(properties={"author":"azureml-user"},tags="worth another look"))
```

#### Using the CLI

The Azure CLI supports [JMESPath](http://jmespath.org) queries, which can be used to filter runs based on properties and tags. To use a JMESPath query with the Azure CLI, specify it with the `--query` parameter. The following examples show basic queries using properties and tags:

```azurecli-interactive
# list runs where the author property = 'azureml-user'
az ml run list --experiment-name experiment [?properties.author=='azureml-user']
# list runs where the tag contains a key that starts with 'worth another look'
az ml run list --experiment-name experiment [?tags.keys(@)[?starts_with(@, 'worth another look')]]
# list runs where the author property = 'azureml-user' and the 'quality' tag starts with 'fantastic run'
az ml run list --experiment-name experiment [?properties.author=='azureml-user' && tags.quality=='fantastic run']
```

For more information on querying Azure CLI results, see [Query Azure CLI command output](https://docs.microsoft.com/cli/azure/query-azure-cli?view=azure-cli-latest).

### Using Azure Machine Learning studio

1. Navigate to the **Pipelines** section.

1. Use the search bar to filter pipelines using tags, descriptions, experiment names, and submitter name.

## Example notebooks

The following notebooks demonstrate the concepts in this article:

* To learn more about the logging APIs, see the [logging API notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/track-and-monitor-experiments/logging-api/logging-api.ipynb).

* For more information about managing runs with the Azure Machine Learning SDK, see the [manage runs notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/track-and-monitor-experiments/manage-runs/manage-runs.ipynb).

## Next steps

* To learn how to log metrics for your experiments, see [Log metrics during training runs](how-to-track-experiments.md).
* To learn how to monitor resources and logs from Azure Machine Learning, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).

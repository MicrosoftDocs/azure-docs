---
title: "Tutorial: Hello world"
titleSuffix: Azure Machine Learning
description: Part 1 of the Azure ML Get Started series shows how to  submit a trivial "hello world" python script to the cloud.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: aminsaied
ms.author: amsaied
ms.reviewer: sgilley
ms.date: 09/09/2020
ms.custom: devx-track-python
---

# Tutorial: Hello world

In this tutorial, you will see how to submit a trivial "hello world" python script to the cloud. By the end of this tutorial you can:

- Execute python code in the cloud with the AzureML Python SDK
- Switch between debugging locally on (say) your laptop, and submitting remote runs
- Use the AzureML Studio to monitor and record runs

This tutorial introduces you to the core AzureML concepts needed to run your code in the cloud:

> [!div class="checklist"]
> - Control plane vs data plane
> - [Workspace](https://docs.microsoft.com/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py&preserve-view=true)
> - [Experiment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment.experiment?view=azure-ml-py&preserve-view=true)
> - [Run](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py&preserve-view=true)
> - [ScriptRunConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.scriptrunconfig?view=azure-ml-py&preserve-view=true)
> - [ComputeTarget](https://docs.microsoft.com/python/api/azureml-core/azureml.core.computetarget?view=azure-ml-py&preserve-view=true)

## Prerequisites

- Complete the setup on your [local computer](tutorial-1st-experiment-sdk-setup-local.md) or to use a [compute instance](tutorial-1st-experiment-sdk-setup-local.md).
- Familiarity with Python and Machine Learning concepts.
- A local development environment - a laptop with Python installed and your favorite IDE (for example: VSCode, Pycharm, Jupyter, and so on).

## Create `hello.py`

Create a new subdirectory called `src` under the `quickstart` directory to store code that we want to process on an AzureML compute cluster. In the `src` subdirectory create your hello world script `hello.py`:

```python
# src/hello.py
print("Hello world!")
```

Your project directory structure will now look like:

```Bash
quickstart
└──.azureml
|  └──config.json
└──src
|  └──hello.py
└──01-create-workspace.py
└──02-create-compute.py
```

## Test your script locally

You can run your code locally, which has the benefit of interactive debugging of code, by using:

```bash
python ./src/hello.py
```

Instead, you can use the debugging tools in your IDE or run in an interactive python tutorial.

## Create a control-plane python script

To run in the cloud, you create a *control-plane* script. A control-plane script is where you control _how_ your code is submitted to Azure. Contrastingly, the code you wish to submit (in this case `hello.py`) is referred to as the _data plane_. Typically, the data plane contains the code defining your models, data preparation, and controlling the training itself.

In your quickstart directory, create a new python file called `03-run-hello.py` and copy-and-paste the code below into that file:

```python
# quickstart/03-run-hello.py
from azureml.core import Workspace
from azureml.core import Experiment
from azureml.core import ScriptRunConfig

if __name__ == "__main__":
    ws = Workspace.from_config()
    experiment = Experiment(workspace=ws, name='hello-world')
    config = ScriptRunConfig(source_directory='./src', script='hello.py', compute_target='cpu-cluster')
    run = experiment.submit(config)
    aml_url = run.get_portal_url()
    print(aml_url)
```

### Understanding the five lines of code

- **`ws = Workspace.from_config()`** connect to the AzureML workspace. The `Workspace` class allows you to communicate with your AzureML resources. For example, to manage your compute infrastructure, models, data, and much more!
- **`experiment = Experiment(workspace=ws, name='hello-world')`** Experiments provide a simple way to organize multiple runs under a single name. Later you can see how experiments make it easy to compare metrics between dozens of runs (for example: when hyperparameter tuning).
- **`config = ScriptRunConfig(source_directory='./src', script='hello.py', compute_target='cpu-cluster')`** To create a run in an experiment, you need the `ScriptRunConfig` class to wrap your `hello.py` code and pass it to AzureML. As the name suggests, you can use this class to _configure_ how we want our _script_ to _run_ in AzureML. You can see the compute target is defined to run on the compute cluster you created in the [setup tutorial](tutorial-1st-experiment-sdk-setup-local.md).
- **`run = experiment.submit(config)`** Submits your script. We refer to such a submission as a **run**, which encapsulates a single execution of your code. A run can be used to monitor the script progress, capture the output, analyze the results, visualize metrics and more!
- **`aml_url = run.get_portal_url()`** The `run` object provides a handle on the execution of our code. We can monitor its progress
from the AzureML Studio with the URL that is printed from the python script.

## Run in the cloud

You can submit your script using:

```bash
python run-hello.py
```

The output will contain a link to the Azure ML Studio that looks something like this:
`https://ml.azure.com/experiments/hello-world/runs/<run-id>?wsid=/subscriptions/<subscription-id>/resourcegroups/<resource-group>/workspaces/<workspace-name>`.

Follow the link and navigate to the "Outputs + logs" tab. There you can see a file
`70_driver_log.txt` like this:

```txt
 1: [2020-08-04T22:15:44.407305] Entering context manager injector.
 2: [context_manager_injector.py] Command line Options: Namespace(inject=['ProjectPythonPath:context_managers.ProjectPythonPath', 'RunHistory:context_managers.RunHistory', 'TrackUserError:context_managers.TrackUserError', 'UserExceptions:context_managers.UserExceptions'], invocation=['hello.py'])
 3: Starting the daemon thread to refresh tokens in background for process with pid = 31263
 4: Entering Run History Context Manager.
 5: Preparing to call script [ hello.py ] with arguments: []
 6: After variable expansion, calling script [ hello.py ] with arguments: []
 7:
 8: Hello world!
 9: Starting the daemon thread to refresh tokens in background for process with pid = 31263
10:
11:
12: The experiment completed successfully. Finalizing run...
13: Logging experiment finalizing status in history service.
14: [2020-08-04T22:15:46.541334] TimeoutHandler __init__
15: [2020-08-04T22:15:46.541396] TimeoutHandler __enter__
16: Cleaning up all outstanding Run operations, waiting 300.0 seconds
17: 1 items cleaning up...
18: Cleanup took 0.1812913417816162 seconds
19: [2020-08-04T22:15:47.040203] TimeoutHandler __exit__
```

On line 8, you see the "Hello world!" output.

> [!NOTE]
> The 70_driver_log.txt file contains the standard output from run and can be useful
> when debugging remote runs in the cloud.


## Clean up resources

Do not complete this section if you plan on running other Azure Machine Learning tutorials.

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

In this tutorial, you took a simple "hello world" script and ran it on Azure. You saw how to connect to your AzureML workspace, create an Experiment, and submit your `hello.py` code to the cloud.

In the next tutorial, you build on these learnings by running something more interesting than `print("Hello world!")`.

> [!div class="nextstepaction"]
> [Tutorial: Train a model](tutorial-1st-experiment-sdk-train.md)
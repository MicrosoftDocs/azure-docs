---
title: Configure a training run
titleSuffix: Azure Machine Learning
description: Train your machine learning model on various training environments (compute targets). You can easily switch between training environments. Start training locally. If you need to scale out, switch to a cloud-based compute target.
services: machine-learning
author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.date: 09/28/2020
ms.topic: conceptual
ms.custom: how-to, devx-track-python, contperfq1
---

# Configure and submit training runs

In this article, you learn how to configure and submit Azure Machine Learning runs to train your models.

When training, it is common to start on your local computer, and then later scale out to a cloud-based cluster. With Azure Machine Learning, you can run your script on various compute targets without having to change your training script.

All you need to do is define the environment for each compute target within a **script run configuration**.  Then, when you want to run your training experiment on a different compute target, specify the run configuration for that compute.

## Prerequisites

* If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today
* The [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py&preserve-view=true) (>= 1.13.0)
* An [Azure Machine Learning workspace](how-to-manage-workspace.md), `ws`
* A compute target, `my_compute_target`.  [Create a compute target](how-to-create-attach-compute-studio.md) 

## <a name="whats-a-run-configuration"></a>What's a script run configuration?
A [ScriptRunConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.scriptrunconfig?view=azure-ml-py&preserve-view=true) is used to configure the information necessary for submitting a training run as part of an experiment.

You submit your training experiment with a ScriptRunConfig object.  This object includes the:

* **source_directory**: The source directory that contains your training script
* **script**: The training script to run
* **compute_target**: The compute target to run on
* **environment**: The environment to use when running the script
* and some additional configurable options (see the [reference documentation](https://docs.microsoft.com/python/api/azureml-core/azureml.core.scriptrunconfig?view=azure-ml-py&preserve-view=true) for more information)

## <a id="submit"></a>Train your model

The code pattern to submit a training run is the same for all types of compute targets:

1. Create an experiment to run
1. Create an environment where the script will run
1. Create a ScriptRunConfig, which specifies the compute target and environment
1. Submit the run
1. Wait for the run to complete

Or you can:

* Submit a HyperDrive run for [hyperparameter tuning](how-to-tune-hyperparameters.md).
* Submit an experiment via the [VS Code extension](tutorial-train-deploy-image-classification-model-vscode.md#train-the-model).

## Create an experiment

Create an experiment in your workspace.

```python
from azureml.core import Experiment

experiment_name = 'my_experiment'
experiment = Experiment(workspace=ws, name=experiment_name)
```

## Select a compute target

Select the compute target where your training script will run on. If no compute target is specified in the ScriptRunConfig, or if `compute_target='local'`, Azure ML will execute your script locally. 

The example code in this article assumes that you have already created a compute target `my_compute_target` from the "Prerequisites" section.

## Create an environment
Azure Machine Learning [environments](concept-environments.md) are an encapsulation of the environment where your machine learning training happens. They specify the Python packages, Docker image, environment variables, and software settings around your training and scoring scripts. They also specify runtimes (Python, Spark, or Docker).

You can either define your own environment, or use an Azure ML curated environment. [Curated environments](https://docs.microsoft.com/azure/machine-learning/how-to-use-environments#use-a-curated-environment) are predefined environments that are available in your workspace by default. These environments are backed by cached Docker images which reduces the run preparation cost. See [Azure Machine Learning Curated Environments](https://docs.microsoft.com/azure/machine-learning/resource-curated-environments) for the full list of available curated environments.

For a remote compute target, you can use one of these popular curated environments to start with:

```python
from azureml.core import Workspace, Environment

ws = Workspace.from_config()
myenv = Environment.get(workspace=ws, name="AzureML-Minimal")
```

For more information and details about environments, see [Create & use software environments in Azure Machine Learning](how-to-use-environments.md).
  
### <a name="local"></a>Local compute target

If your compute target is your **local machine**, you are responsible for ensuring that all the necessary packages are available in the Python environment where the script runs.  Use `python.user_managed_dependencies` to use your current Python environment (or the Python on the path you specify).

```python
from azureml.core import Environment

myenv = Environment("user-managed-env")
myenv.python.user_managed_dependencies = True

# You can choose a specific Python environment by pointing to a Python path 
# myenv.python.interpreter_path = '/home/johndoe/miniconda3/envs/myenv/bin/python'
```

## Create the script run configuration

Now that you have a compute target (`my_compute_target`) and environment (`myenv`), create a script run configuration that runs your training script (`train.py`) located in your `project_folder` directory:

```python
from azureml.core import ScriptRunConfig

src = ScriptRunConfig(source_directory=project_folder,
                      script='train.py',
                      compute_target=my_compute_target,
                      environment=myenv)

# Set compute target
# Skip this if you are running on your local computer
script_run_config.run_config.target = my_compute_target
```

If you do not specify an environment, a default environment will be created for you.

If you have command-line arguments you want to pass to your training script, you can specify them via the **`arguments`** parameter of the ScriptRunConfig constructor, e.g. `arguments=['--arg1', arg1_val, '--arg2', arg2_val]`.

If you want to override the default maximum time allowed for the run, you can do so via the **`max_run_duration_seconds`** parameter. The system will attempt to automatically cancel the run if it takes longer than this value.

### Specify a distributed job configuration
If you want to run a distributed training job, provide the distributed job-specific config to the **`distributed_job_config`** parameter. Supported config types include [MpiConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfig.mpiconfiguration?view=azure-ml-py&preserve-view=true), [TensorflowConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfig.tensorflowconfiguration?view=azure-ml-py&preserve-view=true), and [PyTorchConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfig.pytorchconfiguration?view=azure-ml-py&preserve-view=true). 

For more information and examples on running distributed Horovod, TensorFlow and PyTorch jobs, see:

* [Train TensorFlow models](https://docs.microsoft.com/azure/machine-learning/how-to-train-tensorflow#distributed-training)
* [Train PyTorch models](https://docs.microsoft.com/azure/machine-learning/how-to-train-pytorch#distributed-training)

## Submit the experiment

```python
run = experiment.submit(config=src)
run.wait_for_completion(show_output=True)
```

> [!IMPORTANT]
> When you submit the training run, a snapshot of the directory that contains your training scripts is created and sent to the compute target. It is also stored as part of the experiment in your workspace. If you change files and submit the run again, only the changed files will be uploaded.
>
> [!INCLUDE [amlinclude-info](../../includes/machine-learning-amlignore-gitignore.md)]
> 
> For more information about snapshots, see [Snapshots](concept-azure-machine-learning-architecture.md#snapshots).

> [!IMPORTANT]
> **Special Folders**
> Two folders, *outputs* and *logs*, receive special treatment by Azure Machine Learning. During training, when you write files to folders named *outputs* and *logs* that are relative to the root directory (`./outputs` and `./logs`, respectively), the files will automatically upload to your run history so that you have access to them once your run is finished.
>
> To create artifacts during training (such as model files, checkpoints, data files, or plotted images) write these to the `./outputs` folder.
>
> Similarly, you can write any logs from your training run to the `./logs` folder. To utilize Azure Machine Learning's [TensorBoard integration](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/track-and-monitor-experiments/tensorboard/export-run-history-to-tensorboard/export-run-history-to-tensorboard.ipynb) make sure you write your TensorBoard logs to this folder. While your run is in progress, you will be able to launch TensorBoard and stream these logs.  Later, you will also be able to restore the logs from any of your previous runs.
>
> For example, to download a file written to the *outputs* folder to your local machine after your remote training run: 
> `run.download_file(name='outputs/my_output_file', output_file_path='my_destination_path')`

## <a id="gitintegration"></a>Git tracking and integration

When you start a training run where the source directory is a local Git repository, information about the repository is stored in the run history. For more information, see [Git integration for Azure Machine Learning](concept-train-model-git-integration.md).

## Notebook examples

See these notebooks for examples of configuring runs for various training scenarios:
* [Training on various compute targets](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training)
* [Training with ML frameworks](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks)
* [tutorials/img-classification-part1-training.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/tutorials/image-classification-mnist-data/img-classification-part1-training.ipynb)

[!INCLUDE [aml-clone-in-azure-notebook](../../includes/aml-clone-for-examples.md)]

## Next steps

* [Tutorial: Train a model](tutorial-train-models-with-aml.md) uses a managed compute target to  train a model.
* See how to train models with specific ML frameworks, such as [Scikit-learn](how-to-train-scikit-learn.md), [TensorFlow](how-to-train-tensorflow.md), and [PyTorch](how-to-train-pytorch.md).
* Learn how to [efficiently tune hyperparameters](how-to-tune-hyperparameters.md) to build better models.
* Once you have a trained model, learn [how and where to deploy models](how-to-deploy-and-where.md).
* View the [ScriptRunConfig class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.scriptrunconfig?view=azure-ml-py&preserve-view=true) SDK reference.
* [Use Azure Machine Learning with Azure Virtual Networks](how-to-enable-virtual-network.md)

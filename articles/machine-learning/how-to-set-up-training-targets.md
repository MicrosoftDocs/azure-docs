---
title: Configure a training run
titleSuffix: Azure Machine Learning
description: Train your machine learning model on various training environments (compute targets). You can easily switch between training environments. 
services: machine-learning
author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.date: 09/28/2020
ms.topic: how-to
ms.custom: devx-track-python, contperf-fy21q1
---

# Configure and submit training runs

In this article, you learn how to configure and submit Azure Machine Learning runs to train your models. Snippets of code explain the key parts of configuration and submission of a training script.  Then use one of the [example notebooks](#notebooks) to find the full end-to-end working examples.

When training, it is common to start on your local computer, and then later scale out to a cloud-based cluster. With Azure Machine Learning, you can run your script on various compute targets without having to change your training script.

All you need to do is define the environment for each compute target within a **script run configuration**.  Then, when you want to run your training experiment on a different compute target, specify the run configuration for that compute.

## Prerequisites

* If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today
* The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/install) (>= 1.13.0)
* An [Azure Machine Learning workspace](how-to-manage-workspace.md), `ws`
* A compute target, `my_compute_target`.  [Create a compute target](how-to-create-attach-compute-studio.md) 

## <a name="whats-a-run-configuration"></a>What's a script run configuration?
A [ScriptRunConfig](/python/api/azureml-core/azureml.core.scriptrunconfig) is used to configure the information necessary for submitting a training run as part of an experiment.

You submit your training experiment with a ScriptRunConfig object.  This object includes the:

* **source_directory**: The source directory that contains your training script
* **script**: The training script to run
* **compute_target**: The compute target to run on
* **environment**: The environment to use when running the script
* and some additional configurable options (see the [reference documentation](/python/api/azureml-core/azureml.core.scriptrunconfig) for more information)

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

>[!Note]
>Azure Databricks is not supported as a compute target for model training. You can use Azure Databricks for data preparation and deployment tasks. 

## Create an environment
Azure Machine Learning [environments](concept-environments.md) are an encapsulation of the environment where your machine learning training happens. They specify the Python packages, Docker image, environment variables, and software settings around your training and scoring scripts. They also specify runtimes (Python, Spark, or Docker).

You can either define your own environment, or use an Azure ML curated environment. [Curated environments](./how-to-use-environments.md#use-a-curated-environment) are predefined environments that are available in your workspace by default. These environments are backed by cached Docker images which reduces the run preparation cost. See [Azure Machine Learning Curated Environments](./resource-curated-environments.md) for the full list of available curated environments.

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
If you want to run a distributed training job, provide the distributed job-specific config to the **`distributed_job_config`** parameter. Supported config types include [MpiConfiguration](/python/api/azureml-core/azureml.core.runconfig.mpiconfiguration), [TensorflowConfiguration](/python/api/azureml-core/azureml.core.runconfig.tensorflowconfiguration), and [PyTorchConfiguration](/python/api/azureml-core/azureml.core.runconfig.pytorchconfiguration). 

For more information and examples on running distributed Horovod, TensorFlow and PyTorch jobs, see:

* [Train TensorFlow models](./how-to-train-tensorflow.md#distributed-training)
* [Train PyTorch models](./how-to-train-pytorch.md#distributed-training)

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

## <a name="notebooks"></a>Notebook examples

See these notebooks for examples of configuring runs for various training scenarios:
* [Training on various compute targets](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training)
* [Training with ML frameworks](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks)
* [tutorials/img-classification-part1-training.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/tutorials/image-classification-mnist-data/img-classification-part1-training.ipynb)

[!INCLUDE [aml-clone-in-azure-notebook](../../includes/aml-clone-for-examples.md)]

## Troubleshooting

* **Run fails with `jwt.exceptions.DecodeError`**: Exact error message: `jwt.exceptions.DecodeError: It is required that you pass in a value for the "algorithms" argument when calling decode()`. 
    
    Consider upgrading to the latest version of azureml-core: `pip install -U azureml-core`.
    
    If you are running into this issue for local runs, check the version of PyJWT installed in your environment where you are starting runs. The supported versions of PyJWT are < 2.0.0. Uninstall PyJWT from the environment if the version is >= 2.0.0. You may check the version of PyJWT, uninstall and install the right version as follows:
    1. Start a command shell, activate conda environment where azureml-core is installed.
    2. Enter `pip freeze` and look for `PyJWT`, if found, the version listed should be < 2.0.0
    3. If the listed version is not a supported version, `pip uninstall PyJWT` in the command shell and enter y for confirmation.
    4. Install using `pip install 'PyJWT<2.0.0'`
    
    If you are submitting a user-created environment with your run, consider using the latest version of azureml-core in that environment. Versions >= 1.18.0 of azureml-core already pin PyJWT < 2.0.0. If you need to use a version of azureml-core < 1.18.0 in the environment you submit, make sure to specify PyJWT < 2.0.0 in your pip dependencies.


 * **ModuleErrors (No module named)**:  If you are running into ModuleErrors while submitting experiments in Azure ML, the training script is expecting a package to be installed but it isn't added. Once you provide the package name, Azure ML installs the package in the environment used for your training run.

    If you are using Estimators to submit experiments, you can specify a package name via `pip_packages` or `conda_packages` parameter in the estimator based on from which source you want to install the package. You can also specify a yml file with all your dependencies using `conda_dependencies_file`or list all your pip requirements in a txt file using `pip_requirements_file` parameter. If you have your own Azure ML Environment object that you want to override the default image used by the estimator, you can specify that environment via the `environment` parameter of the estimator constructor.
    
    Azure ML maintained docker images and their contents can be seen in [AzureML Containers](https://github.com/Azure/AzureML-Containers).
    Framework-specific dependencies  are listed in the respective framework documentation:
    *  [Chainer](/python/api/azureml-train-core/azureml.train.dnn.chainer#remarks)
    * [PyTorch](/python/api/azureml-train-core/azureml.train.dnn.pytorch#remarks)
    * [TensorFlow](/python/api/azureml-train-core/azureml.train.dnn.tensorflow#remarks)
    *  [SKLearn](/python/api/azureml-train-core/azureml.train.sklearn.sklearn#remarks)
    
    > [!Note]
    > If you think a particular package is common enough to be added in Azure ML maintained images and environments please raise a GitHub issue in [AzureML Containers](https://github.com/Azure/AzureML-Containers). 
 
* **NameError (Name not defined), AttributeError (Object has no attribute)**: This exception should come from your training scripts. You can look at the log files from Azure portal to get more information about the specific name not defined or attribute error. From the SDK, you can use `run.get_details()` to look at the error message. This will also list all the log files generated for your run. Please make sure to take a look at your training script and fix the error before resubmitting your run. 


* **Run or experiment deletion**:  Experiments can be archived by using the [Experiment.archive](/python/api/azureml-core/azureml.core.experiment%28class%29#archive--) 
method, or from the Experiment tab view in Azure Machine Learning studio client via the "Archive experiment" button. This action hides the experiment from list queries and views, but does not delete it.

    Permanent deletion of individual experiments or runs is not currently supported. For more information on deleting Workspace assets, see [Export or delete your Machine Learning service workspace data](how-to-export-delete-data.md).

* **Metric Document is too large**: Azure Machine Learning has internal limits on the size of metric objects that can be logged at once from a training run. If you encounter a "Metric Document is too large" error when logging a list-valued metric, try splitting the list into smaller chunks, for example:

    ```python
    run.log_list("my metric name", my_metric[:N])
    run.log_list("my metric name", my_metric[N:])
    ```

    Internally, Azure ML concatenates the blocks with the same metric name into a contiguous list.

* **Compute target takes a long time to start**: The Docker images for compute targets are loaded from Azure Container Registry (ACR). By default, Azure Machine Learning creates an ACR that uses the *basic* service tier. Changing the ACR for your workspace to standard or premium tier may reduce the time it takes to build and load images. For more information, see [Azure Container Registry service tiers](../container-registry/container-registry-skus.md).

## Next steps

* [Tutorial: Train a model](tutorial-train-models-with-aml.md) uses a managed compute target to  train a model.
* See how to train models with specific ML frameworks, such as [Scikit-learn](how-to-train-scikit-learn.md), [TensorFlow](how-to-train-tensorflow.md), and [PyTorch](how-to-train-pytorch.md).
* Learn how to [efficiently tune hyperparameters](how-to-tune-hyperparameters.md) to build better models.
* Once you have a trained model, learn [how and where to deploy models](how-to-deploy-and-where.md).
* View the [ScriptRunConfig class](/python/api/azureml-core/azureml.core.scriptrunconfig) SDK reference.
* [Use Azure Machine Learning with Azure Virtual Networks](./how-to-network-security-overview.md)

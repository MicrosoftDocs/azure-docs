---
title: Use compute targets for model training
titleSuffix: Azure Machine Learning
description: Train your machine learning model on various training environments (compute targets). You can easily switch between training environments. Start training locally. If you need to scale out, switch to a cloud-based compute target.
services: machine-learning
author: sdgilley
ms.author: sgilley
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: core
ms.date: 08/07/2020
ms.topic: conceptual
ms.custom: how-to, devx-track-python, contperfq1
---
# Use compute targets for model training
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to use various training environments (compute targets) to train your machine learning model.

When training, it is common to start on your local computer, and later run that training script on a different compute target. With Azure Machine Learning, you can run your script on various compute targets without having to change your script.

All you need to do is define the environment for each compute target within a **run configuration**.  Then, when you want to run your training experiment on a different compute target, specify the run configuration for that compute. For details of specifying an environment and binding it to run configuration, see [Create and manage environments for training and deployment](how-to-use-environments.md).

## Prerequisites

* If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today
* The [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py)
* An [Azure Machine Learning workspace](how-to-manage-workspace.md)
* A [compute target](how-to-create-attach-compute-sdk.md)

## What's a run configuration?

When training, it is common to start on your local computer, and later run that training script on a different compute target. With Azure Machine Learning, you can run your script on various compute targets without having to change your script.

All you need to do is define the environment for each compute target within a **run configuration**.  Then, when you want to run your training experiment on a different compute target, specify the run configuration for that compute. For details of specifying an environment and binding it to run configuration, see [Create and manage environments for training and deployment](how-to-use-environments.md).

## What's an estimator?

To facilitate model training using popular frameworks, the Azure Machine Learning Python SDK provides an alternative higher-level abstraction, the estimator class.  This class allows you to easily construct run configurations. You can create and use a generic [Estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.estimator?view=azure-ml-py) to submit training scripts that use any learning framework you choose (such as scikit-learn). We recommend using an estimator for training as it automatically constructs embedded objects like an environment or RunConfiguration objects for you. If you wish to have more control over how these objects are created and specify what packages to install for your experiment run, follow [these steps](#amlcompute) to submit your training experiments using a RunConfiguration object on an Azure Machine Learning Compute.

Azure Machine Learning provides specific estimators for [PyTorch](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.pytorch?view=azure-ml-py), [TensorFlow](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py), [Chainer](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.chainer?view=azure-ml-py), and [Ray RLlib](how-to-use-reinforcement-learning.md).

For more information, see [Train ML Models with estimators](how-to-train-ml-models.md).

## Create run configuration

Use the sections below to create run configurations for these compute targets:

* [Local computer](#local)
* [Azure Machine Learning compute cluster](#amlcompute)
* [Azure Machine Learning compute instance](#instance)
* [Remote virtual machines](#vm)
* [Azure HDInsight](#hdinsight)


### <a id="local"></a>Local computer

When you use your local computer as a compute target, the training code is run in your [development environment](how-to-configure-environment.md).  If that environment already has the Python packages you need, use the user-managed environment.

 [!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/local.py?name=run_local)]

Now that you have your run configuration, the next step is to [submit the training run](#submit).

### <a id="amlcompute"></a>Azure Machine Learning compute cluster
 
Create a run configuration for the persistent compute target.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/amlcompute2.py?name=run_amlcompute)]

Now that you have your run configuration, the next step is to [submit the training run](#submit).

### <a id="instance"></a>Azure Machine Learning compute instance

Create a run configuration for a compute instance.

    ```python
    
    from azureml.core import ScriptRunConfig
    from azureml.core.runconfig import DEFAULT_CPU_IMAGE
    
    src = ScriptRunConfig(source_directory='', script='train.py')
    
    # Set compute target to the one created in previous step
    src.run_config.target = instance
    
    # Set environment
    src.run_config.environment = myenv
     
    run = experiment.submit(config=src)
    ```

Now that you have your run configuration, the next step is to [submit the training run](#submit).


### <a id="vm"></a>Remote virtual machines


Create a run configuration for the DSVM compute target. Docker and conda are used to create and configure the training environment on the DSVM.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/dsvm.py?name=run_dsvm)]


Now that you have your run configuration, the next step is to [submit the training run](#submit).


### <a id="hdinsight"></a>Azure HDInsight 

Create a run configuration for the HDI compute target. 

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/hdi.py?name=run_hdi)]


Now that you have your run configuration, the next step is to [submit the training run](#submit).

## <a id="submit"></a>Train your model

After you create a run configuration, you use it to run your experiment.  The code pattern to submit a training run is the same for all types of compute targets:

1. Create an experiment to run.
1. Submit the run.
1. Wait for the run to complete.

> [!IMPORTANT]
> When you submit the training run, a snapshot of the directory that contains your training scripts is created and sent to the compute target. It is also stored as part of the experiment in your workspace. If you change files and submit the run again, only the changed files will be uploaded.
>
> [!INCLUDE [amlinclude-info](../../includes/machine-learning-amlignore-gitignore.md)]
> 
> For more information, see [Snapshots](concept-azure-machine-learning-architecture.md#snapshots).

## Create an experiment

First, create an experiment in your workspace.

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/local.py?name=experiment)]

## Submit the experiment

Submit the experiment with a `ScriptRunConfig` object.  This object includes the:

* **source_directory**: The source directory that contains your training script
* **script**: Identify the training script
* **run_config**: The run configuration, which in turn defines where the training will occur.

For example, to use [the local target](#local) configuration:

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/local.py?name=local_submit)]

Switch the same experiment to run in a different compute target by using a different run configuration, such as the [amlcompute target](#amlcompute):

[!code-python[](~/aml-sdk-samples/ignore/doc-qa/how-to-set-up-training-targets/amlcompute2.py?name=amlcompute_submit)]

> [!TIP]
> This example defaults to only using one node of the compute target for training. To use more than one node, set the `node_count` of the run configuration to the desired number of nodes. For example, the following code sets the number of nodes used for training to four:
>
> ```python
> src.run_config.node_count = 4
> ```

Or you can:

* Submit the experiment with an `Estimator` object as shown in [Train ML models with estimators](how-to-train-ml-models.md).
* Submit a HyperDrive run for [hyperparameter tuning](how-to-tune-hyperparameters.md).
* Submit an experiment via the [VS Code extension](tutorial-train-deploy-image-classification-model-vscode.md#train-the-model).

For more information, see the [ScriptRunConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.scriptrunconfig?view=azure-ml-py) and [RunConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfiguration?view=azure-ml-py) documentation.

## Create run configuration and submit run using Azure Machine Learning CLI

You can use [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) and [Machine Learning CLI extension](reference-azure-machine-learning-cli.md) to create run configurations and submit runs on different compute targets. The following examples assume that you have an existing Azure Machine Learning Workspace and you have logged in to Azure using `az login` CLI command. 

[!INCLUDE [select-subscription](../../includes/machine-learning-cli-subscription.md)] 

### Create run configuration

The simplest way to create run configuration is to navigate the folder that contains your machine learning Python scripts, and use CLI command

```azurecli
az ml folder attach
```

This command creates a subfolder `.azureml` that contains template run configuration files for different compute targets. You can copy and edit these files to customize your configuration, for example to add Python packages or change Docker settings.  

### Structure of run configuration file

The run configuration file is YAML formatted, with following sections
 * The script to run and its arguments
 * Compute target name, either "local" or name of a compute under the workspace.
 * Parameters for executing the run: framework, communicator for distributed runs, maximum duration, and number of compute nodes.
 * Environment section. See [Create and manage environments for training and deployment](how-to-use-environments.md) for details of the fields in this section.
   * To specify Python packages to install for the run, create [conda environment file](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#create-env-file-manually), and set __condaDependenciesFile__ field.
 * Run history details to specify log file folder, and to enable or disable output collection and run history snapshots.
 * Configuration details specific to the framework selected.
 * Data reference and data store details.
 * Configuration details specific for Machine Learning Compute for creating a new cluster.

See the example [JSON file](https://github.com/microsoft/MLOps/blob/b4bdcf8c369d188e83f40be8b748b49821f71cf2/infra-as-code/runconfigschema.json) for a full runconfig schema.

### Create an experiment

First, create an experiment for your runs

```azurecli
az ml experiment create -n <experiment>
```

### Script run

To submit a script run, execute a command

```azurecli
az ml run submit-script -e <experiment> -c <runconfig> my_train.py
```

### HyperDrive run

You can use HyperDrive with Azure CLI to perform parameter tuning runs. First, create a HyperDrive configuration file in the following format. See [Tune hyperparameters for your model](how-to-tune-hyperparameters.md) article for details on hyperparameter tuning parameters.

```yml
# hdconfig.yml
sampling: 
    type: random # Supported options: Random, Grid, Bayesian
    parameter_space: # specify a name|expression|values tuple for each parameter.
    - name: --penalty # The name of a script parameter to generate values for.
      expression: choice # supported options: choice, randint, uniform, quniform, loguniform, qloguniform, normal, qnormal, lognormal, qlognormal
      values: [0.5, 1, 1.5] # The list of values, the number of values is dependent on the expression specified.
policy: 
    type: BanditPolicy # Supported options: BanditPolicy, MedianStoppingPolicy, TruncationSelectionPolicy, NoTerminationPolicy
    evaluation_interval: 1 # Policy properties are policy specific. See the above link for policy specific parameter details.
    slack_factor: 0.2
primary_metric_name: Accuracy # The metric used when evaluating the policy
primary_metric_goal: Maximize # Maximize|Minimize
max_total_runs: 8 # The maximum number of runs to generate
max_concurrent_runs: 2 # The number of runs that can run concurrently.
max_duration_minutes: 100 # The maximum length of time to run the experiment before cancelling.
```

Add this file alongside the run configuration files. Then submit a HyperDrive run using:
```azurecli
az ml run submit-hyperdrive -e <experiment> -c <runconfig> --hyperdrive-configuration-name <hdconfig> my_train.py
```

Note the *arguments* section in runconfig and *parameter space* in HyperDrive config. They contain the command-line arguments to be passed to training script. The value in runconfig stays the same for each iteration, while the range in HyperDrive config is iterated over. Do not specify the same argument in both files.

For more details on these ```az ml``` CLI commands, see 
[the reference documentation](reference-azure-machine-learning-cli.md).

<a id="gitintegration"></a>

## Git tracking and integration

When you start a training run where the source directory is a local Git repository, information about the repository is stored in the run history. For more information, see [Git integration for Azure Machine Learning](concept-train-model-git-integration.md).

## Notebook examples

See these notebooks for examples of training with various compute targets:
* [how-to-use-azureml/training](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training)
* [tutorials/img-classification-part1-training.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/tutorials/image-classification-mnist-data/img-classification-part1-training.ipynb)

[!INCLUDE [aml-clone-in-azure-notebook](../../includes/aml-clone-for-examples.md)]

## Next steps

* [Tutorial: Train a model](tutorial-train-models-with-aml.md) uses a managed compute target to  train a model.
* For more commands useful for the compute instance, see the notebook [train-on-computeinstance](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/training/train-on-computeinstance/train-on-computeinstance.ipynb). This notebook is also available in the studio **Samples** folder in *training/train-on-computeinstance*.
* Learn how to [efficiently tune hyperparameters](how-to-tune-hyperparameters.md) to build better models.
* Once you have a trained model, learn [how and where to deploy models](how-to-deploy-and-where.md).
* View the [RunConfiguration class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfig.runconfiguration?view=azure-ml-py) SDK reference.
* [Use Azure Machine Learning with Azure Virtual Networks](how-to-enable-virtual-network.md)

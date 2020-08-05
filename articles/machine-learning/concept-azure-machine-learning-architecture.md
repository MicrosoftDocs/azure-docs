---
title: 'Key concepts'
titleSuffix: Azure Machine Learning
description: Learn about terms and concepts used by Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sgilley
author: sdgilley
ms.date: 08/04/2020
ms.custom: seoapril2019, seodec18
# As a data scientist, I want to understand the big picture about how Azure Machine Learning works.
---

# Key concepts for Azure Machine Learning

Learn about the terms and concepts used by Azure Machine Learning.

> [!NOTE]
> Although this article defines terms and concepts used by Azure Machine Learning, it does not define terms and concepts for the Azure platform. For more information about Azure platform terminology, see the [Microsoft Azure glossary](https://docs.microsoft.com/azure/azure-glossary-cloud-terminology).

## Workspace

A [machine learning workspace](concept-workspace.md) is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning.

You can share a workspace with others.

## Studio

[Azure Machine Learning studio](https://ml.azure.com) provides a web view of all the artifacts in your workspace.  This portal is also where you access to the interactive tools that are part of Azure Machine Learning:

+ [Azure Machine Learning designer (preview)](concept-designer.md) performs workflow steps without writing code. (An [Enterprise workspace](concept-workspace.md#upgrade)) is required to use designer.)
+ Web experience for [automated machine learning](concept-automated-ml.md)
+ [Data labeling projects](how-to-create-labeling-projects.md) to create, manage, and monitor projects to label of your data


## <a name="compute-instance"></a> Computes

<a name="compute-targets">
A [compute target](concept-compute-target.md) is the machine where you run your training script or host your service deployment. This location may be your local machine or any of the compute resources below.

|Term  |Description  |
|---------|---------|
|[Compute instances](concept-compute-instance.md)     |   Fully managed cloud-based workstation.  A virtual machine (VM) that includes multiple tools and environments installed for machine learning. Use a compute instance to start running sample notebooks with no setup required. Can also be used as a compute target for training and inferencing jobs.     |
|[Compute clusters](how-to-set-up-training-targets.md#amlcompute)    |  Fully managed cluster of VMs with multi-node scaling capabilities.  Scales up automatically when a job is submitted.  Better suited for compute targets for large jobs and production.  
| [Attached compute](how-to-set-up-training-targets.md#portal-reuse)  |    Attach a VM created outside the Azure Machine Learning workspace to make it available to your workspace. |

## Datasets and datastores

**Azure Machine Learning Datasets**  make it easier to access and work with your data. Datasets manage data in various scenarios such as model training and pipeline creation. Using the Azure Machine Learning SDK, you can access underlying storage, explore data, and manage the life cycle of different Dataset definitions.

Datasets provide methods for working with data in popular formats, such as using `from_delimited_files()` or `to_pandas_dataframe()`.

For more information, see [Create and register Azure Machine Learning Datasets](how-to-create-register-datasets.md).  For more examples using Datasets, see the [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/work-with-data/datasets-tutorial).

A **datastore** is a storage abstraction over an Azure storage account. The datastore can use either an Azure blob container or an Azure file share as the back-end storage. Each workspace has a default datastore, and you can register additional datastores. Use the Python SDK API or the Azure Machine Learning CLI to store and retrieve files from the datastore.


## Training a model

At its simplest, a model is a piece of code that takes an input and produces output. Creating a machine learning model involves selecting an algorithm, providing it with data, and [tuning hyperparameters](how-to-tune-hyperparameters.md). Training is an iterative process that produces a trained model, which encapsulates what the model learned during the training process.

A model is produced by a [run](#runs) of an [experiment](#experiments) in Azure Machine Learning. You can also use a model that's trained outside of Azure Machine Learning. You can register a model in the workspace.

Azure Machine Learning is framework agnostic. When you create a model, you can use any popular machine learning framework, such as Scikit-learn, XGBoost, PyTorch, TensorFlow, and Chainer.

For an example of training a model using Scikit-learn and an [estimator](#estimators), see [Tutorial: Train an image classification model with Azure Machine Learning](tutorial-train-models-with-aml.md).


### Experiments

[Workspace](#workspace) > **Experiments**

An experiment is a grouping of many runs from a specified script. It always belongs to a workspace. When you submit a run, you provide an experiment name. Information for the run is stored under that experiment. If the name doesn't exist when you submit an experiment, a new experiment is automatically created.

For an example of using an experiment, see [Tutorial: Train your first model](tutorial-1st-experiment-sdk-train.md).

### Environments

[Workspace](#workspace) > **Environments**

An [environment](concept-environments.md) is the encapsulation of the environment where training of your machine learning model happens. The environment specifies the Python packages, environment variables, and software settings around your training and scoring scripts.

For code samples, see the "Manage environments" section of [How to use environments](how-to-use-environments.md#manage-environments).

### Runs

[Workspace](#workspace) > [Experiments](#experiments) > **Run**

A run is a single execution of a training script. An experiment will typically contain multiple runs.

Azure Machine Learning records all runs and stores the following information in the experiment:

* Metadata about the run (timestamp, duration, and so on)
* Metrics that are logged by your script
* Output files that are autocollected by the experiment or explicitly uploaded by you
* A snapshot of the directory that contains your scripts, prior to the run

You produce a run when you submit a script to train a model. A run can have zero or more child runs. For example, the top-level run might have two child runs, each of which might have its own child run.

### Run configurations

[Workspace](#workspace) > [Experiments](#experiments) > [Run](#runs) > **Run configuration**

A run configuration is a set of instructions that defines how a script should be run in a specified compute target. The configuration includes a wide set of behavior definitions, such as whether to use an existing Python environment or to use a Conda environment that's built from a specification.

A run configuration can be persisted into a file inside the directory that contains your training script.   Or it can be constructed as an in-memory object and used to submit a run.

For example run configurations, see [Select and use a compute target to train your model](how-to-set-up-training-targets.md).


### Estimators

To facilitate model training with popular frameworks, the estimator class allows you to easily construct run configurations. You can create and use a generic [Estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.estimator?view=azure-ml-py) to submit training scripts that use any learning framework you choose (such as scikit-learn).

For PyTorch, TensorFlow, and Chainer tasks, Azure Machine Learning also provides respective [PyTorch](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.pytorch?view=azure-ml-py), [TensorFlow](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py), and [Chainer](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.chainer?view=azure-ml-py) estimators to simplify using these frameworks.

For more information, see the following articles:

* [Train ML models with estimators](how-to-train-ml-models.md).
* [Train Pytorch deep learning models at scale with Azure Machine Learning](how-to-train-pytorch.md).
* [Train and register TensorFlow models at scale with Azure Machine Learning](how-to-train-tensorflow.md).
* [Train and register Chainer models at scale with Azure Machine Learning](how-to-train-ml-models.md).

### Snapshots

[Workspace](#workspace) > [Experiments](#experiments) > [Run](#runs) > **Snapshot**

When you submit a run, Azure Machine Learning compresses the directory that contains the script as a zip file and sends it to the compute target. The zip file is then extracted, and the script is run there. Azure Machine Learning also stores the zip file as a snapshot as part of the run record. Anyone with access to the workspace can browse a run record and download the snapshot.

### Logging

When you develop your solution, use the Azure Machine Learning Python SDK in your Python script to log arbitrary metrics. After the run, query the metrics to determine whether the run has produced the model you want to deploy.


> [!NOTE]
> [!INCLUDE [amlinclude-info](../../includes/machine-learning-amlignore-gitignore.md)]

### GitHub tracking and integration

When you start a training run where the source directory is a local Git repository, information about the repository is stored in the run history. This works with runs submitted using an estimator, ML pipeline, or script run. It also works for runs submitted from the SDK or Machine Learning CLI.

For more information, see [Git integration for Azure Machine Learning](concept-train-model-git-integration.md).

## Deploy models

The **model registry** keeps track of all the models in your Azure Machine Learning workspace.

Models are identified by name and version. Each time you register a model with the same name as an existing one, the registry assumes that it's a new version. The version is incremented, and the new model is registered under the same name.

When you register the model, you can provide additional metadata tags and then use the tags when you search for models.

> [!TIP]
> A registered model is a logical container for one or more files that make up your model. For example, if you have a model that is stored in multiple files, you can register them as a single model in your Azure Machine Learning workspace. After registration, you can then download or deploy the registered model and receive all the files that were registered.

You can't delete a registered model that is being used by an active deployment.

For an example of registering a model, see [Train an image classification model with Azure Machine Learning](tutorial-train-models-with-aml.md).

To deploy a registered model as a service, you need the following components:

* **Inference environment**. This environment encapsulates the dependencies required to run your model for inference.
* **Scoring code**. This script accepts requests, scores the requests by using the model, and returns the results.
* **Inference configuration**. The inference configuration specifies the environment configuration, entry script, and other components needed to run the model as a service.

For more information about these components, see [Deploy models with Azure Machine Learning](how-to-deploy-and-where.md).

### Endpoints

An endpoint is an instantiation of your model into either a web service that can be hosted in the cloud or an IoT module for integrated device deployments.

#### Web service endpoint

When deploying a model as a web service the endpoint can be deployed on Azure Container Instances, Azure Kubernetes Service, or FPGAs. You create the service from your model, script, and associated files. These are placed into a base container image, which contains the execution environment for the model. The image has a load-balanced, HTTP endpoint that receives scoring requests that are sent to the web service.

You can enable Application Insights telemetry or model telemetry to monitor your web service. The telemetry data is accessible only to you.  It's stored in your Application Insights and storage account instances.

If you've enabled automatic scaling, Azure automatically scales your deployment.

For an example of deploying a model as a web service, see [Deploy an image classification model in Azure Container Instances](tutorial-deploy-models-with-aml.md).

#### IoT module endpoints

A deployed IoT module endpoint is a Docker container that includes your model and associated script or application and any additional dependencies. You deploy these modules by using Azure IoT Edge on edge devices.

If you've enabled monitoring, Azure collects telemetry data from the model inside the Azure IoT Edge module. The telemetry data is accessible only to you, and it's stored in your storage account instance.

Azure IoT Edge ensures that your module is running, and it monitors the device that's hosting it.

## Monitor 

Monitor for **data drift** between the training dataset and inference data of a deployed model. When necessary, loop back to step 1 to retrain the model with new training data.
. 
## Automation

### Azure Machine Learning CLI 

The [Azure Machine Learning CLI](reference-azure-machine-learning-cli.md) is an extension to the Azure CLI, a cross-platform command-line interface for the Azure platform. This extension provides commands to automate your machine learning activities.

### ML Pipelines

You use [machine learning pipelines](concept-ml-pipelines.md) to create and manage workflows that stitch together machine learning phases. For example, a pipeline might include data preparation, model training, model deployment, and inference/scoring phases. Each phase can encompass multiple steps, each of which can run unattended in various compute targets. 

Pipeline steps are reusable, and can be run without rerunning the previous steps if the output of those steps hasn't changed. For example, you can retrain a model without rerunning costly data preparation steps if the data hasn't changed. Pipelines also allow data scientists to collaborate while working on separate areas of a machine learning workflow.

## Interacting with machine learning

> [!IMPORTANT]
> Tools marked (preview) below are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

+  Interact with the service in any Python environment with the [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).
+ Interact with the service in any R environment with the [Azure Machine Learning SDK for R](https://azure.github.io/azureml-sdk-for-r/reference/index.html) (preview).
+ Use [Azure Machine Learning designer (preview)](concept-designer.md) to perform the workflow steps without writing code. (An [Enterprise workspace](concept-workspace.md#upgrade)) is required to use designer.)
+ Use [Azure Machine Learning CLI](https://docs.microsoft.com/azure/machine-learning/reference-azure-machine-learning-cli) for automation.
+ The [Many Models Solution Accelerator](https://aka.ms/many-models) (preview) builds on Azure Machine Learning and enables you to train, operate, and manage hundreds or even thousands of machine learning models.

## Next steps

To get started with Azure Machine Learning, see:

* [What is Azure Machine Learning?](overview-what-is-azure-ml.md)
* [Create an Azure Machine Learning workspace](how-to-manage-workspace.md)
* [Tutorial (part 1): Train a model](tutorial-train-models-with-aml.md)

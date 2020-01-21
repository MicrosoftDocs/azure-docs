---
title: 'Architecture & key concepts'
titleSuffix: Azure Machine Learning
description: Learn about the architecture, terms, concepts, and workflows that make up Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: larryfr
author: Blackmist
ms.date: 12/27/2019
ms.custom: seoapril2019
# As a data scientist, I want to understand the big picture about how Azure Machine Learning works.
ms.custom: seodec18
---

# How Azure Machine Learning works: Architecture and concepts

Learn about the architecture, concepts, and workflow for Azure Machine Learning. The major components of the service and the general workflow for using the service are shown in the following diagram:

![Azure Machine Learning architecture and workflow](./media/concept-azure-machine-learning-architecture/workflow.png)

## Workflow

The machine learning model workflow generally follows this sequence:

1. **Train**
    + Develop machine learning training scripts in **Python** or with the visual designer.
    + Create and configure a **compute target**.
    + **Submit the scripts** to the configured compute target to run in that environment. During training, the scripts can read from or write to **datastore**. And the records of execution are saved as **runs** in the **workspace** and grouped under **experiments**.

1. **Package** - After a satisfactory run is found, register the persisted model in the **model registry**.

1. **Validate** - **Query the experiment** for logged metrics from the current and past runs. If the metrics don't indicate a desired outcome, loop back to step 1 and iterate on your scripts.

1. **Deploy** - Develop a scoring script that uses the model and **Deploy the model** as a **web service** in Azure, or to an **IoT Edge device**.

1. **Monitor** - Monitor for **data drift** between the training dataset and inference data of a deployed model. When necessary, loop back to step 1 to retrain the model with new training data.

## Tools for Azure Machine Learning

Use these tools for Azure Machine Learning:

+  Interact with the service in any Python environment with the [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).
+ Interact with the service in any R environment with the [Azure Machine Learning SDK for R](https://azure.github.io/azureml-sdk-for-r/reference/index.html).
+ Automate your machine learning activities with the [Azure Machine Learning CLI](https://docs.microsoft.com/azure/machine-learning/reference-azure-machine-learning-cli).
+ Write code in Visual Studio Code with [Azure Machine Learning VS Code extension](tutorial-setup-vscode-extension.md)
+ Use [Azure Machine Learning designer](concept-designer.md) to perform the workflow steps without writing code.


> [!NOTE]
> Although this article defines terms and concepts used by Azure Machine Learning, it does not define terms and concepts for the Azure platform. For more information about Azure platform terminology, see the [Microsoft Azure glossary](https://docs.microsoft.com/azure/azure-glossary-cloud-terminology).

## Glossary
+ <a href="#activities">Activity</a>
+ <a href="#compute-targets">Compute targets</a>
+ <a href="#datasets-and-datastores">Dataset & datastores</a>
+ <a href="#endpoints">Endpoints</a>
+ <a href="#environments">Environments</a>
+ [Estimators](#estimators)
+ <a href="#experiments">Experiments</a>
+ <a href="#github-tracking-and-integration">Git tracking</a>
+ <a href="#iot-module-endpoints">IoT modules</a>
+ <a href="#logging">Logging</a>
+ <a href="#ml-pipelines">ML pipelines</a>
+ <a href="#models">Models</a>
+ <a href="#runs">Run</a>
+ <a href="#run-configurations">Run Configuration</a>
+ <a href="#snapshots">Snapshot</a>
+ <a href="#training-scripts">Training script</a>
+ <a href="#web-service-endpoint">Web services</a>
+ <a href="#workspaces">Workspace</a>

### Activities

An activity represents a long running operation. The following operations are examples of activities:

* Creating or deleting a compute target
* Running a script on a compute target

Activities can provide notifications through the SDK or the web UI so that you can easily monitor the progress of these operations.

### <a name="compute-instance"></a>Compute instance (preview)

> [!NOTE]
> Compute instances are available only for workspaces with a region of **North Central US** or **UK South**.
>If your workspace is in any other region, you can continue to create and use a [Notebook VM](concept-compute-instance.md#notebookvm) instead. 

An **Azure Machine Learning compute instance** (formerly Notebook VM) is a fully managed cloud-based workstation that includes multiple tools and environments installed for machine learning. Compute instances can be used as a compute target for training and inferencing jobs. For large tasks, [Azure Machine Learning compute clusters](how-to-set-up-training-targets.md#amlcompute) with multi-node scaling capabilities is a better compute target choice.

Learn more about [compute instances](concept-compute-instance.md).

### Compute targets

A [compute target](concept-compute-target.md) lets you specify the compute resource where you run your training script or host your service deployment. This location may be your local machine or a cloud-based compute resource.

Learn more about the [available compute targets for training and deployment](concept-compute-target.md).

### Datasets and datastores

**Azure Machine Learning Datasets** (preview) make it easier to access and work with your data. Datasets manage data in various scenarios such as model training and pipeline creation. Using the Azure Machine Learning SDK, you can access underlying storage, explore data, and manage the life cycle of different Dataset definitions.

Datasets provide methods for working with data in popular formats, such as using `from_delimited_files()` or `to_pandas_dataframe()`.

For more information, see [Create and register Azure Machine Learning Datasets](how-to-create-register-datasets.md).  For more examples using Datasets, see the [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/work-with-data/datasets).

A **datastore** is a storage abstraction over an Azure storage account. The datastore can use either an Azure blob container or an Azure file share as the back-end storage. Each workspace has a default datastore, and you can register additional datastores. Use the Python SDK API or the Azure Machine Learning CLI to store and retrieve files from the datastore.

### Endpoints

An endpoint is an instantiation of your model into either a web service that can be hosted in the cloud or an IoT module for integrated device deployments.

#### Web service endpoint

When deploying a model as a web service the endpoint can be deployed on Azure Container Instances, Azure Kubernetes Service, or FPGAs. You create the service from your model, script, and associated files. These are placed into a base container image which contains the execution environment for the model. The image has a load-balanced, HTTP endpoint that receives scoring requests that are sent to the web service.

Azure helps you monitor your web service by collecting Application Insights telemetry or model telemetry, if you've chosen to enable this feature. The telemetry data is accessible only to you, and it's stored in your Application Insights and storage account instances.

If you've enabled automatic scaling, Azure automatically scales your deployment.

For an example of deploying a model as a web service , see [Deploy an image classification model in Azure Container Instances](tutorial-deploy-models-with-aml.md).

#### IoT module endpoints

A deployed IoT module endpoint is a Docker container that includes your model and associated script or application and any additional dependencies. You deploy these modules by using Azure IoT Edge on edge devices.

If you've enabled monitoring, Azure collects telemetry data from the model inside the Azure IoT Edge module. The telemetry data is accessible only to you, and it's stored in your storage account instance.

Azure IoT Edge ensures that your module is running, and it monitors the device that's hosting it.

### Environments

Azure ML Environments are used to specify the configuration (Docker / Python / Spark / etc.) used to create a reproducible environment for data preparation, model training and model serving. They are managed and versioned entities within your Azure Machine Learning workspace that enable reproducible, auditable, and portable machine learning workflows across different compute targets.

You can use an environment object on your local compute to develop your training script, reuse that same environment on Azure Machine Learning Compute for model training at scale, and even deploy your model with that same environment. 

Learn [how to create and manage a reusable ML environment](how-to-use-environments.md) for training and inference.

### Estimators

To facilitate model training with popular frameworks, the estimator class allows you to easily construct run configurations. You can create and use a generic [Estimator](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.estimator?view=azure-ml-py) to submit training scripts that use any learning framework you choose (such as scikit-learn).

For PyTorch, TensorFlow, and Chainer tasks, Azure Machine Learning also provides respective [PyTorch](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.pytorch?view=azure-ml-py), [TensorFlow](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.tensorflow?view=azure-ml-py), and [Chainer](https://docs.microsoft.com/python/api/azureml-train-core/azureml.train.dnn.chainer?view=azure-ml-py) estimators to simplify using these frameworks.

For more information, see the following articles:

* [Train ML models with estimators](how-to-train-ml-models.md).
* [Train Pytorch deep learning models at scale with Azure Machine Learning](how-to-train-pytorch.md).
* [Train and register TensorFlow models at scale with Azure Machine Learning](how-to-train-tensorflow.md).
* [Train and register Chainer models at scale with Azure Machine Learning](how-to-train-chainer.md).

### Experiments

An experiment is a grouping of many runs from a specified script. It always belongs to a workspace. When you submit a run, you provide an experiment name. Information for the run is stored under that experiment. If you submit a run and specify an experiment name that doesn't exist, a new experiment with that newly specified name is automatically created.

For an example of using an experiment, see [Tutorial: Train your first model](tutorial-1st-experiment-sdk-train.md).


### GitHub tracking and integration

When you start a training run where the source directory is a local Git repository, information about the repository is stored in the run history. This works with runs submitted using an estimator, ML pipeline, or script run. It also works for runs submitted from the SDK or Machine Learning CLI.

For more information, see [Git integration for Azure Machine Learning](concept-train-model-git-integration.md).

### Logging

When you develop your solution, use the Azure Machine Learning Python SDK in your Python script to log arbitrary metrics. After the run, query the metrics to determine whether the run has produced the model you want to deploy.

### ML Pipelines

You use machine learning pipelines to create and manage workflows that stitch together machine learning phases. For example, a pipeline might include data preparation, model training, model deployment, and inference/scoring phases. Each phase can encompass multiple steps, each of which can run unattended in various compute targets. 

Pipeline steps are reusable, and can be run without rerunning subsequent steps if the output of that step hasn't changed. For example, you can retrain a model without rerunning costly data preparation steps if the data hasn't changed. Pipelines also allow data scientists to collaborate while working on separate areas of a machine learning workflow.

For more information about machine learning pipelines with this service, see [Pipelines and Azure Machine Learning](concept-ml-pipelines.md).

### Models

At its simplest, a model is a piece of code that takes an input and produces output. Creating a machine learning model involves selecting an algorithm, providing it with data, and tuning hyperparameters. Training is an iterative process that produces a trained model, which encapsulates what the model learned during the training process.

A model is produced by a run in Azure Machine Learning. You can also use a model that's trained outside of Azure Machine Learning. You can register a model in an Azure Machine Learning workspace.

Azure Machine Learning is framework agnostic. When you create a model, you can use any popular machine learning framework, such as Scikit-learn, XGBoost, PyTorch, TensorFlow, and Chainer.

For an example of training a model using Scikit-learn and an estimator, see [Tutorial: Train an image classification model with Azure Machine Learning](tutorial-train-models-with-aml.md).

The **model registry** keeps track of all the models in your Azure Machine Learning workspace.

Models are identified by name and version. Each time you register a model with the same name as an existing one, the registry assumes that it's a new version. The version is incremented, and the new model is registered under the same name.

When you register the model, you can provide additional metadata tags and then use the tags when you search for models.

> [!TIP]
> A registered model is a logical container for one or more files that make up your model. For example, if you have a model that is stored in multiple files, you can register them as a single model in your Azure Machine Learning workspace. After registration, you can then download or deploy the registered model and receive all the files that were registered.

You can't delete a registered model that is being used by an active deployment.

For an example of registering a model, see [Train an image classification model with Azure Machine Learning](tutorial-train-models-with-aml.md).

### Runs

A run is a single execution of a training script. Azure Machine Learning records all runs and stores the following information:

* Metadata about the run (timestamp, duration, and so on)
* Metrics that are logged by your script
* Output files that are autocollected by the experiment or explicitly uploaded by you
* A snapshot of the directory that contains your scripts, prior to the run

You produce a run when you submit a script to train a model. A run can have zero or more child runs. For example, the top-level run might have two child runs, each of which might have its own child run.

### Run configurations

A run configuration is a set of instructions that defines how a script should be run in a specified compute target. The configuration includes a wide set of behavior definitions, such as whether to use an existing Python environment or to use a Conda environment that's built from a specification.

A run configuration can be persisted into a file inside the directory that contains your training script, or it can be constructed as an in-memory object and used to submit a run.

For example run configurations, see [Select and use a compute target to train your model](how-to-set-up-training-targets.md).
### Snapshots

When you submit a run, Azure Machine Learning compresses the directory that contains the script as a zip file and sends it to the compute target. The zip file is then extracted, and the script is run there. Azure Machine Learning also stores the zip file as a snapshot as part of the run record. Anyone with access to the workspace can browse a run record and download the snapshot.

> [!NOTE]
> To prevent unnecessary files from being included in the snapshot, make an ignore file (.gitignore or .amlignore). Place this file in the Snapshot directory and add the filenames to ignore in it. The .amlignore file uses the same [syntax and patterns as the .gitignore file](https://git-scm.com/docs/gitignore). If both files exist, the .amlignore file takes precedence.

### Training scripts

To train a model, you specify the directory that contains the training script and associated files. You also specify an experiment name, which is used to store information that's gathered during training. During training, the entire directory is copied to the training environment (compute target), and the script that's specified by the run configuration is started. A snapshot of the directory is also stored under the experiment in the workspace.

For an example, see [Tutorial: Train an image classification model with Azure Machine Learning](tutorial-train-models-with-aml.md).

### Workspaces

[The workspace](concept-workspace.md) is the top-level resource for Azure Machine Learning. It provides a centralized place to work with all the artifacts you create when you use Azure Machine Learning. You can share a workspace with others. For a detailed description of workspaces, see [What is an Azure Machine Learning workspace?](concept-workspace.md).

### Next steps

To get started with Azure Machine Learning, see:

* [What is Azure Machine Learning?](overview-what-is-azure-ml.md)
* [Create an Azure Machine Learning workspace](how-to-manage-workspace.md)
* [Tutorial (part 1): Train a model](tutorial-train-models-with-aml.md)

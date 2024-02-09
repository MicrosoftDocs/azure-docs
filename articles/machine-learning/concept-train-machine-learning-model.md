---
title: 'Build & train models'
titleSuffix: Azure Machine Learning
description: Learn how to train models with Azure Machine Learning. Explore the different training methods and choose the right one for your project.
services: machine-learning
ms.service: machine-learning
author: manashgoswami
ms.author: magoswam
ms.reviewer: ssalgado
ms.subservice: training
ms.topic: conceptual
ms.date: 06/7/2023
ms.custom:
  - devx-track-python
  - devx-track-azurecli
  - event-tier1-build-2022
  - ignite-2022
  - build-2023
  - ignite-2023
ms.devlang: azurecli
---

# Train models with Azure Machine Learning

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

Azure Machine Learning provides several ways to train your models, from code-first solutions using the SDK to low-code solutions such as automated machine learning and the visual designer. Use the following list to determine which training method is right for you:

+ [Azure Machine Learning SDK for Python](#python-sdk): The Python SDK provides several ways to train models, each with different capabilities.

    | Training method | Description |
    | ----- | ----- |
    | [command()](#submit-a-command) | A **typical way to train models** is to submit a command() that includes a training script, environment, and compute information. |
    | [Automated machine learning](#automated-machine-learning) | Automated machine learning allows you to **train models without extensive data science or programming knowledge**. For people with a data science and programming background, it provides a way to save time and resources by automating algorithm selection and hyperparameter tuning. You don't have to worry about defining a job configuration when using automated machine learning. |
    | [Machine learning pipeline](#machine-learning-pipeline) | Pipelines are not a different training method, but a **way of defining a workflow using modular, reusable steps** that can include training as part of the workflow. Machine learning pipelines support using automated machine learning and run configuration to train models. Since pipelines are not focused specifically on training, the reasons for using a pipeline are more varied than the other training methods. Generally, you might use a pipeline when:<br>* You want to **schedule unattended processes** such as long running training jobs or data preparation.<br>* Use **multiple steps** that are coordinated across heterogeneous compute resources and storage locations.<br>* Use the pipeline as a **reusable template** for specific scenarios, such as retraining or batch scoring.<br>* **Track and version data sources, inputs, and outputs** for your workflow.<br>* Your workflow is **implemented by different teams that work on specific steps independently**. Steps can then be joined together in a pipeline to implement the workflow. |

+ **Designer**: Azure Machine Learning designer provides an easy entry-point into machine learning for building proof of concepts, or for users with little coding experience. It allows you to train models using a drag and drop web-based UI. You can use Python code as part of the design, or train models without writing any code.

+ **Azure CLI**: The machine learning CLI provides commands for common tasks with Azure Machine Learning, and is often used for **scripting and automating tasks**. For example, once you've created a training script or pipeline, you might use the Azure CLI to start a training job on a schedule or when the data files used for training are updated. For training models, it provides commands that submit training jobs. It can submit jobs using run configurations or pipelines.

Each of these training methods can use different types of compute resources for training. Collectively, these resources are referred to as [__compute targets__](concept-compute-target.md). A compute target can be a local machine or a cloud resource, such as an Azure Machine Learning Compute, Azure HDInsight, or a remote virtual machine.

## Python SDK

The Azure Machine Learning SDK for Python allows you to build and run machine learning workflows with Azure Machine Learning. You can interact with the service from an interactive Python session, Jupyter Notebooks, Visual Studio Code, or other IDE.

* [Install/update the SDK](/python/api/overview/azure/ai-ml-readme)
* [Configure a development environment for Azure Machine Learning](how-to-configure-environment.md)

### Submit a command

A generic training job with Azure Machine Learning can be defined using the [command()](/python/api/azure-ai-ml/azure.ai.ml#azure-ai-ml-command). The command is then used, along with your training script(s) to train a model on the specified compute target.

You may start with a command for your local computer, and then switch to one for a cloud-based compute target as needed. When changing the compute target, you only change the compute parameter in the command that you use. A run also logs information about the training job, such as the inputs, outputs, and logs.

* [Tutorial: Train your first ML model](tutorial-1st-experiment-sdk-train.md)
* [Examples: Jupyter Notebook and Python examples of training models](https://github.com/Azure/azureml-examples)

### Automated Machine Learning

Define the iterations, hyperparameter settings, featurization, and other settings. During training, Azure Machine Learning tries different algorithms and parameters in parallel. Training stops once it hits the exit criteria you defined.

> [!TIP]
> In addition to the Python SDK, you can also use Automated ML through [Azure Machine Learning studio](https://ml.azure.com).

* [What is automated machine learning?](concept-automated-ml.md)
* [Tutorial: Create your first classification model with automated machine learning](tutorial-first-experiment-automated-ml.md)
* [How to: Configure automated ML experiments in Python](how-to-configure-auto-train.md)
* [How to: Create, explore, and deploy automated machine learning experiments with Azure Machine Learning studio](how-to-use-automated-ml-for-ml-models.md)

### Machine learning pipeline

Machine learning pipelines can use the previously mentioned training methods. Pipelines are more about creating a workflow, so they encompass more than just the training of models. 

* [What are ML pipelines in Azure Machine Learning?](concept-ml-pipelines.md)
* [Tutorial: Create production ML pipelines with Python SDK v2 in a Jupyter notebook](tutorial-pipeline-python-sdk.md)


### Understand what happens when you submit a training job

The Azure training lifecycle consists of:

1. Zipping the files in your project folder and upload to the cloud.
    
    > [!TIP]
    > [!INCLUDE [amlinclude-info](includes/machine-learning-amlignore-gitignore.md)]

1. Scaling up your compute cluster (or [serverless compute](./how-to-use-serverless-compute.md)
1. Building or downloading the dockerfile to the compute node 
    1. The system calculates a hash of: 
        - The base image 
        - Custom docker steps (see [Deploy a model using a custom Docker base image](./how-to-deploy-custom-container.md))
        - The conda definition YAML (see [Manage Azure Machine Learning environments with the CLI (v2)](how-to-manage-environments-v2.md)))
    1. The system uses this hash as the key in a lookup of the workspace Azure Container Registry (ACR)
    1. If it is not found, it looks for a match in the global ACR
    1. If it is not found, the system builds a new image (which will be cached and registered with the workspace ACR)
1. Downloading your zipped project file to temporary storage on the compute node
1. Unzipping the project file
1. The compute node executing `python <entry script> <arguments>`
1. Saving logs, model files, and other files written to `./outputs` to the storage account associated with the workspace
1. Scaling down compute, including removing temporary storage 


## Azure Machine Learning designer

The designer lets you train models using a drag and drop interface in your web browser.

+ [What is the designer?](concept-designer.md)

## Azure CLI

The machine learning CLI is an extension for the Azure CLI. It provides cross-platform CLI commands for working with Azure Machine Learning. Typically, you use the CLI to automate tasks, such as training a machine learning model.

* [Use the CLI extension for Azure Machine Learning](how-to-configure-cli.md)
* [MLOps on Azure](https://github.com/Azure/mlops-v2)
* [Train models](how-to-train-model.md)

## VS Code

You can use the VS Code extension to run and manage your training jobs. See the [VS Code resource management how-to guide](how-to-manage-resources-vscode.md#experiments) to learn more.

## Next steps

Learn how to [Tutorial: Create production ML pipelines with Python SDK v2 in a Jupyter notebook](tutorial-pipeline-python-sdk.md).

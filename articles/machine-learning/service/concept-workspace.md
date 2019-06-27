---
title: 'What is a workspace'
titleSuffix: Azure Machine Learning service
description: The workspace is the top-level resource for Azure Machine Learning service. It keeps a history of all training runs, including logs, metrics, output, and a snapshot of your scripts. You use this information to determine which training run produces the best model
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sgilley
author: sdgilley
ms.date: 05/21/2019
# As a data scientist, I want to understand the purpose of a workspace for Azure Machine Learning service.
---


# What is an Azure Machine Learning service workspace?

The workspace is the top-level resource for Azure Machine Learning service, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning service.  The workspace keeps a history of all training runs, including logs, metrics, output, and a snapshot of your scripts. You use this information to determine which training run produces the best model.  

Once you have a model you like, you register it with the workspace. You then use the registered model and scoring scripts to deploy to Azure Container Instances, Azure Kubernetes Service, or to a field-programmable gate array (FPGA) as a REST-based HTTP endpoint. You can also deploy the model to an Azure IoT Edge device as a module.

## Taxonomy 

A taxonomy of the workspace is illustrated in the following diagram:

[![Workspace taxonomy](./media/concept-azure-machine-learning-architecture/azure-machine-learning-taxonomy.png)](./media/concept-azure-machine-learning-architecture/azure-machine-learning-taxonomy.png#lightbox)

The diagram shows the following components of a workspace:

+ A workspace can contain [Notebook VMs](quickstart-run-cloud-notebook.md), cloud resources configured with the Python environment necessary to run Azure Machine Learning.
+ [User roles](how-to-assign-roles.md) enable you to share your workspace with other users, teams or projects.
+ [Compute targets](concept-azure-machine-learning-architecture.md#compute-targets) are used to run your experiments.
+ When you create the workspace, [associated resources](#resources) are also created for you.
+ [Experiments](concept-azure-machine-learning-architecture.md#experiments) are training runs you use to build your models.  You can create and run experiments with
    + The [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).
    + The [automated machine learning experiments (preview)](how-to-create-portal-experiments.md) section in the Azure portal.
    + The [visual interface (preview)](ui-concept-visual-interface.md).
+ [Pipelines](concept-azure-machine-learning-architecture.md#ml-pipelines) are reusable workflows for training and retraining your model.
+ [Datasets](concept-azure-machine-learning-architecture.md#datasets-and-datastores) aid in management of the data you use for model training and pipeline creation.
+ Once you have a model you want to deploy, you create a registered model.
+ Use the registered model and a scoring script to create a [deployment](concept-azure-machine-learning-architecture.md#deployment).

## Tools for workspace interaction

You can interact with your workspace in the following ways:

+ On the web:
    + The [Azure portal](https://portal.azure.com)
    + The [visual interface (preview)](ui-concept-visual-interface.md)
+ In Python using Azure Machine Learning [SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py)
+ On the command line using the Azure Machine Learning [CLI extension](https://docs.microsoft.com/azure/machine-learning/service/reference-azure-machine-learning-cli)

## Machine learning with a workspace

Machine learning tasks read and/or write artifacts to your workspace. 

+ Run an experiment to train a model - writes experiment run results to the workspace.
+ Use automated ML to train a model - writes training results to the workspace.
+ Register a model in the workspace.
+ Deploy a model - uses the registered model to create a deployment.
+ Create and run reusable workflows.
+ View machine learning artifacts such as experiments, pipelines, models, deployments.
+ Track and monitor models.

## Workspace management

You can also perform the following workspace management tasks:

| Workspace management task   | Portal              | SDK        | CLI        |
|---------------------------|------------------|------------|------------|
| Create a workspace        | **&check;**     | **&check;** | **&check;** |
| Create and manage compute resources    | **&check;**   | **&check;** |  **&check;**   |
| Manage workspace access    | **&check;**   | |  **&check;**    |
| Create a notebook VM | **&check;**   | |     |

Get started with the service by [creating a workspace](setup-create-workspace.md).

## <a name="resources"></a> Associated resources

When you create a new workspace, it automatically creates several Azure resources that are used by the workspace:

+ [Azure Container Registry](https://azure.microsoft.com/services/container-registry/): Registers docker containers that you use during training and when you deploy a model. To minimize costs, ACR is **lazy-loaded** until deployment images are created.
+ [Azure Storage account](https://azure.microsoft.com/services/storage/): Is used as the default datastore for the workspace.  Jupyter notebooks that are used with your notebook VMs are stored here as well.
+ [Azure Application Insights](https://azure.microsoft.com/services/application-insights/): Stores monitoring information about your models.
+ [Azure Key Vault](https://azure.microsoft.com/services/key-vault/): Stores secrets that are used by compute targets and other sensitive information that's needed by the workspace.

> [!NOTE]
> In addition to creating new versions, you can also use existing Azure services.

## Next steps

To get started with Azure Machine Learning service, see:

+ [Azure Machine Learning service overview](overview-what-is-azure-ml.md)
+ [Create a workspace](setup-create-workspace.md)
+ [Manage a workspace](how-to-manage-workspace.md)
+ [Tutorial: Train a model](tutorial-train-models-with-aml.md)

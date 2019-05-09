---
title: 'What is a workspace'
titleSuffix: Azure Machine Learning service
description: Learn what a workspace is and why you need one for Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sgilley
author: sdgilley
ms.date: 05/15/2019
# As a data scientist, I want to understand the purpose of a workspace for Azure Machine Learning service.
---


# What is an Azure Machine Learning workspace?

The workspace is the top-level resource for Azure Machine Learning service. It provides a centralized place to work with all the artifacts you create when you use Azure Machine Learning service.

The workspace keeps a history of the training runs, including logs, metrics, output, and a snapshot of your scripts. You use this information to determine which training run produces the best model.  

Once you have a model you like, you register it with the workspace. You use the registered model and scoring scripts to deploy to Azure Container Instances, Azure Kubernetes Service, or to a field-programmable gate array (FPGA) as a REST-based HTTP endpoint. You can also deploy the model to an Azure IoT Edge device as a module.

## Taxonomy 

A taxonomy of the workspace is illustrated in the following diagram:

[![Workspace taxonomy](./media/concept-azure-machine-learning-architecture/azure-machine-learning-taxonomy.png)](./media/concept-azure-machine-learning-architecture/azure-machine-learning-taxonomy.png#lightbox)

The diagram shows the following components of a workspace:

+ A workspace can contain [Notebook VMs](quickstart-run-cloud-notebook.md), cloud resources configured with the Python environment necessary to run Azure Machine Learning.
+ You can share your workspace and assign different [user roles](how-to-assign-roles.md).
+ [Compute targets](concept-azure-machine-learning-architecture.md#compute-target) are used to run your experiments.
+ When you create the workspace, [associated resources](#resources) are also created for you.
+ [Experiments](concept-azure-machine-learning-architecture.md#experiments) are training runs you use to build your models.  You can create and run experiments with
    + The [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).
    + The [automated machine learning experiments (preview)](how-to-create-portal-experiments.md) section in the Axure portal.
    + The [visual interface (preview)]().
+ [Pipelines](concept-azure-machine-learning-architecture.md#pipeline) are reusable workflows for training and retraining your model.
+ [Datasets](concept-azure-machine-learning-architecture.md#dataset) aid in management of the data you use for model training and pipeline creation.
+ Once you have a model you want to deploy, you create a [registered model](concept-azure-machine-learning-architecture.md#model-registry).
+ Use the registered model and a scoring script to create a [deployment](concept-azure-machine-learning-architecture.md#image-registry).

## Manage a workspace

Manage your workspace with any of the following:
+ The [Azure portal](https://azure.portal.com)
+ The [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py)
+ The [Azure Machine Learning CLI](https://docs.microsoft.com/azure/machine-learning/service/reference-azure-machine-learning-cli)

| Workspace Management Task   | Portal              | SDK        | CLI        |
|---------------------------|------------------|------------|------------|
| Create a workspace        | **&check;**     | **&check;** | **&check;** |
| Create and manage compute resources    | **&check;**   | **&check;** |  **&check;**   |
| Manage workspace access    | **&check;**   | |  **&check;**    |
| Create Notebook VMs | **&check;**   | |     |

## Machine learning with a workspace

You perform machine learning tasks using your workspace.  You can perform these tasks:
+ On the web using
    + The [Azure portal](https://azure.portal.com)
    + The [visual interface (preview) for Azure Machine Learning service]()
+ Using the [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py)
+ Using the [Azure Machine Learning CLI](https://docs.microsoft.com/azure/machine-learning/service/reference-azure-machine-learning-cli)


| Machine Learning Task                      | Web              | SDK        | CLI        |
|---------------------------|------------------|------------|------------|
| Run an experiment to train a model | **&check;** (visual interface) | **&check;** | **&check;** |
| Use automated ML to train a model         | **&check;** (portal)           | **&check;** | **&check;** |
| Deploy a model            | **&check;** (visual interface)  | **&check;** | **&check;** |
| Create reusable workflows | **&check;** (visual interface)  | **&check;** |            |
| View ML artifacts (experiments, pipelines, models, deployments )  | **&check;** (portal) | **&check;** |            |
| Manage ML artifacts          | **&check;** (portal)   | **&check;** |


## <a name="resources"></a> Associated resources

When you create a new workspace, it automatically creates several Azure resources that are used by the workspace:

+ [Azure Container Registry](https://azure.microsoft.com/services/container-registry/): Registers docker containers that you use during training and when you deploy a model.
+ [Azure storage account](https://azure.microsoft.com/services/storage/): Is used as the default datastore for the workspace.
+ [Azure Application Insights](https://azure.microsoft.com/services/application-insights/): Stores monitoring information about your models.
+ [Azure Key Vault](https://azure.microsoft.com/services/key-vault/): Stores secrets that are used by compute targets and other sensitive information that's needed by the workspace.

> [!NOTE]
> In addition to creating new versions, you can also use existing Azure services.

## Next steps

To get started with Azure Machine Learning service, see:

+ [What is Azure Machine Learning service?](overview-what-is-azure-ml.md)
+ [Create a workspace](setup-create-workspace.md)
+ [Create and manage Azure Machine Learning service workspaces](how-to-manage-workspace.md)
+ The [visual interface (preview) for Azure Machine Learning service]().
+ [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py)
+ [Azure Machine Learning CLI](https://docs.microsoft.com/azure/machine-learning/service/reference-azure-machine-learning-cli)
+ [Tutorial: Train a model](tutorial-train-models-with-aml.md)
+ [Tutorial: Deploy an image classification model in Azure Container Instances](tutorial-deploy-models-with-aml.md)

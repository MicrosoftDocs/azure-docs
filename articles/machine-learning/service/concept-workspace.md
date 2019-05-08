---
title: 'What is a workspace'
titleSuffix: Azure Machine Learning service
description: Learn why you need a workspace for Azure Machine Learning service.
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

The workspace keeps a list of compute targets that you can use to train your model. It also keeps a history of the training runs, including logs, metrics, output, and a snapshot of your scripts. You use this information to determine which training run produces the best model.

Once you have a model you like, you register it with the workspace. You use a registered model and scoring scripts to create an image. You can then deploy the image to Azure Container Instances, Azure Kubernetes Service, or to a field-programmable gate array (FPGA) as a REST-based HTTP endpoint. You can also deploy the image to an Azure IoT Edge device as a module.



## Use a workspace

You interact with your workspace through the Azure portal, the Azure Machine Learning SDK for Python, or the Azure Machine Learning CLI.  

### Azure portal

Use the [Azure portal](https://azure.portal.com) to create and interact with your workspace.  In the portal you can:

+ [Create a workspace](setup-create-workspace.md#portal).
+ Build machine learning models without writing code:  
    + Create and explore [automated machine learning experiments (preview)](how-to-create-portal-experiments.md) with a point-and-click interface.
    + Launch the [visual interface (preview) for Azure Machine Learning service](ui-concept-visual-interface.md) to train and deploy models with a drag-and-drop interface.
+ Build and deploy machine learning models with Python notebooks:
    + [Create a Notebook VM (preview)](quickstart-run-cloud-notebook.md) pre-configured with everything you need to run Azure Machine Learning service. 
    + [Launch the Jupyter web interface](quickstart-run-cloud-notebook.md#launch) from your VM and use the included sample notebooks to help you get started.
+ View a history of all your training runs.
+ Manage the compute targets in the workspace.
+ Manage your models, images, and deployments.

### SDK

Use the [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py) to create and interact with your workspace.  With the SDK you can:

+ [Create a workspace](setup-create-workspace.md#sdk).
+ [Run experiments](quickstart-run-local-notebook.md).
+ [Log metrics during training runs](how-to-track-experiments.md).
+ [Use automated machine learning](tutorial-auto-train-models.md).
+ [Train a model](tutorial-train-models-with-aml.md) and register the model in the workspace.
+ Use the registered model to build and image and [deploy the model](tutorial-deploy-models-with-aml.md).  
+ Create and run [machine learning pipelines](how-to-create-your-first-pipeline.md).

### CLI

Use the [Azure Machine Learning CLI](https://docs.microsoft.com/azure/machine-learning/service/reference-azure-machine-learning-cli) to create and interact with your workspace.  Using the CLI you can:

+ [Create a workspace](https://docs.microsoft.com/azure/machine-learning/service/reference-azure-machine-learning-cli#resource-management).
+ [Run experiments](https://docs.microsoft.com/azure/machine-learning/service/reference-azure-machine-learning-cli#experiments).
+ [Register a trained model, and then deploy it as a production service](https://docs.microsoft.com/azure/machine-learning/service/reference-azure-machine-learning-cli#model-registration-profiling-deployment).

## Taxonomy 

A taxonomy of the workspace is illustrated in the following diagram:

[![Workspace taxonomy](./media/concept-azure-machine-learning-architecture/azure-machine-learning-taxonomy.png)](./media/concept-azure-machine-learning-architecture/azure-machine-learning-taxonomy.png#lightbox)

The diagram shows the following components of a workspace:
+ Assign different [user roles](#roles) to others who share your workspace.
+ [Compute targets](concept-azure-machine-learning-architecture.md#compute) are used to run your experiments.
+ When you create the workspace, [associated resources](#resources) are also created for you.
+ [Experiments](concept-azure-machine-learning-architecture.md#experiments) are training runs you use to build your models.  You create and run experiments with the SDK.  Or You can use the Azure portal to run automated machine learning experiments or launch the visual interface to create and run experiments.  
+ Use [pipelines](concept-azure-machine-learning-architecture.md#pipeline) to put together reusable workflows for training and retraining your model.
+ [Datasets](concept-azure-machine-learning-architecture.md#dataset) aid in management of the data you use for model training and pipeline creation.
+ Once you have a model you want to deploy, create a [registered model](concept-azure-machine-learning-architecture.md#model-registry).
+ Use the registered model and a scoring script to create a [registered image](concept-azure-machine-learning-architecture.md#image-registry).
+ Use the registered image to create a [deployment](concept-azure-machine-learning-architecture.md#image-registry).

## <a name="roles"></a>User roles

You can create multiple workspaces, and each workspace can be shared by multiple people. When you share a workspace, you can control access to it by assigning users to the following roles:

* Owner
* Contributor
* Reader

For more information on these roles, see the [Manage access to an Azure Machine Learning workspace](how-to-assign-roles.md) article.

## <a name="resources"></a> Associated resources

When you create a new workspace, it automatically creates several Azure resources that are used by the workspace:

* [Azure Container Registry](https://azure.microsoft.com/services/container-registry/): Registers docker containers that you use during training and when you deploy a model.
* [Azure storage account](https://azure.microsoft.com/services/storage/): Is used as the default datastore for the workspace.
* [Azure Application Insights](https://azure.microsoft.com/services/application-insights/): Stores monitoring information about your models.
* [Azure Key Vault](https://azure.microsoft.com/services/key-vault/): Stores secrets that are used by compute targets and other sensitive information that's needed by the workspace.

> [!NOTE]
> In addition to creating new versions, you can also use existing Azure services.

## Next steps

To get started with Azure Machine Learning service, see:

* [What is Azure Machine Learning service?](overview-what-is-azure-ml.md)
* [Create an Azure Machine Learning service workspace](setup-create-workspace.md)
* [Tutorial: Train a model](tutorial-train-models-with-aml.md)
* [Create a workspace with a Resource Manager template](how-to-create-workspace-template.md)
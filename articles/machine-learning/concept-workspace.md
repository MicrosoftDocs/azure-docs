---
title: 'What is a workspace'
titleSuffix: Azure Machine Learning
description: The workspace is the top-level resource for Azure Machine Learning. It keeps a history of all training runs, with logs, metrics, output, and a snapshot of your scripts. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: sgilley
author: sdgilley
ms.date: 09/22/2020
#Customer intent: As a data scientist, I want to understand the purpose of a workspace for Azure Machine Learning.
---


# What is an Azure Machine Learning workspace?

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning.  The workspace keeps a history of all training runs, including logs, metrics, output, and a snapshot of your scripts. You use this information to determine which training run produces the best model.  

Once you have a model you like, you register it with the workspace. You then use the registered model and scoring scripts to deploy to Azure Container Instances, Azure Kubernetes Service, or to a field-programmable gate array (FPGA) as a REST-based HTTP endpoint. You can also deploy the model to an Azure IoT Edge device as a module.

## Taxonomy 

A taxonomy of the workspace is illustrated in the following diagram:

[![Workspace taxonomy](./media/concept-workspace/azure-machine-learning-taxonomy.png)](./media/concept-workspace/azure-machine-learning-taxonomy.png#lightbox)

The diagram shows the following components of a workspace:

+ A workspace can contain [Azure Machine Learning compute instances](concept-compute-instance.md), cloud resources configured with the Python environment necessary to run Azure Machine Learning.

+ [User roles](how-to-assign-roles.md) enable you to share your workspace with other users, teams, or projects.
+ [Compute targets](concept-azure-machine-learning-architecture.md#compute-targets) are used to run your experiments.
+ When you create the workspace, [associated resources](#resources) are also created for you.
+ [Experiments](concept-azure-machine-learning-architecture.md#experiments) are training runs you use to build your models.  
+ [Pipelines](concept-azure-machine-learning-architecture.md#ml-pipelines) are reusable workflows for training and retraining your model.
+ [Datasets](concept-azure-machine-learning-architecture.md#datasets-and-datastores) aid in management of the data you use for model training and pipeline creation.
+ Once you have a model you want to deploy, you create a registered model.
+ Use the registered model and a scoring script to create a [deployment endpoint](concept-azure-machine-learning-architecture.md#endpoints).

## Tools for workspace interaction

You can interact with your workspace in the following ways:

> [!IMPORTANT]
> Tools marked (preview) below are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

+ On the web:
    + [Azure Machine Learning studio ](https://ml.azure.com) 
    + [Azure Machine Learning designer](concept-designer.md) 
+ In any Python environment with the [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/intro).
+ In any R environment with the [Azure Machine Learning SDK for R (preview)](https://azure.github.io/azureml-sdk-for-r/reference/index.html).
+ On the command line using the Azure Machine Learning [CLI extension](./reference-azure-machine-learning-cli.md)
+ [Azure Machine Learning VS Code Extension](how-to-manage-resources-vscode.md#workspaces)


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

| Workspace management task   | Portal              | Studio | Python SDK / R SDK       | CLI        | VS Code
|---------------------------|---------|---------|------------|------------|------------|
| Create a workspace        | **&check;**     | | **&check;** | **&check;** | **&check;** |
| Manage workspace access    | **&check;**   || |  **&check;**    ||
| Create and manage compute resources    | **&check;**   | **&check;** | **&check;** |  **&check;**   ||
| Create a Notebook VM |   | **&check;** | |     ||

> [!WARNING]
> Moving your Azure Machine Learning workspace to a different subscription, or moving the owning subscription to a new tenant, is not supported. Doing so may cause errors.

## <a name='create-workspace'></a> Create a workspace

There are multiple ways to create a workspace:  

* Use the [Azure portal](how-to-manage-workspace.md?tabs=azure-portal#create-a-workspace) for a point-and-click interface to walk you through each step.
* Use the [Azure Machine Learning SDK for Python](how-to-manage-workspace.md?tabs=python#create-a-workspace) to create a workspace on the fly from Python scripts or Jupyter notebooks
* Use an [Azure Resource Manager template](how-to-create-workspace-template.md) or the [Azure Machine Learning CLI](reference-azure-machine-learning-cli.md) when you need to automate or customize the creation with corporate security standards.
* If you work in Visual Studio Code, use the [VS Code extension](how-to-manage-resources-vscode.md#create-a-workspace).

> [!NOTE]
> The workspace name is case-insensitive.

## <a name="resources"></a> Associated resources

When you create a new workspace, it automatically creates several Azure resources that are used by the workspace:

+ [Azure Storage account](https://azure.microsoft.com/services/storage/): Is used as the default datastore for the workspace.  Jupyter notebooks that are used with your Azure Machine Learning compute instances are stored here as well. 
  
  > [!IMPORTANT]
  > By default, the storage account is a general-purpose v1 account. You can [upgrade this to general-purpose v2](../storage/common/storage-account-upgrade.md) after the workspace has been created. 
  > Do not enable hierarchical namespace on the storage account after upgrading to general-purpose v2.

  To use an existing Azure Storage account, it cannot be of type BlobStorage or a premium account (Premium_LRS and Premium_GRS). It also cannot have a hierarchical namespace (used with Azure Data Lake Storage Gen2). Neither premium storage or hierarchical namespaces are supported with the _default_ storage account of the workspace. You can use premium storage or hierarchical namespace with _non-default_ storage accounts.
  
+ [Azure Container Registry](https://azure.microsoft.com/services/container-registry/): Registers docker containers that you use during training and when you deploy a model. To minimize costs, ACR is **lazy-loaded** until deployment images are created.

+ [Azure Application Insights](https://azure.microsoft.com/services/application-insights/): Stores monitoring information about your models.

+ [Azure Key Vault](https://azure.microsoft.com/services/key-vault/): Stores secrets that are used by compute targets and other sensitive information that's needed by the workspace.

> [!NOTE]
> You can instead use existing Azure resource instances when you create the workspace with the [Python SDK](how-to-manage-workspace.md?tabs=python#create-a-workspace), [R SDK](https://azure.github.io/azureml-sdk-for-r/reference/create_workspace.html), or the Azure Machine Learning CLI [using an ARM template](how-to-create-workspace-template.md).

<a name="wheres-enterprise"></a>

## What happened to Enterprise edition

As of September 2020, all capabilities that were available in Enterprise edition workspaces are now also available in Basic edition workspaces. 
New Enterprise workspaces can no longer be created.  Any SDK, CLI, or Azure Resource Manager calls that use the `sku` parameter will continue to work but a Basic workspace will be provisioned.

Beginning December 21st, all Enterprise Edition workspaces will be automatically set to Basic Edition, which has the same capabilities. No downtime will occur during this process. On January 1, 2021, Enterprise Edition will be formally retired. 

In either editions, customers are responsible for the costs of Azure resources consumed and will not need to pay any additional charges for Azure Machine Learning. Please refer to the [Azure Machine Learning pricing page](https://azure.microsoft.com/pricing/details/machine-learning/) for more details.

## Next steps

To get started with Azure Machine Learning, see:

+ [Azure Machine Learning overview](overview-what-is-azure-ml.md)
+ [Create and manage a workspace](how-to-manage-workspace.md)
+ [Tutorial: Get started with Azure Machine Learning in your development environment](tutorial-1st-experiment-sdk-setup-local.md)
+ [Tutorial: Get started creating your first ML experiment on a compute instance](tutorial-1st-experiment-sdk-setup.md)
+ [Tutorial: Create your first classification model with automated machine learning](tutorial-first-experiment-automated-ml.md) 
+ [Tutorial: Predict automobile price with the designer](tutorial-designer-automobile-price-train-score.md)

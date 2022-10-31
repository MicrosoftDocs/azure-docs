---
title: 'What is a workspace?'
titleSuffix: Azure Machine Learning
description: The workspace is the top-level resource for Azure Machine Learning. It keeps a history of all training runs, with logs, metrics, output, and a snapshot of your scripts. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: event-tier1-build-2022, ignite-2022
ms.topic: conceptual
ms.author: deeikele
author: deeikele
ms.reviewer: sgilley
ms.date: 08/26/2022
#Customer intent: As a data scientist, I want to understand the purpose of a workspace for Azure Machine Learning.
---


# What is an Azure Machine Learning workspace?

The workspace is the top-level resource for Azure Machine Learning, providing a centralized place to work with all the artifacts you create when you use Azure Machine Learning.  The workspace keeps a history of all training runs, including logs, metrics, output, and a snapshot of your scripts. You use this information to determine which training run produces the best model.  

Once you have a model you like, you register it with the workspace. You then use the registered model and scoring scripts to deploy to an [online endpoint](concept-endpoints.md) as a REST-based HTTP endpoint.

## Taxonomy 

+ A workspace can contain [Azure Machine Learning compute instances](concept-compute-instance.md), cloud resources configured with the Python environment necessary to run Azure Machine Learning.

+ [User roles](how-to-assign-roles.md) enable you to share your workspace with other users, teams, or projects.
+ [Compute targets](concept-compute-target.md) are used to run your experiments.
+ When you create the workspace, [associated resources](#associated-resources) are also created for you.
+ Jobs are training runs you use to build your models.  You can organize your jobs into Experiments.
+ [Pipelines](concept-ml-pipelines.md) are reusable workflows for training and retraining your model.
+ [Data assets](concept-data.md) aid in management of the data you use for model training and pipeline creation.
+ Once you have a model you want to deploy, you create a registered model.
+ Use the registered model and a scoring script to create an [online endpoint](concept-endpoints.md).

## Tools for workspace interaction

You can interact with your workspace in the following ways:

+ On the web:
    + [Azure Machine Learning studio ](https://ml.azure.com) 
    + [Azure Machine Learning designer](concept-designer.md) 
+ In any Python environment with the [Azure Machine Learning SDK for Python](https://aka.ms/sdk-v2-install).
+ On the command line using the Azure Machine Learning [CLI extension](how-to-configure-cli.md)
+ [Azure Machine Learning VS Code Extension](how-to-manage-resources-vscode.md#workspaces)

## Machine learning with a workspace

Machine learning tasks read and/or write artifacts to your workspace.

+ Run an experiment to train a model - writes job run results to the workspace.
+ Use automated ML to train a model - writes training results to the workspace.
+ Register a model in the workspace.
+ Deploy a model - uses the registered model to create a deployment.
+ Create and run reusable workflows.
+ View machine learning artifacts such as jobs, pipelines, models, deployments.
+ Track and monitor models.

## Workspace management

You can also perform the following workspace management tasks:

| Workspace management task           | Portal      | Studio      | Python SDK  | Azure CLI   | VS Code     |
|-------------------------------------|-------------|-------------|-------------|-------------|-------------|
| Create a workspace                  | **&check;** | **&check;** | **&check;** | **&check;** | **&check;** |
| Manage workspace access             | **&check;** |             |             | **&check;** |             |
| Create and manage compute resources | **&check;** | **&check;** | **&check;** | **&check;** | **&check;** |
| Create a compute instance           |             | **&check;** | **&check;** | **&check;** | **&check;** |

> [!WARNING]
> Moving your Azure Machine Learning workspace to a different subscription, or moving the owning subscription to a new tenant, is not supported. Doing so may cause errors.

## Create a workspace

There are multiple ways to create a workspace:  

* Use [Azure Machine Learning studio](quickstart-create-resources.md) to quickly create a workspace with default settings.
* Use the [Azure portal](how-to-manage-workspace.md?tabs=azure-portal#create-a-workspace) for a point-and-click interface with more options. 
* Use the [Azure Machine Learning SDK for Python](how-to-manage-workspace.md?tabs=python#create-a-workspace) to create a workspace on the fly from Python scripts or Jupyter notebooks.
* Use an [Azure Resource Manager template](how-to-create-workspace-template.md) or the [Azure Machine Learning CLI](how-to-configure-cli.md) when you need to automate or customize the creation with corporate security standards.
* If you work in Visual Studio Code, use the [VS Code extension](how-to-manage-resources-vscode.md#create-a-workspace).

> [!NOTE]
> The workspace name is case-insensitive.

## Sub resources

These sub resources are the main resources that are made in the AzureML workspace.

* VMs: provide computing power for your AzureML workspace and are an integral part in deploying and training models.
* Load Balancer: a network load balancer is created for each compute instance and compute cluster to manage traffic even while the compute instance/cluster is stopped.
* Virtual Network: these help Azure resources communicate with one another, the internet, and other on-premises networks.
* Bandwidth: encapsulates all outbound data transfers across regions.

## Associated resources

When you create a new workspace, it automatically creates several Azure resources that are used by the workspace:

+ [Azure Storage account](https://azure.microsoft.com/services/storage/): Is used as the default datastore for the workspace.  Jupyter notebooks that are used with your Azure Machine Learning compute instances are stored here as well. 
  
  > [!IMPORTANT]
  > By default, the storage account is a general-purpose v1 account. You can [upgrade this to general-purpose v2](../storage/common/storage-account-upgrade.md) after the workspace has been created. 
  > Do not enable hierarchical namespace on the storage account after upgrading to general-purpose v2.

  To use an existing Azure Storage account, it cannot be of type BlobStorage or a premium account (Premium_LRS and Premium_GRS). It also cannot have a hierarchical namespace (used with Azure Data Lake Storage Gen2). Neither premium storage nor hierarchical namespaces are supported with the _default_ storage account of the workspace. You can use premium storage or hierarchical namespace with _non-default_ storage accounts.
  
+ [Azure Container Registry](https://azure.microsoft.com/services/container-registry/): Registers docker containers that are used for the following components:
    * [Azure Machine Learning environments](concept-environments.md) when training and deploying models
    * [AutoML](concept-automated-ml.md) when deploying
    * [Data profiling](v1/how-to-connect-data-ui.md#data-preview-and-profile)

    To minimize costs, ACR is **lazy-loaded** until images are needed.

    > [!NOTE]
    > If your subscription setting requires adding tags to resources under it, Azure Container Registry (ACR) created by Azure Machine Learning will fail, since we cannot set tags to ACR.

+ [Azure Application Insights](https://azure.microsoft.com/services/application-insights/): Stores monitoring and diagnostics information. For more information, see [Monitor online endpoints](how-to-monitor-online-endpoints.md).

    > [!NOTE]
    > You can delete the Application Insights instance after cluster creation if you want. Deleting it limits the information gathered from the workspace, and may make it more difficult to troubleshoot problems. __If you delete the Application Insights instance created by the workspace, you cannot re-create it without deleting and recreating the workspace__.

+ [Azure Key Vault](https://azure.microsoft.com/services/key-vault/): Stores secrets that are used by compute targets and other sensitive information that's needed by the workspace.

> [!NOTE]
> You can instead use existing Azure resource instances when you create the workspace with the [Python SDK](how-to-manage-workspace.md?tabs=python#create-a-workspace) or the Azure Machine Learning CLI [using an ARM template](how-to-create-workspace-template.md).

## Next steps

To learn more about planning a workspace for your organization's requirements, see [Organize and set up Azure Machine Learning](/azure/cloud-adoption-framework/ready/azure-best-practices/ai-machine-learning-resource-organization).

To get started with Azure Machine Learning, see:

+ [What is Azure Machine Learning?](overview-what-is-azure-machine-learning.md)
+ [Create and manage a workspace](how-to-manage-workspace.md)
+ [Tutorial: Get started with Azure Machine Learning](quickstart-create-resources.md)
+ [Tutorial: Create your first classification model with automated machine learning](tutorial-first-experiment-automated-ml.md) 
+ [Tutorial: Predict automobile price with the designer](tutorial-designer-automobile-price-train-score.md)

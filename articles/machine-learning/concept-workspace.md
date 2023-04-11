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
ms.date: 03/13/2023
monikerRange: 'azureml-api-2 || azureml-api-1'
#Customer intent: As a data scientist, I want to understand the purpose of a workspace for Azure Machine Learning.
---


# What is an Azure Machine Learning workspace?

Workspaces are places to collaborate with colleagues to create machine learning artifacts and group related work. For example, experiments, jobs, datasets, models, components, and inference endpoints. This article describes workspaces, how to manage access to them, and how to use them to organize your work.

Ready to get started? [Create a workspace](#create-a-workspace).

:::image type="content" source="./media/concept-workspace/workspace.png" alt-text="Screenshot of the Azure Machine Learning workspace.":::

## Working with workspaces

For machine learning teams, the workspace is a place to organize their work. To administrators, workspaces serve as containers for access management, cost management and data isolation. Below are some tips for working with workspaces:

+ **Use [user roles](how-to-assign-roles.md)** for permission management in the workspace between users. For example a data scientist, a machine learning engineer or an admin.
+ **Assign access to user groups**: By using Azure Active Directory user groups, you don't have to add individual users to each workspace and other resources the same group of users requires access to.
+ **Create a workspace per project**: While a workspace can be used for multiple projects, limiting it to one project per workspace allows for cost reporting accrued to a project level. It also allows you to manage configurations like datastores in the scope of each project.
+ **Share Azure resources**: Workspaces require you to create several [associated resources](#associated-resources). Share these resources between workspaces to save repetitive setup steps.
+ **Enable self-serve**: Pre-create and secure [associated resources](#associated-resources) as an IT admin, and use [user roles](how-to-assign-roles.md) to let data scientists create workspaces on their own.
+ **Share assets**: You can share assets between workspaces using [Azure Machine Learning registries (preview)](how-to-share-models-pipelines-across-workspaces-with-registries.md).

## What content is stored in a workspace?

Your workspace keeps a history of all training runs, with logs, metrics, output, lineage metadata, and a snapshot of your scripts. As you perform tasks in Azure Machine Learning, artifacts are generated. Their metadata and data are stored in the workspace and on its [associated resources](#associated-resources).  

## Tasks performed within a workspace 

The following constructs you can find and manage within the workspace boundary. 

+ [Compute targets](concept-compute-target.md) are used to run your experiments.
+ Jobs are training runs you use to build your models. You can organize your jobs into Experiments.
+ [Pipelines](concept-ml-pipelines.md) are reusable workflows for training and retraining your model.
+ [Data assets](concept-data.md) aid in management of the data you use for model training and pipeline creation.
+ Once you have a model you want to deploy, you create a registered model.
:::moniker range="azureml-api-2"
+ Use the registered model and a scoring script to create an [online endpoint](concept-endpoints.md).
:::moniker-end
:::moniker range="azureml-api-1"
+ Use the registered model and a scoring script to [deploy the model](./v1/how-to-deploy-and-where.md)
:::moniker-end

## Tools for workspace interaction

You can interact with your workspace in the following ways:

+ On the web:
    + [Azure Machine Learning studio ](https://ml.azure.com) 
    + [Azure Machine Learning designer](concept-designer.md) 
:::moniker range="azureml-api-2"
+ In any Python environment with the [Azure Machine Learning SDK v2 for Python](https://aka.ms/sdk-v2-install).
+ On the command line using the Azure Machine Learning [CLI extension v2](how-to-configure-cli.md)
:::moniker-end
:::moniker range="azureml-api-1"
+ In any Python environment with the [Azure Machine Learning SDK v1 for Python](/python/api/overview/azure/ml/)
+ On the command line using the Azure Machine Learning [CLI extension v1](./v1/reference-azure-machine-learning-cli.md)
:::moniker-end
+ [Azure Machine Learning VS Code Extension](how-to-manage-resources-vscode.md#workspaces)

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
:::moniker range="azureml-api-2"
* Use an [Azure Resource Manager template](how-to-create-workspace-template.md) or the [Azure Machine Learning CLI](how-to-configure-cli.md) when you need to automate or customize the creation with corporate security standards.
:::moniker-end
:::moniker range="azureml-api-1"
* Use an [Azure Resource Manager template](how-to-create-workspace-template.md) or the [Azure Machine Learning CLI](./v1/reference-azure-machine-learning-cli.md) when you need to automate or customize the creation with corporate security standards.
:::moniker-end
* If you work in Visual Studio Code, use the [VS Code extension](how-to-manage-resources-vscode.md#create-a-workspace).

> [!NOTE]
> The workspace name is case-insensitive.

## Sub resources

These sub resources are the main resources that are made in the Azure Machine Learning workspace.

* VMs: provide computing power for your Azure Machine Learning workspace and are an integral part in deploying and training models.
* Load Balancer: a network load balancer is created for each compute instance and compute cluster to manage traffic even while the compute instance/cluster is stopped.
* Virtual Network: these help Azure resources communicate with one another, the internet, and other on-premises networks.
* Bandwidth: encapsulates all outbound data transfers across regions.

## Associated resources

When you create a new workspace, you're required to bring other Azure resources to store your data:

+ [Azure Storage account](https://azure.microsoft.com/services/storage/): Is used as the default datastore for the workspace.  Jupyter notebooks that are used with your Azure Machine Learning compute instances are stored here as well. 
  
  > [!IMPORTANT]
  > By default, the storage account is a general-purpose v1 account. You can [upgrade this to general-purpose v2](../storage/common/storage-account-upgrade.md) after the workspace has been created. 
  > Do not enable hierarchical namespace on the storage account after upgrading to general-purpose v2.

  To use an existing Azure Storage account, it can't be of type BlobStorage or a premium account (Premium_LRS and Premium_GRS). It also can't have a hierarchical namespace (used with Azure Data Lake Storage Gen2). Neither premium storage nor hierarchical namespaces are supported with the _default_ storage account of the workspace. You can use premium storage or hierarchical namespace with _non-default_ storage accounts.
  
+ [Azure Container Registry](https://azure.microsoft.com/services/container-registry/) (ACR): When you build custom docker containers via Azure Machine Learning. For example, in the following scenarios:
    * [Azure Machine Learning environments](concept-environments.md) when training and deploying models
    :::moniker range="azureml-api-2"
    * [AutoML](concept-automated-ml.md) when deploying
    :::moniker-end
    :::moniker range="azureml-api-1"
    * [AutoML](./v1/concept-automated-ml-v1.md) when deploying
    * [Data profiling](v1/how-to-connect-data-ui.md#data-preview-and-profile)
    :::moniker-end

    > [!NOTE] 
    > Workspaces can be created without Azure Container Registry as a dependency if you do not have a need to build custom docker containers. To read container images, Azure Machine Learning also works with external container registries. Azure Container Registry is automatically provisioned when you build custom docker images. Use Azure RBAC to prevent customer docker containers from being build. 

    > [!NOTE]
    > If your subscription setting requires adding tags to resources under it, Azure Container Registry (ACR) created by Azure Machine Learning will fail, since we cannot set tags to ACR.

+ [Azure Application Insights](https://azure.microsoft.com/services/application-insights/): Stores monitoring and diagnostics information. 
    :::moniker range="azureml-api-2"
    For more information, see [Monitor online endpoints](how-to-monitor-online-endpoints.md).
    :::moniker-end

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
+ [Recover a workspace after deletion (soft-delete)](concept-soft-delete.md)
+ [Tutorial: Get started with Azure Machine Learning](quickstart-create-resources.md)
+ [Tutorial: Create your first classification model with automated machine learning](tutorial-first-experiment-automated-ml.md) 
+ [Tutorial: Predict automobile price with the designer](tutorial-designer-automobile-price-train-score.md)

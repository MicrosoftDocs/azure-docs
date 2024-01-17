---
title: 'What is a workspace?'
titleSuffix: Azure Machine Learning
description: The workspace is the top-level resource for Azure Machine Learning. It keeps a history of all training runs, with logs, metrics, output, and a snapshot of your scripts. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: event-tier1-build-2022, ignite-2022, build-2023
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

## Tasks performed within a workspace 

For machine learning teams, the workspace is a place to organize their work. Below are some of the tasks you can start from a workspace:

+ [Create jobs](how-to-train-model.md) - Jobs are training runs you use to build your models. You can group jobs into [experiments](how-to-log-view-metrics.md) to compare metrics.
+ [Author pipelines](concept-ml-pipelines.md) - Pipelines are reusable workflows for training and retraining your model.
+ [Register data assets](concept-data.md) - Data assets aid in management of the data you use for model training and pipeline creation.
+ [Register models](how-to-log-mlflow-models.md) - Once you have a model you want to deploy, you create a registered model.
:::moniker range="azureml-api-2"
+ [Create online endpoints](concept-endpoints.md) - Use a registered model and a scoring script to create an online endpoint.
:::moniker-end
:::moniker range="azureml-api-1"
+ [Deploy a model](./v1/how-to-deploy-and-where.md) - Use the registered model and a scoring script to deploy a model.
:::moniker-end

Besides grouping your machine learning results, workspaces also host resource configurations:

+ [Compute targets](concept-compute-target.md) are used to run your experiments.
+ [Datastores](how-to-datastore.md) define how you and others can connect to data sources when using data assets.
+ [Security settings](tutorial-create-secure-workspace.md) - Networking, identity and access control, and encryption settings.

## Organizing workspaces

For machine learning team leads and administrators, workspaces serve as containers for access management, cost management and data isolation. Below are some tips for organizing workspaces:

+ **Use [user roles](how-to-assign-roles.md)** for permission management in the workspace between users. For example a data scientist, a machine learning engineer or an admin.
+ **Assign access to user groups**: By using Microsoft Entra user groups, you don't have to add individual users to each workspace, and to other resources the same group of users requires access to.
+ **Create a workspace per project**: While a workspace can be used for multiple projects, limiting it to one project per workspace allows for cost reporting accrued to a project level. It also allows you to manage configurations like datastores in the scope of each project.
+ **Share Azure resources**: Workspaces require you to create several [associated resources](#associated-resources). Share these resources between workspaces to save repetitive setup steps.
+ **Enable self-serve**: Pre-create and secure [associated resources](#associated-resources) as an IT admin, and use [user roles](how-to-assign-roles.md) to let data scientists create workspaces on their own.
+ **Share assets**: You can share assets between workspaces using [Azure Machine Learning registries](how-to-share-models-pipelines-across-workspaces-with-registries.md).

## How is my content stored in a workspace?

Your workspace keeps a history of all training runs, with logs, metrics, output, lineage metadata, and a snapshot of your scripts. As you perform tasks in Azure Machine Learning, artifacts are generated. Their metadata and data are stored in the workspace and on its associated resources.

## Associated resources

When you create a new workspace, you're required to bring other Azure resources to store your data. If not provided by you, these resources will automatically be created by Azure Machine Learning.

+ [Azure Storage account](https://azure.microsoft.com/services/storage/). Stores machine learning artifacts such as job logs. By default, this storage account is used when you upload data to the workspace. Jupyter notebooks that are used with your Azure Machine Learning compute instances are stored here as well. 
  
  > [!IMPORTANT]
  > To use an existing Azure Storage account, it can't be of type BlobStorage, a premium account (Premium_LRS and Premium_GRS) and cannot have a hierarchical namespace (used with Azure Data Lake Storage Gen2). You can use premium storage or hierarchical namespace as additional storage by [creating a datastore](how-to-datastore.md).
  > Do not enable hierarchical namespace on the storage account after upgrading to general-purpose v2.
  > If you bring an existing general-purpose v1 storage account, you may [upgrade this to general-purpose v2](../storage/common/storage-account-upgrade.md) after the workspace has been created.
  
+ [Azure Container Registry](https://azure.microsoft.com/services/container-registry/). Stores created docker containers, when you build custom environments via Azure Machine Learning. Scenarios that trigger creation of custom environments include AutoML when deploying models and data profiling.

    > [!NOTE] 
    > Workspaces can be created without Azure Container Registry as a dependency if you do not have a need to build custom docker containers. To read container images, Azure Machine Learning also works with external container registries. Azure Container Registry is automatically provisioned when you build custom docker images. Use Azure RBAC to prevent customer docker containers from being built. 

    > [!NOTE]
    > If your subscription setting requires adding tags to resources under it, Azure Container Registry (ACR) created by Azure Machine Learning will fail, since we cannot set tags to ACR.

+ [Azure Application Insights](https://azure.microsoft.com/services/application-insights/). Helps you monitor and collect diagnostic information from your inference endpoints. 
    :::moniker range="azureml-api-2"
    For more information, see [Monitor online endpoints](how-to-monitor-online-endpoints.md).
    :::moniker-end

+ [Azure Key Vault](https://azure.microsoft.com/services/key-vault/). Stores secrets that are used by compute targets and other sensitive information that's needed by the workspace.

## Create a workspace

There are multiple ways to create a workspace. To get started use one of the following options:

* The [Azure Machine Learning studio](quickstart-create-resources.md) lets you quickly create a workspace with default settings.
* Use [Azure portal](how-to-manage-workspace.md?tabs=azure-portal#create-a-workspace) for a point-and-click interface with more security options. 
* Use the [VS Code extension](how-to-manage-resources-vscode.md#create-a-workspace) if you work in Visual Studio Code.

To automate workspace creation using your preferred security settings:
* [Azure Resource Manager / Bicep templates](how-to-create-workspace-template.md) provide a declarative syntax to deploy Azure resources. An alternative option is to use [Terraform](how-to-manage-workspace-terraform.md). Also see [How to create a secure workspace by using a template](tutorial-create-secure-workspace-template.md).
:::moniker range="azureml-api-2"
* Use the [Azure Machine Learning CLI](how-to-configure-cli.md) or [Azure Machine Learning SDK for Python](how-to-manage-workspace.md?tabs=python#create-a-workspace) for prototyping and as part of your [MLOps workflows](concept-model-management-and-deployment.md).
:::moniker-end
:::moniker range="azureml-api-1"
* Use the [Azure Machine Learning CLI](./v1/reference-azure-machine-learning-cli.md) or [Azure Machine Learning SDK for Python](how-to-manage-workspace.md?tabs=python#create-a-workspace) for prototyping and as part of your [MLOps workflows](concept-model-management-and-deployment.md).
:::moniker-end
* Use [REST APIs](how-to-manage-rest.md) directly in scripting environment, for platform integration or in MLOps workfows.

## Tools for workspace interaction and management

Once your workspace is set up, you can interact with it in the following ways:

+ On the web:
    + [Azure Machine Learning studio ](https://ml.azure.com) 
    + [Azure Machine Learning designer](concept-designer.md) 
:::moniker range="azureml-api-2"
+ In any Python environment with the [Azure Machine Learning SDK](https://aka.ms/sdk-v2-install).
+ On the command line using the Azure Machine Learning [CLI extension v2](how-to-configure-cli.md)
:::moniker-end
:::moniker range="azureml-api-1"
+ In any Python environment with the [Azure Machine Learning SDK](/python/api/overview/azure/ml/)
+ On the command line using the Azure Machine Learning [CLI extension v1](./v1/reference-azure-machine-learning-cli.md)
:::moniker-end
+ [Azure Machine Learning VS Code Extension](how-to-manage-resources-vscode.md#workspaces)

The following workspace management tasks are available in each interface.

| Workspace management task           | Portal      | Studio      | Python SDK  | Azure CLI   | VS Code     |
|-------------------------------------|-------------|-------------|-------------|-------------|-------------|
| Create a workspace                  | **&check;** | **&check;** | **&check;** | **&check;** | **&check;** |
| Manage workspace access             | **&check;** |             |             | **&check;** |             |
| Create and manage compute resources | **&check;** | **&check;** | **&check;** | **&check;** | **&check;** |
| Create a compute instance           |             | **&check;** | **&check;** | **&check;** | **&check;** |

> [!WARNING]
> Moving your Azure Machine Learning workspace to a different subscription, or moving the owning subscription to a new tenant, is not supported. Doing so may cause errors.

## Sub resources

When you create compute clusters and compute instances in Azure Machine Learning, sub resources are created.

* VMs: provide computing power for compute instances and compute clusters, which you use to run jobs.
* Load Balancer: a network load balancer is created for each compute instance and compute cluster to manage traffic even while the compute instance/cluster is stopped.
* Virtual Network: these help Azure resources communicate with one another, the internet, and other on-premises networks.
* Bandwidth: encapsulates all outbound data transfers across regions.

## Next steps

To learn more about planning a workspace for your organization's requirements, see [Organize and set up Azure Machine Learning](/azure/cloud-adoption-framework/ready/azure-best-practices/ai-machine-learning-resource-organization).

To get started with Azure Machine Learning, see:

+ [What is Azure Machine Learning?](overview-what-is-azure-machine-learning.md)
+ [Create and manage a workspace](how-to-manage-workspace.md)
+ [Recover a workspace after deletion (soft-delete)](concept-soft-delete.md)
+ [Get started with Azure Machine Learning](quickstart-create-resources.md)
+ [Tutorial: Create your first classification model with automated machine learning](tutorial-first-experiment-automated-ml.md) 

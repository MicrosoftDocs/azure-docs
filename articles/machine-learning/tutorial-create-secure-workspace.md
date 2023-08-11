---
title: Create a secure workspace with a managed virtual network
titleSuffix: Azure Machine Learning
description: Create an Azure Machine Learning workspace and required Azure services inside a managed virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 08/11/2023
ms.topic: how-to
monikerRange: 'azureml-api-2 || azureml-api-1'
---
# Tutorial: How to create a secure workspace with a managed virtual network

In this article, learn how to create and connect to a secure Azure Machine Learning workspace. The steps in this article use an Azure machine learning managed network to create a security boundary around resources used by Azure Machine Learning.

In this tutorial, you accomplish the following tasks:

> [!div class="checklist"]
> * Create an Azure Storage Account (blob and file). This service is used as __default storage for the workspace__.
> * Create an Azure Key Vault. This service is used to __store secrets used by the workspace__. For example, the security information needed to access the storage account.
> * Create an Azure Container Registry (ACR). This service is used as a repository for Docker images. __Docker images provide the compute environments needed when training a machine learning model or deploying a trained model as an endpoint__.
> * Create an Azure Machine Learning workspace.
> * Create an Azure Machine Learning compute cluster. A compute cluster is used when __training machine learning models in the cloud__.

After completing this tutorial, you'll have the following architecture:

* An Azure Machine Learning workspace that uses a private endpoint to communicate using the managed network.
* An Azure Storage Account that uses private endpoints to allow storage services such as blob and file to communicate using the managed network.
* An Azure Container Registry that uses a private endpoint communicate using the managed network.
* An Azure Machine Learning compute instance and compute cluster secured by the managed network.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

## Create a storage account

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Storage account__. Select the __Storage Account__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __region__ you plan to use for your workspace. Enter a unique __Storage account name__, and set __Redundancy__ to __Locally-redundant storage (LRS)__.

1. Select __Review__. Verify that the information is correct, and then select __Create__.

## Create a key vault

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Key Vault__. Select the __Key Vault__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __region__ you plan to use for your workspace. Enter a unique __Key vault name__. Leave the other fields at the default value.

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

## Create a container registry

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Container Registry__. Select the __Container Registry__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __location__ you plan to use for your workspace. Enter a unique __Registry name__ and set the __SKU__ to __Premium__.

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

1. Once the deployment finishes, select __Go to resource__.

1. From the left navigation, select __Settings__, __Access keys__, and then enable __Admin user__. This setting is required when using Azure Container Registry inside a virtual network with Azure Machine Learning.

## Create a workspace

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Machine Learning__. Select the __Machine Learning__ entry, and then select __Create__.

1. From the __Basics__ tab, select the __subscription__, __resource group__, and __Region__ you previously used for the virtual network. Use the following values for the other fields:
    * __Workspace name__: A unique name for your workspace.
    * __Storage account__: Select the storage account you created previously.
    * __Key vault__: Select the key vault you created previously.
    * __Application insights__: Use the default value.
    * __Container registry__: Use the container registry you created previously.

1. From the __Networking__ tab, select __Private with Internet Outbound__.
1. In the __Workspace outbound access__ at the bottom of the page, use __+ add user-defined outbound rules__ to add the following outbound rules. Select __Save__ after populating the fields for each rule: 

    __Storage (blob)__ 

    * __Rule name__: `StorageBlob`
    * __Destination type__: `Private Endpoint`
    * __Subscription__: Your Azure subscription.
    * __Resource group__: The resource group for your workspace.
    * __Resource type__: `Microsoft.Storage/storageAccounts`
    * __Resource name__: Select the storage account you created previously.
    * __Sub Resource__: `blob`
    * __Spark enabled__: Leave this option disabled. For more information on using Spark jobs with a managed network, see [Network isolation with managed networks](how-to-managed-network.md).

    __Storage (file)__ 

    * __Rule name__: `StorageFile`
    * __Destination type__: `Private Endpoint`
    * __Subscription__: Your Azure subscription.
    * __Resource group__: The resource group for your workspace.
    * __Resource type__: `Microsoft.Storage/storageAccounts`
    * __Resource name__: Select the storage account you created previously.
    * __Sub Resource__: `file`
    * __Spark enabled__: Leave this option disabled. For more information on using Spark jobs with a managed network, see [Network isolation with managed networks](how-to-managed-network.md).

    __Key vault__

    * __Rule name__: `KeyVault`
    * __Destination type__: `Private Endpoint`
    * __Subscription__: Your Azure subscription.
    * __Resource group__: The resource group for your workspace.
    * __Resource type__: `Microsoft.KeyVault/vaults`
    * __Resource name__: Select the vault you created previously.
    * __Sub Resource__: `vault`

    __Container registry__

    * __Rule name__: `KeyVault`
    * __Destination type__: `Private Endpoint`
    * __Subscription__: Your Azure subscription.
    * __Resource group__: The resource group for your workspace.
    * __Resource type__: `Microsoft.ContainerRegistry/registries`
    * __Resource name__: Select the container registry you created previously.
    * __Sub Resource__: `registry`

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.
1. Once the workspace has been created, select __Go to resource__.

## Connect to the workspace

1. From the __Overview__ page for your workspace, select __Launch studio__. 

## Create compute instance

1. From studio, select __Compute__, __Compute instances__, and then __+ New__.
    
1. From the __Configure required settings__ dialog, enter a unique value as the __Compute name__.

1. Select __Create__. The compute instance will take a few minutes to create. The compute instance will be created within the managed network.

    > [!TIP]
    > It may take several minutes to create the first compute resource. This delay is because the managed virtual network is also being created. The managed virtual network isn't created until the first compute resource is created. Subsequent managed compute resources will be created much faster.

## Use the workspace

At this point, you can use the studio to interactively work with notebooks on the compute instance and run training jobs on the compute cluster. For a tutorial on using the compute instance and compute cluster, see [Tutorial: Model development](tutorial-cloud-workstation.md).

## Stop compute instance

> [!WARNING]
> While it is running (started), the compute instance and jump box will continue charging your subscription. To avoid excess cost, __stop__ them when they are not in use.

The compute cluster dynamically scales between the minimum and maximum node count set when you created it. If you accepted the defaults, the minimum is 0, which effectively turns off the cluster when not in use.

### Stop the compute instance

From studio, select __Compute__, __Compute instances__, and then select the compute instance. Finally, select __Stop__ from the top of the page.

:::image type="content" source="./media/tutorial-create-secure-workspace/compute-instance-stop.png" alt-text="Screenshot of stop button for compute instance":::

## Clean up resources

If you plan to continue using the secured workspace and other resources, skip this section.

To delete all resources created in this tutorial, use the following steps:

1. In the Azure portal, select __Resource groups__ on the far left.
1. From the list, select the resource group that you created in this tutorial.
1. Select __Delete resource group__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/delete-resources.png" alt-text="Screenshot of delete resource group button":::

1. Enter the resource group name, then select __Delete__.

## Next steps

Now that you've created a secure workspace and can access studio, learn how to [deploy a model to an online endpoint with network isolation](how-to-secure-online-endpoint.md).


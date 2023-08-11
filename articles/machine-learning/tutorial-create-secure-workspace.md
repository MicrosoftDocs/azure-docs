---
title: Create a secure workspace
titleSuffix: Azure Machine Learning
description: Create an Azure Machine Learning workspace and required Azure services inside a secure virtual network.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 09/06/2022
ms.topic: how-to
ms.custom: subject-rbac-steps, cliv2, event-tier1-build-2022, ignite-2022, build-2023
monikerRange: 'azureml-api-2 || azureml-api-1'
---
# Tutorial: How to create a secure workspace

In this article, learn how to create and connect to a secure Azure Machine Learning workspace. The steps in this article use an Azure machine learning managed network to create a security boundary around resources used by Azure Machine Learning.

In this tutorial, you accomplish the following tasks:

> [!div class="checklist"]
> * Create an Azure Storage Account (blob and file). This service is used as __default storage for the workspace__.
> * Create an Azure Key Vault. This service is used to __store secrets used by the workspace__. For example, the security information needed to access the storage account.
> * Create an Azure Container Registry (ACR). This service is used as a repository for Docker images. __Docker images provide the compute environments needed when training a machine learning model or deploying a trained model as an endpoint__.
> * Create an Azure Machine Learning workspace.
> * Create an Azure Machine Learning compute cluster. A compute cluster is used when __training machine learning models in the cloud__. In configurations where Azure Container Registry is behind the VNet, it is also used to build Docker images.

After completing this tutorial, you'll have the following architecture:

* An Azure Machine Learning workspace that uses a private endpoint to communicate using the managed network.
* An Azure Storage Account that uses private endpoints to allow storage services such as blob and file to communicate using the managed network.
* An Azure Container Registry that uses a private endpoint communicate using the managed network.
* An Azure Machine Learning compute instance and compute cluster secured by the managed network.

## Prerequisites


## Create a storage account

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Storage account__. Select the __Storage Account__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __region__ you previously used for the virtual network. Enter a unique __Storage account name__, and set __Redundancy__ to __Locally-redundant storage (LRS)__.

1. From the __Networking__ tab, select __Enable public access from selected virtual networks and IP addresses__.

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

1. Once the Storage Account has been created, select __Go to resource__:

1. From the left navigation, select __Networking__. From __Firewalls and virtual networks__, select __Add your client IP address__. This setting allows your client to access the storage account.

1. Select __Save__ to save this change.

## Create a key vault

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Key Vault__. Select the __Key Vault__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __region__ you previously used for the virtual network. Enter a unique __Key vault name__. Leave the other fields at the default value.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-key-vault.png" alt-text="Create a new key vault":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

## Create a container registry

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Container Registry__. Select the __Container Registry__ entry, and then select __Create__.
1. From the __Basics__ tab, select the __subscription__, __resource group__, and __location__ you previously used for the virtual network. Enter a unique __Registry name__ and set the __SKU__ to __Premium__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-container-registry.png" alt-text="Create a container registry":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.
1. After the container registry has been created, select __Go to resource__.

1. From the left navigation, select __Access keys__, and then enable __Admin user__. This setting is required when using Azure Container Registry inside a virtual network with Azure Machine Learning.

1. From the left navigation, select __Networking__. From __Public access__, select __Selected networks__. Make sure __Allow trusted Microsoft services to access this container registery_ is selected.
1. Select __Save__ to save this change.

## Create a workspace

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Machine Learning__. Select the __Machine Learning__ entry, and then select __Create__.

1. From the __Basics__ tab, select the __subscription__, __resource group__, and __Region__ you previously used for the virtual network. Use the following values for the other fields:
    * __Workspace name__: A unique name for your workspace.
    * __Storage account__: Select the storage account you created previously.
    * __Key vault__: Select the key vault you created previously.
    * __Application insights__: Use the default value.
    * __Container registry__: Use the container registry you created previously.

1. From the __Networking__ tab, select __Private with Internet Outbound__.
1. Select __Review + create__. Verify that the information is correct, and then select __Create__.
1. Once the workspace has been created, select __Go to resource__.


## Connect to the workspace

1. From the __Overview__ page for your workspace, select __Launch studio__. 

## Create a compute cluster and compute instance

1. From studio, select __Compute__, __Compute clusters__, and then __+ New__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/studio-new-compute-cluster.png" alt-text="Screenshot of new compute cluster workflow":::

1. From the __Virtual Machine__ dialog, select __Next__ to accept the default virtual machine configuration.

    :::image type="content" source="./media/tutorial-create-secure-workspace/studio-new-compute-vm.png" alt-text="Screenshot of compute cluster vm settings":::
    
1. From the __Configure Settings__ dialog, enter __cpu-cluster__ as the __Compute name__. 

1. From studio, select __Compute__, __Compute instance__, and then __+ New__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-compute-instance.png" alt-text="Screenshot of new compute instance workflow":::

1. From the __Virtual Machine__ dialog, enter a unique __Computer name__, and then select __Create__.

## Use the workspace

> [!IMPORTANT]
> The steps in this article put Azure Container Registry behind the VNet. In this configuration, you cannot deploy a model to Azure Container Instances inside the VNet. We do not recommend using Azure Container Instances with Azure Machine Learning in a virtual network. For more information, see [Secure the inference environment (SDK/CLI v1)](./v1/how-to-secure-inferencing-vnet.md).
>
> As an alternative to Azure Container Instances, try Azure Machine Learning managed online endpoints. For more information, see [Enable network isolation for managed online endpoints](how-to-secure-online-endpoint.md).

At this point, you can use the studio to interactively work with notebooks on the compute instance and run training jobs on the compute cluster. For a tutorial on using the compute instance and compute cluster, see [Tutorial: Azure Machine Learning in a day](tutorial-azure-ml-in-a-day.md).

## Stop compute instance

> [!WARNING]
> While it is running (started), the compute instance and jump box will continue charging your subscription. To avoid excess cost, __stop__ them when they are not in use.

The compute cluster dynamically scales between the minimum and maximum node count set when you created it. If you accepted the defaults, the minimum is 0, which effectively turns off the cluster when not in use.
### Stop the compute instance

From studio, select __Compute__, __Compute clusters__, and then select the compute instance. Finally, select __Stop__ from the top of the page.

:::image type="content" source="./media/tutorial-create-secure-workspace/compute-instance-stop.png" alt-text="Screenshot of stop button for compute instance":::
### Stop the jump box

Once it has been created, select the virtual machine in the Azure portal and then use the __Stop__ button. When you're ready to use it again, use the __Start__ button to start it.

:::image type="content" source="./media/tutorial-create-secure-workspace/virtual-machine-stop.png" alt-text="Screenshot of stop button for the VM":::


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


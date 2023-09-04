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

In this article, learn how to create and connect to a secure Azure Machine Learning workspace. The steps in this article use an Azure Machine Learning managed virtual network to create a security boundary around resources used by Azure Machine Learning.

In this tutorial, you accomplish the following tasks:

> [!div class="checklist"]
> * Create an Azure Machine Learning workspace configured to use a managed virtual network.
> * Create an Azure Machine Learning compute cluster. A compute cluster is used when __training machine learning models in the cloud__.

After completing this tutorial, you'll have the following architecture:

* An Azure Machine Learning workspace that uses a private endpoint to communicate using the managed network.
* An Azure Storage Account that uses private endpoints to allow storage services such as blob and file to communicate using the managed network.
* An Azure Container Registry that uses a private endpoint communicate using the managed network.
* An Azure Key Vault that uses a private endpoint to communicate using the managed network.
* An Azure Machine Learning compute instance and compute cluster secured by the managed network.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

## Create a workspace

1. In the [Azure portal](https://portal.azure.com), select the portal menu in the upper left corner. From the menu, select __+ Create a resource__ and then enter __Azure Machine Learning__. Select the __Azure Machine Learning__ entry, and then select __Create__.

1. From the __Basics__ tab, select the __subscription__, __resource group__, and __Region__ to create the service in. If you don't have an existing resource group, select __Create new__ to create one. Enter a unique name for the __Workspace name__. Leave the rest of the fields at the default values; new instances of the required services are created for the workspace.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-workspace.png" alt-text="Screenshot of the workspace creation form.":::

1. From the __Networking__ tab, select __Private with Internet Outbound__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/private-internet-outbound.png" alt-text="Screenshot of the workspace network tab with internet outbound selected.":::

1. Select __Review + create__. Verify that the information is correct, and then select __Create__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/review-create-machine-learning.png" alt-text="Screenshot of the review page for workspace creation.":::

1. Once the workspace has been created, select __Go to resource__.

## Connect to the workspace

From the __Overview__ page for your workspace, select __Launch studio__. 

> [!TIP]
> You can also go to the [Azure Machine Learning studio](https://ml.azure.com) and select your workspace from the list.

:::image type="content" source="./media/tutorial-create-secure-workspace/launch-studio.png" alt-text="Screenshot of the studio button in the Azure portal.":::

## Create compute instance

1. From studio, select __Compute__, __Compute instances__, and then __+ New__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/create-new-compute-instance.png" alt-text="Screenshot of the new compute option in studio.":::
    
1. From the __Configure required settings__ dialog, enter a unique value as the __Compute name__. Leave the rest of the selections at the default value.

1. Select __Create__. The compute instance takes a few minutes to create. The compute instance is created within the managed network.

    > [!TIP]
    > It may take several minutes to create the first compute resource. This delay occurs because the managed virtual network is also being created. The managed virtual network isn't created until the first compute resource is created. Subsequent managed compute resources will be created much faster.

## Use the workspace

At this point, you can use the studio to interactively work with notebooks on the compute instance and run training jobs on the compute cluster. For a tutorial on using the compute instance and compute cluster, see [Tutorial: Model development](tutorial-cloud-workstation.md).

## Stop compute instance

While it's running (started), the compute instance continues charging your subscription. To avoid excess cost, __stop__ it when not in use.

From studio, select __Compute__, __Compute instances__, and then select the compute instance. Finally, select __Stop__ from the top of the page.

:::image type="content" source="./media/tutorial-create-secure-workspace/compute-instance-stop.png" alt-text="Screenshot of stop button for compute instance":::

## Clean up resources

If you plan to continue using the secured workspace and other resources, skip this section.

To delete all resources created in this tutorial, use the following steps:

1. In the Azure portal, select __Resource groups__.
1. From the list, select the resource group that you created in this tutorial.
1. Select __Delete resource group__.

    :::image type="content" source="./media/tutorial-create-secure-workspace/delete-resources.png" alt-text="Screenshot of delete resource group button":::

1. Enter the resource group name, then select __Delete__.

## Next steps

Now that you've created a secure workspace and can access studio, learn how to [deploy a model to an online endpoint with network isolation](how-to-secure-online-endpoint.md).

For more information on the managed virtual network, see [Secure your workspace with a managed virtual network](how-to-managed-network.md).
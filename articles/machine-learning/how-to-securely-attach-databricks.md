---
title: Attach a secured Azure Databricks compute
titleSuffix: Azure Machine Learning
description: Use a private endpoint to attach an Azure Databricks compute to an Azure Machine Learning workspace configured for network isolation.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 01/19/2023
ms.topic: how-to
ms.custom: security
monikerRange: 'azureml-api-2 || azureml-api-1'
---

# Attach an Azure Databricks compute that is secured in a virtual network (VNet)

Both Azure Machine Learning and Azure Databricks can be secured by using a VNet to restrict incoming and outgoing network communication. When both services are configured to use a VNet, you can use a private endpoint to allow Azure Machine Learning to attach Azure Databricks as a compute resource.

## Prerequisites

* An Azure Machine Learning workspace that is configured for network isolation.

* An [Azure Databricks deployment that is configured in a virtual network (VNet injection)](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

    > [!IMPORTANT]
    > Azure Databricks requires two subnets (sometimes called the private and public subnet). Both of these subnets are delegated, and cannot be used by the Azure Machine Learning workspace when creating a private endpoint. We recommend adding a third subnet to the VNet used by Azure Databricks and using this subnet for the private endpoint.

* The VNets used by Azure Machine Learning and Azure Databricks must use a different set of IP address ranges.

## Create a private endpoint

1. From the [Azure portal](https://portal.azure.com), select your Azure Machine Learning workspace.

1. From the sidebar, select __Networking__, __Private endpoint connections__, and then __+ Private endpoint__.

    :::image type="content" source="./media/how-to-securely-attach-databricks/add-private-endpoint.png" alt-text="Screenshot of the private endpoints connection page.":::

1. From the __Create a private endpoint__ form, enter a name for the new private endpoint. Adjust the other values as needed by your scenario.

    :::image type="content" source="./media/how-to-securely-attach-databricks/private-endpoint-basics.png" alt-text="Screenshot of the basics section of the private endpoint wizard.":::

1. Select __Next__ until you arrive at the __Virtual Network__ tab. Select the __Virtual network__ that is used by Azure Databricks, and the __Subnet__ to connect to using the private endpoint.

    :::image type="content" source="./media/how-to-securely-attach-databricks/private-endpoint-virtual-network.png" alt-text="Screenshot of the virtual network section of the private endpoint wizard.":::

1. Select __Next__ until you can select __Create__ to create the resource. 

## Attach the Azure Databricks compute

1. From [Azure Machine Learning studio](https://ml.azure.com), select your workspace and then select __Compute__ from the sidebar. Select __Attached computes__, __+ New__, and then __Azure Databricks__.

    :::image type="content" source="./media/how-to-securely-attach-databricks/add-attached-compute.png" alt-text="Screenshot of the add a compute page.":::

1. From the __Attach Databricks compute__ form, provide the following information:

    * __Compute name__: The name of the compute you're adding. This value can be different than the name of your Azure Databricks workspace.
    * __Subscription__: The subscription that contains the Azure Databricks workspace.
    * __Databricks workspace__: The Azure Databricks workspace that you're attaching.
    * __Databricks access token__: For information on generating a token, see [Azure Databricks personal access tokens](/azure/databricks/dev-tools/auth#pat).

    Select __Attach__ to complete the process.

    :::image type="content" source="./media/how-to-securely-attach-databricks/attach-databricks.png" alt-text="Screenshot of the attach Databricks compute page.":::

## Next steps

* [Manage compute resources for training and deployment](how-to-create-attach-compute-studio.md)
---
title: include file
description: include file
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 03/25/2019
ms.author: robinsh
ms.custom: include file
---
## Create base resources

Before you can configure the message routing, you need to create an IoT hub, a storage account, and a Service Bus queue. These resources can be created using one of the four articles that are available for Part 1 of this tutorial: the Azure portal, an Azure Resource Manager template, the Azure CLI, or Azure PowerShell.

Use the same resource group and location for all of the resources. Then at the end, you can remove all of the resources in one step by deleting the resource group.

Below is a summary of the steps to be performed in the following sections: 

1. Create a [resource group](../articles/azure-resource-manager/management/overview.md).

2. Create an IoT hub in the S1 tier. Add a consumer group to your IoT hub. The consumer group is used by the Azure Stream Analytics when retrieving data.

   > [!NOTE]
   > You must use an Iot hub in a paid tier to complete this tutorial. The free tier only allows you to set up one endpoint, and this tutorial requires multiple endpoints.
   > 

3. Create a standard V1 storage account with Standard_LRS replication.

4. Create a Service Bus namespace and queue.

5. Create a device identity for the simulated device that sends messages to your hub. Save the key for the testing phase. (If creating a Resource Manager template, this is done after deploying the template.)
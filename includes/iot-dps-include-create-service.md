---
title: include file
description: include file
author: raharri
ms.service: iot-dps
services: iot-dps
ms.topic: include
ms.date: 05/06/2021
ms.author: raharri
ms.custom: include file
---

This section describes how to create an IoT Hub device provisioning service using the [Azure portal](https://portal.azure.com).

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure homepage, select the **+ Create a resource** button, and then enter *device provisioning service* in the **Search the Marketplace** field.

1. Select **IoT Hub Device Provisioning Service** from the search results, and then select **Create**.

1. On the **Basics** tab, complete the fields as follows:

   - **Subscription**: Select the subscription to use for your service.

   - **Resource Group**: Select a resource group or create a new one. To create a new one, select **Create new** and fill in the name you want to use. To use an existing resource group, select that resource group. For more information, see [Manage Azure Resource Manager resource groups](../articles/azure-resource-manager/management/manage-resource-groups-portal.md).

   - **Region**: Select the region in which you want your service to be located. Select the location closest to you.

   - **Name**: Enter a name for your device provisioning service. This name must be globally unique.

1. Select **Next: Networking** to continue creating your hub.

   Choose the endpoints that can connect to your IoT Hub. You can select the default setting **Public endpoint (all networks)** or **Private endpoint**. Accept the default setting for this example.

1. Select **Next: Management** to continue creating your hub. This tab is purely informational: you can only create a Device Provisioning Service in the S1 tier as described.

1. Select **Next: Tags** to continue to the next screen.

    Tags are name/value pairs. You can assign the same tag to multiple resources and resource groups to categorize resources and consolidate billing. For more information, see [Use tags to organize your Azure resources](../articles/azure-resource-manager/management/tag-resources.md).

1. Select **Next: Review + create** to review your choices.

1. Select **Create** to create your new hub. Creating the hub takes a few minutes.
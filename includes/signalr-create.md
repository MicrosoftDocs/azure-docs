---
title: "include file"
description: "include file"
services: signalr
author: wesmc7777
ms.service: signalr
ms.topic: "include"
ms.date: 04/17/2018
ms.author: wesmc
ms.custom: "include file"
---


1. To create an Azure SignalR Service resource, first sign in to the [Azure portal](https://portal.azure.com). In the upper-left side of the page, select **+ Create a resource**. In the **Search the Marketplace** text box, enter **SignalR Service**.

2. Select **SignalR Service** in the results, and select **Create**.

3. On the new **SignalR** settings page, add the following settings for your new SignalR resource:

    | Name | Recommended value | Description |
    | ---- | ----------------- | ----------- |
    | Resource name | *testsignalr* | Enter a unique resource name to use for the SignalR resource. The name must be a string of 1 to 63 characters and contain only numbers, letters, and the hyphen (`-`) character. The name cannot start or end with the hyphen character, and consecutive hyphen characters are not valid.|
    | Subscription | Choose your subscription |  Select the Azure subscription that you want to use to test SignalR. If your account has only one subscription, it's automatically selected and the **Subscription** drop-down isn't displayed.|
    | Resource group | Create a resource group named *SignalRTestResources*| Select or create a resource group for your SignalR resource. This group is useful for organizing multiple resources that you might want to delete at the same time by deleting the resource group. For more information, see [Using resource groups to manage your Azure resources](../articles/azure-resource-manager/management/overview.md). |
    | Location | *East US* | Use **Location** to specify the geographic location in which your SignalR resource is hosted. For the best performance, we recommend that you create the resource in the same region as other components of your application. |
    | Pricing tier | *Free* | Currently, **Free** and **Standard** options are available. |
    | Pin to dashboard | ✔ | Select this box to have the resource pinned to your dashboard so it's easier to find. |

4. Select **Create**. The deployment might take a few minutes to complete.

5. After the deployment is complete, select **Keys** under **SETTINGS**. Copy your connection string for the primary key. You'll use this string later to configure your app to use the Azure SignalR Service resource.

    The connection string will have the following form:
    
        Endpoint=<service_endpoint>;AccessKey=<access_key>;

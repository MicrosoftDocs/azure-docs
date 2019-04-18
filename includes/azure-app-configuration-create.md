---
title: include file
description: include file
services: azure-app-configuration
author: yegu

ms.service: azure-app-configuration
ms.topic: include
ms.date: 01/22/2019
ms.author: yegu
ms.custom: include file
---

1. To create a new app configuration store, sign in to the [Azure portal](https://aka.ms/azconfig/portal). In the upper-left corner of the page, select **+ Create a resource**. In the **Search the Marketplace** box, enter **App Configuration** and press Enter.

    ![Search for App Configuration](../articles/azure-app-configuration/media/quickstarts/azure-app-configuration-new.png)

2. Select **App Configuration** from the search results, and then select **Create**.

3. On the **App Configuration** > **Create** page, enter the following settings.

    | Setting | Suggested value | Description |
    |---|---|---|
    | **Resource name** | Globally unique name | Enter a unique resource name to use for the app configuration store resource. The name must be a string between 1 and 63 characters and contain only numbers, letters, and the `-` character. The name can't start or end with the `-` character, and consecutive `-` characters aren't valid.  |
    | **Subscription** | Your subscription | Select the Azure subscription that you want to use to test App Configuration. If your account has only one subscription, it's automatically selected and the **Subscription** drop-down isn't displayed. |
    | **Resource group** | *AppConfigTestResources* | Select or create a resource group for your app configuration store resource. This group is useful for organizing multiple resources that you might want to delete at the same time by deleting the resource group. For more information, see [Use resource groups to manage your Azure resources](/azure/azure-resource-manager/resource-group-overview). |
    | **Location** | *Central US* | Use **Location** to specify the geographic location in which your app configuration store is hosted. For the best performance, create the resource in the same region as other components of your application. |

    ![Create an app configuration store resource](../articles/azure-app-configuration/media/quickstarts/azure-app-configuration-create.png)

4. Select **Create**. The deployment might take a few minutes to finish.

5. After the deployment is finished, select **Settings** > **Access Keys**. Make a note of either the primary read-only or primary read-write key connection string. You use this connection string later to configure your application to communicate with the app configuration store you created.

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

1. To create a new app configuration store, first sign in to the [Azure portal](https://aka.ms/azconfig/portal). In the upper left side of the page, click **+ Create a resource**. In the **Search the Marketplace** textbox, type **App Configuration** and press **Enter**.

    ![Search for App Configuration](../articles/azure-app-configuration/media/quickstarts/azure-app-configuration-new.png)

2. Click **App Configuration** from the search results and then **Create**.

3. In the **App Configuration** > **Create** page, enter the following settings:

    | Setting | Suggested value | Description |
    |---|---|---|
    | **Resource name** | Globally unique name | Enter a unique resource name to use for the app configuration store resource. The name must be a string between 1 and 63 characters and contain only numbers, letters, and the `-` character. The name cannot start or end with the `-` character, and consecutive `-` characters are not valid.  |
    | **Subscription** | Your subscription | Select the Azure subscription that you want to use to test App Configuration. If your account has only one subscription, it is automatically selected and the **Subscription** drop-down isn't displayed. |
    | **Resource Group** | *AppConfigTestResources* | Select or create a resource group for your app configuration store resource. This group is useful for organizing multiple resources that you may want to delete at the same time by deleting the resource group. For more information, see [Using Resource groups to manage your Azure resources](/azure/azure-resource-manager/resource-group-overview). |
    | **Location** | *Central US* | Use **Location** to specify the geographic location in which your app configuration store is hosted. For the best performance, we recommend that you create the resource in the same region as other components of your application. |

    ![Create an app configuration store resource](../articles/azure-app-configuration/media/quickstarts/azure-app-configuration-create.png)

4. Click **Create**. The deployment may take a few minutes to complete.

5. Once the deployment is completed, click **Settings** > **Access Keys**. Make a note of either primary read-only or primary read-write key connection string. You will use this later to configure your application to communicate with the app configuration store you have just created.

6. Click **Key/Value Explorer** and **+ Create** to add the following key-value pairs:

    | Key | Value |
    |---|---|
    | TestApp:Settings:BackgroundColor | white |
    | TestApp:Settings:FontSize | 24 |
    | TestApp:Settings:FontColor | black |
    | TestApp:Settings:Message | Data from Azure App Configuration |

    You will leave **Label** and **Content Type** empty for now.

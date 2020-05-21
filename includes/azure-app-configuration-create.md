---
author: lisaguthrie
ms.author: lcozzens
ms.service: azure-app-configuration
ms.topic: include
ms.date: 1/31/2020
---

1. To create a new App Configuration store, sign in to the [Azure portal](https://portal.azure.com). In the upper-left corner of the home page, select **Create a resource**. In the **Search the Marketplace** box, enter **App Configuration** and select Enter.

    ![Search for App Configuration](media/azure-app-configuration-create/azure-portal-search.png)

1. Select **App Configuration** from the search results, and then select **Create**.

    ![Select Create](media/azure-app-configuration-create/azure-portal-app-configuration-create.png)

1. On the **App Configuration** > **Create** pane, enter the following settings:

    | Setting | Suggested value | Description |
    |---|---|---|
    | **Resource name** | Globally unique name | Enter a unique resource name to use for the App Configuration store resource. The name must be a string between 5 and 50 characters and contain only numbers, letters, and the `-` character. The name can't start or end with the `-` character.  |
    | **Subscription** | Your subscription | Select the Azure subscription that you want to use to test App Configuration. If your account has only one subscription, it's automatically selected and the **Subscription** list isn't displayed. |
    | **Resource group** | *AppConfigTestResources* | Select or create a resource group for your App Configuration store resource. This group is useful for organizing multiple resources that you might want to delete at the same time by deleting the resource group. For more information, see [Use resource groups to manage your Azure resources](/azure/azure-resource-manager/resource-group-overview). |
    | **Location** | *Central US* | Use **Location** to specify the geographic location in which your app configuration store is hosted. For the best performance, create the resource in the same region as other components of your application. |
    | **Pricing tier** | *Free* | Select the desired pricing tier. For more details, please see the [App Configuration pricing page](https://azure.microsoft.com/pricing/details/app-configuration/).

    ![Create an App Configuration store resource](media/azure-app-configuration-create/azure-portal-app-configuration-create-settings.png)

1. Select **Create**. The deployment might take a few minutes.

1. After the deployment finishes, select **Settings** > **Access Keys**. Make a note of the primary read-only key connection string. You'll use this connection string later to configure your application to communicate with the App Configuration store that you created.

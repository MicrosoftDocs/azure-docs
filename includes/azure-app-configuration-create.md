---
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: include
ms.date: 10/24/2022
ms.custom: devdivchpfy22, engagement-fy23
---

1. To create a new App Configuration store, sign in to the [Azure portal](https://portal.azure.com).

1. In the upper-left corner of the home page, select **Create a resource**.

1. In the **Search services and marketplace** box, enter *App Configuration* and select **Enter**.

    :::image type="content" source="media/azure-app-configuration-create/azure-portal-search-page.png" alt-text="Screenshot that shows the Search for App Configuration page.":::

1. Select **App Configuration** from the search results, and then select **Create**.

    :::image type="content" source="media/azure-app-configuration-create/azure-portal-app-configuration-create-page.png" alt-text="Screenshot that shows the Create page.":::

1. On the **Create App Configuration** pane, enter the following settings:

    | Setting | Suggested value | Description |
    |---|---|---|
    | **Subscription** | Your subscription | Select the Azure subscription that you want to use to test App Configuration. If your account has only one subscription, it's automatically selected and the **Subscription** list isn't displayed. |
    | **Resource group** | *AppConfigTestResources* | Select or create a resource group for your App Configuration store resource. This group is useful for organizing multiple resources that you might want to delete at the same time by deleting the resource group. For more information, see [Use resource groups to manage your Azure resources](../articles/azure-resource-manager/management/overview.md). |
    | **Resource name** | Globally unique name | Enter a unique resource name to use for the App Configuration store resource. The name must be a string between 5 and 50 characters and contain only numbers, letters, and the `-` character. The name can't start or end with the `-` character. |
    | **Location** | *Central US* | Use **Location** to specify the geographic location in which your app configuration store is hosted. For the best performance, create the resource in the same region as other components of your application. |
    | **Pricing tier** | *Free* | Select the desired pricing tier. For more information, see the [App Configuration pricing page](https://azure.microsoft.com/pricing/details/app-configuration). |

1. Select **Review + create** to validate your settings.

1. Select **Create**. The deployment might take a few minutes.

1. After the deployment finishes, go to the App Configuration resource. Select **Settings** > **Access keys**. Make a note of the primary read-only key connection string. You'll use this connection string later to configure your application to communicate with the App Configuration store that you created.

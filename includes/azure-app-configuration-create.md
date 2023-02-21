---
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: include
ms.date: 02/14/2023
ms.custom: devdivchpfy22, engagement-fy23
---

1. To create a new App Configuration store, sign in to the [Azure portal](https://portal.azure.com).

1. In the upper-left corner of the home page, select **Create a resource**.

1. In the search box, enter *App Configuration* and select **App Configuration** from the search results.

    :::image type="content" source="media/azure-app-configuration-create/azure-portal-find-app-configuration.png" alt-text="Screenshot of the Azure portal that shows the App Configuration service in the search bar.":::
1. Select **Create app configuration**.
    :::image type="content" source="media/azure-app-configuration-create/azure-portal-select-create-app-configuration.png" alt-text="Screenshot of the Azure portal that shows the button to launch the creation of an App Configuration store.":::
1. On the **Create app configuration** pane, enter the following settings:

    | Setting                          | Suggested value            | Description                                                                                                                                                                                                                                                                                                                                                   |
    |----------------------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Subscription**                 | Your subscription          | Select the Azure subscription that you want to use to test App Configuration. If your account has only one subscription, it's automatically selected and the **Subscription** list isn't displayed.                                                                                                                                                           |
    | **Resource group**               | *AppConfigTestResources*   | Select or create a resource group for your App Configuration store resource. This group is useful for organizing multiple resources that you might want to delete at the same time by deleting the resource group. For more information, see [Use resource groups to manage your Azure resources](../articles/azure-resource-manager/management/overview.md). |
    | **Location**                     | *Central US*               | Use **Location** to specify the geographic location in which your app configuration store is hosted. For the best performance, create the resource in the same region as other components of your application.                                                                                                                                                |
    | **Resource name**                | Globally unique name       | Enter a unique resource name to use for the App Configuration store resource. The name must be a string between 5 and 50 characters and contain only numbers, letters, and the `-` character. The name can't start or end with the `-` character.                                                                                                             |
    | **Pricing tier**                 | *Free*                     | Select the desired pricing tier. For more information, see the [App Configuration pricing page](https://azure.microsoft.com/pricing/details/app-configuration).                                                                                                                                                                                               |
    
    :::image type="content" source="media/azure-app-configuration-create/azure-portal-basic-tab.png" alt-text="Screenshot of the Azure portal that shows the basic tab of the creation for with the free tier selected.":::

1. If you've selected the standard pricing tier, also enter the following settings:

    | Setting                          | Suggested value | Description                                                                                                                                                                                                                                        |
    |----------------------------------|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Create replicas**              | Unchecked       | This box is unchecked by default. Optionally check the box to create replicas.                                                                                                                                                                     |
    | **Days to retain deleted store** | *7*             | Deleted stores are retained for seven days by default. Optionally decrease the number of retention days.                                                                                                                                               |
    | **Enable purge protection**      | Unchecked       | This option is disabled by default. Optionally turn on purge protection to prevent the permanent deletion of your App Configuration store and its contents during the selected retention period. Once enabled, purge protection can't be disabled. |

1. Go to the next numbered item of these instructions to use default configuration settings, or review the information below to configure additional settings:
   1. Optional: select **Next: Networking >** and optionally select a public access option:

        | Setting                        | Suggested value | Description                                                                                                                                                                                                                                        |
        |--------------------------------|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
        | **Public access**              | Automatic       | <ul><li>*Automatic*: public access is enabled unless you configure a private endpoint in your store. This option is selected by default.</li><li>*Disabled*: restricts access to configured private endpoints.</li><li>*Enabled*: all networks can access this resource.</li></ul> |

   1. Optional: select **Next: Tags >** and optionally add tags. Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.
1. Select **Review + create** to validate your settings.

    :::image type="content" source="media/azure-app-configuration-create/azure-portal-review.png" alt-text="Screenshot of the Azure portal that shows the configuration settings in the Review + create tab.":::

1. Select **Create**. The deployment might take a few minutes.

1. After the deployment finishes, go to the App Configuration resource. Select **Settings** > **Access keys**. Make a note of the primary read-only key connection string. You'll use this connection string later to configure your application to communicate with the App Configuration store that you created.

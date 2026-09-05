---
title: Manage system topics in Azure Event Grid (portal)
description: Learn how to create, view, and delete Azure Event Grid system topics by using the Azure portal.
ms.topic: how-to
ms.date: 08/26/2026
ai-usage: ai-assisted
# Customer intent: As an Azure administrator, I want to create, view, and delete Azure Event Grid system topics in the Azure portal so that I can manage events published by Azure services.
---

# Create, view, and manage Event Grid system topics in the Azure portal

Azure Event Grid system topics represent events that Azure services, such as Azure Storage and Azure Event Hubs, publish. Before you can subscribe to and react to those events, you need a system topic that represents the source. This article shows you how to create, view, and delete system topics by using the Azure portal.

You can create a system topic explicitly on the **Event Grid System Topics** page, or Event Grid can create one for you automatically when you create an event subscription on an Azure resource. This article focuses on creating and managing system topics explicitly.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- An Azure resource that supports system topics, such as an Azure Storage account or an Azure Event Hubs namespace. For the list of supported sources, see [Azure services that support system topics](system-topics.md#azure-services-that-support-system-topics).

## Create an Event Grid system topic

You can create a system topic explicitly on the **Event Grid System Topics** page. Event Grid can also create a system topic for you automatically when you use the **Events** page of an Azure resource to create an event subscription. In that case, Event Grid creates the system topic for the resource and then creates the subscription for that system topic. For those steps, see [Quickstart: Route Blob storage events to a web endpoint with the Azure portal](blob-event-quickstart-portal.md#subscribe-to-the-blob-storage).

To create a system topic explicitly, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box at the top, enter **Event Grid System Topics**, and then select **Event Grid System Topics** in the results.

    :::image type="content" source="./media/create-view-manage-system-topics/search-system-topics.png" alt-text="Screenshot that shows the Azure portal with Event Grid System Topics in the search box.":::
1. On the **Event Grid System Topics** page, select **+ Create** on the toolbar.

    :::image type="content" source="./media/create-view-manage-system-topics/add-system-topic-menu.png" alt-text="Screenshot that shows the Event Grid System Topics page with the Create button selected." lightbox="./media/create-view-manage-system-topics/add-system-topic-menu.png":::
1. On the **Create Event Grid System Topic** page, select values for the following settings:

    1. For **Topic Types**, select the resource type. The following example uses the **Storage Accounts** option.
    1. For **Subscription**, select the Azure subscription that has your storage account.
    1. For **Resource group**, select the resource group that has the storage account.
    1. For **Resource**, select the storage account.
    1. For **Name**, enter a name for the system topic.

        > [!NOTE]
        > You can use this system topic name to search metrics and diagnostic logs.
1. Select **Review + create**.

    :::image type="content" source="./media/create-view-manage-system-topics/create-system-topic-page.png" alt-text="Screenshot that shows the Create System Topic page.":::
1. On the **Review + create** tab, review the settings, and then select **Create**.

    :::image type="content" source="./media/create-view-manage-system-topics/system-topic-review-create.png" alt-text="Screenshot that shows the Review + create page.":::
1. After the deployment succeeds, select **Go to resource** to open the **Event Grid System Topic** page for the system topic that you created.

    :::image type="content" source="./media/create-view-manage-system-topics/system-topic-page.png" alt-text="Screenshot that shows the System Topic home page." lightbox="./media/create-view-manage-system-topics/system-topic-page.png":::

## View all Event Grid system topics

To view all existing Event Grid system topics, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box at the top, enter **Event Grid System Topics**, and then select **Event Grid System Topics** in the results.

    :::image type="content" source="./includes/media/system-topics/search-system-topics.png" alt-text="Screenshot that shows Event Grid System Topics in the search box in the Azure portal.":::
1. On the **Event Grid System Topics** page, review the list of system topics.

    :::image type="content" source="./includes/media/system-topics/list-system-topics.png" alt-text="Screenshot that shows the list of system topics." lightbox="./includes/media/system-topics/list-system-topics.png":::
1. Select a system topic in the list to see its details.

    :::image type="content" source="./media/create-view-manage-system-topics/system-topic-page.png" alt-text="Screenshot that shows the System Topic home page." lightbox="./media/create-view-manage-system-topics/system-topic-page.png":::

    The **Event Grid System Topic** page shows details such as:

    - **Source**: The name of the resource on which the system topic was created.
    - **Source type**: The type of the resource, for example, `Microsoft.Storage.StorageAccounts`, `Microsoft.EventHub.Namespaces`, or `Microsoft.Resources.ResourceGroups`.
    - Any event subscriptions created for the system topic.

    From this page, you can do the following operations:

    - Create an event subscription. Select **+ Event Subscription** on the toolbar.
    - Delete an event subscription. Select **Delete** on the toolbar.
    - Add tags for the system topic. Select **Tags** on the left menu, and then specify tag names and values.

## Delete an Event Grid system topic

To delete a system topic and all its event subscriptions, follow these steps:

1. Follow the steps in the [View all Event Grid system topics](#view-all-event-grid-system-topics) section to view all system topics. Select the system topic that you want to delete from the list.
1. On **Event Grid System Topic**, select **Delete** on the toolbar.

    :::image type="content" source="./media/create-view-manage-system-topics/system-topic-delete-button.png" alt-text="Screenshot that shows the System Topic page with the Delete button selected.":::
1. On the confirmation page, select **OK** to confirm the deletion. Event Grid deletes the system topic and all the event subscriptions for that system topic.

## Related content

- [System topics in Azure Event Grid](system-topics.md)
- [Route Blob storage events to a web endpoint with the Azure portal](blob-event-quickstart-portal.md)

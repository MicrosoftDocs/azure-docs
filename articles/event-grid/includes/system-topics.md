---
 title: include file
 description: include file
 services: event-grid
 author: spelluru
 ms.service: event-grid
 ms.topic: include
 ms.date: 10/31/2022
 ms.author: spelluru
 ms.custom: include file
---

1. Sign in to [Azure portal](https://portal.azure.com).
2. In the search box at the top, type **Event Grid System Topics**, and then press **ENTER**. 

    :::image type="content" source="./media/system-topics/search-system-topics.png" alt-text="Screenshot that shows Event Grid System Topics in the search box in the Azure portal.":::
3. On the **Event Grid System Topics** page, you see all the system topics. 

    :::image type="content" source="./media/system-topics/list-system-topics.png" alt-text="Screenshot that shows the list of system topics." lightbox="./media/system-topics/list-system-topics.png":::
4. Select a **system topic** from the list to see details about it. 

    :::image type="content" source="./media/system-topics/system-topic-details.png" alt-text="Screenshot that shows the topic page in the Azure portal.":::

    This page shows you details about the system topic such as the following information: 
    - Source. Name of the resource on which the system topic was created.
    - Source type. Type of the resource. For example: `Microsoft.Storage.StorageAccounts`, `Microsoft.EventHub.Namespaces`, `Microsoft.Resources.ResourceGroups` and so on.
    - Any subscriptions created for the system topic.

    This page allows operations such as the following ones:
    - Create an event subscription Select **+Event Subscription** on the toolbar. 
    - Delete an event subscription. Select **Delete** on the toolbar. 
    - Add tags for the system topic. Select **Tags** on the left menu, and specify tag names and values.
---
 title: Create Azure Event Grid namespace in the portal
 description: This article shows you how to create an Azure Event Grid namespace in the Azure portal. 
 author: spelluru
 ms.service: azure-event-grid
 ms.topic: include
 ms.date: 06/25/2025
 ms.author: spelluru
ms.custom:
  - include file
  - ignite-2023
---

## Create a namespace in the Azure portal

A *namespace* in Azure Event Grid is a logical container for one or more topics, clients, client groups, topic spaces, and permission bindings. With an Azure Event Grid namespace, you can group together related resources and manage them as a single unit in your Azure subscription. A unique namespace allows you to have multiple resources in the same Azure region. 

To create a namespace:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **Event Grid Namespaces** and select **Event Grid Namespaces** from the results.

   :::image type="content" source="../media/create-view-manage-namespaces/portal-search-box-namespaces.png" alt-text="Screenshot showing Event Grid Namespaces in the search results.":::

1. On the **Event Grid Namespaces** page, select **+ Create**.

   :::image type="content" source="../media/create-view-manage-namespaces/namespace-create-button.png" alt-text="Screenshot showing Event Grid Namespaces page with the Create button on the toolbar selected.":::

1. On the **Basics** page, follow these steps.

    1. Select the Azure subscription in which to create the namespace.
    1. Select an existing **Resource group** or create a resource group.
    1. Enter a **Name** for the namespace.
    1. Select the **Location** for the namespace. 
    1. Select **Review + create**. 
    
       :::image type="content" source="../media/create-view-manage-namespaces/create-namespace-basics-page.png" alt-text="Screenshot showing the Basics tab of Create namespace page.":::

1. On the **Review + create** tab, review your settings. Then select **Create**.
1. On the **Deployment succeeded** page, select **Go to resource** to navigate to your namespace. 

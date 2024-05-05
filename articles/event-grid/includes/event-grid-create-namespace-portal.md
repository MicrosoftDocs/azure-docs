---
 title: Create Azure Event Grid namespace in the portal
 description: This article shows you how to create an Azure Event Grid namespace in the Azure portal. 
 services: event-grid
 author: spelluru
 ms.service: event-grid
 ms.topic: include
 ms.date: 02/29/2024
 ms.author: spelluru
ms.custom:
  - include file
  - ignite-2023
---

## Create a namespace in the Azure portal
A namespace in Azure Event Grid is a logical container for one or more topics, clients, client groups, topic spaces and permission bindings. It provides a unique namespace, allowing you to have multiple resources in the same Azure region. With an Azure Event Grid namespace you can group now together related resources and manage them as a single unit in your Azure subscription.

Please follow the next sections to create, view and manage an Azure Event Grid namespace.

To create a namespace:

1. Sign-in to the [Azure portal](https://portal.azure.com).
1. In the **search box**, enter **Event Grid Namespaces** and select **Event Grid Namespaces** from the results.

    :::image type="content" source="../media/create-view-manage-namespaces/portal-search-box-namespaces.png" alt-text="Screenshot showing Event Grid Namespaces in the search results.":::
1. On the **Event Grid Namespaces** page, select **+ Create** on the toolbar. 

    :::image type="content" source="../media/create-view-manage-namespaces/namespace-create-button.png" alt-text="Screenshot showing Event Grid Namespaces page with the Create button on the toolbar selected.":::
1. On the **Basics** page, follow these steps.
    1. Select the **Azure subscription** in which you want to create the namespace.
    1. Select an existing **resource group** or create a resource group.
    1. Enter a **name** for the namespace.
    1. Select the region or **location** where you want to create the namespace. 
    1. Select **Review + create** at the bottom of the page. 
    
        :::image type="content" source="../media/create-view-manage-namespaces/create-namespace-basics-page.png" alt-text="Screenshot showing the Basics tab of Create namespace page.":::        
6. On the **Review + create** tab, review your settings and select **Create**.
1. On the **Deployment succeeded** page, select **Go to resource** to navigate to your namespace. 

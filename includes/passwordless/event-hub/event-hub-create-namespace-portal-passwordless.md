---
 title: include file
 description: include file
 services: service-bus-messaging
 author: spelluru
 ms.service: service-bus-messaging
 ms.topic: include
 ms.date: 04/26/2022
 ms.author: spelluru
 ms.custom: include file
---

## Create a namespace in the Azure portal
To begin using Event Hubs messaging entities in Azure, you must first create a namespace with a name that is unique across Azure. A namespace provides a scoping container for Event Hubs resources within your application.

To create a namespace:

1. Sign in to the [Azure portal](https://portal.azure.com)
2. In the left navigation pane of the portal, select **+ Create a resource**, select **Integration**, and then select **Event Hubs**.

    :::image type="content" source="./media/service-bus-create-namespace-portal/create-resource-service-bus-menu.png" alt-text="Screenshot of the selection of Create a resource, Integration, and then Event Hubs in the menu.":::
3. In the **Basics** tag of the **Create namespace** page, follow these steps: 
    1. For **Subscription**, choose an Azure subscription in which to create the namespace.
    1. For **Resource group**, choose an existing resource group in which the namespace will live, or create a new one.      
    1. Enter a **name for the namespace**. The namespace name should adhere to the following naming conventions:
        - The name must be unique across Azure. The system immediately checks to see if the name is available. 
        - The name length is at least 6 and at most 50 characters.
        - The name can contain only letters, numbers, and hyphens ("-").
        - The name must start with a letter and end with a letter or number.
        - The name doesn't end with "-sb" or "-mgmt".
    1. For **Location**, choose the region in which your namespace should be hosted.
    1. For **Pricing tier**, select the pricing tier (Basic, Standard, or Premium) for the namespace. For this quickstart, select **Standard**. 

        If you selected the **Premium** pricing tier, specify the number of **messaging units**. The premium tier provides resource isolation at the CPU and memory level so that each workload runs in isolation. This resource container is called a messaging unit. A premium namespace has at least one messaging unit. You can select 1, 2, 4, 8 or 16 messaging units for each Event Hubs Premium namespace. For more information, see [Event Hubs Premium Messaging](../../../articles/service-bus-messaging/service-bus-premium-messaging.md).

    1. Select **Review + create**. The system now creates your namespace and enables it. You might have to wait several minutes for the system to provision resources for your account.
   
        :::image type="content" source="./media/service-bus-create-namespace-portal/create-namespace.png" alt-text="Screenshot of the Create a namespace page.":::
    1. On the **Create** page, review settings, and select **Create**. 
4. Select **Go to resource** on the deployment page. 

    :::image type="content" source="./media/service-bus-create-namespace-portal/deployment-alert.png" alt-text="Screenshot of the deployment succeeded page with the Go to resource link.":::
5. You see the home page for your Event Hubs namespace. 

    :::image type="content" source="./media/service-bus-create-namespace-portal/service-bus-namespace-home-page.png" alt-text="Screenshot of the home page of the Event Hubs namespace created." :::
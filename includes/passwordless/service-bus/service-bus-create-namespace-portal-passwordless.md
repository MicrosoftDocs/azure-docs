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
To begin using Service Bus messaging entities in Azure, you must first create a namespace with a name that is unique across Azure. A namespace provides a scoping container for Service Bus resources within your application.

To create a namespace:

1. Sign in to the [Azure portal](https://portal.azure.com)
2. In the left navigation pane of the portal, select **+ Create a resource**, select **Integration**, and then select **Service Bus**.

    :::image type="content" source="../../../articles/service-bus-messaging/includes/media/service-bus-create-namespace-portal/create-resource-service-bus-menu.png" alt-text="Image showing selection of Create a resource, Integration, and then Service Bus in the menu.":::
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
    
        > [!IMPORTANT]
        > If you want to use [Topics and subscriptions](../../../articles/service-bus-messaging/service-bus-queues-topics-subscriptions.md#topics-and-subscriptions), choose either Standard or Premium. Topics/subscriptions aren't supported in the Basic pricing tier. 

        If you selected the **Premium** pricing tier, specify the number of **messaging units**. The premium tier provides resource isolation at the CPU and memory level so that each workload runs in isolation. This resource container is called a messaging unit. A premium namespace has at least one messaging unit. You can select 1, 2, 4, 8 or 16 messaging units for each Service Bus Premium namespace. For more information, see [Service Bus Premium Messaging](../../../articles/service-bus-messaging/service-bus-premium-messaging.md).

    1. Select **Review + create**. The system now creates your namespace and enables it. You might have to wait several minutes as the system provisions resources for your account.
   
        :::image type="content" source="../../../articles/service-bus-messaging/includes/media/service-bus-create-namespace-portal/create-namespace.png" alt-text="Image showing the Create a namespace page.":::
    1. On the **Create** page, review settings, and select **Create**. 
4. Select **Go to resource** on the deployment page. 

    :::image type="content" source="../../../articles/service-bus-messaging/includes/media/service-bus-create-namespace-portal/deployment-alert.png" alt-text="Image showing the deployment succeeded page with the Go to resource link.":::
5. You see the home page for your service bus namespace. 

    :::image type="content" source="../../../articles/service-bus-messaging/includes/media/service-bus-create-namespace-portal/service-bus-namespace-home-page.png" alt-text="Image showing the home page of the Service Bus namespace created." :::
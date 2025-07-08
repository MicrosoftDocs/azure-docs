---
 title: Create a namespace
 description: Provides step-by-step instructions to create an Azure Service Bus namespace using the Azure portal. 
 author: spelluru
 ms.service: azure-service-bus
 ms.topic: include
 ms.date: 06/11/2025
 ms.author: spelluru
 ms.custom: include file
---

## Create a namespace in the Azure portal

To begin using Service Bus messaging entities in Azure, create a namespace with a name that is unique across Azure. A namespace provides a scoping container for Service Bus resources, such as queues and topics, in your application.

To create a namespace:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the flyout menu from the top left and navigate to the [**All services** page](https://portal.azure.com/#allservices/category/All).
1. On the left navigation bar, select **Integration**.
1. Scroll down to **Messaging services** > **Service Bus** and select **Create**. 
    
   :::image type="content" source="./media/service-bus-create-namespace-portal/create-resource-service-bus-menu.png" alt-text="Screenshot showing selection of Create a resource, Integration, and then Service Bus in the menu." lightbox="./media/service-bus-create-namespace-portal/create-resource-service-bus-menu.png":::

1. In the **Basics** tab of the **Create namespace** page, follow these steps:

   1. For **Subscription**, choose an Azure subscription in which to create the namespace.
   1. For **Resource group**, choose an existing resource group, or create a new one.      
   1. Enter a **Namespace name** that meets the following naming conventions:

      - The name must be unique across Azure. The system immediately checks to see if the name is available. 
      - The name length is at least 6 and at most 50 characters.
      - The name can contain only letters, numbers, hyphens `-`.
      - The name must start with a letter and end with a letter or number.
      - The name doesn't end with `-sb` or `-mgmt`.

   1. For **Location**, choose the region to host your namespace.
   1. For **Pricing tier**, select the pricing tier (Basic, Standard, or Premium) for the namespace. For this quickstart, select **Standard**. 
    
      If you select **Premium** tier, you can enable **geo-replication** for the namespace. The geo-replication feature ensures that the metadata and data of a namespace are continuously replicated from a primary region to one or more secondary regions.
    
      > [!IMPORTANT]
      > If you want to use [topics and subscriptions](../service-bus-queues-topics-subscriptions.md#topics-and-subscriptions), choose either Standard or Premium. Topics and subscriptions aren't supported in the Basic pricing tier. 

      If you selected the **Premium** pricing tier, specify the number of **messaging units**. The premium tier provides resource isolation at the CPU and memory level so that each workload runs in isolation. This resource container is called a *messaging unit*. A premium namespace has at least one messaging unit. You can select 1, 2, 4, 8 or 16 messaging units for each Service Bus Premium namespace. For more information, see [Service Bus premium messaging tier](../service-bus-premium-messaging.md).

   1. Select **Review + create** at the bottom of the page. 
   
      :::image type="content" source="./media/service-bus-create-namespace-portal/create-namespace.png" alt-text="Screenshot showing the Create a namespace page":::

   1. On the **Review + create** page, review settings, and select **Create**. 

1. After the deployment of the resource is successful, select **Go to resource** on the deployment page. 

   :::image type="content" source="./media/service-bus-create-namespace-portal/deployment-alert.png" alt-text="Screenshot showing the deployment succeeded page with the Go to resource link.":::

1. You see the home page for your service bus namespace. 

   :::image type="content" source="./media/service-bus-create-namespace-portal/service-bus-namespace-home-page.png" lightbox="./media/service-bus-create-namespace-portal/service-bus-namespace-home-page.png" alt-text="Screenshot showing the home page of the Service Bus namespace created." :::


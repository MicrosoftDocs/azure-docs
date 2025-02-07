---
title: How to send events to Event Grid namespace topics
description: This article describes how to deliver events to Event Grid namespace topics.
ms.topic: how-to
ms.date: 11/15/2023
author: robece
ms.author: robece
# Customer intent: I want to learn how to send forward events from an Event Grid topic to an Event Grid namespace topic
---

# How to send events from Event Grid basic to Event Grid namespace topics

This article describes how to forward events from event subscriptions created in resources like topics, system topics, domains, and partner topics to Event Grid namespaces. 

## Overview
Event Grid basic supports **Event Grid Namespace topic** as the **endpoint type**. When creating an event subscription to an Event Grid topic, system topic, domain, or partner topic, you can select an Event Grid namespace topic as the endpoint for handling events. 

:::image type="content" source="media/handler-event-grid-namespace-topic/namespace-topic-handler-destination.png" alt-text="Image that shows events forwarded from Event Grid basic to Event Grid namespace topic." border="false" lightbox="media/handler-event-grid-namespace-topic/namespace-topic-handler-destination.png":::

Namespace topic as a destination in Event Grid basic event subscriptions helps you with transitioning to Event Grid namespaces without modifying your existing workflow. Event Grid namespaces provide new and interesting capabilities that you might be interested to use in your solutions. If you're currently using Event Grid basic resources like topics, system topics, domains, and partner topics you only need to create a new event subscription in your current topic and select Event Grid namespace topic as a handler destination.

This article covers an example scenario where you forward Azure Storage events to an Event Grid namespace. Here are the high-level steps:

1. Create a system topic for the Azure storage account and enable managed identity for the system topic. 
1. Assign the system topic's managed identity to the Event Grid Data Sender role on the destination Event Grid namespace.
1. Create an event subscription to the system topic with the Event Grid namespace as the event handler, and use the managed identity for event delivery.

## Prerequisites

1. Create an Event Grid namespace resource by following instructions from [Create, view, and manage namespaces](create-view-manage-namespaces.md).
1. Create an Event Grid namespace topic by following instructions from [Create, view, and manage namespace topics](create-view-manage-namespace-topics.md).
1. Create an Event Grid event subscription in a namespace topic by following instructions from [Create, view, and manage event subscriptions in namespace topics](create-view-manage-event-subscriptions.md). This step is optional, but it's useful for testing the scenario. 
1. Create an Azure storage account by following instructions from [create a storage account](blob-event-quickstart-portal.md#create-a-storage-account).

## Create a system topic and enable managed identity for the storage account
If you have an existing system topic for the storage account, navigate to the system topic page. If you don't have one, create a system topic. Then, enable managed identity for the storage account. 

1. Navigate to [Azure portal](https://portal.azure.com).
1. In the search bar, search for **Event Grid System Topics**, and select it from the search results. 
1. On the **Event Grid System Topics** page, select **+ Create**. 

    :::image type="content" source="./media/handler-event-grid-namespace-topic/system-topics-page.png" alt-text="Screenshot that shows the System Topics page with the Create button selected." lightbox="./media/handler-event-grid-namespace-topic/system-topics-page.png":::
1. On the **Create Event Grid System Topic** page, follow these steps: 
    1. For **Topic Types**, select **Storage Accounts**.
    1. For **Subscription**, select the Azure subscription where you want to create the system topic. 
    1. For **Resource Group**, select the resource group for the system topic. 
    1. For **Resource**, select the Azure storage resource for which you want to create the system topic. 
    1. In the **System Topic Details** section, for **Name**, enter a name for the topic. 
    1. Select **Review + create** at the bottom of the page. 

        :::image type="content" source="./media/handler-event-grid-namespace-topic/create-system-topic-page.png" alt-text="Screenshot that shows the Create Event Grid System Topic page." lightbox="./media/handler-event-grid-namespace-topic/create-system-topic-page.png":::
1. On the **Review + create** page, review settings, and select **Create**. 

    :::image type="content" source="./media/handler-event-grid-namespace-topic/create-system-topic-review-create.png" alt-text="Screenshot that shows the Create Event Grid System Topic - Review and create page." lightbox="./media/handler-event-grid-namespace-topic/create-system-topic-review-create.png":::
1. After the deployment is successful, select **Go to resource** to navigate to the **Event Grid System Topic** page for the system topic you created. 

### Enable managed identity for the system topic
Now, enable managed identity for the system topic you created. For this example, let's create a system-assigned managed identity for the system topic.

1. On the **Event Grid System Topic** page, select **Identity** under **Settings** on the left navigation menu.
1. On the **Identity** page, select **On** for **Status**. 
1. Select **Save** on the command bar. 

    :::image type="content" source="./media/handler-event-grid-namespace-topic/identity-page.png" alt-text="Screenshot that shows the Identity page for the system topic." lightbox="./media/handler-event-grid-namespace-topic/identity-page.png":::    
1. On the confirmation pop-up window, select **Yes** to confirm the creation of the managed identity.
1. After the managed identity is created, you see the object (principal) ID for the identity.

    Keep the **System Topic** page open in the current tab of your web browser.

## Grant the identity permission to send events to the namespace
In the last step, you created a system-assigned managed identity for your storage account's system topic. In this step, you grant the identity the permission to send events to the target or destination namespace. 

1. Launch a new tab or a window of the web browser. Navigate to your Event Grid namespace in the Azure portal.
1. Select **Access control (IAM)** on the left menu.
1. Select **Add** and then select **Add role assignment**. 

    :::image type="content" source="./media/handler-event-grid-namespace-topic/namespace-access-control-add.png" alt-text="Screenshot that shows the Access control page for the Event Grid namespace." lightbox="./media/handler-event-grid-namespace-topic/namespace-access-control-add.png":::        
1. On the **Role** page, search for and select **Event Grid Data Sender** role, and then select **Next**. 

    :::image type="content" source="./media/handler-event-grid-namespace-topic/role-page.png" alt-text="Screenshot that shows the Access control page with Event Grid Data Sender role selected." lightbox="./media/handler-event-grid-namespace-topic/role-page.png":::        
1. On the **Members** page, for **Assign access to**, select **Managed identity**, and then choose **+ Select members**. 

    :::image type="content" source="./media/handler-event-grid-namespace-topic/members-page.png" alt-text="Screenshot that shows the Members page." lightbox="./media/handler-event-grid-namespace-topic/members-page.png":::            
1. On the **Select managed identities** page, follow these steps:
    1. For **Subscription**, select the Azure subscription where the managed identity is created. 
    1. For **Managed identity**, select **Event Grid System Topic**. 
    1. For **Select**, type the name of your system topic.
    1. In the search results, select the managed identity. The managed identity's name is same as the system topic's name. 
    
        :::image type="content" source="./media/handler-event-grid-namespace-topic/select-identity.png" alt-text="Screenshot that shows the selection of a managed identity." lightbox="./media/handler-event-grid-namespace-topic/select-identity.png":::                    
1. On the **Members** page, select **Next**. 
1. On the **Review + assign** page, review settings, and select **Review + assign** at the bottom of the page. 


## Create an event subscription to the storage system topic 
Now, you're ready to create an event subscription to the system topic for the source storage account using the namespace as an endpoint. 

1. On the **System Topic** page for the system topic, select **Overview** on the left menu if it's not already selected. 
1. Select **+ Event Subscription** on the command bar. 

    :::image type="content" source="media/handler-event-grid-namespace-topic/create-event-subscription-button.png" alt-text="Screenshot that shows the Event Grid System Topic page with the Event Subscription button selected." border="false" lightbox="media/handler-event-grid-namespace-topic/create-event-subscription-button.png":::    
1. On the **Create Event Subscription** page, follow these steps:
    1. For **Name**, enter the name for an event subscription.
    1. For **Event Schema**, select the event schema as **Cloud Events Schema v1.0**. It's the only schema type that the Event Grid Namespace Topic destination supports.
    1. For **Filter to Event Types**, select types of events you want to subscribe to. 
    1. For **Endpoint type**, select **Event Grid Namespace Topic**.
    1. Select **Configure an endpoint**.
    
        :::image type="content" source="media/handler-event-grid-namespace-topic/select-configure-endpoint.png" alt-text="Screenshot that shows the Create Event Subscription page with Configure an endpoint selected." border="false" lightbox="media/handler-event-grid-namespace-topic/select-configure-endpoint.png":::            
1. On the **Select Event Grid Namespace Topic** page, follow these steps:
    1. For **Subscription**, select the Azure subscription, resource group, and the namespace that has the namespace topic. 
    1. For **Event Grid namespace topic**, select the namespace topic.
    1. Select **Confirm selection** at the bottom of the page. 
1. Now, on the **Create Event Subscription** page, for **Managed identity type**, select **System assigned**. 
1. Select **Create** at the bottom of the page. 
 
    :::image type="content" source="media/handler-event-grid-namespace-topic/namespace-topic-subscription.png" alt-text="Screenshot that shows how to create a subscription to forward events from Event Grid basic to Event Grid namespace topic." border="false" lightbox="media/handler-event-grid-namespace-topic/namespace-topic-subscription.png":::

    To test the scenario, create a container in the Azure blob storage and upload a file to it. Verify that the event handler or endpoint for your namespace topic receives the blob created event. 

    When you upload a blob to a container in the Azure storage, here's what happens:

    1. Azure Blob Storage sends a **Blob Created** event to your blob storage's system topic. 
    1. The event is forwarded to your namespace topic as it's the event handler or endpoint for the system topic. 
    1. The endpoint for the subscription to the namespace topic receives the forwarded event.
    

## Related content

See the following articles:

- [Pull delivery overview](pull-delivery-overview.md)
- [Push delivery overview](push-delivery-overview.md)
- Quickstart: [Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md)

---
title: Forward events to another namespace topic
description: This article shows how to forward events from one namespace topic to another namespace topic. 
ms.topic: how-to
ms.date: 11/16/2024
author: robece
ms.author: robece
---

# Forward events from one Azure Event Grid namespace topic to another namespace topic (Preview)
Forwarding events from one Azure Event Grid namespace topic to another namespace topic is a straightforward process. It enhances the flexibility and scalability of your event-driven architecture. Whether you're working within the same resource or across different resources, Azure Event Grid namespace provides a seamless way to forward events efficiently. 

You can forward events from a namespace topic to another topic in the same namespace. Here's the illustration: 

:::image type="content" source="./media/forward-events-to-another-namespace-topic/forward-events-to-topic-in-same-namespace.png" alt-text="Diagram that illustrates forwarding of events from one namespace topic to another topic in the same namespace." lightbox="./media/forward-events-to-another-namespace-topic/forward-events-to-topic-in-same-namespace.png":::

You can also forward events from a namespace to another topic in a different namespace. 


:::image type="content" source="./media/forward-events-to-another-namespace-topic/forward-events-to-topic-in-different-namespace.png" alt-text="Diagram that illustrates forwarding of events from one namespace topic to another topic in a different namespace." lightbox="./media/forward-events-to-another-namespace-topic/forward-events-to-topic-in-different-namespace.png":::

## Step to forward events

1. Identify the namespace topic origin and the namespace topic destination. You can use the same Azure Event Grid namespace or any other Azure Event Grid namespace under your tenant that you have access to. 
1. Set up an event subscription in the namespace topic origin. In the origin namespace topic, create an event subscription, select **Event Grid Namespace Topic** as an endpoint destination, and select **Configure an endpoint**.

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/origin-topic-namespace-topic-endpoint.png" alt-text="Screenshot that shows the Create Subscription window with Event Grid Namespace Topic endpoint selected." lightbox="./media/forward-events-to-another-namespace-topic/origin-topic-namespace-topic-endpoint.png":::
1.  On the **Select Event Grid Namespace Topic** page, follow these steps:
    1. For **Subscription**, select the **Azure subscription** in which the destination namespace topic exits. 
    1. For **Resource Group**, select the **resource group** in which the destination namespace topic exists. 
    1. For **Event Grid Namespace**, select the **Event Grid namespace** that has the destination topic. 
    1. For **Event Grid Namespace Topic**, select the **destination namespace topic**. 

        :::image type="content" source="./media/forward-events-to-another-namespace-topic/select-namespace-topic.png" alt-text="Screenshot that shows the Select Event Grid Namespace Topic window.":::
1. To forward events between namespaces, you must configure a managed identity for the namespace. Once you configured the endpoint, select **Go to identity** to continue. 

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/managed-identity-for-delivery.png" alt-text="Screenshot that shows the Managed identity for delivery window.":::
1. Select the identity that fits better to your scenario. See [Best practice recommendations for managed system identities](/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations). Here, we use system assigned identity for demo purposes. 

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/system-assigned-identity.png" alt-text="Screenshot that shows the System Assigned tab selected.":::
1. Save and confirm the new identity. 

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/save-system-identity.png" alt-text="Screenshot that shows the Enable system assigned identity window.":::    
1. Once the identity is generated, select **Create Subscription** as shows in the following image to return to the event subscription creation. 

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/navigate-to-event-subscription.png" alt-text="Screenshot that shows the selection of Create Subscription in the breadcrumb menu." lightbox="./media/forward-events-to-another-namespace-topic/navigate-to-event-subscription.png":::
1. Open a new navigation tab in your web browser, and navigate to the destination Azure Event Grid namespace. The destination can be same the namespace as the source topic's namespace or a different one. 
1. Select **Access Control (IAM)**, and then select **Add a role assignment**. 

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/destination-namespace-access-control.png" alt-text="Screenshot that shows the Access control page of the destination namespace." :::
1. On the **Role** tab of the **Add role assignment** page, select the **EventGrid Data Sender** role, and then select **Next**. 

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/select-event-grid-data-sender.png" alt-text="Screenshot that shows the selection of Event Grid Data Sender role." :::
1. Assign the access to the managed identity created for the source namespace topic, and then choose **Select**.

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/assign-identity-role.png" alt-text="Screenshot that shows the assignment of Event Grid Data Sender role to the source topic's identity." lightbox="./media/forward-events-to-another-namespace-topic/assign-identity-role.png":::    
1. Now, on the **Add role assignment** page, select **Review + assign**. 

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/review-assign.png" alt-text="Screenshot that shows the selection of Review + assign on the Add role assignment page." lightbox="./media/forward-events-to-another-namespace-topic/review-assign.png":::    
1. Now, return to tab of the web browser where you have the Create Subscription page open for the source namespace topic.
1. In the **Managed identity for delivery** section, select **Refresh**.  

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/create-subscription-identity.png" alt-text="Screenshot that shows the Create Subscription page with system assigned identity option selected." lightbox="./media/forward-events-to-another-namespace-topic/review-assign.png":::    
1. Select the system assigned managed identity for your source topic, and then select **Create**. 

## Related content
    
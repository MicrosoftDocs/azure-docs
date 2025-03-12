---
title: Forward events to another namespace topic
description: This article shows how to forward events from one namespace topic to another namespace topic.
ms.topic: how-to
ms.custom:
  - ignite-2024
ms.date: 11/18/2024
author: robece
ms.author: robece
---

# Forward events from one Azure Event Grid namespace topic to another namespace topic (Preview)
Forwarding events from one Azure Event Grid namespace topic to another namespace topic is a straightforward process that enhances the flexibility and scalability of your event-driven architecture. Whether you're working within the same resource or across different resources, Azure Event Grid namespace provides a seamless way to forward events efficiently. 

You can forward events from a topic in one namespace to another topic in the same namespace. 

:::image type="content" source="./media/forward-events-to-another-namespace-topic/forward-events-to-topic-in-same-namespace.png" alt-text="Diagram that illustrates forwarding of events from one namespace topic to another topic in the same namespace." lightbox="./media/forward-events-to-another-namespace-topic/forward-events-to-topic-in-same-namespace.png":::

You can also forward events from a topic in one namespace to a topic in another namespace. 

:::image type="content" source="./media/forward-events-to-another-namespace-topic/forward-events-to-topic-in-different-namespace.png" alt-text="Diagram that illustrates forwarding of events from one namespace topic to another topic in a different namespace." lightbox="./media/forward-events-to-another-namespace-topic/forward-events-to-topic-in-different-namespace.png":::

## Enable managed identity for the source namespace
In this step, you enable managed identity for the source namespace (namespace that contains the source topic). Select the identity that fits better to your scenario. See [Best practice recommendations for managed system identities](/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations). Here, we use system assigned identity for demo purposes. 

1. Navigate to the Azure portal page for the namespace that has the source topic. 
1. Select **Identity** on the left navigation menu.
1. On the **System assigned** tab, select **On** for **Status**.
1. Select **Save** on the command bar to save the setting. 

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/identity-page.png" alt-text="Screenshot that shows the Identity page for a namespace with system-assigned managed identity enabled." lightbox="./media/forward-events-to-another-namespace-topic/identity-page.png":::   
1. On the popup window, select **Yes** to confirm enabling of managed identity for the namespace.

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/identity-confirmation.png" alt-text="Screenshot that shows the confirmation window." lightbox="./media/forward-events-to-another-namespace-topic/identity-confirmation.png":::   
1. Confirm that the system-assigned managed identity is assigned to the namespace that has the source topic. 

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/identity-assigned.png" alt-text="Screenshot that shows the system-assigned managed identity for the source namespace." lightbox="./media/forward-events-to-another-namespace-topic/identity-assigned.png":::   

    
## Grant identity the permission to send events to the destination topic
In this step, you add the managed identity of the source namespace to the **Event Grid Data Sender** role on the destination namespace. This step enables the source namespace to be able to send or forward events to the destination namespace. 

1. Navigate to the Azure portal page for the namespace that has the destination topic. 
1. Select **Access Control (IAM)**, and then select **Add a role assignment**. 

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/destination-namespace-access-control.png" alt-text="Screenshot that shows the Access control page of the destination namespace." :::
1. On the **Role** tab of the **Add role assignment** page, select the **EventGrid Data Sender** role, and then select **Next**. 

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/select-event-grid-data-sender.png" alt-text="Screenshot that shows the selection of Event Grid Data Sender role." lightbox="./media/forward-events-to-another-namespace-topic/select-event-grid-data-sender.png":::
1. On the **Members** tab, select **Managed identity**, and then select **+ Select members**. 
1. In the **Select managed identities** window, follow these steps:
    1. For **Subscription**, Select your Azure subscription.
    1. For **Managed identity**, select **Event Grid Namespace**.
    1. Select the managed identity for the source namespace you created earlier.
    1. Choose **Select** at the bottom of the page. 

        :::image type="content" source="./media/forward-events-to-another-namespace-topic/assign-identity-role.png" alt-text="Screenshot that shows the assignment of Event Grid Data Sender role to the source topic's identity." lightbox="./media/forward-events-to-another-namespace-topic/assign-identity-role.png":::    
1. Now, on the **Add role assignment** page, select **Review + assign**. 

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/review-assign.png" alt-text="Screenshot that shows the selection of Review + assign on the Add role assignment page." lightbox="./media/forward-events-to-another-namespace-topic/review-assign.png":::    
1. On the **Review + assign** page, review settings, and select **Review + assign**. 

## Create an event subscription to the source topic with destination topic as the endpoint
In this step, you create an event subscription on the source namespace topic using the destination namespace topic so that the events are forwarded to the destination namespace topic. 

1. Navigate to the source topic page in the Azure portal. On the **Event Grid Namespace Topic** page, select **+ Subscription** on the command bar.

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/create-subscription-button.png" alt-text="Screenshot that shows the Create Subscription button selected." lightbox="./media/forward-events-to-another-namespace-topic/create-subscription-button.png":::
1. On the **Create Subscription** page, enter a name for the event subscription.
1. Select **Event Grid Namespace Topic** as an endpoint destination, and select **Configure an endpoint**.

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/origin-topic-namespace-topic-endpoint.png" alt-text="Screenshot that shows the Create Subscription window with Event Grid Namespace Topic endpoint selected." lightbox="./media/forward-events-to-another-namespace-topic/origin-topic-namespace-topic-endpoint.png":::
1.  On the **Select Event Grid Namespace Topic** page, follow these steps:
    1. Select the **Azure subscription**, **Resource group**, and **Event Grid namespace** in which the destination namespace topic exits. 
    1. For **Event Grid Namespace Topic**, select the destination namespace topic. 

        :::image type="content" source="./media/forward-events-to-another-namespace-topic/select-namespace-topic.png" alt-text="Screenshot that shows the Select Event Grid Namespace Topic window.":::
1. In the **Managed identity for delivery** section, select **Refresh**.  

    :::image type="content" source="./media/forward-events-to-another-namespace-topic/create-subscription-identity.png" alt-text="Screenshot that shows the Create Subscription page with system assigned identity option selected." lightbox="./media/forward-events-to-another-namespace-topic/review-assign.png":::    
1. Select the system assigned managed identity for your source topic, and then select **Create**. 

## Related content
For a list of supported event handlers, see [Namespace topic push delivery event handlers](namespace-topics-event-handlers.md).

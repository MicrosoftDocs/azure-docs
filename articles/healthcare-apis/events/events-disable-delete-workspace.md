---
title: Disable events for the FHIR or DICOM service in Azure Health Data Services
description: Disable events for the FHIR or DICOM service in Azure Health Services by deleting an event subscription. Learn why and how to stop sending notifications from your data and resources.
services: healthcare-apis
author: chachachachami
ms.service: healthcare-apis
ms.subservice: events
ms.topic: how-to
ms.date: 01/31/2024
ms.author: chrupa
---

# Disable events

Events in Azure Health Services allow you to monitor and respond to changes in your data and resources. By creating an event subscription, you can specify the conditions and actions for sending notifications to various endpoints.

However, there may be situations where you want to temporarily or permanently stop receiving notifications from an event subscription. For example, you might want to pause notifications during maintenance or testing, or delete the event subscription if you no longer need it. 

To disable events from sending notifications for an **Event Subscription**, you need to delete the subscription.

1. In the Azure portal on the left pane, select **Events**. 

1. Select **Event Subscriptions**. 

1. Select the **Event Subscription** you want to disable notifications for. In the example, the event subscription is named **azuredocsdemo-fhir-events-subscription**.

   :::image type="content" source="media/disable-delete-workspaces/select-event-subscription.png" alt-text="Screenshot showing selection of event subscription to be deleted." lightbox="media/disable-delete-workspaces/select-event-subscription.png":::

1. Choose **Delete**.

   :::image type="content" source="media/disable-delete-workspaces/select-subscription-delete-sml.png" alt-text="Screenshot showing confirmation of the event subscription to be deleted." lightbox="media/disable-delete-workspaces/select-subscription-delete-lrg.png":::

1. If there are multiple event subscriptions, repeat these steps to delete each one until the message **No Event Subscriptions Found** is displayed in the **Name** field.

   :::image type="content" source="media/disable-delete-workspaces/no-event-subscriptions-found-sml.png" alt-text="Screenshot showing deletion of all event subscriptions to disable events." lightbox="media/disable-delete-workspaces/no-event-subscriptions-found-lrg.png":::

> [!NOTE] 
> When you delete all event subscriptions, the FHIR or DICOM service disables events and goes into **Updating** status. The FHIR or DICOM service stays online during the update, but you can’t change the configuration until it completes.

## Delete events-enabled workspaces

To delete events-enabled workspaces without errors, do these steps in this exact order:

1. Delete all child resources associated with the workspace (for example, FHIR&reg; services, DICOM&reg; services, and MedTech services).

1. [Delete all event subscriptions](#disable-events) associated with the workspace.

1. Delete the workspace.

## Next steps

[Troubleshoot events](events-troubleshooting-guide.md)

[!INCLUDE [FHIR and DICOM trademark statement](../includes/healthcare-apis-fhir-dicom-trademark.md)]

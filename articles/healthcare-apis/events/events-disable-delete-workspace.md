---
title: How to disable events and delete events enabled workspaces - Azure Health Data Services
description: Learn how to disable events and delete events enabled workspaces.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 09/26/2023
ms.author: jasteppe
---

# How to disable events and delete event enabled workspaces

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

In this article, learn how to disable events and delete events enabled workspaces.

## Disable events

To disable events from sending event messages for a single **Event Subscription**, the **Event Subscription** must be deleted.

1. Select the **Event Subscription** to be deleted. In this example, we're selecting an Event Subscription named **fhir-events**.

   :::image type="content" source="media/disable-delete-workspaces/select-event-subscription.png" alt-text="Screenshot of Events Subscriptions and select event subscription to be deleted." lightbox="media/disable-delete-workspaces/select-event-subscription.png":::

2. Select **Delete** and confirm the **Event Subscription** deletion.

   :::image type="content" source="media/disable-delete-workspaces/select-subscription-delete.png" alt-text="Screenshot of events subscriptions and select delete and confirm the event subscription to be deleted." lightbox="media/disable-delete-workspaces/select-subscription-delete.png":::

3. If you have multiple **Event Subscriptions**, follow the steps to delete the **Event Subscriptions** so that no **Event Subscriptions** remain.

   :::image type="content" source="media/disable-delete-workspaces/no-event-subscriptions-found.png" alt-text="Screenshot of Event Subscriptions and delete all event subscriptions to disable events." lightbox="media/disable-delete-workspaces/no-event-subscriptions-found.png":::

> [!NOTE]
> The FHIR service will automatically go into an **Updating** status to disable events when a full delete of **Event Subscriptions** is executed. The FHIR service will remain online while the operation is completing, however, you won't be able to make any further configuration changes to the FHIR service until the updating has completed.

## Delete events enabled workspaces

To avoid errors and successfully delete events enabled workspaces, follow these steps and in this specific order:

1. Delete all workspace associated child resources (for example: DICOM services, FHIR services, and MedTech services).
2. Delete all workspace associated **Event Subscriptions**.
3. Delete workspace.

## Next steps

In this article, you learned how to disable events and delete events enabled workspaces.

To learn about how to troubleshoot events, see

> [!div class="nextstepaction"]
> [Troubleshoot events](events-troubleshooting-guide.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.

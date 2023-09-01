---
title: How to disable the Events feature and delete Azure Health Data Services workspaces - Azure Health Data Services
description: Learn how to disable the Events feature and delete Azure Health Data Services workspaces.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 07/11/2023
ms.author: jasteppe
---

# How to disable the Events feature and delete Azure Health Data Services workspaces

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

In this article, learn how to disable the Events feature and delete Azure Health Data Services workspaces.

## Disable Events

To disable Events from sending event messages for a single **Event Subscription**, the **Event Subscription** must be deleted.

1. Select the **Event Subscription** to be deleted. In this example, we select an Event Subscription named **fhir-events**.

   :::image type="content" source="media/disable-delete-workspaces/events-select-subscription.png" alt-text="Screenshot of Events subscriptions and select event subscription to be deleted." lightbox="media/disable-delete-workspaces/events-select-subscription.png":::

2. Select **Delete** and confirm the Event Subscription deletion.

   :::image type="content" source="media/disable-delete-workspaces/events-select-subscription-delete.png" alt-text="Screenshot of events subscriptions and select delete and confirm the event subscription to be deleted." lightbox="media/disable-delete-workspaces/events-select-subscription-delete.png":::

3. To completely disable Events, delete all **Event Subscriptions** so that no **Event Subscriptions** remain.

   :::image type="content" source="media/disable-delete-workspaces/events-disable-no-subscriptions.png" alt-text="Screenshot of Events subscriptions and delete all event subscriptions to disable events." lightbox="media/disable-delete-workspaces/events-disable-no-subscriptions.png":::

> [!NOTE]
> The FHIR service will automatically go into an **Updating** status to disable the Events extension when a full delete of Event Subscriptions is executed. The FHIR service will remain online while the operation is completing.

## Delete workspaces

To avoid errors and successfully delete workspaces, follow these steps and in this specific order:

1. Delete all workspace associated child resources - for example: DICOM services, FHIR services, and MedTech services.
2. Delete all workspace associated Event Subscriptions.
3. Delete workspace.

## Next steps

In this article, you learned how to disable the Events feature and delete workspaces.

To learn about how to troubleshoot Events, see

> [!div class="nextstepaction"]
> [Troubleshoot Events](events-troubleshooting-guide.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.

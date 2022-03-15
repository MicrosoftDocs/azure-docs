---
title: Disable Events and delete Workspaces - Azure Health Data Services
description: This article provides resources on how to disable Events and delete Workspaces.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 03/01/2022
ms.author: jasteppe
---

# Disable Events and delete Workspaces

In this article, you'll learn how to disable Events and delete Workspaces in Azure Health Data Services.

## Disable Events

To disable Events from sending event messages for a single Event Subscription, the Event Subscription must be deleted.

1. Select the Event Subscription to be deleted. In this example, we'll be selecting an Event Subscription named **fhir-events**.

   :::image type="content" source="media/disable-delete-workspaces/events-select-subscription.png" alt-text="Screenshot of Events subscriptions and select event subscription to be deleted." lightbox="media/disable-delete-workspaces/events-select-subscription.png":::

2. Select **Delete** and confirm the Event Subscription deletion.

   :::image type="content" source="media/disable-delete-workspaces/events-select-subscription-delete.png" alt-text="Screenshot of events subscriptions and select delete and confirm the event subscription to be deleted." lightbox="media/disable-delete-workspaces/events-select-subscription-delete.png":::

3. To completely disable Events, delete all Event Subscriptions so that no Event Subscriptions remain.

   :::image type="content" source="media/disable-delete-workspaces/events-disable-no-subscriptions.png" alt-text="Screenshot of Events subscriptions and delete all event subscriptions to disable events." lightbox="media/disable-delete-workspaces/events-disable-no-subscriptions.png":::

> [!NOTE]
>
> The Fast Healthcare Interoperability Resources (FHIR&#174;) service will automatically go into an **Updating** status to disable the Events extension when a full delete of Event Subscriptions is executed. The FHIR service will remain online while the operation is completing.

## Delete Workspaces

To successfully delete a Workspace, delete all associated child resources first (for example: DICOM services, FHIR services and MedTech services), delete all Event Subscriptions, and then delete the Workspace. Not deleting the child resources and Event Subscriptions first will cause an error when attempting to delete a Workspace with child resources.

As an example:

 1. Delete all Workspace associated child resources - for example: DICOM service(s), FHIR service(s), and MedTech service(s).
 2. Delete all Workspace associated Event Subscriptions.
 3. Delete Workspace.

## Next steps

For more information about how to troubleshoot Events, see

>[!div class="nextstepaction"]
>[Troubleshoot Events](./events-troubleshooting-guide.md)

(FHIR&#174;) is a registered trademark of HL7 and is used with the permission of HL7.

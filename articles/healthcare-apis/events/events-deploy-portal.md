---
title: Deploy events for Azure Health Data Services using the Azure portal
description: Learn how to use the Azure portal to deploy an event subscription to report events for Azure Health Data Services FHIR and DICOM services.
services: healthcare-apis
author: chachachachami
ms.service: azure-health-data-services
ms.subservice: events
ms.topic: quickstart
ms.date: 05/01/2026
ms.author: chrupa
ms.custom: sfi-image-nochange
ai-usage: ai-assisted
---

# Quickstart: Deploy events by using the Azure portal

In this quickstart, you learn how to deploy the events feature in the Azure portal to send FHIR&reg; and DICOM&reg; event messages.

## Prerequisites

Before you begin the steps to deploy the events feature, complete the following prerequisites.

* An active Azure account. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* [Microsoft Azure Event Hubs namespace and an event hub deployed in the Azure portal](../../event-hubs/event-hubs-create.md)
* [Workspace deployed in the Azure Health Data Services](../healthcare-apis-quickstart.md)  
* [FHIR service deployed in the workspace](../fhir/fhir-portal-quickstart.md) or [DICOM service deployed in the workspace](../dicom/deploy-dicom-services-in-azure.md)

## Deploy events 

1. Browse to the workspace that contains the FHIR or DICOM service you want to send event messages from.  
1. Select **Events** on the left menu. Then select **+ Event Subscription** on the toolbar.
 
   :::image type="content" source="media/events-deploy-in-portal/events-workspace-select.png" alt-text="Screenshot of workspace and select Events button." lightbox="media/events-deploy-in-portal/events-workspace-select.png":::

1. **Name**: Enter a name for your event subscription.
1. **System Topic Name**: Enter a name for your system topic.

    > [!NOTE]
    > The first time you set up the events feature, enter a new **System Topic Name**. After the system topic for the workspace is created, use the **System Topic Name** for any additional event subscriptions that you create within the workspace.
    
1. **Event types**: Select the type of FHIR or DICOM events to send messages for, such as create, updated, and deleted.

   :::image type="content" source="media/events-deploy-in-portal/events-event-types.png" alt-text="Screenshot of event types selection."  lightbox="media/events-deploy-in-portal/events-event-types.png":::


1. **Endpoint Type**: Select **Event Hub**.
1. **Endpoint**: Select **Configure an endpoint**. 
    1. Select the **Event Hub Namespace** and **Event Hub**.
    1. Select **Confirm selection**.

       :::image type="content" source="media/events-deploy-in-portal/events-endpoint.png" alt-text="Screenshot of event hub endpoint selection."  lightbox="media/events-deploy-in-portal/events-endpoint.png":::

       > [!NOTE]
       > For this quickstart, use the default values for the **Event Schema** and the **Managed Identity Type** settings.

1. Select **Create**. 

   :::image type="content" source="media/events-deploy-in-portal/events-create-new-subscription.png" alt-text="Screenshot of the create event subscription box."  lightbox="media/events-deploy-in-portal/events-create-new-subscription.png":::


Event messages aren't sent until the Event Grid System Topic deployment successfully completes. Upon successful creation of the Event Grid System Topic, the status of the workspace changes from **Updating** to **Succeeded**.

:::image type="content" source="media/events-deploy-in-portal/events-new-subscription-create.png" alt-text="Screenshot of an events subscription being deployed."  lightbox="media/events-deploy-in-portal/events-new-subscription-create.png":::

:::image type="content" source="media/events-deploy-in-portal/events-workspace-update.png" alt-text="Screenshot of an events subscription successfully deployed."  lightbox="media/events-deploy-in-portal/events-workspace-update.png":::

After the subscription is deployed, it needs access to your message delivery endpoint. 

:::image type="content" source="media/events-deploy-in-portal/events-new-subscription-created.png" alt-text="Screenshot of a successfully deployed events subscription."  lightbox="media/events-deploy-in-portal/events-new-subscription-created.png":::    

> [!TIP]
> For more information about providing access by using an Azure Managed identity, see [Assign a system-managed identity to an Event Grid system topic](../../event-grid/enable-identity-system-topics.md) and [Event delivery with a managed identity](../../event-grid/managed-service-identity.md). 
>
> For more information about managed identities, see [What are managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).
>
> For more information about Azure role-based access control (Azure RBAC), see [What is Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). 

## Next steps

In this quickstart, you learned how to deploy events by using the Azure portal. 

To learn how to enable the events metrics, see

> [!div class="nextstepaction"]
> [Use metrics](events-use-metrics.md)

To learn how to export Event Grid system diagnostic logs and metrics, see

> [!div class="nextstepaction"]
> [Enable diagnostic settings for events](events-enable-diagnostic-settings.md)

[!INCLUDE [FHIR and DICOM trademark statement](../includes/healthcare-apis-fhir-dicom-trademark.md)]

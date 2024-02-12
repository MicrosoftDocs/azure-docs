---
title: Deploy events using the Azure portal - Azure Health Data Services
description: Learn how to deploy the events feature using the Azure portal.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 06/23/2022
ms.author: jasteppe
---

# Quickstart: Deploy events using the Azure portal

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

In this quickstart, learn how to deploy the events feature in the Azure portal to send FHIR and DICOM event messages.

## Prerequisites

It's important that you have the following prerequisites completed before you begin the steps of deploying the events feature.

* [An active Azure account](https://azure.microsoft.com/free/search/?OCID=AID2100131_SEM_c4b0772dc7df1f075552174a854fd4bc:G:s&ef_id=c4b0772dc7df1f075552174a854fd4bc:G:s&msclkid=c4b0772dc7df1f075552174a854fd4bc)
* [Microsoft Azure Event Hubs namespace and an event hub deployed in the Azure portal](../../event-hubs/event-hubs-create.md)
* [Workspace deployed in the Azure Health Data Services](../healthcare-apis-quickstart.md)  
* [FHIR service deployed in the workspace](../fhir/fhir-portal-quickstart.md) or [DICOM service deployed in the workspace](../dicom/deploy-dicom-services-in-azure.md)

> [!IMPORTANT]
> You will also need to make sure that the Microsoft.EventGrid resource provider has been successfully registered with your Azure subscription to deploy the events feature. For more information, see [Azure resource providers and types - Register resource provider](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider).

> [!NOTE]
> For the purposes of this quickstart, we'll be using a basic events set up and an event hub as the endpoint for events messages. To learn how to deploy Azure Event Hubs, see [Quickstart: Create an event hub using Azure portal](../../event-hubs/event-hubs-create.md).

## Deploy events 

1. Browse to the workspace that contains the FHIR or DICOM service you want to send events messages from and select the **Events** button on the left hand side of the portal.
 
   :::image type="content" source="media/events-deploy-in-portal/events-workspace-select.png" alt-text="Screenshot of workspace and select Events button." lightbox="media/events-deploy-in-portal/events-workspace-select.png":::

2. Select **+ Event Subscription** to begin the creation of an event subscription.

   :::image type="content" source="media/events-deploy-in-portal/events-new-subscription-select.png" alt-text="Screenshot of workspace and select events subscription button." lightbox="media/events-deploy-in-portal/events-new-subscription-select.png":::
 
3. In the **Create Event Subscription** box, enter the following subscription information. 

    * **Name**: Provide a name for your events subscription.
    * **System Topic Name**: Provide a name for your system topic.
   
   > [!NOTE]
   > The first time you set up the events feature, you will be required to enter a new **System Topic Name**. Once the system topic for the workspace is created, the **System Topic Name** will be used for any additional events subscriptions that you create within the workspace.

    * **Event types**: Type of FHIR or DICOM events to send messages for (for example: create, updated, and deleted).
    * **Endpoint Details**: Endpoint to send events messages to (for example: an Azure Event Hubs namespace + an event hub).

   >[!NOTE]
   > For the purposes of this quickstart, we'll use the **Event Schema** and the **Managed Identity Type** settings at their default values.

   :::image type="content" source="media/events-deploy-in-portal/events-create-new-subscription.png" alt-text="Screenshot of the create event subscription box."  lightbox="media/events-deploy-in-portal/events-create-new-subscription.png":::

4. After the form is completed, select **Create** to begin the subscription creation. 

5. Event message sending can't occur until the Event Grid System Topic deployment has successfully completed. Upon successful creation of the Event Grid System Topic, the status of the workspace changes from **Updating** to **Succeeded**.

   :::image type="content" source="media/events-deploy-in-portal/events-new-subscription-create.png" alt-text="Screenshot of an events subscription being deployed"  lightbox="media/events-deploy-in-portal/events-new-subscription-create.png":::

   :::image type="content" source="media/events-deploy-in-portal/events-workspace-update.png" alt-text="Screenshot of an events subscription successfully deployed."  lightbox="media/events-deploy-in-portal/events-workspace-update.png":::

6. After the subscription is deployed, it will require access to your message delivery endpoint. 

   :::image type="content" source="media/events-deploy-in-portal/events-new-subscription-created.png" alt-text="Screenshot of a successfully deployed events subscription."  lightbox="media/events-deploy-in-portal/events-new-subscription-created.png":::    

   > [!TIP]
   > For more information about providing access using an Azure Managed identity, see [Assign a system-managed identity to an Event Grid system topic](../../event-grid/enable-identity-system-topics.md) and [Event delivery with a managed identity](../../event-grid/managed-service-identity.md). 
   >
   > For more information about managed identities, see [What are managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).
   >
   > For more information about Azure role-based access control (Azure RBAC), see [What is Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). 

## Next steps

In this quickstart, you learned how to deploy events using the Azure portal. 

To learn how to enable the events metrics, see

> [!div class="nextstepaction"]
> [How to use events metrics](events-use-metrics.md)

To learn how to export Event Grid system diagnostic logs and metrics, see

> [!div class="nextstepaction"]
> [How to enable diagnostic settings for events](events-enable-diagnostic-settings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.

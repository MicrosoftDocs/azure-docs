---
title: Deploy Events in the Azure portal - Azure Health Data Services
description: This article describes how to deploy the Events feature in the Azure portal.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 03/14/2022
ms.author: jasteppe
---

# Deploy Events in the Azure portal

In this quickstart, you’ll learn how to deploy the Azure Health Data Services Events feature in the Azure portal to send Fast Healthcare Interoperability Resources (FHIR®) event messages.

## Prerequisites

It's important that you have the following prerequisites completed before you begin the steps of deploying the Events feature in Azure Health Data Services.

* [An active Azure account](https://azure.microsoft.com/free/search/?OCID=AID2100131_SEM_c4b0772dc7df1f075552174a854fd4bc:G:s&ef_id=c4b0772dc7df1f075552174a854fd4bc:G:s&msclkid=c4b0772dc7df1f075552174a854fd4bc)
* [Event Hubs namespace and an event hub deployed in the Azure portal](../../event-hubs/event-hubs-create.md)
* [Workspace deployed in Azure Health Data Services](../healthcare-apis-quickstart.md)  
* [FHIR service deployed in Azure Health Data Services](../fhir/fhir-portal-quickstart.md)

> [!NOTE]
> For the purposes of this quickstart, we'll be using a basic set up and an event hub as the endpoint for Events messages.

## Deploy Events 

1. Browse to the Workspace that contains the FHIR service you want to send event messages from and select the **Events** blade.
 
   :::image type="content" source="media/events-deploy-in-portal/events-workspace-select.png" alt-text="Screenshot of Workspace and select Events button." lightbox="media/events-deploy-in-portal/events-workspace-select.png":::

2. Select **+ Event Subscription** to begin the creation of an event subscription.

   :::image type="content" source="media/events-deploy-in-portal/events-new-subscription-select.png" alt-text="Screenshot of Workspace and select events subscription button." lightbox="media/events-deploy-in-portal/events-new-subscription-select.png":::

3. In the **Create Event Subscription** box, enter the following subscription information.

    * **Name**: Provide a name for your Events subscription.
    * **Event types**: Type of FHIR events to send messages for (for example: create, updated, and deleted).
    * **Endpoint Details**: Endpoint to send Events messages to (for example: an Event Hubs).

   >[!NOTE]
   > For the purposes of this quickstart, we'll use the **Event Schema** and the **Managed Identity Type** settings as their defaults.

   :::image type="content" source="media/events-deploy-in-portal/events-create-new-subscription.png" alt-text="Screenshot of the create event subscription box."  lightbox="media/events-deploy-in-portal/events-create-new-subscription.png":::

4. After the form is completed, select **Create** to begin the subscription creation. 

5. After provisioning a new Events subscription, event messages won't be sent until the System Topic deployment has successfully completed and the status of the Workspace has changed from "Updating" to "Succeeded".

   :::image type="content" source="media/events-deploy-in-portal/events-new-subscription-create.png" alt-text="Screenshot of an events subscription being deployed"  lightbox="media/events-deploy-in-portal/events-new-subscription-create.png":::

   :::image type="content" source="media/events-deploy-in-portal/events-workspace-update.png" alt-text="Screenshot of an events subscription successfully deployed."  lightbox="media/events-deploy-in-portal/events-workspace-update.png":::


6. After the subscription is deployed, it will require access to your message delivery endpoint. 

   :::image type="content" source="media/events-deploy-in-portal/events-new-subscription-created.png" alt-text="Screenshot of a successfully deployed events subscription."  lightbox="media/events-deploy-in-portal/events-new-subscription-created.png":::    

   >[!TIP]
   >For more information about providing access using an Azure Managed identity, see
   > - [Assign a system-managed identity to an Event Grid system topic](../../event-grid/enable-identity-system-topics.md)
   > - [Event delivery with a managed identity](../../event-grid/managed-service-identity.md) 
   >
   >For more information about managed identities, see 
   > - [What are managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/overview)
   >
   >For more information about Azure role-based access control (Azure RBAC), see 
   > - [What is Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview) 

## Next steps

In this article, you've learned how to deploy Events in the Azure portal. 

To learn how to display the Events metrics, see

>[!div class="nextstepaction"]
>[How to display Events metrics](./events-display-metrics.md)

To learn how to export Event Grid system diagnostic logs and metrics, see

>[!div class="nextstepaction"]
>[How to export Events diagnostic logs and metrics](./events-display-metrics.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.

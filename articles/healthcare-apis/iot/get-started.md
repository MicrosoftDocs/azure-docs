---
title: Get started with the MedTech service - Azure Health Data Services
description: This article describes how to get started with the MedTech service.
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 04/20/2023
ms.author: jasteppe
ms.custom: mode-api
---

# Get started with the MedTech service 

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article outlines the basic steps to get started with the MedTech service in the [Azure Health Data Services](../healthcare-apis-overview.md).

:::image type="content" source="media/get-started/get-started-with-medtech-service.png" alt-text="Diagram showing the MedTech service deployment overview." lightbox="media/get-started/get-started-with-medtech-service.png":::

## Subscription prerequisites

To begin the deployment, you need to determine if you have:

* An active Azure subscription.
* Azure role-based access control (Azure RBAC) role assignments at the subscription level for deploying resources and granting access permissions. The roles required for you to complete the deployment are: **Contributor and User Access Administrator** or **Owner**. The **Contributor** role allows you to provision resources, and the **User Access Administrator** role allows you to grant access between resources. The **Owner** role can perform both actions.  

If you already have the appropriate active subscription and Azure RBAC role assignments, you can skip this section.

* If you don't have an active Azure subscription, see [Subscription decision guide](/azure/cloud-adoption-framework/decision-guides/subscriptions/).
* If you don't have the correct Azure RBAC role assignments, see [Azure role-based access control (RBAC)](/azure/cloud-adoption-framework/ready/considerations/roles).

## Deploy resources

> [!TIP]
> See these MedTech service articles that will help to simply and automate the deployment of the MedTech service. 
>
> * [Tutorial: Receive device messages through Azure IoT Hub](device-messages-through-iot-hub.md).
>
> * [Quickstart: Deploy the MedTech service using an Azure Resource Manager template](deploy-new-arm.md).

After you obtain the required subscription prerequisites, the first step is to deploy the MedTech service prerequisite resources:

* Azure resource group.
* Azure Event Hubs namespace and event hub.
* Azure Health Data services workspace.
* Azure Health Data Services FHIR service.

Once the prerequisite resources are available, deploy:
 
* Azure Health Data Services MedTech service.

### Deploy a resource group 

Deploy a [resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md) to contain the prerequisite resources and the MedTech service.

### Deploy an Event Hubs namespace and event hub

Deploy an Event Hubs namespace into the resource group. Event Hubs namespaces are logical containers for event hubs. Once the namespace is deployed, you can deploy an event hub, which is used to host device messages until the MedTech service can ingest them for processing. For information about deploying Event Hubs namespaces and event hubs, see [Quickstart: Create an event hub using Azure portal](../../event-hubs/event-hubs-create.md).

### Deploy a workspace

 Deploy a [workspace](../workspace-overview.md). After you create a workspace using the [Azure portal](../healthcare-apis-quickstart.md), a FHIR service and MedTech service can be deployed from the workspace.

### Deploy a FHIR service

Deploy a [FHIR service](../fhir/fhir-portal-quickstart.md) into your resource group using your workspace. The MedTech service persists transformed device data into the FHIR service. 

### Deploy a MedTech service

If you have successfully deployed the prerequisite resources, you're now ready to deploy a [MedTech service](deploy-new-manual.md) using your workspace.

## Next steps

This article described the basic steps needed to get started using the MedTech service. 

To learn about methods of deploying the MedTech service, see

> [!div class="nextstepaction"]
> [Choose a deployment method for the MedTech service](deploy-new-choose.md)

> For an overview of the MedTech service device mapping, see
> [Overview of the MedTech service device mapping](overview-of-device-mapping.md)

> For an overview of the MedTech service FHIR destination mapping, see
> [Overview of the MedTech service FHIR destination mapping](overview-of-fhir-destination-mapping.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.

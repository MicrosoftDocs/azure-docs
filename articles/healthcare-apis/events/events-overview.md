---
title: What are Events? - Azure Health Data Services
description: In this article, you'll learn about Events, its features, integrations, and next steps.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 02/16/2022
ms.author: jasteppe
---

# What are Events?

The Events feature sends notification messages to Event subscribers. Event notifications can be configured with templates and schemas to help better support FHIR observations and resource changes. When data resources change and get committed to the Fast Healthcare Interoperability Resources (FHIR&#174;) service, the Events feature sends notification messages. The notification message can be sent to multiple end points ranging from email to text messages. These event notification occurrences can trigger workflows that support the changes occurring from the IoMT health data it originated from. The Events feature integrates with the Azure Event Grid service and creates a system topic for the Azure Health Data Services Workspace.

> [!IMPORTANT]
>
> FHIR resource change data is only written and event messages are sent when the Events feature is turned on. The Event feature doesn't send messages on past FHIR resource changes or when the feature is turned off.

> [!TIP]
> 
> For more information about the features, configurations, and to learn about the use cases of the Azure Event Grid service, see [Azure Event Grid](../../event-grid/overview.md)

:::image type="content" source="media/events-overview/events-overview-flow.png" alt-text="Diagram of data flow from users to a FHIR service and then into the Events pipeline" lightbox="media/events-overview/events-overview-flow.png":::

> [!IMPORTANT]
> 
> Events currently supports only the following FHIR resource operations:
>
> - **FhirResourceCreated** - The event emitted after a FHIR resource gets created successfully.
>
> - **FhirResourceUpdated** - The event emitted after a FHIR resource gets updated successfully.
>
> - **FhirResourceDeleted** - The event emitted after a FHIR resource gets soft deleted successfully.
> 
> For more information about the FHIR service delete types, see [FHIR Rest API capabilities for Azure Health Data Services FHIR service](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md)

## Scalable

Events are designed to support growth and change in healthcare by using autoscaling features and the Azure Event Grid service. 

## Extensible

Use Events to send messages to other services like Azure Functions, Azure Event Hubs to trigger downstream automated workflows. Events support other end points to enhance items such as operational data, data analysis, and visibility to the incoming data capturing near real time.
 
## Secure

Built on a platform that supports PHI and PII data compliance with privacy, safety, and security Events feature does not transmit sensitive data such as personal identifiable information and protected health information as part of the message payload.

## Next steps

For more information about deploying Events, see

>[!div class="nextstepaction"]
>[Deploying Events in the Azure portal](./events-deploy-in-portal.md)

For frequently asks questions (FAQs) about Events, see

>[!div class="nextstepaction"]
>[Events FAQs](./events-deploy-in-portal.md)

For Events troubleshooting resources, see

>[!div class="nextstepaction"]
>[Events troubleshooting guide](./events-troubleshooting-guide.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.

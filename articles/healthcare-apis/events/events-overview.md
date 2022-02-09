---
title: What are Events? - Azure Healthcare APIs
description: In this article, you'll learn about Events, its features, integrations, and next steps.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 02/08/2022
ms.author: jasteppe
---

# What are Events?

The Events feature enables you to receive event notification messages from Azure Healthcare APIs. When data resources change and get committed to the FHIR service, the Events feature sends notification messages. These event notification occurrences can be used to trigger downstream automated workflows. The Events feature integrates with the Azure Event Grid service and creates a system topic for the Azure Healthcare APIs Workspace. 

> [!TIP]
> For more information about the features, configurations, and to learn about the use cases of the Azure Event Grid service, see [Azure Event Grid](../../event-grid/overview.md)

:::image type="content" source="media/events-overview/events-overview-flow.png" alt-text="Diagram of data flow from users to a FHIR service and then into the Events pipeline" lightbox="media/events-overview/events-overview-flow.png":::

> [!IMPORTANT]
> Events currently supports only the following FHIR resource operations:
>
> **FhirResourceCreated** - The event emitted after a FHIR resource gets created successfully.
> **FhirResourceCreated** - The event emitted after a FHIR resource gets created successfully.
> **FhirResourceDeleted** - The event emitted after a FHIR resource gets soft deleted successfully.
> 
> For more information about the FHIR service delete types, see [FHIR Rest API capabilities for Azure Healthcare APIs FHIR service](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md)


## Flexible

Events are designed to support growth and change in healthcare by using autoscaling features and the Azure Event Grid service.

## Configurable 

Use advanced features like filters, dead-lettering, and retry policies to tune event message delivery options.

> [!NOTE]
> The advanced features are only available for the Event Grid service at this time.

## Extensible

Use Events to send messages to other services like Azure Functions, Azure Event Hubs to trigger downstream automated workflows.
 
## Secure

By default, Events don't transmit sensitive data such as personal identifiable information and protected health information as part of the message payload. 

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

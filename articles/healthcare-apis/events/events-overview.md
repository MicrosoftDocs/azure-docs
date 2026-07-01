---
title: What are events in Azure Health Data Services?
description: Learn how to deploy events in Azure Health Data Services to receive notifications of changes to health data in the FHIR and DICOM services.
services: healthcare-apis
author: chachachachami
ms.service: azure-health-data-services
ms.subservice: events
ms.topic: overview
ms.date: 04/15/2026
ms.author: chrupa
ai-usage: ai-assisted
---

# What are events?

Events in Azure Health Data Services enable you to subscribe to and receive notifications about changes to health data in the FHIR&reg; service or the DICOM&reg; service. Events also let you trigger services based on health data changes, such as starting workflows or sending emails, texts, or alerts.

Events are:

- **Scalable**. Events support growth and change in an organization's healthcare data needs by using the [Azure Event Grid service](../../event-grid/overview.md) and creating a [system topic](../../event-grid/system-topics.md) for Azure Health Data Services. For more information, see [Azure Event Grid event schema](../../event-grid/event-schema.md) and [Azure Health Data Services as an Event Grid source](../../event-grid/event-schema-azure-health-data-services.md).

- **Configurable**. Choose which FHIR and DICOM event types trigger event notifications. Use advanced features built into the Azure Event Grid service, such as filters, dead-lettering, and retry policies to tune message delivery options for events. 

- **Extensible**. Use events to send FHIR resource and DICOM image change messages to [Azure Event Hubs](../../event-hubs/event-hubs-about.md) or [Azure Functions](../../azure-functions/functions-overview.md). Use the messages to trigger downstream automated workflows that enhance operational data, data analysis, and visibility of the incoming data capturing in near real time.
 
- **Secure**. Events are built on a platform that supports protected health information (PHI) compliance with privacy, safety, and security standards. Use [Azure managed identities](../../event-hubs/enable-managed-identity.md) to provide secure access from the Event Grid system topic to the events message-receiving endpoints of your choice. You can use [Azure Private Link](../../event-hubs/private-link-service.md) to secure the connection between your services and the Event Grid system topic.

:::image type="content" source="media/events-overview/events-overview-flow.png" alt-text="Diagram of data flow from users to a FHIR service and then into the events pipeline." lightbox="media/events-overview/events-overview-flow.png":::

## Supported operations

Events support these operations:

| Operation           | Trigger condition                |
|---------------------|----------------------------------|
| FhirResourceCreated | A FHIR resource is created.      |
| FhirResourceUpdated | A FHIR resource is updated.      |
| FhirResourceDeleted | A FHIR resource is soft deleted. |
| DicomImageCreated   | A DICOM image is created.        |
| DicomImageDeleted   | A DICOM image is deleted.        |
| DicomImageUpdated   | A DICOM image is updated.        |

For more information about delete types in the FHIR service, see [REST API capabilities in the FHIR service in Azure Health Data Services](../fhir/rest-api-capabilities.md).

> [!IMPORTANT] 
> The events capability sends event notifications only when you turn it on. It doesn't send messages for past changes or when you turn off the capability.

## Next steps

[Deploy events by using the Azure portal](events-deploy-portal.md)

[Troubleshoot events](events-troubleshooting-guide.md)

[Events FAQ](events-faqs.md)

[!INCLUDE [FHIR DICOM trademark statement](../includes/healthcare-apis-fhir-dicom-trademark.md)]

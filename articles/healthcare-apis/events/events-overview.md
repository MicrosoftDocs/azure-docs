---
title: What are events in Azure Health Data Services?
description: Learn how to use events in Azure Health Data Services to subscribe to and receive notifications of changes to health data in the FHIR and DICOM services, and trigger other actions or services based on health data changes.
services: healthcare-apis
author: chachachachami
ms.service: healthcare-apis
ms.subservice: events
ms.topic: overview
ms.date: 01/29/2024
ms.author: chrupa
---

# What are events?

Events in Azure Health Data Services allow you to subscribe to and receive notifications of changes to health data in the FHIR&reg; service or the DICOM&reg; service. Events also enable you to trigger other actions or services based changes to health data, such as starting workflows, sending email, text messages, or alerts. 

Events are:

- **Scalable**. Events support growth and change in an organization's healthcare data needs by using the [Azure Event Grid service](../../event-grid/overview.md) and creating a [system topic](../../event-grid/system-topics.md) for Azure Health Data Services. For more information, see [Azure Event Grid event schema](../../event-grid/event-schema.md) and [Azure Health Data Services as an Event Grid source](../../event-grid/event-schema-azure-health-data-services.md).

- **Configurable**. Choose which FHIR and DICOM event types trigger event notifications. Use advanced features built into the Azure Event Grid service, such as filters, dead-lettering, and retry policies to tune message delivery options for events. 

- **Extensible**. Use events to send FHIR resource and DICOM image change messages to [Azure Event Hubs](../../event-hubs/event-hubs-about.md) or [Azure Functions](../../azure-functions/functions-overview.md).  to trigger downstream automated workflows that enhance operational data, data analysis, and visibility of the incoming data capturing in near real time.
 
- **Secure**. Events are built on a platform that supports protected health information (PHI) compliance with privacy, safety, and security standards. Use [Azure managed identities](../../active-directory/managed-identities-azure-resources/overview.md) to provide secure access from the Event Grid system topic to the events message-receiving endpoints of your choice.

:::image type="content" source="media/events-overview/events-overview-flow.png" alt-text="Diagram of data flow from users to a FHIR service and then into the events pipeline." lightbox="media/events-overview/events-overview-flow.png":::

## Supported operations

Events support these operations:

| Operation           | Trigger condition                |
|---------------------|----------------------------------|
| FhirResourceCreated | A FHIR resource was created.      |
| FhirResourceUpdated | A FHIR resource was updated.      |
| FhirResourceDeleted | A FHIR resource was soft deleted. |
| DicomImageCreated   | A DICOM image was created.        |
| DicomImageDeleted   | A DICOM image was deleted.        |
| DicomImageUpdated   | A DICOM image was updated.        |

For more information about delete types in the FHIR service, see [REST API capabilities in the FHIR service in Azure Health Data Services](../fhir/rest-api-capabilities.md).

> [!IMPORTANT] 
> Event notifications are sent only when the capability is turned on. The events capability doesn't send messages for past changes or when the capability is turned off.

## Next steps

[Deploy events by using the Azure portal](events-deploy-portal.md)

[Troubleshoot events](events-troubleshooting-guide.md)

[Events FAQ](events-faqs.md)

[!INCLUDE [FHIR DICOM trademark statement](../includes/healthcare-apis-fhir-dicom-trademark.md)]

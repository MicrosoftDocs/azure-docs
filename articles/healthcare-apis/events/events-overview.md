---
title: What are events? - Azure Health Data Services
description: Learn how to use events in Azure Health Data Services to subscribe to and receive notifications of changes to health data in the FHIR and DICOM services, and trigger other actions or services based on health data changes.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: events
ms.topic: overview
ms.date: 01/29/2024
ms.author: jasteppe
appliesto:
- FHIR service
- DICOM service
---

# What are events?

Events in Azure Health Data Services allow you to subscribe to and receive notifications of changes to health data in the FHIR&reg; service or the DICOM&reg; service, such as medical records, images, and reports. Events also enable you to trigger other actions or services based on health data changes, such as starting workflows, sending email or text messages, or triggering alerts. 

Events are:

- **Scalable**. Events support growth and changes in healthcare technology needs by using the [Azure Event Grid service](../../event-grid/overview.md) and creating a system topic for Azure Health Data Services.

- **Configurable**. Choose which FHIR and DICOM event types trigger event notifications. Use advanced features built into the Azure Event Grid service, such as filters, dead-lettering, and retry policies to tune message delivery options for events. 

- **Extensible**. Use events to send FHIR resource and DICOM image change messages to [Azure Event Hubs](../../event-hubs/event-hubs-about.md) or [Azure Functions](../../azure-functions/functions-overview.md) to trigger downstream automated workflows that enhance operational data, data analysis, and visibility of the incoming data capturing in near real time.
 
- **Secure**. Events are built on a platform that supports protected health information (PHI) compliance with privacy, safety, and security standards. Use [Azure managed identities](../../active-directory/managed-identities-azure-resources/overview.md) to provide secure access from the Event Grid system topic to the events message-receiving endpoints of your choice.

:::image type="content" source="media/events-overview/events-overview-flow.png" alt-text="Diagram of data flow from users to a FHIR service and then into the events pipeline." lightbox="media/events-overview/events-overview-flow.png":::

## Integration with Azure Event Grid service

The events capability integrates with the [Azure Event Grid service](../../event-grid/overview.md) and creates a [system topic](../../event-grid/system-topics.md) for Azure Health Data Services. For more information, see [Azure Event Grid event schema](../../event-grid/event-schema.md) and [Azure Health Data Services as an Event Grid source](../../event-grid/event-schema-azure-health-data-services.md).

## Supported operations
Events currently supports the following operations:
- **FhirResourceCreated**. The event emitted after a FHIR resource is created.
- **FhirResourceUpdated**. The event emitted after a FHIR resource is updated.
- **FhirResourceDeleted**. The event emitted after a FHIR resource is soft deleted. 
- **DicomImageCreated**. The event emitted after a DICOM image is created.
- **DicomImageDeleted**. The event emitted after a DICOM image is deleted.
- **DicomImageUpdated**. The event emitted after a DICOM image is updated.
 
For more information about delete types in the FHIR service, see [FHIR REST API capabilities in Azure Health Data Services](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md).

> [!IMPORTANT] 
> Event notifications are sent only when the capability is turned on. The events capability doesn't send messages on past changes or when the capability is turned off.

## Next steps

[Deploy events using the Azure portal](events-deploy-portal.md)
[Troubleshoot events](events-troubleshooting-guide.md)
[Events FAQ](events-faqs.md)

[!INCLUDE [FHIR DICOM trademark statement](../includes/healthcare-apis-fhir-dicom-trademark.md)]

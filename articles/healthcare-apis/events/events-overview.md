---
title: What are Events? - Azure Health Data Services
description: Learn about Events, its features, integrations, and next steps.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 07/11/2023
ms.author: jasteppe
---

# What are Events?

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

Events are a notification and subscription feature in the Azure Health Data Services. Events enable customers to utilize and enhance the analysis and workflows of structured and unstructured data like vitals and clinical or progress notes, operations data, health data, and medical imaging data. 

When FHIR resource changes or Digital Imaging and Communications in Medicine (DICOM) image changes are successfully written to the Azure Health Data Services, the Events feature sends notification messages to Events subscribers. These event notification occurrences can be sent to multiple endpoints to trigger automation ranging from starting workflows to sending email and text messages to support the changes occurring from the health data it originated from. The Events feature integrates with the [Azure Event Grid service](../../event-grid/overview.md) and creates a system topic for the Azure Health Data Services workspace.

> [!IMPORTANT]
> FHIR resource and DICOM image change data is only written and event messages are sent when the Events feature is turned on. The Event feature doesn't send messages on past resource changes or when the feature is turned off.

> [!TIP]
> For more information about the features, configurations, and to learn about the use cases of the Azure Event Grid service, see [Azure Event Grid](../../event-grid/overview.md)

:::image type="content" source="media/events-overview/events-overview-flow.png" alt-text="Diagram of data flow from users to a FHIR service and then into the Events pipeline." lightbox="media/events-overview/events-overview-flow.png":::

> [!IMPORTANT]
> Events currently supports the following operations:
>
> * **FhirResourceCreated** - The event emitted after a FHIR resource gets created successfully.
>
> * **FhirResourceUpdated** - The event emitted after a FHIR resource gets updated successfully.
>
> * **FhirResourceDeleted** - The event emitted after a FHIR resource gets soft deleted successfully.
> 
> * **DicomImageCreated** - The event emitted after a DICOM image gets created successfully.
> 
> * **DicomImageDeleted** - The event emitted after a DICOM image gets deleted successfully.
> 
> - **DicomImageUpdated** - The event emitted after a DICOM image gets updated successfully.
> 
> For more information about the FHIR service delete types, see [FHIR REST API capabilities for Azure Health Data Services FHIR service](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md).

## Scalable

Events are designed to support growth and changes in healthcare technology needs by using the [Azure Event Grid service](../../event-grid/overview.md) and creating a system topic for the Azure Health Data Services Workspace.

## Configurable

Choose the FHIR and DICOM event types that you want to receive messages about. Use the advanced features like filters, dead-lettering, and retry policies to tune Events message delivery options. 

> [!NOTE]
> The advanced features come as part of the Event Grid service. 

## Extensible

Use Events to send FHIR resource and DICOM image change messages to services like [Azure Event Hubs](../../event-hubs/event-hubs-about.md) or [Azure Functions](../../azure-functions/functions-overview.md) to trigger downstream automated workflows to enhance items such as operational data, data analysis, and visibility to the incoming data capturing near real time.
 
## Secure

Built on a platform that supports protected health information compliance with privacy, safety, and security in mind, the Events messages don't transmit sensitive data as part of the message payload.

Use [Azure Managed identities](../../active-directory/managed-identities-azure-resources/overview.md) to provide secure access from your Event Grid system topic to the Events message receiving endpoints of your choice. 

## Next steps

To learn about deploying Events using the Azure portal, see

> [!div class="nextstepaction"]
> [Deploy Events using the Azure portal](./events-deploy-portal.md)

To learn about the frequently asks questions (FAQs) about Events, see
 
> [!div class="nextstepaction"]
> [Frequently asked questions about Events](./events-faqs.md)

To learn about troubleshooting Events, see

> [!div class="nextstepaction"]
> [Troubleshoot Events](./events-troubleshooting-guide.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.

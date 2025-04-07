---
title: Troubleshoot events - Azure Health Data Services
description: Learn how to troubleshoot events.
services: healthcare-apis
author: chachachachami
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: troubleshooting
ms.date: 11/26/2024
ms.author: chrupa
---
# Troubleshoot events

This article provides resources to troubleshoot events.

> [!IMPORTANT]
> The Events feature must be turned on for FHIR&reg; resource and DICOM&reg; image change data to be written, and event messages sent. The event feature doesn't send messages on past FHIR resource or DICOM image changes, or when the feature is turned off.

:::image type="content" source="media/events-overview/events-overview-flow.png" alt-text="Diagram of data flow from users to a FHIR service and then into the events pipeline" lightbox="media/events-overview/events-overview-flow.png":::

## Resources for troubleshooting

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
> * **DicomImageUpdated** - The event emitted after a DICOM image gets updated successfully.
> 
> For more information about the FHIR service delete types, see [REST API capabilities in the FHIR service in Azure Health Data Services](../fhir/rest-api-capabilities.md).

### Events message structures

Use the following resource to learn about the events message structures, required and nonrequired elements, and to see sample Events messages.
* [Events message structures](events-message-structure.md)

### How to's

Use the following resource to learn how to deploy events in the Azure portal.
* [Deploy events by using the Azure portal](events-deploy-portal.md)

> [!IMPORTANT]
> The event subscription requires access to the endpoint you chose to receive events messages. For more information, see [Enable managed identity for a system topic](../../event-grid/enable-identity-system-topics.md).

Use the following resource to learn how to use events metrics.
* [How to use events metrics](events-display-metrics.md)

Use the following resource to learn how to enable diagnostic settings for events.
* [How to enable diagnostic settings for events](events-export-logs-metrics.md)

## Contact support

If you have a technical question about Events or if you have a support related issue, see [Create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) and complete the required fields under the **Problem description** tab. For more information about Azure support options, see [Azure support plans](https://azure.microsoft.com/support/options/#support-plans). 

## Next steps
In this article, you were provided resources for troubleshooting events.

To learn about the frequently asked questions (FAQs) about events, see

> [!div class="nextstepaction"]
> [Frequently asked questions about events](events-faqs.md)

[!INCLUDE [FHIR DICOM trademark statement](../includes/healthcare-apis-fhir-dicom-trademark.md)]

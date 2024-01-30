---
title: Troubleshoot events - Azure Health Data Services
description: Learn how to troubleshoot events.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: troubleshooting
ms.date: 07/12/2023
ms.author: jasteppe
---
# Troubleshoot events

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides resources to troubleshoot events.

> [!IMPORTANT]
> FHIR resource and DICOM image change data is only written and event messages are sent when the Events feature is turned on. The event feature doesn't send messages on past FHIR resource or DICOM image changes or when the feature is turned off.

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
> For more information about the FHIR service delete types, see [FHIR REST API capabilities for Azure Health Data Services FHIR service](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md).

### Events message structures

Use this resource to learn about the events message structures, required and nonrequired elements, and see sample Events messages: 
* [Events message structures](events-message-structure.md)

### How to's

Use this resource to learn how to deploy events in the Azure portal: 
* [Deploy events using the Azure portal](events-deploy-portal.md)

> [!IMPORTANT]
> The Event Subscription requires access to whichever endpoint you chose to send Events messages to. For more information, see [Enable managed identity for a system topic](../../event-grid/enable-identity-system-topics.md).

Use this resource to learn how to use events metrics: 
* [How to use events metrics](events-display-metrics.md)

Use this resource to learn how to enable diagnostic settings for events: 
* [How to enable diagnostic settings for events](events-export-logs-metrics.md)

## Contact support

If you have a technical question about Events or if you have a support related issue, see [Create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) and complete the required fields under the **Problem description** tab. For more information about Azure support options, see [Azure support plans](https://azure.microsoft.com/support/options/#support-plans). 

## Next steps
In this article, you were provided resources for troubleshooting events.

To learn about the frequently asked questions (FAQs) about events, see

> [!div class="nextstepaction"]
> [Frequently asked questions about events](events-faqs.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.

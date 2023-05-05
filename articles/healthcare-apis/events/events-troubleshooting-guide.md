---
title: Events troubleshooting guides - Azure Health Data Services
description: This article helps Events users troubleshoot error messages, conditions, and provides fixes.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: troubleshooting
ms.date: 07/06/2022
ms.author: jasteppe
---
# Troubleshoot Events

This article provides guides and resources to troubleshoot Events.

> [!IMPORTANT]
>
> Fast Healthcare Interoperability Resources (FHIR&#174;) resource and DICOM image change data is only written and event messages are sent when the Events feature is turned on. The Event feature doesn't send messages on past FHIR resource or DICOM image changes or when the feature is turned off.

:::image type="content" source="media/events-overview/events-overview-flow.png" alt-text="Diagram of data flow from users to a FHIR service and then into the Events pipeline" lightbox="media/events-overview/events-overview-flow.png":::

## Events resources for troubleshooting

> [!IMPORTANT]
> Events currently supports only the following operations:
>
> - **FhirResourceCreated** - The event emitted after a FHIR resource gets created successfully.
>
> - **FhirResourceUpdated** - The event emitted after a FHIR resource gets updated successfully.
>
> - **FhirResourceDeleted** - The event emitted after a FHIR resource gets soft deleted successfully. 
>
> - **DicomImageCreated** - The event emitted after a DICOM image gets created successfully.
> 
> - **DicomImageDeleted** - The event emitted after a DICOM image gets deleted successfully.
> 
> For more information about the FHIR service delete types, see [FHIR REST API capabilities for Azure Health Data Services FHIR service](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md)

### Events message structure

Use this resource to learn about the Events message structure, required and non-required elements, and sample messages: 
* [Events message structure](./events-message-structure.md)

### How to

Use this resource to learn how to deploy Events in the Azure portal: 
* [How to deploy Events using the Azure portal](./events-deploy-portal.md)

>[!Important]
>The Event Subscription requires access to whichever endpoint you chose to send Events messages to. For more information, see [Enable managed identity for a system topic](../../event-grid/enable-identity-system-topics.md).

Use this resource to learn how to display Events metrics: 
* [How to display metrics](./events-display-metrics.md)

Use this resource to learn how to export Event Grid system topics diagnostic logs and metrics: 
* [How to export Event Grid system topics diagnostic and metrics logs](./events-export-logs-metrics.md)

## Contacting support

If you have a technical question about Events or if you have a support related issue, see [Create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) and complete the required fields under the **Problem description** tab. For more information about Azure support options, see [Azure support plans](https://azure.microsoft.com/support/options/#support-plans). 

## Next steps
To learn about frequently asked questions (FAQs) about Events, see

>[!div class="nextstepaction"]
>[Frequently asked questions about Events](./events-faqs.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.

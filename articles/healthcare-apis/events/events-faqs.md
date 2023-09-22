---
title: Frequently asked questions about events - Azure Health Data Services
description: Learn about the frequently asked questions about events.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 07/11/2023
ms.author: jasteppe
---

# Frequently asked questions about events

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

## Events: The basics

## Can I use events with a different FHIR/DICOM service other than the Azure Health Data Services FHIR/DICOM service?

No. The Azure Health Data Services events feature only currently supports the Azure Health Data Services FHIR and DICOM services.

## What FHIR resource changes does events support?

Events are generated from the following FHIR service types:

* **FhirResourceCreated** - The event emitted after a FHIR resource gets created successfully.

* **FhirResourceUpdated** - The event emitted after a FHIR resource gets updated successfully.

* **FhirResourceDeleted** - The event emitted after a FHIR resource gets soft deleted successfully.

For more information about the FHIR service delete types, see [FHIR REST API capabilities for Azure Health Data Services FHIR service](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md).

## Does events support FHIR bundles?

Yes. The events feature is designed to emit notifications of data changes at the FHIR resource level. 

Events support these [FHIR bundle types](http://hl7.org/fhir/R4/valueset-bundle-type.html) in the following ways:

* **Batch**: An event is emitted for each successful data change operation in a bundle. If one of the operations generates an error, no event is emitted for that operation. For example: the batch bundle contains five operations, however, there's an error with one of the operations. Events are emitted for the four successful operations with no event emitted for the operation that generated an error.

* **Transaction**: An event is emitted for each successful bundle operation as long as there are no errors. If there are any errors within a transaction bundle, then no events are emitted. For example: the transaction bundle contains five operations, however, there's an error with one of the operations. No events are emitted for that bundle.

> [!NOTE]
> Events are not sent in the sequence of the data operations in the FHIR bundle.

## What DICOM image changes does events support?

Events are generated from the following DICOM service types:

* **DicomImageCreated** - The event emitted after a DICOM image gets created successfully.

* **DicomImageDeleted** - The event emitted after a DICOM image gets deleted successfully.

* **DicomImageUpdated** - The event emitted after a DICOM image gets updated successfully.

## What is the payload of an events message? 

For a detailed description of the events message structure and both required and nonrequired elements, see [Events message structures](events-message-structure.md). 

## What is the throughput for the events messages?

The throughput of the FHIR or DICOM service and the Event Grid govern the throughput of FHIR and DICOM events. When a request made to the FHIR service is successful, it returns a 2xx HTTP status code. It also generates a FHIR resource or DICOM image changing event. The current limitation is 5,000 events/second per workspace for all FHIR or DICOM service instances in the workspace. 

## How am I charged for using events?

There are no extra charges for using [Azure Health Data Services events](https://azure.microsoft.com/pricing/details/health-data-services/). However, applicable charges for the [Event Grid](https://azure.microsoft.com/pricing/details/event-grid/) are assessed against your Azure subscription.

## How do I subscribe to multiple FHIR and/or DICOM services in the same workspace separately?

You can use the Event Grid filtering feature. There are unique identifiers in the event message payload to differentiate different accounts and workspaces. You can find a global unique identifier for workspace in the `source` field, which is the Azure Resource ID. You can locate the unique FHIR account name in that workspace in the `data.resourceFhirAccount` field. You can locate the unique DICOM account name in that workspace in the `data.serviceHostName` field. When you create a subscription, you can use the filtering operators to select the events you want to get in that subscription.

:::image type="content" source="media\event-grid\event-grid-filters.png" alt-text="Screenshot of the Event Grid filters tab." lightbox="media\event-grid\event-grid-filters.png":::

## Can I use the same subscriber for multiple workspaces, FHIR accounts, or DICOM accounts?

Yes. We recommend that you use different subscribers for each individual FHIR or DICOM service to process in isolated scopes.

## Is Event Grid compatible with HIPAA and HITRUST compliance obligations?

Yes. Event Grid supports customer's Health Insurance Portability and Accountability Act (HIPAA) and Health Information Trust Alliance (HITRUST) obligations. For more information, see [Microsoft Azure Compliance Offerings](https://azure.microsoft.com/resources/microsoft-azure-compliance-offerings/).

## What is the expected time to receive an events message?

On average, you should receive your event message within one second after a successful HTTP request. 99.99% of the event messages should be delivered within five seconds unless the limitation of either the FHIR service, DICOM service, or [Event Grid](../../event-grid/quotas-limits.md) has been met.

## Is it possible to receive duplicate events messages?

Yes. The Event Grid guarantees at least one events message delivery with its push mode. There may be chances that the event delivery request returns with a transient failure status code for random reasons. In this situation, the Event Grid considers that as a delivery failure and resends the events message. For more information, see [Azure Event Grid delivery and retry](../../event-grid/delivery-and-retry.md).

Generally, we recommend that developers ensure idempotency for the event subscriber. The event ID or the combination of all fields in the `data` property of the message content are unique per each event. The developer can rely on them to deduplicate. 
   
## More frequently asked questions

[FAQs about the Azure Health Data Services](../healthcare-apis-faqs.md)

[FAQs about Azure Health Data Services DICOM service](../dicom/dicom-services-faqs.yml)

[FAQs about Azure Health Data Services FHIR service](../fhir/fhir-faq.md)

[FAQs about Azure Health Data Services MedTech service](../iot/iot-connector-faqs.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.

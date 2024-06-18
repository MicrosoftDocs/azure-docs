---
title: Events FAQ for Azure Health Data Services
description: Get answers to common questions about the events capability in the FHIR and DICOM services in Azure Health Data Services. Find out how events work, what types of events are supported, and how to subscribe to events by using Azure Event Grid.
services: healthcare-apis
author: chachachachami
ms.service: healthcare-apis
ms.subservice: events
ms.topic: reference
ms.date: 01/31/2024
ms.author: chrupa
---

# Events FAQ

Events let you subscribe to data changes in the FHIR&reg; or DICOM&reg; service and get notified through Azure Event Grid. You can use events to trigger workflows, automate tasks, send alerts, and more. In this FAQ, you’ll find answers to some common questions about events.

**Can I use events with a non-Microsoft FHIR or DICOM service?**

No. The Events capability only supports the Azure Health Data Services FHIR and DICOM services.

**What FHIR resource changes are supported by events?**

Events are generated from these FHIR service types:

- **FhirResourceCreated**. The event emitted after a FHIR resource is created.

- **FhirResourceUpdated**. The event emitted after a FHIR resource is updated.

- **FhirResourceDeleted**. The event emitted after a FHIR resource is soft deleted.

For more information about delete types in the FHIR service, see [REST API capabilities in the FHIR service in Azure Health Data Services](../fhir/rest-api-capabilities.md).

**Does events support FHIR bundles?**

Yes. The events capability emits notifications of data changes at the FHIR resource level. 

Events support these [FHIR bundle types](http://hl7.org/fhir/R4/valueset-bundle-type.html):

- **Batch**. An event is emitted for each successful data change operation in a bundle. If one of the operations generates an error, no event is emitted for that operation. For example: the batch bundle contains five operations, however, there's an error with one of the operations. Events are emitted for the four successful operations with no event emitted for the operation that generated an error.

- **Transaction**. An event is emitted for each successful bundle operation as long as there are no errors. If there are any errors within a transaction bundle, then no events are emitted. For example: the transaction bundle contains five operations, however, there's an error with one of the operations. No events are emitted for that bundle.

> [!NOTE]
> Events aren't sent in the sequence of the data operations in the FHIR bundle.

**What DICOM image changes does events support?**

Events are generated from the following DICOM service types:

- **DicomImageCreated**. The event emitted after a DICOM image is created.

- **DicomImageDeleted**. The event emitted after a DICOM image is deleted.

- **DicomImageUpdated**. The event emitted after a DICOM image is updated. For more information, see [Update DICOM files](../dicom/update-files.md).

**What is the payload of an events message?**

For a description of the events message structure and required and nonrequired elements, see [Events message structures](events-message-structure.md). 

**What is the throughput for events messages?**

The throughput of the FHIR or DICOM service and the Event Grid governs the throughput of FHIR and DICOM events. When a request made to the FHIR service is successful, it returns a 2xx HTTP status code. It also generates a FHIR resource or DICOM image changing event. The current limitation is 5,000 events/second per workspace for all FHIR or DICOM service instances in the workspace. 

**How am I charged for using events?**

There are no extra charges for using [Azure Health Data Services events](https://azure.microsoft.com/pricing/details/health-data-services/). However, applicable charges for the [Event Grid](https://azure.microsoft.com/pricing/details/event-grid/) are assessed against your Azure subscription.

**How do I subscribe separately to multiple FHIR or DICOM services in the same workspace?**

Use the Event Grid filtering feature. There are unique identifiers in the event message payload to differentiate accounts and workspaces. You can find a global unique identifier for workspace in the `source` field, which is the Azure Resource ID. You can locate the unique FHIR account name in that workspace in the `data.resourceFhirAccount` field. You can locate the unique DICOM account name in the workspace in the `data.serviceHostName` field. When you create a subscription, use the filtering operators to select the events you want to include in the subscription.

:::image type="content" source="media\event-grid\event-grid-filters.png" alt-text="Screenshot of the Event Grid filters tab." lightbox="media\event-grid\event-grid-filters.png":::

**Can I use the same subscriber for multiple workspaces, FHIR accounts, or DICOM accounts?**

Yes. We recommend that you use different subscribers for each FHIR or DICOM service to enable processing in isolated scopes.

**Is the Event Grid compatible with HIPAA and HITRUST compliance requirements?**

Yes. Event Grid supports Health Insurance Portability and Accountability Act (HIPAA) and Health Information Trust Alliance (HITRUST) obligations. For more information, see [Microsoft Azure Compliance Offerings](https://azure.microsoft.com/resources/microsoft-azure-compliance-offerings/).

**How long does it take to receive an events message?**

On average, you should receive your event message within one second after a successful HTTP request. 99.99% of the event messages should be delivered within five seconds unless the limitation of either the FHIR service, DICOM service, or [Event Grid](../../event-grid/quotas-limits.md) is reached.

**Is it possible to receive duplicate events messages?**

Yes. The Event Grid guarantees at least one events message delivery with its push mode. There may be cases when the event delivery request returns with a transient failure status code for random reasons. In this situation, the Event Grid considers it a delivery failure and resends the events message. For more information, see [Azure Event Grid delivery and retry](../../event-grid/delivery-and-retry.md).

Generally, we recommend that developers ensure idempotency for the event subscriber. The event ID or the combination of all fields in the `data` property of the message content are unique for each event. You can rely on them to deduplicate. 
   
[!INCLUDE [FHIR and DICOM trademark statement](../includes/healthcare-apis-fhir-dicom-trademark.md)]
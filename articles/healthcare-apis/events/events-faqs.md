---
title: FAQs about Events in Azure Healthcare APIs
description: This document provides answers to the frequently asked questions about Events.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 02/09/2022
ms.author: jasteppe
---

# Frequently asked questions (FAQs) about Events

The following are some of the frequently asked questions about Events.

### Can I use Events with a different Fast Hospital Interoperability Resources (FHIR®) service other than the Azure Healthcare APIs FHIR service?

No. The Azure Healthcare APIs Events feature only currently supports the Azure Healthcare APIs FHIR service.

### What FHIR resource events does Events support?

Events are generated from the following FHIR service types:

- **FhirResourceCreated** - The event emitted after a FHIR resource gets created successfully.

- **FhirResourceCreated** - The event emitted after a FHIR resource gets created successfully.

- **FhirResourceDeleted** - The event emitted after a FHIR resource gets soft deleted successfully.

For more information about the FHIR service delete types, see [FHIR Rest API capabilities for Azure Healthcare APIs FHIR service](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md)

### What is the payload of an Events message? 

For a detailed description of the Events message structure and both required and non-required elements, see  [Events troubleshooting guide](events-troubleshooting-guide.md). 

### What is the throughput for the Events messages?

Events throughput is governed by the throughput of the FHIR service. When a request made to the FHIR service is successful, it will display a return code (for example, 2XX). It will also generate a FHIR Resources event such as create, update, and delete. The event is estimated to be delivered within a 5-second period after receiving the successful response from the FHIR service. 

### How am I charged for using Events?

There are no extra charges for using Azure Healthcare APIs Events. However, applicable charges for the [Event Grid](https://azure.microsoft.com/pricing/details/event-grid/) might be assessed against your Azure subscription.


### How do I subscribe to multiple FHIR services in the same workspace separately?

You can use the Event Grid filtering feature. There are unique identifiers in the event message payload to differentiate different accounts and workspaces. You can find a global unique identifier for workspace in the `source` field, which is the Azure Resource ID. You can locate the unique FHIR account name in that workspace in the `data.resourceFhirAccount` field. When you create a subscription, you can use the filtering operators to select the events you want to get in that subscription.

  :::image type="content" source="media\event-grid\event-grid-filters.png" alt-text="Screenshot of the Event Grid filters tab." lightbox="media\event-grid\event-grid-filters.png":::     

## More frequently asked questions
[FAQs about the Azure Healthcare APIs](../healthcare-apis-faqs.md)

[FAQs about Azure Healthcare APIs FHIR service](../fhir/fhir-faq.md)

[FAQs about Azure Healthcare APIs DICOM service](../dicom/dicom-services-faqs.yml)

[FAQs about Azure Healthcare APIs IoT connector](../iot/iot-connector-faqs.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.

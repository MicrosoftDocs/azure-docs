---
title: Frequently asked questions (FAQs) about the MedTech service - Azure Health Data Services
description: This article provides answers to the frequently asked questions (FAQs) about the MedTech service.
services: healthcare-apis
author: msjasteppe
ms.custom: references_regions
ms.service: healthcare-apis
ms.topic: reference
ms.date: 02/21/2023
ms.author: jasteppe
---

# Frequently asked questions about the MedTech service

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides answers to frequently asked questions (FAQs) about the MedTech service.

## Where is the MedTech service available?

The MedTech service is available in these Azure regions: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=health-data-services).

## Can I use the MedTech service with a different FHIR service other than the Azure Health Data Services FHIR service?

No. The MedTech service currently only supports the Azure Health Data Services FHIR service for the persistence of transformed device message data. The open-source version of the MedTech service supports the use of different FHIR services. 

To learn more about the MedTech service open-source projects, see [Open-source projects](git-projects.md). 

## What versions of FHIR does the MedTech service support?

The MedTech service currently only supports the persistence of [HL7 FHIR&#174; R4](https://www.hl7.org/implement/standards/product_brief.cfm?product_id=491).

## Why do I have to provide device and FHIR destination mappings to the MedTech service?

The MedTech service requires the device and FHIR destination mappings to perform normalization and transformation processes on the device message data. To learn how the MedTech service transforms device message data into FHIR Observations resources, see [Understand the MedTech service device message data transformation](understand-service.md). 

## How long does it take for device message data to show up on the FHIR service?

The MedTech service buffers the FHIR Observations resources created during the transformation stage and provides near real-time processing. However, it can potentially take up to five minutes for FHIR Observation resources to be persisted in the FHIR service. To learn how the MedTech service transforms device message data into FHIR Observations resources, see [Understand the MedTech service device message data transformation](understand-service.md).  

## Why is the MedTech service device message data not showing up in the FHIR service?

|Potential issues|Fixes|
|----------------|-----|
|Data is still being processed.|Data is egressed to the FHIR service in batches (every ~5 minutes). It’s possible the data is still being processed and extra time is needed for the data to be persisted in the FHIR service.|
|Device mappings haven't been configured.|Configure and save conforming and valid device mappings.|
|FHIR destination mappings haven't been configured.|Configure and save conforming and valid FHIR destination mappings.|
|The device message doesn't contain an expected expression defined in the device mappings.|Verify `JsonPath` expressions defined in the device mappings match tokens defined in the device message.|
|A `Device` Resource hasn't been created in the FHIR service (Resolution Type: Look up only)*.|Create a valid `Device` Resource in the FHIR service. Ensure the `Device` Resource contains an identifier that matches the device identifier provided in the incoming message.|
|A Patient Resource hasn't been created in the FHIR service (**Resolution type**: `Lookup` only)*.|Create a valid `Patient` Resource in the FHIR service.|
|The `Device.patient` reference isn't set, or the reference is invalid (Resolution Type: Look up only)*.|Make sure the Device Resource contains a valid [Reference](https://www.hl7.org/fhir/device-definitions.html#Device.patient) to a `Patient` Resource.| 

\* Reference [Configure the MedTech service for manual deployment using the Azure portal](deploy-new-config.md#destination-properties) for a functional description of the MedTech service resolution types (for example, `Create` or `Lookup`).

## Does the MedTech service perform backups of device messages?

No. The MedTech service doesn't back up the device messages that come into the customer's event hub. The customer controls the device message retention period within their event hub, which can be from 1-7 days. If the device message data is successfully processed by the MedTech service, it's persisted in the FHIR service, and the FHIR service backup policy applies. 

To learn more about event hub message retention, see [What is the maximum retention period for events?](/azure/event-hubs/event-hubs-faq#what-is-the-maximum-retention-period-for-events-) 

## What are the subscription quota limits for the MedTech service?

* 25 MedTech services per Subscription (not adjustable)
* 10 MedTech services per workspace (not adjustable)
* One FHIR destination* per MedTech service (not adjustable)

(* - FHIR Destination is a child resource of the MedTech service)

## Can I use the MedTech service with device messages from Apple&#174;, Google&#174;, or Fitbit&#174; devices?

Yes. The MedTech service supports device messages from all these vendors through the open-source version of the MedTech service. 

To learn more about the MedTech service open-source projects, see [Open-source projects](git-projects.md). 

## Next steps

In this article, you learned about the MedTech service frequently asked questions (FAQs)

To learn about the MedTech service, see

> [!div class="nextstepaction"]
> [What is the MedTech service?](overview.md)

To learn about the MedTech service device message data transformation, see

> [!div class="nextstepaction"]
> [Understand the MedTech service device message data transformation](overview.md)

To learn about methods for deploying the MedTech service, see

> [!div class="nextstepaction"]
> [Choose a deployment method for the MedTech service](deploy-new-choose.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.

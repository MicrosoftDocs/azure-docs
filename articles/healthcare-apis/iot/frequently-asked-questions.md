---
title: Frequently asked questions about the MedTech service - Azure Health Data Services
description: This article provides answers to the frequently asked questions about the MedTech service.
services: healthcare-apis
author: msjasteppe
ms.custom: references_regions
ms.service: healthcare-apis
ms.topic: reference
ms.date: 03/28/2023
ms.author: jasteppe
---

# Frequently asked questions about the MedTech service

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

## MedTech service: The basics

### Where is the MedTech service available?

The MedTech service is available in these Azure regions: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=health-data-services).

### Can I use the MedTech service with a different FHIR service other than the Azure Health Data Services FHIR service?

No. The MedTech service currently only supports the Azure Health Data Services FHIR service for the persistence of transformed device message data. The open-source version of the MedTech service supports the use of different FHIR services. 

To learn more about the MedTech service open-source projects, see [Open-source projects](git-projects.md). 

### What versions of FHIR does the MedTech service support?

The MedTech service supports the [HL7 FHIR&#174; R4](https://www.hl7.org/implement/standards/product_brief.cfm?product_id=491) standard.

### Why do I have to provide device and FHIR destination mappings to the MedTech service?

The MedTech service requires device and FHIR destination mappings to perform normalization and transformation processes on device message data. To learn how the MedTech service transforms device message data into [FHIR Observations](https://www.hl7.org/fhir/observation.html), see [Understand the MedTech service device message processing stages](understand-service.md). 

### How long does it take for device message data to show up in the FHIR service?

The MedTech service buffers [FHIR Observations](https://www.hl7.org/fhir/observation.html) created during the transformation stage and provides near real-time processing. However, this buffer can potentially delay the persistence of FHIR Observations to the FHIR service up to ~five minutes. To learn how the MedTech service transforms device message data into FHIR Observations, see [Understand the MedTech service device message processing stages](understand-service.md).

### Why are the device messages added to the event hub not showing up as FHIR Observations in the FHIR service?

> [!TIP]
> Having access to MedTech service logs is essential for troubleshooting and assessing the overall health and performance of your MedTech service.
>
> To learn how to troubleshoot MedTech service errors found in the logs, see [Troubleshoot errors using the MedTech service logs](troubleshoot-errors-logs.md).

|Potential issue|Fix|
|---------------|---|
|Data is still being processed.|Data is egressed to the FHIR service in batches (every ~five minutes). It’s possible the data is still being processed and extra time is needed for the data to be persisted in the FHIR service.|
|Device mapping hasn't been configured.|Configure and save a conforming and valid [device mapping](how-to-configure-device-mappings.md).|
|FHIR destination mapping hasn't been configured.|Configure and save a conforming and valid [FHIR destination mapping](how-to-configure-fhir-mappings.md).|
|The device message doesn't contain an expected expression defined in the device mapping.|Verify the [JsonPath](https://goessner.net/articles/JsonPath/) or [JMESPath](https://jmespath.org/specification.html) expressions defined in the [device mapping](how-to-configure-device-mappings.md) match tokens defined in the device message.|
|A Device resource hasn't been created in the FHIR service (**Resolution type**: **Lookup** only)*.|Create a valid [Device resource](https://www.hl7.org/fhir/device.html) in the FHIR service. Ensure the Device resource contains an identifier that matches the device identifier provided in the incoming message.|
|A Patient resource hasn't been created in the FHIR service (**Resolution type**: **Lookup** only)*.|Create a valid [Patient resource](https://www.hl7.org/fhir/patient.html) in the FHIR service.|
|The Device.patient reference isn't set, or the reference is invalid (**Resolution type**: **Lookup** only)*.|Make sure the Device resource contains a valid [reference](https://www.hl7.org/fhir/device-definitions.html#Device.patient) to a Patient resource.| 

\* Reference [Configure the MedTech service for manual deployment using the Azure portal](deploy-new-config.md#destination-properties) for a functional description of the MedTech service resolution types (**Create** or **Lookup**).

### Does the MedTech service perform backups of device messages?

No. The MedTech service doesn't back up the device messages that is sent to the event hub. The event hub owner controls the device message retention period within their event hub, which can be from one to 90 days. Event hubs can be deployed in [three different service tiers](../../event-hubs/event-hubs-quotas.md?source=recommendations#basic-vs-standard-vs-premium-vs-dedicated-tiers). Message retention limits are tier-dependent: Basic one day, Standard 1-7 days, Premium 90 days. If the MedTech service successfully processes the device message data, it's persisted in the FHIR service, and the FHIR service backup policy applies. 

To learn more about event hub message retention, see [What is the maximum retention period for events?](/azure/event-hubs/event-hubs-faq#what-is-the-maximum-retention-period-for-events-) 

### What are the subscription quota limits for the MedTech service?

* (25) MedTech services per Azure subscription (not adjustable).
* (10) MedTech services per Azure Health Data Services workspace (not adjustable).
* (One) FHIR destination* per MedTech service (not adjustable).

\* FHIR destination is a child resource of the MedTech service.

### Can I use the MedTech service with device messages from Apple&#174;, Google&#174;, or Fitbit&#174; devices?

Yes. The MedTech service supports device messages from all these vendors through the open-source version of the MedTech service. 

To learn more about the MedTech service open-source projects, see [Open-source projects](git-projects.md). 

## Next steps

In this article, you learned about the MedTech service frequently asked questions (FAQs)

For an overview of the MedTech service, see

> [!div class="nextstepaction"]
> [What is the MedTech service?](overview.md)

To learn about the MedTech service device message data transformation, see

> [!div class="nextstepaction"]
> [Understand the MedTech service device message data transformation](overview.md)

To learn about methods for deploying the MedTech service, see

> [!div class="nextstepaction"]
> [Choose a deployment method for the MedTech service](deploy-new-choose.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
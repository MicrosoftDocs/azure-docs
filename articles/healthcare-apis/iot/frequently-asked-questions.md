---
title: MedTech service FAQ for Azure Health Data Services
description: Get answers to common questions about the MedTech service in Azure Health Data Services. Find out about FHIR integration, device data processing, and troubleshooting tips.
services: healthcare-apis
author: chachachachami
ms.service: azure-health-data-services
ms.subservice: medtech-service
ms.topic: faq
ms.date: 06/05/2024
ms.author: chrupa
---
# MedTech service FAQ

> [!IMPORTANT]
> As of 2/26/2025 the MedTech service will no longer be available in the following regions: UK West, UAE North, South Africa North, Qatar Central.

## Where is the MedTech service available?

The MedTech service is available in these Azure regions: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=health-data-services).

## Can I use the MedTech service with a different FHIR service other than the Azure Health Data Services FHIR service?

No. The MedTech service currently only supports the Azure Health Data Services FHIR&reg; service for the persistence of transformed device data. The open-source version of the MedTech service supports the use of different FHIR services. 

To learn about the MedTech service open-source projects, see [Open-source projects](git-projects.md). 

## What versions of FHIR does the MedTech service support?

The MedTech service supports the [HL7 FHIR R4](https://www.hl7.org/implement/standards/product_brief.cfm?product_id=491) standard.

## Why do I have to provide device and FHIR destination mappings to the MedTech service?

The MedTech service requires device and FHIR destination mappings to perform normalization and transformation processes on device data. To learn how the MedTech service transforms device data into [FHIR Observations](https://www.hl7.org/fhir/observation.html), see [Overview of the MedTech service device data processing stages](overview-of-device-data-processing-stages.md). 

## Is JsonPathContent still supported by the MedTech service device mapping?

Yes. JsonPathContent can be used as a template type within [CollectionContent](overview-of-device-mapping.md#collectioncontent). We recommend that [CalculatedContent](how-to-use-calculatedcontent-templates.md) is used as it supports all of the features of JsonPathContent with extra support for more advanced features.

## How long does it take for device data to show up in the FHIR service?

The MedTech service buffers [FHIR Observations](https://www.hl7.org/fhir/observation.html) created during the transformation stage and provides near real-time processing. However, this buffer can potentially delay the persistence of FHIR Observations to the FHIR service up to ~five minutes. To learn how the MedTech service transforms device data into FHIR Observations, see [Overview of the MedTech service device data processing stages](overview-of-device-data-processing-stages.md).

## Why are the device messages added to the event hub not showing up as FHIR Observations in the FHIR service?

> [!TIP]
> Having access to MedTech service logs is essential for troubleshooting and assessing the overall health and performance of your MedTech service.
>
> To learn how to troubleshoot MedTech service errors found in the logs, see [Troubleshoot errors using the MedTech service logs](troubleshoot-errors-logs.md).

|Potential issue|Fix|
|---------------|---|
|Data is still being processed.|Data is egressed to the FHIR service in batches (every ~five minutes). It’s possible the data is still being processed and extra time is needed for the data to be persisted in the FHIR service.|
|Device mapping isn't configured.|Configure and save a conforming and valid [device mapping](overview-of-device-mapping.md).|
|FHIR destination mapping isn't configured.|Configure and save a conforming and valid [FHIR destination mapping](overview-of-fhir-destination-mapping.md).|
|The device message doesn't contain an expected expression defined in the device mapping.|Verify the [JsonPath](https://goessner.net/articles/JsonPath/) or [JMESPath](https://jmespath.org/specification.html) expressions defined in the [device mapping](overview-of-device-mapping.md) match tokens defined in the device message.|
|A Device resource wasn't created in the FHIR service (**Resolution type**: **Lookup** only)*.|Create a valid [Device resource](https://www.hl7.org/fhir/device.html) in the FHIR service. Ensure the Device resource contains an identifier that matches the device identifier provided in the incoming message.|
|A Patient resource wasn't created in the FHIR service (**Resolution type**: **Lookup** only)*.|Create a valid [Patient resource](https://www.hl7.org/fhir/patient.html) in the FHIR service.|
|The Device.patient reference isn't set, or the reference is invalid (**Resolution type**: **Lookup** only)*.|Make sure the Device resource contains a valid [reference](https://www.hl7.org/fhir/device-definitions.html#Device.patient) to a Patient resource.| 

\* Reference [Deploy the MedTech service using the Azure portal](deploy-manual-portal.md#configure-the-destination-tab) for a functional description of the MedTech service resolution types (**Create** or **Lookup**).

## Does the MedTech service perform backups of device messages?

No. The MedTech service doesn't back up the device messages sent to the event hub. The event hub owner controls the device message retention period within their event hub, which can be from one to 90 days. Event hubs can be deployed in [three different service tiers](../../event-hubs/event-hubs-quotas.md?source=recommendations#basic-vs-standard-vs-premium-vs-dedicated-tiers). Message retention limits are tier-dependent: Basic one day, Standard 1-7 days, Premium 90 days. If the MedTech service successfully processes the device data, it persists in the FHIR service, and the FHIR service backup policy applies. 

To learn more about event hub message retention, see [What is the maximum retention period for events?](/azure/event-hubs/event-hubs-faq#what-is-the-maximum-retention-period-for-events-) 

## What are the subscription quota limits for the MedTech service?

* (25) MedTech services per Azure subscription (not adjustable).
* (10) MedTech services per Azure Health Data Services workspace (not adjustable).
* (One) FHIR destination* per MedTech service (not adjustable).

\* FHIR destination is a child resource of the MedTech service.

## I'm receiving authentication errors with my MedTech service after moving my Azure subscription to a different Azure tenant. How do I fix this issue?

If the Azure subscription where your MedTech service is deployed is moved to a different Azure tenant, you might see failing MedTech service HealthChecks for `ExternalEventHub:IsAuthenticated` and `FhirService:IsAuthenticated`. For guidance on how to view these failed HealthChecks, see [How to enable diagnostic settings for the MedTech service](how-to-enable-diagnostic-settings.md). There are two methods for fixing this issue based on the type of managed identity you're using with your MedTech service:

1. System-assigned managed identity: If you're using a system-assigned managed identity with your MedTech service, a new identity is created for you through reprovisioning. 
2. User-assigned managed identity: If you're using a user-assigned managed identity with your MedTech service, you need to first recreate the identity in the new tenant and update your MedTech service with the new identity **before** reprovisioning. 

In either case, you also need to update the Azure RBAC settings on your [FHIR service and event hub](deploy-manual-portal.md#grant-resource-access-to-the-medtech-service-system-managed-identity) with the new managed identity. For more information on transferring subscriptions to different tenants, see [Transfer an Azure subscription to a different Microsoft Entra directory](../../role-based-access-control/transfer-subscription.md).

## Can I use the MedTech service with device messages from Apple&#174;, Google&#174;, or Fitbit&#174; devices?

Yes. The MedTech service supports device messages from all these vendors through the open-source version of the MedTech service. 

For more information, see [Open-source projects](git-projects.md). 

## Can I enable disaster recovery for the MedTech service?

The MedTech service isn't designed to fail over to another region. If the MedTech service becomes unavailable, it stops reading data from the Event Hubs. When the service becomes available again, it begins reading data from the Event Hubs starting from the last successfully processed message. To reduce the chance of data loss, we recommend that you set the [Event Hubs message retention period](../../event-hubs/event-hubs-features.md) to at least 24 hours.

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]

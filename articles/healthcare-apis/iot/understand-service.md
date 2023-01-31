---
title: Understand the MedTech service device message data transformation - Azure Health Data Services
description: This article will provide you with an understanding of the MedTech service device messaging data transformation to FHIR Observation resources. The MedTech service ingests, normalizes, groups, transforms, and persists device message data into the FHIR service.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: overview
ms.date: 1/25/2023
ms.author: jasteppe
---

# Understand the MedTech service device message data transformation

This article provides an overview of the device message data processing stages within the [MedTech service](overview.md). The MedTech service transforms device message data into Fast Healthcare Interoperability Resources (FHIR&#174;) [Observation](https://www.hl7.org/fhir/observation.html) resources for persistence on the [FHIR service](../fhir/overview.md).

The MedTech service device message data processing follows these steps and in this order:

> [!div class="checklist"]
> - Ingest
> - Normalize - Device mappings applied.
> - Group
> - Transform - FHIR destination mappings applied.
> - Persist

:::image type="content" source="media/understand-service/iot-data-flow.png" alt-text="Screenshot of a device message as it processed by the MedTech service." lightbox="media/understand-service/iot-data-flow.png":::

## Ingest
Ingest is the first stage where device messages are received from an [Azure Event Hubs](../../event-hubs/index.yml) event hub (`device message event hub`) and immediately pulled into the MedTech service. The Event Hubs service supports high scale and throughput with the ability to receive and process millions of device messages per second. It also enables the MedTech service to consume messages asynchronously, removing the need for devices to wait while device messages are processed. 

The device message event hub uses the MedTech service's [system-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types) and [Azure resource-based access control (Azure RBAC)](/azure/role-based-access-control/overview) for secure access to the device message event hub.

> [!NOTE]
> JSON is the only supported format at this time for device message data.

> [!IMPORTANT]
> If you're going to allow access from multiple services to the device message event hub, it's required that each service has its own event hub consumer group.
>
> Consumer groups enable multiple consuming applications to have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups).
>
> Examples:
>
> - Two MedTech services accessing the same device message event hub.
>
> - A MedTech service and a storage writer application accessing the same device message event hub.

## Normalize
Normalize is the next stage where device message data is processed using user-selected/user-created conforming and valid [device mappings](how-to-configure-device-mappings.md). This mapping process results in transforming device message data into a normalized schema. 

The normalization process not only simplifies data processing at later stages, but also provides the capability to project one device message into multiple normalized messages. For instance, a device could send multiple vital signs for body temperature, pulse rate, blood pressure, and respiration rate in a single device message. This device message would create four separate FHIR Observation resources. Each resource would represent a different vital sign, with the device message projected into four different normalized messages.

## Group
Group is the next *optional* stage where the normalized messages available from the MedTech service normalization stage are grouped using three different parameters:

> [!div class="checklist"]
> - Device identity
> - Measurement type
> - Time period

`Device identity` and `measurement type` grouping is optional and enabled by the use of the [SampledData](https://www.hl7.org/fhir/datatypes.html#SampledData) measurement type. The SampledData measurement type provides a concise way to represent a time-based series of measurements from a device message into FHIR Observation resources. When you use the SampledData measurement type, measurements can be grouped into a single FHIR Observation resource that represents a 1-hour period or a 24-hour period.

## Transform
Transform is the next stage where normalized messages are processed using user-selected/user-created conforming and valid [FHIR destination mappings](how-to-configure-fhir-mappings.md). Normalized messages get transformed into FHIR Observation resources if a matching FHIR destination mapping has been authored.

At this point, the [Device](https://www.hl7.org/fhir/device.html) resource, along with its associated [Patient](https://www.hl7.org/fhir/patient.html) resource, is also retrieved from the FHIR service using the device identifier present in the device message. These resources are added as a reference to the FHIR Observation resource being created.

> [!NOTE]
> All identity look ups are cached once resolved to decrease load on the FHIR service. If you plan on reusing devices with multiple patients, it is advised you create a virtual device resource that is specific to the patient and send the virtual device identifier in the device message payload. The virtual device can be linked to the actual device resource as a parent.

If no Device resource for a given device identifier exists in the FHIR service, the outcome depends upon the value of [Resolution Type](deploy-new-config.md#configure-the-destination-tab) set at the time of the MedTech service deployment. When set to `Lookup`, the specific message is ignored, and the pipeline will continue to process other incoming device messages. If set to `Create`, the MedTech service will create minimal Device and Patient resources on the FHIR service.  

> [!NOTE]
> The `Resolution Type` can also be adjusted post deployment of the MedTech service in the event that a different type is later desired.

The MedTech service buffers the FHIR Observations resources created during the transformation stage and provides near real-time processing. However, it can potentially take up to five minutes for FHIR Observation resources to be persisted in the FHIR service.

## Persist
Persist is the final stage where the FHIR Observation resources from the transform stage are persisted in the [FHIR service](../fhir/overview.md). If the FHIR Observation resource is new, it will be created in the FHIR service. If the FHIR Observation resource already existed, it will get updated in the FHIR service.

The FHIR service uses the MedTech service's [system-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types) and [Azure resource-based access control (Azure RBAC)](/azure/role-based-access-control/overview) for secure access to the FHIR service.

## Next steps

In this article, you learned about the MedTech service device message processing and persistence in the FHIR service.

To learn how to configure the MedTech service device and FHIR destination mappings, see

> [!div class="nextstepaction"]
> [How to configure device mappings](how-to-configure-device-mappings.md)

> [!div class="nextstepaction"]
> [How to configure FHIR destination mappings](how-to-configure-fhir-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.

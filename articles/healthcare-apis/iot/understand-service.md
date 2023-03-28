---
title: Understand the MedTech service device message processing stages - Azure Health Data Services
description: This article provides an overview of the MedTech service device message processing stages. The MedTech service ingests, normalizes, groups, transforms, and persists device message data in the FHIR service.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: overview
ms.date: 03/28/2023
ms.author: jasteppe
---

# Understand the MedTech service device message processing stages 

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

This article provides an overview of the device message processing stages within the [MedTech service](overview.md). The MedTech service transforms device message data into [FHIR Observations](https://www.hl7.org/fhir/observation.html) for persistence in the [FHIR service](../fhir/overview.md).

The MedTech service device message data processing follows these stages and in this order:

* Ingest
* Normalize - Device mapping applied.
* Group - (Optional)
* Transform - FHIR destination mapping applied.
* Persist

:::image type="content" source="media/understand-service/understand-device-message-flow.png" alt-text="Screenshot of a device message as it processed by the MedTech service." lightbox="media/understand-service/understand-device-message-flow.png":::

## Ingest
Ingest is the first stage where device messages are received from an [Azure Event Hubs](../../event-hubs/index.yml) event hub and immediately pulled into the MedTech service. The Event Hubs service supports high scale and throughput with the ability to receive and process millions of device messages per second. It also enables the MedTech service to consume messages asynchronously, removing the need for devices to wait while device messages are processed. 

The MedTech service's [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) and [Azure resource-based access control (Azure RBAC)](../../role-based-access-control/overview.md) are used for secure access to the event hub.

> [!NOTE]
> JSON is the only supported format at this time for device message data.

> [!IMPORTANT]
> If you're going to allow access from multiple services to the event hub, it's required that each service has its own event hub consumer group.
>
> Consumer groups enable multiple consuming applications to have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets. For more information, see [Consumer groups](../../event-hubs/event-hubs-features.md#consumer-groups).
>
> Examples:
>
> - Two MedTech services accessing the same event hub.
>
> - A MedTech service and a storage writer application accessing the same event hub.

## Normalize
Normalize is the next stage where device message data is processed using the user-selected/user-created conforming and valid [device mapping](how-to-configure-device-mappings.md). This mapping process results in transforming device message data into a normalized schema. 

The normalization process not only simplifies data processing at later stages, but also provides the capability to project one device message into multiple normalized messages. For instance, a device could send multiple vital signs for body temperature, pulse rate, blood pressure, and respiration rate in a single device message. This device message would create four separate FHIR Observation resources. Each resource would represent a different vital sign, with the device message projected into four different normalized messages.

## Group - (Optional)
Group is the next *optional* stage where the normalized messages available from the MedTech service normalization stage are grouped using three different parameters:

* Device identity
* Measurement type
* Time period

Device identity and measurement type grouping are optional and enabled by the use of the [SampledData](https://www.hl7.org/fhir/datatypes.html#SampledData) measurement type. The SampledData measurement type provides a concise way to represent a time-based series of measurements from a device message into FHIR Observation resources. When you use the SampledData measurement type, measurements can be grouped into a single FHIR Observation resource that represents a 1-hour period or a 24-hour period.

## Transform
Transform is the next stage where normalized messages are processed using the user-selected/user-created conforming and valid [FHIR destination mapping](how-to-configure-fhir-mappings.md). Normalized messages get transformed into FHIR Observation resources if a matching FHIR destination mapping has been authored.

At this point, the [Device](https://www.hl7.org/fhir/device.html) resource, along with its associated [Patient](https://www.hl7.org/fhir/patient.html) resource, is also retrieved from the FHIR service using the device identifier present in the device message. These resources are added as a reference to the FHIR Observation being created.

> [!NOTE]
> All identity look ups are cached once resolved to decrease load on the FHIR service. If you plan on reusing devices with multiple patients, it is advised you create a virtual device resource that is specific to the patient and send the virtual device identifier in the device message payload. The virtual device can be linked to the actual device resource as a parent.

If no Device resource for a given device identifier exists in the FHIR service, the outcome depends upon the value of [**Resolution type**](deploy-new-config.md#configure-the-destination-tab) set at the time of the MedTech service deployment. When set to **Lookup**, the specific message is ignored, and the pipeline continues to process other incoming device messages. If set to **Create**, the MedTech service creates minimal Device and Patient resources in the FHIR service.  

> [!NOTE]
> The **Resolution type** can also be adjusted post deployment of the MedTech service if a different **Resolution type** is later required.

The MedTech service provides near real-time processing and also attempts to reduce the number of requests made to the FHIR service by grouping requests into batches of 300 [normalized messages](#normalize). If there's a low volume of data, and 300 normalized messages haven't been added to the group, then the corresponding FHIR Observations in that group are persisted to the FHIR service after ~five minutes. This means that when there's fewer than 300 normalized messages to be processed, there may be a delay of ~five minutes before FHIR Observations are created or updated in the FHIR service.

> [!NOTE]
> When multiple device messages contain data for the same FHIR Observation, have the same timestamp, and are sent within the same device message batch (for example, within the ~five minute window or in groups of 300 normalized messages), only the data corresponding to the latest device message for that FHIR Observation is persisted.
>
> For example:
>
> Device message 1:
> ```json
> {    
>    "patientid": "testpatient1",    
>    "deviceid": "testdevice1",
>    "systolic": "129",    
>    "diastolic": "65",    
>    "measurementdatetime": "2022-02-15T04:00:00.000Z"
> } 
> ```
>
> Device message 2:
> ```json
> {   
>    "patientid": "testpatient1",    
>    "deviceid": "testdevice1",    
>    "systolic": "113",    
>    "diastolic": "58",    
>    "measurementdatetime": "2022-02-15T04:00:00.000Z"
> }
> ```
>
> Assuming these device messages were ingested within the same ~five minute window or in the same group of 300 normalized messages, and since the `measurementdatetime` is the same for both device messages (indicating these contain data for the same FHIR Observation), only device message 2 is persisted to represent the latest/most recent data.

## Persist
Persist is the final stage where the FHIR Observation resources from the transform stage are persisted in the [FHIR service](../fhir/overview.md). If the FHIR Observation is new, it's created in the FHIR service. If the FHIR Observation already existed, it gets updated in the FHIR service.

The FHIR service uses the MedTech service's [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) and [Azure resource-based access control (Azure RBAC)](../../role-based-access-control/overview.md) for secure access to the FHIR service.

## Next steps

In this article, you learned about the MedTech service device message processing and persistence in the FHIR service.

To learn how to configure the MedTech service device and FHIR destination mappings, see

> [!div class="nextstepaction"]
> [How to configure the device mapping](how-to-configure-device-mappings.md)

> [!div class="nextstepaction"]
> [How to configure the FHIR destination mapping](how-to-configure-fhir-mappings.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.

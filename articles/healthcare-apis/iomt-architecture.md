---
title: IoMT connector (preview) architecture
description: Understand IoMT connector's architecture and data flow process. IoMT connector ingests, normalizes, groups, transforms, and persists IoMT data to Azure API for FHIR.
services: healthcare-apis
author: ms-puneet-nagpal
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: conceptual
ms.date: 05/13/2020
ms.author: punagpal
---

This article provides an overview of IoMT connector architecture. You'll learn about IoMT connector's internal components and data processing stages to transform device data into FHIR-based Observation resources.

> [!div class="mx-imgBorder"]
> ![IoMT connector architecture](media/concepts-iomt-architecture/iomt-connector-architecture.png)

IoMT connector architecture diagram above shows all the data-flow stages and associated components. 

## Ingest ##
Ingest is the first stage where device data is received into IoMT connector. The ingestion endpoint for device data is hosted on an [Azure Event Hub](https://docs.microsoft.com/azure/event-hubs/). Azure Event Hub platform can work at high scale and throughput having ability to receive and process millions of messages per second. It also enables IoMT connector to consume messages asynchronously, thus removing need for devices to wait for the response while device data gets processed.

## Normalize ##
Normalize is the next stage where device data is retrieved from Azure Event Hub and processed through device mapping templates. This mapping process results in transforming device data into a normalized schema. 

The normalization process not only allows simple data processing in later stages but also provides ability to project a single input message into multiple normalized messages. For instance a device may send multiple vital signs like body temperature, pulse rate, blood pressure, and respiration rate in a single message. Projecting this message into four separate normalized messages enables creation of four different FHIR Observation resources, each capturing a different vital sign.

Normalization logic is defined and executed through an instance of [Azure Functions](https://docs.microsoft.com/azure/azure-functions/). The normalized messages are then written to a second Azure Event Hub.

## Group ##
Group is the next stage where the normalized messages are grouped by three different parameters: device identity, measurement type, and time period.

Device identity and measurement type grouping enables a concise way to represent series of measurements from a device in FHIR when [SampledData](https://www.hl7.org/fhir/datatypes.html#SampledData) measurement type is used. And time period controls the latency at which FHIR-based Observation resources are written to Azure API for FHIR.

Grouping of normalized messages is executed using an [Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/) job. It provides capability to analyze and process high volumes of fast streaming data at a real-time.

## Transform ##
In Transform stage grouped normalized messages are processed through FHIR mapping templates. Matched messages get transformed into FHIR-based Observation resources as defined in the mapping.

At this point Device resource, along with its associated Patient resource, is retrieved from Azure API for FHIR using device identifier in the message. These resources get added as a reference to the Observation resource.

Note all identity look ups are cached once resolved to decrease load on the FHIR server. If you plan on reusing devices with multiple patients it is advised you create a virtual device resource that is specific to the patient and send virtual device identifier in the message payload. The virtual device can be linked to the actual device resource as a parent.

If Device resource associated with given device identifier is not present in the FHIR server, IoMT connector response depends upon the value of `Resolution Type` set at the time of installation. If set to `Lookup` the message processing will fail. If set to `Create` IoMT connector will create a bare-bones Device and Patient resources using their identifier values.  

## Persist ##
Once the Observation resource is available from the Transform stage, it is created or merged into Azure API for FHIR.

Both Transform and Persist stages are executed using an instance of [Azure Functions](https://docs.microsoft.com/azure/azure-functions/).


## Next Steps

Learn how to define device mapping and FHIR mapping templates.

>[!div class="nextstepaction"]
>[IoMT connector mapping templates](to-be-filled.md)


FHIR is the registered trademark of HL7 and is used with the permission of HL7.

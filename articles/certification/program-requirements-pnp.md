---
title: IoT Plug and Play Certification Requirements
description: IoT Plug and Play Certification Requirements
author: cbroad
ms.author: cbroad
ms.topic: conceptual 
ms.date: 03/15/2021
ms.custom: IoT Plug and Play Certification Requirements
ms.service: certification
---

# IoT Plug and Play Certification Requirements

This document outlines the device specific capabilities that will be represented in the Azure IoT Device catalog. A capability is singular device attribute that may be software implementation or combination of software and hardware implementations.

## Program Purpose

IoT Plug and Play enables solution builders to integrate smart devices with their solutions without any manual configuration. At the core of IoT Plug and Play, is a device model that advertises the device capabilities to an IoT Plug and Play-enabled application.

Promise of IoT Plug and Play certification are:

1.	Defined device models and interfaces are compliant with the [Digital Twin Definition Language](https://github.com/Azure/opendigitaltwins-dtdl)
1.	Easy integration with Azure IoT based solutions using the [Digital Twin APIs](../iot-develop/concepts-digital-twin.md)  : Azure IoT Hub and Azure IoT Central
1.	Product truth validated through testing telemetry from end point to cloud using DTDL 

> [!Note]
> Upon completed testing and validation, we may request that the product is evaluated by Microsoft.

## Requirements

**[Required] Device to cloud: The purpose of test is to make sure devices that send telemetry works with IoT Hub**

| **Name**                | IoTPnP.D2C                                               |
| ----------------------- | ------------------------------------------------------------ |
| **Target Availability** | Available now                                                |
| **Applies To**          | Leaf device/Edge device                                      |
| **OS**                  | Agnostic                                                     |
| **Validation Type**     | Automated                                                    |
| **Validation**          | Device must send any telemetry schemas to IoT Hub. Microsoft provides the [portal workflow](https://certify.azure.com) to execute the tests. Device to cloud (required): **1.** Validates that the device can send message to AICS managed IoT Hub **2.** User must specify the number and frequency of messages. **3.** AICS validates the telemetry is received by the Hub instance |
| **Resources**           | [Certification steps](./overview.md) (has all the additional resources) |

**[Required] DPS:  The purpose of test is to check the device implements and supports IoT Hub Device Provisioning Service with one of the three attestation methods**

| **Name**                | AzureCertified.DPS                                               |
| ----------------------- | ------------------------------------------------------------ |
| **Target Availability** | New                                                          |
| **Applies To**          | Any device                                                   |
| **OS**                  | Agnostic                                                     |
| **Validation Type**     | Automated                                                    |
| **Validation**          | Device supports easy input of target DPS ID scope ownership. Microsoft provides the [portal workflow](https://certify.azure.com) to execute the tests to validate that the device supports DPS **1.** User must select one of the attestation methods (X.509, TPM and SAS key) **2.** Depending on the attestation method, user needs to take corresponding action such as **a)** Upload X.509 cert to AICS managed DPS scope **b)** Implement SAS key or endorsement key into the device |
| **Resources**           | [Device provisioning service overview](../iot-dps/about-iot-dps.md) |

**[Required] DTDL v2:  The purpose of test to ensure defined device models and interfaces are compliant with the Digital Twins Definition Language v2.**                                                              

| **Name**                | IoTPnP.DTDL                                                  |
| ----------------------- | ------------------------------------------------------------ |
| **Target Availability** | Available now                                                |
| **Applies To**          | Any device                                                   |
| **OS**                  | Agnostic                                                     |
| **Validation Type**     | Automated                                                    |
| **Validation**          | The [portal workflow](https://certify.azure.com) validates: **1.** Model ID announcement and ensure the device is connected using either the MQTT or MQTT over WebSockets protocol **2.** Models are compliant with the DTDL v2 **3.** Telemetry, properties, and commands are properly implemented and interact between IoT Hub Digital Twin and Device Twin on the device |
| **Resources**           | [Public Preview Refresh updates](../iot-develop/overview-iot-plug-and-play.md) |

**[Required] Device models are published in public model repository**

| **Name**                | IoTPnP.ModelRepo                                             |
| ----------------------- | ------------------------------------------------------------ |
| **Target Availability** | Available now                                                |
| **Applies To**          | Any device                                                   |
| **OS**                  | Agnostic                                                     |
| **Validation Type**     | Automated                                                    |
| **Validation**          | All device models are required to be published in public repository. Device models are resolved via models available in public repository **1.** User must manually publish the models to the public repository before submitting for the certification. **2.** Note that once the models are published, it is immutable. We strongly recommend publishing only when the models and embedded device code are finalized.*1  *1 User must contact Microsoft support to revoke the models once published to the model repository **3.** [Portal workflow](https://certify.azure.com) checks the existence of the models in the public repository when the device is connected to the certification service |
| **Resources**           | [Model repository](../iot-develop/overview-iot-plug-and-play.md) |


**[If implemented] Device info Interface:  The purpose of test is to validate device info interface is implemented properly in the device code**

| **Name**                | IoTPnP.DeviceInfoInterface                                   |
| ----------------------- | ------------------------------------------------------------ |
| **Target Availability** | Available now                                                |
| **Applies To**          | Any device                                                   |
| **OS**                  | Agnostic                                                     |
| **Validation Type**     | Automated                                                    |
| **Validation**          | [Portal workflow](https://certify.azure.com) validates the device code implements device info interface **1.** Checks the values are emitted by the device code to IoT Hub **2.** Checks the interface is implemented in the DCM (this implementation will change in DTDL v2) **3.** Checks properties are not write-able (read only) **4.** Checks the schema type is string and/or long and not null |
| **Resources**           | [Microsoft defined interface](../iot-develop/overview-iot-plug-and-play.md) |
| **Azure Recommended**  | N/A                                                          |

**[If implemented] Cloud to device:  The purpose of test is to make sure messages can be sent from cloud to devices**

| **Name**                | IoTPnP.C2D                                               |
| ----------------------- | ------------------------------------------------------------ |
| **Target Availability** | Available now                                                |
| **Applies To**          | Leaf device/Edge device                                      |
| **OS**                  | Agnostic                                                     |
| **Validation Type**     | Automated                                                    |
| **Validation**          | Device must be able to Cloud to Device messages from IoT Hub. Microsoft provides the [portal workflow](https://certify.azure.com) to execute these tests. Cloud to device (if implemented): **1.** Validates that the device can receive message from IoT Hub **2.** AICS sends random message and validates via message ACK from the device |
| **Resources**           | **1.** [Certification steps](./overview.md) (has all the additional resources), **2.** [Send cloud to device messages from an IoT Hub](../iot-hub/iot-hub-devguide-messages-c2d.md) |

**[If implemented] Direct methods:  The purpose of test is to make sure devices works with IoT Hub and supports direct methods**

| **Name**                | IoTPnP.DirectMethods                                     |
| ----------------------- | ------------------------------------------------------------ |
| **Target Availability** | Available now                                                |
| **Applies To**          | Leaf device/Edge device                                      |
| **OS**                  | Agnostic                                                     |
| **Validation Type**     | Automated                                                    |
| **Validation**          | Device must be able to receive and reply commands requests from IoT Hub. Microsoft provides the [portal workflow](https://certify.azure.com) to execute the tests. Direct methods (if implemented): **1.** User has to specify the method payload of direct method. **2.** AICS validates the specified payload request is sent from Hub and ACK message received by the device |
| **Resources**           | **1.** [Certification steps](./overview.md) (has all the additional resources), **2.** [Understand direct methods from IoT Hub](../iot-hub/iot-hub-devguide-direct-methods.md) |

**[If implemented] Device twin property:  The purpose of test is to make sure devices that send telemetry works with IoT Hub and supports some of the IoT Hub capabilities such as direct methods, and device twin property**

| **Name**                | IoTPnP.DeviceTwin                                        |
| ----------------------- | ------------------------------------------------------------ |
| **Target Availability** | Available now                                                |
| **Applies To**          | Leaf device/Edge device                                      |
| **OS**                  | Agnostic                                                     |
| **Validation Type**     | Automated                                                    |
| **Validation**          | Device must send any telemetry schemas to IoT Hub. Microsoft provides the [portal workflow](https://certify.azure.com) to execute the tests. Device twin property (if implemented): **1.** AICS validates the read/write-able property in device twin JSON **2.** User has to specify the JSON payload to be changed **3.** AICS validates the specified desired properties sent from IoT Hub and ACK message received by the device |
| **Resources**           | **1.** [Certification steps](./overview.md) (has all the additional resources), **2.** [Use device twins with IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md) |
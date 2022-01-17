---
title: Azure Certified Device Certification Requirements
description: Azure Certified Device Certification Requirements
author: cbroad
ms.author: cbroad
ms.topic: conceptual 
ms.date: 03/15/2021
ms.custom: Azure Certified Device Certification Requirements
ms.service: certification
---

# Azure Certified Device Certification Requirements 
(previously known as IoT Hub)

This document outlines the device specific capabilities that will be represented in the Azure Certified Device catalog. A capability is singular device attribute that may be software implementation or combination of software and hardware implementations. 

## Program Purpose

Microsoft is simplifying IoT and Azure Certified Device certification is baseline certification program to ensure any device types are provisioned to Azure IoT Hub securely.

Promise of Azure Certified Device certification are:

1. Device support telemetry that works with IoT Hub
2.	Device support IoT Hub Device Provisioning Service (DPS) to securely provisioned to Azure IoT Hub
3.	Device supports easy input of target DPS ID scope transfer without requiring user to recompile embedded code.
4.	Optionally validates other elements such as cloud to device messages, direct methods and device twin 

## Requirements

**[Required] Device to cloud:  The purpose of test is to make sure devices that send telemetry works with IoT Hub**

| **Name**                | AzureCertified.D2C                                               |
| ----------------------- | ------------------------------------------------------------ |
| **Target Availability** | Available now                                                |
| **Applies To**          | Leaf device/Edge device                                      |
| **OS**                  | Agnostic                                                     |
| **Validation Type**     | Automated                                                    |
| **Validation**          | Device must send any telemetry schemas to IoT Hub. Microsoft provides the [portal workflow](https://certify.azure.com/) to execute the tests. Device to cloud (required): **1.** Validates that the device can send message to AICS managed IoT Hub **2.** User must specify the number and frequency of messages. **3.** AICS validates the telemetry is received by the Hub instance |
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

**[If implemented] Cloud to device:  The purpose of test is to make sure messages can be sent from cloud to devices**                                                              

| **Name**                | AzureCertified.C2D                                                  |
| ----------------------- | ------------------------------------------------------------ |
| **Target Availability** | Available now                                            |
| **Applies To**          | Leaf device/Edge device                                                   |
| **OS**                  | Agnostic                                                     |
| **Validation Type**     | Automated                                                    |
| **Validation**          | Device must be able to Cloud to Device messages from IoT Hub. Microsoft provides the [portal workflow](https://certify.azure.com) to execute these tests.Cloud to device (if implemented): **1.** Validates that the device can receive message from IoT Hub **2.** AICS sends random message and validates via message ACK from the device  |
| **Resources**           | **a)** [Certification steps](./overview.md) (has all the additional resources) **b)** [Send cloud to device messages from an IoT Hub](../iot-hub/iot-hub-devguide-messages-c2d.md) |

**[If implemented] Direct methods:  The purpose of test is to make sure devices works with IoT Hub and supports direct methods**

| **Name**                | AzureCertified.DirectMethods                                             |
| ----------------------- | ------------------------------------------------------------ |
| **Target Availability** | Available now                                            |
| **Applies To**          | Leaf device/Edge device                                                   |
| **OS**                  | Agnostic                                                     |
| **Validation Type**     | Automated                                                    |
| **Validation**          | Device must be able to receive and reply commands requests from IoT Hub. Microsoft provides the [portal workflow](https://certify.azure.com) to execute the tests. Direct methods (if implemented) **1.** User has to specify the method payload of direct method. **2.** AICS validates the specified payload request is sent from Hub and ACK message received by the device |
| **Resources**           | **a)** [Certification steps](./overview.md) (has all the additional resources) **b)** [Understand direct methods from IoT Hub](../iot-hub/iot-hub-devguide-direct-methods.md) |

**[If implemented] Device twin property:  The purpose of test is to make sure devices that send telemetry works with IoT Hub and supports some of the IoT Hub capabilities such as direct methods, and device twin property**

| **Name**                                  | AzureCertified.DeviceTwin                                      |
| ----------------------------------------- | ------------------------------------------------------------ |
| **Target Availability**                   | Available now                                            |
| **Applies To**                            | Leaf device/Edge device                                                   |
| **OS**                                    | Agnostic                                                     |
| **Validation Type**                       | Automated                                                       |
| **Validation**                            | Device must send any telemetry schemas to IoT Hub. Microsoft provides the [portal workflow](https://certify.azure.com) to execute the tests. Device twin property (if implemented) **1.** AICS validates the read/write-able property in device twin JSON **2.** User has to specify the JSON payload to be changed **3.** AICS validates the specified desired properties sent from IoT Hub and ACK message received by the device |
| **Resources**                             | **a)** [Certification steps](./overview.md) (has all the additional resources) **b)** [Use device twins with IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md) |

**[Required] Limit Recompile: The purpose of this policy ensures devices by default should not need users to re-compile code to deploy the device.**

| **Name**                                  | AzureCertified.Policy.LimitRecompile                                      |
| ----------------------------------------- | ------------------------------------------------------------ |
| **Target Availability**                   | Policy                                            |
| **Applies To**                            | Any device                                                   |
| **OS**                                    | Agnostic                                                     |
| **Validation Type**                       | Policy                                                       |
| **Validation**                            | To simplify device configuration for users, we require all devices can be configured to connect to Azure without the need to recompile and deploy device source code. This includes DPS information, such as Scope ID, which should be set as configuration settings and not compiled. However, if your device contains certain secure hardware or if there are extenuating circumstances in which the user will expect to compile and deploy code, contact the certification team to request an exception review. |
| **Resources**                             | **a)** [Device provisioning service overview](../iot-dps/about-iot-dps.md)  **b)** Sample config file for DPS ID Scope transfer |

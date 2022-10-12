---
title: Azure Percept security
description: Learn more about Azure Percept security
author: yvonne-dq
ms.author: ngt
ms.service: azure-percept
ms.topic: conceptual
ms.date: 10/06/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Azure Percept security

[!INCLUDE [Retirement note](./includes/retire.md)]

Azure Percept devices are designed with a hardware root of trust. This built-in security helps protect inference data and privacy-sensitive sensors like cameras and microphones and enables device authentication and authorization for Azure Percept Studio services.

> [!NOTE]
> The Azure Percept DK is licensed for use in development and test environments only.

## Devices

### Azure Percept DK

Azure Percept DK includes a Trusted Platform Module (TPM) version 2.0, which can be utilized to connect the device to Azure Device Provisioning Services (DPS) with additional security. TPM is an industry-wide, ISO standard from the Trusted Computing Group. Check out the [Trusted Computing Group website](https://trustedcomputinggroup.org/resource/tpm-library-specification/) for more information about the complete TPM 2.0 spec or the ISO/IEC 11889 spec. For more information on how DPS can provision devices in a secure manner, see [Azure IoT Hub Device Provisioning Service - TPM Attestation](../iot-dps/concepts-tpm-attestation.md).

### Azure Percept system-on-modules (SoMs)

The Azure Percept Vision system-on-module (SoM) and the Azure Percept Audio SoM both include a microcontroller unit (MCU) for protecting access to the embedded AI sensors. At every boot, the MCU firmware authenticates and authorizes the AI accelerator with Azure Percept Studio services using the Device Identifier Composition Engine (DICE) architecture. DICE works by breaking up boot into layers and creating Unique Device Secrets (UDS) for each layer and configuration. If different code or configuration is booted at any point in the chain, the secrets will be different. You can read more about DICE at the [DICE workgroup spec](https://trustedcomputinggroup.org/work-groups/dice-architectures/). For configuring access to Azure Percept Studio and required services see the article on [configuring firewalls for Azure Percept DK](concept-security-configuration.md).

Azure Percept devices use the hardware root of trust to secure firmware. The boot ROM ensures integrity of firmware between ROM and operating system (OS) loader, which in turn ensures integrity of the other software components, creating a chain of trust.

## Services

### IoT Edge

Azure Percept DK connects to Azure Percept Studio with additional security and other Azure services utilizing Transport Layer Security (TLS) protocol. Azure Percept DK is an Azure IoT Edge-enabled device. IoT Edge runtime is a collection of programs that turn a device into an IoT Edge device. Collectively, the IoT Edge runtime components enable IoT Edge devices to receive code to run at the edge and communicate the results. Azure Percept DK utilizes Docker containers for isolating IoT Edge workloads from the host operating system and edge-enabled applications. For more information about the Azure IoT Edge security framework, read about the [IoT Edge security manager](../iot-edge/iot-edge-security-manager.md).

### Device Update for IoT Hub

Device Update for IoT Hub enables more secure, scalable, and reliable over-the-air updating that brings renewable security to Azure Percept devices. It provides rich management controls and update compliance through insights. Azure Percept DK includes a pre-integrated device update solution providing resilient update (A/B) from firmware to OS layers.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about firewall configurations and security recommendations](concept-security-configuration.md)


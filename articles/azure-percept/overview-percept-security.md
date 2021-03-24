---
title: Azure Percept security overview
description: Learn more about Azure Percept security
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: conceptual
ms.date: 02/18/2021
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Azure Percept security overview

Azure Percept DK devices are designed with a hardware root of trust: additional built-in security on every device. It helps protect privacy-sensitive sensors like cameras and microphones, inference data, and enables device authentication and authorization for Azure Percept Studio services.

> [!NOTE]
> The Azure Percept DK is licensed for use in development and test environments only.

## Devices

### Azure Percept DK

Azure Percept DK includes a Trusted Platform Module (TPM) version 2.0 which can be utilized to connect the device to Azure Device Provisioning Services with additional security. TPM is an industry-wide, ISO standard from the Trusted Computing Group, and you can read more about TPM at the [complete TPM 2.0 spec](https://trustedcomputinggroup.org/resource/tpm-library-specification/) or the ISO/IEC 11889 spec. For more information on how DPS can provision devices in a secure manner see [Azure IoT Hub Device Provisioning Service - TPM Attestation](../iot-dps/concepts-tpm-attestation.md).

### Azure Percept system on module (SOM)

Azure Percept DK vision-enabled system on module (SOM) and the Azure Percept Audio accessory SOM both include a Micro Controller Unit (MCU) for protecting access to the embedded AI sensors. At every boot, the MCU firmware authenticates and authorizes the AI accelerator with Azure Percept Studio services using the Device Identifier Composition Engine (DICE) architecture. DICE works by breaking up boot into layers and creating secrets unique to each layer and configuration based on a Unique Device Secret (UDS). If different code or configuration is booted, at any point in the chain, the secrets will be different. You can read more about DICE at the [DICE workgroup spec](https://trustedcomputinggroup.org/work-groups/dice-architectures/). For configuring access to Azure Percept Studio and required services see the **Configuring firewalls for Azure Percept DK** below.

Azure Percept devices use the hardware root trust to secure firmware. The boot ROM ensures integrity of firmware between ROM and operating system (OS) loader which in turn ensures integrity of the other software components creating a chain of trust.

## Services

### IoT Edge

Azure Percept DK connects to Azure Percept Studio with additional security and other Azure services utilizing Transport Layer Security (TLS) protocol. Azure Percept DK is an Azure IoT Edge enabled device. IoT Edge runtime is a collection of programs that turn a device into an IoT Edge device. Collectively, the IoT Edge runtime components enable IoT Edge devices to receive code to run at the edge and communicate the results. Azure Percept DK utilizes Docker containers for isolating IoT Edge workloads from the host operating system and edge enabled applications. For more information about the Azure IoT Edge security framework, read about the [IoT Edge security manager](../iot-edge/iot-edge-security-manager.md).

### Device Update for IoT Hub

Device Update for IoT Hub enables more secure, scalable, and reliable over-the-air updating that brings renewable security to Azure Percept devices. It provides rich management controls and update compliance through insights. Azure Percept DK includes a pre-integrated device update solution providing resilient update (A/B) from firmware to OS layers.

<!---I think the below topics need to be somewhere else, (i.e. not on the main page)
--->

## Configuring firewalls for Azure Percept DK

If your networking setup requires that you explicitly permit connections made from Azure Percept DK devices, review the following list of components.

This checklist is a starting point for firewall rules:

|URL (* = wildcard)	|Outbound TCP Ports|	Usage|
|-------------------|------------------|---------|
|*.auth.azureperceptdk.azure.net|	443|	Azure DK SOM Authentication and Authorization|
|*.auth.projectsantacruz.azure.net|	443|	Azure DK SOM Authentication and Authorization|

Additionally, review the list of [connections used by Azure IoT Edge](../iot-edge/production-checklist.md#allow-connections-from-iot-edge-devices).

<!---
## Additional Recommendations for Deployment to Production

Azure Percept DK offers a great variety of security capabilities out of the box. In addition to those powerful security features included in the current release, Microsoft also suggests the following guidelines when considering production deployments:

- Strong physical protection of the device itself
- Ensuring data at rest encryption is enabled
- Continuously monitoring the device posture and quickly responding to alerts
- Limiting the number of administrators who have access to the device
--->


## Next steps

Learn about the available [Azure Percept AI models](./overview-ai-models.md).
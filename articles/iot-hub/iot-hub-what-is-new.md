---
title: What is New in Azure IoT Hub? (Preview)
titleSuffix: Azure IoT Hub
description: This article explains the new features and improvements in Azure IoT Hub.
#customer intent: As a developer new to IoT Hub, I want to understand the new features and improvements in Azure IoT Hub so that I can evaluate their benefits for my IoT projects.
author: cwatson-cat
ms.author: cwatson
ms.reviewer: cwatson
ms.service: azure-iot-hub
services: iot-hub
ms.topic: overview
ms.date: 01/27/2025
ms.custom: references_regions
ai-usage: ai-assisted
---

# What is new in Azure IoT Hub? (preview)

Starting November 2025, Azure IoT Hub introduces two new **preview** features: integration with Azure Device Registry (ADR) and enhanced Microsoft-backed X.509 certificate management. These features help improve security, simplify device management, and streamline operations for IoT deployments. This article provides an overview of both features and how to get started.

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

## Manage your devices in a unified registry with Azure Device Registry

IoT Hub now integrates directly with Azure Device Registry (ADR) to bring a consistent experience across cloud and edge workloads. ADR is a centralized device registry that allows you to manage IoT devices across IoT Hub and IoT Operations instances using namespaces. You can link your IoT instances to either a new or an existing ADR namespace. Integration of IoT Hub with ADR is essential to leverage the latest enhancements in device provisioning, certificate management, and deeper integration with Azure Resource Manager.

For more information, see [What is Azure Device Registry?](iot-hub-device-registry-overview.md)

## Manage your X.509 credentials with certificate management

IoT Hub now introduces certificate management for managing device certificates by using Microsoft-managed public key infrastructure (PKI) with X.509 certificates. Certificate management is an optional feature of ADR that enables you to issue and manage X.509 certificates for your IoT devices. It configures a dedicated, cloud-based PKI for each of your ADR namespaces, without requiring any on-premises servers, connectors, or hardware. It handles the certificate of issuance and renewal for all IoT devices that are provisioned to that ADR namespace. These X.509 certificates can be used for your IoT devices to authenticate with IoT Hub.

These X.509 certificates are strictly operational certificates that the device uses to authenticate with IoT Hub for secure communications, after the device is onboarded with a different credential.  

To use certificate management, devices must be provisioned through [Azure IoT Hub Device Provisioning Service (DPS)](../iot-dps/index.yml). 

For more information, see [What is certificate management?](iot-hub-certificate-management-overview.md) and [Key concepts for certificate management](iot-hub-certificate-management-concepts.md).

## Understand Device Provisioning Service requirement

All Azure IoT Hub preview scenarios require Device Provisioning Service (DPS). You must link your IoT Hub to a DPS instance and provision devices through DPS, whether you use certificate management or not. DPS enables consistent device onboarding, identity assignment, and secure authentication with IoT Hub.

For more information, see [Azure IoT Hub Device Provisioning Service (DPS)](../iot-dps/index.yml).

## Supported regions

To use IoT Hub with Azure Device Registry and certificate management, deploy instances of IoT Hub, Azure Device Registry, and Device Provisioning Service in one of the following supported regions:

- East US
- East US 2
- West US
- West US 2
- West Europe
- North Europe

## Get started with ADR and certificate management

To use these preview features, you must create a new IoT Hub instance with ADR integration. There's currently no upgrade path for existing IoT Hubs. If you're using IoT Hub now, your existing hubs continue to work without interruption. To try the new features, you'll need to:

1. Create a new ADR namespace or link to an existing one.
1. Create a new IoT Hub and connect it to your ADR namespace.
1. If you want to use certificate management, link your IoT Hub to a DPS instance.

For more information, see [Get started with ADR and certificate management in IoT Hub](iot-hub-device-registry-setup.md).

The preview period offers these features at no extra cost on top of your standard IoT Hub pricing.

## Related content

- [FAQ: What is new in Azure IoT Hub?](iot-hub-faq.md)
- [Integration with Azure Device Registry](iot-hub-device-registry-overview.md)
- [What is Microsoft-backed X.509 certificate management?](iot-hub-certificate-management-overview.md)
- [Key concepts for certificate management](iot-hub-certificate-management-concepts.md)
- [Get started with ADR and certificate management in IoT Hub](iot-hub-device-registry-setup.md)

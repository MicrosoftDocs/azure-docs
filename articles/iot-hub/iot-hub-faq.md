---
title: "FAQ: What is New in Azure IoT Hub? (Preview)"
titleSuffix: Azure IoT Hub
description: Learn about the new features and improvements in Azure IoT Hub.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
ms.topic: troubleshooting
ms.date: 11/04/2025
ms.custom: references_regions
#Customer intent: As a developer using IoT Hub, I want to understand the new features and improvements in Azure IoT Hub and how they affect my existing deployments.
---

# FAQ: What is new in Azure IoT Hub? (preview)

Azure IoT Hub introduces advanced capabilities to improve security and unify operations across cloud and edge-connected deployments. This FAQ addresses common questions about the new generation of IoT Hub.

## What are the new features in IoT Hub?

From November 2025, IoT Hub introduces two major innovations: Azure Device Registry (ADR) and certificate management. These features are in **preview** and designed to enhance security, simplify device management, and streamline operations for IoT deployments.

- **Azure Device Registry (ADR)**: A centralized device registry that allows you to manage devices across multiple IoT Hubs using namespaces. You can create a link between an existing ADR namespace to your IoT Hub or create a new namespace and create the link. For more information, see [What is Azure Device Registry?](iot-hub-device-registry-overview.md).

- **Certificate management**: IoT Hub introduces built-in support for managing device certificates using Microsoft-managed public key infrastructure (PKI) with X.509 certificates. These X.509 certificates are strictly operational certificates that the device uses to authenticate with IoT Hub for secure communications, after the device onboarded with a different credential. Certificate management is an optional feature. For more information, see [What is certificate management?](iot-hub-certificate-management-overview.md).

## Are my existing IoT Hubs affected by these changes?

No, existing IoT Hubs without ADR and certificate management integration remain fully functional. You can continue to use them as before without any changes. The new features are in preview and require creating new IoT Hub instances with ADR integration. 

## Can I upgrade my existing IoT Hubs to use Azure Device Registry and certificate management?

No, upgrade from existing IoT Hubs to IoT Hubs with ADR and certificate management isn't supported. You must create a new IoT Hub instance and link it to an ADR namespace. For more information, see [Get started with ADR and certificate management in IoT Hub (Preview)](iot-hub-device-registry-setup.md).

## What happens to the built-in IoT Hub Device Registry if I set up a new IoT hub with ADR and certificate management enabled?

IoT Hub Device Registry continues to exist, and all the existing functionalities are all available within the built-in registry while in preview. Azure Device Registry integration is an additional ARM representation that you can use for listing devices across IoT Hubs in your ADR namespace. ADR integration enables you to use out-of-box Azure capabilities more seamlessly.

## Can I use namespaces and Azure Device Registry in my existing hubs?

No, namespaces and Azure Device Registry aren't available in existing hubs. You must create a new IoT Hub instance and link it to an ADR namespace. For more information, see [Get started with ADR and certificate management in IoT Hub (Preview)](iot-hub-device-registry-setup.md).

## Can I use certificate management in my existing hubs?

No, certificate management isn't available in existing hubs. You must create a new IoT hub instance and link it to an ADR namespace.  For more information, see [Get started with ADR and certificate management in IoT Hub (Preview)](iot-hub-device-registry-setup.md).

## Can I use Azure Device Registry without certificate management?

Yes. Certificate management is an optional feature. You can use ADR to manage devices across multiple IoT Hubs and choose to use other authentication methods, such as symmetric keys or third-party X.509 certificates. 

## Can I use certificate management without Azure Device Registry?

No. Certificate management is an optional feature of ADR, and thus it requires using ADR to manage device certificates. You must set up an ADR namespace and link it to your IoT Hub and DPS instance to use certificate management. For more information, see the section [How certificate management works](iot-hub-certificate-management-overview.md#how-certificate-management-works) in [What is certificate management?](iot-hub-certificate-management-overview.md).

## Can I use certificate management without Device Provisioning Service (DPS)?

No, certificate management relies on the Device Provisioning Service (DPS) for device registration and certificate management. You must use DPS with ADR to utilize certificate management features. For more information, see the section [Device Provisioning Service integration](iot-hub-certificate-management-overview.md#device-provisioning-service-integration) in [What is certificate management?](iot-hub-certificate-management-overview.md).

## What is the pricing model for IoT Hub with ADR and certificate management?

During the preview period, IoT Hub with ADR integration and certificate management features enabled on top of IoT Hub are available **free of charge**. After the preview period, pricing details will be provided. Device Provisioning Service (DPS) is billed separately and isn't included in the preview offer. For details on DPS pricing, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

## What are the quotas and limits for IoT Hub with ADR and certificate management?

IoT Hub with ADR integration and certificate management is only available in the **Free and S1 tiers**. For more information, see the standard tier operations section in [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md#standard-tier-operations).

## What are the supported regions for IoT Hub with ADR and certificate management?

IoT Hub with ADR integration and certificate management is available in the following regions:

- East US
- East US 2
- West US
- West US 2
- West Europe
- North Europe
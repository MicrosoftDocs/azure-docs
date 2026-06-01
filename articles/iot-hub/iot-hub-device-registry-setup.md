---
title: Deploy IoT Hub with Device Registry Integration and Certificate Management (Preview)
titleSuffix: Azure IoT Hub
description: Learn how to create an IoT Hub with Azure Device Registry integration and Microsoft-backed X.509 certificate management.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 04/15/2026
zone_pivot_groups: iot-hub-deployment-methods
#Customer intent: As a developer new to IoT, I want to understand what Azure Device Registry is and how it can help me manage my IoT devices.
---

# Deploy Azure IoT Hub with Device Registry integration and certificate management (preview)

This article explains how to deploy Azure IoT Hub with [Azure Device Registry](iot-hub-device-registry-overview.md) integration and [Microsoft-backed X.509 certificate management](iot-hub-certificate-management-overview.md).

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

## Prerequisites

- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The privilege to perform role assignments within your target scope. Performing role assignments in Azure requires a [privileged role](../role-based-access-control/built-in-roles.md#privileged), such as Owner or User Access Administrator at the appropriate scope.
- A [supported region](iot-hub-what-is-new.md#supported-regions) to deploy instances of IoT Hub, Azure Device Registry, and Device Provisioning Service (DPS).

## Choose a deployment method

To use certificate management, you must also set up IoT Hub, Device Registry, and [DPS](../iot-dps/index.yml). If you prefer, you can choose not to enable certificate management and configure only IoT Hub with Device Registry.

To set up your IoT Hub instance with Device Registry integration and certificate management, you can use the Azure portal, the Azure CLI, or a script that automates the setup process.

| Deployment method | Description |
|-------------------|-------------|
| Select the **Azure portal** tab at the top of the page. | Use the Azure portal to create a new IoT hub, a DPS instance, and a Device Registry namespace and to configure all necessary settings. |
| Select the **Azure CLI** tab at the top of the page. | Use the Azure CLI to create a new IoT hub, a DPS instance, and a Device Registry namespace and to configure all necessary settings. |
| Select the **PowerShell script** tab at the top of the page. | Use a PowerShell script (Windows only) to automate the creation of a new IoT hub, a DPS instance, and a Device Registry namespace and to configure all necessary settings. |

:::zone pivot="portal"

[!INCLUDE [iot-hub-device-registry-portal](../../includes/iot-hub-device-registry-portal.md)]

:::zone-end

:::zone pivot="azure-cli"

[!INCLUDE [iot-hub-device-registry-azurecli](../../includes/iot-hub-device-registry-azure-cli.md)]

:::zone-end

:::zone pivot="script"

[!INCLUDE [iot-hub-device-registry-script](../../includes/iot-hub-device-registry-script.md)]

:::zone-end

## Next steps

1. Your IoT hub with Device Registry integration and certificate management is set up and ready to use. You can now start onboarding your IoT devices to the hub by using a DPS instance. You can use your Device Registry policies to issue certificates to your devices:

   - [Certificate issuance in Azure IoT Hub certificate management](concept-certificate-issuance.md)
   - [Certificate renewal in Azure IoT Hub certificate management](concept-certificate-renewal.md)

1. Certificate management is supported across select [IoT Hub SDKs and DPS for device SDKs](../iot-dps/libraries-sdks.md#device-sdks). You can now onboard devices by using Microsoft-backed X.509 certificate management with the following SDK samples:

   - [Certificate management device SDKs (preview)](../iot-dps/libraries-sdks.md#certificate-management-device-sdks-preview)
   - [Embedded device SDKs](../iot-dps/libraries-sdks.md#certificate-management-embedded-device-sdks-preview)
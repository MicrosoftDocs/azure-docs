---
title: Deploy IoT Hub with ADR integration and certificate management (Preview)
titleSuffix: Azure IoT Hub
description: This article explains how to create an IoT Hub with ADR integration and Microsoft-backed X.509 certificate management.
author: cwatson-cat
ms.author: cwatson
ms.service: azure-iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 01/27/2026
zone_pivot_groups: iot-hub-deployment-methods
#Customer intent: As a developer new to IoT, I want to understand what Azure Device Registry is and how it can help me manage my IoT devices.
---

# Deploy Azure IoT Hub with ADR integration and certificate management (preview)

This article explains how to deploy IoT Hub with [Azure Device Registry (ADR)](iot-hub-device-registry-overview.md) integration and [Microsoft-backed X.509 certificate management](iot-hub-certificate-management-overview.md).

[!INCLUDE [iot-hub-public-preview-banner](includes/public-preview-banner.md)]

## Prerequisites

- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).
- Ensure that you have the privilege to perform role assignments within your target scope. Performing role assignments in Azure requires a [privileged role](../role-based-access-control/built-in-roles.md#privileged), such as Owner or User Access Administrator at the appropriate scope.
- Select a [supported region](iot-hub-what-is-new.md#supported-regions) to deploy instances of  IoT Hub, Azure Device Registry, and Device Provisioning Service.

## Choose a deployment method

To use certificate management, you must also set up IoT Hub, ADR, and the [Device Provisioning Service (DPS)](../iot-dps/index.yml). If you prefer, you can choose not to enable certificate management and configure only IoT Hub with ADR.

To set up your IoT Hub with ADR integration and certificate management, you can use the Azure portal, Azure CLI, or a script that automates the setup process.

| Deployment method | Description |
|-------------------|-------------|
| Select **Azure portal** at the top of the page | Use the Azure portal to create a new IoT Hub, DPS instance, and ADR namespace and configure all necessary settings. |
| Select **Azure CLI** at the top of the page | Use the Azure CLI to create a new IoT Hub, DPS instance, and ADR namespace and configure all necessary settings. |
| Select **PowerShell script** at the top of the page | Use a PowerShell script (Windows only) to automate the creation of a new IoT Hub, DPS instance, and ADR namespace and configure all necessary settings. |

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

At this point, your IoT Hub with ADR integration and certificate management is set up and ready to use. You can now start onboarding your IoT devices to the hub using the Device Provisioning Service (DPS) instance and manage your IoT devices securely using the policies and enrollments you have set up.

**New**: Certificate management is supported across select [DPS Device SDKs](../iot-dps/libraries-sdks.md#device-sdks). You can now onboard devices using Microsoft-backed X.509 certificate management with the following SDK samples:

- [DPS Device SDKs](../iot-dps/libraries-sdks.md#certificate-management-device-sdks-preview)
- [Embedded Device SDKs](../iot-dps/libraries-sdks.md#certificate-management-embedded-device-sdks-preview)




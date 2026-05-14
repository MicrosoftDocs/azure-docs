---
title: Azure IoT device and service SDKs
description: A list of the IoT SDKs and libraries. Includes SDKs for device development and SDKs for building service applications.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-hub
ms.topic: reference
ms.date: 04/02/2026
ai-usage: ai-assisted

---

# Azure IoT device and service SDKs

This reference lists the Azure SDKs you can use to build IoT solutions, including device, service, and management SDKs for IoT Hub and Device Provisioning Service (DPS), preview SDKs for certificate management, and links to Azure Digital Twins control plane and data plane APIs.

## Device SDKs

[!INCLUDE [iot-hub-sdks-device](../../includes/iot-hub-sdks-device.md)]

Use the device SDKs to develop code to run on IoT devices that connect to IoT Hub or IoT Central.

### Embedded device SDKs

[!INCLUDE [iot-hub-sdks-embedded](../../includes/iot-hub-sdks-embedded.md)]

Use the embedded device SDKs to develop code to run on IoT devices that connect to IoT Hub or IoT Central.

To learn more about when to use the embedded device SDKs, see [C SDK and Embedded C SDK usage scenarios](/previous-versions/azure/iot/concepts-using-c-sdk-and-embedded-c-sdk).

### Device SDK lifecycle and support

This section summarizes the Azure IoT Device SDK lifecycle and support policy. For more information, see [Azure SDK Lifecycle and support policy](https://azure.github.io/azure-sdk/policies_support.html).

#### Package lifecycle

Packages are released in the following categories. Each category has a defined support structure.

1. **Beta** - Also known as Preview or Release Candidate. Available for early access and feedback purposes and **is not recommended** for use in production. The preview version support is limited to GitHub issues. Preview releases typically live for less than six months, after which they're either deprecated or released as active.

1. **Active** - Generally available and fully supported, receives new feature updates, as well as bug and security fixes. Use the **latest version** because that version receives fixes and updates.

1. **Deprecated** - Superseded by a more recent release. Deprecation occurs at the same time the new release becomes active. Deprecated releases address the most critical bug fixes and security fixes for another **12 months**.

#### Get support

If you experience problems while using the Azure IoT SDKs, seek support through the following options:

* **Reporting bugs** - All customers can report bugs on the issues page for the GitHub repository associated with the relevant SDK. 

* **Microsoft Customer Support team** - Users who have a [support plan](https://azure.microsoft.com/support/plans/) can engage the Microsoft Customer Support team by creating a support ticket directly from the [Azure portal](https://portal.azure.com/signin/index/?feature.settingsportalinstance=mpac).

## IoT Hub service SDKs

[!INCLUDE [iot-hub-sdks-service](../../includes/iot-hub-sdks-service.md)]

To learn more about using the service SDKs to interact with devices through an IoT hub, see [IoT Plug and Play service developer guide](/previous-versions/azure/iot/concepts-developer-guide-service).

## IoT Hub management SDKs

[!INCLUDE [iot-hub-sdks-management](../../includes/iot-hub-sdks-management.md)]

Alternatives to the management SDKs include the [Azure CLI](../iot-hub/iot-hub-create-using-cli.md), [PowerShell](../iot-hub/iot-hub-create-using-powershell.md), and [REST API](../iot-hub/iot-hub-rm-rest.md).

## DPS device SDKs

[!INCLUDE [iot-dps-sdks-device](../../includes/iot-dps-sdks-device.md)]

### DPS embedded device SDKs

[!INCLUDE [iot-dps-sdks-embedded](../../includes/iot-dps-sdks-embedded.md)]

## DPS service SDKs

[!INCLUDE [iot-dps-sdks-service](../../includes/iot-dps-sdks-service.md)]

## DPS management SDKs

[!INCLUDE [iot-dps-sdks-management](../../includes/iot-dps-sdks-management.md)]

## Certificate management SDKs (preview)

For SDKs that support Microsoft-backed X.509 certificate management in preview, use the following instructions and samples. To use certificate management SDKs in preview, you must use Azure IoT Hub with a linked DPS instance, and devices must provision through DPS.

#### Certificate management device SDKs (preview)

[!INCLUDE [iot-hub-sdks-certificate-management](../../includes/iot-hub-sdks-certificate-management.md)]

#### Certificate management embedded device SDKs (preview)

[!INCLUDE [iot-hub-sdks-certificate-management-embedded](../../includes/iot-hub-sdks-certificate-management-embedded.md)]

## Azure Digital Twins control plane APIs

[!INCLUDE [digital-twins-sdks-control-plane](../digital-twins/includes/digital-twins-sdks-control-plane.md)]

## Azure Digital Twins data plane APIs

[!INCLUDE [digital-twins-sdks-data-plane](../digital-twins/includes/digital-twins-sdks-data-plane.md)]

## Next steps

Suggested next steps include:

- [Device developer guide](/previous-versions/azure/iot/concepts-developer-guide-device)
- [Service developer guide](/previous-versions/azure/iot/concepts-developer-guide-service)

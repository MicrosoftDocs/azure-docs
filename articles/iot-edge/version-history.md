---
title: IoT Edge version navigation and history - Azure IoT Edge
description: Discover what's new in IoT Edge with information about new features and capabilities in the latest releases.
author: PatAltimore
ms.author: patricka
ms.date: 04/07/2021
ms.topic: conceptual
ms.service: iot-edge
---

# Azure IoT Edge versions and release notes

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

Azure IoT Edge is a product built from the open-source IoT Edge project hosted on GitHub. All new releases are made available in the [Azure IoT Edge project](https://github.com/Azure/azure-iotedge). Contributions and bug reports can be made on the [open-source IoT Edge project](https://github.com/Azure/iotedge).

## Documented versions

The IoT Edge documentation on this site is available for two different versions of the product, so that you can choose the content that applies to your IoT Edge environment. Currently, the two supported versions are:

* **IoT Edge 1.2** contains content for new features and capabilities that are in the latest stable release. This version of the documentation also contains content for the IoT Edge for Linux on Windows (EFLOW) continuous release version, which is based on IoT Edge 1.2 and contains the latest features and capabilities. IoT Edge 1.2 is now bundled with the [Microsoft Defender for IoT micro-agent for Edge](../defender-for-iot/device-builders/overview.md).
* **IoT Edge 1.1 (LTS)** is the first long-term support (LTS) version of IoT Edge. The documentation for this version covers all features and capabilities from all previous versions through 1.1. This version of the documentation also contains content for the IoT Edge for Linux on Windows long-term support version, which is based on IoT Edge 1.1 LTS.
  * This documentation version will be stable through the supported lifetime of version 1.1, and won't reflect new features released in later versions. IoT Edge 1.1 LTS will be supported until December 13, 2022 to match the [.NET Core 3.1 release lifecycle](https://dotnet.microsoft.com/platform/support/policy/dotnet-core).

For more information about IoT Edge releases, see [Azure IoT Edge supported systems](support.md).

### IoT Edge for Linux on Windows 
Azure IoT Edge for Linux on Windows (EFLOW) supports the following versions:
* **EFLOW Continuous Release (CR)** based on Azure IoT Edge 1.2 version, it contains new features and capabilities that are in the latest stable release. 
* **EFLOW 1.1 (LTS)** based on Azure IoT Edge 1.1, it's the Long-term support version. This version will be stable through the supported lifetime of this version and won't include new features released in later versions. This version will be supported until Dec 2022 to match the IoT Edge 1.1 LTS release lifecycle.  

All new releases are made available in the [Azure IoT Edge for Linux on Windows project](https://github.com/Azure/iotedge-eflow).

## Version history

This table provides recent version history for IoT Edge package releases, and highlights documentation updates made for each version.

| Release notes and assets | Type | Date | Highlights |
| ------------------------ | ---- | ---- | ---------- |
| [1.2](https://github.com/Azure/azure-iotedge/releases/tag/1.2.0) | Stable | April 2021 | [IoT Edge devices behind gateways](how-to-connect-downstream-iot-edge-device.md?view=iotedge-2020-11&preserve-view=true)<br>[IoT Edge MQTT broker (preview)](how-to-publish-subscribe.md?view=iotedge-2020-11&preserve-view=true)<br>New IoT Edge packages introduced, with new installation and configuration steps. For more information, see [Update from 1.0 or 1.1 to 1.2](how-to-update-iot-edge.md#special-case-update-from-10-or-11-to-12).<br>Includes [Microsoft Defender for IoT micro-agent for Edge](../defender-for-iot/device-builders/overview.md).
| [1.1](https://github.com/Azure/azure-iotedge/releases/tag/1.1.0) | Long-term support (LTS) | February 2021 | [Long-term support plan and supported systems updates](support.md) |
| [1.0.10](https://github.com/Azure/azure-iotedge/releases/tag/1.0.10) | Stable | October 2020 | [UploadSupportBundle direct method](how-to-retrieve-iot-edge-logs.md#upload-support-bundle-diagnostics)<br>[Upload runtime metrics](how-to-access-built-in-metrics.md)<br>[Route priority and time-to-live](module-composition.md#priority-and-time-to-live)<br>[Module startup order](module-composition.md#configure-modules)<br>[X.509 manual provisioning](how-to-provision-single-device-linux-x509.md) |
| [1.0.9](https://github.com/Azure/azure-iotedge/releases/tag/1.0.9) | Stable | March 2020 | X.509 auto-provisioning with DPS<br>[RestartModule direct method](how-to-edgeagent-direct-method.md#restart-module)<br>[support-bundle command](troubleshoot.md#gather-debug-information-with-support-bundle-command) |


### IoT Edge for Linux on Windows 
| Release notes and assets | Type | Date | Highlights |
| ------------------------ | ---- | ---- | ---------- |
| [Continuous Release (CR)](https://github.com/Azure/iotedge-eflow/releases/tag/1.2.7.07022) | Stable | January 2022 | **Public Preview** |
| [1.1](https://github.com/Azure/iotedge-eflow/releases/tag/1.1.2106.0) | Long-term support (LTS) | June 2021 | [Long-term support plan and supported systems updates](support.md) |

## Next steps

* [View all Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases)

* [Make or review feature requests in the feedback forum](https://feedback.azure.com/d365community/forum/0e2fff5d-f524-ec11-b6e6-000d3a4f0da0)

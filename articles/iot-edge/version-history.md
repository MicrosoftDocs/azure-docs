---
title: IoT Edge version history and release notes
description: Release history and notes for IoT Edge.
author: PatAltimore
ms.author: patricka
ms.date: 10/24/2022
ms.topic: conceptual
ms.service: iot-edge
---

# Azure IoT Edge versions and release notes

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Azure IoT Edge is a product built from the open-source IoT Edge project hosted on GitHub. All new releases are made available in the [Azure IoT Edge project](https://github.com/Azure/azure-iotedge). Contributions and bug reports can be made on the [open-source IoT Edge project](https://github.com/Azure/iotedge).

Azure IoT Edge is governed by Microsoft's [Modern Lifecycle Policy](/lifecycle/products/azure-iot-edge).

## Documented versions

The IoT Edge documentation on this site is available for two different versions of the product, so that you can choose the content that applies to your IoT Edge environment. Currently, the two supported versions are:

* **IoT Edge 1.4 (LTS)** is the latest long-term support (LTS) version of IoT Edge and contains content for new features and capabilities that are in the latest stable release. The documentation for this version covers all features and capabilities from all previous versions through 1.3. This version of the documentation also contains content for the IoT Edge for Linux on Windows (EFLOW) continuous release version.
* **IoT Edge 1.1 (LTS)** is the first long-term support (LTS) version of IoT Edge. The documentation for this version covers all features and capabilities from all previous versions through 1.1. This version of the documentation also contains content for the IoT Edge for Linux on Windows long-term support version, which is based on IoT Edge 1.1 LTS.
  * This documentation version will be stable through the supported lifetime of version 1.1, and won't reflect new features released in later versions. 
For more information about IoT Edge releases, see [Azure IoT Edge supported systems](support.md).

### IoT Edge for Linux on Windows 
Azure IoT Edge for Linux on Windows (EFLOW) supports the following versions:
* **EFLOW Continuous Release (CR)** based on the latest non-LTS Azure IoT Edge version, it contains new features and capabilities that are in the latest stable release. For more information, see the [EFLOW release notes](https://github.com/Azure/iotedge-eflow/releases).
* **EFLOW 1.1 (LTS)** based on Azure IoT Edge 1.1, it's the Long-term support version. This version will be stable through the supported lifetime of this version and won't include new features released in later versions. This version will be supported until Dec 2022 to match the IoT Edge 1.1 LTS release lifecycle.  
* **EFLOW 1.4 (LTS)** based on Azure IoT Edge 1.4, it's the latest Long-term support version. This version will be stable through the supported lifetime of this version and won't include new features released in later versions. This version will be supported until Nov 2024 to match the IoT Edge 1.4 LTS release lifecycle.  

All new releases are made available in the [Azure IoT Edge for Linux on Windows project](https://github.com/Azure/iotedge-eflow).

## Version history

This table provides recent version history for IoT Edge package releases, and highlights documentation updates made for each version.

>[!NOTE]
>Long-term servicing (LTS) releases are serviced for a fixed period. Updates to this release type contain critical security and bug fixes only. All other stable releases are continuously supported and serviced. A stable release may contain features updates along with critical security fixes. Stable releases are supported only until the next release (stable or LTS) is generally available.

| Release notes and assets | Type | Release Date | End of Support Date | Highlights |
| ------------------------ | ---- | ------------ | ------------------- | ---------- |
| [1.4](https://github.com/Azure/azure-iotedge/releases/tag/1.4.0) | Long-term support (LTS) | August 2022 | November 12, 2024 | IoT Edge 1.4 LTS is supported through November 12, 2024 to match the [.NET 6 release lifecycle](https://dotnet.microsoft.com/platform/support/policy/dotnet-core#lifecycle). <br> Automatic image clean-up of unused Docker images <br> Ability to pass a [custom JSON payload to DPS on provisioning](../iot-dps/how-to-send-additional-data.md#iot-edge-support) <br> Ability to require all modules in a deployment be downloaded before restart <br> Use of the TCG TPM2 Software Stack which enables TPM hierarchy authorization values, specifying the TPM index at which to persist the DPS authentication key, and accommodating more [TPM configurations](https://github.com/Azure/iotedge/blob/897aed8c5573e8cad4b602e5a1298bdc64cd28b4/edgelet/contrib/config/linux/template.toml#L262-L288) |
| [1.3](https://github.com/Azure/azure-iotedge/releases/tag/1.3.0) | Stable | June 2022 | August 2022  | Support for Red Hat Enterprise Linux 8 on AMD and Intel 64-bit architectures.<br>Edge Hub now enforces that inbound/outbound communication uses minimum TLS version 1.2 by default<br>Updated runtime modules (edgeAgent, edgeHub) based on .NET 6 |
| [1.2](https://github.com/Azure/azure-iotedge/releases/tag/1.2.0) | Stable | April 2021 | June 2022 | [IoT Edge devices behind gateways](how-to-connect-downstream-iot-edge-device.md)<br>[IoT Edge MQTT broker (preview)](how-to-publish-subscribe.md)<br>New IoT Edge packages introduced, with new installation and configuration steps. For more information, see [Update from 1.0 or 1.1 to latest release](how-to-update-iot-edge.md#special-case-update-from-10-or-11-to-latest-release).<br>Includes [Microsoft Defender for IoT micro-agent for Edge](../defender-for-iot/device-builders/overview.md).<br> Integration with Device Update. For more information, see [Update IoT Edge](how-to-update-iot-edge.md). |
| [1.1](https://github.com/Azure/azure-iotedge/releases/tag/1.1.0) | Long-term support (LTS) | February 2021 | December 13, 2022 | IoT Edge 1.1 LTS is supported through December 13, 2022 to match the [.NET Core 3.1 release lifecycle](https://dotnet.microsoft.com/platform/support/policy/dotnet-core). <br> [Long-term support plan and supported systems updates](support.md) |
| [1.0.10](https://github.com/Azure/azure-iotedge/releases/tag/1.0.10) | Stable | October 2020 | February 2021 | [UploadSupportBundle direct method](how-to-retrieve-iot-edge-logs.md#upload-support-bundle-diagnostics)<br>[Upload runtime metrics](how-to-access-built-in-metrics.md)<br>[Route priority and time-to-live](module-composition.md#priority-and-time-to-live)<br>[Module startup order](module-composition.md#configure-modules)<br>[X.509 manual provisioning](how-to-provision-single-device-linux-x509.md) |
| [1.0.9](https://github.com/Azure/azure-iotedge/releases/tag/1.0.9) | Stable | March 2020 | October 2020 | X.509 auto-provisioning with DPS<br>[RestartModule direct method](how-to-edgeagent-direct-method.md#restart-module)<br>[support-bundle command](troubleshoot.md#gather-debug-information-with-support-bundle-command) |


### IoT Edge for Linux on Windows 

| IoT Edge release | Available in EFLOW branch | Release date | End of Support Date | Highlights |
| ---------------- | ------------------------- | ------------ | ------------------- | ---------- |
| 1.4 | [Long-term support (LTS)](https://github.com/Azure/iotedge-eflow/releases/tag/1.4.1.13112) | November 2022 | November 12, 2024 | [Azure IoT Edge 1.4.0](https://github.com/Azure/azure-iotedge/releases/tag/1.4.0)<br/> [CBL-Mariner 2.0](https://microsoft.github.io/CBL-Mariner/announcing-mariner-2.0/)<br/> [USB passthrough using USB-Over-IP](https://aka.ms/AzEFLOW-USBIP)<br/>[File/Folder sharing between Windows OS and the EFLOW VM](https://aka.ms/AzEFLOW-FolderSharing) |
| 1.3 | [Continuous release (CR)](https://github.com/Azure/iotedge-eflow/releases/tag/1.3.1.02092) | September 2022 | In support | [Azure IoT Edge 1.3.0](https://github.com/Azure/azure-iotedge/releases/tag/1.3.0)<br/> [CBL-Mariner 2.0](https://microsoft.github.io/CBL-Mariner/announcing-mariner-2.0/)<br/> [USB passthrough using USB-Over-IP](https://aka.ms/AzEFLOW-USBIP)<br/>[File/Folder sharing between Windows OS and the EFLOW VM](https://aka.ms/AzEFLOW-FolderSharing) |
| 1.2 | [Continuous release (CR)](https://github.com/Azure/iotedge-eflow/releases/tag/1.2.7.07022) | January 2022 | September 2022 | [Public Preview](https://techcommunity.microsoft.com/t5/internet-of-things-blog/azure-iot-edge-for-linux-on-windows-eflow-continuous-release/ba-p/3169590) |
| 1.1 | [Long-term support (LTS)](https://github.com/Azure/iotedge-eflow/releases/tag/1.1.2106.0) | June 2021 | December 13, 2022 | IoT Edge 1.1 LTS is supported through December 13, 2022 to match the [.NET Core 3.1 release lifecycle](https://dotnet.microsoft.com/platform/support/policy/dotnet-core). <br> [Long-term support plan and supported systems updates](support.md) |

## Next steps

* [View all Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases)

* [Make or review feature requests in the feedback forum](https://feedback.azure.com/d365community/forum/0e2fff5d-f524-ec11-b6e6-000d3a4f0da0)

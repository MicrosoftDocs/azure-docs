---
title: IoT Edge version navigation and history - Azure IoT Edge
description: Discover what's new in IoT Edge with information about new features and capabilities in the latest releases.
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 11/08/2020
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Azure IoT Edge versions and release notes

Azure IoT Edge is a product built from the open-source IoT Edge project hosted on GitHub. All new releases are made available in the [Azure IoT Edge project](https://github.com/Azure/azure-iotedge). Contributions and bug reports can be made on the [open-source IoT Edge project](https://github.com/Azure/iotedge).

## Documented versions

The IoT Edge documentation on this site is available for two different versions of the product, so that you can choose the content that applies to your IoT Edge environment. Currently, the two supported versions are:

* **IoT Edge 1.0.10** covers all features and capabilities through the latest generally available release: [1.0.10](https://github.com/Azure/azure-iotedge/releases/tag/1.0.10).
* **IoT Edge 1.2 (preview)** contains additional content for features and capabilities that are in the latest preview release: [1.2-rc1](https://github.com/Azure/azure-iotedge/releases/tag/1.2-rc1)
  * While IoT Edge 1.2 is in preview, you need to install the release candidate versions. For more information, see [Offline or specific version installation](how-to-install-iot-edge.md?tabs=linux#offline-or-specific-version-installation).

## Version history

This table provides recent version history for IoT Edge package releases, and highlights documentation updates made for each version.

| Release notes and assets | Type | Date | Highlights |
| ------------------------ | ---- | ---- | ---------- |
| [1.2-rc1](https://github.com/Azure/azure-iotedge/releases/tag/1.2-rc1) | Preview | November 2020 | [IoT Edge devices behind gateways](how-to-connect-downstream-iot-edge-device.md?view=iotedge-2020-11&preserve-view=true)<br>[IoT Edge MQTT broker](how-to-publish-subscribe.md?view=iotedge-2020-11&preserve-view=true) |
| [1.0.10](https://github.com/Azure/azure-iotedge/releases/tag/1.0.10) | Stable | October 2020 | [UploadSupportBundle direct method](how-to-retrieve-iot-edge-logs.md#upload-support-bundle-diagnostics)<br>[Upload runtime metrics](how-to-access-built-in-metrics.md)<br>[Route priority and time-to-live](module-composition.md#priority-and-time-to-live)<br>[Module startup order](module-composition.md#configure-modules)<br>[X.509 manual provisioning](how-to-manual-provision-x509.md) |
| [1.0.9](https://github.com/Azure/azure-iotedge/releases/tag/1.0.9) | Stable | March 2020 | [X.509 auto-provisioning with DPS](how-to-auto-provision-x509-certs.md)<br>[RestartModule direct method](how-to-edgeagent-direct-method.md#restart-module)<br>[support-bundle command](troubleshoot.md#gather-debug-information-with-support-bundle-command) |

## Next steps

* [View all Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases)
* [Make or review feature requests in the feedback forum](https://feedback.azure.com/forums/907045-azure-iot-edge)
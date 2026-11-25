---
title: Include file
description: Include file with details of currently supported versions
author: dominicbetts
ms.topic: include
ms.date: 05/06/2026
ms.service: azure-iot-operations
ms.author: dobett
---

Microsoft supports three generally available (GA) versions of Azure IoT Operations at any time: the latest version, and the two previous minor versions. Additionally, preview versions are available for testing new features.

Currently, [Azure support](https://azure.microsoft.com/support/plans) is available for the following versions. For per-patch release notes for any Azure IoT Operations version, see the [Azure IoT Operations releases](https://github.com/Azure/azure-iot-operations/releases) on GitHub:

| Version | Type | Current patch <br/>release (YYMM) | Release notes | Current <br/>CLI version |
|---------|------|---------------|---------------|-------------|
| 1.6.x   | Preview | 1.6.0-preview.60 (2610) | [Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.6.0-preview.60) | [2.11.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v2.11.0)   |
| 1.5.x   | GA | 1.5.45 (2610) | [Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.5.45) | [2.11.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v2.11.0)   |
| 1.4.x   | GA | 1.4.112 (2609) | [Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.4.112) | [2.10.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v2.10.0)   |
| 1.3.x   | GA | 1.3.137 (2606) | [Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.3.137) | [2.7.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v2.7.0)   |

> [!CAUTION]
> Previous minor versions don't receive any updates such as security patches and bug fixes. Upgrade to the latest version to get the latest security and feature updates.

> [!NOTE]
> Azure Government supports version 1.5.x (2610) and later. See [Azure IoT Operations in Azure Government](../overview-azure-government.md#supported-versions).

> [!NOTE]
> With the release of 1.5.x, the supported versions become **1.5.x, 1.4.x, and 1.3.x**. The **1.0.x**, **1.1.x**, and **1.2.x** series (versions 2411 through 2602) are no longer within the [supported version window](../overview-support.md).

To verify your current version, go to the overview page for your Azure IoT Operations instance in the Azure portal or use the Azure IoT Operations CLI [az iot ops instance show](/cli/azure/iot/ops#az-iot-ops-show) command. In Azure Government, use the CLI.

For more information about upgrades between versions, see [Upgrade to a new version](../manage-iot-ops/howto-upgrade.md).

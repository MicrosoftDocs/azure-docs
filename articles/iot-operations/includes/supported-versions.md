---
title: Include file
description: Include file with details of currently supported versions
author: dominicbetts
ms.topic: include
ms.date: 12/15/2025
ms.author: dobett
---

Microsoft supports three generally available (GA) versions of Azure IoT Operations at any time: the latest version, and the two previous minor versions. Additionally, preview versions are available for testing new features.

Currently, [Azure support](https://azure.microsoft.com/support/plans) is available for the following versions:

| Version | Type | Current patch <br/>release (YYMM) | Release notes | Current <br/>CLI version |
|---------|------|---------------|---------------|-------------|
| 1.2.x   | GA | 1.2.154 (2512) | [Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.2.154) | [2.1.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v2.1.0)   |
| 1.1.x   | GA | 1.1.59 (2506) | [Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.1.59) | [1.7.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v1.7.0)     |
| 1.0.x   | GA | 1.0.34 (2503)  | [Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.0.34) | [1.3.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v1.3.0)       |

To learn about upgrades between versions, see [Upgrade to a new version](../deploy-iot-ops/howto-upgrade.md).

> [!IMPORTANT]
> Previous minor versions don't receive security patches. Upgrade to the latest version to get the latest security updates and features.

> [!WARNING]
> Don't use preview versions in production environments.

To verify your current version, go to the overview page for your Azure IoT Operations instance in the Azure portal or use the Azure IoT Operations CLI [az iot ops instance show](/cli/azure/iot/ops#az-iot-ops-show) command.

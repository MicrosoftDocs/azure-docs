---
title: Include file
description: Include file with details of currently supported versions
author: dominicbetts
ms.topic: include
ms.date: 08/12/2025
ms.author: dobett
---

Microsoft supports three generally available (GA) versions of Azure IoT Operations at any time: the latest version, and the two previous minor versions.

Currently, there are two supported minor GA versions. [Azure support](https://azure.microsoft.com/support/plans) is available for the following GA versions:

| Version | Patch release (YYMM) | CLI version | Release notes |
|---------|---------------|-------------|---------------|
| 1.1.x   | 1.1.59 (2506)<br/>1.1.19 (2504) | [1.7.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v1.7.0)<br/>[1.4.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v1.4.0), [1.5.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v1.5.0)     | [Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.1.59)</br>[Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.1.19) |
| 1.0.x   | 1.0.34 (2503)<br/>1.0.15 (2502)<br/>1.0.9 (2411)  | [1.3.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v1.3.0)<br/>[1.2.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v1.2.0)<br/>[1.0.0](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v1.0.0)       | [Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.0.34)<br/>[Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.0.15)<br/>[Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.0.9) |

To learn about upgrades between versions, see [Upgrade to a new version](../deploy-iot-ops/howto-upgrade.md).

> [!IMPORTANT]
> Previous minor versions don't receive security patches. Upgrade to the latest version to get the latest security updates and features.

Currently, there's only one supported preview version. [Azure support](https://azure.microsoft.com/support/plans) is  available for the following preview version:

| Version         | Patch release (YYMM) | CLI version         | Release notes |
|-----------------|---------------|---------------------|---------------|
| 1.2.x-preview   | 1.2.36 (2507) | [2.0.0b2 (preview)](https://github.com/Azure/azure-iot-ops-cli-extension/releases/tag/v2.0.0b2)   | [Release notes](https://github.com/Azure/azure-iot-operations/releases/tag/v1.2.36) |

> [!WARNING]
> Don't use preview versions in production environments.

To verify your current version, go to the overview page for your Azure IoT Operations instance in the Azure portal or use the Azure IoT Operations CLI [az iot ops instance show](/cli/azure/iot/ops#az-iot-ops-show) command.

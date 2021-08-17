---
title: Learn about connection options for Azure IoT device developers
description: Learn about commonly used device connection options and tools for Azure IoT device developers.
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: conceptual
ms.date: 02/11/2021
---

# Overview: Connection options for Azure IoT device developers
As a developer who works with devices, you have several options for connecting and managing Azure IoT devices. This article overviews the most commonly used options and tools to help you connect and manage  devices.

As you evaluate Azure IoT connection options for your devices, it's helpful to compare the following items:
- Azure IoT device application platforms
- Tools for connecting and managing devices

## Application platforms: IoT Central and IoT Hub
Azure IoT contains two services that are platforms for device-enabled cloud applications: Azure IoT Central, and Azure IoT Hub. You can use either one to host an IoT application and connect devices.
- [IoT Central](../iot-central/core/overview-iot-central.md) is designed to reduce the complexity and cost of working with IoT solutions. It's a software-as-a-service (SaaS) application that provides a complete platform for hosting IoT applications. You can use the IoT Central web UI to streamline the entire lifecycle of creating and managing IoT applications. The web UI simplifies the tasks of creating applications, and connecting and managing from a few up to millions of devices. IoT Central uses IoT Hub to create and manage applications, but keeps the details transparent to the user. In general, IoT Central provides reduced complexity and development effort, and simplified device management through the web UI.
- [IoT Hub](../iot-hub/about-iot-hub.md) acts as a central message hub for bi-directional communication between IoT applications and connected devices. It's a platform-as-a-service (PaaS) application that also provides a platform for hosting IoT applications. Like IoT Central, it can scale to support millions of devices. In general, IoT Hub offers greater control and customization over your application design, and more developer tool options for working with the service, at the cost of some increase in development and management complexity.

## Tools to connect and manage devices
After you select IoT Hub or IoT Central to host your IoT application, you have several options of developer tools. You can use these tools to connect to your selected IoT application platform, and to create and manage applications and devices. The following table summarizes common tool options. 

> [!NOTE]
> In addition to the following tools, you can programmatically create and manage IoT applications by using REST API's, Azure SDKs, or Azure Resource Manager templates. You can learn more in the [IoT Hub](../iot-hub/about-iot-hub.md) and [IoT Central](../iot-central/core/overview-iot-central.md) service documentation.

|Tool  |Supports IoT platform &nbsp; &nbsp; &nbsp; &nbsp; |Documentation  |Description  |
|---------|---------|---------|---------|
|Central web UI     | Central | [Central quickstart](../iot-central/core/quick-deploy-iot-central.md) | Browser-based portal for IoT Central. |
|Azure portal     | Hub, Central      | [Create an IoT hub with Azure portal](../iot-hub/iot-hub-create-through-portal.md), [Manage IoT Central from the Azure portal](../iot-central/core/howto-manage-iot-central-from-portal.md)| Browser-based portal for IoT Hub and devices. Also works with other Azure resources including IoT Central. |
|Azure IoT Explorer     | Hub | [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer#azure-iot-explorer-preview) | Cannot create IoT hubs. Connects to an existing IoT hub to manage devices. Often used with CLI or Portal.|
|Azure CLI     | Hub, Central          | [Create an IoT hub with CLI](../iot-hub/iot-hub-create-using-cli.md), [Manage IoT Central from Azure CLI](../iot-central/core/howto-manage-iot-central-from-cli.md) | Command-line interface for creating and managing IoT applications. |
|Azure PowerShell     | Hub, Central   | [Create an IoT hub with PowerShell](../iot-hub/iot-hub-create-using-powershell.md), [Manage IoT Central from Azure PowerShell](../iot-central/core/howto-manage-iot-central-from-powershell.md) | PowerShell interface for creating and managing IoT applications |
|Azure IoT Tools for VS Code  | Hub | [Create an IoT hub with Tools for VS Code](../iot-hub/iot-hub-create-use-iot-toolkit.md) | VS Code extension for IoT Hub applications. |

## Next steps
To learn more about your options for connecting devices to Azure IoT, explore the following quickstarts:
- IoT Central: [Create an Azure IoT Central application](../iot-central/core/quick-deploy-iot-central.md)
- IoT Hub: [Send telemetry from a device to an IoT hub and monitor it with the Azure CLI](../iot-hub/quickstart-send-telemetry-cli.md)
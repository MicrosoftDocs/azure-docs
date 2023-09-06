---
title: Azure IoT Hub extension for Visual Studio Code
titleSuffix: Azure IoT Hub
description: Reference documentation containing information about the Azure IoT Hub extension for Visual Studio Code.
author: kgremban

ms.service: iot-hub
services: iot-hub
ms.topic: reference
ms.date: 04/24/2023
ms.author: kgremban
ms.custom: [mvc, 'Role: Cloud Development']
#Customer intent: As a developer, I want to use Visual Studio Code to manage, develop, and monitor Azure IoT Hub resources. 
---

# Azure IoT Hub extension for Visual Studio Code

Visual Studio Code (VS Code) lets you add *extensions*, such as languages, debuggers, and tools, to your VS Code installation to support your development workflow. The [Azure IoT Hub extension for Visual Studio Code](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki) lets you add Azure IoT Hub support to your VS Code installation, so you can manage and interact with your IoT hubs, devices, and modules during development. The Azure IoT Hub extension is available from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/vscode).

[!INCLUDE [basic-partial](../../includes/iot-hub-basic-partial.md)]

## Install the extension

You can find and install the extension from either within [Visual Studio Code](#install-from-visual-studio-code) or the [Visual Studio Code Marketplace](#install-from-the-visual-studio-code-marketplace).

### Install from Visual Studio Code

To find and install the extension from within Visual Studio Code, perform the following steps.

1. In VS Code, select the **Extensions** view by either selecting the **Extensions** view icon from the view bar or selecting Ctrl+Shift+X.

    :::image type="content" source="media/reference-iot-hub-extension/iot-hub-vscode-extensions-view.png" alt-text="Screenshot showing the Extensions view icon and shortcut from Visual Studio Code.":::

1. Enter *Azure IoT Hub* in the search box to filter the Marketplace offerings. You should see the Azure IoT Hub extension in the list. Select the extension from the list to display the extension details page.
    
    :::image type="content" source="media/reference-iot-hub-extension/iot-hub-vscode-extension-list.png" alt-text="Screenshot showing the search bar and list in the Extensions view of Visual Studio Code.":::
    
1. Confirm that the unique identifier for the selected extension, displayed in the More Info section of the extension details page, is set to `vsciot-vscode.azure-iot-toolkit`. 
    
    :::image type="content" source="media/reference-iot-hub-extension/iot-hub-vscode-extension-identifier.png" alt-text="Screenshot showing the extension identifier for the Azure IoT Hub extension from the extension details page.":::

1. Select the **Install** button for the selected extension, either from the list or the extension details page, to install the extension.

### Install from the Visual Studio Code Marketplace

To find and install the extension from the VS Code Marketplace, perform the following steps.

1. In your browser, navigate to the [Azure IoT Hub](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) extension page in the VS Code Marketplace.

1. Confirm that the unique identifier for the selected extension, displayed in the More Info section of the Azure IoT Hub extension page, is set to `vsciot-vscode.azure-iot-toolkit`.

1. Select the **Install** button to start Visual Studio Code, if it isn't already running, and display the extension details page for the extension in VS Code.

1. In VS Code, select the **Install** button from the extension details page to install the extension.

Installing the Azure IoT Hub extension for Visual Studio Code also installs the [Azure Account extension for Visual Studio Code](https://github.com/microsoft/vscode-azure-account#readme), which provides a single Azure sign in and subscription filtering experience for all other Azure extensions. The Azure Account extension also makes the Azure Cloud Shell service available in VS Code's integrated terminal.

> [!NOTE]
> The Azure IoT Hub extension depends on the Azure Account extension for connectivity. You cannot uninstall the Azure Account extension without uninstalling the Azure IoT Hub extension.

## Sign in to your Azure account

Before the extension can interact with Azure IoT Hub, you must sign in to your Azure account from Visual Studio Code. You can use the Azure Account extension to:

- Create an Azure account
- Sign in and out of your Azure account
- Filter the Azure subscriptions available to the Azure IoT Hub extension from your Azure account
- Upload a file to your Azure Cloud Shell storage account

Follow these steps to sign into Azure and select your IoT hub from your Azure subscription:

1. In the **Explorer** view of VS Code, expand the **Azure IoT Hub** section in the side bar.

1. Select the ellipsis (…) button of the **Azure IoT Hub** section to display the action menu, and then select **Select IoT Hub** from the action menu.

1. If you're not signed into Azure, a pop-up notification is shown in the bottom right corner to let you sign in to Azure. Select **Sign In** and follow the instructions to sign into Azure.

1. Select your Azure subscription from the **Select Subscription** dropdown list.

1. Select your IoT hub from the **Select IoT Hub** dropdown list.

1. The devices for your IoT hub are retrieved from IoT Hub and shown under the **Devices** node in the **Azure IoT Hub** section of the side bar.

   > [!NOTE]
   > You can also use a connection string to access your IoT hub, by selecting **Set IoT Hub Connection String** from the action menu and entering the **iothubowner** policy connection string for your IoT hub in the **IoT Hub Connection String** input box. 

Once signed in, you can interact with your hubs, devices, and modules from either the Command Palette or the action menu in the Explorer view of VS Code. For more information about interacting with the extension, including frequently asked questions and interaction examples, see [the wiki](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki) for the Azure IoT Hub extension.

## Manage your IoT hubs

You can perform the following IoT hub management tasks from the extension:

- [Create a new IoT hub](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Create-IoT-Hub) and select it as the current IoT hub for your extension
- [Select an existing IoT hub](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Select-IoT-Hub) as the current IoT hub for your extension
- [List existing built-in and custom endpoints](https://github.com/microsoft/vscode-azure-iot-toolkit/wiki/List-Built-in-and-Custom-Endpoints) for the current IoT hub by selecting the **Refresh** button for the Azure IoT Hub section in the Explorer view
- [Copy the connection string for the current IoT hub](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Copy-IoT-Hub-Connection-String) to your clipboard
- [Generate an SAS token for the current IoT hub](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Generate-SAS-Token-for-IoT-Hub) and copy it to your clipboard

## Manage your devices

You can perform the following device management tasks for the current IoT hub from the extension:

- [Create a new IoT Hub device](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Create-IoT-Device)
- [Create a new IoT Edge device](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Create-Edge-Device)
- [List existing devices](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/List-Devices) either by selecting the **Refresh** button for the current IoT hub in the Explorer view or by specifying the **Azure IoT Hub: List Devices** command in the Command Palette
- [Get information about the selected device](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Get-Device-Info) as a JSON document, shown in the Output panel of VS Code
- [Edit the device twin](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Edit-Device-Twin) for the selected device, as a JSON document in the editor of VS Code
- [Copy the connection string for the selected device](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Copy-Device-Connection-String) to your clipboard
- [Generate an SAS token for the selected device](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Generate-SAS-Token-for-Device) and copy it to your clipboard
- [Invoke a direct method for the selected device](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Invoke-Device-Direct-Method) and display the results in the Output panel of VS Code
- [Delete the selected device](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Delete-Device) from the current IoT hub

> [!TIP]
> You can enable a lock on your IoT resources to prevent them being accidentally or maliciously deleted. For more information about resource locks in Azure, see [Lock your resources to protect your infrastructure](../azure-resource-manager/management/lock-resources.md?tabs=json).

## Manage your modules

You can perform the following module management tasks for the selected device in the current IoT hub:

- [Create a new module](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Create-Module)
- [List existing modules](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/List-Devices) by selecting the **Refresh** button for the current device in the Explorer view of VS Code
- [Get information about the selected module](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Get-Module-Info) as a JSON document, shown in the Output panel of VS Code
- [Edit the module twin](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Edit-Module-Twin) for the selected module, as a JSON document in the editor of VS Code
- [Copy the connection string for the selected module](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Copy-Module-Connection-String) to your clipboard
- [Invoke a direct method for the selected module](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Invoke-Module-Direct-Method) and display the results in the Output panel of VS Code
- [Delete the selected module](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Delete-Module) from the current device

> [!NOTE]
> Azure IoT Edge system modules are read-only and cannot be modified. Changes can be submitted by deploying a configuration for the related IoT Edge device.

## Interact with IoT Hub

You can perform the following interactive tasks for the resources in your current IoT hub:

- [Generate code](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Generate-Code) in a selected programming language to perform a common task, such as sending a device-to-cloud message, for your selected resource
- [Send a device-to-cloud (D2C) message to IoT Hub](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Send-D2C-Message-to-IoT-Hub) for your selected device
- Start and stop [monitoring the built-in event endpoint for the current IoT hub](https://github.com/microsoft/vscode-azure-iot-toolkit/wiki/Monitor-IoT-Hub-Built-in-Event-Endpoint) and display the results in the Output panel of VS Code
- [Send a cloud-to-device (C2D) message to the selected device](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Send-C2D-Message-to-Device) for your current IoT hub and display the results in the Output panel of VS Code
- Start and stop [monitoring C2D messages to the selected device](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Monitor-IoT-Hub-C2D-message) for your current IoT hub and display the results in the Output panel of VS Code
- [Update distributed tracing settings for devices](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Update-Distributed-Tracing)
- Start and stop [monitoring custom Event Hubs endpoints for the current IoT hub](https://github.com/microsoft/vscode-azure-iot-toolkit/wiki/Monitor-Custom-Event-Hub-Endpoint) and display the results in the Output panel of VS Code

## Interact with IoT Edge

You can perform the following interactive tasks for the [Azure IoT Edge](../iot-edge/about-iot-edge.md) devices in your current IoT hub:

- [Create a deployment for your selected IoT Edge device](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Create-Deployment-for-Single-Device) and display the results in the Output panel of VS Code
- If you have an appropriate deployment manifest, [create a deployment at scale for multiple IoT Edge devices](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Create-Deployment-at-Scale) and display the results in the Output panel of VS Code
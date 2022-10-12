---
title: Create an Azure IoT Hub using Azure IoT Tools for VS Code | Microsoft Docs
description: Learn how to use the Azure IoT tools for Visual Studio Code to create an Azure IoT hub in a resource group. 
author: formulahendry
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/04/2019
ms.author: junhan
---

# Create an IoT hub using the Azure IoT Tools for Visual Studio Code

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

This article shows you how to use the [Azure IoT Tools for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) to create an Azure IoT hub. You can create one without an existing IoT project or create one from an existing IoT project.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)

- [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) installed for Visual Studio Code

- An Azure resource group: [create a resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal#create-resource-groups) in the Azure portal

## Create an IoT hub without an IoT Project

The following steps show how to create an IoT Hub without an IoT Project in Visual Studio Code (VS Code).

1. In VS Code, open the **Explorer** view.

2. At the bottom of the Explorer, expand the **Azure IoT Hub** section. 

   :::image type="content" source="./media/iot-hub-create-use-iot-toolkit/azure-iot-hub-devices.png" alt-text="A screenshot that shows the location of the Azure IoT Hub section in VS Code." lightbox="./media/iot-hub-create-use-iot-toolkit/azure-iot-hub-devices.png":::

3. Select **Create IoT Hub** from the list in the **Azure IoT Hub** section. 

   :::image type="content" source="./media/iot-hub-create-use-iot-toolkit/create-iot-hub.png" alt-text="A screenshot that shows the location of the Create IoT Hub list item in VS Code." lightbox="./media/iot-hub-create-use-iot-toolkit/create-iot-hub.png":::

5. A pop-up will show in the bottom-right corner to let you sign in to Azure for the first time, if you're not signed in already.

6. From the command palette at the top of VS Code, select your Azure subscription. 

7. Select your resource group.

8. Select a location.

9. Select a pricing tier.

10. Enter a globally unique name for your IoT hub, then press **Enter**.

11. Wait a few minutes until the IoT hub is created. You'll see a confirmation in the output console.

## Create an IoT hub and device in an existing IoT project

The following steps show how to create an IoT Hub and register a device to the hub within an existing IoT project in Visual Studio (VS) Code.

This method allows you to provision in VS Code without leaving your development environment.

1. In the new opened project window, click `F1` to open the command palette, type and select **Azure IoT Device Workbench: Provision Azure Services...**.

   :::image type="content" source="media/iot-hub-create-use-iot-toolkit/provision.png" alt-text="A screenshot that shows how to open the command palette in VS Code." lightbox="media/iot-hub-create-use-iot-toolkit/provision.png":::

    > [!NOTE]
    > If you have not signed in Azure. Follow the pop-up notification for signing in.

1. Select the subscription you want to use.

   :::image type="content" source="media/iot-hub-create-use-iot-toolkit/select-subscription.png" alt-text="A screenshot that shows how to choose your Azure subscription in VS Code." lightbox="media/iot-hub-create-use-iot-toolkit/select-subscription.png":::

1. Select an existing resource group or create a new [resource group](../azure-resource-manager/management/overview.md#terminology).

   :::image type="content" source="media/iot-hub-create-use-iot-toolkit/select-resource-group.png" alt-text="A screenshot that shows how to choose a resource group or create a new one in VS Code." lightbox="media/iot-hub-create-use-iot-toolkit/select-resource-group.png":::

1. In the resource group you specified, follow the prompts to select an existing IoT Hub or create a new Azure IoT Hub.

   :::image type="content" source="media/iot-hub-create-use-iot-toolkit/iot-hub-provision.png" alt-text="A screenshot that shows the first prompt in choosing an existing IoT Hub in VS Code." lightbox="media/iot-hub-create-use-iot-toolkit/iot-hub-provision.png":::

   :::image type="content" source="media/iot-hub-create-use-iot-toolkit/select-iot-hub.png" alt-text="A screenshot that shows the second prompt in choosing an existing IoT Hub in VS Code." lightbox="media/iot-hub-create-use-iot-toolkit/select-iot-hub.png":::

   :::image type="content" source="media/iot-hub-create-use-iot-toolkit/iot-hub-selected.png" alt-text="A screenshot that shows the third prompt in choosing an existing IoT Hub in VS Code." lightbox="media/iot-hub-create-use-iot-toolkit/iot-hub-selected.png":::

1. In the output window, you'll see the Azure IoT Hub provisioned.

   :::image type="content" source="media/iot-hub-create-use-iot-toolkit/iot-hub-provisioned.png" alt-text="A screenshot that shows the output window in VS Code." lightbox="media/iot-hub-create-use-iot-toolkit/iot-hub-provisioned.png":::

1. Select or create a new IoT Hub Device in the Azure IoT Hub you provisioned.

   :::image type="content" source="media/iot-hub-create-use-iot-toolkit/iot-device-provision.png" alt-text="A screenshot that shows the fourth prompt in choosing an existing IoT Hub in VS Code." lightbox="media/iot-hub-create-use-iot-toolkit/iot-device-provision.png":::

   :::image type="content" source="media/iot-hub-create-use-iot-toolkit/select-iot-device.png" alt-text="A screenshot that shows an example of an existing IoT Hub in VS Code." lightbox="media/iot-hub-create-use-iot-toolkit/select-iot-device.png":::

1. Now you have an Azure IoT Hub provisioned and a device created in it. The device connection string will be saved in VS Code.

   :::image type="content" source="media/iot-hub-create-use-iot-toolkit/provision-done.png" alt-text="A screenshot that shows IoT Hub details in the output window in VS Code." lightbox="media/iot-hub-create-use-iot-toolkit/provision-done.png":::

> [!TIP]
> To delete a device from your IoT hub, use the `Azure IoT Hub: Delete Device` option from the Command Palette. There is no option to delete your IoT hub in Visual Studio Code, however you can [delete your hub in the Azure portal](iot-hub-create-through-portal.md#delete-the-iot-hub).

## Next steps

Now that you've deployed an IoT hub using the Azure IoT Tools for Visual Studio Code, explore these articles:

* [Use the Azure IoT Tools for Visual Studio Code to send and receive messages between your device and an IoT Hub](iot-hub-vscode-iot-toolkit-cloud-device-messaging.md).

* [Use the Azure IoT Tools for Visual Studio Code for Azure IoT Hub device management](iot-hub-device-management-iot-toolkit.md)

* [See the Azure IoT Hub for VS Code wiki page](https://github.com/microsoft/vscode-azure-iot-toolkit/wiki).

---
title: Create an Azure IoT hub using the Azure IoT Hub extension for Visual Studio Code
description: Learn how to use the Azure IoT Hub extension for Visual Studio Code to create an Azure IoT hub in a resource group. 
author: formulahendry

ms.author: junhan
ms.service: iot-hub
ms.topic: how-to
ms.date: 01/04/2019
---

# Create an IoT hub using the Azure IoT Hub extension for Visual Studio Code

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

This article shows you how to use the [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) to create an Azure IoT hub.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)

- [Azure IoT Hub extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) installed for Visual Studio Code

- An Azure subscription: [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin

- An Azure resource group: [create a resource group](../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups) in the Azure portal

## Create an IoT hub

The following steps show how to create an IoT hub in Visual Studio Code (VS Code):

1. In VS Code, open the **Explorer** view.

2. At the bottom of the Explorer, expand the **Azure IoT Hub** section.

   :::image type="content" source="./media/iot-hub-create-use-iot-toolkit/azure-iot-hub-devices.png" alt-text="A screenshot that shows the location of the Azure IoT Hub section in Visual Studio Code." lightbox="./media/iot-hub-create-use-iot-toolkit/azure-iot-hub-devices.png":::

3. Select **Create IoT Hub** from the list in the **Azure IoT Hub** section.

   :::image type="content" source="./media/iot-hub-create-use-iot-toolkit/create-iot-hub.png" alt-text="A screenshot that shows the location of the Create IoT Hub list item in Visual Studio Code." lightbox="./media/iot-hub-create-use-iot-toolkit/create-iot-hub.png":::

4. If you're not signed into Azure, a pop-up notification is shown in the bottom right corner to let you sign in to Azure. Select **Sign In** and follow the instructions to sign into Azure.

5. From the command palette at the top of VS Code, select your Azure subscription.

6. Select your resource group.

7. Select a region.

8. Select a pricing tier.

9. Enter a globally unique name for your IoT hub, and then select the Enter key.

10. Wait a few minutes until the IoT hub is created and confirmation is displayed in the **Output** panel.

> [!TIP]
> There is no option to delete your IoT hub in Visual Studio Code, however you can [delete your hub in the Azure portal](iot-hub-create-through-portal.md#delete-an-iot-hub).

## Next steps

Now that you've deployed an IoT hub using the Azure IoT Hub extension for Visual Studio Code, explore these articles:

- [Use the Azure IoT Hub extension for Visual Studio Code to send and receive messages between your device and an IoT hub](iot-hub-vscode-iot-toolkit-cloud-device-messaging.md).

- [Use the Azure IoT Hub extension for Visual Studio Code for Azure IoT Hub device management](iot-hub-device-management-iot-toolkit.md)

- [See the Azure IoT Hub extension for Visual Studio Code wiki page](https://github.com/microsoft/vscode-azure-iot-toolkit/wiki).

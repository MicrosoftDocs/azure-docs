---
title: Install and use Azure IoT explorer | Microsoft Docs'
description: Install the Azure IoT explorer tool and use it to interact with the Plug and Play devices connected to my IoT hub.
author: miagdp
ms.author: miag
ms.date: 07/02/2019
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to use a GUI tool to interact with Plug and Play devices connected to an IoT hub to test and verify their behavior.
---

# Install and use Azure IoT explorer

The Azure IoT explorer is a graphical tool for interacting with and testing your Plug and Play devices. After installing the tool on your local machine, you can use it to connect to a device. You can use the tool to view the telemetry the device is sending, work with device properties, and call commands.

This article shows you how to:

- Install and configure the Azure IoT explorer tool.
- Use the tool to interact with and test your devices.

## Prerequisites

To use the Azure IoT explorer tool, you need:

- An Azure IoT hub. There are many ways to add an IoT hub to your Azure subscription, such as [Create an IoT hub using the Azure CLI](../iot-hub/iot-hub-create-using-cli.md). You need the IoT hub's connection string to run the Azure IoT explorer tool.
- A device registered in your IoT hub. You can use the following Azure CLI command to register a device, be sure to replace the `{YourIoTHubName}` and `{YourDeviceID}` placeholders with your values:

    ```azurecli-interactive
    az iot hub device-identity create --hub-name {YourIoTHubName} --device-id {YourDeviceID}
    ```

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Install Azure IoT explorer

Go to [Azure IoT explorer releases](https://github.com/Azure/azure-iot-explorer/releases) and expand the list of assets for the most recent release. The following instructions assume that the most recent release is 0.8.4, if there's a more recent version use that. Download and run the appropriate file for your operating, for example:

- For Windows, download and run `Azure.IoT.Explorer.Setup.0.8.4.exe`. IF you see a **Windows Security Alert** from **Windows Firewall**, select **Allow Access**.
- For iOS, download and run `Azure.IoT.Explorer.Setup.0.8.4.dmg`.

## Use Azure IoT explorer

In this article, you use Azure IoT explorer to interact with a simulated device. Follow [these instructions]() to run the simulated device.

### Connect to a device

The first time you run Azure IoT explorer, you're prompted for your IoT hub's connection string. After you add the connection string, select **Connect**. You can use the tool's settings to switch to another IoT hub by updating the connection string.

The model definition for a Plug and Play device is stored in either the public repository, an organizational repository, or on the physical device. By default, the tool looks for your model definition in the public model repository. To use a model definition from another location, add it as a definition source in the tool settings:

1. Go to **Settings**.
1. Select **New** and choose the source to add.

You can rank the model definition sources by changing the order of the list. If there's a conflict, definition sources with higher rankings override sources with lower rankings.

To remove a source, select **X** to delete it.

### Overview page

#### Device overview

After the tool connects to your IoT hub, it displays an overview page that lists of all the device identities registered with your Azure IoT Hub. Select a device to view more detail.

#### Device management

- To register a new device with your hub, select **Add**. Enter a device ID. Use the default settings to autogenerate authentication keys and enable the connection to your hub.
- To delete a device identity, select **Delete**. Review the device details before you complete this action to be sure you're deleting the right device identity.
- You can use the [IoT Hub query language](../iot-hub/iot-hub-devguide-query-language.md) to find devices in the IoT hub's registry. The tool also supports querying by `capabilityID` and `interfaceID`:

    ![Image](img/.png)

## Interact with a device

Double-click a device on the overview page to view the next level of detail. There are two sections: **Device** and **Digital Twin**.

### Device

This section includes the **Device Identity**, **Telemetry**, and **Device Twin** tabs:

- You can view and update the device identity information on the **Device identity** tab.
- If a device is connected and actively sending data, you can view the telemetry on the **Telemetry** tab.
- You can access the device twin information on the **Device Twin** tab.

### Digital twin

You can use the tool to a view digital twin instance of the device. For a Plug and Play device, all the interfaces associated with the device capability model are displayed here. Select an interface to expand its corresponding [Plug and Play primitives](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL)).

#### Properties

You can view the read-only properties defined in an interface on the **Properties** page. You can update the writeable properties defined in an interface on the **Writeable properties** page:

- Go to **Writable properties** page.
- Click the property you'd like to update.
- Enter the new value for the property.
- Preview the payload to be sent to the device.
- Submit the change.

After you submit a change, you can track the update status: **synching**, **success**, or **error**. When the synching is complete, you see the new value of your property in the **Reported Property** column. If you navigate to other pages before the synching completes, the tool still notifies you when the update is complete. You can also use the tool's notification center to see the notification history:
![Image](img/.png)

#### Commands

To send a command to a device, go to the **Commands** page:

1. In the list of commands, expand the command you want to trigger.
2. Enter any required values for the command.
3. Preview the payload to be sent to the device.
4. Submit the command.

#### Telemetry

To view the telemetry for the selected interface, go to its **Telemetry** page:

![Image](img/.png)

## Clean up resources

If you plan to continue with other articles, you can keep the Azure resources you created. Otherwise you can delete the resources you've created for this article to avoid additional charges.

1. Log into the [Azure portal](https://portal.azure.com).
1. Go to Resource Groups and type your resource group name that contains your hub in ``Filter by name`` textbox.
1. To the right of your resource group, click `...` and select ``Delete resource group``.

## Next steps

In this how-to article, you've learned how to install and use Azure IoT explorer to interact with your Plug and Play devices. To learn about the Plug and Play CLI utilities, continue to the next article.

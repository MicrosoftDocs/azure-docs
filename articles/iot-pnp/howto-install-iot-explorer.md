---
title: Install and use Azure IoT explorer | Microsoft Docs
description: Install the Azure IoT explorer tool and use it to interact with the IoT Plug and Play Preview devices connected to my IoT hub.
author: miagdp
ms.author: miag
ms.date: 12/27/2019
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a solution developer, I want to use a GUI tool to interact with IoT Plug and Play devices connected to an IoT hub to test and verify their behavior.
---

# Install and use Azure IoT explorer

The Azure IoT explorer is a graphical tool for interacting with and testing your IoT Plug and Play Preview devices. After installing the tool on your local machine, you can use it to connect to a device. You can use the tool to view the telemetry the device is sending, work with device properties, and call commands.

This article shows you how to:

- Install and configure the Azure IoT explorer tool.
- Use the tool to interact with and test your devices.

## Prerequisites

To use the Azure IoT explorer tool, you need:

- An Azure IoT hub. There are many ways to add an IoT hub to your Azure subscription, such as [Creating an IoT hub by using the Azure CLI](../iot-hub/iot-hub-create-using-cli.md). You need the IoT hub connection string to run the Azure IoT explorer tool. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- A device registered in your IoT hub. You can use the following Azure CLI command to register a device. Be sure to replace the `{YourIoTHubName}` and `{YourDeviceID}` placeholders with your values:

    ```azurecli-interactive
    az iot hub device-identity create --hub-name {YourIoTHubName} --device-id {YourDeviceID}
    ```

## Install Azure IoT explorer

Go to [Azure IoT explorer releases](https://github.com/Azure/azure-iot-explorer/releases) and expand the list of assets for the most recent release. Download and install the most recent version of the application.

## Use Azure IoT explorer

For a device, you can either connect your own device, or use one of our sample simulated devices. Follow [these instructions](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview/iothub_client/samples) to run the simulated device sample.

### Connect to your hub

The first time you run Azure IoT explorer, you're prompted for your IoT hub's connection string. After you add the connection string, select **Connect**. You can use the tool's settings to switch to another IoT hub by updating the connection string.

The model definition for an IoT Plug and Play device is stored in either the public repository, a company repository, or your connected device. By default, the tool looks for your model definition in the public model repository and your connected device. You can add and remove sources, or configure the priority of the sources in **Settings**:

To add a source:

1. Go to **Settings**.
1. Select **New** and choose your source.
1. If you're adding your company model repository, provide the connection string.

To remove a source:

1. Go to **Settings**.
1. Find the source you want to remove.
1. Select **X** to remove it. You can't remove the public model repository because the common interface definitions come from this repository.

Change the source priorities:

You can drag and drop one of the model definition sources to a different ranking in the list. If there's a conflict, definition sources with higher rankings override sources with lower rankings.

### View devices

After the tool connects to your IoT hub, it displays the **Devices** list page that lists the device identities registered with your IoT hub. You can expand any entry in the list to see more information.

On the **Devices** list page you can:

- Select **Add** to register a new device with your hub. Then enter a device ID. Use the default settings to automatically generate authentication keys and enable the connection to your hub.
- Select a device and then select **Delete** to delete a device identity. Review the device details before you complete this action to be sure you're deleting the right device identity.
- Query by `capabilityID` and `interfaceID`. Add either your `capabilityID` or `interfaceID` as a parameter to query your devices.

## Interact with a device

On the **Devices** list page, select a value in the **Device ID** column to view the detail page for the registered device. For each device  there are two sections: **Device** and **Digital Twin**.

### Device

This section includes the **Device Identity**,  **Device Twin**, **Telemetry**, **Direct method** and **Cloud-to-device message** tabs.

- You can view and update the [device identity](../iot-hub/iot-hub-devguide-identity-registry.md) information on the **Device identity** tab.
- You can access the [device twin](../iot-hub/iot-hub-devguide-device-twins.md) information on the **Device Twin** tab.
- If a device is connected and actively sending data, you can view the [telemetry](../iot-hub/iot-hub-devguide-messages-read-builtin.md) on the **Telemetry** tab.
- You can call a [direct method](../iot-hub/iot-hub-devguide-direct-methods.md) on the device on the **Direct method** tab.
- You can send a [cloud-to-device message](../iot-hub/iot-hub-devguide-messages-c2d.md) on the **Cloud-to-device messages** tab.

### Digital twin

You can use the tool to a view digital twin instance of the device. For an IoT Plug and Play device, all the interfaces associated with the device capability model are displayed in this section of the tool. Select an interface to expand its corresponding [IoT Plug and Play primitives](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL).

### Interface

On the **Interface** page, you can view the JSON definition of the interface.

#### Properties

You can view the read-only properties defined in an interface on the **Non-writeable properties** page. You can update the writeable properties defined in an interface on the **Writeable properties** page:

1. Go to the **Writable properties** page.
1. Click the property you'd like to update.
1. Enter the new value for the property.
1. Preview the payload to be sent to the device.
1. Submit the change.

After you submit a change, you can track the update status: **synching**, **success**, or **error**. When the synching is complete, you see the new value of your property in the **Reported Property** column. If you navigate to other pages before the synching completes, the tool still notifies you when the update is complete. You can also use the tool's notification center to see the notification history.

#### Commands

To send a command to a device, go to the **Commands** page:

1. In the list of commands, expand the command you want to trigger.
1. Enter any required values for the command.
1. Preview the payload to be sent to the device.
1. Submit the command.

#### Telemetry

To view the telemetry for the selected interface, go to its **Telemetry** page.

## Next steps

In this how-to article, you learned how to install and use Azure IoT explorer to interact with your IoT Plug and Play devices. A suggested next step is to learn how to [Install and use Azure CLI extension](./howto-install-pnp-cli.md).

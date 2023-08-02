---
ms.topic: include
ms.date: 1/31/2023
author: PatAltimore
ms.author: patricka
ms.service: iot-edge
services: iot-edge
---

## Register your device

You can use the **Azure portal**, **Visual Studio Code**, or **Azure CLI** to register your device, depending on your preference.

# [Portal](#tab/azure-portal)

In your IoT hub in the Azure portal, IoT Edge devices are created and managed separately from IoT devices that are not edge enabled.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.

1. In the left pane, select **Devices** from the menu, then select **Add Device**.

1. On the **Create a device** page, provide the following information:

   * Create a descriptive Device ID, for example `my-edge-device-1` (all lowercase). Copy this Device ID, as you'll use it later.
   * Check the **IoT Edge Device** checkbox.
   * Select **Symmetric key** as the authentication type.
   * Use the default settings to auto-generate authentication keys, which connect the new device to your hub.

1. Select **Save**.

You should see your new device listed in your IoT hub.

# [Visual Studio Code](#tab/visual-studio-code)

### Sign in to Azure

You can use the Azure IoT extensions for Visual Studio Code to perform operations with your IoT hub. Make sure you have installed the Azure IoT extension prerequisites. 

Once Azure IoT Edge and Azure IoT Hub extensions are installed, you notice an Azure icon gets added to the left icon menu. You can sign in to your Azure account through Visual Studio Code by selecting the Azure icon and then select **Sign in to Azure**. 

### Register a new device with Visual Studio Code

Registering a new device is akin to creating an IoT Edge device in the Azure portal. This virtual device is one of the *twins*, whereas the real world device is the other twin. Visual Studio Code can set this up for you through the following steps.

1. In the Visual Studio Code Explorer menu, expand the **Azure IoT Hub** section.
1. Click on the **...** in the **Azure IoT Hub** section header. If you don't see the ellipsis, click on or hover over the header.
1. Select **Create IoT Edge Device**.
1. In the text box that opens, give your device an ID, for example `my-edge-device-1` (all lowercase), then press enter.

In the output console of Visual Studio Code, you see the result of the command: a JSON printout. The device information includes the **deviceId** that you provided and generates a **connectionString** that you can use to connect your physical device to your IoT hub. The output console also shows your keys and other device identifying information.

You can now see your device listed under the **Azure IoT Hub** > **Devices** section of the Explorer menu.

> [!NOTE]
> If your device is not listed, you may need to choose your IoT Hub from the link **Select IoT Hub** provided under **Azure IoT Hub** and then follow the prompts. The prompts will ask you to choose your subscription first and then your IoT Hub. This process lets Visual Studio Code know about your IoT Hub (and all devices in it). Refresh Visual Studio Code and your device should show.

# [Azure CLI](#tab/azure-cli)

Use the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity) command to create a new device identity in your IoT hub. Replace `device_id_here` with your own new and unique device ID, for example `my-edge-device-1` (all lowercase). Replace `hub_name_here` with your existing IoT hub.

This command includes three parameters:

* `--device-id` or `-d`: Provide a descriptive name that's unique within your IoT hub.
* `--hub-name` or `-n`: Provide the name of your IoT hub.
* `--edge-enabled` or `--ee`: Declare that the device is an IoT Edge device.

   ```azurecli
   az iot hub device-identity create --device-id device_id_here --hub-name hub_name_here --edge-enabled
   ```

If your CLI says **The command requires the extension azure-iot. Do you want to install it now?**, then type `Y` and press `Enter` to initiate the download to create your device.

---

Now that you have a device registered in IoT Hub, you can retrieve provisioning information used to complete the installation and provisioning of the [IoT Edge runtime](../iot-edge-runtime.md) in the next step.

## View registered devices and retrieve provisioning information

Devices that use symmetric key authentication need their connection strings to complete installation and provisioning of the IoT Edge runtime. The connection string gets generated for your IoT Edge device when you create the device. For Visual Studio Code and Azure CLI, the connection string is in the JSON output. If you use the Azure portal to create your device, you can find the connection string from the device itself. When you select your device in your IoT hub, it's listed as `Primary connection string` on the device page.

# [Portal](#tab/azure-portal)

The edge-enabled devices that connect to your IoT hub are listed on the **Devices** page of your IoT hub. If you have multiple devices, you can filter the list by selecting the type **Iot Edge Devices**, then select **Apply**. 

When you're ready to set up your device, you need the connection string that links your physical device with its identity in the IoT hub. Devices that authenticate with symmetric keys have their connection strings available to copy in the portal. To find your connection string in the portal:

1. From the **Devices** page, select the IoT Edge device ID from the list.
2. Copy the value of either **Primary Connection String** or **Secondary Connection String**. Either key will work.

# [Visual Studio Code](#tab/visual-studio-code)

All the devices that connect to your IoT hub are listed in the **Azure IoT Hub** section of the Visual Studio Code Explorer. IoT Edge devices are distinguishable from non-Edge devices because they have a different icon and you see the **$edgeAgent** and **$edgeHub** modules are deployed to each IoT Edge device.

When you're ready to set up your device, you need the connection string that links your physical device with its identity in the IoT hub. Here's how to get your connection string from Visual Studio Code.

1. Right-click on the ID (name) of your device in the **Azure IoT Hub** section.
1. Select **Copy Device Connection String**.

   The connection string is copied to your clipboard.

You can also select **Get Device Info** from the right-click menu to see all the device info, including the connection string, in the output window.

# [Azure CLI](#tab/azure-cli)

To see all devices in your IoT hub, use the [az iot hub device-identity list](/cli/azure/iot/hub/device-identity) command. Replace `hub_name_here` with your own IoT hub name.

   ```azurecli
   az iot hub device-identity list --hub-name hub_name_here
   ```

Any device that is registered as an IoT Edge device will have the property **capabilities.iotEdge** set to **true**. You see a lot of other metadata as JSON output as well, including your device IDs.

When you're ready to set up your device, you need its connection string that links your physical device with its identity in the IoT hub. Use the following [az iot hub device-identity connection-string show](/cli/azure/iot/hub/device-identity/connection-string) command to return the connection string for a single device. Replace `[device_id]` and `[hub_name]` with your own values. The value for the `device-identity` parameter is case-sensitive.

   ```azurecli
   az iot hub device-identity connection-string show --device-id [device_id] --hub-name [hub_name]
   ```

You should see JSON output in the console, similar to the following:

```json
{
  "connectionString": "HostName=my-iot-hub.azure-devices.net;DeviceId=my-edge-device-1;SharedAccessKey=saQ52bt6BBUlRfusqWuxPMAx4ysQwWEb5+1eidwzHPY="
}
```

>[!TIP]
>The `connection-string show` command was introduced in version 0.9.8 of the Azure IoT extension, replacing the deprecated `show-connection-string` command. If you get an error running this command, make sure your extension version is updated to 0.9.8 or later. For more information and the latest updates, see [Microsoft Azure IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension).

When copying the connection string to use on a device, don't include the quotation marks around the connection string.

---

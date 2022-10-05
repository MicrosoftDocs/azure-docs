---
ms.topic: include
ms.date: 10/29/2021
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

   * Create a descriptive device ID. Make a note of this device ID, as you'll use it later.
   * Check the **IoT Edge Device** checkbox.
   * Select **X.509 Self-Signed** as the authentication type.
   * Provide the primary and secondary identity certificate thumbprints. Thumbprint values are 40-hex characters for SHA-1 hashes or 64-hex characters for SHA-256 hashes.

1. Select **Save**.

# [Visual Studio Code](#tab/visual-studio-code)

Currently, the Azure IoT extension for Visual Studio Code doesn't support device registration with X.509 certificates.

# [Azure CLI](#tab/azure-cli)

Use the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity) command to create a new device identity in your IoT hub. For example:

   ```azurecli
   az iot hub device-identity create --device-id device_id_here --hub-name hub_name_here --edge-enabled --auth-method x509_thumbprint --primary-thumbprint primary_SHA_thumbprint_here --secondary-thumbprint secdonary_SHA_thumbprint_here
   ```

This command includes several parameters:

* `--device-id` or `-d`: Provide a descriptive name that's unique to your IoT hub. Make a note of this device ID, as you'll use it in the next section.
* `hub-name` or `-n`: Provide the name of your IoT hub.
* `--edge-enabled` or `--ee`: Declare that the device is an IoT Edge device.
* `--auth-method` or `--am`: Declare the authorization type the device is going to use. In this case, we're using X.509 certificate thumbprints.
* `--primary-thumbprint` or `--ptp`: Provide an X.509 certificate thumbprint to use as a primary key.
* `--secondary-thumbprint` or `--stp`: Provide an X.509 certificate thumbprint to use as a secondary key.

---

Now that you have a device registered in IoT Hub, retrieve the information that you use to complete installation and provisioning of the IoT Edge runtime.

## View registered devices and retrieve provisioning information

Devices that use X.509 certificate authentication need their IoT hub name, their device name, and their certificate files to complete installation and provisioning of the IoT Edge runtime.

# [Portal](#tab/azure-portal)

The edge-enabled devices that connect to your IoT hub are listed on the **Devices** page. You can filter the list by type *Iot Edge Device*. 

:::image type="content" source="./media/iot-edge-register-device/portal-view-devices.png" alt-text="Screenshot of how to view all IoT Edge devices in your IoT hub.":::

# [Visual Studio Code](#tab/visual-studio-code)

While there is no support for device registration with X.509 certificates through Visual Studio Code, you can still view your IoT Edge devices if you need to.

All the devices that connect to your IoT hub are listed in the **Azure IoT Hub** section of the Visual Studio Code Explorer. IoT Edge devices are distinguishable from non-Edge devices with a different icon, and the fact that the **$edgeAgent** and **$edgeHub** modules are deployed to each IoT Edge device.

![Use VS Code to view all IoT Edge devices in your IoT hub](./media/iot-edge-register-device-x509/view-devices.png)

# [Azure CLI](#tab/azure-cli)

Use the [az iot hub device-identity list](/cli/azure/iot/hub/device-identity) command to view all devices in your IoT hub. For example:

   ```azurecli
   az iot hub device-identity list --hub-name hub_name_here
   ```

Any device that is registered as an IoT Edge device will have the property **capabilities.iotEdge** set to **true**.

---

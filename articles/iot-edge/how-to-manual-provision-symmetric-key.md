---
title: Provision an Azure IoT Edge device | Microsoft Docs
description: After installation, provision an IoT Edge device with its cloud identity and authenticate to IoT Hub
author: kgremban
manager: philmea
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 09/29/2020
ms.author: kgremban
---

# Set up an Azure IoT Edge device with symmetric key authentication

This article provides the steps to register a new IoT Edge device in IoT Hub and configure the device to authenticate with symmetric keys.

The steps in this article walk through a process called manual provisioning, where you connect each device to its IoT hub manually. The alternative is automatic provisioning using the IoT Hub Device Provisioning Service, which is helpful when you have many devices to provision.

<!--TODO: Add auto-provision info/links-->

For manual provisioning, you have two options for authenticating IoT Edge devices:

* **Symmetric key**: When you create a new device identity in IoT Hub, the service creates two keys. You place one of the keys on the device, and it presents the key to IoT Hub when authenticating.
* **X.509 self-signed**: You create two X.509 identity certificates and place them on the device. When you create a new device identity in IoT Hub, you provide thumbprints from both certificates. When the device authenticates to IoT Hub, it presents its certificates and IoT Hub can verify that they match the thumbprints.

This article walks through the registration and provisioning process with symmetric key authentication. If you want to learn how to set up a device with X.509 certificates, see [Set up an Azure IoT Edge device with X.509 certificate authentication](how-to-manual-provision-x509.md).

## Register a new device

Every device that connects to an IoT Hub has a device id that's used to track cloud-to-device or device-to-cloud communications. You configure a device with its connection information which includes the IoT hub hostname, the device id, and the information the device uses to authenticate to IoT Hub.

For symmetric key authentication, this information is gathered in a *connection string* that you can retrieve from IoT Hub and then place on your IoT Edge device.

You can use several tools to register a new IoT Edge device in IoT Hub and retrieve its connection string, depending on your preference.

# [Portal](#tab/azure-portal)

### Prerequisites for the Azure portal

A free or standard [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in your Azure subscription.

### Create an IoT Edge device in the Azure portal

In your IoT Hub in the Azure portal, IoT Edge devices are created and managed separately from IOT devices that are not edge enabled.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.
2. In the left pane, select **IoT Edge** from the menu.
3. Select **Add an IoT Edge device**.
4. Provide a descriptive device ID. Use the default settings to auto-generate authentication keys and connect the new device to your hub.
5. Select **Save**.

### View IoT Edge devices in the Azure portal

All the edge-enabled devices that connect to your IoT hub are listed on the **IoT Edge** page.

![View all IoT Edge devices in your IoT hub](./media/how-to-register-device/portal-view-devices.png)

### Retrieve the connection string in the Azure portal

When you're ready to set up your device, you need the connection string that links your physical device with its identity in the IoT hub.

1. From the **IoT Edge** page in the portal, click on the device ID from the list of IoT Edge devices.
2. Copy the value of either **Primary Connection String** or **Secondary Connection String**.

# [Visual Studio Code](#tab/visual-studio-code)

### Prerequisites for Visual Studio Code

* A free or standard [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in your Azure subscription
* [Visual Studio Code](https://code.visualstudio.com/)
* [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) for Visual Studio Code

### Sign in to access your IoT hub

You can use the Azure IoT extensions for Visual Studio Code to perform operations with your IoT Hub. For these operations to work, you need to sign in to your Azure account and select your IoT Hub.

1. In Visual Studio Code, open the **Explorer** view.
1. At the bottom of the Explorer, expand the **Azure IoT Hub** section.

   ![Expand Azure IoT Hub Devices section](./media/how-to-register-device/azure-iot-hub-devices.png)

1. Click on the **...** in the **Azure IoT Hub** section header. If you don't see the ellipsis, click on or hover over the header.
1. Choose **Select IoT Hub**.
1. If you aren't signed in to your Azure account, follow the prompts to do so.
1. Select your Azure subscription.
1. Select your IoT hub.

### Create an IoT Edge device with Visual Studio Code

1. In the VS Code Explorer, expand the **Azure IoT Hub Devices** section.
1. Click on the **...** in the **Azure IoT Hub Devices** section header. If you don't see the ellipsis, click on or hover over the header.
1. Select **Create IoT Edge Device**.
1. In the text box that opens, give your device an ID.

In the output screen, you see the result of the command. The device info is printed, which includes the **deviceId** that you provided and the **connectionString** that you can use to connect your physical device to your IoT hub.

In the output screen, you see the result of the command. The device info is printed, which includes the **deviceId** that you provided and the **connectionString** that you can use to connect your physical device to your IoT hub.

### View IoT Edge devices with Visual Studio Code

All the devices that connect to your IoT hub are listed in the **Azure IoT Hub** section of the Visual Studio Code Explorer. IoT Edge devices are distinguishable from non-Edge devices with a different icon, and the fact that the **$edgeAgent** and **$edgeHub** modules are deployed to each IoT Edge device.

![View all IoT Edge devices in your IoT hub](./media/how-to-register-device/view-devices.png)

### Retrieve the connection string with Visual Studio Code

When you're ready to set up your device, you need the connection string that links your physical device with its identity in the IoT hub.

1. Right-click on the ID of your device in the **Azure IoT Hub** section.
1. Select **Copy Device Connection String**.

   The connection string is copied to your clipboard.

You can also select **Get Device Info** from the right-click menu to see all the device info, including the connection string, in the output window.

# [Azure CLI](#tab/azure-cli)

### Prerequisites for the Azure CLI

* An [IoT hub](../iot-hub/iot-hub-create-using-cli.md) in your Azure subscription.
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) in your environment. At a minimum, your Azure CLI version must be 2.0.70 or above. Use `az --version` to validate. This version supports az extension commands and introduces the Knack command framework.
* The [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension).

### Create an IoT Edge device with the Azure CLI

Use the [az iot hub device-identity create](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/hub/device-identity?view=azure-cli-latest#ext-azure-iot-az-iot-hub-device-identity-create) command to create a new device identity in your IoT hub. For example:

   ```azurecli
   az iot hub device-identity create --device-id [device id] --hub-name [hub name] --edge-enabled
   ```

This command includes three parameters:

* **device-id**: Provide a descriptive name that's unique to your IoT hub.
* **hub-name**: Provide the name of your IoT hub.
* **edge-enabled**: This parameter declares that the device is for use with IoT Edge.

   ![az iot hub device-identity create output](./media/how-to-register-device/Create-edge-device.png)

### View IoT Edge devices with the Azure CLI

Use the [az iot hub device-identity list](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/hub/device-identity?view=azure-cli-latest#ext-azure-iot-az-iot-hub-device-identity-list) command to view all devices in your IoT hub. For example:

   ```azurecli
   az iot hub device-identity list --hub-name [hub name]
   ```

Any device that is registered as an IoT Edge device will have the property **capabilities.iotEdge** set to **true**.

### Retrieve the connection string with the Azure CLI

When you're ready to set up your device, you need the connection string that links your physical device with its identity in the IoT hub. Use the [az iot hub device-identity show-connection-string](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/hub/device-identity?view=azure-cli-latest#ext-azure-iot-az-iot-hub-device-identity-show-connection-string) command to return the connection string for a single device:

   ```azurecli
   az iot hub device-identity show-connection-string --device-id [device id] --hub-name [hub name]
   ```

The value for the `device-id` parameter is case-sensitive. Don't copy the quotation marks around the connection string.

---

## Configure an IoT Edge device

Once the IoT Edge device has an identity in IoT Hub and a connection string that it can use for authentication, you need to configure the device itself with this information.

On a Linux device, you provide the connection string by editing a config.yaml file. On a Windows device, you provide the connection string by running a PowerShell script.

# [Linux](#tab/linux)

On the IoT Edge device, open the configuration file.

```bash
sudo nano /etc/iotedge/config.yaml
```

Find the provisioning configurations of the file and uncomment the **Manual provisioning configuration using a connection string** section. 

Update the value of **device_connection_string** with the connection string from your IoT Edge device. Make sure any other provisioning sections are commented out. Make sure the **provisioning:** line has no preceding whitespace and that nested items are indented by two spaces.

```yml
# Manual provisioning configuration using a connection string
provisioning:
  source: "manual"
  device_connection_string: "<ADD DEVICE CONNECTION STRING HERE>"
  dynamic_reprovisioning: false
```

To paste clipboard contents into Nano `Shift+Right Click` or press `Shift+Insert`.

Save and close the file.

   `CTRL + X`, `Y`, `Enter`

After entering the provisioning information in the configuration file, restart the daemon:

```bash
sudo systemctl restart iotedge
```

# [Windows](#tab/windows)

1. On the IoT Edge device, run PowerShell as an administrator.

2. Use the [Initialize-IoTEdge](reference-windows-scripts.md#initialize-iotedge) command to configure the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -ManualConnectionString -ContainerOs Windows
   ```

   If you are using Linux containers, add the `-ContainerOs` parameter to the flag. Be consistent with the container option you chose with the `Deploy-IoTEdge` command that you ran previously.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -ContainerOs Linux
   ```

3. When prompted, provide the device connection string that you retrieved in the previous section. The device connection string associates the physical device with a device ID in IoT Hub and provides authentication information.

   The device connection string takes the following format, and should not include quotation marks: `HostName={IoT hub name}.azure-devices.net;DeviceId={device name};SharedAccessKey={key}`

When you install and provision a device manually, you can use additional parameters to modify the installation including:

* Direct traffic to go through a proxy server
* Point the installer to an offline directory
* Declare a specific agent container image, and provide credentials if it's in a private registry

For more information about these installation options, see [PowerShell scripts for IoT Edge on Windows](reference-windows-scripts.md).

---

## Verify successful setup

Check the status of the IoT Edge service. It should be listed as running.  

# [Linux](#tab/linux)

```bash
systemctl status iotedge
```

# [Windows](#tab/windows)

```powershell
Get-Service iotedge
```

---

Examine service logs. 

# [Linux](#tab/linux)

```bash
journalctl -u iotedge --no-pager --no-full
```

# [Windows](#tab/windows)

If you just finished installing the IoT Edge runtime, you may see a list of errors from the time between running **Deploy-IoTEdge** and **Initialize-IoTEdge**. These errors are expected, as the service is trying to start before being configured.

```powershell
. {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog
```

---

Run the [troubleshooting tool](troubleshoot.md#run-the-check-command) to check for the most common configuration and networking errors.

```powershell
iotedge check
```

Until you deploy your first module to IoT Edge on your device, the **$edgeHub** system module will not be deployed to the device. As a result, the automated check will return an error for the `Edge Hub can bind to ports on host` connectivity check. This error can be ignored unless it occurs after deploying a module to the device.

Finally, list running modules:

```powershell
iotedge list
```

After a new installation, the only module you should see running is **edgeAgent**. 

## Next steps

Continue to [deploy IoT Edge modules](how-to-deploy-modules-portal.md) to learn how to deploy modules onto your device.
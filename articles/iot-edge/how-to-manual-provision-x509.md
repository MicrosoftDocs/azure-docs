---
title: Provision with X.509 certificates - Azure IoT Edge | Microsoft Docs
description: After installation, provision an IoT Edge device with its device identity certificates and authenticate to IoT Hub
author: kgremban
manager: philmea
# this is the PM responsible
ms.reviewer: veyalla
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 10/06/2020
ms.author: kgremban
---

# Set up an Azure IoT Edge device with X.509 certificate authentication

This article provides the steps to register a new IoT Edge device in IoT Hub and configure the device to authenticate with X.509 certificates.

The steps in this article walk through a process called manual provisioning, where you connect each device to its IoT hub manually. The alternative is automatic provisioning using the IoT Hub Device Provisioning Service, which is helpful when you have many devices to provision.

<!--TODO: Add auto-provision info/links-->

For manual provisioning, you have two options for authenticating IoT Edge devices:

* **Symmetric key**: When you create a new device identity in IoT Hub, the service creates two keys. You place one of the keys on the device, and it presents the key to IoT Hub when authenticating.

  This authentication method is faster to get started, but not as secure.

* **X.509 self-signed**: You create two X.509 identity certificates and place them on the device. When you create a new device identity in IoT Hub, you provide thumbprints from both certificates. When the device authenticates to IoT Hub, it presents its certificates and IoT Hub can verify that they match the thumbprints.

  This authentication method is more secure, and recommended for production scenarios.

This article walks through the registration and provisioning process with X.509 certificate authentication. If you want to learn how to set up a device with symmetric keys, see [Set up an Azure IoT Edge device with symmetric key authentication](how-to-manual-provision-symmetric-key.md).

## Prerequisites

Before you follow the steps in this article, you should have a device with the IoT Edge runtime installed on it. If not, follow the steps in [Install or uninstall the Azure IoT Edge runtime](how-to-install-iot-edge.md).

Manual provisioning with X.509 certificates require IoT Edge version 1.0.10 or newer.

## Create certificates and thumbprints



<!-- TODO -->

## Register a new device

Every device that connects to an IoT Hub has a device ID that's used to track cloud-to-device or device-to-cloud communications. You configure a device with its connection information which includes the IoT hub hostname, the device ID, and the information the device uses to authenticate to IoT Hub.

For X.509 certificate authentication, this information is provided in the form of *thumbprints* taken from your device identity certificates. These thumbprints are given to IoT Hub at the time of device registration so that the service can recognize the device when it connects.

You can use several tools to register a new IoT Edge device in IoT Hub and upload its certificate thumbprints. 

# [Portal](#tab/azure-portal)

### Prerequisites for the Azure portal

A free or standard [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in your Azure subscription.

### Create an IoT Edge device in the Azure portal

In your IoT Hub in the Azure portal, IoT Edge devices are created and managed separately from IOT devices that are not edge enabled.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.

1. In the left pane, select **IoT Edge** from the menu, then select **Add an IoT Edge device**.

   ![Add an IoT Edge device from the Azure portal](./media/how-to-manual-provision-symmetric-key/portal-add-iot-edge-device.png)

1. On the **Create a device** page, provide the following information:

   * Create a descriptive device ID. Make a note of this device ID, as you'll use it in the next section.
   * Select **X.509 Self-Signed** as the authentication type.
   * Provide the primary and secondary identity certificate thumbprints. Thumbprint values are 40-hex characters for SHA-1 hashes or 64-hex characters for SHA-256 hashes.

1. Select **Save**.

### View IoT Edge devices in the Azure portal

All the edge-enabled devices that connect to your IoT hub are listed on the **IoT Edge** page.

![View all IoT Edge devices in your IoT hub](./media/how-to-manual-provision-symmetric-key/portal-view-devices.png)

# [Azure CLI](#tab/azure-cli)

### Prerequisites for the Azure CLI

* An [IoT hub](../iot-hub/iot-hub-create-using-cli.md) in your Azure subscription.
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) in your environment. At a minimum, your Azure CLI version must be 2.0.70 or above. Use `az --version` to validate. This version supports az extension commands and introduces the Knack command framework.
* The [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension).

### Create an IoT Edge device with the Azure CLI

Use the [az iot hub device-identity create](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/hub/device-identity#ext-azure-iot-az-iot-hub-device-identity-create) command to create a new device identity in your IoT hub. For example:

   ```azurecli
   az iot hub device-identity create --device-id [device id] --hub-name [hub name] --edge-enabled --auth-method x509_thumbprint --primary-thumbprint [SHA thumbprint] --secondary-thumbprint [SHA thumbprint]
   ```

This command includes several parameters:

* `--device-id` or `-d`: Provide a descriptive name that's unique to your IoT hub. Make a note of this device ID, as you'll use it in the next section.
* `hub-name` or `-n`: Provide the name of your IoT hub.
* `--edge-enabled` or `--ee`: Declare that the device is an IoT Edge device.
* `--auth-method` or `--am`: Declare the authorization type the device is going to use. In this case, we're using X.509 certificate thumbprints.
* `--primary-thumbprint` or `--ptp`: Provide an X.509 certificate thumbprint to use as a primary key.
* `--secondary-thumbprint` or `--stp`: Provide an X.509 certificate thumbprint to use as a secondary key.

### View IoT Edge devices with the Azure CLI

Use the [az iot hub device-identity list](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/hub/device-identity#ext-azure-iot-az-iot-hub-device-identity-list) command to view all devices in your IoT hub. For example:

   ```azurecli
   az iot hub device-identity list --hub-name [hub name]
   ```

Add the flag `--edge-enabled` or `--ee` to list only IoT Edge devices in your IoT hub.

Any device that is registered as an IoT Edge device will have the property **capabilities.iotEdge** set to **true**.

--- 

## Configure an IoT Edge device

Once the IoT Edge device has an identity in IoT Hub, you need to configure the device with its cloud identity as well as its identity certificates.

On a Linux device, you provide this information by editing a config.yaml file. On a Windows device, you provide this information by running a PowerShell script.

# [Linux](#tab/linux)

1. On the IoT Edge device, open the configuration file.

   ```bash
   sudo nano /etc/iotedge/config.yaml
   ```

1. Find the provisioning configurations section of the file. 

1. Comment out the **Manual provisioning configuration using a connection string** section.

1. Uncomment the **Manual provisioning configuration using an X.509 identity certificate** section. Make sure the **provisioning:** line has no preceding whitespace and that nested items are indented by two spaces.

   ```yml
   # Manual provisioning configuration using a connection string
   provisioning:
     source: "manual"
     authentication:
       method: "x509"
       iothub_hostname: "<REQUIRED IOTHUB HOSTNAME>"
       device_id: "<REQUIRED DEVICE ID PROVISIONED IN IOTHUB>"
       identity_cert: "<REQUIRED URI TO DEVICE IDENTITY CERTIFICATE>"
       identity_pk: "<REQUIRED URI TO DEVICE IDENTITY PRIVATE KEY>"
     dynamic_reprovisioning: false
   ```

1. Update the following fields:

   * **iothub_hostname**: Hostname of the IoT hub the device will connect to. For example, `{IoT hub name}.azure-devices.net`.
   * **device_id**: The ID that you provided when you registered the device.
   * **identity_cert**: URI to an identity certificate on the device. For example, `file:///path/identity_certificate.pem`.
   * **identity_pk**: URI to the private key file for the provided identity certificate. For example, `file:///path/identity_key.pem`.

1. Save and close the file.

   `CTRL + X`, `Y`, `Enter`

1. After entering the provisioning information in the configuration file, restart the daemon:

   ```bash
   sudo systemctl restart iotedge
   ```

# [Windows](#tab/windows)

1. On the IoT Edge device, run PowerShell as an administrator.

2. Use the [Initialize-IoTEdge](reference-windows-scripts.md#initialize-iotedge) command to configure the IoT Edge runtime on your machine.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -ManualX509
   ```

   * If you are using Linux containers, add the `-ContainerOs` parameter to the flag. Be consistent with the container option you chose with the `Deploy-IoTEdge` command that you ran previously.

      ```powershell
      . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
      Initialize-IoTEdge -ManualX509 -ContainerOs Linux
      ```

   * If you downloaded the IoTEdgeSecurityDaemon.ps1 script onto your device for offline or specific version installation, be sure to reference the local copy of the script.

      ```powershell
      . <path>/IoTEdgeSecurityDaemon.ps1
      Initialize-IoTEdge -ManualX509
      ```

3. When prompted, provide the following information:

   * **IotHubHostName**: Hostname of the IoT hub the device will connect to. For example, `{IoT hub name}.azure-devices.net`.
   * **DeviceId**: The ID that you provided when you registered the device.
   * **X509IdentityCertificate**: Absolute path to an identity certificate on the device. For example, `C:\path\identity_certificate.pem`.
   * **X509IdentityPrivateKey**: Absolute path to the private key file for the provided identity certificate. For example, `C:\path\identity_key.pem`.

When you provision a device manually, you can use additional parameters to modify the process including:

* Direct traffic to go through a proxy server
* Declare a specific edgeAgent container image, and provide credentials if it's in a private registry

For more information about these additional parameters, see [PowerShell scripts for IoT Edge on Windows](reference-windows-scripts.md).

---

[!INCLUDE [Verify and troubleshoot installation](../../includes/iot-edge-verify-troubleshoot-install.md)]

## Next steps

Continue to [deploy IoT Edge modules](how-to-deploy-modules-portal.md) to learn how to deploy modules onto your device.

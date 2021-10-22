---
title: Create and provision an IoT Edge device on Linux using X.509 certificates - Azure IoT Edge | Microsoft Docs
description: Create and provision a single IoT Edge device in IoT Hub for manual provisioning with X.509 certificates
author: v-tcassi
ms.reviewer: kgremban
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 09/27/2021
ms.author: v-tcassi
---

# Create and provision an IoT Edge device on Linux using X.509 certificates

[!INCLUDE [iot-edge-version-201806-or-202011](../../includes/iot-edge-version-201806-or-202011.md)]

This article provides end-to-end instructions for registering and provisioning a Linux IoT Edge device, including installing IoT Edge.

Every device that connects to an IoT hub has a device ID that's used to track cloud-to-device or device-to-cloud communications. You configure a device with its connection information, which includes the IoT hub hostname, the device ID, and the information the device uses to authenticate to IoT Hub.

The steps in this article walk through a process called manual provisioning, where you connect a single device to its IoT hub. For manual provisioning, you have two options for authenticating IoT Edge devices:

* **Symmetric keys**: When you create a new device identity in IoT Hub, the service creates two keys. You place one of the keys on the device, and it presents the key to IoT Hub when authenticating.

  This authentication method is faster to get started, but not as secure.

* **X.509 self-signed**: You create two X.509 identity certificates and place them on the device. When you create a new device identity in IoT Hub, you provide thumbprints from both certificates. When the device authenticates to IoT Hub, it presents one certificate and IoT Hub verifies that the certificate matches its thumbprint.

  This authentication method is more secure and recommended for production scenarios.

This article covers using X.509 certificates as your authentication method. If you want to use symmetric keys, see [Create and provision an IoT Edge device on Linux using symmetric keys](how-to-provision-single-device-linux-symmetric.md).

> [!NOTE]
> If you have many devices to set up and don't want to manually provision each one, use one of the following articles to learn how IoT Edge works with the IoT Hub Device Provisioning Service:
>
> * [Create and provision IoT Edge devices at scale using X.509 certificates](how-to-provision-devices-at-scale-linux-x509.md)
> * [Create and provision IoT Edge devices at scale with a TPM](how-to-auto-provision-simulated-device-linux.md)
> * [Create and provision IoT Edge devices at scale using symmetric keys](how-to-provision-devices-at-scale-linux-symmetric.md)

## Prerequisites

This article covers registering your IoT Edge device and installing IoT Edge on it. These tasks have different prerequisites and utilities used to accomplish them. Make sure you have all the prerequisites covered before proceeding.

### Device registration

You can use the **Azure portal**, **Visual Studio Code**, or **Azure CLI** for the steps to register you device. Each utility has its own prerequisites:

# [Portal](#tab/azure-portal)

A free or standard [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in your Azure subscription.

# [Visual Studio Code](#tab/visual-studio-code)

* A free or standard [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in your Azure subscription
* [Visual Studio Code](https://code.visualstudio.com/)
* [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) for Visual Studio Code

> [!NOTE]
> Currently, the Azure IoT extension for Visual Studio Code doesn't support device registration with X.509 certificates.

# [Azure CLI](#tab/azure-cli)

* A free or standard [IoT hub](../iot-hub/iot-hub-create-using-cli.md) in your Azure subscription.
* [Azure CLI](/cli/azure/install-azure-cli) in your environment. At a minimum, your Azure CLI version must be 2.0.70 or newer. Use `az --version` to validate. This version supports az extension commands and introduces the Knack command framework.

---

### IoT Edge installation

An X64, ARM32, or ARM64 Linux device.

Microsoft provides installation packages for Ubuntu Server 18.04 and Raspberry Pi OS Stretch operating systems.

For the latest information about which operating systems are currently supported for production scenarios, see [Azure IoT Edge supported systems](support.md#operating-systems)

>[!NOTE]
>Support for ARM64 devices is in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Generate device identity certificates

Manual provisioning with X.509 certificates requires IoT Edge version 1.0.10 or newer.

When you provision an IoT Edge device with X.509 certificates, you use what is called a *device identity certificate*. This certificate is only used for provisioning an IoT Edge device and authenticating the device with Azure IoT Hub. It is a leaf certificate that doesn't sign other certificates. The device identity certificate is separate from the certificate authority (CA) certificates that the IoT Edge device presents to modules or downstream devices for verification.

For X.509 certificate authentication, each device's authentication information is provided in the form of *thumbprints* taken from your device identity certificates. These thumbprints are given to IoT Hub at the time of device registration so that the service can recognize the device when it connects.

For more information about how the CA certificates are used in IoT Edge devices, see [Understand how Azure IoT Edge uses certificates](iot-edge-certs.md).

You need the following files for manual provisioning with X.509:

* Two of device identity certificates with their matching private key certificates in .cer or .pem formats.

  One set of certificate/key files is provided to the IoT Edge runtime. When you create device identity certificates, set the certificate common name (CN) with the device ID that you want the device to have in your IoT hub.

* Thumbprints taken from both device identity certificates.

  Thumbprint values are 40-hex characters for SHA-1 hashes or 64-hex characters for SHA-256 hashes. Both thumbprints are provided to IoT Hub at the time of device registration.

If you don't have certificates available, you can [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md). Follow the instructions in that article to set up certificate creation scripts, create a root CA certificate, and then create two IoT Edge device identity certificates.

One way to retrieve the thumbprint from a certificate is with the following openssl command:

```cmd
openssl x509 -in <certificate filename>.pem -text -fingerprint
```

## Register your device

You can use the **Azure portal**, **Visual Studio Code**, or **Azure CLI** to register your device, depending on your preference.

# [Portal](#tab/azure-portal)

In your IoT hub in the Azure portal, IoT Edge devices are created and managed separately from IoT devices that are not edge enabled.

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.

1. In the left pane, select **IoT Edge** from the menu, then select **Add an IoT Edge device**.

   ![Add an IoT Edge device from the Azure portal](./media/how-to-provision-single-device-linux-x509/portal-add-iot-edge-device.png)

1. On the **Create a device** page, provide the following information:

   * Create a descriptive device ID. Make a note of this device ID, as you'll use it later.
   * Select **X.509 Self-Signed** as the authentication type.
   * Provide the primary and secondary identity certificate thumbprints. Thumbprint values are 40-hex characters for SHA-1 hashes or 64-hex characters for SHA-256 hashes.

1. Select **Save**.

# [Visual Studio Code](#tab/visual-studio-code)

Currently, the Azure IoT extension for Visual Studio Code doesn't support device registration with X.509 certificates.

# [Azure CLI](#tab/azure-cli)

Use the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity) command to create a new device identity in your IoT hub. For example:

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

---

Now that you have a device registered in IoT Hub, retrieve the information that you use to complete installation and provisioning of the IoT Edge runtime.

## View registered devices and retrieve provisioning information

Devices that use X.509 certificate authentication need their IoT hub name, their device name, and their certificate files to complete installation and provisioning of the IoT Edge runtime.

# [Portal](#tab/azure-portal)

All the edge-enabled devices that connect to your IoT hub are listed on the **IoT Edge** page.

![Use the Azure portal to view all IoT Edge devices in your IoT hub](./media/how-to-provision-single-device-linux-x509/portal-view-devices.png)

# [Visual Studio Code](#tab/visual-studio-code)

While there is no support for device registration with X.509 certificates through Visual Studio Code, you can still view your IoT Edge devices if you need to.

All the devices that connect to your IoT hub are listed in the **Azure IoT Hub** section of the Visual Studio Code Explorer. IoT Edge devices are distinguishable from non-Edge devices with a different icon, and the fact that the **$edgeAgent** and **$edgeHub** modules are deployed to each IoT Edge device.

![Use VS Code to view all IoT Edge devices in your IoT hub](./media/how-to-provision-single-device-linux-x509/view-devices.png)

# [Azure CLI](#tab/azure-cli)

Use the [az iot hub device-identity list](/cli/azure/iot/hub/device-identity) command to view all devices in your IoT hub. For example:

   ```azurecli
   az iot hub device-identity list --hub-name [hub name]
   ```

Any device that is registered as an IoT Edge device will have the property **capabilities.iotEdge** set to **true**.

---

## Install IoT Edge

In this section, you prepare your Linux virtual machine or physical device for IoT Edge. Then, you install IoT Edge.

There are two steps you need to complete on your device before it is ready to install the IoT Edge runtime. Your device needs a container engine installed, and it needs access to the Microsoft installation packages.

### Install a container engine on your device

Azure IoT Edge relies on an OCI-compatible container runtime. For production scenarios, we recommended that you use the Moby engine. The Moby engine is the only container engine officially supported with Azure IoT Edge. Docker CE/EE container images are compatible with the Moby runtime.

Update package lists on your device.

   ```bash
   sudo apt-get update
   ```

Install the Moby engine.

   ```bash
   sudo apt-get install moby-engine
   ```

If you get errors when installing the Moby container engine, verify your Linux kernel for Moby compatibility. Some embedded device manufacturers ship device images that contain custom Linux kernels without the features required for container engine compatibility. Run the following command, which uses the [check-config script](https://github.com/moby/moby/blob/master/contrib/check-config.sh) provided by Moby, to check your kernel configuration:

   ```bash
   curl -sSL https://raw.githubusercontent.com/moby/moby/master/contrib/check-config.sh -o check-config.sh
   chmod +x check-config.sh
   ./check-config.sh
   ```

In the output of the script, check that all items under `Generally Necessary` and `Network Drivers` are enabled. If you are missing features, enable them by rebuilding your kernel from source and selecting the associated modules for inclusion in the appropriate kernel .config. Similarly, if you are using a kernel configuration generator like `defconfig` or `menuconfig`, find and enable the respective features and rebuild your kernel accordingly. Once you have deployed your newly modified kernel, run the check-config script again to verify that all the required features were successfully enabled.

### Prepare your device to access the Microsoft installation packages

1. Install the repository configuration that matches your device operating system.

   * **Ubuntu Server 18.04**:

      ```bash
      curl https://packages.microsoft.com/config/ubuntu/18.04/multiarch/prod.list > ./microsoft-prod.list
      ```

   * **Raspberry Pi OS Stretch**:

      ```bash
      curl https://packages.microsoft.com/config/debian/stretch/multiarch/prod.list > ./microsoft-prod.list
      ```

1. Copy the generated list to the sources.list.d directory.

   ```bash
   sudo cp ./microsoft-prod.list /etc/apt/sources.list.d/
   ```

1. Install the Microsoft GPG public key.

   ```bash
   curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
   sudo cp ./microsoft.gpg /etc/apt/trusted.gpg.d/
   ```

Azure IoT Edge software packages are subject to the license terms located in each package (`usr/share/doc/{package-name}` or the `LICENSE` directory). Read the license terms prior to using a package. Your installation and use of a package constitutes your acceptance of these terms. If you do not agree with the license terms, do not use that package.

### Install the IoT Edge runtime

<!-- 1.1 -->
::: moniker range="iotedge-2018-06"

The IoT Edge security daemon provides and maintains security standards on the IoT Edge device. The daemon starts on every boot and bootstraps the device by starting the rest of the IoT Edge runtime.

The steps in this section represent the typical process to install the latest version on a device that has internet connection. If you need to install a specific version, like a pre-release version, or need to install while offline, follow the [Offline or specific version installation](#offline-or-specific-version-installation-optional) steps later in this article.

Update package lists on your device.

   ```bash
   sudo apt-get update
   ```

Install IoT Edge version 1.1.* along with the **libiothsm-std** package:

   ```bash
   sudo apt-get install iotedge
   ```

>[!NOTE]
>IoT Edge version 1.1 is the long-term support branch of IoT Edge. If you are running an older version, we recommend installing or updating to the latest patch as older versions are no longer supported.

<!-- end 1.1 -->
::: moniker-end

<!-- 1.2 -->
::: moniker range=">=iotedge-2020-11"

The IoT Edge service provides and maintains security standards on the IoT Edge device. The service starts on every boot and bootstraps the device by starting the rest of the IoT Edge runtime.

The IoT identity service was introduced along with version 1.2 of IoT Edge. This service handles the identity provisioning and management for IoT Edge and for other device components that need to communicate with IoT Hub.

The steps in this section represent the typical process to install the latest version on a device that has internet connection. If you need to install a specific version, like a pre-release version, or need to install while offline, follow the [Offline or specific version installation](#offline-or-specific-version-installation-optional) steps later in this article.

>[!NOTE]
>The steps in this section show you how to install IoT Edge version 1.2.
>
>If you already have an IoT Edge device running an older version and want to upgrade to 1.2, use the steps in [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md). Version 1.2 is sufficiently different from previous versions of IoT Edge that specific steps are necessary to upgrade.

Update package lists on your device.

   ```bash
   sudo apt-get update
   ```

Check to see which versions of IoT Edge and the IoT identity service are available.

   ```bash
   apt list -a aziot-edge aziot-identity-service
   ```

To install the latest version of IoT Edge and the IoT identity service package, use the following command:

   ```bash
   sudo apt-get install aziot-edge
   ```

<!-- end 1.2 -->
::: moniker-end

## Provision the device with its cloud identity

Now that the container engine and the IoT Edge runtime are installed on your device, you're ready for the next step, which is to set up the device with its cloud identity and authentication information.

<!-- 1.1 -->
::: moniker range="iotedge-2018-06"

On the IoT Edge device, open the configuration file.

   ```bash
   sudo nano /etc/iotedge/config.yaml
   ```

Find the provisioning configurations section of the file and uncomment the **Manual provisioning configuration using an X.509 identity certificate** section. Make sure that any other provisioning sections are commented out. Make sure the **provisioning:** line has no preceding whitespace and that nested items are indented by two spaces.

   ```yml
   # Manual provisioning configuration using an x.509 identity certificate
   provisioning:
     source: "manual"
     authentication:
       method: "x509"
       iothub_hostname: "<REQUIRED IOTHUB HOSTNAME>"
       device_id: "<REQUIRED DEVICE ID PROVISIONED IN IOTHUB>"
       identity_cert: "<REQUIRED URI TO DEVICE IDENTITY CERTIFICATE>"
       identity_pk: "<REQUIRED URI TO DEVICE IDENTITY PRIVATE KEY>"
   ```

Update the following fields:

* **iothub_hostname**: Hostname of the IoT hub the device will connect to. For example, `{IoT hub name}.azure-devices.net`.
* **device_id**: The ID that you provided when you registered the device.
* **identity_cert**: URI to an identity certificate on the device. For example, `file:///path/identity_certificate.pem`.
* **identity_pk**: URI to the private key file for the provided identity certificate. For example, `file:///path/identity_key.pem`.

Save and close the file.

   `CTRL + X`, `Y`, `Enter`

After entering the provisioning information in the configuration file, restart the daemon:

   ```bash
   sudo systemctl restart iotedge
   ```

<!-- end 1.1 -->
::: moniker-end

<!-- 1.2 -->
::: moniker range=">=iotedge-2020-11"

Create the configuration file for your device based on a template file that is provided as part of the IoT Edge installation.

   ```bash
   sudo cp /etc/aziot/config.toml.edge.template /etc/aziot/config.toml
   ```

On the IoT Edge device, open the configuration file.

   ```bash
   sudo nano /etc/aziot/config.toml
   ```

Find the **Provisioning** section of the file and uncomment the lines for manual provisioning with X.509 identity certificate. Make sure that any other provisioning sections are commented out.

   ```toml
   # Manual provisioning with x.509 certificates
   [provisioning]
   source = "manual"
   iothub_hostname = "<REQUIRED IOTHUB HOSTNAME>"
   device_id = "<REQUIRED DEVICE ID PROVISIONED IN IOTHUB>"

   [provisioning.authentication]
   method = "x509"

   identity_cert = "<REQUIRED URI OR POINTER TO DEVICE IDENTITY CERTIFICATE>"

   identity_pk = "<REQUIRED URI TO DEVICE IDENTITY PRIVATE KEY>"
   ```

Update the following fields:

* **iothub_hostname**: Hostname of the IoT hub the device will connect to. For example, `{IoT hub name}.azure-devices.net`.
* **device_id**: The ID that you provided when you registered the device.
* **identity_cert**: URI to an identity certificate on the device, for example: `file:///path/identity_certificate.pem`. Or, dynamically issue the certificate using EST or a local certificate authority.
* **identity_pk**: URI to the private key file for the provided identity certificate, for example: `file:///path/identity_key.pem`. Or, provide a PKCS#11 URI and then provide your configuration information in the **PKCS#11** section later in the config file.

Save and close the file.

   `CTRL + X`, `Y`, `Enter`

After entering the provisioning information in the configuration file, apply your changes:

   ```bash
   sudo iotedge config apply
   ```

<!-- end 1.2 -->
::: moniker-end

## Verify successful configuration

Verify that the runtime was successfully installed and configured on your IoT Edge device.

>[!TIP]
>You need elevated privileges to run `iotedge` commands. Once you sign out of your machine and sign back in the first time after installing the IoT Edge runtime, your permissions are automatically updated. Until then, use `sudo` in front of the commands.

Check to see that the IoT Edge system service is running.

<!-- 1.1 -->
::: moniker range="iotedge-2018-06"

   ```bash
   sudo systemctl status iotedge
   ```

::: moniker-end

<!-- 1.2 -->
::: moniker range=">=iotedge-2020-11"

   ```bash
   sudo iotedge system status
   ```

A successful status response is `Ok`.

::: moniker-end

If you need to troubleshoot the service, retrieve the service logs.

<!-- 1.1 -->
::: moniker range="iotedge-2018-06"

   ```bash
   journalctl -u iotedge
   ```

::: moniker-end

<!-- 1.2 -->
::: moniker range=">=iotedge-2020-11"

   ```bash
   sudo iotedge system logs
   ```

::: moniker-end

Use the `check` tool to verify configuration and connection status of the device.

   ```bash
   sudo iotedge check
   ```

>[!TIP]
>Always use `sudo` to run the check tool, even after your permissions are updated. The tool needs elevated privileges to access the config file to verify configuration status.

View all the modules running on your IoT Edge device. When the service starts for the first time, you should only see the **edgeAgent** module running. The edgeAgent module runs by default and helps to install and start any additional modules that you deploy to your device.

   ```bash
   sudo iotedge list
   ```

When you create a new IoT Edge device, it will display the status code `417 -- The device's deployment configuration is not set` in the Azure portal. This status is normal, and means that the device is ready to receive a module deployment.

## Offline or specific version installation (optional)

The steps in this section are for scenarios not covered by the standard installation steps. This may include:

* Install IoT Edge while offline
* Install a release candidate version

Use the steps in this section if you want to install a specific version of the Azure IoT Edge runtime that isn't available through `apt-get install`. The Microsoft package list only contains a limited set of recent versions and their sub-versions, so these steps are for anyone who wants to install an older version or a release candidate version.

Using curl commands, you can target the component files directly from the IoT Edge GitHub repository.

<!-- 1.1 -->
::: moniker range="iotedge-2018-06"

1. Navigate to the [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases), and find the release version that you want to target.

2. Expand the **Assets** section for that version.

3. Every release should have new files for the IoT Edge security daemon and the hsmlib. If you're going to install IoT Edge on an offline device, download these files ahead of time. Otherwise, use the following commands to update those components.

   1. Find the **libiothsm-std** file that matches your IoT Edge device's architecture. Right-click on the file link and copy the link address.

   2. Use the copied link in the following command to install that version of the hsmlib:

      ```bash
      curl -L <libiothsm-std link> -o libiothsm-std.deb && sudo apt-get install ./libiothsm-std.deb
      ```

   3. Find the **iotedge** file that matches your IoT Edge device's architecture. Right-click on the file link and copy the link address.

   4. Use the copied link in the following command to install that version of the IoT Edge security daemon.

      ```bash
      curl -L <iotedge link> -o iotedge.deb && sudo apt-get install ./iotedge.deb
      ```

<!-- end 1.1 -->
::: moniker-end

<!-- 1.2 -->
::: moniker range=">=iotedge-2020-11"

>[!NOTE]
>If your device is currently running IoT Edge version 1.1 or older, uninstall the **iotedge** and **libiothsm-std** packages before following the steps in this section. For more information, see [Update from 1.0 or 1.1 to 1.2](how-to-update-iot-edge.md#special-case-update-from-10-or-11-to-12).

1. Navigate to the [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases), and find the release version that you want to target.

2. Expand the **Assets** section for that version.

3. Every release should have new files for IoT Edge and the identity service. If you're going to install IoT Edge on an offline device, download these files ahead of time. Otherwise, use the following commands to update those components.

   1. Find the **aziot-identity-service** file that matches your IoT Edge device's architecture. Right-click on the file link and copy the link address.

   2. Use the copied link in the following command to install that version of the identity service:

      ```bash
      curl -L <identity service link> -o aziot-identity-service.deb && sudo apt-get install ./aziot-identity-service.deb
      ```

   3. Find the **aziot-edge** file that matches your IoT Edge device's architecture. Right-click on the file link and copy the link address.

   4. Use the copied link in the following command to install that version of IoT Edge.

      ```bash
      curl -L <iotedge link> -o aziot-edge.deb && sudo apt-get install ./aziot-edge.deb
      ```

<!-- end 1.2 -->
::: moniker-end

Now that the container engine and the IoT Edge runtime are installed on your device, you're ready for the next step, which is to [Provision the device with its cloud identity](#provision-the-device-with-its-cloud-identity).

## Uninstall IoT Edge

If you want to remove the IoT Edge installation from your device, use the following commands.

Remove the IoT Edge runtime.

<!-- 1.1 -->
::: moniker range="iotedge-2018-06"

```bash
sudo apt-get remove iotedge
```

::: moniker-end

<!-- 1.2 -->
::: moniker range=">=iotedge-2020-11"

```bash
sudo apt-get remove aziot-edge
```

::: moniker-end

Use the `--purge` flag if you want to delete all the files associated with IoT Edge, including your configuration files. Leave this flag out if you want to reinstall IoT Edge and use the same configuration information in the future.

When the IoT Edge runtime is removed, any containers that it created are stopped but still exist on your device. View all containers to see which ones remain.

```bash
sudo docker ps -a
```

Delete the containers from your device, including the two runtime containers.

```bash
sudo docker rm -f <container name>
```

Finally, remove the container runtime from your device.

```bash
sudo apt-get remove --purge moby-cli
sudo apt-get remove --purge moby-engine
```

## Next steps

Continue to [deploy IoT Edge modules](how-to-deploy-modules-portal.md) to learn how to deploy modules onto your device.

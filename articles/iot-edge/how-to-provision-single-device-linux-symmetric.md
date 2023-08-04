---
title: Create and provision an IoT Edge device on Linux using symmetric keys - Azure IoT Edge | Microsoft Docs
description: Create and provision a single IoT Edge device in IoT Hub for manual provisioning with symmetric keys
author: PatAltimore
ms.service: iot-edge
ms.custom: devx-track-linux
services: iot-edge
ms.topic: conceptual
ms.date: 04/25/2023
ms.author: patricka
ms.reviewer: mattmcinnes
---

# Create and provision an IoT Edge device on Linux using symmetric keys

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

This article provides end-to-end instructions for registering and provisioning a Linux IoT Edge device, which includes installing IoT Edge.

Each device that connects to an [IoT hub](../iot-hub/index.yml) has a device ID that's used to track [cloud-to-device](../iot-hub/iot-hub-devguide-c2d-guidance.md) or [device-to-cloud](../iot-hub/iot-hub-devguide-d2c-guidance.md) communications. You configure a device with its connection information, which includes: 

* IoT hub hostname
* Device ID
* Authentication details to connect to IoT Hub

The steps in this article walk through a process called *manual provisioning*, where you connect a single device to its IoT hub. For manual provisioning, you have two options for authenticating IoT Edge devices:

* **Symmetric keys**: When you create a new device identity in IoT Hub, the service creates two keys. You place one of the keys on the device, and it presents the key to IoT Hub when authenticating.

  This authentication method is faster to get started, but not as secure.

* **X.509 self-signed**: You create two X.509 identity certificates and place them on the device. When you create a new device identity in IoT Hub, you provide thumbprints from both certificates. When the device authenticates to IoT Hub, it presents one certificate and IoT Hub verifies that the certificate matches its thumbprint.

  This authentication method is more secure and recommended for production scenarios.

This article covers using symmetric keys as your authentication method. If you want to use X.509 certificates, see [Create and provision an IoT Edge device on Linux using X.509 certificates](how-to-provision-single-device-linux-x509.md).

> [!NOTE]
> If you have many devices to set up and don't want to manually provision each one, use one of the following articles to learn how IoT Edge works with the IoT Hub device provisioning service:
>
> * [Create and provision IoT Edge devices at scale using X.509 certificates](how-to-provision-devices-at-scale-linux-x509.md)
> * [Create and provision IoT Edge devices at scale with a TPM](how-to-provision-devices-at-scale-linux-tpm.md)
> * [Create and provision IoT Edge devices at scale using symmetric keys](how-to-provision-devices-at-scale-linux-symmetric.md)

## Prerequisites

This article shows how to register your IoT Edge device and install IoT Edge (also called IoT Edge runtime) on your device. Make sure you have the device management tool of your choice, for example Azure CLI, and device requirements before you register and install your device.

<!-- Device registration prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-register-device.md](includes/iot-edge-prerequisites-register-device.md)]

<!-- Device requirements H3 and content -->
[!INCLUDE [iot-edge-prerequisites-device-requirements-linux.md](includes/iot-edge-prerequisites-device-requirements-linux.md)]

<!-- Azure IoT extensions for Visual Studio Code-->
### Visual Studio Code extensions

If you are using Visual Studio Code, there are helpful Azure IoT extensions that will make the device creation and management process easier.

Install both the Azure IoT Edge and Azure IoT Hub extensions:

* [Azure IoT Edge](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-edge) 

* [Azure IoT Hub](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit)

<!-- Prerequisites end -->

<!-- Register your device and View provisioning information H2s and content -->
[!INCLUDE [iot-edge-register-device-symmetric.md](includes/iot-edge-register-device-symmetric.md)]

<!-- Install IoT Edge on Linux H2 and content -->
[!INCLUDE [install-iot-edge-linux.md](includes/iot-edge-install-linux.md)]

## Provision the device with its cloud identity

Now that the container engine and the IoT Edge runtime are installed on your device, you're ready to set up the device with its cloud identity and authentication information.

You can quickly configure your IoT Edge device with symmetric key authentication using the following command:

   ```bash
   sudo iotedge config mp --connection-string 'PASTE_DEVICE_CONNECTION_STRING_HERE'
   ```

   This `iotedge config mp` command creates a configuration file on the device and enters your connection string in the configuration file.

1. Apply the configuration changes.

   ```bash
   sudo iotedge config apply
   ```

1. To view the configuration file, you can open it:

   ```bash
   sudo nano /etc/aziot/config.toml
   ```

## Deploy modules

To deploy your IoT Edge modules, go to your IoT hub in the Azure portal, then:

1. Select **Devices** from the IoT Hub menu.

1. Select your device to open its page.

1. Select the **Set Modules** tab.

1. Since we want to deploy the IoT Edge default modules (edgeAgent and edgeHub), we don't need to add any modules to this pane, so select **Review + create** at the bottom.

1. You see the JSON confirmation of your modules. Select **Create** to deploy the modules.<br>
   
For more information, see [Deploy a module](quickstart-linux.md#deploy-a-module).

## Verify successful configuration

Verify that the runtime was successfully installed and configured on your IoT Edge device.

> [!TIP]
> You need elevated privileges to run `iotedge` commands. Once you sign out of your machine and sign back in the first time after installing the IoT Edge runtime, your permissions are automatically updated. Until then, use `sudo` in front of the commands.

1. Check to see that the IoT Edge system service is running.

   ```bash
   sudo iotedge system status
   ```

   A successful status response shows the `aziot` services as running or ready.

1. If you need to troubleshoot the service, retrieve the service logs.

   ```bash
   sudo iotedge system logs
   ```

1. Use the `check` tool to verify configuration and connection status of the device.

   ```bash
   sudo iotedge check
   ```

   You can expect a range of responses that may include **OK** (green), **Warning** (yellow), or **Error** (red).

   :::image type="content" source="media/how-to-provision-single-device-linux-symmetric/config-checks.png" alt-text="Screenshot of sample responses from the check command." lightbox="media/how-to-provision-single-device-linux-symmetric/config-checks.png":::

   >[!TIP]
   >Always use `sudo` to run the check tool, even after your permissions are updated. The tool needs elevated privileges to access the config file to verify configuration status.

   >[!NOTE]
   >On a newly provisioned device, you may see an error related to IoT Edge Hub:
   >
   >**× production readiness: Edge Hub's storage directory is persisted on the host filesystem - Error**
   >**Could not check current state of edgeHub container**
   >
   >This error is expected on a newly provisioned device because the IoT Edge Hub module is not yet running. Be sure your IoT Edge modules were deployed in the previous steps. Deployment resolves this error.
   >
   >Alternatively, you may see a status code as `417 -- The device's deployment configuration is not set`. Once your modules are deployed, this status will change.
   >

1. When the service starts for the first time, you should only see the **edgeAgent** module running. The edgeAgent module runs by default and helps to install and start any additional modules that you deploy to your device.

   Check that your device and modules are deployed and running, by viewing your device page in the Azure portal.

   :::image type="content" source="media/how-to-provision-single-device-linux-symmetric/modules-deployed.png" alt-text="Screenshot of IoT Edge modules deployed and running confirmation in the Azure portal." lightbox="media/how-to-provision-single-device-linux-symmetric/modules-deployed.png":::   

   Once your modules are deployed and running, list them in your device or virtual machine with the following command:

   ```bash
   sudo iotedge list
   ```

## Offline or specific version installation (optional)

The steps in this section are for scenarios not covered by the standard installation steps. This may include:

* Installing IoT Edge while offline
* Installing a release candidate version

Use the steps in this section if you want to install a [specific version of the Azure IoT Edge runtime](version-history.md) that isn't available through your package manager. The Microsoft package list only contains a limited set of recent versions and their sub-versions, so these steps are for anyone who wants to install an older version or a release candidate version.

Using curl commands, you can target the component files directly from the IoT Edge GitHub repository.

>[!NOTE]
>If your device is currently running IoT Edge version 1.1 or older, uninstall the **iotedge** and **libiothsm-std** packages before following the steps in this section. For more information, see [Update from 1.0 or 1.1 to latest release](how-to-update-iot-edge.md#special-case-update-from-10-or-11-to-latest-release).

1. Navigate to the [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases), and find the release version that you want to target.

2. Expand the **Assets** section for that version.

3. Every release should have new files for IoT Edge and the identity service. If you're going to install IoT Edge on an offline device, download these files ahead of time. Otherwise, use the following commands to update those components.

   1. Find the **aziot-identity-service** file that matches your IoT Edge device's architecture. Right-click on the file link and copy the link address.

   2. Use the copied link in the following command to install that version of the identity service:

      # [Ubuntu / Debian](#tab/ubuntu+debian)
      ```bash
      curl -L <identity service link> -o aziot-identity-service.deb && sudo apt-get install ./aziot-identity-service.deb
      ```

      # [Red Hat Enterprise Linux](#tab/rhel)
      ```bash
      curl -L <identity service link> -o aziot-identity-service.rpm && sudo yum localinstall ./aziot-identity-service.rpm
      ```
      ---

   3. Find the **aziot-edge** file that matches your IoT Edge device's architecture. Right-click on the file link and copy the link address.

   4. Use the copied link in the following command to install that version of IoT Edge.

      # [Ubuntu / Debian](#tab/ubuntu+debian)
      ```bash
      curl -L <iotedge link> -o aziot-edge.deb && sudo apt-get install ./aziot-edge.deb
      ```

      # [Red Hat Enterprise Linux](#tab/rhel)
      ```bash
      curl -L <iotedge link> -o aziot-edge.rpm && sudo yum localinstall ./aziot-edge.rpm
      ```
      ---

Now that the container engine and the IoT Edge runtime are installed on your device, you're ready for the next step, which is to [Provision the device with its cloud identity](#provision-the-device-with-its-cloud-identity).

## Uninstall IoT Edge

If you want to remove the IoT Edge installation from your device, use the following commands.

Remove the IoT Edge runtime.

# [Ubuntu / Debian](#tab/ubuntu+debian)
```bash
sudo apt-get autoremove --purge aziot-edge
```

Leave out the `--purge` flag if you plan to reinstall IoT Edge and use the same configuration information in the future. The `--purge` flags deletes all the files associated with IoT Edge, including your configuration files.

# [Red Hat Enterprise Linux](#tab/rhel)
```bash
sudo yum remove aziot-edge
```
---

When the IoT Edge runtime is removed, any containers that it created are stopped but still exist on your device. View all containers to see which ones remain.

```bash
sudo docker ps -a
```

Delete the containers from your device, including the two runtime containers.

```bash
sudo docker rm -f <container name>
```

Finally, remove the container runtime from your device.

# [Ubuntu / Debian](#tab/ubuntu+debian)
```bash
sudo apt-get autoremove --purge moby-engine
```

# [Red Hat Enterprise Linux](#tab/rhel)
```bash
sudo yum remove moby-cli
sudo yum remove moby-engine
```

## Next steps

Continue to [deploy IoT Edge modules](how-to-deploy-modules-portal.md) to learn how to deploy modules onto your device.

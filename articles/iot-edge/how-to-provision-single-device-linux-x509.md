---
title: Create IoT Edge device on Linux using X.509 certificates
titleSuffix: Azure IoT Edge
description: Create and provision a single IoT Edge device in IoT Hub for manual provisioning with X.509 certificates
author: PatAltimore
ms.service: iot-edge
ms.custom: linux-related-content
services: iot-edge
ms.topic: how-to
ms.date: 02/27/2024
ms.author: patricka
---

# Create and provision an IoT Edge device on Linux using X.509 certificates

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article provides end-to-end instructions for registering and provisioning a Linux IoT Edge device, including installing IoT Edge.

Every device that connects to an IoT hub has a device ID that's used to track cloud-to-device or device-to-cloud communications. You configure a device with its connection information that includes the IoT hub hostname, the device ID, and the information the device uses to authenticate to IoT Hub.

The steps in this article walk through a process called manual provisioning, where you connect a single device to its IoT hub. For manual provisioning, you have two options for authenticating IoT Edge devices:

* **Symmetric keys**: When you create a new device identity in IoT Hub, the service creates two keys. You place one of the keys on the device, and it presents the key to IoT Hub when authenticating.

  This authentication method is faster to get started, but not as secure.

* **X.509 self-signed**: You create two X.509 identity certificates and place them on the device. When you create a new device identity in IoT Hub, you provide thumbprints from both certificates. When the device authenticates to IoT Hub, it presents one certificate and IoT Hub verifies that the certificate matches its thumbprint.

  This authentication method is more secure and recommended for production scenarios.

This article covers using X.509 certificates as your authentication method. If you want to use symmetric keys, see [Create and provision an IoT Edge device on Linux using symmetric keys](how-to-provision-single-device-linux-symmetric.md).

> [!NOTE]
> If you have many devices to set up and don't want to manually provision each one, use one of the following articles to learn how IoT Edge works with the IoT Hub device provisioning service:
>
> * [Create and provision IoT Edge devices at scale using X.509 certificates](how-to-provision-devices-at-scale-linux-x509.md)
> * [Create and provision IoT Edge devices at scale with a TPM](how-to-provision-devices-at-scale-linux-tpm.md)
> * [Create and provision IoT Edge devices at scale using symmetric keys](how-to-provision-devices-at-scale-linux-symmetric.md)

## Prerequisites

This article covers registering your IoT Edge device and installing IoT Edge on it. These tasks have different prerequisites and utilities used to accomplish them. Make sure you have all the prerequisites covered before proceeding.

<!-- Device registration prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-register-device.md](includes/iot-edge-prerequisites-register-device.md)]

<!-- Device requirements prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-device-requirements-linux.md](includes/iot-edge-prerequisites-device-requirements-linux.md)]

<!-- Generate device identity certificates H2 and content -->
[!INCLUDE [iot-edge-generate-device-identity-certs.md](includes/iot-edge-generate-device-identity-certs.md)]

<!-- Register your device and View provisioning information H2s and content -->
[!INCLUDE [iot-edge-register-device-x509.md](includes/iot-edge-register-device-x509.md)]

<!-- Install IoT Edge on Linux H2 and content -->
[!INCLUDE [install-iot-edge-linux.md](includes/iot-edge-install-linux.md)]

## Provision the device with its cloud identity

Now that the container engine and the IoT Edge runtime are installed on your device, you're ready to set up the device with its cloud identity and authentication information.

# [Ubuntu / Debian / RHEL](#tab/ubuntu+debian+rhel)

1. Create the configuration file for your device based on a template file that's provided as part of the IoT Edge installation.

    ```bash
    sudo cp /etc/aziot/config.toml.edge.template /etc/aziot/config.toml
    ```

1. On the IoT Edge device, open the configuration file.

    ```bash
    sudo nano /etc/aziot/config.toml
    ```

1. Find the **Provisioning** section of the file and uncomment the lines for manual provisioning with X.509 identity certificate. Make sure that any other provisioning sections are commented out.

    ```toml
    # Manual provisioning with x.509 certificates
    [provisioning]
    source = "manual"
    iothub_hostname = "REQUIRED_IOTHUB_HOSTNAME"
    device_id = "REQUIRED_DEVICE_ID_PROVISIONED_IN_IOTHUB"

    [provisioning.authentication]
    method = "x509"

    identity_cert = "REQUIRED_URI_OR_POINTER_TO_DEVICE_IDENTITY_CERTIFICATE"

    identity_pk = "REQUIRED_URI_TO_DEVICE_IDENTITY_PRIVATE_KEY"
   ```

Update the following fields:

* **iothub_hostname**: Hostname of the IoT Hub the device connects to. For example, `{IoT hub name}.azure-devices.net`.
* **device_id**: The ID that you provided when you registered the device.
* **identity_cert**: URI to an identity certificate on the device, for example: `file:///path/identity_certificate.pem`. Or, dynamically issue the certificate using EST or a local certificate authority.
* **identity_pk**: URI to the private key file for the provided identity certificate, for example: `file:///path/identity_key.pem`. Or, provide a PKCS#11 URI and then provide your configuration information in the 

**PKCS#11** section later in the config file.

For more information about certificates, see [Manage IoT Edge certificates](how-to-manage-device-certificates.md).

Save and close the file.

   `CTRL + X`, `Y`, `Enter`

After entering the provisioning information in the configuration file, apply your changes:

   ```bash
   sudo iotedge config apply
   ```

# [Ubuntu Core snaps](#tab/snaps)

1. Copy your identity keyfile and certificate in the `/var/snap/azure-iot-identity/common/provisioning` directory. Create the directory if it doesn't exist.

1. Create a **config.toml** file in your home directory and configure your IoT Edge device for manual provisioning using an X.509 identity certificate.

    ```bash
    sudo nano ~/config.toml
    ```

1. You can manually provision using an X.509 certificate by adding the following provisioning settings to the file:

    ```toml
    [provisioning]
    source = "manual"
    iothub_hostname = "IOT_HUB_HOSTNAME"
    device_id = "REQUIRED_DEVICE_ID_PROVISIONED_IN_IOTHUB"

    [provisioning.authentication]
    
    method = "x509"
    identity_cert = "file:///var/snap/azure-iot-identity/common/provisioning/IDENTITY_CERT_FILENAME"
    identity_pk = "file:///var/snap/azure-iot-identity/common/provisioning/IDENTITY_PK_FILENAME"
    ```

    Update the following fields:

    * **iothub_hostname**: Hostname of the IoT Hub where the device connects. For example, `example.azure-devices.net`.
    * **device_id**: The ID that you provided when you registered the device.
    * **identity_cert**: URI to an identity certificate on the device, for example: `file:///var/snap/azure-iot-identity/common/provisioning/identity_certificate.pem`.
    * **identity_pk**: URI to the private key file for the provided identity certificate, for example: `file:///var/snap/azure-iot-identity/common/provisioning/identity_key.pem`.

    For more information about provisioning configuration settings, see [Configure IoT Edge device settings](configure-device.md#provisioning).

1. Save and close the file.

   `CTRL + X`, `Y`, `Enter`

1. Set the configuration for IoT Edge and the Identity Service using the following command:

    ```bash
    sudo snap set azure-iot-edge raw-config="$(cat ~/config.toml)"
    ```

---

## Deploy modules

To deploy your IoT Edge modules, go to your IoT hub in the Azure portal, then:

1. Select **Devices** from the IoT Hub menu.

1. Select your device to open its page.

1. Select the **Set Modules** tab.

1. Since we want to deploy the IoT Edge default modules (edgeAgent and edgeHub), we don't need to add any modules to this pane, so select **Review + create** at the bottom.

1. You see the JSON confirmation of your modules. Select **Create** to deploy the modules.<

For more information, see [Deploy a module](quickstart-linux.md#deploy-a-module).

## Verify successful configuration

Verify that the runtime was successfully installed and configured on your IoT Edge device.

>[!TIP]
>You need elevated privileges to run `iotedge` commands. Once you sign out of your machine and sign back in the first time after installing the IoT Edge runtime, your permissions are automatically updated. Until then, use `sudo` in front of the commands.

Check to see that the IoT Edge system service is running.

```bash
sudo iotedge system status
```

A successful status response is `Ok`.

If you need to troubleshoot the service, retrieve the service logs.


```bash
sudo iotedge system logs
```

Use the `check` tool to verify configuration and connection status of the device.

```bash
sudo iotedge check
```

You can expect a range of responses that may include **OK** (green), **Warning** (yellow), or **Error** (red). For troubleshooting common errors, see [Solutions to common issues for Azure IoT Edge](troubleshoot-common-errors.md).

:::image type="content" source="media/how-to-provision-single-device-linux-x509/config-checks.png" alt-text="Screenshot of sample responses from the check command." lightbox="media/how-to-provision-single-device-linux-x509/config-checks.png":::

>[!TIP]
>Always use `sudo` to run the check tool, even after your permissions are updated. The tool needs elevated privileges to access the config file to verify configuration status.

>[!NOTE]
>On a newly provisioned device, you may see an error related to IoT Edge Hub:
>
>**× production readiness: Edge Hub's storage directory is persisted on the host filesystem - Error**
>
>**Could not check current state of edgeHub container**
>
>This error is expected on a newly provisioned device because the IoT Edge Hub module isn't running. To resolve the error, in IoT Hub, set the modules for the device and create a deployment. Creating a deployment for the device starts the modules on the device including the IoT Edge Hub module.

View all the modules running on your IoT Edge device. When the service starts for the first time, you should only see the **edgeAgent** module running. The edgeAgent module runs by default and helps to install and start any additional modules that you deploy to your device.

   ```bash
   sudo iotedge list
   ```

When you create a new IoT Edge device, it displays the status code `417 -- The device's deployment configuration is not set` in the Azure portal. This status is normal, and means that the device is ready to receive a module deployment.

## Offline or specific version installation (optional)

The steps in this section are for scenarios not covered by the standard installation steps. This may include:

* Install IoT Edge while offline
* Install a release candidate version

Use the steps in this section if you want to install a specific version of the Azure IoT Edge runtime that isn't available through your package manager. The Microsoft package list only contains a limited set of recent versions and their sub-versions, so these steps are for anyone who wants to install an older version or a release candidate version.

If you're using Ubuntu snaps, you can download a snap and install it offline. For more information, see [Download snaps and install offline](https://forum.snapcraft.io/t/download-snaps-and-install-offline/15713).

Using curl commands, you can target the component files directly from the IoT Edge GitHub repository.

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

      # [Ubuntu Core snaps](#tab/snaps)
        If you're using Ubuntu snaps, you can download a snap and install it offline. For more information, see [Download snaps and install offline](https://forum.snapcraft.io/t/download-snaps-and-install-offline/15713).
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

      # [Ubuntu Core snaps](#tab/snaps)
        If you're using Ubuntu snaps, you can download a snap and install it offline. For more information, see [Download snaps and install offline](https://forum.snapcraft.io/t/download-snaps-and-install-offline/15713).

      ---

## Uninstall IoT Edge

If you want to remove the IoT Edge installation from your device, use the following commands.

Remove the IoT Edge runtime.

# [Ubuntu / Debian](#tab/ubuntu+debian)
```bash
sudo apt-get autoremove --purge aziot-edge
```

Leave out the `--purge` flag if you plan to reinstall IoT Edge and use the same configuration information in the future. The `--purge` flags delete all the files associated with IoT Edge, including your configuration files. 

# [Red Hat Enterprise Linux](#tab/rhel)
```bash
sudo yum remove aziot-edge
```

# [Ubuntu Core snaps](#tab/snaps)

Remove the IoT Edge runtime:

```bash
sudo snap remove azure-iot-edge
```

Remove Azure Identity Service:

```bash
sudo snap remove azure-iot-identity
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

# [Ubuntu Core snaps](#tab/snaps)

```bash
sudo snap remove docker
```

## Next steps

Continue to [deploy IoT Edge modules](how-to-deploy-modules-portal.md) to learn how to deploy modules onto your device.

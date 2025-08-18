---
title: Create and provision an Azure IoT Edge for Linux on Windows device using X.509 certificates
description: Create and provision a single IoT Edge for Linux on Windows device in IoT Hub using manual provisioning with X.509 certificates
author: PatAltimore
ms.service: azure-iot-edge
ms.custom: linux-related-content
services: iot-edge
ms.topic: how-to
ms.date: 06/06/2025
ms.author: patricka
---

# Create and provision an IoT Edge for Linux on Windows device using X.509 certificates

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article gives step-by-step instructions for registering and provisioning an IoT Edge for Linux on Windows device.


Each device that connects to an IoT hub has a device ID that tracks cloud-to-device or device-to-cloud communications. You configure a device with its connection information, including the IoT hub hostname, device ID, and the information the device uses to authenticate to IoT Hub.

This article walks you through manual provisioning, where you connect a single device to its IoT hub. For manual provisioning, you can use one of two options to authenticate IoT Edge devices:

* **Symmetric keys**: When you create a new device identity in IoT Hub, the service creates two keys. Place one of the keys on the device, and it presents the key to IoT Hub when authenticating.

  This authentication method lets you get started faster, but isn't as secure.

* **X.509 self-signed**: Create two X.509 identity certificates and place them on the device. When you create a new device identity in IoT Hub, provide thumbprints from both certificates. When the device authenticates to IoT Hub, it presents one certificate and IoT Hub verifies that the certificate matches its thumbprint.

  This authentication method is more secure and is recommended for production scenarios.

This article covers using X.509 certificates as the authentication method. To use symmetric keys, see [Create and provision an IoT Edge for Linux on Windows device using symmetric keys](how-to-provision-single-device-linux-on-windows-symmetric.md).

> [!NOTE]
> If you need to set up many devices and don't want to manually provision each one, use one of the following articles to learn how IoT Edge works with the IoT Hub device provisioning service:
>
> * [Create and provision IoT Edge devices at scale using X.509 certificates](how-to-provision-devices-at-scale-linux-on-windows-x509.md)
> * [Create and provision IoT Edge devices at scale with a TPM](how-to-provision-devices-at-scale-linux-on-windows-tpm.md)
> * [Create and provision IoT Edge devices at scale using symmetric keys](how-to-provision-devices-at-scale-linux-on-windows-symmetric.md)

## Prerequisites

This article covers how to register your IoT Edge device and install IoT Edge for Linux on Windows. These tasks have different prerequisites and use different utilities. Check that you meet all prerequisites before you continue.

<!-- Device registration prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-register-device.md](includes/iot-edge-prerequisites-register-device.md)]

<!-- IoT Edge for Linux on Windows installation prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-linux-on-windows.md](includes/iot-edge-prerequisites-linux-on-windows.md)]

<!-- Generate device identity certificates H2 and content -->
[!INCLUDE [iot-edge-generate-device-identity-certs.md](includes/iot-edge-generate-device-identity-certs.md)]

<!-- Register your device and View provisioning information H2s and content -->
[!INCLUDE [iot-edge-register-device-x509.md](includes/iot-edge-register-device-x509.md)]

<!-- Install IoT Edge for Linux on Windows H2 and content -->
[!INCLUDE [install-iot-edge-linux-on-windows.md](includes/iot-edge-install-linux-on-windows.md)]

## Provision the device with its cloud identity

Set up your device with its cloud identity and authentication information.

To provision your device using X.509 certificates, you need your **IoT hub name**, **device ID**, and the absolute paths to your **identity certificate** and **private key** on your Windows host machine.

Make sure the device identity certificate and its matching private key are on your target device. Know the absolute path to both files.

Run the following command in an elevated PowerShell session on your target device. Replace the placeholder text with your own values.

```powershell
Provision-EflowVm -provisioningType ManualX509 -iotHubHostname "HUB_HOSTNAME_HERE" -deviceId "DEVICE_ID_HERE" -identityCertPath "ABSOLUTE_PATH_TO_IDENTITY_CERT_HERE" -identityPrivKeyPath "ABSOLUTE_PATH_TO_PRIVATE_KEY_HERE"
```

For more information about the `Provision-EflowVM` command, see [PowerShell functions for IoT Edge for Linux on Windows](reference-iot-edge-for-linux-on-windows-functions.md#provision-eflowvm).

## Verify successful configuration

Verify that IoT Edge for Linux on Windows was successfully installed and configured on your IoT Edge device.

1. Sign in to your IoT Edge for Linux on Windows virtual machine using the following command in your PowerShell session:

   ```powershell
   Connect-EflowVm
   ```

   >[!NOTE]
   >The only account allowed to SSH to the virtual machine is the user that created it.

1. Once you're logged in, you can check the list of running IoT Edge modules using the following Linux command:

   ```bash
   sudo iotedge list
   ```

1. If you need to troubleshoot the IoT Edge service, use the following Linux commands.

    1. Retrieve the service logs.

       ```bash
       sudo iotedge system logs
       ```

    2. Use the `check` tool to verify configuration and connection status of the device.

       ```bash
       sudo iotedge check
       ```

    >[!NOTE]
    >On a newly provisioned device, you can see an error related to IoT Edge Hub:
    >
    >**× production readiness: Edge Hub's storage directory is persisted on the host filesystem - Error**
    >
    >**Could not check current state of edgeHub container**
    >
    >This error is expected on a new device because the IoT Edge Hub module isn't running. To fix the error, in IoT Hub, set the modules for the device and create a deployment. Creating a deployment starts the modules on the device, including the IoT Edge Hub module.

When you create a new IoT Edge device, it shows the status code `417 -- The device's deployment configuration is not set` in the Azure portal. This status is normal and means the device is ready to receive a module deployment.

<!-- Uninstall IoT Edge for Linux on Windows H2 and content -->
[!INCLUDE [uninstall-iot-edge-linux-on-windows.md](includes/iot-edge-uninstall-linux-on-windows.md)]

## Next steps

* Continue to [deploy IoT Edge modules](how-to-deploy-modules-portal.md) to learn how to deploy modules on your device.
* Learn how to [manage certificates on your IoT Edge for Linux on Windows virtual machine](how-to-manage-device-certificates.md) and transfer files from the host OS to your Linux virtual machine.
* Learn how to [configure your IoT Edge devices to communicate through a proxy server](how-to-configure-proxy-support.md).

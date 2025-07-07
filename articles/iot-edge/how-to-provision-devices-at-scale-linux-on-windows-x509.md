---
title: Create and provision Azure IoT Edge devices using X.509 certificates on Linux on Windows
description: Use X.509 certificate attestation to test provisioning devices at scale for Azure IoT Edge with device provisioning service
author: PatAltimore
ms.author: patricka
ms.date: 06/06/2025
ms.topic: how-to
ms.service: azure-iot-edge
ms.custom: linux-related-content
services: iot-edge
---

# Create and provision IoT Edge for Linux on Windows devices at scale using X.509 certificates

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article gives step-by-step instructions for autoprovisioning one or more [IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md) devices using X.509 certificates. Automatically provision Azure IoT Edge devices with the [Azure IoT Hub device provisioning service](../iot-dps/index.yml) (DPS). If you aren't familiar with autoprovisioning, review the [provisioning overview](../iot-dps/about-iot-dps.md#provisioning-process) before you continue.

Here are the main tasks:

1. Generate certificates and keys.
1. Create an **individual enrollment** for a single device or a **group enrollment** for a set of devices.
1. Deploy a Linux virtual machine with the IoT Edge runtime installed, and connect it to the IoT Hub.

X.509 certificates let you scale production and simplify device provisioning. Typically, X.509 certificates are arranged in a certificate chain of trust. The chain starts with a self-signed or trusted root certificate, and each certificate in the chain signs the next lower certificate. This pattern creates a delegated chain of trust from the root certificate through each intermediate certificate to the final downstream device certificate installed on a device.

## Prerequisites

<!-- Cloud resources prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-at-scale-cloud-resources.md](includes/iot-edge-prerequisites-at-scale-cloud-resources.md)]

<!-- IoT Edge for Linux on Windows installation prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-linux-on-windows.md](includes/iot-edge-prerequisites-linux-on-windows.md)]

## Generate device identity certificates

The device identity certificate is a downstream certificate that connects through a certificate chain of trust to the top X.509 certificate authority (CA) certificate. Set the common name (CN) of the device identity certificate to the device ID you want the device to use in your IoT hub.

Use device identity certificates only for provisioning the IoT Edge device and authenticating the device with Azure IoT Hub. They aren't signing certificates, unlike the CA certificates that the IoT Edge device presents to modules or downstream devices for verification. For more information, see [Azure IoT Edge certificate usage detail](iot-edge-certs.md).

After you create the device identity certificate, you have two files: a .cer or .pem file that has the public portion of the certificate, and a .cer or .pem file with the private key of the certificate. If you use group enrollment in DPS, you also need the public portion of an intermediate or root CA certificate in the same certificate chain of trust.

You need the following files to set up automatic provisioning with X.509:

* The device identity certificate and its private key certificate. Upload the device identity certificate to DPS if you create an individual enrollment. The private key is passed to the IoT Edge runtime.
* A full chain certificate, which has at least the device identity and the intermediate certificates in it. The full chain certificate is passed to the IoT Edge runtime.
* An intermediate or root CA certificate from the certificate chain of trust. This certificate is uploaded to DPS if you create a group enrollment.

> [!NOTE]
> Currently, a limitation in libiothsm prevents the use of certificates that expire on or after January 1, 2038.

### Use test certificates (optional)

If you don't have a certificate authority available to create new identity certs and want to try out this scenario, the Azure IoT Edge git repository has scripts you can use to generate test certificates. Use these certificates for development testing only, and don't use them in production.

To create test certificates, follow the steps in [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md). Complete the two required sections to set up the certificate generation scripts and create a root CA certificate. Then, follow the steps to create a device identity certificate. When you finish, you have the following certificate chain and key pair:

* `<WRKDIR>\certs\iot-edge-device-identity-<name>-full-chain.cert.pem`
* `<WRKDIR>\private\iot-edge-device-identity-<name>.key.pem`

You need both these certificates on the IoT Edge device. If you use individual enrollment in DPS, upload the .cert.pem file. If you use group enrollment in DPS, also upload an intermediate or root CA certificate in the same certificate chain of trust. If you use demo certificates, use the `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem` certificate for group enrollment.

<!-- Create a DPS enrollment using X.509 certificates H2 and content -->
[!INCLUDE [iot-edge-create-dps-enrollment-x509.md](includes/iot-edge-create-dps-enrollment-x509.md)]

<!-- Install IoT Edge for Linux on Windows H2 and content -->
[!INCLUDE [install-iot-edge-linux-on-windows.md](includes/iot-edge-install-linux-on-windows.md)]

## Provision the device with its cloud identity

After you install the runtime on your device, configure the device with the information it uses to connect to the device provisioning service and IoT Hub.

Make sure you have the following information:

* The DPS **ID Scope** value. You find this value on the overview page of your DPS instance in the Azure portal.
* The device identity certificate chain file on the device.
* The device identity key file on the device.

Run the following command in an elevated PowerShell session. Replace the placeholder values with your own values:

```powershell
Provision-EflowVm -provisioningType DpsX509 -scopeId PASTE_YOUR_ID_SCOPE_HERE -registrationId PASTE_YOUR_REGISTRATION_ID_HERE -identityCertPath PASTE_ABSOLUTE_PATH_TO_IDENTITY_CERTIFICATE_HERE -identityPrivateKey PASTE_ABSOLUTE_PATH_TO_IDENTITY_PRIVATE_KEY_HERE
```

## Verify successful installation

Check that IoT Edge for Linux on Windows is installed and configured on your IoT Edge device.

# [Individual enrollment](#tab/individual-enrollment)

Check that the individual enrollment you created in device provisioning service is used. Go to your device provisioning service instance in the Azure portal. Open the enrollment details for the individual enrollment you created. The status of the enrollment is **assigned**, and the device ID is listed.

# [Group enrollment](#tab/group-enrollment)

Check that the group enrollment you created in device provisioning service is used. Go to your device provisioning service instance in the Azure portal. Open the enrollment details for the group enrollment you created. Go to the **Registration Records** tab to see all devices registered in that group.

---

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

    1. If you need to troubleshoot the service, retrieve the service logs.

       ```bash
       sudo iotedge system logs
       ```

    2. Use the `check` tool to verify configuration and connection status of the device.

       ```bash
       sudo iotedge check
       ```

    >[!NOTE]
    >On a newly provisioned device, you might see an error related to IoT Edge Hub:
    >
    >**× production readiness: Edge Hub's storage directory is persisted on the host filesystem - Error**
    >
    >**Could not check current state of edgeHub container**
    >
    >This error is expected on a newly provisioned device because the IoT Edge Hub module isn't running. To resolve the error, in IoT Hub, set the modules for the device and create a deployment. Creating a deployment for the device starts the modules on the device including the IoT Edge Hub module.

When you create a new IoT Edge device, it shows the status code `417 -- The device's deployment configuration is not set` in the Azure portal. This status is normal and means the device is ready to receive a module deployment.

<!-- Uninstall IoT Edge for Linux on Windows H2 and content -->
[!INCLUDE [uninstall-iot-edge-linux-on-windows.md](includes/iot-edge-uninstall-linux-on-windows.md)]

## Next steps

The device provisioning service enrollment process lets you set the device ID and device twin tags when you provision a new device. Use those values to target individual devices or groups of devices with automatic device management. Learn how to [deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-at-scale.md) or [using Azure CLI](how-to-deploy-cli-at-scale.md).

You can also:

* Continue to [deploy IoT Edge modules](how-to-deploy-modules-portal.md) to learn how to deploy modules onto your device.
* Learn how to [manage certificates on your IoT Edge for Linux on Windows virtual machine](how-to-manage-device-certificates.md) and transfer files from the host OS to your Linux virtual machine.
* Learn how to [configure your IoT Edge devices to communicate through a proxy server](how-to-configure-proxy-support.md).

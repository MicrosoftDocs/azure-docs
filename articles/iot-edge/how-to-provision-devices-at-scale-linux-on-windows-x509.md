---
title: Create and provision IoT Edge devices using X.509 certificates on Linux on Windows - Azure IoT Edge | Microsoft Docs
description: Use X.509 certificate attestation to test provisioning devices at scale for Azure IoT Edge with device provisioning service
author: PatAltimore
ms.author: patricka
ms.date: 11/15/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Create and provision IoT Edge for Linux on Windows devices at scale using X.509 certificates

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

This article provides end-to-end instructions for autoprovisioning one or more [IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md) devices using X.509 certificates. You can automatically provision Azure IoT Edge devices with the [Azure IoT Hub device provisioning service](../iot-dps/index.yml) (DPS). If you're unfamiliar with the process of autoprovisioning, review the [provisioning overview](../iot-dps/about-iot-dps.md#provisioning-process) before continuing.

The tasks are as follows:

1. Generate certificates and keys.
1. Create either an **individual enrollment** for a single device or a **group enrollment** for a set of devices.
1. Deploy a Linux virtual machine with the IoT Edge runtime installed and connect it to the IoT Hub.

Using X.509 certificates as an attestation mechanism is an excellent way to scale production and simplify device provisioning. Typically, X.509 certificates are arranged in a certificate chain of trust. Starting with a self-signed or trusted root certificate, each certificate in the chain signs the next lower certificate. This pattern creates a delegated chain of trust from the root certificate down through each intermediate certificate to the final downstream device certificate installed on a device.

## Prerequisites

<!-- Cloud resources prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-at-scale-cloud-resources.md](includes/iot-edge-prerequisites-at-scale-cloud-resources.md)]

<!-- IoT Edge for Linux on Windows installation prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-linux-on-windows.md](includes/iot-edge-prerequisites-linux-on-windows.md)]

## Generate device identity certificates

The device identity certificate is a downstream certificate that connects through a certificate chain of trust to the top X.509 certificate authority (CA) certificate. The device identity certificate must have its common name (CN) set to the device ID that you want the device to have in your IoT hub.

Device identity certificates are only used for provisioning the IoT Edge device and authenticating the device with Azure IoT Hub. They aren't signing certificates, unlike the CA certificates that the IoT Edge device presents to modules or downstream devices for verification. For more information, see [Azure IoT Edge certificate usage detail](iot-edge-certs.md).

After you create the device identity certificate, you should have two files: a .cer or .pem file that contains the public portion of the certificate, and a .cer or .pem file with the private key of the certificate. If you plan to use group enrollment in DPS, you also need the public portion of an intermediate or root CA certificate in the same certificate chain of trust.

You need the following files to set up automatic provisioning with X.509:

* The device identity certificate and its private key certificate. The device identity certificate is uploaded to DPS if you create an individual enrollment. The private key is passed to the IoT Edge runtime.
* A full chain certificate, which should have at least the device identity and the intermediate certificates in it. The full chain certificate is passed to the IoT Edge runtime.
* An intermediate or root CA certificate from the certificate chain of trust. This certificate is uploaded to DPS if you create a group enrollment.

> [!NOTE]
> Currently, a limitation in libiothsm prevents the use of certificates that expire on or after January 1, 2038.

### Use test certificates (optional)

If you don't have a certificate authority available to create new identity certs and want to try out this scenario, the Azure IoT Edge git repository contains scripts that you can use to generate test certificates. These certificates are designed for development testing only, and must not be used in production.

To create test certificates, follow the steps in [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md). Complete the two required sections to set up the certificate generation scripts and to create a root CA certificate. Then, follow the steps to create a device identity certificate. When you're finished, you should have the following certificate chain and key pair:

* `<WRKDIR>\certs\iot-edge-device-identity-<name>-full-chain.cert.pem`
* `<WRKDIR>\private\iot-edge-device-identity-<name>.key.pem`

You need both these certificates on the IoT Edge device. If you're going to use individual enrollment in DPS, then you will upload the .cert.pem file. If you're going to use group enrollment in DPS, then you also need an intermediate or root CA certificate in the same certificate chain of trust to upload. If you're using demo certs, use the `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem` certificate for group enrollment.

<!-- Create a DPS enrollment using X.509 certificates H2 and content -->
[!INCLUDE [iot-edge-create-dps-enrollment-x509.md](includes/iot-edge-create-dps-enrollment-x509.md)]

<!-- Install IoT Edge for Linux on Windows H2 and content -->
[!INCLUDE [install-iot-edge-linux-on-windows.md](includes/iot-edge-install-linux-on-windows.md)]

## Provision the device with its cloud identity

Once the runtime is installed on your device, configure the device with the information it uses to connect to the device provisioning service and IoT Hub.

Have the following information ready:

* The DPS **ID Scope** value. You can retrieve this value from the overview page of your DPS instance in the Azure portal.
* The device identity certificate chain file on the device.
* The device identity key file on the device.

Run the following command in an elevated PowerShell session with the placeholder values updated with your own values:

```powershell
Provision-EflowVm -provisioningType DpsX509 -scopeId PASTE_YOUR_ID_SCOPE_HERE -registrationId PASTE_YOUR_REGISTRATION_ID_HERE -identityCertPath PASTE_ABSOLUTE_PATH_TO_IDENTITY_CERTIFICATE_HERE -identityPrivateKey PASTE_ABSOLUTE_PATH_TO_IDENTITY_PRIVATE_KEY_HERE
```

## Verify successful installation

Verify that IoT Edge for Linux on Windows was successfully installed and configured on your IoT Edge device.

# [Individual enrollment](#tab/individual-enrollment)

You can verify that the individual enrollment that you created in device provisioning service was used. Navigate to your device provisioning service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.

# [Group enrollment](#tab/group-enrollment)

You can verify that the group enrollment that you created in device provisioning service was used. Navigate to your device provisioning service instance in the Azure portal. Open the enrollment details for the group enrollment that you created. Go to the **Registration Records** tab to view all devices registered in that group.

---

1. Log in to your IoT Edge for Linux on Windows virtual machine using the following command in your PowerShell session:

   ```powershell
   Connect-EflowVm
   ```

   >[!NOTE]
   >The only account allowed to SSH to the virtual machine is the user that created it.

1. Once you are logged in, you can check the list of running IoT Edge modules using the following Linux command:

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
    >On a newly provisioned device, you may see an error related to IoT Edge Hub:
    >
    >**× production readiness: Edge Hub's storage directory is persisted on the host filesystem - Error**
    >
    >**Could not check current state of edgeHub container**
    >
    >This error is expected on a newly provisioned device because the IoT Edge Hub module isn't running. To resolve the error, in IoT Hub, set the modules for the device and create a deployment. Creating a deployment for the device starts the modules on the device including the IoT Edge Hub module.

When you create a new IoT Edge device, it will display the status code `417 -- The device's deployment configuration is not set` in the Azure portal. This status is normal, and means that the device is ready to receive a module deployment.

<!-- Uninstall IoT Edge for Linux on Windows H2 and content -->
[!INCLUDE [uninstall-iot-edge-linux-on-windows.md](includes/iot-edge-uninstall-linux-on-windows.md)]

## Next steps

The device provisioning service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices using automatic device management. Learn how to [Deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-at-scale.md) or [using Azure CLI](how-to-deploy-cli-at-scale.md).

You can also:

* Continue to [deploy IoT Edge modules](how-to-deploy-modules-portal.md) to learn how to deploy modules onto your device.
* Learn how to [manage certificates on your IoT Edge for Linux on Windows virtual machine](how-to-manage-device-certificates.md) and transfer files from the host OS to your Linux virtual machine.
* Learn how to [configure your IoT Edge devices to communicate through a proxy server](how-to-configure-proxy-support.md).
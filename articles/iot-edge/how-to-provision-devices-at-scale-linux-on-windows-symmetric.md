---
title: Create and provision IoT Edge devices using symmetric keys on Linux on Windows - Azure IoT Edge | Microsoft Docs
description: Use symmetric key attestation to test provisioning Linux on Windows devices at scale for Azure IoT Edge with device provisioning service
author: PatAltimore
ms.author: patricka
ms.date: 11/15/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Create and provision IoT Edge for Linux on Windows devices at scale using symmetric keys

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

This article shows how to autoprovision one or more [IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md) devices using symmetric keys. You can automatically provision Azure IoT Edge devices with the [Azure IoT Hub device provisioning service](../iot-dps/index.yml) (DPS). If you're unfamiliar with the process of autoprovisioning, review the [provisioning overview](../iot-dps/about-iot-dps.md#provisioning-process) before continuing.


The tasks are as follows:

1. Create either an **individual enrollment** for a single device or a **group enrollment** for a set of devices.
1. Deploy a Linux virtual machine with the IoT Edge runtime installed and connect it to the IoT Hub.

Symmetric key attestation is a simple approach to authenticating a device with a device provisioning service instance. This attestation method represents a "Hello world" experience for developers who are new to device provisioning, or do not have strict security requirements. Device attestation using a [TPM](../iot-dps/concepts-tpm-attestation.md) or [X.509 certificates](../iot-dps/concepts-x509-attestation.md) is more secure, and should be used for more stringent security requirements.

## Prerequisites

<!-- Cloud resources prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-at-scale-cloud-resources.md](includes/iot-edge-prerequisites-at-scale-cloud-resources.md)]

<!-- IoT Edge for Linux on Windows installation prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-linux-on-windows.md](includes/iot-edge-prerequisites-linux-on-windows.md)]

<!-- Create a DPS enrollment using symmetric keys H2 and content -->
[!INCLUDE [iot-edge-create-dps-enrollment-symmetric.md](includes/iot-edge-create-dps-enrollment-symmetric.md)]

<!-- Install IoT Edge for Linux on Windows H2 and content -->
[!INCLUDE [install-iot-edge-linux-on-windows.md](includes/iot-edge-install-linux-on-windows.md)]

## Provision the device with its cloud identity

Once the runtime is installed on your device, configure the device with the information it uses to connect to the device provisioning service and IoT Hub.

Have the following information ready:

* The DPS **ID Scope** value
* The device **Registration ID** you created
* Either the **Primary Key** from an individual enrollment, or a [derived key](#derive-a-device-key) for devices using a group enrollment.

Run the following command in an elevated PowerShell session with the placeholder values updated with your own values:

```powershell
Provision-EflowVm -provisioningType DpsSymmetricKey -scopeId PASTE_YOUR_ID_SCOPE_HERE -registrationId PASTE_YOUR_REGISTRATION_ID_HERE -symmKey PASTE_YOUR_PRIMARY_KEY_OR_DERIVED_KEY_HERE
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

    1. Retrieve the service logs.

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

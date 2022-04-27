---
title: Create and provision IoT Edge devices using symmetric keys on Windows - Azure IoT Edge | Microsoft Docs
description: Use symmetric key attestation to test provisioning Windows devices at scale for Azure IoT Edge with device provisioning service
author: PatAltimore
ms.author: patricka
ms.date: 10/27/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
monikerRange: "=iotedge-2018-06"
---
# Create and provision IoT Edge devices at scale on Windows using symmetric keys

[!INCLUDE [iot-edge-version-201806](../../includes/iot-edge-version-201806.md)]

This article provides end-to-end instructions for autoprovisioning one or more Windows IoT Edge devices using symmetric keys. You can automatically provision Azure IoT Edge devices with the [Azure IoT Hub device provisioning service](../iot-dps/index.yml) (DPS). If you're unfamiliar with the process of autoprovisioning, review the [provisioning overview](../iot-dps/about-iot-dps.md#provisioning-process) before continuing.

>[!NOTE]
>Azure IoT Edge with Windows containers will not be supported starting with version 1.2 of Azure IoT Edge.
>
>Consider using the new method for running IoT Edge on Windows devices, [Azure IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md).
>
>If you want to use Azure IoT Edge for Linux on Windows, you can follow the steps in the [equivalent how-to guide](how-to-provision-devices-at-scale-linux-on-windows-symmetric.md).

The tasks are as follows:

1. Create either an **individual enrollment** for a single device or a **group enrollment** for a set of devices.
1. Install the IoT Edge runtime and connect to the IoT Hub.

Symmetric key attestation is a simple approach to authenticating a device with a device provisioning service instance. This attestation method represents a "Hello world" experience for developers who are new to device provisioning, or do not have strict security requirements. Device attestation using a [TPM](../iot-dps/concepts-tpm-attestation.md) or [X.509 certificates](../iot-dps/concepts-x509-attestation.md) is more secure, and should be used for more stringent security requirements. <!-- note links here; they will break -->

## Prerequisites

<!-- Cloud resources prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-at-scale-cloud-resources.md](../../includes/iot-edge-prerequisites-at-scale-cloud-resources.md)]

### Device requirements

A physical or virtual Windows device to be the IoT Edge device.

You will need to define a *unique* **registration ID** to identify each device. You can use the MAC address, serial number, or any unique information from the device. For example, you could use a combination of a MAC address and serial number forming the following string for a registration ID: `sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6`. Valid characters are lowercase alphanumeric and dash (`-`).

<!-- Create a DPS enrollment using symmetric keys H2 and content -->
[!INCLUDE [iot-edge-create-dps-enrollment-symmetric.md](../../includes/iot-edge-create-dps-enrollment-symmetric.md)]

<!-- Install IoT Edge on Windows H2 and content -->
[!INCLUDE [install-iot-edge-windows.md](../../includes/iot-edge-install-windows.md)]

## Provision the device with its cloud identity

Once the runtime is installed on your device, configure the device with the information it uses to connect to the device provisioning service and IoT Hub.

Have the following information ready:

* The DPS **ID Scope** value
* The device **Registration ID** you created
* Either the **Primary Key** from an individual enrollment, or a [derived key](#derive-a-device-key) for devices using a group enrollment.

1. Open a PowerShell window in administrator mode. Be sure to use an AMD64 session of PowerShell when installing IoT Edge, not PowerShell (x86).

1. The **Initialize-IoTEdge** command configures the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers, so use the `-DpsSymmetricKey` flag to use automatic provisioning with symmetric key authentication.

   Replace the placeholder values for `paste_scope_id_here`, `paste_registration_id_here`, and `paste_symmetric_key_here` with the data you collected earlier.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -DpsSymmetricKey -ScopeId paste_scope_id_here -RegistrationId paste_registration_id_here -SymmetricKey paste_symmetric key_here
   ```

## Verify successful installation

If the runtime started successfully, you can go into your IoT Hub and start deploying IoT Edge modules to your device.

# [Individual enrollment](#tab/individual-enrollment)

You can verify that the individual enrollment that you created in device provisioning service was used. Navigate to your device provisioning service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.

# [Group enrollment](#tab/group-enrollment)

You can verify that the group enrollment that you created in device provisioning service was used. Navigate to your device provisioning service instance in the Azure portal. Open the enrollment details for the group enrollment that you created. Go to the **Registration Records** tab to view all devices registered in that group.

---

Use the following commands on your device to verify that the IoT Edge installed and started successfully.

Check the status of the IoT Edge service.

```powershell
Get-Service iotedge
```

Examine service logs.

```powershell
. {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog
```

List running modules.

```powershell
iotedge list
```

## Next steps

The device provisioning service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices using automatic device management. Learn how to [Deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-at-scale.md) or [using Azure CLI](how-to-deploy-cli-at-scale.md).

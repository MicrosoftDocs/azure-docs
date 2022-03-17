---
title: Create and provision devices with a virtual TPM on Windows - Azure IoT Edge | Microsoft Docs 
description: Use a simulated TPM on a Windows device to test the Azure device provisioning service for Azure IoT Edge
author: PatAltimore
ms.author: patricka
ms.date: 10/28/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
monikerRange: "=iotedge-2018-06"
---

# Create and provision IoT Edge devices at scale with a TPM on Windows

[!INCLUDE [iot-edge-version-201806](../../includes/iot-edge-version-201806.md)]

This article provides instructions for autoprovisioning an Azure IoT Edge for Windows device by using a Trusted Platform Module (TPM). You can automatically provision IoT Edge devices with the [Azure IoT Hub device provisioning service](../iot-dps/index.yml). If you're unfamiliar with the process of autoprovisioning, review the [provisioning overview](../iot-dps/about-iot-dps.md#provisioning-process) before you continue.

>[!NOTE]
>Azure IoT Edge with Windows containers will not be supported starting with version 1.2 of Azure IoT Edge.
>
>Consider using the new method for running IoT Edge on Windows devices, [Azure IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md).
>
>If you want to use Azure IoT Edge for Linux on Windows, you can follow the steps in the [equivalent how-to guide](how-to-provision-devices-at-scale-linux-on-windows-tpm.md).

This article outlines two methodologies. Select your preference based on the architecture of your solution:

- Autoprovision a Windows device with physical TPM hardware.
- Autoprovision a Windows device running a simulated TPM. We recommend this methodology only as a testing scenario. A simulated TPM doesn't offer the same security as a physical TPM.

Instructions differ based on your methodology, so make sure you're on the correct tab going forward.

The tasks are as follows:

# [Physical TPM](#tab/physical-tpm)

* Retrieve your device's provisioning information.
* Create an individual enrollment for the device.
* Install the IoT Edge runtime and connect the device to IoT Hub.

# [Simulated TPM](#tab/simulated-tpm)

* Set up your simulated TPM and retrieve its provisioning information.
* Create an individual enrollment for the device.
* Install the IoT Edge runtime and connect the device to IoT Hub.

---

## Prerequisites

The prerequisites are the same for physical TPM and virtual TPM solutions.

<!-- Cloud resources prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-at-scale-cloud-resources.md](../../includes/iot-edge-prerequisites-at-scale-cloud-resources.md)]

### Device requirements

A Windows development machine. This article uses Windows 10.

> [!NOTE]
> TPM 2.0 is required when you use TPM attestation with the device provisioning service.
>
> You can only create individual, not group, device provisioning service enrollments when you use a TPM.

## Set up your TPM

# [Physical TPM](#tab/physical-tpm)

In this section, you build a tool that you can use to retrieve the registration ID and endorsement key for your TPM.

1. Follow the steps in [Set up a Windows development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md#set-up-a-windows-development-environment) to install and build the Azure IoT device SDK for C.

1. Run the following commands in an elevated PowerShell session to build the SDK tool that retrieves your device provisioning information for your TPM.

   ```powershell
   cd azure-iot-sdk-c\cmake
   cmake -Duse_prov_client:BOOL=ON ..
   cd provisioning_client\tools\tpm_device_provision
   make
   .\tpm_device_provision
   ```

1. The output window displays the device's **Registration ID** and the **Endorsement key**. Copy these values for use later when you create an individual enrollment for your device in the device provisioning service.

> [!TIP]
> If you don't want to use the SDK tool to retrieve the information, you need to find another way to obtain the provisioning information. The endorsement key, which is unique to each TPM chip, is obtained from the TPM chip manufacturer associated with it. You can derive a unique registration ID for your TPM device. For example, you can create an SHA-256 hash of the endorsement key.

After you have your registration ID and endorsement key, you're ready to continue.

# [Simulated TPM](#tab/simulated-tpm)

If you don't have a physical TPM available and want to test this provisioning method, you can simulate a TPM on your device.

The IoT Hub device provisioning service provides samples that simulate a TPM and return the endorsement key and registration ID for you.

1. Choose one of the samples from the following list based on your preferred language.
1. Stop following the device provisioning service sample steps after you have the simulated TPM running and have collected the **Endorsement key** and **Registration ID**. Don't select **Enter** to run registration in the sample application.
1. Keep the window hosting the simulated TPM running until you're finished testing this scenario.
1. Return to this article to create a device provisioning service enrollment and configure your device.

Simulated TPM samples:

* [C](../iot-dps/quick-create-simulated-device-tpm.md)
* [Java](../iot-dps/quick-create-simulated-device-tpm.md)
* [C#](../iot-dps/quick-create-simulated-device-tpm.md)
* [Node.js](../iot-dps/quick-create-simulated-device-tpm.md)
* [Python](../iot-dps/quick-create-simulated-device-tpm.md)

---

<!-- Create an enrollment for your device using TPM provisioning information H2 and content -->
[!INCLUDE [tpm-create-a-device-provision-service-enrollment.md](../../includes/tpm-create-a-device-provision-service-enrollment.md)]

<!-- Install IoT Edge on Windows H2 and content -->
[!INCLUDE [install-iot-edge-windows.md](../../includes/iot-edge-install-windows.md)]

## Provision the device with its cloud identity

After the runtime is installed on your device, configure the device with the information it uses to connect to the device provisioning service and IoT Hub.

1. Know your device provisioning service **ID Scope** and device **Registration ID** that were gathered in the previous sections.

1. Open a PowerShell window in administrator mode. Be sure to use an AMD64 session of PowerShell when you install IoT Edge, not PowerShell (x86).

1. The `Initialize-IoTEdge` command configures the IoT Edge runtime on your machine. The command defaults to manual provisioning with Windows containers. Use the `-Dps` flag to use the device provisioning service instead of manual provisioning.

   Replace the placeholder values for `paste_scope_id_here` and `paste_registration_id_here` with the data you collected earlier.

   ```powershell
   . {Invoke-WebRequest -useb https://aka.ms/iotedge-win} | Invoke-Expression; `
   Initialize-IoTEdge -Dps -ScopeId paste_scope_id_here -RegistrationId paste_registration_id_here
   ```

## Verify successful installation

If the runtime started successfully, go into your IoT hub and start deploying IoT Edge modules to your device. Use the following commands on your device to verify that the runtime installed and started successfully.

1. Check the status of the IoT Edge service.

    ```powershell
    Get-Service iotedge
    ```

1. Examine service logs from the last 5 minutes.

    ```powershell
    . {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; Get-IoTEdgeLog
    ```

1. List running modules.

    ```powershell
    iotedge list
    ```

## Next steps

The device provisioning service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices by using automatic device management.

Learn how to [deploy and monitor IoT Edge modules at scale by using the Azure portal](how-to-deploy-at-scale.md) or [the Azure CLI](how-to-deploy-cli-at-scale.md).

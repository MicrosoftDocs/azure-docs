---
title: Create and provision an IoT Edge for Linux on Windows device by using a TPM - Azure IoT Edge | Microsoft Docs 
description: Use a simulated TPM on a Linux on Windows device to test the Azure device provisioning service for Azure IoT Edge.
author: PatAltimore
manager: lizross
ms.author: patricka
ms.reviewer: fcabrera
ms.date: 02/09/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Create and provision an IoT Edge for Linux on Windows device at scale by using a TPM

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

This article provides instructions for autoprovisioning an Azure IoT Edge for Linux on Windows device by using a Trusted Platform Module (TPM). You can automatically provision Azure IoT Edge devices with the [Azure IoT Hub device provisioning service](../iot-dps/index.yml). If you're unfamiliar with the process of autoprovisioning, review the [provisioning overview](../iot-dps/about-iot-dps.md#provisioning-process) before you continue.

This article outlines two methodologies. Select your preference based on the architecture of your solution:

* Autoprovision a Linux on Windows device with physical TPM hardware.
* Autoprovision a Linux on Windows device by using a simulated TPM. We recommend this methodology only as a testing scenario. A simulated TPM doesn't offer the same security as a physical TPM.

The tasks are as follows:

# [Physical TPM](#tab/physical-tpm)

* Install IoT Edge for Linux on Windows.
* Retrieve the TPM information from your device.
* Create an individual enrollment for the device.
* Provision your device with its TPM information.

# [Simulated TPM](#tab/simulated-tpm)

* Install IoT Edge for Linux on Windows.
* Set up your simulated TPM and retrieve its provisioning information.
* Create an individual enrollment for the device.
* Provision your device with its TPM information.

---

## Prerequisites

<!-- Cloud resources prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-at-scale-cloud-resources.md](includes/iot-edge-prerequisites-at-scale-cloud-resources.md)]

<!-- IoT Edge for Linux on Windows installation prerequisites H3 and content -->
[!INCLUDE [iot-edge-prerequisites-linux-on-windows.md](includes/iot-edge-prerequisites-linux-on-windows.md)]

> [!NOTE]
> TPM 2.0 is required when you use TPM attestation with the device provisioning service.
>
> You can only create individual, not group, device provisioning service enrollments when you use a TPM.

<!-- Install IoT Edge for Linux on Windows H2 and content -->
[!INCLUDE [install-iot-edge-linux-on-windows.md](includes/iot-edge-install-linux-on-windows.md)]

There are some steps to prepare your device for provisioning with TPM. Leave your deployment open while you prepare your device. You'll return to your deployment later in the article.

## Enable TPM passthrough

The IoT Edge for Linux on Windows VM has a TPM feature that can be enabled or disabled. By default, it's disabled. When this feature is enabled, the VM can access the host machine's TPM.

1. Open PowerShell in an elevated session.

1. If you haven't already, set the execution policy on your device to `AllSigned` so that you can run the IoT Edge for Linux on Windows PowerShell functions.

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy AllSigned -Force
   ```

1. Turn on the TPM feature.

   ```powershell
   Set-EflowVmFeature -feature 'DpsTpm' -enable
   ```

## Retrieve the TPM information from your device

# [Physical TPM](#tab/physical-tpm)

To provision your device, you need an **Endorsement key** for your TPM chip and **Registration ID** for your device. You provide this information to your instance of the device provisioning service so that the service can recognize your device when it tries to connect.

The endorsement key is unique to each TPM chip. It is obtained from the TPM chip manufacturer associated with it. You can derive a unique registration ID for your TPM device by, for example, creating an SHA-256 hash of the endorsement key.

IoT Edge for Linux on Windows provides a PowerShell script to help retrieve this information from your TPM. To use the script, follow these steps on your device:

1. Open PowerShell in an elevated session.

1. Run the command.

   ```powershell
   Get-EflowVmTpmProvisioningInfo | Format-List
   ```

# [Simulated TPM](#tab/simulated-tpm)

If you don't have a physical TPM available and want to test this provisioning method, you can simulate a TPM on your device.

The IoT Hub device provisioning service provides samples that simulate a TPM and return the endorsement key and registration ID for you.

1. Choose one of the samples from the following list, based on your preferred language.
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

## Provision the device with its cloud identity

1. Open an elevated PowerShell session on the Windows device.

1. Provision your device by using the **Scope ID** that you collected from your instance of the device provisioning service.

   ```powershell
   Provision-EflowVM -provisioningType "DpsTpm" -scopeId "SCOPE_ID_HERE"
   ```
   
   If you have enrolled the device using a custom **Registration Id**, you must specify that registration ID as well when provisioning:
   
   ```powershell
   Provision-EflowVM -provisioningType "DpsTpm" -scopeId "SCOPE_ID_HERE" -registrationId "REGISTRATION_ID_HERE"
   ```

## Verify successful installation

Verify that IoT Edge for Linux on Windows was successfully installed and configured on your IoT Edge device.

If the runtime started successfully, you can go into your IoT hub and start deploying IoT Edge modules to your device.

You can verify that the individual enrollment that you created in the device provisioning service was used. Go to your device provisioning service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.


Use the following commands on your device to verify that the IoT Edge installed and started successfully.

1. Connect to your IoT Edge for Linux on Windows VM by using the following command in your PowerShell session:

   ```powershell
   Connect-EflowVm
   ```

   >[!NOTE]
   >The only account allowed to SSH to the VM is the user who created it.

1. After you're signed in, you can check the list of running IoT Edge modules by using the following Linux command:

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


<!-- Uninstall IoT Edge for Linux on Windows H2 and content -->
[!INCLUDE [uninstall-iot-edge-linux-on-windows.md](includes/iot-edge-uninstall-linux-on-windows.md)]

## Next steps

The device provisioning service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices by using automatic device management.

Learn how to [deploy and monitor IoT Edge modules at scale by using the Azure portal](how-to-deploy-at-scale.md) or [the Azure CLI](how-to-deploy-cli-at-scale.md).

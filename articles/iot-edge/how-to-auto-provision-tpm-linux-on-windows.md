---
title: Auto-provision Windows devices with DPS and TPM - Azure IoT Edge | Microsoft Docs 
description: Use automatic device provisioning for IoT Edge for Linux on Windows with Device Provisioning Service and TPM attestation
author: kgremban
manager: lizross
ms.author: kgremban
ms.reviewer: fcabrera
ms.date: 06/11/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Create and provision an IoT Edge for Linux on Windows device with TPM attestation

[!INCLUDE [iot-edge-version-201806](../../includes/iot-edge-version-201806.md)]

Azure IoT Edge devices can be provisioned using the [Device Provisioning Service](../iot-dps/index.yml) just like devices that are not edge-enabled. If you're unfamiliar with the process of auto-provisioning, review the [provisioning](../iot-dps/about-iot-dps.md#provisioning-process) overview before continuing.

DPS supports Trusted Platform Module (TPM) attestation for IoT Edge devices only for individual enrollment, not group enrollment.

This article shows you how to use auto-provisioning on a device running IoT Edge for Linux on Windows with the following steps:

* Retrieve the TPM information from your device.
* Create an instance of IoT Hub Device Provisioning Service (DPS).
* Create an individual enrollment for the device.
* Install IoT Edge for Linux on Windows and connect the device to IoT Hub.

## Prerequisites

* A Windows device. For supported Windows versions, see [Operating systems](support.md#operating-systems).
* An active IoT Hub.

> [!NOTE]
> TPM 2.0 is required when using TPM attestation with DPS and can only be used to create individual, not group, enrollments.

## Retrieve the TPM information from your device

--> TODO

If you're using a physical TPM device, you need to determine the **Endorsement key**, which is unique to each TPM chip and is obtained from the TPM chip manufacturer associated with it. You can derive a unique **Registration ID** for your TPM device by, for example, creating an SHA-256 hash of the endorsement key.

## Set up the IoT Hub Device Provisioning Service

Create a new instance of the IoT Hub Device Provisioning Service in Azure, and link it to your IoT hub. You can follow the instructions in [Set up the IoT Hub DPS](../iot-dps/quick-setup-auto-provision.md).

After you have the Device Provisioning Service running, copy the value of **ID Scope** from the overview page. You use this value when you configure the IoT Edge runtime.

## Create an individual enrollment for your device

When you create an enrollment in DPS, you have the opportunity to declare an **Initial Device Twin State**. In the device twin you can set tags to group devices by any metric you need in your solution, like region, environment, location, or device type. These tags are used to create [automatic deployments](how-to-deploy-at-scale.md).

When you create the individual enrollment, select **True** to declare that the simulated TPM device on your Windows development machine is an **IoT Edge device**.

> [!TIP]
> In the Azure CLI, you can create an [enrollment](/cli/azure/iot/dps/enrollment) or an [enrollment group](/cli/azure/iot/dps/enrollment-group) and use the **edge-enabled** flag to specify that a device, or group of devices, is an IoT Edge device.

## Install IoT Edge for Linux on Windows

The installation steps in this section are abridged to highlight the steps specific to the TPM provisioning scenario. For more detailed instructions, including prerequisites and remote installation steps, see [Install and provision Azure IoT Edge for Linux on a Windows device](how-to-install-iot-edge-on-windows.md).

1. Open an elevated PowerShell session on the Windows device.

1. Download IoT Edge for Linux on Windows.

   ```powershell
   $msiPath = $([io.Path]::Combine($env:TEMP, 'AzureIoTEdge.msi'))
   $ProgressPreference = 'SilentlyContinue'
   Invoke-WebRequest "https://aka.ms/AzEflowMSI" -OutFile $msiPath
   ```

1. Install IoT Edge for Linux on Windows on your device.

   ```powershell
   Start-Process -Wait msiexec -ArgumentList "/i","$([io.Path]::Combine($env:TEMP, 'AzureIoTEdge.msi'))","/qn"
   ```

1. For the deployment to run successfully, you need to set the execution policy on the device to `AllSigned` if it is not already.

   1. Check the current execution policy.

      ```powershell
      Get-ExecutionPolicy -List
      ```

   1. If the execution policy of `local machine` is not `AllSigned`, update the execution policy.

      ```powershell
      Set-ExecutionPolicy -ExecutionPolicy AllSigned -Force
      ```

1. Deploy IoT Edge for Linux on Windows.

   ```powershell
   Deploy-Eflow
   ```

1. Enter `Y` to accept the license terms.

1. Enter `O` or `R` to toggle **Optional diagnostic data** on or off, depending on your preference.

1. The output will report **Deployment successful** once IoT Edge for Linux on Windows has been successfully deployed to your device.

1. Provision your device using the **Scope ID** that you collected from your instance of Device Provisioning Service.

   ```powershell
   Provision-EflowVM -provisioningType "DpsTpm" -scopeId "<scope id>"
   ```

## Verify successful installation


## Next steps

The Device Provisioning Service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices using automatic device management. Learn how to [Deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-at-scale.md) or [using Azure CLI](how-to-deploy-cli-at-scale.md)

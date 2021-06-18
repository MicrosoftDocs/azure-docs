---
title: Auto-provision Windows devices with DPS and TPM - Azure IoT Edge | Microsoft Docs 
description: Use automatic device provisioning for IoT Edge for Linux on Windows with Device Provisioning Service and TPM attestation
author: kgremban
manager: lizross
ms.author: kgremban
ms.reviewer: fcabrera
ms.date: 06/18/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
monikerRange: "=iotedge-2018-06"
---

# Create and provision an IoT Edge for Linux on Windows device with TPM attestation

[!INCLUDE [iot-edge-version-201806](../../includes/iot-edge-version-201806.md)]

Azure IoT Edge devices can be provisioned using the [Device Provisioning Service](../iot-dps/index.yml) just like devices that are not edge-enabled. If you're unfamiliar with the process of auto-provisioning, review the [provisioning](../iot-dps/about-iot-dps.md#provisioning-process) overview before continuing.

DPS supports Trusted Platform Module (TPM) attestation for IoT Edge devices only for individual enrollment, not group enrollment.

This article shows you how to use auto-provisioning on a device running IoT Edge for Linux on Windows with the following steps:

* Retrieve the TPM information from your device.
* Create an individual enrollment for the device.
* Install IoT Edge for Linux on Windows and connect the device to IoT Hub.

>[!TIP]
>This article uses programs that simulate a TPM on the device to test this scenario, but much of it applies when using physical TPM hardware as well.

## Prerequisites

* A Windows device. For supported Windows versions, see [Operating systems](support.md#operating-systems).
* An active IoT hub.
* An instance of the IoT Hub Device Provisioning Service in Azure, linked to your IoT hub.
  * If you don't have a Device Provisioning Service instance, follow the instructions in [Set up the IoT Hub DPS](../iot-dps/quick-setup-auto-provision.md).
  * After you have the Device Provisioning Service running, copy the value of **ID Scope** from the overview page. You use this value when you configure the IoT Edge runtime.

> [!NOTE]
> TPM 2.0 is required when using TPM attestation with DPS and can only be used to create individual, not group, enrollments.

## Simulate a TPM for your device

To provision your device, you need to gather information from your TPM chip and provide it to your instance of the Device Provisioning Service (DPS) so that the service can recognize your device when it tries to connect.

First, you need to determine the **Endorsement key**, which is unique to each TPM chip and is obtained from the TPM chip manufacturer associated with it. Then, you need to provide a **Registration ID** for your device. You can derive a unique registration ID for your TPM device by, for example, creating an SHA-256 hash of the endorsement key.

DPS provides samples that simulate a TPM and return the endorsement key and registration ID for you.

1. Choose one of the samples from the following list, based on your preferred language.
1. Keep the window hosting the simulated TPM running until you're completely finished testing this scenario.
1. When you create the DPS enrollment for your device, make sure you select **True** to declare that this enrollment is for an **IoT Edge device**.
1. Stop following the DPS sample steps once you save your individual enrollment, then return to this article to set up IoT Edge for Linux on Windows.

Simulated TPM samples:

* [C](../iot-dps/quick-create-simulated-device.md)
* [Java](../iot-dps/quick-create-simulated-device-tpm-java.md)
* [C#](../iot-dps/quick-create-simulated-device-tpm-csharp.md)
* [Node.js](../iot-dps/quick-create-simulated-device-tpm-node.md)
* [Python](../iot-dps/quick-create-simulated-device-tpm-python.md)

## Install IoT Edge for Linux on Windows

The installation steps in this section are abridged to highlight the steps specific to the TPM provisioning scenario. For more detailed instructions, including prerequisites and remote installation steps, see [Install and provision Azure IoT Edge for Linux on a Windows device](how-to-install-iot-edge-on-windows.md).

# [PowerShell](#tab/powershell)

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

# [Windows Admin Center](#tab/windowsadmincenter)

>[!NOTE]
>The Azure IoT Edge extension for Windows Admin Center is currently in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Installation and management processes may be different than for generally available features.

1. Have Windows Admin Center configured with the **Azure IoT Edge** extension.

1. On the Windows Admin Center connections page, select **Add**.

1. On the **Add or create resources** pane, located the **Azure IoT Edge** tile. Select **Create new** to install a new instance of Azure IoT Edge for Linux on Windows on a device.

1. Follow the steps in the deployment wizard to install and configure IoT Edge for Linux on Windows.

   1. On the **Getting Started** steps, review the prerequisites, accept the license terms, and choose whether or not to send diagnostic data.

   1. On the **Deploy** steps, choose your device and its configuration settings. Then observe the progress as IoT Edge is deployed to your device.

   1. Select **Next** to continue to the **Connect** step, where you provide the provisioning information for your device.

---

## Configure the device with provisioning information

# [PowerShell](#tab/powershell)

1. Open an elevated PowerShell session on the Windows device.

1. Provision your device using the **Scope ID** that you collected from your instance of Device Provisioning Service.

   ```powershell
   Provision-EflowVM -provisioningType "DpsTpm" -scopeId "<scope id>"
   ```

# [Windows Admin Center](#tab/windowsadmincenter)

1. On the **Connect** step, provision your device.

   1. Select the **DpsTpm** provisioning method.
   1. Provide the **Scope ID** that you retrieve from your instance of the Device Provisioning Service.

   ![Provision your device with DPS and TPM attestation.](./media/how-to-auto-provision-tpm-linux-on-windows/tpm-provision.png)

1. Select **Provisioning with the selected method**.

1. Once IoT Edge has successfully been installed and provisioned on your device, select **Finish** to exit the deployment wizard.

---

## Verify successful configuration

If the runtime started successfully, you can go into your IoT Hub and start deploying IoT Edge modules to your device.

You can verify that the individual enrollment that you created in Device Provisioning Service was used. Navigate to your Device Provisioning Service instance in the Azure portal. Open the enrollment details for the individual enrollment that you created. Notice that the status of the enrollment is **assigned** and the device ID is listed.

Use the following commands on your device to verify that the IoT Edge installed and started successfully.

Connect to the IoT Edge for Linux on Windows virtual machine.

```powershell
Connect-EflowVM
```

Check the status of the IoT Edge service.

```cmd/sh
sudo systemctl status iotedge
```

Examine service logs.

```cmd/sh
sudo journalctl -u iotedge --no-pager --no-full
```

List running modules.

```cmd/sh
sudo iotedge list
```

## Next steps

The Device Provisioning Service enrollment process lets you set the device ID and device twin tags at the same time as you provision the new device. You can use those values to target individual devices or groups of devices using automatic device management. Learn how to [Deploy and monitor IoT Edge modules at scale using the Azure portal](how-to-deploy-at-scale.md) or [using Azure CLI](how-to-deploy-cli-at-scale.md)

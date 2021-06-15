---
title: PowerShell functions for Azure IoT Edge for Linux on Windows | Microsoft Docs 
description: Reference information for Azure IoT Edge for Linux on Windows PowerShell functions to deploy, provision, and status IoT Edge for Linux on Windows virtual machines.
author: v-tcassi
manager: philmea
ms.author: v-tcassi
ms.date: 02/16/2021
ms.topic: reference
ms.service: iot-edge
services: iot-edge
monikerRange: "=iotedge-2018-06"
---

# PowerShell functions for IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-201806](../../includes/iot-edge-version-201806.md)]

Understand the PowerShell functions that deploy, provision, and get the status your IoT Edge for Linux on Windows virtual machine.

The commands described in this article are from the `AzureEFLOW.psm1` file, which can be found on your system in your `WindowsPowerShell` directory under `C:\Program Files\WindowsPowerShellModules\AzureEFLOW`.

## Deploy-Eflow

The **Deploy-Eflow** command is the main deployment method. The deployment command creates the virtual machine, provisions files, and deploys the IoT Edge agent module. While none of the parameters are required, they can be used to provision your IoT Edge device during the deployment and modify settings for the virtual machine during creation. For a full list, use the command `Get-Help Deploy-Eflow -full`.  

>[!NOTE]
>For the provisioning type, **X509** currently exclusively refers to X509 provisioning using an [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md). The manual X509 provisioning method is not currently supported.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| acceptEula | Yes - No | Defines a shortcut to accept/deny EULA and bypass the EULA prompt. |
| acceptOptionalTelemetry | Yes - No |  Defines a shortcut to accept/deny optional telemetry and bypass the telemetry prompt. |
| cpuCount | Integer value between 1 and the device's CPU cores |  Number of CPU cores for the VM. **Default value**: 1 vCore. |
| memoryInMB | Integer value between 1024 and the maximum amount of free memory of the device |Memory allocated for the VM.  **Default value**: 1024 MB. |
| vmDiskSize | Between 8 GB and 256 GB | Maximum disk size of the dynamically expanding virtual hard disk. **Default value**: 16 GB. |
| gpuName | GPU Device name |  Name of GPU device to be used for passthrough. |
| gpuPassthroughType | DirectDeviceAssignment, ParaVirtualization,  "" (No passthrough) |  GPU Passthrough type |
| gpuCount | Integer value between 1 and the device's GPU cores | Number of GPU devices for the VM **Note**: Only valid when using DirectDeviceAssignment |

## Verify-EflowVm

The **Verify-EflowVm** command is an exposed function to check that the IoT Edge for Linux on Windows virtual machine was created. It takes only common parameters, and it will return **true** if the virtual machine was created and **false** if not. For additional information, use the command `Get-Help Verify-EflowVm -full`.

## Provision-EflowVm

The **Provision-EflowVm** command adds the provisioning information for your IoT Edge device to the virtual machine's IoT Edge `config.yaml` file. Provisioning can also be done during the deployment phase by setting parameters in the **Deploy-Eflow** command. For additional information, use the command `Get-Help Provision-EflowVm -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| provisioningType | **manual**, **TPM**, **X509**, or **symmetric** |  Defines the type of provisioning you wish to use for your IoT Edge device. |
| devConnString | The device connection string of an existing IoT Edge device | Device connection string for manually provisioning an IoT Edge device (**manual**). |
| symmKey | The primary key for an existing DPS enrollment or the primary key of an existing IoT Edge device registered using symmetric keys | Symmetric key for provisioning an IoT Edge device (**DPS**, **symmetric**). |
| scopeId | The scope ID for an existing DPS instance. | Scope ID for provisioning an IoT Edge device (**DPS**). |
| registrationId | The registration ID of an existing IoT Edge device | Registration ID for provisioning an IoT Edge device (**DPS**). |
| iotHubHostname | The host name of an existing IoT Hub | Azure IoT Hub hostname for provisioning an IoT Edge device (**ManualX509**). |
| deviceId | The device ID of an existing IoT Edge device | Edge device ID for provisioning an IoT Edge device (**ManualX509**). |
| identityCertPath | Directory path; must be in a folder that can be owned by the `iotedge` service | Absolute destination path of the identity certificate on your virtual machine for provisioning an IoT Edge device (**DPS**, **X509**). |
| identityPrivKeyPath | Directory path | Absolute source path of the identity certificate in Windows for provisioning an IoT Edge device (**dps**, **X509**). |

## Get-EflowVmName

The **Get-EflowVmName** command is used to query the virtual machine's current hostname. This command exists to account for the fact that the Windows hostname can change over time. It takes only common parameters, and it will return the virtual machine's current hostname. For additional information, use the command `Get-Help Get-EflowVmName -full`.

## Get-EflowLogs

The **Get-EflowLogs** command is used to collect and bundle logs from the IoT Edge for Linux on Windows deployment and installation. It outputs the bundled logs in the form of a `.zip` folder. For additional information, use the command `Get-Help Get-EflowLogs -full`.

## Get-EflowVmAddr

The **Get-EflowVmAddr** command is used to find and display the virtual machine's IP and MAC addresses. It takes only common parameters. For additional information, use the command `Get-Help Get-EflowVmAddr -full`.

## Get-EflowVmInfo

The **Get-EflowVmInfo** command is used to collect and display system information from the virtual machine, such as memory, cpu, and storage usage. Furthermore contains information about the VM name, IoT Edge and Moby version. For additional information, use the command `Get-Help Get-EflowVmInfo -full`.

## Get-EflowVmEdgeInformation

The **Get-EflowVmEdgeInformation** command is used to collect and display IoT Edge information from the virtual machine, such as the version of IoT Edge the virtual machine is running. For additional information, use the command `Get-Help Get-EflowVmEdgeInformation -full`.

## Get-EflowVmFeature

The **Get-EflowVmFeature** command is used to query and display the status of the enablement of EFLOW features. For additional information, use the command `Get-Help Get-EflowVmFeature -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| feature | "DpsTpm" - "gpu" | Feature name to toggle. |

## Set-EflowVmFeature

The **Set-EflowVmFeature** command is used to enable/disable the status of EFLOW features. For additional information, use the command `Get-Help Set-EflowVmFeature -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| feature | "DpsTpm" - "gpu" | Feature name to toggle. |
| enable | "DpsTpm" - "gpu" | If present, enables the feature|

## Get-EflowOptionalTelemetry

The **Get-EflowOptionalTelemetry** command is used to query and display the status of the optional telemetry inside the EFLOW VM. For additional information, use the command `Get-Help Get-EflowOptionalTelemetry -full`.

## Set-EflowOptionalTelemetry

The **Set-EflowOptionalTelemetry** command is used to enable/disable the optional telemetry inside the EFLOW VM. For additional information, use the command `Get-Help Set-EflowOptionalTelemetry -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| optionalTelemetry | true - false | Whether optional telemetry is selected. |

## Connect-EflowVm

The **Connect-EflowVm** command is used to connect into the virtual machine using SSH. The only account allowed to SSH to the virtual machine is the user that created it. For additional information, use the command `Get-Help Connect-EflowVm -full`.

## Start-EflowVm

The **Start-EflowVm** command is used to start the EFLOW VM. If the VM is already started, no action is taken. For additional information, use the command `Get-Help Start-EflowVm -full`.

## Stop-EflowVm

The **Stop-EflowVm** command is used to stop the EFLOW VM. If the VM is already stopped, no action is taken. For additional information, use the command `Get-Help Stop-EflowVm -full`.

## Next steps

Learn how to use these commands in the following article:

* [Install Azure IoT Edge for Linux on Windows](./how-to-install-iot-edge-windows-on-windows.md)

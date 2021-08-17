---
title: PowerShell functions for Azure IoT Edge for Linux on Windows | Microsoft Docs 
description: Reference information for Azure IoT Edge for Linux on Windows PowerShell functions to deploy, provision, and status IoT Edge for Linux on Windows virtual machines.
author: v-tcassi

ms.author: fcabrera
ms.date: 06/18/2021
ms.topic: reference
ms.service: iot-edge
services: iot-edge
monikerRange: "=iotedge-2018-06"
---

# PowerShell functions for IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-201806](../../includes/iot-edge-version-201806.md)]

Understand the PowerShell functions that deploy, provision, and get the status of your IoT Edge for Linux on Windows (EFLOW) virtual machine.

## Prerequisites

The commands described in this article are from the `AzureEFLOW.psm1` file, which can be found on your system in your `WindowsPowerShell` directory under `C:\Program Files\WindowsPowerShell\Modules\AzureEFLOW`.

If you don't have the **AzureEflow** folder in your PowerShell directory, use the following steps to download and install Azure IoT Edge for Linux on Windows: 

1. In an elevated PowerShell session, run each of the following commands to download IoT Edge for Linux on Windows.

   ```powershell
   $msiPath = $([io.Path]::Combine($env:TEMP, 'AzureIoTEdge.msi'))
   $ProgressPreference = 'SilentlyContinue'
   Invoke-WebRequest "https://aka.ms/AzEflowMSI" -OutFile $msiPath
   ```

1. Install IoT Edge for Linux on Windows on your device.

   ```powershell
   Start-Process -Wait msiexec -ArgumentList "/i","$([io.Path]::Combine($env:TEMP, 'AzureIoTEdge.msi'))","/qn"
   ```

   You can specify custom installation and VHDX directories by adding `INSTALLDIR="<FULLY_QUALIFIED_PATH>"` and `VHDXDIR="<FULLY_QUALIFIED_PATH>"` parameters to the install command.

1. Set the execution policy on the target device to `AllSigned` if it is not already.

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy AllSigned -Force
   ```

## Connect-EflowVM

The **Connect-EflowVM** command connects to the virtual machine using SSH. The only account allowed to SSH to the virtual machine is the user that created it.

This command only works on a PowerShell session running on the host device. It won't work when using Windows Admin Center or PowerShell ISE.

For more information, use the command `Get-Help Connect-EflowVM -full`.

## Copy-EflowVmFile

The **Copy-EflowVmFile** command copies file to or from the virtual machine using SCP. Use the optional parameters to specify the source and destination file paths as well as the direction of the copy.

The user **iotedge-user** must have read permission to any origin directories or write permission to any destination directories on the virtual machine.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| fromFile | String representing path to file | Defines the file to be read from. |
| toFile | String representing path to file |  Defines the file to be written to. |
| pushFile | None | This flag indicates copy direction. If present, the command pushes the file to the virtual machine. If absent, the command pulls the file from the virtual machine. |

For more information, use the command `Get-Help Copy-EflowVMFile -full`.

## Deploy-Eflow

The **Deploy-Eflow** command is the main deployment method. The deployment command creates the virtual machine, provisions files, and deploys the IoT Edge agent module. While none of the parameters are required, they can be used to provision your IoT Edge device during the deployment and modify settings for the virtual machine during creation.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| acceptEula | **Yes** or **No** | A shortcut to accept/deny EULA and bypass the EULA prompt. |
| acceptOptionalTelemetry | **Yes** or **No** |  A shortcut to accept/deny optional telemetry and bypass the telemetry prompt. |
| cpuCount | Integer value between 1 and the device's CPU cores |  Number of CPU cores for the VM.<br><br>**Default value**: 1 vCore. |
| memoryInMB | Integer value between 1024 and the maximum amount of free memory of the device |Memory allocated for the VM.<br><br>**Default value**: 1024 MB. |
| vmDiskSize | Between 8 GB and 256 GB | Maximum disk size of the dynamically expanding virtual hard disk.<br><br>**Default value**: 16 GB. |
| vswitchName | Name of the virtual switch |  Name of the virtual switch assigned to the EFLOW VM. |
| vswitchType | **Internal** or **External** | Type of the virtual switch assigned to the EFLOW VM. |
| ip4Address | IPv4 Address in the range of the DCHP Server Scope | Static Ipv4 address of the EFLOW VM. _NOTE: Only supported with ICS Default Switch_. |
| ip4PrefixLength | IPv4 Prefix Length of the subnet | Ipv4 subnet prefix length, only valid when static Ipv4 address is specified.  _NOTE: Only supported with ICS Default Switch_. |
| ip4GatewayAddress | IPv4 Address of the subnet gateway | Gateway Ipv4 address, only valid when static Ipv4 address is specified.  _NOTE: Only supported with ICS Default Switch_. |
| gpuName | GPU Device name |  Name of GPU device to be used for passthrough. |
| gpuPassthroughType | **DirectDeviceAssignment**, **ParaVirtualization**, or none (CPU only) |  GPU Passthrough type |
| gpuCount | Integer value between 1 and the number of the device's GPU cores | Number of GPU devices for the VM. <br><br>**Note**: If using ParaVirtualization, make sure to set gpuCount = 1 |

For more information, use the command `Get-Help Deploy-Eflow -full`.  

## Get-EflowHostConfiguration

The **Get-EflowHostConfiguration** command returns the host configuration. This command takes no parameters. It returns an object that contains four properties:

* FreePhysicalMemoryInMB
* NumberOfLogicalProcessors
* DiskInfo
* GpuInfo

For more information, use the command `Get-Help Get-EflowHostConfiguration -full`.


## Get-EflowLogs

The **Get-EflowLogs** command collects and bundles logs from the IoT Edge for Linux on Windows deployment and installation. It outputs the bundled logs in the form of a `.zip` folder.

For more information, use the command `Get-Help Get-EflowLogs -full`.

## Get-EflowVm

The **Get-EflowVm** command returns the virtual machine's current configuration. This command takes no parameters. It returns an object that contains four properties:

* VmConfiguration
* EdgeRuntimeVersion
* EdgeRuntimeStatus
* SystemStatistics

To view a specific property in a readable list, run the `Get-EflowVM` command with the property expanded. For example:

```powershell
Get-EflowVM | Select -ExpandProperty VmConfiguration | Format-List
```

For more information, use the command `Get-Help Get-EflowVm -full`.

## Get-EflowVmAddr

The **Get-EflowVmAddr** command is used to query the virtual machine's current IP and MAC address. This command exists to account for the fact that the IP and MAC address can change over time.

For additional information, use the command `Get-Help Get-EflowVmAddr -full`.

## Get-EflowVmFeature

The **Get-EflowVmFeature** command returns the status of the enablement of IoT Edge for Linux on Windows features.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| feature | **DpsTpm** | Feature name to toggle. |

For more information, use the command `Get-Help Get-EflowVmFeature -full`.

## Get-EflowVmName

The **Get-EflowVmName** command returns the virtual machine's current hostname. This command exists to account for the fact that the Windows hostname can change over time.

For more information, use the command `Get-Help Get-EflowVmName -full`.

## Get-EflowVmTelemetryOption

The **Get-EflowVmTelemetryOption** command displays the status of the telemetry (either **Optional** or **Required**) inside the virtual machine.

For more information, use the command `Get-Help Get-EflowVmTelemetryOption -full`.


## Get-EflowVmTpmProvisioningInfo

The **Get-EflowVmTpmProvisioningInfo** command returns the TPM provisioning information. This command takes no parameters. It returns an object that contains two properties:

* Endorsement Key
* Registration Id 

For more information, use the command `Get-Help Get-EflowVmTpmProvisioningInfo -full`.



## Invoke-EflowVmCommand

The **Invoke-EflowVMCommand** command executes a Linux command inside the virtual machine and returns the output. This command only works for Linux commands that return a finite output. It cannot be used for Linux commands that require user interaction or that run indefinitely.

The following optional parameters can be used to specify the command in advance.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| command | String | Command to be executed in the VM. |
| ignoreError | None |  If this flag is present, ignore errors from the command. |

For more information, use the command `Get-Help Invoke-EflowVmCommand -full`.

## Provision-EflowVm

The **Provision-EflowVm** command adds the provisioning information for your IoT Edge device to the virtual machine's IoT Edge `config.yaml` file.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| provisioningType | **ManualConnectionString**, **ManualX509**, **DpsTPM**, **DpsX509**, or **DpsSymmetricKey** |  Defines the type of provisioning you wish to use for your IoT Edge device. |
| devConnString | The device connection string of an existing IoT Edge device | Device connection string for manually provisioning an IoT Edge device (**ManualConnectionString**). |
| iotHubHostname | The host name of an existing IoT hub | Azure IoT Hub hostname for provisioning an IoT Edge device (**ManualX509**). |
| deviceId | The device ID of an existing IoT Edge device | Device ID for provisioning an IoT Edge device (**ManualX509**). |
| scopeId | The scope ID for an existing DPS instance. | Scope ID for provisioning an IoT Edge device (**DpsTPM**, **DpsX509**, or **DpsSymmetricKey**). |
| symmKey | The primary key for an existing DPS enrollment or the primary key of an existing IoT Edge device registered using symmetric keys | Symmetric key for provisioning an IoT Edge device (**DpsSymmetricKey**). |
| registrationId | The registration ID of an existing IoT Edge device | Registration ID for provisioning an IoT Edge device (**DpsSymmetricKey**). |
| identityCertPath | Directory path | Absolute destination path of the identity certificate on your Windows host machine (**ManualX509**, **DpsX509**). |
| identityPrivKeyPath | Directory path | Absolute source path of the identity private key on your Windows host machine (**ManualX509**, **DpsX509**). |

For more information, use the command `Get-Help Provision-EflowVm -full`.

## Set-EflowVM

The **Set-EflowVM** command updates the virtual machine configuration with the requested properties. Use the optional parameters to define a specific configuration for the virtual machine.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| cpuCount | Integer value between 1 and the device's GPU cores | Number of CPU cores for the VM. |
| memoryInMB | Integer value between 1024 and the maximum amount of free memory of the device | Memory allocated for the VM. |
| gpuName | GPU device name |  Name of the GPU device to be used for passthrough. |
| gpuPassthroughType | **DirectDeviceAssignment**, **ParaVirtualization**, or none (no passthrough) |  GPU Passthrough type |
| gpuCount | Integer value between 1 and the device's GPU cores | Number of GPU devices for the VM **Note**: Only valid when using DirectDeviceAssignment |
| headless | None | If this flag is present, it determines whether the user needs to confirm in case a security warning is issued. |

For more information, use the command `Get-Help Set-EflowVM -full`.

## Set-EflowVmFeature

The **Set-EflowVmFeature** command enables or disables the status of IoT Edge for Linux on Windows features.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| feature | **DpsTpm** | Feature name to toggle. |
| enable | None | If this flag is present, the command enables the feature. |

For more information, use the command `Get-Help Set-EflowVmFeature -full`.

## Set-EflowVmTelemetryOption

The **Set-EflowVmTelemetryOption** command enables or disables the optional telemetry inside the virtual machine.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| optionalTelemetry | **True** or **False** | Whether optional telemetry is selected. |

For more information, use the command `Get-Help Set-EflowVmTelemetryOption -full`.

## Start-EflowVm

The **Start-EflowVm** command starts the virtual machine. If the virtual machine is already started, no action is taken.

For more information, use the command `Get-Help Start-EflowVm -full`.

## Stop-EflowVm

The **Stop-EflowVm** command stops the virtual machine. If the virtual machine is already stopped, no action is taken.

For more information, use the command `Get-Help Stop-EflowVm -full`.

## Verify-EflowVm

The **Verify-EflowVm** command is an exposed function that checks whether the IoT Edge for Linux on Windows virtual machine was created. It takes only common parameters, and it will return **True** if the virtual machine was created and **False** if not.

For more information, use the command `Get-Help Verify-EflowVm -full`.

## Next steps

Learn how to use these commands to install and provision IoT Edge for Linux on Windows in the following article:

* [Install Azure IoT Edge for Linux on Windows](./how-to-install-iot-edge-windows-on-windows.md)
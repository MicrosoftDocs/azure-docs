---
title: PowerShell scripts for Azure IoT Edge for Linux on Windows | Microsoft Docs 
description: Reference information for Azure IoT Edge for Linux on Windows PowerShell scripts to deploy, provision, and status IoT Edge for Linux on Windows virtual machines.
author: v-tcassi
manager: philmea
ms.author: v-tcassi
ms.date: 02/16/2021
ms.topic: reference
ms.service: iot-edge
services: iot-edge
monikerRange: "=iotedge-2018-06"
---

# PowerShell scripts for IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-201806](../../includes/iot-edge-version-201806.md)]

Understand the PowerShell scripts that deploy, provision, and get the status your IoT Edge for Linux on Windows virtual machine.

The commands described in this article are from the `AzureEFLOW.psm1` file, which can be found on your system in your `WindowsPowerShell` directory under `C:\Program Files\WindowsPowerShellModules\AzureEFLOW`.

## Deploy-Eflow

The **Deploy-Eflow** command is the main deployment method. The deployment command creates the virtual machine, provisions files, and deploys the IoT Edge agent module. While none of the parameters are required, they can be used to provision your IoT Edge device during the deployment and modify settings for the virtual machine during creation. For a full list, use the command `Get-Help Deploy-Eflow -full`.  

>[!NOTE]
>For the provisioning type, **X509** currently exclusively refers to X509 provisioning using an [Azure IoT Hub Device Provisioning Service](../iot-dps/about-iot-dps.md). The manual X509 provisioning method is not currently supported.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| eflowVhdxDir | Directory path | Directory where deployment stores VHDX file for VM. |
| provisioningType | **manual**, **TPM**, **X509**, or **symmetric** |  Defines the type of provisioning you wish to use for your IoT Edge device. |
| devConnString | The device connection string of an existing IoT Edge device | Device connection string for manually provisioning an IoT Edge device (**manual**). |
| symmKey | The primary key for an existing DPS enrollment or the primary key of an existing IoT Edge device registered using symmetric keys | Symmetric key for provisioning an IoT Edge device (**X509** or **symmetric**). |
| scopeId | The scope ID for an existing DPS instance. | Scope ID for provisioning an IoT Edge device (**X509** or **symmetric**). |
| registrationId | The registration ID of an existing IoT Edge device | Registration ID for provisioning an IoT Edge device (**X509** or **symmetric**). |
| identityCertLocVm | Directory path; must be in a folder that can be owned by the `iotedge` service | Absolute destination path of the identity certificate on your virtual machine for provisioning an IoT Edge device (**X509** or **symmetric**). |
| identityCertLocWin | Directory path | Absolute source path of the identity certificate in Windows for provisioning an IoT Edge device (**X509** or **symmetric**). |
| identityPkLocVm |  | Directory path; must be in a folder that can be owned by the `iotedge` service | Absolute destination path of the identity private key on your virtual machine for provisioning an IoT Edge device (**X509** or **symmetric**). |
| identityPkLocWin | Directory path | Absolute source path of the identity private key in Windows for provisioning an IoT Edge device (**X509** or **symmetric**). |
| vmSizeDefintion | No longer than 30 characters | Definition of the number of cores and available RAM for the virtual machine. **Default value**: Standard_K8S_v1. |
| vmDiskSize | Between 8 GB and 256 GB | Maximum disk size of the dynamically expanding virtual hard disk. **Default value**: 16 GB. |
| vmUser | No longer than 30 characters | Username for logging on to the virtual machine. |
| vnetType | **Transparent** or **ICS** | The type of virtual switch. **Default value**: Transparent. |
| vnetName | No longer than 64 characters | The name of the virtual switch. **Default value**: External. |
| enableVtpm | None | **Switch parameter**. Create the virtual machine with TPM enabled or disabled. |
| mobyPackageVersion | No longer than 30 characters |  Version of Moby package to be verified or installed on the virtual machine.  **Default value:** 19.03.11. |
| iotedgePackageVersion | No longer than 30 characters | Version of IoT Edge package to be verified or installed on the virtual machine. **Default value:** 1.1.0. |
| installPackages | None | **Switch parameter**. When toggled, the script will attempt to install the Moby and IoT Edge packages rather than only verifying the packages are present. |

## Verify-EflowVm

The **Verify-EflowVm** command is an exposed function to check that the IoT Edge for Linux on Windows virtual machine was created. It takes only common parameters, and it will return **true** if the virtual machine was created and **false** if not. For additional information, use the command `Get-Help Verify-EflowVm -full`.

## Provision-EflowVm

The **Provision-EflowVm** command adds the provisioning information for your IoT Edge device to the virtual machine's IoT Edge `config.yaml` file. Provisioning can also be done during the deployment phase by setting parameters in the **Deploy-Eflow** command. For additional information, use the command `Get-Help Provision-EflowVm -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| vmUser | No longer than 30 characters | Username for logging on to the virtual machine. |
| provisioningType | **manual**, **TPM**, **X509**, or **symmetric** |  Defines the type of provisioning you wish to use for your IoT Edge device. |
| devConnString | The device connection string of an existing IoT Edge device | Device connection string for manually provisioning an IoT Edge device (**manual**). |
| symmKey | The primary key for an existing DPS enrollment or the primary key of an existing IoT Edge device registered using symmetric keys | Symmetric key for provisioning an IoT Edge device (**DPS**, **symmetric**). |
| scopeId | The scope ID for an existing DPS instance. | Scope ID for provisioning an IoT Edge device (**DPS**). |
| registrationId | The registration ID of an existing IoT Edge device | Registration ID for provisioning an IoT Edge device (**DPS**). |
| identityCertLocVm | Directory path; must be in a folder that can be owned by the `iotedge` service | Absolute destination path of the identity certificate on your virtual machine for provisioning an IoT Edge device (**DPS**, **X509**). |
| identityCertLocWin | Directory path | Absolute source path of the identity certificate in Windows for provisioning an IoT Edge device (**dps**, **X509**). |
| identityPkLocVm |  | Directory path; must be in a folder that can be owned by the `iotedge` service | Absolute destination path of the identity private key on your virtual machine for provisioning an IoT Edge device (**DPS**, **X509**). |
| identityPkLocWin | Directory path | Absolute source path of the identity private key in Windows for provisioning an IoT Edge device (**dps**, **X509**). |

## Get-EflowVmName

The **Get-EflowVmName** command is used to query the virtual machine's current hostname. This command exists to account for the fact that the Windows hostname can change over time. It takes only common parameters, and it will return the virtual machine's current hostname. For additional information, use the command `Get-Help Get-EflowVmName -full`.

## Get-EflowLogs

The **Get-EflowLogs** command is used to collect and bundle logs from the IoT Edge for Linux on Windows deployment. It outputs the bundled logs in the form of a `.zip` folder. For additional information, use the command `Get-Help Get-EflowLogs -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| vmUser | No longer than 30 characters | Username for logging on to the virtual machine. |

## Get-EflowVmTpmProvisioningInfo

The **Get-EflowVmTpmProvisioningInfo** command is used to collect and display the virtual machine's vTPM provisioning information. If the virtual machine was created without vTPM, the command will return that it was unable to find TPM provisioning information. For additional information, use the command `Get-Help Get-EflowVmTpmProvisioningInfo -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| vmUser | No longer than 30 characters | Username for logging on to the virtual machine. |

## Get-EflowVmAddr

The **Get-EflowVmAddr** command is used to find and display the virtual machine's IP and MAC addresses. It takes only common parameters. For additional information, use the command `Get-Help Get-EflowVmAddr -full`.

## Get-EflowVmSystemInformation

The **Get-EflowVmSystemInformation** command is used to collect and display system information from the virtual machine, such as memory and storage usage. For additional information, use the command `Get-Help Get-EflowVmSystemInformation -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| vmUser | No longer than 30 characters | Username for logging on to the virtual machine. |

## Get-EflowVmEdgeInformation

The **Get-EflowVmEdgeInformation** command is used to collect and display IoT Edge information from the virtual machine, such as the version of IoT Edge the virtual machine is running. For additional information, use the command `Get-Help Get-EflowVmEdgeInformation -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| vmUser | No longer than 30 characters | Username for logging on to the virtual machine. |

## Get-EflowVmEdgeModuleList

The **Get-EflowVmEdgeModuleList** command is used to query and display the list of IoT Edge modules running on the virtual machine. For additional information, use the command `Get-Help Get-EflowVmEdgeModuleList -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| vmUser | No longer than 30 characters | Username for logging on to the virtual machine. |

## Get-EflowVmEdgeStatus

The **Get-EflowVmEdgeStatus** command is used to query and display the status of IoT Edge runtime on the virtual machine. For additional information, use the command `Get-Help Get-EflowVmEdgeStatus -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| vmUser | No longer than 30 characters | Username for logging on to the virtual machine. |

## Get-EflowVmUserName

The **Get-EflowVmUserName** command is used to query and display the virtual machine username that was used to create the virtual machine from the registry. It takes only common parameters. For additional information, use the command `Get-Help Get-EflowVmUserName -full`.

## Get-EflowVmSshKey

The **Get-EflowVmSshKey** command is used to query and display the SSH key used by the virtual machine. It takes only common parameters. For additional information, use the command `Get-Help Get-EflowVmSshKey -full`.

## Ssh-EflowVm

The **Ssh-EflowVm** command is used to SSH into the virtual machine. The only account allowed to SSH to the virtual machine is the user that created it. For additional information, use the command `Get-Help Ssh-EflowVm -full`.

| Parameter | Accepted values | Comments |
| --------- | --------------- | -------- |
| vmUser | No longer than 30 characters | Username for logging on to the virtual machine. |

## Next steps

Learn how to use these commands in the following article:

* [Install Azure IoT Edge for Linux on Windows](how-to-install-iot-edge-windows.md)

* Refer to [the IoT Edge for Linux on Windows PowerShell script reference](reference-iot-edge-for-linux-on-windows-scripts.md#deploy-eflow) for all the commands available through PowerShell.

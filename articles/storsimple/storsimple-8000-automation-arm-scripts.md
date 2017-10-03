---
title: Use Azure Resource Manager scripts to manage StorSimple devices | Microsoft Docs
description: Learn how to use Azure Resource Manager scripts to automate StorSimple jobs
services: storsimple
documentationcenter: NA
author: alkohli
manager: jeconnoc
editor: ''

ms.assetid:
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 10/03/2017
ms.author: alkohli
---

# Use Azure Resource Manager scripts to maange StorSimple devices

This articles describes how Azure Resource Manager scripts can be used to manage your StorSimple 8000 series deivce. An example script is also included to walk you through the steps of configuring your environment to run scripts.

This article applies to StorSimple 8000 series devices running in Azure portal only. 

## Azure Resource Manager scripts to automate StorSimple jobs
The scripts available to automate various StorSimple jobs are tabulated below.

| Azure Resource   Manager Script                  | Description                                                                                                                                                                                                       |
|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Authorize-ServiceEncryptionRollover.ps1          | This script allows you to authorize your StorSimple device to change the service data encryption key.                                                                                                           |
| Create-StorSimpleCloudAppliance.ps1              | This script creates an 8010 or an 8020 StorSimple Cloud Appliance that can then be configured and registered with your StorSimple Data Manager service.                                                       |
| CreateOrUpdate-Volume.ps1                        | This script creates or modifies StorSimple volumes.                                                                                                                                                             |
| Get-DeviceBackup.ps1                             | This script lists all the backups for a device registered with your StorSimple Device Manager service.                                                                                                          |
| Get-DeviceBackupPolicy.ps1                       | This script all the backup policies for your StorSimple device.                                                                                                                                                 |
| Get-DeviceJobs.ps1                               | This script gets all the StorSimple jobs running on your StorSimple Device Manager service.                                                                                                                     |
| Get-DeviceUpdateAvailability.ps1                 | This script scans the Update server and lets you know if updates are available to install on your StorSimple device.                                                                                          |
| Install-DeviceUpdate.ps1                         | This script installs the available updates on your StorSimple device.                                                                                                                                           |
| Manage-CloudSnapshots.ps1                        | This script starts a manual cloud snapshot and deletes cloud snapshots older than specified retention days.                                                                                                   |
| Monitor-Backups.ps1                              | This Azure Automation Runbook powershell script reports the status of all backup jobs.                                                                                                              |
| Remove-DeviceBackup.ps1                          | This script deletes a single backup object.                                                                                                                                                           |
| Remove-ExpiredDeviceBackups.ps1                  | This script starts a manual cloud snapshot and deletes the backup cloud snapshots older than specified retention days.                                                                              |
| Start-DeviceBackupJob.ps1                        | This script starts a manual backup on your StorSimple device.                                                                                                                                       |
| Update-CloudApplianceServiceEncryptionKey.ps1    | This script updates the service data encryption key for all the 8010/8020 StorSimple Cloud Appliances registered with your StorSimple Device Manager service.                                     |
| Verify-BackupScheduleAndBackup.ps1               | This script highlights the missing backups after analyzing all the schedules associated with backup policies. It also verifies the backup catalog with the list of available backups.             |


## Prerequisites

Before you begin, ensure that you have:

*	Azure Powershell installed. To install Azure PowerShell modules:
    * In a Windows environment, follow the steps in [Install and configure Azure Powershell](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps?view=azurermps-4.4.0). You can install Azure PowerShell on your Windows Server host for your StorSimple if using one.
    * In a Linux or MacOS environment, folow the steps in [Install and configure Azure PowerShell on MacOS or Linux](https://docs.microsoft.com/en-us/powershell/azure/install-azureps-maclinux?view=azurermps-4.4.0).

For more information about using Azure PowerShell, go to [Get started with using Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/get-started-azureps?view=azurermps-4.4.0).

## Run an Azure Resource Manager script
This section takes an example script and details the various steps required to run the script.

1. Launch PowerShell. Create a new folder and change directory to the new folder.

```
            > mkdir C:\scripts\StorSimpleSDKTools
            > cd C:\scripts\StorSimpleSDKTools

```    
2. Download nuget CLI under the folder created in previous step. Various versions of nuget.exe are available on nuget.org/downloads. Each download link points directly to an _.exe_ file, so be sure to right-click and save the file to your computer rather than running it from the browser.

```
            > wget https://dist.nuget.org/win-x86-commandline/latest/nuget.exe -Out :\scripts\StorSimpleSDKTools\nuget.exe

```    
3. Download the dependent SDK.

```
            > C:\scripts\StorSimpleSDKTools\nuget.exe install Microsoft.Azure.Management.Storsimple8000series
            > C:\scripts\StorSimpleSDKTools\nuget.exe install Microsoft.IdentityModel.Clients.ActiveDirectory -Version 2.28.3
            > C:\scripts\StorSimpleSDKTools\nuget.exe install Microsoft.Rest.ClientRuntime.Azure.Authentication -Version 2.2.9-preview

```    
4. Download the script from the Script Center.

```
            > wget https://github.com/anoobbacker/storsimpledevicemgmttools/raw/master/Get-StorSimpleJob.ps1 -Out Get-StorSimpleJob.ps1
            > .\Get-StorSimpleJob.ps1 -SubscriptionId [subid] -TenantId [tenant id] -DeviceName [name of device] -ResourceGroupName [name of resource group] -ManagerName[name of device manager] -FilterByStatus [Filter for job status] -FilterByJobType [Filter for job type] -FilterByStartTime [Filter for start date time] -FilterByEndTime [Filter for end date time]

```

## Next steps

[Use StorSimple Data Manager UI to transform your data](storsimple-data-manager-ui.md).
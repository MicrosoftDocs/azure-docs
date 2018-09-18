---
title: Validate an Azure Stack backup using the ASDK | Microsoft Docs
description: How to validate an Azure Stack integerated systems backup using the ASDK.
services: azure-stack
author: jeffgilb
manager: femila
services: azure-stack
cloud: azure-stack

ms.service: azure-stack
ms.topic: article
ms.date: 09/05/2018
ms.author: jeffgilb
ms.reviewer: hectorl
---
# Use the ASDK to validate an Azure Stack backup
After deploying Azure Stack and provisioning user resources such as offers, plans, quotas, and subscriptions, you should [enable Azure Stack infrastructure backup](..\azure-stack-backup-enable-backup-console.md). Scheduling and running regular infrastructure backups will ensure that infrastructure management data is not lost if there is a catastrophic hardware or service failure.

> [!TIP]
> We recommended that you [run an on-demand backup](..\azure-stack-backup-back-up-azure-stack.md) before beginning this procedure to ensure you have a copy of the latest infrastrcuture data available. Make sure to capture the backup ID after the backup successfully completes. This ID will be required during cloud recovery. 

Azure Stack infrastructure backups contain important data about your cloud that can be restored during redeployment of Azure Stack. You can use the ASDK to validate these backups without impacting your production cloud. 

Validating backups on ASDK is supported for the following scenarios:

|Scenario|Purpose|
|-----|-----|
|Validate infrastructure backups from an integrated solution.|Short lived validation that the data in the backup is valid.|
|Learn the end-to-end recovery workflow.|Use ASDK to validate the entire backup and restore experience.|
|     |     |

The following scenario **is not** supported when validating backups on the ASDK:

|Scenario|Purpose|
|-----|-----|
|ASDK build to build backup and restore.|Restore backup data from a previous version of the ASDK to a newer version.|
|     |     |


## Cloud recovery deployment
Infrastructure backups from your integrated systems deployment can be validated by performing a cloud recovery deployment of the ASDK. In this type of deployment, specific service data is restored from backup after the ASDK is installed on the host computer.



### Cloud recovery prerequisites
Before starting a cloud recovery deployment of the ASDK, ensure that you have the following information:

|Prerequisite|Description|
|-----|-----|
|Backup share path.|The UNC file share path of the latest Azure Stack backup that will be used to recover Azure Stack infrastructure information. This local share will be created during the cloud recovery deployment process.|
|Backup encryption key.|The encryption key that was used to schedule infrastructure backup to run using the Azure Stack administration portal.|
|Backup ID to restore.|The backup ID, in the alphanumeric form of "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", that identifies the backup to be restored during cloud recovery.|
|Time server IP.|A valid time server IP, such as 132.163.97.2, is required for Azure Stack deployment.|
|External certificate password.|The password for the external certificate used by Azure Stack. The CA backup contains external certificates that need to be restored with this password.|
|     |     | 

## Prepare the host computer 
As in a normal ASDK deployment, the ASDK host system environment must be prepared for installation. When the development kit host computer has been prepared, it will boot from the CloudBuilder.vhdx virtual machine hard drive to begin ASDK deployment.

On the ASDK host computer, download a new cloudbuilder.vhdx corresponding to the same version of Azure Stack that was backed up, and follow the instructions for [preparing the ASDK host computer](asdk-prepare-host.md).

After the host server restarts from the cloudbuilder.vhdx, you must create a file share and copy your backup data into. The file share should be accessible to the account running setup; Administrator in these example PowerShell commands: 

```powershell
$shares = New-Item -Path "c:\" -Name "Shares" -ItemType "directory"
$azsbackupshare = New-Item -Path $shares.FullName -Name "AzSBackups" -ItemType "directory"
New-SmbShare -Path $azsbackupshare.FullName -FullAccess ($env:computername + "\Administrator")  -Name "AzSBackups"
```

Next, copy your latest Azure Stack backup files to the newly created share. The folder structure within the share should be: `\\<ComputerName>\AzSBackups\MASBackup\<BackupID>\`.

## Deploy the ASDK in cloud recovery mode
The **InstallAzureStackPOC.ps1** script is used to initiate cloud recovery. 

> [!IMPORTANT]
> ASDK installation supports exactly one network interface card (NIC) for networking. If you have multiple NICs, make sure that only one is enabled (and all others are disabled) before running the deployment script.

Modify the following PowerShell commands for your environment and run them to deploy the ASDK in cloud recovery mode:

```powershell
cd C:\CloudDeployment\Setup     
$adminPass = Get-Credential Administrator
$key = ConvertTo-SecureString "<Your backup encryption key>" -AsPlainText -Force ` 
$certPass = Read-Host -AsSecureString  

.\InstallAzureStackPOC.ps1 -AdminPassword $adminpass.Password -BackupStorePath ("\\" + $env:COMPUTERNAME + "\AzSBackups") `
-BackupEncryptionKeyBase64 $key -BackupStoreCredential $adminPass -BackupId "<Backup ID to restore>" `
-TimeServer "<Valid time server IP>" -ExternalCertPassword $certPass
```

## Restore infrastructure data from backup
After a successful cloud recovery deployment, you need to complete the restore using the **Restore-AzureStack** cmdlet. 

After logging in as the Azure Stack operator, [install Azure Stack PowerShell](asdk-post-deploy.md#install-azure-stack-powershell) and then, substituting your Backup ID for the `Name` parameter, run the following command:

```powershell
Restore-AzsBackup -Name "<BackupID>"
```
Wait 60 minutes after calling this cmdlet to start verification of backup data on the cloud recovered ASDK.

## Next steps
[Register Azure Stack](asdk-register.md)


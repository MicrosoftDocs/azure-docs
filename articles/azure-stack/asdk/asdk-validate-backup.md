---
title: Validate an Azure Stack backup using the ASDK | Microsoft Docs
description: How to validate an Azure Stack integrated systems backup using the ASDK.
services: azure-stack
author: jeffgilb
manager: femila
services: azure-stack
cloud: azure-stack

ms.service: azure-stack
ms.topic: article
ms.date: 02/15/2019
ms.author: jeffgilb
ms.reviewer: hectorl
ms.lastreviewed: 02/15/2019
---

# Use the ASDK to validate an Azure Stack backup
After deploying Azure Stack and provisioning user resources such as offers, plans, quotas, and subscriptions, you should [enable Azure Stack infrastructure backup](../azure-stack-backup-enable-backup-console.md). Scheduling and running regular infrastructure backups will ensure that infrastructure management data is not lost if there is a catastrophic hardware or service failure.

> [!TIP]
> We recommended that you [run an on-demand backup](../azure-stack-backup-back-up-azure-stack.md) before beginning this procedure to ensure you have a copy of the latest infrastructure data available. Make sure to capture the backup ID after the backup successfully completes. This ID will be required during cloud recovery. 

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



### <a name="prereqs"></a>Cloud recovery prerequisites
Before starting a cloud recovery deployment of the ASDK, ensure that you have the following information:

|Prerequisite|Description|
|-----|-----|
|Backup share path|The UNC file share path of the latest Azure Stack backup that will be used to recover Azure Stack infrastructure information. This local share will be created during the cloud recovery deployment process.|
|Backup encryption key|Optional. Only required if you have upgraded to Azure Stack version 1901 or later from a previous version of Azure Stack with backup enabled.|
|Backup ID to restore|The backup ID, in the alphanumeric form of "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", that identifies the backup to be restored during cloud recovery.|
|Time server IP|A valid time server IP, such as 132.163.97.2, is required for Azure Stack deployment.|
|External certificate password|The password for the self-signed certificate's private key (.pfx) that was used to secure the backup.|
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

Finally, copy the decryption certificate (.pfx) to the certificate directory: `C:\CloudDeployment\Setup\Certificates\` and rename the file to `BackupDecryptionCert.pfx`.

## Deploy the ASDK in cloud recovery mode
The **InstallAzureStackPOC.ps1** script is used to initiate cloud recovery. 

> [!IMPORTANT]
> ASDK installation supports exactly one network interface card (NIC) for networking. If you have multiple NICs, make sure that only one is enabled (and all others are disabled) before running the deployment script.

### Use the installer to deploy the ASDK in recovery mode
The steps in this section show you how to deploy the ASDK using a graphical user interface (GUI) provided by downloading and running the **asdk-installer.ps1** PowerShell script.

> [!NOTE]
> The installer user interface for the Azure Stack Development Kit is an open-sourced script based on WCF and PowerShell.

1. After the host computer successfully boots into the CloudBuilder.vhdx image, sign in using the administrator credentials specified when you [prepared the development kit host computer](asdk-prepare-host.md) for ASDK installation. This should be the same as the development kit host local administrator credentials.
2. Open an elevated PowerShell console and run the **&lt;drive letter>\AzureStack_Installer\asdk-installer.ps1** PowerShell script. The script might now be on a different drive than C:\ in the CloudBuilder.vhdx image. Click **Recover**.

    ![ASDK installer script](media/asdk-validate-backup/1.PNG) 

3. Enter your Azure AD directory information (optional) and the local administrator password for the ASDK host computer on the identity provider and credentials page. Click **Next**.

    ![Identity and credentials page](media/asdk-validate-backup/2.PNG) 

4. Select the network adapter to be used by the ASDK host computer and click **Next**. All other network interfaces will be disabled during ASDK installation. 

    ![Network adapter interface](media/asdk-validate-backup/3.PNG) 

5. On the Network Configuration page, provide valid time server and DNS forwarder IP addresses. Click **Next**.

    ![Network configuration page](media/asdk-validate-backup/4.PNG) 

6. When network interface card properties have been verified, click **Next**. 

    ![Network card settings verification](media/asdk-validate-backup/5.PNG) 

7. Provide the required information described earlier in [prerequisites section](#prereqs) on the Backup Settings page and the username and password to be used to access the share. Click **Next**: 

   ![Backup settings page](media/asdk-validate-backup/6.PNG) 

8. Review the deployment script to be used for deploying the ASDK on the Summary page. Click **Deploy** to begin deployment. 

    ![Summary page](media/asdk-validate-backup/7.PNG) 


### Use PowerShell to deploy the ASDK in recovery mode
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

After logging in as the Azure Stack operator, [install Azure Stack PowerShell](asdk-post-deploy.md#install-azure-stack-powershell) and run the following commands to specify the certificate and password to be used when restoring from backup:

```powershell
Restore-AzsBackup -Name "<BackupID>"
```

Wait 60 minutes after calling this cmdlet to start verification of backup data on the cloud recovered ASDK.

## Next steps
[Register Azure Stack](asdk-register.md)


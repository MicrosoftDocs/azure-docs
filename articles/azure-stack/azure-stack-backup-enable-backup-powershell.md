---
title: Enable Backup for Azure Stack with PowerShell | Microsoft Docs
description: Enable the Infrastructure Backup Service with Windows PowerShell so that Azure Stack can be restored if there is a failure. 
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/16/2018
ms.author: jeffgilb
ms.reviewer: hectorl

---
# Enable Backup for Azure Stack with PowerShell

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Enable the Infrastructure Backup Service with Windows PowerShell so take periodic backups of:
 - Internal identity service and root certificate
 - User plans, offers, subscriptions
 - Keyvault secrets
 - User RBAC roles and policies

You can access the PowerShell cmdlets to enable backup, start backup, and get backup information via the operator management endpoint.

## Prepare PowerShell environment

For instructions on configuring the PowerShell environment, see [Install PowerShell for Azure Stack ](azure-stack-powershell-install.md). To sign in to Azure Stack, see [Configure the operator environment and sign in to Azure Stack](azure-stack-powershell-configure-admin.md).

## Provide the backup share, credentials, and encryption key to enable backup

In the same PowerShell session, edit the following PowerShell script by adding the variables for your environment. Run the updated script to provide the backup share, credentials, and encryption key to the Infrastructure Backup Service.

| Variable        | Description   |
|---              |---                                        |
| $username       | Type the **Username** using the domain and username for the shared drive location with sufficient access to read and write files. For example, `Contoso\backupshareuser`. |
| $password       | Type the **Password** for the user. |
| $sharepath      | Type the path to the **Backup storage location**. You must use a Universal Naming Convention (UNC) string for the path to a file share hosted on a separate device. A UNC string specifies the location of resources such as shared files or devices. To ensure availability of the backup data, the  device should be in a separate location. |
| $frequencyInHours | The frequency in hours determines how often backups are created. The default value is 12. Scheduler supports a maximum of 12 and a minimum of 4.|
| $retentionPeriodInDays | The retention period in days determines how many days of backups are preserved on the external location. The default value is 7. Scheduler supports a maximum of 14 and a minimum of 2. Backups older than the retention period get automatically deleted from the external location.|
|     |     |

   ```powershell
    # Example username:
    $username = "domain\backupadmin"
    # Example share path:
    $sharepath = "\\serverIP\AzSBackupStore\contoso.com\seattle"
   
    $password = Read-Host -Prompt ("Password for: " + $username) -AsSecureString
    
    # The encryption key is generated using the New-AzsEncryptionKeyBase64 cmdlet provided in Azure Stack PowerShell.
    # Make sure to store your encryption key in a secure location after it is generated.
    $Encryptionkey = New-AzsEncryptionKeyBase64
    $key = ConvertTo-SecureString -String ($Encryptionkey) -AsPlainText -Force

    Set-AzsBackupShare -BackupShare $sharepath -Username $username -Password $password -EncryptionKey $key
   ```
   
##  Confirm backup settings

In the same PowerShell session, run the following commands:

   ```powershell
    Get-AzsBackupLocation | Select-Object -Property Path, UserName
   ```

The result should look like the following example output:

   ```powershell
    Path                        : \\serverIP\AzsBackupStore\contoso.com\seattle
    UserName                    : domain\backupadmin
   ```

## Update backup settings
In the same PowerShell session, you can update the default values for retention period and frequency for backups. 

   ```powershell
    #Set the backup frequency and retention period values.
    $frequencyInHours = 10
    $retentionPeriodInDays = 5

    Set-AzsBackupShare -BackupFrequencyInHours $frequencyInHours -BackupRetentionPeriodInDays $retentionPeriodInDays
    Get-AzsBackupLocation | Select-Object -Property Path, UserName, AvailableCapacity, BackupFrequencyInHours, BackupRetentionPeriodInDays
   ```

The result should look like the following example output:

   ```powershell
    Path                        : \\serverIP\AzsBackupStore\contoso.com\seattle
    UserName                    : domain\backupadmin
    AvailableCapacity           : 60 GB
    BackupFrequencyInHours      : 10
    BackupRetentionPeriodInDays	: 5
   ```

## Next steps

 - Learn to run a backup, see [Back up Azure Stack](azure-stack-backup-back-up-azure-stack.md ).  
 - Learn to verify that your backup ran, see [Confirm backup completed in administration portal](azure-stack-backup-back-up-azure-stack.md ).

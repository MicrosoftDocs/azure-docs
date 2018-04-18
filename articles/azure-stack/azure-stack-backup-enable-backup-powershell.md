---
title: Enable Backup for Azure Stack with PowerShell | Microsoft Docs
description: Enable the Infrastructure Backup Service with Windows PowerShell so that Azure Stack can be restored if there is a failure. 
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 7DFEFEBE-D6B7-4BE0-ADC1-1C01FB7E81A6
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/20/2018
ms.author: mabrigg
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

For instructions on configuring the PowerShell environment, see [Install PowerShell for Azure Stack ](azure-stack-powershell-install.md).

## Generate a new encryption key

Install and configured PowerShell for Azure Stack and the Azure Stack tools. See [Get up and running with PowerShell in Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-configure-quickstart).

##  Load the Connect and Infrastructure modules

Open Windows PowerShell with an elevated prompt, and run the following commands:
   
   ```powershell
    cd C:\tools\AzureStack-Tools-master\Infrastructure
    Import-Module .\AzureStack.Infra.psm1 
   ```
   
In the same PowerShell session, run the following commands:

   ```powershell
   $encryptionkey = New-EncryptionKeyBase64
   ```

> [!Warning]  
> You must use the AzureStack-Tools to generate the key.

## Provide the backup share, credentials, and encryption key to enable backup

In the same PowerShell session, edit the following PowerShell script by adding the variables for your environment. Run the updated script to provide the backup share, credentials, and encryption key to the Infrastructure Backup Service.

| Variable        | Description   |
|---              |---                                        |
| $username       | Type the **Username** using the domain and username for the shared drive location. For example, `Contoso\administrator`. |
| $password       | Type the **Password** for the user. |
| $sharepath      | Type the path to the **Backup storage location**. You must use a Universal Naming Convention (UNC) string for the path to a file share hosted on a separate device. A UNC string specifies the location of resources such as shared files or devices. To ensure availability of the backup data, the  device should be in a separate location. |

   ```powershell
    $username = "domain\backupoadmin"
    $password = "password"
    $credential = New-Object System.Management.Automation.PSCredential($username, ($password| ConvertTo-SecureString -asPlainText -Force))  
    $location = Get-AzsLocation
    $sharepath = "\\serverIP\AzSBackupStore\contoso.com\seattle"
    
    Set-AzSBackupShare -Location $location.Name -Path $sharepath -UserName $credential.UserName -Password $credential.GetNetworkCredential().password -EncryptionKey $encryptionkey
   ```
   
##  Confirm backup settings

In the same PowerShell session, run the following commands:

   ```powershell
   Get-AzsBackupLocation | Select-Object -Property Path, UserName, Password | ConvertTo-Json 
   ```

The result should look like the following JSON output:

   ```json
      {
    "ExternalStoreDefault":  {
        "Path":  "\\\\serverIP\\AzSBackupStore\\contoso.com\\seattle",
        "UserName":  "domain\backupoadmin",
        "Password":  null
       }
   } 
   ```

## Next steps

 - Learn to run a backup, see [Back up Azure Stack](azure-stack-backup-back-up-azure-stack.md ).  
 - Learn to verify that your backup ran, see [Confirm backup completed in administration portal](azure-stack-backup-back-up-azure-stack.md ).
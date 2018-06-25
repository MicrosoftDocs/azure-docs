---
title: Back up Azure Stack | Microsoft Docs
description: Perform an on-demand backup on Azure Stack with backup in place.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 9565DDFB-2CDB-40CD-8964-697DA2FFF70A
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 5/08/2017
ms.author: mabrigg
ms.reviewer: hectorl

---
# Back up Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Perform an on-demand backup on Azure Stack with backup in place. If you need to enable the Infrastructure Backup Service, see [Enable Backup for Azure Stack from the administration portal](azure-stack-backup-enable-backup-console.md).

## Setup Rm environment and log into the operator management endpoint

> [!Note]  
>  For instructions on configuring the PowerShell environment, see [Install PowerShell for Azure Stack ](azure-stack-powershell-install.md).

Edit the following PowerShell script by adding the variables for your environment. Run the updated script to set up the RM environment and log into the operator management endpoint.

| Variable    | Description |
|---          |---          |
| $TenantName | Azure Active Directory tenant name. |
| Operator account name        | Your Azure Stack operator account name. |
| Azure Resource Manager Endpoint | URL to the Azure Resource Manager. |

   ```powershell
   # Specify Azure Active Directory tenant name
    $TenantName = "contoso.onmicrosoft.com"
    
    # Set the module repository and the execution policy
    Set-PSRepository `
      -Name "PSGallery" `
      -InstallationPolicy Trusted
    
    Set-ExecutionPolicy RemoteSigned `
      -force
    
    # Configure the Azure Stack operator’s PowerShell environment.
    Add-AzureRMEnvironment `
      -Name "AzureStackAdmin" `
      -ArmEndpoint "https://adminmanagement.seattle.contoso.com"
    
    Set-AzureRmEnvironment `
      -Name "AzureStackAdmin" `
      -GraphAudience "https://graph.windows.net/"
    
    $TenantID = Get-AzsDirectoryTenantId `
      -AADTenantName $TenantName `
      -EnvironmentName AzureStackAdmin
    
    # Sign-in to the operator's console.
    Add-AzureRmAccount -EnvironmentName "AzureStackAdmin" -TenantId $TenantID
    
   ```

## Start Azure Stack backup

```powershell
    $location = Get-AzsLocation
    Start-AzSBackup -Location $location.Name
```

## Confirm backup completed via PowerShell

```powershell
    Get-AzsBackup -Location $location.Name | Select-Object -ExpandProperty BackupInfo
```

- The result should look like the following output:

  ```powershell
      backupDataVersion :
      backupId          : xxxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx
      roleStatus        : {@{roleName=NRP; status=Succeeded}, @{roleName=SRP; status=Succeeded}, @{roleName=CRP; status=Succeeded}, @{roleName=KeyVaultInternalControlPlane; status=Succeeded}...}
      status            : Succeeded
      createdDateTime   : 2018-05-03T12:16:50.3876124Z
      timeTakenToCreate : PT22M54.1714666S
      stampVersion      :
      oemVersion        :
      deploymentID      :
  ```

## Confirm backup completed in the administration portal

1. Open the Azure Stack administration portal at [https://adminportal.local.azurestack.external](https://adminportal.local.azurestack.external).
2. Select **More services** > **Infrastructure backup**. Choose **Configuration** in the **Infrastructure backup** blade.
3. Find the **Name** and **Date Completed** of the backup in **Available backups** list.
4. Verify the **State** is **Succeeded**.

<!-- You can also confirm the backup completed from the administration portal. Navigate to `\MASBackup\<datetime>\<backupid>\BackupInfo.xml`

In ‘Confirm backup completed’ section, the path at the end doesn’t make sense (ie relative to what, datetime format, etc?)
\MASBackup\<datetime>\<backupid>\BackupInfo.xml -->


## Next steps

- Learn more about the workflow for recovering from a data loss event. See [Recover from catastrophic data loss](azure-stack-backup-recover-data.md).

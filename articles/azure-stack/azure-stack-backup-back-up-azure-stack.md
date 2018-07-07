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

Perform an on-demand backup on Azure Stack with backup in place. For instructions on configuring the PowerShell environment, see [Install PowerShell for Azure Stack ](azure-stack-powershell-install.md). To sign in to Azure Stack, see [Configure the operator environment and sign in to Azure Stack](azure-stack-powershell-configure-admin.md).

## Start Azure Stack backup

Use Start-AzSBackup to start a new backup with -AsJob variable to track progress. 

```powershell
    $backupjob = Start-AzsBackup -Force -AsJob
    "Start time: " + $backupjob.PSBeginTime;While($backupjob.State -eq "Running"){("Job is currently: " + $backupjob.State+" ;Duration: " + (New-TimeSpan -Start ($backupjob.PSBeginTime) -End (Get-Date)).Minutes);Start-Sleep -Seconds 30};$backupjob.Output
```

## Confirm backup completed via PowerShell

```powershell
    if($backupjob.State -eq "Completed"){Get-AzsBackup | where {$_.BackupId -eq $backupjob.Output.BackupId}}
```

- The result should look like the following output:

  ```powershell
      BackupDataVersion : 1.0.1
      BackupId          : 183b5870-08c8-2b9d-ba7d-adbbdf7edf3d
      RoleStatus        : {NRP, SRP, CRP, KeyVaultInternalControlPlane...}
      Status            : Succeeded
      CreatedDateTime   : 7/6/2018 6:46:24 AM
      TimeTakenToCreate : PT20M32.364138S
      DeploymentID      : 7d3f2666-620b-46a0-b49a-f01b1acfd6a5
      StampVersion      : 1.1807.0.41
      OemVersion        : 
      Id                : /subscriptions/38b05ce0-d43d-422b-8712-95ec22bcbc53/resourceGroups/System.local/providers/Microsoft.Backup.Admin/backupLocations/local/backups/583b5870-08c8-4b9d-ba7d-adbbdf7edf3d
      Name              : local/583b5870-08c8-4b9d-ba7d-adbbdf7edf3d
      Type              : Microsoft.Backup.Admin/backupLocations/backups
      Location          : local
      Tags              : {}
  ```

## Confirm backup completed in the administration portal

1. Open the Azure Stack administration portal at [https://adminportal.local.azurestack.external](https://adminportal.local.azurestack.external).
2. Select **More services** > **Infrastructure backup**. Choose **Configuration** in the **Infrastructure backup** blade.
3. Find the **Name** and **Date Completed** of the backup in **Available backups** list.
4. Verify the **State** is **Succeeded**.

## Next steps

- Learn more about the workflow for recovering from a data loss event. See [Recover from catastrophic data loss](azure-stack-backup-recover-data.md).

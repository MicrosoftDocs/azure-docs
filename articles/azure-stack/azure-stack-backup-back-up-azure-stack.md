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
ms.date: 12/15/2017
ms.author: mabrigg

---
# Back up Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Perform an on-demand backup on Azure Stack with backup in place. If you need to enable the Infrastructure Backup Service, see [Enable Backup for Azure Stack from the administration portal](azure-stack-backup-enable-backup-console.md).

> [!Note]  
>  For instructions on configuring Powershell environment, see [UPDATED ADMIN POWERSHELL INSTRUCTIONS](https://docs.microsoft.com/azure/azure-stack).

## Start Azure Stack backup

Open Windows PowerShell with an elevated prompt in the operator management environment, and run the following commands:

```powershell
    
    Start-AzSBackup -Location $location.Name
```

## Confirm backup completed in the administration portal

1. Open the Azure Stack administration portal at [https://adminportal.local.azurestack.external](https://adminportal.local.azurestack.external).
2. Select **More services** > **Infrastructure backup**. Choose **Configuration** in the **Infrastructure backup** blade.
3. Find the **Name** and **Date Completed** of the backup in **Available backups** list.
4. Verify the **State** is **Succeeded**.

You can also confirm the backup completed from the administration portal. Navigate to `\MASBackup\<datetime>\<backupid>\BackupInfo.xml`

## Next steps

- Learn more about the workflow for recovering from a data loss event. See [Recover from catastrophic data loss](azure-stack-backup-recover-data.md).

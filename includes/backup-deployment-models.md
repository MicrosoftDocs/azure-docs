---
author: rayne-wiselman
ms.service: backup
ms.topic: include
ms.date: 11/09/2018	
ms.author: raynew
---
The Azure Backup service had two types of vaults - the Backup vault and the Recovery Services vault. The Backup vault came first. Then the Recovery Services vault came along to support the expanded Resource Manager deployments. Microsoft recommends using Resource Manager deployments unless you specifically require a Classic deployment. By the end of 2017, all Backup vaults were converted to Recovery Services vaults.

> [!NOTE]
> Backup vaults could not protect Resource Manager-deployed solutions. However, Recovery Services vaults can protect classically-deployed servers and VMs.  
> 
> 


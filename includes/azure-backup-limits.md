---
title: "include file"
description: "include file"
services: backup
author: rayne-wiselman
ms.service: backup
ms.topic: "include"
ms.date: 12/07/2018
ms.author: raynew
ms.custom: "include file"
---


The following limits apply to Azure Backup.

| **Limit** | **Default** |
| --- | --- |
| Servers/machines that can be registered in a vault | Windows Server/Windows Client/System Center DPM: 50 <br/><br/> IaaS VMs: 1000  |
| Size of a data source in vault storage |54400 GB maximum. The limit doesn't apply to IaaS VM backup |
| Backup vaults in an Azure subscription |500 vaults per region |
| Schedule daily backups |Windows Server/Client: 3 a day<br/> System Center DPM: 2 a day <br/> IaaS VMs: Once a day  |
| Data disks attached to an Azure VM for backup | 16 |
| Individual data disk attached to Azure VM for backup| 4095 GB|

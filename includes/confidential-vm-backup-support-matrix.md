---
author: AbhishekMallick-MS
ms.service: azure-backup
ms.topic: include
ms.date: 07/02/2026
ms.author: akak
# Customer intent: "As an IT administrator evaluating Confidential VM backup options, I want to assess Azure Backup for Confidential VMs in its preview stage, so that I can determine its capabilities for managing protection for confidential VMs.
---

The following table lists the supported scenarios for Confidential VM backup:

| Scenario | Supportability |
| --- | --- |
| Virtual Machine size | **[v6-series](/azure/confidential-computing/virtual-machine-options)** is supported. <br> **[v5-series](/azure/confidential-computing/virtual-machine-options)** isn't supported. |
| Region availability | Supported in UAE North, Korea Central, East US, West Europe, North Europe, South East Asia, West US, Germany West central, UK South |
| Key rotation for backups | When you rotate keys associated with a disk of a confidential virtual machine, the keys of the related restore points and snapshots update automatically. <br><br> You might observe performance degradations or failures if you attach more than 6,000 disks to one DES and (only) restore points are associated with these disks. If you directly create disk snapshots outside of Azure backup for these disks connected to the same DES, it lowers the safe threshold of 6,000 disks to DES mapping.|
| Backup capabilities | - You can back up Confidential VMs with OS disk encryption only.  <br> - Backup and restore fail if the CVM v2 opt-out feature flag is enabled for your subscription. <br> - Multi-disk crash consistent backup isn't supported. <br> - Cross Region Restore isn't supported. |

---
author: AbhishekMallick-MS
ms.service: azure-backup
ms.topic: include
ms.date: 01/28/2026
ms.author: v-mallicka
# Customer intent: "As an IT administrator evaluating Confidential VM backup options, I want to assess Azure Backup for Confidential VMs in its preview stage, so that I can determine its capabilities for managing protection for confidential VMs.
---

The following table lists the supported scenarios for Confidential VM backup:

| Scenario | Supportability |
| --- | --- |
| [VM size](/azure/confidential-computing/virtual-machine-options) | Version 6 series is supported. <br> Version 5 series isn't supported. |
| Region availability | Supported in UAE North, Korea Central. |
| Key rotation for backups | When key rotation occurs on a confidential virtual machine, the keys for the VM disks, related restore points, and snapshots update automatically. <br><br> Note that the key rotation in this preview release might fail due to the following scenarios: <br><br> - A large number of disks are linked to a single Disk Encryption Set (DES), including their restore points and snapshots. <br> - More than 40 disks are attached to one DES when only restore points are associated with these disks. <br> - Both restore points and snapshots are present for disks connected to the same DES, which lowers the safe threshold of 40 disks. <br> - Performance limitations during key rotation when multiple disks share one DES.  <br><br> Recommendation: Keep the number of disks connected to each DES to a minimum until the issue is resolved. |
| Backup capabilities | - You can backup Confidential VMs with OS disk encryption only.  <br> - Backup and restore fail if the CVM v2 opt-out feature flag is enabled for your subscription. <br> - Multi-disk crash consistent backup is unsupported. <br> - Cross Region Restore is currently unsupported as CVM v6 SKU isn't generally available in Azure paired regions.  |

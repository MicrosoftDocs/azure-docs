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
| Virtual Machine size | **[v6-series](/azure/confidential-computing/virtual-machine-options)** is supported. <br> **[v5-series](/azure/confidential-computing/virtual-machine-options)** isn't supported. |
| Region availability | Supported in UAE North, Korea Central. |
| Key rotation for backups | When key rotation occurs on a confidential virtual machine, the keys for the VM disks, related restore points, and snapshots update automatically. <br><br> **Known issue:** The key rotation in this *preview release* might have performance issues or fail in the following scenarios: <br> - More than 40 disks are attached to one DES when (only) restore points are associated with these disks. <br> - If you also directly create disk snapshots outside of Azure backup for these disks connected to the same DES, this lowers the safe threshold of 40 disks to DES mapping.  <br><br> **Recommendation**: Keep the number of disks connected to each DES to a minimum until the issue is resolved. |
| Backup capabilities | - You can backup Confidential VMs with OS disk encryption only.  <br> - Backup and restore fail if the CVM v2 opt-out feature flag is enabled for your subscription. <br> - Multi-disk crash consistent backup is unsupported. <br> - Cross Region Restore is currently unsupported as CVM v6 VM size isn't generally available in Azure paired regions.  |

---
author: v-amallick
ms.service: Azure Backup  
ms.topic: include
ms.date: 04/14/2025
ms.author: v-amallick
---

1. For Azure VMs that are selected for backup, Azure Backup starts a backup job according to the backup schedule you specify.
1. If you have opted for application or file-system consistent backups, the VM needs to have a backup extension installed to coordinate for the snapshot process.

   If you have opted for [crash-consistent backups](../articles/backup/backup-azure-vms-agentless-multi-disk-crash-consistent-overview.md), no agents are required in the VMs.

1. During the first backup, a backup extension is installed on the VM if the VM is running.
    - For Windows VMs, the [VMSnapshot extension](/azure/virtual-machines/extensions/vmsnapshot-windows) is installed.
    - For Linux VMs, the [VMSnapshotLinux extension](/azure/virtual-machines/extensions/vmsnapshot-linux) is installed.
1. For Windows VMs that are running, Azure Backup coordinates with Windows Volume Shadow Copy Service (VSS) to take an app-consistent snapshot of the VM.
    - By default, Backup takes full VSS backups.
    - If Backup can't take an app-consistent snapshot, then it takes a file-consistent snapshot of the underlying storage (because no application writes occur while the VM is stopped).
1. For Linux VMs, Backup takes a file-consistent backup. For app-consistent snapshots, you need to manually customize pre/post scripts.
1.  For Windows VMs, **Microsoft Visual C++ 2015 Redistributable (x64) version 14.40.33810.0** is installed, the startup of Volume Shadow Copy Service (VSS) is changed to automatic, and a Windows Service **IaaSVmProvider** is added.
1. After Backup takes the snapshot, it transfers the data to the vault.
    - The backup is optimized by backing up each VM disk in parallel.
    - For each disk that's being backed up, Azure Backup reads the blocks on the disk and identifies and transfers only the data blocks that changed (the delta) since the previous backup.
    - Snapshot data might not be immediately copied to the vault. It might take some hours at peak times. Total backup time for a VM will be less than 24 hours for daily backup policies.

:::image type="content" source="../articles/backup/media/backup-azure-vms-introduction/vmbackup-architecture.png" alt-text="Diagram shows the Azure Virtual Machine backup architecture.":::

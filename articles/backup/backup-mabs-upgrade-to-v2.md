---
title: Install Azure Backup Server v2 | Microsoft Docs
description: Azure Backup Server v2 provides enhanced backup capabilities for protecting VMs, files and folders, workloads and more. This article provides instruction on installing, or upgrading, to Azure Backup Server v2.
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: ''

ms.assetid:
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/15/2017
ms.author: masaran;markgal
---

# Install Azure Backup Server v2

Azure Backup Server protects your virtual machines (VMs), workloads, files and folders, and more. Azure Backup Server v2 builds on top of Azure Backup Server v1, that is, Azure Backup Server v2 enables additional features, not available in v1. For a comparison of features between v1 and v2, see the article, [Azure Backup Server protection matrix](backup-mabs-protection-matrix.md). The additional features in Azure Backup Server v2 are an upgrade from Azure Backup Server v1. However, Azure Backup Server v1 is not a prerequisite for Azure Backup Server v2. If you want to upgrade Azure Backup Server v1 to Azure Backup Server v2, install Azure Backup Server v2 on the Azure Backup Server protection server. Your existing Azure Backup Server settings remain.

You can install Azure Backup Server v2 on Windows Server 2012 R2 or on Windows Server 2016. However to take advantage of new features such as Modern Backup Storage, you must install Azure Backup Server v2 on Windows Server 2016. Before you upgrade or install Azure Backup Server v2, read the [Installation prerequisites](http://docs.microsoft.com/system-center/dpm/install-dpm.md#setup-prerequisites).

> [!NOTE]
> Azure Backup Server is based on the same code base as System Center Data Protection Manager (DPM). Azure Backup Server v1 is equivalent to DPM 2012 R2, and Azure Backup Server is equivalent to DPM 2016. This documentation occasionally references the DPM documentation.
>
>

## Upgrade Azure Backup Server to v2
To upgrade Azure Backup Server v1 to v2, make sure your installation has the necessary updates:

- [Update the protection agents](backup-mabs-upgrade-to-v2.md#update-the-dpm-protection-agent) on the protected servers.
- Upgrade Windows Server 2012 R2 to Windows Server 2016.
- Upgrade Azure Backup Server Remote Administrator on all production servers.
- Backups continue without rebooting your production server.


### Upgrade steps for Azure Backup Server v2

1. Go to the Download center and [download the upgrade installer](https://go.microsoft.com/fwlink/?LinkId=626082).

2. After you have extracted the setup wizard, make sure the Execute setup.exe is selected. Click **Finish** to open the Azure Backup Server v2 wizard.

  ![setup installer](./media/backup-mabs-upgrade-to-v2/run-setup.png)

3. On the Microsoft Azure Backup Server wizard, under **Install**, click **Microsoft Azure Backup Server**.

  ![setup installer](./media/backup-mabs-upgrade-to-v2/mabs-installer-s1.png)

4. At the Welcome screen, read the warnings and click **Next**.

  ![setup installer](./media/backup-mabs-upgrade-to-v2/mabs-installer-s2.png)

5. The setup wizard performs prerequisite checks to make sure your environment is able to upgrade. Click **Check** to perform the checks.

  ![setup installer](./media/backup-mabs-upgrade-to-v2/mabs-installer-s3-perform-checks.png)

6. Your environment must be able to pass the prerequisite check. If your environment cannot pass the check, note the issues and fix them. You can then click **Check Again**. Once you can pass the prerequisite checks, click **Next** to move forward in the wizard.

  ![setup installer](./media/backup-mabs-upgrade-to-v2/mabs-installer-s4-pass-checks.png)

7. On the SQL Setting screen, choose the appropriate option for your SQL installation and click **Check and Install**.

  ![setup installer](./media/backup-mabs-upgrade-to-v2/mabs-installer-s5-sql-settings.png)

  The checks may take a few minutes to complete. Once the checks have completed, click **Next**.

  ![setup installer](./media/backup-mabs-upgrade-to-v2/mabs-installer-s5a-check-and fix-settings.png)

8. On the Installation Settings screen, make any changes to the location where Azure Backup Server is installed, or the scratch location. Once you've made the changes, click **Next**.

  ![setup installer](./media/backup-mabs-upgrade-to-v2/mabs-installer-s6-installation-settings.png)

9. To finish the setup wizard, click **Finish**.

  ![setup installer](./media/backup-mabs-upgrade-to-v2/run-setup.png)



## Adding Storage for Modern Backup Storage

To improve backup storage efficiency, Azure Backup Server v2 adds support for Volumes. Azure Backup Server v2 continues to support disks, just like in v1.

### Add Volumes and Disks
If you run Azure Backup Server v2 on Windows Server 2016, you can use volumes to store backup data. Volumes provide storage savings and faster backups. Because volumes are new to Azure Backup Server, you must add them. When you add the volume to Azure Backup Server, give the volume a friendly name by click the **Friendly Name** column of the desired volume. You can change the name later, if necessary. You can also use PowerShell to add or change friendly names for volumes.

To add a volume in the administrator console:

1. In the Azure Backup Server Administrator console, select the **Management** feature > **Disk Storage** > **Add**.

    ![Open the add disk storage wizard](./media//backup-mabs-upgrade-to-v2/open-add-disk-storage-wizard.png)

    The Add Disk Storage wizard opens.

2. In the **Add Disk Storage** dialog, select an available volume > click **Add** > type a friendly name for the volume ** > click **OK**.

      ![Add volume](./media/backup-mabs-upgrade-to-v2/add-volume.png)

  If you want to add a disk, it must belong to a protection group with legacy storage. Those disks can only be used for those protection groups. If the Azure Backup Server doesn't have sources with legacy protection, the disk doesn't appear.
  For more information on adding disks, see [Adding disks to increase legacy storage](http://docs.microsoft.com/system-center/dpm/upgrade-to-dpm-2016.md#adding-disks-to-increase-legacy-storage). You can't give disks a friendly name.


### Assign Workloads to Volumes

With Azure Backup Server, you specify which workloads are assigned to which volumes. For example, expensive volumes, that support high IOPS, can be configured to store only workloads that require frequent, high-volume backups like SQL with Transaction Logs.
To update the properties of a volume in the storage pool on an Azure Backup Server, use the PowerShell cmdlet, Update-DPMDiskStorage.

**Update-DPMDiskStorage**

**Syntax**

`Parameter Set: Volume`

```
Update-DPMDiskStorage [-Volume] <Volume> [[-FriendlyName] <String> ] [[-DatasourceType] <VolumeTag[]> ] [-Confirm] [-WhatIf] [ <CommonParameters>]
```

All changes made using PowerShell reflected in the UI.


## Protecting Data Sources
To begin protecting data sources, create a Protection Group. The following procedure highlights changes or additions to the **New Protection Group** wizard.

To create a Protection Group:

1. In the Azure Backup Server Administrator console, select the **Protection** feature.

2. On the tool ribbon, click **New**.

    The **Create new Protection Group** wizard opens.

  ![Create protection group](./media/backup-mabs-upgrade-to-v2/create-a-protection-group-1.png)

3. Click **Next** to advance the wizard to the **Select Protection Group Type** screen.
4. On the **Select Protection Group Type** screen, select the type of Protection Group to be created and then click **Next**.

  ![Choose server or client](./media/backup-mabs-upgrade-to-v2/create-a-protection-group-2.png)

5. On the **Select Group Members** screen, in the **Available members** pane, Azure Backup Server lists the members with protection agents. For the purposes of this example, select volume D:\ and E:\ to add them to the **Selected members** pane. Once you have chosen the members for the protection group, click **Next**.

  ![Select group members for protection group](./media/backup-mabs-upgrade-to-v2/create-a-protection-group-3.png)

6. On the **Select Data Protection Method** screen, type a name for the **Protection group**, select the protection method, and click **Next**.
    If you want short-term protection, you must use Disk backup.

  ![Select data protection method](./media/backup-mabs-upgrade-to-v2/create-a-protection-group-4.png)

7. On the **Specify Short-Term Goals** screen specify the details for **Retention Range** and **Synchronization Frequency**, and click **Next**. If desired, click **Modify** to change the schedule when recovery points are taken.

  ![Select data protection method](./media/backup-mabs-upgrade-to-v2/create-a-protection-group-5.png)

8. The **Review Disk Storage Allocation** screen provides details about the selected data sources, their size, the **Space to be Provisioned**, and **Target Storage Volume**.

  ![Review Disk Storage Allocation](./media/backup-mabs-upgrade-to-v2/create-a-protection-group-6.png)

  The storage volumes are determined based on the workload volume allocation (set using PowerShell) and the available storage. You can change the storage volumes by selecting other volumes from the drop-down menu. If you change the **Target Storage**, the **Available disk storage** dynamically changes to reflect the **Free Space** and **Underprovisioned Space**.

  If the data sources grow as planned, the **Underprovisioned Space** column in **Available disk storage** reflects the amount of additional storage needed. Use this value to help plan your storage needs to enable smooth backups. If the value is zero, then there are no potential problems with storage in the foreseeable future. If the value is a number other than zero, then you do not have sufficient storage allocated  - based on your protection policy and the data size of your protected members.

  ![Underallocated disk storage](./media/backup-mabs-upgrade-to-v2/create-a-protection-group-7.png)

   Continue through the wizard to complete creation of your new protection group.

## Migrating legacy storage to Modern Backup Storage
Once you upgrade or install Azure Backup Server v2 and the operating system to Windows Server 2016, update your protection groups to use Modern Backup Storage. By default, protection groups are not changed, and continue to function as they were configured. Updating protection groups to use Modern Backup Storage is optional. To update the protection group, stop protection of all data sources with Retain Data, and add the data sources to a new protection group.

1. In the Administrator Console, select the **Protection** feature, and in the **Protection Group Member** list, right-click the member, and select **Stop protection of member...**.

  ![Stop protection](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-stop-protection1.png)

  The **Remove from Group** dialog opens.

2. In the **Remove from Group** dialog, review the used disk space and the available free space in the storage pool. The default is to leave the recovery points on the disk and allow them to expire per their associated retention policy. Click **OK**.

    If you want to immediately return the used disk space to the free storage pool, click **Delete replica on disk** to delete the backup data (and recovery points) associated with that member.

    ![Retain data](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-retain-data.png)

3. Create a protection group that uses Modern Backup Storage, and include the unprotected data sources.


## Adding Disks to increase legacy storage

If you want to use legacy storage with Azure Backup Server, it may become necessary to add disks to increase legacy storage. To add disk storage:

1. On the Administrator Console, click **Management**.

2. Select **Disk Storage**.

3. On the tool ribbon click **Add**.

    The **Add Disk Storage** dialog opens.

    ![Add disks](http://docs.microsoft.com/system-center/dpm/media/upgrade-to-dpm-2016/dpm-2016-add-disk-storage.png)

4. In the **Add Disk Storage** dialog, click **Add disks**.

    The dialog provides a list of available disks.

5. Select the disks, click **Add** to add the disks, and click **OK**.

## Update the DPM protection agent

Azure Backup Server uses the System Center DPM protection agent to update. If you are upgrading a protection agent that is not connected to the network, you cannot use the DPM Administrator console to perform a connected agent upgrade. You must upgrade the protection agent in a non-active domain environment. The DPM Administrator console shows the protection agent update is pending, until the client computer is connected to the network.
The following sections describe how to update protection agents for both connected and non-connected client computers.

### Update a protection agent for a connected client computer

1. In the Azure Backup Server Administrator console, click **Management** on the navigation bar, and then click the **Agents** tab.

2. In the display pane, select the client computers on which you want to update the protection agent.

  > [!NOTE]
  > The Agent Updates column indicates when a protection agent update is available, for each protected computer. The **Update** action in the **Actions** pane is enabled only when a protected computer is selected, and updates are available.
  >
  >

3. To install updated protection agents on selected computers, click **Update** in the **Actions** pane.

### Update a protection agent on a disconnected client computer

1. In the Azure Backup Server Administrator console, click **Management** on the navigation bar, and then click the **Agents** tab.

2. In the display pane, select the client computers on which you want to update the protection agent.

  > [!NOTE]
  > The **Agent Updates** column indicates for each protected computer when a protection agent is available. The **Update** action in the **Actions** pane is not enabled when a protected computer is selected unless updates are available.
  >
  >

3. To install updated protection agents on selected computers, click **Update**.

4. For client computers not connected to the network, **Update Pending** appears in the **Agent Status** column until the computer is connected to the network.

  After a client computer is connected to the network, **Updating** appears in the **Agent Updates** column for the client computer.

## New PowerShell cmdlets

When you install Azure Backup Server v2, two new cmdlets: [Mount-DPMRecoveryPoint](https://technet.microsoft.com/library/mt787159.aspx) and [Dismount-DPMRecoveryPoint](https://technet.microsoft.com/library/mt787158.aspx) are available. Click the cmdlet name to see its reference documentation.

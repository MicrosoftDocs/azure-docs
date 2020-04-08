---
title: Back up Hyper-V virtual machines with MABS
description: This article contains the procedures for backing up and recovery of virtual machines using Microsoft Azure Backup Server (MABS).
ms.topic: conceptual
ms.date: 07/18/2019
---

# Back up Hyper-V virtual machines with Azure Backup Server

This article explains how to back up Hyper-V virtual machines using Microsoft Azure Backup Server (MABS).

## Supported scenarios

MABS can back up virtual machines running on Hyper-V host servers in the following scenarios:

- **Virtual machines with local or direct storage** - Back up virtual machines hosted on Hyper-V host standalone servers that have local or directly attached storage. For example: a hard drive, a storage area network (SAN) device, or a network attached storage (NAS) device. The MABS protection agent must be installed on all hosts.

- **Virtual machines in a cluster with CSV storage** - Back up virtual machines hosted on a Hyper-V cluster with Cluster Shared Volume (CSV) storage. The MABS protection agent is installed on each cluster node.

## Host versus guest backup

MABS can do a host or guest-level backup of Hyper-V VMs. At the host level, the MABS protection agent is installed on the Hyper-V host server or cluster and protects the entire VMs and data files running on that host.   At the guest level, the agent is installed on each virtual machine and protects the workload present on that machine.

Both methods have pros and cons:

- Host-level backups are flexible because they work regardless of the type of OS running on the guest machines and don't require the installation of the MABS protection agent on each VM. If you deploy host level backup, you can recover an entire virtual machine, or files and folders (item-level recovery).

- Guest-level backup is useful if you want to protect specific workloads running on a virtual machine. At host-level you can recover an entire VM or specific files, but it won't provide recovery in the context of a specific application. For example, to recover specific SharePoint items from a backed-up VM, you should do guest-level backup of that VM. Use guest-level backup if you want to protect data stored on passthrough disks. Passthrough allows the virtual machine to directly access the storage device and doesn't store virtual volume data in a VHD file.

## How the backup process works

MABS performs backup with VSS as follows. The steps in this description are numbered to help with clarity.

1. The MABS block-based synchronization engine makes an initial copy of the protected virtual machine and ensures that the copy of the virtual machine is complete and consistent.

2. After the initial copy is made and verified, MABS uses the Hyper-V VSS writer to capture backups. The VSS writer provides a data-consistent set of disk blocks that are synchronized with the MABS server. This approach provides the benefit of a "full backup" with the MABS server, while minimizing the backup data that must be transferred across the network.

3. The MABS protection agent on a server that is running Hyper-V uses the existing Hyper-V APIs to determine whether a protected virtual machine also supports VSS.

   - If a virtual machine complies with the requirements for online backup and has the Hyper-V integration services component installed, then the Hyper-V VSS writer recursively forwards the VSS request through to all VSS-aware processes on the virtual machine. This operation occurs without the MABS protection agent being installed on the virtual machine. The recursive VSS request allows the Hyper-V VSS writer to ensure that disk- write operations are synchronized so that a VSS snapshot is captured without the loss of data.

     The Hyper-V integration services component invokes the Hyper-V VSS writer in Volume Shadow Copy Services (VSS) on virtual machines to ensure that their application data is in a consistent state.

   - If the virtual machine doesn't comply with online backup requirements, MABS automatically uses the Hyper-V APIs to pause the virtual machine before they capture data files.

4. After the initial baseline copy of the virtual machine synchronizes with the MABS server, all changes that are made to the virtual machine resources are captured in a new recovery point. The recovery point represents the consistent state of the virtual machine at a specific time. Recovery point captures can occur at least one time a day. When a new recovery point is created, MABS uses block-level replication in conjunction with the Hyper-V VSS writer to determine which blocks have been altered on the server that is running Hyper-V after the last recovery point was created. These data blocks are then transferred to the MABS server and are applied to the replica of the protected data.

5. The MABS server uses VSS on the volumes that host recovery data so that multiple shadow copies are available. Each of these shadow copies provides a separate recovery. VSS recovery points are stored on the MABS server. The temporary copy that is made on the server running Hyper-V, is only stored for the duration of the MABS synchronization.

>[!NOTE]
>
>Starting in Windows Server 2016, Hyper-V virtual hard disks have built-in change tracking known as resilient change tracking (RCT). MABS uses RCT (the native change tracking in Hyper-V), which decreases the need for time-consuming consistency checks in scenarios such as VM crashes. RCT provides better resiliency than the change tracking provided by VSS snapshot-based backups. MABS V3 optimizes network and storage consumption further by transferring only the changed data during any consistency checks.

## Backup prerequisites

These are the prerequisites for backing up Hyper-V virtual machines with MABS:

|Prerequisite|Details|
|------------|-------|
|MABS prerequisites|- If you want to perform item-level recovery for virtual machines (recover files, folders, volumes), then you'll need to install the Hyper-V role on the MABS server.  If you only want to recover the virtual machine and not item-level, then the role isn't required.<br />-   You can protect up to 800 virtual machines of 100 GB each on one MABS server and allow multiple MABS servers that support larger clusters.<br />-   MABS excludes the page file from incremental backups to improve virtual machine backup performance.<br />-   MABS can back up a Hyper-V server or cluster in the same domain as the MABS server, or in a child or trusted domain. If you want to back up Hyper-V in a workgroup or an untrusted domain, you'll need to set up authentication. For a single Hyper-V server, you can use NTLM or certificate authentication. For a cluster, you can use certificate authentication only.<br />-   Using host-level backup to back up virtual machine data on passthrough disks isn't supported. In this scenario, we recommend you use host-level backup to back up VHD files and guest-level backup to back up the other data that isn't visible on the host.<br />   -You can back up VMs stored on deduplicated volumes.|
|Hyper-V VM prerequisites|-   The version of Integration Components that is running on the virtual machine should be the same as the version of the Hyper-V host. <br />-   For each virtual machine backup you'll need free space on the volume hosting the virtual hard disk files to allow Hyper-V enough room for differencing disks (AVHD's) during backup. The space must be at least equal to the calculation **Initial disk size\*Churn rate\*Backup** window time. If you're running multiple backups on a cluster, you'll need enough storage capacity to accommodate the AVHDs for each of the virtual machines using this calculation.<br />-   To back up virtual machines located on Hyper-V host servers running Windows Server 2012 R2, the virtual machine should have a SCSI controller specified, even if it's not connected to anything. (In Windows Server 2012 R2 online backup, the Hyper-V host mounts a new VHD in the VM and then later dismounts it. Only the SCSI controller can support this and therefore is required for online backup of the virtual machine.  Without this setting, event ID 10103 will be issued when you try to back up the virtual machine.)|
|Linux prerequisites|-   You can back up Linux virtual machines using MABS. Only file-consistent snapshots are supported.|
|Back up VMs with CSV storage|-   For CSV storage, install the Volume Shadow Copy Services (VSS) hardware provider on the Hyper-V server. Contact your storage area network (SAN) vendor for the VSS hardware provider.<br />-   If a single node shuts down unexpectedly in a CSV cluster, MABS will perform a consistency check against the virtual machines that were running on that node.<br />-   If you need to restart a Hyper-V server that has BitLocker Drive Encryption enabled on the CSV cluster, you must run a consistency check for Hyper-V virtual machines.|
|Back up VMs with SMB storage|-   Turn on auto-mount on the server that is running Hyper-V to enable virtual machine protection.<br />   -   Disable TCP Chimney Offload.<br />-   Ensure that all Hyper-V machine$ accounts have full permissions on the specific remote SMB file shares.<br />-   Ensure that the file path for all virtual machine components during recovery to alternate location is fewer than 260 characters. If not, recovery might succeed, but Hyper-V won't be able to mount the virtual machine.<br />-   The following scenarios aren't supported:<br />     Deployments where some components of the virtual machine are on local volumes and some components are on remote volumes; an IPv4 or IPv6 address for storage location file server, and recovery of a virtual machine to a computer that uses remote SMB shares.<br />-   You'll need to enable the File Server VSS Agent service on each SMB server - Add it in **Add roles and features** > **Select server roles** > **File and Storage Services** > **File Services** > **File Service** > **File Server VSS Agent Service**.|

## Back up virtual machines

1. Set up your [MABS server](backup-azure-microsoft-azure-backup.md) and [your storage](backup-mabs-add-storage.md). When setting up your storage, use these storage capacity guidelines.
   - Average virtual machine size - 100 GB
   - Number of virtual machines per MABS server - 800
   - Total size of 800 VMs - 80 TB
   - Required space for backup storage - 80 TB

2. Set up the MABS protection agent on the Hyper-V server or Hyper-V cluster nodes. If you're doing guest-level backup, you'll install the agent on the VMs you want to back up at the guest-level.

3. In  the MABS Administrator console, click **Protection** > **Create protection group** to open the **Create New Protection Group** wizard.

4. On the **Select Group Members** page, select the VMs you want to protect from the Hyper-V host servers on which they're located. We recommend you put all VMs that will have the same protection policy into one protection group. To make efficient use of space, enable colocation. Colocation allows you to locate data from different protection groups on the same disk or tape storage, so that multiple data sources have a single replica and recovery point volume.

5. On the **Select Data Protection Method** page, specify a protection group name. Select **I want short-term protection using Disk** and select **I want online protection** if you want to back up data to Azure using the Azure Backup service.

6. In **Specify Short-Term Goals** > **Retention range**, specify how long you want to retain disk data. In **Synchronization frequency**, specify how often incremental backups of the data should run. Alternatively, instead of selecting an interval for incremental backups you can enable **Just before a recovery point**. With this setting enabled, MABS will run an express full backup just before each scheduled recovery point.

    > [!NOTE]
    >
    >If you're protecting application workloads, recovery points are created in accordance with Synchronization frequency, provided the application supports incremental backups. If it doesn't, then MABS runs an express full backup, instead of an incremental backup, and creates recovery points in accordance with the express backup schedule.

7. In the **Review disk allocation** page, review the storage pool disk space allocated for the protection group.

   **Total Data size** is the size of the data you want to back up, and **Disk space to be provisioned on MABS** is the space that MABS recommends for the protection group. MABS chooses the ideal backup volume, based on the settings. However, you can edit the backup volume choices in the **Disk allocation details**. For the workloads, select the preferred storage in the dropdown menu. Your edits change the values for **Total Storage** and **Free Storage** in the **Available Disk Storage** pane. Underprovisioned space is the amount of storage MABS suggests you add to the volume, to continue with backups smoothly in the future.

8. On the **Choose Replica Creation Method** page, specify how the initial replication of data in the protection group will be performed. If you select to **Automatically replicate over the network**, we recommended you choose an off-peak time. For large amounts of data or less than optimal network conditions, consider selecting **Manually**, which requires replicating the data offline using removable media.

9. On the **Consistency Check Options** page, select how you want to automate consistency checks. You can enable a check to run only when replica data becomes inconsistent, or according to a schedule. If you don't want to configure automatic consistency checking, you can run a manual check at any time by right-clicking the protection group and selecting **Perform Consistency Check**.

    After you create the protection group, initial replication of the data occurs in accordance with the method you selected. After initial replication, each backup takes place in line with the protection group settings. If you need to recover backed up data, note the following:

## Back up replica virtual machines

If MABS is running on Windows Server 2012 R2 or greater, then you can back up replica virtual machines. This is useful for several reasons:

**Reduces the impact of backups on the running workload** - Taking a backup of a virtual machine incurs some overhead as a snapshot is created. By offloading the backup process to a secondary remote site, the running workload is no longer affected by the backup operation. This is applicable only to deployments where the backup copy is stored on a remote site. For example, you might take daily backups and store data locally to ensure quick restore times, but take monthly or quarterly backups from replica virtual machines stored remotely for long-term retention.

**Saves bandwidth** - In a typical remote branch office/headquarters deployment you need an appropriate amount of provisioned bandwidth to transfer backup data between sites. If you create a replication and failover strategy, in addition to your data backup strategy, you can reduce the amount of redundant data sent over the network. By backing up the replica virtual machine data rather than the primary, you save the overhead of sending the backed-up data over the network.

**Enables hoster backup** - You can use a hosted datacenter as a replica site, with no need for a secondary datacenter. In this case, the hoster SLA requires consistent backup of replica virtual machines.

A replica virtual machine is turned off until a failover is initiated, and VSS can't guarantee an application-consistent backup for a replica virtual machine. Thus the backup of a replica virtual machine will be crash-consistent only. If crash-consistency can't be guaranteed, then the backup will fail and this might occur in a number of conditions:

- The replica virtual machine isn't healthy and is in a critical state.

- The replica virtual machine is resynchronizing (in the Resynchronization in Progress or Resynchronization Required state).

- Initial replication between the primary and secondary site is in progress or pending for the virtual machine.

- .hrl logs are being applied to the replica virtual machine, or a previous action to apply the .hrl logs on the virtual disk failed, or was canceled or interrupted.

- Migration or failover of the replica virtual machine is in progress

## Recover backed up virtual machines

When you can recover a backed up virtual machine, you use the Recovery wizard to select the virtual machine and the specific recovery point. To open the Recovery Wizard and recover a virtual machine:

1. In the MABS Administrator console, type the name of the VM, or expand the list of protected items and select the VM you want to recover.

2. In the **Recovery points for** pane, on the calendar, click any date to see the recovery points available. Then in the **Path** pane, select the recovery point you want to use in the Recovery wizard.

3. From the **Actions** menu, click **Recover** to open the Recovery Wizard.

    The VM and recovery point you selected appear in the **Review Recovery Selection** screen. Click **Next**.

4. On the **Select Recovery Type** screen, select where you want to restore the data and then click **Next**.

    - **Recover to original instance**: When you recover to the original instance, the original VHD is deleted. MABS recovers the VHD and other configuration files to the original location using Hyper-V VSS writer. At the end of the recovery process, virtual machines are still highly available.
        The resource group must be present for recovery. If it isn't available, recover to an alternate location and then make the virtual machine highly available.

    - **Recover as virtual machine to any host**: MABS supports alternate location recovery (ALR), which provides a seamless recovery of a protected Hyper-V virtual machine to a different Hyper-V host, independent of processor architecture. Hyper-V virtual machines that are recovered to a cluster node will not be highly available. If you choose this option, the Recovery Wizard presents you with an additional screen for identifying the destination and destination path.

    - **Copy to a network folder**: MABS supports item-level recovery (ILR), which allows you to do item-level recovery of files, folders, volumes, and virtual hard disks (VHDs) from a host-level backup of Hyper-V virtual machines to a network share or a volume on a MABS protected server. The MABS protection agent doesn't have to be installed inside the guest to perform item-level recovery. If you choose this option, the Recovery Wizard presents you with an additional screen for identifying the destination and destination path.

5. In **Specify Recovery Options** configure the recovery options and click **Next**:

    - If you are recovering a VM over low bandwidth, click **Modify** to enable **Network bandwidth usage throttling**. After turning on the throttling option, you can specify the amount of bandwidth you want to make available and the time when that bandwidth is available.
    - Select **Enable SAN based recovery using hardware snapshots** if you have configured your network.
    - Select **Send an e-mail when the recovery completes** and then provide the email addresses, if you want email notifications sent once the recovery process completes.

6. In the Summary screen, make sure all details are correct. If the details aren't correct, or you want to make a change, click **Back**. If you are satisfied with the settings, click **Recover** to start the recovery process.

7. The **Recovery Status** screen provides information about the recovery job.

## Next steps

[Recover data from Azure Backup Server](https://docs.microsoft.com/azure/backup/backup-azure-alternate-dpm-server)

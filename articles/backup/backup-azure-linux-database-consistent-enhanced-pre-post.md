---
title: Database consistent snapshots using enhanced pre-post script framework
description: Learn how Azure Backup allows you to take database consistent snapshots, leveraging Azure VM backup and using packaged pre-post scripts
ms.topic: conceptual
ms.date: 09/16/2021 
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Enhanced pre-post scripts for database consistent snapshot

Azure Backup service already provides a [_pre-post_ script framework](./backup-azure-linux-app-consistent.md) to achieve application consistency in Linux VMs using Azure Backup. This involves invoking a pre-script (to quiesce the applications) before taking
snapshot of disks and calling post-script (commands to un-freeze the applications) after the snapshot is completed to return the applications to the normal mode.

Authoring, debugging and maintenance of e pre/post scripts could be challenging. To remove this complexity, Azure Backup provides simplified pre/post-script experience for marquee databases to get application consistent snapshot with least overhead.

:::image type="content" source="./media/backup-azure-linux-database-consistent-enhanced-pre-post/linux-application-consistent-snapshot.png" alt-text="Diagram showing Linux application-consistent snapshot by Azure Backup.":::

The new _enhanced_ pre-post script framework has the following key benefits:

- These pre-post scripts are directly installed in Azure VMs along with the backup extension. This helps to eliminate authoring and download them from an external location.
- You can view the definition and content of pre-post scripts in [GitHub](https://github.com/Azure/azure-linux-extensions/tree/master/VMBackup/main/workloadPatch/DefaultScripts), even submit suggestions and changes. You can even submit suggestions and changes via GitHub, which will be triaged and added to benefit the broader community.
- You can even add new pre-post scripts for other databases via [GitHub](https://github.com/Azure/azure-linux-extensions/tree/master/VMBackup/main/workloadPatch/DefaultScripts), _which will be triaged and addressed to benefit the broader community_.
- The robust framework is efficient to handle scenarios, such as pre-script execution failure or crashes. In any event, the post-script automatically runs to roll back all changes done in the pre-script.
- The framework also provides a _messaging_ channel for external tools to fetch updates and prepare their own action plan on any message/event.

## Solution flow

:::image type="content" source="./media/backup-azure-linux-database-consistent-enhanced-pre-post/solution-flow.png" alt-text="Diagram showing the solution flow.":::

## Support matrix

The following the list of databases are covered under the enhanced framework:

- [Oracle (Generally Available)](../virtual-machines/workloads/oracle/oracle-database-backup-azure-backup.md) - [Link to support matrix](backup-support-matrix-iaas.md#support-matrix-for-managed-pre-and-post-scripts-for-linux-databases)
- MySQL (Preview)

## Prerequisites

You only need to modify a configuration file, _workload.conf_ in `/etc/azure`, to provide connection details. This allows Azure Backup to connect to the relevant application and execute pre and post-scripts. The configuration file has the following parameters.

```json
[workload]
# valid values are mysql, oracle
workload_name =
command_path = 
linux_user =
credString = 
ipc_folder = 
timeout =
```

The following table describes the parameters:

|Parameter  |Mandatory  |Explanation  |
|---------|---------|---------|
|workload_name     |   Yes      |     This will contain the name of the database for which you need application consistent backup. The current supported values are `oracle` or `mysql`.    |
|command_path/configuration_path     |         |   This will contain path to the workload binary. This is not a mandatory field if the workload binary is set as path variable.      |
|linux_user     |    Yes     |   This will contain the username of the Linux user with access to the database user login. If this value isn't set, then root is considered as the default user.      |
|credString     |         |     This stands for credential string to connect to the database. This will contain the entire login string.    |
|ipc_folder     |         |   The workload can only write to certain file system paths. You need to provide here this folder path so that the pre-script can write the states to this folder path.      |
|timeout     |    Yes     |     This is the maximum time limit for which the database will be in quiesce state. The default value is 90 seconds. It's not recommended to set a value lesser than 60 seconds.    |

> [!NOTE]
> The JSON definition is a template that the Azure Backup service may modify to suit a particular database. To understand configuration file for each database, refer to [each database's manual](#support-matrix).

The overall experience to use the enhanced pre-post script framework is as follows:

- Prepare the database environment
- Edit the configuration file
- Trigger the VM backup
- Restore VMs or disks/files from the application consistent recovery point as required.

## Build a database backup strategy

### Using snapshots instead of streaming

Usually, streaming backups (such as full, differential, or incremental) and logs are used by database admins in their backup strategy. Following are some of the key pivots in the design.

- **Performance and cost**: A daily full + logs would be the fastest during restore but involves significant cost. Including the differential/incremental streaming backup type reduces cost but might impact the restore performance. But snapshots provide the best combination of performance and cost.  As snapshots are inherently incremental, they have least impact on performance during backup, are restored fast, and also save cost.
- **Impact on database/infrastructure**: The performance of a streaming backup depends on the underlying storage IOPS and the network bandwidth available when the stream is targeted to a remote location. Snapshots don't have this dependency, and the demand on IOPS and network bandwidth is significantly reduced.
- **Re-usability**: The commands for triggering different streaming backup types are different for each database. So, scripts can't be easily re-used. Also, if you're using different backup types, ensure to evaluate the dependency chain to maintain the life cycle. For snapshots, it's easy to write script as there's no dependency chain.
- **Long-term retention**: Full backups are always beneficial for long-term retention0 as they can be independently moved and recovered. But, for operational backups with short-term retention, snapshots are favorable.

Therefore, a daily snapshot + logs with occasional full backup for long-term retention is the best backup policy for databases.

### Log backup strategy

The enhanced pre-post script framework is built on Azure VM backup that schedules backup once per day. So, the data loss window with RPO as 24 hours isn’t suitable for production databases. This solution is complemented with a log backup strategy where log backups are streamed out explicitly.

[NFS on blob](../storage/blobs/network-file-system-protocol-support.md) and [NFS on AFS (Preview)](../storage/files/files-nfs-protocol.md) help in easy mounting of volumes directly on database VMs and use database clients to transfer log backups. The data loss window, that is RPO, falls to the frequency of log backups. Also, NFS targets don't need to be highly performant as you might not need to trigger regular streaming (full and incremental) for operational backups after you have a database consistent snapshots.

>[!NOTE]
>The enhanced pre- script usually takes care to flush all the log transactions in transit to the log backup destination, before quiescing the database to take a snapshot. Therefore, the snapshots are database consistent and reliable during recovery.

### Recovery strategy

Once the database consistent snapshots are taken and the log backups are streamed to an NFS volume, the recovery strategy of database could use the recovery functionality of Azure VM backups. The ability of log backups is additionally applied to it using the database client. Following are few options of recovery strategy:

- Create new VMs from database consistent recovery point. The VM should already have the log mount-point connected. Use database clients to run recovery commands for point-in-time recovery.
- Create disks from database consistent recovery point and attach it to another target VM. Then mount the log destination and use database clients to run recovery commands for point-in-time recovery
- Use file-recovery option and generate a script. Run the script on the target VM and attach the recovery point as iSCSI disks. Then use database clients to run the database-specific validation functions on the attached disks and validate the backup data. Also, use database clients to export/recover a few tables/files instead of recovering the entire database.
- Use the Cross Region Restore functionality to perform the above actions from secondary paired region during regional disaster.

## Summary

Using database consistent snapshots + logs backed up using a custom solution, you can build a performant and cost effective database backup solution leveraging the benefits of Azure VM backup and also re-using the capabilities of database clients.

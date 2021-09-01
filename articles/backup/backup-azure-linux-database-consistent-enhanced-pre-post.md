---
title: Database consistent snapshots using enhanced pre-post script framework
description: Learn how Azure Backup allows you to take database consistent snapshots, leveraging Azure VM backup and using packaged pre-post scripts
ms.topic: conceptual
ms.date: 09/01/2021 
ms.custom: devx-track-azurepowershell
---

# Enhanced pre-post scripts for database consistent snapshot

Azure Backup service already provides a ['pre-post' script framework](/azure/backup/backup-azure-linux-app-consistent) to achieve application consistency in Linux VMs using Azure Backup. This involves invoking a pre-script (to quiesce the applications) before taking
snapshot of disks and calling post-script (commands to un-freeze the applications) after the snapshot is completed to return the applications to the normal mode. Customers should author these pre-post scripts and provide the relevant information in the *VMSnapshotScriptPluginConfig.json* file in the `etc/azure` directory. But customers were concerned about authoring, debugging and maintaining their scripts and considered that work as overhead. So, Azure Backup has decided to provide an _enhanced_ pre-post scripts experience to marquee databases so that users can get application consistent snapshots daily without any additional overhead. 

Following are the key benefits of the new 'enhanced' pre-post script framework.

- These pre-post scripts are directly installed in Azure VMs along with backup extension. You need not have to author them and worry about downloading them from an external location.
- You can still view the definition/content of pre-post scripts in [GitHub](https://github.com/Azure/azure-linux-extensions/tree/master/VMBackup/main/workloadPatch/DefaultScripts). You can submit changes and Azure Backup team will verify, review and merge, if necessary so that the benefits are available for all users.
- You can also choose to add new pre-post scripts for any other database via [GitHub](https://github.com/Azure/azure-linux-extensions/tree/master/VMBackup/main/workloadPatch/DefaultScripts). With sufficient information and testing, Azure Backup team can choose to merge them and provide them for all users as well.
- The framework is now robust to deal with scenarios such as pre-script execution failure or crashes. In any event, the post-script is definitely called to roll back all changes done in pre-script.
- The framework also provides a _messaging_ channel for external tools to listen to and to prepare their own action plan on any message/event.

## Support matrix

The following the list of databases are covered under the enhanced framework:

- [Oracle (Preview)](/azure/virtual-machines/workloads/oracle/oracle-database-backup-azure-backup)
- MySQL (Preview)

## Prerequisites

You only need to edit a configuration file, *workload.conf* in `/etc/azure`, and provide connection information so that Azure Backup can connect to the relevant application and execute pre and post-scripts. The configuration file has the following parameters.

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

These parameters are explained below.

|Parameter  |Mandatory  |Explanation  |
|---------|---------|---------|
|workload_name     |   yes      |     This will have the name of the database for which application consistent backup has to be done. The current supported values are `oracle` or `mysql`.    |
|command_path/configuration_path     |         |   This will have path to the workload binary. This is not a mandatory field if the workload binary is set as path variable      |
|linux_user     |    yes     |   This will have the username of the linux_user having access to the database user login. If this value is not set then root is considered as the default user.      |
|credString     |         |     This stands for credential string to connect to the database. This will have the entire login string    |
|ipc_folder     |         |   The workload is only able to write to certain file system paths. This folder path needs to be provided here so that the pre-script can write some states to this file path.      |
|timeout     |    yes     |     This is the max time till which the database will be in quiesce state. The default value is 90 seconds. It's not recommended to set any value lesser than 60 seconds    |

> [!NOTE]
> The JSON definition is a template that the Azure Backup service may modify to suit a particular database. To understand configuration file for each database, refer to [each database's detailed manual](#support-matrix).

Overall, the customer experience to use the enhanced pre-post script framework is as follows:

- Prepare the database environment
- Edit the configuration file
- Trigger the VM backup
- Restore VMs or disks or files as necessary from the application consistent recovery point.

## Using enhanced pre-post script framework to build a generic database backup strategy

### Using snapshots instead of streaming

Usually, streaming backups (such as full, differential, or incremental) and logs are used by database admins in their backup strategy. Following are some of the key pivots/concerns in the design.

- **Performance and cost**: A daily full + logs would be the fastest during restore, but comes at a significant cost. Including differentials/incrementals reduces cost but might impact the restore performance.
- **Impact on database/infrastructure**: The performance of a streaming backup depends on the underlying storage IOPS and the network bandwidth available when the stream is targeted to a remote location.
- **Re-usability**: The commands for triggering different streaming backup types are different for each database. So, scripts can't be easily re-used. Also, if you're using different backup types, you need to understand the dependency chain to maintain the life cycle. Of course, some database clients do take care of such aspects, but that means the backup data too is prone for deletion by these clients.
- **Long-term retention**: Full backups are definitely good for long-term retention as they can be independently moved and recovered at any point-in-time. Snapshots retention helps you in quick restore, thus avoiding performance issues happen due to streaming backup.

- **Performance and cost**: They provide instant backup and restore and snapshots, via Azure VM backup, are also _incremental_, and therefore are cost effective too. With snapshot, acting as a full during restore, you may not need streaming fulls and incremental backups, and save on storage costs for operational backups.
- **Impact on database/infrastructure**: snapshots have the least impact on database and infrastructure.
- **Re-usability:** You need to learn only one command, that is, for snapshot per database. No dependency chain is required. The enhanced pre-script takes care of the command.
- **Short term retention:** They may not be used for long-term retention (due to link with underlying storage), but are best for short-term retention and daily operational backups.
 
The key requirement is to make sure that the database is involved before and after snapshot, with the right commands to freeze and thaw, and these are taken care in the pre-post scripts.

### Log backup strategy

The enhanced pre-post script framework is built on Azure VM backup that schedules backup once per day. So, the data loss window with RPO as 24 hours isn’t acceptable for production databases. This solution has to be complemented with a log backup strategy where log backups are streamed out explicitly. With the advent of [NFS on blob](/azure/storage/blobs/network-file-system-protocol-support) and [NFS on AFS (Preview)](/azure/storage/files/files-nfs-protocol), it’s easier to mount volumes directly on database VMs and use database clients to transfer log backups. The data loss window, that is RPO, falls down to the frequency of log backups. Also, these NFS targets need not be highly performant because, as mentioned above, you might not need to trigger regular streaming (fulls and incrementals) for operational backups after getting a database consistent snapshots.

>[!NOTE]
>The enhanced pre- script usually takes care to flush all the log transactions in transit to the log backup destination, before quiescing the database to take a snapshot. This means the snapshots should be database consistent and reliable during recovery.

### Recovery strategy

Once the database consistent snapshots are taken and the log backups are streamed to an NFS volume, the recovery strategy of database could leverage the recovery functionality of Azure VM backup and the ability of log backups to be applied on top of it using the database client. Following are few options of recovery strategy:

- Create new VMs from database consistent recovery point. The VM should already have the log mount-point and connected to it. Use database clients to run recovery commands for log point-in-time recovery.
- Create disks from database consistent recovery point. Attach it to another target VM. Then mount the log destination and use database clients to run recovery commands for point-in-time recovery
- Use file-recovery option and generate a script. Run the script on the target VM and attach the recovery point as iSCSI disks. Use database clients to run database-specific validation functions on the attached disks and validate the backup data. Also, use database clients to export/recover few tables/files instead of recovering the entire database.
- Use the Cross Region Restore functionality to perform all/any of the above actions from secondary paired region during regional disaster.

## Using enhanced pre-post scripts for Oracle snapshots
<>
### Summary

Using database consistent snapshots + logs backed up using a custom solution, you can build a performant and cost effective database backup solution leveraging the benefits of Azure VM backup and also re-using the capabilities of database clients.


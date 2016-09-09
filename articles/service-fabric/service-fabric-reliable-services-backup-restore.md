<properties
   pageTitle="Service Fabric Backup and Restore | Microsoft Azure"
   description="Conceptual documentation for Service Fabric Backup and Restore"
   services="service-fabric"
   documentationCenter=".net"
   authors="mcoskun"
   manager="timlt"
   editor="subramar,jessebenson"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/19/2016"
   ms.author="mcoskun"/>

# Back up and restore Reliable Services and Reliable Actors

Azure Service Fabric is a high-availability platform that replicates the state across multiple nodes to maintain this high availability.  Thus, even if one node in the cluster fails, the services continue to be available. While this in-built redundancy provided by the platform may be sufficient for some, in certain cases it is desirable for the service to back up data (to an external store).

>[AZURE.NOTE] It is critical to backup and restore your data (and test that it works as expected) so you can recover from data loss scenarios.

For example, a service may want to back up data in the following scenarios:

* In the event of the permanent loss of an entire Service Fabric cluster or all nodes that are running a given partition.

* Administrative errors whereby the state accidentally gets deleted or corrupted. For example, this may happen if an administrator with sufficient privilege erroneously deletes the service.

* Bugs in the service that cause data corruption. For example, this may happen when a service code upgrade starts writing faulty data to a Reliable Collection. In such a case, both the code and the data may have to be reverted to an earlier state.

* Offline data processing. It might be convenient to have offline processing of data for business intelligence that happens separately from the service that generates the data.

The Backup/Restore feature allows services built on the Reliable Services API to create and restore backups. The backup APIs provided by the platform allow to take backup(s) of a service partition's state, without blocking read or write operations. The restore APIs allow a service partition's state to be restored from a chosen backup.

## Types of Backup

There are two backup options: Full and Incremental.
A full backup is a backup that contains all the data required to recreate the state of the replica: checkpoints and all log records.
Since it has the checkpoints and the log, a full backup can be restored by itself.

The problem with full backups arises when the checkpoints are large.
For example, a replica that has 16 GB of state will have checkpoints that add up approximately to 16 GB.
If we have an Recovery Point Objective of 5 minutes, the replica needs to be backed up every 5 minutes.
Each time it backs up it will need to copy 16 GB of checkpoints in addition to 50 MB (configurable using **CheckpointThresholdInMB**) worth of logs.

![Full Backup Example.](media/service-fabric-reliable-services-backup-restore/FullBackupExample.PNG)

The solution to this problem is incremental backups, where only the log records since the last backup are backed up.

![Incremental Backup Example.](media/service-fabric-reliable-services-backup-restore/IncrementalBackupExample.PNG)

Since incremental backups are only changes since the last backup (does not include the checkpoints), they tend to be faster but they cannot be restored on their own.
To restore an incremental backup, the entire backup chain is required.
A backup chain is a chain of backups starting with a full backup and followed by a number of contiguous incremental backups.

## Backup Reliable Services

The service author has full control of when to make backups and where backups will be stored.

To start a backup, the service needs to invoke the inherited member function **BackupAsync**.  
Backups can be made only from primary replicas, and they require write status to be granted.

As shown below, **BackupAsync** takes in a **BackupDescription** object, where one can specify a full or incremental backup, as well as a callback function, **Func<< BackupInfo, CancellationToken, Task<bool>>>** which is invoked when the backup folder has been created locally and is ready to be moved out to some external storage.

```C#

BackupDescription myBackupDescription = new BackupDescription(backupOption.Incremental,this.BackupCallbackAsync);

await this.BackupAsync(myBackupDescription);

```

Request to take an incremental backup can fail with **FabricMissingFullBackupException** which indicates that either the replica has never taken a full backup or some of the log records since that last back has been truncated.
Users can modify the truncation rate by modifying the **CheckpointThresholdInMB**.

**BackupInfo** provides information regarding the backup, including the location of the folder where the runtime saved the backup (**BackupInfo.Directory**). The callback function can move the **BackupInfo.Directory** to an external store or another location.  This function also returns a bool that indicates whether it was able to successfully move the backup folder to its target location.

The following code demonstrates how the **BackupCallbackAsync** method can be used to upload the backup to Azure Storage:

```C#
private async Task<bool> BackupCallbackAsync(BackupInfo backupInfo, CancellationToken cancellationToken)
{
    var backupId = Guid.NewGuid();

    await externalBackupStore.UploadBackupFolderAsync(backupInfo.Directory, backupId, cancellationToken);

    return true;
}
```

In the above example, **ExternalBackupStore** is the sample class that is used to interface with Azure Blob storage, and **UploadBackupFolderAsync** is the method that compresses the folder and places it in the Azure Blob store.

Note that:

- There can be only one backup operation in-flight per replica at any given time. More than one **BackupAsync** call at a time will throw **FabricBackupInProgressException** to limit inflight backups to one.

- If a replica fails over while a backup is in progress, the backup may not have been completed. Thus, once the failover finishes, it is the service's responsibility to restart the backup by invoking **BackupAsync** as necessary.

## Restore Reliable Services

In general, the cases when you might need to perform a restore operation fall into one of these categories:

- The service partition lost data. For example, the disk for two out of three replicas for a partition (including the primary replica) gets corrupted or wiped. The new primary may need to restore data from a backup.

- The entire service is lost. For example, an administrator removes the entire service and thus the service and the data need to be restored.

- The service replicated corrupt application data (e.g., because of an application bug). In this case, the service has to be upgraded or reverted to remove the cause of the corruption, and non-corrupt data has to be restored.

While many approaches are possible, we offer some examples on using **RestoreAsync** to recover from the above scenarios.

## Partition data loss in Reliable Services

In this case, the runtime would automatically detect the data loss and invoke the **OnDataLossAsync** API.

The service author needs to perform the following to recover:

- Override the virtual base class method **OnDataLossAsync**.

- Find the latest backup in the external location that contains the service's backups.

- Download the latest backup (and uncompress the backup into the backup folder if it was compressed).

- The **OnDataLossAsync** method provides a **RestoreContext**. Call the **RestoreAsync** API on the provided **RestoreContext**.

- Return true if the restoration was a success.

Following is an example implementation of the **OnDataLossAsync** method:

```C#

protected override async Task<bool> OnDataLossAsync(RestoreContext restoreCtx, CancellationToken cancellationToken)
{
    var backupFolder = await this.externalBackupStore.DownloadLastBackupAsync(cancellationToken);

    var restoreDescription = new RestoreDescription(backupFolder);

    await restoreCtx.RestoreAsync(restoreDescription);

    return true;
}
```

**RestoreDescription** passed in to the **RestoreContext.RestoreAsync** call contains a member called **BackupFolderPath**.
When restoring a single full backup, this **BackupFolderPath** should be set to the local path of the folder that contains your full backup.
When restoring a full backup and a number of incremental backups, **BackupFolderPath** should be set to the local path of the folder that not only contains the full backup, but also all the incremental backups.
**RestoreAsync** call can throw **FabricMissingFullBackupException** if the **BackupFolderPath** provided does not contain a full backup.
It can also throw **ArgumentException** if **BackupFolderPath** has a broken chain of incremental backups.
For example, if it contains the full backup, the first incremental and the third incremental backup but no the second incremental backup.

>[AZURE.NOTE] The RestorePolicy is set to Safe by default.  This means that the **RestoreAsync** API will fail with ArgumentException if it detects that the backup folder contains a state that is older than or equal to the state contained in this replica.  **RestorePolicy.Force** can be used to skip this safety check. This is specified as part of **RestoreDescription**.

## Deleted or lost service

If a service is removed, you must first re-create the service before the data can be restored.  It is important to create the service with the same configuration, e.g., partitioning scheme, so that the data can be restored seamlessly.  Once the service is up, the API to restore data (**OnDataLossAsync** above) has to be invoked on every partition of this service. One way of achieving this is by using **[FabricClient.TestManagementClient.StartPartitionDataLossAsync](https://msdn.microsoft.com/library/mt693569.aspx)** on every partition.  

From this point, implementation is the same as the above scenario. Each partition needs to restore the latest relevant backup from the external store. One caveat is that the partition ID may have now changed, since the runtime creates partition IDs dynamically. Thus, the service needs to store the appropriate partition information and service name to identify the correct latest backup to restore from for each partition.

>[AZURE.NOTE] It is not recommended to use **FabricClient.ServiceManager.InvokeDataLossAsync** on each partition to restore the entire service, since that may corrupt your cluster state.

## Replication of corrupt application data

If the newly deployed application upgrade has a bug, that may cause corruption of data. For example, an application upgrade may start to update every phone number record in a Reliable Dictionary with an invalid area code.  In this case, the invalid phone numbers will be replicated since Service Fabric is not aware of the nature of the data that is being stored.

The first thing to do after you detect such an egregious bug that causes data corruption is to freeze the service at the application level and, if possible, upgrade to the version of the application code that does not have the bug.  However, even after the service code is fixed, the data may still be corrupt and thus data may need to be restored.  In such cases, it may not be sufficient to restore the latest backup, since the latest backups may also be corrupt.  Thus, you have to find the last backup that was made before the data got corrupted.

If you are not sure which backups are corrupt, you could deploy a new Service Fabric cluster and restore the backups of affected partitions just like the above "Deleted or lost service" scenario.  For each partition, start restoring the backups from the most recent to the least. Once you find a backup that does not have the corruption, move/delete all backups of this partition that were more recent (than that backup). Repeat this process for each partition. Now, when **OnDataLossAsync** is called on the partition in the production cluster, the last backup found in the external store will be the one picked by the above process.

Now, steps in the "Deleted or lost service" section can be used to restore the state of the service to the state before the buggy code corrupted the state.

Note that:

- When you restore, there is a chance that the backup being restored is older than the state of the partition before the data was lost. Because of this, you should restore only as a last resort to recover as much data as possible.

- The string that represents the backup folder path and the paths of files inside the backup folder can be greater than 255 characters, depending on the FabricDataRoot path and Application Type name's length. This can cause some .NET methods, like **Directory.Move**, to throw the **PathTooLongException** exception. One workaround is to directly call kernel32 APIs, like **CopyFile**.

## Backup and restore Reliable Actors

Backup and restore for Reliable Actors builds on the backup and restore functionality provided by reliable services. The service owner should create a custom Actor service that derives from **ActorService** (which is a Service Fabric reliable service hosting actors) and then do backup/restore similar to reliable services as described above in previous sections. Since backups will be taken on a per-partition basis, states for all actors in that particular partition will be backed up (and restoration is similar and will happen on a per-partition basis).


- When you create a custom actor service, you will need to register the custom actor service as well while registering the actor. See **ActorRuntime.RegistorActorAsync**.
- The **KvsActorStateProvider** currently only supports full backup. Also the option **RestorePolicy.Safe** is ignored by the **KvsActorStateProvider**.

>[AZURE.NOTE] The default ActorStateProvider (i.e., **KvsActorStateProvider**) **does not** cleanup the backup folders by itself (under the application work folder obtained through ICodePackageActivationContext.WorkDirectory). This may cause your work folder to get filled up. You should explicitly cleanup the backup folder in the backup callback after you have moved the backup to an external storage.


## Testing Backup and Restore

It is important to ensure that critical data is being backed up, and can be restored from. This can be done by invoking the **Invoke-ServiceFabricPartitionDataLoss** cmdlet in PowerShell that can induce data loss in a particular partition to test whether the data backup and restore functionality for your service is working as expected.  It is also possible to programmatically invoke data loss and restore from that event as well.

>[AZURE.NOTE] You can find a sample implementation of backup and restore functionality in the Web Reference App on Github. Please look at the Inventory.Service service for more details.

## Under the hood: more details on backup and restore

Here's some more details on backup and restore.

### Backup
The Reliable State Manager provides the ability to create consistent backups without blocking any read or write operations. To do so, it utilizes a checkpoint and log persistence mechanism.  The Reliable State Manager takes fuzzy (lightweight) checkpoints at certain points to relieve pressure from the transactional log and improve recovery times.  When **BackupAsync** is called, the Reliable State Manager instructs all Reliable objects to copy their latest checkpoint files to a local backup folder.  Then, the Reliable State Manager copies all log records, starting from the "start pointer" to the latest log record into the backup folder.  Since all the log records up to the latest log record are included in the backup and the Reliable State Manager preserves write-ahead logging, the Reliable State Manager guarantees that all transactions that are committed (**CommitAsync** has returned successfully) are included in the backup.

Any transaction that commits after **BackupAsync** has been called may or may not be in the backup.  Once the local backup folder has been populated by the platform (i.e., local backup is completed by the runtime), the service's backup callback is invoked.  This callback is responsible for moving the backup folder to an external location such as Azure Storage.

### Restore

The Reliable State Manager provides the ability to restore from a backup by using the **RestoreAsync** API.  
The **RestoreAsync** method on **RestoreContext** can be called only inside the **OnDataLossAsync** method.
The bool returned by **OnDataLossAsync** indicates whether the service restored its state from an external source.
If the **OnDataLossAsync** returns true, Service Fabric will rebuild all other replicas from this primary. Service Fabric ensures that replicas that will receive **OnDataLossAsync** call first transition to the primary role but are not granted read status or write status.
This implies that for StatefulService implementers, **RunAsync** will not be called until **OnDataLossAsync** finishes successfully.
Then, **OnDataLossAsync** will be invoked on the new primary.
Until a service completes this API successfully (by returning true or false) and finishes the relevant reconfiguration, the API will keep being called one at a time.

**RestoreAsync** first drops all existing state in the primary replica that it was called on.  
Then the Reliable State Manager creates all the Reliable objects that exist in the backup folder.  
Next, the Reliable objects are instructed to restore from their checkpoints in the backup folder.  
Finally, the Reliable State Manager recovers its own state from the log records in the backup folder and performs recovery.  
As part of the recovery process, operations starting from the "starting point" that have commit log records in the backup folder are replayed to the Reliable objects.  
This step ensures that the recovered state is consistent.

## Next steps

- [Reliable Services quick start](service-fabric-reliable-services-quick-start.md)
- [Reliable Services notifications](service-fabric-reliable-services-notifications.md)
- [Developer reference for Reliable Collections](https://msdn.microsoft.com/library/azure/microsoft.servicefabric.data.collections.aspx)

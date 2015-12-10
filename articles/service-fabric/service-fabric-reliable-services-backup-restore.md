<properties
   pageTitle="Reliable Service Backup and Restore | Microsoft Azure"
   description="Conceptual Documentation for Service Fabric Reliable Service Backup and Restore"
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
   ms.date="12/01/2015"
   ms.author="mcoskun"/>

# Backup and Restore Reliable Services

Service Fabric is a high availability platform, and replicates the state across multiple nodes to maintain this high availability.  Thus, even if one node in the cluster fails, the services continue to be available. While this in-built redundancy provided by the platform may be sufficient for some, in certain cases, it is desirable for the service to backup data (to an external store).

For example, a service may want to backup data in the following scenarios:

* In the event of the permanent loss of an entire Service Fabric cluster or all nodes that are running a given partition. This may happen when, for example, if you aren’t geo replicated and your entire cluster is in one data center, and the entire data center goes down.

* Administrative errors whereby state accidentally gets deleted/corrupted. For example, this may happen if an administrator with sufficient privilege erroneously deletes the service.

* Bugs in the service causing data corruption. For example, this may happen when a service code upgrade that starts writing faulty data to a Reliable Collection. In such a case, both the code and the data may have to reverted to an earlier state.

* Off-line data processing. It might be convenient to have off-line processing of data for business intelligence happening separately from the service generating the data.

The Backup/Restore feature allows services built on the Reliable Services API to create and restore backups. The backup APIs provided by the platform allows backups of a partition’s state to be taken without blocking read or write operations. The restore APIs allow a partition’s state to be restored from a chosen backup.


## How to Backup

The Service author has full control of when to take backups and where backups will be stored.

To start a backup, the service needs to invoke **IReliableStateManager.BackupAsync**.  Backups can only be taken from Primary replicas and they require Write Status to be granted.

As shown below, the simplest overload of **BackupAsync** takes in Func<< BackupInfo, bool >> called **backupCallback**.

```C#
await this.StateManager.BackupAsync(this.BackupCallbackAsync);
```

**BackupInfo** provides information regarding the backup, including the location of the folder where the runtime saved the backup (BackupInfo.Directory). The callback function expects to move the BackupInfo.Directory to an external Store or another location.  This function also returns a bool that indicates whether it was able to successfully move the backup folder to its target location.

The following code demonstrates how the backupCallback can be used to upload the backup to Azure Storage:

```C#
private async Task<bool> BackupCallbackAsync(BackupInfo backupInfo)
{
    var backupId = Guid.NewGuid();

    await externalBackupStore.UploadBackupFolderAsync(backupInfo.Directory, backupId, CancellationToken.None);

    return true;
}
```

In the above example, **ExternalBackupStore** is the sample class that is used to interface with Azure Blob Storage and **UploadBackupFolderAsync** is the method compresses the folder and places it in Azure Blob Store.

Please note that:

- There can only be one **BackupAsync** per replica inflight at any given point of time. More than one **BackupAsync** call at a time will throw **FabricBackupInProgressException** to limit inflight backups to one.

- If a replica fails over while a backup is in progress, the backup may not have been completed. Thus, once the failover completes, it is the service's responsibility to restart the backup by invoking **BackupAsync** as necessary.

## How to Restore data

In general, the cases when you might need to perform a restore operation fall into one of these categories:


1. The service partition lost data. For example, the disk for two out of three replicas for a partition (including the primary replica) gets corrupted/wiped. The new primary may need to restore data from a backup.

2. The entire service is lost. For example, an administrator removes the entire service and thus the service and the data needs to be restored.

3. The service replicated corrupt application (e.g., because of an application bug) data. In this case, the service has to be upgraded/reverted to remove the cause of the corruption and non-corrupt data has to be restored.

While many approaches are possible, we offer some examples on using RestoreAsync to recover from the above scenarios.

## Partition Data Loss

In this case, the runtime would automatically detect the data loss and invoke the **OnDataLossAsync** API.

The service author needs to perform the following to recover:
- Override **IReliableStateManager** to return a new ReliableStateManager, and provide a call back function to be called in the case of a data loss event.
- Find the latest backup in the external location which contains service's backups.
- If the latest backup’s state is behind the new Primary, return false. This will ensure that the new primary does not get over-written with older data.
- Download the latest backup (and uncompress the backup into the backup folder if it was compressed).
- Call **IReliableStateManager.RestoreAsync** with the path to the backup folder.
- Return true if the restoration was a success.

Following is an example implementation of **OnDataLossAsync** method along with the **IReliableStateManager** override.

```C#
protected override IReliableStateManager CreateReliableStateManager()
{
    return new ReliableStateManager(new ReliableStateManagerConfiguration(
            onDataLossEvent: this.OnDataLossAsync));
}

protected override async Task<bool> OnDataLossAsync(CancellationToken cancellationToken)
{
    var backupFolder = await this.externalBackupStore.DownloadLastBackupAsync(cancellationToken);

    await this.StateManager.RestoreAsync(backupFolder);

    return true;
}
```

>[AZURE.NOTE] The RestorePolicy is set to Safe by default.  This means that the RestoreAsync API will fail with ArgumentException if it detects that the backup folder contains state that is older than or equal to the state contained in this replica.  RestorePolicy.Force can be used to skip this safety check.

## Deleted or Lost Service

If a service is removed, you must first recreate the service before the data can be restored.  It is important to create the service with the same configuration, e.g. partitioning scheme, so that the data can be restored seamlessly.  Once the service is up, the API to restore data (**OnDataLossAsync** above) has to be invoked on every partition of this service.  One way of achieving this is using **FabricClient.ServiceManager.InvokeDataLossAsync** on every partition.  

From this point, implementation is same as the above scenario.  Each partition needs to restore the latest relevant backup from the external store. One caveat is that the partition ID may have now changed, since the runtime creates partition IDs dynamically). Thus, the service needs to store and the appropriate partition information and service name to identify the correct latest backup to restore from for each partition.


## Replication of Corrupt Application Data

If the newly deployed application upgrade has a bug, that may cause corruption of data - for example an application upgrade may start to update every phone number record in a Reliable Dictionary with an invalid area code.  In this case, the invalid phone numbers will be replicated since service fabric is not aware of the nature of the data that is being stored.

The first thing to do after detecting such an egregious bug that causes data corruption is to freeze the service at application level and if possible upgrade to the version of the application code that does not have the bug.  However, even after the service code is fixed, the data may still be corrupt and thus data may need to be restored.  In such cases, it may not be sufficient to restore the latest backup, since the latest backups may also be corrupt.  Thus, one has to find the last backup that was taken before the data got corrupted.

If you are not sure which backups are corrupt, you could deploy a new Service Fabric cluster and restore the backups of affected partitions just like the above "Deleted Service" scenario.  For each partition, start restoring the backups from the most recent to the least. Once you find a backup that does not have the corruption, move/delete all backups of this partition that were more recent (than that backup). Repeat this process for each partition. Now, when **OnDataLossAsync** is called on the partition in the production cluster, the last backup found in the external store will be the one picked by the above process.

Now steps in "Deleted Service" can be used to restore the state of the service backup to the state before the buggy code corrupted the state.

Note that:

- When you restore there is a chance that the backup being restored is older than the state of the partition before the data was lost. Because of this Restore should only be used as a last resort to recover as much data as possible.

- The string that represents the backup folder path and the paths of files inside the backup folder can be greater than 255 characters depending on the FabricDataRoot path and Application Type name's length. This can cause some .Net methods like **Directory.Move** to throw the **PathTooLongException**. One workaround is to directly call kernel32 APIs like **CopyFile**.


## Under the hood: More details on Backup and Restore

### Backup
The Reliable State Manager provides the ability to create consistent backups without blocking any read or write operations. To do so, it utilizes a checkpoint and log persistence mechanism.  The Reliable State Manager takes fuzzy (lightweight) checkpoints at certain points to relieve pressure from the transactional log and improve recovery times.  When IReliableStateManager.**BackupAsync** is called, the Reliable State Manager instructs all Reliable Objects to copy their latest checkpoint files to a local backup folder.  Then, the Reliable State Manager copies all log records starting from the "start pointer" to the latest log record into the backup folder.  Since all the log records up to the latest log record are included in the backup and Reliable State Manager preserves Write Ahead Logging, Reliable State Manager guarantees that all transactions that are committed (CommitAsync has returned successfully) are included in the backup.

Any transaction that commits after the **BackupAsync** has been called, may or may not be in the backup.  Once the local backup folder has been populated by the platform (i.e., local backup completed by the runtime), the service's backup callback is invoked.  This callback is responsible for moving the backup folder to an external location such as Azure Storage.

### Restore

Reliable State Manager provides ability to restore from a backup by using the IReliableStateManager.RestoreAsync API.  The RestoreAsync method can only be called inside the **OnDataLossAsync** method.  The bool returned by **OnDataLossAsync** indicates whether the service restored its state from an external source.  If the **OnDataLossAsync** returns true, Service Fabric will rebuild all other replicas from this Primary.  Service Fabric ensures that replicas that are to receive **OnDataLossAsync** first transition to the Primary role, but are not granted Read Status or Write Status.  This implies that for StatefulService implementers, RunAsync will not be called until **OnDataLossAsync** completes successfully.  Then, **OnDataLossAsync** will be invoked on the new Primary. Until a service completes this API successfully (by returning true or false) and finishes the relevant reconfiguration, the API will keep being called one at a time.


RestoreAsync first drops all existing state in the Primary replica that it was called on.  After, the Reliable State Manager creates all the Reliable Objects that exists in the backup folder.  Next, the Reliable Objects are instructed to restore from their checkpoints in the backup folder.  Finally, Reliable State Manager recovers its own state from the log records in the backup folder and performs recovery.  As part of the recovery process, operations starting from the "starting point" that have commit log records in the backup folder are replayed to the Reliable Objects.  This step ensures that the recovered state is consistent.

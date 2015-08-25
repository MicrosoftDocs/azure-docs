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
   ms.date="08/18/2015"
   ms.author="mcoskun"/>

# Backup and Restore Reliable Services

Service Fabric is a high availability platform.
State of stateful services are replicated across multiple replicas.
Thus, even if one node in the cluster fails, the services and their state continue to be available.
While this in-built redundancy provided by the platform may be sufficient for some, in certain cases, it is desirable for the service to backup data to an external location.

For example, a service may want to backup data in the following scenarios:

1. In the event of the permanent loss of an entire Service Fabric cluster (i.e., all nodes within the cluster) or all nodes that are running a given partition. This may happen if your entire cluster is in one data center, and the entire data center goes down.

2. Administrative errors whereby state accidentally gets deleted/corrupted. For example, an administrator with sufficient privilege erroneously deleting the service.

3. Bugs in the service causing data corruption. For example, a service code upgrade that starts writing faulty data to a Reliable Collection.

4. Off-line data processing. It might be convenient to have off-line processing of data for business intelligence happening separately from the service generating the data.

The Backup/Restore feature allows services built on the Reliable Services API to create and restore backups.
The backup APIs provided by the platform allows backups of a partition’s state to be taken without blocking read or write operations.
The restore APIs allow a partition’s state to be restored from a chosen backup.

## Backup

Reliable State Manager provides ability to create consistent backups without blocking read and write operations.
To do this, it utilizes checkpoint and log persistence model.
Reliable State Manager takes fuzzy (lightweight) checkpoints at certain points to relieve pressure from the transactional log and to improve recovery times.
When IReliableStateManager.BackupAsync is called, Reliable State Manager instructs all Reliable Objects to copy their latest checkpoint files to a local backup folder.
Then, Reliable State Manager copies all log records starting from the "start pointer" to the latest log record into the backup folder.
Since all the log records up to the latest log record are included in the backup and Reliable State Manager preserves Write Ahead Logging, Reliable State Manager guarantees that all transactions that are committed (CommitAsync has returned successfully) are included in the backup.
Any transaction that commits after the BackupAsync has been called, may or may not be in the backup.

Once the local backup folder has been populated by the platform (i.e., local backup completed by the runtime), the service’s backup callback is invoked.
This callback is responsible for moving the backup folder to an external location such as Azure Storage.

### How to Backup

The Service author has full control of when to take backups and where backups will be stored.

To start a backup, the service needs to call IReliableStateManager.BackupAsync.
Note that backups can only be taken from Primary replicas and they require Write Status to be granted.
As shown below, the simplest overload of BackupAsync takes in Func<< BackupInfo, bool >> called backupCallback.

        await this.StateManager.BackupAsync(this.BackupCallbackAsync);

BackupInfo provides information regarding the backup, including the location of the folder where the runtime saved the backup (BackupInfo.Directory).
The callback function is expected to move the BackupInfo.Directory to an external Store.
The function also returns a bool that indicates whether it was able to successfully move the backup folder to its target location.

The following code demonstrates how the backupCallback can be used to upload the backup to Azure Storage:

        private async Task<bool> BackupCallbackAsync(BackupInfo backupInfo)
        {
            var backupId = Guid.NewGuid();

            await externalBackupStore.UploadBackupFolderAsync(backupInfo.Directory, backupId, CancellationToken.None);

            return true;
        }

In the above example, ExternalBackupStore is the sample class that is used to interface with Azure Blob Storage.
UploadBackupFolderAsync method compresses the folder and places it in Azure Blob Store.

### Additional Notes on BackupAsync

- There can only be one BackupAsync per replica inflight at any given point of time. More than one BackupAsync call at a time will throw FabricBackupInProgressException to limit inflight backups to one.

- If a replica fails over while a backup is in progress, the backup may not have been completed. Thus, once the failover completes, it is the service's responsibility to restart the backup by invoking BackupAsync as necessary.

## Restore

Reliable State Manager provides ability to restore from a backup by using the IReliableStateManager.RestoreAsync API.
The RestoreAsync method can only be called inside the StatefulServiceReplica.OnDataLossAsync method.
OnDataLossAsync is a service API that is called by Service Fabric when Service Fabric suspects that data has been lost.
Note Service Fabric guarantees that this API will be called if there was data loss, however, it is not guaranteed that service had data loss if this API was called.
The bool returned by OnDataLossAsync indicates whether the service restored its state from an external source.
If the OnDataLossAsync returns true, Service Fabric will rebuild all other replicas from this Primary.
Replica that receive OnDataLossAsync will first transition to Primary role, but it will not be granted Read Status or Write Status.
This implies that for StatefulService implementers, RunAsync will not be called until OnDataLossAsync completes successfully.
Until a service completes this API successfully (by returning true or false) and finishes the relevant reconfiguration, the API will keep being called.

RestoreAsync first drops all existing state in the Primary replica that it was called on.
After, the Reliable State Manager creates all the Reliable Objects that exists in the backup folder.
Next, the Reliable Objects are instructed to restore from their checkpoints in the backup folder.
Finally, Reliable State Manager recovers its own state from the log records in the backup folder and performs recovery.
As part of the recovery process, operations starting from the "starting point" that have commit log records in the backup folder are replayed to the Reliable Objects.
This step ensures that the recovered state is consistent.

### How to Restore

One can classify the restoration scenarios where the running service has to restore data from the backup store into the following:

1. Service partition lost data. For example, the disk for two out of three replicas for a partition (including the primary replica) gets corrupted/wiped. The data for the new primary has to be restored.

2. Entire service is lost. For example, an administrator removes the entire service – thus the service and the data needs to be restored.

3. Service replicated application level corrupted data. In this case, the service has to be upgraded/reverted to remove the cause of the corruption and non-corrupt data has to be restored.

While many approaches are possible, we offer some examples on using RestoreAsync to recover from the above scenarios.

#### Partition Data Loss

In this case, the runtime would automatically detect the data loss and invoke the OnDataLossAsync API.
The service author needs to perform the following to recover:
- Override the OnDataLossAsync
- Find the latest backup in the external location which contains service's backups
- Download the latest backup (and uncompress the backup into the backup folder if it was compressed).
- Call IReliableStateManager.RestoreAsync with the path to the backup folder.
- Return true if the restoration happened successfully.

Following is an example implementation of OnDataLossAsync call.

        protected override async Task<bool> OnDataLossAsync(CancellationToken cancellationToken)
        {
            var backupFolder = await this.externalBackupStore.DownloadLastBackupAsync(cancellationToken);

            await this.StateManager.RestoreAsync(backupFolder);

            return true;
        }

The RestorePolicy is set to Safe by default.
This means that the RestoreAsync API will fail with ArgumentException if it detects that the backup folder contains state that is older than or equal to the state contained in this replica.
RestorePolicy.Force can be used to skip this safety check.

#### Deleted Service

If a service is removed, one must first recreate the service before the data can be restored.
It is important to create the service with the same configuration, e.g. partitioning scheme, so that the data can be restored seemlessly.

Once the service is up, we need a way to cause the OnDataLossAsync API to be called on every partition of this service.
One way of achieving this is using FabricClient.ServiceManager.InvokeDataLossAsync on every partition.
For more information on InvokeDataLossAsync, please see the Testability chapter.

From this point, implementation is same as the above scenario.
Each partition needs to restore the latest relevant backup from the external.
One caveat is that the partition ID may have now changed, since the runtime creates partition IDs dynamically).
Thus, the service should use the appropriate partition information and service name to identify the correct latest backup to restore from.

#### Replicated Application Level Corruption

An example for this case is if the new buggy code after an application upgrade that starts to update every phone number record in a Reliable Dictionary with an invalid area code.
In this case, the invalid phone numbers will be replicated across the replica set.

The first thing to do after detection is to freeze the service at application level and if possible upgrade to the version of the application code that does not have the bug.
However, even after the service code is fixed, the data may still be corrupt and data needs to be restored.
In such cases, it may not be sufficient to restore the latest backup, since the latest backups may also be corrupt.
Thus, one has to find the latest backup that was taken before the data got corrupted.

One way to do this is to deploy a new Service Fabric cluster and restore the backups of affected partitions just like the above "Service lost" scenario.
Once the latest backup before the data corruption occurred is found, one can move/delete all backups of this partition after this backup.
Now, when OnDataLossAsync is called on the partition in the production cluster, the last backup found in the external store, will be the backup cherry picked by the above process.

Now steps in "Deleted Service" can be used to restore the state of the service backup to the state before the buggy code corrupted the state.

### Additional Notes on RestoreAsync

- Every time we restore, there is a chance that the backup being restored is older than the state of the partition before the data was lost. Because of the Restore should only be used as a last resort to recover as much data as possible.

## Recommendations

- The string that represents the backup folder path as well as the paths of files inside the backup folder can be greater than 255 characters depending on the FabricDataRoot path and Application Type name's length. This can cause some .Net methods like Directory.Move to throw the PathTooLongException. As one work around option, one may call directly kernel32 APIs like CopyFile.

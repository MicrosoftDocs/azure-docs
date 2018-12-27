---
title: Restoring Backup in Azure Service Fabric | Microsoft Docs
description: Use Service Fabric's periodic backup and restore feature for restoring data from backup of your application data.
services: service-fabric
documentationcenter: .net
author: aagup
manager: timlt
editor: aagup

ms.assetid: 802F55B6-6575-4AE1-8A8E-C9B03512FF88
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/30/2018
ms.author: aagup

---

# Restoring backup in Azure Service Fabric

In Azure Service Fabric, Reliable Stateful services and Reliable Actors can maintain a mutable, authoritative state after a request and response transaction is completed. A stateful service might go down for a long time or lose information due to a disaster. If that happens, the service needs to be restored from the latest acceptable backup so that it can keep providing service.

For example, you can configure a service to backup its data to protect against the following scenarios:

- Permanent loss of an entire Service Fabric cluster. **(Case of Disaster Recovery - DR)**
- Permanent loss of a majority of the replicas of a service partition. **(Case of data loss)**
- Accidental deletion or corruption of the service. For example, an administrator erroneously deletes the service. **(Case of data loss)**
- Bugs in the service cause data corruption. For example, data corruption may happen when a service code upgrade writes faulty data to a Reliable Collection. In such a case, you may have to restore both the code and the data to an earlier state. **(Case of data corruption)**

## Prerequisites

* To trigger a restore, enable the _Fault Analysis Service (FAS)_ for the cluster.
* The _Backup Restore Service (BRS)_ created the backup.
* The restore can only be triggered at a partition.

## Triggered restore

A restore can be triggered for any of the following scenarios:

* Data restore in the event of _disaster recovery_ (DR).
* Data restore in the event of _data corruption / data loss_.

### Data restore in the event of disaster recovery (DR)

If an entire Service Fabric cluster is lost, the data for the partitions of the Reliable Stateful service and Reliable Actors can be restored to an alternate cluster. The desired backup can be selected from the enumeration of [GetBackupAPI with backup storage Details](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-getbackupsfrombackuplocation). The Backup Enumeration can be for an application, service, or partition.

Lets assume the lost cluster is the same cluster that's referred to in [Enabling periodic backup for Reliable Stateful service and Reliable Actors](service-fabric-backuprestoreservice-quickstart-azurecluster.md#enabling-periodic-backup-for-reliable-stateful-service-and-reliable-actors). In this case, `SampleApp` is deployed with backup policy enabled, and the backups are configured to Azure Storage.

Execute a PowerShell script to enumerate the backups. The script invokes the REST API to return a list of the backups created for all partitions inside the `SampleApp` application. The API requires the backup storage information to enumerate the available backups.

```powershell
$StorageInfo = @{
    ConnectionString = 'DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net'
    ContainerName = 'backup-container'
    StorageKind = 'AzureBlobStore'
}

$BackupEntity = @{
    EntityKind = 'Application'
    ApplicationName='fabric:/SampleApp'
}

$BackupLocationAndEntityInfo = @{
    Storage = $StorageInfo
    BackupEntity = $BackupEntity
}

$body = (ConvertTo-Json $BackupLocationAndEntityInfo)
$url = "https://myalternatesfcluster.southcentralus.cloudapp.azure.com:19080/BackupRestore/$/GetBackups?api-version=6.4"

$response = Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
$BackupPoints = (ConvertFrom-Json $response.Content)
$BackupPoints.Items
```

Sample output for the above run:

```
BackupId                : b9577400-1131-4f88-b309-2bb1e943322c
BackupChainId           : b9577400-1131-4f88-b309-2bb1e943322c
ApplicationName         : fabric:/SampleApp
ServiceName             : fabric:/SampleApp/MyStatefulService
PartitionInformation    : @{LowKey=-9223372036854775808; HighKey=9223372036854775807; ServicePartitionKind=Int64Range; Id=974bd92a-b395-4631-8a7f-53bd4ae9cf22}
BackupLocation          : SampleApp\MyStatefulService\974bd92a-b395-4631-8a7f-53bd4ae9cf22\2018-04-06 20.55.16.zip
BackupType              : Full
EpochOfLastBackupRecord : @{DataLossNumber=131675205859825409; ConfigurationNumber=8589934592}
LsnOfLastBackupRecord   : 3334
CreationTimeUtc         : 2018-04-06T20:55:16Z
FailureError            : 
*
BackupId                : b0035075-b327-41a5-a58f-3ea94b68faa4
BackupChainId           : b9577400-1131-4f88-b309-2bb1e943322c
ApplicationName         : fabric:/SampleApp
ServiceName             : fabric:/SampleApp/MyStatefulService
PartitionInformation    : @{LowKey=-9223372036854775808; HighKey=9223372036854775807; ServicePartitionKind=Int64Range; Id=974bd92a-b395-4631-8a7f-53bd4ae9cf22}
BackupLocation          : SampleApp\MyStatefulService\974bd92a-b395-4631-8a7f-53bd4ae9cf22\2018-04-06 21.10.27.zip
BackupType              : Incremental
EpochOfLastBackupRecord : @{DataLossNumber=131675205859825409; ConfigurationNumber=8589934592}
LsnOfLastBackupRecord   : 3552
CreationTimeUtc         : 2018-04-06T21:10:27Z
FailureError            :
*
BackupId                : 69436834-c810-4163-9386-a7a800f78359
BackupChainId           : b9577400-1131-4f88-b309-2bb1e943322c
ApplicationName         : fabric:/SampleApp
ServiceName             : fabric:/SampleApp/MyStatefulService
PartitionInformation    : @{LowKey=-9223372036854775808; HighKey=9223372036854775807; ServicePartitionKind=Int64Range; Id=974bd92a-b395-4631-8a7f-53bd4ae9cf22}
BackupLocation          : SampleApp\MyStatefulService\974bd92a-b395-4631-8a7f-53bd4ae9cf22\2018-04-06 21.25.36.zip
BackupType              : Incremental
EpochOfLastBackupRecord : @{DataLossNumber=131675205859825409; ConfigurationNumber=8589934592}
LsnOfLastBackupRecord   : 3764
CreationTimeUtc         : 2018-04-06T21:25:36Z
FailureError            :
```

To trigger the restore, you need to choose the desired backup. The current backup for disaster recovery (DR) could be the following backup:

```
BackupId                : b0035075-b327-41a5-a58f-3ea94b68faa4
BackupChainId           : b9577400-1131-4f88-b309-2bb1e943322c
ApplicationName         : fabric:/SampleApp
ServiceName             : fabric:/SampleApp/MyStatefulService
PartitionInformation    : @{LowKey=-9223372036854775808; HighKey=9223372036854775807; ServicePartitionKind=Int64Range; Id=974bd92a-b395-4631-8a7f-53bd4ae9cf22}
BackupLocation          : SampleApp\MyStatefulService\974bd92a-b395-4631-8a7f-53bd4ae9cf22\2018-04-06 21.10.27.zip
BackupType              : Incremental
EpochOfLastBackupRecord : @{DataLossNumber=131675205859825409; ConfigurationNumber=8589934592}
LsnOfLastBackupRecord   : 3552
CreationTimeUtc         : 2018-04-06T21:10:27Z
FailureError            :
```

For the restore API, you need to provide the __BackupId__ and __BackupLocation__ details.

You also need to choose a destination partition in the alternate cluster as detailed in the [partition scheme](service-fabric-concepts-partitioning.md#get-started-with-partitioning). The backup from the alternate cluster is restored to this partition as specified in the partition scheme from the original lost cluster.

If the partition ID on alternate cluster is `1c42c47f-439e-4e09-98b9-88b8f60800c6`, you can map it to the original cluster partition ID `974bd92a-b395-4631-8a7f-53bd4ae9cf22` by comparing the high key and low key for _Ranged Partitioning (UniformInt64Partition)_.

For _Named Partitioning_, the name value is compared to identify the target partition in alternate cluster.

You request the restore against the backup cluster partition by using the following [Restore API](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-restorepartition).

```powershell
$RestorePartitionReference = @{
    BackupId = 'b0035075-b327-41a5-a58f-3ea94b68faa4'
    BackupLocation = 'SampleApp\MyStatefulService\974bd92a-b395-4631-8a7f-53bd4ae9cf22\2018-04-06 21.10.27.zip'
}

$body = (ConvertTo-Json $RestorePartitionReference) 
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Partitions/1c42c47f-439e-4e09-98b9-88b8f60800c6/$/Restore?api-version=6.4" 

Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
```

You can track the progress of a restore with [TrackRestoreProgress](service-fabric-backup-restore-service-trigger-restore.md#tracking-restore-progress).

### Data restore in the event of _data corruption / data loss_

In the cases of _data loss_ or _data corruption_, data backed up Reliable Stateful service and Reliable Actors partitions can be restored to any of the chosen backups.

The following case is a continuation of the example described in [Enabling periodic backup for Reliable Stateful service and Reliable Actors](service-fabric-backuprestoreservice-quickstart-azurecluster.md#enabling-periodic-backup-for-reliable-stateful-service-and-reliable-actors). In this example, a backup policy is enabled for the partition, and backup is occurring at a desired frequency in an Azure Storage.

You select the desired backup from the output of  [GetBackupAPI](service-fabric-backuprestoreservice-quickstart-azurecluster.md#list-backups). In this scenario, the backup is generated from the same cluster as before.

For triggering the restore, you need to choose the desired backup from the list. Our desired backup for the current _data loss_ / _data corruption_ is the following backup:

```
BackupId                : b0035075-b327-41a5-a58f-3ea94b68faa4
BackupChainId           : b9577400-1131-4f88-b309-2bb1e943322c
ApplicationName         : fabric:/SampleApp
ServiceName             : fabric:/SampleApp/MyStatefulService
PartitionInformation    : @{LowKey=-9223372036854775808; HighKey=9223372036854775807; ServicePartitionKind=Int64Range; Id=974bd92a-b395-4631-8a7f-53bd4ae9cf22}
BackupLocation          : SampleApp\MyStatefulService\974bd92a-b395-4631-8a7f-53bd4ae9cf22\2018-04-06 21.10.27.zip
BackupType              : Incremental
EpochOfLastBackupRecord : @{DataLossNumber=131675205859825409; ConfigurationNumber=8589934592}
LsnOfLastBackupRecord   : 3552
CreationTimeUtc         : 2018-04-06T21:10:27Z
FailureError            :
```

For the restore API, you need to provide the __BackupId__ and __BackupLocation__ details. The cluster has backup enabled so the Service Fabric _Backup Restore Service (BRS)_ identifies the correct storage location from the associated backup policy.

```powershell
$RestorePartitionReference = @{
    BackupId = 'b0035075-b327-41a5-a58f-3ea94b68faa4',
    BackupLocation = 'SampleApp\MyStatefulService\974bd92a-b395-4631-8a7f-53bd4ae9cf22\2018-04-06 21.10.27.zip'
}

$body = (ConvertTo-Json $RestorePartitionReference)
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/Restore?api-version=6.4"

Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
```

You can track the restore progress by using [TrackRestoreProgress](service-fabric-backup-restore-service-trigger-restore.md#tracking-restore-progress).

## Tracking restore progress

A partition of a Reliable Stateful service or Reliable Actor accepts only one restore request at a time. A partition only accepts another request after the current restore request has completed. Multiple restore requests can be triggered on different partitions at the same time.

```powershell
$url = "https://mysfcluster-backup.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/GetRestoreProgress?api-version=6.4"

$response = Invoke-WebRequest -Uri $url -Method Get -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'

$restoreResponse = (ConvertFrom-Json $response.Content)
$restoreResponse | Format-List
```

The restore request progresses in the following order:

1. __Accepted__  - An _Accepted_ restore state indicates that the requested partition has been triggered with correct request parameters.
    ```
    RestoreState  : Accepted
    TimeStampUtc  : 0001-01-01T00:00:00Z
    RestoredEpoch : @{DataLossNumber=131675205859825409; ConfigurationNumber=8589934592}
    RestoredLsn   : 3552
    ```
    
2. __InProgress__ - An _InProgress_ restore state indicates that the a restore is occurring in the partition with the backup mentioned in request. The partition reports _dataloss_ state.
1. 
    ```
    RestoreState  : RestoreInProgress
    TimeStampUtc  : 0001-01-01T00:00:00Z
    RestoredEpoch : @{DataLossNumber=131675205859825409; ConfigurationNumber=8589934592}
    RestoredLsn   : 3552
    ```
    
3. __Success__/ __Failure__/ __Timeout__ - A requested restore can be completed in any of the following states. Each state has the following significance and response details:
    * __Success__ - A _Success_ restore state indicates a regained  partition state. The partition reports _RestoreEpoch_ and _RestordLSN_ states along with the time in UTC.

        ```
        RestoreState  : Success
        TimeStampUtc  : 2018-11-22T11:22:33Z
        RestoredEpoch : @{DataLossNumber=131675205859825409; ConfigurationNumber=8589934592}
        RestoredLsn   : 3552
        ```        
    * __Failure__ - A _Failure_ restore state indicates the failure of the restore request. The cause of the failure is reported.

        ```
        RestoreState  : Failure
        TimeStampUtc  : 0001-01-01T00:00:00Z
        RestoredEpoch : 
        RestoredLsn   : 0
        ```
    * __Timeout__ - A _Timeout_ restore state indicates that the request has timeout. Create a new restore request with greater [RestoreTimeout](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-backuppartition#backuptimeout). The default timeout is 10 minutes. Ensure that the partition is not in a data loss state before requesting restore again.
     
        ```
        RestoreState  : Timeout
        TimeStampUtc  : 0001-01-01T00:00:00Z
        RestoredEpoch : 
        RestoredLsn   : 0
        ```

## Automatic restore

You can configure Reliable Stateful service and Reliable Actors partitions in the Service Fabric cluster for _auto restore_. In the backup policy set `AutoRestore` to _true_. Enabling _auto restore_ automatically restores data from the latest partition backup when data loss is reported. Refer to the following articles for more information:

- [Auto Restore Enablement in Backup Policy](service-fabric-backuprestoreservice-configure-periodic-backup.md#auto-restore-on-data-loss)
- [RestorePartition API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-restorepartition)
- [GetPartitionRestoreProgress API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-getpartitionrestoreprogress)

## Next steps
- [Understanding periodic backup configuration](./service-fabric-backuprestoreservice-configure-periodic-backup.md)
- [Backup restore REST API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-index-backuprestore)

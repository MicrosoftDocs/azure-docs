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

#  Restoring backup in Azure Service Fabric


Reliable Stateful services and Reliable Actors in Service Fabric can maintain mutable, authoritative state beyond the request and response or a complete transaction. If a stateful service goes down for a long time or loses information due to a disaster, it may need to be restored to latest acceptable backup of its state in order to continue providing service after it comes back.

For example, service may want to backup its data in order to protect from the following scenarios:

- In the event of the permanent loss of an entire Service Fabric cluster. **(Case of Disaster Recovery - DR)**
- Permanent loss of a majority of the replicas of a service partition. **(Case of data loss)**
- Administrative errors whereby the state accidentally gets deleted or corrupted. For example, an administrator with sufficient privilege erroneously deletes the service.**(Case of data loss)**
- Bugs in the service that cause data corruption. For example, data corruption may happen when a service code upgrade starts writing faulty data to a Reliable Collection. In such a case, both the code and the data may have to be reverted to an earlier state. **(Case of data corruption)**


## Prerequisites
* To trigger, restore the _Fault Analysis Service (FAS)_ should be enabled for the cluster
* The backup to be restore should have been taken by _Backup Restore Service (BRS)_
* The restore can only be triggered at a partition.

## Triggering restore

The restore can be for any of the following scenarios 
* Data restore in the event of _disaster recovery_ (DR)
* Data restore in the event of _data corruption / data loss_



### Data restore in the event of _disaster recovery_ (DR)
In the event of an entire Service Fabric cluster being lost, the data for the partitions of the Reliable Stateful service and Reliable Actors can be restored to an alternate cluster. The desired backup can be selected from enumeration of [GetBackupAPI with backup storage Details](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-getbackupsfrombackuplocation). The Backup Enumeration can be for an application, service, or partition.

Let's assume the lost cluster was the cluster mentioned in [Enabling periodic backup for Reliable Stateful service and Reliable Actors](service-fabric-backuprestoreservice-quickstart-azurecluster.md#enabling-periodic-backup-for-reliable-stateful-service-and-reliable-actors), which had `SampleApp` deployed, where the partition was having backup policy enabled and backups were happening in Azure Storage. 


Execute following PowerShell script to invoke the REST API to enumerate the backups created for all partitions inside the `SampleApp` application in lost Service Fabric cluster. The enumeration API requires storage information, where the backups of an application are stored, for enumerating available backups. 

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



For triggering the restore, we need to choose the desired backup. Let the desired backup for the current disaster recovery (DR) be the following backup

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

For the restore API, we need to provide the __BackupId__ and __BackupLocation__ details. 
The partition in alternate cluster needs to chosen as per the [partition scheme](service-fabric-concepts-partitioning.md#get-started-with-partitioning). It's the user responsibility to chose target partition to restore the backup from the alternate cluster as per the partition scheme in original lost cluster.

Assume that the partition ID on alternate cluster is `1c42c47f-439e-4e09-98b9-88b8f60800c6`, which maps to the original cluster partition ID `974bd92a-b395-4631-8a7f-53bd4ae9cf22` by comparing the high key and low key for _Ranged Partitioning (UniformInt64Partition)_.

For _Named Partitioning_, the name value is compared to identify the target partition in alternate cluster.

The restore is requested against partition of backup cluster by the following [Restore API](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-restorepartition)

```powershell 
$RestorePartitionReference = @{ 
    BackupId = 'b0035075-b327-41a5-a58f-3ea94b68faa4'
    BackupLocation = 'SampleApp\MyStatefulService\974bd92a-b395-4631-8a7f-53bd4ae9cf22\2018-04-06 21.10.27.zip' 
} 
 
$body = (ConvertTo-Json $RestorePartitionReference) 
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Partitions/1c42c47f-439e-4e09-98b9-88b8f60800c6/$/Restore?api-version=6.4" 
 
Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
``` 
The progress of the restore can be [TrackRestoreProgress](service-fabric-backuprestoreservice-trigger-restore.md#tracking-restore-progress)

### Data restore in the event of _data corruption / data loss_

For the case of _data loss_ or _data corruption_ the data, for the partitions of the Reliable Stateful service and Reliable Actors can be restored to any of the chosen backups. 
The following case is the continuation of sample as mentioned in [Enabling periodic backup for Reliable Stateful service and Reliable Actors](service-fabric-backuprestoreservice-quickstart-azurecluster.md#enabling-periodic-backup-for-reliable-stateful-service-and-reliable-actors), where the partition has a backup policy enabled and is taking backup at a desired frequency in an Azure Storage. 

The desired backup is selected from the output of  [GetBackupAPI](service-fabric-backuprestoreservice-quickstart-azurecluster.md#list-backups). In this scenario, the backup is generated from the same cluster in the past.
For triggering the restore, we need to choose the desired backup from the list. Let our desired backup for the current _data loss_ / _data corruption_ be the following backup

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

For the restore API, we need to provide the __BackupId__ and __BackupLocation__ details. Since the cluster has backup enabled the Service Fabric _Backup Restore Service (BRS)_ identifies the correct storage location from the associated backup policy.

```powershell
$RestorePartitionReference = @{ 
    BackupId = 'b0035075-b327-41a5-a58f-3ea94b68faa4', 
    BackupLocation = 'SampleApp\MyStatefulService\974bd92a-b395-4631-8a7f-53bd4ae9cf22\2018-04-06 21.10.27.zip' 
} 
 
$body = (ConvertTo-Json $RestorePartitionReference) 
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/Restore?api-version=6.4" 
 
Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
```

The progress of the restore can be [TrackRestoreProgress](service-fabric-backuprestoreservice-trigger-restore.md#tracking-restore-progress)


## Tracking restore progress

A partition of a Reliable Stateful service or Reliable Actor accepts only one restore request at a time. Another request can be accepted only when the current restore request has completed. Multiple restore requests can be triggered on different partitions at a same time.

```powershell
$url = "https://mysfcluster-backup.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/GetRestoreProgress?api-version=6.4" 
 
$response = Invoke-WebRequest -Uri $url -Method Get -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3' 
 
$restoreResponse = (ConvertFrom-Json $response.Content) 
$restoreResponse | Format-List
```

the restore request progresses in the following order

1. __Accepted__  - The restore state as _Accepted_ indicates that the requested has been triggered with correct request parameters.
    ```
    RestoreState  : Accepted
    TimeStampUtc  : 0001-01-01T00:00:00Z
    RestoredEpoch : @{DataLossNumber=131675205859825409; ConfigurationNumber=8589934592}
    RestoredLsn   : 3552
    ```
    
2. __InProgress__ - The restore state as _InProgress_ indicates that the partition will undergo a restore with the backup mentioned in request. The partition will report _dataloss_ state.
    ```
    RestoreState  : RestoreInProgress
    TimeStampUtc  : 0001-01-01T00:00:00Z
    RestoredEpoch : @{DataLossNumber=131675205859825409; ConfigurationNumber=8589934592}
    RestoredLsn   : 3552
    ```
    
3. __Success__/ __Failure__/ __Timeout__ - A requested restore can be completed in any of the following states. Each state has the following significance and response details.
       
    * __Success__ - The restore state as _Success_ indicates the partition state is regained. The response will provide RestoreEpoch and RestordLSN for the partition along with the time in UTC. 
    
        ```
        RestoreState  : Success
        TimeStampUtc  : 2018-11-22T11:22:33Z
        RestoredEpoch : @{DataLossNumber=131675205859825409; ConfigurationNumber=8589934592}
        RestoredLsn   : 3552
        ```
        
    *. __Failure__ - The restore state as _Failure_ indicates the failure of the restore request. The cause of the failure will be stated in request.
        ```
        RestoreState  : Failure
        TimeStampUtc  : 0001-01-01T00:00:00Z
        RestoredEpoch : 
        RestoredLsn   : 0
        ```
    *. __Timeout__ - The restore state as _Timeout_ indicates the request has timeout. New restore request with greater [RestoreTimeout](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-backuppartition#backuptimeout) is recommended; defaults timeout is 10 minutes. It is advised to make sure that the partition is out of data loss state, before requesting restore again.
     
        ```
        RestoreState  : Timeout
        TimeStampUtc  : 0001-01-01T00:00:00Z
        RestoredEpoch : 
        RestoredLsn   : 0
        ```

## Auto restore

The partitions for the Reliable Stateful service and Reliable Actors in the Service Fabric cluster can be configured for _auto restore_. While creating the backup policy, the policy can have `AutoRestore` set to _true_.  Enabling _auto restore_ for a partition, restores the data from the latest backup if data loss is reported.
 
 [Auto Restore Enablement in Backup Policy](service-fabric-backuprestoreservice-configure-periodic-backup.md#auto-restore-on-data-loss)


[RestorePartition API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-restorepartition)
[GetPartitionRestoreProgress API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-getpartitionrestoreprogress)

## Next steps
- [Understanding periodic backup configuration](./service-fabric-backuprestoreservice-configure-periodic-backup.md)
- [Backup restore REST API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-index-backuprestore)

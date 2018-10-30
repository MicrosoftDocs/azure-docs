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

#  Restoring Backup in Azure Service Fabric

> [!div class="op_single_selector"]
> * [Clusters on Azure](service-fabric-backuprestoreservice-quickstart-azurecluster.md) 
> * [Standalone Clusters](service-fabric-backuprestoreservice-quickstart-standalonecluster.md)
> 

Service Fabric is a distributed systems platform that makes it easy to develop and manage reliable, distributed, microservices based cloud applications. It allows running of both stateless and stateful micro services. Stateful services can maintain mutable, authoritative state beyond the request and response or a complete transaction. If a Stateful service goes down for a long time or loses information due to a disaster, it may need to be restored to some recent backup of its state in order to continue providing service after it comes back up.

For example, service may want to back up its data in order to protect from the following scenarios:

- In the event of the permanent loss of an entire Service Fabric cluster. **(Case of Disaster Recovery)**
- Permanent loss of a majority of the replicas of a service partition. **(Case of Data Loss)**
- Administrative errors whereby the state accidentally gets deleted or corrupted. For example, an administrator with sufficient privilege erroneously deletes the service.**(Case of Data Corruption)**
- Bugs in the service that cause data corruption. For example, data corruption may happen when a service code upgrade starts writing faulty data to a Reliable Collection. In such a case, both the code and the data may have to be reverted to an earlier state. **(Case of Data Corruption)**


## Prerequisites
* To trigger, restore the Fault Analysis Service (FAS) should be enabled on cluster
* The backup for restore should be taken by Backup Restore Service (BRS)
* The restore can be requested partition by partition. 

The restore can be for any of the following scenarios 

## On-Demand Restore - The Case of Disaster Recovery (DR)
In case of an entire Service Fabric cluster being lost, the data for the partitions of the Reliable Service and Reliable Actors can be restored to a backup cluster. The desired backup can be selected from enumeration of GetBackupAPI with Backup Storage Details. The Backup Enumeration can be for an application, service, or partition.

Execute following PowerShell script to invoke the HTTP API to enumerate the backups created for all partitions inside the `SampleApp` application in lost Service Fabric cluster.
The enumeration API requires storage for enumeration and the service fabric entity it is trying to enumerate.

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
$url = "https://mybackupsfcluster.southcentralus.cloudapp.azure.com:19080/$/GetBackups?api-version=6.4"

Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
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



For triggering the restore, we need to choose the desired backup. Let the desired backup for the current Disaster Recovery (DR) be the following backup

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

For the restore API, we need to provide the __BackupId__ and __BackupLocation__ Details. 
The partition information for the backup cluster is mapped to the original cluster. 
The partition in backup cluster is chosen as per the [partition scheme](service-fabric-concepts-partitioning.md#get-started-with-partitioning). 

The partition id on Backup Cluster is identified as 1c42c47f-439e-4e09-98b9-88b8f60800c6, which maps to the original cluster partition ID 974bd92a-b395-4631-8a7f-53bd4ae9cf22 by comparing the high key and low key for Ranged partitioning (UniformInt64Partition), name for NamedPartitioning.

The restore is requested against partition of backup cluster by the following Restore API 

```powershell 
$RestorePartitionReference = @{ 
    BackupId = 'b0035075-b327-41a5-a58f-3ea94b68faa4', 
    BackupLocation = 'SampleApp\MyStatefulService\974bd92a-b395-4631-8a7f-53bd4ae9cf22\2018-04-06 21.10.27.zip' 
} 
 
$body = (ConvertTo-Json $RestorePartitionReference) 
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Partitions/1c42c47f-439e-4e09-98b9-88b8f60800c6/$/Restore?api-version=6.4" 
 
Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
``` 
The progress of the restore can be [TrackRestoreProgress](service-fabric-backuprestoreservice-trigger-restore.md#tracking-restore-progress)

## On-Demand Restore - The Case of Data Corruption / Data Loss

For the case of Data Loss or Data Corruption the data, for the partitions of the Reliable Service and Reliable Actors can be restored to any of the chosen backups. 
The following case is the continuation of sample as mentioned in [Enabling periodic backup for Reliable Stateful service and Reliable Actors](service-fabric-backuprestoreservice-quickstart-azurecluster.md#enabling-periodic-backup-for-reliable-stateful-service-and-reliable-actors), where the partition has a backup policy enabled and is taking backup at a desired frequency in an azure storage. 

The desired backup is selected from the output of  [GetBackupAPI](service-fabric-backuprestoreservice-quickstart-azurecluster.md#list-backups).
For triggering the restore, we need to choose the desired backup from the list. Let our desired backup for the current Data Loss / Data Corruption be the following backup

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

For the restore API, we need to provide the __BackupId__ and __BackupLocation__ Details. Since the cluster has backup enabled the Service Fabric backup restore service (BRS) identifies the correct storage location from the policy enabled and restore by automatically connecting to it. 

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


## Auto Restore

 The partitions for the Reliable Service and Reliable Actors in the Service Fabric Cluster can be enabled for Auto Restore, while enabling the Backup Policy the partition can be hooked up with the policy that has the Auto Restore Enabled which automatically restore the reliable collection data of the partition to the latest backup if Data Loss is reported for the partition.
 
 [Auto Restore Enablement in Backup Policy](service-fabric-backuprestoreservice-configure-periodic-backup.md#auto-restore-on-data-loss)

## Tracking Restore Progress

A partition of a Reliable Service and Reliable Actor accepts only one restore request at a time. Another request can be accepted only when the current restore request has completed. Multiple restore requests can be triggered on different partitions at a same time.

```powershell
$url = "https://mysfcluster-backup.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/GetRestoreProgress?api-version=6.4" 
 
$response = Invoke-WebRequest -Uri $url -Method Get -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3' 
 
$restoreResponse = (ConvertFrom-Json $response.Content) 
$restoreResponse 
```


The restore request following the following order

1. __Accepted__  - Signifies the restore request is accepted. The restore requested has been triggered with correct request.
2. __InProgress__ - The Data Loss has been initiated on the partition and partition will undergo a restore now.
3. __Success__/ __Failure__/ __Timeout__ - A requested restore can be completed in any of the following states. Each state has the following significance and response details.
       
    1. __Success__ - The restore state as Success corresponds to the Partition state is regained. The response will provide RestoreEpoch and RestordLSN for the Partition along with the time in UTC. 
    
        ```
        RestoreState    Success        
        TimeStampUtc    2018-10-22T12:07:36Z 
        RestoredEpoch   @{DataLossNumber=131846800323087021;          ConfigurationNumber=12884901888}           
        RestoredLsn     24 
        ```
        
 
    2. __Failure__ - The restore state as Failure symbolizes the failure of the restore request. The cause of the failure will be stated in request.
     
    3. __Timeout__ - The restore state as TimeOut symbolizes that default timeout of 10 minutes wasn’t enough to complete restore. The state of the partition is unknown. Initiating a new restore request with greater timeout in Restore Request will be the correct way to restore partition. 
     
        ```
        RestoreState    Timeout
        Code            FABRIC_E_TIMEOUT
        Message         The request of restore has timed out
        ```


[RestorePartition API reference](https://docs.microsoft.com/en-us/rest/api/servicefabric/sfclient-api-restorepartition)
[GetPartitionRestoreProgress API reference](https://docs.microsoft.com/en-us/rest/api/servicefabric/sfclient-api-getpartitionrestoreprogress)

## Next steps
- [Understanding periodic backup configuration](./service-fabric-backuprestoreservice-configure-periodic-backup.md)
- [Backup restore REST API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-index-backuprestore)

[0]: ./media/service-fabric-backuprestoreservice/PartitionBackedUpHealthEvent_Azure.png

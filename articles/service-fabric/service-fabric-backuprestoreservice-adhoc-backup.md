---
title: Ad Hoc Backup in Azure Service Fabric | Microsoft Docs
description: Use Service Fabric's backup and restore feature for Ad Hoc backup of your application data.
services: service-fabric
documentationcenter: .net
author: aagup
manager: timlt
editor: aagup

ms.assetid: 02DA262A-EEF6-4F90-842E-FFC4A09003E5
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/30/2018
ms.author: aagup

---
# Ad Hoc Backup in Azure Service Fabric

Service Fabric is a distributed systems platform that makes it easy to develop and manage reliable, distributed, microservices based cloud applications. It allows running of both stateless and stateful micro services. Stateful services can maintain mutable, authoritative state beyond the request and response or a complete transaction. The data of the Reliable Services and Reliable Actors can be backed to over come any of the disaster scenarios or data loss scenarios.

Service Fabric is equipped with feature of regularly backing up data and Ad-Hoc backup of data. Ad-Hoc Backup are useful as they provide extra guard against unwanted data loss/corruption scenarios.

The Ad-Hoc backup feature are helpful in following scenarios

1. Ad-Hoc Backups helps in maintaining extra safety feature by providing backup of vital data across cluster region. Along with periodic backup one can trigger Ad-Hoc backups to have data being available across region in case of Disaster, where a complete region can be lost.

2. One can trigger Ad-Hoc backup along with periodic backup as additional backup before triggering an upgrade.Before upgrading it is advised to have backup as it will have the data guarded against data corruption by bugs in Application Code.

3. The Service Fabric Cluster Admins can trigger Ad-hoc backup for application data as On - Demand basis.

The Ad-Hoc Backup can be triggered with two flavours

## Ad-Hoc Backup with Periodic Backup Storage

The partition of a Reliable Service or Reliable Actor can be requested for an Ad-Hoc Backup along with Periodic Backup. The Ad-Hoc Backup is created along with periodic backup in the same storage mentioned in Enabled Backup Policy for the partition. 

The following case is the continuation of sample as mentioned in [Enabling periodic backup for Reliable Stateful service and Reliable Actors](service-fabric-backuprestoreservice-quickstart-azurecluster.md#enabling-periodic-backup-for-reliable-stateful-service-and-reliable-actors), where the partition has a backup policy enabled and is taking backup at a desired frequency in an azure storage. 

The Ad-Hoc backup is triggered by  Backup API.

```powershell
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/Backup?api-version=6.4"

Invoke-WebRequest -Uri $url -Method Post -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
```

The Ad-Hoc Backup Progress can be tracked by GetBackupProgress API

## Ad-Hoc Backup with Storage

The Ad-Hoc backup can be requested for a partition of a Relible Service or Reliable Actor along with the Storage Account for storing backup. The storage details are provided as a part of the ad hoc backup request.

The Ad-Hoc backup with Storage is triggered by  Backup API.


```powershell
$StorageInfo = @{
    ConnectionString = 'DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net'
    ContainerName = 'backup-container'
    StorageKind = 'AzureBlobStore'
}

$AdHocBackupRequest = @{
    BackupStorage = $StorageInfo
}

$body = (ConvertTo-Json $AdHocBackupRequest)
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/Backup?api-version=6.4"

Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
$BackupPoints = (ConvertFrom-Json $response.Content)
$BackupPoints.Items
```

## Tracking Ad Hoc Backup Progress

A partition of a Reliable Service and Reliable Actor accepts only one ad hoc backup request at a time. Another request can be accepted only when the current ad hoc backup request has completed. Multiple ad hoc backup request can be triggered on different partitions at a same time.

```powershell
$url = "https://mysfcluster-backup.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/GetBackupProgress?api-version=6.4" 
 
$response = Invoke-WebRequest -Uri $url -Method Get -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3' 
$restoreResponse = (ConvertFrom-Json $response.Content) 
$restoreResponse
```


The ad hoc backup request following the following order

1. InProgress - The partition data has been initiated for a backup.
3. Success/ Failure/ Timeout - A requested ad hoc backup can be completed in any of the following state. Each state has the following significance and response details.
    * Success - The backup state as Success corresponds to the Partition state is backed up. The response will provide BackupEpoch and BackupLSN for the Partition along with the time in UTC.
        ```
        BackupState     Success        
        TimeStampUtc    2018-10-22T12:07:36Z 
        BackupEpoch     @{DataLossNumber=131846800323087021;  ConfigurationNumber=12884901888}           
        BackupLsn       24 

        ```
    * Failure - The backup state as Failure symbolizes the failure of the ad hoc backup request. The cause of the failure will be stated in request.
      
    * Timeout - The backup state has timedout symbolizing the default timeout of 10 minutes wasn’t enough to complete restore. unknown. Initiating a new backup request with greater timeout in Ad-Hoc Backup Request will be the correct way to backup partition.

        ```
        BackupState Timeout
        Code FABRIC_E_TIMEOUT
        Message The request of backup has timed out
        ```

## Next steps
- [Understanding periodic backup configuration](./service-fabric-backuprestoreservice-configure-periodic-backup.md)
- [Backup restore REST API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-index-backuprestore)

[0]: ./media/service-fabric-backuprestoreservice/PartitionBackedUpHealthEvent_Azure.png
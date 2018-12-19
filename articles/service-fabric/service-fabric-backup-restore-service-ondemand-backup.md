---
title: On-Demand Backup in Azure Service Fabric | Microsoft Docs
description: Use Service Fabric's backup and restore feature for backup of your application data on need basis.
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
# On-demand backup in Azure Service Fabric

The data of Reliable Stateful services and Reliable Actors can be backed up to address disaster or data loss scenarios.

Service Fabric is equipped with features for [periodic backup of data](service-fabric-backuprestoreservice-quickstart-azurecluster.md) and backup of data on need basis. On-demand backup is useful as it guards against _data loss_/_data corruption_ caused due to planned changes in the underlying service or its environment.

The on-demand backup features is helpful in capturing state of the services, before any manually triggered operation related to the service or service environment. Like changing the service binaries, that is, upgrading or downgrading of the service; as it will have the data guarded against data corruption by bugs in application's code.

## Triggering on-demand backup

The on-demand backup requires storage details for uploading backup files. The on-demand backup will happen in the storage specified in periodic backup policy or in the specified storage in on-demand backup request.

### On-demand backup to storage specified by periodic backup policy

The partition of a Reliable Stateful service or Reliable Actor can be requested for an extra on need basis backup to storage specified in periodic backup policy. 

The following case is the continuation of sample as mentioned in [Enabling periodic backup for Reliable Stateful service and Reliable Actors](service-fabric-backuprestoreservice-quickstart-azurecluster.md#enabling-periodic-backup-for-reliable-stateful-service-and-reliable-actors), where the partition has a backup policy enabled and is taking backup at a desired frequency in Azure Storage.

The on-demand backup for partition ID `974bd92a-b395-4631-8a7f-53bd4ae9cf22` can be triggered by  [BackupPartition] (https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-backuppartition) API. 

```powershell
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/Backup?api-version=6.4"

Invoke-WebRequest -Uri $url -Method Post -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
```

The [on-demand backup progress](service-fabric-backup-restore-service-ondemand-backup.md#tracking-on-demand-backup-progress) can be tracked by [GetBackupProgress](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-getpartitionbackupprogress) API.

### On-demand backup to specified storage

The on-demand backup can be requested for a partition of a Reliable Stateful service or Reliable Actor along with the storage information. The storage information should be provided as a part of the on-demand backup request.

The on-demand backup for partition ID `974bd92a-b395-4631-8a7f-53bd4ae9cf22` can be triggered by  [BackupPartition] (https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-backuppartition) API with Azure storage information as shown below.

```powershell
$StorageInfo = @{
    ConnectionString = 'DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net'
    ContainerName = 'backup-container'
    StorageKind = 'AzureBlobStore'
}

$OnDemandBackupRequest = @{
    BackupStorage = $StorageInfo
}

$body = (ConvertTo-Json $OnDemandBackupRequest)
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/Backup?api-version=6.4"

Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
```

The [on-demand backup progress](service-fabric-backup-restore-service-ondemand-backup.md#tracking-on-demand-backup-progress) can be tracked by [GetBackupProgress](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-getpartitionbackupprogress) API.


## Tracking on-demand backup progress

A partition of a Reliable Stateful service or Reliable Actor accepts only one on-demand backup request at a time. Another request can be accepted only when the current on-demand backup request has completed. 

Multiple on-demand backup requests can be triggered on different partitions at a same time.

```powershell
$url = "https://mysfcluster-backup.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/GetBackupProgress?api-version=6.4" 
 
$response = Invoke-WebRequest -Uri $url -Method Get -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3' 
$backupResponse = (ConvertFrom-Json $response.Content) 
$backupResponse
```

The on-demand backup request's progress may be one of the following states

* **Accepted** - The backup has been initiated on the partition and is in progress.
    ```
    BackupState             : Accepted
    TimeStampUtc            : 0001-01-01T00:00:00Z
    BackupId                : 00000000-0000-0000-0000-000000000000
    BackupLocation          : 
    EpochOfLastBackupRecord : 
    LsnOfLastBackupRecord   : 0
    FailureError            : 
    ```
    
* **Success/ Failure/ Timeout** - A requested on-demand backup can be completed in any of the following states. Each state has the following significance and response details.

    * **Success** - The backup state as _Success_ indicates that the partition state is backed up successfully. The response will provide __BackupEpoch__ and __BackupLSN__ for the partition along with the time in UTC.
        ```
        BackupState             : Success
        TimeStampUtc            : 2018-11-21T20:00:01Z
        BackupId                : 5d64b697-6acd-45a4-adbd-3d75e0078081
        BackupLocation          : SampleApp\MyStatefulService\974bd92a-b395-4631-8a7f-53bd4ae9cf22\2018-11-21 20.00.01.zip
        EpochOfLastBackupRecord : @{DataLossNumber=131873018908156893; ConfigurationNumber=8589934592}
        LsnOfLastBackupRecord   : 36
        FailureError            : 
        ```
        
    * **Failure** - The backup state as _Failure_ indicates the failure occurred during backup of the partition's state. The cause of the failure will be stated in response.
        ```
        BackupState             : Failure
        TimeStampUtc            : 0001-01-01T00:00:00Z
        BackupId                : 00000000-0000-0000-0000-000000000000
        BackupLocation          : 
        EpochOfLastBackupRecord : 
        LsnOfLastBackupRecord   : 0
        FailureError            : @{Code=FABRIC_E_BACKUPCOPIER_UNEXPECTED_ERROR; Message=An error occurred during this operation.  Please check the trace logs for more details.}
        ```
       
    * **Timeout** - The backup state as _Timeout_ indicates that the partition state backup couldn't be created in given time frame; default timeout value is 10 minutes. Initiating a new backup request with greater [BackupTimeout](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-backuppartition#backuptimeout) in on-demand backup request is recommended in this scenario.

        ```
        BackupState             : Timeout
        TimeStampUtc            : 0001-01-01T00:00:00Z
        BackupId                : 00000000-0000-0000-0000-000000000000
        BackupLocation          : 
        EpochOfLastBackupRecord : 
        LsnOfLastBackupRecord   : 0
        FailureError            : @{Code=FABRIC_E_TIMEOUT; Message=The request of backup has timed out.}
        ```

## Next steps
- [Understanding periodic backup configuration](./service-fabric-backuprestoreservice-configure-periodic-backup.md)
- [Backup restore REST API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-index-backuprestore)


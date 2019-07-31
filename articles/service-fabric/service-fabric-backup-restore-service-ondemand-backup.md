---
title: On-demand backup in Azure Service Fabric | Microsoft Docs
description: Use the backup and restore feature in Service Fabric to back up your application data on a need basis.
services: service-fabric
documentationcenter: .net
author: aagup
manager: chackdan
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

You can back up data of Reliable Stateful services and Reliable Actors to address disaster or data loss scenarios.

Azure Service Fabric has features for the [periodic backup of data](service-fabric-backuprestoreservice-quickstart-azurecluster.md) and the backup of data on a need basis. On-demand backup is useful because it guards against _data loss_/_data corruption_ because of planned changes in the underlying service or its environment.

The on-demand backup features are helpful for capturing the state of the services before you manually trigger a service or service environment operation. For example, if you make a change in service binaries when  upgrading or downgrading the service. In such a case, on-demand backup can help guard the data against corruption by application code bugs.
## Prerequisites

- Install Microsoft.ServiceFabric.Powershell.Http Module [In Preview] for making configuration calls.

```powershell
    Install-Module -Name Microsoft.ServiceFabric.Powershell.Http -AllowPrerelease
```

- Make sure that Cluster is connected using the `Connect-SFCluster` command before making any configuration request using Microsoft.ServiceFabric.Powershell.Http Module.

```powershell

    Connect-SFCluster -ConnectionEndpoint 'https://mysfcluster.southcentralus.cloudapp.azure.com:19080'   -X509Credential -FindType FindByThumbprint -FindValue '1b7ebe2174649c45474a4819dafae956712c31d3' -StoreLocation 'CurrentUser' -StoreName 'My' -ServerCertThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'  

```


## Triggering on-demand backup

On-demand backup requires storage details for uploading backup files. You specify the on-demand backup location, either in the periodic backup policy or in an on-demand backup request.

### On-demand backup to storage specified by a periodic backup policy

You can configure the periodic backup policy to use a partition of a Reliable Stateful service or Reliable Actor for extra on-demand backup to storage.

The following case is the continuation of the scenario in [Enabling periodic backup for Reliable Stateful service and Reliable Actors](service-fabric-backuprestoreservice-quickstart-azurecluster.md#enabling-periodic-backup-for-reliable-stateful-service-and-reliable-actors). In this case, you enable a backup policy to use a partition and a backup occurs at a set frequency in Azure Storage.

#### Powershell using Microsoft.ServiceFabric.Powershell.Http Module

```powershell

Backup-SFPartition -PartitionId '974bd92a-b395-4631-8a7f-53bd4ae9cf22' 

```

#### Rest Call using Powershell

Use the [BackupPartition](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-backuppartition) API to set up triggering for the on-demand backup for partition ID `974bd92a-b395-4631-8a7f-53bd4ae9cf22`.

```powershell
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/Backup?api-version=6.4"

Invoke-WebRequest -Uri $url -Method Post -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
```

Use the [GetBackupProgress](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-getpartitionbackupprogress) API to enable tracking for the [on-demand backup progress](service-fabric-backup-restore-service-ondemand-backup.md#tracking-on-demand-backup-progress).

### On-demand backup to specified storage

You can request on-demand backup for a partition of a Reliable Stateful service or Reliable Actor. Provide the storage information as a part of the on-demand backup request.


#### Powershell using Microsoft.ServiceFabric.Powershell.Http Module

```powershell

Backup-SFPartition -PartitionId '974bd92a-b395-4631-8a7f-53bd4ae9cf22' -AzureBlobStore -ConnectionString  'DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net' -ContainerName 'backup-container'

```

#### Rest Call using Powershell

Use the [BackupPartition](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-backuppartition) API to set up triggering for the on-demand backup for partition ID `974bd92a-b395-4631-8a7f-53bd4ae9cf22`. Include the following Azure Storage information:

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

You can use the [GetBackupProgress](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-getpartitionbackupprogress) API to set up tracking for the [on-demand backup progress](service-fabric-backup-restore-service-ondemand-backup.md#tracking-on-demand-backup-progress).

## Tracking on-demand backup progress

A partition of a Reliable Stateful service or Reliable Actor accepts only one on-demand backup request at a time. Another request can be accepted only after the current on-demand backup request has completed.

Different partitions can trigger on-demand backup requests at a same time.


#### Powershell using Microsoft.ServiceFabric.Powershell.Http Module

```powershell

Get-SFPartitionBackupProgress -PartitionId '974bd92a-b395-4631-8a7f-53bd4ae9cf22'

```
#### Rest Call using Powershell

```powershell
$url = "https://mysfcluster-backup.southcentralus.cloudapp.azure.com:19080/Partitions/974bd92a-b395-4631-8a7f-53bd4ae9cf22/$/GetBackupProgress?api-version=6.4"

$response = Invoke-WebRequest -Uri $url -Method Get -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3' 
$backupResponse = (ConvertFrom-Json $response.Content) 
$backupResponse
```

On-demand backup requests can be in the following states:

- **Accepted**: The backup has started on the partition and is in progress.
  ```
  BackupState             : Accepted
  TimeStampUtc            : 0001-01-01T00:00:00Z
  BackupId                : 00000000-0000-0000-0000-000000000000
  BackupLocation          :
  EpochOfLastBackupRecord :
  LsnOfLastBackupRecord   : 0
  FailureError            :
  ```
- **Success**, **Failure**, or **Timeout**: A requested on-demand backup can be completed in any of the following states:
  - **Success**: A _Success_ backup state indicates that the partition state has  backed up successfully. The response provides _BackupEpoch_ and _BackupLSN_ for the partition along with the time in UTC.
    ```
    BackupState             : Success
    TimeStampUtc            : 2018-11-21T20:00:01Z
    BackupId                : 5d64b697-6acd-45a4-adbd-3d75e0078081
    BackupLocation          : SampleApp\MyStatefulService\974bd92a-b395-4631-8a7f-53bd4ae9cf22\2018-11-21 20.00.01.zip
    EpochOfLastBackupRecord : @{DataLossNumber=131873018908156893; ConfigurationNumber=8589934592}
    LsnOfLastBackupRecord   : 36
    FailureError            :
    ```
  - **Failure**: A _Failure_ backup state indicates that a failure occurred during backup of the partition's state. The cause of the failure is stated in response.
    ```
    BackupState             : Failure
    TimeStampUtc            : 0001-01-01T00:00:00Z
    BackupId                : 00000000-0000-0000-0000-000000000000
    BackupLocation          :
    EpochOfLastBackupRecord :
    LsnOfLastBackupRecord   : 0
    FailureError            : @{Code=FABRIC_E_BACKUPCOPIER_UNEXPECTED_ERROR; Message=An error occurred during this operation.  Please check the trace logs for more details.}
    ```
  - **Timeout**: A _Timeout_ backup state indicates that the partition state backup couldn't be created in a given amount of time. The default timeout value is 10 minutes. Initiate a new on-demand backup request with greater [BackupTimeout](https://docs.microsoft.com/rest/api/servicefabric/sfclient-api-backuppartition#backuptimeout) in this scenario.
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

- [Understand periodic backup configuration](./service-fabric-backuprestoreservice-configure-periodic-backup.md)
- [BackupRestore REST API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-index-backuprestore)

---

title: Periodic backup and restore in Azure Service Fabric  | Microsoft Docs
description: Use Service Fabric's periodic backup and restore feature for enabling periodic data backup of your application data.
services: service-fabric
documentationcenter: .net
author: hrushib
manager: chackdan
editor: hrushib

ms.assetid: FAA58600-897E-4CEE-9D1C-93FACF98AD1C
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 5/24/2019
ms.author: hrushib

---
# Periodic backup and restore in Azure Service Fabric 
> [!div class="op_single_selector"]
> * [Clusters on Azure](service-fabric-backuprestoreservice-quickstart-azurecluster.md) 
> * [Standalone Clusters](service-fabric-backuprestoreservice-quickstart-standalonecluster.md)
> 

Service Fabric is a distributed systems platform that makes it easy to develop and manage reliable, distributed, microservices based cloud applications. It allows running of both stateless and stateful micro services. Stateful services can maintain mutable, authoritative state beyond the request and response or a complete transaction. If a Stateful service goes down for a long time or loses information due to a disaster, it may need to be restored to some recent backup of its state in order to continue providing service after it comes back up.

Service Fabric replicates the state across multiple nodes to ensure that the service is highly available. Even if one node in the cluster fails, the service continues to be available. In certain cases, however, it is still desirable for the service data to be reliable against broader failures.
 
For example, service may want to back up its data in order to protect from the following scenarios:
- In the event of the permanent loss of an entire Service Fabric cluster.
- Permanent loss of a majority of the replicas of a service partition
- Administrative errors whereby the state accidentally gets deleted or corrupted. For example, an administrator with sufficient privilege erroneously deletes the service.
- Bugs in the service that cause data corruption. For example, this may happen when a service code upgrade starts writing faulty data to a Reliable Collection. In such a case, both the code and the data may have to be reverted to an earlier state.
- Offline data processing. It might be convenient to have offline processing of data for business intelligence that happens separately from the service that generates the data.

Service Fabric provides an inbuilt API to do point in time [backup and restore](service-fabric-reliable-services-backup-restore.md). Application developers may use these APIs to back up the state of the service periodically. Additionally, if service administrators want to trigger a backup from outside of the service at a specific time, like before upgrading the application, developers need to expose backup (and restore) as an API from the service. Maintaining the backups is an additional cost above this. For example, you may want to take five incremental backups every half hour, followed by a full backup. After the full backup, you can delete the prior incremental backups. This approach requires additional code leading to additional cost during application development.

The Backup and Restore service in Service Fabric enables easy and automatic backup of information stored in stateful services. Backing up application data on a periodic basis is fundamental for guarding against data loss and service unavailability. Service Fabric provides an optional backup and restore service, which allows you to configure periodic backup of stateful Reliable Services (including Actor Services) without having to write any additional code. It also facilitates restoring previously taken backups. 


Service Fabric provides a set of APIs to achieve the following functionality related to periodic backup and restore feature:

- Schedule periodic backup of Reliable Stateful services and Reliable Actors with support to upload backup to (external) storage locations. Supported storage locations
    - Azure Storage
    - File Share (on-premises)
- Enumerate backups
- Trigger an ad hoc backup of a partition
- Restore a partition using previous backup
- Temporarily suspend backups
- Retention management of backups (upcoming)

## Prerequisites
* Service Fabric cluster with Fabric version 6.4 or above. Refer to this [article](service-fabric-cluster-creation-via-arm.md) for steps to create Service Fabric cluster using Azure resource template.
* X.509 Certificate for encryption of secrets needed to connect to storage to store backups. Refer [article](service-fabric-cluster-creation-via-arm.md) to know how to get or create an X.509 certificate.
* Service Fabric Reliable Stateful application built using Service Fabric SDK version 3.0 or above. For applications targeting .NET Core 2.0, application should be built using Service Fabric SDK version 3.1 or above.
* Create Azure Storage account for storing application backups.
* Install Microsoft.ServiceFabric.Powershell.Http Module [In Preview] for making configuration calls.

```powershell
    Install-Module -Name Microsoft.ServiceFabric.Powershell.Http -AllowPrerelease
```

* Make sure that Cluster is connected using the `Connect-SFCluster` command before making any configuration request using Microsoft.ServiceFabric.Powershell.Http Module.

```powershell

    Connect-SFCluster -ConnectionEndpoint 'https://mysfcluster.southcentralus.cloudapp.azure.com:19080'   -X509Credential -FindType FindByThumbprint -FindValue '1b7ebe2174649c45474a4819dafae956712c31d3' -StoreLocation 'CurrentUser' -StoreName 'My' -ServerCertThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'  

```

## Enabling backup and restore service

### Using Azure portal

Enable `Include backup restore service` check box under `+ Show optional settings` in `Cluster Configuration` tab.

![Enable Backup Restore Service With Portal][1]


### Using Azure Resource Manager Template
First you need to enable the _backup and restore service_ in your cluster. Get the template for the cluster that you want to deploy. You can either use the [sample templates](https://github.com/Azure/azure-quickstart-templates/tree/master/service-fabric-secure-cluster-5-node-1-nodetype) or create a Resource Manager template. Enable the _backup and restore service_ with the following steps:

1. Check that the `apiversion` is set to **`2018-02-01`** for the `Microsoft.ServiceFabric/clusters` resource, and if not, update it as shown in the following snippet:

    ```json
    {
        "apiVersion": "2018-02-01",
        "type": "Microsoft.ServiceFabric/clusters",
        "name": "[parameters('clusterName')]",
        "location": "[parameters('clusterLocation')]",
        ...
    }
    ```

2. Now enable the _backup and restore service_ by adding the following `addonFeatures` section under `properties` section as shown in the following snippet: 

    ```json
        "properties": {
            ...
            "addonFeatures":  ["BackupRestoreService"],
            "fabricSettings": [ ... ]
            ...
        }

    ```
3. Configure X.509 certificate for encryption of credentials. This is important to ensure that the credentials provided to connect to storage are encrypted before persisting. Configure encryption certificate by adding the following `BackupRestoreService` section under `fabricSettings` section as shown in the following snippet: 

    ```json
    "properties": {
        ...
        "addonFeatures": ["BackupRestoreService"],
        "fabricSettings": [{
            "name": "BackupRestoreService",
            "parameters":  [{
                "name": "SecretEncryptionCertThumbprint",
                "value": "[Thumbprint]"
            }]
        }
        ...
    }
    ```

4. Once you have updated your cluster template with the preceding changes, apply them and let the deployment/upgrade complete. Once complete, the _backup and restore service_ starts running in your cluster. The Uri of this service is `fabric:/System/BackupRestoreService` and the service can be located under system service section in the Service Fabric explorer. 

## Enabling periodic backup for Reliable Stateful service and Reliable Actors
Let's walk through steps to enable periodic backup for Reliable Stateful service and Reliable Actors. These steps assume
- That the cluster is setup using X.509 security with _backup and restore service_.
- A Reliable Stateful service is deployed on the cluster. For the purpose of this quickstart guide, application Uri is `fabric:/SampleApp` and the Uri for Reliable Stateful service belonging to this application is `fabric:/SampleApp/MyStatefulService`. This service is deployed with single partition, and the partition ID is `974bd92a-b395-4631-8a7f-53bd4ae9cf22`.
- The client certificate with administrator role is installed in _My_ (_Personal_) store name of _CurrentUser_ certificate store location on the machine from where below scripts will be invoked. This example uses `1b7ebe2174649c45474a4819dafae956712c31d3` as thumbprint of this certificate. For more information on client certificates, see [Role-based access control for Service Fabric clients](service-fabric-cluster-security-roles.md).

### Create backup policy

First step is to create backup policy describing backup schedule, target storage for backup data, policy name, maximum incremental backups to be allowed before triggering full backup and retention policy for backup storage. 

For backup storage, use the Azure Storage account created above. Container `backup-container` is configured to store backups. A container with this name is created, if it does not already exist, during backup upload. Populate `ConnectionString` with a valid connection string for the Azure Storage account, replacing `account-name` with your storage account name, and `account-key` with your storage account key.

#### PowerShell using Microsoft.ServiceFabric.Powershell.Http Module

Execute following PowerShell cmdlets for creating new backup policy. Replace `account-name` with your storage account name, and `account-key` with your storage account key.

```powershell

New-SFBackupPolicy -Name 'BackupPolicy1' -AutoRestoreOnDataLoss $true -MaxIncrementalBackups 20 -FrequencyBased -Interval 00:15:00 -AzureBlobStore -ConnectionString 'DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net' -ContainerName 'backup-container' -Basic -RetentionDuration '10.00:00:00'

```

#### Rest Call using PowerShell

Execute following PowerShell script for invoking required REST API to create new policy. Replace `account-name` with your storage account name, and `account-key` with your storage account key.

```powershell
$StorageInfo = @{
    ConnectionString = 'DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net'
    ContainerName = 'backup-container'
    StorageKind = 'AzureBlobStore'
}

$ScheduleInfo = @{
    Interval = 'PT15M'
    ScheduleKind = 'FrequencyBased'
}

$RetentionPolicy = @{ 
    RetentionPolicyType = 'Basic'
    RetentionDuration =  'P10D'
}

$BackupPolicy = @{
    Name = 'BackupPolicy1'
    MaxIncrementalBackups = 20
    Schedule = $ScheduleInfo
    Storage = $StorageInfo
    RetentionPolicy = $RetentionPolicy
}

$body = (ConvertTo-Json $BackupPolicy)
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/BackupRestore/BackupPolicies/$/Create?api-version=6.4"

Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'

```

### Enable periodic backup
After defining backup policy to fulfill data protection requirements of the application, the backup policy should be associated with the application. Depending on requirement, the backup policy can be associated with an application, service, or a partition.

#### PowerShell using Microsoft.ServiceFabric.Powershell.Http Module

```powershell

Enable-SFApplicationBackup -ApplicationId 'SampleApp' -BackupPolicyName 'BackupPolicy1'

```
#### Rest Call using PowerShell

Execute following PowerShell script for invoking required REST API to associate backup policy with name `BackupPolicy1` created in above step with application `SampleApp`.

```powershell
$BackupPolicyReference = @{
    BackupPolicyName = 'BackupPolicy1'
}

$body = (ConvertTo-Json $BackupPolicyReference)
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Applications/SampleApp/$/EnableBackup?api-version=6.4"

Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
``` 

### Verify that periodic backups are working

After enabling backup at the application level, all partitions belonging to Reliable Stateful services and Reliable Actors under the application will start getting backed-up periodically as per the associated backup policy. 

![Partition BackedUp Health Event][0]

### List Backups

Backups associated with all partitions belonging to Reliable Stateful services and Reliable Actors of the application can be enumerated using _GetBackups_ API. Backups can be enumerated for an application, service, or a partition.

#### PowerShell using Microsoft.ServiceFabric.Powershell.Http Module

```powershell
    
Get-SFApplicationBackupList -ApplicationId WordCount
```

#### Rest Call using PowerShell

Execute following PowerShell script to invoke the HTTP API to enumerate the backups created for all partitions inside the `SampleApp` application.

```powershell
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Applications/SampleApp/$/GetBackups?api-version=6.4"

$response = Invoke-WebRequest -Uri $url -Method Get -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'

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

## Limitation/ caveats
- Service Fabric PowerShell cmdlets are in preview mode.
- No support for Service Fabric clusters on Linux.

## Next steps
- [Understanding periodic backup configuration](./service-fabric-backuprestoreservice-configure-periodic-backup.md)
- [Backup restore REST API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-index-backuprestore)

[0]: ./media/service-fabric-backuprestoreservice/PartitionBackedUpHealthEvent_Azure.png
[1]: ./media/service-fabric-backuprestoreservice/enable-backup-restore-service-with-portal.png


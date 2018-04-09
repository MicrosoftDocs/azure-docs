---
title: Periodic backup and restore in Azure Service Fabric | Microsoft Docs
description: Use Service Fabric's periodic backup and restore feature for protecting your applications from data loss.
services: service-fabric
documentationcenter: .net
author: hrushib
manager: timlt
editor: hrushib

ms.assetid: FAA58600-897E-4CEE-9D1C-93FACF98AD1C
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/04/2018
ms.author: hrushib

---
# Periodic backup and restore in Azure Service Fabric
> [!div class="op_single_selector"]
> * [Cluster in Azure](service-fabric-backuprestoreservice-quickstart-azurecluster.md) 
> * [Standalone Cluster](service-fabric-backuprestoreservice-quickstart-standalonecluster.md)
> 

Service Fabric is a distributed systems platform that makes it easy to develop and manage reliable, distributed, micro-services based cloud applications. It allows running of both stateless and stateful micro services. Stateful micro-services maintain a mutable, authoritative state beyond the request and response or a complete transaction. If this service went down for some time, it would need to be initialized with the state at the time of it going down, for it to provide meaningful and expected service after it comes up. 

Service Fabric replicates the state across multiple nodes to ensure that the service is highly available. Even if one node in the cluster fails, the service continues to be available. In certain cases, however, it is still desirable for the service data to be reliable against broader failures.
 
For example, service may want to backup its data in order to protect from the following scenarios:
- In the event of the permanent loss of an entire Service Fabric cluster.
- Permanent loss of a majority of the replicas of a service partition
- Administrative errors whereby the state accidentally gets deleted or corrupted. For example, an administrator with sufficient privilege erroneously deletes the service.
- Bugs in the service that cause data corruption. For example, this may happen when a service code upgrade starts writing faulty data to a Reliable Collection. In such a case, both the code and the data may have to be reverted to an earlier state.
- Offline data processing. It might be convenient to have offline processing of data for business intelligence that happens separately from the service that generates the data.

Service Fabric provides an inbuilt API to do point in time [backup and restore](service-fabric-reliable-services-backup-restore.md). Application developers may use these APIs to back up the state of the service. Additionally, if they want to trigger it from outside of the application at a specific time, like before upgrading the application, they need to expose backup (and restore) as an API from their service.  This additional API is just to take backup and trigger restore. Maintaining the backup points is an additional cost above this. This approach needs additional code per service leading to additional cost for application development.

Backup of the application data on a periodic basis is a basic need for managing a distributed application and guarding against loss of data or prolonged loss of service availability. Service Fabric provides optional backup restore service, which allows you to configure periodic backup of Reliable Stateful service partitions and Reliable Actors without having to write any additional code. It also facilitates to restore previously taken backup to the service partition. 

> [!NOTE]
> Periodic backup and restore feature is presently in **Preview** and not supported for production workloads. 
>

Service Fabric provides set of APIs to achieve the following functionality related to periodic backup and restore feature:

- Schedule periodic backup of Reliable Stateful services and Reliable Actors with support to upload backup to (external) storage locations. Supported storage locations
    - Azure Storage
    - File Share (on-premise)
- Enumerate backups
- Trigger an ad-hoc backup of a partition
- Restore partition from a previous backup point
- Temporarily suspend backups
- Retention management of backups (upcoming)

## Prerequisites
* Service Fabric cluster with Fabric version 6.2 and above. The cluster should be setup on Windows Server. Refer [article](service-fabric-cluster-creation-via-arm.md) for steps to create Service Fabric cluster using Azure resource template.
* X.509 Certificate for encryption of secrets needed to connect to storage to store backup points. Refer [article](service-fabric-cluster-creation-via-arm.md) to know how to get or create an X.509 certificate.
* Sample Service Fabric Reliable Stateful application built using Service Fabric SDK version 3.0 or above. For applications targeting .Net Core 2.0, application should be built using Service Fabric SDK version 3.1 or above.
* Create Azure Storage account for storing application backups.

## Enabling the Periodic Backup and Restore feature
First you need to enable the _backup restore service_ in your cluster. Get the template for the cluster that you want to deploy. You can either use the [sample templates](https://github.com/Azure/azure-quickstart-templates/tree/master/service-fabric-secure-cluster-5-node-1-nodetype) or create a Resource Manager template. Enable the _backup restore service_ with the following steps:

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

2. Now enable the _backup restore service_ by adding the following `addonFeatures` section under `properties` section as shown in the following snippet: 

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

4. Once you have updated your cluster template with the preceding changes, apply them and let the deployment/upgrade complete. Once complete, the _backup restore service_ starts running in your cluster. The Uri of this service is `fabric:/System/BackupRestoreService` and the service can be located under system service section in the Service Fabric explorer. 

Alternatively, you can enable the Backup Restore service through the portal at the time of cluster creation. (upcoming)

## Enabling periodic backup for Reliable Stateful service and Reliable Actors
Let's walkthrough steps to enable periodic backup for Reliable Stateful service and Reliable Actors. These steps assume
- That the cluster is setup using X.509 security with _backup restore service_.
- A Reliable Stateful application is deployed on the cluster. For the purpose of this quickstart guide, application Uri is `fabric:/SampleApp` and the Uri for Reliable Stateful service belonging to this application is `fabric:/SampleApp/MyStatefulService`. This service is deployed with single partition, and the partition ID is `974bd92a-b395-4631-8a7f-53bd4ae9cf22`.
- The client certificate with administrator role is installed in _My_ (_Personal_) store name of _CurrentUser_ certificate store location on the machine from where below scripts will be invoked. This example uses `1b7ebe2174649c45474a4819dafae956712c31d3` as thumbprint of this certificate. For more information on client certificates, see [Role-based access control for Service Fabric clients](service-fabric-cluster-security-roles.md).

### Create backup policy

First step is to create backup policy describing backup schedule, target storage for backup data, policy name, and maximum incremental backups to be allowed before triggering full backup. 

For backup storage, use the Azure Storage account created above. This example assumes the Azure Storage account with name `sfbackupstore`. Container `backup-container` is configured to store backups, container with this name is created, if not already present, during backup upload. Populate `ConnectionString` with valid connection string for the Azure Storage account.

Execute following PowerShell script for invoking required REST API to create new policy.

```powershell
$StorageInfo = @{
     ConnectionString = 'DefaultEndpointsProtocol=https;AccountName=sfbackupstore;AccountKey=64S+3ykBgOuKhd2DK1qHJJtDml3NtRzgaZUa+8iwwBAH4EzuGt95JmOm7mp/HOe8V3l645iv5l8oBfnhhc7dJA==;EndpointSuffix=core.windows.net'
	 ContainerName = 'backup-container'
	 StorageKind = 'AzureBlobStore'
}

$ScheduleInfo = @{
     Interval = 'PT15M'
     ScheduleKind = 'FrequencyBased'
}

$BackupPolicy = @{
	 Name = 'BackupPolicy1'
	 MaxIncrementalBackups = 20
     Schedule = $ScheduleInfo
     Storage = $StorageInfo
}

$body = (ConvertTo-Json $BackupPolicy)
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/BackupRestore/BackupPolicies/$/Create?api-version=6.2-preview"

Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
```

### Enable periodic backup
After defining policy to fulfill data protection requirements of the application, the policy should be associated with the application. Depending on requirement, the policy can be associated with application, service, or a partition.

Execute following PowerShell script for invoking required REST API to associate backup policy with name `BackupPolicy1` created in above step with application `SampleApp`.

```powershell
$BackupPolicyReference = @{
	 BackupPolicyName = 'BackupPolicy1'
}

$body = (ConvertTo-Json $BackupPolicyReference)
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Applications/SampleApp/$/EnableBackup?api-version=6.2-preview"

Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json' -CertificateThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'
``` 

### Know if periodic backups are working

After enabling backup for the application, all partitions belonging to Reliable Stateful services and Reliable Actors under the application will start getting backed-up periodically as per the associated policy. 

![Partition BackedUp Health Event][0]

### List Backups

Backup points associated with all partitions belonging to Reliable Stateful services and Reliable Actors of the application can be enumerated using _GetBackups_ API. Depending on requirement, the backup points can be enumerated for application, service, or a partition.

Execute following PowerShell script for invoking required REST API to enumerate backup points created for partitions belonging to Reliable Stateful services and Reliable Actors of `SampleApp` application.

```powershell
$url = "https://mysfcluster.southcentralus.cloudapp.azure.com:19080/Applications/SampleApp/$/GetBackups?api-version=6.2-preview"

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

## Preview Limitation/ Caveats
- No Service Fabric inbuilt PowerShell cmdlets.
- No support for Service Fabric CLI.
- No support for automated backup point purging. Requires manual clean-up of backup points.
- No support for Service Fabric clusters on Linux.

## Next Steps
- [Backup restore REST API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-index-backuprestore)

[0]: ./media/service-fabric-backuprestoreservice/PartitionBackedUpHealthEvent_Azure.png


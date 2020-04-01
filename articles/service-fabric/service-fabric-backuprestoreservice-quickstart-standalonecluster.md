---
title: Periodic backup/restore in standalone Azure Service Fabric
description: Use Service Fabric's periodic backup and restore feature for enabling periodic data backup of your application data.
author: hrushib

ms.topic: conceptual
ms.date: 5/24/2019
ms.author: hrushib
---
# Periodic backup and restore in a standalone Service Fabric
> [!div class="op_single_selector"]
> * [Clusters on Azure](service-fabric-backuprestoreservice-quickstart-azurecluster.md) 
> * [Standalone Clusters](service-fabric-backuprestoreservice-quickstart-standalonecluster.md)
> 

Service Fabric is a distributed systems platform that makes it easy to develop and manage reliable, distributed, microservices based cloud applications. It allows running of both stateless and stateful micro services. Stateful services can maintain mutable, authoritative state beyond the request and response or a complete transaction. If a Stateful service goes down for a long time or loses information due to a disaster, it may need to be restored to some recent backup of its state in order to continue providing service after it comes back up.

Service Fabric replicates the state across multiple nodes to ensure that the service is highly available. Even if one node in the cluster fails, the service continues to be available. In certain cases, however, it is still desirable for the service data to be reliable against broader failures.
 
For example, a service may want to back up its data in order to protect from the following scenarios:
- Permanent loss of an entire Service Fabric cluster.
- Permanent loss of a majority of the replicas of a service partition
- Administrative errors whereby the state accidentally gets deleted or corrupted. For example, an administrator with sufficient privilege erroneously deletes the service.
- Bugs in the service that cause data corruption. For example, this may happen when a service code upgrade starts writing faulty data to a Reliable Collection. In such a case, both the code and the data may have to be reverted to an earlier state.
- Offline data processing. It might be convenient to have offline processing of data for business intelligence that happens separately from the service that generates the data.

Service Fabric provides an inbuilt API to do point in time [backup and restore](service-fabric-reliable-services-backup-restore.md). Application developers may use these APIs to back up the state of the service periodically. Additionally, if service administrators want to trigger a backup from outside of the service at a specific time, like before upgrading the application, developers need to expose backup (and restore) as an API from the service. Maintaining the backups is an additional cost above this. For example, you may want to take five incremental backups every half hour, followed by a full backup. After the full backup, you can delete the prior incremental backups. This approach requires additional code leading to additional cost during application development.

Backup of the application data on a periodic basis is a basic need for managing a distributed application and guarding against loss of data or prolonged loss of service availability. Service Fabric provides an optional backup and restore service, which allows you to configure periodic backup of stateful Reliable Services (including Actor Services) without having to write any additional code. It also facilitates restoring previously taken backups. 

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
* Service Fabric cluster with Fabric version 6.4 or above. Refer to this [article](service-fabric-cluster-creation-for-windows-server.md) for steps to download required package.
* X.509 Certificate for encryption of secrets needed to connect to storage to store backups. Refer [article](service-fabric-windows-cluster-x509-security.md) to know how to acquire or to Create a self-signed X.509 certificate.

* Service Fabric Reliable Stateful application built using Service Fabric SDK version 3.0 or above. For applications targeting .Net Core 2.0, application should be built using Service Fabric SDK version 3.1 or above.
* Install Microsoft.ServiceFabric.Powershell.Http Module [In Preview] for making configuration calls.

```powershell
    Install-Module -Name Microsoft.ServiceFabric.Powershell.Http -AllowPrerelease
```

* Make sure that Cluster is connected using the `Connect-SFCluster` command before making any configuration request using Microsoft.ServiceFabric.Powershell.Http Module.

```powershell

    Connect-SFCluster -ConnectionEndpoint 'https://mysfcluster.southcentralus.cloudapp.azure.com:19080'   -X509Credential -FindType FindByThumbprint -FindValue '1b7ebe2174649c45474a4819dafae956712c31d3' -StoreLocation 'CurrentUser' -StoreName 'My' -ServerCertThumbprint '1b7ebe2174649c45474a4819dafae956712c31d3'  

```

## Enabling backup and restore service
First you need to enable the _backup and restore service_ in your cluster. Get the template for the cluster that you want to deploy. You can use the [sample templates](https://github.com/Azure-Samples/service-fabric-dotnet-standalone-cluster-configuration/tree/master/Samples). Enable the _backup and restore service_ with the following steps:

1. Check that the `apiversion` is set to `10-2017` in the cluster configuration file, and if not, update it as shown in the following snippet:

    ```json
    {
        "apiVersion": "10-2017",
        "name": "SampleCluster",
        "clusterConfigurationVersion": "1.0.0",
        ...
    }
    ```

2. Now enable the _backup and restore service_ by adding the following `addonFeatures` section under `properties` section as shown in the following snippet: 

    ```json
        "properties": {
            ...
            "addonFeatures": ["BackupRestoreService"],
            "fabricSettings": [ ... ]
            ...
        }

    ```

3. Configure X.509 certificate for encryption of credentials. This is important to ensure that the credentials provided, if any, to connect to storage are encrypted before persisting. Configure encryption certificate by adding the following `BackupRestoreService` section under `fabricSettings` section as shown in the following snippet: 

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

4. Once you have updated your cluster configuration file with the preceding changes, apply them and let the deployment/upgrade complete. Once complete, the _backup and restore service_ starts running in your cluster. The Uri of this service is `fabric:/System/BackupRestoreService` and the service can be located under system service section in the Service Fabric explorer. 



## Enabling periodic backup for Reliable Stateful service and Reliable Actors
Let's walk through steps to enable periodic backup for Reliable Stateful service and Reliable Actors. These steps assume
- That the cluster is set up with _backup and restore service_.
- A Reliable Stateful service is deployed on the cluster. For the purpose of this quickstart guide, application Uri is `fabric:/SampleApp` and the Uri for Reliable Stateful service belonging to this application is `fabric:/SampleApp/MyStatefulService`. This service is deployed with single partition, and the partition ID is `23aebc1e-e9ea-4e16-9d5c-e91a614fefa7`.  

### Create backup policy

First step is to create backup policy describing backup schedule, target storage for backup data, policy name, maximum incremental backups to be allowed before triggering full backup and retention policy for backup storage. 

For backup storage, create file share and give ReadWrite access to this file share for all Service Fabric Node machines. This example assumes the share with name `BackupStore` is present on `StorageServer`.


#### Powershell using Microsoft.ServiceFabric.Powershell.Http Module

```powershell

New-SFBackupPolicy -Name 'BackupPolicy1' -AutoRestoreOnDataLoss $true -MaxIncrementalBackups 20 -FrequencyBased -Interval 00:15:00 -FileShare -Path '\\StorageServer\BackupStore' -Basic -RetentionDuration '10.00:00:00'

```
#### Rest Call using Powershell

Execute following PowerShell script for invoking required REST API to create new policy.

```powershell
$ScheduleInfo = @{
    Interval = 'PT15M'
    ScheduleKind = 'FrequencyBased'
}   

$StorageInfo = @{
    Path = '\\StorageServer\BackupStore'
    StorageKind = 'FileShare'
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
$url = "http://localhost:19080/BackupRestore/BackupPolicies/$/Create?api-version=6.4"

Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json'
```

#### Using Service Fabric Explorer

1. In Service Fabric Explorer, navigate to the Backups tab and select Actions > Create Backup Policy.

    ![Create Backup Policy][6]

2. Fill out the information. For standalone clusters, FileShare should be selected.

    ![Create Backup Policy FileShare][7]

### Enable periodic backup
After defining policy to fulfill data protection requirements of the application, the backup policy should be associated with the application. Depending on requirement, the backup policy can be associated with an application, service, or a partition.


#### Powershell using Microsoft.ServiceFabric.Powershell.Http Module

```powershell
Enable-SFApplicationBackup -ApplicationId 'SampleApp' -BackupPolicyName 'BackupPolicy1'
```

#### Rest Call using Powershell
Execute following PowerShell script for invoking required REST API to associate backup policy with name `BackupPolicy1` created in above step with application `SampleApp`.

```powershell
$BackupPolicyReference = @{
    BackupPolicyName = 'BackupPolicy1'
}

$body = (ConvertTo-Json $BackupPolicyReference)
$url = "http://localhost:19080/Applications/SampleApp/$/EnableBackup?api-version=6.4"

Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType 'application/json'
``` 

#### Using Service Fabric Explorer

1. Select an application and go to action. Click Enable/Update Application Backup.

    ![Enable Application Backup][3] 

2. Finally, select the desired policy and click Enable Backup.

    ![Select Policy][4]

### Verify that periodic backups are working

After enabling backup for the application, all partitions belonging to Reliable Stateful services and Reliable Actors under the application will start getting backed-up periodically as per the associated backup policy.

![Partition BackedUp Health Event][0]

### List Backups

Backups associated with all partitions belonging to Reliable Stateful services and Reliable Actors of the application can be enumerated using _GetBackups_ API. Depending on requirement, the backups can be enumerated for application, service, or a partition.

#### Powershell using Microsoft.ServiceFabric.Powershell.Http Module

```powershell
    Get-SFApplicationBackupList -ApplicationId WordCount     
```

#### Rest Call using Powershell

Execute following PowerShell script to invoke the HTTP API to enumerate the backups created for all partitions inside the `SampleApp` application.

```powershell
$url = "http://localhost:19080/Applications/SampleApp/$/GetBackups?api-version=6.4"

$response = Invoke-WebRequest -Uri $url -Method Get

$BackupPoints = (ConvertFrom-Json $response.Content)
$BackupPoints.Items
```

Sample output for the above run:

```
BackupId                : d7e4038e-2c46-47c6-9549-10698766e714
BackupChainId           : d7e4038e-2c46-47c6-9549-10698766e714
ApplicationName         : fabric:/SampleApp
ServiceName             : fabric:/SampleApp/MyStatefulService
PartitionInformation    : @{LowKey=-9223372036854775808; HighKey=9223372036854775807; ServicePartitionKind=Int64Range; Id=23aebc1e-e9ea-4e16-9d5c-e91a614fefa7}
BackupLocation          : SampleApp\MyStatefulService\23aebc1e-e9ea-4e16-9d5c-e91a614fefa7\2018-04-01 19.39.40.zip
BackupType              : Full
EpochOfLastBackupRecord : @{DataLossNumber=131670844862460432; ConfigurationNumber=8589934592}
LsnOfLastBackupRecord   : 2058
CreationTimeUtc         : 2018-04-01T19:39:40Z
FailureError            : 

BackupId                : 8c21398a-2141-4133-b4d7-e1a35f0d7aac
BackupChainId           : d7e4038e-2c46-47c6-9549-10698766e714
ApplicationName         : fabric:/SampleApp
ServiceName             : fabric:/SampleApp/MyStatefulService
PartitionInformation    : @{LowKey=-9223372036854775808; HighKey=9223372036854775807; ServicePartitionKind=Int64Range; Id=23aebc1e-e9ea-4e16-9d5c-e91a614fefa7}
BackupLocation          : SampleApp\MyStatefulService\23aebc1e-e9ea-4e16-9d5c-e91a614fefa7\2018-04-01 19.54.38.zip
BackupType              : Incremental
EpochOfLastBackupRecord : @{DataLossNumber=131670844862460432; ConfigurationNumber=8589934592}
LsnOfLastBackupRecord   : 2237
CreationTimeUtc         : 2018-04-01T19:54:38Z
FailureError            : 

BackupId                : fc75bd4c-798c-4c9a-beee-e725321f73b2
BackupChainId           : d7e4038e-2c46-47c6-9549-10698766e714
ApplicationName         : fabric:/SampleApp
ServiceName             : fabric:/SampleApp/MyStatefulService
PartitionInformation    : @{LowKey=-9223372036854775808; HighKey=9223372036854775807; ServicePartitionKind=Int64Range; Id=23aebc1e-e9ea-4e16-9d5c-e91a614fefa7}
BackupLocation          : SampleApp\MyStatefulService\23aebc1e-e9ea-4e16-9d5c-e91a614fefa7\2018-04-01 20.09.44.zip
BackupType              : Incremental
EpochOfLastBackupRecord : @{DataLossNumber=131670844862460432; ConfigurationNumber=8589934592}
LsnOfLastBackupRecord   : 2437
CreationTimeUtc         : 2018-04-01T20:09:44Z
FailureError            : 
```

#### Using Service Fabric Explorer

To view backups in Service Fabric Explorer, navigate to a partition and select the Backups tab.

![Enumerate Backups][5]

## Limitation/ caveats
- Service Fabric PowerShell cmdlets are in preview mode.
- No support for Service Fabric clusters on Linux.

## Next steps
- [Understanding periodic backup configuration](./service-fabric-backuprestoreservice-configure-periodic-backup.md)
- [Backup restore REST API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-index-backuprestore)

[0]: ./media/service-fabric-backuprestoreservice/partition-backedup-health-event.png
[3]: ./media/service-fabric-backuprestoreservice/enable-app-backup.png
[4]: ./media/service-fabric-backuprestoreservice/enable-application-backup.png
[5]: ./media/service-fabric-backuprestoreservice/backup-enumeration.png
[6]: ./media/service-fabric-backuprestoreservice/create-bp.png
[7]: ./media/service-fabric-backuprestoreservice/create-bp-fileshare.png
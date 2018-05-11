---
title: Configure periodic backup in Azure Service Fabric | Microsoft Docs
description: Use Service Fabric's periodic backup and restore feature for protecting your applications from Data Loss.
services: service-fabric
documentationcenter: .net
author: hrushib
manager: timlt
editor: hrushib

ms.assetid: FAA45B4A-0258-4CB3-A825-7E8F70F28401
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/01/2018
ms.author: hrushib

---
# Configure periodic backup in Azure Service Fabric

Configuring periodic backup consists of following steps:

1. Creation of backup policy: In this step, backup policy is created by specifying backup schedule, backup storage, maximum number of consecutive incremental backups, and whether to do auto restore. You can create multiple policies depending on your requirements.

2. Enabling Data Protection: In this step, you associate a backup policy created in **Step 1** to the required entity, _Application_, _Service_, or a _Partition_.
	
## Create Backup Policy

A backup policy defines the following details:

* Auto restore on data loss: Specifies whether to trigger restore automatically using the latest available backup in case the partition experiences a data loss event.

* Max incremental backups: Defines the maximum number of incremental backups to be taken between two full backups. Max incremental backups specify the upper limit. A full backup may be taken before specified number of incremental backups are completed in one of the following conditions

    1. The replica has never taken a full backup since it has become primary.

    2. Some of the log records since the last backup has been truncated.

    3. Replica passed the MaxAccumulatedBackupLogSizeInMB limit.

* Backup schedule: The time or frequency at which to take periodic backups. One can schedule backups to be recurring at specified interval Or at a fixed time daily/ weekly.

    1. Frequency-based backup schedule: This schedule type should be used if the need is to take data backup at fixed intervals. Desired time interval between two consecutive backups is defined using ISO8601 format. At present supported interval resolution is Minutes, portion defining seconds and part of seconds will be ignored.
        ```json
        {
            "ScheduleKind": "FrequencyBased",
            "Interval": "PT10M"
        }
        ```

    2. Time-based backup schedule: This schedule type should be used if the need is to take data backup at specific times of the day.
        ```json
        {
            "ScheduleKind": "TimeBased",
            "ScheduleFrequencyType": "Daily",
            "RunTimes": [
              "0001-01-01T09:00:00Z",
              "0001-01-01T17:00:00Z"
            ]
        }
        ```

* Backup storage: Specifies the location to upload backups. Storage can be either Azure blob store or file share.
    1. Azure blob store: This storage type should be selected when the need is to store generated backups in Azure. Both _standalone_ and _Azure based_ clusters can use this storage type. Description for this storage type requires connection string and name of the container where backups need to be uploaded. If the container with the specified name is not available, then it will be created during upload of a backup.
       ```json
        {
            "StorageKind": "AzureBlobStore",
            "FriendlyName": "Azure_storagesample",
            "ConnectionString": "<Put your Azure blob store connection string here>",
            "ContainerName": "BackupContainer"
        }
        ```

    2. File share: This storage type should be selected in case of _standalone_ clusters and when the need is to store data backup on-premise. Description for this storage type requires file share path where backups need to be uploaded. Access to the file share can be configured using one of the following options
        1. Integrated Window Authentication; where the access to file share is provided to all computers belonging to the Service Fabric cluster. In this case, set following fields to configure _file share_ based backup storage.
        ```json
        {
            "StorageKind": "FileShare",
            "FriendlyName": "Sample_FileShare",
            "Path": "\\\\StorageServer\\BackupStore"
        }
        ```
        2. Protecting file share using user name and password; where the access to file share is provided to specific user(s). File share storage specification also provides capability to specify secondary user name and secondary password to provide fall-back credentials in case authentication fails with primary user name and primary password. In this case, set following fields to configure _file share_ based backup storage.
        ```json
        {
            "StorageKind": "FileShare",
            "FriendlyName": "Sample_FileShare",
            "Path": "\\\\StorageServer\\BackupStore",
            "PrimaryUserName": "backupaccount",
            "PrimaryPassword": "<Password for backupaccount>",
            "SecondaryUserName": "backupaccount2",
            "SecondaryPassword": "<Password for backupaccount2>"
        }
        ```

> [!NOTE]
> Ensure that the storage reliability meets or exceeds reliability requirements of backup data.
>

## Enable periodic backup
After defining backup policy to fulfill data protection requirements, the backup policy should be associated appropriately either with an _application_, or _service_, or a _partition_.

### Hierarchical propagation of backup policy
In Service Fabric, relation between application, service, and partitions is hierarchical as explained in [Application model](./service-fabric-application-model.md). Backup policy can be associated either with an _application_, _service, or a _partition_ in this hierarchy. Backup policy propagates hierarchically to next level. Assuming there is only one backup policy created and associated with an _application_, all partitions belonging to all _services_ of the _application_ will be backed-up using the backup policy; or if the backup policy is associated with a _service_ all its partitions will be backed-up using the backup policy.

### Overriding backup policy
There may be a scenario where data backup with same backup schedule is required for all services of the application except for specific service(s) where the need is to have data backup using higher frequency schedule. To address such scenarios, backup restore service provides facility to override propagated policy at service and partition level. When the periodic backup is enabled at _service_ or _partition_ it overrides propagated backup policy, if any.

### Example

This example uses setup with two applications, _MyApp_A_ and _MyApp_B_. Application _MyApp_A_ contains two Reliable Stateful services, _SvcA1_ & _SvcA3_, and one Reliable Actor service, _ActorA2_. _SvcA1_ contains three partitions while _SvcA2_ and _SvcA3_ contain two partitions each.  Application _MyApp_B_ contains three Reliable Stateful services, _SvcB1_, _SvcB2_ & _SvcB3_. _SvcB1_ & _SvcB2_ contains two partitions each while _SvcB3_ contains three partitions.

Assume that these applications' data backup requirements are as stated below

1. MyApp_A
    1. Create daily backup of data for all partitions of all _Reliable Stateful services_ and _Reliable Actors_ belonging to the application. Upload backup data to location _BackupStore1_.

    2. One of the services, _SvcA3_, requires data backup every hour.

    3. Data size in partition _SvcA1_P2_ is more than expected and its backup data should be stored to different storage location _BackupStore2_.

2. MyApp_B
    1. Create backup of data every Sunday at 8:00 AM for all partitions of _SvcB1_ service. Upload backup data to location _BackupStore1_.

    2. Create backup of data every day at 8:00 AM for partition _SvcB2_P1_. Upload backup data to location _BackupStore1_.

To address the above data backup requirements, backup policies BP_1 to BP_5 are created and backup is enabled as stated below.
1. MyApp_A
    1. Create backup policy, _BP_1_, with frequency-based backup schedule where frequency is set to 24 Hrs. and backup storage configured to use storage location _BackupStore1_. Enable this policy for Application _MyApp_A_ using [Enable Application Backup](https://docs.microsoft.com/en-in/rest/api/servicefabric/sfclient-api-enableapplicationbackup) API. This action enables data backup using backup policy _BP_1_ for all partitions of _Reliable Stateful services_ and _Reliable Actors_ belonging to application _MyApp_A_.

    2. Create backup policy, _BP_2_, with frequency-based backup schedule where frequency is set to 1 Hrs. and backup storage configured to use storage location _BackupStore1_. Enable this policy for service _SvcA3_ using [Enable Service Backup](https://docs.microsoft.com/en-in/rest/api/servicefabric/sfclient-api-enableservicebackup) API. This action overrides propagated policy _BP_1_ by explicitly enabled backup policy _BP_2_ for all partitions of service _SvcA3_ leading to data backup using backup policy _BP_2_ for these partitions.

    3. Create backup policy, _BP_3_, with frequency-based backup schedule where frequency is set to 24 Hrs. and backup storage configured to use storage location _BackupStore2_. Enable this policy for partition _SvcA1_P2_ using [Enable Partition Backup](https://docs.microsoft.com/en-in/rest/api/servicefabric/sfclient-api-enablepartitionbackup) API. This action overrides propagated policy _BP_1_ by explicitly enabled backup policy _BP_3_ for partition _SvcA1_P2_.

2. MyApp_B
    1. Create backup policy, _BP_4_, with time-based backup schedule where schedule frequency type is set to weekly, run days is set to Sunday, and run times is set to 8:00 AM. Backup storage configured to use storage location _BackupStore1_. Enable this policy for service _SvcB1_ using [Enable Service Backup](https://docs.microsoft.com/en-in/rest/api/servicefabric/sfclient-api-enableservicebackup) API. This action enables data backup using backup policy _BP_4_ for all partitions of service _SvcB1_.

    2. Create backup policy, _BP_5_, with time-based backup schedule where schedule frequency type is set to daily and run times is set to 8:00 AM. Backup storage configured to use storage location _BackupStore1_. Enable this policy for partition _SvcB2_P1_ using [Enable Partition Backup](https://docs.microsoft.com/en-in/rest/api/servicefabric/sfclient-api-enablepartitionbackup) API. This action enables data backup using backup policy _BP_5_ for partition _SvcB2_P1_.

Following diagram depicts explicitly enabled backup policies and propagated backup policies.

![Service Fabric Application Hierarchy][0]

## Disable protection
Backup policies can be disabled if needed. Backup policy enabled at an _Application_ can only be disabled at the same _Application_ using API [Disable Application Backup](https://docs.microsoft.com/en-in/rest/api/servicefabric/sfclient-api-disableapplicationbackup), Backup policy enabled at a _Service_ can be disabled at the same _Service_ using API [Disable Service Backup](https://docs.microsoft.com/en-in/rest/api/servicefabric/sfclient-api-disableservicebackup), and Backup policy enabled at a _Partition_ can be disabled at the same _Partition_ using API [Disable Partition Backup](https://docs.microsoft.com/en-in/rest/api/servicefabric/sfclient-api-disablepartitionbackup). 

* Disabling backup policy for an _application_ stops all periodic data backups happening as a result of propagation of this backup policy to Reliable Stateful service partitions or Reliable Actor partitions.

* Disabling backup policy for a _service_ stops all periodic data backups happening as a result of propagation of this backup policy to the partitions of the _service_.

* Disabling backup policy for a _partition_ stops all periodic data backup happening due to this backup policy at the partition.

## Suspend & resume protection
Certain situation may demand temporary suspension of periodic backup of data. In such situation, depending on the requirement suspend backup API may be used at an _Application_, _Service_, or _Partition_. Periodic backup suspension is transitive over subtree of the application's hierarchy from the point it is applied. 

* When suspension is applied at an _Application_ using [Suspend Application Backup](https://docs.microsoft.com/en-us/rest/api/servicefabric/sfclient-api-suspendapplicationbackup) API, then all the services and partitions under this application are suspended for periodic backup of data.

* When suspension is applied at a _Service_ using [Suspend Service Backup](https://docs.microsoft.com/en-us/rest/api/servicefabric/sfclient-api-suspendservicebackup) API, then all the partitions under this service are suspended for periodic backup of data.

* When suspension is applied at a _Partition_ using [Suspend Partition Backup](https://docs.microsoft.com/en-us/rest/api/servicefabric/sfclient-api-suspendpartitionbackup) API, then it suspends partitions under this service are suspended for periodic backup of data.

Once the need for suspension is over, then the periodic data backup can be restored using respective resume backup API. Periodic backup must be resumed at same _application_, _service_, or _partition_ where it was suspended.

* If suspension was applied at an _Application_, then it should be resumed using [Resume Application Backup](https://docs.microsoft.com/en-us/rest/api/servicefabric/sfclient-api-resumeapplicationbackup) API. 

* If suspension was applied at a _Service_, then it should be resumed using [Resume Service Backup](https://docs.microsoft.com/en-us/rest/api/servicefabric/sfclient-api-resumeservicebackup) API.

* If suspension was applied at a _Partition_, then it should be resumed using [Resume Partition Backup](https://docs.microsoft.com/en-us/rest/api/servicefabric/sfclient-api-resumepartitionbackup) API.

## Auto restore on data loss

## Get backup configuration

## List available backups 
- List backups using configured policy for Application/Service/Partition

## Next steps
- [Backup restore REST API reference](https://docs.microsoft.com/rest/api/servicefabric/sfclient-index-backuprestore)

[0]: ./media/service-fabric-backuprestoreservice/BackupPolicyAssociationExample.png




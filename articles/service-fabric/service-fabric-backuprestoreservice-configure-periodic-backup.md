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
        ```powershell
        $ScheduleInfo = @{
            Interval = 'PT10M'
            ScheduleKind = 'FrequencyBased'
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
    1. Azure blob store: This storage type should be selected when the need is to store generated backups in Azure. Both _standalone_ and _Azure based_ clusters can use this storage type. Description for this storage type requires connection string and name of the container where backups needs to be uploaded. If the container with the specified name is not available then it will be created during upload of a backup.
       ```json
        {
            "StorageKind": "AzureBlobStore",
            "FriendlyName": "Azure_storagesample",
            "ConnectionString": "<Put your Azure blob store connection string here>",
            "ContainerName": "BackupContainer"
        }
        ```

    2. File share: This storage type should be selected in case of _standalone_ clusters and when the need is to store data backup on-premise. Description for this storage type requires file share path where backups needs to be uploaded. Access to the file share can either be configured using Integrated Window Authentication; where the access to file share is provided to all computers belonging to the Service Fabric clustersteror by protecting this using 

> [!NOTE]
> Periodic backup and restore feature is presently in **Preview** and not supported for production workloads. 
>

## Enable Protection
[Explain levels at which data protection can be enabled, hierarchy, and policy override concepts]


## Disable Protection
## Suspend & Resume Protection
## Auto Restore on Data Loss
## Get Backup Configuration
## List Available Backups 
		○ List backups using configured policy for Application/Service/Partition




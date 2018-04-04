---
title: Configure Periodic Backup in Azure Service Fabric | Microsoft Docs
description: Use Service Fabric's Periodic Backup and Restore feature for protecting your applications from Data Loss.
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
ms.date: 04/04/2018
ms.author: hrushib

---
# Configure Periodic Backup in Azure Service Fabric

Periodic backup has two main steps

* Creation of Backup Policy: In this step you create backup policy by specifying Backup Schedule, Backup Storage, Maximum number of consecutive incremental backups and whether to Auto restore using last available backup in case of data loss. You can create multiple policies depending on your requirements.

* Enabling Data Protection: In this step you associate a backup policy created in step 1 to the required entity, Application, Service or a Partition.
	
## Create Backup Policy

A backup policy defines the following details:

* Auto Restore on Data Loss: Specifies whether to trigger restore automatically using the latest available backup in case the partition experiences a data loss event.

* Max Incremental Backups: Defines the maximum number of incremental backups to be taken between two full backups. This is just the upper limit. A full backup may be taken before specified number of incremental backups are completed in one of the following conditions

    1. The replica has never taken a full backup since it has become primary

    2. Some of the log records since the last backup has been truncated

    3. Replica passed the MaxAccumulatedBackupLogSizeInMB limit.

* Backup Schedule: The time or frequency at which to take periodic backups. One can schedule backups to be recurring every few mins or hours Or at a fixed time daily/ weekly.

    1. Frequency Based Backup Schedule: This schedule type should be used if the need is to take data backup at fixed intervals. Desired time interval between two consecutive backups is defined using ISO8601 format. Note that the interval resolution is supported till the minutes and portion defining seconds and part of this interval will be ignored.
    

    2. Time Based Backup Schedule: This schedule type should be used if the need is to take data backup at specific time of the day. 

* Backup Storage: The location, the file share or the storage account details, where to upload backups, along with the credentials to connect to them.
	

## Enable Protection
[Explain levels at which data protection can be enabled, hierarchy and policy override concepts]

## Disable Protection
## Suspend & Resume Protection
## Auto Restore on Data Loss
## Get Backup Configuration
## List Available Backups 
		○ List backups using configured policy for Application/Service/Partition




---
title: Troubleshoot snapshot policy errors for Azure NetApp Files | Microsoft Docs
description: Describes error messages and resolutions that can help you troubleshoot snapshot policy management issues for Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 09/23/2020
ms.author: anfdocs
---
# Troubleshoot snapshot policy errors

This article describes error scenarios you might encounter when managing Azure NetApp Files snapshot policies. It also provides solutions that can help you address the issues.

## Error conditions and resolutions 

|     Error condition    |     Resolution    |
|-|-|
| Snapshot policy creation fails with invalid snapshot policy name. | An error occurs during snapshot policy creation if your snapshot policy name is invalid. The following guidelines apply for snapshot policy names:  <ul><li> The snapshot policy name cannot contain non-ASCII or special characters. </li> <li> The snapshot policy name must begin with a letter or a number and can contain letters, numbers, underscore ('_') and hyphens ('-') only. </li> <li> The snapshot policy name must be between 1 and 64 characters.  </li></ul> Revise the snapshot policy name according to the guidelines.  |
| Snapshot policy creation fails with invalid values. | Azure NetApp Files fails to create a snapshot policy if you enter an invalid value for a field such as `Number of snapshots to keep` or `Minute on the hour to take snapshot`. The valid values are as follows:  <ul><li>The value must be a valid number.</li> <li>The value must be between 0 and 59.</li></ul> Make sure that a valid value is provided for the fields. | 
| Snapshot policy creation fails with the error `Total number of snapshots to keep exceeds 255`. | Each volume can have a [maximum of 255 snapshots](azure-netapp-files-resource-limits.md). The maximum includes the sum of all hourly, daily, weekly, and monthly snapshots. <br> Decrease the `Snapshots to keep` value and try again. |
| Assigning policy to a volume fails with the error `Total snapshot policy is over the max '255'`. | Each volume can have a [maximum of 255 snapshots](azure-netapp-files-resource-limits.md). When the sum of all on-demand, hourly, daily, weekly, and monthly snapshots exceeds the maximum, an error occurs. <br> Decrease the `snapshots to keep` value or delete some on-demand snapshots and try again. | 

## Next steps  

* [Manage snapshot policies](snapshots-manage-policy.md)

---
title: What changing to volume hard quota means for your Azure NetApp Files service | Microsoft Docs
description: Describes the change to using volume hard quota, how to plan for the change, and how to monitor and manage capacities.   
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/05/2021
ms.author: b-juche
---
# What changing to volume hard quota means for your Azure NetApp Files service

Azure NetApp Files has been using an automatic capacity pool provisioning and growth mechanism. Volumes are thinly provisioned on an underlaying, customer-provisioned capacity pool of a selected tier and size. Volume quotas are used to provide performance and scalability, and the quotas can be adjusted on-the-fly at any time. This behavior means that, currently, the volume quota is a performance lever used to control bandwidth to the volume. Currently, underlaying capacity pools automatically grow when capacity fills up.  

The Azure NetApp Files behavior about volume and capacity pool provisioning will change to a manual and controllable mechanism. Starting  $RELEASE/$DATA, volume sizes (quota) will manage bandwidth performance and provisioned capacity, and underlying capacity pools will no longer grow automatically.  This article provides details about this change.

## Reasons for the change to volume hard quota 

Many customers have indicated three main challenges with the current behavior:
* VM clients would see the thinly provisioned (100 TiB) capacity of any given volume when using OS space or capacity monitoring tools, giving inaccurate client or application side capacity visibility.
* Application owners would have no control of provisioned capacity pool space (and associated cost), given the capacity pool auto-grow behavior. This situation is cumbersome in environments where "run-away processes" would rapidly fill up and grow provisioned capacity.
* Customers want to see and maintain a direct correlation between volume size (quota) and performance. With the current behavior of (implicit) oversubscribing a volume (capacity-wise) and pool auto-grow, customers do not have a direct correlation, until volume quota has been actively (re)set. 

Many customers have requested self-control over provisioned capacity, to control and balance storage capacity, utilization, and control cost along with application- and client-side visibility of available, used, and provisioned capacity and performance of their application volumes.

## What is the volume hard quota change   

Starting $RELEASE/$DATA, Azure NetApp Files volumes will no longer be thin provisioned at the maximum 100 TiB. The volumes will be provisioned at the actual configured size (quota). Also, the underlaying capacity pools will no longer auto-grow upon full-capacity consumption. This change will reflect the behavior like Azure Managed Disks, which are also provisioned as-is, without automatic capacity increase.

For example, consider an ANF volume configured at 1-TiB size (quota) on a 4-TiB Ultra service level capacity pool. An application is continuously writing data to the volume.

The current behavior:
* Expected bandwidth: 128 MiB/s
* Total usable (and client visible) capacity: 100 TiB
You will not be able to write more data on the volume beyond this size
* Capacity pool: automatically grows with 1-TiB increments when it is full
* Volume quota change: only changes performance (bandwidth) of the volume. It does not change client visible or usable capacity.

The Changed behavior:
* Expected bandwidth: 128 MiB/s
* Total usable (and client visible) capacity: 1 TiB 
You will not be able to write more data on the volume beyond this size
* Capacity pool: remains 4 TiB in size and does not automatically grow
* Volume quota change: changes performance (bandwidth) and client visible/usable capacity of the volume.

You need to proactively monitor the utilization of Azure NetApp Files volumes and capacity pools. You need to purposely change the volume and pool utilization for close-to-full consumption. Azure NetApp Files will continue to allow for on-the-fly volume and capacity pool resize operations.

## How to operationalize the volume hard quota change  

This section provides guidance on how to operationalize the change to volume hard quota r for a smooth transition. It also provides insights into  handling currently provisioned volumes and capacity pools, on-going monitoring, and alerting and capacity management options.

### Currently provisioned volumes and capacity pools  

Because of the volume hard quota change, you should change your operating model. The provisioned volumes and capacity pools will require ongoing capacity management.  Because the changed behavior will happen instantly, Azure NetApp Files will take a series of one-time corrective measures for existing, previously provisioned volumes and capacity pools, as described below.

### One-time corrective or preventative measures  

The volume hard quota change will result in changes in provisioned and available capacity and for previously provisioned volumes and pools. As a result, some capacity allocation challenges might happen. To avoid short-term out-of-space situations for customers, the Azure NetApp Files team will provide the following, one-time corrective/preventative measures:

* Provisioned volume sizes: 
    Every provisioned volume will be resized with 20% more buffer capacity with a maximum of 100 TiB (which is the volume size limit). The new volume size, including buffer capacity, will be based on the following factors:  
    * Provisioned volume capacity, in case the used capacity is less than the provisioned volume quota
    * Used volume capacity, in case the used capacity is more than the provisioned volume quota
    There is no additional charge for volume-level capacity increase if the underlaying capacity pool does not need to be grown. As an effect of this change, you might observe a bandwidth limit increase for the volume.

* Provisioned capacity pool sizes: 
    If the hosting capacity pool for the collection of volumes becomes higher than 100% allocation after the volumes increase, the capacity pool will be increased to a size equal to the amount of total allocated volume sizes. The allocated volume size will be rounded up to the nearest TiB, with a maximum capacity pool size of 500 TiB (which is the capacity pool size limit). Capacity pools will not be decreased in provisioned size. Additional capacity pool capacity will be subject to ACR charge as normal.

#### Example 1 – Without capacity pool change  

In this scenario, a single capacity pool named pool includes three volumes named vol1, vol2, and vol3 and provisioned as follows (all sizes in TiB):

 
Vol2 is overcommitted, so the used capacity exceeds the set volume quota.

Before the change, the usable (available) space for each volume would be represented at 100 TiB, and total capacity pool usable space would appear (and automatically grow to) 300 TiB as follows:

 
Vol2 can be overcommitted because the usable capacity for this volume is 100 TiB per the current logic. More capacity pool has been provisioned to accommodate both the provisioned (quota) and used volume capacities.

After the volumes are resized, based on the mentioned logic, the new usable volume and capacity pool sizes have changed to as follows: 

 
Vol1 and vol3 will be increased towards the original quota. Vol2 will be increased towards the used capacity. The capacity pool will not have to be increased to accommodate the new volume sizes. The capacity pool will no longer automatically grow.

 The following diagrams explain this scenario:

 
 


#### Example 2 – With capacity pool change: 

In this similar scenario, a single capacity pool named pool includes three volumes named vol1, vol2, and vol3.  The volumes are provisioned as follows (all sizes in TiB):

 
Vol2 is overcommitted, so the used capacity exceeds the set volume quota. A capacity pool large enough has been provisioned to accommodate both the provisioned (quota) and used volume capacities.

After the volumes are resized, based on the mentioned logic, the new usable volume and capacity pool sizes have changed to as follows:

 
Vol1 and vol3 will be increased towards the original quota.  Vol2 will be increased towards the used capacity. The capacity pool will have to be increased to accommodate the new volume sizes. The capacity pool will no longer automatically grow.
 
 The following diagrams explain this scenario:
 

### Ongoing capacity management  

After the one-time corrective or preventative measures, you can change the volumes and capacity pool sizes to appropriate sizes at time.  You should put together ongoing processes to monitor and manage capacity.  The following sections provide suggestions and alternatives about capacity monitoring and management.

## Monitoring

You can monitor capacity utilization at various levels. 

### VM-level monitoring 

The highest level of monitoring (closest to the application) is from within the application virtual machine. You will observe a change in behavior in capacity reporting from within the VM client OS.

In both scenarios below, consider an Azure NetApp Files volume configured at 1-TiB size (quota) on a 4-TiB Ultra service level capacity pool. 

#### Windows

Windows clients can check the used and available capacity of a volume by using the network mapped drive properties. You can use the **Explorer** -> **Drive** -> **Properties** option.  You can also use the  `dir` command at the command prompt as shown below.

The following snapshots show the volume capacity reporting in Windows before the changed behavior:

The following snapshots show the volume capacity reporting in Windows after the changed behavior:

### Alerting with ANFCapacityManager

You can use the community supported Logic Apps ANFCapacityManager tool(available on GitHub) to monitor Azure NetApp Files capacity and receive tailored alerting. 

ANFCapacityManager is an Azure Logic App that manages capacity-based alert rules.  It automatically increases volume sizes to prevent your Azure NetApp Files volumes from running out of space. It is easy to deploy and provides the following Alert Management capabilities:

* When an Azure NetApp Files Capacity Pool or Volume is created, ANFCapacityManager creates a metric alert rule based on the specified percent consumed threshold.
* When an Azure NetApp Files Capacity Pool or Volume is resized, ANFCapacityManager modifies the metric alert rule based on the specified percent capacity consumed threshold. If the alert rule does not exist, it will be created.
* When an Azure NetApp Files Capacity Pool or Volume is deleted, the corresponding metric alert rule will be deleted.

You can configure the following key alerting settings:
* Capacity Pool % Full Threshold - This setting determines the consumed threshold that triggers an alert for capacity pools. A value of 90 would cause an alert to be triggered when the capacity pool reaches 90% consumed.
* Volume % Full Threshold - This setting determines the consumed threshold that triggers an alert for volumes. A value of 80 would cause an alert to be triggered when the volume reaches 80% consumed.
* Existing Action Group for Capacity Notifications - this setting is the action group that will be triggered for capacity-based alerting. This setting should be pre-created by you. The action group can send email, SMS, or other formats.
 

After installing ANFCapacityManager is successfully, you can expect the following behavior. When an Azure NetApp Files capacity pool or volume is created, modified, or deleted, the Logic App will automatically create, modify, or delete a capacity-based Metric Alert rule with the name 'ANF_Pool_poolname' or 'ANF_Volume_poolname_volname'. 


#### Linux  

Linux clients can check the used and available capacity of a volume by using the df command. The -h option will show the size, used space, and available space in human-readable format, using M, G, and T unit sizes.

The following screenshot shows volume capacity reporting in Linux before the changed behavior:

## Capacity management

In addition to monitoring and alerting, you should also incorporate an application-capacity management practice to manage Azure NetApp Files (increased) capacity consumption. When an Azure NetApp Files volume or capacity pool fills up, extra capacity can be provided on-the-fly without application disruption. This section describes various manual and automated ways to increase volume and capacity pool provisioned space as needed.
 
### Manual 

You can use the portal or the CLI to manually increase the volume or capacity pool sizes:

#### Portal 

You can change the size of a volume as necessary. A volume's capacity consumption counts against its pool's provisioned capacity.   

1.	From the Manage NetApp Account blade, click Volumes.
2.	Right-click the name of the volume that you want to resize or click the "…" icon at the end of the volume's row to display the context menu.
3.	Use the context menu options to resize or delete the volume.

In some cases, the hosting capacity pool does not have sufficient capacity to resize the volume(s). However, you can change the capacity pool size in 1-TiB increments or decrements. The capacity pool size cannot be smaller than 4 TiB. Resizing the capacity pool changes the purchased Azure NetApp Files capacity.

1.	From the Manage NetApp Account blade, click the capacity pool that you want to resize.
2.	Right-click the capacity pool name or click the "…" icon at the end of the capacity pool’s row to display the context menu.
3.	Use the context menu options to resize or delete the capacity pool.

#### CLI or PowerShell
You can use the Azure NetApp Files CLI tools, including the Azure CLI and Azure PowerShell, to manually change the volume or capacity pool size. The following two commands can be used to manage Azure NetApp Files volume and pool resources:
* az netappfiles pool
* az netappfiles volume

To manage Azure NetApp Files resources using Azure CLI, you can open the Azure portal and select the Cloud Shell link in the top of the menu bar: 

 

This action will open the Azure Cloud shell:

 

 
You can use the following commands to show and update the size of any given volume:

 

 

You can use the following commands to show and update the size of any given capacity pool:
 

 

### Automated  

You can build an automated process to manage the changed behavior.

#### REST API
The REST API for the Azure NetApp Files service defines HTTP operations against resources such as the NetApp account, the capacity pool, the volumes, and snapshots. The REST API specification for Azure NetApp Files is published through GitHub. Example code for use with REST APIs can be found in GitHub.

See Develop for Azure NetApp Files with REST API. 

#### REST API using PowerShell  

The REST API for the Azure NetApp Files service defines HTTP operations against resources such as the NetApp account, the capacity pool, the volumes, and snapshots. This article helps you get started with using the Azure NetApp Files REST API using PowerShell. The REST API specification for Azure NetApp Files is published through GitHub.

See Develop for Azure NetApp Files with REST API using PowerShell.

#### Capacity Management with ANFCapacityManager

ANFCapacityManager is an Azure Logic App that manages capacity-based alert rules. It automatically increases volume sizes to prevent your Azure NetApp Files volumes from running out of space. In addition to sending alerts, it can enable the automatic increase of volume and capacity pool sizes to prevent your Azure NetApp Files volumes from running out of space:
* Optionally, when an Azure NetApp Files Volume reaches the specified percent consumed threshold, the volume quota (size) will be increased by the percent specified between 10-100%.
* If increasing the volume size exceeds the capacity of the containing capacity pool, the capacity pool size will also be increased to accommodate the new volume size.
You can configure the following key capacity management setting:
* AutoGrow Percent Increase - Percent of the existing volume size to automatically grow a volume if it reaches the % Full Threshold specified above. A value of 0 (zero) will disable the AutoGrow feature. A value between 10 and 100 is recommended.

 
## FAQ 

This section answers some questions about the volume hard quota change. 
### Is ANFCapacityManager Microsoft supported?

This logic app (ANFCapacityManager) is provided as is and is not supported by NetApp or Microsoft. You are encouraged to modify to fit your specific environment or requirements. You should test the functionality before deploying it to any business critical or production environments.

### Is there an example ANFCapacityManager workflow?

Yes, a complete example can be found here.

### Does snapshot space count towards the usable or provisioned capacity of a volume?

Yes, the consumed snapshot capacity counts towards the provisioned space in the volume. In case the volume runs full, consider two remediation options:
o	Resize the volume as described in this article.
o	Remove older snapshots to free up space in the hosting volume.

### Does this change mean volume auto-grow will disappear from Azure NetApp Files?

A common misconception is that Azure NetApp Files volumes would automatically grow upon filling up. Volumes were thinly provisioned with a size of 100 TiB, regardless of the actual set quota, while the underlaying capacity pool would automatically grow with 1-TiB increments. This change will address the (visible and usable) volume size to the set quota, and capacity pools will no longer automatically grow. This change results in commonly desired accurate client-side space and capacity reporting. It avoids ‘runaway’ capacity consumption.

### How can I report a bug or submit a feature request for ANFCapacityManger?

You can submit bugs and feature requests by clicking New Issue on the GitHub ANFCapacityManager page. 

### Does this change have any effect on volumes replicated with Cross Region Replication (preview)?

The hard volume quota is not enforced on replication destination volumes.

### Does this change have any effect on metrics currently available in Azure Monitor?

Portal metrics and Azure Monitor statistics will accurately reflect the new allocation and utilization model.

### Does this change have any effect on the resource limits for Azure NetApp Files?

There is no change in resource limits for Azure NetApp Files beyond the quota changes described in this article.

### Can I opt out of the additional 20% buffer capacity that is added to each volume during the one-time change?

No, for conformity purposes, you cannot opt out of this one-time change. However, all customers can freely resize volumes to appropriate sizes at any time  directly after the change has happened. However, you should  have capacity management processes in place first.

## Next steps
* [Resize a capacity pool or a volume](azure-netapp-files-resize-capacity-pools-or-volumes.md) 



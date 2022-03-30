---
title: Ways to monitor Azure NetApp Files | Microsoft Docs
description: Describes ways to monitor Azure NetApp Files, including the Activity log, metrics, and capacity utilization monitoring.
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 01/24/2022
ms.author: anfdocs
---
# Ways to monitor Azure NetApp Files

This article describes ways to monitor Azure NetApp Files.

## Azure Activity log

The Activity log provides insight into subscription-level events. For instance, you can get information about when a resource is modified or when a virtual machine is started. You can view the activity log in the Azure portal or retrieve entries with PowerShell and CLI. This article provides details on viewing the Activity log and sending it to different destinations.

To understand how Activity log works, see [Azure Activity log](../azure-monitor/essentials/activity-log.md).

For Activity log warnings for Azure NetApp Files volumes, see [Activity log warnings for Azure NetApp Files volumes](troubleshoot-volumes.md#activity-log-warnings-for-volumes).

## Azure NetApp Files metrics 

Azure NetApp Files provides metrics on allocated storage, actual storage usage, volume IOPS, and latency. With these metrics, you can gain a better understanding on the usage pattern and volume performance of your NetApp accounts.

You can find metrics for a capacity pool or volume by selecting the **capacity pool** or **volume**. Then click **Metric** to view the available metrics.  

For more information about Azure NetApp Files metrics, see [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md).

## Azure Service Health

The [Azure Service Health dashboard](https://azure.microsoft.com/features/service-health) keeps you informed about the health of your environment. It provides a personalized view of the status of your Azure services in the regions where they are used. The dashboard provides upcoming planned maintenance and relevant health advisories while allowing you to manage service health alerts.

For more information, see [Azure Service Health dashboard](../service-health/service-health-overview.md) documentation. 

## Capacity utilization monitoring 

It is important to monitor capacity regularly. You can monitor capacity utilization at the VM level.  You can check the used and available capacity of a volume by using Windows or Linux clients. You can also configure alerts by using `ANFCapacityManager`.  

For more information, see [Monitor capacity utilization](volume-hard-quota-guidelines.md#how-to-operationalize-the-volume-hard-quota-change).

## Next steps  

* [Azure Activity log](../azure-monitor/essentials/activity-log.md)
* [Activity log warnings for Azure NetApp Files volumes](troubleshoot-volumes.md#activity-log-warnings-for-volumes)
* [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md)
* [Monitor capacity utilization](volume-hard-quota-guidelines.md#how-to-operationalize-the-volume-hard-quota-change)

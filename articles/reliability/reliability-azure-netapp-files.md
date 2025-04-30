---
title: Reliability in Azure NetApp Files
description: Find out about reliability in Azure NetApp Files, including availability zones and multi-region deployments. 
author: b-ahibbard
ms.author: anfdocs
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions 
ms.service: azure-netapp-files
ms.date: 04/09/2025
---
# Reliability in Azure NetApp Files

This article describes reliability support in Azure NetApp Files, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft. This article also covers ways for you to create a resilient solution that meets your needs.

<!-- needed? -->
Azure NetApp Files is an Azure native, first-party, enterprise-class, high-performance file storage service. It provides Volumes as a service, which you can create within a NetApp account and a capacity pool, and share to clients using SMB and NFS. You can also select service and performance levels and manage data protection. You can create and manage high-performance, highly available, and scalable file shares by using the same protocols and tools that you're familiar with and rely on on-premises.

## Production deployment recommendations

For recommendations about reliable production workloads in Azure NetApp Files, see:

- [Use availability zone volume placement for application high availability with Azure NetApp Files](../azure-netapp-files/use-availability-zones.md)
- [Understand cross-zone replication](../azure-netapp-files/cross-zone-replication-introduction.md)
- [Understand cross-region replication in Azure NetApp Files](../azure-netapp-files/cross-region-replication-introduction.md)

## Transient faults

Transient faults are short, intermittent failures in components. They occur frequently in a distributed environment like the cloud, and they're a normal part of operations. They correct themselves after a short period of time. It's important that your applications handle transient faults, usually by retrying affected requests.

All cloud-hosted applications should follow the Azure transient fault handling guidance when communicating with any cloud-hosted APIs, databases, and other components. For more information, see [Recommendations for handing transient faults](/azure/well-architected/reliability/handle-transient-faults).

<!-- details for ANF -->

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)] 

[Azure NetApp Files' availability zone volume placement feature](../azure-netapp-files/use-availability-zones.md) lets you deploy each volume in the specific availability zone of your choice, in alignment with Azure compute and other services in the same zone. Azure NetApp Files deployments occur in the availability of zone of choice if Azure NetApp Files is present in that availability zone and has sufficient capacity.

Azure NetApp Files availability zone volume placement provides zonal placement. Zonal placement means resources are pinned to a specific availability zone. You can combine multiple zonal deployments across different zones to meet high reliability requirements. You're responsible for managing data replication and distributing requests across zones. If an outage occurs in a single availability zone, you're responsible for failover to another availability zone.

To achieve zone redundancy, Azure NetApp Files offers [cross-zone replication](../azure-netapp-files/cross-zone-replication-introduction.md), which you must configure separately from availability zone volume placement. Cross-zone replication provides data protection between volumes in different availability zones. You can asynchronously replicate data from an Azure NetApp Files volume (source) in one availability zone to another Azure NetApp Files volume (destination) in another availability zone. 

For more information, see [Manage availability zone volume placement in Azure NetApp Files](../azure-netapp-files/manage-availability-zone-volume-placement.md). 


###  Region support 

<!-- edit -->
For a list of regions that currently support availability zones, see Azure regions with availability zone support.

###  Considerations 

* Availability zone volume placement in Azure NetApp Files provides zonal volume placement, with latency within the zonal latency envelopes. It doesn't provide proximity placement towards compute. As such, it does not provide lowest latency guarantee.
* For other considerations related to availability zones in Azure NetApp Files, see [Manage availability zone volume placement](../azure-netapp-files/manage-availability-zone-volume-placement.md#requirements-and-considerations).
* If you're deploying Terraform-managed volumes with availability zones, there are [additional configurations required](../azure-netapp-files/manage-availability-zone-volume-placement.md#populate-availability-zone-for-terraform-managed-volumes).

### Cost

There's no extra charge to enable availability zone support in Azure NetApp Files. You pay for the capacity pools and other resources that you deploy in the availability zones.

### Configure availability zone support 

* You can configure availability zone support for new and existing volumes in Azure NetApp Files. To configure availability zones for volumes in Azure NetApp Files, see [Manage availability zone volume placement for Azure NetApp Files](../azure-netapp-files/manage-availability-zone-volume-placement.md).
* After a volume is created with an availability zone, the specified availability zone can’t be modified. Volumes can't be moved between availability zones.
* For additional resiliency, [Create cross-zone replication relationships for Azure NetApp Files](../azure-netapp-files/create-cross-zone-replication.md).


### Zone-down experience



### Failback

Failback is a manual process. For more information, see [Manage disaster recovery using Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md)

### Testing for zone failures  

To test your preparedness and cross-zone replication configuration, see [Test disaster recovery for Azure NetApp Files](../azure-netapp-files/test-disaster-recovery.md).

## Multi-region support

The Azure NetApp Files replication functionality provides data protection through cross-region volume replication. You can asynchronously replicate data from an Azure NetApp Files volume (source) in one region to another Azure NetApp Files volume (destination) in another region. This capability enables you to fail over your critical application if a region-wide outage or disaster happens. To learn more, see:

- [Cross-region replication of Azure NetApp Files volumes](../azure-netapp-files/cross-region-replication-introduction.md)
- [Supported regions for cross-region replication](../azure-netapp-files/cross-region-replication-introduction.md#supported-region-pairs)
- [Requirements and considerations for using cross-region replication in Azure NetApp Files](../azure-netapp-files/cross-region-replication-requirements-considerations.md)
- [Create volume replication for Azure NetApp Files](../azure-netapp-files/cross-region-replication-create-peering.md)

### Failback

Both failover and failback are manual process in Azure NetApp Files cross-region replicaiton. For more information including how to manage these processes, see [Manage disaster recovery using Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md)

### Testing for region failures  

To test your preparedness and cross-region replication configuration, see [Test disaster recovery for Azure NetApp Files](../azure-netapp-files/test-disaster-recovery.md).

## Backups

[Azure NetApp Files backup](../azure-netapp-files/backup-introduction.md) expands the data protection capabilities of Azure NetApp Files by providing fully managed backup solution for long-term recovery, archive, and compliance. Backups created by the service are stored in Azure storage, independent of volume snapshots that are available for near-term recovery or cloning. Backups taken by the service can be restored to new Azure NetApp Files volumes within the region. Azure NetApp Files backup supports both policy-based (scheduled) backups and manual (on-demand) backups. 

For additional security, Azure NetApp Files [snapshots](/azure-netapp-files/data-protection-disaster-recovery-options#snapshots) add stability, scalability, and fast recoverability without affecting performance. They provide the foundation for other redundancy solutions, including backup, cross-region replication, and cross-zone replication.

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [What are redundancy, replication, and backup?](concept-redundancy-replication-backup.md).

## Service-level agreement

The service-level agreement (SLA) for Azure NetApp Files describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. For more information, see [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

Recovery Point Objective (RPO) indicates the point in time to which data can be recovered. The RPO target is typically less than twice the replication schedule, but it can vary. In some cases, it can go beyond the target RPO based on factors such as the total dataset size, the change rate, the percentage of data overwrites, and the replication bandwidth available for transfer.

Cross-zone and cross-region replication support three replication schedules: 10 minutes, hourly, and daily.

- For the replication schedule of 10 minutes, the typical RPO is less than 20 minutes.
- For the hourly replication schedule, the typical RPO is less than two hours.
- For the daily replication schedule, the typical RPO is less than two days.
 
>[!NOTE]
>The 10-minute replication schedule isn't supported for [Azure NetApp Files large volumes](../azure-netapp-files/large-volumes.md) using cross-zone or cross-region replication.

Recovery Time Objective (RTO), or the maximum tolerable business application downtime, is determined by factors in bringing up the application and providing access to the data at the second site. The storage portion of the RTO for breaking the peering relationship to activate the destination volume and provide read and write data access in the second site is expected to be complete within a minute.

## Related content

- [Architecture best practices for Azure NetApp Files](/azure/well-architected/service-guides/azure-netapp-files)
- [Use availability zone volume placement for application high availability with Azure NetApp Files](../azure-netapp-files/use-availability-zones.md)
- [Manage availability zone volume placement for Azure NetApp Files](../azure-netapp-files/manage-availability-zone-volume-placement.md)
- [Create cross-zone replication relationships for Azure NetApp Files](../azure-netapp-files/create-cross-zone-replication.md).
- [Cross-region replication of Azure NetApp Files volumes](../azure-netapp-files/cross-region-replication-introduction.md)
- [Supported regions for cross-region replication](../azure-netapp-files/cross-region-replication-introduction.md#supported-region-pairs)
- [Requirements and considerations for using cross-region replication in Azure NetApp Files](../azure-netapp-files/cross-region-replication-requirements-considerations.md)
- [Create volume replication for Azure NetApp Files](../azure-netapp-files/cross-region-replication-create-peering.md)

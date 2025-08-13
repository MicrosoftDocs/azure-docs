---
title: Reliability in Azure NetApp Files
description: Learn about reliability in Azure NetApp Files, including availability zones and multi-region deployments.
author: b-ahibbard
ms.author: anfdocs
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-netapp-files
ms.date: 07/28/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure NetApp Files works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 
---

# Reliability in Azure NetApp Files

This article describes reliability support in Azure NetApp Files, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

Azure NetApp Files is a native, enterprise-grade file storage solution that integrates seamlessly within Azure and enables file sharing across clients via Network File System (NFS) and Server Message Block (SMB) protocols. Azure NetApp Files is designed for high performance and provides scalable and secure file storage that's managed as a service.

To use Azure NetApp Files, you must configure a NetApp account that contains *capacity pools* that host *volumes*. You can configure capacity and throughput independently and manage data protection options that fit various needs. You can enable replication between volumes, even if they're in different locations.

## Production deployment recommendations

To learn about how to deploy Azure NetApp Files to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure NetApp Files in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-netapp-files).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

In addition to transient fault types that can affect any cloud-based solution, occasional planned maintenance, such as platform updates, service updates, and software upgrades, can also affect Azure NetApp Files.

From a file protocol, like NFS and SMB, perspective, transient faults aren't disruptive if the application can handle the input/output (I/O) pauses that might occur during these events. The I/O pauses are typically short, ranging from a few seconds up to 30 seconds. Some applications might require tuning to handle the I/O pauses.

The NFS protocol is robust, and client-server file operations generally continue normally. Some applications might require tuning to handle I/O pauses for as long as 30 to 45 seconds. Ensure that you're aware of the application's resiliency settings to cope with the storage service maintenance events.

For human-interactive applications that use the SMB protocol, the standard protocol settings are usually sufficient. Azure NetApp Files also supports [SMB continuous availability](../azure-netapp-files/azure-netapp-files-create-volumes-smb.md#continuous-availability), which enables SMB Transparent Failover. SMB Transparent Failover eliminates disruptions that service maintenance events cause. It also improves reliability and user experience.

SMB continuous availability is only available for [specific applications](../azure-netapp-files/faq-application-resilience.md#do-i-need-to-take-special-precautions-for-smb-based-applications).

For more recommendations, see [Application resilience FAQs for Azure NetApp Files](../azure-netapp-files/faq-application-resilience.md).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure NetApp Files supports *zonal* deployments of volumes. Use the [availability zone volume placement feature](../azure-netapp-files/replication.md#availability-zones) in Azure NetApp Files to deploy each volume in a single availability zone of your choice. You can use this feature only if Azure NetApp Files is present in that availability zone and has sufficient capacity. If you have latency-sensitive applications, you can deploy a volume to the same availability zone as your Azure compute resources and other services.

In the following diagram, blue arrows represent how all virtual machines (VMs) within the region in peered virtual networks can access all Azure NetApp Files resources. Green arrows represent how VMs that access Azure NetApp Files volumes in the same zone share the availability zone failure domain. There's no replication between the different volumes at the platform level.

:::image type="complex" border="false" source="./media/reliability-netapp-files/availability-zone-diagram.png" alt-text="Diagram that shows Azure NetApp Files availability zone volume placement." lightbox="./media/reliability-netapp-files/availability-zone-diagram.png":::
   The diagram shows three availability zones in an Azure region. Blue arrows connect icons that represent VMs and Azure NetApp Files resources across availability zones. Green arrows connect VMs and Azure NetApp Files volumes in the same availability zone.
:::image-end:::

A single-zone deployment isn't sufficient to meet high reliability requirements. To asynchronously replicate data between volumes in different availability zones, you can use [cross-zone replication](../azure-netapp-files/replication.md). You must configure cross-zone replication separately from availability zone volume placement.

If an availability zone fails, you're responsible for detecting the failure and switching to an alternative volume in a different zone.

### Region support

Cross-zone replication is available in all [availability zone-enabled regions](regions-list.md) that support [Azure NetApp Files](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=netapp&regions=all&rar=true).

### Considerations

- Availability zone volume placement in Azure NetApp Files provides zonal volume placement. You'll see low latency when you connect to VMs within the same availability zone. However, availability zone volume placement doesn't provide proximity placement with VMs or other resources, and the volume might be in a different physical part of the datacenter.

- Replication is permitted between different Azure subscriptions only if they're within the same Microsoft Entra tenant.

- For more considerations about availability zones in Azure NetApp Files, see [Requirements and considerations for using cross-zone replication](../azure-netapp-files/replication-requirements.md) and [Manage availability zone volume placement](../azure-netapp-files/manage-availability-zone-volume-placement.md#requirements-and-considerations).

### Cost

There's no extra charge to enable availability zone volume placement in Azure NetApp Files. You only pay for the capacity pools and resources that you deploy within these zones.

Replicated volumes are hosted on a [capacity pool](../azure-netapp-files/azure-netapp-files-understand-storage-hierarchy.md#capacity_pools). The cost for cross-zone replication is based on the provisioned capacity pool size and tier. There's no extra cost for data replication.

### Configure availability zone support

You need to separately configure volume placement and cross-zone replication.

- **Volume placement:**

    - **Create a new volume or configure an existing volume with availability zone support.**  To configure availability zones for volumes in Azure NetApp Files, see [Manage availability zone volume placement for Azure NetApp Files](../azure-netapp-files/manage-availability-zone-volume-placement.md).

        If you deploy Terraform-managed volumes with availability zones, other configurations are required. For more information, see [Populate availability zone for Terraform-managed volumes](../azure-netapp-files/manage-availability-zone-volume-placement.md#populate-availability-zone-for-terraform-managed-volumes).

        If you use role-based access control, [ensure that you configure the correct permissions](../azure-netapp-files/manage-availability-zone-volume-placement.md#configure-custom-rbac-roles).

    - **Migrate a volume between availability zones.** After you configure a volume to place it into an availability zone, the specified availability zone can't be modified. You can't move volumes between availability zones.

    - **Disable availability zone support for a volume.** After you configure a volume to place it into an availability zone, you can't disable the availability zone support.

- **Cross-zone replication:**

    - **Enable cross-zone replication.** To improve the resiliency of your solution, [configure cross-zone replication for another volume](../azure-netapp-files/create-cross-zone-replication.md).

    - **Disable cross-zone replication.** You can disable cross-zone replication by breaking the replication pairing. For more information, see [Manage disaster recovery by using Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md#fail-over-to-destination-volume). 

### Normal operations

This section describes what to expect when Azure NetApp Files volumes are configured to deploy into multiple availability zones, cross-zone replication is enabled, and all availability zones are operational.

- **Traffic routing between zones:** Incoming requests are routed to the specific volume, which is located in the availability zone that you select.

- **Data replication between zones:** Azure NetApp Files cross-zone replication means that all changes to the source volume are asynchronously replicated to destination volumes. You can decide how frequently the replication happens. Cross-zone replication supports three replication schedules: every 10 minutes, hourly, and daily.

    > [!IMPORTANT]
    > The 10-minute replication schedule isn't supported for [large volumes](../azure-netapp-files/azure-netapp-files-understand-storage-hierarchy.md#large-volumes) that use cross-zone replication.

### Zone-down experience

This section describes what to expect when Azure NetApp Files volumes are configured to deploy into multiple availability zones, cross-zone replication is enabled, and there's an availability zone outage.

- **Detection and response:** You're responsible for detecting the loss of an availability zone and initiating a failover.

    To monitor the health of your Azure NetApp Files volume, you can use Azure Monitor metrics. Azure Monitor detects any anomalies that indicate a zone-down scenario via real-time metrics such as input/output operations per second (IOPS), latency, and capacity usage. You can configure alerts and notifications to send to administrators so that they can immediately respond by rebalancing file shares or initiating failover or other disaster recovery protocols.

    Failover is a manual process. When you need to activate the destination volume, such as when you want to fail over to the destination availability zone, you need to break the replication peering and then mount the destination volume. For more information, see [fail over to the destination volume](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md#fail-over-to-destination-volume).

- **Active requests:** During a zone-down event, active requests can experience disruptions or increased latencies.

- **Expected data loss:** The amount of data loss, or recovery point objective (RPO), that you can expect during a zone failover depends on the cross-zone replication schedule that you configure.

    | Replication schedule | Typical RPO |
    |---|---|
    | Every 10 minutes | 20 minutes|
    | Hourly | Two hours |
    | Daily | Less than 48 hours |

- **Expected downtime:** Failover to another zone requires that you break the peering relationship to activate the destination volume and provide read and write data access in the second site. After you trigger the peering to break, you can expect failover to complete within one minute.

    However, the total amount of downtime, or recovery time objective (RTO), that you can expect during a zone failover depends on multiple factors, including how long it takes for your systems or processes to detect the loss of the zone and to initiate failover processes. It's also important to decide whether to automate your response or whether manual steps are required. For well-prepared configurations, the overall process typically requires a few minutes to an hour to complete.

- **Traffic rerouting:** You're responsible for redirecting your application traffic to connect to the newly active destination volume. For more information, see [fail over to the destination volume](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md#fail-over-to-destination-volume).

### Failback

Failback is a manual process that requires you to perform a resync operation, reestablish the replication, and remount the source volume for the client to access. For more information, see [Manage disaster recovery by using Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md).

### Testing for zone failures

You can test your cross-zone replication configuration safely by using snapshots of your volume. To learn about a high-level approach to test your cross-zone replication configuration, see [Test disaster recovery for Azure NetApp Files](../azure-netapp-files/test-disaster-recovery.md).

## Multi-region support

By default, Azure NetApp Files is a single-region service. If the region becomes unavailable, volumes stored in that region are also unavailable. To improve resiliency if a regional outage occurs, Azure NetApp Files supports cross-region replication. You can asynchronously replicate data from an Azure NetApp Files volume (the source) in one region to another Azure NetApp Files volume (the destination) in another region that Microsoft preselects. This capability enables you to fail over your critical application if a region-wide outage or disaster happens.

> [!NOTE]
> You can also replicate a single volume to another availability zone *and* to another region. For more information, see [Understand Azure NetApp Files replication](../azure-netapp-files/replication.md).

### Region support

The secondary region that you can replicate your volumes to depends on the primary region. For more information, see [supported region pairs](../azure-netapp-files/replication.md#supported-region-pairs). 

### Considerations

Replication is permitted between different Azure subscriptions only if they're within the same Microsoft Entra tenant.

For other considerations related to cross-region replication in Azure NetApp Files, see [Requirements and considerations for using cross-region replication](../azure-netapp-files/replication-requirements.md).

### Cost

Cross-region replication charges are based on the amount of data that you replicate. For more information and some example scenarios, see [Cost model for cross-region replication](../azure-netapp-files/replication.md#cost-model-for-cross-region-replication).

### Configure multi-region support

- **Enable cross-region replication:** To improve the resiliency of your solution, [configure cross-region replication](../azure-netapp-files/cross-region-replication-create-peering.md).

- **Disable cross-region replication:** You can disable cross-region replication by breaking the replication pairing. For more information, see [Manage disaster recovery using Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md#fail-over-to-destination-volume).

### Normal operations

This section describes what to expect when Azure NetApp Files volumes are configured to use cross-region replication and both regions are operational.

- **Traffic routing between regions:** Incoming requests are routed to the specific volume, which is located in the primary region.

- **Data replication between regions:** Azure NetApp Files cross-region replication means that all changes to the source volume are asynchronously replicated to destination volumes. You can decide how frequently the replication happens. Cross-region replication supports three replication schedules: every 10 minutes, hourly, and daily.

    > [!IMPORTANT]
    > The 10-minute replication schedule isn't supported for [large volumes](../azure-netapp-files/azure-netapp-files-understand-storage-hierarchy.md#large-volumes) that use cross-region replication.

- **Monitor replication health:** You can monitor the health of the peering relationship, and you can configure alerts to notify you if the replication lag increases beyond your expected threshold. To learn more, see [Display health and monitor status of replication relationship](../azure-netapp-files/cross-region-replication-display-health-status.md).

### Region-down experience

This section describes what to expect when Azure NetApp Files volumes are configured to use cross-region replication and there's an outage of the primary region.

- **Detection and response:** You're responsible for detecting the loss of a region and initiating a failover.

    To monitor the health of your Azure NetApp Files volume, you can use Azure Monitor metrics. Azure Monitor detects any anomalies that indicate a region-down scenario via real-time metrics such as IOPS, latency, and capacity usage. You can configure alerts and notifications to send to administrators so that they can immediately respond by rebalancing file shares or initiating failover or other disaster recovery protocols.

    Failover is a manual process. When you need to activate the destination volume, such as when you want to fail over to the destination region, you need to break the replication peering and then mount the destination volume. For more information, see [fail over to the destination volume](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md#fail-over-to-destination-volume).

- **Active requests:** During a region-down event, active requests can experience disruptions or increased latencies.

- **Expected data loss:** The amount of data loss, or RPO, that you can expect during a region failover depends on the cross-region replication schedule that you configure.

    | Replication schedule | Typical RPO |
    |---|---|
    | Every 10 minutes | Less than 20 minutes|
    | Hourly | Less than Two hours |
    | Daily | Less than 48 hours |

- **Expected downtime:** Failover to another region requires you to break the peering relationship to activate the destination volume and provide read and write data access in the second site. After you trigger the peering to break, you can expect failover to complete within one minute.

    However, the total amount of downtime, or RTO, that you can expect during a zone failover depends on multiple factors, including how long it takes for your systems or processes to detect the loss of the zone and to initiate failover processes. It's also important to decide whether to automate your response or whether manual steps are required. For well-prepared configurations, the overall process typically requires a few minutes to an hour to complete.

- **Traffic rerouting:** You're responsible for redirecting your application traffic to connect to the newly active destination volume. For more information, see [fail over to the destination volume](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md#fail-over-to-destination-volume).

### Failback

Failback is a manual process that requires you to perform a resync operation, reestablish the replication, and remount the source volume for the client to access. For more information, see [Manage disaster recovery using Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md).

### Testing for region failures

You can test your cross-region replication configuration safely by using snapshots of your volume. To learn about a high-level approach to test your cross-region replication configuration, see [Test disaster recovery for Azure NetApp Files](../azure-netapp-files/test-disaster-recovery.md).

## Backups

[Azure NetApp Files backup](../azure-netapp-files/backup-introduction.md) expands the data protection capabilities of Azure NetApp Files by providing a fully managed backup solution for long-term recovery, archive, and compliance. Backups created by the service are stored in Azure storage, independently of volume snapshots that are available for near-term recovery or cloning. Backups taken by the service can be restored to new Azure NetApp Files volumes within the region. Azure NetApp Files backup supports both policy-based (scheduled) backups and manual (on-demand) backups.

For further security, Azure NetApp Files [snapshots](../azure-netapp-files/data-protection-disaster-recovery-options.md#snapshots) add stability, scalability, and fast recoverability without affecting performance. They provide the foundation for other redundancy solutions, including backup, cross-region replication, and cross-zone replication.

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [Redundancy, replication, and backup](concept-redundancy-replication-backup.md).

## Service-level agreement

The service-level agreement (SLA) for Azure NetApp Files describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. For more information, see [SLAs for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

- [Architecture best practices for Azure NetApp Files](/azure/well-architected/service-guides/azure-netapp-files)
- [Requirements and considerations for using Azure NetApp Files replication](../azure-netapp-files/replication-requirements.md)
- [Manage availability zone volume placement for Azure NetApp Files](../azure-netapp-files/manage-availability-zone-volume-placement.md)
- [Create cross-zone replication relationships for Azure NetApp Files volumes](../azure-netapp-files/create-cross-zone-replication.md)
- [Create cross-region replication relationships for Azure NetApp Files volumes](../azure-netapp-files/cross-region-replication-create-peering.md)

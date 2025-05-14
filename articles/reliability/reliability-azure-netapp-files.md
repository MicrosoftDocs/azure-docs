---
title: Reliability in Azure NetApp Files
description: Find out about reliability in Azure NetApp Files, including availability zones and multi-region deployments. 
author: b-ahibbard
ms.author: anfdocs
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-netapp-files
ms.date: 05/09/2025
---
# Reliability in Azure NetApp Files

This article describes reliability support in Azure NetApp Files, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

Resiliency is a shared responsibility between you and Microsoft. This article also covers ways for you to create a resilient solution that meets your needs.

Azure NetApp Files is a native, enterprise-grade file storage solution integrated seamlessly within Azure. Designed for high performance, it offers scalable and secure file storage managed as a service. Users can create *volumes* within a NetApp account and capacity pools, enabling file sharing across clients via SMB and NFS protocols. This service provides flexibility in selecting performance levels, configuring capacity and throughput independently, and managing data protection options tailored to various needs.

## Production deployment recommendations

<!-- This section feels like a "learn more" instead of explicit recommendations. Can we be more crisp about what we suggest? This section should only contain items we think that the majority of customers should do, and each action should be explicit (e.g. "enable availability zone support" or something like that). -->

For recommendations about reliable production workloads in Azure NetApp Files, see:

- [Use availability zone volume placement for application high availability with Azure NetApp Files](../azure-netapp-files/use-availability-zones.md)
- [Understand cross-zone replication](../azure-netapp-files/cross-zone-replication-introduction.md)
- [Understand cross-region replication in Azure NetApp Files](../azure-netapp-files/cross-region-replication-introduction.md)

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

<!-- I've rewritten this slightly to frame it as "transient faults can occur for several reasons, including planned maintenance. Here's how you should handle transient faults (whatever their reason)." Please confirm this is still accurate. -->

In addition to transient fault types that can affect any cloud-based solution, Azure NetApp Files undergoes occasional planned maintenance, including platform updates, service updates, and software upgrades.

From a file protocol (NFS/SMB) perspective, transient faults are nondisruptive if the application can handle the I/O pauses that might briefly occur during these events. The I/O pauses are typically short, ranging from a few seconds up to 30 seconds.

The NFS protocol is especially robust, and client-server file operations continue normally. Some applications might require tuning to handle I/O pauses for as long as 30-45 seconds. As such, ensure that you're aware of the application’s resiliency settings to cope with the storage service maintenance events.

For human-interactive applications leveraging the SMB protocol, the standard protocol settings are usually sufficient. Azure NetApp Files also supports [SMB continuous availability](../azure-netapp-files/azure-netapp-files-create-volumes-smb.md#continuous-availability), which enables SMB Transparent Failover to eliminate disruptions as a result of service maintenance events and improves reliability and user experience. SMB continuous availability is only available for [specific applications](../azure-netapp-files/faq-application-resilience.md#do-i-need-to-take-special-precautions-for-smb-based-applications).

For further recommendations, see [Azure NetApp Files application resilience FAQs](../azure-netapp-files/faq-application-resilience.md).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)] 

Azure NetApp Files supports *zonal* deployments of volumes. [Azure NetApp Files' availability zone volume placement feature](../azure-netapp-files/use-availability-zones.md) lets you deploy each volume in a single availability zone of your choice, as long as Azure NetApp Files is present in that availability zone and has sufficient capacity. If you have latency-sensitive applications, you can deploy a volume to the same availability zone as your Azure compute resources and other services in the same zone.

A single-zone deployment isn't sufficient to meet high reliability requirements. You can use [cross-zone replication](../azure-netapp-files/cross-zone-replication-introduction.md) to asynchronously replicate data between volumes in different availability zones. You must configure cross-zone replication separately from availability zone volume placement.

If an availability zone fails, you're responsible for detecting the failure and switching to an alternative volume in a different zone.

For more information, see [Manage availability zone volume placement in Azure NetApp Files](../azure-netapp-files/manage-availability-zone-volume-placement.md). <!-- TODO can we fold any of the content in that article into this one? -->

### Region support 

Cross-zone replication is available in all [availability zone-enabled regions](availability-zones-region-support.md) with [Azure NetApp Files presence](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=netapp&regions=all&rar=true).

###  Considerations 

* Availability zone volume placement in Azure NetApp Files provides zonal volume placement, with latency within the zonal latency envelopes. It doesn't provide proximity placement towards compute. As such, it doesn't provide a lowest latency guarantee. <!-- TODO checking what this means -->
* For other considerations related to availability zones in Azure NetApp Files, see see [Requirements and considerations for using cross-zone replication](../azure-netapp-files/cross-zone-replication-requirements-considerations.md) and [Manage availability zone volume placement](../azure-netapp-files/manage-availability-zone-volume-placement.md#requirements-and-considerations).

### Cost

There's no extra charge to enable availability zone support in Azure NetApp Files. You only pay for the capacity pools and resources you deploy within these zones.

### Configure availability zone support

You need to separately configure volume placement and cross-zone replication.

- **Volume placement:**

    - **Create a new volume or configure an existing volume with availability zone support.** * You can configure availability zone support for new and existing volumes in Azure NetApp Files. To configure availability zones for volumes in Azure NetApp Files, see [Manage availability zone volume placement for Azure NetApp Files](../azure-netapp-files/manage-availability-zone-volume-placement.md).

        If you're deploying Terraform-managed volumes with availability zones, other configurations are required. For more information, see [Populate availability zone for Terraform-managed volumes](../azure-netapp-files/manage-availability-zone-volume-placement.md#populate-availability-zone-for-terraform-managed-volumes).

        If you're using role-based access control, [ensure you configure the correct permissions](../azure-netapp-files/manage-availability-zone-volume-placement.md#configure-custom-rbac-roles).
    
    - **Migrate a volume between availability zones:** After a volume is configured to be placed into an availability zone, the specified availability zone can’t be modified. Volumes can't be moved between availability zones.

    - **Disable availability zone support for a volume.** After a volume is configured to be placed into an availability zone, you can't disable the availability zone support.

- **Cross-zone replication:**

    - **Enable cross-zone replication:** To improve the resiliency of your solution, [configure cross-zone replication to another volume](../azure-netapp-files/create-cross-zone-replication.md).

    - **Disable cross-zone replication:** <!-- Can it be disabled? -->

### Normal operations

This section describes what to expect when Azure NetApps Files volumes are configured to be deployed into multiple availability zones, cross-zone replication is enabled, and all availability zones are operational.

- **Traffic routing between zones:** Incoming requests are routed to the specific volume, which is located in the availabilty zone you selected.

- **Data replication between zones:** Azure NetApp Files cross-zone replication means that all changes to the source volume are asynchronously replicated to destination volumes. 

### Zone-down experience

This section describes what to expect when Azure NetApps Files volumes are configured to be deployed into multiple availability zones, cross-zone replication is enabled, and there's an availability zone outage.

* **Detection and response:** Azure NetApp Files provides proactive monitoring and diagnostics through integrated tools including Azure Monitor. Any anomalies indicating a zone-down scenario are detected via real-time metrics such as IOPS, latency, and capacity usage. Alerts and notifications can be configured to be sent to administrators, enabling immediate response actions such as rebalancing file shares or initiating disaster recovery protocols.

* **Notification:** Notifications of zone-down events are automatically sent through Azure Service Health or custom-configured alert systems such as email, SMS, or webhook integrations. Administrators can also use Azure Resource Health to check the status of Azure NetApp Files and receive updates on recovery progress. 

* **Active requests:** During a zone-down event, active requests can experience disruptions or increased latencies. Azure NetApp Files ensures that data remains accessible through redundancy mechanisms, such as cross-zone replication (if configured). Requests are rerouted to alternative zones to mitigate downtime for mission-critical workloads. 

* **Expected data loss:** Azure NetApp Files is built with enterprise-grade features including snapshot capabilities and high availability replication. In most scenarios, data loss is minimal to nonexistent due to the automatic replication of data across zones. Regular backups and snapshots further ensure data integrity and recovery. 

* **Expected downtime:** Downtime duration largely depends on the severity of the zone-down event and the failover configuration in place. Azure NetApp Files facilitates rapid failover to alternate zones or regions, minimizing downtime, which typically lasts a few minutes to an hour for well-prepared configurations. 

* **Traffic rerouting:** Traffic rerouting during a zone-down experience occurs through Azure's load balancers and Azure NetApp Files' built-in replication mechanisms. Data and application traffic are redirected to operational zones seamlessly, ensuring continuity of service. Setting up cross-region replication is recommended to optimize rerouting efficiency. 

### Failback

Failback is a manual process. For more information, see [Manage disaster recovery using Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md)

### Testing for zone failures  

To test your cross-zone replication configuration, see [Test disaster recovery for Azure NetApp Files](../azure-netapp-files/test-disaster-recovery.md).

## Multi-region support

Azure NetApp Files provides data protection through cross-region volume replication. You can asynchronously replicate data from an Azure NetApp Files volume (source) in one region to another Azure NetApp Files volume (destination) in another region. This capability enables you to fail over your critical application if a region-wide outage or disaster happens. To learn more, see:

- [Cross-region replication of Azure NetApp Files volumes](../azure-netapp-files/cross-region-replication-introduction.md)
- [Supported regions for cross-region replication](../azure-netapp-files/cross-region-replication-introduction.md#supported-region-pairs)
- [Requirements and considerations for using cross-region replication in Azure NetApp Files](../azure-netapp-files/cross-region-replication-requirements-considerations.md)
- [Create volume replication for Azure NetApp Files](../azure-netapp-files/cross-region-replication-create-peering.md)
- [Display health and monitor status of replication relationship](../azure-netapp-files/cross-region-replication-display-health-status.md)

### Failback

Both failover and failback are manual processes in Azure NetApp Files cross-region replication. For more information including how to manage these processes, see [Manage disaster recovery using Azure NetApp Files](../azure-netapp-files/cross-region-replication-manage-disaster-recovery.md).

It's also recommended you [set alert rules to monitor replication status](../azure-netapp-files/cross-region-replication-display-health-status.md#set-alert-rules-to-monitor-replication).

### Testing for region failures  

To test your cross-region replication configuration, see [Test disaster recovery for Azure NetApp Files](../azure-netapp-files/test-disaster-recovery.md).

## Backups

[Azure NetApp Files backup](../azure-netapp-files/backup-introduction.md) expands the data protection capabilities of Azure NetApp Files by providing a fully managed backup solution for long-term recovery, archive, and compliance. Backups created by the service are stored in Azure storage, independent of volume snapshots that are available for near-term recovery or cloning. Backups taken by the service can be restored to new Azure NetApp Files volumes within the region. Azure NetApp Files backup supports both policy-based (scheduled) backups and manual (on-demand) backups. 

For further security, Azure NetApp Files [snapshots](../azure-netapp-files/data-protection-disaster-recovery-options.md#snapshots) add stability, scalability, and fast recoverability without affecting performance. They provide the foundation for other redundancy solutions, including backup, cross-region replication, and cross-zone replication.

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [What are redundancy, replication, and backup?](concept-redundancy-replication-backup.md).

## Service-level agreement

The service-level agreement (SLA) for Azure NetApp Files describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. For more information, see [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

- [Architecture best practices for Azure NetApp Files](/azure/well-architected/service-guides/azure-netapp-files)
- [Use availability zone volume placement for application high availability with Azure NetApp Files](../azure-netapp-files/use-availability-zones.md)
- [Manage availability zone volume placement for Azure NetApp Files](../azure-netapp-files/manage-availability-zone-volume-placement.md)
- [Create cross-zone replication relationships for Azure NetApp Files](../azure-netapp-files/create-cross-zone-replication.md).
- [Cross-region replication of Azure NetApp Files volumes](../azure-netapp-files/cross-region-replication-introduction.md)
- [Supported regions for cross-region replication](../azure-netapp-files/cross-region-replication-introduction.md#supported-region-pairs)
- [Requirements and considerations for using cross-region replication in Azure NetApp Files](../azure-netapp-files/cross-region-replication-requirements-considerations.md)
- [Create volume replication for Azure NetApp Files](../azure-netapp-files/cross-region-replication-create-peering.md)
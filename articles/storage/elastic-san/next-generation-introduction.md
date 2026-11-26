---
title: Introduction to Azure Elastic SAN Next Generation Preview
description: Learn how Azure Elastic SAN Next Generation provides flexible performance, capacity pooling, and storage management for enterprise workloads.
author: normesta
ms.service: azure-elastic-san
ms.topic: overview
ms.date: 09/15/2026
ms.author: normesta
# Customer intent: "As a cloud architect, I want to understand Azure Elastic SAN Next Generation so that I can evaluate it for enterprise-scale workloads."
---

# What is Azure Elastic SAN Next Generation Preview?

Azure Elastic SAN Next Generation is a cloud-native storage area network (SAN) that delivers massively scalable, cost-efficient, high-performance, and reliable block storage for enterprise-scale and cloud-native workloads. It builds on the existing Azure Elastic SAN resource hierarchy, retaining dynamic performance sharing and simplified storage management while adding:

- **Performance for mission-critical workloads:** Two new quality of service (QoS) tiers, Business Critical and General Purpose, provide higher-performance volumes with sub-millisecond latency. QoS also protects critical workloads from noisy neighbors within the SAN.
- **Lower total cost of ownership (TCO):** Capacity, IOPS, and throughput are provisioned independently at the SAN level and shared dynamically across the volumes, reducing stranded resources and improving resource utilization across workloads. Thin provisioning lets you pay for the capacity you use rather than the capacity you provision. Autoscaling automatically expands your SAN as workload demand grows, further simplifying storage management.

> [!IMPORTANT]
> Azure Elastic SAN Next Generation is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Benefits of Azure Elastic SAN Next Generation

### Independent resource provisioning

You provision capacity, IOPS, and throughput independently at the SAN level. These resources are dynamically shared across the volumes within the SAN. This model lets you size capacity and performance separately while improving resource utilization across workloads.

### Thin provisioning

Thin provisioning lets you provision logical volume capacity beyond the SAN's provisioned capacity. The combined provisioned size of all volumes can be up to five times the SAN's provisioned capacity. This allows you to accommodate workload growth without allocating all the physical capacity upfront, reducing capacity overprovisioning and improving storage utilization.

### Autoscaling

Autoscaling automatically increases SAN capacity as storage needs grow. This feature reduces the need to monitor and expand capacity manually and simplifies storage management as workloads scale.

### QoS tiers and noisy-neighbor protection

When you create a volume group, assign a quality of service (QoS) tier based on your workload's performance requirements:

- **Business Critical** is for latency-sensitive and mission-critical workloads that use direct-attach connectivity. Volume groups can reserve a minimum performance target.
- **General Purpose** is for workloads that use the shared SAN performance pool. Volume groups support direct-attach or iSCSI connectivity.

QoS protects Business Critical volume groups from noisy neighbors within the SAN.

### Connectivity protocols

Elastic SAN Next Generation supports the following connection types, depending on the volume group's QoS tier:

- **Direct Attach:** Available for Business Critical and General Purpose volume groups. This connection type uses host attach to connect volumes to Azure virtual machines.
- **iSCSI:** Available for General Purpose volume groups. This connection type supports virtual network access controls, service endpoints, and private endpoints.

### Business continuity and disaster recovery

Snapshots provide point-in-time backup and recovery options to protect your workload data. Snapshots are incremental, reducing the amount of storage consumed by a series of snapshots.

When you create a snapshot, you can immediately use it to create a new volume while the service copies its data to lower-cost durable storage in the background. After the copy finishes, the snapshot's lifecycle is independent of the source volume. Snapshots are billed separately from the SAN's provisioned capacity and at a lower rate.

### Support for modernization scenarios

Azure Elastic SAN Next Generation supports both on-premises SAN migrations and cloud-native storage consolidations for enterprise customers that benefit from advanced storage capabilities, shared resources, and centralized management. Its connectivity options let you select the appropriate storage connection for supported compute platforms.

## Azure Elastic SAN Next Generation resources

Azure Elastic SAN Next Generation uses the same core resource hierarchy as Azure Elastic SAN, enabling centralized management of storage resources at scale. Workloads provision resources at the SAN level and share them dynamically across associated volumes, which helps improve utilization and simplify administration.

The following diagram illustrates the relationship and mapping of Azure Elastic SAN resources to the resources of an on-premises SAN:

:::image type="content" source="media/elastic-san-introduction/elastic-san-resource-relationship-diagram.png" alt-text="Diagram that maps an Elastic SAN, its volume groups, and its volumes to the equivalent resources in an on-premises SAN.":::

### Elastic SAN

An Elastic SAN is the top-level storage resource. It provides the shared capacity and performance foundation for all volume groups and volumes within the SAN. You provision capacity, IOPS, and throughput independently at the SAN level and share them across its volumes.

### Volume groups

Use volume groups as management containers to organize and manage volumes at scale. Each volume group must be assigned a QoS tier that defines how performance is managed for its volumes. Set the connectivity option for general purpose volume groups to direct attach or iSCSI. Apply configuration settings, policies, QoS behavior, and connectivity at the volume group level.

> [!NOTE]
> Use one volume group per workload. Applying settings and policies at the volume group level ensures consistent behavior across all volumes used by that workload.

### Volumes

Volumes are logical storage units you create within a volume group. Each volume inherits its volume group's QoS behavior and connectivity setting. For general purpose volumes, the connectivity option affects both the IOPS and bandwidth ceilings. The SAN-level performance pool and concurrent demand determine how much performance is available.

Applications and compute resources connect to volumes to store and access data.

## Support for Azure Storage features

The following table shows Azure Storage feature support for Azure Elastic SAN Next Generation Preview. Support might change during the preview.

| Feature | Business Critical (Direct Attach) | General Purpose (Direct Attach) | General Purpose (iSCSI) |
|---|---|---|---|
| Locally redundant storage (LRS) | Supported | Supported | Supported |
| Zone-redundant storage (ZRS) | Not currently supported | Not currently supported | Not currently supported |
| Quality of service (QoS) | Supported | Supported | Supported |
| Thin provisioning (overprovisioning) | Supported | Supported | Supported |
| Space reclamation (TRIM / UNMAP) | Not currently supported | Not currently supported | Not currently supported |
| SAN autoscaling (scale up) | Supported | Supported | Supported |
| SAN resize | Supported | Supported | Supported |
| Volume live resize (scale up) | Not currently supported | Not currently supported | Supported |
| Shared volumes | Not currently supported | Not currently supported | Supported |
| Snapshots | Supported | Supported | Supported |
| Encryption at rest (PMK) | Supported | Supported | Supported |
| Encryption at host (PMK) | Supported | Supported | Not applicable |
| Encryption in transit | Not applicable | Not applicable | Not currently supported |
| Private endpoints | Not required | Not required | Supported |
| Virtual network access controls | Not required | Not required | Supported |
| Service endpoints | Not required | Not required | Supported |

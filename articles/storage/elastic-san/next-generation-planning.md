---
title: Plan for an Azure Elastic SAN Next Generation deployment
description: Plan capacity, performance, QoS tiers, connectivity, resiliency, and data protection for Azure Elastic SAN Next Generation Preview.
author: normesta
ms.service: azure-elastic-san
ms.topic: concept-article
ms.date: 09/11/2026
ms.author: normesta
# Customer intent: "As a cloud architect, I want to plan an Azure Elastic SAN Next Generation deployment so that it meets my workloads' capacity, performance, connectivity, and resiliency requirements."
---

# Plan for an Azure Elastic SAN Next Generation deployment

Azure Elastic SAN Next Generation is a cloud-native storage area network (SAN) service. It separates capacity and performance provisioning and introduces quality of service (QoS) tiers, thin provisioning, and capacity pooling. These capabilities help you consolidate Business Critical and general-purpose workloads in one SAN while maintaining predictable performance and improving resource utilization.

> [!IMPORTANT]
> Azure Elastic SAN Next Generation is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Use this article to plan your deployment before creating resources. First identify your workload requirements and plan the volume groups and volumes. Use those requirements to size the SAN. When you deploy, create the SAN first, then its volume groups, and finally the volumes.

## 1. Inventory your workloads

Start with the workloads that use the SAN. For each workload, collect the following requirements:

| Requirement | Information to collect |
| --- | --- |
| Capacity | Current written data, expected growth, logical volume sizes, and snapshot consumption. |
| Performance | Typical and peak IOPS, throughput, latency, and the times when peaks occur. |
| Connectivity | Compute platform and whether the workload requires direct-attach or Internet Small Computer Systems Interface (iSCSI) connectivity. |
| Isolation | Network, access, and management boundaries. |
| Resiliency | Redundancy, recovery point, and recovery time requirements. |
| Operations | Capacity alerts and performance monitoring. |

Measure existing workloads when possible instead of relying only on estimates. Record both average and peak demand so that you can account for workloads that peak at the same time.

## 2. Design volume groups around workloads

A volume group is the management and quality of service (QoS) boundary for its volumes. Design each volume group for a specific workload so that you can manage its performance, connectivity, access, and recovery requirements independently.

Use one volume group per workload. Plan the following settings for each volume group:

- QoS tier and performance expectations.
- Connectivity method and compute platform. General Purpose volume groups can use direct-attach or iSCSI connectivity.
- Network and access controls.
- Recovery requirements.

This approach limits the effect of future configuration changes and makes it easier to monitor, troubleshoot, and manage each workload.

### Choose a QoS tier

Select the QoS tier you plan to use for each volume group based on the workload inventory. The QoS tier defines how performance is managed for all volumes in the volume group. For General Purpose volume groups, also choose direct-attach or iSCSI connectivity. The QoS tier and connectivity option set the maximum performance available to each volume, while SAN-level provisioning and demand from other volumes affect the performance available at a given time.

The following volume performance limits apply during public preview:

| QoS tier | Connectivity | Workload fit | Maximum volume IOPS | Maximum volume throughput | Indicative latency |
| --- | --- | --- | ---: | ---: | ---: |
| Business Critical | Direct attach | SAP HANA, Epic, and I/O-intensive online transaction processing (OLTP) | 400,000 | 10,000 MB/s | 200-300 microseconds |
| General Purpose | Direct attach | Mid-tier SQL, Oracle, and OLTP | 80,000 | 2,000 MB/s | 800 microseconds or less |
| General Purpose | iSCSI | Bare metal, Azure VMware Solution, and traditional SAN migration | 80,000 | 1,280 MB/s | 1-2 milliseconds |

Volume performance scales with provisioned volume size, subject to the maximum volume limits above. The following scaling factors apply during public preview:

| QoS tier | Connectivity | IOPS scaling factor | Throughput scaling factor |
| --- | --- | ---: | ---: |
| Business Critical | Direct attach | 1,000 IOPS/GiB | 250 MB/s/GiB |
| General Purpose | Direct attach | 500 IOPS/GiB | 125 MB/s/GiB |
| General Purpose | iSCSI | 750 IOPS/GiB | 60 MB/s/GiB |

After you set a volume group's QoS tier, you can't currently change it. Choose a tier based on the workload's expected performance requirements, and choose a supported connectivity option for its compute platform.

### Choose how workloads use shared performance

Business Critical volume groups reserve a minimum performance target, while general-purpose volume groups use performance from the shared SAN pool. Choose a performance approach for each workload:

| Approach | When to use | Effect on the SAN design |
| --- | --- | --- |
| Reserve at peak | A Business Critical workload must receive its full peak requirement without depending on the shared pool. | Include the full reserved peak plus expected shared demand in the SAN performance total. |
| Reserve at average | A Business Critical workload can reserve a baseline and draw additional performance from the pool when available. | Evaluate concurrent peaks and add enough SAN-level headroom. |
| Shared pool | General-purpose workloads can share available performance. | Use the aggregate demand for workloads that peak at the same time. |

**Example: Plan reserved and shared performance**

Suppose a Business Critical database requires 40,000 IOPS on average and 100,000 IOPS at peak. General Purpose workloads in the same SAN require a combined 60,000 IOPS during that peak period.

- **Reserve at peak:** Reserve 100,000 IOPS for the Business Critical volume group. Plan SAN performance for at least 160,000 IOPS to accommodate that reservation and the concurrent General Purpose demand, before adding headroom.
- **Reserve at average:** Reserve 40,000 IOPS for the Business Critical volume group. Its additional 60,000 IOPS at peak depends on available shared performance. If both workloads must reach their expected demand simultaneously, still plan for at least 160,000 SAN IOPS, before adding headroom.

Reserving at average provides a lower reserved baseline; it doesn't guarantee the workload's peak performance. Apply the same planning approach to throughput, and ensure that volume sizes and tier limits support the required performance.

### Plan volume sizes

Determine the number and sizes of volumes each workload needs within its volume group. All QoS tiers support volume sizes up to 64 TiB with 1-GiB provisioning granularity. The QoS tier and connectivity option set each volume's performance ceiling. The SAN-level pool and concurrent demand determine how much performance is available across all volumes.

You can increase a volume's size after deployment. Decreasing a volume's size isn't currently supported, so use the workload's logical capacity requirement as the starting size and rely on thin provisioning for physical capacity efficiency.

## 3. Size SAN capacity and performance

After you design the volume groups, combine their requirements to size the SAN. You provision capacity, IOPS, and throughput independently at the SAN level, and the volume groups share those resources.

| SAN resource | Public preview scale target |
| --- | ---: |
| Maximum SAN capacity | 1 PiB |
| Maximum SAN IOPS | 4,000,000 IOPS |
| Maximum SAN throughput | 160,000 MB/s (160 GB/s) |
| Capacity provisioning granularity | 1 GiB |

Use the following calculations as the starting point for your design:

- **Capacity:** Add the current written data for all workloads, snapshot consumption, expected growth, and an operational buffer.
- **IOPS:** Add reserved performance and the expected concurrent demand from workloads that use the shared pool.
- **Throughput:** Add reserved throughput and the expected concurrent demand from workloads that use the shared pool.

The combined IOPS and throughput used by all volumes can't exceed the performance provisioned for the SAN. Leave enough headroom for growth and overlapping workload peaks.

## 4. Plan capacity growth

Logical volume capacity can be up to **five times the SAN's provisioned capacity**. For example, a 100-TiB SAN can support volumes totaling up to 500 TiB of logical capacity.

This capacity doesn't provide 500 TiB of physical storage. Capacity is consumed as you write data, so monitor actual usage and expand the SAN before it exhausts its provisioned capacity.

Configure autoscaling by choosing the following values:

- The minimum free-capacity threshold that triggers scaling.
- The amount of capacity added during each scale operation.
- The maximum SAN capacity allowed by the policy.

Autoscaling only increases SAN capacity. Decreasing SAN capacity isn't currently supported.

## 5. Design connectivity and network isolation

Business Critical volume groups use direct-attach connectivity. General Purpose volume groups can use either direct-attach or iSCSI connectivity. Use iSCSI for Azure VMware Solution, bare-metal, and traditional SAN migration scenarios that require the protocol, or for Azure VMs that can benefit from iSCSI. For example, an Azure VM can use its available network bandwidth to achieve higher storage throughput without upgrading the VM.

Make the following decisions for each workload-specific volume group:

| Design decision | Guidance |
| --- | --- |
| Compute platform | Choose a QoS tier and connectivity option that support the workload's compute platform. |
| Protocol | Choose iSCSI connectivity for a General Purpose volume group when the client requires iSCSI. Business Critical volume groups support only direct attach. |
| Network isolation | For a General Purpose volume group that uses iSCSI, choose virtual network access controls, service endpoints, or private endpoints. |
| Access boundary | Use one volume group per workload to manage connectivity and access independently. |

## 6. Plan resiliency, security, and data protection

Use your workload inventory to decide whether the available resiliency and protection capabilities meet each workload's requirements.

### Redundancy

Azure Elastic SAN Next Generation Preview supports locally redundant storage (LRS). With LRS, data is copied synchronously three times within a single physical location in the primary region. LRS protects your data against server rack and drive failures. Zone-redundant storage isn't currently supported.

### Encryption

For General Purpose volume groups that use iSCSI, Azure Storage service encryption encrypts data at rest. Choose platform-managed keys or customer-managed keys for these volume groups. Encryption at rest with customer-managed keys isn't currently supported for Business Critical or General Purpose volume groups that use direct attach.

Encryption in transit isn't currently supported for General Purpose volume groups that use iSCSI. Business Critical and General Purpose volume groups that use direct attach support hardware-based encryption (HBE) with platform-managed keys (PMK). Include these tier-specific capabilities and limitations in your security review.

### Snapshots and recovery

Choose a snapshot frequency and retention period based on each workload's recovery objectives. Azure Elastic SAN Next Generation snapshots are incremental: the first snapshot stores the volume's used data, and subsequent snapshots store changes since the previous snapshot. Coordinate application writes before taking snapshots when you need file-system or application consistency.

Snapshots provide instant access for five hours while Azure copies the data to durable storage in the background. Until the background copy finishes, the snapshot depends on its source volume. Plan recovery procedures around this dependency because you can't create a volume from the snapshot after the instant-access period expires until the background copy finishes. You restore snapshot data by creating a new volume; you can't overwrite an existing volume.

Include snapshot usage in the capacity and cost design. Azure stores the durable snapshots in a lower-cost storage, and bills those snapshots separately from your Elastic SAN's provisioned capacity and at a lower rate. Azure bills snapshots based on the used capacity.

You can export a snapshot to a managed disk snapshot when you need to retain its data outside the Elastic SAN.


## 7. Plan the migration

Choose a destination QoS tier for each workload based on its latency, throughput, compute platform, connectivity, and recovery requirements.

| Migration scenario | Recommended QoS tier | Connectivity |
| --- | --- | --- |
| Business Critical database or top-tier SAN workload | Business Critical | Direct attach |
| General-purpose enterprise database | General Purpose | Direct attach |
| Azure VMware Solution, bare metal, or iSCSI-dependent workload | General Purpose | iSCSI |

Before you migrate:

- Benchmark the source environment.
- Record aggregate and per-workload performance peaks.
- Identify latency-sensitive write paths.
- Test the application with the selected QoS tier.
- Test the snapshot and recovery process.
- Include migration capacity and temporary overlap in the SAN capacity design.

## 8. Plan monitoring and operations

Decide which metrics to monitor, including actual capacity consumption, provisioned volume size, snapshot growth, transactions, ingress, and egress.

Set capacity alerts early enough to investigate unexpected growth before the SAN exhausts its available capacity. Regularly compare actual workload peaks with the SAN's provisioned IOPS and throughput. Review volume-group boundaries and SAN sizing when you add a workload or when an existing workload's requirements change.

## iSCSI support

General Purpose volume groups that use iSCSI support the following commands:

- TEST UNIT READY
- REQUEST SENSE
- INQUIRY
- REPORT LUNS
- MODE SENSE
- READ CAPACITY (10)
- READ CAPACITY (16)
- READ (6)
- READ (10)
- READ (16)
- WRITE (6)
- WRITE (10)
- WRITE (16)
- WRITE VERIFY (10)
- WRITE VERIFY (16)
- VERIFY (10)
- VERIFY (16)
- SYNCHRONIZE CACHE (10)
- SYNCHRONIZE CACHE (16)
- RESERVE
- RELEASE
- PERSISTENT RESERVE IN
- PERSISTENT RESERVE OUT

The following iSCSI features aren't currently supported:

- CHAP authorization
- Initiator registration
- iSCSI Error Recovery Levels 1 and 2
- ESXi iSCSI flow control
- More than one LUN per iSCSI target

## Deployment order

After completing your design, deploy resources in this order: create the SAN with the planned capacity and performance, create its volume groups, and then create the volumes.

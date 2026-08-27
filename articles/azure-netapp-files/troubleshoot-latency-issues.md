---
title: Troubleshoot latency issues on Azure NetApp Files volumes
description: Learn how to isolate and resolve latency issues on Azure NetApp Files volumes.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: troubleshooting
ms.date: 08/05/2026
ms.author: anfdocs
# Customer intent: "As an Azure NetApp Files administrator, I want to troubleshoot volume latency, so that I can identify the cause and restore expected performance."
---

# Troubleshoot latency issues on Azure NetApp Files volumes

Elevated latency in Azure NetApp Files can occur because of throughput limits, cool-tier data retrieval, or factors outside the storage service, such as client, network, or application configuration. This article provides a step-by-step workflow to help you isolate the cause of latency and identify appropriate remediation actions.

## Symptoms and troubleshooting flow

Elevated latency on an Azure NetApp Files volume typically falls into one of three categories. Work through each branch in order. Start with throughput throttling because it's the most common cause of unexpected latency.

| Step | Check | Primary signal | Likely action |
|-|-|-|-|
| 1 | Throughput throttling | **Throughput limit reached** is nonzero during the latency window. | Increase the quota, assigned throughput, or service level. |
| 2 | Cool-tier reads | **Volume cool tier data read size** is elevated during the latency window. | Adjust the coolness period or retrieval policy, or pre-warm data. |
| 3 | Client and network factors | Latency remains high after storage-layer checks are ruled out. | Validate availability zone alignment, routing path, VM networking, client version, and mount options. |

## Throughput throttling

Throughput throttling is the most common cause of unexpected latency. A typical symptom is that latency rises when the workload is busy and returns to normal when the load decreases.

### Check for throughput throttling

1. Open Azure Monitor for the volume.
1. Review the [**Throughput limit reached** metric](azure-netapp-files-metrics.md#volumes).
1. Compare the metric with the time window when latency was high. If the metric has any nonzero values during that time, throughput throttling is the likely cause.

### Cause

Every Azure NetApp Files volume has a throughput ceiling. For an auto-QoS volume, the ceiling is determined by the service level multiplied by the volume quota.

| Service level | Throughput per TiB |
|-|-|
| Standard | 16 MiB/s per TiB |
| Premium | 64 MiB/s per TiB |
| Ultra | 128 MiB/s per TiB |
| Flexible | 0-640 MiB/s per TiB (128 MiB/s minimum) |

When combined read and write throughput reaches the ceiling, the system queues additional I/O operations. Queued I/O increases latency. This behavior indicates that the quality of service (QoS) limit is being enforced; it doesn't necessarily indicate a storage fault.

### Resolution

* **Auto-QoS:** Increase the volume quota. Throughput scales linearly, so doubling the quota doubles the throughput limit. You can set the quota higher than the actual data size. Billing is based on capacity pool allocation, not per-volume used capacity.
* **Manual-QoS:** Increase the assigned throughput directly on the volume.
* **Service-level upgrade:** Move the volume to a higher service level to get more throughput per TiB.

### Why does increasing application concurrency increase latency after a volume reaches its QoS throughput limit?

If a volume is operating at its QoS throughput limit, latency can continue to increase even though throughput remains relatively unchanged.

When a volume reaches its allocated throughput limit, it can't service additional I/O requests any faster because it has reached its throughput ceiling. As workload demand continues to increase, the system begins queuing incoming I/O requests. This queuing increases latency, even though throughput remains constrained by the QoS allocation.

A common misconception is that increasing application concurrency, such as increasing thread counts, job counts, or outstanding I/O requests, increases throughput after the QoS limit is reached. In practice, once the volume is operating at its maximum throughput allocation, increasing concurrency doesn't increase throughput. Instead, it further increases latency.

The following behavior is expected when a workload reaches a volume's QoS throughput limit:

* Throughput increases as workload demand increases until the QoS limit is reached.
* After the QoS limit is reached, throughput remains relatively constant.
* Additional concurrency primarily increases latency rather than throughput.

If your workload is consistently operating at or near the volume's QoS limit, consider one or more of the following actions:

* Increase the service level or throughput allocation.
* Use Flexible Service Level to increase throughput independently of capacity, where applicable.
* Reduce unnecessary application concurrency if the workload is already saturating the volume.

Increased latency in conjunction with throughput at or near the volume's QoS limit doesn't necessarily indicate a storage service issue. In many cases, this behavior is the expected result of the workload demanding more throughput than has been allocated to the volume.

## Cool-tier reads

Use this branch when cool access is enabled. A typical symptom is read-latency spikes, especially when accessing data that isn't recently used. Write latency isn't affected.

### Check for cool-tier reads

1. Open Azure Monitor for the volume.
1. Review the [**Volume cool tier data read size** metric](azure-netapp-files-metrics.md#cool-access-metrics).
1. Compare the metric with the time window when latency was high. If the metric is elevated during that time, the system is retrieving data from the cool tier.

### Cause

When you enable cool access, the system moves data that you didn't access during the coolness period to a lower-cost Azure storage tier. The default coolness period is 31 days. When you read that data again, the system retrieves it from cool storage.

| Access type | Typical latency |
|-|-|
| Hot-tier reads | Less than 1 ms |
| Cool-tier reads | 10-50 ms |
| Cool-tier reads under high concurrency | Up to 100 ms |

Cool access trades read performance for cost savings. A latency range of 10-50 ms for cool-tier reads is expected. If latency consistently exceeds 100 ms for cool-tier reads, open a support ticket.

### Resolution

* **Increase the coolness period:** You can configure the coolness period from 2 through 183 days. A longer period keeps recently used data in the hot tier longer.
* **Retain read data in the hot tier:** Configure the retrieval policy to On-Read so that both sequential and random reads rehydrate data from the cool tier to the hot tier.
* **Review the retrieval policy:** Review the **Cool Access Retrieval Policy** setting on the volume.

> [!IMPORTANT]
> Large sequential reads, such as antivirus scans or indexing, don't automatically warm data back to the hot tier unless the retrieval policy is configured to do so.

## Client and network factors

Use this branch if the previous checks don't apply. For example, use it if the throughput limit isn't reached, cool access isn't enabled, or cool-tier reads aren't elevated during the latency window.

Typical symptoms include latency that's high regardless of I/O load, affects only specific clients, or affects specific operation types such as small-file operations, metadata-heavy operations, or permission changes.

| Area | What to check | How to check | Recommended action |
|-|-|-|-|
| Availability Zone alignment | Confirm that VMs and the Azure NetApp Files volume are in the same Availability Zone. Cross-zone traffic can add about 1-2 ms per operation; cross-region traffic can add 10-100+ ms. | Compare the **Availability Zone** value in the VM properties and volume properties. | Use [availability zone volume placement](manage-availability-zone-volume-placement.md) to align compute and storage in the same Availability Zone. |
| Firewall or network virtual appliance (NVA) in the path | Check whether Azure Firewall, a third-party NVA, or another inline network appliance is between the VM subnet and Azure NetApp Files delegated subnet. | Review virtual network route tables and network security group flow logs for the Azure NetApp Files subnet. | Use virtual network peering or direct routing so storage traffic doesn't traverse the firewall or NVA. |
| Accelerated Networking | Confirm that Accelerated Networking is enabled on VMs that access Azure NetApp Files volumes. | In the VM pane, select **Networking**, and check whether **Accelerated networking** is **Enabled**. | Enable Accelerated Networking on all supported VMs that access the volumes. |
| ExpressRoute FastPath | For ExpressRoute-connected clients, check whether FastPath is enabled. | In the ExpressRoute connection pane, check the FastPath status. | Enable [FastPath](../expressroute/about-fastpath.md) on the ExpressRoute connection. |
| SMB small-file operations | Determine whether the workload copies or lists many small files. SMB requires a metadata round trip for each file operation, so small-file copy time can be dominated by metadata overhead. | Compare behavior for many small files with behavior for fewer large files. | Use `robocopy /MT:16` for parallel, multithreaded copy operations. Avoid Windows Explorer for bulk operations. |
| Windows 11, version 24H2 clients | Check whether affected SMB clients are running Windows 11, version 24H2. The issue can appear as slow client-side metadata processing while Azure NetApp Files metrics look normal. | Compare latency from a version 24H2 client with an earlier Windows version accessing the same share. | Roll back to Windows 11, version 23H2 or earlier; use Windows Server for performance-sensitive workloads; and monitor Windows Update for a fix. |
| NFS mount options | Confirm that NFS mount options are optimized. Suboptimal defaults, such as small `rsize` or `wsize` values, or UDP, can increase latency. | Review the active mount options on the client. | Remount with optimized options. Use `hard,rsize=262144,wsize=262144,vers=3,tcp` or `hard,rsize=262144,wsize=262144,vers=4.1,tcp`. |

## When to open a support ticket

Open a support ticket if high latency continues after you confirm all of the following conditions:

* The **Throughput limit reached** metric is zero during the latency window.
* Cool-tier reads aren't elevated during the latency window, or cool access isn't enabled.
* The client and network checklist doesn't identify an issue.

Include the following information in the support ticket:

* Exact UTC timestamps for the latency window.
* The troubleshooting branches that you checked and ruled out.
* Screenshots of throughput, latency, and cool-tier metrics for the same time window.

Providing the time window, branches ruled out, and metric screenshots accelerates the investigation and helps support distinguish storage-layer events from workload, client, and network factors.

## Next steps

* [Troubleshoot Azure NetApp Files using diagnose and solve problems tool](troubleshoot-diagnose-solve-problems.md)
* [General performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md)
* [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
* [Azure NetApp Files storage with cool access](cool-access-introduction.md)
* [Manage Azure NetApp Files storage with cool access](manage-cool-access.md)

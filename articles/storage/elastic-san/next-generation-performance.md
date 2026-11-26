---
title: Learn about Azure Elastic SAN Next Generation and VM performance
description: Learn how performance works in Azure Elastic SAN Next Generation, including independently provisioned IOPS and throughput, volume group QoS tiers, and Business Critical reservations.
author: normesta
ms.service: azure-elastic-san
ms.topic: concept-article
ms.date: 11/05/2026
ms.author: normesta
---

# How performance works when VMs connect to Elastic SAN Next Generation volumes

This article explains how Elastic SAN performance works, and how the combination of Elastic SAN limits and Azure Virtual Machines (VM) limits can affect the performance of your workloads.

For Azure Elastic SAN Next Generation, capacity, IOPS, and throughput are separate provisioning dimensions at the SAN level. Increasing capacity doesn't automatically increase performance, and increasing performance doesn't require increasing capacity.

A Next Generation volume group uses a QoS tier to control how its volumes consume the SAN-level performance pool.

## Elastic SAN and VM performance allocation

Azure VMs have IOPS and throughput limits based on [VM type and size](/azure/virtual-machines/sizes). An Elastic SAN has a pool of performance allocated across its volumes. A workload can be limited by the SAN, its volume group QoS configuration, the volume, the connection path, or the VM and client configuration.

Your application's performance gets throttled when it requests more IOPS or throughput than what is allotted for the VM or attached volumes. When throttled, the application has suboptimal performance, and can experience negative consequences like increased latency. One of the main benefits of an Elastic SAN is its ability to distribute the provisioned IOPS across workloads based on demand. Your SAN's IOPS are shared among all its volumes, so when a workload peaks, it can be handled without throttling or extra cost, provided enough performance is provisioned for the SAN.

### Elastic SAN performance

An Elastic SAN has three primary provisioning dimensions: total capacity, IOPS, and throughput. In Next Generation, you can configure these dimensions independently. This approach differs from Elastic SAN (classic), where purchasing base capacity also determines SAN IOPS and throughput.

### Capacity

In Azure Elastic SAN Next Generation, you can provision SAN capacity independently from SAN IOPS and throughput.

Next Generation volumes are thin provisioned. The combined logical size presented by all volumes can exceed the SAN’s currently provisioned physical capacity by 5x. The system consumes capacity as data is written, and capacity autoscaling can expand the SAN according to the configured policy.

### IOPS

In Next Generation, provision the SAN-level IOPS target directly. Changing SAN capacity doesn't automatically change provisioned IOPS. Provisioned SAN IOPS form the aggregate pool available to volume groups and volumes, subject to QoS reservations and applicable per-volume limits.

### Throughput

In Next Generation, provision the SAN-level throughput target directly. Changing SAN capacity doesn't automatically change provisioned throughput. The SAN-level throughput target is shared across workloads, subject to QoS reservations and applicable per-volume limits.

### Elastic SAN volumes

For Next Generation, the SAN’s provisioned IOPS and throughput, the volume group’s QoS tier, the applicable per-volume target, the connection path, and the compute or client limits govern performance. Don't use the Elastic SAN (classic) capacity-to-performance formulas to size Next Generation volumes.

### Volume group QoS tiers

| Volume group QoS tier | Performance behavior | Connection path | Use when |
|---|---|---|---|
| Business Critical | Reserve a minimum IOPS and throughput target. The volume group can use available shared SAN performance above its reservation. | Direct Attach | The workload requires a protected baseline and predictable performance. |
| General Purpose – Direct Attach | No reserved minimum. Volumes use the unreserved SAN performance pool and remain subject to per-volume and SAN-level limits. | Direct Attach | The workload benefits from efficient shared performance through Direct Attach. |
| General Purpose – iSCSI | No reserved minimum. Volumes use the General Purpose shared-performance model through the iSCSI connection path. | iSCSI | The workload requires iSCSI connectivity. |

### VM limits by QoS tier

The VM limits that apply to a volume depend on the QoS tier of its volume group. Ultra Disk limits for the VM size apply to Business Critical volume groups, and Premium SSD v2 limits for the VM size apply to General Purpose – Direct Attach volume groups. For General Purpose – iSCSI volume groups, VM network bandwidth limits apply, because iSCSI traffic shares VM network bandwidth with other VM traffic.

## How Business Critical reservations and the shared pool work

Business Critical volume groups reserve a minimum IOPS and throughput target from the SAN. That reservation remains protected when the SAN is under contention. General Purpose volume groups don't reserve performance and consume the unreserved SAN performance pool.

A Business Critical reservation is a protected floor, not a ceiling. When the SAN has unreserved performance available, a Business Critical volume group can consume above its reservation, subject to applicable per-volume and SAN-level limits.

The combined IOPS and throughput consumed by all volume groups remain bounded by the performance provisioned for the SAN.

## Example configuration and scenarios

Workloads that share a SAN usually don't all peak at the same time. By consolidating the storage needs of these workloads within a single SAN, you can provision for the aggregate peak of all workloads instead of the sum of their individual peaks.

The following example uses five workloads whose individual peaks add up to 600,000 IOPS, and shows two ways to configure the SAN for them. Each workload runs in its own volume group. The values are for illustration only.

### Scenario 1: Reserve Business Critical workloads at peak

| Workload | QoS tier | Peak IOPS | Reserved IOPS |
|---|---|---:|---:|
| Epic | Business Critical | 200,000 | 200,000 |
| SAP HANA | Business Critical | 150,000 | 150,000 |
| SQL Server | General Purpose | 120,000 | 0 |
| Oracle | General Purpose | 80,000 | 0 |
| App Server | General Purpose | 50,000 | 0 |

The sum of the five individual workload peaks is 600,000 IOPS. In this scenario, the SAN is provisioned for 500,000 IOPS: 350,000 IOPS reserved for the two Business Critical workloads and 150,000 IOPS available to the General Purpose shared pool.

### Scenario 2: Reserve Business Critical workloads at a protected baseline

| Workload | QoS tier | Peak IOPS | Reserved IOPS | Potential shared pool use |
|---|---|---:|---:|---|
| Epic | Business Critical | 200,000 | 80,000 | Up to 120,000 above reservation |
| SAP HANA | Business Critical | 150,000 | 60,000 | Up to 90,000 above reservation |
| SQL Server | General Purpose | 120,000 | 0 | Up to 120,000 |
| Oracle | General Purpose | 80,000 | 0 | Up to 80,000 |
| App Server | General Purpose | 50,000 | 0 | Up to 50,000 |

In this scenario, the SAN is provisioned for 400,000 IOPS. The two Business Critical volume groups reserve a combined 140,000 IOPS, leaving 260,000 IOPS in the shared pool. Their reservations remain protected, while each Business Critical workload can consume above its reservation when shared performance is available. General Purpose workloads also draw from the same shared pool.

In general, set Business Critical reservations to the minimum performance each workload must always have, and provision the SAN for the aggregate peak of all workloads.

## When aggregate demand exceeds provisioned performance

When concurrent demand exceeds an applicable SAN-level IOPS or throughput target:

- Business Critical reservations remain protected.
- Business Critical demand above its reservation, and all General Purpose demand, uses the shared pool, subject to per-volume and SAN-level limits.
- Delivered performance can be throttled while aggregate demand remains above the provisioned SAN target.

## Next steps

- [Best practices for Elastic SAN Next Generation](next-generation-best-practices.md)
- [Networking for Elastic SAN Next Generation](next-generation-networking.md)
- [Elastic SAN Next Generation scale targets](next-generation-scale-targets.md)
- [Elastic SAN Next Generation metrics](next-generation-metrics.md)

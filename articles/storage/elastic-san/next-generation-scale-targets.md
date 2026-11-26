---
title: Scale targets for Azure Elastic SAN Next Generation Preview
description: Learn about capacity, IOPS, throughput, and volume performance targets for Azure Elastic SAN Next Generation.
author: normesta
ms.service: azure-elastic-san
ms.topic: concept-article
ms.date: 11/02/2026
ms.author: normesta
# Customer intent: "As a storage administrator, I want to understand the scalability and performance targets of Elastic SAN Next Generation so that I can plan capacity and performance for my deployment."
---

# Scale targets for Azure Elastic SAN Next Generation Preview

Azure Elastic SAN Next Generation Preview has three main components: the SAN itself, volume groups, and volumes. General purpose workloads can use the capacity-included baseline at no extra performance charge. You can provision extra SAN IOPS and throughput independently of capacity. The provisioned performance is shared across the SAN's volumes. Each volume's performance limits depend on its size, its volume group's QoS tier and connection type, and the performance provisioned for the SAN.

Unlike [Azure Elastic SAN (Classic)](elastic-san-scale-targets.md), Next Generation lets you increase SAN performance above the capacity-included baseline without increasing SAN capacity. Individual volume performance remains subject to size-dependent limits.

> [!IMPORTANT]
> Azure Elastic SAN Next Generation is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Elastic SAN Next Generation scale targets

The SAN is the top-level resource and provides the shared capacity and performance pool for its volume groups and volumes.

The following table shows the LRS limit profiles. Available limits vary by region and subscription. Use the List SKUs API to check the capabilities available to your subscription.

| Resource | Large LRS limit profile | Small LRS limit profile |
| --- | ---: | ---: |
| Minimum SAN capacity | 1 TiB | 1 TiB |
| Maximum SAN capacity | 1,000 TiB | 200 TiB |
| Maximum SAN IOPS | 4,000,000 IOPS | 1,000,000 IOPS |
| Maximum SAN throughput | 160,000 MB/s | 40,000 MB/s |
| Capacity provisioning granularity | 1 TiB | 1 TiB |

The combined IOPS and throughput used by all volumes can't exceed the IOPS and throughput provisioned for the SAN.

### Capacity provisioning

Elastic SAN Next Generation includes a baseline of 2,000 IOPS and 64 MB/s for each provisioned TiB of capacity. General purpose workloads can use the capacity-included baseline at no additional performance charge. For example, 20 TiB of SAN capacity includes 40,000 IOPS and 1,280 MB/s. You can provision additional IOPS and throughput without increasing capacity. When you increase SAN capacity, ensure that provisioned IOPS and throughput meet the baseline included with the new size.

All SAN capacity is thin provisioned, so you consume capacity as you write data to volumes. The combined provisioned size of all volumes can't exceed either five times the SAN's provisioned capacity or the configured autoscale maximum, whichever is lower. For example, a SAN with 20 TiB of provisioned capacity and an autoscale maximum of 100 TiB can host volumes with a combined provisioned size of up to 100 TiB, provided that regional limits support that configuration.

Capacity autoscaling is a built-in feature of Elastic SAN Next Generation. When you create a SAN, you must configure an autoscaling policy that adds capacity before the available capacity is exhausted.

## Volume groups

Volume groups provide the policy and performance management boundary for volumes. By default, an Azure Elastic SAN Next Generation resource supports up to 200 volume groups, and each volume group supports up to 1,000 volumes.

### Volume group QoS tiers

When you create a volume group, select its QoS tier and connection type based on your workload requirements. Business critical volume groups use direct attach. General purpose volume groups use direct attach or iSCSI.

Business critical volume groups can reserve performance for their volumes. Across all Business critical volume groups in a SAN, total reserved IOPS and total reserved throughput can each be up to 80% of their corresponding SAN-level provisioned values. Each group's reserved performance is available only to volumes within that group. General purpose workloads use performance from the shared SAN pool, including the baseline provided with SAN capacity.

## Volumes

By default, a SAN supports up to 20,000 volumes across all its volume groups. You can increase the size of a volume in 1 GiB increments. Live resizing isn't supported for Business critical volumes or General purpose volumes that use Direct attach. Detach these volumes from their VMs before resizing.

A volume's capacity determines its size-based IOPS and throughput limits. These limits depend on the QoS tier and connection type selected for its volume group. For each profile, multiply the volume capacity in GiB by the applicable scaling factor, then cap the result at the per-volume maximum.

### Volume scale targets

| QoS tier and connection type | Maximum volume size | IOPS scaling factor | Maximum IOPS | Throughput scaling factor | Maximum throughput |
| --- | ---: | ---: | ---: | ---: | ---: |
| Business critical - direct attach | 64 TiB | 1,000 IOPS/GiB | 400,000 | 250 MB/s per GiB | 10,000 MB/s |
| General purpose - direct attach | 64 TiB | 500 IOPS/GiB | 80,000 | 125 MB/s per GiB | 2,000 MB/s |
| General purpose - iSCSI | 64 TiB | 750 IOPS/GiB | 80,000 | 60 MB/s per GiB | 1,280 MB/s |

These values are upper limits, not performance guarantees at every volume size. Individual volume performance also depends on the performance provisioned for the SAN. The combined IOPS and throughput used by all volumes can't exceed the IOPS and throughput provisioned for the SAN.

## Next steps

[Deploy an Elastic SAN Next Generation resource](next-generation-create.md).

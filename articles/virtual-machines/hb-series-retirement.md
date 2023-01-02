---
title: HB-series retirement
description: HB-series retirement started September 1, 2021.
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 08/02/2021
---

# Migrate your HB-series virtual machines by August 31, 2024

Microsoft Azure has introduced HBv2 and HBv3-series virtual machines (VMs) for high-performance computing (HPC). For this reason, we recommend that you migrate workloads from original HB-series VMs to our newer offerings.

Azure [HBv2](hbv2-series.md) and [HBv3](hbv3-series.md) VMs have greater memory bandwidth, improved remote direct memory access (RDMA) networking capabilities, larger and faster local solid-state drives, and better cost and performance across various HPC workloads. As a result, we're retiring our HB-series Azure VM sizes on August 31, 2024.

## How does the HB-series migration affect me?

After August 31, 2024, any remaining HB-size VM subscriptions will be set to a deallocated state. They'll stop working and no longer incur billing charges.

> [!NOTE]
> This VM size retirement only affects the VM sizes in the HB series. This retirement announcement doesn't apply to the newer HBv2, HBv3, and HC-series VMs.

## What actions should I take?

You'll need to resize or deallocate your H-series VMs. We recommend that you migrate workloads from the original H-series VMs and the H-series Promo VMs to our newer offerings.

[HBv2](hbv2-series.md) and [HBv3](hbv3-series.md) VMs offer substantially higher levels of HPC workload performance and cost efficiency because of:

- Large improvements in CPU core architecture.
- Higher memory bandwidth.
- Larger L3 caches.
- Enhanced InfiniBand networking as compared to HB series.

As a result, HBv2 and HBv3 series will in general offer substantially better performance per unit of cost (maximizing performance for a fixed amount of spend) and cost per performance (minimizing cost for a fixed amount of performance).

All regions that contain HB-series VMs contain HBv2 and HBv3-series VMs. Existing workloads that run on HB-series VMs can be migrated without concern for geographic placement or for access to more services in those regions.

[HB-series](hb-series.md) VMs won't be retired until September 2024. We're providing this guide in advance to give you a long window to assess, plan, and execute your migration.

### Recommendations for workload migration from HB-series VMs

| Current VM size | Target VM size | Difference in specification  |
|---|---|---|
|Standard_HB60rs |Standard_HB120rs_v2 <br> Standard_HB120rs_v3 <br> Standard_HB120-64rs_v3 |Newer CPU: AMD Rome and MiIan (+20-30% IPC) <br> Memory: Up to 2x more RAM  <br> Memory bandwidth: Up to 30% more memory bandwidth <br> InfiniBand: 200 Gb HDR (2x higher bandwidth) <br> Max data disks: Up to 32 (+8x) |
|Standard_HB60-45rs |Standard_HB120-96rs_v3 <br> Standard_HB120-64rs_v3 <br> Standard_HB120-32rs_v3 |Newer CPU: AMD Rome and MiIan (+20-30% IPC) <br> Memory: Up to 2x more RAM  <br>  Memory bandwidth: Up to 30% more memory bandwidth <br> InfiniBand: 200 Gb HDR (2x higher bandwidth) <br> Max data disks: Up to 32 (+8x) |
|Standard_HB60-30rs |Standard_HB120-32rs_v3 <br> Standard_HB120-16rs_v3 |Newer CPU: AMD Rome and MiIan (+20-30% IPC) <br> Memory: Up to 2x more RAM <br> Memory bandwidth: Up to 30% more memory bandwidth <br> InfiniBand: 200 Gb HDR (2x higher bandwidth) <br> Max data disks: Up to 32 (+8x) |
|Standard_HB60-15rs |Standard_HB120-16rs_v3 |Newer CPU: AMD Rome and MiIan (+20-30% IPC) <br> Memory: Up to 2x more RAM <br> Memory bandwidth: Up to 30% more memory bandwidth <br> InfiniBand: 200 Gb HDR (2x higher bandwidth) <br> Max data disks: Up to 32 (+8x) |

### Migration steps

1. Choose a series and size for migration.
1. Get a quota for the target VM series.
1. Resize the current HB-series VM size to the target size.

### Get a quota for the target VM family

Follow the guide to [request an increase in vCPU quota by VM family](../azure-portal/supportability/per-vm-quota-requests.md).

### Resize the current VM

You can [resize the virtual machine](resize-vm.md).

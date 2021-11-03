---
title: HB-series-retirement
description: HB-series retirement starting September 1, 2021
author: vermagit
ms.service: virtual-machines
ms.subservice: vm-sizes-hpc
ms.topic: conceptual
ms.date: 08/02/2021
ms.author: amverma
---

# Migrate your HB-series virtual machines by August 31, 2024
As Microsoft Azure has introduced HBv2 and HBv3-series virtual machines for high performance computing (HPC), we recommend migrating workloads from original HB-series virtual machines to our newer offerings.  

Azure [HBv2](hbv2-series.md) and [HBv3](hbv3-series.md) virtual machines have greater memory bandwidth, improved remote direct memory access (RDMA) networking capabilities, larger and faster local solid-state drives, and better cost/performance across a broad variety of HPC workloads. Consequently, we are retiring our HB-series Azure Virtual Machine sizes on 31 August 2024.

## How does the HB-series migration affect me?  

After 31 August 2024, any remaining HB size virtual machines subscriptions will be set to a deallocated state, will stop working, and will no longer incur billing charges.  
> [!NOTE]
> This VM size retirement only impacts the VM sizes in the HB-series. This retirement announcement does not apply to the newer HBv2, HBv3 and HC series virtual machines. 

## What actions should I take?  

You will need to resize or deallocate your H-series virtual machines. We recommend migrating workloads from original H-series (inclusive of H-series promo) virtual machines to our newer offerings.

[HBv2](hbv2-series.md), and [HBv3](hbv3-series.md) VMs offer substantially higher levels of HPC workload performance and cost efficiency due to large improvements in CPU core architecture, higher memory bandwidth, larger L3 caches, and enhanced InfiniBand networking as compared to HB-series. As a result, HBv2 and HBv3-series will in general offer substantially better performance per unit of cost (i.e. maximizing performance for a fixed amount of spend) as well as cost per performance (i.e. minimizing cost for a fixed amount of performance).

All regions containing HB-series VMs contain HBv2 and HBv3-series virtual machines, so existing workloads running on HB-series VMs can be migrated without concern for geographic placement or for access to additional services in those regions. 

[HB-series](hb-series.md) VMs will not be retired until September 2024, so we are providing this guide in advance to give customers a long window to assess, plan, and execute their migration. 

### Recommendations for Workload Migration from HB-series Virtual Machines 

| Current VM Size | Target VM Size | Difference in Specification  |
|---|---|---|
|Standard_HB60rs |Standard_HB120rs_v2 <br> Standard_HB120rs_v3 <br> Standard_HB120-64rs_v3 |Newer CPU: AMD Rome and MiIan (+20-30% IPC) <br> Memory: Up to 2x more RAM  <br> Memory Bandwidth: Up to 30% more memory bandwidth <br> InfiniBand: 200 Gb HDR (2x higher bandwidth) <br> Max data disks: Up to 32 (+8x) |
|Standard_HB60-45rs |Standard_HB120-96rs_v3 <br> Standard_HB120-64rs_v3 <br> Standard_HB120-32rs_v3 |Newer CPU: AMD Rome and MiIan (+20-30% IPC) <br> Memory: Up to 2x more RAM  <br>  Memory Bandwidth: Up to 30% more memory bandwidth <br> InfiniBand: 200 Gb HDR (2x higher bandwidth) <br> Max data disks: Up to 32 (+8x) |
|Standard_HB60-30rs |Standard_HB120-32rs_v3 <br> Standard_HB120-16rs_v3 |Newer CPU: AMD Rome and MiIan (+20-30% IPC) <br> Memory: Up to 2x more RAM <br> Memory Bandwidth: Up to 30% more memory bandwidth <br> InfiniBand: 200 Gb HDR (2x higher bandwidth) <br> Max data disks: Up to 32 (+8x) |
|Standard_HB60-15rs |Standard_HB120-16rs_v3 |Newer CPU: AMD Rome and MiIan (+20-30% IPC) <br> Memory: Up to 2x more RAM <br> Memory Bandwidth: Up to 30% more memory bandwidth <br> InfiniBand: 200 Gb HDR (2x higher bandwidth) <br> Max data disks: Up to 32 (+8x) |


### Migration Steps 
1. Choose a series and size for migration. 
2. Get quota for the target VM series 
3. Resize the current HB-series VM size to the target size 


### Get quota for the target VM family 

Follow the guide to [request an increase in vCPU quota by VM family](../azure-portal/supportability/per-vm-quota-requests.md).


### Resize the current virtual machine
You can [resize the virtual machine](resize-vm.md).

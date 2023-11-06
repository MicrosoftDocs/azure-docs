---
 title: include file
 description: include file
 author: mattmcinnes
 ms.author: mattmcinnes
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 11/05/2023
 ms.custom: include file
---

### [Basics](#tab/sizebasics)

Size Series, Series Type, Network Interface, and Deployment Status of each Boost-enabled VM series

| Size Series | Series Type | Network Interface | Deployment Status |
|:-:|:-:|:-:|:-:|
| Dalsv6                                                         | General Purpose                | MANA | Preview         |
| Easv6                                                          | Memory Optimized               | MANA | Preview         |
| [Mv3 Medium Memory](../../virtual-machines/msv3-mdsv3-medium-series.md)| High Memory to CPU Optimized   | MANA | Preview |
| Falsv6/Famsv6                                                  | Compute Optimized              | Mellanox | Preview    |
| [Dlsv5](../../virtual-machines/dlsv5-dldsv5-series.md)         | General Purpose                | Mellanox | Production |
| [Dsv5](../../virtual-machines/dv5-dsv5-series.md)              | General Purpose                | Mellanox | Production |
| [Esv5](../../virtual-machines/ev5-esv5-series.md)              | Memory Optimized               | Mellanox | Production |
| [Ebsv5](../../virtual-machines/ebdsv5-ebsv5-series.md)         | Managed disks optimized        | Mellanox | Production |
| [Lsv3](../../virtual-machines/lsv3-series.md)                  | Local storage optimized        | Mellanox | Production |
| [Lasv3](../../virtual-machines/lasv3-series.md)                | Local storage optimized        | Mellanox | Production |
| [Dplsv5](../../virtual-machines/dplsv5-dpldsv5-series.md)      | General Purpose                | Mellanox | Production |
| [Dpsv5](../../virtual-machines/dpsv5-dpdsv5-series.md)         | General Purpose                | Mellanox | Production |
| [Epsv5](../../virtual-machines/epsv5-epdsv5-series.md)         | General Purpose                | Mellanox | Production |
| [Nvadsv5](../../virtual-machines/nva10v5-series.md)            | GPU/AI workload optimized      | Mellanox | Production |
| [HBv4](../../virtual-machines/hbv4-series.md)                  | High Performance Compute (HPC) | Mellanox | Production |


#### VM type and status resources
- [Azure Virtual Machine Sizes Naming](../../virtual-machines/vm-naming-conventions.md).

### [CPU/Memory](#tab/sizecpumem)

CPU and Memory specs for each size series. All vCPU count and memory values are based on the largest available single-VM size in each series. 

| Size Series | CPU Architecture | CPU Vendor | Max vCPUs | Max Memory: GiB |
|:-:|:-:|:-:|:-:|:-:|
| Dalsv6                                                      | x86 | AMD    | -   | - |
| Easv6                                                       | x86 | AMD    | -   | - |
| [Mv3 Medium Memory](../../virtual-machines/msv3-mdsv3-medium-series.md)| x86 | Intel | 176 | 2794 |
| Falsv6/Famsv6                                               | x86 | AMD    | -   | - |
| [Dlsv5](../../virtual-machines/dlsv5-dldsv5-series.md)         | x86 | Intel  | 96  | 192 |
| [Dsv5](../../virtual-machines/dv5-dsv5-series.md)              | x86 | Intel  | 96  | 384 |
| [Esv5](../../virtual-machines/ev5-esv5-series.md)              | x86 | Intel  | 104 | 672 |
| [Ebsv5](../../virtual-machines/ebdsv5-ebsv5-series.md)         | x86 | Intel  | 112 | 672 |
| [Lsv3](../../virtual-machines/lsv3-series.md)                  | x86 | Intel  | 80  | 640 |
| [Lasv3](../../virtual-machines/lasv3-series.md)                | x86 | AMD    | 80  | 640 |
| [Dplsv5](../../virtual-machines/dplsv5-dpldsv5-series.md)      | ARM | Ampere | 64  | 128 |
| [Dpsv5](../../virtual-machines/dpsv5-dpdsv5-series.md)         | ARM | Ampere | 64  | 208 |
| [Epsv5](../../virtual-machines/epsv5-epdsv5-series.md)         | ARM | Ampere | 32  | 208 |
| [Nvadsv5](../../virtual-machines/nva10v5-series.md)            | x86 | AMD    | 72  | 880 |
| [HBv4](../../virtual-machines/hbv4-series.md)                  | x86 | AMD    | 176 | 768 |


#### VM CPU resources
- [What are vCPUs](../../virtual-machines/managed-disks-overview.md)
- [Check vCPU quotas](../../virtual-machines/quotas.md)

### [Storage](#tab/sizestorage)

Data disks and Temp storage info for each size

| Size Series                                | Temp storage (SSD): GiB | Max Data Disks | NVMe Support |
|:-:|:-:|:-:|:-:|
| Dalsv6                                                      | -                   | -   | -   |
| Easv6                                                       | -                   | -   | -   |
| [Mv3 Medium Memory](../../virtual-machines/msv3-mdsv3-medium-series.md)| 400         | 64  | No  |
| Falsv6/Famsv6                                               | -                   | -   | -   |
| [Dlsv5](../../virtual-machines/dlsv5-dldsv5-series.md)         | Remote Storage Only | 32  | No  |
| [Dsv5](../../virtual-machines/dv5-dsv5-series.md)              | Remote Storage Only | 32  | No  |
| [Esv5](../../virtual-machines/ev5-esv5-series.md)              | Remote Storage Only | 64  | No  |
| [Ebsv5](../../virtual-machines/ebdsv5-ebsv5-series.md)         | Remote Storage Only | 64  | No  |
| [Lsv3](../../virtual-machines/lsv3-series.md)                  | 800                 | 32  | Yes |
| [Lasv3](../../virtual-machines/lasv3-series.md)                | 800                 | 32  | Yes |
| [Dplsv5](../../virtual-machines/dplsv5-dpldsv5-series.md)      | Remote Storage Only | 32  | No  |
| [Dpsv5](../../virtual-machines/dpsv5-dpdsv5-series.md)         | Remote Storage Only | 32  | No  |
| [Epsv5](../../virtual-machines/epsv5-epdsv5-series.md)         | Remote Storage Only | 32  | No  |
| [Nvadsv5](../../virtual-machines/nva10v5-series.md)            | 2880                | 32  | No  |
| [HBv4](../../virtual-machines/hbv4-series.md)                  | [Special Case](../../virtual-machines/hbv4-series-overview.md#hardware-specifications) | 32 | Yes |


#### VM Storage resources
- [Introduction to Azure managed disks](../../virtual-machines/managed-disks-overview.md)
- [Azure managed disk types](../../virtual-machines/disks-types.md)
- [Share an Azure managed disk](../../virtual-machines/disks-shared.md)

#### Table definitions
- Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB might appear smaller. For example, 1023 GiB = 1098.4 GB.
- Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
- Data disks can operate in cached or uncached modes. For cached data disk operation, the host cache mode is set to ReadOnly or ReadWrite. For uncached data disk operation, the host cache mode is set to None.
- To learn how to get the best storage performance for your VMs, see [Virtual machine and disk performance](../../virtual-machines/disks-performance.md).

### [Network](#tab/sizenetwork)

Network interface info for each size

| Size Series                             | Max Network Interfaces | Network Bandwidth (expected): Mbps |
|:-:|:-:|:-:|
| Dalsv6                                                         | - | -    |
| Easv6                                                          | - | -    |
| [Mv3 Medium Memory](../../virtual-machines/msv3-mdsv3-medium-series.md)| 8 | 40000 |
| Falsv6/Famsv6                                                  | - | -    |
| [Dlsv5](../../virtual-machines/dlsv5-dldsv5-series.md)         | 8 | 35000  |
| [Dsv5](../../virtual-machines/dv5-dsv5-series.md)              | 8 | 35000  |
| [Esv5](../../virtual-machines/ev5-esv5-series.md)              | 8 | 100000 |
| [Ebsv5](../../virtual-machines/ebdsv5-ebsv5-series.md)         | 8 | 40000  |
| [Lsv3](../../virtual-machines/lsv3-series.md)                  | 8 | 32000  |
| [Lasv3](../../virtual-machines/lasv3-series.md)                | 8 | 32000  |
| [Dplsv5](../../virtual-machines/dplsv5-dpldsv5-series.md)      | 8 | 40000  |
| [Dpsv5](../../virtual-machines/dpsv5-dpdsv5-series.md)         | 8 | 40000  |
| [Epsv5](../../virtual-machines/epsv5-epdsv5-series.md)         | 8 | 16000  |
| [Nvadsv5](../../virtual-machines/nva10v5-series.md)            | 8 | 80000  |
| [HBv4](../../virtual-machines/hbv4-series.md)                  | 8 | -      |


#### VM Networking resources
- [Virtual networks and virtual machines in Azure](../../virtual-network/network-overview.md)
- [Virtual machine network bandwidth](../../virtual-network/virtual-machine-network-throughput.md)

### [GPU/Accelerators](#tab/sizeaccelerators)

Accelerator (GPUs, FPGAs, etc.) info for each size

| Size | Max GPUs | GPU Name | Max GPU memory: GiB |
|:-:|:-:|:-:|:-:|
| Dalsv6                                                      | - | - | - |
| Easv6                                                       | - | - | - |
| [Mv3 Medium Memory](../../virtual-machines/msv3-mdsv3-medium-series.md)| - | - | - |
| Falsv6/Famsv6                                               | - | - | - |
| [Dlsv5](../../virtual-machines/dlsv5-dldsv5-series.md)         | - | - | - |
| [Dsv5](../../virtual-machines/dv5-dsv5-series.md)              | - | - | - |
| [Esv5](../../virtual-machines/ev5-esv5-series.md)              | - | - | - |
| [Ebsv5](../../virtual-machines/ebdsv5-ebsv5-series.md)         | - | - | - |
| [Lsv3](../../virtual-machines/lsv3-series.md)                  | - | - | - |
| [Lasv3](../../virtual-machines/lasv3-series.md)                | - | - | - |
| [Dplsv5](../../virtual-machines/dplsv5-dpldsv5-series.md)      | - | - | - |
| [Dpsv5](../../virtual-machines/dpsv5-dpdsv5-series.md)         | - | - | - |
| [Epsv5](../../virtual-machines/epsv5-epdsv5-series.md)         | - | - | - |
| [Nvadsv5](../../virtual-machines/nva10v5-series.md)            | 1 | Nvidia A10 | 24 |
| [HBv4](../../virtual-machines/hbv4-series.md)                  | - | - | - |

---
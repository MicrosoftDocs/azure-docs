




## A-series - compute-intensive instances
For information and considerations about using these sizes, see [About the H-series and compute-intensive A-series VMs](../articles/virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

| Size | CPU cores | Memory: GiB | Local HDD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_A8* |8 |56 |382 |16 |16x500 |2 / high |
| Standard_A9* |16 |112 |382 |16 |16x500 |4 / very high |
| Standard_A10 |8 |56 |382 |16 |16x500 |2 / high |
| Standard_A11 |16 |112 |382 |16 |16x500 |4 / very high |

*RDMA capable

<br>

## H-series
Azure H-series virtual machines are the next generation high performance computing VMs aimed at high end computational needs, like molecular modeling, and computational fluid dynamics. These 8 and 16 core VMs are built on the Intel Haswell E5-2667 V3 processor technology featuring DDR4 memory and local SSD based storage. 

In addition to the substantial CPU power, the H-series offers diverse options for low latency RDMA networking using FDR InfiniBand and several memory configurations to support memory intensive computational requirements.

For information and considerations about using these sizes, see [About the H-series and compute-intensive A-series VMs](../articles/virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

| Size | CPU cores | Memory: GiB | Local SSD: GiB | Max data disks | Max disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_H8 |8 |56 |1000 |16 |16 x 500 |2 / high |
| Standard_H16 |16 |112 |2000 |32 |32 x 500 |4 / very high |
| Standard_H8m |8 |112 |1000 |16 |16 x 500 |2 / high |
| Standard_H16m |16 |224 |2000 |32 |32 x 500 |4 / very high |
| Standard_H16r* |16 |112 |2000 |32 |32 x 500 |4 / very high |
| Standard_H16mr* |16 |224 |2000 |32 |32 x 500 |4 / very high |

*RDMA capable

<br>

## Size table definitions

* Storage capacity is shown in units of GiB or 1024^3 bytes. When comparing disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB
* Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
* Data disks can operate in cached or uncached modes.  For cached data disk operation, the host cache mode is set to **ReadOnly** or **ReadWrite**.  For uncached data disk operation, the host cache mode is set to **None**.
* Maximum network bandwidth is the maximum aggregated bandwidth allocated and assigned per VM type. The maximum bandwidth provides guidance for selecting the right VM type to ensure adequate network capacity is available. When moving between Low, Moderate, High and Very High, the throughput will increase accordingly. Actual network performance will depend on many factors including network and application loads, and application network settings.

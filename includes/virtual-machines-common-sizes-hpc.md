<!-- A-series - compute-intensive instances, H-series -->

The A8-A11 and H-series sizes are also known as *compute-intensive instances*. The hardware that runs these sizes is designed and optimized for compute-intensive and network-intensive applications, including high-performance computing (HPC) cluster applications, modeling, and simulations. The A8-A11 series uses Intel Xeon E5-2670 @ 2.6 GHZ and the H-series uses Intel Xeon E5-2667 v3 @ 3.2 GHz. 

Azure H-series virtual machines are the next generation high performance computing VMs aimed at high end computational needs, like molecular modeling, and computational fluid dynamics. These 8 and 16 core VMs are built on the Intel Haswell E5-2667 V3 processor technology featuring DDR4 memory and local SSD based storage. 

In addition to the substantial CPU power, the H-series offers diverse options for low latency RDMA networking using FDR InfiniBand and several memory configurations to support memory intensive computational requirements.



## H-series

ACU: 290-300

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



## A-series - compute-intensive instances

ACU: 225

| Size | CPU cores | Memory: GiB | Local HDD: GiB | Max data disks | Max data disk throughput: IOPS | Max NICs / Network bandwidth |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_A8* |8 |56 |382 |16 |16x500 |2 / high |
| Standard_A9* |16 |112 |382 |16 |16x500 |4 / very high |
| Standard_A10 |8 |56 |382 |16 |16x500 |2 / high |
| Standard_A11 |16 |112 |382 |16 |16x500 |4 / very high |

*RDMA capable

<br>




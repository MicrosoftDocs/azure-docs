



| Type                                 | Series | Best for....                                                                                                                                   | ACU        |
|--------------------------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| [Economy](../articles/virtual-machines/virtual-machines-windows-sizes-economy.md) | A0-7   | Development workloads, build servers, code repositories, low-traffic websites, micro services, early product experiments, and small databases. | 50-100     |
| [General-purpose](../articles/virtual-machines/virtual-machines-windows-sizes-general.md) | D      | Applications that demand faster CPUs, better local disk performance, or higher memories. | 160        |
|                                      | Dv2    | Applications that demand more powerful CPUs, which are about 35% faster than D-series.                                                         | 210 - 250* |
| 									   | DS     | Applications with similar demands to the D-series but require premium storage.                                                                 | 160        |
|                                      | DSv2   | Optimized for premium storage.                                                                                                                 | 210 - 250* |
| [High Performance Compute](../articles/virtual-machines/virtual-machines-windows-sizes-hpc.md) | A8-11  | Compute-intensive workloads like HPC.                                                                                                          | 225*       |
|                                      | H      | Financial risk modeling, seismic and reservoir simulation, molecular modeling, and genomic research.                                           | TBD        |
| [Compute optimized](../articles/virtual-machines/virtual-machines-windows-sizes-compute.md)                    | F      | Higher CPU to memory ratio. Good for web servers, network appliances, batch process and application servers.                                   | 210 - 250* |
|                                      | Fs     | The power of the F-series and premium storage.                                                                                                 | 210 - 250* |
| [GPU optimized](../articles/virtual-machines/virtual-machines-windows-sizes-gpu.md)                                 | N      | NV sizes are ideal for remote visualization, streaming, gaming, encoding and VDI scenarios.                                                    | xxx-xxx*   |
|                                      |        | NC sizes are ideal for compute intensive and network intensive applications, algorithms, and simulations.                                      | xxx-xxx*   |
| [Memory optimized](../articles/virtual-machines/virtual-machines-windows-sizes-memory.md)                    | G      | high disk throughput and IO. Workloads like Big Data, MPP, SQL and NO-SQL databases.                                                           | 180-240*   |
|                                      | GS     | Premium storage option for G-series.                                                                                                           | 180 - 240* |
| [Storage optimized](../articles/virtual-machines/virtual-machines-windows-sizes-storage.md)                    | Ls      | workloads that require low latency local storage, like NoSQL databases.                                                           | 180-240*   |


ACU is currently standardized on a Small (Standard_A1) VM being 100 and all other SKUs then represent approximately how much faster that SKU can run a standard benchmark. 

> [!IMPORTANT]
> The ACU is only a guideline.  The results for your workload may vary. 
>
>


* Your subscription might also limit the number of cores you can deploy in certain size families. To increase a quota, contact Azure Support.





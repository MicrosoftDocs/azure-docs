



| Type                                 | Series | Best for....                                                                                                                                   | ACU        |
|--------------------------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| [Economy](virtual-machines-windows-sizes-economy.md) | A0-7   | Development workloads, build servers, code repositories, low-traffic websites, micro services, early product experiments, and small databases. | 50-100     |
| [General-purpose](virtual-machines-windows-sizes-general.md) | D      | Applications that demand faster CPUs, better local disk performance, or higher memories. | 160        |
|                                      | Dv2    | Applications that demand more powerful CPUs, which are about 35% faster than D-series.                                                         | 210 - 250* |
| General-purpose with premium storage | DS     | Applications with similar demands to the D-series but require premium storage.                                                                 | 160        |
|                                      | DSv2   | Optimized for premium storage.                                                                                                                 | 210 - 250* |
| [High Performance Compute](virtual-machines-windows-sizes-hpc.md) | A8-11  | Compute-intensive workloads like HPC.                                                                                                          | 225*       |
|                                      | H      | Financial risk modeling, seismic and reservoir simulation, molecular modeling, and genomic research.                                           | TBD        |
| [Compute optimized](virtual-machines-windows-sizes-compute.md)                    | F      | Higher CPU to memory ratio. Good for web servers, network appliances, batch process and application servers.                                   | 210 - 250* |
|                                      | Fs     | The power of the F-series and premium storage.                                                                                                 | 210 - 250* |
| [GPU optimized](virtual-machines-windows-sizes-gpu.md)                                 | N      | NV sizes are ideal for remote visualization, streaming, gaming, encoding and VDI scenarios.                                                    | xxx-xxx*   |
|                                      |        | NC sizes are ideal for compute intensive and network intensive applications, algorithms, and simulations.                                      | xxx-xxx*   |
| [Memory optimized](virtual-machines-windows-sizes-memory.md)                    | G      | high disk throughput and IO. Workloads like Big Data, MPP, SQL and NO-SQL databases.                                                           | 180-240*   |
| Memory optimized with premium storage | GS     | Premium storage option for G-series.                                                                                                           | 180 - 240* |


ACU is currently standardized on a Small (Standard_A1) VM being 100 and all other SKUs then represent approximately how much faster that SKU can run a standard benchmark. 

> [!IMPORTANT]
> The ACU is only a guideline.  The results for your workload may vary. 
>
>


* Some of the physical hosts in Azure data centers may not support larger virtual machine sizes, such as A5 – A11. As a result, you may see the error message **Failed to configure virtual machine <machine name>** or **Failed to create virtual machine <machine name>** when resizing an existing virtual machine to a new size; creating a new virtual machine in a virtual network created before April 16, 2013; or adding a new virtual machine to an existing cloud service. See  [Error: “Failed to configure virtual machine”](https://social.msdn.microsoft.com/Forums/9693f56c-fcd3-4d42-850e-5e3b56c7d6be/error-failed-to-configure-virtual-machine-with-a5-a6-or-a7-vm-size?forum=WAVirtualMachinesforWindows) on the support forum for workarounds for each deployment scenario.  

* Your subscription might also limit the number of cores you can deploy in certain size families. To increase a quota, contact Azure Support.





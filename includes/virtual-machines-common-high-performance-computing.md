
Organizations have large-scale computing workloads: engineering design and analysis, image rendering, complex modeling, Monte Carlo simulations, financial risk calculations, and others. With Azure, you can run your high performance computing (HPC) and batch workloads on clusters of Azure virtual machines, using either core infrastructure services or managed services. 

Azure HPC solutions support a range of workloads, from instrinsically parallel batch jobs to traditional HPC simulations using the message passing interface (MPI). Depending on your needs, you can scale compute resources in Azure to thousands of cores and then scale down when you need fewer resources. 



## Solution architectures

Sample HPC solution architectures in Azure include the following:

* Run HPC applications entirely in Azure virtual machines or VM scale sets, using a Linux or Windows cluster or grid manager of your choice [Learn more](https://azure.microsoft.com/en-us/solutions/architecture/hpc-cluster/)
* Create hybrid solutions that extend an on-premises HPC cluster to offload ("burst") peak workloads to Azure VMs [Learn more](https://azure.microsoft.com/en-us/solutions/architecture/hpc-on-prem-burst/)
* Use a managed and scalable Azure compute service such as [Batch](https://azure.microsoft.com/documentation/services/batch/) to run compute-intensive workloads, without managing underlying infrastructure [Learn more](https://azure.microsoft.com/en-us/solutions/architecture/hpc-big-compute-saas/)







## HPC cluster and grid solutions
Deploy or extend familiar HPC workload management tools to Azure virtual machines and run your compute-intensive workloads. Options range from open-source tools such as the [Slurm workload manager](https://slurm.schedmd.com/) to cluster and grid managers from Microsoft and other publishers.

### Linux and OSS cluster solutions
Use Azure Resource Manager templates to deploy HPC cluster solutions on Linux VMs:

* [Slurm](https://azure.microsoft.com/documentation/templates/slurm/)
* [Torque](https://azure.microsoft.com/documentation/templates/torque-cluster/)
* [PBS Professional](https://github.com/xpillons/azure-hpc/tree/master/Compute-Grid-Infra)

### Microsoft HPC Pack
[HPC Pack](https://technet.microsoft.com/library/cc514029(v=ws.11).aspx) is Microsoft's free HPC solution built on Microsoft Azure and Windows Server technologies, capable of running Windows and Linux HPC workloads. Learn more about running HPC Pack on clusters of Azure [Linux](../virtual-machines/linux/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) and [Windows](../virtual-machines/windows/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) virtual machines. 





### Third-party grid managers

Microsoft partners with leading grid managers to make their solutions supported in Azure virtual machines. Examples include:


* [IBM Spectrum Symphony and Symphony LSF](https://azure.microsoft.com/blog/ibm-and-microsoft-azure-support-spectrum-symphony-and-spectrum-lsf/)
* [TIBCO DataSynapse GridServer](https://azure.microsoft.com/blog/tibco-datasynapse-comes-to-the-azure-marketplace/) 
* [Bright Cluster Manager](http://www.brightcomputing.com/technology-partners/microsoft)
* [Univa Grid Engine](http://www.univa.com/products/grid-engine)


## Azure Batch
[Batch](https://azure.microsoft.com/documentation/services/batch/) is a platform service that makes it easy to cloud-enable your Linux and Windows applications and run jobs without setting up and managing a cluster and job scheduler. Use the Batch SDKs to integrate client applications with Azure, stage data to Azure, and build job execution pipelines.

## HPC and GPU VM options
Azure offers a range of sizes for [Linux](../virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) and [Windows](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) VMs, including sizes for HPC workloads. Learn more about , including [compute-intensive H-series](../virtual-machines/windows/sizes-hpc.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) instances capable of connecting to a back-end RDMA network, to run your Linux and Windows HPC workloads. 

* [Set up a Linux RDMA cluster to run MPI applications](../virtual-machines/linux/classic/rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json)
* [Set up a Windows RDMA cluster with Microsoft HPC Pack to run MPI applications](../virtual-machines/windows/classic/hpcpack-rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)

For GPU-intensive workloads, check out NC and NV sizes available for both Windows and Linux VMs.

> [!NOTE]
> Take advantage of the Azure [compute-intensive instances such as the H-series](../virtual-machines/windows/sizes-hpc.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) to improve the performance and scalability of HPC workloads. These instances also support parallel MPI applications that require a low-latency and high-throughput application network. Also available are [N-series](../virtual-machines/windows/sizes-gpu.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) VMs with NVIDIA GPUs to expand the range of computing and visualization scenarios in Azure.  
## HPC applications

### Engineering applications

Several engineering HPC applications are supported to run in Azure, including:

* [Altair RADIOSS](https://azure.microsoft.com/blog/availability-of-altair-radioss-rdma-on-microsoft-azure/)
* [ANSYS CFD](https://azure.microsoft.com/blog/ansys-cfd-and-microsoft-azure-perform-the-best-hpc-scalability-in-the-cloud/)

* [StarCCM+](https://azure.microsoft.com/blog/availability-of-star-ccm-on-microsoft-azure/)
* [OpenFOAM](https://simulation.azure.com/casestudies/Team-182-ABB-UC-Final.pdf)

Learn more about using Azure for [engineering simulation](https://simulation.azure.com/).

## Other applications

* [Rendering with Autodesk Maya, 3ds Max, and Arnold](https://docs.microsoft.com/en-us/azure/batch/batch-rendering-service) on Azure Batch (preview)


## Samples and demos
* [Azure Batch C# and Python code samples](https://github.com/Azure/azure-batch-samples)
* [Batch Shipyard](https://azure.github.io/batch-shipyard/) toolkit for easy deployment of batch-style Dockerized workloads to Azure Batch
* [doAzureParallel](http://www.github.com/Azure/doAzureParallel) R package, built on top of Azure Batch
* [Test drive SUSE Linux Enterprise Server for HPC](https://azure.microsoft.com/marketplace/partners/suse/suselinuxenterpriseserver12optimizedforhighperformancecompute/)


> [!IMPORTANT]
> Check with the vendor of any commercial application for licensing or other restrictions for running in the cloud. Not all vendors offer pay-as-you-go licensing. You might need to plan for a licensing server in the cloud for your solution, or connect to an on-premises license server.

## Related Azure services

### Compute

* [Virtual Machine Scale Sets](https://azure.microsoft.com/documentation/services/virtual-machine-scale-sets/)
* [Cloud Services](https://azure.microsoft.com/documentation/services/cloud-services/)
* [App Service](https://azure.microsoft.com/documentation/services/app-service/)
* [Functions](https://azure.microsoft.com/documentation/services/functions/)


### Data and analysis
* [Data Factory](https://azure.microsoft.com/documentation/services/data-factory/)
* [Data Lake Store](https://azure.microsoft.com/services/data-lake-store/)
* [Machine Learning](https://azure.microsoft.com/documentation/services/machine-learning/)
* [HDInsight](https://azure.microsoft.com/documentation/services/hdinsight/)
* [SQL Database](https://azure.microsoft.com/documentation/services/sql-database/)

### Networking
* [Virtual Network](https://azure.microsoft.com/documentation/services/virtual-network/)
* [ExpressRoute](https://azure.microsoft.com/documentation/services/expressroute/)
### Storage


* [Media Services](https://azure.microsoft.com/documentation/services/media-services/)


* [Service Bus](https://azure.microsoft.com/documentation/services/service-bus/)
* [Storage](https://azure.microsoft.com/documentation/services/storage/)









## Industry solutions
* [Banking and capital markets](https://finance.azure.com/)
* [Engineering simulations](https://simulation.azure.com/) 

## Customer stories
* [ANEO](https://customers.microsoft.com/story/it-provider-finds-highly-scalable-cloud-based-hpc-redu) 
* [Axioma](https://customers.microsoft.com/story/axioma-delivers-fintechs-first-born-in-the-cloud-multi-asset-class-enterprise-risk-solution)
* [d3View](https://customers.microsoft.com/story/big-data-solution-provider-adopts-new-cloud-gains-thou)
* [Ludwig Institute of Cancer Research](https://customers.microsoft.com/story/windows-supercomputer-speeds-quest-to-identify-cancer)
* [Microsoft Research](https://customers.microsoft.com/doclink/fast-lmm-and-windows-azure-put-genetics-research-on-fa)
* [Milliman](https://customers.microsoft.com/story/actuarial-firm-works-to-transform-insurance-industry-w)
* [Mitsubishi UFJ Securities International](https://customers.microsoft.com/story/powering-risk-compute-grids-in-the-cloud)
* [Schlumberger](http://azure.microsoft.com/blog/big-compute-for-large-engineering-simulations)
* [Towers Watson](https://customers.microsoft.com/story/insurance-tech-provider-delivers-disruptive-solutions)


## Partners
Cycle Computing, Rescale, and UberCloud.








## HPC storage
* [Parallel file systems for HPC storage on Azure](https://blogs.msdn.microsoft.com/azurecat/2017/03/17/parallel-file-systems-for-hpc-storage-on-azure/)
* [Intel Cloud Edition for Lustre Software - Eval](https://azure.microsoft.com/marketplace/partners/intel/lustre-cloud-edition-evaleval-lustre-2-7/)
* [BeeGFS on CentOS 7.2 template](https://github.com/smith1511/hpc/tree/master/beegfs-shared-on-centos7.2)




## Microsoft MPI
[Microsoft MPI](https://msdn.microsoft.com/library/bb524831.aspx) (MS-MPI) is a Microsoft implementation of the Message Passing Interface standard for developing and running parallel applications on the Windows platform.

* [Download MS-MPI](http://go.microsoft.com/FWLink/p/?LinkID=389556)
* [MS-MPI reference](https://msdn.microsoft.com/library/dn473458.aspx)
* [MPI forum](https://social.microsoft.com/Forums/en-us/home?forum=windowshpcmpi)



## Architecture blueprints
* [HPC and data orchestration using Azure Batch and Azure Data Factory](http://go.microsoft.com/fwlink/?linkid=717686) (PDF) and [article](../data-factory/data-factory-data-processing-using-batch.md)



## Next steps
* For the latest announcements, see the [Microsoft HPC and Batch team blog](http://blogs.technet.com/b/windowshpc/) and the [Azure blog](https://azure.microsoft.com/blog/tag/hpc/).
* Also see [what's new in Batch](https://azure.microsoft.com/updates/?service=batch) or subscribe to the [RSS feed](https://azure.microsoft.com/updates/feed/?service=batch).

<!--Image references-->
[parallel]: ./media/virtual-machines-common-high-performance-computing/parallel.png
[coupled]: ./media/virtual-machines-common-high-performance-computing/coupled.png
[iaas_cluster]: ./media/virtual-machines-common-high-performance-computing/iaas_cluster.png
[burst_cluster]: ./media/virtual-machines-common-high-performance-computing/burst_cluster.png
[batch_proc]: ./media/virtual-machines-common-high-performance-computing/batch_proc.png
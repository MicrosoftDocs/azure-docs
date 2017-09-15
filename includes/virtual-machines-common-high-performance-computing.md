Organizations have large-scale computing needs. These Big Compute workloads include engineering design and analysis, financial risk calculations, image rendering, complex modeling, Monte Carlo simulations, and more. 

With Azure, you can run your high performance computing (HPC) and batch workloads on clusters of Azure virtual machines, using your choice of Azure infrastructure services or managed services. Azure gives you the flexibility to scale compute resources to thousands of VMs or cores and then scale down when you need fewer resources. 

Azure HPC solutions efficiently run compute-intensive Linux and Windows workloads, from parallel batch jobs to traditional HPC simulations. Leading HPC applications are supported to run in Azure VMs, and you can take advantage of specialized VM sizes and images designed for compute-intensive jobs. 


## Solution architectures

Sample compute-intensive solution architectures in Azure include:

* Run HPC applications in virtual machines or [virtual machine scale sets](../articles/virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md), using a Linux or Windows cluster or grid manager of your choice [Learn more](https://azure.microsoft.com/en-us/solutions/architecture/hpc-cluster/)
* Create hybrid solutions that extend an on-premises HPC cluster to offload ("burst") peak workloads to Azure VMs [Learn more](https://azure.microsoft.com/en-us/solutions/architecture/hpc-on-prem-burst/)
* Use the managed and scalable Azure [Batch](https://azure.microsoft.com/services/batch/) service to run compute-intensive workloads, without managing underlying infrastructure [Learn more](https://azure.microsoft.com/en-us/solutions/architecture/hpc-big-compute-saas/)

## HPC cluster and grid solutions
Deploy or extend familiar HPC workload management tools to Azure virtual machines and run your compute-intensive workloads. Options include open-source tools such as the [Slurm workload manager](https://slurm.schedmd.com/), and cluster or grid managers from Microsoft and other publishers.

### Linux and OSS cluster solutions
Use Azure Resource Manager templates to deploy Linux HPC cluster solutions in virtual machines or virtual machine scale sets, including:

* [Slurm](https://azure.microsoft.com/documentation/templates/slurm/)
* [Torque](https://azure.microsoft.com/documentation/templates/torque-cluster/)
* [PBS Professional](https://github.com/xpillons/azure-hpc/tree/master/Compute-Grid-Infra)

Also see the collection of [5-click templates](https://github.com/tanewill/5clickTemplates).

### Grid managers
Microsoft partners with commercial grid managers to make their solutions available in Azure VMs. Examples include:

* [IBM Spectrum Symphony and Symphony LSF](https://azure.microsoft.com/blog/ibm-and-microsoft-azure-support-spectrum-symphony-and-spectrum-lsf/)
* [TIBCO DataSynapse GridServer](https://azure.microsoft.com/blog/tibco-datasynapse-comes-to-the-azure-marketplace/) 
* [Bright Cluster Manager](http://www.brightcomputing.com/technology-partners/microsoft)
* [Univa Grid Engine](http://www.univa.com/products/grid-engine)

### Microsoft HPC Pack
[HPC Pack](https://technet.microsoft.com/library/cc514029(v=ws.11).aspx) is Microsoft's free HPC solution built on Microsoft Azure and Windows Server technologies. HPC Pack offers several options to run in [Windows](../articles/virtual-machines/windows/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)  and [Linux](../articles/virtual-machines/linux/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) VMs. 

Learn how to:

* [Create an HPC Pack 2016 cluster in Azure](../articles/virtual-machines/windows/hpcpack-2016-cluster.md)
* [Burst to Azure with HPC Pack](https://technet.microsoft.com/library/gg481749(v=ws.11).aspx)




## Azure Batch
[Batch](../articles/batch/batch-technical-overview.md) is a platform service for running large-scale parallel and high-performance computing (HPC) applications efficiently in the cloud. Azure Batch schedules compute-intensive work to run on a managed pool of virtual machines, and can automatically scale compute resources to meet the needs of your jobs. 

Use the Batch SDKs and tools to integrate HPC applications or container workloads with Azure, stage data to Azure, and build job execution pipelines. You can also use surplus (low-priority) Azure VM capacity at a [reduced price](https://azure.microsoft.com/pricing/details/batch/), significantly reducing the cost of running some workloads in Batch.

Learn how to:

* [Get started developing with Batch](../articles/batch/batch-dotnet-get-started.md)
* [Use Azure Batch code samples](https://github.com/Azure/azure-batch-samples)
* [Use low-priority VMs with Batch (preview)](../articles/batch/batch-low-pri-vms.md)
* [Run containerized HPC workloads with Batch Shipyard](https://github.com/Azure/batch-shipyard)
* [Use the R language with Batch](https://github.com/Azure/doAzureParallel)

## HPC and GPU VM sizes
Azure offers a range of sizes for [Linux](../articles/virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) and [Windows](../articles/virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) VMs, including sizes designed for compute-intensive workloads. For example, H16r and H16mr VMs can connect to a high throughput back-end RDMA network. This cloud network can improve the performance of tightly coupled parallel applications running under [Microsoft MPI](https://msdn.microsoft.com/library/bb524831.aspx) or Intel MPI. N-series VMs feature NVIDIA GPUs designed for compute-intensive or graphics-intensive applications including artificial intelligence (AI) learning and visualization. 

Learn more:

* High performance compute sizes for [Linux](../articles/virtual-machines/linux/sizes-hpc.md) and [Windows](../articles/virtual-machines/windows/sizes-hpc.md) VMs 
* GPU-enabled sizes for [Linux](../articles/virtual-machines/linux/sizes-gpu.md) and [Windows](../articles/virtual-machines/windows/sizes-gpu.md) VMs 

Learn how to:

* [Set up a Linux RDMA cluster to run MPI applications](../articles/virtual-machines/linux/classic/rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json)
* [Set up a Windows RDMA cluster with Microsoft HPC Pack to run MPI applications](../articles/virtual-machines/windows/classic/hpcpack-rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
* [Use compute-intensive VMs in Batch pools](../articles/batch/batch-pool-compute-intensive-sizes.md)

## HPC images

Visit the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/) for Linux and Windows VM images designed for HPC. Examples include:

* [RogueWave CentOS-based HPC](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/RogueWave.CentOSbased73HPC?tab=Overview)
* [SUSE Linux Enterprise Server for HPC](https://azure.microsoft.com/marketplace/partners/suse/suselinuxenterpriseserver12optimizedforhighperformancecompute/)
* [TIBCO Grid Server 6.2.0 Engine](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/tibco-software.gridserverlinuxengine?tab=Overview)
* [Azure Data Science VM for Windows and Linux](../articles/machine-learning/machine-learning-data-science-virtual-machine-overview.md)


 
## HPC applications

Run custom or commercial HPC applications in Azure. Several are benchmarked to scale efficiently with additional VMs or compute cores. The following sections are examples.

> [!IMPORTANT]
> Check with the vendor of any commercial application for licensing or other restrictions for running in the cloud. Not all vendors offer pay-as-you-go licensing. You might need a licensing server in the cloud for your solution, or connect to an on-premises license server.

### Engineering applications


* [Altair RADIOSS](https://azure.microsoft.com/blog/availability-of-altair-radioss-rdma-on-microsoft-azure/)
* [ANSYS CFD](https://azure.microsoft.com/blog/ansys-cfd-and-microsoft-azure-perform-the-best-hpc-scalability-in-the-cloud/)
* [MATLAB Distributed Computing Server](../articles/virtual-machines/windows/matlab-mdcs-cluster.md)
* [StarCCM+](https://blogs.msdn.microsoft.com/azurecat/2017/07/07/run-star-ccm-in-an-azure-hpc-cluster/)
* [OpenFOAM](https://simulation.azure.com/casestudies/Team-182-ABB-UC-Final.pdf)



### Graphics and rendering

* [Autodesk Maya, 3ds Max, and Arnold](../articles/batch/batch-rendering-service.md) on Azure Batch (preview)

### AI and deep learning

* [Microsoft Cognitive Toolkit](https://docs.microsoft.com/cognitive-toolkit/cntk-on-azure)
* [Deep learning toolkit for Data Science VM](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.dsvm-deep-learning)
* [Batch Shipyard recipes for deep learning](https://github.com/Azure/batch-shipyard/tree/master/recipes#deeplearning)

## Solution partners

Partners who develop or deliver batch and HPC applications in Azure include:

* [Cycle Computing](https://cyclecomputing.com/) (now [joined with Microsoft](https://blogs.microsoft.com/blog/2017/08/15/microsoft-acquires-cycle-computing-accelerate-big-computing-cloud/))
* [Rescale](https://www.rescale.com/azure/)
* [UberCloud](https://www.theubercloud.com/)

## HPC storage

Large-scale Batch and HPC workloads have demands for data storage and access that exceed the capabilities of traditional cloud file systems. You can implement parallel file system solutions in Azure such as [Lustre](http://lustre.org/) and [BeeGFS](http://www.beegfs.com/content/).

Learn more:

* [Parallel file systems for HPC storage on Azure](https://blogs.msdn.microsoft.com/azurecat/2017/03/17/parallel-file-systems-for-hpc-storage-on-azure/)


## Related Azure services

Azure virtual machines, virtual machine scale sets, Batch, and related compute services are the foundation of most Azure HPC solutions. However, your solution can take advantage of many related Azure services. Here is a partial list:

### Storage

* [Blob, table, and queue storage](../articles/storage/storage-introduction.md)
* [File storage](../articles/storage/storage-files-introduction.md)

### Data and analytics
* [HDInsight](../articles/hdinsight/hdinsight-hadoop-introduction.md) for Hadoop clusters on Azure
* [Data Factory](../articles/data-factory/data-factory-introduction.md)
* [Data Lake Store](../articles/data-lake-store/data-lake-store-overview.md)
* [Machine Learning](../articles/machine-learning/machine-learning-what-is-machine-learning.md)
* [SQL Database](../articles/sql-database/sql-database-technical-overview.md)

### Networking
* [Virtual Network](../articles/virtual-network/virtual-networks-overview.md)
* [ExpressRoute](../articles/expressroute/expressroute-introduction.md)

### Containers
* [Container Service](../articles/container-service/dcos-swarm/container-service-intro.md)
* [Container Registry](../articles/container-registry/container-registry-intro.md)



## Customer stories

Here are examples of customers that have solved business problems with Azure HPC solutions:

* [ANEO](https://customers.microsoft.com/story/it-provider-finds-highly-scalable-cloud-based-hpc-redu) 
* [AXA Global P&C](https://customers.microsoft.com/story/axa-global-p-and-c)
* [Axioma](https://customers.microsoft.com/story/axioma-delivers-fintechs-first-born-in-the-cloud-multi-asset-class-enterprise-risk-solution)
* [d3View](https://customers.microsoft.com/story/big-data-solution-provider-adopts-new-cloud-gains-thou)
* [Hymans Robertson](https://customers.microsoft.com/story/hymans-robertson)
* [MetLife](https://enterprise.microsoft.com/en-us/customer-story/industries/insurance/metlife/)
* [Microsoft Research](https://customers.microsoft.com/doclink/fast-lmm-and-windows-azure-put-genetics-research-on-fa)
* [Milliman](https://customers.microsoft.com/story/actuarial-firm-works-to-transform-insurance-industry-w)
* [Mitsubishi UFJ Securities International](https://customers.microsoft.com/story/powering-risk-compute-grids-in-the-cloud)
* [Schlumberger](http://azure.microsoft.com/blog/big-compute-for-large-engineering-simulations)
* [Towers Watson](https://customers.microsoft.com/story/insurance-tech-provider-delivers-disruptive-solutions)


## Next steps
* Learn more about Big Compute solutions for
 [engineering simulation](https://simulation.azure.com/), [rendering](https://simulation.azure.com/), and [banking and capital markets](https://finance.azure.com/).
* For the latest announcements, see the [Microsoft HPC and Batch team blog](http://blogs.technet.com/b/windowshpc/) and the [Azure blog](https://azure.microsoft.com/blog/tag/hpc/).



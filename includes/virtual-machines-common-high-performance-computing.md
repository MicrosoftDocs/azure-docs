---
 title: include file
 description: include file
 services: virtual-machines-linux, virtual-machines-windows
 author: dlepow
 ms.service: multiple
 ms.topic: include
 ms.date: 07/02/2018
 ms.author: danlep
 ms.custom: include file
---

Organizations have large-scale computing needs. These Big Compute workloads include engineering design and analysis, financial risk calculations, image rendering, complex modeling, Monte Carlo simulations, and more. 

Use the Azure cloud to efficiently run compute-intensive Linux and Windows workloads, from parallel batch jobs to traditional HPC simulations. Run your HPC and batch workloads on Azure infrastructure, with your choice of compute services, grid managers, Marketplace solutions, and vendor-hosted (SaaS) applications. Azure provides flexible solutions to distribute work and scale to thousands of VMs or cores and then scale down when you need fewer resources. 



## Solution options



* **Do-it-yourself solutions**
    * Set up your own cluster environment in Azure virtual machines or [virtual machine scale sets](../articles/virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md). 
    * Lift and shift an on-premises cluster, or deploy a new cluster in Azure for additional capacity. 
    * Use Azure Resource Manager templates to deploy leading [workload managers](#workload-managers), infrastructure, and [applications](#hpc-applications). 
    * Choose [HPC and GPU VM sizes](#hpc-and-gpu-sizes) that include specialized hardware and network connections for MPI or GPU workloads. 
    * Add [high performance storage](#hpc-storage) for I/O-intensive workloads.
* **Hybrid solutions**
    * Extend your on-premises solution to offload ("burst") peak workloads to Azure infrastructure
    * Use cloud compute on-demand with your existing [workload manager](#workload-manager).
    * Take advantage of [HPC and GPU VM sizes](#hpc-and-gpu-sizes) for MPI or GPU workloads.
* **Big Compute solutions as a service**
    * Develop custom Big Compute solutions and workflows using [Azure Batch](#azure-batch) and related [Azure services](#related-azure-services).
    * Run Azure-enabled engineering and simulation solutions from vendors including [Altair](http://www.altair.com/), [Rescale](https://www.rescale.com/azure/), and [Cycle Computing](https://cyclecomputing.com/) (now [joined with Microsoft](https://blogs.microsoft.com/blog/2017/08/15/microsoft-acquires-cycle-computing-accelerate-big-computing-cloud/)).
    * Use a [Cray supercomputer](https://www.cray.com/solutions/supercomputing-as-a-service/cray-in-azure) as a service hosted in Azure.
* **Marketplace solutions**
    * Use the scale of [HPC applications](#hpc-applications) and [solutions](#marketplace-solutions) offered in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/). 
    


The following sections provide more information about the supporting technologies and links to guidance.



## Marketplace solutions

Visit the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/) for Linux and Windows VM images and solutions designed for HPC. Examples include:

* [RogueWave CentOS-based HPC](https://azuremarketplace.microsoft.com/marketplace/apps/RogueWave.CentOSbased73HPC?tab=Overview)
* [SUSE Linux Enterprise Server for HPC](https://azure.microsoft.com/marketplace/partners/suse/suselinuxenterpriseserver12optimizedforhighperformancecompute/)
*  [TIBCO Grid Server Engine](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/tibco-software.gridserverlinuxengine?tab=Overview)
* [Azure Data Science VM for Windows and Linux](../articles/machine-learning/machine-learning-data-science-virtual-machine-overview.md)
* [D3View](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/xfinityinc.d3view-v5?tab=Overview)
* [UberCloud](https://azure.microsoft.com/search/marketplace/?q=ubercloud)
* [Intel Cloud Edition for Lustre](https://azuremarketplace.microsoft.com/marketplace/apps/intel.intel-cloud-edition-gs)


 
## HPC applications

Run custom or commercial HPC applications in Azure. Several examples in this section are benchmarked to scale efficiently with additional VMs or compute cores. Visit the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace) for ready-to-deploy solutions.

> [!NOTE]
> Check with the vendor of any commercial application for licensing or other restrictions for running in the cloud. Not all vendors offer pay-as-you-go licensing. You might need a licensing server in the cloud for your solution, or connect to an on-premises license server.

### Engineering applications


* [Altair RADIOSS](https://azure.microsoft.com/blog/availability-of-altair-radioss-rdma-on-microsoft-azure/)
* [ANSYS CFD](https://azure.microsoft.com/blog/ansys-cfd-and-microsoft-azure-perform-the-best-hpc-scalability-in-the-cloud/)
* [MATLAB Distributed Computing Server](../articles/virtual-machines/windows/matlab-mdcs-cluster.md)
* [StarCCM+](https://blogs.msdn.microsoft.com/azurecat/2017/07/07/run-star-ccm-in-an-azure-hpc-cluster/)
* [OpenFOAM](https://simulation.azure.com/casestudies/Team-182-ABB-UC-Final.pdf)



### Graphics and rendering

* [Autodesk Maya, 3ds Max, and Arnold](../articles/batch/batch-rendering-service.md) on Azure Batch 

### AI and deep learning

* [Batch AI](../articles/batch-ai/overview.md) training for deep learning models
* [Microsoft Cognitive Toolkit](https://docs.microsoft.com/cognitive-toolkit/cntk-on-azure)
* [Deep Learning VM](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-ads.dsvm-deep-learning)
* [Batch Shipyard recipes for deep learning](https://github.com/Azure/batch-shipyard/tree/master/recipes#deeplearning)






## HPC and GPU VM sizes
Azure offers a range of sizes for [Linux](../articles/virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) and [Windows](../articles/virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) VMs, including sizes designed for compute-intensive workloads. For example, H16r and H16mr VMs can connect to a high throughput back-end RDMA network. This cloud network can improve the performance of tightly coupled parallel applications running under [Microsoft MPI](https://msdn.microsoft.com/library/bb524831.aspx) or Intel MPI. 

N-series VMs feature NVIDIA GPUs designed for compute-intensive or graphics-intensive applications including artificial intelligence (AI) learning and visualization. 

Learn more:

* High performance compute sizes for [Linux](../articles/virtual-machines/linux/sizes-hpc.md) and [Windows](../articles/virtual-machines/windows/sizes-hpc.md) VMs 
* GPU-enabled sizes for [Linux](../articles/virtual-machines/linux/sizes-gpu.md) and [Windows](../articles/virtual-machines/windows/sizes-gpu.md) VMs 

Learn how to:

* [Set up a Linux RDMA cluster to run MPI applications](../articles/virtual-machines/linux/classic/rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json)
* [Set up a Windows RDMA cluster with Microsoft HPC Pack to run MPI applications](../articles/virtual-machines/windows/classic/hpcpack-rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
* [Use compute-intensive VMs in Batch pools](../articles/batch/batch-pool-compute-intensive-sizes.md)



## Azure Batch
[Batch](../articles/batch/batch-technical-overview.md) is a platform service for running large-scale parallel and high-performance computing (HPC) applications efficiently in the cloud. Azure Batch schedules compute-intensive work to run on a managed pool of virtual machines, and can automatically scale compute resources to meet the needs of your jobs. 

SaaS providers or developers can use the Batch SDKs and tools to integrate HPC applications or container workloads with Azure, stage data to Azure, and build job execution pipelines. 

Learn how to:

* [Get started developing with Batch](../articles/batch/quick-run-dotnet.md)
* [Use Azure Batch code samples](https://github.com/Azure/azure-batch-samples)
* [Use low-priority VMs with Batch](../articles/batch/batch-low-pri-vms.md)
* [Run containerized HPC workloads with Batch Shipyard](https://github.com/Azure/batch-shipyard)
* [Run parallel R workloads on Batch](https://github.com/Azure/doAzureParallel)
* [Run on-demand Spark jobs on Batch](https://github.com/Azure/aztk)

## Workload managers

The following are examples of cluster and workload managers that can run in Azure infrastructure. Create stand-alone clusters in Azure VMs or burst to Azure VMs from an on-premises cluster. 
* [Alces Flight Compute](https://azuremarketplace.microsoft.com/marketplace/apps/alces-flight-limited.alces-flight-compute-solo?tab=Overview)
* [TIBCO DataSynapse GridServer](https://azure.microsoft.com/blog/tibco-datasynapse-comes-to-the-azure-marketplace/) 
* [Bright Cluster Manager](http://www.brightcomputing.com/technology-partners/microsoft)
* [IBM Spectrum Symphony and Symphony LSF](https://azure.microsoft.com/blog/ibm-and-microsoft-azure-support-spectrum-symphony-and-spectrum-lsf/)
* [PBS Pro](http://pbspro.org)
* [Microsoft HPC Pack](https://technet.microsoft.com/library/mt744885.aspx) - see options to run in [Windows](../articles/virtual-machines/windows/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)  and [Linux](../articles/virtual-machines/linux/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) VMs 



## HPC storage

Large-scale Batch and HPC workloads have demands for data storage and access that exceed the capabilities of traditional cloud file systems. Implement parallel file system solutions in Azure such as [Lustre](http://lustre.org/) and [BeeGFS](http://www.beegfs.com/content/).

Learn more:

* [Parallel virtual file systems on Azure](https://azure.microsoft.com/resources/parallel-virtual-file-systems-on-microsoft-azure/)
* High performance cloud storage solutions from [Avere](http://www.averesystems.com/about-us/about-avere) (now [joined with Microsoft](https://blogs.microsoft.com/blog/2018/01/03/microsoft-to-acquire-avere-systems-accelerating-high-performance-computing-innovation-for-media-and-entertainment-industry-and-beyond/))


## Related Azure services

Azure virtual machines, virtual machine scale sets, Batch, and related compute services are the foundation of most Azure HPC solutions. However, your solution can take advantage of many related Azure services. Here is a partial list:

### Storage

* [Blob, table, and queue storage](../articles/storage/storage-introduction.md)
* [File storage](../articles/storage/storage-files-introduction.md)

### Data and analytics
* [HDInsight](../articles/hdinsight/hadoop/apache-hadoop-introduction.md)
* [Data Factory](../articles/data-factory/introduction.md)
* [Data Lake Storage Gen1](../articles/data-lake-store/data-lake-store-overview.md)
* [Databricks](../articles/azure-databricks/what-is-azure-databricks.md)
* [SQL Database](../articles/sql-database/sql-database-technical-overview.md)

### AI and machine learning
* [Machine Learning Services](../articles/machine-learning/service/overview-what-is-azure-ml.md)
* [Batch AI](../articles/batch-ai/overview.md)
* [Genomics](../articles/genomics/overview-what-is-genomics.md)

### Networking
* [Virtual Network](../articles/virtual-network/virtual-networks-overview.md)
* [ExpressRoute](../articles/expressroute/expressroute-introduction.md)

### Containers
* [Container Service](../articles/container-service/dcos-swarm/container-service-intro.md)
* [Azure Kubernetes Service (AKS)](../articles/aks/intro-kubernetes.md)
* [Container Registry](../articles/container-registry/container-registry-intro.md)



## Customer stories

Examples of customers that have solved business problems with Azure HPC solutions:

* [ANEO](https://customers.microsoft.com/story/it-provider-finds-highly-scalable-cloud-based-hpc-redu) 
* [AXA Global P&C](https://customers.microsoft.com/story/axa-global-p-and-c)
* [Axioma](https://customers.microsoft.com/story/axioma-delivers-fintechs-first-born-in-the-cloud-multi-asset-class-enterprise-risk-solution)
* [d3View](https://customers.microsoft.com/story/big-data-solution-provider-adopts-new-cloud-gains-thou)
* [EFS](https://customers.microsoft.com/story/efs-professionalservices-azure)
* [Hymans Robertson](https://customers.microsoft.com/story/hymans-robertson)
* [MetLife](https://enterprise.microsoft.com/en-us/customer-story/industries/insurance/metlife/)
* [Microsoft Research](https://customers.microsoft.com/doclink/fast-lmm-and-windows-azure-put-genetics-research-on-fa)
* [Milliman](https://customers.microsoft.com/story/actuarial-firm-works-to-transform-insurance-industry-w)
* [Mitsubishi UFJ Securities International](https://customers.microsoft.com/story/powering-risk-compute-grids-in-the-cloud)
* [NeuroInitiative](https://customers.microsoft.com/en-us/story/neuroinitiative-health-provider-azure)
* [Schlumberger](http://azure.microsoft.com/blog/big-compute-for-large-engineering-simulations)
* [Towers Watson](https://customers.microsoft.com/story/insurance-tech-provider-delivers-disruptive-solutions)


## Next steps
* Learn more about Big Compute solutions for
 [engineering simulation](https://simulation.azure.com/), [rendering](https://azure.microsoft.com/solutions/big-compute/rendering/), [banking and capital markets](https://finance.azure.com/), and [genomics](https://enterprise.microsoft.com/en-us/industries/health/genomics/).
* For the latest announcements, see the [Microsoft HPC and Batch team blog](http://blogs.technet.com/b/windowshpc/) and the [Azure blog](https://azure.microsoft.com/blog/tag/hpc/).

* Use the managed and scalable Azure [Batch](https://azure.microsoft.com/services/batch/) service to run compute-intensive workloads, without managing underlying infrastructure [Learn more](https://azure.microsoft.com/solutions/architecture/hpc-big-compute-saas/)




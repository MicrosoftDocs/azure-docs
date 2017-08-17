
Organizations have large-scale computing workloads: engineering design and analysis, image rendering, complex modeling, Monte Carlo simulations, financial risk calculations, and more. With Azure, you can run your high performance computing (HPC) and batch workloads on clusters of Azure virtual machines, using either core infrastructure services or managed services. Depending on your needs, you can scale compute resources in Azure to thousands of cores and then scale down when you need fewer resources. 

Azure HPC solutions efficiently run compute-intensive Linux and Windows workloads, from instrinsically parallel batch jobs to traditional HPC simulations. Leading HPC applications are benchmarked to run in Azure, and you can take advantage of specialized VM sizes and images designed for compute-instensive jobs. 



## Solution architectures

Sample HPC solution architectures in Azure include the following:

* Run HPC applications entirely in Azure virtual machines or VM scale sets, using a Linux or Windows cluster or grid manager of your choice [Learn more](https://azure.microsoft.com/en-us/solutions/architecture/hpc-cluster/)
* Create hybrid solutions that extend an on-premises HPC cluster to offload ("burst") peak workloads to Azure VMs [Learn more](https://azure.microsoft.com/en-us/solutions/architecture/hpc-on-prem-burst/)
* Use the managed and scalable Azure [Batch](../articles/batch/) service to run compute-intensive workloads, without managing underlying infrastructure [Learn more](https://azure.microsoft.com/en-us/solutions/architecture/hpc-big-compute-saas/)


 




## HPC cluster and grid solutions
Deploy or extend familiar HPC workload management tools to Azure virtual machines and run your compute-intensive workloads. Options include open-source tools such as the [Slurm workload manager](https://slurm.schedmd.com/), and cluster or grid managers from Microsoft and other publishers.

### Linux and OSS cluster solutions
Use Azure Resource Manager templates to deploy HPC cluster solutions on Linux VMs:

* [Slurm](https://azure.microsoft.com/documentation/templates/slurm/)
* [Torque](https://azure.microsoft.com/documentation/templates/torque-cluster/)
* [PBS Professional](https://github.com/xpillons/azure-hpc/tree/master/Compute-Grid-Infra)







### Grid managers

Microsoft partners with leading grid managers to make their solutions available in Azure virtual machines. Examples include:


* [IBM Spectrum Symphony and Symphony LSF](https://azure.microsoft.com/blog/ibm-and-microsoft-azure-support-spectrum-symphony-and-spectrum-lsf/)
* [TIBCO DataSynapse GridServer](https://azure.microsoft.com/blog/tibco-datasynapse-comes-to-the-azure-marketplace/) 
* [Bright Cluster Manager](http://www.brightcomputing.com/technology-partners/microsoft)
* [Univa Grid Engine](http://www.univa.com/products/grid-engine)

### Microsoft HPC Pack
[HPC Pack](https://technet.microsoft.com/library/cc514029(v=ws.11).aspx) is Microsoft's free HPC solution built on Microsoft Azure and Windows Server technologies, capable of running Windows and Linux HPC workloads. 

Learn more about running HPC Pack on clusters of Azure [Linux](../articles/virtual-machines/linux/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) and [Windows](../articles/virtual-machines/windows/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) virtual machines. 

## Azure Batch
[Batch](../articles/batch/) is a platform service for running large-scale parallel and high-performance computing (HPC) applications efficiently in the cloud. Azure Batch schedules compute-intensive work to run on a managed pool of virtual machines, and can automatically scale compute resources to meet the needs of your jobs. Use the Batch SDKs and tools to integrate client applications with Azure, stage data to Azure, and build job execution pipelines. Batch also lets you use surplus Azure VM capacity at a [reduced price](https://azure.microsoft.com/pricing/details/batch/), significantly reducing the cost of some batch and HPC workloads.

Learn how to:

* [Get started developing with Batch](../articles/batch/batch-dotnet-get-started.md)
* [Use low-priority VMs with Batch (preview)](../articles/batch/batch-low-pri-vms.md)

## HPC and GPU VM sizes
Azure offers a range of sizes for [Linux](../articles/virtual-machines/linux/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) and [Windows](../articles/virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) VMs, including sizes designed for compute-intensive workloads. Some VM sizes such as the H16r and H16mr can connect to a high throughput back-end RDMA network. This cloud network can improve the performance of tightly coupled parallel applications running under [Microsoft MPI](https://msdn.microsoft.com/library/bb524831.aspx) or Intel MPI. N-series VMs feature NVIDIA GPUs designed for compute- and graphics-intensive workloads. 

Learn more:

* High performance compute VM sizes ([Linux](../articles/virtual-machines/linux/sizes-hpc.md), [Windows](../articles/virtual-machines/windows/sizes-hpc.md)) 

* GPU-enabled VM sizes ([Linux](../articles/virtual-machines/linux/sizes-gpu.md), [Windows](../articles/virtual-machines/windows/sizes-gpu.md)) 

Learn how to:

* [Set up a Linux RDMA cluster to run MPI applications](../articles/virtual-machines/linux/classic/rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json)
* [Set up a Windows RDMA cluster with Microsoft HPC Pack to run MPI applications](../articles/virtual-machines/windows/classic/hpcpack-rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)
* [Use compute-intensive VMs in Batch pools](../articles/batch/batch-pool-compute-intensive-sizes.md)

## HPC images

* [Data Science Virtual Machine](../articles/machine-learning/machine-learning-data-science-virtual-machine-overview.md)

 
## HPC applications
> [!IMPORTANT]
> Check with the vendor of any commercial application for licensing or other restrictions for running in the cloud. Not all vendors offer pay-as-you-go licensing. You might need a licensing server in the cloud for your solution, or connect to an on-premises license server.

### Engineering applications

Supported engineering HPC applications in Azure include:

* [Altair RADIOSS](https://azure.microsoft.com/blog/availability-of-altair-radioss-rdma-on-microsoft-azure/)
* [ANSYS CFD](https://azure.microsoft.com/blog/ansys-cfd-and-microsoft-azure-perform-the-best-hpc-scalability-in-the-cloud/)
* [MATLAB Distributed Computing Server](../articles/virtual-machines/windows/matlab-mdcs-cluster.md)
* [StarCCM+](https://blogs.msdn.microsoft.com/azurecat/2017/07/07/run-star-ccm-in-an-azure-hpc-cluster/)
* [OpenFOAM](https://simulation.azure.com/casestudies/Team-182-ABB-UC-Final.pdf)

Learn more about industry solutions for:
* [Banking and capital markets](https://finance.azure.com/)
* [Engineering](https://simulation.azure.com/)

### Graphics and rendering

* [Autodesk Maya, 3ds Max, and Arnold](../articles/batch/batch-rendering-service.md) on Azure Batch (preview)

### AI and deep learning

* [Microsoft Cognitive Toolkit](https://docs.microsoft.com/cognitive-toolkit/cntk-on-azure)
## HPC storage

Batch and HPC workloads often have demands for data storage and access that exceed the capabilities of traditional cloud file systems. You can implement parallel file system solutions in Azure such as [Lustre](http://lustre.org/) and [BeeGFS](http://www.beegfs.com/content/).

Learn more:

* [Parallel file systems for HPC storage on Azure](https://blogs.msdn.microsoft.com/azurecat/2017/03/17/parallel-file-systems-for-hpc-storage-on-azure/)

## Samples and demos
* [Azure Batch C# and Python code samples](https://github.com/Azure/azure-batch-samples)
* [Batch Shipyard](https://azure.github.io/batch-shipyard/) toolkit for easy deployment of batch-style Dockerized workloads to Azure Batch
* [doAzureParallel](http://www.github.com/Azure/doAzureParallel) R package, built on top of Azure Batch
* [Test drive SUSE Linux Enterprise Server for HPC](https://azure.microsoft.com/marketplace/partners/suse/suselinuxenterpriseserver12optimizedforhighperformancecompute/)


## Partner solutions

Partners who develop or deliver batch and HPC applications in Azure include:

* [Cycle Computing](https://cyclecomputing.com/) - now [joining Microsoft](https://blogs.microsoft.com/blog/2017/08/15/microsoft-acquires-cycle-computing-accelerate-big-computing-cloud/)
* [Rescale](https://www.rescale.com/azure/)
* [UberCloud](https://www.theubercloud.com/)

## Related Azure services

### Compute

* [Virtual Machine Scale Sets](../articles/virtual-machine-scale-sets/)
* [Cloud Services](../articles/cloud-services/)
* [App Service](../articles/app-service/)
* [Functions](../articles/functions/)


### Data and analysis
* [Data Factory](../articles/data-factory/)
* [Data Lake Store](https://azure.microsoft.com/services/data-lake-store/)
* [Machine Learning](../articles/machine-learning/)
* [HDInsight](../articles/hdinsight/)
* [SQL Database](../articles/sql-database/)

### Networking
* [Virtual Network](../articles/virtual-network/)
* [ExpressRoute](../articles/expressroute/)





## Customer stories
* [ANEO](https://customers.microsoft.com/story/it-provider-finds-highly-scalable-cloud-based-hpc-redu) 
* [AXA Global P&C](https://customers.microsoft.com/story/axa-global-p-and-c)
* [Axioma](https://customers.microsoft.com/story/axioma-delivers-fintechs-first-born-in-the-cloud-multi-asset-class-enterprise-risk-solution)
* [d3View](https://customers.microsoft.com/story/big-data-solution-provider-adopts-new-cloud-gains-thou)
* [Hymans Robertson](https://customers.microsoft.com/story/hymans-robertson)
* [MetLife](https://enterprise.microsoft.com/customer-story/industries/insurance/metlife/)
* [Microsoft Research](https://customers.microsoft.com/doclink/fast-lmm-and-windows-azure-put-genetics-research-on-fa)
* [Milliman](https://customers.microsoft.com/story/actuarial-firm-works-to-transform-insurance-industry-w)
* [Mitsubishi UFJ Securities International](https://customers.microsoft.com/story/powering-risk-compute-grids-in-the-cloud)
* [Schlumberger](http://azure.microsoft.com/blog/big-compute-for-large-engineering-simulations)
* [Towers Watson](https://customers.microsoft.com/story/insurance-tech-provider-delivers-disruptive-solutions)



























## Architecture blueprints
* [HPC and data orchestration using Azure Batch and Azure Data Factory](http://go.microsoft.com/fwlink/?linkid=717686) (PDF) and [article](../data-factory/data-factory-data-processing-using-batch.md)



## Next steps
* For the latest announcements, see the [Microsoft HPC and Batch team blog](http://blogs.technet.com/b/windowshpc/) and the [Azure blog](https://azure.microsoft.com/blog/tag/hpc/).



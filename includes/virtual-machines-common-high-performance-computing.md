
Organizations have large-scale computing workloads: engineering design and analysis, image rendering, complex modeling, Monte Carlo simulations, financial risk calculations, and others. With Azure, you can run your high performance computing (HPC) and batch workloads on Azure virtual machines and related compute and infrastructure services. Depending on your needs, you can scale compute resources in Azure to thousands of cores and then scale down when you need fewer resources. 



## Solution architectures


* Run HPC application entirely in Azure, using HPC cluster tools of your choice 
* Create hybrid solutions, extending an on-premises HPC cluster to offload peak workloads to the cloud
* Use managed and scalable Azure compute services such as [Batch](https://azure.microsoft.com/documentation/services/batch/) to run compute-intensive workloads without having to deploy and manage compute infrastructure

Learn more about:

* [Big compute solutions as a service](https://azure.microsoft.com/en-us/solutions/architecture/hpc-big-compute-saas/)
* [Deploy an HPC cluster in the cloud](https://azure.microsoft.com/en-us/solutions/architecture/hpc-cluster/)
* [Burst an on-premises cluster to the cloud](https://azure.microsoft.com/en-us/solutions/architecture/hpc-on-prem-burst/)

| Scenario | Why choose it? |
| --- | --- | --- |
| **Burst an HPC cluster to Azure**<br/><br/>[![Cluster burst][burst_cluster]](./media/virtual-machines-common-high-performance-computing/burst_cluster.png) <br/><br/> Learn more:<br/>• [Burst to Azure worker instances with HPC Pack](https://technet.microsoft.com/library/gg481749.aspx)<br/><br/>• [Set up a hybrid compute cluster with HPC Pack](../cloud-services/cloud-services-setup-hybrid-hpcpack-cluster.md)<br/><br/>• [Burst to Azure Batch with HPC Pack](https://technet.microsoft.com/library/mt612877.aspx)<br/><br/> |• Combine your [Microsoft HPC Pack](https://technet.microsoft.com/library/cc514029) or other on-premises cluster with additional Azure resources in a hybrid solution.<br/><br/>• Extend your Big Compute workloads to run on Platform as a Service (PaaS) virtual machine instances (currently Windows Server only).<br/><br/>• Access an on-premises license server or data store by using an optional Azure virtual network |
| **Create an HPC cluster entirely in Azure**<br/><br/>[![Cluster in IaaS][iaas_cluster]](./media/virtual-machines-common-high-performance-computing/iaas_cluster.png)<br/><br/>Learn more:<br/>• [HPC cluster solutions in Azure](big-compute-resources.md)<br/><br/> |• Quickly and consistently deploy your applications and cluster tools on standard or custom Windows or Linux infrastructure as a service (IaaS) virtual machines.<br/><br/>• Run various Big Compute workloads by using the job scheduling solution of your choice.<br/><br/>• Use additional Azure services including networking and storage to create complete cloud-based solutions. |
| **Scale out a parallel application to Azure**<br/><br/>[![Azure Batch][batch_proc]](./media/virtual-machines-common-high-performance-computing/batch_proc.png)<br/><br/>Learn more:<br/>• [Basics of Azure Batch](batch-technical-overview.md)<br/><br/>• [Get started with the Azure Batch library for .NET](batch-dotnet-get-started.md) |• Develop with [Azure Batch](https://azure.microsoft.com/documentation/services/batch/) to scale out various Big Compute workloads to run on pools of Windows or Linux virtual machines.<br/><br/>• Use an Azure platform service to manage deployment and autoscaling of virtual machines, job scheduling, disaster recovery, data movement, dependency management, and application deployment. |







## HPC cluster solutions
Deploy or extend your existing Windows or Linux HPC cluster to Azure to run your compute intensive workloads.  Clustering and job scheduling tools for Windows-based and Linux-based clusters can migrate well to Azure. For example, [Microsoft HPC Pack](https://technet.microsoft.com/library/cc514029), Microsoft’s free compute cluster solution for Windows and Linux HPC workloads, offers several options for running in Azure. You can also build Linux clusters to run open-source tools such as Torque and SLURM. 

### Microsoft HPC Pack
HPC Pack is Microsoft's free HPC solution built on Microsoft Azure and Windows Server technologies, capable of running Windows and Linux HPC workloads.  

* [Download HPC Pack 2016](https://www.microsoft.com/download/details.aspx?id=54507)
* [Download HPC Pack 2012 R2 Update 3](https://www.microsoft.com/download/details.aspx?id=49922)
* [Documentation](https://technet.microsoft.com/library/jj899572.aspx)
* HPC Pack cluster options in Azure: [Linux](../virtual-machines/linux/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) and [Windows](../virtual-machines/windows/hpcpack-cluster-options.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) 
* [Burst to Azure worker instances with HPC Pack](https://technet.microsoft.com/library/gg481749.aspx)
* [Burst to Azure  Batch with HPC Pack](https://technet.microsoft.com/library/mt612877.aspx)
* [Windows HPC forums](https://social.microsoft.com/Forums/home?category=windowshpc)

### Linux and OSS cluster solutions
Use these Azure templates to deploy Linux HPC clusters.

* [Spin up a SLURM cluster](https://azure.microsoft.com/documentation/templates/slurm/)
  and [blog post](http://blogs.technet.com/b/windowshpc/archive/2015/06/06/deploy-a-slurm-cluster-on-azure.aspx)
* [Spin up a Torque cluster](https://azure.microsoft.com/documentation/templates/torque-cluster/)
* [Compute grid templates with PBS Professional](https://github.com/xpillons/azure-hpc/tree/master/Compute-Grid-Infra)

### Third-party grid managers

* [TIBCO DataSynapse GridServer](https://azure.microsoft.com/blog/tibco-datasynapse-comes-to-the-azure-marketplace/) and [Marketplace image](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/tibco-software.gridserverlinuxengine)
* [IBM Spectrum Symphony and Symphony LSF](https://azure.microsoft.com/blog/ibm-and-microsoft-azure-support-spectrum-symphony-and-spectrum-lsf/)
* [Univa Grid Engine](http://www.univa.com/products/grid-engine)
* [Bright Cluster Manager](http://www.brightcomputing.com/technology-partners/microsoft).











## Samples and demos
* [Azure Batch C# and Python code samples](https://github.com/Azure/azure-batch-samples)
* [Batch Shipyard](https://azure.github.io/batch-shipyard/) toolkit for easy deployment of batch-style Dockerized workloads to Azure Batch
* [doAzureParallel](http://www.github.com/Azure/doAzureParallel) R package, built on top of Azure Batch
* [Test drive SUSE Linux Enterprise Server for HPC](https://azure.microsoft.com/marketplace/partners/suse/suselinuxenterpriseserver12optimizedforhighperformancecompute/)


## Azure services for Big Compute
Here is more about the compute, data, networking, and related services you can combine for Big Compute solutions and workflows. For in-depth guidance on Azure services, see the Azure services [documentation](https://azure.microsoft.com/documentation/). The [scenarios](#scenarios) earlier in this article show just some ways of using these services.

> [!NOTE]
> Azure regularly introduces new services that could be useful for your scenario. If you have questions, contact an [Azure partner](https://pinpoint.microsoft.com/en-US/search?keyword=azure) or email *bigcompute@microsoft.com*.
> 
> 

### Compute services
Azure compute services are the core of a Big Compute solution, and the different compute services offer advantages for different scenarios. At a basic level, these services offer different modes for applications to run on virtual machine-based compute instances that Azure provides using Windows Server Hyper-V technology. These instances can run standard and custom Linux and Windows operating systems and tools. Azure gives you a choice of [instance sizes](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) with different configurations of CPU cores, memory, disk capacity, and other characteristics. Depending on your needs, you can scale the instances to thousands of cores and then scale down when you need fewer resources.


> 
> 

| Service | Description |
| --- | --- |
| **[Virtual machines](https://azure.microsoft.com/documentation/services/virtual-machines/)**<br/><br/> |• Provide compute infrastructure as a service (IaaS) using Microsoft Hyper-V technology<br/><br/>• Enable you to flexibly provision and manage persistent cloud computers from standard Windows Server or Linux images from the [Azure Marketplace](https://azure.microsoft.com/marketplace/), or images and data disks you supply<br/><br/>• Can be deployed and managed as [VM Scale Sets](https://azure.microsoft.com/documentation/services/virtual-machine-scale-sets/) to build large-scale services from identical virtual machines, with autoscaling to increase or decrease capacity automatically<br/><br/>• Run on-premises compute cluster tools and applications entirely in the cloud<br/><br/> |
| **[Cloud services](https://azure.microsoft.com/documentation/services/cloud-services/)**<br/><br/> |• Can run Big Compute applications in worker role instances, which are virtual machines running a version of Windows Server and are managed entirely by Azure<br/><br/>• Enable scalable, reliable applications with low administrative overhead, running in a platform as a service (PaaS) model<br/><br/>• May require additional tools or development to integrate with on-premises HPC cluster solutions |
| **[Batch](https://azure.microsoft.com/documentation/services/batch/)**<br/><br/> |• Runs large-scale parallel and batch workloads in a fully managed service<br/><br/>• Provides job scheduling and autoscaling of a managed pool of virtual machines<br/><br/>• Allows developers to build and run applications as a service or cloud-enable existing applications<br/> |





## Related Azure services

### Compute


### Data and analysis


### Networking

### Storage
* [Data Factory](https://azure.microsoft.com/documentation/services/data-factory/)
* [Machine Learning](https://azure.microsoft.com/documentation/services/machine-learning/)
* [HDInsight](https://azure.microsoft.com/documentation/services/hdinsight/)
* [SQL Database](https://azure.microsoft.com/documentation/services/sql-database/)
* [Virtual Machines](https://azure.microsoft.com/documentation/services/virtual-machines/)
* [Virtual Machine Scale Sets](https://azure.microsoft.com/documentation/services/virtual-machine-scale-sets/)
* [Cloud Services](https://azure.microsoft.com/documentation/services/cloud-services/)
* [App Service](https://azure.microsoft.com/documentation/services/app-service/)
* [Media Services](https://azure.microsoft.com/documentation/services/media-services/)
* [Functions](https://azure.microsoft.com/documentation/services/functions/)
* [Virtual Network](https://azure.microsoft.com/documentation/services/virtual-network/)
* [ExpressRoute](https://azure.microsoft.com/documentation/services/expressroute/)
* [Service Bus](https://azure.microsoft.com/documentation/services/service-bus/)
* [Storage](https://azure.microsoft.com/documentation/services/storage/)
* [Data Lake Store](https://azure.microsoft.com/services/data-lake-store/)


## Batch and HPC applications
Unlike web applications and many line-of-business applications, batch and HPC applications have a defined beginning and end, and they can run on a schedule or on demand, sometimes for hours or longer. Most fall into two main categories: *intrinsically parallel* (sometimes called “embarrassingly parallel”, because the problems they solve lend themselves to running in parallel on multiple computers or processors) and *tightly coupled*. 

| Type | Characteristics | Examples |
| --- | --- | --- |
| **Intrinsically parallel**<br/><br/>![Intrinsically parallel][parallel] |• Individual computers run application logic independently<br/><br/> • Adding computers allows the application to scale and decrease computation time<br/><br/>• Application consists of separate executables, or a group of services invoked by a client  |• Financial risk modeling<br/><br/>• Image rendering and image processing<br/><br/>• Media encoding and transcoding<br/><br/>• Monte Carlo simulations<br/><br/>• Software testing |
| **Tightly coupled**<br/><br/>![Tightly coupled][coupled] |• Application requires compute nodes to interact or exchange intermediate results<br/><br/>• Compute nodes may communicate using the Message Passing Interface (MPI), a common communications protocol for parallel computing<br/><br/>• The application is sensitive to network latency and bandwidth<br/><br/>• Application performance can be improved by using high-speed networking technologies such as InfiniBand and remote direct memory access (RDMA) |• Oil and gas reservoir modeling<br/><br/>• Engineering design and analysis, such as computational fluid dynamics<br/><br/>• Physical simulations such as car crashes and nuclear reactions<br/><br/>• Weather forecasting |


## Applications

* [Altair](https://azure.microsoft.com/blog/availability-of-altair-radioss-rdma-on-microsoft-azure/)
* [ANSYS](https://azure.microsoft.com/blog/ansys-cfd-and-microsoft-azure-perform-the-best-hpc-scalability-in-the-cloud/)

### Considerations for running batch and HPC applications in the cloud
You can readily migrate many applications that are designed to run in on-premises HPC clusters to Azure, or to a hybrid (cross-premises) environment. However, there may be some limitations or considerations, including:

* **Availability of cloud resources** - Depending on the type of cloud compute resources you use, you might not be able to rely on continuous machine availability while a job runs. State handling and progress check pointing are common techniques to handle possible transient failures, and more necessary when using cloud resources.
* **Data access** - Data access techniques commonly available in enterprise clusters, such as NFS, may require special configuration in the cloud. Or, you might need to adopt different data access practices and patterns for the cloud.
* **Data movement** - For applications that process large amounts of data, strategies are needed to move the data into cloud storage and to compute resources. You might need high-speed cross-premises networking such as [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/). Also consider legal, regulatory, or policy limitations for storing or accessing that data.
* **Licensing** - Check with the vendor of any commercial application for licensing or other restrictions for running in the cloud. Not all vendors offer pay-as-you-go licensing. You might need to plan for a licensing server in the cloud for your solution, or connect to an on-premises license server.

## Industry solutions
* [Banking and capital markets](https://finance.azure.com/)
* [Engineering simulations](https://simulation.azure.com/) 

## Customer stories
* [ANEO](https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=4168) 
* [d3View](https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=22088)
* [Ludwig Institute of Cancer Research](https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=5830)
* [Microsoft Research](https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=15634)
* [Milliman](https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=14967)
* [Mitsubishi UFJ Securities International](https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=26266)
* [Schlumberger](http://azure.microsoft.com/blog/big-compute-for-large-engineering-simulations)
* [Towers Watson](https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=18222)
* [UberCloud](https://simulation.azure.com/casestudies/Team-182-ABB-UC-Final.pdf)

## Partners
Cycle Computing, Rescale, and UberCloud.


## Solutions options
Learn about Big Compute options in Azure, and choose the right approach for your workload and business need.


## Azure Batch
[Batch](https://azure.microsoft.com/services/batch/) is a platform service that makes it easy to cloud-enable your Linux and Windows applications and run jobs without setting up and managing a cluster and job scheduler. Use the SDK to integrate client applications with Azure Batch through various languages, stage data to Azure, and build job execution pipelines.

* [Documentation](https://azure.microsoft.com/documentation/services/batch/)
* [.NET](https://msdn.microsoft.com/library/azure/mt348682.aspx), [Python](http://azure-sdk-for-python.readthedocs.io/latest/), [Node.js](http://azure.github.io/azure-sdk-for-node/azure-batch/latest/), [Java](http://azure.github.io/azure-sdk-for-java/), and [REST](https://msdn.microsoft.com/library/azure/dn820158.aspx) API reference
* [Batch management .NET library](https://msdn.microsoft.com/library/mt463120.aspx) reference
* Tutorials: Get started with [Azure Batch library for .NET](batch-dotnet-get-started.md) and [Batch Python client](batch-python-tutorial.md)
* [Batch forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurebatch)
* [Batch videos](https://azure.microsoft.com/documentation/videos/index/?services=batch)



## HPC storage
* [Parallel file systems for HPC storage on Azure](https://blogs.msdn.microsoft.com/azurecat/2017/03/17/parallel-file-systems-for-hpc-storage-on-azure/)
* [Intel Cloud Edition for Lustre Software - Eval](https://azure.microsoft.com/marketplace/partners/intel/lustre-cloud-edition-evaleval-lustre-2-7/)
* [BeeGFS on CentOS 7.2 template](https://github.com/smith1511/hpc/tree/master/beegfs-shared-on-centos7.2)




## Microsoft MPI
[Microsoft MPI](https://msdn.microsoft.com/library/bb524831.aspx) (MS-MPI) is a Microsoft implementation of the Message Passing Interface standard for developing and running parallel applications on the Windows platform.

* [Download MS-MPI](http://go.microsoft.com/FWLink/p/?LinkID=389556)
* [MS-MPI reference](https://msdn.microsoft.com/library/dn473458.aspx)
* [MPI forum](https://social.microsoft.com/Forums/en-us/home?forum=windowshpcmpi)

## Compute-intensive instances
Azure offers a [range of VM sizes](../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json), including [compute-intensive H-series](../virtual-machines/windows/sizes-hpc.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) instances capable of connecting to a back-end RDMA network, to run your Linux and Windows HPC workloads. 

* [Set up a Linux RDMA cluster to run MPI applications](../virtual-machines/linux/classic/rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2flinux%2fclassic%2ftoc.json)
* [Set up a Windows RDMA cluster with Microsoft HPC Pack to run MPI applications](../virtual-machines/windows/classic/hpcpack-rdma-cluster.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json)

For GPU-intensive workloads, check out NC and NV sizes available for both Windows and Linux VMs.

> [!NOTE]
> Take advantage of the Azure [compute-intensive instances such as the H-series](../virtual-machines/windows/sizes-hpc.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) to improve the performance and scalability of HPC workloads. These instances also support parallel MPI applications that require a low-latency and high-throughput application network. Also available are [N-series](../virtual-machines/windows/sizes-gpu.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) VMs with NVIDIA GPUs to expand the range of computing and visualization scenarios in Azure.  

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
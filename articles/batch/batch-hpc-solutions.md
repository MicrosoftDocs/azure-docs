<properties
   pageTitle="Batch and HPC Solutions in the cloud | Microsoft Azure"
   description="Introduces batch and high performance computing (Big Compute) scenarios and solution options in Azure"
   services="batch, virtual-machines, cloud-services"
   documentationCenter=""
   authors="dlepow"
   manager="timlt"
   editor=""/>

<tags
   ms.service="batch"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="big-compute"
   ms.date="09/29/2015"
   ms.author="danlep"/>

# Batch and HPC Solutions

This article introduces Azure solutions for batch and high performance computing (HPC) - also called *Big Compute*. Although the article is mainly for technical decision-makers, IT managers, and independent software vendors, other IT professionals and developers can use it to familiarize themselves with these solutions.

Organizations have large-scale computing problems including engineering design and analysis, image rendering, complex modeling, Monte Carlo simulations, and financial risk calculations. To help organizations solve these problems and make decisions with the resources, scale, and schedule they need, Azure offers scalable, on-demand compute capabilities and services. With Azure, organizations can:

* Create hybrid solutions, extending an on-premises HPC cluster to offload peak workloads to the cloud

* Run HPC cluster workloads entirely in Azure using existing tool sets and applications

* Use a managed and scalable Azure service such as [Batch](http://azure.microsoft.com/documentation/services/batch/) to run compute-intensive workloads without having to deploy and manage compute infrastructure

Azure also offers development tools and services for organizations and software vendors to build custom, end-to-end Big Compute solutions.


## Background: Batch and HPC applications

Unlike web applications and many line-of-business applications, batch and HPC applications have a defined beginning and end, and they can run on a schedule or on demand, sometimes for hours or longer. Most fall into two main categories: *intrinsically parallel* (sometimes called “embarrassingly parallel”, because the problems they solve lend themselves to running in parallel on multiple computers or processors) and *tightly coupled*. See the following table for more about these application types. Some Azure solution approaches work better for one type or the other.

>[AZURE.NOTE] In Batch and HPC solutions, a running instance of an application is typically called a *job*, and each job might get divided into *tasks*. And the clustered compute resources for the application are often called *compute nodes*.

Type | Characteristics | Examples
------------- | ----------- | ---------------
**Intrinsically parallel**<br/><br/>![Intrinsically parallel][parallel] |• Individual computers run application logic independently<br/><br/> • Adding computers allows the application to scale and decrease computation time<br/><br/>• Application consists of separate executables, or is divided into a group of services invoked by a client (a service-oriented architecture, or SOA, application) |• Financial risk modeling<br/><br/>• Image rendering and image processing<br/><br/>• Media encoding and transcoding<br/><br/>• Monte Carlo simulations<br/><br/>• Software testing
**Tightly coupled**<br/><br/>![Tightly coupled][coupled] |• Application requires compute nodes to interact or exchange intermediate results<br/><br/>• Compute nodes may communicate using the Message Passing Interface (MPI), a common communications protocol for parallel computing<br/><br/>• The application is sensitive to network latency and bandwidth<br/><br/>• Application performance can be improved by using compute infrastructure that supports high-speed networking technologies such as InfiniBand and remote direct memory access (RDMA) |• Oil and gas reservoir modeling<br/><br/>• Engineering design and analysis, such as computational fluid dynamics<br/><br/>• Physical simulations such as car crashes and nuclear reactions<br/><br/>• Weather forecasting

### Considerations for running batch and HPC applications in the cloud

You can readily migrate many applications that are designed to run in on-premises HPC clusters to Azure, or to a hybrid (cross-premises) environment. However, there may be some limitations or considerations, including:


* **Uninterrupted availability of cloud resources** - Depending on the type of cloud compute resources selected for the solution, you might not be able to rely on continuous machine availability for the duration of a job's execution. State handling and progress check pointing are common techniques to handle possible transient failures, and more necessary when leveraging cloud resources.


* **Data access** - Data access techniques commonly available within an enterprise network cluster, such as NFS, may require special configuration in the cloud, or you might need to adopt different data access practices and patterns for the cloud.

* **Data movement** - For applications that process large amounts of data, strategies are needed to move the data into cloud storage and to compute resources, and you might need to consider high-speed cross-premises networking such as [Azure ExpressRoute](http://azure.microsoft.com/services/expressroute/). Also consider legal, regulatory, or policy limitations for storing or accessing that data.


* **Licensing** - Check with the vendor of any commercial application for licensing or other restrictions for running in the cloud. Not all vendors offer pay-as-you-go licensing. You might need to plan for a licensing server in the cloud for your solution, or a connection to an on-premises license server.


### Big Compute or Big Data?

The dividing lines between Big Compute and Big Data applications aren’t always clear, and some applications may have characteristics of both. Both involve running large-scale computations, usually on clusters of computers that run on-premises, in the cloud, or both. But the solution approaches and supporting tools might differ.

• **Big Compute** tends to involve applications that rely on CPU power and memory, such as engineering simulations, financial risk modeling, and digital rendering. The clusters that power a Big Compute solution might include computers with specialized multicore processors to perform raw computation, and specialized, high speed networking hardware to connect the computers.

• **Big Data** solves data analysis problems that involve large amounts of data that can’t be managed by a single computer or database management system, such as large volumes of web logs or other business intelligence data. Big Data tends to rely more on disk capacity and I/O performance than on CPU power, and a Big Data solution often uses specialized tools such as Apache Hadoop to manage the cluster and partition the data. (For information about Azure HDInsight and other Azure Hadoop solutions, see [Hadoop](http://azure.microsoft.com/solutions/hadoop/).)

## Resource management and job scheduling

Running Batch and HPC application usually includes a *cluster manager* and a *job scheduler* to help manage clustered compute resources and allocate them to the applications that run the jobs. These functions might be accomplished by separate tools, or an integrated tool.

* **Cluster manager** - Provisions, releases, and administers compute resources (or compute nodes). Depending on the tool, a cluster manager might automate installation of operating system images and applications on compute nodes, scale compute resources according to demands, and monitor the performance of the nodes.

* **Job scheduler** - Specifies the resources (such as processors or memory) an application needs, and the conditions when it will run. A job scheduler maintains a queue of jobs and allocates resources to them based on an assigned priority or other characteristics.

Clustering and job scheduling tools for Windows-based and Linux-based clusters, or those developed independently, can migrate well to Azure. For example, [Microsoft HPC Pack](https://technet.microsoft.com/library/cc514029) is Microsoft’s free compute cluster solution for Windows Server and Windows-based computers. To reduce the need for dedicated on-premises compute resources, you can extend an HPC Pack cluster to use Azure compute nodes on demand, or deploy a cluster entirely in Azure virtual machines.

### Big Compute workflows

Cluster management and job scheduling tools help accomplish a Big Compute workflow with predictable steps. Depending on the solution, you might omit some steps in the following list or introduce additional, custom tools. Data intensive workflows might involve additional data pre- and post-processing steps (not listed).

1. **Provision** - Prepare the compute environment with the necessary infrastructure, compute resources, and storage to run applications

2. **Stage** - Move input data and applications into the compute environment

3. **Schedule** - Configure jobs and tasks and allocate compute resources to them when resources are available

4. **Monitor** - Provide status information about job and task progress; handle errors or exceptions

5. **Finish** - Return results and post-process output data if needed

## Azure services for Big Compute

Azure has a range of compute, data, networking and related services you can use for Big Compute solutions and workflows. For in-depth guidance on each of these services, see the Azure services documentation. See [Solution scenarios](#solution-scenarios) in this article for some common approaches with Batch and HPC applications.

>[AZURE.NOTE] New services are regularly introduced to the Azure platform and could be useful for your scenario. Use of Preview services is recommended only for test or proof of concept deployments, not production workloads. If you have questions, contact an [Azure partner](https://pinpoint.microsoft.com/en-US/search?keyword=azure) or email *bigcompute@microsoft.com*.

### Compute services

Compute services in Azure are at the core of a Big Compute solution. The compute services in the following table are used frequently and offer advantages for different scenarios. At a basic level, these services offer different modes for applications to run on virtual machine-based compute instances that Azure provides using Windows Server Hyper-V technology. Depending on the service, these instances can run a variety of standard and custom Linux and Windows operating systems and tools. Azure provides a [range of instance sizes](../virtual-machines/virtual-machines-sizes-specs.md) with different configurations of CPU cores, memory, disk capacity, and other characteristics. Depending on your needs you can scale the instances to thousands of cores and then scale down when you need fewer resources.

>[AZURE.NOTE] You can take advantage of the A8-A11 instances to improve the performance of some compute-intensive workloads, including parallel MPI applications that require a low latency and high throughput application network. See [About the A8, A9, A10, and A11 Compute Intensive Instances](../virtual-machines/virtual-machines-a8-a9-a10-a11-specs.md).  

Service | Description
------------- | -----------
**[Cloud services](http://azure.microsoft.com/documentation/services/cloud-services)**<br/><br/> |• Can run Big Compute applications in worker role instances, which are virtual machines running a version of Windows Server and are managed entirely by Azure<br/><br/>• Enable scalable, reliable applications with low administrative overhead, running in a platform as a service (PaaS) model<br/><br/>• May require additional tools or development to integrate with on-premises HPC cluster solutions
**[Virtual machines](http://azure.microsoft.com/documentation/services/virtual-machines)**<br/><br/> |• Provide compute infrastructure as a service (IaaS) using Microsoft Hyper-V technology<br/><br/>• Enable you to flexibly provision and manage persistent cloud computers from standard Windows Server or Linux images, or images and data disks you supply or from the [Azure Marketplace](https://azure.microsoft.com/marketplace/)<br/><br/>• Run on-premises compute cluster tools and applications entirely in the cloud
**[Batch](http://azure.microsoft.com/documentation/services/batch)**<br/><br/> |• Runs large-scale parallel and batch workloads such as image rendering and media encoding and transcoding in a fully managed service<br/><br/>• Provides job scheduling and autoscaling of a managed pool of virtual machines<br/><br/>• Allows developers to build and run applications as a service or cloud-enable existing applications<br/>

### Storage services

A Big Compute solution typically operates on a set of input data, and generates data for its results. Some of the Azure storage services used in many Big Compute solutions include:

* [Blob, table, and queue storage](http://azure.microsoft.com/documentation/services/storage) - Manage large amounts of unstructured data, NoSQL data, and messages for workflow and communication, respectively. For example, you might use blob storage for large technical data sets, or the input images or media files your application processes. You might use queues for asynchronous communication in a solution. See [introducton to Microsoft Azure Storage](../storage/storage-introduction.md) for more about these storage solutions.

* [Azure File Storage](http://azure.microsoft.com/services/storage/files/) - Shares common files and data in Azure using the standard SMB protocol, which is needed for some HPC cluster solutions.

### Data and analysis services

Some Big Compute scenarios involve large-scale data flows, or generate data that needs further processing or analysis. To handle this, Azure offers a number of data and analysis services including:

* [Data Factory](http://azure.microsoft.com/documentation/services/data-factory) - Builds data-driven workflows (pipelines) that join, aggregate, and transform data sourced from on-premises, cloud-based, and Internet data stores.

* [SQL Database](http://azure.microsoft.com/documentation/services/sql-database) - Provides the key features of a Microsoft SQL Server relational database management system in a managed platform service.

* [HDInsight](http://azure.microsoft.com/documentation/services/hdinsight) - Deploys and provisions Windows Server or Linux-based Apache Hadoop clusters in the cloud to manage, analyze, and report on big data with high reliability and availability.

* [Machine Learning](http://azure.microsoft.com/documentation/services/machine-learning) - Helps you create, test, operate, and manage predictive analytic solutions in a fully managed platform service.

### Additional services

Your Big Compute solution might need to include other Azure infrastructure and platform services to connect to resources on-premises or in other environments. Examples include:

* [Virtual Network](http://azure.microsoft.com/documentation/services/virtual-network) - Creates a logically isolated section in Azure to connect Azure resources to your on-premises data center or a single client machine using IPSec; allows Big Compute applications to access on-premises data, Active Directory services, and license servers

* [ExpressRoute](http://azure.microsoft.com/documentation/services/expressroute) - Creates a private connection between Microsoft data centers and infrastructure that’s on-premises or in a co-location environment, with higher security, more reliability, faster speeds, and lower latencies than typical connections over the Internet.

* [Service Bus](http://azure.microsoft.com/documentation/services/service-bus) - Provides several mechanisms for applications to communicate or exchange data, whether they are located on Azure, on another cloud platform, or in a data center.

## Solution scenarios

The following are common scenarios to run Big Compute workloads in Azure by leveraging existing HPC cluster solutions, Azure services, or a combination of the two.

>[AZURE.NOTE] For organizations with compute intensive workloads that aren't suited to standard HPC cluster tools or that don't migrate directly to Azure services, Azure provides developers and partners a full set of compute capabilities, services, architecture choices, and development tools. Azure can support custom Big Compute workflows that scale to thousands of compute cores.

### Scenario 1. Burst an on-premises HPC cluster to Azure

**When would you choose this?** - You might already have an on-premises HPC cluster running your compute intensive workloads but it needs extra compute resources for peak periods such as end-of-month reporting or special projects. Instead of purchasing, deploying, and managing additional hardware and software that may be idle most of the time, you can use Azure to add on-demand compute power to your existing cluster.

For example, if your existing on-premises HPC cluster is built with [Microsoft HPC Pack](https://technet.microsoft.com/library/cc514029), you could add extra compute resources in the form of Azure worker role instances running in a cloud service. See the following figure. For more information and step-by-step instructions, see [Burst to Azure with Microsoft HPC Pack](https://technet.microsoft.com/library/gg481749.aspx).

![Cluster burst][burst_cluster]

>[AZURE.NOTE]If you want to minimize the footprint of the HPC Pack cluster, you could reduce the on-premises cluster to just the HPC Pack head node. Then, add all compute resources on-demand in Azure. For a tutorial that steps through this scenario, see [Set up a hybrid compute cluster with Microsoft HPC Pack](../cloud-services/cloud-services-setup-hybrid-hpcpack-cluster.md).

This hybrid solution leverages an existing investment in an on-premises cluster, but allows you to scale the fixed on-premises infrastructure for typical (non-peak) workloads. If you need to access an on-premises license server or data store, you can set up an Azure virtual network to connect the on-premises cluster to Azure.

### Scenario 2. Create an HPC cluster entirely in Azure

**When would you choose this?** - You might already have a substantial investment in an on-premises Windows or Linux HPC cluster including management and scheduling tools and custom applications. You might need additional cluster capacity to run your existing toolsets and applications but don't want to invest in additional on-premises infrastructure or modify your applications. Or you might need to create a new cluster for a a short or long period of time, yet you don't want to pay the cost of purchasing, maintaining and operating it, or allocate the space to install and deploy it.

You can use Azure automation tools to create an HPC cluster in Azure virtual machines to create the capacity you need. Depending on the the VMs you deploy, you can run a variety of HPC and parallel workloads, including tightly coupled MPI applications.

>[AZURE.NOTE] Check with the vendor of your on-premises cluster solution and applications for additional requirements and best practices for running in a public cloud providing infrastructure as a service (IaaS).

For example, you can create an HPC cluster with [Microsoft HPC Pack](https://technet.microsoft.com/library/cc514029) in Azure infrastructure services virtual machines (IaaS) to run your Windows or Linux workloads, as shown in the following simplified figure. A cluster user can submit a job securely to the cloud cluster through standard HPC Pack job submission tools running on a client computer. See [HPC cluster options with Microsoft HPC Pack in Azure](../virtual-machines/virtual-machines-hpcpack-cluster-options.md).

![Cluster in IaaS][iaas_cluster]

**Automated deployment** - To deploy a large number of Windows Server or Linux VMs you can use standard or custom VM images and Azure automation tools such as the [Azure Command-line Interface](../xplat-cli-install.md) or [Azure PowerShell](../powershell-install-configure.md). Examples include:

* To deploy an HPC Pack cluster in Azure infrastructure services, you can run a flexible [Azure PowerShell script](https://msdn.microsoft.com/library/azure/dn864734.aspx) from a client computer; the script uses a Windows Server VM image with HPC Pack preinstalled. You can also use an Azure [quickstart template](https://azure.microsoft.com/documentation/templates/create-hpc-cluster/) with either Azure PowerShell or the Azure CLI to deploy an HPC Pack cluster.

* You can use an Azure [quickstart template](https://azure.microsoft.com/documentation/templates/slurm/) with either Azure PowerShell or the Azure CLI to deploy a Linux cluster running the [SLURM](https://computing.llnl.gov/linux/slurm/) open source workload manager.

Putting an entire HPC cluster in the cloud can have clear benefits.

* An organization can un HPC jobs without buying and managing additional on-premises hardware, and  can control the size of the cluster to use compute resources efficiently.

* Many on-premises cluster applications can run unchanged, or with minor modifications, in a cloud-based cluster.

* Compared with a hybrid solution that extends an on-premises cluster to the cloud, running an application entirely in the cloud can simplify data access. Rather than dividing data between the cloud and on-premises installations, or making one part of the application access data remotely, all of the application data can be stored in the cloud.

* Some software vendors optimize their applications to run in cloud-based clusters. For example, by deploying the [MATLAB Distributed Computing Server](http://www.mathworks.com/products/distriben/), from MathWorks, on an HPC Pack cluster in Azure virtual machines, you can run parallel MATLAB jobs entirely with cloud-based compute resources.

### Scenario 3. Scale out a parallel application to Azure

**When would you choose this?** - You might be running a compute-intensive application such as a Monte Carlo simulation, animation rendering, or media transcoding in on-premises workstations or a small cluster. You don’t want to manage compute resources or a job scheduler; instead, you want to focus on running your application efficiently to solve your business problems. Or you might want to offload your compute intensive application, or a third-party application, so it runs entirely as a service in the cloud.

Depending on the workload, you might take advantage of an existing Big Compute service in Azure, hosted by Microsoft or another service vendor, to simplify management of both the infrastructure and the application for your solution. Some services host specific applications for customers in selected industries. Some services plug into on-premises applications, enabling a hybrid solution. Others, like [Azure Media Services](http://azure.microsoft.com/documentation/services/media-services), are dedicated platform services.

To easily cloud enable and scale out an application you run today, [Batch](http://azure.microsoft.com/documentation/services/batch) provides APIs to schedule jobs and manage compute resources in a service. Batch manages deployment and autoscaling of virtual machines, job scheduling, disaster recovery, data movement, dependency management, application deployment, and all the other plumbing needed to run jobs in the cloud. Currently Batch is ideal for intrinsically parallel applications such as image rendering, financial risk modeling, and Monte Carlo simulations running in Windows Server compute resources.

See the following figure for a typical workflow a developer can create with Batch.

![Azure Batch][batch_proc]

1. Upload input files (such as source data or images, required application .exe or script files, and their dependencies) to Azure Storage.

2. Create a Batch service that will:

    a. Deploy a pool of identical Azure VMs to run the application, analagous to compute nodes in an HPC cluster. The developer specifies their size, the OS they run, and other properties such as whether the pool can autoscale. When a task runs, it is automatically assigned a VM from this pool.

    b. Create a job to run the application. The developer can specify a schedule and priority for the job, or the job can run on-demand.

    c. Partition the job into tasks. Each task is essentially a command line that runs on one of the VMs in the pool to process information from one of the data files uploaded to Storage.

3. Run the service and monitor the results.  


## Next steps

* See [Technical Resources for Batch and HPC](big-compute-resources.md) to find technical guidance for your solution.

* For the latest announcements, see the [Microsoft HPC and Batch team blog](http://blogs.technet.com/b/windowshpc/) and the [Azure blog](http://azure.microsoft.com/blog/tag/hpc/).

<!--Image references-->
[parallel]: ./media/batch-hpc-solutions/parallel.png
[coupled]: ./media/batch-hpc-solutions/coupled.png
[iaas_cluster]: ./media/batch-hpc-solutions/iaas_cluster.png
[burst_cluster]: ./media/batch-hpc-solutions/burst_cluster.png
[batch_proc]: ./media/batch-hpc-solutions/batch_proc.png

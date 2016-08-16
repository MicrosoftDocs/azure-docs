<properties
   pageTitle="Batch and HPC solutions in the cloud | Microsoft Azure"
   description="Learn about batch and high performance computing (HPC and Big Compute) scenarios and solution options in Azure"
   services="batch, virtual-machines, cloud-services"
   documentationCenter=""
   authors="dlepow"
   manager="timlt"
   editor=""/>

<tags
   ms.service="batch"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="big-compute"
   ms.date="07/27/2016"
   ms.author="danlep"/>

# Batch and HPC solutions in the Azure cloud

Azure offers efficient, scalable cloud solutions for batch and high performance computing (HPC) - also called *Big Compute*. Learn here about Big Compute workloads and Azure’s services to support them, or jump directly to [solution scenarios](#scenarios) later in this article. This article is mainly for technical decision-makers, IT managers, and independent software vendors, but other IT professionals and developers can use it to familiarize themselves with these solutions.

Organizations have large-scale computing problems including engineering design and analysis, image rendering, complex modeling, Monte Carlo simulations, and financial risk calculations. Azure helps organizations solve these problems and make decisions with the resources, scale, and schedule they need. With Azure, organizations can:

* Create hybrid solutions, extending an on-premises HPC cluster to offload peak workloads to the cloud

* Run HPC cluster tools and workloads entirely in Azure

* Use managed and scalable Azure services such as [Batch](https://azure.microsoft.com/documentation/services/batch/) to run compute-intensive workloads without having to deploy and manage compute infrastructure

Although beyond the scope of this article, Azure also provides developers and partners a full set of capabilities, architecture choices, and development tools to build large-scale, custom Big Compute workflows. And a growing partner ecosystem is ready to help you make your Big Compute workloads productive in the Azure cloud.


## Batch and HPC applications

Unlike web applications and many line-of-business applications, batch and HPC applications have a defined beginning and end, and they can run on a schedule or on demand, sometimes for hours or longer. Most fall into two main categories: *intrinsically parallel* (sometimes called “embarrassingly parallel”, because the problems they solve lend themselves to running in parallel on multiple computers or processors) and *tightly coupled*. See the following table for more about these application types. Some Azure solution approaches work better for one type or the other.

>[AZURE.NOTE] In Batch and HPC solutions, a running instance of an application is typically called a *job*, and each job might get divided into *tasks*. And the clustered compute resources for the application are often called *compute nodes*.

Type | Characteristics | Examples
------------- | ----------- | ---------------
**Intrinsically parallel**<br/><br/>![Intrinsically parallel][parallel] |• Individual computers run application logic independently<br/><br/> • Adding computers allows the application to scale and decrease computation time<br/><br/>• Application consists of separate executables, or is divided into a group of services invoked by a client (a service-oriented architecture, or SOA, application) |• Financial risk modeling<br/><br/>• Image rendering and image processing<br/><br/>• Media encoding and transcoding<br/><br/>• Monte Carlo simulations<br/><br/>• Software testing
**Tightly coupled**<br/><br/>![Tightly coupled][coupled] |• Application requires compute nodes to interact or exchange intermediate results<br/><br/>• Compute nodes may communicate using the Message Passing Interface (MPI), a common communications protocol for parallel computing<br/><br/>• The application is sensitive to network latency and bandwidth<br/><br/>• Application performance can be improved by using high-speed networking technologies such as InfiniBand and remote direct memory access (RDMA) |• Oil and gas reservoir modeling<br/><br/>• Engineering design and analysis, such as computational fluid dynamics<br/><br/>• Physical simulations such as car crashes and nuclear reactions<br/><br/>• Weather forecasting

### Considerations for running batch and HPC applications in the cloud

You can readily migrate many applications that are designed to run in on-premises HPC clusters to Azure, or to a hybrid (cross-premises) environment. However, there may be some limitations or considerations, including:


* **Availability of cloud resources** - Depending on the type of cloud compute resources you use, you might not be able to rely on continuous machine availability for the duration of a job's execution. State handling and progress check pointing are common techniques to handle possible transient failures, and more necessary when leveraging cloud resources.


* **Data access** - Data access techniques commonly available within an enterprise network cluster, such as NFS, may require special configuration in the cloud, or you might need to adopt different data access practices and patterns for the cloud.

* **Data movement** - For applications that process large amounts of data, strategies are needed to move the data into cloud storage and to compute resources, and you might need high-speed cross-premises networking such as [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/). Also consider legal, regulatory, or policy limitations for storing or accessing that data.


* **Licensing** - Check with the vendor of any commercial application for licensing or other restrictions for running in the cloud. Not all vendors offer pay-as-you-go licensing. You might need to plan for a licensing server in the cloud for your solution, or connect to an on-premises license server.


### Big Compute or Big Data?

The dividing line between Big Compute and Big Data applications isn't always clear, and some applications may have characteristics of both. Both involve running large-scale computations, usually on clusters of computers. But the solution approaches and supporting tools can differ.

• **Big Compute** tends to involve applications that rely on CPU power and memory, such as engineering simulations, financial risk modeling, and digital rendering. The infrastructure for a Big Compute solution might include computers with specialized multicore processors to perform raw computation, and specialized, high speed networking hardware to connect the computers.

• **Big Data** solves data analysis problems that involve large amounts of data that can’t be managed by a single computer or database management system, such as large volumes of web logs or other business intelligence data. Big Data tends to rely more on disk capacity and I/O performance than on CPU power, and might use specialized tools such as Apache Hadoop to manage the cluster and partition the data. (For information about Azure HDInsight and other Azure Hadoop solutions, see [Hadoop](https://azure.microsoft.com/solutions/hadoop/).)

## Compute management and job scheduling

Running Batch and HPC applications often includes a *cluster manager* and a *job scheduler* to help manage clustered compute resources and allocate them to the applications that run the jobs. These functions might be accomplished by separate tools, or an integrated tool or service.

* **Cluster manager** - Provisions, releases, and administers compute resources (or compute nodes). A cluster manager might automate installation of operating system images and applications on compute nodes, scale compute resources according to demands, and monitor the performance of the nodes.

* **Job scheduler** - Specifies the resources (such as processors or memory) an application needs, and the conditions when it will run. A job scheduler maintains a queue of jobs and allocates resources to them based on an assigned priority or other characteristics.

Clustering and job scheduling tools for Windows-based and Linux-based clusters can migrate well to Azure. For example, [Microsoft HPC Pack](https://technet.microsoft.com/library/cc514029), Microsoft’s free compute cluster solution for Windows and Linux HPC workloads, offers several options for running in Azure. You can also build Linux clusters to run open-source tools such as Torque and SLURM, or run commercial tools such as [TIBCO DataSynapse GridServer](http://www.tibco.com/company/news/releases/2016/tibco-to-accelerate-cloud-adoption-of-banking-and-capital-markets-customers-via-microsoft-collaboration), [IBM Platform Symphony](http://www-01.ibm.com/support/docview.wss?uid=isg3T1023592), and [Univa Grid Engine](http://www.univa.com/products/grid-engine) in Azure.

As shown in the following sections, you can also take advantage of Azure services to manage compute resources and schedule jobs without (or in addition to) traditional cluster management tools.


## Scenarios

Here are three common scenarios to run Big Compute workloads in Azure by leveraging existing HPC cluster solutions, Azure services, or a combination of the two. Key considerations for choosing each scenario are listed but aren't exhaustive. More about the available Azure services you might use in your solution is later in the article.

  | Scenario | Why choose it?
------------- | ----------- | ---------------
**Burst an HPC cluster to Azure**<br/><br/>[![Cluster burst][burst_cluster]](./media/batch-hpc-solutions/burst_cluster.png) <br/><br/> Learn more:<br/>• [Burst to Azure worker instances with HPC Pack](https://technet.microsoft.com/library/gg481749.aspx)<br/><br/>• [Set up a hybrid compute cluster with HPC Pack](../cloud-services/cloud-services-setup-hybrid-hpcpack-cluster.md)<br/><br/>• [Burst to Azure Batch with HPC Pack](https://technet.microsoft.com/library/mt612877.aspx)<br/><br/>|• Combine your [Microsoft HPC Pack](https://technet.microsoft.com/library/cc514029) or other on-premises cluster with additional Azure resources in a hybrid solution.<br/><br/>• Extend your Big Compute workloads to run on Platform as a Service (PaaS) virtual machine instances (currently Windows Server only).<br/><br/>•  Access an on-premises license server or data store by using an optional Azure virtual network|• You have an existing HPC cluster and need more resources <br/><br/>• You don’t want to purchase and manage additional HPC cluster infrastructure<br/><br/>• You have transient peak-demand periods or special projects
**Create an HPC cluster entirely in Azure**<br/><br/>[![Cluster in IaaS][iaas_cluster]](./media/batch-hpc-solutions/iaas_cluster.png)<br/><br/>Learn more:<br/>• [HPC cluster solutions in Azure](./big-compute-resources.md)<br/><br/>|• Quickly and consistently deploy your applications and cluster tools on standard or custom Windows or Linux infrastructure as a service (IaaS) virtual machines.<br/><br/>• Run a variety of Big Compute workloads by using the job scheduling solution of your choice.<br/><br/>• Use additional Azure services including networking and storage to create complete cloud-based solutions. |• You don’t want to purchase and manage additional Linux or Windows HPC cluster infrastructure<br/><br/>• You have transient peak-demand periods or special projects<br/><br/>• You need an additional cluster for a period of time but don't want to invest in computers and space to deploy it<br/><br/>• You want to offload your compute-intensive application so it runs as a service entirely in the cloud
**Scale out a parallel application to Azure**<br/><br/>[![Azure Batch][batch_proc]](./media/batch-hpc-solutions/batch_proc.png)<br/><br/>Learn more:<br/>• [Basics of Azure Batch](./batch-technical-overview.md)<br/><br/>• [Get started with the Azure Batch library for .NET](./batch-dotnet-get-started.md)|• Develop with [Azure Batch](https://azure.microsoft.com/documentation/services/batch/) to scale out a variety of Big Compute workloads to run on pools of Windows or Linux virtual machines.<br/><br/>• Use an Azure service to manage deployment and autoscaling of virtual machines, job scheduling, disaster recovery, data movement, dependency management, and application deployment - without requiring a separate HPC cluster or job scheduler.|• You don’t want to manage compute resources or a job scheduler; instead, you want to focus on running your applications<br/><br/>• You want to offload your compute-intensive application so it runs as a service in the cloud<br/><br/>• You want to automatically scale your compute resources to match the compute workload


## Azure services for Big Compute

Here is more about the compute, data, networking and related services you can combine for Big Compute solutions and workflows. For in-depth guidance on Azure services, see the Azure services [documentation](https://azure.microsoft.com/documentation/). The [scenarios](#scenarios) earlier in this article show just some ways of using these services.

>[AZURE.NOTE] Azure regularly introduces new services that could be useful for your scenario. If you have questions, contact an [Azure partner](https://pinpoint.microsoft.com/en-US/search?keyword=azure) or email *bigcompute@microsoft.com*.

### Compute services

Azure compute services are the core of a Big Compute solution, and the different compute services offer advantages for different scenarios. At a basic level, these services offer different modes for applications to run on virtual machine-based compute instances that Azure provides using Windows Server Hyper-V technology. These instances can run a variety of standard and custom Linux and Windows operating systems and tools. Azure gives you a choice of [instance sizes](../virtual-machines/virtual-machines-windows-sizes.md) with different configurations of CPU cores, memory, disk capacity, and other characteristics. Depending on your needs you can scale the instances to thousands of cores and then scale down when you need fewer resources.

>[AZURE.NOTE] Take advantage of the Azure compute-intensive instances to improve the performance of some HPC workloads, including parallel MPI applications that require a low latency and high throughput application network. See [About the A8, A9, A10, and A11 compute-intensive instances](../virtual-machines/virtual-machines-windows-a8-a9-a10-a11-specs.md).  

Service | Description
------------- | -----------
**[Virtual machines](https://azure.microsoft.com/documentation/services/virtual-machines/)**<br/><br/> |• Provide compute infrastructure as a service (IaaS) using Microsoft Hyper-V technology<br/><br/>• Enable you to flexibly provision and manage persistent cloud computers from standard Windows Server or Linux images from the [Azure Marketplace](https://azure.microsoft.com/marketplace/), or images and data disks you supply<br/><br/>• Can be deployed and managed as [VM Scale Sets](https://azure.microsoft.com/documentation/services/virtual-machine-scale-sets/) to build large-scale services from identical virtual machines, with autoscaling to increase or decrease capacity automatically<br/><br/>• Run on-premises compute cluster tools and applications entirely in the cloud<br/><br/>
**[Cloud services](https://azure.microsoft.com/documentation/services/cloud-services/)**<br/><br/> |• Can run Big Compute applications in worker role instances, which are virtual machines running a version of Windows Server and are managed entirely by Azure<br/><br/>• Enable scalable, reliable applications with low administrative overhead, running in a platform as a service (PaaS) model<br/><br/>• May require additional tools or development to integrate with on-premises HPC cluster solutions
**[Batch](https://azure.microsoft.com/documentation/services/batch/)**<br/><br/> |• Runs large-scale parallel and batch workloads in a fully managed service<br/><br/>• Provides job scheduling and autoscaling of a managed pool of virtual machines<br/><br/>• Allows developers to build and run applications as a service or cloud-enable existing applications<br/>

### Storage services

A Big Compute solution typically operates on a set of input data, and generates data for its results. Some of the Azure storage services used in Big Compute solutions include:

* [Blob, table, and queue storage](https://azure.microsoft.com/documentation/services/storage/) - Manage large amounts of unstructured data, NoSQL data, and messages for workflow and communication, respectively. For example, you might use blob storage for large technical data sets, or for the input images or media files your application processes. You might use queues for asynchronous communication in a solution. See [Introduction to Microsoft Azure Storage](../storage/storage-introduction.md).

* [Azure File storage](https://azure.microsoft.com/services/storage/files/) - Shares common files and data in Azure using the standard SMB protocol, which is needed for some HPC cluster solutions.

* [Data Lake Store](https://azure.microsoft.com/services/data-lake-store/) - Provides a hyperscale Apache Hadoop Distributed File System for the cloud, particularly useful for batch, real-time, and interactive analytics.

### Data and analysis services

Some Big Compute scenarios involve large-scale data flows, or generate data that needs further processing or analysis. To handle this, Azure offers a number of data and analysis services including:

* [Data Factory](https://azure.microsoft.com/documentation/services/data-factory/) - Builds data-driven workflows (pipelines) that join, aggregate, and transform data from on-premises, cloud-based, and Internet data stores.

* [SQL Database](https://azure.microsoft.com/documentation/services/sql-database/) - Provides the key features of a Microsoft SQL Server relational database management system in a managed service.

* [HDInsight](https://azure.microsoft.com/documentation/services/hdinsight/) - Deploys and provisions Windows Server or Linux-based Apache Hadoop clusters in the cloud to manage, analyze, and report on big data.

* [Machine Learning](https://azure.microsoft.com/documentation/services/machine-learning/) - Helps you create, test, operate, and manage predictive analytic solutions in a fully managed service.

### Additional services

Your Big Compute solution might need other Azure services to connect to resources on-premises or in other environments. Examples include:

* [Virtual Network](https://azure.microsoft.com/documentation/services/virtual-network/) - Creates a logically isolated section in Azure to connect Azure resources to each other or to your on-premises data center; allows Big Compute applications to access on-premises data, Active Directory services, and license servers

* [ExpressRoute](https://azure.microsoft.com/documentation/services/expressroute/) - Creates a private connection between Microsoft data centers and infrastructure that’s on-premises or in a co-location environment, with higher security, more reliability, faster speeds, and lower latencies than typical connections over the Internet.

* [Service Bus](https://azure.microsoft.com/documentation/services/service-bus/) - Provides several mechanisms for applications to communicate or exchange data, whether they are located on Azure, on another cloud platform, or in a data center.

## Next steps

* See [Technical Resources for Batch and HPC](big-compute-resources.md) to find technical guidance to build your solution.

* Discuss your Azure options with partners including Cycle Computing and UberCloud.

* Read about Azure Big Compute solutions delivered by [Towers Watson](https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=18222), [Altair](https://azure.microsoft.com/blog/availability-of-altair-radioss-rdma-on-microsoft-azure/), [ANSYS](https://azure.microsoft.com/blog/ansys-cfd-and-microsoft-azure-perform-the-best-hpc-scalability-in-the-cloud/), and [d3VIEW](https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=22088).

* For the latest announcements, see the [Microsoft HPC and Batch team blog](http://blogs.technet.com/b/windowshpc/) and the [Azure blog](https://azure.microsoft.com/blog/tag/hpc/).

<!--Image references-->
[parallel]: ./media/batch-hpc-solutions/parallel.png
[coupled]: ./media/batch-hpc-solutions/coupled.png
[iaas_cluster]: ./media/batch-hpc-solutions/iaas_cluster.png
[burst_cluster]: ./media/batch-hpc-solutions/burst_cluster.png
[batch_proc]: ./media/batch-hpc-solutions/batch_proc.png

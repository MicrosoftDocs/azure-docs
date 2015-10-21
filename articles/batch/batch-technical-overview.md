<properties
	pageTitle="Azure Batch technical overview | Microsoft Azure"
	description="Learn about the concepts, workflows, and scenarios of the Azure Batch service for large-scale parallel and HPC workloads"
	services="batch"
	documentationCenter=""
	authors="dlepow"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.workload="big-compute"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="10/20/2015"
	ms.author="danlep"/>


# Technical overview of Azure Batch for large-scale parallel and HPC workloads
Azure Batch helps you run large-scale parallel and high performance computing (HPC) applications efficiently in the cloud. It's a platform service that provides job scheduling and autoscaling of a managed collection of virtual machines (compute nodes) to run the jobs. With the Batch service, you programmatically define Azure compute resources and large-scale batch jobs that run on demand or on a schedule, and you don't need to manually configure and manage an HPC cluster, individual VMs, virtual networks, or a job scheduler.

## Use cases

Batch is a managed service for *batch processing* or *batch computing* - running a large volume of similar tasks to get some desired result. Batch computing is a common pattern for organizations that process, transform, and analyze large amounts of data, either on a schedule or on-demand, with examples in fields ranging from financial services to engineering.

Batch works well with intrinsically parallel (sometimes called "embarrassingly parallel") applications or workloads, which lend themselves to running as parallel tasks on multiple computers. See Figure 1.

![Parallel tasks][parallel]

**Figure 1. Parallel tasks running on multiple computers**

Examples include:

* Financial risk modeling
* Image rendering and image processing
* Media encoding and transcoding
* Genetic sequence analysis
* Software testing

Batch can also perform parallel calculations with a reduce step at the end, and other more complicated parallel workloads.

>[AZURE.NOTE]At this time Batch only supports workloads that run on Windows Server-based virtual machines. Additionally, Batch doesn't currently support message passing interface (MPI) applications.

For a comparison of Batch with other HPC solution options in Azure, see [Batch and HPC solutions](batch-hpc-solutions.md).

## Developing with Batch

Develop with the Batch APIs to create and manage pools of compute nodes and to schedule the jobs and tasks that run on them. Write client apps or front-ends to run jobs and tasks on demand, on a schedule, or as part of a larger workflow managed by tools such as [Azure Data Factory](https://azure.microsoft.com/documentation/services/data-factory/).

See [API basics for Azure Batch](batch-api-basics.md) for more about the Batch concepts.

### Accounts you'll need

+ **Azure account and subscription** - If you don't have an account, you can activate your [MSDN subscriber benefits](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/).

+ **Batch account** - You use the name and URL of a Batch account and an access key as credentials when you make Batch API calls. One way to create a Batch account and manage access keys for the account is to use the [Azure preview portal](batch-account-create-portal.md).

+ **Storage account** - For most Batch scenarios you'll need an Azure storage account to store your data inputs and outputs and the scripts or executables that run on the compute nodes. To create a storage account, see [About Azure storage accounts](../storage/storage-create-storage-account.md).

### Batch development libraries and tools

Use these .NET libraries and tools with Visual Studio to develop and manage Azure Batch applications.

+ [Batch .NET client library](http://www.nuget.org/packages/Azure.Batch/) (NuGet) – Develop client applications to run jobs with the Batch service
+ [Batch .NET management library](http://www.nuget.org/packages/Microsoft.Azure.Management.Batch/) (NuGet) – Manage Batch accounts
+ [Batch Explorer](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer) (GitHub) - GUI application and sample to browse, access, and update major elements within a Batch account, including jobs and tasks, compute nodes and pools, and files on a compute node. See the [blog post](http://blogs.technet.com/b/windowshpc/archive/2015/01/20/azure-batch-explorer-sample-walkthrough.aspx).


## Scenario: Scale out a parallel workload

A common scenario with the Batch APIs involves scaling out intrinsically parallel work such as image rendering on a pool of compute nodes providing up to thousands of compute cores.

Figure 2 shows a workflow that uses a Batch .NET client application to run a parallel workload with Batch.


![Workitems workflow][work_item_workflow]

**Figure 2. Scale out a parallel workload on Batch**

1.	Upload input files (such as source data or images) required for a job to an Azure storage account. The Batch service will load files onto compute nodes when the tasks run.

2.	Upload the program files or scripts that will run on the compute nodes to the storage account. These might include binary files and their dependent assemblies. The Batch service will also load these files onto the compute nodes when the tasks run.

3.	Programmatically create a pool of Batch compute nodes in your Batch account, specifying properties such as their size and the OS they run. You can also define how the number of nodes in the pool [scales up or down](batch-automatic-scaling.md) in response to the workload. When a task runs, it's assigned a node from this pool.

4.	Programmatically define a Batch job to run the workload on the pool of nodes.

5.	Add tasks to the job. Each task uses the program that you uploaded to process information from a file you uploaded. Depending on your workload, you might want to run [multiple tasks at the same time](batch-parallel-node-tasks.md) on each compute node to maximize resource usage. Batch also supports specialized [job preparation and completion tasks](batch-job-prep-release.md) to prepare the compute nodes before the scheduled tasks run and to clean up afterward.

6.	Run the Batch workload and monitor the progress and results. The application communicates over HTTPS with the Batch service. To improve application performance when monitoring large numbers of pools, jobs, and tasks, take advantage of [efficient techniques to query](batch-efficient-list-queries.md) the Batch service.






## Next steps

* Get started developing your first application with the [Batch .NET client library](batch-dotnet-get-started.md)
* Browse the Batch code samples on [GitHub](https://github.com/Azure/azure-batch-samples)

[parallel]: ./media/batch-technical-overview/parallel.png
[work_item_workflow]: ./media/batch-technical-overview/work_item_workflow.png

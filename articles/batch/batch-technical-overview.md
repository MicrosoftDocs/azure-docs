<properties
	pageTitle="Azure Batch service basics | Microsoft Azure"
	description="Learn about using the Azure Batch service for large-scale parallel and HPC workloads"
	services="batch"
	documentationCenter=""
	authors="mmacy"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.workload="big-compute"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="02/12/2016"
	ms.author="marsma"/>

# Basics of Azure Batch

Azure Batch enables you to run large-scale parallel and high performance computing (HPC) applications efficiently in the cloud. It's a platform service that schedules compute-intensive work to run on a managed collection of virtual machines, and can scale compute resources to meet the needs of your jobs.

With the Batch service, you programmatically define Azure compute resources to execute large-scale batch jobs. You can run these jobs on demand or on a schedule, and you don't need to manually configure and manage an HPC cluster, individual virtual machines, virtual networks, or a job scheduler.

## Use cases for Batch

Batch is a managed Azure service that is used for *batch processing* or *batch computing*--running a large volume of similar tasks to get some desired result. Batch computing is most commonly used by organizations that process, transform, and analyze large amounts of data.

Batch works best with intrinsically parallel (also known as "embarrassingly parallel") applications and workloads, but many types of parallel workloads can be processed using Batch. Intrinsically parallel workloads are easily split into multiple tasks that perform work simultaneously on many computers.

![Parallel tasks][1]<br/>
*Parallel task processing on multiple computers*

Some examples of workloads that are commonly processed using this technique are:

* Financial risk modeling
* Climate and hydrology data analysis
* Image rendering, analysis, and processing
* Media encoding and transcoding
* Genetic sequence analysis
* Engineering stress analysis
* Software testing

Batch can also perform parallel calculations with a reduce step at the end, as well as execute more complex HPC workloads such as Message Passing Interface (MPI) applications.

For a comparison between Batch and other HPC solution options in Azure, see [Batch and HPC solutions](batch-hpc-solutions.md).

>[AZURE.NOTE] At this time, Batch supports workloads that run on Windows Server-based virtual machines only.

## Developing with Batch

When you build solutions that use Azure Batch for parallel workload processing, you do so programmatically using the Batch APIs. With the Batch APIs, you can create and manage pools of compute nodes and schedule jobs and tasks to run on those nodes. Using the Batch APIs to communicate with the Batch service, author a client application to efficiently process large-scale workloads for your organization, or provide a service front-end to your customers so that they can run jobs and tasks--on demand, or on a schedule. You can also use Batch as part of a larger workflow, managed by tools such as [Azure Data Factory][data_factory].

When you are ready to dig in to the Batch API and get a more in-depth understanding of the features it provides, check out the [Azure Batch feature overview](batch-api-basics.md).

### Accounts you'll need

+ **Azure account and subscription** - If you don't already have an Azure account, you can activate your [MSDN subscriber benefit][msdn_benefits], or sign up for a [free trial][free_trial]. When you create an account, a default subscription will be created for you.

+ **Batch account** - When your applications interact with the Batch service, the account name, the URL of the account, and an access key are used as credentials. All of your Batch resources such as pools, compute nodes, jobs, and tasks are associated with a Batch account. The easiest way to create an account and manage its access keys is to use the [Azure portal](batch-account-create-portal.md).

+ **Storage account** - Nearly every Batch scenario will use [Azure Storage][azure_storage] for file staging--for the programs that your tasks run, and for the data that they process--and for the storage of output data that your tasks generate. To create a Storage account, see [About Azure storage accounts](./../storage/storage-create-storage-account.md).

### Batch development libraries and tools

To build solutions using Azure Batch, you can use the .NET client libraries, PowerShell, or issue direct calls with the REST API.

+ [Batch .NET client library][api_net_nuget] (NuGet) – Develop client applications or services to run jobs with the Batch service
+ [Batch Management .NET client library][api_net_mgmt_nuget] (NuGet) – Manage Batch accounts programmatically in your client applications or services
+ [Azure Batch Explorer][batch_explorer] (GitHub) - Build this GUI application to browse, access, and update resources in a Batch account, including jobs and tasks, compute nodes and pools, and files on a compute node.

## Scenario: Scale out a parallel workload

A common scenario with the Batch APIs involves scaling out intrinsically parallel work such as image rendering on a pool of compute nodes providing up to thousands of compute cores.

*Figure 2* shows a common Batch workflow, with a client application or a hosted service using Batch to run a parallel workload.

![Batch solution workflow][2]<br/>
*Figure 2. Scale out a parallel workload in Batch*

1.	Upload input files (such as source data or images) required for a job to an Azure storage account. The Batch service will load files onto compute nodes when the job tasks run.

2.	Upload the program files or scripts that will run on the compute nodes to the storage account. These might include binary files and their dependent assemblies. The Batch service will also load these files onto the compute nodes when the tasks run.

3.	Programmatically create a pool of Batch compute nodes in your Batch account, specifying properties such as their size and the OS they run. You can also define how the number of nodes in the pool [scales up or down](batch-automatic-scaling.md) in response to the workload. When a task runs, it's assigned a node from this pool.

4.	Programmatically define a Batch job to run the workload on the pool of nodes.

5.	Add tasks to the job. Each task uses the program that you uploaded to process information from a file you uploaded. Depending on your workload, you might want to run [multiple tasks at the same time](batch-parallel-node-tasks.md) on each compute node to maximize resource usage. Batch also supports specialized [job preparation and completion tasks](batch-job-prep-release.md) to prepare the compute nodes before the scheduled tasks run and to clean up afterward.

6.	Run the Batch workload and monitor the progress and results. The application communicates over HTTPS with the Batch service. To improve application performance when monitoring large numbers of pools, jobs, and tasks, take advantage of [efficient techniques to query](batch-efficient-list-queries.md) the Batch service.

## Next steps

* Get started developing your first application with the [Batch client .NET library](batch-dotnet-get-started.md)
* Browse the Batch code samples on [GitHub](https://github.com/Azure/azure-batch-samples)

[azure_storage]: https://azure.microsoft.com/services/storage/
[api_net_nuget]: https://www.nuget.org/packages/Azure.Batch/
[api_net_mgmt_nuget]: https://www.nuget.org/packages/Microsoft.Azure.Management.Batch/
[batch_explorer]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer
[data_factory]: https://azure.microsoft.com/documentation/services/data-factory/
[free_trial]: https://azure.microsoft.com/pricing/free-trial/
[msdn_benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/

[1]: ./media/batch-technical-overview/tech_overview_01.png
[2]: ./media/batch-technical-overview/tech_overview_02.png

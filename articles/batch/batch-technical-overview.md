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
Azure Batch helps you run large-scale parallel and high performance computing (HPC) applications efficiently in the cloud. It's a platform service that provides job scheduling and autoscaling of a managed collection of virtual machines (compute nodes) to run the jobs. With the Batch service, you can set up batch workloads to run in Azure on demand or on a schedule, and not worry about the complexity of configuring and managing an HPC cluster, individual VMs, virtual networks, or a job scheduler.

>[AZURE.NOTE] To use Batch, you need an Azure account and subscription. If you don't have an account, you can activate your [MSDN subscriber benefits](http://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free trial](http://azure.microsoft.com/pricing/free-trial/).

## Use cases

Batch is a managed service for *batch processing* or *batch computing* - running a large volume of similar tasks on multiple compute nodes to get some desired result. Batch computing is a common pattern for organizations that process, transform, and analyze large amounts of data, either on a schedule or on-demand, with examples in fields ranging from financial services to engineering.

Batch works well with intrinsically parallel (sometimes called "embarrassingly parallel") applications or workloads, which lend themselves to running as parallel tasks on multiple computers, such as pools of compute nodes that you set up with the Batch service.

![Parallel tasks][parallel]

**Figure 1. Parallel tasks running on multiple computers**

Examples include:

* Financial risk modeling
* Image rendering and image processing
* Media encoding and transcoding
* Genetic sequence analysis
* Software testing

Batch can also perform parallel calculations with a reduce step at the end, and other more complicated parallel workloads.

>[AZURE.NOTE]At this time Batch only supports workloads that run on Windows Server compute nodes. Additionally, Batch doesn't currently support message passing interface (MPI) applications.

For a comparison of Batch with other HPC solution options in Azure, see [Batch and HPC solutions](batch-hpc-solutions.md).

## Developer scenarios

Develop with the Batch APIs to create and manage pools of VMs (compute nodes) and schedule the jobs and tasks that run on them. Write client apps or front-ends to run jobs and tasks on demand, on a schedule, or as part of a larger workflow managed by tools such as [Azure Data Factory](https://azure.microsoft.com/documentation/services/data-factory/).
See [API basics for Azure Batch](batch-api-basics.md) for more about the Batch concepts.

### Scenario: Scale out a parallel workload


A common scenario with the Batch APIs involves scaling out intrinsically parallel work such as image rendering on a pool of compute nodes providing up to thousands of compute cores. Instead of setting up a compute cluster or writing code to queue and schedule your jobs and move the necessary input and output data, you configure the Batch service to schedule large compute jobs and scale a pool of compute nodes up and down to run them.

Figure 2 shows a simplified workflow to submit an application to a Batch pool where it's distributed for processing.


![Workitems workflow][work_item_workflow]

**Figure 2. Scale out a parallel workload on Batch**

1.	Upload input files (such as source data or images) required for a job to an Azure storage account. The Batch service will load files onto compute nodes when the tasks run.
2.	Upload the dependent binary files to the storage account. The binary files include the program that is run by the task and the dependent assemblies. The Batch service will also load these files onto the compute nodes when the tasks run.
3.	Create a pool of compute nodes, specifying properties such as their size and the OS they run. You can also define how the number of nodes in the pool [scales up or down](batch-automatic-scaling.md) in response to the workload. When a task runs, it's assigned a node from this pool.
4.	Define a job to run the workload.
5.	Add tasks to the job. Each task uses the program that you uploaded to process information from a file you uploaded. Depending on your workload, you might want to run [multiple tasks at the same time](batch-parallel-node-tasks.md) on each compute node to maximize resource usage.
6.	Run the application and monitor the results of the output. When monitoring the Batch workload, you'll query programatically for potentially large numbers of pools, jobs, and tasks. To improve application performance, take advantage of [efficient techniques to query](batch-efficient-list-queries.md) the Batch service.



## <a id="BKMK_Account">Batch account</a>
In addition to needing an Azure account and subscription, you need one or more _Batch accounts_ to work with the Batch service. You need a Batch account name and an associated access key to authenticate all Batch API requests. You aren't charged extra to have a Batch account - you only get charged for your use of Azure compute resources and other services when your workloads run (see [Batch pricing](https://azure.microsoft.com/services/batch/)).

You can create a Batch account and manage access keys for the account in the [Azure Preview portal](https://portal.azure.com), with the [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md), or programmatically with the [Batch management library](http://www.nuget.org/packages/Microsoft.Azure.Management.Batch/).

You can run multiple Batch workloads in a single Batch account, or distribute your workloads among Batch accounts in different Azure regions. If you're running several large-scale workloads, be aware of certain [Batch service quotas and limits](batch-service-quotas.md) that apply to your Azure subscription and each Batch account.

## Batch development libraries and tools

Get these libraries and tools to develop and manage Azure Batch applications.

+ [Batch .NET client library](http://www.nuget.org/packages/Azure.Batch/) (NuGet) – Develop client applications to run jobs with the Batch service
+ [Batch .NET management library](http://www.nuget.org/packages/Microsoft.Azure.Management.Batch/) (NuGet) – Manage Batch accounts
+ [Batch Explorer](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer) (GitHub) - GUI application and sample to browse, access, and update major elements within a Batch account, including jobs and tasks, compute nodes and pools, and files on a compute node. See the [blog post](http://blogs.technet.com/b/windowshpc/archive/2015/01/20/azure-batch-explorer-sample-walkthrough.aspx).


## Additional resources

* [Azure Batch API basics](batch-api-basics.md)
* [Get Started with the Azure Batch Library for .NET](batch-dotnet-get-started.md)
* [Azure Batch REST API Reference](http://go.microsoft.com/fwlink/p/?LinkId=517803)

[parallel]: ./media/batch-technical-overview/parallel.png
[work_item_workflow]: ./media/batch-technical-overview/work_item_workflow.png

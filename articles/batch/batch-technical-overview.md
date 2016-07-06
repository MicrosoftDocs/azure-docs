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
	ms.date="07/06/2016"
	ms.author="marsma"/>

# Basics of Azure Batch

Azure Batch enables you to run large-scale parallel and high performance computing (HPC) applications efficiently in the cloud. It's a platform service that schedules compute-intensive work to run on a managed collection of virtual machines, and can automatically scale compute resources to meet the needs of your jobs.

With the Batch service, you define Azure compute resources to execute your applications in parallel, and at scale. You can run on-demand or scheduled jobs, and you don't need to manually create, configure, and manage an HPC cluster, individual virtual machines, virtual networks, or a complex job and task scheduling infrastructure.

## Use cases for Batch

Batch is a managed Azure service that is used for *batch processing* or *batch computing*--running a large volume of similar tasks to get some desired result. Batch computing is most commonly used by organizations that regularly process, transform, and analyze large volumes of data.

Batch works well with intrinsically parallel (also known as "embarrassingly parallel") applications and workloads. Intrinsically parallel workloads are easily split into multiple tasks that perform work simultaneously on many computers.

![Parallel tasks][1]<br/>

Some examples of workloads that are commonly processed using this technique are:

* Financial risk modeling
* Climate and hydrology data analysis
* Image rendering, analysis, and processing
* Media encoding and transcoding
* Genetic sequence analysis
* Engineering stress analysis
* Software testing

Batch can also perform parallel calculations with a reduce step at the end, as well as execute more complex HPC workloads such as [Message Passing Interface (MPI)](batch-mpi.md) applications.

For a comparison between Batch and other HPC solution options in Azure, see [Batch and HPC solutions](batch-hpc-solutions.md).

## Developing with Batch

Processing parallel workloads with Batch is typically done programmatically by using one of the [Batch APIs](#batch-development-apis). With the Batch APIs, you create and manage pools of compute nodes (virtual machines) and schedule jobs and tasks to run on those nodes. A client application or service that you author uses the Batch APIs to communicate with the Batch service.

You can efficiently process large-scale workloads for your organization, or provide a service front-end to your customers so that they can run jobs and tasks—on demand, or on a schedule—on one, hundreds, or even thousands of nodes. You can also use Batch as part of a larger workflow, managed by tools such as [Azure Data Factory](../data-factory/data-factory-data-processing-using-batch.md).

> [AZURE.TIP] When you're ready to dig in to the Batch API for a more in-depth understanding of the features it provides, check out the [Batch feature overview for developers](batch-api-basics.md).

### Azure accounts you'll need

When you develop Batch solutions, you'll use the following accounts in Microsoft Azure.

- **Azure account and subscription** - If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefit][msdn_benefits], or sign up for a [free Azure account][free_account]. When you create an account, a default subscription will be created for you.

- **Batch account** - When your applications interact with the Batch service, the account name, the URL of the account, and an access key are used as credentials. All of your Batch resources such as pools, compute nodes, jobs, and tasks are associated with a Batch account. You can [create and manage a Batch account](batch-account-create-portal.md) in the Azure portal.

- **Storage account** - Batch includes built-in support for working with files in [Azure Storage][azure_storage]. Nearly every Batch scenario will use Azure Storage--for staging the programs that your tasks run and the data that they process, and for the storage of output data that they generate. To create a Storage account, see [About Azure storage accounts](./../storage/storage-create-storage-account.md).

### Batch development APIs

Your applications and services can issue direct REST API calls, use one or more of the following client libraries, or a combination of both to manage compute resources and run parallel workloads at scale using the Batch service.

| API    | API reference | Download | Code samples |
| ----------------- | ------------- | -------- | ------------ |
| **Batch REST** | [MSDN][batch_rest] | N/A | [MSDN][batch_rest] |
| **Batch .NET**    | [MSDN][api_net] | [NuGet ][api_net_nuget] | [GitHub][api_sample_net] |
| **Batch Python**  | [readthedocs.io][api_python] | [PyPI][api_python_pypi] |[GitHub][api_sample_python] |
| **Batch Node.js** | [github.io][api_nodejs] | [npm][api_nodejs_npm] | - |
| **Batch Java** (preview) | [github.io][api_java] | [Maven snapshot repo][api_java_jar] | [GitHub][api_sample_java] |

### Batch resource management

In addition to the client APIs, you can also use the following to manage resources within your Batch account.

- [Batch PowerShell cmdlets][batch_ps]: The Azure Batch cmdlets in the [Azure PowerShell](../powershell-install-configure.md) module enable you to manage Batch resources with PowerShell.

- [Azure CLI](../xplat-cli-install.md): The Azure Command-Line Interface (Azure CLI) is a cross-platform toolset that provides shell commands for interacting with many Azure services, including Batch.

- [Batch Management .NET](batch-management-dotnet.md) client library: Also available via [NuGet][api_net_mgmt_nuget], you can use the Batch Management .NET client library to programmatically manage Batch accounts, quotas, and application packages. Reference for the management library is on [MSDN][api_net_mgmt].

## Scenario: Scale out a parallel workload

A common solution that uses the Batch APIs to interact with the Batch service involves scaling out intrinsically parallel work--such as the rendering of images for 3D scenes--on a pool of compute nodes. This pool of compute nodes can be your "render farm" that provides tens, hundreds, or even thousands of cores to your rendering job, for example.

The following diagram shows a common Batch workflow, with a client application or hosted service using Batch to run a parallel workload.

![Batch solution workflow][2]

In this common scenario, your application or service processes a computational workload in Azure Batch by performing the following steps:

1. Upload the **input files** and the **application** that will process those files to your Azure Storage account. The input files can be any data that your application will process, such as financial modeling data, or video files to be transcoded. The application files can be any application that is used for processing the data, such as a 3D rendering application or media transcoder.

2. Create a Batch **pool** of compute nodes in your Batch account--these are the virtual machines that will execute your tasks. You specify properties such as the [node size](./../cloud-services/cloud-services-sizes-specs.md), their operating system, and the location in Azure Storage of the application to install when the nodes join the pool (the application that you uploaded in step #1). You can also configure the pool to [automatically scale](batch-automatic-scaling.md)--dynamically adjust the number of compute nodes in the pool--in response to the workload that your tasks generate.

3. Create a Batch **job** to run the workload on the pool of compute nodes. When you create a job, you associate it with a Batch pool.

4. Add **tasks** to the job. When you add tasks to a job, the Batch service automatically schedules the tasks for execution on the compute nodes in the pool. Each task uses the application that you uploaded to process the input files.

    - 4a. Before a task executes, it can download the data (the input files) that it is to process to the compute node it is assigned to. If the application has not already been installed on the node (see step #2), it can be downloaded here instead. When the downloads are complete, the tasks execute on their assigned nodes.

5. As the tasks run, you can query Batch to monitor the progress of the job and its tasks. Your client application or service communicates with the Batch service over HTTPS, and because you might be monitoring thousands of tasks running on thousands of compute nodes, be sure to [query the Batch service efficiently](batch-efficient-list-queries.md).

6. As the tasks complete, they can upload their result data to Azure Storage. You can also retrieve files directly from compute nodes.

7. When your monitoring detects that the tasks in your job have completed, your client application or service can download the output data for further processing or evaluation.

Keep in mind that this is just one way to use Batch, and this scenario describes only a few of its available features. For example, you can execute [multiple tasks in parallel](batch-parallel-node-tasks.md) on a each compute node, and you can use [job preparation and completion tasks](batch-job-prep-release.md) to prepare the nodes for your jobs, then clean up afterward.

## Next steps

Now that you have a high-level overview of the Batch service, it's time to dig deeper to learn how you can use it to process your compute-intensive parallel workloads.

- Read the [Batch feature overview for developers](batch-api-basics.md) to learn more in-depth information on the API features that Batch provides for processing your workloads. This is essential reading for anyone preparing to use Batch.

- [Get started with the Azure Batch library for .NET](batch-dotnet-get-started.md) to learn how to use C# and the Batch .NET library to execute a simple workload using a common Batch workflow. This should be one of your first stops while learning how to use the Batch service. There is also a [Python version](batch-python-tutorial.md) of the tutorial.

- Download the [code samples on GitHub][github_samples] to see how both C# and Python can interface with Batch to schedule and process sample workloads.

- Check out the [Batch Learning Path][learning_path] to get an idea of the resources available to you as you learn to work with Batch.

[azure_storage]: https://azure.microsoft.com/services/storage/
[api_java]: http://azure.github.io/azure-sdk-for-java/
[api_java_jar]: http://adxsnapshots.azurewebsites.net/?dir=com%5cmicrosoft%5cazure%5cazure-batch
[api_net]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[api_net_nuget]: https://www.nuget.org/packages/Azure.Batch/
[api_net_mgmt]: https://msdn.microsoft.com/library/azure/mt463120.aspx
[api_net_mgmt_nuget]: https://www.nuget.org/packages/Microsoft.Azure.Management.Batch/
[api_nodejs]: http://azure.github.io/azure-sdk-for-node/azure-batch/latest/
[api_nodejs_npm]: https://www.npmjs.com/package/azure-batch
[api_python]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.html
[api_python_pypi]: https://pypi.python.org/pypi/azure-batch
[api_sample_net]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp
[api_sample_python]: https://github.com/Azure/azure-batch-samples/tree/master/Python/Batch
[api_sample_java]: https://github.com/Azure/azure-batch-samples/tree/master/Java/
[batch_ps]: https://msdn.microsoft.com/library/azure/mt125957.aspx
[batch_rest]: https://msdn.microsoft.com/library/azure/Dn820158.aspx
[free_account]: https://azure.microsoft.com/free/
[github_samples]: https://github.com/Azure/azure-batch-samples
[learning_path]: https://azure.microsoft.com/documentation/learning-paths/batch/
[msdn_benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/

[1]: ./media/batch-technical-overview/tech_overview_01.png
[2]: ./media/batch-technical-overview/tech_overview_02.png

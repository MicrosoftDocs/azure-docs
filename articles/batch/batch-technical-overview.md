---
title: Azure Batch runs large-scale parallel computing solutions in the cloud | Microsoft Docs
description: Learn about using the Azure Batch service for large-scale parallel and HPC workloads
services: batch
documentationcenter: ''
author: tamram
manager: timlt
editor: ''

ms.assetid: 93e37d44-7585-495e-8491-312ed584ab79
ms.service: batch
ms.workload: big-compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 05/05/2017
ms.author: tamram
ms.custom: H1Hack27Feb2017

---
# Run intrinsically parallel workloads with Batch

Azure Batch is a platform service for running large-scale parallel and high-performance computing (HPC) applications efficiently in the cloud. Azure Batch schedules compute-intensive work to run on a managed collection of virtual machines, and can automatically scale compute resources to meet the needs of your jobs.

With Azure Batch, you can easily define Azure compute resources to execute your applications in parallel, and at scale. There's no need to manually create, configure, and manage an HPC cluster, individual virtual machines, virtual networks, or a complex job and task scheduling infrastructure. Azure Batch automates or simplifies these tasks for you.

## Use cases for Batch
Batch is a managed Azure service that is used for *batch processing* or *batch computing*--running a large volume of similar tasks for a desired result. Batch computing is most commonly used by organizations that regularly process, transform, and analyze large volumes of data.

Batch works well with intrinsically parallel (also known as "embarrassingly parallel") applications and workloads. Intrinsically parallel workloads are those that are easily split into multiple tasks that perform work simultaneously on many computers.

![Parallel tasks][1]<br/>

Some examples of workloads that are commonly processed using this technique are:

* Financial risk modeling
* Climate and hydrology data analysis
* Image rendering, analysis, and processing
* Media encoding and transcoding
* Genetic sequence analysis
* Engineering stress analysis
* Software testing

Batch can also perform parallel calculations with a reduce step at the end, and execute more complex HPC workloads such as [Message Passing Interface (MPI)](batch-mpi.md) applications.

For a comparison between Batch and other HPC solution options in Azure, see [Batch and HPC solutions](batch-hpc-solutions.md).

[!INCLUDE [batch-pricing-include](../../includes/batch-pricing-include.md)]

## Scenario: Scale out a parallel workload
A common solution that uses the Batch APIs to interact with the Batch service involves scaling out intrinsically parallel work--such as the rendering of images for 3D scenes--on a pool of compute nodes. This pool of compute nodes can be your "render farm" that provides tens, hundreds, or even thousands of cores to your rendering job, for example.

The following diagram shows a common Batch workflow, with a client application or hosted service using Batch to run a parallel workload.

![Batch solution workflow][2]

In this common scenario, your application or service processes a computational workload in Azure Batch by performing the following steps:

1. Upload the **input files** and the **application** that will process those files to your Azure Storage account. The input files can be any data that your application will process, such as financial modeling data, or video files to be transcoded. The application files can be any application that is used for processing the data, such as a 3D rendering application or media transcoder.
2. Create a Batch **pool** of compute nodes in your Batch account--these nodes are the virtual machines that will execute your tasks. You specify properties such as the [node size](../cloud-services/cloud-services-sizes-specs.md), their operating system, and the location in Azure Storage of the application to install when the nodes join the pool (the application that you uploaded in step #1). You can also configure the pool to [automatically scale](batch-automatic-scaling.md) in response to the workload that your tasks generate. Auto-scaling dynamically adjusts the number of compute nodes in the pool.
3. Create a Batch **job** to run the workload on the pool of compute nodes. When you create a job, you associate it with a Batch pool.
4. Add **tasks** to the job. When you add tasks to a job, the Batch service automatically schedules the tasks for execution on the compute nodes in the pool. Each task uses the application that you uploaded to process the input files.
   
   * 4a. Before a task executes, it can download the data (the input files) that it is to process to the compute node it is assigned to. If the application has not already been installed on the node (see step #2), it can be downloaded here instead. When the downloads are complete, the tasks execute on their assigned nodes.
5. As the tasks run, you can query Batch to monitor the progress of the job and its tasks. Your client application or service communicates with the Batch service over HTTPS. Because you may be monitoring thousands of tasks running on thousands of compute nodes, be sure to [query the Batch service efficiently](batch-efficient-list-queries.md).
6. As the tasks complete, they can upload their result data to Azure Storage. You can also retrieve files directly from the file system on a compute node.
7. When your monitoring detects that the tasks in your job have completed, your client application or service can download the output data for further processing or evaluation.

Keep in mind this is just one way to use Batch, and this scenario describes only a few of its available features. For example, you can execute [multiple tasks in parallel](batch-parallel-node-tasks.md) on each compute node, and you can use [job preparation and completion tasks](batch-job-prep-release.md) to prepare the nodes for your jobs, then clean up afterward.

## Next steps
Now that you have a high-level overview of the Batch service, it's time to dig deeper to learn how you can use it to process your compute-intensive parallel workloads.

* Read the [Batch feature overview for developers](batch-api-basics.md), essential information for anyone preparing to use Batch. The article contains more detailed information about Batch service resources like pools, nodes, jobs, and tasks, and the many API features that you can use while building your Batch application.
* Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.
* [Get started with the Azure Batch library for .NET](batch-dotnet-get-started.md) to learn how to use C# and the Batch .NET library to execute a simple workload using a common Batch workflow. This article should be one of your first stops while learning how to use the Batch service. There is also a [Python version](batch-python-tutorial.md) of the tutorial.
* Download the [code samples on GitHub][github_samples] to see how both C# and Python can interface with Batch to schedule and process sample workloads.
* Check out the [Batch Learning Path][learning_path] to get an idea of the resources available to you as you learn to work with Batch.


[github_samples]: https://github.com/Azure/azure-batch-samples
[learning_path]: https://azure.microsoft.com/documentation/learning-paths/batch/

[1]: ./media/batch-technical-overview/tech_overview_01.png
[2]: ./media/batch-technical-overview/tech_overview_02.png

---
title: Azure Batch runs large parallel jobs in the cloud
description: Learn about using the Azure Batch service for large-scale parallel and HPC workloads
ms.topic: conceptual
ms.date: 01/19/2018
---

# What is Azure Batch?

Use Azure Batch to run large-scale parallel and high-performance computing (HPC) batch jobs efficiently in Azure. Azure Batch creates and manages a pool of compute nodes (virtual machines), installs the applications you want to run, and schedules jobs to run on the nodes. There is no cluster or job scheduler software to install, manage, or scale. Instead, you use [Batch APIs and tools](batch-apis-tools.md), command-line scripts, or the Azure portal to configure, manage, and monitor your jobs. 

Developers can use Batch as a platform service to build SaaS applications or client apps where large-scale execution is required. For example, build a service with Batch to run a Monte Carlo risk simulation for a financial services company, or a service to process many images.

There is no additional charge for using Batch. You only pay for the underlying resources consumed, such as the virtual machines, storage, and networking.

For a comparison between Batch and other HPC solution options in Azure, see [High Performance Computing (HPC) on Azure](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/).

## Run parallel workloads
Batch works well with intrinsically parallel (also known as "embarrassingly parallel") workloads. Intrinsically parallel workloads are those where the applications can run independently, and each instance completes part of the work. When the applications are executing, they might access some common data, but they do not communicate with other instances of the application. Intrinsically parallel workloads can therefore run at a large scale, determined by the amount of compute resources available to run applications simultaneously.

Some examples of intrinsically parallel workloads you can bring to Batch:

* Financial risk modeling using Monte Carlo simulations
* VFX and 3D image rendering
* Image analysis and processing
* Media transcoding
* Genetic sequence analysis
* Optical character recognition (OCR)
* Data ingestion, processing, and ETL operations
* Software test execution

You can also use Batch to [run tightly coupled workloads](batch-mpi.md); these are workloads where the applications you run need to communicate with each other, as opposed to run independently. Tightly coupled applications normally use the Message Passing Interface (MPI) API. You can run your tightly coupled workloads with Batch using [Microsoft MPI](https://msdn.microsoft.com/library/bb524831(v=vs.85).aspx) or Intel MPI. Improve application performance with specialized [HPC](../virtual-machines/linux/sizes-hpc.md) and [GPU-optimized](../virtual-machines/linux/sizes-gpu.md) VM sizes.

Some examples of tightly coupled workloads:
* Finite element analysis
* Fluid dynamics
* Multi-node AI training

Many tightly coupled jobs can be run in parallel using Batch. For example, perform multiple simulations of a liquid flowing through a pipe with varying pipe widths.

## Additional Batch capabilities

Higher-level, workload-specific capabilities are also available for Azure Batch:
* Batch supports large-scale [rendering workloads](batch-rendering-service.md) with rendering tools including Autodesk Maya, 3ds Max, Arnold, and V-Ray. 
* R users can install the [doAzureParallel R package](https://github.com/Azure/doAzureParallel) to easily scale out the execution of R algorithms on Batch pools.

You can also run Batch jobs as part of a larger Azure workflow to transform data, managed by tools such as [Azure Data Factory](../data-factory/transform-data-using-dotnet-custom-activity.md).


## How it works
A common scenario for Batch involves scaling out intrinsically parallel work, such as the rendering of images for 3D scenes, on a pool of compute nodes. This pool of compute nodes can be your "render farm" that provides tens, hundreds, or even thousands of cores to your rendering job.

The following diagram shows steps in a common Batch workflow, with a client application or hosted service using Batch to run a parallel workload.

![Batch solution walkthrough](./media/batch-technical-overview/tech_overview_03.png)


|Step  |Description  |
|---------|---------|
|1.  Upload **input files** and the **applications** to process those files to your Azure Storage account.     |The input files can be any data that your application processes, such as financial modeling data, or video files to be transcoded. The application files can include scripts or applications that process the data, such as a media transcoder.|
|2.  Create a Batch **pool** of compute nodes in your Batch account, a **job** to run the workload on the  pool, and **tasks** in the job.     | Pool nodes are the VMs that execute your tasks. Specify properties such as the number and size of the nodes, a Windows or Linux VM image, and an application to install when the nodes join the pool. Manage the cost and size of the pool by using [low-priority VMs](batch-low-pri-vms.md) or [automatically scaling](batch-automatic-scaling.md) the number of nodes as the workload changes. <br/><br/>When you add tasks to a job, the Batch service automatically schedules the tasks for execution on the compute nodes in the pool. Each task uses the application that you uploaded to process the input files. |
|3.  Download **input files** and the **applications** to Batch     |Before each task executes, it can download the input data that it is to process to the assigned compute node. If the application isn't already installed on the pool nodes, it can be downloaded here instead. When the downloads from Azure Storage complete, the task executes on the assigned node.|
|4.  Monitor **task execution**     |As the tasks run, query Batch to monitor the progress of the job and its tasks. Your client application or service communicates with the Batch service over HTTPS. Because you may be monitoring thousands of tasks running on thousands of compute nodes, be sure to [query the Batch service efficiently](batch-efficient-list-queries.md).|
|5.  Upload **task output**     |As the tasks complete, they can upload their result data to Azure Storage. You can also retrieve files directly from the file system on a compute node.|
|6.  Download **output files**     |When your monitoring detects that the tasks in your job have completed, your client application or service can download the output data for further processing.|




Keep in mind this is just one way to use Batch, and this scenario describes just some of its features. For example, you can execute [multiple tasks in parallel](batch-parallel-node-tasks.md) on each compute node. Or, use [job preparation and completion tasks](batch-job-prep-release.md) to prepare the nodes for your jobs, then clean up afterward. 

See [Batch service workflow and primary resources](batch-service-workflow-features.md) for an overview of features such as pools, nodes, jobs, and tasks. Also see the latest [Batch service updates](https://azure.microsoft.com/updates/?product=batch).

## Next steps

Get started with Azure Batch with one of these quickstarts:
* [Run your first Batch job with the Azure CLI](quick-create-cli.md)
* [Run your first Batch job with the Azure portal](quick-create-portal.md)
* [Run your first Batch job using the .NET API](quick-run-dotnet.md)
* [Run your first Batch job using the Python API](quick-run-python.md)


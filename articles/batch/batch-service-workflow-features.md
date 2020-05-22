---
title: Batch service workflow and resources
description: Learn about the features of the Batch service and its high-level workflow from a development standpoint.
ms.topic: conceptual
ms.date: 05/12/2020

---
# Batch service workflow and resources

In this overview of the core components of the Azure Batch service, we discuss the high-level workflow that Batch developers can use to build large-scale parallel compute solutions, along with the primary service resources that are used.

Whether you're developing a distributed computational application or service that issues direct [REST API](https://docs.microsoft.com/rest/api/batchservice/) calls or you're using another one of the [Batch SDKs](batch-apis-tools.md#batch-service-apis), you'll use many of the resources and features discussed here.

> [!TIP]
> For a higher-level introduction to the Batch service, see [Basics of Azure Batch](batch-technical-overview.md). Also see the latest [Batch service updates](https://azure.microsoft.com/updates/?product=batch).

## Basic workflow

The following high-level workflow is typical of nearly all applications and services that use the Batch service for processing parallel workloads:

1. Upload the **data files** that you want to process to an [Azure Storage](../storage/index.yml) account. Batch includes built-in support for accessing Azure Blob storage, and your tasks can download these files to [compute nodes](nodes-and-pools.md#nodes) when the tasks are run.
2. Upload the **application files** that your tasks will run. These files can be binaries or scripts and their dependencies, and are executed by the tasks in your jobs. Your tasks can download these files from your Storage account, or you can use the [application packages](nodes-and-pools.md#application-packages) feature of Batch for application management and deployment.
3. Create a [pool](nodes-and-pools.md#pools) of compute nodes. When you create a pool, you specify the number of compute nodes for the pool, their size, and the operating system. When each task in your job runs, it's assigned to execute on one of the nodes in your pool.
4. Create a [job](jobs-and-tasks.md#jobs). A job manages a collection of tasks. You associate each job to a specific pool where that job's tasks will run.
5. Add [tasks](jobs-and-tasks.md#tasks) to the job. Each task runs the application or script that you uploaded to process the data files it downloads from your Storage account. As each task completes, it can upload its output to Azure Storage.
6. Monitor job progress and retrieve the task output from Azure Storage.

> [!NOTE]
> You need a [Batch account](accounts.md) to use the Batch service. Most Batch solutions also use an associated [Azure Storage](../storage/index.yml) account for file storage and retrieval.

## Batch service resources

The following topics discuss the resources of Batch that enable your distributed computational scenarios.

- [Batch accounts and storage accounts](accounts.md)
- [Nodes and pools](nodes-and-pools.md)
- [Jobs and tasks](jobs-and-tasks.md)
- [Files and directories](files-and-directories.md)

## Next steps

- Learn about the [Batch APIs and tools](batch-apis-tools.md) available for building Batch solutions.
- Learn the basics of developing a Batch-enabled application using the [Batch .NET client library](quick-run-dotnet.md) or [Python](quick-run-python.md). These quickstarts guide you through a sample application that uses the Batch service to execute a workload on multiple compute nodes, and includes using Azure Storage for workload file staging and retrieval.
- Download and install [Batch Explorer](https://azure.github.io/BatchExplorer/) for use while you develop your Batch solutions. Use Batch Explorer to help create, debug, and monitor Azure Batch applications.
- See community resources including [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-batch), the [Batch Community repo](https://github.com/Azure/Batch), and the [Azure Batch forum](https://docs.microsoft.com/answers/topics/azure-batch.html).

---
title: Persist results or logs from completed jobs and tasks to a data store - Azure Batch | Microsoft Docs
description: Learn about different options for persisting output data from Batch tasks and jobs. You can persist data to Azure Storage, or to another data store.
services: batch
author: laurenhughes
manager: jeconnoc
editor: ''

ms.assetid: 16e12d0e-958c-46c2-a6b8-7843835d830e
ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 11/14/2018
ms.author: lahugh
ms.custom: H1Hack27Feb2017

---

# Persist job and task output

[!INCLUDE [batch-task-output-include](../../includes/batch-task-output-include.md)]

Some common examples of task output include:

- Files created when the task processes input data.
- Log files associated with task execution.

This article describes various options for persisting task output.

## Options for persisting output

Depending on your scenario, there are a few different approaches you can take to persist task output:

- [Use the Batch service API](batch-task-output-files.md).  
- [Use the Batch File Conventions library for .NET](batch-task-output-file-conventions.md).  
- Implement the Batch File Conventions standard in your application.
- Implement a custom file movement solution.

The following sections briefly describe each approach as well as general design considerations for persisting output.

### Use the Batch service API

The Batch service supports specifying output files in Azure Storage for task data when you [add a task to a job](https://docs.microsoft.com/rest/api/batchservice/add-a-task-to-a-job) or [add a collection of tasks to a job](https://docs.microsoft.com/rest/api/batchservice/add-a-collection-of-tasks-to-a-job).

For more information on persisting task output with the Batch service API, see [Persist task data to Azure Storage with the Batch service API](batch-task-output-files.md).

### Use the Batch File Conventions library for .NET

Batch defines an optional set of conventions for naming task output files in Azure Storage. The [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/psSdkJson6/src/SDKs/Batch/Support/FileConventions#conventions) describes these conventions. The File Conventions standard determines the names of the destination container and blob path in Azure Storage for a given output file based on the names of the job and task.

It's up to you whether you decide to use the File Conventions standard for naming your output data files. You can also name the destination container and blob however you wish. If you do use the File Conventions standard for naming output files, then your output files are available for viewing in the [Azure portal][portal].

Developers building Batch solutions with C# and .NET can use the [File Conventions library for .NET][nuget_package] to persist task data to an Azure Storage account, according to the [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/psSdkJson6/src/SDKs/Batch/Support/FileConventions#conventions). The File Conventions library handles moving output files to Azure Storage and naming destination containers and blobs in a well-known way.

For more information on persisting task output with the File Conventions library for .NET, see [Persist job and task data to Azure Storage with the Batch File Conventions library for .NET](batch-task-output-file-conventions.md).

### Implement the Batch File Conventions standard

If you are using a language other than .NET, you can implement the [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/psSdkJson6/src/SDKs/Batch/Support/FileConventions#conventions) in your own application.

You may want to implement the File Conventions naming standard yourself when you want a proven naming scheme, or when you want to view task output in the Azure portal.

### Implement a custom file movement solution

You can also implement your own complete file movement solution. Use this approach when:

- You want to persist task data to a data store other than Azure Storage. To upload files to a data store like Azure SQL or Azure DataLake, you can create a custom script or executable to upload to that location. You can then call it on the command line after running your primary executable. For example, on a Windows node, you might call these two commands: `doMyWork.exe && uploadMyFilesToSql.exe`
- You want to perform check-pointing or early upload of initial results.
- You want to maintain granular control over error handling. For example, you may want to implement your own solution if you want to use task dependency actions to take certain upload actions based on specific task exit codes. For more information on task dependency actions, see [Create task dependencies to run tasks that depend on other tasks](batch-task-dependencies.md).

## Design considerations for persisting output

When designing your Batch solution, consider the following factors related to job and task outputs.

- **Compute node lifetime**: Compute nodes are often transient, especially in autoscale-enabled pools. Output from a task that runs on a node is available only while the node exists, and only within the file retention period you've set for the task. If a task produces output that may be needed after the task is complete, then the task must upload its output files to a durable store such as Azure Storage.

- **Output storage**: Azure Storage is recommended as a data store for task output, but you can use any durable storage. Writing task output to Azure Storage is integrated into the Batch service API. If you use another form of durable storage, you'll need to write the application logic to persist task output yourself.

- **Output retrieval**: You can retrieve task output directly from the compute nodes in your pool, or from Azure Storage or another data store if you have persisted task output. To retrieve a task's output directly from a compute node, you need the file name and its output location on the node. If you persist task output to Azure Storage, then you need the full path to the file in Azure Storage to download the output files with the Azure Storage SDK.

- **Viewing output**: When you navigate to a Batch task in the Azure portal and select **Files on node**, you are presented with all files associated with the task, not just the output files you're interested in. Again, files on compute nodes are available only while the node exists and only within the file retention time you've set for the task. To view task output that you've persisted to Azure Storage, you can use the Azure portal or an Azure Storage client application such as the [Azure Storage Explorer][storage_explorer]. To view output data in Azure Storage with the portal or another tool, you must know the file's location and navigate to it directly.

## Next steps

- Explore using the new features in the Batch service API to persist task data in [Persist task data to Azure Storage with the Batch service API](batch-task-output-files.md).
- Learn about using the Batch File Conventions library for .NET in [Persist job and task data to Azure Storage with the Batch File Conventions library for .NET](batch-task-output-file-conventions.md).
- See the [PersistOutputs][github_persistoutputs] sample project on GitHub, which demonstrates how to use both the Batch client library for .NET and the File Conventions library for .NET to persist task output to durable storage.

[nuget_package]: https://www.nuget.org/packages/Microsoft.Azure.Batch.Conventions.Files
[portal]: https://portal.azure.com
[storage_explorer]: https://storageexplorer.com/
[github_persistoutputs]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/PersistOutputs 

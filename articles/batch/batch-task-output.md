---
title: Persist job and task output to a data store
description: Learn how to persist output data from Azure Batch tasks and jobs to Azure Storage or other stores.
ms.topic: how-to
ms.date: 12/20/2021
ms.custom: H1Hack27Feb2017
---

# Persist job and task output

[!INCLUDE [batch-task-output-include](../../includes/batch-task-output-include.md)]
 
Some common examples of task output include:

- Files created when the task processes input data.
- Log files associated with task execution.

This article describes various options for persisting output data. You can persist output data from Batch tasks and jobs to Azure Storage, or other stores.

## Options for persisting output

There are multiple ways to persist output data. Choose the best method for your scenario:

- [Use the Batch service API](#batch-service-api).  
- [Use the Batch File Conventions library for .NET](#batch-file-conventions-library).  
- [Use the Batch File Conventions library](#batch-file-conventions-library) for C# and .NET applications.
- [Use the Batch File Conventions standard](#batch-file-conventions-standard) for languages other than .NET.
- [Use a custom file movement solution](#custom-file-movement-solution).

### Batch service API

You can use the Batch service API to persist output data. Specify output files in Azure Storage for task data when you [add a task to a job](/rest/api/batchservice/add-a-task-to-a-job) or [add a collection of tasks to a job](/rest/api/batchservice/add-a-collection-of-tasks-to-a-job).

For more information, see [Persist task data to Azure Storage with the Batch service API](batch-task-output-files.md).

### Batch File Conventions library

The [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files#conventions) is an optional set of conventions for naming task output files in Azure Storage. The standard provides naming conventions for a file's destination container and blob path, based on the names of the job and task.

It's optional to use the File Conventions standard for naming your output data files. You can choose to name the destination container and blob path instead. If you do use the File Conventions standard, then you can view your output files in the [Azure portal](https://portal.azure.com). 

If you're building a Batch solution with C# and .NET, you can use the [Batch File Conventions library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Batch.Conventions.Files). The library moves output files to Azure Storage, and names destination containers and blobs according to the Batch File Conventions standard.

For more information, see [Persist job and task data to Azure Storage with the Batch File Conventions library for .NET](batch-task-output-file-conventions.md).

### Batch File Conventions standard

If you're using a language other than .NET, you can implement the [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files#conventions) in your own application. Use this approach when:

- You want to use a common naming scheme.
- You want to view task output in the [Azure portal](https://portal.azure.com).

### Custom file movement solution

You can also implement your own complete file movement solution. Use this approach when:

- You want to persist task data to a data store other than Azure Storage. For example, you want to upload files to a data store like Azure SQL or Azure DataLake. Create a custom script or executable to upload to that location. Then, call the custom script or executable on the command line after running your primary executable. For example, on a Windows node, call `doMyWork.exe && uploadMyFilesToSql.exe`.
- You want to do checkpointing or early uploading of initial results.
- You want to maintain granular control over error handling. For example, you want to [use task dependency actions](batch-task-dependencies.md) to take certain upload actions based on specific task exit codes. 

## Design considerations

When you design your Batch solution, consider the following factors.

Compute nodes are often transient, especially in Batch pools with autoscaling enabled. You can only see output from a task:

- While the node where the task is running exists.
- During the file retention period that you set for the task.

When you view a Batch task in the Azure portal, and select **Files on node**, you see all files for that task, not just the output files. To retrieve task output directly from the compute nodes in your pool, you need the file name and its output location on the node.

If you want to keep task output data longer, configure the task to upload its output files to a data store. It's recommended to use Azure storage as the data store. There's integration for writing task output data to Azure Storage in the Batch service API. You can use other durable storage options to keep your data. However, you need to write the application logic for other storage options yourself. 

To view your output data in Azure Storage, use the [Azure portal](https://portal.azure.com) or an Azure Storage client application, such as [Azure Storage Explorer](https://storageexplorer.com/). Note your output file's location, and go to that location directly.

## Next step

> [!div class="nextstepaction"]
> [PersistOutputs sample project](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/PersistOutputs)

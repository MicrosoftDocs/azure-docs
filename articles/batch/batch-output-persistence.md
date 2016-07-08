<properties
	pageTitle="Persisting job and task output in Azure Batch | Microsoft Azure"
	description="Use the "
	services="batch"
	documentationCenter=".net"
	authors="mmacy"
	manager="timlt"
	editor="" />

<tags
	ms.service="batch"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="big-compute"
	ms.date="07/12/2016"
	ms.author="marsma" />

# Store and retrieve task output

The tasks you run in your Batch jobs typically produce output files that must be stored and then retrieved--by other tasks in the job, the application or service that executed the job, or both. This article details a conventions-based method and helper library you can use to persist your task output to Azure Blob storage, associate that output with the job and its tasks, and then retrieve the output using a job- and task-centric manner. Following the conventions in this article will also enable viewing your task output in the "Saved output files" and "Saved logs" blades in the the [Azure portal][portal].

>[AZURE.NOTE] The file storage and retrieval method discussed here provides similar functionality to the way **Batch Apps** (now deprecated) managed its task outputs.

## Task output challenges

Saving and retrieving task output presents several challenges for the Batch user:

* **Compute node lifetime**: Compute nodes are often transient, especially in autoscale-enabled pools. The outputs of the tasks that run on a node are available only while the node exists, and only within the file retention time you've set for the task. To ensure that the task output is preserved, your tasks must therefore upload their output files to a durable store, for example, Azure Storage.

* **Storing output**: To preserve task output data, you will typically use the Azure Storage SDK in your task application to upload its output data to a Blob storage container. In most situations, you must design and implement a strict naming convention so that other tasks in the job (such as a merge task) or your client application can determine the path of, and then download, this output.

* **Retrieving output**: If you wish to retrieve a task's output directly from a compute node, you must first determine which node that task executed on, and then download it from that node. If, however, your task stores its output to Azure Storage, you must write the code to first determine the full path to the file in Azure Storage (perhaps using the convention discussed in "Storing output" above), and also for downloading the file using the Azure Storage SDK. There is currently no built-in feature of the Batch SDK to determine which output files are associated with a certain task--you must determine or track this manually.

* **Viewing output**: Previously, if you wanted to view an individual task's outputs in the Azure portal, you first needed to determine which node it executed on, then navigate to that compute node to view its files. Alternatively, you needed to know where in Azure Storage the output was uploaded to, then navigate to it within your Azure Storage account in the portal. The next section, [Solving task output challenges](#solving-task-output-challenges), addresses this and the other challenges.

## Solving task output challenges

The Batch team has addressed these challenges by introducing task output viewing support in the portal, as well as by supplying a helper library to assist with output storing and retrieval in a format that the portal can consume.

**Task output in the Azure portal**

The Azure portal now supports viewing a task's outputs and logs directly. There are two requirements to enable this support, both of which we discuss in-depth in this article:

 1. [Linked Azure Storage account](#linked-storage-account)
 2. Adherence to predefined Storage container and output file [name conventions](#requirement-name-conventions)

**File conventions helper library**

The [Azure Batch File Conventions][net_fileconventions_readme] (NOT REAL URL) library assists you in storing your task output to Azure Storage using the naming conventions required by the Azure portal. It also provides helper methods for retrieving task outputs.

## Requirement: linked storage account

Persisting your task output with this method requires that you link an Azure Storage account with your Batch account. If you haven't already, link a Storage account to your Batch account by using the [Azure portal][portal]:

**Batch account** blade > **Settings** > **Storage Account** > **Storage Account** (None) > Select a Storage account in your subscription

For a more detailed walk-through on linking a Storage account, see the [Link a storage account](batch-application-packages.md#link-a-storage-account) section of [Application deployment with Azure Batch application packages](batch-application-packages.md).

## Requirement: name conventions

At the heart of this method of output persistence are naming conventions for blob storage containers and the files your tasks upload. When you save task output to Azure Storage, the Azure portal is able to discover the files associated with your jobs and tasks only if the files have been named using the conventions described in [Azure Batch File Conventions][net_fileconventions_readme] (NOT FINAL URL).

## Using the file conventions library

Words.

## Persist output

Words.

## Retrieve output

Words...don't need to know the layout in storage, don't need storage logic, you can just say "get me the files for this task."

## View output in the Azure portal

By following the guidance in this article, you will be able to view the output of your tasks and jobs in the Azure portal.

**[screenshot_here]**

## Code sample

The [PersistOutputs][github_taskdependencies] sample project is one of the [Azure Batch code samples][github_samples] on GitHub. This Visual Studio 2015 solution...

## Next steps

### Application deployment

The [application packages](batch-application-packages.md) feature of Batch provides an easy way to both deploy and version the applications that your tasks execute on compute nodes.

### Installing applications and staging data

Check out the [Installing applications and staging data on Batch compute nodes][forum_post] post in the Azure Batch forum for an overview of the various methods of preparing your nodes for running tasks. Written by one of the Azure Batch team members, this post is a good primer on the different ways to get files (including both applications and task input data) onto your compute nodes, and some special considerations to take into account for each method.

[forum_post]: https://social.msdn.microsoft.com/Forums/en-US/87b19671-1bdf-427a-972c-2af7e5ba82d9/installing-applications-and-staging-data-on-batch-compute-nodes?forum=azurebatch
[github_taskdependencies]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/TaskDependencies
[github_samples]: https://github.com/Azure/azure-batch-samples
[net_batchclient]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx
[net_cloudjob]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.aspx
[net_cloudtask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_dependson]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.dependson.aspx
[net_exitcode]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskexecutioninformation.exitcode.aspx
[net_fileconventions_readme]: https://github.com/Azure/batch-sdk-for-net-pr/blob/batch/develop/src/Batch/FileConventions/README.md
[net_msdn]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_onid]: https://msdn.microsoft.com/library/microsoft.azure.batch.taskdependencies.onid.aspx
[net_onids]: https://msdn.microsoft.com/library/microsoft.azure.batch.taskdependencies.onids.aspx
[net_onidrange]: https://msdn.microsoft.com/library/microsoft.azure.batch.taskdependencies.onidrange.aspx
[net_taskexecutioninformation]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskexecutioninformation.aspx
[net_taskstate]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.common.taskstate.aspx
[net_usestaskdependencies]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudjob.usestaskdependencies.aspx
[net_taskdependencies]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskdependencies.aspx
[portal]: https://portal.azure.com

[1]: ./media/batch-task-dependency/01_one_to_one.png "Diagram: one-to-one dependency"
[2]: ./media/batch-task-dependency/02_one_to_many.png "Diagram: one-to-many dependency"
[3]: ./media/batch-task-dependency/03_task_id_range.png "Diagram: task id range dependency"
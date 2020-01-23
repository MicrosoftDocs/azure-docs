---
title: Persist job and task output to Azure Storage with the Batch service API - Azure Batch | Microsoft Docs
description: Learn how to use Batch service API to persist Batch task and job output to Azure Storage.
services: batch
author: ju-shim
manager: gwallace
editor: ''

ms.service: batch
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 03/05/2019
ms.author: jushiman
ms.custom: seodec18

---

# Persist task data to Azure Storage with the Batch service API

[!INCLUDE [batch-task-output-include](../../includes/batch-task-output-include.md)]

The Batch service API supports persisting output data to Azure Storage for tasks and job manager tasks that run on pools with the virtual machine configuration. When you add a task, you can specify a container in Azure Storage as the destination for the task's output. The Batch service then writes any output data to that container when the task is complete.

An advantage to using the Batch service API to persist task output is that you do not need to modify the application that the task is running. Instead, with a few modifications to your client application, you can persist the task's output from within the same code that creates the task.

## When do I use the Batch service API to persist task output?

Azure Batch provides more than one way to persist task output. Using the Batch service API is a convenient approach that's best suited to these scenarios:

- You want to write code to persist task output from within your client application, without modifying the application that your task is running.
- You want to persist output from Batch tasks and job manager tasks in pools created with the virtual machine configuration.
- You want to persist output to an Azure Storage container with an arbitrary name.
- You want to persist output to an Azure Storage container named according to the [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/psSdkJson6/src/SDKs/Batch/Support/FileConventions#conventions). 

If your scenario differs from those listed above, you may need to consider a different approach. For example, the Batch service API does not currently support streaming output to Azure Storage while the task is running. To stream output, consider using the Batch File Conventions library, available for .NET. For other languages, you'll need to implement your own solution. For more information on other options for persisting task output, see [Persist job and task output to Azure Storage](batch-task-output.md).

## Create a container in Azure Storage

To persist task output to Azure Storage, you'll need to create a container that serves as the destination for your output files. Create the container before you run your task, preferably before you submit your job. To create the container, use the appropriate Azure Storage client library or SDK. For more information about Azure Storage APIs, see the [Azure Storage documentation](https://docs.microsoft.com/azure/storage/).

For example, if you are writing your application in C#, use the [Azure Storage client library for .NET](https://www.nuget.org/packages/WindowsAzure.Storage/). The following example shows how to create a container:

```csharp
CloudBlobContainer container = storageAccount.CreateCloudBlobClient().GetContainerReference(containerName);
await container.CreateIfNotExists();
```

## Get a shared access signature for the container

After you create the container, get a shared access signature (SAS) with write access to the container. A SAS provides delegated access to the container. The SAS grants access with a specified set of permissions and over a specified time interval. The Batch service needs a SAS with write permissions to write task output to the container. For more information about SAS, see [Using shared access signatures \(SAS\) in Azure Storage](../storage/common/storage-dotnet-shared-access-signature-part-1.md).

When you get a SAS using the Azure Storage APIs, the API returns a SAS token string. This token string includes all parameters of the SAS, including the permissions and the interval over which the SAS is valid. To use the SAS to access a container in Azure Storage, you need to append the SAS token string to the resource URI. The resource URI, together with the appended SAS token, provides authenticated access to Azure Storage.

The following example shows how to get a write-only SAS token string for the container, then appends the SAS to the container URI:

```csharp
string containerSasToken = container.GetSharedAccessSignature(new SharedAccessBlobPolicy()
{
    SharedAccessExpiryTime = DateTimeOffset.UtcNow.AddDays(1),
    Permissions = SharedAccessBlobPermissions.Write
});

string containerSasUrl = container.Uri.AbsoluteUri + containerSasToken;
```

## Specify output files for task output

To specify output files for a task, create a collection of [OutputFile](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.outputfile) objects and assign it to the [CloudTask.OutputFiles](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudtask.outputfiles#Microsoft_Azure_Batch_CloudTask_OutputFiles) property when you create the task.

The following C# code example creates a task that writes random numbers to a file named `output.txt`. The example creates an output file for `output.txt` to be written to the container. The example also creates output files for any log files that match the file pattern `std*.txt` (_e.g._, `stdout.txt` and `stderr.txt`). The container URL requires the SAS that was created previously for the container. The Batch service uses the SAS to authenticate access to the container:

```csharp
new CloudTask(taskId, "cmd /v:ON /c \"echo off && set && (FOR /L %i IN (1,1,100000) DO (ECHO !RANDOM!)) > output.txt\"")
{
    OutputFiles = new List<OutputFile>
    {
        new OutputFile(
            filePattern: @"..\std*.txt",
            destination: new OutputFileDestination(
         new OutputFileBlobContainerDestination(
                    containerUrl: containerSasUrl,
                    path: taskId)),
            uploadOptions: new OutputFileUploadOptions(
            uploadCondition: OutputFileUploadCondition.TaskCompletion)),
        new OutputFile(
            filePattern: @"output.txt",
            destination: 
         new OutputFileDestination(new OutputFileBlobContainerDestination(
                    containerUrl: containerSasUrl,
                    path: taskId + @"\output.txt")),
            uploadOptions: new OutputFileUploadOptions(
            uploadCondition: OutputFileUploadCondition.TaskCompletion)),
}
```

### Specify a file pattern for matching

When you specify an output file, you can use the [OutputFile.FilePattern](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.outputfile.filepattern#Microsoft_Azure_Batch_OutputFile_FilePattern) property to specify a file pattern for matching. The file pattern may match zero files, a single file, or a set of files that are created by the task.

The **FilePattern** property supports standard filesystem wildcards such as `*` (for non-recursive matches) and `**` (for recursive matches). For example, the code sample above specifies the file pattern to match `std*.txt` non-recursively:

`filePattern: @"..\std*.txt"`

To upload a single file, specify a file pattern with no wildcards. For example, the code sample above specifies the file pattern to match `output.txt`:

`filePattern: @"output.txt"`

### Specify an upload condition

The [Output​File​Upload​Options.UploadCondition](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.outputfileuploadoptions.uploadcondition#Microsoft_Azure_Batch_OutputFileUploadOptions_UploadCondition) property permits conditional uploading of output files. A common scenario is to upload one set of files if the task succeeds, and a different set of files if it fails. For example, you may want to upload verbose log files only when the task fails and exits with a nonzero exit code. Similarly, you may want to upload result files only if the task succeeds, as those files may be missing or incomplete if the task fails.

The code sample above sets the **UploadCondition** property to **TaskCompletion**. This setting specifies that the file is to be uploaded after the tasks completes, regardless of the value of the exit code.

`uploadCondition: OutputFileUploadCondition.TaskCompletion`

For other settings, see the [Output​File​Upload​Condition](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.common.outputfileuploadcondition) enum.

### Disambiguate files with the same name

The tasks in a job may produce files that have the same name. For example, `stdout.txt` and `stderr.txt` are created for every task that runs in a job. Because each task runs in its own context, these files don't conflict on the node's file system. However, when you upload files from multiple tasks to a shared container, you'll need to disambiguate files with the same name.

The [Output​File​Blob​Container​Destination.​Path](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.outputfileblobcontainerdestination.path#Microsoft_Azure_Batch_OutputFileBlobContainerDestination_Path) property specifies the destination blob or virtual directory for output files. You can use the **Path** property to name the blob or virtual directory in such a way that output files with the same name are uniquely named in Azure Storage. Using the task ID in the path is a good way to ensure unique names and easily identify files.

If the **FilePattern** property is set to a wildcard expression, then all files that match the pattern are uploaded to the virtual directory specified by the **Path** property. For example, if the container is `mycontainer`, the task ID is `mytask`, and the file pattern is `..\std*.txt`, then the absolute URIs to the output files in Azure Storage will be similar to:

```
https://myaccount.blob.core.windows.net/mycontainer/mytask/stderr.txt
https://myaccount.blob.core.windows.net/mycontainer/mytask/stdout.txt
```

If the **FilePattern** property is set to match a single file name, meaning it does not contain any wildcard characters, then the value of the **Path** property specifies the fully qualified blob name. If you anticipate naming conflicts with a single file from multiple tasks, then include the name of the virtual directory as part of the file name to disambiguate those files. For example, set the **Path** property to include the task ID, the delimiter character (typically a forward slash), and the file name:

`path: taskId + @"/output.txt"`

The absolute URIs to the output files for a set of tasks will be similar to:

```
https://myaccount.blob.core.windows.net/mycontainer/task1/output.txt
https://myaccount.blob.core.windows.net/mycontainer/task2/output.txt
```

For more information about virtual directories in Azure Storage, see [List the blobs in a container](../storage/blobs/storage-quickstart-blobs-dotnet.md#list-the-blobs-in-a-container).

## Diagnose file upload errors

If uploading output files to Azure Storage fails, then the task moves to the **Completed** state and the [Task​Execution​Information.​Failure​Information](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.taskexecutioninformation.failureinformation#Microsoft_Azure_Batch_TaskExecutionInformation_FailureInformation) property is set. Examine the **FailureInformation** property to determine what error occurred. For example, here is an error that occurs on file upload if the container cannot be found:

```
Category: UserError
Code: FileUploadContainerNotFound
Message: One of the specified Azure container(s) was not found while attempting to upload an output file
```

On every file upload, Batch writes two log files to the compute node, `fileuploadout.txt` and `fileuploaderr.txt`. You can examine these log files to learn more about a specific failure. In cases where the file upload was never attempted, for example because the task itself couldn’t run, then these log files will not exist.

## Diagnose file upload performance

The `fileuploadout.txt` file logs upload progress. You can examine this file to learn more about how long your file uploads are taking. Keep in mind that
there are many contributing factors to upload performance, including the size of the node, other activity on the node at the time of the upload, whether the target container is in the same region as the Batch pool, how many nodes are uploading to the storage account at the same time, and so on.

## Use the Batch service API with the Batch File Conventions standard

When you persist task output with the Batch service API, you can name your destination container and blobs however you like. You can also choose to name them according to the [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/psSdkJson6/src/SDKs/Batch/Support/FileConventions#conventions). The File Conventions standard determines the names of the destination container and blob in Azure Storage for a given output file based on the names of the job and task. If you do use the File Conventions standard for naming output files, then your output files are available for viewing in the [Azure portal](https://portal.azure.com).

If you are developing in C#, you can use the methods built into the [Batch File Conventions library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Batch.Conventions.Files). This library creates the properly named containers and blob paths for you. For example, you can call the API to get the correct name for the container, based on the job name:

```csharp
string containerName = job.OutputStorageContainerName();
```

You can use the [CloudJobExtensions.GetOutputStorageContainerUrl](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.conventions.files.cloudjobextensions.getoutputstoragecontainerurl) method to return a shared access signature (SAS) URL that is used to write to the container. You can then pass this SAS to the [Output​File​Blob​Container​Destination](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.outputfileblobcontainerdestination) constructor.

If you are developing in a language other than C#, you will need to implement the File Conventions standard yourself.

## Code sample

The [PersistOutputs][github_persistoutputs] sample project is one of the [Azure Batch code samples][github_samples] on GitHub. This Visual Studio solution demonstrates how to use the Batch client library for .NET to persist task output to durable storage. To run the sample, follow these steps:

1. Open the project in **Visual Studio 2019**.
2. Add your Batch and Storage **account credentials** to **AccountSettings.settings** in the Microsoft.Azure.Batch.Samples.Common project.
3. **Build** (but do not run) the solution. Restore any NuGet packages if prompted.
4. Use the Azure portal to upload an [application package](batch-application-packages.md) for **PersistOutputsTask**. Include the `PersistOutputsTask.exe` and its dependent assemblies in the .zip package, set the application ID to "PersistOutputsTask", and the application package version to "1.0".
5. **Start** (run) the **PersistOutputs** project.
6. When prompted to choose the persistence technology to use for running the sample, enter **2** to run the sample using the Batch service API to persist task output.
7. If desired, run the sample again, entering **3** to persist output with the Batch service API, and also to name the destination container and blob path according to the File Conventions standard.

## Next steps

- For more information on persisting task output with the File Conventions library for .NET, see [Persist job and task data to Azure Storage with the Batch File Conventions library for .NET](batch-task-output-file-conventions.md).
- For information on other approaches for persisting output data in Azure Batch, see [Persist job and task output to Azure Storage](batch-task-output.md).

[github_persistoutputs]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/PersistOutputs
[github_samples]: https://github.com/Azure/azure-batch-samples

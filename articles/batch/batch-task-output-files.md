---
title: Persist output data to Azure Storage with Batch service API
description: Learn how to use the Batch service API to persist Batch task and job output data to Azure Storage.
ms.topic: how-to
ms.date: 06/13/2024
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Persist task data to Azure Storage with the Batch service API

[!INCLUDE [batch-task-output-include](../../includes/batch-task-output-include.md)]

The Batch service API supports persisting output data to Azure Storage for tasks and job manager tasks that run on pools with [Virtual Machine Configuration](nodes-and-pools.md#virtual-machine-configuration). When you add a task, you can specify a container in Azure Storage as the destination for the task's output. The Batch service then writes any output data to that container when the task is complete.

When using the Batch service API to persist task output, you don't need to modify the application that the task is running. Instead, with a few modifications to your client application, you can persist the task's output from within the same code that creates the task.

> [!IMPORTANT]
> Persisting task data to Azure Storage with the Batch service API does not work with pools created before [February 1, 2018](https://github.com/Azure/Batch/blob/master/changelogs/nodeagent/CHANGELOG.md#1204).

## When do I use the Batch service API to persist task output?

Azure Batch provides more than one way to persist task output. Using the Batch service API is a convenient approach that's best suited to these scenarios:

- You want to write code to persist task output from within your client application, without modifying the application that your task is running.
- You want to persist output from Batch tasks and job manager tasks in pools created with the virtual machine configuration.
- You want to persist output to an Azure Storage container with an arbitrary name.
- You want to persist output to an Azure Storage container named according to the [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files).

If your scenario differs from those listed above, you may need to consider a different approach. For example, the Batch service API does not currently support streaming output to Azure Storage while the task is running. To stream output, consider using the Batch File Conventions library, available for .NET. For other languages, you'll need to implement your own solution. For more information about other options, see [Persist job and task output to Azure Storage](batch-task-output.md).

## Create a container in Azure Storage

To persist task output to Azure Storage, you'll need to create a container that serves as the destination for your output files. Create the container before you run your task, preferably before you submit your job, by using the appropriate Azure Storage client library or SDK. For more information about Azure Storage APIs, see the [Azure Storage documentation](../storage/index.yml).

For example, if you are writing your application in C#, use the [Azure Storage client library for .NET](https://www.nuget.org/packages/WindowsAzure.Storage/). The following example shows how to create a container:

```csharp
CloudBlobContainer container = storageAccount.CreateCloudBlobClient().GetContainerReference(containerName);
await container.CreateIfNotExists();
```

## Specify output files for task output

To specify output files for a task, create a collection of [OutputFile](/dotnet/api/microsoft.azure.batch.outputfile) objects and assign it to the [CloudTask.OutputFiles](/dotnet/api/microsoft.azure.batch.cloudtask.outputfiles) property when you create the task. You can use a Shared Access Signature (SAS) or managed identity to authenticate access to the container.

### Using a Shared Access Signature

After you create the container, get a shared access signature (SAS) with write access to the container. A SAS provides delegated access to the container. The SAS grants access with a specified set of permissions and over a specified time interval. The Batch service needs an SAS with write permissions to write task output to the container. For more information about SAS, see [Using shared access signatures \(SAS\) in Azure Storage](../storage/common/storage-sas-overview.md).

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

The following C# code example creates a task that writes random numbers to a file named `output.txt`. The example creates an output file for `output.txt` to be written to the container. The example also creates output files for any log files that match the file pattern `std*.txt` (_e.g._, `stdout.txt` and `stderr.txt`). The container URL requires the SAS that was created previously for the container. The Batch service uses the SAS to authenticate access to the container.

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

> [!NOTE]
> If using this example with Linux, be sure to change the backslashes to forward slashes.

### Using Managed Identity

Instead of generating and passing a SAS with write access to the container to Batch, a managed identity can be used to authenticate with Azure Storage. The identity must be [assigned to the Batch Pool](managed-identity-pools.md), and also have the `Storage Blob Data Contributor` role assignment for the container to be written to. The Batch service can then be told to use the managed identity instead of a SAS to authenticate access to the container.

```csharp
CloudBlobContainer container = storageAccount.CreateCloudBlobClient().GetContainerReference(containerName);
await container.CreateIfNotExists();

new CloudTask(taskId, "cmd /v:ON /c \"echo off && set && (FOR /L %i IN (1,1,100000) DO (ECHO !RANDOM!)) > output.txt\"")
{
    OutputFiles = new List<OutputFile>
    {
        new OutputFile(
            filePattern: @"..\std*.txt",
            destination: new OutputFileDestination(
         new OutputFileBlobContainerDestination(
                    containerUrl: container.Uri,
                    path: taskId,
                    identityReference: new ComputeNodeIdentityReference() { ResourceId = "/subscriptions/SUB/resourceGroups/RG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity-name"} })),
            uploadOptions: new OutputFileUploadOptions(
            uploadCondition: OutputFileUploadCondition.TaskCompletion))
    }
}
```

### Specify a file pattern for matching

When you specify an output file, you can use the [OutputFile.FilePattern](/dotnet/api/microsoft.azure.batch.outputfile.filepattern) property to specify a file pattern for matching. The file pattern may match zero files, a single file, or a set of files that are created by the task.

The **FilePattern** property supports standard filesystem wildcards such as `*` (for non-recursive matches) and `**` (for recursive matches). For example, the code sample above specifies the file pattern to match `std*.txt` non-recursively:

`filePattern: @"..\std*.txt"`

To upload a single file, specify a file pattern with no wildcards. For example, the code sample above specifies the file pattern to match `output.txt`:

`filePattern: @"output.txt"`

### Specify an upload condition

The [Output​File​Upload​Options.UploadCondition](/dotnet/api/microsoft.azure.batch.outputfileuploadoptions.uploadcondition) property permits conditional uploading of output files. A common scenario is to upload one set of files if the task succeeds, and a different set of files if it fails. For example, you may want to upload verbose log files only when the task fails and exits with a nonzero exit code. Similarly, you may want to upload result files only if the task succeeds, as those files may be missing or incomplete if the task fails.

The code sample above sets the **UploadCondition** property to **TaskCompletion**. This setting specifies that the file is to be uploaded after the tasks completes, regardless of the value of the exit code.

`uploadCondition: OutputFileUploadCondition.TaskCompletion`

For other settings, see the [Output​File​Upload​Condition](/dotnet/api/microsoft.azure.batch.common.outputfileuploadcondition) enum.

### Disambiguate files with the same name

The tasks in a job may produce files that have the same name. For example, `stdout.txt` and `stderr.txt` are created for every task that runs in a job. Because each task runs in its own context, these files don't conflict on the node's file system. However, when you upload files from multiple tasks to a shared container, you'll need to disambiguate files with the same name.

The [Output​File​Blob​Container​Destination.​Path](/dotnet/api/microsoft.azure.batch.outputfileblobcontainerdestination.path) property specifies the destination blob or virtual directory for output files. You can use the **Path** property to name the blob or virtual directory in such a way that output files with the same name are uniquely named in Azure Storage. Using the task ID in the path is a good way to ensure unique names and easily identify files.

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

For more information about virtual directories in Azure Storage, see [List the blobs in a container](../storage/blobs/storage-quickstart-blobs-dotnet.md#list-blobs-in-a-container).

### Many Output Files

When a task specifies numerous output files, you may encounter limits imposed by the Azure Batch API. It is advisable to keep your tasks small and keep the number of output files low.

If you encounter limits, consider reducing the number of output files by employing [File Patterns](#specify-a-file-pattern-for-matching) or using file containers such as tar or zip to consolidate the output files. Alternatively, utilize mounting or other approaches to persist output data (see [Persist job and task output](batch-task-output.md)).

## Diagnose file upload errors

If uploading output files to Azure Storage fails, then the task moves to the **Completed** state and the [Task​Execution​Information.​Failure​Information](/dotnet/api/microsoft.azure.batch.taskexecutioninformation.failureinformation) property is set. Examine the **FailureInformation** property to determine what error occurred. For example, here is an error that occurs on file upload if the container cannot be found:

```
Category: UserError
Code: FileUploadContainerNotFound
Message: One of the specified Azure container(s) was not found while attempting to upload an output file
```

On every file upload, Batch writes two log files to the compute node, `fileuploadout.txt` and `fileuploaderr.txt`. You can examine these log files to learn more about a specific failure. In cases where the file upload was never attempted, for example because the task itself couldn't run, then these log files will not exist.

## Diagnose file upload performance

The `fileuploadout.txt` file logs upload progress. You can examine this file to learn more about how long your file uploads are taking. Keep in mind that
there are many contributing factors to upload performance, including the size of the node, other activity on the node at the time of the upload, whether the target container is in the same region as the Batch pool, how many nodes are uploading to the storage account at the same time, and so on.

## Use the Batch service API with the Batch File Conventions standard

When you persist task output with the Batch service API, you can name your destination container and blobs however you like. You can also choose to name them according to the [Batch File Conventions standard](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/batch/Microsoft.Azure.Batch.Conventions.Files). The File Conventions standard determines the names of the destination container and blob in Azure Storage for a given output file based on the names of the job and task. If you do use the File Conventions standard for naming output files, then your output files are available for viewing in the [Azure portal](https://portal.azure.com).

If you are developing in C#, you can use the methods built into the [Batch File Conventions library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Batch.Conventions.Files). This library creates the properly named containers and blob paths for you. For example, you can call the API to get the correct name for the container, based on the job name:

```csharp
string containerName = job.OutputStorageContainerName();
```

You can use the [CloudJobExtensions.GetOutputStorageContainerUrl](/dotnet/api/microsoft.azure.batch.conventions.files.cloudjobextensions.getoutputstoragecontainerurl) method to return a shared access signature (SAS) URL that is used to write to the container. You can then pass this SAS to the [Output​File​Blob​Container​Destination](/dotnet/api/microsoft.azure.batch.outputfileblobcontainerdestination) constructor.

If you are developing in a language other than C#, you will need to implement the File Conventions standard yourself.

## Code sample

The [PersistOutputs](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/PersistOutputs) sample project is one of the [Azure Batch code samples](https://github.com/Azure/azure-batch-samples) on GitHub. This Visual Studio solution demonstrates how to use the Batch client library for .NET to persist task output to durable storage. To run the sample, follow these steps:

1. Open the project in **Visual Studio 2019**.
2. Add your Batch and Storage **account credentials** to **AccountSettings.settings** in the Microsoft.Azure.Batch.Samples.Common project.
3. **Build** (but do not run) the solution. Restore any NuGet packages if prompted.
4. Use the Azure portal to upload an [application package](batch-application-packages.md) for **PersistOutputsTask**. Include the `PersistOutputsTask.exe` and its dependent assemblies in the .zip package, set the application ID to "PersistOutputsTask", and the application package version to "1.0".
5. **Start** (run) the **PersistOutputs** project.
6. When prompted to choose the persistence technology to use for running the sample, enter **2** to run the sample using the Batch service API to persist task output.
7. If desired, run the sample again, entering **3** to persist output with the Batch service API, and also to name the destination container and blob path according to the File Conventions standard.

## Next steps

- To learn more about persisting task output with the File Conventions library for .NET, see [Persist job and task data to Azure Storage with the Batch File Conventions library for .NET](batch-task-output-file-conventions.md).
- To learn about other approaches for persisting output data in Azure Batch, see [Persist job and task output to Azure Storage](batch-task-output.md).

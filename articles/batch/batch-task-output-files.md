---
title: Persist job and task output to Azure Storage with the Azure Batch service API | Microsoft Docs
description: Learn how to use Batch service API to persist Batch task and job output to Azure Storage.
services: batch
author: tamram
manager: timlt
editor: ''

ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: big-compute
ms.date: 06/13/2017
ms.author: tamram

---


# Use the Batch service API to persist task data to Azure Storage

A task running in Azure Batch may produce output data when it runs. Task output data often needs to be stored and then later retrieved by other tasks in the job, the client application that executed the job, or both. While you can persist data to the file system of a Batch compute node, nodes are ephemeral, and all data on a node is lost when it is reimaged. Therefore it's important to persist task data that you'll need later to a data store such as Azure Storage.

Starting with version 2017-05-01, the Batch service API supports persisting output data to Azure Storage for tasks and job manager tasks that run on pools with the virtual machine configuration. When you add a task or job manager task, you can specify a container in Azure Storage as the destination for the task's output. The Batch service then writes any output data to that container when the task is complete.

A key advantage to using the Batch service API to persist task data to Azure Storage is that you do not need to modify the application that the task is running in order to persist the task's output. Instead, with a few simple modifications to your client application, you can persist the task's output from within the code that creates the task.   

For more information on other options for persisting output data in Azure Batch, see [Persist job and task output to Azure Storage](batch-task-output.md). 

## Link an Azure Storage account to your Batch account

To persist output data to Azure Storage using the File Conventions library, you must first [link an Azure Storage account](batch-application-packages.md#link-a-storage-account) to your Batch account. If you haven't done so already, link a Storage account to your Batch account by using the Azure portal:

**Batch account** blade > **Settings** > **Storage Account** > **Storage Account** (None) > Select a Storage account in your subscription

## Create a container in Azure Storage

The container that is the destination for your output files needs to be created before the task runs, preferably before you submit your job. To create the container, use the appropriate Azure Storage client library or SDK. See the [Azure Storage documentation](https://docs.microsoft.com/azure/storage/) for more information about Azure Storage APIs.

For example, if you are writing your application in C#, use the [Azure Storage client library for .NET](https://www.nuget.org/packages/WindowsAzure.Storage/). The following example shows how to create a container:

```csharp
CloudBlobContainer container = storageAccount.CreateCloudBlobClient().GetContainerReference(containerName);
await conainer.CreateIfNotExists();
```

## Get a shared access signature for the container

After you create the container, get a shared access signature (SAS) with write access to the container. A SAS provides delegated access to the container with a specified set of permissions and over a specified time interval. The Batch service needs a SAS with write permissions in order to write task output to the container. For more information about SAS, see [Using shared access signatures \(SAS\) in Azure Storage](../storage/storage-dotnet-shared-access-signature-part-1.md).

When you get a SAS using the Azure Storage APIs, the API returns a SAS token string. This token string includes all of the parameters of the SAS, including the permissions and the interval over which the SAS is valid. To use the SAS to access a container in Azure Storage, you need to append the SAS token string to the resource URI. The resource URI with the SAS token appended provides authenticated access to Azure Storage.

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

To 



Built in support for persisting files to Azure Storage
======================================================

Azure Batch has supported the idea of a ResourceFile – a file which is
downloaded from Azure Storage to the task directory before the task process is
run, since release. Now there is also support for an OutputFile which does the
reverse – a file (or files) which are uploaded to an Azure Storage container
after the task process has completed.

The container must be created before the task runs. We suggest creating it
before you submit your job, for example in C\#:

Similar to ResourceFiles, OutputFiles require an Azure Storage SAS to be
generated for the target container. You can learn more about Azure Storage SAS’s
here:
<https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-shared-access-signature-part-1>.
The SAS supplied to the Batch service must be for a container, and must allow
writing to the container. For example in C\#:

When creating a task, you can then specify details about the files you would
like uploaded when the task completes, and include the container URL to upload
to. For example here we are creating a task which writes a bunch of random
numbers to a file output.txt and then uploads that file on task completion. We
also upload logs matching the “std\*.txt” pattern (such as stdout and stderr).

The filePattern field supports standard filesystem wildcards such as \* (for
non-recursive matches) and \*\* (for recursive matches). If you want to upload a
single file, you can specify a pattern with no wildcards (for example above:
“output.txt”).

It is common to upload one set of files on success, and a different set of files
on failure. For example, you might want verbose log files only on a task failure
(the task exits with a nonzero exit code when executing the command line).
Similarly you may only want to upload the result files on success, as they may
be missing or incomplete if the task failed. You can do this using the
\`uploadCondition\` property, for example:

Many tasks in a job may produce may produce files which have the same name, for
example stdout.txt and stderr.txt which are created for every task. That’s fine
when the task is running since each task runs in its own context, but when
uploading to a shared container some disambiguation is needed. The easiest thing
to do is to use the \`path\` parameter to specify a \`path\` of \`taskId\`. When
\`filePattern\` is a wildcard expression, all matched files will be put into the
blob virtual directory specified by the \`path\` property. Note that if
\`filePattern\` is just a single file, then \`path\` is the fully qualified blob
name, so you’ll need to do something like: \`path: taskId + \@“\\output.txt”\`
to upload a single file to a blob virtual directory.

**Diagnosing errors**

Sometimes file upload can fail. When this happens, the task will move to
\`Completed\` state with a \`failureInformation\` property. Examine that
property to determine what the error was. If the error occurred due to a problem
uploading the specified OutputFiles then it will say so, for example:

You can then go to the individual node which the task ran on and look at the
\`fileuploadout.txt\` and \`fileuploaderr.txt\` files to learn more about the
specific failure. Note that in cases where the upload stage was never reached
(for example because the task itself couldn’t run), the \`fileuploadout.txt\`
and \`fileuploaderr.txt\` files will not exist.

**Diagnosing performance**

If you’re interested in how long your file uploads are taking, look at
\`fileuploadout.txt\`, which logs its progress performing file upload. Note that
there are many contributing factors to upload performance, including the size of
the node, what other things are happening on the node at the time of the upload,
whether the target container is in the same region as the Batch pool, how many
nodes are uploading to the storage account at the same time, and so on.

TODO: Link to the backing example code at the bottom of the article.

Using the built in support for persisting files to follow the file conventions
==============================================================================

You can even use OutputFiles to follow the FileConventions paradigm documented
here:
<https://github.com/Azure/azure-sdk-for-net/tree/vs17Dev/src/SDKs/Batch/Support/FileConventions>

The only two things that must be done to follow the file conventions paradigm
are upload to a container with the correct name (based on the job id), and
upload to the right virtual directory within the container. If you’re in C\# you
can actually use the methods built into the FileConventions helper assembly, for
example:

\`string containerName = job.OutputStorageContainerName();\`

If you are not in C\#, you have to implement the container name convention
yourself (see
https://github.com/Azure/azure-sdk-for-net/tree/vs17Dev/src/SDKs/Batch/Support/FileConventions).

When defining your output files, just make sure to follow the conventions when
specifying their output destination within the container. For example, a task
output would go into virtual directory \`{task.Id}\\\${outputKind}\`. You can
see that in the below snippet (TODO: Link to the sample code to show people how
to do this, specifically the \`RunWithConventions\` method):

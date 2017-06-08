---
title: Run Azure Batch workloads on cost-effective low-priority VMs (Preview) | Microsoft Docs
description: Learn how to provision low-priority VMs to reduce the cost of Azure Batch workloads.
services: batch
author: mscurrell
manager: timlt

ms.assetid: dc6ba151-1718-468a-b455-2da549225ab2
ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.workload: na
ms.date: 05/05/2017
ms.author: markscu

---


---
title: Persist files from tasks to Azure Storage
---

Task output considerations
==========================

When you design your Batch solution, you must consider several factors related
to job and task outputs.

-   **Compute node lifetime**: Compute nodes are often transient, especially in
    autoscale-enabled pools. The outputs of the tasks that run on a node are
    available only while the node exists, and only within the file retention
    time you've set for the task. To ensure that the task output is preserved,
    your tasks must therefore upload their output files to a durable store, for
    example, Azure Storage. The same holds true for any log files for the tasks.

-   **Output storage:** To persist task output data to durable storage, you can
    use the Azure Storage SDK in your task code to upload the task output to a
    Blob storage container. We recommend that you use a naming convention which
    helps you identify files and the job/task which they came from. You can
    learn more about the conventions we suggest here:
    <https://github.com/Azure/azure-sdk-for-net/tree/vs17Dev/src/SDKs/Batch/Support/FileConventions>

-   **Output retrieval:** You can retrieve task output directly from the compute
    nodes in your pool, or from Azure Storage if your tasks persist their
    output. To retrieve a task's output directly from a compute node, you need
    the file name and its output location on the node. If you persist output to
    Azure Storage, downstream tasks or your client application must have the
    full path to the file in Azure Storage to download it by using the Azure
    Storage SDK.

-   **Viewing output:** When you navigate to a Batch task in the Azure portal
    and select Files on node, you are presented with all files associated with
    the task, not just the output files you're interested in. Again, files on
    compute nodes are available only while the node exists and only within the
    file retention time you've set for the task. To view task output that you've
    persisted to Azure Storage in the portal or an application like the Azure
    Storage Explorer, you must know its location and navigate to the file
    directly.

Ways to get data off of a node
==============================

Since nodes are ephemeral, it’s likely that you will want to persist some data
off the nodes, but there are a few different approaches you could take. Some
decision points to help choose between the various options are presented below:

Use the native Batch support for uploading task output files
------------------------------------------------------------

This solution may be for you if:

-   You only need to upload data from Tasks and JobManagerTasks.

-   You only need to upload data created on VirtualMachineConfiguration based
    pools.

-   You want to upload data to one or more arbitrary Azure Storage containers,
    or to a container following the file conventions documented here:
    <https://github.com/Azure/azure-sdk-for-net/tree/vs17Dev/src/SDKs/Batch/Support/FileConventions>

TODO: Link to the new content about the OutputFiles feature

Use the Microsoft.Azure.Batch.FileConventions Nuget package
-----------------------------------------------------------

This solution may be for you if:

-   You are a C\# developer.

-   You need file streaming support (streaming a file to Azure Storage as it is
    being written, while the task is still running).

-   You want to view your tasks in the Azure Portal under the “Saved output
    files” or “Saved logs” headings on the task

TODO: Link/include to the existing content about using this library, currently
at: <https://docs.microsoft.com/en-us/azure/batch/batch-task-output>

Use the OutputFiles feature to implement file conventions
---------------------------------------------------------

This solution may be for you if:

-   You want to view your tasks in the Azure Portal under the “Saved output
    files” or “Saved logs” headings on the task

-   You don’t want to write any code in your task executable

-   You don’t need file streaming support (streaming a file to Azure Storage as
    it is being written, while the task is still running).

-   You only need to upload data from Tasks and JobManagerTasks.

-   You only need to upload data created on VirtualMachineConfiguration based
    pools.

TODO: Link to the Using the built in support for persisting files to follow the
file conventions section

Provide your own implementation of the documented file conventions
------------------------------------------------------------------

This solution may be for you if:

-   You are not in C\#

-   You want to view your tasks in the Azure Portal under the “Saved output
    files” or “Saved logs” headings on the task

You can learn more about doing this here:
<https://github.com/Azure/azure-sdk-for-net/tree/vs17Dev/src/SDKs/Batch/Support/FileConventions>

Implement your own file movement
--------------------------------

This solution may be for you if:

-   You want to move your data to someplace other than Azure Storage.

-   You want to do check-pointing or early upload of initial results.

-   You want fine control over error handling (i.e. take specific upload actions
    based on specific exit codes)

Since you control the command line of the process running on the Azure Batch
node, if you want to upload files to an unsupported store (for example SQL,
DataLake, etc), you can always create a custom script/executable to upload to
that location, and call it on the command line after your primary executable has
finished. For example on Windows: \`doMyWork.exe && uploadMyFilesToSql.exe\`

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

---
title: Build solutions with Visual Studio templates - Azure Batch | Microsoft Docs
description: Learn how Visual Studio project templates can help you implement and run your compute-intensive workloads on Azure Batch.
services: batch
documentationcenter: .net
author: ju-shim
manager: gwallace
editor: ''

ms.assetid: 5e041ae2-25af-4882-a79e-3aa63c4bfb20
ms.service: batch
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 02/27/2017
ms.author: jushiman
ms.custom: seodec18

---
# Use Visual Studio project templates to jump-start Batch solutions

The **Job Manager** and **Task Processor Visual Studio templates** for Batch provide code to help you to implement and run your compute-intensive workloads on Batch with the least amount of effort. This document describes these templates and provides guidance for how to use them.

> [!IMPORTANT]
> This article discusses only information applicable to these two templates, and assumes that you are familiar with the Batch service and key concepts related to it: pools, compute nodes, jobs and tasks, job manager tasks, environment variables, and other relevant information. You can find more information in [Basics of Azure Batch](batch-technical-overview.md) and [Batch feature overview for developers](batch-api-basics.md).
> 
> 

## High-level overview
The Job Manager and Task Processor templates can be used to create two useful components:

* A job manager task that implements a job splitter that can break a job down into multiple tasks that can run independently, in parallel.
* A task processor that can be used to perform pre-processing and post-processing around an application command line.

For example, in a movie rendering scenario, the job splitter would turn a single movie job into hundreds or thousands of separate tasks that would process individual frames separately. Correspondingly, the task processor would invoke the rendering application and all dependent processes that are needed to render each frame, as well as perform any additional actions (for example, copying the rendered frame to a storage location).

> [!NOTE]
> The Job Manager and Task Processor templates are independent of each other, so you can choose to use both, or only one of them, depending on the requirements of your compute job and on your preferences.
> 
> 

As shown in the diagram below, a compute job that uses these templates will go through three stages:

1. The client code (e.g., application, web service, etc.) submits a job to the Batch service on Azure, specifying as its job manager task the job manager program.
2. The Batch service runs the job manager task on a compute node and the job splitter launches the specified number of task processor tasks, on as many compute nodes as required, based on the parameters and specifications in the job splitter code.
3. The task processor tasks run independently, in parallel, to process the input data and generate the output data.

![Diagram showing how client code interacts with the Batch service][diagram01]

## Prerequisites
To use the Batch templates, you will need the following:

* A computer with Visual Studio 2015 installed. Batch templates are currently only supported for Visual Studio 2015.
* The Batch templates, which are available from the [Visual Studio Gallery][vs_gallery] as Visual Studio extensions. There are two ways to get the templates:
  
  * Install the templates using the **Extensions and Updates** dialog box in Visual Studio (for more information, see [Finding and Using Visual Studio Extensions][vs_find_use_ext]). In the **Extensions and Updates** dialog box, search and download the following two extensions:
    
    * Azure Batch Job Manager with Job Splitter
    * Azure Batch Task Processor
  * Download the templates from the online gallery for Visual Studio: [Microsoft Azure Batch Project Templates][vs_gallery_templates]
* If you plan to use the [Application Packages](batch-application-packages.md) feature to deploy the job manager and task processor to the Batch compute nodes, you need to link a storage account to your Batch account.

## Preparation
We recommend creating a solution that can contain your job manager as well as your task processor, because this can make it easier to share code between your job manager and task processor programs. To create this solution, follow these steps:

1. Open Visual Studio and select **File** > **New** > **Project**.
2. Under **Templates**, expand **Other Project Types**, click **Visual Studio Solutions**, and then select **Blank Solution**.
3. Type a name that describes your application and the purpose of this solution (e.g., "LitwareBatchTaskPrograms").
4. To create the new solution, click **OK**.

## Job Manager template
The Job Manager template helps you to implement a job manager task that can perform the following actions:

* Split a job into multiple tasks.
* Submit those tasks to run on Batch.

> [!NOTE]
> For more information about job manager tasks, see [Batch feature overview for developers](batch-api-basics.md#job-manager-task).
> 
> 

### Create a Job Manager using the template
To add a job manager to the solution that you created earlier, follow these steps:

1. Open your existing solution in Visual Studio.
2. In Solution Explorer, right-click the solution, click **Add** > **New Project**.
3. Under **Visual C#**, click **Cloud**, and then click **Azure Batch Job Manager with Job Splitter**.
4. Type a name that describes your application and identifies this project as the job manager (e.g. "LitwareJobManager").
5. To create the project, click **OK**.
6. Finally, build the project to force Visual Studio to load all referenced NuGet packages and to verify that the project is valid before you start modifying it.

### Job Manager template files and their purpose
When you create a project using the Job Manager template, it generates three groups of code files:

* The main program file (Program.cs). This contains the program entry point and top-level exception handling. You shouldn't normally need to modify this.
* The Framework directory. This contains the files responsible for the 'boilerplate' work done by the job manager program – unpacking parameters, adding tasks to the Batch job, etc. You shouldn't normally need to modify these files.
* The job splitter file (JobSplitter.cs). This is where you will put your application-specific logic for splitting a job into tasks.

Of course you can add additional files as required to support your job splitter code, depending on the complexity of the job splitting logic.

The template also generates standard .NET project files such as a .csproj file, app.config, packages.config, etc.

The rest of this section describes the different files and their code structure, and explains what each class does.

![Visual Studio Solution Explorer showing the Job Manager template solution][solution_explorer01]

**Framework files**

* `Configuration.cs`: Encapsulates the loading of job configuration data such as Batch account details, linked storage account credentials, job and task information, and job parameters. It also provides access to Batch-defined environment variables (see Environment settings for tasks, in the Batch documentation) via the Configuration.EnvironmentVariable class.
* `IConfiguration.cs`: Abstracts the implementation of the Configuration class, so that you can unit test your job splitter using a fake or mock configuration object.
* `JobManager.cs`: Orchestrates the components of the job manager program. It is responsible for the initializing the job splitter, invoking the job splitter, and dispatching the tasks returned by the job splitter to the task submitter.
* `JobManagerException.cs`: Represents an error that requires the job manager to terminate. JobManagerException is used to wrap 'expected' errors where specific diagnostic information can be provided as part of termination.
* `TaskSubmitter.cs`: This class is responsible to adding tasks returned by the job splitter to the Batch job. The JobManager class aggregates the sequence of tasks into batches for efficient but timely addition to the job, then calls TaskSubmitter.SubmitTasks on a background thread for each batch.

**Job Splitter**

`JobSplitter.cs`: This class contains application-specific logic for splitting the job into tasks. The framework invokes the JobSplitter.Split method to obtain a sequence of tasks, which it adds to the job as the method returns them. This is the class where you will inject the logic of your job. Implement the Split method to return a sequence of CloudTask instances representing the tasks into which you want to partition the job.

**Standard .NET command line project files**

* `App.config`: Standard .NET application configuration file.
* `Packages.config`: Standard NuGet package dependency file.
* `Program.cs`: Contains the program entry point and top-level exception handling.

### Implementing the job splitter
When you open the Job Manager template project, the project will have the JobSplitter.cs file open by default. You can implement the split logic for the tasks in your workload by using the Split() method show below:

```csharp
/// <summary>
/// Gets the tasks into which to split the job. This is where you inject
/// your application-specific logic for decomposing the job into tasks.
///
/// The job manager framework invokes the Split method for you; you need
/// only to implement it, not to call it yourself. Typically, your
/// implementation should return tasks lazily, for example using a C#
/// iterator and the "yield return" statement; this allows tasks to be added
/// and to start running while splitting is still in progress.
/// </summary>
/// <returns>The tasks to be added to the job. Tasks are added automatically
/// by the job manager framework as they are returned by this method.</returns>
public IEnumerable<CloudTask> Split()
{
    // Your code for the split logic goes here.
    int startFrame = Convert.ToInt32(_parameters["StartFrame"]);
    int endFrame = Convert.ToInt32(_parameters["EndFrame"]);

    for (int i = startFrame; i <= endFrame; i++)
    {
        yield return new CloudTask("myTask" + i, "cmd /c dir");
    }
}
```

> [!NOTE]
> The annotated section in the `Split()` method is the only section of the Job Manager template code that is intended for you to modify by adding the logic to split your jobs into different tasks. If you want to modify a different section of the template, please ensure you are familiarized with how Batch works, and try out a few of the [Batch code samples][github_samples].
> 
> 

Your Split() implementation has access to:

* The job parameters, via the `_parameters` field.
* The CloudJob object representing the job, via the `_job` field.
* The CloudTask object representing the job manager task, via the `_jobManagerTask` field.

Your `Split()` implementation does not need to add tasks to the job directly. Instead, your code should return a sequence of CloudTask objects, and these will be added to the job automatically by the framework classes that invoke the job splitter. It's common to use C#'s iterator (`yield return`) feature to implement job splitters as this allows the tasks to start running as soon as possible rather than waiting for all tasks to be calculated.

**Job splitter failure**

If your job splitter encounters an error, it should either:

* Terminate the sequence using the C# `yield break` statement, in which case the job manager will be treated as successful; or
* Throw an exception, in which case the job manager will be treated as failed and may be retried depending on how the client has configured it).

In both cases, any tasks already returned by the job splitter and added to the Batch job will be eligible to run. If you don't want this to happen, then you could:

* Terminate the job before returning from the job splitter
* Formulate the entire task collection before returning it (that is, return an `ICollection<CloudTask>` or `IList<CloudTask>` instead of implementing your job splitter using a C# iterator)
* Use task dependencies to make all tasks depend on the successful completion of the job manager

**Job manager retries**

If the job manager fails, it may be retried by the Batch service depending on the client retry settings. In general, this is safe, because when the framework adds tasks to the job, it ignores any tasks that already exist. However, if calculating tasks is expensive, you may not wish to incur the cost of recalculating tasks that have already been added to the job; conversely, if the re-run is not guaranteed to generate the same task IDs then the 'ignore duplicates' behavior will not kick in. In these cases you should design your job splitter to detect the work that has already been done and not repeat it, for example by performing a CloudJob.ListTasks before starting to yield tasks.

### Exit codes and exceptions in the Job Manager template
Exit codes and exceptions provide a mechanism to determine the outcome of running a program, and they can help to identify any problems with the execution of the program. The Job Manager template implements the exit codes and exceptions described in this section.

A job manager task that is implemented with the Job Manager template can return three possible exit codes:

| Code | Description |
| --- | --- |
| 0 |The job manager completed successfully. Your job splitter code ran to completion, and all tasks were added to the job. |
| 1 |The job manager task failed with an exception in an 'expected' part of the program. The exception was translated to a JobManagerException with diagnostic information and, where possible, suggestions for resolving the failure. |
| 2 |The job manager task failed with an 'unexpected' exception. The exception was logged to standard output, but the job manager was unable to add any additional diagnostic or remediation information. |

In the case of job manager task failure, some tasks may still have been added to the service before the error occurred. These tasks will run as normal. See "Job Splitter Failure" above for discussion of this code path.

All the information returned by exceptions is written into stdout.txt and stderr.txt files. For more information, see [Error Handling](batch-api-basics.md#error-handling).

### Client considerations
This section describes some client implementation requirements when invoking a job manager based on this template. See [How to pass parameters and environment variables from the client code](#pass-environment-settings) for details on passing parameters and environment settings.

**Mandatory credentials**

In order to add tasks to the Azure Batch job, the job manager task requires your Azure Batch account URL and key. You must pass these in environment variables named YOUR_BATCH_URL and YOUR_BATCH_KEY. You can set these in the Job Manager task environment settings. For example, in a C# client:

```csharp
job.JobManagerTask.EnvironmentSettings = new [] {
    new EnvironmentSetting("YOUR_BATCH_URL", "https://account.region.batch.azure.com"),
    new EnvironmentSetting("YOUR_BATCH_KEY", "{your_base64_encoded_account_key}"),
};
```
**Storage credentials**

Typically, the client does not need to provide the linked storage account credentials to the job manager task because (a) most job managers do not need to explicitly access the linked storage account and (b) the linked storage account is often provided to all tasks as a common environment setting for the job. If you are not providing the linked storage account via the common environment settings, and the job manager requires access to linked storage, then you should supply the linked storage credentials as follows:

```csharp
job.JobManagerTask.EnvironmentSettings = new [] {
    /* other environment settings */
    new EnvironmentSetting("LINKED_STORAGE_ACCOUNT", "{storageAccountName}"),
    new EnvironmentSetting("LINKED_STORAGE_KEY", "{storageAccountKey}"),
};
```

**Job manager task settings**

The client should set the job manager *killJobOnCompletion* flag to **false**.

It is usually safe for the client to set *runExclusive* to **false**.

The client should use the *resourceFiles* or *applicationPackageReferences* collection to have the job manager executable (and its required DLLs) deployed to the compute node.

By default, the job manager will not be retried if it fails. Depending on your job manager logic, the client may want to enable retries via *constraints*/*maxTaskRetryCount*.

**Job settings**

If the job splitter emits tasks with dependencies, the client must set the job's usesTaskDependencies to true.

In the job splitter model, it is unusual for clients to wish to add tasks to jobs over and above what the job splitter creates. The client should therefore normally set the job's *onAllTasksComplete* to **terminatejob**.

## Task Processor template
A Task Processor template helps you to implement a task processor that can perform the following actions:

* Set up the information required by each Batch task to run.
* Run all actions required by each Batch task.
* Save task outputs to persistent storage.

Although a task processor is not required to run tasks on Batch, the key advantage of using a task processor is that it provides a wrapper to implement all task execution actions in one location. For example, if you need to run several applications in the context of each task, or if you need to copy data to persistent storage after completing each task.

The actions performed by the task processor can be as simple or complex, and as many or as few, as required by your workload. Additionally, by implementing all task actions into one task processor, you can readily update or add actions based on changes to applications or workload requirements. However, in some cases a task processor might not be the optimal solution for your implementation as it can add unnecessary complexity, for example when running jobs that can be quickly started from a simple command line.

### Create a Task Processor using the template
To add a task processor to the solution that you created earlier, follow these steps:

1. Open your existing solution in Visual Studio.
2. In Solution Explorer, right-click the solution, click **Add**, and then click **New Project**.
3. Under **Visual C#**, click **Cloud**, and then click **Azure Batch Task Processor**.
4. Type a name that describes your application and identifies this project as the task processor (e.g. "LitwareTaskProcessor").
5. To create the project, click **OK**.
6. Finally, build the project to force Visual Studio to load all referenced NuGet packages and to verify that the project is valid before you start modifying it.

### Task Processor template files and their purpose
When you create a project using the task processor template, it generates three groups of code files:

* The main program file (Program.cs). This contains the program entry point and top-level exception handling. You shouldn't normally need to modify this.
* The Framework directory. This contains the files responsible for the 'boilerplate' work done by the job manager program – unpacking parameters, adding tasks to the Batch job, etc. You shouldn't normally need to modify these files.
* The task processor file (TaskProcessor.cs). This is where you will put your application-specific logic for executing a task (typically by calling out to an existing executable). Pre- and post-processing code, such as downloading additional data or uploading result files, also goes here.

Of course you can add additional files as required to support your task processor code, depending on the complexity of the job splitting logic.

The template also generates standard .NET project files such as a .csproj file, app.config, packages.config, etc.

The rest of this section describes the different files and their code structure, and explains what each class does.

![Visual Studio Solution Explorer showing the Task Processor template solution][solution_explorer02]

**Framework files**

* `Configuration.cs`: Encapsulates the loading of job configuration data such as Batch account details, linked storage account credentials, job and task information, and job parameters. It also provides access to Batch-defined environment variables (see Environment settings for tasks, in the Batch documentation) via the Configuration.EnvironmentVariable class.
* `IConfiguration.cs`: Abstracts the implementation of the Configuration class, so that you can unit test your job splitter using a fake or mock configuration object.
* `TaskProcessorException.cs`: Represents an error that requires the job manager to terminate. TaskProcessorException is used to wrap 'expected' errors where specific diagnostic information can be provided as part of termination.

**Task Processor**

* `TaskProcessor.cs`: Runs the task. The framework invokes the TaskProcessor.Run method. This is the class where you will inject the application-specific logic of your task. Implement the Run method to:
  * Parse and validate any task parameters
  * Compose the command line for any external program you want to invoke
  * Log any diagnostic information you may require for debugging purposes
  * Start a process using that command line
  * Wait for the process to exit
  * Capture the exit code of the process to determine if it succeeded or failed
  * Save any output files you want to keep to persistent storage

**Standard .NET command line project files**

* `App.config`: Standard .NET application configuration file.
* `Packages.config`: Standard NuGet package dependency file.
* `Program.cs`: Contains the program entry point and top-level exception handling.

## Implementing the task processor
When you open the Task Processor template project, the project will have the TaskProcessor.cs file open by default. You can implement the run logic for the tasks in your workload by using the Run() method shown below:

```csharp
/// <summary>
/// Runs the task processing logic. This is where you inject
/// your application-specific logic for decomposing the job into tasks.
///
/// The task processor framework invokes the Run method for you; you need
/// only to implement it, not to call it yourself. Typically, your
/// implementation will execute an external program (from resource files or
/// an application package), check the exit code of that program and
/// save output files to persistent storage.
/// </summary>
public async Task<int> Run()

{
    try
    {
        //Your code for the task processor goes here.
        var command = $"compare {_parameters["Frame1"]} {_parameters["Frame2"]} compare.gif";
        using (var process = Process.Start($"cmd /c {command}"))
        {
            process.WaitForExit();
            var taskOutputStorage = new TaskOutputStorage(
            _configuration.StorageAccount,
            _configuration.JobId,
            _configuration.TaskId
            );
            await taskOutputStorage.SaveAsync(
            TaskOutputKind.TaskOutput,
            @"..\stdout.txt",
            @"stdout.txt"
            );
            return process.ExitCode;
        }
    }
    catch (Exception ex)
    {
        throw new TaskProcessorException(
        $"{ex.GetType().Name} exception in run task processor: {ex.Message}",
        ex
        );
    }
}
```
> [!NOTE]
> The annotated section in the Run() method is the only section of the Task Processor template code that is intended for you to modify by adding the run logic for the tasks in your workload. If you want to modify a different section of the template, please first familiarize yourself with how Batch works by reviewing the Batch documentation and trying out a few of the Batch code samples.
> 
> 

The Run() method is responsible for launching the command line, starting one or more processes, waiting for all process to complete, saving the results, and finally returning with an exit code. The Run() method is where you implement the processing logic for your tasks. The task processor framework invokes the Run() method for you; you do not need to call it yourself.

Your Run() implementation has access to:

* The task parameters, via the `_parameters` field.
* The job and task ids, via the `_jobId` and `_taskId` fields.
* The task configuration, via the `_configuration` field.

**Task failure**

In case of failure, you can exit the Run() method by throwing an exception, but this leaves the top level exception handler in control of the task exit code. If you need to control the exit code so that you can distinguish different types of failure, for example for diagnostic purposes or because some failure modes should terminate the job and others should not, then you should exit the Run() method by returning a non-zero exit code. This becomes the task exit code.

### Exit codes and exceptions in the Task Processor template
Exit codes and exceptions provide a mechanism to determine the outcome of running a program, and they can help identify any problems with the execution of the program. The Task Processor template implements the exit codes and exceptions described in this section.

A task processor task that is implemented with the Task Processor template can return three possible exit codes:

| Code | Description |
| --- | --- |
| [Process.ExitCode][process_exitcode] |The task processor ran to completion. Note that this does not imply that the program you invoked was successful – only that the task processor invoked it successfully and performed any post-processing without exceptions. The meaning of the exit code depends on the invoked program – typically exit code 0 means the program succeeded and any other exit code means the program failed. |
| 1 |The task processor failed with an exception in an 'expected' part of the program. The exception was translated to a `TaskProcessorException` with diagnostic information and, where possible, suggestions for resolving the failure. |
| 2 |The task processor failed with an 'unexpected' exception. The exception was logged to standard output, but the task processor was unable to add any additional diagnostic or remediation information. |

> [!NOTE]
> If the program you invoke uses exit codes 1 and 2 to indicate specific failure modes, then using exit codes 1 and 2 for task processor errors is ambiguous. You can change these task processor error codes to distinctive exit codes by editing the exception cases in the Program.cs file.
> 
> 

All the information returned by exceptions is written into stdout.txt and stderr.txt files. For more information, see Error Handling, in the Batch documentation.

### Client considerations
**Storage credentials**

If your task processor uses Azure blob storage to persist outputs, for example using the file conventions helper library, then it needs access to *either* the cloud storage account credentials *or* a blob container URL that includes a shared access signature (SAS). The template includes support for providing credentials via common environment variables. Your client can pass the storage credentials as follows:

```csharp
job.CommonEnvironmentSettings = new [] {
    new EnvironmentSetting("LINKED_STORAGE_ACCOUNT", "{storageAccountName}"),
    new EnvironmentSetting("LINKED_STORAGE_KEY", "{storageAccountKey}"),
};
```

The storage account is then available in the TaskProcessor class via the `_configuration.StorageAccount` property.

If you prefer to use a container URL with SAS, you can also pass this via an job common environment setting, but the task processor template does not currently include built-in support for this.

**Storage setup**

It is recommended that the client or job manager task create any containers required by tasks before adding the tasks to the job. This is mandatory if you use a container URL with SAS, as such a URL does not include permission to create the container. It is recommended even if you pass storage account credentials, as it saves every task having to call CloudBlobContainer.CreateIfNotExistsAsync on the container.

## Pass parameters and environment variables
### Pass environment settings
A client can pass information to the job manager task in the form of environment settings. This information can then be used by the job manager task when generating the task processor tasks that will run as part of the compute job. Examples of the information that you can pass as environment settings are:

* Storage account name and account keys
* Batch account URL
* Batch account key

The Batch service has a simple mechanism to pass environment settings to a job manager task by using the `EnvironmentSettings` property in [Microsoft.Azure.Batch.JobManagerTask][net_jobmanagertask].

For example, to get the `BatchClient` instance for a Batch account, you can pass as environment variables from the client code the URL and shared key credentials for the Batch account. Likewise, to access the storage account that is linked to the Batch account, you can pass the storage account name and the storage account key as environment variables.

### Pass parameters to the Job Manager template
In many cases, it's useful to pass per-job parameters to the job manager task, either to control the job splitting process or to configure the tasks for the job. You can do this by uploading a JSON file named parameters.json as a resource file for the job manager task. The parameters can then become available in the `JobSplitter._parameters` field in the Job Manager template.

> [!NOTE]
> The built-in parameter handler supports only string-to-string dictionaries. If you want to pass complex JSON values as parameter values, you will need to pass these as strings and parse them in the job splitter, or modify the framework's `Configuration.GetJobParameters` method.
> 
> 

### Pass parameters to the Task Processor template
You can also pass parameters to individual tasks implemented using the Task Processor template. Just as with the job manager template, the task processor template looks for a resource file named

parameters.json, and if found it loads it as the parameters dictionary. There are a couple of options for how to pass parameters to the task processor tasks:

* Reuse the job parameters JSON. This works well if the only parameters are job-wide ones (for example, a render height and width). To do this, when creating a CloudTask in the job splitter, add a reference to the parameters.json resource file object from the job manager task's ResourceFiles (`JobSplitter._jobManagerTask.ResourceFiles`) to the CloudTask's ResourceFiles collection.
* Generate and upload a task-specific parameters.json document as part of job splitter execution, and reference that blob in the task's resource files collection. This is necessary if different tasks have different parameters. An example might be a 3D rendering scenario where the frame index is passed to the task as a parameter.

> [!NOTE]
> The built-in parameter handler supports only string-to-string dictionaries. If you want to pass complex JSON values as parameter values, you will need to pass these as strings and parse them in the task processor, or modify the framework's `Configuration.GetTaskParameters` method.
> 
> 

## Next steps
### Persist job and task output to Azure Storage
Another helpful tool in Batch solution development is [Azure Batch File Conventions][nuget_package]. Use this .NET class library (currently in preview) in your Batch .NET applications to easily store and retrieve task outputs to and from Azure Storage. [Persist Azure Batch job and task output](batch-task-output.md) contains a full discussion of the library and its usage.


[net_jobmanagertask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.jobmanagertask.aspx
[github_samples]: https://github.com/Azure/azure-batch-samples
[nuget_package]: https://www.nuget.org/packages/Microsoft.Azure.Batch.Conventions.Files
[process_exitcode]: https://msdn.microsoft.com/library/system.diagnostics.process.exitcode.aspx
[vs_gallery]: https://visualstudiogallery.msdn.microsoft.com/
[vs_gallery_templates]: https://go.microsoft.com/fwlink/?linkid=820714
[vs_find_use_ext]: https://msdn.microsoft.com/library/dd293638.aspx

[diagram01]: ./media/batch-visual-studio-templates/diagram01.png
[solution_explorer01]: ./media/batch-visual-studio-templates/solution_explorer01.png
[solution_explorer02]: ./media/batch-visual-studio-templates/solution_explorer02.png

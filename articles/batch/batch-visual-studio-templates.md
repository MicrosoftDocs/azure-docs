<properties
	pageTitle="Job and task output persistence in Azure Batch | Microsoft Azure"
	description="Learn how to use Azure Storage as a durable store for your Batch task and job output, and enable viewing this persisted output in the Azure portal."
	services="batch"
	documentationCenter=".net"
	authors="fayora"
	manager="timlt"
	editor="" />

<tags
	ms.service="batch"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="big-compute"
	ms.date="09/06/2016"
	ms.author="marsma" />

# Visual Studio project templates for Azure Batch

The **Job Manager** and **Task Processor Visual Studio templates** for Batch provide code to help you to implement and run your compute-intensive workloads on Batch with the least amount of effort. This document describes these templates and provides guidance for how to use them.

>[AZURE.IMPORTANT] This article discusses only information applicable to these two templates, and assumes that you are familiar with the Batch service and key concepts related to it: pools, compute nodes, jobs and tasks, job manager tasks, environment variables, and other relevant information. You can find more information in [Basics of Azure Batch](batch-technical-overview.md), [Batch feature overview for developers](batch-api-basics.md), and [Get started with the Azure Batch library for .NET](batch-dotnet-get-started.md).

## High-level overview

The Job Manager and Task Processor templates can be used to create two useful components:

* A job manager task that implements a job splitter that can break a job down into multiple tasks that can run independently, in parallel.

* A task processor that can be used to perform pre-processing and post-processing around an application command line.

For example, in a movie rendering scenario, the job splitter would turn a single movie job into hundreds or thousands of separate tasks that would process individual frames separately. Correspondingly, the task processor would invoke the rendering application and all dependent processes that are needed to render each frame, as well as perform any additional actions (for example, copying the rendered frame to a storage location).

>[AZURE.NOTE] The Job Manager and Task Processor templates are independent of each other, so you can choose to use both, or only one of them, depending on the requirements of your compute job and on your preferences.

As shown in the diagram below, a compute job that uses these templates will go through three stages:

1. The client code (e.g., application, web service, etc.) submits a job to the Batch service on Azure, specifying as its job manager task the job manager program.

2. The Batch service runs the job manager task on a compute node and the job splitter launches the specified number of task processor tasks, on as many compute nodes as required, based on the parameters and specifications in the job splitter code.

3. The task processor tasks run independently, in parallel, to process the input data and generate the output data.

![diagram01]

## Prerequisites

To use the Batch templates, you will need the following:

* A computer with Visual Studio 2015, or newer, already installed on it.

* The Batch templates, which are available from the [Visual Studio Gallery][vs_gallery] as Visual Studio extensions. There are two ways to get the templates:

  * Install the templates using the **Extensions and Updates** dialog box in Visual Studio (for more information, see [Finding and Using Visual Studio Extensions][vs_find_use_ext]). In the **Extensions and Updates** dialog box, search and download the following two extensions:

    * Azure Batch Job Manager with Job Splitter
    * Azure Batch Task Processor

  * Download the templates from the online gallery for Visual Studio: [Microsoft Azure Batch Project Templates][vs_gallery_templates]

* If you plan to use the [Application Packages](batch-application-packages.md) feature to deploy the job manager and task processor to the Batch compute nodes, you need to link a storage account to your Batch account.

## Preparation

We recommend creating a solution that can contain your job manager as well as your task processor, because this can make it easier to share code between your job manager and task processor programs. To create this solution, follow these steps:

1. Open Visual Studio 2015 and select **File** > **New** > **Project**.

2. Under **Templates**, expand **Other Project Types**, click **Visual Studio Solutions**, and then select **Blank Solution**.

3. Type a name that describes your application and the purpose of this solution (e.g., “LitwareBatchTaskPrograms”).

4. To create the new solution, click **OK**.

## Job Manager template

The Job Manager template helps you to implement a job manager task that can perform the following actions:

* Split a job into multiple tasks.
* Submit those tasks to run on Batch.

>[AZURE.NOTE] For more information about job manager tasks, see [Batch feature overview for developers][batch-api-basics.md#job-manager-task].

### Create a Job Manager using the template

To add a job manager to the solution that you created earlier, follow these steps:

1. Open your existing solution in Visual Studio 2015.

2. In Solution Explorer, right-click the solution, click **Add** > **New Project**.

3. Under **Visual C#**, click **Cloud**, and then click **Azure Batch Job Manager with Job Splitter**.

4. Type a name that describes your application and identifies this project as the job manager (e.g. “LitwareJobManager”).

5. To create the project, click **OK**.

6. Finally, build the project to force Visual Studio to load all referenced NuGet packages and to verify that the project is valid before you start modifying it.

### Job Manager template files and their purpose

When you create a project using the Job Manager template, it generates three groups of code files:

* The main program file (Program.cs). This contains the program entry point and top-level exception handling. You shouldn’t normally need to modify this.

* The Framework directory. This contains the files responsible for the ‘boilerplate’ work done by the job manager program – unpacking parameters, adding tasks to the Batch job, etc. You shouldn’t normally need to modify these files.

* The job splitter file (JobSplitter.cs). This is where you will put your application-specific logic for splitting a job into tasks.

Of course you can add additional files as required to support your job splitter code, depending on the complexity of the job splitting logic.

The template also generates standard .NET project files such as a .csproj file, app.config, packages.config, etc.

The rest of this section describes the different files and their code structure, and explains what each class does.

![solution_explorer01]

**Framework files**

* `Configuration.cs`: Encapsulates the loading of job configuration data such as Batch account details, linked storage account credentials, job and task information, and job parameters. It also provides access to Batch-defined environment variables (see Environment settings for tasks, in the Batch documentation) via the Configuration.EnvironmentVariable class.

* `IConfiguration.cs`: Abstracts the implementation of the Configuration class, so that you can unit test your job splitter using a fake or mock configuration object.

* `JobManager.cs`: Orchestrates the components of the job manager program. It is responsible for the initializing the job splitter, invoking the job splitter, and dispatching the tasks returned by the job splitter to the task submitter.

* `JobManagerException.cs`: Represents an error that requires the job manager to terminate. JobManagerException is used to wrap ‘expected’ errors where specific diagnostic information can be provided as part of termination.

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

>[AZURE.IMPORTANT] The annotated section in the `Split()` method is the only section of the Job Manager template code that is intended for you to modify by adding the logic to split your jobs into different tasks. If you want to modify a different section of the template, please ensure you are familiarized with how Batch works, and try out a few of the [Batch code samples][github_samples].

Your Split() implementation has access to:

* The job parameters, via the `_parameters` field.
* The CloudJob object representing the job, via the `_job` field.
* The CloudTask object representing the job manager task, via the `_jobManagerTask` field.

Your `Split()` implementation does not need to add tasks to the job directly. Instead, your code should return a sequence of CloudTask objects, and these will be added to the job automatically by the framework classes that invoke the job splitter. It's common to use C#'s iterator (`yield return`) feature to implement job splitters as this allows the tasks to start running as soon as possible rather than waiting for all tasks to be calculated.

**Job splitter failure**

If your job splitter encounters an error, it should either:

* Terminate the sequence using the C# `yield break` statement, in which case the job manager will be treated as successful; or

* Throw an exception, in which case the job manager will be treated as failed and may be retried depending on how the client has configured it).

In both cases, any tasks already returned by the job splitter and added to the Batch job will be eligible to run. If you don’t want this to happen, then you could:

* Terminate the job before returning from the job splitter

* Formulate the entire task collection before returning it (that is, return an `ICollection<CloudTask>` or `IList<CloudTask>` instead of implementing your job splitter using a C# iterator)

* Use task dependencies to make all tasks depend on the successful completion of the job manager

**Job manager retries**

If the job manager fails, it may be retried by the Batch service depending on the client retry settings. In general, this is safe, because when the framework adds tasks to the job, it ignores any tasks that already exist. However, if calculating tasks is expensive, you may not wish to incur the cost of recalculating tasks that have already been added to the job; conversely, if the re-run is not guaranteed to generate the same task IDs then the ‘ignore duplicates’ behavior will not kick in. In these cases you should design your job splitter to detect the work that has already been done and not repeat it, for example by performing a CloudJob.ListTasks before starting to yield tasks.

### Exit codes and exceptions in the Job Manager template

Exit codes and exceptions provide a mechanism to determine the outcome of running a program, and they can help to identify any problems with the execution of the program. The Job Manager template implements the exit codes and exceptions described in this section.

A job manager task that is implemented with the Job Manager template can return three possible exit codes:

| Code | Description |
|------|-------------|
| 0    | The job manager completed successfully. Your job splitter code ran to completion, and all tasks were added to the job. |
| 1    | The job manager task failed with an exception in an ‘expected’ part of the program. The exception was translated to a JobManagerException with diagnostic information and, where possible, suggestions for resolving the failure. |
| 2    | The job manager task failed with an ‘unexpected’ exception. The exception was logged to standard output, but the job manager was unable to add any additional diagnostic or remediation information. |

In the case of job manager task failure, some tasks may still have been added to the service before the error occurred. These tasks will run as normal. See “Job Splitter Failure” above for discussion of this code path.

All the information returned by exceptions is written into stdout.txt and stderr.txt files. For more information, see [Error Handling](batch-api-basics.md#error-handling).

### Client considerations

This section describes some client implementation requirements when invoking a job manager based on this template. See [How to pass parameters and environment variables from the client code](FIXME) for details on passing parameters and environment settings.

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

** Storage setup**

It is recommended that the client or job manager task create any containers required by tasks before adding the tasks to the job. This is mandatory if you use a container URL with SAS, as such a URL does not include permission to create the container. It is recommended even if you pass storage account credentials, as it saves every task having to call CloudBlobContainer.CreateIfNotExistsAsync on the container.

## Pass parameters and environment variables from client code

### Pass environment settings

A client can pass information to the job manager task in the form of environment settings. This information can then be used by the job manager task when generating the task processor tasks that will run as part of the compute job. Examples of the information that you can pass as environment settings are:

* Storage account name and account keys
* Batch account URL
* Batch account key

The Batch service has a simple mechanism to pass environment settings to a job manager task by using the `EnvironmentSettings` property in [Microsoft.Azure.Batch.JobManagerTask][net_jobmanagertask].

For example, to get the `BatchClient` instance for a Batch account, you can pass as environment variables from the client code the URL and shared key credentials for the Batch account. Likewise, to access the storage account that is linked to the Batch account, you can pass the storage account name and the storage account key as environment variables.

### Pass parameters to the Job Manager template

In many cases, it’s useful to pass per-job parameters to the job manager task, either to control the job splitting process or to configure the tasks for the job. You can do this by uploading a JSON file named parameters.json as a resource file for the job manager task. The parameters can then become available in the `JobSplitter._parameters` field in the Job Manager template.

>[AZURE.NOTE] The built-in parameter handler supports only string-to-string dictionaries. If you want to pass complex JSON values as parameter values, you will need to pass these as strings and parse them in the job splitter, or modify the framework’s `Configuration.GetJobParameters` method.

### Pass parameters to the Task Processor template

You can also pass parameters to individual tasks implemented using the Task Processor template. Just as with the job manager template, the task processor template looks for a resource file named

parameters.json, and if found it loads it as the parameters dictionary. There are a couple of options for how to pass parameters to the task processor tasks:

* Reuse the job parameters JSON. This works well if the only parameters are job-wide ones (for example, a render height and width). To do this, when creating a CloudTask in the job splitter, add a reference to the parameters.json resource file object from the job manager task’s ResourceFiles (`JobSplitter._jobManagerTask.ResourceFiles`) to the CloudTask’s ResourceFiles collection.

* Generate and upload a task-specific parameters.json document as part of job splitter execution, and reference that blob in the task’s resource files collection. This is necessary if different tasks have different parameters. An example might be a 3D rendering scenario where the frame index is passed to the task as a parameter.

>[AZURE.NOTE] The built-in parameter handler supports only string-to-string dictionaries. If you want to pass complex JSON values as parameter values, you will need to pass these as strings and parse them in the task processor, or modify the framework’s `Configuration.GetTaskParameters` method.

## Next steps

* Batch Apps users should head over to the [Batch Apps Migration][github_migration] repository on GitHub. This article is available there in PDF format, as well as the [Developer Migration Guide][github_migration_guide]. The Batch Apps preview functionality is now available in Batch, so the **preview of Batch Apps will be discontinued on September 30, 2016**. To avoid downtime, workloads that use the Batch Apps preview need to be migrated to Batch by using the updated Batch API.

[net_jobmanagertask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.jobmanagertask.aspx
[github_migration]: https://github.com/Azure/azure-batch-apps-migration
[github_migration_guide]: https://github.com/Azure/azure-batch-apps-migration/blob/master/developer-migration-guide.pdf
[github_samples]: https://github.com/Azure/azure-batch-samples
[vs_gallery]: https://visualstudiogallery.msdn.microsoft.com/
[vs_gallery_templates]: https://go.microsoft.com/fwlink/?linkid=820714
[vs_find_use_ext]: https://msdn.microsoft.com/library/dd293638.aspx

[diagram01]: ./media/batch-visual-studio-templates/diagram01.png
[solution_explorer01]: ./media/batch-visual-studio-templates/solution_explorer01.png
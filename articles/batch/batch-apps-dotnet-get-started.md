<properties
	pageTitle="Tutorial - Get Started with the Azure Batch Apps Library for .NET"
	description="Learn basic concepts about Azure Batch Apps and how to develop with a simple scenario"
	services="batch"
	documentationCenter=".net"
	authors="yidingzhou"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.devlang="dotnet"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.workload="big-compute"
	ms.date="07/21/2015"
	ms.author="yidingz"/>




# Get Started with the Azure Batch Apps Library for .NET
This tutorial shows you how to run parallel compute workloads on Azure Batch using the Batch Apps service.

Batch Apps is a feature of Azure Batch that provides an application-centric way of managing and executing Batch workloads.  Using the Batch Apps SDK, you can create packages to Batch-enable an application, and deploy them in your own account or make them available to other Batch users.  Batch also provides data management, job monitoring, built-in diagnostics and logging, and support for inter task dependencies.  It additionally includes a management portal where you can manage jobs, view logs, and download outputs without having to write your own client.

In the Batch Apps scenario, you write code using the Batch Apps Cloud SDK to partition jobs into parallel tasks, describe any dependencies between these tasks, and specify how to execute each task.  This code is deployed to the Batch account.  Clients can then execute jobs simply by specifying the kind of job and the input files to a REST API.

>[AZURE.NOTE] To complete this tutorial, you need an Azure account. You can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/). You can use NuGet to obtain both the <a href="http://www.nuget.org/packages/Microsoft.Azure.Batch.Apps.Cloud/">Batch Apps Cloud</a> assembly and the <a href="http://www.nuget.org/packages/Microsoft.Azure.Batch.Apps/">Batch Apps Client</a> assembly. After you create your project in Visual Studio, right-click the project in **Solution Explorer** and choose **Manage NuGet Packages**. You can also download the Visual Studio Extension for Batch Apps which includes a project template to cloud-enable applications and ability to deploy an application <a href="https://visualstudiogallery.msdn.microsoft.com/8b294850-a0a5-43b0-acde-57a07f17826a">here</a> or via searching for **Batch Apps** in Visual Studio via the Extensions and Updates menu item.  You can also find <a href="https://go.microsoft.com/fwLink/?LinkID=512183&clcid=0x409">end-to-end samples on MSDN.</a>
>

###Fundamentals of Azure Batch Apps
Batch is designed to work with existing compute-intensive applications. It leverages your existing application code and runs it in a dynamic, virtualized, general-purpose environment. To enable an application to work with Batch Apps there are a couple of things that need to be done:

1.	Prepare a zip file of your existing application executables – the same executables that would be run in a traditional server farm or cluster – and any support files it needs. This zip file is then uploaded to your Batch account using the management portal or REST API.
2.	Create a zip file of the "cloud assemblies" that dispatch your workloads to the application, and upload it via the management portal or REST API. A cloud assembly contains two components which are built against the Cloud SDK:
	1.	Job Splitter – which breaks the job down into tasks that can be processed independently. For example, in an animation scenario, the job splitter would take a movie job and break it down into individual frames.
	2.	Task Processor – which invokes the application executable for a given task. For example, in an animation scenario, the task processor would invoke a rendering program to render the single frame specified by the task at hand.
3.	Provide a way to submit jobs to the enabled application in Azure. This might be a plugin in your application UI or a web portal or even an unattended service as part of your execution pipeline. See the <a href="https://go.microsoft.com/fwLink/?LinkID=512183&clcid=0x409">samples</a> on MSDN for examples.



###Batch Apps Key Concepts
The Batch Apps programming and usage model revolves around the following key concepts:

####Jobs
A **job** is a piece of work submitted by the user. When a job is submitted, the user specifies the type of job, any settings for that job, and the data required for the job. Either the enabled implementation can work out these details on the user’ behalf or in some cases the user can provide this information explicitly via the client. A job has results that are returned. Each job has a primary output and optionally a preview output. Jobs can also return extra outputs if desired.

####Tasks
A **task** is a piece of work to be done as part of a job. When a user submits a job, it is broken up into smaller tasks. The service then processes these individual tasks, then assemblies the task results into an overall job output. The nature of tasks depends on the kind of job. The Job Splitter defines how a job is broken down into tasks, guided by the knowledge of what chunks of work the application is designed to process. Task outputs can also be download individually and might be useful in some cases, e.g. when a user may want to download individual tasks from an animation job.

####Merge Tasks
A **merge task** is a special kind of task that assembles the results of individual tasks into the final job results. For a movie rending job, the merge task might assemble the rendered frames into a movie or to zip all the rendered frames into a single file. Every job has a merge task even if no actual 'merging' is needed.

####Files
A **file** is a piece of data used as an input to a job. A job can have no input file associated with it or have one or many. The same file can be used in multiple jobs as well, e.g. for a movie rendering job, the files might be textures, models, etc. For a data analysis job, the files might be a set of observations or measurements.

###Enabling the Cloud Application
Your Application must contain a static field or property containing all the details of your application. It specifies the name of the application and the job type or job types handled by the application. This is provided when using the template in the SDK that can be downloaded via Visual Studio Gallery.

Here is an example of a cloud application declaration for a parallel workload:

	public static class ApplicationDefinition
	{
	    public static readonly CloudApplication App = new ParallelCloudApplication
	    {
	        ApplicationName = "ApplicationName",
	        JobType = "ApplicationJobType",
	        JobSplitterType = typeof(MyJobSplitter),
	        TaskProcessorType = typeof(MyTaskProcessor),
	    };
	}

####Implementing Job Splitter and Task Processor
For embarrassingly parallel workloads, you must implement a job splitter and a task processor.

####Implementing JobSplitter.SplitIntoTasks
Your SplitIntoTasks implementation must return a sequence of tasks. Each task represents a separate piece of work that will be queued for processing by a compute node. Each task must be self-contained and must be set up with all the information that the task processor will need.

The tasks specified by the job splitter are represented as TaskSpecifier objects. TaskSpecifier has a number of properties which you can set before you return the task.


-	TaskIndex is ignored, but is available to task processors. You can use this to pass an index to the task processor. If you don’t need to pass an index, you don’t need to set this property.
-	Parameters is an empty collection by default. You can add to it or replace it with a new collection. You can copy entries from the job parameters collection using the WithJobParameters or WithAllJobParameters method.  


RequiredFiles is an empty collection by default. You can add to it or replace it with a new collection. You can copy entries from the job files collection using the RequiringJobFiles or RequiringAllJobFiles method.

You can specify a task that depends on a specific other task. To do this, set the TaskSpecifier.DependsOn property, passing the ID of the task it depends on:

	new TaskSpecifier {
	    DependsOn = TaskDependency.OnId(5)
	}

The task will not run until the output of the depended on task is available.

You can also specify that a whole group of tasks should not start processing until another group has completely finished. In this case you can set the TaskSpecifier.Stage property. Tasks with a given Stage value will not begin processing until all tasks with lower Stage values have finished; for example, tasks with Stage 3 will not begin processing until all tasks with Stage 0, 1 or 2 have finished. Stages must begin at 0, the sequence of stages must have no gaps, and SplitIntoTasks must return tasks in stage order: for example, it is an error to return a task with Stage 0 after a task with Stage 1.

Every parallel job ends with a special task called the merge task. The merge task’s job is to assemble the results of the parallel processing tasks into a final result. Batch Apps automatically creates the merge task for you.  

In rare cases, you may want to explicitly control the merge task, for example to customize its parameters. In this case, you can specify the merge task by returning a TaskSpecifier with its IsMerge property set to true. This will override the automatic merge task. If you create an explicit merge task:  

-	You may create only one explicit merge task
-	It must be the last task in the sequence
-	It must have IsMerge set to true, and every other task must have IsMerge set to false  


Remember, however, that normally you do not need to create the merge task explicitly.  

The following code demonstrates a simple implementation of SplitIntoTasks.  

	protected override IEnumerable<TaskSpecifier> SplitIntoTasks(
	    IJob job,
	    JobSplitSettings settings)
	{
	    int start = Int32.Parse(job.Parameters["startIndex"]);
	    int end = Int32.Parse(job.Parameters["endIndex"]);
	    int count = (end - start) + 1;

	    // Processing tasks
	    for (int i = 0; i < count; ++i)
	    {
	        yield return new TaskSpecifier
	        {
	            TaskIndex = start + i,
	        }.RequiringAllJobFiles();
	    }
	}
####Implementing ParallelTaskProcessor.RunExternalTaskProcess

RunExternalTaskProcess is called for each non merge task returned from the job splitter. It should invoke your application with the appropriate arguments, and return a collection of outputs that need to be kept for later use.

The following fragment shows how to call a program named application.exe. Note you can use the ExecutablePath helper method to create absolute file paths.

The ExternalProcess class in the Cloud SDK provides useful helper logic for running your application executables. ExternalProcess can take care of cancellation, translating exit codes into exceptions, capturing standard out and standard error and setting up environment variables. You can also additionally use the .NET Process class directly to run your programs if you prefer.

Your RunExternalTaskProcess method returns a TaskProcessResult, which includes a list of output files. This must include at minimum all files required for the merge; you can also optionally return log files, preview files and intermediate files (e.g. for diagnostic purposes if the task failed).  Note that your method return the file paths, not the file content.

Each file must be identified with the type of output it contains: output (that is, part of the eventual job output), preview, log or intermediate.  These values come from the TaskOutputFileKind enumeration. The following fragment returns a single task output, and no preview or log. The TaskProcessResult.FromExternalProcessResult method simplifies the common scenario of capturing exit code, processor output and output files from a command line program:

The following code demonstrates a simple implementation of ParallelTaskProcessor.RunExternalTaskProcess.

	protected override TaskProcessResult RunExternalTaskProcess(
	    ITask task,
	    TaskExecutionSettings settings)
	{
	    var inputFile = LocalPath(task.RequiredFiles[0].Name);
	    var outputFile = LocalPath(task.TaskId.ToString() + ".jpg");

	    var exePath = ExecutablePath(@"application\application.exe");
	    var arguments = String.Format("-in:{0} -out:{1}", inputFile, outputFile);

	    var result = new ExternalProcess {
	        CommandPath = exePath,
	        Arguments = arguments,
	        WorkingDirectory = LocalStoragePath,
	        CancellationToken = settings.CancellationToken
	    }.Run();

	    return TaskProcessResult.FromExternalProcessResult(result, outputFile);
	}
####Implementing ParallelTaskProcessor.RunExternalMergeProcess

This is called for the merge task. It should invoke the application to combine outputs of the previous tasks, in whatever way is appropriate to your application and return the combined output.

The implementation of RunExternalMergeProcess is very similar to RunExternalTaskProcess, except that:  

-	RunExternalMergeProcess consumes the outputs of previous tasks, rather than user input files. You should therefore work out the names of the files you want to process based on the task ID, rather than from the Task.RequiredFiles collection.
-	RunExternalMergeProcess returns a JobOutput file, and optionally a JobPreview file.


The following code demonstrates a simple implementation of ParallelTaskProcessor.RunExternalMergeProcess.

	protected override JobResult RunExternalMergeProcess(
	    ITask mergeTask,
	    TaskExecutionSettings settings)
	{
	    var outputFile =  "output.zip";

	    var exePath =  ExecutablePath(@"application\application.exe");
	    var arguments = String.Format("a -application {0} *.jpg", outputFile);

	    new ExternalProcess {
	        CommandPath = exePath,
	        Arguments = arguments,
	        WorkingDirectory = LocalStoragePath
	    }.Run();

	    return new JobResult {
	        OutputFile = outputFile
	    };
	}

###Submitting Jobs to Batch Apps
A job describes a workload to be run and needs to include all the information about the workload except for file content. For example, the job contains configuration settings which flow from the client through the job splitter and on to tasks. The samples provided on MSDN are examples of how to submit jobs and provide multiple clients including a web portal and a command line client.

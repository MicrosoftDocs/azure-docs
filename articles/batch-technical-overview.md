<properties
	pageTitle="Azure Batch technical overview"
	description="Learn about the concepts, workflows, and scenarios of the Azure Batch service"
	services="batch"
	documentationCenter=""
	authors="dlepow"
	manager="timlt"
	editor=""/>

<tags
	ms.service="batch"
	ms.workload="big-compute"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="danlep"/>


#Azure Batch technical overview
Azure Batch helps you run large-scale parallel and high performance computing (HPC) applications in the cloud. It's a platform service that provides job scheduling and autoscaling of a managed collection of virtual machines (VMs) to run the jobs. By using the Batch service, you can configure batch workloads to run in Azure on demand or on a schedule, and not worry about the complexity of scheduling jobs and managing VMs in the underlying platform.

>[AZURE.NOTE]Batch is in Preview. To use Batch, you need an Azure account, and you need to sign up for the Batch Preview. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Create an Azure account](http://azure.microsoft.com/develop/php/tutorials/create-a-windows-azure-account/).


## Use cases

Batch uses the elasticity and scale of the cloud to help you with *batch processing* or *batch computing* - running a large volume of similar tasks to get some desired result. A command line program or script takes a set of data files as input, processes the data in a series of tasks, and produces a set of output files. The output files might be the final result or an intermediate step in a larger workflow.

Batch computing is a common pattern for organizations that process, transform, and analyze large amounts of data, either on a schedule or on-demand. It includes end-of-cycle processing such as a bank’s daily risk reporting or a payroll that must be done on schedule. It also includes large-scale business, science, and engineering applications that typically need the tools and resources of a compute cluster or grid. Applications include traditional HPC applications such as fluid dynamics simulations as well as specialized workloads in fields such as automotive design, oil and gas exploration, life sciences research, and digital content creation.

Batch works well with intrinsically parallel (sometimes called "embarrassingly parallel") applications or workloads, which lend themselves to running as parallel tasks on multiple computers, such as the compute VMs managed by the Batch service. See Figure 1.  

![Parallel tasks][parallel]

**Figure 1. Parallel tasks running on multiple computers**

Examples include:

* Financial risk modeling
* Image rendering and image processing
* Media encoding and transcoding
* Genetic sequence analysis
* Software testing

You can also use Batch to perform parallel calculations with a reduce step at the end, and other more complicated non-acyclic parallel workloads.

>[AZURE.NOTE]Batch Preview does not currently support message passing interface (MPI) applications.

## Developer scenarios

The REST-based Batch APIs support two developer scenarios to help you configure and run your batch workloads with the Batch service:

1. **Distribute computations as workitems** - Use the *Batch* APIs to create and manage a flexible pool of compute VMs and specify the work they will do. This gives you full control over resources and requires the client to manage the task execution pipeline - for example, with a workflow manager or meta-scheduler, which can be implemented using the Batch REST APIs or optionally a job manager feature of the workitem. Instead of having to set up a compute cluster or write code to queue and schedule your jobs, you automate the scheduling of compute jobs and scale a pool of compute VMs up and down to run them. As part of specifying workitems, you define all dependencies and define the movement of input and output files.

2. **Publish and run applications with the Batch service** - The *Batch Apps* APIs work at a higher level, helping you wrap an existing application so it runs as a service on a pool of VMs managed in the background by Batch. The application might be one that runs today on client workstations or a compute cluster. The Batch Apps framework handles the movement of input and output files, job execution, job management, and data persistence. Batch Apps also allows you to model tasks for how data is partitioned and for multiple steps in a job. Included is a REST-based API and the Batch Apps portal, which can be accessed from the Azure Management Portal and helps you monitor the jobs you submitted.


## Batch concepts

The following sections summarize key concepts for working with the Batch service and APIs. For more information, see [API basics for Azure Batch](batch-api-basics.md).

* [Batch account](#BKMK_Account)
* [Task virtual machines and pools](#BKMK_TVM)
* [Workitems, jobs, and tasks](#BKMK_Workitem)
* [Files and directories](#BKMK_Files)

### <a id="BKMK_Account">Batch account</a>
You need a unique **Batch account** to work with the Batch service. All requests that you make to the Batch service must be authenticated using the name of the account and its access key.

You can create a Batch account and manage access keys for the account in the Azure portal or with the [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md).

To create a Batch account in the portal:

1. Sign in to the [Azure Management Portal](https://manage.windowsazure.com).
2. Click **New**, click **Compute**, click **Batch Service**, and then click **Quick Create**.
![Create a Batch account][account_portal]

3. Enter the following information:

	* In **Account Name**, enter a unique name to use in the Batch account URL.
	* In **Region**, select a region in which Batch is available.
	* If you have more than one subscription, in **Subscription**, select an available subscription that will be billed for your use of Batch.


### <a id="BKMK_TVM">Task virtual machines and pools</a>

A **task virtual machine** (TVM) is an Azure VM that the Batch service dedicates to running a specific task for your application - such as an executable file (.exe), or in the case of Batch Apps, one or more programs from an application image. Unlike a typical Azure VM, you don't provision or manage a TVM directly; instead, the Batch service creates and manages TVMs as a **pool** of similarly configured VMs, as shown in Figure 2.

![Pool and TVMs][TVM_pool]

**Figure 2. A pool of TVMs**

If you use the Batch APIs, you can create a pool directly, or create one automatically when you specify the work to be done. If you use the Batch Apps APIs, a pool gets created automatically when you run your cloud-enabled Batch application.


Attributes of a pool include:

* A [size](http://msdn.microsoft.com/library/azure/dn197896.aspx) for the TVMs
* The operating system that runs on the TVMs
* The maximum number of TVMs
* A scaling policy for the pool - a formula based on current workload and resource usage that dynamically adjusts the number of TVMs that process tasks
* Whether firewall ports are enabled on the TVMs to allow intrapool communication
* A certificate that is installed on the TVMs - for example, to authenticate access to a storage account
* A start task for TVMs, for one-time operations like installing applications or downloading data used by tasks

>[AZURE.NOTE]Currently a TVM can only run the Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2 SP1 operating system.

A pool can only be used by the Batch account in which it was created. A Batch account can have more than one pool.

Every TVM in a pool gets assigned a unique name and an associated IP address. When a TVM is removed from a pool, it loses the changes that were made to the operating system, its local files, its name, and its IP address. When a TVM leaves a pool, its lifetime is over.


### <a id="BKMK_Workitem">Workitems, jobs, and tasks</a>

A **workitem** is a template that specifies how an application will run on TVMs in a pool. A **job** is a scheduled workitem and might occur once or reoccur. A job consists of a collection of **tasks**. Figure 3 shows the basic relationships.

![Workitem, job, and tasks][job_task]

**Figure 3. A workitem, job, and tasks**

Depending on the APIs you use to develop with Batch, you will need to manage more or fewer details about workitems, jobs, and tasks.

* If you develop an application with the Batch APIs, you need to programmatically define all the workitems, jobs, and tasks and configure the TVM pools that run the tasks.

* If you integrate a client application by using the Batch Apps APIs and tools, you can use components that automatically split a job into tasks, process the tasks, and merge the results of individual tasks to the final job results. When you submit the workload to the Batch service, the Batch Apps framework manages the jobs and executes the tasks on the TVMs.



### <a id="BKMK_Files">Files and directories</a>

A file is a piece of data used as an input to a job task. A task can have no, one, or many input files associated with it. The same file can be used in multiple tasks as well, e.g., for the tasks in a movie rendering job, there might be commonly used textures and models. For tasks in a data analysis job, the files might be a set of observations or measurements.

A working directory exists for each task that contains the input data it processes and the output data it creates. These directories and files are available for use by other tasks while a job runs. All tasks, files, and directories on a TVM are owned by a single user account.

Again, depending on the APIs you use with Batch, you will need to manage more or fewer details about the input and output files for your jobs and tasks. If you are developing with the Batch APIs, you specify these dependencies and file movements explicitly. With Batch Apps, the framework handles most of these details for you.

## Workitems workflow
Figure 4 shows a you how to submit an application to a pool where it's distributed for processing. This uses the Batch API.

![Workitems workflow][work_item_workflow]

**Figure 4. Workflow to distribute workitems to pooled VMs**

1.	Upload input files (such as source data or images) required for a job to an Azure storage account. These files must be in the storage account so that the Batch service can access them. The Batch service loads them onto a TVM when the task runs.
2.	Upload the dependent binary files to the storage account. The binary files include the program that is run by the task and the dependent assemblies. These files must also be accessed from storage and are loaded onto the TVM.
3.	Create a pool of TVMs, specifying the size of the TVMs in the pool, the OS they run, and other properties. When a task runs, it is assigned a TVM from this pool.
4.	Create a workitem. A job will be automatically created when you create a workitem. A workitem enables you to manage a job of tasks.
5.	Add tasks to the job. Each task uses the program that you uploaded to process information from a file you uploaded.
6.	Run the application and monitor the results of the output.

## Workflow to publish and run applications
Figure 5 shows a basic workflow to publish an application by using the Batch Apps API and then submit jobs to the application enabled by Batch.

![Application publishing workflow][app_pub_workflow]

**Figure 5. Workflow to publish and run an application with Batch Apps**

1.	Prepare an **application image** - a zip file of your existing application executables  and any support files they need. These might be the same executables you run in a traditional server farm or cluster.
2.	Create a zip file of the **cloud assembly** that will invoke and dispatch your workloads to the Batch service. This contains two components that are available via the SDK:

	a. **Job splitter** – Breaks a job down into tasks that can be processed independently. For example, in an animation scenario, the job splitter would take a movie rendering job and divide it into individual frames.

	b. **Task processor** – Invokes the application executable for a given task. For example, in an animation scenario, the task processor would invoke a rendering program to render the single frame specified by the task.

3.	Use the Batch Apps APIs or developer tools to upload the zip files prepared in the previous two steps to an Azure storage account. These files must be in the storage account so that the Batch service can access them. This is typically done once per application, by a service administrator.
4.	Provide a way to submit jobs to the enabled application service in Azure. This might be a plugin in your application UI, a web portal, or an unattended service as part of your  backend system. There are samples available with the SDK to demonstrate various options.

	To run a job:

	a. Upload the input files (such as source data or images) specific to the user's job. These files must be in the storage account so that the Batch service can access them.

	b. Submit a job with the required parameters and list of files.

	c. Monitor job progress by using the APIs or the Batch Apps portal.

	d. Download outputs.

## Additional resources

* [Get Started with the Azure Batch Library for .NET](batch-dotnet-get-started.md)
* [Azure Batch development libraries and tools](batch-development-libraries-tools.md)
* [Azure Batch REST API Reference](http://go.microsoft.com/fwlink/p/?LinkId=517803)
* [Azure Batch Apps REST API Reference](http://go.microsoft.com/fwlink/p/?LinkId=517804)

[parallel]: ./media/batch-technical-overview/parallel.png
[TVM_pool]: ./media/batch-technical-overview/TVM_pool.png
[job_task]: ./media/batch-technical-overview/job_task.png
[account_portal]: ./media/batch-technical-overview/account_portal.png
[work_item_workflow]: ./media/batch-technical-overview/work_item_workflow.png
[app_pub_workflow]: ./media/batch-technical-overview/app_pub_workflow.png

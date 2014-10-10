<properties linkid="batch-technical-overview" urlDisplayName="" pageTitle="Azure Batch technical overview" metaKeywords="" description="Learn about the concepts, workflows, and scenarios of the Azure Batch service" metaCanonical="" services="Batch" documentationCenter="" title="Azure Batch technical overview" authors="danlep" solutions="" manager="timlt" editor="tysonn" />

<tags ms.service="batch" ms.workload="big-compute" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/27/2014" ms.author="danlep" />


#Azure Batch technical overview
Azure Batch provides job scheduling and autoscaling of compute resources as a platform service, making it easy to run large-scale parallel and high performance computing (HPC) applications in the cloud. By using the Batch SDK and Batch service, you can configure batch workloads to run on demand or on a schedule on a managed collection of virtual machines and not have to worry about the complexity of scheduling jobs and managing resources in the underlying platform.
 
>[WACOM.NOTE]Azure Batch is in Preview. To use Batch, you need an Azure account, and you need to enable Batch preview on your subscription. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Create an Azure account](http://www.windowsazure.com/en-us/develop/php/tutorials/create-a-windows-azure-account/).


This article gives you an overview of:
 
* [Use cases](#BKMK_Scenarios)
* [Developer scenarios](#BKMK_Approaches)
* [Batch concepts](#BKMK_Entities)
* [Work item workflow](#BKMK_Worflow_workitems)
* [Application integration workflow](#BKMK_Workflow_cloudappss)
* [Additional resources](#BKMK_Resources)

<h2 id="BKMK_Scenarios">Use cases</h2>

Azure Batch uses the elasticity and scale of the cloud to help you with *batch processing* or *batch computing* - running large volumes of similar tasks without a manual intervention once started. Essentially, a command line program or script takes a set of data files as input, processes the data in a series of tasks, and produces a set of output files. The output files might be a work product themselves or an intermediate step in a larger workflow.       
 
Batch computing is a common pattern for organizations that process, transform, and analyze large amounts of data. It includes end-of-cycle processing such as a bank’s daily risk reporting or a payroll that must be done on schedule. It also includes large-scale business, science, and engineering applications that typically need the tools and resources of a compute cluster or grid, either on a schedule or on-demand. Applications include traditional HPC applications such as fluid dynamics simulations as well as specialized workloads in fields such as automotive design, oil and gas exploration, life sciences research, and digital content creation. 
 
Batch works well with intrinsically parallel (sometimes called "embarrassingly parallel") applications or workloads, so named because the problems they solve lend themselves to running as parallel tasks on multiple computers, such as the compute VMs managed by the Batch service.  

![Parallel tasks][parallel]

**Figure 1. Parallel tasks running on multiple computers**

Examples include:

* Financial risk modeling 
* Image rendering and image processing
* Media encoding and transcoding
* Genetic sequence analysis
* Software testing

You can also use Azure Batch to perform parallel calculations with a reduce step at the end, and other more complicated non-acyclic parallel workloads. 

>[WACOM.NOTE]Batch Preview does not support message passing interface (MPI) applications.

<h2 id="BKMK_Approaches">Developer scenarios</h2>

The REST-based Batch APIs support two developer scenarios to help you configure and run your batch workloads with the Batch service:
 
1. **Distribute computations as work items** - Use the *Batch* API to create and manage a flexible pool of compute VMs and specify work items to run on them. This gives you full control over resources and the task execution pipeline by a client such as a workflow manager or meta-scheduler. Tasks can also be managed by a job manager deployed with the compute VMs. Instead of having to set up a compute cluster or write code to queue and schedule your jobs, you automate the scheduling of compute jobs and scale a pool of compute VMs up and down to run them. The Batch service also optimizes the location of these jobs and their access to data they process. 

2.  **Cloud-enable client applications** - *Batch Apps* provides a higher level of abstraction and job execution pipeline hosted by the Batch service so you can easily integrate existing client applications with Batch. (You might be running these applications already on client workstations or on a compute cluster.) You cloud-enable the client applications by wrapping existing binaries and executables and publish them to run on pooled VMs that the Batch service creates and manages in the background. Batch Apps also allows you to model tasks for how data is partitioned and for multiple steps in a job. Included is a REST-based API and the Batch Apps portal, which can be accessed from the Azure Management Portal and provides visibility into the submitted jobs or workloads.


<h2 id="BKMK_Entities">Batch concepts</h2>

The following are key concepts for working with the Batch service and SDKs.

* [Batch account](#BKMK_Account)
* [Task virtual machines and pools](#BKMK_TVM)
* [Work items, jobs, and tasks](#BKMK_Workitem)
* [Files and directories](#BKMK_Files)

<h3 id="BKMK_Account">Batch account</h3>
You need a unique **Batch account** to work with the Batch service. When performing operations with the Batch service, you authenticate your requests with name of the account and an associated access key. You also need a Batch account to access the Batch Apps portal.
 
You can create a Batch account and manage access keys for the account in the Azure Management Portal.

To create a Batch account:

1. Sign in to the [Azure Management Portal](https://manage.windowsazure.com).
2. Click **New**, click **Compute**, click **Batch Service**, and then click **Quick Create**.
![Create a Batch account][account_portal]

3.  Enter the following information:

	* In **URL**, enter a unique subdomain name to use in the Batch account URL.
	* In **Region**, select a region in which Batch is available.
	* If you have more than one subscription, in **Subscription**, select an available subscription that will be billed for your use of Batch.

 
<h3 id="BKMK_TVM">Task virtual machines and pools</h3>

A **task virtual machine** (TVM) is an Azure VM that the Batch service dedicates to running a specific workload for your application, such as an executable file (.exe), command file (.cmd), batch file (.bat), or script. Unlike a typical Azure VM, you don't provision or manage a TVM directly; instead, the Batch service creates and manages TVMs as a **pool** of similarly configured compute resources. The TVMs also have folders, log files, and environment variables that the Batch service uses for task processing. 

You can create a pool directly as part of a [work item workflow](#BKMK_Worflow_workitems), or the Batch service will automatically create one when you specify the work items to be accomplished. Batch Apps will also automatically create a pool when you run a cloud-enabled Batch application.

![Pool and TVMs][TVM_pool]


**Figure 2. A pool of TVMs**

Attributes of a pool include:

* A [size](http://msdn.microsoft.com/library/azure/dn197896.aspx) for the TVMs 
* An operating system family and version that runs on the TVMs
* The maximum number of TVMs
* A scaling policy for the pool - a formula based on current work load and resource usage statistics that dynamically adjusts the number of TVMs that process tasks
* Whether firewall ports are enabled on the TVMs to allow intrapool communication
* A certificate that is installed on the TVMs - for example, to authenticate access to a storage account
* A start task for TVMs

>[WACOM.NOTE]Currently a TVM can only run an operating system in the Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2 SP1 OS family.

A pool can only be used by the Batch account in which it was created. A Batch account can have more than one pool.

When creating a pool, you can optionally associate an Azure storage account. The Batch service allocates TVMs from the data centers with better network connectivity and bandwidth capacity to the specified storage account. This enables workloads to access data more effectively.

Every TVM that is added to a pool is assigned a unique name and an associated IP address. When a TVM is removed from a pool, it loses the changes that were made to the operating system, its local files, its name, and its IP address. When a TVM leaves a pool, its lifetime is over.


<h3 id="BKMK_Workitem">Work items, jobs, and tasks</h3>

A **work item** specifies how an application will run on TVMs in a pool. A **job** is a running instance of a work item and consists of a collection of **tasks**.  

![Work item, job, and tasks][job_task]

**Figure 3. A work item, job, and tasks**

In a [work item workflow](#BKMK_Worflow_workitems) you have fine-grained control over the work items, jobs, and tasks that the Batch service runs. If you use Batch Apps, the Batch service automatically configures many of the details when you cloud-enable the application. For example, Batch Apps transparently creates work items and it includes a job splitter component that divides a job into component tasks automatically. 


A work item gets associated with a new or an existing pool and includes the following:

1.	The name of a program that runs on the TVMs
2.	Command-line parameters for the program
3.	The priority of the computation
4.	The schedule of the computation, including whether the computation should reoccur

The Batch service instantiates a job when the work item is scheduled to run. The job uses TVMs from the pool that is associated with the work item.

A task is a unit of computation that runs on a TVM.  A task uses the following resources:

* The program specified in the work item.
* Resource files that contain the data to be processed. These files are automatically copied to the TVM from blob storage. 
* Environment settings that are needed by the program. 
* Settings that control computation, such as the maximum time the task is allowed to run, the number of times that a task is retried if it fails, and the retention time for files in the working directory.

In addition to tasks that you define to perform computation on a TVM, the Batch service provides the following special tasks:

* **Start task** - A task that runs every time a TVM starts for as long as it remains in the pool. For example, a start task can install software or start background processes.

* **Job manager task** - A task that starts before all other tasks, if you use the Batch service's job manager. The job manager task provides a number of benefits - for example, you can tie its termination to the termination of all tasks in the job.

* **Merge task** - If you cloud-enable an application with Batch Apps, you can specify this final task for every job to assemble the results of individual tasks into the final job results. For example, in a movie rendering job, the merge task might assemble the rendered frames into a movie or zip all the rendered frames into a single file.   

<h3 id="BKMK_Files">Files and directories</h3>

A file is a piece of data used as an input to a job, or to each job task. A job can have no, one, or many input files associated with it. The same file can be used in multiple jobs as well, e.g., for a movie rendering job, the files might be commonly used textures and models. For a data analysis job, the files might be a set of observations or measurements.

Each task has a working directory under which it creates directories and files needed for storing the program that is run by a task, the data that is processed by a task, and the output of the processing performed by a task. These directories and files are then available for use by other tasks while a job runs. All tasks, files, and directories on a TVM are owned by a single user account.
 

<h2 id="BKMK_Workflow_workitems">Work items workflow</h2>
You use the following basic workflow to distribute computations to a pool of TVMs using the Batch API:

![Work items workflow][work_item_workflow]

**Figure 4. Workflow to distribute work items to pooled VMs**

1.	Upload input files (such as source data or images) that you want to use in your scenario to an Azure storage account. These files must be in the storage account so that the Batch service can access them. The Batch service loads them onto a TVM when the task runs.
2.	Upload the dependent binary files to the storage account. The binary files include the program that is run by the task and the dependent assemblies. These files must also be accessed from storage and are loaded onto the TVM.
3.	Create a pool of TVMs, and associate the pool with the storage account. You specify the size of the TVMs in the pool, the OS they run, and other properties at this time. When a task runs, it is assigned a TVM from this pool.
4.	Create a work item. A job is automatically created when you create a work item. A work item enables you to manage a job of tasks.
5.	Add tasks to the work item. Each task uses the program that you uploaded to process information from a file that you uploaded.
6.	Monitor the results of the output.

<h2 id="BKMK_Workflow_cloudapps">Application integration workflow </h2>
You use the following basic workflow to cloud-enable an application using the Batch Apps API:

1.	Prepare a zip file of your existing application executables – the same executables that would be run in a traditional server farm or cluster – and any support files they need.
2.	Create a zip file of the cloud assemblies that will invoke and dispatch your workloads to the application. This contains two components that are available via the SDK:

	a. **Job splitter** – breaks a job down into tasks that can be processed independently. For example, in an animation scenario, the job splitter would take a movie job and divides it into individual frames.

	b. **Task processor** – invokes the application executable for a given task. For example, in an animation scenario, the task processor would invoke a rendering program to render the single frame specified by the task. 

3.	Upload the zip files prepared in the previous two steps, along with input files (such as source data or images) that you want to use in your scenario, to an Azure storage account. These files must be in the storage account so that the Batch service can access them.
4.	Provide a way to submit jobs to the enabled application service in Azure. This might be a plugin in your application UI, a web portal, or an unattended service as part of your execution pipeline. There are samples available with the SDK to demonstrate a few options.
5.	Monitor the results of the output, either by using the APIs or by using the Batch Apps portal.
	
<h2 id="BKMK_Resources">Additional resources</h2>

* [Get Started with the Azure Batch Libraries for .NET](http://azure.microsoft.com/en-us/documentation/batch-dotnet-get-started)
* [Azure Batch REST API Reference](http://msdn.microsoft.com/library/azure/dn831874.aspx)


[parallel]: ./media/batch-technical-overview/parallel.png
[TVM_pool]: ./media/batch-technical-overview/TVM_pool.png
[job_task]: ./media/batch-technical-overview/job_task.png
[account_portal]: ./media/batch-technical-overview/account_portal.png
[work_item_workflow]: ./media/batch-technical-overview/work_item_workflow.png
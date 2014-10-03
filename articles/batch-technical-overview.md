<properties linkid="batch-technical-overview" urlDisplayName="" pageTitle="Azure Batch technical overview" metaKeywords="" description="Learn about the concept, workflows, and scenarios of the Azure Batch service" metaCanonical="" services="Batch" documentationCenter="" title="Azure Batch technical overview" authors="danlep" solutions="" manager="timlt" editor="tysonn" />

<tags ms.service="batch" ms.workload="big-compute" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/27/2014" ms.author="danlep" />


#Azure Batch technical overview
This article provides a technical overview of the Azure Batch service. Developers can work with the Batch SDKs to run and develop appliations that interact with the service, but the information in this article may also interest ITPros and business decision-makers.

>[WACOM.NOTE]Azure Batch is in Preview. To use Batch, you need an Azure account, and you need to enable Batch preview on your subscription. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Create an Azure account](http://www.windowsazure.com/en-us/develop/php/tutorials/create-a-windows-azure-account/). [TODO: Do we have a standard preview blurb?]

Azure Batch is a platform service that makes it easy to run large-scale parallel and high performance computing (HPC) applications in the cloud. By using the Batch service, you can focus on the specific application and not have to worry about the complexity of job scheduling and resource management in the underlying platform. The Batch SDK provides two programming models to help you work with the Batch service:

1. **Work item management** - Instead of having to set up a compute cluster or write code to queue, schedule, allocate, and manage compute resources to run your jobs, you can use the Batch SDK to automate the scheduling of compute jobs and to scale compute resources in a pool mof Azure VMs up and down to run them. The Batch service also optimizes the location of these jobs and their access to any data they process. 

2. **App integration** - You can also use the Batch Apps SDK to to integrate client applications with Batch. This builds on the core job scheduling and resource management features of Batch, helping you wrap existing binaries and executables and publish them to run workloads on Azure across multiple VMs. The SDK also allows you to model and partition the data so that the parallel tasks run with equal computational complexity and complete at roughly the same time. Included is a REST-based API and the Batch Apps portal, which can be used from the Azure Management Portal and provides visibility into the submitted jobs or workloads. 

This article gives you an overview of:
 
* [Scenarios for Batch](#BKMK_Scenarios)
* [Batch concepts](#BKMK_Entities)
* [Batch workflows](#BKMK_Workflows)
* [Additional resources](#BKMK_Resources)

<h2 id="BKMK_Scenarios">Scenarios for Batch</h2>

 Batch handles large-scale business, science, and engineering applications that need a large amount of compute resources, either on a schedule or on-demand. The applications run as compute jobs, usually divided into discrete tasks, with a defined beginning and end, sometimes taking many hours or days to complete. Applications include traditional HPC applications such as fluid dynamics simulations as well as a wide range of commercially available and custom applications in fields including financial services, engineering design, oil and gas exploration, life sciences research, and digital content creation. 
 
The Batch SDK works well with intrinsically parallel (sometimes called "embarrassingly parallel" applications or workloads, so named because the problems they solve lend themselves to running as parallel tasks on multiple computers. 

![Parallel tasks][parallel]

Characteristics of intrinsically parallel applications include:

* Individual compute resources run application tasks independently, on different sets of input data
* Additional compute resources enable the application to scale readily and decrease computation time
* The application consists of separate executable files running on each computer

Specific examples include:

* Financial risk modeling
* Image rendering and image processing
* Media encoding and transcoding
* Genetic sequence analysis
* Software testing

Batch Apps is also capable of handling more complicated non-acyclic parallel workloads, such as iterative and irregular parallelism. [TODO: Ask Karan, What does this mean?] 

<h2 id="BKMK_Entities">Batch concepts</h2>

The following are key concepts for using use the Batch service. The Batch REST APIs provide operations for working with these entities.

* [Account](#BKMK_Account)
* [Task virtual machine](#BKMK_TVM)
* [Pool](#BKMK_Pool)
* [Work item](#BKMK_Workitem)
* [Job](#BKMK_Job)
* [Task](#BKMK_Task)
[TO DO: Add art showing relationships?]

<h3 id="BKMK_Account">Account</h3>
You need a Batch account to interact with the Batch service and to manage Batch resources for your application. A Batch account is a uniquely identified entity within the Batch service. When you perform operations with the Batch service, you need to authenticate your requests with the name of the account and an access key for the account. 

You can create a Batch account and manage access keys for the account in the [Azure Management Portal](https://manage.windowsazure.com).

[TO DO: Add a short proc to create a Batch account]

<h3 id="BKMK_TVM">Task virtual machine</h3>

A task virtual machine (TVM) is an Azure VM that the Batch service dedicates to running a specific workload for your application. Unlike a typical Azure VM, you do not provision or manage a TVM directly; instead, the Batch service creates and manages TVMs when you add or modify a [pool](#BKMK_Pool). The size of a TVM determines the number of CPU cores, the memory capacity, and the local file system size that is allocated to the TVM. A TVM can be one of (the following sizes as described in [Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx) [TODO: List sizes] 

The types of programs that a TVM can run include executable files (.exe), command files (.cmd), batch files (.bat), and script files. 

A TVM also has some attributes that are specific to the Batch service:

* File system folders that are both task-specific and shared
* Stdout.txt and stderr.txt files that are written to a task-specific folder
* Environment variables for task processing
* Firewall settings that are configured to control access


<h3 id="BKMK_Pool">Pool</h3>
A pool is a collection of [TVMs](#BKMK_TVM) on which your application runs. The pool can be created by you, or the Batch service automatically creates the pool when you specify the work to be accomplished. You can create and manage a pool that meets the needs of your application. A pool can only be used by the Batch account in which it was created. A Batch account can have more than one pool.

Every TVM that is added to a pool is assigned a unique name and an associated IP address. When a TVM is removed from a pool, it loses the changes that were made to the operating system, all of its local files, its name, and its IP address. When a TVM leaves a pool, its lifetime is over.

You can configure a pool to allow communication between TVMs within it. If intra-pool communication is requested for a pool, the Batch service enables ports greater than 1100 on each TVM in the pool. Each TVM in the pool is configured to allow and restrict incoming connections to just this port range and only from other TVMs in the pool. If your application does not require communication between TVMs, the Batch service can potentially allocate a large number of TVMs across different clusters or data centers to the pool to enable more parallel processing.

When you create a pool, you can specify the following attributes:

* A size for all the TVMs in the pool
* An operating system family and version that runs on all the TVMs
* The target number of TVMs that should be available for the pool
* The [scaling](#BKMK_Scaling) policy for the pool
* The communication status of the TVMs in the pool
* The start task for TVMs in the pool

>[WACOM.NOTE]Currently a TVM can only run an operating system in the Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2 SP1 OS family.

When you create a pool, you can optionally specify an Azure storage account with which the pool should be associated. The Batch service allocates TVMs from the data centers with better network connectivity and bandwidth capacity to the specified storage account. This enables workloads to access data more effectively.

<h3 id="BKMK_Workitem">Work item</h3>
A work item specifies how computation is performed on TVMs in a pool. A work item includes the following configuration items:

1.	The name of the program that runs on the TVM
2.	The command-line parameters for the program
3.	The priority of the computation
4.	The schedule of the computation, which includes defining whether the computation should reoccur

A work item is always assigned to a pool, and the pool can already exist or it can be automatically created when you create the work item.

<h3 id="Job">Job</h3>
A job is a running instance of a work item and consists of a collection of [tasks](#BKMK_Task). The Batch service instantiates a job based on the configuration of the work item. The job uses TVMs from the pool that is associated with the work item.

<h3 id="BKMK_Task">Task</h3>
A task is a unit of computation that is associated with a job and runs on a TVM. A task uses the following resources:

* The program that was specified in the work item.
* The resource files that contain the data to be processed. These files are automatically copied to the TVM from blob storage. For more information, see [Files and directories](#BKMK_Files).
* The environment settings that are needed by the program. For more information, see [Environment settings for tasks](#BKMK_Envt).
* The constraints in which the computation should occur. For example, the maximum time in which the task is allowed to run, the maximum number of times that a task should be tried again if it fails to run, and the maximum time that files in the working directory are retained.

In addition to tasks that you can define to perform computation on a TVM, you can use the following special tasks provided by the Batch service:

* **Start task** - The start task runs every time a TVM starts for as long as it remains in the pool. Installing software and starting background processes are some of the actions that a start task can perform.

* **Job manager task** - A job manager task starts before all other tasks. The job manager task provides the following benefits:
	* It is automatically created by the Batch service when the job is created.
	* It is scheduled before other tasks in the job.
	* Its associated TVM is the last to be removed from a pool when the pool is being downsized.
	* It is given the highest priority when it needs to be restarted. If an idle TVM is not available, the Batch service may terminate one of the running tasks in the pool to make room for it to run.
	* Its termination can be tied to the termination of all tasks in the job.
	
	A job manager task in a job does not have priority over tasks in other jobs. Across jobs, only job level priorities are observed. 

<h2 id="BKMK_Workflows">Work items workflow</h2>
You use the following basic workflow to schedule work item computations with the Batch service. [TO DO: Add art?]:

1.	Upload any input files (such as source data or images) that you want to use in your computational scenario to an Azure storage account. These files must be in the storage account so that the Batch service can access them. The Batch service loads them onto a TVM when the task runs.
2.	Upload the dependent binary files to the storage account. The binary files include the program that is run by the task and the dependent assemblies. These files must also be accessed from storage and are loaded onto the TVM.
3.	Create a pool of TVMs, and associate the pool with the storage account. You specify the size of the TVMs in the pool, the OS they run, and other properties at this time. When a task runs, it is assigned a TVM from this pool.
4.	Create a work item. A job is automatically created when you create a work item. A workitem enables you to manage a job of tasks.
5.	Add tasks to the work item. Each task uses the program that you uploaded to process information from a file that you uploaded.
6.	Monitor the results of the output.

<h3 id="BKMK_Files">Files and directories</h3>

Each task has a working directory under which it creates directories and files needed for storing the program that is run by a task, the data that is processed by a task, and the output of the processing performed by a task. These directories and files are then available for use by other tasks while a job ru. All tasks, files, and directories on a TVM are owned by a single user account.
n
The Batch service exposes a portion of the file system on a TVM as the root directory. The root directory of the TVM is available to a task through the WATASK\_TVM\_ROOT\_DIR environment variable. For more information about using environment variables, see[Environment settings for tasks](#KMK_Environment).

The root directory contains the following sub-directories:

* **Tasks** – This location is where all of the files are stored that belong to tasks that run on the TVM. For each task, the Batch service creates a working directory with the unique path in the form of %WATASK\_TVM\_ROOT\_DIR%/tasks/workitemName/jobName/taskName/. This directory provides Read/Write access to the task. The task can create, read, update, and delete files under this directory, and this directory is retained based on the RetentionTime constraint specified for the task.

* **Shared** – This location is a shared directory for all of the tasks under the account. On the TVM, the shared directory is %WATASK\_TVM\_ROOT\_DIR%/shared. This directory provides Read/Write access to the task. The task can create, read, update, and delete files under this directory.

* **Start** – This location is used by a start task as its working directory. All of the files that are downloaded by the Batch service to launch the start task are also stored under this directory. On the TVM, the start directory is at %WATASK\_TVM\_ROOT\_DIR%/start. The task can create, read, update, and delete files under this directory, and this directory can be used by start tasks to configure the operating system.

When a TVM is removed from the pool, all of the files that are stored on the TVM are removed.

<h3 id="BKMK_Scaling">Scaling applications</h3>

Your application can easily be automatically scaled up or down to accommodate the computation that you need. You can dynamically adjust the number of TVMs in a pool according to current work load and resource usage statistics. You can also optimize the overall cost of running your application by configuring it to be automatically scaled. You can specify the scaling settings for a pool when it is created and you can update the configuration at any time.

You specify automatic scaling of an application by using a set of scaling formulas. The formulas determine the number of TVMs that are in the pool for the next scaling interval. For example, you might need to submit a large number of tasks to be scheduled on a pool. You can assign a scaling formula to the pool that specifies the size of the pool based on the current number of pending tasks and the completion rate of the tasks. The Batch service periodically evaluates the formula and resizes the pool based on workload.

A formula can be based on the following metrics:

* **Time metrics** – Based on statistics collected every five minutes in the specified number of hours.
* **Resource metrics** – Based on CPU usage, bandwidth usage, memory usage, and number of TVMs.
* **Task metrics** – Based on the status of tasks, such as Active, Pending, and Completed.

<h3 id="BKMK_Certs">Certificates for applications</h3>

You typically need to use certificates when you encrypt secret information. Certificates can be installed on TVMs. The encrypted secrets are passed to tasks in command-line parameters or embedded in one of the resources and installed certificates can be used to decrypt them. An example of the secret information is the key for a storage account.

To use certificates, you first need to add a certificate to a Batch account. You can then associate the certificate to a new or existing pool. When a certificate is associated with a pool, the Batch service installs the certificate on each TVM in the pool. The Batch service installs the appropriate certificates when the TVM starts up, before it launches any tasks, including start tasks and job manager tasks.

<h3 id="BKMK_Priority">Scheduling priority</h3>

When you create a work item, you can assign a priority to it. Each job under the work item is created with this priority. The Batch service uses the priority values of the job to determine the order of job scheduling within an account. The priority values can range from -1000 to 1000, with -1000 being the lowest priority and 1000 being the highest priority. You can update the priority of a job later if you need to.

Within the same account, higher priority jobs are scheduled before lower priority jobs. A job with a higher priority value in one account does not have scheduling precedence over another job with a lower priority value in a different account.

Different pools schedule jobs independently. Across different pools, it is not guaranteed that a higher priority job is scheduled first, if its associated pool is short of idle TVMs. Within the same pool, jobs with the same priority level have an equal chance of being scheduled.

<h3 id="Environment">Environment settings for tasks</h3>

You can specify environment settings that are used in the context of a task. Environment settings for a start task and tasks running under a job can be defined when starting or updating task.
 
For every task that is scheduled under a job, a specific set of system-defined variables are also set by the Batch service. The following table lists the environment variables that are set by the Batch service for all tasks.
<table border ="1">
<tr><th>Environment variable name</th><th>Description</th></tr>


<tr><td>WATASK_ ACCOUNT_NAME</td><td>name of the account to which the task belongs.

<tr><td>WATASK_WORKITEM_NAME</td><td>The name of the workitem to which the task belongs.</td></tr>
<tr><td>WATASK_JOB_NAME</td><td>The name of the job to which the task belongs./td></tr>
<tr><td>WATASK_TASK_NAME</td><td>The name of the current task./td></tr>
<tr><td>WATASK_POOL_NAME</td><td>The name of the pool on which the task is running./td></tr>
<tr><td>WATASK_TVM_NAME</td><td>The name of the TVM on which the task is running./td></tr>
<tr><td>WATASK_TVM_ROOT_DIR</td><td>The full path of the root directory on the TVM./td></tr>
<tr><td>WATASK_PORTRANGE_LOW
WATASK_PORTRANGE_HIGH</td><td>The port range (inclusive on both ends) that the task can use for communication when intra-pool communication is enabled./td></tr>
</table>
 
>[WACOM.NOTE]You cannot overwrite these system-defined variables. 

<h2 id="BKMK_Resources">Additional resources</h2>

* 


[parallel]: ./media/batch-technical-overview/parallel.png

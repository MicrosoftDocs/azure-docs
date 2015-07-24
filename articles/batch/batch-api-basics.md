<properties 
	pageTitle="API basics for Azure Batch" 
	description="Concepts to introduce developers to the Azure Batch APIs and Batch service" 
	services="batch" 
	documentationCenter=".net" 
	authors="yidingzhou" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="batch" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="big-compute" 
	ms.date="03/19/2015" 
	ms.author="yidingz"/>

<!--The next line, with one pound sign at the beginning, is the page title--> 
# API basics for Azure Batch

The Azure Batch service provides a job scheduling framework for scalable and distributed computation. The Batch service maintains a set of virtual machines that are located across different clusters and data centers in Azure. The Batch service accomplishes distributed computation by running one or more programs either on-demand or scheduled to run at a specific time on a specified collection of these VMs. The Batch service manages these VMs to run your computation tasks according to the resource requirements, specifications, and constraints provided by you.

By using the Batch service, you can eliminate the need to write code for queuing, scheduling, allocating, and managing compute resources. This enables you to focus on the specific application and not have to worry about the complexity of job scheduling and resource management in the underlying platform. This also enables the Batch service to optimize the location of these jobs as well as their access to the data they need to process.

The following are some of the scenarios that you can enable by using the Batch service:

- Computationally intensive parallel processing

- Daily cleanup of files

- Batch processing

## <a name="resource"></a> Resources of the Batch service

When you use the Batch service, you take advantage of the following resources:

- [Account](#account)

- [Task Virtual Machine](#taskvm)

- [Pool](#pool)

- [Workitem](#workitem)

- [Job](#job)

- [Task](#task)

	- [Start Task](#starttask)
	
	- [Job ManagerTask](#jobmanagertask)

### <a name="account"></a>Account

A Batch account is a uniquely identified entity within the Batch service. All processing is done through a Batch account. When you perform operations with the Batch service, you need the name of the account and the key for the account. To create a batch account, refer to Batch account section of [Azure Batch overview][].


### <a name="taskvm"></a>Task Virtual Machine

A task virtual machine (TVM) is an Azure VM that is dedicated to a specific workload for your application. The size of a TVM determines the number of CPU cores, the memory capacity, and the local file system size that is allocated to the TVM. A TVM can be a small, large, or extralarge virtual machine as described in [Virtual Machine and Cloud Service Sizes for Azure](http://msdn.microsoft.com/library/dn197896.aspx).

The types of programs that a TVM can run include executable files (.exe), command files (.cmd), batch files (.bat), and script files. A TVM also has the following attributes:

- File system folders that are both task-specific and shared. A folder structure and environment variables are created on each pool VM. The following folder structure is created with a “shared” folder for applications and data shared between tasks, plus a folder for each task.

![][1]

- Stdout.txt and stderr.txt files that are written to a task-specific folder

- Environment variables for processing

- Firewall settings that are configured to control access

>VM Access
>
>If access to a VM is required, for debugging for example, the RDP file can be obtained which can then be used to access the VM via remote desktop.


### <a name="pool"></a>Pool

A pool is a collection of TVMs on which your application runs. The pool can be created by you, or the Batch service automatically creates the pool when you specify the work to be accomplished. You can create and manage a pool that meets the needs of your application. A pool can only be used by the Batch account in which it was created. A Batch account can have more than one pool.

Azure Batch pools build on top of the core Azure compute platform; Batch pools provide large-scale allocation, application & data installation, data movement, health monitoring, and flexible scaling of VM’s.

Every TVM that is added to a pool is assigned a unique name and an associated IP address. When a TVM is removed from a pool, it loses the changes that were made to the operating system, all of its local files, its name, and its IP address. When a TVM leaves a pool, its lifetime is over.

You can configure a pool to allow communication between TVMs within it. If intra-pool communication is requested for a pool, the Batch service enables ports greater than 1100 on each TVM in the pool. Each TVM in the pool is configured to allow and restrict incoming connections to just this port range and only from other TVMs in the pool. If your application does not require communication between TVMs, the Batch service can potentially allocate a large number of TVMs across different clusters or data centers to the pool to enable more parallel processing.

When you create a pool, you can specify the following attributes:

- The **size of VMs** in the pool.
	- The appropriate VM size needs to be chosen, depending on the characteristics and requirements of the application or applications that are going to be used on the VM. Normally the VM size will be picked assuming one task will be run at once on the VM; for example, whether the application is multi threaded and how much memory it requires will determine the most suitable and cost-effective VM size.  It is possible to have multiple tasks assigned and multiple application instances being run in parallel, in which case a larger VM will usually be chosen – see below on “maximum tasks per VM”. 
	- All the VM’s in a pool have to be the same size. If different applications are to be run with different system requirements and/or with different load then separate pools should be created.
	- All cloud service VM sizes can be configured for a pool, except for A0.

- The operating system family and version that runs on the VMs.
	- As with worker roles, the OS Family and OS Version can be configured.
	- The OS Family also determines which versions of .NET are installed with the OS.
	- As with worker roles, for the OS Version it is recommended that “*” be used so that the VM’s are automatically upgraded and there is no work required to cater for new versions.  The main use case for picking a specific OS version is to ensure application compatibility is maintained, by allowing backward compatibility testing to be performed before allowing the version to be updated.  Once validated, the OS version for the pool can be updated and the new OS image installed – any running task will be interrupted and re-queued.

- The target number of VMs that should be available for the pool.

- The scaling policy for the pool. Besides number of VMs, you can also specify a auto-scaling formula for each pool. Batch service will execute the formula to adjust number of VM based on pool and workitem statistics.

- Scheduling configuration
	- The default configuration is for one task to be run at any time on a pool VM, but there are scenarios where it is beneficial to have more than one task be able to run at the same time on a VM.  One example is to increase VM utilization if an application has to wait for I/O; having more than one application execute will increase CPU utilization.  Another example is to reduce the number of VM’s in the pool; this could reduce the amount of data copies required for large reference data sets.  If an A1 would the correct size for the application, then an A4 could be chosen and the configuration set to run up to 8 tasks at once, each consuming a core.
	- The “max tasks per VM” configuration determines the maximum number of tasks that can be run in parallel.
	- A “fill policy” can also be specified which determines whether Batch fills VM’s first or whether tasks are spread out over all the VM’s.
 
- The communication status of the VMs in the pool.
 	- In a large proportion of scenarios tasks operate independently and do not need to communicate with other tasks, but there are some applications where tasks will communicate (e.g. applications using MPI).
	- There is configuration that controls whether the VM’s will be able to communicate, which is used to configure the underlying network infrastructure and impacts placement of the VM’s.

- The start task for TVMs in the pool.

When you create a pool, you can specify the storage account with which the pool should be associated. The Batch service allocates TVMs from the data centers with better network connectivity and bandwidth capacity to the specified storage account. This enabled workloads to access data more effectively.

### <a name="workitem"></a>Workitem

A workitem specifies how computation is performed on TVMs in a pool.

- A work item can have one or multiple jobs associated with it. An optional schedule can be specified for a work item in which case one job is created for each occurrence of the schedule. If no schedule is specified, for on-demand work, then a job is created immediately.
- The work item specifies the pool on which the work will be run.  The pool can be an existing, already created pool that is used by many work items, but a pool can alternatively be created for each job associated with the work item or for all jobs associated with the work item.
- An optional priority can be specified.  When a work item is submitted with a higher-priority than other work items still in progress, then the higher priority work item tasks get inserted into the queue ahead of the lower priority work item tasks.  Lower-priority tasks that are already running will not be pre-empted.
- Constraints can be specified which will be applied to the associated job or jobs.
	- A maximum wallclock time can be set for the jobs.  If the jobs runs for longer than the maximum wallclock time specified, then the job and all associated tasks will be ended.
	- Azure Batch can detect tasks that fail and retry the tasks.  The default maximum number of task retries can be specified as a constraint, including specifying that a task is always retried or never retried.  Retrying a tasks means that the task is re-queued and will be run again.
- Tasks to be executed for the work item job can be specified by the client in the same way that the work item has been created, but a Job Manager task can alternatively be specified. A job manager task uses the Batch API and contains the code to create the required tasks for a job with the task being run on one of the pool VM’s.  The job manager tasks is handled specifically by Batch – it is queued as soon as the job is created and is restarted if it fails for any reason.  A Job Manager is required for work items with an associated schedule as it is the only way to define the tasks before job is instantiated.

### <a name="job"></a>Job

A job is a running instance of a work item and consists of a collection of tasks. The Batch service instantiates a job based on the configuration of the workitem. The job uses TVMs from the pool that is associated with the workitem.

### <a name="task"></a>Task

A task is a unit of computation that is associated with a job and runs on a TVM. Tasks are assigned to a VM for execution or are queued until a VM becomes free. A task uses the following resources:

- The program that was specified in the workitem.

- The resource files that contain the data to be processed. These files are automatically copied to the TVM from blob storage. For more information, see Files and directories.

- The environment settings that are needed by the program. For more information, see Environment settings for tasks.

- The constraints in which the computation should occur. For example, the maximum time in which the task is allowed to run, the maximum number of times that a task should be tried again if it fails to run, and the maximum time that files in the working directory are retained.

In addition to tasks that you can define to perform computation on a TVM, you can use the following special tasks provided by the Batch service:

- [Start task](#starttask)

- [Job manager task](#jobmanagertask)

#### <a name="starttask"></a>Start task

You can configure the operating system of VMs in a pool by associating a start task with the pool. Installing software and starting background processes are some of the actions that a start task can perform. The start task runs every time a VM starts for as long as it remains in the pool.

As with any Batch task a list of files in Azure storage can be specified in addition to a command line that is executed by Batch.  Azure Batch will first copy the files from Azure Storage and then run the command line.
For a pool start task, the file list usually contains the applications files or package, but it could also include reference data that will be used by all tasks running on the pool VM’s.  The command line could perform any PowerShell script or robocopy, for example, to copy application files to the “shared” folder; it could also run an MSI.

Normally it is desirable for Batch to wait for the start task to complete and then consider the VM ready to be assigned tasks, but this is configurable.

If a start task fails for a pool VM, then the state of the VM is updated to reflect the failure and the VM will not be available for tasks to be assigned.  A start task can fail if there is an issue copying the files specified for the start task or the start task process returns non-zero.

The fact that all the information necessary to configure the VM’s and install the applications is declared means that increasing the number of VM’s in a pool is as simple as specifying the new required number; Batch has all the information required to configure the VM’s and get them ready to accept tasks.

A start task is defined by adding an JSON section to the request body for the Add Pool operation. The following example shows a basic definition of a start task:

	{
		“commandLine”:”mypoolsetup.exe”,
		“resourceFiles”:
		[
			{
				“blobSource”:”http://account.blob.core.windows.net/container/myapp1.exe?st=2013-08-09T08%3a49%3a37.0000000Z&se=2013-08-10T08%3a49%3a37.0000000Z&sr=c&sp=d&si=YWJjZGTVMZw%3d%3d&sig= %2bSzBm0wi8xECuGkKw97wnkSZ%2f62sxU%2b6Hq6a7qojIVE%3d”,
				“filePath”:”mypoolsetup.exe”
			},
			{
				“blobSource”:”http://account.blob.core.windows.net/container/myapp2.exe?st=2013-08-09T08%3a49%3a37.0000000Z&se=2013-08-10T08%3a49%3a37.0000000Z&sr=c&sp=d&si=YWJjZGTVMZw%3d%3d&sig= %2bSzBm0wi8xECuGkKw97wnkSZ%2f62sxU%2b6Hq6a7qojIVE%3d”,
				“filePath”:”myapp2.exe”
			}
		],
		“maxTaskRetryCount”:0
	}

A C# interface looks like this:

	ICloudPool pool = pm.CreatePool(poolName, targetDedicated: 3, vmSize: "small", osFamily: "3");
	pool.StartTask = new StartTask();
	pool.StartTask.CommandLine = "mypoolsetup.exe";
	pool.StartTask.ResourceFiles = new List<IResourceFile>();
	pool.StartTask.ResourceFiles.Add(new ResourceFile("http://account.blob.core.windows.net/container/myapp1.exe?st=2013-08-09T08%3a49%3a37.0000000Z&se=2013-08-10T08%3a49%3a37.0000000Z&sr=c&sp=d&si=YWJjZGTVMZw%3d%3d&sig= %2bSzBm0wi8xECuGkKw97wnkSZ%2f62sxU%2b6Hq6a7qojIVE%3d", "mypoolsetup.exe"));
	pool.Commit();


#### <a name="jobmanagertask"></a>Job manager task

A job manager task is started before all other tasks. The job manager task provides the following benefits:

- It is automatically created by the Batch service when the job is created.

- It is scheduled before other tasks in the job.

- Its associated TVM is the last to be removed from a pool when the pool is being downsized.

- It is given the highest priority when it needs to be restarted. If an idle TVM is not available, the Batch service may terminate one of the running tasks in the pool to make room for it to run.

- Its termination can be tied to the termination of all tasks in the job.

A job manager task in a job does not have priority over tasks in other jobs. Across jobs, only job level priorities are observed. A job manager task is defined by adding an XML section to the request body for the Add Workitem operation. The following example shows a basic definition of a job manager task:

	{
		“name”:”jmTask”,
		“commandLine”:”myapp1.exe”,
		“resourceFiles”:
		[
			{
				“blobSource”:”http://account.blob.core.windows.net/container/myapp1.exe?st=2013-08-09T08%3a49%3a37.0000000Z&se=2013-08-10T08%3a49%3a37.0000000Z&sr=c&sp=d&si=YWJjZGTVMZw%3d%3d&sig= %2bSzBm0wi8xECuGkKw97wnkSZ%2f62sxU%2b6Hq6a7qojIVE%3d”,
				“filePath”:”myapp1.exe”
			},
			{
				“blobSource”:”http://account.blob.core.windows.net/container/myapp2.exe?st=2013-08-09T08%3a49%3a37.0000000Z&se=2013-08-10T08%3a49%3a37.0000000Z&sr=c&sp=d&si=YWJjZGTVMZw%3d%3d&sig= %2bSzBm0wi8xECuGkKw97wnkSZ%2f62sxU%2b6Hq6a7qojIVE%3d”,
				“filePath”:”myapp2.exe”
			}
		],
		“taskConstraints”:
		{
			“maxWallClockTime”:”PT1H”,
			“maxTaskRetryCount”:0,
			“retentionTime”:”PT1H”
		},
		“killJobOnCompletion”:true,
		“runElevated”:false,
		“runExclusive”:true
	}




## <a name="workflow"></a>Workflow of the Batch service

You need a Batch account to use the Batch service and you use multiple resources of the service to schedule computation. You use the following basic workflow when you create a distributed computational scenario with the Batch service:

1.Upload the files that you want to use in your distributed computational scenario to an Azure storage account. These files must be in the storage account so that the Batch service can access them. The Batch service loads them onto a TVM when the task runs.

2.Upload the dependent binary files to the storage account. The binary files include the program that is run by the task and the dependent assemblies. These files must also be accessed from storage and are loaded onto the TVM.

3.Create a pool of TVMs. You can assign the size of the task virtual machine to use when the pool is created. When a task runs, it is assigned a TVM from this pool.

4.Create a workitem. A job is automatically created when you create a workitem. A workitem enables you to manage a job of tasks.

5.Add tasks to the workitem. Each task uses the program that you uploaded to process information from a file that you uploaded.

6.Monitor the results of the output.

## <a name="files"></a>Files and directories

Each task has a working directory under which it creates zero or more directories and files for storing the program that is run by a task, the data that is processed by a task, and the output of the processing performed by a task. These directories and files are then available for use by other tasks during the running of a job. All tasks, files, and directories on a TVM are owned by a single user account.

The Batch service exposes a portion of the file system on a TVM as the root directory. The root directory of the TVM is available to a task through the WATASK\_TVM\_ROOT\_DIR environment variable. For more information about using environment variables, see Environment settings for tasks.

The root directory contains the following sub-directories:

- **Tasks** – This location is where all of the files are stored that belong to tasks that run on the TVM. For each task, the Batch service creates a working directory with the unique path in the form of %WATASK\_TVM\_ROOT\_DIR%/tasks/workitemName/jobName/taskName/. This directory provides Read/Write access to the task. The task can create, read, update, and delete files under this directory, and this directory is retained based on the RetentionTime constraint specified for the task.

- **Shared** – This location is a shared directory for all of the tasks under the account. On the TVM, the shared directory is at %WATASK\_TVM\_ROOT\_DIR%/shared. This directory provides Read/Write access to the task. The task can create, read, update, and delete files under this directory.

- **Start** – This location is used by a start task as its working directory. All of the files that are downloaded by the Batch service to launch the start task are also stored under this directory. On the TVM, the start directory is at %WATASK\_TVM\_ROOT\_DIR%/start. The task can create, read, update, and delete files under this directory, and this directory can be used by start tasks to configure the operating system.

When a TVM is removed from the pool, all of the files that are stored on the TVM are removed.

## <a name="lifetime"></a>Pool and VM Lifetime

A fundamental design decision is when pools are created and how long VM’s are kept available. 

At one extreme a pool could be created for each job when the job is submitted and the VM’s removed as tasks finish execution.  This will maximize utilization as the VM’s are only allocated when absolutely needed and shutdown as soon as they become idle.  It does mean that the job must wait for the VM’s to be allocated, although it is important to note that tasks will be scheduled to VM’s as soon as they are individually available, allocated and the start task has completed; i.e. Batch does NOT wait until all VM’s in a pool are available as that would lead to poor utilization.

If having jobs start executing immediately is the priority then a pool should be created and VM’s available before the job is submitted.  The tasks can start immediately, but VM’s could be idle waiting for job tasks, depending on load.

One common pattern for when there is a variable amount of ongoing load is to have a pool to which multiple jobs are submitted, but scale up or down the number of VM’s according to load; this could be done reactively or pro-actively if load can be predicted.

## <a name="scaling"></a>Scaling applications

Your application can easily be automatically scaled up or down to accommodate the computation that you need. You can dynamically adjust the number of TVMs in a pool according to current work load and resource usage statistics. You can also optimize the overall cost of running your application by configuring it to be automatically scaled. You can specify the scaling settings for a pool when it is created and you can update the configuration at any time.

For a decrease in the number of VM’s, there could be tasks running on VM’s which need to be considered.  A de-allocation policy is specified which determines whether running tasks are stopped to remove the VM immediately or whether tasks are allowed to finish before the VM’s are removed.  Setting the target number of VM’s down to zero at the end of a job, but allowing running tasks to finish, will maximize utilization.

You specify automatic scaling of an application by using a set of scaling formulas. The formulas that can be used to determine the number of TVMs that are in the pool for the next scaling interval. For example, you need to submit a large number of tasks to be scheduled on a pool. You can assign a scaling formula to the pool that specifies the size of the pool based on the current number of pending tasks and the completion rate of the tasks. The Batch service periodically evaluates the formula and resizes the pool based on workload.

A formula can be based on the following metrics:

- **Time metrics** – Based on statistics collected every five minutes in the specified number of hours.

- **Resource metrics** – Based on CPU usage, bandwidth usage, memory usage, and number of TVMs.

- **Task metrics** – Based on the status of tasks, such as Active, Pending, and Completed.

For more information about automatically scaling an application, see Configure Autoscaling of Task Virtual Machines.

>Delete VM’s
>
>It is not often required, but it is possible to specify individual VM’s to remove from a pool.  If there’s a VM that is suspected of being less reliable it could be removed, for example.

## <a name="cert"></a>Certificates for applications

You typically need to use certificates when you encrypt secret information. Certificates can be installed on TVMs. The encrypted secrets are passed to tasks in command-line parameters or embedded in one of the resources and installed certificates can be used to decrypt them. An example of the secret information is the key for a storage account.

You use the Add Certificate operation to add a certificate to a Batch account. You can then associate the certificate to a new or existing pool. When a certificate is associated with a pool, the Batch service installs the certificate on each TVM in the pool. The Batch service installs the appropriate certificates when the TVM starts up, before it launches any tasks, which includes start tasks and job manager tasks.

## <a name="scheduling"></a>Scheduling Priority

When you create a workitem, you can assign a priority to it. Each job under the workitem is created with this priority. The Batch service uses the priority values of the job to determine the order of job scheduling within an account. The priority values can range from -1000 to 1000, with -1000 being the lowest priority and 1000 being the highest priority. You can update the priority of a job by using the UpdateJob operation.

Within the same account, higher priority jobs have scheduling precedence over lower priority jobs. A job with a higher priority value in one account does not have scheduling precedence over another job with a lower priority value in a different account.

Job scheduling on different pools are independent. Across different pools, it is not guaranteed that a higher priority job is scheduled first, if its associated pool is short of idle TVMs. On the same pool, jobs with the same priority level have an equal chance of being scheduled.

## <a name="environment"></a>Environment settings for tasks

You can specify environment settings that can be used in the context of a task. Environment settings for a start task and tasks running under a job are defined by adding an XML section to the request body of the Add Task or Update Task operations.

The following example shows the definition of an environment setting:

For every task that is scheduled under a job, a specific set of environment variables are set by the Batch service. The following table lists the environment variables that are set by the Batch service for all tasks.

<table>
  <tr>
   <th>Environment Variable Name
   </th>
   <th>
   Description
   </th>
  </tr>
 <tr>
  <td>
  WATASK_ ACCOUNT_NAME
  </td>
  <td>
  The name of the account to which the task belongs.
  </td>
 </tr>
 <tr>
  <td>
  WATASK_WORKITEM_NAME
  </td>
  <td >The name of the workitem to which the task belongs.
  </td>
 </tr>
 <tr>
  <td>
  WATASK_JOB_NAME
  </td>
  <td >The name of the job to which the task belongs.
  </td>
 </tr>
 <tr>
  <td>
  WATASK_TASK_NAME
  </td>
  <td >The name of the current task.
  </td>
 </tr>
 <tr>
  <td>
  WATASK_POOL_NAME
  </td>
  <td >The name of the pool on which the task is running.
  </td>
 </tr>
 <tr>
  <td>
  WATASK_TVM_NAME
  </td>
  <td >The name of the TVM on which the task is running.
  </td>
 </tr>
 <tr>
  <td>
  WATASK_TVM_ROOT_DIR
  </td>
  <td >The full path of the root directory on the TVM.
  </td>
 </tr>
 <tr>
  <td>
  WATASK_PORTRANGE_LOW
  WATASK_PORTRANGE_HIGH
</td>
<td>
  The port range (inclusive on both ends) that the task can use for communication when intra-pool communication is enabled.
</td>
</table>

**Note** 

You cannot overwrite these system-defined variables.

You can retrieve the value of environment settings by using the Get Task operation.

## <a name="errorhandling"></a>Error Handling

###Task Failure Handling
Task failures fall into the following categories:

- Scheduling Failures:
	- If files are specified for the task, then the copy of one or more of the files could fail.  This could be because the files have moved, the storage account is no longer available, etc.
	- A “scheduling error” is set for the task in this case.
- Application Failures:
	- The task process specified by the command line can also fail.  The process is deemed to have failed when a non-zero exit code is returned.
	- For application failures it is possible to configure Batch to automatically retry the task up to a specified number of times. 
- Constraint Failures:
	- A constraint can be specified for the maximum amount of time a job or task can run for.  The can be useful to terminate a task that has hung.
	- When the maximum amount of time has been exceeded then the task is marked as completed but the exit code will marked as `0xC000013A` and schedulingError field will be marked as `{ category:“ServerError”, code=“TaskEnded”}`.

###Debugging Application Failures

An application may produce diagnostics which can be used to troubleshoot issues. Often applications will write information to stdout and stderr files or output to custom files. In these cases an API is provided to get files, by specifying either the task or VM.

It is also possible to login into pool VM’s. An API returns the RDP file for a VM, which can then be used to login to the VM.

###Catering for Task Failures and Issues

Tasks can fail or be interrupted for a few reasons.  The task application itself may fail, the VM on which the task is running gets rebooted, or the VM is removed by a pool resize with the de-allocation policy set to remove the VM immediately without waiting for the task to finish.  In all cases the task can be automatically re-queued by Batch and execute on another VM.

It is also possible for an intermittent issue to cause a task to hang or take too long to execute.  The maximum execution time can be set for a task and if exceeded Batch will interrupt the task application.  Currently, automatic re-queuing is not possible for this case, but the case can be detected by the client which can submit a new task.

###Catering for “Bad” VM’s

Each VM in a pool is given a unique name and the VM on which a task runs included in the task meta-data.  In the case where there is a VM that for some reason is causing tasks to fail, then this can be determined by the client and the suspect VM deleted from the pool. If a task was running on the VM that was deleted, then it will be automatically re-queued and executed on another VM.


<!--Image references-->
[1]: ./media/batch-api-basics/batch-api-basics-01.png

[Azure Batch overview]: batch-technical-overview.md
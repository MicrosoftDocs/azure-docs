<properties
	pageTitle="Azure Batch technical overview | Microsoft Azure"
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
	ms.topic="get-started-article"
	ms.date="07/13/2015"
	ms.author="danlep"/>


# Azure Batch technical overview
Azure Batch helps you run large-scale parallel and high performance computing (HPC) applications efficiently in the cloud. It's a platform service that provides job scheduling and autoscaling of a managed collection of virtual machines (VMs) to run the jobs. By using the Batch service, you can configure batch workloads to run in Azure on demand or on a schedule, and not worry about the complexity of configuring and managing an HPC cluster, VMs, or a job scheduler.

>[AZURE.NOTE] To use Batch, you need an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Create an Azure account](http://azure.microsoft.com/develop/php/tutorials/create-a-windows-azure-account/).


## Use cases

Batch uses the elasticity and scale of the cloud to help you with *batch processing* or *batch computing* - running a large volume of similar tasks to get some desired result. A command line program or script takes a set of data files as input, processes the data in a series of tasks, and produces a set of output files. The output files might be the final result or an intermediate step in a larger workflow.

Batch computing is a common pattern for organizations that process, transform, and analyze large amounts of data, either on a schedule or on-demand. It includes end-of-cycle processing such as a bank’s daily risk reporting or a payroll that must be done on schedule. It also includes large-scale business, science, and engineering applications that typically need the tools and resources of a compute cluster or grid. Applications include traditional HPC applications such as fluid dynamics simulations as well as specialized workloads in fields ranging from digital content creation to financial services to life sciences research.

Batch works well with intrinsically parallel (sometimes called "embarrassingly parallel") applications or workloads, which lend themselves to running as parallel tasks on multiple computers, such as the compute VMs managed by the Batch service.

![Parallel tasks][parallel]

**Figure 1. Parallel tasks running on multiple computers**

Examples include:

* Financial risk modeling
* Image rendering and image processing
* Media encoding and transcoding
* Genetic sequence analysis
* Software testing

You can also use Batch to perform parallel calculations with a reduce step at the end, and other more complicated parallel workloads.

>[AZURE.NOTE]At this time you can only run Windows Server workloads on Batch. Additionally, Batch does not currently support message passing interface (MPI) applications.

## Developer scenarios

Batch supports different developer scenarios to help you configure and run your large-scale parallel workloads with the Batch service. These scenarios use APIs to create and manage pools of VMs (compute nodes) and schedule the jobs and tasks that run on them. See [API basics for Azure Batch](batch-api-basics.md) for more about the Batch concepts.

Typical Batch developer scenarios are in the following sections.

### Scale out a parallel workload

Use the Batch API to scale out intrinsically parallel work such as image rendering on a pool of up to thousands of compute cores. Instead of setting up a compute cluster or write code to queue and schedule your jobs and move the necessary input and output data, you automate the scheduling of large compute jobs and scale a pool of compute VMs up and down to run them. You can write client apps or front-ends to run jobs and tasks on demand, on a schedule, or as part of a larger workflow managed by tools such as [Azure Data Factory](https://azure.microsoft.com/documentation/services/data-factory/).

Figure 2 shows a simplified workflow to submit an application to a Batch pool where it's distributed for processing.

![Workitems workflow][work_item_workflow]

**Figure 2. Scale out a parallel workload on Batch**

1.	Upload input files (such as source data or images) required for a job to an Azure storage account. These files must be in the storage account so that the Batch service can access them. The Batch service loads files onto compute nodes when the tasks run.
2.	Upload the dependent binary files to the storage account. The binary files include the program that is run by the task and the dependent assemblies. These files must also be accessed from storage and are loaded onto the compute nodes.
3.	Create a pool of compute nodes, specifying properties such as their VM size and the OS they run. You can also define how the number of nodes in the pool scales up or down in response to the workload. When a task runs, it is assigned a node from this pool.
4.	Define a job to run on the pool.
5.	Add tasks to the job. Each task uses the program that you uploaded to process information from a file you uploaded.
6.	Run the application and monitor the results of the output.


### Cloud-enable a compute-intensive app

You can use the Preview Batch Apps API to wrap an existing application so that it runs as a service on a pool of compute nodes that Batch manages in the background. The application might be one that runs today on client workstations or a compute cluster. You can develop the service to let users offload peak work to the cloud, or run their work entirely in the cloud. The Batch Apps framework handles the movement of input and output files, the splitting of jobs into tasks, job and task processing, and data persistence.

>[AZURE.IMPORTANT] Azure only offers the Batch Apps API in Preview form. You should only develop with it for test or proof-of-concept projects. Key Batch Apps capabilities are integrated into the Batch API in future service releases.

Figure 3 shows a basic workflow to publish an application by using the Batch Apps API and then allow a user to submit jobs to the application.

![Application publishing workflow][app_pub_workflow]

**Figure 3. Workflow to publish and run an application with Batch Apps**

1.	Prepare an **application image** - a zip file of your existing application executables and any support files they need. These might be the same executables you run in a traditional server farm or cluster.
2.	Create a zip file of the **cloud assembly** that invokes and dispatches your workloads to the Batch service. This contains two components:

	a. **Job splitter** - Breaks a job down into tasks that can be processed independently. For example, in an animation scenario, the job splitter would take a movie rendering job and divide it into individual frames.

	b. **Task processor** - Invokes the application executable for a given task. For example, in an animation scenario, the task processor would invoke a rendering program to render the single frame specified by the task.

3.	Use the Batch Apps API or developer tools to upload the zip files prepared in the previous two steps to an Azure storage account. These files must be in the storage account so that the Batch service can access them. This is typically done once per application, by a service administrator.
4.	Provide a way to submit jobs to the enabled application service in Azure. This might be a plugin in your application UI, a web portal, or an unattended service as part of your backend system.

	To run a job:

	a. Upload the input files (such as source data or images) specific to the user's job. These files must be in the storage account so that the Batch service can access them.

	b. Submit a job with the required parameters and list of files.

	c. Monitor job progress by using the APIs or the Batch Apps portal.



## <a id="BKMK_Account">Batch account</a>
You need to create one or more unique **Batch accounts** to use and develop with the Batch service. All requests that you make to the Batch service must be authenticated using the name of an account and its access key.

You can create a Batch account and manage access keys for the account in the Azure Preview portal or with the [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md).

To create a Batch account in the portal:

1. Sign in to the [Azure Preview portal](https://portal.azure.com).

2. Click **New** > **Compute** > **Marketplace** > **Everything**, and then enter *Batch* in the search box.

	![Batch in the Marketplace][marketplace_portal]

3. Click **Batch Service** in the search results, and then click **Create**.

4. In the **New Batch Account** blade, enter the following information:

	a. In **Account Name**, enter a unique name to use in the Batch account URL.

	>[AZURE.NOTE] The Batch account name must be unique to Azure, contain between 3 and 24 characters, and use lowercase letters and numbers only.

	b. Click **Resource group** to select an existing resource group for the account, or create a new one.

	c. If you have more than one subscription, click **Subscription** to select an available subscription where the account will be created.

	d. In **Location**, select an Azure region in which Batch is available.

	![Create a Batch account][account_portal]

5. Click **Create** to complete the account creation.


After the account is created, you can find it in the portal to manage access keys and other settings. For example, click the key icon to manage the access keys.

![Batch account keys][account_keys]

## Additional resources

* [Get Started with the Azure Batch Library for .NET](batch-dotnet-get-started.md)
* [Azure Batch development libraries and tools](batch-development-libraries-tools.md)
* [Azure Batch REST API Reference](http://go.microsoft.com/fwlink/p/?LinkId=517803)
* [Azure Batch Apps REST API Reference](http://go.microsoft.com/fwlink/p/?LinkId=517804)

[parallel]: ./media/batch-technical-overview/parallel.png
[marketplace_portal]: ./media/batch-technical-overview/marketplace_batch.PNG
[account_portal]: ./media/batch-technical-overview/batch_acct_portal.png
[account_keys]: ./media/batch-technical-overview/account_keys.PNG
[work_item_workflow]: ./media/batch-technical-overview/work_item_workflow.png
[app_pub_workflow]: ./media/batch-technical-overview/app_pub_workflow.png

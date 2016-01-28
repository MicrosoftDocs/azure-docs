<properties
	pageTitle="Run MPI applications in Azure Batch with multi-instance tasks | Microsoft Azure"
	description="Learn how to execute Message Passing Interface (MPI) applications using the multi-instance task type in Azure Batch."
	services="batch"
	documentationCenter=".net"
	authors="mmacy"
	manager="timlt"
	editor="" />

<tags
	ms.service="batch"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="big-compute"
	ms.date="01/22/2016"
	ms.author="marsma" />

# Execute Message Passing Interface (MPI) applications in Azure Batch with multi-instance tasks

A multi-instance task in Azure Batch is a [task][net_task] that is configured to run on more than one compute node. Multi-instance tasks enable high performance computing scenarios like Message Passing Interface (MPI) programs that require a group of compute nodes that are allocated together to process a workload.

In this article, you will learn how to execute an MPI application built with Microsoft's MPI implementation for Windows, [MS-MPI][msmpi_msdn], and the [Batch .NET][api_net] library.

## Multi-instance task overview

Normally, each task runs on a single compute node, but with multi-instance tasks, you can run a task on multiple compute nodes simultaneously.

You create a multi-instance task in Batch by specifying multi-instance settings for a normal [CloudTask][net_task]. These settings include the number of compute nodes to execute the task, a command line for the main task (the "application command"), a coordination command, and a list of common resource files for each task.

When you submit a task with multi-instance settings to a job, the Batch service performs the following:

1. Automatically creates one primary task and enough subtasks that together will execute on the total number of nodes you specified. Batch then schedules these tasks for execution on the nodes, which first download the common resource files you specified.
2. After the common resource files have been downloaded, the coordination command is executed by the primary and subtasks. This coordination command typically launches a background service (such as [MS-MPI][msmpi_msdn]'s `smpd.exe`) and verifies that the nodes are ready to process inter-node messages.
3. When the coordination command has been successfully completed by the primary and all subtasks, the task's command line (the "application command") is executed only by the primary task, which typically initiates a custom MPI-enabled application that processes your workload on the nodes. For example, in a Windows MPI scenario, you would typically execute your MPI-enabled application with [MS-MPI][msmpi_msdn]'s `mpiexec.exe` using the application command.

## Next steps

- Next step #1
- Next step #2
- Next step #3

[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
[batch_explorer]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer
[github_samples]: https://github.com/Azure/azure-batch-samples
[msmpi_msdn]: https://msdn.microsoft.com/library/bb524831.aspx
[msmpi_sdk]: http://go.microsoft.com/FWLink/p/?LinkID=389556
[msmpi_howto]: http://blogs.technet.com/b/windowshpc/archive/2015/02/02/how-to-compile-and-run-a-simple-ms-mpi-program.aspx

[net_multiinstance_class]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.aspx
[net_multiinstance_prop]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.multiinstancesettings.aspx
[net_multiinsance_commonresfiles]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.commonresourcefiles.aspx
[net_multiinstance_coordcmdline]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.coordinationcommandline.aspx
[net_multiinstance_numinstances]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.numberofinstances.aspx
[net_pool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_pool_create]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createpool.aspx
[net_pool_starttask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.starttask.aspx
[net_task]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_resourcefile]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.resourcefile.aspx

[rest_multiinstance]: https://msdn.microsoft.com/library/azure/mt637905.aspx

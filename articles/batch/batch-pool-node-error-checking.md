---
title: Pool and node errors
description: Learn about background operations, errors to check for, and how to avoid errors when you create Azure Batch pools and nodes.
ms.date: 04/11/2023
ms.topic: how-to
---

# Azure Batch pool and node errors

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

Some Azure Batch pool creation and management operations happen immediately. Detecting failures for these operations is straightforward, because errors usually return immediately from the API, command line, or user interface. However, some operations are asynchronous, run in the background, and take several minutes to complete. This article describes ways to detect and avoid failures that can occur in the background operations for pools and nodes.

Make sure to set your applications to implement comprehensive error checking, especially for asynchronous operations. Comprehensive error checking can help you promptly identify and diagnose issues.

## Pool errors

Pool errors might be related to resize timeout or failure, automatic scaling failure, or pool deletion failure.

### Resize timeout or failure

When you create a new pool or resize an existing pool, you specify the target number of nodes. The create or resize operation completes immediately, but the actual allocation of new nodes or removal of existing nodes might take several minutes. You can specify the resize timeout in the [Pool - Add](/rest/api/batchservice/pool/add) or [Pool - Resize](/rest/api/batchservice/pool/resize) APIs. If Batch can't allocate the target number of nodes during the resize timeout period, the pool goes into a steady state, and reports resize errors.

The [resizeError](/rest/api/batchservice/pool/get#resizeerror) property lists the errors that occurred for the most recent evaluation.

Common causes for resize errors include:

- **Resize timeout too short.** Usually, the default timeout of 15 minutes is long enough to allocate or remove pool nodes. If you're allocating a large number of nodes, such as more than 1,000 nodes from an Azure Marketplace image, or more than 300 nodes from a custom virtual machine (VM) image, you can set the resize timeout to 30 minutes.

- **Insufficient core quota.** A Batch account is limited in the number of cores it can allocate across all pools, and stops allocating nodes once it reaches that quota. You can increase the core quota so Batch can allocate more nodes. For more information, see [Batch service quotas and limits](batch-quota-limit.md).

- **Insufficient subnet IPs when a pool is in a virtual network**. A virtual network subnet must have enough IP addresses to allocate to every requested pool node. Otherwise, the nodes can't be created. For more information, see [Create an Azure Batch pool in a virtual network](batch-virtual-network.md).

- **Insufficient resources when a pool is in a virtual network.** When you create a pool in a virtual network, you might create resources such as load balancers, public IPs, and network security groups (NSGs) in the same subscription as the Batch account. Make sure the subscription quotas are sufficient for these resources.

- **Large pools with custom VM images.** Large pools that use custom VM images can take longer to allocate, and resize timeouts can occur. For recommendations on limits and configuration, see [Create a pool with the Azure Compute Gallery](batch-sig-images.md).

### Automatic scaling failures

You can set Azure Batch to automatically scale the number of nodes in a pool, and you define the parameters for the automatic scaling formula for the pool. The Batch service then uses the formula to periodically evaluate the number of nodes in the pool and set new target numbers. For more information, see [Create an automatic formula for scaling compute nodes in a Batch pool](batch-automatic-scaling.md).

The following issues can occur when you use automatic scaling:

- The automatic scaling evaluation fails.
- The resulting resize operation fails and times out.
- A problem with the automatic scaling formula leads to incorrect node target values. The resize might either work or time out.

To get information about the last automatic scaling evaluation, use the [autoScaleRun](/rest/api/batchservice/pool/get#autoscalerun) property. This property reports the evaluation time, the values and result, and any performance errors.

The [pool resize complete event](./batch-pool-resize-complete-event.md) captures information about all evaluations.

### Pool deletion failures

To delete a pool that contains nodes, Batch first deletes the nodes, which can take several minutes to complete. Batch then deletes the pool object itself.

Batch sets the [poolState](/rest/api/batchservice/pool/get#poolstate) to `deleting` during the deletion process. The calling application can detect if the pool deletion is taking too long by using the `state` and `stateTransitionTime` properties.

If the pool deletion is taking longer than expected, Batch retries periodically until the pool is successfully deleted. In some cases, the delay is due to an Azure service outage or other temporary issues. Other factors that prevent successful pool deletion might require you to take action to correct the issue. These factors can include the following issues:

- Resource locks might be placed on Batch-created resources, or on network resources that Batch uses.

- Resources that you created might depend on a Batch-created resource. For instance, if you [create a pool in a virtual network](batch-virtual-network.md), Batch creates an NSG, a public IP address, and a load balancer. If you're using these resources outside the pool, you can't delete the pool.

- The `Microsoft.Batch` resource provider might be unregistered from the subscription that contains your pool.

- For user subscription mode Batch accounts, `Microsoft Azure Batch` might no longer have the **Contributor** or **Owner** role to the subscription that contains your pool. For more information, see [Allow Batch to access the subscription](batch-account-create-portal.md#allow-azure-batch-to-access-the-subscription-one-time-operation).

## Node errors

Even when Batch successfully allocates nodes in a pool, various issues can cause some nodes to be unhealthy and unable to run tasks. These nodes still incur charges, so it's important to detect problems to avoid paying for nodes you can't use. Knowing about common node errors and knowing the current [jobState](/rest/api/batchservice/job/get#jobstate) is useful for troubleshooting.

### Start task failures

You can specify an optional [startTask](/rest/api/batchservice/pool/add#starttask) for a pool. As with any task, the start task uses a command line and can download resource files from storage. The start task runs for each node when the node starts. The `waitForSuccess` property specifies whether Batch waits until the start task completes successfully before it schedules any tasks to a node. If you configure the node to wait for successful start task completion, but the start task fails, the node isn't usable but still incurs charges.

You can detect start task failures by using the [taskExecutionResult](/rest/api/batchservice/computenode/get#taskexecutionresult) and  [taskFailureInformation](/rest/api/batchservice/computenode/get#taskfailureinformation) properties of the top-level [startTaskInformation](/rest/api/batchservice/computenode/get#starttaskinformation) node property.

A failed start task also causes Batch to set the [computeNodeState](/rest/api/batchservice/computenode/get#computenodestate) to `starttaskfailed`, if `waitForSuccess` was set to `true`.

As with any task, there can be many causes for a start task failure. To troubleshoot, check the *stdout*, *stderr*, and any other task-specific log files.

Start tasks must be re-entrant, because the start task can run multiple times on the same node, for example when the node is reimaged or rebooted. In rare cases, when a start task runs after an event causes a node reboot, one operating system (OS) or ephemeral disk reimages while the other doesn't. Since Batch start tasks and all Batch tasks run from the ephemeral disk, this situation isn't usually a problem. However, in cases where the start task installs an application to the OS disk and keeps other data on the ephemeral disk, there can be sync problems. Protect your application accordingly if you use both disks.

### Application package download failure

You can specify one or more application packages for a pool. Batch downloads the specified package files to each node and uncompresses the files after the node starts, but before it schedules tasks. It's common to use a start task command with application packages, for example to copy files to a different location or to run setup.

If an application package fails to download and uncompress, the [computeNodeError](/rest/api/batchservice/computenode/get#computenodeerror) property reports the failure, and sets the node state to `unusable`.

### Container download failure

You can specify one or more container references on a pool. Batch downloads the specified containers to each node. If the container fails to download, the [computeNodeError](/rest/api/batchservice/computenode/get#computenodeerror) property reports the failure, and sets the node state to `unusable`.

### Node OS updates

For Windows pools, `enableAutomaticUpdates` is set to `true` by default. Although allowing automatic updates is recommended, updates can interrupt task progress, especially if the tasks are long-running. You can set this value to `false` if you need to ensure that an OS update doesn't happen unexpectedly.

### Node in unusable state

Batch might set the [computeNodeState](/rest/api/batchservice/computenode/get#computenodestate) to `unusable` for many reasons. You can't schedule tasks to an `unusable` node, but the node still incurs charges.

If Batch can determine the cause, the [computeNodeError](/rest/api/batchservice/computenode/get#computenodeerror) property reports it. If a node is in an `unusable` state, but has no [computeNodeError](/rest/api/batchservice/computenode/get#computenodeerror), it means Batch is unable to communicate with the VM. In this case, Batch always tries to recover the VM. However, Batch doesn't automatically attempt to recover VMs that failed to install application packages or containers, even if their state is `unusable`.

Other reasons for `unusable` nodes might include the following causes:

- A custom VM image is invalid. For example, the image isn't properly prepared.
- A VM is moved because of an infrastructure failure or a low-level upgrade. Batch recovers the node.
- A VM image has been deployed on hardware that doesn't support it. For example, a CentOS HPC image is deployed on a [Standard_D1_v2](/azure/virtual-machines/dv2-dsv2-series) VM.
- The VMs are in an [Azure virtual network](batch-virtual-network.md), and traffic has been blocked to key ports.
- The VMs are in a virtual network, but outbound traffic to Azure Storage is blocked.
- The VMs are in a virtual network with a custom DNS configuration, and the DNS server can't resolve Azure storage.

### Node agent log files

The Batch agent process that runs on each pool node provides log files that might help if you need to contact support about a pool node issue. You can upload log files for a node via the Azure portal, Batch Explorer, or the [Compute Node - Upload Batch Service Logs](/rest/api/batchservice/computenode/uploadbatchservicelogs) API. After you upload and save the log files, you can delete the node or pool to save the cost of running the nodes.

### Node disk full

Batch uses the temporary drive on a node pool VM to store files such as the following job files, task files, and shared files:

- Application package files
- Task resource files
- Application-specific files downloaded to one of the Batch folders
- *Stdout* and *stderr* files for each task application execution
- Application-specific output files

Files like application packages or start task resource files write only once when Batch creates the pool node. Even though they only write once, if these files are too large they could fill the temporary drive.

Other files, such as *stdout* and *stderr*, are written for each task that a node runs. If a large number of tasks run on the same node, or the task files are too large, they could fill the temporary drive.

The node also needs a small amount of space on the OS disk to create users after it starts.

The size of the temporary drive depends on the VM size. One consideration when picking a VM size is to ensure that the temporary drive has enough space for the planned workload.

When you add a pool in the Azure portal, you can display the full list of VM sizes, including a **Resource disk size** column. The articles that describe VM sizes have tables with a **Temp Storage** column. For more information, see [Compute optimized virtual machine sizes](/azure/virtual-machines/sizes-compute). For an example size table, see [Fsv2-series](/azure/virtual-machines/fsv2-series).

You can specify a retention time for files written by each task. The retention time determines how long to keep the task files before automatically cleaning them up. You can reduce the retention time to lower storage requirements.

If the temporary or OS disk runs out of space, or is close to running out of space, the node moves to the `unusable` [computeNoteState](/rest/api/batchservice/computenode/get#computenodestate), and the node error says that the disk is full.

If you're not sure what's taking up space on the node, try remote connecting to the node and investigating manually. You can also use the [File - List From Compute Node](/rest/api/batchservice/file/listfromcomputenode) API to examine files, for example task outputs, in Batch managed folders. This API only lists files in the Batch managed directories. If your tasks created files elsewhere, this API doesn't show them.

After you make sure to retrieve any data you need from the node or upload it to a durable store, you can delete data as needed to free up space.

You can delete old completed jobs or tasks whose task data is still on the nodes. Look in the `recentTasks` collection in the [taskInformation](/rest/api/batchservice/computenode/get#taskinformation) on the node, or use the [File - List From Compute Node](/rest/api/batchservice/file/listfromcomputenode) API. Deleting a job deletes all the tasks in the job. Deleting the tasks in the job triggers deletion of data in the task directories on the nodes, and frees up space. Once you've freed up enough space, reboot the node. The node should move out of `unusable` state and into `idle` again.

To recover an unusable node in [VirtualMachineConfiguration](/rest/api/batchservice/pool/add#virtualmachineconfiguration) pools, you can remove the node from the pool by using the [Pool - Remove Nodes](/rest/api/batchservice/pool/removenodes) API. Then you can grow the pool again to replace the bad node with a fresh one. For [CloudServiceConfiguration](/rest/api/batchservice/pool/add#cloudserviceconfiguration) pools, you can reimage the node by using the [Compute Node - Reimage](/rest/api/batchservice/computenode/reimage) API to clean the entire disk. Reimage isn't currently supported for [VirtualMachineConfiguration](/rest/api/batchservice/pool/add#virtualmachineconfiguration) pools.

## Next steps

- Learn about [job and task error checking](batch-job-task-error-checking.md).
- Learn about [best practices](best-practices.md) for working with Azure Batch.

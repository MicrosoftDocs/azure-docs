---
title: Best practices
description: Learn best practices and useful tips for developing your Azure Batch solutions.
ms.date: 10/12/2023
ms.topic: conceptual
---

# Azure Batch best practices

This article discusses best practices and useful tips for using the Azure Batch service effectively. These tips can help you enhance performance and avoid design pitfalls in your Batch solutions.

> [!TIP]
> For guidance about security in Azure Batch, see [Batch security and compliance best practices](security-best-practices.md).

## Pools

[Pools](nodes-and-pools.md#pools) are the compute resources for executing jobs on the Batch service. The following sections provide recommendations for working with Batch pools.

### Pool configuration and naming

- **Pool allocation mode:** When creating a Batch account, you can choose between two pool allocation modes: **Batch service** or **user subscription**. For most cases, you should use the default Batch service mode, in which pools are allocated behind the scenes in Batch-managed subscriptions. In the alternative user subscription mode, Batch VMs and other resources are created directly in your subscription when a pool is created. User subscription accounts are primarily used to enable a small but important subset of scenarios. For more information, see [configuration for user subscription mode](batch-account-create-portal.md#additional-configuration-for-user-subscription-mode).

- **`virtualMachineConfiguration` or `cloudServiceConfiguration`:** While you can currently create pools using either
configuration, new pools should be configured using `virtualMachineConfiguration` and not `cloudServiceConfiguration`.
All current and new Batch features will be supported by Virtual Machine Configuration pools. Cloud Service Configuration
pools don't support all features and no new capabilities are planned. You won't be able to create new
`cloudServiceConfiguration` pools or add new nodes to existing pools
[after February 29, 2024](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/).
For more information, see
[Migrate Batch pool configuration from Cloud Services to Virtual Machine](batch-pool-cloud-service-to-virtual-machine-configuration.md).

- **`classic` or `simplified` node communication mode:** Pools can be configured in one of two node communication modes,
classic or [simplified](simplified-compute-node-communication.md). In the classic node communication model, the Batch service
initiates communication to the compute nodes, and compute nodes also require communicating to Azure Storage. In the simplified
node communication model, compute nodes initiate communication with the Batch service. Due to the reduced scope of
inbound/outbound connections required, and not requiring Azure Storage outbound access for baseline operation, the recommendation
is to use the simplified node communication model. Some future improvements to the Batch service will also require the simplified
node communication model. The classic node communication model will be
[retired on March 31, 2026](batch-pools-to-simplified-compute-node-communication-model-migration-guide.md).

- **Job and task run time considerations:** If you have jobs comprised primarily of short-running tasks, and the expected total task counts are small, so that the overall expected run time of the job isn't long, don't allocate a new pool for each job. The allocation time of the nodes will diminish the run time of the job.

- **Multiple compute nodes:** Individual nodes aren't guaranteed to always be available. While uncommon, hardware failures, operating system updates, and a host of other issues can cause individual nodes to be offline. If your Batch workload requires deterministic, guaranteed progress, you should allocate pools with multiple nodes.

- **Images with impending end-of-life (EOL) dates:** It's strongly recommended to avoid images with impending Batch support
end of life (EOL) dates. These dates can be discovered via the
[`ListSupportedImages` API](/rest/api/batchservice/account/listsupportedimages),
[PowerShell](/powershell/module/az.batch/get-azbatchsupportedimage), or
[Azure CLI](/cli/azure/batch/pool/supported-images). It's your responsibility to periodically refresh your view of the EOL
dates pertinent to your pools and migrate your workloads before the EOL date occurs. If you're using a custom image with a
specified node agent, ensure that you follow Batch support end-of-life dates for the image for which your custom image is
derived or aligned with. An image without a specified `batchSupportEndOfLife` date indicates that such a date hasn't been
determined yet by the Batch service. Absence of a date doesn't indicate that the respective image will be supported
indefinitely. An EOL date may be added or updated in the future at any time.

- **Unique resource names:** Batch resources (jobs, pools, etc.) often come and go over time. For example, you may create a pool on Monday, delete it on Tuesday, and then create another similar pool on Thursday. Each new resource you create should be given a unique name that you haven't used before. You can create uniqueness by using a GUID (either as the entire resource name, or as a part of it) or by embedding the date and time that the resource was created in the resource name. Batch supports [DisplayName](/dotnet/api/microsoft.azure.batch.jobspecification.displayname), which can give a resource a more readable name even if the actual resource ID is something that isn't human-friendly. Using unique names makes it easier for you to differentiate which particular resource did something in logs and metrics. It also removes ambiguity if you ever have to file a support case for a resource.

- **Continuity during pool maintenance and failure:** It's best to have your jobs use pools dynamically. If your jobs use the same pool for everything, there's a chance that jobs won't run if something goes wrong with the pool. This principle is especially important for time-sensitive workloads. For example, select or create a pool dynamically when you schedule each job, or have a way to override the pool name so that you can bypass an unhealthy pool.

- **Business continuity during pool maintenance and failure:** There are many reasons why a pool may not grow to the size you desire, such as internal errors or capacity constraints. Make sure you can retarget jobs at a different pool (possibly with a different VM size using [UpdateJob](/dotnet/api/microsoft.azure.batch.protocol.joboperationsextensions.update)) if necessary. Avoid relying on a static pool ID with the expectation that it will never be deleted and never change.

### Pool security

#### Isolation boundary

For the purposes of isolation, if your scenario requires isolating jobs or tasks from each other, do so by having them in separate pools. A pool is the security isolation boundary in Batch, and by default, two pools aren't visible or able to communicate with each other. Avoid using separate Batch accounts as a means of security isolation unless the larger environment from which the Batch account operates in requires isolation.

#### Batch Node Agent updates

Batch node agents aren't automatically upgraded for pools that have non-zero compute nodes. To ensure your Batch pools receive the latest security fixes and updates to the Batch node agent, you need to either resize the pool to zero compute nodes or recreate the pool. It's recommended to monitor the [Batch Node Agent release notes](https://github.com/Azure/Batch/blob/master/changelogs/nodeagent/CHANGELOG.md) to understand changes to new Batch node agent versions. Checking regularly for updates when they were released enables you to plan upgrades to the latest agent version.

Before you recreate or resize your pool, you should download any node agent logs for debugging purposes if you're experiencing issues with your Batch pool or compute nodes. This process is further discussed in the [Nodes](#nodes) section.

> [!NOTE]
> For general guidance about security in Azure Batch, see [Batch security and compliance best practices](security-best-practices.md).

#### Operating system updates

It's recommended that the VM image selected for a Batch pool should be up-to-date with the latest publisher provided security updates.
Some images may perform automatic updates upon boot (or shortly thereafter), which may interfere with certain user directed actions such
as retrieving package repository updates (for example, `apt update`) or installing packages during actions such as a
[StartTask](jobs-and-tasks.md#start-task).

Azure Batch doesn't verify or guarantee that images allowed for use with the service have the latest security updates.
Updates to images are under the purview of the publisher of the image, and not that of Azure Batch. For certain images published
under `microsoft-azure-batch`, there's no guarantee that these images are kept up-to-date with their upstream derived image.

### Pool lifetime and billing

Pool lifetime can vary depending upon the method of allocation and options applied to the pool configuration. Pools can have an arbitrary lifetime and a varying number of compute nodes at any point in time. It's your responsibility to manage the compute nodes in the pool either explicitly, or through features provided by the service ([autoscale](nodes-and-pools.md#automatic-scaling-policy) or [autopool](nodes-and-pools.md#autopools)).

- **Pool recreation:** Avoid deleting and recreating pools on a daily basis. Instead, create a new pool and then update your existing jobs to point to the new pool. Once all of the tasks have been moved to the new pool, then delete the old pool.

- **Pool efficiency and billing:** Batch itself incurs no extra charges. However, you do incur charges for Azure resources utilized, such as compute, storage, networking and any other resources that may be required for your Batch workload. You're billed for every compute node in the pool, regardless of the state it's in. For more information, see [Cost analysis and budgets for Azure Batch](budget.md).

- **Ephemeral OS disks:** Virtual Machine Configuration pools can use [ephemeral OS disks](create-pool-ephemeral-os-disk.md), which create the OS disk on the VM cache or temporary SSD, to avoid extra costs associated with managed disks.

### Pool allocation failures

Pool allocation failures can happen at any point during first allocation or subsequent resizes. These failures can be due to temporary capacity exhaustion in a region or failures in other Azure services that Batch relies on. Your core quota isn't a guarantee but rather a limit.

### Unplanned downtime

It's possible for Batch pools to experience downtime events in Azure. Understanding that problems can arise and you should develop your workflow to be resilient to re-executions. If nodes fail, Batch automatically attempts to recover these compute nodes on your behalf. This recovery may trigger rescheduling any running task on the node that is restored or on a different, available node. To learn more about interrupted tasks, see [Designing for retries](#design-for-retries-and-re-execution).

### Custom image pools

When you create an Azure Batch pool using the Virtual Machine Configuration, you specify a VM image that provides the operating system for each compute node in the pool. You can create the pool with a supported Azure Marketplace image, or you can [create a custom image with an Azure Compute Gallery image](batch-sig-images.md). While you can also use a [managed image](batch-custom-images.md) to create a custom image pool, we recommend creating custom images using the Azure Compute Gallery whenever possible. Using the Azure Compute Gallery helps you provision pools faster, scale larger quantities of VMs, and improves reliability when provisioning VMs.

### Third-party images

Pools can be created using third-party images published to Azure Marketplace. With user subscription mode Batch accounts, you may see the error "Allocation failed due to marketplace purchase eligibility check" when creating a pool with certain third-party images. To resolve this error, accept the terms set by the publisher of the image. You can do so by using [Azure PowerShell](/powershell/module/azurerm.marketplaceordering/set-azurermmarketplaceterms) or [Azure CLI](/cli/azure/vm/image/terms).

### Azure region dependency

You shouldn't rely on a single Azure region if you have a time-sensitive or production workload. While rare, there are issues that can affect an entire region. For example, if your processing needs to start at a specific time, consider scaling up the pool in your primary region *well before your start time*. If that pool scale fails, you can fall back to scaling up a pool in a backup region (or regions).

Pools across multiple accounts in different regions provide a ready, easily accessible backup if something goes wrong with another pool. For more information, see [Design your application for high availability](high-availability-disaster-recovery.md).

## Jobs

A [job](jobs-and-tasks.md#jobs) is a container designed to contain hundreds, thousands, or even millions of tasks. Follow these guidelines when creating jobs.

### Fewer jobs, more tasks

Using a job to run a single task is inefficient. For example, it's more efficient to use a single job containing 1000 tasks rather than creating 100 jobs that contain 10 tasks each. If you used 1000 jobs, each with a single task that would be the least efficient, slowest, and most expensive approach to take.

Avoid designing a Batch solution that requires thousands of simultaneously active jobs. There's no quota for tasks, so executing many tasks under as few jobs as possible efficiently uses your [job and job schedule quotas](batch-quota-limit.md#resource-quotas).

### Job lifetime

A Batch job has an indefinite lifetime until it's deleted from the system. Its state designates whether it can accept more tasks for scheduling or not.

A job doesn't automatically move to completed state unless explicitly terminated. This action can be automatically triggered through the [onAllTasksComplete](/dotnet/api/microsoft.azure.batch.common.onalltaskscomplete) property or [maxWallClockTime](/rest/api/batchservice/job/add#jobconstraints).

There's a default [active job and job schedule quota](batch-quota-limit.md#resource-quotas). Jobs and job schedules in completed state don't count towards this quota.

## Tasks

[Tasks](jobs-and-tasks.md#tasks) are individual units of work that comprise a job. Tasks are submitted by the user and scheduled by Batch on to compute nodes. The following sections provide suggestions for designing your tasks to handle issues and perform efficiently.

### Save task data

Compute nodes are by their nature ephemeral. Batch features such as [autopool](nodes-and-pools.md#autopools) and [autoscale](nodes-and-pools.md#automatic-scaling-policy) can make it easy for nodes to disappear. When nodes leave a pool (due to a resize or a pool delete), all the files on those nodes are also deleted. Because of this behavior, a task should move its output off of the node it's running on, and to a durable store before it completes. Similarly, if a task fails, it should move logs required to diagnose the failure to a durable store.

Batch has integrated support Azure Storage to upload data via [OutputFiles](batch-task-output-files.md), and with various shared file systems, or you can perform the upload yourself in your tasks.

### Manage task lifetime

Delete tasks when they're no longer needed, or set a [retentionTime](/dotnet/api/microsoft.azure.batch.taskconstraints.retentiontime) task constraint. If a `retentionTime` is set, Batch automatically cleans up the disk space used by the task when the `retentionTime` expires.

Deleting tasks accomplishes two things:

- Ensures that you don't have a build-up of tasks in the job. This action will help avoid difficulty in finding the task you're interested in as you'll have to filter through the Completed tasks.
- Cleans up the corresponding task data on the node (provided `retentionTime` hasn't already been hit). This action helps ensure that your nodes don't fill up with task data and run out of disk space.

> [!NOTE]
> For tasks just submitted to Batch, the DeleteTask API call takes up to 10 minutes to take effect. Before it takes effect, other tasks might be prevented from being scheduled. It's because Batch Scheduler still tries to schedule the tasks just deleted. If you want to delete one task shortly after it's submitted, please terminate the task instead (since the terminate task will take effect immediately). And then delete the task 10 minutes later.

### Submit large numbers of tasks in collection

Tasks can be submitted on an individual basis or in collections. Submit tasks in [collections](/rest/api/batchservice/task/addcollection) of up to 100 at a time when doing bulk submission of tasks to reduce overhead and submission time.

### Set max tasks per node appropriately

Batch supports oversubscribing tasks on nodes (running more tasks than a node has cores). It's up to you to ensure that your tasks are right-sized for the nodes in your pool. For example, you may have a degraded experience if you attempt to schedule eight tasks that each consume 25% CPU usage onto one node (in a pool with `taskSlotsPerNode = 8`).

### Design for retries and re-execution

Tasks can be automatically retried by Batch. There are two types of retries: user-controlled and internal. User-controlled retries are specified by the task's [maxTaskRetryCount](/dotnet/api/microsoft.azure.batch.taskconstraints.maxtaskretrycount). When a program specified in the task exits with a non-zero exit code, the task is retried up to the value of the `maxTaskRetryCount`.

Although rare, a task can be retried internally due to failures on the compute node, such as not being able to update internal state or a failure on the node while the task is running. The task will be retried on the same compute node, if possible, up to an internal limit before giving up on the task and deferring the task to be rescheduled by Batch, potentially on a different compute node.

There are no design differences when executing your tasks on dedicated or [Spot nodes](batch-spot-vms.md). Whether a task is preempted while running on a Spot node or interrupted due to a failure on a dedicated node, both situations are mitigated by designing the task to withstand failure.

### Build durable tasks

Tasks should be designed to withstand failure and accommodate retry. This principle is especially important for long running tasks. Ensure that your tasks generate the same, single result even if they're run more than once. One way to achieve this outcome is to make your tasks "goal seeking." Another way is to make sure your tasks are idempotent (tasks will have the same outcome no matter how many times they're run).

A common example is a task to copy files to a compute node. A simple approach is a task that copies all the specified files every time it runs, which is inefficient and isn't built to withstand failure. Instead, create a task to ensure the files are on the compute node; a task that doesn't recopy files that are already present. In this way, the task picks up where it left off if it was interrupted.

### Avoid short execution time

Tasks that only run for one to two seconds aren't ideal. Try to do a significant amount of work in an individual task (10 second minimum, going up to hours or days). If each task is executing for one minute (or more), then the scheduling overhead as a fraction of overall compute time is small.

### Use pool scope for short tasks on Windows nodes

When scheduling a task on Batch nodes, you can choose whether to run it with task scope or pool scope. If the task will only run for a short time, task scope can be inefficient due to the resources needed to create the auto-user account for that task. For greater efficiency, consider setting these tasks to pool scope. For more information, see [Run a task as an auto-user with pool scope](batch-user-accounts.md#run-a-task-as-an-auto-user-with-pool-scope).

## Nodes

A [compute node](nodes-and-pools.md#nodes) is an Azure virtual machine (VM) or cloud service VM that is dedicated to processing a portion of your application's workload. Follow these guidelines when working with nodes.

### Idempotent start tasks

As with other tasks, the node [start task](jobs-and-tasks.md#start-task) should be idempotent, as it will be rerun every time the node boots. An idempotent task is simply one that produces a consistent result when run multiple times.

### Isolated nodes

Consider using isolated VM sizes for workloads with compliance or regulatory requirements. Supported isolated sizes in virtual machine configuration mode include `Standard_E80ids_v4`, `Standard_M128ms`, `Standard_F72s_v2`, `Standard_G5`, `Standard_GS5`, and `Standard_E64i_v3`. For more information about isolated VM sizes, see [Virtual machine isolation in Azure](../virtual-machines/isolation.md).

### Manage long-running services via the operating system services interface

Sometimes there's a need to run another agent alongside the Batch agent in the node. For example, you may want to gather data from the node and report it. We recommend that these agents be deployed as OS services, such as a Windows service or a Linux `systemd` service.

These services must not take file locks on any files in Batch-managed directories on the node, because otherwise Batch will be unable to delete those directories due to the file locks. For example, if installing a Windows service in a start task, instead of launching the service directly from the start task working directory, copy the files elsewhere (or if the files exist just skip the copy). Then install the service from that location. When Batch reruns your start task, it will delete the start task working directory and create it again.

### Avoid creating directory junctions in Windows

Directory junctions, sometimes called directory hard-links, are difficult to deal with during task and job cleanup. Use symlinks (soft-links) rather than hard-links.

### Temporary disks and `AZ_BATCH_NODE_ROOT_DIR`

Batch relies on VM temporary disks, for Batch-compatible VM sizes, to store metadata related to task execution along with any artifacts of each task
execution on this temporary disk. Examples of these temporary disk mount points or directories are: `/mnt/batch`, `/mnt/resource/batch`, and `D:\batch\tasks`.
Replacing, remounting, junctioning, symlinking, or otherwise redirecting these mount points and directories or any of the parent directories
isn't supported and can lead to instability. If you require more disk space, consider using a VM size or family that has temporary
disk space that meets your requirements or [attaching data disks](/rest/api/batchservice/pool/add#datadisk). For more information, see the next
section about attaching and preparing data disks for compute nodes.

### Attaching and preparing data disks

Each individual compute node will have the exact same data disk specification attached if specified as part of the Batch pool instance. Only
new data disks may be attached to Batch pools. These data disks attached to compute nodes aren't automatically partitioned, formatted or
mounted. It's your responsibility to perform these operations as part of your [start task](jobs-and-tasks.md#start-task). These start tasks
must be crafted to be idempotent. A re-execution of the start task after the compute node has been provisioned is possible. If the start
task isn't idempotent, potential data loss can occur on the data disks.

> [!TIP]
> When mounting a data disk in Linux, if nesting the disk mountpoint under the Azure temporary mount points such as `/mnt` or `/mnt/resource`,
> care should be taken such that no dependency races are introduced. For example, if these mounts are automatically performed by the OS, there
> can be a race between the temporary disk being mounted and your data disk(s) being mounted under the parent. Steps should be taken to
> ensure that appropriate dependencies are enforced by facilities available such as `systemd` or defer mounting of the data disk to the start
> task as part of your idempotent data disk preparation script.

#### Preparing data disks in Linux Batch pools

Azure data disks in Linux are presented as block devices and assigned a typical `sd[X]` identifier. You shouldn't rely on static `sd[X]`
assignments as these labels are dynamically assigned at boot time and aren't guaranteed to be consistent between the first and any subsequent
boots. You should identify your attached disks through the mappings presented in `/dev/disk/azure/scsi1/`. For example, if you specified LUN 0
for your data disk in the AddPool API, then this disk would manifest as `/dev/disk/azure/scsi1/lun0`. As an example, if you were to list this
directory, you could potentially see:

```
user@host:~$ ls -l /dev/disk/azure/scsi1/
total 0
lrwxrwxrwx 1 root root 12 Oct 31 15:16 lun0 -> ../../../sdc
```

There's no need to translate the reference back to the `sd[X]` mapping in your preparation script, instead refer to the device directly.
In this example, this device would be `/dev/disk/azure/scsi1/lun0`. You could provide this ID directly to `fdisk`, `mkfs`, and any other
tooling required for your workflow. Alternatively, you can use `lsblk` with `blkid` to map the UUID for the disk.

For more information about Azure data disks in Linux, including alternate methods of locating data disks and `/etc/fstab` options,
see this [article](../virtual-machines/linux/add-disk.md). Ensure that there are no dependencies or races as described by the Tip
note before promoting your method into production use.

#### Preparing data disks in Windows Batch pools

Azure data disks attached to Batch Windows compute nodes are presented unpartitioned and unformatted. You'll need to enumerate disks
with `RAW` partitions for actioning as part of your start task. This information can be retrieved using the `Get-Disk` PowerShell cmdlet.
As an example, you could potentially see:

```
PS C:\Windows\system32> Get-Disk

Number Friendly Name Serial Number                    HealthStatus         OperationalStatus      Total Size Partition
                                                                                                             Style
------ ------------- -------------                    ------------         -----------------      ---------- ----------
0      Virtual HD                                     Healthy              Online                      30 GB MBR
1      Virtual HD                                     Healthy              Online                      32 GB MBR
2      Msft Virtu...                                  Healthy              Online                      64 GB RAW
```

Where disk number 2 is the uninitialized data disk attached to this compute node. These disks can then be initialized, partitioned,
and formatted as required for your workflow.

For more information about Azure data disks in Windows, including sample PowerShell scripts, see this
[article](../virtual-machines/windows/attach-disk-ps.md). Ensure any sample scripts are validated for idempotency before
promotion into production use.

### Collect Batch agent logs

If you notice a problem involving the behavior of a node or tasks running on a node, collect the Batch agent logs prior to deallocating the nodes in question. The Batch agent logs can be collected using the Upload Batch service logs API. These logs can be supplied as part of a support ticket to Microsoft and will help with issue troubleshooting and resolution.

### Manage OS upgrades

For user subscription mode Batch accounts, automated OS upgrades can interrupt task progress, especially if the tasks are long-running. [Building idempotent tasks](#build-durable-tasks) can help to reduce errors caused by these interruptions. We also recommend [scheduling OS image upgrades for times when tasks aren't expected to run](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md#manually-trigger-os-image-upgrades).

For Windows pools, `enableAutomaticUpdates` is set to `true` by default. Allowing automatic updates is recommended, but you can set this value to `false` if you need to ensure that an OS update doesn't happen unexpectedly.

## Connectivity

Review the following guidance related to connectivity in your Batch solutions.

### Network Security Groups (NSGs) and User Defined Routes (UDRs)

When provisioning [Batch pools in a virtual network](batch-virtual-network.md), ensure that you're closely following the guidelines regarding the use of the BatchNodeManagement.*region* service tag, ports, protocols and direction of the rule. Use of the service tag is highly recommended; don't use underlying Batch service IP addresses as they can change over time. Using Batch service IP addresses directly can cause instability, interruptions, or outages for your Batch pools.

For User Defined Routes (UDRs), it's recommended to use BatchNodeManagement.*region* [service tags](../virtual-network/virtual-networks-udr-overview.md#service-tags-for-user-defined-routes) instead of Batch service IP addresses as they can change over time.

### Honoring DNS

Ensure that your systems honor DNS Time-to-Live (TTL) for your Batch account service URL. Additionally, ensure that your Batch service clients and other connectivity mechanisms to the Batch service don't rely on IP addresses.

Any HTTP requests with 5xx level status codes along with a "Connection: close" header in the response requires adjusting your Batch service client behavior. Your Batch service client should observe the recommendation by closing the existing connection, re-resolving DNS for the Batch account service URL, and attempt following requests on a new connection.

### Retry requests automatically

Ensure that your Batch service clients have appropriate retry policies in place to automatically retry your requests, even during normal operation and not exclusively during any service maintenance time periods. These retry policies should span an interval of at least 5 minutes. Automatic retry capabilities are provided with various Batch SDKs, such as the [.NET RetryPolicyProvider class](/dotnet/api/microsoft.azure.batch.retrypolicyprovider).

### Static public IP addresses

Typically, virtual machines in a Batch pool are accessed through public IP addresses that can change over the lifetime of the pool. This dynamic nature can make it difficult to interact with a database or other external service that limits access to certain IP addresses. To address this concern, you can create a pool using a set of static public IP addresses that you control. For more information, see [Create an Azure Batch pool with specified public IP addresses](create-pool-public-ip.md).

### Testing connectivity with Cloud Services configuration

You can't use the normal "ping"/ICMP protocol with cloud services, because the ICMP protocol isn't permitted through the Azure load balancer. For more information, see [Connectivity and networking for Azure Cloud Services](../cloud-services/cloud-services-connectivity-and-networking-faq.yml#can-i-ping-a-cloud-service-).

## Batch node underlying dependencies

Consider the following dependencies and restrictions when designing your Batch solutions.

### System-created resources

Azure Batch creates and manages a set of users and groups on the VM, which shouldn't be altered:

Windows:

- A user named **PoolNonAdmin**
- A user group named **WATaskCommon**

Linux:

- A user named **_azbatch**

### File cleanup

Batch actively tries to clean up the working directory that tasks are run in, once their retention time expires. Any files written outside of this directory are [your responsibility to clean up](#manage-task-lifetime) to avoid filling up disk space.

The automated cleanup for the working directory will be blocked if you run a service on Windows from the start task working directory, due to the folder still being in use. This action will lead to degraded performance. To fix this issue, change the directory for that service to a separate directory that isn't managed by Batch.

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn about [default Azure Batch quotas, limits, and constraints, and how to request quota increases](batch-quota-limit.md).
- Learn how to to [detect and avoid failures in pool and node background operations ](batch-pool-node-error-checking.md).

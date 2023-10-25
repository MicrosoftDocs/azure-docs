---
title: Nodes and pools in Azure Batch
description: Learn about compute nodes and pools and how they are used in an Azure Batch workflow from a development standpoint.
ms.topic: conceptual
ms.date: 04/11/2023

---
# Nodes and pools in Azure Batch

In an Azure Batch workflow, a *compute node* (or *node*) is a virtual machine that processes a portion of your application's workload. A *pool* is a collection of these nodes for your application to runs on. This article explains more about nodes and pools, along with considerations when creating and using them in an Azure Batch workflow.

## Nodes

A node is an Azure virtual machine (VM) or cloud service VM that is dedicated to processing a portion of your application's workload. The size of a node determines the number of CPU cores, memory capacity, and local file system size that is allocated to the node.

You can create pools of Windows or Linux nodes by using Azure Cloud Services, images from the [Azure Virtual Machines Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/category/compute?filters=virtual-machine-images&page=1), or custom images that you prepare.

Nodes can run any executable or script that is supported by the operating system environment of the node. Executables or scripts include \*.exe, \*.cmd, \*.bat, and PowerShell scripts (for Windows) and binaries, shell, and Python scripts (for Linux).

All compute nodes in Batch also include:

- A standard [folder structure](files-and-directories.md) and associated [environment variables](jobs-and-tasks.md) that are available for reference by tasks.
- **Firewall** settings that are configured to control access.
- [Remote access](error-handling.md#connect-to-compute-nodes) to both Windows (Remote Desktop Protocol (RDP)) and Linux (Secure Shell (SSH)) nodes (unless you [create your pool with remote access disabled](pool-endpoint-configuration.md)).

By default, nodes can communicate with each other, but they can't communicate with virtual machines that are not part of the same pool. To allow nodes to communicate securely with other virtual machines, or with an on-premises network, you can provision the pool [in a subnet of an Azure virtual network (VNet)](batch-virtual-network.md). When you do so, your nodes can be accessed through public IP addresses. These public IP addresses are created by Batch and may change over the lifetime of the pool. You can also [create a pool with static public IP addresses](create-pool-public-ip.md) that you control, which ensures that they won't change unexpectedly.

## Pools

A pool is the collection of nodes that your application runs on.

Azure Batch pools build on top of the core Azure compute platform. They provide large-scale allocation, application installation, data distribution, health monitoring, and flexible adjustment ([scaling](#automatic-scaling-policy)) of the number of compute nodes within a pool.

Every node that is added to a pool is assigned a unique name and IP address. When a node is removed from a pool, any changes that are made to the operating system or files are lost, and its name and IP address are released for future use. When a node leaves a pool, its lifetime is over.

A pool can be used only by the Batch account in which it was created. A Batch account can create multiple pools to meet the resource requirements of the applications it will run.

The pool can be created manually, or [automatically by the Batch service](#autopools) when you specify the work to be done. When you create a pool, you can specify the following attributes:

- [Nodes and pools in Azure Batch](#nodes-and-pools-in-azure-batch)
  - [Nodes](#nodes)
  - [Pools](#pools)
  - [Operating system and version](#operating-system-and-version)
  - [Configurations](#configurations)
    - [Virtual Machine Configuration](#virtual-machine-configuration)
    - [Cloud Services Configuration](#cloud-services-configuration)
    - [Node Agent SKUs](#node-agent-skus)
    - [Custom images for Virtual Machine pools](#custom-images-for-virtual-machine-pools)
    - [Container support in Virtual Machine pools](#container-support-in-virtual-machine-pools)
  - [Node type and target](#node-type-and-target)
  - [Node size](#node-size)
  - [Automatic scaling policy](#automatic-scaling-policy)
  - [Task scheduling policy](#task-scheduling-policy)
  - [Communication status](#communication-status)
  - [Start tasks](#start-tasks)
  - [Application packages](#application-packages)
  - [Virtual network (VNet) and firewall configuration](#virtual-network-vnet-and-firewall-configuration)
    - [VNet requirements](#vnet-requirements)
  - [Pool and compute node lifetime](#pool-and-compute-node-lifetime)
  - [Autopools](#autopools)
  - [Security with certificates](#security-with-certificates)
  - [Next steps](#next-steps)

> [!IMPORTANT]
> Batch accounts have a default quota that limits the number of cores in a Batch account. The number of cores corresponds to the number of compute nodes. You can find the default quotas and instructions on how to [increase a quota](batch-quota-limit.md#increase-a-quota) in [Quotas and limits for the Azure Batch service](batch-quota-limit.md). If your pool is not achieving its target number of nodes, the core quota might be the reason.

## Operating system and version

When you create a Batch pool, you specify the Azure virtual machine configuration and the type of operating system you want to run on each compute node in the pool.

## Configurations

There are two types of pool configurations available in Batch.

> [!IMPORTANT]
> While you can currently create pools using either configuration, new pools should be configured using Virtual Machine Configuration and not Cloud Services Configuration. All current and new Batch features will be supported by Virtual Machine Configuration pools. Cloud Services Configuration pools do not support all features and no new capabilities are planned. You won't be able to create new 'CloudServiceConfiguration' pools or add new nodes to existing pools [after February 29, 2024](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/).

### Virtual Machine Configuration

The **Virtual Machine Configuration** specifies that the pool is composed of Azure virtual machines. These VMs may be created from either Linux or Windows images.

> [!IMPORTANT]
> Currently, Batch does not support [Trusted Launch VMs](../virtual-machines/trusted-launch.md). 

The [Batch node agent](https://github.com/Azure/Batch/blob/master/changelogs/nodeagent/CHANGELOG.md) is a program that runs on each node in the pool and provides the command-and-control interface between the node and the Batch service. There are different implementations of the node agent, known as SKUs, for different operating systems. When you create a pool based on the Virtual Machine Configuration, you must specify not only the size of the nodes and the source of the images used to create them, but also the **virtual machine image reference** and the Batch **node agent SKU** to be installed on the nodes. For more information about specifying these pool properties, see [Provision Linux compute nodes in Azure Batch pools](batch-linux-nodes.md). You can optionally attach one or more empty data disks to pool VMs created from Marketplace images, or include data disks in custom images used to create the VMs. When including data disks, you need to mount and format the disks from within a VM to use them.

### Cloud Services Configuration

> [!WARNING]
> Cloud Services Configuration pools are [deprecated](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/). Please use Virtual Machine Configuration pools instead. For more information, see [Migrate Batch pool configuration from Cloud Services to Virtual Machine](batch-pool-cloud-service-to-virtual-machine-configuration.md).

The **Cloud Services Configuration** specifies that the pool is composed of Azure Cloud Services nodes. Cloud Services provides only Windows compute nodes.

Available operating systems for Cloud Services Configuration pools are listed in the [Azure Guest OS releases and SDK compatibility matrix](../cloud-services/cloud-services-guestos-update-matrix.md), and available compute node sizes are listed in [Sizes for Cloud Services](../cloud-services/cloud-services-sizes-specs.md). When you create a pool that contains Cloud Services nodes, you specify the node size and its *OS Family* (which determines which versions of .NET are installed with the OS). Cloud Services is deployed to Azure more quickly than virtual machines running Windows. If you want pools of Windows compute nodes, you may find that Cloud Services provide a performance benefit in terms of deployment time.

As with worker roles within Cloud Services, you can specify an *OS Version*. We recommend that you specify `Latest (*)` for the *OS Version* so that the nodes are automatically upgraded, and there is no work required to cater to newly released versions. The primary use case for selecting a specific OS version is to ensure application compatibility, which allows backward compatibility testing to be performed before allowing the version to be updated. After validation, the *OS Version* for the pool can be updated and the new OS image can be installed. Any running tasks will be interrupted and requeued.

### Node Agent SKUs

When you create a pool, you need to select the appropriate **nodeAgentSkuId**, depending on the OS of the base image of your VHD. You can get a mapping of available node agent SKU IDs to their OS Image references by calling the [List Supported Node Agent SKUs](/rest/api/batchservice/list-supported-node-agent-skus) operation.

### Custom images for Virtual Machine pools

To learn how to create a pool with custom images, see [Use the Azure Compute Gallery to create a custom pool](batch-sig-images.md).

### Container support in Virtual Machine pools

When creating a Virtual Machine Configuration pool using the Batch APIs, you can set up the pool to run tasks in Docker containers. Currently, you must create the pool using an image that supports Docker containers. Use the Windows Server 2016 Datacenter with Containers image from the Azure Marketplace, or supply a custom VM image that includes Docker Community Edition or Enterprise Edition and any required drivers. The pool settings must include a [container configuration](/rest/api/batchservice/pool/add) that copies container images to the VMs when the pool is created. Tasks that run on the pool can then reference the container images and container run options.

For more information, see [Run Docker container applications on Azure Batch](batch-docker-container-workloads.md).

## Node type and target

When you create a pool, you can specify which types of nodes you want and the target number for each. The two types of nodes are:

- **Dedicated nodes.** Dedicated compute nodes are reserved for your workloads. They are more expensive than Spot nodes, but they are guaranteed to never be preempted.
- **Spot nodes.** Spot nodes take advantage of surplus capacity in Azure to run your Batch workloads. Spot nodes are less expensive per hour than dedicated nodes, and enable workloads requiring significant compute power. For more information, see [Use Spot VMs with Batch](batch-spot-vms.md).

Spot nodes may be preempted when Azure has insufficient surplus capacity. If a node is preempted while running tasks, the tasks are requeued and run again once a compute node becomes available again. Spot nodes are a good option for workloads where the job completion time is flexible and the work is distributed across many nodes. Before you decide to use Spot nodes for your scenario, make sure that any work lost due to preemption will be minimal and easy to recreate.

You can have both Spot and dedicated compute nodes in the same pool. Each type of node has its own target setting, for which you can specify the desired number of nodes.

The number of compute nodes is referred to as a *target* because, in some situations, your pool might not reach the desired number of nodes. For example, a pool might not achieve the target if it reaches the [core quota](batch-quota-limit.md) for your Batch account first. Or, the pool might not achieve the target if you have applied an automatic scaling formula to the pool that limits the maximum number of nodes.

For pricing information for both Spot and dedicated nodes, see [Batch Pricing](https://azure.microsoft.com/pricing/details/batch/).

## Node size

When you create an Azure Batch pool, you can choose from among almost all the VM families and sizes available in Azure. Azure offers a range of VM sizes for different workloads, including specialized [HPC](../virtual-machines/sizes-hpc.md) or [GPU-enabled](../virtual-machines/sizes-gpu.md) VM sizes. Note that node sizes can only be chosen at the time a pool is created. In other words, once a pool is created, its node size cannot be changed.

For more information, see [Choose a VM size for compute nodes in an Azure Batch pool](batch-pool-vm-sizes.md).

## Automatic scaling policy

For dynamic workloads, you can apply an automatic scaling policy to a pool. The Batch service will periodically evaluate your formula and dynamically adjusts the number of nodes within the pool according to the current workload and resource usage of your compute scenario. This allows you to lower the overall cost of running your application by using only the resources you need, and releasing those you don't need.

You enable automatic scaling by writing an [automatic scaling formula](batch-automatic-scaling.md#autoscale-formulas) and associating that formula with a pool. The Batch service uses the formula to determine the target number of nodes in the pool for the next scaling interval (an interval that you can configure). You can specify the automatic scaling settings for a pool when you create it, or enable scaling on a pool later. You can also update the scaling settings on a scaling-enabled pool.

As an example, perhaps a job requires that you submit a large number of tasks to be executed. You can assign a scaling formula to the pool that adjusts the number of nodes in the pool based on the current number of queued tasks and the completion rate of the tasks in the job. The Batch service periodically evaluates the formula and resizes the pool, based on workload and your other formula settings. The service adds nodes as needed when there are a large number of queued tasks, and removes nodes when there are no queued or running tasks.

A scaling formula can be based on the following metrics:

- **Time metrics** are based on statistics collected every five minutes in the specified number of hours.
- **Resource metrics** are based on CPU usage, bandwidth usage, memory usage, and number of nodes.
- **Task metrics** are based on task state, such as *Active* (queued), *Running*, or *Completed*.

When automatic scaling decreases the number of compute nodes in a pool, you must consider how to handle tasks that are running at the time of the decrease operation. To accommodate this, Batch provides a [*node deallocation option*](/rest/api/batchservice/pool/removenodes#computenodedeallocationoption) that you can include in your formulas. For example, you can specify that running tasks are stopped immediately and then requeued for execution on another node, or allowed to finish before the node is removed from the pool. Note that setting the node deallocation option as `taskcompletion` or `retaineddata` will prevent pool resize operations until all tasks have completed, or all task retention periods have expired, respectively.

For more information about automatically scaling an application, see [Automatically scale compute nodes in an Azure Batch pool](batch-automatic-scaling.md).

> [!TIP]
> To maximize compute resource utilization, set the target number of nodes to zero at the end of a job, but allow running tasks to finish.

## Task scheduling policy

The [max tasks per node](batch-parallel-node-tasks.md) configuration option determines the maximum number of tasks that can be run in parallel on each compute node within the pool.

The default configuration specifies that one task at a time runs on a node, but there are scenarios where it is beneficial to have two or more tasks executed on a node simultaneously. See the [example scenario](batch-parallel-node-tasks.md#example-scenario) in the [concurrent node tasks](batch-parallel-node-tasks.md) article to see how you can benefit from multiple tasks per node.

You can also specify a *fill type*, which determines whether Batch spreads the tasks evenly across all nodes in a pool, or packs each node with the maximum number of tasks before assigning tasks to another node.

## Communication status

In most scenarios, tasks operate independently and do not need to communicate with one another. However, there are some applications in which tasks must communicate, like [MPI scenarios](batch-mpi.md).

You can configure a pool to allow **internode communication** so that nodes within a pool can communicate at runtime. When internode communication is enabled, nodes in Cloud Services Configuration pools can communicate with each other on ports greater than 1100, and Virtual Machine Configuration pools do not restrict traffic on any port.

Enabling internode communication also impacts the placement of the nodes within clusters and might limit the maximum number of nodes in a pool because of deployment restrictions. If your application does not require communication between nodes, the Batch service can allocate a potentially large number of nodes to the pool from many different clusters and data centers to enable increased parallel processing power.

## Start tasks

If desired, you can add a [start task](jobs-and-tasks.md#start-task) that will execute on each node as that node joins the pool, and each time a node is restarted or reimaged. The start task is especially useful for preparing compute nodes for the execution of tasks, like installing the applications that your tasks run on the compute nodes.

## Application packages

You can specify application packages to deploy to the compute nodes in the pool. Application packages provide simplified deployment and versioning of the applications that your tasks run. Application packages that you specify for a pool are installed on every node that joins that pool, and every time a node is rebooted or reimaged.

For more information about using application packages to deploy your applications to your Batch nodes, see [Deploy applications to compute nodes with Batch application packages](batch-application-packages.md).

## Virtual network (VNet) and firewall configuration

When you provision a pool of compute nodes in Batch, you can associate the pool with a subnet of an Azure [virtual network (VNet)](../virtual-network/virtual-networks-overview.md). To use an Azure VNet, the Batch client API must use Microsoft Entra authentication. Azure Batch support for Microsoft Entra ID is documented in [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).

### VNet requirements

For more information about setting up a Batch pool in a VNet, see [Create a pool of virtual machines with your virtual network](batch-virtual-network.md).

> [!TIP]
> To ensure that the public IP addresses used to access nodes don't change, you can [create a pool with specified public IP addresses that you control](create-pool-public-ip.md).

## Pool and compute node lifetime

When you design your Azure Batch solution, you must specify how and when pools are created, and how long compute nodes within those pools are kept available.

On one end of the spectrum, you can create a pool for each job that you submit, and delete the pool as soon as its tasks finish execution. This maximizes utilization because the nodes are only allocated when needed, and they are shut down once they're idle. While this means that the job must wait for the nodes to be allocated, it's important to note that tasks are scheduled for execution as soon as nodes are individually allocated and the start task has completed. Batch does *not* wait until all nodes within a pool are available before assigning tasks to the nodes. This ensures maximum utilization of all available nodes.

At the other end of the spectrum, if having jobs start immediately is the highest priority, you can create a pool ahead of time and make its nodes available before jobs are submitted. In this scenario, tasks can start immediately, but nodes might sit idle while waiting for them to be assigned.

A combined approach is typically used for handling a variable but ongoing load. You can have a pool in which multiple jobs are submitted, and can scale the number of nodes up or down according to the job load. You can do this reactively, based on current load, or proactively, if load can be predicted. For more information, see [Automatic scaling policy](#automatic-scaling-policy).

## Autopools

An [autopool](/rest/api/batchservice/job/add#autopoolspecification) is a pool that is created by the Batch service when a job is submitted, rather than being created prior to the jobs that will run in the pool. The Batch service will manage the lifetime of an autopool according to the characteristics that you specify. Most often, these pools are also set to delete automatically after their jobs have completed.

## Security with certificates

You typically need to use certificates when you encrypt or decrypt sensitive information for tasks, like the key for an [Azure Storage account](accounts.md#azure-storage-accounts). To support this, you can install certificates on nodes. Encrypted secrets are passed to tasks via command-line parameters or embedded in one of the task resources, and the installed certificates can be used to decrypt them.

You use the [Add certificate](/rest/api/batchservice/certificate/add) operation (Batch REST) or [CertificateOperations.CreateCertificate](/dotnet/api/microsoft.azure.batch.certificateoperations) method (Batch .NET) to add a certificate to a Batch account. You can then associate the certificate with a new or existing pool.

When a certificate is associated with a pool, the Batch service installs the certificate on each node in the pool. The Batch service installs the appropriate certificates when the node starts up, before launching any tasks (including the [start task](jobs-and-tasks.md#start-task) and [job manager task](jobs-and-tasks.md#job-manager-task)).

If you add a certificate to an existing pool, you must reboot its compute nodes in order for the certificate to be applied to the nodes.

## Next steps

- Learn about [jobs and tasks](jobs-and-tasks.md).
- Learn how to to [detect and avoid failures in pool and node background operations ](batch-pool-node-error-checking.md).

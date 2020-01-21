---
title: Plan your Avere vFXT system - Azure
description: Explains planning to do before deploying Avere vFXT for Azure
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 01/13/2020
ms.author: rohogue
---

# Plan your Avere vFXT system

This article explains how to plan a new Avere vFXT for Azure cluster that is positioned and sized appropriately for your needs.

Before going to the Azure Marketplace or creating any VMs, consider these details:

* How will the cluster interact with other Azure resources?
* Where should cluster elements be located in private networks and subnets?
* What type of back-end storage will you use, and how will the cluster access it?
* How powerful do your cluster nodes need to be to support your workflow?

Read on to learn more.

## Learn the components of the system

It can be helpful to understand the components of the Avere vFXT for Azure system when you start planning.

* Cluster nodes - The cluster is made up of three or more VMs configured as cluster nodes. More nodes give the system higher throughput and a larger cache.

* Cache - The cache capacity is divided equally among the cluster nodes. Set the per-node cache size when you create the cluster; the node sizes are added to become the total cache size.

* Cluster controller - The cluster controller is an additional VM located inside the same subnet as the cluster nodes. The controller is needed to create the cluster and for ongoing management tasks.

* Back-end storage - The data that you want to have cached is stored long term in a hardware storage system or an Azure Blob container. You can add storage after you create the Avere vFXT for Azure cluster, or if using Blob storage you can add and configure the container while creating the cluster.

* Clients - Client machines that use the cached files connect to the cluster using a virtual file path instead of accessing the storage systems directly. (Read more in [Mount the Avere vFXT cluster](avere-vfxt-mount-clients.md).)

## Subscription, resource group, and network infrastructure

Consider where the elements of your Avere vFXT for Azure deployment will be. The diagram below shows a possible arrangement for the Avere vFXT for Azure components:

![Diagram showing the cluster controller and cluster VMs within one subnet. Around the subnet boundary is a vnet boundary. Inside the vnet is a hexagon representing the storage service endpoint; it is connected with a dashed arrow to a Blob storage outside the vnet.](media/avere-vfxt-components-option.png)

Follow these guidelines when planning your Avere vFXT cluster's network infrastructure:

* Create a new subscription for each Avere vFXT for Azure deployment. Manage all components in this subscription.

  Benefits of using a new subscription for each deployment include:
  * Simpler cost tracking - View and audit all costs from resources, infrastructure, and compute cycles in one subscription.
  * Easier cleanup - You can remove the entire subscription when finished with the project.
  * Convenient partitioning of resource quotas - Isolate the Avere vFXT clients and cluster in a single subscription to protect other critical workloads from possible resource throttling. This separation prevents conflict when bringing up a large number of clients for a high-performance computing workflow.

* Locate your client compute systems close to the vFXT cluster. Back-end storage can be more remote.  

* Locate the vFXT cluster and the cluster controller VM together - specifically, they should be:

  * In the same virtual network
  * In the same resource group
  * Using the same storage account
  
  The cluster creation template handles this configuration for most situations.

* The cluster must be located in its own subnet to avoid IP address conflicts with clients or other compute resources.

* Use the cluster creation template to create most of the needed infrastructure resources for the cluster, including resource groups, virtual networks, subnets, and storage accounts.

  If you want to use resources that already exist, make sure they meet the requirements in this table.

  | Resource | Use existing? | Requirements |
  |----------|-----------|----------|
  | Resource group | Yes, if empty | Must be empty|
  | Storage account | **Yes** if connecting an existing Blob container after cluster creation <br/>  **No** if creating a new Blob container during cluster creation | Existing Blob container must be empty <br/> &nbsp; |
  | Virtual network | Yes | Must include a storage service endpoint if creating a new Azure Blob container |
  | Subnet | Yes | Cannot contain other resources |

## IP address requirements

Make sure that your cluster's subnet has a large enough IP address range to support the cluster.

The Avere vFXT cluster uses the following IP addresses:

* One cluster management IP address. This address can move from node to node in the cluster as needed so that it is always available. Use this address to connect to the Avere Control Panel configuration tool.
* For each cluster node:
  * At least one client-facing IP address. (All client-facing addresses are managed by the cluster's *vserver*, which can move the IP addresses among nodes as needed.)
  * One IP address for cluster communication
  * One instance IP address (assigned to the VM)

If you use Azure Blob storage, it also might require IP addresses from your cluster's virtual network:  

* An Azure Blob storage account requires at least five IP addresses. Keep this requirement in mind if you locate Blob storage in the same virtual network as your cluster.
* If you use Azure Blob storage that is outside the cluster's virtual network, create a storage service endpoint inside the virtual network. The endpoint does not use an IP address.

You have the option to locate network resources and Blob storage (if used) in different resource groups from the cluster.

## vFXT node size

The VMs that serve as cluster nodes determine the request throughput and storage capacity of your cache. <!-- The instance type offered has been chosen for its memory, processor, and local storage characteristics. You can choose from two instance types, with different memory, processor, and local storage characteristics. -->

Each vFXT node will be identical. That is, if you create a three-node cluster you will have three VMs of the same type and size.

| Instance type | vCPUs | Memory  | Local SSD storage  | Max data disks | Uncached disk throughput | NIC (count) |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_E32s_v3 | 32  | 256 GiB | 512 GiB  | 32 | 51,200 IOPS <br/> 768 MBps | 16,000 MBps (8)  |

Disk cache per node is configurable and can rage from 1000 GB to 8000 GB. 4 TB per node is the recommended cache size for Standard_E32s_v3 nodes.

For additional information about these VMs, read the Microsoft Azure documentation: [Memory optimized virtual machine sizes](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-memory)

## Account quota

Make sure that your subscription has the capacity to run the Avere vFXT cluster as well as any computing or client systems being used. Read [Quota for the vFXT cluster](avere-vfxt-prereqs.md#quota-for-the-vfxt-cluster) for details.

## Back-end data storage

Back-end storage systems both supply files to the cluster's cache and also receive changed data from the cache. Decide whether your working set will be stored long term in a new Blob container or in an existing storage system (cloud or hardware). These back-end storage systems are called *core filers*.

### Hardware core filers

Add hardware storage systems to the vFXT cluster after you create the cluster. You can use a variety of popular hardware systems, including on-premises systems, as long as the storage system can be reached from the cluster's subnet.

Read [Configure storage](avere-vfxt-add-storage.md) for detailed instructions about how to add an existing storage system to the Avere vFXT cluster.

### Cloud core filers

The Avere vFXT for Azure system can use empty Blob containers for back-end storage. Containers must be empty when added to the cluster - the vFXT system must be able to manage its object store without needing to preserve existing data.

> [!TIP]
> If you want to use Azure Blob storage for the back end, create a new container as part of creating the vFXT cluster. The cluster creation template can create and configure a new Blob container so that it is ready to use as soon as the cluster is available. Adding a container later is more complicated.
>
> Read [Create the Avere vFXT for Azure](avere-vfxt-deploy.md#create-the-avere-vfxt-for-azure) for details.

After you add the empty Blob storage container as a core filer, you can copy data to it through the cluster. Use a parallel, multi-threaded copy mechanism. Read [Moving data to the vFXT cluster](avere-vfxt-data-ingest.md) to learn how to copy data to the cluster's new container efficiently by using client machines and the Avere vFXT cache.

## Cluster access

The Avere vFXT for Azure cluster is located in a private subnet, and the cluster does not have a public IP address. You must have some way to access the private subnet for cluster administration and client connections.

Access options include:

* Jump host - Assign a public IP address to a separate VM within the private network, and use it to create an SSL tunnel to the cluster nodes.

  > [!TIP]
  > If you set a public IP address on the cluster controller, you can use it as the jump host. Read [Cluster controller as jump host](#cluster-controller-as-jump-host) for more information.

* Virtual private network (VPN) - Configure a point-to-site or site-to-site VPN between your private network in Azure and corporate networks.

* Azure ExpressRoute - Configure a private connection through an ExpressRoute partner.

For details about these options, read the [Azure Virtual Network documentation about internet communication](../virtual-network/virtual-networks-overview.md#communicate-with-the-internet).

### Cluster controller as jump host

If you set a public IP address on the cluster controller, you can use it as a jump host to contact the Avere vFXT cluster from outside the private subnet. However, because the controller has access privileges to modify cluster nodes, this creates a small security risk.

To improve security for a controller with a public IP address, the deployment script automatically creates a network security group that restricts inbound access to port 22 only. You can further protect the system by locking down access to your range of IP source addresses - that is, only allow connections from machines you intend to use for cluster access.

When creating the cluster, you can choose whether or not to create a public IP address on the cluster controller.

* If you create a **new virtual network** or a **new subnet**, the cluster controller will be assigned a **public** IP address.
* If you select an existing virtual network and subnet, the cluster controller will have only **private** IP addresses.

## VM access roles

Azure uses [role-based access control](../role-based-access-control/index.yml) (RBAC) to authorize the cluster VMs to perform certain tasks. For example, the cluster controller needs authorization to create and configure the cluster node VMs. Cluster nodes need to be able to assign or reassign IP addresses to other cluster nodes.

Two built-in Azure roles are used for the Avere vFXT virtual machines:

* The cluster controller uses the built-in role [Avere Contributor](../role-based-access-control/built-in-roles.md#avere-contributor).
* Cluster nodes use the built-in role [Avere Operator](../role-based-access-control/built-in-roles.md#avere-operator).

If you need to customize access roles for Avere vFXT components, you must define your own role and then assign it to the VMs at the time they are created. You cannot use the deployment template in the Azure Marketplace. Consult Microsoft Customer Service and Support by opening a ticket in the Azure portal as described in [Get help with your system](avere-vfxt-open-ticket.md).

## Next step: Understand the deployment process

[Deployment overview](avere-vfxt-deploy-overview.md) gives the big-picture view of the steps needed to create an Avere vFXT for Azure system and get it ready to serve data.

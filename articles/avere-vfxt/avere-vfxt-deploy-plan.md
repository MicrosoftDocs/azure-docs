---
title: Plan your Avere vFXT system - Azure
description: Explains planning to do before deploying Avere vFXT for Azure
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 02/20/2019
ms.author: v-erkell
---

# Plan your Avere vFXT system

This article explains how to plan a new Avere vFXT for Azure cluster that is positioned and sized appropriately for your needs. 

Before going to the Azure Marketplace or creating any VMs, consider how the cluster will interact with other elements in Azure. Plan where cluster resources will be located in your private network and subnets, and decide where your back-end storage will be. Make sure that the cluster nodes you create are powerful enough to support your workflow. 

Read on to learn more.

## Resource group and network infrastructure

Consider where the elements of your Avere vFXT for Azure deployment will be. The diagram below shows a possible arrangement for the Avere vFXT for Azure components:

![Diagram showing the cluster controller and cluster VMs within one subnet. Around the subnet boundary is a vnet boundary. Inside the vnet is a hexagon representing the storage service endpoint; it is connected with a dashed arrow to a Blob storage outside the vnet.](media/avere-vfxt-components-option.png)

Follow these guidelines when planning your Avere vFXT system's network infrastructure:

* All elements should be managed with a new subscription created for the Avere vFXT deployment. Benefits include: 
  * Simpler cost tracking - View and audit all costs from resources, infrastructure, and compute cycles in one subscription.
  * Easier cleanup - You can remove the entire subscription when finished with the project.
  * Convenient partitioning of resource quotas - Protect other critical workloads from possible resource throttling by isolating the Avere vFXT clients and cluster in a single subscription. This avoids conflict when bringing up a large number of clients for a high-performance computing workflow.

* Locate your client compute systems close to the vFXT cluster. Back-end storage can be more remote.  

* The vFXT cluster and the cluster controller VM should be located in the same virtual network (vnet), in the same resource group, and use the same storage account. The automated cluster creation template handles this for most situations.

* The cluster must be located in its own subnet to avoid IP address conflicts with clients or compute resources. 

* The cluster creation template can create most of the needed infrastructure resources for the cluster, including resource groups, virtual networks, subnets, and storage accounts. If you want to use resources that already exist, make sure they meet the requirements in this table. 

  | Resource | Use existing? | Requirements |
  |----------|-----------|----------|
  | Resource group | Yes, if empty | Must be empty| 
  | Storage account | Yes if connecting an existing Blob container after cluster creation <br/>  No if creating a new Blob container during cluster creation | Existing Blob container must be empty <br/> &nbsp; |
  | Virtual network | Yes | Must include a storage service endpoint if creating a new Azure Blob container | 
  | Subnet | Yes |   |

## IP address requirements 

Make sure that your cluster's subnet has a large enough IP address range to support the cluster. 

The Avere vFXT cluster uses the following IP addresses:

* One cluster management IP address. This address can move from node to node in the cluster but is always available so that you can connect to the Avere Control Panel configuration tool.
* For each cluster node:
  * At least one client-facing IP address. (All client-facing addresses are managed by the cluster's *vserver*, which can move them among nodes as needed.)
  * One IP address for cluster communication
  * One instance IP address (assigned to the VM)

If you use Azure Blob storage, it also might require IP addresses from your cluster's vnet:  

* An Azure Blob storage account requires at least five IP addresses. Keep this requirement in mind if you locate Blob storage in the same vnet as your cluster.
* If you use Azure Blob storage that is outside the virtual network for your cluster, you should create a storage service endpoint inside the vnet. This endpoint does not use an IP address.

You have the option to locate network resources and Blob storage (if used) in different resource groups from the cluster.

## vFXT node size

The VMs that serve as cluster nodes determine the request throughput and storage capacity of your cache. <!-- The instance type offered has been chosen for its memory, processor, and local storage characteristics. You can choose from two instance types, with different memory, processor, and local storage characteristics. -->

Each vFXT node will be identical. That is, if you create a three-node cluster you will have three VMs of the same type and size. 

| Instance type | vCPUs | Memory  | Local SSD storage  | Max data disks | Uncached disk throughput | NIC (count) |
| --- | --- | --- | --- | --- | --- | --- |
| Standard_E32s_v3 | 32  | 256 GiB | 512 GiB  | 32 | 51,200 IOPS <br/> 768 MBps | 16,000 MBps (8)  |

Disk cache per node is configurable and can rage from 1000 GB to 8000 GB. 4 TB per node is the recommended cache size for Standard_E32s_v3 nodes.

For additional information about these VMs, read the Microsoft Azure documentation:

* [Memory optimized virtual machine sizes](https://docs.microsoft.com/azure/virtual-machines/windows/sizes-memory)

## Account quota

Make sure that your subscription has the capacity to run the Avere vFXT cluster as well as any computing or client systems being used. Read [Quota for the vFXT cluster](avere-vfxt-prereqs.md#quota-for-the-vfxt-cluster) for details.

## Back-end data storage

Where should the Avere vFXT cluster store your data when it's not in the cache? Decide whether your working set will be stored long term in a new Blob container or in an existing cloud or hardware storage system. 

If you want to use Azure Blob storage for the back end, you should create a new container as part of creating the vFXT cluster. This option creates and configures the new container so that it is ready to use as soon as the cluster is ready. 

Read [Create the Avere vFXT for Azure](avere-vfxt-deploy.md#create-the-avere-vfxt-for-azure) for details.

> [!NOTE]
> Only empty Blob storage containers can be used as core filers for the Avere vFXT system. The vFXT must be able to manage its object store without needing to preserve existing data. 
>
> Read [Moving data to the vFXT cluster](avere-vfxt-data-ingest.md) to learn how to copy data to the cluster's new container efficiently by using client machines and the Avere vFXT cache.

If you want to use an existing on-premises storage system, you must add it to the vFXT cluster after it is created. Read [Configure storage](avere-vfxt-add-storage.md) for detailed instructions about how to add an existing storage system to the Avere vFXT cluster.

## Cluster access 

The Avere vFXT for Azure cluster is located in a private subnet, and the cluster does not have a public IP address. You must have some method of accessing the private subnet for cluster administration and client connections. 

Access options include:

* Jump host - Assign a public IP address to a separate VM within the private network, and use it to create an SSL tunnel to the cluster nodes. 

  > [!TIP]
  > If you set a public IP address on the cluster controller, you can use it as the jump host. Read [Cluster controller as jump host](#cluster-controller-as-jump-host) for more information.

* Virtual private network (VPN) - Configure a point-to-site or site-to-site VPN to your private network.

* Azure ExpressRoute - Configure a private connection through an ExpressRoute partner. 

For details about these options, read the [Azure Virtual Network documentation about internet communication](../virtual-network/virtual-networks-overview.md#communicate-with-the-internet).

### Cluster controller as jump host

If you set a public IP address on the cluster controller, you can use it as a jump host to contact the Avere vFXT cluster from outside the private subnet. However, because the controller has access privileges to modify cluster nodes, this creates a small security risk.  

To improve security for a controller with a public IP address, the deployment script automatically creates a network security group that restricts inbound access to port 22 only. You can further protect the system by locking down access to your range of IP source addresses - that is, only allow connections from machines you intend to use for cluster access.

When creating the cluster, you can choose whether or not to create a public IP address on the cluster controller. 

* If you create a new vnet or a new subnet, the cluster controller will be assigned a public IP address.
* If you select an existing vnet and subnet, the cluster controller will have only private IP addresses. 

## VM access roles 

Azure uses [role-based access control](../role-based-access-control/index.yml) (RBAC) to authorize the cluster VMs to perform certain tasks. For example, the cluster controller needs authorization to create and configure the cluster node VMs. The cluster nodes need to be able to assign or reassign IP addresses to other cluster nodes.

Two built-in Azure roles are used for the Avere vFXT virtual machines: 

* The cluster controller uses the built-in role [Avere Contributor](../role-based-access-control/built-in-roles.md#avere-contributor). 
* Cluster nodes use the built-in role [Avere Operator](../role-based-access-control/built-in-roles.md#avere-operator)

If you need to customize access roles for Avere vFXT components, you must define your own role and then assign it to the VMs at the time they are created. You cannot use the deployment template in the Azure Marketplace. Consult Microsoft Customer Service and Support by opening a ticket in the Azure portal as described in [Get help with your system](avere-vfxt-open-ticket.md). 

## Next step: Understand the deployment process

[Deployment overview](avere-vfxt-deploy-overview.md) gives the big picture of all of the steps needed to create an Avere vFXT for Azure system and get it ready to serve data.  
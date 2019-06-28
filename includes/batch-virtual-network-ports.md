---
title: include file
description: include file
services: batch
documentationcenter: 
author: laurenhughes
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: batch
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: na
ms.workload: 
ms.date: 04/10/2019
ms.author: lahugh
ms.custom: include file 
---

### General requirements

* The VNet must be in the same subscription and region as the Batch account you use to create your pool.

* The pool using the VNet can have a maximum of 4096 nodes.

* The subnet specified for the pool must have enough unassigned IP addresses to accommodate the number of VMs targeted for the pool; that is, the sum of the `targetDedicatedNodes` and `targetLowPriorityNodes` properties of the pool. If the subnet doesn't have enough unassigned IP addresses, the pool partially allocates the compute nodes, and a resize error occurs. 

* Your Azure Storage endpoint needs to be resolved by any custom DNS servers that serve your VNet. Specifically, URLs of the form `<account>.table.core.windows.net`, `<account>.queue.core.windows.net`, and `<account>.blob.core.windows.net` should be resolvable. 

Additional VNet requirements differ, depending on whether the Batch pool is in the Virtual Machine configuration or the Cloud Services configuration. For new pool deployments into a VNet, the Virtual Machine configuration is recommended.

### Pools in the Virtual Machine configuration

**Supported VNets** - Azure Resource Manager-based VNets only

**Subnet ID** - When specifying the subnet using the Batch APIs, use the *resource identifier* of the subnet. The subnet identifier is of the form:

  ```
  /subscriptions/{subscription}/resourceGroups/{group}/providers/Microsoft.Network/virtualNetworks/{network}/subnets/{subnet}
  ```

**Permissions** - Check whether your security policies or locks on the VNet's subscription or resource group restrict a user's permissions to manage the VNet.

**Additional networking resources** - Batch automatically allocates additional networking resources in the resource group containing the VNet. For each 50 dedicated nodes (or each 20 low-priority nodes), Batch allocates: 1 network security group (NSG), 1 public IP address, and 1 load balancer. These resources are limited by the subscription's [resource quotas](../articles/azure-subscription-service-limits.md). For large pools you may need to request a quota increase for one or more of these resources.

#### Network security groups

The subnet must allow inbound communication from the Batch service to be able to schedule tasks on the compute nodes, and outbound communication to communicate with Azure Storage or other resources. For pools in the Virtual Machine configuration, Batch adds NSGs at the level of network interfaces (NICs) attached to VMs. These NSGs automatically configure inbound and outbound rules to allow the following traffic:

* Inbound TCP traffic on ports 29876 and 29877 from Batch service role IP addresses. 
* Inbound TCP traffic on port 22 (Linux nodes) or port 3389 (Windows nodes) to permit remote access. For certain types of multi-instance tasks on Linux (such as MPI), you will need to also allow SSH port 22 traffic for IPs in the subnet containing the Batch compute nodes.
* Outbound traffic on any port to the virtual network.
* Outbound traffic on any port to the internet.

> [!IMPORTANT]
> Exercise caution if you modify or add inbound or outbound rules in Batch-configured NSGs. If communication to the compute nodes in the specified subnet is denied by an NSG, then the Batch service sets the state of the compute nodes to **unusable**.

You do not need to specify NSGs at the subnet level because Batch configures its own NSGs. However, if the specified subnet has associated Network Security Groups (NSGs) and/or a firewall, configure the inbound and outbound security rules as shown in the following tables. Configure inbound traffic on port 3389 (Windows) or 22 (Linux) only if you need to permit remote access to the pool VMs from outside sources. It is not required for the pool VMs to be usable. Note that you will need to enable virtual network subnet traffic on port 22 for Linux if using certain kinds of multi-instance tasks such as MPI.

**Inbound security rules**

| Source IP addresses | Source service tag | Source ports | Destination | Destination ports | Protocol | Action |
| --- | --- | --- | --- | --- | --- | --- |
| N/A | `BatchNodeManagement` [Service tag](../articles/virtual-network/security-overview.md#service-tags) | * | Any | 29876-29877 | TCP | Allow |
| User source IPs for remotely accessing compute nodes and/or compute node subnet for Linux multi-instance tasks, if required. | N/A | * | Any | 3389 (Windows), 22 (Linux) | TCP | Allow |

**Outbound security rules**

| Source | Source ports | Destination | Destination service tag | Destination ports | Protocol | Action |
| --- | --- | --- | --- | --- | --- | --- |
| Any | * | [Service tag](../articles/virtual-network/security-overview.md#service-tags) | `Storage` (in the same region as your Batch account and VNet) | 443 | TCP | Allow |

### Pools in the Cloud Services configuration

**Supported VNets** - Classic VNets only

**Subnet ID** - When specifying the subnet using the Batch APIs, use the *resource identifier* of the subnet. The subnet identifier is of the form:

  ```
  /subscriptions/{subscription}/resourceGroups/{group}/providers/Microsoft.ClassicVirtualNetwork /virtualNetworks/{network}/subnets/{subnet}
  ```

**Permissions** - The `MicrosoftAzureBatch` service principal must have the `Classic Virtual Machine Contributor` Role-Based Access Control (RBAC) role for the specified VNet.

#### Network security groups

The subnet must allow inbound communication from the Batch service to be able to schedule tasks on the compute nodes, and outbound communication to communicate with Azure Storage or other resources.

You do not need to specify an NSG, because Batch configures inbound communication only from Batch IP addresses to the pool nodes. However, If the specified subnet has associated NSGs and/or a firewall, configure the inbound and outbound security rules as shown in the following tables. If communication to the compute nodes in the specified subnet is denied by an NSG, then the Batch service sets the state of the compute nodes to **unusable**.

Configure inbound traffic on port 3389 for Windows if you need to permit RDP access to the pool nodes. It is not required for the pool nodes to be usable.

**Inbound security rules**

| Source IP addresses | Source ports | Destination | Destination ports | Protocol | Action |
| --- | --- | --- | --- | --- | --- |
Any <br /><br />Although this requires effectively "allow all", the Batch service applies an ACL rule at the level of each node that filters out all non-Batch service IP addresses. | * | Any | 10100, 20100, 30100 | TCP | Allow |
| Optional, to allow RDP access to compute nodes. | * | Any | 3389 | TCP | Allow |

**Outbound security rules**

| Source | Source ports | Destination | Destination ports | Protocol | Action |
| --- | --- | --- | --- | --- | --- |
| Any | * | Any | 443  | Any | Allow |

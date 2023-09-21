---
title: Provision a pool in a virtual network
description: Learn how to create a Batch pool in an Azure virtual network so that compute nodes can communicate securely with other VMs in the network, such as a file server.
ms.topic: how-to
ms.date: 09/20/2023
ms.custom: seodec18
---

# Create an Azure Batch pool in a virtual network

When you create an Azure Batch pool, you can provision the pool in a subnet of an [Azure Virtual Network](../virtual-network/virtual-networks-overview.md) that you specify. This article explains how to set up a Batch pool in a Virtual Network.

## Why use a Virtual Network?

Compute nodes in a pool can communicate with each other, such as to run multi-instance tasks, without requiring a
separate Virtual Network. However, by default, nodes in a pool can't communicate with any virtual machine (VM) that is outside of the pool, such as license or file servers.

To allow compute nodes to communicate securely with other virtual machines, or with an on-premises network, you can provision the pool in a subnet of a Virtual Network.

## Prerequisites

- **Authentication**. To use an Azure Virtual Network, the Batch client API must use Azure Active Directory (Azure AD) authentication. To learn more, see [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).

- **An Azure Virtual Network**. To prepare a Virtual Network with one or more subnets in advance, you can use the Azure portal, Azure PowerShell, the Microsoft Azure CLI (CLI), or other methods.
  - To create an Azure Resource Manager-based Virtual Network, see [Create a virtual network](../virtual-network/manage-virtual-network.md#create-a-virtual-network). A Resource Manager-based Virtual Network is recommended for new deployments, and is supported only on pools that use Virtual Machine Configuration.
  - To create a classic Virtual Network, see [Create a virtual network (classic) with multiple subnets](/previous-versions/azure/virtual-network/create-virtual-network-classic). A classic Virtual Network is supported only on pools that use Cloud Services Configuration.

## General virtual network requirements

* The Virtual Network must be in the same subscription and region as the Batch account you use to create your pool.

* The subnet specified for the pool must have enough unassigned IP addresses to accommodate the number of VMs targeted for the pool, enough to accommodate the `targetDedicatedNodes` and `targetLowPriorityNodes` properties of the pool. If the subnet doesn't have enough unassigned IP addresses, the pool partially allocates the compute nodes, and a resize error occurs.

* If you aren't using [Simplified Compute Node Communication](simplified-compute-node-communication.md), you need to resolve your Azure Storage endpoints by using any custom DNS servers that serve your virtual network. Specifically,
URLs of the form `<account>.table.core.windows.net`, `<account>.queue.core.windows.net`, and
`<account>.blob.core.windows.net` should be resolvable.

* Multiple pools can be created in the same virtual network or in the same subnet (as long as it has sufficient address space). A single pool can't exist across multiple virtual networks or subnets.

Other virtual network requirements differ, depending on whether the Batch pool is in the `VirtualMachineConfiguration`
or `CloudServiceConfiguration`. `VirtualMachineConfiguration` for Batch pools is recommended, because `CloudServiceConfiguration`
pools are [deprecated](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/).

> [!IMPORTANT]
> Batch pools can be configured in one of two node communication modes. Classic node communication mode is
> where the Batch service initiates communication to the compute nodes.
> [Simplified](simplified-compute-node-communication.md) node communication mode
> is where the compute nodes initiate communication to the Batch Service.

## Pools in Virtual Machine Configuration

Requirements:

- Supported Virtual Networks: Azure Resource Manager-based virtual networks only.
- Subnet ID: when specifying the subnet using the Batch APIs, use the *resource identifier* of the subnet. The subnet identifier is of the form:

`/subscriptions/{subscription}/resourceGroups/{group}/providers/Microsoft.Network/virtualNetworks/{network}/subnets/{subnet}`

- Permissions: check whether your security policies or locks on the Virtual Network's subscription or resource group restrict a user's permissions to manage the Virtual Network.
- Networking resources: Batch automatically creates more networking resources in the resource group containing the Virtual Network.

> [!IMPORTANT]
> For each 100 dedicated or low-priority nodes, Batch creates one network security group (NSG), one public IP address,
> and one load balancer. These resources are limited by the subscription's
> [resource quotas](../../articles/azure-resource-manager/management/azure-subscription-service-limits.md).
> For large pools, you might need to request a quota increase for one or more of these resources.

### Network security groups for Virtual Machine Configuration pools: Batch default

Batch creates a network security group (NSG) at the network interface level of each Virtual Machine Scale
Set deployment within a Batch pool. For pools that don't have public IP addresses under `simplified` compute
node communication, NSGs aren't created.

In order to provide the necessary communication between compute nodes and the Batch service, these NSGs are
configured such that:

* Inbound TCP traffic on ports 29876 and 29877 from Batch service IP addresses that correspond to the
BatchNodeManagement.*region* service tag. This rule is only created in `classic` pool communication mode.
* Inbound TCP traffic on port 22 (Linux nodes) or port 3389 (Windows nodes) to permit remote access for SSH or RDP on default ports, respectively. For certain types of multi-instance tasks on Linux, such as MPI, you may need to allow SSH traffic for IPs in the subnet containing Batch compute nodes. Certain MPI runtimes may require launching over SSH, which is typically routed on private IP address space. This traffic might be blocked per subnet-level NSG rules.
* Outbound any traffic on port 443 to Batch service IP addresses that correspond to the BatchNodeManagement.*region* service tag.
* Outbound traffic on any port to the virtual network. This rule might be amended per subnet-level NSG rules.
* Outbound traffic on any port to the Internet. This rule might be amended per subnet-level NSG rules.

> [!IMPORTANT]
> Use caution if you modify or add inbound or outbound rules in Batch-configured NSGs. If communication to the compute nodes in the specified subnet is denied by an NSG, the Batch service will set the state of the compute nodes to **unusable**. Additionally, no resource locks should be applied to any resource created by Batch, because this can prevent cleanup of resources as a result of user-initiated actions such as deleting a pool.

### Network security groups for Virtual Machine Configuration pools: Specifying subnet-level rules

If you have an NSG associated with the subnet for Batch compute nodes, you must configure this
NSG with at least the inbound and outbound security rules that are shown in the following tables.

> [!WARNING]
> Batch service IP addresses can change over time. Therefore, you should use the
> BatchNodeManagement.*region* service tag for the NSG rules indicated in the following tables. Avoid
> populating NSG rules with specific Batch service IP addresses.

#### Inbound security rules

| Source Service Tag or IP Addresses | Destination Ports | Protocol | Pool Communication Mode | Required |
|-|-|-|-|-|
| BatchNodeManagement.*region* [service tag](../../articles/virtual-network/network-security-groups-overview.md#service-tags) | 29876-29877 | TCP | Classic | Yes |
| Source IP addresses for remotely accessing compute nodes | 3389 (Windows), 22 (Linux) | TCP | Classic or Simplified | No |

Configure inbound traffic on port 3389 (Windows) or 22 (Linux) only if you need to permit remote access
to the compute nodes from outside sources on default RDP or SSH ports, respectively. You might need to allow
SSH traffic on Linux if you require support for multi-instance tasks with certain Message Passing Interface
(MPI) runtimes in the subnet containing the Batch compute nodes as traffic may be blocked per subnet-level NSG
rules. MPI traffic is typically over private IP address space, but can vary between MPI runtimes and runtime
configuration. Allowing traffic on these ports isn't strictly required for the pool compute nodes to be usable.
You can also disable default remote access on these ports through configuring [pool endpoints](pool-endpoint-configuration.md).

#### Outbound security rules

| Destination Service Tag | Destination Ports | Protocol | Pool Communication Mode | Required |
|-|-|-|-|-|
| BatchNodeManagement.*region* [service tag](../../articles/virtual-network/network-security-groups-overview.md#service-tags) | 443 | * | Simplified | Yes |
| Storage.*region* [service tag](../../articles/virtual-network/network-security-groups-overview.md#service-tags) | 443 | TCP | Classic | Yes |

Outbound to BatchNodeManagement.*region* service tag is required in `classic` pool communication mode
if you're using Job Manager tasks or if your tasks must communicate back to the Batch service. For outbound to
BatchNodeManagement.*region* in `simplified` pool communication mode, the Batch service currently only
uses TCP protocol, but UDP might be required for future compatibility. For
[pools without public IP addresses](simplified-node-communication-pool-no-public-ip.md)
using `simplified` communication mode and with a node management private endpoint, an NSG isn't needed.
For more information about outbound security rules for the BatchNodeManagement.*region* service tag, see
[Use simplified compute node communication](simplified-compute-node-communication.md).

## Pools in the Cloud Services Configuration

> [!WARNING]
> Cloud Services Configuration pools are [deprecated](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/). Use Virtual Machine Configuration pools instead.

Requirements:

- Supported Virtual Networks: Classic Virtual Networks only.
- Subnet ID: when specifying the subnet using the Batch APIs, use the *resource identifier* of the subnet. The subnet identifier is of the form:

    `/subscriptions/{subscription}/resourceGroups/{group}/providers/Microsoft.ClassicNetwork/virtualNetworks/{network}/subnets/{subnet}`

- Permissions: the `Microsoft Azure Batch` service principal must have the `Classic Virtual Machine Contributor` Azure role for the specified Virtual Network.

### Network security groups for Cloud Services Configuration pools

The subnet must allow inbound communication from the Batch service to be able to schedule tasks on the compute nodes, and it must allow outbound communication to communicate with Azure Storage or other resources.

You don't need to specify an NSG, because Batch configures inbound communication only from Batch IP addresses to the pool nodes. However, If the specified subnet has associated NSGs and/or a firewall, configure the inbound and outbound security rules as shown in the following tables. If communication to the compute nodes in the specified subnet is denied by an NSG, the Batch service sets the state of the compute nodes to **unusable**.

Configure inbound traffic on port 3389 for Windows if you need to permit RDP access to the pool nodes. This rule isn't required for the pool nodes to be usable.

**Inbound security rules**

| Source IP addresses | Source ports | Destination | Destination ports | Protocol | Action |
| --- | --- | --- | --- | --- | --- |
Any <br /><br />Although this rule effectively requires *allow all*, the Batch service applies an ACL rule at the level of each node that filters out all non-Batch service IP addresses. | * | Any | 10100, 20100, 30100 | TCP | Allow |
| Optional, to allow RDP access to compute nodes. | * | Any | 3389 | TCP | Allow |

**Outbound security rules**

| Source | Source ports | Destination | Destination ports | Protocol | Action |
| --- | --- | --- | --- | --- | --- |
| Any | * | Any | 443  | Any | Allow |

## Create a pool with a Virtual Network in the Azure portal

After you've created your Virtual Network and assigned a subnet to it, you can create a Batch pool with that Virtual Network. Follow these steps to create a pool from the Azure portal: 

1. Search for and select **Batch accounts** in the search bar at the top of the Azure portal. Select your Batch account. This account must be in the same subscription and region as the resource group containing the Virtual Network you intend to use.
1. Select **Pools** from the left navigation.
1. On the **Pools** window, select **Add**.

    :::image type="content" source="./media/batch-virtual-network/batch-add-pool.png" alt-text="Screenshot of the Pools page in a Batch account that highlights the Pools option in the left side navigation and add button on the Pools page.":::

1. On the **Add Pool** page, select the options and enter the information for your pool. For more information on creating pools for your Batch account, see [Create a pool of compute nodes](/azure/batch/quick-create-portal?branch=main#create-a-pool-of-compute-nodes).
**Node size**, **Target dedicated nodes**, and **Target Spot/low-priority nodes**, and any desired optional settings.
1. In **Virtual Network**, select the virtual network and subnet you wish to use.
1. Select **OK** to create your pool.

> [!IMPORTANT]
> If you try to delete a subnet which is being used by a pool, you will get an error message. All pools using a subnet must be deleted before you delete that subnet.

## User-defined routes for forced tunneling

You might have requirements in your organization to redirect (force) internet-bound traffic from the subnet back to your on-premises location for inspection and logging. Additionally, you might have enabled forced tunneling for the subnets in your Virtual Network.

To ensure that the nodes in your pool work in a Virtual Network that has forced tunneling enabled, you must add the following [user-defined routes](../virtual-network/virtual-networks-udr-overview.md) (UDR) for that subnet.

For classic communication mode pools:

- The Batch service needs to communicate with nodes for scheduling tasks. To enable this communication, add a UDR corresponding to the BatchNodeManagement.*region* [service tag](../virtual-network/virtual-networks-udr-overview.md#service-tags-for-user-defined-routes) in the region where your Batch account exists. Set the **Next hop type** to **Internet**.

- Ensure that your on-premises network isn't blocking outbound TCP traffic to Azure Storage on destination port 443 (specifically, URLs of the form `*.table.core.windows.net`, `*.queue.core.windows.net`, and `*.blob.core.windows.net`).

For [simplified communication mode](simplified-compute-node-communication.md) pools without using node management private endpoint:

- Ensure that your on-premises network isn't blocking outbound TCP/UDP traffic to the Azure Batch BatchNodeManagement.*region* service tag on destination port 443. Currently only TCP protocol is used, but UDP might be required for future compatibility.

For all pools:

- If you use virtual file mounts, review the [networking requirements](virtual-file-mount.md#networking-requirements), and ensure that no required traffic is blocked.

> [!WARNING]
> Batch service IP addresses can change over time. To prevent outages due to Batch service IP address changes, do not directly specify IP addresses. Instead use the BatchNodeManagement.*region* [service tag](../virtual-network/virtual-networks-udr-overview.md#service-tags-for-user-defined-routes).

## Next steps

- [Batch service workflow and resources](batch-service-workflow-features.md)
- [Tutorial: Route network traffic with a route table using the Azure portal](../virtual-network/tutorial-create-route-table-portal.md)

---
title: Azure Configuration
description: Understand how to prepare your Azure subscription for Azure CycleCloud. Configure a virtual network, a subnet, and a network security group.
author: bwatrous
ms.date: 03/25/2020
ms.author: bewatrou
---

# Configure your Azure Subscription

In order to run Azure CycleCloud, you will need a valid Azure Subscription and [Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview).

Generally, Azure Tenant and Subscription creation and configuration decisions are business decisions outside the scope of the Azure CycleCloud documentation.  However, since HPC and big compute applications in general are resource intensive, it is worth considering creating a dedicated subscription to track billing, apply usage limits and isolate resource and API usage. For more information on designing your Azure tenant and subscriptions, see [Azure subscription management](https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/subscriptions/).

## Configure a Virtual Network

You will need to select an existing Azure Virtual Network and subnets or create a new Virtual Network in which to run the CycleCloud VM and the compute clusters that will be managed by CycleCloud.

If the Virtual Network has not already been created, then you may want to consider starting from the provided [CycleCloud ARM Template Deployment](./install-arm.md). The CycleCloud ARM template creates a new virtual network for CycleCloud and the compute clusters at deployment time.  Alternatively, you can follow these instructions to [create a new Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal).

Next, if Express Route or VPN are not already configured for your Virtual Network, it is possible to connect to your Virtual Network over the public internet, but it is strongly recommended that you [configure a VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).

## Configure a Subnet and Network Security Group

Since CycleCloud generally has different network security requirements and access policies than the compute clusters, it is often good practice to run Azure CycleCloud in a different Azure Subnet from the clusters.

The recommended best practice is to use at least two subnets - one for the CycleCloud VM and any other VMs with the same access policies, and additional subnets for the compute clusters. However, keep in mind that for large clusters, the IP range of the subnet may become a limiting factor. So, in general, the CycleCloud subnet should use a small CIDR range and compute subnets should be large.

Follow the instructions here to [create one or more subnets in your Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-subnet#add-a-subnet).

### Using multiple Subnets for compute

CycleCloud clusters may be configured to run nodes and nodearrays across multiple subnets as long as all VMs can communicate within the cluster and with CycleCloud (perhaps via [Return Proxy](./return-proxy.md)).  For example, it is often useful to launch the Master node or submitter nodes in a subnet with different security rules from the execute nodes.  The default cluster types in CycleCloud assume a single subnet for the entire cluster, but the subnet may be configured per node or nodearray using the `SubnetId` attribute in the node template.

However, the default hosts-file based hostname resolution applied to CycleCloud clusters only generates a hosts-file for the node's subnet by default.  So, when creating a cluster that spans multiple subnets, hostname resolution must also be customized for the cluster.

There are 2 basic cluster template changes required to support multiple compute subnets:

1. Set the `SubnetId` attribute on each node or nodearray that is not in the default subnet for the cluster.
2. Configure hostname resolution for all subnets, by either:
   1. Using an Azure DNS Zone and disabling the default hosts-file based resolution
   2. Or, set the `CycleCloud.hosts.standalone_dns.subnets` attribute to either CIDR range of the VNet, or a comma-separated list of CIDR ranges for each subnet.  See the [node Configuration Reference](../cluster-references/configuration-reference.md) for details.

## Network Security Group Settings for the CycleCloud Subnet

Configuring your Azure Virtual Network for security is a broad topic, well beyond the scope of this document.

CycleCloud and CycleCloud clusters may operate in very locked down environments. See [Running in Locked Down Networks](./running-in-locked-down-network.md) and [Running behind a Proxy](./running-behind-proxy.md) for configuration details.

However, for less restrictive networks, there are a few general guidelines.  First, CycleCloud GUI users require access to the CycleCloud VM via HTTPS and administrators may require SSH access. Cluster users will generally require SSH access to at least the submission nodes in the compute clusters and potentially other access such as RDP for Windows clusters. The last general rule is to restrict access to the minimum required.

To create a new Network Security Group for each of the subnets created above, follow the guide to [creating a Network Security Group](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic#create-a-network-security-group).

### Inbound Security Rules

> [!IMPORTANT]
> The following rules assume that your virtual network is configured with Express Route or VPN for private network access.
> If running over the public internet, then the Source should be changed to your public IP address or corporate IP range.

#### CycleCloud VM Subnet

| Name    | Priority | Source            | Service | Protocol | Port Range |
| ------- | -------- | ----------------- | ------- | -------- | ---------- |
| SSH     | 100      | VirtualNetwork    | Custom  | TCP      | 22         |
| HTTPS   | 110      | VirtualNetwork    | Custom  | TCP      | 443        |
| HTTPS   | 110      | VirtualNetwork    | Custom  | TCP      | 9443       |

#### Compute Subnets

| Name    | Priority | Source | Service  | Protocol | Port Range |
| ------- | -------- | ----------------- | ------- | -------- | ---------- |
| SSH     | 100      | VirtualNetwork    | Custom  | TCP      | 22         |
| RDP     | 110      | VirtualNetwork    | Custom  | TCP      | 3389       |
| Ganglia | 120      | VirtualNetwork    | Custom  | TCP      | 8652       |

### Outbound Security Rules

In general, the CycleCloud VM and the compute clusters expect to be able to access the internet for package installation and Azure REST API calls.

If outbound internet access is blocked by security policy, then follow the instructions for [Running in Locked Down Networks](./running-in-locked-down-network.md) and [Running behind a Proxy](./running-behind-proxy.md) for configuration details.

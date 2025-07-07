---
title: Azure Configuration
description: Understand how to prepare your Azure subscription for Azure CycleCloud. Configure a virtual network, a subnet, and a network security group.
author: bwatrous
ms.date: 06/30/2025
ms.author: bewatrou
---

# Configure your Azure subscription

To run Azure CycleCloud, you need a valid Azure subscription and a [virtual network](/azure/virtual-network/virtual-networks-overview).

Generally, business decision makers handle Azure tenant and subscription creation and configuration. However, because HPC and big compute applications use a lot of resources, consider creating a dedicated subscription to track billing, set usage limits, and isolate resource and API usage. For more information on designing your Azure tenant and subscriptions, see [Azure subscription management](/azure/cloud-adoption-framework/decision-guides/subscriptions/).

## Configure a virtual network

Select an existing Azure Virtual Network and subnets or create a new virtual network to run the CycleCloud VM and the compute clusters that CycleCloud manages.

If you didn't already create the virtual network, consider starting with the provided [CycleCloud ARM Template Deployment](./install-arm.md). The CycleCloud ARM template creates a new virtual network for CycleCloud and the compute clusters during deployment. Alternatively, you can follow these instructions to [create a new virtual network](/azure/virtual-network/quick-create-portal).

Next, if you didn't already configure Express Route or VPN for your virtual network, you can connect to your virtual network over the public internet. However, we strongly recommend that you [configure a VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways).

## Configure a subnet and network security group

Since CycleCloud generally has different network security requirements and access policies than the compute clusters, it's often good practice to run Azure CycleCloud in a different Azure Subnet from the clusters.

The recommended best practice is to use at least two subnets - one for the CycleCloud VM and any other VMs with the same access policies, and additional subnets for the compute clusters. However, keep in mind that for large clusters, the IP range of the subnet might become a limiting factor. So, in general, the CycleCloud subnet should use a small CIDR range and compute subnets should be large.

To [create one or more subnets in your virtual network](/azure/virtual-network/virtual-network-manage-subnet#add-a-subnet), follow the instructions in the linked article.

### Using multiple subnets for compute

You can configure CycleCloud clusters to run nodes and node arrays across multiple subnets as long as all VMs can communicate within the cluster and with CycleCloud (perhaps via [Return Proxy](./return-proxy.md)). For example, it's often useful to launch the scheduler node or submitter nodes in a subnet with different security rules from the execute nodes. The default cluster types in CycleCloud assume a single subnet for the entire cluster, but you can configure the subnet for each node or node array by using the `SubnetId` attribute in the node template.

However, the default hosts-file based hostname resolution applied to CycleCloud clusters only generates a hosts-file for the node's subnet. So, when you create a cluster that spans multiple subnets, you must customize hostname resolution for the cluster.

To support multiple compute subnets, you need to make two basic cluster template changes:

1. Set the `SubnetId` attribute on each node or node array that isn't in the default subnet for the cluster.
1. Configure hostname resolution for all subnets by either:
   * Using an Azure DNS Zone and disabling the default hosts-file based resolution
   * Setting the `CycleCloud.hosts.standalone_dns.subnets` attribute to either CIDR range of the VNet or a comma-separated list of CIDR ranges for each subnet. See the [node Configuration Reference](../cluster-references/configuration-reference.md) for details.

## Network security group settings for the CycleCloud subnet

Configuring your Azure Virtual Network for security is a broad topic, well beyond the scope of this document.

CycleCloud and CycleCloud clusters can run in locked down environments. For configuration details, see [Running in Locked Down Networks](./running-in-locked-down-network.md) and [Running behind a Proxy](./running-behind-proxy.md).

However, for less restrictive networks, follow these general guidelines. First, CycleCloud GUI users need access to the CycleCloud VM through HTTPS, and administrators might need SSH access. Cluster users usually need SSH access to at least the submission nodes in the compute clusters and possibly other access like RDP for Windows clusters. The last general rule is to restrict access to the minimum required.

To create a new network security group for each of the subnets you created, see [create a network security group](/azure/virtual-network/tutorial-filter-network-traffic#create-a-network-security-group).

### Inbound security rules

> [!IMPORTANT]
> The following rules assume that your virtual network is configured with ExpressRoute or VPN for private network access.
> If running over the public internet, change the source to your public IP address or corporate IP range.

#### CycleCloud VM Subnet

| Name    | Priority | Source            | Service | Protocol | Port Range |
| ------- | -------- | ----------------- | ------- | -------- | ---------- |
| SSH     | 100      | VirtualNetwork    | Custom  | TCP      | 22         |
| HTTPS   | 110      | VirtualNetwork    | Custom  | TCP      | 443        |
| HTTPS   | 110      | VirtualNetwork    | Custom  | TCP      | 9443       |

#### Compute Subnets

| Name    | Priority | Source           | Service | Protocol | Port Range |
| ------- | -------- | ---------------- | ------- | -------- | ---------- |
| SSH     | 100      | VirtualNetwork   | Custom  | TCP      | 22         |
| RDP     | 110      | VirtualNetwork   | Custom  | TCP      | 3389       |
| Ganglia | 120      | VirtualNetwork   | Custom  | TCP      | 8652       |

### Outbound Security Rules

In general, the CycleCloud VM and the compute clusters need to access the internet for package installation and Azure REST API calls.

If security policy blocks outbound internet access, follow the instructions for [Running in Locked Down Networks](./running-in-locked-down-network.md) and [Running behind a Proxy](./running-behind-proxy.md) for configuration details.

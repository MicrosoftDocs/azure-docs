---
title: Network Security Options
description: Review Azure CycleCloud network security options. See options for network interfaces, network security groups, and input endpoints in node arrays.
author: adriankjohnson
ai-usage: ai-assisted
ms.date: 08/10/2026
ms.topic: how-to
ms.author: adjohnso
---

# Node networking configuration

An Azure CycleCloud cluster node comes with default settings for networking. You can change these settings in the node definition section of the cluster template.

## Network interfaces

When Azure CycleCloud creates an Azure VM for a cluster, it attaches a virtual network interface to the VM. For virtual machine scale sets, the virtual network interface connects to a load balancer.

You can configure the network settings for nodes by changing the network interface definition section of the node in the cluster template.

### Assigning public IP addresses

Add an `AssociatePublicIpAddress` attribute to a node to specify whether the node should receive a public IP address. For example:

``` ini
[[node scheduler]]
[[[network-interface eth0]]]
    AssociatePublicIpAddress = true
```

The preceding configuration allows public access to the scheduler node on ports that the Network Security Group for the Virtual Network allows.

By default, the node gets a dynamic public IP address that changes each time you start the cluster. To assign a static public IP address to your node, first [create a public IP address in your Azure subscription](/azure/virtual-network/virtual-network-public-ip-address). Then add the `PublicIP` attribute to your node network-interface section, and assign it the resource ID for the created PublicIP object.

``` ini
[[node scheduler]]
[[[network-interface eth0]]]
    PublicIp = /subscriptions/${subscription_id/resourceGroups/${resource_group_name}/providers/Microsoft.Network/publicIPAddresses/${public-ip-name}
```

Alternatively, create a network interface in your Azure subscription, and [attach a public IP address to that network interface.](/azure/virtual-network/virtual-network-network-interface-addresses). Then, specify that network interface ID in the node config:

``` ini
[[node scheduler]]
[[[network-interface eth0]]]
    NetworkInterfaceId = /subscriptions/${subscription_id/resourceGroups/${resource_group_name}/providers/Microsoft.Network/networkInterfaces/${network-interface-name}
```

### Assigning a Public DNS Label

Adding `PublicDnsLabel` to a public network interface lets you customize the DNS name for that IP address.

``` ini
[[node scheduler]]
[[network-interface eth0]]
    AssociatePublicIpAddress = true
    PublicDnsLabel = myuniquename
```

The preceding configuration gives you a statically assigned public IP address and a DNS entry for the VM that resolves to `myuniquename.eastus.cloudapp.azure.com` (with `eastus` matching the corresponding Azure location for the VM).

### Assigning a private IP address

By default, virtual machines get a dynamically assigned private IP address in Azure. In some cases, you need fixed private IP addresses for the nodes. To configure this option, use the network-interface section of your cluster configuration:

``` ini
[[[network-interface eth0]]]
PrivateIp = x.x.x.x
```

The private IP address you specify must be valid for the associated subnet. Azure reserves the first four and last IPs in the subnet. You can't manually assign these addresses to a node.

## Network security groups

Azure CycleCloud provisions virtual machines and virtual machine scale sets in user-defined virtual networks and subnets. The network security groups associated with the virtual network govern access to specific ports on nodes. For more information, see [Virtual Network Documentation](/azure/virtual-network/security-overview).

If you configure a node's network interface with `AssociatePublicIpAddress = true` or assign a `PublicIp`, the node automatically receives a network security group.

You can specify this network security group by using `SecurityGroup`. If you omit `SecurityGroup`, the network security group is automatically generated from the `input-endpoints` sections on the node. The `SecurityGroup` you specify for an interface overrides the auto-nsg created for `input-endpoints`. Unless you specify a `SecurityGroup`, all interfaces get the auto-nsg from the `input-endpoint` definitions.

## Required ports and traffic

Use the following tables as the authoritative traffic matrix when you configure network security groups (NSGs), firewalls, or route appliances for CycleCloud. **Inbound** and **outbound** describe the rule direction on the destination and source, respectively. Restrict each source and destination to the applicable subnet, private IP address, or approved client range.

### CycleCloud and cluster traffic

| Source | Destination | Direction | Protocol | Port | Purpose | Applicability |
| --- | --- | --- | --- | --- | --- | --- |
| Administrators and API clients | CycleCloud VM | Inbound | TCP | 443 | CycleCloud web interface and API over HTTPS | Required for users and tools that access CycleCloud. Use approved private or corporate source ranges. |
| Administrators | CycleCloud VM | Inbound | TCP | 22 | Administrative SSH access | Optional. Prefer Azure Bastion, VPN, or ExpressRoute, and limit the source. |
| Cluster nodes | CycleCloud VM | Outbound from cluster nodes; inbound to CycleCloud | TCP | 9443 | Node status, autoscaling API requests, and service synchronization over HTTPS | Required for direct node-to-CycleCloud communication in CycleCloud 8. |
| CycleCloud VM | Return proxy node | Outbound from CycleCloud; inbound to the proxy | TCP | 22 | Establish the return-proxy SSH tunnel | Required only when you enable return proxy. |
| Cluster nodes | Return proxy node | Outbound from cluster nodes; inbound to the proxy | TCP | 37140 | Forward node HTTPS traffic through the return proxy to CycleCloud port 9443 | Required only when you enable return proxy. |
| CycleCloud VM | Cluster scheduler, login, or other managed nodes | Outbound from CycleCloud; inbound to cluster nodes | TCP | 22 | Node orchestration, system access, and job monitoring | Required when CycleCloud must connect to managed nodes by using SSH. |
| Cluster users | Scheduler or login nodes | Inbound | TCP | 22 | User SSH access and job submission | Optional, based on the cluster access design. Limit the source to approved user networks. |
| Administrators or users | Windows cluster nodes | Inbound | TCP | 3389 | Remote Desktop Protocol (RDP) access | Optional for Windows nodes. Limit the source to approved user networks. |

CycleCloud 7 also uses TCP 5672 from cluster nodes to the CycleCloud VM for Advanced Message Queuing Protocol (AMQP) traffic. With return proxy enabled, CycleCloud 7 nodes use TCP 37141 to the proxy, which forwards traffic to port 5672. Don't open ports 5672 or 37141 for a CycleCloud 8-only deployment.

### Scheduler, monitoring, and workload traffic

| Source | Destination | Direction | Protocol | Port | Purpose | Applicability |
| --- | --- | --- | --- | --- | --- | --- |
| Slurm clients and compute nodes | Slurm scheduler node | Inbound to the scheduler | TCP | 6817 | Communication with `slurmctld` | Required for Slurm when you use the default port. Update the rule if you customize `SlurmctldPort`. |
| Slurm scheduler node | Slurm compute nodes | Inbound to compute nodes | TCP | 6818 | Communication with `slurmd` | Required for Slurm when you use the default port. Update the rule if you customize `SlurmdPort`. |
| Scheduler and compute nodes | Scheduler and compute nodes | Inbound and outbound | Scheduler-defined | Scheduler-defined | Scheduler daemon and autoscaling-adapter communication | Required for the selected scheduler. For PBS Pro, IBM LSF, Grid Engine, or HTCondor, allow the ports configured by that scheduler and cluster template. CycleCloud doesn't define one common range. |
| CycleCloud 7 VM | Cluster primary node | Outbound from CycleCloud; inbound to the primary node | TCP | 8652 | Ganglia monitoring | CycleCloud 7 only. CycleCloud 8 gets cluster metrics from Azure Monitor and doesn't require this inbound rule. |
| Cluster nodes | Shared file-system endpoint | Inbound and outbound | TCP | 2049 | Network File System (NFS) access | Optional. Required only for NFS-based shared storage. Add any extra ports required by the selected NFS version and mount configuration. |
| Cluster nodes | Directory service | Inbound and outbound | TCP | 389 or 636 | Lightweight Directory Access Protocol (LDAP) or LDAP over TLS authentication | Optional. Prefer port 636 for encrypted LDAP. Use the ports required by your identity design. |

In a standard Slurm deployment, Munge clients communicate with the local `munged` daemon over a Unix domain socket. Don't add TCP port 4065 as an inter-node NSG rule unless a custom component in your deployment explicitly uses that port.

### Azure service and package egress

| Source | Destination | Direction | Protocol | Port | Purpose | Applicability |
| --- | --- | --- | --- | --- | --- | --- |
| CycleCloud VM | `AzureResourceManager` service tag | Outbound | TCP | 443 | Create and manage Azure resources | Required. |
| CycleCloud VM | `AzureActiveDirectory` service tag | Outbound | TCP | 443 | Authenticate to Microsoft Entra ID | Required when the deployment uses Microsoft Entra authentication or managed identities. |
| CycleCloud VM | `AzureMonitor` service tag and required telemetry endpoints | Outbound | TCP | 443 | Retrieve metrics and send telemetry | Required for CycleCloud 8 monitoring. For firewalls that filter by fully qualified domain name (FQDN), allow the telemetry and Application Insights endpoints listed in [Operating in a locked down network](running-in-locked-down-network.md#install-azure-cyclecloud-in-a-locked-down-network). |
| CycleCloud VM | `ratecard.azure-api.net` | Outbound | TCP | 443 | Retrieve Azure price data | Required for cost estimates. Usage data remains available without RateCard API access, but costs aren't shown. |
| CycleCloud VM and cluster nodes | `Storage` service tag, service endpoint, or private endpoint | Outbound | TCP | 443 | Access CycleCloud storage and staged cluster artifacts | Required. When you use a private endpoint, configure private DNS and explicitly restrict or disable public storage access. |
| CycleCloud VM and cluster nodes | Approved package repositories and GitHub download endpoints | Outbound | TCP | 443 | Download installation packages and CycleCloud projects | Required only when artifacts aren't available from a custom image, private mirror, or pre-staged project. Allow `github.com` and any destination hosts reached through download redirects, or route traffic through an approved firewall or HTTPS proxy. |

NSGs are stateful, so you don't need a separate rule for response traffic. If you use Azure Firewall, a network virtual appliance, or an on-premises firewall, configure equivalent routes and rules. For a locked-down deployment, see [Operating in a locked down network](running-in-locked-down-network.md).

## Input endpoints in node arrays

``` ini
[[nodearray execute]]
  [[[network-interface eth0]]]
    AssociatePublicIpAddress = true

  [[[input-endpoint SSH]]]
  PrivatePort = 22
  PublicPort = 10000

  [[[input-endpoint MyCustomPort]]]
  PrivatePort = 999
  PublicPort = 10999
  Protocol = tcp
```

The preceding configuration enables public access to the execute nodes on ports that the Network Security Group allows for the Virtual Network. For the node array, `PublicPort` is the base port number for nodes in the array. The range of ports reserved for the node array is 500 ports for each endpoint. Endpoints default to the TCP protocol, but UDP is also supported by setting `Protocol = UDP`. By default, the node gets a dynamic public IP address that changes each time you start the cluster. To assign a static public IP address to your node, add `PublicIP` to the network interface configuration for the primary interface:

For return proxy nodes, if you don't specify `AssociatePublicIpAddress`, the system automatically creates a public IP address. If you set `AssociatePublicIpAddress` to **False**, the node fails with a warning and no auto-nsg is created for the node.

>[!NOTE]
> When you start a node with `AssociatePublicIpAddress`, the node keeps that IP address until you remove the node or the cluster.

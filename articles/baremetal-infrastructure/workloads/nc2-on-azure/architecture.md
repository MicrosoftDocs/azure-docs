---
title: Architecture of BareMetal Infrastructure for NC2 on Azure
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn about the architecture of several configurations of BareMetal Infrastructure for NC2 on Azure.
ms.topic: reference
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 04/23/2025
ms.service: azure-baremetal-infrastructure
# Customer intent: "As a cloud architect, I want to understand the architecture of BareMetal Infrastructure for NC2 on Azure, so that I can design scalable and efficient private cloud solutions integrated with existing services."
---

# Nutanix Cloud Clusters (NC2) on Azure architectural concepts

NC2 provides Nutanix-based private clouds in Azure. The private cloud hardware and software deployments are fully integrated and automated in Azure. Deploy and manage the private cloud through the Azure portal, CLI, or PowerShell.

A private cloud includes clusters with:

- Dedicated bare-metal server hosts provisioned with Nutanix AHV hypervisor
- Nutanix Prism Central for managing Nutanix Prism Element, Nutanix AHV, and Nutanix AOS.
- Nutanix Flow software-defined networking for Nutanix AHV workload VMs
- Nutanix AOS software-defined storage for Nutanix AHV workload VMs
- Nutanix Move for workload mobility
- Resources in the Azure underlay (required for connectivity and to operate the private cloud)

Private clouds are installed and managed within an Azure subscription. The number of private clouds within a subscription is scalable.

The following diagram describes the architectural components of the NC2 on Azure.

:::image type="content" source="media/nc2-on-azure-architecture-overview.png" alt-text="Diagram illustrating the NC2 on Azure architectural overview." border="false"  lightbox="media/nc2-on-azure-architecture-overview.png":::

Each NC2 on Azure architectural component has the following function:

- Azure Subscription: Used to provide controlled access, budget, and quota management for the NC2 on Azure service.
- Azure Region: Physical locations around the world where we group data centers into Availability Zones (AZs) and then group AZs into regions.
- Azure Resource Group: Container used to place Azure services and resources into logical groups.
- NC2 on Azure: Uses Nutanix software, including Prism Central, Prism Element, Nutanix Flow software-defined networking, Nutanix Acropolis Operating System (AOS) software-defined storage, and Azure bare-metal Acropolis Hypervisor (AHV) hosts to provide compute, networking, and storage resources.
- Nutanix Move: Provides migration services.
- Nutanix Disaster Recovery: Provides disaster recovery automation and storage replication services.
- Nutanix Files: Provides filer services.
- Nutanix Self Service: Provides application lifecycle management and cloud orchestration.
- Nutanix Cost Governance: Provides multicloud optimization to reduce cost & enhance cloud security.
- Azure Virtual Network (VNet): Private network used to connect AHV hosts, Azure services, and resources together.
- Azure Route Server: Enables network appliances to exchange dynamic route information with Azure networks.
- Azure Virtual Network Gateway: Cross premises gateway for connecting Azure services and resources to other private networks using IPsec VPN, ExpressRoute, and VNet to VNet.
- Azure ExpressRoute: Provides high-speed private connections between Azure data centers and on-premises or colocation infrastructure.
- Azure Virtual WAN (vWAN): Aggregates networking, security, and routing functions together into a single unified Wide Area Network (WAN).

## Use cases and supported scenarios

Learn about use cases and supported scenarios for NC2 on Azure, including cluster management, disaster recovery, on-demand elasticity, and lift-and-shift.

### Unified management experience - cluster management

That operations and cluster management be nearly identical to on-premises is critical to customers.
Customers can update capacity, monitor alerts, replace hosts, monitor usage, and more by combining the respective strengths of Microsoft and Nutanix.

### Lift and shift

Move applications to the cloud and modernize your infrastructure.
Applications move with no changes, allowing for flexible operations and minimum downtime.

### Disaster recovery

Use Azure as a disaster recovery site to provision nodes and failover your Nutanix VMs and workloads. The hardware is available on-demand and in the cloud without requiring you to invest in pre-provisioning a secondary data center environment. 
 
### On-demand elasticity

Scale up and scale out as you like.
We provide the flexibility that means you don't have to procure hardware yourself - with just a click of a button you can get additional nodes in the cloud nearly instantly.

## Deployment example

The image in this section shows one example of an NC2 on Azure deployment.

:::image type="content" source="media/nc2-on-azure-deployment-architecture.png" alt-text="Diagram showing NC2 on Azure deployment architecture." border="false" lightbox="media/nc2-on-azure-deployment-architecture-large.png":::

### Cluster Management virtual network

* Contains the Nutanix Ready Nodes
* Nodes reside in a delegated subnet (special BareMetal construct)

### Hub virtual network

* Contains a gateway subnet and VPN Gateway
* VPN Gateway is entry point from on-premises to cloud

### PC virtual network

* Contains Prism Central - Nutanix's software appliance that enables advanced functionality within the Prism portal.

## Connect from cloud to on-premises

Connecting from cloud to on-premises is supported by two traditional products: Express Route and VPN Gateway.
One example deployment is to have a VPN gateway in the Hub virtual network.
This virtual network is peered with both the PC virtual network and Cluster Management virtual network, providing connectivity across the network and to your on-premises site.

## Supported topologies

The following table describes the network topologies supported by each network features configuration of NC2 on Azure.

|Topology |Supported |
| :------------------- |:---------------:|
|Connectivity to BareMetal Infrastructure (BMI) in a local VNet| Yes |
|Connectivity to BMI in a peered VNet (Same region)|Yes |
|Connectivity to BMI in a peered VNet (Cross region or global peering) with VWAN |Yes |
|Connectivity to BMI in a peered VNet (Cross region or global peering) without VWAN*| No|
|On-premises connectivity to Delegated Subnet via Global and Local ExpressRoute |Yes|
|Connectivity from on-premises to BMI in a spoke VNet over ExpressRoute gateway and VNet peering with gateway transit|Yes |
|ExpressRoute (ER) FastPath |No |
|On-premises connectivity to Delegated Subnet via VPN Gateway| Yes |
|Connectivity from on-premises to BMI in a spoke VNet over VPN gateway and VNet peering with gateway transit| Yes |
|Connectivity over Active/Passive VPN Gateways| Yes |
|Connectivity over Active/Active VPN Gateways| No |
|Connectivity over Active/Active Zone Redundant gateways| No |
|Transit connectivity via vWAN for Spoke Delegated VNETS| Yes |
|On-premises connectivity to Delegated subnet via vWAN attached SD-WAN| No|
|VWAN enables traffic inspection via NVA (Secure vWAN)**|Yes|
|[User-defined routes (UDRs)](../../../virtual-network/virtual-networks-udr-overview.md#user-defined) on NC2 on Azure-delegated subnets| Yes|
|Connectivity from BareMetal to [service endpoints](../../../virtual-network/virtual-network-service-endpoints-overview.md) or [private endpoints][def] in a different spoke Vnet connected to vWAN|Yes|
|Connectivity from BareMetal to [service endpoints](../../../virtual-network/virtual-network-service-endpoints-overview.md) or [private endpoints][def] in the same Vnet on Azure-delegated subnets|No|
|Connectivity from User VMs (UVMs) on NC2 nodes to Azure resources|Yes|

\* You can overcome this limitation by setting Site-to-Site VPN.

\** If using Routing Intent you must add either the full delegated subnet CIDR or a more specific CIDR range as "Additional Prefixes" section under the Routing Intent and Routing Policies page in the portal 
## Constraints

The following table describes what’s supported for each network features configuration:

|Features |Support or Limit|
| :------------------- | -------------------: |
|Delegated subnet per VNet |1|
|[Network Security Groups](../../../virtual-network/network-security-groups-overview.md) on NC2 on Azure-delegated subnets|No|
|Load balancers for NC2 on Azure traffic|No|
|Dual stack (IPv4 and IPv6) virtual network|IPv4 only supported|

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Getting Started](get-started.md)


[def]: ../../../private-link/private-endpoint-overview.md

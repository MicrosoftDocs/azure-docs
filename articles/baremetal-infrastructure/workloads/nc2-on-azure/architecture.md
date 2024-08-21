---
title: Architecture of BareMetal Infrastructure for NC2 on Azure
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn about the architecture of several configurations of BareMetal Infrastructure for NC2 on Azure.
ms.topic: reference
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 08/15/2024
ms.service: azure-baremetal-infrastructure
---

# Nutanix Cloud Clusters (NC2) on Azure architectural concepts

NC2 provides Nutanix-based private clouds in Azure. The private cloud hardware and software deployments are fully integrated and automated in Azure. Deploy and manage the private cloud through the Azure portal, CLI, or PowerShell.

A private cloud includes clusters with:

- Dedicated bare-metal server hosts provisioned with Nutanix AHV hypervisor
- Nutanix Prism Central for managing Nutanix Prism Element, Nutanix AHV and Nutanix AOS.
- Nutanix Flow software-defined networking for Nutanix AHV workload VMs
- Nutanix AOS software-defined storage for Nutanix AHV workload VMs
- Nutanix Move for workload mobility
- Resources in the Azure underlay (required for connectivity and to operate the private cloud)

Private clouds are installed and managed within an Azure subscription. The number of private clouds within a subscription is scalable.

The following diagram describes the architectural components of the NC2 on Azure.

:::image type="content" source="media/nc2-on-azure-architecture-overview.png" alt-text="Diagram illustrating the NC2 on Azure architecutural overview." border="false"  lightbox="media/nc2-on-azure-architecture-overview.png":::

Each NC2 on Azure architectural component has the following function:

- Azure Subscription: Used to provide controlled access, budget, and quota management for the NC2 on Azure service.
- Azure Region: Physical locations around the world where we group data centers into Availability Zones (AZs) and then group AZs into regions.
- Azure Resource Group: Container used to place Azure services and resources into logical groups.
- NC2 on Azure: Uses Nutanix software, including Prism Central, Prism Element, Nutanix Flow software-defined networking, Nutanix Acropolis Operating System (AOS) software-defined storage, and Azure bare-metal Acropolis Hypervisor (AHV) hosts to provide compute, networking, and storage resources.
- Nutanix Move: Provides migration services.
- Nutanix Disaster Recovery: Provides disaster recovery automation and storage replication services.
- Nutanix Files: Provides filer services.
- Nutanix Self Service: Provides application lifecycle management and cloud orchestration.
- Nutanix Cost Governance: Provides multi-cloud optimization to reduce cost & enhance cloud security.
- Azure Virtual Network (VNet): Private network used to connect AHV hosts, Azure services and resources together.
- Azure Route Server: Enables network appliances to exchange dynamic route information with Azure networks.
- Azure Virtual Network Gateway: Cross premises gateway for connecting Azure services and resources to other private networks using IPSec VPN, ExpressRoute, and VNet to VNet.
- Azure ExpressRoute: Provides high-speed private connections between Azure data centers and on-premises or colocation infrastructure.
- Azure Virtual WAN (vWAN): Aggregates networking, security, and routing functions together into a single unified Wide Area Network (WAN).

## Use cases and supported scenarios

Learn about use cases and supported scenarios for NC2 on Azure, including cluster management, disaster recovery, on-demand elasticity, and lift-and-shift.

### Unified management experience - cluster management

That operations and cluster management be nearly identical to on-premises is critical to customers.
Customers can update capacity, monitor alerts, replace hosts, monitor usage, and more by combining the respective strengths of Microsoft and Nutanix.

### Disaster recovery

Disaster recovery is critical to cloud functionality.
A disaster can be any of the following:

- Cyber attack
- Data breach
- Equipment failure
- Natural disaster
- Data loss
- Human error
- Malware and viruses
- Network and internet blips
- Hardware and/or software failure
- Weather catastrophes
- Flooding
- Office vandalism

When a disaster strikes, the goal of any DR plan is to ensure operations run as normally as possible.
While the business will be aware of the crisis, ideally, its customers and end-users shouldn't be affected.

### On-demand elasticity

Scale up and scale out as you like.
We provide the flexibility that means you don't have to procure hardware yourself - with just a click of a button you can get additional nodes in the cloud nearly instantly.

### Lift and shift

Move applications to the cloud and modernize your infrastructure.
Applications move with no changes, allowing for flexible operations and minimum downtime.

## Supported SKUs and instances

The following table presents component options for each available SKU.

| Component |Ready Node for Nutanix AN36|Ready Node for Nutanix AN36P|
| :------------------- | -------------------: |:---------------:|
|Core|Intel 6140, 36 Core, 2.3 GHz|Intel 6240, 36 Core, 2.6 GHz|
|vCPUs|72|72|
|RAM|576 GB|768 GB|
|Storage|18.56 TB (8 x 1.92 TB SATA SSD, 2x1.6TB NVMe)|20.7 TB (2x750 GB Optane, 6x3.2-TB NVMe)|
|Network (available bandwidth between nodes)|25 Gbps|25 Gbps|

Nutanix Clusters on Azure supports:

* Minimum of three bare metal nodes per cluster.
* Maximum of 28 bare metal nodes per cluster.
* Only the Nutanix AHV hypervisor on Nutanix clusters running in Azure.
* Prism Central instance deployed on Nutanix Clusters on Azure to manage the Nutanix clusters in Azure.

## Supported regions

When planning your NC2 on Azure design, use the following table to understand what SKUs are available in each Azure region.

| Azure region | SKU   |
| :---         | :---: |
| Australia East | AN36P |
| East US | AN36 |
| East US 2 | AN36P |
| Germany West Central | AN36P |
| Japan East | AN36P |
| North Central US | AN36P |
| Southeast Asia | AN36P |
| UK South | AN36P |
| West Europe | AN36P |
| West US 2 | AN36 |

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
|Connectivity to BMI in a peered VNet\* (Cross region or global peering) with VWAN\*|Yes |
|Connectivity to BM in a peered VNet* (Cross region or global peering)* without VWAN| No|
|On-premises connectivity to Delegated Subnet via Global and Local Expressroute |Yes|
|ExpressRoute (ER) FastPath |No |
|Connectivity from on-premises to BMI in a spoke VNet over ExpressRoute gateway and VNet peering with gateway transit|Yes |
|On-premises connectivity to Delegated Subnet via VPN GW| Yes |
|Connectivity from on-premises to BMI in a spoke VNet over VPN gateway and VNet peering with gateway transit| Yes |
|Connectivity over Active/Passive VPN gateways| Yes |
|Connectivity over Active/Active VPN gateways| No |
|Connectivity over Active/Active Zone Redundant gateways| No |
|Transit connectivity via vWAN for Spoke Delegated VNETS| Yes |
|On-premises connectivity to Delegated subnet via vWAN attached SD-WAN| No|
|On-premises connectivity via Secured HUB(Az Firewall NVA) | No|
|Connectivity from UVMs on NC2 nodes to Azure resources|Yes|

\* You can overcome this limitation by setting Site-to-Site VPN.

## Constraints

The following table describes what’s supported for each network features configuration:

|Features |Basic network features |
| :------------------- | -------------------: |
|Delegated subnet per VNet |1|
|[Network Security Groups](../../../virtual-network/network-security-groups-overview.md) on NC2 on Azure-delegated subnets|No|
|VWAN enables traffic inspection via NVA (Virtual WAN Hub routing intent)|Yes|
[User-defined routes (UDRs)](../../../virtual-network/virtual-networks-udr-overview.md#user-defined) on NC2 on Azure-delegated subnets without VWAN| No|
|Connectivity from BareMetal to [private endpoints](../../../private-link/private-endpoint-overview.md) in the same Vnet on Azure-delegated subnets|No|
|Connectivity from BareMetal to [private endpoints](../../../private-link/private-endpoint-overview.md) in a different spoke Vnet connected to vWAN|Yes|
|Load balancers for NC2 on Azure traffic|No|
|Dual stack (IPv4 and IPv6) virtual network|IPv4 only supported|

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Getting Started](get-started.md)

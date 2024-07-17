---
title: Architecture of BareMetal Infrastructure for NC2 on Azure
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn about the architecture of several configurations of BareMetal Infrastructure for NC2 on Azure.
ms.topic: reference
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 7/17/2024
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

The following diagram describes the architectural components of the Azure VMware Solution.

:::image type="content" source="media/concepts/nc2-on-azure-architecture.png" alt-text="Diagram illustrating the NC2 on Azure architecutural overview." border="false"  lightbox="media/concepts/nc2-on-azure-architecture.png":::

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

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Requirements](requirements.md)

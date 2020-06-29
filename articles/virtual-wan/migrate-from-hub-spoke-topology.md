---
title: 'Architecture: Migrate to Azure Virtual WAN'
description: Learn how to migrate to Azure Virtual WAN.
services: virtual-wan
author: cherylmc
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 02/06/2020
ms.author: cherylmc

---

# Migrate to Azure Virtual WAN

Azure Virtual WAN lets companies simplify their global connectivity in order to benefit from the scale of the Microsoft global network. This article provides technical details for companies that want to migrate from an existing customer-managed hub-and-spoke topology, to a design that leverages Microsoft-managed Virtual WAN hubs.

For information about the benefits that Azure Virtual WAN enables for enterprises adopting a cloud-centric modern enterprise global network, see [Global transit network architecture and Virtual WAN](virtual-wan-global-transit-network-architecture.md).

![hub and spoke](./media/migrate-from-hub-spoke-topology/hub-spoke.png)
**Figure: Azure Virtual WAN**

The Azure hub-and-spoke connectivity model has been adopted by thousands of our customers to leverage the default transitive routing behavior of Azure Networking in order to build simple and scalable cloud networks. Azure Virtual WAN builds on these concepts and introduces new capabilities that allow global connectivity topologies, not only between on-premises locations and Azure, but also allowing customers to leverage the scale of the Microsoft network to augment their existing global networks.

This article shows how to migrate an existing hybrid environment to Virtual WAN.

## Scenario

Contoso is a global financial organization with offices in both Europe and Asia. They are planning to move their existing applications from an on-premises data center in to Azure and have built out a foundation design based on the manual hub-and-spoke architecture, including regional customer-managed hub virtual networks for hybrid connectivity. As part of the move to cloud-based technologies, the network team have been tasked with ensuring that their connectivity is optimized for the business moving forward.

The following figure shows a high-level view of the existing global network including connectivity to multiple Azure regions.

![Contoso existing network topology](./media/migrate-from-hub-spoke-topology/contoso-pre-migration.png)
**Figure: Contoso existing network topology**

The following points can be understood from the existing network topology:

- A hub-and-spoke topology is used in multiple regions including ExpressRoute Premium circuits for connectivity back to a common private WAN.

- Some of these sites also have VPN tunnels directly in to Azure to reach applications hosted within the Microsoft cloud.

## Requirements

The networking team have been tasked with delivering a global network model that can support the Contoso migration to the cloud and must optimize in the areas of cost, scale, and performance. In summary, the following requirements are to be met:

- Provide both head quarter (HQ) and branch offices with optimized path to cloud hosted applications.
- Remove the reliance on existing on-premises data centers (DC) for VPN termination while retaining the following connectivity paths:
  - **Branch -to- VNet**: VPN connected offices must be able to access applications migrated to the cloud in the local Azure region.
  - **Branch -to- Hub -to- Hub -to- VNet**: VPN connected offices must be able to access applications migrated to the cloud in the remote Azure region.
  - **Branch -to- branch**: Regional VPN connected offices must be able to communicate with each other and ExpressRoute connected HQ/DC sites.
  - **Branch -to- Hub -to- Hub -to- branch**: Globally separated VPN connected offices must be able to communicate with each other and any ExpressRoute connected HQ/DC sites.
  - **Branch -to- Internet**: Connected sites must be able to communicate with the Internet. This traffic must be filtered and logged.
  - **VNet -to- VNet**: Spoke virtual networks in the same region must be able to communicate with each other.
  - **VNet -to- Hub -to- Hub -to- VNet**: Spoke virtual networks in the different regions must be able to communicate with each other.
- Provide the ability for Contoso roaming users (laptop and phone) to access company resources while not on the corporate network.

## <a name="architecture"></a>Azure Virtual WAN architecture

The following figure shows a high-level view of the updated target topology using Azure Virtual WAN to meet the requirements detailed in the previous section.

![Contoso virtual WAN architecture](./media/migrate-from-hub-spoke-topology/vwan-architecture.png)
**Figure: Azure Virtual WAN architecture**

Summary:

- HQ in Europe remains ExpressRoute connected, Europe on-premises DC are fully migrated to Azure and now decommissioned.
- Asia DC and HQ remain connected to Private WAN. Azure Virtual WAN now used to augment the local carrier network and provide global connectivity.
- Azure Virtual WAN hubs deployed in both West Europe and South East Asia Azure regions to provide connectivity hub for ExpressRoute and VPN connected devices.
- Hubs also provide VPN termination for roaming users across multiple client types using OpenVPN connectivity to the global mesh network, allowing access to not only applications migrated to Azure, but also any resources remaining on-premises.
- Internet connectivity for resources within a virtual network provided by Azure Virtual WAN.

Internet connectivity for remote sites also provided by Azure Virtual WAN. Local internet breakout supported via partner integration for optimized access to SaaS services such as Office 365.

## Migrate to Virtual WAN

This section shows the various steps for migrating to Azure Virtual WAN.

### Step 1: Single region customer-managed hub-and-spoke

The following figure shows a single region topology for Contoso prior to the rollout of Azure Virtual WAN:

![Single region topology](./media/migrate-from-hub-spoke-topology/figure1.png)
**Figure 1: Single region manual hub-and-spoke**

In keeping with the hub-and-spoke approach, the customer-managed hub virtual network contains several function blocks:

- Shared services (any common function required by multiple spokes). Example: Contoso uses Windows Server domain controllers on Infrastructure-as-a-service (IaaS) virtual machines.
- IP/Routing firewall services are provided by a third-party network virtual appliance, enabling spoke-to-spoke layer-3 IP routing.
- Internet ingress/egress services including Azure Application Gateway for inbound HTTPS requests and third-party proxy services running on virtual machines for filtered outbound access to internet resources.
- ExpressRoute and VPN virtual network gateway for connectivity to on-premises networks.

### Step 2: Deploy Virtual WAN hubs

Deploy a Virtual WAN hub in each region. Set up the Virtual WAN hub with VPN Gateway and ExpressRoute Gateway as described in the following articles:

- [Tutorial: Create a Site-to-Site connection using Azure Virtual WAN](virtual-wan-site-to-site-portal.md)
- [Tutorial: Create an ExpressRoute association using Azure Virtual WAN](virtual-wan-expressroute-portal.md)

> [!NOTE]
> Azure Virtual WAN must be using the Standard SKU to enable some of the traffic paths shown in this article.

![Deploy Virtual WAN hubs](./media/migrate-from-hub-spoke-topology/figure2.png)
**Figure 2: Customer-managed hub-and-spoke to Virtual WAN migration**

### Step 3: Connect remote sites (ExpressRoute and VPN) to Virtual WAN

Connect the Virtual WAN hub to the existing ExpressRoute circuits and set up Site-to-site VPNs over the Internet to any remote branches.

> [!NOTE]
> Express Routes Circuits must be upgraded to Premium SKU type to connect to Virtual WAN hub.

![Connect remote sites to Virtual WAN](./media/migrate-from-hub-spoke-topology/figure3.png)
**Figure 3: Customer-managed hub-and-spoke to Virtual WAN migration**

At this point, on-premises network equipment will begin to receive routes reflecting the IP address space assigned to the Virtual WAN-managed hub VNet. Remote VPN-connected branches at this stage will see two paths to any existing applications in the spoke virtual networks. These devices should be configured to continue to use the tunnel to the customer-managed hub to ensure symmetrical routing during the transition phase.

### Step 4: Test hybrid connectivity via Virtual WAN

Prior to using the managed Virtual WAN hub for production connectivity, we recommend that you set up a test spoke virtual network and Virtual WAN VNet connection. Validate that connections to this test environment work via ExpressRoute and Site to Site VPN before continuing with the next steps.

![Test hybrid connectivity via Virtual WAN](./media/migrate-from-hub-spoke-topology/figure4.png)
**Figure 4: Customer-managed hub-and-spoke to Virtual WAN migration**

### Step 5: Transition connectivity to virtual WAN hub

![Transition connectivity to Virtual WAN hub](./media/migrate-from-hub-spoke-topology/figure5.png)
**Figure 5: Customer-managed hub-and-spoke to Virtual WAN migration**

**a**. Delete the existing peering connections from Spoke virtual networks to the old customer-managed hub. Access to applications in spoke virtual networks is unavailable until steps a-c are complete.

**b**. Connect the spoke virtual networks to the Virtual WAN hub via VNet connections.

**c**. Remove any user-defined routes (UDR) previously used within spoke virtual networks for spoke-to-spoke communications. This path is now enabled by dynamic routing available within the Virtual WAN hub.

**d**. Existing ExpressRoute and VPN Gateways in the customer-managed hub are now decommissioned to permit the next step (e).

**e**. Connect the old customer-managed hub (hub virtual network) to the Virtual WAN hub via a new VNet connection.

### Step 6: Old hub becomes shared services spoke

We have now redesigned our Azure network to make the Virtual WAN hub the central point in our new topology.

![Old hub becomes Shared Services spoke](./media/migrate-from-hub-spoke-topology/figure6.png)
**Figure 6: Customer-managed hub-and-spoke to Virtual WAN migration**

Because the Virtual WAN hub is a managed entity and does not allow deployment of custom resources such as virtual machines, the shared services block now exists as a spoke virtual network and hosts functions such as internet ingress via Azure Application Gateway or network virtualized appliance. Traffic between the shared services environment and backend virtual machines now transits the Virtual WAN-managed hub.

### Step 7: Optimize on-premises connectivity to fully utilize Virtual WAN

At this stage, Contoso has mostly completed their migrations of business applications in into the Microsoft Cloud, with only a few legacy applications remaining within the on-premises DC.

![Optimize on-premises connectivity to fully utilize Virtual WAN](./media/migrate-from-hub-spoke-topology/figure7.png)
**Figure 7: Customer-managed hub-and-spoke to Virtual WAN migration**

To leverage the full functionality of Azure Virtual WAN, Contoso decides to decommission their legacy on-premises VPN connections. Any branches continuing to access HQ or DC networks are able to transit the Microsoft global network using the built-in transit routing of Azure Virtual WAN.

> [!NOTE]
> ExpressRoute Global Reach is an alternative choice for customers wishing to leverage the Microsoft backbone to complement their existing private WANs.

## End-state architecture and traffic paths

![End-state architecture and traffic paths](./media/migrate-from-hub-spoke-topology/figure8.png)
**Figure: Dual region Virtual WAN**

This section provides a summary of how this topology meets the original requirements by looking at some example traffic flows.

### Path 1

Path 1 shows traffic flow from a S2S VPN connected branch in Asia to an Azure VNet in the South East Asia region.

The traffic is routed as follows:

- Asia branch is connected via resilient S2S BGP enabled tunnels into South East Asia Virtual WAN hub.

- Asia Virtual WAN hub routes traffic locally to connected VNet.

![Flow 1](./media/migrate-from-hub-spoke-topology/flow1.png)

### Path 2

Path 2 shows traffic flow from the ExpressRoute connected European HQ to an Azure VNet in the South East Asia region.

The traffic is routed as follows:

- European HQ is connected via premium ExpressRoute circuit into West Europe Virtual WAN hub.

- Virtual WAN hub-to-hub global connectivity enables transit of traffic to VNet connected in remote region.

![Flow 2](./media/migrate-from-hub-spoke-topology/flow2.png)

### Path 3

Path 3 shows traffic flow from the Asia on-premises DC connected to Private WAN to a European S2S connected Branch.

The traffic is routed as follows:

- Asia DC is connected to local Private WAN carrier.

- ExpressRoute circuit locally terminates in Private WAN connects to the South East Asia Virtual WAN hub.

- Virtual WAN hub-to-hub global connectivity enables transit of traffic.

![Flow 3](./media/migrate-from-hub-spoke-topology/flow3.png)

### Path 4

Path 4 shows traffic flow from an Azure VNet in South East Asia region to an Azure VNet in West Europe region.

The traffic is routed as follows:

- Virtual WAN hub-to-hub global connectivity enables native transit of all connected Azure VNets without further user config.

![Flow 4](./media/migrate-from-hub-spoke-topology/flow4.png)

### Path 5

Path 5 shows traffic flow from roaming VPN (P2S) users to an Azure VNet in the West Europe region.

The traffic is routed as follows:

- Laptop and mobile device users use the OpenVPN client for transparent connectivity in to the P2S VPN gateway in West Europe.

- West Europe Virtual WAN hub routes traffic locally to connected VNet.

![Flow 5](./media/migrate-from-hub-spoke-topology/flow5.png)

## Security and policy control via Azure Firewall

Contoso has now validated connectivity between all branches and VNets in line with the requirements discussed earlier in this article. To meet their requirements for security control and network isolation, they need to continue to separate and log traffic via the hub network. Previously this function was performed by a network virtual appliance (NVA). Contoso also wants to decommission their existing proxy services and utilize native Azure services for outbound Internet filtering.

![Security and policy control via Azure Firewall](./media/migrate-from-hub-spoke-topology/security-policy.png)
**Figure: Azure Firewall in Virtual WAN (Secured Virtual hub)**

The following high-level steps are required to introduce Azure Firewall into the Virtual WAN hubs to enable a unified point of policy control. For more information about this process and the concept of Secure Virtual Hubs, see [Azure Firewall Manager](../firewall-manager/index.yml).

1. Create Azure Firewall policy.
2. Link firewall policy to Azure Virtual WAN hub. This step allows the existing Virtual WAN hub to function as a secured virtual hub, and deploys the required Azure Firewall resources.

> [!NOTE]
> If the Azure Firewall is deployed in a Standard Virtual WAN hub (SKU : Standard): V2V, B2V, V2I and B2I FW policies are only enforced on the traffic originating from the VNets and Branches connected to the specific hub where the Azure FW is deployed (Secured Hub). Traffic originating from remote VNets and Branches that are attached to other Virtual WAN hubs in the same Virtual WAN will not be "firewalled", even though the remote Branches and VNet are interconnected via Virtual WAN hub to hub links. Cross-hub firewalling support is on the Azure Virtual WAN and Firewall Manager roadmap.

The following paths show the connectivity paths enabled by using Azure secured virtual hubs:

### Path 6

Path 6 shows secure traffic flow between VNets within the same region.

The traffic is routed as follows:

- Virtual Networks connected to the same Secured Virtual Hub now route traffic to via the Azure Firewall.

- Azure Firewall can apply policy to these flows.

![Flow 6](./media/migrate-from-hub-spoke-topology/flow6.png)

### Path 7

Path 7 shows traffic flow from an Azure VNet to the Internet or third-party Security Service.

The traffic is routed as follows:

- Virtual Networks connected to the Secure Virtual Hub can send traffic to public, destinations on the Internet, using the Secure Hub as a central point of Internet access.

- This traffic can be filtered locally using Azure Firewall FQDN rules, or sent to a third-party security service for inspection.

![Flow 7](./media/migrate-from-hub-spoke-topology/flow7.png)

### Path 8

Path 8 shows traffic flow from branch-to-Internet or third-party Security Service.

The traffic is routed as follows:

- Branches connected to the Secure Virtual Hub can send traffic to public destinations on the Internet by using the Secure Hub as a central point of Internet access.

- This traffic can be filtered locally using Azure Firewall FQDN rules, or sent to a third-party security service for inspection.

![Flow 8](./media/migrate-from-hub-spoke-topology/flow8.png) 

## Next steps

Learn more about [Azure Virtual WAN](virtual-wan-about.md)

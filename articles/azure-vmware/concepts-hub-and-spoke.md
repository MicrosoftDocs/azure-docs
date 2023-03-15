---
title: Concept - Integrate an Azure VMware Solution deployment in a hub and spoke architecture
description: Learn about integrating an Azure VMware Solution deployment in a hub and spoke architecture on Azure.
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 2/8/2023
ms.custom: engagement-fy23
---

# Integrate Azure VMware Solution in a hub and spoke architecture

This article provides recommendations for integrating an Azure VMware Solution deployment in an existing or a new [Hub and Spoke architecture](/azure/architecture/reference-architectures/hybrid-networking/#hub-spoke-network-topology) on Azure.

The Hub and Spoke scenario assume a hybrid cloud environment with workloads on:

* Native Azure using IaaS or PaaS services
* Azure VMware Solution
* vSphere on-premises

## Architecture

The *Hub* is an Azure Virtual Network that acts as a central point of connectivity to your on-premises and Azure VMware Solution private cloud. The *Spokes* are virtual networks peered with the Hub to enable cross-virtual network communication.

Traffic between the on-premises datacenter, Azure VMware Solution private cloud, and the Hub goes through Azure ExpressRoute connections. Spoke virtual networks usually contain IaaS based workloads but can have PaaS services like [App Service Environment](../app-service/environment/intro.md), which has direct integration with Virtual Network, or other PaaS services with [Azure Private Link](../private-link/index.yml) enabled.

>[!IMPORTANT]
>You can use an existing ExpressRoute Gateway to connect to Azure VMware Solution as long as it does not exceed the limit of four ExpressRoute circuits per virtual network. However, to access Azure VMware Solution from on-premises through ExpressRoute, you must have ExpressRoute Global Reach since the ExpressRoute gateway does not provide transitive routing between its connected circuits.

The diagram shows an example of a Hub and Spoke deployment in Azure connected to on-premises and Azure VMware Solution through ExpressRoute Global Reach.

:::image type="content" source="./media/hub-spoke/azure-vmware-solution-hub-and-spoke-deployment.png" alt-text="Diagram showing the Azure VMware Solution Hub and Spoke integration deployment." border="false" lightbox="./media/hub-spoke/azure-vmware-solution-hub-and-spoke-deployment.png":::

The architecture has the following main components:

- **On-premises site:** Customer on-premises datacenter(s) connected to Azure through an ExpressRoute connection.

- **Azure VMware Solution private cloud:** Azure VMware Solution SDDC formed by one or more vSphere clusters, each one with a maximum of 16 hosts.

- **ExpressRoute gateway:** Enables the communication between Azure VMware Solution private cloud, shared services on Hub virtual network, and workloads running on Spoke virtual networks.

- **ExpressRoute Global Reach:** Enables the connectivity between on-premises and Azure VMware Solution private cloud. The connectivity between Azure VMware Solution and the Azure fabric is through ExpressRoute Global Reach only.

- **S2S VPN considerations:** Connectivity to Azure VMware Solution private cloud using Azure S2S VPN is supported as long as it meets the [minimum network requirements](https://docs.vmware.com/en/VMware-HCX/4.4/hcx-user-guide/GUID-8128EB85-4E3F-4E0C-A32C-4F9B15DACC6D.html) for VMware HCX.

- **Hub virtual network:** Acts as the central point of connectivity to your on-premises network and Azure VMware Solution private cloud.

- **Spoke virtual network**

    - **IaaS Spoke:** Hosts Azure IaaS based workloads, including VM availability sets and Virtual Machine Scale Sets, and the corresponding network components.

    - **PaaS Spoke:** Hosts Azure PaaS services using private addressing thanks to [Private Endpoint](../private-link/private-endpoint-overview.md) and [Private Link](../private-link/private-link-overview.md).

- **Azure Firewall:** Acts as the central piece to segment traffic between the Spokes and Azure VMware Solution.

- **Application Gateway:** Exposes and protects web apps that run either on Azure IaaS/PaaS or Azure VMware Solution virtual machines (VMs). It integrates with other services like API Management.

## Network and security considerations

ExpressRoute connections enable traffic to flow between on-premises, Azure VMware Solution, and the Azure network fabric. Azure VMware Solution uses [ExpressRoute Global Reach](../expressroute/expressroute-global-reach.md) to implement this connectivity.

Because an ExpressRoute gateway doesn't provide transitive routing between its connected circuits, on-premises connectivity also must use ExpressRoute Global Reach to communicate between the on-premises vSphere environment and Azure VMware Solution. 

* **On-premises to Azure VMware Solution traffic flow**

  :::image type="content" source="./media/hub-spoke/on-premises-azure-vmware-solution-traffic-flow.png" alt-text="Diagram showing the on-premises to Azure VMware Solution traffic flow." border="false" lightbox="./media/hub-spoke/on-premises-azure-vmware-solution-traffic-flow.png":::

* **Azure VMware Solution to Hub VNET traffic flow**

  :::image type="content" source="./media/hub-spoke/azure-vmware-solution-hub-vnet-traffic-flow.png" alt-text="Diagram showing the Azure VMware Solution to Hub virtual network traffic flow." border="false" lightbox="./media/hub-spoke/azure-vmware-solution-hub-vnet-traffic-flow.png":::

For more information on Azure VMware Solution networking and connectivity concepts, see the [Azure VMware Solution product documentation](./concepts-networking.md).

### Traffic segmentation

[Azure Firewall](../firewall/index.yml) is the Hub and Spoke topology's central piece, deployed on the Hub virtual network. Use Azure Firewall, or another Azure supported network virtual appliance (NVA) to establish traffic rules and segment the communication between the different spokes and Azure VMware Solution workloads.

Create route tables to direct the traffic to Azure Firewall.  For the Spoke virtual networks, create a route that sets the default route to the internal interface of the Azure Firewall. This way, when a workload in the Virtual Network needs to reach the Azure VMware Solution address space, the firewall can evaluate it and apply the corresponding traffic rule to either allow or deny it.  

:::image type="content" source="media/hub-spoke/create-route-table-to-direct-traffic.png" alt-text="Screenshot showing the route tables to direct traffic to Azure Firewall." lightbox="media/hub-spoke/create-route-table-to-direct-traffic.png":::

> [!IMPORTANT]
> A route with address prefix 0.0.0.0/0 on the **GatewaySubnet** setting is not supported.

Set routes for specific networks on the corresponding route table. For example, routes to reach Azure VMware Solution management and workloads IP prefixes from the spoke workloads and the other way around.

:::image type="content" source="media/hub-spoke/specify-gateway-subnet-for-route-table.png" alt-text="Screenshot that shows the set routes for specific networks on the corresponding route table." lightbox="media/hub-spoke/specify-gateway-subnet-for-route-table.png":::

A second level of traffic segmentation using the network security groups within the Spokes and the Hub to create a more granular traffic policy.

> [!NOTE]
> **Traffic from on-premises to Azure VMware Solution:** Traffic between on-premises workloads, either vSphere-based or others, are enabled by Global Reach, but the traffic doesn't go through Azure Firewall on the hub. In this scenario, you must implement traffic segmentation mechanisms, either on-premises or in Azure VMware Solution.

### Application Gateway

Azure Application Gateway V1 and V2 have been tested with web apps that run on Azure VMware Solution VMs as a backend pool. Application Gateway is currently the only supported method to expose web apps running on Azure VMware Solution VMs to the internet. It can also expose the apps to internal users securely.

For more information, see the Azure VMware Solution-specific article on [Application Gateway](./protect-azure-vmware-solution-with-application-gateway.md).

:::image type="content" source="media/hub-spoke/azure-vmware-solution-second-level-traffic-segmentation.png" alt-text="Diagram showing the second level of traffic segmentation using the Network Security Groups." border="false":::

### Jump box and Azure Bastion

Access Azure VMware Solution environment with a jump box, which is a Windows 10 or Windows Server VM deployed in the shared service subnet within the Hub virtual network.

>[!IMPORTANT]
>Azure Bastion is the service recommended to connect to the jump box to prevent exposing Azure VMware Solution to the internet. You cannot use Azure Bastion to connect to Azure VMware Solution VMs since they are not Azure IaaS objects.  

As a security best practice, deploy [Microsoft Azure Bastion](../bastion/index.yml) service within the Hub virtual network. Azure Bastion provides seamless RDP and SSH access to VMs deployed on Azure without providing public IP addresses to those resources. Once you provision the Azure Bastion service, you can access the selected VM from the Azure portal. After establishing the connection, a new tab opens, showing the jump box desktop, and from that desktop, you can access the Azure VMware Solution private cloud management plane.

> [!IMPORTANT]
> Do not give a public IP address to the jump box VM or expose 3389/TCP port to the public internet. 

:::image type="content" source="media/hub-spoke/azure-bastion-hub-vnet.png" alt-text="Diagram showing the Azure Bastion Hub virtual network." border="false":::


## Azure DNS resolution considerations

For Azure DNS resolution, there are two options available:

- Use the domain controllers deployed on the Hub (described in [Identity considerations](#identity-considerations)) as name servers.

- Deploy and configure an Azure DNS private zone.

The best approach is to combine both to provide reliable name resolution for Azure VMware Solution, on-premises, and Azure.

As a general design recommendation, use the existing Active Directory-integrated DNS deployed onto at least two Azure VMs in the Hub virtual network and configured in the Spoke virtual networks to use those Azure DNS servers in the DNS settings.

You can use Azure Private DNS, where the Azure Private DNS zone links to the virtual network.  The DNS servers are used as hybrid resolvers with conditional forwarding to on-premises or Azure VMware Solution running DNS using customer Azure Private DNS infrastructure.

To automatically manage the DNS records' lifecycle for the VMs deployed within the Spoke virtual networks, enable autoregistration. When enabled, the maximum number of private DNS zones is only one. If disabled, then the maximum number is 1000.

On-premises and Azure VMware Solution servers can be configured with conditional forwarders to resolver VMs in Azure for the Azure Private DNS zone.

## Identity considerations

For identity purposes, the best approach is to deploy at least one domain controller on the Hub. Use two shared service subnets in zone-distributed fashion or a VM availability set. For more information on extending your on-premises Active Directory (AD) domain to Azure, see [Azure Architecture Center](/azure/architecture/reference-architectures/identity/adds-extend-domain).

Additionally, deploy another domain controller on the Azure VMware Solution side to act as identity and DNS source within the vSphere environment.

As a recommended best practice, integrate [AD domain with Azure Active Directory](/azure/architecture/reference-architectures/identity/azure-ad).

<!-- LINKS - external -->
[Azure Architecture Center]: /azure/architecture/

[Hub & Spoke topology]: /azure/architecture/reference-architectures/hybrid-networking/hub-spoke

[Azure networking documentation]: ../networking/index.yml

<!-- LINKS - internal -->

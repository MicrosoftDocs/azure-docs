---
title: Concept - Integrate an Azure VMware Solution (AVS) deployment in a Hub and Spoke architecture
description: Learn about the recommendations for integrating an Azure VMware Solution (AVS) deployment in an existing or a new Hub and Spoke architecture on Azure.
ms.topic: conceptual
ms.date: 06/16/2020
---

# Integrate Azure VMware Solution (AVS) deployment in a Hub and Spoke architecture

In this article, we provide recommendations for integrating an Azure VMware Solution (AVS) deployment in an existing or a new [Hub and Spoke architecture](https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/shared-services) on Azure. 

The Hub and Spoke scenario assume a hybrid cloud environment with workloads on:

* Native Azure using IaaS or PaaS services
* Azure VMware Solution 
* vSphere on-premises

## Architecture

The Hub is a virtual network in Azure that acts as a central point of connectivity to your on-premises and AVS private cloud. The Spokes are virtual networks that run the peering with the Hub to enable cross VNET and used to isolate workloads.

Traffic between the on-premises datacenter, AVS private cloud, and the Hub goes through ExpressRoute connections. Spoke VNETs usually contain IaaS based workloads but can have PaaS services like [App Service Environments](../app-service/environment/intro.md). App Service Environments have direct integration with Azure VNETs or other PaaS services with [Azure Private Link](https://docs.microsoft.com/azure/private-link/) enabled.

The diagram shows an example of a Hub and Spoke deployment in Azure connected to on-premises and AVS through ExpressRoute.

:::image type="content" source="media/hub-spoke/avs-hub-and-spoke-deployment.png" alt-text="AVS Hub and Spoke integration deployment":::


The architecture has the following main components:

-   **On-premises site:** Customer on-premises datacenter(s) connected to Azure through an Express Route connection.

-   **AVS Private Cloud:** AVS SDDC formed by one or more vSphere clusters, each one with a maximum of 16 nodes.

-   **ExpressRoute Gateway:** Enables the communication between AVS Private Cloud, on-premises network, shared services on Hub VNET, and workloads running on Spoke VNETs.

    > [!NOTE]
    > **S2S VPN considerations:** For AVS production deployments, Azure S2S is not supported due to network requirements for HCX. However, for a PoC or non-production deployment that does not require HCX, it can be used.

-   **Hub Virtual Network:** The central point of connectivity to your on-premises network and AVS private cloud.

-   **Spoke Virtual Network**

    -   **IaaS Spoke:** An IaaS spoke will host Azure IaaS based workloads, including VM Availability Sets and virtual machine scale sets, and the corresponding network components.

    -   **PaaS Spoke:** A PaaS Spoke hosts Azure PaaS services using private addressing thanks to [Private Endpoint](https://docs.microsoft.com/azure/private-link/private-endpoint-overview) and [Private Link](https://docs.microsoft.com/azure/private-link/private-link-overview).

-   **Azure Firewall:** Acts as the central piece to segment traffic between the Spokes, on-prem, and AVS.

-   **Application Gateway:** Exposes and protects web apps that run either on Azure IaaS/PaaS or AVS virtual machines. It integrates with other services like API Management.

## Network and security considerations

ExpressRoute connections enable traffic to flow between on-premises, AVS, and the Azure network fabric. AVS uses [ExpressRoute Global Reach](https://docs.microsoft.com/azure/expressroute/expressroute-global-reach) to implement this connectivity.

On-premises connectivity may use ExpressRoute Global Reach as well, but it is not mandatory.

* **On-premises to AVS traffic flow**

  :::image type="content" source="media/hub-spoke/on-prem-to-avs-traffic-flow.png" alt-text="On-premises to AVS traffic flow":::


* **AVS to Hub VNET traffic flow**

  :::image type="content" source="media/hub-spoke/avs-to-hub-vnet-traffic-flow.png" alt-text="AVS to Hub VNET traffic flow":::


You can find more details about AVS networking and interconnectivity concepts in the [AVS product documentation](https://docs.microsoft.com/azure/azure-vmware/concepts-networking).

### Traffic segmentation

[Azure Firewall](https://docs.microsoft.com/azure/firewall/) is the central piece of the Hub and Spoke topology, deployed on the Hub VNET. Use Azure Firewall or another Azure supported network virtual appliance to establish traffic rules and segment the communication between the different spokes, on-premises, and AVS workloads.

Create route tables to direct the traffic to Azure Firewall.  For the Spoke VNETs, create a route that sets the default route to the internal interface of Azure Firewall, this way when a workload in the VNET needs to reach the AVS address space the firewall will evaluate it and apply the corresponding traffic rule to either allow or deny it.  

:::image type="content" source="media/hub-spoke/create-route-table-to-direct-traffic.png" alt-text="Create route tables to direct traffic to Azure Firewall":::


> [!IMPORTANT]
> A route with address prefix 0.0.0.0/0 on the **GatewaySubnet** setting is not supported.

Set routes for specific networks on the corresponding route table. For example, routes to reach AVS management and workloads IP prefixes from on-premises and vice versa, routing all the traffic from on-premises to AVS private cloud through Azure Firewall.

:::image type="content" source="media/hub-spoke/specify-gateway-subnet-for-route-table.png" alt-text="Set routes for specific networks on the corresponding route table":::


### Application Gateway

Azure Application Gateway V1 and V2 have been tested with web apps that run on AVS virtual machines as a backend pool. Azure Application Gateway is currently the only supported method to expose web apps running on AVS virtual machines to the internet. It can also expose the apps to internal users securely.

The diagram shows a second level of traffic segmentation using the Network Security Groups within the Spokes and the Hub to create a more granular traffic policy. To expose AVS running applications to the internet, Application Gateway is the only supported method of the writing of this solution guide.

:::image type="content" source="media/hub-spoke/avs-second-level-traffic-segmentation.png" alt-text="Second level of traffic segmentation using the Network Security Groups":::


### Jumpbox and Azure Bastion

Access AVS environment with Jumpbox, which is a Windows 10 or Windows Server virtual machine deployed in the Shared Service Subnet within the Hub VNET.

As a security best practice, deploy [Azure Bastion](https://docs.microsoft.com/azure/bastion/) service within the Hub VNET. Azure Bastion provides seamless RDP and SSH access to VMs deployed on Azure without the need to provision Public IP addresses to those resources. Once you provision the Azure Bastion service, you can access the selected VM from the Azure portal. After establishing the connection, a new tab opens, showing the Jumpbox desktop, and from that desktop, you can access the AVS Private Cloud management plane.

> [!IMPORTANT]
> Do not give a Public IP address to the Jumpbox VM or expose 3389/TCP port to the public internet. 


:::image type="content" source="media/hub-spoke/azure-bastion-hub-vnet.png" alt-text="Azure Bastion Hub VNET":::


## DNS Resolution

For DNS resolution there are two options available:

-   Use the AD Domain controllers deployed on the Hub (described in Identity Considerations) as name servers.

-   Deploy and configure an Azure DNS Private Zone.

The best approach is to combine both to provide reliable name resolution for AVS, on-premises, and Azure.

As a general design recommendation, use the existing DNS infrastructure (in this case, Active Directory-integrated DNS) deployed onto at least two Azure VMs deployed in the Hub VNET and configured in the Spoke VNETs to use those DNS servers in the DNS settings.

Azure Private DNS can still be used where the Azure Private DNS Zone is linked to the VNETs, and DNS servers are used as hybrid resolvers with conditional forwarding to on-premises/AVS running DNS names leveraging customer private DNS infrastructure.

There are several considerations to consider for Azure DNS Private Zones:

* Autoregistration should be enabled for Azure DNS to automatically manage the life cycle of the DNS records for the VMs deployed within Spoke VNETs.
* The maximum number of private DNS zones a VNET can be linked to with autoregistration enabled is only one.
* The maximum number of private DNS zones a VNET can be linked to is 1000 without autoregistration being enabled.

On-premises and AVS servers can be configured with conditional forwarders to resolver VMs in Azure for the Azure Private DNS zone.

## Identity considerations

For identity purposes, the best approach is to deploy at least one AD Domain Controller on the Hub, using the Shared Service subnet, ideally two of them in zone-distributed fashion or a VM Availability Set. See [Azure Architecture Center](https://docs.microsoft.com/azure/architecture/reference-architectures/identity/adds-extend-domain) for extending your on-premises AD domain to Azure.

Additionally, deploy another domain controller on the AVS side to act as identity and DNS source within the vSphere environment.

For vCenter and SSO, set an identity source in the Azure portal, on **Manage \> Identity \> Identity Sources**.

As recommended best practice, integrate AD domain with Azure Active Directory following the [documentation](https://docs.microsoft.com/azure/active-directory/) and
the [reference architectures](https://docs.microsoft.com/azure/architecture/reference-architectures/identity/azure-ad).


## Next steps



<!-- LINKS - external -->
[Azure Architecture Center]: https://docs.microsoft.com/azure/architecture/

[Hub & Spoke topology]: https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke

[Azure networking documentation]: https://docs.microsoft.com/azure/networking/

<!-- LINKS - internal -->



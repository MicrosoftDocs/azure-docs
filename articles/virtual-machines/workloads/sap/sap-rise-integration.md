---
title: Integrating Azure with SAP RISE managed workloads| Microsoft Docs
description: Describes integrating SAP RISE managed virtual network with customer's own Azure environment
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: robiro
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''
ms.service: virtual-machines-sap
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/14/2022
ms.author: robiro

---

# Integrating Azure with SAP RISE managed workloads

For customers with SAP solutions such as RISE with SAP Enterprise Cloud Services (ECS) and SAP S/4HANA Cloud, private edition (PCE) which are deployed on Azure, integrating the SAP managed environment with their own Azure ecosystem and third party applications is of particular importance. The following article explains the concepts utilized and best practices to follow for a secure and performant solution.

RISE with SAP S/4HANA Cloud, private edition and SAP Enterprise Cloud Services are SAP managed services of your SAP landscape, in an Azure subscription owned by SAP. The virtual network (vnet) utilized by these managed systems should fit well in your overall network concept and your available IP address space. Requirements for private IP range for RISE PCE or ECS environments are coming from SAP reference deployments. Customers specify the chosen RFC1918 CIDR IP address range to SAP. To facilitate connectivity between SAP and customers owned Azure subscriptions/vnets, a direct vnet peering can be set up. Another option is the use of a VPN vnet-to-vnet connection.

> [!IMPORTANT]
> For all details about RISE with SAP Enterprise Cloud Services and SAP S/4HANA Cloud, private edition please contact your SAP representative.

## Virtual network peering with SAP RISE/ECS

A vnet peering is the most performant way to connect securely and privately two standalone vnets, utilizing the Microsoft private backbone network. The peered networks appear as one for connectivity purposes, allowing applications to talk to each other. Applications running in different vnets, subscriptions, Azure tenants or regions are enabled to communicate directly. Like network traffic on a single vnet, vnet peering traffic remains on Microsoft’s private network and does not traverse the internet.

For SAP RISE/ECS deployments, virtual peering is the preferred way to establish connectivity with customer’s existing Azure environment. Both the SAP vnet and customer vnet(s) are protected with network security groups (NSG), enabling communication on SAP and database ports through the vnet peering. Communication between the peered vnets is secured through these NSGs, limiting communication to customer’s  SAP environment. For details and a list of open ports, contact your SAP representative.

SAP managed workload is preferably deployed in the same [Azure region](https://azure.microsoft.com/global-infrastructure/geographies/) as customer’s central infrastructure and applications accessing it. Virtual network peering can be set up within the same region as your SAP managed environment, but also through [global virtual network peering](../../../virtual-network/virtual-network-peering-overview.md) between any two Azure regions. With SAP RISE/ECS available in many Azure regions, the region ideally should be matched with workload running in customer vnets due to latency and vnet peering cost considerations. However, some of the scenarios (for example, central S/4HANA deployment for a multi-national, globally presented company) also require to peer networks globally.

:::image type="complex" source="./media/sap-rise-integration/sap-rise-peering.png" alt-text="Customer peering with SAP RISE/ECS":::
   This diagram shows a typical SAP customer's hub and spoke virtual networks. Cross-tenant virtual network peering connects SAP RISE vnet to customer's hub vnet.
:::image-end:::

Since SAP RISE/ECS runs in SAP’s Azure tenant and subscriptions, the virtual network peering needs to be set up between [different tenants](../../../virtual-network/create-peering-different-subscriptions.md). This can be accomplished by setting up the peering with the SAP provided network’s Azure resource ID and have SAP approve the peering. Add a user from the opposite AAD tenant as a guest user, accept the guest user invitation and follow process documented at [Create a VNet peering - different subscriptions](../../../virtual-network/create-peering-different-subscriptions.md#cli). Contact your SAP representative for the exact steps required. Engage the respective team(s) within your organization that deal with network, user administration and architecture to enable this process to be completed swiftly.

## VPN Vnet-to-Vnet

As an alternative to vnet peering, virtual private network (VPN) connection can be established between VPN gateways, deployed both in the SAP RISE/ECS subscription and customers own. A vnet-to-vnet connection will be established between these two VPN gateways, enabling fast communication between the two separate vnets. The respective vnets and gateways can be located in different Azure regions.

:::image type="complex" source="./media/sap-rise-integration/sap-rise-vpn.png" alt-text="Diagram ofSAP RISE/ECS VPN connection to customer vnet.":::
   This diagram shows a typical SAP customer's hub and spoke virtual networks. VPN gateway located in SAP RISE vnet connects through vnet-to-vnet connection into gateway contained in customer's hub vnet.
:::image-end:::

While vnet peering is the recommended and more typical deployment model, a VPN vnet-to-vnet can potentially simplify a complex virtual peering between customer and SAP RISE/ECS virtual networks. The VPN Gateway acts as only point of entry into the customer’s network and is managed and secured by a central team.

Network Security Groups are in effect on both customer and SAP vnet, identically to vnet peering architecture enabling communication to SAP NetWeaver and HANA ports as required. For details how to set up the VPN connection and which settings should be used, contact your SAP representative.

## Connectivity back to on-premise

With an existing customer Azure deployment, on-premise network is already connected through ExpressRoute (ER) or VPN. The same on-premise network path is typically used for SAP RISE/ECS managed workloads. Preferred architecture is to use existing ER/VPN Gateways in customer’s hub vnet for this purpose, with connected SAP RISE vnet seen as a spoke network connected to customer’s vnet hub.

:::image type="complex" source="./media/sap-rise-integration/sap-rise-on-premises.png" alt-text="Example diagram of SAP RISE/ECS as spoke network peered to customer's vnet hub and on-premise.":::
   This diagram shows a typical SAP customer's hub and spoke virtual networks. It's connected to on-premise with a connection. Cross tenant virtual network peering connects SAP RISE vnet to customer's hub vnet. The vnet peering has remote gateway transit enabled, enabling SAP RISE vnet to be accessed from on-premise.
:::image-end:::

With this architecture, central policies and security rules governing network connectivity to customer workloads also apply to SAP RISE/ECS managed workloads. The same on-premise network path is used for both customer's vnets and SAP RISE/ECS vnet.

If there's no currently existing Azure to on-premise connectivity, contact your SAP representative for details which connections models are possible to be established. Any on-premise to SAP RISE/ECS connection is then for reaching the SAP managed vnet only. The on-premise to SAP RISE/ECS connection isn't used to access customer's own Azure vnets.

**Important to note**: A virtual network can have [only have one gateway](../../../virtual-network/virtual-network-peering-overview.md#gateways-and-on-premises-connectivity), local or remote. With vnet peering established between SAP RISE/ECS using remote gateway transit like in above architecture, no gateways can be added in the SAP RISE/ECS vnet. A combination of vnet peering with remote gateway transit together with another VPN gateway in the SAP RISE/ECS vnet isn't possible.

## Virtual WAN with SAP RISE/ECS managed workloads

Similarly to using a hub and spoke network architecture with connectivity to both SAP RISE/ECS vnet and on-premises, the Azure Virtual Wan (vWAN) hub can be used for same purpose. Both connection options described earlier – vnet peering as well as VPN vnet-to-vnet – are available to be connected to vWAN hub.

The vWAN network hub is deployed and managed entirely by customer in customer subscription and vnet. On-premise connection and routing through vWAN network hub are also managed entirely by customer.

Again, contact your SAP representative for details and steps needed to establish this connectivity.

## DNS integration with SAP RISE/ECS managed workloads

Integration of customer owned networks with Cloud-based infrastructure and providing a seamless name resolution concept is a vital part of a successful project implementation.

This diagram describes one of the common integration scenarios of SAP owned subscriptions, VNets and DNS infrastructure with customer’s local network and DNS services. In this setup on-premise DNS servers are holding all DNS entries. The DNS infrastructure is capable to resolve DNS requests coming from all sources (on-premise clients, customer’s Azure services and SAP managed environments).

:::image type="complex" source="./media/sap-rise-integration/sap-rise-dns.png" alt-text="Diagram of DNS integration between SAP RISE/ECS on Azure, custom DNS in Hub VNet and on-prem DNS.":::
   This diagram shows a typical SAP customer's hub and spoke virtual networks. Cross-tenant virtual network peering connects SAP RISE vnet to customer's hub vnet. On-premise connectivity is provided from customer's hub. DNS servers are located both within customer's hub vnet as well as SAP RISE vnet, with DNS zone transfer between them. DNS Queries from customer's VMs query the customer's DNS servers.
:::image-end:::

Design description and specifics:

  - Custom DNS configuration for SAP-owned VNets

  - 2 VMs in the RISE/STE/ECS Azure vnet hosting DNS servers

  - Customers must provide and delegate to SAP a subdomain/zone (for example, \*hec.contoso.com) which will be used to assign names and create forward and reverse DNS entries for the virtual machines that run SAP managed environment. SAP DNS servers are holding a master DNS role for the delegated zone

  - DNS zone transfer from SAP DNS server to customer’s DNS servers is the primary method to replicate DNS entries from RISE/STE/ECS environment to on-premise DNS

  - Customer-owned Azure vnets are also using custom DNS configuration referring to customer DNS servers located in Azure Hub vnet.

  - Optionally, customers can set up a DNS forwarder within their Azure vnets. Such forwarder then pushes DNS requests coming from Azure services to SAP DNS servers that are targeted to the delegated zone (\*hec.contoso.com).

Alternatively, DNS zone transfer from SAP DNS servers could be performed to a customer’s DNS servers located in Azure Hub VNet (diagram above). This is applicable for the designs when customers operate custom DNS solution (e.g. [AD DS](/windows-server/identity/ad-ds/active-directory-domain-services) or BIND servers) within their Hub VNet.

**Important to note**, that both Azure provided DNS and Azure private zones **do not** support DNS zone transfer capability, hence, cannot be used to accept DNS replication from SAP RISE/STE/ECS DNS servers. Additionally, external DNS service providers are typically not supported by SAP RISE/ECS.

To further read about the usage of Azure DNS for SAP, outside the usage with SAP RISE/ECS see details in following [blog post](https://www.linkedin.com/posts/k-popov_sap-on-azure-dns-integration-whitepaper-activity-6841398577495977984-ui9V/).

## Internet outbound and inbound connections with SAP RISE/ECS

SAP workloads communicating with external applications or inbound connections from a company’s user base (for example, SAP Fiori) could require a network path to the Internet, depending on customer’s requirements. Within SAP RISE/ECS managed workloads, work with your SAP representative to explore needs for such https/RFC/other communication paths. Network communication to/from the Internet is by default not enabled for SAP RISE/ECS customers and default networking is utilizing private IP ranges only. Internet connectivity requires planning with SAP, to optimally protect customer’s SAP landscape.

Should you enable Internet bound or incoming traffic with your SAP representatives, the network communication is protected through various Azure technologies such as NSGs, ASGs, Application Gateway with Web Application Firewall (WAF), proxy servers and others. These services are entirely managed through SAP within the SAP RISE/ECS vnet and subscription. The network path SAP RISE/ECS to and from Internet remains typically within the SAP RISE/ECS vnet only and does not transit into/from customer’s own vnet(s).

:::image type="complex" source="./media/sap-rise-integration/sap-rise-internet.png" alt-text="Diagram of Internet outbound/inbound connections with SAP RISE/ECS.":::
   This diagram shows a typical SAP customer's hub and spoke virtual networks. Cross-tenant virtual network peering connects SAP RISE vnet to customer's hub vnet. On-premise connectivity is provided from customer's hub. SAP Cloud Connector VM from SAP RISE vnet connects through Internet to SAP BTP. Another SAP Cloud Connector VM connects through Internet to SAP BTP, with internet inbound and outbound connectivity facilitated by customer's hub vnet.
:::image-end:::

Applications within a customer’s own vnet connect to the Internet directly from respective vnet or through customer’s centrally managed services such as Azure Firewall, Azure Application Gateway, NAT Gateway and others. Connectivity to SAP BTP from non-SAP RISE/ECS applications takes the same network Internet bound path. Should an SAP Cloud Connecter be needed for such integration, it's placed with customer’s non-SAP VMs requiring SAP BTP communication and network path managed by customer themselves.

## SAP BTP Connectivity

SAP Business Technology Platform (BTP) provides a multitude of applications that are accessed by public IP/hostname via the Internet.
Customer services running in their Azure subscriptions access them either directly through VM/Azure service internet connection, or through User Defined Routes forcing all Internet bound traffic to go through a centrally managed firewall or other network virtual appliances.

SAP has a [preview program](https://help.sap.com/products/PRIVATE_LINK/42acd88cb4134ba2a7d3e0e62c9fe6cf/3eb3bc7aa5db4b5da9dcdbf8ee478e52.html) in operation for SAP Private Link Service for customers using SAP BTP on Azure. The SAP Private Link Service exposes SAP BTP services through a private IP range to customer’s Azure network and thus accessible privately through previously described vnet peering or VPN site-to-site connections instead of through the Internet.

See a series of blog posts on the architecture of the SAP BTP Private Link Service and private connectivity methods, dealing with DNS and certificates in following SAP blog series [Getting Started with BTP Private Link Service for Azure](https://blogs.sap.com/2021/12/29/getting-started-with-btp-private-link-service-for-azure/)

## Next steps
Check out the documentation:

- [SAP workloads on Azure: planning and deployment checklist](./sap-deployment-checklist.md)
- [Virtual network peering](../../../virtual-network/virtual-network-peering-overview.md)
- [Public endpoint connectivity for Virtual Machines using Azure Standard Load Balancer in SAP high-availability scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md)
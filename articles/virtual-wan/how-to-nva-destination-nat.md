---
title: 'Azure Virtual WAN: Configure Destination NAT for Network Virtual Appliance (NVA) in the hub'
description: Learn how to use Destination NAT with a Network Virtual Appliance in the Virtual WAN hub.
author: wellee
ms.service: virtual-wan
ms.topic: how-to
ms.date: 01/04/2023
ms.author: cherylmc
# Customer intent: As someone with a networking background, I want to create a Network Virtual Appliance (NVA) in my Virtual WAN hub and leverage destination NAT.
---
# How to configure Destination NAT (DNAT) for Network Virtual Appliance in an Azure Virtual WAN hub
The following article describes how to configure Destination NAT for Next-Generation Firewall enabled Network Virtual Appliances deployed with the Virtual WAN hub.

> [!Important]
> Destination NAT (DNAT) for Virtual WAN integrated Network Virtual Appliances is currently in Public Preview and is provided without a service-level agreement. It shouldn't be used for production workloads. Certain features might not be supported, might have constrained capabilities, or might not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Background

Network Virtual Appliances (NVAs) with Next-Generation Firewall capabilities integrated with Virtual WAN allow customers to protect and inspect traffic between 2 different customer on-premises (ExpressRoute, Site-to-site VPN, Point-to-site VPN and SD-WAN), between a customer on-premise and between two different  Azure Virtual Networks connected to Azure Virtual WAN. 

Destination NAT for Network Virtual Appliances in the Virtual WAN hub allows you to publish applications to the wider internet without directly exposing the application or server over public IP to the Internet. Consumers access applications  through a Firewall Network Virtual Appliance. The NVA is configured to filter and translate traffic and control access to backend applications.

Infrastructure management and programming for the DNAT use case in Virtual WAN is automatic. Programming the DNAT rule on the NVA automatically programs Azure infrastructure to accept and route DNAT traffic. 

## Concepts

To enable the DNAT use case associate one or more Azure Public IP address resource to the Network Virtual Appliance resource. These IP's are called **internet inbound** or **internet ingress** IP addresses. These are the target IP addresses users initiate connection requests to applications behind the NVA. After you configure a DNAT rule on the Network Virtual Appliance orchestrator and management software (see partner guide), the NVA management software automatically:
*  Programs NVA device software running in Virtual WAN to inspect and translate the corresponding traffic (set-up NAT rules and Firewall rules on NVA device). These are called **NVA DNAT rules**.
*  Interacts with Azure API's to create and update **inbound security rules**. Virtual WAN control plane processes inbound security rules and programs Virtual WAN and Azure-managed NVA infrastructure components to support Destination NAT use case.  


### Example

In the following example, users access an application hosted in an Azure Virtual Network (Application IP 10.60.0.4) connect to a DNAT Public IP's (4.4.4.4) assigned to the NVA on Port 443.

The following configurations are performed: 

*  **Internet inbound** IP addresses assigned to the NVA are 4.4.4.4 and 5.5.5.5.
* **NVA DNAT rule** is programmed to translate traffic with destination 4.4.4.4:443 to 10.60.0.4:443.
* NVA orchestrator creates **inbound security rules** and Virtual WAN control plane programs infrastructure appropriately to support traffic flow.


:::image type="content" source="./media/virtual-wan-nva-dnat/dnat-example-inbound.png"alt-text="Screenshot showing inbound traffic flow."lightbox="./media/virtual-wan-nva-dnat/dnat-example-inbound.png":::

The following describes the packet flow for the inbound connection:

1. The user initiates a connection with one of the Public IP's used for DNAT associated to the NVA. 
1. Azure load balances the connection request to one of the Firewall NVA instances.
1. NVA inspects the traffic and translates the packet based on rule configuration. In this case, the NVA is configured to NAT and forward inbound traffic to 10.60.0.4:443. The source of the packet is also NAT'd to the private IP of the chosen Firewall instance to ensure flow symmetry. The NVA forwards the packet and Virtual WAN routes the packet to the final destination.

The following describes the packet flow for the outbound response:

:::image type="content" source="./media/virtual-wan-nva-dnat/dnat-example-outbound.png"alt-text="Screenshot showing outbound traffic flow."lightbox="./media/virtual-wan-nva-dnat/dnat-example-outbound.png":::

The following describes the packet flow for the inbound connection:

1. The server responds and sends the reply packets to the NVA Firewall instance over the Firewall private IP. 
1. NVA reverses the NAT translation and fowards the response out the untrusted interface. Azure then directly sends the packet back to the user. 
## Known Limitations and Considerations

### Limitations
 
* Destination NAT is supported only for the following NVA's: **checkpoint**, **fortinet-sdwan-and-ngfw** and **fortinet-ngfw**.
* Public IP's that are used for Destination NAT must meet the following requirements:
  * Public IP's used for Destination NAT must be from the the same region as the NVA resource. For example, if the NVA is deployed in the East US region, the public IP must also be from the East US region.
  * Public IP's used for Destination NAT cannot be in use by another Azure resource. For example, you cannot use an IP address in use by a Virtual Machine network interface IP Configuration or a Standard Load Balancer front-end configuration.
  * Public IP's must be from IPv4 address spaces. Virtual WAN does not support IPv6 addresses.
* Destination NAT is only supported on new NVA deployments that are created with at least one Destination NAT Public IP. Existing NVA deployments or NVA deployments that did not have a Destination NAT Public IP associated at NVA creation time are not eligible to use Destination NAT.
* Programming Azure infrastructure components to support DNAT scenarios is done automatically by NVA orchestration software when a DNAT rule is created. Therefore, you cannot program NVA rules through Azure portal. However, you can view the inbound security rules associated to each internet inbound Public IP.
* DNAT traffic in Virtual WAN can only be routed  to connections to the same hub as the NVA. Inter-hub traffic patterns with DNAT are not supported.

### Considerations 

* Inbound Traffic is automatically load-balanced across all healthy instances of the Network Virtual Appliance.
* In most cases, NVAs must perform source-NAT to the Firewall private IP as well as the destination-NAT to ensure flow symmetry. Certain NVA types may not require source-NAT. Contact your NVA provider for best practices around source-NAT.
* Timeout for DNAT flows is automatically set to ___ seconds. 
* You can assign individual IP address resources generated from an IP address prefix to the NVA as internet inbound IPs. Assign each IP address from the prefix individually.



## Associating a new Internet Inbound Public IP to an existing NVA

1. Navigate to your Virtual WAN Hub. Select **Network Virtual Appliances** under Third Party Providers. Click on **Manage Configurations** next to the NVA.
1. Select **Internet Inbound** under NVA.
1. If the NVA is eligible for internet inbound and there are no current internet inbound IP addresses associated to the NVA, select **Enable Internet Inbound (Destination NAT) by associating a public IP to this Network Virtual Appliance**. If there are already IP's associated to this NVA, select **Add**.
1. Select the resource group and the IP address resource that you want to use for internet inbound from the dropdown.
1. Cick **save**.

## View existing rules using an Internet Inbound Public IP
1. Navigate to your Virtual WAN Hub. Select **Network Virtual Appliances** under Third Party Providers. Click on **Manage Configurations** next to the NVA.
1. Select **Internet Inbound** under NVA.
1. Find the Public IP you want to view and click **View rules**.
 
## Remove Internet Inbound public IP from existing NVA
1. Navigate to your Virtual WAN Hub. Select **Network Virtual Appliances** under Third Party Providers. Click on **Manage Configurations** next to the NVA.
1. Select **Internet Inbound** under NVA.
1. Select the IP you want to reomve from the grid.
1. Cick **Delete**.

## Programming DNAT Rules

The following section contains NVA provider-specific documentation on configuring DNAT rules with NVA's in Virtual WAN

|Partner| Documentation Link|
| --| --|
|checkpoint|[placeholderlink]()|
|fortinet| [placeholderlink]()|

## Troubleshooting
The following section describes some common troubleshooting scenarios.

### Public IP Association/Disassociation

* **Option to associate IP to NVA resource not available through Azure portal** : Only NVA's that are created with DNAT/Internet Inbound IP's at deployment time are eligible to use DNAT capabilities. Delete and re-create the NVA with a Internet Inbound IP assigned at deployment time.
* **IP address not showing up in dropdown Azure portal**: Public IP's only show up in the dropdown menu if the IP address is IPv4, in the same region as the NVA and is not in use/assigned to another Azure resource. Ensure the IP address you are trying to use meets the above requirements, or create a new IP address.
* **Cannot delete/disassociate Public IP from NVA**: Only IP addresses that have no rules associated with them can be delete. Use the NVA orchestration software to remove any DNAT rules associated to that IP address.
* **NVA provisioning state not succeeded**: If there are on-going operations on the NVA or if the provisioning status of the NVA is **not successful**, IP address association will fail. Wait for any existing operations to terminate.

### DNAT rule creation

* **DNAT rule creation fails**: Ensure the provisioning state of the NVA is Succeeded and that all NVA instances are healthy. Reference NVA provider documentation for details on how to troubleshoot or contact the vendor for further support. 
 
### Datapath
* **NVA does not see packets after user initiates connection to Public IP**: Ensure the NVA is responding to Load Balancer health probes on the external interface of the NVA. Health probe requests are made from the non-publically routable Azure IP address [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md). You should see a three-way TCP handshake performed with 168.63.129.16. The port of the handshake depends on your provider.

|NVA Provider| Port|
|--|--|
|fortinet|placeholderport| 
|checkpoint| placeholderport|

* **Destination server does not see packets after NVA translation**: consider the following troubleshooting mechanisms if packets are not being forwarded to the final destination server.
  * **Azure Routing issue**: Use Azure Virtual WAN portal to check the effective routes of the defaultRouteTable or the effective routes of your Network Virtual Appliance. You should see the subnet of the destination application in the effective routes.
  * **NVA operating system routing issue**: Check the internal routing table of the NVA operating system. You should see routes corresponding to the destination subnets learnt dynamically from the NVA. Make sure there are no route filters/maps that are dropping relevant prefixes.
  * **Inter-hub destinations not reachable**: Inter-hub  routing for DNAT use cases are not supported. Make sure the resource you are trying to access is connected to the same hub as the NVA that has the DNAT rule configured.
  * **Packet capture on NVA interfaces**: Perform packet captures on the NVA untrusted and trusted interfaces. On the untrusted interface, you should see the original packet with source IP being the user's public IP and destination IP being the internet inbound IP address assigned to the NVA. On the trusted interface, you should see the post-NAT translated packets (both source NAT and destination NAT are applied). Make sure you compare packet captures before and after Firewall rules are applied to ensure packets are not being dropped by a Firewall rule.
  * **SNAT port exhaustion**: For each NVA instance, an inbound connection to a single backend application needs to use a unique port to NAT traffic to the private IP of the NVA instance. This means each NVA instance can handle approximately 65000 concurrent connections to the same destination. For large scale use cases, ensure the NVA is configured to forward to multiple application IP addresses to faciliate port re-use.

* **Return traffic not returning to NVA**:
    * **Application hosted in Azure**: Use Azure Portal to check the effective routes of the application server. You should see the hub address space in the effective routes of the application server.
    * **Application hosted on-premises**: Make sure there are no route filters on the on-premises side that filter out routes corresponding to the hub address space. Because the NVA source-NAT's traffic to a Firewall Private IP, the on-premises must accept the hub address space.
    * **Application inter-hub**: Inter-hub  routing for DNAT use cases are not supported. Make sure the resource you are trying to access is connected to the same hub as the NVA that has the DNAT rule configured.
    * **Packet capture on NVA interface**: Perform packet captures on the NVA trusted interface. You should see the application server send return traffic directly to the NVA instance. Make sure you compare packet captures before and after Firewall rules are applied to ensure packets are not being dropped by a Firewall rule.

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

Network Virtual Appliances (NVAs) with Next-Generation Firewall capabilities that are integrated with Virtual WAN allow customers to protect and inspect traffic between private networks connected to Virtual WAN. 

Destination NAT for Network Virtual Appliances in the Virtual WAN hub allows you to publish applications to the users in the internet without directly exposing the application or server's public IP. Consumers access applications through a public IP address assigned to a Firewall Network Virtual Appliance. The NVA is configured to filter and translate traffic and control access to backend applications.

Infrastructure management and programming for the DNAT use case in Virtual WAN is automatic. Programming the DNAT rule on the NVA using the NVA orchestration software or NVA command line automatically programs Azure infrastructure to accept and route DNAT traffic for supported NVA partners. See the [limitations](#limitations) section for the list of supported NVA partners.

## Concepts

To enable the DNAT use case associate one or more Azure Public IP address resources to the Network Virtual Appliance resource. These IPs are called **internet inbound** or **internet ingress** IP addresses and are the target IP addresses users initiate connection requests to in order to access applications behind the NVA. After you configure a DNAT rule on the Network Virtual Appliance orchestrator and management software (see partner guide), the NVA management software automatically:

* Programs NVA device software running in Virtual WAN to inspect and translate the corresponding traffic (set-up NAT rules and Firewall rules on NVA device). The rules that are programmed on the NVA are called **NVA DNAT rules**.
* Interacts with Azure APIs to create and update **inbound security rules**. Virtual WAN control plane processes inbound security rules and programs Virtual WAN and Azure-managed NVA infrastructure components to support Destination NAT use case.  

### Example

In the following example, users access an application hosted in an Azure Virtual Network (Application IP 10.60.0.4) connect to a DNAT Public IP (4.4.4.4) assigned to the NVA on Port 443.

The following configurations are performed: 

* **Internet inbound** IP addresses assigned to the NVA are 4.4.4.4 and 5.5.5.5.
* **NVA DNAT rule** is programmed to translate traffic with destination 4.4.4.4:443 to 10.60.0.4:443.
* NVA orchestrator interfaces with Azure APIs to create **inbound security rules** and Virtual WAN control plane programs infrastructure appropriately to support traffic flow.

#### Inbound traffic flow

:::image type="content" source="./media/virtual-wan-network-virtual-appliance-inbound/example-inbound-flow.png"alt-text="Screenshot showing inbound traffic flow."lightbox="./media/virtual-wan-network-virtual-appliance-inbound/example-inbound-flow.png":::

The list below corresponds to the diagram above and describes the packet flow for the inbound connection:

1. The user initiates a connection with one of the Public IPs used for DNAT associated to the NVA. 
1. Azure load balances the connection request to one of the Firewall NVA instances. Traffic is sent to the external/untrusted interface of the NVA.
1. NVA inspects the traffic and translates the packet based on rule configuration. In this case, the NVA is configured to NAT and forward inbound traffic to 10.60.0.4:443. The source of the packet is also translated to the private IP (IP of trusted/internal interface) of the chosen Firewall instance to ensure flow symmetry. The NVA forwards the packet and Virtual WAN routes the packet to the final destination.

#### Outbound traffic flow
:::image type="content" source="./media/virtual-wan-network-virtual-appliance-inbound/example-outbound-flow.png"alt-text="Screenshot showing outbound traffic flow."lightbox="./media/virtual-wan-network-virtual-appliance-inbound/example-outbound-flow.png":::

The list below corresponds to the diagram above and describes the packet flow for the outbound response:

1. The server responds and sends the reply packets to the NVA Firewall instance over the Firewall private IP.
1. The NAT translation is reversed and the response is sent out the untrusted interface. Azure then directly sends the packet back to the user.

## Known Limitations and Considerations

### Limitations
 
* Destination NAT is supported only for the following NVAs: **checkpoint**, **fortinet-sdwan-and-ngfw** and **fortinet-ngfw**.
* Public IPs that are used for Destination NAT must meet the following requirements:
  * Destination NAT Public IPs  must be from the same region as the NVA resource. For example, if the NVA is deployed in the East US region, the public IP must also be from the East US region.
  * Destination NAT Public IPs can't be in use by another Azure resource. For example, you can't use an IP address in use by a Virtual Machine network interface IP Configuration or a Standard Load Balancer front-end configuration.
  * Public IPs must be from IPv4 address spaces. Virtual WAN doesn't support IPv6 addresses.
  * Public IPs must be deployed with Standard SKU. Basic SKU Public IPs are not supported.
* Destination NAT is only supported on new NVA deployments that are created with at least one Destination NAT Public IP. Existing NVA deployments or NVA deployments that didn't have a Destination NAT Public IP associated at NVA creation time aren't eligible to use Destination NAT.
* Programming Azure infrastructure components to support DNAT scenarios is done automatically by NVA orchestration software when a DNAT rule is created. Therefore, you can't program NVA rules through Azure portal. However, you can view the inbound security rules associated to each internet inbound Public IP.
* DNAT traffic in Virtual WAN can only be routed  to connections to the same hub as the NVA. Inter-hub traffic patterns with DNAT aren't supported.

### Considerations

* Inbound Traffic is automatically load-balanced across all healthy instances of the Network Virtual Appliance.
* In most cases, NVAs must perform source-NAT to the Firewall private IP in addition to  destination-NAT to ensure flow symmetry. Certain NVA types may not require source-NAT. Contact your NVA provider for best practices around source-NAT.
* Timeout for idle flows is automatically set to 4 minutes.
* You can assign individual IP address resources generated from an IP address prefix to the NVA as internet inbound IPs. Assign each IP address from the prefix individually.

## Managing DNAT/Internet Inbound configurations

The following section describes how to manage NVA configurations related to internet inbound and DNAT.

1. Navigate to your Virtual WAN Hub. Select **Network Virtual Appliances** under Third Party Providers. Click on **Manage Configurations** next to the NVA.
:::image type="content" source="./media/virtual-wan-network-virtual-appliance-inbound/manage-configurations.png"alt-text="Screenshot showing how to manage configurations for NVA."lightbox="./media/virtual-wan-network-virtual-appliance-inbound/manage-configurations.png":::

1. Select **Internet Inbound** under settings.
:::image type="content" source="./media/virtual-wan-network-virtual-appliance-inbound/select-internet-inbound.png"alt-text="Screenshot showing how to select IP to add to NVA."lightbox="./media/virtual-wan-network-virtual-appliance-inbound/select-internet-inbound.png":::

### Associating an IP address to an NVA for Internet Inbound

1. If the NVA is eligible for internet inbound and there are no current internet inbound IP addresses associated to the NVA, select **Enable Internet Inbound (Destination NAT) by associating a public IP to this Network Virtual Appliance**. If IPs are already associated to this NVA, select **Add**.
:::image type="content" source="./media/virtual-wan-network-virtual-appliance-inbound/add-inbound-ip.png"alt-text="Screenshot showing how to add IP to NVA."lightbox="./media/virtual-wan-network-virtual-appliance-inbound/add-inbound-ip.png":::

1. Select the resource group and the IP address resource that you want to use for internet inbound from the dropdown.
:::image type="content" source="./media/virtual-wan-network-virtual-appliance-inbound/select-ip.png"alt-text="Screenshot showing how to select an IP."lightbox="./media/virtual-wan-network-virtual-appliance-inbound/select-ip.png":::
1. Click **save**.
:::image type="content" source="./media/virtual-wan-network-virtual-appliance-inbound/save-ip.png"alt-text="Screenshot showing how to save IP."lightbox="./media/virtual-wan-network-virtual-appliance-inbound/save-ip.png":::

### View active inbound security rules using an Internet Inbound Public IP

1. Find the Public IP you want to view and click **View rules**.
:::image type="content" source="./media/virtual-wan-network-virtual-appliance-inbound/view-rules.png"alt-text="Screenshot showing how to view rules associated to NVA."lightbox="./media/virtual-wan-network-virtual-appliance-inbound/view-rules.png":::
1. View the rules associated to the public IP.
:::image type="content" source="./media/virtual-wan-network-virtual-appliance-inbound/rules.png"alt-text="Screenshot showing displayed rules associated to NVA."lightbox="./media/virtual-wan-network-virtual-appliance-inbound/rules.png":::
 
### Remove Internet Inbound public IP from existing NVA

> [!NOTE]
> IP addresses can only be removed if there are no rules associated to that IP is 0. Remove all rules associated to the IP by removing DNAT rules assigned to that IP from your NVA management software.

Select the IP you want to remove from the grid and click **Delete**.
:::image type="content" source="./media/virtual-wan-network-virtual-appliance-inbound/delete-ip.png"alt-text="Screenshot showing how to delete IP from NVA."lightbox="./media/virtual-wan-network-virtual-appliance-inbound/delete-ip.png":::

## Programming DNAT Rules

The following section contains NVA provider-specific instructions on configuring DNAT rules with NVAs in Virtual WAN

|Partner| Instructions|
|--|--|
|checkpoint|[Check Point documentation](https://aka.ms/ckptDNAT)|
|fortinet| Contact azurevwan@fortinet.com for access to the preview and documentation|

## Troubleshooting
The following section describes some common troubleshooting scenarios.

### Public IP Association/Disassociation

* **Option to associate IP to NVA resource not available through Azure portal** : Only NVAs that are created with DNAT/Internet Inbound IPs at deployment time are eligible to use DNAT capabilities. Delete and re-create the NVA with an Internet Inbound IP assigned at deployment time.
* **IP address not showing up in dropdown Azure portal**: Public IPs only show up in the dropdown menu if the IP address is IPv4, in the same region as the NVA and isn't in use/assigned to another Azure resource. Ensure the IP address you're trying to use meets the above requirements, or create a new IP address.
* **Can't delete/disassociate Public IP from NVA**: Only IP addresses that have no rules associated with them can be deleted. Use the NVA orchestration software to remove any DNAT rules associated to that IP address.
* **NVA provisioning state not succeeded**: If there are on-going operations on the NVA or if the provisioning status of the NVA is **not successful**, IP address association fails. Wait for any existing operations to terminate.

### <a name="healthprobeconfigs"></a> Load balancer health probes

NVA with internet inbound/DNAT capabilities relies on the NVA responding to three different Azure Load Balancer health probes to ensure the NVA is functioning as expected and route traffic. Health probe requests are always made from the nonpublically routable Azure IP Address [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md). You should see a three-way TCP handshake performed with 168.63.129.16 in your NVA logs.

For more information on Azure Load Balancer health probes, see [health probe documentation](../load-balancer/load-balancer-custom-probe-overview.md).

The health probes Virtual WAN requires are:

* **Internet Inbound or DNAT health probe**: Used to forward Internet inbound traffic to NVA untrusted/external interfaces. This health probe checks the health of the **untrusted/external** interface of the NVA only. 

  |NVA Provider| Port|
  |--|--|
  |fortinet|8008| 
  |checkpoint| 8117|

* **Datapath health probe**: Used to forward private (VNET/on-premises) traffic to NVA **trusted/internal** interfaces. Required for private routing policies. This health probe checks the health of the **trusted/internal** interface of the NVA only.

  |NVA Provider| Port|
  |--|--|
  |fortinet|8008| 
  |checkpoint| 8117|

* **NVA health probe**: Used to determine the health of the Virtual Machine Scale Set running the NVA software. This health probe checks the health of all interfaces of the NVA (both **untrusted/external** and **trusted/internal**).

  |NVA Provider| Port|
  |--|--|
  |fortinet|8008| 
  |checkpoint| 8117|

Ensure the NVA is configured to respond to the 3 health probes correctly. Common issues include:
* Health probe response set to an incorrect port.
* Health probe response incorrectly set on only the internal/trusted interface.
* Firewall rules preventing health probe response.

### DNAT rule creation

* **DNAT rule creation fails**: Ensure the provisioning state of the NVA is Succeeded and that all NVA instances are healthy. Reference NVA provider documentation for details on how to troubleshoot or contact the vendor for further support. 
 
  Additionally, ensure that the NVA is responding to **NVA health probes** on all interfaces. See the [health probes](#healthprobeconfigs) section for more information.

### Datapath

* **NVA doesn't see packets after user initiates connection to Public IP**: Ensure that the NVA is responding to **DNAT health probes** on the **external/untrusted** interface only. See the [health probes](#healthprobeconfigs) section for more information.


* **Destination server doesn't see packets after NVA translation**: consider the following troubleshooting mechanisms if packets aren't being forwarded to the final destination server.
  * **Azure Routing issue**: Use Azure Virtual WAN portal to check the effective routes of the defaultRouteTable or the effective routes of your Network Virtual Appliance. You should see the subnet of the destination application in the effective routes.
  * **NVA operating system routing issue**: Check the internal routing table of the NVA operating system. You should see routes corresponding to the destination subnets learnt dynamically from the NVA. Make sure there are no route filters/maps that are dropping relevant prefixes.
  * **Inter-hub destinations not reachable**: Inter-hub  routing for DNAT use cases aren't supported. Make sure the resource you're trying to access is connected to the same hub as the NVA that has the DNAT rule configured.
  * **Packet capture on NVA interfaces**: Perform packet captures on the NVA untrusted and trusted interfaces. On the untrusted interface, you should see the original packet with source IP being the user's public IP and destination IP being the internet inbound IP address assigned to the NVA. On the trusted interface, you should see the post-NAT translated packets (both source NAT and destination NAT are applied). Compare packet captures before and after Firewall rules are applied to ensure proper Firewall rule configuration.
  * **SNAT port exhaustion**: For each NVA instance, an inbound connection to a single backend application needs to use a unique port to NAT traffic to the private IP of the NVA instance. As a result, each NVA instance can handle approximately 65,000 concurrent connections to the same destination. For large scale use cases, ensure the NVA is configured to forward to multiple application IP addresses to facilitate port reuse.

* **Return traffic not returning to NVA**:
    * **Application hosted in Azure**: Use Azure portal to check the effective routes of the application server. You should see the hub address space in the effective routes of the application server.
    * **Application hosted on-premises**: Make sure there are no route filters on the on-premises side that filter out routes corresponding to the hub address space. Because the NVA source-NAT's traffic to a Firewall Private IP, the on-premises must accept the hub address space.
    * **Application inter-hub**: Inter-hub  routing for DNAT use cases aren't supported. Make sure the resource you're trying to access is connected to the same hub as the NVA that has the DNAT rule configured.
    * **Packet capture on NVA interface**: Perform packet captures on the NVA trusted interface. You should see the application server send return traffic directly to the NVA instance. Make sure you compare packet captures before and after Firewall rules are applied to ensure packets to ensure proper Firewall rule configuration.

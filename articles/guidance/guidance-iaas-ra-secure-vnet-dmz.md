<properties
   pageTitle="Azure Architecture Reference - IaaS: Implementing a DMZ between Azure and the Internet | Microsoft Azure"
   description="How to implement a secure hybrid network architecture with Internet access in Azure."
   services="guidance,vpn-gateway,expressroute,load-balancer,virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="christb"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/24/2016"
   ms.author="telmos"/>

# Implementing a DMZ between Azure and the Internet

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for implementing a secure hybrid network that extends your on-premises network that accepts traffic from the internet network to Azure. This reference architecture extends the architecture described in the article [Implementing a DMZ between Azure and your on-premises datacenter][implementing-a-secure-hybrid-network-architecture]. It's recommended you read that document and understand that reference architecture before reading this document.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments. 

Typical use cases for this architecture include:

- Hybrid applications where workloads run partly on-premises and partly in Azure.

- Azure infrastructure that routes incoming traffic from on-premises and the internet.

## Architecture diagram

The following diagram highlights the important components in this architecture:

> A Visio document that includes this architecture diagram is available for download at the [Microsoft download center][visio-download]. This diagram is on the "DMZ - Public" page.

[![0]][0]

- **Public IP address (PIP).** This is the IP address of the public endpoint. External users connected to the Internet can access the system through this address.

- **Network virtual appliance (NVA).**  NVA is a generic term that describes a VM performing tasks such as allowing or denying access as a firewall, optimizing WAN operations (including network compression), custom routing, or other network functionality.

- **Azure load balancer.** All incoming requests from the internet pass through this load balancer and are distributed to NVAs in the public DMZ inbound subnet.

- **Public DMZ inbound subnet.** This subnet accepts requests from the Azure load balancer. Incoming requests are passed to one of the NVAs in the DMZ.

- **Public DMZ outbound subnet.** Requests that are approved by the NVA pass through this subnet to the internal load balancer for the web tier.

## Recommendations

Azure offers many different resources and resource types, so this reference architecture can be provisioned many different ways. We have provided an Azure Resource Manager template to install the reference architecture that follows these recommendations. If you choose to create your own reference architecture you should follow these recommendations unless you have a specific requirement that a recommendation does not fit.

### NVA recommendations

Implement one set of NVAs for traffic originating on the internet and another for traffic originating on-premises. It's a security risk to use only one set of NVAs for both because this design provides no security perimeter between the two sets of network traffic. It's a benefit to use this design because it reduces the complexity of checking security rules and makes it clearer which rules correspond to each incoming network request. For example, one set of NVAs implements rules for internet traffic only while another set of NVAs implement rules for on-premises traffic only.

### Public load balancer recommendations ###

To maintain scalability and availability, deploy the public DMZ inbound NVAs in an [availability set][availability-set] and use a [internet facing load balancer][load-balancer] to distribute internet requests across the NVAs in the availability set.  

Configure the load balancer to accept requests only on the ports necessary for internet traffic. For example, restrict inbound HTTP requests to port 80 and inbound HTTPS requests to port 443.

## Scalability considerations

Design your infrastructure with an internet facing load balancer in front of the inbound public DMZ subnet from the outset. Even if your architecture initally requires a single NVA, it will be easier to scale to multiple NVAs in the future if the internet facing load balancer is already deployed.

## Availability considerations

The internet facing load balancer requires each NVA in the Public DMZ inbound subnet to implement a [health probe][lb-probe]. A health probe that fails to respond on this endpoint is considered to be unavailable, and the load balancer will direct requests to other NVAs in the same availability set. Note that if all NVAs fail to respond, your application will fail so it's important to have monitoring configured to alert DevOps when the number of healthy NVA instances falls below a threshold.

## Manageability considerations

Restrict the monitoring and management functionality for the inbound public DMZ NVA's to respond to requests from the jump box in the management subnet only. As discussed in the [Implementing a DMZ between Azure and your on-premises datacenter][implementing-a-secure-hybrid-network-architecture] document, define a single network route from the on-premises network through the gateway to the jump box in the management subnet to restrict access.  

## Security considerations

This reference architecture implements multiple levels of security:

- The internet facing load balancer directs requests to the NVAs in the inbound public DMZ subnet only, and only on the ports necessary for the application.

- The NSG rules for the inbound and outbound public DMZ subnet prevent the NVAs from being compromised by blocking requests that fall outside of the NSG rules.

- The NAT routing configuration for the NVAs directs incoming requests on port 80 and port 443 to the web tier load balancer, but ignores requests on all other ports.

Note that you should log all incoming requests on all ports. Regularly audit the logs, paying attention to requests that fall outside of expected parameters as these may indicate intrusion attempts.

## Solution deployment

A deployment for a reference architecture that implements these recommendations is available on Github. This reference architecture includes a virtual network (VNet), network security group (NSG), load balancer, and two virtual machines (VMs).

The reference architecture can be deployed either with Windows or Linux VMs by following the directions below: 

1. Right click the button below and select either "Open link in new tab" or "Open link in new window":  
[![Deploy to Azure](./media/blueprints/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-hybrid-network-secure-vnet-dmz%2FvirtualNetwork.azuredeploy.json)

2. Once the link has opened in the Azure portal, you must enter values for some of the settings: 
    - The **Resource group** name is already defined in the parameter file, so select **Create New** and enter `ra-public-dmz-network-rg` in the text box.
    - Select the region from the **Location** drop down box.
    - Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
    - Select the **Os Type** from the drop down box, **windows** or **linux**.
    - Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
    - Click on the **Purchase** button.

3. Wait for the deployment to complete.

4. Right click the button below and select either "Open link in new tab" or "Open link in new window":  
[![Deploy to Azure](./media/blueprints/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-hybrid-network-secure-vnet-dmz%2Fworkload.azuredeploy.json)

5. Once the link has opened in the Azure portal, you must enter values for some of the settings: 
    - The **Resource group** name is already defined in the parameter file, so select **Create New** and enter `ra-public-dmz-wl-rg` in the text box.
    - Select the region from the **Location** drop down box.
    - Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
    - Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
    - Click on the **Purchase** button.

6. Wait for the deployment to complete.

7. Right click the button below and select either "Open link in new tab" or "Open link in new window":  
[![Deploy to Azure](./media/blueprints/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-hybrid-network-secure-vnet-dmz%2Fsecurity.azuredeploy.json)

8. Once the link has opened in the Azure portal, you must enter values for some of the settings: 
    - The **Resource group** name is already defined in the parameter file, so select **Use Existing** and enter `ra-public-dmz-network-rg` in the text box.
    - Select the region from the **Location** drop down box.
    - Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
    - Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
    - Click on the **Purchase** button.

9. Wait for the deployment to complete.

10. The parameter files include hard-coded administrator user name and password for all VMs, and it is strongly recommended that you immediately change both. For each VM in the deployment, select it in the Azure portal and then click on **Reset password** in the **Support + troubleshooting** blade. Select **Reset password** in the **Mode** dropdown box, then select a new **User name** and **Password**. Click the **Update** button to persist.


<!-- links -->

[availability-set]: ../virtual-machines/virtual-machines-windows-manage-availability.md
[guidance-vpn-gateway]: ./guidance-hybrid-network-vpn.md
[implementing-a-multi-tier-architecture-on-Azure]: ./guidance-compute-3-tier-vm.md
[implementing-a-secure-hybrid-network-architecture]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[iptables]: https://help.ubuntu.com/community/IptablesHowTo
[lb-probe]: ../load-balancer/load-balancer-custom-probe-overview.md
[load-balancer]: ../load-balancer/load-balancer-internet-overview.md
[network-security-group]: ../virtual-network/virtual-networks-nsg.md
[ra-vpn]: ./guidance-hybrid-network-vpn.md
[ra-expressroute]: ./guidance-hybrid-network-expressroute.md
[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[visio-download]: http://download.microsoft.com/download/1/5/6/1569703C-0A82-4A9C-8334-F13D0DF2F472/RAs.vsdx
[vpn-failover]: ./guidance-hybrid-network-expressroute-vpn-failover.md
[0]: ./media/blueprints/hybrid-network-secure-vnet-dmz.png "Secure hybrid network architecture"

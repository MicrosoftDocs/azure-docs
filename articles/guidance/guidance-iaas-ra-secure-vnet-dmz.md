---
title: Implementing a DMZ between Azure and the Internet | Microsoft Docs
description: How to implement a secure hybrid network architecture with Internet access in Azure.
services: guidance,vpn-gateway,expressroute,load-balancer,virtual-network
documentationcenter: na
author: telmosampaio
manager: christb
editor: ''
tags: azure-resource-manager

ms.assetid: 6fbc8d25-815d-4e98-9ade-d423ddf19dc9
ms.service: guidance
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/23/2016
ms.author: telmos

---
# Implementing a DMZ between Azure and the Internet

[!INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for implementing a secure hybrid network that extends your on-premises network and also accepts Internet traffic to Azure. 

> [!NOTE]
> Azure has two different deployment models: [Resource Manager](../azure-resource-manager/resource-group-overview.md) and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments. 
> 
> 

This reference architecture extends the architecture described in [Implementing a DMZ between Azure and your on-premises datacenter][implementing-a-secure-hybrid-network-architecture]. This reference architecture adds a public DMZ that handles Internet traffic, in addition to the private DMZ that handles traffic from the on-premises network 

Typical uses for this architecture include:

* Hybrid applications where workloads run partly on-premises and partly in Azure.
* Azure infrastructure that routes incoming traffic from on-premises and the Internet.

## Architecture diagram

The following diagram highlights the important components in this architecture:

> A Visio document that includes this architecture diagram is available for download from the [Microsoft download center][visio-download]. This diagram is on the "DMZ - Public" page.
> 
> 

![[0]][0] 

To enable Internet traffic to Azure, the architecture includes the following components:

* **Public IP address (PIP)**. The IP address of the public endpoint. External users connected to the Internet can access the system through this address.
* **Network virtual appliance (NVA)**. This architecture includes a separate pool of NVAs for traffic originating on the Internet.
* **Azure load balancer**. All incoming requests from the Internet pass through the load balancer and are distributed to the NVAs in the public DMZ.
* **Public DMZ inbound subnet**. This subnet accepts requests from the Azure load balancer. Incoming requests are passed to one of the NVAs in the public DMZ.
* **Public DMZ outbound subnet**. Requests that are approved by the NVA pass through this subnet to the internal load balancer for the web tier.

## Recommendations

The following recommendations apply for most scenarios. Follow these recommendations unless you have a specific requirement that overrides them. 

### NVA recommendations

Use one set of NVAs for traffic originating on the Internet, and another for traffic originating on-premises. Using only one set of NVAs for both is a security risk, because it provides no security perimeter between the two sets of network traffic. Using separate NVAs reduces the complexity of checking security rules, and makes it clear which rules correspond to each incoming network request. One set of NVAs implements rules for Internet traffic only, while another set of NVAs implement rules for on-premises traffic only.

Include a layer-7 NVA to terminate application connections at the NVA level and maintain compatibility with the backend tiers. This guarantees symmetric connectivity where response traffic from the backend tiers returns through the NVA.  

### Public load balancer recommendations

For scalability and availability, deploy the public DMZ NVAs in an [availability set][availability-set] and use an [Internet facing load balancer][load-balancer] to distribute Internet requests across the NVAs in the availability set.  

Configure the load balancer to accept requests only on the ports necessary for Internet traffic. For example, restrict inbound HTTP requests to port 80 and inbound HTTPS requests to port 443.

## Scalability considerations

Even if your architecture initially requires a single NVA in the public DMZ, we recommend putting a load balancer in front of the public DMZ from the beginning. That will make it easier to scale to multiple NVAs in the future, if needed.

## Availability considerations

The Internet facing load balancer requires each NVA in the public DMZ inbound subnet to implement a [health probe][lb-probe]. A health probe that fails to respond on this endpoint is considered to be unavailable, and the load balancer will direct requests to other NVAs in the same availability set. Note that if all NVAs fail to respond, your application will fail, so it's important to have monitoring configured to alert DevOps when the number of healthy NVA instances falls below a defined threshold.

## Manageability considerations

All monitoring and management for the NVAs in the public DMZ should be be performed by the jumpbox in the management subnet. As discussed in [Implementing a DMZ between Azure and your on-premises datacenter][implementing-a-secure-hybrid-network-architecture], define a single network route from the on-premises network through the gateway to the jumpbox, in order to restrict access.

If gateway connectivity from your on-premises network to Azure is down, you can still reach the jumpbox by deploying a public IP address, adding it to the jumpbox, and logging in from the Internet.

## Security considerations

This reference architecture implements multiple levels of security:

* The Internet facing load balancer directs requests to the NVAs in the inbound public DMZ subnet, and only on the ports necessary for the application.
* The NSG rules for the inbound and outbound public DMZ subnets prevent the NVAs from being compromised, by blocking requests that fall outside of the NSG rules.
* The NAT routing configuration for the NVAs directs incoming requests on port 80 and port 443 to the web tier load balancer, but ignores requests on all other ports.

You should log all incoming requests on all ports. Regularly audit the logs, paying attention to requests that fall outside of expected parameters, as these may indicate intrusion attempts.

## Solution deployment

A deployment for a reference architecture that implements these recommendations is available on [GitHub][github-folder]. The reference architecture can be deployed either with Windows or Linux VMs by following the directions below:

1. Open [this link](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-hybrid-network-secure-vnet-dmz%2FvirtualNetwork.azuredeploy.json) in a new tab or browser window. The link takes you to the Azure Portal.
2. Once the link has opened in the Azure portal, you must enter values for some of the settings:
   
   * The **Resource group** name is already defined in the parameter file, so select **Create New** and enter `ra-public-dmz-network-rg` in the text box.
   * Select the region from the **Location** drop down box.
   * Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
   * Select the **Os Type** from the drop down box, **windows** or **linux**.
   * Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
   * Click the **Purchase** button.
3. Wait for the deployment to complete.
4. Open [this link](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-hybrid-network-secure-vnet-dmz%2Fworkload.azuredeploy.json) in a new tab or browser window.
5. Once the link has opened in the Azure portal, you must enter values for some of the settings:
   
   * The **Resource group** name is already defined in the parameter file, so select **Create New** and enter `ra-public-dmz-wl-rg` in the text box.
   * Select the region from the **Location** drop down box.
   * Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
   * Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
   * Click the **Purchase** button.
6. Wait for the deployment to complete.
7. Open [this link](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmspnp%2Freference-architectures%2Fmaster%2Fguidance-hybrid-network-secure-vnet-dmz%2Fsecurity.azuredeploy.json) in a new tab or browser window. 
8. Once the link has opened in the Azure portal, you must enter values for some of the settings:
   
   * The **Resource group** name is already defined in the parameter file, so select **Use Existing** and enter `ra-public-dmz-network-rg` in the text box.
   * Select the region from the **Location** drop down box.
   * Do not edit the **Template Root Uri** or the **Parameter Root Uri** text boxes.
   * Review the terms and conditions, then click the **I agree to the terms and conditions stated above** checkbox.
   * Click the **Purchase** button.
9. Wait for the deployment to complete.
10. The parameter files include hard-coded administrator user name and password for all VMs, and it is strongly recommended that you immediately change both. For each VM in the deployment, select it in the Azure portal and then click  **Reset password** in the **Support + troubleshooting** blade. Select **Reset password** in the **Mode** drop down box, then select a new **User name** and **Password**. Click the **Update** button to save.


[availability-set]: ../virtual-machines/virtual-machines-windows-manage-availability.md
[github-folder]: https://github.com/mspnp/reference-architectures/tree/master/guidance-hybrid-network-secure-vnet-dmz
[guidance-vpn-gateway]: ./guidance-hybrid-network-vpn.md
[implementing-a-multi-tier-architecture-on-Azure]: ./guidance-compute-3-tier-vm.md
[implementing-a-secure-hybrid-network-architecture]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[iptables]: https://help.ubuntu.com/community/IptablesHowTo
[lb-probe]: ../load-balancer/load-balancer-custom-probe-overview.md
[load-balancer]: ../load-balancer/load-balancer-Internet-overview.md
[network-security-group]: ../virtual-network/virtual-networks-nsg.md
[ra-vpn]: ./guidance-hybrid-network-vpn.md
[ra-expressroute]: ./guidance-hybrid-network-expressroute.md
[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[visio-download]: http://download.microsoft.com/download/1/5/6/1569703C-0A82-4A9C-8334-F13D0DF2F472/RAs.vsdx
[vpn-failover]: ./guidance-hybrid-network-expressroute-vpn-failover.md
[0]: ./media/blueprints/hybrid-network-secure-vnet-dmz.png "Secure hybrid network architecture"
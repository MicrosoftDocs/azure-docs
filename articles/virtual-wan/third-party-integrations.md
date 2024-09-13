---
title: 'About Third Party Integrations - Virtual WAN hub'
titleSuffix: Azure Virtual WAN
description: Learn about third-party integrations available in a Virtual WAN hub.
author: wtnlee
ms.service: azure-virtual-wan
ms.topic: conceptual
ms.date: 04/26/2024
ms.author: wellee
# Customer intent: As someone with a networking background, I want to learn about third-party integrations in a Virtual WAN hub.
---
# Third-party integrations with Virtual WAN Hub

Virtual WAN hubs offer integrations with third-party networking software solutions, providing connectivity through SD-WAN or VPN and next-generation firewall (NGFW) functionalities. There are three primary deployment models within Virtual WAN for these solutions: **Integrated Network Virtual Appliances (Integrated NVAs)**,  **software-as-a-service (SaaS) networking and security solutions** and **Azure Firewall Manager security providers**.

This article focuses on third-party integrations with the Virtual Hub. To facilitate connecting from on-premises to Azure Virtual WAN, certain devices that connect to Azure Virtual WAN have automated features to program both Site-to-site VPN Gateways in Virtual WAN and on-premises devices. This set-up  is usually managed through the device's management UI. For detailed guidance on IPsec connectivity automation, see [IPsec automation documentation.](virtual-wan-locations-partners.md)

## Integrated Network Virtual Appliances

Integrated Network Virtual Appliances (NVAs) are Microsoft-managed infrastructure-as-a-service solutions that Microsoft and select NVA providers jointly develop and offer. Integrated Network Virtual Appliances are typically deployed through Azure Marketplace Managed Applications or directly from  NVA orchestration software. The backing infrastructure of Network Virtual Appliances is deployed into the Virtual WAN Hub as a Microsoft-owned and managed virtual machine scale-set with Azure Load Balancers directly into the Virtual WAN hub. A subset of Azure infrastructure configurations are available for you to manage, scale, and troubleshoot your NVA deployments in the Virtual WAN hub.

:::image type="content" source="./media/third-party-solutions/integrated-network-virtual-appliances.png" alt-text="Integrated NVA architecture diagram." lightbox="./media/third-party-solutions/integrated-network-virtual-appliances.png":::

As a user of Integrated NVAs, you have the option to choose a scale unit for the NVA infrastructure scale unit up-front that dictates the aggregate throughput of the NVA (see provider documentation for expected throughput at each scale unit). You maintain full control over the software version and settings within the Integrated NVA operating system, as well as full control of software lifecycle management. Depending on the NVA provider, you may use the command-line or NVA-provider orchestration and management software to implement changes to the software version and configuration.

Integrated NVAs typically fall into three categories based on their capabilities:

* **Connectivity**: These NVAs acts as a  gateway in the Virtual WAN hub, enabling connections from on-premises data centers or sites using SD-WAN or IPSEC.
* **Next-generation Firewall**: These NVAs function as a security device within the Virtual WAN hub, allowing you to inspect traffic between on-premises, Azure Virtual Networks and the Internet.
* **Dual-role connectivity and Firewall**: These NVAs provide both connectivity and next-generation firewall capabilities on the same device.  

For more information on  Integrated NVAs in the Virtual WAN hub, see [NVA in the hub documentation](about-nva-hub.md).

The following solutions are currently available as Integrated NVA partners:

|Capability Type(s)| Available Partners|
|--|--|
|Connectivity|Barracuda, VMware (formerly known as Velocloud), Cisco Viptela, Aruba, Versa |
|Next-Generation Firewall (NGFW)|Check Point, Fortinet, Cisco FTDV|
| Dual-role connectivity and NGFW | Fortinet |

For more information and resources on each Integrated NVA solution, see [NVA in the hub partners](about-nva-hub.md#partners).

## Software-as-a-service (SaaS) solutions

Softeware-as-a-service (SaaS) solutions in Virtual WAN are managed by SaaS providers and are deployed directly into your Virtual WAN hub. Software-as-a-service solutions are deployed and transacted through Azure Marketplace. SaaS solutions abstract the underlying infrastructure required to run networking and security software in Virtual WAN,  providing customers with a cloud-native operational interface for programming and customizing SaaS configurations.

The SaaS provider handles the complete lifecycle management of the SaaS software, management, and configuration of Azure infrastructure, as well as scalability of the SaaS solution. For specifics on  configurations and architecture of Virtual WAN SaaS solutions, consult your SaaS provider's documentation.

:::image type="content" source="./media/third-party-solutions/software-as-a-service.png" alt-text="SaaS architecture diagram." lightbox="./media/third-party-solutions/software-as-a-service.png":::

Currently, Palo Alto Networks Cloud NGFW is the only SaaS solution available in Virtual WAN today, focusing on next-generation firewall inspection use cases. For more information on the SaaS offering provided by Palo Alto Networks, see [Palo Alto Networks Cloud NGFW documentation](how-to-palo-alto-cloud-ngfw.md)

## Azure Firewall Manager security partners providers

Azure Firewall Manager's security partner integrations simplify the process of connecting Virtual WAN to a third-party security-as-a-service (SECaaS) offering, ensuring protected Internet access for users. Unlike SaaS solutions, SECaaS infrastructure isn't deployed directly into the Virtual WAN hub but is still hosted by the SECaaS provider. Deploying a SECaaS solution through Azure Firewall Manager automatically establishes a Site-to-site VPN tunnel between the third-party security infrastructure and the Virtual WAN hub's Site-to-site VPN Gateway.

:::image type="content" source="./media/third-party-solutions/security-as-a-service.png" alt-text="SECaaS architecture diagram." lightbox="./media/third-party-solutions/security-as-a-service.png":::

Management and configuration of the SECaaS solution are accessible through tools provided by the SECaaS provider. Currently, Virtual WAN's SECaaS solutions include the following partners: Check Point, iBoss and zScalar. For more information about Azure Firewall Manager's security partner providers, refer to both [Azure Firewall Manager documentation](../firewall-manager/trusted-security-partners.md) and your preferred provider's documentation.

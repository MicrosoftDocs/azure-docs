---
title: 'About Third Party Integrations - Virtual WAN hub'
titleSuffix: Azure Virtual WAN
description: Learn about third-party integrations available in a Virtual WAN hub.
author: wtnlee
ms.service: virtual-wan
ms.topic: conceptual
ms.date: 04/26/2024
ms.author: wellee
# Customer intent: As someone with a networking background, I want to learn about third-party integrations in a Virtual WAN hub.
---
# Third-party integrations with Virtual WAN Hub

Virtual WAN hubs can be integrated with third-party networking software solutions that enable connectivity (SD-WAN or VPN) and next-generation firewall (Cloud NGFW) functionalities. The three main deployment models of integrated networking software solutions in Virtual WAN are Integrated Network Virtual Appliances (Integrated NVAs),  networking and security software-as-a-service (SaaS) solutions and Azure Firewall Manager security providers.

This article focuses on third-party integrations with the Virtual Hub. To facilitate connecting from on-premises to Azure Virtual WAN, certain devices that connect to Azure Virtual WAN have built-in automation to program Site-to-site VPN Gateways in both Virtual WAN and on-premises. Connectivity is typically set up in the device-management UI (or equivalent). For more information on IPsec connectivity automation, see [IPsec automation documentation.](virtual-wan-locations-partners.md)

## Integrated Network Virtual Appliances

Integrated Network Virtual Appliances (NVAs) are Microsoft-managed infrastructure-as-a-service solutions that Microsoft and select NVA providers jointly develop and offer. Integrated Network Virtual Appliances are typically deployed through Azure Marketplace Managed Applications or directly from  NVA orchestration software.  The backing infrastructure of Network Virtual Appliances is deployed into the Virtual WAN Hub as a Microsoft-owned and managed Virtual Machine scale-set with Azure Load Balancers directly into the Virtual WAN hub. A subset of Azure infrastructure configurations are available for you to manage, scale and troubleshoot your NVA deployments in the Virtual WAN hub.

:::image type="content" source="./media/third-party-solutions/integrated-network-virtual-appliances.png" alt-text="Integrated NVA architecture diagram." lightbox="./media/third-party-solutions/integrated-network-virtual-appliances.png":::

As an Integrated NVA user, you can select an NVA infrastructure scale unit up-front that determines the aggregate throughput of the NVA (see provider documentation for expected throughput at each scale unit). You also have full control of the software version and configurations in the Integrated NVA operating system and are in full control of software lifecycle management. Depending on the NVA provider, you may use the command-line or NVA-provider orchestration and management software to apply software version and configuration changes.

Integrated NVAs typically fall into three categories based on their capabilities:

* **Connectivity**: NVAs in the hub serve as a connectivity gateway in the Virtual WAN hub allowing you to connect on-premises data centers or site to Azure using NVA-specific connectivity protocols like SD-WAN or IPSEC.
* **Next-generation Firewall**: NVAs in the hub serve as a security appliance in the Virtual WAN hub, allowing you to inspect traffic between on-premises, Azure Virtual Networks and the Internet.
* **Dual-role connectivity and Firewall**: NVAs in the hub that provide both connectivity and next-generation firewall security capabiliites on the same device.  

For more information on  Integrated NVAs in the Virtual WAN hub, see [NVA in the hub documentation](about-nva-hub.md).

The following solutions are currently available as Integrated NVA partners:

|Capability Type(s)| Available Partners|
|--|--|
|Connectivity|Barracuda, VMware SD-WAN (formerly known as Velocloud), Cisco SD-WAN, Aruba, Versa |
|Next-Generation Firewall (NGFW)|Check Point, Fortinet|
| Dual-role connectivity and NGFW | Fortinet |

For additional documentation and resources on each Integrated NVA solution, see [NVA in the hub partners](about-nva-hub.md#partners).

## Software-as-a-service (SaaS) solutions

SaaS solutions in Virtual WAN are SaaS provider-managed software offerings that are deployed through Azure Marketplace directly into your Virtual WAN hub. Software-as-a-service solutions are deployed and transacted through Azure Marketplace. SaaS abstracts the underlying infrastructure that's needed to run networking and security software in Virtual WAN and provides customers a cloud-native operational interface to program and customize SaaS configurations.


The SaaS provider is also in charge of the end-to-end lifecycle management of the software, management and configuration of Azure infrastructure, and scalability of the SaaS solution. For more information on the available configurations and architecture of Virtual WAN SaaS solutions, reference your SaaS provider's documentation.

:::image type="content" source="./media/third-party-solutions/software-as-a-service.png" alt-text="SaaS architecture diagram." lightbox="./media/third-party-solutions/software-as-a-service.png":::

Palo Alto Networks Cloud NGFW is the only SaaS solution available in Virtual WAN today and enables next-generation firewall inspection use cases. For more information on the SaaS solution provided by Palo Alto Networks, see [Palo Alto Networks Cloud NGFW documentation](how-to-palo-alto-cloud-ngfw.md)

## Azure Firewall Manager security partners providers

Azure Firewall Manager security partner integrations automates connecting Virtual WAN to a third-party security-as-a-service (SECaaS) offering to protect internet access for your users. SECaaS solutions are hosted by the SECaaS provider and aren't deployed directly into the Virtual WAN hub. When a SECaaS solution is deployed via Azure Firewall Manager, a Site-to-site VPN tunnel between the third-party security infrastructure and your Virtual WAN hub's Site-to-site VPN Gateway is created automatically.

:::image type="content" source="./media/third-party-solutions/security-as-a-service.png" alt-text="SECaaS architecture diagram."./media/third-party-solutions/security-as-a-service.png":::

Configuration and infrastructure management on the SECaaS solution are available via SECaas provided management tools. 

The following partners are available as SECaaS solutions in Virtual WAN: Check Point, iBoss and zScalar. For more information about Azure Firewall Manager security partner providers, see [Azure Firewall Manager documentation](../firewall-manager/trusted-security-partners.md) and your preferred provider's documentation.

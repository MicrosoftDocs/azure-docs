---
title: Supported networking scenarios
titleSuffix: Azure Lab Services
description: Learn about the supported networking scenarios and architectures for lab plans in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 06/20/2023
---

# Supported networking scenarios for lab plans in Azure Lab Services

With Azure Lab Services advanced networking for lab plans you can implement various network architectures and topologies. This article lists  different networking scenarios and their support in Azure Lab Services.

## Networking scenarios

The following table lists common networking scenarios and topologies and their support in Azure Lab Services.

| Scenario | Enabled | Details |
| -------- | ------- | ------- |
|  Lab-to-lab communication | Yes  | Learn more about [setting up lab-to-lab communication](./tutorial-create-lab-with-advanced-networking.md). If lab users need multiple virtual machines, you can [configure nested virtualization](./concept-nested-virtualization-template-vm.md). |
| Open additional ports to the lab VM | No | You can't open additional ports on the lab VM, even with advanced networking. |
| Enable distant license server, such as on-premises, cross-region | Yes | Add a [user defined route (UDR)](/azure/virtual-network/virtual-networks-udr-overview) that points to the license server.<br/><br/>If the lab software requires connecting to the license server by its name instead of the IP address, you need to [configure a customer-provided DNS server](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances?tabs=redhat#name-resolution-that-uses-your-own-dns-server) or add an entry to the `hosts` file in the lab template.<br/><br/>If multiple services need access to the license server, using them from multiple regions, or if the license server is part of other infrastructure, you can use the [hub-and-spoke Azure networking best practice](/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology). |
| Access to on-premises resources, such as a license server  | Yes | You can access on-premises resources with these options: <br/>- Configure [Azure ExpressRoute](/azure/expressroute/expressroute-introduction) or create a [site-to-site VPN connection](/azure/vpn-gateway/tutorial-site-to-site-portal) (bridge the networks).<br/>- Add a public IP to your on-premises server with a firewall that only allows incoming connections from Azure Lab Services.<br/><br/>In addition, to reach the on-premises resources from the lab VMs, add a [user defined route (UDR)](/azure/virtual-network/virtual-networks-udr-overview). |
| Use a [hub-and-spoke networking model](/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology) | Yes | This scenario works as expected with lab plans and advanced networking. <br/><br/>A number of configuration changes aren't supported with Azure Lab Services, such as adding a default route on a route table. Learn about the [unsupported virtual network configuration changes](./how-to-connect-vnet-injection.md#4-optional-update-the-networking-configuration-settings). |
| Access lab VMs by private IP address (private-only labs)  | Not recommended | This scenario is functional, but makes it difficult for lab users to connect to their lab VM. In the Azure Lab Services website, lab users can't identify the private IP address of their lab VM. In addition, the connect button points to the public endpoint of the lab VM. The lab creator needs to provide lab users with the private IP address of their lab VMs. After a VM reimage, this private IP address might change.<br/><br/>If you implement this scenario, don't delete the public IP address or load balancer associated with the lab. If those resources are deleted, the lab fails to scale or publish. |
| Protect on-premises resources with a firewall  | Yes | Putting a firewall between the lab VMs and a specific resource is supported. |
| Put lab VMs behind a firewall. For example for content filtering, security, and more.  | No | The typical firewall setup doesn't work with Azure Lab Services, unless when connecting to lab VMs by private IP address (see previous scenario).<br/><br/>When you set up the firewall, a default route is added on the route table for the subnet. This default route introduces an asymmetric routing problem, which breaks the RDP/SSH connections to the lab. |
| Use third party over-the-shoulder monitoring software | Yes | This scenario is supported with advanced networking for lab plans. |
| Use a custom domain name for labs, for example `lab1.labs.myuniversity.edu.au`  | No | This scenario doesn’t work because the FQDN is defined upon creation of the lab, based on the public IP address of the lab. Changes to the public IP address aren't propagated to the connect button for the template VM or the lab VMs. |
| Enable forced-tunneling for labs, where all communication to lab VMs doesn't go over the public internet. This is also known as *fully isolated labs*.  | No | This scenario doesn’t work out of the box. As soon as you associate a route table with the subnet that contains a default route, lab users  lose connectivity to the lab.<br/>To enable this scenario, follow the steps for accessing lab VMs by private IP address. |
| Enable content filtering  | Depends | Supported content filtering scenarios:<br/>- Third-party content filtering software on the lab VM:<br/>&nbsp;&nbsp;&nbsp;&nbsp;1. Lab users should run as nonadmin to avoid uninstalling or disabling the software<br/>&nbsp;&nbsp;&nbsp;&nbsp;2. Ensure that outbound calls to Azure aren't blocked.<br/><br/>- DNS-based content filtering: filtering works with advanced networking and specifying the DNS server on the lab’s subnet. You can use a DNS server that supports content filtering to do DNS-based filtering.<br/><br/>- Proxy-based content filtering: filtering works with advanced networking if the lab VMs can use a customer-provided proxy server that supports content filtering. It works similarly to the DNS-based solution.<br/><br/>Unsupported content filtering:<br/>- Network appliance (firewall): for more information, see the scenario for putting lab VMs behind a firewall.<br/><br/>When planning a content filtering solution, implement a proof of concept to ensure that everything works as expected end to end. |
| Use a connection broker, such as Parsec, for high-framerate gaming scenarios | Not recommended | This scenario isn’t directly supported with Azure Lab Services and would run into the same challenges as accessing lab VMs by private IP address. |
| *Cyber field* scenario, consisting of a set of vulnerable VMs on the network for lab users to discover and hack into (ethical hacking)  | Yes | This scenario works with advanced networking for lab plans. Learn about the [ethical hacking class type](./class-type-ethical-hacking.md). |
| Enable using Azure Bastion for lab VMs  | No | Azure Bastion isn't supported in Azure Lab Services. |
| Set up line-of-sight to domain controller | Not recommended | Line-of-sight from a lab to a domain controller is required to Microsoft Entra hybrid join or AD domain join VMs; however, we currently do *not* recommend that lab VMs be Microsoft Entra joined/registered, Microsoft Entra hybrid joined, or AD domain joined due to product limitations. |

## Next steps

- [Connect a lab plan to virtual network with advanced networking](./how-to-connect-vnet-injection.md)
- [Tutorial: Set up lab-to-lab communication](./tutorial-create-lab-with-advanced-networking.md)
- Provide feedback or request new features on the [Azure Lab Services community site](https://feedback.azure.com/d365community/forum/502dba10-7726-ec11-b6e6-000d3a4f032c)

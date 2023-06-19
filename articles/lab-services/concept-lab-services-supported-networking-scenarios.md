---
title: Supported networking scenarios
titleSuffix: Azure Lab Services
description: Learn about the supported networking scenarios and architectures for lab plans in Azure Lab Services.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: conceptual
ms.date: 06/16/2023
---

# Supported networking scenarios for lab plans in Azure Lab Services

Azure Lab Services with Advanced Networking was announced as generally available in August 2022. Customers are using the advanced networking feature on various network architectures and topologies with Lab Plans. We compiled scenarios to label what works and what doesn’t with Azure Lab Services. For any feature requests, please add them to the Azure Lab Services Share Your Ideas community site! 

## Networking scenarios

The following table lists common networking scenarios and topologies and their support with Azure Lab Services.

| Scenario | Enabled | Details |
| -------- | ------- | ------- |
|  Lab-to-lab communication | Yes  | Learn more about [setting up lab-to-lab communication](./tutorial-create-lab-with-advanced-networking.md). If lab users need multiple virtual machines, you can [configure nested virtualization](./concept-nested-virtualization-template-vm.md). |
| Open additional ports to the lab VM | No | You can't open additional ports on the lab VM, even with advanced networking.<br/><br/>A workaround solution is to use PowerShell or the Azure SDK to manually add the NAT rules for every VM in the lab (every private IP address). This solution is not recommended because of the limit on the number of allowed rules for load balancers, and because it's unclear to lab users what the port number for their lab VM is. |
| Enable distant license server, such as on-premises, cross-region | Yes | Add a [user defined route (UDR)](/azure/virtual-network/virtual-networks-udr-overview) that points to the license server.<br/><br/>If the software requires connecting to the license server by its name instead of the IP address, you need to [configure a customer-provided DNS server](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances?tabs=redhat#name-resolution-that-uses-your-own-dns-server) or add an entry to the `hosts` file in the lab template.<br/><br/>If multiple services need access to the license server, using them from multiple regions, or if the license server is included in other infrastructure, you can use the [hub-and-spoke Azure networking best practice](/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology). |
| Access to on-premises resources, such as a license server  | Yes | To access on-premises resources: <br/>1. Configure [Azure ExpressRoute](/azure/expressroute/expressroute-introduction) or create a [site-to-site VPN connection](/azure/vpn-gateway/tutorial-site-to-site-portal) (bridge the networks).<br/>2. Add a public IP to your on-premises server with a firewall that only allows incoming connections from Azure Lab Services.<br/><br/>To reach the on-premises resources from the lab VMs, add a [user defined route (UDR)](/azure/virtual-network/virtual-networks-udr-overview). |
| Enable Azure networking best-practices (hub-and-spoke model) | Yes | This works as expected with lab plans and advanced networking. <br/><br/>A number of configuration changes are not supported with Azure Lab Services, such as adding a default route on a route table. Learn about the [unsupported virtual network configuration changes](./how-to-connect-vnet-injection.md#4-optional-update-the-networking-configuration-settings). |
| Access lab VMs by private IP address (private-only labs)  | Not recommened | This scenario is functional, but makes it difficult for lab users to connect to their lab VM. In the Azure Lab Services website, lab users can't identify the private IP address of their lab VM. In addition, the connect button points to the public endpoint of the lab VM. The lab creator needs to provide lab users with the private IP address of their lab VMs. After a VM reset, this private IP address might change.<br/><br/>If you implement this scenario, don't delete the public IP address or load balancer associated with the lab. If those resources are deleted, the lab will fail to scale or publish. |
| Protect on-premises resources with a firewall  | Yes | Putting a firewall between the lab VMs and a specific resource is supported. |
| Put lab VMs behind a firewall. For example for content filtering, security, and more.  | No | The typical firewall setup doesn't work with Azure Lab Services, unless when connecting to lab VMs by private IP address (see previous scenario).<br/><br/>When you setup the firewall, a default route is added on the route table for the subnet. This default route introduces an asymmetric routing problem, which breaks the RDP/SSH connections to the lab. |
| Use 3rd party over-the-shoulder monitoring software | Yes | This is supported with advanced networking for lab plans. |
| Give labs a consistent domain name (for example, `lab1.labs.myuniversity.edu.au`)  | No | This doesn’t work because the FQDN is defined upon creation of the lab, based on the public IP address of the lab. Changes to the public IP address are not propagated to the connect button for the template VM or the lab VMs. |
| Enable forced-tunneling for labs, where all communication to lab VMs doesn't go over the public internet. This is also known as *fully isolated labs*.  | No | This doesn’t work out of the box. As soon as you associate a route table with the subnet that contains a default route, lab users  lose connectivity to the lab.<br/>To enable this scenario, follow the steps for accessing lab VMs by private IP address. |
| Enable Content Filtering  | Depends | Supported content filtering scenarios:<br/><br/>- Third-party content filtering software on the lab VM:<br/>  1. Lab users should run as non-admin to avoid uninstalling or disabling the software<br/>  2. Ensure that outbound calls to Azure aren't blocked<br/>- DNS-based content filtering: filtering works with advanced networking and specifying the DNS server on the lab’s subnet. You can use a DNS server that supports content filtering to do DNS-based filtering.<br/><br/>- Proxy-based content filtering: filtering works with advanced networking if the lab VMs can use a customer-provided proxy server that supports content filtering. It works similarly to the DNS-based solution.<br/><br/>Unsupported content filtering:<br/><br/>- Network appliance (firewall): for more details, see the scenario for putting lab VMs behind a firewall.<br/><br/>When planning a content filtering solution, implement a proof of concept to ensure that everything works as expected end to end. |
| Leverage a connection broker, such as Parsec, for high-framerate gaming scenarios | Not recommended | This scenario isn’t directly supported with Azure Lab Services and would run into the same challenges as accessing lab VMs by private IP address. |
| *Cyber Field* scenario, consisting of a set of vulnerable VMs on the network for lab users to discover and hack into (Ethical Hacking)  | Yes | This works with advanced networking for lab plans. Learn about the [ethical hacking class type](./class-type-ethical-hacking.md). |
| Enable using Azure Bastion for Student VMs  | No | Azure Bastion is not supported in Azure Lab Services. |

## Next steps

- [Connect a lab plan to virtual network with advanced networking](./how-to-connect-vnet-injection.md)
- [Tutorial: Set up lab-to-lab communication](./tutorial-create-lab-with-advanced-networking.md)

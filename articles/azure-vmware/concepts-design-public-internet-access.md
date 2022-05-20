---
title: Concept - Internet connectivity design considerations
description: Options for Azure VMware Solution Internet Connectivity. 
ms.topic: conceptual
ms.date: 5/12/2022
---
# Internet connectivity design considerations 

There are three primary patterns for creating outbound access to the Internet from Azure VMware Solution and to enable the Internet to access resources on your Azure VMware Solution private cloud (inbound). 

1. An Internet capability hosted in Azure Native. 
1. Azure VMware Solution managed SNAT. 
1. Azure Public IP down to the NSX edge. 

Your requirements for security controls, visibility, capacity, and operations drive the selection of the appropriate method for delivery of Internet access to the Azure VMware Solution private cloud.  

## Internet Service hosted in Azure 

There are multiple ways to generate a default route in Azure and send it towards your Azure VMware Solution private cloud or on-prem. The options are as follows: 

- An Azure firewall in a Virtual WAN Hub. 
- A third party Network Virtual Appliance in a Virtual WAN Hub Spoke Virtual Network.
- A third party Network Virtual Appliance in a Native Azure Virtual Network using Azure Route Server. 
- A default route from on-premises transferred to Azure VMware Solution over Global Reach. 

Any of these patterns can be used to provide an outbound SNAT service that includes the ability to control what sources are allowed out, to view the connection logs, and for some services, do further traffic inspection. 

The same service can also consume an Azure Public IP and create an inbound DNAT from the Internet towards targets in  Azure VMware Solution.    

An environment can also be built that utilizes multiple paths for Internet traffic.  One for outbound SNAT, (for example, a third party security NVA), and another for inbound DNAT (like a third party Load balancer NVA using SNAT pools for return traffic). 

## Azure VMware Solution Managed SNAT 

A Managed SNAT service provides a simple method for outbound internet access from an Azure VMware Solution private cloud. Characteristics of this service include the following. 

- Easily enabled – select the radio button on Internet Connectivity blade and all workload networks will have immediate outbound access to the Internet through a SNAT gateway.
- No control over SNAT rules, all sources that reach the SNAT service are allowed.
- No visibility into connection logs.
- Two Public IPs are used and rotated to support up to 128k simultaneous outbound connections.
- No inbound DNAT capability is available with the  Azure VMware Solution Managed SNAT. 

## Public IP to NSX edge 

The final option is the ability to bring an Azure Public IP allocated directly to the NSX Edge for consumption. This option allows the Azure VMware Solution private cloud to directly consume and apply public network addresses in NSX as required.  These can be used for outbound SNAT configurations, inbound DNAT, load balancing using VMware AVI third party Network Virtual Appliances, or application directly to a workload VM interface. This option also lets you configure the public address on a third party Network Virtual Appliance to create a DMZ within the Azure VMware Solution private cloud.
   
Characteristics include: 

   - Scale – the soft limit of 64 public IPs can be increased by request to 1000s of Public IPs allocated if required by an application.
   - Flexibility – A Public IP can be applied anywhere in the NSX ecosystem.  It can be used to provide SNAT or DNAT, on load balancers like VMware’s AVI, or third party Network Virtual Appliances, on third party Network Virtual Security Appliances on VMware segments or VMs directly. 
- Regionality – the Public IP to the NSX Edge is unique to the local SDDC. For “multi private cloud in distributed regions,” with local exit to Internet intentions, it’s much easier to direct traffic locally versus trying to control default route propagation for a security or SNAT service hosted in Azure. If you've two or more Azure VMware Solution Private Clouds connected with a Public IP configured, they can both have a local exit.  

### Considerations on selecting an option 

The option that you select depends on the following factors: 

1. If you already have a security inspection point provisioned in Azure native that inspects all internet traffic from Azure native endpoints, and you wish to add an Azure VMware private cloud to that configuration, you should use an Azure native construct and leak a default route from Azure to your Azure VMware Solution private cloud.
1. If you need to run a third party Network Virtual Appliance to conform to existing standards for security inspection or streamlined opex, if you have the choice of running it in Azure native with the default route method or running it in Azure VMware Solution using Public IP to NSX edge. 
1. There are scale limits on how many Public IPs can be allocated to a Network Virtual Appliance running in native Azure or provisioned on Azure Firewall.  The Public IP to NSX edge option allows for much higher allocations if necessary (1000s versus 100s).
1. If you have multiple Azure VMware Solution private clouds in multiple Azure regions, that need to communicate with each other, and communicate with the Internet, it can be challenging to match a PC with a security service in Azure because of the way a default route from Azure is propagated.  Using Public IP to the NSX edge allows for localized exit to the internet from each private cloud in its local region. 

### Next Steps
 
[Enable Managed SNAT for Azure VMware Solution Workloads](enable-managed-snat-for-avs-workloads.md)<br>
[Enable Public IP to the NSX Edge for Azure VMware Solution](enable-public-ip-to-the-nsx-edge.md)<br>
[Disable Internet access or enable a default route](disable-internet-access.md)
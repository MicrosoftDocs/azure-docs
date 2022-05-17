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

## Internet Service hosted in Azure (or On Prem) 

There are multiple ways to generate a default route in Azure and send it towards your Azure VMware Solution Private Cloud. These include the following: 

- An Azure firewall in a Virtual WAN Hub. 
- A 3<sup>rd</sup> party Network Virtual Appliance in a Virtual WAN Hub Spoke Vnet.
- A 3<sup>rd</sup> Party Network Virtual Appliance in a Native Azure Virtual Network using Azure Route Server. 
- A default route from On-Premises transferred to Azure VMware Solution over Global Reach. 

Any of these patterns can be used to provide an outbound SNAT service that includes the ability to control what sources are allowed out, to view the connection logs, and for some services, do further traffic inspection. 

The same service can also consume an Azure Public IP and create an inbound DNAT from the Internet towards targets in  Azure VMware Solution.    

An environment can also be built that utilizes multiple paths for Internet traffic.  One for outbound SNAT, say a 3<sup>rd</sup> party security NVA, and one for inbound DNAT, like a 3<sup>rd</sup> party Load balancer NVA using SNAT pools for return traffic. 

## Azure VMware Solution Managed SNAT 

A managed SNAT service that provides a simple method for outbound internet access from an Azure VMware Solution environment. Characteristics of this service include the following. 

- Easily enabled – select the radio button on Internet Connectivity blade and all workload networks will have immediate outbound access to the Internet through a SNAT gateway.
- No control over SNAT rules, all sources that reach the SNAT service are allowed.
- No visibility into connection logs.
- Two Public IPs are used and rotated to support up to 128k simultaneous outbound connections.
- No inbound DNAT capability is available with the  Azure VMware Solution managed SNAT. 

## Public IP to NSX edge 

The final option is the ability to bring an Azure Public IP allocated directly to the NSX Edge for consumption.  This allows the Azure VMware Solution environment to directly consume and apply public network addresses in NSX as required.  These can be used for outbound SNAT configurations, inbound DNAT, load balancing using VMware AVI or 3<sup>rd</sup> party NVA’s, or application directly to a workload VM interface.    

- This option also lets you configure the public address on a 3<sup>rd</sup> party NVA if required to create a DMZ within the Azure VMware Solution environment.   
Some characteristics include: 

   - Scale – the soft limit of 64 public IP’s can be increased by request to 1000s of Public IP’s allocated if required by an application.
   - Flexibility – A public IP can be applied anywhere in the NSX ecosystem.  In NSX to provide SNAT or DNAT, on load balancers like VMware’s AVI, or 3<sup>rd</sup> party NVA’s.  On 3<sup>rd</sup> Party NVA security appliances.  On VMware segments or VM’s directly. 
- Regionality – the PIP to NSX is unique to the local SDDC. For “multi private cloud in distributed regions,” with local exit to Internet intentions, it’s much easier to direct traffic locally versus trying to control default route propagation for a security or SNAT service hosted in Azure. If you have two or more Azure VMware Solution Private Clouds connected with a Public IP configured, they can both have a local exit.  

### Considerations on selecting an option 

The option that you select depends on the following factors: 

1. If you already have a security inspection point provisioned in Azure native that inspects all internet traffic from Azure native endpoints, and you wish to add an Azure VMware Private Cloud to that configuration, you should use an Azure native construct and leak the default route from Azure to your Azure VMware Solution Private Cloud.
1. If you need to run a 3<sup>rd</sup> party NVA to conform to existing standards for security inspection or for streamlined opex.  You have the choice of running it in Azure native with the default route method or running it in Azure VMware Solution using PIP to NSX edge. 
1. There are scale limits on how many Public IP’s can be allocated to an NVA running in Native Azure or provisioned on Azure Firewall.  The Public IP to NSX edge option allows for much higher allocations if required (1000s versus 100s). 
1. If you have multiple Azure VMware Solution private clouds in multiple Azure regions which need to communicate with each other, and communicate with the Internet, it can be challenging to match a PC with a security service in Azure because of the way a default route from Azure is propagated.  Using Public IP to the NSX edge allows for localized exit to the internet from each private cloud in its local region. 

### Next Steps 
>[!div class="nextstepaction"]
>[Enable Managed SNAT for Azure VMware Solution Workloads](enable-managed-snat-for-avs-workloads.md)<br>
>[Enable Public IP to the NSX Edge for Azure VMware Solution](enable-public-ip-to-the-nsx-edge.md)<br>
>[Disable Internet access or enable a default route](disable-internet-access.md)
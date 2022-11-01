---
title: Concept - Internet connectivity design considerations
description: Options for Azure VMware Solution Internet Connectivity. 
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 5/12/2022
---

# Internet connectivity design considerations (Preview) 

There are three primary patterns for creating outbound access to the Internet from Azure VMware Solution and to enable inbound  Internet access to resources on your Azure VMware Solution private cloud. 

- [Internet Service hosted in Azure](#internet-service-hosted-in-azure) 
- [Azure VMware Solution Managed SNAT](#azure-vmware-solution-managed-snat) 
- [Public IP to NSX edge](#public-ip-to-nsx-edge) 

Your requirements for security controls, visibility, capacity, and operations drive the selection of the appropriate method for delivery of Internet access to the Azure VMware Solution private cloud.  

## Internet Service hosted in Azure 

There are multiple ways to generate a default route in Azure and send it towards your Azure VMware Solution private cloud or on-premises. The options are as follows: 

- An Azure firewall in a Virtual WAN Hub. 
- A third-party Network Virtual Appliance in a Virtual WAN Hub Spoke Virtual Network.
- A third-party Network Virtual Appliance in a Native Azure Virtual Network using Azure Route Server. 
- A default route from on-premises transferred to Azure VMware Solution over Global Reach. 

Use any of these patterns to provide an outbound SNAT service with the ability to control what sources are allowed out, to view the connection logs, and for some services, do further traffic inspection. 

The same service can also consume an Azure Public IP and create an inbound DNAT from the Internet towards targets in  Azure VMware Solution.    

An environment can also be built that utilizes multiple paths for Internet traffic.  One for outbound SNAT (for example, a third-party security NVA), and another for inbound DNAT (like a third party Load balancer NVA using SNAT pools for return traffic). 

## Azure VMware Solution Managed SNAT 

A Managed SNAT service provides a simple method for outbound internet access from an Azure VMware Solution private cloud. Features of this service include the following. 

- Easily enabled – select the radio button on the Internet Connectivity tab and all workload networks will have immediate outbound access to the Internet through a SNAT gateway.
- No control over SNAT rules, all sources that reach the SNAT service are allowed.
- No visibility into connection logs.
- Two Public IPs are used and rotated to support up to 128k simultaneous outbound connections.
- No inbound DNAT capability is available with the  Azure VMware Solution Managed SNAT. 

## Public IP to NSX edge 

This option brings an allocated Azure Public IP directly to the NSX Edge for consumption. It allows the Azure VMware Solution private cloud to directly consume and apply public network addresses in NSX as required. These addresses are used for the following types of connections:
- Outbound SNAT
- Inbound DNAT
- Load balancing using VMware AVI third-party Network Virtual Appliances
- Applications directly connected to a workload VM interface.  

This option also lets you configure the public address on a third-party Network Virtual Appliance to create a DMZ within the Azure VMware Solution private cloud.
   
Features include: 

   - Scale – the soft limit of 64 public IPs can be increased by request to 1000s of Public IPs allocated if required by an application.
   - Flexibility – A Public IP can be applied anywhere in the NSX ecosystem. It can be used to provide SNAT or DNAT, on load balancers like VMware’s AVI, or third-party Network Virtual Appliances. It can also be used on third-party Network Virtual Security Appliances on VMware segments or on directly on VMs. 
   - Regionality – the Public IP to the NSX Edge is unique to the local SDDC. For “multi private cloud in distributed regions,” with local exit to Internet intentions, it’s much easier to direct traffic locally versus trying to control default route propagation for a security or SNAT service hosted in Azure. If you've two or more Azure VMware Solution private clouds connected with a Public IP configured, they can both have a local exit.  

## Considerations for selecting an option 

The option that you select depends on the following factors: 

- To add an Azure VMware private cloud to a security inspection point provisioned in Azure native that inspects all Internet traffic from Azure native endpoints, use an Azure native construct and leak a default route from Azure to your Azure VMware Solution private cloud.
- If you need to run a third-party Network Virtual Appliance to conform to existing standards for security inspection or streamlined opex, you have two options. You can run your Public IP in Azure native with the default route method or run it in Azure VMware Solution using Public IP to NSX edge. 
- There are scale limits on how many Public IPs can be allocated to a Network Virtual Appliance running in native Azure or provisioned on Azure Firewall.  The Public IP to NSX edge option allows for much higher allocations (1000s versus 100s).
- Use a Public IP to the NSX for a localized exit to the Internet from each private cloud in its local region. Using multiple Azure VMware Solution private clouds in several Azure regions that need to communicate with each other and the Internet, it can be challenging to match an Azure VMware Solution private cloud with a security service in Azure. The difficulty is due to the way a default route from Azure works.

## Next Steps
 
[Enable Managed SNAT for Azure VMware Solution Workloads](enable-managed-snat-for-workloads.md)

[Enable Public IP to the NSX Edge for Azure VMware Solution (Preview)](enable-public-ip-nsx-edge.md)

[Disable Internet access or enable a default route](disable-internet-access.md)

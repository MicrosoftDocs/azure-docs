---
title: Configure your ASE to be force tunneled
description: Enable your ASE to work when outbound traffic is force tunneled
services: app-service
documentationcenter: na
author: ccompy
manager: stefsch

ms.assetid: 384cf393-5c63-4ffb-9eb2-bfd990bc7af1
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/17/2017
ms.author: ccompy
---
The App Service Environment is a deployment of the Azure App Service in a customer's Azure Virtual Network (VNet). Many customers configure their VNets to be extentions of their on premises networks with VPNs or ExpressRoute connections.

The ASE has a number of external dependencies which are enumerated in this [ASE Network Architecture][network] document. 

If communication is blocked or slowed down too much, the ASE can become unhealthy. The ASE, by default, requires that all outbound communication goes through the VIP that is provisioned with the ASE.  

There is an ability to change the egress endpoint used by the ASE. This can be used to support forced tunneling situations where the outbound traffic from the ASE is changed. The primary reason for this capability is to support forced tunnel configurations with ExpressRoute connections. 

To enable ASE operations in a forced tunnel Azure virtual network:

1. Get the IP addresses you want to use as egress IPs for your ASE.  If you are doing forced tunneling then this would be your NATs or gateway IPs.  If you were using an NVA then it would be the public IP of the NVA.
1. Create or edit a route table and populate the rules to allow access to/from the management IPs that map to your ASE location.  Those IPs are here, [App Service Environment management addresses][management] 
1. Set the firewall IPs:
  1.	Edit for existing ASE -  Got to in resource.azure.com and open up: Subscription/<subscription id>/resourceGroups/<ase resource group>/providers/Microsoft.Web/hostingEnvironments/<ase name> then you will see the json that describes your ASE.  Make sure it says read/write at the top.  Click Edit   Scroll down to the bottom and change userWhitelistedIpRanges from  
"userWhitelistedIpRanges": null 
To something more like 
"userWhitelistedIpRanges": [
      "51.111.222.33/32".
     “44.55.66.0/24”
    ]
    as appropriate.  Then click PUT at the top.   This will trigger a scale operation on your ASE.
1.	Create a new ASE – Create your ASE with a template.  
1. pre-create the subnet to be used by the ASE
1. Create a route table with the management IPs that map to your ASE location and assign it to your ASE
1. Put route table on the subnet
1. Put the userWhitelistedIpRanges with your values in your template with the values needed.



[management]: ./management-addresses.md
[network]: ./network-info.md

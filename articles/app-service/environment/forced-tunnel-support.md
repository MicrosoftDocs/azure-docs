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
The App Service Environment is a deployment of the Azure App Service in a customer's Azure Virtual Network (VNet). Many customers configure their VNets to be extentions of their on premises networks with VPNs or ExpressRoute connections. Due to corporate policies or other security constraints, they configure routes to send all outbound traffic on premises before it can go out to the internet. Changing the routing of the VNet so that the outbound traffic from the VNet flows through the VPN or ExpressRoute connection to on premises is called forced tunneling.  

Forced tunneling can cause problems for an ASE. The ASE has a number of external dependencies which are enumerated in this [ASE Network Architecture][network] document. The ASE, by default, requires that all outbound communication goes through the VIP that is provisioned with the ASE.  

This document describes how to enable an ASE to operate in a forced tunnel configuration.  More specifically, this information enables the customer to change the egress endpoint used by the ASE. This can be used to support forced tunneling situations or any other situation where the egress address must be changed.

In an Azure Virtual Network, routing is done based on Longest Prefix Match (LPM).  If there is more than one route with the same LPM match then a route is selected based on its origin in the following order:

1. User defined route
1. BGP route (when ExpressRoute is used)
1. System route

To learn more about routing in a VNet, read [User defined routes and IP forwarding][routes]. 

An ASE not only has external dependencies but it also must listen for inbound traffic to manage the ASE. The ASE must be able to respond to such traffic and the replies cannot be sent back from another address as that breaks TCP.

You can configure the ASE with a different egress address after the ASE is already up and operational or during ASE deployment.  

### Configure an existing ASE to use a different egress address ###

1. Get the IP addresses you want to use as egress IPs for your ASE. If you are doing forced tunneling then this would be your NATs or gateway IPs.  If you were routing all of the ASE outbound traffic through an NVA, then the egress address would be the public IP of the NVA.
1. Set the egress addresses in your ASE configuration information. Go to resource.azure.com and navigate to: Subscription/<subscription id>/resourceGroups/<ase resource group>/providers/Microsoft.Web/hostingEnvironments/<ase name> then you will see the json that describes your ASE.  Make sure it says read/write at the top.  Click Edit   Scroll down to the bottom and change userWhitelistedIpRanges from  

      "userWhitelistedIpRanges": null 
      To something more like 
      "userWhitelistedIpRanges": [
          "51.111.222.33/32".
          "44.55.66.0/24"
          ] 

   as appropriate. Then click PUT at the top. This will trigger a scale operation on your ASE.
1. Create or edit a route table and populate the rules to allow access to/from the management addresses that map to your ASE location.  The management addreses are here, [App Service Environment management addresses][management] 

### Create a new ASE with a different egress address  ###
1. pre-create the subnet to be used by the ASE
1. Create a route table with the management IPs that map to your ASE location and assign it to your ASE
1. Put route table on the subnet
1. Put the userWhitelistedIpRanges with your values in your template with the values needed.



[management]: ./management-addresses.md
[network]: ./network-info.md
[routes]: ../../virtual-network/virtual-networks-udr-overview.md

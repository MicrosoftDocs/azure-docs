---
title: Configure your Azure App Service Environment to be force tunneled
description: Enable your App Service Environment to work when outbound traffic is force tunneled
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
ms.date: 11/10/2017
ms.author: ccompy
---

# Configure your App Service Environment with forced tunneling

The App Service Environment is a deployment of Azure App Service in customer's instance of Azure Virtual Network. Many customers configure their virtual networks to be extensions of their on-premises networks with VPNs or ExpressRoute connections. Due to corporate policies or other security constraints, they configure routes to send all outbound traffic on-premises before it can go out to the internet. Changing the routing of the virtual network so that the outbound traffic from the virtual network flows through the VPN or ExpressRoute connection to on-premises is called forced tunneling. 

Forced tunneling can cause problems for an App Service Environment. The App Service Environment has a number of external dependencies, which are enumerated in this [App Service Environment Network Architecture][network] document. The App Service Environment, by default, requires that all outbound communication goes through the VIP that is provisioned with the App Service Environment.

Routes are a critical aspect of what forced tunneling is and how to deal with it. In an Azure virtual network, routing is done based on the longest prefix match (LPM). If there is more than one route with the same LPM match, a route is selected based on its origin in the following order:

* User-defined route (UDR)
* BGP route (when ExpressRoute is used)
* System route

To learn more about routing in a virtual network, read [User-defined routes and IP forwarding][routes]. 

If you want your App Service Environment to operate in a forced tunnel virtual network, you have two choices:

* Enable your App Service Environment to have direct internet access.
* Change the egress endpoint for your App Service Environment.

## Enable your App Service Environment to have direct internet access

For your App Service Environment to work while your virtual network is configured with an ExpressRoute, you can:

* Configure ExpressRoute to advertise 0.0.0.0/0. By default, it force tunnels all outbound traffic on-premises.
* Create a UDR. Apply it to the subnet that contains the App Service Environment with an address prefix of 0.0.0.0/0 and a next hop type of Internet.

If you make these two changes, internet-destined traffic that originates from the App Service Environment subnet isn't forced down the ExpressRoute, and the App Service Environment works.

> [!IMPORTANT]
> The routes defined in a UDR must be specific enough to take precedence over any routes advertised by the ExpressRoute configuration. The preceding example uses the broad 0.0.0.0/0 address range. It can potentially be accidentally overridden by route advertisements that use more specific address ranges.
>
> App Service Environments aren't supported with ExpressRoute configurations that cross-advertise routes from the public-peering path to the private-peering path. ExpressRoute configurations with public peering configured receive route advertisements from Microsoft. The advertisements contain a large set of Microsoft Azure IP address ranges. If the address ranges are cross-advertised on the private-peering path, all outbound network packets from the App Service Environment's subnet are force tunneled to a customer's on-premises network infrastructure. This network flow is currently not supported by default with App Service Environments. One solution to this problem is to stop cross-advertising routes from the public-peering path to the private-peering path. Another solution is to enable your App Service Environment to work in a forced tunnel configuration.

## Change the egress endpoint for your App Service Environment ##

This section describes how to enable an App Service Environment to operate in a forced tunnel configuration by changing the egress endpoint used by the App Service Environment. If the outbound traffic from the App Service Environment is force tunneled to an on-premises network, you need to allow that traffic to source from IP addresses other than the App Service Environment VIP address.

An App Service Environment not only has external dependencies, but it also must listen for inbound traffic to manage the App Service Environment. The App Service Environment must be able to respond to such traffic. The replies can't be sent back from another address because that breaks TCP. There are thus three steps required to change the egress endpoint for the App Service Environment.

1. Set a route table to ensure that inbound management traffic can go back out from the same IP address.

2. Add your IP addresses that are to be used for egress to the App Service Environment firewall.

3. Set the routes to outbound traffic from the App Service Environment to be tunneled.

   ![Forced tunnel network flow][1]

You can configure the App Service Environment with different egress addresses after the App Service Environment is already up and operational, or they can be set during App Service Environment deployment.

### Change the egress address after the App Service Environment is operational ###
1. Get the IP addresses you want to use as egress IPs for your App Service Environment. If you're doing forced tunneling, these addresses come from your NATs or gateway IPs. If you want to route the App Service Environment outbound traffic through an NVA, the egress address is the public IP of the NVA.

2. Set the egress addresses in your App Service Environment configuration information. Go to resource.azure.com, and go to Subscription/<subscription id>/resourceGroups/<ase resource group>/providers/Microsoft.Web/hostingEnvironments/<ase name>. Then you can see the JSON that describes your App Service Environment. Make sure it says "read/write" at the top. Select **Edit**. Scroll down to the bottom, and change **userWhitelistedIpRanges** from 

       "userWhitelistedIpRanges": null 
      
   to something like the following. Use the addresses you want to set as the egress address range. 

       "userWhitelistedIpRanges": ["11.22.33.44/32", "55.66.77.0/24"] 

   Select **PUT** at the top. This option triggers a scale operation on your App Service Environment and adjusts the firewall.
 
3. Create or edit a route table, and populate the rules to allow access to/from the management addresses that map to your App Service Environment location. To find the management addresses, see [App Service Environment management addresses][management].

4. Adjust the routes applied to the App Service Environment subnet with a route table or BGP routes. 

If the App Service Environment goes unresponsive from the portal, there is a problem with your changes. The problem might be that your list of egress addresses was incomplete, the traffic was lost, or the traffic was blocked. 

### Create a new App Service Environment with a different egress address ###

If your virtual network is already configured to force tunnel all the traffic, you need to take extra steps to create your App Service Environment so that it can come up successfully. You need to enable the use of another egress endpoint during the App Service Environment creation. To do this, you need to create the App Service Environment with a template that specifies the permitted egress addresses.

1. Get the IP addresses to be used as the egress addresses for your App Service Environment.

2. Pre-create the subnet to be used by the App Service Environment. You need it so that you can set routes, and also because the template requires it.

3. Create a route table with the management IPs that map to your App Service Environment location. Assign it to your App Service Environment.

4. Follow the directions in [Create an App Service Environment with a template][template]. Pull down the appropriate template.

5. Edit the azuredeploy.json file "resources" section. Include a line for **userWhitelistedIpRanges** with your values like:

       "userWhitelistedIpRanges":  ["11.22.33.44/32", "55.66.77.0/30"]

If this section is configured properly, the App Service Environment should start with no issues. 


<!--IMAGES-->
[1]: ./media/forced-tunnel-support/forced-tunnel-flow.png

<!--Links-->
[management]: ./management-addresses.md
[network]: ./network-info.md
[routes]: ../../virtual-network/virtual-networks-udr-overview.md
[template]: ./create-from-template.md

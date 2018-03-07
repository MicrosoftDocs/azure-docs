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
ms.topic: quickstart
ms.date: 3/6/2018
ms.author: ccompy
ms.custom: mvc
---

# Configure your App Service Environment with forced tunneling

The App Service Environment (ASE) is a deployment of Azure App Service in a customer's instance of Azure Virtual Network. Many customers configure their Azure virtual networks to be extensions of their on-premises networks with VPNs or Azure ExpressRoute connections. Due to corporate policies or other security constraints, they configure routes to send all virtual network outbound traffic to go on-premises before it can go out to the internet. Changing the routing of the virtual network so that the outbound traffic from the virtual network flows through the VPN or ExpressRoute connection to on-premises is called forced tunneling. 

Forced tunneling can cause problems for an ASE. The ASE has a number of external dependencies, which are enumerated in the [App Service Environment network architecture][network] document. The ASE, by default, requires that all outbound communication goes through the VIP that is provisioned with the ASE.

Routes are a critical aspect of what forced tunneling is and how to deal with it. In an Azure virtual network, routing is done based on the longest prefix match (LPM). If there is more than one route with the same LPM match, a route is selected based on its origin in the following order:

* User-defined route (UDR)
* BGP route (when ExpressRoute is used)
* System route

To learn more about routing in a virtual network, read [User-defined routes and IP forwarding][routes]. 

If you want your ASE to operate in a forced tunnel virtual network, you have the following choices:

* Enable your ASE to have direct internet access
* Configure your ASE subnet to use Service Endpoints to Azure SQL and Azure Storage
* Add your own IPs to the ASE Azure SQL firewall

## Enable your App Service Environment to have direct internet access

For your App Service Environment to work while your virtual network is configured with an ExpressRoute connection, you can:

* Configure ExpressRoute to advertise 0.0.0.0/0. By default, it force tunnels all outbound traffic on-premises.
* Create a UDR. Apply it to the subnet that contains the App Service Environment with an address prefix of 0.0.0.0/0 and a next hop type of Internet.

If you make these two changes, internet-destined traffic that originates from the App Service Environment subnet isn't forced down the ExpressRoute connection, and the App Service Environment works.

> [!IMPORTANT]
> The routes defined in a UDR must be specific enough to take precedence over any routes advertised by the ExpressRoute configuration. The preceding example uses the broad 0.0.0.0/0 address range. It can potentially be accidentally overridden by route advertisements that use more specific address ranges.
>
> App Service Environments aren't supported with ExpressRoute configurations that cross-advertise routes from the public-peering path to the private-peering path. ExpressRoute configurations with public peering configured receive route advertisements from Microsoft. The advertisements contain a large set of Microsoft Azure IP address ranges. If the address ranges are cross-advertised on the private-peering path, all outbound network packets from the App Service Environment's subnet are force tunneled to a customer's on-premises network infrastructure. This network flow is currently not supported by default with App Service Environments. One solution to this problem is to stop cross-advertising routes from the public-peering path to the private-peering path. Another solution is to enable your App Service Environment to work in a forced tunnel configuration.

![Direct internet access][1]

## Configure your ASE with Service Endpoints

To force tunnel all outbound traffic from your ASE, except that which goes to Azure SQL and Azure Storage, do the following:

1. Create or edit a route table. Populate the rules to send the management addresses that map to your App Service Environment location with a next hop of Internet. To find the management addresses, see [App Service Environment management addresses][management]. An App Service Environment inbound management traffic can't be force tunneled and sent back from another address because that breaks TCP. 

2. Enable Service Endpoints with Azure SQL and Azure Storage with your ASE subnet

Service Endpoints enable you to restrict access to some multi-tenant services such that the requests are only allowed from a customer selection of Azure virtual networks and subnets. You can read more about Service Endpoints in the [Virtual Network Service Endpoints][serviceendpoints] documentation. 

When you enable Service Endpoints on a resource, there are routes created with higher priority than BGP routes but less than UDRs. If you use Service Endpoints with a force tunneled ASE, the Azure SQL and Azure Storage management traffic is not force tunneled. The other ASE dependency traffic is force tunneled and can't be lost or the ASE would not function properly.

The implementation for Azure SQL is that when Service Endpoints is enabled on a subnet, all of the traffic that comes from that subnet to Azure SQL must have Service Endpoints enabled. You cannot enable it on one Azure SQL server and not on another if you want to access both from the same subnet. For this reason alone, enabling Service Endpoints may not be the solution to your forced tunnel needs.  This is not true with Azure Storage.  When you enable Service Endpoints with Azure Storage you lock access to that resource from your subnet but can still access other Azure Storage accounts.  

![Forced tunnel with service endpoints][2]

## Add your own IPs to the ASE Azure SQL firewall ##

To force tunnel all outbound traffic from your ASE, except that which goes to Azure Storage, do the following:

1. Create or edit a route table. Populate the rules to send the management addresses that map to your App Service Environment location with a next hop of Internet. To find the management addresses, see [App Service Environment management addresses][management]. An App Service Environment inbound management traffic can't be force tunneled and sent back from another address because that breaks TCP. 

2. Enable Service Endpoints with Azure Storage with your ASE subnet

3. Get the IP addresses that will be used for all outbound traffic from your App Service Environment to the internet. If you're doing forced tunneling, these addresses come from your NATs or gateway IPs. If you want to route the App Service Environment outbound traffic through an NVA, the egress address is the public IP of the NVA.

4. _To set the egress addresses in an existing App Service Environment:_ Go to resource.azure.com, and go to Subscription/<subscription id>/resourceGroups/<ase resource group>/providers/Microsoft.Web/hostingEnvironments/<ase name>. Then you can see the JSON that describes your App Service Environment. Make sure it says **read/write** at the top. Select **Edit**. Scroll down to the bottom. Change the **userWhitelistedIpRanges** value from **null** to something like the following. Use the addresses you want to set as the egress address range. 

        "userWhitelistedIpRanges": ["11.22.33.44/32", "55.66.77.0/24"] 

   Select **PUT** at the top. This option triggers a scale operation on your App Service Environment and adjusts the firewall.

_To create your ASE with the egress addresses_: Follow the directions in [Create an App Service Environment with a template][template] and pull down the appropriate template.  Edit the "resources" section in the azuredeploy.json file, but not in the "properties" block and include a line for **userWhitelistedIpRanges** with your values like this:

    "resources": [
      {
        "apiVersion": "2015-08-01",
        "type": "Microsoft.Web/hostingEnvironments",
        "name": "[parameters('aseName')]",
        "kind": "ASEV2",
        "location": "[parameters('aseLocation')]",
        "properties": {
          "name": "[parameters('aseName')]",
          "location": "[parameters('aseLocation')]",
          "ipSslAddressCount": 0,
          "internalLoadBalancingMode": "[parameters('internalLoadBalancingMode')]",
          "dnsSuffix" : "[parameters('dnsSuffix')]",
          "virtualNetwork": {
            "Id": "[parameters('existingVnetResourceId')]",
            "Subnet": "[parameters('subnetName')]"
          },
        "userWhitelistedIpRanges":  ["11.22.33.44/32", "55.66.77.0/30"]
        }
      }
    ]

These changes send traffic to Azure Storage directly from the ASE and allow access to the Azure SQL from additional addresses other than the VIP of the ASE.  

   ![Forced tunnel with SQL whitelist][3]

## Preventing issues ##

If communication between the ASE and its dependencies is broken, the ASE will go unhealthy.  If it remains unhealthy too long then the ASE will become suspended. To unsuspend the ASE, follow the instructions in your ASE portal.  

In addition to simply breaking communication, you can adversely affect your ASE by introducing too much latency. That can happen if your ASE is, for example, in West Europe and your on premises network you are forced tunneling to is in the western US.  


<!--IMAGES-->
[1]: ./media/forced-tunnel-support/asedependencies.png
[2]: ./media/forced-tunnel-support/forcedtunnelserviceendpoint.png
[3]: ./media/forced-tunnel-support/forcedtunnelexceptstorage.png

<!--Links-->
[management]: ./management-addresses.md
[network]: ./network-info.md
[routes]: ../../virtual-network/virtual-networks-udr-overview.md
[template]: ./create-from-template.md
[serviceendpoints]: ../../virtual-network/virtual-network-service-endpoints-overview.md

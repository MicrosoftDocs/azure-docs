<properties
   pageTitle="Routing requirements for ExpressRoute | Microsoft Azure"
   description="This page provides detailed requirements for configuring and managing routing for ExpressRoute circuits."
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="carolz"
   editor=""/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/22/2015"
   ms.author="cherylmc"/>


# ExpressRoute routing requirements  

To connect to Microsoft cloud services using ExpressRoute, you’ll need to setup and manage routing. Some connectivity providers offer setting up and managing routing as a managed service. Check with your connectivity provider to see if they offer such a service. If not, you must adhere to the requirements described below. 

Refer to the [circuit and routing domains](expressroute-circuit-peerings.md) article for a description of the routing sessions that need to be setup in order to facilitate connectivity.

**Note:** Microsoft does not support any router redundancy protocols (HSRP, VRRP to name a few) for high availability configurations. We rely on a redundant pair of BGP sessions per peering for high availability.

## IP addresses for peerings

You will need to reserve a few blocks of IP addresses to configure routing between your network and Microsoft's Enterprise edge (MSEEs) routers. This section provides a list of requirements and describes the rules regarding how these IP addresses must be acquired and used.

### IP addresses for Azure private peering

You can use either private IP addresses or public IP addresses to configure the peerings. The address range used for configuring routes must not overlap with address ranges used to create virtual networks in Azure. 

 - You must reserve a /29 subnet or two /30 subnets for routing interfaces.
 - The subnets used for routing can be either private IP addresses or public IP addresses.
 - The subnets must not conflict with the range reserved by the customer for use in the Microsoft cloud.
 - If a /29 subnet is used, it will be split into two /30 subnets. 
 - The first /30 subnet will be used for the primary link and the second /30 subnet will be used for the secondary link.
 - For each of the /30 subnets, you must the first IP address of the /30 subnet on your router. Microsoft will use the second IP address of the /30 subnet to setup a BGP session.
 - You must setup both BGP sessions for our [availability SLA](http://azure.microsoft.com/support/legal/sla/) to be valid.  

#### Example for private peering

If you choose to use a.b.c.d/29 to setup the peering, it will be split into two /30 subnets. In the example below, we will look at how the a.b.c.d/29 subnet is used. 

a.b.c.d/29 will be split to a.b.c.d/30 and a.b.c.d+4/30 and passed down to Microsoft through the provisioning APIs. You will use a.b.c.d+1 as the VRF IP for the Primary PE and Microsoft will consume a.b.c.d+2 as the VRF IP for the primary MSEE. You will use a.b.c.d+5 as the VRF IP for the secondary PE and Microsoft will use a.b.c.d+6 as the VRF IP for the secondary MSEE.

Consider the case where you selected 192.168.100.128/29 to setup private peering. 192.168.100.128/29 includes addresses from 192.168.100.128 to 192.168.100.133, among which:

- 192.168.100.128/30 will be assigned to link1, with provider using 192.168.100.129 and Microsoft using 192.168.100.130.
- 192.168.100.132/30 will be assigned to link2, with provider using 192.168.100.133 and Microsoft using 192.168.100.134.

### IP addresses for Azure public and Microsoft peering

You must use public IP addresses that you own for setting up the BGP sessions. Microsoft must be able to verify the ownership of the IP addresses through Routing Internet Registries and Internet Routing Registries. 

- You must use a unique /29 subnet or two /30 subnets to setup the BGP peering for each peering per ExpressRoute circuit (if you have more than one). 
- If a /29 subnet is used, it will be split into two /30 subnets. 
	- The first /30 subnet will be used for the primary link and the second /30 subnet will be used for the secondary link.
	- For each of the /30 subnets, you must the first IP address of the /30 subnet on your router. Microsoft will use the second IP address of the /30 subnet to setup a BGP session.
	- You must setup both BGP sessions for our [availability SLA](http://azure.microsoft.com/support/legal/sla/) to be valid.

Make sure that your IP address and AS number are registered to you in one of the registries listed below.

- [ARIN](https://www.arin.net/)
- [APNIC](https://www.apnic.net/)
- [AFRINIC](https://www.afrinic.net/)
- [LACNIC](http://www.lacnic.net/)
- [RIPE NCC](https://www.ripe.net/)
- [RADB](http://www.radb.net/)
- [ALTDB](http://altdb.net/)
- [LEVEL3](rr.Level3.net)


## Dynamic route exchange

Routing exchange will be over eBGP protocol. EBGP sessions are established between the MSEEs and your routers. Authentication of BGP sessions is not a requirement. If required, am MD5 hash can be configured. Look at the routing configuration workflow for information on configuring BGP sessions.

## Autonomous System numbers

Microsoft will use AS 12076 for Azure public, Azure private and Microsoft peering. We have reserved AS 65515 for internal use. Both 16 and 32 bit AS numbers are supported. You can use private AS numbers for Azure private peering. You must use public AS numbers registered to you for Azure public and Microsoft peering.

There are no requirements around data transfer symmetry. The forward and return paths may traverse different router pairs. Identical routes must be advertised from either sides across multiple circuit pairs belonging you. Route metrics are not required to be identical.

## Route aggregation and prefix limits

We support up to 4000 prefixes advertised to us through the Azure private peering. This can be increased up to 10,000 prefixes if the ExpressRoute premium add-on is enabled. We accept up to 200 prefixes per BGP session for Azure public and Microsoft peering. 

The BGP session will be dropped if the number of prefixes exceeds the limit. We will accept default routes on the private peering link only. Provider must filter out default route and private IP addresses (RFC 1918) from the Azure public and Microsoft peering paths. 

## Transit routing and cross-region routing

ExpressRoute cannot be configured as transit routers. You will have to rely on your connectivity provider for transit touring services.

## Advertising default routes

Default routes are permitted only on Azure private peering sessions. In such a case, we will route all traffic from the associated virtual networks to your network. Advertising default routes into private peering will result in the internet path from Azure being blocked. You must rely on your corporate edge to route traffic from and to the internet for services hosted in Azure. 

 To enable connectivity to other Azure services and infrastructure services, you must make sure one of the following items is in place:

 - Azure public peering is enabled to route traffic to public endpoints
 - You use user defined routing to allow internet connectivity for every subnet requiring Internet connectivity.

**Note:** Advertising default routes will break Windows and other VM license activation. Follow instructions [here](http://blogs.msdn.com/b/mast/archive/2015/05/20/use-azure-custom-routes-to-enable-kms-activation-with-forced-tunneling.aspx) to work around this.

## Support for BGP communities

This section provides an overview of how BGP communities will be used with ExpressRoute. Microsoft will advertise routes in the public and Microsoft peering paths with routes tagged with appropriate community values. The rationale for doing so and the details on community values are described below. Microsoft, however, will not honor any community values tagged to routes advertised to Microsoft.

If you are connecting to Microsoft through ExpressRoute at any one peering location within a geopolitical region, you will have access to all Microsoft cloud services across all regions within the geopolitical boundary. 

For example, if you connected to Microsoft in Amsterdam through ExpressRoute, you will have access to all Microsoft cloud services hosted in North Europe and West Europe. 

Refer to the [ExpressRoute partners and peering locations](expressroute-locations.md) page for a detailed list of geopolitical regions, associated Azure regions, and corresponding ExpressRoute peering locations.

You can purchase more than one ExpressRoute circuit per geopolitical region. Having multiple connections offers you significant benefits on high availability due to geo-redundancy. In cases where you have multiple ExpressRoute circuits, you will receive the same set of prefixes advertised from Microsoft on the public peering and Microsoft peering paths. This means you will have multiple paths from their network into Microsoft. This can potentially cause sub-optimal routing decisions to be made within your network. As a result,  you may experience sub-optimal connectivity experiences to different services. 

Microsoft will tag prefixes advertised through public peering and Microsoft peering with appropriate BGP community values indicating the region the prefixes are hosted in. You can rely on the community values to make appropriate routing decisions to offer optimal routing to customers.

| **Geopolitical Region** | **Microsoft Azure region (Same applies to Office 365)** | **BGP community value** |
|---|---|---|
| **US** |	East US | 12076:3004 |
|    | East US 2 | 12076:3005 |
|    | West US | 12076:3006 |
|    | Central US | 12076:3009 |
|    | North Central US | 12076:3007 |
|    | South Central US | 12076:3008 |
| **South America** | Brazil South | 12076:3014 |
| **Europe** | North Europe | 12076:3003 |
|    | West Europe | 12076:3002 |
| **Asia Pacific** | East Asia | 12076:3010 |
|    | Southeast Asia | 12076:3011 |
| **Japan** | Japan East | 12076:3012 |
|    | Japan West | 12076:3013 |
| **Australia** | Australia East | 12076:3015 |
|    | Australia Southeast | 12076:3016 |
| **India** | India South | 12076:3019 |
|    | India West | 12076:3018 |
|    | India Central | 12076:3017 |

All routes advertised from Microsoft will be tagged with the appropriate community value. 


In addition to the above, Microsoft will also tag prefixes based on the service they belong to. This applies only to the Microsoft peering. The table below provides a mapping of service to BGP community value.

| **Service** |	**BGP community value** |
|---|---|
| **Exchange** | 12076:5010 |
| **SharePoint** | 12076:5020 |
| **Skype For Business** | 12076:5030 |
| **CRM Online** | 12076:5040 |
| **Other Office 365 Services** | 12076:5100 |
| **Global prefixes / Anycast** | 12076:5200 |


### Manipulating routing preferences

Microsoft does not honor any BGP community values that you set. You are required to setup a pair of BGP sessions per peering to ensure that the requirements for the [availability SLA](http://azure.microsoft.com/support/legal/sla/) are met. You can can, however, configure your network to prefer one link over the other by relying on standard BGP route manipulation techniques. You can apply different BGP local preferences to each link to favor one path over the other from your network to Microsoft. You can prepend the as-path on route advertisements to influence traffic flow from Microsoft into your network.

## Next steps

- Configure your ExpressRoute connection.
	- [Create an ExpressRoute circuit](expressroute-howto-circuit-classic.md)
	- [Configure routing](expressroute-howto-routing-classic.md)
	- [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-classic.md)



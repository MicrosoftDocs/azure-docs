---
title: 'ExpressRoute Global Reach Application Scenario | Microsoft Docs'
description: This page provides an application scenario for Global Reach.
documentationcenter: na
services: networking
author: rambk
manager: tracsman

ms.service: expressroute,global reach
ms.topic: article
ms.workload: infrastructure-services
ms.date: 1/14/2019
ms.author: rambala

---

# ExpressRoute Global Reach Application Scenario

To learn about what ExpressRoute Global Reach is, see [ExpressRoute Global Reach][Global Reach]. In this article, let's walk through an application scenario and compare ExpressRoute Global Reach solution to few other solutions. Then let's configure Global Reach for the example scenario and verify the connections. 

##Application Scenario

Fabrikam Inc. has a large physical presence and Azure deployment in East US. Fabrikam has back-end connectivity between its on-premises and Azure deployments via ExpressRoute. Contoso Ltd. has a presence and Azure deployment in West US. Contoso has back-end connectivity between its on-premises and Azure deployments via ExpressRoute.  

Fabrikam Inc. acquires Contoso Ltd. Following the merger, Fabrikam wants to interconnect the networks. The following figure illustrates the scenario:

 [![1]][1]

The dashed arrows in the middle of the above figure indicate the required network inter-connections. The following table shows the route table of the primary private peering of the ExpressRoute of Contoso Ltd. prior to the merger.

[![2]][2]

The following table shows the route table of the primary private peering of the ExpressRoute of Fabrikam Inc. prior to the merger.

[![3]][3]

## Traditional Solutions

### Option 1: Interconnecting on-premises networks

The following figure illustrates the option. As shown, you can interconnect the two on-premises network using site-to-site VPN or other broadband connection options and manage all the routing between the two entities. 

[![4]][4]

This option has the following drawbacks:

- You are forcing inter-regional Azure communication for the deployment over suboptimal route.
- You are denying the benefit of the high availability of Microsoft backbone network for the inter-regional communication.
- You are taking the full routing responsibility for the inter-regional communication.

### Option 2: ExpressRoute cross connectivity and interconnecting on-premises networks

The following figure illustrates the option.

[![5]][5]

As shown in the above figure, you can additionally establish connectivity between the ExpressRoute circuits to the cross regional VNets. The cross regional connectivity between VNet to the ExpressRoute circuits would enable the following communications:

- US West/US East VNets to communicate respectively with Fabrikam/Contoso on-premises networks.
- US West VNet to communicate with US East VNet.

The interconnection between the two on-premises networks is still needed for the on-premises networks to communicate with each other.

This option allows inter-regional Azure communication for the private deployment ride over the Microsoft backbone and the communication between the on-premises network over the external network. However, the main drawback of the solution is that you need to establish multiple cross regional connectivities, which complicates maintenance and troubleshooting. Also, the option doesn't let you take advantage of high-available Microsoft global backbone for communicating between the two on-premises networks.

### Option 3: VNet-peering and interconnecting on-premises networks

The following figure illustrates the option. The option uses VNet-peering for the inter-regional VNet communication. The option, as illustrated, is in-complete as it doesn't address cross-regional VNet to on-premises communication (indicated via the two dotted-arrow lines in the middle). Use on-premises to on-premises connection (as in Option 1) or ExpressRoute cross connectivity (as in Option 2) for the cross-regional to on-premises communication.

[![6]][6]

The option provides optimal route for inter-region VNet communication. However, falls short if Fabrikam and/or Contoso has more complex Azure deployment such as hub-spoke model. Also, like previous two options, the option doesn't let you take advantage of high-available Microsoft global backbone for communicating between the two on-premises networks.

## Global Reach

ExpressRoute Global Reach links private peering of the ExpressRoute circuits, as illustrated in the following figure:

[![7]][7]

Configuring Global Reach between the two ExpressRoute circuits enables private communication in between the two on-premises networks and the Azure deployment in the two regions. Thus, the Global Reach satisfies all the desired communication (indicated via dashed line in the first figure of this article) over the Microsoft backbone network.

### Configuring Global Reach

To learn how to configure ExpressRoute Global Reach, see [Configure Global Reach][Configure Global Reach]. 

Because Fabrikam Inc. and Contoso Ltd. on boarded Azure as separate companies, the ExpressRoute circuits of the two companies are in two different Azure subscriptions. To create the Global Reach across the subscriptions, you need to create an authorization in the ExpressRoute circuit belonging to Contoso Ltd., and pass it to the Fabrikam Inc. ExpressRoute circuit.


To create an authorization for Contoso's ExpressRoute circuit, first login into Contoso's Azure account, and select the right subscription (if there are multiple subscriptions). The PowerShell commands for these steps are:

	Connect-AzureRmAccount
	Get-AzureRmSubscription
	Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"

The steps for creating an ExpressRoute circuit authorization are listed below:

	$ckt_2 = Get-AzureRmExpressRouteCircuit -Name "Your_circuit_2_name" -ResourceGroupName "Your_resource_group"
	Add-AzureRmExpressRouteCircuitAuthorization -ExpressRouteCircuit $ckt_2 -Name "Name_for_auth_key"
	Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt_2

The 'Set-AzureRmExpressRouteCircuit' will list the ExpressRouteCircuit. Note down the private peering ID and the authorization key that would be listed towards the end of the listing. See an example below:

[![8]][8]

With the peering ID and the authorization key, you can create the Global Reach under the Fabrikam's ExpressRoute circuit. Login to the Fabrikam's Azure account. If there is more than one subscription, select the right subscription.

Global Reach creates a redundant set of point-to-point connectivity across the two MSEE pair. For the two point-to-point connections, you need to specify a /29 address prefix (for the running example let's use 192.168.11.64/29). Use the following commands to create the Global Reach connection:

	$ckt_1 = Get-AzureRmExpressRouteCircuit -Name "Your_circuit_1_name" -ResourceGroupName "Your_resource_group"
	Add-AzureRmExpressRouteCircuitConnectionConfig -Name "Your_connection_name" -ExpressRouteCircuit $ckt_1 -PeerExpressRouteCircuitPeering "circuit_2_private_peering_id" -AddressPrefix "__.__.__.__/29" -AuthorizationKey "########-####-####-####-############"
	Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt_1

Once the above commands are successfully executed, it would take couple of minutes to create the redundant Global Reach connections.

### Verifying Global Reach

The following table shows the route table of the primary private peering of the ExpressRoute of Contoso Ltd. after configuring Global Reach.

[![9]][9]

The following table shows the route table of the primary private peering of the ExpressRoute of Fabrikam Inc. after configuring Global Reach.

[![10]][10]

In the above tables, we can see all the expected destination 'NETWORK' prefixes and the appropriate 'NEXT HOP' are listed.

The above screen clips show 'Get route table' blade that can be accessed in Azure web portal under 'Private peering' of an ExpressRoute circuit. You can also list an ExpressRoute route table using the following PowerShell Command:

	Get-AzExpressRouteCircuitRouteTable -DevicePath 'primary or secondary' -ExpressRouteCircuitName "Your_circuit_name" -PeeringType AzurePrivatePeering -ResourceGroupName "Your_resource_group"

Let's also verify the data plane connectivity by pinging different destination from different networks. The following three pings verify data plane connectivity to Contoso on-premises network, Contoso Azure VNet, and Fabrikam Azure VNet from Fabrikam on-premises network.


	C:\Users\PathLabUser>ping 10.1.11.10
	
	Pinging 10.1.11.10 with 32 bytes of data:
	Reply from 10.1.11.10: bytes=32 time=69ms TTL=122
	Reply from 10.1.11.10: bytes=32 time=69ms TTL=122
	Reply from 10.1.11.10: bytes=32 time=69ms TTL=122
	Reply from 10.1.11.10: bytes=32 time=69ms TTL=122
	
	Ping statistics for 10.1.11.10:
	    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
	Approximate round trip times in milli-seconds:
	    Minimum = 69ms, Maximum = 69ms, Average = 69ms
	
	C:\Users\PathLabUser>ping 10.17.11.4
	
	Pinging 10.17.11.4 with 32 bytes of data:
	Reply from 10.17.11.4: bytes=32 time=82ms TTL=124
	Reply from 10.17.11.4: bytes=32 time=81ms TTL=124
	Reply from 10.17.11.4: bytes=32 time=76ms TTL=124
	Reply from 10.17.11.4: bytes=32 time=76ms TTL=124
	
	Ping statistics for 10.17.11.4:
	    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
	Approximate round trip times in milli-seconds:
	    Minimum = 76ms, Maximum = 82ms, Average = 78ms
	
	C:\Users\PathLabUser>ping 10.10.11.4
	
	Pinging 10.10.11.4 with 32 bytes of data:
	Reply from 10.10.11.4: bytes=32 time=3ms TTL=125
	Reply from 10.10.11.4: bytes=32 time=3ms TTL=125
	Reply from 10.10.11.4: bytes=32 time=2ms TTL=125
	Reply from 10.10.11.4: bytes=32 time=3ms TTL=125
	
	Ping statistics for 10.10.11.4:
	    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
	Approximate round trip times in milli-seconds:
	    Minimum = 2ms, Maximum = 3ms, Average = 2ms


The following two pings verify data plane connectivity to Contoso Azure VNet, and Fabrikam Azure VNet from Contoso on-premises network.

	C:\Users\PathLabUser>ping 10.17.11.4
	
	Pinging 10.17.11.4 with 32 bytes of data:
	Reply from 10.17.11.4: bytes=32 time=6ms TTL=125
	Reply from 10.17.11.4: bytes=32 time=5ms TTL=125
	Reply from 10.17.11.4: bytes=32 time=5ms TTL=125
	Reply from 10.17.11.4: bytes=32 time=5ms TTL=125
	
	Ping statistics for 10.17.11.4:
	    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
	Approximate round trip times in milli-seconds:
	    Minimum = 5ms, Maximum = 6ms, Average = 5ms
	
	C:\Users\PathLabUser>ping 10.10.11.4
	
	Pinging 10.10.11.4 with 32 bytes of data:
	Reply from 10.10.11.4: bytes=32 time=73ms TTL=124
	Reply from 10.10.11.4: bytes=32 time=73ms TTL=124
	Reply from 10.10.11.4: bytes=32 time=74ms TTL=124
	Reply from 10.10.11.4: bytes=32 time=73ms TTL=124
	
	Ping statistics for 10.10.11.4:
	    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
	Approximate round trip times in milli-seconds:
	    Minimum = 73ms, Maximum = 74ms, Average = 73ms

The following ping verifies data plane connectivity to Contoso Azure VNet from Fabrikam Azure VNet.

	C:\Users\PathLabUser>ping 10.17.11.4
	
	Pinging 10.17.11.4 with 32 bytes of data:
	Reply from 10.17.11.4: bytes=32 time=77ms TTL=125
	Reply from 10.17.11.4: bytes=32 time=77ms TTL=125
	Reply from 10.17.11.4: bytes=32 time=76ms TTL=125
	Reply from 10.17.11.4: bytes=32 time=78ms TTL=125
	
	Ping statistics for 10.17.11.4:
	    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
	Approximate round trip times in milli-seconds:
	    Minimum = 76ms, Maximum = 78ms, Average = 77ms

## Next Steps

Global Reach is rolled out on a country by country basis. To see if Global Reach is available in the countries that you want, see [ExpressRoute Global Reach][Global Reach].

<!--Image References-->
[1]: ./media/expressroute-globalreach-applicationscenario/PreMergerScenario.png "The Application scenario"
[2]: ./media/expressroute-globalreach-applicationscenario/ContosoExR-RT-Premerger.png "Contoso ExpressRoute Route table prior to merger"
[3]: ./media/expressroute-globalreach-applicationscenario/FabrikamExR-RT-Premerger.png "Fabrikam ExpressRoute Route table prior to merger"
[4]: ./media/expressroute-globalreach-applicationscenario/S2SVPN-Solution.png "Interconnecting on-premises networks"
[5]: ./media/expressroute-globalreach-applicationscenario/ExR-XConnect-Solution.png "ExpressRoute Cross Connect"
[6]: ./media/expressroute-globalreach-applicationscenario/VNet-peering-Solution.png "VNet-peering"
[7]: ./media/expressroute-globalreach-applicationscenario/GlobalReach-Solution.png "Global Reach"
[8]: ./media/expressroute-globalreach-applicationscenario/ER-Ckt-details.png "Contoso ExpressRoute circuit"
[9]: ./media/expressroute-globalreach-applicationscenario/ContosoExR-RT-Postmerger.png "Contoso ExpressRoute Route table with Global Reach"
[10]: ./media/expressroute-globalreach-applicationscenario/FabrikamExR-RT-Postmerger.png "Fabrikam ExpressRoute Route table with Global Reach"

<!--Link References-->
[Global Reach]: https://docs.microsoft.com/azure/expressroute/expressroute-global-reach
[Configure Global Reach]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-set-global-reach






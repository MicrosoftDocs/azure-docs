---
title: 'Verify Azure ExpressRoute connectivity - troubleshooting guide'
description: This article provides instructions on troubleshooting and validating end-to-end connectivity of an ExpressRoute circuit.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: troubleshooting
ms.date: 06/15/2023
ms.author: duau
ms.custom: seodec18, devx-track-azurepowershell
---

# Verify ExpressRoute connectivity

This article helps you verify and troubleshoot Azure ExpressRoute connectivity. ExpressRoute extends an on-premises network into the Microsoft Cloud over a private connection commonly facilitated by a connectivity provider. ExpressRoute connectivity traditionally involves three distinct network zones:

- Customer network
- Provider network
- Microsoft datacenter

> [!NOTE]
> In the ExpressRoute Direct connectivity model, you can directly connect to the port for Microsoft Enterprise Edge (MSEE) routers. The direct connectivity model includes only yours and Microsoft network zones.

This article helps you identify if and where a connectivity issue exists. You can then seek support from the appropriate team to resolve the issue.

> [!IMPORTANT]
> This article is intended to help you diagnose and fix simple issues. It's not intended to be a replacement for Microsoft support. If you can't solve a problem by using the guidance in this article, open a support ticket with [Microsoft Support][Support].

## Overview

The following diagram shows the logical connectivity of a customer network to the Microsoft network through ExpressRoute.
[![1]][1]

In the preceding diagram, the numbers indicate key network points:

1. Customer compute device (for example, a server or PC).
2. Customer edge routers (CEs).
3. Provider edge routers/switches (PEs) that face customer edge routers.
4. PEs that face Microsoft Enterprise Edge ExpressRoute routers (MSEEs). This article calls them *PE-MSEEs*.
5. MSEEs.
6. Virtual network gateway.
7. Compute device on the Azure virtual network.

At times, this article references these network points by their associated number.

Depending on the ExpressRoute connectivity model, network points 3 and 4 might be switches (layer 2 devices) or routers (layer 3 devices). The ExpressRoute connectivity models are cloud exchange colocation, point-to-point Ethernet connection, or any-to-any (IPVPN).

In the direct connectivity model, there are no network points 3 and 4. Instead, CEs (2) are directly connected to MSEEs via dark fiber.

If the cloud exchange colocation, point-to-point Ethernet, or direct connectivity model is used, CEs (2) establish Border Gateway Protocol (BGP) peering with MSEEs (5).

If the any-to-any (IPVPN) connectivity model is used, PE-MSEEs (4) establish BGP peering with MSEEs (5). PE-MSEEs propagate the routes received from Microsoft back to the customer network via the IPVPN service provider network.

> [!NOTE]
> For high availability, Microsoft establishes a fully redundant parallel connectivity between MSEE and PE-MSEE pairs. A fully redundant parallel network path is also encouraged between the customer network and PE/CE pairs. For more information about high availability, see the article [Designing for high availability with ExpressRoute][HA].

The following sections represent the logical steps in troubleshooting an ExpressRoute circuit.

## Verify circuit provisioning and state

Provisioning an ExpressRoute circuit establishes a redundant layer 2 connection between CEs/PE-MSEEs (2/4) and MSEEs (5). For more information on how to create, modify, provision, and verify an ExpressRoute circuit, see the article [Create and modify an ExpressRoute circuit][CreateCircuit].

>[!TIP]
>A service key uniquely identifies an ExpressRoute circuit. If you need assistance from Microsoft or from an ExpressRoute partner to troubleshoot an ExpressRoute issue, provide the service key to readily identify the circuit.

### Verification via the Azure portal

In the Azure portal, open the page for the ExpressRoute circuit. The ![3][3] section of the page lists the ExpressRoute essentials, as shown in the following screenshot:

![4][4]

In the ExpressRoute essentials, **Circuit status** indicates the status of the circuit on the Microsoft side. **Provider status** indicates if the circuit has been provisioned or not provisioned on the service-provider side.

For an ExpressRoute circuit to be operational, **Circuit status** must be **Enabled**, and **Provider status** must be **Provisioned**.

> [!NOTE]
> After you configure an ExpressRoute circuit, if **Circuit status** is stuck in a **Not enabled** status, contact [Microsoft Support][Support]. If **Provider status** is stuck in a **Not provisioned** status, contact your service provider.

### Verification via PowerShell

To list all the ExpressRoute circuits in a resource group, use the following command:

```azurepowershell
Get-AzExpressRouteCircuit -ResourceGroupName "Test-ER-RG"
```

> [!TIP]
> If you're looking for the name of a resource group, you can get it by using the `Get-AzResourceGroup` command to list all the resource groups in your subscription.

To select a particular ExpressRoute circuit in a resource group, use the following command:

```azurepowershell
Get-AzExpressRouteCircuit -ResourceGroupName "Test-ER-RG" -Name "Test-ER-Ckt"
```

Here's an example response:

```output
Name                             : Test-ER-Ckt
ResourceGroupName                : Test-ER-RG
Location                         : westus2
Id                               : /subscriptions/***************************/resourceGroups/Test-ER-RG/providers/***********/expressRouteCircuits/Test-ER-Ckt
Etag                             : W/"################################"
ProvisioningState                : Succeeded
Sku                              : {
                                    "Name": "Standard_UnlimitedData",
                                    "Tier": "Standard",
                                    "Family": "UnlimitedData"
                                   }
CircuitProvisioningState         : Enabled
ServiceProviderProvisioningState : Provisioned
ServiceProviderNotes             :
ServiceProviderProperties        : {
                                    "ServiceProviderName": "****",
                                    "PeeringLocation": "******",
                                    "BandwidthInMbps": 100
                                   }
ServiceKey                       : **************************************
Peerings                         : []
Authorizations                   : []
```

To confirm that an ExpressRoute circuit is operational, pay particular attention to the following fields:

```output
CircuitProvisioningState         : Enabled
ServiceProviderProvisioningState : Provisioned
```

> [!NOTE]
> After you configure an ExpressRoute circuit, if the **Circuit status** is stuck in a **Not enabled** status, contact [Microsoft Support][Support]. If the **Provider status** is stuck in a **Not provisioned** status, contact your service provider.

## Validate peering configuration

After the service provider has completed provisioning the ExpressRoute circuit, multiple routing configurations based on external BGP (eBGP) can be created over the ExpressRoute circuit between CEs/MSEE-PEs (2/4) and MSEEs (5). Each ExpressRoute circuit can have one or both of the following peering configurations:

- Azure private peering: traffic to private virtual networks in Azure
- Microsoft peering: traffic to public endpoints of platform as a service (PaaS) and software as a service (SaaS)

For more information on how to create and modify routing configuration, see the article [Create and modify routing for an ExpressRoute circuit][CreatePeering].

### Verification via the Azure portal

> [!NOTE]
> In an IPVPN connectivity model, service providers handle the responsibility of configuring the peerings (layer 3 services). In such a model, after the service provider has configured a peering and if the peering is blank in the portal, try refreshing the circuit configuration by using the refresh button on the portal. This operation will pull the current routing configuration from your circuit.

In the Azure portal, you can check the status of an ExpressRoute circuit on the page for that circuit. The ![3][3] section of the page lists the ExpressRoute peerings, as shown in the following screenshot:

![5][5]

In the preceding example, Azure private peering is provisioned, but Azure public and Microsoft peerings aren't provisioned. A successfully provisioned peering context would also have the primary and secondary point-to-point subnets listed. The /30 subnets are used for the interface IP address of the MSEEs and CEs/PE-MSEEs. For the peerings that are provisioned, the listing also indicates who last modified the configuration.

> [!NOTE]
> If enabling a peering fails, check if the assigned primary and secondary subnets match the configuration on the linked CE/PE-MSEE. Also check if the correct `VlanId`, `AzureASN`, and `PeerASN` values are used on MSEEs, and if these values map to the ones used on the linked CE/PE-MSEE.
>
> If MD5 hashing is chosen, the shared key should be the same on MSEE and CE/PE-MSEE pairs. Previously configured shared keys would not be displayed for security reasons.
>
> If you need to change any of these configurations on an MSEE router, see [Create and modify routing for an ExpressRoute circuit][CreatePeering].

> [!NOTE]
> On a /30 subnet assigned for interface, Microsoft will choose the second usable IP address of the subnet for the MSEE interface. So, ensure that the first usable IP address of the subnet has been assigned on the peered CE/PE-MSEE.

### Verification via PowerShell

To get the configuration details for Azure private peering, use the following commands:

```azurepowershell
$ckt = Get-AzExpressRouteCircuit -ResourceGroupName "Test-ER-RG" -Name "Test-ER-Ckt"
Get-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt
```

Here's an example response for a successfully configured private peering:

```output
Name                       : AzurePrivatePeering
Id                         : /subscriptions/***************************/resourceGroups/Test-ER-RG/providers/***********/expressRouteCircuits/Test-ER-Ckt/peerings/AzurePrivatePeering
Etag                       : W/"################################"
PeeringType                : AzurePrivatePeering
AzureASN                   : 12076
PeerASN                    : 123##
PrimaryPeerAddressPrefix   : 172.16.0.0/30
SecondaryPeerAddressPrefix : 172.16.0.4/30
PrimaryAzurePort           :
SecondaryAzurePort         :
SharedKey                  :
VlanId                     : 200
MicrosoftPeeringConfig     : null
ProvisioningState          : Succeeded
```

A successfully enabled peering context would have the primary and secondary address prefixes listed. The /30 subnets are used for the interface IP address of the MSEEs and CEs/PE-MSEEs.

To get the configuration details for Azure public peering, use the following commands:

```azurepowershell
$ckt = Get-AzExpressRouteCircuit -ResourceGroupName "Test-ER-RG" -Name "Test-ER-Ckt"
Get-AzExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering" -ExpressRouteCircuit $ckt
```

To get the configuration details for Microsoft peering, use the following commands:

```azurepowershell
$ckt = Get-AzExpressRouteCircuit -ResourceGroupName "Test-ER-RG" -Name "Test-ER-Ckt"
Get-AzExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt
```

If a peering isn't configured, you get an error message. Here's an example response when the stated peering (Azure public peering in this case) isn't configured within the circuit:

```azurepowershell
Get-AzExpressRouteCircuitPeeringConfig : Sequence contains no matching element
At line:1 char:1
    + Get-AzExpressRouteCircuitPeeringConfig -Name "AzurePublicPeering ...
    + ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        + CategoryInfo          : CloseError: (:) [Get-AzExpr...itPeeringConfig], InvalidOperationException
        + FullyQualifiedErrorId : Microsoft.Azure.Commands.Network.GetAzureExpressRouteCircuitPeeringConfigCommand
```

> [!NOTE]
> If enabling a peering fails, check if the assigned primary and secondary subnets match the configuration on the linked CE/PE-MSEE. Also check if the correct `VlanId`, `AzureASN`, and `PeerASN` values are used on MSEEs, and if these values map to the ones used on the linked CE/PE-MSEE.
>
> If MD5 hashing is chosen, the shared key should be the same on MSEE and CE/PE-MSEE pairs. Previously configured shared keys would not be displayed for security reasons.
>
> If you need to change any of these configurations on an MSEE router, see [Create and modify routing for an ExpressRoute circuit][CreatePeering].

> [!NOTE]
> On a /30 subnet assigned for interface, Microsoft will pick the second usable IP address of the subnet for the MSEE interface. So, ensure that the first usable IP address of the subnet has been assigned on the peered CE/PE-MSEE.

## Validate ARP

The Address Resolution Protocol (ARP) table provides a mapping of the IP address and MAC address for a particular peering. The ARP table for an ExpressRoute circuit peering provides the following information for each interface (primary and secondary):

* Mapping of the IP address for the on-premises router interface to the MAC address
* Mapping of the IP address for the ExpressRoute router interface to the MAC address
* Age of the mapping

ARP tables can help validate layer 2 configuration and troubleshoot basic layer 2 connectivity issues.

To learn how to view the ARP table of an ExpressRoute peering and how to use the information to troubleshoot layer 2 connectivity issues, see [Getting ARP tables in the Resource Manager deployment model][ARP].

## Validate BGP and routes on the MSEE

To get the routing table from MSEE on the primary path for the private routing context, use the following command:

```azurepowershell
Get-AzExpressRouteCircuitRouteTable -DevicePath Primary -ExpressRouteCircuitName ******* -PeeringType AzurePrivatePeering -ResourceGroupName ****
```

Here's an example response:

```output
Network : 10.1.0.0/16
NextHop : 10.17.17.141
LocPrf  :
Weight  : 0
Path    : 65515

Network : 10.1.0.0/16
NextHop : 10.17.17.140*
LocPrf  :
Weight  : 0
Path    : 65515

Network : 10.2.20.0/25
NextHop : 172.16.0.1
LocPrf  :
Weight  : 0
Path    : 123##
```

> [!NOTE]
> If the state of a eBGP peering between an MSEE and a CE/PE-MSEE is **Active** or **Idle**, check if the assigned primary and secondary peer subnets match the configuration on the linked CE/PE-MSEE. Also check if the correct `VlanId`, `AzureASN`, and `PeerASN` values are used on MSEEs, and if these values map to the ones used on the linked CE/PE-MSEE. If MD5 hashing is chosen, the shared key should be the same on MSEE and CE/PE-MSEE pairs. If you need to change any of these configurations on an MSEE router, see [Create and modify routing for an ExpressRoute circuit][CreatePeering].

> [!NOTE]
> If certain destinations are not reachable over a peering, check the route table of the MSEEs for the corresponding peering context. If a matching prefix (could be NATed IP) is present in the routing table, then check if any firewalls, network security groups, or access control lists (ACLs) on the path are blocking the traffic.

The following example shows the response of the command for a peering that doesn't exist:

```azurepowershell
Get-AzExpressRouteCircuitRouteTable : The BGP Peering AzurePublicPeering with Service Key ********************* is not found.
StatusCode: 400
```

## Confirm the traffic flow

To get the combined primary and secondary path traffic statistics (bytes in and out) of a peering context, use the following command:

```azurepowershell
Get-AzExpressRouteCircuitStats -ResourceGroupName $RG -ExpressRouteCircuitName $CircuitName -PeeringType 'AzurePrivatePeering'
```

Here's an example output of the command:

```output
PrimaryBytesIn PrimaryBytesOut SecondaryBytesIn SecondaryBytesOut
-------------- --------------- ---------------- -----------------
     240780020       239863857        240565035         239628474
```

Here's an example output of the command for a nonexistent peering:

```azurepowershell
Get-AzExpressRouteCircuitRouteTable : The BGP Peering AzurePublicPeering with Service Key ********************* is not found.
StatusCode: 400
```

## Test private peering connectivity

Test your private peering connectivity by counting packets arriving at and leaving the Microsoft edge of your ExpressRoute circuit on the MSEE devices. This diagnostic tool works by applying an ACL to the MSEE to count the number of packets that hit specific ACL rules. Using this tool allows you to confirm connectivity by answering questions such as:

* Are my packets getting to Azure?
* Are they getting back to on-premises?

### Run a test

1. To access the diagnostic tool, select **Diagnose and solve problems** from your ExpressRoute circuit in the Azure portal.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/diagnose-problems.png" alt-text="Screenshot of the button for diagnosing and solving problems from the ExpressRoute circuit.":::

1. Select the **Connectivity issues** card under **Common problems**.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/connectivity-issues.png" alt-text="Screenshot of the option for connectivity issues.":::

1. In the **Tell us more about the problem you are experiencing** dropdown list, select **Connectivity to Azure Private, Azure Public or Dynamics 365 Services**.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/tell-us-more.png" alt-text="Screenshot of the dropdown option for the problem that the user is experiencing.":::

1. Scroll down to the **Test your private peering connectivity** section and expand it.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/test-private-peering.png" alt-text="Screenshot of the options for troubleshooting connectivity issues, with the option for private peering highlighted.":::

1. Run the [PsPing](/sysinternals/downloads/psping) test from your on-premises IP address to your Azure IP address, and keep it running during the connectivity test.

1. Fill out the fields of the form. Be sure to enter the same on-premises and Azure IP addresses that you used in step 5. Then select **Submit** and wait for your results to load.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/form.png" alt-text="Screenshot of the form for debugging an A C L.":::

### Interpret results

When your results are ready, you have two sets of them for the primary and secondary MSEE devices. Review the number of matches in and out, and use the following scenarios to interpret the results:

* **You see packet matches sent and received on both MSEEs**: This result indicates healthy traffic inbound to and outbound from the MSEEs on your circuit. If loss is occurring either on-premises or in Azure, it's happening downstream from the MSEEs.
* **If you're testing PsPing from on-premises to Azure, received results show matches, but sent results show no matches**: This result indicates that traffic is coming in to Azure but isn't returning to on-premises. Check for return-path routing issues. For example, are you advertising the appropriate prefixes to Azure? Is a user-defined route (UDR) overriding prefixes?
* **If you're testing PsPing from Azure to on-premises, sent results show matches, but received results show no matches**: This result indicates that traffic is coming in to on-premises but isn't returning to Azure. Work with your provider to find out why traffic isn't being routed to Azure via your ExpressRoute circuit.
* **One MSEE shows no matches, but the other shows good matches**: This result indicates that one MSEE isn't receiving or passing any traffic. It might be offline (for example, BGP/ARP is down).

Your test results for each MSEE device look like the following example:

```
src 10.0.0.0 dst 20.0.0.0 dstport 3389 (received): 120 matches
src 20.0.0.0 srcport 3389 dst 10.0.0.0 (sent): 120 matches
```

This test result has the following properties:

* IP port: 3389
* On-premises IP address CIDR: 10.0.0.0
* Azure IP address CIDR: 20.0.0.0

## Verify availability of the virtual network gateway

The ExpressRoute virtual network gateway facilitates the management and control plane connectivity to private link services and private IPs deployed to an Azure virtual network. Microsoft manages the virtual network gateway infrastructure and sometimes undergoes maintenance.

During a maintenance period, performance of the virtual network gateway may reduce. To troubleshoot connectivity issues to the virtual network and see if a recent maintenance event caused reduce capacity, follow these steps:

1. Select **Diagnose and solve problems** from your ExpressRoute circuit in the Azure portal.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/diagnose-problems.png" alt-text="Screenshot of the button for diagnosing and solving problem from an ExpressRoute circuit.":::

1. Select the **Performance Issues** option.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/performance-issues.png" alt-text="Screenshot of selecting the option for performance issues.":::

1. Wait for the diagnostics to run and interpret the results.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/gateway-result.png" alt-text="Screenshot of the diagnostic results.":::

    If maintenance was done on your virtual network gateway during a period when you experienced packet loss or latency. It's possible that the reduced capacity of the gateway contributed to connectivity issues you're experiencing for the targeted virtual network. Follow the recommended steps. To support a higher network throughput and avoid connectivity issues during future maintenance events, consider upgrading the [virtual network gateway SKU](expressroute-about-virtual-network-gateways.md#gwsku).

## Next steps

For more information or help, check out the following links:

- [Microsoft Support][Support]
- [Create and modify an ExpressRoute circuit][CreateCircuit]
- [Create and modify routing for an ExpressRoute circuit][CreatePeering]

<!--Image References-->
[1]: ./media/expressroute-troubleshooting-expressroute-overview/expressroute-logical-diagram.png "Diagram that shows logical ExpressRoute connectivity and connections between a customer network, a provider network, and a Microsoft datacenter."
[3]: ./media/expressroute-troubleshooting-expressroute-overview/portal-overview.png "Overview icon"
[4]: ./media/expressroute-troubleshooting-expressroute-overview/portal-circuit-status.png "Screenshot that shows an example of ExpressRoute essentials listed in the Azure portal."
[5]: ./media/expressroute-troubleshooting-expressroute-overview/portal-private-peering.png "Screenshot that shows an example ExpressRoute peering listed in the Azure portal."

<!--Link References-->
[Support]: https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade
[CreateCircuit]: ./expressroute-howto-circuit-portal-resource-manager.md
[CreatePeering]: ./expressroute-howto-routing-portal-resource-manager.md
[ARP]: ./expressroute-troubleshooting-arp-resource-manager.md
[HA]: ./designing-for-high-availability-with-expressroute.md

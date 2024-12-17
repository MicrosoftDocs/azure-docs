---
title: 'Verify Azure ExpressRoute connectivity - troubleshooting guide'
description: This article provides instructions on troubleshooting and validating end-to-end connectivity of an ExpressRoute circuit.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: troubleshooting
ms.date: 11/18/2024
ms.author: duau
ms.custom: devx-track-azurepowershell
---

# Verify ExpressRoute connectivity
This article helps you verify and troubleshoot Azure ExpressRoute connectivity. ExpressRoute extends an on-premises network into the Microsoft Cloud over a private connection facilitated by a connectivity provider. ExpressRoute connectivity involves three distinct network zones:

- Customer network
- Provider network
- Microsoft datacenter

> [!NOTE]
> In the ExpressRoute Direct connectivity model, you can directly connect to the port for Microsoft Enterprise Edge (MSEE) routers. This model includes only your network and the Microsoft network zones.

This article helps you identify connectivity issues and seek support from the appropriate team to resolve them.

> [!IMPORTANT]
> This article is intended to help you diagnose and fix simple issues. It's not a replacement for Microsoft support. If you can't solve a problem using this guidance, open a support ticket with [Microsoft Support][Support].

## Overview

The following diagram shows the logical connectivity of a customer network to the Microsoft network through ExpressRoute.
[![1]][1]

In the diagram, the numbers indicate key network points:

1. Customer compute device (for example, a server or PC).
2. Customer edge routers (CEs).
3. Provider edge routers/switches (PEs) facing customer edge routers.
4. PEs facing Microsoft Enterprise Edge ExpressRoute routers (MSEEs), called *PE-MSEEs*.
5. MSEEs.
6. Virtual network gateway.
7. Compute device on the Azure virtual network.

These network points are referenced by their associated number throughout the article.

Depending on the ExpressRoute connectivity model, network points 3 and 4 might be switches (layer 2 devices) or routers (layer 3 devices). The connectivity models are cloud exchange colocation, point-to-point Ethernet connection, or any-to-any (IPVPN).

In the direct connectivity model, there are no network points 3 and 4. Instead, CEs (2) are directly connected to MSEEs via dark fiber.

If the cloud exchange colocation, point-to-point Ethernet, or direct connectivity model is used, CEs (2) establish Border Gateway Protocol (BGP) peering with MSEEs (5).

If the any-to-any (IPVPN) connectivity model is used, PE-MSEEs (4) establish BGP peering with MSEEs (5). PE-MSEEs propagate the routes received from Microsoft back to the customer network via the IPVPN service provider network.

> [!NOTE]
> For high availability, Microsoft establishes fully redundant parallel connectivity between MSEE and PE-MSEE pairs. A fully redundant parallel network path is also encouraged between the customer network and PE/CE pairs. For more information about high availability, see [Designing for high availability with ExpressRoute][HA].

The following sections represent the logical steps in troubleshooting an ExpressRoute circuit.

## Verify circuit provisioning and state

Provisioning an ExpressRoute circuit establishes a redundant layer 2 connection between CEs/PE-MSEEs (2/4) and MSEEs (5). For more information on how to create, modify, provision, and verify an ExpressRoute circuit, see [Create and modify an ExpressRoute circuit][CreateCircuit].

> [!TIP]
> A service key uniquely identifies an ExpressRoute circuit. If you need assistance from Microsoft or an ExpressRoute partner to troubleshoot an issue, provide the service key to readily identify the circuit.

### Verification via the Azure portal

In the Azure portal, navigate to the page for your ExpressRoute circuit. The ![3][3] section of the page lists the ExpressRoute essentials, as shown in the following screenshot:

![4][4]

In the ExpressRoute essentials, **Circuit status** indicates the status of the circuit on the Microsoft side, and **Provider status** indicates whether the circuit has been provisioned by the service provider.

For an ExpressRoute circuit to be operational, **Circuit status** must be **Enabled**, and **Provider status** must be **Provisioned**.

> [!NOTE]
> If **Circuit status** is stuck in **Not enabled**, contact [Microsoft Support][Support]. If **Provider status** is stuck in **Not provisioned**, contact your service provider.

### Verification via PowerShell

To list all ExpressRoute circuits in a resource group, use the following command:

```azurepowershell
Get-AzExpressRouteCircuit -ResourceGroupName "Test-ER-RG"
```

> [!TIP]
> To find the name of a resource group, use the `Get-AzResourceGroup` command to list all resource groups in your subscription.

To get details of a specific ExpressRoute circuit in a resource group, use the following command:

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

To confirm that an ExpressRoute circuit is operational, ensure the following fields are set correctly:

```output
CircuitProvisioningState         : Enabled
ServiceProviderProvisioningState : Provisioned
```

> [!NOTE]
> If **Circuit status** is stuck in **Not enabled**, contact [Microsoft Support][Support]. If **Provider status** is stuck in **Not provisioned**, contact your service provider.

## Validate peering configuration

After the service provider has provisioned the ExpressRoute circuit, you can create multiple routing configurations using external BGP (eBGP) over the circuit between CEs/MSEE-PEs (2/4) and MSEEs (5). Each ExpressRoute circuit can have one or both of the following peering configurations:

- Azure private peering: for traffic to private virtual networks in Azure
- Microsoft peering: for traffic to public endpoints of platform as a service (PaaS) and software as a service (SaaS)

For more information on creating and modifying routing configurations, see [Create and modify routing for an ExpressRoute circuit][CreatePeering].

### Verification via the Azure portal

> [!NOTE]
> In an IPVPN connectivity model, service providers handle the responsibility of configuring the peerings (layer 3 services). If the peering is blank in the portal after the service provider has configured it, try refreshing the circuit configuration using the refresh button on the portal. This operation will pull the current routing configuration from your circuit.

In the Azure portal, you can check the status of an ExpressRoute circuit on its page. The ![3][3] section lists the ExpressRoute peerings, as shown in the following screenshot:

![5][5]

In the previous example, Azure private peering is provisioned, but Azure public and Microsoft peerings aren't. A successfully provisioned peering context will also list the primary and secondary point-to-point subnets. The /30 subnets are used for the interface IP addresses of the MSEEs and CEs/PE-MSEEs. The listing also indicates who last modified the configuration.

> [!NOTE]
> If enabling a peering fails, check if the assigned primary and secondary subnets match the configuration on the linked CE/PE-MSEE. Also, verify that the `VlanId`, `AzureASN`, and `PeerASN` values on the MSEEs match those on the linked CE/PE-MSEE.
>
> If MD5 hashing is chosen, ensure the shared key is the same on both MSEE and CE/PE-MSEE pairs. Previously configured shared keys won't be displayed for security reasons.
>
> If you need to change any of these configurations on an MSEE router, see [Create and modify routing for an ExpressRoute circuit][CreatePeering].

> [!NOTE]
> On a /30 subnet assigned for the interface, Microsoft will use the second usable IP address for the MSEE interface. Ensure the first usable IP address is assigned to the peered CE/PE-MSEE.

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

A successfully enabled peering context lists the primary and secondary address prefixes. The /30 subnets are used for the interface IP addresses of the MSEEs and CEs/PE-MSEEs.

To get the configuration details for Microsoft peering, use the following commands:

```azurepowershell
$ckt = Get-AzExpressRouteCircuit -ResourceGroupName "Test-ER-RG" -Name "Test-ER-Ckt"
Get-AzExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering" -ExpressRouteCircuit $ckt
```

If a peering isn't configured, you get an error message. Here's an example response when the stated peering isn't configured within the circuit:

```azurepowershell
Get-AzExpressRouteCircuitPeeringConfig : Sequence contains no matching element
At line:1 char:1
    + Get-AzExpressRouteCircuitPeeringConfig -Name "MicrosoftPeering ...
    + ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        + CategoryInfo          : CloseError: (:) [Get-AzExpr...itPeeringConfig], InvalidOperationException
        + FullyQualifiedErrorId : Microsoft.Azure.Commands.Network.GetAzureExpressRouteCircuitPeeringConfigCommand
```

> [!NOTE]
> If enabling a peering fails, check if the assigned primary and secondary subnets match the configuration on the linked CE/PE-MSEE. Also, verify that the `VlanId`, `AzureASN`, and `PeerASN` values on the MSEEs match those on the linked CE/PE-MSEE.
>
> If MD5 hashing is chosen, ensure the shared key is the same on both MSEE and CE/PE-MSEE pairs. Previously configured shared keys won't be displayed for security reasons.
>
> If you need to change any of these configurations on an MSEE router, see [Create and modify routing for an ExpressRoute circuit][CreatePeering].

> [!NOTE]
> On a /30 subnet assigned for the interface, Microsoft will use the second usable IP address for the MSEE interface. Ensure the first usable IP address is assigned to the peered CE/PE-MSEE.

## Validate ARP

The Address Resolution Protocol (ARP) table provides a mapping of the IP address and MAC address for a particular peering. The ARP table for an ExpressRoute circuit peering provides the following information for each interface (primary and secondary):

* Mapping of the IP address for the on-premises router interface to the MAC address
* Mapping of the IP address for the ExpressRoute router interface to the MAC address (optional)
* Age of the mapping

ARP tables can help validate layer 2 configuration and troubleshoot basic layer 2 connectivity issues.

> [!NOTE]
> Depending on the hardware platform, the ARP results may vary and only display the *On-premises* interface.

To learn how to view the ARP table of an ExpressRoute peering and how to use the information to troubleshoot layer 2 connectivity issues, see [Getting ARP tables in the Resource Manager deployment model][ARP].

## Validate BGP and routes on the MSEE

To retrieve the routing table from the MSEE on the primary path for the private routing context, use the following command:

```azurepowershell
Get-AzExpressRouteCircuitRouteTable -DevicePath Primary -ExpressRouteCircuitName <CircuitName> -PeeringType AzurePrivatePeering -ResourceGroupName <ResourceGroupName>
```

Example response:

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
> If the eBGP peering state between an MSEE and a CE/PE-MSEE is **Active** or **Idle**, verify that the primary and secondary peer subnets match the configuration on the linked CE/PE-MSEE. Ensure the `VlanId`, `AzureASN`, and `PeerASN` values are correct on the MSEEs and match those on the linked CE/PE-MSEE. If MD5 hashing is used, the shared key must be the same on both MSEE and CE/PE-MSEE pairs. For configuration changes on an MSEE router, see [Create and modify routing for an ExpressRoute circuit][CreatePeering].

> [!NOTE]
> If certain destinations are unreachable over a peering, check the MSEE route table for the corresponding peering context. If a matching prefix is present, ensure no firewalls, network security groups, or ACLs are blocking the traffic.

Example response for a nonexistent peering:

```azurepowershell
Get-AzExpressRouteCircuitRouteTable : The BGP Peering AzurePublicPeering with Service Key <ServiceKey> is not found.
StatusCode: 400
```

## Confirm the traffic flow

To get traffic statistics (bytes in and out) for a peering context, use the following command:

```azurepowershell
Get-AzExpressRouteCircuitStats -ResourceGroupName <ResourceGroupName> -ExpressRouteCircuitName <CircuitName> -PeeringType 'AzurePrivatePeering'
```

Example output:

```output
PrimaryBytesIn PrimaryBytesOut SecondaryBytesIn SecondaryBytesOut
-------------- --------------- ---------------- -----------------
    240780020       239863857        240565035         239628474
```

Example output for a nonexistent peering:

```azurepowershell
Get-AzExpressRouteCircuitRouteTable : The BGP Peering AzurePublicPeering with Service Key <ServiceKey> is not found.
StatusCode: 400
```

## Test private peering connectivity

Test private peering connectivity by counting packets arriving at and leaving the Microsoft edge of your ExpressRoute circuit on the MSEE devices. This diagnostic tool uses an ACL to count packets hitting specific rules, confirming connectivity.

### Run a test

1. In the Azure portal, select **Diagnose and solve problems** from your ExpressRoute circuit.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/diagnose-problems.png" alt-text="Diagnose and solve problems button.":::

2. Select **Connectivity & Performance issues**.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/connectivity-issues.png" alt-text="Connectivity issues option.":::

3. In the **Tell us more about the problem you are experiencing** dropdown, select **Issues with Private peering**.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/tell-us-more.png" alt-text="Tell us more dropdown.":::

4. Expand the **Test private-peering connectivity** section.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/test-private-peering.png" alt-text="Test private peering option.":::

5. Run the [PsPing](/sysinternals/downloads/psping) test from your on-premises IP to your Azure IP, and keep it running during the test.

6. Fill out the form fields with the same IP addresses used in step 5, then select **Submit** and wait for results.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/form.png" alt-text="Form for debugging an ACL.":::

### Interpret results

Review the results for the primary and secondary MSEE devices:

* **Matches sent and received on both MSEEs**: Indicates healthy traffic inbound and outbound. Any loss is downstream from the MSEEs.
* **Received matches but no sent matches**: Traffic is reaching Azure but not returning. Check return-path routing issues.
* **Sent matches but no received matches**: Traffic is reaching on-premises but not returning to Azure. Work with your provider to resolve.
* **One MSEE shows no matches, the other shows good matches**: Indicates one MSEE isn't receiving or passing traffic. It might be offline.

* **If you're testing PsPing from on-premises to Azure, received results show matches, but sent results show no matches**: This result indicates that traffic is coming in to Azure but isn't returning to on-premises. Check for return-path routing issues. For example, are you advertising the appropriate prefixes to Azure? Is a user-defined route (UDR) overriding prefixes?

* **If you're testing PsPing from Azure to on-premises, sent results show matches, but received results show no matches**: This result indicates that traffic is coming in to on-premises but isn't returning to Azure. Work with your provider to find out why traffic isn't being routed to Azure via your ExpressRoute circuit.

* **One MSEE shows no matches, but the other shows good matches**: This result indicates that one MSEE isn't receiving or passing any traffic. It might be offline (for example, BGP/ARP is down).
  * You can run additional testing to confirm the unhealthy path by advertising a unique /32 on-premises route over the BGP session on this path. 
  * Run "Test your private peering connectivity" using the unique /32 advertised as the on-premise destination address and review the results to confirm the path health. 

Your test results for each MSEE device look like the following example:

```
src 10.0.0.0 dst 20.0.0.0 dstport 3389 (received): 120 matches
src 20.0.0.0 srcport 3389 dst 10.0.0.0 (sent): 120 matches
```

## Verify availability of the virtual network gateway

The ExpressRoute virtual network gateway manages connectivity to private link services and private IPs in an Azure virtual network. Microsoft manages this infrastructure and might perform maintenance, reducing performance.

To troubleshoot connectivity issues and check for recent maintenance:

1. In the Azure portal, select **Diagnose and solve problems** from your ExpressRoute circuit.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/diagnose-problems.png" alt-text="Diagnose and solve problems button.":::

2. Select **Performance Issues**.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/performance-issues.png" alt-text="Performance issues option.":::

3. Wait for diagnostics to run and interpret the results.

    :::image type="content" source="./media/expressroute-troubleshooting-expressroute-overview/gateway-result.png" alt-text="Diagnostic results.":::

If maintenance occurred during packet loss or latency, it might have contributed to connectivity issues. Follow the recommended steps and consider upgrading the [virtual network gateway SKU](expressroute-about-virtual-network-gateways.md#gwsku) to support higher throughput and avoid future issues.

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

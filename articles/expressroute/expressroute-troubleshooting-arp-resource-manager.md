---
title: 'Azure ExpressRoute: ARP tables - Troubleshooting'
description: This page provides instructions on getting the Address Resolution Protocol (ARP) tables for an ExpressRoute circuit
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: troubleshooting
ms.date: 01/31/2025
ms.author: duau
---
# Getting ARP tables in the Resource Manager deployment model

> [!div class="op_single_selector"]
> * [PowerShell - Resource Manager](expressroute-troubleshooting-arp-resource-manager.md)
> * [PowerShell - Classic](expressroute-troubleshooting-arp-classic.md)
> 
This article walks you through the steps to learn the ARP tables for your ExpressRoute circuit.

> [!IMPORTANT]
> This document is intended to help you diagnose and fix simple issues. It isn't intended to be a replacement for Microsoft support. You must open a support ticket with [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) if you're unable to solve the problem using the guidance described in this article.

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

## Address Resolution Protocol (ARP) and ARP tables

Address Resolution Protocol (ARP) is a layer 2 protocol defined in [RFC 826](https://tools.ietf.org/html/rfc826). ARP is used to map the Ethernet address (MAC address) with an IP address.

The ARP table provides the following information for both the primary and secondary interfaces for each peering type:

1. Mapping of on-premises router interface IP address to the MAC address
2. Mapping of ExpressRoute router interface IP address to the MAC address
3. Age of the mapping

ARP tables can help validate layer 2 configuration and troubleshoot basic layer 2 connectivity issues.

Example ARP table:

```output
Age InterfaceProperty IpAddress  MacAddress    
--- ----------------- ---------  ----------    
 10 On-Prem           10.0.0.1   ffff.eeee.dddd
  0 Microsoft         10.0.0.2   aaaa.bbbb.cccc
```

The following section provides information on how you can view the ARP tables seen by the ExpressRoute edge routers.

## Prerequisites for learning ARP tables

Ensure that the following information is true before you progress further:

* A valid ExpressRoute circuit configured with at least one peering. The circuit must be fully configured with the connectivity provider. You or your connectivity provider must configure at least Azure private or Microsoft peering on this circuit.
* IP address ranges used to configure the peerings. To understand how IP addresses get mapped to interfaces, review the IP address assignment examples in the [ExpressRoute routing requirements page](expressroute-routing.md) . You can get information on the peering configuration by reviewing the [ExpressRoute peering configuration page](expressroute-howto-routing-arm.md).
* Information from your networking team/connectivity provider on the MAC addresses of interfaces used with these IP addresses.
* You must have the latest PowerShell module for Azure (version 1.50 or newer).

> [!NOTE]
> If layer 3 is provided by the service provider and the ARP tables are blank in the portal, refresh the circuit configuration using the refresh button in the portal. This operation applies the right routing configuration on your circuit.

## Getting the ARP tables for your ExpressRoute circuit

This section provides instructions on how you can view the ARP tables per peering using PowerShell. You or your connectivity provider must configure the peering before progressing further. Each circuit has two paths (primary and secondary). You can check the ARP table for each path independently.

> [!NOTE]
> Depending on the hardware platform, the ARP results can vary and only display the *On-premises* interface.

### ARP tables for Azure private peering

The following cmdlet provides the ARP tables for Azure private peering

```azurepowershell
# Required Variables
$RG = "<Your Resource Group Name Here>"
$Name = "<Your ExpressRoute Circuit Name Here>"

# ARP table for Azure private peering - Primary path
Get-AzExpressRouteCircuitARPTable -ResourceGroupName $RG -ExpressRouteCircuitName $Name -PeeringType AzurePrivatePeering -DevicePath Primary

# ARP table for Azure private peering - Secondary path
Get-AzExpressRouteCircuitARPTable -ResourceGroupName $RG -ExpressRouteCircuitName $Name -PeeringType AzurePrivatePeering -DevicePath Secondary 
```

Sample output for one of the paths:

```output
Age InterfaceProperty IpAddress  MacAddress    
--- ----------------- ---------  ----------    
 10 On-Prem           10.0.0.1   ffff.eeee.dddd
  0 Microsoft         10.0.0.2   aaaa.bbbb.cccc
```

### ARP tables for Microsoft peering
The following cmdlet provides the ARP tables for Microsoft peering

```azurepowershell
# Required Variables
$RG = "<Your Resource Group Name Here>"
$Name = "<Your ExpressRoute Circuit Name Here>"

# ARP table for Microsoft peering - Primary path
Get-AzExpressRouteCircuitARPTable -ResourceGroupName $RG -ExpressRouteCircuitName $Name -PeeringType MicrosoftPeering -DevicePath Primary

# ARP table for Microsoft peering - Secondary path
Get-AzExpressRouteCircuitARPTable -ResourceGroupName $RG -ExpressRouteCircuitName $Name -PeeringType MicrosoftPeering -DevicePath Secondary 
```


Sample output for one of the paths:

```output
Age InterfaceProperty IpAddress  MacAddress    
--- ----------------- ---------  ----------    
 10 On-Prem           20.33.0.1   ffff.eeee.dddd
  0 Microsoft         20.33.0.2   aaaa.bbbb.cccc
```


## How to use this information

The ARP table of a peering can be used to determine and validate layer 2 configuration and connectivity. This section provides an overview of how ARP tables look under different scenarios.

### ARP table when a circuit is in operational state (expected state)
* The ARP table has an entry for the on-premises side with a valid IP address and MAC address. The same can be seen for the Microsoft side.
* The last octet of the on-premises IP address is an odd number.
* The last octet of the Microsoft IP address is an even number.
* The same MAC address appears on the Microsoft side for all three peerings (primary/secondary).

```output
Age InterfaceProperty IpAddress  MacAddress    
--- ----------------- ---------  ----------    
 10 On-Prem           20.33.0.1   ffff.eeee.dddd
  0 Microsoft         20.33.0.2   aaaa.bbbb.cccc
```
Or

```output
Age InterfaceProperty IpAddress  MacAddress    
--- ----------------- ---------  ----------    
 10 On-Prem           20.33.0.1   ffff.eeee.dddd
```

### ARP table when on-premises/connectivity provider side has problems

If there's a problem with the on-premises or connectivity provider, the ARP table shows one of two things: the on-premises MAC address shows as incomplete, or only the Microsoft entry is present in the ARP table.

```output
Age InterfaceProperty IpAddress  MacAddress    
--- ----------------- ---------  ----------   
  0 On-Prem           20.33.0.1   Incomplete
  0 Microsoft         20.33.0.2   aaaa.bbbb.cccc
```
Or

```output
Age InterfaceProperty IpAddress  MacAddress    
--- ----------------- ---------  ----------    
  0 Microsoft         20.33.0.2   aaaa.bbbb.cccc
```

> [!NOTE]
> Open a support request with your connectivity provider for debugging any issues.
> If the ARP table doesn't have IP addresses of the interfaces mapped to MAC addresses, review the following information:
> 
> 1. Ensure the first IP address of the /30 subnet assigned for the link between the MSEE-PR and MSEE is used on the interface of MSEE-PR. Azure always uses the second IP address for MSEEs.
> 2. Verify if the customer (C-Tag) and service (S-Tag) VLAN tags match both on MSEE-PR and MSEE pair.

### ARP table when Microsoft side has problems

* If there are issues on the Microsoft side, the ARP table for a peering doesn't appear.
* Open a support ticket with [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). Specify that you have an issue with layer 2 connectivity.

## Next Steps
* Validate Layer 3 configurations for your ExpressRoute circuit.
  * Get route summary to determine the state of BGP sessions.
  * Get route table to determine which prefixes are advertised across ExpressRoute.
* Validate data transfer by reviewing bytes in/out.
* Open a support ticket with [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) if you're still experiencing issues.

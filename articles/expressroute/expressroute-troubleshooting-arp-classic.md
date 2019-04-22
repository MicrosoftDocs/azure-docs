---
title: 'Get ARP tables- Troubleshooting ExpressRoute: classic: Azure| Microsoft Docs'
description: This page provides instructions for getting the ARP tables for an ExpressRoute circuit - classic deployment model.
services: expressroute
author: ganesr

ms.service: expressroute
ms.topic: article
ms.date: 01/30/2017
ms.author: ganesr
ms.custom: seodec18

---
# Getting ARP tables in the classic deployment model
> [!div class="op_single_selector"]
> * [PowerShell - Resource Manager](expressroute-troubleshooting-arp-resource-manager.md)
> * [PowerShell - Classic](expressroute-troubleshooting-arp-classic.md)
> 
> 

This article walks you through the steps for getting the Address Resolution Protocol (ARP) tables for your Azure ExpressRoute circuit.

> [!IMPORTANT]
> This document is intended to help you diagnose and fix simple issues. It is not intended to be a replacement for Microsoft support. If you can't solve the problem by using the following guidance, open a support request with [Microsoft Azure Help+support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
> 
> 

## Address Resolution Protocol (ARP) and ARP tables
ARP is a Layer 2 protocol that's defined in [RFC 826](https://tools.ietf.org/html/rfc826). ARP is used to map an Ethernet address (MAC address) to an IP address.

An ARP table provides a mapping of the IPv4 address and MAC address for a particular peering. The ARP table for an ExpressRoute circuit peering provides the following information for each interface (primary and secondary):

1. Mapping of an on-premises router interface IP address to a MAC address
2. Mapping of an ExpressRoute router interface IP address to a MAC address
3. The age of the mapping

ARP tables can help with validating Layer 2 configuration and with troubleshooting basic Layer 2 connectivity issues.

Following is an example of an ARP table:

        Age InterfaceProperty IpAddress  MacAddress    
        --- ----------------- ---------  ----------    
         10 On-Prem           10.0.0.1 ffff.eeee.dddd
          0 Microsoft         10.0.0.2 aaaa.bbbb.cccc


The following section provides information about how to view the ARP tables that are seen by the ExpressRoute edge routers.

## Prerequisites for using ARP tables
Ensure that you have the following before you continue:

* A valid ExpressRoute circuit that's configured with at least one peering. The circuit must be fully configured by the connectivity provider. You (or your connectivity provider) must configure at least one of the peerings (Azure private, Azure public, or Microsoft) on this circuit.
* IP address ranges that are used for configuring the peerings (Azure private, Azure public, and Microsoft). Review the IP address assignment examples in the [ExpressRoute routing requirements page](expressroute-routing.md) to get an understanding of how IP addresses are mapped to interfaces on your side and on the ExpressRoute side. You can get information about the peering configuration by reviewing the [ExpressRoute peering configuration page](expressroute-howto-routing-classic.md).
* Information from your networking team or connectivity provider about the MAC addresses of the interfaces that are used with these IP addresses.
* The latest Windows PowerShell module for Azure (version 1.50 or later).

## ARP tables for your ExpressRoute circuit
This section provides instructions about how to view the ARP tables for each type of peering by using PowerShell. Before you continue, either you or your connectivity provider needs to configure the peering. Each circuit has two paths (primary and secondary). You can check the ARP table for each path independently.

### ARP tables for Azure private peering
The following cmdlet provides the ARP tables for Azure private peering:

        # Required variables
        $ckt = "<your Service Key here>

        # ARP table for Azure private peering--primary path
        Get-AzureDedicatedCircuitPeeringArpInfo -ServiceKey $ckt -AccessType Private -Path Primary

        # ARP table for Azure private peering--secondary path
        Get-AzureDedicatedCircuitPeeringArpInfo -ServiceKey $ckt -AccessType Private -Path Secondary

Following is sample output for one of the paths:

        Age InterfaceProperty IpAddress  MacAddress    
        --- ----------------- ---------  ----------    
         10 On-Prem           10.0.0.1 ffff.eeee.dddd
          0 Microsoft         10.0.0.2 aaaa.bbbb.cccc


### ARP tables for Azure public peering:
The following cmdlet provides the ARP tables for Azure public peering:

        # Required variables
        $ckt = "<your Service Key here>

        # ARP table for Azure public peering--primary path
        Get-AzureDedicatedCircuitPeeringArpInfo -ServiceKey $ckt -AccessType Public -Path Primary

        # ARP table for Azure public peering--secondary path
        Get-AzureDedicatedCircuitPeeringArpInfo -ServiceKey $ckt -AccessType Public -Path Secondary

Following is sample output for one of the paths:

        Age InterfaceProperty IpAddress  MacAddress    
        --- ----------------- ---------  ----------    
         10 On-Prem           10.0.0.1 ffff.eeee.dddd
          0 Microsoft         10.0.0.2 aaaa.bbbb.cccc


Following is sample output for one of the paths:

        Age InterfaceProperty IpAddress  MacAddress    
        --- ----------------- ---------  ----------    
         10 On-Prem           64.0.0.1 ffff.eeee.dddd
          0 Microsoft         64.0.0.2 aaaa.bbbb.cccc


### ARP tables for Microsoft peering
The following cmdlet provides the ARP tables for Microsoft peering:

    # ARP table for Microsoft peering--primary path
    Get-AzureDedicatedCircuitPeeringArpInfo -ServiceKey $ckt -AccessType Microsoft -Path Primary

    # ARP table for Microsoft peering--secondary path
    Get-AzureDedicatedCircuitPeeringArpInfo -ServiceKey $ckt -AccessType Microsoft -Path Secondary


Sample output is shown below for one of the paths:

        Age InterfaceProperty IpAddress  MacAddress    
        --- ----------------- ---------  ----------    
         10 On-Prem           65.0.0.1 ffff.eeee.dddd
          0 Microsoft         65.0.0.2 aaaa.bbbb.cccc


## How to use this information
The ARP table of a peering can be used to validate Layer 2 configuration and connectivity. This section provides an overview of how ARP tables look in different scenarios.

### ARP table when a circuit is in an operational (expected) state
* The ARP table has an entry for the on-premises side with a valid IP and MAC address, and a similar entry for the Microsoft side.
* The last octet of the on-premises IP address is always an odd number.
* The last octet of the Microsoft IP address is always an even number.
* The same MAC address appears on the Microsoft side for all three peerings (primary/secondary).

        Age InterfaceProperty IpAddress  MacAddress    
        --- ----------------- ---------  ----------    
         10 On-Prem           65.0.0.1 ffff.eeee.dddd
          0 Microsoft         65.0.0.2 aaaa.bbbb.cccc

### ARP table when it's on-premises or when the connectivity-provider side has problems
 Only one entry appears in the ARP table. It shows the mapping between the MAC address and the IP address that's used on the Microsoft side.

        Age InterfaceProperty IpAddress  MacAddress    
        --- ----------------- ---------  ----------    
          0 Microsoft         65.0.0.2 aaaa.bbbb.cccc

> [!NOTE]
> If you experience an issue like this, open a support request with your connectivity provider to resolve it.
> 
> 

### ARP table when the Microsoft side has problems
* You will not see an ARP table shown for a peering if there are issues on the Microsoft side.
* Open a support request with [Microsoft Azure Help+support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). Specify that you have an issue with Layer 2 connectivity.

## Next steps
* Validate Layer 3 configurations for your ExpressRoute circuit:
  * Get a route summary to determine the state of BGP sessions.
  * Get a route table to determine which prefixes are advertised across ExpressRoute.
* Validate data transfer by reviewing bytes in and out.
* Open a support request with [Microsoft Azure Help+support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) if you are still experiencing issues.


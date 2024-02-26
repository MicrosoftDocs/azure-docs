---
title: Operator Nexus Operator PE configuration
description: Interconnectivity parameters to configure PE for PE-CE connectivity in Operator Nexus
author: osamazia
ms.author: osamaz
ms.service: azure-operator-nexus
ms.topic: reference #Required. A value that depends on the article but is usually "how-to," "tutorial," or "conceptual."
ms.date: 02/02/2023 #Required. The publish date in mm/dd/yyyy format.
---

# Configuration options for PE-CE connectivity

## Introduction

Operator Nexus  is a two layer Clos type architecture with the CEs (Connection Endpoint) acting as the edge devices or boundary routers. All types of traffic (such as management traffic, mobile network control, and user plane traffic), to and from an Operator Nexus instance, will pass through the CE.

On your site, the CEs will be connected to your PEs (Provider Edge or P) routers. You can configure PE-CE connectivity in multiple ways.

Following are the configuration areas.

### Physical connection

Operator Nexus is designed to reserve multiple ports for physical connectivity between CE and PE. These ports will be added to port channel. You don't have to connect all ports on day one. You can start with one port and add more ports on need basis.

### Port channel

Port channel is required for PE-CE connectivity. All the ports connecting PE to CE will be part of this port channel. You can start with one port and later add more ports to this port channel. Based on your design, you'll create subinterfaces from this port channel interface for different types of traffic.

### VLANs

At least one subinterface is required between PE and CE. You can create multiple subinterfaces and assign them to respective VLANs. You should pick a VLAN number above 500.

### IP addresses

CE supports both IPv4 and IPv6 address. You can assign a /31 or /30 IPv4 on the subinterface between PE and CE. You can assign a /127 IPv6 address. Based on your BGP design, you can use only IPv6 for option A. However, for option B you shall configure IPv4.

### Protocols

Only BGP is supported between PE and CE. You can use iBGP or eBGP between the PE and CE. You'll assign "Fabric ASN" and "Peer ASN" based on your design. All BGP peerings between PE and CE at a given site will use the same "Fabric ASN". To establish some sessions as iBGP and others as eBGP make changes at PE.

#### BGP

You can use standard BGP (option A). You can also use MP-BGP with inter-as Option 10B. In this case, you have to define option B parameters during your network fabric creation.

## Prerequisites

1. Decide how many ports you want to start with.
2. Find the right optics and cables based on your desired throughput and distance between PE and CE. For the CE, the optics must conform to provided bill of materials.
3. Choose the VLAN numbers for subinterfaces
4. Allocate IP addresses for the PE CE interfaces
5. Select the right BGP design for PE-CE connectivity

For MP-BGP make sure you configure matching route targets on both PE and CE.

```azurecli
az networkfabric fabric create \
--resource-group "example-rg" \
--location "eastus" \
--resource-name "example-nf" \
--nf-sku "123" \
--nfc-id "12333" \
--nni-config '{"layer3Configuration":{"primaryIpv4Prefix":"10.20.0.0/19", "fabricAsn":10000, "peerAsn":10001, "vlanId": 20}, "layer2Configuration" : {"portCount":4,"mtu":1500} }' \
--managed-network-config '{"ipv4Prefix":"10.1.0.0/19", "managementVpnConfiguration":{"optionBProperties":{"importRouteTargets":["65531:2001","65532:2001"], "exportRouteTargets":["65531:2001","65532:2001"]}}}' 
```

## PE configuration steps

1. Add selected interface(s) to port channel
2. Configure subinterfaces and assign corresponding VLANs
3. Assign IPv4 and/or IPv6 addresses to the interfaces
4. Configure BGP based on the design
5. For option B, configure route targets

## Test the integration

1. Run `show lldp` neighbor to verify physical connection
2. Validate connectivity by ping test
3. Check the BGP neighbor status
4. Verify that you're exchanging routes with CE

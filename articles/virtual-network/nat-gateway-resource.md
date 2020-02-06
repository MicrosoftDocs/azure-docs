---

title: Designing virtual networks with NAT gateway resources
titleSuffix: Azure Virtual Network NAT
description: Learn how to design virtual networks with NAT gateway resources.
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
ms.service: virtual-network
Customer intent: As an IT administrator, I want to learn more about how to design virtual networks with NAT gateway resources.
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/28/2020
ms.author: allensu
---

# Designing virtual networks with NAT gateway resources

NAT gateway resources are part of [Virtual Network NAT](nat-overview.md) and provide outbound Internet connectivity for one or more subnets of a virtual network. The subnet of the virtual network states which NAT gateway will be used. NAT provides source network address translation (SNAT) for a subnet.  NAT gateway resources specify which static IP addresses virtual machines will use when creating outbound flows. Static IP addresses come from individual public IP address resources, public IP prefix resources, or both. A NAT gateway resource can use up to 16 static IP addresses from either.

## How to deploy NAT

Configuring and using NAT gateway is intentionally made simple:  

NAT gateway resource:
- Create regional or zonal (zone-isolated) NAT gateway resource,
- Assign IP addresses,
- Modify idle timeout (optional).

Virtual network:
- Configure virtual network subnet to use a NAT gateway.

User-defined routes aren't necessary.

## Resource

The resource is designed to be simple as you can see from the following Azure Resource Manager example in a template-like format.  This template-like format is shown here to illustrate the concepts and structure.  Modify the example for your needs.  This document isn't intended as a tutorial.

NAT is recommended for most workloads unless you have a specific dependency on [pool-based Load Balancer outbound connectivity](../load-balancer/load-balancer-outbound-connections.md).

The following example would create a NAT gateway resource called _myNATGateway_ is created in region _East US 2, AZ 1_ with a _4-minutes_ idle timeout. The outbound IP addresses provided are:
- A set of public IP address resources _myIP1_ and _myIP2_ and 
- A set of public IP prefix resources _myPrefix1_ and _myPrefix2_. 

The total number of IP addresses provided by all four IP address resources can't exceed 16 IP addresses total. Any number of IP addresses between 1 and 16 is allowed.

```json
{
"name": "myNATGateway",
   "type": "Microsoft.Network/natGateways",
   "apiVersion": "2018-11-01",
   "location": "East US 2",
   "sku": { "name": "Standard" },
   "zones": [ "1" ],
   "properties": {
      "idleTimeoutInMinutes": 4, 
      "publicIPPrefixes": [
         {
            "id": "ref to myPrefix1"
         },
         {
            "id": "ref to myPrefix2"
         }
      ],
      "publicIPAddresses": [
         {
            "id": "ref to myIP1"
         },
         {
            "id": "ref to myIP2"
         }
      ]
   }
}
```

Once this NAT gateway resource has been created, it can be used on one or more subnets of a virtual network. You specify which subnets to use this resource on by configuring the subnet of a virtual network with a reference to the respective NAT gateway.  A NAT gateway can't span more than one virtual networks.  It isn't necessary to assign the same NAT gateway to all subnets of a virtual network.

Scenarios that don't use availability zones will be regional (no zone specified).  If you're using availability zones, you can specify a zone force NAT to be isolated to a specific zone. Review NAT [availability zones](#availability-zones).


```json
{
   "name": "myVNet",
   "apiVersion": "2018-11-01",
   "type": "Microsoft.Network/virtualNetworks",
   "location": "myRegion", 
   "properties": {
      "addressSpace": {
          "addressPrefixes": [
           "192.168.0.0/16"
          ]
      },
      "subnets": [
         {
            "name": "mySubnet1",
            "properties": {
               "addressPrefix": “192.168.0.0/24",
               "natGateway": {
                  "id": "ref to myNATGateway"
               }
            }
         } 
      ]
   }
}
```

All flows created by virtual machines on subnet _mySubnet1_ of virtual network _myVNet_ will now begin using the IP addresses associated with _myNatGateway_ as the source.

## Availability Zones

Even without availability zones, NAT is resilient and can survive multiple infrastructure component failures.

When availability zones are part of your scenario, you should configure NAT for a specific zone.  The control plane operations and data plane are constrained to the specified zone. Failure in a zone other than where your scenario exists is expected to be without impact to NAT. Zone isolation means that when zone failure occurs, outbound connections from virtual machines in the same zone as NAT will fail.

When you create a zone-isolated NAT gateway, you must also use zonal IP addresses that match the zone of the NAT gateway resource.  NAT gateway resources don't allow IP addresses from a different zone or without zone to be attached.

Virtual networks and subnets are regional and have no zonal alignment.  For a zonal promise to exist for the outbound connections of a virtual machine, the virtual machine must be in the same zone as the NAT gateway resource.  If you cross zones, a zonal promise can't exist.

When you deploy virtual machine scale sets to use with NAT, you must deploy a zonal scale set on its own subnet and attach the matching zone NAT gateway to that subnet for a zonal promise.  If you use zone-spanning scale sets (a scale set in two or more zones), NAT won't provide a zonal promise.  NAT doesn't support zone-redundancy.

The zones property isn't mutable.  Redeploy NAT gateway resource with the intended regional or zone preference.

>[!NOTE] 
>IP addresses by themselves aren't zone-redundant if no zone is specified.  The frontend of a [Standard Load Balancer is zone-redundant](../load-balancer/load-balancer-standard-availability-zones.md#frontend) if an IP address isn't created in a specific zone.  This doesn't apply to NAT.  Only regional or zone-isolation is supported.

## Source Network Address Translation

Source network address translation (SNAT) rewrites the source of a flow to originate from a different IP address.  NAT gateway resources use a variant of SNAT commonly referred to port address translation (PAT). PAT rewrites the source address and source port.  With the addition of source port translation, there's no fixed relationship between the number of private addresses and their translated public addresses.  

### Fundamentals

Let's look at an example of four flows to explain the basic concept.  The NAT gateway is using public IP address resource 65.52.0.2.

| Flow | Source tuple | Destination tuple |
|---|---|---|
| 1 | 192.168.0.16:4283 | 65.52.0.1:80 |
| 2 | 192.168.0.16:4284 | 65.52.0.1:80 |
| 3 | 192.168.0.17.5768 | 65.52.0.1:80 |
| 4 | 192.168.0.16:4285 | 65.52.0.2:80 |

These flows might look like this after PAT has taken place:

| Flow | Source tuple | SNAT source tuple | Destination tuple | 
|---|---|---|
| 1 | 192.168.0.16:4283 | 65.52.0.2:234 | 65.52.0.1:80 |
| 2 | 192.168.0.16:4284 | 65.52.0.2:235 | 65.52.0.1:80 |
| 3 | 192.168.0.17.5768 | 65.52.0.2:236 | 65.52.0.1:80 |
| 4 | 192.168.0.16:4285 | 65.52.0.2:237 | 65.52.0.2:80 |

The destination will see the source of the flow as 65.52.0.2 (SNAT source tuple) with the assigned port shown.  PAT as shown in the preceding table is also called port masquerading SNAT.  Multiple private sources are masqueraded behind an IP and port.

Don't take a dependency on the specific way source ports are assigned.  The preceding is an illustration of the fundamental concept only.

SNAT provided by NAT is different from [Load Balancer](../load-balancer/load-balancer-outbound-connections.md) in several aspects.

### On-demand

NAT provides SNAT ports for new outbound to Internet flows on-demand at the time the flow is created.  All available SNAT ports in inventory can be used by any virtual machine on subnets configured with NAT.  Any IP configuration of a virtual machine can create outbound flows on-demand as needed.  Pre-allocation, per instance planning including per instance worst case overprovisioning, isn't required.

Once a SNAT port is released, it becomes available for use for any virtual machine on subnets configured with NAT as needed.  This allows dynamic and divergent workloads on subnet(s) to use SNAT ports as they need.  As long as there is SNAT port inventory available, SNAT flows will succeed. Any intermittent SNAT port hot spots in your deployment can benefit from the larger inventory instead of leaving SNAT ports unused for virtual machines not actively needing them.

### Scaling

NAT needs sufficient SNAT port inventory for the complete outbound scenario. Scaling NAT is primarily a function of managing the shared, available SNAT port inventory.  Sufficient inventory needs to exist to address the peak outbound flow for all subnets attached to a NAT gateway resource.

SNAT can map multiple private addresses map to one public IP address.  Additionally you can have multiple public addresses for scaling PAT. 

A NAT gateway resource will use 64,000 ports (SNAT ports) of a public IP address.  These SNAT ports become the available inventory for the private to public flow mapping. And adding more public IP addresses increases the available inventory SNAT ports. NAT gateway resources can be configured with up to 16 IP addresses for up to 1M SNAT ports.  TCP and UDP are separate SNAT port inventories and unrelated.

NAT gateway resources opportunistically reuse source ports. For scaling purposes, you should assume each flow requires a new SNAT port and scale the total number of available IP addresses for outbound to Internet flows.

### Protocols

NAT gateway resources interact with IP and IP transport headers of UDP and TCP flows and are agnostic to application layer payloads.  Other IP protocols aren't supported.

### Timers

Idle timeout can be adjusted from 4 minutes (default) to 120 minutes (2 hours) for all flows.  Additionally, you can reset the idle timer with traffic on the flow.  A recommended pattern for refreshing long idle connections and endpoint liveness detection is TCP keepalives.  TCP keepalives appear as duplicate ACKs to the endpoints, are low overhead, and invisible to the application layer.

The following timers are used for SNAT port release:

| Timer | Value |
|---|---|
| TCP FIN | 60 seconds |
| TCP RST | 10 seconds |
| TCP half open | 30 seconds |

A SNAT port is available for reuse to the same destination IP address and destination port after 5 seconds.

## Limitations

- NAT is compatible with standard SKU public IP, public IP prefix, and load balancer resources.   Basic resources (for example basic load balancer) and any products derived from them aren't compatible with NAT.  Basic resources must be placed on a subnet not configured with NAT.
- IPv4 address family is supported.  NAT doesn't interact with IPv6 address family.
- NSG on subnet or NIC isn't honored for outbound flows to public endpoints using NAT.
- NSG flow logging isn't supported when using NAT.
- When a virtual network has multiple subnets, each subnet can have a different NAT configured.
- NAT can't span multiple virtual networks.

## Next steps

- Learn more about [virtual network NAT](nat-overview.md).
- Quickstart for deploying [NAT gateway resource using Azure CLI](quickstart-create-nat-gateway-cli.md).
- Quickstart for deploying [NAT gateway resource using Azure PowerShell](quickstart-create-nat-gateway-powershell.md).
- Quickstart for deploying [NAT gateway resource using Azure portal](quickstart-create-nat-gateway-portal.md).
- Learn more about [availability zones](../availability-zones/az-overview.md).
- Learn more about [standard load balancer](../load-balancer/load-balancer-standard-overview.md)
- Learn more about [availability zones and standard load balancer](../load-balancer/load-balancer-standard-availability-zones.md)

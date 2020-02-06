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

NAT gateway resources are part of [Virtual Network NAT](nat-overview.md) and provide outbound Internet connectivity for one or more subnets of a virtual network. The subnet of the virtual network states which NAT gateway will be used. NAT gateway resources specify which static IP addresses virtual machines will use when creating outbound flows. Static IP addresses come from individual public IP address resources, public IP prefix resources, or both. A NAT gateway resource can use up to 16 static IP addresses from either.

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

The resource is designed to be simple as you can see from the following Azure Resource Manager example in template format.  A NAT gateway resource called _myNATGateway_ is created in region _East US 2, AZ 1_ with a _4-minutes_ idle timeout. The outbound IP addresses provided are:
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

Scenarios that don't use availability zones will be regional (no zone specified).  If you're using Availability Zones, you can specify a zone force NAT to be isolated to a specific zone. Review NAT [availability zones](#availability-zones).


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

When availability zones are part of your scenario, you can specify a zone to force NAT to be isolated to a specific zone.  The control plane operations and data plane is constrained to the specified zone. Failure in a zone other than where your scenario exists is expected to be without impact to NAT. Zone isolation means that when zone failure occurs, outbound connections from virtual machines in the same zone as NAT will fail.

When you create a zone-isolated NAT gateway, you must also use zonal IP addresses that match the zone of the NAT gateway resource.  NAT gateway resources don't allow IP addresses from a different zone or without zone to be attached.

Virtual networks and subnets are regional and have no zonal alignment.  For a zonal promise to exist for the outbound connections of a virtual machine, the virtual machine must be in the same zone as the NAT gateway resource.  If you cross zones, a zonal promise can't exist.

If you deploy virtual machine scale sets, you must deploy a zonal scale set on its own subnet and attach the matching zone NAT gateway to that subnet for a zonal promise.  If you use zone-spanning scale sets (a scale set in two or more zones), NAT will not provide a zonal promise.  NAT doesn't support zone-redundancy.

The zone property isn't mutable.  Redeploy NAT gateway resource with the desired zone preference.

>[!NOTE] 
>IP addresses by themselves aren't zone-redundant if no zone is specified.  The frontend of a [Standard Load Balancer is zone-redundant](../load-balancer/load-balancer-standard-availability-zones.md#frontend) if an IP address isn't created in a specific zone.  This doesn't apply to NAT.  Only regional or zone-isolation is supported.


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

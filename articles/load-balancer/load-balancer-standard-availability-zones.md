---
title: Azure Standard Load Balancer and Availability Zones
titlesuffix: Azure Load Balancer
description: Standard Load Balancer and Availability Zones
services: load-balancer
documentationcenter: na
author: KumudD
ms.custom: seodec18
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/27/2018
ms.author: kumud
---

# Standard Load Balancer and Availability Zones

Azure Load Balancer's Standard SKU supports [Availability Zones](../availability-zones/az-overview.md) scenarios. Several new concepts are available with Standard Load Balancer, which allow you to optimize availability in your end-to-end scenario by aligning resources with zones and distributing them across zones.  Review [Availability Zones](../availability-zones/az-overview.md) for guidance on what Availability Zones are, which regions currently support Availability Zones, and other related concepts and products. Availability Zones in combination with Standard Load Balancer are an expansive and flexible feature set that can create many different scenarios.  Review this document to understand these [concepts](#concepts) and fundamental scenario [design guidance](#design).

>[!IMPORTANT]
>Review [Availability Zones](../availability-zones/az-overview.md) for related topics, including any region specific information.

## <a name="concepts"></a> Availability Zones concepts applied to Load Balancer

There's no direct relationship between Load Balancer resources and actual infrastructure; creating a Load Balancer doesn't create an instance. Load Balancer resources are objects within which you can express how Azure should program its prebuilt multi-tenant infrastructure to achieve the scenario you wish to create.  This is significant in the context of Availability Zones because a single Load Balancer resource can control programming of infrastructure in multiple Availability Zones while a zone-redundant service appears as one resource from a customer point of view.

A Load Balancer resource's functions are expressed as a frontend, a rule, a health probe, and a backend pool definition.

In the context of Availability Zones, the behavior and properties of a Load Balancer resource are described as zone-redundant or zonal.  Zone-redundant and zonal describe the zonality of a property.  In the context of Load Balancer, zone-redundant always means *multiple zones* and zonal means isolating the service to a *single zone*.

Both public and internal Load Balancer support zone-redundant and zonal scenarios and both can direct traffic across zones as needed (*cross-zone load-balancing*).

A Load Balancer resource itself is regional and never zonal.  And a VNet and subnet are always regional and never zonal.

### Frontend

A Load Balancer frontend is a Frontend IP configuration referencing either a public IP address resource or a private IP address within the subnet of a virtual network resource.  It forms the load balanced endpoint where your service is exposed.

A Load Balancer resource can contain both zonal and zone-redundant frontends simultaneously. 

When a public IP resource has been guaranteed to a zone, the zonality (or lack thereof) isn't mutable.  If you wish to change or omit the zonality of a public IP frontend, you need to recreate the public IP in the appropriate zone.  

You can change the zonality of a frontend of an internal Load Balancer by removing and recreating the frontend, changing or omitting the zonality.

When using multiple frontends, review [multiple frontends for Load Balancer](load-balancer-multivip-overview.md) for important considerations.

#### Zone redundant by default

>[!IMPORTANT]
>Review [Availability Zones](../availability-zones/az-overview.md) for related topics, including any region specific information.

In a region with Availability Zones, a Standard Load Balancer frontend is zone-redundant by default.  A single frontend IP address can survive zone failure and can be used to reach all backend pool members irrespective of the zone. This doesn't mean hitless data path, but any retries or reestablishment will succeed. DNS redundancy schemes aren't required. The frontend's single IP address is served simultaneously by multiple independent infrastructure deployments in multiple Availability Zones.  Zone-redundant means that all inbound or outbound flows are served by multiple Availability Zones in a region simultaneously using a single IP address.

One or more Availability Zones can fail and the data path survives as long as one zone in the region remains healthy. Zone-redundant configuration is the default and requires no additional actions.  

Use the following script to create a zone-redundant Public IP address for your internal Standard Load Balancer. If you're using existing Resource Manager templates in your configuration, add the **sku** section to these templates.

```json
            "apiVersion": "2017-08-01",
            "type": "Microsoft.Network/publicIPAddresses",
            "name": "public_ip_standard",
            "location": "region",
            "sku":
            {
                "name": "Standard"
            },
```

Use the following script to create a zone-redundant frontend IP address for your internal Standard Load Balancer. If you're using existing Resource Manager templates in your configuration, add the **sku** section to these templates.

```json
            "apiVersion": "2017-08-01",
            "type": "Microsoft.Network/loadBalancers",
            "name": "load_balancer_standard",
            "location": "region",
            "sku":
            {
                "name": "Standard"
            },
            "properties": {
                "frontendIPConfigurations": [
                    {
                        "name": "zone_redundant_frontend",
                        "properties": {
                            "subnet": {
                                "Id": "[variables('subnetRef')]"
                            },
                            "privateIPAddress": "10.0.0.6",
                            "privateIPAllocationMethod": "Static"
                        }
                    },
                ],
```

#### Optional zone isolation

You can choose to have a frontend guaranteed to a single zone, which is known as a *zonal frontend*.  This means any inbound or outbound flow is served by a single zone in a region.  Your frontend shares fate with the health of the zone.  The data path is unaffected by failures in zones other than where it was guaranteed. You can use zonal frontends to expose an IP address per Availability Zone.  Also, you can consume zonal frontends directly or, when the frontend consists of public IP addresses, integrate them with a DNS load-balancing product like [Traffic Manager](../traffic-manager/traffic-manager-overview.md) and use a single DNS name, which a client will resolve to multiple zonal IP addresses.  You can also use this to expose per zone load-balanced endpoints to individually monitor each zone.  If you wish to blend these concepts (zone-redundant and zonal for same backend), review [multiple frontends for Azure Load Balancer](load-balancer-multivip-overview.md).

For a public Load Balancer frontend, you add a *zones* parameter to the public IP referenced by the frontend IP configuration.  

For an internal Load Balancer frontend, add a *zones* parameter to the internal Load Balancer frontend IP configuration. The zonal frontend causes the Load Balancer to guarantee an IP address in a subnet to a specific zone.

Use the following script to create a zonal Standard Public IP address in Availability Zone 1. If you're using existing Resource Manager templates in your configuration, add the **sku** section to these templates.

```json
            "apiVersion": "2017-08-01",
            "type": "Microsoft.Network/publicIPAddresses",
            "name": "public_ip_standard",
            "location": "region",
            "zones": [ "1" ],
            "sku":
            {
                "name": "Standard"
            },
```

Use the following script to create an internal Standard Load Balancer front end in Availability Zone 1.

If you're using existing Resource Manager templates in your configuration, add the **sku** section to these templates. Also, define the **zones** property in the frontend IP configuration for the child resource.

```json
            "apiVersion": "2017-08-01",
            "type": "Microsoft.Network/loadBalancers",
            "name": "load_balancer_standard",
            "location": "region",
            "sku":
            {
                "name": "Standard"
            },
            "properties": {
                "frontendIPConfigurations": [
                    {
                        "name": "zonal_frontend_in_az1",
                        "zones": [ "1" ],
                        "properties": {
                            "subnet": {
                                "Id": "[variables('subnetRef')]"
                            },
                            "privateIPAddress": "10.0.0.6",
                            "privateIPAllocationMethod": "Static"
                        }
                    },
                ],
```

### Cross-zone Load-Balancing

Cross-zone load-balancing is the ability of Load Balancer to reach a backend endpoint in any zone and is independent of frontend and its zonality.

If you wish to align and guarantee your deployment within a single zone, align zonal frontend and zonal backend resources to the same zone. No further action is required.

### Backend

Load Balancer works with Virtual Machines.  Any VM in a single VNet can be part of the backend pool irrespective of whether or not it was guaranteed to a zone or which zone was guaranteed to.

If you wish to align and guarantee your frontend and backend with a single zone, only place VMs within the same zone into the respective backend pool.

If you wish to address VMs across multiple zones, simply place VMs from multiple zones into the same backend pool.  When using virtual machine scale sets, you can place one or more virtual machine scale sets into the same backend pool.  And each of these virtual machine scale sets can be in a single or multiple zones.

### Outbound connections

[Outbound connections](load-balancer-outbound-connections.md) are served by all zones and are automatically zone-redundant in a region with Availability Zones when a virtual machine is associated with a public Load Balancer and a zone-redundant frontend.  Outbound connection SNAT port allocations survive zone failures.  

In turn, if the VM is associated with a public Load Balancer and a zonal frontend, outbound connections are guaranteed to be served by a single zone.  Outbound connections share fate with the respective zone's health.

The SNAT port preallocation and algorithm is the same with or without zones.

### Health probes

Your existing health probe definitions remain as they are without Availability Zones.  But we've expanded the health model at an infrastructure level. 

When using zone-redundant frontends, Load Balancer expands its internal health model to independently probe the reachability of a VM from each Availability Zone and shut down paths across zones that may have failed without customer intervention.  If a given path is not available from the Load Balancer infrastructure of one zone to a VM in another zone, Load Balancer can detect and avoid this failure. Other zones who can reach this VM can continue to serve the VM from their respective frontends.  As a result, it is possible that during failure events, each zone may have slightly different flow distributions while protecting the overall health of your end-to-end service.

## <a name="design"></a> Design considerations

Load Balancer is purposely flexible in the context of Availability Zones. You can choose to align to zones or you can choose to be zone-redundant.  Increased availability can come at the price of increased complexity and you must design for availability for optimal performance.  Let's take a look at some important design considerations.

### Automatic zone-redundancy

Load Balancer makes it simple to have a single IP as a zone-redundant frontend. A zone-redundant IP address can safely serve a zonal resource in any zone and can survive one or more zone failures as long as one zone remains healthy within the region. Conversely, a zonal frontend is a reduction of the service to a single zone and shares fate with the respective zone.

Zone-redundancy does not imply hitless datapath or control plane;  it is expressly data plane. Zone-redundant flows can use any zones and a customer's flows will use all healthy zones in a region. In the event of zone failure, traffic flows using healthy zones at that point in time are not impacted.  Traffic flows using a zone at the time of zone failure may be impacted but applications can recover. These flows can continue in the remaining healthy zones within the region upon retransmission or reestablishment, once Azure has converged around the zone failure.

### <a name="xzonedesign"></a> Cross zone boundaries

It is important to understand that any time an end-to-end service crosses zones, you share fate with not one zone but potentially multiple zones.  As a result, your end-to-end service may not have gained any availability over non-zonal deployments.

Avoid introducing unintended cross-zone dependencies, which will nullify availability gains when using Availability Zones.  When your application consists of multiple components and you wish to be resilient to zone failure, you must take care to ensure the survival of sufficient critical components in the event of a zone failing.  For example, a single critical component for your application can impact your entire application if it only exists in a zone other than the surviving zone(s).  In addition, also consider the zone restoration and how your application will converge. Let's review some key points and use them as inspiration for questions as you think through your specific scenario.

- If your application has two components like an IP address and a VM with managed disk, and they're guaranteed in zone 1 and zone 2, when zone 1 fails your end-to-end service will not survive when zone 1 fails.  Don't cross zones unless you fully understand that you are creating a potentially hazardous failure mode.

- If your application has two components like an IP address and a VM with managed disk, and they are guaranteed to be zone-redundant and zone 1 respectively, your end-to-end service will survive zone failure of zone 2, zone 3, or both unless zone 1 has failed.  However, you lose some ability to reason about the health of your service if all you are observing is the reachability of the frontend.  Consider developing a more extensive health and capacity model.  You might use zone-redundant and zonal concepts together to expand insight and manageability.

- If your application has two components like a zone-redundant Load Balancer frontend and a cross-zone virtual machine scale set in three zones, your resources in zones not impacted by failure will be available but your end-to-end service capacity may be degraded during zone failure. From an infrastructure perspective, your deployment can survive one or more zone failures, and this raises the following questions:
  - Do you understand how your application reasons about such failures and degraded capacity?
  - Do you need to have safeguards in your service to force a failover to a region pair if necessary?
  - How will you monitor, detect, and mitigate such a scenario? You may be able to use Standard Load Balancer diagnostics to augment monitoring of your end-to-end service performance. Consider what is available and what may need augmentation for a complete picture.

- Zones can make failures more easily understood and contained.  However, zone failure is no different than other failures when it comes to concepts like timeouts, retries, and backoff algorithms. Even though Azure Load Balancer provides zone-redundant paths and tries to recover quickly, at a packet level in real time, retransmissions or reestablishments may occur during the onset of a failure and it's important to understand how your application copes with failures. Your load-balancing scheme will survive, but you need to plan for the following:
  - When a zone fails, does your end-to-end service understand this and if the state is lost, how will you recover?
  - When a zone returns, does your application understand how to converge safely?

### <a name="zonalityguidance"></a> Zone-redundant versus zonal

>[!IMPORTANT]
>Review [Availability Zones](../availability-zones/az-overview.md) for related topics, including any region specific information.

Zone-redundant can provide a zone-agnostic and at the same time resilient option with a single IP address for the service.  It can reduce complexity in turn.  Zone-redundant also has mobility across zones, and can be safely used on resources in any zone.  Also, it's future proof in regions without Availability Zones, which can limit changes required once a region does gain Availability Zones.  The configuration syntax for a zone-redundant IP address or frontend succeeds in any region including those without Availability Zones.

Zonal can provide an explicit guarantee to a zone, sharing fate with the health of the zone. Associating a zonal IP address or zonal Load Balancer frontend can be a desirable or reasonable attribute especially if your attached resource is a zonal VM in the same zone.  Or perhaps your application requires explicit knowledge about which zone a resource is located in and you wish to reason about availability in separate zones explicitly.  You can choose to expose multiple zonal frontends for an end-to-end service distributed across zones (that is, per zone zonal frontends for multiple zonal virtual machine scale sets).  And if your zonal frontends are public IP addresses, you can use these multiple zonal frontends for exposing your service with [Traffic Manager](../traffic-manager/traffic-manager-overview.md).  Or you can use multiple zonal frontends to gain per zone health and performance insights through third party monitoring solutions and expose the overall service with a zone-redundant frontend. You should only serve zonal resources with zonal frontends aligned to the same zone and avoid potentially harmful cross-zone scenarios for zonal resources.  Zonal resources only exist in regions where Availability Zones exist.

There's no general guidance that one is a better choice than the other without knowing the service architecture.

## Limitations

- While data plane is fully zone-redundant (unless zonal guarantee was specified), control plane operations aren't fully zone-redundant.

## Next steps
- Learn more about [Availability Zones](../availability-zones/az-overview.md)
- Learn more about [Standard Load Balancer](load-balancer-standard-overview.md)
- Learn how to [load balance VMs within a zone using a Standard Load Balancer with a zonal frontend](load-balancer-standard-public-zonal-cli.md)
- Learn how to [load balance VMs across zones using a Standard Load Balancer with a zone-redundant frontend](load-balancer-standard-public-zone-redundant-cli.md)

---
title: Azure Standard Load Balancer and Availability Zones
titleSuffix: Azure Load Balancer
description: With this learning path, get started with Azure Standard Load Balancer and Availability Zones.
services: load-balancer
documentationcenter: na
author: asudbring
ms.custom: seodec18
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/07/2019
ms.author: allensu
---

# Standard Load Balancer and Availability Zones

Azure Standard Load Balancer supports [availability zones](../availability-zones/az-overview.md) scenarios. You can use Standard Load Balancer to optimize availability in your end-to-end scenario by aligning resources with zones and distributing them across zones.  Review [availability zones](../availability-zones/az-overview.md) for guidance on what availability zones are, which regions currently support availability zones, and other related concepts and products. Availability zones in combination with Standard Load Balancer is an expansive and flexible feature set that can create many different scenarios.  Review this document to understand these [concepts](#concepts) and fundamental scenario [design guidance](#design).

>[!IMPORTANT]
>Review [Availability Zones](../availability-zones/az-overview.md) for related topics, including any region specific information.

## <a name="concepts"></a> Availability Zones concepts applied to Load Balancer

There's no direct relationship between Load Balancer resources and actual infrastructure; creating a Load Balancer doesn't create an instance. Load Balancer resources are objects within which you can express how Azure should program its prebuilt multi-tenant infrastructure to achieve the scenario you wish to create.  This is significant in the context of availability zones because a single Load Balancer resource can control programming of infrastructure in multiple availability zones while a zone-redundant service appears as one resource from a customer point of view.  

A Load Balancer resource itself is regional and never zonal.  And a VNet and subnet are always regional and never zonal. The granularity of what you can configure is constrained by each configuration of frontend, rule, and backend pool definition.

In the context of availability zones, the behavior and properties of a Load Balancer rule are described as zone-redundant or zonal.  Zone-redundant and zonal describe the zonality of a property.  In the context of Load Balancer, zone-redundant always means *multiple zones* and zonal means isolating the service to a *single zone*.

Both public and internal Load Balancer support zone-redundant and zonal scenarios and both can direct traffic across zones as needed (*cross-zone load-balancing*). 

### Frontend

A Load Balancer frontend is a frontend IP configuration referencing either a public IP address resource or a private IP address within the subnet of a virtual network resource.  It forms the load balanced endpoint where your service is exposed.

A Load Balancer resource can contain rules with zonal and zone-redundant frontends simultaneously. 

When a public IP resource or a private IP address has been guaranteed to a zone, the zonality (or lack thereof) isn't mutable.  If you wish to change or omit the zonality of a public IP or private IP address frontend, you need to recreate the public IP in the appropriate zone.  Availability zones do not change the constraints for multiple frontend, review [multiple frontends for Load Balancer](load-balancer-multivip-overview.md) for details for this ability.

#### Zone redundant by default

In a region with availability zones, a Standard Load Balancer frontend is zone-redundant by default.  Zone-redundant means that all inbound or outbound flows are served by multiple availability zones in a region simultaneously using a single IP address. DNS redundancy schemes aren't required. A single frontend IP address can survive zone failure and can be used to reach all (non-impacted) backend pool members irrespective of the zone. One or more availability zones can fail and the data path survives as long as one zone in the region remains healthy. The frontend's single IP address is served simultaneously by multiple independent infrastructure deployments in multiple availability zones.  This doesn't mean hitless data path, but any retries or reestablishment will succeed in other zones not impacted by the zone failure.   

The following excerpt is an illustration for how to define a public IP a zone-redundant Public IP address to use with your public Standard Load Balancer. If you're using existing Resource Manager templates in your configuration, add the **sku** section to these templates.

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

The following excerpt is an illustration for how to define a zone-redundant frontend IP address for your internal Standard Load Balancer. If you're using existing Resource Manager templates in your configuration, add the **sku** section to these templates.

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

The preceding excerpts are not complete templates but intended to show how to express availability zones properties.  You need to incorporate these statements into your templates.

#### Optional zone isolation

You can choose to have a frontend guaranteed to a single zone, which is known as a *zonal frontend*.  This means any inbound or outbound flow is served by a single zone in a region.  Your frontend shares fate with the health of the zone.  The data path is unaffected by failures in zones other than where it was guaranteed. You can use zonal frontends to expose an IP address per Availability Zone.  

Additionally, you can consume zonal frontends directly for load balanced endpoints within each zone. You can also use this to expose per zone load-balanced endpoints to individually monitor each zone.  Or for public endpoints you can integrate them with a DNS load-balancing product like [Traffic Manager](../traffic-manager/traffic-manager-overview.md) and use a single DNS name. The client then will then resolve to this DNS name to multiple zonal IP addresses.  

If you wish to blend these concepts (zone-redundant and zonal for same backend), review [multiple frontends for Azure Load Balancer](load-balancer-multivip-overview.md).

For a public Load Balancer frontend, you add a *zones* parameter to the public IP resource referenced by the frontend IP configuration used by the respective rule.

For an internal Load Balancer frontend, add a *zones* parameter to the internal Load Balancer frontend IP configuration. The zonal frontend causes the Load Balancer to guarantee an IP address in a subnet to a specific zone.

The following excerpt is an illustration for how to define a zonal Standard Public IP address in Availability Zone 1. If you're using existing Resource Manager templates in your configuration, add the **sku** section to these templates.

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

The following excerpt is an illustration for how to define an internal Standard Load Balancer front end in Availability Zone 1. If you're using existing Resource Manager templates in your configuration, add the **sku** section to these templates. Also, define the **zones** property in the frontend IP configuration for the child resource.

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

The preceding excerpts are not complete templates but intended to show how to express availability zones properties.  You need to incorporate these statements into your templates.

### Cross-zone Load-Balancing

Cross-zone load-balancing is the ability of Load Balancer to reach a backend endpoint in any zone and is independent of frontend and its zonality.  Any load balancing rule can target backend instance in any availability zone or regional instances.

You need to take care to construct your scenario in a manner which expressed an availability zones notion. For example, you need guarantee your virtual machine deployment within a single zone or multiple zones, and align zonal frontend and zonal backend resources to the same zone.  If you cross availability zones with only zonal resources, the scenario will work but may not have a clear failure mode with respect to availability zones. 

### Backend

Load Balancer works with virtual machines instances.  These can be standalone, availability sets, or virtual machine scale sets.  Any virtual machine instance in a single virtual network can be part of the backend pool irrespective of whether or not it was guaranteed to a zone or which zone was guaranteed to.

If you wish to align and guarantee your frontend and backend with a single zone, only place virtual machines within the same zone into the respective backend pool.

If you wish to address virtual machines across multiple zones, simply place virtual machines from multiple zones into the same backend pool.  When using virtual machine scale sets, you can place one or more virtual machine scale sets into the same backend pool.  And each of these virtual machine scale sets can be in a single or multiple zones.

### Outbound connections

The same zone-redundant and zonal properties apply to [outbound connections](load-balancer-outbound-connections.md).  A zone-redundant public IP address used for outbound connections is served by all zones. A zonal public IP address is served only by the zone it is guaranteed in.  Outbound connection SNAT port allocations survive zone failures and your scenario will continue to provide outbound SNAT connectivity if not impacted by zone failure.  This may require transmissions or for connections to be re-established for zone-redundant scenarios if a flow was served by an impacted zone.  Flows in zones other than the impacted zones are not affected.

The SNAT port preallocation algorithm is the same with or without availability zones.

### Health probes

Your existing health probe definitions remain as they are without availability zones.  However, we've expanded the health model at an infrastructure level. 

When using zone-redundant frontends, Load Balancer expands its internal health model to independently probe the reachability of a virtual machine from each availability zone and shut down paths across zones that may have failed without customer intervention.  If a given path is not available from the Load Balancer infrastructure of one zone to a virtual machine in another zone, Load Balancer can detect and avoid this failure. Other zones who can reach this VM can continue to serve the VM from their respective frontends.  As a result, it is possible that during failure events, each zone may have slightly different distributions of new flows while protecting the overall health of your end-to-end service.

## <a name="design"></a> Design considerations

Load Balancer is purposely flexible in the context of availability zones. You can choose to align to zones or you can choose to be zone-redundant for each rule.  Increased availability can come at the price of increased complexity and you must design for availability for optimal performance.  Let's take a look at some important design considerations.

### Automatic zone-redundancy

Load Balancer makes it simple to have a single IP as a zone-redundant frontend. A zone-redundant IP address can safely serve a zonal resource in any zone and can survive one or more zone failures as long as one zone remains healthy within the region. Conversely, a zonal frontend is a reduction of the service to a single zone and shares fate with the respective zone.

Zone-redundancy does not imply hitless datapath or control plane;  it is expressly data plane. Zone-redundant flows can use any zones and a customer's flows will use all healthy zones in a region. In the event of zone failure, traffic flows using healthy zones at that point in time are not impacted.  Traffic flows using a zone at the time of zone failure may be impacted but applications can recover. These flows can continue in the remaining healthy zones within the region upon retransmission or reestablishment, once Azure has converged around the zone failure.

### <a name="xzonedesign"></a> Cross zone boundaries

It is important to understand that any time an end-to-end service crosses zones, you share fate with not one zone but potentially multiple zones.  As a result, your end-to-end service may not have gained any availability over non-zonal deployments.

Avoid introducing unintended cross-zone dependencies, which will nullify availability gains when using availability zones.  When your application consists of multiple components and you wish to be resilient to zone failure, you must take care to ensure the survival of sufficient critical components in the event of a zone failing.  For example, a single critical component for your application can impact your entire application if it only exists in a zone other than the surviving zone(s).  In addition, also consider the zone restoration and how your application will converge. You need to understand how your application reasons with respect to failures of portions of it. Let's review some key points and use them as inspiration for questions as you think through your specific scenario.

- If your application has two components like an IP address and a virtual machine with managed disk, and they're guaranteed in zone 1 and zone 2, when zone 1 fails your end-to-end service will not survive when zone 1 fails.  Don't cross zones with zonal scenarios unless you fully understand that you are creating a potentially hazardous failure mode.  This scenario is allowed to provide flexibility.

- If your application has two components like an IP address and a virtual machine with managed disk, and they are guaranteed to be zone-redundant and zone 1 respectively, your end-to-end service will survive zone failure of zone 2, zone 3, or both unless zone 1 has failed.  However, you lose some ability to reason about the health of your service if all you are observing is the reachability of the frontend.  Consider developing a more extensive health and capacity model.  You might use zone-redundant and zonal concepts together to expand insight and manageability.

- If your application has two components like a zone-redundant Load Balancer frontend and a cross-zone virtual machine scale set in three zones, your resources in zones not impacted by failure will be available but your end-to-end service capacity may be degraded during zone failure. From an infrastructure perspective, your deployment can survive one or more zone failures, and this raises the following questions:
  - Do you understand how your application reasons about such failures and degraded capacity?
  - Do you need to have safeguards in your service to force a failover to a region pair if necessary?
  - How will you monitor, detect, and mitigate such a scenario? You may be able to use Standard Load Balancer diagnostics to augment monitoring of your end-to-end service performance. Consider what is available and what may need augmentation for a complete picture.

- Zones can make failures more easily understood and contained.  However, zone failure is no different than other failures when it comes to concepts like timeouts, retries, and backoff algorithms. Even though Azure Load Balancer provides zone-redundant paths and tries to recover quickly, at a packet level in real time, retransmissions or reestablishments may occur during the onset of a failure and it's important to understand how your application copes with failures. Your load-balancing scheme will survive, but you need to plan for the following:
  - When a zone fails, does your end-to-end service understand this and if the state is lost, how will you recover?
  - When a zone returns, does your application understand how to converge safely?

Review [Azure cloud design patterns](https://docs.microsoft.com/azure/architecture/patterns/) to improve the resiliency of your application to failure scenarios.

### <a name="zonalityguidance"></a> Zone-redundant versus zonal

Zone-redundant can provide a simplicity with a zone-agnostic option and at the same time resilient option with a single IP address for the service.  It can reduce complexity in turn.  Zone-redundant also has mobility across zones, and can be safely used on resources in any zone.  Also, it's future proof in regions without availability zones, which can limit changes required once a region does gain availability zones.  The configuration syntax for a zone-redundant IP address or frontend succeeds in any region including those without availability zones: a zone is not specified within the zones: property of the resource.

Zonal can provide an explicit guarantee to a zone, explicitly sharing fate with the health of the zone. Creating a Load Balancer rule with a zonal IP address frontend or zonal internal Load Balancer frontend can be a desirable especially if your attached resource is a zonal virtual machine in the same zone.  Or perhaps your application requires explicit knowledge about which zone a resource is located in ahead of time and you wish to reason about availability in separate zones explicitly.  You can choose to expose multiple zonal frontends for an end-to-end service distributed across zones (that is, per zone zonal frontends for multiple zonal virtual machine scale sets).  And if your zonal frontends are public IP addresses, you can use these multiple zonal frontends for exposing your service with [Traffic Manager](../traffic-manager/traffic-manager-overview.md).  Or you can use multiple zonal frontends to gain per zone health and performance insights through third party monitoring solutions and expose the overall service with a zone-redundant frontend. You should only serve zonal resources with zonal frontends aligned to the same zone and avoid potentially harmful cross-zone scenarios for zonal resources.  Zonal resources only exist in regions where availability zones exist.

There's no general guidance that one is a better choice than the other without knowing the service architecture.  Review [Azure cloud design patterns](https://docs.microsoft.com/azure/architecture/patterns/) to improve the resiliency of your application to failure scenarios.

## Next steps
- Learn more about [Availability Zones](../availability-zones/az-overview.md)
- Learn more about [Standard Load Balancer](load-balancer-standard-overview.md)
- Learn how to [load balance VMs within a zone using a Standard Load Balancer with a zonal frontend](load-balancer-standard-public-zonal-cli.md)
- Learn how to [load balance VMs across zones using a Standard Load Balancer with a zone-redundant frontend](load-balancer-standard-public-zone-redundant-cli.md)
- Learn about [Azure cloud design patterns](https://docs.microsoft.com/azure/architecture/patterns/) to improve the resiliency of your application to failure scenarios.

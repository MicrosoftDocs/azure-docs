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
ms.date: 05/07/2020
ms.author: allensu
---

# Standard Load Balancer and Availability Zones

Azure Standard Load Balancer supports availability zones scenarios. You can use standard load balancer to increase availability throughout your scenario by aligning resources with, and distribution across zones. Availability zones in combination with standard load balancer are an expansive and flexible feature set that can create many different scenarios.  Review this document to understand these [concepts](#concepts) and fundamental scenario [design guidance](#design).

## <a name="concepts"></a> Availability Zones concepts applied to Load Balancer

A load balancer inherits zone configuration from its components: 

* Frontend
* Rules
* Backend pool definition

In the context of availability zones, the behavior and properties of a load balancer rule are described as zone-redundant or zonal.  In the context of the load balancer, zone-redundant always means **multiple zones** and zonal means isolating the service to a **single zone**. An Azure Load Balancer has two types, public and internal. Both types of load balancer support zone redundancy and zonal deployment.  Both load balancer types can direct traffic across zones as needed.

## Frontend

A load balancer frontend is a frontend IP configuration referencing either a public IP address or a private IP address within the subnet of a virtual network. It forms the load balanced endpoint where your service is exposed.

A load balancer resource can contain rules with zonal and zone-redundant frontends simultaneously. 
When a public or private IP is guaranteed to a zone, the zonality (or lack of it) isn't alterable. To change or omit the zonality of a public or private IP address frontend, recreate the IP in the appropriate zone. 

Availability zones don't change the constraints for multiple frontends. Review [multiple frontends for Load Balancer](load-balancer-multivip-overview.md) for details for this ability.

### Zone redundant 

In a region with availability zones, a standard load balancer frontend can be zone-redundant. Multiple zones can serve inbound or outbound in a region. This traffic is served by a single IP address. DNS redundancy schemes aren't required. 

A single frontend IP address will survive zone failure. The frontend IP may be used to reach all (non-impacted) backend pool members no matter the zone. One or more availability zones can fail and the data path survives as long as one zone in the region remains healthy. 

The frontend's IP address is served simultaneously by multiple independent infrastructure deployments in multiple availability zones. Any retries or reestablishment will succeed in other zones not affected by the zone failure. 

:::image type="content" source="./media/az-zonal/zone-redundant-lb-1.svg" alt-text="Zone redundant" border="true":::

*Figure: Zone redundant load balancer*

### Zonal

You can choose to have a frontend guaranteed to a single zone, which is known as a *zonal frontend*.  This scenario means any inbound or outbound flow is served by a single zone in a region.  Your frontend shares fate with the health of the zone.  The data path is unaffected by failures in zones other than where it was guaranteed. You can use zonal frontends to expose an IP address per Availability Zone.  

Additionally, the use of zonal frontends directly for load balanced endpoints within each zone is supported. You can use this configuration to expose per zone load-balanced endpoints to individually monitor each zone. For public endpoints, you can integrate them with a DNS load-balancing product like [Traffic Manager](../traffic-manager/traffic-manager-overview.md) and use a single DNS name.

:::image type="content" source="./media/az-zonal/zonal-lb-1.svg" alt-text="Zone redundant" border="true":::

If you wish to blend these concepts (zone-redundant and zonal for same backend), review [multiple frontends for Azure Load Balancer](load-balancer-multivip-overview.md).

For a public load balancer frontend, you add a **zones** parameter to the public IP. This public IP is referenced by the frontend IP configuration used by the respective rule.

For an internal load balancer frontend, add a **zones** parameter to the internal load balancer frontend IP configuration. A zonal frontend guarantees an IP address in a subnet to a specific zone.

## Backend

Azure Load Balancer works with virtual machine instances. These instances can be standalone, availability sets, or virtual machine scale sets. Any virtual machine in a single virtual network can be part of the backend pool, whatever zone the virtual machine is guaranteed to.

To align and guarantee your frontend and backend with a single zone, only place virtual machines within the same zone into the corresponding backend pool.

To address virtual machines across multiple zones, place virtual machines from multiple zones into the same backend pool. 

When using virtual machine scale sets, place one or more virtual machine scale sets into the same backend pool. Scale sets can be in single or multiple zones.

## Outbound connections

Zone-redundant and zonal apply to [outbound connections](load-balancer-outbound-connections.md). A zone-redundant public IP address used for outbound connections is served by all zones. A zonal public IP address is served only by the zone it's guaranteed in. 

Outbound connection SNAT port allocations survive zone failures and your scenario will continue to provide outbound SNAT connectivity if not affected by zone failure. Zone failures may require connections to be re-established for zone-redundant scenarios if traffic was served by an affected zone. Flows in zones other than the affected zones aren't affected.

The SNAT port preallocation algorithm is the same with or without availability zones.

## Health probes

Your existing health probe definitions remain as they are without availability zones. However, we've expanded the health model at an infrastructure level. 

When using zone-redundant frontends, the load balancer expands its internal health checking. The load balancer independently probes the availability of a virtual machine from each zone and shuts down paths across zones that have failed without intervention.  

Other zones who can reach this VM can continue to serve the VM from their respective frontends. During failure events, each zone may have different distributions of new flows while protecting the overall health of your service.

## <a name="design"></a> Design considerations

Load balancer is flexible in the context of availability zones. You can choose to align to zones or be zone-redundant for each rule. Increased availability can come at the price of increased complexity. Design for availability for optimal performance.

### Automatic zone-redundancy

Load Balancer makes it simple to have a single IP as a zone-redundant frontend. A zone-redundant IP address can serve a zonal resource in any zone.  The IP can survive one or more zone failures as long as one zone remains healthy within the region.  Instead, a zonal frontend is a reduction of the service to a single zone and shares fate with the respective zone.

Zone-redundancy doesn't imply hitless datapath or control plane; it's data plane. Zone-redundant flows can use any zones and a customer's flows will use all healthy zones in a region. In a zone failure, traffic flows using healthy zones aren't affected. 

Traffic flows using a zone at the time of zone failure may be affected but applications can recover. Traffic continues in the healthy zones within the region upon retransmission when Azure has converged around the zone failure.

### <a name="xzonedesign"></a> Cross zone boundaries

It's important to understand that anytime a service crosses zones, you share fate with not one zone but potentially multiple zones. As a result, your service may not have gained any availability over non-zonal deployments.

Avoid introducing unintended cross-zone dependencies, which will nullify availability gains when using availability zones. If your application contains multiple critical components, ensure the survival if a zone fails.

A single critical component for your application can impact your entire application if it only exists in a zone other than the surviving zone(s). Consider the zone restoration and how your application will converge. Understand how your application responds to failures of portions of it. Review key points and use them for questions as you think through your specific scenario.

- If your application has two components:

    * IP address
    * Virtual machine with managed disk

They're configured in zone 1 and zone 2. When zone 1 fails, your service won't survive. Don't cross zones with zonal scenarios unless you fully understand that you're creating a potentially hazardous failure mode. This scenario is allowed to provide flexibility.

- If your application has two components:

    * IP address
    * Virtual machine with managed disk

They're configured to be zone-redundant and zone 1. Your service will survive zone failure of zone 2, zone 3, or both unless zone 1 has failed. However, you lose some ability to reason about the health of your service if all you're observing is the reachability of the frontend.  Consider developing a more extensive health and capacity model.  You might use zone-redundant and zonal concepts together to expand insight and manageability.

- If your application has two components:

    * Zone-redundant load balancer frontend
    * Cross-zone virtual machine scale set in three zones

Your resources in zones not affected by failure will be available. Your service capacity may be degraded during the failure. From an infrastructure perspective, your deployment can survive one or more zone failures. This scenario raises the following questions:

  - Do you understand how your application responds to failures and degraded capacity?
  - Do you need to have safeguards in your service to force a failover to a region pair if necessary?
  - How will you monitor, detect, and mitigate such a scenario? You can use standard load balancer diagnostics to augment monitoring of your service performance. Consider what is available and what may need augmentation.

- Zones can make failures more easily understood and contained. Zone failure is no different than other failures when it comes to timeouts, retries, and backoff algorithms. Azure Load Balancer provides zone-redundant paths. The load balancer tries to recover quickly, at a packet level in real time. Retransmissions or reestablishments may occur during the onset of a failure. It's important to understand how your application copes with failures. Your load-balancing scheme will survive, but you need to plan for the following questions:

  - When a zone fails, does your service understand this failure and if the state is lost, how will you recover?
  - When a zone returns, does your application understand how to converge safely?

Review [Azure cloud design patterns](https://docs.microsoft.com/azure/architecture/patterns/) to improve the resiliency of your application to failure scenarios.

## Next steps
- Learn more about [Availability Zones](../availability-zones/az-overview.md)
- Learn more about [Standard Load Balancer](load-balancer-standard-overview.md)
- Learn how to [load balance VMs within a zone using a Standard Load Balancer with a zonal frontend](load-balancer-standard-public-zonal-cli.md)
- Learn how to [load balance VMs across zones using a Standard Load Balancer with a zone-redundant frontend](load-balancer-standard-public-zone-redundant-cli.md)
- Learn about [Azure cloud design patterns](https://docs.microsoft.com/azure/architecture/patterns/) to improve the resiliency of your application to failure scenarios.

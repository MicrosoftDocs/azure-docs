---
title: Azure Load Balancer Standard overview | Microsoft Docs
description: Overview of Azure Load Balancer Standard features
services: load-balancer
documentationcenter: na
author: KumudD
manager: timlt
editor: ''

ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/21/2018
ms.author: kumud
---

# Azure Load Balancer Standard overview

Azure Load Balancer allows you to scale your applications and create high availability for your services. Load Balancer can be used for inbound as well as outbound scenarios and provides low latency, high throughput, and scales up to millions of flows for all TCP and UDP applications. 

This article is focussed on Standard Load Balancer.  For a more general overview for Azure Load Balancer, review [Load Balancer Overview](load-balancer-overview.md) as well.

## What is Standard Load Balancer?

Standard Load Balancer is a new Load Balancer product with an expanded and more granular feature set over Basic Load Balancer.  While there are similarities, it is important to be familiar with the differences.  

You can use Standard Load Balancer Standard as a public or internal Load Balancer. And a virtual machine can be connected to one public and one internal Load Balancer resource.

The Load Balancer resource's functions are always expressed as a frontend, a rule, a health probe, and a backend pool definition.  A resource can contain multiple rules. You can place virtual machines into the backend pool by specifying the backend pool from the virtual machine's NIC resource.  In the case of a virtual machine scale set, this parameter is passed through the network profile and expanded.

One key aspect is the scope of the virtual network for the resource.  While Basic Load Balancer exists within the scope of an availability set, a Standard Load Balancer is fully integrated with the scope of a virtual network and all virtual network concepts apply.

Load Balancer resources are objects within which you can express how Azure should program its multi-tenant infrastructure to achieve the scenario you wish to create.  There is no direct relationship between Load Balancer resources and actual infrastructure; creating a Load Balancer doesn't create an instance, capacity is always available, and there are no start-up or scaling delays to consider. 

## Why use Standard Load Balancer?

You can use Standard Load Balancer for the full range of virtual data centers, from small scale deployments to large and complex multi-zone architectures.

Review the table below for an overview of the differences between Standard Load Balancer and Basic Load Balancer:

>[!NOTE]
> New designs should consider using Standard Load Balancer. 

| | Standard SKU | Basic SKU |
| --- | --- | --- |
| Backend pool size | up to 1000 instances | up to 100 instances |
| Backend pool endpoints | any virtual machine in a single virtual network, including blend of virtual machines, availability sets, virtual machine scale sets. | virtual machines in a single availability set or virtual machine scale set |
| Availability Zones | zone-redundant and zonal frontends for inbound and outbound, outbound flows mappings survive zone failure, cross-zone load balancing | / |
| Diagnostics | Azure Monitor, multi-dimensional metrics including byte and packet counters, health probe status, connection attempts (TCP SYN), outbound connection health (SNAT successful and failed flows), active data plane measurements | Azure Log Analytics for public Load Balancer only, SNAT exhaustion alert, backend pool health count |
| HA Ports | internal Load Balancer | / |
| Secure by default | default closed for public IP and Load Balancer endpoints and a network security group must be used to explicitly whitelist for traffic to flow | default open, network security group optional |
| Outbound connections | Multiple frontends with per rule opt-out. An outbound scenario _must_ be explicitly created for the virtual machine to be able to use outbound connectivity.  [VNet Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) can be reached without outbound connectivity and do not count towards data processed.  Any public IP addresses, including Azure PaaS services not available as VNet Service Endpoints, must be reached via outbound connectivity and count towards data processed. When only an internal Load Balancer is serving a virtual machine, outbound connections via default SNAT are not available. | Single frontend, selected at random when multiple frontends are present.  When only internal Load Balancer is serving a virtual machine, default SNAT is used.  Outbound SNAT programming is transport protocol specific. |
| Multiple frontends | Inbound and outbound | Inbound only |
| Management Operations | Most operations < 30 seconds | 60-90+ seconds typical |
| SLA | 99.99% for data path with two healthy virtual machines | Implicit in VM SLA | 
| Pricing | Charged based on number of rules, data processed inbound or outbound associated with resource  | No charge |

Review [service limits for Load Balancer](https://aka.ms/lblimits), as well as [pricing](https://aka.ms/lbpricing), and [SLA](https://aka.ms/lbsla).


### <a name="backend"></a>Backend pool

Standard Load Balancer backend pools expands to any virtual machine resource in a virtual network.  It can contain up to 1000 backend instances.  A backend instance is an IP configuration, which is a property of a NIC resource.

The backend pool can contain standalone virtual machines, availability sets, or virtual machine scale sets.  You can blend resources in the backend pool and it can contain any combination of these resources up to 150 total.

When considering how to design your backend pool, you can design for the least number of individual backend pool resources to further optimize the duration of management operations.  There is no difference in data plane performance or scale.

## <a name="az"></a>Availability Zones

>[!NOTE]
> To use [Availability Zones Preview](https://aka.ms/availabilityzones) with Standard Load Balancer requires [sign-up for Availability Zones](https://aka.ms/availabilityzones).

Standard Load Balancer supports additional abilities in regions where Availability Zones are available.  These features are incremental to all Standard Load Balancer provides.  Availability Zones configurations are available for public and internal Standard Load Balancer.

Non-zonal frontends become zone-redundant by default when deployed in a region with Availability Zones.   A zone-redundant frontend survives zone failure and is served by dedicated infrastructure in all of the zones simultaneously. 

Additionally, you can guarantee a frontend to a specific zone. A zonal frontend shares fate with the respective zone and is served only by dedicated infrastructure in a single zone.

Cross-zone load balancing is available for the backend pool, and any virtual machine resource in a vnet can be part of a backend pool.

Review a [detailed discussion of Availability Zones related abilities](load-balancer-standard-availability-zones.md).

### <a name="diagnostics"></a> Diagnostics

Standard Load Balancer provides multi-dimensional metrics through Azure Monitor.  These metrics can be filtered, grouped and provide current and historic insights into performance and health of your service.  Resource Health is also supported.  Following is a brief overview of supported diagnostics:

| Metric | Description |
| --- | --- |
| VIP availability | Load Balancer Standard continuously exercises the data path from within a region to the Load Balancer front-end all the way to the SDN stack that supports your VM. As long as healthy instances remain, the measurement follows the same path as your application's load-balanced traffic. The data path that is used by your customers is also validated. The measurement is invisible to your application and does not interfere with other operations.|
| DIP availability | Load Balancer Standard uses a distributed health probing service that monitors your application endpoint's health according to your configuration settings. This metric provides an aggregate or per endpoint filtered-view of each individual instance endpoint in the Load Balancer pool.  You can see how Load Balancer views the health of your application as indicated by your health probe configuration.
| SYN packets | Load Balancer Standard does not terminate TCP connections or interact with TCP or UDP packet flows. Flows and their handshakes are always between the source and the VM instance. To better troubleshoot your TCP protocol scenarios, you can make use of SYN packets counters to understand how many TCP connection attempts are made. The metric reports the number of TCP SYN packets that were received.|
| SNAT connections | Load Balancer Standard reports the number of outbound flows that are masqueraded to the Public IP address front-end. SNAT ports are an exhaustible resource. This metric can give an indication of how heavily your application is relying on SNAT for outbound originated flows.  Counters for successful and failed outbound SNAT flows are reported and can be used to troubleshoot and understand the health of your outbound flows.|
| Byte counters | Load Balancer Standard reports the data processed per front-end.|
| Packet counters | Load Balancer Standard reports the packets processed per front-end.|

Review a [detailed discussion of Standard Load Balancer Diagnostics](load-balancer-standard-diagnostics.md).

### <a name="haports"></a>HA Ports

Standard Load Balancer supports a new type of rule.  

You can configure load balancing rules to make your application scale and be highly reliable. When you use an HA Ports load balancing rule, Standard Load Balancer will provide per flow load balancing on every ephemeral port of an internal Standard Load Balancer's frontend IP address.  The feature is useful for other scenarios where it is impractical or undesirable to specify individual ports.

An HA Ports load balancing rule allows you to create active-passive or active-active n+1 scenarios for Network Virtual Appliances and any application which requires large ranges of inbound ports.  A health probe can be used to determine which backends should be receiving new flows.  You can use a Network Security Group to emulate a port range scenario.

>[!IMPORTANT]
> If you are planning to use a Network Virtual Appliance, check with your vendor for guidance on whether their product has been tested with HA Ports and follow their specific guidance for implementation. 

Review a [detailed discussion of HA Ports](load-balancer-ha-ports.md).

### <a name="securebydefault"></a>Secure by default

Standard Load Balancer is fully onboarded to the virtual network.  The virtual network is a private, closed network.  Because Standard Load Balancers and Standard public IP addresses are designed to allow this virtual network to be accessed from outside of the virtual network, these resources now default to closed unless you open them. This means Network Security Groups (NSGs) are now used to explicitly permit and whitelist allowed traffic.  You can create your entire virtual data center and decide through NSG what and when it should be available.  If you do not have an NSG on a subnet or NIC of your virtual machine resource, we will not permit traffic to reach this resource.

To learn more about NSGs and how to apply them for your scenario, see [Network Security Groups](../virtual-network/virtual-networks-nsg.md).

### <a name="outbound"></a> Outbound connections

Load Balancer supports inbound and outbound scenarios.  Standard Load Balancer is significantly different for Basic Load Balancer with respect to outbound connections.

Source Network Address Translation (SNAT) is used to map internal, private IP addresses on your virtual network to public IP addresses on Load Balancer frontends.

Standard Load Balancer introduces a new algorithm for a [more robust, scalable, and predictable SNAT algorithm](load-balancer-outbound-connections.md#snat) and enables new abilities, removes ambiguity, and forces explicit configurations rather side effects. These changes are necessary to allow for new features to emerge. 

These are the key tenets to remember when working with Standard Load Balancer:

1. the completion of a rule drives the Load Balancer resource.  all programming of Azure derives from its configuration.
2. when multiple frontends are available, all frontends are used and each frontend multiplies the number of available SNAT ports
3. you can choose and control if you do not wish for a particular frontend to be used for outbound connections.
4. outbound scenarios are explicit and outbound connectivity does not exist until it has been specified.
5. load balancing rules infer how SNAT is programmed.  load balancing rules are protocol specific. SNAT is protocol specific and configuration should reflect this rather than create a side effect.

#### Multiple frontends
If you want more SNAT ports because you are expecting or are already experiencing a high demand for outbound connections, you can also add incremental SNAT port inventory by configuring additional frontends, rules, and backend pools to the same virtual machine resources.

#### Control which frontend is used for outbound
If you want to constrain outbound connections to only originate from a specific frontend IP address, you can optionally disable outbound SNAT on the rule which expresses the outbound mapping.

#### Control outbound connectivity
Standard Load Balancer exists within the context of the virtual network.  A virtual network is an isolated, private network.  Unless an association with a public IP address exists, public connectivity is not allowed.  You can reach [VNet Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) because they are inside of and local to your virtual network.  If you want to establish outbound connectivity to a destination outside of your virtual network, you have two options:
1. assign a Standard SKU public IP address as an Instance-Level Public IP address to the virtual machine resource or
2. place the virtual machine resource in the backend pool of a public Standard Load Balancer.

Both will allow outbound connectivity from the virtual network to outside of the virtual network. 

If you _only_ have an internal Standard Load Balancer associated with the backend pool in which your virtual machine resource is located, your virtual machine can only reach virtual network resources and [VNet Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview.md).  You can follow the steps described in the preceding paragraph to create outbound connectivity.

Outbound connectivity of a virtual machine resource not associated with Standard SKUs remains as before.

Review a [detailed discussion of Outbound Connections](load-balancer-outbound-connections.md).

### <a name="multife"></a>Multiple frontends
Load Balancer supports multiple rules with multiple frontends.  Standard Load Balancer expands this to outbound scenarios.  Outbound scenarios are essentially the inverse of an inbound load balancing rule.  The inbound load balancing rule also creates an associate for outbound connections. Standard Load Balancer uses all frontends associated with a virtual machine resource through a load balancing rule.  Additionally, a parameter on the load balancing rule and allows you to suppress a load balancing rule for the purposes of outbound connectivity, which allows the selection of specific frontends including none.

For comparison, Basic Load Balancer selects a single frontend at random and there is no ability to control which one was selected.

Review a [detailed discussion of Outbound Connections](load-balancer-outbound-connections.md).

### <a name ="outboundconnections"></a>Outbound connections

Load Balancer Standard provides outbound connections for VMs that are inside the virtual network when a load balancer uses port-masquerading SNAT. The port-masquerading SNAT algorithm provides increased robustness and scale.

When a public Load Balancer resource is associated with VM instances, each outbound connection source is rewritten. The source is rewritten from the virtual network private IP address space to the front-end Public IP address of the load balancer.

When outbound connections are used with a zone-redundant front-end, the connections are also zone-redundant and SNAT port allocations survive zone failure.

The new algorithm in Load Balancer Standard preallocates SNAT ports to the NIC of each VM. When a NIC is added to the pool, the SNAT ports are preallocated based on the pool size. The following table shows the port preallocations for six tiers of back-end pool sizes:

| Pool size (VM instances) | Preallocated number of SNAT ports |
| --- | --- |
| 1 - 50 | 1024 |
| 51 - 100 | 512 |
| 101 - 200 | 256 |
| 201 - 400 | 128 |
| 401 - 800 | 64 |
| 801 - 1,000 | 32 |

SNAT ports don't directly translate to the number of outbound connections. A SNAT port can be reused for multiple unique destinations. For details, review the [Outbound connections](load-balancer-outbound-connections.md) article.

If the back-end pool size increases and transitions into a higher tier, half of your allocated ports are reclaimed. Connections that are associated with a reclaimed port timeout and must be reestablished. New connection attempts succeed immediately. If the back-end pool size decreases and transitions into a lower tier, the number of available SNAT ports increases. In this case, existing connections are not affected.

Load Balancer Standard has an additional configuration option that can be used on a per-rule basis. You can control which front-end is used for port-masquerading SNAT when multiple front-ends are available.

When only Load Balancer Standard serves VM instances, outbound SNAT connections aren't available. You can restore this ability explicitly by also assigning the VM instances to a public load balancer. You can also directly assign Public IPs as instance-level Public IPs to each VM instance. This configuration option might be required for some operating system and application scenarios. 

### Port forwarding

Basic and Standard Load Balancers provide the ability to configure inbound NAT rules to map a front-end port to an individual back-end instance. By configuring these rules, you can expose Remote Desktop Protocol endpoints and SSH endpoints, or perform other application scenarios.

Load Balancer Standard continues to provide port-forwarding ability through inbound NAT rules. When used with zone-redundant front-ends, inbound NAT rules become zone-redundant and survive zone failure.

### Multiple front-ends

Configure multiple front-ends for design flexibility when applications require multiple individual IP addresses to be exposed, such as TLS websites or SQL AlwaysOn Availability Group endpoints. 

Load Balancer Standard continues to provide multiple front-ends where you need to expose a specific application endpoint on a unique IP address.

For more information about configuring multiple front-end IPs, see [Multiple IP configuration](load-balancer-multivip-overview.md).

## <a name = "sku"></a>About SKUs

SKUs are only available in the Azure Resource Manager deployment model. This preview introduces two SKUs for Load Balancer and Public IP resources: Basic and Standard. The SKUs differ in abilities, performance characteristics, limitations, and some intrinsic behavior. Virtual machines can be used with either SKU. For both Load Balancer and Public IP resources, SKUs remain optional attributes. When SKUs are omitted in a scenario definition, the configuration defaults to using the Basic SKU.

>[!IMPORTANT]
>The SKU of a resource is not mutable. You may not change the SKU of an existing resource.  

### Load Balancer

The [existing Load Balancer resource](load-balancer-overview.md) becomes the Basic SKU and remains generally available and unchanged.

Load Balancer Standard SKU is new and currently in preview. The August 1, 2017, API version for Microsoft.Network/loadBalancers adds the **sku** property to the resource definition:

```json
            "apiVersion": "2017-08-01",
            "type": "Microsoft.Network/loadBalancers",
            "name": "load_balancer_standard",
            "location": "region",
            "sku":
            {
                "name": "Standard"
            },
```
Load Balancer Standard is automatically zone-resilient in regions that offer Availability Zones. If the Load Balancer has been declared zonal, then it is not automatically zone-resilient.

### Public IP

The [existing Public IP resource](../virtual-network/virtual-network-ip-addresses-overview-arm.md) becomes the Basic SKU and remains generally available with all of its abilities, performance characteristics, and limitations.

Public IP Standard SKU is new and currently in preview. The August 1, 2017, API version for Microsoft.Network/publicIPAddresses adds the **sku** property to the resource definition:

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

Unlike Public IP Basic, which offers multiple allocation methods, Public IP Standard always uses static allocation.

Public IP Standard is automatically zone-resilient in regions that offer Availability Zones. If the Public IP has been declared zonal, then it is not automatically zone-resilient. A zonal Public IP can't be changed from one zone to another.

## Migration between SKUs

SKUs are not mutable. Follow the steps in this section to move from one resource SKU to another.

### Migrate from Basic to Standard SKU

1. Create a new Standard resource (Load Balancer and Public IPs, as needed). Recreate your rules and probe definitions.

2. Create new or update existing NSG on NIC or subnet to whitelist load balanced traffic, probe, as well as any other traffic you wish to permit.

3. Remove the Basic SKU resources (Load Balancer and Public IPs, as applicable) from all VM instances. Be sure to also remove all VM instances of an availability set.

4. Attach all VM instances to the new Standard SKU resources.

### Migrate from Standard to Basic SKU

1. Create a new Basic resource (Load Balancer and Public IPs, as needed). Recreate your rules and probe definitions. 

2. Remove the Standard SKU resources (Load Balancer and Public IPs, as applicable) from all VM instances. Be sure to also remove all VM instances of an availability set.

3. Attach all VM instances to the new Basic SKU resources.

>[!IMPORTANT]
>
>There are limitations regarding use of the Basic and Standard SKUs.
>
>HA Ports and Diagnostics of the Standard SKU are only available in the Standard SKU. You can't migrate from the Standard SKU to the Basic SKU and also retain these features.
>
>Matching SKUs must be used for Load Balancer and Public IP resources. You can't have a mixture of Basic SKU resources and Standard SKU resources. You can't attach a VM, VMs in an Availability Set, or a virtual machine scale set to both SKUS simultaneously.
>

## Region availability

Load Balancer Standard is currently available in all public cloud regions except West US.

## SKU service limits and abilities

Azure [Service Limits for Networking](https://docs.microsoft.com/azure/azure-subscription-service-limits#networking-limits) apply per region per subscription. 

The following table compares the limits and abilities of the Load Balancer Basic and Standard SKUs:

| Load Balancer | Basic | Standard |
| --- | --- | --- |
| Back-end pool size | up to 100 | up to 1,000 |
| Back-end pool boundary | Availability Set | virtual network, region |
| Back-end pool design | VMs in Availability Set, virtual machine scale set in Availability Set | Any VM instance in the virtual network |
| HA Ports | Not supported | Available |
| Diagnostics | Limited, public only | Available |
| VIP Availability  | Not supported | Available |
| Fast IP Mobility | Not supported | Available |
|Availability Zones scenarios | Zonal only | Zonal, Zone-redundant, Cross-zone load-balancing |
| Outbound SNAT algorithm | On-demand | Preallocated |
| Outbound SNAT front-end selection | Not configurable, multiple candidates | Optional configuration to reduce candidates |
| Network Security Group | Optional on NIC/subnet | Required |

The following table compares the limits and abilities of the Public IP Basic and Standard SKUs:

| Public IP | Basic | Standard |
| --- | --- | --- |
| Availability Zones scenarios | Zonal only | Zone-redundant (default), zonal (optional) | 
| Fast IP Mobility | Not supported | Available |
| VIP Availability | Not supported | Available |
| Counters | Not supported | Available |
| Network Security Group | Optional on NIC | Required |
 
## Pricing

Load Balancer Standard SKU billing is based on configured rules and processed data. No charges are incurred during the preview period. For more information, review the [Load Balancer](https://aka.ms/lbpreviewpricing) and [Public IP](https://aka.ms/lbpreviewpippricing) pricing pages.

Customers continue to enjoy Load Balancer Basic SKU at no charge.

## Limitations

The following limitations apply at the time of preview and are subject to change:

- Load Balancer back-end instances cannot be located in peered virtual networks at this time. All back-end instances must be in the same region.
- SKUs are not mutable. You may not change the SKU of an existing resource.
- Both SKUs can be used with a standalone VM, VM instances in an Availability Set, or a virtual machine scale set. VM combinations may not be used with both SKUs simultaneously. A configuration that contains a mixture of SKUs is not permitted.
- Using an internal Load Balancer Standard with a VM instance (or any part of an Availability Set) disables [default SNAT outbound connections](load-balancer-outbound-connections.md#defaultsnat). You can restore this ability to a standalone VM, VM instances in an Availability Set, or a virtual machine scale set. You can also restore the ability to make outbound connections. To restore these abilities, simultaneously assign a public Load Balancer Standard, or Public IP Standard as an instance-level Public IP, to the same VM instance. After the assignment is complete, port-masquerading SNAT to a Public IP address is provided again.
- VM instances may need to be grouped into availability sets to achieve full back-end pool scale. Up to 150 availability sets and standalone VMs and virtual machine scale sets combined can be placed into a single back-end pool.
- IPv6 is not supported.
- In the context of Availability Zones, a front-end is not mutable from zonal to zone-redundant, or vice versa. After a front-end is created as zone-redundant, it remains zone-redundant. After a front-end is created as zonal, it remains zonal.
- In the context of Availability Zones, a zonal Public IP address cannot be moved from one zone to another.
- [Azure Monitor Alerts](../monitoring-and-diagnostics/monitoring-overview-alerts.md) are not supported at this time.
- Portal does not yet support the expanded preview regions.  Please use client tools like templates, Azure CLI 2.0 or PowerShell as a workaround.
- [Move subscription operations](../azure-resource-manager/resource-group-move-resources.md) are not supported for Standard SKU LB and PIP resources.
- Not available in West US.


## Next steps

- Learn more about [Load Balancer Basic](load-balancer-overview.md).
- Learn more about [Availability Zones](../availability-zones/az-overview.md).
- Learn more about [Network Security Groups](../virtual-network/virtual-networks-nsg.md).
- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) in Azure.
- Learn about [metrics exposed](../monitoring-and-diagnostics/monitoring-supported-metrics.md#microsoftnetworkloadbalancers) in [Azure Monitor](../monitoring-and-diagnostics/monitoring-overview.md).

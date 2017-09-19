---
title: Azure Standard Load Balancer overview | Microsoft Docs
description: Overview of Azure Standard Load Balancer features
services: load-balancer
documentationcenter: na
author: kumudd
manager: timlt
editor: ''

ms.assetid: 
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: kumud
---

# Azure Load Balancer Standard (Preview)

The Azure Load Balancer Standard SKU and Public IP Standard SKU together enable you to build highly scalable and reliable architectures.  Applications using Load Balancer enjoy low latency, high throughput, and up to millions of flows for all TCP and UDP applications. Load Balancer fully onboards to the VNet and can now be used with any Virtual Machine instance within a Virtual Network. Diagnostics insights allow you to understand, manage, and troubleshoot this vital component of your virtual data center. Use Azure Monitor to show data path health from frontend to VM, per endpoint health probes, and traffic counters. Network Security Groups are now mandatory for any VM instance associated with a Standard SKU Load Balancer or Public IP.  And you can use Load Balancer Standard with Availability Zones to construct zone-redundant, zonal architectures with cross-zone load balancing and no dependency on DNS records.

Load Balancer Standard can be used in a public or internal configuration and continues to support the following fundamental scenarios:

- Load Balance inbound traffic to healthy backend instance
- Port forward inbound traffic to a single backend instance
- Translate outbound traffic from a private IP address within the VNet to a public IP address

> [!IMPORTANT]
> Load Balancer Standard SKU is currently in Preview.  Use the Generally Available [Load Balancer Basic SKU](load-balancer-overview.md) for your production services.

For these scenarios, the following capabilities are supported. Click the capability for more details:

**[Enterprise Scale](#enterprisescale):** Scale and resiliency by design is the foundation of this platform.  Build your virtual data center and use Load Balancer Standard for any TCP or UDP application scenario in your VNet.  You may use standalone VM instances or up to 1000 instance virtual machine scale sets in a backend pool. Your application enjoys low forwarding latency, high throughput performance, and scale to millions of flows on a fully managed infrastructure platform.

**[High Reliability](#highavailability)**: Configure load balancing rules to make your application scale and be highly reliable.  Rules can be constructed for individual ports or you can use HA Ports to balance all traffic irrespective of TCP or UDP port.  You may use HA Ports to provide redundancy internal Network Virtual Appliances and many other scenarios where many individual rules are impractical. And your health probe configurations protect your service by forwarding traffic only to healthy instances.

**[Diagnostic insights](#diagnosticinsights)**: Load Balancer and Public IPs are now exposing new multi-dimensional metrics, integrated with Azure Monitor. Your virtual data center now has continuous data plane health measurements, per endpoint health probe statistics, counters for inbound connection attempts, outbound connections, packets, and bytes.

**[Mandatory Network Security Groups](#mandatorynsg)**: Load Balancer Standard fully onboards to the VNet and NSG are now mandatory. NSG needs to be placed on subnets or NICs on the backend pool and explicitly whitelist traffic.

**[Outbound Connections](#outboundconnections)**: When a public Load Balancer resource is associated with VM instances, the [outbound connections](load-balancer-outbound-connections.md) from the private IP address space of the VNet are translated to the public IP address of the Load Balancer frontend.  Load Balancer Standard features a new port masquerading Source Network Address Translation (SNAT) algorithm for increased robustness and scale.

**[Availability Zones](#availabilityzones)**: In a region where Availability Zones are supported, you can chose whether Load Balancer should provide a zone-redundant or zonal data path for each of your applications without the need to rely on DNS records for resiliency.

**[Port forwarding](#portforwarding)**: Basic and Standard Load Balancers provide the ability to configure inbound NAT rules to map a frontend port to an individual backend instance.  There are many uses for this ability including exposing Remote Desktop Protocol endpoints, SSH endpoints, or a variety of other application scenarios.

**[Multiple frontends](#multiplefrontends)**: Configure multiple frontends for design flexibility where applications require multiple individual IP addresses to be exposed (such as TLS websites or SQL AlwaysOn Availability Group endpoints).  More details can be found [here](load-balancer-outbound-connections.md).

## <a name = "enterprisescale"></a>Enterprise Scale
Load Balancer Standard can forward traffic to any VM in a VNet. This includes any combination of
- standalone VMs without Availability Sets
- standalone VMs with Availability Sets
- Virtual machine scale sets (virtual machine scale set) up to 1000 instances
- multiple virtual machine scale sets
- blending VMs and virtual machine scale sets.

Load Balancer Standard supports up to 1000 instances in the backend pool.

Availability Sets can continue to be used, but they no longer restrict the participation in the Load Balancer backend pool.

## <a name = "highreliability"></a>High Reliability

Load Balancer Standard continues to provide load balancing rules also available in Basic.  

We have also added a new HA Ports feature to unlock a variety of scenarios including high availability and scale for internal Network Virtual Appliance scenario it is impractical or undesirable to specify individual ports.  You may use the ability for any scenario where an application needs load balancing for a large number of frontend ports.

Network Virtual Appliance vendors can provide fully vendor supported, resilient scenarios using this feature and remove a single point of failure for their customers.  A single instance is no longer a limitation, you may scale to two or more instances.

Feature is currently available for internal Load Balancer Standard configurations and described in more detail [here](https://aka.ms/haports).

## <a name = "outboundconnections"></a>Outbound Connections

Load Balancer Standard provides [outbound connections](load-balancer-outbound-connections.md) for VMs inside the VNet when associated with a Load Balancer.  Load Balancer provides port masquerading Source Network Address Translation (SNAT).

Load Balancer Standard uses a new algorithm, which preallocates SNAT ports to each VM's network interfaces when they are added to the pool.  The new algorithm provides greater scale and robustness for outbound connections.  And we provide a diagnostic metric to allow you to observe the number of SNAT connections created.

| Backend pool size | Preallocated SNAT ports |
| --- | --- |
| 1-50 | 1024 |
| 51-100 | 512 |
| 101-200 | 256 |
| 201-400 | 128 |
| 401-800 | 64 |
| 801-1000 | 32 |

SNAT ports do not directly translate to the number of connections. A SNAT port can be reused for multiple unique destinations.  Review the [outbound connections](load-balancer-outbound-connections.md) article for details.

If your backend pool grows from one tier to the next, half of your allocated ports will be reclaimed. Any connection associated with a reclaimed port will timeout and need to be reestablished.  If your backend pool shrinks, ports available grow and existing connections are not affected.

Load Balancer Standard also has an additional configuration option on a per rule basis to provide customer control over which frontend is used for port masquerading SNAT when multiple frontends are available.

## <a name = "diagnosticinsights"></a>Diagnostic Insights

Load Balancer Standard provides new multi-dimensional diagnostic capabilities for public and internal Load Balancer configuration.  These metrics are provided through Azure Monitor and enjoy all related capabilities including ability for integration with various downstream consumers.

| Metric | Description |
| --- | --- |
| VIP Availability | Azure Load Balancer continuously exercises the data path from within a region to the Load Balancer frontend and finally the SDN stack supporting your VM.  As long as healthy instances remain, the measurement follows the same path as your applications load balanced traffic. The measurement is invisible to your application and does not interfere. |
| DIP Availability | Azure Load Balancer uses a distributed health probing service that monitors your application endpoint's health according to what you have configured.  This metric provides an aggregate or per endpoint filtered view of each individual endpoint in the Load Balancer pool |
| SYN packets | Azure Load Balancer does not terminate TCP connections or interact with TCP or UDP packet flows.  To troubleshoot your scenario, it can be useful to understand how many TCP connection attempts are made.  This metric reports the number of TCP SYN packets, which were received and may reflect clients attempting to establish connections to your service. |
| SNAT connections | Azure Load Balancer reports the number of outbound connections masqueraded to the public IP address frontend. |
| Byte counters | Azure Load Balancer reports the data processed per frontend and per backend instance.|
| Packet counters | Azure Load Balancer reports the packets processed per frontend and per backend instance. |

## <a name = "mandatorynsg"></a>Mandatory Network Security Groups

Load Balancer Standard fully onboards to the VNet and use of Network Security Groups is now mandatory.  Explicitly whitelist the traffic you wish to permit inside the NSG.

Review this article for more background on [Network Security Groups](../virtual-network/virtual-networks-nsg.md).

NSG allows whitelisting of flows and allows configurations where customers are in full control of when to permit traffic to their deployment through NSG instead of when other configurations are completed: For example, you can stage your environment and apply or change an NSG to take the scenario live.

## <a name = "availabilityzones"></a>Availability Zones

Availability Zones are currently in Preview in specific regions and require additional opt-in.

Load Balancer Standard provides abilities for constructing Availability Zone scenarios with zonal or zone-redundant options and cross-zone load balancing.

With public or internal Load Balancer and Availability Zones, your frontend is zone-redundant by default.  If you do not specify a zone, Azure helps protect your data path from zone failure automatically. Not additional action is required. A zone-redundant frontend is served by all Availability Zones in a region simultaneously.

No DNS names are required for resiliency.  With a zone-redundant configuration, you can use a single backend subnet with your VM instances and address it with a single zone-redundant Load Balancer frontend IP address.

This zone-redundancy is available for public or internal frontends. Your Public IP address may be zone-redundant and your internal Load Balancer frontend's private IP address may be as well.

Optionally, you can also align the data path to a specific zone by defining a zonal frontend.  A zonal frontend is served by the designated single Availability Zone only and when combined with zonal VM instances, you can align resources to specific zones.

Whichever approach you decide for the frontend, you can use cross-zone load balancing for your backend.  Since VNets and subnets are never zone constrained, all you need to do is define a backend pool with your desired VM instances and the configuration is complete.

If your Public IP frontend is zone-redundant, any outbound connections made from VM instances automatically become zone-redundant and are protected from zone failure.  Your SNAT port allocation survives zone failure.

In the context of Availability Zones, a frontend is not mutable from zonal to zone-redundant or vice versa. Once created as zone-redundant, it is always zone-redundant.  Once crated as zonal, it is always zonal.

The Load Balancer Standard resource itself is always regional and zone-redundant.  And Public IP or internal Load Balancer frontend which has not be assigned a zone can be deployed in any region irrespective of Availability Zones support.  If a region gains Availability Zones later on, an already deployed Public IP or internal Load Balancer frontend becomes zone-redundant automatically.

## <a name = "portforwarding"></a>Port Forwarding

Load Balancer Standard continues to provide port forwarding ability through inbound NAT rules.

## <a name = "multiplefrontends"></a>Multiple Frontends

Load Balancer Standard continues to provide multiple frontend where it is desirable to expose a specific application endpoint on a unique IP address.

 More details can be found [here](load-balancer-outbound-connections.md).

## SKUs

SKUs are only available in Azure Resource Manager deployment model.  This preview introduces two SKUs (Basic and Standard) for Load Balancer and Public IP resources.  The SKUs differ in abilities, performance characteristics, limitations, and some intrinsic behaviors.

Virtual Machines can be used with either SKU.

For both Load Balancer and Public IP resources, SKUs remain optional attributes and when omitted default to Basic.

The SKUs are not mutable.  You may not change the SKU of an existing resource.

Matching SKUs must be used for Load Balancer and Public IP resources.  It is not possible to mix Basic & Standard SKU resources or attach a VM, VMs in an Availability Set, or virtual machine scale set to both simultaneously.

### Load Balancer

The [existing Load Balancer resource](load-balancer-overview.md) becomes the Basic SKU and remains Generally Available and unchanged.

Load Balancer Standard SKU is a new offer and currently in Preview.

The 2017-08-01 API version for Microsoft.Network/loadBalancers introduces SKUs to the resource.

```json
            "apiVersion": "2017-08-01",
            "type": "Microsoft.Network/loadBalancers",
            "name": "public_ip_standard",
            "location": "region",
            "sku":
            {
                "name": "Standard"
            },
            [..]
```

### Public IP

The [existing Public IP resource](../virtual-network/virtual-network-ip-addresses-overview-arm.md) becomes the Basic SKU and remains Generally Available with all its abilities, performance characteristcs, and limitations.

Public IP Standard SKU is a new offer and currently in Preview.

The 2017-08-01 API version for Microsoft.Network/publicIPAddresses resources introduces SKUs.

```json
            "apiVersion": "2017-08-01",
            "type": "Microsoft.Network/publicIPAddresses",
            "name": "public_ip_standard",
            "location": "region",
            "sku":
            {
                "name": "Standard"
            },
            [..]
```

Unlike Public IP Basic which offers multiple allocation methods, Public IP Standard is always Static allocation.

When used in a region that also offers Availability Zones, Public IP Standard is automatically zone resilient unless it has been declared to be zonal.

## Region Availability

Load Balancer Standard is currently available in these regions:

| Region |
| --- |
 East US 2 |
| Central US |
| North Europe |
| West Central US |
| West Europe |
| Southeast Asia |

## Service Limits & Abilities Comparison

Azure [Service Limits for Networking](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits#networking-limits) apply per region per subscription. 

Comparison of Load Balancer limits / abilities:

| Load Balancer | Basic | Standard |
| --- | --- | --- |
| Backend pool size | up to 100 | up to 1000 |
| Backend pool boundary | Availability Set | VNet, region |
| Backend pool design | VMs in Availability Set or virtual machine scale set in Availability Set | Any VM instance in VNet |
| HA Ports | Not supported | Available |
| Diagnostics | Limited, public only | Available |
| Availability Zones Scenarios | Zonal only | Zonal, Zone-redundant, Cross-zone Load Balancing |
| Frontend Selection for SNAT | Not configurable, multiple Candidates | Optional explicit configuration |
| Backend Network Security Group | Optional on NIC/subnet | Required |

Comparison of Public IP limits / abilities:

| Public IP | Basic | Standard |
| --- | --- | --- |
| Availability Zones Scenarios | Zonal only | Zone-redundant (default), zonal (optional) | 
| Fast IP Mobility | Not supported | Available |
| Counters | Not supported | Available |
| ILPIP Network Security Group | Optional | Required |


## Preview Sign-up

To participate in the Preview for Load Balancer Standard SKU and its companion Public IP Standard SKU, register your subscription to gain access.

- PowerShell

```powershell
Register-AzureRmProviderFeature -FeatureName AllowLBPreview -ProviderNamespace Microsoft.Network
```

- Azure CLI 2.0

```cli
az feature register --name AllowLBPreview --namespace Microsoft.Network
```

Note: If you wish to use Availability Zones with Load Balancer and Public IP, you need to register your subscription for the Availability Zones Preview as well.

## Pricing

Load Balancer Standard SKU is billed based on rules configured and data processed.  No charges are incurred during the Preview period.  Review the [Load Balancer](https://aka.ms/lbpreviewpricing) and [Public IP](https://aka.ms/lbpreviewpippricing) pricing pages for more information.

Customers continue to enjoy Load Balancer Basic SKU at no charge.

## Limitations

- Load Balancer backend instances cannot be in peered VNets at this time.
- You can use either Basic SKU or Standard SKU with a standalone VM, all VM instances in an Availability Set or VMSS. A standalone VM, all VM instances in an Availability Set or VMSS may not be used with both simultaneously.
- Using an internal Standard Load Balancer with a VM instance (or any part of an Availability Set) disables [default SNAT outbound connections](load-balancer-outbound-connections.md).  You may restore this ability to a standalone VM or VM instances Availability Set or VMSS and make outbound connections by simultaneously assigning a public Standard Load Balancer or Standard Public IP as Instance-Level Public IP to the same VM instance. Once completed, port masquerading SNAT to a Public IP address is provided again.

## Next steps

- Learn more about the [Basic Load Balancer](load-balancer-overview.md) 

- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) of Azure


---
title: Azure Standard Load Balancer overview | Microsoft Docs
description: Overview of Azure Standard Load Balancer features
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
ms.date: 09/21/2017
ms.author: kumud
---

# Azure Load Balancer Standard overview

The Azure Load Balancer Standard SKU and Public IP Standard SKU together enable you to build highly scalable and reliable architectures.  Applications using Load Balancer Standard can take advantage of new capabilities in addition to low latency, high throughput, and scale for millions of flows for all TCP and UDP applications.

>[!NOTE]
> Load Balancer Standard SKU is currently in Preview. During preview, the feature may not have the same level of availability and reliability as features that are in general availability release. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Use the Generally Available [Load Balancer Basic SKU](load-balancer-overview.md) for your production services.

## Why use Load Balancer Standard

Use Load Balancer Standard for the full range of virtual data centers from small scale deployments to large and complex multi-zone architectures to take advantage of its following capabilities:

- [Enterprise scale](#enterprisescale) can be achieved with Load Balancer Standard.  It can be used with any Virtual Machine instance within a Virtual Network, and up to 1000 VM instances.

- [New diagnostic insights](#diagnosticinsights) are available to allow you to understand, manage, and troubleshoot this vital component of your virtual data center. Use Azure Monitor (Preview) to show, filter, and group new multi-dimensional metrics for continuous data path health measurements from frontend to VM, per endpoint health probes, TCP connection attempts, outbound connections.

- [Network Security Groups](#nsg) are now required for any VM instance associated with Standard SKUs of Load Balancer or Public IP and provides enhanced security.

- [HA Ports provide high reliability](#highreliability) and scale for Network Virtual Appliances and other application scenarios. HA Ports load balance all ports on an internal Load Balancer frontend to a pool of VM instances.

- [Outbound connections](#outboundconnections) now use a new SNAT port allocation model that provides greater resiliency and scale.

- [Load Balancer Standard with Availability Zones](#availabilityzones) can be used to construct zone-redundant and zonal architectures, both with cross-zone load balancing. You can achieve zone-redundancy without dependency on DNS records: a single IP address is simply zone-redundant by default and can reach any VM in a VNet of a region across all Availability Zones.


You can use Load Balancer Standard either in a public or internal configuration that continue to support the following fundamental scenarios:

- load balance inbound traffic to healthy backend instances.
- port forward inbound traffic to a single backend instance.
- translate outbound traffic from a private IP address within the VNet to a public IP address.

### <a name = "enterprisescale"></a>Enterprise scale

 Use Load Balancer Standard in designing your high-performance virtual data center. You can use standalone VM instances or up to 1000 instance virtual machine scale sets in a backend pool, and support any TCP or UDP application. With Load Balancer Standard, your application can still take advantage of the low forwarding latency, high throughput performance, and scale to millions of flows on a fully managed Azure service.
 
Load Balancer Standard can forward traffic to any VM instance in a VNet in a region. Backend pool sizes can be up to 1000 instances with any combination of:

- standalone VMs without Availability Sets
- standalone VMs with Availability Sets
- Virtual machine scale sets (virtual machine scale set) with up to 1000 instances
- multiple virtual machine scale sets
- blending VMs and virtual machine scale sets.

There no longer is a requirement for availability sets, but you may choose to use availability sets for other benefits provided by them.

### <a name = "diagnosticinsights"></a>Diagnostic insights

Load Balancer Standard provides new multi-dimensional diagnostic capabilities for public and internal Load Balancer configurations. These new metrics are provided through Azure Monitor (Preview) and utilize all related capabilities including ability for integration with various downstream consumers.

| Metric | Description |
| --- | --- |
| VIP Availability | Load Balancer Standard continuously exercises the data path from within a region to the Load Balancer frontend and finally to the SDN stack supporting your VM. As long as healthy instances remain, the measurement follows the same path as your applications load balanced traffic, and validates the data path that your customers may be using. The measurement is invisible to your application and does not interfere.|
| DIP Availability | Load Balancer Standard uses a distributed health probing service that monitors your application endpoint's health according to what you have configured.  This metric provides an aggregate or per endpoint filtered view of each individual instance endpoint in the Load Balancer pool.  You can see how Load Balancer views the health of your application as indicated by your health probe configuration.
| SYN packets | Load Balancer Standard does not terminate TCP connections or interact with TCP or UDP packet flows; flows and their handshakes are always between the source and the VM instance. To better troubleshoot all your TCP protocol scenarios, you can make use of this metric to understand how many TCP connection attempts are made. This metric reports the number of TCP SYN packets, which were received and may reflect clients attempting to establish connections to your service.|
| SNAT connections | Load Balancer Standard reports the number of outbound connections masqueraded to the public IP address frontend.  SNAT ports are an exhaustible resource and this metric can give an indication of how heavily your application is relying on SNAT for outbound originated connections.|
| Byte counters | Azure Load Balancer reports the data processed per frontend.|
| Packet counters | Azure Load Balancer reports the packets processed per frontend.|

### <a name = "highreliability"></a>High reliability

Configure load balancing rules to make your application scale and be highly reliable.  You can configure rules for individual ports or you can use new HA Ports to balance all traffic irrespective of TCP or UDP port number.  

You can use the new HA Ports feature to unlock a variety of scenarios including high availability and scale for internal Network Virtual Appliances and other scenarios where it is impractical or undesirable to specify individual ports. HA Ports provides redundancy and scale by allowing as many instances as you need rather than being restricted to active / passive scenarios. Your health probe configurations protect your service by forwarding traffic only to healthy instances.

Network Virtual Appliance vendors can provide fully vendor supported, resilient scenarios by removing a single point of failure for their customers and allowing for multiple active instances for scale. You may scale to two or more instances if your appliance permits such configurations. Your Network Virtual Appliance vendor needs to provide further guidance for these scenarios.

### <a name = "availabilityzones"></a>Availability zones

[!INCLUDE [availability-zones-preview-statement](../../includes/availability-zones-preview-statement.md)]

Advance your application's resiliency with the use of Availability Zones in supported regions. Availability Zones are currently in Preview in specific regions and require additional opt-in.

### Automatic zone-redundancy

You can choose whether Load Balancer should provide a zone-redundant or zonal frontend for each of your applications.  It is easy to create zone-redundancy with Load Balancer Standard.  A single frontend IP address is automatically zone-redundant.  A zone-redundant frontend is served by all Availability Zones in a region simultaneously. This creates a zone-redundant data path for inbound and outbound connections. Zone-redundancy in Azure does not require multiple IP addresses and DNS records. 

This zone-redundancy is available for public or internal frontends. Your Public IP address as well as your internal Load Balancer frontend's private IP can be zone-redundant.

Create a zone-redundant Public IP address with the following (add "sku" to any existing Resource Manager template):

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

Create an internal Load Balancer zone-redundant frontend IP configuration with the following (add "sku" to any existing Resource Manager template):

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

If your Public IP frontend is zone-redundant, any outbound connections made from VM instances automatically become zone-redundant and are protected from zone failure.  Your SNAT port allocation survives zone failure.

#### Cross-zone load balancing

Cross-zone load balancing is available within a region for the backend pool, allowing maximum flexibility for your Virtual Machine instances.  A frontend can deliver flows to any VM in the VNet irrespective of the Availability Zone of the VM instance.

Additionally, you may also choose to specify a specific zone for your frontend and backend instances to align your data path and resources with a specific zone.

Since VNets and subnets are never zone constrained, all you need to do is define a backend pool with your desired VM instances and the configuration is complete.

#### Zonal deployments

Optionally, you can also align the frontend to a specific zone by defining a zonal frontend.  A zonal frontend is served by the designated single Availability Zone only and when combined with zonal VM instances, you can align resources to specific zones.

Create a zonal Public IP address in Availability Zone 1 with the following (add "zones" and "sku" to any existing Resource Manager template):

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

Create an internal Load Balancer frontend into Availability Zone 1 with the following (add "sku" to any existing Resource Manager template and place "zones" into the frontend IP configuration child resource):

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

In addition, you can use cross-zone load balancing for your backend by placing your VM instances in a VNet into a backend pool.

The Load Balancer Standard resource itself is always regional and zone-redundant where Availability Zones are supported. A Public IP address or internal Load Balancer frontend that has not been assigned a zone, can be deployed in any region irrespective of Availability Zones support. If a region gains Availability Zones later on, an already deployed Public IP or internal Load Balancer frontend becomes zone-redundant automatically. Zone-redundant data path does not imply 0% packet loss.

### <a name = "nsg"></a>Network security groups

Load Balancer Standard and Public IP Standard fully onboards to the VNet and Network Security Groups (NSG) are now required. NSG allows whitelisting of flows and allows configurations where customers are in full control of when to permit traffic to their deployment through NSG instead of when other configurations are completed.

Associate an NSG with subnets or with NICs of VM instances in the backend pool.  This applies to Load Balancer Standard and Public IP Standard when used as Instance-Level Public IP. You must explicitly whitelist which traffic you want to permit with the NSG in order for it to flow.

To learn more about network security groups and how to apply them for your scenario, see [Network Security Groups](../virtual-network/virtual-networks-nsg.md).

### <a name ="outboundconnections"></a>Outbound connections

 Load Balancer Standard provides outbound connections for VMs inside the VNet when associated with a Load Balance using port masquerading Source Network Address Translation (SNAT).

When a public Load Balancer resource is associated with VM instances, the source of each outbound connection is rewritten from the private IP address space of the VNet to the public IP address of the Load Balancer frontend.  Load Balancer Standard uses a new port masquerading Source Network Address Translation (SNAT) algorithm for increased robustness and scale.  

Additionally, when used with a zone-redundant frontend, outbound connections are also zone-redundant and SNAT port allocations survive zone failure.

Load Balancer Standard's new algorithm preallocates SNAT ports to each VM's network interface at the time they are added to the pool according to the following tiers:

| Backend pool size | Preallocated SNAT ports |
| --- | --- |
| 1-50 | 1024 |
| 51-100 | 512 |
| 101-200 | 256 |
| 201-400 | 128 |
| 401-800 | 64 |
| 801-1000 | 32 |

SNAT ports do not directly translate to the number of connections. A SNAT port can be reused for multiple unique destinations.  Review the [outbound connections](load-balancer-outbound-connections.md) article for details.

If your backend pool is increased and transitions from one size tier to the next larger size, half of your allocated ports are reclaimed. Any connection that is associated with a reclaimed port will timeout and will need to be reestablished. Any new connection attempts will succeed immediately. If your backend pool is reduced from one size tier to the next smaller size, SNAT ports available grow, and existing connections are not affected.

Load Balancer Standard also has an additional configuration option on a per rule basis to provide customer control over which frontend is used for port masquerading SNAT when multiple frontends are available.

Lastly, when only Load Balancer Standard serves VM instances, outbound SNAT connections are not available. You can restore this ability explicitly by also assigning the VM instances to a public Load Balancer or also assigning Public IP's as Instance-Level Public IP's directly to each VM instance. This may be required for some operating system and application scenarios. 

### Port forwarding

 Basic and Standard Load Balancers provide the ability to configure inbound NAT rules to map a frontend port to an individual backend instance.  There are many uses for this ability including exposing Remote Desktop Protocol endpoints, SSH endpoints, or a variety of other application scenarios.

Load Balancer Standard continues to provide port forwarding ability through inbound NAT rules.  When used with zone-redundant frontends, inbound NAT rules become zone-redundant and will survive zone failure.

### Multiple frontends

Configure multiple frontends for design flexibility where applications require multiple individual IP addresses to be exposed (such as TLS websites or SQL AlwaysOn Availability Group endpoints).  More details can be found [here](load-balancer-multivip-overview.md).

Load Balancer Standard continues to provide multiple frontends where it is desirable to expose a specific application endpoint on a unique IP address.

 More details can be found [here](load-balancer-multivip-overview.md).

## <a name = "sku"></a>About SKUs

SKUs are only available in Azure Resource Manager deployment model.  This preview introduces two SKUs (Basic and Standard) for Load Balancer and Public IP resources.  The SKUs differ in abilities, performance characteristics, limitations, and some intrinsic behaviors. Virtual Machines can be used with either SKU. For both Load Balancer and Public IP resources, SKUs remain optional attributes and when omitted default to Basic.

>[!IMPORTANT]
>The SKU of a resource is not mutable.  You may not change the SKU of an existing resource.  

### Load Balancer

The [existing Load Balancer resource](load-balancer-overview.md) becomes the Basic SKU and remains Generally Available and unchanged.

Load Balancer Standard SKU is a new offer and currently in Preview. The 2017-08-01 API version for Microsoft.Network/loadBalancers introduces SKUs to the resource.

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
When used in a region that also offers Availability Zones, Load Balancer Standard is automatically zone resilient unless it has been declared to be zonal.

### Public IP

The [existing Public IP resource](../virtual-network/virtual-network-ip-addresses-overview-arm.md) becomes the Basic SKU and remains Generally Available with all its abilities, performance characteristics, and limitations.

Public IP Standard SKU is a new offer and currently in Preview. The 2017-08-01 API version for Microsoft.Network/publicIPAddresses resources introduces SKUs.

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

Unlike Public IP Basic that offers multiple allocation methods, Public IP Standard is always Static allocation.

When used in a region that also offers Availability Zones, Public IP Standard is automatically zone resilient unless it has been declared to be zonal.

## Migration between SKUs

If you wish to move from one resource SKU to the other, follow these steps:

### Migrating from Basic to Standard SKU

1. Create a new Standard resource (Load Balancer and Public IPs as needed), and recreate your rules and probe definitions.
2. Remove Basic SKU resources (Public IP and LB) from all VM instances (this includes all instances of an availability set).
3. Attach all VM instances to the new Standard SKU resources.

### Migrating from Standard to Basic SKU:

1. Create a new Basic resource (Load Balancer and Public IPs as needed), and recreate your rules and probe definitions. 
2. Remove Standard SKU resources (Public IP and LB) from all VM instances (this includes all instances of an availability set).
3. Attach all VM instances to the new Basic SKU resources.

  >[!NOTE]
  >HA Ports, Diagnostics of the Standard SKU is only available in Standard SKU. You cannot migrate from Standard to Basic and retain this functionality.

Matching SKUs must be used for Load Balancer and Public IP resources.  It is not possible to mix Basic & Standard SKU resources or attach a VM, VMs in an Availability Set, or virtual machine scale set to both simultaneously.

## Region availability

Load Balancer Standard is currently available in these regions:
- East US 2
- Central US
- North Europe
- West Central US
- West Europe
- Southeast Asia

## Service limits & abilities comparison

Azure [Service Limits for Networking](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits#networking-limits) apply per region per subscription. 

The following table provides a comparison of limits and abilities between the Basic and Standard SKUs for Load Balancer:

| Load Balancer | Basic | Standard |
| --- | --- | --- |
| Backend pool size | up to 100 | up to 1000 |
| Backend pool boundary | Availability Set | VNet, region |
| Backend pool design | VMs in Availability Set or virtual machine scale set in Availability Set | Any VM instance in VNet |
| HA Ports | Not supported | Available |
| Diagnostics | Limited, public only | Available |
| VIP Availability  | Not supported | Available |
| Fast IP Mobility | Not supported | Available |
|Availability Zones Scenarios | Zonal only | Zonal, Zone-redundant, Cross-zone Load Balancing |
| Outbound SNAT algorithm | On-demand | Preallocated |
| Outbound SNAT Frontend Selection | Not configurable, multiple Candidates | Optional configuration to reduce candidates |
| Network Security Group | Optional on NIC/subnet | Required |

The following table provides a comparison of limits and abilities between the Basic and Standard SKUs for Public IP:

| Public IP | Basic | Standard |
| --- | --- | --- |
| Availability Zones Scenarios | Zonal only | Zone-redundant (default), zonal (optional) | 
| Fast IP Mobility | Not supported | Available |
| VIP Availability | Not supported | Available |
| Counters | Not supported | Available |
| Network Security Group | Optional on NIC | Required |


## Preview sign-up

To participate in the Preview for Load Balancer Standard SKU and its companion Public IP Standard SKU, register your subscription to gain access using either PowerShell or Azure CLI 2.0.

- Sign up using PowerShell

    ```powershell
    Register-AzureRmProviderFeature -FeatureName AllowLBPreview -ProviderNamespace Microsoft.Network
    ```

- Sign up using Azure CLI 2.0

    ```cli
    az feature register --name AllowLBPreview --namespace Microsoft.Network
    ```

>[!NOTE]
>If you wish to use Availability Zones with Load Balancer and Public IP, you need to register your subscription for the Availability Zones Preview as well.

## Pricing

Load Balancer Standard SKU is billed based on rules configured and data processed.  No charges are incurred during the Preview period.  Review the [Load Balancer](https://aka.ms/lbpreviewpricing) and [Public IP](https://aka.ms/lbpreviewpippricing) pricing pages for more information.

Customers continue to enjoy Load Balancer Basic SKU at no charge.

## Limitations

The following limitations apply at the time of Preview and are subject to change:

- Load Balancer backend instances cannot be located in peered VNets at this time. All backend instances must be in the same region.
- SKUs are not mutable. You may not change the SKU of an existing resource.
- you can use either Basic SKU or Standard SKU with a standalone VM, all VM instances in an Availability Set or virtual machine scale set. A standalone VM, all VM instances in an Availability Set or virtual machine scale set may not be used with both simultaneously. Mixing of SKUs is not permitted.
- using an internal Load Balancer Standard with a VM instance (or any part of an Availability Set) disables [default SNAT outbound connections](load-balancer-outbound-connections.md).  You may restore this ability to a standalone VM or VM instances Availability Set or virtual machine scale set and make outbound connections by simultaneously assigning a public Load Balancer Standard or Public IP Standard as Instance-Level Public IP to the same VM instance. Once completed, port masquerading SNAT to a Public IP address is provided again.
- VM instances may need to be grouped into availability sets to achieve full backend pool scale. Up to 150 availability sets and standalone VMs can be placed into a single backend pool.
- IPv6 is not supported.
- in the context of Availability Zones, a frontend is not mutable from zonal to zone-redundant or vice versa. Once created as zone-redundant, it is always zone-redundant. Once created as zonal, it is always zonal.
- in the context of Availability Zones, a zonal Public IP address may not be moved from one zone to another.


## Next steps

- Learn more about the [Basic Load Balancer](load-balancer-overview.md)
- Learn more about [Availability Zones](../availability-zones/az-overview.md)
- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) of Azure


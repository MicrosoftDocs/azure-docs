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
ms.date: 09/28/2017
ms.author: kumud
---

# Azure Load Balancer Standard overview (preview)

The Azure Load Balancer Standard SKU and Public IP Standard SKU together enable you to build highly scalable and reliable architectures. Applications that use Load Balancer Standard can take advantage of new capabilities. Low latency, high throughput, and scale are available for millions of flows for all TCP and UDP applications.

>[!NOTE]
> The Load Balancer Standard SKU is currently in preview. During preview, the feature might not have the same level of availability and reliability as features that are in general availability release. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Use the generally available [Load Balancer Basic SKU](load-balancer-overview.md) for your production services. The features that are associated with this preview, [Availability Zones](https://aka.ms/availabilityzones), and [HA Ports](https://aka.ms/haports), require separate sign-up at this time. Follow the respective instructions for sign-up for those features, in addition to signing up for Load Balancer [Standard preview](#preview-sign-up).

## Why use Load Balancer Standard?

You can use Load Balancer Standard for the full range of virtual data centers. From small scale deployments to large and complex multi-zone architectures, use Load Balancer Standard to take advantage of the following capabilities:

- [Enterprise scale](#enterprisescale) can be achieved with Load Balancer Standard. This feature can be used with any virtual machine (VM) instance within a virtual network, up to 1,000 VM instances.

- [New diagnostic insights](#diagnosticinsights) are available to help you understand, manage, and troubleshoot this vital component of your virtual data center. Use Azure Monitor (preview) to show, filter, and group new multi-dimensional metrics for continuous data path health measurements. Monitor your data from front-end to VM, endpoint health probes, for TCP connection attempts, and to outbound connections.

- [Network Security Groups](#nsg) are now required for any VM instance that is associated with Load Balancer Standard SKUs or Public IP Standard SKUs. Network Security Groups (NSGs) provide enhanced security for your scenario.

- [High Availability (HA) Ports provide high reliability](#highreliability) and scale for network virtual appliances (NVAs) and other application scenarios. HA Ports load balance all ports on an Azure Internal Load Balancer (ILB) front-end to a pool of VM instances.

- [Outbound connections](#outboundconnections) now use a new Source Network Address Translation (SNAT) port allocation model that provides greater resiliency and scale.

- [Load Balancer Standard with Availability Zones](#availabilityzones) can be used to construct zone-redundant and zonal architectures. Both of these architectures can include cross-zone load balancing. You can achieve zone-redundancy without dependency on DNS records. A single IP address is zone-redundant by default.  A single IP address can reach any VM in a virtual network within a region that is across all Availability Zones.


You can use Load Balancer Standard either in a public or internal configuration to support the following fundamental scenarios:

- Load balance inbound traffic to healthy back-end instances.
- Port forward inbound traffic to a single back-end instance.
- Translate outbound traffic from a private IP address within the virtual network to a Public IP address.

### <a name = "enterprisescale"></a>Enterprise scale

 Use Load Balancer Standard to design your high-performance virtual data center and support any TCP or UDP application. Use standalone VM instances, or up to 1,000 instances of virtual machine scale sets in a back-end pool. Continue to use low forwarding latency, high throughput performance, and scale to millions of flows on a fully managed Azure service.
 
Load Balancer Standard can forward traffic to any VM instance in a virtual network in a region. Back-end pool sizes can be up to 1,000 instances with any combination of the following VM scenarios:

- Standalone VMs without availability sets
- Standalone VMs with availability sets
- Virtual machine scale sets, up to 1,000 instances
- Multiple virtual machine scale sets
- Blends of VMs and virtual machine scale sets

There no longer is a requirement for availability sets. You can choose to use availability sets for the other benefits that they provide.

### <a name = "diagnosticinsights"></a>Diagnostic insights

Load Balancer Standard provides new multi-dimensional diagnostic capabilities for public and internal Load Balancer configurations. These new metrics are provided through Azure Monitor (preview) and utilize all of the related capabilities, including the ability to integrate with downstream consumers.

| Metric | Description |
| --- | --- |
| VIP availability | Load Balancer Standard continuously exercises the data path from within a region to the Load Balancer front-end all the way to the SDN stack that supports your VM. As long as healthy instances remain, the measurement follows the same path as your application's load-balanced traffic. The data path that is used by your customers is also validated. The measurement is invisible to your application and does not interfere with other operations.|
| DIP availability | Load Balancer Standard uses a distributed health probing service that monitors your application endpoint's health according to your configuration settings. This metric provides an aggregate or per endpoint filtered-view of each individual instance endpoint in the Load Balancer pool.  You can see how Load Balancer views the health of your application as indicated by your health probe configuration.
| SYN packets | Load Balancer Standard does not terminate TCP connections or interact with TCP or UDP packet flows. Flows and their handshakes are always between the source and the VM instance. To better troubleshoot your TCP protocol scenarios, you can make use of SYN packets to understand how many TCP connection attempts are made. The metric reports the number of TCP SYN packets that were received. The metric might also reflect clients that attempt to establish a connection to your service.|
| SNAT connections | Load Balancer Standard reports the number of outbound connections that are masqueraded to the Public IP address front-end. SNAT ports are an exhaustible resource. This metric can give an indication of how heavily your application is relying on SNAT for outbound originated connections.|
| Byte counters | Load Balancer Standard reports the data processed per front-end.|
| Packet counters | Load Balancer Standard reports the packets processed per front-end.|

### <a name = "highreliability"></a>High reliability

Configure load balancing rules to make your application scale and be highly reliable. You can configure rules for individual ports, or you can use HA Ports to balance all traffic irrespective of the TCP or UDP port number.  

You can use the new HA Ports feature to unlock a variety of scenarios, including high availability and scale for internal NVAs. The feature is useful for other scenarios where it is impractical or undesirable to specify individual ports. HA Ports provide redundancy and scale by allowing as many instances as you need. Your configuration is no longer restricted to active/passive scenarios. Your health probe configurations protect your service by forwarding traffic only to healthy instances.

NVA vendors can provide fully vendor-supported, resilient scenarios for their customers. The single point of failure is removed and multiple active instances are supported for scale. You can scale to two or more instances, depending on the capabilities of your appliance. Contact your NVA vendor for additional guidance for these scenarios.

### <a name = "availabilityzones"></a>Availability zones

[!INCLUDE [availability-zones-preview-statement](../../includes/availability-zones-preview-statement.md)]

Advance your application's resiliency with the use of Availability Zones in supported regions. Availability Zones are currently in preview in specific regions and require additional opt-in.

### Automatic zone-redundancy

You can choose whether Load Balancer should provide a zone-redundant or zonal front-end for each of your applications. It's easy to create zone-redundancy with Load Balancer Standard. A single front-end IP address is automatically zone-redundant. A zone-redundant front-end is served by all availability zones in a region simultaneously. A zone-redundant data path is created for inbound and outbound connections. Zone-redundancy in Azure does not require multiple IP addresses and DNS records. 

Zone-redundancy is available for public or internal front-ends. Your Public IP address and front-end private IP for your internal Load Balancer can be zone-redundant.

Use the following script to create a zone-redundant Public IP address for your internal Load Balancer. If you're using existing Resource Manager templates in your configuration, add the **sku** section to these templates.

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

Use the following script to create a zone-redundant front-end IP for your internal Load Balancer. If you're using existing Resource Manager templates in your configuration, add the **sku** section to these templates.

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

If your Public IP front-end is zone-redundant, outbound connections that are made from VM instances automatically become zone-redundant. The front-end is protected from zone failure. Your SNAT port allocation also survives zone failure.

#### Cross-zone load balancing

Cross-zone load balancing is available within a region for the back-end pool and offers maximum flexibility for your VM instances. A front-end delivers flows to any VM in the virtual network, irrespective of the Availability Zone of the VM instance.

You can also specify a particular zone for your front-end and back-end instances, to align your data path and resources with a specific zone.

Virtual networks and subnets are never constrained by a zone. Just define a back-end pool with your desired VM instances and your configuration is complete.

#### Zonal deployments

As an option, you can align your load balancer front-end to a specific zone by defining a zonal front-end. A zonal front-end is served by the designated single Availability Zone only. When the front-end is combined with zonal VM instances, you can align resources to specific zones.

A Public IP address that is created in a specific zone always exists only in that zone. It is not possible to change the zone of a Public IP address. For a Public IP address that can be attached to resources in multiple zones, create a zone-redundant Public IP instead.

Use the following script to create a zonal Public IP address in Availability Zone 1. If you're using existing Resource Manager templates in your configuration, add the **sku** section to these templates.

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

Use the following script to create an internal Load Balancer front-end into Availability Zone 1.

If you're using existing Resource Manager templates in your configuration, add the **sku** section to these templates. Also, define the **zones** property in the front-end IP configuration for the child resource.

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

Add cross-zone load balancing for your back-end pool by putting your VM instances that are in a virtual network into the pool.

The Load Balancer Standard resource is always regional and zone-redundant where Availability Zones are supported. You can deploy a Public IP address or internal Load Balancer front-end that doesn't have an assigned zone in any region. Support for Availability Zones doesn't impact the deployment capability. If a region later gains Availability Zones, previously deployed Public IPs or internal Load Balancer front-ends automatically become zone-redundant. A zone-redundant data path does not imply 0% packet loss.

### <a name = "nsg"></a>Network Security Groups

Load Balancer Standard and Public IP Standard fully onboard to the virtual network, which requires the use of Network Security Groups (NSGs). NSGs make it possible to whitelist traffic flow. You can use NSGs to gain full control over traffic to your deployment. You no longer have to wait for other traffic flows to complete.

Associate NSGs with subnets or the network interfaces (NICs) of VM instances in the back-end pool. Use this configuration with Load Balancer Standard, and Public IP Standard when it is used as an instance-level Public IP. The NSG must explicitly whitelist the traffic that you want to permit, in order for that traffic to flow.

To learn more about NSGs and how to apply them for your scenario, see [Network Security Groups](../virtual-network/virtual-networks-nsg.md).

### <a name ="outboundconnections"></a>Outbound connections

Load Balancer Standard provides outbound connections for VMs that are inside the virtual network when a load balancer uses port-masquerading SNAT. The port-masquerading SNAT algorithm provides increased robustness and scale.

When a public Load Balancer resource is associated with VM instances, each outbound connection source is rewritten. The source is rewritten from the virtual network private IP address space to the front-end Public IP address of the load balancer.

When outbound connections are used with a zone-redundant front-end, the connections are also zone-redundant and SNAT port allocations survive zone failure.

The new algorithm in Load Balancer Standard preallocates SNAT ports to the NIC of each VM. When a NIC is added to the pool, the SNAT ports are preallocated based on the pool size. The following table shows the port preallocations for six tiers of back-end pool sizes:

| Pool size (VM instances) | Preallocated SNAT port |
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

2. Remove the Basic SKU resources (Load Balancer and Public IPs, as applicable) from all VM instances. Be sure to also remove all VM instances of an availability set.

3. Attach all VM instances to the new Standard SKU resources.

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

Load Balancer Standard is currently available in these regions:
- East US 2
- Central US
- North Europe
- West Central US
- West Europe
- Southeast Asia

## SKU service limits and abilities

Azure [Service Limits for Networking](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits#networking-limits) apply per region per subscription. 

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


## Preview sign-up

To participate in the preview for Load Balancer Standard SKU and the companion Public IP Standard SKU, register your subscription.  Registering your subscription gives you access from PowerShell or Azure CLI 2.0. To register, perform the following steps:

>[!NOTE]
>Registration of the Load Balancer Standard feature can take up to an hour to become effective globally. If you wish to use Load Balancer Standard with [Availability Zones](https://aka.ms/availabilityzones) and [HA Ports](https://aka.ms/haports), a separate sign-up is required for these previews. Follow the respective instructions for sign-up for those features.

### Sign up by using Azure CLI 2.0

1. Register the feature with the provider:

    ```cli
    az feature register --name AllowLBPreview --namespace Microsoft.Network
    ```
    
2. The operation can take up to 10 minutes to complete. You can check the status of the operation with the following command:

    ```cli
    az feature show --name AllowLBPreview --namespace Microsoft.Network
    ```
    
    Proceed to the next step when the feature registration state returns 'Registered':
   
    ```json
    {
       "id": "/subscriptions/foo/providers/Microsoft.Features/providers/Microsoft.Network/features/AllowLBPreview",
       "name": "Microsoft.Network/AllowLBPreview",
       "properties": {
          "state": "Registered"
       },
       "type": "Microsoft.Features/providers/features"
    }
    ```
    
3. Complete the preview sign-up by re-registering your subscription with the resource provider:

    ```cli
    az provider register --namespace Microsoft.Network
    ```
    
### Sign up by using PowerShell

1. Register the feature with the provider:

    ```powershell
    Register-AzureRmProviderFeature -FeatureName AllowLBPreview -ProviderNamespace Microsoft.Network
    ```
    
2. The operation can take up to 10 minutes to complete. You can check the status of the operation with the following command:

    ```powershell
    Get-AzureRmProviderFeature -FeatureName AllowLBPreview -ProviderNamespace Microsoft.Network
    ```

    Proceed to the next step when the feature registration state returns 'Registered':
   
    ```
    FeatureName      ProviderName        RegistrationState
    -----------      ------------        -----------------
    AllowLBPreview   Microsoft.Network   Registered
    ```
    
3. Complete the preview sign-up by re-registering your subscription with the resource provider:

    ```powershell
    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
    ```
 
## Pricing

Load Balancer Standard SKU billing is based on configured rules and processed data. No charges are incurred during the preview period. For more information, review the [Load Balancer](https://aka.ms/lbpreviewpricing) and [Public IP](https://aka.ms/lbpreviewpippricing) pricing pages.

Customers continue to enjoy Load Balancer Basic SKU at no charge.

## Limitations

The following limitations apply at the time of preview and are subject to change:

- Load Balancer back-end instances cannot be located in peered virtual networks at this time. All back-end instances must be in the same region.
- SKUs are not mutable. You may not change the SKU of an existing resource.
- Both SKUs can be used with a standalone VM, VM instances in an Availability Set, or a virtual machine scale set. VM combinations may not be used with both SKUs simultaneously. A configuration that contains a mixture of SKUs is not permitted.
- Using an internal Load Balancer Standard with a VM instance (or any part of an Availability Set) disables [default SNAT outbound connections](load-balancer-outbound-connections.md). You can restore this ability to a standalone VM, VM instances in an Availability Set, or a virtual machine scale set. You can also restore the ability to make outbound connections. To restore these abilities, simultaneously assign a public Load Balancer Standard, or Public IP Standard as an instance-level Public IP, to the same VM instance. After the assignment is complete, port-masquerading SNAT to a Public IP address is provided again.
- VM instances might need to be grouped into availability sets to achieve full back-end pool scale. Up to 150 availability sets and standalone VMs can be placed into a single back-end pool.
- IPv6 is not supported.
- In the context of Availability Zones, a front-end is not mutable from zonal to zone-redundant, or vice versa. After a front-end is created as zone-redundant, it remains zone-redundant. After a front-end is created as zonal, it remains zonal.
- In the context of Availability Zones, a zonal Public IP address cannot be moved from one zone to another.


## Next steps

- Learn more about [Load Balancer Basic](load-balancer-overview.md).
- Learn more about [Availability Zones](../availability-zones/az-overview.md).
- Learn about some of the other key [networking capabilities](../networking/networking-overview.md) in Azure.


---
title: Reliability in Azure NAT Gateway
description: Learn how to make Azure NAT Gateway resilient to a variety of potential outages and problems, including transient faults and availability zone outages.
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-nat-gateway
ms.date: 01/06/2026
ai-usage: ai-assisted
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure NAT Gateway works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure NAT Gateway

[Azure NAT Gateway](/azure/nat-gateway/nat-overview) is a fully managed Network Address Translation (NAT) service that provides outbound internet connectivity for resources connected to your private virtual network. The service provides both source network address translation (SNAT) for outbound connections and destination network address translation (DNAT) for response packets to outbound-originated connections only. Because it sits on your critical network paths, Azure NAT Gateway is designed to be a highly resilient service.

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes how you can make Azure NAT Gateway resilient to a variety of potential outages and problems, including transient faults and availability zone outages. It also highlights some key information about the Azure NAT Gateway service level agreement (SLA).

> [!IMPORTANT]
> When you consider the reliability of a NAT gateway, you also need to consider the reliability of your virtual machines (VMs), disks, other network infrastructure, and applications that run on your VMs. Improving the resiliency of the NAT gateway alone might have limited impact if the other components aren't equally resilient. Depending on your resiliency requirements, you might need to make configuration changes across multiple areas.

> [!IMPORTANT]
> Standard V2 SKU Azure NAT Gateway is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Production deployment recommendations

For production workloads, we recommend that you:

> [!div class="checklist"]
> - **Use the StandardV2 SKU**, which automatically enables [zone redundancy](#resilience-to-availability-zone-failures) in supported regions.
>   > [!NOTE]
>   > Review the [Key limitations of StandardV2 NAT Gateway](/azure/nat-gateway/nat-overview#key-limitations-of-standardv2-nat-gateway) before using it, to ensure that your configuration is supported.
> - **Configure your NAT gateway with enough public IP addresses** to handle your peak connection requirements, which reduces the likelihood of availability problems due to SNAT port exhaustion.
> - **Use StandardV2 SKU public IP addresses with StandardV2 NAT Gateway.** Standard SKU public IP addresses aren't supported with StandardV2 NAT Gateway.

## Reliability architecture overview

[!INCLUDE [Introduction to reliability architecture overview section](includes/reliability-architecture-overview-introduction-include.md)]

### Logical architecture

A *NAT gateway* is a resource that you deploy. To use the NAT gateway as the default route for outbound internet traffic, you attach it to one or more subnets in your virtual network. You don't need to configure any custom routes or other routing configurations.

### Physical architecture

Internally, a NAT gateway consists of one or more *instances*, which represent the underlying infrastructure required to operate the service.

Azure NAT Gateway implements a distributed architecture using software-defined networking to provide high reliability and scalability. The service operates across multiple fault domains, enabling it to survive multiple infrastructure component failures without service impact. Azure manages the underlying service operations, including distribution across fault domains and infrastructure redundancy.

For more information about Azure NAT Gateway architecture and redundancy, see [Azure NAT Gateway resource](../nat-gateway/nat-gateway-resource.md#nat-gateway-architecture).

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

*SNAT port exhaustion* is a situation where applications make multiple independent connections to the same IP address and port, exhausting the SNAT ports available for the outbound IP address. SNAT port exhaustion can manifest as a transient fault in your application. To reduce the likelihood of transient faults related to network address translation, you should:

- **Minimize the likelihood of SNAT port exhaustion.** Configure your applications to handle SNAT gracefully by implementing connection pooling and proper connection lifecycle management.

- **Deploy sufficient public IP addresses.** A single NAT gateway supports multiple public IP addresses, and each public IP address provides a separate set of SNAT ports.

- **Monitor the NAT gateway's datapath availability metric.** Use Azure Monitor to detect potential connectivity issues early. Set up alerts for connection failures and SNAT port exhaustion to proactively identify and address transient fault conditions before they impact your applications' outbound connectivity. To learn more, see [What is Azure NAT Gateway metrics and alerts?](/azure/nat-gateway/nat-metrics).

- **Avoid setting high idle timeout values.** Idle timeout values that are significantly higher than the default 4 minutes for NAT gateway connections can contribute to SNAT port exhaustion during high connection volumes.

For comprehensive guidance on connection management and troubleshooting Azure NAT Gateway-specific issues, see [Troubleshoot Azure NAT Gateway connectivity](/azure/nat-gateway/troubleshoot-nat-connectivity).

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

Azure NAT Gateway supports availability zones in both zone-redundant and zonal configurations:

- *Zone-redundant:* When you use the StandardV2 SKU of Azure NAT Gateway, zone redundancy is enabled automatically. Zone redundancy spreads NAT gateway's instances across all of the availability zones in the region. When you use a zone-redundant configuration, you can improve the resiliency and reliability of your production workloads.

    :::image type="content" source="media/reliability-nat-gateway/zone-redundant.svg" alt-text="Diagram of zone-redundant deployment of NAT gateway." border="false":::

- *Zonal:* When you use the Standard (v1) SKU, you can optionally create a zonal configuration. A zonal NAT gateway is deployed into a single availability zone that you select. When NAT gateway is deployed to a specific zone, it provides outbound connectivity to the internet explicitly from that zone. Zonal public IP addresses from a different availability zone aren't allowed. All traffic from connected subnets is routed through the NAT gateway, even if that's in a different availability zone.

    :::image type="content" source="media/reliability-nat-gateway/zonal.svg" alt-text="Diagram of zonal deployment of NAT gateway." border="false":::
    
    If a NAT gateway within an availability zone experiences an outage, all virtual machines in the connected subnets fail to connect to the internet, even if those VMs are in healthy availability zones.

    [!INCLUDE [Zonal resource description](includes/reliability-availability-zone-zonal-include.md)]

    If you deploy virtual machines into several availability zones and need to use zonal NAT gateways, you can create *zonal stacks* in each availability zone. To create zonal stacks, you need to deploy:
    - *Multiple subnets*: You create separate subnets for each availability zone rather than using one subnet that spans zones.
    - *Zonal NAT gateways*: Each subnet gets its own NAT gateway that's deployed in the same availability zone as the subnet itself.
    - *Manual VM assignment*: You explicitly place each virtual machine in both the correct availability zone and its corresponding subnet.

    :::image type="content" source="media/reliability-nat-gateway/zonal-stacks.svg" alt-text="Diagram of zonal isolation by creating zonal stacks." border="false":::
    
If you deploy a Standard (v1) NAT gateway and don't specify an availability zone, the NAT gateway is then *nonzonal*, which means Azure selects the availability zone. If any availability zone in the region has an outage, your NAT gateway might be affected. We don't recommend a nonzonal configuration because it doesn't provide protection against availability zone outages.

### Requirements

- **Region support:** Zone-redundant and zonal NAT gateways can be deployed into [any region that supports availability zones](./regions-list.md).

- **SKU:** To deploy a zone-redundant NAT gateway, you must use the StandardV2 SKU. To deploy a zonal NAT gateway, you must use the Standard SKU. We recommend using the StandardV2 SKU.

- **Public IP addresses:** The requirements for public IP addresses attached to a NAT gateway depend on the SKU and deployment configuration:

    | NAT Gateway SKU | Availability zone support type | Public IP requirements |
    | --- | --- | --- |
    |StandardV2 | Zone-redundant | Must deploy with StandardV2 Public IP |
    |Standard | Zonal | Standard Public IP must be zone-redundant or zonal in the same zone as NAT gateway |
    |Standard | Nonzonal | Standard Public IP can be zone-redundant or zonal in any zone |

### Cost

There is no additional cost to use availability zone support for Azure NAT Gateway. For more information about pricing, see [Azure NAT Gateway pricing](https://azure.microsoft.com/pricing/details/azure-nat-gateway/).

### Configure availability zone support

- **New resources:** Deployment steps depend on which availability zone configuration you want to use for your NAT gateway.

    - *Zone-redundant*: To deploy a new zone-redundant NAT gateway using the StandardV2 SKU, see [Create a Standard V2 Azure NAT Gateway](../nat-gateway/quickstart-create-nat-gateway-v2.md).

    - *Zonal:* To deploy a new zonal NAT gateway using the Standard SKU, see [Create a NAT gateway](../nat-gateway/quickstart-create-nat-gateway.md). When you create the NAT gateway, select its availability zone instead of selecting *No zone*.

- **Enable availability zone support:** Azure NAT Gateway availability zone configuration can't be changed after deployment. To modify the availability zone configuration, you must deploy a new NAT gateway with the desired zone settings.

    To upgrade from a Standard to StandardV2 NAT gateway, you must also create a new public IP address that uses the StandardV2 SKU.

### Behavior when all zones are healthy

This section describes what to expect when NAT gateways are configured for availability zone support and all availability zones are operational.

- **Traffic routing between zones**: The way traffic from your VM is routed through your NAT gateway depends on the availability zone configuration your NAT gateway uses.

    - *Zone-redundant:* Traffic can be routed through a NAT gateway instance within any availability zone.

    - *Zonal:* Each NAT gateway instance operates independently within its assigned availability zone. Outbound traffic from subnet resources is routed through the NAT gateway's zone, even if the VM is in a different zone.

- **Data replication between zones**: Azure NAT Gateway doesn't perform data replication between zones as it's a stateless service for outbound connectivity. Each NAT gateway instance operates independently within its availability zone without requiring synchronization with instances in other zones.

### Behavior during a zone failure

This section describes what to expect when a NAT gateway is configured for availability zone support and there's an availability zone outage.

- **Detection and response:** Responsibility for detection and response depends on the availability zone configuration that your NAT gateway uses.

    - *Zone-redundant:* Azure NAT Gateway detects and responds to failures in an availability zone. You don't need to do anything to initiate an availability zone failover.

    - *Zonal*: You are responsible for implementing application-level failover to alternative connectivity methods or NAT gateways in other zones.

- **Notification:** [!INCLUDE [Availability zone down notification partial bullet (Service Health + Resource Health)](./includes/reliability-availability-zone-down-notification-service-resource-partial-include.md)]

    You can also use the NAT gateway's datapath availability metric to monitor the health of your NAT gateway. You can configure alerts on the datapath availability metric to detect connectivity issues.

- **Active requests:** What happens to active requests depends on the availability zone configuration that your NAT gateway uses.

    - *Zone-redundant:* Any active outbound connections through instances in the faulty zone are dropped, and clients need to retry. Subsequent connection attempts flow through a NAT gateway instance in another availability zone.

    - *Zonal:* Active outbound connections through a failed zonal NAT gateway are lost. You must decide whether and how to re-establish connectivity through alternative connectivity paths. Applications should implement retry logic to handle connection failures.
    
        If traffic is rerouted, because the outbound public IP address changes, any TCP sessions might need to be renegotiated.

- **Expected data loss:** No data loss occurs because Azure NAT Gateway is a stateless service for outbound connectivity. Connection state is recreated when connections are re-established.

- **Expected downtime:** The expected downtime depends on the availability zone configuration that your NAT gateway uses.

    - *Zone-redundant:* Existing connections from the failed zone may go down. Clients can retry connections immediately and requests will be routed to an instance in another zone. All remaining connections from healthy zones persist.

    - *Zonal:* Outbound connectivity is lost until the zone recovers, or until you reroute traffic through alternative connectivity methods or NAT gateways in other zones.

- **Traffic rerouting:** The traffic rerouting behavior depends on the availability zone configuration that your NAT gateway uses. 
    
    - *Zone-redundant:* New connection requests are routed through a NAT gateway instance in a healthy availability zone.
    
        It's unlikely that virtual machines in the affected availability zone would still be operating. However, in the event of a partial zone failure that causes Azure NAT Gateway to be unavailable while virtual machines continue to operate, any outbound connections from virtual machines in the affected zone are routed through a NAT gateway instance in another zone.

    - *Zonal:* You are responsible for implementing any application-level failover, such as alternative connectivity methods or to NAT gateways in other zones.

### Zone recovery

No manual intervention is required for failback operations because Azure NAT Gateway is a stateless service.

When an availability zone recovers, NAT gateway instances in that zone automatically become available for new outbound connections. Connections established through NAT gateway instances in other zones during the outage continue to use their current connectivity paths until the connections naturally terminate.

### Test for zone failures

The options for testing for zone failures depend on the availability zone configuration that your instance uses.

- *Zone-redundant:* The Azure NAT Gateway platform manages traffic routing, failover, and failback for zone-redundant NAT gateways. Because this feature is fully managed, you don't need to initiate anything or validate availability zone failure processes.

- *Zonal:* You're responsible for preparing and testing failover plans in case a zone failure occurs.

## Resilience to region-wide failures

Azure NAT Gateway is a single-region service that operates within the boundaries of a specific Azure region. The service doesn't provide native multi-region capabilities or automatic failover between regions. If a region becomes unavailable, NAT gateways in that region are also unavailable.

If you design a networking approach with multiple regions, you should deploy independent NAT gateways into each region.

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

Azure NAT Gateway is covered by the *Azure VNet NAT* SLA. The availability SLA only applies when you have two or more healthy VMs, and it excludes SNAT port exhaustion from downtime calculations.

### Related content

- [Azure NAT Gateway overview](/azure/nat-gateway/nat-overview)
- [NAT gateway and availability zones](/azure/nat-gateway/nat-availability-zones)
- [Troubleshoot Azure NAT Gateway connectivity](/azure/nat-gateway/troubleshoot-nat-connectivity)
- [Azure NAT Gateway Resource Health](/azure/nat-gateway/resource-health)

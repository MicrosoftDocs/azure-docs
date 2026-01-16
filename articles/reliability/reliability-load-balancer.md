---
title: Reliability in Azure Load Balancer
description: Learn how to make Azure Load Balancer resilient to a variety of potential outages and problems, including transient faults, availability zone outages, and region outages. Also, learn about backup and the App Service service-level agreement.
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-load-balancer
ms.date: 01/08/2026
ai-usage: ai-assisted

#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Load Balancer works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Load Balancer

Azure Load Balancer is a layer-4 (TCP/UDP) load balancing service that distributes incoming traffic among healthy instances of services. Load Balancer provides high availability and network performance to your applications with ultra-low latency.

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

This article describes how to make Load Balancer resilient to a variety of potential outages and problems, including transient faults, availability zone outages, and region outages. It also highlights some key information about the Load Balancer service level agreement (SLA).

> [!IMPORTANT]
> The reliability of your overall solution depends on the configuration of the backend instances (servers) that your load balancer routes traffic to, such as Azure virtual machines (VMs) or Azure virtual machine scale sets.
>
> Your backend instances aren't in scope for this article, but their availability configurations directly affect your application's resilience. Review the [reliability guides for all of the Azure services in your solution](./overview-reliability-guidance.md) to understand how each service supports your reliability requirements. By ensuring that your backend instances are also configured for high availability and zone redundancy, you can achieve end-to-end reliability for your application.

## Production deployment recommendations

The Azure Well-Architected Framework provides recommendations across reliability, performance, security, cost, and operations. To understand how these areas influence each other and contribute to a reliable Load Balancer solution, see [Architecture best practices for Load Balancer in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-load-balancer).

## Reliability architecture overview

A load balancer can be either public or internal. A public load balancer accepts traffic from the internet through a public IP address resource. An internal load balancer is accessible only within your virtual network and other networks that you connect to the virtual network.

Each load balancer consists of multiple components, including:

- *Frontend IP configurations*, which receive traffic. A public load balancer receives traffic on a public IP address. An internal load balancer receives traffic on an IP address within your virtual network.
- *Backend pools*, which contain a collection of *backend instances* that can receive traffic, such as individual VMs that run your application.
- *Load balancing rules*, which define how traffic from a frontend should be distributed to a backend pool.
- *Health probes*, which monitor the availability of backend instances.

To learn more about how Load Balancer works, see [Load Balancer components](../load-balancer/components.md).

For globally deployed solutions, you can deploy a *global load balancer*, which is a special type of public load balancer designed to route traffic among different regional deployments of your solution. A global load balancer provides a single anycast IP address. It routes traffic to the closest healthy regional load balancer based on client proximity and regional health status. For more information, see [Resilience to region-wide failures](#resilience-to-region-wide-failures).

## Resilience to transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

When you use Load Balancer, consider the following best practices to minimize the risk of transient faults affecting your application:

- **Implement retry logic.** Clients should implement appropriate retry mechanisms for transient connection failures, including exponential backoff strategies.

- **Configure health probes with tolerance.** Configure your health probes to balance between rapid failure detection and avoiding false positives during transient issues.

- **Monitor SNAT port allocation.** For outbound connections, monitor SNAT port allocation and configure outbound rules to prevent transient connection failures due to port exhaustion.

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

Load Balancer can be deployed as *zone-redundant* by configuring each frontend IP configuration that you create. A zone-redundant frontend IP configuration is served simultaneously from independent infrastructure in multiple zones. This configuration ensures that zone failures don't impact the load balancer's ability to receive and distribute traffic.

The following diagram shows a zone-redundant public load balancer, which is configured by creating a zone-redundant public IP address:

:::image type="content" source="./media/reliability-load-balancer/zone-redundant-public-load-balancer.svg" alt-text="Diagram showing a zone-redundant public load balancer, with a zone-redundant public IP address, directing traffic to three different VMs in different availability zones." border="false" :::

The following diagram shows an internal load balancer using a similar zone-redundant configuration:

:::image type="content" source="./media/reliability-load-balancer/zone-redundant-internal-load-balancer.svg" alt-text="Diagram showing a zone-redundant internal load balancer, directing traffic to three different VMs in different availability zones." border="false" :::

> [!NOTE]
> While you can deploy zonal load balancers, we recommend you always use zone-redundant load balancers, even for workloads that are deployed into a single zone. Microsoft is currently migrating all public IP addresses and load balancers to be zone-redundant.

In regions with no availability zones, load balancers are created in a *nonzonal* or *regional* configuration by using a frontend configuration with no zone configured. If the region experiences an outage, nonzonal load balancers could experience downtime.

#### Backend instances and availability zones

The availability zone configuration of your backend instances is independent of your load balancer's frontend IP configuration.

Distribute your backend instances across zones by configuring the relevant service, in accordance with the reliability features of the service they belong to and the architecture that you design.

> [!NOTE]
> Distributing backend instances across multiple availability zones is essential for resilience. If all backend instances are located in a single zone, an outage in that zone will make your application unavailable, even if you use a zone-redundant load balancer.

For example, when you use VMs, a common design approach for production workloads is to achieve zone resiliency by placing multiple zonal VMs in zones 1, 2, and 3. For load balancing, you can then create a zone-redundant load balancer and configure those VMs as the backend instances within the load balancer. The load balancer's health probes automatically remove unhealthy VMs from rotation regardless of their zone location.

However, if you choose to deploy your VMs into the same availability zone, you can still deploy a zone-redundant frontend IP configuration on your load balancer, which the following diagram illustrates:

:::image type="content" source="./media/reliability-load-balancer/zone-redundant-load-balancer-zonal-virtual-machines.svg" alt-text="Diagram showing a zone-redundant public load balancer, directing traffic to two different VMs in zone 1." border="false" :::

### Requirements

**Region support:** Zone-redundant load balancers can be deployed into [any region that supports availability zones](regions-list.md).

### Cost

Availability zone configuration doesn't change the way a load balancer is billed. Billing is based on the number of rules configured and data processed, regardless of zone configuration. For more information, see [Azure Load Balancer pricing](https://azure.microsoft.com/pricing/details/load-balancer/).

### Configure availability zone support

When you work with Load Balancer, you set the availability zone support on the frontend IP configuration.

- **Create a new load balancer with availability zone support.**

    - For *public load balancers*, the frontend IP configuration automatically adopts the availability zone configuration of the public IP address resource that you associate with it. To make the frontend IP configuration zone-redundant, create or select a zone-redundant public IP address. Public IP addresses are zone-redundant by default. For detailed steps, see [Create a public load balancer to load balance VMs using the Azure portal](../load-balancer/quickstart-load-balancer-standard-public-portal.md).

    - For *internal load balancer*s, when you configure the frontend IP of the load balancer, you set the availability zone support type on the frontend IP configuration. For detailed steps, see [Create an internal load balancer to load balance VMs using the Azure portal](../load-balancer/quickstart-load-balancer-standard-internal-portal.md).

- **Change the availability zone configuration of an existing load balancer.** To change the availability zone configuration of an existing load balancer, you need to replace the frontend IP configuration. You can use this approach to move from a zonal to a zone-redundant frontend IP configuration. The high-level approach is:

    1. Create a new frontend IP configuration with the desired availability zone configuration.
    
        For *public load balancers*, create a new public IP address that uses your desired availability zone configuration first. Then, reconfigure your load balancer to add a frontend IP configuration that references that public IP address.

        For *internal load balancers*, reconfigure your load balancer to add a new frontend IP configuration with your desired availability configuration. This step assigns a new private IP address from within your subnet.
    
    1. Reconfigure your load balancing rules to use the new frontend IP configuration.
    
        > [!IMPORTANT]
        > This operation requires you to reconfigure your clients to send traffic to the new frontend IP address. Depending on your clients, the process might require downtime.
    
    1. Remove the old frontend IP configuration.

### Behavior when all zones are healthy

This section describes what to expect when a load balancer uses a zone-redundant frontend IP configuration and all availability zones are operational.

- **Traffic routing between zones:** Load balancing can be performed in any availability zone. Traffic is sent to healthy backend instances specified in the backend pool, without consideration of which availability zone the backend instance is in.

- **Data replication between zones**. Load Balancer is a network pass-through service that doesn't store or replicate application data. Even if you enable [session persistence](../load-balancer/distribution-mode-concepts.md#session-persistence) on the load balancer, no state is stored on the load balancer. Session persistence adjusts the hashing process to route requests to the same backend instance. However, session persistence isn't guaranteed. When the backend pool changes, the distribution of client requests is recomputed. This process is done without storing or synchronizing state.

    The service maintains its configuration state with synchronous replication across zones, ensuring immediate consistency of load balancing rules, health probe configurations, and backend pool membership across all zones.

### Behavior during a zone failure

This section describes what to expect when a load balancer uses a zone-redundant frontend IP configuration and there's an availability zone outage.

- **Detection and response**: The Azure platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover.

[!INCLUDE [Availability zone down notification (Service Health and Resource Health)](./includes/reliability-availability-zone-down-notification-service-resource-include.md)]

- **Active requests**: Any existing TCP/UDP flows within the failed zone are reset and need to be retried by the client. Your clients should have sufficient [transient fault handling](#resilience-to-transient-faults) implemented, including automated retries.

- **Expected data loss**: As a stateless network service, Load Balancer doesn't store application data, so no data loss occurs at the load balancer layer.

- **Expected downtime**: There's no downtime is expected for zone-redundant load balancers, because the load balancer continues to work from healthy zones.

    However, if the failure affects compute services in the zone, then any VMs or other resources that are in the affected zone could be unavailable. The load balancer's health probes are designed to detect these failures and route traffic to alternative instances in another zone based on the load balancing algorithm and backend instances' health status.

- **Traffic rerouting**: The load balancer continues to operate from the healthy zones. The Load Balancer service maintains the same frontend IP address during zone failures. This behavior means you don't need to apply DNS updates or reconfigure clients. New connections are automatically established through remaining healthy zones.

### Zone recovery

When an availability zone recovers, Load Balancer automatically resumes normal operations. The zone-redundant frontend automatically begins serving traffic from the recovered zone alongside other operational zones. Health probes from the recovered zone resume evaluating backend instances.

If the zone failure also affected your compute services in the zone, then as backend instances in the recovered zone pass health checks, they're automatically added back to the healthy backend pool. Traffic distribution rebalances across all available zones based on the load balancing algorithm and backend instances' health status.

### Test for zone failures

The Azure platform manages traffic routing, zone-down response, and recovery. These capabilities are fully managed, so you don't need to initiate or validate availability zone failure processes.

You can use Azure Chaos Studio to simulate the failure of a VM in a single zone. Chaos Studio provides [built-in faults for VMs](/azure/chaos-studio/chaos-studio-fault-library#virtual-machines-service-direct), including to shut down a VM. You can use these capabilities to simulate zone failures and test your failover processes.

## Resilience to region-wide failures

Public and internal load balancers are deployed into a single Azure region. If the region becomes unavailable, your load balancers in that region are also unavailable. However, Azure Load Balancer provides native multi-region support through Global Load Balancer, which enables load balancing across Azure regions. You can also deploy other load balancing services to route and fail over across Azure regions.

### Global load balancers

Global Load Balancer provides a single static anycast IP address that automatically routes traffic to the optimal regional deployment based on client proximity and regional health. Global Load Balancer can help to improve your application's reliability and performance.

With Global Load Balancer, you deploy multiple public load balancers in different regions, and the global load balancer acts as a global frontend. If the backend servers in one region have a problem, traffic switches to healthy regions automatically and without DNS changes because the anycast IP address remains constant and routes traffic to another region.

For more information, see [Global Load Balancer](../load-balancer/cross-region-overview.md).

### Custom multi-region solutions for resiliency

Azure provides a range of load balancing services that suit different requirements. You can select a load balancer that meets your resiliency requirements and that suits your application type. For more information, see [Load balancing options](/azure/architecture/guide/technology-choices/load-balancing-overview).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

The Azure Load Balancer SLA applies when there are at least two healthy VMs configured as backend instances. The SLA excludes downtime due to SNAT port exhaustion or network security groups (NSGs) that block traffic.

### Related content

- [Azure Load Balancer documentation](../load-balancer/load-balancer-overview.md)
- [Global Load Balancer](../load-balancer/cross-region-overview.md)
- [Azure reliability overview](/azure/reliability/overview)
 
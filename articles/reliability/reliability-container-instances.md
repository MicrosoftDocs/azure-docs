---
title: Reliability in Azure Container Instances
description: Find out about reliability in Azure Container Instances, including availability zones and multi-region deployments.
author: tomvcassidy
ms.author: tomcassidy
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-container-instances
ms.date: 08/26/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand who needs to understand the details of how Azure Container Instances works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations. 
---

# Reliability in Azure Container Instances

[Azure Container Instances](/azure/container-instances/container-instances-overview) provides a straightforward way to run Linux or Windows containers in Azure, without the need to manage virtual machines (VMs) or adopt a more complex, higher-level service.

This article describes reliability support in Container Instances, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

To increase the reliability of production applications built on Container Instances, we recommend that you take the following actions:

- Run your applications across [multiple availability zones](#availability-zone-support).

- Consider whether to also run separate container groups in [multiple regions](#multi-region-support).

- Use [liveness probes](/azure/container-instances/container-instances-liveness-probe) to detect and automatically restart unhealthy containers.

- Use [readiness probes](/azure/container-instances/container-instances-readiness-probe) to wait until your containers are ready before they receive traffic.

- Use rolling upgrades to progressively apply changes if you use NGroups. This approach reduces the likelihood of downtime because of upgrades.

- Review [best practices and considerations for Container Instances](/azure/container-instances/container-instances-best-practices-and-considerations).

## Reliability architecture overview

To use Container Instances, you deploy a *container group*. A container group contains one or more *containers*. Each container is created from a *container image*, which is stored in a registry such as [Azure Container Registry](/azure/container-registry/).

All containers in a container group are deployed together as a single logical unit and share the same physical infrastructure.

The following diagram shows the relationship between container groups, containers, and images.

:::image type="complex" border="false" source="media/reliability-container-instances/container-groups-containers.svg" alt-text="Diagram that shows a container group with two containers. Each container uses a separate image in a registry.":::
   The image shows two containers within a container group section. Two dotted lines connect the containers to two image sections in the registry section.
:::image-end:::

Container Instances provides the following features to manage container groups:

- [NGroups](/azure/container-instances/container-instance-ngroups/container-instances-about-ngroups) (preview) provides a set of capabilities to manage multiple related container groups. When you create an NGroup, you define the number of container groups to create. Container Instances provides capabilities such as automated upgrade rollouts and spreading container groups across availability zones.

- [Standby pools](/azure/container-instances/container-instances-standby-pool-overview) creates a pool of pre-provisioned container groups that can be used in response to incoming traffic. Standby pools are designed to optimize the creation of container groups and aren't intended to increase your resiliency.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Microsoft-provided SDKs usually handle transient faults. Because you host your own applications on Container Instances, take steps to reduce the chance of transient faults:

- Run multiple container groups for important workloads to ensure that a failure in one container or container group doesn't affect your entire application.

- Build your application code to be resilient to transient faults in services that you connect to, such as by using retry policies with backoff strategies.

For more information about other errors that might occur at runtime and how to respond to them, see [Issues during container group runtime](/azure/container-instances/container-instances-troubleshooting#issues-during-container-group-runtime).

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Container Instances supports availability zones in different ways, depending on how you deploy your container groups:

- **Manually created container groups:** An individual container group is a *zonal* resource, which means that it can be deployed into a single availability zone that you select. All containers within the group are deployed into the same availability zone. If that availability zone has an outage, the container group and all of its containers might experience downtime.

    The following diagram shows a container group that's been manually deployed into availability zone 1:

    :::image type="complex" border="false" source="media/reliability-container-instances/container-groups-containers-zonal.svg" alt-text="Diagram that shows a container group with two containers deployed into a single availability zone.":::
    The image shows three availability zones: Availability Zone 1, Availability Zone 2, and Availability Zone 3. A container group in Availability Zone 1 includes two containers.
    :::image-end:::

    > [!NOTE]
    > To ensure that your application continues to run when any single zone in the region experiences an outage, we recommend that you create a minimum of two container groups across two different availability zones. 

    If you don't specify availability zones to use for your container group, it's *nonzonal* or *regional*, which means that it might be placed in any availability zone within the region or within the same zone. If any availability zone in the region has a problem, your container group might experience downtime.

- **NGroups:** When you deploy an NGroup, you can specify one or more zones to deploy it to. If you deploy an NGroup to two or more zones, it's a *zone-redundant* NGroup, and an outage of one availability zone only causes problems for the container groups within the affected zone.

    The following diagram shows an NGroup that's deployed to three availability zones:

    :::image type="complex" border="false" source="media/reliability-container-instances/ngroup-zone-redundant.svg" alt-text="Diagram that shows an NGroup with three container groups, deployed into three availability zones.":::
    The image shows three availability zones. Each availability zone includes a container group and two containers. A rectangle labeled NGroupdesiredCount=3, zones=1,2,3 spans all three availability zones.
    :::image-end:::

    If you don't specify availability zones to use for your NGroup, it's nonzonal and might experience downtime if any availability zone in the region has a problem.

- **Standby pools:** When you deploy a standby pool, you can optionally specify one or more zones. The platform might request containers across the zones that you select.

    However, standby pools aren't zone redundant or zone resilient because there's no guarantee that containers are created in multiple zones. If a zone outage occurs, it's possible that all of the containers in the pool might be placed in the affected zone.

    Because standby pools aren't designed to support resiliency to zone failures, this guide doesn't describe the detailed behavior of standby pools with availability zones.

    > [!IMPORTANT]
    > Standby pools aren't designed to be zone resilient. They shouldn't be used for workloads that require resilience to zone failures.

### Region support

Zonal container group deployments are supported in [all regions with availability zones](./regions-list.md).

### Requirements

- Zonal deployments are available for Linux and Windows Server 2019 container groups.

- To select an availability zone, you must use the Standard SKU. Zonal container groups aren't available with the Confidential SKU.

### Considerations

[Spot containers](/azure/container-instances/container-instances-spot-containers-overview) don't support availability zones and are always nonzonal.

### Cost

There's no extra cost to configure availability zones for a container group.

### Configure availability zone support

- **Create container groups with availability zone support.** The approach that you use to configure availability zones depends on how you create container groups.

    - *Manually created container groups:* To create a zonal container group in a specific zone, you can use one of the following methods:

       - The [Azure portal](/azure/container-instances/container-instances-quickstart-portal)
       - The [Azure CLI](/azure/container-instances/container-instances-quickstart)
       - [Azure PowerShell](/azure/container-instances/container-instances-quickstart-powershell)
       - [Bicep](/azure/container-instances/container-instances-quickstart-bicep)
       - An [Azure Resource Manager template (ARM template)](/azure/container-instances/container-instances-quickstart-template)
       - [Terraform](/azure/container-instances/container-instances-quickstart-terraform)

    - *NGroups:* You can deploy a zone-redundant NGroup by using a Bicep file or ARM template and specifying multiple zones. For more information, see [NGroups with zones sample](/azure/container-instances/container-instance-ngroups/container-instances-about-ngroups#ngroups-with-zones-sample).
    
    - *Standby pools:* You can deploy a standby pool that uses availability zones by specifying one or more zones when you create or update the pool. However, containers might not be created in multiple zones. Standby pools shouldn't be used for workloads that require resilience to zone failures. For more information, see [Create a standby pool for Container Instances](/azure/container-instances/container-instances-standby-pool-create).

- **Enable availability zone support on existing resources.** The approach that you use to configure availability zones depends on how you create container groups.

    - *Manually created container groups:* You can't enable availability zones on an existing nonzonal container group. You must delete the container group and create a zonal container group.

    - *NGroups:* You can't enable availability zones on an existing nonzonal NGroup. You must delete the NGroup and create a zone-redundant NGroup.

    - *Standby pools:* You can't enable availability zones on an existing nonzonal standby pool. You must delete the container group and create a new standby pool that uses multiple availability zones.

- **Move container groups between zones or disable availability zone support.** The approach that you use to modify availability zones depends on how you create container groups.

    - *Manually created container groups:* To change a container group's availability zone, you must delete the container group and create another container group with the new availability zone. To learn how to delete the container group, see the following resources:
    
       - The [Azure portal](/azure/container-instances/container-instances-quickstart-portal#clean-up-resources)
       - The [Azure CLI](/azure/container-instances/container-instances-quickstart#clean-up-resources)
       - [Azure PowerShell](/azure/container-instances/container-instances-quickstart#clean-up-resources)
       - [Bicep](/azure/container-instances/container-instances-quickstart-bicep#clean-up-resources)
       - An [ARM template](/azure/container-instances/container-instances-quickstart-template#clean-up-resources)
       - [Terraform](/azure/container-instances/container-instances-quickstart-terraform#clean-up-resources)
       - The [Docker CLI](/azure/container-instances/container-instances-quickstart-docker-cli#clean-up-resources)

    - *NGroups:* You can add zones to an NGroup, but you can't remove zones.

    - *Standby pools:* You can add zones to a standby pool, but you can't remove zones.

### Container group distribution

The way container groups are distributed across availability zones depends on how you deploy your container groups.

- **Manually created container groups:** You're responsible for distributing your manually created container groups across multiple availability zones.

- **NGroups:** During scale-in operations, NGroups randomly deletes instances, which might not maintain a spread across availability zones. Scale-out operations try to rebalance the spread across zones.

- **Standby pools:** A standby pool can create containers in any of the availability zones that you configure on the pool. However, containers might not be created in multiple zones. Standby pools shouldn't be used for workloads that require resilience to zone failures.

### Capacity planning and management

To prepare for availability zone failure, consider *overprovisioning* the number of container groups that you deploy. This approach allows the solution to tolerate some capacity loss and continue to function without degraded performance. For more information, see [Manage capacity by using overprovisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

The approach that you use to overprovision container groups depends on how you deploy your container groups.

- **Manually created container groups:** You're responsible for planning the capacity of your manually created container groups, including planning how many container groups to deploy in each zone.

- **NGroup:** Consider *overprovisioning* the capacity of your NGroup to tolerate the loss of a zone.

- **Standby pools:** Standby pools aren't designed to be resilient to zone failures. Consider using multiple standby pools in different zones, or use NGroups.

### Normal operations

This section describes what to expect when Container Instances resources are configured for availability zone support and all availability zones are operational.

- **Traffic routing between zones:** You're responsible for routing traffic to your containers. For example, you can use [Azure Application Gateway](/azure/container-instances/container-instances-application-gateway) as a gateway and load balancer for your container groups.
    
    If you use NGroups or standby pools, you're responsible for load balancing across each container. You also need to configure your traffic routing system to detect the health of each container group and redirect traffic to an alternative group when necessary.

- **Data replication between zones:** Containers and container groups are stateless. You can attach your own file share, or connect to databases or other storage services from within your applications. You're responsible for ensuring that those file shares and storage services are zone resilient. Review the [reliability guides](./overview-reliability-guidance.md) for each service to understand how to make each component zone resilient.

### Zone-down experience

This section describes what to expect when Container Instances resources are configured for availability zone support and there's an availability zone outage.

- **Detection and response:** Responsibility for detection of zone failures and the associated response depend on how you deploy your container groups.

    - *Manually created container groups:* You need to detect the loss of an availability zone and initiate a failover to a secondary container group that you create in another availability zone.
    
    - *NGroups:* The Container Instances platform is responsible for detecting a failure in an availability zone and responding.
    
        However, you're responsible for ensuring that traffic is routed to containers in a healthy zone.

    - *Standby pools:* The Container Instances platform isn't guaranteed to respond to zone failures for standby pools. Standby pools shouldn't be used for workloads that require resilience to zone failures.

- **Notification:** Container Instances doesn't notify you when a zone is down. However, you can use [Azure Service Health](/azure/service-health/overview) to understand the overall health of the Container Instances service, including any zone failures.
  
    Set up alerts to receive notifications of zone-level problems. For more information, see [Create Service Health alerts in the Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal).

- **Active requests:** If a zone fails, all containers running in that zone are likely to stop, including any active work that they're handling

- **Expected data loss:** Because containers and container groups are stateless, there's no data loss expected from a zone failure. However, you're responsible for ensuring that each component in your workload is zone resilient, including storage services and databases.

- **Expected downtime:** The downtime that you can expect from a zone failure depends on how you deploy your container groups.

    - *Manually created container groups:* For zonal container groups, when a zone is unavailable, your container group and its containers are unavailable until the availability zone recovers.

    - *NGroups:* For NGroups, if one zone goes down, your application remains available because the remaining container groups within the NGroups continue to run in other zones. No downtime is expected.
    
    - *Standby pools:* Standby pools don't provide zone resiliency. If all container groups in the standby pool are in a single zone, it's possible that all container groups and their containers become unavailable until the availability zone recovers.

- **Traffic rerouting:** Because you're responsible for routing traffic to your containers, you're also responsible for rerouting traffic if a container group fails because of an availability zone outage.

### Zone recovery

After the zone recovers, the Azure platform automatically restarts container groups that had stopped. No customer action is required.

### Testing for zone failures

There's no way to simulate an outage of the availability zone that contains your container group. However, you can manually configure upstream gateways or load balancers to redirect traffic to a different container group in a different availability zone.

## Multi-region support

Container Instances is a single-region service. If the region becomes unavailable, your container groups and its containers are also unavailable.

### Alternative multi-region approaches

You can optionally deploy separate container groups in multiple regions. You're responsible for deploying and configuring the container groups in each region. You also need to configure load balancing by using a service like Azure Traffic Manager or Azure Front Door. You're responsible for any data synchronization, failover, and failback.

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

## Related content

- [Reliability in Azure](./overview.md)

---
title: Reliability in Azure Container Instances
description: Find out about reliability in Azure Container Instances
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-container-instances
ms.date: 07/28/2025
#Customer intent: I want to understand reliability support in Azure Container Instances so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# Reliability in Azure Container Instances

Azure Container Instances offers the fastest and simplest way to run Linux or Windows containers in Azure, without having to manage any virtual machines and without having to adopt a more complex higher-level service. You can learn more about Container Instances on its [overview page](/azure/container-instances/container-instances-overview).

This article describes reliability support in Container Instances, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Reliability architecture overview

When you use Container Instances, you deploy a *container group*, which contains one or more *containers*. Each container is created from a *container image*, which is stored in a registry like Azure Container Registry.

All of the containers in a container group are deployed together as a single logical unit, and share the same physical infrastructure.

The following diagram shows the relationship between container groups, containers, and images:

:::image type="content" source="./media/reliability-containers/container-groups-containers.png" alt-text="Diagram that shows a container group with two containers, each using a separate image in a registry." border="false":::

Additionally, Container Instances provides the following abstractions that manage container groups for you:

- **[NGroups](/azure/container-instances/container-instance-ngroups/container-instances-about-ngroups) (preview)**, which provide a set of capabilities to manage multiple related container groups. When you create an NGroup, you define the number of container groups to create. Container Instances provides capabilities like automated upgrade rollouts and spreading container groups across availability zones.

- **[Standby pools](/azure/container-instances/container-instances-standby-pool-overview)**, which create a pool of pre-provisioned container groups that can be used in response to incoming traffic. 

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

To minimize issues caused by transient faults, we recommend you follow the [deployment best practices](/azure/container-instances/container-instances-best-practices-and-considerations#best-practices). <!-- TODO check -->

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

An individual container group is a *zonal* resource, which means it can be deployed into a single availability zone that you select. All of the containers within the group are deployed into the same availability zone. If that availability zone has a problem, the container group and all of its containers might experience downtime.

> [!NOTE]
> To avoid downtime during an availability zone outage, we recommend that you create a minimum of two container groups across two different availability zones. This approach ensures that your application remains running whenever any single zone in the region experiences an outage.

:::image type="content" source="./media/reliability-containers/container-groups-containers-zonal.png" alt-text="Diagram that shows a container group with two containers deployed into a single availability zone." border="false":::

When you deploy an NGroup, you can specify one or more zones to deploy it to. If you deploy it to two or more zones, it's a *zone-redundant* NGroup, and an outage of one availability zone only causes problems for the container groups within the affected zone.

:::image type="content" source="./media/reliability-containers/ngroup-zone-redundant.png" alt-text="Diagram that shows an NGroup with three container groups, deployed into three availability zones." border="false":::

When you deploy a standby group, you can specify one or more zones, and the platform requests containers across the zones you select. However, standby pools aren't zone-redundant because there's no guarantee that containers are created in multiple zones.

If you don't specify availability zones when you create a container group, NGroup, or standby group, the resource is *nonzonal* or *regional* and might be placed into any availability zone in the region. If any zone has a problem, your resource could experience downtime.

### Region support

Zonal container group deployments are supported in most regions where ACI is available for Linux and Windows Server 2019 container groups. For details, see [Regions and resource availability](/azure/container-instances/container-instances-region-availability). <!-- Need to confirm this -->

### Requirements

- To select an availability zone, you must use the Standard SKU. Zonal container groups aren't available with the Confidential SKU.
- When you deploy a container groups that uses GPU resources, you need to select a zone that has the appropriate hardware available. Some zones might not support GPU resources. <!-- Confirm if we should mention given the feature is retired. -->

### Considerations

[Spot containers](/azure/container-instances/container-instances-spot-containers-overview) don't support availability zones, and are always nonzonal.

### Cost

There's no additional cost to configuring availability zones for a container group.

### Configure availability zone support

- **Create a zonal container group:** TODO

- **Create a zone-redundant NGroup:** TODO

- **Create a standby pool that uses availability zones:** TODO

- **Move container groups between zones or disable availability zone support:** To change your container group's availability zone or disable availability zone support, you must delete the container group and create another container group with the new availability zone.

- **Move NGroups between zones:** TODO

- **Move standby pools between zones:** TODO

### Normal operations

This section describes what to expect when Container Instances resources are configured for availability zone support and all availability zones are operational.

- **Traffic routing between zones:** TODO

- **Data replication between zones:** TODO

### Zone-down experience

This section describes what to expect when Container Instances resources are configured for availability zone support and there's an availability zone outage.

- **Detection and response:**
    - *Manually created container groups:* TODO
    - *NGroups:* TODO
    - *Standby pools:* TODO

- **Notification:** TODO

- **Active requests:** TODO

- **Expected data loss:** TODO

- **Expected downtime:** TODO

- **Traffic rerouting:** TODO

### Zone recovery

TODO

### Testing for zone failures

TODO

## Multi-region support

Azure Container Instances is a single-region service. If the region becomes unavailable, your container groups and its containers are also unavailable.

### Alternative multi-region approaches

You can optionally deploy separate container groups in multiple regions. You're responsible for deploying and configuring the container groups in each region. You also need to configure load balancing by using a service like Azure Traffic Manager or Azure Front Door. You're responsible for any data synchronization, failover, and failback.

## Service-level agreement (SLA)

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

## Next steps

- [Azure Architecture Center's guide on availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability).
- [Reliability in Azure](./overview.md)


<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az_container_create
[container-regions]: ../container-instances-region-availability.md
[az-container-show]: /cli/azure/container#az_container_show
[az-group-create]: /cli/azure/group#az_group_create
[az-deployment-group-create]: /cli/azure/deployment#az_deployment_group_create
[availability-zone-overview]: ./availability-zones-overview.md

---
title: Reliability in Azure Container Instances
description: Find out about reliability in Azure Container Instances
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-container-instances
ms.date: 08/19/2025
#Customer intent: I want to understand reliability support in Azure Container Instances so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# Reliability in Azure Container Instances

Azure Container Instances offers the fastest and simplest way to run Linux or Windows containers in Azure, without having to manage any virtual machines and without having to adopt a more complex higher-level service. You can learn more about Container Instances on its [overview page](/azure/container-instances/container-instances-overview).

This article describes reliability support in Container Instances, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

To increase the reliability of production applications built on Container Instances, we recommend you do the following:

- Run your applications across [multiple availability zones](#availability-zone-support).
- Consider whether to also run separate container groups in [multiple regions](#multi-region-support).
- Use [liveness probes](/azure/container-instances/container-instances-liveness-probe) to detect and automatically restart unhealthy containers.
- Use [readiness probes](/azure/container-instances/container-instances-readiness-probe) to wait until your containers are ready before they receive traffic.
- If you use NGroups, use rolling upgrades to progressively apply changes, which reduces the likelihood of downtime due to upgrades.
- Review [Best practices and considerations for Azure Container Instances](/azure/container-instances/container-instances-best-practices-and-considerations).

## Reliability architecture overview

To use Container Instances, you deploy a *container group*, which contains one or more *containers*. Each container is created from a *container image*, which is stored in a registry such as [Azure Container Registry](/azure/container-registry/).

All containers in a container group are deployed together as a single logical unit. All share the same physical infrastructure.

The following diagram shows the relationship between container groups, containers, and images:

:::image type="content" source="./media/reliability-containers/container-groups-containers.png" alt-text="Diagram  that shows a container group with two containers, each using a separate image in a registry." border="false":::

Additionally, Container Instances provides the following features to manage container groups:

- **[NGroups](/azure/container-instances/container-instance-ngroups/container-instances-about-ngroups) (preview)** provides a set of capabilities to manage multiple related container groups. When you create an NGroup, you define the number of container groups to create. Container Instances provides capabilities such as automated upgrade rollouts and spreading container groups across availability zones.

- **[Standby pools](/azure/container-instances/container-instances-standby-pool-overview)** creates a pool of pre-provisioned container groups that can be used in response to incoming traffic. 

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Microsoft-provided SDKs usually handle transient faults. Because you host your own applications on Container Instances, take steps to reduce the chance of transient faults:

- Run multiple container groups for important workloads, to ensure that a failure in one container or container group doesn't affect your entire application.
- Build your application code to be resilient to transient faults in services that you connect to, such as by using retry policies with backoff strategies.

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

An individual container group is a *zonal* resource, which means it can be deployed into a single availability zone that you select. All containers within the group are deployed into the same availability zone. If that availability zone has an outage, the container group and all of its containers might experience downtime.

> [!NOTE]
> To ensure that your application remains running whenever any single zone in the region experiences an outage, we recommend that you create a minimum of two container groups across two different availability zones. 

:::image type="content" source="./media/reliability-containers/container-groups-containers-zonal.png" alt-text="Diagram that shows a container group with two containers deployed into a single availability zone." border="false":::

When you deploy an NGroup, you can specify one or more zones to deploy it to. If you deploy it to two or more zones, it's a *zone-redundant* NGroup, and an outage of one availability zone only causes problems for the container groups within the affected zone.

:::image type="content" source="./media/reliability-containers/ngroup-zone-redundant.png" alt-text="Diagram that shows an NGroup with three container groups, deployed into three availability zones." border="false":::

If you don't specify availability zones to use for your NGroup, it's *nonzonal* or *regional*, which means the container groups might be placed in any availability zone within the region, or within the same zone. If any availability zone in the region has a problem, your NGroup might experience downtime.

When you deploy a standby group, you can specify one or more zones, and the platform requests containers across the zones you select. However, standby pools aren't zone-redundant because there's no guarantee that containers are created in multiple zones.

> [!IMPORTANT]
> Standby pools aren't zone-redundant.

If you don't specify availability zones when you create a container group, NGroup, or standby group, the resource is *nonzonal* or *regional* and might be placed into any availability zone in the region. If any zone has a problem, your resource could experience downtime.

### Region support

Zonal container group deployments are supported in [all regions with availability zones](./regions-list.md).

### Requirements

- Zonal deployments are available for Linux and Windows Server 2019 container groups.
- To select an availability zone, you must use the Standard SKU. Zonal container groups aren't available with the Confidential SKU.

### Considerations

[Spot containers](/azure/container-instances/container-instances-spot-containers-overview) don't support availability zones, and are always nonzonal.

### Cost

There's no additional cost to configuring availability zones for a container group.

### Configure availability zone support

- **Create container groups with availability zone support:** The approach you use to configure availability zones depends on how you create container groups.

    - *Manually created container groups:* To create a zonal container group in a specific zone, you can use one of the following methods:

       - [Portal](/azure/container-instances/container-instances-quickstart-portal).
       - [Azure CLI](/azure/container-instances/container-instances-quickstart-cli).
       - [ARM template](/azure/container-instances/container-instances-quickstart-arm).
       - [Bicep](/azure/container-instances/container-instances-quickstart-bicep).
       - [Terraform](/azure/container-instances/container-instances-quickstart-terraform).
       - [PowerShell](/azure/container-instances/container-instances-quickstart-powershell).
       - [Docker CLI](/azure/container-instances/container-instances-quickstart-docker-cli).

    - *NGroups:* You can deploy a zone-redundant NGroup by using an Azure Resource Manager template (ARM template), and specifying multiple zones. For more information, see [NGroups with zones sample](/azure/container-instances/container-instance-ngroups/container-instances-about-ngroups#ngroups-with-zones-sample).
    
    - *Standby pools:* You can deploy a standby pool that uses availability zones by specifying one or more zones when you create or update the pool. For more information, see [Create a standby pool for Azure Container Instances](/azure/container-instances/container-instances-standby-pool-create).

- **Move container groups between zones or disable availability zone support:** The approach you use to modify availability zones depends on how you create container groups.

    - *Manually created container groups:* To change a container group's availability zone, you must delete the container group and create another container group with the new availability zone.

    - *NGroups:* You can add zones to an NGroup, but you can't remove zones.

    - *Standby pools:* TODO

- **Verify availability zone support:** The approach you use to verify how your Container Instances resources use availability zones depends on how you create container groups.

    - *Manually created container groups:* TODO

    - *NGroups:* TODO

    - *Standby pools:* TODO

### Container group distribution

<!-- TODO -->

- *NGroups:* During scale-in operations, NGroups randomly deletes instances, which might not maintain a spread across availability zones. Scale-out operations try to rebalance the spread across zones.

### Capacity planning and management

<!-- TODO -->

To prepare for availability zone failure, consider *over-provisioning* the capacity of your NGroup. This approach allows the solution to tolerate some capacity loss and continue to function without degraded performance. For more information, see [Manage capacity by using over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

### Normal operations

This section describes what to expect when Container Instances resources are configured for availability zone support and all availability zones are operational.

- **Traffic routing between zones:** You're responsible for routing traffic to your containers. For example, you can use [Azure Application Gateway](/azure/container-instances/container-instances-application-gateway) as a gateway and load balancer for your container groups.
    
    If you use NGroups or standby pools, you're also responsible for load balancing across each container, and for configuring your traffic routing system to detect the health of each container group and redirect traffic to an alternative container group.

- **Data replication between zones:** Containers and container groups are stateless. You can attach your own file share, or connect to databases or other storage services from within your applications. You're responsible for ensuring those file shares and storage services are zone-resilient. Review the [reliability guides](./overview-reliability-guidance.md) for each service to understand how to make each component zone-resilient.

### Zone-down experience

This section describes what to expect when Container Instances resources are configured for availability zone support and there's an availability zone outage.

- **Detection and response:** Responsibility for detection of zone failures and the associated response depend on how you deploy your container groups.

    - *Manually created container groups:* TODO
    - *NGroups:* TODO
    - *Standby pools:* TODO

- **Notification:** Zone failure events can be monitored through Azure Service Health. Set up alerts to receive notifications of zone-level problems.

- **Active requests:** If a zone fails, any containers running within that zone are likely to terminate.

- **Expected data loss:** Because containers and container groups are stateless, there's no data loss expected from a zone failure. However, you're responsible for ensuring that each component in your workload, including storage services and databases, are zone-resilient.

- **Expected downtime:** The downtime you can expect from a zone failure depends on how you deploy your container groups.

    - *Manually created container groups:* For zonal container groups, when a zone is unavailable, your container group and its containers are unavailable until the availability zone recovers.

    - *NGroups:* TODO
    
    - *Standby pools:* TODO

- **Traffic rerouting:** TODO

### Zone recovery

Activities after the zone recovers depend on how you deploy your container groups.

- *Manually created container groups:* After the zone recovers, the Azure platform automatically restarts container groups that had stopped. No customer action is required.

- *NGroups:* TODO

- *Standby pools:* TODO

### Testing for zone failures

TODO

## Multi-region support

Azure Container Instances is a single-region service. If the region becomes unavailable, your container groups and its containers are also unavailable.

### Alternative multi-region approaches

You can optionally deploy separate container groups in multiple regions. You're responsible for deploying and configuring the container groups in each region. You also need to configure load balancing by using a service like Azure Traffic Manager or Azure Front Door. You're responsible for any data synchronization, failover, and failback.

## Service-level agreement (SLA)

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

## Next steps

- [Reliability in Azure](./overview.md)

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az_container_create
[container-regions]: ../container-instances-region-availability.md
[az-container-show]: /cli/azure/container#az_container_show
[az-group-create]: /cli/azure/group#az_group_create
[az-deployment-group-create]: /cli/azure/deployment#az_deployment_group_create
[availability-zone-overview]: ./availability-zones-overview.md

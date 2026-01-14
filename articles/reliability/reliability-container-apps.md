---
title: Reliability in Azure Container Apps
description: Learn how to make Azure Container Apps resilient to a variety of potential outages and problems, including transient faults, availability zone outages, region outages, and service maintenance.
ms.author: cshoe
author: craigshoemaker
ms.topic: reliability-article
ms.custom: subject-reliability, devx-track-azurepowershell, devx-track-azurecli
ms.service: azure-container-apps
ms.date: 10/23/2025
ai-usage: ai-assisted
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Container Apps works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Container Apps

[Azure Container Apps](../container-apps/overview.md) is a fully managed, serverless container hosting service for deploying microservices and containerized applications.

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes how to make Container Apps resilient to various potential outages and problems, including transient faults, availability zone outages, region outages, and service maintenance. It also describes how to use backups to recover from other types of problems and highlights key information about the Container Apps service-level agreement (SLA).

## Production deployment recommendations

To learn how to deploy Container Apps to support your solution's reliability requirements and how reliability affects other aspects of your architecture, see [Architecture best practices for Container Apps in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-container-apps).

## Reliability architecture overview

When you use Container Apps, you deploy an *environment* that serves as the foundational deployment unit and defines a secure boundary around a group of container apps. The environment is where you configure core settings, including availability zone support and networking configuration. The two types of environments are workload profiles environments and consumption-only environments. For more information, see [Compute and billing structures in Container Apps](/azure/container-apps/structure).

You can deploy multiple *apps* in a single environment. Each app runs one or more *containers*. An environment can also run one or more *jobs*, which represent noninteractive tasks. For more information, see [Containers in Container Apps](/azure/container-apps/containers) and [Jobs in Container Apps](/azure/container-apps/jobs).

Each app has one or more *replicas*, which represent the running instances of the app. You can control how your app scales, including the minimum and maximum number of replicas and how the app dynamically adds and removes replicas. The platform scheduler ensures optimal distribution across physical hosts while meeting your minimum replica count requirements. For more information, see [Set scaling rules in Container Apps](/azure/container-apps/scale-app).

:::image type="content" source="./media/reliability-container-apps/reliability-architecture.svg" alt-text="Diagram that shows a Container Apps environment that runs an app with three replicas." border="false":::

Container Apps supports the reliability of your applications by using different capabilities:

- **Automatic health monitoring:** The built-in ingress controller automatically load balances traffic across healthy replicas. If a replica fails health checks or its underlying infrastructure becomes unavailable for a prolonged time, the service automatically restarts failed containers or creates replacement replicas. It also redistributes traffic away from unhealthy replicas and manages network retries in the cluster. This automatic recovery process requires no customer intervention and maintains your specified replica count. For more information, see [Health probes](../container-apps/health-probes.md).

- **Application resiliency through Dapr:** Container Apps provides tight integration with Dapr, which is a framework that supports production-grade microservices and containerized applications. Dapr includes features that help improve resiliency, including handling failures in other services. For more information, see [Microservices with Container Apps](/azure/container-apps/microservices).

- **Infrastructure resiliency for system components:** This resiliency includes the control plane, ingress controllers, and container runtime. In regions that have availability zones, Container Apps provides zone redundancy. For more information, see [Resilience to availability zone failures](#resilience-to-availability-zone-failures).

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

Container Apps automatically handles many transient faults through its platform-level retry mechanisms and health monitoring. To ensure that your applications are resilient to transient faults, take the following actions:

- **Configure health probes** that let the platform detect and respond to application-specific failure conditions. Set appropriate failure thresholds and timeout values based on your application's startup characteristics. For example, to avoid premature container restarts during temporary problems, use a failure threshold of 3 with a period of 10 seconds for liveness probes. For more information, see [Health probes](../container-apps/health-probes.md).

- **Use service discovery resiliency policies (preview)** to proactively prevent, detect, and recover from service request failures. For example, when you use a resiliency policy, each incoming request to the app can automatically be retried if there's a transient fault that prevents the app from responding. For more information, see [Service discovery resiliency (preview)](/azure/container-apps/service-discovery-resiliency).

- **Implement retry logic** in your applications for external service calls, database connections, and API requests.
    
    If your application uses Dapr to integrate with cloud services, use [Dapr component resiliency (preview)](/azure/container-apps/dapr-component-resiliency) to configure retries, timeouts, and circuit breakers.

    For other dependencies, your application must handle transient faults. Use exponential backoff strategies and circuit breaker patterns when calling external services to prevent cascading failures during downstream service disruptions. Container Apps built-in service discovery and load balancing features automatically route traffic away from failing instances, but your application-level retry policies ensure graceful handling of transient problems before platform-level health checks trigger container restarts.

- **Design jobs to be resilient to transient faults**, including failures during job execution or in their dependencies. Design your jobs to resume work if they're restarted, or design for idempotence so that they can be rerun safely.

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

When you create a Container Apps environment, you can enable *zone redundancy* to distribute the underlying infrastructure across multiple availability zones in the chosen Azure region. Container Apps automatically schedules the replicas of your apps across zones. This distribution occurs transparently, which means that you don't need to specify zone placement for individual replicas.

Zone redundancy enhances your application's resilience to zone-level failures by ensuring that your container app's replicas are spread across multiple zones.

The following diagram shows a zone-redundant container app with three replicas. Each replica runs in a separate availability zone.

:::image type="content" source="./media/reliability-container-apps/zone-redundant.svg" alt-text="Diagram that shows a zone-redundant container app with three replicas. Each replica runs in a separate availability zone." border="false" :::

### Requirements

- **Check region support.** Zone redundancy is available in all regions that support Container Apps and availability zones.

    To see which regions support availability zones, see [Azure regions with availability zone support](./regions-list.md).

    To see which regions support Container Apps, see [Product availability by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

- **Use workload profiles.** Zone redundancy is available to all Container Apps plans, including both Consumption and Dedicated workload profiles.

- **Enable zone redundancy during environment creation.** This setting can't be changed after the environment is created.

- **Deploy a Container Apps environment in a virtual network.** The virtual network must be in a region that supports availability zones. Ensure that the virtual network has an adequately sized subnet. Consumption-only environments need a subnet with a `/23` Classless Inter-Domain Routing (CIDR) range or larger, while workload profiles environments require a `/27` CIDR range or larger.

- **Set your minimum replica count to at least two to ensure distribution across multiple availability zones.** Consider setting a higher minimum replica count if any of the following conditions apply:

  - Your expected peak load needs more than two replicas.

  - You must be resilient to multiple simultaneous zone outages.

  - You want to minimize the time that you wait for new replicas to be created in other zones during a zone outage.

### Cost

You don't incur extra charges beyond standard Container Apps pricing when you enable zone redundancy. You pay the same rates for compute resources, requests, and vCore seconds whether zone redundancy is enabled or not. For more information, see [Container Apps pricing](https://azure.microsoft.com/pricing/details/container-apps/) and [Container Apps billing](../container-apps/billing.md).

### Configure availability zone support

- **Create a zone-redundant Container Apps environment.** For deployment instructions that cover the Azure portal, the Azure CLI, and Azure PowerShell, see [Create a zone-redundant container app](../container-apps/how-to-zone-redundancy.md).

- **Migrate to a zone-redundant deployment.** You can't enable zone redundancy on an existing Container Apps environment. To upgrade existing environments that aren't zone redundant, create a new environment with zone redundancy enabled in a supported region. Then redeploy your container apps.

- **Disable zone redundancy.** Zone redundancy can't be disabled after its enabled during environment creation. If you require a non-zone-redundant deployment, you must create a new environment without enabling the zone redundancy option or deploy to a region that doesn't support availability zones.

- **Verify zone redundancy.** You can use the Azure portal, the Azure CLI, and Azure PowerShell to [verify the zone redundancy status](../container-apps/how-to-zone-redundancy.md#verify-zone-redundancy) of your environment.

### Capacity planning and management

If an availability zone becomes unavailable, the Container Apps platform uses your scale rules to decide when to replace any lost replicas in that zone. It's important to configure your scale rules correctly so that the scheduler can make appropriate scheduling decisions.

To configure your scale rules properly, follow these principles:

- **Set a minimum number of replicas** that your application can tolerate. It might take a short period of time for lost replicas to be replaced because the platform must detect that the old replicas are gone. Then new replicas must start and return a healthy readiness probe status before they can receive incoming requests. If you can't tolerate any period with fewer than the minimum number of replicas that you've specified, consider [over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning) to keep your application performant even if a zone becomes unavailable.

- **Set resource requests and limits** to help the Container Apps scheduler make optimal placement decisions across zones. Underspecified resource requirements can lead to uneven distribution or placement failures during high load.

For more information about configuration options, see [Set scaling rules](../container-apps/scale-app.md).

### Behavior when all zones are healthy

This section describes what to expect when Container Apps resources are configured for zone redundancy and all availability zones are operational.

- **Traffic routing between zones:** With zone-redundant Container Apps, the platform operates in an active-active model where multiple replicas simultaneously serve traffic. The ingress controller distributes incoming requests across all healthy replicas, regardless of their zone, and uses round-robin load balancing by default. Each zone processes requests independently, and the platform doesn't prioritize any specific zone for traffic distribution. Health probes originate from all zones to ensure accurate health assessment of each replica from multiple perspectives.

- **Data replication between zones:** Container Apps doesn't replicate application data between zones because it's designed for stateless workloads. Any data that your app stores in [ephemeral storage](/azure/container-apps/storage-mounts#ephemeral-storage), including in container-scoped storage and replica-scoped storage, is deleted when the container or replica is shut down.

    For stateful data requirements, [mount an Azure Files file share](/azure/container-apps/storage-mounts#azure-files) configured for zone-redundant storage, or use other Azure services like Azure Cosmos DB or Azure SQL Database that provide their own cross-zone replication capabilities.

    The platform replicates only the control plane metadata including your app configurations, scaling rules, and secrets across zones for high availability. Container images are pulled from your container register into each zone as needed when replicas are created.

### Behavior during a zone failure

This section describes what to expect when Container Apps resources are configured for zone redundancy and there's an availability zone outage.

- **Detection and response:** Azure automatically detects zone failures. Container Apps immediately stops scheduling new replicas to the failed zone and begins redistributing traffic to healthy replicas in the remaining zones. The platform handles all failover operations automatically without requiring your intervention.

- **Notification:** [!INCLUDE [Availability zone down notification partial bullet (Azure Service Health only)](./includes/reliability-availability-zone-down-notification-service-partial-include.md)]

    You can also monitor the health of your apps through Container Apps metrics in Azure Monitor. Configure alerts on replica count drops and request failure rates to receive immediate notification when zone-related problems occur.

- **Active requests:** In-flight requests to replicas in the failed zone might be dropped, or experience timeouts or connection errors. Any job executions that run in the affected zone are aborted and are marked as failed.

- **Expected data loss:** No data loss occurs at the Container Apps platform level because the service is designed for stateless workloads. Any data stored in [ephemeral storage](/azure/container-apps/storage-mounts#ephemeral-storage) within the availability zone is lost when the replica is terminated, and ephemeral storage should only be used for temporary data.

- **Expected downtime:** Applications experience minimal to no downtime during zone failures. The actual impact depends on your application's health probe settings and the number of replicas in healthy zones. Ensure that clients follow [transient fault handling guidance](#resilience-to-transient-faults) to minimize any effects.

    Any jobs that run in the affected zone are aborted and are marked as failed. If you need a job to be resilient to a zone failure, configure retries, or configure parallelism so that the job runs multiple copies of the same execution. For more information, see [Advanced job configuration](/azure/container-apps/jobs#advanced-job-configuration).

- **Traffic rerouting:** The ingress controller's health probes quickly detect unreachable replicas and remove them from the load balancing pool. Depending on your app's health probe configuration, this failover process typically occurs in about 30 seconds. Subsequent incoming traffic is distributed across the remaining healthy replicas. This traffic redirection occurs transparently to clients, who continue to use the same application URL.

    If [session affinity](../container-apps/sticky-sessions.md) is enabled, and a zone goes down, clients who were previously routed to replicas in that zone are routed to new replicas because the previous replicas are no longer available. Any state associated with the previous replicas is lost.

    No new instances of jobs will be started in the faulty zone.

- **Instance management:** New replica instances might be created in healthy zones if your autoscaling rules trigger based on increased load.

### Zone recovery 

When an availability zone recovers from failure, Container Apps automatically reintegrates the zone into active service without requiring your intervention. The platform's health probes detect when infrastructure in the recovered zone becomes available and Container Apps begins scheduling new replicas to that zone based on your scaling configuration. Existing replicas in healthy zones continue to serve traffic during the reintegration process, which helps prevent service disruption.

Container Apps gradually rebalances replica distribution across all available zones as part of normal scaling operations. This automatic rebalancing occurs when replicas are created because of scaling events or when unhealthy replicas are replaced. The platform doesn't force immediate redistribution of existing healthy replicas, which prevents unnecessary container restarts and maintains application stability during recovery.

### Test for zone failures

The Container Apps platform manages traffic routing, failover, and failback for zone-redundant container apps. This feature is fully managed, so you don't need to initiate or validate availability zone failure processes.

To validate your application's resilience to zone failures, simulate zone-level disruptions at the application layer by using controlled testing approaches. Stop or remove replicas from specific zones by scaling down your application, and monitor how the remaining replicas handle the increased load. [Monitor key metrics](../container-apps/observability.md) during resilience testing, including replica count, request success rates, response times, and autoscaling behavior. Ensure that your minimum replica count maintains service availability when replicas are removed and verify that your scaling rules can handle the increased load on the remaining replicas. Test your health probe configurations by deliberately failing health endpoints to confirm that the platform removes unhealthy instances from rotation during your expected timeframes.

## Resilience to region-wide failures

Container Apps is a single-region service. If the region becomes unavailable, your environment and apps are also unavailable.

### Custom multi-region solutions for resiliency

To reduce the risk of a single-region failure affecting your application, you can deploy environments across multiple regions. The following steps help strengthen resilience:

- Deploy your applications to environments in each region. Each environment requires its own virtual network configuration, and subnet requirements apply independently to each regional deployment. Your container images must be available from all regions, which you can achieve by using Azure Container Registry with geo-replication enabled.

- Configure load balancing and failover policies by using a service like Azure Front Door or Azure Traffic Manager.

- Replicate your data across regions so that you can recover your last application state.

## Backup and restore

Container Apps doesn't provide built-in backup capabilities for your applications or data. As a stateless container hosting platform, Container Apps expects applications to manage their own data persistence and recovery strategies through external services. Your application containers and their local file systems are ephemeral, and any data stored locally is lost when replicas restart or move.

## Resilience during application updates

Use revision management to deploy updates to your application without downtime. You can create new revisions with updated container images and perform a cutover by using a [blue-green deployment strategy](../container-apps/blue-green-deployment.md), or gradually shift traffic by using [traffic splitting rules](../container-apps/traffic-splitting.md). During application updates, the platform maintains minimum replica counts by creating new containers before decommissioning old ones, which helps prevent service disruptions.

For more information, see [Update and deploy changes in Container Apps](../container-apps/revisions.md).

## Resilience to service maintenance

Container Apps performs automatic platform maintenance to apply security updates, deploy new features, and improve service reliability. The platform uses rolling updates across fault domains and availability zones to reduce disruption to running applications. During maintenance windows, your containers continue to run without interruption because updates are applied to the underlying infrastructure in stages.

You can specify your own maintenance windows, which are periods of time that you want to have maintenance performed on your apps. Keep in mind that critical updates might occur outside of your maintenance windows. For more information, see [Container Apps planned maintenance](../container-apps/planned-maintenance.md).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

The availability SLA for Container Apps is based on the scale rules that you set on your apps.

## Related content

- [Container Apps overview](../container-apps/overview.md)
- [Health probes in Container Apps](../container-apps/health-probes.md)
- [Autoscaling in Container Apps](../container-apps/scale-app.md)
- [Observability in Container Apps](../container-apps/observability.md)
- [Azure reliability documentation](./overview.md)
- [Well-Architected Framework reliability guidance](/azure/well-architected/reliability/)


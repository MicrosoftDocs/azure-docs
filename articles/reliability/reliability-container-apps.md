---
title: Reliability in Azure Container Apps
description: Learn about reliability in Azure Container Apps, including availability zones and multi-region deployments.
ms.author: cshoe
author: craigshoemaker
ms.topic: reliability-article
ms.custom: subject-reliability, devx-track-azurepowershell, devx-track-azurecli
ms.service: azure-container-apps
ms.date: 10/23/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Container Apps works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Container Apps

Azure Container Apps is a fully managed serverless container hosting service for deploying microservices and containerized applications. This article describes reliability support in [Azure Container Apps](../container-apps/overview.md). It covers intra-regional resiliency via [availability zones](#availability-zone-support) and [cross-region disaster recovery options](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

To learn about how to deploy Container Apps to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure Container Apps in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-container-apps).

## Reliability architecture overview

When you use Container Apps, you deploy an *environment*, which serves as the foundational deployment unit and represents a secure boundary around a group of container apps. The environment is where you configure core settings, including availability zone support and networking configuration. There are two types of environment: workload profiles environments and consumption-only environments. For more information, see [Compute and billing structures in Azure Container Apps](/azure/container-apps/structure).

Within a single environment, you can deploy multiple *apps*, each of which runs one or more *containers*. An environment can also run one or more *jobs*, which represent non-interactive tasks. For more information, see [Containers in Azure Container Apps](/azure/container-apps/containers) and [Jobs in Azure Container Apps](/azure/container-apps/jobs).

Each app has one or more *replicas*, which represents the running instances of the app. You can control how your app scales, including the minimum and maximum number of replicas, and how the app dynamically adds and removes replicas. The platform's scheduler ensures optimal distribution across physical hosts while respecting your minimum replica count requirements. For more information, see [Set scaling rules in Azure Container Apps](/azure/container-apps/scale-app).

:::image type="content" source="./media/reliability-container-apps/reliability-architecture.svg" alt-text="Diagram that shows a Container Apps environment that runs an app with three replicas." border="false" :::

Container Apps is designed to support the reliability of your applications using a variety of capabilities, including:

- **Automatic health monitoring.** The built-in ingress controller automatically load balances traffic across healthy replicas. If a replica fails health checks or its underlying infrastructure becomes unavailable for a prolonged time, the service automatically restarts failed containers or creates replacement replicas, redistributes traffic away from unhealthy replicas, and manages network retries within the cluster. This automatic recovery process requires no customer intervention and maintains your specified replica count. For more information, see [Health probes](../container-apps/health-probes.md).

- **Application resiliency through Dapr.** Container Apps provides tight integration with Dapr, which is a framework that offers a variety of features for operating production-grade microservices and containerized applications, including for resilience to issues in other services. For more information, see [Microservices with Azure Container Apps](/azure/container-apps/microservices).

- **Infrastructure resiliency** for system components including the control plane, ingress controllers, and container runtime. In regions with availability zones, Container Apps provides zone redundancy. To learn more, see [Availability zone support](#availability-zone-support).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Container Apps automatically handles many transient faults through its platform-level retry mechanisms and health monitoring. Follow these recommendations to ensure your applications are resilient to transient faults:

- **Configure health probes** that allow the platform to detect and respond to application-specific failure conditions. Set appropriate failure thresholds and timeout values based on your application's startup characteristics - for example, use a failure threshold of 3 with a period of 10 seconds for liveness probes to avoid premature container restarts during temporary issues. For more information, see [Health probes](../container-apps/health-probes.md).

- **Use service discovery resiliency policies (preview)** to proactively prevent, detect, and recover from service request failures using simple resiliency policies. For example, when you use a resiliency policy, each incoming request to the app can automatically be retried if there's a transient fault that prevents the app from responding. For more information, see [Service discovery resiliency (preview)](/azure/container-apps/service-discovery-resiliency).

- **Implement retry logic** within your applications for external service calls, database connections, and API requests.
    
    If your application uses Dapr to integrate with cloud services, use [Dapr component resiliency (preview)](/azure/container-apps/dapr-component-resiliency) to configure retries, timeouts, and circuit breakers.

    For other dependencies, your application must handle transient faults. Use exponential backoff strategies and circuit breaker patterns when calling external services to prevent cascading failures during downstream service disruptions. Container Apps' built-in service discovery and load balancing automatically route traffic away from failing instances, but your application-level retry policies ensure graceful handling of transient issues before the platform-level health checks trigger container restarts.

- **Design jobs to be resilient to transient faults**, including failures of the job execution or of its dependencies. Design your jobs to resume work if they're restarted, or design for idempotence so that they can be rerun safely.

## Availability zone support

[!INCLUDE [Availability zone support description](includes/reliability-availability-zone-description-include.md)]

When you create a Container Apps environment, you can enable *zone redundancy* to distribute the underlying infrastructure across multiple availability zones within the selected Azure region. Container Apps automatically schedules the replicas of your apps across zones. This distribution happens transparently - you don't need to specify zone placement for individual replicas.

Zone redundancy enhances your application's resilience to zone-level failures by ensuring that your container app's replicas are spread across multiple zones.

The following diagram shows an example zone-redundant container app that has three replicas, each running in a separate availability zone:

:::image type="content" source="./media/reliability-container-apps/zone-redundant.svg" alt-text="Diagram that shows a zone-redundant app with three replicas, each running in a separate availability zone." border="false" :::

### Region support

Zone redundancy is available in all regions that support Container Apps and availability zones.

To see which regions support availability zones, see [Azure regions with availability zone support](./regions-list.md).

To see which regions support Container Apps, see [Product Availability by Region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

### Requirements

Zone redundancy is available to all Container Apps plans including both Consumption and Dedicated workload profiles.

However, to use availability zones with Azure Container Apps you must meet the following requirements:

- **Enable zone redundancy during environment creation.** This setting cannot be changed after the environment is created.

- **Deploy a Container Apps environment within a virtual network.** The virtual network must be in a region that supports availability zones. Ensure that the virtual network has an adequately sized subnet. Consumption-only environments need a subnet with a `/23` CIDR range or larger, while workload profiles environments require `/27` or larger.

- **Configure your minimum replica count to at least two** to ensure distribution across multiple availability zones. Consider setting a higher minimum replica count if any of these conditions apply:
    - Your expected peak load needs more than two replicas.
    - You need to be resilient to multiple simultaneous zone outages.
    - You want to minimise the time you wait for new replicas to be created in other zones during a zone outage.

### Configure availability zone support

- **Create a zone-redundant Container Apps environment.** For deployment instructions covering the Azure portal, Azure CLI, and Azure PowerShell, see [How-to: Create a zone-redundant container app](../container-apps/how-to-zone-redundancy.md).

- **Migrate to zone-redundant deployment.** You can't enable zone redundancy on an existing Container Apps environment. To upgrade existing environments that aren't zone-redundant, create a new environment with zone redundancy enabled in a supported region. Then, redeploy your container apps.

- **Disable zone redundancy.** Zone redundancy can't be disabled after enabling it during environment creation. If you require a non-zone-redundant deployment, you must create a new environment without enabling the zone redundancy option or deploy to a region that doesn't support availability zones.

- **Verify**. You can use the Azure portal, Azure CLI, and Azure PowerShell to verify the zone redundancy status of your environment. For instructions, see [Verify zone redundancy](../container-apps/how-to-zone-redundancy.md#verify-zone-redundancy).

### Cost

You don't incur additional charges beyond the standard Container Apps pricing when you enable zone redundancy for Azure Container Apps. You pay the same rates for compute resources, requests, and vCore seconds whether zone redundancy is enabled or not. For more information, see [Azure Container Apps pricing](https://azure.microsoft.com/pricing/details/container-apps/) and [Container Apps billing](../container-apps/billing.md).

### Capacity planning and management

If an availability zone becomes unavailable, the Container Apps platform uses your scale rules to decide when to replace any lost replicas within that zone. It's important that your scale rules are correctly configured so that the scheduler can make the appropriate scheduling decisions. 

To configure your scale rules properly, follow these principles:

- **Set a minimum number of replicas** that your application can tolerate. It might take a short period of time for lost replicas to be replaced, because the platform needs to detect that the old replicas have been lost, then new replicas need to start and return a healthy readiness probe status before they can be sent incoming requests. If you can't tolerate any period of time where you might have fewer than the minimum replicas that you've specified, consider [over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning) to ensure your application remains performant even if a zone becomes unavailable.

- **Set resource requests and limits** appropriately for your containers to ensure the Container Apps scheduler can make optimal placement decisions across zones. Underspecified resource requirements can lead to uneven distribution or placement failures during high load.

For more information, see [Set scaling rules](../container-apps/scale-app.md) for configuration options.

### Normal operations

This section describes what to expect when Container Apps resources are configured for zone redundancy and all availability zones are operational.

- **Traffic routing between zones**. With zone-redundant Container Apps, the platform operates in an active/active model where multiple replicas simultaneously serve traffic. The ingress controller distributes incoming requests across all healthy replicas regardless of their zone location, using round-robin load balancing by default. Each zone processes requests independently, and the platform doesn't prioritize any particular zone for traffic distribution. Health probes originate from all zones to ensure accurate health assessment of each replica from multiple perspectives.

- **Data replication between zones**. Container Apps doesn't replicate application data between zones because it's designed for stateless workloads. Any data your app stores in [ephemeral storage](/azure/container-apps/storage-mounts#ephemeral-storage), including in container-scoped storage and replica-scoped storage, is deleted when the container or replica is shut down.

    For stateful data requirements, [mount an Azure Files file share](/azure/container-apps/storage-mounts#azure-files) configured for zone-redundant storage, or use other Azure services like Azure Cosmos DB or Azure SQL Database that provide their own cross-zone replication capabilities.

    The platform replicates only the control plane metadata including your app configurations, scaling rules, and secrets across zones for high availability. Container images are pulled from your container register into each zone as needed when replicas are created.

### Zone-down experience

This section describes what to expect when Azure Logic Apps resources are configured for zone redundancy and there's an availability zone outage.

- **Detection and response**: Azure automatically detects zone failures. Container Apps immediately stops scheduling new replicas to the failed zone and begins redistributing traffic to healthy replicas in the remaining zones. The platform handles all failover operations automatically without requiring your intervention.

- **Notification**: Container Apps doesn't notify you when a zone is down. However, you can use [Azure Service Health](/azure/service-health/overview) to understand the overall health of the Container Apps service, including any zone failures. Set up alerts to receive notifications of zone-level problems. For more information, see [Create Service Health alerts in the Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal).

    You can also monitor the health of your apps through Container Apps metrics in Azure Monitor. Configure alerts on replica count drops and request failure rates to receive immediate notification when zone-related issues occur.

- **Active requests**: In-flight requests to replicas in the failed zone may be dropped, or experience timeouts or connection errors. Any job executions running in the affected zone are aborted and marked as failed.

- **Expected data loss**: No data loss occurs at the Container Apps platform level since the service is designed for stateless workloads. Any data stored in [ephemeral storage](/azure/container-apps/storage-mounts#ephemeral-storage) within the availability zone is lost when the replica is terminated, and ephemeral storage should only be used for temporary data.

- **Expected downtime**: Applications experience minimal to no downtime during zone failures. The actual impact depends on your application's health probe settings and the number of replicas in healthy zones. Ensure clients follow [transient fault handling guidance](#transient-faults) to minimize any impact.

    Any job executions running in the affected zone are aborted and marked as failed. If you need a job to be resilient to a zone failure, configure retries, or configure parallelism so that the job runs copies of the same execution. For more information, see [Advanced job configuration](/azure/container-apps/jobs#advanced-job-configuration).

- **Traffic rerouting**: The ingress controller's health probes quickly detect unreachable replicas and remove them from the load balancing pool. Depending on your app's health probe configuration, this typically happens within about 30 seconds. Subsequent incoming traffic is distributed across the remaining healthy replicas. This happens transparently to clients, who continue using the same application URL.

    If you have enabled [session affinity](../container-apps/sticky-sessions.md), and a zone goes down, clients who were previously routed to replicas in that zone are routed to new replicas because the previous replicas are no longer available. Any state associated with the previous replicas is lost.

    Any new job executions won't be scheduled in the faulty zone.

- **Instance management:** New replica instances may be created in healthy zones if your autoscaling rules trigger based on increased load.

### Zone recovery 

When an availability zone recovers from failure, Container Apps automatically reintegrates the zone into active service without requiring your intervention. The platform's health probes detect when infrastructure in the recovered zone becomes available and begins scheduling new replicas to the zone based on your scaling configuration. Existing replicas in healthy zones continue serving traffic during this reintegration process, ensuring no service disruption.

Container Apps gradually rebalances replica distribution across all available zones as part of normal scaling operations. This automatic rebalancing occurs when replicas are created due to scaling events or when unhealthy replicas are replaced. The platform doesn't force immediate redistribution of existing healthy replicas, which prevents unnecessary container restarts and maintains application stability during recovery.

### Test for zone failures

The Container Apps platform manages traffic routing, failover, and failback for zone-redundant container apps. This feature is fully managed, so you don't need to initiate or validate availability zone failure processes.

To validate your application's resilience to zone failures, simulate zone-level disruptions at the application layer using controlled testing approaches. Stop or remove replicas from specific zones by scaling down your application and monitoring how the remaining replicas handle the increased load. [Monitor key metrics](../container-apps/observability.md) during your resilience testing including the replica count, request success rates, response times, and autoscaling behavior. Ensure your minimum replica count maintains service availability when replicas are removed, and verify that your scaling rules can handle the increased load on the remaining replicas. Test your health probe configurations by deliberately failing health endpoints to confirm the platform correctly removes unhealthy instances from rotation within your expected timeframes.

## Multi-region support

Container Apps is a single-region service. If the region becomes unavailable, your environment and apps are also unavailable.

### Alternative multiple-region approaches

To reduce the risk of a single-region failure affecting your application, you can deploy environments across multiple regions. The following steps help strengthen resilience:

- Deploy your applications to the environments in each region. Each environment requires its own virtual network configuration, and the subnet requirements apply independently to each regional deployment. Your container images must be accessible from all regions, which you can achieve by using Azure Container Registry with geo-replication enabled.
- Configure load balancing and failover policies by using a service like Azure Front Door or Azure Traffic Manager.
- Replicate your data across regions so that you can recover your last application state.

## Backups

Azure Container Apps doesn't provide built-in backup capabilities for your applications or data. As a stateless container hosting platform, Container Apps expects applications to manage their own data persistence and recovery strategies through external services. Your application containers and their local file systems are ephemeral, and any data stored locally is lost when replicas restart or move.

## Reliability during application updates

Use revision management to deploy updates to your application without downtime. You can create new revisions with updated container images, and perform a cutover using a [blue-green deployment strategy](../container-apps/blue-green-deployment.md), or gradually shift traffic using [traffic splitting rules](../container-apps/traffic-splitting.md). During application updates, the platform ensures minimum replica counts are maintained by creating new containers before terminating old ones, preventing service disruption. 

For more information, see [Update and deploy changes in Azure Container Apps](../container-apps/revisions.md).

## Reliability during service maintenance

Azure Container Apps performs automatic platform maintenance to apply security updates, deploy new features, and improve service reliability. The platform uses rolling updates across fault domains and availability zones to minimize impact on running applications. During maintenance windows, your containers continue running without interruption as updates are applied to the underlying infrastructure in stages.

You can specify your own maintenance windows, which are periods of time that you want to have maintenance performed on your apps. However, critical updates might occur outside of your maintenance windows. For more information, see [Azure Container Apps planned maintenance](../container-apps/planned-maintenance.md).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

The availability SLA for Azure Container Apps is based on the scale rules you set on your apps.

## Related content

- [Azure Container Apps overview](../container-apps/overview.md)
- [Health probes in Azure Container Apps](../container-apps/health-probes.md)
- [Autoscaling in Azure Container Apps](../container-apps/scale-app.md)
- [Observability in Azure Container Apps](../container-apps/observability.md)
- [Azure reliability documentation](./overview.md)
- [Azure Well-Architected Framework reliability guidance](/azure/well-architected/reliability/)

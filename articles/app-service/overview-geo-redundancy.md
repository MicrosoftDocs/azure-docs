---
title: Overview of geo-redundancy in Azure App Service (Preview)
description: Learn how geo-redundancy in Azure App Service creates and manages regional silos, synchronizes app deployments, and routes traffic across regions.
author: btardif
ms.author: anwestg
ms.topic: overview
ms.service: azure-app-service
ms.date: 11/17/2026
ms.custom: references_regions
---

# Overview of geo-redundancy in Azure App Service (preview)

Geo-redundancy in Azure App Service creates and maintains regional silos (replicas) of a web app to help it remain available when a region becomes unavailable. Instead of provisioning a separate App Service deployment in each region and keeping the deployments aligned yourself, you manage a primary app and let App Service maintain its silos.

You can use a new or existing eligible App Service plan and web app. App Service manages the corresponding plan and app in each silo region, synchronizes supported published content and configuration, and manages an Azure Traffic Manager profile for a single application endpoint. You can use the silos for automatic regional failover or to serve traffic from multiple regions.

This article explains the replication boundary, how site revisions and traffic routing work, and what to consider before using geo-redundancy.

> [!IMPORTANT]
> Geo-redundancy replicates App Service infrastructure and supported app properties. It doesn't replicate resources or application data in backing services such as Azure SQL Database, Azure Cosmos DB, Azure Storage, or Azure Key Vault. A replica can be available while the application remains unavailable because a required dependency is down.

## When to use geo-redundancy

Consider geo-redundancy when you want managed cross-region replicas of an eligible web app and want to reduce the work of maintaining separate regional deployments.

Geo-redundancy, zone redundancy, and backups address different needs:

| Capability | What it addresses | What it doesn't replace |
|---|---|---|
| Geo-redundancy | Maintains the app in additional regions and provides managed traffic routing between regional deployments. | Cross-region resilience for databases and other dependencies. |
| Zone redundancy | Distributes App Service plan instances across availability zones within a region. | A deployment in another region. |
| Backups | Preserve recoverable copies of content or data according to the backup service you use. | A running regional deployment and traffic failover. |

For zone-redundancy requirements, see [Configure App Service plans for zone redundancy](/azure/app-service/configure-zone-redundancy). For an architecture where you manage the regional deployments and routing yourself, see [Create a highly available multi-region app in Azure App Service](/azure/app-service/tutorial-multi-region-app).

Start your evaluation with a nonproduction web app whose dependencies you can test in every selected region.

## How geo-redundancy works

A geo-redundant app includes the following components:

- **Primary app:** The App Service web app that you manage and deploy to.
- **Regional silo:** A platform-managed copy of the app and its corresponding App Service plan in another region.
- **Site revision:** A snapshot of supported published content and configuration. A revision identifies what a replica runs; it isn't a copy of the application's database or live runtime state.
- **Shared application endpoint:** The single entry point associated with the managed Traffic Manager profile. DNS resolution directs clients to a regional app endpoint.

<!-- ![Conceptual diagram showing DNS-based endpoint selection, direct client connections to regional apps, primary-to-replica synchronization, and backing services outside the replication boundary.](media/geo-redundancy-overview.svg)

The diagram shows one replica for clarity, not a replica-count limit. Traffic Manager participates in DNS resolution; application requests don't pass through it. -->

## Application versions and traffic routing

You deploy applications to the primary app. Silos synchronize applications based on two modes - Automatic and Fixed. The default behavior is Automatic, which synchronizes the application across regional silos whenever the primary app is updated. As an alternative, you can pin a regional silo to a specific last-known good version rather than have it advance automatically. In Fixed mode, a silo runs the last known good revision until you promote another revision. Before serving traffic from a pinned revision, you must verify compatibility with the current databases, secrets, and APIs. Pinning application content doesn't roll back those dependencies.

> [!IMPORTANT]
> FTP uploads, writes direct to the virtual file system, and other direct file edits don't synchronize automatically.

## What App Service manages

App Service manages the following components for geo-redundant apps.

| Component | Managed behavior | Boundary to understand |
|---|---|---|
| App Service plan | Provisions and maintains a corresponding plan, including the plan SKU, instance count, and zone-redundancy configuration. | Each target region needs compatible capacity and feature support. |
| Web app | Creates and maintains the regional app. | The regional silo isn't a separately maintained deployment target. Continue deploying to the primary. |
| Published content and configuration | Synchronizes supported content and a configuration snapshot from the primary. | Not every App Service setting or attached feature is replicated. See [Preview scope and current limitations](#preview-scope-and-current-limitations). |
| Managed identity | Replicates supported managed identity configuration. | This doesn't create or replicate the resources the identity accesses. Verify access to each dependency from each region. |
| Traffic Manager | Maintains the profile used for the shared application endpoint and regional routing. | Routing doesn't replicate data, move an existing connection, or make an unavailable dependency healthy. |

## Traffic routing and regional failover

App Service manages the Traffic Manager profile used by the geo-redundant app. Clients resolve the shared application's DNS name and connect directly to the selected regional endpoint. Traffic Manager isn't an HTTP proxy and doesn't terminate the application's TLS connection.

Geo-redundancy supports these scenarios:

- **Regional failover:** When the primary endpoint is detected as unhealthy, routing can select an available regional silo for subsequent DNS resolutions.
- **Traffic distribution:** Regional silos can serve traffic when the application and its dependencies support operation in multiple active regions.

Clients and recursive resolvers can cache DNS responses. Health detection, DNS time-to-live (TTL), client caching, and application reconnection behavior affect how quickly traffic moves. An existing connection isn't transferred to a replica. For the underlying routing behavior, see [How Azure Traffic Manager works](/azure/traffic-manager/traffic-manager-how-it-works).

## Application planning

Geo-redundancy in Azure App Service doesn't by itself make your complete application architecture regionally resilient. When planning to deploy an application using this capability, consider how much downtime and data loss your application can tolerate. Review the following areas before adding regional silos.

### Application data and state

Geo-redundancy synchronizes content with regional silos as the result of a deployment event.  Don't use this feature as a replication strategy for user uploads, session state, or database files.  You must plan durable application state separately from the replicated deployment.  For example, a regional silo might reach a database in the primary region during normal operations but lose access if that region fails.

Applications distributed across multiple regions also provide challenges for session data and background processing.  Don't rely solely on in-memory state in the primary app as a user's next request might reach a different regional app.

### Networking considerations

When the primary app uses virtual network integration, each regional silo equally needs to be virtual network integrated and you must provide an eligible integration subnet in each region.  You must plan the associated network structure separately.

### Capacity and quota availability

Each regional silo needs App Service plan instances in its selected region.  While planning a geo-redundant application, ensure that the planned SKU for regional silos is available and sufficient quota is requested for the scale required.

## Preview scope and current limitations

Geo-redundancy in Azure App Service is in public preview. As such, not all App Service features are currently available.

| Limitation | Details |
|---|---|
| Platform | - Windows only (no Linux or container support)<br> - Not available in App Service Environment  |
| SKUs | Pv3, PMv3, Pv4, and PMv4 only |
| Application Type | Web Apps only, support for Function and Logic Apps isn't available |
| Regions |  East Asia, West Central US, North Europe, West US 2 |
| Authentication | App Service Authentication isn't available |
| Deployment Slots | Not available |
| Custom domains and Certificates | Not available |
| Direct File Changes | Not synchronized automatically. |
| Bring Your Own Storage | Not available |

## Costs of geo-redundancy in Azure App Service

When you use geo-redundancy in Azure App Service, you pay for the primary app's App Service Plan instances, the regional silo instances, and an extra monthly charge for each web application that has geo-redundancy enabled. For more information, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/).

## Next steps

- [Quickstart: Configure geo-redundancy for an Azure App Service app](quickstart-geo-redundancy.md)
- [Configure and manage geo-redundancy in Azure App Service](configure-geo-redundancy.md)
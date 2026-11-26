---
title: "Configure and manage Geo-redundancy in Azure App Service (Preview)"
description: Learn how to configure traffic routing, revisions, silo regions, networking, App Service plans, and failover for geo-redundant Azure App Service apps.
author: btardif
ms.author: anwestg
ms.topic: how-to
ms.service: azure-app-service
ms.date: 11/17/2026
---

# Configure and manage geo-redundancy in Azure App Service (preview)

After you configure geo-redundancy for an Azure App Service app, you can control how traffic is distributed between regions, how application revisions are synchronized, and how individual silo regions are configured.

This article describes how to:

* Understand and configure traffic routing
* Understand and configure revision synchronization and last known good
* Manage silo regions
* Configure silo regions
* Monitor regional health and failover.

## Prerequisites

A [web application setup for geo-redundancy in Azure App Service](quickstart-geo-redundancy.md).

## Understand and configure traffic routing

Geo-redundancy in App Service provides two traffic modes:

| Mode | Behavior |
| --- | --- |
| **Active** | Traffic is distributed across all healthy regions based on weight. |
| **Passive** | Traffic is sent to the primary region and fails over to secondary regions by priority. |

To change traffic mode:

1. Open your App Service app in the Azure portal.
1. Under **App Service plan**, select **Geo-redundancy (preview)**.
1. Next to **Traffic mode**, select **Change**.
1. Select **Active** or **Passive**.
1. Select **Save**.

Each traffic mode has different controls for routing.

| Aspect | Active | Passive |
| --- | --- | --- |
| Routing control | Weight | Priority |
| Healthy operation | Traffic is distributed across healthy regions based on weight. | Traffic is sent to the primary region. |
| Unhealthy region | Healthy regions continue serving traffic. | Traffic fails over to a healthy secondary according to priority. |
| Recovery | The recovered endpoint can participate again in Active routing. | Traffic returns to the healthy higher-priority region. |

> [!NOTE]
> Traffic routing uses Traffic Manager DNS responses rather than per-request proxying. In Active mode, weights influence which eligible regional endpoint is returned for a DNS resolution; they don't guarantee an exact request split. In Passive mode, priority determines the first eligible endpoint returned.
>
> Failure- or recovery-driven routing changes depend on probes detecting the endpoint's health change, so probe detection introduces delay. Clients and recursive resolvers can continue using cached DNS answers after the response changes. Even new connections can therefore reach a previously selected region until those caches refresh or expire.
>
> Established HTTP keep-alive, HTTP/2, WebSocket, and other TCP connections remain attached to their current endpoint until the connection closes or is lost. DNS doesn't migrate connections or replay in-flight work. After cached answers refresh, a new resolution can select an eligible region according to the configured mode; a new connection can then use that endpoint.
>
> The endpoint health shown in the portal reflects the routing probe result and doesn't by itself prove that the application and all dependencies are fully ready. Design the application to reconnect and retry only when the operation is safe.
>
> Normally, Traffic Manager selects healthy, enabled endpoints that are eligible under the configured traffic mode. If all eligible endpoints are degraded, Traffic Manager makes a best-effort selection by treating those degraded endpoints as online instead of returning no endpoint. Disabled endpoints aren't eligible for new Traffic Manager DNS selection and aren't included in this exception.
>

### Configure Active traffic mode

In **Active** traffic mode, App Service distributes traffic across healthy regions based on the configured regional weights.

When you select Active mode, the region table displays a **Weight** setting for each region.

To change the distribution:

1. Locate the region under **Regions**.
1. Change its **Weight**.
1. Repeat for any other regions that you want to change.
1. Select **Apply changes**.

### Configure Passive traffic mode

In **Passive** mode, traffic goes to the primary region and fails over to secondary regions by priority.

When you enable Passive mode, the region table shows **Priority** instead of Weight.

The primary region has priority 1. Secondary regions have the next priorities.

To change the priority of a secondary region:

1. Find the silo under **Regions**.
1. Select its **Priority**.
1. Choose the priority you want.
1. Select **Apply changes**.

## Revision synchronization

Each silo region has a revision synchronization setting that controls how the region gets application revisions.

To view or change the setting:

1. On **Geo-redundancy (preview)**, select the silo region.
1. On **Edit region > Basics**, find **Revision sync**.
1. Select a synchronization mode.
1. Select **Save**.

Two modes are available:

### Automatic

With **Automatic** revision synchronization, revisions synchronize when the primary region updates.

Use this mode when the silo should follow application revisions deployed to the primary.

### Fixed

With **Fixed** synchronization, a silo stays on the stable revision until a newer revision is promoted.

Use fixed synchronization with Last Known Good to protect a silo from immediately receiving a newer application revision.

## Configure last known good

Last known good identifies the stable application revision that secondary regions can remain pinned to.

For example, the primary might be running revision 4 while a fixed silo continues running last known good revision 3.

> [!IMPORTANT]
> Marking a revision as last known good selects the latest ready revision, which can temporarily lag behind the application deployed to the primary. It doesn't select a specific revision number. Avoid further deployments or configuration changes between validation and promotion.

To update last known good:

1. **Validate** the primary revision before marking it as last known good.
1. On **Geo-redundancy (preview)**, select **Configure last known good**.
1. Review the revision currently shown as **Last known good**.
1. Select **Mark latest revision as last known good**.
1. Select **Save**.

After the update completes, the portal displays confirmation that last known good was successfully set.

After saving, verify the promotion:

1. Confirm that **Last known good** matches the primary revision you recorded and validated.  If it doesn't match, wait for the intended revision to become ready, repeat the promotion, and check again.
1. For each silo using **Fixed** revision synchronization, wait until **Revision version** matches the confirmed last known good revision.
1. Confirm that each participating regional endpoint reports **Healthy**.
1. Verify application and dependency behavior through each regional endpoint. A matching revision number and healthy routing probe don't by themselves establish application readiness.

This workflow lets you deploy a revision to the primary, validate the revision, and then identify the revision as last known good for fixed silo regions.

## Manage silo regions

### Add extra silo regions

> [!IMPORTANT]
> If your primary silo is configured for virtual network integration, all additional regional silos must also be configured for virtual network integration. You must provide an eligible integration subnet in each region.

You can add multiple silo regions to a geo-redundant app.

1. On **Geo-redundancy (preview)**, select **Add silo region**.
1. Select an available **Region**.
1. Configure **Revision sync mode**.
1. Configure virtual network integration if required.
1. Select **Add**.

The region selector categorizes regions based on availability. You can't select regions that already participate in the application.

After you add a region, monitor **Endpoint health** until the region reaches the expected health state.

### Edit a silo region

Select a silo from the **Regions** table to open **Edit region**.

The edit experience provides three groups of settings:

* **Basics**
* **Networking**
* **App Service Plan**

#### Basics

The **Basics** tab displays regional configuration and status information, including:

* Region
* Traffic weight or priority
* Endpoint URL
* Revision sync
* Revision version
* Endpoint health
* Status

Use **Revision sync** to change between Automatic and Fixed revision synchronization.

#### Networking

Configure each silo with virtual network integration.

1. Open **Edit region**.
1. Select **Networking**.
1. Select **Enable virtual network integration**.
1. Select a **Virtual network**.
1. Select a **Subnet**.
1. Select **Save**.

If you don't need virtual network integration, don't select **Enable virtual network integration**.

#### App Service plan

Select **App Service Plan** in the **Edit region** pane to configure App Service plan properties for the silo region.

By default, regional silos inherit the App Service plan instance count and zone redundancy configuration from the primary App Service Plan. You can override these settings on each regional silo.

> [!IMPORTANT]
> After you save an instance count or zone redundancy override, the setting no longer inherits the corresponding value from the primary App Service plan. You can change the override later.

For **Instance override**, set the **number** of instances you require for the regional silo.

Before applying changes, verify that the regional plan supports zone redundancy.

For zone redundancy support requirements, see [Configure App Service plans for zone redundancy](configure-zone-redundancy.md). When the effective zone redundancy value is enabled—either because **Zone redundancy** is set to **On** or because **Inherit** obtains an enabled value—the effective instance count must be at least two. Retain any higher effective instance count required for capacity.

Select **Save** to apply changes.

For **Zone redundancy**, select:

* **Inherit** to inherit the setting from the primary App Service plan.
* **On** to configure zone redundancy for the silo App Service plan.
* **Off** to configure the silo without zone redundancy.

Select **Save** to apply any changes.

After you save plan overrides, verify the effective instance count and zone redundancy values shown on the **App Service Plan** tab.

The settings on this tab apply to silos in the region whose primary sites use the same App Service plan.

### Enable or disable a silo region

You can configure multiple silo regions but you might want to control whether they receive managed traffic.  

Here are some common reasons for enabling or disabling a silo region.

| Scenario | When to disable the regional silo | When to enable the regional silo |
| --- | --- | --- |
| Validate a new region | Keep the silo disabled while you verify application content, identity, networking, dependencies, and capacity. | Enable the silo after you confirm that the application is ready to receive traffic. |
| Perform planned maintenance | Disable the silo to exclude it from managed traffic selection before maintenance. Allow time for cached DNS responses and existing connections to expire. | Enable the silo after maintenance is complete and you validate application health. |
| Isolate a regional issue | Disable the silo if the region serves errors, runs an unexpected revision, or can't access required dependencies—even if health probes succeed. | Enable the silo after you resolve the issue and validate behavior |
| Test regional recovery | Disable a silo to test whether the remaining regions can serve the application. First, verify their capacity and data readiness. | Enable the silo after the recovery exercise is complete and you validate the region. |
| Validate a revision change | Disable the silo before changing its revision policy if the resulting application version requires validation before serving traffic. | Enable the silo after you verify the intended revision and its compatibility with application data and schemas. |
| Change regional traffic participation | Disable the silo to temporarily remove the region from managed routing while retaining its deployment. | Enable the silo when the region is ready to participate in managed routing again. |

> [!NOTE]
> Disabling a silo excludes it from managed traffic selection. It doesn't stop the application, deallocate its plan, or block access through its regional hostname. In Passive mode, keep a backup silo enabled so that it remains eligible for fallback routing.

### Disable a silo region

Disabling a silo and removing a silo are separate operations.

To disable a silo:

1. Find the silo under **Regions**.
1. Under **Status**, change the switch from **On** to **Off**.
1. Select **Apply changes**.

While the change is being processed, **Endpoint health** can display **Updating**.

When the operation finishes:

* **Status** displays **Off**.
* **Endpoint health** displays `--`.
* The silo remains listed under **Regions**.

### Enable a silo region

To enable a silo region:

1. Find the silo under **Regions**.
1. Under **Status**, change the switch from **Off** to **On**.
1. Select **Apply changes**.

While the change is processing, **Endpoint health** can display **Waiting**.

When the operation finishes:

* **Status** displays **On**.
* The silo remains listed under **Regions**.

**Status** and **Endpoint health** are evaluated independently. A successful enablement operation sets **Status** to **On**, but it doesn't guarantee that **Endpoint health** reports **Healthy**. Verify the intended revision and application behavior through the regional endpoint and the global endpoint before relying on the silo for traffic.

### Remove a silo region

Removing a silo permanently removes the region backup.

Before a planned deletion, validate that the application and its dependencies are healthy in each surviving region and that those regions have sufficient capacity for the expected traffic. Then [disable the silo](#disable-a-silo-region) that you plan to remove. Cached DNS answers and existing connections can still reference the disabled silo, so account for them before deletion.

1. Find the silo under **Regions**.
1. Select the **Delete** icon.
1. Review the deletion warning.
1. Select **Delete**.

The deletion confirmation warns that the region backup is permanently deleted and that the operation can't be undone.

> [!WARNING]
> Removing a region is irreversible. If you only want to prevent the region from participating, consider disabling it instead.

After the operation completes, verify that the region is no longer listed under **Regions**.

## Monitoring and safe validation

### Monitor geo-redundancy health

The **Geo-redundancy (preview)** page provides health information at two levels.

#### Fleet health

**Fleet health** provides the overall health status for the geo-redundant application.

#### Endpoint health

Each region has its own **Endpoint health** value.

During the workflows shown in this article, endpoint states included:

| State | Portal behavior |
| --- | --- |
| **Healthy** | The regional endpoint is reported as healthy. |
| **Unhealthy** | The regional endpoint is reported as unhealthy. |
| **Updating** | The status can appear while a region configuration change is being applied. |
| **--** | Shown for a disabled silo region. |

The Fleet health and Endpoint health values in the following examples are observations of the routing health signals. They aren't guarantees that the full application and its dependencies are ready.

### Preflight for failure scenarios

Run the failure scenarios in this article only in a nonproduction environment. Before starting a scenario, verify that:

* At least one secondary silo is enabled, reports **Healthy**, and uses **Fixed** revision synchronization pinned to a validated last known good revision.
* Application dependencies are compatible with the revisions in each participating region.
* The surviving region has sufficient capacity for the expected test traffic.
* A validated healthy primary revision is ready to restore.

Also verify application behavior through the participating regional endpoints and the global endpoint before introducing the failure condition.

### Active-mode health and traffic behavior

The following example describes how Active traffic mode behaved when an application revision caused one regional endpoint to become unhealthy.

#### Healthy state

The application has two active regions with equal weights:

* East Asia primary, weight 1
* West US 2 silo, weight 1

Both endpoints are healthy.

Validate each regional endpoint to confirm that its regional app serves successfully. For a controlled test through the global endpoint, obtain an updated DNS selection and open a new connection using that DNS answer. Use an available application marker or correlated logs to determine which region and revision answered; a generic successful HTTP response doesn't provide that proof, and equal weights don't guarantee a particular request split.

#### Introduce an unhealthy primary revision

In this nonproduction example, a newer application revision was deployed to the East Asia primary and caused that endpoint to become unhealthy.

The West US 2 silo uses Fixed revision synchronization and stays on the previous Last Known Good revision.

When the newer primary revision becomes unhealthy:

* East Asia reports **Unhealthy**.
* West US 2 stays **Healthy**.
* Both regions stay **On**.
* Fleet health reports **Unhealthy**.

After Traffic Manager detects East Asia as unhealthy, new DNS resolutions can select the healthy West US 2 endpoint. Clients using a cached DNS answer or an established connection might not move immediately.

To validate failover:

1. **Validate** that the above status is reported in the portal.
1. **Validate** that the West US 2 **regional endpoint** serves the expected revision and that the regional application and its dependencies behave as expected.
1. For a controlled global test, obtain an updated DNS selection for the global endpoint that selects West US 2, and open a new connection using that DNS answer.
1. Use an available application marker or correlated logs to verify that West US 2 and the expected revision answered through the global endpoint. A generic successful HTTP response doesn't provide this proof.

> [!NOTE]
> This example demonstrates the observed behavior of a two-region application with equal Active weights. It doesn't imply that equal weights guarantee an exact 50/50 request distribution.

#### Recover the region

Restore the validated healthy primary revision to East Asia. After probes detect the endpoint as healthy, the endpoint returns to **Healthy**, Fleet health returns to **Healthy**, and the endpoint can participate in weighted DNS selection again. After DNS caches refresh, new resolutions might select either eligible region for new connections, while established connections remain with their current endpoint until closed or lost.

Validate that the East Asia regional endpoint serves the restored revision and that the application and its dependencies behave as expected. Also verify the West US 2 regional endpoint and the global endpoint.

### Passive-mode failover

Passive mode sends traffic to the primary region and fails over to secondary regions according to priority.

The following example uses:

* East Asia primary: Priority 1
* West US 2 silo: Priority 2

In the healthy baseline for this example, both regional endpoints report **Healthy**, East Asia serves as the higher-priority primary, and West US 2 remains enabled as the healthy secondary.

#### Primary failure

In this nonproduction example, a newer revision was deployed to East Asia and caused the primary endpoint to become unhealthy.

The portal reports:

* East Asia, Priority 1: **Unhealthy**
* West US 2, Priority 2: **Healthy**

After Traffic Manager detects the primary as unhealthy, fresh DNS resolutions can select West US 2. To follow that updated DNS selection, the client must open a new connection using that DNS answer. Cached answers and established connections can delay movement, so the application should reconnect and retry only when safe and must not assume that in-flight work is replayed.

To validate failover:

1. **Validate** that the above status is reported in the portal.
1. **Validate** that the West US 2 **regional endpoint** serves the expected regional application and that its dependencies behave as expected.
1. For a controlled global test, obtain an updated DNS selection for the global endpoint that selects West US 2, and open a new connection using that DNS answer.
1. Use an available application marker or correlated logs to verify that West US 2 and the expected revision answered through the global endpoint. A generic successful HTTP response doesn't provide this proof.

#### Primary recovery

Restore the validated healthy primary revision to East Asia. After East Asia returns to a healthy state:

* Fleet health returns to **Healthy**.
* Both regional endpoints report **Healthy**.
* East Asia remains Priority 1.
* West US 2 remains Priority 2.

After Traffic Manager detects East Asia as healthy, fresh DNS resolutions can again select the higher-priority East Asia endpoint. Cached answers and existing connections can keep some clients on West US 2; movement to East Asia requires a DNS resolution selecting East Asia and a new connection using that result.

To validate recovery:

1. **Validate** that the above status is reported in the portal.
1. **Validate** that the East Asia **regional endpoint** serves the expected regional application and that its dependencies behave as expected.
1. **Validate** that the West US 2 **regional endpoint** serves the expected regional application and that its dependencies behave as expected.
1. For a controlled global recovery test, obtain an updated DNS selection for the global endpoint that selects East Asia, and open a new connection using that DNS answer.
1. Use an available application marker or correlated logs to verify that East Asia and the expected revision answered through the global endpoint. A generic successful HTTP response doesn't provide this proof.

## Related content

* [Geo-redundancy architecture and limitations](overview-geo-redundancy.md)
* [Configure App Service plans for zone redundancy](configure-zone-redundancy.md)
* [Monitor App Service instances by using Health Check](monitor-instances-health-check.md)

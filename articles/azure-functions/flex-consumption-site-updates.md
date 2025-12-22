---
title: Site update strategies in Flex Consumption
ms.service: azure-functions
description: Learn how to configure zero downtime deployments and choose the right site update strategy for your Flex Consumption app.
ms.custom: vs-azure
ms.topic: concept-article
ms.date: 12/04/2025
---

# Site update strategies in Flex Consumption

When you host your app with Azure Functions in the [Flex Consumption plan](./flex-consumption-plan.md), you can control how updates are deployed to running instances. A site update occurs whenever you deploy code, modify application settings, or change other configuration properties. The Flex Consumption plan provides a site configuration setting (`SiteUpdateStrategy`) that you can use to control whether your function app experiences downtime during these updates and how in-progress executions are handled.

The Flex Consumption plan currently supports these update strategies:

- **Recreate**: Functions restarts all running instances after replacing your code with the latest version. This approach might cause brief downtime while instances are recycled and preserves the default behavior from other Azure Functions hosting plans.
- **Rolling update** (preview): Provides zero-downtime deployments by draining and replacing instances in batches. In-progress executions complete naturally without forced termination.

[!INCLUDE [functions-flex-rolling-updates-preview-note](../../includes/functions-flex-rolling-updates-preview-note.md)]

## Strategy comparison

This table compares the two site update strategies:

| Consideration | Recreate | Rolling update |
| ------------- | -------- | -------------- |
| Downtime      | Brief downtime as your app scales out from zero after the restart | No period of downtime |
| In-progress executions | Forcefully terminated | Allowed to complete within the [60-minute scale-in grace period](functions-scale.md#timeout) (HTTP functions limited to 230-second timeout) |
| Speed         | Faster - instances are restarted immediately | Slower - instances are updated in batches at regular intervals |
| Backward compatibility | Not necessary as one version runs at a time | Changes must be backward compatible, especially with stateful workloads or breaking changes |
| How to set    | Default behavior, consistent with other hosting plans  | Opt-in configuration |
| Use when... | ✔ You need fast deployments.<br/>✔ Brief downtime is acceptable.<br/>✔ You're deploying breaking changes and need a clean restart.<br/>✔ Your functions are stateless and can handle interruptions.| ✔ You require zero-downtime deployments.<br/>✔ You have long-running or critical functions that can't be interrupted.<br/>✔ Your changes are backward-compatible.<br/>✔ You must preserve in-progress executions. |

## Update strategy behaviors

This table compares the update process of the two strategies: 

:::row:::
   :::column span="":::
    **Recreate strategy**:
   :::column-end:::
   :::column span="":::
    **Rolling update strategy**:
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
    1. A site update (code or configuration changes) is applied to your function app.
    1. The recreate strategy is triggered to update running instances with the new changes.
    1. The platform forcefully restarts all live and draining instances.
    1. The scaling system immediately begins provisioning new instances with the updated version (original instances might still be deprovisioning in the background).
   :::column-end:::
   :::column span="":::
    1. A site update (code or configuration changes) is applied to your function app.
    1. The rolling update strategy is triggered to update running instances with the new changes.
    1. The platform assigns all live instances to batches.
    1. At regular intervals, the platform drains one batch of instances. Draining prevents instances from accepting new events while allowing in-progress executions to complete (up to the one hour maximum execution time).
    1. Simultaneously, the scaling platform provisions new instances running the updated version to replace the draining capacity.
    1. This process continues until all live instances are running the updated version.
   :::column-end:::
:::row-end:::

This table compares the key characteristics of the two strategies: 

:::row:::
   :::column span="":::
    **Recreate strategy**:
   :::column-end:::
   :::column span="":::
    **Rolling update strategy**:
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
    - **Brief downtime**: Your app is unavailable while instances restart and scale out
    - **Execution interruption**: In-progress executions are terminated immediately
    - **No completion signal**: Monitor instance logs to track when original instances stop emitting logs
  :::column-end:::
   :::column span="":::
    - **Zero downtime**: deployments are done in batches so that executions complete without forced termination.
    - **Asynchronous operations**: Draining and scale-out happen simultaneously without waiting for each other to complete. The scale-out isn't guaranteed to occur before the next drain interval.
    - **Overlapping updates**: You can initiate additional rolling updates while one is in progress. All non-latest instances are drained, and only the newest version is scaled out.
    - **Dynamic scaling**: The platform adjusts instance count based on current demand during the update.
    - **Platform managed capacity**: When demand increases, the platform provisions more instances than it drains. When demand decreases, it creates only the necessary instances to meet current needs. This approach ensures continuous availability while optimizing resource usage.
   :::column-end:::
:::row-end:::

 ## Rolling update strategy considerations

Keep these current behaviors and limitations in mind when using the rolling update strategy. This list is maintained during the preview period and could change as the feature approaches general availability (GA). 

- **Platform-managed parameters**: The platform controls the parameters (such as batch count, instances per batch, number of batches, and drain intervals) that determine rolling update behaviors. These parameters might change before GA to optimize performance and reliability.
- **No real-time monitoring**: There's currently no visibility into how many instances are draining, how many batches remain, or current progress percentages.
- **No completion signal**: However, you can monitor instance logs to estimate when an update completes.
- **Single-instance scenarios**: Apps running on one instance experience brief downtime similar to recreate, though in-progress executions still complete.
- **Durable Functions**: Because mixing versions during updates can cause unexpected behavior in a Durable orchestration, use an explicit [orchestration version match strategy](durable/durable-functions-orchestration-versioning.md).
- **Infrastructure as Code**: Deploying code and configuration changes together triggers multiple rolling updates that might overlap.
- **Backward compatibility**: Make sure that your changes work with the previous version during the rolling update transition period.

## Configure your update strategy

You can set the update strategy for your app using the `SiteUpdateStrategy` site setting, which is a child of `functionAppConfig`. By default, `SiteUpdateStrategy.type` is set to `Recreate`. Currently, only Bicep and ARM templates with API version `2023-12-01` or later support changing this property.

### [Bicep](#tab/Bicep)
```bicep
functionAppConfig: {
  ...
  siteUpdateStrategy: {
    type: 'RollingUpdate'
  }
  ...
}
```

### [ARM Template](#tab/json)
```json
"functionAppConfig": {
  ...
  "siteUpdateStrategy": {
    "type": "RollingUpdate"
  }
  ...
}
```

---

Changes to the site update strategy take effect at the next site update. For example, changing `type` from `Recreate` to `RollingUpdate` uses the recreate strategy for that update. All subsequent site updates then use rolling updates.

## Monitoring site updates

During the public preview, there's no built-in completion signal for site updates. You can use KQL queries in Application Insights as a best-effort approach to estimate rolling update progress.

### Monitoring rolling update progress

These KQL queries provide a best-effort estimate of rolling update progress by tracking instance turnover in Application Insights logs. This approach has significant limitations and shouldn't be relied upon for production automation:

```kusto
// Rolling update completion check
let deploymentStart = datetime('2025-10-30T19:00:00Z'); // Set to your deployment start time
let checkInterval = 10s; // How often you run this query
let buffer = 30s; // Safety buffer for instance detection
//
// Get original instances (active before deployment)
let originalInstances = 
    traces
    | where timestamp between ((deploymentStart - buffer) .. deploymentStart)
    | where cloud_RoleInstance != ""
    | summarize by InstanceId = cloud_RoleInstance;
//
// Get currently active instances
let currentInstances = 
    traces
    | where timestamp >= now() - checkInterval
    | where cloud_RoleInstance != ""
    | summarize by InstanceId = cloud_RoleInstance;
//
// Check completion status
currentInstances
| join kind=leftouter (originalInstances | extend IsOriginal = true) on InstanceId
| extend IsOriginal = isnotnull(IsOriginal)
| summarize 
    OriginalStillActiveInstances = make_set_if(InstanceId, IsOriginal),
    NewInstances = make_set_if(InstanceId, not(IsOriginal)),
    OriginalStillActiveCount = countif(IsOriginal),
    NewCount = countif(not(IsOriginal)),
    TotalOriginal = toscalar(originalInstances | count)
| extend 
    RollingUpdateComplete = iff(OriginalStillActiveCount == 0, "YES", "NO"),
    PercentComplete = round(100.0 * (1.0 - todouble(OriginalStillActiveCount) / todouble(TotalOriginal)), 1)
| project RollingUpdateComplete, PercentComplete, OriginalStillActiveCount, NewCount
```

How to use this query for estimation:

1. Paste this query in the Logs blade of the Application Insights resource associated with your function app.
1. Set `deploymentStart` to the timestamp when your site update returns success.
1. Run the query periodically to estimate progress. Set the polling interval to be at least as long as your average function execution time, and ensure the `checkInterval` variable in the query matches this polling frequency.
1. The query returns approximate values:
   - `RollingUpdateComplete`: Best estimate of whether all original instances are replaced
   - `PercentComplete`: Estimated percentage of original instances that are replaced
   - `OriginalStillActiveCount`: Estimated number of original instances still running
   - `NewCount`: Number of new instances currently active

Keep these limitations in mind when using these queries:

1. **Timing gap**: The `deploymentStart` time represents when your site update returns success, but the actual rolling update might not start immediately. During this gap, any scale-out events provision instances running the original version. Since the query only tracks instances active at `deploymentStart`, it doesn't monitor these new original-version instances, potentially causing false completion signals.

1. **Log-based detection**: This approach relies on application logs to infer instance state rather than directly querying instance status. Instances might be running but not actively logging, leading to false completion signals when original instances are still active but didn't emit logs within the `checkInterval` window.

**Recommendation for production**: Use rolling updates when zero-downtime deployments are critical. Ensure your deployment pipelines don't require waiting for update completion before proceeding to subsequent steps. Use recreate when you need faster, more predictable update timing and can tolerate brief downtime.

## FAQ

**I'm used to deployment slots for zero downtime deployments. How do rolling updates differ?**
- Unlike deployment slots, rolling updates require no additional infrastructure. Set `siteUpdateStrategy.type` to `"RollingUpdate"` for zero-downtime deployments.
- Rolling updates preserve in-progress executions, while deployment slots terminate them during swaps. [Certain site properties](functions-deployment-slots.md#manage-settings) and sticky settings can't be swapped and require modifying the production slot directly.
- Unlike deployment slots, rolling updates don't provide a separate environment for you to canary test changes or route a percentage of live traffic to. If you need these features, use a plan that supports deployment slots, like Elastic Premium, or manage separate Flex Consumption apps behind a traffic manager.

**How do I roll back a site update?**
- There's currently no feature to roll back a site update. If a rollback is necessary, initiate another site update with the previous state of code or configuration.

**How are timer triggers handled?**
- Timer triggers maintain their singleton nature. Once a timer-triggered function app is marked for drain, new timer functions run on the latest version. 

**I'm seeing runtime errors during the rolling update...what went wrong?**
- If new instances fail to start or encounter runtime errors, the issue is likely in the application code, dependencies, configuration settings, or environment variables that you modified.
- To resolve the issue, redeploy your last known healthy version to restore the runtime. Then test your proposed changes in a development or staging environment before reattempting. Review error logs to identify what specific change caused the issue. 

## Next steps

- [Learn more about the Flex Consumption plan](flex-consumption-plan.md)
- [Learn more about how deployments differ in Flex Consumption](flex-consumption-plan.md#deployment)
- [Learn how to write infrastructure-as-code templates](functions-infrastructure-as-code.md)

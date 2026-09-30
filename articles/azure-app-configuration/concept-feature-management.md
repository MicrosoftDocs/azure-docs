---
title: Understand feature management using Azure App Configuration
titleSuffix: Azure App Configuration
description: Learn how to use Azure App Configuration feature flags for switches, targeted rollouts, and experiments.
author: yuanqu72
ms.author: yuanqu
ms.service: azure-app-configuration
ms.topic: concept-article
ms.date: 08/12/2026
---

# Feature management overview

Feature management is a software-development practice that decouples feature release from code deployment and enables quick changes to feature availability on demand. It uses a technique called *feature flags* to dynamically administer a feature's lifecycle, letting you turn functionality on or off, target it to specific users, or roll it out gradually, all without redeploying your application. 

## Key capabilities

Azure App Configuration Feature Management supports three main feature flag usage scenarios based on what you're trying to accomplish: **Switch**, **Rollout**, and **Experiment**. Each scenario maps to a common feature management goal and unlocks a different set of capabilities, from a simple on/off toggle to targeted percentage rollouts to multivariate experiments. Across all three scenarios, you can monitor and analyze the impact of your feature flags to understand a feature's effect on your application's metrics. Use the following sections to pick the scenario that matches your goal before you dive into the details of individual filters, conditions, or variants. 

### Switch (On/Off)

:::image type="content" source="media/manage-feature-flags/create-feature-flag-switch-basics.png" alt-text="Screenshot of the Azure portal that shows the Create feature flag feature - Switch option's Basics tab.":::

**Use when:** You need a simple, instant on/off control for all users.

**Capabilities:**

* **Instant kill switch** – disable a misbehaving feature or dependency in seconds, without redeploying code
* **Operational toggle** – turn a short-lived state, such as maintenance mode, on or off on demand

For example, a team ships a new checkout algorithm behind a Switch flag named *EnableNewCheckout*. If error rates spike after launch, an on-call engineer turns the flag off, and every user instantly falls back to the previous checkout flow, without redeploying code. The same flag type also works well as an operational toggle, such as a *MaintenanceMode* flag that an ops team turns on before a database migration and off once it's complete.

**Learn more:**

* [Create a Switch feature flag](./manage-feature-flags.md?tabs=switch#create-a-feature-flag)

### Rollout

:::image type="content" source="media/manage-feature-flags/create-feature-flag-rollout-audience.png" alt-text="Screenshot of the Azure portal that shows the Create feature flag feature - Rollout option's Audience tab.":::

**Use when:** You want to gradually expose a feature to a percentage of users, or to specific users and groups, before making it generally available.

**Capabilities:**

* **Percentage-based gradual release** – expose a feature to a small percentage of traffic and increase it over time (canary or staged rollout) to reduce risk
* **Targeted access** – enable a feature only for specific users, a group, or a custom attribute such as region, device type, or subscription tier
* **Schedule-based activation** – turn a feature on or off automatically during a defined time window
* **Configuration rollout** – deliver configuration within the flag so your app can adjust its behavior as the flag rolls out, without a new deployment.

For example, a team rolling out a new *EnableNewCheckout* flag might start with a default percentage of 5%, use group overrides to include their internal QA and beta-tester groups at 100%, and exclude legacy accounts. Over the following days, they raise the default percentage to 25%, then 50%, then 100%, while watching error metrics. They might also add a schedule so the feature automatically turns off after a maintenance window.

Configuration rollout lets you go beyond a Boolean value: for example, you can attach `{"theme":"dark"}` to the *EnableNewCheckout* flag so your app picks up the new theme only when it evaluates the flag as enabled. This configuration is different from general App Configuration key-values, which aren't tied to any flag's evaluated state.

**Learn more:**

* [Create a Rollout feature flag](./manage-feature-flags.md?tabs=rollout#create-a-feature-flag)
* [Feature filters](./howto-feature-filters.md)
* [Time window filter](./howto-timewindow-filter.md)
* [Targeting filter](./howto-targetingfilter.md)

### Experiment

:::image type="content" source="media/manage-feature-flags/create-feature-flag-experiment-allocation.png" alt-text="Screenshot of the Azure portal that shows the Create feature flag feature - Experiment option's Allocation tab.":::

**Use when:** You want to compare multiple versions, or *variants*, of a feature and measure which one performs best.

**Capabilities:**

* **A/B testing** – compare two, or more than two, variants of a feature against each other
* **Traffic allocation across variants** – control what percentage of users are exposed to each variant

For example, a team testing two versions of a checkout page creates a variant feature flag with a *Control* and a *NewDesign* variant, and allocates half of their users to each.

**Learn more:**

* [Create an Experiment feature flag](./manage-feature-flags.md?tabs=experiment#create-a-feature-flag)
* [Variant feature flags](./howto-variant-feature-flags.md)

### Monitor and analyze impact

:::image type="content" source="media/manage-feature-flags/telemetry-tab-metric-scorecard.png" alt-text="Screenshot of the Azure portal that shows the Telemetry tab with a total evaluation events chart and the Metric Scorecard.":::

**Use when:** You want to see how your feature flags are evaluated and understand whether their variants affect the metrics that matter to your application.

**Capabilities:**

* **Collect and view feature flag events** – capture flag evaluation events that your app emits, and view evaluation counts, unique users, and variant or assignment-reason distributions directly in the Azure App Configuration portal's telemetry tab.
* **Analyze impact with metric scorecards (preview)** – automatically analyze the standard and custom telemetry your application sends to Application Insights, and surface which metrics show a statistically significant difference between variants, without writing a custom query.

For example, continuing the checkout page experiment, each flag evaluation emits a telemetry event, and the team reviews the Azure App Configuration portal's telemetry tab to confirm the traffic split between *Control* and *NewDesign* is working as expected. They open the metric scorecard on the same tab and see that the `NewDesign` variant shows a statistically significant improvement in a custom `PurchaseCompleted` metric, with no significant regression in page-load time. The scorecard's **Impacted** and **Inconclusive** groupings let the team confirm the result at a glance. They can still drill into Application Insights for a deeper look, such as correlating evaluation events with completed purchases.

**Learn more:**

* [Feature flag telemetry](./howto-telemetry.md)
* [View feature flag events](./howto-telemetry-review-results.md)
* [Analyze the impact of feature flags](./howto-metric-scorecards.md)

## Next steps

To use feature flags effectively, you need to externalize all the feature flags used in an application so you can change their states without modifying and redeploying the application itself. Azure App Configuration provides a centralized repository for feature flags: use it to define your Switch, Rollout, and Experiment flags and manage their states quickly and confidently, then use the App Configuration libraries for your programming language or framework to add feature flag evaluation to your application at run time.

### Get started with a quickstart

To add feature flag evaluation to your app, continue to the quickstart that's specific to your application's language or platform.

* [ASP.NET Core](./quickstart-feature-flag-aspnet-core.md)
* [Aspire](./quickstart-feature-flag-aspire.md)
* [.NET/.NET Framework](./quickstart-feature-flag-dotnet.md)
* [.NET background service](./quickstart-feature-flag-dotnet-background-service.md)
* [Java Spring](./quickstart-feature-flag-spring-boot.md)
* [Python](./quickstart-feature-flag-python.md)
* [JavaScript](./quickstart-feature-flag-javascript.md)
* [Go](./quickstart-feature-flag-go-console.md)
* [Go Gin](./quickstart-feature-flag-go-gin.md)
* [Azure Kubernetes Service](./quickstart-feature-flag-azure-kubernetes-service.md)
* [Azure Functions](./quickstart-feature-flag-azure-functions-csharp.md)

### Create and manage feature flags

* [Create a feature flag](./manage-feature-flags.md): Create and manage Switch, Rollout, and Experiment feature flags in the Azure portal.

### Dive deeper into Rollout and Experiment capabilities

* [Enable conditional features with feature filters](./howto-feature-filters.md)
* [Enable features on a schedule](./howto-timewindow-filter.md)
* [Roll out features to targeted audiences](./howto-targetingfilter.md)
* [Use variant feature flags](./howto-variant-feature-flags.md)
* [Enable telemetry for feature flags](./howto-telemetry.md)
* [View feature flag events](./howto-telemetry-review-results.md)
* [Analyze the impact of feature flags](./howto-metric-scorecards.md)

### Client libraries and SDKs

Azure App Configuration provides feature management libraries for several languages and platforms. Each library includes NuGet, npm, PyPI, or Maven packages and samples. For the full list of supported libraries and their release notes, see [Feature Management Overview](./feature-management-overview.md).


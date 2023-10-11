---
title: Migrate from ContainerLog to ContainerLogV2
description: This article describes the transition plan from the ContainerLog to ContainerLogV2 table
ms.topic: conceptual
ms.date: 07/19/2023
ms.reviewer: aul
---

# Migrate from ContainerLog to ContainerLogV2

With the upgraded offering of ContainerLogV2 becoming generally available, on 30th September 2026, the ContainerLog table will be retired. If you currently ingest container insights data to the ContainerLog table, please transition to using ContainerLogV2 prior to that date.

>[!NOTE]
> Support for ingesting the ContainerLog table will be **retired on 30th September 2026**.

## Steps to complete the transition

To transition to ContainerLogV2, we recommend the following approach.

1. Learn about the feature differences between ContainerLog and ContainerLogV2
2. Assess the impact migrating to ContainerLogV2 may have on your existing queries, alerts, or dashboards
3. [Enable the ContainerLogV2 schema](container-insights-logging-v2.md) through either the container insights data collection rules (DCRs) or ConfigMap
4. Validate that you are now ingesting ContainerLogV2 to your Log Analytics workspace.

## ContainerLog vs ContainerLogV2 schema

The following table highlights the key differences between using ContainerLog and ContainerLogV2 schema.

>[!NOTE]
> DCR based configuration is not supported for service principal based clusters. Please [migrate your clusters with service principal to managed identity](./container-insights-enable-aks.md#migrate-to-managed-identity-authentication) to use this experience.

| Feature differences  | ContainerLog | ContainerLogV2 |
| ------------------- | ----------------- | ------------------- |
| Onboarding | Only configurable through the ConfigMap | Configurable through both the ConfigMap and DCR\* |
| Pricing | Only compatible with full-priced analytics logs | Supports the low cost basic logs tier in addition to analytics logs |
| Querying | Requires multiple join operations with inventory tables for standard queries | Includes additional pod and container metadata to reduce query complexity and join operations |
| Multiline | Not supported, multiline entries are split into multiple rows | Support for multiline logging to allow consolidated, single entries for multiline output |

\* DCR enablement is not supported for service principal based clusters, must be enabled through the ConfigMap

## Assess the impact on existing alerts

If you are currently using ContainerLog in your alerts, then migrating to ContainerLogV2 requires updates to your alert queries for them to continue functioning as expected.

To scan for alerts that may be referencing the ContainerLog table, run the following Azure Resource Graph query:

```Kusto
resources
| where type in~ ('microsoft.insights/scheduledqueryrules') and ['kind'] !in~ ('LogToMetric')
| extend severity = strcat("Sev", properties["severity"])
| extend enabled = tobool(properties["enabled"])
| where enabled in~ ('true')
| where tolower(properties["targetResourceTypes"]) matches regex 'microsoft.operationalinsights/workspaces($|/.*)?' or tolower(properties["targetResourceType"]) matches regex 'microsoft.operationalinsights/workspaces($|/.*)?' or tolower(properties["scopes"]) matches regex 'providers/microsoft.operationalinsights/workspaces($|/.*)?'
| where properties contains "ContainerLog"
| project id,name,type,properties,enabled,severity,subscriptionId
| order by tolower(name) asc
```

## Next steps
- [Enable ContainerLogV2](container-insights-logging-v2.md)

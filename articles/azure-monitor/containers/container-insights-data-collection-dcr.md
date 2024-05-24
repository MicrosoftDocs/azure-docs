---
title: Configure data collection and cost optimization in Container insights using data collection rule
description: Describes how you can configure cost optimization and other data collection for Container insights using a data collection rule.
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 12/19/2023
ms.reviewer: aul
---

# Configure data collection and cost optimization in Container insights using data collection rule

This article describes how to configure data collection in Container insights using the [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) for your Kubernetes cluster. This includes preset configurations for optimizing your costs. A DCR is created when you onboard a cluster to Container insights. This DCR is used by the containerized agent to define data collection for the cluster.

The DCR is primarily used to configure data collection of performance and inventory data and to configure cost optimization.

Specific configuration you can perform with the DCR includes:

- Enable/disable collection and namespace filtering for performance and inventory data.
- Define collection interval for performance and inventory data
- Enable/disable Syslog collection
- Select log schema

> [!IMPORTANT]
> Complete configuration of data collection in Container insights may require editing of both the DCR and the ConfigMap for the cluster since each method allows configuration of a different set of settings. 
> 
> See [Configure data collection in Container insights using ConfigMap](./container-insights-data-collection-configmap.md) for a list of settings and the process to configure data collection using ConfigMap.

## Prerequisites

- AKS clusters must use either System or User Assigned Managed Identity. If cluster is using a Service Principal, you must [upgrade to Managed Identity](../../aks/use-managed-identity.md#enable-managed-identities-on-an-existing-aks-cluster).



## Configure data collection

> [!WARNING]
> The default Container insights experience depends on all the existing data streams. Removing one or more of the default streams makes the Container insights experience unavailable, and you need to use other tools such as Grafana dashboards and log queries to analyze collected data.









## Impact on visualizations and alerts

If you're currently using the above tables for other custom alerts or charts, then modifying your data collection settings might degrade those experiences. If you're excluding namespaces or reducing data collection frequency, review your existing alerts, dashboards, and workbooks using this data.

To scan for alerts that reference these tables, run the following Azure Resource Graph query:

```Kusto
resources
| where type in~ ('microsoft.insights/scheduledqueryrules') and ['kind'] !in~ ('LogToMetric')
| extend severity = strcat("Sev", properties["severity"])
| extend enabled = tobool(properties["enabled"])
| where enabled in~ ('true')
| where tolower(properties["targetResourceTypes"]) matches regex 'microsoft.operationalinsights/workspaces($|/.*)?' or tolower(properties["targetResourceType"]) matches regex 'microsoft.operationalinsights/workspaces($|/.*)?' or tolower(properties["scopes"]) matches regex 'providers/microsoft.operationalinsights/workspaces($|/.*)?'
| where properties contains "Perf" or properties  contains "InsightsMetrics" or properties  contains "ContainerInventory" or properties  contains "ContainerNodeInventory" or properties  contains "KubeNodeInventory" or properties  contains"KubePodInventory" or properties  contains "KubePVInventory" or properties  contains "KubeServices" or properties  contains "KubeEvents" 
| project id,name,type,properties,enabled,severity,subscriptionId
| order by tolower(name) asc
```



## Next steps

- See [Configure data collection in Container insights using ConfigMap](container-insights-data-collection-configmap.md) to configure data collection using ConfigMap instead of the DCR.

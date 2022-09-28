---
title: Rule groups in Azure Monitor Managed Service for Prometheus
description: Description of rule groups in Azure Monitor managed service for Prometheus which alerting and data computation.
author: bwren 
ms.topic: conceptual
ms.date: 09/15/2022
---

# Azure Monitor managed service for Prometheus rule groups
Rules in Prometheus act on data as it's collected. They're configured as part of a Prometheus rule group which is stored in [Azure Monitor workspace](azure-monitor-workspace-overview.md). Rules are run sequentially in the order they are defined in the group.


## Rule types
There are two types of Prometheus rules as described in the following table.

| Type | Description |
|:---|:---|
| Alert | Alert rules let you create an Azure Monitor alert based on the results of a Prometheus Query Language (Prom QL) query.  |
| Recording | Recording rules allow you to pre-compute frequently needed or computationally extensive expressions and store their result as a new set of time series. Querying the precomputed result will then often be much faster than executing the original expression every time it is needed. This is especially useful for dashboards, which need to query the same expression repeatedly every time they refresh, or for use in alert rules, where multiple alert rules may be based on the same complex query. Time series created by recording rules are ingested back to your Azure Monitor workspace as new Prometheus metrics. |

## View Prometheus rule groups
You can view the rule groups and their included rules in the Azure portal by selecting **Rule groups** from the Azure Monitor workspace.

:::image type="content" source="media/prometheus-metrics-rule-groups/azure-monitor-workspace-rule-groups.png" lightbox="media/prometheus-metrics-rule-groups/azure-monitor-workspace-rule-groups.png"  alt-text="Screenshot of rule groups in an Azure Monitor workspace.":::


## Enable rules
To enable or disable a rule, click on the rule in the Azure portal. Select either **Enable** or **Disable** to change its status.

:::image type="content" source="media/prometheus-metrics-rule-groups/enable-rule.png" lightbox="media/prometheus-metrics-rule-groups/enable-rule.png"  alt-text="Screenshot of Prometheus rule detail with enable option.":::

## Create Prometheus rules
In the public preview, rule groups, recording rules and alert rules are configured using Azure Resource Manager (ARM) templates, API, and provisioning tools. This uses a new resource called **Prometheus Rule Group**. You can create and configure rule group resources where the alert rules and recording rules are defined as part of the rule group properties. Azure Prometheus rule groups are defined with a scope of a specific Azure Monitor workspace.


You can use a Resource Manager template to create and configure Prometheus rule groups, alert rules and recording rules. Resource Manager templates enable you to programmatically set up alert and recording rules in a consistent and reproducible way across your environments.

The basic steps are as follows:

1. Use the templates below as a JSON file that describes how to create the rule group.
2. Deploy the template using any deployment method, such as [Azure portal](../../azure-resource-manager/templates/deploy-portal.md), [Azure CLI](../../azure-resource-manager/templates/deploy-cli.md), [Azure Powershell](../../azure-resource-manager/templates/deploy-powershell.md), or [Rest API](../../azure-resource-manager/templates/deploy-rest.md).

## Limiting rules to a specific cluster

You can optionally limit the rules in a rule group to query data originating from a specific cluster, using  the rule group `clusterName`  property.
You should try to limit rules to a single cluster if your monitoring workspace contains a large scale of data from multiple clusters, and there is a concern that running a single set of rules on all the data may cause performance or throttling issues. Using the `clusterName` property, you can create multiple rule groups, each configured with the same rules, limiting each group to cover a different cluster. 

- The `clusterName` value must be identical to the `cluster` label that is added to the metrics from a specific cluster during data collection.
- If clusterName is not specified for a specific rule group, the rules in the group will query all the data in the workspace from all clusters.


## Template example for a Prometheus rule group
To create a Prometheus rule group using a Resource Manager template, you create a resource of type `Microsoft.AlertsManagement/prometheusRuleGroups` and fill in all related properties. Azure Resource Manager template for a Prometheus rule group configures the group, and one or more alert rules and/or recording rules within the group. The rules are executed in the order they appear within a group. Below is a sample template that creates a Prometheus rule group, including one recording rule and one alert rule.


``` json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "variables": {},
    "resources": [
        {
           "name": "sampleRuleGroup",
           "type": "Microsoft.AlertsManagement/prometheusRuleGroups",
           "apiVersion": "2021-07-22-preview",
           "location": "northcentralus",
           "properties": {
                "description": "Sample Prometheus Rule Group",
                "scopes": [
                    "/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/microsoft.monitor/accounts/<azureMonitorWorkspaceId>"
                ],
                "enabled": true,
                "clusterName": "<myCLusterName>",
                "interval": "PT1M",
                "rules": [
                    {
                        "record": "instance:node_cpu_utilisation:rate5m",
                        "expression": "1 - avg without (cpu) (sum without (mode)(rate(node_cpu_seconds_total{job=\"node\", mode=~\"idle|iowait|steal\"}[5m])))",
                        "enabled": true
                    },
                    {
                        "alert": "KubeCPUQuotaOvercommit",
                        "expression": "sum(min without(resource) (kube_resourcequota{job=\"kube-state-metrics\", type=\"hard\", resource=~\"(cpu|requests.cpu)\"})) /  sum(kube_node_status_allocatable{resource=\"cpu\", job=\"kube-state-metrics\"}) > 1.5",
                        "for": "PT5M",
                        "labels": {
                            "team": "prod"
                        },
                        "annotations": {
                            "description": "Cluster has overcommitted CPU resource requests for Namespaces.",
                            "runbook_url": "https://github.com/kubernetes-monitoring/kubernetes-mixin/tree/master/runbook.md#alert-name-kubecpuquotaovercommit",
                            "summary": "Cluster has overcommitted CPU resource requests."
                        },
                        "enabled": true,
                        "severity": 3,
                        "resolveConfiguration": {
                            "autoResolved": true,
                            "timeToResolve": "PT10M"
                        },
                        "actions": [
                            {
                               "actionGroupId": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/microsoft.insights/actiongroups/<actionGroupName>"
                            }
                        ]
                    }
                ]
            }
        }
    ]
}        
```

The following tables describe each of the properties in the rule definition.

### Rule group
The rule group will have the following properties, whether it includes alerting rule, recording rule, or both.

| Name | Required | Type | Description |
|:---|:---|:---|:---|
| `name` | True | string | Prometheus rule group name |
| `type` | True | string | `Microsoft.AlertsManagement/prometheusRuleGroups` |
| `apiVersion` | True | string | `2021-07-22-preview` |
| `location` | True | string | Resource location from regions supported in the preview |
| `properties.description` | False | string | Rule group description |
| `properties.scopes` | True | string[] | Target Azure Monitor workspace. Only one scope currently supported |
| `properties.ebabled` | False | boolean | Enable/disable group. Default is true. |
| `properties.clusterName` | False | string | Apply rule to data from a specific cluster. Default is apply to all data in workspace. |
| `properties.interval` | False | string | Group evaluation interval. Default = PT1M |

### Recording rules
The `rules` section will have the following properties for recording rules.

| Name | Required | Type | Description |
|:---|:---|:---|:---|
| `record` | True | string | Recording rule name. This is the name that will be used for the new time series. |
| `expression` | True | string | PromQL expression to calculate the new time series value. |
| `enabled` | False | boolean | Enable/disable group. Default is true. |


### Alerting rules
The `rules` section will have the following properties for alerting rules.

| Name | Required | Type | Description | Notes |
|:---|:---|:---|:---|:---|
| `alert` | False | string | Alert rule name  |
| `expression` | True | string | PromQL expression to evaluate. |
| `for` | False | string | Alert firing timeout. Values - 'PT1M', 'PT5M' etc. |
| `labels` | False | object | labels key-value pairs | Prometheus alert rule labels |
| `rules.annotations` | False | object | Annotations key-value pairs to add to the alert. |
| `enabled` | False | boolean | Enable/disable group. Default is true. |
| `rules.severity` | False | integer | Alert severity. 0-4, default is 3 (informational) |
| `rules.resolveConfigurations.autoResolved` | False | boolean | When enabled, the alert is automatically resolved when the condition is no longer true. Default = true |
| `rules.resolveConfigurations.timeToResolve` | False | string | Alert auto resolution timeout. Default = "PT5M" |
| `rules.action[].actionGroupId` | false | string | One or more action group resource IDs. Each is activated when an alert is fired. |
## Reference

- [Recording rules](https://aka.ms/azureprometheus-promio-recrules)
- [Alerting rules](https://aka.ms/azureprometheus-promio-alertrules)



## Next steps

- Learn more about the [Azure Monitor data platform](../data-platform.md).
- Learn about [log data in Azure Monitor](../logs/data-platform-logs.md).
- Learn about the [monitoring data available](../data-sources.md) for various resources in Azure.

---
title: Data transformations in Container insights
description: Describes how to transform data using a DCR transformation in Container insights.
ms.topic: conceptual
ms.date: 11/08/2023
ms.reviewer: aul
---

# Data transformations in Container insights

[Transformations](../essentials/data-collection-transformations.md) in Azure Monitor allow to modify or filter data before it's ingested in your Log Analytics workspace. This article describes how to implement transformations in Container insights.

## Streams
The data collected by Container insights is defined by one or more known `streams` in the DCR. The following table lists the streams that will be included in a DCR for each of the [Cost presets](container-insights-cost-config.md#cost-presets).


| Stream | Cost preset | Description |
|:---|:---|:---|
| Microsoft-ContainerInsights-Group-Default | Standard | Group stream that includes all of the streams listed in [Stream values](container-insights-cost-config.md#stream-values). |
| Microsoft-PrometheusMetrics | Cost-optimized | Collects only Prometheus metrics. |
| Microsoft-Syslog | Syslog | Collects only Syslog logs. |
 
> [!IMPORTANT]
> If your DCR includes `Microsoft-ContainerInsights-Group-Default` You must replace this group stream with the single streams to use a transformation. 

## Methods to create a transformation
Since transformations are implemented in DCRs, you either need to onboard a cluster to Container insights with a DCR that includes a transformation or editing an existing DCR.

| Method | Description |
|:---|:---|
| New cluster | Use an existing [ARM template ](https://github.com/microsoft/Docker-Provider/tree/ci_prod/scripts/onboarding/aks/onboarding-using-msi-auth) to onboard an AKS cluster to Container insights. Modify the `dataFlows` section of the DCR in that template to include a transformation, similar to one of the samples below. |
| Existing DCR | After a cluster has been onboarded to Container insights, you can edit its DCR to include a transformation. See [Editing Data Collection Rules](../essentials/data-collection-rule-edit.md). |



## Sample DCRs
The following samples show sample DCRs for Container insights using transformations. Use these samples as a starting point and customize then as required to meet your particular requirements.

Notice the `dataFlows` section of these samples. This section matches `streams` with `destinations`. The streams that don't require a transformation can be grouped together in a single entry that includes only the workspace destination. Create a separate entry for streams that require a transformation that includes the workspace destination and the `transformKql` property.

### Filter for a particular namespace
This sample uses the following log query to collect data for a single namespace. You can replace `kube-system` in this query with another namespace or replace the `where` clause with another filter to match the particular data you want to collect.

```kusto
source 
| where Namespace == 'kube-system'
```

```json
{
    "properties": {
        "dataSources": {
            "syslog": [],
            "extensions": [
                {
                    "name": "ContainerInsightsExtension",                    
                    "extensionName": "ContainerInsights",
                    "extensionSettings": { },
                    "streams": [
                        "Microsoft-ContainerLog",
                        "Microsoft-ContainerLogV2",
                        "Microsoft-KubeEvents",
                        "Microsoft-KubePodInventory",
                        "Microsoft-KubeNodeInventory",
                        "Microsoft-KubePVInventory",
                        "Microsoft-KubeServices",
                        "Microsoft-KubeMonAgentEvents",
                        "Microsoft-InsightsMetrics",
                        "Microsoft-ContainerInventory",
                        "Microsoft-ContainerNodeInventory",
                        "Microsoft-Perf"
                    ]
                }
            ]
        },
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "",
                    "workspaceId": "",
                    "name": "ciworkspace"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Microsoft-ContainerLog",
                    "Microsoft-KubeEvents",
                    "Microsoft-KubePodInventory",
                    "Microsoft-KubeNodeInventory",
                    "Microsoft-KubePVInventory",
                    "Microsoft-KubeServices",
                    "Microsoft-KubeMonAgentEvents",
                    "Microsoft-InsightsMetrics",
                    "Microsoft-ContainerNodeInventory",
                    "Microsoft-Perf"
                ],
                "destinations": [
                    "ciworkspace"
                ]
            },
            {
                "streams": [
                    "Microsoft-ContainerLogV2"
                ],
                "destinations": [
                    "ciworkspace"
                ],
                "transformKql": "source | where Namespace == 'kube-system'"
            }
        ] 
    }
}
```

## Add a column to a table
This sample uses the following log query to send data to a custom column added to the `ContainerLogV2` table. This transformation requires that you add the custom column to the table using the process described in [Add or delete a custom column](../logs/create-custom-table.md#add-or-delete-a-custom-column).

```kusto
source
| extend new_CF = ContainerName
```


```json
{
    "properties": {
        "dataSources": {
            "syslog": [],
            "extensions": [
                {
                    "streams": [
                        "Microsoft-ContainerLog",
                        "Microsoft-ContainerLogV2",
                        "Microsoft-KubeEvents",
                        "Microsoft-KubePodInventory",
                        "Microsoft-KubeNodeInventory",
                        "Microsoft-KubePVInventory",
                        "Microsoft-KubeServices",
                        "Microsoft-KubeMonAgentEvents",
                        "Microsoft-InsightsMetrics",
                        "Microsoft-ContainerInventory",
                        "Microsoft-ContainerNodeInventory",
                        "Microsoft-Perf"
                    ],
                    "extensionName": "ContainerInsights",
                    "extensionSettings": { },
                    "name": "ContainerInsightsExtension"
                }
            ]
        },
        "destinations": {
            "logAnalytics": [
                {
                "workspaceResourceId": "",
                "workspaceId": "",
                "name": "ciworkspace"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Microsoft-ContainerLog",
                    "Microsoft-KubeEvents",
                    "Microsoft-KubePodInventory",
                    "Microsoft-KubeNodeInventory",
                    "Microsoft-KubePVInventory",
                    "Microsoft-KubeServices",
                    "Microsoft-KubeMonAgentEvents",
                    "Microsoft-InsightsMetrics",
                    "Microsoft-ContainerNodeInventory",
                    "Microsoft-Perf"
                ],
                "destinations": [
                "ciworkspace"
                ]
            },
            {
                "streams": [
                    "Microsoft-ContainerLogV2"
                ],
                "destinations": [
                    "ciworkspace"
                ],
                "transformKql": "source\n | extend new_CF = ContainerName"
            }
        ]
    }
}
```



## Next steps


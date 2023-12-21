---
title: Data transformations in Container insights
description: Describes how to transform data using a DCR transformation in Container insights.
ms.topic: conceptual
ms.date: 11/08/2023
ms.reviewer: aul
---

# Data transformations in Container insights

This article describes how to implement data transformations in Container insights. [Transformations](../essentials/data-collection-transformations.md) in Azure Monitor allow you to modify or filter data before it's ingested in your Log Analytics workspace. They allow you to perform such actions as filtering out data collected from your cluster to save costs or processing incoming data to assist in your data queries.

## Data Collection Rules (DCRs)
Transformations are implemented in [data collection rules (DCRs)](../essentials/data-collection-rule-overview.md) which are used to configure data collection in Azure Monitor. When you onboard Container insights for a cluster, a DCR is created for it with the name *MSCI-\<cluster-region\>-<\cluster-name\>*. You can view this DCR from **Data Collection Rules** in the **Monitor** menu in the Azure portal. To create a transformation, you must either modify this DCR, or onboard your cluster with a custom DCR that includes your transformation. 

The following table describes the different methods to edit the DCR, while the rest of this article provides details of the edits that you need to perform to transform Container insights data.

| Method | Description |
|:---|:---|
| New cluster | Use an existing [ARM template ](https://github.com/microsoft/Docker-Provider/tree/ci_prod/scripts/onboarding/aks/onboarding-using-msi-auth) to onboard an AKS cluster to Container insights. Modify the `dataFlows` section of the DCR in that template to include a transformation, similar to one of the samples below. |
| Existing DCR | After a cluster has been onboarded to Container insights, edit its DCR to include a transformation using the process in [Editing Data Collection Rules](../essentials/data-collection-rule-edit.md). |


## Data sources
The [dataSources section of the DCR](../essentials/data-collection-rule-structure.md#datasources) defines the different types of incoming data that the DCR will process. For Container insights, this includes the `ContainerInsights` extension, which includes one or more predefined `streams` starting with the prefix *Microsoft-*.

The list of Container insights streams in the DCR depends on the [Cost preset](container-insights-cost-config.md#cost-presets) that you selected for the cluster. If you collect all tables, the DCR will use the `Microsoft-ContainerInsights-Group-Default` stream, which is a group stream that includes all of the streams listed in [Stream values](container-insights-cost-config.md#stream-values). You must change this to individual streams if you're going to use a transformation. Any other cost preset settings will already use individual streams.

The snippet below shows the `Microsoft-ContainerInsights-Group-Default` stream. See the [Sample DCRs](#sample-dcrs) for a sample of individual streams.

```json
"dataSources": {
    "extensions": [
        {
            "name": "ContainerInsightsExtension",
            "extensionName": "ContainerInsights",
            "extensionSettings": { },
            "streams": [
                "Microsoft-ContainerInsights-Group-Default"
            ]
        }
    ]
}
```

## Data flows
The [dataFlows section of the DCR](../essentials/data-collection-rule-structure.md#dataflows) matches streams with destinations. The streams that don't require a transformation can be grouped together in a single entry that includes only the workspace destination. Create a separate entry for streams that require a transformation that includes the workspace destination and the `transformKql` property.

The snippet below shows the `dataFlows` section for a single stream with a transformation. See the [Sample DCRs](#sample-dcrs) for multiple data flows in a single DCR.

```json
"dataFlows": [
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
```


## Sample DCRs
The following samples show DCRs for Container insights using transformations. Use these samples as a starting point and customize then as required to meet your particular requirements.


### Filter for a particular namespace
This sample uses the log query `source | where Namespace == 'kube-system'` to collect data for a single namespace in `ContainerLogsV2`. You can replace `kube-system` in this query with another namespace or replace the `where` clause with another filter to match the particular data you want to collect. The other streams are grouped into a separate data flow and have no transformation applied.


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
                    "workspaceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace",
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
This sample uses the log query `source | extend new_CF = ContainerName` to send data to a custom column added to the `ContainerLogV2` table. This transformation requires that you add the custom column to the table using the process described in [Add or delete a custom column](../logs/create-custom-table.md#add-or-delete-a-custom-column).  The other streams are grouped into a separate data flow and have no transformation applied.



```json
{
    "properties": {
        "dataSources": {
            "syslog": [],
            "extensions": [
                {
                    "extensionName": "ContainerInsights",
                    "extensionSettings": { },
                    "name": "ContainerInsightsExtension",
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
                    "workspaceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace",
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

- Read more about [transformations](../essentials/data-collection-transformations.md) and [data collection rules](../essentials/data-collection-rule-overview.md) in Azure Monitor.
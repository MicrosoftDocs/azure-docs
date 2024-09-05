---
title: Data transformations in Container insights
description: Describes how to transform data using a DCR transformation in Container insights.
ms.topic: conceptual
ms.date: 07/17/2024
ms.reviewer: aul
---

# Data transformations in Container insights

This article describes how to implement data transformations in Container insights. [Transformations](../essentials/data-collection-transformations.md) in Azure Monitor allow you to modify or filter data before it's ingested in your Log Analytics workspace. They allow you to perform such actions as filtering out data collected from your cluster to save costs or processing incoming data to assist in your data queries.

> [!IMPORTANT]
> The articles [Configure log collection in Container insights](./container-insights-data-collection-configure.md) and [Filtering log collection in Container insights](./container-insights-data-collection-filter.md) describe standard configuration settings to configure and filter data collection for Container insights. You should perform any required configuration using these features before using transformations. Use a transformation to perform filtering or other data configuration that you can't perform with the standard configuration settings.

## Data collection rule
Transformations are implemented in [data collection rules (DCRs)](../essentials/data-collection-rule-overview.md) which are used to configure data collection in Azure Monitor. [Configure data collection using DCR](./container-insights-data-collection-configure.md) describes the DCR that's automatically created when you enable Container insights on a cluster. To create a transformation, you must perform one of the following actions:

- **New cluster**. Use an existing [ARM template ](https://github.com/microsoft/Docker-Provider/tree/ci_prod/scripts/onboarding/aks/onboarding-using-msi-auth) to onboard an AKS cluster to Container insights. Modify the DCR in that template with your required configuration, including a transformation similar to one of the samples below.
- **Existing DCR**. After a cluster has been onboarded to Container insights and data collection configured, edit its DCR to include a transformation using any of the methods in [Editing Data Collection Rules](../essentials/data-collection-rule-edit.md). 

> [!NOTE]
> There is currently minimal UI for editing DCRs, which is required to add transformations. In most cases, you need to manually edit the the DCR. This article describes the DCR structure to implement. See [Create and edit data collection rules (DCRs) in Azure Monitor](../essentials/data-collection-rule-edit.md) for guidance on how to implement that structure.


## Data sources
The [dataSources section of the DCR](../essentials/data-collection-rule-structure.md#datasources) defines the different types of incoming data that the DCR will process. For Container insights, this is the Container insights extension, which includes one or more predefined `streams` starting with the prefix *Microsoft-*.

The list of Container insights streams in the DCR depends on the [Cost preset](container-insights-cost-config.md#cost-presets) that you selected for the cluster. If you collect all tables, the DCR will use the `Microsoft-ContainerInsights-Group-Default` stream, which is a group stream that includes all of the streams listed in [Stream values](container-insights-cost-config.md#stream-values). You must change this to individual streams if you're going to use a transformation. Any other cost preset settings will already use individual streams.

The sample below shows the `Microsoft-ContainerInsights-Group-Default` stream. See the [Sample DCRs](#sample-dcrs) for samples using individual streams.

```json
"dataSources": {
    "extensions": [
        {
            "streams": [
                "Microsoft-ContainerInsights-Group-Default"
            ],
            "name": "ContainerInsightsExtension",
            "extensionName": "ContainerInsights",
            "extensionSettings": { 
                "dataCollectionSettings": {
                    "interval": "1m",
                    "namespaceFilteringMode": "Off",
                    "namespaces": null,
                    "enableContainerLogV2": true
                }
            }
        }
    ]
}
```



## Data flows
The [dataFlows section of the DCR](../essentials/data-collection-rule-structure.md#dataflows) matches streams with destinations that are defined in the `destinations` section of the DCR. Table names don't have to be specified for known streams if the data is being sent to the default table. The streams that don't require a transformation can be grouped together in a single entry that includes only the workspace destination. Each will be sent to its default table.

Create a separate entry for streams that require a transformation. This should include the workspace destination and the `transformKql` property. If you're sending data to an alternate table, then you need to include the `outputStream` property which specifies the name of the destination table.

The sample below shows the `dataFlows` section for a single stream with a transformation. See the [Sample DCRs](#sample-dcrs) for multiple data flows in a single DCR.

```json
"dataFlows": [
    {
        "streams": [
            "Microsoft-ContainerLogV2"
        ],
        "destinations": [
            "ciworkspace"
        ],
        "transformKql": "source | where PodNamespace == 'kube-system'"
    }
]
```

## Sample DCRs


### Filter data

The first example filters out data from the `ContainerLogV2` based on the `LogLevel` column. Only records with a `LogLevel` of `error` or `critical` will be collected since these are the entries that you might use for alerting and identifying issues in the cluster. Collecting and storing other levels such as `info` and `debug` generate cost without significant value.

You can retrieve these records using the following log query. 

```kusto
ContainerLogV2 | where LogLevel in ('error', 'critical')
```

This logic is shown in the following diagram.

:::image type="content" source="media/container-insights-cost/transformation-sample.png" lightbox="media/container-insights-cost/transformation-sample.png" alt-text="Diagram that shows filtering container logs using a transformation." border="false":::


In a transformation, the table name `source` is used to represent the incoming data. Following is the modified query to use in the transformation.

```kusto
source | where LogLevel in ('error', 'critical')
```

The following sample shows this transformation added to the Container insights DCR. Note that a separate data flow is used for `Microsoft-ContainerLogV2` since this is the only incoming stream that the transformation should be applied to. A separate data flow is used for the other streams.

```json
{
    "properties": {
        "location": "eastus2",
        "kind": "Linux",
        "dataSources": {
            "syslog": [],
            "extensions": [
                {
                    "streams": [
                        "Microsoft-ContainerLogV2",
                        "Microsoft-KubeEvents",
                        "Microsoft-KubePodInventory"
                    ],
                    "extensionName": "ContainerInsights",
                    "extensionSettings": {
                        "dataCollectionSettings": {
                            "interval": "1m",
                            "namespaceFilteringMode": "Off",
                            "enableContainerLogV2": true
                        }
                    },
                    "name": "ContainerInsightsExtension"
                }
            ]
        },
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace",
                    "workspaceId": "00000000-0000-0000-0000-000000000000",
                    "name": "ciworkspace"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Microsoft-KubeEvents",
                    "Microsoft-KubePodInventory"
                ],
                "destinations": [
                    "ciworkspace"
                ],
            },
            {
                "streams": [
                    "Microsoft-ContainerLogV2"
                ],
                "destinations": [
                    "ciworkspace"
                ],
                "transformKql": "source | where LogLevel in ('error', 'critical')"
            }
        ],
    },
}
```

### Send data to different tables

In the example above, only records with a `LogLevel` of `error` or `critical` are collected. An alternate strategy instead of not collecting these records at all is to save them to an alternate table configured for basic logs. 

For this strategy, two transformations are needed. The first transformation sends the records with `LogLevel` of `error` or `critical` to the default table. The second transformation sends the other records to a custom table named `ContainerLogV2_CL`. The queries for each are shown below using `source` for the incoming data as described in the previous example.

```kusto
# Return error and critical logs
source | where LogLevel in ('error', 'critical')

# Return logs that aren't error or critical
source | where LogLevel !in ('error', 'critical')
```

This logic is shown in the following diagram.

:::image type="content" source="media/container-insights-cost/transformation-sample-basic-logs.png" lightbox="media/container-insights-cost/transformation-sample-basic-logs.png" alt-text="Diagram that shows filtering container logs using a transformation that sends some data to analytics table and other data to basic logs." border="false":::

> [!IMPORTANT]
> Before you install the DCR in this sample, you must [create a new table](../logs/create-custom-table.md) with the same schema as `ContainerLogV2`. Name it `ContainerLogV2_CL` and [configure it for basic logs](../logs/basic-logs-configure.md).

The following sample shows this transformation added to the Container insights DCR. There are two data flows for `Microsoft-ContainerLogV2` in this DCR, one for each transformation. The first sends to the default table you don't need to specify a table name. The second requires the `outputStream` property to specify the destination table.

```json
{
    "properties": {
        "location": "eastus2",
        "kind": "Linux",
        "dataSources": {
            "syslog": [],
            "extensions": [
                {
                    "streams": [
                        "Microsoft-ContainerLogV2",
                        "Microsoft-KubeEvents",
                        "Microsoft-KubePodInventory"
                    ],
                    "extensionName": "ContainerInsights",
                    "extensionSettings": {
                        "dataCollectionSettings": {
                            "interval": "1m",
                            "namespaceFilteringMode": "Off",
                            "enableContainerLogV2": true
                        }
                    },
                    "name": "ContainerInsightsExtension"
                }
            ]
        },
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace",
                    "workspaceId": "00000000-0000-0000-0000-000000000000",
                    "name": "ciworkspace"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Microsoft-KubeEvents",
                    "Microsoft-KubePodInventory"
                ],
                "destinations": [
                    "ciworkspace"
                ],
            },
            {
                "streams": [
                    "Microsoft-ContainerLogV2"
                ],
                "destinations": [
                    "ciworkspace"
                ],
                "transformKql": "source | where LogLevel in ('error', 'critical')"
            },
            {
                "streams": [
                    "Microsoft-ContainerLogV2"
                ],
                "destinations": [
                    "ciworkspace"
                ],
                "transformKql": "source | where LogLevel !in ('error','critical')",
                "outputStream": "Custom-ContainerLogV2_CL"
            }
        ],
    },
}
```



## Next steps

- Read more about [transformations](../essentials/data-collection-transformations.md) and [data collection rules](../essentials/data-collection-rule-overview.md) in Azure Monitor.
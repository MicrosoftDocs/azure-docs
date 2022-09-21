---
title: Sample data collection rule - custom logs
description: Sample data collection rule for custom logs.
ms.topic: sample
ms.date: 02/15/2022

---

# Sample data collection rule - custom logs
The sample [data collection rule](../essentials/data-collection-rule-overview.md) below is for use with [custom logs](../logs/logs-ingestion-api-overview.md). It has the following details:

- Sends data to a table called MyTable_CL in a workspace called my-workspace.
- Applies a [transformation](../essentials//data-collection-transformations.md) to the incoming data.

## Sample DCR

```json
{
    "properties": { 
        "dataCollectionEndpointId": "/subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/my-resource-groups/providers/Microsoft.Insights/dataCollectionEndpoints/my-data-collection-endpoint",
        "streamDeclarations": {
            "Custom-MyTableRawData": {
                "columns": [
                    {
                        "name": "Time",
                        "type": "datetime"
                    },
                    {
                        "name": "Computer",
                        "type": "string"
                    },
                    {
                        "name": "AdditionalContext",
                        "type": "string"
                    }
                ]
            }
        },
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/cefingestion/providers/microsoft.operationalinsights/workspaces/my-workspace",
                    "name": "LogAnalyticsDest"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Custom-MyTableRawData"
                ],
                "destinations": [
                    "LogAnalyticsDest"
                ],
                "transformKql": "source | extend jsonContext = parse_json(AdditionalContext) | project TimeGenerated = Time, Computer, AdditionalContext = jsonContext, ExtendedColumn=tostring(jsonContext.CounterName)",
                "outputStream": "Custom-MyTable_CL"
            }
        ]
    }
}
```


## Next steps

- [Walk through a tutorial on configuring custom logs using resource manager templates.](tutorial-logs-ingestion-api.md)
- [Get details on the structure of data collection rules.](../essentials/data-collection-rule-structure.md)
- [Get an overview on custom logs](logs-ingestion-api-overview.md).

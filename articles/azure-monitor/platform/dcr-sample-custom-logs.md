---
title: Sample data collection rule - custom logs
description: Sample data collection rule for custom logs.
ms.topic: sample
author: bwren
ms.author: bwren
ms.date: 12/30/2021
ms.custom: references_region

---

# Sample data collection rule - custom logs



```json
{
    "properties": { 
        "immutableld": "dcr-00000000000000000000000000000000", 
        "endpoint": "https://cefingestionsamp1edcr2-0000.westus2-1.ingest.monitor.azure.com",
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "/subscriptions/a9ø1aa27-742S-4221-ab13-bfd3437fa62S/resourceGroups/cefingestion/providers/microsoft.operationalinsights/workspaces/my-workspace",
                    "workspace Id" : "00000000-0000-0000-0000-000000000000",
                    "name": "LogAnalyticsDest" 
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Microsoft-CommonSecurityLog-Raw"
                ],
                "destinations": [
                    "LogAnalyticsDest" 
                ]
            }
        ],
        "provisioningState": "Succeeded"
    },
    "location": "westus2", 
    "kind": "Direct", 
    "id": "/subscriptions/a9ø1aa27-742S-4221-ab13-bfd3437fa62S/resourceGroups/CEFingestion/providers/Microsoft.Insights/dataCollectionRules/CEFIngestionSampleDCR2",
    "name": "CEFIngestionSampleDCR2",
    "type": "Microsoft.Insights/dataCollectionRules", 
    "etag": "\"00000000-0000-0000-0000-000000000000\""
}
```


## Next steps

- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) and an association to it from a virtual machine using the Azure Monitor agent.

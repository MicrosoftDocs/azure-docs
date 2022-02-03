---
title: Sample data collection rule - workspace transformation
description: Sample workspace transformation data collection rule.
ms.topic: sample
author: bwren
ms.author: bwren
ms.date: 12/30/2021
ms.custom: references_region

---

# Sample data collection rule - workspace transformation
The sample [data collection rule](data-collection-rule-overview.md) below is for use with [workspace transformation](). It has the following details:

- 

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "dataCollectionRuleName": {
            "type": "string",
            "metadata": {
                "description": "Specifies the name of the Data Collection Rule to create."
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "westus2",
            "allowedValues": [
                "westus2",
                "eastus2",
                "eastus2euap"
            ],
            "metadata": {
                "description": "Specifies the location in which to create the Data Collection Rule."
            }
        },
        "workspaceResourceId": {
            "type": "string",
            "metadata": {
                "description": "Specifies the Azure resource ID of the Log Analytics workspace to use."
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.Insights/dataCollectionRules",
            "name": "[parameters('dataCollectionRuleName')]",
            "location": "[parameters('location')]",
            "apiVersion": "2021-09-01-preview",
            "kind": "WorkspaceTransforms",
            "properties": {
                "destinations": {
                    "logAnalytics": [
                        {
                            "workspaceResourceId": "[parameters('workspaceResourceId')]",
                            "name": "clv2ws1"
                        }
                    ]
                },
                "dataFlows": [
                    {
                        "streams": [
                            "Microsoft-Table-LAQueryLogs"
                        ],
                        "destinations": [
                            "clv2ws1"
                        ],
                        "transformKql": "source |where QueryText !contains 'LAQueryLogs' | extend Context = parse_json(RequestContext) | extend Resources_CF = tostring(Context['workspaces']) |extend RequestContext = ''"
                    }
                ]
            }
        }
    ],
    "outputs": {
        "dataCollectionRuleId": {
            "type": "string",
            "value": "[resourceId('Microsoft.Insights/dataCollectionRules', parameters('dataCollectionRuleName'))]"
        }
    }
}
```


## Next steps

- [Create a data collection rule](../agents/data-collection-rule-azure-monitor-agent.md) and an association to it from a virtual machine using the Azure Monitor agent.

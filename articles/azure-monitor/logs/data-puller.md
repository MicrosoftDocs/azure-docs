---
title: Azure Monitor Data Puller
description: View the overview of Azure Activity logs of your resources
author: osalzberg
services: azure-monitor
ms.topic: conceptual
ms.date: 03/21/2022
ms.author: bwren
---

# Azure Monitor Data Puller (Preview)
With solutions on deprecation path and the introduction of [Data collection rules](essentials/data-collection-rule-overview), Tables are becoming a key component in Azure Monitor Logs resource management strategy and user experience all together.

The Data Collection Rules experience allows the benefits of using KQL transformations, faster ingestion and new log types support.

This article describes the Data Puller and instructions of how you can create and work with it.

## Getting started
To use the Data Puller you need to have a Log Analytics workspace that includes logs.
>[!tip] 
> * [Create a Log Analytics Workspace](logs/quick-create-workspace.md)
> * [Send Logs to Log Analytics Workspace](essentials/resource-logs#send-to-log-analytics-workspace)

## Create a file based custom log
From the Azure portal, go to the Log Analytics Workspace and choose Custom logs from the table of content and choose **Add custom Log**

:::image type="content" source="media/data-puller/datapuller-addcustomlog.png" alt-text="Screenshot that shows how to add Custom log.":::

* You can find more information about Custom logs creation [here](https://docs.microsoft.com/azure/azure-monitor/agents/data-sources-custom-logs)

## Create a Data Collection Rule (DCR)
1. You need to create a [Data collection rule](https://docs.microsoft.com/azure/azure-monitor/essentials/data-collection-rule-overview), make sure that the name of the stream is Custom-{TableName}", for example:

```json
{
  "properties": {
    "destinations": {
      "logAnalytics": [
        {
          "workspaceResourceId": "/subscriptions/YourSubscriptionID/resourcegroups/DataPuller-E2E-Tests/providers/Microsoft.OperationalInsights/workspaces/DataPullerE2E",
          "workspaceId": "WorkspaceID",
          "name": "DataPullerE2E"
        }
      ]
    },
    "dataFlows": [
      {
        "streams": [
          "Custom-DataPullerE2E_CL"
        ],
        "destinations": [
          "DataPullerE2E"
        ],
        "transformKql": "source",
        "outputStream": "Custom-DataPullerE2E_CL"
      }
    ]
  },
  "location": "eastus2euap",
  "id": "/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/Microsoft.Insights/dataCollectionRules/DataPullerE2EDcr",
  "name": "DataPullerE2EDcr",
  "type": "Microsoft.Insights/dataCollectionRules"
}

```
2. Set the Data Collection Rule to be the default on the workspace. use the following API command:
```json
PUT https://management.azure.com/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<WorkspaceName>?api-version=2015-11-01-preview
{
  "properties": {
    "defaultDataCollectionRuleResourceId": "/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/Microsoft.Insights/dataCollectionRules/DataPullerE2EDcr"
  },
  "location": "eastus2euap",
  "type": "Microsoft.OperationalInsights/workspaces"
}

```
3. Set the table as Data Puller eligible, use the Custom log definition api.
* First run the following Get command:
```json
GET https://management.azure.com/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/DataPullerE2E/logsettings/customlogs/definitions/DataPullerE2E_CL?api-version=2020-08-01
```

* Copy the response and send a PUT request:
```JSON
{
  "Name": "DataPullerE2E_CL",
  "Description": "custom log to test Data puller E2E",
  "Inputs": [
    {
      "Location": {
        "FileSystemLocations": {
          "WindowsFileTypeLogPaths": [
            "C:\\DataPullerE2E\\*.txt",
            "C:\\DataPullerE2E\\DataPullerE2E.txt"
          ]
        }
      },
      "RecordDelimiter": {
        "RegexDelimiter": {
          "Pattern": \\n,
          "MatchIndex": 0,
          "NumberedGroup": null
        }
      }
    }
  ],
  "Properties": [
    {
      "Name": "TimeGenerated",
      "Type": "DateTime",
      "Extraction": {
        "DateTimeExtraction": {}
      }
    }
  ],
  "SetDataCollectionRuleBased": true 
}
```
 * In order to validate the value is updated run:
```json
GET https://management.azure.com/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/microsoft.operationalinsights/workspaces/datapullere2e/datasources?api-version=2020-08-01&$filter=(kind%20eq%20'CustomLog')
```

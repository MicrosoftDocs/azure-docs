---
title: Ingest data from a file using Data Collection Rules (DCR)
description: Learn how to ingest data from a file into a Log Analytics workspace from files using DCR.
author: osalzberg
services: azure-monitor
ms.topic: how-to
ms.date: 03/21/2022
ms.author: guywi-ms
ms.reviewer: osalzberg
# Customer intent: As a DevOps specialist, I want to ingest external data from a file into a workspace.  
---
# Ingest data from a file using Data Collection Rules (DCR) (Preview)

You can define how Azure Monitor transforms and stores data ingested into your workspace by setting [Data Collection Rules (DCR)](https://docs.microsoft.com/azure/azure-monitor/essentials/data-collection-rule-overview). Using DCR lets you ingest data quickly from different log formats.

This tutorial explains how to ingest data from a file into a Log Analytics workspace using DCR.

## Prerequisites

To complete this tutorial, you need the following a [Log Analytics workspace](quick-create-workspace.md).

## Create a custom log table

From the Azure portal, go to the Log Analytics Workspace and choose Custom logs from the table of content and choose **Add custom log**

:::image type="content" source="media/data-puller/datapuller-addcustomlog.png" alt-text="Screenshot that shows how to add custom log.":::

For more information, see [Defining a custom log](/articles/azure-monitor/agents/data-sources-custom-logs#defining-a-custom-log).

## Create a Data Collection Rule (DCR)
1. Make sure the name of the stream is `Custom-{TableName}`. 

    For example:

    ```json
    {
      "properties": {
        "destinations": {
          "logAnalytics": [
            {
              "workspaceResourceId": "/subscriptions/<SubscriptionID/resourcegroups/<ResourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<DCRName>",
              "workspaceId": "WorkspaceID",
              "name": "MyLogFolder"
            }
          ]
        },
        "dataFlows": [
          {
            "streams": [
              "Custom-DataPullerE2E_CL"
            ],
            "destinations": [
              "MyLogFolder"
            ],
            "transformKql": "source",
            "outputStream": "Custom-DataPullerE2E_CL"
          }
        ]
      },
      "location": "eastus2euap",
      "id": "/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/Microsoft.Insights/dataCollectionRules/<DCRName>",
      "name": "<DCRName>",
      "type": "Microsoft.Insights/dataCollectionRules"
    }    
    ```

1. Set the Data Collection Rule to be the default on the workspace. Use the following API command:
  
    ```json
      PUT https://management.azure.com/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<WorkspaceName>?api-version=2015-11-01-preview
      {
        "properties": {
          "defaultDataCollectionRuleResourceId": "/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/Microsoft.Insights/dataCollectionRules/<DCRName>"
        },
        "location": "eastus2euap",
        "type": "Microsoft.OperationalInsights/workspaces"
      }    
      ```

1. Set the table as file-based custom log ingestion via DCR eligible, use the Custom log definition API.

    1. First run the following Get command:
   
        ```json
        GET https://management.azure.com/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/MyLogFolder/logsettings/customlogs/definitions/DataPullerE2E_CL?api-version=2020-08-01
        ```
    
    1. Copy the response and send a PUT request:

        ```JSON
        {
          "Name": "DataPullerE2E_CL",
          "Description": "custom log to test Data puller E2E",
          "Inputs": [
            {
              "Location": {
                "FileSystemLocations": {
                  "WindowsFileTypeLogPaths": [
                    "C:\\MyLogFolder\\*.txt",
                    "C:\\MyLogFolder\\MyLogFolder.txt"
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

        >[!Note]
        > * The `SetDataCollectionRuleBased` flag, from the last API command, enables the table as data puller.
         * To validate that the value is updated, run:
        ```json
        GET https://management.azure.com/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/microsoft.operationalinsights/workspaces/MyLogFolder/datasources?api-version=2020-08-01&$filter=(kind%20eq%20'CustomLog')
        ```

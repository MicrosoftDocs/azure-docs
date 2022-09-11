---
title: Send events from Azure Event Hubs to Azure Monitor Logs with a data collection rule
description: Ingest logs from Event Hub into Azure Monitor Logs 
author: guywi-ms
ms.author: guywild
ms.service: Azure Monitor Logs
ms.reviewer: ilanawaitser
ms.topic: tutorial 
ms.date: 09/20/22
ms.custom: template-tutorial 

# customer-intent: As a workspace administrator, I want to collect data from an event hub into a Log Analytics workspace so that I can monitor application logs that I ingest using Azure Event Hubs.
---


# Tutorial: Send events from Azure Event Hubs to Azure Monitor Logs with a data collection rule   

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

Azure Event Hubs is a big data streaming platform that collects events from multiple sources to be ingested by Azure and external services. This article explains how to ingest data directly from an event hub into a Log Analytics workspace using a data collection rule.


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a destination table for Event Hub data in your Log Analytics workspace
> * Create a data collection endpoint
> * Create a data collection rule
> * Grant the data collection rule permissions to the Event Hub
> * Associate the data collection rule with the Event Hub

## Prerequisites

- [Log Analytics workspace](../logs/quick-create-workspace.md) where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- [Dedicated cluster linked to the Log Analytics workspace](../logs/logs-dedicated-clusters.md#link-a-workspace-to-a-cluster).
- [Event hub](/azure/event-hubs/event-hubs-create) with events.
    
    Send events to your event hub by following the steps in the [Send and receive events in Azure Event Hubs tutorials](../../event-hubs/event-hubs-create.md#next-steps) or by [configuring the diagnostic settings of Azure resources](../essentials/diagnostic-settings.md#create-diagnostic-settings).



## Create a destination table for Event Hub data in your Log Analytics workspace

Create the table to which you'll ingest events from Event Hubs, providing the table name (`<table_name>`) and a definition of each of the table columns:  

```PowerShell
$tableParams = @'
{
    "properties": {
        "schema": {
            "name": "<table_name>",
            "columns": [
                {
                    "name": "TimeGenerated",
                    "type": "datetime",
                    "description": "The time at which the data was generated"
                },
                {
                    "name": "RawData",
                    "type": "string",
                    "description": "Body of the event"
                },
                {
                    "name": "Properties",
                    "type": "dynamic",
                    "description": "Additional message properties"
                }
            ]
        }
    }
}
'@

Invoke-AzRestMethod -Path "/subscriptions/<subscription_id>/resourcegroups/<resource_group>/providers/microsoft.operationalinsights/workspaces/{workspace}/tables<table_name>?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
```

To find your subscription ID, Log Analytics workspace resource ID, and resource group name in the Azure portal, navigate to your workspace in the **Log Analytics workspaces** menu and select **Properties**.

:::image type="content" source="media/tutorial-logs-ingestion-api/workspace-resource-id.png" lightbox="media/tutorial-logs-ingestion-api/workspace-resource-id.png" alt-text="Screenshot showing workspace resource ID.":::

> [!IMPORTANT]
> Azure Monitor automatically adds the `_CL` (custom logs) suffix to all tables not created by an Azure resource. Be sure to set `<table_name>_CL` as the `outputStream` in the `dataFlows` definition when you create your data collection rule.

## Create a data collection endpoint

Data collection rules require you to specify a data collection endpoint from which to collect data.

[Create a data collection endpoint](../logs/tutorial-logs-ingestion-api.md#create-data-collection-endpoint) from which the data collection rule will send data from Azure Event Hubs to your Log Analytics workspace.

## Create a data collection rule

Azure Monitor uses [data collection rules](../essentials/data-collection-rule-overview.md) to define what data should be collected, how to transform that data, and where to send the data you collect.

1. In the Azure portal's search box, type in *template* and then select **Deploy a custom template**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/deploy-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/deploy-custom-template.png" alt-text="Screenshot to deploy custom template.":::

2. Click **Build your own template in the editor**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/build-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/build-custom-template.png" alt-text="Screenshot to build template in the editor.":::

3. Paste the Resource Manager template below into the editor and then click **Save**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/edit-template.png" lightbox="media/tutorial-workspace-transformations-api/edit-template.png" alt-text="Screenshot to edit Resource Manager template.":::

    Notice the following details in the DCR defined in this template:

    - `dataCollectionEndpointId`: Resource ID of the data collection endpoint.
    - `streamDeclarations`: Defines the columns of the incoming data.
    - `destinations`: Specifies the destination workspace.
    - `dataFlows`: Matches the stream with the destination workspace and specifies the transformation query and the destination table.

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
                "metadata": {
                    "description": "Specifies the location in which to create the Data Collection Rule."
                }
            },
            "workspaceName": {
                "type": "string",
                "metadata": {
                    "description": "Name of the Log Analytics workspace to use."
                }
            },
            "workspaceResourceId": {
                "type": "string",
                "metadata": {
                    "description": "Specifies the Azure resource ID of the Log Analytics workspace to use."
                }
            },
            "endpointResourceId": {
                "type": "string",
                "metadata": {
                    "description": "Specifies the Azure resource ID of the Data Collection Endpoint to use."
                }
            },
            "tableName": { 
                "type": "string", 
                "metadata": { 
                    "description": "Specifies the name of the table in the workspace." 
                } 
            },
            "consumerGroup": {
                "type": "string",
                "metadata": {
                    "description": "Specifies consumer group of event hub. If not filled, default consumer group will be used"
                },
                "defaultValue": ""
            }
        },
        "resources": [
            {
                "type": "Microsoft.Insights/dataCollectionRules",
                "name": "[parameters('dataCollectionRuleName')]",
                "location": "[parameters('location')]",
                "apiVersion": "2022-06-01",
                "identity": {
                                 "type": "systemAssigned"
                  },
                "properties": {
                    "dataCollectionEndpointId": "[parameters('endpointResourceId')]",
                    "streamDeclarations": {
                        "Custom-MyEventHubStream": {
                            "columns": [
                    {
                        "name": "TimeGenerated",
                        "type": "datetime"
                    },
                    {
                        "name": "RawData",
                        "type": "string"
                    },
                    {
                        "name": "Properties",
                        "type": "dynamic"
                    }
                ]
                        }
                    },
                    "dataSources": {
                        "dataImports": {
                             "eventHub": {
                                        "consumerGroup": "[if(not(empty(parameters('consumerGroup')))), parameters('consumerGroup'), json('null')]",
                                        "stream": "Custom-MyEventHubStream",
                                         "name": "myEventHubDataSource1"
                                                              }
                                               }
    
                    },
                    "destinations": {
                        "logAnalytics": [
                            {
                                "workspaceResourceId": "[parameters('workspaceResourceId')]",
                                "name": "[parameters('workspaceName')]"
                            }
                        ]
                    },
                    "dataFlows": [
                        {
                            "streams": [
                                "Custom-MyEventHubStream"
                            ],
                            "destinations": [
                                "[parameters('workspaceName')]"
                            ],
                            "transformKql": "source",
                            "outputStream": "[concat('Custom-', parameters('tableName'))]" 
                        }
                    ]
                }
            }
        ]
    }
    ```

## Grant the data collection rule permissions to the Event Hub
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Associate the data collection rule with the Event Hub
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->


## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 7. Next steps
Required: A single link in the blue box format. Point to the next logical tutorial 
in a series, or, if there are no other tutorials, to some other cool thing the 
customer can do. 
-->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)

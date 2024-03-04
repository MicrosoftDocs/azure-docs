---
title: Ingest events from Azure Event Hubs into Azure Monitor Logs (Preview)
description: Ingest logs from Event Hubs into Azure Monitor Logs 
services: azure-monitor
author: guywi-ms
ms.author: guywild
ms.reviewer: ilanawaitser
ms.topic: tutorial 
ms.date: 09/20/2022
ms.custom: references_regions 

# customer-intent: As a DevOps engineer, I want to ingest data from an event hub into a Log Analytics workspace so that I can monitor logs that I send to Azure Event Hubs.
---


# Tutorial: Ingest events from Azure Event Hubs into Azure Monitor Logs (Preview)

[Azure Event Hubs](../../event-hubs/event-hubs-about.md) is a big data streaming platform that collects events from multiple sources to be ingested by Azure and external services. This article explains how to ingest data directly from an event hub into a Log Analytics workspace.


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a destination table for event hub data in your Log Analytics workspace
> * Create a data collection endpoint
> * Create a data collection rule
> * Grant the data collection rule permissions to the event hub
> * Associate the data collection rule with the event hub

## Prerequisites

To send events from Azure Event Hubs to Azure Monitor Logs, you need these resources, *all in the same region*:

- [Log Analytics workspace](../logs/quick-create-workspace.md) where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- Your Log Analytics workspace needs to be [linked to a dedicated cluster](../logs/logs-dedicated-clusters.md#link-a-workspace-to-a-cluster) or to have a [commitment tier](../logs/cost-logs.md#commitment-tiers).
- [Event Hubs namespace](/azure/event-hubs/event-hubs-features#namespace) that permits public network access. Private Link and Network Security Perimeters (NSP) are currently not supported.
- [Event hub](/azure/event-hubs/event-hubs-create) with events. You can send events to your event hub by following the steps in [Send and receive events in Azure Event Hubs tutorials](../../event-hubs/event-hubs-create.md#next-steps) or by [configuring the diagnostic settings of Azure resources](../essentials/diagnostic-settings.md#create-diagnostic-settings).

## Supported regions

Azure Monitor currently supports ingestion from Event Hubs in these regions:

| Americas | Europe | Middle East | Africa | Asia Pacific |
| - | - | - | - | - |
|	Brazil South	|	France Central	|	UAE North	|	South Africa North	|	Australia Central	|
|	Brazil Southeast	|	North Europe	|		|		|	Australia East	|
|	Canada Central	|	Norway East	|		|		|	Australia Southeast	|
|	Canada East	|	Switzerland North	|		|		|	Central India	|
|	East US	|	Switzerland West	|		|		|	East Asia	|
|	East US 2	|	UK South	|		|		|	Japan East	|
|	South Central US	|	UK West	|		|		|	Jio India West	|
|	West US	|	West Europe	|		|		|	Korea Central	|
|	West US 3	 |		|		|		|	Southeast Asia	|

## Collect required information

You need your subscription ID, resource group name, workspace name, workspace resource ID, and event hub resource ID in subsequent steps:

1. Navigate to your workspace in the **Log Analytics workspaces** menu and select **Properties** and copy your **Subscription ID**, **Resource group**, and **Workspace name**. You'll need these details to create resources in this tutorial. 

    :::image type="content" source="media/ingest-logs-event-hub/create-custom-table-prepare.png" lightbox="media/ingest-logs-event-hub/create-custom-table-prepare.png" alt-text="Screenshot showing Log Analytics workspace overview screen with subscription ID, resource group name, and workspace name highlighted.":::

1. Select **JSON** to open the **Resource JSON** screen and copy the workspace's **Resource ID**. You'll need the workspace resource ID to create a data collection rule. 

    :::image type="content" source="media/ingest-logs-event-hub/log-analytics-workspace-id.png" lightbox="media/ingest-logs-event-hub/log-analytics-workspace-id.png" alt-text="Screenshot showing the Resource JSON screen with the workspace resource ID highlighted.":::

1. Navigate to your event hub instance, select **JSON** to open the **Resource JSON** screen, and copy the event hub's **Resource ID**. You'll need the event hub's resource ID to associate the data collection rule with the event hub.

    :::image type="content" source="media/ingest-logs-event-hub/event-hub-resource-id.png" lightbox="media/ingest-logs-event-hub/event-hub-resource-id.png" alt-text="Screenshot showing the Resource JSON screen with the event hub resource ID highlighted.":::
## Create a destination table in your Log Analytics workspace

Before you can ingest data, you need to set up a destination table. You can ingest data into custom tables and [supported Azure tables](../logs/logs-ingestion-api-overview.md#supported-tables).

To create a custom table into which to ingest events, in the Azure portal:  

1. Select the **Cloud Shell** button and ensure the environment is set to **PowerShell**.

    :::image type="content" source="media/ingest-logs-event-hub/create-custom-table-open-cloud-shell.png" lightbox="media/ingest-logs-event-hub/create-custom-table-open-cloud-shell.png" alt-text="Screenshot showing how to open Cloud Shell.":::


1. Run this PowerShell command to create the table, providing the table name (`<table_name>`) in the JSON (that too with suffix *_CL* in case of custom table), and setting the `<subscription_id>`, `<resource_group_name>`, `<workspace_name>`, and `<table_name>` values in the `Invoke-AzRestMethod -Path` command:

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
                        "description": "The time at which the data was ingested."
                    },
                    {
                        "name": "RawData",
                        "type": "string",
                        "description": "Body of the event."
                    },
                    {
                        "name": "Properties",
                        "type": "dynamic",
                        "description": "Additional message properties."
                    }
                ]
            }
        }
    }
    '@
    
    Invoke-AzRestMethod -Path "/subscriptions/<subscription_id>/resourcegroups/<resource_group_name>/providers/microsoft.operationalinsights/workspaces/<workspace_name>/tables/<table_name>?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
    ```

> [!IMPORTANT]
> - Column names must start with a letter and can consist of up to 45 alphanumeric characters and underscores (`_`). 
> - The following are reserved column names: `Type`, `TenantId`, `resource`, `resourceid`, `resourcename`, `resourcetype`, `subscriptionid`, `tenanted`. 
> - Column names are case-sensitive. Make sure to use the correct case in your data collection rule. 

## Create a data collection endpoint

To collect data with a data collection rule, you need a data collection endpoint: 

1. [Create a data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint). 

    > [!IMPORTANT]
    > Create the data collection endpoint in the same region as your Log Analytics workspace.

1. From the data collection endpoint's Overview screen, select **JSON View**.

    :::image type="content" source="media/ingest-logs-event-hub/data-collection-endpoint-details.png" lightbox="media/ingest-logs-event-hub/data-collection-rule-details.png" alt-text="Screenshot that shows the data collection endpoint Overview screen.":::

1. Copy the **Resource ID** for the data collection rule. You'll use this information in the next step.

    :::image type="content" source="media/ingest-logs-event-hub/data-collection-rule-json-view.png" lightbox="media/ingest-logs-event-hub/data-collection-rule-json-view.png" alt-text="Screenshot that shows the data collection endpoint JSON view.":::
    
## Create a data collection rule

Azure Monitor uses [data collection rules](../essentials/data-collection-rule-overview.md) to define which data to collect, how to transform that data, and where to send the data.

To create a data collection rule in the Azure portal:

1. In the portal's search box, type in *template* and then select **Deploy a custom template**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/deploy-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/deploy-custom-template.png" alt-text="Screenshot to deploy custom template.":::

1. Select **Build your own template in the editor**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/build-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/build-custom-template.png" alt-text="Screenshot to build template in the editor.":::

1. Paste the Resource Manager template below into the editor and then select **Save**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/edit-template.png" lightbox="media/tutorial-workspace-transformations-api/edit-template.png" alt-text="Screenshot to edit Resource Manager template.":::

    Notice the following details in the data collection rule below:

    - `identity` - Defines which type of [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to use. In our example, we use system-assigned identity. You can also [configure user-assigned managed identity](#configure-user-assigned-managed-identity-optional).
    
    - `dataCollectionEndpointId` - Resource ID of the data collection endpoint.
    - `streamDeclarations` - Defines which data to ingest from the event hub (incoming data). The stream declaration can't be modified. 
       
       - `TimeGenerated` - The time at which the data was ingested from event hub to Azure Monitor Logs.
       - `RawData` - Body of the event. For more information, see [Read events](../../event-hubs/event-hubs-features.md#read-events).
       - `Properties` - User properties from the event. For more information, see [Read events](../../event-hubs/event-hubs-features.md#read-events).
    
    - `datasources` - Specifies the [event hub consumer group](../../event-hubs/event-hubs-features.md#consumer-groups) and the stream to which you ingest the data.
    - `destinations` - Specifies all of the destinations where the data will be sent. You can [ingest data to one or more Log Analytics workspaces](../essentials/data-collection-transformations.md#).
    - `dataFlows` - Matches the stream with the destination workspace and specifies the transformation query and the destination table. In our example, we ingest data to the custom table we created previously. You can also [ingest into a supported Azure table](#ingest-log-data-into-an-azure-table-optional). 
    - `transformKql` - Specifies a transformation to apply to the incoming data (stream declaration) before it's sent to the workspace. In our example, we set `transformKql` to `source`, which doesn't modify the data from the source in any way, because we're mapping incoming data to a custom table we've created specifically with the corresponding schema. If you're ingesting data to a table with a different schema or to filter data before ingestion, [define a data collection transformation](../essentials/data-collection-transformations.md#multiple-destinations).

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "dataCollectionRuleName": {
                "type": "string",
                "metadata": {
                    "description": "Specifies the name of the data collection Rule to create."
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
                    "description": "Specifies the Azure resource ID of the data collection endpoint to use."
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
                    "description": "Specifies the consumer group of event hub."
                },
                "defaultValue": "$Default"
            }
        },
        "resources": [
            {
                "type": "Microsoft.Insights/dataCollectionRules",
                "name": "[parameters('dataCollectionRuleName')]",
                "location": "[resourceGroup().location]", 
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
                                        "consumerGroup": "[parameters('consumerGroup')]",
                                        "stream": "Custom-MyEventHubStream",
                                        "name": "myEventHubDataSource1"
                                                              }
                                               }
                   },
                    "destinations": {
                        "logAnalytics": [
                            {
                                "workspaceResourceId": "[parameters('workspaceResourceId')]",
                                "name": "MyDestination"
                            }
                        ]
                    },
                    "dataFlows": [
                        {
                            "streams": [
                                "Custom-MyEventHubStream"
                            ],
                            "destinations": [
                                "MyDestination"
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
1. On the **Custom deployment** screen, specify a **Subscription** and **Resource group** to store the data collection rule and then provide values for the parameters defined in the template, including: 

    - **Region** - Region for the data collection rule. Populated automatically based on the resource group you select. 
    - **Data Collection Rule Name** - Give the rule a name.
    - **Workspace Resource ID** - See [Collect required information](#collect-required-information). 
    - **Endpoint Resource ID** - Generated when you [create the data collection endpoint](#create-a-data-collection-endpoint).
    - **Table Name** - The name of the destination table. In our example, and whenever you use a custom table, the table name must end with the suffix *_CL*. If you're ingesting data to an Azure table, enter the table name - for example, `Syslog` - without the suffix.  
    - **Consumer Group** - By default, the consumer group is set to `$Default`. If needed, change the value to a different [event hub consumer group](../../event-hubs/event-hubs-features.md#consumer-groups). 

    :::image type="content" source="media/ingest-logs-event-hub/data-collection-rule-custom-template-deployment.png" lightbox="media/ingest-logs-event-hub/data-collection-rule-custom-template-deployment.png" alt-text="Screenshot showing the Custom Template Deployment screen with the deployment values for the data collection rule set up in this tutorial.":::

1. Select **Review + create** and then **Create** when you review the details.

1. When the deployment is complete, expand the **Deployment details** box, and select your data collection rule to view its details. Select **JSON View**.

    :::image type="content" source="media/ingest-logs-event-hub/data-collection-rule-details.png" lightbox="media/ingest-logs-event-hub/data-collection-rule-details.png" alt-text="Screenshot that shows the Data Collection Rule Overview screen.":::

1. Copy the **Resource ID** for the data collection rule. You'll use this information in the next step.

    :::image type="content" source="media/ingest-logs-event-hub/data-collection-rule-json-view.png" lightbox="media/ingest-logs-event-hub/data-collection-rule-json-view.png" alt-text="Screenshot that shows the data collection rule JSON view.":::

### Configure user-assigned managed identity (optional)

To configure your data collection rule to support [user-assigned identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md), in the example above, replace:

```json
    "identity": {
                        "type": "systemAssigned"
        },
``` 

with:

```json
    "identity": {
            "type": "userAssigned",
            "userAssignedIdentities": {
                "<identity_resource_Id>": {
                }
            }
        },
```

To find the `<identity_resource_Id>` value, navigate to your user-assigned managed identity resource in the Azure portal, select **JSON** to open the **Resource JSON** screen and copy the managed identity's **Resource ID**. 

:::image type="content" source="media/ingest-logs-event-hub/managed-identity-resource-id.png" lightbox="media/ingest-logs-event-hub/managed-identity-resource-id.png" alt-text="Screenshot showing Resource JSON screen with the managed identity resource ID highlighted.":::

### Ingest log data into an Azure table (optional)

To ingest data into a [supported Azure table](../logs/logs-ingestion-api-overview.md#supported-tables): 

1. In the data collection rule, change `outputStream`: 

    From: `"outputStream": "[concat('Custom-', parameters('tableName'))]"`
    
    To: `"outputStream": "outputStream": "[concat(Microsoft-', parameters('tableName'))]"`
    
1. In `transformKql`, [define a transformation](../essentials/data-collection-transformations-structure.md#transformation-structure) that sends the ingested data into the target columns in the destination Azure table.
## Grant the event hub permission to the data collection rule

With [managed identity](../../active-directory/managed-identities-azure-resources/overview.md), you can give any event hub, or Event Hubs namespace, permission to send events to the data collection rule and data collection endpoint you created. When you grant the permissions to the Event Hubs namespace, all event hubs within the namespace inherit the permissions. 

1. From the event hub or Event Hubs namespace in the Azure portal, select **Access Control (IAM)** > **Add role assignment**. 

    :::image type="content" source="media/ingest-logs-event-hub/event-hub-add-role-assignment.png" lightbox="media/ingest-logs-event-hub/event-hub-add-role-assignment.png" alt-text="Screenshot that shows the Access control screen for the data collection rule.":::

2. Select **Azure Event Hubs Data Receiver** and select **Next**.   

    :::image type="content" source="media/ingest-logs-event-hub/event-hub-data-receiver-role-assignment.png" lightbox="media/ingest-logs-event-hub/event-hub-data-receiver-role-assignment.png" alt-text="Screenshot that shows the Add Role Assignment screen for the event hub with the Azure Event Hubs Data Receiver role highlighted.":::

3. Select **User, group, or service principal** for **Assign access to** and click **Select members**. Select your DCR and click **Select**.

    :::image type="content" source="media/ingest-logs-event-hub/event-hub-add-role-assignment-select-member.png" lightbox="media/ingest-logs-event-hub/event-hub-add-role-assignment-select-member.png" alt-text="Screenshot that shows the Members tab of the Add Role Assignment screen.":::


4. Select **Review + assign** and verify the details before saving your role assignment.

    :::image type="content" source="media/ingest-logs-event-hub/event-hub-add-role-assignment-save.png" lightbox="media/ingest-logs-event-hub/event-hub-add-role-assignment-save.png" alt-text="Screenshot that shows the Review and Assign tab of the Add Role Assignment screen.":::


## Associate the data collection rule with the event hub

The final step is to associate the data collection rule to the event hub from which you want to collect events. 

You can associate a single data collection rule with multiple event hubs that share the same [consumer group](../../event-hubs/event-hubs-features.md#consumer-groups) and ingest data to the same stream. Alternatively, you can associate a unique data collection rule to each event hub.

> [!IMPORTANT]
> You must associate at least one data collection rule to the event hub to ingest data from an event hub. When you delete all data collection rule associations related to the event hub, you'll stop ingesting data from the event hub.

To create a data collection rule association in the Azure portal:

1. In the Azure portal's search box, type in *template* and then select **Deploy a custom template**.

1. Select **Build your own template in the editor**.

1. Paste the Resource Manager template below into the editor and then select **Save**.

    ```JSON
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "eventHubResourceID": {
          "type": "string",
          "metadata": {
            "description": "Specifies the Azure resource ID of the event hub to use."
          }
        },
        "associationName": {
          "type": "string",
          "metadata": {
            "description": "The name of the association."
          }
        },
        "dataCollectionRuleID": {
          "type": "string",
          "metadata": {
            "description": "The resource ID of the data collection rule."
          }
        }
      },
      "resources": [
        {
          "type": "Microsoft.Insights/dataCollectionRuleAssociations",
          "apiVersion": "2021-09-01-preview",
          "scope": "[parameters('eventHubResourceId')]",
          "name": "[parameters('associationName')]",
          "properties": {
            "description": "Association of data collection rule. Deleting this association will break the data collection for this event hub.",
            "dataCollectionRuleId": "[parameters('dataCollectionRuleId')]"
          }
        }
      ]
    }
    ```

1. On the **Custom deployment** screen, specify a **Subscription** and **Resource group** to store the data collection rule association and then provide values for the parameters defined in the template, including: 

    - **Region** - Populated automatically based on the resource group you select.
    - **Event Hub Resource ID** - See [Collect required information](#collect-required-information).  
    - **Association Name** - Give the association a name.
    - **Data Collection Rule ID** - Generated when you [create the data collection rule](#create-a-data-collection-rule).
  
    :::image type="content" source="media/ingest-logs-event-hub/data-collection-rule-association-custom-template-deployment.png" lightbox="media/ingest-logs-event-hub/data-collection-rule-association-custom-template-deployment.png" alt-text="Screenshot showing the Custom Template Deployment screen with the deployment values for the data collection rule association set up in this tutorial.":::

1. Select **Review + create** and then **Create** when you review the details.


## Check your destination table for ingested events

Now that you've associated the data collection rule with your event hub, Azure Monitor Logs will ingest all existing events whose [retention period](/azure/event-hubs/event-hubs-features#event-retention) hasn't expired and all new events.

To check your destination table for ingested events:

1. Navigate to your workspace and select **Logs**.
1. Write a simple query in the query editor and select **Run**: 

    ```kusto
    <table_name>
    ``` 
    
    You should see events from your event hub.
`
    :::image type="content" source="media/ingest-logs-event-hub/log-analytics-query-results-with-events.png" lightbox="media/ingest-logs-event-hub/log-analytics-query-results-with-events.png" alt-text="Screenshot showing the results of a simple query on a custom table. The results consist of events ingested from an event hub.":::

## Clean up resources

In this tutorial, you created the following resources:

- Custom table 
- Data collection endpoint
- Data collection rule
- Data collection rule association

Evaluate whether you still need these resources. Delete the resources you don't need individually, or delete all of these resources at once by deleting the resource group. Resources you leave running can cost you money.

To stop ingesting data from the event hub, [delete all data collection rule associations](/rest/api/monitor/data-collection-rule-associations/delete) related to the event hub, or [delete the data collection rules](/rest/api/monitor/data-collection-rules/delete) themselves. These actions also reset event hub [checkpointing](/azure/event-hubs/event-hubs-features#checkpointing). 

## Known issues and limitations

- If you transfer a subscription between Azure AD directories, you need to follow the steps described in [Known issues with managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/known-issues#transferring-a-subscription-between-azure-ad-directories) to continue ingesting data.
- You can ingest messages of up to 64 KB from Event Hubs to Azure Monitor Logs.

## Next steps

Learn more about to:

- [Create a custom table](../logs/create-custom-table.md#create-a-custom-table).
- [Create a data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint).
- [Update an existing data collection rule](../essentials/data-collection-rule-edit.md).

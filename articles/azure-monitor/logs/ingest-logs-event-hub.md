---
title: Send events from Azure Event Hubs to Azure Monitor Logs with a data collection rule
description: Ingest logs from Event Hub into Azure Monitor Logs 
services: azure-monitor
author: guywi-ms
ms.author: guywild
ms.reviewer: ilanawaitser
ms.topic: tutorial 
ms.date: 09/20/2022
ms.custom: template-tutorial 

# customer-intent: As a workspace administrator, I want to collect data from an event hub into a Log Analytics workspace so that I can monitor application logs that I ingest using Azure Event Hubs.
---


# Tutorial: Monitor resources that send events to Azure Event Hubs with Azure Monitor Logs   

[Azure Event Hubs](../../event-hubs/event-hubs-about.md) is a big data streaming platform that collects events from multiple sources to be ingested by Azure and external services. You can monitor resources that send data to an event hub by ingesting these resource logs from Azure Event Hubs into Azure Monitor. This article explains how to ingest data directly from an event hub into a Log Analytics workspace.


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a destination table for event hub data in your Log Analytics workspace
> * Create a data collection endpoint
> * Create a data collection rule
> * Grant the data collection rule permissions to the Event Hub
> * Associate the data collection rule with the Event Hub

## Prerequisites

- [Log Analytics workspace](../logs/quick-create-workspace.md) where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- [Dedicated cluster linked to the Log Analytics workspace](../logs/logs-dedicated-clusters.md#link-a-workspace-to-a-cluster).
- [Event hub](/azure/event-hubs/event-hubs-create) with events.
    
    Send events to your event hub by following the steps in the [Send and receive events in Azure Event Hubs tutorials](../../event-hubs/event-hubs-create.md#next-steps) or by [configuring the diagnostic settings of Azure resources](../essentials/diagnostic-settings.md#create-diagnostic-settings).


## Create a destination table for event hub data in your Log Analytics workspace

You can ingest event hub data into a custom table or one of these built-in tables in your Log Analytics workspace:

- [CommonSecurityLog](/azure/azure-monitor/reference/tables/commonsecuritylog)
- [SecurityEvents](/azure/azure-monitor/reference/tables/securityevent)
- [Syslog](/azure/azure-monitor/reference/tables/syslog)
- [WindowsEvents](/azure/azure-monitor/reference/tables/windowsevent)

If you're creating a custom table or adding columns to a built-in table, follow these naming guidelines:
 
* Custom table names must have the `_CL` suffix.
* Column names can consist of alphanumeric characters and the characters `_` and `-`. They must start with a letter.  
* Columns added to built-in tables must have the suffix `_CF`. Columns in a custom table do not need this suffix. 

To create a custom table into which to ingest events, in the Azure portal:  

1. Navigate to your workspace in the **Log Analytics workspaces** menu and select **Properties** to find your subscription ID, resource group name, and workspace name.

    :::image type="content" source="media/ingest-logs-event-hub/create-custom-table-prepare.png" lightbox="media/ingest-logs-event-hub/create-custom-table-prepare.png" alt-text="Screenshot showing Log Analytics workspace overview screen with subscription ID, resource group name, and workspace name highlighted.":::

1. Select the **Cloud Shell** button and ensure the environment is set to **PowerShell**.

    :::image type="content" source="media/ingest-logs-event-hub/create-custom-table-open-cloud-shell.png" lightbox="media/ingest-logs-event-hub/create-custom-table-open-cloud-shell.png" alt-text="Screenshot showing how to open Cloud Shell.":::


1. Run this PowerShell command to create the table, providing the table name (`<table_name>`) in the JSON, and setting the `<subscription_id>`, `<resource_group_name>`, `<workspace_name>`, and `<table_name>` values in the `Invoke-AzRestMethod -Path`:

    ```PowerShell
    $tableParams = @'
    {
        "properties": {
            "schema": {
                "name": "<table_name>_CL",
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
    
    Invoke-AzRestMethod -Path "/subscriptions/<subscription_id>/resourcegroups/<resource_group_name>/providers/microsoft.operationalinsights/workspaces/<workspace_name>/tables/<table_name>_CL?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
    ```

## Create a data collection endpoint

Data collection rules require you to specify a data collection endpoint from which to collect data.

[Create a data collection endpoint](../logs/tutorial-logs-ingestion-api.md#create-data-collection-endpoint) from which the data collection rule will send data from Azure Event Hubs to your Log Analytics workspace.

## Create a data collection rule

Azure Monitor uses [data collection rules](../essentials/data-collection-rule-overview.md) to define what data should be collected, how to transform that data, and where to send the data you collect.

To generate a data collection rule JSON file in the Azure portal:

1. In the Azure portal's search box, type in *template* and then select **Deploy a custom template**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/deploy-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/deploy-custom-template.png" alt-text="Screenshot to deploy custom template.":::

1. Select **Build your own template in the editor**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/build-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/build-custom-template.png" alt-text="Screenshot to build template in the editor.":::

3. Paste the Resource Manager template below into the editor and then select **Save**.

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
                        "type": "userAssigned",
                        "userAssignedIdentities": {
                            "/subscriptions/<subscription_id>/resourceGroups/demogroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/chechenmsi": {
                                "principalId": "<principal_id>",
                                "clientId": "<client_id>"
                            }
                        }
                  },
                "properties": {
                    "dataCollectionEndpointId": "[parameters('<endpoint_resource_id>')]",
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
                                "workspaceResourceId": "[parameters('<workspace_resource_id>')]",
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
4. On the **Custom deployment** screen, specify a **Subscription** and **Resource group** to store the data collection rule and then provide values defined in the template. This includes a **Name** for the data collection rule and the **Workspace Resource ID** that you collected in a previous step. The **Location** should be the same location as the workspace. The **Region** will already be populated and is used for the location of the data collection rule.

    :::image type="content" source="media/tutorial-workspace-transformations-api/custom-deployment-values.png" lightbox="media/tutorial-workspace-transformations-api/custom-deployment-values.png" alt-text="Screenshot to edit  custom deployment values.":::

5. Select **Review + create** and then **Create** when you review the details.

6. When the deployment is complete, expand the **Deployment details** box and select your data collection rule to view its details. Select **JSON View**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/data-collection-rule-details.png" lightbox="media/tutorial-workspace-transformations-api/data-collection-rule-details.png" alt-text="Screenshot for data collection rule details.":::

7. Copy the **Resource ID** for the data collection rule. You'll use this in the next step.

    :::image type="content" source="media/tutorial-workspace-transformations-api/data-collection-rule-json-view.png" lightbox="media/tutorial-workspace-transformations-api/data-collection-rule-json-view.png" alt-text="Screenshot for data collection rule JSON view.":::

    > [!NOTE]
    > All of the properties of the DCR, such as the transformation, may not be displayed in the Azure portal even though the DCR was successfully created with those properties.

## Grant the event hub permission to the data collection rule

With [user-assigned identity](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md), you can give any data hub permission to send events to the data collection rule and data collection endpoint you created:
With managed identity [https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview](url), you can give any event hub 
1. From the data collection rule in the Azure portal, select **Access Control (IAM)** and then **Add role assignment**. 

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-create.png" alt-text="Screenshot for adding custom role assignment to DCR.":::

2. Select **Azure Event Hubs Data Receiver** and select **Next**.  You could instead create a custom action with the `Microsoft.Insights/Telemetry/Write` data action. 

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-select-role.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-select-role.png" alt-text="Screenshot for selecting role for DCR role assignment.":::

3. Select **User, group, or service principal** for **Assign access to** and click **Select members**. Select your DCR and click **Select**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-select-member.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-select-member.png" alt-text="Screenshot for selecting members for DCR role assignment.":::


4. Click **Review + assign** and verify the details before saving your role assignment.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/add-role-assignment-save.png" lightbox="media/tutorial-logs-ingestion-portal/add-role-assignment-save.png" alt-text="Screenshot for saving DCR role assignment.":::


## Associate the data collection rule with the Event Hub

The final step is to associate the data collection rule to the event hub from which you want to collect events. 

You can associate a single data collection rule with multiple event hubs that share the same [consumer group](../../event-hubs/event-hubs-features.md#consumer-groups) and ingest data to the same stream; otherwise, create a separate rule for consumer group and stream.

```powershell
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string",
      "metadata": {
        "description": "The name of the virtual machine."
      }
    },
    "associationName": {
      "type": "string",
      "metadata": {
        "description": "The name of the association."
      }
    },
    "dataCollectionRuleId": {
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
      "scope": "/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.EventHub/namespaces/IlanaEventHub-Namespace/eventhubs/<event_hub_name>",
      "name": "template_name",
      "properties": {
        "description": "Association of data collection rule. Deleting this association will break the data collection for this virtual machine.",
        "dataCollectionRuleId": "/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.Insights/dataCollectionRules/<dcr_name>"
      }
    }
  ]
}
```
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

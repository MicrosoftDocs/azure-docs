---
title: Tutorial - Add ingestion-time transformation to Azure Monitor Logs
description: This article describes how to add a custom transformation to data flowing through Azure Monitor Logs using table management features of Log Analytics workspace.
ms.subservice: logs
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 01/19/2022
---

# Tutorial: Add ingestion-time transformation to Azure Monitor Logs
[Ingestion-time transformations](ingestion-time-transformations.md) allow you to manipulate incoming data before it's stored in a Log Analytics workspace. You can add data filtering, parsing and extraction, and control the structure of the data that gets ingested. This tutorial walks through configuration of an ingestion time transformation using resource manager templates.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Configure [ingestion-time transformation](ingestion-time-transformations.md) for a table in Azure Monitor Logs
> * Write a log query for an ingestion-time transform


> [!NOTE]
> This tutorial uses PowerShell from Azure Cloud Shell to make REST API calls using the Azure Monitor **Tables** API and the Azure portal to install resource manager templates. You can use any other method to make these calls.

## Prerequisites
To complete this tutorial, you need the following: 

- Log Analytics workspace where you have at least contributor rights. 
- Permissions to create Data Collection Rule objects in the workspace.


## Overview of tutorial
In this tutorial, you'll add a column to the `LAQueryLogs` table and reduce its storage requirement by filtering out certain records and removing the contents of a column. The [LAQueryLogs table](query-audit.md#audit-data) is created when you enable [log query auditing](query-audit.md) in a workspace. You can use this same basic process to create a transformation for any [supported table](ingestion-time-transformations-supported-tables.md) in a Log Analytics workspace.  

This tutorial will use the Azure portal which provides a wizard to walk you through the process of creating an ingestion-time transformation. The following actions are performed for you when you complete this wizard:

- Updates the table schema with any additional columns from the query.
- Creates a `WorkspaceTransforms` data collection rule (DCR) and links it to the workspace if a default DCR isn't already linked to the workspace.
- Creates an ingestion-time transformation and adds it to the DCR.


## Enable query audit logs
You need to enable [query auditing](query-audit.md) for your workspace to create the `LAQueryLogs` table that you'll be working with. This is not required for all ingestion time transformations. It's just to generate the sample data that we'll be working with. 

From the **Log Analytics workspaces** menu in the Azure portal, select **Diagnostic settings** and then **Add diagnostic setting**.

:::image type="content" source="media/tutorial-ingestion-time-transformations/diagnostic-settings.png" lightbox="media/tutorial-ingestion-time-transformations/diagnostic-settings.png" alt-text="Screenshot of diagnostic settings":::

Provide a name for the diagnostic setting and select the workspace so that the auditing data is stored in the same workspace. Select the **Audit** category and  then click **Save** to save the diagnostic setting and close the diagnostic setting page.

:::image type="content" source="media/tutorial-ingestion-time-transformations/new-diagnostic-setting.png" lightbox="media/tutorial-ingestion-time-transformations/new-diagnostic-setting.png" alt-text="Screenshot of new diagnostic setting":::

Select **Logs** and then run some queries to populate `LAQueryLogs` with some data. These queries don't need to return data to be added to the audit log.

:::image type="content" source="media/tutorial-ingestion-time-transformations/sample-queries.png" lightbox="media/tutorial-ingestion-time-transformations/sample-queries.png" alt-text="Screenshot of sample log queries":::

## Update table schema
Before you can create the transformation, the following two changes must be made to the table:

- The table must be enabled for ingestion-time transformation. This is required for any table that will have a transformation, even if the transformation doesn't modify the table's schema.
- Any additional columns populated by the transformation must be added to the table.

Use the **Tables - Update** API to configure the table with the PowerShell code below. Calling the API enables the table for ingestion-time transformations, whether or not custom columns are defined. In this case, it includes a custom column called *Resources_CF* that will be populated with the transformation query. 

> [!IMPORTANT]
> A custom column in a built-in table must use a suffix of *_CF*. A column in a custom table does not require this suffix.

```PowerShell
$tableParams = @'
{
    "properties": {
        "schema": {
            "name": "LAQueryLogs",
            "columns": [
                {
                    "name": "Resources_CF",
                    "description": "The list of resources, this query ran against",
                    "type": "string",
                    "isDefaultDisplay": true,
                    "isHidden": false
                }
            ]
        }
    }
}
'@

Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{workspace}/tables/LAQueryLogs?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
```

## Define transformation query
The first step is to write the query that you'll us in the transformation. You can use Log Analytics to test this query before adding it to the data collection rule.

Open your workspace in the **Log Analytics workspaces** menu in the Azure portal and select **Logs** to open Log Analytics. Run the following query to view the contents of the `LAQueryLogs` table. Notice the contents of the `RequestContext` column. The transformation will retrieve the workspace name from this column and remove the rest of the data in it. 

``kusto
LAQueryLogs
| take 10
```

You're going to modify this query to perform the following:

- Drop rows related to querying the `LAQueryLogs` table itself to save space since these log entries aren't useful.
- Add a column for the name of the workspace that was queried.
- Remove data from the `RequestContext` column to save space.

The following query will provide these results. 

``` kusto
LAQueryLogs
| where QueryText !contains 'LAQueryLogs'
| extend Context = parse_json(RequestContext)
| extend Workspace_CF = tostring(Context['workspaces'][0])
| project-away RequestContext, Context
```

To use this query in the transformation, it requires the following changes:

- Instead of specifying a table name (`LAQueryLogs` in this case) as the source of data for this query, use the `source` keyword. This is a virtual table that always represents the incoming data in a transformation query.
- Remove any operators that aren't supported by transform queries. See [Supported tables for ingestion-time transformations](ingestion-time-transformations-supported-tables.md) for a detail list of operators that are supported.
- The query needs to be flattened to a single line.

Following is the query that you will use in the transformation after  these modifications:

```kusto
source |where QueryText !contains 'LAQueryLogs' | extend Context = parse_json(RequestContext) | extend Resources_CF = tostring(Context['workspaces']) |extend RequestContext = ''
```

> [!IMPORTANT]
> While the ingestion-time transformation KQL can contain any query parsable by the KQL subset supported, the output of the KQL must contain a column called `TimeGenerated` of type `datetime`.

## Create data collection rule (DCR)
The data collection rule contains the transformation. The first step is to create the data collection rule with the transformation. You'll then link that DCR to the workspace in a later step.

In the Azure portal's search box, type in *template* and then select **Deploy a custom template**.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/deploy-custom-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/deploy-custom-template.png" alt-text="Screenshot to deploy custom template":::

Click **Build your own template in the editor**.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/build-custom-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/build-custom-template.png" alt-text="Screenshot to build template in the editor":::

Paste the resource manager template below into the editor and then click **Save**.

:::image type="content" source="media/tutorial-ingestion-time-transformations-api/edit-template.png" lightbox="media/tutorial-ingestion-time-transformations-api/edit-template.png" alt-text="Screenshot to edit resource manager template":::


```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "dataCollectionRuleName": {
            "type": "string",
            "metadata": {
                "description": "Specifies the name of the Data Collection Rule to create."
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "westus2",
            "allowedValues": [
                "westus2",
                "eastus2",
                "eastus2euap"
            ],
            "metadata": {
                "description": "Specifies the location in which to create the Data Collection Rule."
            }
        },
        "workspaceResourceId": {
            "type": "string",
            "metadata": {
                "description": "Specifies the Azure resource ID of the Log Analytics workspace to use."
            }
        }
    },
    "resources": [
        {
            "type": "Microsoft.Insights/dataCollectionRules",
            "name": "[parameters('dataCollectionRuleName')]",
            "location": "[parameters('location')]",
            "apiVersion": "2021-09-01-preview",
            "kind": "WorkspaceTransforms",
            "properties": {
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
    "outputs": {
        "dataCollectionRuleId": {
            "type": "string",
            "value": "[resourceId('Microsoft.Insights/dataCollectionRules', parameters('dataCollectionRuleName'))]"
        }
    }
}
```
On the **Custom deployment** screen, select 


## Link workspace to DCR
The final step to enable the transformation is to link the data collection rule to the workspace.

> [!IMPORTANT]
> A workspace can only be connected to a single DCR, and the linked DCR must contain this workspace as a destination.

Use the **Workspaces - Update** API to configure the table with the PowerShell code below. 

```PowerShell
$defaultDcrParams = @'
{
    "properties": {
        "defaultDataCollectionRuleResourceId": "/subscriptions/{subscription}/resourceGroups/{resourcegroup}/providers/Microsoft.Insights/dataCollectionRules/{DCR}"
    }
}
'@

Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{workspace}?api-version=2021-12-01-preview" -Method PATCH -payload $defaultDcrParams
```


---
title: Tutorial - Add ingestion-time transformation to Azure Monitor Logs using Resource Manager templates
description: Describes how to add a custom transformation to data flowing through Azure Monitor Logs using Resource Manager templates.
ms.topic: tutorial
author: bwren
ms.author: bwren
ms.date: 07/17/2023
---

# Tutorial: Add transformation in workspace data collection rule to Azure Monitor using Resource Manager templates
This tutorial walks you through configuration of a sample [transformation in a workspace data collection rule](../essentials/data-collection-transformations.md) using Resource Manager templates. [Transformations](../essentials/data-collection-transformations.md) in Azure Monitor allow you to filter or modify incoming data before it's sent to its destination. Workspace transformations provide support for [ingestion-time transformations](../essentials/data-collection-transformations.md) for workflows that don't yet use the [Azure Monitor data ingestion pipeline](../essentials/data-collection.md).

Workspace transformations are stored together in a single [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) for the workspace, called the workspace DCR. Each transformation is associated with a particular table. The transformation is applied to all data sent to this table from any workflow not using a DCR.

> [!NOTE]
> This tutorial uses Resource Manager templates and REST API to configure a workspace transformation. See [Tutorial: Add transformation in workspace data collection rule to Azure Monitor using the Azure portal](tutorial-workspace-transformations-portal.md) for the same tutorial using the Azure portal.

In this tutorial, you learn to:

> [!div class="checklist"]
> * Configure [workspace transformation](../essentials/data-collection-transformations.md#workspace-transformation-dcr) for a table in a Log Analytics workspace.
> * Write a log query for an ingestion-time transform.


> [!NOTE]
> This tutorial uses PowerShell from Azure Cloud Shell to make REST API calls using the Azure Monitor **Tables** API and the Azure portal to install Resource Manager templates. You can use any other method to make these calls.

## Prerequisites
To complete this tutorial, you need the following: 

- Log Analytics workspace where you have at least [contributor rights](manage-access.md#azure-rbac).
- [Permissions to create Data Collection Rule objects](../essentials/data-collection-rule-overview.md#permissions) in the workspace.
- The table must already have some data.
- The table can't already be linked to the [workspace transformation DCR](../essentials/data-collection-transformations.md#workspace-transformation-dcr).


## Overview of tutorial
In this tutorial, you'll reduce the storage requirement for the `LAQueryLogs` table by filtering out certain records. You'll also remove the contents of a column while parsing the column data to store a piece of data in a custom column. The [LAQueryLogs table](query-audit.md#audit-data) is created when you enable [log query auditing](query-audit.md) in a workspace, but this is only used as a sample for the tutorial. You can use this same basic process to create a transformation for any [supported table](tables-feature-support.md) in a Log Analytics workspace.  


## Enable query audit logs
You need to enable [query auditing](query-audit.md) for your workspace to create the `LAQueryLogs` table that you'll be working with. This is not required for all ingestion time transformations. It's just to generate the sample data that this sample  transformation will use.

1. From the **Log Analytics workspaces** menu in the Azure portal, select **Diagnostic settings** and then **Add diagnostic setting**.

    :::image type="content" source="media/tutorial-workspace-transformations-portal/diagnostic-settings.png" lightbox="media/tutorial-workspace-transformations-portal/diagnostic-settings.png" alt-text="Screenshot of diagnostic settings.":::

2. Provide a name for the diagnostic setting and select the workspace so that the auditing data is stored in the same workspace. Select the **Audit** category and  then click **Save** to save the diagnostic setting and close the diagnostic setting page.

    :::image type="content" source="media/tutorial-workspace-transformations-portal/new-diagnostic-setting.png" lightbox="media/tutorial-workspace-transformations-portal/new-diagnostic-setting.png" alt-text="Screenshot of new diagnostic setting.":::

3. Select **Logs** and then run some queries to populate `LAQueryLogs` with some data. These queries don't need to actually return any data. 

    :::image type="content" source="media/tutorial-workspace-transformations-portal/sample-queries.png" lightbox="media/tutorial-workspace-transformations-portal/sample-queries.png" alt-text="Screenshot of sample log queries.":::

## Update table schema
Before you can create the transformation, the following two changes must be made to the table:

- The table must be enabled for workspace transformation. This is required for any table that will have a transformation, even if the transformation doesn't modify the table's schema.
- Any additional columns populated by the transformation must be added to the table.

Use the **Tables - Update** API to configure the table with the PowerShell code below. Calling the API enables the table for workspace transformations, whether or not custom columns are defined. In this sample, it includes a custom column called *Resources_CF* that will be populated with the transformation query. 

> [!IMPORTANT]
> Any custom columns added to a built-in table must end in *_CF*. Columns added to a custom table (a table with a name that ends in *_CL*) does not need to have this suffix.

1. Click the **Cloud Shell** button in the Azure portal and ensure the environment is set to **PowerShell**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/open-cloud-shell.png" lightbox="media/tutorial-workspace-transformations-api/open-cloud-shell.png" alt-text="Screenshot of opening Cloud Shell.":::

2. Copy the following PowerShell code and replace the **Path** parameter with the details for your workspace. 

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

3. Paste the code into the Cloud Shell prompt to run it.

    :::image type="content" source="media/tutorial-workspace-transformations-api/cloud-shell-script.png" lightbox="media/tutorial-workspace-transformations-api/cloud-shell-script.png" alt-text="Screenshot of script in Cloud Shell.":::

4. You can verify that the column was added by going to the **Log Analytics workspace** menu in the Azure portal. Select **Logs** to open Log Analytics and then expand the `LAQueryLogs` table to view its columns.

    :::image type="content" source="media/tutorial-workspace-transformations-portal/verify-table.png" lightbox="media/tutorial-workspace-transformations-portal/verify-table.png" alt-text="Screenshot of Log Analytics with new column.":::

## Define transformation query
Use Log Analytics to test the transformation query before adding it to a data collection rule. 

1. Open your workspace in the **Log Analytics workspaces** menu in the Azure portal and select **Logs** to open Log Analytics. 

2. Run the following query to view the contents of the `LAQueryLogs` table. Notice the contents of the `RequestContext` column. The transformation will retrieve the workspace name from this column and remove the rest of the data in it. 

    ```kusto
    LAQueryLogs
    | take 10
    ```

    :::image type="content" source="media/tutorial-workspace-transformations-portal/initial-query.png" lightbox="media/tutorial-workspace-transformations-portal/initial-query.png" alt-text="Screenshot of initial query in Log Analytics.":::

3. Modify the query to the following:

    ``` kusto
    LAQueryLogs
    | where QueryText !contains 'LAQueryLogs'
    | extend Context = parse_json(RequestContext)
    | extend Workspace_CF = tostring(Context['workspaces'][0])
    | project-away RequestContext, Context
    ```
    This makes the following changes:

   - Drop rows related to querying the `LAQueryLogs` table itself to save space since these log entries aren't useful.
   - Add a column for the name of the workspace that was queried.
   - Remove data from the `RequestContext` column to save space.


    :::image type="content" source="media/tutorial-workspace-transformations-portal/modified-query.png" lightbox="media/tutorial-workspace-transformations-portal/modified-query.png" alt-text="Screenshot of modified query in Log Analytics.":::


4. Make the following changes to the query to use it in the transformation:

   - Instead of specifying a table name (`LAQueryLogs` in this case) as the source of data for this query, use the `source` keyword. This is a virtual table that always represents the incoming data in a transformation query.
   - Remove any operators that aren't supported by transform queries. See [Supported tables for ingestion-time transformations](tables-feature-support.md) for a detail list of operators that are supported.
   - Flatten the query to a single line so that it can fit into the DCR JSON.

   Following is the query that you will use in the transformation after  these modifications:

   ```kusto
   source | where QueryText !contains 'LAQueryLogs' | extend Context = parse_json(RequestContext) | extend Resources_CF = tostring(Context['workspaces']) |extend RequestContext = ''
   ```

## Create data collection rule (DCR)
Since this is the first transformation in the workspace, you need to create a [workspace transformation DCR](../essentials/data-collection-transformations.md#workspace-transformation-dcr). If you create workspace transformations for other tables in the same workspace, they must be stored in this same DCR.

1. In the Azure portal's search box, type in *template* and then select **Deploy a custom template**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/deploy-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/deploy-custom-template.png" alt-text="Screenshot to deploy custom template.":::

2. Click **Build your own template in the editor**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/build-custom-template.png" lightbox="media/tutorial-workspace-transformations-api/build-custom-template.png" alt-text="Screenshot to build template in the editor.":::

3. Paste the Resource Manager template below into the editor and then click **Save**. This template defines the DCR and contains the transformation query. You don't need to modify this template since it will collect values for its parameters.

    :::image type="content" source="media/tutorial-workspace-transformations-api/edit-template.png" lightbox="media/tutorial-workspace-transformations-api/edit-template.png" alt-text="Screenshot to edit Resource Manager template.":::


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

4. On the **Custom deployment** screen, specify a **Subscription** and **Resource group** to store the data collection rule and then provide values defined in the template. This includes a **Name** for the data collection rule and the **Workspace Resource ID** that you collected in a previous step. The **Location** should be the same location as the workspace. The **Region** will already be populated and is used for the location of the data collection rule.

    :::image type="content" source="media/tutorial-workspace-transformations-api/custom-deployment-values.png" lightbox="media/tutorial-workspace-transformations-api/custom-deployment-values.png" alt-text="Screenshot to edit  custom deployment values.":::

5. Click **Review + create** and then **Create** when you review the details.

6. When the deployment is complete, expand the **Deployment details** box and click on your data collection rule to view its details. Click **JSON View**.

    :::image type="content" source="media/tutorial-workspace-transformations-api/data-collection-rule-details.png" lightbox="media/tutorial-workspace-transformations-api/data-collection-rule-details.png" alt-text="Screenshot for data collection rule details.":::

7. Copy the **Resource ID** for the data collection rule. You'll use this in the next step.

    :::image type="content" source="media/tutorial-workspace-transformations-api/data-collection-rule-json-view.png" lightbox="media/tutorial-workspace-transformations-api/data-collection-rule-json-view.png" alt-text="Screenshot for data collection rule JSON view.":::

## Link workspace to DCR
The final step to enable the transformation is to link the DCR to the workspace.

> [!IMPORTANT]
> A workspace can only be connected to a single DCR, and the linked DCR must contain this workspace as a destination.

Use the **Workspaces - Update** API to configure the table with the PowerShell code below. 

1. Click the **Cloud Shell** button to open Cloud Shell again. Copy the following PowerShell code and replace the parameters with values for your workspace and DCR. 

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

2. Paste the code into the Cloud Shell prompt to run it.

    :::image type="content" source="media/tutorial-workspace-transformations-api/cloud-shell-script-link-workspace.png" lightbox="media/tutorial-workspace-transformations-api/cloud-shell-script-link-workspace.png" alt-text="Screenshot of script to link workspace to DCR.":::

## Test transformation
Allow about 30 minutes for the transformation to take effect, and you can then test it by running a query against the table. Only data sent to the table after the transformation was applied will be affected. 

For this tutorial, run some sample queries to send data to the `LAQueryLogs` table. Include some queries against `LAQueryLogs` so you can verify that the transformation filters these records. Notice that the output has the new `Workspace_CF` column, and there are no records for `LAQueryLogs`.


## Troubleshooting
This section describes different error conditions you may receive and how to correct them.

### IntelliSense in Log Analytics not recognizing new columns in the table
The cache that drives IntelliSense may take up to 24 hours to update.

### Transformation on a dynamic column isn't working
There is currently a known issue affecting dynamic columns. A temporary workaround is to explicitly parse dynamic column data using `parse_json()` prior to performing any operations against them.

## Next steps

- [Read more about transformations](../essentials/data-collection-transformations.md)
- [See which tables support workspace transformations](tables-feature-support.md)
- [Learn more about writing transformation queries](../essentials/data-collection-transformations-structure.md)

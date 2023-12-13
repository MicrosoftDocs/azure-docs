---
title: Move a Log Analytics workspace to another Azure region by using the Azure portal
description: Use an Azure Resource Manager template to move a Log Analytics workspace from one Azure region to another by using the Azure portal.
ms.topic: how-to
ms.custom: devx-track-arm-template
ms.date: 07/02/2023
ms.reviewer: yossiy
---

# Move a Log Analytics workspace to another region by using the Azure portal

There are various scenarios in which you would want to move your existing Log Analytics workspace from one region to another. For example, Log Analytics recently became available in a region that's hosting most of your resources and you want the workspace to be closer and save egress charges. You might also want to move your workspace to a newly added region for a data sovereignty requirement.

A Log Analytics workspace can't be moved from one region to another. But you can use an Azure Resource Manager template to export the workspace resource and related resources. You can then stage the resources in another region by exporting the workspace to a template, modifying the parameters to match the destination region, and then deploying the template to the new region. For more information on Resource Manager and templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md). 

A workspace environment can be complex and include connected sources, managed solutions, linked services, alerts, and query packs. Not all resources can be exported in a Resource Manager template, and some require separate configuration when you're moving a workspace.

## Prerequisites

- To export the workspace configuration to a template that can be deployed to another region, you need the [Log Analytics Contributor](../../role-based-access-control/built-in-roles.md#log-analytics-contributor) or [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) role, or higher.

- Identify all the resources that are currently associated with your workspace, including:
  - *Connected agents*: Enter **Logs** in your workspace and query a [heartbeat](../insights/solution-agenthealth.md#azure-monitor-log-records) table to list connected agents.
    ```kusto
    Heartbeat
    | summarize by Computer, Category, OSType, _ResourceId
    ```
  - *Diagnostic settings*: Resources can send logs to Azure Diagnostics or dedicated tables in your workspace. Enter **Logs** in your workspace, and run this query for resources that send data to the `AzureDiagnostics` table:

    ```kusto
    AzureDiagnostics
    | where TimeGenerated > ago(12h)
    | summarize by  ResourceProvider , ResourceType, Resource
    | sort by ResourceProvider, ResourceType
    ```

    Run this query for resources that send data to dedicated tables:

    ```kusto
    search *
    | where TimeGenerated > ago(12h)
    | where isnotnull(_ResourceId)
    | extend ResourceProvider = split(_ResourceId, '/')[6]
    | where ResourceProvider !in ('microsoft.compute', 'microsoft.security')
    | extend ResourceType = split(_ResourceId, '/')[7]
    | extend Resource = split(_ResourceId, '/')[8]
    | summarize by tostring(ResourceProvider) , tostring(ResourceType), tostring(Resource)
    | sort by ResourceProvider, ResourceType
    ```

  - *Installed solutions*: Select **Legacy solutions** on the workspace navigation pane for a list of installed solutions.
  - *Data collector API*: Data arriving through a [Data Collector API](../logs/data-collector-api.md) is stored in custom log tables. For a list of custom log tables, select **Logs** on the workspace navigation pane, and then select **Custom log** on the schema pane.
  - *Linked services*: Workspaces might have linked services to dependent resources such as an Azure Automation account, a storage account, or a dedicated cluster. Remove linked services from your workspace. Reconfigure them manually in the target workspace.
  - *Alerts*: To list alerts, select **Alerts** on your workspace navigation pane, and then select **Manage alert rules** on the toolbar. Alerts in workspaces created after June 1, 2019, or in workspaces that were [upgraded from the Log Analytics Alert API to the scheduledQueryRules API](../alerts/alerts-log-api-switch.md) can be included in the template. 
  
     You can [check if the scheduledQueryRules API is used for alerts in your workspace](../alerts/alerts-log-api-switch.md#check-switching-status-of-workspace). Alternatively, you can configure alerts manually in the target workspace.
  - *Query packs*: A workspace can be associated with multiple query packs. To identify query packs in your workspace, select **Logs** on the workspace navigation pane, select **queries** on the left pane, and then select the ellipsis to the right of the search box. A dialog with the selected query packs opens on the right. If your query packs are in the same resource group as the workspace that you're moving, you can include it with this migration.
- Verify that your Azure subscription allows you to create Log Analytics workspaces in the target region.

## Prepare and move
The following procedures show how to prepare the workspace and resources for the move by using a Resource Manager template, and then move them to the target region by using the portal. Follow the procedures in order.

> [!NOTE]
> Not all resources can be exported through a template. You'll need to configure these separately after the workspace is created in the target region.

### Select resource groups and edit parameters

1. Sign in to the [Azure portal](https://portal.azure.com), and then select **Resource Groups**.
1. Find the resource group that contains your workspace and select it.
1. To view an alert resource, select the **Show hidden types** checkbox.
1. Select the **Type** filter. Select **Log Analytics workspace**, **Solution**, **SavedSearches**, **microsoft.insights/scheduledqueryrules**, **defaultQueryPack**, and other workspace-related resources that you have (such as an Automation account). Then select **Apply**.
1. Select the workspace, solutions, saved searches, alerts, query packs, and other workspace-related resources that you have (such as an Automation account). Then select **Export template** on the toolbar.
    
    > [!NOTE]
    > Microsoft Sentinel can't be exported with a template. You need to [onboard Sentinel](../../sentinel/quickstart-onboard.md) to a target workspace.
   
1. Select **Deploy** on the toolbar to edit and prepare the template for deployment.
1. Select **Edit parameters** on the toolbar to open the *parameters.json* file in the online editor.
1. To edit the parameters, change the `value` property under `parameters`. Here's an example:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "workspaces_name": {
          "value": "my-workspace-name"
        },
        "workspaceResourceId": {
          "value": "/subscriptions/resource-id/resourceGroups/resource-group-name/providers/Microsoft.OperationalInsights/workspaces/workspace-name"
        },
        "alertName": {
          "value": "my-alert-name"
        },
        "querypacks_name": {
          "value": "my-default-query-pack-name"
        }
      }
    }
    ```

1. Select **Save** in the editor.

### Edit the template

1. Select **Edit template** on the toolbar to open the *template.json* file in the online editor.
1. To edit the target region where the Log Analytics workspace will be deployed, change the `location` property under `resources` in the online editor. 

   To get region location codes, see [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces. For example, **Central US** should be `centralus`.
1. Remove linked-services resources (`microsoft.operationalinsights/workspaces/linkedservices`) if they're present in the template. You should reconfigure these resources manually in the target workspace.

   The following example template includes the workspace, saved search, solutions, alerts, and query pack:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "workspaces_name": {
          "type": "String"
        },
        "workspaceResourceId": {
          "type": "String"
        },
        "alertName": {
          "type": "String"
        },
        "querypacks_name": {
          "type": "String"
        }
      },
      "variables": {},
      "resources": [
        {
          "type": "microsoft.operationalinsights/workspaces",
          "apiVersion": "2020-08-01",
          "name": "[parameters('workspaces_name')]",
          "location": "france central",
          "properties": {
            "sku": {
              "name": "pergb2018"
            },
            "retentionInDays": 30,
            "features": {
              "enableLogAccessUsingOnlyResourcePermissions": true
            },
            "workspaceCapping": {
              "dailyQuotaGb": -1
            },
            "publicNetworkAccessForIngestion": "Enabled",
            "publicNetworkAccessForQuery": "Enabled"
          }
        },
        {
          "type": "Microsoft.OperationalInsights/workspaces/savedSearches",
          "apiVersion": "2020-08-01",
          "name": "[concat(parameters('workspaces_name'), '/2b5112ec-5ad0-5eda-80e9-ad98b51d4aba')]",
          "dependsOn": [
            "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaces_name'))]"
          ],
          "properties": {
            "category": "VM Monitoring",
            "displayName": "List all versions of curl in use",
            "query": "VMProcess\n| where ExecutableName == \"curl\"\n| distinct ProductVersion",
            "tags": [],
            "version": 2
          }
        },
        {
          "type": "Microsoft.OperationsManagement/solutions",
          "apiVersion": "2015-11-01-preview",
          "name": "[concat('Updates(', parameters('workspaces_name'))]",
          "location": "france central",
          "dependsOn": [
            "[resourceId('microsoft.operationalinsights/workspaces', parameters('workspaces_name'))]"
          ],
          "plan": {
            "name": "[concat('Updates(', parameters('workspaces_name'))]",
            "promotionCode": "",
            "product": "OMSGallery/Updates",
            "publisher": "Microsoft"
          },
          "properties": {
            "workspaceResourceId": "[resourceId('microsoft.operationalinsights/workspaces', parameters('workspaces_name'))]",
            "containedResources": [
              "[concat(resourceId('microsoft.operationalinsights/workspaces', parameters('workspaces_name')), '/views/Updates(', parameters('workspaces_name'), ')')]"
            ]
          }
        }
        {
          "type": "Microsoft.OperationsManagement/solutions",
          "apiVersion": "2015-11-01-preview",
          "name": "[concat('VMInsights(', parameters('workspaces_name'))]",
          "location": "france central",
          "plan": {
            "name": "[concat('VMInsights(', parameters('workspaces_name'))]",
            "promotionCode": "",
            "product": "OMSGallery/VMInsights",
            "publisher": "Microsoft"
          },
          "properties": {
            "workspaceResourceId": "[resourceId('microsoft.operationalinsights/workspaces', parameters('workspaces_name'))]",
            "containedResources": [
              "[concat(resourceId('microsoft.operationalinsights/workspaces', parameters('workspaces_name')), '/views/VMInsights(', parameters('workspaces_name'), ')')]"
            ]
          }
        },
        {
          "type": "microsoft.insights/scheduledqueryrules",
          "apiVersion": "2021-08-01",
          "name": "[parameters('alertName')]",
          "location": "france central",
          "properties": {
            "displayName": "[parameters('alertName')]",
            "severity": 3,
            "enabled": true,
            "evaluationFrequency": "PT5M",
            "scopes": [
              "[parameters('workspaceResourceId')]"
            ],
            "windowSize": "PT15M",
            "criteria": {
              "allOf": [
                {
                  "query": "Heartbeat | where computer == 'my computer name'",
                  "timeAggregation": "Count",
                  "operator": "LessThan",
                  "threshold": 14,
                  "failingPeriods": {
                    "numberOfEvaluationPeriods": 1,
                    "minFailingPeriodsToAlert": 1
                  }
                }
              ]
            },
            "autoMitigate": true,
            "actions": {}
          }
        },
        {
          "type": "Microsoft.OperationalInsights/querypacks",
          "apiVersion": "2019-09-01-preview",
          "name": "[parameters('querypacks_name')]",
          "location": "francecentral",
          "properties": {}
        },
        {
          "type": "Microsoft.OperationalInsights/querypacks/queries",
          "apiVersion": "2019-09-01-preview",
          "name": "[concat(parameters('querypacks_name'), '/00000000-0000-0000-0000-000000000000')]",
          "dependsOn": [
            "[resourceId('Microsoft.OperationalInsights/querypacks', parameters('querypacks_name'))]"
          ],
          "properties": {
            "displayName": "my-query-name",
            "body": "my-query-text",
            "related": {
              "categories": [],
              "resourceTypes": [
                  "microsoft.operationalinsights/workspaces"
              ]
            },
            "tags": {
              "labels": []
            }
          }
        }
      ]
    }
    ```

1. Select **Save** in the online editor.

### Deploy the workspace

1. Select **Subscription** to choose the subscription where the target workspace will be deployed.
1. Select **Resource group** to choose the resource group where the target workspace will be deployed. You can select **Create new** to create a new resource group for the target workspace.
1. Verify that **Region** is set to the target location where you want the network security group to be deployed.
1. Select the **Review + create** button to verify your template.
1. Select **Create** to deploy the workspace and the selected resource to the target region.
1. Your workspace, including selected resources, is now deployed in the target region. You can complete the remaining configuration in the workspace for paring functionality to the original workspace.
   - *Connect agents*: Use any of the available options, including Data Collection Rules, to configure the required agents on virtual machines and virtual machine scale sets and to specify the new target workspace as the destination.
   - *Diagnostic settings*: Update diagnostic settings in identified resources, with the target workspace as the destination.
   - *Install solutions*: Some solutions, such as [Microsoft Sentinel](../../sentinel/quickstart-onboard.md), require certain onboarding procedures and weren't included in the template. You should onboard them separately to the new workspace.
   - *Configure the Data Collector API*: Configure Data Collector API instances to send data to the target workspace.
   - *Configure alert rules*: When alerts aren't exported in the template, you need to configure them manually in the target workspace.
1. Verify that new data isn't ingested to the original workspace. Run the following query in your original workspace, and observe that there's no ingestion after the migration:

    ```kusto
    search *
    | where TimeGenerated > ago(12h)
    | summarize max(TimeGenerated) by Type
    ```

After data sources are connected to the target workspace, ingested data is stored in the target workspace. Older data stays in the original workspace and is subject to the retention policy. You can perform a [cross-workspace query](./cross-workspace-query.md). If both workspaces were assigned the same name, use a qualified name (*subscriptionName/resourceGroup/componentName*) in the workspace reference.

Here's an example for a query across two workspaces that have the same name:

```kusto
union 
  workspace('subscription-name1/<resource-group-name1/<original-workspace-name>')Update, 
  workspace('subscription-name2/<resource-group-name2/<target-workspace-name>').Update, 
| where TimeGenerated >= ago(1h)
| where UpdateState == "Needed"
| summarize dcount(Computer) by Classification
```

## Discard

If you want to discard the source workspace, delete the exported resources or the resource group that contains these resources:

1. Select the target resource group in the Azure portal.
1. On the **Overview** page:
   
   - If you created a new resource group for this deployment, select **Delete resource group** on the toolbar to delete the resource group.
   - If the template was deployed to an existing resource group, select the resources that were deployed with the template, and then select **Delete** on the toolbar to delete selected resources.

## Clean up

While new data is being ingested to your new workspace, older data in the original workspace remains available for query and is subject to the retention policy defined in the workspace. We recommend that you keep the original workspace for as long as you need older data to [query across](./cross-workspace-query.md) workspaces. 

If you no longer need access to older data in the original workspace:

1. Select the original resource group in the Azure portal. 
1. Select any resources that you want to remove, and then select **Delete** on the toolbar.

## Next steps

In this article, you moved a Log Analytics workspace and associated resources from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, see:

- [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../../site-recovery/azure-to-azure-tutorial-migrate.md)

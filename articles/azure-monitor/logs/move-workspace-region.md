---
title: Move Log Analytics workspace to another Azure region using the Azure portal
description: Use Azure Resource Manager template to move Log Analytics workspace from one Azure region to another using the Azure portal.
author: yossiy
ms.topic: how-to
ms.date: 08/17/2021
ms.author: yossiy
---

# Move Log Analytics workspace to another region using the Azure portal

There are various scenarios in which you would want to move your existing Log Analytics workspace from one region to another. For example, Log Analytics recently became available in a region that is hosting most of your resources and you want the workspace to be closer and save egress charges. You may also want to move your workspace to a newly added region for data sovereignty requirement.

Log Analytics workspace can't be moved from one region to another. You can however, use an Azure Resource Manager template to export the workspace resource and related resources. You can then stage the resources in another region by exporting the workspace to a template, modifying the parameters to match the destination region, and then deploy the template to the new region. For more information on Resource Manager and templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md). Workspace environment can be complex and include connected sources, managed solutions, linked services, alerts and query packs. Not all resources can be exported in Resource Manager template and some will require separate configuration when moving a workspace.

## Prerequisites

- To export the workspace configuration to a template that can be deployed to another region, you need either [Log Analytics Contributor](../../role-based-access-control/built-in-roles.md#log-analytics-contributor) or [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) roles or higher.

- Identify all the resources that currently associated to your workspace including:
  - Connected agents -- Enter *Logs* in your workspace and query [Heartbeat](../insights/solution-agenthealth.md#heartbeat-records) table to list connected agents.
    ```kusto
    Heartbeat
    | summarize by Computer, Category, OSType, _ResourceId
    ```
  - Installed solutions -- Click **Solutions** in workspace navigation pane for a list of installed solutions
  - Data collector API -- Data arriving through [Data Collector API](../logs/data-collector-api.md) is stored in custom log tables. Click ***Logs*** in workspace navigation pane, then **Custom log** in schema pane for a list of custom log tables
  - Linked services -- Workspace may have linked services to dependent resources such as Automation account, storage account, dedicated cluster. Remove linked services from your workspace. These should be reconfigured manually in target workspace
  - Alerts -- Click **Alerts** in your workspace navigation pane, then **Manage alert rules** in toolbar to list alerts. Alerts in workspaces created after 1-June 2019, or in workspaces that were [upgraded from legacy Log Analytics alert API to scheduledQueryRules API](../alerts/alerts-log-api-switch.md) can be included in the template. You can [check if scheduledQueryRules API is used for alerts in your workspace](../alerts/alerts-log-api-switch.md#check-switching-status-of-workspace). Alternatively, you can configure alerts manually in target workspace
  - Query pack(s) -- A workspace can be associated with multiple query packs. To identify query pack(s) in your workspace, click **Logs** in the workspace navigation pane, **queries** on left pane, then ellipsis to the right of the search box for more settings - a dialog with selected query pack will open on the right. If your query pack(s) are in the same resource group as the workspace you are moving, you can include it with this migration
- Verify that your Azure subscription allows you to create Log Analytics workspace in target region

## Prepare and move
The following steps show how to prepare the workspace and resources for the move using Resource Manager template and move them to the target region using the portal. Not all resources can be exported through a template and these will need to be configured separately once the workspace is created in target region.

### Export the template and deploy from the portal

1. Login to the [Azure portal](https://portal.azure.com), then **Resource Groups**
2. Locate the Resource Group that contains your workspace and click on it
3. To view alerts resource, select **Show hidden types** checkbox
4. Click the 'Type' filter and select **Log Analytics workspace**, **Solution**, **SavedSearches**, **microsoft.insights/scheduledqueryrules** and **defaultQueryPack** as applicable, then click Apply
5. Select the workspace, solutions, alerts, saved searches and query pack(s) that you want to move, then click **Export template** in the toolbar
    
    > [!NOTE]
    > Sentinel can't be exported with template and you need to [on-board Sentinel](../../sentinel/quickstart-onboard.md) to target workspace.
   
6. Click **Deploy** in the toolbar to edit and prepare the template for deployment
7. Click **Edit parameters** in the toolbar to open the **parameters.json** file in the online editor
8. To edit the parameters, change the **value** property under **parameters**

    Example parameters file:

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

9. Click **Save** in the editor
10. Click **Edit template** in the toolbar to open the **template.json** file in the online editor
11. To edit the target region where Log Analytics workspace will be deployed, change the **location** property under **resources** in the online editor. To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces, **Central US** = **centralus**
12. Remove linked services resources `microsoft.operationalinsights/workspaces/linkedservices` if present in template. These should be reconfigured manually in target workspace

    Example template including the workspace, saved search, solutions, alert and query pack:

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
          "apiVersion": "2021-02-01-preview",
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

13. Click **Save** in the online editor
14. Click **Subscription** to choose the subscription where the target workspace will be deployed
16. Click **Resource group** to choose the resource group where the target workspace will be deployed. You can click **Create new** to create a new resource group for the target workspace
17. Verify that the **Region** is set to the target location where you wish for the NSG to be deployed
18. Click **Review + create** button to verify your template
19. Click **Create** to deploy workspace and selected resource to the target region
20. Your workspace including selected resources are now deployed in target region and you can complete the remaining configuration in the workspace for paring functionality to original workspace
    - Connect agents -- Use any of the available options including DCR to configure the required agents on virtual machines and virtual machine scale sets and specify the new target workspace as destination
    - Install solutions -- Some solutions such as [Azure Sentinel](../../sentinel/quickstart-onboard.md) require certain onboarding procedure and weren't included in the template. You should onboard them separately to the new workspace
    - Data collector API -- Configure data collector API instances to send data to target workspace
    - Alert rules -- When alerts aren't exported in template, you need to configure them manually in target workspace
21. Very that new data isn't ingested to original workspace. Run this query in your original workspace and observe that there is no ingestion post migration time

    ```kusto
    search *
    | summarize max(TimeGenerated) by Type
    ```

Ingested data after data sources connection to target workspace is stored in target workspace while older data remains in original workspace. You can perform [cross workspace query](./cross-workspace-query.md#performing-a-query-across-multiple-resources) and if both were assigned with the same name, use qualified name (*subscriptionName/resourceGroup/componentName*) in workspace reference.

Example for query across two workspaces having the same name:

```kusto
union 
  workspace('subscription-name1/<resource-group-name1/<original-workspace-name>')Update, 
  workspace('subscription-name2/<resource-group-name2/<target-workspace-name>').Update, 
| where TimeGenerated >= ago(1h)
| where UpdateState == "Needed"
| summarize dcount(Computer) by Classification
```

## Discard

If you wish to discard the source workspace, delete the exported resources or resource group that contains these. To do so, select the target resource group in Azure portal - if you created a new resource group for this deployment, click **Delete resource group** at the toolbar in Overview page. If template was deployed to existing resource group, select the resources that were deployed with template and click **Delete** in toolbar.

## Clean up

While new data is being ingested to your new workspace, older data in original workspace remain available for query and subjected to the retention policy defined in workspace. It's recommended to remain the original workspace for the duration older data is needed to allow you to [query across](./cross-workspace-query.md#performing-a-query-across-multiple-resources) workspaces. If you no longer need access to older data in original workspace, select the original resource group in Azure portal, then select any resources that you want to remove and click **Delete** in toolbar.

## Next steps

In this tutorial, you moved an Log Analytics workspace and associated resources from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../../site-recovery/azure-to-azure-tutorial-migrate.md)

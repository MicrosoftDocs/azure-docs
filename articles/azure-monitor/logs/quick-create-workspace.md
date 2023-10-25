---
title: Create Log Analytics workspaces
description: Learn how to create a Log Analytics workspace to enable management solutions and data collection from your cloud and on-premises environments.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 07/02/2023
ms.reviewer: yossiy

# Customer intent: As a DevOps engineer or IT expert, I want to set up a workspace to collect logs from multiple data sources from Azure, on-premises, and third-party cloud deployments.
---
# Create a Log Analytics workspace

This article shows you how to create a Log Analytics workspace. When you collect logs and data, the information is stored in a workspace. A workspace has a unique workspace ID and resource ID. The workspace name must be unique for a given resource group. After you've created a workspace, configure data sources and solutions to store their data there.

You need a Log Analytics workspace if you collect data from:

* Azure resources in your subscription.
* On-premises computers monitored by System Center Operations Manager.
* Device collections from Configuration Manager.
* Diagnostics or log data from Azure Storage.

## Create a workspace

## [Portal](#tab/azure-portal)

Use the **Log Analytics workspaces** menu to create a workspace.

1. In the [Azure portal](https://portal.azure.com), enter **Log Analytics** in the search box. As you begin typing, the list filters based on your input. Select **Log Analytics workspaces**.

    :::image type="content" source="media/quick-create-workspace/azure-portal-01.png" alt-text="Screenshot that shows the search bar at the top of the Azure home screen. As you begin typing, the list of search results filters based on your input.":::

1. Select **Add**.

1. Select a **Subscription** from the dropdown.
1. Use an existing **Resource Group** or create a new one.
1. Provide a name for the new **Log Analytics workspace**, such as *DefaultLAWorkspace*. This name must be unique per resource group.
1. Select an available **Region**. For more information, see which [regions Log Analytics is available in](https://azure.microsoft.com/regions/services/). Search for Azure Monitor in the **Search for a product** box.

   :::image type="content" source="media/quick-create-workspace/create-workspace.png" alt-text="Screenshot that shows the boxes that need to be populated on the Basics tab of the Create Log Analytics workspace screen.":::

1. Select **Review + Create** to review the settings. Then select **Create** to create the workspace. A default pricing tier of pay-as-you-go is applied. No charges will be incurred until you start collecting enough data. For more information about other pricing tiers, see [Log Analytics pricing details](https://azure.microsoft.com/pricing/details/log-analytics/).

## [PowerShell](#tab/azure-powershell)

The following sample script creates a workspace with no data source configuration.

```powershell
$ResourceGroup = <"my-resource-group">
$WorkspaceName = <"log-analytics-workspace-name">
$Location = <"westeurope">

# Create the resource group if needed
try {
    Get-AzResourceGroup -Name $ResourceGroup -ErrorAction Stop
} catch {
    New-AzResourceGroup -Name $ResourceGroup -Location $Location
}

# Create the workspace
New-AzOperationalInsightsWorkspace -Location $Location -Name $WorkspaceName -ResourceGroupName $ResourceGroup
```  

> [!NOTE]
> Log Analytics was previously called Operational Insights. The PowerShell cmdlets use Operational Insights in Log Analytics commands.
  
After you've created a workspace, [configure a Log Analytics workspace in Azure Monitor by using PowerShell](./powershell-workspace-configuration.md).

## [Azure CLI](#tab/azure-cli)

Run the [az group create](/cli/azure/group#az-group-create) command to create a resource group or use an existing resource group. To create a workspace, use the [az monitor log-analytics workspace create](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-create) command.

```Azure CLI
    az group create --name <myGroup> --location <myLocation>
    az monitor log-analytics workspace create --resource-group <myGroup> \
       --workspace-name <myWorkspace>
```

For more information about Azure Monitor Logs in Azure CLI, see [Managing Azure Monitor Logs in Azure CLI](./azure-cli-log-analytics-workspace-sample.md).

## [Resource Manager template](#tab/azure-resource-manager)

The following sample uses the [Microsoft.OperationalInsights workspaces](/azure/templates/microsoft.operationalinsights/workspaces?tabs=bicep) template to create a Log Analytics workspace in Azure Monitor.
For more information about Azure Resource Manager templates, see [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md).

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

### Template file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "workspaceName": {
          "type": "string",
          "metadata": {
            "description": "Name of the workspace."
          }
      },
      "sku": {
          "type": "string",
          "allowedValues": [
            "pergb2018",
            "Free",
            "Standalone",
            "PerNode",
            "Standard",
            "Premium"
            ],
          "defaultValue": "pergb2018",
          "metadata": {
          "description": "Pricing tier: PerGB2018 or legacy tiers (Free, Standalone, PerNode, Standard or Premium) which are not available to all customers."
          }
        },
        "location": {
          "type": "string",
          "metadata": {
              "description": "Specifies the location for the workspace."
              }
        },
        "retentionInDays": {
          "type": "int",
          "defaultValue": 120,
          "metadata": {
            "description": "Number of days to retain data."
          }
        },
        "resourcePermissions": {
          "type": "bool",
          "metadata": {
            "description": "true to use resource or workspace permissions. false to require workspace permissions."
          }
        },
        "heartbeatTableRetention": {
          "type": "int",
          "metadata": {
            "description": "Number of days to retain data in Heartbeat table."
          }
        }  
      },
      "resources": [
      {
          "type": "Microsoft.OperationalInsights/workspaces",
          "name": "[parameters('workspaceName')]",
          "apiVersion": "2020-08-01",
          "location": "[parameters('location')]",
          "properties": {
              "sku": {
                  "name": "[parameters('sku')]"
              },
              "retentionInDays": "[parameters('retentionInDays')]",
              "features": {
                  "enableLogAccessUsingOnlyResourcePermissions": "[parameters('resourcePermissions')]"
              }
          },
          "resources": [
            {
              "type": "Microsoft.OperationalInsights/workspaces/tables",
              "apiVersion": "2020-08-01",
              "name": "[concat(parameters('workspaceName'),'/','Heartbeat')]",
              "dependsOn": [
                "[parameters('workspaceName')]"
              ],
              "properties": {
                "RetentionInDays": "[parameters('heartbeatTableRetention')]"
              }
            }
          ]
      }
  ]
}
```

> [!NOTE]
> If you specify a pricing tier of **Free**, then remove the **retentionInDays** element.

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "value": "MyWorkspace"
    },
    "sku": {
      "value": "pergb2018"
    },
    "location": {
      "value": "eastus"
    },
    "resourcePermissions": {
      "value": true
    },
    "heartbeatTableRetention": {
      "value": 30
    }
  }
}
```
---

## Troubleshooting

When you create a workspace that was deleted in the last 14 days and in [soft-delete state](../logs/delete-workspace.md#soft-delete-behavior), the operation could have a different outcome depending on your workspace configuration:

1. If you provide the same workspace name, resource group, subscription, and region as in the deleted workspace, your workspace will be recovered including its data, configuration, and connected agents.
1. Workspace names must be unique for a resource group. If you use a workspace name that already exists, or is soft deleted, an error is returned. To permanently delete your soft-deleted name and create a new workspace with the same name, follow these steps:

   1. [Recover](../logs/delete-workspace.md#recover-a-workspace) your workspace.
   1. [Permanently delete](../logs/delete-workspace.md#permanent-workspace-delete) your workspace.
   1. Create a new workspace by using the same workspace name.
  
## Next steps

Now that you have a workspace available, you can configure collection of monitoring telemetry, run log searches to analyze that data, and add a management solution to provide more data and analytic insights. To learn more:

* See [Monitor health of Log Analytics workspace in Azure Monitor](../logs/monitor-workspace.md) to create alert rules to monitor the health of your workspace.
* See [Collect Azure service logs and metrics for use in Log Analytics](../essentials/resource-logs.md#send-to-log-analytics-workspace) to enable data collection from Azure resources with Azure Diagnostics or Azure Storage.
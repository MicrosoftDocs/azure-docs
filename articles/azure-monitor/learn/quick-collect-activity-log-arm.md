---
title: Create a Log Analytics workspace in the Azure Portal
description: Learn how to create a Log Analytics workspace to enable management solutions and data collection from your cloud and on-premises environments in the Azure portal.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/26/2020

---

# Send Azure Activity log to Log Analytics workspace using Azure Resource Manager template 
The Activity log is a platform log in Azure that provides insight into subscription-level events. This includes such information as when a resource is modified or when a virtual machine is started. You can view the Activity log in the Azure portal or retrieve entries with PowerShell and CLI. This quickstart shows how to create a Log Analytics workspace and a diagnostic setting to send the Activity log to Azure Monitor Logs where you can analyze it using log queries.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]


## Prerequisites
[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 

## Sign in to Azure portal
Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com). 



## Create a Log Analytics workspace

### Review the template
The following template creates an empty Log Analytics workspace. Save the this template as *CreateWorkspace.json*.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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
          "allowedValues": [
          "australiacentral", 
          "australiaeast", 
          "australiasoutheast", 
          "brazilsouth",
          "canadacentral", 
          "centralindia", 
          "centralus", 
          "eastasia", 
          "eastus", 
          "eastus2", 
          "francecentral", 
          "japaneast", 
          "koreacentral", 
          "northcentralus", 
          "northeurope", 
          "southafricanorth", 
          "southcentralus", 
          "southeastasia",
          "switzerlandnorth",
          "switzerlandwest",
          "uksouth", 
          "ukwest", 
          "westcentralus", 
          "westeurope", 
          "westus", 
          "westus2" 
          ],
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
        }
      },
      "resources": [
      {
          "type": "Microsoft.OperationalInsights/workspaces",
          "name": "[parameters('workspaceName')]",
          "apiVersion": "2020-03-01-preview",
          "location": "[parameters('location')]",
          "properties": {
              "sku": {
                  "name": "[parameters('sku')]"
              },
              "retentionInDays": "[parameters('retentionInDays')]",
              "features": {
                  "searchVersion": 1,
                  "legacy": 0,
                  "enableLogAccessUsingOnlyResourcePermissions": "[parameters('resourcePermissions')]"
              }
          }
      }
  ]
}
```

### Deploy the template
Deploy the template using any standard method for deploying an ARM template. 

# [CLI](#tab/CLI)

```azurecli
az login
az deployment group create \
    --name CreateWorkspace \
    --resource-group my-resource-group \
    --template-file CreateWorkspace.json \
    --parameters workspaceName='my-workspace' location='eastus'

```

# [PowerShell](#tab/PowerShell)

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName my-subscription
New-AzResourceGroupDeployment -Name AzureMonitorDeployment -ResourceGroupName my-resource-group -TemplateFile CreateWorkspace.json -workspaceName my-resource-group -location eastus
```

### Verify the deployment
Verify that the workspace has been created using one of the following commands.

# [CLI](#tab/CLI)

```azurecli
az login
az monitor log-analytics workspace show --resource-group bw-ama  --workspace-name  bw-ama
```

# [PowerShell](#tab/PowerShell)

```powershell
Get-AzOperationalInsightsWorkspace -Name bw-ama -ResourceGroupName bw-ama
```


## Create diagnostic setting
The following template creates a diagnostic setting that sends the Activity log to a Log Analytics workspace. Save the this template as *CreateDiagnosticSetting.json*.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "settingName": {
            "type": "String"
        },
        "workspaceId": {
            "type": "String"
        }
    },
    "resources": [
        {
          "type": "Microsoft.KeyVault/vaults/providers/diagnosticSettings",
          "apiVersion": "2017-05-01-preview",
          "name": "[(parameters('settingName')]",
          "dependsOn": [],
          "properties": {
            "workspaceId": "[parameters('workspaceId')]",
            "logs": [
              {
                "category": "Administrative",
                "enabled": true
              },
              {
                "category": "Alert",
                "enabled": true
              },
              {
                "category": "Autoscale",
                "enabled": true
              },
              {
                "category": "Policy",
                "enabled": true
              },
              {
                "category": "Recommendation",
                "enabled": true
              },
              {
                "category": "ResourceHealth",
                "enabled": true
              },
              {
                "category": "Security",
                "enabled": true
              },
              {
                "category": "ServiceHealth",
                "enabled": true
              }
            ]
          }
        }
    ]
}
```

### Deploy the template
Deploy the template using any standard method for deploying an ARM template.

# [CLI](#tab/CLI)

```azurecli
az login
az deployment sub create \
    --name CreateWorkspace \
    --template-file CreateDiagnosticSetting.json \
    --parameters workspaceName='my-workspace' location='eastus'

```

# [PowerShell](#tab/PowerShell)

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName my-subscription
New-AzResourceGroupDeployment -Name AzureMonitorDeployment -ResourceGroupName my-resource-group -TemplateFile CreateDiagnosticSetting.json -workspaceName my-resource-group -location eastus
```

## Retrieve data with a log query
Only new Activity log entries will be sent to the Log Analytics workspace, so perform some actions in your subscription that will be logged such as starting or stopping a virtual machine or creating or modifying another resource.

Select **Logs** in the **Azure Monitor** menu. Close the **Example Queries** page. If the scope isn't set to the workspace you just created, then click **Select scope** and locate it.

![Log Analytics scope](media/quick-collect-activity-log/log-analytics-scope.png)

In the query window, type the following query and click **Run**. This will return all records in the *AzureActivity* table which contains all the records sent from the Activity log.

![Query](media/quick-collect-activity-log/activity-log.png)

Expand one of the records to view its detailed properties


All events written to the Activity log will now be written to the 


## Next steps
Now that you have a workspace available, you can configure collection of monitoring telemetry, run log searches to analyze that data, and add a management solution to provide additional data and analytic insights. 

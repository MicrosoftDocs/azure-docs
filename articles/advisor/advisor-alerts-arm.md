---
title: Create Azure Advisor alerts for new recommendations using Resource Manager template
description: Create Azure Advisor alerts for new recommendation
ms.topic: article
ms.date: 09/09/2019
---

# Create Azure Advisor alerts on new recommendations use Resource Manager template

This article shows you how to set up an alert for new recommendations from Azure Advisor using an Azure Resource Manager template.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

Whenever Azure Advisor detects a new recommendation for one of your resources, an event is stored in [Azure Activity log](https://docs.microsoft.com/azure/azure-monitor/platform/activity-logs-overview). You can set up alerts for these events from Azure Advisor using a recommendation-specific alerts creation experience. You can select a subscription and optionally a resource group to specify the resources that you want to receive alerts on. 

You can also determine the types of recommendations by using these properties:

* Category
* Impact level
* Recommendation type

You can also configure the action that will take place when an alert is triggered by:  

* Selecting an existing action group
* Creating a new action group

To learn more about action groups, see [Create and manage action groups](../azure-monitor/platform/action-groups.md).

> [!NOTE] 
> Advisor alerts are currently only available for High Availability, Performance, and Cost recommendations. Security recommendations are not supported. 


## Review the template
The following template creates an action group with an email target and enables all service health notifications for the target subscription. Save this template as *CreateAdvisorAlert.json*.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "actionGroups_name": {
      "defaultValue": "advisorAlert",
      "type": "string"
    },
    "activityLogAlerts_name": {
      "defaultValue": "AdvisorAlertsTest",
      "type": "string"
    },
    "emailAddress": {
      "defaultValue": "<email address>",
      "type": "string"
    }
  },
  "variables": {
    "alertScope": "[concat('/','subscriptions','/',subscription().subscriptionId)]"
  },
  "resources": [
    {
      "comments": "Action Group",
      "type": "microsoft.insights/actionGroups",
      "name": "[parameters('actionGroups_name')]",
      "apiVersion": "2017-04-01",
      "location": "Global",
      "tags": {},
      "scale": null,
      "properties": {
        "groupShortName": "[parameters('actionGroups_name')]",
        "enabled": true,
        "emailReceivers": [
          {
            "name": "[parameters('actionGroups_name')]",
            "emailAddress": "[parameters('emailAddress')]"
          }
        ],
        "smsReceivers": [],
        "webhookReceivers": []
      },
      "dependsOn": []
    },
    {
      "comments": "Azure Advisor Activity Log Alert",
      "type": "microsoft.insights/activityLogAlerts",
      "name": "[parameters('activityLogAlerts_name')]",
      "apiVersion": "2017-04-01",
      "location": "Global",
      "tags": {},
      "scale": null,
      "properties": {
        "scopes": [
          "[variables('alertScope')]"
        ],
        "condition": {
          "allOf": [
            {
              "field": "category",
              "equals": "Recommendation"
            },
            {
              "field": "properties.recommendationCategory",
              "equals": "Cost"
            },
            {
              "field": "properties.recommendationImpact",
              "equals": "Medium"
            },
            {
              "field": "operationName",
              "equals": "Microsoft.Advisor/recommendations/available/action"
            }
          ]
        },
        "actions": {
          "actionGroups": [
            {
              "actionGroupId": "[resourceId('microsoft.insights/actionGroups', parameters('actionGroups_name'))]",
              "webhookProperties": {}
            }
          ]
        },
        "enabled": true,
        "description": ""
      },
      "dependsOn": [
        "[resourceId('microsoft.insights/actionGroups', parameters('actionGroups_name'))]"
      ]
    }
  ]
}
```

## Deploy the template
Deploy the template using any standard method for [deploying an ARM template](../azure-resource-manager/templates/deploy-portal.md) such as the following examples using CLI and PowerShell. Replace the sample values for **Resource Group**, and **emailAddress** with appropriate values for your environment. The workspace name must be unique among all Azure subscriptions.

# [CLI](#tab/CLI1)

```azurecli
az login
az deployment group create --name CreateAdvisorAlert --resource-group my-resource-group --template-file CreateAdvisorAlert.json --parameters emailAddress='user@contoso.com'
```

# [PowerShell](#tab/PowerShell1)

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName my-subscription
New-AzResourceGroupDeployment -Name CreateAdvisorAlert -ResourceGroupName my-resource-group -TemplateFile CreateAdvisorAlert.json -emailAddress user@contoso.com
```

---

## Verify the deployment
Verify that the workspace has been created using one of the following commands. Replace the sample values for **Resource Group** with the value you used above.

# [CLI](#tab/CLI2)

```azurecli
az monitor activity-log alert show --resource-group my-resource-group --name AdvisorAlertsTest
```

# [PowerShell](#tab/PowerShell2)

```powershell
Get-AzActivityLogAlert -ResourceGroupName my-resource-group -Name AdvisorAlertsTest
```

---


## Clean up resources
If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the alert rule and the related resources. To delete the resource group by using Azure CLI or Azure PowerShell


 
# [CLI](#tab/CLI3)

```azurecli
az group delete --name my-resource-group
```

# [PowerShell](#tab/PowerShell3)

```powershell
Remove-AzResourceGroup -Name my-resource-group
```

---

## Next steps
- Get an [overview of activity log alerts](../azure-monitor/platform/alerts-overview.md), and learn how to receive alerts.
- Learn more about [action groups](../azure-monitor/platform/action-groups.md).

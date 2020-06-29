---
title: Receive activity log alerts on Azure service notifications using Resource Manager template
description: Get notified via SMS, email, or webhook when Azure service occurs.
ms.topic: conceptual
ms.date: 06/27/2019
---

# Create activity log alerts on service notifications using Azure Resource Manager template 
## Overview

This article shows you how to set up activity log alerts for service health notifications by using the Azure portal.  

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

Service health notifications are stored in the [Azure activity log](../azure-monitor/platform/platform-logs-overview.md) Given the possibly large volume of information stored in the activity log, there is a separate user interface to make it easier to view and set up alerts on service health notifications. 

You can receive an alert when Azure sends service health notifications to your Azure subscription. You can configure the alert based on:

- The class of service health notification (Service issues, Planned maintenance, Health advisories).
- The subscription affected.
- The service(s) affected.
- The region(s) affected.

> [!NOTE]
> Service health notifications does not send an alert regarding resource health events.

You also can configure who the alert should be sent to:

- Select an existing action group.
- Create a new action group (that can be used for future alerts).

To learn more about action groups, see [Create and manage action groups](../azure-monitor/platform/action-groups.md).


## Review the template
The following template creates an action group with an email target and enables all service health notifications for the target subscription. Save this template as *CreateServiceHealthAlert.json*.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "actionGroups_name": {
            "defaultValue": "SubHealth",
            "type": "String"
        },
        "activityLogAlerts_name": {
            "defaultValue": "ServiceHealthActivityLogAlert",
            "type": "String"
        },
        "emailAddress":{
            "type":"string"
        }
    },
    "variables": {
        "alertScope":"[concat('/','subscriptions','/',subscription().subscriptionId)]"
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
            "comments": "Service Health Activity Log Alert",
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
                            "equals": "ServiceHealth"
                        },
                        {
                            "field": "properties.incidentType",
                            "equals": "Incident"
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

### Deploy the template
Deploy the template using any standard method for [deploying an ARM template](../azure-resource-manager/templates/deploy-portal.md) such as the following examples using CLI and PowerShell. Replace the sample values for **Resource Group**, **workspaceName**, and **location** with appropriate values for your environment. The workspace name must be unique among all Azure subscriptions.

# [CLI](#tab/CLI1)

```azurecli
az login
az deployment group create --name CreateServiceHealthAlert --resource-group my-resource-group --template-file CreateServiceHealthAlert.json --parameters emailAddress='user@contoso.com'
```

# [PowerShell](#tab/PowerShell1)

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionName my-subscription
New-AzResourceGroupDeployment -Name CreateServiceHealthAlert -ResourceGroupName my-resource-group -TemplateFile CreateServiceHealthAlert.json -emailAddress user@contoso.com
```

---

### Verify the deployment
Verify that the workspace has been created using one of the following commands. Replace the sample values for **Resource Group** with the value you used above.

# [CLI](#tab/CLI2)

```azurecli
az monitor activity-log alert show --resource-group my-resource-group --name ServiceHealthActivityLogAlert
```

# [PowerShell](#tab/PowerShell2)

```powershell
Get-AzOperationalInsightsWorkspace -Name my-workspace-01 -ResourceGroupName my-resource-group
```

---

## Next steps
- Learn about [best practices for setting up Azure Service Health alerts](https://www.microsoft.com/en-us/videoplayer/embed/RE2OtUa).
- Learn how to [setup mobile push notifications for Azure Service Health](https://www.microsoft.com/en-us/videoplayer/embed/RE2OtUw).
- Learn how to [configure webhook notifications for existing problem management systems](service-health-alert-webhook-guide.md).
- Learn about [service health notifications](service-notifications.md).
- Learn about [notification rate limiting](../azure-monitor/platform/alerts-rate-limiting.md).
- Review the [activity log alert webhook schema](../azure-monitor/platform/activity-log-alerts-webhook.md).
- Get an [overview of activity log alerts](../azure-monitor/platform/alerts-overview.md), and learn how to receive alerts.
- Learn more about [action groups](../azure-monitor/platform/action-groups.md).

---
title: Create an activity log alert with a Resource Manager template
description: Get notified when your Azure resources are created.
author: anirudhcavale
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 07/06/2017
ms.author: ancav
ms.component: alerts
---
# Create an activity log alert with a Resource Manager template
This article shows you how to use an [Azure Resource Manager template](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates) to configure activity log alerts. By using templates, you can easily set up many alerts that activate based on specific activity log event conditions as part of your automated deployment process.

The basic steps are:

1. Create a template as a JSON file that describes how to create the activity log alert.

2. Deploy the template by using [any deployment method](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-template-deploy).

## Resource Manager template for an activity log alert
To create an activity log alert by using a Resource Manager template, you create a resource of the type `microsoft.insights/activityLogAlerts`. Then you fill in all related properties. Here's a template that creates an activity log alert.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "activityLogAlertName": {
      "type": "string",
      "metadata": {
        "description": "Unique name (within the Resource Group) for the Activity log alert."
      }
    },
    "activityLogAlertEnabled": {
      "type": "bool",
      "defaultValue": true,
      "metadata": {
        "description": "Indicates whether or not the alert is enabled."
      }
    },
    "actionGroupResourceId": {
      "type": "string",
      "metadata": {
        "description": "Resource Id for the Action group."
      }
    }
  },
  "resources": [   
    {
      "type": "Microsoft.Insights/activityLogAlerts",
      "apiVersion": "2017-04-01",
      "name": "[parameters('activityLogAlertName')]",      
      "location": "Global",
      "properties": {
        "enabled": "[parameters('activityLogAlertEnabled')]",
        "scopes": [
            "[subscription().id]"
        ],        
        "condition": {
          "allOf": [
            {
              "field": "category",
              "equals": "Administrative"
            },
            {
              "field": "operationName",
              "equals": "Microsoft.Resources/deployments/write"
            },
            {
              "field": "resourceType",
              "equals": "Microsoft.Resources/deployments"
            }
          ]
        },
        "actions": {
          "actionGroups":
          [
            {
              "actionGroupId": "[parameters('actionGroupResourceId')]"
            }
          ]
        }
      }
    }
  ]
}
```

Visit our [Azure Quickstart gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Insights) for some examples of activity log alert templates.

> [!NOTE]

> You can also create activity log alert rules using the enhanced user experience in Monitor > [Alerts (Preview)](monitoring-overview-unified-alerts.md). For more information on how to create these, see [this article](monitoring-activity-log-alerts-new-experience.md).

## Next steps
- Learn more about [alerts](monitoring-overview-alerts.md).
- Learn how to add [action groups by using a Resource Manager template](monitoring-create-action-group-with-resource-manager-template.md).
- Learn how to [create an activity log alert to monitor all autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-alert).
- Learn how to [create an activity log alert to monitor all failed autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-failed-alert).

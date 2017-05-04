---
title: Create an activity log alert with a Resource Manager Template  | Microsoft Docs
description: Get notified when your Azure resources are created.
author: anirudhcavale
manager: carmonm
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid:
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/31/2017
ms.author: ancav

---
# Create an activity log alert with a Resource Manager Template
This article shows how you can use an [Azure Resource Manager template](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authoring-templates) to configure activity log alerts. This enables you to automatically set up alerts on your resources when they are created as part of your automated deployment process.

The basic steps are as follows:

1.	Create a template as a JSON file that describes how to create the activity log alert.
2.	[Deploy the template using any deployment method.](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-template-deploy)

Below we describe how to create a Resource Manager template first for an activity log alert alone, then for an activity log alert during the creation of another resource.

## Resource Manager template for an activity log alert
To create an activity log alert using a Resource Manager template, you create a resource of type `microsoft.insights/activityLogAlerts` and fill in all related properties. Below is a template that creates an activity log alert and the action group it will call.

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
    "actionGroupName": {
      "type": "string",
      "metadata": {
        "description": "Unique name (within the Resource Group) for the Action group."
      }
    },
    "actionGroupShortName": {
      "type": "string",
      "metadata": {
        "description": "Short name (maximum 12 characters) for the Action group."
      }
    },
    "actionGroupEnabled": {
      "type": "bool",
      "defaultValue": true,
      "metadata": {
        "description": "Indicates whether or not the action group is enabled."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/actiongroups",
      "apiVersion": "2017-03-01-preview",
      "location": "[resourceGroup().location]",
      "properties": {
        "name": "[parameters('actionGroupName')]",
        "groupShortName": "[parameters('actionGroupShortName')]",
        "actionGroupEnabled": "[variables('actionGroupEnabled')]",
        "smsReceivers": [
          {
            "name": "contosoSMS",
            "countryCode": "1",
            "phoneNumber": "5555551212"
          },
          {
            "name": "contosoSMS2",
            "countryCode": "1",
            "phoneNumber": "5555552121"
          }
        ],
        "emailReceivers": [
          {
            "name": "contosoEmail",
            "emailAddress": "devops@contoso.com"
          },
          {
            "name": "contosoEmail2",
            "emailAddress": "devops2@contoso.com"
          }
        ],
        "webhookReceivers": [
          {
            "name": "contosoHook",
            "serviceUri": "http://requestb.in/1bq62iu1"
          },
          {
            "name": "contosoHook2",
            "serviceUri": "http://requestb.in/1bq62iu1"
          }
        ]
      }
    },
    {
      "type": "Microsoft.Insights/activitylogalerts",
      "apiVersion": "2017-03-01-preview",
      "location": "[resourceGroup().location]",
      "properties": {
        "name": "[parameters('activityLogAlertName')]",
        "activityLogAlertEnabled": "[parameters('activityLogAlertEnabled')]",
        "condition": [
          {
            "field": "category",
            "equals": "ServiceHealth"
          }
        ],
        "actions": {
          "actionGroups": 
          [
            {
            "actionGroupId": "[reference(resourceId('Microsoft.Insights/actionGroups',parameters('actionGroupName')))]"
            }
          ]
        }
      }
    }
  ]
}
```

## Next Steps
Learn more about [Alerts](monitoring-overview-alerts.md)  
How to add [action groups using a Resource Manager template](monitoring-create-action-group-with-resource-manager-template.md)

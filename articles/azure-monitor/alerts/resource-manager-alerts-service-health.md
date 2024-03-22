---
title: Resource Manager template samples for service health alerts
description: Sample Azure Resource Manager templates to deploy Azure Monitor service health alerts.
ms.topic: sample
ms.custom: devx-track-arm-template
author: AbbyMSFT
ms.author: abbyweisberg
ms.reviewer: yagil
ms.date: 12/25/2023
---

# Resource Manager template samples for Azure Monitor service health alert rules

This article includes samples of [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to create and configure service health alerts in Azure Monitor. 

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]


## Template for creating service health alert rules

The following template creates a service health alert rule that sends notifications of service health events for the target subscription. Save this template as `CreateServiceHealthAlert.json` and modify it as needed.

Points to note:

1. The 'scopes' of a service health alert rule can only contain a single subscription, which must be the same subscription in which the rule is created. Multiple subscriptions, a resource group, or other types of scope aren't supported.
1. You can create service health alert rules only in the "Global" location.
1. The "properties.incidentType", "properties.impactedServices[*].ServiceName" and "properties.impactedServices[*].ImpactedRegions[*].RegionName" clauses within the rule condition are optional. You can remove these clauses to be notified on events sent for all incident types, all services, and/or all regions, respectively.
1. The service names used in the "properties.impactedServices[*].ServiceName" must be a valid Azure service name. A list of valid names can be retrieved at the [Resource Health Metadata List API](/rest/api/resourcehealth/metadata/list)


```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "actionGroups_name": {
      "type": "string",
      "defaultValue": "SubHealth"
    },
    "activityLogAlerts_name": {
      "type": "string",
      "defaultValue": "ServiceHealthActivityLogAlert"
    },
    "emailAddress": {
      "type": "string"
    }
  },
  "variables": {
    "alertScope": "[format('/subscriptions/{0}', subscription().subscriptionId)]"
  },
  "resources": [
    {
      "type": "microsoft.insights/actionGroups",
      "apiVersion": "2020-10-01",
      "name": "[parameters('actionGroups_name')]",
      "location": "Global",
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
      }
    },
    {
      "type": "microsoft.insights/activityLogAlerts",
      "apiVersion": "2017-04-01",
      "name": "[parameters('activityLogAlerts_name')]",
      "location": "Global",
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
            },
			{                     
			   "field": "properties.impactedServices[*].ServiceName",                     
			   "containsAny": [
                  "SQL Database",
                  "SQL Managed Instance"    
               ]                 
			},
            {                     
				"field": "properties.impactedServices[*].ImpactedRegions[*].RegionName",
                "containsAny": [
                   "Australia Central"
                ]
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
        "enabled": true
      },
      "dependsOn": [
        "[resourceId('microsoft.insights/actionGroups', parameters('actionGroups_name'))]"
      ]
    }
  ]
}
```

## Next steps

- [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
- [Learn more about alert rules](./alerts-overview.md).


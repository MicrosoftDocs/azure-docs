# Create activity log alerts for new recommendations 

## Overview

This article shows you how to set up an alert for new recommendations from Azure Advisor using the Azure portal and Azure Resource Manager templates. 

Whenever Azure Advisor detects a new recommendation for one of your resources, an event is stored in [Azure Activity log](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/activity-logs-overview). You can set up alerts for these events from Azure Advisor using a recommendation-specific alerts creation experience. You can select a subscription and optionally a resource group to specify the resources that you want to receive alerts on. You can also determine the types of recommendations by using these properties:

1. Category
2. Impact level
3. Recommendation type

You can also configure the action that will take place when an alert is triggered by:  
1. Selecting an existing action group
2. Creating a new action group

To learn more about action groups, see [Create and manage action groups]( https://docs.microsoft.com/en-us/azure/azure-monitor/platform/action-groups) 
NOTE: Advisor alerts are currently only available for High Availability, Performance, and Cost recommendations. Security recommendations are not supported. 

## Creating a recommendation alert from the Azure portal
**1.** In the **portal**, select **Azure Advisor** [Click here for a full screen image](./media/Advisor%20Alert/create1.png)

![Azure Advisor Banner](./media/Advisor%20Alert/create1.png)

**2.** In the **Monitoring** section of the left menu, select **Alerts**  [Click here for a full screen image](./media/Advisor%20Alert/create2.png)

![Azure Advisor Banner](./media/Advisor%20Alert/create2.png)

**3.** Select **New Advisor Alert** [Click here for a full screen image](./media/Advisor%20Alert/create3.png)

![Azure Advisor Banner](./media/Advisor%20Alert/create3.png)

**4.** In the **Scope** section, select the subscription and optionally the resource group that you want to be alerted on. [Click here for a full screen image](./media/Advisor%20Alert/create4.png)

![Azure Advisor Banner](./media/Advisor%20Alert/create4.png)

**5.** In the condition section, select the method you want to use for configuring your alert. If you want to alert for all recommendations for a certain category and/or impact level, select “Category and impact level”. If you want to alert for all recommendations of a certain type, select “Recommendation type”. [Click here for a full screen image](./media/Advisor%20Alert/create6.png)

![Azure Advisor Banner](./media/Advisor%20Alert/create6.png)

**6.** Depending on the Configure by option that you select, you will be able to specify the criteria. If you want all recommendations, just leave the remaining fields blank. [Click here for a full screen image](./media/Advisor%20Alert/create5.png)

![Azure Advisor Banner](./media/Advisor%20Alert/create5.png)

**7.** In the action groups section, select “Add existing” to use an action group you already created or select “Create new” to set up a new [action group](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/action-groups). [Click here for a full screen image](./media/Advisor%20Alert/create7.png)

![Azure Advisor Banner](./media/Advisor%20Alert/create7.png)

**8.** In the Alert details section, give your alert a name and short description. If you want your alert to be enabled, leave **Enable rule upon creation** selection set to “Yes”. Then select the resource group to save your alert to. This will not impact the targeting scope of the recommendation. [Click here for a full screen image](./media/Advisor%20Alert/create8.png)

![Azure Advisor Banner](./media/Advisor%20Alert/create8.png)


## Creating a recommendation alert and a new action group using an Azure Resource Manager template

<pre>
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "actionGroups_name": {
      "defaultValue": "advisorAlert",
      "type": "string"
    },
    "activityLogAlerts_name": {
      "defaultValue": "AdvisorAlertsTest2",
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
</pre>



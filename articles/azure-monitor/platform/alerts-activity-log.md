---
title: Create, View, and Manage Activity log Alerts in Azure Monitor
description: How to create activity log alerts by using the Azure portal, an Azure Resource Manager template, and Azure PowerShell.
author: msvijayn
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 09/15/2018
ms.author: vinagara
---
# Create, view, and manage activity log alerts using Azure Monitor  

## Overview
Activity log alerts are the alerts that get activated when a new activity log event occurs that matches the conditions specified in the alert.

These alerts are for Azure resources, can be created by using an Azure Resource Manager template. They also can be created, updated, or deleted in the Azure portal. Typically, you create activity log alerts to receive notifications when specific changes occur on resources in your Azure subscription, often scoped to particular resource groups or resource. For example, you might want to be notified when any virtual machine in (sample resource group) **myProductionResourceGroup** is deleted, or you might want to get notified if any new roles are assigned to a user in your subscription.

> [!IMPORTANT]
> Alerts on Service Health notification can not be created via the interface for activity log alert creation. To learn more about creating and using service health notifications, see [Receive activity log alerts on service health notifications](alerts-activity-log-service-notifications.md).

## Azure portal

> [!NOTE]
> 
>  While creating the alert rules, ensure the following:
> 
> - Subscription in the scope is not different from the subscription where the alert is created.
> - Criteria must be level/status/ caller/ resource group/ resource id/ resource type/ event category on which the alert is configured.
> - There is no  “anyOf” condition or nested conditions in the alert configuration JSON (basically, only one allOf is allowed with no further allOf/anyOf).
> - When the category is "administrative". You must specify at least one of the preceding criteria in your alert. You may not create an alert that activates every time an event is created in the activity logs.

### Create with Azure portal

Use the following procedure:

1. From Azure portal, select **Monitor** > **Alerts**
2. Click **New Alert Rule** at the top of the **Alerts** window.

     ![new alert rule](media/alerts-activity-log/AlertsPreviewOption.png)

     The **Create rule** window appears.

      ![new alert rule options](media/alerts-activity-log/create-new-alert-rule-options.png)

3. **Under Define Alert condition,** provide the following information, and click **Done**.

   - **Alert Target:** To view and select the target for the new alert, use **Filter by subscription** / **Filter by resource type** and select the resource or resource group from the list displayed.

     > [!NOTE]
     > 
     > you can select a resource, resource group, or an entire subscription for activity log signal.

     **Alert target sample view**
     ![Select Target](media/alerts-activity-log/select-target.png)

   - Under **Target Criteria**, click **add criteria** and all available signals for the target are displayed including those from various categories of  **Activity log**; with category name appended in **Monitor Service** name.

   - Select the signal from the list displayed of various operations possible for the type **Activity log**.

     You can select the log history timeline and the corresponding alert logic for this target signal:

     **Add criteria screen**

     ![add criteria](media/alerts-activity-log/add-criteria.png)

     **History time**: Events available for selected operation is can be plotted over the last 6/12/24 hours (or) Over the last Week.

     **Alert logic**:

     - **Event Level**- The severity level of the event. _Verbose_, _Informational_, _Warning_, _Error_, or _Critical_.
     - **Status**: The status of the event. _Started_, _Failed_, or _Succeeded_.
     - **Event initiated by**: Also known as the caller; The email address or Azure Active Directory identifier of the user who performed the operation.

       Sample signal graph with alert logic applied:

       ![ criteria selected](media/alerts-activity-log/criteria-selected.png)

4. Under **define alert rules details**, provide the following details:

    - **Alert rule name** – Name for the new alert rule
    - **Description** – Description for the new alert rule
    - **Save alert to resource group** – Select the Resource group, where you want to save this new rule.

5. Under **Action group**, from the drop-down menu, specify the action group that you want to assign to this new alert rule. Alternatively, [create a new action group](../../azure-monitor/platform/action-groups.md) and assign to the new rule. To create a new group, click **+ New group**.

6. To enable the rules after you create it, click **Yes** for **Enable rule upon creation** option.
7. Click **Create alert rule**.

    The new alert rule for the activity log is created and a confirmation message appears at the top right of the window.

    You can enable, disable, edit, or delete a rule. Learn more about managing activity log rules.


Alternatively, a simple analogy for understanding conditions on which alert rules can be created on activity log, is to explore or filter events via [Activity log in Azure portal](activity-log-view.md#azure-portal). In Azure Monitor - Activity log, one can filter or find necessary event and then create an alert by using the **Add activity log alert** button; then follow steps 4 onwards as stated in tutorial above.
    
 ![ add alert from activity log](media/alerts-activity-log/add-activity-log.png)
    

### View and manage in Azure portal

1. From Azure portal, click **Monitor** > **Alerts** and click **Manage rules** at the top left of the window.

    ![ manage alert rules](media/alerts-activity-log/manage-alert-rules.png)

    The list of available rules appears.

2. Search the Activity log rule to modify.

    ![ search activity log alert rules](media/alerts-activity-log/searth-activity-log-rule-to-edit.png)

    You can use the available filters - _Subscription_, _Resource group_,  _Resource_, _Signal Type_, or _Status_ to find the activity rule that you want to edit.

   > [!NOTE]
   > 
   > You can only edit **Description** , **Target criteria** and **Action groups**.

3. Select the rule and double-click to edit the rule options. Make the required changes and then click **Save**.

   ![ manage alert rules](media/alerts-activity-log/activity-log-rule-edit-page.png)

4. You can disable, enable, or delete a rule. Select the appropriate option at the top of the window, after selecting the rule as detailed in step 2.


## Azure Resource Template
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
The sample json above can be saved as (say) sampleActivityLogAlert.json for the purpose of this walk through and can be deployed using [Azure Resource Manager in Azure portal](../../azure-resource-manager/resource-group-template-deploy-portal.md).

> [!NOTE]
> It may take up to 5 minutes for the a new activity log alert rule to become active

## REST API 
[Azure Monitor - Activity log Alerts API](https://docs.microsoft.com/rest/api/monitor/activitylogalerts) is a REST API and fully compatible with Azure Resource Manager REST API. Hence it can be used via Powershell using Resource Manager cmdlet as well as Azure CLI.

## PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

### Deploy Resource Manager Template with PowerShell
To use PowerShell to deploy the sample Resource Template shown in a previous [Resource Template section](#resource-manager-template, use the following command:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "myRG" -TemplateFile sampleActivityLogAlert.json -TemplateParameterFile sampleActivityLogAlert.parameters.json
```

where the sampleActivityLogAlert.parameters.json contains the values provided for the parameters needed for alert rule creation.

### Use Activity log PowerShell cmdlets

Activity log alerts have dedicated PowerShell cmdlets available:

- [Set-AzActivityLogAlert](https://docs.microsoft.com/powershell/module/az.monitor/Set-AzActivityLogAlert?view=azps-1.3.0) : Creates a new or update an existing activity log alert.
- [Get-AzActivityLogAlert](https://docs.microsoft.com/powershell/module/az.monitor/Get-AzActivityLogAlert?view=azps-1.3.0) : Gets one or more activity log alert resources.
- [Enable-AzActivityLogAlert](https://docs.microsoft.com/powershell/module/az.monitor/Enable-AzActivityLogAlert?view=azps-1.3.0) : Enables an existing activity log alert and sets its Tags.
- [Disable-AzActivityLogAlert](https://docs.microsoft.com/powershell/module/az.monitor/Disable-AzActivityLogAlert?view=azps-1.3.0) : Disables an existing activity log alert and sets its tags.
- [Remove-AzActivityLogAlert](https://docs.microsoft.com/powershell/module/az.monitor/Remove-AzActivityLogAlert?view=azps-1.3.0)	: Removes an activity log alert.

## CLI

Dedicated Azure CLI commands under the set [az monitor activity-log alert](https://docs.microsoft.com/cli/azure/monitor/activity-log/alert) are available for managing activity log alert rules.

To create a new activity log alert rule, use in this order:

1. [az monitor activity-log alert create](https://docs.microsoft.com/cli/azure/monitor/activity-log/alert#az-monitor-activity-log-alert-create): Create new activity log alert rule resource
1. [az monitor activity-log alert scope](https://docs.microsoft.com/cli/azure/monitor/activity-log/alert/scope): Add scope for the created activity log alert rule
1. [az monitor activity-log alert action-group](https://docs.microsoft.com/cli/azure/monitor/activity-log/alert/action-group): Add action group to the activity log alert rule

To retrieve one activity log alert rule resource, the Azure CLI command [az monitor activity-log alert show](https://docs.microsoft.com/cli/azure/monitor/activity-log/alert#az-monitor-activity-log-alert-show
) can be used. And for viewing all activity log alert rule resource in a resource group, use [az monitor activity-log alert list](https://docs.microsoft.com/cli/azure/monitor/activity-log/alert#az-monitor-activity-log-alert-list).
Activity log alert rule resources can be removed using Azure CLI command [az monitor activity-log alert delete](https://docs.microsoft.com/cli/azure/monitor/activity-log/alert#az-monitor-activity-log-alert-delete).

## Next steps

- [Webhook schema for Activity logs](../../azure-monitor/platform/activity-log-alerts-webhook.md)
- [Overview of Activity logs](../../azure-monitor/platform/activity-log-alerts.md) 
- Learn more about [action groups](../../azure-monitor/platform/action-groups.md).  
- Learn about [service health notifications](../../azure-monitor/platform/service-notifications.md).

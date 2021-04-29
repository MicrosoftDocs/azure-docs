---
title: Create, view, and manage activity log alerts in Azure Monitor
description: Create activity log alerts by using the Azure portal, an Azure Resource Manager template, and Azure PowerShell.
ms.topic: conceptual
ms.date: 06/25/2019

---

# Create, view, and manage activity log alerts by using Azure Monitor  

## Overview

Activity log alerts are the alerts that get activated when a new activity log event occurs that matches the conditions specified in the alert.

These alerts are for Azure resources and can be created by using an Azure Resource Manager template. They also can be created, updated, or deleted in the Azure portal. Typically, you create activity log alerts to receive notifications when specific changes occur to resources in your Azure subscription. Alerts are often scoped to particular resource groups or resources. For example, you might want to be notified when any virtual machine in the sample resource group **myProductionResourceGroup** is deleted. Or, you might want to get notified if any new roles are assigned to a user in your subscription.

> [!IMPORTANT]
> Alerts on service health notification can't be created via the interface for activity log alert creation. To learn more about how to create and use service health notifications, see [Receive activity log alerts on service health notifications](../../service-health/alerts-activity-log-service-notifications-portal.md).

When you create alert rules, ensure the following:

- The subscription in the scope isn't different from the subscription where the alert is created.
- The criteria must be the level, status, caller, resource group, resource ID, or resource type event category on which the alert is configured.
- Only one "allOf" condition is allowed.
- 'AnyOf' can be used to allow multiple conditions over multiple fields (for example, if either the “status” or the “subStatus” fields equal a certain value). Note that the use of 'AnyOf' is currently limited to creating the alert rule using an ARM template deployment.
- 'ContainsAny' can be used to allow multiple values of the same field (for example, if “operation” equals either ‘delete’ or ‘modify’). Note that the use of ‘ContainsAny’ is currently limited to creating the alert rule using an ARM template deployment.
- When the category is "administrative," you must specify at least one of the preceding criteria in your alert. You may not create an alert that activates every time an event is created in the activity logs.
- Alerts cannot be created for events in Alert category of activity log.

## Azure portal

You can use the Azure portal to create and modify activity log alert rules. The experience is integrated with an Azure activity log to ensure seamless alert creation for specific events of interest.

### Create with the Azure portal

Use the following procedure.

1. In the Azure portal, select **Monitor** > **Alerts**.
2. Select **New alert rule** in the upper-left corner of the **Alerts** window.

     ![New alert rule](media/alerts-activity-log/AlertsPreviewOption.png)

     The **Create rule** window appears.

      ![New alert rule options](media/alerts-activity-log/create-new-alert-rule-options.png)

3. Under **Define alert condition**, provide the following information, and select **Done**:

   - **Alert target:** To view and select the target for the new alert, use **Filter by subscription** / **Filter by resource type**. Select the resource or resource group from the list displayed.

     > [!NOTE]
     > 
     > You can select only [Azure Resource Manager](../../azure-resource-manager/management/overview.md) tracked resource, resource group, or an entire subscription for an activity log signal. 

     **Alert target sample view**

     ![Select target](media/alerts-activity-log/select-target.png)

   - Under **Target criteria**, select **Add criteria**. All available signals for the target are displayed, which includes those from various categories of **Activity Log**. The category name is appended to the **Monitor Service** name.

   - Select the signal from the list displayed of various operations possible for the type **Activity Log**.

     You can select the log history timeline and the corresponding alert logic for this target signal:

     **Add criteria screen**

     ![Add criteria](media/alerts-activity-log/add-criteria.png)
     
     > [!NOTE]
     > 
     >  In order to have a high quality and effective rules, we ask to add at least one more condition to rules with the signal "All Administrative". 
     > As a part of the definition of the alert you must fill one of the drop downs: "Event level", "Status" or "Initiated by" and by that the rule will be more specific.

     - **History time**: Events available for the selected operation can be plotted over the last 6, 12, or 24 hours or over the last week.

     - **Alert logic**:

       - **Event level**: The severity level of the event: _Verbose_, _Informational_, _Warning_, _Error_, or _Critical_.
       - **Status**: The status of the event: _Started_, _Failed_, or _Succeeded_.
       - **Event initiated by**: Also known as the caller. The email address or Azure Active Directory identifier of the user who performed the operation.

       This sample signal graph has the alert logic applied:

       ![Criteria selected](media/alerts-activity-log/criteria-selected.png)

4. Under **Define alert details**, provide the following details:

    - **Alert rule name**: The name for the new alert rule.
    - **Description**: The description for the new alert rule.
    - **Save alert to resource group**: Select the resource group where you want to save this new rule.

5. Under **Action group**, from the drop-down menu, specify the action group that you want to assign to this new alert rule. Or, [create a new action group](./action-groups.md) and assign it to the new rule. To create a new group, select **+ New group**.

6. To enable the rules after you create them, select **Yes** for the **Enable rule upon creation** option.
7. Select **Create alert rule**.

    The new alert rule for the activity log is created, and a confirmation message appears in the upper-right corner of the window.

    You can enable, disable, edit, or delete a rule. Learn more about how to manage activity log rules.


A simple analogy for understanding conditions on which alert rules can be created in an activity log is to explore or filter events via the [activity log in the Azure portal](../essentials/activity-log.md#view-the-activity-log). In the **Azure Monitor - Activity log** screen, you can filter or find the necessary event and then create an alert by using the **Add activity log alert** button. Then follow steps 4 through 7 as previously shown.
    
 ![Add alert from activity log](media/alerts-activity-log/add-activity-log.png)
    

### View and manage in the Azure portal

1. In the Azure portal, select **Monitor** > **Alerts**. Select **Manage alert rules** in the upper-left corner of the window.

    ![Screenshot shows the activity log with the search box highlighted.](media/alerts-activity-log/manage-alert-rules.png)

    The list of available rules appears.

2. Search for the activity log rule to modify.

    ![Search activity log alert rules](media/alerts-activity-log/searth-activity-log-rule-to-edit.png)

    You can use the available filters, _Subscription_, _Resource group_,  _Resource_, _Signal type_, or _Status_, to find the activity rule that you want to edit.

   > [!NOTE]
   > 
   > You can edit only **Description**, **Target criteria**, and **Action groups**.

3. Select the rule, and double-click to edit the rule options. Make the required changes, and then select **Save**.

   ![Manage alert rules](media/alerts-activity-log/activity-log-rule-edit-page.png)

4. You can enable, disable, or delete a rule. Select the appropriate option at the top of the window after you select the rule as described in step 2.


## Azure Resource Manager template
To create an activity log alert rule by using an Azure Resource Manager template, you create a resource of the type `microsoft.insights/activityLogAlerts`. Then you fill in all related properties. Here's a template that creates an activity log alert  rule:

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
The previous sample JSON can be saved as, for example, sampleActivityLogAlert.json for the purpose of this walk-through and can be deployed by using [Azure Resource Manager in the Azure portal](../../azure-resource-manager/templates/deploy-portal.md).

  > [!NOTE]
  > 
  > Notice that the highest-level activity log alerts can be defined is subscription.
  > Meaning there is no option to define alert on couple of subscriptions, therefore the definition should be alert  per subscription.

The following fields are the options that you can use in the Azure Resource Manager template for the conditions fields:
Notice that “Resource Health”, “Advisor” and “Service Health” have extra properties fields for their special fields. 
1. resourceId:	The resource ID of the impacted resource in the activity log event that the alert should be generated on.
2. category: The category of in the activity log event. For example: Administrative, ServiceHealth, ResourceHealth, Autoscale, Security, Recommendation, Policy.
3. caller: The email address or Azure Active Directory identifier of the user who performed the operation of the activity log event.
4. level: Level of the activity in the activity log event that the alert should be generated on. For example: Critical, Error, Warning, Informational, Verbose.
5. operationName: The name of the operation in the activity log event. For example: Microsoft.Resources/deployments/write
6. resourceGroup: Name of the resource group for the impacted resource in the activity log event.
7. resourceProvider: [Azure resource providers and types explanation](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fazure-resource-manager%2Fmanagement%2Fresource-providers-and-types&data=02%7C01%7CNoga.Lavi%40microsoft.com%7C90b7c2308c0647c0347908d7c9a2918d%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637199572373543634&sdata=4RjpTkO5jsdOgPdt%2F%2FDOlYjIFE2%2B%2BuoHq5%2F7lHpCwQw%3D&reserved=0). For a list that maps resource providers to Azure services, see [Resource providers for Azure services](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fazure-resource-manager%2Fmanagement%2Fazure-services-resource-providers&data=02%7C01%7CNoga.Lavi%40microsoft.com%7C90b7c2308c0647c0347908d7c9a2918d%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637199572373553639&sdata=0ZgJPK7BYuJsRifBKFytqphMOxMrkfkEwDqgVH1g8lw%3D&reserved=0).
8. status: String describing the status of the operation in the activity event. For example: Started, In Progress, Succeeded, Failed, Active, Resolved
9. subStatus: Usually the HTTP status code of the corresponding REST call, but can also include other strings describing a substatus.	For example: OK (HTTP Status Code: 200), Created (HTTP Status Code: 201), Accepted (HTTP Status Code: 202), No Content (HTTP Status Code: 204), Bad Request (HTTP Status Code: 400), Not Found (HTTP Status Code: 404), Conflict (HTTP Status Code: 409), Internal Server Error (HTTP Status Code: 500), Service Unavailable (HTTP Status Code: 503), Gateway Timeout (HTTP Status Code: 504).
10. resourceType: The type of the resource that was affected by the event. For example: Microsoft.Resources/deployments

For example:

```json
"condition": {
          "allOf": [
            {
              "field": "category",
              "equals": "Administrative"
            },
            {
              "field": "resourceType",
              "equals": "Microsoft.Resources/deployments"
            }
          ]
        }

```
More details on the activity log fields you can find [here](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fazure-monitor%2Fplatform%2Factivity-log-schema&data=02%7C01%7CNoga.Lavi%40microsoft.com%7C90b7c2308c0647c0347908d7c9a2918d%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637199572373563632&sdata=6QXLswwZgUHFXCuF%2FgOSowLzA8iOALVgvL3GMVhkYJY%3D&reserved=0).



> [!NOTE]
> It might take up to 5 minutes for the new activity log alert rule to become active.

## REST API 
The [Azure Monitor Activity Log Alerts API](/rest/api/monitor/activitylogalerts) is a REST API. It's fully compatible with the Azure Resource Manager REST API. It can be used via PowerShell by using the Resource Manager cmdlet or the Azure CLI.

## PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

### Deploy the Resource Manager template with PowerShell
To use PowerShell to deploy the sample Resource Manager template shown in the previous [Azure Resource Manager template](#azure-resource-manager-template) section, use the following command:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "myRG" -TemplateFile sampleActivityLogAlert.json -TemplateParameterFile sampleActivityLogAlert.parameters.json
```

where the sampleActivityLogAlert.parameters.json contains the values provided for the parameters needed for alert rule creation.

### Use activity log PowerShell cmdlets

Activity log alerts have dedicated PowerShell cmdlets available:

- [Set-AzActivityLogAlert](/powershell/module/az.monitor/set-azactivitylogalert): Creates a new activity log alert or updates an existing activity log alert.
- [Get-AzActivityLogAlert](/powershell/module/az.monitor/get-azactivitylogalert): Gets one or more activity log alert resources.
- [Enable-AzActivityLogAlert](/powershell/module/az.monitor/enable-azactivitylogalert): Enables an existing activity log alert and sets its tags.
- [Disable-AzActivityLogAlert](/powershell/module/az.monitor/disable-azactivitylogalert): Disables an existing activity log alert and sets its tags.
- [Remove-AzActivityLogAlert](/powershell/module/az.monitor/remove-azactivitylogalert): Removes an activity log alert.

## Azure CLI

Dedicated Azure CLI commands under the set [az monitor activity-log alert](/cli/azure/monitor/activity-log/alert) are available for managing activity log alert rules.

To create a new activity log alert rule, use the following commands in this order:

1. [az monitor activity-log alert create](/cli/azure/monitor/activity-log/alert#az_monitor_activity_log_alert_create): Create a new activity log alert rule resource.
1. [az monitor activity-log alert scope](/cli/azure/monitor/activity-log/alert/scope): Add scope for the created activity log alert rule.
1. [az monitor activity-log alert action-group](/cli/azure/monitor/activity-log/alert/action-group): Add an action group to the activity log alert rule.

To retrieve one activity log alert rule resource, use the Azure CLI command [az monitor activity-log alert show](/cli/azure/monitor/activity-log/alert#az_monitor_activity_log_alert_show
). To view all activity log alert rule resources in a resource group, use [az monitor activity-log alert list](/cli/azure/monitor/activity-log/alert#az_monitor_activity_log_alert_list).
Activity log alert rule resources can be removed by using the Azure CLI command [az monitor activity-log alert delete](/cli/azure/monitor/activity-log/alert#az_monitor_activity_log_alert_delete).

## Next steps

- Learn about [webhook schema for activity logs](./activity-log-alerts-webhook.md).
- Read an [overview of activity logs](./activity-log-alerts.md).
- Learn more about [action groups](./action-groups.md).  
- Learn about [service health notifications](../../service-health/service-notifications.md).

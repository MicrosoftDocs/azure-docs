---
title: Create, view, and manage activity log alerts in Azure Monitor
description: Create activity log alerts by using the Azure portal, an Azure Resource Manager template, and Azure PowerShell.
ms.topic: conceptual
ms.subservice: alerts
ms.date: 2/23/2022

---

# Create, view, and manage activity log alerts by using Azure Monitor  

*Activity log alerts* are the alerts that get activated when a new activity log event occurs that matches the conditions specified in the alert. You create these alerts for Azure resources by using an Azure Resource Manager template. You can also create, update, or delete these alerts in the Azure portal.

Typically, you create activity log alerts to receive notifications when specific changes occur to resources in your Azure subscription. Alerts are often scoped to particular resource groups or resources. For example, you might want to be notified when any virtual machine in the sample resource group `myProductionResourceGroup` is deleted. Or, you might want to get notified if any new roles are assigned to a user in your subscription.

> [!IMPORTANT]
> You can't create alerts on service health notifications by using the interface for creating activity log alerts. To learn more about how to create and use service health notifications, see [Receive activity log alerts on service health notifications](../../service-health/alerts-activity-log-service-notifications-portal.md).

When you create alert rules, make sure that:

- The subscription in the scope isn't different from the subscription where the alert is created.
- The criteria must be the level, status, caller, resource group, resource ID, or resource type event category on which the alert is configured.
- There's no `anyOf` condition or nested conditions in the alert configuration JSON. Only one `allOf` condition is allowed, with no further `allOf` or `anyOf` conditions.
- When the category is `administrative`, you must specify at least one of the preceding criteria in your alert. You can't create an alert that activates every time an event is created in the activity logs.
- Alerts can't be created for events in the `alert` category of the activity log.

## Azure portal

You can use the Azure portal to create and modify activity log alert rules. The experience is integrated with an Azure activity log to ensure seamless alert creation for specific events of interest. On the Azure portal, you can create a new activity log alert rule, either from the Azure Monitor alerts pane, or from the Azure Monitor activity log pane. 

### Create an alert rule from the Azure Monitor alerts pane

Here's how to create an activity log alert rule in the Azure portal:

1. In the [Azure portal](https://portal.azure.com), select **Monitor**. The Monitor pane consolidates all your monitoring settings and data in one view.

2. Select **Alerts** > **+ Create** > **Alert rule**.

    > [!TIP]
    > Most resource panes also have **Alerts** in their resource menu, under **Monitoring**. You can also create alert rules from there.

3. In the **Scope** tab, click **Select scope**. Then, in the context pane that loads, select the target resource(s) that you want to alert on. Use **Filter by subscription**, **Filter by resource type**, and **Filter by location** drop-downs to find the resource you want to monitor. You can also use the search bar to find your resource.
    
    > [!NOTE]
    > As a target, you can select an entire subscription, a resource group, or one or more a specific resources from the same subscription. If you choose a subscription or a resource group as a target, and you also select a resource type, the rule will apply to all resources of that type within the selected subscription or a resource group. If you choose a specific target resource, the rule will apply only to that resource. You can't select multiple subscriptions, or multiple resources from different subscriptions. 

4. If the selected resource has activity log operations that you can create alert rules on, you'll see that **Available signal types** lists **Activity Log**. You can view the full list of resource types supported for activity log alerts in [Azure resource provider operations](../../role-based-access-control/resource-provider-operations.md).

    :::image type="content" source="media/alerts-activity-log/select-target-new.png" alt-text="Screenshot of the target selection pane." lightbox="media/alerts-activity-log/select-target-new.png":::

5. Once you have selected a target resource, click **Done**.

6. Proceed to the **Condition** tab. Then, in the context pane that loads, you will see a list of signals supported for the resource, which includes those from various categories of **Activity Log**. Select the activity log signal or operation you want to create an alert rule on.

7. You will see a chart for the activity log operation for the last six hours. Use the **Chart period** dropdown list to see a longer history for the operation.

8. Under **Alert logic**, you can optionally define more filtering criteria:

    - **Event level**: The severity level of the event: _Verbose_, _Informational_, _Warning_, _Error_, or _Critical_.
    - **Status**: The status of the event: _Started_, _Failed_, or _Succeeded_.
    - **Event initiated by**: Also known as the caller. The email address or Azure Active Directory identifier of the user who performed the operation.

    > [!NOTE]
    > Defining at least one of these criteria helps you achieve more effective rules. For example, if the alert scope is an entire subscription, and the selected signal is `All Administrative Operations`, your rule will be more specific if you provide the event level, status, or initiation information.

    :::image type="content" source="media/alerts-activity-log/condition-selected-new.png" alt-text="Screenshot of the condition selection pane." lightbox="media/alerts-activity-log/condition-selected-new.png":::

9. Proceed to the **Actions** tab, where you can define what actions and notifications are triggered when the alert rule generates an alert. You can add an action group to the alert rule either by selecting an existing action group or by creating a new action group.

10. Proceed to the **Details** tab. Under **Project details**, select the resource group in which the alert rule resource will be saved. Under **Alert rule details**, specify the **Alert rule name**. You can also provide an **Alert rule description**.

    > [!NOTE]
    > The alert severity for activity log alerts can't currently be configured by the user. The severity level always defaults to **Sev4**.


11. Proceed to the **Tags**, where you can set tags on the alert rule you're creating.
12. Proceed to the **Review + create** tab, where you can review your selections before creating the alert rule. A quick automatic validation will also be performed, notifying you in case any information or missing or needs to be correct. Once you're ready to create the alert rule, Click **Create**.
     
     
### Create an alert rule from the Azure Monitor activity log pane

An alternative way to create an activity log alert is to start with an activity log event that already occurred, via the [activity log in the Azure portal](../essentials/activity-log.md#view-the-activity-log). 

1. On the **Azure Monitor - Activity log** pane, you can filter or find the desired event, and then create an alert on future similar events by selecting **Add activity log alert**. 

    :::image type="content" source="media/alerts-activity-log/create-alert-rule-from-activity-log-event-new.png" alt-text="Screenshot of alert rule creation from an activity log event." lightbox="media/alerts-activity-log/create-alert-rule-from-activity-log-event-new.png":::

2. The **Create alert rule** wizard opens, with the scope and condition already provided according to the previously selected activity log event. If necessary, you can edit and modify the scope and condition at this stage. Note that by default, the exact scope and condition for the new rule are copied from the original event attributes. For example, the exact resource on which the event occurred, and the specific user or service name who initiated the event, are both included by default in the new alert rule. If you want to make the alert rule more general, modify the scope and condition accordingly (see steps 3-9 in the section "Create an alert rule from the Azure Monitor alerts pane"). 

3. Then follow steps 9-12 from the section, "Create an alert rule from the Azure Monitor alerts pane."
    
### View and manage in the Azure portal

1. In the Azure portal, select **Monitor** > **Alerts**. Then select **Alert rules**.
    
    The list of available alert rules appears.

2. Filter or search for the activity log rule to modify.

    :::image type="content" source="media/alerts-activity-log/manage-alert-rules-new.png" alt-text="Screenshot of the alert rules management pane." lightbox="media/alerts-activity-log/manage-alert-rules-new.png":::

    You can use the available filters, _Subscription_, _Resource group_,  _Resource_, _Signal type_, or _Status_, to find the activity rule that you want to edit.
 
3. Select the alert rule to open it for editing. Make the required changes, and then select **Save**. 

## Azure Resource Manager template
To create an activity log alert rule by using an Azure Resource Manager template, you create a resource of the type `microsoft.insights/activityLogAlerts`. Then you fill in all related properties. Here's a template that creates an activity log alert rule:

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
The previous sample JSON can be saved as, for example, *sampleActivityLogAlert.json*. You can deploy the sample by using [Azure Resource Manager in the Azure portal](../../azure-resource-manager/templates/deploy-portal.md).

> [!NOTE]
> Notice that the highest level that activity log alerts can be defined is the subscription level. There is no option to define an alert on two subscriptions. The definition should be to alert per subscription.

The following fields are the options that you can use in the Azure Resource Manager template for the conditions fields. (Notice that **Resource Health**, **Advisor** and **Service Health** have extra properties fields for their special fields.) 

1. `resourceId`: The resource ID of the impacted resource in the activity log event that the alert should be generated on.
1. `category`: The category of the activity log event. For example: `Administrative`, `ServiceHealth`, `ResourceHealth`, `Autoscale`, `Security`, `Recommendation`, or `Policy`.
1. `caller`: The email address or Azure Active Directory identifier of the user who performed the operation of the activity log event.
1. `level`: Level of the activity in the activity log event that the alert should be generated on. For example: `Critical`, `Error`, `Warning`, `Informational`, or `Verbose`.
1. `operationName`: The name of the operation in the activity log event. For example: `Microsoft.Resources/deployments/write`.
1. `resourceGroup`: Name of the resource group for the impacted resource in the activity log event.
1. `resourceProvider`: For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md). For a list that maps resource providers to Azure services, see [Resource providers for Azure services](../../azure-resource-manager/management/resource-providers-and-types.md).
1. `status`: String describing the status of the operation in the activity event. For example: `Started`, `In Progress`, `Succeeded`, `Failed`, `Active`, or `Resolved`.
1. `subStatus`: Usually, this field is the HTTP status code of the corresponding REST call. But it can also include other strings describing a substatus. Examples of HTTP status codes include `OK` (HTTP Status Code: 200), `No Content` (HTTP Status Code: 204), and `Service Unavailable` (HTTP Status Code: 503), among many others.
1. `resourceType`: The type of the resource that was affected by the event. For example: `Microsoft.Resources/deployments`.

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

For more information about the activity log fields, see [Azure activity log event schema](../essentials/activity-log-schema.md).

> [!NOTE]
> It might take up to 5 minutes for the new activity log alert rule to become active.

## REST API 
The Azure Monitor Activity Log Alerts API is a REST API. It's fully compatible with the Azure Resource Manager REST API. You can use it with PowerShell, by using the Resource Manager cmdlet or the Azure CLI.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

### Deploy the Resource Manager template with PowerShell
To use PowerShell to deploy the sample Resource Manager template shown in the previous [Azure Resource Manager template](#azure-resource-manager-template) section, use the following command:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "myRG" -TemplateFile sampleActivityLogAlert.json -TemplateParameterFile sampleActivityLogAlert.parameters.json
```

The *sampleActivityLogAlert.parameters.json* file contains the values provided for the parameters needed for alert rule creation.

### Use activity log PowerShell cmdlets

Activity log alerts have dedicated PowerShell cmdlets available:

- [Set-AzActivityLogAlert](/powershell/module/az.monitor/set-azactivitylogalert): Creates a new activity log alert or updates an existing activity log alert.
- [Get-AzActivityLogAlert](/powershell/module/az.monitor/get-azactivitylogalert): Gets one or more activity log alert resources.
- [Enable-AzActivityLogAlert](/powershell/module/az.monitor/enable-azactivitylogalert): Enables an existing activity log alert and sets its tags.
- [Disable-AzActivityLogAlert](/powershell/module/az.monitor/disable-azactivitylogalert): Disables an existing activity log alert and sets its tags.
- [Remove-AzActivityLogAlert](/powershell/module/az.monitor/remove-azactivitylogalert): Removes an activity log alert.

### Azure CLI

You can manage activity log alert rules by using dedicated Azure CLI commands under the set [az monitor activity-log alert](/cli/azure/monitor/activity-log/alert).

To create a new activity log alert rule, use the following commands:

1. [az monitor activity-log alert create](/cli/azure/monitor/activity-log/alert#az-monitor-activity-log-alert-create): Create a new activity log alert rule resource.
2. [az monitor activity-log alert scope](/cli/azure/monitor/activity-log/alert/scope): Add scope for the created activity log alert rule.
3. [az monitor activity-log alert action-group](/cli/azure/monitor/activity-log/alert/action-group): Add an action group to the activity log alert rule.

To retrieve one activity log alert rule resource, use the Azure CLI command [az monitor activity-log alert show](/cli/azure/monitor/activity-log/alert#az-monitor-activity-log-alert-show
). To view all activity log alert rule resources in a resource group, use [az monitor activity-log alert list](/cli/azure/monitor/activity-log/alert#az-monitor-activity-log-alert-list).
You can remove activity log alert rule resources by using the Azure CLI command [az monitor activity-log alert delete](/cli/azure/monitor/activity-log/alert#az-monitor-activity-log-alert-delete).

## Next steps

- Learn about [webhook schema for activity logs](./activity-log-alerts-webhook.md).
- Read an [overview of activity logs](./activity-log-alerts.md).
- Learn more about [action groups](./action-groups.md).  
- Learn about [service health notifications](../../service-health/service-notifications.md).
---
title: View Azure Activity log events in Azure Monitor
description: View the Azure Activity log in Azure Monitor and retrieve with PowerShell, CLI, and REST API.
author: bwren
services: azure-monitor

ms.topic: conceptual
ms.date: 12/07/2019
ms.author: johnkem
ms.subservice: logs
---
# Azure Activity log

The Activity log is a [platform log](platform-logs-overview.md) in Azure that provides insight into subscription-level events that have occurred in Azure. You can view the Activity log in the Azure portal or retrieve entries with PowerShell and CLI. For additional functionality, you should create a diagnostic setting to collect the Activity log in [Azure Monitor Logs](data-platform-logs.md). You can also use a diagnostic setting to send the Activity log to Azure Event Hubs to send it outside of Azure or to Azure Storage for archiving.

## View the Activity log
You can access the Activity log from most menus in the Azure portal. The menu that you open it from determines its initial filter. If you open it from the **Monitor** menu, then the only filter will be on the subscription. If you open it from a resource's menu, then the filter will be set to that resource. You always change the filter though to view any other entries. Click **Add Filter** to add additional properties to the filter.

![View Activity Log](./media/activity-logs-overview/view-activity-log.png)

For a description of Activity log categories see []().

### View change history

For some events, you can view the Change history, which shows what changes happened during that event time. Select an event from the Activity Log you want to look deeper into. Select the **Change history (Preview)** tab to view any associated changes with that event.

![Change history list for an event](media/activity-logs-overview/change-history-event.png)

If there are any associated changes with the event, you'll see a list of changes that you can select. This opens up the **Change history (Preview)** page. On this page you see the changes to the resource. In the following example, you can see not only that the VM changed sizes, but what the previous VM size was before the change and what it was changed to. To learn more about change history, see [Get resource changes](../../governance/resource-graph/how-to/get-resource-changes.md).

![Change history page showing differences](media/activity-logs-overview/change-history-event-details.png)


### Other methods to retrieve Activity log events
You can also access Activity log events using PowerShell, CLI, and REST API.

- Use the [Get-AzLog](https://docs.microsoft.com/powershell/module/az.monitor/get-azlog) cmdlet to retrieve the Activity Log from PowerShell. See []() for examples.
- Use [az monitor activity-log](../samples/cli-samples.md#view-activity-log-for-a-subscription) to retrieve the Activity Log from CLI.  See []() for examples.
- Use the [Azure Monitor REST API](https://docs.microsoft.com/rest/api/monitor/) to retrieve the Activity Log from a REST client. See []() for examples.


## Collect to Log Analytics workspace
[Create a diagnostic setting]() to collect the Activity log to a Log Analytics workspace to enable additional functionality. You can send the Activity log from any single subscription to up to five Log Analytics workspaces. Collecting logs across tenants requires [Azure Lighthouse](/azure/lighthouse).

 Collecting the Activity log to a Log Analytics workspace provides the following advantages:

- Correlate Activity log data with other monitoring data collected by Azure Monitor.
- Consolidate log entries from multiple Azure subscriptions and tenants into one location for analysis together.
- Use log queries to perform complex analysis and gain deep insights on Activity Log entries.
- Use log alerts with Activity entries allowing for more complex alerting logic.
- Store Activity log entries for longer than 90 days.
- No data ingestion or data retention charge for Activity log data stored in a Log Analytics workspace.

When you connect an Activity Log to a Log Analytics workspace, entries will be written to the workspace into a table called *AzureActivity* that you can retrieve with a [log query](../log-query/log-query-overview.md). The structure of this table varies depending on the [category of the log entry](activity-log-view.md#categories-in-the-activity-log). See [Azure Activity Log event schema](activity-log-schema.md) for a description of each category.



## Event hubs

## Azure storage

## Legacy

### Log profiles
Log profiles are the legacy method for sending the Activity log to Azure storage or event hubs. Use the following procedure to continue working with a log profile or to disable it in preparation for migrating to a diagnostic setting.

1. From the **Azure Monitor** menu in the Azure portal, select **Activity log**.
3. Click **Diagnostic settings**.

   ![Diagnostic settings](media/diagnostic-settings-subscription/diagnostic-settings.png)

4. Click the purple banner for the legacy experience.

    ![Legacy experience](media/diagnostic-settings-subscription/legacy-experience.png)

### Data structure changes
Diagnostic settings collect the same data as the legacy method used to collect the Activity log with some changes to the structure of the *AzureActivity* table.

The columns in the following table have been deprecated in the updated schema. They still exist in *AzureActivity* but they will have no data. The replacement for these columns are not new, but they contain the same data as the deprecated column. They are in a different format, so you may need to modify log queries that use them. 

| Deprecated column | Replacement column |
|:---|:---|
| ActivityStatus    | ActivityStatusValue    |
| ActivitySubstatus | ActivitySubstatusValue |
| OperationName     | OperationNameValue     |
| ResourceProvider  | ResourceProviderValue  |

> [!IMPORTANT]
> In some cases, the values in these columns may be in all uppercase. If you have a query that includes these columns, you should use the [=~ operator](https://docs.microsoft.com/azure/kusto/query/datatypes-string-operators) to do a case insensitive comparison.

The following column have been added to *AzureActivity* in the updated schema:

- Authorization_d
- Claims_d
- Properties_d

### Log Analytics workspace
The legacy method for collecting the Activity log into a Log Analytics workspace is connecting the log in the workspace configuration. 

1. From the **Log Analytics workspaces** menu in the Azure portal, select the workspace to collect the Activity Log.
1. In the **Workspace Data Sources** section of the workspace's menu, select **Azure Activity log**.
1. Click the subscription you want to connect.

    ![Workspaces](media/activity-log-collect/workspaces.png)

1. Click **Connect** to connect the Activity log in the subscription to the selected workspace. If the subscription is already connected to another workspace, click **Disconnect** first to disconnect it.

    ![Connect Workspaces](media/activity-log-collect/connect-workspace.png)


To disable the setting, perform the same procedure and click **Disconnect** to remove the subscription from the workspace.

### Configure log profile using PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

If a log profile already exists, you first need to remove the existing log profile and then create a new one.

1. Use `Get-AzLogProfile` to identify if a log profile exists.  If a log profile does exist, note the *name* property.

1. Use `Remove-AzLogProfile` to remove the log profile using the value from the *name* property.

    ```powershell
    # For example, if the log profile name is 'default'
    Remove-AzLogProfile -Name "default"
    ```

3. Use `Add-AzLogProfile` to create a new log profile:

    ```powershell
    Add-AzLogProfile -Name my_log_profile -StorageAccountId /subscriptions/s1/resourceGroups/myrg1/providers/Microsoft.Storage/storageAccounts/my_storage -serviceBusRuleId /subscriptions/s1/resourceGroups/Default-ServiceBus-EastUS/providers/Microsoft.ServiceBus/namespaces/mytestSB/authorizationrules/RootManageSharedAccessKey -Location global,westus,eastus -RetentionInDays 90 -Category Write,Delete,Action
    ```

    | Property | Required | Description |
    | --- | --- | --- |
    | Name |Yes |Name of your log profile. |
    | StorageAccountId |No |Resource ID of the Storage Account where the Activity Log should be saved. |
    | serviceBusRuleId |No |Service Bus Rule ID for the Service Bus namespace you would like to have event hubs created in. This is a string with the format: `{service bus resource ID}/authorizationrules/{key name}`. |
    | Location |Yes |Comma-separated list of regions for which you would like to collect Activity Log events. |
    | RetentionInDays |Yes |Number of days for which events should be retained in the storage account, between 1 and 365. A value of zero stores the logs indefinitely. |
    | Category |No |Comma-separated list of event categories that should be collected. Possible values are _Write_, _Delete_, and _Action_. |

### Example script
Following is a sample PowerShell script to create a log profile that writes the Activity Log to both a storage account and event hub.

   ```powershell
   # Settings needed for the new log profile
   $logProfileName = "default"
   $locations = (Get-AzLocation).Location
   $locations += "global"
   $subscriptionId = "<your Azure subscription Id>"
   $resourceGroupName = "<resource group name your event hub belongs to>"
   $eventHubNamespace = "<event hub namespace>"

   # Build the service bus rule Id from the settings above
   $serviceBusRuleId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.EventHub/namespaces/$eventHubNamespace/authorizationrules/RootManageSharedAccessKey"

   # Build the storage account Id from the settings above
   $storageAccountId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Storage/storageAccounts/$storageAccountName"

   Add-AzLogProfile -Name $logProfileName -Location $locations -ServiceBusRuleId $serviceBusRuleId
   ```


### Configure log profile using Azure CLI

If a log profile already exists, you first need to remove the existing log profile and then create a new log profile.

1. Use `az monitor log-profiles list` to identify if a log profile exists.
2. Use `az monitor log-profiles delete --name "<log profile name>` to remove the log profile using the value from the *name* property.
3. Use `az monitor log-profiles create` to create a new log profile:

   ```azurecli-interactive
   az monitor log-profiles create --name "default" --location null --locations "global" "eastus" "westus" --categories "Delete" "Write" "Action"  --enabled false --days 0 --service-bus-rule-id "/subscriptions/<YOUR SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.EventHub/namespaces/<EVENT HUB NAME SPACE>/authorizationrules/RootManageSharedAccessKey"
   ```

    | Property | Required | Description |
    | --- | --- | --- |
    | name |Yes |Name of your log profile. |
    | storage-account-id |Yes |Resource ID of the Storage Account to which Activity Logs should be saved. |
    | locations |Yes |Space-separated list of regions for which you would like to collect Activity Log events. You can view a list of all regions for your subscription using `az account list-locations --query [].name`. |
    | days |Yes |Number of days for which events should be retained, between 1 and 365. A value of zero will store the logs indefinitely (forever).  If zero, then the enabled parameter should be set to false. |
    |enabled | Yes |True or False.  Used to enable or disable the retention policy.  If True, then the days parameter must be a value greater than 0.
    | categories |Yes |Space-separated list of event categories that should be collected. Possible values are Write, Delete, and Action. |



## Activity Logs Analytics monitoring solution
The Azure Log Analytics monitoring solution will be deprecated soon and replaced by a workbook using the updated schema in the Log Analytics workspace. You can still use the solution if you already have it enabled, but it can only be used if you're collecting the Activity log using legacy settings. 



### Use the solution
Monitoring solutions are accessed from the **Monitor** menu in the Azure portal. Select **More** in the **Insights** section to open the **Overview** page with the solution tiles. The **Azure Activity Logs** tile displays a count of the number of **AzureActivity** records in your workspace.

![Azure Activity Logs tile](media/collect-activity-logs/azure-activity-logs-tile.png)


Click the **Azure Activity Logs** tile to open the **Azure Activity Logs** view. The view includes the visualization parts in the following table. Each part lists up to 10 items matching that parts's criteria for the specified time range. You can run a log query that returns all  matching records by clicking **See all** at the bottom of the part.

![Azure Activity Logs dashboard](media/collect-activity-logs/activity-log-dash.png)


### Enable the solution for new subscriptions
You will soon no longer be able to add the Activity Logs Analytics solution to your subscription using the Azure portal. You can add it using the following procedure with a resource manager template. 

1. Copy the following json into a file called *ActivityLogTemplate*.json.

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "workspaceName": {
            "type": "String",
            "defaultValue": "my-workspace",
            "metadata": {
              "description": "Specifies the name of the workspace."
            }
        },
        "location": {
            "type": "String",
            "allowedValues": [
              "east us",
              "west us",
              "australia central",
              "west europe"
            ],
            "defaultValue": "australia central",
            "metadata": {
              "description": "Specifies the location in which to create the workspace."
            }
        }
      },
        "resources": [
        {
            "type": "Microsoft.OperationalInsights/workspaces",
            "name": "[parameters('workspaceName')]",
            "apiVersion": "2015-11-01-preview",
            "location": "[parameters('location')]",
            "properties": {
                "features": {
                    "searchVersion": 2
                }
            }
        },
        {
            "type": "Microsoft.OperationsManagement/solutions",
            "apiVersion": "2015-11-01-preview",
            "name": "[concat('AzureActivity(', parameters('workspaceName'),')')]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[resourceId('microsoft.operationalinsights/workspaces', parameters('workspaceName'))]"
            ],
            "plan": {
                "name": "[concat('AzureActivity(', parameters('workspaceName'),')')]",
                "promotionCode": "",
                "product": "OMSGallery/AzureActivity",
                "publisher": "Microsoft"
            },
            "properties": {
                "workspaceResourceId": "[resourceId('microsoft.operationalinsights/workspaces', parameters('workspaceName'))]",
                "containedResources": [
                    "[concat(resourceId('microsoft.operationalinsights/workspaces', parameters('workspaceName')), '/views/AzureActivity(',parameters('workspaceName'))]"
                ]
            }
        },
        {
          "type": "Microsoft.OperationalInsights/workspaces/datasources",
          "kind": "AzureActivityLog",
          "name": "[concat(parameters('workspaceName'), '/', subscription().subscriptionId)]",
          "apiVersion": "2015-11-01-preview",
          "location": "[parameters('location')]",
          "dependsOn": [
              "[parameters('WorkspaceName')]"
          ],
          "properties": {
              "linkedResourceId": "[concat(subscription().Id, '/providers/microsoft.insights/eventTypes/management')]"
          }
        }
      ]
    }    
    ```

2. Deploy the template using the following PowerShell commands:

    ```PowerShell
    Connect-AzAccount
    Select-AzSubscription <SubscriptionName>
    New-AzResourceGroupDeployment -Name activitysolution -ResourceGroupName <ResourceGroup> -TemplateFile <Path to template file>
    ```



## Next steps

* [Read an overview of platform logs](platform-logs-overview.md)
* [Create diagnostic setting to send Activity logs to other destinations](diagnostic-settings.md)

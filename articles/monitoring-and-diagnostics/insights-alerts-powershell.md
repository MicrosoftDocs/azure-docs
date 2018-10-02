---
title: Use PowerShell to create classic alerts for Azure services | Microsoft Docs
description: Trigger emails or notifications, or call website URLs (webhooks) or automation when the conditions that you specify are met.
author: rboucher
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 03/28/2018
ms.author: robb
ms.component: alerts
---
# Use PowerShell to create alerts for Azure services
> [!div class="op_single_selector"]
> * [Portal](insights-alerts-portal.md)
> * [PowerShell](insights-alerts-powershell.md)
> * [CLI](insights-alerts-command-line-interface.md)
>
>

> [!NOTE]
> This article describes how to create older classic metric alerts. Azure Monitor now supports [newer, better metric alerts](monitoring-near-real-time-metric-alerts.md). These alerts can monitor multiple metrics and allow for alerting on dimensional metrics. PowerShell support for newer metric alerts is coming soon.
>
>

This article shows you how to set up Azure classic metric alerts by using PowerShell.  

You can receive alerts based on metrics for your Azure services, or you can receive alerts for events that occur in Azure.

* **Metric values**: The alert triggers when the value of a specified metric crosses a threshold you assign in either direction. That is, it triggers both when the condition is first met and then when that condition is no longer being met.    
* **Activity log events**: An alert can trigger on *every* event or when certain events occurs. To learn more about activity log alerts, see [Create activity log alerts (classic)](monitoring-activity-log-alerts.md).

You can configure a classic metric alert to do the following tasks when it triggers:

* Send email notifications to the service administrator and co-administrators.
* Send email to additional email addresses that you specify.
* Call a webhook.
* Start execution of an Azure runbook (only from the Azure portal).

You can configure and get information about alert rules from the following locations: 

* [Azure portal](insights-alerts-portal.md)
* [PowerShell](insights-alerts-powershell.md)
* [Azure command-line interface (CLI)](insights-alerts-command-line-interface.md)
* [Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931945.aspx)

For additional information, you can always type ```Get-Help``` followed by the PowerShell command that you need help with.

## Create alert rules in PowerShell
1. Sign in to Azure.   

    ```PowerShell
    Connect-AzureRmAccount

    ```
2. Get a list of the subscriptions that are available to you. Verify that you're working with the right subscription. If not, get to the right subscription by using the output from `Get-AzureRmSubscription`.

    ```PowerShell
    Get-AzureRmSubscription
    Get-AzureRmContext
    Set-AzureRmContext -SubscriptionId <subscriptionid>
    ```
3. List existing rules on a resource group by using the following command:

   ```PowerShell
   Get-AzureRmAlertRule -ResourceGroup <myresourcegroup> -DetailedOutput
   ```
4. To create a rule, you need to have several important pieces of information first.

    - The **resource ID** for the resource you want to set an alert for.
    - The **metric definitions** that are available for that resource.

     One way to get the resource ID is to use the Azure portal. Assuming that the resource has already been created, select it in the portal. Then in the next blade, in the **Settings** section, select **Properties**. **RESOURCE ID** is a field in the next blade. 
     
     You can also get the resource ID by using [Azure Resource Explorer](https://resources.azure.com/).

     Following is an example resource ID for a web app:

     ```
     /subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroupname/providers/Microsoft.Web/sites/mywebsitename
     ```

     You can use `Get-AzureRmMetricDefinition` to view the list of all metric definitions for a specific resource:

     ```PowerShell
     Get-AzureRmMetricDefinition -ResourceId <resource_id>
     ```

     The following example generates a table with the metric name and unit for that metric:

     ```PowerShell
     Get-AzureRmMetricDefinition -ResourceId <resource_id> | Format-Table -Property Name,Unit

     ```
     To get a full list of available options for Get-AzureRmMetricDefinition, run `Get-Help Get-AzureRmMetricDefinition -Detailed`.
5. The following example sets up an alert on a website resource. The alert triggers whenever it consistently receives any traffic for 5 minutes and again when it receives no traffic for 5 minutes.

    ```PowerShell
    Add-AzureRmMetricAlertRule -Name myMetricRuleWithWebhookAndEmail -Location "East US" -ResourceGroup myresourcegroup -TargetResourceId /subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroupname/providers/Microsoft.Web/sites/mywebsitename -MetricName "BytesReceived" -Operator GreaterThan -Threshold 2 -WindowSize 00:05:00 -TimeAggregationOperator Total -Description "alert on any website activity"

    ```
6. To create a webhook or send email when an alert triggers, first create the email or webhook. Then immediately create the rule afterwards with the -Actions tag as shown in the following example. You can't associate webhooks or emails with rules that have already been created.

    ```PowerShell
    $actionEmail = New-AzureRmAlertRuleEmail -CustomEmail myname@company.com
    $actionWebhook = New-AzureRmAlertRuleWebhook -ServiceUri https://www.contoso.com?token=mytoken

    Add-AzureRmMetricAlertRule -Name myMetricRuleWithWebhookAndEmail -Location "East US" -ResourceGroup myresourcegroup -TargetResourceId /subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroupname/providers/Microsoft.Web/sites/mywebsitename -MetricName "BytesReceived" -Operator GreaterThan -Threshold 2 -WindowSize 00:05:00 -TimeAggregationOperator Total -Actions $actionEmail, $actionWebhook -Description "alert on any website activity"
    ```

7. Look at the individual rules to verify that your alerts have been created properly.

    ```PowerShell
    Get-AzureRmAlertRule -Name myMetricRuleWithWebhookAndEmail -ResourceGroup myresourcegroup -DetailedOutput

    Get-AzureRmAlertRule -Name myLogAlertRule -ResourceGroup myresourcegroup -DetailedOutput
    ```
8. Delete your alerts. These commands delete the rules that were created previously in this article.

    ```PowerShell
    Remove-AzureRmAlertRule -ResourceGroup myresourcegroup -Name myrule
    Remove-AzureRmAlertRule -ResourceGroup myresourcegroup -Name myMetricRuleWithWebhookAndEmail
    Remove-AzureRmAlertRule -ResourceGroup myresourcegroup -Name myLogAlertRule
    ```

## Next steps
* [Get an overview of Azure monitoring](monitoring-overview.md), including the types of information you can collect and monitor.
* Learn to [configure webhooks in alerts](insights-webhooks-alerts.md).
* Learn to [configure alerts on activity log events](monitoring-activity-log-alerts.md).
* Learn more about [Azure Automation runbooks](../automation/automation-starting-a-runbook.md).
* Get an [overview of collecting diagnostic logs](monitoring-overview-of-diagnostic-logs.md) to collect detailed high-frequency metrics on your service.
* Get an [overview of metrics collection](insights-how-to-customize-monitoring.md) to make sure your service is available and responsive.

---
title: Use the cross-platform Azure CLI to create classic alerts for Azure services | Microsoft Docs
description: Trigger emails or notifications, or call websites URLs (webhooks) or automation when the conditions that you specify are met.
author: rboucher
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 10/24/2016
ms.author: robb
ms.component: alerts
---
# Use the cross-platform Azure CLI to create classic metric alerts in Azure Monitor for Azure services 

> [!div class="op_single_selector"]
> * [Portal](insights-alerts-portal.md)
> * [PowerShell](insights-alerts-powershell.md)
> * [CLI](insights-alerts-command-line-interface.md)
>
>
> [!NOTE]
> This article describes how to create older classic metric alerts. Azure Monitor now supports [newer, better metric alerts](monitoring-near-real-time-metric-alerts.md). These alerts can monitor multiple metrics and allow for alerting on dimensional metrics. Azure CLI support for newer metric alerts is coming soon.
>
>

This article shows you how to set up Azure classic metric alerts by using the cross-platform command-line interface (Azure CLI).

> [!NOTE]
> Azure Monitor is the new name for what was called "Azure Insights" until September 25, 2016. However, the namespaces and thus the commands that are described here still contain the word "insights."

You can receive an alert based on metrics for your Azure services, or based on events that occur in Azure.

* **Metric values**: The alert triggers when the value of a specified metric crosses a threshold that you assign in either direction. That is, it triggers both when the condition is first met and then when that condition is no longer being met.    

* **Activity log events**: An alert can trigger on *every* event or when certain events occur. To learn more about activity logs, see 
[Create activity log alerts (classic)](monitoring-activity-log-alerts.md). 

You can configure a classic metric alert to do the following when it triggers:

* Send email notifications to the service administrator and co-administrators. 
* Send email to email addresses that you specify.
* Call a webhook.
* Start execution of an Azure runbook (only from the Azure portal at this time).

You can configure and get information about classic metric alert rules by using the following: 

* [The Azure portal](insights-alerts-portal.md)
* [PowerShell](insights-alerts-powershell.md)
* [Azure CLI](insights-alerts-command-line-interface.md)
* [Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931945.aspx)

You can also get help for commands by typing a command with **-help** at the end. Following is an example: 

```console
 azure insights alerts -help
 azure insights alerts actions email create -help
 ```

## Create alert rules by using Azure CLI
1. After you've installed the prerequisites, sign in to Azure. See [Azure Monitor CLI samples](insights-cli-samples.md) for the commands that you need to get started. These commands help you get signed in, show you what subscription you're using, and prepare you to run Azure Monitor commands.

    ```console
    azure login
    azure account show
    azure config mode arm

    ```

2. To list existing rules on a resource group, use the following format: 

   **azure insights alerts rule list** *[options] &lt;resourceGroup&gt;*

   ```console
   azure insights alerts rule list myresourcegroupname

   ```
3. To create a rule, you need to have several important pieces of information first.
    * The **resource ID** for the resource you want to set an alert for.
    * The **metric definitions** that are available for that resource.

     One way to get the resource ID is to use the Azure portal. Assuming that the resource is already created, select it in the portal. Then, in the next blade, in the **Settings** section, select **Properties**. **RESOURCE ID** is a field in the next blade. 
     
     You can also get the resource ID by using  [Azure Resource Explorer](https://resources.azure.com/).

     Following is an example resource ID for a web app:

     ```console
     /subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroupname/providers/Microsoft.Web/sites/mywebsitename
     ```

     To get a list of the available metrics and units for the metrics in the previous resource example, use the following Azure CLI command:  

     ```console
     azure insights metrics list /subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroupname/providers/Microsoft.Web/sites/mywebsitename PT1M
     ```

     *PT1M* is the granularity of the available measurement (in 1-minute intervals). You have different metric options when you use different granularities.
     
4. To create a metric-based alert rule, use a command in the following format:

    **azure insights alerts rule metric set** *[options] &lt;ruleName&gt; &lt;location&gt; &lt;resourceGroup&gt; &lt;windowSize&gt; &lt;operator&gt; &lt;threshold&gt; &lt;targetResourceId&gt; &lt;metricName&gt; &lt;timeAggregationOperator&gt;*

    The following example sets up an alert on a website resource. The alert triggers whenever it consistently receives any traffic for 5 minutes and again when it receives no traffic for 5 minutes.

    ```console
    azure insights alerts rule metric set myrule eastus myreasourcegroup PT5M GreaterThan 2 /subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroupname/providers/Microsoft.Web/sites/mywebsitename BytesReceived Total

    ```
5. To create a webhook or send an email when a classic metric alert fires, first create the email or webhook. Then create the rule immediately afterwards. You can't associate webhooks or emails with rules that have already been created.

    ```console
    azure insights alerts actions email create --customEmails myemail@contoso.com

    azure insights alerts actions webhook create https://www.contoso.com

    azure insights alerts rule metric set myrulewithwebhookandemail eastus myreasourcegroup PT5M GreaterThan 2 /subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroupname/providers/Microsoft.Web/sites/mywebsitename BytesReceived Total
    ```

6. You can verify that your alerts have been created properly by looking at an individual rule.

    ```console
    azure insights alerts rule list myresourcegroup --ruleName myrule
    ```
7. To delete rules, use a command in the following format:

    **insights alerts rule delete** [options] &lt;resourceGroup&gt; &lt;ruleName&gt;

    These commands delete the rules that were previously created in this article.

    ```console
    azure insights alerts rule delete myresourcegroup myrule
    azure insights alerts rule delete myresourcegroup myrulewithwebhookandemail
    azure insights alerts rule delete myresourcegroup myActivityLogRule
    ```

## Next steps
* [Get an overview of Azure monitoring](monitoring-overview.md), including the types of information you can collect and monitor.
* Learn more about [configuring webhooks in alerts](insights-webhooks-alerts.md).
* Learn more about [configuring alerts on activity log events](monitoring-activity-log-alerts.md).
* Learn more about [Azure Automation runbooks](../automation/automation-starting-a-runbook.md).
* Get an [overview of collecting diagnostic logs](monitoring-overview-of-diagnostic-logs.md) to collect detailed high-frequency metrics for your service.
* Get an [overview of metrics collection](insights-how-to-customize-monitoring.md) to make sure your service is available and responsive.

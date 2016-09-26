<properties
	pageTitle="Use the cross-platform Command Line Interface (CLI) to create alerts for Azure services | Microsoft Azure"
	description="Use the command line interface to create Azure alerts, which can trigger notifications or automation when the conditions you specify are met."
	authors="rboucher"
	manager=""
	editor=""
	services="monitoring-and-diagnostics"
	documentationCenter="monitoring-and-diagnostics"/>

<tags
	ms.service="monitoring-and-diagnostics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/23/2016"
	ms.author="robb"/>

# Use the cross-platform Command Line Interface (CLI) to create alerts for Azure services 

> [AZURE.SELECTOR]
- [Portal](insights-alerts-portal.md)
- [PowerShell](insights-alerts-powershell.md)
- [CLI](insights-alerts-command-line-interface.md) 

## Overview

This article shows you how to set up Azure alerts using the Command Line Interface (CLI). 

You can receive an alert based on monitoring metrics for, or events on, your Azure services.

- **Metric values** - The alert triggers when the value of a specified metric crosses a threshold you assign in either direction. That is, it triggers both when the condition is first met and then afterwards when that condition is no longer being met.    
- **Activity log events** - An alert can trigger on *every* event, or, only when a certain number of events occur.

You can configure an alert to do the following when it triggers: 

- send email notifications to the service administrator and co-administrators
- send email to additional emails that you specify.
- call a webhook
- start execution of an Azure runbook (only from the Azure portal at this time) 

You can configure and get information about alert rules using 

- [Azure portal](insights-alerts-portal.md)
- [PowerShell](insights-alerts-powershell.md) 
- [command-line interface (CLI)](insights-alerts-command-line-interface.md) 
- [Azure Insights REST API](https://msdn.microsoft.com/library/azure/dn931945.aspx)


You can always receive help for commands by typing a command and putting -help at the end. For example:

	azure insights alerts -help
	azure insights alerts actions email create -help


## Create alert rules using the CLI

1. Perform the Prerequisites and login to Azure. See [Azure Insights CLI samples](insights-cli-samples.md). In short, install the CLI and run these commands. They get you logged in, show what subscription you are using, and prepare to run insights commands. 


	```console
	azure login
	azure account show
	azure config mode arm 

	```

2.  To list existing rules on a resource group, use the following form 
    **azure insights alerts rule list** *[options] &lt;resourceGroup&gt;*

	```console
	azure insights alerts rule list myresourcegroupname

	```
3. To create a rule, you need to have several important pieces of information first. 
	- The **Resource ID** for the resource you want to set an alert for
	- The **metric definitions** available for that resource
	
    One way to get the Resource ID is to use the Azure portal. Assuming the resource is already created, select it in the portal. Then in the next blade, select *Properties* under the *Settings* section. The *RESOURCE ID* is a field in the next blade. Another way is to use the [Azure Resource Explorer](https://resources.azure.com/).

    An example resource id for a web app is 
  
	```
	/subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroupname/providers/Microsoft.Web/sites/mywebsitename
	```

    To get a list of the available metrics and units for those metrics for the previous resource example, use the following CLI command:  

	```console
	azure insights metrics list /subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroupname/providers/Microsoft.Web/sites/mywebsitename PT1M 
  	```

	_PT1M_ is the granularity of the available measurement (1-minute intervals). Using different granularities gives you different metric options.

 
4. To create a metric-based alert rule, use a command of the following form:
 
	**azure insights alerts rule metric set** *[options] &lt;ruleName&gt; &lt;location&gt; &lt;resourceGroup&gt; &lt;windowSize&gt; &lt;operator&gt; &lt;threshold&gt; &lt;targetResourceId&gt; &lt;metricName&gt; &lt;timeAggregationOperator&gt;*
	
	The following example sets up an alert on a web site resource. The alert triggers whenever it consistently receives any traffic for 5 minutes and again when it receives no traffic for 5 minutes. 

    ```console
	azure insights alerts rule metric set myrule eastus myreasourcegroup PT5M GreaterThan 2 /subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroupname/providers/Microsoft.Web/sites/mywebsitename BytesReceived Total
   
	```

5. To create webhook or send email when an alert fires, first create the email and/or webhooks. Then create the rule immediately afterwards. You cannot associate webhook or emails with already created rules using the CLI. 
 
	```console
	azure insights alerts actions email create --customEmails myemail@contoso.com

	azure insights alerts actions webhook create https://www.contoso.com

	azure insights alerts rule metric set myrulewithwebhookandemail eastus myreasourcegroup PT5M GreaterThan 2 /subscriptions/dededede-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/myresourcegroupname/providers/Microsoft.Web/sites/mywebsitename BytesReceived Total
	```


6. To create an alert that fires on a specific condition in the activity log, use the form:
 
	**insights alerts rule log set** *[options] &lt;ruleName&gt; &lt;location&gt; &lt;resourceGroup&gt; &lt;operationName&gt;*

	For example

	```console
	azure insights alerts rule log set myActivityLogRule eastus myresourceGroupName Microsoft.Storage/storageAccounts/listKeys/action
	```

    The operationName corresponds to an event type for an entry in the activity log. Examples include *Microsoft.Compute/virtualMachines/delete* and *microsoft.insights/diagnosticSettings/write*.

    You can use the PowerShell command [Get-AzureRmProviderOperation](https://msdn.microsoft.com/library/mt603720.aspx) to obtain a list of possible operationNames. Alternately, you can use the Azure portal to query the Activity log and find specific past operations that you want to create an alert for. The operations shown in the graphic log view of the friendly names. Look in the JSON for the entry and pull out the OperationName value.   

7. You can verify that your alerts have been created properly by looking at an individual rule.

	```console
    azure insights alerts rule list myresourcegroup --ruleName myrule
	```

8. To delete rules, use a command of the form: 

	**insights alerts rule delete** [options] &lt;resourceGroup&gt; &lt;ruleName&gt;

	These commands delete the rules previously created in this article.

	```console
    azure insights alerts rule delete myresourcegroup myrule
    azure insights alerts rule delete myresourcegroup myrulewithwebhookandemail
    azure insights alerts rule delete myresourcegroup myActivityLogRule
	```



## Next steps

* [Get an overview of Azure monitoring](monitoring-overview.md) including the types of information you can collect and monitor.
* Learn more about [configuring webhooks in alerts](insights-webhooks-alerts.md).
* Learn more about [Azure Automation Runbooks](..\automation\automation-starting-a-runbook.md).
* Get an [overview of collecting diagnostic logs](monitoring-overview-of-diagnostic-logs.md) to collect detailed high-frequency metrics on your service.
* Get an [overview of metrics collection](insights-how-to-customize-monitoring.md) to make sure your service is available and responsive.



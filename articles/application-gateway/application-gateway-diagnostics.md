<properties 
   pageTitle="Monitor access and performance logs and Metrics for Application Gateway | Microsoft Azure"
   description="Learn how to enable and manage Access and Performance logs for Application Gateway"
   services="application-gateway"
   documentationCenter="na"
   authors="amitsriva"
   manager="rossort"
   editor="tysonn"
   tags="azure-resource-manager"
/>
<tags 
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/26/2016"
   ms.author="amitsriva" />

# Diagnostics Logging and Metrics for Application Gateway

Azure provides the capability to monitor resource with logging and metrics

[**Logging**](#enable-logging-with-powershell) - Logging allows for performance, access and other logs to be saved or consumed from a resource for monitoring purposes.

[**Metrics**](#metrics) - Application gateway currently has one metric. This metric measures the throughput of the application gateway in Bytes per second.

You can use different types of logs in Azure to manage and troubleshoot application gateways. Some of these logs can be accessed through the portal, and all logs can be extracted from an Azure blob storage, and viewed in different tools, such as [Log Analytics](../log-analytics/log-analytics-azure-networking-analytics.md), Excel, and PowerBI. You can learn more about the different types of logs from the following list:

- **Audit logs:** You can use [Azure Audit Logs](../azure-portal/insights-debugging-with-events.md) (formerly known as Operational Logs) to view all operations being submitted to your Azure subscription, and their status. Audit logs are enabled by default, and can be viewed in the Azure preview portal.
- **Access logs:** You can use this log to view application gateway access pattern and analyze important information including caller's IP, URL requested, response latency, return code, bytes in and out. Access log is collected every 300 seconds. This log contains one record per instance of application gateway. The application gateway instance can be identified by 'instanceId' property.
- **Performance logs:** You can use this log to view how application gateway instances are performing. This log captures performance information on per instance basis including total request served, throughput in bytes, total requests served, failed request count, healthy and unhealthy back-end instance count. Performance log is collected every 60 seconds.
- **Firewall logs:** You can use this log to view the requests that are logged through either detection or prevention mode of an application gateway that is configured with web application firewall.

>[AZURE.WARNING] Logs are only available for resources deployed in the Resource Manager deployment model. You cannot use logs for resources in the classic deployment model. For a better understanding of the two models, reference the [Understanding Resource Manager deployment and classic deployment](../resource-manager-deployment-model.md) article.

## Enable logging with PowerShell

Audit logging is automatically enabled for every Resource Manager resource. You must enable access and performance logging to start collecting the data available through those logs. To enable logging, see the following steps: 

1. Note your storage account's Resource ID, where the log data is stored. This would be of the form: /subscriptions/\<subscriptionId\>/resourceGroups/\<resource group name\>/providers/Microsoft.Storage/storageAccounts/\<storage account name\>. Any storage account in your subscription can be used. You can use the preview portal to find this information.

	![Preview portal - Application Gateway Diagnostics](./media/application-gateway-diagnostics/diagnostics1.png)

2. Note your application gateway's Resource ID for which logging is to be enabled. This would be of the form: /subscriptions/\<subscriptionId\>/resourceGroups/\<resource group name\>/providers/Microsoft.Network/applicationGateways/\<application gateway name\>. You can use the preview portal to find this information.

	![Preview portal - Application Gateway Diagnostics](./media/application-gateway-diagnostics/diagnostics2.png)

3. Enable diagnostics logging using the following powershell cmdlet:

		Set-AzureRmDiagnosticSetting  -ResourceId /subscriptions/<subscriptionId>/resourceGroups/<resource group name>/providers/Microsoft.Network/applicationGateways/<application gateway name> -StorageAccountId /subscriptions/<subscriptionId>/resourceGroups/<resource group name>/providers/Microsoft.Storage/storageAccounts/<storage account name> -Enabled $true 	

>[AZURE.INFORMATION] Audit logs do not require a separate storage account. The use of storage for access and performance logging incurs service charges.

## Enable logging with Azure portal

### Step 1

Navigate to your resource in the Azure portal. Click **Diagnostic logs**. If this is the first time configuring diagnostics the blade looks like the following image:

For application gateway, 3 logs are available.

- Access Log
- Performance Log
- Firewall Log

Click **Turn on diagnostics** to start collecting data.

![diagnostics setting blade][1]

### Step 2

On the **Diagnostics settings** blade, the settings for how the diagnostic logs are set. In this example, Log analytics is used to store the logs. Click **Configure** under **Log Analytics** to configure your workspace. Event hubs and a storage account can be used to save the diagnostics logs as well.

![diagnostics blade][2]

### Step 3

Choose an existing OMS Workspace or create a new one. For this example an existing one is used.

![oms workspaces][3]

### Step 4

When complete, confirm the settings and click **Save** to save the settings.

![confirm selection][4]

## Audit log

This log (formerly known as the "operational log") is generated by Azure by default.  The logs are preserved for 90 days in Azure’s Event Logs store. Learn more about these logs by reading the [View events and audit logs](../azure-portal/insights-debugging-with-events.md) article.

## Access log

This log is only generated if you've enabled it on a per Application Gateway basis as detailed in the preceding steps. The data is stored in the storage account you specified when you enabled the logging. Each access of Application Gateway is logged in JSON format, as seen in the following example:

	{
		"resourceId": "/SUBSCRIPTIONS/<subscription id>/RESOURCEGROUPS/<resource group name>/PROVIDERS/MICROSOFT.NETWORK/APPLICATIONGATEWAYS/<application gateway name>",
		"operationName": "ApplicationGatewayAccess",
		"time": "2016-04-11T04:24:37Z",
		"category": "ApplicationGatewayAccessLog",
		"properties": {
			"instanceId":"ApplicationGatewayRole_IN_0",
			"clientIP":"37.186.113.170",
			"clientPort":"12345",
			"httpMethod":"HEAD",
			"requestUri":"/xyz/portal",
			"requestQuery":"",
			"userAgent":"-",
			"httpStatus":"200",
			"httpVersion":"HTTP/1.0",
			"receivedBytes":"27",
			"sentBytes":"202",
			"timeTaken":"359",
			"sslEnabled":"off"
		}
	}

## Performance log

This log is only generated if you have enabled it on a per Application Gateway basis as detailed in the preceding steps. The data is stored in the storage account you specified when you enabled the logging. The following data is logged:

	{
		"resourceId": "/SUBSCRIPTIONS/<subscription id>/RESOURCEGROUPS/<resource group name>/PROVIDERS/MICROSOFT.NETWORK/APPLICATIONGATEWAYS/<application gateway name>",
		"operationName": "ApplicationGatewayPerformance",
		"time": "2016-04-09T00:00:00Z",
		"category": "ApplicationGatewayPerformanceLog",
		"properties": 
		{
			"instanceId":"ApplicationGatewayRole_IN_1",
			"healthyHostCount":"4",
			"unHealthyHostCount":"0",
			"requestCount":"185",
			"latency":"0",
			"failedRequestCount":"0",
			"throughput":"119427"
		}
	}


## Firewall log

This log is only generated if you have enabled it on a per application gateway basis as detailed in the preceding steps. This log also requires that web application firewall be configured on an application gateway. The data is stored in the storage account you specified when you enabled the logging. The following data is logged:

	{
		"resourceId": "/SUBSCRIPTIONS/<subscriptionId>/RESOURCEGROUPS/<resourceGroupName>/PROVIDERS/MICROSOFT.NETWORK/APPLICATIONGATEWAYS/<applicationGatewayName>",
		"operationName": "ApplicationGatewayFirewall",
		"time": "2016-09-20T00:40:04.9138513Z",
		"category": "ApplicationGatewayFirewallLog",
		"properties":     {
			"instanceId":"ApplicationGatewayRole_IN_0",
			"clientIp":"108.41.16.164",
			"clientPort":1815,
			"requestUri":"/wavsep/active/RXSS-Detection-Evaluation-POST/",
			"ruleId":"OWASP_973336",
			"message":"XSS Filter - Category 1: Script Tag Vector",
			"action":"Logged",
			"site":"Global",
			"message":"XSS Filter - Category 1: Script Tag Vector",
			"details":{"message":" Warning. Pattern match "(?i)(<script","file":"/owasp_crs/base_rules/modsecurity_crs_41_xss_attacks.conf","line":"14"}}
	}

## View and analyze the audit log

You can view and analyze audit log data using any of the following methods:

- **Azure tools:** Retrieve information from the audit logs through Azure PowerShell, the Azure Command Line Interface (CLI), the Azure REST API, or the Azure preview portal.  Step-by-step instructions for each method are detailed in the [Audit operations with Resource Manager](../resource-group-audit.md) article.
- **Power BI:** If you don't already have a [Power BI](https://powerbi.microsoft.com/pricing) account, you can try it for free. Using the [Azure Audit Logs content pack for Power BI](https://powerbi.microsoft.com/en-us/documentation/powerbi-content-pack-azure-audit-logs/) you can analyze your data with pre-configured dashboards that you can use as-is, or customize.

## View and analyze the access, performance and firewall log

Azure [Log Analytics](../log-analytics/log-analytics-azure-networking-analytics.md) can collect the counter and event log files from your Blob storage account and includes visualizations and powerful search capabilities to analyze your logs.

You can also connect to your storage account and retrieve the JSON log entries for access and performance logs. Once you download the JSON files, you can convert them to CSV and view in Excel, PowerBI, or any other data visualization tool.

>[AZURE.TIP] If you are familiar with Visual Studio and basic concepts of changing values for constants and variables in C#, you can use the [log converter tools](https://github.com/Azure-Samples/networking-dotnet-log-converter) available from Github.

## Metrics

Metrics is a feature for certain Azure resources where you can view performance counters in the portal. For Application Gateway, one metric is available at the time of writing this article. This metric is throughput, and can be seen in the portal. Navigate to an application gateway and click **Metrics**.  Select throughput in the **Available metrics** section to view the values. In the following image, you can see an example with the filters that can be used to display the data in different time ranges.

To see a list of the current support metrics, visit [Supported metrics with Azure Monitor](../azure-portal/monitoring-supported-metrics.md)

![metric view][5]

## Alert rules

Alert rules can be started based of on metrics on a resource. This means for application gateway, an alert can call a webhook or email an administrator if the throughput of the application gateway is above, below or at a threshold for a specified period of time.

The following example will walk you through creating an alert rule that sends an email to an administrator after a throughput threshold has been breached.

### Step 1

Click **Add metric alert** to start. This blade can also be reached from the metrics blade.

![alert rules blade][6]

### Step 2

In the **Add rule** blade, fill out the name, condition, and notify sections and click **OK** when done.

The **Condition** selector allows for 4 values, **Greater than**, **Greater than or equal**, **Less than**, or **Less than or equal to**.

The **Period** selector, allows for picking of a period from 5 minutes to 6 hours.

By selecting **Email owners, contributors, and readers** the email can be dynamic based on the users that have access to that resource. Otherwise a comma separated list of users can be provided in the **Additional administrator email(s)** textbox.

![add rule blade][7]

If the threshold is breached, an email arrives similar to the one in the following image:

![threshold breached email][8]

A list of alerts is shown once a metric alert has been created and provides an overview of all the alert rules.

![alert rule view][9]

To learn more about alert notifications, visit [Receive alert notifications](../azure-portal/insights-receive-alert-notifications.md)

To understand more about webhooks and how you can use them with alerts, visit [Configure a webhook on an Azure metric alert](../azure-portal/insights-webhooks-alerts.md)

## Next steps

- Visualize counter and event logs with [Log Analytics](../log-analytics/log-analytics-azure-networking-analytics.md) 
- [Visualize your Azure Audit Logs with Power BI](http://blogs.msdn.com/b/powerbi/archive/2015/09/30/monitor-azure-audit-logs-with-power-bi.aspx) blog post.
- [View and analyze Azure Audit Logs in Power BI and more](https://azure.microsoft.com/blog/analyze-azure-audit-logs-in-powerbi-more/) blog post.

[1]: ./media/application-gateway-diagnostics/figure1.png
[2]: ./media/application-gateway-diagnostics/figure2.png
[3]: ./media/application-gateway-diagnostics/figure3.png
[4]: ./media/application-gateway-diagnostics/figure4.png
[5]: ./media/application-gateway-diagnostics/figure5.png
[6]: ./media/application-gateway-diagnostics/figure6.png
[7]: ./media/application-gateway-diagnostics/figure7.png
[8]: ./media/application-gateway-diagnostics/figure8.png
[9]: ./media/application-gateway-diagnostics/figure9.png
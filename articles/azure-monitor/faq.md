---
title: Azure Monitor FAQ | Microsoft Docs
description: Answers to frequently asked questions about Azure Monitor.
services: azure-monitor
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/30/2019

---


# Azure Monitor Frequently Asked Questions

This Microsoft FAQ is a list of commonly asked questions about Azure Monitor. If you have any additional questions, go to the [discussion forum](https://feedback.azure.com/forums/34192--general-feedback) and post your questions. When a question is frequently asked, we add it to this article so that it can be found quickly.

## General

### What is Azure Monitor?
[Azure Monitor](overview.md) is a service in Azure that provides performance and availability monitoring for applications and services in Azure, other cloud environments, or on-premises. Azure Monitor collects data from multiple sources into a common data platform where it can be analyzed for trends and anomalies. Rich features in Azure Monitor assist you in quickly identifying and responding to critical situations that may affect your application.

### What's the difference between Azure Monitor, Log Analytics, and Application Insights?
In September 2018, Microsoft combined Azure Monitor, Log Analytics, and Application Insights into a single service to provide powerful end-to-end monitoring of your applications and the components they rely on. Features in Log Analytics and Application Insights have not changed, although some features have been rebranded to Azure Monitor in order to better reflect their new scope. The log data engine and query language of Log Analytics is now referred to as Azure Monitor Logs. See [Azure Monitor terminology updates](terminology.md).

### What does Azure Monitor cost?
Features of Azure Monitor that are automatically enabled such as collection of metrics and activity logs are provided at no cost. There is a cost associated with other features such as log queries and alerting. See the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/) for detailed pricing information.

### How do I enable Azure Monitor?
Azure Monitor is enabled the moment that you create a new Azure subscription, and [Activity log](platform/activity-logs-overview.md) and platform [metrics](platform/data-platform-metrics.md) are automatically collected. Create [diagnostic settings](platform/diagnostic-settings.md) to collect more detailed information about the operation of your Azure resources, and add [monitoring solutions](insights/solutions.md) and [insights](insights/insights-overview.md) to provide additional analysis on collected data for particular services. 

### How do I access Azure Monitor?
Access all Azure Monitor features and data from the **Monitor** menu in the Azure portal. The **Monitoring** section of the menu for different Azure services provides access to the same tools with data filtered to a particular resource. Azure Monitor data is also accessible for a variety of scenarios using CLI, PowerShell, and a REST API.

### Is there an on-premises version of Azure Monitor?
No. Azure Monitor is a scalable cloud service that processes and stores large amounts of data, although Azure Monitor can monitor resources that are on-premises and in other clouds.

### Can Azure Monitor monitor on-premises resources?
Yes, in addition to collecting monitoring data from Azure resources, Azure Monitor can collect data from virtual machines and applications in other clouds and on-premises. See [Sources of monitoring data for Azure Monitor](platform/data-sources.md).

### Does Azure Monitor integrate with System Center Operations Manager?
You can connect your existing System Center Operations Manager management group to Azure Monitor to collect data from agents into Azure Monitor Logs. This allows you to use log queries and solution to analyze data collected from agents. You can also configure existing SCOM agents to send data directly to Azure Monitor. See [Connect Operations Manager to Azure Monitor](platform/om-agents.md).

### What IP addresses does Azure Monitor use?
See [IP addresses used by Application Insights and Log Analytics](app/ip-addresses.md) for a listing of the IP addresses and ports required for agents and other external resources to access Azure Monitor. 

## Monitoring data

### Where does Azure Monitor get its data?
Azure Monitor collects data from a variety of sources including logs and metrics from Azure platform and resources, custom applications, and agents running on virtual machines. Other services such as Azure Security Center and Network Watcher collect data into a Log Analytics workspace so it can be analyzed with Azure Monitor data. You can also send custom data to Azure Monitor using the REST API for logs or metrics. See [Sources of monitoring data for Azure Monitor](platform/data-sources.md).

### What data is collected by Azure Monitor? 
Azure Monitor collects data from a variety of sources into [logs](platform/data-platform-logs.md) or [metrics](platform/data-platform-metrics.md). Each type of data has its own relative advantages, and each supports a particular set of features in Azure Monitor. There is a single metrics database for each Azure subscription, while you can create multiple Log Analytics workspaces to collect logs depending on your requirements. See [Azure Monitor data platform](platform/data-platform.md).

### Is there a maximum amount of data that I can collect in Azure Monitor?
There is no limit to the amount of metric data you can collect, but this data is stored for a maximum of 93 days. See [Retention of Metrics](platform/data-platform-metrics.md#retention-of-metrics). There is no limit on the amount of log data that you can collected, but it may be affected by the pricing tier you choose for the Log Analytics workspace. See [pricing details](https://azure.microsoft.com/pricing/details/monitor/).

### How do I access data collected by Azure Monitor?
Insights and solutions provide a custom experience for working with data stored in Azure Monitor. You can work directly with log data using a log query written in Kusto Query Language (KQL). In the Azure portal, you can write and run queries and interactively analyze data using Log Analytics. Analyze metrics in the Azure portal with the Metrics Explorer. See [Analyze log data in Azure Monitor](log-query/log-query-overview.md) and [Getting started with Azure Metrics Explorer](platform/metrics-getting-started.md).





## Solutions and insights

### What is an insight in Azure Monitor?
Insights provide a customized monitoring experience for particular Azure services. They use the same metrics and logs as other features in Azure Monitor but may collect additional data and provide a unique experience in the Azure portal. See [Insights in Azure Monitor](insights/insights-overview.md).

To view insights in the Azure portal, see the **Insights** section of the **Monitor** menu or the **Monitoring** section of the service's menu.

### What is a solution in Azure Monitor?
Monitoring solutions are packaged sets of logic for monitoring a particular application or service based on Azure Monitor features. They collect log data in Azure Monitor and provide log queries and views for their analysis using a common experience in the Azure portal. See [Monitoring solutions in Azure Monitor](insights/solutions.md).

To view solutions in the Azure portal, click **More** in the **Insights** section of the **Monitor** menu. Click **Add** to add additional solutions to the workspace.






## Logs

### What's the difference between Azure Monitor Logs and Azure Data Explorer?
Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Monitor Logs is built on top of Azure Data Explorer and uses the same Kusto Query Language (KQL) with some minor differences. See [Azure Monitor log query language differences](log-query/data-explorer-difference.md).

### How do I retrieve log data?
All data is retrieved from a Log Analytics workspace using a log query written using Kusto Query Language (KQL). You can write your own queries or use solutions and insights that include log queries for a particular application or service. See [Overview of log queries in Azure Monitor](log-query/log-query-overview.md).

### What is a Log Analytics workspace?
All log data collected by Azure Monitor is stored in a Log Analytics workspace. A workspace is essentially a container where log data is collected from a variety of sources. You may have a single Log Analytics workspace for all your monitoring data or may have requirements for multiple workspaces. See [Designing your Azure Monitor Logs deployment](platform/design-logs-deployment.md).

### Can you move an existing Log Analytics workspace to another Azure subscription?
You can move a workspace between resource groups or subscriptions but not to a different region. See [Move a Log Analytics workspace to different subscription or resource group](/platform/move-workspace.md).


## Alerts

### What is an alert in Azure Monitor?
Alerts proactively notify you when important conditions are found in your monitoring data. They allow you to identify and address issues before the users of your system notice them. There are multiple kinds of alerts:

- Metric - Metric value exceeds a threshold.
- Log query - Results of a log query match defined criteria.
- Activity log - Activity log event matches defined criteria.
- Web test - Results of availability test match defined criteria.


See [Overview of alerts in Microsoft Azure](platform/alerts-overview.md).


### What is an action group?
An action group is a collection of notifications and actions that can be triggered by an alert. Multiple alerts can use a single action group allowing you to leverage common sets of notifications and actions. See [Create and manage action groups in the Azure portal](platform/action-groups.md).


### What is an action rule?
An action rule allows you to modify the behavior of a set of alerts that match a certain criteria. This allows you to to perform such requirements as disable alert actions during a maintenance window. You can also apply an action group to a set of alerts rather than applying them directly to the alert rules. See [Action rules](platform/alerts-action-rules.md).


## Agents

### Does Azure Monitor require an agent?
An agent is only required to collect data from the operating system and workloads in virtual machines. The virtual machines can be located in Azure, another cloud environment, or on-premises. See [Overview of the Azure Monitor agents](platform/agents-overview.md).


### What's the difference between the Azure Monitor agents?
Azure Diagnostic extension is for Azure virtual machines and collects data to Azure Monitor Metrics, Azure Storage, and Azure Event Hubs. The Log Analytics agent is for virtual machines in Azure, another cloud environment, or on-premises and collects data to Azure Monitor Logs. The Dependency agent requires the Log Analytics agent and collected process details and dependencies. See [Overview of the Azure Monitor agents](platform/agents-overview.md).


### Does my agent traffic use my ExpressRoute connection?
Traffic to Azure Monitor uses the Microsoft peering ExpressRoute circuit. See [ExpressRoute documentation](../expressroute/expressroute-faqs.md#supported-services) for a description of the different types of ExpressRoute traffic. 

### How can I confirm that the Log Analytics agent is able to communicate with Azure Monitor?
From Control Panel on the agent computer, select **Security & Settings**, **Microsoft Monitoring Agent** . Under the **Azure Log Analytics (OMS)** tab, a green check mark icon confirms that the agent is able to communicate with Azure Monitor. A yellow warning icon means the agent is having issues. One common reason is the **Microsoft Monitoring Agent** service has stopped. Use service control manager to restart the service.

### How do I stop the Log Analytics agent from communicating with Azure Monitor?
For agents connected to Log Analytics directly, open the Control Panel and select **Security & Settings**, **Microsoft Monitoring Agent**. Under the **Azure Log Analytics (OMS)** tab, remove all workspaces listed. In System Center Operations Manager, remove the computer from the Log Analytics managed computers list. Operations Manager updates the configuration of the agent to no longer report to Log Analytics. 

### How much data is sent per agent?
The amount of data sent per agent depends on:

* The solutions you have enabled
* The number of logs and performance counters being collected
* The volume of data in the logs

See [Manage usage and costs with Azure Monitor Logs](platform/manage-cost-storage.md) for details.

For computers that are able to run the WireData agent, use the following query to see how much data is being sent:

```Kusto
WireData
| where ProcessName == "C:\\Program Files\\Microsoft Monitoring Agent\\Agent\\MonitoringHost.exe" 
| where Direction == "Outbound" 
| summarize sum(TotalBytes) by Computer 
```

### How much network bandwidth is used by the Microsoft Management Agent (MMA) when sending data to Azure Monitor?
Bandwidth is a function on the amount of data sent. Data is compressed as it is sent over the network.


### How can I be notified when data collection from the Log Analytics agent stops?

Use the steps described in [create a new log alert](platform/alerts-metric.md) to be notified when data collection stops. Use the following settings for the alert rule:

- **Define alert condition**: Specify your Log Analytics workspace as the resource target.
- **Alert criteria** 
   - **Signal Name**: *Custom log search*
   - **Search query**: `Heartbeat | summarize LastCall = max(TimeGenerated) by Computer | where LastCall < ago(15m)`
   - **Alert logic**: **Based on** *number of results*, **Condition** *Greater than*, **Threshold value** *0*
   - **Evaluated based on**: **Period (in minutes)** *30*, **Frequency (in minutes)** *10*
- **Define alert details** 
   - **Name**: *Data collection stopped*
   - **Severity**: *Warning*

Specify an existing or new [Action Group](platform/action-groups.md) so that when the log alert matches criteria, you are notified if you have a heartbeat missing for more than 15 minutes.


### What are the firewall requirements for Azure Monitor agents?
See [Network firewall requirements](platform/log-analytics-agent.md#network-firewall-requirements)for details on firewall requirements.



## Application Insights

### Configuration problems
*I'm having trouble setting up my:*

* [.NET app](app/asp-net-troubleshoot-no-data.md)
* [Monitoring an already-running app](app/monitor-performance-live-website-now.md#troubleshoot)
* [Azure diagnostics](platform/diagnostics-extension-to-application-insights.md)
* [Java web app](app/java-troubleshoot.md)

*I get no data from my server*

* [Set firewall exceptions](app/ip-addresses.md)
* [Set up an ASP.NET server](app/monitor-performance-live-website-now.md)
* [Set up a Java server](app/java-agent.md)

### Can I use Application Insights with ...?

* [Web apps on an IIS server in Azure VM or Azure virtual machine scale set](app/azure-vm-vmss-apps.md)
* [Web apps on an IIS server - on-premises or in a VM](app/asp-net.md)
* [Java web apps](app/java-get-started.md)
* [Node.js apps](app/nodejs.md)
* [Web apps on Azure](app/azure-web-apps.md)
* [Cloud Services on Azure](app/cloudservices.md)
* [App servers running in Docker](app/docker.md)
* [Single-page web apps](app/javascript.md)
* [SharePoint](app/sharepoint.md)
* [Windows desktop app](app/windows-desktop.md)
* [Other platforms](app/platforms.md)

### Is it free?

Yes, for experimental use. In the basic pricing plan, your application can send a certain allowance of data each month free of charge. The free allowance is large enough to cover development, and publishing an app for a small number of users. You can set a cap to prevent more than a specified amount of data from being processed.

Larger volumes of telemetry are charged by the Gb. We provide some tips on how to [limit your charges](app/pricing.md).

The Enterprise plan incurs a charge for each day that each web server node sends telemetry. It is suitable if you want to use Continuous Export on a large scale.

[Read the pricing plan](https://azure.microsoft.com/pricing/details/application-insights/).

### How much does it cost?

* Open the **Usage and estimated costs page** in an Application Insights resource. There's a chart of recent usage. You can set a data volume cap, if you want.
* Open the [Azure Billing blade](https://portal.azure.com/#blade/Microsoft_Azure_Billing/BillingBlade/Overview) to see your bills across all resources.

### <a name="q14"></a>What does Application Insights modify in my project?
The details depend on the type of project. For a web application:

* Adds these files to your project:

  * ApplicationInsights.config.
  * ai.js
* Installs these NuGet packages:

  * *Application Insights API* - the core API
  * *Application Insights API for Web Applications* - used to send telemetry from the server
  * *Application Insights API for JavaScript Applications* - used to send telemetry from the client

    The packages include these assemblies:
  * Microsoft.ApplicationInsights
  * Microsoft.ApplicationInsights.Platform
* Inserts items into:

  * Web.config
  * packages.config
* (New projects only - if you [add Application Insights to an existing project][start], you have to do this manually.) Inserts snippets into the client and server code to initialize them with the Application Insights resource ID. For example, in an MVC app, code is inserted into the master page Views/Shared/_Layout.cshtml

### How do I upgrade from older SDK versions?
See the [release notes](app/release-notes.md) for the SDK appropriate to your type of application.

### <a name="update"></a>How can I change which Azure resource my project sends data to?
In Solution Explorer, right-click `ApplicationInsights.config` and choose **Update Application Insights**. You can send the data to an existing or new resource in Azure. The update wizard changes the instrumentation key in ApplicationInsights.config, which determines where the server SDK sends your data. Unless you deselect "Update all," it will also change the key where it appears in your web pages.

### What is Status Monitor?

A desktop app that you can use in your IIS web server to help configure Application Insights in web apps. It doesn't collect telemetry: you can stop it when you are not configuring an app. 

[Learn more](app/monitor-performance-live-website-now.md#questions).

### What telemetry is collected by Application Insights?

From server web apps:

* HTTP requests
* [Dependencies](app/asp-net-dependencies.md). Calls to: SQL Databases; HTTP calls to external services; Azure Cosmos DB, table, blob storage, and queue. 
* [Exceptions](app/asp-net-exceptions.md) and stack traces.
* [Performance Counters](app/performance-counters.md) - If you use [Status Monitor](app/monitor-performance-live-website-now.md), [Azure monitoring for App Services](app/azure-web-apps.md), [Azure monitoring for VM or virtual machine scale set](app/azure-vm-vmss-apps.md), or the [Application Insights collectd writer](app/java-collectd.md).
* [Custom events and metrics](app/api-custom-events-metrics.md) that you code.
* [Trace logs](app/asp-net-trace-logs.md) if you configure the appropriate collector.

From [client web pages](app/javascript.md):

* [Page view counts](app/usage-overview.md)
* [AJAX calls](app/asp-net-dependencies.md) Requests made from a running script.
* Page view load data
* User and session counts
* [Authenticated user IDs](app/api-custom-events-metrics.md#authenticated-users)

From other sources, if you configure them:

* [Azure diagnostics](platform/diagnostics-extension-to-application-insights.md)
* [Import to Analytics](platform/data-collector-api.md)
* [Log Analytics](platform/data-collector-api.md)
* [Logstash](platform/data-collector-api.md)

### Can I filter out or modify some telemetry?

Yes, in the server you can write:

* Telemetry Processor to filter or add properties to selected telemetry items before they are sent from your app.
* Telemetry Initializer to add properties to all items of telemetry.

Learn more for [ASP.NET](app/api-filtering-sampling.md) or [Java](app/java-filter-telemetry.md).

### How are city, country/region, and other geo location data calculated?

We look up the IP address (IPv4 or IPv6) of the web client using [GeoLite2](https://dev.maxmind.com/geoip/geoip2/geolite2/).

* Browser telemetry: We collect the sender's IP address.
* Server telemetry: The Application Insights module collects the client IP address. It is not collected if `X-Forwarded-For` is set.
* To learn more about how IP address and geolocation data is collected in Application Insights refer to this [article](https://docs.microsoft.com/azure/azure-monitor/app/ip-collection).


You can configure the `ClientIpHeaderTelemetryInitializer` to take the IP address from a different header. In some systems, for example, it is moved by a proxy, load balancer, or CDN to `X-Originating-IP`. [Learn more](https://apmtips.com/blog/2016/07/05/client-ip-address/).

You can [use Power BI](app/export-power-bi.md ) to display your request telemetry on a map.


### <a name="data"></a>How long is data retained in the portal? Is it secure?
Take a look at [Data Retention and Privacy][data].

### Could personal data be sent in the telemetry?

This is possible if your code sends such data. It can also happen if variables in stack traces include personal data. Your development team should conduct risk assessments to ensure that personal data is properly handled. [Learn more about data retention and privacy](app/data-retention-privacy.md).

**All** octets of the client web address are always set to 0 after the geo location attributes are looked up.

### My Instrumentation Key is visible in my web page source. 

* This is common practice in monitoring solutions.
* It can't be used to steal your data.
* It could be used to skew your data or trigger alerts.
* We have not heard that any customer has had such problems.

You could:

* Use two separate Instrumentation Keys (separate Application Insights resources), for client and server data. Or
* Write a proxy that runs in your server, and have the web client send data through that proxy.

### <a name="post"></a>How do I see POST data in Diagnostic search?
We don't log POST data automatically, but you can use a TrackTrace call: put the data in the message parameter. This has a longer size limit than the limits on string properties, though you can't filter on it.

### Should I use single or multiple Application Insights resources?

Use a single resource for all the components or roles in a single business system. Use separate resources for development, test, and release versions, and for independent applications.

* [See the discussion here](app/separate-resources.md)
* [Example - cloud service with worker and web roles](app/cloudservices.md)

### How do I dynamically change the instrumentation key?

* [Discussion here](app/separate-resources.md)
* [Example - cloud service with worker and web roles](app/cloudservices.md)

### What are the User and Session counts?

* The JavaScript SDK sets a user cookie on the web client, to identify returning users, and a session cookie to group activities.
* If there is no client-side script, you can [set cookies at the server](https://apmtips.com/blog/2016/07/09/tracking-users-in-api-app/).
* If one real user uses your site in different browsers, or using in-private/incognito browsing, or different machines, then they will be counted more than once.
* To identify a logged-in user across machines and browsers, add a call to [setAuthenticatedUserContext()](app/api-custom-events-metrics.md#authenticated-users).

### <a name="q17"></a> Have I enabled everything in Application Insights?
| What you should see | How to get it | Why you want it |
| --- | --- | --- |
| Availability charts |[Web tests](app/monitor-web-app-availability.md) |Know your web app is up |
| Server app perf: response times, ... |[Add Application Insights to your project](app/asp-net.md) or [Install AI Status Monitor on server](app/monitor-performance-live-website-now.md) (or write your own code to [track dependencies](app/api-custom-events-metrics.md#trackdependency)) |Detect perf issues |
| Dependency telemetry |[Install AI Status Monitor on server](app/monitor-performance-live-website-now.md) |Diagnose issues with databases or other external components |
| Get stack traces from exceptions |[Insert TrackException calls in your code](app/asp-net-exceptions.md) (but some are reported automatically) |Detect and diagnose exceptions |
| Search log traces |[Add a logging adapter](app/asp-net-trace-logs.md) |Diagnose exceptions, perf issues |
| Client usage basics: page views, sessions, ... |[JavaScript initializer in web pages](app/javascript.md) |Usage analytics |
| Client custom metrics |[Tracking calls in web pages](app/api-custom-events-metrics.md) |Enhance user experience |
| Server custom metrics |[Tracking calls in server](app/api-custom-events-metrics.md) |Business intelligence |

### Why are the counts in Search and Metrics charts unequal?

[Sampling](app/sampling.md) reduces the number of telemetry items (requests, custom events, and so on) that are actually sent from your app to the portal. In Search, you see the number of items actually received. In metric charts that display a count of events, you see the number of original events that occurred. 

Each item that is transmitted carries an `itemCount` property that shows how many original events that item represents. To observe sampling in operation, you can run this query in Analytics:

```
    requests | summarize original_events = sum(itemCount), transmitted_events = count()
```


### Automation

#### Configuring Application Insights

You can [write PowerShell scripts](app/powershell.md) using Azure Resource Monitor to:

* Create and update Application Insights resources.
* Set the pricing plan.
* Get the instrumentation key.
* Add a metric alert.
* Add an availability test.

You can't set up a Metric Explorer report or set up continuous export.

#### Querying the telemetry

Use the [REST API](https://dev.applicationinsights.io/) to run [Analytics](app/analytics.md) queries.

### How can I set an alert on an event?

Azure alerts are only on metrics. Create a custom metric that crosses a value threshold whenever your event occurs. Then set an alert on the metric. Note that: you'll get a notification whenever the metric crosses the threshold in either direction; you won't get a notification until the first crossing, no matter whether the initial value is high or low; there is always a latency of a few minutes.

### Are there data transfer charges between an Azure web app and Application Insights?

* If your Azure web app is hosted in a data center where there is an Application Insights collection endpoint, there is no charge. 
* If there is no collection endpoint in your host data center, then your app's telemetry will incur [Azure outgoing charges](https://azure.microsoft.com/pricing/details/bandwidth/).

This doesn't depend on where your Application Insights resource is hosted. It just depends on the distribution of our endpoints.

### Can I send telemetry to the Application Insights portal?

We recommend you use our SDKs and use the [SDK API](app/api-custom-events-metrics.md). There are variants of the SDK for various [platforms](app/platforms.md). These SDKs handle buffering, compression, throttling, retries, and so on. However, the [ingestion schema](https://github.com/Microsoft/ApplicationInsights-dotnet/tree/develop/Schema/PublicSchema) and [endpoint protocol](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/EndpointSpecs/ENDPOINT-PROTOCOL.md) are public.

### Can I monitor an intranet web server?

Yes, but you will need to allow traffic to our services by either firewall exceptions or proxy redirects.
- QuickPulse `https://rt.services.visualstudio.com:443` 
- ApplicationIdProvider `https://dc.services.visualstudio.com:443` 
- TelemetryChannel `https://dc.services.visualstudio.com:443` 


Review our full list of services and IP addresses [here](app/ip-addresses.md).

#### Firewall exception

Allow your web server to send telemetry to our endpoints. 

#### Gateway redirect

Route traffic from your server to a gateway on your intranet by overwriting Endpoints in your configuration.
If these "Endpoint" properties are not present in your config, these classes will use the default values shown below in the example ApplicationInsights.config. 

Your gateway should route traffic to our endpoint's base address. In your configuration, replace the default values with `http://<your.gateway.address>/<relative path>`.


##### Example ApplicationInsights.config with default endpoints:
```xml
<ApplicationInsights>
  ...
  <TelemetryModules>
    <Add Type="Microsoft.ApplicationInsights.Extensibility.PerfCounterCollector.QuickPulse.QuickPulseTelemetryModule, Microsoft.AI.PerfCounterCollector">
      <QuickPulseServiceEndpoint>https://rt.services.visualstudio.com/QuickPulseService.svc</QuickPulseServiceEndpoint>
    </Add>
  </TelemetryModules>
    ...
  <TelemetryChannel>
     <EndpointAddress>https://dc.services.visualstudio.com/v2/track</EndpointAddress>
  </TelemetryChannel>
  ...
  <ApplicationIdProvider Type="Microsoft.ApplicationInsights.Extensibility.Implementation.ApplicationId.ApplicationInsightsApplicationIdProvider, Microsoft.ApplicationInsights">
    <ProfileQueryEndpoint>https://dc.services.visualstudio.com/api/profiles/{0}/appId</ProfileQueryEndpoint>
  </ApplicationIdProvider>
  ...
</ApplicationInsights>
```

_Note ApplicationIdProvider is available starting in v2.6.0_

#### Proxy passthrough

Proxy passthrough can be achieved by configuring either a machine level or application level proxy.
For more information see dotnet's article on [DefaultProxy](https://docs.microsoft.com/dotnet/framework/configure-app/file-schema/network/defaultproxy-element-network-settings).
 
 Example Web.config:
 ```xml
<system.net>
    <defaultProxy>
      <proxy proxyaddress="http://xx.xx.xx.xx:yyyy" bypassonlocal="true"/>
    </defaultProxy>
</system.net>
```
 

### Can I run Availability web tests on an intranet server?

Our [web tests](app/monitor-web-app-availability.md) run on points of presence that are distributed around the globe. There are two solutions:

* Firewall door - Allow requests to your server from [the long and changeable list of web test agents](app/ip-addresses.md).
* Write your own code to send periodic requests to your server from inside your intranet. You could run Visual Studio web tests for this purpose. The tester could send the results to Application Insights using the TrackAvailability() API.

### How long does it take for telemetry to be collected?

Most Application Insights data has a latency of under 5 minutes. Some data can take longer; typically larger log files. For more information, see the [Application Insights SLA](https://azure.microsoft.com/support/legal/sla/application-insights/v1_2/).

### More answers
* [Application Insights forum](https://social.msdn.microsoft.com/Forums/vstudio/en-US/home?forum=ApplicationInsights)




<!--Link references-->

[data]: app/data-retention-privacy.md
[platforms]: app/platforms.md
[start]: app/app-insights-overview.md
[windows]: app/app-insights-windows-get-started.md




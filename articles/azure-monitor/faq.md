---
title: Azure Monitor FAQ | Microsoft Docs
description: Answers to frequently asked questions about Azure Monitor.
services: azure-monitor
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/15/2020

---

# Azure Monitor Frequently Asked Questions

This Microsoft FAQ is a list of commonly asked questions about Azure Monitor.

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
You can connect your existing System Center Operations Manager management group to Azure Monitor to collect data from agents into Azure Monitor Logs. This allows you to use log queries and solution to analyze data collected from agents. You can also configure existing System Center Operations Manager agents to send data directly to Azure Monitor. See [Connect Operations Manager to Azure Monitor](platform/om-agents.md).

### What IP addresses does Azure Monitor use?
See [IP addresses used by Application Insights and Log Analytics](app/ip-addresses.md) for a listing of the IP addresses and ports required for agents and other external resources to access Azure Monitor. 

## Monitoring data

### Where does Azure Monitor get its data?
Azure Monitor collects data from a variety of sources including logs and metrics from Azure platform and resources, custom applications, and agents running on virtual machines. Other services such as Azure Security Center and Network Watcher collect data into a Log Analytics workspace so it can be analyzed with Azure Monitor data. You can also send custom data to Azure Monitor using the REST API for logs or metrics. See [Sources of monitoring data for Azure Monitor](platform/data-sources.md).

### What data is collected by Azure Monitor? 
Azure Monitor collects data from a variety of sources into [logs](platform/data-platform-logs.md) or [metrics](platform/data-platform-metrics.md). Each type of data has its own relative advantages, and each supports a particular set of features in Azure Monitor. There is a single metrics database for each Azure subscription, while you can create multiple Log Analytics workspaces to collect logs depending on your requirements. See [Azure Monitor data platform](platform/data-platform.md).

### Is there a maximum amount of data that I can collect in Azure Monitor?
There is no limit to the amount of metric data you can collect, but this data is stored for a maximum of 93 days. See [Retention of Metrics](platform/data-platform-metrics.md#retention-of-metrics). There is no limit on the amount of log data that you can collect, but it may be affected by the pricing tier you choose for the Log Analytics workspace. See [pricing details](https://azure.microsoft.com/pricing/details/monitor/).

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
You can move a workspace between resource groups or subscriptions but not to a different region. See [Move a Log Analytics workspace to different subscription or resource group](platform/move-workspace.md).

### Why can't I see Query Explorer and Save buttons in Log Analytics?

**Query Explorer**, **Save** and **New alert rule** buttons are not available when the [query scope](log-query/scope.md) is set to a specific resource. To create alerts, save or load a query, Log Analytics must be scoped to a workspace. To open Log Analytics in workspace context, select **Logs** from the **Azure Monitor** menu. The last used workspace is selected, but you can select any other workspace. See [Log query scope and time range in Azure Monitor Log Analytics](log-query/scope.md)

### Why am I getting the error: "Register resource provider 'Microsoft.Insights' for this subscription to enable this query" when opening Log Analytics from a VM? 
Many resource providers are automatically registered, but you may need to manually register some resource providers. The scope for registration is always the subscription. See [Resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md#azure-portal) for more information.

### Why am I am getting no access error message when opening Log Analytics from a VM? 
To view VM Logs, you need to be granted with read permission to the workspaces that stores the VM logs. In these cases, your administrator must grant you with to permissions in Azure.

## Metrics

### Why are metrics from the guest OS of my Azure virtual machine not showing up in Metrics explorer?
[Platform metrics](insights/monitor-azure-resource.md#monitoring-data) are collected automatically for Azure resources. You must perform some configuration though to collect metrics from the guest OS of a virtual machine. For a Windows VM, install the diagnostic extension and configure the Azure Monitor sink as described in [Install and configure Windows Azure diagnostics extension (WAD)](platform/diagnostics-extension-windows-install.md). For Linux, install the Telegraf agent as described in [Collect custom metrics for a Linux VM with the InfluxData Telegraf agent](platform/collect-custom-metrics-linux-telegraf.md).

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
See [Network firewall requirements](platform/log-analytics-agent.md#network-requirements)for details on firewall requirements.


## Visualizations

### Why can't I see View Designer?

View Designer is only available for users assigned with Contributor permissions or higher in the Log Analytics workspace.

## Application Insights

### Configuration problems
*I'm having trouble setting up my:*

* [.NET app](app/asp-net-troubleshoot-no-data.md)
* [Monitoring an already-running app](app/monitor-performance-live-website-now.md#troubleshoot)
* [Azure diagnostics](platform/diagnostics-extension-to-application-insights.md)
* [Java web app](app/java-troubleshoot.md)

*I get no data from my server:*

* [Set firewall exceptions](app/ip-addresses.md)
* [Set up an ASP.NET server](app/monitor-performance-live-website-now.md)
* [Set up a Java server](app/java-agent.md)

*How many Application Insights should I deploy?:*

* [How to design your Application Insights deployment: One versus many Application Insights resources?](app/separate-resources.md)

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
  * ApplicationInsights.config
  * ai.js
* Installs these NuGet packages:
  * *Application Insights API* - the core API
  * *Application Insights API for Web Applications* - used to send telemetry from the server
  * *Application Insights API for JavaScript Applications* - used to send telemetry from the client
* The packages include these assemblies:
  * Microsoft.ApplicationInsights
  * Microsoft.ApplicationInsights.Platform
* Inserts items into:
  * Web.config
  * packages.config
* (New projects only - if you [add Application Insights to an existing project][start], you have to do this manually.) Inserts snippets into the client and server code to initialize them with the Application Insights resource ID. For example, in an MVC app, code is inserted into the master page Views/Shared/\_Layout.cshtml

### How do I upgrade from older SDK versions?
See the [release notes](app/release-notes.md) for the SDK appropriate to your type of application.

### <a name="update"></a>How can I change which Azure resource my project sends data to?
In Solution Explorer, right-click `ApplicationInsights.config` and choose **Update Application Insights**. You can send the data to an existing or new resource in Azure. The update wizard changes the instrumentation key in ApplicationInsights.config, which determines where the server SDK sends your data. Unless you deselect "Update all," it will also change the key where it appears in your web pages.

### Can I use `providers('Microsoft.Insights', 'components').apiVersions[0]` in my Azure Resource Manager deployments?

We do not recommend using this method of populating the API version. The newest version can represent preview releases which may contain breaking changes. Even with newer non-preview releases, the API versions are not always backwards compatible with existing templates, or in some cases the API version may not be available to all subscriptions.

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

### What happens to Application Insight's telemetry when a server or device loses connection with Azure?

All of our SDKs, including the web SDK, includes "reliable transport" or "robust transport". When the server or device loses connection with Azure, telemetry is [stored locally on the file system](https://docs.microsoft.com/azure/azure-monitor/app/data-retention-privacy#does-the-sdk-create-temporary-local-storage) (Server SDKs) or in HTML5 Session Storage (Web SDK). The SDK will periodically retry to send this telemetry until our ingestion service considers it "stale" (48-hours for logs, 30 minutes for metrics). Stale telemetry will be dropped. In some cases, such as when local storage is full, retry will not occur.


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
* If there is no client-side script, you can [set cookies at the server](https://apmtips.com/blog/2016/07/09/tracking-users-in-api-apps/).
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

Azure alerts are only on metrics. Create a custom metric that crosses a value threshold whenever your event occurs. Then set an alert on the metric. You'll get a notification whenever the metric crosses the threshold in either direction; you won't get a notification until the first crossing, no matter whether the initial value is high or low; there is always a latency of a few minutes.

### Are there data transfer charges between an Azure web app and Application Insights?

* If your Azure web app is hosted in a data center where there is an Application Insights collection endpoint, there is no charge. 
* If there is no collection endpoint in your host data center, then your app's telemetry will incur [Azure outgoing charges](https://azure.microsoft.com/pricing/details/bandwidth/).

This doesn't depend on where your Application Insights resource is hosted. It just depends on the distribution of our endpoints.

### Can I send telemetry to the Application Insights portal?

We recommend you use our SDKs and use the [SDK API](app/api-custom-events-metrics.md). There are variants of the SDK for various [platforms](app/platforms.md). These SDKs handle buffering, compression, throttling, retries, and so on. However, the [ingestion schema](https://github.com/microsoft/ApplicationInsights-dotnet/tree/master/BASE/Schema/PublicSchema) and [endpoint protocol](https://github.com/Microsoft/ApplicationInsights-Home/blob/master/EndpointSpecs/ENDPOINT-PROTOCOL.md) are public.

### Can I monitor an intranet web server?

Yes, but you will need to allow traffic to our services by either firewall exceptions or proxy redirects.
- QuickPulse `https://rt.services.visualstudio.com:443` 
- ApplicationIdProvider `https://dc.services.visualstudio.com:443` 
- TelemetryChannel `https://dc.services.visualstudio.com:443` 


Review our full list of services and IP addresses [here](app/ip-addresses.md).

#### Firewall exception

Allow your web server to send telemetry to our endpoints. 

#### Gateway redirect

Route traffic from your server to a gateway on your intranet by overwriting Endpoints in your configuration. If these "Endpoint" properties are not present in your config, these classes will use the default values shown below in the example ApplicationInsights.config. 

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

> [!NOTE]
> ApplicationIdProvider is available starting in v2.6.0.



#### Proxy passthrough

Proxy passthrough can be achieved by configuring either a machine level or application level proxy.
For more information see dotnet's article on [DefaultProxy](https://docs.microsoft.com/dotnet/framework/configure-apps/file-schema/network/defaultproxy-element-network-settings).
 
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



<!--Link references-->

[data]: app/data-retention-privacy.md
[platforms]: app/platforms.md
[start]: app/app-insights-overview.md
[windows]: app/app-insights-windows-get-started.md


## Azure Monitor for containers

This Microsoft FAQ is a list of commonly asked questions about Azure Monitor for containers. If you have any additional questions about the solution, go to the [discussion forum](https://feedback.azure.com/forums/34192--general-feedback) and post your questions. When a question is frequently asked, we add it to this article so that it can be found quickly and easily.

### Health feature is in private preview

We are planning to make a series of changes to add functionality and address your feedback. The Health feature is going to transition to a private preview at the end of June 2020, and for additional information review the following [Azure updates announcement](https://azure.microsoft.com/updates/ci-health-limited-preview/).

### What does *Other Processes* represent under the Node view?

**Other processes** is intended to help you clearly understand the root cause of the high resource usage on your node. This enables you to distinguish usage between containerized processes vs non-containerized processes.

What are these **Other Processes**? 

These are non-containerized processes that run on your node.  

How do we calculate this?

**Other Processes** = *Total usage from CAdvisor* - *Usage from containerized process*

The **Other processes** includes:

- Self-managed or managed Kubernetes non-containerized processes 

- Container Run-time processes  

- Kubelet  

- System processes running on your node 

- Other non-Kubernetes workloads running on node hardware or VM 

### I don't see Image and Name property values populated when I query the ContainerLog table.

For agent version ciprod12042019 and later, by default these two properties are not populated for every log line to minimize cost incurred on log data collected. There are two options to query the table that include these properties with their values:

#### Option 1 

Join other tables to include these property values in the results.

Modify your queries to include Image and ImageTag properties from the ```ContainerInventory``` table by joining on ContainerID property. You can include the Name property (as it previously appeared in the ```ContainerLog``` table) from KubepodInventory table's ContaineName field by joining on the ContainerID property.This is the recommended option.

The following example is a sample detailed query that explains how to get these field values with joins.

```
//lets say we are querying an hour worth of logs
let startTime = ago(1h);
let endTime = now();
//below gets the latest Image & ImageTag for every containerID, during the time window
let ContainerInv = ContainerInventory | where TimeGenerated >= startTime and TimeGenerated < endTime | summarize arg_max(TimeGenerated, *)  by ContainerID, Image, ImageTag | project-away TimeGenerated | project ContainerID1=ContainerID, Image1=Image ,ImageTag1=ImageTag;
//below gets the latest Name for every containerID, during the time window
let KubePodInv  = KubePodInventory | where ContainerID != "" | where TimeGenerated >= startTime | where TimeGenerated < endTime | summarize arg_max(TimeGenerated, *)  by ContainerID2 = ContainerID, Name1=ContainerName | project ContainerID2 , Name1;
//now join the above 2 to get a 'jointed table' that has name, image & imagetag. Outer left is safer in-case there are no kubepod records are if they are latent
let ContainerData = ContainerInv | join kind=leftouter (KubePodInv) on $left.ContainerID1 == $right.ContainerID2;
//now join ContainerLog table with the 'jointed table' above and project-away redundant fields/columns and rename columns that were re-written
//Outer left is safer so you dont lose logs even if we cannot find container metadata for loglines (due to latency, time skew between data types etc...)
ContainerLog
| where TimeGenerated >= startTime and TimeGenerated < endTime 
| join kind= leftouter (
   ContainerData
) on $left.ContainerID == $right.ContainerID2 | project-away ContainerID1, ContainerID2, Name, Image, ImageTag | project-rename Name = Name1, Image=Image1, ImageTag=ImageTag1 

```

#### Option 2

Re-enable collection for these properties for every container log line.

If the first option is not convenient due to query changes involved, you can re-enable collecting these fields by enabling the setting ```log_collection_settings.enrich_container_logs``` in the agent config map as described in the [data collection configuration settings](insights/container-insights-agent-config.md).

> [!NOTE]
> The second option is not recommended with large clusters that have more than 50 nodes because it generates API server calls from every node in the cluster to perform this enrichment. This option also increases data size for every log line collected.

### Can I view metrics collected in Grafana?

Azure Monitor for containers supports viewing metrics stored in your Log Analytics workspace in Grafana dashboards. We have provided a template that you can download from Grafana's [dashboard repository](https://grafana.com/grafana/dashboards?dataSource=grafana-azure-monitor-datasource&category=docker) to get you started and  reference to help you learn how to query additional data from your monitored clusters to visualize in custom Grafana dashboards. 

### Can I monitor my AKS-engine cluster with Azure Monitor for containers?

Azure Monitor for containers supports monitoring container workloads deployed to AKS-engine (formerly known as ACS-engine) cluster(s) hosted on Azure. For further details and an overview of steps required to enable monitoring for this scenario, see [Using Azure Monitor for containers for AKS-engine](https://github.com/microsoft/OMS-docker/tree/aks-engine).

### Why don't I see data in my Log Analytics workspace?

If you are unable to see any data in the Log Analytics workspace at a certain time everyday, you may have reached the default 500 MB limit or the daily cap specified to control the amount of data to collect daily. When the limit is met for the day, data collection stops and resumes only on the next day. To review your data usage and update to a different pricing tier based on your anticipated usage patterns, see [Log data usage and cost](platform/manage-cost-storage.md). 

### What are the container states specified in the ContainerInventory table?

The ContainerInventory table contains information about both stopped and running containers. The table is populated by a workflow inside the agent that queries the docker for all the containers (running and stopped), and forwards that data the Log Analytics workspace.
 
### How do I resolve *Missing Subscription registration* error?

If you receive the error **Missing Subscription registration for Microsoft.OperationsManagement**, you can resolve it by registering the resource provider **Microsoft.OperationsManagement** in the subscription where the workspace is defined. The documentation for how to do this can be found [here](../azure-resource-manager/templates/error-register-resource-provider.md).

### Is there support for RBAC enabled AKS clusters?

The Container Monitoring solution doesn't support RBAC, but it is supported with Azure Monitor for Containers. The solution details page may not show the right information in the blades that show data for these clusters.

### How do I enable log collection for containers in the kube-system namespace through Helm?

The log collection from containers in the kube-system namespace is disabled by default. Log collection can be enabled by setting an environment variable on the omsagent. For more information, see the [Azure Monitor for containers](https://github.com/helm/charts/tree/master/incubator/azuremonitor-containers) GitHub page. 

### How do I update the omsagent to the latest released version?

To learn how to upgrade the agent, see [Agent management](insights/container-insights-manage-agent.md).

### How do I enable multi-line logging?

Currently Azure Monitor for containers doesn't support multi-line logging, but there are workarounds available. You can configure all the services to write in JSON format and then Docker/Moby will write them as a single line.

For example, you can wrap your log as a JSON object as shown in the example below for a sample node.js application:

```
console.log(json.stringify({ 
      "Hello": "This example has multiple lines:",
      "Docker/Moby": "will not break this into multiple lines",
      "and you will receive":"all of them in log analytics",
      "as one": "log entry"
      }));
```

This data will look like the following example in Azure Monitor for logs when you query for it:

```
LogEntry : ({"Hello": "This example has multiple lines:","Docker/Moby": "will not break this into multiple lines", "and you will receive":"all of them in log analytics", "as one": "log entry"}

```

For a detailed look at the issue, review the following [GitHub link](https://github.com/moby/moby/issues/22920).

### How do I resolve Azure AD errors when I enable live logs? 

You may see the following error: **The reply url specified in the request does not match the reply urls configured for the application: '<application ID\>'**. The solution to solve it can be found in the article [How to view container data in real time with Azure Monitor for containers](insights/container-insights-livedata-setup.md#configure-ad-integrated-authentication). 

### Why can't I upgrade cluster after onboarding?

If after you enable Azure Monitor for containers for an AKS cluster, you delete the Log Analytics workspace the cluster was sending its data to, when attempting to upgrade the cluster it will fail. To work around this, you will have to disable monitoring and then re-enable it referencing a different valid workspace in your subscription. When you try to perform the cluster upgrade again, it should process and complete successfully.  

### Which ports and domains do I need to open/whitelist for the agent?

See the [Network firewall requirements](insights/container-insights-onboard.md#network-firewall-requirements) for the proxy and firewall configuration information required for the containerized agent with Azure, Azure US Government, and Azure China 21Vianet clouds.

## Azure Monitor for VMs
This Microsoft FAQ is a list of commonly asked questions about Azure Monitor for VMs. If you have any additional questions about the solution, go to the [discussion forum](https://feedback.azure.com/forums/34192--general-feedback) and post your questions. When a question is frequently asked, we add it to this article so that it can be found quickly and easily.

### Can I onboard to an existing workspace?
If your virtual machines are already connected to a Log Analytics workspace, you may continue to use that workspace when onboarding to Azure Monitor for VMs, provided it is in one of the supported regions listed [here](insights/vminsights-enable-overview.md#prerequisites).


### Can I onboard to a new workspace? 
If your VMs are not currently connected to an existing Log Analytics workspace, you need to create a new workspace to store your data. Creating a new default workspace is done automatically if you configure a single Azure VM for Azure Monitor for VMs through the Azure portal.

If you choose to use the script-based method, these steps are covered in the [Enable Azure Monitor for VMs using Azure PowerShell or Resource Manager template](insights/vminsights-enable-at-scale-powershell.md) article. 

### What do I do if my VM is already reporting to an existing workspace?
If you are already collecting data from your virtual machines, you may have already configured it to report data to an existing Log Analytics workspace.  As long as that workspace is in one of our supported regions, you can enable Azure Monitor for VMs to that pre-existing workspace.  If the workspace you are already using is not in one of our supported regions, you won't be able to onboard to Azure Monitor for VMs at this time.  We are actively working to support additional regions.


### Why did my VM fail to onboard?
When onboarding an Azure VM from the Azure portal, the following steps occur:

* A default Log Analytics workspace is created, if that option was selected.
* The Log Analytics agent is installed on Azure VMs using a VM extension, if determined it is required.  
* The Azure Monitor for VMs Map Dependency agent is installed on Azure VMs using an extension, if determined it is required. 

During the onboard process, we check for status on each of the above to return a notification status to you in the portal. Configuration of the workspace and the agent installation typically takes 5 to 10 minutes. Viewing monitoring data in the portal take an additional 5 to 10 minutes.  

If you have initiated onboarding and see messages indicating the VM needs to be onboarded,  allow for up to 30 minutes for the VM to complete the process. 


### I don't see some or any data in the performance charts for my VM
Our performance charts have been updated to use data stored in the *InsightsMetrics* table.  To see data in these charts you will need to upgrade to use the new VM Insights solution.  Please refer to our [GA FAQ](insights/vminsights-ga-release-faq.md) for additional information.

If you don't see performance data in the disk table or in some of the performance charts then your performance counters may not be configured in the workspace. To resolve, run the following [PowerShell script](insights/vminsights-enable-at-scale-powershell.md#enable-with-powershell).


### How is Azure Monitor for VMs Map feature different from Service Map?
The Azure Monitor for VMs Map feature is based on Service Map, but has the following differences:

* The Map view can be accessed from the VM blade and from Azure Monitor for VMs under Azure Monitor.
* The connections in the Map are now clickable and display a view of the connection metric data in the side panel for the selected connection.
* There is a new API that is used to create the maps to better support more complex maps.
* Monitored VMs are now included in the client group node, and the donut chart shows the proportion of monitored vs unmonitored virtual machines in the group.  It can also be used to filter the list of machines when the group is expanded.
* Monitored virtual machines are now included in the server port group nodes, and the donut chart shows the proportion of monitored vs unmonitored machines in the group.  It can also be used to filter the list of machines when the group is expanded.
* The map style has been updated to be more consistent with App Map from Application insights.
* The side panels have been updated, and do not have the full set of integration's that were supported in Service Map - Update Management, Change Tracking, Security, and Service Desk. 
* The option for choosing groups and machines to map has been updated and now supports Subscriptions, Resource Groups, Azure virtual machine scale sets, and Cloud services.
* You cannot create new Service Map machine groups in the Azure Monitor for VMs Map feature.  

### Why do my performance charts show dotted lines?
This can occur for a few reasons.  In cases where there is a gap in data collection we depict the lines as dotted.  If you have modified the data sampling frequency for the performance counters enabled (the default setting is to collect data every 60 seconds), you can see dotted lines in the chart if you choose a narrow time range for the chart and your sampling frequency is less than the bucket size used in the chart (for example, the sampling frequency is every 10 minutes and each bucket on the chart is 5 minutes).  Choosing a wider time range to view should cause the chart lines to appear as solid lines rather than dots in this case.

### Are groups supported with Azure Monitor for VMs?
Yes, once you install the Dependency agent we collect information from the VMs to display groups based upon subscription, resource group, virtual machine scale sets, and cloud services.  If you have been using Service Map and have created machine groups, these are displayed as well.  Computer groups will also appear in the groups filter if you have created them for the workspace you are viewing. 

### How do I see the details for what is driving the 95th percentile line in the aggregate performance charts?
By default, the list is sorted to show you the VMs that have the highest value for the 95th percentile for the selected metric, except for the Available memory chart, which shows the machines with the lowest value of the 5th percentile.  Clicking on the chart will open the **Top N List**  view with the appropriate metric selected.

### How does the Map feature handle duplicate IPs across different vnets and subnets?
If you are duplicating IP ranges either with VMs or Azure virtual machine scale sets across subnets and vnets, it can cause Azure Monitor for VMs Map to display incorrect information. This is a known issue and we are investigating options to improve this experience.

### Does Map feature support IPv6?
Map feature currently only supports IPv4 and we are investigating support for IPv6. We also support IPv4 that is tunneled inside IPv6.

### When I load a map for a Resource Group or other large group the map is difficult to view
While we have made improvements to Map to handle large and complex configurations, we realize a map can have a lot of nodes, connections, and node working as a cluster.  We are committed to continuing to enhance support to increase scalability.   

### Why does the network chart on the Performance tab look different than the network chart on the Azure VM Overview page?

The overview page for an Azure VM displays charts based on the host's measurement of activity in the guest VM.  For the network chart on the Azure VM Overview, it only displays network traffic that will be billed.  This does not include inter-virtual network traffic.  The data and charts shown for Azure Monitor for VMs is based on data from the guest VM and the network chart displays all TCP/IP traffic that is inbound and outbound to that VM, including inter-virtual network.

### How is response time measured for data stored in VMConnection and displayed in the connection panel and workbooks?

Response time is an approximation. Since we do not instrument the code of the application, we do not really know when a request begins and when the response arrives. Instead we observe data being sent on a connection and then data coming back on that connection. Our agent keeps track of these sends and receives and attempts to pair them: a sequence of sends, followed by a sequence of receives is interpreted as a request/response pair. The timing between these operations is the response time. It will include the network latency and the server processing time.

This approximation works well for protocols that are request/response based: a single request goes out on the connection, and a single response arrives. This is the case for HTTP(S) (without pipelining), but not satisfied for other protocols.

### Are their limitations if I am on the Log Analytics Free pricing plan?
If you have configured Azure Monitor with a Log Analytics workspace using the *Free* pricing tier, Azure Monitor for VMs Map feature will only support five connected machines connected to the workspace. If you have five VMs connected to a free workspace, you disconnect one of the VMs and then later connect a new VM, the new VM is not monitored and reflected on the Map page.  

Under this condition, you will be prompted with the **Try Now** option when you open the VM and select **Insights** from the left-hand pane, even after it has been installed already on the VM.  However, you are not prompted with options as would normally occur if this VM were not onboarded to Azure Monitor for VMs. 


## Next steps
If your question isn't answered here, you can refer to the following forums to additional questions and answers.

- [Log Analytics](https://docs.microsoft.com/answers/topics/azure-monitor.html)
- [Application Insights](https://docs.microsoft.com/answers/topics/azure-monitor.html)

For general feedback on Azure Monitor please visit the [feedback forum](https://feedback.azure.com/forums/34192--general-feedback).

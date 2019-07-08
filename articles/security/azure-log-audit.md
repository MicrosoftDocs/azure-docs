---

title: Azure logging and auditing | Microsoft Docs
description: Learn about how you can use logging data to gain deep insights about your application.
services: security
documentationcenter: na
author: UnifyCloud
manager: barbkess
editor: TomSh

ms.assetid: 
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/14/2019
ms.author: TomSh

---
# Azure logging and auditing

Azure provides a wide array of configurable security auditing and logging options to help you identify gaps in your security policies and mechanisms. This article discusses generating, collecting, and analyzing security logs from services hosted on Azure.

> [!Note]
> Certain recommendations in this article might result in increased data, network, or compute resource usage, and increase your license or subscription costs.

## Types of logs in Azure

Cloud applications are complex, with many moving parts. Logs provide data to help keep your applications up and running. Logs help you troubleshoot past problems or prevent potential ones. And they can help improve application performance or maintainability, or automate actions that would otherwise require manual intervention.

Azure logs are categorized into the following types:
* **Control/management logs** provide information about Azure Resource Manager CREATE, UPDATE, and DELETE operations. For more information, see [Azure activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs).

* **Data plane logs** provide information about events raised as part Azure resource usage. Examples of this type of log are the Windows event system, security, and application logs in a virtual machine (VM) and the [diagnostics logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) that are configured through Azure Monitor.

* **Processed events** provide information about analyzed events/alerts that have been processed on your behalf. Examples of this type are [Azure Security Center alerts](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts) where [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro) has processed and analyzed your subscription and provides concise security alerts.

The following table lists the most important types of logs available in Azure:

| Log category | Log type | Usage | Integration |
| ------------ | -------- | ------ | ----------- |
|[Activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs)|Control-plane events on Azure Resource Manager resources|	Provides insight into the operations that were performed on resources in your subscription.|	Rest API, [Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs)|
|[Azure diagnostics logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs)|Frequent data about the operation of Azure Resource Manager resources in subscription|	Provides insight into operations that your resource itself performed.| Azure Monitor, [Stream](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs)|
|[Azure AD reporting](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-azure-portal)|Logs and reports | Reports user sign-in activities and system activity information about users and group management.|[Graph API](https://docs.microsoft.com/azure/active-directory/develop/active-directory-graph-api-quickstart)|
|[Virtual machines and cloud services](https://docs.microsoft.com/azure/log-analytics/log-analytics-quick-collect-azurevm)|Windows Event Log service and Linux Syslog|	Captures system data and logging data on the virtual machines and transfers that data into a storage account of your choice.|	Windows (using Windows Azure Diagnostics [[WAD](https://docs.microsoft.com/azure/azure-diagnostics)] storage) and Linux in Azure Monitor|
|[Azure Storage Analytics](https://docs.microsoft.com/rest/api/storageservices/fileservices/storage-analytics)|Storage logging, provides metrics data for a storage account|Provides insight into trace requests, analyzes usage trends, and diagnoses issues with your storage account.|	REST API or the [client library](https://msdn.microsoft.com/library/azure/mt347887.aspx)|
|[Network Security Group (NSG) flow logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-overview)|JSON format, shows outbound and inbound flows on a per-rule basis|Displays information about ingress and egress IP traffic through a Network Security Group.|[Azure Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview)|
|[Application insight](https://docs.microsoft.com/azure/application-insights/app-insights-overview)|Logs, exceptions, and custom diagnostics|	Provides an application performance monitoring (APM) service for web developers on multiple platforms.|	REST API, [Power BI](https://powerbi.microsoft.com/documentation/powerbi-azure-and-power-bi/)|
|Process data / security alerts|	Azure Security Center alerts, Azure Monitor logs alerts|	Provides security information and alerts.| 	REST APIs, JSON|

### Activity logs

[Azure activity logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) provide insight into the operations that were performed on resources in your subscription. Activity logs were previously known as “audit logs” or “operational logs,” because they report [control-plane events](https://driftboatdave.com/2016/10/13/azure-auditing-options-for-your-custom-reporting-needs/) for your subscriptions. 

Activity logs help you determine the “what, who, and when” for write operations (that is, PUT, POST, or DELETE). Activity logs also help you understand the status of the operation and other relevant properties. Activity logs do not include read (GET) operations.

In this article, PUT, POST, and DELETE refer to all the write operations that an activity log contains on the resources. For example, you can use the activity logs to find an error when you're troubleshooting issues or to monitor how a user in your organization modified a resource.

![Activity log diagram](./media/azure-log-audit/azure-log-audit-fig1.png)

You can retrieve events from an activity log by using the Azure portal, [Azure CLI](https://docs.microsoft.com/azure/storage/storage-azure-cli), PowerShell cmdlets, and [Azure Monitor REST API](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-rest-api-walkthrough). Activity logs have 90-day data-retention period.

Integration scenarios for an activity log event:

* [Create an email or webhook alert that's triggered by an activity log event](https://docs.microsoft.com/azure/monitoring-and-diagnostics/insights-auditlog-to-webhook-email).

* [Stream it to an event hub](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-stream-activity-logs-event-hubs) for ingestion by a third-party service or custom analytics solution such as PowerBI.

* Analyze it in PowerBI by using the [PowerBI content pack](https://powerbi.microsoft.com/documentation/powerbi-content-pack-azure-audit-logs/).

* [Save it to a storage account for archival or manual inspection](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-archive-activity-log). You can specify the retention time (in days) by using log profiles.

* Query and view it in the Azure portal.

* Query it via PowerShell cmdlet, Azure CLI, or REST API.

* Export the activity log with log profiles to [Azure Monitor logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-overview).

You can use a storage account or [event hub namespace](https://docs.microsoft.com/azure/event-hubs/event-hubs-resource-manager-namespace-event-hub-enable-archive) that is not in the same subscription as the one that's emitting the log. Whoever configures the setting must have the appropriate [role-based access control (RBAC)](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal) access to both subscriptions.

### Azure diagnostics logs

Azure diagnostics logs are emitted by a resource that provides rich, frequent data about the operation of that resource. The content of these logs varies by resource type. For example, [Windows event system logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-data-sources-windows-events) are a category of diagnostics logs for VMs, and [blob, table, and queue logs](https://docs.microsoft.com/azure/storage/storage-monitor-storage-account) are categories of diagnostics logs for storage accounts. Diagnostics logs differ from activity logs, which provide insight into the operations that were performed on resources in your subscription.

![Azure diagnostics logs diagrams](./media/azure-log-audit/azure-log-audit-fig2.png)

Azure diagnostics logs offer multiple configuration options, such as the Azure portal, PowerShell, Azure CLI, and the REST API.

**Integration scenarios**

* Save them to a [storage account](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-archive-diagnostic-logs) for auditing or manual inspection. You can specify the retention time (in days) by using the diagnostics settings.

* [Stream them to event hubs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-stream-diagnostic-logs-to-event-hubs) for ingestion by a third-party service or custom analytics solution, such as [PowerBI](https://powerbi.microsoft.com/documentation/powerbi-azure-and-power-bi/).

* Analyze them with [Azure Monitor logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-overview).

**Supported services, schema for diagnostics logs and supported log categories per resource type**


| Service | Schema and documentation | Resource type | Category |
| ------- | ------------- | ------------- | -------- |
|Azure Load Balancer| [Azure Monitor logs for Load Balancer (Preview)](https://docs.microsoft.com/azure/load-balancer/load-balancer-monitor-log)|Microsoft.Network/loadBalancers<br>Microsoft.Network/loadBalancers|	LoadBalancerAlertEvent<br>LoadBalancerProbeHealthStatus|
|Network Security Groups|[Azure Monitor logs for Network Security Groups](https://docs.microsoft.com/azure/virtual-network/virtual-network-nsg-manage-log)|Microsoft.Network/networksecuritygroups<br>Microsoft.Network/networksecuritygroups|NetworkSecurityGroupEvent<br>NetworkSecurityGroupRuleCounter|
|Azure Application Gateway|[Diagnostics logging for Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics)|Microsoft.Network/applicationGateways<br>Microsoft.Network/applicationGateways<br>Microsoft.Network/applicationGateways|ApplicationGatewayAccessLog<br>ApplicationGatewayPerformanceLog<br>ApplicationGatewayFirewallLog|
|Azure Key Vault|[Key Vault logs](https://docs.microsoft.com/azure/key-vault/key-vault-logging)|Microsoft.KeyVault/vaults|AuditEvent|
|Azure Search|[Enabling and using Search Traffic Analytics](https://docs.microsoft.com/azure/search/search-traffic-analytics)|Microsoft.Search/searchServices|OperationLogs|
|Azure Data Lake Store|[Access diagnostics logs for Data Lake Store](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-diagnostic-logs)|Microsoft.DataLakeStore/accounts<br>Microsoft.DataLakeStore/accounts|Audit<br>Requests|
|Azure Data Lake Analytics|[Access diagnostics logs for Data Lake Analytics](https://docs.microsoft.com/azure/data-lake-analytics/data-lake-analytics-diagnostic-logs)|Microsoft.DataLakeAnalytics/accounts<br>Microsoft.DataLakeAnalytics/accounts|Audit<br>Requests|
|Azure Logic Apps|[Logic Apps B2B custom tracking schema](https://docs.microsoft.com/azure/logic-apps/logic-apps-track-integration-account-custom-tracking-schema)|Microsoft.Logic/workflows<br>Microsoft.Logic/integrationAccounts|WorkflowRuntime<br>IntegrationAccountTrackingEvents|
|Azure Batch|[Azure Batch diagnostics logs](https://docs.microsoft.com/azure/batch/batch-diagnostics)|Microsoft.Batch/batchAccounts|ServiceLog|
|Azure Automation|[Azure Monitor logs for Azure Automation](https://docs.microsoft.com/azure/automation/automation-manage-send-joblogs-log-analytics)|Microsoft.Automation/automationAccounts<br>Microsoft.Automation/automationAccounts|JobLogs<br>JobStreams|
|Azure Event Hubs|[Event Hubs diagnostics logs](https://docs.microsoft.com/azure/event-hubs/event-hubs-diagnostic-logs)|Microsoft.EventHub/namespaces<br>Microsoft.EventHub/namespaces|ArchiveLogs<br>OperationalLogs|
|Azure Stream Analytics|[Job diagnostics logs](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-job-diagnostic-logs)|Microsoft.StreamAnalytics/streamingjobs<br>Microsoft.StreamAnalytics/streamingjobs|Execution<br>Authoring|
|Azure Service Bus|[Service Bus diagnostics logs](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-diagnostic-logs)|Microsoft.ServiceBus/namespaces|OperationalLogs|

### Azure Active Directory reporting

Azure Active Directory (Azure AD) includes security, activity, and audit reports for a user's directory. The [Azure AD audit report](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-guide) helps you identify privileged actions that occurred in the user's Azure AD instance. Privileged actions include elevation changes (for example, role creation or password resets), changing policy configurations (for example, password policies), or changes to the directory configuration (for example, changes to domain federation settings).

The reports provide the audit record for the event name, the user who performed the action, the target resource affected by the change, and the date and time (in UTC). Users can retrieve the list of audit events for Azure AD via the [Azure portal](https://portal.azure.com/), as described in [View your audit logs](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-azure-portal). 

The included reports are listed in the following table:

| Security reports | Activity reports | Audit reports |
| :--------------- | :--------------- | :------------ |
|Sign-ins from unknown sources|	Application usage: summary|	Directory audit report|
|Sign-ins after multiple failures|	Application usage: detailed||
|Sign-ins from multiple geographies|	Application dashboard||
|Sign-ins from IP addresses with suspicious activity|	Account provisioning errors||
|Irregular sign-in activity|	Individual user devices||
|Sign-ins from possibly infected devices|	Individual user activity||
|Users with anomalous sign-in activity|	Groups activity report||
||Password reset registration activity report||
||Password reset activity||

The data in these reports can be useful to your applications, such as Security Information and Event Management (SIEM) systems, audit, and business intelligence tools. The Azure AD reporting APIs provide programmatic access to the data through a set of REST-based APIs. You can call these [APIs](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-api-getting-started) from various programming languages and tools.

Events in the Azure AD audit report are retained for 180 days.

> [!Note]
> For more information about report retention, see [Azure AD report retention policies](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-retention).

If you're interested in retaining your audit events longer, use the Reporting API to regularly pull [audit events](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-audit-events) into a separate data store.

### Virtual machine logs that use Azure Diagnostics

[Azure Diagnostics](https://docs.microsoft.com/azure/azure-diagnostics) is the capability within Azure that enables the collection of diagnostics data on a deployed application. You can use the diagnostics extension from any of several sources. Currently supported are [Azure cloud service web and worker roles](https://docs.microsoft.com/azure/cloud-services/cloud-services-choose-me).

![Virtual machine logs that use Azure Diagnostics](./media/azure-log-audit/azure-log-audit-fig3.png)

### [Azure virtual machines](/learn/paths/deploy-a-website-with-azure-virtual-machines/) that are running Microsoft Windows and [Service Fabric](https://docs.microsoft.com/azure/service-fabric/service-fabric-overview)

You can enable Azure Diagnostics on a virtual machine by doing any of the following:

* [Use Visual Studio to trace Azure virtual machines](https://docs.microsoft.com/azure/vs-azure-tools-debug-cloud-services-virtual-machines)

* [Set up Azure Diagnostics remotely on an Azure virtual machine](https://docs.microsoft.com/azure/virtual-machines-dotnet-diagnostics)

* [Use PowerShell to set up diagnostics on Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-ps-extensions-diagnostics?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

* [Create a Windows virtual machine with monitoring and diagnostics by using an Azure Resource Manager template](https://docs.microsoft.com/azure/virtual-machines/virtual-machines-windows-extensions-diagnostics-template?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

### Storage Analytics

[Azure Storage Analytics](https://docs.microsoft.com/rest/api/storageservices/fileservices/storage-analytics) logs and provides metrics data for a storage account. You can use this data to trace requests, analyze usage trends, and diagnose issues with your storage account. Storage Analytics logging is available for the [Azure Blob, Azure Queue, and Azure Table storage services](https://docs.microsoft.com/azure/storage/storage-introduction). Storage Analytics logs detailed information about successful and failed requests to a storage service.

You can use this information to monitor individual requests and to diagnose issues with a storage service. Requests are logged on a best-effort basis. Log entries are created only if there are requests made against the service endpoint. For example, if a storage account has activity in its blob endpoint but not in its table or queue endpoints, only logs that pertain to the Blob storage service are created.

To use Storage Analytics, enable it individually for each service you want to monitor. You can enable it in the [Azure portal](https://portal.azure.com/). For more information, see [Monitor a storage account in the Azure portal](https://docs.microsoft.com/azure/storage/storage-monitor-storage-account). You can also enable Storage Analytics programmatically via the REST API or the client library. Use the Set Service Properties operation to enable Storage Analytics individually for each service.

The aggregated data is stored in a well-known blob (for logging) and in well-known tables (for metrics), which you can access by using the Blob storage service and Table storage service APIs.

Storage Analytics has a 20-terabyte (TB) limit on the amount of stored data that is independent of the total limit for your storage account. All logs are stored in [block blobs](https://docs.microsoft.com/azure/storage/storage-analytics) in a container named $logs, which is automatically created when you enable Storage Analytics for a storage account.

> [!Note]
> * For more information about billing and data retention policies, see [Storage Analytics and billing](https://docs.microsoft.com/rest/api/storageservices/fileservices/storage-analytics-and-billing).
> * For more information about storage account limits, see [Azure Storage scalability and performance targets](https://docs.microsoft.com/azure/storage/storage-scalability-targets).

Storage Analytics logs the following types of authenticated and anonymous requests:

| Authenticated  | Anonymous|
| :------------- | :-------------|
| Successful requests | Successful requests |
|Failed requests, including timeout, throttling, network, authorization, and other errors | Requests using a shared access signature, including failed and successful requests |
| Requests using a shared access signature, including failed and successful requests |Time-out errors for both client and server |
| 	Requests to analytics data | 	Failed GET requests with error code 304 (not modified) |
| Requests made by Storage Analytics itself, such as log creation or deletion, are not logged. A full list of the logged data is documented in [Storage Analytics logged operations and status messages](https://docs.microsoft.com/rest/api/storageservices/fileservices/storage-analytics-logged-operations-and-status-messages) and [Storage Analytics log format](https://docs.microsoft.com/rest/api/storageservices/fileservices/storage-analytics-log-format). | All other failed anonymous requests are not logged. A full list of the logged data is documented in [Storage Analytics logged operations and status messages](https://docs.microsoft.com/rest/api/storageservices/fileservices/storage-analytics-logged-operations-and-status-messages) and [Storage Analytics log format](https://docs.microsoft.com/rest/api/storageservices/fileservices/storage-analytics-log-format). |

### Azure networking logs

Network logging and monitoring in Azure is comprehensive and covers two broad categories:

* [Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview): Scenario-based network monitoring is provided with the features in Network Watcher. This service includes packet capture, next hop, IP flow verify, security group view, NSG flow logs. Scenario level monitoring provides an end to end view of network resources in contrast to individual network resource monitoring.

* [Resource monitoring](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview): Resource level monitoring comprises four features, diagnostics logs, metrics, troubleshooting, and resource health. All these features are built at the network resource level.

![Azure networking logs](./media/azure-log-audit/azure-log-audit-fig4.png)

Network Watcher is a regional service that enables you to monitor and diagnose conditions at a network scenario level in, to, and from Azure. Network diagnostics and visualization tools available with Network Watcher help you understand, diagnose, and gain insights to your network in Azure.

### Network Security Group flow logging

[NSG flow logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-overview) are a feature of Network Watcher that you can use to view information about ingress and egress IP traffic through an NSG. These flow logs are written in JSON format and show:
* Outbound and inbound flows on a per-rule basis.
* The NIC that the flow applies to.
* 5-tuple information about the flow: the source or destination IP, the source or destination port, and the protocol.
* Whether the traffic was allowed or denied.

Although flow logs target NSGs, they are not displayed in the same way as the other logs. Flow logs are stored only within a storage account.

The same retention policies that are seen on other logs apply to flow logs. Logs have a retention policy that you can set from 1 day to 365 days. If a retention policy is not set, the logs are maintained forever.

**Diagnostics logs**

Periodic and spontaneous events are created by network resources and logged in storage accounts, and sent to an event hub or Azure Monitor logs. The logs provide insights into the health of a resource. They can be viewed in tools such as Power BI and Azure Monitor logs. To learn how to view diagnostics logs, see [Azure Monitor logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-azure-networking-analytics).

![Diagnostics logs](./media/azure-log-audit/azure-log-audit-fig5.png)

Diagnostics logs are available for [Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-monitor-log), [Network Security Groups](https://docs.microsoft.com/azure/virtual-network/virtual-network-nsg-manage-log), Routes, and [Application Gateway](https://docs.microsoft.com/azure/application-gateway/application-gateway-diagnostics).

Network Watcher provides a diagnostics logs view. This view contains all networking resources that support diagnostics logging. From this view, you can enable and disable networking resources conveniently and quickly.


In addition to the previously mentioned logging capabilities, Network Watcher currently has the following capabilities:
- [Topology](https://docs.microsoft.com/azure/network-watcher/network-watcher-topology-overview): Provides a network-level view that shows the various interconnections and associations between network resources in a resource group.

- [Variable packet capture](https://docs.microsoft.com/azure/network-watcher/network-watcher-packet-capture-overview): Captures packet data in and out of a virtual machine. Advanced filtering options and fine-tuning controls, such as time- and size-limitation settings, provide versatility. The packet data can be stored in a blob store or on the local disk in *.cap* file format.

- [IP flow verification](https://docs.microsoft.com/azure/network-watcher/network-watcher-ip-flow-verify-overview): Checks to see whether a packet is allowed or denied based on flow information 5-tuple packet parameters (that is, destination IP, source IP, destination port, source port, and protocol). If the packet is denied by a security group, the rule and group that denied the packet is returned.

- [Next hop](https://docs.microsoft.com/azure/network-watcher/network-watcher-next-hop-overview): Determines the next hop for packets being routed in the Azure network fabric, so that you can diagnose any misconfigured user-defined routes.

- [Security group view](https://docs.microsoft.com/azure/network-watcher/network-watcher-security-group-view-overview): Gets the effective and applied security rules that are applied on a VM.

- [Virtual network gateway and connection troubleshooting](https://docs.microsoft.com/azure/network-watcher/network-watcher-troubleshoot-manage-rest): Helps you troubleshoot virtual network gateways and connections.

- [Network subscription limits](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview): Enables you to view network resource usage against limits.

### Application Insights

[Azure Application Insights](https://docs.microsoft.com/azure/application-insights/app-insights-overview) is an extensible APM service for web developers on multiple platforms. Use it to monitor live web applications. It automatically detects performance anomalies. It includes powerful analytics tools to help you diagnose issues and to understand what users actually do with your app.

Application Insights is designed to help you continuously improve performance and usability.

It works for apps on a wide variety of platforms, including .NET, Node.js, and Java EE, whether they're hosted on-premises or in the cloud. It integrates with your DevOps process and has connection points with various development tools.

![Application Insights diagram](./media/azure-log-audit/azure-log-audit-fig6.png)

Application Insights is aimed at the development team, to help you understand how your app is performing and how it's being used. It monitors:

* **Request rates, response times, and failure rates**: Find out which pages are most popular, at what times of day, and where your users are. See which pages perform best. If your response times and failure rates go high when there are more requests, you might have a resourcing problem.

* **Dependency rates, response times, and failure rates**: Find out whether external services are slowing you down.

* **Exceptions**: Analyze the aggregated statistics, or pick specific instances and drill into the stack trace and related requests. Both server and browser exceptions are reported.

* **Page views and load performance**: Get reports from your users' browsers.

* **AJAX calls**: Get webpage rates, response times, and failure rates.

* **User and session counts**.

* **Performance counters**: Get data from your Windows or Linux server machines, such as CPU, memory, and network usage.

* **Host diagnostics**: Get data from Docker or Azure.

* **Diagnostics trace logs**: Get data from your app, so that you can correlate trace events with requests.

* **Custom events and metrics**: Get data that you write yourself in the client or server code, to track business events such as items sold or games won.

The following table lists and describes integration scenarios:

| Integration scenario | Description |
| --------------------- | :---------- |
|[Application map](https://docs.microsoft.com/azure/application-insights/app-insights-app-map)|The components of your app, with key metrics and alerts.|
|[Diagnostics search for instance data](https://docs.microsoft.com/azure/application-insights/app-insights-diagnostic-search)| Search and filter events such as requests, exceptions, dependency calls, log traces, and page views.|
|[Metrics Explorer for aggregated data](https://docs.microsoft.com/azure/azure-monitor/app/metrics-explorer)|Explore, filter, and segment aggregated data such as rates of requests, failures, and exceptions; response times, page load times.|
|[Dashboards](https://docs.microsoft.com/azure/azure-monitor/app/overview-dashboard)|Mash up data from multiple resources and share with others. Great for multi-component applications, and for continuous display in the team room.|
|[Live Metrics Stream](https://docs.microsoft.com/azure/azure-monitor/app/live-stream)|When you deploy a new build, watch these near-real-time performance indicators to make sure everything works as expected.|
|[Analytics](https://docs.microsoft.com/azure/application-insights/app-insights-analytics)|Answer tough questions about your app's performance and usage by using this powerful query language.|
|[Automatic and manual alerts](https://docs.microsoft.com/azure/application-insights/app-insights-alerts)|Automatic alerts adapt to your app's normal patterns of telemetry and are triggered when there's something outside the usual pattern. You can also set alerts on particular levels of custom or standard metrics.|
|[Visual Studio](https://docs.microsoft.com/azure/application-insights/app-insights-visual-studio)|View performance data in the code. Go to code from stack traces.|
|[Power BI](https://docs.microsoft.com/azure/application-insights/app-insights-export-power-bi)|Integrate usage metrics with other business intelligence.|
|[REST API](https://dev.applicationinsights.io/)|Write code to run queries over your metrics and raw data.|
|[Continuous export](https://docs.microsoft.com/azure/application-insights/app-insights-export-telemetry)|Bulk export of raw data to storage when it arrives.|

### Azure Security Center alerts

Azure Security Center threat detection works by automatically collecting security information from your Azure resources, the network, and connected partner solutions. It analyzes this information, often correlating information from multiple sources, to identify threats. Security alerts are prioritized in Security Center along with recommendations on how to remediate the threat. For more information, see [Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro).

![Azure Security Center diagram](./media/azure-log-audit/azure-log-audit-fig7.png)

Security Center employs advanced security analytics, which go far beyond signature-based approaches. It applies breakthroughs in large data and [machine learning](https://azure.microsoft.com/blog/machine-learning-in-azure-security-center/) technologies to evaluate events across the entire cloud fabric. In this way, it detects threats that would be impossible to identify by using manual approaches and predicting the evolution of attacks. These security analytics include:

* **Integrated threat intelligence**: Looks for known bad actors by applying global threat intelligence from Microsoft products and services, the Microsoft Digital Crimes Unit (DCU), the Microsoft Security Response Center (MSRC), and external feeds.

* **Behavioral analytics**: Applies known patterns to discover malicious behavior.

* **Anomaly detection**: Uses statistical profiling to build a historical baseline. It alerts on deviations from established baselines that conform to a potential attack vector.

Many security operations and incident response teams rely on a SIEM solution as the starting point for triaging and investigating security alerts. With Azure Log Integration, you can sync Security Center alerts and virtual machine security events, collected by Azure diagnostics and audit logs, with your Azure Monitor logs or SIEM solution in near real time.

## Azure Monitor logs

Azure Monitor logs is a service in Azure that helps you collect and analyze data that's generated by resources in your cloud and on-premises environments. It gives you real-time insights by using integrated search and custom dashboards to readily analyze millions of records across all your workloads and servers, regardless of their physical location.

![Azure Monitor logs diagram](./media/azure-log-audit/azure-log-audit-fig8.png)

At the center of Azure Monitor logs is the Log Analytics workspace, which is hosted in Azure. Azure Monitor logs collects data in the workspace from connected sources by configuring data sources and adding solutions to your subscription. Data sources and solutions each create different record types, each with its own set of properties. But sources and solutions can still be analyzed together in queries to the workspace. This capability allows you to use the same tools and methods to work with a variety of data collected by a variety of sources.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

Connected sources are the computers and other resources that generate the data that's collected by Azure Monitor logs. Sources can include agents that are installed on [Windows](https://docs.microsoft.com/azure/log-analytics/log-analytics-windows-agents) and [Linux](https://docs.microsoft.com/azure/log-analytics/log-analytics-linux-agents) computers that connect directly, or agents in [a connected System Center Operations Manager management group](https://docs.microsoft.com/azure/log-analytics/log-analytics-om-agents). Azure Monitor logs can also collect data from an [Azure storage account](https://docs.microsoft.com/azure/log-analytics/log-analytics-azure-storage).

[Data sources](https://docs.microsoft.com/azure/log-analytics/log-analytics-data-sources) are the various kinds of data that's collected from each connected source. Sources include events and [performance data](https://docs.microsoft.com/azure/log-analytics/log-analytics-data-sources-performance-counters) from [Windows](https://docs.microsoft.com/azure/log-analytics/log-analytics-data-sources-windows-events) and Linux agents, in addition to sources such as [IIS logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-data-sources-iis-logs) and [custom text logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-data-sources-custom-logs). You configure each data source that you want to collect, and the configuration is automatically delivered to each connected source.

There are four ways to [collect logs and metrics for Azure services](https://docs.microsoft.com/azure/log-analytics/log-analytics-azure-storage):

* Azure Diagnostics direct to Azure Monitor logs (**Diagnostics** in the following table)

* Azure Diagnostics to Azure storage to Azure Monitor logs (**Storage** in the following table)

* Connectors for Azure services (**Connector** in the following table)

* Scripts to collect and then post data into Azure Monitor logs (blank cells in the following table and for services that are not listed)

| Service | Resource type | Logs | Metrics | Solution |
| :------ | :------------ | :--- | :------ | :------- |
|Azure Application Gateway|	Microsoft.Network/<br>applicationGateways|	Diagnostics|Diagnostics|	[Azure Application](https://docs.microsoft.com/azure/azure-monitor/insights/azure-networking-analytics) [Gateway Analytics](https://docs.microsoft.com/azure/azure-monitor/insights/azure-networking-analytics#azure-application-gateway-analytics-solution-in-azure-monitor)|
|Application Insights||	 	Connector|	Connector|	[Application Insights](https://blogs.technet.microsoft.com/msoms/2016/09/26/application-insights-connector-in-oms/) [Connector (Preview)](https://blogs.technet.microsoft.com/msoms/2016/09/26/application-insights-connector-in-oms/)|
|Azure Automation accounts|	Microsoft.Automation/<br>AutomationAccounts|	Diagnostics||	 	[More information](https://docs.microsoft.com/azure/automation/automation-manage-send-joblogs-log-analytics)|
|Azure Batch accounts|	Microsoft.Batch/<br>batchAccounts|	Diagnostics|	Diagnostics||
|Classic cloud services||	 	Storage||	 	[More information](https://docs.microsoft.com/azure/log-analytics/log-analytics-azure-storage-iis-table)|
|Cognitive Services|	Microsoft.CognitiveServices/<br>accounts|	 	Diagnostics|||
|Azure Data Lake Analytics|	Microsoft.DataLakeAnalytics/<br>accounts|	Diagnostics|||
|Azure Data Lake Store|	Microsoft.DataLakeStore/<br>accounts|	Diagnostics|||
|Azure Event Hub namespace|	Microsoft.EventHub/<br>namespaces|	Diagnostics|	Diagnostics||
|Azure IoT Hub|	Microsoft.Devices/<br>IotHubs||	 	Diagnostics||
|Azure Key Vault|	Microsoft.KeyVault/<br>vaults|	Diagnostics	 ||	[Key Vault Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-azure-key-vault)|
|Azure Load Balancer|	Microsoft.Network/<br>loadBalancers|	Diagnostics|||
|Azure Logic Apps|	Microsoft.Logic/<br>workflows| 	Diagnostics|	Diagnostics||
||Microsoft.Logic/<br>integrationAccounts||||
|Network Security Groups|	Microsoft.Network/<br>networksecuritygroups|Diagnostics|| 	[Azure Network Security Group analytics](https://docs.microsoft.com/azure/azure-monitor/insights/azure-networking-analytics#azure-application-gateway-and-network-security-group-analytics)|
|Recovery vaults|	Microsoft.RecoveryServices/<br>vaults|||[Azure Recovery Services Analytics (Preview)](https://github.com/krnese/AzureDeploy/blob/master/OMS/MSOMS/Solutions/recoveryservices/)|
|Search services|	Microsoft.Search/<br>searchServices|	Diagnostics|	Diagnostics||
|Service Bus namespace|	Microsoft.ServiceBus/<br>namespaces|	Diagnostics|Diagnostics|	[Service Bus Analytics (Preview)](https://github.com/Azure/azure-quickstart-templates/tree/master/oms-servicebus-solution)|
|Service Fabric||	 	Storage||	 [Service Fabric Analytics (Preview)](https://docs.microsoft.com/azure/log-analytics/log-analytics-service-fabric)|
|SQL (v12)|	Microsoft.Sql/<br>servers/<br>databases|| 	 	Diagnostics||
||Microsoft.Sql/<br>servers/<br>elasticPools||||
|Storage|||	 	 	Script|	[Azure Storage Analytics (Preview)](https://github.com/Azure/azure-quickstart-templates/tree/master/oms-azure-storage-analytics-solution)|
|Azure Virtual Machines|	Microsoft.Compute/<br>virtualMachines|	Extension|	Extension||
||||Diagnostics||
|Virtual machine scale sets|	Microsoft.Compute/<br>virtualMachines 	 ||Diagnostics||
||Microsoft.Compute/<br>virtualMachineScaleSets/<br>virtualMachines||||
|Web server farms|Microsoft.Web/<br>serverfarms|| 	Diagnostics
|Websites|	Microsoft.Web/<br>sites ||	 	Diagnostics|	[More information](https://github.com/Azure/azure-quickstart-templates/tree/master/101-webappazure-oms-monitoring)|
||Microsoft.Web/<br>sites/<br>slots||||


## Log Integration with on-premises SIEM systems

With Azure Log Integration you can integrate raw logs from your Azure resources with your on-premises SIEM system (Security information and event management system). AzLog downloads were disabled on Jun 27, 2018. For guidance on what to do moving forward review the post [Use Azure monitor to integrate with SIEM tools](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

![Log Integration diagram](./media/azure-log-audit/azure-log-audit-fig9.png)

Log Integration collects Azure diagnostics from your Windows virtual machines, Azure activity logs, Azure Security Center alerts, and Azure resource provider logs. This integration provides a unified dashboard for all your assets, whether they're on-premises or in the cloud, so that you can aggregate, correlate, analyze, and alert for security events.

Log Integration currently supports the integration of Azure activity logs, Windows event logs from Windows virtual machines with your Azure subscription, Azure Security Center alerts, Azure diagnostics logs, and Azure AD audit logs.

| Log type | Azure Monitor logs supporting JSON (Splunk, ArcSight, and IBM QRadar) |
| :------- | :-------------------------------------------------------- |
|Azure AD audit logs|	Yes|
|Activity logs|	Yes|
|Security Center alerts	|Yes|
|Diagnostics logs (resource logs)|	Yes|
|VM logs|	Yes, via forwarded events and not through JSON|

[Get started with Azure Log Integration](https://docs.microsoft.com/azure/security/security-azure-log-integration-get-started): This tutorial walks you through installing Azure Log Integration and integrating logs from Azure storage, Azure activity logs, Azure Security Center alerts, and Azure AD audit logs.

Integration scenarios for SIEM:

* [Partner configuration steps](https://blogs.msdn.microsoft.com/azuresecurity/2016/08/23/azure-log-siem-configuration-steps/): This blog post shows you how to configure Azure Log Integration to work with partner solutions Splunk, HP ArcSight, and IBM QRadar.

* [Azure Log Integration FAQ](https://docs.microsoft.com/azure/security/security-azure-log-integration-faq): This article answers questions about Azure Log Integration.

* [Integrating Security Center alerts with Azure Log Integration](https://docs.microsoft.com/azure/security-center/security-center-integrating-alerts-with-log-integration): This article discusses how to sync Security Center alerts, virtual machine security events collected by Azure diagnostics logs, and Azure audit logs with your Azure Monitor logs or SIEM solution.

## Next steps

- [Auditing and logging](https://docs.microsoft.com/azure/security/security-management-and-monitoring-overview): Protect data by maintaining visibility and responding quickly to timely security alerts.

- [Security logging and audit-log collection within Azure](https://azure.microsoft.com/resources/videos/security-logging-and-audit-log-collection/): Enforce these settings to ensure that your Azure instances are collecting the correct security and audit logs.

- [Configure audit settings for a site collection](https://support.office.com/article/Configure-audit-settings-for-a-site-collection-A9920C97-38C0-44F2-8BCB-4CF1E2AE22D2?ui=&rs=&ad=US): If you're a site collection administrator, retrieve the history of individual users' actions and the history of actions taken during a particular date range. 

- [Search the audit log in the Office 365 Security & Compliance Center](https://support.office.com/article/Search-the-audit-log-in-the-Office-365-Security-Compliance-Center-0d4d0f35-390b-4518-800e-0c7ec95e946c?ui=&rs=&ad=US): Use the Office 365 Security & Compliance Center to search the unified audit log and view user and administrator activity in your Office 365 organization.



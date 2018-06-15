---
title: Collecting monitoring data in Azure | Microsoft Docs
description: Overview of the data that's collected for complete monitoring of application and services in Azure.
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.service: monitoring
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/15/2018
ms.author: bwren

---

# Sources of monitoring data in Azure
Monitoring data in Azure comes from a variety of sources that can be organized into tiers, the highest tier being your application and the lowest tier being the Azure platform. This is illustrated in the following diagram with each tier described in detail in the following sections.

![Tiers of monitoring data](media/monitoring-data-sources/monitoring-tiers.png)


## Azure platform
This includes telemetry related to the health and operation of Azure itself in addition to data about the operation and management of your Azure subscription or tenant. It includes service health data from the Azure Activity log and audit logs from Azure Active Directory.

![Azure collection](media/monitoring-data-sources/azure-collection.png)

### Azure Service Health
[Azure Service Health](../monitoring-and-diagnostics/monitoring-service-notifications.md) provides information about the health of the Azure services in your subscription. You can create alerts to be notified of current and expected critical issues that may affect your application. Service Health records are stored in the [Azure Activity log](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md), so you can view them in the Activity Log Explorer and copy them into Log Analytics.

### Azure Activity log
The [Azure Activity Log](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md) includes service health records along with records on any configuration changes made to your Azure resources. The Activity log is available to all Azure resources and represent the _external_ view of the resource in Azure. You can view the activity log for a particular resource on its page in the Azure portal or view logs from multiple resources in the [Activity Log Explorer](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md). It's particularly useful to copy the logs to Log Analytics to combine it with other monitoring data.


### Azure Active Directory Audit logs
[Azure Active Directory reporting](../active-directory/active-directory-reporting-azure-portal.md) contains the history of sign-in activity and audit trail of changes made within a particular tenant. You can't currently combine Azure Active Directory audit data with with other monitoring data as it's accessible through Azure Active Directory and [Azure Active Directory reporting API](../active-directory/active-directory-reporting-api-getting-started-azure-portal.md).


## Azure services
This includes telemetry about the _internal_ operation of Azure resources. Metrics and diagnostic logs are available for most types of Azure resources, and management solutions provide additional insights into particular services.

![Azure resource collection](media/monitoring-data-sources/azure-resource-collection.png)


### Metrics
Most Azure services will generate metrics that reflect their performance and operation. The specific [metrics will vary for each type of resource](../monitoring-and-diagnostics/monitoring-supported-metrics.md).  They are accessible from the Metrics Explorer and can be copied to Log Analytics for trending and other analysis.


### Resource diagnostic Logs
While the Activity log provides information about operations performed on an Azure resources, resource level [Diagnostic logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md) provide insights into the operation within the resource itself.   The content of these logs varies by resource type. 

You can't directly view diagnostic logs in the Azure portal, but you can export them to [Event Hub](../event-hubs/event-hubs-what-is-event-hubs.md) for redirection to other services or to Log Analytics for analysis. The configuration requirements and content of these logs [varies by resource type](../monitoring-and-diagnostics/monitoring-diagnostic-logs-schema.md).  Some resources can write directly to Log Analytics while others write to a storage account before being [imported into Log Analytics](../log-analytics/log-analytics-azure-storage-iis-table.md#use-the-azure-portal-to-collect-logs-from-azure-storage).

### Management solutions
 [Management solutions](../monitoring/monitoring-solutions.md) collect data to provide additional insight into the operation of a particular service. They collect data into Log Analytics where it may be analyzed using the query language or views that are typically included in the solution.

## Guest operating system
In addition to the telemetry gathered for all Azure services, compute resources have a guest operating system to monitor. With the installation of one or more agents, you can gather telemetry from the guest into the same monitoring tools as the Azure services themselves.

![Azure compute resource collection](media/monitoring-data-sources/compute-resource-collection.png)

### Diagnostic Extension
With [Azure Diagnostics Extension](../monitoring-and-diagnostics/azure-diagnostics.md), you can collect logs and performance data from the client operating system of Azure compute resources. Both metrics and logs collected from clients are stored in an Azure storage account that you can [configure Log Analytics to import](../log-analytics/log-analytics-azure-storage-iis-table.md#use-the-azure-portal-to-collect-logs-from-azure-storage).  The Metrics Explorer understands how to read from  the storage account and will include client metrics with other collected metrics.


### Log Analytics agent
You can install the Log Analytics agent on any Windows or Linux virtual machine or physical computer. Agents can be running in Azure, another cloud, or on-premises.  The agent connects to Log Analytics either directly or through a connected Operations Manager management group and allows you to collect data from data sources that you configure or from management solutions that deploy rules to the agent.

#### Data sources
Log Analytics can be configured to collect different [data sources](../log-analytics/log-analytics-data-sources.md) for connected agents. In addition to performance counters and event logs, you can collect IIS logs and custom logs from the guest operating system and applications.

#### Management solutions
 Agents also run management solutions to provide additional insight into particular applications and services running on virtual machines. They collect data into Log Analytics where it may be analyzed using the query language or views that are typically included in the solution.

### Service Map
[Service Map](../operations-management-suite/operations-management-suite-service-map.md) installs a Dependency Agent on Windows and Linux virtual machines with the OMS agent that collects data about processes running on the virtual machine and dependencies on external processes. It stores this data in Log Analytics and includes a console that visually displays the data it collects in addition to other data stored in Log Analytics.

## Applications
In addition to telemetry that your application may write to the guest operating system, detailed application monitoring is done with Application Insights. Application Insights can collect data from applications running on a variety of platforms. The application can be running in Azure, another cloud, or on-premises.

![Application data collection](media/monitoring-data-sources/application-collection.png)


#### Application data
When you enable Application Insights for an application, it collects metrics and logs related to the performance and operation of the application. This includes detailed information about page views, application requests, and exceptions. Application Insights stores the data it collects in Azure Metrics and Log Analytics. It includes extensive tools for analyzing this data, but you can also analyze it with data from other sources using tools such as Metrics Explorer and log searches.

#### Custom metrics
You can also use Application Insights to [create a custom metric](../application-insights/app-insights-api-custom-events-metrics.md).  This allows you to define your own logic for calculating a numeric value and then storing that value with other metrics that can be accessed from the Metric Explorer and used for [Autoscale](../monitoring-and-diagnostics/monitoring-autoscale-scale-by-custom-metric.md) and Metric alerts.

## Next steps

- Learn more about the [types of monitoring data and the Azure tools](monitoring-data-collection.md) used to collect and analyze them.

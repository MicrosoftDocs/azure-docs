---
title: What is monitored by Azure Monitor
description: Reference of all services and other resources monitored by Azure Monitor.
ms.topic: conceptual
ms.custom: ignite-2022
author: rboucher
ms.author: robb
ms.date: 09/08/2022
ms.reviewer: robb
---

# What is monitored by Azure Monitor?

This article is a reference of the different applications and services that are monitored by Azure Monitor.

Azure Monitor data is collected and stored based on resource provider namespaces. Each resource in Azure has a unique ID. The resource provider namespace is part of all unique IDs. For example, a key vault resource ID would be similar to `/subscriptions/d03b04c7-d1d4-eeee-aaaa-87b6fcb38b38/resourceGroups/KeyVaults/providers/Microsoft.KeyVault/vaults/mysafekeys ` . *Microsoft.KeyVault* is the resource provider namespace. *Microsoft.KeyVault/vaults/* is the resource provider.

For a list of Azure resource provider namespaces, see [Resource providers for Azure services](../azure-resource-manager/management/azure-services-resource-providers.md).

For a list of resource providers that support Azure Monitor

- **Metrics** - See [Supported metrics in Azure Monitor](essentials/metrics-supported.md).
- **Metric alerts** - See [Supported resources for metric alerts in Azure Monitor](alerts/alerts-metric-near-real-time.md).
- **Prometheus metrics** - See [Prometheus metrics overview](essentials/prometheus-metrics-overview.md#enable).
- **Resource logs** - See [Supported categories for Azure Monitor resource logs](essentials/resource-logs-categories.md).
- **Activity log** - All entries in the activity log are available for query, alerting and routing to Azure Monitor Logs store regardless of resource provider.

## Services that require agents

Azure Monitor can't see inside a service running its own application, operating system or container.  That type of service requires one or more agents to be installed. The agent then runs as well to collect metrics, logs, traces and changes and forward them to Azure Monitor.   The following services require agents for this reason.

- [Azure Cloud Services](../cloud-services-extended-support/index.yml)
- [Azure Virtual Machines](../virtual-machines/index.yml)
- [Azure Virtual Machine Scale Sets](../virtual-machine-scale-sets/index.yml)  
- [Azure Service Fabric](../service-fabric/index.yml) 

In addition, applications also require either the Application Insights SDK or auto-instrumentation (via an agent) to collect information and write it to the Azure Monitor data platform.

## Services with Insights

Some services have curated monitoring experiences call "insights". Insights are meant to be a starting point for monitoring a service or set of services. Some insights may also automatically pull additional data that's not captured or stored in Azure Monitor. For more information on monitoring insights, see [Insights Overview](insights/insights-overview.md).

## Product integrations

The services and [older monitoring solutions](/previous-versions/azure/azure-monitor/insights/solutions) in the following table store their data in Azure Monitor Logs so that it can be analyzed with other log data collected by Azure Monitor.

| Product/Service | Description |
|:---|:---|
| [Azure Automation](../automation/index.yml) | Manage operating system updates and track changes on Windows and Linux computers. See [Change tracking](../automation/change-tracking/overview.md) and [Update management](../automation/update-management/overview.md). |
| [Azure Information Protection](/azure/information-protection/) | Classify and optionally protect documents and emails. See [Central reporting for Azure Information Protection](/azure/information-protection/reports-aip#configure-a-log-analytics-workspace-for-the-reports). |
| [Defender for the Cloud](../defender-for-cloud/defender-for-cloud-introduction.md) | Collect and analyze security events and perform threat analysis. See [Data collection in Defender for the Cloud](../defender-for-cloud/monitoring-components.md). |
| [Microsoft Sentinel](../sentinel/index.yml) | Connect to different sources including Office 365 and Amazon Web Services Cloud Trail. See [Connect data sources](../sentinel/connect-data-sources.md). |
| [Microsoft Intune](/intune/) | Create a diagnostic setting to send logs to Azure Monitor. See [Send log data to storage, Event Hubs, or log analytics in Intune (preview)](/intune/fundamentals/review-logs-using-azure-monitor).  |
| Network [Traffic Analytics](../network-watcher/traffic-analytics.md) | Analyze Network Watcher network security group flow logs to provide insights into traffic flow in your Azure cloud. |
| [System Center Operations Manager](/system-center/scom) | Collect data from Operations Manager agents by connecting their management group to Azure Monitor. See [Connect Operations Manager to Azure Monitor](agents/om-agents.md).<br> Assess the risk and health of your System Center Operations Manager management group with the [Operations Manager Assessment](insights/scom-assessment.md) solution. |
| [Microsoft Teams Rooms](/microsoftteams/room-systems/azure-monitor-deploy) | Integrated, end-to-end management of Microsoft Teams Rooms devices. |
| [Visual Studio App Center](/appcenter/) | Build, test, and distribute applications and then monitor their status and usage. See [Start analyzing your mobile app with App Center and Application Insights](https://github.com/Microsoft/appcenter). |
| Windows | [Windows Update Compliance](/windows/deployment/update/update-compliance-get-started) - Assess your Windows desktop upgrades.<br>[Desktop Analytics](/configmgr/desktop-analytics/overview) - Integrates with Configuration Manager to provide insight and intelligence to make more informed decisions about the update readiness of your Windows clients. |
| **The following solutions also integrate with parts of Azure Monitor. Note that solutions, which are based on Azure Monitor Logs and Log Analytics, are no longer under active development. Use [Insights](insights/insights-overview.md) instead.**  | |
| Network - [Network Performance Monitor solution](/previous-versions/azure/azure-monitor/insights/network-performance-monitor) |
| Network - [Azure Application Gateway solution](/previous-versions/azure/azure-monitor/insights/azure-networking-analytics#application-gateway-analytics) | 
| [Office 365 solution](/previous-versions/azure/azure-monitor/insights/solution-office-365) | Monitor your Office 365 environment. Updated version with improved onboarding available through Microsoft Sentinel. |
| [SQL Analytics solution](/previous-versions/azure/azure-monitor/insights/azure-sql) | Use SQL Insights instead. |
| [Surface Hub solution](/previous-versions/azure/azure-monitor/insights/surface-hubs) |  |

## Third-party integration

| Integration | Description |
|:---|:---|
| [ITSM](alerts/itsmc-overview.md) | The IT Service Management (ITSM) Connector allows you to connect Azure and a supported ITSM product/service.  |
| [Azure Monitor Partners](./partners.md) | A list of partners that integrate with Azure Monitor in some form. |
| [Azure Monitor Partner integrations](../partner-solutions/overview.md)| Specialized integrations between Azure Monitor and other non-Microsoft monitoring platforms if you've already built on them. Examples include Datadog and Elastic.|

## Resources outside of Azure

Azure Monitor can collect data from resources outside of Azure by using the methods listed in the following table.

| Resource | Method |
|:---|:---|
| Applications | Monitor web applications outside of Azure by using Application Insights. See [What is Application Insights?](./app/app-insights-overview.md). |
| Virtual machines | Use agents to collect data from the guest operating system of virtual machines in other cloud environments or on-premises. See [Overview of Azure Monitor agents](agents/agents-overview.md). |
| REST API Client | Separate APIs are available to write data to Azure Monitor Logs and Metrics from any REST API client. See [Send log data to Azure Monitor with the HTTP Data Collector API](logs/data-collector-api.md) for Logs. See [Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API](essentials/metrics-store-custom-rest-api.md) for Metrics. |

## Next steps

- Read more about the [Azure Monitor data platform that stores the logs and metrics collected by insights and solutions](data-platform.md).
- Complete a [tutorial on monitoring an Azure resource](essentials/tutorial-resource-logs.md).
- Complete a [tutorial on writing a log query to analyze data in Azure Monitor Logs](essentials/tutorial-resource-logs.md).
- Complete a [tutorial on creating a metrics chart to analyze data in Azure Monitor Metrics](essentials/tutorial-metrics.md).
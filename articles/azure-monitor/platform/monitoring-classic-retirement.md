---
title: Update of classic alerting & monitoring in Azure Monitor
description: Description of the retirement of classic monitoring services and functionality, earlier shown in Azure portal under Alerts (classic). 
author: yanivlavi
services: azure-monitor

ms.topic: conceptual
ms.date: 2/7/2019
ms.author: yalavi
ms.subservice: alerts
---
# Unified alerting & monitoring in Azure Monitor replaces classic alerting & monitoring

Azure Monitor has now become a unified full stack monitoring service, which now supports ‘One Metric’ and ‘One Alerts’ across resources; for more information, see our [blog post on new Azure Monitor](https://azure.microsoft.com/blog/new-full-stack-monitoring-capabilities-in-azure-monitor/).The new Azure monitoring and alerting platforms has been built to be faster, smarter, and extensible – keeping pace with the growing expanse of cloud computing and in-line with Microsoft Intelligent Cloud philosophy. 

With the new Azure monitoring and alerting platform in place, we will be retiring the "classic" monitoring and alerting platform  - hosted within *view classic alerts* section of Azure alerts, **will be deprecated by August 2019 in Azure public clouds**. [Azure Government cloud](../../azure-government/documentation-government-welcome.md) and [Azure China 21Vianet](https://docs.azure.cn/) will not be affected.

> [!NOTE]
> Due to delay in roll-out of migration tool, the retirement date for classic alerts migration has been [extended to August 31st, 2019](https://azure.microsoft.com/updates/azure-monitor-classic-alerts-retirement-date-extended-to-august-31st-2019/) from the originally announced date of June 30th, 2019.

 ![Classic alert in Azure portal](media/monitoring-classic-retirement/monitor-alert-screen2.png) 

We encourage you to get started and recreate your alerts in the new platform. For customers who have a large number of alerts, we are [rolling out in phases](alerts-understand-migration.md#rollout-phases), a [voluntary migration tool](alerts-using-migration-tool.md) to move existing classic alerts to the new alerts system without disruption or added costs.

> [!IMPORTANT]
> Classic Alert rules created on Activity Log will not be deprecated or migrated. All classic alert rules created on Activity Log can be accessed and used as-is from the new Azure Monitor - Alerts. For more information, see [Create, view, and manage activity log alerts using Azure Monitor](../../azure-monitor/platform/alerts-activity-log.md). Similarly, Alerts on Service Health can be accessed and used as-is from the new Service Health section. For details, see [alerts on service health notifications](../../azure-monitor/platform/alerts-activity-log-service-notifications.md).

## Unified Metrics and Alerts in Application Insights

Azure Monitor’s newer metric platform will now power monitoring coming from Application Insights. This move means Application Insights will hook to Action Groups, allowing far more options than just the previous email and webhook calls. Alerts can now trigger Voice Calls, Azure Functions, Logic Apps, SMS, and ITSM Tools like ServiceNow and Automation Runbooks. With near real-time monitoring and alerting, the new platform enables Application Insights users to leverage the same technology powering monitoring across other Azure resources and underpinning monitoring of Microsoft products.

The new unified Monitoring and Alerting for Application Insights will encompass:

- **Application Insights Platform metrics** – which provides popular prebuilt metrics from Application Insights product. For more information, see this article on using [Platform Metrics for Application Insights on new Azure Monitor](../../azure-monitor/app/pre-aggregated-metrics-log-metrics.md#pre-aggregated-metrics).
- **Application Insights Availability and Web test** -which provides you the ability to assess the responsiveness and availability of your web app or server. For more information, see this article on using [Availability Tests and Alerts for Application Insights on new Azure Monitor](../../azure-monitor/app/monitor-web-app-availability.md).
- **Application Insights Custom metrics** – which lets you define and emit their own metrics for monitoring and alerts. For more information, see this article on using [Custom Metric for Application Insights on new Azure Monitor](../../azure-monitor/app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation).
- **Application Insights Failure Anomalies (part of Smart Detection)** – which automatically notifies you in near real time if your web app experiences an abnormal rise in the rate of failed HTTP requests or dependency calls. For more information, see this article on using [Smart Detection - Failure Anomalies](https://docs.microsoft.com/azure/azure-monitor/app/proactive-failure-diagnostics).

## Unified Metrics and Alerts for other Azure resources

Since March 2018, the next generation of alerting and multi-dimensional monitoring for Azure resources have been in availability. Now the newer metric platform and alerting is faster with near-real time capabilities. More importantly, the newer metric platform alerts provide more granularity, as the newer platform includes the option of dimensions, which allow you to slice and filter to specific value combination, condition, or operation. Like all alerts in the new Azure Monitor, the newer metric alerts are more extensible with the use of ActionGroups – allowing notifications to expand beyond email or webhook to SMS, Voice, Azure Function, Automation Runbook and more. For more information, see [Create, view, and manage metric alerts using Azure Monitor](../../azure-monitor/platform/alerts-metric.md).
Newer metrics for Azure resources are available as:

- **Azure Monitor Standard platform metrics** – which provides popular pre-populated metrics from various Azure services and products. For more information, see this article on [Supported metrics on Azure Monitor](../../azure-monitor/platform/alerts-metric-near-real-time.md#metrics-and-dimensions-supported) and [Support metric alerts on Azure Monitor](../../azure-monitor/platform/alerts-metric-overview.md#supported-resource-types-for-metric-alerts).
- **Azure Monitor Custom metrics** – which provides metrics from user driven sources including the Azure Diagnostics agent. For more information, see this article on [Custom metrics in Azure Monitor](../../azure-monitor/platform/metrics-custom-overview.md). Using custom metrics, you can also publish metrics collected by [Windows Azure Diagnostics agent](../../azure-monitor/platform/collect-custom-metrics-guestos-resource-manager-vm.md) and [InfluxData Telegraf agent](../../azure-monitor/platform/collect-custom-metrics-linux-telegraf.md).

## Retirement of Classic monitoring and alerting platform

As stated earlier, the classic monitoring and alerting platform currently usable from the [Alerts (classic) section](../../azure-monitor/platform/alerts-classic.overview.md) of Azure portal will be retired in coming months given they have been replaced by the newer system.
Older classic monitoring and alerting will be retired on 31 August 2019; including the closure of related APIs, Azure portal interface, and Services in it. Specifically, these features will be deprecated:

- Older (classic) metrics and alerts for Azure resources as currently available via [Alerts (classic) section](../../azure-monitor/platform/alerts-classic.overview.md) of Azure portal; accessible as [microsoft.insights/alertrules](https://docs.microsoft.com/rest/api/monitor/alertrules) resource
- Older (classic) platform and custom metrics for Application Insights as well as alerting on them as currently available via [Alerts (classic) section](../../azure-monitor/platform/alerts-classic.overview.md) of Azure portal and accessible as [microsoft.insights/alertrules](https://docs.microsoft.com/rest/api/monitor/alertrules) resource
- Older (classic) Failure Anomalies alert currently available as [Smart Detection inside Application Insights](../../azure-monitor/app/proactive-diagnostics.md) in the Azure portal; with alerts configured shown in [Alerts (classic) section](../../azure-monitor/platform/alerts-classic.overview.md) of Azure portal

All classic monitoring and alerting systems including corresponding [API](https://msdn.microsoft.com/library/azure/dn931945.aspx), [PowerShell](../../azure-monitor/platform/alerts-classic-portal.md), [CLI](../../azure-monitor/platform/alerts-classic-portal.md), [Azure portal page](../../azure-monitor/platform/alerts-classic-portal.md), and [Resource Template](../../azure-monitor/platform/alerts-enable-template.md) will remain usable until end of August 2019. 

At the end of August 2019, in Azure Monitor:

- Classic monitoring and alerts service will be retired and no longer available for creation of new alert rules.
- Any alert rules that continue to exist in Alerts (classic) beyond August 2019 will continue to execute and fire notifications, but not be available for modification.
- Starting September 2019, alert rules in classic monitoring & alerting which can be migrated, will be automatically moved by Microsoft to their equivalent in the new Azure monitor platform in phases spanning few weeks. The process will be seamless without any downtime and customers will have no loss in monitoring coverage.
- Alert rules migrated to the new alerts platform will provide monitoring coverage as before but will fire notification with new payloads. Any email address, webhook endpoint, or logic app link associated with classic alert rule will be carried forward when migrated, but may not behave correctly as alert payload will be different in the new platform.
- Some [classic alert rules that cannot be automatically migrated](alerts-understand-migration.md#classic-alert-rules-that-will-not-be-migrated) and require manual action from users will continue to run until June 2020.

> [!IMPORTANT]
> Microsoft Azure Monitor has rolled out in phases [tool to voluntarily migrate](alerts-using-migration-tool.md) their classic alert rules on to the new platform soon. And run it by force for all classic alert rules that still exist and can be migrated, starting September 2019. Customers will need to ensure automation consuming classic alert rule payload is adapted to handle the new payload from [Unified Metrics and Alerts in Application Insights](#unified-metrics-and-alerts-in-application-insights) or [Unified Metrics and Alerts for other Azure resources](#unified-metrics-and-alerts-for-other-azure-resources), post-migration of the classic alert rules. For more information, see [prepare for classic alert rule migration](alerts-prepare-migration.md)

This article will be continually updated with links & details regarding the new Azure monitoring & alerting functionality, as well as the availability of tools to assist users in adopting the new Azure Monitor platform.

## Pricing for Migrated Alert Rules

We are rolling out a migration tool to help you migrate your Azure Monitor [classic alerts](../../azure-monitor/platform/alerts-classic.overview.md) to the new alerts experience. The migrated alert rules and corresponding migrated action groups (email, webhook, or LogicApp) will remain free of charge. The functionality you had with classic alerts including the ability to edit the threshold, aggregation type, and the aggregation granularity will continue to be available for free with your migrated alert rule. However, if you edit the migrated alert rule to use any of the new alert platform features, notifications or action types, a corresponding charge will apply. For more information on the pricing for alert rules and notifications, see [Azure Monitor Pricing](https://azure.microsoft.com/pricing/details/monitor/).

The following are examples of cases where you will incur a charge for your alert rule:

- Any new (non-migrated) alert rule created beyond free units, on the new Azure Monitor platform
- Any data ingested and retained beyond free units included by Azure Monitor
- Any multi-test web tests executed by Application Insights
- Any custom metrics stored beyond free units included in Azure Monitor
- Any migrated alert rules that are edited to use newer metric alert features like frequency, multiple resources/dimensions, [Dynamic Thresholds](alerts-dynamic-thresholds.md), changing resource/signal, and so on.
- Any migrated action groups that are edited to use newer notifications, or action types like SMS, Voice Call and/or ITSM integration.

## Next steps

* Learn about the [new unified Azure Monitor](../../azure-monitor/overview.md).
* Learn more about the new [Azure Alerts](../../azure-monitor/platform/alerts-overview.md).

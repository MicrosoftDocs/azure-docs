---
title: Unified alerting & monitoring in Azure Monitor replaces classic alerting & monitoring
description: Overview of retirement of classic monitoring services and functionality, earlier shown in Azure portal under Alerts (classic). Classic alerting & monitoring includes classic metric alerts for Azure resources, classic metric alerts for Application Insights, classic webtest alerts for Application Insights, classic custom metric based alerts for Application Insights and classic alerts for Application Insights SmartDetection v1
author: msvijayn
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 10/04/2018
ms.author: vinagara
ms.component: alerts
---
# Unified alerting & monitoring in Azure Monitor replaces classic alerting & monitoring

Azure Monitor has now become am unified full stack monitoring service which now supports ‘One Metrics’ and ‘One Alerts’ across resources; for more information, see our [blog post on new Azure Monitor](https://azure.microsoft.com/blog/new-full-stack-monitoring-capabilities-in-azure-monitor/).The new Azure monitoring and alerting platforms has been built to be faster, smarter, and extensible – keeping pace with the growing expanse of cloud computing and in-line with Microsoft Intelligent Cloud philosophy. 

With the new Azure monitoring and alerting platform in place, we will be retiring the "classic" monitoring and alerting platform  - hosted within *view classic alerts* section of Azure alerts, will be deprecated by June 2019.

 ![Classic alert in Azure portal](./media/monitoring-overview-alerts-classic/monitor-alert-screen2.png) 

We encourage you to get started and recreate your alerts in the new platform. For customers who have a large number of alerts, we are working to provide an automated way to move existing classic alerts to the new alerts system without disruption or added costs.

## Unified Metrics and Alerts in Application Insights

Azure Monitor’s newer metric platform will now power monitoring coming from Application Insights. This move means Application Insights will hook to Action Groups, allowing far more options than just the previous email and webhook calls. Alerts can now trigger Voice Calls, Azure Functions, Logic Apps, SMS, and ITSM Tools like ServiceNow and Automation Runbooks. With near real-time monitoring and alerting, the new platform enables Application Insights users to leverage the same technology powering monitoring across other Azure resources and underpinning monitoring of Microsoft products.

The new unified Monitoring and Alerting for Application Insights will encompass:

- **Application Insights Platform metrics** – which provides popular prebuilt metrics from Application Insights product. For more information, see this article on using [Platform Metrics for Application Insights on new Azure Monitor](../application-insights/pre-aggregated-metrics-log-metrics.md#pre-aggregated-metrics).
- **Application Insights Availability and Web test** -which provides you the ability to assess the responsiveness and availability of your web app or server. For more information, see this article on using [Availability Tests and Alerts for Application Insights on new Azure Monitor](../application-insights/app-insights-monitor-web-app-availability.md).
- **Application Insights Custom metrics** – which lets you define and emit their own metrics for monitoring and alerts. For more information, see this article on using [Custom Metric for Application Insights on new Azure Monitor](../application-insights/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation).
- **Application Insights Failure Anomalies (part of Smart Detection)** – which automatically notifies you in near real time if your web app experiences an abnormal rise in the rate of failed HTTP requests or dependency calls. Application Insights Failure Anomalies (part of Smart Detection) as part of new Azure Monitor, will be available soon and we will update this doc with links on the next iteration as it is rolled-out in the coming months.

## Unified Metrics & Alerts for other Azure resources

Since March 2018, the next generation of alerting and multi-dimensional monitoring for Azure resources have been in availability. Now the newer metric platform and alerting is faster with near-real time capabilities. More importantly, the newer metric platform alerts provide more granularity, as the newer platform includes the option of dimensions, which allow you to slice and filter to specific value combination, condition, or operation. Like all alerts in the new Azure Monitor, the newer metric alerts are more extensible with the use of ActionGroups – allowing notifications to expand beyond email or webhook to SMS, Voice, Azure Function, Automation Runbook and more.
Newer metrics for Azure resources are available as:

- **Azure Monitor Standard platform metrics** – which provides popular pre-populated metrics from various Azure services and products. For more information, see this article on [Supported metrics on Azure Monitor](monitoring-near-real-time-metric-alerts.md#metrics-and-dimensions-supported) and [Support metric alerts on Azure Monitor](alert-metric-overview.md#supported-resource-types-for-metric-alerts).
- **Azure Monitor Custom metrics** – which provides metrics from user driven sources including the Azure Diagnostics agent. For more information, see this article on [Custom metrics in Azure Monitor](metrics-custom-overview.md). Using custom metrics, you can also publish metrics collected by [Windows Azure Diagnostics agent](metrics-store-custom-guestos-resource-manager-vm.md) and [InfluxData Telegraf agent](metrics-store-custom-linux-telegraf.md).

## Retirement of Classic monitoring and alerting platform

As stated earlier, the classic monitoring and alerting platform currently usable from the [Alerts (classic) section](monitoring-overview-alerts-classic.md) of Azure portal will be retired in coming months given they have been replaced by the newer system.
Older classic monitoring and alerting will be retired on 30 June 2019; including the closure of related APIs, Azure portal interface, and Services in it. Specifically, these features will be deprecated:

- Older (classic) metrics and alerts for Azure resources as currently available via [Alerts (classic) section](monitoring-overview-alerts-classic.md) of Azure portal; accessible as [microsoft.insights/alertrules](https://docs.microsoft.com/en-us/rest/api/monitor/alertrules) resource
- Older (classic) platform and custom metrics for Application Insights as well as alerting on them as currently available via [Alerts (classic) section](monitoring-overview-alerts-classic.md) of Azure portal and accessible as [microsoft.insights/alertrules](https://docs.microsoft.com/en-us/rest/api/monitor/alertrules) resource
- Older (classic) Failure Anomalies alert currently available as [Smart Detection inside Application Insights](../application-insights/app-insights-proactive-diagnostics.md) in the Azure portal; with alerts configured shown in [Alerts (classic) section](monitoring-overview-alerts-classic.md) of Azure portal

All classic monitoring and alerting systems including corresponding [API](https://msdn.microsoft.com/library/azure/dn931945.aspx), [PowerShell](insights-alerts-powershell.md), [CLI](insights-alerts-command-line-interface.md), [Azure portal page, and [Resource Template](monitoring-enable-alerts-using-template.md) will remain usable until June 2019. After this date, classic monitoring and alerts service will be retired and no longer available for use; while any alert rules that continue to exist in Alerts (classic) beyond June 2019 will continue to execute, but not be available for modification.

Any alerts remaining in classic monitoring & alerting platform beyond June 2019, will be automatically migrated by Microsoft to their equivalent in the new Azure monitor platform in July 2019. The process will be seamless without any downtime and ensure customers have no loss in monitoring coverage.

We will soon provide tools to allow you to voluntarily migrate your alerts from [Alerts (classic) section](monitoring-overview-alerts-classic.md) of Azure portal to the new Azure alerts. All rules configured in Alerts (classic) that are migrated to new Azure Monitor will remain free and not be charged. Migrated classic alert rules will also not bear any charge for pushing notifications via email, webhook, or LogicApp. However, use of the newer notification or action types (such as SMS, Voice Call, ITSM integration, etc.) will be chargeable whether added to a migrated or new alert. For more information, see [Azure Monitor Pricing](https://azure.microsoft.com/pricing/details/monitor/).

Additionally, the following will be chargeable under the ambit of [Azure Monitor Pricing](https://azure.microsoft.com/pricing/details/monitor/):

- Any new (non-migrated) alert rule created beyond free units, on the new Azure Monitor platform
- Any data ingested and retained beyond free units included by Azure Monitor
- Any multi-test web tests executed by Application Insights
- Any custom metrics stored beyond free units included in Azure Monitor

This article will be continually updated will links & details regarding the new Azure monitoring & alerting functionality, as well as the availability of tools to assist users in adopting the new Azure Monitor platform.


## Next steps

* Learn about the [new unified Azure Monitor](../azure-monitor/overview.md).
* Learn more about the new [Azure Alerts](monitoring-overview-unified-alerts.md).

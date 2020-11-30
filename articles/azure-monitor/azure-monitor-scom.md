---
title: Azure Monitor for existing Operations Manager customers
description: Guidance for existing users of Operations Manager to transition monitoring of certain workloads to Azure Monitor as part of a transition to the cloud.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/10/2020

---

# Azure Monitor for existing Operations Manager customers
Many customers use System Center Operations Manager for monitoring their on-premises applications. As you move your applications into Azure, you may be wondering whether to migrate to Azure Monitor, continue using Operations Manager, or use a combination of both. This article provides guidance on which workloads in your environment are best monitored with each product.

Using both products does add the complexity of using multiple monitoring tools, but it takes advantage of Azure Monitor's ability to monitor next generation workloads while retaining Operations Manager's ability to monitor IaaS workloads. This is a strategy that most customers will use in their transition to the cloud and is described in [Hybrid cloud monitoring](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview#hybrid-cloud-monitoring). 

This article assumes that your ultimate goal is a full transition into the cloud, replacing as much Operations Manager functionality as possible with Azure Monitor, as long as it meets your business requirements. There is a cost to implementing several features described here, so you should evaluate their value before implementing across your entire environment. The specific recommendations made in this article may change as Azure Monitor and Operations Manager add features. The fundamental strategy though will remain consistent.

## Quick comparison
For a complete comparison between Azure Monitor and Operations Manager, see [Cloud monitoring guide: Monitoring platforms overview](/azure/cloud-adoption-framework/manage/monitor/platform-overview). That article describes specific feature differences between to the two to help you understand some of the recommendations made here. 

**Azure Monitor** is a SaaS offering with minimal infrastructure and configuration requirements. You pay only for the features you use and data you collect. While Azure Monitor runs completely in the Azure cloud, it can monitor applications and virtual machines in other clouds and on-premises. Azure Monitor doesn't allow granular control over monitoring, and most features require little or no configuration. 

**Operations Manager** was primarily designed to monitor virtual machines, but it can gather data from external resources including those in Azure. It has significant infrastructure and maintenance requirements, and it provides very granular control over monitoring. Operations Manager has an extensive library of management packs with predefined logic for a variety of applications, and many customers have invested in custom management packs for their own applications.

## Workloads to monitor
Each of the applications and services that requires monitoring is considered a workload. The following diagram illustrates the different types of workloads that need to be monitored and high level recommendations for what to move to Azure Monitor as opposed to those that should continue to be monitored by management packs in Azure Monitor. The rest of the article describes these recommendations in more details.

![Workload summary](media/azure-monitor-scom/workloads.png)



## Monitor Azure services (PaaS)
Azure resources actually require Azure Monitor to collect telemetry, and it's enabled the moment that you create an Azure subscription. The [Activity log](platform/activity-log.md) is automatically collected for the subscription, and [platform metrics](platform/data-platform-metrics.md) are automatically collected from any Azure resources you create. Add a [diagnostic setting](platform/diagnostic-settings.md) for each resource to send [resource logs](platform/resource-logs.md) to a Log Analytics workspace.

[Insights](monitor-reference.md) analyze and present this data to provide a customized experience for different services, similar to the function of a management pack in Operations Manager. The typically don't have the granularity of a management pack, but they require minimal configuration and maintenance. Azure Monitor also includes tools to perform interactive analysis and trending of telemetry collected from Azure resources. Use [Metrics explorer](platform/metrics-getting-started.md) to analyze platform metrics and [Log Analytics](log-query/log-analytics-overview.md) to analyze log and performance data. 

Operations Manager can discover Azure resources and monitor their health based on platform metric values it collects from Azure Monitor using the [Azure management pack](https://www.microsoft.com/download/details.aspx?id=50013). You can set a threshold for each resource to determine a health state and create alerts. This is a limited view of each resource though since it doesn't include resource logs and isn't able to perform detailed analysis beyond a limited set of performance counters.

### Recommendations
**Configure Azure Monitor for Azure resources.** Azure Monitor collects telemetry and provides specialized monitoring for Azure resources that Operations Manager doesn't provide. Start by using [metrics explorer]() to analyze platform metrics that are automatically collected for your Azure resources. Look at [Insights](monitor-reference.md) that are available for the Azure services that you use since they'll provide monitoring with minimal configuration. [Create diagnostic settings](platform/diagnostic-settings.md) to send resource logs and platform metrics for critical resources to a Log Analytics workspace where you can interactively analyze them with [log queries]() and visualize them with [workbooks](). Consider using [Azure Policy](deploy-scale.md) to automatically configure new resources as they're created. 

**Optionally use Azure management pack to see Azure resources in the Operations Console.** If you want to integrate alerting for critical Azure services into your Operations Manager environment, then install and configure the Azure management pack. This will be limited to simple thresholds based on metric data, but it will at least allow you to view your Azure resources in the Operations Console. You'll most likely still refer to Azure Monitor for other details about these resources.


## Monitor virtual machines (IaaS)
[Azure Monitor for VMs]() collects performance data from the guest operating system of virtual machines in addition to relationships between virtual machines and their external dependencies. You can also [configure additional logs and metrics to be collected]() which is some of the same data used by management packs. There aren't preexisting rules though to identify and alert on issues in the virtual machine. You must create your own alert rules to be proactively notified of any detected issues. 

A new [guest health feature for Azure Monitor for VMs]() is now in public preview and does alert based on the health state of a set of performance metrics. This is currently limited though to a specific set of performance counters related to the guest operating system and not applications or other workloads running in the virtual machine.

Operations Manager was designed for workloads running on virtual machines, and an extensive collection of management packs is available to monitor various applications. Each includes predefined logic to discover different components of the application, measure their health, and generate alerts when issues are detected. You may have also have considerable investment in tuning existing management packs and even developing your own to your specific requirements and in developing custom management packs for any custom requirements.

### Recommendations

**Continue using management packs for IaaS workloads.** Keep using management packs the monitor your IaaS workloads since Azure Monitor cannot yet collect the same data and doesn't include the rich set of alerting rules. Management packs also measure the and alert on the health of workloads which is  currently in limited preview for Azure Monitor.

**Configure Azure Monitor for VMs.** Configure Azure Monitor for VMs to gain additional monitoring and to start an eventual transition to Azure Monitor. Even though you may keep using management packs for monitoring packaged IaaS workloads, Azure Monitor for VMs provides additional features that will enhance your monitoring in Operations Manager including the following:

- View aggregated performance data across multiple virtual machines in interactive charts and workbooks.
- Use [log queries]() to interactively analyze collected performance data, and event data if you configure it.
- Create [log alert rules]() based on complex logic across multiple virtual machines.
- Discover relationships between agents and dependencies on external resources and allows you to work with them in a graphical tool. 
- Use the new guest health feature (preview) to view and alert on the health of a virtual machine based on a set of performance counters.

**Remove select virtual machines from Operations Manager.** Azure Monitor may be sufficient to monitor some of your virtual machines that don't require detailed workload monitoring. For example, you can create a [log query alert rule]() that will notify you if any virtual machines miss a heartbeat or exceed a performance threshold. If this level of monitoring is sufficient, then remove those agents from your Operations Manager management group and allow them to be monitored with Azure Monitor. Continue to perform this evaluation as features are added to Azure Monitor.

**Create policy to enable Azure Monitor for VMs.** Once you've determined the virtual machines that you'll monitor with both management packs and Azure Monitor for VMs, [create an Azure Policy](../deploy-scale.md#azure-monitor-for-vms) to deploy the agent to existing and new virtual machines. 

## Monitor applications (IaaS and PaaS)
You typically require custom management packs to monitor applications in your IaaS environment, leveraging agents installed on each virtual machine. Application Insights in Azure Monitor monitors any web based application regardless of its environment, so you can use it for your applications hosted on either IaaS or PaaS. Application Insights provides the following benefits over custom management packs:

- Automatically discover and monitor all components of the application.
- Collect detailed application usage and performance data such as response time, failure rates, and request rates.
- Collect browser data such as page views and load performance.
- Detect exceptions and drill into stack trace and related requests.
- Use [log queries]() to interactively analyze collected telemetry together with data collected for Azure services and Azure Monitor for VMs.
- Use [metrics explorer]() to interactively analyze performance data using a graphical interface.

### Recommendations

**Configure Application Insights for each application.** Replace custom management packs for each of your applications with Application Insights. Use codeless monitoring for an easier implementation with no changes to your application code or use code-based monitoring for additional features. 

**Create availability tests for public applications.** Create [availability tests](app/monitor-web-app-availability.md) to monitor and alert on the availability and responsiveness of your public applications. Continue to use [Web Application Availability Monitors](/system-center/scom/web-application-availability-monitoring-template) in Operations Manager to monitor internal applications. 


## Next steps

- See the [Cloud Monitoring Guide](/azure/cloud-adoption-framework/manage/monitor/) for a detailed comparison of Azure Monitor and System Center Operations Manager and more details on designing and implementing a hybrid monitoring environment.
- Read more about [monitoring Azure resources in Azure Monitor](insights/monitor-azure-resource.md).
- Read more about [monitoring Azure virtual machines in Azure Monitor](insights/monitor-vm-azure.md).
- Read more about [Azure Monitor for VMs](insights/vminsights-overview.md).
- Read more about [Application Insights](app/app-insights-overview.md).
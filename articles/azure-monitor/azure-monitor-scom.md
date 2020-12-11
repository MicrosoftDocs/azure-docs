---
title: Azure Monitor for existing Operations Manager customers
description: Guidance for existing users of Operations Manager to transition monitoring of certain workloads to Azure Monitor as part of a transition to the cloud.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/02/2020

---

# Azure Monitor for existing Operations Manager customers
This article provides recommendations for customers who currently use [Operations Manager]() and are considering a transition to [Azure Monitor](overview.md) as they migrate business applications and other resources into Azure. 

The [Cloud Monitoring Guide](https://docs.microsoft.com/azure/cloud-adoption-framework/manage/monitor/) recommends a [Hybrid cloud monitoring](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview#hybrid-cloud-monitoring) strategy that allows you to make a gradual transition to the cloud, using each platform to monitor a different set of workloads in your environment. Using multiple monitoring tools does add complexity, but it allows you to take advantage of Azure Monitor's ability to monitor next generation cloud workloads while retaining Operations Manager's ability to monitor server software and infrastructure components that may be on-premises or in other clouds. 

This article provides guidance on which workloads in your environment are best monitored by each platform. It assumes that your ultimate goal is a full transition into the cloud, replacing as much Operations Manager functionality as possible with Azure Monitor, without compromising your business and IT operational requirements. There is a cost to implementing several features described here, so you should evaluate their value before deploying across your entire environment. 

The specific recommendations made in this article will change as Azure Monitor and Operations Manager add features. The fundamental strategy though will remain consistent.

## Prerequisites
This article assume that you already use [Operations Manager](https://docs.microsoft.com/system-center/scom) and at least have a basic understanding of [Azure Monitor](). For a complete comparison between the two, see [Cloud monitoring guide: Monitoring platforms overview](/azure/cloud-adoption-framework/manage/monitor/platform-overview). That article details specific feature differences between to the two to help you understand some of the recommendations made here. 

## Components to monitor
It helps to categorize the different types of workloads that you need to monitor in order to determine a distinct monitoring strategy for each. While every workload in your environment may not fit neatly into one of these categories, each should be close enough to a particular category for the general recommendations to apply.

Following is a description of the different kinds of monitoring workloads described in this article: 

**Business applications.** Applications that provide functionality specific to your business. They may be internal or external and are often developed internally using custom code. Your legacy applications will typically be hosted on virtual or physical machines running either Windows or Linux, while your newer applications will be based on application services in Azure such as Azure Web Apps and Azure Functions.

**Azure services.** Resources in Azure that support your business applications that have migrated to the cloud. This includes services such as Azure Storage, Azure SQL, and Azure IoT. This also includes Azure virtual machines since they are monitored like other Azure services, but the applications and software running on the guest operating system of those virtual machines require additional monitoring beyond the host.

**Server software.** Software running on virtual and physical machines that support your business applications or packaged applications that provide general functionality to your business. Examples include Internet Information Server (IIS), SQL Server, Exchange, and SharePoint. This is also includes the Windows or Linux operating system on your virtual and physical machines.

**On-premises infrastructure.** Components specific to your on-premises environment that require monitoring. This includes such resources as bare metal servers and network components.

## General strategy
Following is a hypothetical walk through a basic migration from Operations Manager to Azure Monitor. This is not intended to represent the full complexity of an actual environment, but it does at least provide the basic steps involved in an actual migration.

Your environment prior to moving any components into Azure is based on virtual and physical machines located on-premises. You rely on Operations Manager to monitor your business applications, server software, and other infrastructure components in your environment such as bare metal servers and networks. You use standard management packs for server software such as IIS, SQL Server, and SharePoint and tune those management packs for your specific requirements. You create custom management packs for your business applications and other components in your environment that don't have existing management packs. You also develop business processes to manage alerts generated by these management packs.

As you start to create resources in Azure to support your business applications migrating into the cloud, you start to use Azure Monitor which is enabled as soon as you create an Azure subscription. It automatically collects telemetry for any Azure resources you create, and you  enable additional features and data collection with minimal configuration. 

Your first step in migrating applications into Azure is to move virtual machines into the cloud with minimal changes to the applications themselves. The monitoring requirements for these applications and the server software they depend on don't change, and you continue continue using Operations Manager on these servers. You also enable Azure Monitor for VMs on them to take advantage of its additional features and to analyze telemetry across your entire environment together using a common set of cloud tools.

You extend your use of Azure Monitor to your on-premises physical and virtual machines by enabling Azure Arc enabled servers on them and then Azure Monitor for VMs. You use Azure Monitor to interactively analyze data collected across your machines and the software they host. As you become more familiar with trends in the data, you create log alert rules to proactively identify issues.

You enable Application Insights for each of your business applications. It identifies the different components of each application, begins to collect usage and performance data, and identifies any errors that occur in the code. You create availability tests in Application Insights to proactively test your external applications and alert you to any performance or availability problems. You continue to use Web Application Availability Monitors in Operations Manager to proactively monitor your internal applications.

As you evolve your operations around Azure Monitor, you start to remove machines from the Operations Manager management group. You continue to use management packs for critical server software and on-premises infrastructure but continue to watch for new features in Azure Monitor that will allow you to retire functionality.

## Monitor Azure services
Azure services actually require Azure Monitor to collect telemetry, and it's enabled the moment that you create an Azure subscription. The [Activity log](platform/activity-log.md) is automatically collected for the subscription, and [platform metrics](platform/data-platform-metrics.md) are automatically collected from any Azure resources you create. You can immediately start using [metrics explorer](platform/metrics-getting-started.md) which is similar to performance views in the Operations console, but it provides interactive analysis and advanced aggregations of data.

[Create a diagnostic setting](platform/diagnostic-settings.md) for each resource to send metrics and [resource logs](platform/resource-logs.md), which provide details about the internal operation of each resource, to a Log Analytics workspace. This allows you to use [Log Analytics](log-query/log-analytics-overview.md) to interactively analyze log and performance data using an advanced query language that has no equivalent in Operations Manager. 

Similar to reports in Operations Manager, [workbooks](platform/workbooks-overview.md) in Azure Monitor provide a flexible canvas for data analysis and the creation of rich visual reports in the Azure portal. They allow you to combine metrics and log queries into interactive reports. You can take advantage of existing workbooks that are included in [Insights](monitor-reference.md), which provide similar functionality as a management pack in Operations Manager for particular Azure services. Create your own workbooks to combine data from multiple services.

### Azure management pack
The [Azure management pack](https://www.microsoft.com/download/details.aspx?id=50013) allows Operations Manager to discover Azure resources and monitor their health. You can set a threshold for each resource to determine a health state and create alerts. This is a limited view though based on platform metric values that are sent to Azure Storage and collected through the Azure API from the management pack. It doesn't include other telemetry such as resource logs, and it doesn't provide the additional analysis of insights and other tools in Azure Monitor.

 You may choose to use the Azure Management pack if you want visibility for certain Azure resources in the Operations console and to integrate some basic alerting with your existing processes. You should look to Azure Monitor though for complete monitoring of your Azure resources. 


## Monitor server software and on-premises infrastructure
[Azure Monitor for VMs](insights/vminsights-overview.md) is the primary tool used in Azure Monitor to monitor virtual machines and their guest operating system and workloads. In addition to Azure virtual machines, this includes machines on-premises and in other clouds using [Azure Arc enabled servers](../azure-arc/servers/overview.md). Arc enabled servers allows you to manage your Windows and Linux machines hosted outside of Azure, on your corporate network, or other cloud provider consistent with how you manage native Azure virtual machines.

Like management packs in Operations Manager, Azure Monitor for VMs uses an agent to collect performance data from the guest operating system of virtual machines. You can also [configure additional logs and metrics to be collected](platform/agent-data-sources.md), which is the same data used by management packs. There aren't preexisting rules though to identify and alert on issues for the business applications and server software running in those machines. You must create your own alert rules to be proactively notified of any detected issues.

> [!NOTE]
> A new [guest health feature for Azure Monitor for VMs](insights/vminsights-health-overview.md) is now in public preview and does alert based on the health state of a set of performance metrics. This is currently limited though to a specific set of performance counters related to the guest operating system and not applications or other workloads running in the virtual machine.

Azure Monitor for VMs does provide multiple features more suited to a scalable cloud environment including the following:

- Discover and monitor relationships between virtual machines and their external dependencies.
- View aggregated performance data across multiple virtual machines in interactive charts and workbooks.
- Use [log queries](log-query/log-query-overview.md) to interactively analyze telemetry from your virtual machines.
- Create [log alert rules](platform/alerts-log-query.md) based on complex logic across multiple virtual machines.

Monitoring the software on your virtual machine in a hybrid environment will typically use a combination of Azure Monitor for VMs and Operations Manager, depending on the requirements of each machine and your maturity developing operational processes around Azure Monitor. The Microsoft Management Agent (referred to as the Log Analytics agent in Azure Monitor) is used by both platforms so that a single machine can be simultaneously monitored by both.

Keep using Operations Manager initially to continue monitoring server software and on-premises infrastructure. As you become more familiar with Azure Monitor and start to develop monitoring logic using log queries, you can start to remove machines from the management group. Continue to use Operations Manager for any conditions that cannot be identified by collecting logs, events, or performance data and correlated using a log query in Azure Monitor Logs. You may also continue to use Operations Manager if it is tightly integrated into your operational processes until you can transition to modernizing your service operations where Azure Monitor and other Azure services can augment or replace. 


> [!NOTE]
> In the future, Azure Monitor for VMs will transition to the [Azure Monitor agent](patform/../platform/azure-monitor-agent-overview.md) which is currently in public preview. It will be compatible  with the Microsoft Monitoring Agent so the same virtual machine will continue to be able to be monitored by both platforms.

Azure Monitor for VMs may not be sufficient for scenarios where you rely on unique capabilities of Operations Manager management packs such as critical server software like IIS, SQL Server, or Exchange. You may also have custom management packs developed for on-premises infrastructure that can't be reached with Azure Monitor or that provide other functionality that can't be covered by Azure Monitor. 

Enable Azure Monitor for VMs for any virtual machines that you migrate into Azure and on new Azure virtual machines that you create, whether or not those machines will also continue to be monitored by Operations Manager. You should also enable Azure Arc enabled servers and Azure Monitor for VMs for your hybrid machines. 





## Business applications
You typically require custom management packs to monitor your business applications with Operations Manager, leveraging agents installed on each virtual machine. Application Insights in Azure Monitor monitors web based applications whether they're in Azure, other clouds, or on-premises.

You should be able to replace the custom management packs for each of your business applications with Application Insights. Use codeless monitoring for an easier implementation with no changes to your application code or use code-based monitoring for additional features. 

Application Insights provides the following benefits over custom management packs:

- Automatically discover and monitor application components.
- Collect detailed application usage and performance data such as response time, failure rates, and request rates.
- Collect browser data such as page views and load performance.
- Detect exceptions and drill into stack trace and related requests.
- Perform advanced analysis using features such as [distributed tracing](app/distributed-tracing.md) and [smart detection](app/proactive-diagnostics.md).
- Use [metrics explorer](platform/metrics-getting-started.md) to interactively analyze performance data.
- Use [log queries](log-query/log-query-overview.md) to interactively analyze collected telemetry together with data collected for Azure services and Azure Monitor for VMs.

You may continue to use Operations Manager for functionality that isn't allowed by your corporate security policies. For example, [availability tests](app/monitor-web-app-availability.md) which allow you to monitor and alert on the availability and responsiveness of your applications require incoming requests from the IP addresses of web test agents. If your policy won't allow such access, you may need to keep using [Web Application Availability Monitors](/system-center/scom/web-application-availability-monitoring-template) in Operations Manager.



## Azure Monitor at scale
Users of Operations Manager expect monitoring to be automatically applied to new servers and other resources once an agent is installed. You should have the same expectation of Azure Monitor with any new resources automatically monitored as soon as they're created. Leverage [Azure Policy](deploy-scale.md) to automatically create diagnostic settings for any new Azure resources and the enable Azure Monitor for VMs on any new virtual machines.

## Next steps

- See the [Cloud Monitoring Guide](/azure/cloud-adoption-framework/manage/monitor/) for a detailed comparison of Azure Monitor and System Center Operations Manager and more details on designing and implementing a hybrid monitoring environment.
- Read more about [monitoring Azure resources in Azure Monitor](insights/monitor-azure-resource.md).
- Read more about [monitoring Azure virtual machines in Azure Monitor](insights/monitor-vm-azure.md).
- Read more about [Azure Monitor for VMs](insights/vminsights-overview.md).
- Read more about [Application Insights](app/app-insights-overview.md).

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
Many customers use System Center Operations Manager for monitoring their on-premises applications. As you move your applications into Azure, you may be wondering whether to migrate to Azure Monitor, continue using Operations Manager, or use a combination of both. 

The [Cloud Monitoring Guide](https://docs.microsoft.com/azure/cloud-adoption-framework/manage/monitor/) recommends a [Hybrid cloud monitoring](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview#hybrid-cloud-monitoring) strategy that allows you to make a gradual transition to the cloud, using each platform to monitor a different set of workloads in your environment. Using multiple monitoring tools does add complexity to your environment, but it allows you to take advantage of Azure Monitor's ability to monitor next generation Platform as a Service (PaaS) workloads while retaining Operations Manager's ability to monitor Infrastructure as a Service (IaaS) workloads. 

 This article provides guidance on which workloads in your environment are best monitored by each platform. It assumes that your ultimate goal is a full transition into the cloud, replacing as much Operations Manager functionality as possible with Azure Monitor, as long as it meets your business and IT operational requirements. There is a cost to implementing several features described here, so you should evaluate their value before implementing across your entire environment. The specific recommendations made in this article may change as Azure Monitor and Operations Manager add features. The fundamental strategy though will remain consistent.

## Prerequisites
This article is primarily intended for customers who currently use [Operations Manager]() and are starting to migrate business applications and other resources into Azure. It assume that you're already familiar with [Operations Manager]() and at least have a basic understanding of [Azure Monitor](). For a complete comparison between the two, see [Cloud monitoring guide: Monitoring platforms overview](/azure/cloud-adoption-framework/manage/monitor/platform-overview). That article describes specific feature differences between to the two to help you understand some of the recommendations made here. 

## Components to monitor
With a hybrid monitoring strategy, it helps to categorize the different kinds of components and workloads that you need to monitor. This article provides different recommendations for different kinds of workloads. Following is a description of the different kinds of workloads described in this article: 

**Business applications.** Applications that provide functionality specific to your business. They may be internal or external and are often developed internally using custom code. Your legacy applications will typically be based on virtual or physical machines, while your newer applications will be based on app services such as Azure Web Apps and Azure Functions in the cloud as you migrate into Azure.

**Azure services.** Platform as a Service (PaaS) resources in Azure that support your business applications that have migrated to the cloud. This includes services such as Azure Storage, Azure SQL, and Azure IoT. This does include Azure virtual machines since they are monitored like other Azure services, but the applications and software running on the guest operating system of those virtual machines are monitored separately than the host.

**Server software.** Software running on virtual and physical machines that support your business applications or packaged applications that provide general functionality to your business. Examples include Internet Information Server (IIS), SQL Server, Exchange, and SharePoint. This is also includes the Windows or Linux operating system on your virtual and physical machines.

**On-premises infrastructure.** Components specific to your on-premises environment that require monitoring. This includes such resources as bare metal servers and network components.

## General strategy
Your environment prior to moving any components into Azure is most likely based on virtual and physical machines located on-premises. You rely on Operations Manager to monitor your business applications, server software, and other infrastructure components in your environment such as bare metal servers and networks. You use standard management packs for server software such as IIS, SQL Server, and SharePoint and tune those management packs for your specific requirements. You create custom management packs for your business applications and other components in your environment that don't have existing management packs. You also develop business processes to manage alerts from these management packs.

As you start to create resources in Azure to support your business applications migrating into the cloud, you'll start to use Azure Monitor which is enabled as soon as you create an Azure subscription. It will automatically collect telemetry for any Azure resources you create, and you can enable additional features and data collection with minimal configuration. 

The first step to migrate applications into Azure is often to move virtual machines into the cloud with minimal changes to the applications themselves. The monitoring requirements for these applications and the server software they depend on don't change, although you XXX. You can continue using Operations Manager on these servers as long as their agent can communicate back to your management servers.


Leverage tools such as Azure Policy to automatically enable complete monitoring for new resources as they're created. While Azure Monitor runs completely in the Azure cloud, it can monitor applications and virtual machines in other clouds and on-premises. While you may initially limit your use of Azure Monitor to your Azure resources and Azure virtual machines, you should consider expanding it to monitor as much of your environment as possible to XXX. Even though you may continue to use Operations 



## Azure services
Azure services actually require Azure Monitor to collect telemetry, and it's enabled the moment that you create an Azure subscription. The [Activity log](platform/activity-log.md) is automatically collected for the subscription, and [platform metrics](platform/data-platform-metrics.md) are automatically collected from any Azure resources you create. Add a [diagnostic setting](platform/diagnostic-settings.md) for each resource to send [resource logs](platform/resource-logs.md) to a Log Analytics workspace where you can analyze them with log queries.

[Insights](monitor-reference.md) analyze and present this data to provide a customized experience for different services, similar to the function of a management pack in Operations Manager. The typically don't have the granularity of a management pack, but they require minimal configuration and maintenance. Azure Monitor also includes tools to perform interactive analysis and trending of telemetry collected from Azure resources. Use [Metrics explorer](platform/metrics-getting-started.md) to analyze platform metrics and [Log Analytics](log-query/log-analytics-overview.md) to analyze log and performance data. 

Operations Manager can discover Azure resources and monitor their health based on platform metric values it collects from Azure Monitor using the [Azure management pack](https://www.microsoft.com/download/details.aspx?id=50013). You can set a threshold for each resource to determine a health state and create alerts. This is a limited view of each resource though since it doesn't include resource logs and isn't able to perform detailed analysis beyond a limited set of performance counters.

### Azure management pack
The [Azure management pack](https://www.microsoft.com/download/details.aspx?id=50013) allows Operations Manager to discover Azure resources and monitor their health. You can set a threshold for each resource to determine a health state and create alerts. This is a limited view though based on platform metric values that are sent to Azure Storage and collected through the Azure API from the management pack. It doesn't include other telemetry such as resource logs which provide details about the internal operation of each resource. 

 You may choose to use the Azure Management pack if you want visibility for certain Azure resources in the Operations console and to integrate some basic alerting with your existing processes. You should look to Azure Monitor though for complete monitoring of your Azure resources. 


## Azure Monitor for VMs
[Azure Monitor for VMs](insights/vminsights-overview.md) is the primary tool used in Azure Monitor to monitor virtual machines and their guest operating system and workloads. You should enable this feature for any virtual machines that you migrate into Azure and on new Azure virtual machines that you create.

Azure Monitor for VMs is not limited to monitoring virtual machines in Azure though. [Azure Arc enabled servers](../azure-arc/servers/overview.md) allows you to manage your Windows and Linux machines hosted outside of Azure, on your corporate network, or other cloud provider consistent with how you manage native Azure virtual machines. Enabling Azure Monitor for VMs on Arc enabled servers allows you to move toward standardization of your virtual machine monitoring in Azure Monitor.



Azure Monitor for VMs alone may be sufficient for some virtual machines in your environment, both Azure virtual machines and Arc enabled servers. For these virtual machines, 


 You should continue to use Operations Manager though for virtual machines with server software that require



Like management packs in Operations Manager, Azure Monitor for VMs collects performance data from the guest operating system of virtual machines, and you can also [configure additional logs and metrics to be collected](platform/agent-data-sources.md). There aren't preexisting rules though to identify and alert on issues for the business applications and server software running in the virtual machine. You must create your own alert rules to be proactively notified of any detected issues. A new [guest health feature for Azure Monitor for VMs](insights/vminsights-health-overview.md) is now in public preview and does alert based on the health state of a set of performance metrics. This is currently limited though to a specific set of performance counters related to the guest operating system and not applications or other workloads running in the virtual machine.



Operations Manager was designed for workloads running on virtual machines, and an extensive collection of management packs is available to monitor various applications. Each includes predefined logic to discover different components of the application, measure their health, and generate alerts when issues are detected. You may have also have considerable investment in tuning existing management packs and even developing your own to your specific requirements and in developing custom management packs for any custom requirements.



## Business applications
You typically require custom management packs to monitor applications in your IaaS environment with Operations Manager, leveraging agents installed on each virtual machine. Application Insights in Azure Monitor monitors both IaaS and PaaS web based applications in Azure, other clouds, or on-premises. Application Insights provides the following benefits over custom management packs:

- Automatically discover and monitor application components.
- Collect detailed application usage and performance data such as response time, failure rates, and request rates.
- Collect browser data such as page views and load performance.
- Detect exceptions and drill into stack trace and related requests.
- Perform advanced analysis using features such as [distributed tracing](app/distributed-tracing.md) and [smart detection](app/proactive-diagnostics.md).
- Use [log queries](log-query/log-query-overview.md) to interactively analyze collected telemetry together with data collected for Azure services and Azure Monitor for VMs.
- Use [metrics explorer](platform/metrics-getting-started.md) to interactively analyze performance data using a graphical interface.


## Summary of recommendations
This section provides a quick list of the specific recommendations made in the rest of the article.

### Azure services

**Configure Azure Monitor for Azure resources.** Start by using [metrics explorer]() to analyze platform metrics that are automatically collected for your Azure resources. Configure [Insights](monitor-reference.md) that are available for the Azure services that you use since they'll provide monitoring with minimal configuration. [Create diagnostic settings](platform/diagnostic-settings.md) to send resource logs and platform metrics for critical resources to a Log Analytics workspace where you can interactively analyze them with [log queries]() and visualize them with [workbooks](). Configure [Azure Policy](deploy-scale.md) to automatically configure new resources as they're created. 

### Virtual machines

**Configure Azure Monitor for VMs.** Configure Azure Monitor for VMs and onboard a representative set of virtual machines. [Azure Arc](azure/azure-arc/servers/) is required for virtual machines outside of Azure. Determine the following:

- Which virtual machines can be monitored with Azure Monitor for VMs without management packs.
- Which virtual machines still require management packs.
- For those virtual machines that require management packs, whether the additional functionality of Azure Monitor for VMs justifies the additional complexity of using both platforms.

**Remove select virtual machines from Operations Manager.** Azure Monitor may be sufficient to monitor some of your virtual machines that don't require detailed workload monitoring. If this level of monitoring is sufficient, then remove those agents from your Operations Manager management group and allow them to be monitored with Azure Monitor. Continue to perform this evaluation as features are added to Azure Monitor.

**Create policy to enable Azure Monitor for VMs.** Once you've determined the virtual machines that you'll monitor with both management packs and Azure Monitor for VMs, [create an Azure Policy](deploy-scale.md#azure-monitor-for-vms) to deploy the agent to existing and new virtual machines. 

### Business applications

**Configure Application Insights for each application.** Replace custom management packs for each of your applications with Application Insights. Use codeless monitoring for an easier implementation with no changes to your application code or use code-based monitoring for additional features. 

**Create availability tests for public applications.** Create [availability tests](app/monitor-web-app-availability.md) to monitor and alert on the availability and responsiveness of your public applications. Continue to use [Web Application Availability Monitors](/system-center/scom/web-application-availability-monitoring-template) in Operations Manager to monitor internal applications.


## Next steps

- See the [Cloud Monitoring Guide](/azure/cloud-adoption-framework/manage/monitor/) for a detailed comparison of Azure Monitor and System Center Operations Manager and more details on designing and implementing a hybrid monitoring environment.
- Read more about [monitoring Azure resources in Azure Monitor](insights/monitor-azure-resource.md).
- Read more about [monitoring Azure virtual machines in Azure Monitor](insights/monitor-vm-azure.md).
- Read more about [Azure Monitor for VMs](insights/vminsights-overview.md).
- Read more about [Application Insights](app/app-insights-overview.md).






Azure Monitor for VMs provides features including the following:

- Discover and monitor relationships between virtual machines and their external dependencies.
- View aggregated performance data across multiple virtual machines in interactive charts and workbooks.
- Use [log queries](log-query/log-query-overview.md) to interactively analyze collected performance data, and event data if you configure it.
- Create [log alert rules](platform/alerts-log-query.md) based on complex logic across multiple virtual machines.
- Discover relationships between agents and dependencies on external resources and allows you to work with them in a graphical tool. 
- Use the new guest health feature (preview) to view and alert on the health of a virtual machine based on a set of performance counters.
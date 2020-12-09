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

## Quick comparison
For a complete comparison between Azure Monitor and Operations Manager, see [Cloud monitoring guide: Monitoring platforms overview](/azure/cloud-adoption-framework/manage/monitor/platform-overview). That article describes specific feature differences between to the two to help you understand some of the recommendations made here. 

**Azure Monitor** is a Software as a Service (SaaS) offering with minimal infrastructure and configuration requirements. You pay only for the features you use and data you collect. While Azure Monitor runs completely in the Azure cloud, it can monitor applications and virtual machines in other clouds and on-premises. Azure Monitor doesn't allow granular control over monitoring, and most features require little or no configuration. 

**Operations Manager** was primarily designed to monitor virtual machines and has significant infrastructure and maintenance requirements. While management packs in Operations Manager provide very granular control over monitoring scenarios, they can be complex to build and maintain. Because of its maturity though, there is an extensive library of management packs with predefined logic for a variety of applications.

## Workloads to monitor
The following diagram illustrates the different category of workloads that need to be monitored in a typical environment. Platform as a Service (PaaS) workloads are applications and services running in Azure. 
Infrastructure as a Service (IaaS) workloads may be running in virtual machines in Azure, another cloud, or on-premises. [Azure Arc](azure/azure-arc/servers/) is required for virtual machines outside of Azure, but other than this requirement, they are monitored the same as Azure virtual machines.


The diagram includes a high level recommendation for the method used to monitor the workload in a hybrid monitoring strategy. The rest of the article describes these recommendations in more details.

**Business applications.** Applications that provide functionality specific to your business. They may be internal or external and are often developed internally using custom code. Your legacy applications will typically be based on virtual or physical machines, while your newer applications will be based on app services such as Azure Web Apps and Azure Functions in the cloud as you migrate into Azure.

**Server software.** Software running on virtual and physical machines that support your business applications or packaged applications that provide general functionality to your business. Examples include Internet Information Server (IIS), SQL Server, Exchange, and SharePoint. This is also includes the Windows or Linux operating system on your virtual and physical machines.

**Azure services.** PaaS resources in Azure that support your business applications that have migrated to the cloud. This includes services such as Azure Storage, Azure SQL, and Azure IoT. This does include Azure virtual machines since they are monitored like other Azure services, but the applications and software running on the guest operating system of those virtual machines are monitored separately than the host.

## Basic strategy
Your environment prior to starting a migration into Azure is most likely based on virtual and physical machines. You rely on Operations Manager to monitor your business applications, server software, and other infrastructure components in your environment such as bare metal servers and networks. You use standard management packs for server software such as IIS, SQL Server, and SharePoint and tune those management packs for your specific requirements. You create custom management packs for your business applications and other components in your environment that don't have existing management packs. You also develop business processes to manage alerts from these management packs.

### IaaS
Your initial migration may be to move virtual machines into Azure with minimal changes to the applications themselves. The monitoring requirements for these applications and the server software they depend on don't change, although you XXX. You can continue using Operations Manager on these servers as long as their agent can communicate back to your management servers. 


## Azure Monitor for VMs
[Azure Monitor for VMs](insights/vminsights-overview.md) collects performance data from the guest operating system of virtual machines in addition to relationships between virtual machines and their external dependencies. You can also [configure additional logs and metrics to be collected](platform/agent-data-sources.md) which is some of the same data used by management packs. There aren't preexisting rules though to identify and alert on issues for the business applications and server software running in the virtual machine. You must create your own alert rules to be proactively notified of any detected issues. 



Operations Manager was designed for workloads running on virtual machines, and an extensive collection of management packs is available to monitor various applications. Each includes predefined logic to discover different components of the application, measure their health, and generate alerts when issues are detected. You may have also have considerable investment in tuning existing management packs and even developing your own to your specific requirements and in developing custom management packs for any custom requirements.


A new [guest health feature for Azure Monitor for VMs](insights/vminsights-health-overview.md) is now in public preview and does alert based on the health state of a set of performance metrics. This is currently limited though to a specific set of performance counters related to the guest operating system and not applications or other workloads running in the virtual machine.

Azure Monitor for VMs may be sufficient for some virtual machines in your environment that only require basic monitoring. Continue to use Operations Manager for virtual machines that require management packs, but consider also using Azure Monitor for VMs. This does add complexity for those virtual machines, but it provides additional features including the following:

- View aggregated performance data across multiple virtual machines in interactive charts and workbooks.
- Use [log queries](log-query/log-query-overview.md) to interactively analyze collected performance data, and event data if you configure it.
- Create [log alert rules](platform/alerts-log-query.md) based on complex logic across multiple virtual machines.
- Discover relationships between agents and dependencies on external resources and allows you to work with them in a graphical tool. 
- Use the new guest health feature (preview) to view and alert on the health of a virtual machine based on a set of performance counters.


## Azure management pack
The [Azure management pack](https://www.microsoft.com/download/details.aspx?id=50013) allows Operations Manager to discover Azure resources and monitor their health. You can set a threshold for each resource to determine a health state and create alerts. This is a limited view though based on platform metric values that are sent to Azure Storage and collected through the Azure API from the management pack. It doesn't include other telemetry such as resource logs which provide details about the internal operation of each resource. 

 You may choose to use the Azure Management pack if you want visibility for certain Azure resources in the Operations console and to integrate some basic alerting with your existing processes. You should look to Azure Monitor though for complete monitoring of your Azure resources.

## Business applications
You typically require custom management packs to monitor applications in your IaaS environment with Operations Manager, leveraging agents installed on each virtual machine. Application Insights in Azure Monitor monitors both IaaS and PaaS web based applications in Azure, other clouds, or on-premises. Application Insights provides the following benefits over custom management packs:

- Automatically discover and monitor application components.
- Collect detailed application usage and performance data such as response time, failure rates, and request rates.
- Collect browser data such as page views and load performance.
- Detect exceptions and drill into stack trace and related requests.
- Perform advanced analysis using features such as [distributed tracing](app/distributed-tracing.md) and [smart detection](app/proactive-diagnostics.md).
- Use [log queries](log-query/log-query-overview.md) to interactively analyze collected telemetry together with data collected for Azure services and Azure Monitor for VMs.
- Use [metrics explorer](platform/metrics-getting-started.md) to interactively analyze performance data using a graphical interface.

### Recommendations

**Configure Application Insights for each application.** Replace custom management packs for each of your applications with Application Insights. Use codeless monitoring for an easier implementation with no changes to your application code or use code-based monitoring for additional features. 

**Create availability tests for public applications.** Create [availability tests](app/monitor-web-app-availability.md) to monitor and alert on the availability and responsiveness of your public applications. Continue to use [Web Application Availability Monitors](/system-center/scom/web-application-availability-monitoring-template) in Operations Manager to monitor internal applications.

## Azure services (PaaS)
Azure services actually require Azure Monitor to collect telemetry, and it's enabled the moment that you create an Azure subscription. The [Activity log](platform/activity-log.md) is automatically collected for the subscription, and [platform metrics](platform/data-platform-metrics.md) are automatically collected from any Azure resources you create. Add a [diagnostic setting](platform/diagnostic-settings.md) for each resource to send [resource logs](platform/resource-logs.md) to a Log Analytics workspace.

[Insights](monitor-reference.md) analyze and present this data to provide a customized experience for different services, similar to the function of a management pack in Operations Manager. The typically don't have the granularity of a management pack, but they require minimal configuration and maintenance. Azure Monitor also includes tools to perform interactive analysis and trending of telemetry collected from Azure resources. Use [Metrics explorer](platform/metrics-getting-started.md) to analyze platform metrics and [Log Analytics](log-query/log-analytics-overview.md) to analyze log and performance data. 

Operations Manager can discover Azure resources and monitor their health based on platform metric values it collects from Azure Monitor using the [Azure management pack](https://www.microsoft.com/download/details.aspx?id=50013). You can set a threshold for each resource to determine a health state and create alerts. This is a limited view of each resource though since it doesn't include resource logs and isn't able to perform detailed analysis beyond a limited set of performance counters.

### Recommendations
**Configure Azure Monitor for Azure resources.** Azure Monitor collects telemetry and provides specialized monitoring for Azure resources that Operations Manager doesn't provide. Start by using [metrics explorer]() to analyze platform metrics that are automatically collected for your Azure resources. Configure [Insights](monitor-reference.md) that are available for the Azure services that you use since they'll provide monitoring with minimal configuration. [Create diagnostic settings](platform/diagnostic-settings.md) to send resource logs and platform metrics for critical resources to a Log Analytics workspace where you can interactively analyze them with [log queries]() and visualize them with [workbooks](). Consider using [Azure Policy](deploy-scale.md) to automatically configure new resources as they're created. 

**Install Azure management pack to see Azure resources in the Operations Console.** If you want to integrate alerting for critical Azure services into your Operations Manager environment, then install and configure the Azure management pack. This will be limited to simple thresholds based on metric data, but it will allow you to view your Azure resources in the Operations Console. You'll most likely still refer to Azure Monitor for other details about these resources.


## Packaged applications (IaaS)
Infrastructure as a Service (IaaS) workloads are services running in virtual machines that support your custom applications in addition to the guest operating system they rely on. This includes such applications as Internet Information Services (IIS), SQL Server, or Microsoft Exchange.


### Recommendations

**Configure Azure Monitor for VMs.** Configure Azure Monitor for VMs and onboard a representative set of virtual machines. [Azure Arc](azure/azure-arc/servers/) is required for virtual machines outside of Azure. Determine the following:

- Which virtual machines can be monitored with Azure Monitor for VMs without management packs.
- Which virtual machines still require management packs.
- For those virtual machines that require management packs, whether the additional functionality of Azure Monitor for VMs justifies the additional complexity of using both platforms.

**Remove select virtual machines from Operations Manager.** Azure Monitor may be sufficient to monitor some of your virtual machines that don't require detailed workload monitoring. If this level of monitoring is sufficient, then remove those agents from your Operations Manager management group and allow them to be monitored with Azure Monitor. Continue to perform this evaluation as features are added to Azure Monitor.

**Create policy to enable Azure Monitor for VMs.** Once you've determined the virtual machines that you'll monitor with both management packs and Azure Monitor for VMs, [create an Azure Policy](deploy-scale.md#azure-monitor-for-vms) to deploy the agent to existing and new virtual machines. 

 


## Next steps

- See the [Cloud Monitoring Guide](/azure/cloud-adoption-framework/manage/monitor/) for a detailed comparison of Azure Monitor and System Center Operations Manager and more details on designing and implementing a hybrid monitoring environment.
- Read more about [monitoring Azure resources in Azure Monitor](insights/monitor-azure-resource.md).
- Read more about [monitoring Azure virtual machines in Azure Monitor](insights/monitor-vm-azure.md).
- Read more about [Azure Monitor for VMs](insights/vminsights-overview.md).
- Read more about [Application Insights](app/app-insights-overview.md).
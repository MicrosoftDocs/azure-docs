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
Many customers who are starting to move applications into Azure currently use System Center Operations Manager for monitoring their on-premises applications. You may be wondering whether to migrate to Azure Monitor, continue using Operations Manager, or use a combination of both. This article provides guidance on which workloads to move to Azure Monitor, which to keep on Operations Manager, and strategies for using the two together. 

## General strategy
[Hybrid cloud monitoring](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview#hybrid-cloud-monitoring) is a strategy that most customers will use in their transition to the cloud. This uses a combination of Azure Monitor and Operations Manager to each monitor a subset of the workloads in your environment. This does add the complexity of multiple monitoring tools, but it takes advantage of Azure Monitor's ability to monitor next generation workloads while retaining Operations Manager's ability to monitor IaaS workloads.
## Quick comparison
Read a complete comparison between Azure Monitor and Operations Manager in [Cloud monitoring guide: Monitoring platforms overview](/azure/cloud-adoption-framework/manage/monitor/platform-overview).

### Azure Monitor
Azure Monitor is a SaaS offering primarily designed to monitor Azure resources. You can have it running in a few minutes since it has minimal infrastructure and configuration requirements, and you pay only for the features you use and data you collect. While Azure Monitor runs completely in the Azure cloud, it can monitor applications and virtual machines in other clouds and on-premises. 

Since Azure Monitor is a SaaS offering, it doesn't provide granular control over monitoring, but most features require little or no configuration, and upgrades are made available automatically. In addition to general monitoring features, it as insights which provide a specialized experience for monitoring different Azure services.

### Operations Manager
Operations Manager was primarily designed to monitor virtual machines, but it can gather data from external resources including those in Azure. It has significant infrastructure and maintenance requirements, but it provides very granular control over monitoring. 

Operations Manager has an extensive library of management packs that monitor a variety of applications. 

## Workloads to monitor
If you consider each of the applications and services that you must monitor as a unique workload, the following diagram illustrates the different types of workloads that need to be monitored. It also includes recommendations for what to move to Azure Monitor as opposed to those that should continue to be monitored by management packs in Azure Monitor. 

![Workloads](media/azure-monitor-scom/workloads.png)

The following table describes these recommendations in more detail.

### IaaS workloads
Infrastructure as a Service (IaaS) workloads are custom and packaged applications running inside virtual machines and containers. These may be in Azure, another cloud, or on-premises.

| Workload | Description | Current | Recommendation |
|:---|:---|:---|:---|
| Custom Applications | These are your custom applications built on an IaaS platform including virtual machines and containers. | Custom applications are typically monitored by custom management packs that you develop and maintain. These management packs will typically identify different components of the application and measure its performance and availability. | Configure Application Insights for each custom application. Application Insights will provide rich monitoring of applications in any environment, leveraging the Azure Monitor platform. |
| Packaged Applications | Packaged applications in your IaaS environment include such applications and SQL Server, SharePoint, and Exchange. This also includes your Windows and Linux operating systems and core services such as DNS, DHCP, and Active Directory. | Management packs are available for most of these applications that include predefined logic to discover and monitor their components. | Continue using management packs for these applications since Azure Monitor doesn't include built-in logic to monitor them. Enable Azure Monitor for VMs on your virtual machines to discover relationships with external processes and to collect telemetry for query analysis. |

### PaaS workloads

| Workload | Description | Current | Recommendation |
|:---|:---|:---|:---|
| Custom Applications  | Includes your custom applications built on application services in Azure such as Azure App Service and Logic Apps. Also includes automation services such as Logic Apps. | These services would typically be monitored with the Azure Management pack and custom management packs for the application. | Configure Application Insights for each application. Configure resource logs to be collected for the Azure services and leverage core Azure Monitor features including insights for the services that have them. |
| Data Services | Azure services that store and process data including databases such as SQL and CosmosDB in addition to Azure Storage. | These services would typically be monitored with the Azure Management pack and custom management packs for the application. | Configure Application Insights for each application. Configure resource logs to be collected for the Azure services and leverage core Azure Monitor features including insights for the services that have them. |


## Monitor Azure resources and PaaS workloads
Azure resources actually require Azure Monitor to collect telemetry, and it's enabled the moment that you create an Azure subscription. The [Activity log]() is automtically collected for the subscription, and [Platform metrics]() are automatically collected from any Azure resources you create. Add a [diagnostic setting]() for each resource to send resource logs a Log Analytics workspace.

Analysis of telemetry collected by Azure resources is integrated into the Azure portal, and Azure Monitor includes tools for their analysis. Use [Metrics explorer]() to analyze platform metrics and [Log Analytics]() to analyze log and performance data. [Insights]() analyze and present this data to provide a customized experience for different services, similar to the function of a management pack in Operations Manager.

Operations Manager can discover Azure resources and monitor their health based on metric values it collects from Azure Monitor using the [Azure management pack](). You can set a threshold for each resource to determine a health state and create alerts. This is a limited view of each resource though since it doesn't include resource logs and isn't able to perform detailed analysis beyond a limited set of performance counters.

### Recommendation
Configure Azure Monitor to [send resource logs and metrics]() from each of your Azure resources to a Log Analytics workspace. Use [Azure Policy()] to automatically configure new resources as they're created. Become familiar with [Insights]() that are available for the Azure services that you use in addition to Azure tools for monitoring Azure resources including [metrics explorer]() and [Log Analytics](). 

If you want to integrate alerting for critical Azure services into your Operations Manager environment, then install and configure the Azure management pack. This will be limited to simple thresholds based on metric data, but it will at least allow you to view your Azure resources in the Operations Console. 


## Monitor virtual machines and IaaS workloads
[Azure Monitor for VMs]() collects performance data from the guest operating system of virtual machines in addition relationships between virtual machines and their external dependencies. You can also [configure additional logs and metrics to be collected]() which is some of the same data used by management packs. There aren't preexisting rules though to identify and alert on issues in the virtual machine. You must create your own alert rules to be proactively notified of any detected issues. 

A new [guest health feature for Azure Monitor for VMs]() is now in public preview and does alert based on the health state of a set of performance metrics. This is currently limited though to a specific set of performance counters related to the guest operating system and not applications or other workloads running in the virtual machine.

Operations Manager was designed for workloads running on virtual machines, and an extensive collection of management packs is available to monitor various applications. Each includes predefined logic to discover different components of the application, measure their health, and generate alerts when issues are detected. You may have also have considerable investment in tuning existing management packs and even developing your own to your specific requirements and in developing custom management packs for any custom requirements.

### Keep using management packs
Keep using management packs the monitor your IaaS workloads since Azure Monitor cannot yet collect the same data and doesn't include the rich set of alerting rules. Management packs also measure the and alert on the health of workloads which is  currently in limited preview for Azure Monitor.

### Configure Azure Monitor for VMs
Configure Azure Monitor for VMs and onboard a select group of virtual machines for initial evaluation. Even though you may keep using management packs for monitoring packaged IaaS workloads, Azure Monitor for VMs provides additional features that will enhance your monitoring in Operations Manager including the following:

- View aggregated performance data across multiple virtual machines in interactive charts and workbooks.
- Use [log queries]() to interactively analyze collected performance data, and event data if you configure it.
- Create [log alert rules]() based on complex logic across multiple virtual machines.
- Discover relationships between agents and dependencies on external resources and allows you to work with them in a graphical tool. 
- Use the new guest health feature (preview) to view and alert on the health of a virtual machine based on a set of performance counters.

### Remove select virtual machines from Operations Manager
Azure Monitor may be sufficient to monitor some of your virtual machines that don't require detailed workload monitoring. For example, you can create a [log query alert rule]() that will notify you if any virtual machines miss a heartbeat or exceed a performance threshold. If this level of monitoring is sufficient, then remove those agents from you Operations Manager management group and allow them to be monitored with Azure Monitor.

### Create policy to enable Azure Monitor for VMs 
Once you've determined the virtual machines that you'll monitor with both management packs and Azure Monitor for VMs, [create an Azure Policy](../deploy-scale#azure-monitor-for-vms.md) to deploy the agent to existing and new virtual machines. 

## Monitor applications
Application Insights in Azure Monitor monitors any web based application regardless of its environment, so you can use it for your applications hosted on either IaaS or PaaS. Application Insights provides the following benefits over custom management packs:

- Automatically discover and monitor all components of the application.
- Collect detailed application usage and performance data such as response time, failure rates, and request rates.
- Collect browser data such as page views and load performance.
- Detect exceptions and drill into stack trace and related requests.
- Use [log queries]() to interactively analyze collected telemetry together with data collected for Azure services and Azure Monitor for VMs.
- Use [metrics explorer]() to interactively analyze performance data using a graphical interface.

### Configure Application Insights 
Replace custom management packs for each of your applications with Application Insights. Use codeless monitoring for an easier implementation with no changes to your application code or use code-based monitoring for additional features. 
### Create availability tests for public applications
Create [availability tests](../app/monitor-web-app-availability.md) to monitor and alert on the availability and responsiveness of your public applications. Continue to use [Web Application Availability Monitors](/system-center/scom/web-application-availability-monitoring-template?view=sc-om-2019) in Operations Manager to monitor internal applications. 


## Next steps

- Read the Cloud Monitoring Guide
- Read more about monitoring Azure resources.
- Read more about Azure Monitor for VMs.
- Read more about Application Insights.
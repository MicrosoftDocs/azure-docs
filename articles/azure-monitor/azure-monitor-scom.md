---
title: Azure Monitor and Operations Manager
description: 
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/10/2020

---

# Compare Azure Monitor and Operations Manager
Like Azure Monitor, System Center Operations Manager monitors the health and availability of your applications and the resources that they depend on.  If your organization currently uses Operations Manager and is starting to move some applications to Azure, you're probably considering whether to transition to Azure Monitor, keep using Operations Manager, or use a combination of the two.

This article provides further details on specific differences between Azure Monitor and Operations Manager and decision 

## Basic strategy

For most customers, the best strategy will be to use a combination of both. Leverage Azure Monitor for its rich monitoring of Azure resources, reduced infrastructure and maintenance requirements, superior data analysis, and application monitoring. Keep using Operations Manager for those requirements that are not provided by Azure Monitor. As features are added to Azure Monitor, it may start to meet some of these requirements, while you may require Operations Manager for certain monitoring indefinitely.

1. Implement Azure Monitor. 
   1. Configure Azure Monitor to monitor your Azure resources.
   2. Evaluate insights in Azure Monitor and features such as Log Analytics.
   3. Evaluate the Azure management pack for Operations Manager.
2. Virtual Machines.
   1. Configure Azure Monitor for VMs and collection of critical events and performance data.
   2. Evaluate whether 
   3. Continue using Operations Manager and management packs for critical workloads.
3. Applications
   1. Enable Application Insights for critical applications.


## Quick comparison
Read a complete comparison between Azure Monitor and Operations Manager in [Cloud monitoring guide: Monitoring platforms overview](/azure/cloud-adoption-framework/manage/monitor/platform-overview).

### Azure Monitor
Azure Monitor is a SaaS offering primarily designed to monitor Azure resources. You can have it running in a few minutes since it has minimal infrastructure and configuration requirements, and you pay only for the features you use and data you collect. While Azure Monitor runs completely in the Azure cloud, it can monitor applications and virtual machines in other clouds and on-premises. 

Since Azure Monitor is a SaaS offering, it doesn't provide granular control over monitoring, but most features require little or no configuration, and upgrades are made available automatically. In addition to general monitoring features, it as insights which provide a specialized experience for monitoring different Azure services.

### Operations Manager
Operations Manager was primarily designed to monitor virtual machines, but it can gather data from external resources including those in Azure. It has significant infrastructure and maintenance requirements, but it provides very granular control over monitoring. 

Operations Manager has an extensive library of management packs that monitor a variety of applications. 


## Considerations

- Existing user of SCOM or other monitoring solution
- Types of workloads to monitor, especially workloads running in virtual machines

## Monitor Azure resources

### Azure Monitor
Azure resources actually require Azure Monitor to collect telemetry, although you can choose to have other tools to analyze collected data. [Platform metrics]() and [Activity log]() are automatically generated and collected in Azure Monitor. Resource logs are generated automatically for Azure resources, and you create a [diagnostic setting]() to send them to a Log Analytics workspace. While you can use [diagnostic settings]() to send any of this data to Azure Event 

Analysis of telemetry collected by Azure resources is integrated into the Azure portal for several services, and Azure Monitor includes tools for their analysis. Use [Metrics explorer]() to analyze platform metrics and [Log Analytics]() to analyze log and performance data. [Insights]() analyze and present this data to provide a customized experience for different services, similar to the function of a management pack in SCOM.

### Operations Manager
Operations Manager monitors Azure services with the [Azure management pack](). This will discover Azure resources and monitor their health based on metric values. This will give you health state of the resource and allow you to set thresholds to create alerts. This is a limited view of each resource though since it doesn't include resource logs. 

## Monitor virtual machines
In addition to monitoring virtual machine resources, you must monitor their guest operating system and any workloads running on them. 

### Azure Monitor
[Azure Monitor for VMs]() collects performance data from the guest operating system of virtual machines, and you can configure additional logs and metrics to be collected. It also collects relationships between virtual machines and their external dependencies, presenting them for interactive analysis. There aren't preexisting rules though to identify issues in the virtual machine. You must create your own alert rules to be proactively notified of any detected issues. There also isn't a standard method to collect data beyond the predefined set of data sources.

A new [guest health feature for Azure Monitor for VMs]() is now in public preview and does alert based on the health state of a set of performance metrics. This is currently limited though to a specific set of performance counters.

### Operations Manager
Operations Manager was designed for workloads running on virtual machines. An extensive collection of management packs is available to monitor various applications. Each includes predefined logic to discover different components of the application, measure their health, and generate alerts when issues are detected. You can create your own management packs for any custom requirements.

Management packs in Operations Manager typically use performance and log data, but can also run custom scripts to colleted and analyze data. Since scripts run locally on the agent virtual machine, you can collect virtually any data that you require.

## Monitor applications

### Azure Monitor
Application Insights in Azure Monitor monitors any web based application whether it's in Azure, another cloud, or on-premises. It automatically identifies different components of the application and monitors its performance and health. 

### Operations Manager





## Recommendations
If you don't have an existing monitoring solution and are getting started in Azure, then use Azure Monitor as your exclusive monitoring solution. Azure Monitor has no infrastructure requirements, and you can get started with minimal investment.


If you currently use Operations Manager and are starting to move workloads to Azure Monitor, consider the following strategy:

- Create diagnostic settings to send resource logs for your subscription and Azure resources to a Log Analytics workspace. 

### Application monitoring
 This will allow you to compare the monitoring 

- Enable Application Insights each of your custom applications, regardless whether they're deployed in Azure or another platform and whether you built a custom management pack to monitor them.
- Create 



## General strategy

-  
- If you're an existing SCOM user, then configure Azure Monitor to collect resource logs for your Azure resources and  

1. Continue to use SCOM to monitor your legacy workloads where you require management packs and state monitoring.
2. Configure full monitoring for your Azure resources. 







## Summary
Azure Monitor is recommended for monitoring your cloud and on-premises resources because of its distinct advantages over Operations Manager that include the following:

- No maintenance of infrastructure. 
- Significantly less administration.
  - No management pack installations or updates.
- Significantly simplified onboarding with agents deployed through extensions and policy.
- New features automatically provided with no upgrade requirements. 
- Virtually unlimited scalability.
- Better interactive analysis with Log Analytics and Metrics Explorer.

Reasons to use SCOM:

- You have business or regulatory reasons blocking you from storing your monitoring data in the cloud.
- Your company has existing investment or knowledge in Operations Manager. This may include custom management packs designed for your applications.
- You rely on management packs that monitor workloads that are not yet available in Azure Monitor.
- You require features unique to Operations Manager including one or more of the following:
  - State level monitoring
  - Granular monitoring definitions
  - 





### Recommendations
Use Azure Monitor to monitor Azure resources. Create diagnostic settings to collect resource logs and platform metrics into a Log Analytics workspace. This is required for some insights and allows you to analyze data using Log Analytics 

where you can analyze them with Log Analytics


## New user
If you have no existing monitoring solution, or if you have an isolated Azure environment, then you should typically use Azure Monitor exclusively for your monitoring. Include Operations Manager only if you require detailed monitoring for workloads running in your VMs.


## Existing Operations Manager customer
If you currently use Operations Manager for your on-premises environment and are currently moving resources into Azure cloud, then you are most likely considering whether to move to Azure Monitor, continue using Operations Manager for monitoring your cloud resources, or using a combination of the two.

The Cloud Monitoring Guide defines a [hybrid cloud monitoring model](https:///azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview#hybrid-cloud-monitoring) that uses a combination of Azure Monitor and Operations Manager. The general strategy of this model is to use Azure Monitor for monitoring your Azure resources while using Operations Manager to monitor the workloads running in your virtual machines.





The [Azure management pack](https://www.microsoft.com/download/details.aspx?id=50013) discovers and monitors your Azure resources. It's important to understand the type of monitoring that it will provide though. The Azure management pack is limited to monitoring metrics 

## Extending Operations Manager

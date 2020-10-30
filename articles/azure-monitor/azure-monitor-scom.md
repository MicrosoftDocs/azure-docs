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
Azure Monitor 

Both Azure Monitor and System Center Operations Manager monitor the health and availability of your applications and the resources that they depend on. Customers often question which one they should use. You might be working with a new environment with no current monitoring and determining which product would best fit your requirements, or you might be an existing Operations Manager customer wondering if you should migrate to Azure Monitor as you move your applications to the cloud. This article provides guidance for 


You can read a complete comparison between Azure Monitor and Operations Manager in [Cloud monitoring guide: Monitoring platforms overview](/azure/cloud-adoption-framework/manage/monitor/platform-overview)

## Quick comparison
The following table provides a quick comparison of the relative advantages of Azure Monitor and Operations Manager.

| | Azure Monitor | Operations Manager |
|:---|:---|:---|
| Infrastructure requirements | No infrastructure requirements other than agents on virtual machines. | Significant infrastructure requirements including database server and one or more management servers in addition to agents on virtual machines. |
| Deployment and onboarding | Minimal configuration requirements. Azure Policy for automated deployment of agents. | Significant configuration including deployment of management servers and tuning management packs. |
| Maintenance requirements | Minimal maintenance requirements. New features automatically available. | Significant maintenance requirements. New features only available with upgrades to infrastructure components. Management pack updates requirement testing, deployment, and tuning. |
| Data sources | Full monitoring of Azure resources, virtual machines, applications, and any REST API client. | Agents on virtual machines only data source although scripts can access remote resources. |
| Health state monitoring | Minimal health state monitoring. Provided by some insights for particular Azure services. Health state monitoring for virtual machines based on limited set of performance counters currently in preview. | Health state monitoring for most critical monitored applications and components. |
| Predefined monitoring | Minimal. 


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


## General strategy

### New user


If you're an existing SCOM user, our recommended strategy to migrate to Azure Monitor.

1. Continue to use SCOM to monitor your legacy workloads where you require management packs and state monitoring.
2. Configure full monitoring for your Azure resources. 


## Monitor Azure resources
Azure resources actually require Azure Monitor to collect telemetry, although you can choose to have other tools collect this telemetry. 

### Azure Monitor
Platform metrics are collected automatically and can be analyzed with Metrics Explorer. Create diagnostic settings to send resource logs and platform metrics to a Log Analytics workspace so you can analyze them with Log Analytics. 




The Azure management pack for SCOM can discover your Azure resources read platform metrics for Azure resources and create 

You could choose to use the Azure management pack to monitor these resources in SCOM, but it collects metrics and resource logs from Azure Monitor.


### Recommendations
Use Azure Monitor to monitor Azure resources. Create diagnostic settings to collect resource logs and platform metrics into a Log Analytics workspace. This is required for some insights and allows you to analyze data using Log Analytics 

where you can analyze them with Log Analytics

## Monitor virtual machines


## Monitor workloads
The most common reason that you will require Operations Manager is monitoring of workloads in virtual machines. This may include standard management packs for applications such as SQL Server, or custom management packs that you've developed for internal applications. 

Azure Monitor can collect events and performance data from virtual machines but doesn't have predefined sets of logic for analyzing and alerting on that data as in management packs. It also doesn't have a standard process for running scripts in a virtual machine which often provide core functionality in management packs.


## New user
If you have no existing monitoring solution, or if you have an isolated Azure environment, then you should typically use Azure Monitor exclusively for your monitoring. Include Operations Manager only if you require detailed monitoring for workloads running in your VMs.


## Existing Operations Manager customer
If you currently use Operations Manager for your on-premises environment and are currently moving resources into Azure cloud, then you are most likely considering whether to move to Azure Monitor, continue using Operations Manager for monitoring your cloud resources, or using a combination of the two.

The Cloud Monitoring Guide defines a [hybrid cloud monitoring model](https:///azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview#hybrid-cloud-monitoring) that uses a combination of Azure Monitor and Operations Manager. The general strategy of this model is to use Azure Monitor for monitoring your Azure resources while using Operations Manager to monitor the workloads running in your virtual machines.





The [Azure management pack](https://www.microsoft.com/download/details.aspx?id=50013) discovers and monitors your Azure resources. It's important to understand the type of monitoring that it will provide though. The Azure management pack is limited to monitoring metrics 

## Extending Operations Manager

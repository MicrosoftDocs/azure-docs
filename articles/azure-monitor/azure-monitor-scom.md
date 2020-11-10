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
Like Azure Monitor, System Center Operations Manager monitors the health and availability of your applications and the resources that they depend on.  You may be an existing Operations Manager customer and are evaluating whether you should move to Azure Monitor. Or you may be using Azure Monitor and are trying to determine whether Operations Manager can provide some XXX.

This article provides decision criteria to help you determine whether 

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

## General strategy

- If you don't have an existing monitoring solution and are getting started in Azure, then use Azure Monitor as your exclusive monitoring solution. Azure Monitor has no infrastructure requirements, and you can get started with minimal investment. 
- If you're an existing SCOM user, then configure Azure Monitor to collect resource logs for your Azure resources and  

1. Continue to use SCOM to monitor your legacy workloads where you require management packs and state monitoring.
2. Configure full monitoring for your Azure resources. 


## Monitor Azure resources
Azure resources actually require Azure Monitor to collect telemetry, although you can choose to have other tools to analyze collected data. 



## Virtual machine workloads
Operations Manager was designed for workloads running on virtual machines. An extensive collection of management packs is available to monitor various applications, and you can create your own management packs for any custom requirements. If you're an existing SCOM customer, then you undoubtedly use 

While Azure Monitor does collect telemetry for guest operating system of virtual machines and 



The most common reason that you will require Operations Manager is monitoring of workloads in virtual machines. This may include standard management packs for applications such as SQL Server, or custom management packs that you've developed for internal applications. 

Azure Monitor can collect events and performance data from virtual machines but doesn't have predefined sets of logic for analyzing and alerting on that data as in management packs. It also doesn't have a standard process for running scripts in a virtual machine which often provide core functionality in management packs.







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

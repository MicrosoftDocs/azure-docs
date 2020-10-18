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
Because of the similarities between 


You can read a complete comparison between Azure Monitor and Operations Manager in [Cloud monitoring guide: Monitoring platforms overview](/azure/cloud-adoption-framework/manage/monitor/platform-overview)

## Operations Manager
[System Center Operations Manager](https://docs.microsoft.com/system-center/scom) is an infrastructure and application monitoring tool from Microsoft that provides end-to-end service and application monitoring, including heterogenous platforms, network devices, and other application or service dependencies. 

## Azure Monitor
Azure Monitor is a SaaS monitoring tool. It's designed to provide 

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
If you're an existing SCOM user, our recommended strategy to migrate to Azure Monitor.

1. Continue to use SCOM to monitor your legacy workloads where you require management packs and state monitoring.
2. Configure full monitoring for your Azure resources. 


## Monitor Azure resources
Azure resources are best monitored with Azure Monitor. In fact, Azure Monitor is required to collect telemetry required for monitoring from Azure resources. Platform metrics are collected automatically, and you create 

You could choose to use the Azure management pack to monitor these resources in SCOM, but it collects metrics and resource logs from Azure Monitor.


## Monitor virtual machines


## Monitor workloads
The most common reason that you will require Operations Manager is monitoring of workloads in virtual machines. This may include standard management packs for applications such as SQL Server, or custom management packs that you've developed for internal applications. 

Azure Monitor can collect events and performance data from virtual machines but doesn't have predefined sets of logic for analyzing and alerting on that data as in management packs. It also doesn't have a standard process for running scripts in a virtual machine which often provide core functionality in management packs.
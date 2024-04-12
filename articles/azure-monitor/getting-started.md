---
title: Getting started with Azure Monitor
description: Guidance and recommendations for deploying Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 02/11/2024
ms.reviewer: bwren
---

# Getting started with Azure Monitor

This article helps guide you through getting started with Azure Monitor. It includes an overview of the basic steps you need for a complete Azure Monitor implementation, and recommendations for preparing your environment and configuring Azure Monitor. 

Azure Monitor is immediately available when you create an Azure subscription. Some features start working right away, while others require some configuration. For example, the [activity log](./essentials/platform-logs-overview.md) immediately starts collecting events about activity in the subscription, platform [metrics](essentials/data-platform-metrics.md) are collected for any Azure resources you create, and metrics explorer is available to analyze data right out of the box.

Other features require configuration. For example, you need to create [diagnostic settings](essentials/diagnostic-settings.md) to collect detailed data from your resources, and you need to configure alerts to be notified when something important happens.

## Accessing Azure Monitor

- In the Azure portal, 
    - Access all Azure Monitor features and data from the **Monitor** menu.
    - Use the  **Monitoring** section in the menu of various Azure services to access the Azure Monitor tools with data filtered to a particular resource.
- Use the Azure CLI, PowerShell, and the REST API to access Azure Monitor data for various scenarios.

## Getting started workflow
These articles provide detailed information about each of the main steps you'll need to do when getting started with Azure Monitor.

| Article | Description |
|:---|:---|
| [Plan your implementation](best-practices-plan.md)|Things that you should consider before starting your implementation. Includes design decisions and information about your organization and requirements that you should gather.|
| [Configure data collection](best-practices-data-collection.md)|Tasks required to collect monitoring data from your Azure and hybrid applications and resources. To enable Azure Monitor to monitor all of your Azure resources, you need to:</br> - Configure Azure resources to generate monitoring data for Azure Monitor to collect.</br> - Configure Azure Monitor components |
| [Understand the analysis and visualizations tools](best-practices-analysis.md)|Get to know the standard features and additional visualizations that you can create to analyze collected monitoring data. |
| [Configure alerts and automated responses](./alerts/alerts-plan.md) |Configure notifications and processes that are automatically triggered when an alert is fired. |
| [Optimize costs](best-practices-cost.md) |Some data collection and Azure Monitor features are included out of the box at no cost. Some features have costs based on their particular configuration, the amount of data collected, or the frequency at which they're run. Reduce your cloud monitoring costs by implementing and managing Azure Monitor in the most cost-effective manner. See:</br>- [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/)</br> - [Azure Monitor cost and usage](cost-usage.md)|

## Next steps

- [Planning your monitoring strategy and configuration](best-practices-plan.md).
- Start with the [Monitor Azure resources with Azure Monitor tutorial](essentials/monitor-azure-resource.md).

---
title: Getting started with Azure Monitor
description: Guidance and recommendations for deploying Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/31/2023
ms.reviewer: bwren
---

# Getting started with Azure Monitor
This article helps guide you through getting started with Azure Monitor including recommendations for preparing your environment and configuring Azure Monitor. It presents an overview of the basic steps you need for a complete Azure Monitor implementation. It will help you understand how you can take advantage of Azure Monitor's features to maximize the observability of your cloud and hybrid applications and resources.

This article focuses on configuration requirements and deployment options, as opposed to actual configuration details. Links are provided for detailed information for the required configurations.

Azure Monitor is available the moment you create an Azure subscription. The Activity log immediately starts collecting events about activity in the subscription, and platform metrics are collected for any Azure resources you created. Features such as metrics explorer are available to analyze data. Other features require configuration. This scenario identifies the configuration steps required to take advantage of all Azure Monitor features. It also makes recommendations for which features you should use and how to determine configuration options based on your particular requirements.

The goal of a complete implementation is to collect all useful data from all of your cloud resources and applications and enable the entire set of Azure Monitor features based on that data.
To enable Azure Monitor to monitor all of your Azure resources, you need to both:
- Configure Azure Monitor components
- Configure Azure resources to generate monitoring data for Azure Monitor to collect.

> [!IMPORTANT]
> If you're new to Azure Monitor or are want to monitor a single Azure resource, start with the [Monitor Azure resources with Azure Monitor tutorial](essentials/monitor-azure-resource.md). The tutorial provides general concepts for Azure Monitor and guidance for monitoring a single Azure resource. This article provides recommendations for preparing your environment to leverage all features of Azure Monitor to monitoring your entire set of applications and resources together at scale.

## Getting started workflow
These articles provide detailed information about each of the main steps you'll need to do when getting started with Azure Monitor.

| Article | Description |
|:---|:---|
| [Plan your implementation](best-practices-plan.md)  |Things that you should consider before starting your implementation. Includes design decisions and information about your organization and requirements that you should gather. |
| [Configure data collection](best-practices-data-collection.md) |Tasks required to collect monitoring data from your Azure and hybrid applications and resources. |
| [Analysis and visualizations](best-practices-analysis.md) |Get to know the standard features and additional visualizations that you can create to analyze collected monitoring data. |
| [Configure alerts and automated responses](best-practices-alerts.md) |Configure notifications and processes that are automatically triggered when an alert is fired. |
| [Optimize costs](best-practices-cost.md) | Reduce your cloud monitoring costs by implementing and managing Azure Monitor in the most cost-effective manner. |


## Next steps

- [Planning your monitoring strategy and configuration](best-practices-plan.md)

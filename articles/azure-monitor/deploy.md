---
title: Deploy Azure Monitor
description: Guidance and recommendations for deploying Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/28/2021

---

# Deploy Azure Monitor
This scenario provides recommended guidance for configuring features of Azure Monitor to monitor the performance and availability of your cloud and hybrid applications and resources. Enabling Azure Monitor to monitor of all your Azure resources is a combination of configuring Azure Monitor components and configuring Azure resources to generate monitoring data for Azure Monitor to collect. The goal of a complete implementation of Azure Monitor is to collect all available data from all of your cloud resources and applications and enable as many features in Azure Monitor as possible based on that data.

> [!IMPORTANT]
> If you're new to Azure Monitor or are focused on simply monitoring a single Azure resource, then you should start with the tutorial [Monitor Azure resources with Azure Monitor](/essentials/monitor-azure-resource.md). The tutorial provides general concepts for Azure Monitor and guidance for monitoring a single Azure resource. This scenario provides recommendations for preparing your environment to leverage all features of Azure Monitor to monitoring your entire set of applications and resources together at scale.

This article introduces the scenario. If you want to jump right into a specific area, see one of the other articles that are part of this scenario described in the following table.

| Article | Description |
|:---|:---|
| [Planning](deploy-plan.md)  | Planning that you should consider before starting your implementation. Includes design decisions and information about your organization and requirements that you should gather. |
| [Configure data collection](deploy-data-collection.md) | Tasks required to collect monitoring data from you Azure and hybrid applications and resources. |
| [Analysis and visualizations](visualizations.md) | Standard features and additional visualizations that you can create to analyze collected monitoring data. |
| [Alerts and automated responses](deploy-alerts.md) | Configure notifications and processes that are automatically triggered when an alert is created. |

## Scope of the scenario
Azure Monitor is available the moment you create an Azure subscription. The Activity log immediately starts collecting events about activity in the subscription, and platform metrics are collected for any Azure resources you created. Features such as metrics explorer are available to analyze data. Other features require configuration. This scenario identifies the configuration steps required to take advantage of all Azure Monitor features. It also makes recommendations for which features you should leverage and how to determine configuration options based on your particular requirements.

This is not intended to be a detailed deployment guide but rather guidance you can use in a monitoring implementation. It focuses on configuration requirements and deployment options as opposed to actual configuration details. Links are provided to other content that provide the details for actually performing required configuration.


## Next steps

- [Planning your monitoring strategy and configuration](deploy-plan.md)
---
title: Deploy Azure Monitor
description: Describes the different steps required for a complete implementation of Azure Monitor to monitor all of the resources in your Azure subscription.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/27/2020

---

# Best practices for deploying Azure Monitor
Enabling Azure Monitor to monitor of all your Azure resources is a combination of configuring Azure Monitor components and configuring Azure resources to generate monitoring data for Azure Monitor to collect. This article describes the different steps required for a complete implementation of Azure Monitor using a common configuration to monitor all of the resources in your Azure subscription. Basic descriptions for each step are provided with links to other documentation for detailed configuration requirements.

> [!IMPORTANT]
> The features of Azure Monitor and their configuration will vary depending on your business requirements balanced with the cost of the enabled features. Each step below will identify whether there is potential cost, and you should assess these costs before proceeding with that step. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for complete pricing details.


## Configuration goals
The goal of a complete implementation of Azure Monitor is to collect all available data from all of your cloud resources and applications and enable as many features in Azure Monitor as possible based on that data.

Data collected by Azure Monitor is sent to either [Azure Monitor Metrics](essentials/data-platform-metrics.md) or [Azure Monitor Logs](logs/data-platform-logs.md). Each stores different kinds of data and enables different kinds of analysis and alerting. See [Compare Azure Monitor Metrics and Logs](data-platform.md) for a comparison of the two and [Overview of alerts in Microsoft Azure](alerts/alerts-overview.md) for a description of different alert types. 

Some data can be sent to both Metrics and Logs in order to leverage it using different features. In these cases, you may need to configure each separately. For example, metric data is automatically sent by Azure resources to Metrics, which supports metrics explorer and metric alerts. You have to create a diagnostic setting for each resource to send that same metric data to Logs, which allows you to analyze performance trends with other log data using Log Analytics. The sections below identify where data is sent and includes each step required to send data to all possible locations.

You may have additional requirements such as monitoring resources outside of Azure and sending data outside of Azure Monitor. Requirements such as these can be achieved with additional configuration of the features described in this article. Follow the links to documentation in each step for additional configuration options.



- Understand SLA, latency, and urgency considerations for each monitored device and application.
- Understand data privacy, retention, residency, and compliance requirements.



### Evaluate requirements for custom instrumentation and data collection
(remove section?)

## Design the monitoring architecture



## Automate actions and remediations



## Communicate and Collaborate




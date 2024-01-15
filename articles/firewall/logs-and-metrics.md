---
title: Overview of Azure Firewall logs and metrics
description: You can monitor Azure Firewall using firewall logs. You can also use activity logs to audit operations on Azure Firewall resources.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 12/04/2023
ms.author: victorh
ms.custom: FY23 content-maintenance
---

# Azure Firewall logs and metrics overview

You can use Azure Firewall logs and metrics to monitor your traffic and operations within the firewall. These logs and metrics serve several essential purposes, including:

- **Traffic Analysis**: Use logs to examine and analyze the traffic passing through the firewall. This includes examining permitted and denied traffic, inspecting source and destination IP addresses, URLs, port numbers, protocols, and more. These insights are essential for understanding traffic patterns, identifying potential security threats, and troubleshooting connectivity issues.  

- **Performance and Health Metrics**: Azure Firewall metrics provide performance and health metrics, such as data processed, throughput, rule hit count, and latency. Monitor these metrics to assess the overall health of your firewall, identify performance bottlenecks, and detect any anomalies.  

- **Audit Trail**: Activity logs enable auditing of operations related to firewall resources, capturing actions like creating, updating, or deleting firewall rules and policies. Reviewing activity logs helps maintain a historical record of configuration changes and ensures compliance with security and auditing requirements.

## Viewing and storage

Logs and metrics can be accessed through the Azure portal, with multiple options for storage and analysis:   

- **Log Analytics Workspace (powered by Azure Monitor)**: Centralize your Azure Firewall logs and metrics in a Log Analytics workspace for advanced analysis, customized dashboard creation, and setting up alerts based on specific metric thresholds.  

- **Storage Account**: Store logs in an Azure Storage account for long-term retention and integration with external log analysis tools.  

- **Event Hub**: Stream Azure Firewall logs to Azure Event Hub for real-time processing, analysis, or integration with third-party SIEM solutions.  

- **Partner Solutions**: Send Azure Firewall logs to third-party partner solutions for further analysis and correlation with other security data.  

Log and metric configuration settings for Azure Firewall is typically done through the Azure portal.  This allows you to specify the destination for logs and metrics and to set up retention and alerting configurations tailored to your organization's monitoring and security requirements. 

## Structured logs

Monitor Azure Firewall using Structured Logs, which use a predefined schema to structure log data for easy searching, filtering, and analysis. These logs include information such as source and destination IP addresses, protocols, port numbers, and firewall actions. Prioritize setting up Structured Logs as your main log type using Resource Specific Tables instead of the existing AzureDiagnostics table. To enable these logs and explore log categories, see [Azure Structured Firewall Logs](firewall-structured-logs.md).  

## Legacy Azure Diagnostics logs 

Legacy Azure Diagnostic logs are the original Azure Firewall log queries that output log data in an unstructured or free-form text format. The Azure Firewall legacy log categories use [Azure diagnostics mode](../azure-monitor/essentials/resource-logs.md#azure-diagnostics-mode), collecting entire data in the [AzureDiagnostics table](/azure/azure-monitor/reference/tables/azurediagnostics). In case both Structured and Diagnostic logs are required, at least two diagnostic settings need to be created per firewall. To enable these logs and explore log categories, see [Azure Firewall diagnostic logs](diagnostic-logs.md). 

## Metrics

Metrics in Azure Monitor are numerical values describing aspects of a system at a particular time. Collected every minute, metrics are useful for alerting due to their frequent sampling. Configure alerts quickly with relatively simple logic. For available metrics and configuring alerts for Azure Firewall, see [Azure Firewall metrics and alerts](metrics.md).

## Activity logs

Activity log entries are collected by default and can be viewed in the Azure portal. Use Azure activity logs (formerly known as operational logs and audit logs) to view all operations submitted to your Azure subscription.  


## Next steps

- To learn more about metrics in Azure Monitor, see [Metrics in Azure Monitor](../azure-monitor/essentials/data-platform-metrics.md).

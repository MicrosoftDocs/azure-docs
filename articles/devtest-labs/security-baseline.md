---
title: Azure Security Baseline for Azure DevTest Labs
description: Azure Security Baseline for Azure DevTest Labs
ms.topic: conceptual
ms.date: 07/09/2020
---

# Azure Security Baseline for Azure DevTest Labs

The Azure Security Baseline for Azure DevTest Labs contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

## Logging and Monitoring

*For more information, see [Security Control: Logging and Monitoring](https://docs.microsoft.com/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources
**Guidance:** Microsoft maintains time sources for Azure resources. However, you can manage time synchronization settings for your compute resources.

See the following article to learn about configuring time synchronization for Azure compute resources: [Time sync for Windows VMs in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/time-sync). 

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Microsoft

### 2.2: Configure central security log management
**Guidance:** Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Activity logs provide insight into the operations that were done on your Azure DevTest Labs instances at the management plane level. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) done at the management plane level for your DevTest Labs instances.

For more information, see [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/platform/diagnostic-settings.md).

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 2.3: Enable audit logging for Azure resources
**Guidance:** Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace, Azure event hub, or Azure storage account for archive. Activity logs provide insight into the operations that were done on your Azure DevTest Labs instances at the management plane level. Using Azure Activity Log data, you can determine the "what, who, and when" for any write operations (PUT, POST, DELETE) done at the management plane level for your DevTest Labs instances.

For more information, see [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/platform/diagnostic-settings.md).

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 2.4: Collect security logs from operating systems
**Guidance:** Azure DevTest Labs virtual machines are created and owned by the customer. So, it’s the organization’s responsibility to monitor it. You can use Azure Security Center to monitor the compute OS. Data collected by Security Center from the operating system includes OS type and version, OS (Windows Event Logs), running processes, machine name, IP addresses, and logged in user. The Log Analytics Agent also collects crash dump files.

For more information, see the following articles: 

- [How to collect Azure Virtual Machine internal host logs with Azure Monitor](../azure-monitor/learn/quick-collect-azurevm.md)
- [Understand Azure Security Center data collection](../security-center/security-center-enable-data-collection.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer

### 2.5: Configure security log storage retention
***Guidance:** In Azure Monitor, set log retention period for Log Analytics workspaces associated with your Azure DevTest Labs instances according to your organization's compliance regulations.

For more information, see the following article: [How to set log retention parameters](../azure-monitor/platform/manage-cost-storage#change-the-data-retention-period.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 2.6: Monitor and review Logs
**Guidance:** Enable Azure Activity Log diagnostic settings and send the logs to a Log Analytics workspace. Run queries in Log Analytics to search terms, identify trends, analyze patterns, and provide many other insights based on the activity log data that may have been collected for Azure DevTest Labs.

For more information, see the following articles:

- [How to enable Diagnostic Settings for Azure Activity Log](../azure-monitor/platform/diagnostic-settings.md)
- [How to collect and analyze Azure activity logs in Log Analytics workspace in Azure Monitor](../azure-monitor/platform/activity-log.md)

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 2.7: Enable alerts for anomalous activity
**Guidance:** Use Azure Log Analytics workspace for monitoring and alerting on anomalous activities in security logs and events related to your Azure DevTest Labs.

For more information, see the following article: [How to alert on log analytics log data](../azure-monitor/learn/tutorial-response.md)

**Azure Security Center monitoring:** Currently not available

**Responsibility:** Customer

### 2.8: Centralize anti-malware logging
**Guidance:** Not applicable. Azure DevTest Labs doesn't process or produce anti-malware related logs.

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 2.9: Enable DNS query logging
**Guidance:** Not applicable. Azure DevTest Labs doesn't process or produce DNS-related logs.

**Azure Security Center monitoring:** Not applicable

**Responsibility:** Customer

### 2.10: Enable command-line audit logging
**Guidance:** Azure DevTest Labs creates Azure Compute machines that are owned and managed by the customer. Use Microsoft Monitoring Agent on all supported Azure Windows virtual machines to log the process creation event and the CommandLine field. For supported Azure Linux Virtual machines, you can manually configure console logging on a per-node basis and use Syslog to store the data. Also, use Azure Monitor's Log Analytics workspace to review logs and run queries on logged data from Azure Virtual machines.

- [Data collection in Azure Security Center](../security-center/security-center-enable-data-collection.md#data-collection-tier)
- [How to run custom queries in Azure Monitor](../azure-monitor/log-query/get-started-queries.md)
- [Syslog data sources in Azure Monitor](../azure-monitor/platform/data-sources-syslog.md)

**Azure Security Center monitoring:** Yes

**Responsibility:** Customer


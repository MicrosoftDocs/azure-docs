---
title: Diagnostic Logs for Application Gateway for Containers
titlesuffix: Azure Application Load Balancer
description: Learn how to enable access logs for Application Gateway for Containers
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: article
ms.date: 7/7/2023
ms.author: greglin
---

# Diagnostic logs for Application Gateway for Containers

Learn how to troubleshoot common problems in Application Gateway for Containers.

You can monitor Azure Application Gateway for Containers resources in the following ways:

* Logs: Logs allow for performance, access, and other data to be saved or consumed from a resource for monitoring purposes.

* Metrics: Application Gateway for Containers has several metrics that help you verify your system is performing as expected.

## Diagnostic logs

You can use different types of logs in Azure to manage and troubleshoot Application Gateway for Containers. You can access some of these logs through the portal. All logs can be extracted from Azure Blob storage and viewed in different tools, such as [Azure Monitor logs](../../azure-monitor/logs/data-platform-logs.md), Excel, and Power BI. You can learn more about the different types of logs from the following list:

* **Activity log**: You can use [Azure activity logs](../../azure-monitor/essentials/activity-log.md) (formerly known as operational logs and audit logs) to view all operations that are submitted to your Azure subscription, and their status. Activity log entries are collected by default, and you can view them in the Azure portal.
* **Access log**: You can use this log to view Application Gateway for Containers access patterns and analyze important information. This includes the caller's IP, requested URL, response latency, return code, and bytes in and out. An access log is collected every 60 seconds. The data may be stored in a storage account, log analytics workspace, or event hub that is specified at time of enable logging.

### Configure access log

Activity logging is automatically enabled for every Resource Manager resource. You must enable access logging to start collecting the data available through those logs. To enable logging, you may configure diagnostic settings in Azure Monitor.

For example, the following PowerShell sample may be used to enable all logging to a storage account for Application Gateway for Containers.

```PowerShell
$storageAccount = Get-AzStorageAccount -ResourceGroupName acctest5097 -Name centraluseuaptclogs
$metric = @()
$log = @()
$metric += New-AzDiagnosticSettingMetricSettingsObject -Enabled $true -Category AllMetrics -RetentionPolicyDay 30 -RetentionPolicyEnabled $true
$log += New-AzDiagnosticSettingLogSettingsObject -Enabled $true -CategoryGroup allLogs -RetentionPolicyDay 30 -RetentionPolicyEnabled $true
New-AzDiagnosticSetting -Name 'AppGWForContainersLogs' -ResourceId "/subscriptions/711d99a7-fd79-4ce7-9831-ea1afa18442e/resourceGroups/acctest5097/providers/Microsoft.ServiceNetworking/trafficControllers/acctest2920" -StorageAccountId $storageAccount.Id -Log $log -Metric $metric
```

More information on diagnostic settings in Azure Monitor and deployment tutorials for Portal, CLI, and more, may be [referenced here](../../azure-monitor/essentials/diagnostic-settings.md).

### Access log format

Each access log entry in Application Gateway for Containers will contain the following information.

| Value | Description |
| ----- | ----------- |
|[broken link for update](../../azure-monitorbrokenlink.md).||

Here an example of the access log emitted in JSON format to a storage account.
```JSON

```

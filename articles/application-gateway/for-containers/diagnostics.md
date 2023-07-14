---
title: Diagnostic Logs for Application Gateway for Containers (preview)
description: Learn how to enable access logs for Application Gateway for Containers
services: application-gateway
author: greglin
ms.service: application-gateway
ms.subservice: traffic-controller
ms.topic: article
ms.date: 07/12/2023
ms.author: greglin
---

# Diagnostic logs for Application Gateway for Containers (preview)

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
| backendHost | Address of backend target with appended port.  For example \<ip\>:\<port\> |
| backendIp | IP address of backend target Application Gateway for Containers will proxy the request to. |
| backendPort | Port number of the backend target. |
| backendResponseLatency | Time in milliseconds to receive syn-ack from backend target when Application Gateway for Containers begins to negotiate the connection. |
| backendTimeTaken | Time in milliseconds to for the response to be transmitted from the backend target to Application Gateway for Containers. |
| clientIp | IP address of the client initiating the request to the frontend of Application Gateway for Containers |
| frontendName | Name of the Application Gateway for Containers frontend that received the request from the client |
| frontendPort | Port number the request was listened on by Application Gateway for Containers |
| hostName | Host header value received from the client by Application Gateway for Containers |
| httpMethod | HTTP Method of the request received from the client by Application Gateway for Containers as per [RFC 7231](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3). |
| httpStatusCode | HTTP Status code returned from Application Gateway for Containers to the client |
| httpVersion | HTTP version of the request received from the client by Application Gateway for Containers  |
| referer | Referer header of the request received from the client by Application Gateway for Containers  |
| requestBodyBytes | Size in bytes of the body payload of the request received from the client by Application Gateway for Containers  |
| requestHeaderBytes | Size in bytes of the headers of the request received from the client by Application Gateway for Containers  |
| requestUri | URI of the request received from the client by Application Gateway for Containers (everything after <protocol>://host of the URL)  |
| responseBodyBytes | Size in bytes of the body payload of the response returned to the client by Application Gateway for Containers |
| responseHeaderBytes | Size in bytes of the headers of the response returned to the client by Application Gateway for Containers |
| timeTaken | Time in milliseconds of the client request received by Application Gateway for Containers and the last byte returned to the client from Application Gateway for Containers |
| tlsCipher | TLS cipher suite negotiated between the client and Application Gateway for Containers frontend |
| tlsProtocol | TLS version negotiated between the client and Application Gateway for Containers frontend |
| trackingId | Generated guid by Application Gateway for Containers to help with tracking and debugging.  This value correlates to the x-request-id header returned to the client from Application Gateway for Containers. |
| userAgent | User-Agent header of the request received from the client by Application Gateway for Containers |

Here an example of the access log emitted in JSON format to a storage account.
```JSON

```

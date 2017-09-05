---
title: Azure Diagnostic Logs Supported Services and Schemas | Microsoft Docs
description: Understand the supported services and event schema for Azure Diagnostic Logs.
author: johnkemnetz
manager: orenr
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.assetid: fe8887df-b0e6-46f8-b2c0-11994d28e44f
ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/21/2017
ms.author: johnkem

---
# Supported services, schemas, and categories for Azure Diagnostic Logs

[Azure resource diagnostic logs](monitoring-overview-of-diagnostic-logs.md) are logs emitted by your Azure resources that describe the operation of that resource. These logs are resource-type specific. In this article, we outline the set of supported services and event schema for events emitted by each service. This article also includes a full list of available log categories per resource type.

## Supported services and schemas for resource diagnostic logs
The schema for resource diagnostic logs varies depending on the resource and log category.   

| Service | Schema & Docs |
| --- | --- |
| API Management | Schema not available. |
| Application Gateways |[Diagnostics Logging for Application Gateway](../application-gateway/application-gateway-diagnostics.md) |
| Azure Automation |[Log analytics for Azure Automation](../automation/automation-manage-send-joblogs-log-analytics.md) |
| Azure Batch |[Azure Batch diagnostic logging](../batch/batch-diagnostics.md) |
| Customer Insights | Schema not available. |
| Content Delivery Network | Schema not available. |
| CosmosDB | Schema not available. |
| Data Lake Analytics |[Accessing diagnostic logs for Azure Data Lake Analytics](../data-lake-analytics/data-lake-analytics-diagnostic-logs.md) |
| Data Lake Store |[Accessing diagnostic logs for Azure Data Lake Store](../data-lake-store/data-lake-store-diagnostic-logs.md) |
| Event Hubs |[Azure Event Hubs diagnostic logs](../event-hubs/event-hubs-diagnostic-logs.md) |
| Key Vault |[Azure Key Vault Logging](../key-vault/key-vault-logging.md) |
| Load Balancer |[Log analytics for Azure Load Balancer](../load-balancer/load-balancer-monitor-log.md) |
| Logic Apps |[Logic Apps B2B custom tracking schema](../logic-apps/logic-apps-track-integration-account-custom-tracking-schema.md) |
| Network Security Groups |[Log analytics for network security groups (NSGs)](../virtual-network/virtual-network-nsg-manage-log.md) |
| Recovery Services | Schema not available.|
| Search |[Enabling and using Search Traffic Analytics](../search/search-traffic-analytics.md) |
| Server Management | Schema not available. |
| Service Bus |[Azure Service Bus diagnostic logs](../service-bus-messaging/service-bus-diagnostic-logs.md) |
| Stream Analytics |[Job diagnostic logs](../stream-analytics/stream-analytics-job-diagnostic-logs.md) |

## Supported log categories per resource type
|Resource Type|Category|Category Display Name|
|---|---|---|
|Microsoft.ApiManagement/service|GatewayLogs|Logs related to ApiManagement Gateway|
|Microsoft.Automation/automationAccounts|JobLogs|Job Logs|
|Microsoft.Automation/automationAccounts|JobStreams|Job Streams|
|Microsoft.Automation/automationAccounts|DscNodeStatus|Dsc Node Status|
|Microsoft.Batch/batchAccounts|ServiceLog|Service Logs|
|Microsoft.Cdn/profiles/endpoints|CoreAnalytics|Gets the metrics of the endpoint, e.g., bandwidth, egress, etc.|
|Microsoft.CustomerInsights/hubs|AuditEvents|AuditEvents|
|Microsoft.DataLakeAnalytics/accounts|Audit|Audit Logs|
|Microsoft.DataLakeAnalytics/accounts|Requests|Request Logs|
|Microsoft.DataLakeStore/accounts|Audit|Audit Logs|
|Microsoft.DataLakeStore/accounts|Requests|Request Logs|
|Microsoft.DocumentDB/databaseAccounts|DataPlaneRequests|DataPlaneRequests|
|Microsoft.EventHub/namespaces|ArchiveLogs|Archive Logs|
|Microsoft.EventHub/namespaces|OperationalLogs|Operational Logs|
|Microsoft.EventHub/namespaces|AutoScaleLogs|Auto Scale Logs|
|Microsoft.KeyVault/vaults|AuditEvent|Audit Logs|
|Microsoft.Logic/workflows|WorkflowRuntime|Workflow runtime diagnostic events|
|Microsoft.Logic/integrationAccounts|IntegrationAccountTrackingEvents|Integration Account track events|
|Microsoft.Network/networksecuritygroups|NetworkSecurityGroupEvent|Network Security Group Event|
|Microsoft.Network/networksecuritygroups|NetworkSecurityGroupRuleCounter|Network Security Group Rule Counter|
|Microsoft.Network/loadBalancers|LoadBalancerAlertEvent|Load Balancer Alert Events|
|Microsoft.Network/loadBalancers|LoadBalancerProbeHealthStatus|Load Balancer Probe Health Status|
|Microsoft.Network/applicationGateways|ApplicationGatewayAccessLog|Application Gateway Access Log|
|Microsoft.Network/applicationGateways|ApplicationGatewayPerformanceLog|Application Gateway Performance Log|
|Microsoft.Network/applicationGateways|ApplicationGatewayFirewallLog|Application Gateway Firewall Log|
|Microsoft.RecoveryServices/Vaults|AzureBackupReport|Azure Backup Reporting Data|
|Microsoft.RecoveryServices/Vaults|AzureSiteRecoveryJobs|Azure Site Recovery Jobs|
|Microsoft.RecoveryServices/Vaults|AzureSiteRecoveryEvents|Azure Site Recovery Events|
|Microsoft.RecoveryServices/Vaults|AzureSiteRecoveryReplicatedItems|Azure Site Recovery Replicated Items|
|Microsoft.Search/searchServices|OperationLogs|Operation Logs|
|Microsoft.ServiceBus/namespaces|OperationalLogs|Operational Logs|
|Microsoft.StreamAnalytics/streamingjobs|Execution|Execution|
|Microsoft.StreamAnalytics/streamingjobs|Authoring|Authoring|

## Next Steps

* [Learn more about diagnostic logs](monitoring-overview-of-diagnostic-logs.md)
* [Stream resource diagnostic logs to **Event Hubs**](monitoring-stream-diagnostic-logs-to-event-hubs.md)
* [Change resource diagnostic settings using the Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931931.aspx)
* [Analyze logs from Azure storage with Log Analytics](../log-analytics/log-analytics-azure-storage.md)

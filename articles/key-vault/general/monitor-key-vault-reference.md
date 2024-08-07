---
title: Monitoring data reference for Azure Key Vault
description: This article contains important reference material you need when you monitor Azure Key Vault by using Azure Monitor.
ms.date: 07/09/2024
ms.custom: horz-monitor, subject-monitoring
ms.topic: reference
author: msmbaldwin
ms.author: mbaldwin
ms.service: key-vault
---
# Azure Key Vault monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure Key Vault](monitor-key-vault.md) for details on the data you can collect for Key Vault and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for microsoft.keyvault/managedhsms

The following table lists the metrics available for the microsoft.keyvault/managedhsms resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [microsoft.keyvault/managedhsms](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-keyvault-managedhsms-metrics-include.md)]

### Supported metrics for Microsoft.KeyVault/vaults

The following table lists the metrics available for the Microsoft.KeyVault/vaults resource type.

[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.KeyVault/vaults](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/metrics/microsoft-keyvault-vaults-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

- ActivityType
- ActivityName
- TransactionType
- StatusCode
- StatusCodeClass

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for microsoft.keyvault/managedhsms

[!INCLUDE [microsoft.keyvault/managedhsms](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-keyvault-managedhsms-logs-include.md)]

### Supported resource logs for Microsoft.KeyVault/vaults

[!INCLUDE [Microsoft.KeyVault/vaults](~/reusable-content/ce-skilling/azure/includes/azure-monitor/reference/logs/microsoft-keyvault-vaults-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Key Vault microsoft.keyvault/managedhsms

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AZKVAuditLogs](/azure/azure-monitor/reference/tables/azkvauditlogs#columns)

### Key Vault Microsoft.KeyVault/vaults

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics#columns)
- [AZKVAuditLogs](/azure/azure-monitor/reference/tables/azkvauditlogs#columns)
- [AZKVPolicyEvaluationDetailsLogs](/azure/azure-monitor/reference/tables/azkvpolicyevaluationdetailslogs#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/azurediagnostics#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

- [Security resource provider operations](/azure/role-based-access-control/resource-provider-operations#security)

### Diagnostics tables

Key Vault uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics), [Azure Activity](/azure/azure-monitor/reference/tables/azureactivity) table, and [Azure Metrics](/azure/azure-monitor/reference/tables/azuremetrics) tables to store resource log information. The following columns are relevant.

**Azure Diagnostics**

| Property | Description |
|:--- |:---|
| _ResourceId | A unique identifier for the resource that the record is associated with. |
| CallerIPAddress | IP address of the user who performed the operation UPN claim or SPN claim based on availability. |
| DurationMs | The duration of the operation in milliseconds. |
| httpStatusCode_d | HTTP status code returned by the request, for example, *200*. |
| Level | Level of the event. One of the following values: Critical, Error, Warning, Informational and Verbose. |
| OperationName | Name of the operation, for example, Alert. |
| properties_s |  |
| Region_s | |
| requestUri_s | The URI of the client request. |
| Resource | |
| ResourceProvider | Resource provider of the Azure resource reporting the metric. |
| ResultSignature | |
| TimeGenerated | Date and time the record was created. |

## Related content

- See [Monitor Azure Key Vault](monitor-key-vault.md) for a description of monitoring Key Vault.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.

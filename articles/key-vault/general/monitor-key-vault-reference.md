---
title: Monitoring Key Vault data reference 
description: Important reference material needed when you monitor Key Vault 
author: msmbaldwin  
ms.topic: reference
ms.author: mbaldwin
ms.service: key-vault
ms.custom: subject-monitoring
ms.date: 07/07/2021
---

# Monitoring Key Vault data reference

See [Monitoring Key Vault](monitor-key-vault.md) for details on collecting and analyzing monitoring data for Key Vault.

## Metrics

------------**OPTION 1 EXAMPLE** ---------------------

<!-- OPTION 1 - Minimum -  Link to relevant bookmarks in https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported, which is auto generated from underlying systems.  Not all metrics are published depending on whether your product group wants them to be.  If the metric is published, but descriptions are wrong of missing, contact your PM and tell them to update them  in the Azure Monitor "shoebox" manifest.  If this article is missing metrics that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

<!-- Example format. There should be AT LEAST one Resource Provider/Resource Type here. -->

This section lists all the automatically collected platform metrics collected for Key Vault.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Key Vault | [Microsoft.KeyVault/vaults](../../azure-monitor/essentials/metrics-supported.md#microsoftkeyvaultvaults) |
| Managed HSM | [Microsoft.KeyVault/managedhsms](../../azure-monitor/platform/resource-logs-categories.md#microsoftkeyvaultmanagedhsms) 

### Key Vault metrics

Resource Provider and Type: [Microsoft.KeyVault/vaults](../../azure-monitor/essentials/metrics-supported.md#microsoftkeyvaultvaults)

| Name | Metric | Unit | Type | Description |
|:-------|:-----|:------------|:------------------|
| Overall Vault Availability | Availability      | Percent    | Average | Vault requests availability            | 
| Overall Vault Saturation | SaturationShoebox | Percent | Average| Vault capacity used | 
| Total Service Api Hits | ServiceApiHit | Count | Count | Number of total service API hits |
| Overall Service Api Latency | ServiceApiLatency | MilliSeconds | Average | Overall latency of service API requests |
| Total Service Api Results | ServiceApiResult | Count | Count | Number of total service API results |

For more information, see a list of [all platform metrics supported in Azure Monitor](../../azure-monitor/platform/metrics-supported.md).

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../../azure-monitor/platform/data-platform-metrics.md#multi-dimensional-metrics).

Key Vault has the following dimensions associated with its metrics:

- ActivityType
- ActivityName
- TransactionType
- StatusCode
- StatusCodeClass

## Resource logs

This section lists the types of resource logs you can collect for Key Vault.

For reference, see a list of [Microsoft.KeyVault/vaults](../../azure-monitor/essentials/resource-logs-categories.md#microsoftkeyvaultvaults).  For full details, see [Azure Key Vault logging](logging.md).

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Key Vault | [Microsoft.KeyVault/vaults](../../azure-monitor/essentials/resource-logs-categories.md#microsoftkeyvaultmanagedhsms) |
| Managed HSM | [Microsoft.KeyVault/managedhsms](../../azure-monitor/essentials/resource-logs-categories.md#microsoftkeyvaultvaults) 

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Key Vault and available for query by Log Analytics. 

|Resource Type | Notes |
|-------|-----|
| [Key Vault](../../azure-monitor/reference/tables/tables-resourcetype.md#key-vaults) | |

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](../../azure-monitor/reference/tables/tables-resourcetype.md).

### Diagnostics tables

Key Vault uses the [Azure Diagnostics](../../azure-monitor/reference/tables/azurediagnostics.md), [Azure Activity](../../azure-monitor/reference/tables/azureactivity.md) table, and [Azure Metrics](../../azure-monitor/reference/tables/azuremetrics.md) tables to store resource log information. The following columns are relevant.

**Azure Diagnostics**

| Property | Description |
|:--- |:---|
| _ResourceId | A unique identifier for the resource that the record is associated with |
| CallerIPAddress | IP address of the user who has performed the operation UPN claim or SPN claim based on availability. |
| DurationMs | The duration of the operation in milliseconds. |
| httpStatusCode_d | HTTP status code returned by the request (for example, *200*) |
| Level | Level of the event. One of the following values: Critical, Error, Warning, Informational and Verbose. |
| OperationName | Name of the operation, for example, Alert |
| properties_s |  |
| Region_s | |
| requestUri_s | The URI of the client request. |
| Resource | |
| ResourceProvider | Resource provider of the Azure resource reporting the metric. |
| ResultSignature | |
| TimeGenerated | Date and time the record was created |



## See Also

- See [Monitoring Azure Key Vault](monitor-key-vault.md) for a description of monitoring Azure Key Vault.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.
---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
tags: azure-service-management
ms.prod: devops
ms.topic: "include"
ms.date: 07/22/2019
ms.author: bwren
ms.custom: "include file"
---

### Ingestion

The following limits apply to the Azure Monitor workspace ingesting your Prometheus metrics.

| Limit | Value |
|:---|:---|
| Active time series with metrics that have been reported in the last ~12 hours. | 1,000,000<br>You can request an increase.  |
| Events per minute ingested. | 1,000,000<br>You can request an increase. |


The following limits apply to the data collection rule (DCR) and data collection endpoint (DCE) sending Prometheus metrics data to your Azure Monitor workspace.

| Limit | Value |
|:---|:---|
| Ingestion requests per minute to a data collection endpoint | 15,000<br>This limit can't be increased. |
| Data ingestion per minute to a data collection endpoint | 50 GB<br>This limit can't be increased. |

#### Queries

Prometheus queries are created by using PromQL and can be authored in either Azure Managed Grafana or self-managed Grafana.

| Limit | Value |
|:---|:---|
| Data retention | 18 months.<br>This limit can't be increased.  
| Query time range | 32 days between the start time and end time of your PromQL query.<br>This limit can't be increased. |
| Query time series per metric | 500,000 time series. |
| Query samples returned | 50,000,000 samples per query. |
| Minimum query step size<br>with time range >= 48 hours | 60 seconds. |

**Query data limits**<br>
For client traffic:

| Limit | Value |
|:---|:---|
| Throttling window lookup length | 30 seconds |
| Data returned per Azure Monitor workspace | 0.5 GB |

For recording rules traffic:

| Limit | Value |
|:---|:---|
| Throttling window lookup length | 3 minutes |
| Data returned per Azure Monitor workspace | 1 GB |

**Query pre-parsing limits**<br>
Based on query time range and request type, over a 30-second window (for client traffic):

| Limit | Value |
|:---|:---|
| Query hours per user (Azure Active Directory, managed identity, Azure Managed Grafana workspace) | 30,000 |
| Query hours per Azure Monitor workspace | 60,000 |
| Query hours per Azure tenant | 600,000 |

Based on query time range and request type, over a 3-minute window (for recording rules traffic):

| Limit | Value |
|:---|:---|
| Query hours per Azure Monitor workspace | 60,000 |
| Query hours per Azure tenant | 600,000 |

**Query post-parsing limits**<br>
Based on query time range and range vectors in query over a 30-second window (for client traffic):

| Limit | Value |
|:---|:---|
| Query hours per user (Azure Active Directory, managed identity, Azure Managed Grafana workspace) | 2,000,000 |
| Query hours per Azure Monitor workspace | 2,000,000 |
| Query hours per Azure tenant | 20,000,000 |

Based on query time range and range vectors in query over a 3-minute window (for recording rules traffic):

| Limit | Value |
|:---|:---|
| Query hours per Azure Monitor workspace | 2,000,000 |
| Query hours per Azure tenant | 20,000,000 |

**Query cost throttling limits**

| Limit | Value |
|:---|:---|
| Maximum query cost per query | 15000 |
| Maximum query cost for recording rules query | 3000 |

Query cost calculation is done as follows:

Query Cost = (Number of time series requested * (queried time duration in seconds / *Inferred time resolution of queried data*)) / 5000

*Inferred time resolution of queried data* = Number of data points stored in any one randomly selected time series keys of queried metric / queried time duration in seconds

#### Alert and recording rules 
Prometheus alert rules and recording rules are defined in PromQL. They're performed on the managed Ruler service as part of Azure Monitor managed service for Prometheus.

| Limit | Value |
|:---|:---|
| Rule groups per Azure Monitor workspace, in an Azure subscription  | 500<br>You can request an increase. |
| Rules per rule group | 20<br> This limit can't be increased. |
| Rule group evaluation interval | Between 1-15 minutes.<br>Default is 1 minute. |
| Active alerts | No limit at this time. |

#### Remote write
Calculations were determined by using a remote batch size of 500, which is the default.

| Limit | Value |
|:---|:---|
| CPU usage | 0.25 x (number of metrics) + 1.25 x (average number of series per metric) |
| CPU request | 0.75 x (CPU usage) |
| CPU limit | 2 x (CPU request) |
| Memory request | 150 Mb |
| Memory limit | 200 Mb |
| Maximum throughput | Remote write container can process up to 150,000 unique time series. The container might throw errors serving requests over 150,000 because of the high number of concurrent connections. This issue can be mitigated by increasing the remote batch size from 500 to 1,000. This change reduces the number of open connections. |

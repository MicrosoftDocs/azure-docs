---
title: Monitoring Load Balancer data reference
description: Important reference material needed when you monitor Load Balancer 
author: asudbring
ms.topic: reference
ms.author: allensu
ms.service: load-balancer
ms.custom: subject-monitoring
ms.date: 4/22/2021
---

# Monitoring Load Balancer data reference

See [Monitoring Load Balancer](monitor-load-balancer.md) for details on collecting and analyzing monitoring data for Load Balancer.

## Metrics

### Load Balancer Metrics 

| Metric | Resource type | Description | Recommended aggregation |
| ------ | ------------- | ----------- | ----------------------- |
| Data path availability | Public and internal load balancer |  Standard Load Balancer continuously exercises the data path from within a region to the load balancer front end, all the way to the SDN stack that supports your VM. As long as healthy instances remain, the measurement follows the same path as your application's load-balanced traffic. The data path that your customers use is also validated. The measurement is invisible to your application and does not interfere with other operations. | Average |
| Health probe status | Public and internal load balancer | Standard Load Balancer uses a distributed health-probing service that monitors your application endpoint's health according to your configuration settings. This metric provides an aggregate or per-endpoint filtered view of each instance endpoint in the load balancer pool. You can see how Load Balancer views the health of your application, as indicated by your health probe configuration. | Average |
| SYN (synchronize) count | Public and internal load balancer | Standard Load Balancer uses a distributed health-probing service that monitors your application endpoint's health according to your configuration settings. This metric provides an aggregate or per-endpoint filtered view of each instance endpoint in the load balancer pool. You can see how Load Balancer views the health of your application, as indicated by your health probe configuration. | Average |
| SNAT connection count | Public load balancer | Standard Load Balancer reports the number of outbound flows that are masqueraded to the Public IP address front end. Source network address translation (SNAT) ports are an exhaustible resource. This metric can give an indication of how heavily your application is relying on SNAT for outbound originated flows. Counters for successful and failed outbound SNAT flows are reported and can be used to troubleshoot and understand the health of your outbound flows. | Sum |
| Allocated SNAT ports | Public load balancer | Standard Load Balancer reports the number of SNAT ports allocated per backend instance. | Average |
| Used SNAT ports | Public load balancer | Standard Load Balancer reports the number of SNAT ports that are utilized per backend instance. | Average |
| Byte count | Public and internal load balancer | Standard Load Balancer reports the data processed per front end. You may notice that the bytes are not distributed equally across the backend instances. This is expected as Azure's Load Balancer algorithm is based on flows. | Sum |
| Packet count | Public and internal load balancer | Standard Load Balancer reports the packets processed per front end. | Sum |

For more information, see a list of [all platform metrics supported in Azure Monitor](./azure-monitor/platform/metrics-supported.md).

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

Load Balancer has the following dimensions associated with its metrics.

| Dimension Name | Description |
| -------------- | ----------- |
| Frontend IP | The frontend IP address of the relevant load balancing rule(s) |
| Frontend Port | The frontend port of the relevant load balancing rule(s) | 
| Backend IP | The backend IP address of the relevant load balancing rule(s) |
| Backend Port | The backend port of the relevant load balancing rule(s) |
| Protocol Type | The protocol of the relevant load balancing rule, this can be TCP or UDP |
| Direction | The direction traffic is flowing. This can be inbound or outbound. | 
| Connection state | The state of SNAT connection, this can be pending, successful, or failed | 

## Resource logs

Resource logs are currently unsupported by Azure Load Balancer

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Load Balancer and available for query by Log Analytics. 

| Resource type | Notes |
| ----- | ------|
| [Load Balancer](/azure-monitor/reference/tables/tables-resourcetype#load-balancers)
### Diagnostics tables

Diagnostics tables are currently unsupported by Azure Load Balancer.
## Activity log

**PM had no information on this**

The following table lists the operations related to Load Balancer that may be created in the Activity log.

<!-- Fill in the table with the operations that can be created in the Activity log for the service. -->
| Operation | Description |
|:---|:---|
| | |
| | |

<!-- NOTE: This information may be hard to find or not listed anywhere.  Please ask your PM for at least an incomplete list of what type of messages could be written here. If you can't locate this, contact azmondocs@microsoft.com for help -->

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## Schemas
<!-- REQUIRED. Please keep heading in this order -->

**PM had no information on this one, wasn't sure what it was.**

The following schemas are in use by Load Balancer

<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. -->

## See Also

<!-- replace below with the proper link to your main monitoring service article -->
- See [Monitoring Azure Load Balancer](monitor-load-balancer.md) for a description of monitoring Azure Load Balancer.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.
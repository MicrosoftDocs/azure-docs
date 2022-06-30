---
title: Data collection in Azure Monitor
description: Monitoring data collected by Azure Monitor is separated into metrics that are lightweight and capable of supporting near real-time scenarios and logs that are used for advanced analysis.
ms.topic: conceptual
ms.date: 06/29/2022
---

# Data collection in Azure Monitor
Azure Monitor collects and aggregates data from a variety of sources into a common data platform where it can be used for analysis, visualization, and alerting. Azure Monitor is implementing a new [ETL](/azure/architecture/data-guide/relational-data/etl)-like data collection process that improves on legacy data collection methods. Configuration and capabilities for data collection prior to this process varies for each [data source](data-sources.md), and some can be a challenge to configure at scale.

 The Azure Monitor data collection process provides the following advantages:

- Common set of destinations for different data sources.
- Ability to apply a transformation to filter or modify incoming data before it's stored.
- Consistent method for configuration of different data sources.
- Scalable configuration options supporting infrastructure as code and DevOps processes.

> [!NOTE]
> This article is not required for configuring most data collection in Azure Monitor. Its intended for customers who want to better understand the data collection process and how common concepts and components are used between different workflows.


## Overview
Azure Monitor data collection is defined by a [data collection Rule (DCR)](essentials/data-collection-rule-overview.md), which includes the configuration of a particular workflow. The DCR includes details such as the data to collect, the destination of that data, and any transformations that should be applied to the data before its stored. All data using the new data collection process uses a DCR to define its configuration.

Some workflows specify a particular data collection rule to use. For example, when using the [data ingestion API](), the API call connects to a data collection endpoint (DCE) and specifies a DCR to accept its incoming data. The DCR understands the structure of the incoming data and specifies the destination.

![]()

Other workflows use a data collection rule association (DCRA), which associates a data collection rule with a resource. For example, to collect data from virtual machines using the Azure Monitor agent, you create a data rule association (DCRA) between the one or more DCRs and one or more virtual machines. The DCRs specify the data to collect on the agent and where that data should be sent.

![]()

## Components
The following table identifies different components of the Azure Monitor data collection process.

| Component | Description |
|:---|:---
| [Data collection Rule (DCR)](essentials/data-collection-rule-overview.md) | D
| Data collection rule association (DCRA) | Associates a data collection rule or data collection endpoint with a resource, such as a virtual machine. A resource may be associated with multiple data collection rules, and a data collection rule may be associated with multiple resources. Not all workflows require a DCRA. |
| [Data collection endpoint (DCE)](essentials/data-collection-endpoint-overview.md) | Endpoint that provides a connection for certain workflows outside of Azure. Some workflows may use public endpoints depending on customer requirements. |

## Supported workflows
When implementation is complete, all data collected by Azure Monitor will use the new data collection process. Currently, only certain workflows support the process, and they may have limited configuration options.

Workflows that currently support the Azure Monitor data collection pipeline include the following. This list will be modified as other workflows are added.

- [Azure Monitor agent](agents/azure-monitor-agent-overview.md) 
- [Data ingestion API](logs/data-ingestion-api-overview.md)


## Legacy workflows
There's no difference between data collected with the new data collection process and data collected using legacy methods. The data is all stored together as Logs and Metrics supporting Azure Monitor features such as log queries, alerts, and workbooks. The only difference is in the method of collection.

The following features in Azure Monitor provide some of the functionality of the data collection process for certain legacy workflows. 

| Feature | Description |
|:---|:---|
| [Ingestion-time transformations](logs/ingestion-time-transformations.md) | Transformations allow you to filter and modify data before it's stored in a Log Analytics workspace. Since transformations are stored in a data collection rule, they can't be used by legacy workflows. Ingestion-time transformations are defined for a particular table and stored in a data collection rule that's associated with the workspace. The transformation is applied to any data sent to that table from any legacy data source. |



## Next steps

- Read more about [Metrics in Azure Monitor](essentials/data-platform-metrics.md).
- Read more about [Logs in Azure Monitor](logs/data-platform-logs.md).
- Learn about the [monitoring data available](data-sources.md) for different resources in Azure.

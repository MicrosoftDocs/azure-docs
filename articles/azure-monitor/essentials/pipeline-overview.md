---
title: Overview of Azure Monitor pipeline
description: Description of the Azure Monitor pipeline which provides data ingestion for Azure Monitor.
ms.topic: conceptual
ms.date: 11/14/2023
ms.author: bwren
author: bwren
---

# Overview of Azure Monitor pipeline
*Azure Monitor pipeline* is part of an [ETL](/azure/architecture/data-guide/relational-data/etl)-like data collection process that improves on legacy data collection methods for Azure Monitor. This process uses a common data ingestion pipeline for all data sources and a standard method of configuration that's more manageable and scalable than other methods. Specific advantages of the data collection using the pipeline include the following:

- Common set of destinations for different data sources.
- Ability to apply a transformation to filter or modify incoming data before it's stored.
- Consistent method for configuration of different data sources.
- Scalable configuration options supporting infrastructure as code and DevOps processes.
- Option of edge pipeline in your own environment to provide high-end scalability, layered network configurations, and periodic connectivity.

> [!NOTE]
> When implementation is complete, all data collected by Azure Monitor will use the pipeline. Currently, only [certain data collection methods](#data-collection-scenarios) are supported, and they may have limited configuration options. There's no difference between data collected with the Azure Monitor pipeline and data collected using other methods. The data is all stored together as [Logs](../logs/data-platform-logs.md) and [Metrics](data-platform-metrics.md), supporting Azure Monitor features such as log queries, alerts, and workbooks. The only difference is in the method of collection.

## Components of pipeline data collection
Data collection using the Azure Monitor pipeline is shown in the diagram below. All data is processed through the *cloud pipeline*, which is automatically available in your subscription and needs no configuration. Each collection scenario is configured in a [data collection rule (DCR)](./data-collection-rule-overview.md), which is a set of instructions describing details such as the schema of the incoming data, a transformation to optionally modify the data, and the destination where the data should be sent.

Some environments may choose to implement a local edge pipeline to manage data collection before it's sent to the cloud. See [edge pipeline](#edge-pipeline) for details on this option.

:::image type="content" source="media/pipeline-overview/pipeline-overview.png" lightbox="media/pipeline-overview/pipeline-overview.png" alt-text="Diagram that shows the data flow for Azure Monitor pipeline." border="false":::

## Data collection rules
*Data collection rules (DCRs)* are sets of instructions supporting data collection using the Azure Monitor pipeline. Depending on the scenario, DCRs specify such details as what data should be collected, how to transform that data, and where to send it. In some scenarios, you can use the Azure portal to configure data collection, while other scenarios may require you to create and manage your own DCR. See [Data collection rules in Azure Monitor](./data-collection-rule-overview.md) for details on how to create and work with DCRs.

## Transformations
*Transformations* allow you to modify incoming data before it's stored in Azure Monitor. They are [KQL queries](../logs/log-query-overview.md) defined in the DCR that run in the cloud pipeline. See [Data collection transformations in Azure Monitor](./data-collection-transformations.md) for details on how to create and use transformations.

The specific use case for Azure Monitor pipeline are:

- **Reduce costs**. Remove unneeded records or columns to save on ingestion costs.
- **Remove sensitive data**. Filter or obfuscate private data.
- **Enrich data**. Add a calculated column to simplify log queries.
- **Format data**. Change the format of incoming data to match the schema of the destination table. 

## Edge pipeline
The edge pipeline extends the Azure Monitor pipeline to your own data center. It enables at-scale collection and routing of telemetry data before it's delivered to Azure Monitor in the Azure cloud. See [Configure an edge pipeline in Azure Monitor](./edge-pipeline-configure.md) for details on how to set up an edge pipeline.

The specific use case for Azure Monitor edge pipeline are:

- **Scalability**. The edge pipeline can handle large volumes of data from monitored resources that may be limited by other collection methods such as Azure Monitor agent.
- **Periodic connectivity**. Some environments may have unreliable connectivity to the cloud, or may have long unexpected periods without connection. The edge pipeline can cache data locally and sync with the cloud when connectivity is restored.
- **Layered network**. In some environments, the network is segmented and data cannot be sent directly to the cloud. The edge pipeline can be used to collect data from monitored resources without cloud access and manage the connection to Azure Monitor in the cloud.

## Data collection scenarios
The following table describes the data collection scenarios that are currently supported using the Azure Monitor pipeline. See the links in each entry for details.

| Scenario | Description |
| --- | --- |
| Virtual machines | Install the [Azure Monitor agent](../agents/agents-overview.md) on a VM and associate it with one or more DCRs that define the events and performance data to collect from the client operating system. You can perform this configuration using the Azure portal so you don't have to directly edit the DCR.<br><br>See [Collect events and performance counters from virtual machines with Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md). |
| | When you enable [VM insights](../vm/vminsights-overview.md) on a virtual machine, it deploys the Azure Monitor agent to telemetry from the VM client. The DCR is created for you automatically to collect a predefined set of performance data.<br><br>See [Enable VM Insights overview](../vm/vminsights-enable-overview.md). |
| Container insights | When you enable [Container insights](../containers/container-insights-overview.md) on your Kubernetes cluster, it deploys a containerized version of the Azure Monitor agent to send logs from the cluster to a Log Analytics workspace. The DCR is created for you automatically, but you may need to modify it to customize your collection settings.<br><br>See [Configure data collection in Container insights using data collection rule](../containers/container-insights-data-collection-dcr.md).  | 
| Log ingestion API | The [Logs ingestion API](../logs/logs-ingestion-api-overview.md) allows you to send data to a Log Analytics workspace from any REST client. The API call specifies the DCR to accept its data and specifies the DCR's endpoint. The DCR understands the structure of the incoming data, includes a transformation that ensures that the data is in the format of the target table, and specifies a workspace and table to send the transformed data.<br><br>See [Logs Ingestion API in Azure Monitor](../logs/logs-ingestion-api-overview.md). |
| Azure Event Hubs | Send data to a Log Analytics workspace from [Azure Event Hubs](../../event-hubs/event-hubs-about.md). The DCR defines the incoming stream and defines the transformation to format the data for its destination workspace and table.<br><br>See [Tutorial: Ingest events from Azure Event Hubs into Azure Monitor Logs (Public Preview)](../logs/ingest-logs-event-hub.md). |
| Workspace transformation DCR | The workspace transformation DCR is a special DCR that's associated with a Log Analytics workspace and allows you to perform transformations on data being collected using other methods. You create a single DCR for the workspace and add a transformation to one or more tables. The transformation is applied to any data sent to those tables through a method that doesn't use a DCR.<br><br>See [Workspace transformation DCR in Azure Monitor](./data-collection-transformations-workspace.md). |


## Next steps

- [Read more about data collection rules and the scenarios that use them](./data-collection-rule-overview.md).
- [Read more about transformations and how to create them](./data-collection-transformations.md).
- [Deploy an edge pipeline in your environment](./edge-pipeline-configure.md).


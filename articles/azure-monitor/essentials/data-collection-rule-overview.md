---
title: Data collection rules in Azure Monitor
description: Overview of data collection rules (DCRs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/18/2024
ms.reviewer: nikeist
ms.custom: references_regions
---

# Data collection rules (DCRs) in Azure Monitor
*Data collection rules (DCRs)* are part of an [ETL](/azure/architecture/data-guide/relational-data/etl)-like data collection process that improves on legacy data collection methods for Azure Monitor. This process uses a common data ingestion pipeline, the Azure Monitor pipeline, for all data sources and a standard method of configuration that's more manageable and scalable than other methods. Specific advantages of DCR-based data collection include the following:

- Consistent method for configuration of different data sources.
- Ability to apply a transformation to filter or modify incoming data before it's stored.
- Scalable configuration options supporting infrastructure as code and DevOps processes.
- Option of edge pipeline in your own environment to provide high-end scalability, layered network configurations, and periodic connectivity.


Data collection using the Azure Monitor pipeline is shown in the diagram below. Each collection scenario is defined in a DCR that specifies how the data should be processed and where it should be sent. The Azure Monitor pipeline itself consists of two components:

- **Cloud pipeline** is a component of Azure Monitor that's automatically available in your Azure subscription. It requires no configuration, and doesn't appear in the Azure portal. It represents the processing path for data that's sent to Azure Monitor. The DCR provides instructions for how the cloud pipeline should process data it receives.
- **Edge pipeline** is an optional component that extends the Azure Monitor pipeline to your own data center. It enables at-scale collection and routing of telemetry data before it's delivered to the cloud pipeline. See [Edge pipeline](#edge-pipeline) for details on the value of this component.

:::image type="content" source="media/pipeline-overview/pipeline-overview.png" lightbox="media/pipeline-overview/pipeline-overview.png" alt-text="Diagram that shows the data flow for Azure Monitor pipeline." border="false":::


## Using data collection rules

Data collection rules (DCRs) are stored in Azure so they can be centrally deployed and managed like any other Azure resource. They're sets of instructions supporting data collection using the Azure Monitor pipeline. They provide a consistent and centralized way to define and customize different data collection scenarios. Depending on the scenario, DCRs specify such details as what data should be collected, how to transform that data, and where to send it. 

There are two fundamental ways that DCRs are specified for a particular data collection scenario as described in the following sections.

### Data collection rule associations (DCRA)
Data collection rule associations (DCRAs) are used to associate a DCR with a monitored resource. This is a many-to-many relationship, where a single DCR can be associated with multiple resources, and a single resource can be associated with multiple DCRs. This allows you to develop a strategy for maintaining your monitoring across sets of resources with different requirements.

For example, the following diagram illustrates data collection for [Azure Monitor agent (AMA)](../agents/azure-monitor-agent-overview.md) running on a virtual machine. When the agent is installed, it connects to Azure Monitor to retrieve any DCRs that are associated with it. In this scenario, the DCR specifies events and performance data to collect, which the agent uses to determine what data to collect from the machine and send to Azure Monitor. Once the data is delivered, the cloud pipeline runs any transformation specified in the DCR to filter and modify the data and then sends the data to the specified workspace and table.

:::image type="content" source="media/data-collection-rule-overview/overview-agent.png" lightbox="media/data-collection-rule-overview/overview-agent.png" alt-text="Diagram that shows basic operation for DCR using Azure Monitor Agent." border="false":::

### Direct ingestion
With direct ingestion, a particular DCR is specified to process the incoming data. For example, the following diagram illustrates data from a custom application using [Logs ingestion API](../logs/logs-ingestion-api-overview.md). Each API call specifies the DCR that will process its data. The DCR understands the structure of the incoming data, includes a transformation that ensures that the data is in the format of the target table, and specifies a workspace and table to send the transformed data.

:::image type="content" source="media/data-collection-rule-overview/overview-ingestion-api.png" lightbox="media/data-collection-rule-overview/overview-ingestion-api.png" alt-text="Diagram that shows basic operation for DCR using Logs ingestion API." border="false":::

## Transformations
[Transformations](./data-collection-transformations.md) allow you to modify incoming data before it's stored in Azure Monitor. You may filter unneeded data to reduce your ingestion costs, remove sensitive data that shouldn't be persisted in the Log Analytics workspace, or format data to ensure that it matches the schema of its destination. Transformations are [KQL queries](../logs/log-query-overview.md) defined in the DCR that run in the cloud pipeline.

## Endpoints
Data sent to the cloud pipeline must be sent to the URL of a specific endpoint. Depending on the scenario, this may be a public endpoint, an endpoint provided by the DCR itself, or a data collection endpoint (DCE) that you create in your Azure subscription. See [Data collection endpoints in Azure Monitor](./data-collection-endpoint-overview.md) for details on the endpoints used in different data collection scenarios.

## Edge pipeline
The [edge pipeline](./edge-pipeline-configure.md) extends the Azure Monitor pipeline to your own data center. It enables at-scale collection and routing of telemetry data before it's delivered to Azure Monitor in the Azure cloud. 

Specific use cases for Azure Monitor edge pipeline are:

- **Scalability**. The edge pipeline can handle large volumes of data from monitored resources that may be limited by other collection methods such as Azure Monitor agent.
- **Periodic connectivity**. Some environments may have unreliable connectivity to the cloud, or may have long unexpected periods without connection. The edge pipeline can cache data locally and sync with the cloud when connectivity is restored.
- **Layered network**. In some environments, the network is segmented and data cannot be sent directly to the cloud. The edge pipeline can be used to collect data from monitored resources without cloud access and manage the connection to Azure Monitor in the cloud.


## Data collection scenarios
The following table describes the data collection scenarios that are currently supported using DCRs and the Azure Monitor pipeline. See the links in each entry for details on its configuration.

| Scenario | Description |
| --- | --- |
| Virtual machines | Install the [Azure Monitor agent](../agents/agents-overview.md) on a VM and associate it with one or more DCRs that define the events and performance data to collect from the client operating system. You can perform this configuration using the Azure portal so you don't have to directly edit the DCR.<br><br>See [Collect events and performance counters from virtual machines with Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md). |
| | When you enable [VM insights](../vm/vminsights-overview.md) on a virtual machine, it deploys the Azure Monitor agent to telemetry from the VM client. The DCR is created for you automatically to collect a predefined set of performance data.<br><br>See [Enable VM Insights overview](../vm/vminsights-enable-overview.md). |
| Container insights | When you enable [Container insights](../containers/container-insights-overview.md) on your Kubernetes cluster, it deploys a containerized version of the Azure Monitor agent to send logs from the cluster to a Log Analytics workspace. The DCR is created for you automatically, but you may need to modify it to customize your collection settings.<br><br>See [Configure data collection in Container insights using data collection rule](../containers/container-insights-data-collection-dcr.md).  | 
| Log ingestion API | The [Logs ingestion API](../logs/logs-ingestion-api-overview.md) allows you to send data to a Log Analytics workspace from any REST client. The API call specifies the DCR to accept its data and specifies the DCR's endpoint. The DCR understands the structure of the incoming data, includes a transformation that ensures that the data is in the format of the target table, and specifies a workspace and table to send the transformed data.<br><br>See [Logs Ingestion API in Azure Monitor](../logs/logs-ingestion-api-overview.md). |
| Azure Event Hubs | Send data to a Log Analytics workspace from [Azure Event Hubs](../../event-hubs/event-hubs-about.md). The DCR defines the incoming stream and defines the transformation to format the data for its destination workspace and table.<br><br>See [Tutorial: Ingest events from Azure Event Hubs into Azure Monitor Logs (Public Preview)](../logs/ingest-logs-event-hub.md). |
| Workspace transformation DCR | The workspace transformation DCR is a special DCR that's associated with a Log Analytics workspace and allows you to perform transformations on data being collected using other methods. You create a single DCR for the workspace and add a transformation to one or more tables. The transformation is applied to any data sent to those tables through a method that doesn't use a DCR.<br><br>See [Workspace transformation DCR in Azure Monitor](./data-collection-transformations-workspace.md). |

## DCR regions
Data collection rules are available in all public regions where Log Analytics workspaces and the Azure Government and China clouds are supported. Air-gapped clouds aren't yet supported. A DCR gets created and stored in a particular region and is backed up to the [paired-region](../../availability-zones/cross-region-replication-azure.md#azure-paired-regions) within the same geography. The service is deployed to all three [availability zones](../../availability-zones/az-overview.md#availability-zones) within the region. For this reason, it's a *zone-redundant service*, which further increases availability.

**Single region data residency** is a preview feature to enable storing customer data in a single region and is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and the Brazil South (Sao Paulo State) Region of the Brazil Geo. Single-region residency is enabled by default in these regions.


## Next steps
See the following articles for additional information on how to work with DCRs.

- [Data collection rule structure](data-collection-rule-structure.md) for a description of the JSON structure of DCRs and the different elements used for different workflows.
- [Sample data collection rules (DCRs)](data-collection-rule-samples.md) for sample DCRs for different data collection scenarios.
- [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md) for different methods to create DCRs for different data collection scenarios.
- [Azure Monitor service limits](../service-limits.md#data-collection-rules) for limits that apply to each DCR.

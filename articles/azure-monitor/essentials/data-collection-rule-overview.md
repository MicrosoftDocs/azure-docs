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

# Data collection rules in Azure Monitor
*Data collection rules (DCR)* are part of an [ETL](/azure/architecture/data-guide/relational-data/etl)-like data collection process that improves on legacy data collection methods for Azure Monitor. This process uses a common data ingestion pipeline, the Azure Monitor pipeline, for all data sources and a standard method of configuration that's more manageable and scalable than other methods. Specific advantages of DCR-based data collection include the following:

- Consistent method for configuration of different data sources.
- Ability to apply a transformation to filter or modify incoming data before it's stored.
- Scalable configuration options supporting infrastructure as code and DevOps processes.
- Option of edge pipeline in your own environment to provide high-end scalability, layered network configurations, and periodic connectivity.


## Azure Monitor pipeline
Data collection using the Azure Monitor pipeline is shown in the diagram below. All data is processed through the *cloud pipeline*, which is automatically available in your Azure subscription and requires no configuration. Each collection scenario is defined in a [data collection rule (DCR)](#data-collection-rules). Some environments may choose to implement a local edge pipeline to manage data collection before it's sent to the cloud. See [edge pipeline](#edge-pipeline) for details on this option.

:::image type="content" source="media/pipeline-overview/pipeline-overview.png" lightbox="media/pipeline-overview/pipeline-overview.png" alt-text="Diagram that shows the data flow for Azure Monitor pipeline." border="false":::



## Data collection rules

Data collection rules (DCRs) are sets of instructions supporting data collection using the [Azure Monitor pipeline](./pipeline-overview.md). They provide a consistent and centralized way to define and customize different data collection scenarios. Depending on the scenario, DCRs specify such details as what data should be collected, how to transform that data, and where to send it. 

DCRs are stored in Azure so that you can centrally manage them. Different components of a data collection workflow will access the DCR for particular information that it requires. In some cases, you can use the Azure portal to configure data collection, and Azure Monitor will create and manage the DCR for you. Other scenarios will require you to create your own DCR. You may also choose to customize an existing DCR to meet your required functionality.

For example, the following diagram illustrates data collection for the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) running on a virtual machine. In this scenario, the DCR specifies events and performance data to collect, which the agent uses to determine what data to collect from the machine and send to Azure Monitor. Once the data is delivered, the data pipeline runs the transformation specified in the DCR to filter and modify the data and then sends the data to the specified workspace and table. DCRs for other data collection scenarios may contain different information.

:::image type="content" source="media/data-collection-rule-overview/overview-agent.png" lightbox="media/data-collection-rule-overview/overview-agent.png" alt-text="Diagram that shows basic operation for DCR using Azure Monitor Agent." border="false":::


## Data collection rule associations

Some data collection scenarios will use data collection rule associations (DCRAs), which associate a DCR with an object being monitored. A single object can be associated with multiple DCRs, and a single DCR can be associated with multiple objects. This allows you to manage a single DCR for a group of objects.

For example, the diagram above illustrates data collection for the Azure Monitor agent. When the agent is installed, it connects to Azure Monitor to retrieve any DCRs that are associated with it. You can create an association with to the same DCRs for multiple VMs.

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

## Supported regions
Data collection rules are available in all public regions where Log Analytics workspaces and the Azure Government and China clouds are supported. Air-gapped clouds aren't yet supported.

**Single region data residency** is a preview feature to enable storing customer data in a single region and is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and the Brazil South (Sao Paulo State) Region of the Brazil Geo. Single-region residency is enabled by default in these regions.

## Data resiliency and high availability
A DCR gets created and stored in a particular region and is backed up to the [paired-region](../../availability-zones/cross-region-replication-azure.md#azure-paired-regions) within the same geography. The service is deployed to all three [availability zones](../../availability-zones/az-overview.md#availability-zones) within the region. For this reason, it's a *zone-redundant service*, which further increases availability.

## Next steps
See the following articles for additional information on how to work with DCRs.

- [Data collection rule structure](data-collection-rule-structure.md) for a description of the JSON structure of DCRs and the different elements used for different workflows.
- [Sample data collection rules (DCRs)](data-collection-rule-samples.md) for sample DCRs for different data collection scenarios.
- [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md) for different methods to create DCRs for different data collection scenarios.
- [Azure Monitor service limits](../service-limits.md#data-collection-rules) for limits that apply to each DCR.

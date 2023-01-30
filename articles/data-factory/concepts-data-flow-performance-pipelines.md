---
title: Optimizing pipeline performance in mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about optimizing data flow execution in pipelines in Azure Data Factory and Azure Synapse Analytics pipelines.
author: kromerm
ms.topic: conceptual
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.date: 10/26/2022
---

# Using data flows in pipelines

When building complex pipelines with multiple data flows, your logical flow can have a big impact on timing and cost. This section covers the impact of different architecture strategies.

## Executing data flows in parallel

If you execute multiple data flows in parallel, the service spins up separate Spark clusters for each activity. This allows for each job to be isolated and run in parallel, but will lead to multiple clusters running at the same time.

If your data flows execute in parallel, we recommend that you don't enable the Azure IR time to the live property because it will lead to multiple unused warm pools.

> [!TIP]
> Instead of running the same data flow multiple times in a for each activity, stage your data in a data lake and use wildcard paths to process the data in a single data flow.

## Execute data flows sequentially

If you execute your data flow activities in sequence, it is recommended that you set a TTL in the Azure IR configuration. The service will reuse the compute resources, resulting in a faster cluster start-up time. Each activity will still be isolated and receive a new Spark context for each execution.

## Overloading a single data flow

If you put all of your logic inside of a single data flow, the service will execute the entire job on a single Spark instance. While this may seem like a way to reduce costs, it mixes together different logical flows and can be difficult to monitor and debug. If one component fails, all other parts of the job will fail as well. Organizing data flows by independent flows of business logic is recommended. If your data flow becomes too large, splitting it into separate components will make monitoring and debugging easier. While there is no hard limit on the number of transformations in a data flow, having too many will make the job complex.

## Execute sinks in parallel

The default behavior of data flow sinks is to execute each sink sequentially, in a serial manner, and to fail the data flow when an error is encountered in the sink. Additionally, all sinks are defaulted to the same group unless you go into the data flow properties and set different priorities for the sinks.

Data flows allow you to group sinks together into groups from the data flow properties tab in the UI designer. You can both set the order of execution of your sinks as well as to group sinks together using the same group number. To help manage groups, you can ask the service to run sinks in the same group, to run in parallel.

On the pipeline execute data flow activity under the "Sink Properties" section is an option to turn on parallel sink loading. When you enable "run in parallel", you are instructing data flows write to connected sinks at the same time rather than in a sequential manner. In order to utilize the parallel option, the sinks must be group together and connected to the same stream via a New Branch or Conditional Split.

## Access Azure Synapse database templates in pipelines

You can use an [Azure Synapse database template](../synapse-analytics/database-designer/overview-database-templates.md) when crating a pipeline. When creating a new dataflow, in the source or sink settings, select **Workspace DB**. The database dropdown will list the databases created through the database template. The Workspace DB option is only available for new data flows, it's not available when you use an existing pipeline from the Synapse studio gallery.

## Next steps

- [Data flow performance overview](concepts-data-flow-performance.md)
- [Optimizing sources](concepts-data-flow-performance-sources.md)
- [Optimizing sinks](concepts-data-flow-performance-sinks.md)
- [Optimizing transformations](concepts-data-flow-performance-transformations.md)

See other Data Flow articles related to performance:

- [Data Flow activity](control-flow-execute-data-flow-activity.md)
- [Monitor Data Flow performance](concepts-data-flow-monitoring.md)
- [Integration Runtime performance](concepts-integration-runtime-performance.md)

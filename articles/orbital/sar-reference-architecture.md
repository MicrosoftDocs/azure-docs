---
title: Process Synthetic Aperture Radar (SAR) data - Azure Orbital Analytics
description: View a reference architecture that enables processing SAR/Remote Sensing data on Azure by using Apache Spark on Azure Synapse.
author: meaghanlewis
ms.service: orbital
ms.topic: conceptual
ms.custom: ga
ms.date: 10/20/2022
ms.author: harjsin
---

# Process Synthetic Aperture Radar (SAR) data in Azure

SAR is a form of radar that is used to create two-dimensional images of three-dimensional reconstructions of objects, such as landscapes. SAR uses the motion of the radar antenna over a target to provide finer spatial resolution than conventional stationary beam-scanning radars.

## Processing

Remote Sensing and or SAR data has always been processed in a linear way because of the way the algorithms were written. Historically, the data was processed on single, and or power machines, which could only be scaled vertically. There was limited way to scale this process vertically and horizontally since the machines that were used to process the data were expensive. Due to increased cost, it wasn't possible to process this data in real-time or near real-time. After looking into the problem space, we were able to come up with alternative ways to scale this process horizontally.

### Scaling using AKS and Argo Workflows

SAR data processing, especially raw L0 processing, typically involves vendor-specific tooling rather than open-source software. As such, a scalable processing pipeline must be able to execute vendor-specific binaries as-is instead of relying on access to source code to change the algorithm and scale out using technologies such as Apache Spark. Containerization allows for vendor supplied binaries to be wrapped in a
container, and then run at scale. While the performance of processing a given image won't increase, many images can be processed in parallel. Azure Kubernetes Service is a natural fit for executing containerized software at scale. Argo Workflows provides a low overhead Kubernetes-native approach to execute pipelines on any Kubernetes cluster. This architecture allows for horizontal scaling of a processing
pipeline that utilizes vendor provided binaries and/or open-source software. While processing of any individual file or image won't occur any faster, many files can be processed simultaneously in parallel. With the flexibility of AKS, each step in the pipeline can execute on the hardware best suited for the tool, for example, GPU, high core
count, or increased memory.

:::image type="content" source="media/aks-argo-diagram.png" alt-text="Diagram of AKS and Argo Workflows." lightbox="media/aks-argo-diagram.png":::

Raw products are received by a ground station application, which, in turn, writes the data into Azure Blob Storage. Using an Azure Event Grid subscription, a notification is supplied to Azure Event Hubs when a new product image is written to blob storage. Argo Events, running on Azure Kubernetes Service, subscribes to the Azure Event Hubs notification and upon receipt of the event, triggers an Argo Workflows workflow to process the image.

Argo Workflows are specified using a Kubernetes custom resource
definition that allows a DAG or simple pipeline to be created by defining Kubernetes objects. Each step in the pipeline/DAG can run a Kubernetes Pod that performs work. The Pod may run a simple shell script or execute code in a custom container including executing vendor-specific tools to process the remote sensor products. Since each step in the pipeline is a different Kubernetes object, normal Kubernetes resource requests are used to specify the requirements of the step. For example, a vendor-specific tool may require a GPU or node with high memory and/or cores to complete its work. These requirements can be specified using Kubernetes resource requests, and Kubernetes affinity and/or nodeSelectors. Kubernetes will map these requests to nodes that are able to satisfy the needs, provided such nodes exist.

With Azure Kubernetes Service, this typically involves creating node pools with the appropriate Azure compute SKU to meet the needs of potential pipelines. These node pools can be set to auto scale so that resources aren't consumed when pipeline steps requiring them aren't running.

### Processing using Azure Synapse

The approach to use Azure Synapse is slightly different than a normal pipeline. Typically, lots of data processing firms already have algorithms that are processing the data. They may not want to rewrite the algorithms that are already written but they may need a way to scale those algorithms horizontally. What we are showing here's an approach using which they can easily run their code on distributed
framework like Apache Spark and not have to worry about dealing with all the complexities one would when working with Distributed system. We're taking advantage of vectorization and SIMD architecture where we're processing more than one row at a time instead of processing one row at a time. These features are specific to Apache Spark DataFrame and JVM

:::image type="content" source="media/azure-synapse-processing.png" alt-text="Diagram of data processing using Azure Synapse." lightbox="media/azure-synapse-processing.png":::

## Data ingestion

Remote Sensing Data is sent to a ground station. The ground station app collects the data and Writes to Blob Storage.

## Data transformation

1. Blob Storage sends an event to Event-Grid about the file being created.
1. Event-Grid Notifies the function registered to receive the event.
1. The function triggers an Azure Synapse Spark Pipeline. This pipeline has the native library and the configuration required to run the spark job. The Spark Job performs the heavy computation and writes the result to the blob storage where it can be further used by any downstream processes.

Under this approach using Apache Spark, we're gluing the library that has algorithms with JNA. JNA requires you to define the interfaces for your native code and does the heavy lifting to converting your data to and from the native library to usable Java Types. Now without any major rewriting, we can distribute the computation of data on nodes vs a single machine. Typical Spark Execution under this model looks like as follows.

:::image type="content" source="media/spark-execution-model.png" alt-text="Diagram of the Spark execution model." lightbox="media/spark-execution-model.png":::

## Considerations

### Pool size consideration

The following section outlines in detail as to how to choose a pool size for the job.

  | Size  | Cores | Memory (GB) | Nodes | Executor | Cost (USD) |
  |-------|-------|-------------|-------|----------|------------|
  |Small  |    4  |  32  |  20-200 | 2-100  | 11.37 to 113.71 |
  | Medium |   8  |   64  | 20-200 |  2-100   | 22.74 to 227.42 |
  | Large |    16 |    128 | 20-200 |  2-100 | 45.48 to 454.85 |
  | XLarge |   32 |   256  | 20-200 |  2-100 |  90.97 to 909.70 |
  | XXLarge |  64 |  512  |  20-200 | 2-100 | 181.94 to 1819.39 |

To process 1 year's worth of data, which is around 610 GB of remote sensing data, following are the metrics that were captured. These metrics are specific to the processing algorithm that was used. It only showcases and exhibits how the process can be horizontally scaled for Batch processing and for Real time processing.

  
  |Size    |  Time(mins)|
  |---------| ------------|
  |Small    | 120|
  |Medium   | 80 |
  |Large    | 67 |
  |XLarge   | 50 |
  |XXLarge  | 40 |

### Spark configuration

  |Property Name                    | Value |
  |---------------------------------|-------|
  |Spark.driver.maxResultSize       |  2g   |
  |Spark.kryoserializer.buffer.max  |  2000 |
  | Spark.sql.shuffle.partitions    |  1000 |

The above configuration was used in the BYOLB use case as there was lot of data that was moved from the executor and the driver nodes. The default configurations weren't enough to handle the use case where we were moving the results as part of DataFrame. We could have tried broadcasting the data but since these were processed as a part of DataFrame broadcasting the values wasn't chosen as we wanted to transform each row of the DataFrame.

### Spark version

We were using Apache Spark 3.1 with Scala 2.12 to develop our pipelines. This version is compatible with Java 11 which has the Garbage collector improvements over Java 8.

### Data abstraction

**DataFrames**
  - Best choice in most situations.
  - Provides query optimization through Catalyst.
  - Whole-stage code generation.
  - Direct memory access.
  - Low garbage collection (GC) overhead.
  - Not as developer-friendly as Datasets, as there 's no compile-time checks or domain object programming.

**RDDs**
  - You don\'t need to use RDDs, unless you need to build a new custom RDD.
  - No query optimization through Catalyst.
  - No whole-stage code generation.
  - High GC overhead.
  - Must use Spark 1.x legacy APIs.

## Potential use cases 

 - Digital Signal Processing

 - Operations on Raw Satellite Data.

 - Image manipulation and processing.

 - Compute heavy tasks that want to be distributed.

## Contributors

*This article is being updated and maintained by Microsoft. It was originally written by the following contributors*

 - Harjit Singh | Senior Engineering Architect
 - Brian Loss   | Principal Engineering Architect

Additional contributors:
- Nikhil Manchanda | Principal Engineering Manager
- Billie Rinaldi | Principal Engineering Manager
- Joey Frazee | Principal Engineering Manager
- Katy Smith | Data Scientist
- Steve Truitt | Principal Program Manager

## Next steps

- [Getting geospatial insights from big data using SynapseML](https://techcommunity.microsoft.com/t5/azure-maps-blog/getting-geospatial-insides-in-big-data-using-synapseml/ba-p/3154717)
- [Get started with Azure Synapse Analytics](../synapse-analytics/get-started.md)
- [Explore Azure Synapse Studio](/training/modules/explore-azure-synapse-studio)
- [SpaceBorne Data Analysis](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/industries/aerospace/geospatial-processing-analytics-content.md)

## See also

- [Geospatial data processing and analytics](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/example-scenario/data/geospatial-data-processing-analytics-azure.yml)
- [Geospatial analysis for the telecommunications industry](https://github.com/MicrosoftDocs/architecture-center/blob/main/docs/example-scenario/data/geospatial-analysis-telecommunications-industry.yml)
- [Big data architectures](https://github.com/MicrosoftDocs/architecture-center/tree/main/docs/data-guide/big-data)

## References

 - [Azure Synapse](https://azure.microsoft.com/services/synapse-analytics)
 - [Apache Spark](https://spark.apache.org)
 - [Argo](https://argoproj.github.io/)

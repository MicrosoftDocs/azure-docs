---
title: Azure Synapse Runtime for Apache Spark 3.5 
description: The new Azure Synapse Runtime for Apache Spark is available for General Availability. Try it and use Spark 3.5, Python 3.10, Delta Lake 3.2.
author: jeacla
ms.author: arali
ms.service: azure-synapse-analytics
ms.topic: reference
ms.subservice: spark
ms.custom: devx-track-python
ms.date: 11/09/2026
---

# Azure Synapse Runtime for Apache Spark 3.5 (GA)
Azure Synapse Analytics supports multiple runtimes for Apache Spark. This document covers the runtime components and versions for the Azure Synapse Runtime for Apache Spark 3.5.

> [!IMPORTANT]
> Microsoft has not announced the retirement of Azure Synapse Analytics or Synapse Spark 3.5, and there is currently no announced retirement date or required migration deadline.
>
> [Microsoft Fabric](/fabric/fundamentals/microsoft-fabric-overview) is Microsoft's strategic platform for new analytics innovation. Within Fabric, [Fabric Runtime](/fabric/data-engineering/runtime) provides the Apache Spark environment for data engineering and data science workloads, with major improvements in performance, stability, and security. Customers are encouraged to evaluate Fabric, including Fabric Runtime for Spark workloads, for new investments and long-term modernization.
>
> This strategic direction does not constitute a retirement announcement for existing Synapse Spark workloads. Any future lifecycle changes affecting Synapse Spark 3.5 will be communicated through official Microsoft channels with appropriate notice and transition guidance.

## Component versions

|  Component   | Version      |  
| ----- |--------------|
| Apache Spark | 3.5    |
| Operating System | Azure Linux (Mariner) 3.0  |
| Java | 17  |
| Scala | 2.12.18      |
| Delta Lake | 3.2        |
| Python | 3.11     |
| R | 4.4.1    |

> [!TIP]
> For up-to-date information, a detailed list of changes, and specific release notes for Spark runtimes, check and subscribe [Spark Runtimes Releases and Updates](https://github.com/microsoft/synapse-spark-runtime/tree/main/Synapse/spark3.5).
## Libraries

To check the libraries included in Azure Synapse Runtime for Apache Spark 3.5 for Java/Scala, Python and R go to [Azure Synapse Runtime for Apache Spark 3.5 Releases Notes](https://github.com/microsoft/synapse-spark-runtime/tree/main/Synapse/spark3.5).

> [!NOTE]
> EventHubConnector is deprecated in Synapse Spark 3.5 and will be removed in future. Customers are encouraged to use Kafa Spark Connector instead as Event Hubs is Kafka compatible already. You can find more information about using [Kafa Spark Connector with Event Hubs](/azure/event-hubs/event-hubs-kafka-spark-tutorial).

## Related content
- [Migration between Apache Spark versions - support](./apache-spark-version-support.md#migration-between-apache-spark-versions---support)
- [Synapse runtime for Apache Spark lifecycle and supportability](./runtime-for-apache-spark-lifecycle-and-supportability.md)

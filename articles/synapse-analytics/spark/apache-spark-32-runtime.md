---
title: Azure Synapse Runtime for Apache Spark 3.2
description: Supported versions of Spark, Scala, Python, and .NET for Apache Spark 3.2.
author: ekote
ms.author: eskot
ms.reviewer: whhender, whhender
ms.service: synapse-analytics
ms.topic: reference
ms.subservice: spark
ms.date: 11/28/2022
ms.custom: has-adal-ref, devx-track-dotnet, devx-track-extended-java, devx-track-python
---

# Azure Synapse Runtime for Apache Spark 3.2 (deprecated)

Azure Synapse Analytics supports multiple runtimes for Apache Spark. This document covers the runtime components and versions for the Azure Synapse Runtime for Apache Spark 3.2.


> [!CAUTION]
> Deprecation and disablement notification for Azure Synapse Runtime for Apache Spark 3.2
> * End of Support announced for Azure Synapse Runtime for Apache Spark 3.2 July 8, 2023.
> * Effective July 8, 2024, Azure Synapse will discontinue official support for Spark 3.2 Runtimes.
> * In accordance with the Synapse runtime for Apache Spark lifecycle policy, Azure Synapse runtime for Apache Spark 3.2 will be retired as of July 8, 2024. Existing workflows will continue to run but security updates and bug fixes will no longer be available. Metadata will temporarily remain in the Synapse workspace.
> * **We strongly recommend that you upgrade your Apache Spark 3.2 workloads to [Azure Synapse Runtime for Apache Spark 3.4 (GA)](./apache-spark-34-runtime.md) before July 8, 2024.** 

## Component versions

|  Component   | Version   |  
| ----- | ----- |
| Apache Spark | 3.2.1 |
| Operating System | Ubuntu 18.04 |
| Java | 1.8.0_282 |
| Scala | 2.12.15  |
| Hadoop | 3.3.1  |
| .NET Core | 3.1 |
| .NET | 2.0.0 |
| Delta Lake | 1.2 |
| Python | 3.8 |
| R (Preview) | 4.2 | 

[Synapse-Python38-CPU.yml](https://github.com/Azure-Samples/Synapse/blob/main/Spark/Python/Synapse-Python38-CPU.yml) contains the list of libraries shipped in the default Python 3.8 environment in Azure Synapse Spark.

## Libraries
To check the libraries included in Azure Synapse Runtime for Apache Spark 3.2 for Java/Scala, Python and R go to [Azure Synapse Runtime for Apache Spark 3.2 Release Notes](https://github.com/microsoft/synapse-spark-runtime/tree/main/Synapse/spark3.2)

## Next steps

- [Azure Synapse Analytics](../overview-what-is.md)
- [Apache Spark Documentation](https://spark.apache.org/docs/3.2.1/)
- [Apache Spark Concepts](apache-spark-concepts.md)

## Migration between Apache Spark versions - support

For guidance on migrating from older runtime versions to Azure Synapse Runtime for Apache Spark 3.3 or 3.4, refer to [Runtime for Apache Spark Overview](./apache-spark-version-support.md).

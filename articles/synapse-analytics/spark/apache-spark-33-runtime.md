---
title: Azure Synapse Runtime for Apache Spark 3.3
description: New runtime is GA and ready for production workloads. Spark 3.3.1, Python 3.10, Delta Lake 2.2.
author: ekote
ms.author: eskot
ms.reviewer: whhender, whhender
ms.service: azure-synapse-analytics
ms.topic: reference
ms.subservice: spark
ms.date: 11/17/2022
ms.custom: has-adal-ref, devx-track-python
---

# Azure Synapse Runtime for Apache Spark 3.3 (EOSA)

Azure Synapse Analytics supports multiple runtimes for Apache Spark. This document covers the runtime components and versions for the Azure Synapse Runtime for Apache Spark 3.3. 

> [!Warning]
> End of support announced for Azure Synapse Runtime for Apache Spark 3.3 July 12th, 2024.
>
> We strongly recommend you upgrade your Apache Spark 3.3 based workloads to [Azure Synapse Runtime for Apache Spark 3.4 (GA)](./apache-spark-34-runtime.md).
> For up-to-date information, a detailed list of changes, and specific release notes for Spark runtimes, check and subscribe to [Spark Runtimes Releases and Updates](https://github.com/microsoft/synapse-spark-runtime).

## Component versions
|  Component   | Version      |  
| ----- |--------------|
| Apache Spark | 3.3.1        |
| Operating System | Ubuntu 18.04 |
| Java | 1.8.0_282    |
| Scala | 2.12.15      |
| Hadoop | 3.3.3        |
| Delta Lake | 2.2.0        |
| Python | 3.10         |
| R (Preview) | 4.2.2        |


[Synapse-Python310-CPU.yml](https://github.com/Azure-Samples/Synapse/blob/main/Spark/Python/Synapse-Python310-CPU.yml) contains the list of libraries shipped in the default Python 3.10 environment in Azure Synapse Spark.


>[!IMPORTANT]
> .NET for Apache Spark
> * The [.NET for Apache Spark](https://github.com/dotnet/spark) is an open-source project under the .NET Foundation that currently requires the .NET 3.1 library, which has reached the out-of-support status. We would like to inform users of Azure Synapse Spark of the removal of the .NET for Apache Spark library in the Azure Synapse Runtime for Apache Spark version 3.3. Users may refer to the [.NET Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) for more details on this matter.
>
> * As a result, it will no longer be possible for users to utilize Apache Spark APIs via C# and F#, or execute C# code in notebooks within Synapse or through Apache Spark Job definitions in Synapse. It is important to note that this change affects only Azure Synapse Runtime for Apache Spark 3.3 and above. 
> 
> * We will continue to support .NET for Apache Spark in all previous versions of the Azure Synapse Runtime according to [their lifecycle stages](runtime-for-apache-spark-lifecycle-and-supportability.md). However, we do not have plans to support .NET for Apache Spark in Azure Synapse Runtime for Apache Spark 3.3 and future versions. We recommend that users with existing workloads written in C# or F# migrate to Python or Scala. Users are advised to take note of this information and plan accordingly.

## Libraries
To check the libraries included in Azure Synapse Runtime for Apache Spark 3.3 for Java/Scala, Python, and R go to [Azure Synapse Runtime for Apache Spark 3.3](https://github.com/microsoft/synapse-spark-runtime/tree/main/Synapse/spark3.3)

## Next steps
- [Manage libraries for Apache Spark pools in Azure Synapse Analytics](apache-spark-manage-pool-packages.md)
- [Install workspace packages wheel (Python), jar (Scala/Java), or tar.gz (R)](apache-spark-manage-workspace-packages.md)
- [Manage packages through Azure PowerShell and REST API](apache-spark-manage-packages-outside-UI.md)
- [Manage session-scoped packages](apache-spark-manage-session-packages.md)
- [Apache Spark 3.3.1 Documentation](https://spark.apache.org/docs/3.3.1/)
- [Apache Spark Concepts](apache-spark-concepts.md)

## Migration between Apache Spark versions - support

For guidance on migrating from older runtime versions to Azure Synapse Runtime for Apache Spark 3.3 or 3.4 refer to [Runtime for Apache Spark Overview](./apache-spark-version-support.md#migration-between-apache-spark-versions---support).

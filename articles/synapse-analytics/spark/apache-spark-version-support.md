---
title: Apache Spark version support
description: Supported versions of Spark, Scala, Python, .NET
services: synapse-analytics
author: midesa 
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 05/26/2021
ms.author: midesa 
---

# Azure Synapse runtimes
Apache Spark pools in Azure Synapse use runtimes to tie together essential component versions, Azure Synapse optimizations, packages, and connectors with a specific Apache Spark version. These runtimes will be upgraded periodically to include new improvements, features, and patches. 

When you create a serverless Apache Spark pool, you will have the option to select the corresponding Apache Spark version. Based on this, the pool will come pre-installed with the associated runtime components and packages. These runtimes have the following advantages:

- Faster session startup times
- Tested compatibility with specific Apache Spark versions
- Access to popular, compatible connectors and open-source packages

> [!NOTE]
> - Maintenance updates will be automatically applied to new sessions for a given serverless Apache Spark pool. 
> - You should test and validate that your applications run properly when using new runtime versions.

## Supported Azure Synapse runtime releases 
The following table lists the runtime name, Apache Spark version, and release date for supported Azure Synapse Runtime releases.

|  Runtime name  | Release date |  Release stage |
| ----- | ----- | ----- |
| [Azure Synapse Runtime for Apache Spark 2.4](./apache-spark-24-runtime.md) | December 15, 2020 | GA|
| [Azure Synapse Runtime for Apache Spark 3.0](./apache-spark-3-runtime.md) | May 26, 2021 | Preview |

## Runtime release stages

## Preview runtimes
Azure Synapse Analytics provides previews to give you a chance to evaluate and share feedback on features before they become generally available (GA). While a runtime is available in preview, new dependencies and component versions may be introduced. Support SLAs are not applicable for preview runtimes. 

## Generally available runtimes
Generally available (GA) runtimes are open to all customers and are ready for production use. Once a runtime is generally available, security fixes and stability improvements may be backported. In addition, new components will only be introduced if they do not change underlying dependencies or component versions. 
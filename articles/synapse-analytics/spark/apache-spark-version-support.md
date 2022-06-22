---
title: Apache Spark version support
description: Supported versions of Spark, Scala, Python, .NET
author: DaniBunny 
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 04/20/2022
ms.author: dacoelho 
---

# Azure Synapse runtimes

Apache Spark pools in Azure Synapse use runtimes to tie together essential component versions such as Azure Synapse optimizations, packages, and connectors with a specific Apache Spark version. Each runtime will be upgraded periodically to include new improvements, features, and patches.

When you create a serverless Apache Spark pool, you will have the option to select the corresponding Apache Spark version. Based on this, the pool will come pre-installed with the associated runtime components and packages. The runtimes have the following advantages:

- Faster session startup times
- Tested compatibility with specific Apache Spark versions
- Access to popular, compatible connectors and open-source packages

> [!IMPORTANT]
> Azure Synapse Runtime for Apache Spark 3.2 is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!NOTE]
> - Maintenance updates will be automatically applied to new sessions for a given serverless Apache Spark pool. 
> - You should test and validate that your applications run properly when using new runtime versions.

> [!IMPORTANT]
> __Log4j 1.2.x security patches__
>
> Open-source Log4j library version 1.2.x has several known CVEs (Common Vulnerabilities and Exposures), as described [here](https://logging.apache.org/log4j/1.2/index.html).
>
> On all Synapse Spark Pool runtimes, we have patched the Log4j 1.2.17 JARs to mitigate the following CVEs: CVE-2019-1751, CVE-2020-9488, CVE-2021-4104, CVE-2022-23302, CVE-2022-2330, CVE-2022-23307
>
> The applied patch works by removing the following files which are required to invoke the vulnerabilities:
> * ```org/apache/log4j/net/SocketServer.class```
> * ```org/apache/log4j/net/SMTPAppender.class```
> * ```org/apache/log4j/net/JMSAppender.class```
> * ```org/apache/log4j/net/JMSSink.class```
> * ```org/apache/log4j/jdbc/JDBCAppender.class```
> * ```org/apache/log4j/chainsaw/*```
>
> While the above classes were not used in the default Log4j configurations in Synapse, it is possible that some user application could still depend on it. If your application needs to use these classes, use Library Management to add a secure version of Log4j to the Spark Pool. __Do not use Log4j version 1.2.17__, as it would be reintroducing the vulnerabilities.
>

## Supported Azure Synapse runtime releases 
The following table lists the runtime name, Apache Spark version, and release date for supported Azure Synapse Runtime releases.

|  Runtime name  | Release date |  Release stage |
| ----- | ----- | ----- |
| [Azure Synapse Runtime for Apache Spark 2.4](./apache-spark-24-runtime.md) | December 15, 2020 | GA|
| [Azure Synapse Runtime for Apache Spark 3.1](./apache-spark-3-runtime.md) | May 26, 2021 | GA |
| [Azure Synapse Runtime for Apache Spark 3.2](./apache-spark-32-runtime.md) | April 20, 2022 | Preview |

## Runtime release stages

## Preview runtimes
Azure Synapse Analytics provides previews to give you a chance to evaluate and share feedback on features before they become generally available (GA). While a runtime is available in preview, new dependencies and component versions may be introduced. Support SLAs are not applicable for preview runtimes. 

## Generally available runtimes
Generally available (GA) runtimes are open to all customers and are ready for production use. Once a runtime is generally available, security fixes and stability improvements may be backported. In addition, new components will only be introduced if they do not change underlying dependencies or component versions. 

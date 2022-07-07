---
title: Synapse runtime for Apache Spark lifecycle and supportability
description: Lifecycle and support policies for Synapse runtime for Apache Spark
author: DaniBunny 
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 07/7/2022
ms.author: dacoelho 
ms.reviewer: martinle
---

# Synapse runtime for Apache Spark lifecycle and supportability

Apache Spark pools in Azure Synapse use runtimes to tie together essential component versions such as Azure Synapse optimizations, packages, and connectors with a specific Apache Spark version. Each runtime will be upgraded periodically to include new improvements, features, and patches.

## Release cadence

Apache Spark is an open-source technology stack with a [somewhat regular release cadence and deprecation policies](https://spark.apache.org/versioning-policy.html). Azure Synapse runtimes for Apache Spark provides an expected release cadence and retirement policies so customer may create predictable and sustainable workload lifecycle.

Currently, the Apache Spark project releases minor versions about __every 6 months__. Once released, the Azure Synapse team expects to provide a __preview Runtime within 90 days__.

## Runtime lifecycle

The following diagram captures expected lifecycle paths for a Synapse runtime for Apache Spark.

![How to enable Intelligent Cache during new Spark pools creation](./media/runtime-for-apache-spark-lifecycle/runtime-for-apache-spark-lifecycle.png)

|  Runtime release stage  | Expected Lifecycle |  Notes | 
| ----- | ----- | ----- |
| Preview | 3 months | Should be used to evaluate new features and for validation of workload migration to new versions. <br/> Must not be used for production workloads. <br/> A Preview runtime may not be elected to move into a GA stage at Microsoft discretion; moving directly to EOLA stage. |
| Generally Available (GA) | 12 months | Generally available (GA) runtimes are open to all customers and are ready for production use. <br/> A GA runtime may not be elected to move into a LTS stage at Microsoft discretion. |
| Long Term Support (LTS) | 12 months | Long term support (LTS) runtimes are open to all customers and are ready for production use, yet customers are encouraged to expedite validation and workload migration to latest GA runtimes. |
| End of Life announced (EOLA) | 12 months for GA or LTS runtimes.<br/>1 month for Preview runtimes. | At the end of a GA or LTS period, an End-of-Life announcement will be made to all customers per [Azure retirements policy](https://docs.microsoft.com/lifecycle/faq/azure). This 12 month period serves as the exit ramp for customers to migrate workloads to a GA runtime. |
| End of Life (EOL) | - | At this stage, the Runtime is retired and no longer supported. |

> [!IMPORTANT]
>
> * The expected timelines are provided as best effort based on current Apache Spark releases. If the Apache Spark project changes lifecycle of a specific version affecting a Synapse runtime, changes to the stage dates will be noted within the release notes of a runtime.
> * A Preview runtime may not be elected to move into a GA stage.
> * Once a runtime reaches GA stage, it will be at that state for a minimum period of 12 months.
> * A GA stage runtime may not be elected to move into long term support (LTS).
> * Both GA and LTS runtimes may be moved into EOL stage faster based on inherited security risks, and runtime customer adoption and usage rates criteria. Proper notification will be performed based on current Azure service policies, please refer to [Lifecycle FAQ - Microsoft Azure](https://docs.microsoft.com/lifecycle/faq/azure) for information.
>

## Release stages and support

### Preview runtimes
Azure Synapse Analytics provides previews to give you a chance to evaluate and share feedback on features before they become generally available (GA). While a runtime is available in preview, new dependencies and component versions may be introduced. Support SLAs are not applicable for preview runtimes. 

At the end of the Preview lifecycle for the runtime, Microsoft will assess if the runtime will move into a Generally Availability (GA) based on customer usage, security and stability criteria; as described in the next section.

If not eligible for GA stage, the Preview runtime will move into the retirement cycle composed by the end of life announcement (EOLA), a 1 month period, then moving into the EOL stage.

### Generally available runtimes
Generally available (GA) runtimes are open to all customers and are ready for production use. Once a runtime is generally available, security fixes and stability improvements may be backported. In addition, new components will be introduced if they do not change underlying dependencies or component versions. 

At the end of the GA lifecycle for the runtime, Microsoft will assess if the runtime will have an extended lifecycle (LTS) based on customer usage, security and stability criteria; as described in the next section.

If not eligible for LTS stage, the GA runtime will move into the retirement cycle composed by the end of life announcement (EOLA), a 12 month period, then moving into the EOL stage.

### Long term support runtimes
Long term support (LTS) runtimes are open to all customers and are ready for production use, yet customers are encouraged to expedite validation and migration of code base and workloads to the latest GA runtimes. Customers should preferably not onboard new workloads using a LTS runtime. Security fixes and stability improvements may be backported. Yet, no new components or features will be introduced into the runtime at this stage.

### End of life announcement
At the end of the runtime lifecycle at any stage, an End of life announcement is performed. Proper notification will be performed based on current Azure service policies, please refer to [Lifecycle FAQ - Microsoft Azure](https://docs.microsoft.com/lifecycle/faq/azure) for information.

Support SLAs are applicable for EOL announced runtimes yet all customers must migrate to GA stage runtime. During the retirement period, no security fixes and stability improvements will be backported. No new Synapse Spark pools of such a version can be created, as the runtime version will not be listed on Azure Synapse Studio, Synapse API and Azure Portal.

Based on outstanding security issues and runtime usage, Microsoft reserves its right to expedite moving a runtime into the final EOL stage.

### End of life and retirement
After the period of End of life Announcement (EOLA), runtimes are considered retired.
* Existing Spark Pools definitions and metadata will still exist in the workspace for a defined period, yet __all pipelines, jobs and notebooks will not be able to execute__. 
* For runtimes coming from GA or LTS stages, Spark Pools definitions will be deleted in 60 days.
* For runtimes coming from a Preview stage, Spark Pools definitions will be deleted in 15 days.

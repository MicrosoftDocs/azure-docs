---
title: Synapse runtime for Apache Spark lifecycle and supportability
description: Lifecycle and support policies for Synapse runtime for Apache Spark
author: DaniBunny 
ms.service: synapse-analytics 
ms.topic: reference
ms.subservice: spark
ms.date: 06/29/2022
ms.author: dacoelho 
ms.reviewer: martinle
---

# Synapse runtime for Apache Spark lifecycle and supportability

Apache Spark pools in Azure Synapse use runtimes to tie together essential component versions such as Azure Synapse optimizations, packages, and connectors with a specific Apache Spark version. Each runtime will be upgraded periodically to include new improvements, features, and patches.

Apache Spark is an open-source technology stack with a [somewhat regular release cadence and deprecation policies](https://spark.apache.org/versioning-policy.html). Azure Synapse runtimes for Apache Spark provides an expected cadence so customer may create a predictable and sustainable workload lifecycle.

## Runtime lifecycle

|  Runtime release stage  | Expected Lifecycle |  Notes | 
| ----- | ----- | ----- |
| Preview | 3 months | Should be used to evaluate new features and for validation of workload migration to new versions. <br/> Must not be used for production workloads. <br/> A Preview runtime may not be elected to move into a GA stage based on adoption criteria |
| Generally Available (GA) | 15 months | Generally available (GA) runtimes are open to all customers and are ready for production use. |
| Long Term Support (LTS) | 12 months | Long term support (LTS) runtimes are open to all customers and are ready for production use, yet customers are encouraged to expedite validation and workload migration to latest GA runtimes. |

> [!IMPORTANT]
>
> * The expected cadences are provided as best effort based on current Apache Spark releases. If the Apache Spark project changes lifecycle of a specific version affecting a Synapse runtime, changes to the stage dates will be noted within the release notes of a runtime.
> * A Preview runtime may not be elected to move into a GA stage.
> * Once a runtime reaches GA stage, it will be at that state for a minimum period of 12 months.
> * A GA stage runtime may not be elected to move into long term support (LTS).
> * Both GA and LTS runtimes may be moved into EOL stage faster based on inherited security risks, and runtime customer adoption and usage rates criteria. Proper notification will be performed based on current Azure service policies, please refer to [Lifecycle FAQ - Microsoft Azure](https://docs.microsoft.com/lifecycle/faq/azure) for information.
>
>

## Runtime release stages and support

### Preview runtimes
Azure Synapse Analytics provides previews to give you a chance to evaluate and share feedback on features before they become generally available (GA). While a runtime is available in preview, new dependencies and component versions may be introduced. Support SLAs are not applicable for preview runtimes. 

### Generally available runtimes
Generally available (GA) runtimes are open to all customers and are ready for production use. Once a runtime is generally available, security fixes and stability improvements may be backported. In addition, new components will only be introduced if they do not change underlying dependencies or component versions. 

### Long term support runtimes
Long term support (LTS) runtimes are open to all customers and are ready for production use, yet customers are encouraged to expedite validation and migration of code base and workloads to the latest GA runtimes. Customers should not be onboarding new workloads into a LTS runtime. Security fixes and stability improvements may be backported reactively on customer request. Pool usage metrics and customer requests metrics will be used to control the remaining lifecycle of a runtime. In addition, no new components or features will be introduced.

### End of life runtimes
End of life (EOL) runtimes are considered deprecated and unsupported. Support SLAs are not applicable for EOL runtimes and all customers must migrate to GA stage runtime. Once a runtime is EOL, no security fixes and stability improvements will be backported. No new Synapse Spark pools of such a version can be created, as the runtime version will not be listed on Azure Synapse Studio, Synapse API and Azure Portal. Existing Spark Pools can still be run, yet no support is available.

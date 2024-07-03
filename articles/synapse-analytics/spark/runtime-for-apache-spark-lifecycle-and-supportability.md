---
title: Synapse runtime for Apache Spark lifecycle and supportability
description: Lifecycle and support policies for Synapse runtime for Apache Spark
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: eskot, sngun
ms.date: 03/08/2024
ms.service: synapse-analytics
ms.subservice: spark
ms.topic: reference
---

# Synapse runtime for Apache Spark lifecycle and supportability

Apache Spark pools in Azure Synapse use runtimes to tie together essential component versions such as Azure Synapse optimizations, packages, and connectors with a specific Apache Spark version. Each runtime is upgraded periodically to include new improvements, features, and patches.

## Release cadence

The Apache Spark project usually releases minor versions about __every 6 months__. Once released, the Azure Synapse team aims to provide a __preview runtime within approximately 90 days__, if possible.

## Runtime lifecycle

The following chart captures a typical lifecycle path for a Synapse runtime for Apache Spark.

:::image type="content" source="media/runtime-for-apache-spark-lifecycle/runtime-for-apache-spark-lifecycle.png" alt-text="How to enable Intelligent Cache during new Spark pools creation." lightbox="media/runtime-for-apache-spark-lifecycle/runtime-for-apache-spark-lifecycle.png":::

| Runtime release stage | Typical Lifecycle* | Notes |
| --- | --- | --- |
| Preview | Three months* | Microsoft Azure Preview terms apply. See [Preview Terms Of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/?cdn=disable). |
| Generally Available (GA) | 12 months* | Generally Available (GA) runtimes are open to all eligible customers and are ready for production use.<br />A GA runtime might not be elected to move into an LTS stage at Microsoft discretion. |
| Long Term Support (LTS) | 12 months* | Long term support (LTS) runtimes are open to all eligible customers and are ready for production use, but customers are encouraged to expedite validation and workload migration to latest GA runtimes. |
| End of Support announced | 12 months* for GA or LTS runtimes.<br />1 month* for Preview runtimes. | Before the end of a given runtime's lifecycle, we aim to provide 12 months' notice by publishing the End of Support Announcement date in the [Azure Synapse Runtimes page](./apache-spark-version-support.md) and 6 months' email notice to customers as an exit ramp to migrate their workloads to a GA runtime. |
| End of Support | - | At this stage, the runtime is retired and no longer supported. |

\* *Expected duration of a runtime in each stage. These timelines are provided as an example for a given runtime, and might vary depending on various factors. Lifecycle timelines are subject to change at Microsoft discretion.* 

\** *Your use of runtimes is governed by the terms applicable to your Azure subscription.*

> [!IMPORTANT]  
>  
> - The above timelines are provided as examples based on current Apache Spark releases. If the Apache Spark project changes the lifecycle of a specific version affecting a Synapse runtime, changes to the stage dates are noted on the [release notes](./apache-spark-version-support.md).
> - Both GA and LTS runtimes might be moved into End of Support stage faster based on outstanding security risks and usage rates criteria at Microsoft discretion.  
> - Please refer to [Lifecycle FAQ - Microsoft Azure](/lifecycle/faq/azure) for information about Azure lifecycle policies.
>

## Release stages and support

This section describes the different release stages and support for each stage.

### Preview runtimes

Azure Synapse Analytics provides previews to give you a chance to evaluate and share feedback on features before they become generally available (GA).

At the end of the preview lifecycle for the runtime, Microsoft will assess if the runtime moves into a Generally Availability (GA) based on customer usage, security, and stability criteria.

If not eligible for GA stage, the Preview runtime moves into the retirement cycle.

### Generally available runtimes

Once a runtime is Generally Available, only security fixes are backported. In addition, new components or features are introduced if they don't change underlying dependencies or component versions.

At the end of the GA lifecycle for the runtime, Microsoft will assess if the runtime has an extended lifecycle (LTS) based on customer usage, security, and stability criteria.

If not eligible for LTS stage, the GA runtime moves into the retirement cycle.

### Long term support runtimes

For runtimes that are covered by Long term support (LTS) customers are encouraged to expedite validation and migration of code base and workloads to the latest GA runtimes. We recommend that customers don't onboard new workloads using an LTS runtime. Security fixes and stability improvements might be backported, but no new components or features are introduced into the runtime at this stage.

### <a id="end-of-life-announcement"></a> End of Support announcement

Before the end of the runtime lifecycle at any stage, an end of support announcement is performed.

Support Service Level Agreements (SLAs) are applicable for End of Support announced runtimes, but all customers must migrate to a GA stage runtime no later than the End of Support date.

During the End of Support stage, existing Synapse Spark pools function as expected, and new pools of the same version can be created. The runtime version is listed on Azure Synapse Studio, Synapse API, or Azure portal. At the same time, we strongly recommend migrating your workloads to the latest General Availability (GA) runtimes.

If necessary due to outstanding security issues, runtime usage, or other factors, **Microsoft might expedite moving a runtime into the final End of Support stage at any time, at Microsoft's discretion.**

### <a id="end-of-life-date-and-retirement"></a> End of Support date and retirement

As of the applicable End of Support date, runtimes are considered retired and deprecated.
- It isn't possible to create new Spark pools using the retired version through Azure Synapse Studio, the Synapse API, or the Azure portal.

- The retired runtime version won't be available in Azure Synapse Studio, the Synapse API, or the Azure portal.

- Spark Pool definitions and associated metadata will remain in the Synapse workspace for a defined period after the applicable End of Support date. **However, all pipelines, jobs, and notebooks will no longer be able to execute.**

## Related content

- [Azure Synapse runtimes](apache-spark-version-support.md)
- [Manage libraries for Apache Spark in Azure Synapse Analytics](apache-spark-azure-portal-add-libraries.md)

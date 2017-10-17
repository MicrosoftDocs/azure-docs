---
title: Modify Azure Migrate assessment settings | Microsoft Docs
description: Describes how to set up and run an assessment for migrating VMware VMs to Azure using the Azure Migration Planner
services: migrate
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: a068b9c7-5f87-4fe1-90b9-3be48d91aa3f
ms.service: migrate
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/26/2017
ms.author: raynew

---
# Modify assessment settings

[Azure Migration Planner](migrate-overview.md) runs assessments for migration to Azure using default settings.

After running an assessment, follow the instructions in this article if you want to modify those defaults.


## Edit assessment values

1. In the Migration Planner project > **Assessments**, select the assessment, and click **Settings**.
2. In the **Settings** tab, modify the values in accordance with the table below.

## Assessment values

**Value** | **Details** | **Default**
--- | --- | ---
**Target location** | The Azure location to which you migrate. | By default this is the location in which you create the migration project you created.
**Storage redundancy** | The type of storage that the Azure VMs will use after migration. | Only [Locally redundant storage (LRS)](../storage/common/storage-redundancy.md#locally-redundant-storage) is currently available.
**Size** | Azure VM size | This is the size that Migration Planner recommends for the machine in Azure.
**Comfort factor** | Comfort factor to consider during assessment. It accounts for things such as seasonal usage, short performance history, likely increase in future usage.<br/><br/> For example, normally a 10-core VM with 20% utilization will result in a 2-core VM. But if it has a comfort factor of 2.0, the result will be a 4-core VM. | Default setting is 1.3.
**Perfomance history** | Time used in evaluating performance history. | Default is one month.
**Percentile utilization** | Percentile value of perfomance history. | Default used is 95%.
**Software assurance** | Indicates whether you're enrolled in [Azure Hybrid Use Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). If set to **Yes**, non-Windows Azure prices are considered for Windows VMs. | Set by default to Yes.
**Pricing tier** | VMs are offered on a [tier system](../virtual-machines/windows/sizes-general.md), to meet exact requirements. | By default the [Standard](../virtual-machines/windows/sizes-general.md) tier is used.
**Offer** | Azure offers that apply. | Only [pay-as-you-go](https://azure.microsoft.com/offers/ms-azr-0003p/) is currently available.
**Currency** | Billing currency | Only US dollars are currently supported.
**Stage** | Indicates whether you want to maintain the assessment status in order to review it with stakeholders. | The default setting is **In progress**. You can move it to **Under review** after you start the review, and then to **Approved** after the review is done.


## Next steps

[Learn more](concepts-assessment-calculation.md) about how assessments are calculated.

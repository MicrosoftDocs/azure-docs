---
title: Customize Azure Migrate assessment settings | Microsoft Docs
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
# customize assessment settings

After running an assessment for machines you want to migrate to Azure with [Azure Migrate](migrate-overview.md) , follow the instructions in this article if you want to customize assessment settings.


## Edit assessment values

1. In Azure Migrate project **Assessments** page, select the assessment, and click **Edit properties**.
2. Modify the settings in accordance with the table below.

    **Setting** | **Details** | **Default**
    --- | --- | ---
    **Target location** | The Azure location to which you want to migrate. | By default this is the location in which you create the migration project you created.
    **Storage redundancy** | The type of storage that the Azure VMs will use after migration. | Only [Locally redundant storage (LRS)](../storage/common/storage-redundancy.md#locally-redundant-storage) is currently supported.
    **Comfort factor** | Comfort factor is a buffer that is used during assessment. It accounts for things such as seasonal usage, short performance history, likely increase in future usage. | Default setting is 1.3.
    **Perfomance history** | Time used in evaluating performance history. | Default is one month.
    **Percentile utilization** | Percentile value to consider for perfomance history. | Default is 95%.
    **Pricing tier** | You can specify the [pricing tier](https://azure.microsoft.com/blog/basic-tier-virtual-machines-2/) for a VM.  | By default the [Standard](../virtual-machines/windows/sizes-general.md) tier is used.
    **Offer** | [Azure offers](https://azure.microsoft.com/support/legal/offer-details/) that apply. | [Pay-as-you-go](https://azure.microsoft.com/offers/ms-azr-0003p/) is the default.
    **Currency** | Billing currency | Default is US dollars.
    **Discount (%)** | Any subscription-specific discount you receive on top of any offer. | The default setting 0%.
    **Azure Hybrid Use Benefit** | Indicates whether you're enrolled in the [Azure Hybrid Use Benefit](https://azure.microsoft.com/pricing/hybrid-use-benefit/). If set to Yes, non-Windows Azure prices are consider for Windows VMs.

3. Click **Save** to update the assessment.


## Next steps

[Learn more](concepts-assessment-calculation.md) about how assessments are calculated.

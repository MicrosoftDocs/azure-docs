---
title: Azure Storage Migration Program Details
description: Overview of the Azure Storage Migration Program and how to use it
author: karauten
ms.author: karauten
ms.topic: concept-article
ms.date: 03/24/2022
ms.service: azure-storage
ms.subservice: storage-partner-integration
---

# Engaging with Azure Storage Migration Partners

In our [Migration tools comparison](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison) page, we highlighted cases where an Independent Software Vendor (ISV) partner solution is required or well-suited to meet specific source - target storage combinations. In this page, we share more details on the ISVs enrolled in our Storage Migration Program (SMP), how to engage with them, and answer common questions about the program.

## What is the Storage Migration Program?

Azure offers native migration tools for offline ([Azure Data Box](/azure/databox/data-box-overview)) and online ([Azure Storage Mover](/azure/storage-mover/service-overview)) data movement, but as the [tool comparison article](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison) highlights they are not able to address all source – target scenarios. As a result, we collaborated with the SMP partners to build support for data migration to Azure Storage Services.

This page only lists the partners participating in our Storage Migration program who offer their software to customers for free due to sponsorship from the Azure Storage team. This list is not a comprehensive list of vetted migration solution partners. You can find the full list of vetted migration partners [here](/azure/storage/solution-integration/validated-partners/data-management/partner-overview).

## Storage Migration Program Partners

__Free to use – refer to [FAQ](#faq) for program parameters__

- __[Atempo Miria](https://aka.ms/atempooffer)__ – Migrate files and objects to Azure Blob Storage, Azure Files, and Azure NetApp Files  

- __[Cirrus Migrate Cloud](https://aka.ms/cirrusoffer)__ – Migrate from Storage Area Networks and Block Storage

- __[Data Dynamics StorageX](https://aka.ms/datdynoffer)__ – Migrate files and objects to Azure Blob Storage, Azure Files, and Azure NetApp Files

- __[Komprise Elastic Data Migration](https://aka.ms/kompriseoffer)__ – Migrate files and objects to Azure Blob Storage, Azure Files, and Azure NetApp Files

> [!IMPORTANT]
> The list was last updated in March of 2025.

## FAQ
__Q:__ Is the program ___really___ free?

__A:__ Yes, the software IS free to use for migrations to Azure Storage services. However, if your need is continuous replication for disaster recovery or perpetual tiering of on-premises or Cloud-based data, you need separate licensing from the partner. Azure is only offsetting the cost of the software for one-time migration. We found that migration performance is often fastest when the data copy engines are running as Azure VMs – so there may be a small monthly cost for the VMs while the migration is underway.

 

__Q:__ What is provided by the ISV as part of the program?

__A:__ The software license to support your migration, an onboarding session (live or recorded education), and email based support.

The ISVs do have right of refusal to accept an engagement under 50 TB. They can suggest that you purchase a professional services or support contract if hands-on or phone support is required.

> [!IMPORTANT]
> Support is provided by the ISV, not Microsoft.

 

**Q:** How do I choose between the ISVs?

**A:** Review our [comparison page](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison) and select the solution that best matches your environment.


__Q:__ What paperwork or approvals are necessary?

__A:__ None. Reach out to [azure@atempo.com](mailto:azure@atempo.com), [azure@cirrusdata.com](mailto:azure@cirrusdata.com), [azure@komprise.com](mailto:azure@komprise.com), or [azure@datdyn.com](mailto:azure@datdyn.com).

 

__Q:__ Does participating in the program mean I am no longer eligible for other programs like the [Azure Migrate and Modernize](https://azure.microsoft.com/solutions/migration/migrate-modernize-innovate) (AMM) Program?

__A:__ No. The Storage Migration Program (SMP) is complimentary and additive to AMM. You can use AMM to migrate databases and VMs and use SMP to migrate the shared file or object store used by the same application. SMP does not impact the scope of your AMM engagement at all.

 

__Q:__ What if my source files and objects are on another cloud?

__A:__ You can use the program and tools to move the data from either on-premises or another cloud to Azure Storage. CIFS/SMB, NFS, and S3 compatible sources outside of Azure are all eligible.

 

__Q:__ I am concerned that my available bandwidth is a problem and migration may impact day-to-day business. How can I be sure the copy activity is not disruptive?

__A:__ Each partner has the experience and the tooling to help guide a nonimpactful migration. Komprise developed a tool to identify bottlenecks and use that data to tune migration parameters and windows accordingly, for example. If bandwidth and project windows are a problem, you can use Azure DataBox for initial seeding. The ISVs do a tremendous amount of work continuously to improve copy performance and efficiency as Komprise illustrates with [HyperTransport](https://www.komprise.com/blog/komprise-hypertransfer-is-here-turbocharge-your-cloud-migrations/).

 

__Q:__ How long is the program running? What about [Azure Storage Mover](/azure/storage-mover/service-overview)?

__A:__ We do not have an end date for the Azure Storage Migration Program. Microsoft is committed to our relationships with Atempo, Cirrus Data, Data Dynamics, and Komprise and received excellent feedback. One year’s notice is expected before the discontinuation of the Storage Migration Program.

Storage Mover is a maturing service and the supported source - target pairings will increase over time. Our partners have robust offerings today that support every combination of migration scenario encountered. Their robust features helped customers save money by selectively moving data from a single source to multiple targets. The movement is based on business value. Example: Older files are migrated to Azure Blob Storage Cold or Archive tier and active data migrated to Azure Files or Azure NetApp Files. We expect Storage Mover and the Storage Migration Program to coexist for some time.

## Next steps

- [Learn more about Storage migration](../../../common/storage-migration-overview.md)

- [Choose an Azure solution for data transfer](../../../common/storage-choose-data-transfer-solution.md?toc=/azure/storage/blobs/toc.json)

- [Migrate to Azure file shares](../../../files/storage-files-migration-overview.md)

- [Migrate to Data Lake Storage with WANdisco LiveData Platform for Azure](../../../blobs/migrate-gen2-wandisco-live-data-platform.md)

- [Copy or move data to Azure Storage with AzCopy](../../../common/storage-use-azcopy-v10.md)

- [Migrate large datasets to Azure Blob Storage with AzReplicate (sample application)](/samples/azure/azreplicate/azreplicate/)

> [!IMPORTANT]
> Support provided by ISV, not Microsoft

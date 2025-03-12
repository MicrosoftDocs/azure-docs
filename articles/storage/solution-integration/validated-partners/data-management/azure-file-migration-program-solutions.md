---
title: Comparison of migration tools in Azure Storage Migration Program
description: Basic functionality and comparison between migration tools supported by Azure Storage Migration Program
author: dukicn
ms.author: nikoduki
ms.topic: conceptual
ms.date: 03/24/2022
ms.service: azure-storage
ms.subservice: storage-partner-integration
---

# Engaging with Azure Storage Migration Partners

In our [Migration tools comparison](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison) page, we highlighted cases where an ISV partner solution is required or well-suited to meet specific source - target storage combinations. In this page, we share more details on the ISVs enrolled in our Storage Migration Program, how to engage with them, and answer common questions about the program.

## What is the Storage Migration Program and are all the partners below included?

Azure offers native migration tools for offline ([Azure Data Box](/azure/databox/data-box-overview)) and online ([Azure Storage Mover](/azure/storage-mover/service-overview)) data movement, but as the [tool comparison article](/azure/storage/solution-integration/validated-partners/data-management/migration-tools-comparison) highlights they are not able to address all source – target scenarios. As a result, we have collaborated with the partners below to build support for data migration to Azure Storage Services.

This page only lists the partners participating in our Storage Migration program who offer their software to customers for free due to sponsorship from the Azure Storage team. This is not a comprehensive list of vetted migration solution partners. You can find the full list of vetted migration partners [here](/azure/storage/solution-integration/validated-partners/data-management/partner-overview).

## Storage Migration Program Partners

__Free to use – refer to [FAQ]() for program parameters__

__[Atempo Miria](https://aka.ms/atempooffer)__ – Migrate files and objects to Azure Blob Storage, Azure Files, and Azure NetApp Files  

__[Cirrus Migrate Cloud ](https://aka.ms/cirrusoffer)__– Migrate from Storage Area Networks and Block Storage

__[Data Dynamics StorageX ](https://aka.ms/datdynoffer)__– Migrate files and objects to Azure Blob Storage, Azure Files, and Azure NetApp Files

__[Komprise Elastic Data Migration ](https://aka.ms/kompriseoffer)__– Migrate files and objects to Azure Blob Storage, Azure Files, and Azure NetApp Files

__Note__

List was last updated in March of 2025.

## FAQ

__Q:__ Is the program ___really___ free?

__A:__ Yes, the software IS free to use for migrations to Azure Storage services. However, if your need is continuous replication for disaster recovery or perpetual tiering of on-premises or Cloud-based data, you will need separate licensing from the partner. Azure is only offsetting the cost of the software for one-time migration. We have also found that migration performance is often fastest when the data copy engines are running as Azure VMs – so there may be a small monthly cost for the VMs while the migration is underway.

 

__Q:__ What is provided by the ISV as part of the program?

__A:__ The software license to support your migration, an onboarding session (live or recorded education), and email based support.

The ISVs do have right of refusal to accept an engagement under 50TB or suggest that professional services or a support contract is purchased if hands-on support is requested or you require phone support.

__Important -__ Support is provided by the ISV, not Microsoft.

 

__Q:__ What paperwork or approvals are necessary?

__A:__ None. Reach out to [azure@atempo.com](mailto:azure@atempo.com), [azure@cirrusdata.com](mailto:azure@cirrusdata.com), [azure@komprise.com](mailto:azure@komprise.com), or [azure@datdyn.com](mailto:azure@datdyn.com).

 

__Q:__ Does participating in the program mean I am no longer eligible for other programs like the [Azure Migrate and Modernize](https://azure.microsoft.com/en-us/solutions/migration/migrate-modernize-innovate) (AMM) Program?

__A:__ No. The Storage Migration Program (SMP) is complimentary and additive to AMM. You can use AMM to migrate databases and VMs and use SMP to migrate the shared file or object store used by the same application. SMP does not impact the scope of your AMM engagement at all.

 

__Q:__ What if my source files and objects are on another cloud?

__A:__ You can leverage the program and tools to move the data from either on-premises or another cloud to Azure Storage. CIFS/SMB, NFS, and S3 compatible sources outside of Azure are all eligible.

 

__Q:__ I am concerned that bandwidth will be a problem and migration will impact day-to-day business. How can I be sure the copy activity will not be disruptive?

__A:__ Each partner has the experience and the tooling to help guide a non-impactful migration. Komprise developed a tool to identify bottlenecks and use that data to tune migration parameters and windows accordingly, for example. If bandwidth and project windows are a problem, each can use Azure DataBox for initial seeding and has done a tremendous amount of work to continuously improve copy performance and efficiency as Komprise illustrates with [HyperTransport](https://www.komprise.com/blog/komprise-hypertransfer-is-here-turbocharge-your-cloud-migrations/).

 

__Q:__ How long will the program continue? What about [Azure Storage Mover](/azure/storage-mover/service-overview)?

__A:__ We do not have an end date for the Azure Storage Migration Program. Microsoft is committed to our relationships with Atempo, Cirrus Data, Data Dynamics and Komprise and have received tremendous feedback. We will provide at least one year’s notice prior to discontinuing the Storage Migration Program.

Storage Mover is a maturing service and the supported source/target pairings will increase over time, but our partners have robust offerings today that have supported each and every combination of migration scenarios we have encountered. Also, their robust features have helped customers save money by selectively moving data from a single source to multiple targets based on business value (ex. Older, untouched files/objects migrated to Azure Blob Storage Cool or Archive tier while active data is migrated to Azure Files, Azure NetApp Files, or Azure Blob Storage Hot or Premium tier).

## Next steps

- [Azure Storage Migration Program](https://www.microsoft.com/en-us/us-partner-blog/2022/02/23/new-azure-file-migration-program-streamlines-unstructured-data-migration/)
- [Storage migration overview](../../../common/storage-migration-overview.md)
- [Choose an Azure solution for data transfer](../../../common/storage-choose-data-transfer-solution.md?toc=/azure/storage/blobs/toc.json)
- [Migrate to Azure file shares](../../../files/storage-files-migration-overview.md)
- [Migrate to Data Lake Storage with WANdisco LiveData Platform for Azure](../../../blobs/migrate-gen2-wandisco-live-data-platform.md)
- [Copy or move data to Azure Storage with AzCopy](../../../common/storage-use-azcopy-v10.md)
- [Migrate large datasets to Azure Blob Storage with AzReplicate (sample application)](/samples/azure/azreplicate/azreplicate/)

> [!IMPORTANT]
> Support provided by ISV, not Microsoft

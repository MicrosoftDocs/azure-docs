---
title: Azure Storage migration strategy
description: Azure Storage migration strategy guide describes basic guidance for storage migration strategies to Azure
author: bapic
ms.author: bchakra
ms.topic: concept-article 
ms.date: 08/11/2025
ms.service: azure-storage
ms.subservice: storage-common-concepts
---

<!--
Initial score: 68 (1031/44)
Current score: 100 (1426/0)
-->

# Plan the migration strategy

Choosing the right migration strategy is critical, as it can significantly affect project timelines, costs, and overall business continuity. With careful planning and a thoughtful approach, you can ensure a smooth and efficient transition for your data assets.

## Choose online vs. offline transfer

When planning your migration strategy, it's essential to determine the most suitable transfer method for your data. Online migrations are simplest for both one-time and recurring delta syncs. However, in cases where network bandwidth is limited, constrained, unreliable, or even nonexistent, an offline transfer might be the most feasible option. This situation might also be true even when bandwidth isn't a concern, but your data set is measured in terabytes or petabytes.

When data continues to change during migration, a hybrid approach is often the most effective—especially when network bandwidth is limited. This method involves using offline mode to transfer the bulk of the data initially, followed by online delta synchronizations to capture ongoing changes.

If network constraints aren't a concern, an online-only migration is also viable. This approach uses a tool that continuously syncs data until the remaining delta is minimal, allowing for a final cutover at a time that suits your schedule.

To determine the best migration strategy, consider factors such as data volume, frequency of updates, available bandwidth, and project timeline. These elements help guide the choice between offline, online, or hybrid modes. The choice of transfer mode depends on your specific use case and requirements. However, factors such as timeline, available bandwidth, and data volume influence the final decision.

The following table outlines estimated migration durations. These values are based on data size and available on-premises bandwidth, assuming up to 90% utilization. If the projected time is unacceptable, using a physical device for offline transfer might be more suitable. You can also combine offline and online methods as needed.

For reference:

- Red cells suggest offline migration is preferable when 25 days are too long or costly, or when bandwidth is limited.
- Green cells indicate ideal candidates for online migration, assuming a transfer window of less than 25 days is acceptable.
- Blue cells represent scenarios where either method—or a combination—might be appropriate depending on specific needs.

:::image type="content" source="media/storage-migration-planning-strategy/migration-duration-table.png" alt-text="A table showing online data migration durations for specific data sizes and network throughput." lightbox="media/storage-migration-planning-strategy/migration-duration-table-lrg.png":::

Contact your Microsoft representative for guidance if you have questions at any point in time.

> [!TIP]
> A key principle in Azure migration is minimizing downtime by transferring most of the data in advance. By the time of the final cutover, Azure should already hold an up-to-date copy of the source data. This approach ensures that the last synchronization is quick and the switchover happens smoothly.

## Lift-and-shift data migration

For the purposes of this article, "lift-and-shift" is a migration approach where data and applications are moved from on-premises infrastructure to Azure, with minimal changes to the existing architecture. This method is fast and straightforward, making it ideal for organizations aiming to modernize their infrastructure quickly without redesigning their applications.

This approach is useful for scenarios where the data is already structured and can be easily transferred to Azure storage services. It allows organizations to take advantage of Azure's scalability, reliability, and security features while maintaining their existing applications and workflows.

While this approach is common in cloud migrations, it's important to account for source workloads that might continue to change during the transfer. In such cases, delta synchronization is essential to ensure data consistency.

Choosing the right tools is critical for the initial migration or data seeding, but also for handling ongoing changes through delta syncs. The next section will explore recommended tools and strategies to support both phases of the migration.

## Data change rate and tiering

Choosing the right migration solution depends on how frequently the data changes, its access frequency, and the tool's ability to perform iterative synchronization. For workloads with frequent updates or high access rates, use specialized tools such as Azure Data Mover or trusted partner solutions that support continuous online transfers.

This guidance also applies when dealing with a large number of files, especially when the volume reaches tens of millions. In such cases, selecting the appropriate tool based on the source environment, target capabilities, and available bandwidth is essential.

Unmanaged tools like robocopy, AzCopy, distCP, and rsync might face scalability challenges when handling large file sets in a single transfer job. It's important to [review optimization strategies for AzCopy](storage-use-azcopy-optimize.md) and consult the official documentation for each tool to understand current performance limits and scale recommendations.

Similar considerations apply whether or not data tiering is part of the migration strategy. In some scenarios, tiering between data and cloud environments is maintained as an ongoing data management practice.

## Data movement and hybrid storage

When planning an Azure migration, it's important to determine whether your data resides entirely in the cloud, or if an on-premises cache is required. This distinction helps define how the data is accessed post-migration, and influences the overall architecture of the solution.

Another key consideration is whether the migration involves a one-time transfer or requires ongoing synchronization. If data needs to be moved repeatedly, identify the frequency of these transfers and the volume of data involved. These factors help in selecting tools that can handle the load efficiently and maintain consistency across environments.

It's also essential to determine the direction of synchronization. If the data must remain accessible and up-to-date in both the cloud and on-premises environments, a bi-directional sync might be necessary. In contrast, if data only needs to flow in one direction, a unidirectional sync might suffice.

These decisions—cloud-only versus hybrid storage, one-time versus repetitive transfers, and uni-directional versus bi-directional synchronization—guide the selection of migration tools and influence how the migration is executed. During the next migration phase, recommended tools and configurations are reviewed to help support these scenarios effectively.

## Replication as a migration strategy

In certain scenarios, data migration can be effectively managed using replication tools. These tools continuously copy data from a source environment to Azure, ensuring that the destination remains synchronized throughout the migration process. 

For example, Azure Migrate supports replication of on-premises physical and virtual machines, including their disks and embedded data, to Azure virtual machines. It offers a comprehensive solution that includes planning, monitoring replication health, managing cutover, and orchestrating the entire migration workflow. During the process, on-premises disks are converted into Azure-managed disks, streamlining integration with cloud infrastructure.

Independent software vendor (ISV) solutions such as *Carbonite Migrate* and *Veeam Backup and Replication* also rely on replication technologies to transfer large volumes of data. These tools often require separate deployment and configuration but offer advanced capabilities such as premigration testing, real-time synchronization, and reduced downtime during cutover.

Replication-based migration is useful when minimizing disruption is a priority. It allows organizations to maintain operational continuity while gradually transitioning workloads to Azure. Selecting the right replication tool depends on factors such as infrastructure complexity, data volume, and the need for ongoing synchronization.

## Backup and restore as a migration strategy

A traditional backup and restore method can sometimes serve as an effective migration strategy. This approach is ideal when migrating archival or historical data that doesn't require real-time access or frequent updates.

It's also suitable when the source systems don't support modern migration tools, or when migrating noncritical workloads that can tolerate some downtime. Development and test environments often fall into this category as simplicity and speed are prioritized over continuous availability.

Additionally, a backup and restore approach is a practical choice when legal requirements dictate that data be preserved at a specific point in time. In such cases, maintaining a snapshot through backup ensures compliance while enabling controlled restoration in Azure.

Although this method might not offer the automation or scale of replication-based or online migration tools, it remains a reliable option for some specific use cases. The next phase describes how to implement this strategy effectively by utilizing tools that support backup and restore operations for Azure.

## Next steps

Review the following resources for more information on this subject.

- [Azure Storage Migration Tools Comparison](../solution-integration/validated-partners/data-management/migration-tools-comparison.md)
- [Microsoft Azure Data Box overview](../../databox/data-box-overview.md)
- [Introduction to Azure Storage Mover](../../storage-mover/service-overview.md)
- [Combine Azure Storage Mover and Azure Data Box](https://techcommunity.microsoft.com/blog/azurestorageblog/storage-migration-combine-azure-storage-mover-and-azure-data-box/4143354)
- [Copy or move data to Azure Storage by using AzCopy v10](storage-use-azcopy-v10.md)
- [Migration and modernization tool - Azure Migrate](../../migrate/tutorial-migrate-vmware.md)
- [Azure Storage Migration Program Details](../solution-integration/validated-partners/data-management/azure-file-migration-program-solutions.md)
- [Introduction to Azure File Sync](../file-sync/file-sync-introduction.md)
- [Azure Data Factory quickstart](../../data-factory/quickstart-get-started.md)

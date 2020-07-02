---
title: 'Data Lake Storage and WANdisco LiveData Migrator for Azure'
description: Migrate on-premises Hadoop data to Azure Data Lake Storage by using WANdisco LiveData Migrator for Azure.
author: normesta
ms.topic: how-to
ms.author: normesta
ms.reviewer: b-pauls
ms.date: 06/08/2020
ms.service: storage
ms.subservice: data-lake-storage-gen2
---

# Meet demanding migration requirements with WANdisco LiveData Migrator for Azure

Migrate on-premises Hadoop data to Azure Data Lake Storage by using [WANdisco LiveData Platform](https://docs.wandisco.com/live-data-platform/docs/landing/) to reduce business risk and cost overruns by eliminating the need for application downtime, removing the chance of data loss, and ensuring data consistency even while operations continue on-premises. It uses a unique, wide-area network capable consensus engine to achieve data consistency and to implement data migration with consistency guarantees. Use this platform to:

- Rapidly **provision a LiveData service** that supports simple and advanced migration needs.
- **Reduce the cost and risk** of bringing your business-critical data to [Azure Data Lake Storage](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-introduction).
- **Continue to run** your on-premises big data operations while migration is in progress.

Unlike migrating data by [copying static information to Azure Data Box](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-migrate-on-premises-hdfs-cluster), or by using Hadoop tools like [DistCp](https://hadoop.apache.org/docs/current/hadoop-distcp/DistCp.html), you don't need to plan for an extended outage of your business systems during migration. Keep your big data environments in full operation even while moving their data to Azure.

## Migrate big data faster without risk

Big data migrations can be complex and challenging. Moving petabytes of information without disrupting business operations has been a significant risk and cost to many organizations, preventing them from leveraging the capabilities of Azure easily. By simplifying deployment and establishing a LiveData Service with continuous data migration and replication while applications read, write and modify the data being migrated, LiveData Migrator for Azure can answer these challenges.

Performing a migration is as simple as these three steps:

1. Define the location of the data that you want to migrate in a replication rule. For example, `/user/hive/warehouse`.
2. Specify the source and target for your migration. For example, on-premises cluster to Azure Data Lake Storage Gen2.
3. Start the migration.

Monitor the migration progress through standard Azure tooling, and continue to use your on-premises environment throughout.

## Key features of LiveData Migrator

- **Data consistency**: Solve the challenges of migrating large data volumes between environments and keeping those data consistent across storage systems throughput migration, even while they are under continual change. Employ WANdisco's unique, wide-area network capable consensus engine directly in Azure to achieve data consistency and to migrate data with consistency guarantees throughout data changes.

- **Maintain operations**: Because applications can continue to create, modify, read and delete data during migration, there is no need to disrupt business operations or introduce an outage window just to migrate big data to Azure. Continue to operate applications, analytics infrastructure, ingest jobs, and other processing.

- **Validate outcomes**: End-to-end validation that your data can be used effectively once migrated to Azure requires that you run production application workloads against them. Only a LiveData Service provides this without introducing the risk of data divergence, by maintaining data consistency regardless of whether change occurs at the source or target of your migration. Test and validate application behavior without risk or change to your processes and systems.

- **Reduce complexity**: Eliminate the need to create and manage scheduled jobs to copy data by migrating data through automation. Use the deep integration with Azure as a control plane to manage and monitor migration progress, including selective data replication, Hive metadata, data security and confidentiality.

- **Efficiency**: Maintain high throughput and performance, and scale to arbitrarily large data volumes easily. With full control of bandwidth consumption, you can ensure that you can meet your migration goals without impacting other system operations.

## Next steps

- [LiveData Migrator](https://docs.wandisco.com/live-data-platform/docs/landing/) for Azure is used like any other Azure resource, and is available in preview now. Consult WANdisco's documentation for LiveData Migrator to understand the [prerequisites](https://docs.wandisco.com/live-data-platform/docs/prereq/), plan your migration, and complete a large-scale migration rapidly with LiveData Migrator.

- Access the _LiveData Migrator preview_ (<- link to WANdisco landing page) now to get started.
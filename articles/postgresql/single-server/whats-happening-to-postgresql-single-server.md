---
title: What's happening to Azure Database for PostgreSQL single server?
description: The Azure Database for PostgreSQL single server service is being deprecated.
author: markingmyname
ms.author: maghan
ms.reviewer: sunila
ms.date: 03/29/2023
ms.service: postgresql
ms.subservice: single-server
ms.topic: overview
ms.custom: single server deprecation announcement
---

# What happens to Azure Database for PostgreSQL - Single Server after the retirement announcement?

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

**Azure Database for PostgreSQL - Single Server is on the retirement path** is on the retirement path and is scheduled for retirement by March 28, 2025.

Azure Database for PostgreSQL – Single Server generally became available in 2018. However, given customer feedback and new advancements in the computation, availability, scalability, and performance capabilities in the Azure database landscape, the Single Server offering needs to be retired and upgraded with a new architecture – Azure Database for PostgreSQL Flexible Server to bring you the best of Azure’s open-source database platform.

As part of this retirement, we no longer support creating new Single Server instances from the Azure portal beginning November 30, 2023. If you need to create Single Server instances to meet business continuity needs, you can continue to use  Azure CLI,

If you currently have an Azure Database for PostgreSQL - Single Server service hosting production servers, we're glad to inform you that you can migrate your Azure Database for PostgreSQL - Single Server servers to the Azure Database for PostgreSQL - Flexible Server service. 

Azure Database for PostgreSQL - Flexible Server is a fully managed production-ready database service designed for more granular control and flexibility over database management functions and configuration settings. For more information about flexible servers, visit **[Azure Database for PostgreSQL - Flexible Server](../flexible-server/overview.md)**.

## Migrate from a single server to a flexible server

Learn how to migrate from Azure Database for PostgreSQL - Single Server to Azure Database for PostgreSQL - Flexible Server using the [Single to Flexible Server Migration Tool](../migrate/concepts-single-to-flexible.md).

## Frequently Asked Questions (FAQs)

**Q. Why is Azure Database for PostgreSQL-single server being retired?**

**A.** Azure Database for PostgreSQL -  single server generally became available in 2018. However, given customer feedback and new advancements in the computation, availability, scalability, and performance capabilities in the Azure database landscape, the single server offering needs to be retired and upgraded with a new architecture – Azure Database for PostgreSQL flexible server to bring you the best of Azure's open-source database platform.

**Q. Why am I being asked to migrate to Azure Database for PostgreSQL - Flexible Server?**

**A.** [Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/overview) is the best platform for running all your open-source PostgreSQL workloads on Azure. Azure Database for PostgreSQL- flexible server is economical, provides better performance across all service tiers, and more ways to control your costs for cheaper and faster disaster recovery. Other improvements to the flexible server include:

- Support for Postgres version 11 and newer, plus built-in security enhancements
- Better price performance with support for burstable tier compute options.
- Improved uptime by configuring hot standby on the same or a different availability zone and user-controlled maintenance windows.
- A simplified developer experience for high-performance data workloads.

**Q. How soon must I migrate my single server to a flexible server?**

**A.** Azure Database for PostgreSQL - Single Server is scheduled for retirement by March 28, 2025, so we strongly recommend migrating your single server to a flexible server at the earliest opportunity to ensure ample time to run through the migration lifecycle and use the benefits offered by the flexible server.

**Q. What happens to my existing Azure Database for PostgreSQL - Single Server instances?**

**A.** Your existing Azure Database for PostgreSQL - Single Server workloads continue to be supported until March'2025.

**Q. Can I still create a new version 11 Azure Database for PostgreSQL single servers after the community EOL date in November 2023?**

**A.** Beginning November 9, 2023, you'll no longer be able to create new single server instances for PostgreSQL version 11 through the Azure portal. However, you can still [make them via CLI until November 2024](https://azure.microsoft.com/updates/singlepg11-retirement/). We continue to support single servers through our [versioning support policy.](/azure/postgresql/single-server/concepts-version-policy) It would be best to start migrating to Azure Database for PostgreSQL - Flexible Server immediately.

**Q. Can I continue running my Azure Database for PostgreSQL - Single Server instances beyond the sunset date of March 28, 2025?**

**A.** We plan to support a single server at the sunset date of March 28, 2025, and we strongly advise that you start planning your migration as soon as possible. We plan to end support for single server deployments at the sunset data of March 28, 2025.

**Q. After the single server retirement announcement, what if I still need to create a new single server to meet my business needs?**

**A.** We aren't stopping the ability to create new single servers immediately, so you can continue to create new single servers through CLI to meet your business needs for all Postgres versions supported on Azure Database for PostgreSQL – single server. We strongly encourage you to explore a flexible server for the scenario and see if that can meet the need. Don't hesitate to contact us if necessary so we can better guide you in these scenarios and suggest the best path forward.

**Q. Are there any additional costs associated with performing the migration?**

**A.** You pay for the target flexible server and the source single server during the migration. The configuration and computing of the target flexible server determine the extra costs incurred (see [Pricing](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/) for more details). Once you've decommissioned the source single server after a successful migration, you only pay for your flexible server. There's no extra cost to use the single server to flexible server migration tool. If you have questions or concerns about the cost of migrating your single server to a flexible server, contact your Microsoft account representative.

**Q. Will my billing be affected by running Azure Database for PostgreSQL - Flexible Server instead of Azure Database for PostgreSQL - Single Server?**

**A.** The billing should be comparable if you choose a similar configuration to your Azure Database for PostgreSQL - Single Server. However, if you select the same zone or zone redundant with high availability for the target flexible server, your bill is higher than on a single server. Same zone or zone redundant high availability requires an additional hot standby server to be spun up and store redundant backup data, hence the added cost for the second server. This architecture enables reduced downtime during unplanned outages and planned maintenance. Generally speaking, flexible server provides better price performance. However, this is dependent on your workload.

**Q. Will I incur downtime when I migrate my Azure Database from PostgreSQL - single server to a flexible server?**

**A.** Currently, The Single to Flexible Server Migration Tool only supports offline migrations, and support for online migration is coming soon. Offline migration requires downtime to your applications during the migration process. [Learn more about The Single to Flexible Server Migration Tool](../migrate/concepts-single-to-flexible.md).

Downtime depends on several factors, including the number of databases, size of your databases, number of tables inside each database, number of indexes, and the distribution of data across tables. It also depends on the SKU of the source and target server and the IOPS available on the source and target server.

Given the many factors involved in a migration, the best approach to estimate downtime to your application is to try the migration on a PITR server restored from the primary server to plan for your production migration.

Offline migrations are less complex, with few chances of failure, and are the recommended way to perform migrations from a single server to a flexible server for workloads with service windows.

You can contact your account teams if downtime requirements aren't met by the Offline migrations provided by a single server to a Flexible migration tool.

**Q. Will there be future updates to single server to support the latest PostgreSQL versions?**

**A.** We recommend you migrate to flexible server if you must run on the latest PostgreSQL engine versions. We continue to deploy minor versions released by the community for Postgres version 11 until it's retired by the community in Nov'2023.

> [!NOTE]
> We're extending support for Postgres version 11 past the community retirement date and will support PostgreSQL version 11 on both [single server](https://azure.microsoft.com/updates/singlepg11-retirement/) and [flexible server](https://azure.microsoft.com/updates/flexpg11-retirement/) to ease this transition. Consider migrating to a flexible server to use the benefits of the latest Postgres engine versions.
    
**Q. How does the flexible server's 99.99% availability SLA differ from a single server?**

**A.** Flexible server's zone-redundant deployment provides 99.99% availability with zonal-level resiliency, and a single server delivers 99.99% availability but without zonal resiliency. Flexible server's High Availability (HA) architecture deploys a hot standby server with redundant compute and storage (with each site's data stored in 3x copies). A single server's HA architecture doesn't have a passive hot standby to help recover from zonal failures. Flexible server's HA architecture reduces downtime during unplanned outages and planned maintenance.

**Q. My single server is deployed in a region that doesn't support flexible servers. How should I proceed with migration?**

**A.** We're close to regional parity with a single server. However, these are the regions with no flexible server presence.

- China East (CE and CE2),
- China North (CN and CN2)
- West India
- Sweden North

We recommend migrating to CN3/CE3, Central India, and Sweden South regions.

**Q. I have a private link configured for my single server, and this feature is not currently supported in flexible servers. How do I migrate?**

**A.** Flexible server support for private-link is our highest priority and on the roadmap. This feature is planned to launch in Q4 2023. Another option is to consider migrating to VNET injected flexible server.

**Q. Is there an option to roll back a single server to a flexible server migration?**

**A.** You can perform any number of test migrations, test the success of your migration, and perform the final migration once you're ready. Test migrations don't affect the single server source, which remains operational until you perform the migration. If there are any errors during the test migration, you can postpone the final migration and keep your source server running. You can then reattempt the final migration after you resolve the errors. After you've performed a final migration to a flexible server and opened it up for the production workload, you'll lose the ability to go back to single server without incurring a data loss.

**Q. How should I migrate my DB (> 1TB)**

**A.** [The Single to Flexible Server Migration Tool](../migrate/concepts-single-to-flexible.md) can migrate databases of all sizes from a single server to a flexible server. The new version of the tool has no restrictions regarding the size of the databases.

**Q. Is cross-region migration supported?**

**A.** Currently, The Single to Flexible Server Migration Tool doesn't support cross-region migrations. It is supported at a later point in time. You can use the pg_dump/pg_restore to perform migrations across regions.

Cross-region data migrations should be avoided because the migration takes a long time to complete. A simpler way to do this will be to start a read-replica in the target GeoRegion, failover your application, and follow the steps outlined earlier.

**Q. Is cross-subscription migration supported?** 
**A.** The Single to Flexible Server Migration Tool supports cross-subscription migrations.

**Q. Is cross-resource group subscription-supported?** 
**A.** The Single to Flexible Server Migration Tool supports cross-resource group migrations.

**Q. Is there cross-version support?** 
**A.** The single to flexible server Migration Service supports migrating from a lower PostgreSQL version (PG 9.5 and above) to any higher version. As always, application compatibility with higher PostgreSQL versions should be checked beforehand.

### Single to Flexible Server Migration Tool

The [Single to Flexible Server Migration Tool](/azure/postgresql/migrate/concepts-single-to-flexible) is a powerful tool that allows you to migrate your SQL Server database from a single server to a flexible server with ease. With this tool, you can easily move your database from an on-premises server or a virtual machine to a flexible server in the cloud, allowing you to take advantage of the scalability and flexibility of cloud computing.

**Q. Which data, schema, and metadata components are migrated as part of the migration?**

**A.** The Single to Flexible Server Migration Tool migrates schema, data, and metadata from the source to the destination. All the following data, schema, and metadata components are migrated as part of the database migration:

Data Migration

- All tables from all databases/schemas.

Schema Migration:
- Naming
- Primary key
- Data type
- Ordinal position
- Default value
- Nullability
- Autoincrement attributes
- Secondary indexes

Metadata Migration:
- Stored Procedures
- Functions
- Triggers
- Views
- Foreign key constraints

**Q. What's the difference between offline and online migration?**

**A.** The Single to Flexible Server Migration Tool supports offline migration now, with online migrations coming soon. With an offline migration, application downtime starts when the migration begins. With an online migration, downtime is limited to the time required to cut over at the end of migration but uses a logical replication mechanism. Your Data/Schema must pass these [open-source PG engine restrictions](https://www.postgresql.org/docs/13/logical-replication-restrictions.html) for online migration. We suggest you test offline migration to determine whether the downtime is acceptable.

Online and Offline migrations are compared in the following table:

| Area | Online migration | Offline migration |
| ---- | ---------------- | ----------------- |
| Database availability for reads during migration | Available | Available |
| Database availability for writing during migration | Available | Generally, not recommended. Any 'writes' initiated after the migration isn't captured or migrated |
| Application Suitability | Applications that need maximum uptime | Applications that can afford a planned downtime window or have schema/workload [restrictions](https://www.postgresql.org/docs/13/logical-replication-restrictions.html) that prohibit online migration |
| Suitability for Write-heavy workloads | Suitable but expected to reduce the workload during migration | This is only a recommended solution if you can disable writes during the migration. Any writes at the source aren't migrated to the target server after the migration begins |
| Manual Cutover | Required | Not required |
| Downtime required | Small and fixed irrespective of the data size | Proportional to the data size and other factors. It could be as small as a few mins for smaller databases to a few hours for larger databases |
| Migration time | Depends on the Database size and the write activity until cutover | Depends on the Database size |

**Q. Are there any recommendations for optimizing the performance of The Single to Flexible Server Migration Tool?**

**A.** Yes. To perform faster migrations, pick a higher SKU for your flexible server. Pick a minimum 4VCore or higher to complete the migration quickly. You can always change the SKU to match the application needs post-migration.

**Q. How long does performing an offline migration with The Single to Flexible Server Migration Tool take?**

**A.** The following table shows the time for performing offline migrations for databases of various sizes using The Single to Flexible Server Migration Tool. The migration was performed using a flexible server with the SKU:

**Standard_D4ds_v4(4 cores, 16GB Memory, 128GB disk and 500 IOPS)**

| Database Size | Time (HH:MM) |
| ------------- | ------------ |
| 1 GB | 00:01 |
| 5 GB | 00:03 |
| 10 GB | 00:08 |
| 50 GB | 00:35 |
| 100 GB | 01:00 |
| 500 GB | 04:00 |
| 1,000 GB | 07:00 |

> [!NOTE]  
> The numbers above approximate the time taken to complete the migration. To get the precise time required for migrating to your Server, we strongly recommend taking a PITR (point in time restore) of your single server and running it against The Single to Flexible Server Migration Tool.

**Q. How long does performing an online migration with The Single to Flexible Server Migration Tool take?**

**A.** Online migration involves the following steps:

1. Initial copy of databases
1. Change data capture - Replaying all the transactions on the source during step #1 to the target.

The time taken in step #1 is the same as for offline migrations (refer to the previous question).

The time taken for step #2 depends on the transactions that occur on the source. If it's a write-intensive workload, the time taken for step #2 will be longer.

### Additional support

**Q. I have further questions about retirement.** 
**A.** You can get further information in a few different ways.
- Gett answers from community experts in [Microsoft Q&A](/answers/tags/214/azure-database-postgresql).

- You can contact the [Azure Database for PostgreSQL product team](mailto:AskAzureDBforMySQL@service.microsoft.com?subject=Azure%20Database%20for%20PostgreSQL%20-%20Single%20Server%20retirement).

- If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest):
    - For Summary, type a description of your issue.
    - For Issue type, select Technical.
    - For Subscription, select your subscription.
    - For Service, select My services.
    - For Service type, select Azure Database for PostgreSQL single server.
    - For Resource, select your resource.
    - For Problem type, select Migrating to Azure DB for PostgreSQL.
    - For Problem subtype, select migrating from single to flexible server.

> [!WARNING]  
> This article is not for Azure Database for PostgreSQL - Flexible Server users. It is for Azure Database for PostgreSQL - Single Server customers who need to upgrade to PostgreSQL - flexible server.

We know migrating services can be a frustrating experience, and we apologize in advance for any inconvenience this might cause you. You can choose what scenario best works for you and your environment.

## Next steps

- [Migration tool](../migrate/concepts-single-to-flexible.md)
- [What is flexible server?](../flexible-server/overview.md)
---
title: What's happening to Azure Database for PostgreSQL Single Server?
description: The Azure Database for PostgreSQL Single Server service is being deprecated.
author: markingmyname
ms.author: maghan
ms.reviewer: sunila
ms.date: 03/30/2023
ms.service: postgresql
ms.subservice: single-server
ms.topic: overview
ms.custom: single server deprecation announcement
---

# What's happens to Azure Database for PostgreSQL - Single Server after the retirement announcemnt?

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

**Azure Database for PostgreSQL - Single Server is on the retirement path** and is scheduled for retirement by **March 31, 2025**.

As part of this retirement, we no longer support creating new Single Server instances from the Azure portal beginning **November 30, 2023**. If you need to create Single Server instances to meet business continuity needs, you can use [Azure CLI](quickstart-create-server-up-azure-cli.md). You can use your Terraform template to create single server instances. You can still make read replicas for your existing single server instance from the **Replication blade**, which continues to be supported until the sunset date of **March 31, 2025**.

After years of evolving the Azure Database for PostgreSQL - Single Server service, it can no longer handle all the new features, functions, and security needs. We recommend upgrading to Azure Database for PostgreSQL - Flexible Server.

Azure Database for PostgreSQL - Flexible Server is a fully managed production-ready database service designed for more granular control and flexibility over database management functions and configuration settings. For more information about Flexible Server, visit **[Azure Database for PostgreSQL - Flexible Server](../flexible-server/overview.md)**.

If you currently have an Azure Database for PostgreSQL - Single Server service hosting production servers, we're glad to let you know that you can migrate your Azure Database for PostgreSQL - Single Server servers to the Azure Database for PostgreSQL - Flexible Server service free of cost using Azure Database Migration Service (classic). Review the different migrating methods using Azure Data Migration Service (DMS) in the section below.

## Migrate from Single Server to Flexible Server

Learn how to migrate from Azure Database for PostgreSQL - Single Server to Azure Database for PostgreSQL - Flexible Server using the S[ingle to Flexible Server Migration tool](../migrate/concepts-single-to-flexible.md).

## Frequently Asked Questions (FAQs)

**Q. Why is Azure Database for PostgreSQL-Single Server being retired?**

A. Azure Database for PostgreSQL: Single Server Generally became Available in 2018. However, given customer feedback and new advancements in the computation, availability, scalability, and performance capabilities in the Azure database landscape, the Single Server offering needs to be retired and upgraded with a new architecture – Azure Database for PostgreSQL Flexible Server to bring you the best of Azure’s open-source database platform. 

**Q. Why am I being asked to migrate to Azure Database for PostgreSQL - Flexible Server?** 

[Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/overview) is the best platform for running all your PostgreSQL workloads on Azure. Azure PostgreSQL- Flexible server is both economical and provides better performance across all service tiers and more ways to control your costs for cheaper and faster disaster recovery: 

- More ways to optimize costs, including support for burstable tier compute options. 
- high concurrency, fast failover, and high scalability. 
- Improved uptime by configuring a hot standby on the same or a different zone and a one-hour time window for planned server maintenance. 
   
**Q. How soon do I need to migrate my Single Server to a Flexible Server?** 

A. Azure Database for PostgreSQL: Single Server is scheduled for retirement by March 31, 2025, so we strongly recommend migrating your single server to a flexible server at your earliest opportunity to ensure ample time on March 31, 2025, to run through the migration lifecycle, leverage the benefits offered by Flexible Server, and ensure the continuity of your business. 

**Q. What happens to my existing Azure Database for PostgreSQL Single Server instances?** 

A. Your existing Azure Database for PostgreSQL Single Server workloads will continue functioning as before and be officially supported until March 2025. However, PostgreSQL-11 is the terminal version on Single Server, and its open-source community support for engine defects ends in Nov’2023. We'll continue to support Single Server [through our versioning support policy.](/azure/postgresql/single-server/concepts-version-policy) We strongly advise you to start migrating to Azure Database for PostgreSQL Flexible Server at the earliest. 

**Q. Can I continue running Single Server beyond the sunset date?** 

A. We plan to support Single Server at the sunset date of March 31, 2025. We strongly advise that you start planning your migration as soon as possible. 

**Q. After the Single Server retirement announcement, what if I still need to create a new single server to meet my business needs?** 

A. We are stopping new single server creations after some time, so you can provision new single servers to meet your business needs. We'll provide the ability to create Single Server with PG11 until the community retires, but we'll continue to support it through CLI.  

**Q. Are there any additional costs associated with performing the migration?** 

A. You pay for the target flexible server and the single source server while running the migration. For more information, see [Pricing](https://azure.microsoft.com/pricing/details/postgresql/flexible-server/). Once you've decommissioned the source single server post successful migration, you only pay to run the flexible server. There are no additional costs for running the migration through the migration tooling.  

**Q. Will my billing be affected by running Flexible Server as compared to a Single Server?** 

A. If you select the same zone or zone redundant high availability for the target flexible server, your bill is higher than on a single server. Same zone or zone redundant high availability requires a hot standby server to be spun up, storing redundant backup and hence the added cost. This architecture enables reduced downtime during unplanned outages and planned maintenance. In addition, depending on your workload, flexible servers can provide better performance than single servers. You may be able to run your workload with a lower SKU on flexible servers. Hence, your overall cost may be like that of a single server. 

**Q. Do I need to incur downtime to migrate Single Server to Flexible Server?** 

A. We have custom-built a tool to simplify [migration from Single Server to Flexible](/azure/postgresql/migrate/concepts-single-to-flexible) Server. The tool offers offline and online migrations and is built into the managed service. Online migration has some Open-Source PostgreSQL engine-specific [limitations](https://www.postgresql.org/docs/13/logical-replication-restrictions.html), and the tool provide an assessment for you to help you decide which option to choose. 

**Q. Will there be future updates to Single Server to support the latest PostgreSQL versions?** 

A. No. We recommend you migrate to Flexible Server if you must run on the latest PostgreSQL engine versions. However,  we'll continue to deploy minor versions released by the community for PG11 until it's retired in Nov’2023. Consider migrating to Flexible Server to use the benefits of the latest version upgrades. 

**Q. How does the flexible server’s 99.99% availability SLA differ from a single server?** 

A. Flexible server’s zone-redundant deployment provides 99.99% availability with zonal-level resiliency, whereas the single server provides resiliency in a single availability zone. Flexible Server’s High Availability (HA) architecture deploys a warm standby with redundant compute and storage (with each site’s data stored in 3x copies) compared to a single server’s HA architecture, which doesn't have a passive hot standby to help recover from zonal failures. The flexible server’s HA architecture reduces downtime during unplanned outages and planned maintenance.  

**Q. My single server is deployed in a region that doesn’t support a flexible Server. How should I proceed with migration?** 

A. We're close to regional parity with Single Server. However, a few regions like ChinaEast (CE and CE2), China North (CN and CN2), or West India are capacity constrained. We plan to support something other than Flexible Server in those regions. We recommend you migrate to regions CN3/CE3 and Central India. 

**Q. I have a private Link configured for my single server, and this feature is not currently supported in Flexible Server. How do I migrate?** 

A. Flexible Server support for private Links is on our roadmap as our highest priority. The launch of the feature is planned for Q4 2023. Additionally, you can migrate now and perform VNet injection via a point-in-time restore operation to move to the private access network connectivity method. 

**Q. Is there an option to rollback a Single Server to a Flexible Server migration?** 

A. You can perform any test migrations and complete the final migration after gaining confidence through testing. A test migration doesn’t affect the single source server, which remains operational and replicates until you perform the actual migration. If there are any errors during the test migration, you can postpone the final migration and keep your source server running. You can then reattempt the last migration after you resolve the errors. After you've performed a final migration to Flexible Server and the single source server has been shut down, you can't perform a rollback from Flexible Server to Single Server. 

**Q. The size of my database is greater than 1 TB, so how should I proceed with the migration?** 

A. [The Single to Flex migration tool](/azure/postgresql/migrate/concepts-single-to-flexible) can be used to migrate databases of any size from a single server to a flexible server. The tool doesn't have any restrictions in terms of the size of the databases it can handle.  

**Q. Is cross-region migration supported?** 

A. Currently, the Single to Flex migration tool doesn't support cross-region migrations. It is kept at a later point in time. You can use the **pg_dump/pg_restore** to perform migrations across regions.  

In general, cross-region data migrations should be avoided since the migration takes a long time to complete.    

**Q. Is cross-subscription migration supported?** 

A. The Single to Flex migration tool does support cross-subscription migrations. 

**Q. Is cross-resource group subscription-supported?** 

A. The Single to Flex migration tool does support cross-resource group migrations. 

**Q. Is there cross-version support?** 

A. Yes, migration from lower version PostgreSQL servers (PG 9.5 and above) to higher versions is supported through Single àFlexible Migration Service. 

**[Single Server àFlexible Server Migration Tool](/azure/postgresql/migrate/concepts-single-to-flexible)** 

**Q. Which data, schema, and metadata components are migrated as part of the migration?** 

A. Single to Flexible Server migration tool migrates schema, data, and metadata from the source to the destination. All of the following data, schema and metadata components are migrated as part of the database migration: 

Data Migration 

- All tables from all databases/schemas. 
   
Schema Migration 

- Naming 
- Primary key 
- Data type 
- Ordinal position 
- Default value 
- Nullability 
- Auto-increment attributes 
- Secondary indexes 
   
Metadata Migration 

- Stored Procedures 
- Functions 
- Triggers 
- Views 
- Foreign key constraints 

**Q. What’s the difference between an offline and an online migration?**

A. **Single to Flexible Server migration tool** supports both offline and online (preview) migrations. With an offline migration, application downtime starts when the migration starts. With an online migration, downtime is limited to the time required to cut over at the end of migration but uses logical replication mechanism. Your Data/Schema must pass these open-source PG engine restrictions for online migration. We suggest that you test an offline migration to determine whether the downtime is acceptable. 

Online and Offline migrations are compared in the following table:  

| Area | Online migration (preview) | Offline migration |
|-------|:----------------:|:-----------------:|
| Database availability for reads during migration | Available | Available |
| Database availability for writing during migration | Available | NOT RECOMMENDED. </br> Any ‘writes’ initiated after the migration is not captured or migrated. |
| Application Suitability | Applications that need maximum uptime | Applications that can afford a planned downtime window or have schema/workload [restrictions](https://www.postgresql.org/docs/13/logical-replication-restrictions.html) that prohibit online migration. |
| Suitability for write-heavy workloads | Suitable but expected to reduce the workload during migration | NOT APPLICABLE. </br> This is only a recommended solution if you can disable writes during the migration. Any writes on the source server after the migration begins are lost.   |
| Manual Cutover | Required | Not required |
| Downtime required | Less | More |
| Migration time | Depends on Database size and the write activity until cutover | Depends on Database size. |

**Q. When using Azure Database Migration Service, what’s the difference between an offline and an online migration?** 

A. Azure Database Migration Service supports both offline and online migrations. With an offline migration, application downtime starts when the migration begins. With an online migration, downtime is limited to the time required to cut over at the end of migration but uses a logical replication mechanism. Your Data/Schema must pass these [open-source PG engine restrictions](https://www.postgresql.org/docs/13/logical-replication-restrictions.html) for online migration. We suggest you test an offline migration to determine whether the downtime is acceptable. 

Online and Offline migrations are compared in the following table:  

| Area | Online migration | Offline migration |
| ---- | ---------------- | ----------------- |
| Database availability for reads during migration  |Available  |Available   |
| Database availability for writing during migration  |Available  |Generally, not recommended. Any ‘writes’ initiated after the migration isn't captured or migrated |
| Application Suitability  |Applications that need maximum uptime  |Applications that can afford a planned downtime window or have schema/workload  [restrictions](https://www.postgresql.org/docs/current/logical-replication-restrictions.html) that prohibit online migration |
| Suitability for Write-heavy workloads  | Suitable but expected to reduce the workload during migration  |Not Applicable. Writes at source after the migration begins aren't replicated to the target.  |
| Manual Cutover | Required | Not required |
| Downtime required | Less | More |
| Migration time | Depends on Database size and the writing activity until cutover. | Depends on the database size. |

**Q. Are there any recommendations for optimizing the performance of the Single to Flex migration tool?** 

A. Yes. To perform faster migrations, pick a higher SKU for your flexible server. Pick a minimum 4VCore or higher to complete the migration quickly. You can always change the SKU to match the application needs post-migration. 

**Q. How long does it take to perform an offline migration with Azure Database Migration Service?** 

A. The following table shows the time for performing offline migrations for databases of various sizes using the single-to-flex migration tool. The migration was performed using a flexible server with the SKU – **Standard_D4ds_v4(4 cores, 16GB Memory, 128GB disk, and 500 IOPS)** 

| Database Size | Time (HH:MM) |
| ------------- | ------------ |
| 1 GB | 00:01 |
| 5 GB | 00:03 |
| 10 GB | 00:08 |
| 50 GB | 00:35 |
| 100 GB | 01:00 |
| 500 GB | 04:00 |
| 1,000 GB | 07:00 |

The above numbers give you an approximation of the time taken to complete the migration. To get the precise time required for migrating your server, we strongly recommend taking a **PITR (point in time restore)** of your single server and running it against the single to flex migration tool. 

**Q. How long does it take to perform an online migration with Azure Database Migration Service?** 

A. Online migrations involve the following steps: 

1. Initial copy of databases 
1. change data capture - Replaying all the transactions on the source during step #1 to the target.  
    
The time taken for step #1 is the same as for offline migrations (refer to the previous question). 

The time taken for step #2 depends on the transactions that occur on the source. If it's a write-intensive workload, the time taken for step #2 is more extended. 

**Q. I have further questions on retirement. How can I get assistance with it?** 

A. If you have questions, get answers from community experts in Microsoft Q&A. If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest):  

1. For *Summary*, type a description of your issue.  
1. For *Issue type*, select **Technical**.    
1. For *Subscription*, select your subscription.    
1. For *Service*, select **My services**.  
1. For *Service type*, select **Azure Database for PostgreSQL Single Server**.    
1. For *Resource*, select your resource.    
1. For *Problem type*, select **Migrating to Azure DB for PostgreSQL**.  
1. For *Problem subtype*, select **Migrating from single to flexible server**.  
    
Contact the Azure Database for PostgreSQL product team at [AskAzureDBforPostgreSQL@service.microsoft.com](mailto:AskAzureDBforMySQL@service.microsoft.com). 

> [!WARNING]  
> This article is not for Azure Database for PostgreSQL - Flexible Server users. It is for Azure Database for PostgreSQL - Single Server customers who need to upgrade to PostgreSQL - Flexible Server.

We know migrating services can be a frustrating experience, and we apologize in advance for any inconvenience this might cause you. You can choose what scenario best works for you and your environment.

## Next steps

- [Migration tool](../migrate/concepts-single-to-flexible.md)
- [What is Flexible Server](../flexible-server/overview.md)
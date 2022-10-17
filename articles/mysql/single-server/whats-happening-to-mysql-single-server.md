---
title: What's happening to Azure Database for MySQL Single Server?
description: The Azure Database for MySQL Single Server service is being deprecated.
ms.service: mysql
ms.subservice: single-server
ms.topic: overview
author: markingmyname
ms.author: maghan
ms.reviewer: adig
ms.custom: Single Server deprecation announcement 
ms.date: 09/29/2022
---

# What's happening to Azure Database for MySQL - Single Server?

[!INCLUDE [applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

Hello! We have news to share - **Azure Database for MySQL - Single Server is on the retirement path**.

After years of evolving the Azure Database for MySQL - Single Server service, it can no longer handle all the new features, functions, and security needs. We recommend upgrading to Azure Database for MySQL - Flexible Server. 

Azure Database for MySQL - Flexible Server is a fully managed production-ready database service designed for more granular control and flexibility over database management functions and configuration settings. For more information about Flexible Server, visit **[Azure Database for MySQL - Flexible Server](../flexible-server/overview.md)**.

If you currently have an Azure Database for MySQL - Single Server service hosting production servers, we're glad to let you know that you can migrate your Azure Database for MySQL - Single Server servers to the Azure Database for MySQL - Flexible Server service.

However, we know change can be disruptive to any environment, so we want to help you with this transition. Review the different ways using the Azure Data Migration Service to [migrate from Azure Database for MySQL - Single Server to MySQL - Flexible Server.](#migrate-from-single-server-to-flexible-server)

## Migrate from Single Server to Flexible Server

Learn how to migrate from Azure Database for MySQL - Single Server to Azure Database for MySQL - Flexible Server using the Azure Database Migration Service (DMS).

| Scenario | Tool(s) | Details | 
|----------|---------|---------|
| Offline | Database Migration Service (DMS) and the Azure portal | [Tutorial: DMS with the Azure portal (offline)](../../dms/tutorial-mysql-azure-single-to-flex-offline-portal.md) |
| Online | Database Migration Service (DMS) and the Azure portal | [Tutorial: DMS with the Azure portal (online)](../../dms/tutorial-mysql-Azure-single-to-flex-online-portal.md) |

For more information on migrating from Single Server to Flexible Server, visit [Select the right tools for migration to Azure Database for MySQL](../migrate/how-to-decide-on-right-migration-tools.md).

## Migration Eligibility

To upgrade to Azure Database for MySQL Flexible Server, it's important to know when you're eligible to migrate your single server. Find the migration eligibility criteria in the below table.

| Single Server configuration not supported for migration | How and when to migrate? |
|---------------------------------------------------------|--------------------------|
| Single servers with Private Link enabled | Private Link is on the road map for next year. You can also choose to migrate now and perform wNet injection via a point-in-time restore operation to move to private access network connectivity method. |
| Single servers with Cross-Region Read Replicas enabled | Cross-Region Read Replicas for flexible servers are on the road map for later this year (for paired region) and next year (for any cross-region), post, which you can migrate your single server. |
| Single server deployed in regions where flexible server isn't supported (Learn more about regions [here](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?regions=all&products=mysql)). | Azure Database Migration Service (DMS) supports cross-region migration. Deploy your target flexible server in a suitable region and migrate using DMS. |

## Frequently Asked Questions (FAQs)

**Q. Why is Azure Database for MySQL-Single Server being retired?**

A. Azure Database for MySQL – Single Server became Generally Available (GA) in 2018. However, given customer feedback and new advancements in the computation, availability, scalability and performance capabilities in the Azure database landscape, the Single Server offering needs to be retired and upgraded with a new architecture – Azure Database for MySQL Flexible Server to bring you the best of Azure’s open-source database platform.

**Q. Why am I being asked to migrate to Azure Database for MySQL - Flexible Server?**

A. [Azure Database for MySQL - Flexible Server](https://azure.microsoft.com/pricing/details/mysql/flexible-server/#overview) is the best platform for running all your MySQL workloads on Azure. Azure MySQL- Flexible server is both economical and provides better performance across all service tiers and more ways to control your costs, for cheaper and faster disaster recovery:

- More ways to optimize costs, including support for burstable tier compute options.
- Improved performance for business-critical production workloads that require low latency, high concurrency, fast failover, and high scalability.
- Improved uptime with the ability to configure a hot standby on the same or a different zone, and a one-hour time window for planned server maintenance.

**Q. How soon do I need to migrate my single server to a flexible server?**

A. Azure Database for MySQL - Single Server is scheduled for retirement by **September 16, 2024**, so we strongly recommend migrating your single server to a flexible server at your earliest opportunity to ensure ample time to run through the migration lifecycle, apply the benefits offered by Flexible Server, and ensure the continuity of your business.

**Q. What happens to my existing Azure Database for MySQL Single Server instances?**

A. Your existing Azure Database for MySQL Single Server workloads will continue to function as before and will be officially supported until the sunset date. However, no new updates will be released for Single Server and we strongly advise you to start migrating to Azure Database for MySQL Flexible Server at the earliest.

**Q. Can I choose to continue running Single Server beyond the sunset date?**

A. Unfortunately, we don't plan to support Single Server beyond the sunset date of **September 16, 2024**, and hence we strongly advise that you start planning your migration as soon as possible.

**Q. After the Single Server retirement announcement, what if I still need to create a new single server to meet my business needs?**

A. We aren't stopping new single server creations immediately, so you can provision new single servers to meet your business needs. However, we strongly recommend that you migrate to Flexible Server at the earliest so that you can start managing your Flexible Server fleet instead.

**Q. Are there additional costs associated with performing the migration?**

A. When running the migration, you pay for the target flexible server and the source single server. The configuration and compute of the target flexible server determines the additional costs incurred. For more information, see, [Pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/). Once you've decommissioned the source single server post successful migration, you only pay for your running flexible server. There are no more costs on running the migration through the migration tooling. 

**Q. Will my billing be affected by running Flexible Server as compared to Single Server?**

A. If you select same zone or zone redundant high availability for the target flexible server, your bill will be higher than it was on single server. Same zone or zone redundant high availability requires a hot standby server to be spun up along with storing redundant backup and hence the added cost. This architecture enables reduced downtime during unplanned outages and planned maintenance. In addition, depending on your workload, flexible servers can provide much better performance over single servers, whereby you may be able to run your workload with a lower SKU on flexible servers, and hence your overall cost may be similar to that of a single server.

**Q. Do I need to incur downtime for migrate Single Server to Flexible Server?**

A. To limit any downtime you might incur, perform an online migration to Flexible Server, which provides minimal downtime. 

**Q. Will there be future updates to Single Server to support latest MySQL versions?**

A. The last minor version upgrade to Single Server version 8.0 will be 8.0.28. Consider migrating to Flexible Server to use the benefits of the latest version upgrades.

**Q. How does the flexible server’s 99.99% availability SLA differ from that of single server?**

A. Flexible server’s zone-redundant deployment provides 99.99% availability with zonal-level resiliency whereas the single server provides resiliency in a single availability zone. Flexible Server’s High Availability (HA) architecture deploys a warm standby with redundant compute and storage (with each site’s data stored in 3x copies) as compared to single server’s HA architecture, which doesn't have a passive hot standby to help recover from zonal failures. The flexible server’s HA architecture enables reduced downtime during unplanned outages and planned maintenance. 

**Q. What migration options are available to help me migrate my single server to a flexible server?**

A. You can use Azure Database Migration Service (DMS) to run [online](../../dms/tutorial-mysql-Azure-single-to-flex-online-portal.md) or [offline](../../dms/tutorial-mysql-azure-single-to-flex-offline-portal.md) migrations (recommended). In addition, you can use community tools such as m[ydumper/myloader together with Data-in replication](../migrate/how-to-migrate-single-flexible-minimum-downtime.md) to perform migrations.

**Q. My single server is deployed in a region that doesn’t support flexible server. How should I proceed with migration?**

A. Azure Database Migration Service supports cross-region migration, so you can select a suitable region for your target flexible server and then proceed with DMS migration. 

**Q. I have private link configured for my single server, and this feature is not currently supported in Flexible Server. How do I migrate?**

A. Flexible Server support for private link is on our road map as our highest priority. Launch of the feature is planned in Q2 2023 and you have ample time to initiate your Single Server to Flexible Server migrations with private link configured. You can also choose to migrate now and perform VNet injection via a point-in-time restore operation to move to private access network connectivity method.

**Q. I have cross-region read replicas configured for my single server, and this feature is not currently supported in Flexible Server. How do I migrate?**

A. Flexible Server support for cross-region read replicas is on our roadmap as our highest priority. Launch of the feature is planned in Q4 2022 (for paired region) and Q1 2023 (for any cross-region), and you have ample time to initiate your Single Server to Flexible Server migrations with cross-region read replicas configured.

**Q. Is there an option to rollback a Single Server to Flexible Server migration?**

A. You can perform any number of test migrations, and after gaining confidence through testing, perform the final migration. A test migration doesn’t affect the source single server, which remains operational and continues replicating until you perform the actual migration. If there are any errors during the test migration, you can choose to postpone the final migration and keep your source server running. You can then reattempt the final migration after you resolve the errors. After you've performed a final migration to Flexible Server and the source single server has been shut down, you can't perform a rollback from Flexible Server to Single Server.

**Q. The size of my database is greater than 1 TB, so how should I proceed with an Azure Database Migration Service initiated migration?**

A. To support Azure Database Migration Service (DMS) migrations of databases that are 1 TB+, raise a support ticket with Azure Database Migration Service to scale-up the migration agent to support your 1 TB+ database migrations.

**Q. Is cross-region migration supported?**

A. Azure Database Migration Service supports cross-region migrations, so you can migrate your single server to a flexible server that is deployed in a different region using DMS. 

**Q. Is cross-subscription migration supported?**

A. Azure Database Migration Service supports cross-subscription migrations, so you can migrate your single server to a flexible server that deployed on a different subscription using DMS.

**Q. Is cross-resource group subscription supported?**

A. Azure Database Migration Service supports cross-resource group migrations, so you can migrate your single server to a flexible server that is deployed in a different resource group using DMS. 

**Q. Is there cross-version support?**

Yes, migration from lower version MySQL servers (v5.6 and above) to higher versions is supported through Azure Database Migration Service migrations.

**Q. I have further questions on retirement. How can I get assistance around it?**

**A.** If you have questions, get answers from community experts in [Microsoft Q&A.](https://aka.ms/microsoft-azure-mysql-qa) If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest): 

1. For *Summary*, type a description of your issue.
2. For *Issue type*, select **Technical**.
3. For *Subscription*, select your subscription.
4. For *Service*, select **My services**.
5. For *Service type*, select **Azure Database for MySQL Single Server**.
6. For *Resource*, select your resource.
7. For *Problem type*, select **Migration**.
8. For *Problem subtype*, select **Migrating from single to flexible server**

You can also reach out to the Azure Database for MySQL product team at <AskAzureDBforMySQL@service.microsoft.com>.

> [!Warning]
> This article is not for Azure Database for MySQL - Flexible Server users. It is for Azure Database for MySQL - Single Server customers who need to upgrade to MySQL - Flexible Server.

Visit the **[FAQ](../../dms/faq-mysql-single-to-flex.md)** for information about using the Azure Database Migration Service (DMS) for Azure Database for MySQL - Single Server to Flexible Server migrations.

We know migrating services can be a frustrating experience, and we apologize in advance for any inconvenience this might cause you. You can choose what scenario best works for you and your environment.

## Next steps

- [Frequently Asked Questions about DMS migrations](../../dms/faq-mysql-single-to-flex.md)
- [Select the right tools for migration to Azure Database for MySQL](../migrate/how-to-decide-on-right-migration-tools.md)
- [What is Flexible Server](../flexible-server/overview.md)
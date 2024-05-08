---
title: What's happening to Azure Database for MariaDB?
description: The Azure Database for MariaDB service is being deprecated.
author: karla-escobar
ms.author: karlaescobar
ms.reviewer: maghan
ms.date: 1/24/2024
ms.service: mariadb
ms.topic: overview
ms.custom: deprecation announcement
---

# What's happening to Azure Database for MariaDB?

Azure Database for MariaDB is on the retirement path, and **Azure Database for MariaDB is scheduled for retirement by September 19, 2025**.

In alignment with the Azure Database for MariaDB retirement announcement, we stopped support for creating MariaDB instances via the Azure portal or CLI as of **March 19, 2024**.

We're investing in our flagship offering of Azure Database for MySQL - Flexible Server better suited for mission-critical workloads. Azure Database for MySQL - Flexible Server has better features, performance, an improved architecture, and more controls to manage costs across all service tiers compared to Azure Database for MariaDB. We encourage you to migrate to Azure Database for MySQL - Flexible Server before retirement to experience the new capabilities of Azure Database for MySQL - Flexible Server.

Azure Database for MySQL - Flexible Server is a fully managed production-ready database service designed for more granular control and flexibility over database management functions and configuration settings. For more information about Flexible Server, visit [Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/overview).

### Migrate from Azure Database for MariaDB to Azure Database for MySQL - Flexible Server

Learn how to [migrate from Azure Database for MariaDB to Azure Database for MySQL - Flexible Server.](https://aka.ms/AzureMariaDBtoAzureMySQL)

### Frequently Asked Questions (FAQs)

**Q. Why is the Azure Database for MariaDB being retired?**

A. Azure Database for MariaDB became Generally Available (GA) in 2018. However, given customer feedback and new advancements in the computation, availability, scalability, and performance capabilities in the Azure database landscape, the MariaDB offering needs to be retired and upgraded with a new architecture – Azure Database for MySQL Flexible Server to bring you the best of Azure's open-source database platform.

**Q. Why am I being asked to migrate to Azure Database for MySQL - Flexible Server?**

A. There's a high application compatibility between Azure Database for MariaDB and Azure Database for MySQL, as MariaDB was forked from MySQL. [Azure Database for MySQL - Flexible Server](https://azure.microsoft.com/pricing/details/mysql/flexible-server/#overview) is the best platform for running all your MySQL workloads on Azure. Azure MySQL- Flexible server is both economical and provides better performance across all service tiers and more ways to control your costs for cheaper and faster disaster recovery:

- More ways to optimize costs, including support for burstable tier compute options.

- Improved performance for business-critical production workloads that require low latency, high concurrency, fast failover, and high scalability.

- Improved uptime by configuring a hot standby on the same or a different zone and a one-hour time window for planned server maintenance.

**Q. How soon must I migrate my MariaDB servers to a flexible server?**

A. Azure Database for MariaDB is scheduled for retirement by **September 19, 2025**, so we strongly recommend migrating to Azure Database for MySQL - Flexible Server at your earliest opportunity to ensure ample time to run through the migration lifecycle, apply the benefits offered by Flexible Server, and ensure the continuity of your business.

**Q. What happens to my existing Azure Database for MariaDB instances?**

A. Your existing Azure Database for MariaDB workloads will continue to function as before and **will be officially supported until the sunset date**. However, updates have yet to be released for Azure Database for MariaDB, and we strongly advise you to start migrating to Azure Database for MySQL - Flexible Server at the earliest.

**Q. Can I choose to continue running Azure Database for MariaDB beyond the sunset date?**

A. Unfortunately, we don't plan to support Azure Database for MariaDB beyond the sunset date of September 19, 2025. Hence, we advise that you start planning your migration as soon as possible.

**Q. How do I manage my reserved instances for MariaDB?**

A. Since MariaDB service is on the deprecation path you will not be able to purchase new MariaDB reserved instances. For any existing reserved instances, you will continue to use the benefits of your reserved instances until the September, 19 2025 when MariaDB service will no longer be available. [You can exchange your existing MariaDB reservations to MySQL reservations](/azure/cost-management-billing/reservations/exchange-and-refund-azure-reservations).

**Q. After the Azure Database for MariaDB retirement announcement, what if I still need to create a new MariaDB server to meet my business needs?**

A. As part of this retirement, we'll no longer support creating new MariaDB instances from the Azure portal beginning **January 19, 2024**. Suppose you still need to create MariaDB instances to meet business continuity needs. In that case, you can use [Azure CLI](/azure/mysql/single-server/quickstart-create-mysql-server-database-using-azure-cli) until **March 19, 2024**. After **March 19, 2024** if you still need to create MariaDB instances to address business continuity requirements, please raise an [Azure support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

**Q. Will I be able to create read replicas and perform restores (PITR or Geo-restore) for my Azure Database for MariaDB instances after March 19, 2024?**

A. Yes, you can create read replicas and perform restores (PITR and geo-restore) for your existing MariaDB instances until the sunset date of **September 19, 2025**.

**Q. How does the Azure Database for MySQL flexible server's 99.99% availability SLA differ from MariaDB?**

A. Azure Database for MySQL - Flexible server zone-redundant deployment provides 99.99% availability with zonal-level resiliency, whereas MariaDB provides resiliency in a single availability zone. Flexible Server's High Availability (HA) architecture deploys a warm standby with redundant compute and storage (with each site's data stored in 3x copies) as compared to MariaDB's HA architecture, which doesn't have a passive hot standby to help recover from zonal failures. The flexible server's HA architecture enables reduced downtime during unplanned outages and planned maintenance.

**Q. What migration options help me migrate to a flexible server?**

A. To migrate your Azure Database for MariaDB workloads to Azure Database for MySQL – Flexible Server, set up replication between your MariaDB instance and a MySQL - Flexible Server instance so that you can perform a near-zero downtime online migration. To minimize the effort required for application refactoring, it is highly recommended to migrate your Azure MariaDB v10.3 workloads to Azure MySQL v5.7, which is closely compatible, and then subsequently plan for a [major version upgrade to Azure MySQL v8.0](/azure/mysql/flexible-server/how-to-upgrade).

For more information about how you can migrate your Azure Database for MariaDB server to Azure Database for MySQL - Flexible Server, see the blog post [Migrating from Azure Database for MariaDB to Azure Database for MySQL](https://techcommunity.microsoft.com/t5/azure-database-for-mysql-blog/migrating-from-azure-database-for-mariadb-to-azure-database-for/ba-p/3838455).

**Q. I have further questions on retirement. How can I get assistance with it?**

A. If you have questions, get answers from community experts in [Microsoft Q&A.](/answers/tags/56/azure-database-mariadb) If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest):

- For _Issue type_, select **Technical**.
- For _Subscription_, select your subscription.
- For _Service_, select **My services**.
- For _Service type_, select **Azure Database for MariaDB**.
- For _Resource_, select your resource.
- For _Problem type_, select **Migration**.
- For _Problem subtype_, select **Migrating from Azure for MariaDB to Azure for MySQL Flexible Server**.

For further questions, reach out to [AskAzureDBforMariaDB@service.microsoft.com](mailto:AskAzureDBforMariaDB@service.microsoft.com)

### Next steps

- [Migrate to Azure Database for MySQL - Flexible Server](https://aka.ms/AzureMariaDBtoAzureMySQL)
- [What is Flexible Server](/azure/mysql/flexible-server/overview)

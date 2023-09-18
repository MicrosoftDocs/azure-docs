---
title: What's happening to Azure Database for MariaDB?
description: The Azure Database for MariaDB service is being deprecated.
author: karla-escobar
ms.author: karlaescobar
ms.reviewer: maghan
ms.date: 09/14/2023
ms.service: mariadb
ms.topic: overview
ms.custom: Deprecation announcement
---

# __What's happening to Azure Database for MariaDB?__

[[!INCLUDE [azure-database-for-mariadb-deprecation](Includes/azure-database-for-mariadb-deprecation.md)]]

Hello! We have news to share - __Azure Database for MariaDB is on the retirement path__ and Azure Database for MariaDB is scheduled for retirement by __September 19, 2025__.

As part of this retirement, we will no longer support creating new MariaDB server instances from the Azure portal beginning __December 19, 2023__. If you still need to create MariaDB instances to meet business continuity needs, you can use [Azure CLI](/azure/mysql/single-server/quickstart-create-mysql-server-database-using-azure-cli) until __March 19, 2024__.

We are making investments in our flagship offering of Azure Database for MySQL - Flexible Server that is better suited for mission-critical workloads. Azure Database for MySQL - Flexible Server has better features, performance, an improved architecture, and more controls to manage costs across all service tiers compared to Azure Database for MariaDB. We encourage you to migrate to Azure Database for MySQL - Flexible Server prior to the retirement date to experience the new capabilities of Azure Database for MySQL - Flexible Server.

Azure Database for MySQL - Flexible Server is a fully managed production-ready database service designed for more granular control and flexibility over database management functions and configuration settings. For more information about Flexible Server, visit [Azure Database for MySQL - Flexible Server](/azure/mysql/flexible-server/overview).

__Migrate from Azure Database for MariaDB to Azure Database for MySQL - Flexible Server__

Learn how to [migrate from Azure Database for MariaDB to Azure Database for MySQL - Flexible Server.](https://aka.ms/AzureMariaDBtoAzureMySQL)

__Frequently Asked Questions (FAQs)__

__Q. Why is Azure Database for MariaDB being retired?__

__A.__ Azure Database for MariaDB became Generally Available (GA) in 2018. However, given customer feedback and new advancements in the computation, availability, scalability and performance capabilities in the Azure database landscape, the MariaDB offering needs to be retired and upgraded with a new architecture – Azure Database for MySQL Flexible Server to bring you the best of Azure's open-source database platform.

__Q. Why am I being asked to migrate to Azure Database for MySQL - Flexible Server?__

__A.__ There is very high application compatibility between Azure Database for MariaDB and Azure Database for MySQL, as MariaDB was forked from MySQL. [Azure Database for MySQL - Flexible Server](https://azure.microsoft.com/pricing/details/mysql/flexible-server/#overview) is the best platform for running all your MySQL workloads on Azure. Azure MySQL- Flexible server is both economical and provides better performance across all service tiers and more ways to control your costs, for cheaper and faster disaster recovery:

- More ways to optimize costs, including support for burstable tier compute options.

- Improved performance for business-critical production workloads that require low latency, high concurrency, fast failover, and high scalability.

- Improved uptime with the ability to configure a hot standby on the same or a different zone, and a one-hour time window for planned server maintenance.

__Q. How soon do I need to migrate my MariaDB servers to a flexible server?__

__A.__ Azure Database for MariaDB is scheduled for retirement by __September 19, 2025__, so we strongly recommend migrating to Azure Database for MySQL - Flexible Server at your earliest opportunity to ensure ample time to run through the migration lifecycle, apply the benefits offered by Flexible Server, and ensure the continuity of your business.

__Q. What happens to my existing Azure Database for MariaDB instances?__

__A.__ Your existing Azure Database for MariaDB workloads will continue to function as before and will be officially supported until the sunset date. However, no new updates will be released for Azure Database for MariaDB and we strongly advise you to start migrating to Azure Database for MySQL - Flexible Server at the earliest.

__Q. Can I choose to continue running Azure Database for MariaDB beyond the sunset date?__

__A.__ Unfortunately, we don't plan to support Azure Database for MariaDB beyond the sunset date of __September 19, 2025__, and hence we strongly advise that you start planning your migration as soon as possible.

__Q. After the Azure Database for MariaDB retirement announcement, what if I still need to create a new MariaDB server to meet my business needs?__

__A.__ As part of this retirement, we will no longer support creating new Single Server instances from the Azure portal beginning __December 19, 2023__. If you still need to create MariaDB instances to meet business continuity needs, you can use [Azure CLI](/azure/mysql/single-server/quickstart-create-mysql-server-database-using-azure-cli) until **March 19, 2024**.

__Q. How does the flexible server's 99.99% availability SLA differ from that of MariaDB?__

__A.__ Flexible server's zone-redundant deployment provides 99.99% availability with zonal-level resiliency whereas MariaDB provides resiliency in a single availability zone. Flexible Server's High Availability (HA) architecture deploys a warm standby with redundant compute and storage (with each site's data stored in 3x copies) as compared to MariaDB's HA architecture, which doesn't have a passive hot standby to help recover from zonal failures. The flexible server's HA architecture enables reduced downtime during unplanned outages and planned maintenance.

__Q. What migration options are available to help me migrate to a flexible server?__

__A.__ Learn how to [migrate from Azure Database for MariaDB to Azure Database for MySQL - Flexible Server.](https://aka.ms/AzureMariaDBtoAzureMySQL)

__Q. I have further questions on retirement. How can I get assistance with it?__

__A.__ If you have questions, get answers from community experts in [Microsoft Q&A.](/answers/tags/56/azure-database-mariadb) If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest):

1.     For _Issue type_, select __Technical__.

2.     For _Subscription_, select your subscription.

3.     For _Service_, select __My services__.

4.     For _Service type_, select __Azure Database for MariaDB__.

5.     For _Resource_, select your resource.

6.     For _Problem type_, select __Migration__.

7.     For _Problem subtype_, select __Migrating from Azure for MariaDB to Azure for MySQL Flexible Server__.

For further questions reach out to [AskAzureDBforMariaDB@service.microsoft.com](mailto:AskAzureDBforMariaDB@service.microsoft.com)

__Next steps__

- [Migrate to Azure Database for MySQL - Flexible Server](https://aka.ms/AzureMariaDBtoAzureMySQL)

- [What is Flexible Server](/azure/mysql/flexible-server/overview)



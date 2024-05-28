---
title: What's happening to Azure Database for MySQL single server?
description: The Azure Database for MySQL - Single Server service is being deprecated.
author: markingmyname
ms.author: maghan
ms.reviewer: adig, talawren
ms.date: 05/21/2024
ms.service: mysql
ms.subservice: single-server
ms.topic: overview
ms.custom:
  - Single Server deprecation announcement
---

# What's happening to Azure Database for MySQL - Single Server?

[!INCLUDE [applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

**Azure Database for MySQL - Single Server is on the retirement path** and is scheduled for retirement by **September 16, 2024**.

As part of this retirement, we'll no longer support creating new Single Server instances from the Azure portal beginning **January 16, 2023** and Azure CLI beginning **March 19, 2024**. If you still need to create Single Server instances to meet business continuity needs, raise an Azure support ticket. You'll still be able to create read replicas and perform restores (PITR and geo-restore) for your existing single server instance and this will continue to be supported until the sunset date of **September 16, 2024**.

After years of evolving the Azure Database for MySQL - Single Server service, it can no longer handle all the new features, functions, and security needs. We recommend upgrading to Azure Database for MySQL - Flexible Server.

Azure Database for MySQL - Flexible Server is a fully managed production-ready database service designed for more granular control and flexibility over database management functions and configuration settings. For more information about Flexible Server, visit **[Azure Database for MySQL - Flexible Server](../flexible-server/overview.md)**.

If you currently have an Azure Database for MySQL - Single Server service hosting production servers, we're glad to let you know that you can migrate your Azure Database for MySQL - Single Server servers to the Azure Database for MySQL - Flexible Server service free of cost using Azure Database for MySQL Import, in-place automigration or Azure Database Migration Service (classic). Review the different ways to migrate in the section below.

## Migrate from Single Server to Flexible Server

Learn how to migrate from Azure Database for MySQL - Single Server to Azure Database for MySQL - Flexible Server.

| Scenario | Tools | Details |
| --- | --- | --- |
| Offline/Online | Azure Database for MySQL Import and the Azure CLI | [Tutorial: Azure Database for MySQL Import with the Azure CLI](../migrate/migrate-single-flexible-mysql-import-cli.md) |
| Offline | Database Migration Service (classic) and the Azure portal | [Tutorial: DMS (classic) with the Azure portal (offline)](../../dms/tutorial-mysql-azure-single-to-flex-offline-portal.md) |
| Online | Database Migration Service (classic) and the Azure portal | [Tutorial: DMS (classic) with the Azure portal (online)](../../dms/tutorial-mysql-Azure-single-to-flex-online-portal.md) |
| Offline | In-place automigration nomination [from](<https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4lhLelkCklCuumNujnaQ-ZUQzRKSVBBV0VXTFRMSDFKSUtLUDlaNTA5Wi4u>) | [In-place automigration from Azure Database for MySQL Single to Flexible Server](../migrate/migrate-single-flexible-in-place-auto-migration.md) |

For more information on migrating from Single Server to Flexible Server using other migration tools, visit [Select the right tools for migration to Azure Database for MySQL](../migrate/how-to-decide-on-right-migration-tools.md).

> [!NOTE]  
> In-place auto-migration from Azure Database for MySQL – Single Server to Flexible Server is a service-initiated in-place migration during planned maintenance window for select Single Server database workloads. The eligible servers are identified by the service and are sent an advance notification detailing steps to review migration details. If you own a Single Server workload with data storage used <= 100 GiB and no complex features (CMK, Microsoft Entra ID, Read Replica, Private Link) enabled, you can now nominate yourself (if not already scheduled by the service) for auto-migration by submitting your server details through this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4lhLelkCklCuumNujnaQ-ZUQzRKSVBBV0VXTFRMSDFKSUtLUDlaNTA5Wi4u). All other Single Server workloads are recommended to use user-initiated migration tooling offered by Azure - Azure DMS, Azure Database for MySQL Import to migrate. Learn more about in-place auto-migration [here](../migrate/migrate-single-flexible-in-place-auto-migration.md).

## What happens post sunset date (September 16, 2024)?

Running the Single Server instance post sunset date would be a security risk, as there will be no security and bug fixes maintenance on the deprecated Single Server platform. To ensure our commitment toward running the managed instances on a trusted and secure platform post the sunset date, your Single Server instance, along with its data files, will be force-migrated to an appropriate Flexible Server instance in a phased manner.
We strongly recommend using the [Azure Database for MySQL Import CLI](../migrate/migrate-single-flexible-mysql-import-cli.md) or [Azure Data Migration](../../dms/tutorial-mysql-Azure-single-to-flex-online-portal.md) Service to migrate to Azure Database for MySQL - Flexible Server before 16 September 2024 (read the [FAQ](./whats-happening-to-mysql-single-server.md#frequently-asked-questions-faqs) to learn more) to avoid any disruptions caused by forced migration and to ensure business continuity.

> [!NOTE]  
> No SLAs, bug fixes, security fixes, or live support will be honored for your Single Server instance post the sunset date.

### Forced migration post sunset date

Post the sunset date, your Single Server instance, along with its data files, will be force-migrated to an appropriate Flexible Server instance in a phased manner. This might lead to limited feature availability as certain advanced functionality can't be force-migrated without customer inputs to the Flexible Server instance. Read more about steps to reconfigure such features post force-migration to minimize the potential effect below.

The following features can't be force-migrated as they require customer input for configuration and won't be enabled on the migrated Flexible Server instance:

- Private Link
- Data encryption (CMK)
- Microsoft Entra authentication (erstwhile Microsoft Entra ID)
- Service endpoints
- Infrastructure Double encryption
- Read Replicas
- Microsoft Defender for Cloud

### Action required post forced migration

After the forced migration, you must reconfigure the features listed above on the migrated Flexible Server instance to ensure business continuity:

- Private Link – Read more about how to configure [here](../flexible-server/how-to-networking-private-link-portal.md)
- Data encryption (CMK) - Read more about how to configure [here](../flexible-server/how-to-data-encryption-portal.md)
- Microsoft Entra authentication (erstwhile Microsoft Entra ID) - Read more about how to configure [here](../flexible-server/how-to-azure-ad.md)
- Service endpoints – Service endpoint (virtual network Rule) isn't supported on Azure Database for MySQL Flexible Server. We recommend configuring Private Link to meet feature parity. Read more about how to configure Private Link [here](../flexible-server/how-to-networking-private-link-portal.md)
- Infrastructure Double encryption – Infrastructure Double encryption isn't supported on Azure Database for MySQL Flexible Server. We recommend configuring Data encryption to meet feature parity. Read more about how to configure Data encryption (CMK) [here](../flexible-server/how-to-data-encryption-portal.md)
- Read Replicas - Read more about how to configure [here](../flexible-server/how-to-read-replicas-portal.md)

**Important** : Single Servers with networking and security features enabled will be force-migrated to a Flexible Server instance with public access in the disabled state to protect customer data. You must enable appropriate access after the forced migration to ensure business continuity.

> [!NOTE]  
> If your server is in a region where Azure Database for MySQL - Flexible Server isn't supported, then post the sunset date, your Single Server instance will be available with limited operations to access data and to be able to migrate to Flexible Server. Your instance will not be force-migrated to Flexible Server. We strongly recommend that you use one of the following options to migrate before the sunset date to avoid any disruptions in business continuity:
>  
> - Use Azure DMS to perform a cross-region migration to Flexible Server in a suitable Azure region.
> - Migrate to MySQL Server hosted on a VM in the region, if you're unable to change regions due to compliance issues.

#### Configure Microsoft Defender for Cloud properties in Flexible Server

When you migrate from Azure Database for MySQL - Single Server to Flexible Server with Defender for Cloud enabled, the enablement state is preserved. To achieve parity in Flexible Server for properties you can configure in Single Server, consider the details in the following table.

| Property | Configuration |
| --- | --- |
| properties.disabledAlerts | You can disable specific alert types by using the Microsoft Defender for Cloud platform. For more information, see the article [Suppress alerts from Microsoft Defender for Cloud guide](../../defender-for-cloud/alerts-suppression-rules.md). |
| properties.emailAccountAdmins<br />properties.emailAddresses | You can centrally define email notification for Microsoft Defender for Cloud Alerts for all resources in a subscription. For more information, see the article [Configure email notifications for security alerts](../../defender-for-cloud/configure-email-notifications.md). |
| properties.retentionDays<br />properties.storageAccountAccessKey<br />properties.storageEndpoint | The Microsoft Defender for Cloud platform exposes alerts through Azure Resource Graph. You can export alerts to a different store and manage retention separately. For more about continuous export, see the article [Set up continuous export in the Azure portal - Microsoft Defender for Cloud](../../defender-for-cloud/continuous-export.md). |

## Frequently Asked Questions (FAQs)

**Q. Why is Azure Database for MySQL-Single Server being retired?**

**A.** Azure Database for MySQL – Single Server became Generally Available (GA) in 2018. However, given customer feedback and new advancements in the compute, availability, scalability, and performance capabilities in the Azure database landscape, the Single Server offering needs to be retired and upgraded with a new architecture – Azure Database for MySQL Flexible Server to bring you the best of Azure's open-source database platform.

**Q. Why am I being asked to migrate to Azure Database for MySQL - Flexible Server?**

**A.** [Azure Database for MySQL - Flexible Server](https://azure.microsoft.com/pricing/details/mysql/flexible-server/#overview) is the best platform for running all your MySQL workloads on Azure. Azure MySQL- Flexible server is both economical and provides better performance across all service tiers and more ways to control your costs, for cheaper and faster disaster recovery:

- More ways to optimize costs, including support for burstable tier compute options.
- Improved performance for business-critical production workloads that require low latency, high concurrency, fast failover, and high scalability.
- Improved uptime with the ability to configure a hot standby on the same or a different zone, and a one-hour time window for planned server maintenance.

**Q. How soon do I need to migrate my single server to a flexible server?**

**A.** Azure Database for MySQL - Single Server is scheduled for retirement by **September 16, 2024**, so we strongly recommend migrating your single server to a flexible server at your earliest opportunity to ensure ample time to run through the migration lifecycle, apply the benefits offered by Flexible Server, and ensure the continuity of your business.

**Q. What happens to my existing Azure Database for MySQL single server instances?**

**A.** Your existing Azure Database for MySQL single server workloads continue to function as before and will be officially supported until the sunset date. However, no new updates are released for Single Server and we strongly advise you to start migrating to Azure Database for MySQL Flexible Server at the earliest. Post the sunset date, your Single Server instance, along with its data files, will be [force-migrated](./whats-happening-to-mysql-single-server.md#forced-migration-post-sunset-date) to an appropriate Flexible Server instance in a phased manner.

**Q. Can I choose to continue running Single Server beyond the sunset date?**

**A.** Unfortunately, we don't plan to support Single Server beyond the sunset date of **September 16, 2024**, and hence we strongly advise that you start planning your migration as soon as possible. Post the sunset date, your Single Server instance, along with its data files, will be force-migrated to an appropriate Flexible Server instance in a phased manner. This might lead to limited feature availability as certain advanced functionality can't be force-migrated without customer inputs to the Flexible Server instance. Read more about steps to reconfigure such features post force-migration to minimize the potential impact [here](./whats-happening-to-mysql-single-server.md#action-required-post-forced-migration). If your server is in a region where Azure Database for MySQL - Flexible Server isn't supported, then post the sunset date, your Single Server instance will be available with limited operations to access data and to be able to migrate to Flexible Server.

**Q. My single server is deployed in a region that doesn't support flexible server. What will happen to my server post sunset date?**
**A.** If your server is in a region where Azure Database for MySQL - Flexible Server isn't supported, then post the sunset date, your Single Server instance will be available with limited operations to access data and to be able to migrate to Flexible Server. We strongly recommend that you use one of the following options to migrate before the sunset date to avoid any disruptions in business continuity:

- Use Azure DMS to perform a cross-region migration to Flexible Server in a suitable Azure region.
- Migrate to MySQL Server hosted on a VM in the region, if you're unable to change regions due to compliance issues.

**Q. Post sunset date, will there be any data loss for my Single Server?**
**A.** No, there won't be any data loss incurred for your Single Server instance. Post the sunset date, your Single Server instance, along with its data files, will be force-migrated to an appropriate Flexible Server instance. If your server is in a region where Azure Database for MySQL - Flexible Server isn't supported, then post the sunset date, your Single Server instance will be available with limited operations to access data and to be able to migrate to Flexible Server in an appropriate region.

**Q. After the Single Server retirement announcement, what if I still need to create a new single server to meet my business needs?**

**A.** As part of this retirement, we'll no longer support creating new Single Server instances from the Azure portal beginning **January 16, 2023**. Additionally, starting **March 19, 2024** you'll no longer be able to create new Azure Database for MySQL Single Server instances using Azure CLI. If you still need to create Single Server instances to meet business continuity needs, raise an Azure support ticket.

**Q. After the Single Server retirement announcement, what if I still need to create a new read replica for my single server instance?**

**A.** You'll still be able to create read replicas for your existing single server instance from the **Replication blade** and this will continue to be supported until the sunset date of **September 16, 2024**.

**Q. Are there additional costs associated with performing the migration?**

**A.** When running the migration, you pay for the target flexible server and the source single server. The configuration and compute of the target flexible server determines the additional costs incurred. For more information, see, [Pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/). Once you've decommissioned the source single server post successful migration, you only pay for your running flexible server. There are no costs incurred while running the migration through the Azure Database Migration Service (classic), in-place automigration or Azure Database for MySQL Import migration tooling.

**Q. Will my billing be affected by running Flexible Server as compared to Single Server?**

**A.** If you select same zone or zone redundant high availability for the target flexible server, your bill is higher than it was on single server. Same zone or zone redundant high availability requires a hot standby server to be spun up along with storing redundant backup and hence the added cost. This architecture enables reduced downtime during unplanned outages and planned maintenance. In addition, depending on your workload, flexible servers can provide better performance over single servers, whereby you might be able to run your workload with a lower SKU on flexible servers, and hence your overall cost might be similar to that of a single server.

**Q. Do I need to incur downtime for migrate Single Server to Flexible Server?**

**A.** To limit any downtime you might incur, perform an online migration to Flexible Server, which provides minimal downtime.

**Q. Will there be future updates to Single Server to support latest MySQL versions?**

**A.** The last minor version upgrade to Single Server version 8.0 will be 8.0.15. Consider migrating to Flexible Server to use the benefits of the latest version upgrades.

**Q. How does the flexible server's 99.99% availability SLA differ from that of single server?**

**A.** Flexible server's zone-redundant deployment provides 99.99% availability with zonal-level resiliency whereas the single server provides resiliency in a single availability zone. Flexible Server's High Availability (HA) architecture deploys a warm standby with redundant compute and storage (with each site's data stored in 3x copies) as compared to single server's HA architecture, which doesn't have a passive hot standby to help recover from zonal failures. The flexible server's HA architecture enables reduced downtime during unplanned outages and planned maintenance.

**Q. What migration options are available to help me migrate my single server to a flexible server?**

**A.** You can use [Azure Database for MySQL Import (recommended)](../migrate/migrate-single-flexible-mysql-import-cli.md) to migrate. Additionally, You can use Database Migration Service (classic) to run [online](../../dms/tutorial-mysql-Azure-single-to-flex-online-portal.md) or [offline](../../dms/tutorial-mysql-azure-single-to-flex-offline-portal.md) migrations.

**Q. My single server is deployed in a region that doesn't support flexible server. How should I proceed with migration?**

**A.** Azure Database Migration Service (classic) supports cross-region migration, so you can select a suitable region for your target flexible server and then proceed with DMS (classic) migration.

**Q. I have Query Store configured for my single server, and this feature isn't supported on the Flexible Server. How do I migrate?**

**A.** You can configure slow query logs on the target Flexible Server post-migration by following steps [here](/azure/mysql/flexible-server/tutorial-query-performance-insights#configure-slow-query-logs-by-using-the-azure-portal) to attain feature parity with Query Store. You can then view query insights by using [workbooks template](/azure/mysql/flexible-server/tutorial-query-performance-insights#view-query-insights-by-using-workbooks).

**Q. I have Service Endpoint (VNet Rules) configured for my single server, and this feature isn't supported on the Flexible Server. How do I migrate?**

**A.** Service endpoint (virtual network Rule) isn't supported on Azure Database for MySQL Flexible Server. We recommend configuring Private Link on the migrated Flexible Server instance to meet feature parity. Read more about how to configure Private Link [here](../flexible-server/how-to-networking-private-link-portal.md).

**Q. I have Infrastructure Double encryption configured for my single server, and this feature isn't supported on the Flexible Server. How do I migrate?**

**A.** Infrastructure Double encryption isn't supported on Azure Database for MySQL Flexible Server. We recommend configuring Data encryption on migrated Flexible Server to meet feature parity. Read more about how to configure Data encryption (CMK) [here](../flexible-server/how-to-data-encryption-portal.md).

**Q. I have TLS v1.0/1.1 configured for my v8.0 single server, and this feature isn't currently supported in Flexible Server. How do I migrate?**

**A.** To support modern security standards, MySQL community edition has discontinued support for communication over Transport Layer Security (TLS) 1.0 and 1.1 protocols starting with version 8.0.28. We recommend you upgrade your client drivers to support TLSv1.2 to connect securely to Azure Database for MySQL - Single Server and then proceed to migrate to Flexible Server.

**Q. Is there an option to rollback a Single Server to Flexible Server migration?**

**A.** You can perform any number of test migrations, and after gaining confidence through testing, perform the final migration. A test migration doesn't affect the source single server, which remains operational and continues replicating until you perform the actual migration. If there are any errors during the test migration, you can choose to postpone the final migration and keep your source server running. You can then reattempt the final migration after you resolve the errors. After you've performed a final migration to Flexible Server and the source single server has been shut down, you can't perform a rollback from Flexible Server to Single Server.

**Q. The size of my database is greater than 1 TB, so how should I proceed with my migration?**

**A.** You can use [Azure Database for MySQL Import (recommended)](../migrate/migrate-single-flexible-mysql-import-cli.md) to migrate which is highly performant for heavier workloads.

**Q. Is cross-region migration supported?**

**A.** Azure Database Migration Service supports cross-region migrations, so you can migrate your single server to a flexible server that is deployed in a different region using DMS.

**Q. Is cross-subscription migration supported?**

**A.** Azure Database Migration Service supports cross-subscription migrations, so you can migrate your single server to a flexible server that deployed on a different subscription using DMS.

**Q. Is cross-resource group subscription supported?**

**A.** Azure Database Migration Service supports cross-resource group migrations, so you can migrate your single server to a flexible server that is deployed in a different resource group using DMS.

**Q. Is there cross-version support?**

**A.** Yes, migration from lower version MySQL servers (v5.6 and above) to higher versions is supported through Azure Database Migration Service migrations.

**Q. MyAzure Database for MySQL Single Server utilizes non-default ports such as 3308,3309 and 3310, which is not supported on Flexible Server. What should I do to ensure connectivity when migrating to Flexible Server?**

**A.** If your source Azure Database for MySQL Single Server utilizes nondefault ports such as 3308,3309 and 3310, change your connectivity port to 3306 as the above mentioned nondefault ports aren't supported on Flexible Server.

**Q. I have further questions on retirement. How can I get assistance around it?**

**A.** If you have questions, get answers from community experts in [Microsoft Q&A.](https://aka.ms/microsoft-azure-mysql-qa) If you have a support plan and you need technical help, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest):

1. For *Summary*, type a description of your issue.
1. For *Issue type*, select **Technical**.
1. For *Subscription*, select your subscription.
1. For *Service*, select **My services**.
1. For *Service type*, select **Azure Database for MySQL single server**.
1. For *Resource*, select your resource.
1. For *Problem type*, select **Migration**.
1. For *Problem subtype*, select **Migrating from single to flexible server**

Visit the **[FAQ](../../dms/faq-mysql-single-to-flex.md)** for information about using the Azure Database Migration Service (classic) for Azure Database for MySQL - Single Server to Flexible Server migrations.

We know migrating services can be a frustrating experience, and we apologize in advance for any inconvenience this might cause you. You can choose what scenario best works for you and your environment.

## Related content

- [Frequently Asked Questions about DMS (classic) migrations](../../dms/faq-mysql-single-to-flex.md)
- [Select the right tools for migration to Azure Database for MySQL](../migrate/how-to-decide-on-right-migration-tools.md)
- [What is Flexible Server](../flexible-server/overview.md)

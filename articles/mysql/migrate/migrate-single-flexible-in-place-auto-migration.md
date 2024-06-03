---
title: In-place automigration
description: This tutorial describes how to configure notifications, review migration details and FAQs for an Azure Database for MySQL Single Server instance schedule for in-place automigration to Flexible Server.
author: adig
ms.author: adig
ms.reviewer: maghan
ms.date: 05/21/2024
ms.service: mysql
ms.subservice: flexible-server
ms.topic: overview
ms.custom:
  - mvc
  - mode-api
---

# In-place automigration from Azure Database for MySQL – Single Server to Flexible Server

[!INCLUDE [applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

**In-place automigration** from Azure Database for MySQL – Single Server to Flexible Server is a service-initiated in-place migration during planned maintenance window for Single Server database workloads with **Basic, General Purpose or Memory Optimized SKU**, data storage used **<= 20 GiB** and **no complex features (CMK, Microsoft Entra ID, Read Replica, Private Link) enabled**. The eligible servers are identified by the service and are sent an advance notification detailing steps to review migration details.

The in-place migration provides a highly resilient and self-healing offline migration experience during a planned maintenance window, with less than **5 mins** of downtime. It uses backup and restore technology for faster migration time. This migration removes the overhead to manually migrate your server and ensure you can take advantage of the benefits of Flexible Server, including better price & performance, granular control over database configuration, and custom maintenance windows. Following described are the key phases of the migration:

- **Target Flexible Server is deployed**, inheriting all feature set and properties (including server parameters and firewall rules) from source Single Server. Source Single Server is set to read-only and backup from source Single Server is copied to the target Flexible Server.
- **DNS switch and cutover** are performed successfully within the planned maintenance window with minimal downtime, allowing maintenance of the same connection string post-migration. Client applications seamlessly connect to the target flexible server without any user driven manual updates. In addition to both connection string formats (Single and Flexible Server) being supported on migrated Flexible Server, both username formats – username@server_name and username are also supported on the migrated Flexible Server.
- The **migrated Flexible Server is online** and can now be managed via Azure portal/CLI. Stopped Single Server is deleted seven days after the migration.

> [!NOTE]  
> If your Single Server instance has General Purpose V1 storage, your scheduled instance will undergo an additional restart operation 12 hours prior to the scheduled migration time. This restart operation serves to enable the log_bin server parameter needed to upgrade the instance to General Purpose V2 storage before undergoing the in-place auto-migration.

## Eligibility

If you own a Single Server workload with data storage used <= 100 GiB and no complex features (CMK, Microsoft Entra ID, Read Replica, Private Link) enabled, you can now nominate yourself (if not already scheduled by the service) for automigration by submitting your server details through this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4lhLelkCklCuumNujnaQ-ZUQzRKSVBBV0VXTFRMSDFKSUtLUDlaNTA5Wi4u).

## Configure migration alerts and review migration schedule

Servers eligible for in-place automigration are sent an advance notification by the service.

Following described are the ways to check and configure automigration notifications:

- Subscription owners for Single Servers scheduled for automigration receive an email notification.
- Configure **service health alerts** to receive in-place migration schedule and progress notifications via email/SMS by following steps [here](../single-server/concepts-planned-maintenance-notification.md#to-receive-planned-maintenance-notification).
- Check the in-place migration **notification on the Azure portal** by following steps [here](../single-server/concepts-planned-maintenance-notification.md#check-planned-maintenance-notification-from-azure-portal).

Following described are the ways to review your migration schedule once you receive the in-place automigration notification:

> [!NOTE]  
> The migration schedule will be locked 7 days prior to the scheduled migration window after which you'll be unable to reschedule.

- The **Single Server overview page** for your instance displays a portal banner with information about your migration schedule.
- For Single Servers scheduled for automigration, a new **Migration blade** is lighted on the portal. You can review the migration schedule by navigating to the Migration blade of your Single Server instance.
- If you wish to defer the migration, you can defer by a month at a time by navigating to the Migration blade of your single server instance on the Azure portal and rescheduling the migration by selecting another migration window within a month.
- If your Single Server has **General Purpose SKU**, you have the other option to enable **High Availability** when reviewing the migration schedule. As High Availability can only be enabled during create time for a MySQL Flexible Server, it's highly recommended that you enable this feature when reviewing the migration schedule.

## Prerequisite checks for in-place automigration

Review the following prerequisites to ensure a successful in-place automigration:

- The Single Server instance should be in **ready state** and shouldn't be in stopped state during the planned maintenance window for automigration to take place.
- For Single Server instance with **SSL enabled**, ensure you have all three certificates (**[BaltimoreCyberTrustRoot](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt.pem), [DigiCertGlobalRootG2 Root CA](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem) and [DigiCertGlobalRootCA Root CA](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem)**) available in the trusted root store. Additionally, if you have the certificate pinned to the connection string create a combined CA certificate with all three certificates before scheduled automigration to ensure business continuity post-migration.
- The MySQL engine doesn't guarantee any sort order if there's no 'SORT' clause present in queries. Post in-place automigration, you might observe a change in the sort order. If preserving sort order is crucial, ensure your queries are updated to include 'SORT' clause before the scheduled in-place automigration.
- If your source Azure Database for MySQL Single Server has engine version v8.x, ensure to upgrade your source server's .NET client driver version to 8.0.32 to avoid any encoding incompatibilities post migration to Flexible Server.
- If your source Azure Database for MySQL Single Server has firewall rule names exceeding 80 characters, rename them to ensure length of name is fewer than 80 characters. (The firewall rule name length supported on Flexible Server is 80 characters whereas on Single Server the allowed length is 12 8 characters.)
- If your source Azure Database for MySQL Single Server utilizes nondefault ports such as 3308,3309 and 3310, change your connectivity port to 3306 as the above mentioned nondefault ports aren't supported on Flexible Server.

## How is the target MySQL Flexible Server autoprovisioned?

The compute tier and SKU for the target flexible server is provisioned based on the source single server's pricing tier and VCores based on the detail in the following table.

| Single Server Pricing Tier | Single Server VCores | Flexible Server Tier | Flexible Server SKU Name |
| --- | --- | :---: | :---: |
| Basic | 1 | Burstable | Standard_B1s |
| Basic | 2 | Burstable | Standard_B2s |
| General Purpose | 4 | GeneralPurpose | Standard_D4ds_v4 |
| General Purpose | 8 | GeneralPurpose | Standard_D8ds_v4 |
| General Purpose | 16 | GeneralPurpose | Standard_D16ds_v4 |
| General Purpose | 32 | GeneralPurpose | Standard_D32ds_v4 |
| General Purpose | 64 | GeneralPurpose | Standard_D64ds_v4 |
| Memory Optimized | 4 | MemoryOptimized | Standard_E4ds_v4 |
| Memory Optimized | 8 | MemoryOptimized | Standard_E8ds_v4 |
| Memory Optimized | 16 | MemoryOptimized | Standard_E16ds_v4 |
| Memory Optimized | 32 | MemoryOptimized | Standard_E32ds_v4 |

- The MySQL version, region, *storage size, subscription, and resource group for the target Flexible Server is same as that of the source Single Server.
- For Single Servers with less than 20-GiB storage, the storage size is set to 20 GiB as that is the minimum storage limit on Azure Database for MySQL - Flexible Server.
- Both username formats – username@server_name (Single Server) and username (Flexible Server) are supported on the migrated Flexible Server.
- Both connection string formats – Single Server and Flexible Server are supported on the migrated Flexible Server.
- For Single Server instance with Query store enabled, the server parameter 'slow_query_log' on target instance is set to ON to ensure feature parity when migrating to Flexible Server. For certain workloads this could affect performance and if you observe any performance degradation, set this server parameter to 'OFF' on the Flexible Server instance.

## Post-migration steps

Here's the info you need to know post in-place migration:

> [!NOTE]  
> Post-migration do no restart the stopped Single Server instance as it might hamper your client's and application connectivity.

- Copy the following properties from the source Single Server to target Flexible Server post in-place migration operation is completed successfully:
  - Monitoring page settings (Alerts, Metrics, and Diagnostic settings)
  - Any Terraform/CLI scripts you host to manage your Single Server instance should be updated with Flexible Server references.
- For Single Server instance with Query store enabled, the server parameter 'slow_query_log' on target instance is set to ON to ensure feature parity when migrating to Flexible Server. Note, for certain workloads this could affect performance and if you observe any performance degradation, set this server parameter to 'OFF' on the Flexible Server instance.
- For Single Server instance with Microsoft Defender for Cloud enabled, the enablement state is migrated. To achieve parity in Flexible Server post automigration for properties you can configure in Single Server, consider the details in the following table:

| Property | Configuration |
| --- | --- |
| properties.disabledAlerts | You can disable specific alert types by using the Microsoft Defender for Cloud platform. For more information, see the article [Suppress alerts from Microsoft Defender for Cloud guide](../../defender-for-cloud/alerts-suppression-rules.md). |
| properties.emailAccountAdmins, properties.emailAddresses | You can centrally define email notification for Microsoft Defender for Cloud Alerts for all resources in a subscription. For more information, see the article [Configure email notifications for security alerts](../../defender-for-cloud/configure-email-notifications.md). |
| properties.retentionDays, properties.storageAccountAccessKey, properties.storageEndpoint | The Microsoft Defender for Cloud platform exposes alerts through Azure Resource Graph. You can export alerts to a different store and manage retention separately. For more about continuous export, see the article [Set up continuous export in the Azure portal - Microsoft Defender for Cloud](../../defender-for-cloud/continuous-export.md?tabs=azure-portal). |

## Frequently Asked Questions (FAQs)

**Q. Why am I being auto-migrated​?**

**A.** Your Azure Database for MySQL - Single Server instance is eligible for in-place migration to our flagship offering Azure Database for MySQL - Flexible Server. This in-place migration will remove the overhead to manually migrate your server and ensure you can take advantage of the benefits of Flexible Server, including better price & performance, granular control over database configuration, and custom maintenance windows.

**Q. How does the automigration take place? What all does it migrate?​**

**A.** The Flexible Server is provisioned to match the same VCores and storage as that of your Single Server. Next the source Single Server is put to stopped state, data file snapshot is taken and copied to target Flexible Server. The DNS switch is performed to route all existing connections to target and the target Flexible Server is brought online. The automigration migrates the entire server's data files (including schema, data, logins) in addition to server parameters (all modified server parameters on source are copied to target, unmodified server parameters take up the default value defined by Flexible Server) and firewall rules. This is an offline migration where you see downtime of up-to 5 minutes or less.

**Q. How can I set up or view in-place migration alerts?​**

**A.** Following are the ways you can set up alerts:

- Configure service health alerts to receive in-place migration schedule and progress notifications via email/SMS by following steps [here](../single-server/concepts-planned-maintenance-notification.md#to-receive-planned-maintenance-notification).
- Check the in-place migration notification on the Azure portal by following steps [here](../single-server/concepts-planned-maintenance-notification.md#check-planned-maintenance-notification-from-azure-portal).

**Q. How can I defer the scheduled migration?​**

**A.** You can review the migration schedule by navigating to the Migration blade of your Single Server instance. If you wish to defer the migration, you can defer by a month at the most by navigating to the Migration blade of your single server instance on the Azure portal and rescheduling the migration by selecting another migration window within a month. The migration details will be locked seven days prior to the scheduled migration window after which you're unable to reschedule. This in-place migration can be deferred monthly until 16 September 2024.

**Q. What username and connection string would be supported for the migrated Flexible Server? ​​**

**A.** Both username formats - username@server_name (Single Server format) and username (Flexible Server format) are supported for the migrated Flexible Server, and hence you aren't required to update them to maintain your application continuity post migration. Additionally, both connection string formats (Single and Flexible server format) are also supported for the migrated Flexible Server.

**Q. How to enable HA (High Availability) for my auto-migrated server??​**

**A.** By default, automigration sets up migration to a non-HA instance. As HA can only be enabled at server-create time, you should enable HA before the scheduled automigration using the automigration schedule edit option on portal. HA can only be enabled for General purpose\Memory Optimized SKUs on target Flexible Server, as Basic to Burstable SKU migration doesn't support HA configuration.

**Q. I see a pricing difference on my potential move from MySQL Basic Single Server to MySQL Flexible Server??​**

**A.** Few servers might see a small price increase after migration (estimated costs can be seen by selecting the automigration schedule edit option on the portal), as the minimum storage limit on both offerings is different (5 GiB on Single Server; 20 GiB on Flexible Server) and storage cost (0.1$ on Single Server; 0.115$ on Flexible Server) for Flexible Server is slightly higher than Single Server. For affected servers, this price increase in Flexible Server provides better throughput and performance compared to Single Server.

## Related content

- [Manage an Azure Database for MySQL - Flexible Server using the Azure portal.](../flexible-server/how-to-manage-server-portal.md)

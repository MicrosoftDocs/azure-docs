---
title: Auto-migration
description: This tutorial describes how to configure notifications, review migration details and FAQs for an Azure Database for PostgreSQL Single Server instance schedule for auto-migration to Flexible Server.
author: hariramt
ms.author: hariramt
ms.reviewer: maghan
ms.date: 06/04/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: overview
ms.custom:
  - mvc
  - mode-api
---

# Auto-migration from Azure Database for Postgresql – Single Server to Flexible Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

**Auto-migration** from Azure Database for Postgresql – Single Server to Flexible Server is a service-initiated migration during a planned downtime window for Single Server running PostgreSQL 11 and database workloads with **Basic, General Purpose or Memory Optimized SKU**, data storage used **<= 5 GiB** and **no complex features (CMK, Microsoft Entra ID, Read Replica, Private Link) enabled**. The eligible servers are identified by the service and are sent advance notifications detailing steps to review migration details and make modifications if necessary.

The auto-migration provides a highly resilient and self-healing offline migration experience during a planned migration window, with about **10 mins** of downtime. The migration service is a hosted solution using the [pgcopydb](https://github.com/dimitri/pgcopydb) binary and provides a fast and efficient way of copying databases from the source PostgreSQL instance to the target. This migration removes the overhead to manually migrate your server. Post migration, you can take advantage of the benefits of Flexible Server, including better price & performance, granular control over database configuration, and custom maintenance windows. Following described are the key phases of the migration:

- **Target Flexible Server is deployed** matches your Single server SKU in terms of performance and cost, inheriting all firewall rules from source Single Server.

- **Date is migrated** during the migration window chosen by the service or elected by you. If the window is chosen by the service, it is typically outside business hours of the specific region the server is hosted in.Source Single Server is set to read-only and the data & schema is migrated from the source Single Server to the target Flexible Server. User roles, privileges and ownership of all database objects are also migrated to the flexible server.

- **DNS switch and cutover** are performed within the planned migration window with minimal downtime, allowing usage of the same connection string post-migration. Client applications seamlessly connect to the target flexible server without any user driven manual updates or changes. In addition to both connection string formats (Single and Flexible Server) being supported on migrated Flexible Server, both username formats – username@server_name and username are also supported on the migrated Flexible Server.

- The **migrated Flexible Server is online** and can now be managed via Azure portal/CLI. The legacy Single Server is deleted seven days after the migration.

## Nomination Eligibility

If you own a Single Server workload with data storage used <= 20 GiB and no complex features (CMK, Microsoft Entra ID, Read Replica, Private Link) enabled, you can now nominate yourself (if not already scheduled by the service) for auto-migration by submitting your server details through this [form](https://forms.office.com/r/4pF55L8TxY).

## Configure migration alerts and review migration schedule

Servers eligible for auto-migration are sent an advance notification by the service.

Following described are the ways to check and configure auto-migration notifications:

- Subscription owners for Single Servers scheduled for auto-migration receive an email notification.
- Configure **service health alerts** to receive auto-migration schedule and progress notifications via email/SMS by following steps [here](../single-server/concepts-planned-maintenance-notification.md#to-receive-planned-maintenance-notification).
- Check the auto-migration **notification on the Azure portal** by following steps [here](../../single-server/concepts-planned-maintenance-notification.md#check-planned-maintenance-notification-from-azure-portal).

Following described are the ways to review your migration schedule once you receive the auto-migration notification:

> [!NOTE]  
> The migration schedule will be locked 7 days prior to the scheduled migration window during which you'll be unable to reschedule.

- The **Single Server overview page** for your instance displays a portal banner with information about your migration schedule.
- For Single Servers scheduled for auto-migration, the **Overview** page is updated with the relevant information. You can review the migration schedule by navigating to the Overview page of your Single Server instance.
- If you wish to defer the migration, you can defer by a month at a time on the Azure portal and rescheduling the migration by selecting another migration window within a month.

> [!NOTE]  
> Typically, candidate servers short-listed for auto-migration do not use cross region or Geo redundant backups. And these features can only be enabled during create time for a postgresql Flexible Server. In case you plan to use any of these features, it's recommended to opt out of the auto-migration schedule and migrate your server manually.

## Prerequisite checks for auto-migration

Review the following prerequisites to ensure a successful auto-migration:

- The Single Server instance should be in **ready state** during the planned migration window for auto-migration to take place.
- If your source Azure Database for postgresql Single Server has firewall rule names exceeding 80 characters, rename them to ensure length of name is fewer than 80 characters. (The firewall rule name length supported on Flexible Server is 80 characters whereas on Single Server the allowed length is 128 characters.)

## How is the target postgresql Flexible Server provisioned?

The compute tier and SKU for the target flexible server is provisioned based on the source single server's pricing tier and VCores based on the detail in the following table.

| Single Server Pricing Tier | Single Server VCores | Flexible Server Tier | Flexible Server SKU Name |
| --- | --- | :---: | :---: |
| Basic | 1 | Burstable | B1ms |
| Basic | 2 | Burstable | B2s |
| General Purpose | 2 | GeneralPurpose | Standard_D2s_v3 |
| General Purpose | 4 | GeneralPurpose | Standard_D4s_v3 |
| General Purpose | 8 | GeneralPurpose | Standard_D8s_v3 |
| General Purpose | 16 | GeneralPurpose | Standard_D16s_v3 |
| General Purpose | 32 | GeneralPurpose | Standard_D32s_v3 |
| General Purpose | 64 | GeneralPurpose | Standard_D64s_v3 |
| Memory Optimized | 2 | MemoryOptimized | Standard_E2s_v3 |
| Memory Optimized | 4 | MemoryOptimized | Standard_E4s_v3 |
| Memory Optimized | 8 | MemoryOptimized | Standard_E8s_v3 |
| Memory Optimized | 16 | MemoryOptimized | Standard_E16s_v3 |
| Memory Optimized | 32 | MemoryOptimized | Standard_E32s_v3 |

- The postgresql version, region, connection string, subscription, and resource group for the target Flexible Server weill remain the same as that of the source Single Server.
- For Single Servers with less than 20-GiB storage, the storage size is set to 32 GiB as that is the minimum storage limit on Azure Database for postgresql - Flexible Server.
- For other Single Servers with greater storage requirement, sufficient storage on the Flexible server, equivalent to 1.25 times or 25% more storage than what is being used in the Single server is allocated. During the initial base copy of data, multiple insert statements are executed on the target, which generates WALs (Write Ahead Logs). Until these WALs are archived, the logs consume storage at the target.
- Both username formats – username@server_name (Single Server) and username (Flexible Server) are supported on the migrated Flexible Server.
- Both connection string formats – Single Server and Flexible Server are supported on the migrated Flexible Server.
- For Single Server instance with Query store enabled, the server parameter 'slow_query_log' on target instance is set to ON to ensure feature parity when migrating to Flexible Server. For certain workloads this could affect performance and if you observe any performance degradation, set this server parameter to 'OFF' on the Flexible Server instance.

## Post-migration steps

Here's the info you need to know post auto-migration:

- Copy the following properties from the source Single Server to target Flexible Server post auto-migration operation is completed successfully:
  - Monitoring page settings (Alerts, Metrics, and Diagnostic settings)
  - Any Terraform/CLI scripts you host to manage your Single Server instance should be updated with Flexible Server references.
- For Single Server instance with Query store enabled, the server parameter 'slow_query_log' on target instance is set to ON to ensure feature parity when migrating to Flexible Server. Note, for certain workloads this could affect performance and if you observe any performance degradation, set this server parameter to 'OFF' on the Flexible Server instance.
- For Single Server instance with Microsoft Defender for Cloud enabled, the enablement state is migrated. To achieve parity in Flexible Server post auto-migration for properties you can configure in Single Server, consider the details in the following table:

| Property | Configuration |
| --- | --- |
| properties.disabledAlerts | You can disable specific alert types by using the Microsoft Defender for Cloud platform. For more information, see the article [Suppress alerts from Microsoft Defender for Cloud guide](../../defender-for-cloud/alerts-suppression-rules.md). |
| properties.emailAccountAdmins, properties.emailAddresses | You can centrally define email notification for Microsoft Defender for Cloud Alerts for all resources in a subscription. For more information, see the article [Configure email notifications for security alerts](../../defender-for-cloud/configure-email-notifications.md). |
| properties.retentionDays, properties.storageAccountAccessKey, properties.storageEndpoint | The Microsoft Defender for Cloud platform exposes alerts through Azure Resource Graph. You can export alerts to a different store and manage retention separately. For more about continuous export, see the article [Set up continuous export in the Azure portal - Microsoft Defender for Cloud](../../defender-for-cloud/continuous-export.md?tabs=azure-portal). |

## Frequently Asked Questions (FAQs)

**Q. Why am I being auto-migrated​?**

**A.** Your Azure Database for Postgresql - Single Server instance is eligible for auto-migration to our flagship offering Azure Database for Postgresql - Flexible Server. This auto-migration will remove the overhead to manually migrate your server and ensure you can take advantage of the benefits of Flexible Server, including better price & performance, granular control over database configuration, and custom maintenance windows.

**Q. How does the auto-migration take place? What all does it migrate?​**

**A.** The Flexible Server is provisioned to closely match the same VCores and storage as that of your Single Server. Next the source Single Server is put in a read-only state, schema and data is copied to target Flexible Server. The DNS switch is performed to route all existing connections to target and the target Flexible Server is brought online. The auto-migration migrates the databases (including schema, data, users/roles and privileges). This is an offline migration where you see downtime of about 10 minutes or less.

**Q. How can I set up or view auto-migration alerts?​**

**A.** Following are the ways you can set up alerts:

- Configure service health alerts to receive auto-migration schedule and progress notifications via email/SMS by following steps [here](../../single-server/concepts-planned-maintenance-notification.md#to-receive-planned-maintenance-notification).
- Check the auto-migration notification on the Azure portal by following steps [here](../single-server/concepts-planned-maintenance-notification.md#check-planned-maintenance-notification-from-azure-portal).

**Q. How can I defer the scheduled migration?​**

**A.** You can review the migration schedule by navigating to the Overview page of your Single Server instance. If you wish to defer the migration, you can defer by a month at the most by navigating to the Overview page of your single server instance on the Azure portal and rescheduling the migration by selecting another migration window within a month. The migration details will be locked seven days prior to the scheduled migration window after which you're unable to reschedule. This auto-migration can be deferred monthly until 30 March 2025.

**Q. What username and connection string would be supported for the migrated Flexible Server? ​​**

**A.** Both username formats - username@server_name (Single Server format) and username (Flexible Server format) are supported for the migrated Flexible Server, and hence you aren't required to update them to maintain your application continuity post migration. Additionally, both connection string formats (Single and Flexible server format) are also supported for the migrated Flexible Server.

**Q. I see a pricing difference on my potential move from postgresql Basic Single Server to postgresql Flexible Server??​**

**A.** Few servers might see a small price revision after migration as the minimum storage limit on both offerings is different (5 GiB on Single Server; 32 GiB on Flexible Server) and storage cost (0.1$/GB on Single Server; 0.12$/GB on Flexible Server) for Flexible Server is marginally higher than Single Server. Any price increase is offset by better throughput and performance compared to Single Server.

## Related content

- [Manage an Azure Database for postgresql - Flexible Server using the Azure portal.](../../flexible-server/how-to-manage-server-portal.md)

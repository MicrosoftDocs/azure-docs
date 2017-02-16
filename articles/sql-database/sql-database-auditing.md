---
title: Azure SQL Database - Auditing | Microsoft Docs
description: Azure SQL Database auditing tracks database events and writes them to an audit log in your Azure storage account.
services: sql-database
documentationcenter: ''
author: ronitr
manager: jhubbard
editor: giladm

ms.assetid: 89c2a155-c2fb-4b67-bc19-9b4e03c6d3bc
ms.service: sql-database
ms.custom: secure and protect
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/05/2016
ms.author: ronitr; giladm

---
# SQL database auditing concepts
Azure SQL Database auditing tracks database events and writes them to an audit log in your Azure storage account.

Auditing can help you maintain regulatory compliance, understand database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.

Auditing enables and facilitates adherence to compliance standards but doesn't guarantee compliance. For more information about Azure programs that support standards compliance, see the [Azure Trust Center](https://azure.microsoft.com/support/trust-center/compliance/).

* [Azure SQL Database auditing overview]
* [Set up auditing for your database]
* [Analyze audit logs and reports]

## <a id="subheading-1"></a>Azure SQL Database auditing overview
SQL Database auditing allows you to:

* **Retain** an audit trail of selected events. You can define categories of database actions to be audited.
* **Report** on database activity. You can use preconfigured reports and a dashboard to get started quickly with activity and event reporting.
* **Analyze** reports. You can find suspicious events, unusual activity, and trends.

There are two **auditing methods**:

* **Blob auditing** - logs are written to Azure blob storage. This is a newer auditing method, which provides higher performance, supports higher granularity object-level auditing, and is more cost effective.
* **Table auditing** - logs are written to Azure table storage.

> [!IMPORTANT]
> The introduction of the new blob auditing brings a major change to the way server auditing policy is being inherited by the database. 

You can configure auditing for different types of event categories.

* To configure and manage auditing using the Azure portal, see [Auditing using the Azure portal](sql-database-auditing-portal.md).
* To configure and manage auditing using PowerShell, see [Auditing using PowerShell](sql-database-auditing-powershell.md).
* To configure and manage auditing using the REST API, see [Auditing using the REST API](sql-database-auditing-rest.md).

<!--For each Event Category, auditing of **Success** and **Failure** operations are configured separately.-->

An auditing policy can be defined for a specific database or as a default server policy. A default server auditing policy applies to all existing and newly created databases on a server.

## Blob auditing

If server blob auditing is enabled, it always applies to the database (all databases on the server will be audited), regardless of:
    - The database auditing settings.
    - Whether or not the "Inherit settings from server" checkbox is checked in the database blade.

> [!IMPORTANT]
> Enabling blob auditing on the database, in addition to enabling it on the server, will **not** override or change any of the settings of the server blob auditing - both audits will exist side by side. In other words, the database will be audited twice in parallel (once by the server policy and once by the database policy).

You should avoid enabling both server blob auditing and database blob auditing together, unless:
 * You need to use a different *storage account* or *retention period* for a specific database.
 * You want to audit different event types or categories for a specific database than are being audited for the rest of the databases on this server (for example, table inserts need to be audited only for a specific database).

Otherwise,  we recommended to only enable server-level blob auditing and leave the database-level auditing disabled for all databases.

## Table auditing

If server-level table auditing is enabled, it only applies to the database if the "Inherit settings from server" checkbox is checked in the database blade (this is checked by default for all existing and newly created databases).

- If the checkbox is *checked*, any changes made to the auditing settings in database **override** the server settings for this database.

- If the checkbox is *unchecked* and the database-level auditing is disabled, the database will not be audited.

## Analyze audit logs and reports
Audit logs are aggregated in the Azure storage account you chose during setup.

You can explore audit logs using a tool such as [Azure Storage Explorer](http://storageexplorer.com/).

## Next steps

* To configure and manage auditing using the Azure portal, see [Configure auditing in the Azure portal](sql-database-auditing-portal.md).
* To configure and manage auditing using PowerShell, see [Configure auditing with PowerShell](sql-database-auditing-powershell.md).
* To configure and manage auditing using the REST API, see [Configure auditing with the REST API](sql-database-auditing-rest.md).


<!--Anchors-->
[Azure SQL Database auditing overview]: #subheading-1
[Set up auditing for your database]: #subheading-2
[Analyze audit logs and reports]: #subheading-3
[Practices for usage in production]: #subheading-5
[Storage Key Regeneration]: #subheading-6
[Automation (PowerShell / REST API)]: #subheading-7
[Blob/Table differences in Server auditing policy inheritance]: (#subheading-8)  

<!--Image references-->
[1]: ./media/sql-database-auditing-get-started/1_auditing_get_started_settings.png
[2]: ./media/sql-database-auditing-get-started/2_auditing_get_started_server_inherit.png
[3]: ./media/sql-database-auditing-get-started/3_auditing_get_started_turn_on.png
[3-tbl]: ./media/sql-database-auditing-get-started/3_auditing_get_started_turn_on_table.png
[4]: ./media/sql-database-auditing-get-started/4_auditing_get_started_storage_details.png
[5]: ./media/sql-database-auditing-get-started/5_auditing_get_started_audited_events.png
[6]: ./media/sql-database-auditing-get-started/6_auditing_get_started_storage_key_regeneration.png
[7]: ./media/sql-database-auditing-get-started/7_auditing_get_started_activity_log.png
[8]: ./media/sql-database-auditing-get-started/8_auditing_get_started_regenerate_key.png
[9]: ./media/sql-database-auditing-get-started/9_auditing_get_started_report_template.png
[10]: ./media/sql-database-auditing-get-started/10_auditing_get_started_blob_view_audit_logs.png
[11]: ./media/sql-database-auditing-get-started/11_auditing_get_started_blob_audit_records.png
[12]: ./media/sql-database-auditing-get-started/12_auditing_get_started_table_audit_records.png

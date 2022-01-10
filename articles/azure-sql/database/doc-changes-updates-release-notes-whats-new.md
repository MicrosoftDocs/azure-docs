---
title: What's new?
titleSuffix: Azure SQL Database
description: Learn about the new features and documentation improvements for Azure SQL Database.
services: sql-database
author: LitKnd
ms.author: kendralittle
ms.service: sql-database
ms.subservice: service-overview
ms.custom: sqldbrb=2, references_regions, ignite-fall-2021
ms.devlang: 
ms.topic: conceptual
ms.date: 12/15/2021
---
# What's new in Azure SQL Database?
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!div class="op_single_selector"]
> * [Azure SQL Database](doc-changes-updates-release-notes-whats-new.md)
> * [Azure SQL Managed Instance](../managed-instance/doc-changes-updates-release-notes-whats-new.md)

This article summarizes the documentation changes associated with new features and improvements in the recent releases of [Azure SQL Database](https://azure.microsoft.com/products/azure-sql/database/). To learn more about Azure SQL Database, see the [overview](sql-database-paas-overview.md). 


## Preview 

The following table lists the features of Azure SQL Database that are currently in preview: 

| Feature | Details |
| ---| --- |
| [Change data capture](/sql/relational-databases/track-changes/about-change-data-capture-sql-server) | Change data capture (CDC) lets you track all the changes that occur on a database. Though this feature has been available for SQL Server for quite some time, using it with Azure SQL Database is currently in preview. |
| [Elastic jobs](elastic-jobs-overview.md) | The elastic jobs feature is the SQL Server Agent replacement for Azure SQL Database as a PaaS offering.  |
| [Elastic queries](elastic-query-overview.md) | The elastic queries feature allows for cross-database queries in Azure SQL Database. |
| [Elastic transactions](elastic-transactions-overview.md) | Elastic transactions allow you to execute transactions distributed among cloud databases in Azure SQL Database. |
| [Ledger](ledger-overview.md) | The Azure SQL Database ledger feature allows you to cryptographically attest to other parties, such as auditors or other business parties, that your data hasn't been tampered with. | 
| [Maintenance window](maintenance-window.md)| The maintenance window feature allows you to configure maintenance schedule for your Azure SQL Database. |
| [Query editor in the Azure portal](connect-query-portal.md) | The query editor in the portal allows you to run queries against your Azure SQL Database directly from the [Azure portal](https://portal.azure.com).|
| [Query Store hints](/sql/relational-databases/performance/query-store-hints?view=azuresqldb-current&preserve-view=true) | Use query hints to optimize your query execution via the OPTION clause. |
| [SQL Analytics](../../azure-monitor/insights/azure-sql.md)|Azure SQL Analytics is an advanced cloud monitoring solution for monitoring performance of all of your Azure SQL databases at scale and across multiple subscriptions in a single view. Azure SQL Analytics collects and visualizes key performance metrics with built-in intelligence for performance troubleshooting.|
| [SQL insights](../../azure-monitor/insights/sql-insights-overview.md) |  SQL insights is a comprehensive solution for monitoring any product in the Azure SQL family. SQL insights uses dynamic management views to expose the data you need to monitor health, diagnose problems, and tune performance.|
| [Zone redundant configuration for general purpose tier](high-availability-sla.md#general-purpose-service-tier-zone-redundant-availability-preview) | The zone redundant configuration feature utilizes [Azure Availability Zones](../../availability-zones/az-overview.md#availability-zones) to replicate databases across multiple physical locations within an Azure region. By selecting [zone redundancy](high-availability-sla.md#general-purpose-service-tier-zone-redundant-availability-preview), you can make your general purpose databases and elastic pools resilient to a much larger set of failures, including catastrophic datacenter outages, without any changes to the application logic. The feature is currently only available in the general purpose tier. | 
|||

## General availability (GA)

The following table lists the features of Azure SQL Database that have transitioned from preview to general availability (GA) within the last 12 months: 

| Feature | GA Month | Details |
| ---| --- |--- |
| [Azure Active Directory-only authentication](authentication-azure-ad-only-authentication.md) | November 2021 | It's possible to configure your Azure SQL Database to allow authentication only from Azure Active Directory. | 
| [AAD service principal](authentication-aad-service-principal.md) |  September 2021 | Azure Active Directory (Azure AD) supports user creation in Azure SQL Database on behalf of Azure AD applications (service principals).| 
| [Audit management operations](../database/auditing-overview.md#auditing-of-microsoft-support-operations) |  March 2021 | Azure SQL audit capabilities enable you  you to audit operations done by Microsoft support engineers when they need to access your SQL assets during a support request, enabling more transparency in your workforce. | 
|||| 


## Documentation changes

Learn about significant changes to the Azure SQL Database documentation.

### November 2021

| Changes | Details |
| --- | --- |
| **Azure AD-only authentication** | Restricting authentication to your Azure SQL Database only to Azure Active Directory users is now generally available. To learn more, see [Azure AD-only authentication](../database/authentication-azure-ad-only-authentication.md). | 
| | | 


### October 2021

| Changes | Details |
| --- | --- |
|**Split what's new** | The previously-combined **What's new** article has been split by product - [What's new in SQL Database](doc-changes-updates-release-notes-whats-new.md) and [What's new in SQL Managed Instance](../managed-instance/doc-changes-updates-release-notes-whats-new.md), making it easier to identify what features are currently in preview, generally available, and significant documentation changes. Additionally, the [Known Issues in SQL Managed Instance](../managed-instance/doc-changes-updates-known-issues.md) content has moved to its own page.  | 

### September 2021

| Changes | Details |
| --- | --- |
| **Maintenance Window support for availability zones** | You can now use the [Maintenance Window feature](maintenance-window.md) if your Azure SQL Database is deployed to an availability zone. This feature is currently in preview.  | 
|||


### July 2021

| Changes | Details |
| --- | --- |
| **Azure AD-only authentication** | It's now possible to restrict authentication to your Azure SQL Database to Azure Active Directory users only. This feature is currently in preview. To learn more, see [Azure AD-only authentication](authentication-azure-ad-only-authentication.md). | 
|||

### June 2021

| Changes | Details |
| --- | --- |
| **Query store hints** | It's now possible to use query hints to optimize your query execution via the OPTION clause. This feature is currently in preview. To learn more, see [Query store hints](/sql/relational-databases/performance/query-store-hints?view=azuresqldb-current&preserve-view=true). | 
|||

### May 2021

| Changes | Details |
| --- | --- |
| **Change data capture** | Using change data capture (CDC) with Azure SQL Database is now in preview. To learn more, see [Change data capture](/sql/relational-databases/track-changes/about-change-data-capture-sql-server). | 
| **SQL Database ledger** | SQL Database ledger is in preview, and introduces the ability to cryptographically attest to other parties, such as auditors or other business parties, that your data hasn't been tampered with. To learn more, see [Ledger](ledger-overview.md). | 
|||

### March 2021

| Changes | Details |
| --- | --- |
 | **Maintenance window** | The maintenance window feature allows you to configure a maintenance schedule for your Azure SQL Database, currently in preview. To learn more, see [maintenance window](maintenance-window.md).|
| **SQL insights** | SQL insights is a comprehensive solution for monitoring any product in the Azure SQL family. SQL insights uses dynamic management views to expose the data you need to monitor health, diagnose problems, and tune performance. To learn more, see [SQL insights](../../azure-monitor/insights/sql-insights-overview.md). | 
||| 

## Contribute to content

To contribute to the Azure SQL documentation, see the [Docs contributor guide](/contribute/).

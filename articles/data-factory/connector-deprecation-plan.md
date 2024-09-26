---
title: Planned connector deprecations for Azure Data Factory
description: This page describes future deprecations for some connectors of Azure Data Factory.
author: jianleishen
ms.author: jianleishen
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.custom: references_regions
ms.date: 09/24/2024
---

# Planned connector deprecations for Azure Data Factory

This article describes future deprecations for some connectors of Azure Data Factory.

> [!NOTE]
> "Deprecated" means we intend to remove the connector from a future release. Unless they are in *Preview*, connectors remain fully supported until they are officially deprecated. This deprecation notification can span a few months or longer. After removal, the connector will no longer work. This notice is to allow you sufficient time to plan and update your code before the connector is deprecated.

## Overview

| Connector|Release stage |End of Support Date  |Disabled Date  | 
|:-- |:-- |:-- | :-- | 
| [Google BigQuery (legacy)](connector-google-bigquery-legacy.md)  | End of support announced and new version available | October 31, 2024 | January 10, 2025 | 
| [MariaDB (legacy driver version)](connector-mariadb.md)  | End of support announced and new version available | October 31, 2024 | January 10, 2025 | 
| [MySQL (legacy driver version)](connector-mysql.md)  | End of support announced and new version available | October 31, 2024| January 10, 2025| 
| [Salesforce (legacy)](connector-salesforce-legacy.md)   | End of support announced and new version available | October 11, 2024 | January 10, 2025| 
| [Salesforce Service Cloud (legacy)](connector-salesforce-service-cloud-legacy.md)   | End of support announced and new version available | October 11, 2024 |January 10, 2025 | 
| [PostgreSQL (legacy)](connector-postgresql-legacy.md)   | End of support announced and new version available |October 31, 2024 | January 10, 2025  | 
| [Snowflake (legacy)](connector-snowflake-legacy.md)   | End of support announced and new version available | October 31, 2024 | January 10, 2025  | 
| [Azure Database for MariaDB](connector-azure-database-for-mariadb.md) | End of support announced |December 31, 2024 | December 31, 2024 | 
| [Concur (Preview)](connector-concur.md) | End of support announced | December 31, 2024 | December 31, 2024 | 
| [Couchbase (Preview)](connector-couchbase.md) | End of support announced | December 31, 2024 | December 31, 2024 | 
| [Drill](connector-drill.md) | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Hbase](connector-hbase.md) | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Magento (Preview)](connector-magento.md) | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Marketo (Preview)](connector-marketo.md) | End of support announced  | December 31, 2024| December 31, 2024 | 
| [Oracle Eloqua (Preview)](connector-oracle-eloqua.md) | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Oracle Responsys (Preview)](connector-oracle-responsys.md) | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Oracle Service Cloud (Preview)](connector-oracle-service-cloud.md) | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Paypal (Preview)](connector-paypal.md) | End of support announced  |December 31, 2024 | December 31, 2024| 
| [Phoenix](connector-phoenix.md) | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Salesforce Marketing Cloud](connector-salesforce-marketing-cloud.md) | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Zoho (Preview)](connector-zoho.md) | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Amazon Marketplace Web Service](connector-amazon-marketplace-web-service.md)| Disabled |/  |/  | 


## Release stages and support

This section describes the different release stages and support for each stage.

| Release stage |Notes  | 
|:--  |:-- | 
| End of Support announcement | Before the end of the lifecycle at any stage, an end of support announcement is performed.<br><br>Support Service Level Agreements (SLAs) are applicable for End of Support announced connectors, but all customers must upgrade to a new version of the connector no later than the End of Support date.<br><br>During this stage, the existing connectors function as expected, but objects such as linked service can be created only on the new version of the connector.  | 
| End of Support | At this stage, the connector is considered as deprecated, and no longer supported.<br>&nbsp;&nbsp;• No plan to fix bugs. <br>&nbsp;&nbsp;• No plan to add any new features. <br><br> If necessary due to outstanding security issues, or other factors, **Microsoft might expedite moving into the final disabled stage at any time, at Microsoft's discretion**.| 
|Disabled |All pipelines that are running on legacy version connectors will no longer be able to execute.| 

## Legacy connectors with updated connectors or drivers available now

The following legacy connectors or legacy driver versions will be deprecated, but new updated versions are available in Azure Data Factory. You can update existing data sources to use the new connectors moving forward.

- [Google BigQuery](connector-google-bigquery.md#upgrade-the-google-bigquery-linked-service)
- [MariaDB](connector-mariadb.md#upgrade-the-mariadb-driver-version)
- [MySQL](connector-mysql.md#upgrade-the-mysql-driver-version)
- [PostgreSQL](connector-postgresql.md#upgrade-the-postgresql-linked-service)
- [Salesforce](connector-salesforce.md#upgrade-the-salesforce-linked-service)
- [Salesforce Service Cloud](connector-salesforce-service-cloud.md#upgrade-the-salesforce-service-cloud-linked-service)
- [ServiceNow](connector-servicenow.md#upgrade-your-servicenow-linked-service)
- [Snowflake](connector-snowflake.md#upgrade-the-snowflake-linked-service)

## Connectors to be deprecated on December 31, 2024

The following connectors are scheduled for deprecation on December 31, 2024. You should plan to migrate to alternative solutions for linked services that use these connectors before the deprecation date.

- [Azure Database for MariaDB](connector-azure-database-for-mariadb.md)
- [Concur (Preview)](connector-concur.md)
- [Couchbase (Preview)](connector-couchbase.md)
- [Drill](connector-drill.md)
- [Hbase](connector-hbase.md)
- [Magento (Preview)](connector-magento.md)
- [Marketo (Preview)](connector-marketo.md)
- [Oracle Eloqua (Preview)](connector-oracle-eloqua.md)
- [Oracle Responsys (Preview)](connector-oracle-responsys.md)
- [Oracle Service Cloud (Preview)](connector-oracle-service-cloud.md)
- [Paypal (Preview)](connector-paypal.md)
- [Phoenix](connector-phoenix.md)
- [Salesforce Marketing Cloud](connector-salesforce-marketing-cloud.md)
- [Zoho (Preview)](connector-zoho.md)


## Connectors that are deprecated

The following connector was deprecated.

- [Amazon Marketplace Web Service](connector-amazon-marketplace-web-service.md)

## Options to replace deprecated connectors

If legacy connectors are deprecated with no updated connectors available, you can still use the
[ODBC Connector](connector-odbc.md) which enables you to continue using these data sources with their native ODBC drivers, or other alternatives. This can enable you to continue using them indefinitely into the future.

## Related content

- [Azure Data Factory connectors overview](connector-overview.md)
- [What's new in Azure Data Factory?](whats-new.md)

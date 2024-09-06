---
title: Planned connector deprecations for Azure Data Factory
description: This page describes future deprecations for some connectors of Azure Data Factory.
author: pennyzhou-msft
ms.author: xupzhou
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.custom: references_regions
ms.date: 09/05/2024
---

# Planned connector deprecations for Azure Data Factory

This article describes future deprecations for some connectors of Azure Data Factory.

> [!NOTE]
> "Deprecated" means we intend to remove the connector from a future release. Unless they are in *Preview*, connectors remain fully supported until they are officially deprecated. This deprecation notification can span a few months or longer. After removal, the connector will no longer work. This notice is to allow you sufficient time to plan and update your code before the connector is deprecated.

## Legacy connectors with updated connectors or drivers available now

The following legacy connectors or legacy driver versions will be deprecated, but new updated versions are available in Azure Data Factory. You can update existing data sources to use the new connectors moving forward.

- [Google Ads/Adwords](connector-google-adwords.md#upgrade-the-google-ads-driver-version)
- [Google BigQuery](connector-google-bigquery.md#upgrade-the-google-bigquery-linked-service)
- [MariaDB](connector-mariadb.md#upgrade-the-mariadb-driver-version)
- [MongoDB](connector-mongodb.md#upgrade-the-mongodb-linked-service)
- [MySQL](connector-mysql.md#upgrade-the-mysql-driver-version)
- [Salesforce](connector-salesforce.md#upgrade-the-salesforce-linked-service)
- [Salesforce Service Cloud](connector-salesforce-service-cloud.md#upgrade-the-salesforce-service-cloud-linked-service)
- [ServiceNow](connector-servicenow.md#upgrade-your-servicenow-linked-service)
- [Snowflake](connector-snowflake.md#upgrade-the-snowflake-linked-service)

## Connectors to be deprecated on December 31, 2024

The following connectors are scheduled for deprecation on December 31, 2024. You should plan to migrate to alternative solutions for linked services that use these connectors before the deprecation date.

- [Azure Database for MariaDB](connector-azure-database-for-mariadb.md)
- [Concur (Preview)](connector-concur.md)
- [Drill](connector-drill.md)
- [Hbase](connector-hbase.md)
- [Magento (Preview)](connector-magento.md)
- [Marketo (Preview)](connector-marketo.md)
- [Oracle Responsys (Preview)](connector-oracle-responsys.md)
- [Paypal (Preview)](connector-paypal.md)
- [Phoenix](connector-phoenix.md)


## Connectors that are deprecated

The following connector was deprecated.

- [Amazon Marketplace Web Service](connector-amazon-marketplace-web-service.md)

## Options to replace deprecated connectors

If legacy connectors are deprecated with no updated connectors available, you can still use the
[ODBC Connector](connector-odbc.md) which enables you to continue using these data sources with their native ODBC drivers, or other alternatives. This can enable you to continue using them indefinitely into the future.

## Related content

- [Azure Data Factory connectors overview](connector-overview.md)
- [What's new in Azure Data Factory?](whats-new.md)

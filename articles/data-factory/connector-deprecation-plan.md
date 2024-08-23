---
title: Planned connector deprecations for Azure Data Factory
description: This page describes future deprecations for some connectors of Azure Data Factory.
author: pennyzhou-msft
ms.author: xupzhou
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.custom: references_regions
ms.date: 10/11/2023
---

# Planned connector deprecations for Azure Data Factory

This article describes future deprecations for some connectors of Azure Data Factory.

> [!NOTE]
> "Deprecated" means we intend to remove the connector from a future release. Unless they are in *Preview*, connectors remain fully supported until they are officially removed. This deprecation notification can span a few months or longer. After removal, the connector will no longer work. This notice is to allow you sufficient time to plan and update your code before the connector is removed.

## Legacy connectors with updated connectors or drivers available now

The following legacy connectors are deprecated, but new updated versions are available in Azure Data Factory. You can update existing data sources to use the new connectors moving forward.

- [Google Ads/Adwords](connector-google-adwords.md)
- [Google BigQuery](connector-google-bigquery-legacy.md)
- [MariaDB](connector-mariadb.md)
- [MongoDB](connector-mongodb-legacy.md)
- [MySQL](connector-mysql.md)
- [Salesforce (Service Cloud)](connector-salesforce-service-cloud-legacy.md)
- [ServiceNow](connector-servicenow.md)
- [Snowflake](connector-snowflake-legacy.md)

## Use the generic ODBC connector to replace deprecated connectors

If legacy connectors are deprecated with no updated connectors available, you can still use the generic [ODBC Connector](connector-odbc.md), which enables you to continue using these data sources with their native ODBC drivers. This can enable you to continue using them indefinitely into the future.

## Connectors to be deprecated on December 31, 2024

The following connectors are scheduled for deprecation at the end of December 2024 and have no updated replacement connectors. You should plan to migrate to alternative solutions for linked services that use these connectors before the deprecation date.

- [Amazon Marketplace Web Service (MWS)](connector-amazon-marketplace-web-service.md)
- [Azure Database for MariaDB](connector-azure-database-for-mariadb.md)
- [Concur (Preview)](connector-concur.md)
- [Hbase](connector-hbase.md)
- [Magento (Preview)](connector-magento.md)
- [Marketo (Preview)](connector-marketo.md)
- [Paypal (Preview)](connector-paypal.md)
- [Phoenix (Preview)](connector-phoenix.md)
- [Zoho (Preview)](connector-zoho.md)

## Related content

- [Azure Data Factory connectors overview](connector-overview.md)
- [What's new in Azure Data Factory?](whats-new.md)

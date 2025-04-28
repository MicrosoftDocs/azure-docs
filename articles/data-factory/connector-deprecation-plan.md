---
title: Upgrade plan for Azure Data Factory connectors
description: This article describes future upgrades for some connectors of Azure Data Factory.
author: jianleishen
ms.author: jianleishen
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.custom: references_regions
ms.date: 04/14/2025
---

# Upgrade plan for Azure Data Factory connectors

This article describes future upgrades for some connectors of Azure Data Factory.

> [!NOTE]
> "Deprecated" means we intend to remove the connector from a future release. Unless they are in *Preview*, connectors remain fully supported until they are officially deprecated. This deprecation notification can span a few months or longer. After removal, the connector will no longer work. This notice is to allow you sufficient time to plan and update your code before the connector is deprecated.

## Overview

| Connector|Upgrade Guidance|Release stage |End of Support Date  |Disabled Date  | 
|:-- |:-- |:-- |:-- | :-- | 
| [Azure Database for PostgreSQL (version 1.0)](connector-azure-database-for-postgresql.md)   | [Link](connector-azure-database-for-postgresql.md#upgrade-the-azure-database-for-postgresql-connector) | GA version available | To be determined | /  | 
| [Cassandra (version 1.0)](connector-cassandra.md) |[Link](connector-cassandra.md#upgrade-the-cassandra-connector) | Preview version available | To be determined | / | 
| [Google BigQuery (V1)](connector-google-bigquery-legacy.md)  | [Link](connector-google-bigquery.md#upgrade-the-google-bigquery-linked-service) |End of support and GA version available | October 31, 2024 | September 30, 2025| 
| [Greenplum (version 1.0)](connector-greenplum.md)  | [Link](connector-greenplum.md#upgrade-the-greenplum-connector) |Preview version available | To be determined | /| 
| [MariaDB (version 1.0)](connector-mariadb.md)  | [Link](connector-mariadb.md#upgrade-the-mariadb-driver-version) | End of support and GA version available | October 31, 2024 | September 30, 2025| 
| [MySQL (version 1.0)](connector-mysql.md)  | [Link](connector-mysql.md#upgrade-the-mysql-driver-version) |End of support and GA version available | October 31, 2024| September 30, 2025|
| [Oracle (version 1.0)](connector-oracle.md) |[Link](connector-oracle.md#upgrade-the-oracle-connector) | Preview version available | To be determined| / |  
| [Salesforce (V1)](connector-salesforce-legacy.md)   | [Link](connector-salesforce.md#upgrade-the-salesforce-linked-service) | GA version available | To be determined | /| 
| [Salesforce Service Cloud (V1)](connector-salesforce-service-cloud-legacy.md)   | [Link](connector-salesforce-service-cloud.md#upgrade-the-salesforce-service-cloud-linked-service) | GA version available | To be determined |/ | 
| [PostgreSQL (V1)](connector-postgresql-legacy.md)   | [Link](connector-postgresql.md#upgrade-the-postgresql-linked-service)| End of support and GA version available |October 31, 2024 | September 30, 2025| 
| [Presto (version 1.0)](connector-presto.md)   | [Link](connector-presto.md#upgrade-the-presto-connector)| Preview version available |To be determined | /  | 
| [ServiceNow (V1)](connector-servicenow-legacy.md)   | [Link](connector-servicenow.md#upgrade-your-servicenow-linked-service) | GA version available | To be determined | / | 
| [Snowflake (V1)](connector-snowflake-legacy.md)   | [Link](connector-snowflake.md#upgrade-the-snowflake-linked-service) | GA version available | To be determined | /  | 
| [Spark (version 1.0)](connector-spark.md)   | [Link](connector-spark.md#upgrade-the-spark-connector)| Preview version available |To be determined | /  | 
| [Vertica (version 1.0)](connector-vertica.md)| [Link](connector-vertica.md#upgrade-the-vertica-version) | GA version available | July 31, 2025 | /  | 
| [Azure Database for MariaDB](connector-azure-database-for-mariadb.md) |/ | End of support |December 31, 2024 | December 31, 2024 | 
| [Concur (Preview)](connector-concur.md) |/ | End of support | December 31, 2024 | December 31, 2024 | 
| [Couchbase (Preview)](connector-couchbase.md) |/ | End of support | December 31, 2024 | December 31, 2024 | 
| [Drill](connector-drill.md) |/ | End of support | December 31, 2024 | December 31, 2024 | 
| [HBase](connector-hbase.md) |/ | End of support | December 31, 2024 | December 31, 2024 | 
| [Magento (Preview)](connector-magento.md) |/ | End of support | December 31, 2024 | December 31, 2024 | 
| [Marketo (Preview)](connector-marketo.md) |/ | End of support | December 31, 2024| December 31, 2024 |
| [Oracle Eloqua (Preview)](connector-oracle-eloqua.md) |/ | End of support | December 31, 2024 | December 31, 2024 | 
| [Oracle Responsys (Preview)](connector-oracle-responsys.md) |/ | End of support | December 31, 2024 | December 31, 2024 | 
| [Oracle Service Cloud (Preview)](connector-oracle-service-cloud.md) |/ | End of support | December 31, 2024 | December 31, 2024 | 
| [PayPal (Preview)](connector-paypal.md) |/ | End of support |December 31, 2024 | December 31, 2024| 
| [Phoenix](connector-phoenix.md) |/ | End of support | December 31, 2024 | December 31, 2024 | 
| [Salesforce Marketing Cloud](connector-salesforce-marketing-cloud.md) |/ | End of support  | December 31, 2024 | December 31, 2024 | 
| [Zoho (Preview)](connector-zoho.md) |/ | End of support | December 31, 2024 | December 31, 2024 | 
| [Amazon Marketplace Web Service](connector-amazon-marketplace-web-service.md)|/ | Disabled |/  |/  | 

If you need upgrade help, contact us via the way provided in the [FAQ article](connector-deprecation-frequently-asked-questions.md#what-should-i-do-if-i-encounter-the-feature-gaps-and-errors-bugs-that-are-preventing-me-from-migrating-to-the-new-connectors). 

## Release stages and support

This section describes the different release stages and support for each stage.

| Release stage |Notes  | 
|:--  |:-- | 
| End of Support announcement | Before the end of the lifecycle at any stage, an end of support announcement is performed.<br><br>Support Service Level Agreements (SLAs) are applicable for End of Support announced connectors, but all customers must upgrade to a new version of the connector no later than the End of Support date.<br><br>During this stage, the existing connectors function as expected, but objects such as linked service can be created only on the new version of the connector.  | 
| End of Support | At this stage, the connector is considered as deprecated, and no longer supported. Your pipeline will not fail due to the deprecation but with below cautions:<br>&nbsp;&nbsp;• No plan to fix bugs. <br>&nbsp;&nbsp;• No plan to add any new features. <br><br> If necessary due to outstanding security issues, or other factors, **Microsoft might expedite moving into the final disabled stage at any time, at Microsoft's discretion**.| 
|Disabled |All pipelines that are running on legacy version connectors will no longer be able to execute.| 

## V1 connectors with updated connectors or drivers available now

The following V1 connectors or version 1.0 now have new updated versions available in Azure Data Factory. You can update existing data sources to use the new connectors moving forward.

- [Azure Database for PostgreSQL](connector-azure-database-for-postgresql.md#upgrade-the-azure-database-for-postgresql-connector)
- [Cassandra](connector-cassandra.md#upgrade-the-cassandra-connector)
- [Google BigQuery](connector-google-bigquery.md#upgrade-the-google-bigquery-linked-service)
- [Greenplum](connector-greenplum.md#upgrade-the-greenplum-connector)
- [MariaDB](connector-mariadb.md#upgrade-the-mariadb-driver-version)
- [MySQL](connector-mysql.md#upgrade-the-mysql-driver-version)
- [Oracle](connector-oracle.md#upgrade-the-oracle-connector)
- [PostgreSQL](connector-postgresql.md#upgrade-the-postgresql-linked-service)
- [Presto](connector-presto.md#upgrade-the-presto-connector)
- [Salesforce](connector-salesforce.md#upgrade-the-salesforce-linked-service)
- [Salesforce Service Cloud](connector-salesforce-service-cloud.md#upgrade-the-salesforce-service-cloud-linked-service)
- [ServiceNow](connector-servicenow.md#upgrade-your-servicenow-linked-service)
- [Snowflake](connector-snowflake.md#upgrade-the-snowflake-linked-service)
- [Spark](connector-spark.md#upgrade-the-spark-connector)
- [Vertica](connector-vertica.md#upgrade-the-vertica-version)

## Connectors that are at End of Support stage

The following connectors have reached the End of Support stage, and new updated versions are now available in Azure Data Factory. You should upgrade to the latest versions of these connectors.

- [Google BigQuery (V1)](connector-google-bigquery-legacy.md)
- [MariaDB (version 1.0)](connector-mariadb.md)
- [MySQL (version 1.0)](connector-mysql.md) 
- [PostgreSQL (V1)](connector-postgresql-legacy.md) 

The following connectors are at End of Support stage. You should migrate to [alternative solutions for linked services](#options-to-replace-deprecated-connectors) that use these connectors.

- [Azure Database for MariaDB](connector-azure-database-for-mariadb.md)
- [Concur (Preview)](connector-concur.md)
- [Couchbase (Preview)](connector-couchbase.md)
- [Drill](connector-drill.md)
- [HBase](connector-hbase.md)
- [Magento (Preview)](connector-magento.md)
- [Marketo (Preview)](connector-marketo.md)
- [Oracle Eloqua (Preview)](connector-oracle-eloqua.md)
- [Oracle Responsys (Preview)](connector-oracle-responsys.md)
- [Oracle Service Cloud (Preview)](connector-oracle-service-cloud.md)
- [PayPal (Preview)](connector-paypal.md)
- [Phoenix](connector-phoenix.md)
- [Salesforce Marketing Cloud](connector-salesforce-marketing-cloud.md)
- [Zoho (Preview)](connector-zoho.md)


## Connectors that are deprecated

The following connector was deprecated.

- [Amazon Marketplace Web Service](connector-amazon-marketplace-web-service.md)

## Options to replace deprecated connectors

If V1 connectors are deprecated with no updated connectors available, you can still use the
[ODBC Connector](connector-odbc.md) which enables you to continue using these data sources with their native ODBC drivers, or other alternatives. This can enable you to continue using them indefinitely into the future.

## How to find your impacted objects in your data factory

Here's the steps to get your objects which still rely on the deprecated connectors or connectors that have a precise end of support date. It is recommended to take action to upgrade those object to the new connector version before the end of the support date.

1. Open your Azure Data Factory.
2. Go to Manage – Linked services page.
3. You should see the Linked Service that is still on V1 with alert behind it.
4. Click on the number under the 'Related' column will show you the related objects that utilize this particular Linked service.
5. To learn more about the upgrade guidance and the comparison between V1 and V2, you can navigate to the connector upgrade section within each connector page. 

:::image type="content" source="media/connector-deprecation-plan/linked-services-page.png" alt-text="Screenshot of the linked services page." lightbox="media/connector-deprecation-plan/linked-services-page.png":::

## Related content

- [Azure Data Factory connectors overview](connector-overview.md)
- [What's new in Azure Data Factory?](whats-new.md)

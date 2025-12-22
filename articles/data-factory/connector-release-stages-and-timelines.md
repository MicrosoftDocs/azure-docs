---
title: Connector release stages and timelines
description: This article describes release stages and timelines for some connectors of Azure Data Factory.
author: jianleishen
ms.author: jianleishen
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.custom: references_regions
ms.date: 11/19/2025
---

# Connector release stages and timelines

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides an overview of the release stages and timelines for each connector available in Azure Data Factory.
For comprehensive details on support levels and recommended usage at each stage, please see [this article](connector-lifecycle-overview.md#release-rhythm).

> [!NOTE]
> If you encounter any gaps while upgrading your connector to the latest version, please contact for help via the way provided in the [FAQ article](connector-deprecation-frequently-asked-questions.md#what-should-i-do-if-i-encounter-the-feature-gaps-and-errors-bugs-that-are-preventing-me-from-migrating-to-the-new-connectors).

| Connector                          | Latest Version | Release Stage                     | End-of-Support Date   | Removal date     |
|------------------------------------|----------------|------------------------------------|-----------------------|-----------------------|
| [Amazon Marketplace Web Service](connector-amazon-marketplace-web-service.md) | /              | Removed                 | /                     | /                     |
| [Amazon RDS for Oracle](connector-amazon-rds-for-oracle.md)                          | version 2.0    | GA                                | /                   | /                   |
|                                    | version 1.0    | End of support          | October 31, 2025         | March 31, 2026      |
| [Amazon Redshift](connector-amazon-redshift.md)                          | version 2.0    | GA          | /                   | /                   |
|                                    | version 1.0    | GA          | March 31, 2026      | April 30, 2026                   |
| [Azure Database for MariaDB](connector-azure-database-for-mariadb.md)         | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [Azure Database for PostgreSQL](connector-azure-database-for-postgresql.md)   | version 2.0    | GA                                | /                   | /                   |
|                                    | version 1.0    | GA                                | To be determined      | /                     |
| [Azure SQL Database](connector-azure-sql-database.md) | version 2.0  | GA                           | /                      | /                      |
|                                                       | version 1.0  | GA                           | To be determined       |/      |
| [Azure SQL Managed Instance](connector-azure-sql-managed-instance.md) | version 2.0  | GA                | /                      | /                      |
|                                                       | version 1.0  | GA                           | To be determined       | /     |
| [Azure Synapse Analytics](connector-azure-sql-data-warehouse.md) | version 2.0  | GA                  | /                      | /                      |
|                                                       | version 1.0  | GA                           | To be determined       | /    |
| [Cassandra](connector-cassandra.md)                          | version 2.0    | GA                                | /                   | /                   |
|                                    | version 1.0    | Removed         | July 31, 2025         | September 30, 2025    |
| [Concur (Preview)](connector-concur.md)                   | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [Couchbase (Preview)](connector-couchbase.md)                | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [Drill](connector-drill.md)                              | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [Google BigQuery V2](connector-google-bigquery.md)                    | version 1.1    | GA                                | /                   | /                   |
|                                    | version 1.0    | GA                                | /                   | /                   |
| [Google BigQuery V1](connector-google-bigquery-legacy.md)   | /              | Removed                   | October 31, 2024      | September 30, 2025    |
| [Greenplum](connector-greenplum.md)                        | version 2.0    | GA                   | /                   | /                   |
|                                    | version 1.0    | Removed                                | August 31, 2025     | September 30, 2025                    |
| [HBase](connector-hbase.md)                              | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [Hive](connector-hive.md)                          | version 2.0    | GA                                | /                   | /                   |
|                                    | version 1.0    | Removed         | September 30, 2025         | October 31, 2025    |
| [HubSpot](connector-hubspot.md)                          | version 2.0    |GA                            | /                   | /                   |
|                                    | version 1.0    | Removed          | October 22, 2025         | November 22, 2025      |
| [Impala](connector-impala.md)                          | version 2.0    | GA                                | /                   | /                   |
|                                    | version 1.0    | Removed          | September 30, 2025         | October 31, 2025    |
| [Magento (Preview)](connector-magento.md)                  | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [MariaDB](connector-mariadb.md)                            | version 2.0    | GA                                | /                   | /                   |
|                                    | version 1.0    | Removed                    | October 31, 2024      | September 30, 2025    |
| [Marketo (Preview)](connector-marketo.md)                  | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [MySQL](connector-mysql.md)                              | version 2.0    | GA                                | /                   | /                   |
|                                    | version 1.0    | Removed                | October 31, 2024      | September 30, 2025    |
| [Netezza](connector-netezza.md)                          | version 2.0    | GA                                | /                   | /                   |
|                                    | version 1.0    | Removed          | September 30, 2025         | October 31, 2025    |
| [Oracle](connector-oracle.md)                             | version 2.0    | GA                                | /                   | /                   |
|                                    | version 1.0    | End of support          | October 31, 2025         | March 31, 2026      |
| [Oracle Eloqua (Preview)](connector-oracle-eloqua.md)      | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [Oracle Responsys (Preview)](connector-oracle-responsys.md) | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [Oracle Service Cloud (Preview)](connector-oracle-service-cloud.md) | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [PayPal (Preview)](connector-paypal.md)                   | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [Phoenix](connector-phoenix.md)                            | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [PostgreSQL V2](connector-postgresql.md)                   | /              | GA                                | /                   | /                   |
| [PostgreSQL V1](connector-postgresql-legacy.md)            | /              | Removed                    | October 31, 2024      | September 30, 2025    |
| [Presto](connector-presto.md)                             | version 2.0    | GA                           | /                   | /                   |
|                                    | version 1.0    | Removed                             | August 31, 2025      | September 30, 2025                    |
| [QuickBooks Online](connector-quickbooks.md)                        | version 2.0    | GA                    | /                   |
|                                    | version 1.0    | Removed                                | August 31, 2025     | September 30, 2025                    |
| [Salesforce V2](connector-salesforce.md)                   | /              | GA                                | /                   | /                   |
| [Salesforce V1](connector-salesforce-legacy.md)            | /              | Removed          | June 30, 2025         | September 30, 2025    |
| [Salesforce Marketing Cloud](connector-salesforce-marketing-cloud.md) | /              | Removed                    | December 31, 2024     | December 31, 2024     |
| [Salesforce Service Cloud V2](connector-salesforce-service-cloud.md) | /              | GA                                | /                   | /                   |
| [Salesforce Service Cloud V1](connector-salesforce-service-cloud-legacy.md) | /              | Removed         | June 30, 2025         | September 30, 2025    |
| [ServiceNow V2](connector-servicenow.md)                   | /              | GA                                | /                   | /                   |
| [ServiceNow V1](connector-servicenow-legacy.md)            | /              | Removed          | June 30, 2025         | September 30, 2025    |
| [Shopify](connector-shopify.md)                        | version 2.0    | GA                     | /                   |/
|                                    | version 1.0    | Removed                                 | October 22, 2025     | November 22, 2025                    |
| [Snowflake V2](connector-snowflake.md)                     | version 1.1    | GA                                | /                   | /                   |
|                                    | version 1.0    | GA                                | /                   | /                   |
| [Snowflake V1](connector-snowflake-legacy.md)              | /              | Removed        | June 30, 2025         | September 30, 2025    |
| [Spark](connector-spark.md)                               | version 2.0    | GA                 | /                   | /                   |
|                                    | version 1.0    | Removed                          |September 30, 2025     | October 31, 2025                  |
| [SQL Server](connector-sql-server.md)                 | version 2.0  | GA                           | /                      | /                      |
|                                                       | version 1.0  | GA                           | To be determined       | /       |
| [Square](connector-square.md)                        | version 2.0    | GA                     | /                   |/
|                                    | version 1.0    | Removed                                | October 15, 2025     | November 15, 2025                    |
| [Teradata](connector-teradata.md)                          | version 2.0    | GA                  | /                   | /                   |
|                                    | version 1.0    | Removed                                | September 30, 2025     | October 31, 2025                     |
| [Vertica](connector-vertica.md)                            | version 2.0    | GA                                | /                   | /                   |
|                                    | version 1.0    | Removed       | July 31, 2025         | September 30, 2025    |
| [Zoho (Preview)](connector-zoho.md)                        | /              | Removed                    | December 31, 2024     | December 31, 2024     |

## Related content

- [Connector overview](connector-overview.md)  
- [Connector lifecycle overview ](connector-lifecycle-overview.md)
- [Connector upgrade guidance](connector-upgrade-guidance.md)  
- [Connector upgrade advisor](connector-upgrade-advisor.md)  
- [Connector upgrade FAQ](connector-deprecation-frequently-asked-questions.md)
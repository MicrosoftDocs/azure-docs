---
title: Upgrade plan for Azure Data Factory connectors
description: This article describes future upgrades for some connectors of Azure Data Factory.
author: jianleishen
ms.author: jianleishen
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.custom: references_regions
ms.date: 12/10/2024
---

# Upgrade plan for Azure Data Factory connectors

This article describes future upgrades for some connectors of Azure Data Factory.

> [!NOTE]
> "Deprecated" means we intend to remove the connector from a future release. Unless they are in *Preview*, connectors remain fully supported until they are officially deprecated. This deprecation notification can span a few months or longer. After removal, the connector will no longer work. This notice is to allow you sufficient time to plan and update your code before the connector is deprecated.

## Overview

| Connector|Upgrade Guidance|Release stage |End of Support Date  |Disabled Date  | 
|:-- |:-- |:-- |:-- | :-- | 
| [Google BigQuery (legacy)](connector-google-bigquery-legacy.md)  | [Link](connector-google-bigquery.md#upgrade-the-google-bigquery-linked-service) |End of support and GA version available | October 31, 2024 | / | 
| [MariaDB (legacy driver version)](connector-mariadb.md)  | [Link](connector-mariadb.md#upgrade-the-mariadb-driver-version) | End of support and GA version available | October 31, 2024 | /| 
| [MySQL (legacy driver version)](connector-mysql.md)  | [Link](connector-mysql.md#upgrade-the-mysql-driver-version) |End of support and GA version available | October 31, 2024| /| 
| [Salesforce (legacy)](connector-salesforce-legacy.md)   | [Link](connector-salesforce.md#upgrade-the-salesforce-linked-service) | GA version available | To be determined | /| 
| [Salesforce Service Cloud (legacy)](connector-salesforce-service-cloud-legacy.md)   | [Link](connector-salesforce-service-cloud.md#upgrade-the-salesforce-service-cloud-linked-service) | GA version available | To be determined |/ | 
| [PostgreSQL (legacy)](connector-postgresql-legacy.md)   | [Link](connector-postgresql.md#upgrade-the-postgresql-linked-service)| End of support and GA version available |October 31, 2024 | /  | 
| [ServiceNow (legacy)](connector-servicenow-legacy.md)   | [Link](connector-servicenow.md#upgrade-your-servicenow-linked-service) | GA version available | To be determined | / | 
| [Snowflake (legacy)](connector-snowflake-legacy.md)   | [Link](connector-snowflake.md#upgrade-the-snowflake-linked-service) | GA version available | To be determined | /  | 
| [Vertica (version 1.0)](connector-vertica.md)| [Link](connector-vertica.md#upgrade-the-vertica-version) | Preview version available | To be determined | /  | 
| [Azure Database for MariaDB](connector-azure-database-for-mariadb.md) |/ | End of support announced |December 31, 2024 | December 31, 2024 | 
| [Concur (Preview)](connector-concur.md) |/ | End of support announced | December 31, 2024 | December 31, 2024 | 
| [Couchbase (Preview)](connector-couchbase.md) |/ | End of support announced | December 31, 2024 | December 31, 2024 | 
| [Drill](connector-drill.md) |/ | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [HBase](connector-hbase.md) |/ | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Magento (Preview)](connector-magento.md) |/ | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Marketo (Preview)](connector-marketo.md) |/ | End of support announced  | December 31, 2024| December 31, 2024 | 
| [Oracle Eloqua (Preview)](connector-oracle-eloqua.md) |/ | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Oracle Responsys (Preview)](connector-oracle-responsys.md) |/ | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Oracle Service Cloud (Preview)](connector-oracle-service-cloud.md) |/ | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [PayPal (Preview)](connector-paypal.md) |/ | End of support announced  |December 31, 2024 | December 31, 2024| 
| [Phoenix](connector-phoenix.md) |/ | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Salesforce Marketing Cloud](connector-salesforce-marketing-cloud.md) |/ | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Zoho (Preview)](connector-zoho.md) |/ | End of support announced  | December 31, 2024 | December 31, 2024 | 
| [Amazon Marketplace Web Service](connector-amazon-marketplace-web-service.md)|/ | Disabled |/  |/  | 


## Release stages and support

This section describes the different release stages and support for each stage.

| Release stage |Notes  | 
|:--  |:-- | 
| End of Support announcement | Before the end of the lifecycle at any stage, an end of support announcement is performed.<br><br>Support Service Level Agreements (SLAs) are applicable for End of Support announced connectors, but all customers must upgrade to a new version of the connector no later than the End of Support date.<br><br>During this stage, the existing connectors function as expected, but objects such as linked service can be created only on the new version of the connector.  | 
| End of Support | At this stage, the connector is considered as deprecated, and no longer supported. Your pipeline will not fail due to the deprecation but with below cautions:<br>&nbsp;&nbsp;• No plan to fix bugs. <br>&nbsp;&nbsp;• No plan to add any new features. <br><br> If necessary due to outstanding security issues, or other factors, **Microsoft might expedite moving into the final disabled stage at any time, at Microsoft's discretion**.| 
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
- [Vertica](connector-vertica.md#upgrade-the-vertica-version)

## Connectors to be deprecated on December 31, 2024

The following connectors are scheduled for deprecation on December 31, 2024. You should plan to migrate to alternative solutions for linked services that use these connectors before the deprecation date.

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

If legacy connectors are deprecated with no updated connectors available, you can still use the
[ODBC Connector](connector-odbc.md) which enables you to continue using these data sources with their native ODBC drivers, or other alternatives. This can enable you to continue using them indefinitely into the future.

## How to find your impacted objects in your data factory

Here's the steps to get your objects which still rely on the deprecated connectors or connectors that have a precise end of support date. It is recommended to take action to upgrade those object to the new connector version before the end of the support date.

1. Open your Azure Data Factory.
2. Go to Manage – Linked services page.
3. You should see the Linked Service that is still on legacy version with alert behind it.
4. Click on the number under the 'Related' column will show you the related objects that utilize this particular Linked service.
5. To learn more about the upgrade guidance and the comparison between the legacy and the new version, you can navigate to the connector upgrade section within each connector page. 

:::image type="content" source="media/connector-deprecation-plan/linked-services-page.png" alt-text="Screenshot of the linked services page." lightbox="media/connector-deprecation-plan/linked-services-page.png":::

## Related content

- [Azure Data Factory connectors overview](connector-overview.md)
- [What's new in Azure Data Factory?](whats-new.md)

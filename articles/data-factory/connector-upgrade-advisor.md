---
title: Connector upgrade advisor in Azure Data Factory and Azure Synapse Analytics 
description: This article describes Connector upgrade advisor in Azure Data Factory and Azure Synapse Analytics.
author: KrishnakumarRukmangathan
ms.author: krirukm
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.custom:
  - references_regions
  - build-2025
ms.date: 06/27/2025
---

# Connector upgrade advisor in Azure Data Factory and Azure Synapse Analytics

This article describes Connector upgrade advisor in Azure Data Factory and Azure Synapse Analytics.

To learn more, see [Upgrade plan for Azure Data Factory connectors](connector-deprecation-plan.md).

## Overview

The Connector upgrade advisor is a comprehensive tool that helps upgrade pipelines that use outdated V1 linked services and datasets to their latest available versions. This advisor tool applies to V1 connectors with updated versions already available.

:::image type="content" source="media/connector-upgrade-advisor/connector-upgrade-advisor.png" alt-text="Screenshot of the connector upgrade advisor tool page." lightbox="media/connector-upgrade-advisor/connector-upgrade-advisor.png":::

## Supported data sources

- Salesforce
- Salesforce Service Cloud
- ServiceNow
- Snowflake
- PostgreSQL
- Google BigQuery
- Amazon Redshift
- Amazon RDS for Oracle
- Cassandra
- Greenplum
- MariaDB
- MySQL
- Oracle
- Presto

## How to use

Before using the Connector upgrade advisor, it is recommended to **save** or **discard all** pending changes.

1. To access the **Connector upgrade advisor**, navigate to the **Manage** pane in your data factory. Under the **General** section, locate and select **Connector upgrade advisor**.

    :::image type="content" source="media/connector-upgrade-advisor/connector-upgrade-advisor.png" alt-text="Screenshot of the connector upgrade advisor page." lightbox="media/connector-upgrade-advisor/connector-upgrade-advisor.png":::

2. Once you select the **Connector upgrade advisor**, it scans your data factory and identifies all existing pipelines using outdated connectors along with the number of dependencies on outdated versions. 

    :::image type="content" source="media/connector-upgrade-advisor/outdated-connectors.png" alt-text="Screenshot of the outdated-connectors page." lightbox="media/connector-upgrade-advisor/outdated-connectors.png":::

3. In the **Connector upgrade advisor** home page, choose the pipelines you want to upgrade and click **Upgrade**.

    :::image type="content" source="media/connector-upgrade-advisor/upgrade.png" alt-text="Screenshot of upgrade." lightbox="media/connector-upgrade-advisor/upgrade.png":::

4. If a selected pipeline references an outdated dataset shared with other unselected pipelines, a **Select upgrade methods** dialog appears listing all the pipelines sharing datasets.

    :::image type="content" source="media/connector-upgrade-advisor/select-upgrade-methods.png" alt-text="Screenshot of the select-upgrade-methods page." lightbox="media/connector-upgrade-advisor/select-upgrade-methods.png":::

    If you want to upgrade all pipelines using the same dataset simultaneously, choose **Include listed pipelines to upgrade together**. Otherwise, if you just want to upgrade the selected pipeline separately, select **Create new datasets for selected pipelines**. Click **OK** to confirm your selection.

    :::image type="content" source="media/connector-upgrade-advisor/enable-options.png" alt-text="Screenshot of two options." lightbox="media/connector-upgrade-advisor/enable-options.png":::

5. The next window **Map outdated linked services to new linked services** list all outdated linked services. Select an equivalent V2 linked service from the dropdown menu or create a new one that supports the V2 format by clicking **New**. Once configured, click **Next**.

    :::image type="content" source="media/connector-upgrade-advisor/new-linked-services.png" alt-text="Screenshot of the linked services page." lightbox="media/connector-upgrade-advisor/new-linked-services.png":::

6. The **Update pipeline queries** page (if applicable) appears only if your selected pipelines use **Salesforce**, **Salesforce Service Cloud**, or **ServiceNow** connectors in the **Copy** activity with a query.

    Due to query format differences between V1 and V2: 

    - Salesforce queries are pre-populated as V1 (SQL) and V2 (SOQL) share common syntax. 

    - ServiceNow queries require manual adjustments, as the structure has changed. 

    Once modifications are complete, click **Next**.

    :::image type="content" source="media/connector-upgrade-advisor/update-pipeline-queries.png" alt-text="Screenshot of the update pipeline queries page." lightbox="media/connector-upgrade-advisor/update-pipeline-queries.png":::

7. Review and finalize changes using the **Review** page. It provides a summary of all modifications made by the advisor tool. Click **Open and review** to exit the wizard and navigate to the authoring page.

    :::image type="content" source="media/connector-upgrade-advisor/review-page.png" alt-text="Screenshot of the review page." lightbox="media/connector-upgrade-advisor/review-page.png":::

    Review all modified connectors, then **Save all** or **Publish all** the changes as needed.

    :::image type="content" source="media/connector-upgrade-advisor/save-publish.png" alt-text="Screenshot of the save or publish page." lightbox="media/connector-upgrade-advisor/save-publish.png":::

This process ensures a smooth transition from outdated connectors to the latest supported versions.  

## Related content

- [Connector overview](connector-overview.md)  
- [Connector lifecycle overview ](connector-lifecycle-overview.md)
- [Connector upgrade guidance](connector-upgrade-guidance.md) 
- [Connector release stages and timelines](connector-release-stages-and-timelines.md)    
- [Connector upgrade FAQ](connector-deprecation-frequently-asked-questions.md)  

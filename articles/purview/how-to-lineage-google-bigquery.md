---
title: Metadata and Lineage from BigQuery
description: This article describes the data lineage extraction from BigQuery source.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/12/2021
---
# How to get lineage from BigQuery into Azure Purview

This article elaborates on the data lineage aspects of BigQuery source in Azure Purview. The prerequisite to see data lineage in Purview for BigQuery is to [scan your BigQuery project.](../purview/register-scan-google-bigquery-source.md) 

## Lineage of BigQuery artifacts in Azure Purview

Users can search for BigQuery artifacts by name, description, or other details to see relevant results. Under the asset overview & properties tab the basic details such as description, properties and other information are shown. Under the lineage tab, asset relationships between BigQuery Tables and Views are shown.Therefore, BigQuery Views will have lineage information from tables. 

The lineage derived is available at the columns level as well.

:::image type="content" source="./media/how-to-lineage-google-bigquery/lineage.png" alt-text="Screenshot showing how lineage is rendered for BigQuery." lightbox="./media/how-to-lineage-google-bigquery/lineage.png":::


## Next steps

- [Learn about Data lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)

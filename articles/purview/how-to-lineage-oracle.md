---
title: Metadata and Lineage from Oracle
description: This article describes the data lineage extraction from Oracle source.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/11/2021
---
# How to get lineage from Oracle into Azure Purview

This article elaborates on the data lineage aspects of Oracle source in Azure Purview. The prerequisite to see data lineage in Purview for Oracle is to [scan your Oracle.](../purview/register-scan-oracle-source.md) 

## Lineage of Oracle artifacts in Azure Purview

Users can search for Oracle artifacts by name, description, or other details to see relevant results. Under the asset overview & properties tab the basic details such as description, classification and other information are shown. Under the lineage tab, asset relationships between Oracle Tables and Stored Procedures, Views and Functions are shown. 

Therefore, today Oracle Views will have lineage information from tables, while Functions and Stored Procedures will produce lineage between Table/View with parameter_dataset and stored_procedure_result_set. The lineage derived is available at the columns level as well.

:::image type="content" source="./media/how-to-lineage-oracle/lineage.png" alt-text="Screenshot showing how lineage is rendered for Oracle." lightbox="./media/how-to-lineage-oracle/lineage.png":::


## Next steps

- [Learn about Data lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)

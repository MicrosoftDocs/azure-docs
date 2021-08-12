---
title: Metadata and Lineage from Teradata
description: This article describes the data lineage extraction from Teradata source.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/12/2021
---
# How to get lineage from Teradata into Azure Purview

This article elaborates on the data lineage aspects of Teradata source in Azure Purview. The prerequisite to see data lineage in Purview for Teradata is to [scan your Teradata.](../purview/register-scan-teradata-source.md) 

## Lineage of Teradata artifacts in Azure Purview

Users can search for Teradata artifacts by name, description, or other details to see relevant results. Under the asset overview & properties tab the basic details such as description, properties and other information are shown. Under the lineage tab, asset relationships between Teradata Tables and Stored Procedures, and between Teradata Tables and Views are shown. 

Therefore, we support lineage for data transformations happening in Stored Procedures and  transformations in Views from Teradata tables. The lineage derived is available at the columns level as well.

:::image type="content" source="./media/how-to-lineage-teradata/lineage.png" alt-text="Screenshot showing how lineage is rendered for Teradata." lightbox="./media/how-to-lineage-teradata/lineage.png":::

In the above screenshot, **customerView** is a Teradata View  created from a Teradata table **test_customer**. Also, **Return_DataSet** is a stored procedure that uses a Teradata table **test_customer**.

## Next steps

- [Learn about Data lineage in Azure Purview](catalog-lineage-user-guide.md)
- If you are moving data to Azure from Teradata using ADF we can track lineage as part of the data movement run time. [Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)

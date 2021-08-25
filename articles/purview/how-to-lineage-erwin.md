---
title: Metadata and Lineage from Erwin
description: This article describes the data lineage extraction from Erwin source.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/11/2021
---
# How to get lineage from Erwin into Azure Purview

This article elaborates on the data lineage aspects of Erwin source in Azure Purview. The prerequisite to see data lineage in Purview for Erwin is to [scan your Erwin.](../purview/register-scan-erwin-source.md) 

## Lineage of Erwin artifacts in Azure Purview

Users can search for Erwin artifacts by name, description, or other details to see relevant results. Under the asset overview & properties tab the basic details such as description, properties and other information are shown. Under the lineage tab, asset relationships between Erwin Tables and Views are shown.Therefore, Erwin Views will have lineage information from tables. 

:::image type="content" source="./media/how-to-lineage-erwin/lineage.png" alt-text="Screenshot showing how lineage is rendered for Erwin." lightbox="./media/how-to-lineage-erwin/lineage.png":::


## Next steps

- [Learn about Data lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)

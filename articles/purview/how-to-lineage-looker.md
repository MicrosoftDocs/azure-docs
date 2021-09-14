---
title: Metadata and Lineage from Looker
description: This article describes the data lineage extraction from Looker source.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/12/2021
---
# How to get lineage from Looker into Azure Purview

This article elaborates on the data lineage aspects of Looker source in Azure Purview. The prerequisite to see data lineage in Purview for Looker is to [scan your Looker.](../purview/register-scan-looker-source.md) 

## Lineage of Looker artifacts in Azure Purview

Users can search for Looker artifacts by name, description, or other details to see relevant results. Under the asset overview & properties tab the basic details such as description, properties and other information are shown. Under the lineage tab, asset relationships between Looker Layouts and Views are shown.Therefore, today Looker Views will have lineage information from tables. 

:::image type="content" source="./media/how-to-lineage-looker/lineage.png" alt-text="Screenshot showing how lineage is rendered for Looker." lightbox="./media/how-to-lineage-looker/lineage.png":::


## Next steps

- [Learn about Data lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)

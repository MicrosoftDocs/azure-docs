---
title: Metadata and Lineage from Cassandra
description: This article describes the data lineage extraction from Cassandra source.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/12/2021
---
# How to get lineage from Cassandra into Azure Purview

This article elaborates on the data lineage aspects of Cassandra source in Azure Purview. The prerequisite to see data lineage in Purview for Cassandra is to [scan your Cassandra server.](../purview/register-scan-cassandra-source.md) 

## Lineage of Cassandra artifacts in Azure Purview

Users can search for Cassandra artifacts by name, description, or other details to see relevant results. Under the asset overview & properties tab the basic details such as description, properties and other information are shown. Under the lineage tab, asset relationships between Cassandra Tables and materialized Views are shown.Therefore, today Cassandra materialized Views will have lineage information from tables. 

The lineage derived is available at the columns level as well.

:::image type="content" source="./media/how-to-lineage-cassandra/lineage.png" alt-text="Screenshot showing how lineage is rendered for Cassandra." lightbox="./media/how-to-lineage-cassandra/lineage.png":::


## Next steps

- [Learn about Data lineage in Azure Purview](catalog-lineage-user-guide.md)
- [Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)

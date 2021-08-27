---
title: Metadata and Lineage from SAP ECC
description: This article describes the data lineage extraction from SAP ECC source.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/12/2021
---
# How to get lineage from SAP ECC into Azure Purview

This article elaborates on the data lineage aspects of SAP ECC source in Azure Purview. The prerequisite to see data lineage in Purview for SAP ECC is to [scan your SAP ECC.](../purview/register-scan-sapecc-source.md) 

## Lineage of SAP ECC artifacts in Azure Purview

Users can search for SAP ECC artifacts by name, description, or other details to see relevant results. Under the asset overview & properties tab the basic details such as description, properties and other information are shown. Under the lineage tab, asset relationships between SAP ECC Tables and Views are shown.Therefore, SAP ECC Views will have lineage information from tables. 

The lineage derived is available at the columns level as well.

:::image type="content" source="./media/how-to-lineage-sapecc/lineage.png" alt-text="Screenshot showing how lineage is rendered for SAP ECC." lightbox="./media/how-to-lineage-sapecc/lineage.png":::


## Next steps

- [Learn about Data lineage in Azure Purview](catalog-lineage-user-guide.md)
- If you are moving data to Azure from SAP ECC using ADF we can track lineage as part of the data movement run time - [Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)

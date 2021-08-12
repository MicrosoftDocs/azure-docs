---
title: Metadata and Lineage from SAP S/4HANA
description: This article describes the data lineage extraction from SAP S/4HANA source.
author: chandrakavya
ms.author: kchandra
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 08/12/2021
---
# How to get lineage from SAP S/4HANA into Azure Purview

This article elaborates on the data lineage aspects of SAP S/4HANA source in Azure Purview. The prerequisite to see data lineage in Purview for SAP S/4HANA is to [scan your SAP S/4HANA.](../purview/register-scan-saps4hana-source.md) 

## Lineage of SAP S/4HANA artifacts in Azure Purview

Users can search for SAP S/4HANA artifacts by name, description, or other details to see relevant results. Under the asset overview & properties tab the basic details such as description, properties and other information are shown. Under the lineage tab, asset relationships between SAP S/4HANA Tables and Views are shown. Therefore, SAP S/4HANA Views will have lineage information from tables. 

The lineage derived is available at the columns level as well.

## Next steps

- [Learn about Data lineage in Azure Purview](catalog-lineage-user-guide.md)
- If you are moving data to Azure from SAP S/4HANA using ADF we can track lineage as part of the data movement run time.[Link Azure Data Factory to push automated lineage](how-to-link-azure-data-factory.md)

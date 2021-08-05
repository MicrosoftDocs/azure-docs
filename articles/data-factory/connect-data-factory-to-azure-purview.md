---
title: Connect a Data Factory to Azure Purview
description: Learn about how to connect a Data Factory to Azure Purview
ms.author: jingwang
author: linda33wj
ms.service: data-factory
ms.topic: conceptual
ms.custom: seo-lt-2019, references_regions, synapse
ms.date: 12/3/2020
---

# Connect Data Factory to Azure Purview (Preview)
[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article will explain how to connect Data Factory to Azure Purview and how to report data lineage of Azure Data Factory activities Copy data, Data flow and Execute SSIS package.


## Connect Data Factory to Azure Purview
Azure Purview is a new cloud service for use by data users centrally manage data governance across their data estate spanning cloud and on-prem environments. You can connect your Data Factory to Azure Purview and the connection allows you to use Azure Purview for capturing lineage data of Copy, Data flow and Execute SSIS package. 
You have two ways to connect data factory to Azure Purview:
### Register Azure Purview account to Data Factory
1. In the ADF portal, go to **Manage** -> **Azure Purview**. Select **Connect to a Purview account**. 

:::image type="content" source="./media/data-factory-purview/register-purview-account.png" alt-text="Screenshot for registering a Purview account.":::
2. You can choose **From Azure subscription** or **Enter manually**. **From Azure subscription**, you can select the account that you have access to. 
3. Once connected, you should be able to see the name of the Purview account in the tab **Purview account**. 
4. You can use the Search bar at the top center of Azure Data Factory portal to search for data. 

If you see warning in Azure Data Factory portal after you register Azure Purview account to Data Factory, follow below steps to fix the issue:

:::image type="content" source="./media/data-factory-purview/register-purview-account-warning.png" alt-text="Screenshot for warning of registering a Purview account.":::

1. Go to Azure portal and find your data factory. Choose section "Tags" and see if there is a tag named **catalogUri**. If not, please disconnect and reconnect the Azure Purview account in the ADF portal.

:::image type="content" source="./media/data-factory-purview/register-purview-account-tag.png" alt-text="Screenshot for tags of registering a Purview account.":::

2. Check if the permission is granted for registering an Azure Purview account to Data Factory. See [How to connect Azure Data Factory and Azure Purview](../purview/how-to-link-azure-data-factory.md#create-new-data-factory-connection)

### Register Data Factory in Azure Purview
For how to register Data Factory in Azure Purview, see [How to connect Azure Data Factory and Azure Purview](../purview/how-to-link-azure-data-factory.md). 

## Report Lineage data to Azure Purview
When customers run Copy, Data flow or Execute SSIS package activity in Azure Data Factory, customers could get the dependency relationship and have a high-level overview of whole workflow process among data sources and destination.
For how to collect lineage from Azure Data Factory, see [data factory lineage](../purview/how-to-link-azure-data-factory.md#supported-azure-data-factory-activities).

## Next steps
[Catalog lineage user guide](../purview/catalog-lineage-user-guide.md)

[Tutorial: Push Data Factory lineage data to Azure Purview](turorial-push-lineage-to-purview.md)

---
title: Microsoft Purview Data Lineage best practices
description: This article provides best practices for data Lineage various data sources in Microsoft Purview.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 12/12/2022
---


# Microsoft Purview Data Lineage best practices

Data Lineage is broadly understood as the lifecycle that spans the data’s origin, and where it moves over time across the data estate. Microsoft Purview can capture lineage for data in different parts of your organization's data estate, and at different levels of preparation including: 
* Raw data staged from various platforms 
* Transformed and prepared data 
* Data used by visualization platforms

## Why do you need adopt Lineage?  

Data lineage is the process of describing what data exists, where it's stored and how it flows between systems. There are many reasons why data lineage is important, but at a high level these can all be boiled down to three categories that we'll explore here: 
* Track data in reports 
* Impact analysis 
* Capture the changes and where the data has resided through the data life cycle 

## Azure Data Factory Lineage best practice and considerations 

### Azure Data Factory instance 

* Data lineage won't be reported to the catalog automatically until the Data Factory connection status turns to Connected. The rest of status Disconnected and CannotAccess can't capture lineage. 

    :::image type="content" source="./media/how-to-link-azure-data-factory/data-factory-connection.png" alt-text="Screen shot showing a data factory connection list." lightbox="./media/how-to-link-azure-data-factory/data-factory-connection.png":::

* Each Data Factory instance can connect to only one Microsoft Purview account. You can establish new connection in another Microsoft Purview account, but this will turn existing connection to disconnected.  

    :::image type="content" source="./media/how-to-link-azure-data-factory/warning-for-disconnect-factory.png" alt-text="Screenshot showing warning to disconnect Azure Data Factory.":::

* Data factory's managed identity is used to authenticate lineage push operations in Microsoft Purview account. The data factory's managed identity needs Data Curator role on Microsoft Purview root collection.

* Currently, only 10 data factories can be connected at a time. If you want to add more than 10 data factories, please file a support ticket. 


### Azure Data Factory activities  

* Microsoft Purview captures runtime lineage from the following Azure Data Factory activities: 
    * [Copy activity ](../data-factory/copy-activity-overview.md)
    * [Data Flow activity](../data-factory/concepts-data-flow-overview.md)
    * [Execute SSIS Package activity](../data-factory/how-to-invoke-ssis-package-ssis-activity.md)

* Microsoft Purview drops lineage if the source or destination uses an unsupported data storage system.  
    * Supported data sources in copy activity are listed **Copy activity support** of [Connect to Azure Data Factory](how-to-link-azure-data-factory.md)
    * Supported data sources in data flow activity are listed **Data Flow support** of [Connect to Azure Data Factory](how-to-link-azure-data-factory.md)
    * Supported data sources in SSIS are listed **SSIS execute package activity support** of [Lineage from SQL Server Integration Services](how-to-lineage-sql-server-integration-services.md)

* Microsoft Purview can't capture lineage if Azure Data Factory copy activity uses copy activity features listed in **Limitations on copy activity lineage** of [Connect to Azure Data Factory](how-to-link-azure-data-factory.md)  

* For the lineage of Dataflow activity, Microsoft Purview only support source and sink. The lineage for Dataflow transformation isn't supported yet. 

* Data flow lineage doesn't integrate with Microsoft Purview resource set. 
    **Resource set example:**    
        Qualified name: https://myblob.blob.core.windows.net/sample-data/data{N}.csv 
        Display name: "data" 

* For the lineage of Execute SSIS Package activity, we only support source and destination. The lineage for transformation isn't supported yet. 

    :::image type="content" source="./media/concept-best-practices-lineage/ssis-lineage.png" alt-text="Screenshot of the Execute SSIS lineage in Microsoft Purview." lightbox="./media/concept-best-practices-lineage/ssis-lineage.png":::

* Please refer the following step-by-step guide to [push Azure Data Factory lineage in Microsoft Purview](../data-factory/tutorial-push-lineage-to-purview.md).  

## Next steps
-  [Manage data sources](./manage-data-sources.md)

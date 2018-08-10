---
title: Import a Power BI Desktop file into Azure Analysis Services | Microsoft Docs
description: Describes how to import a Power BI Desktop file (pbix) by using Azure portal.
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 07/03/2018
ms.author: owend
ms.reviewer: minewiskan

---

# Import a Power BI Desktop file

You can import a data model in a Power BI Desktop file (pbix) into Azure Analysis Services. Model metadata, cached data, and datasource connections are imported. Reports and visualizations are not imported. Imported data models from Power BI Desktop are at the 1400 compatibility level.

**Restrictions**   
- The pbix model can connect to **Azure SQL Database** and **Azure SQL Data Warehouse** data sources only. 
- The pbix model cannot have live or DirectQuery connections. 
- Import may fail if your pbix data model contains metadata not supported in Analysis Services.

## To import from pbix

1. In your server's **Overview** > **Web designer**, click **Open**.

    ![Create a model in Azure portal](./media/analysis-services-create-model-portal/aas-create-portal-overview-wd.png)

2. In **Web designer** > **Models**, click **+ Add**.

    ![Create a model in Azure portal](./media/analysis-services-create-model-portal/aas-create-portal-models.png)

3. In **New model**, type a model name, and then select Power BI Desktop file.

    ![New model dialog in Azure portal](./media/analysis-services-import-pbix/aas-import-pbix-new-model.png)

4. In **Import**, locate and select your file.

     ![Connect dialog in Azure portal](./media/analysis-services-import-pbix/aas-import-pbix-select-file.png)

## See also

[Create a model in Azure portal](analysis-services-create-model-portal.md)   
[Connect to Azure Analysis Services](analysis-services-connect.md)  

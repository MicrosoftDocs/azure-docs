---
title: Create a tabular model by using the Azure Analysis Services Web designer | Microsoft Docs
description: Learn how to create an Azure Analysis Services tabular model by using the Web designer in Azure portal.
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 10/11/2018
ms.author: owend
ms.reviewer: minewiskan

---
# Create a model in Azure portal

The Azure Analysis Services web designer (preview) feature in Azure portal provides a quick and easy way to create and edit tabular models and query model data right in your browser. 

> [!IMPORTANT]
> This feature is deprecated. It may be removed or significantly changed in a future update. It's recommended you discontinue using this features in new and existing projects to maintain compatibility with future updates. For more advanced model development and testing, it's best to use Visual Studio (SSDT) and SQL Server Management Studio (SSMS).


## Before you begin

- Your Azure Analysis Services server must be at the Standard or Developer tier. New models created by using the Web designer are DirectQuery, supported only by these tiers.
- An Azure SQL Database, Azure SQL Data Warehouse, or Power BI Desktop (.pbix) file as a datasource. New models created from Power BI Desktop files support Azure SQL Database and Azure SQL Data Warehouse.
- A SQL Server account and password for connecting to Azure SQL Database or Azure SQL Data Warehouse data sources.
- You must have server admin privileges to create a new model. Database admin privileges are required to edit and query a model by using the designer.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## To create a new tabular model

1. In your server **Overview** > **Web designer**, click **Open**.

    ![Create a model in Azure portal](./media/analysis-services-create-model-portal/aas-create-portal-overview-wd.png)

2. In **Web designer** > **Models**, click **+ Add**.

    ![Create a model in Azure portal](./media/analysis-services-create-model-portal/aas-create-portal-models.png)

3. In **New model**, type a model name, and then select a data source.

    ![New model dialog in Azure portal](./media/analysis-services-create-model-portal/aas-create-portal-new-model.png)

4. In **Connect**, enter the connection properties. Username and password must be a SQL Server account.

     ![Connect dialog in Azure portal](./media/analysis-services-create-model-portal/aas-create-portal-connect.png)

5. In **Tables and views**, select the tables to include in your model, and then click **Create**. Relationships are created automatically between tables with a key pair.

     ![Select tables and views](./media/analysis-services-create-model-portal/aas-create-portal-tables.png)

Your new model appears in your browser. From here, you can:   

- Query model data by dragging fields to the query designer and adding filters.
- Create new measures in tables.
- Edit model metadata by using the json editor.
- Open the model in Visual Studio (SSDT), Power BI Desktop, or Excel.

![Select tables and views](./media/analysis-services-create-model-portal/aas-create-portal-query.png)

> [!NOTE]
> When you edit model metadata or create new measures in your browser, you're saving those changes to your model in Azure. If you're also working on your model in SSDT, Power BI Desktop, or Excel, your model can get out of sync.


## Next steps 
[Manage database roles and users](analysis-services-database-users.md)  
[Connect with Excel](analysis-services-connect-excel.md)  



---
title: Overview of solution templates for Azure Data Factory | Microsoft Docs
description:  Learn how to use a pre-defined solution template to get started quickly with Azure Data Factory.
services: data-factory
documentationcenter: ''
author: douglaslMS
manager: craigg

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 01/04/2019
ms.author: douglasl
ms.reviewer: douglasl
---
# Templates

Templates are predefined Azure Data Factory pipelines that allow you to get started quickly with Data Factory. Templates are useful when you're new to Data Factory and want to get started quickly. These templates reduce the development time for building data integration projects thereby improving developer productivity.

## Create Data Factory pipelines from templates

You can get started creating a Data Factory pipeline from a template in the following two ways:

1.  Select **Create pipeline from template** on the Overview page to open the template gallery.

    ![Open the template gallery from the Overview page](media/solution-templates-introduction/templates-intro-image1.png)

1.  On the Author tab in Resource Explorer, select **+**, then **Pipeline from template** to open the template gallery.

    ![Open the template gallery from the Author tab](media/solution-templates-introduction/templates-intro-image2.png)

## Template Gallery

![The template gallery](media/solution-templates-introduction/templates-intro-image3.png)

### Out of the box Data Factory templates

These predefined templates provided by Microsoft include but are not limited to the following items:

-   Copy templates:

    -   Bulk copy from Database

    -   Copy multiple file containers between file-based stores

    -   Delta copy from Database

    -   Copy from \<source\> to \<destination\>

        -   From Amazon S3 to Azure Data Lake Store Gen 2

        -   From Google Big Query to Azure Data Lake Store Gen 2

        -   From HDF to Azure Data Lake Store Gen 2

        -   From Netezza to Azure Data Lake Store Gen 1

        -   From SQL Server on premises to Azure SQL Database

        -   From SQL Server on premises to Azure SQL Data Warehouse

        -   From Oracle on premises to Azure SQL Data Warehouse

-   SSIS templates

    -   Schedule Azure-SSIS Integration Runtime to execute SSIS packages

-   Transform templates

    -   ETL with Azure Databricks

### My Templates

You can also save a pipeline as a template by selecting **Save as template** on the Pipeline tab.

![Save a pipeline as a template](media/solution-templates-introduction/templates-intro-image4.png)

You can view pipelines saved as templates in the **My Templates** section of the Template Gallery. You can also see them in the **Templates** section in the Resource Explorer.

![My templates](media/solution-templates-introduction/templates-intro-image5.png)

> [!NOTE]
> To use the My Templates feature, you have to enable GIT integration. Both Azure DevOps GIT and GitHub are supported.

---
title: Overview of templates
description:  Learn how to use a pre-defined template to get started quickly with Azure Data Factory.
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
ms.author: susabat
author: ssabat
ms.date: 10/20/2023
---

# Templates

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Templates are predefined Azure Data Factory pipelines that allow you to get started quickly with Data Factory. Templates are useful when you're new to Data Factory and want to get started quickly. These templates reduce the development time for building data integration projects thereby improving developer productivity.

## Create Data Factory pipelines from templates

You can get started creating a Data Factory pipeline from a template in the following two ways:

1.  Select **Pipeline templates** in the **Discover more** section of the Data Factory home page to open the template gallery.

    :::image type="content" source="media/doc-common-process/home-page-pipeline-templates-tile.png" alt-text="Screenshot showing how to open the template gallery from the Data Factory home page.":::

1.  On the Author tab in Resource Explorer, select **+**, then select **Pipeline from template** to open the template gallery.

    :::image type="content" source="media/solution-templates-introduction/templates-introduction-image-2.png" alt-text="Screenshot showing how to open the template gallery from the Author tab.":::

## Template Gallery

:::image type="content" source="media/solution-templates-introduction/templates-introduction-image-3.png" alt-text="Screenshot showing the Template gallery page.":::

### Out of the box Data Factory templates

Data Factory uses Azure Resource Manager templates for saving data factory pipeline templates. You can see all the Resource Manager templates, along with the manifest file used for out of the box Data Factory templates, in the [official Azure Data Factory GitHub repo](https://github.com/Azure/Azure-DataFactory/tree/master/templates). The predefined templates provided by Microsoft include but are not limited to the following items:

-   Copy templates:

    -   [Bulk copy from Database](solution-template-bulk-copy-with-control-table.md)
    
    -   [Copy new files by LastModifiedDate](solution-template-copy-new-files-lastmodifieddate.md)

    -   [Copy multiple file containers between file-based stores](solution-template-copy-files-multiple-containers.md)

    -   [Move files](solution-template-move-files.md)

    -   [Delta copy from Database](solution-template-delta-copy-with-control-table.md)

    -   Copy from \<source\> to \<destination\>

        -   [From Amazon S3 to Azure Data Lake Store Gen 2](solution-template-migration-s3-azure.md)

        -   From Google Big Query to Azure Data Lake Store Gen 2

        -   From HDF to Azure Data Lake Store Gen 2

        -   From Netezza to Azure Data Lake Store Gen 1

        -   From SQL Server on premises to Azure SQL Database

        -   From SQL Server on premises to Azure Synapse Analytics

        -   From Oracle on premises to Azure Synapse Analytics

-   SSIS templates

    -   Schedule Azure-SSIS Integration Runtime to execute SSIS packages

-   Transform templates

    -   [ETL with Azure Databricks](solution-template-databricks-notebook.md)

### My Templates

You can also save a pipeline as a template by selecting **Save as template** on the Pipeline tab.

:::image type="content" source="media/solution-templates-introduction/templates-introduction-image-4.png" alt-text="Screenshot showing how to save a pipeline as a template.":::

After checking the **My templates** box in the **Template gallery** page, you can view pipelines saved as templates in the right pane of this page. 

:::image type="content" source="media/solution-templates-introduction/templates-introduction-image-5.png" alt-text="Screenshot showing the My templates pane.":::

> [!NOTE]
> To use the My Templates feature, you have to enable GIT integration. Both Azure DevOps GIT and GitHub are supported.

### Community Templates

Community members are now welcome to contribute to the Template Gallery. You will be able to see these templates when you filter by **Contributor**. 

:::image type="content" source="media/solution-templates-introduction/templates-introduction-image-6.png" alt-text="Screenshot of template gallery showing a Community contributor option under the Contributor filter.":::

To learn how you can contribute to the template gallery, please read our [introduction](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/introducing-azure-data-factory-community-templates/ba-p/3650989) and [instructions](https://github.com/Azure/Azure-DataFactory/tree/main/community%20templates). 

> [!NOTE]
> Community template submissions will be reviewed by the Azure Data Factory team. If your submission, does not meet our guidelines or quality checks, we will not merge your template into the gallery.



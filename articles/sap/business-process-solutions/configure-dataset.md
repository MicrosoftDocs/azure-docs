---
title: Configure Dataset in Business Process Solutions
description: Learn how to configure datasets in Business Process Solutions, including importing template datasets, enabling datasets for extraction and processing, and modifying dataset tables and relationships.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice:
ms.topic: how-to
ms.date: 11/07/2025
ms.author: momakhij
---

# Configure dataset in Business Process Solutions

Datasets are collections of objects used as sources for data extraction from the business application. Business Process Solutions provides prebuilt templates to accelerate analytics for selected functional areas. You can also create custom datasets to cover additional requirements. In this article, we describe the steps required to configure Dataset in Business Process Solutions. This document contains steps on how you can set up the dataset by importing template datasets depending on the source system you configure in your Business Process Solution item.
Prebuilt Power BI dashboards in Business Process Solutions rely on specific datasets as their foundation. The table below shows the required mapping between dashboards and datasets:

| Power BI Dashboard                        | Dataset                                             |
|-------------------------------------------|-----------------------------------------------------|
| Record to Report - Financial Insights     | Record to Report - Financial Insights               |
| Record to Report - Account Payables       | Record to Report - Account Payables Insights        |
| Record to Report - Account Receivables    | Record to Report - Account Receivables Insights     |
| Procure to Pay - Spend Insights           | Procure to Pay - Spend Insights                     |
| Order to Cash - Sales Insights            | Order to Cash - Sales Insights                      |
| Order to Cash - Opportunity Insights      | Order to Cash - Opportunities Insights              |

## Import dataset from template

Before starting data extraction, enable the datasets that represent the functional areas you want to process. Use the following steps to import a dataset from template.

1. Open your Business Process Solution item and click on the **Set up your Datasets** button.
   :::image type="content" source="./media/configure-dataset/set-up-datasets.png" alt-text="Screenshot showing how to navigate to the Dataset tab." lightbox="./media/configure-dataset/set-up-datasets.png":::
2. Choose **Import from template** to use an existing template.
3. Once the dialog opens select your source system and enter the name of the dataset, make sure to enter a unique name.
4. Select the dataset you want to enable then choose **Import**.
   :::image type="content" source="./media/configure-dataset/import-dataset-template.png" alt-text="Screenshot showing how to import a dataset from a template." lightbox="./media/configure-dataset/import-dataset-template.png":::
5. After the dataset creation is completed successfully, the dataset is in **Disabled** state, we need to enable this dataset. Select the dataset and click on **Activate datasets** button.
   :::image type="content" source="./media/configure-dataset/enable-dataset.png" alt-text="Screenshot showing how to activate a dataset." lightbox="./media/configure-dataset/enable-dataset.png":::
6. Your dataset is now ready for extraction and processing.

## Modify dataset tables and relationships

> [!NOTE]
> The below sections describe how to update dataset tables and relationships, these steps are optional and can be skipped if you don't want to make any changes to the dataset.

Once the dataset is deployed, you can view it and explore the enabled tables. You can also review the relationships between fact and dimension tables.

### Update dataset tables

Use the following steps to update the dataset tables:

1. Open your Business Process Solution item.
2. Click on the **Set up your datasets** button.
   :::image type="content" source="./media/configure-dataset/set-up-datasets.png" alt-text="Screenshot showing how to navigate to the Dataset tab." lightbox="./media/configure-dataset/set-up-datasets.png":::
3. To view the tables enabled for extraction, expand the source system and dataset in the explorer menu.
   :::image type="content" source="./media/configure-dataset/expand-dataset.png" alt-text="Screenshot showing how to expand the dataset to see tables." lightbox="./media/configure-dataset/expand-dataset.png":::
4. You can delete tables by selecting multiple tables and clicking the **Delete** button.
   :::image type="content" source="./media/configure-dataset/delete-table.png" alt-text="Screenshot showing how to delete a table from the dataset." lightbox="./media/configure-dataset/delete-table.png":::
5. You can also change the table details by opening the context menu and clicking on **Edit**.
   :::image type="content" source="./media/configure-dataset/edit-table.png" alt-text="Screenshot showing how to edit a table in the dataset." lightbox="./media/configure-dataset/edit-table.png":::
6. Click on the **Save** button to save the changes.

### Add a new table in dataset

You can add a new table in an existing dataset or import a table from the existing tables. Follow the steps to add or import a new table in your dataset.

1. Open your Business Process Solution item.
2. Click on the **Set up your datasets** button.
3. To view the tables enabled for extraction, expand the source system and dataset in the explorer menu.
4. Click on the **Import tables** button.
   :::image type="content" source="./media/configure-dataset/import-tables.png" alt-text="Screenshot showing how to import tables into the dataset." lightbox="./media/configure-dataset/import-tables.png":::
5. In the Import Tables dialog, you can either select an existing table to import to your dataset or add a new table.
6. To add a new table, click on the **New Table** button.
   :::image type="content" source="./media/configure-dataset/new-dataset-table.png" alt-text="Screenshot showing how to add a new table to the dataset." lightbox="./media/configure-dataset/new-dataset-table.png":::
7. Enter the details of the new table and click on the **Save** button.

### Create new relationships

To create new relationships between tables, use the following steps:

1. Open your Business Process Solution item.
2. Click on the **'Set up your datasets'** button.
   :::image type="content" source="./media/configure-dataset/set-up-datasets.png" alt-text="Screenshot showing how to navigate to the Dataset tab." lightbox="./media/configure-dataset/set-up-datasets.png":::
3. To view the tables enabled for extraction, expand the source system and dataset in the explorer menu.
4. Click on the **Manage relationship** button.
   :::image type="content" source="./media/configure-dataset/manage-relationship.png" alt-text="Screenshot showing the manage relationships button." lightbox="./media/configure-dataset/manage-relationship.png":::
5. In the Manage Relationships dialog, click on the **New Relationship** button.
   :::image type="content" source="./media/configure-dataset/create-new-relationship.png" alt-text="Screenshot showing the new relationship button." lightbox="./media/configure-dataset/create-new-relationship.png":::
6. Enter the inputs for the relationship like Fact table name, dimension table name, surrogate column name, which should be created. Enter the join condition referring the example mentioned in the dialog. Finally, if you would like to copy a column from dimension table to fact table, add the column names in import columns input.
   :::image type="content" source="./media/configure-dataset/create-relationship.png" alt-text="Screenshot showing the relationship input fields." lightbox="./media/configure-dataset/create-relationship.png":::
7. Click on the **Save** button to create the relationship.

### Delete relationships

To delete existing relationships between tables, select the relationship and click on the **Delete** button. This removes the relationship from the dataset, but this won't delete the surrogate keys which are already created in the fact tables.
   :::image type="content" source="./media/configure-dataset/delete-relationship.png" alt-text="Screenshot showing how to delete a relationship." lightbox="./media/configure-dataset/delete-relationship.png":::

### Edit relationships

To edit existing relationships between tables, select the relationship and scroll to the right to the action column, click on the **Edit** button. This allows you to modify the relationship details.
   :::image type="content" source="./media/configure-dataset/edit-relationship.png" alt-text="Screenshot showing how to edit a relationship." lightbox="./media/configure-dataset/edit-relationship.png":::

## Next steps

Now that you have configured source system and enabled dataset for extraction in your Business Process Solution item, you can proceed to run data replication and processing.

- [Run extraction and data processing in Business Process Solutions](run-extraction-data-processing.md)

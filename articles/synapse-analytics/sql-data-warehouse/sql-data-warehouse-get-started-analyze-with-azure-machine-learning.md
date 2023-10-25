---
title: Analyze data with Azure Machine Learning
description: Use Azure Machine Learning to build a predictive machine learning model based on data stored in Azure Synapse.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 07/15/2020
ms.service: synapse-analytics
ms.subservice: machine-learning
ms.topic: conceptual
ms.custom: seo-lt-2019
tag: azure-Synapse
---

# Analyze data with Azure Machine Learning

This tutorial uses [Azure Machine Learning designer](../../machine-learning/concept-designer.md) to build a predictive machine learning model. The model is based on the data stored in Azure Synapse. The scenario for the tutorial is to predict if a customer is likely to buy a bike or not so Adventure Works, the bike shop, can build a targeted marketing campaign.

## Prerequisites

To step through this tutorial, you need:

* a SQL pool pre-loaded with AdventureWorksDW sample data. To provision this SQL Pool, see [Create a SQL pool](create-data-warehouse-portal.md) and choose to load the sample data. If you already have a data warehouse but don't have sample data, you can [load sample data manually](./load-data-from-azure-blob-storage-using-copy.md).
* an Azure Machine learning workspace. Follow [this tutorial](../../machine-learning/how-to-manage-workspace.md) to create a new one.

## Get the data

The data used is in the dbo.vTargetMail view in AdventureWorksDW. To use Datastore in this tutorial, the data is first exported to Azure Data Lake Storage account as Azure Synapse doesn't currently support datasets. Azure Data Factory can be used to export data from the data warehouse to Azure Data Lake Storage using the [copy activity](../../data-factory/copy-activity-overview.md). Use the following query for import:

```sql
SELECT [CustomerKey]
  ,[GeographyKey]
  ,[CustomerAlternateKey]
  ,[MaritalStatus]
  ,[Gender]
  ,cast ([YearlyIncome] as int) as SalaryYear
  ,[TotalChildren]
  ,[NumberChildrenAtHome]
  ,[EnglishEducation]
  ,[EnglishOccupation]
  ,[HouseOwnerFlag]
  ,[NumberCarsOwned]
  ,[CommuteDistance]
  ,[Region]
  ,[Age]
  ,[BikeBuyer]
FROM [dbo].[vTargetMail]
```

Once the data is available in Azure Data Lake Storage, Datastores in Azure Machine Learning is used to [connect to Azure storage services](../../machine-learning/how-to-access-data.md). Follow the steps below to create a Datastore and a corresponding Dataset:

1. Launch Azure Machine Learning studio either from Azure portal or sign in at [Azure Machine Learning studio](https://ml.azure.com/).

1. Click on **Datastores** on the left pane in the **Manage** section and then click on **New Datastore**.

    :::image type="content" source="./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/datastores-tab.png" alt-text="Screenshot of left pane of Azure Machine Learning interface":::

1. Provide a name for the datastore, select the type as 'Azure Blob Storage', provide location and credentials. Then, click **Create**.

1. Next, click on **Datasets** on the left pane in the **Assets** section. Select **Create dataset** with the option **From datastore**.

1. Specify the name of the dataset and select the type to be **Tabular**. Then, click **Next** to move forward.

1. In **Select or create a datastore section**, select the option **Previously created datastore**. Select the datastore that was created earlier. Click Next and specify the path and file settings. Make sure to specify column header if the files contain one.

1. Finally, click **Create** to create the dataset.

## Configure designer experiment

Next, follow steps below for designer configuration:

1. Click on **Designer** tab on the left pane in the **Author** section.

1. Select **Easy-to-use prebuilt components** to build a new pipeline.

1. In the settings pane on the right, specify the name of the pipeline.

1. Also, select a target compute cluster for the whole experiment in settings button to a previously provisioned cluster. Close the Settings pane.

## Import the data

1. Select the **Datasets** subtab in the left pane below the search box.

1. Drag the dataset your created earlier into the canvas.

    :::image type="content" source="./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/import-dataset.png" alt-text="Screenshot of dataset component on the canvas.":::

## Clean the data

To clean the data, drop columns that aren't relevant for the model. Follow the steps below:

1. Select the **Components** subtab in the left pane.

1. Drag the **Select Columns in Dataset** component under **Data Transformation < Manipulation** into the canvas. Connect this component to the **Dataset** component.

    :::image type="content" source="./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/select-columns-zoomed-in.png" alt-text="Screenshot of column selection component on the canvas." lightbox="./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/select-columns-zoomed-out.png":::

1. Click on the component to open properties pane. Click on Edit column to specify which columns you wish to drop.

1. Exclude two columns: CustomerAlternateKey and GeographyKey. Click **Save**

    :::image type="content" source="./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/drop-columns.png" alt-text="Screenshot showing columns that are dropped.":::

## Build the model

The data is split 80-20: 80% to train a machine learning model and 20% to test the model. "Two-Class" algorithms are used in this binary classification problem.

1. Drag the **Split Data** component into the canvas.

1. In the properties pane, enter 0.8 for **Fraction of rows in the first output dataset**.

    :::image type="content" source="./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/split-data.png" alt-text="Screenshot showing the split ratio of 0.8.":::

1. Drag the **Two-Class Boosted Decision Tree** component into the canvas.

1. Drag the **Train Model** component into the canvas. Specify inputs by connecting it to the **Two-Class Boosted Decision Tree** (ML algorithm) and **Split Data** (data to train the algorithm on) components.

1. For Train Model model,  in **Label column** option in the Properties pane, select Edit column. Select the **BikeBuyer** column as the column to predict and select **Save**.

    :::image type="content" source="./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/label-column.png" alt-text="Screenshot showing  label column, BikeBuyer, selected.":::

    :::image type="content" source="./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/train-model.png" alt-text="Screenshot showing Train Model component connected to Two-Class Boosted Decision Tree and Split Data components.":::

## Score the model

Now, test how does the model perform on test data. Two different algorithms will be compared to see which one performs better. Follow the steps below:

1. Drag **Score Model** component into the canvas and connect it to **Train Model** and **Split Data** components.

1. Drag the **Two-Class Bayes Averaged Perceptron** into the experiment canvas. You'll compare how this algorithm performs in comparison to the Two-Class Boosted Decision Tree.

1. Copy and paste the components **Train Model** and **Score Model** in the canvas.

1. Drag the **Evaluate Model** component into the canvas to compare the two algorithms.

1. Click **submit** to set up the pipeline run.

    :::image type="content" source="./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/algo-comparison-zoomed-in.png" alt-text="Screenshot of all the remaining components on the canvas." lightbox="./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/algo-comparison-zoomed-out.png":::

1. Once the run finishes, right-click on the **Evaluate Model** component and click **Visualize Evaluation results**.

    :::image type="content" source="./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/result-visualize-zoomed-out.png" alt-text="Screenshot of the results.":::

The metrics provided are the ROC curve, precision-recall diagram, and lift curve. Look at these metrics to see that the first model performed better than the second one. To look at what the first model predicted, right-click on the Score Model component and click Visualize Scored dataset to see the predicted results.

You'll see two more columns added to your test dataset.

* Scored Probabilities: the likelihood that a customer is a bike buyer.
* Scored Labels: the classification done by the model – bike buyer (1) or not (0). This probability threshold for labeling is set to 50% and can be adjusted.

Compare the column BikeBuyer (actual) with the Scored Labels (prediction), to see how well the model has performed. Next, you can use this model to make predictions for new customers. You can [publish this model as a web service](../../machine-learning/v1/tutorial-designer-automobile-price-deploy.md) or write results back to Azure Synapse.

## Next steps

To learn more about Azure Machine Learning, refer to [Introduction to Machine Learning on Azure](../../machine-learning/overview-what-is-azure-machine-learning.md).

Learn about built-in scoring in the data warehouse, [here](/sql/t-sql/queries/predict-transact-sql?view=azure-sqldw-latest&preserve-view=true).

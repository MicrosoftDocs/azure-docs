---
title: Analyze data with Azure Machine Learning 
description: Use Azure Machine Learning to build a predictive machine learning model based on data stored in Azure Synapse.
services: synapse-analytics
author: mlee3gsd 
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: machine-learning 
ms.date: 02/05/2020
ms.author: martinle
ms.reviewer: igorstan
ms.custom: seo-lt-2019
tag: azure-Synapse
---

# Analyze data with Azure Machine Learning

This tutorial uses Azure Machine Learning to build a predictive machine learning model based on data stored in Azure Synapse. Specifically, this builds a targeted marketing campaign for Adventure Works, the bike shop, by predicting if a customer is likely to buy a bike or not.

## Prerequisites

To step through this tutorial, you need:

* A SQL pool pre-loaded with AdventureWorksDW sample data. To provision this, see [Create a SQL pool](create-data-warehouse-portal.md) and choose to load the sample data. If you already have a data warehouse but do not have sample data, you can [load sample data manually](load-data-from-azure-blob-storage-using-polybase.md).

## 1. Get the data

The data is in the dbo.vTargetMail view in AdventureWorksDW. To use Datastore in this tutorial, the data is first loaded into Azure Data Lake Storage account. Azure Data Factory can be used to export data from the data warehouse to Azure Data Lake Storage using the copy activity. Use the following query for import:

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

Once the data is available in Azure Data Lake Storage, Datastores in Azure Machine Learning is used to build the predictive pipeline. Follow the steps below to create a Datastore and Dataset:

1. Sign into [Azure Machine Learning studio](https://ml.azure.com/).

1. Click on **Datastores** on the left pane and click on New Datastore. 

1. Provide a name for the datastore, select the type as 'Azure Blob Storage', provide location and credentials. Click **Create**.

1. Next, click on **Datasets** on the left pane. Select on **Create dataset** and select the option **From datastore**.

1. Specify the name of the dataset and select the type to be **Tabular**. Click Next.

1. In Select or create a datastore section, select the option Previously created datastore and select the datastore created earlier.Click Next and specify the path and file settings. Make sure to specify column header if the files contain one. Click Create to create the dataset.

## Configure designer experiment

Next, follow steps below for designer configuration:

1. Click on Designer tab on the left pane.

1. Select Easy-to-use prebuilt modules.

1. Specify the name of the pipeline.

1. Select a target cluster for the whole experiment in settings button to a previously provisioned cluster.

## Import the data

1.	Click on Designer on the left pane.
2.	Select the **Datasets** subtab in the left pane below the search box.
3.	Drag your Dataset into the canvas.

    ![Project Columns](./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/importdataset.png)

## Clean the data
To clean the data, drop some columns that are not relevant for the model. To do this:

1. Select the **Modules** subtab in the left pane.
2. Drag the **Select Columns in Dataset** module under **Data Transformation < Manipulation** into the canvas. Connect this module to the **Dataset** module.
3. Click on the module to open properties pane. Click on Edit column to specify which columns you wish to drop.

    ![Project Columns](./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/selectcolumns.png)

1. Exclude two columns: CustomerAlternateKey and GeographyKey.

   ![Remove unnecessary columns](./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/dropcolumns.png)

## Build the model

We will split the data 80-20: 80% to train a machine learning model and 20% to test the model. We will make use of the "Two-Class" algorithms for this binary classification problem.

1. Drag the **Split Data** module into the canvas.
2. In the properties pane, enter 0.8 for Fraction of rows in the first output dataset.

   ![Split data into training and test set](./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/splitdata.png)

3. Drag the **Two-Class Boosted Decision Tree** module into the canvas.
4. Drag the **Train Model** module into the canvas and specify inputs by connecting it to the **Two-Class Boosted Decision Tree** (ML algorithm) and **Split Data** (data to train the algorithm on) modules. 

     ![Connect the Train Model module](./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/trainmodel.png)

5. Then, in **Label column** option in the Properties pane, select Edit column. Select the **BikeBuyer** column as the column to predict and select Save.

   ![Select Column to predict](./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/labelcolumn.png)

## Score the model

Now, we will test how the model performs on test data. We will compare the algorithm of our choice with a different algorithm to see which performs better.

1. Drag **Score Model** module into the canvas and connect it to **Train Model** and **Split Data** modules.

2. Drag the **Two-Class Bayes AveragedPerceptron** into the experiment canvas. We will compare how this algorithm performs in comparison to the Two-Class Boosted Decision Tree.
3. Copy and Paste the modules **Train Model** and **Score Model** in the canvas.
4. Drag the **Evaluate Model** module into the canvas to compare the two algorithms.
5. **Run** the experiment.

   ![Run the experiment](./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/algocomparison.png)
6. Right click one the **Evaluate Model** module and click **Visualize Evaluation results**.

   ![Visualize evaluation results](./media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/resultvisualize.png)

The metrics provided are the ROC curve, precision-recall diagram, and lift curve. Looking at these metrics, we can see that the first model performed better than the second one. To look at what the first model predicted, right click on the Score Model module and click and click Visualize Scored dataset to see the predicted results.

You will see two more columns added to your test dataset.

* Scored Probabilities: the likelihood that a customer is a bike buyer.
* Scored Labels: the classification done by the model – bike buyer (1) or not (0). This probability threshold for labeling is set to 50% and can be adjusted.

Comparing the column BikeBuyer (actual) with the Scored Labels (prediction), you can see how well the model has performed. Next, you can use this model to make predictions for new customers and [publish this model as a web service](https://docs.microsoft.com/azure/machine-learning/tutorial-designer-automobile-price-deploy) or write results back to Azure Synapse.

## Next steps
To learn more about building predictive machine learning models, refer to [Introduction to Machine Learning on Azure](https://docs.microsoft.com/azure/machine-learning/overview-what-is-azure-ml).
---
title: Analyze data with Azure Machine Learning | Microsoft Docs
description: Use Azure Machine Learning to build a predictive machine learning model based on data stored in Azure SQL Data Warehouse.
services: sql-data-warehouse
author: mlee3gsd 
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: integration
ms.date: 03/22/2019
ms.author: martinle
ms.reviewer: igorstan
---

# Analyze data with Azure Machine Learning
> [!div class="op_single_selector"]
> * [Power BI](sql-data-warehouse-get-started-visualize-with-power-bi.md)
> * [Azure Machine Learning](sql-data-warehouse-get-started-analyze-with-azure-machine-learning.md)
> * [Visual Studio](sql-data-warehouse-query-visual-studio.md)
> * [sqlcmd](sql-data-warehouse-get-started-connect-sqlcmd.md) 
> * [SSMS](sql-data-warehouse-query-ssms.md)
> 
> 

This tutorial uses Azure Machine Learning to build a predictive machine learning model based on data stored in Azure SQL Data Warehouse. Specifically, this builds a targeted marketing campaign for Adventure Works, the bike shop, by predicting if a customer is likely to buy a bike or not.

> [!VIDEO https://channel9.msdn.com/Blogs/Azure/Integrating-Azure-Machine-Learning-with-Azure-SQL-Data-Warehouse/player]
> 
> 

## Prerequisites
To step through this tutorial, you need:

* A SQL Data Warehouse pre-loaded with AdventureWorksDW sample data. To provision this, see [Create a SQL Data Warehouse][Create a SQL Data Warehouse] and choose to load the sample data. If you already have a data warehouse but do not have sample data, you can [load sample data manually][load sample data manually].

## 1. Get the data
The data is in the dbo.vTargetMail view in the AdventureWorksDW database. To read this data:

1. Sign into [Azure Machine Learning studio][Azure Machine Learning studio] and click on my experiments.
2. Click **+NEW** on the bottom left of the screen and select **Blank Experiment**.
3. Enter a name for your experiment: Targeted Marketing.
4. Drag the **Import data** module under **Data Input and output** from the modules pane into the canvas.
5. Specify the details of your SQL Data Warehouse database in the Properties pane.
6. Specify the database **query** to read the data of interest.

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

Run the experiment by clicking **Run** under the experiment canvas.
![Run the experiment][1]

After the experiment finishes running successfully, click the output port at the bottom of the Reader module and select **Visualize** to see the imported data.
![View imported data][3]

## 2. Clean the data
To clean the data, drop some columns that are not relevant for the model. To do this:

1. Drag the **Select Columns in Dataset** module under **Data Transformation < Manipulation** into the canvas. Connect this module to the **Import Data** module.
2. Click **Launch column selector** in the Properties pane to specify which columns you wish to drop.
   ![Project Columns][4]
3. Exclude two columns: CustomerAlternateKey and GeographyKey.
   ![Remove unnecessary columns][5]

## 3. Build the model
We will split the data 80-20: 80% to train a machine learning model and 20% to test the model. We will make use of the “Two-Class” algorithms for this binary classification problem.

1. Drag the **Split** module into the canvas.
2. In the properties pane, enter 0.8 for Fraction of rows in the first output dataset.
   ![Split data into training and test set][6]
3. Drag the **Two-Class Boosted Decision Tree** module into the canvas.
4. Drag the **Train Model** module into the canvas and specify inputs by connecting it to the **Two-Class Boosted Decision Tree** (ML algorithm) and **Split** (data to train the algorithm on) modules. 
     ![Connect the Train Model module][7]
5. Then, click **Launch column selector** in the Properties pane. Select the **BikeBuyer** column as the column to predict.
   ![Select Column to predict][8]

## 4. Score the model
Now, we will test how the model performs on test data. We will compare the algorithm of our choice with a different algorithm to see which performs better.

1. Drag **Score Model** module into the canvas and connect it to **Train Model** and **Split Data** modules.
   ![Score the model][9]
2. Drag the **Two-Class Bayes Point Machine** into the experiment canvas. We will compare how this algorithm performs in comparison to the Two-Class Boosted Decision Tree.
3. Copy and Paste the modules Train Model and Score Model in the canvas.
4. Drag the **Evaluate Model** module into the canvas to compare the two algorithms.
5. **Run** the experiment.
   ![Run the experiment][10]
6. Click the output port at the bottom of the Evaluate Model module and click Visualize.
   ![Visualize evaluation results][11]

The metrics provided are the ROC curve, precision-recall diagram and lift curve. Looking at these metrics, we can see that the first model performed better than the second one. To look at the what the first model predicted, click on output port of the Score Model and click Visualize.
![Visualize score results][12]

You will see two more columns added to your test dataset.

* Scored Probabilities: the likelihood that a customer is a bike buyer.
* Scored Labels: the classification done by the model – bike buyer (1) or not (0). This probability threshold for labeling is set to 50% and can be adjusted.

Comparing the column BikeBuyer (actual) with the Scored Labels (prediction), you can see how well the model has performed. As next steps, you can use this model to make predictions for new customers and publish this model as a web service or write results back to SQL Data Warehouse.

## Next steps
To learn more about building predictive machine learning models, refer to [Introduction to Machine Learning on Azure][Introduction to Machine Learning on Azure].

<!--Image references-->
[1]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img1-reader-new.png
[2]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img2-visualize-new.png
[3]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img3-readerdata-new.png
[4]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img4-projectcolumns-new.png
[5]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img5-columnselector-new.png
[6]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img6-split-new.png
[7]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img7-train-new.png
[8]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img8-traincolumnselector-new.png
[9]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img9-score-new.png
[10]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img10-evaluate-new.png
[11]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img11-evalresults-new.png
[12]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img12-scoreresults-new.png


<!--Article references-->
[Azure Machine Learning studio]:https://studio.azureml.net/
[Introduction to Machine Learning on Azure]:https://azure.microsoft.com/documentation/articles/machine-learning-what-is-machine-learning/
[load sample data manually]: sql-data-warehouse-load-sample-databases.md
[Create a SQL Data Warehouse]: sql-data-warehouse-get-started-provision.md

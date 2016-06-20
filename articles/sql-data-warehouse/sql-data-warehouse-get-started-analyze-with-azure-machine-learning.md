<properties
   pageTitle="Analyze data with Azure Machine Learning | Microsoft Azure"
   description="Use Azure Machine Learning to build a predictive machine learning model based on data stored in Azure SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="shivaniguptamsft"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/16/2016"
   ms.author="shigu;barbkess;sonyama"/>

# Analyze data with Azure Machine Learning

> [AZURE.SELECTOR]
- [Power BI](sql-data-warehouse-get-started-visualize-with-power-bi.md)
- [Azure Machine Learning](sql-data-warehouse-get-started-analyze-with-azure-machine-learning.md)
- [Visual Studio](sql-data-warehouse-query-visual-studio.md)
- [sqlcmd](sql-data-warehouse-get-started-connect-sqlcmd.md) 

This tutorial uses Azure Machine Learning to build a predictive machine learning model based on data stored in Azure SQL Data Warehouse. Specifically, this builds a targeted marketing campaign for Adventure Works, the bike shop, by predicting if a customer is likely to buy a bike or not.

> [AZURE.VIDEO integrating-azure-machine-learning-with-azure-sql-data-warehouse]


## Prerequisites
To step through this tutorial, you need:

- A SQL Data Warehouse pre-loaded with AdventureWorksDW sample data. To provision this, see [Create a SQL Data Warehouse][] and choose to load the sample data. If you already have a data warehouse but do not have sample data, you can [load sample data manually][].

## 1. Get data
The data is in the dbo.vTargetMail view in the AdventureWorksDW database. To read this data:

1. Sign into [Azure Machine Learning studio][] and click on my experiments.
2. Click **+NEW** and select **Blank Experiment**.
3. Enter a name for your experiment: Targeted Marketing.
4. Drag the **Reader** module from the modules pane into the canvas.
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

1. Drag the **Project Columns** module into the canvas.
2. Click **Launch column selector** in the Properties pane to specify which columns you wish to drop.
![Project Columns][4]

3. Exclude two columns: CustomerAlternateKey and GeographyKey.
![Remove unnecessary columns][5]


## 3. Build the model
We will split the data 80-20: 80% to train a machine learning model and 20% to test the model. We will make use of the “Two-Class” algorithms for this binary classification problem.

1. Drag the **Split** module into the canvas.
2. Enter 0.8 for Fraction of rows in the first output dataset in the Properties pane.
![Split data into training and test set][6]
3. Drag the **Two-Class Boosted Decision Tree** module into the canvas.
4. Drag the **Train Model** module into the canvas and specify the inputs. Then, click **Launch column selector** in the Properties pane.
      - First input: ML algorithm.
      - Second input: Data to train the algorithm on.
![Connect the Train Model module][7]
5. Select the **BikeBuyer** column as the column to predict.
![Select Column to predict][8]


## 4. Score the model
Now, we will test how the model performs on test data. We will compare the algorithm of our choice with a different algorithm to see which performs better.

1. Drag **Score Model** module into the canvas.
    First input: Trained model
    Second input: Test data
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

- Scored Probabilities: the likelihood that a customer is a bike buyer.
- Scored Labels: the classification done by the model – bike buyer (1) or not (0). This probability threshold for labeling is set to 50% and can be adjusted.

Comparing the column BikeBuyer (actual) with the Scored Labels (prediction), you can see how well the model has performed. As next steps, you can use this model to make predictions for new customers and publish this model as a web service or write results back to SQL Data Warehouse.

## Next steps

To learn more about building predictive machine learning models, refer to [Introduction to Machine Learning on Azure][].

<!--Image references-->
[1]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img1_reader.png
[2]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img2_visualize.png
[3]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img3_readerdata.png
[4]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img4_projectcolumns.png
[5]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img5_columnselector.png
[6]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img6_split.png
[7]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img7_train.png
[8]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img8_traincolumnselector.png
[9]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img9_score.png
[10]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img10_evaluate.png
[11]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img11_evalresults.png
[12]: media/sql-data-warehouse-get-started-analyze-with-azure-machine-learning/img12_scoreresults.png


<!--Article references-->
[Azure Machine Learning studio]:https://studio.azureml.net/
[Introduction to Machine Learning on Azure]:https://azure.microsoft.com/documentation/articles/machine-learning-what-is-machine-learning/
[load sample data manually]: sql-data-warehouse-get-started-load-sample-databases.md
[Create a SQL Data Warehouse]: sql-data-warehouse-get-started-provision.md

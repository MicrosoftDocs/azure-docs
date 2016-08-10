<properties
   pageTitle="Use Azure Machine Learning with SQL Data Warehouse | Microsoft Azure"
   description="Tutorial for using Azure Machine Learning with Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="kevinvngo"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="08/08/2016"
   ms.author="kevin;barbkess;sonyama"/>

# Use Azure Machine Learning with SQL Data Warehouse

Azure Machine Learning is a fully managed predictive analytics service that you can use to create predictive models against your data in SQL Data Warehouse, and then publish as ready-to-consume web services. You can learn the basics of predictive analytics and machine learning by reading [Introduction to Machine Learning on Azure][].  You can then learn how to create, train, score and test a machine learning model using the [Create experiment tutorial][].

In this article, you will learn how to do the following using the [Azure Machine Learning Studio][]:

- Read data from your database to create, train and score a predictive model
- Write data to your database


## Read data from SQL Data Warehouse

We will read data from Product table in the AdventureWorksDW database.

### Step 1

Start a new experiment by clicking +NEW at the bottom of the Machine Learning Studio window, select EXPERIMENT, and then select Blank Experiment. Select the default experiment name at the top of the canvas and rename it to something meaningful, for example, Bicycle price prediction.

### Step 2

Look for the Reader module in the palette of datasets and modules on the left of the experiment canvas. Drag the module to the experiment canvas.
![][drag_reader]

### Step 3

Select the Reader module and fill out the properties pane.

1. Select Azure SQL Database as the Data Source.
2. Database server name: Type the server name. You can use the [Azure portal][] to find this.

![][server_name]

3. Database name: Type the name of a database on the server you just specified.
4. Server user account name:  Type the user name of an account that has access permissions for the database.
5. Server user account password: Provide the password for the specified user account.
6. Accept any server certificate: Use this option (less secure) if you want to skip reviewing the site certificate before you read your data.
7. Database query: Enter a SQL statement that describes the data you want to read. In this case, we will read data from Product table using the following query.


```SQL
SELECT ProductKey, EnglishProductName, StandardCost,
        ListPrice, Size, Weight, DaysToManufacture,
        Class, Style, Color
FROM dbo.DimProduct;
```

![][reader_properties]

### Step 4

1. Run the experiment by clicking Run under the experiment canvas.
2. When the experiment finishes, the Reader module will have a green check mark to indicate that it has completed successfully. Notice also the Finished running status in the upper-right corner.

![][run]

3. To see the imported data, click the output port at the bottom of the automobile dataset and select Visualize.


## Create, train and score a model

Now you can use this dataset to:

- Create a Model: Process data and define features
- Train the model: Choose and apply a learning algorithm
- Score and test the model: Predict new bicycle price


![][model]

To learn more about how to create, train, score and test a machine learning model use the [Create experiment tutorial][].

## Write data to Azure SQL Data Warehouse

We will write the result set to ProductPriceForecast table in the AdventureWorksDW database.

### Step 1

Look for the Writer module in the palette of datasets and modules on the left of the experiment canvas. Drag the module to the experiment canvas.

![][drag_writer]

### Step 2

Select the Writer module and fill out the properties pane.

1. Select Azure SQL Database as the Data Destination.
2. Database server name: Type the server name. You can use the [Azure portal][] to find this.
3. Database name: Type the name of a database on the server you just specified.
4. Server user account name:  Type the user name of an account that has write permissions for the database.
5. Server user account password: Provide the password for the specified user account.
6. Accept any server certificate (insecure): Select this option if you don’t want to view the certificate.
7. Comma-separated list of columns to be saved: Provide a list of the dataset or result columns that you want to output.
8. Data table name: Specify the name of the data table.
9. Comma-separated list of datatable columns:  Specify the column names to use in the new table. The column names can be different from the ones in the source dataset, but you must list the same number of columns here that you define for the output table.
10. Number of rows written per SQL Azure operation: You can configure the number of rows that are written to a SQL database in one operation.

![][writer_properties]

### Step 3

1. Run the experiment by clicking Run under the experiment canvas.
2. When the experiment finishes, all modules will have a green check mark to indicate that they completed successfully.

## Next steps

For an overview of integration, see [SQL Data Warehouse integration overview][].

For more development tips, see [SQL Data Warehouse development overview][].

<!--Image references-->

[drag_reader]: ./media/sql-data-warehouse-integrate-azure-machine-learning/ml-drag-reader.png
[server_name]: ./media/sql-data-warehouse-integrate-azure-machine-learning/dw-server-name.png
[reader_properties]: ./media/sql-data-warehouse-integrate-azure-machine-learning/ml-reader-properties.png
[run]: ./media/sql-data-warehouse-integrate-azure-machine-learning/ml-finished-running.png
[model]: ./media/sql-data-warehouse-integrate-azure-machine-learning/ml-create-train-score-model.png
[drag_writer]: ./media/sql-data-warehouse-integrate-azure-machine-learning/ml-drag-writer.png
[writer_properties]: ./media/sql-data-warehouse-integrate-azure-machine-learning/ml-writer-properties.png

<!--Article references-->

[SQL Data Warehouse development overview]: ./sql-data-warehouse-overview-develop.md
[SQL Data Warehouse integration overview]: ./sql-data-warehouse-overview-integration.md
[Create experiment tutorial]: https://azure.microsoft.com/documentation/articles/machine-learning-create-experiment/
[Introduction to machine learning on Azure]: https://azure.microsoft.com/documentation/articles/machine-learning-what-is-machine-learning/
[Azure Machine Learning Studio]: https://studio.azureml.net/Home
[Azure portal]: https://portal.azure.com/

<!--MSDN references-->

<!--Other Web references-->

[Azure Machine Learning documentation]: http://azure.microsoft.com/documentation/services/machine-learning/

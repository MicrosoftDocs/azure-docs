---
title: Step 3 - Deploy a predictive model in R
titleSuffix: Azure SQL Database Machine Learning Services (preview)
description: Step 3 - Deploy a machine learning model in R to predict ski rentals with Azure SQL Database Machine Learning Services (preview).
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning
ms.custom:
ms.devlang: r
ms.topic: tutorial
author: garyericson
ms.author: garye
ms.reviewer: davidph
manager: cgronlun
ms.date: 05/02/2019
---

# Step 3 - Deploy a predictive model in R with Azure SQL Database Machine Learning Services (preview)

In this tutorial, you're learning how to choose and train a predictive model in R, and then deploy it with Azure SQL Database Machine Learning Services (preview).
Assume you own a ski rental business and you want to predict the number of rentals that you'll have on a future date. This information will help you get your stock, staff, and facilities ready.

In step 3 of this tutorial, you'll learn how to deploy the model you created in [step 2](sql-database-tutorial-build-deploy-model-2.md).

Predictive modeling is a powerful way to add intelligence to your application. It enables applications to predict outcomes against new data. The act of incorporating predictive analytics into your applications involves three major phases: **data preparation**, **model training**, and **model deployment**.

[!INCLUDE[ml-preview-note](../../includes/sql-database-ml-preview-note.md)]

## Prerequisites

- Step 3 of this tutorial assumes you have completed [step 1](sql-database-tutorial-build-deploy-model-1.md) and [step 2](sql-database-tutorial-build-deploy-model-2.md).

## Deploy the model

Azure SQL Database Machine Learning Services enables you to train and test predictive models in the context of an Azure SQL database. You author a T-SQL program that contains an embedded R script, and the database engine takes care of the execution. Because it executes in the SQL database, your models can easily be trained against data stored in the database.

To deploy the model, you store it in the database and create a stored procedure that makes predictions using the model.

Run the following commands in Azure Data Studio or SSMS.

1. Create a table for storing the model.

    ```sql
    USE TutorialDB;
    DROP TABLE IF EXISTS rental_rx_models;
    GO
    CREATE TABLE rental_rx_models (
          model_name VARCHAR(30) NOT NULL DEFAULT('default model') PRIMARY KEY
        , model VARBINARY(MAX) NOT NULL
        );
    GO
    ```

1. Create the stored procedure that generates the model. In [step 2](sql-database-tutorial-build-deploy-model-2.md#compare-the-results) of this tutorial, you decided that a decision tree (dtree) model was the most accurate.

    ```sql
    -- Stored procedure that trains and generates an R model using the rental_data and a decision tree algorithm
    DROP PROCEDURE IF EXISTS generate_rental_rx_model;
    go
    CREATE PROCEDURE generate_rental_rx_model (@trained_model VARBINARY(max) OUTPUT)
    AS
    BEGIN
        EXECUTE sp_execute_external_script @language = N'R'
            , @script = N'
    require("RevoScaleR");
    
    rental_train_data$Holiday <- factor(rental_train_data$Holiday);
    rental_train_data$Snow    <- factor(rental_train_data$Snow);
    rental_train_data$WeekDay <- factor(rental_train_data$WeekDay);
    
    #Create a dtree model and train it using the training data set
    model_dtree <- rxDTree(RentalCount ~ Month + Day + WeekDay + Snow + Holiday, data = rental_train_data);
    #Serialize the model before saving it to the database table
    trained_model <- as.raw(serialize(model_dtree, connection=NULL));
    '
            , @input_data_1 = N'
                SELECT RentalCount
                     , Year
                     , Month
                     , Day
                     , WeekDay
                     , Snow
                     , Holiday
                FROM dbo.rental_data
                WHERE Year < 2015
                '
            , @input_data_1_name = N'rental_train_data'
            , @params = N'@trained_model varbinary(max) OUTPUT'
            , @trained_model = @trained_model OUTPUT;
    END;
    GO
    ```

1. Save the model to a table as a binary object.

    ```sql
    -- Save model to table
    TRUNCATE TABLE rental_rx_models;
    
    DECLARE @model VARBINARY(MAX);
    
    EXEC generate_rental_rx_model @model OUTPUT;
    
    INSERT INTO rental_rx_models (
          model_name
        , model
        )
    VALUES (
         'rxDTree'
        , @model
        );
    
    SELECT *
    FROM rental_rx_models;
    ```

1. Create a stored procedure (`predict_rentalcount_new`) that makes predictions using the model.

    ```sql
    -- Stored procedure that takes model name and new data as input parameters and predicts the rental count for the new data
    DROP PROCEDURE IF EXISTS predict_rentalcount_new;
    GO
    CREATE PROCEDURE predict_rentalcount_new (
          @model_name VARCHAR(100)
        , @input_query NVARCHAR(MAX)
        )
    AS
    BEGIN
        DECLARE @rx_model VARBINARY(MAX) = (
                SELECT model
                FROM rental_rx_models
                WHERE model_name = @model_name
                );
    
        EXECUTE sp_execute_external_script @language = N'R'
            , @script = N'
    require("RevoScaleR");
    
    #Convert types to factors
    rentals$Holiday <- factor(rentals$Holiday);
    rentals$Snow    <- factor(rentals$Snow);
    rentals$WeekDay <- factor(rentals$WeekDay);
    
    #Before using the model to predict, we need to unserialize it
    rental_model <- unserialize(rx_model);
    
    #Call prediction function
    rental_predictions <- rxPredict(rental_model, rentals);
    '
            , @input_data_1 = @input_query
            , @input_data_1_name = N'rentals'
            , @output_data_1_name = N'rental_predictions'
            , @params = N'@rx_model varbinary(max)'
            , @rx_model = @rx_model
        WITH RESULT SETS(("RentalCount_Predicted" FLOAT));
    END;
    GO
    ```

## Execute the model with new data

Now you can use the stored procedure `predict_rentalcount_new` to predict the rental count from new data.

```sql
-- Execute the predict_rentalcount_new stored procedure and pass the model name and a query string with a set of features to use to predict the rental count
EXECUTE dbo.predict_rentalcount_new @model_name = 'rxDTree'
    , @input_query = '
        SELECT CONVERT(INT,  3) AS Month
             , CONVERT(INT, 24) AS Day
             , CONVERT(INT,  4) AS WeekDay
             , CONVERT(INT,  1) AS Snow
             , CONVERT(INT,  1) AS Holiday
        ';
GO
```

You should see a result similar to the following.

```results
RentalCount_Predicted
332.571428571429
```

You have successfully created, trained, and deployed a model in an Azure SQL database. You then used that model in a stored procedure to predict values based on new data.

## Next Steps

To learn more about using R in Azure SQL Database Machine Learning Services (preview), see:

- [Write advanced R functions in Azure SQL Database using Machine Learning Services (preview)](sql-database-machine-learning-services-functions.md)
- [Work with R and SQL data in Azure SQL Database Machine Learning Services (preview)](sql-database-machine-learning-services-data-issues.md)
- [Add an R package to Azure SQL Database Machine Learning Services (preview)](sql-database-machine-learning-services-add-r-packages.md)

<!-- Maybe replace the above with this when the second tutorial gets ported from SQL MLS

To build a clustering model in Azure SQL Database Machine Learning Services (preview), try the tutorial [foo](foo.md).

-->
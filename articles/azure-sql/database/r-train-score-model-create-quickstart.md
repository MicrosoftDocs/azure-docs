---
title: Create and train a predictive model in R
titleSuffix: Azure SQL Database Machine Learning Services (preview)
description: Create a simple predictive model in R using Azure SQL Database Machine Learning Services (preview), then predict a result using new data.
services: sql-database
ms.service: sql-database
ms.subservice: machine-learning
ms.custom:
ms.devlang: r
ms.topic: quickstart
author: garyericson
ms.author: garye
ms.reviewer: davidph
manager: cgronlun
ms.date: 04/11/2019
ROBOTS: NOINDEX
---

# Quickstart: Create and train a predictive model in R with Azure SQL Database Machine Learning Services (preview)
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

In this quickstart, you create and train a predictive model using R, save the model to a table in your database, then use the model to predict values from new data using Machine Learning Services (with R) in Azure SQL Database.

[!INCLUDE[ml-preview-note](../../../includes/sql-database-ml-preview-note.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- A [database in Azure SQL Database](single-database-create-quickstart.md) with a [server-level firewall rule](firewall-create-server-level-portal-quickstart.md)
- [Machine Learning Services](machine-learning-services-overview.md) with R enabled.
- [SQL Server Management Studio](/sql/ssms/sql-server-management-studio-ssms) (SSMS)

This example uses a simple regression model to predict the stopping distance of a car based on speed using the **cars** dataset included with R.

> [!TIP]
> Many datasets are included with the R runtime, to get a list of installed datasets, type `library(help="datasets")` from the R command prompt.

## Create and train a predictive model

The car speed data in the **cars** dataset contains two columns, both numeric: **dist** and **speed**. The data includes multiple stopping observations at different speeds. From this data, you'll create a linear regression model that describes the relationship between car speed and the distance required to stop a car.

The requirements of a linear model are simple:
- Define a formula that describes the relationship between the dependent variable *speed* and the independent variable *distance*.
- Provide input data to use in training the model.

> [!TIP]
> If you need a refresher on linear models, try this tutorial which describes the process of fitting a model using rxLinMod: [Fitting Linear Models](https://docs.microsoft.com/machine-learning-server/r/how-to-revoscaler-linear-model)

In the following steps you'll set up the training data, create a regression model, train it using the training data, then save the model to an SQL table.

1. Open **SQL Server Management Studio** and connect to your database.

   If you need help connecting, see [Quickstart: Use SQL Server Management Studio to connect and query a database in Azure SQL Database](connect-query-ssms.md).

1. Create the **CarSpeed** table to save the training data.

    ```sql
    CREATE TABLE dbo.CarSpeed (
        speed INT NOT NULL
        , distance INT NOT NULL
        )
    GO
    
    INSERT INTO dbo.CarSpeed (
        speed
        , distance
        )
    EXECUTE sp_execute_external_script @language = N'R'
        , @script = N'car_speed <- cars;'
        , @input_data_1 = N''
        , @output_data_1_name = N'car_speed'
    GO
    ```

1. Create a regression model using `rxLinMod`. 

   To build the model you define the formula inside the R code and then pass the training data **CarSpeed** as an input parameter.

    ```sql
    DROP PROCEDURE IF EXISTS generate_linear_model;
    GO
    CREATE PROCEDURE generate_linear_model
    AS
    BEGIN
      EXECUTE sp_execute_external_script
      @language = N'R'
      , @script = N'
    lrmodel <- rxLinMod(formula = distance ~ speed, data = CarsData);
    trained_model <- data.frame(payload = as.raw(serialize(lrmodel, connection=NULL)));
    '
      , @input_data_1 = N'SELECT [speed], [distance] FROM CarSpeed'
      , @input_data_1_name = N'CarsData'
      , @output_data_1_name = N'trained_model'
      WITH RESULT SETS ((model VARBINARY(max)));
    END;
    GO
    ```

     The first argument to rxLinMod is the *formula* parameter, which defines distance as dependent on speed. The input data is stored in the variable `CarsData`, which is populated by the SQL query.

1. Create a table where you store the model so you can use it later for prediction. 

   The output of an R package that creates a model is usually a **binary object**, so the table must have a column of **VARBINARY(max)** type.

    ```sql
    CREATE TABLE dbo.stopping_distance_models (
        model_name VARCHAR(30) NOT NULL DEFAULT('default model') PRIMARY KEY
        , model VARBINARY(max) NOT NULL
        );
    ```

1. Now call the stored procedure, generate the model, and save it to a table.

   ```sql
   INSERT INTO dbo.stopping_distance_models (model)
   EXECUTE generate_linear_model;
   ```

   Note that if you run this code a second time, you get this error:

   ```text
   Violation of PRIMARY KEY constraint...Cannot insert duplicate key in object bo.stopping_distance_models
   ```

   One option to avoid this error is to update the name for each new model. For example, you could change the name to something more descriptive, and include the model type, the day you created it, and so forth.

   ```sql
   UPDATE dbo.stopping_distance_models
   SET model_name = 'rxLinMod ' + FORMAT(GETDATE(), 'yyyy.MM.HH.mm', 'en-gb')
   WHERE model_name = 'default model'
   ```

## View the table of coefficients

Generally, the output of R from the stored procedure [sp_execute_external_script](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-execute-external-script-transact-sql) is limited to a single data frame. However, you can return outputs of other types, such as scalars, in addition to the data frame.

For example, suppose you want to train a model but immediately view the table of coefficients from the model. To do so, you create the table of coefficients as the main result set, and output the trained model in an SQL variable. You can immediately re-use the model by calling the variable, or you can save the model to a table as shown here.

```sql
DECLARE @model VARBINARY(max)
    , @modelname VARCHAR(30)

EXECUTE sp_execute_external_script @language = N'R'
    , @script = N'
speedmodel <- rxLinMod(distance ~ speed, CarsData)
modelbin <- serialize(speedmodel, NULL)
OutputDataSet <- data.frame(coefficients(speedmodel));
'
    , @input_data_1 = N'SELECT [speed], [distance] FROM CarSpeed'
    , @input_data_1_name = N'CarsData'
    , @params = N'@modelbin varbinary(max) OUTPUT'
    , @modelbin = @model OUTPUT
WITH RESULT SETS(([Coefficient] FLOAT NOT NULL));

-- Save the generated model
INSERT INTO dbo.stopping_distance_models (
    model_name
    , model
    )
VALUES (
    'latest model'
    , @model
    )
```

**Results**

![Trained model with additional output](./media/r-train-score-model-create-quickstart/r-train-model-with-additional-output.png)

## Score new data using the trained model

*Scoring* is a term used in data science to mean generating predictions, probabilities, or other values based on new data fed into a trained model. You'll use the model you created in the previous section to score predictions against new data.

Did you notice that the original training data stops at a speed of 25 miles per hour? That's because the original data was based on an experiment from 1920! You might wonder, how long would it take an automobile from the 1920s to stop if it could get going as fast as 60 mph or even 100 mph? To answer this question, you can provide some new speed values to your model.

1. Create a table with new speed data.

   ```sql
    CREATE TABLE dbo.NewCarSpeed (
        speed INT NOT NULL
        , distance INT NULL
        )
    GO
    
    INSERT dbo.NewCarSpeed (speed)
    VALUES (40)
        , (50)
        , (60)
        , (70)
        , (80)
        , (90)
        , (100)
   ```

2. Predict stopping distance from these new speed values.

   Because your model is based on the **rxLinMod** algorithm provided as part of the **RevoScaleR** package, you call the [rxPredict](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/rxpredict) function, rather than the generic R `predict` function.

   This example script:
   - Uses a SELECT statement to get a single model from the table
   - Passes it as an input parameter
   - Calls the `unserialize` function on the model
   - Applies the `rxPredict` function with appropriate arguments to the model
   - Provides the new input data

   > [!TIP]
   > For real-time scoring, see [Serialization functions](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/rxserializemodel) provided by RevoScaleR.

   ```sql
    DECLARE @speedmodel VARBINARY(max) = (
            SELECT model
            FROM dbo.stopping_distance_models
            WHERE model_name = 'latest model'
            );
    
    EXECUTE sp_execute_external_script @language = N'R'
        , @script = N'
    current_model <- unserialize(as.raw(speedmodel));
    new <- data.frame(NewCarData);
    predicted.distance <- rxPredict(current_model, new);
    str(predicted.distance);
    OutputDataSet <- cbind(new, ceiling(predicted.distance));
    '
        , @input_data_1 = N'SELECT speed FROM [dbo].[NewCarSpeed]'
        , @input_data_1_name = N'NewCarData'
        , @params = N'@speedmodel varbinary(max)'
        , @speedmodel = @speedmodel
    WITH RESULT SETS((
                new_speed INT
                , predicted_distance INT
                ));
   ```

   **Results**

   ![Result set for predicting stopping distance](./media/r-train-score-model-create-quickstart/r-predict-stopping-distance-resultset.png)

> [!NOTE]
> In this example script, the `str` function is added during the testing phase to check the schema of data being returned from R. You can remove the statement later.
>
> The column names used in the R script are not necessarily passed to the stored procedure output. Here the WITH RESULTS clause defines some new column names.

## Next steps

For more information on Azure SQL Database Machine Learning Services with R (preview), see the following articles.

- [Azure SQL Database Machine Learning Services with R (preview)](machine-learning-services-overview.md)
- [Create and run simple R scripts in Azure SQL Database Machine Learning Services (preview)](r-script-create-quickstart.md)
- [Write advanced R functions in Azure SQL Database using Machine Learning Services (preview)](machine-learning-services-functions.md)
- [Work with R and SQL data in Azure SQL Database Machine Learning Services (preview)](machine-learning-services-data-issues.md)

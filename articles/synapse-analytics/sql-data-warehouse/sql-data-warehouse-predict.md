---
title: Score machine learning models with PREDICT
description: Learn how to score machine learning models using the T-SQL PREDICT function in dedicated SQL pool.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sngun
ms.date: 07/21/2020
ms.service: synapse-analytics
ms.subservice: machine-learning
ms.topic: conceptual
ms.custom: azure-synapse
---

# Score machine learning models with PREDICT

Dedicated SQL pool provides you the capability to score machine learning models using the familiar T-SQL language. With T-SQL [PREDICT](/sql/t-sql/queries/predict-transact-sql?preserve-view=true&view=azure-sqldw-latest), you can bring your existing machine learning models trained with historical data and score them within the secure boundaries of your data warehouse. PREDICT function takes an [ONNX (Open Neural Network Exchange)](https://onnx.ai/) model and data as inputs. This feature eliminates the step of moving valuable data outside the data warehouse for scoring. It aims to empower data professionals to easily deploy machine learning models with the familiar T-SQL interface as well as collaborate seamlessly with data scientists working with the right framework for their task.

> [!NOTE]
> This functionality is currently not supported in serverless SQL pool.

The functionality requires that the model is trained outside of Synapse SQL. After building the model, load it into the data warehouse and score it with the T-SQL Predict syntax to get insights from the data.

![predictoverview](./media/sql-data-warehouse-predict/datawarehouse-overview.png)

## Training the Model

Dedicated SQL pool expects a pre-trained model. Keep the following factors in mind when training a machine learning model that is used for performing predictions in dedicated SQL pool.

- Dedicated SQL pool only supports ONNX format models. ONNX is an open-source model format that allows you to exchange models between various frameworks to enable interoperability. You can convert your existing models to ONNX format using frameworks that either support it natively or have converting packages available. For example, [sklearn-onnx](https://github.com/onnx/sklearn-onnx) package convert scikit-learn models to ONNX. [ONNX GitHub repository](https://github.com/onnx/tutorials#converting-to-onnx-format) provides a list of supported frameworks and examples.

   If you are using [Automated ML](../../machine-learning/concept-automated-ml.md) for training, make sure to set the *enable_onnx_compatible_models* parameter to TRUE to produce an ONNX format model. [Automated Machine Learning Notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-bank-marketing-all-features/auto-ml-classification-bank-marketing-all-features.ipynb) shows an example of how to use automated ML to create a machine learning model of ONNX format.

- The following data types are supported for the input data:
    - int, bigint, real, float
    - char, varchar, nvarchar

- The scoring data needs to be in the same format as the training data. Complex data types such as multi-dimensional arrays are not supported by PREDICT. So, for training make sure that each input of the model corresponds to a single column of the scoring table instead of passing a single array containing all inputs.

- Make sure that the names and data types of the model inputs match the column names and data types of the new prediction data. Visualizing an ONNX model using various open-source tools available online can further help with debugging.

## Loading the model

The model is stored in a dedicated SQL pool user table as a hexadecimal string. Additional columns such as ID and description may be added in the model table to identify the model. Use varbinary(max) as the data type of the model column. Here is a code example for a table that can be used for storing models:

```sql
-- Sample table schema for storing a model and related data
CREATE TABLE [dbo].[Models]
(
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Model] [varbinary](max) NULL,
    [Description] [varchar](200) NULL
)
WITH
(
    DISTRIBUTION = ROUND_ROBIN,
    HEAP
)
GO

```

Once the model is converted to a hexadecimal string and the table definition specified, use the [COPY command](/sql/t-sql/statements/copy-into-transact-sql?preserve-view=true&view=azure-sqldw-latest) or Polybase to load the model in the dedicated SQL pool table. The following code sample uses the Copy command to load the model.

```sql
-- Copy command to load hexadecimal string of the model from Azure Data Lake storage location
COPY INTO [Models] (Model)
FROM '<enter your storage location>'
WITH (
    FILE_TYPE = 'CSV',
    CREDENTIAL=(IDENTITY= 'Shared Access Signature', SECRET='<enter your storage key here>')
)
```

## Scoring the model

Once the model and data are loaded in the data warehouse, use the **T-SQL PREDICT** function to score the model. Make sure that the new input data is in the same format as the training data used for building the model. T-SQL PREDICT takes two inputs: model and new scoring input data, and generates new columns for the output.The model can be specified as a variable, a literal or a scalar sub_query. Use [WITH common_table_expression](/sql/t-sql/queries/with-common-table-expression-transact-sql?preserve-view=true&view=azure-sqldw-latest) to specify a named result set for the data parameter.

The example below shows a sample query using prediction function. An additional column with name *Score* and data type *float* is created containing the prediction results. All the input data columns as well as output prediction columns are available to display with the select statement. For more details, see [PREDICT (Transact-SQL)](/sql/t-sql/queries/predict-transact-sql?preserve-view=true&view=azure-sqldw-latest).

```sql
-- Query for ML predictions
SELECT d.*, p.Score
FROM PREDICT(MODEL = (SELECT Model FROM Models WHERE Id = 1),
DATA = dbo.mytable AS d, RUNTIME = ONNX) WITH (Score float) AS p;
```

## Next steps

To learn more about the PREDICT function, see [PREDICT (Transact-SQL)](/sql/t-sql/queries/predict-transact-sql?preserve-view=true&view=azure-sqldw-latest).

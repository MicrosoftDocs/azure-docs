---
title: Deploy and make predictions with ONNX
titleSuffix: SQL machine learning
description: Learn how to train a model, convert it to ONNX, deploy it to Azure SQL Edge, and then run native PREDICT on data using the uploaded ONNX model.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: hudequei, randolphwest
ms.date: 09/14/2023
ms.prod: sql
ms.technology: machine-learning
ms.topic: quickstart
ms.custom: mode-other
keywords: deploy SQL Edge
---
# Deploy and make predictions with an ONNX model and SQL machine learning

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

In this quickstart, you'll learn how to train a model, convert it to ONNX, deploy it to [Azure SQL Edge](onnx-overview.md), and then run native PREDICT on data using the uploaded ONNX model.

This quickstart is based on **scikit-learn** and uses the [Boston Housing dataset](https://scikit-learn.org/0.24/modules/generated/sklearn.datasets.load_boston.html).

## Before you begin

- If you're using Azure SQL Edge, and you haven't deployed an Azure SQL Edge module, follow the steps of [deploy SQL Edge using the Azure portal](deploy-portal.md).

- Install [Azure Data Studio](/azure-data-studio/download).

- Install Python packages needed for this quickstart:

  1. Open [New Notebook](/azure-data-studio/sql-notebooks) connected to the Python 3 Kernel.
  1. Select **Manage Packages**
  1. In the **Installed** tab, look for the following Python packages in the list of installed packages. If any of these packages aren't installed, select the **Add New** tab, search for the package, and select **Install**.
     - **scikit-learn**
     - **numpy**
     - **onnxmltools**
     - **onnxruntime**
     - **pyodbc**
     - **setuptools**
     - **skl2onnx**
     - **sqlalchemy**

- For each script part in the following sections, enter it in a cell in the Azure Data Studio notebook and run the cell.

## Train a pipeline

Split the dataset to use features to predict the median value of a house.

```python
import numpy as np
import onnxmltools
import onnxruntime as rt
import pandas as pd
import skl2onnx
import sklearn
import sklearn.datasets

from sklearn.datasets import load_boston
boston = load_boston()
boston

df = pd.DataFrame(data=np.c_[boston['data'], boston['target']], columns=boston['feature_names'].tolist() + ['MEDV'])

target_column = 'MEDV'

# Split the data frame into features and target
x_train = pd.DataFrame(df.drop([target_column], axis = 1))
y_train = pd.DataFrame(df.iloc[:,df.columns.tolist().index(target_column)])

print("\n*** Training dataset x\n")
print(x_train.head())

print("\n*** Training dataset y\n")
print(y_train.head())
```

**Output**:

```output
*** Training dataset x

        CRIM    ZN  INDUS  CHAS    NOX     RM   AGE     DIS  RAD    TAX  \
0  0.00632  18.0   2.31   0.0  0.538  6.575  65.2  4.0900  1.0  296.0
1  0.02731   0.0   7.07   0.0  0.469  6.421  78.9  4.9671  2.0  242.0
2  0.02729   0.0   7.07   0.0  0.469  7.185  61.1  4.9671  2.0  242.0
3  0.03237   0.0   2.18   0.0  0.458  6.998  45.8  6.0622  3.0  222.0
4  0.06905   0.0   2.18   0.0  0.458  7.147  54.2  6.0622  3.0  222.0

    PTRATIO       B  LSTAT
0     15.3  396.90   4.98
1     17.8  396.90   9.14
2     17.8  392.83   4.03
3     18.7  394.63   2.94
4     18.7  396.90   5.33

*** Training dataset y

0    24.0
1    21.6
2    34.7
3    33.4
4    36.2
Name: MEDV, dtype: float64
```

Create a pipeline to train the LinearRegression model. You can also use other regression models.

```python
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import RobustScaler

continuous_transformer = Pipeline(steps=[('scaler', RobustScaler())])

# All columns are numeric - normalize them
preprocessor = ColumnTransformer(
    transformers=[
        ('continuous', continuous_transformer, [i for i in range(len(x_train.columns))])])

model = Pipeline(
    steps=[
        ('preprocessor', preprocessor),
        ('regressor', LinearRegression())])

# Train the model
model.fit(x_train, y_train)
```

Check the accuracy of the model and then calculate the R2 score and mean squared error.

```python
# Score the model
from sklearn.metrics import r2_score, mean_squared_error
y_pred = model.predict(x_train)
sklearn_r2_score = r2_score(y_train, y_pred)
sklearn_mse = mean_squared_error(y_train, y_pred)
print('*** Scikit-learn r2 score: {}'.format(sklearn_r2_score))
print('*** Scikit-learn MSE: {}'.format(sklearn_mse))
```

**Output**:

```output
*** Scikit-learn r2 score: 0.7406426641094094
*** Scikit-learn MSE: 21.894831181729206
```

## Convert the model to ONNX

Convert the data types to the supported SQL data types. This conversion is required for other dataframes as well.

```python
from skl2onnx.common.data_types import FloatTensorType, Int64TensorType, DoubleTensorType

def convert_dataframe_schema(df, drop=None, batch_axis=False):
    inputs = []
    nrows = None if batch_axis else 1
    for k, v in zip(df.columns, df.dtypes):
        if drop is not None and k in drop:
            continue
        if v == 'int64':
            t = Int64TensorType([nrows, 1])
        elif v == 'float32':
            t = FloatTensorType([nrows, 1])
        elif v == 'float64':
            t = DoubleTensorType([nrows, 1])
        else:
            raise Exception("Bad type")
        inputs.append((k, t))
    return inputs
```

Using `skl2onnx`, convert the LinearRegression model to the ONNX format and save it locally.

```python
# Convert the scikit model to onnx format
onnx_model = skl2onnx.convert_sklearn(model, 'Boston Data', convert_dataframe_schema(x_train), final_types=[('variable1',FloatTensorType([1,1]))])
# Save the onnx model locally
onnx_model_path = 'boston1.model.onnx'
onnxmltools.utils.save_model(onnx_model, onnx_model_path)
```

> [!NOTE]  
> You may need to set the `target_opset` parameter for the skl2onnx.convert_sklearn function if there's a mismatch between ONNX runtime version in SQL Edge and skl2onnx packge. For more information, see the [SQL Edge Release notes](release-notes.md) to get the ONNX runtime version corresponding for the release, and pick the `target_opset` for the ONNX runtime based on the [ONNX backward compatibility matrix](https://github.com/microsoft/onnxruntime/blob/master/docs/Versioning.md#version-matrix).

## Test the ONNX model

After converting the model to ONNX format, score the model to show little to no degradation in performance.

> [!NOTE]  
> ONNX Runtime uses floats instead of doubles so small discrepancies are possible.

```python
import onnxruntime as rt
sess = rt.InferenceSession(onnx_model_path)

y_pred = np.full(shape=(len(x_train)), fill_value=np.nan)

for i in range(len(x_train)):
    inputs = {}
    for j in range(len(x_train.columns)):
        inputs[x_train.columns[j]] = np.full(shape=(1,1), fill_value=x_train.iloc[i,j])

    sess_pred = sess.run(None, inputs)
    y_pred[i] = sess_pred[0][0][0]

onnx_r2_score = r2_score(y_train, y_pred)
onnx_mse = mean_squared_error(y_train, y_pred)

print()
print('*** Onnx r2 score: {}'.format(onnx_r2_score))
print('*** Onnx MSE: {}\n'.format(onnx_mse))
print('R2 Scores are equal' if sklearn_r2_score == onnx_r2_score else 'Difference in R2 scores: {}'.format(abs(sklearn_r2_score - onnx_r2_score)))
print('MSE are equal' if sklearn_mse == onnx_mse else 'Difference in MSE scores: {}'.format(abs(sklearn_mse - onnx_mse)))
print()
```

**Output**:

```output
*** Onnx r2 score: 0.7406426691136831
*** Onnx MSE: 21.894830759270633

R2 Scores are equal
MSE are equal
```

## Insert the ONNX model

Store the model in Azure SQL Edge, in a `models` table in a database `onnx`. In the connection string, specify the **server address**, **username**, and **password**.

```python
import pyodbc

server = '' # SQL Server IP address
username = '' # SQL Server username
password = '' # SQL Server password

# Connect to the master DB to create the new onnx database
connection_string = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=master;UID=" + username + ";PWD=" + password + ";"

conn = pyodbc.connect(connection_string, autocommit=True)
cursor = conn.cursor()

database = 'onnx'
query = 'DROP DATABASE IF EXISTS ' + database
cursor.execute(query)
conn.commit()

# Create onnx database
query = 'CREATE DATABASE ' + database
cursor.execute(query)
conn.commit()

# Connect to onnx database
db_connection_string = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=" + database + ";UID=" + username + ";PWD=" + password + ";"

conn = pyodbc.connect(db_connection_string, autocommit=True)
cursor = conn.cursor()

table_name = 'models'

# Drop the table if it exists
query = f'drop table if exists {table_name}'
cursor.execute(query)
conn.commit()

# Create the model table
query = f'create table {table_name} ( ' \
    f'[id] [int] IDENTITY(1,1) NOT NULL, ' \
    f'[data] [varbinary](max) NULL, ' \
    f'[description] varchar(1000))'
cursor.execute(query)
conn.commit()

# Insert the ONNX model into the models table
query = f"insert into {table_name} ([description], [data]) values ('Onnx Model',?)"

model_bits = onnx_model.SerializeToString()

insert_params  = (pyodbc.Binary(model_bits))
cursor.execute(query, insert_params)
conn.commit()
```

## Load the data

Load the data into SQL.

First, create two tables, **features** and **target**, to store subsets of the Boston housing dataset.

- **Features** contains all data being used to predict the target, median value.
- **Target** contains the median value for each record in the dataset.

```python
import sqlalchemy
from sqlalchemy import create_engine
import urllib

db_connection_string = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=" + database + ";UID=" + username + ";PWD=" + password + ";"

conn = pyodbc.connect(db_connection_string)
cursor = conn.cursor()

features_table_name = 'features'

# Drop the table if it exists
query = f'drop table if exists {features_table_name}'
cursor.execute(query)
conn.commit()

# Create the features table
query = \
    f'create table {features_table_name} ( ' \
    f'    [CRIM] float, ' \
    f'    [ZN] float, ' \
    f'    [INDUS] float, ' \
    f'    [CHAS] float, ' \
    f'    [NOX] float, ' \
    f'    [RM] float, ' \
    f'    [AGE] float, ' \
    f'    [DIS] float, ' \
    f'    [RAD] float, ' \
    f'    [TAX] float, ' \
    f'    [PTRATIO] float, ' \
    f'    [B] float, ' \
    f'    [LSTAT] float, ' \
    f'    [id] int)'

cursor.execute(query)
conn.commit()

target_table_name = 'target'

# Create the target table
query = \
    f'create table {target_table_name} ( ' \
    f'    [MEDV] float, ' \
    f'    [id] int)'

x_train['id'] = range(1, len(x_train)+1)
y_train['id'] = range(1, len(y_train)+1)

print(x_train.head())
print(y_train.head())
```

Finally, use `sqlalchemy` to insert the `x_train` and `y_train` pandas dataframes into the tables `features` and `target`, respectively.

```python
db_connection_string = 'mssql+pyodbc://' + username + ':' + password + '@' + server + '/' + database + '?driver=ODBC+Driver+17+for+SQL+Server'
sql_engine = sqlalchemy.create_engine(db_connection_string)
x_train.to_sql(features_table_name, sql_engine, if_exists='append', index=False)
y_train.to_sql(target_table_name, sql_engine, if_exists='append', index=False)
```

Now you can view the data in the database.

## Run PREDICT using the ONNX model

With the model in SQL, run native PREDICT on the data using the uploaded ONNX model.

> [!NOTE]  
> Change the notebook kernel to SQL to run the remaining cell.

```sql
USE onnx

DECLARE @model VARBINARY(max) = (
        SELECT DATA
        FROM dbo.models
        WHERE id = 1
        );

WITH predict_input
AS (
    SELECT TOP (1000) [id],
        CRIM,
        ZN,
        INDUS,
        CHAS,
        NOX,
        RM,
        AGE,
        DIS,
        RAD,
        TAX,
        PTRATIO,
        B,
        LSTAT
    FROM [dbo].[features]
    )
SELECT predict_input.id,
    p.variable1 AS MEDV
FROM PREDICT(MODEL = @model, DATA = predict_input, RUNTIME = ONNX) WITH (variable1 FLOAT) AS p;
```

## Next steps

- [Machine Learning and AI with ONNX in SQL Edge](onnx-overview.md)

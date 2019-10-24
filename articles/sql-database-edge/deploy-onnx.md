---
title: Deploy ONNX model to SQL Database Edge Preview | Microsoft Docs
description: Learn how to deploy Azure SQL Database Edge using the Azure portal
keywords: deploy sql database edge
services: sql-database-edge
ms.service: sql-database-edge
ms.subservice: machine-learning
ms.topic: conceptual
author: ronychatterjee
ms.author: achatter
ms.reviewer: davidph
ms.date: 11/04/2019
---

# Deploy an ONNX model on Azure SQL Database Edge Preview

In this quickstart you will learn how to deploy an ONNX model to Azure SQL Database Edge Preview.

This quickstart is based on **scikit-learn** and uses the [Boston Housing dataset](https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_boston.html).

## Before you begin

* If you don't have an Azure SQL Database Edge, please follow the steps of [eploy SQL Database Edge Preview using the Azure portal](deploy-portal.md)

* Install [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/download) 

## Train, Convert, and Predict with the ONNX Runtime

First, open Azure Data Studio and follow these steps to install the packages needed for this quickstart:

1. Open [New Notebook](https://docs.microsoft.com/sql/azure-data-studio/sql-notebooks) connected to the Python 3 Kernel. 
1. Click on the Manage Packages and under **Add New** search for **sklearn** and install the scikit-learn package. 
1. Also, install the **onnxmltools**, **onnxruntime** packages, which are used with ONNX.

This quickstart has three parts:

1. Create a pipeline to train a LinearRegression model
2. Convert the model to the ONNX format
3. Predict using the ONNX model

For each script part below, enter it in a cell in the Azure Data Studio notebook and run the cell.

### Train a pipeline

Split the data set to use features to predict the median value of a house.

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

# x contains all predictors (features)
x = df.drop(['MEDV'], axis = 1)

# y is what we are trying to predict - the median value
y = df.iloc[:,-1]


    # Split the data frame into features and target
x_train = df.drop(['MEDV'], axis = 1)
y_train = df.iloc[:,-1]

print("\n*** Training data set x\n")
print(x_train.head())

print("\n*** Training data set y\n")
print(y_train.head())
```

**Output**:

```
*** Training data set x

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

*** Training data set y

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

```
*** Scikit-learn r2 score: 0.7406426641094094
*** Scikit-learn MSE: 21.894831181729206
```

### Convert the model to ONNX

We will need to convert the data types to the supported SQL data types. This conversion will be required for other dataframes as well.

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

Using skl2onnx, we will convert our LinearRegression model to the ONNX format and save it locally.

```python
# Convert the scikit model to onnx format
onnx_model = skl2onnx.convert_sklearn(model, 'Boston Data', convert_dataframe_schema(x_train))
# Save the onnx model locally
onnx_model_path = 'boston1.model.onnx'
onnxmltools.utils.save_model(onnx_model, onnx_model_path)
```



## Next Steps

- [Machine Learning and Artificial Intelligence with ONNX in SQL Database Edge](onnx-overview.md).
- Building an end to end IoT Solution with SQL Database Edge using IoT Edge.
---
title: Deploy ML model on SQL Edge using ONNX 
description: We will run the ONNX ML models on SQL Edge to predict Silica impurities
keywords: 
services: sql-database-edge
ms.service: sql-database-edge
ms.topic: conceptual
author: VasiyaKrishnan
ms.author: vakrishn
ms.reviewer: sstein
ms.date: 05/19/2020
---
# Deploying ML model on Azure SQL Edge using ONNX 

In this tutorial we will, 
1.  Use Azure Data Studio to connect to SQL Database in the Azure SQL Edge instance.
2.  Predict Iron Ore Impurities with ONNX in Azure SQL Edge

## Connecting to the SQL Database in the Azure SQl Edge instance 
    
1. Open Azure Data Studio. In the Welcome tab, start a new connection.
2. Specify the connection details as below:

|_Field_|_Value_|   
|-------|-------|
|Connection type| Microsoft SQL Server|
|Serve|Public IP address mentioned in the VM that was created for this demo|
|Username|sa|
|Password|The strong password that was used while creating the Azure SQL Edge instance| 
|Database|Default|
|Server group|Default|
|Name (optional)|Provide an optional name|

3. Click on connect 
4. In the file section, open a new notebook or use the keyboard shortcut Alt + Windows + N. Set the kernel to Python 3 before executing the below section.

## Predict Iron Ore Impurities (% of Silica) with ONNX in Azure SQL Edge
The following python code can be collated in Jupyter notebook and run on Azure Data Studio. Before we begin with the experiment, we need to install and import the below packages.
```python
!pip install azureml.core -q
!pip install azureml.train.automl -q
!pip install matplotlib -q
!pip install pyodbc -q
!pip install spicy -q

import logging
from matplotlib import pyplot as plt
import numpy as np
import pandas as pd
import pyodbc

from scipy import stats
from scipy.stats import skew #for some statistics

import azureml.core
from azureml.core.experiment import Experiment
from azureml.core.workspace import Workspace
from azureml.train.automl import AutoMLConfig
from azureml.train.automl import constants
```
Let us no proceed with defining the Azure AutoML workspace and AutoML experiment configuration for the regression experiment.
```python
ws = Workspace(subscription_id="<Azure Subscription ID>",
               resource_group="<resource group name>",
               workspace_name="<ML workspace name>")
# Choose a name for the experiment.
experiment_name = 'silic_percent2-Forecasting-onnx'
experiment = Experiment(ws, experiment_name)
```
Next, we will import the dataset into a panda frame. For the purpose of the model training, we will be using [this](https://www.kaggle.com/edumagalhaes/quality-prediction-in-a-mining-process) training data set from Kaggle. Download the data file and save it locally on your development machine. The main goal is to use this data to predict how much impurity is in the ore concentrate. 
```python
df = pd.read_csv("<local path where you have saved the data file>",decimal=",",parse_dates=["date"],infer_datetime_format=True)
df = df.drop(['date'],axis=1)
df.describe()
```
We analyze the data to identify any skewness. During this process, we will look at the distribution and the skew information for each of the columns in the data frame. 
```python
## We can use a histogram chart to view the data distribution for the Dataset. In this example, we are looking at the histogram for the "% Silica Concentrate" 
## and the "% Iron Feed". From the histogram, you'll notice the data distribution is skewed for most of the features in the dataset. 

f, (ax1,ax2,ax3) = plt.subplots(1,3)
ax1.hist(df['% Iron Feed'], bins='auto')
#ax1.title = 'Iron Feed'
ax2.hist(df['% Silica Concentrate'], bins='auto')
#ax2.title = 'Silica Concentrate'
ax3.hist(df['% Silica Feed'], bins='auto')
#ax3.title = 'Silica Feed'
```
We check and fix the level of skewness in the data
```python
##Check data skewness with the skew or the kurtosis function in spicy.stats
##Skewness using the spicy.stats skew function
for i in list(df):
        print('Skew value for column "{0}" is: {1}'.format(i,skew(df[i])))

#Fix the Skew using Box Cox Transform
from scipy.special import boxcox1p
for i in list(df):
    if(abs(skew(df[i])) >= 0.20):
        #print('found skew in column - {0}'.format(i))
        df[i] = boxcox1p(df[i], 0.10)
        print('Skew value for column "{0}" is: {1}'.format(i,skew(df[i])))
```
The, we check the correlation fo other features with the prediction feature. If the correlation is not high, remove those features.
```python
silic_corr = df.corr()['% Silica Concentrate']
silic_corr = abs(silic_corr).sort_values()
drop_index= silic_corr.index[:8].tolist()
df = df.drop(drop_index, axis=1)
df.describe()
```
Now, start the AzureML experiment to find and train the best algorithm. IN this case, we are testing with all the regression algorithms, with a primary metric of Normalized Root Mean Squared Error (NRMSE). For more information, refer [Azure ML Experiments Primary Metric](https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train#primary-metric). The below code will start a local run of the ML experiment. 
```python
## Define the X_train and the y_train data sets for the AutoML experiments. X_Train are the inputs or the features, while y_train is the outcome or the prediction result. 

y_train = df['% Silica Concentrate']
x_train = df.iloc[:,0:-1]
automl_config = AutoMLConfig(task = 'regression',
                             primary_metric = 'normalized_root_mean_squared_error',
                             iteration_timeout_minutes = 60,
                             iterations = 10,                        
                             X = x_train, 
                             y = y_train,
                             featurization = 'off',
                             enable_onnx_compatible_models=True)

local_run = experiment.submit(automl_config, show_output = True)
best_run, onnx_mdl = local_run.get_output(return_onnx_model=True)
```
We proceed with loading the model in Azure SQL Edge database for local scoring 
```python
## Load the Model into a SQL Database.
## Define the Connection string parameters. These connection strings will be used later also in the demo.
server = '<SQL Server IP address>'
username = 'sa' # SQL Server username
password = '<SQL Server password>'
database = 'IronOreSilicaPrediction'
db_connection_string = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=" + database + ";UID=" + username + ";PWD=" + password + ";"
conn = pyodbc.connect(db_connection_string, autocommit=True)
cursor = conn.cursor()

# Insert the ONNX model into the models table
query = f"insert into models ([description], [data]) values ('Silica_Percentage_Predict_Regression_NRMSE_New1',?)"
model_bits = onnx_mdl.SerializeToString()
insert_params  = (pyodbc.Binary(model_bits))
cursor.execute(query, insert_params)
conn.commit()
cursor.close()
conn.close()
```
Finally, we use the Azure SQL Edge model to perform prediction using the trained model
```python
## Define the Connection string parameters. These connection strings will be used later also in the demo.
server = '<SQL Server IP address>'
username = 'sa' # SQL Server username
password = '<SQL Server password>'
database = 'IronOreSilicaPrediction'
db_connection_string = "Driver={ODBC Driver 17 for SQL Server};Server=" + server + ";Database=" + database + ";UID=" + username + ";PWD=" + password + ";"
conn = pyodbc.connect(db_connection_string, autocommit=True)
#cursor = conn.cursor()
query = \
        f'declare @model varbinary(max) = (Select [data] from [dbo].[Models] where [id] = 1);' \
        f' with d as ( SELECT  [timestamp] ,cast([cur_Iron_Feed] as real) [__Iron_Feed] ,cast([cur_Silica_Feed]  as real) [__Silica_Feed]' \
        f',cast([cur_Starch_Flow] as real) [Starch_Flow],cast([cur_Amina_Flow] as real) [Amina_Flow]' \
        f' ,cast([cur_Ore_Pulp_pH] as real) [Ore_Pulp_pH] ,cast([cur_Flotation_Column_01_Air_Flow] as real) [Flotation_Column_01_Air_Flow]' \
        f' ,cast([cur_Flotation_Column_02_Air_Flow] as real) [Flotation_Column_02_Air_Flow]' \
        f' ,cast([cur_Flotation_Column_03_Air_Flow] as real) [Flotation_Column_03_Air_Flow]' \
        f' ,cast([cur_Flotation_Column_07_Air_Flow] as real) [Flotation_Column_07_Air_Flow]' \
        f' ,cast([cur_Flotation_Column_04_Level] as real) [Flotation_Column_04_Level]' \
        f' ,cast([cur_Flotation_Column_05_Level] as real) [Flotation_Column_05_Level]' \
        f' ,cast([cur_Flotation_Column_06_Level] as real) [Flotation_Column_06_Level]' \
        f' ,cast([cur_Flotation_Column_07_Level] as real) [Flotation_Column_07_Level]' \
        f' ,cast([cur_Iron_Concentrate] as real) [__Iron_Concentrate]' \
        f' FROM [dbo].[IronOreMeasurements1]' \
        f' where timestamp between dateadd(hour,-1,getdate()) and getdate()) ' \
        f' SELECT d.*, p.variable_out1' \
        f' FROM PREDICT(MODEL = @model, DATA = d) WITH(variable_out1 numeric(25,17)) as p;' 
  
df_result = pd.read_sql(query,conn)
df_result.describe()
```
Using python we can create a chart of the predicted silica percentage against the iron feed, datetime, silica feed
```python
import plotly.graph_objects as go
fig = go.Figure()
fig.add_trace(go.Scatter(x=df_result['timestamp'],y=df_result['__Iron_Feed'],mode='lines+markers',name='Iron Feed',line=dict(color='firebrick', width=2)))
fig.add_trace(go.Scatter(x=df_result['timestamp'],y=df_result['__Silica_Feed'],mode='lines+markers',name='Silica Feed',line=dict(color='green', width=2)))
fig.add_trace(go.Scatter(x=df_result['timestamp'],y=df_result['variable_out1'],mode='lines+markers',name='Silica Percent',line=dict(color='royalblue', width=3)))
fig.update_layout(height= 600, width=1500,xaxis_title='Time')
fig.show()
```

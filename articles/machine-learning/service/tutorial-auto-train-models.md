---
title: "Regression model tutorial - Automatically train model with Azure Machine Learning service"
description: Learn how to generate a ML model using automated machine learning.  Azure Machine Learning can perform data preprocessing, algorithm selection and hyperparameter selection in an automated way for you. The final model then be deployed with Azure Machine Learning service.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: tutorial
author: nacharya1
ms.author: nilesha
ms.reviewer: sgilley
ms.date: 12/04/2018
ms.custom: seodec12
---

# Tutorial (part 2): Use automated machine learning to build and train a regression model

This tutorial is **part two of a two-part tutorial series**. In the previous tutorial, you [prepared the NYC taxi data for regression modeling](tutorial-data-prep.md).

Now, you're ready to start building your model with Azure Machine Learning service. In this part of the tutorial, you will use the prepared data and automatically generate a regression model to predict taxi fare prices. Using the automated ML capabilities of the service, you define your machine learning goals and constraints, launch the automated machine learning process and then allow the algorithm selection and hyperparameter-tuning to happen for you. The automated ML technique iterates over many combinations of algorithms and hyperparameters until it finds the best model based on your criterion.

![flow diagram](./media/tutorial-auto-train-models/flow2.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Setup a Python environment and import the SDK packages
> * Configure an Azure Machine Learning service workspace
> * Auto-train a regression model
> * Run the model locally with custom parameters
> * Explore the results
> * Register the best model

If you don’t have an Azure subscription, create a [free account](https://aka.ms/AMLfree) before you begin.

>[!NOTE]
> Code in this article was tested with Azure Machine Learning SDK version 1.0.0


## Prerequisites

> * [Run the data preparation tutorial](tutorial-data-prep.md).
> * Automated machine learning configured environment e.g. Azure notebooks, Local Python environment or Data Science Virtual Machine. [Setup](samples-notebooks.md) automated machine learning.

## Get the notebook

For your convenience, this tutorial is available as a [Jupyter notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/tutorials/regression-part2-automated-ml.ipynb). Run the `regression-part2-automated-ml.ipynb` notebook either in Azure Notebooks or in your own Jupyter notebook server.

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-in-azure-notebook.md)]

## Import packages
Import Python packages you need in this tutorial.


```python
import azureml.core
import pandas as pd
from azureml.core.workspace import Workspace
from azureml.train.automl.run import AutoMLRun
import time
import logging

```

## Configure workspace

Create a workspace object from the existing workspace. A `Workspace` is a class that accepts your Azure subscription and resource information, and creates a cloud resource to monitor and track your model runs. `Workspace.from_config()` reads the file **aml_config/config.json** and loads the details into an object named `ws`.  `ws` is used throughout the rest of the code in this tutorial.

Once you have a workspace object, specify a name for the experiment and create and register a local directory with the workspace. The history of all runs is recorded under the specified experiment and in [Azure portal](https://portal.azure.com).


```python
ws = Workspace.from_config()
# choose a name for the run history container in the workspace
experiment_name = 'automated-ml-regression'
# project folder
project_folder = './automated-ml-regression'

import os

output = {}
output['SDK version'] = azureml.core.VERSION
output['Subscription ID'] = ws.subscription_id
output['Workspace'] = ws.name
output['Resource Group'] = ws.resource_group
output['Location'] = ws.location
output['Project Directory'] = project_folder
pd.set_option('display.max_colwidth', -1)
pd.DataFrame(data=output, index=['']).T
```

## Explore data

Utilize the data flow object created in the previous tutorial. Open and execute the data flow and review the results.


```python
import azureml.dataprep as dprep
package_saved = dprep.Package.open(".\dflow")
dflow_prepared = package_saved.dataflows[0]
dflow_prepared.get_profile()
```




<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Type</th>
      <th>Min</th>
      <th>Max</th>
      <th>Count</th>
      <th>Missing Count</th>
      <th>Not Missing Count</th>
      <th>Percent missing</th>
      <th>Error Count</th>
      <th>Empty count</th>
      <th>0.1% Quantile</th>
      <th>1% Quantile</th>
      <th>5% Quantile</th>
      <th>25% Quantile</th>
      <th>50% Quantile</th>
      <th>75% Quantile</th>
      <th>95% Quantile</th>
      <th>99% Quantile</th>
      <th>99.9% Quantile</th>
      <th>Mean</th>
      <th>Standard Deviation</th>
      <th>Variance</th>
      <th>Skewness</th>
      <th>Kurtosis</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>vendor</th>
      <td>FieldType.STRING</td>
      <td>1</td>
      <td>VTS</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>pickup_weekday</th>
      <td>FieldType.STRING</td>
      <td>Friday</td>
      <td>Wednesday</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>pickup_hour</th>
      <td>FieldType.DECIMAL</td>
      <td>0</td>
      <td>23</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0</td>
      <td>3.57523</td>
      <td>3</td>
      <td>9.91106</td>
      <td>15.9327</td>
      <td>19</td>
      <td>22.0225</td>
      <td>23</td>
      <td>23</td>
      <td>14.2326</td>
      <td>6.34926</td>
      <td>40.3131</td>
      <td>-0.693335</td>
      <td>-0.459336</td>
    </tr>
    <tr>
      <th>pickup_minute</th>
      <td>FieldType.DECIMAL</td>
      <td>0</td>
      <td>59</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0</td>
      <td>5.32313</td>
      <td>4.92308</td>
      <td>14.2214</td>
      <td>29.5244</td>
      <td>44.6436</td>
      <td>56.3767</td>
      <td>58.9798</td>
      <td>59</td>
      <td>29.4635</td>
      <td>17.4396</td>
      <td>304.14</td>
      <td>0.00440324</td>
      <td>-1.20458</td>
    </tr>
    <tr>
      <th>pickup_second</th>
      <td>FieldType.DECIMAL</td>
      <td>0</td>
      <td>59</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0</td>
      <td>4.99286</td>
      <td>4.91954</td>
      <td>14.6121</td>
      <td>29.9239</td>
      <td>44.5221</td>
      <td>56.6792</td>
      <td>59</td>
      <td>59</td>
      <td>29.6225</td>
      <td>17.3868</td>
      <td>302.302</td>
      <td>-0.0227466</td>
      <td>-1.19409</td>
    </tr>
    <tr>
      <th>dropoff_weekday</th>
      <td>FieldType.STRING</td>
      <td>Friday</td>
      <td>Wednesday</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>dropoff_hour</th>
      <td>FieldType.DECIMAL</td>
      <td>0</td>
      <td>23</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0</td>
      <td>3.23217</td>
      <td>2.93333</td>
      <td>9.92334</td>
      <td>15.9135</td>
      <td>19</td>
      <td>22.2739</td>
      <td>23</td>
      <td>23</td>
      <td>14.1815</td>
      <td>6.45578</td>
      <td>41.677</td>
      <td>-0.691001</td>
      <td>-0.500215</td>
    </tr>
    <tr>
      <th>dropoff_minute</th>
      <td>FieldType.DECIMAL</td>
      <td>0</td>
      <td>59</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0</td>
      <td>5.1064</td>
      <td>5</td>
      <td>14.2051</td>
      <td>29.079</td>
      <td>44.2937</td>
      <td>56.6338</td>
      <td>58.9984</td>
      <td>59</td>
      <td>29.353</td>
      <td>17.4241</td>
      <td>303.598</td>
      <td>0.0142562</td>
      <td>-1.21531</td>
    </tr>
    <tr>
      <th>dropoff_second</th>
      <td>FieldType.DECIMAL</td>
      <td>0</td>
      <td>59</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0</td>
      <td>5.03373</td>
      <td>5</td>
      <td>14.7471</td>
      <td>29.598</td>
      <td>45.3216</td>
      <td>56.1044</td>
      <td>58.9728</td>
      <td>59</td>
      <td>29.7923</td>
      <td>17.481</td>
      <td>305.585</td>
      <td>-0.0281313</td>
      <td>-1.21965</td>
    </tr>
    <tr>
      <th>store_forward</th>
      <td>FieldType.STRING</td>
      <td>N</td>
      <td>Y</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th>pickup_longitude</th>
      <td>FieldType.DECIMAL</td>
      <td>-74.0782</td>
      <td>-73.7365</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>-74.0763</td>
      <td>-73.9625</td>
      <td>-73.9629</td>
      <td>-73.949</td>
      <td>-73.9279</td>
      <td>-73.8667</td>
      <td>-73.8304</td>
      <td>-73.8232</td>
      <td>-73.7698</td>
      <td>-73.9139</td>
      <td>0.0487111</td>
      <td>0.00237277</td>
      <td>0.402697</td>
      <td>-0.613516</td>
    </tr>
    <tr>
      <th>pickup_latitude</th>
      <td>FieldType.DECIMAL</td>
      <td>40.5755</td>
      <td>40.8799</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>40.6329</td>
      <td>40.7131</td>
      <td>40.7116</td>
      <td>40.7214</td>
      <td>40.7581</td>
      <td>40.8051</td>
      <td>40.8489</td>
      <td>40.8676</td>
      <td>40.8777</td>
      <td>40.7652</td>
      <td>0.0483485</td>
      <td>0.00233758</td>
      <td>0.228088</td>
      <td>-0.598862</td>
    </tr>
    <tr>
      <th>dropoff_longitude</th>
      <td>FieldType.DECIMAL</td>
      <td>-74.0857</td>
      <td>-73.7209</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>-74.0788</td>
      <td>-73.9856</td>
      <td>-73.9858</td>
      <td>-73.959</td>
      <td>-73.9367</td>
      <td>-73.8848</td>
      <td>-73.8155</td>
      <td>-73.7767</td>
      <td>-73.7335</td>
      <td>-73.9207</td>
      <td>0.055961</td>
      <td>0.00313163</td>
      <td>0.648649</td>
      <td>0.0229141</td>
    </tr>
    <tr>
      <th>dropoff_latitude</th>
      <td>FieldType.DECIMAL</td>
      <td>40.5835</td>
      <td>40.8797</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>40.5977</td>
      <td>40.6954</td>
      <td>40.6951</td>
      <td>40.7275</td>
      <td>40.7582</td>
      <td>40.7884</td>
      <td>40.8504</td>
      <td>40.868</td>
      <td>40.8786</td>
      <td>40.7595</td>
      <td>0.0504621</td>
      <td>0.00254642</td>
      <td>0.0484179</td>
      <td>-0.0368799</td>
    </tr>
    <tr>
      <th>passengers</th>
      <td>FieldType.DECIMAL</td>
      <td>1</td>
      <td>6</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>5</td>
      <td>5</td>
      <td>6</td>
      <td>6</td>
      <td>2.32979</td>
      <td>1.79978</td>
      <td>3.2392</td>
      <td>0.834099</td>
      <td>-1.11111</td>
    </tr>
    <tr>
      <th>cost</th>
      <td>FieldType.DECIMAL</td>
      <td>0</td>
      <td>444</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>7059.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0</td>
      <td>3.01808</td>
      <td>3.0125</td>
      <td>5.91545</td>
      <td>9.49055</td>
      <td>16.5816</td>
      <td>33.5638</td>
      <td>51.9924</td>
      <td>81.1368</td>
      <td>12.9112</td>
      <td>11.6447</td>
      <td>135.599</td>
      <td>8.6842</td>
      <td>269.818</td>
    </tr>
  </tbody>
</table>

You prepare the data for the experiment by adding columns to `dflow_x` to be features for our model creation. You define `dflow_y` to be our prediction value; cost.

```python
dflow_X = dflow_prepared.keep_columns(['pickup_weekday', 'dropoff_latitude', 'dropoff_longitude','pickup_hour','pickup_longitude','pickup_latitude','passengers'])
dflow_y = dflow_prepared.keep_columns('cost')
```

### Split data into train and test sets

Now you split the data into training and test sets using the `train_test_split` function in the `sklearn` library. This function segregates the data into the x (features) data set for model training and the y (values to predict) data set for testing. The `test_size` parameter determines the percentage of data to allocate to testing. The `random_state` parameter sets a seed to the random generator, so that your train-test splits are always deterministic.

```python
from sklearn.model_selection import train_test_split

x_df = dflow_X.to_pandas_dataframe()
y_df = dflow_y.to_pandas_dataframe()

x_train, x_test, y_train, y_test = train_test_split(x_df, y_df, test_size=0.2, random_state=123)
# flatten y_train to 1d array
y_train.values.flatten()
```

You now have the necessary packages and data ready for auto training for your model.

## Automatically train a model

To automatically train a model:
1. Define settings for the experiment run
1. Submit the experiment for model tuning

### Define settings for autogeneration and tuning

Define the experiment parameters and models settings for autogeneration and tuning. View the full list of [settings](how-to-configure-auto-train.md).


|Property| Value in this tutorial |Description|
|----|----|---|
|**iteration_timeout_minutes**|10|Time limit in minutes for each iteration|
|**iterations**|30|Number of iterations. In each iteration, the model trains with the data with a specific pipeline|
|**primary_metric**| spearman_correlation | Metric that you want to optimize.|
|**preprocess**| True | True enables experiment to perform preprocessing on the input.|
|**verbosity**| logging.INFO | Controls the level of logging.|
|**n_cross_validationss**|5|Number of cross validation splits



```python
automl_settings = {
    "iteration_timeout_minutes" : 10,
    "iterations" : 30,
    "primary_metric" : 'spearman_correlation',
    "preprocess" : True,
    "verbosity" : logging.INFO,
    "n_cross_validations": 5
}
```


```python
from azureml.train.automl import AutoMLConfig

# local compute
automated_ml_config = AutoMLConfig(task = 'regression',
                             debug_log = 'automated_ml_errors.log',
                             path = project_folder,
                             X = x_train.values,
                             y = y_train.values.flatten(),
                             **automl_settings)
```

### Train the automatic regression model

Start the experiment to run locally. Pass the defined `automated_ml_config` object to the experiment, and set the output to `true` to view progress during the experiment.


```python
from azureml.core.experiment import Experiment
experiment=Experiment(ws, experiment_name)
local_run = experiment.submit(automated_ml_config, show_output=True)
```

    Parent Run ID: AutoML_83117da4-07e3-473a-b83e-99471bfa9e09
    *******************************************************************************************
    ITERATION: The iteration being evaluated.
    PIPELINE: A summary description of the pipeline being evaluated.
    DURATION: Time taken for the current iteration.
    METRIC: The result of computing score on the fitted pipeline.
    BEST: The best observed score thus far.
    *******************************************************************************************
    
     ITERATION   PIPELINE                                       DURATION      METRIC      BEST
             0   MaxAbsScaler ExtremeRandomTrees                0:00:21       0.6498    0.6498
             1   MinMaxScaler GradientBoosting                  0:00:22       0.6624    0.6624
             2   StandardScalerWrapper KNN                      0:00:18       0.7267    0.7267
             3   StandardScalerWrapper GradientBoosting         0:00:18       0.5003    0.7267
             4    Ensemble                                      0:00:38       0.6659    0.7267
    

## Explore the results

Explore the results of automatic training with a Jupyter widget or by examining the experiment history.

### Option 1: Add a Jupyter widget to see results

If you are using a Juypter notebook, use this Jupyter notebook widget to see a graph and a table of all results.


```python
from azureml.widgets import RunDetails
RunDetails(local_run).show()
```

![Jupyter Widget run details](./media/tutorial-auto-train-models/jup-widget-auto.png)

### Option 2: Get and examine all run iterations in Python

Alternatively, you can retrieve the history of each experiment and explore the individual metrics for each iteration run.

```python
children = list(local_run.get_children())
metricslist = {}
for run in children:
    properties = run.get_properties()
    metrics = {k: v for k, v in run.get_metrics().items() if isinstance(v, float)}
    metricslist[int(properties['iteration'])] = metrics

import pandas as pd
rundata = pd.DataFrame(metricslist).sort_index(1)
rundata
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>0</th>
      <th>1</th>
      <th>2</th>
      <th>3</th>
      <th>4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>explained_variance</th>
      <td>0.113810</td>
      <td>0.093514</td>
      <td>-0.010248</td>
      <td>0.005867</td>
      <td>0.108187</td>
    </tr>
    <tr>
      <th>mean_absolute_error</th>
      <td>7.004893</td>
      <td>6.348354</td>
      <td>6.493000</td>
      <td>7.045597</td>
      <td>6.646850</td>
    </tr>
    <tr>
      <th>median_absolute_error</th>
      <td>4.834063</td>
      <td>3.503244</td>
      <td>3.321553</td>
      <td>4.349547</td>
      <td>4.389995</td>
    </tr>
    <tr>
      <th>normalized_mean_absolute_error</th>
      <td>0.077832</td>
      <td>0.070537</td>
      <td>0.072144</td>
      <td>0.078284</td>
      <td>0.073854</td>
    </tr>
    <tr>
      <th>normalized_median_absolute_error</th>
      <td>0.053712</td>
      <td>0.038925</td>
      <td>0.036906</td>
      <td>0.048328</td>
      <td>0.048778</td>
    </tr>
    <tr>
      <th>normalized_root_mean_squared_error</th>
      <td>0.117819</td>
      <td>0.120518</td>
      <td>0.126141</td>
      <td>0.124289</td>
      <td>0.118340</td>
    </tr>
    <tr>
      <th>normalized_root_mean_squared_log_error</th>
      <td>0.177689</td>
      <td>0.163360</td>
      <td>0.168101</td>
      <td>0.178250</td>
      <td>0.168685</td>
    </tr>
    <tr>
      <th>r2_score</th>
      <td>0.104661</td>
      <td>0.064075</td>
      <td>-0.036158</td>
      <td>-0.004403</td>
      <td>0.096976</td>
    </tr>
    <tr>
      <th>root_mean_squared_error</th>
      <td>10.603744</td>
      <td>10.846632</td>
      <td>11.352731</td>
      <td>11.185972</td>
      <td>10.650593</td>
    </tr>
    <tr>
      <th>root_mean_squared_log_error</th>
      <td>0.801531</td>
      <td>0.736896</td>
      <td>0.758279</td>
      <td>0.804062</td>
      <td>0.760913</td>
    </tr>
    <tr>
      <th>spearman_correlation</th>
      <td>0.549825</td>
      <td>0.562435</td>
      <td>0.526702</td>
      <td>0.500302</td>
      <td>0.565857</td>
    </tr>
    <tr>
      <th>spearman_correlation_max</th>
      <td>0.549825</td>
      <td>0.562435</td>
      <td>0.562435</td>
      <td>0.562435</td>
      <td>0.565857</td>
    </tr>
  </tbody>
</table>
</div>

## Retrieve the best model

Select the best pipeline from our iterations. The `get_output` method on `automl_classifier` returns the best run and the fitted model for the last fit invocation. There are overloads on `get_output` that allow you to retrieve the best run and fitted model for any logged metric or a particular iteration.

```python
best_run, fitted_model = local_run.get_output()
print(best_run)
print(fitted_model)
```

## Register the model

Register the model in your Azure Machine Learning service workspace.


```python
description = 'Automated Machine Learning Model'
tags = None
local_run.register_model(description=description, tags=tags)
local_run.model_id # Use this id to deploy the model as a web service in Azure
```

## Test the best model accuracy

Use the best model to run predictions on the test data set. The function `predict` uses the best model, and predicts the values of y (trip cost) from the `x_test` data set. Print the first 10 predicted cost values from `y_predict`.

```python
y_predict = fitted_model.predict(x_test.values)
print(y_predict[:10])
```

Compare the predicted cost values with the actual cost values. Use the `y_test` dataframe, and convert it to a list to compare to the predicted values. The function `mean_absolute_error` takes two arrays of values, and calculates the average absolute value error between them. In this example, a mean absolute error of 3.5 would mean that on average, the model predicts the cost within plus or minus 3.5 of the actual value.

```python
from sklearn.metrics import mean_absolute_error

y_actual = y_test.values.flatten().tolist()
mean_absolute_error(y_actual, y_predict)
```

    [ 3.16213051 ]

Run the following code to calculate MAPE (mean absolute percent error) using the full `y_actual` and `y_predict` data sets. This metric calculates an absolute difference between each predicted and actual value, sums all the differences, and then expresses that sum as a percent of the total of the actual values.

```python
sum_actuals = sum_errors = 0

for actual_val, predict_val in zip(y_actual, y_predict):
    abs_error = actual_val - predict_val
    if abs_error < 0:
        abs_error = abs_error * -1

    sum_errors = sum_errors + abs_error
    sum_actuals = sum_actuals + actual_val

mean_abs_percent_error = sum_errors / sum_actuals
print("Model MAPE:")
print(mean_abs_percent_error)
print()
print("Model Accuracy:")
print(1 - mean_abs_percent_error)
```

    Model MAPE:
    0.22424976634422172

    Model Accuracy:
    0.7757502336557782

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

In this automated machine learning tutorial, you:

> [!div class="checklist"]
> * Configured a workspace and prepared data for an experiment
> * Trained using an automated regression model locally with custom parameters
> * Explored and reviewed training results
> * Registered the best model

[Deploy your model](tutorial-deploy-models-with-aml.md) with Azure Machine Learning.

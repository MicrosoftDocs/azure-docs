---
title: 'Tutorial: Run experiments using Azure Automated ML'
description: A tutorial on how to run machine learning experiments using Apache Spark and Azure Automated ML
services: synapse-analytics
author: midesa
ms.service: synapse-analytics
ms.topic: tutorial
ms.subservice: machine-learning
ms.date: 06/30/2020
ms.author: midesa
ms.reviewer: jrasnick, 
---
# Tutorial: Run experiments using Azure Automated ML and Apache Spark

Azure Machine Learning is a cloud-based environment that allows you to train, deploy, automate, manage, and track machine learning models. 

In this tutorial, you use [automated machine learning](https://docs.microsoft.com/azure/machine-learning/concept-automated-ml) in Azure Machine Learning to create a regression model to predict NYC taxi fare prices. This process accepts training data and configuration settings and automatically iterates through combinations of different feature normalization/standardization methods, models, and hyperparameter settings to arrive at the best model.

In this tutorial you learn the following tasks:
- Download the data using Apache Spark and Azure Open Datasets
- Transform and clean data using Apache Spark dataframes
- Train an automated machine learning regression model
- Calculate model accuracy

### Before you begin

- Create a serverless Apache Spark Pool by following the [Create a serverless Apache Spark pool quickstart](../quickstart-create-apache-spark-pool-studio.md).
- Complete the [Azure Machine Learning workspace setup tutorial](https://docs.microsoft.com/azure/machine-learning/tutorial-1st-experiment-sdk-setup) if you do not have an existing Azure Machine Learning workspace. 

### Understand regression models

*Regression models* predict numerical output values based on independent predictors. In regression, the objective is to help establish the relationship among those independent predictor variables by estimating how one variable impacts the others.  

### Regression analysis example on the NYC taxi data

In this example, you will use Spark to perform some analysis on taxi trip tip data from New York. The data is available through [Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/catalog/nyc-taxi-limousine-commission-yellow-taxi-trip-records/). This subset of the dataset contains information about yellow taxi trips, including information about each trip, the start and end time and locations, the cost, and other interesting attributes.

> [!IMPORTANT]
> 
> There may be additional charges for pulling this data from its storage location. In the following steps, you will develop a model to predict NYC taxi fare prices. 
> 

##  Download and prepare the data

1. Create a notebook using the PySpark kernel. For instructions, see [Create a Notebook](https://docs.microsoft.com/azure/synapse-analytics/quickstart-apache-spark-notebook#create-a-notebook.)
   
   > [!Note]
   > 
   > Because of the PySpark kernel, you do not need to create any contexts explicitly. The Spark context is automatically created for you when you run the first code cell.
   >

2. Because the raw data is in a Parquet format, you can use the Spark context to pull the file into memory as a dataframe directly. Create a Spark dataframe by retrieving the data via the Open Datasets API. Here, we'll use the Spark dataframe *schema on read* properties to infer the datatypes and schema. 
   
   ```python
   blob_account_name = "azureopendatastorage"
   blob_container_name = "nyctlc"
   blob_relative_path = "yellow"
   blob_sas_token = r""

   # Allow Spark to read from Blob remotely
   wasbs_path = 'wasbs://%s@%s.blob.core.windows.net/%s' % (blob_container_name, blob_account_name, blob_relative_path)
   spark.conf.set('fs.azure.sas.%s.%s.blob.core.windows.net' % (blob_container_name, blob_account_name),blob_sas_token)

   # Spark read parquet, note that it won't load any data yet by now
   df = spark.read.parquet(wasbs_path)
   ```

3. Depending on the size of your Spark pool (preview), the raw data may be too large or take too much time to operate on. You can filter this data down to something smaller by using the ```start_date``` and ```end_date``` filters. This applies a filter that returns a month of data. Once we have the filtered dataframe, we will also run the ```describe()``` function on the new dataframe to see summary statistics for each field. 

   Based on the summary statistics, we can see that there are some irregularities and outliers in the data. For example, the statistics show that the the minimum trip distance is less than 0. We will need to filter out these irregular data points.
   
   ```python
   # Create an ingestion filter
   start_date = '2015-01-01 00:00:00'
   end_date = '2015-12-31 00:00:00'

   filtered_df = df.filter('tpepPickupDateTime > "' + start_date + '" and tpepPickupDateTime < "' + end_date + '"')

   filtered_df.describe().show()
   ```

4. Now, we will generate features from the dataset by selecting a set of columns and creating various time-based features from the pickup datetime field. We will also filter out outliers that were identified from the earlier step and then remove the last few columns which are unnecessary for training.
   
   ```python
   from datetime import datetime
   from pyspark.sql.functions import *

   # To make development easier, faster and less expensive down sample for now
   sampled_taxi_df = filtered_df.sample(True, 0.001, seed=1234)

   taxi_df = sampled_taxi_df.select('vendorID', 'passengerCount', 'tripDistance',  'startLon', 'startLat', 'endLon' \
                                , 'endLat', 'paymentType', 'fareAmount', 'tipAmount'\
                                , column('puMonth').alias('month_num') \
                                , date_format('tpepPickupDateTime', 'hh').alias('hour_of_day')\
                                , date_format('tpepPickupDateTime', 'EEEE').alias('day_of_week')\
                                , dayofmonth(col('tpepPickupDateTime')).alias('day_of_month')
                                ,(unix_timestamp(col('tpepDropoffDateTime')) - unix_timestamp(col('tpepPickupDateTime'))).alias('trip_time'))\
                        .filter((sampled_taxi_df.passengerCount > 0) & (sampled_taxi_df.passengerCount < 8)\
                                & (sampled_taxi_df.tipAmount >= 0)\
                                & (sampled_taxi_df.fareAmount >= 1) & (sampled_taxi_df.fareAmount <= 250)\
                                & (sampled_taxi_df.tipAmount < sampled_taxi_df.fareAmount)\
                                & (sampled_taxi_df.tripDistance > 0) & (sampled_taxi_df.tripDistance <= 200)\
                                & (sampled_taxi_df.rateCodeId <= 5)\
                                & (sampled_taxi_df.paymentType.isin({"1", "2"})))
   taxi_df.show(10)
   ```
   
As you can see, this will create a new dataframe with additional columns for the day of the month, pickup hour, weekday, and total trip time. 

![Picture of taxi dataframe.](./media/apache-spark-machine-learning-aml-notebook/aml-dataset.png)

## Generate test and validation datasets

Once we have our final dataset, we can split the data into training and test sets by using the Spark ```random_ split ``` function. Using the provided weights, this function randomly splits the data into the training dataset for model training and the validation dataset for testing.

```python
# Random split dataset using spark, convert Spark to Pandas
training_data, validation_data = taxi_df.randomSplit([0.8,0.2], 223)

```

This step ensures that the data points to test the finished model that haven't been used to train the model. 

## Connect to an Azure Machine Learning Workspace
In Azure Machine Learning, a  **Workspace** is a class that accepts your Azure subscription and resource information. It also creates a cloud resource to monitor and track your model runs. In this step, we will create a workspace object from the existing Azure Machine Learning workspace.
   
```python
from azureml.core import Workspace

# Enter your workspace subscription, resource group, name, and region.
subscription_id = "<enter your subscription ID>" #you should be owner or contributor
resource_group = "<enter your resource group>" #you should be owner or contributor
workspace_name = "<enter your workspace name>" #your workspace name
workspace_region = "<enter workspace region>" #your region

ws = Workspace(workspace_name = workspace_name,
               subscription_id = subscription_id,
               resource_group = resource_group)

```

## Convert a dataframe to an Azure Machine Learning Dataset
To submit a remote experiment, we will need to convert our dataset into an Azure Machine Learning ```TabularDatset```. A [TabularDataset](https://docs.microsoft.com/python/api/azureml-core/azureml.data.tabulardataset?view=azure-ml-py&preserve-view=true) represents data in a tabular format by parsing the provided files.

The following code gets the existing workspace and the default Azure Machine Learning default datastore. It then passes the datastore and file locations to the path parameter to create a new ```TabularDataset```. 

```python
import pandas 
from azureml.core import Dataset

# Get the AML Default Datastore
datastore = ws.get_default_datastore()
training_pd = training_data.toPandas().to_csv('training_pd.csv', index=False)

# Convert into AML Tabular Dataset
datastore.upload_files(files = ['training_pd.csv'],
                       target_path = 'train-dataset/tabular/',
                       overwrite = True,
                       show_progress = True)
dataset_training = Dataset.Tabular.from_delimited_files(path = [(datastore, 'train-dataset/tabular/training_pd.csv')])
```

![Picture of uploaded dataset.](./media/apache-spark-machine-learning-aml-notebook/upload-dataset.png)

## Submit an AutoML experiment

#### Define training settings

1. To submit an experiment, we will need to define the experiment parameter and model settings for training. You can view the full list of settings [here](https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train).

   ```python
   import logging

   automl_settings = {
       "iteration_timeout_minutes": 10,
       "experiment_timeout_minutes": 30,
       "enable_early_stopping": True,
       "primary_metric": 'r2_score',
       "featurization": 'auto',
       "verbosity": logging.INFO,
       "n_cross_validations": 2}
   ```

2. Now, we will pass the defined training settings as a \*\*kwargs parameter to an AutoMLConfig object. Since we are training in Spark, we will also have to pass the Spark Context which is automatically accessible by the ```sc``` variable. Additionally, we will specify the training data and the type of model, which is regression in this case.

   ```python
   from azureml.train.automl import AutoMLConfig

   automl_config = AutoMLConfig(task='regression',
                             debug_log='automated_ml_errors.log',
                             training_data = dataset_training,
                             spark_context = sc,
                             model_explainability = False, 
                             label_column_name ="fareAmount",**automl_settings)
   ```

> [!NOTE]
> Automated machine learning pre-processing steps (feature normalization, handling missing data, converting text to numeric, etc.) become part of the underlying model. When using the model for predictions, the same pre-processing steps applied during training are applied to your input data automatically.

#### Train the automatic regression model 
Now, we will create an experiment object in your Azure Machine Learning workspace. An experiment acts as a container for your individual runs. 

```python
from azureml.core.experiment import Experiment

# Start an experiment in Azure Machine Learning
experiment = Experiment(ws, "aml-synapse-regression")
tags = {"Synapse": "regression"}
local_run = experiment.submit(automl_config, show_output=True, tags = tags)

# Use the get_details function to retrieve the detailed output for the run.
run_details = local_run.get_details()
```

Once the experiment has completed, the output will return details about the completed iterations. For each iteration, you see the model type, the run duration, and the training accuracy. The field BEST tracks the best running training score based on your metric type.

![Screenshot of model output.](./media/apache-spark-machine-learning-aml-notebook/aml-model-output.png)

> [!NOTE]
> Once submitted, the AutoML experiment will run various iterations and model types. This run will typically take 1-1.5 hours. 

#### Retrieve the best model
To select the best model from your iterations, we will use the ```get_output``` function to return the best run and fitted model. The code below will retrieve the best run and fitted model for any logged metric or a particular iteration.

```python
# Get best model
best_run, fitted_model = local_run.get_output()
```

#### Test model accuracy

1. To test the model accuracy, we will use the best model to run taxi fare predictions on the test data set. The ```predict``` function uses the best model and predicts the values of y (fare amount) from the validation dataset. 

   ```python
   # Test best model accuracy
   validation_data_pd = validation_data.toPandas()
   y_test = validation_data_pd.pop("fareAmount").to_frame()
   y_predict = fitted_model.predict(validation_data_pd)
   ```

2. The root-mean-square error (RMSE) is a frequently used measure of the differences between sample values predicted by a model and the values observed. We will calculate the root mean squared error of the results by comparing the y_test dataframe to the values predicted by the model. 

   The function ```mean_squared_error``` takes two arrays and calculates the average squared error between them. We then take the square root of the result. This metric indicates roughly how far the taxi fare predictions are from the actual fares values.

   ```python
   from sklearn.metrics import mean_squared_error
   from math import sqrt

   # Calculate Root Mean Square Error
   y_actual = y_test.values.flatten().tolist()
   rmse = sqrt(mean_squared_error(y_actual, y_predict))

   print("Root Mean Square Error:")
   print(rmse)
   ```

   ```Output
   Root Mean Square Error:
   2.309997102577151
   ```
   
   The root-mean-square error is a good measure of how accurately the model predicts the response. From the results , you see that the model is fairly good at predicting taxi fares from the data set's features, typically within +- $2.00

3. Run the following code to calculate mean absolute percent error (MAPE). This metric expresses accuracy as a percentage of the error. It does this by calculating an absolute difference between each predicted and actual value and then summing all the differences. Then, it expresses that sum as a percent of the total of the actual values.

   ```python
   # Calculate MAPE and Model Accuracy 
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

   ```Output
   Model MAPE:
   0.03655071038487368

   Model Accuracy:
   0.9634492896151263
   ```
   From the two prediction accuracy metrics, you see that the model is fairly good at predicting taxi fares from the data set's features. 

4. After fitting a linear regression model, we will now need to determine how well the model fits the data. To do this, we will plot the actual fare values against the predicted output. In addition, we will also calculate the R-squared measure to understand how close the data is to the fitted regression line.

   ```python
   import matplotlib.pyplot as plt
   import numpy as np
   from sklearn.metrics import mean_squared_error, r2_score

   # Calculate the R2 score using the predicted and actual fare prices
   y_test_actual = y_test["fareAmount"]
   r2 = r2_score(y_test_actual, y_predict)

   # Plot the Actual vs Predicted Fare Amount Values
   plt.style.use('ggplot')
   plt.figure(figsize=(10, 7))
   plt.scatter(y_test_actual,y_predict)
   plt.plot([np.min(y_test_actual), np.max(y_test_actual)], [np.min(y_test_actual), np.max(y_test_actual)], color='lightblue')
   plt.xlabel("Actual Fare Amount")
   plt.ylabel("Predicted Fare Amount")
   plt.title("Actual vs Predicted Fare Amont R^2={}".format(r2))
   plt.show()
   ```
   
   ![Screenshot of regression plot.](./media/apache-spark-machine-learning-aml-notebook/aml-fare-amount.png)

   From the results, we can see that the R-squared measure accounts for 95% of our variance. This is also validated by the actual verses observed plot. The more variance that is accounted for by the regression model the closer the data points will fall to the fitted regression line.  

## Register model to Azure Machine Learning
Once we have validated our best model, we can register the model to Azure Machine Learning. After you register the model, you can then download or deploy the registered model and receive all the files that you registered.

```python
description = 'My AutoML Model'
model_path='outputs/model.pkl'
model = best_run.register_model(model_name = 'NYCGreenTaxiModel', model_path = model_path, description = description)
print(model.name, model.version)
```

```Output
NYCGreenTaxiModel 1
```

## View results in Azure Machine Learning
Last, you can also access the results of the iterations by navigating to the experiment in your Azure Machine Learning Workspace. Here, you will be able to dig into additional details on the status of your run, attempted models, and other model metrics. 

![Screenshot of AML workspace.](./media/apache-spark-machine-learning-mllib-notebook/apache-spark-aml-workspace.png)

## Next steps
- [Azure Synapse Analytics](https://docs.microsoft.com/azure/synapse-analytics)
- [Apache Spark MLlib Tutorial](./apache-spark-machine-learning-mllib-notebook.md)

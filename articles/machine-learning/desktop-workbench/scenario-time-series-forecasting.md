---
title: Energy Demand Time Series Forecasting | Microsoft Docs
description: How to apply machine learning to forecast energy demand time series in Azure Machine Learning Workbench.
services: machine-learning
documentationcenter: ''
author: anta
manager: ireiter
editor: anta

ms.assetid: 
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/15/2017
ms.author: anta

ROBOTS: NOINDEX
---


# Energy Demand Time Series Forecasting

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 




Time series forecasting is the task of predicting future values in a time-ordered sequence of observations. It is a common problem and has applications in many industries. For example, retail companies need to forecast future product sales so they can effectively organize their supply chains to meet demand. Similarly, package delivery companies need to estimate the demand for their services so they can plan workforce requirements and delivery routes ahead of time. In many cases, the financial risks of inaccurate forecasts can be significant. Therefore, forecasting is often a business critical activity.

This sample shows how time series forecasting can be performed through applying machine learning techniques. You are guided through every step of the modeling process including:
- Data preparation to clean and format the data;
- Creating features for the machine learning models from raw time series data;
- Training various machine learning models;
- Evaluating the models by comparing their performance on a held-out test dataset; and,
- Operationalizing the best model, making it available through a web service to generate forecasts on demand.

Azure Machine Learning Workbench aids the modeling process at every step: 
- The sample shows how the Jupyter notebook environment - available directly from through Workbench - can make developing Python code easier. The model development process can be explained to others more clearly using markdown annotations and charts. These notebooks can be viewed, edited, and executed directly from the Workbench.
- Trained models can be persisted and uploaded to blob storage. This helps the data scientist to keep track of trained model objects and ensure they are retained and retrievable when needed.
- Metrics can be logged while executing a Python script, enabling the data scientist to keep a record of model performance scores.
- The workbench produces customizable tables of logged metrics allowing the data scientist to easily compare model performance metrics. Charts are automatically displayed so the best performing model can be readily identified.
- Finally, the sample shows how a trained model can be operationalized by deploying it in a realtime web service.

## Link to the Gallery GitHub repository
The public GitHub repository for this real world scenario contains all materials, including code samples, needed for this example:

[https://github.com/Azure/MachineLearningSamples-EnergyDemandTimeSeriesForecasting](https://github.com/Azure/MachineLearningSamples-EnergyDemandTimeSeriesForecasting)


## Use case overview

This scenario focuses on energy demand forecasting where the goal is to predict the future load on an energy grid. It is a critical business operation for companies in the energy sector as operators need to maintain the fine balance between the energy consumed on a grid and the energy supplied to it. Too much power supplied to the grid can result in waste of energy or technical faults. However, if too little power is supplied it can lead to blackouts, leaving customers without power. Typically, grid operators can take short-term decisions to manage energy supply to the grid and keep the load in balance. An accurate short-term forecast of energy demand is therefore essential for the operator to make these decisions with confidence.

This scenario details the construction of a machine learning energy demand forecasting solution. The solution is trained on a public dataset from the [New York Independent System Operator (NYISO)](http://www3.dps.ny.gov/W/PSCWeb.nsf/All/298372E2CE4764E885257687006F39DF?OpenDocument), which operates the power grid for New York State. The dataset includes hourly power demand data for New York City over a period of five years. An additional dataset containing hourly weather conditions in New York City over the same time period was taken from [darksky.net](https://darksky.net).

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/) (free trials are available).
- An installed copy of [Azure Machine Learning Workbench](../service/overview-what-is-azure-ml.md) following the [quick start installation guide](quickstart-installation.md) to install the program and create a workspace.
- This sample assumes that you are running Azure ML Workbench on Windows 10 with [Docker engine](https://www.docker.com/) locally installed. If you are using macOS, the instructions are largely the same.
- Azure Machine Learning Operationalization installed with a local deployment environment set up and a model management account created as described in this  [guide](./model-management-configuration.md).
- This sample requires that you update the Pandas installation to version 0.20.3 or higher and install matplotlib. Click *Open Command Prompt* from the *File* menu in the Workbench and run the following commands to install these dependencies:

    ```
    conda install "pandas>=0.21.1"
    ```
    
## Create a new Workbench project

Create a new project using this example as a template:
1.	Open Azure Machine Learning Workbench
2.	On the **Projects** page, click the **+** sign and select **New Project**
3.	In the **Create New Project** pane, fill in the information for your new project
4.	In the **Search Project Templates** search box, type "Energy Demand Time Series Forecasting" and select the template
5.	Click **Create**


## Data description

Two datasets are provided with this sample and are downloaded using the `1-data-preparation.ipynb` notebook: `nyc_demand.csv` and `nyc_weather.csv`.

**nyc_demand.csv** contains hourly energy demand values for New York City for the years 2012-2017. The data has the following simple structure:

| timeStamp | demand |
| --- | --- |
| 2012-01-01 00:00:00 |	4937.5 |
| 2012-01-01 01:00:00 |	4752.1 |
| 2012-01-01 02:00:00 | 4542.6 |
| 2012-01-01 03:00:00 | 4357.7 |

Demand values are in megawatt-hours (MWh). Below is a chart of energy demand over a 7-day period in July 2017:

![Energy demand](./media/scenario-time-series-forecasting/energy_demand.png  "Energy demand")

**nyc_weather.csv** contains hourly weather values for New York City over the years 2012-2017:

| timeStamp	| precip | temp
| --- | --- | --- |
| 2012-01-01 00:00:00 | 0.0 | 46.13 |
| 2012-01-01 01:00:00 | 0.01 | 45.89 |
| 2012-01-01 02:00:00 | 0.05 | 45.04 |
| 2012-01-01 03:00:00 | 0.02 | 45.03 |

*precip* is a percentage measure of the level of precipitation. *temp* (temperature) values have been rescaled such that all values fall in the interval [0, 100].

## Scenario structure

When you open this project for the first time in Azure Machine Learning Workbench, navigate to the *Files* pane on the left-hand side. The following code files are provided with this sample:
- `1-data-preparation.ipynb` - this Jupyter notebook downloads and processes the data to prepare it for modeling. This is the first notebook you will run.
- `2-linear-regression.ipynb` - this notebook trains a linear regression model on the training data.
- `3-ridge.ipynb` - trains a ridge regression model.
- `4-ridge-poly2.ipynb` - trains a ridge regression model on polynomial features of degree 2.
- `5-mlp.ipynb` - trains a multi-layer perceptron neural network.
- `6-dtree.ipynb` - trains a decision tree model.
- `7-gbm.ipynb` - trains a gradient boosted machine model.
- `8-evaluate-model.py` - this script loads a trained model and uses it to make predictions on a held-out test dataset. It produces model evaluation metrics so the performance of different models can be compared.
- `9-forecast-output-exploration.ipynb` - this notebook produces visualizations of the forecasts generated by the machine learning models.
- `10-deploy-model.ipynb` - this notebook demonstrates how a trained forecasting model can be operationalized in a realtime web service.
- `evaluate-all-models.py` - this script evaluates all trained models. It provides an alternative to running `8-evaluate-model.py` for each trained model individually.

### 1. Data preparation and cleaning

To start running the sample, first click on `1-data-preparation.ipynb` to open the notebook in preview mode. Click on ***Start Notebook Server*** to start a Jupyter notebook server and Python kernel on your machine. You can either run the notebooks from within the Workbench, or you can use your browser by navigating to [http://localhost:8888](http://localhost:8888). Note that you must change the kernel to *PROJECT_NAME local*. You can do this from the *Kernel* menu in the notebook under *Change kernel*. Press ***shift+Enter*** to run the code in individual notebook cells, or click *Run All* in the *Cell* menu to run the entire notebook.

The notebook first downloads the data from a blob storage container hosted on Azure. The data is then stored on your machine in the `AZUREML_NATIVE_SHARE_DIRECTORY`. This location is accessible from any notebooks or scripts you run from the Workbench so is a good place to store data and trained models.

Once the data has been downloaded, the notebook cleans the data by filling gaps in the time series and filling missing values by interpolation. Cleaning the time series data in this way maximizes the amount of data available for training the models.

Several model features are created from the cleaned raw data. These features can be categorized into two groups:

- **Time driven features** are derived from the *timestamp* variable e.g. *month*, *dayofweek* and *hour*.
- **Lagged features** are time shifted values of the actual demand or temperature values. These features aim to capture the conditional dependencies between consecutive time periods in the model.

The resulting feature dataset can then be used when developing forecasting models.

### 2. Model development

A first modeling approach may be a simple linear regression model. The `2-linear-regression.ipynb` notebook shows how to train a linear regression forecast model for future energy demand. In particular, the model will be trained to predict energy demand one hour (*t+1*) ahead of the current time period (*t*). However, we can apply this 'one-step' model recursively at test time to generate forecasts for future time periods, *t+n*.

To train a model, a predictive pipeline is created which involves three distinct steps:

- **A data transformation**: the required formats for input data can vary depending on the machine learning algorithm. In this case, the linear regression model requires categorical variables to be one-hot encoded.
- **A cross validation routine**: Often a machine learning model will have one or more hyperparameters that need to be tuned through experimentation. Cross validation can be used to find the optimal set of parameter values. The model is repeatedly trained and evaluated on different folds of the dataset. The best parameters are those that achieve the best model performance when averaged across the cross validation folds. This process is explained in more detail in `2-linear-regression.ipynb`.
- **Training the final model**: The model is trained on the whole dataset, using the best set of hyperparameters.

We have included a series of 6 different models in notebooks numbered 2-7. Each notebook trains a different model and stores it in the `AZUREML_NATIVE_SHARE_DIRECTORY` location. Once you have trained all the models developed for this scenario, we can evaluate and compare them as decribed in the next section.

### 3. Model evaluation and comparison

We can use a trained model to make forecasts for future time periods. It is best to evaluate these models on a held-out test dataset. By evaluating the different models on the same unseen dataset, we can fairly compare their performance and identify the best model. In this scenario, we apply the trained model recursively to forecast multiple time steps into the future. In particular, we generate forecasts for up to six hours, *t+6* ahead of the current hour, *t*. These predictions are evaluated against the actual demand observed for each time period.

To evaluate a model, open the `8-evaluate-model.py` script from the *Files* pane in the Workbench. Check that *Run Configuration* is set to **local** and then type the model name into the *Arguments* field. The model name needs to match exactly the *model_name* variable set at the start of the notebook in which the model is trained. For example, enter "linear_regression" to evaluate the trained linear regression model. Alternatively, once all models have been trained, you can evaluate them all with one command by running `evaluate-all-models.py`. To run this script, open a command prompt from the Workbench and execute the following command:

```
python evaluate-all-models.py
```
The `8-evaluate-model.py` script performs the following operations:

- Loads a trained model pipeline from disk
- Makes predictions on the test dataset
- Computes model performance metrics and logs them
- Saves the test dataset predictions to `AZUREML_NATIVE_SHARE_DIRECTORY` for later inspection and analysis
- Saves the trained model pipeline to the *outputs* folder.

> [!Note]
> Saving the model to the *outputs* folder automatically copies the model object into the Azure Blob Storage account associated with your Experimentation account. This means you will always be able to retrieve the saved model object from the blob, even if you change machine or compute context.

Navigate to the *Run History* pane and click on `8-evaluate-model.py`. You will see charts displaying several model performance metrics:

- **ME**: mean error of the forecast. This can be interpreted as the average bias of the forecast.
- **MPE**: [mean percentage error](https://en.wikipedia.org/wiki/Mean_percentage_error) (ME expressed as a percentage of the actual demand)
- **MSE**: [mean squared error](https://en.wikipedia.org/wiki/Mean_squared_error)
- **RMSE**: root mean squared error (the square root of MSE)
- **MAPE**: [mean absolute percentage error](https://en.wikipedia.org/wiki/Mean_absolute_percentage_error)
- **sMAPE**: [symmetric mean absolute percentage error](https://en.wikipedia.org/wiki/Symmetric_mean_absolute_percentage_error)
- **MAPE_base**: MAPE of a baseline forecast in which the prediction equals the last known demand value.
- **MdRAE**: Median Relative Absolute Error. The median ratio of the forecast error to the baseline forecast error. A value less than 1 means the forecast is performing better than the baseline.

All metrics above refer to the *t+1* forecast. In addition to the above metrics, you will also see a set of corresponding metrics with the *_horizon* suffix. This is the metric averaged over all periods in the forecast range from period *t+1* to period *t+6*.

If metrics are not displaying in the chart area, click on the gear symbol in the top right-hand corner. Ensure that the model performance metrics you are interested in are checked. The metrics will also appear in a table below the charts. Again, this table is customizable be clicking on the gear symbol. Sort the table by a performance metric to identify the best model. If you are interested in seeing how the forecast performance varies from period *t+1* to *t+6*, click on the entry for the model in the table. Charts displaying the MAPE, MPE and MdRAE metrics across the forecast period are shown under *Visualizations*.

When evaluating forecasting models, it can be very useful to visualize the output predictions. This helps the data scientist to determine whether the forecast produced appears realistic. It can also help to identify problems in the forecast if, for example, the forecast performs poorly in certain time periods. The `9-forecast-output-exploration.ipynb` notebook will produce visualizations of the forecasts generated for the test dataset.

### 4. Deployment

The best model can be operationalized by deploying it as a realtime web service. This web service can then be invoked to generate forecasts on demand as new data becomes available. In this scenario, a new forecast needs to be generated every hour to predict the energy demand in the subsequent hour. To perform this task, a web service can be deployed which takes an array of features for a given hour time period as input and returns the predicted demand as output.

In this sample, a web service is deployed to a Windows 10 machine. Ensure you have completed the prerequisite steps for local deployment set out in this [getting started guide](https://github.com/Azure/Machine-Learning-Operationalization/blob/master/documentation/getting-started.md) for the Operationalization CLI. Once you have set up your local environment and model management account, run the `10-deploy-model.ipynb` notebook to deploy the web service.

## Conclusion

This sample demonstrates how to build an end-to-end time series forecasting solution for the purposes of forecasting energy demand. Many of the principles explored in this sample can be extended to other forecasting scenarios and industries.

This scenario shows how Azure Machine Learning Workbench can assist a data scientist in developing real world solutions with useful features such as the Jupyter notebook environment and metric logging capabilities. The sample also guides the reader on how a model can be operationalized and deployed using Azure Machine Learning Operationalization CLI. Once deployed, the web service API allows developers or data engineers to integrate the forecasting model into a wider data pipeline.

---
title: Time Series Forecasting with Azure Machine Learning Workbench | Microsoft Docs
description: How to apply machine learning to time series forecasting in Azure Machine Learning Workbench.
services: machine-learning
documentationcenter: ''
author: anta
manager: ireiter
editor: anta

ms.assetid: 
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/15/2017
ms.author: anta

---

# Time Series Forecasting

## Link of the Gallery GitHub repository
The public GitHub repository for this real world scenario contains all materials, including code samples, needed for this example:

[https://github.com/Azure/MachineLearningSamples-EnergyDemandTimeSeriesForecasting](https://github.com/Azure/MachineLearningSamples-EnergyDemandTimeSeriesForecasting)

## Introduction

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

## Use Case Overview

This scenario focuses on energy demand forecasting where the goal is to predict the future load on an energy grid. It is a critical business operation for companies in the energy sector as operators need to maintain the fine balance between the energy consumed on a grid and the energy supplied to it. Too much power supplied to the grid can result in waste of energy or technical faults. However, if too little power is supplied it can lead to blackouts, leaving customers without power. Typically, grid operators can take short-term decisions to manage energy supply to the grid and keep the load in balance. An accurate short-term forecast of energy demand is therefore essential for the operator to make these decisions with confidence.

This scenario details the construction of a machine learning energy demand forecasting solution. The solution is trained on a public dataset from the [New York Independent System Operator (NYISO)](http://www3.dps.ny.gov/W/PSCWeb.nsf/All/298372E2CE4764E885257687006F39DF?OpenDocument), which operates the power grid for New York State. The dataset includes hourly power demand data for New York City over a period of five years. An additional dataset containing hourly weather conditions in New York City over the same time period was taken from [darksky.net](https://darksky.net).

## Prerequisites

- An [Azure account](https://azure.microsoft.com/en-us/free/) (free trials are available).
- An installed copy of [Azure Machine Learning Workbench](./overview-what-is-azure-ml) following the [quick start installation guide](./quick-start-installation) to install the program and create a workspace.
- This sample assumes that you are running Azure ML Workbench on Windows 10 with [Docker engine](https://www.docker.com/) locally installed. If you are using macOS, the instruction is largely the same.
- Azure Machine Learning Operationalization. See here for [installation](https://github.com/Azure/Machine-Learning-Operationalization/blob/master/documentation/install-on-windows.md) on Windows 10.
- This sample requires that you update the Pandas installation to version 0.20.3 or higher. Run the following command in the CLI to upgrade the package.
    ```azure-cli
    conda install pandas>=0.20.3
    ```

## Data Description

There are two datasets: `nyc_demand.csv` and `nyc_weather.csv`:

**nyc_demand.csv** contains hourly power demand values for New York City for the years 2012-2017. The data has the following simple structure:

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

## Scenario Structure

When you open this project for the first time in Azure Machine Learning Workbench, open to the Files pane on the left-hand side. The following code files are provided with this sample:
- `1-data-preparation.ipynb` - this Jupyter notebook downloads and processes the data to prepare it for modeling. This is the first notebook you will run.
- `2-linear-regression.ipynb` - this notebook trains a linear regression model on the training data.
- `3-ridge.ipynb` - trains a ridge regression model.
- `4-ridge-poly2.ipynb` - trains a ridge regression model on polynomial features of degree 2.
- `5-ridge-poly3.ipynb` - trains a ridge regression model on polynomial features of degree 3.
- `6-dtree.ipynb` - trains a decision tree model.
- `7-gbm.ipynb` - trains a gradient boosted machine model.
- `8-evaluate-model.py` - this script loads a trained model and uses it to make predictions on a held-out test dataset. It produces model evaluation metrics so the performance of different models can be compared.
- `9-forecast-output-exploration.ipynb` - this notebook produces visualizations of the forecasts generated by the machine learning models.
- `10-deploy-model.ipynb` - this notebook demonstrates how a trained forecasting model can be operationalized in a realtime web service.

### 1. Data Preparation and Cleaning

To start running the sample, first click on `1-data-preparation.ipynb` which opens the notebook in preview mode. Click on **Start Notebook Server** to start a Jupyter notebook server and Python kernel on your machine and allow you to run the code. You can either run the notebooks from within the Workbench, or you can use your browser by navigating to [http://localhost:8888](http://localhost:8888). You may be asked at this point to select the kernel, in which case select the local kernel. Press ***shift+Enter*** to run the code in the notebook cells.

The notebook first downloads the data from a blob storage container hosted on Azure. The data is then stored on your machine in the `AZUREML_NATIVE_SHARE_DIRECTORY`. This location is accessible from any notebooks or scripts you run from the Workbench so is a good place to store data and trained models.

Once the data has been downloaded, the notebook cleans the data by filling gaps in the time series and filling missing values by interpolation. Cleaning the time series data in this way maximizes the amount of data available for training the models.

Several model features are created from the cleaned raw data. These features can be categorized into two groups:

- **Time driven features** are derived from the *timestamp* variable e.g. *month*, *dayofweek* and *hour*
- **Lagged features** are time shifted values of the actual demand or temperature values. These features aim to capture the conditional dependencies between consecutive time periods in the model.

The resulting feature dataset can then be used when developing forecasting models.

### 2. Model Development

A first model approach may be a simple linear regression model. The `2-linear-regression.ipynb` notebook shows how to train a linear regression forecast model for future energy demand. In particular, the model will be trained to predict energy demand one hour (***t+1***) ahead of the current time period (***t***).

To train a model, a predictive pipeline is created which involves three distinct steps:

- **A data transformation**: the required formats for input data can vary depending on the machine learning algorithm. In this case, the linear regression model requires categorical variables to be one-hot encoded.
- **A cross validation routine**: Often a machine learning model will have one or more hyperparameters that need to be tuned through experimentation. Cross validation can be used to find the optimal set of parameter values. The model is repeatedly trained and evaluated on different folds of the dataset. The best parameters are those that achieve the best model performance when averaged across the cross validation folds. This process is explained in more detail in `2-linear-regression.ipynb`.
- **Training the final model**: The model is trained on the whole dataset, using the best set of hyperparameters.

We have included a series of 6 different models in notebooks numbered 2-7. Each notebook trains a different model and stores it in the `AZUREML_NATIVE_SHARE_DIRECTORY` location. Once you have trained all the models developed for this scenario, we can evaluate and compare them as decribed in the next section.

### 3. Model Evaluation & Comparison

We can use a trained model to make forecasts for some future time period. It is best to evaluate these models on a held-out test dataset. By evaluating the different models on the same unseen dataset, we can fairly compare their performance and identify the best model.

To evaluate a model, open the `8-evaluate-model.py` script from the File explorer pane in the Workbench. Check that *Run Configuration* is set to **local** and then type the model name into the *Arguments* field. The model name needs to match exactly the *model_name* variable set at the start of the notebook in which the model is trained. For example, the screenshot below shows how to execute the script to evaluate the *linear_regression* model. Click *Run* to execute the script.

![Run 8-evaluate-model.py](./media/scenario-time-series-forecasting/run_script.png  "Run 8-evaluate-model.py")

The script performs several operations:

- Loads a trained model pipeline from disk
- Makes predictions on the test dataset
- Computes model performance metrics and logs them
- Saves the test dataset predictions to `AZUREML_NATIVE_SHARE_DIRECTORY` for later inspection and analysis
- Saves the trained model pipeline to the *Outputs* folder.

> [!Note]
> Saving the model to the *Outputs* folder automatically copies the model object into the Azure Blob Storage account associated with your Experimentation account. This means you will always be able to retrieve the saved model object associated with a script run. See [here](https://github.com/Azure/ViennaDocs/blob/master/Documentation/PersistingChanges.md) for more details on object persistence in Azure Machine Learning Workbench.

To compare the performance of multiple trained models, run the script repeatly using different model names as the script argument. Now navigate to the *Run History* pane and click on `8-evaluate-model.py`. You will see charts displaying three model performance metrics:

- **MSE**: [mean squared error](https://en.wikipedia.org/wiki/Mean_squared_error)
- **RMSE**: root mean squared error (the square root of MSE)
- **MAPE**: [mean absolute percentage error](https://en.wikipedia.org/wiki/Mean_absolute_percentage_error)

If metrics are not displaying in the chart area, click on the gear symbol in the top right-hand corner. Ensure that the model performance metrics you are interested in are checked. The metrics will also appear in a table below the charts. Again, this table is customizable be clicking on the gear symbol. Sort the table by a performance metric to identify the best model.

When evaluating forecasting models, it can be very useful to visualize the output predictions. This helps the data scientist to determine whether the forecast produced appears realistic. It can also help to identify problems in the forecast if, for example, the forecast performs poorly in certain time periods. The `9-forecast-output-exploration.ipynb` notebook will produce visualizations of the forecasts generated for the test dataset.

### 4. Deployment

The best model can be operationalized by deploying it as a realtime web service. This web service can then be invoked to generate forecasts on demand as new data becomes available. In this scenario, a new forecast needs to be generated every hour to predict the energy demand in the subsequent hour. To perform this task, a web service can be deployed which takes an array of features for a given hour time period as input and returns the predicted demand as output.

In this sample, a web service is deployed to a Windows 10 machine. Ensure you have completed the prerequisite steps set out in the [installation guide](https://github.com/Azure/Machine-Learning-Operationalization/blob/master/documentation/install-on-windows.md) for the Operationalization CLI. Follow the instructions under **Set up the Azure Machine Learning environment for local mode deployment**. Once you have set up your environment for local deployment, run the `10-deploy-model.ipynb` notebook to deploy the web service.

## Conclusion

This sample demonstrates how to build an end-to-end time series forecasting solution for the purposes of forecasting energy demand. Many of the principles explored in this sample can be extended to other forecasting scenarios and industries.

This scenario shows how the Azure Machine Learning Workbench can assist a data scientist in developing real world solutions with useful features such as the Jupyter notebook environment and metric logging capabilities. The sample also guides the reader on how the best model can be operationalized and deployed using Azure Machine Learning Operationalization CLI. Once deployed, the web service API allows developers or data engineers to integrate the forecasting model into a wider data pipeline.
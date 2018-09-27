---
title: Azure Machine Learning Model Data Collection API reference | Microsoft Docs
description: Azure Machine Learning Model Data Collection API reference.
services: machine-learning
author: aashishb
ms.author: aashishb
manager: hjerez
ms.reviewer: jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 09/12/2017

ROBOTS: NOINDEX
---
# Azure Machine Learning Model Data Collection API reference

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 

Model data collection allows you to archive model inputs and predictions from a machine learning web service. See the [model data collection how-to guide](how-to-use-model-data-collection.md) to understand how to install `azureml.datacollector` on your Windows and Linux machine.

In this API reference guide, we use a step-by-step approach on how to collect model inputs and predictions from a machine learning web service.

## Enable model data collection in Azure ML Workbench environment

 Look for conda\_dependencies.yml file in your project under the aml_config folder and have your conda\_dependencies.yml file include the azureml.datacollector module under the pip section as shown below. Note that this is only a subsection of a full conda\_dependencies.yml file:

    dependencies:
      - python=3.5.2
      - pip:
        - azureml.datacollector==0.1.0a13

>[!NOTE] 
>Currently, you can use the data collector module in Azure ML Workbench by running in docker mode. Local mode may not work for all environments.




## Enable model data collection in the scoring file

In the scoring file that is being used for operationalization, import the data collector module and ModelDataCollector class:

    from azureml.datacollector import ModelDataCollector


## Model data collector instantiation
Instantiate a new instance of a ModelDataCollector:

    dc = ModelDataCollector(model_name, identifier='default', feature_names=None, model_management_account_id='unknown', webservice_name='unknown', model_id='unknown', model_version='unknown')

See Class and Parameter details:

### Class
| Name | Description |
|--------------------|--------------------|
| ModelDataCollector | A class in azureml.datacollector namespace. An instance of this class will be used to collect model data. A single scoring file can contain multiple ModelDataCollectors. Each instance should be used for collecting data in one discrete location in the scoring file so that the schema of collected data remains consistent (that is, inputs and prediction)|


### Parameters

| Name | Type | Description |
|-------------|------------|-------------------------|
| model_name | string | the name of the model which data is being collected for |
| identifier | string | the location in code that identifies this data, i.e. 'RawInput' or 'Prediction' |
| feature_names | list of strings | a list of feature names that become the csv header when supplied |
| model_management_account_id | string | the identifier for the model management account where this model is stored. This is populated automatically when models are operationalized through AML |
| webservice_name | string | the name of the webservice to which this model is currently deployed. This is populated automatically when models are operationalized through AML |
| model_id | string | The unique identifier for this model in the context of a model management account. this is populated automatically when models are operationalized through AML |
| model_version | string | the version number of this model in the context of a model management account. This is populated automatically when models are operationalized through AML |



 

## Collecting the model data

You can collect the model data using an instance of the ModelDataCollector created above.

    dc.collect(input_data, user_correlation_id="")

See Method and Parameter details:

### Method
| Name | Description |
|--------------------|--------------------|
| collect | Used to collect the data for a model input or prediction|


### Parameters

| Name | Type | Description |
|-------------|------------|-------------------------|
| input_data | multiple types | the data to be collected (currently accepts the types list, numpy.array, pandas.DataFrame, pyspark.sql.DataFrame). For dataframe types, if a header exists with feature names, this information is included in the data destination (without needing to explicitly pass feature names in the ModelDataCollector constructor) |
| user_correlation_id | string | an optional correlation id, which can be provided by the user to correlate this prediction |


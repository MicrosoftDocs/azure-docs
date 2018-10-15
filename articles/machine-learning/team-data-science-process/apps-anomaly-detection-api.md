---
title: Azure Machine Learning Anomaly Detection API | Microsoft Docs
description: Anomaly Detection API is an example built with Microsoft Azure Machine Learning that detects anomalies in time series data with numerical values that are uniformly spaced in time.
services: machine-learning
documentationcenter: ''
author: alokkirpal
manager: jhubbard
editor: cgronlun

ms.assetid: 52fafe1f-e93d-47df-a8ac-9a9a53b60824
ms.service: machine-learning
ms.component: team-data-science-process
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 06/05/2017
ms.author: alok

---

# Machine Learning Anomaly Detection API
## Overview
[Anomaly Detection API](https://gallery.cortanaintelligence.com/MachineLearningAPI/Anomaly-Detection-2) is an example built with Azure Machine Learning that detects anomalies in time series data with numerical values that are uniformly spaced in time.

This API can detect the following types of anomalous patterns in time series data:

* **Positive and negative trends**: For example, when monitoring memory usage in computing an upward trend may be of interest as it may be indicative of a memory leak,
* **Changes in the dynamic range of values**: For example, when monitoring the exceptions thrown by a cloud service, any changes in the dynamic range of values could indicate instability in the health of the service, and
* **Spikes and Dips**: For example, when monitoring the number of login failures in a service or number of checkouts in an e-commerce site, spikes or dips could indicate abnormal behavior.

These machine learning detectors track such changes in values over time and report ongoing changes in their values as anomaly scores. They do not require adhoc threshold tuning and their scores can be used to control false positive rate. The anomaly detection API is useful in several scenarios like service monitoring by tracking KPIs over time, usage monitoring through metrics such as number of searches, numbers of clicks, performance monitoring through counters like memory, CPU, file reads, etc. over time.

The Anomaly Detection offering comes with useful tools to get you started.

* The [web application](http://anomalydetection-aml.azurewebsites.net/) helps you evaluate and visualize the results of anomaly detection APIs on your data.

> [!NOTE]
> Try **IT Anomaly Insights solution** powered by [this API](https://gallery.cortanaintelligence.com/MachineLearningAPI/Anomaly-Detection-2)
> 
> To get this end to end solution deployed to your Azure subscription <a href="https://gallery.cortanaintelligence.com/Solution/Anomaly-Detection-Pre-Configured-Solution-1" target="_blank">**Start here >**</a>
> 
>

## API Deployment
In order to use the API, you must deploy it to your Azure subscription where it will be hosted as an Azure Machine Learning web service.  You can do this from the [Azure AI Gallery](https://gallery.cortanaintelligence.com/MachineLearningAPI/Anomaly-Detection-2).  This will deploy two AzureML Web Services (and their related resources) to your Azure subscription - one for anomaly detection with seasonality detection, and one without seasonality detection.  Once the deployment has completed, you will be able to manage your APIs from the [AzureML web services](https://services.azureml.net/webservices/) page.  From this page, you will be able to find your endpoint locations, API keys, as well as sample code for calling the API.  More detailed instructions are available [here](https://docs.microsoft.com/azure/machine-learning/machine-learning-manage-new-webservice).

## Scaling the API
By default, your deployment will have a free Dev/Test billing plan which includes 1,000 transactions/month and 2 compute hours/month.  You can upgrade to another plan as per your needs.  Details on the pricing of different plans are available [here](https://azure.microsoft.com/pricing/details/machine-learning/) under "Production Web API pricing".

## Managing AML Plans 
You can manage your billing plan [here](https://services.azureml.net/plans/).  The plan name will be based on the resource group name you chose when deploying the API, plus a string that is unique to your subscription.  Instructions on how to upgrade your plan are available [here](https://docs.microsoft.com/azure/machine-learning/machine-learning-manage-new-webservice) under the "Managing billing plans" section.

## API Definition
The web service provides a REST-based API over HTTPS that can be consumed in different ways including a web or mobile application, R, Python, Excel, etc.  You send your time series data to this service via a REST API call, and it runs a combination of the three anomaly types described below.

## Calling the API
In order to call the API, you will need to know the endpoint location and API key.  Both of these, along with sample code for calling the API, are available from the [AzureML web services](https://services.azureml.net/webservices/) page.  Navigate to the desired API, and then click the "Consume" tab to find them.  Note that you can call the API as a Swagger API (i.e. with the URL parameter `format=swagger`) or as a non-Swagger API (i.e. without the `format` URL parameter).  The sample code uses the Swagger format.  Below is an example request and response in non-Swagger format.  These examples are to the seasonality endpoint.  The non-seasonality endpoint is similar.

### Sample Request Body
The request contains two objects: `Inputs` and `GlobalParameters`.  In the example request below, some parameters are sent explicitly while others are not (scroll down for a full list of parameters for each endpoint).  Parameters that are not sent explicitly in the request will use the default values given below.

	{
                "Inputs": {
                        "input1": {
                                "ColumnNames": ["Time", "Data"],
                                "Values": [
                                        ["5/30/2010 18:07:00", "1"],
                                        ["5/30/2010 18:08:00", "1.4"],
                                        ["5/30/2010 18:09:00", "1.1"]
                                ]
                        }
                },
		"GlobalParameters": {
			"tspikedetector.sensitivity": "3",
			"zspikedetector.sensitivity": "3",
			"bileveldetector.sensitivity": "3.25",
			"detectors.spikesdips": "Both"
		}
	}

### Sample Response
Note that, in order to see the `ColumnNames` field, you must include `details=true` as a URL parameter in your request.  See the tables below for the meaning behind each of these fields.

	{
		"Results": {
			"output1": {
				"type": "table",
				"value": {
					"Values": [
						["5/30/2010 6:07:00 PM", "1", "1", "0", "0", "-0.687952590518378", "0", "-0.687952590518378", "0", "-0.687952590518378", "0"],
						["5/30/2010 6:08:00 PM", "1.4", "1.4", "0", "0", "-1.07030497733224", "0", "-0.884548154298423", "0", "-1.07030497733224", "0"],
						["5/30/2010 6:09:00 PM", "1.1", "1.1", "0", "0", "-1.30229513613974", "0", "-1.173800281031", "0", "-1.30229513613974", "0"]
					],
					"ColumnNames": ["Time", "OriginalData", "ProcessedData", "TSpike", "ZSpike", "BiLevelChangeScore", "BiLevelChangeAlert", "PosTrendScore", "PosTrendAlert", "NegTrendScore", "NegTrendAlert"],
					"ColumnTypes": ["DateTime", "Double", "Double", "Double", "Double", "Double", "Int32", "Double", "Int32", "Double", "Int32"]
				}
			}
		}
	}


## Score API
The Score API is used for running anomaly detection on non-seasonal time series data. The API runs a number of anomaly detectors on the data and returns their anomaly scores. 
The figure below shows an example of anomalies that the Score API can detect. This time series has 2 distinct level changes, and 3 spikes. The red dots show the time at which the level change is detected, while the black dots show the detected spikes.
![Score API][1]

### Detectors
The anomaly detection API supports detectors in 3 broad categories. Details on specific input parameters and outputs for each detector can be found in the following table.

| Detector Category | Detector | Description | Input Parameters | Outputs |
| --- | --- | --- | --- | --- |
| Spike Detectors |TSpike Detector |Detect spikes and dips based on far the values are from first and third quartiles |*tspikedetector.sensitivity:* takes integer value in the range 1-10, default: 3; Higher values will catch more extreme values thus making it less sensitive |TSpike: binary values – ‘1’ if a spike/dip is detected, ‘0’ otherwise |
| Spike Detectors | ZSpike Detector |Detect spikes and dips based on how far the datapoints are from their mean |*zspikedetector.sensitivity:* take integer value in the range 1-10, default: 3; Higher values will catch more extreme values making it less sensitive |ZSpike: binary values – ‘1’ if a spike/dip is detected, ‘0’ otherwise | |
| Slow Trend Detector |Slow Trend Detector |Detect slow positive trend as per the set sensitivity |*trenddetector.sensitivity:* threshold on detector score (default: 3.25, 3.25 – 5 is a reasonable range to select this from; The higher the less sensitive) |tscore: floating number representing anomaly score on trend |
| Level Change Detectors | Bidirectional Level Change Detector |Detect both upward and downward level change as per the set sensitivity |*bileveldetector.sensitivity:* threshold on detector score (default: 3.25, 3.25 – 5 is a reasonable range to select this from; The higher the less sensitive) |rpscore: floating number representing anomaly score on upward and downward level change | |

### Parameters
More detailed information on these input parameters is listed in the table below:

| Input Parameters | Description | Default Setting | Type | Valid Range | Suggested Range |
| --- | --- | --- | --- | --- | --- |
| detectors.historywindow |History (in # of data points) used for  anomaly score computation |500 |integer |10-2000 |Time-series dependent |
| detectors.spikesdips | Whether to detect only spikes, only dips, or both |Both |enumerated |Both, Spikes, Dips |Both |
| bileveldetector.sensitivity |Sensitivity for bidirectional level change detector. |3.25 |double |None |3.25-5 (Lesser values mean more sensitive) |
| trenddetector.sensitivity |Sensitivity for positive trend detector. |3.25 |double |None |3.25-5 (Lesser values mean more sensitive) |
| tspikedetector.sensitivity |Sensitivity for TSpike Detector |3 |integer |1-10 |3-5 (Lesser values mean more sensitive) |
| zspikedetector.sensitivity |Sensitivity for ZSpike Detector |3 |integer |1-10 |3-5 (Lesser values mean more sensitive) |
| postprocess.tailRows |Number of the latest data points to be kept in the output results |0 |integer |0 (keep all data points), or specify number of points to keep in results |N/A |

### Output
The API runs all detectors on your time series data and returns anomaly scores and binary spike indicators for each point in time. The table below lists outputs from the API. 

| Outputs | Description |
| --- | --- |
| Time |Timestamps from raw data, or aggregated (and/or) imputed data if aggregation (and/or) missing data imputation is applied |
| Data |Values from raw data, or aggregated (and/or) imputed data if aggregation (and/or) missing data imputation is applied |
| TSpike |Binary indicator to indicate whether a spike is detected by TSpike Detector |
| ZSpike |Binary indicator to indicate whether a spike is detected by ZSpike Detector |
| rpscore |A floating number representing anomaly score on bidirectional level change |
| rpalert |1/0 value indicating there is a bidirectional level change anomaly based on the input sensitivity |
| tscore |A floating number representing anomaly score on positive trend |
| talert |1/0 value indicating there is a positive trend anomaly based on the input sensitivity |

## ScoreWithSeasonality API
The ScoreWithSeasonality API is used for running anomaly detection on time series that have seasonal patterns. This API is useful to detect deviations in seasonal patterns.  
The following figure shows an example of anomalies detected in a seasonal time series. The time series has one spike (the 1st black dot), two dips (the 2nd black dot and one at the end), and one level change (red dot). Note that both the dip in the middle of the time series and the level change are only discernable after seasonal components are removed from the series.
![Seasonality API][2]

### Detectors
The detectors in the seasonality endpoint are similar to the ones in the non-seasonality endpoint, but with slightly different parameter names (listed below).

### Parameters

More detailed information on these input parameters is listed in the table below:

| Input Parameters | Description | Default Setting | Type | Valid Range | Suggested Range |
| --- | --- | --- | --- | --- | --- |
| preprocess.aggregationInterval |Aggregation interval in seconds for aggregating input time series |0 (no aggregation is performed) |integer |0: skip aggregation, > 0 otherwise |5 minutes to 1 day, time-series dependent |
| preprocess.aggregationFunc |Function used for aggregating data into the specified AggregationInterval |mean |enumerated |mean, sum, length |N/A |
| preprocess.replaceMissing |Values used to impute missing data |lkv (last known value) |enumerated |zero, lkv, mean |N/A |
| detectors.historywindow |History (in # of data points) used for  anomaly score computation |500 |integer |10-2000 |Time-series dependent |
| detectors.spikesdips | Whether to detect only spikes, only dips, or both |Both |enumerated |Both, Spikes, Dips |Both |
| bileveldetector.sensitivity |Sensitivity for bidirectional level change detector. |3.25 |double |None |3.25-5 (Lesser values mean more sensitive) |
| postrenddetector.sensitivity |Sensitivity for positive trend detector. |3.25 |double |None |3.25-5 (Lesser values mean more sensitive) |
| negtrenddetector.sensitivity |Sensitivity for negative trend detector. |3.25 |double |None |3.25-5 (Lesser values mean more sensitive) |
| tspikedetector.sensitivity |Sensitivity for TSpike Detector |3 |integer |1-10 |3-5 (Lesser values mean more sensitive) |
| zspikedetector.sensitivity |Sensitivity for ZSpike Detector |3 |integer |1-10 |3-5 (Lesser values mean more sensitive) |
| seasonality.enable |Whether seasonality analysis is to be performed |true |boolean |true, false |Time-series dependent |
| seasonality.numSeasonality |Maximum number of periodic cycles to be detected |1 |integer |1, 2 |1-2 |
| seasonality.transform |Whether seasonal (and) trend components shall be removed before applying anomaly detection |deseason |enumerated |none, deseason, deseasontrend |N/A |
| postprocess.tailRows |Number of the latest data points to be kept in the output results |0 |integer |0 (keep all data points), or specify number of points to keep in results |N/A |

### Output
The API runs all detectors on your time series data and returns anomaly scores and binary spike indicators for each point in time. The table below lists outputs from the API. 

| Outputs | Description |
| --- | --- |
| Time |Timestamps from raw data, or aggregated (and/or) imputed data if aggregation (and/or) missing data imputation is applied |
| OriginalData |Values from raw data, or aggregated (and/or) imputed data if aggregation (and/or) missing data imputation is applied |
| ProcessedData |Either of the following: <ul><li>Seasonally adjusted time series if significant seasonality has been detected and deseason option selected;</li><li>seasonally adjusted and detrended time series if significant seasonality has been detected and deseasontrend option selected</li><li>otherwise, this is the same as OriginalData</li> |
| TSpike |Binary indicator to indicate whether a spike is detected by TSpike Detector |
| ZSpike |Binary indicator to indicate whether a spike is detected by ZSpike Detector |
| BiLevelChangeScore |A floating number representing anomaly score on level change |
| BiLevelChangeAlert |1/0 value indicating there is a level change anomaly based on the input sensitivity |
| PosTrendScore |A floating number representing anomaly score on positive trend |
| PosTrendAlert |1/0 value indicating there is a positive trend anomaly based on the input sensitivity |
| NegTrendScore |A floating number representing anomaly score on negative trend |
| NegTrendAlert |1/0 value indicating there is a negative trend anomaly based on the input sensitivity |

[1]: ./media/apps-anomaly-detection-api/anomaly-detection-score.png
[2]: ./media/apps-anomaly-detection-api/anomaly-detection-seasonal.png


---
title: Anomaly Detector Python client library quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 11/25/2020
ms.author: mbullwin
---

Get started with the Anomaly Detector client library for Python. Follow these steps to install the package start using the algorithms provided by the service. The Anomaly Detector service enables you to find abnormalities in your time series data by automatically using the best-fitting models on it, regardless of industry, scenario, or data volume.

Use the Anomaly Detector client library for Python to:

* Detect anomalies throughout your time series data set, as a batch request
* Detect the anomaly status of the latest data point in your time series
* Detect trend change points in your data set.

[Library reference documentation](https://go.microsoft.com/fwlink/?linkid=2090370) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-anomalydetector) | [Package (PyPi)](https://pypi.org/project/azure-ai-anomalydetector/) | [Find the sample code on GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/anomalydetector/azure-ai-anomalydetector/samples)

## Prerequisites

* [Python 3.x](https://www.python.org/)
* The [Pandas data analysis library](https://pandas.pydata.org/)
* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to the Anomaly Detector API. You'll paste your key and endpoint into the code below later in the quickstart.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


## Setting up

[!INCLUDE [anomaly-detector-environment-variables](../environment-variables.md)]

### Create a new python application

 Create a new Python file and import the following libraries.

```python
import os
from azure.ai.anomalydetector import AnomalyDetectorClient
from azure.ai.anomalydetector.models import DetectRequest, TimeSeriesPoint, TimeGranularity, \
    AnomalyDetectorError
from azure.core.credentials import AzureKeyCredential
import pandas as pd
```

Create variables for your key as an environment variable, the path to a time series data file, and the Azure location of your subscription. For example, `westus2`.

```python
SUBSCRIPTION_KEY = os.environ["ANOMALY_DETECTOR_KEY"]
ANOMALY_DETECTOR_ENDPOINT = os.environ["ANOMALY_DETECTOR_ENDPOINT"]
TIME_SERIES_DATA_PATH = os.path.join("./sample_data", "request-data.csv")
```

### Install the client library

After installing Python, you can install the client library with:

```console
pip install --upgrade azure-ai-anomalydetector
```

## Object model

The Anomaly Detector client is a [AnomalyDetectorClient](https://github.com/Azure/azure-sdk-for-python/blob/0b8622dc249969c2f01c5d7146bd0bb36bb106dd/sdk/cognitiveservices/azure-cognitiveservices-anomalydetector/azure/cognitiveservices/anomalydetector/_anomaly_detector_client.py) object that authenticates to Azure using your key. The client can do anomaly detection an entire dataset using [detect_entire_series](https://github.com/Azure/azure-sdk-for-python/blob/bf9d44f2a50aea46a59c4cb83ccfccaff5e2b218/sdk/anomalydetector/azure-ai-anomalydetector/azure/ai/anomalydetector/operations/_anomaly_detector_client_operations.py#L26), or on the latest data point using [detect_last_point](https://github.com/Azure/azure-sdk-for-python/blob/bf9d44f2a50aea46a59c4cb83ccfccaff5e2b218/sdk/anomalydetector/azure-ai-anomalydetector/azure/ai/anomalydetector/operations/_anomaly_detector_client_operations.py#L87). The [detect_change_point](https://github.com/Azure/azure-sdk-for-python/blob/bf9d44f2a50aea46a59c4cb83ccfccaff5e2b218/sdk/anomalydetector/azure-ai-anomalydetector/azure/ai/anomalydetector/aio/operations_async/_anomaly_detector_client_operations_async.py#L142) function detects points that mark changes in a trend.

Time series data is sent as a series of [TimeSeriesPoints](https://github.com/Azure/azure-sdk-for-python/blob/bf9d44f2a50aea46a59c4cb83ccfccaff5e2b218/sdk/anomalydetector/azure-ai-anomalydetector/azure/ai/anomalydetector/models/_models_py3.py#L370) object. The `DetectRequest` object contains properties to describe the data `TimeGranularity` for example, and parameters for the anomaly detection.

The Anomaly Detector response is a [LastDetectResponse](/python/api/azure-cognitiveservices-anomalydetector/azure.cognitiveservices.anomalydetector.models.lastdetectresponse), [EntireDetectResponse](/python/api/azure-cognitiveservices-anomalydetector/azure.cognitiveservices.anomalydetector.models.entiredetectresponse), or [ChangePointDetectResponse](https://github.com/Azure/azure-sdk-for-python/blob/bf9d44f2a50aea46a59c4cb83ccfccaff5e2b218/sdk/anomalydetector/azure-ai-anomalydetector/azure/ai/anomalydetector/models/_models_py3.py#L107) object depending on the method used.

## Code examples

These code snippets show you how to do the following with the Anomaly Detector client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [Load a time series data set from a file](#load-time-series-data-from-a-file)
* [Detect anomalies in the entire data set](#detect-anomalies-in-the-entire-data-set)
* [Detect the anomaly status of the latest data point](#detect-the-anomaly-status-of-the-latest-data-point)
* [Detect the change points in the data set](#detect-change-points-in-the-data-set)

## Authenticate the client

Add your Azure location variable to the endpoint, and authenticate the client with your key.

```python
client = AnomalyDetectorClient(AzureKeyCredential(SUBSCRIPTION_KEY), ANOMALY_DETECTOR_ENDPOINT)
```

## Load time series data from a file

Download the example data for this quickstart from [GitHub](https://github.com/Azure-Samples/AnomalyDetector/blob/master/example-data/request-data.csv):
1. In your browser, right-click **Raw**.
2. Click **Save link as**.
3. Save the file to your application directory, as a .csv file.

This time series data is formatted as a .csv file, and will be sent to the Anomaly Detector API.

Load your data file with the Pandas library's `read_csv()` method, and make an empty list variable to store your data series. Iterate through the file, and append the data as a `TimeSeriesPoint` object. This object will contain the timestamp and numerical value from the rows of your .csv data file.

```python
series = []
data_file = pd.read_csv(TIME_SERIES_DATA_PATH, header=None, encoding='utf-8', parse_dates=[0])
for index, row in data_file.iterrows():
    series.append(TimeSeriesPoint(timestamp=row[0], value=row[1]))
```

Create a `DetectRequest` object with your time series, and the `TimeGranularity` (or periodicity) of its data points. For example, `TimeGranularity.daily`.

```python
request = DetectRequest(series=series, granularity=TimeGranularity.daily)
```

## Detect anomalies in the entire data set

Call the API to detect anomalies through the entire time series data using the client's `detect_entire_series` method. Store the returned [EntireDetectResponse](/python/api/azure-cognitiveservices-anomalydetector/azure.cognitiveservices.anomalydetector.models.entiredetectresponse) object. Iterate through the response's `is_anomaly` list, and print the index of any `true` values. These values correspond to the index of anomalous data points, if any were found.

```python
print('Detecting anomalies in the entire time series.')

try:
    response = client.detect_entire_series(request)
except AnomalyDetectorError as e:
    print('Error code: {}'.format(e.error.code), 'Error message: {}'.format(e.error.message))
except Exception as e:
    print(e)

if any(response.is_anomaly):
    print('An anomaly was detected at index:')
    for i, value in enumerate(response.is_anomaly):
        if value:
            print(i)
else:
    print('No anomalies were detected in the time series.')
```

## Detect the anomaly status of the latest data point

Call the Anomaly Detector API to determine if your latest data point is an anomaly using the client's `detect_last_point` method, and store the returned `LastDetectResponse` object. The response's `is_anomaly` value is a boolean that specifies that point's anomaly status.  

```python
print('Detecting the anomaly status of the latest data point.')

try:
    response = client.detect_last_point(request)
except AnomalyDetectorError as e:
    print('Error code: {}'.format(e.error.code), 'Error message: {}'.format(e.error.message))
except Exception as e:
    print(e)

if response.is_anomaly:
    print('The latest point is detected as anomaly.')
else:
    print('The latest point is not detected as anomaly.')
```

## Detect change points in the data set

Call the API to detect change points in the time series data using the client's `detect_change_point` method. Store the returned `ChangePointDetectResponse` object. Iterate through the response's `is_change_point` list, and print the index of any `true` values. These values correspond to the indices of trend change points, if any were found.

```python
print('Detecting change points in the entire time series.')

try:
    response = client.detect_change_point(request)
except AnomalyDetectorError as e:
    print('Error code: {}'.format(e.error.code), 'Error message: {}'.format(e.error.message))
except Exception as e:
    print(e)

if any(response.is_change_point):
    print('An change point was detected at index:')
    for i, value in enumerate(response.is_change_point):
        if value:
            print(i)
else:
    print('No change point were detected in the time series.')
```

## Run the application

Run the application with the `python` command and your file name.

[!INCLUDE [anomaly-detector-next-steps](../quickstart-cleanup-next-steps.md)]

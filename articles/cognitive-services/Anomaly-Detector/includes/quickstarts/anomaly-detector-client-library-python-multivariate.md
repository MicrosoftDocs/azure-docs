---
title: Anomaly Detector Python multivariate client library quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/29/2021
ms.author: mbullwin
---

Get started with the Anomaly Detector multivariate client library for Python. Follow these steps to install the package start using the algorithms provided by the service. The new multivariate anomaly detection APIs enable developers by easily integrating advanced AI for detecting anomalies from groups of metrics, without the need for machine learning knowledge or labeled data. Dependencies and inter-correlations between different signals are automatically counted as key factors. This helps you to proactively protect your complex systems from failures.

Use the Anomaly Detector multivariate client library for Python to:

* Detect system level anomalies from a group of time series.
* When any individual time series won't tell you much and you have to look at all signals to detect a problem.
* Predicative maintenance of expensive physical assets with tens to hundreds of different types of sensors measuring various aspects of system health.

[Library reference documentation](/python/api/azure-ai-anomalydetector/azure.ai.anomalydetector) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/anomalydetector/azure-ai-anomalydetector) | [Package (PyPi)](https://pypi.org/project/azure-ai-anomalydetector/3.0.0b3/) | [Sample code](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/anomalydetector/azure-ai-anomalydetector/samples/sample_multivariate_detect.py)

## Prerequisites

* [Python 3.x](https://www.python.org/)
* The [Pandas data analysis library](https://pandas.pydata.org/)
* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to the Anomaly Detector API. You'll paste your key and endpoint into the code below later in the quickstart.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


## Setting up

### Install the client library

After installing Python, you can install the client libraries with:

```console
pip install pandas
pip install --upgrade azure-ai-anomalydetector
```

### Create a new python application

 Create a new Python file and import the following libraries.

```python
import os
import time
from datetime import datetime

from azure.ai.anomalydetector import AnomalyDetectorClient
from azure.ai.anomalydetector.models import DetectionRequest, ModelInfo
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError
```

Create variables for your key as an environment variable, the path to a time series data file, and the Azure location of your subscription. 

> [!NOTE]
> You will always have the option of using one of two keys. This is to allow secure key rotation. For the purposes of this quickstart use the first key. 

```python
subscription_key = "ANOMALY_DETECTOR_KEY"
anomaly_detector_endpoint = "ANOMALY_DETECTOR_ENDPOINT"
```



## Code examples

These code snippets show you how to do the following with the Anomaly Detector client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [Train the model](#train-the-model)
* [Detect anomalies](#detect-anomalies)
* [Export model](#export-model)
* [Delete model](#delete-model)

## Authenticate the client

To instantiate a new Anomaly Detector client you need to pass the Anomaly Detector subscription key and associated endpoint. We'll also establish a datasource.  

To use the Anomaly Detector multivariate APIs, you need to first train your own models. Training data is a set of multiple time series that meet the following requirements:

Each time series should be a CSV file with two (and only two) columns, "timestamp" and "value" (all in lowercase) as the header row. The "timestamp" values should conform to ISO 8601; the "value" could be integers or decimals with any number of decimal places. For example:

|timestamp | value|
|-------|-------|
|2019-04-01T00:00:00Z| 5|
|2019-04-01T00:01:00Z| 3.6|
|2019-04-01T00:02:00Z| 4|
|`...`| `...` |

Each CSV file should be named after a different variable that will be used for model training. For example, "temperature.csv" and "humidity.csv". All the CSV files should be zipped into one zip file without any subfolders. The zip file can have whatever name you want. The zip file should be uploaded to Azure Blob storage. Once you generate the blob SAS (Shared access signatures) URL for the zip file, it can be used for training. Refer to this document for how to generate SAS URLs from Azure Blob Storage.

```python
class MultivariateSample():

def __init__(self, subscription_key, anomaly_detector_endpoint, data_source=None):
    self.sub_key = subscription_key
    self.end_point = anomaly_detector_endpoint

    # Create an Anomaly Detector client

    # <client>
    self.ad_client = AnomalyDetectorClient(AzureKeyCredential(self.sub_key), self.end_point)
    # </client>

    self.data_source = "YOUR_SAMPLE_ZIP_FILE_LOCATED_IN_AZURE_BLOB_STORAGE_WITH_SAS"
```

## Train the model

We'll first train the model, check the model's status while training to determine when training is complete, and then retrieve the latest model ID which we will need when we move to the detection phase.

```python
def train(self, start_time, end_time):
    # Number of models available now
    model_list = list(self.ad_client.list_multivariate_model(skip=0, top=10000))
    print("{:d} available models before training.".format(len(model_list)))
    
    # Use sample data to train the model
    print("Training new model...(it may take a few minutes)")
    data_feed = ModelInfo(start_time=start_time, end_time=end_time, source=self.data_source)
    response_header = \
    self.ad_client.train_multivariate_model(data_feed, cls=lambda *args: [args[i] for i in range(len(args))])[-1]
    trained_model_id = response_header['Location'].split("/")[-1]
    
    # Model list after training
    new_model_list = list(self.ad_client.list_multivariate_model(skip=0, top=10000))
    
    # Wait until the model is ready. It usually takes several minutes
    model_status = None
    while model_status != ModelStatus.READY and model_status != ModelStatus.FAILED:
        model_info = self.ad_client.get_multivariate_model(trained_model_id).model_info
        model_status = model_info.status
        time.sleep(10)

    if model_status == ModelStatus.FAILED:
        print("Creating model failed.")
        print("Errors:")
        if model_info.errors:
            for error in model_info.errors:
                print("Error code: {}. Message: {}".format(error.code, error.message))
        else:
            print("None")
        return None

    if model_status == ModelStatus.READY:
        # Model list after training
        new_model_list = list(self.ad_client.list_multivariate_model(skip=0, top=10000))
        print("Done.\n--------------------")
        print("{:d} available models after training.".format(len(new_model_list)))

    # Return the latest model id
    return trained_model_id
```

## Detect anomalies

Use the `detect_anomaly` and `get_dectection_result` to determine if there are any anomalies within your datasource. You will need to pass the model ID for the model that you just trained.

```python
def detect(self, model_id, start_time, end_time):
    # Detect anomaly in the same data source (but a different interval)
    try:
        detection_req = DetectionRequest(source=self.data_source, start_time=start_time, end_time=end_time)
        response_header = self.ad_client.detect_anomaly(model_id, detection_req,
                                                        cls=lambda *args: [args[i] for i in range(len(args))])[-1]
        result_id = response_header['Location'].split("/")[-1]
    
        # Get results (may need a few seconds)
        r = self.ad_client.get_detection_result(result_id)
        while r.summary.status != DetectionStatus.READY and r.summary.status != DetectionStatus.FAILED:
            r = self.ad_client.get_detection_result(result_id)
            time.sleep(2)

        if r.summary.status == DetectionStatus.FAILED:
            print("Detection failed.")
            print("Errors:")
            if r.summary.errors:
                for error in r.summary.errors:
                    print("Error code: {}. Message: {}".format(error.code, error.message))
            else:
                print("None")
            return None
    except HttpResponseError as e:
        print('Error code: {}'.format(e.error.code), 'Error message: {}'.format(e.error.message))
    except Exception as e:
        raise e
    return r
```

## Export model

> [!NOTE]
> The export command is intended to be used to allow running Anomaly Detector multivariate models in a containerized environment. This is not currently not supported for multivariate, but support will be added in the future.

If you want to export a model use `export_model` and pass the model ID of the model you want to export:

```python
def export_model(self, model_id, model_path="model.zip"):

    # Export the model
    model_stream_generator = self.ad_client.export_model(model_id)
    with open(model_path, "wb") as f_obj:
        while True:
            try:
                f_obj.write(next(model_stream_generator))
            except StopIteration:
                break
            except Exception as e:
                raise e
```

## Delete model

To delete a model use `delete_multivariate_model` and pass the model ID of the model you want to delete:

```python
def delete_model(self, model_id):

    # Delete the mdoel
    self.ad_client.delete_multivariate_model(model_id)
    model_list_after_delete = list(self.ad_client.list_multivariate_model(skip=0, top=10000))
    print("{:d} available models after deletion.".format(len(model_list_after_delete)))
```

## Run the application

Before you run the application we need to add some code to call our newly created functions.

```python
if __name__ == '__main__':
    subscription_key = "ANOMALY_DETECTOR_KEY"
    anomaly_detector_endpoint = "ANOMALY_DETECTOR_ENDPOINT"

    # Create a new sample and client
    sample = MultivariateSample(subscription_key, anomaly_detector_endpoint, data_source=None)

    # Train a new model
    model_id = sample.train(datetime(2021, 1, 1, 0, 0, 0), datetime(2021, 1, 2, 12, 0, 0))

    # Reference
    result = sample.detect(model_id, datetime(2021, 1, 2, 12, 0, 0), datetime(2021, 1, 3, 0, 0, 0))
    print("Result ID:\t", result.result_id)
    print("Result summary:\t", result.summary)
    print("Result length:\t", len(result.results))

    # Export model
    sample.export_model(model_id, "model.zip")

    # Delete model
    sample.delete_model(model_id)

```

Before running it can be helpful to check your project against the [full sample code](https://github.com/Azure-Samples/AnomalyDetector/blob/master/ipython-notebook/Multivariate%20API%20Demo%20Notebook.ipynb) that this quickstart is derived from.

We also have an [in-depth Jupyter Notebook](https://github.com/Azure-Samples/AnomalyDetector/blob/master/ipython-notebook/Multivariate%20API%20Demo%20Notebook.ipynb) to help you get started.

Run the application with the `python` command and your file name.


## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with the resource group.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

* [What is the Anomaly Detector API?](../../overview-multivariate.md)
* [Best practices when using the Anomaly Detector API.](../../concepts/best-practices-multivariate.md)
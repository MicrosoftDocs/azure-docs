---
title: Anomaly Detector Python multivariate client library quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 02/09/2023
ms.author: mbullwin
---

<a href="/python/api/azure-ai-anomalydetector/azure.ai.anomalydetector" target="_blank">Library reference documentation</a> |<a href="https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/anomalydetector/azure-ai-anomalydetector" target="_blank">Library source code</a> | <a href="https://pypi.org/project/azure-ai-anomalydetector/" target="_blank">Package (PyPi)</a> |<a href="https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/anomalydetector/azure-ai-anomalydetector/samples/sample_multivariate_detect.py" target="_blank">Find the sample code on GitHub</a>

Get started with the Anomaly Detector multivariate client library for Python. Follow these steps to install the package, and start using the algorithms provided by the service. The new multivariate anomaly detection APIs enable developers by easily integrating advanced AI for detecting anomalies from groups of metrics, without the need for machine learning knowledge or labeled data. Dependencies and inter-correlations between different signals are automatically counted as key factors. This helps you to proactively protect your complex systems from failures.

Use the Anomaly Detector multivariate client library for Python to:

* Detect system level anomalies from a group of time series.
* When any individual time series won't tell you much, and you have to look at all signals to detect a problem.
* Predicative maintenance of expensive physical assets with tens to hundreds of different types of sensors measuring various aspects of system health.

## Prerequisites

* An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
* <a href="https://www.python.org/" target="_blank">Python 3.x</a>
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and select the **Go to resource** button. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Set up

Install the client library. You can install the client library with:

```console
pip install --upgrade azure.ai.anomalydetector
```

### Create a storage account

Multivariate Anomaly Detector requires your sample file to be stored as a .zip file in Azure Blob Storage.

1. Create an <a href="https://portal.azure.com/#create/Microsoft.StorageAccount-ARM" target="_blank">Azure Storage account</a>.
2. Go to Access Control(IAM), and select **ADD** to Add role assignment.
3. Search role of **Storage Blob Data Reader**, highlight this account type and then select **Next**.
4. Select **assign access to Managed identity**, and Select **Members**, then choose the **Anomaly Detector resource** that you created earlier, then select **Review + assign**.

This configuration can sometimes be a little confusing, if you have trouble we recommend consulting our [multivariate Jupyter Notebook sample](https://github.com/Azure-Samples/AnomalyDetector/blob/master/ipython-notebook/SDK%20Sample/%F0%9F%86%95MVAD-SDK-Demo.ipynb), which walks through this process more in-depth.

### Download sample data

This quickstart uses two files for sample data `sample_data_5_3000.csv` and `5_3000.json`. These files can both be downloaded from our [GitHub sample data](https://github.com/Azure-Samples/AnomalyDetector/blob/master/sampledata/multivariate/)

 You can also download the sample data by running:

```cmd
curl "https://github.com/Azure-Samples/AnomalyDetector/blob/master/sampledata/multivariate/sample_data_5_3000.csv" --output sample_data_5_3000_.csv
```

```cmd
curl "https://github.com/Azure-Samples/AnomalyDetector/blob/master/sampledata/multivariate/5_3000.json" --output 5_3000_.json
```

### Upload sample data to Storage Account

1. Go to your Storage Account, select Containers and create a new container.
2. Select **Upload** and upload sample_data_5_3000.csv
3. Select the data that you uploaded and copy the Blob URL as you need to add it to the code sample in a few steps.

## Retrieve key and endpoint

To successfully make a call against the Anomaly Detector service, you need the following values:

|Variable name | Value |
|--------------------------|-------------|
| `ANOMALY_DETECTOR_ENDPOINT` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Example endpoint: `https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/`|
| `ANOMALY_DETECTOR_API_KEY` | The API key value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

### Create environment variables

Create and assign persistent environment variables for your key and endpoint.

# [Command Line](#tab/command-line)

```CMD
setx ANOMALY_DETECTOR_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE"
```

```CMD
setx ANOMALY_DETECTOR_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE"
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('ANOMALY_DETECTOR_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('ANOMALY_DETECTOR_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export ANOMALY_DETECTOR_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
```

```Bash
echo export ANOMALY_DETECTOR_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
```

---

### Create a new Python application

1. Create a new Python file called **sample_multivariate_detect.py**. Then open it up in your preferred editor or IDE.

2. Replace the contents of sample_multivariate_detect.py with the following code. You need to modify the paths for the variables `blob_url_path` and `local_json_file_path`.

```python
import json
import os
import time
from datetime import datetime, timezone

from azure.ai.anomalydetector import AnomalyDetectorClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError
from azure.ai.anomalydetector.models import *

blob_url_path = "Path-to-sample-file-in-your-storage-account"  # example path: https://docstest001.blob.core.windows.net/test/sample_data_5_3000.csv
local_json_file_path = "Local-path-to-sample-json-file" # example where file is in same local directory as your Python script: "5_3000.json"


class MultivariateSample:
    def __init__(self, subscription_key, anomaly_detector_endpoint):
        self.sub_key = subscription_key
        self.end_point = anomaly_detector_endpoint

        # Create an Anomaly Detector client

        # <client>
        self.ad_client = AnomalyDetectorClient(self.end_point, AzureKeyCredential(self.sub_key))
        # </client>

    def list_models(self):

        # List models
        models = self.ad_client.list_multivariate_models(skip=0, top=10)
        return list(models)

    def train(self, body):

        # Number of models available now
        try:
            model_list = self.list_models()
            print("{:d} available models before training.".format(len(model_list)))

            # Use sample data to train the model
            print("Training new model...(it may take a few minutes)")
            model = self.ad_client.train_multivariate_model(body)
            trained_model_id = model.model_id
            print("Training model id is {}".format(trained_model_id))

            ## Wait until the model is ready. It usually takes several minutes
            model_status = None
            model = None

            while model_status != ModelStatus.READY and model_status != ModelStatus.FAILED:
                model = self.ad_client.get_multivariate_model(trained_model_id)
                print(model)
                model_status = model.model_info.status
                print("Model is {}".format(model_status))
                time.sleep(30)

            if model_status == ModelStatus.FAILED:
                print("Creating model failed.")
                print("Errors:")
                if len(model.model_info.errors) > 0:
                    print(
                        "Error code: {}. Message: {}".format(
                            model.model_info.errors[0].code,
                            model.model_info.errors[0].message,
                        )
                    )
                else:
                    print("None")

            if model_status == ModelStatus.READY:
                # Model list after training
                model_list = self.list_models()

                print("Done.\n--------------------")
                print("{:d} available models after training.".format(len(model_list)))

                # Return the latest model id
            return trained_model_id
        except HttpResponseError as e:
            print(
                "Error code: {}".format(e.error.code),
                "Error message: {}".format(e.error.message),
            )
        except Exception as e:
            raise e

        return None

    def batch_detect(self, model_id, body):

        # Detect anomaly in the same data source (but a different interval)
        try:
            result = self.ad_client.detect_multivariate_batch_anomaly(model_id, body)
            result_id = result.result_id

            # Get results (may need a few seconds)
            r = self.ad_client.get_multivariate_batch_detection_result(result_id)
            print("Get detection result...(it may take a few seconds)")

            while r.summary.status != MultivariateBatchDetectionStatus.READY and r.summary.status != MultivariateBatchDetectionStatus.FAILED:
                r = self.ad_client.get_multivariate_batch_detection_result(result_id)
                print("Detection is {}".format(r.summary.status))
                time.sleep(15)

            if r.summary.status == MultivariateBatchDetectionStatus.FAILED:
                print("Detection failed.")
                print("Errors:")
                if len(r.summary.errors) > 0:
                    print("Error code: {}. Message: {}".format(r.summary.errors[0].code, r.summary.errors[0].message))
                else:
                    print("None")
                return None

            return r

        except HttpResponseError as e:
            print(
                "Error code: {}".format(e.error.code),
                "Error message: {}".format(e.error.message),
            )
        except Exception as e:
            raise e

        return None

    def delete_model(self, model_id):

        # Delete the model
        self.ad_client.delete_multivariate_model(model_id)
        model_list = self.list_models()
        print("{:d} available models after deletion.".format(len(model_list)))

    def last_detect(self, model_id, variables):

        # Detect anomaly by sync api
        r = self.ad_client.detect_multivariate_last_anomaly(model_id, variables)
        print("Get last detection result")
        return r


if __name__ == "__main__":
    SUBSCRIPTION_KEY = os.environ["ANOMALY_DETECTOR_API_KEY"]
    ANOMALY_DETECTOR_ENDPOINT = os.environ["ANOMALY_DETECTOR_ENDPOINT"]

    ## Create a new sample and client
    sample = MultivariateSample(SUBSCRIPTION_KEY, ANOMALY_DETECTOR_ENDPOINT)

    # Train a new model
    time_format = "%Y-%m-%dT%H:%M:%SZ"
    blob_url = blob_url_path 
    train_body = ModelInfo(
        data_source=blob_url,
        start_time=datetime.strptime("2021-01-02T00:00:00Z", time_format),
        end_time=datetime.strptime("2021-01-02T05:00:00Z", time_format),
        data_schema="OneTable",
        display_name="sample",
        sliding_window=200,
        align_policy=AlignPolicy(
            align_mode=AlignMode.OUTER,
            fill_n_a_method=FillNAMethod.LINEAR,
            padding_value=0,
        ),
    )
    model_id = sample.train(train_body)

    # Batch Inference
    batch_inference_body = MultivariateBatchDetectionOptions(
        data_source=blob_url,
        top_contributor_count=10,
        start_time=datetime.strptime("2021-01-02T00:00:00Z", time_format),
        end_time=datetime.strptime("2021-01-02T05:00:00Z", time_format),
    )
    result = sample.batch_detect(model_id, batch_inference_body)
    assert result is not None

    print("Result ID:\t", result.result_id)
    print("Result status:\t", result.summary.status)
    print("Result length:\t", len(result.results))

    # See detailed inference result
    for r in result.results:
        print(
            "timestamp: {}, is_anomaly: {:<5}, anomaly score: {:.4f}, severity: {:.4f}, contributor count: {:<4d}".format(
                r.timestamp,
                r.value.is_anomaly,
                r.value.score,
                r.value.severity,
                len(r.value.interpretation) if r.value.is_anomaly else 0,
            )
        )
        if r.value.interpretation:
            for contributor in r.value.interpretation:
                print(
                    "\tcontributor variable: {:<10}, contributor score: {:.4f}".format(
                        contributor.variable, contributor.contribution_score
                    )
                )

    # *******************************************************************************************************************
    # Use your own inference data sending to last detection api, you should define your own variables and detectingPoints
    # *****************************************************************************************************************
    # define "<YOUR OWN variables>"
    # variables = [
    #    {
    #        "name": "variables_name1",
    #        "timestamps": ['2021-01-01T00:00:00Z', '2021-01-01T00:01:00Z', ...],
    #        "values": [0, 0, ...]
    #    },
    #    {
    #        "name": "variables_name2",
    #        "timestamps": ['2021-01-01T00:00:00Z', '2021-01-01T00:01:00Z', ...],
    #        "values": [0, 0, ...]
    #    }
    # ]

    # Last detection
    with open(local_json_file_path) as f:
        variables_data = json.load(f)

    variables = []
    for item in variables_data["variables"]:
        variables.append(
            VariableValues(
                variable=item["variable"],
                timestamps=item["timestamps"],
                values=item["values"],
            )
        )

    last_inference_body = MultivariateLastDetectionOptions(
        variables=variables,
        top_contributor_count=10,
    )
    last_detect_result = sample.last_detect(model_id, last_inference_body)

    assert last_detect_result is not None

    print("Variable States:\t", last_detect_result.variable_states)
    print("Variable States length:\t", len(last_detect_result.variable_states))
    print("Results:\t", last_detect_result.results)
    print("Results length:\t", len(last_detect_result.results))

    # Delete model
    sample.delete_model(model_id)
```

## Run the application

Run the application with the `python` command on your quickstart file.

```console
python sample_multivariate_detect.py
```

### Output

```console
10 available models before training.
Training new model...(it may take a few minutes)
Training model id is 3a695878-a88f-11ed-a16c-b290e72010e0
{'modelId': '3a695878-a88f-11ed-a16c-b290e72010e0', 'createdTime': '2023-02-09T15:34:23Z', 'lastUpdatedTime': '2023-02-09T15:34:23Z', 'modelInfo': {'dataSource': 'https://docstest001.blob.core.windows.net/test/sample_data_5_3000 (1).csv', 'dataSchema': 'OneTable', 'startTime': '2021-01-02T00:00:00Z', 'endTime': '2021-01-02T05:00:00Z', 'displayName': 'sample', 'slidingWindow': 200, 'alignPolicy': {'alignMode': 'Outer', 'fillNAMethod': 'Linear', 'paddingValue': 0.0}, 'status': 'CREATED', 'errors': [], 'diagnosticsInfo': {'modelState': {'epochIds': [], 'trainLosses': [], 'validationLosses': [], 'latenciesInSeconds': []}, 'variableStates': []}}}
Model is CREATED
{'modelId': '3a695878-a88f-11ed-a16c-b290e72010e0', 'createdTime': '2023-02-09T15:34:23Z', 'lastUpdatedTime': '2023-02-09T15:34:55Z', 'modelInfo': {'dataSource': 'https://docstest001.blob.core.windows.net/test/sample_data_5_3000 (1).csv', 'dataSchema': 'OneTable', 'startTime': '2021-01-02T00:00:00Z', 'endTime': '2021-01-02T05:00:00Z', 'displayName': 'sample', 'slidingWindow': 200, 'alignPolicy': {'alignMode': 'Outer', 'fillNAMethod': 'Linear', 'paddingValue': 0.0}, 'status': 'READY', 'errors': [], 'diagnosticsInfo': {'modelState': {'epochIds': [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], 'trainLosses': [1.0493712276220322, 0.5454281121492386, 0.42524269968271255, 0.38019897043704987, 0.3472398854792118, 0.34301353991031647, 0.3219067454338074, 0.3108387663960457, 0.30357857793569565, 0.29986055195331573], 'validationLosses': [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 'latenciesInSeconds': [0.3412797451019287, 0.25798678398132324, 0.2556419372558594, 0.3165152072906494, 0.2748451232910156, 0.26111531257629395, 0.2571413516998291, 0.257282018661499, 0.2549862861633301, 0.25806593894958496]}, 'variableStates': [{'variable': 'series_0', 'filledNARatio': 0.0, 'effectiveCount': 301, 'firstTimestamp': '2021-01-02T00:00:00Z', 'lastTimestamp': '2021-01-02T05:00:00Z'}, {'variable': 'series_1', 'filledNARatio': 0.0, 'effectiveCount': 301, 'firstTimestamp': '2021-01-02T00:00:00Z', 'lastTimestamp': '2021-01-02T05:00:00Z'}, {'variable': 'series_2', 'filledNARatio': 0.0, 'effectiveCount': 301, 'firstTimestamp': '2021-01-02T00:00:00Z', 'lastTimestamp': '2021-01-02T05:00:00Z'}, {'variable': 'series_3', 'filledNARatio': 0.0, 'effectiveCount': 301, 'firstTimestamp': '2021-01-02T00:00:00Z', 'lastTimestamp': '2021-01-02T05:00:00Z'}, {'variable': 'series_4', 'filledNARatio': 0.0, 'effectiveCount': 301, 'firstTimestamp': '2021-01-02T00:00:00Z', 'lastTimestamp': '2021-01-02T05:00:00Z'}]}}}
Model is READY
Done.
--------------------
10 available models after training.
Get detection result...(it may take a few seconds)
Detection is CREATED
Detection is READY
Result ID:	 70a6cdf8-a88f-11ed-a461-928899e62c38
Result status:	 READY
Result length:	 301
timestamp: 2021-01-02 00:00:00+00:00, is_anomaly: 0    , anomaly score: 0.1770, severity: 0.0000, contributor count: 0   
timestamp: 2021-01-02 00:01:00+00:00, is_anomaly: 0    , anomaly score: 0.3446, severity: 0.0000, contributor count: 0   
timestamp: 2021-01-02 00:02:00+00:00, is_anomaly: 0    , anomaly score: 0.2397, severity: 0.0000, contributor count: 0   
timestamp: 2021-01-02 00:03:00+00:00, is_anomaly: 0    , anomaly score: 0.1270, severity: 0.0000, contributor count: 0   
timestamp: 2021-01-02 00:04:00+00:00, is_anomaly: 0    , anomaly score: 0.3321, severity: 0.0000, contributor count: 0   
timestamp: 2021-01-02 00:05:00+00:00, is_anomaly: 0    , anomaly score: 0.4053, severity: 0.0000, contributor count: 0   
timestamp: 2021-01-02 00:06:00+00:00, is_anomaly: 0    , anomaly score: 0.4371, severity: 0.0000, contributor count: 0   
timestamp: 2021-01-02 00:07:00+00:00, is_anomaly: 1    , anomaly score: 0.6615, severity: 0.3850, contributor count: 5   
	contributor variable: series_3  , contributor score: 0.2939
	contributor variable: series_1  , contributor score: 0.2834
	contributor variable: series_4  , contributor score: 0.2329
	contributor variable: series_0  , contributor score: 0.1543
	contributor variable: series_2  , contributor score: 0.0354
```

The output results have been truncated for brevity.

## Clean up resources

If you want to clean up and remove an Anomaly Detector resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You also may want to consider [deleting the environment variables](/powershell/module/microsoft.powershell.core/about/about_environment_variables#using-the-environment-provider-and-item-cmdlets) you created if you no longer intend to use them.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

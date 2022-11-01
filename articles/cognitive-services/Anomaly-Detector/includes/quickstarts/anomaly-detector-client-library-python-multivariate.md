---
title: Anomaly Detector Python multivariate client library quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 10/26/2022
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
* <a href="https://pandas.pydata.org/" target="_blank">Pandas data analysis library</a>
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and select the **Go to resource** button. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Set up

Install the client library. You can install the client library with:

```console
pip install --upgrade azure.ai.anomalydetector
```

If you don't already have it installed, you will also need to install the pandas library:

```console
pip install pandas
```

### Download sample data

This quickstart uses the `sample_data_5_3000.zip` file that can be downloaded from our [GitHub sample data](https://github.com/Azure-Samples/AnomalyDetector/blob/master/samples-multivariate/multivariate_sample_data/sample_data_5_3000.zip)

 You can also download the sample data by running:

```cmd
curl "https://github.com/Azure-Samples/AnomalyDetector/blob/master/samples-multivariate/multivariate_sample_data/sample_data_5_3000.zip" --output sample_data_5_3000_.zip
```

### Generate SAS URL

Multivariate Anomaly Detector requires your sample file to be stored as a .zip file in Azure Blob Storage.

1. Create an <a href="https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM" target="_blank">Azure Storage account</a>.
2. From within your storage account, create a new storage container with the Public access level set to **private**.
3. Open your container and select upload. Upload the `sample_data_5_3000.zip` file from the previous step.
    :::image type="content" source="../../media/quickstart/upload-zip.png" alt-text="Screenshot of the storage upload user experience." lightbox="../../media/quickstart/upload-zip.png":::
4. Select the `...` to open the context menu next to your newly uploaded zip file and select **Generate SAS**.
     :::image type="content" source="../../media/quickstart/generate-access.png" alt-text="Screenshot of the Blob storage context menu with Generate SAS highlighted." lightbox="../../media/quickstart/generate-access.png":::
5. Select **Generate SAS Token and URL**.
6. You will need to copy the SAS URL into the `ANOMALY_DETECTOR_DATA_SOURCE` environment variable in the next section.

   > [!NOTE]
   > The steps above are the bare minimum to generate a SAS URL. For a more in-depth article on the process, we recommend consulting this [Form Recognizer article](../../../../applied-ai-services/form-recognizer/create-sas-tokens.md).


## Retrieve key and endpoint

To successfully make a call against the Anomaly Detector service, you'll need the following values:

|Variable name | Value |
|--------------------------|-------------|
| `ANOMALY_DETECTOR_ENDPOINT` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Example endpoint: `https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/`|
| `ANOMALY_DETECTOR_API_KEY` | The API key value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
|`ANOMALY_DETECTOR_DATA_SOURCE` | This quickstart uses the `sample_data_5-3000.zip` file that can be downloaded from our [GitHub sample data](https://github.com/Azure-Samples/AnomalyDetector/blob/master/samples-multivariate/multivariate_sample_data/sample_data_5_3000.zip). This file will then need to be added to Azure Blob Storage and made accessible via a SAS URL. |

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

### Create environment variables

Create and assign persistent environment variables for your key and endpoint.

# [Command Line](#tab/command-line)

```CMD
setx ANOMALY_DETECTOR_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
```

```CMD
setx ANOMALY_DETECTOR_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
```

```CMD
setx ANOMALY_DETECTOR_DATA_SOURCE "REPLACE_WITH_YOUR_SAS_URL_TO_THE_SAMPLE_ZIP_FILE" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('ANOMALY_DETECTOR_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('ANOMALY_DETECTOR_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('ANOMALY_DETECTOR_DATA_SOURCE', 'REPLACE_WITH_YOUR_SAS_URL_TO_THE_SAMPLE_ZIP_FILE', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export ANOMALY_DETECTOR_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
```

```Bash
echo export ANOMALY_DETECTOR_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
```

```Bash
echo export ANOMALY_DETECTOR_DATA_SOURCE="REPLACE_WITH_YOUR_SAS_URL_TO_THE_SAMPLE_ZIP_FILE" >> /etc/environment && source /etc/environment
```

---

### Create a new Python application

1. Create a new Python file called quickstart.py. Then open it up in your preferred editor or IDE.

2. Replace the contents of quickstart.py with the following code. If you're using the environment variables from the earlier steps in the quickstart no changes to the code will be needed:

```python
import os
import time
from datetime import datetime, timezone

from azure.ai.anomalydetector import AnomalyDetectorClient
from azure.ai.anomalydetector.models import DetectionRequest, ModelInfo, LastDetectionRequest
from azure.ai.anomalydetector.models import ModelStatus, DetectionStatus
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

SUBSCRIPTION_KEY = os.environ["ANOMALY_DETECTOR_API_KEY"]
ANOMALY_DETECTOR_ENDPOINT = os.environ["ANOMALY_DETECTOR_ENDPOINT"]
DATA_SOURCE = os.environ["ANOMALY_DETECTOR_DATA_SOURCE"]

ad_client = AnomalyDetectorClient(AzureKeyCredential(SUBSCRIPTION_KEY), ANOMALY_DETECTOR_ENDPOINT)
model_list = list(ad_client.list_multivariate_model(skip=0, top=10000))
print("{:d} available models before training.".format(len(model_list)))

print("Training new model...(it may take a few minutes)")
data_feed = ModelInfo(start_time=datetime(2021, 1, 1, 0, 0, 0, tzinfo=timezone.utc), end_time=datetime(2021, 1, 2, 12, 0, 0, tzinfo=timezone.utc), source=DATA_SOURCE)
response_header = \
        ad_client.train_multivariate_model(data_feed, cls=lambda *args: [args[i] for i in range(len(args))])[-1]
trained_model_id = response_header['Location'].split("/")[-1]

model_status = None

while model_status != ModelStatus.READY and model_status != ModelStatus.FAILED:
    model_info = ad_client.get_multivariate_model(trained_model_id).model_info
    model_status = model_info.status
    time.sleep(30)
    print ("MODEL STATUS: " + model_status)

if model_status == ModelStatus.READY:
            new_model_list = list(ad_client.list_multivariate_model(skip=0, top=10000))
            print("Model training complete.\n--------------------")
            print("{:d} available models after training.".format(len(new_model_list)))
            print("New Model ID " + trained_model_id)

detection_req = DetectionRequest(source=DATA_SOURCE, start_time=datetime(2021, 1, 2, 12, 0, 0, tzinfo=timezone.utc), end_time=datetime(2021, 1, 3, 0, 0, 0, tzinfo=timezone.utc))
response_header = ad_client.detect_anomaly(trained_model_id, detection_req, cls=lambda *args: [args[i] for i in range(len(args))])[-1]
result_id = response_header['Location'].split("/")[-1]

# Get results (may need a few seconds)
r = ad_client.get_detection_result(result_id)
print("Get detection result...(it may take a few seconds)")

while r.summary.status != DetectionStatus.READY and r.summary.status != DetectionStatus.FAILED:
    r = ad_client.get_detection_result(result_id)
    time.sleep(1)
            
print("Result ID:\t", r.result_id)
print("Result status:\t", r.summary.status)
print("Result length:\t", len(r.results))
print("\nAnomaly details:")
for i in r.results:
        if i.value.is_anomaly:
            print("timestamp: {}, is_anomaly: {:<5}, anomaly score: {:.4f}, severity: {:.4f}, contributor count: {:<4d}".format(i.timestamp, str(i.value.is_anomaly), i.value.score, i.value.severity, len(i.value.interpretation) if i.value.is_anomaly else 0))
            if i.value.interpretation is not None:
                for interp in i.value.interpretation:
                    print("\tcorrelation changes: {:<10}, contribution score: {:.4f}".format(interp.variable, interp.contribution_score))
```

## Run the application

Run the application with the `python` command on your quickstart file.

```console
python quickstart.py
```

### Output

```console
0 available models before training.
Training new model...(it may take a few minutes)
MODEL STATUS: CREATED
MODEL STATUS: RUNNING
MODEL STATUS: RUNNING
MODEL STATUS: RUNNING
MODEL STATUS: RUNNING
MODEL STATUS: READY
Model training complete.
--------------------
1 available models after training.
New Model ID GUID
Get detection result...(it may take a few seconds)
Result ID: GUID
Result status:	 READY
Result length:	 721
timestamp: 2021-01-02 12:06:00+00:00, is_anomaly: True , anomaly score: 0.5633, severity: 0.3278, contributor count: 5   
	correlation changes: series_2  , contribution score: 0.2950
	correlation changes: series_3  , contribution score: 0.2281
	correlation changes: series_1  , contribution score: 0.2148
	correlation changes: series_4  , contribution score: 0.1927
	correlation changes: series_0  , contribution score: 0.0694
timestamp: 2021-01-02 12:27:00+00:00, is_anomaly: True , anomaly score: 0.4873, severity: 0.2836, contributor count: 5   
	correlation changes: series_2  , contribution score: 0.4787
	correlation changes: series_4  , contribution score: 0.2131
	correlation changes: series_1  , contribution score: 0.1528
	correlation changes: series_3  , contribution score: 0.1338
	correlation changes: series_0  , contribution score: 0.0215
timestamp: 2021-01-02 13:08:00+00:00, is_anomaly: True , anomaly score: 0.5176, severity: 0.3012, contributor count: 5   
	correlation changes: series_1  , contribution score: 0.4417
	correlation changes: series_4  , contribution score: 0.1921
	correlation changes: series_3  , contribution score: 0.1730
	correlation changes: series_0  , contribution score: 0.1591
	correlation changes: series_2  , contribution score: 0.0341
timestamp: 2021-01-02 13:19:00+00:00, is_anomaly: True , anomaly score: 0.6038, severity: 0.3514, contributor count: 5   
	correlation changes: series_0  , contribution score: 0.3545
	correlation changes: series_3  , contribution score: 0.3002
	correlation changes: series_2  , contribution score: 0.2700
	correlation changes: series_4  , contribution score: 0.0608
	correlation changes: series_1  , contribution score: 0.0144
timestamp: 2021-01-02 13:22:00+00:00, is_anomaly: True , anomaly score: 0.5010, severity: 0.2915, contributor count: 5   
```

We also have an [in-depth Jupyter Notebook](https://github.com/Azure-Samples/AnomalyDetector/blob/master/ipython-notebook/API%20Sample/Multivariate%20API%20Demo%20Notebook.ipynb) to help you get started.

## Clean up resources

If you want to clean up and remove an Anomaly Detector resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You also may want to consider [deleting the environment variables](/powershell/module/microsoft.powershell.core/about/about_environment_variables?view=powershell-7.2#using-the-environment-provider-and-item-cmdlets&preserve-view=true) you created if you no longer intend to use them.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)
---
title: Anomaly Detector Python client library quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 08/31/2022
ms.author: mbullwin
---

Get started with the Anomaly Detector client library for Python. Follow these steps to install the package start using the algorithms provided by the service. The Anomaly Detector service enables you to find abnormalities in your time series data by automatically using the best-fitting models on it, regardless of industry, scenario, or data volume.

Use the Anomaly Detector client library for Python to:

* Detect anomalies throughout your time series data set, as a batch request
* Detect the anomaly status of the latest data point in your time series
* Detect trend change points in your data set.

<a href="https://go.microsoft.com/fwlink/?linkid=2090370" target="_blank">Library reference documentation</a> |<a href="https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/anomalydetector/azure-ai-anomalydetector" target="_blank">Library source code</a> | <a href="https://pypi.org/project/azure-ai-anomalydetector/" target="_blank">Package (PyPi)</a> |<a href="https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/anomalydetector/azure-ai-anomalydetector/samples" target="_blank">Find the sample code on GitHub</a>

## Prerequisites

* [Python 3.x](https://www.python.org/)
* <a href="https://www.python.org/" target="_blank">Python 3.x</a>
* <a href="https://pandas.pydata.org/" target="_blank">Pandas data analysis library</a>
* An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Set up

Install the client library. You can install the client library with:

```console
pip install --upgrade azure.ai.anomalydetector
```

## Retrieve key and endpoint

To successfully make a call against the Azure OpenAI service, you'll need the following:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal.|
| `KEY` | The API key value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
|`TIME_SERIES_DATA_PATH` | This quickstart uses the `request-data.csv` file which can be downloaded from our [GitHub sample data](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/anomalydetector/azure-ai-anomalydetector/samples/sample_data/request-data.csv). |

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

## Create a new Python application

1. Create a new Python file called quickstart.py. Then open it up in your preferred editor or IDE.

2. Replace the contents of quickstart.py with the following code. Modify the code to add your key, endpoint, and time series data path:

    ```python
    from azure.ai.anomalydetector import AnomalyDetectorClient
    from azure.ai.anomalydetector.models import DetectRequest, TimeSeriesPoint, TimeGranularity
    from azure.core.credentials import AzureKeyCredential
    import pandas as pd  

    API_KEY = "REPLACE_WITH_YOUR_API_KEY_HERE"
    ENDPOINT = "REPLACE_WITH_YOUR_ENDPOINT_HERE" # example endpoint: https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/
    TIME_SERIES_DATA_PATH = "REPLACE_WITH_YOUR_TIME_SERIES_DATA_PATH_HERE" #example path: c:\\test\\request-data.csv 
    # You can download the example data locally by running curl "https://raw.githubusercontent.com/Azure/azure-sdk-for-python/main/sdk/anomalydetector/azure-ai-anomalydetector/samples/sample_data/request-data.csv" --output request-data.csv

    client = AnomalyDetectorClient(AzureKeyCredential(API_KEY), ENDPOINT)

    series = []
    data_file = pd.read_csv(TIME_SERIES_DATA_PATH, header=None, encoding='utf-8', date_parser=[0])
    for index, row in data_file.iterrows():
        series.append(TimeSeriesPoint(timestamp=row[0], value=row[1]))

    request = DetectRequest(series=series, granularity=TimeGranularity.daily)

    change_point_response = client.detect_change_point(request)
    anomaly_response = client.detect_entire_series(request)

    for i in range(len(data_file.values)):
        if (change_point_response.is_change_point[i]):
            print("Change point detected at index: "+ str(i))
        elif (anomaly_response.is_anomaly[i]):
            print("Anomaly detected at index:      "+ str(i))
    ```

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). See the Cognitive Services [security](../../cognitive-services-security.md) article for more information.

3. Run the application with the `python` command on your quickstart file

    ```console
    python quickstart.py
    ```

### Output

```console
Anomaly detected at index:      3
Anomaly detected at index:      18
Change point detected at index: 20
Anomaly detected at index:      21
Anomaly detected at index:      22
Anomaly detected at index:      23
Anomaly detected at index:      24
Anomaly detected at index:      25
Change point detected at index: 27
Anomaly detected at index:      28
Anomaly detected at index:      29
Anomaly detected at index:      30
Anomaly detected at index:      31
Anomaly detected at index:      32
Anomaly detected at index:      35
Anomaly detected at index:      44
```

### Understanding your results

In our script we call the Anomaly Detector API twice. The first call checks for trend change points across our sample data series with the `detect_change_point` method. This call returns a `ChangePointDetectResponse` that we stored in a variable we named `change_point_request`. We then iterate through the response's `is_change_point` list, and print the index of any values with a boolean of `true`.

The second call checks the entire sample data series for anomalies using the [`detect_entire_series`](python/api/azure-ai-anomalydetector/azure.ai.anomalydetector.operations.anomalydetectorclientoperationsmixin?view=azure-python-preview#azure-ai-anomalydetector-operations-anomalydetectorclientoperationsmixin-detect-entire-series) method. This call returns a [`EntireDetectResponse`](python/api/azure-ai-anomalydetector/azure.ai.anomalydetector.models.entiredetectresponse?view=azure-python-preview) that we stored in a variable we named `anomaly_response` We iterate through the response's `is_anomaly` list, and print the index of any values with a boolean of `true`. Alternatively, we could have used the [`detect_last_point`](python/api/azure-ai-anomalydetector/azure.ai.anomalydetector.operations.anomalydetectorclientoperationsmixin?view=azure-python-preview#azure-ai-anomalydetector-operations-anomalydetectorclientoperationsmixin-detect-last-point) method which is more appropriate for detecting anomalies in real-time data.

## Visualize results

To visualize the anomalies and change points in relation to the sample data series we will use the popular open-source library [matplotlib](https://pypi.org/project/matplotlib/).

1. Install the library.

```console
pip install matplotlib
```

2. Modify your quickstart.py file with the following code:

    ```python
    from azure.ai.anomalydetector import AnomalyDetectorClient
    from azure.ai.anomalydetector.models import DetectRequest, TimeSeriesPoint, TimeGranularity
    from azure.core.credentials import AzureKeyCredential
    import pandas as pd
    import matplotlib.pyplot as plt
    import matplotlib.dates as mdates

    API_KEY = "REPLACE_WITH_YOUR_API_KEY_HERE"
    ENDPOINT = "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
    TIME_SERIES_DATA_PATH = "REPLACE_WITH_YOUR_TIME_SERIES_DATA_PATH_HERE"

    client = AnomalyDetectorClient(AzureKeyCredential(SUBSCRIPTION_KEY), ANOMALY_DETECTOR_ENDPOINT)

    series = []
    data_file = pd.read_csv(TIME_SERIES_DATA_PATH, header=None, encoding='utf-8', date_parser=[0])
    for index, row in data_file.iterrows():
        series.append(TimeSeriesPoint(timestamp=row[0], value=row[1]))

    request = DetectRequest(series=series, granularity=TimeGranularity.daily)

    change_point_response = client.detect_change_point(request)
    anomaly_response = client.detect_entire_series(request)

    for i in range(len(data_file.values)):
        temp_date_to_num = mdates.date2num(data_file.values[i])
        date= temp_date_to_num[0]
        if (change_point_response.is_change_point[i]):
            plt.plot(date,data_file.values[i][1], 's', color ='blue')
            print("Change point detected at index: "+ str(i))
        elif (anomaly_response.is_anomaly[i]):
            plt.plot(date,data_file.values[i][1], '^', color="red")
            print("Anomaly detected at index:      "+ str(i))
        else:
            plt.plot(date,data_file.values[i][1], 'o', color ='green')
    plt.show()
    ```
    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). See the Cognitive Services [security](../../cognitive-services-security.md) article for more information.

3. Run the application with the `python` command on your quickstart file

    ```console
    python quickstart.py
    ```

### Output

:::image type="content" source="../../media/quickstart/output.png" alt-text="Screenshot of anomaly detection results with indexes of anomalies and change points on a scatter plot. Anomalies are represented as red triangles, change points are represented as blue squares, and normal data is represented as green circles." lightbox="../../media/quickstart/output.png":::



## Clean up resources

If you want to clean up and remove an Anomaly Detector resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
- [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)
---
title: Anomaly Detector Python client library quickstart
titleSuffix: Azure AI services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-anomaly-detector
ms.topic: include
ms.date: 12/16/2022
ms.author: mbullwin
recommendations: false
---

<a href="https://go.microsoft.com/fwlink/?linkid=2090370" target="_blank">Library reference documentation</a> |<a href="https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/anomalydetector/azure-ai-anomalydetector" target="_blank">Library source code</a> | <a href="https://pypi.org/project/azure-ai-anomalydetector/" target="_blank">Package (PyPi)</a> |<a href="https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/anomalydetector/azure-ai-anomalydetector/samples" target="_blank">Find the sample code on GitHub</a>

Get started with the Anomaly Detector client library for Python. Follow these steps to install the package and start using the algorithms provided by the service. The Anomaly Detector service enables you to find abnormalities in your time series data by automatically using the best-fitting models on it, regardless of industry, scenario, or data volume.

Use the Anomaly Detector client library for Python to:

* Detect anomalies throughout your time series data set, as a batch request
* Detect the anomaly status of the latest data point in your time series
* Detect trend change points in your data set.

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

## Retrieve key and endpoint

To successfully make a call against the Anomaly Detector service, you'll need the following values:

|Variable name | Value |
|--------------------------|-------------|
| `ANOMALY_DETECTOR_ENDPOINT` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Example endpoint: `https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/`|
| `ANOMALY_DETECTOR_API_KEY` | The API key value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
|`DATA_PATH` | This quickstart uses the `request-data.csv` file that can be downloaded from our [GitHub sample data](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/anomalydetector/azure-ai-anomalydetector/samples/sample_data/request-data.csv). Example path: `c:\\test\\request-data.csv`  |

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

### Download sample data

This quickstart uses the `request-data.csv` file that can be downloaded from our [GitHub sample data](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/anomalydetector/azure-ai-anomalydetector/samples/sample_data/request-data.csv)

 You can also download the sample data by running:

```cmd
curl "https://raw.githubusercontent.com/Azure/azure-sdk-for-python/main/sdk/anomalydetector/azure-ai-anomalydetector/samples/sample_data/request-data.csv" --output request-data.csv
```

## Detect anomalies

1. Create a new Python file called quickstart.py. Then open it up in your preferred editor or IDE.

2. Replace the contents of quickstart.py with the following code. Modify the code to add the environment variable names for your key, endpoint, and the time series data path:

    ```python
    from azure.ai.anomalydetector import AnomalyDetectorClient
    from azure.ai.anomalydetector.models import *
    from azure.core.credentials import AzureKeyCredential
    import pandas as pd
    import os

    API_KEY = os.environ['ANOMALY_DETECTOR_API_KEY']
    ENDPOINT = os.environ['ANOMALY_DETECTOR_ENDPOINT']
    DATA_PATH = "REPLACE_WITH_YOUR_LOCAL_SAMPLE_REQUEST_DATA_PATH" #example: c:\\test\\request-data.csv

    client = AnomalyDetectorClient(ENDPOINT, AzureKeyCredential(API_KEY))

    series = []
    data_file = pd.read_csv(DATA_PATH, header=None, encoding='utf-8', date_parser=[0])
    for index, row in data_file.iterrows():
        series.append(TimeSeriesPoint(timestamp=row[0], value=row[1]))

    request = UnivariateDetectionOptions(series=series, granularity=TimeGranularity.DAILY)

    change_point_response = client.detect_univariate_change_point(request)
    anomaly_response = client.detect_univariate_entire_series(request)

    for i in range(len(data_file.values)):
        if (change_point_response.is_change_point[i]):
            print("Change point detected at index: "+ str(i))
        elif (anomaly_response.is_anomaly[i]):
            print("Anomaly detected at index:      "+ str(i))
    ```

    > [!IMPORTANT]
    > For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../../security-features.md) article.

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

In our code above, we call the Anomaly Detector API twice. The first call checks for trend change points across our sample data series with the `detect_change_point` method. This call returns a `ChangePointDetectResponse` that we stored in a variable we named `change_point_request`. We then iterate through the response's `is_change_point` list, and print the index of any values with a boolean of `true`.

The second call checks the entire sample data series for anomalies using the `detect_entire_series` method. This call returns a `EntireDetectResponse` that we stored in a variable we named `anomaly_response`. We iterate through the response's `is_anomaly` list, and print the index of any values with a boolean of `true`. Alternatively, we could have used the `detect_last_point` method, which is more appropriate for detecting anomalies in real-time data. To learn more, consult the [best practices guide](../../concepts/anomaly-detection-best-practices.md).

## Visualize results

To visualize the anomalies and change points in relation to the sample data series, we'll use the popular open-source library [matplotlib](https://pypi.org/project/matplotlib/).

1. Install the library.

    ```console
    pip install matplotlib
    ```

2. Modify your quickstart.py file with the following code:

    ```python
    from azure.ai.anomalydetector import AnomalyDetectorClient
    from azure.ai.anomalydetector.models import *
    from azure.core.credentials import AzureKeyCredential
    import pandas as pd
    import matplotlib.pyplot as plt
    import matplotlib.dates as mdates
    import os

    API_KEY = os.environ['ANOMALY_DETECTOR_API_KEY']
    ENDPOINT = os.environ['ANOMALY_DETECTOR_ENDPOINT']
    DATA_PATH = "REPLACE_WITH_YOUR_LOCAL_SAMPLE_REQUEST_DATA_PATH" #example: c:\\test\\request-data.csv

    client = AnomalyDetectorClient(ENDPOINT, AzureKeyCredential(API_KEY))

    series = []
    data_file = pd.read_csv(DATA_PATH, header=None, encoding='utf-8', date_parser=[0])
    for index, row in data_file.iterrows():
        series.append(TimeSeriesPoint(timestamp=row[0], value=row[1]))

    request = UnivariateDetectionOptions(series=series, granularity=TimeGranularity.DAILY)

    change_point_response = client.detect_univariate_change_point(request)
    anomaly_response = client.detect_univariate_entire_series(request)

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
    > For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). for more information about credential security, see the Azure AI services [security](../../../security-features.md) article.

3. Run the application with the `python` command on your quickstart file

    ```console
    python quickstart.py
    ```

### Output

In this code example, we've added the `matplotlib` library to allow us to visualize and easily distinguish normal data points from change points and anomalies. Change points are represented by blue squares, anomalies are red triangles, and normal data points are green circles. Dates are converted to numbers using `matplotlib`'s `date2num` method to provide graph friendly values for the charts y-axis.

:::image type="content" source="../../media/quickstart/output.png" alt-text="Screenshot of results with indexes of anomalies and change points on a scatter plot. Different shapes and colors are used for different data types.." lightbox="../../media/quickstart/output.png":::

## Clean up resources

If you want to clean up and remove an Anomaly Detector resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You also may want to consider [deleting the environment variables](/powershell/module/microsoft.powershell.core/about/about_environment_variables#using-the-environment-provider-and-item-cmdlets) you created if you no longer intend to use them.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

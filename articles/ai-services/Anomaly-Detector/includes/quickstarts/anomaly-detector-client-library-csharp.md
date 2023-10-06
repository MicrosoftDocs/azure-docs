---
title: Anomaly Detector .NET client library quickstart
titleSuffix: Azure AI services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/14/2023
ms.author: mbullwin
---

<a href="https://aka.ms/anomaly-detector-dotnet-ref" target="_blank">Library reference documentation</a> |<a href="https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/anomalydetector" target="_blank">Library source code</a> | <a href="https://www.nuget.org/packages/Azure.AI.AnomalyDetector/3.0.0-preview.5" target="_blank">Package (NuGet)</a> |<a href="https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/anomalydetector/Azure.AI.AnomalyDetector/samples" target="_blank">Find the sample code on GitHub</a>

Get started with the Anomaly Detector client library for C#. Follow these steps to install the package start using the algorithms provided by the service. The Anomaly Detector service enables you to find abnormalities in your time series data by automatically using the best-fitting models on it, regardless of industry, scenario, or data volume.

Use the Anomaly Detector client library for C# to:

* Detect anomalies throughout your time series data set, as a batch request
* Detect the anomaly status of the latest data point in your time series
* Detect trend change points in your data set.

## Prerequisites

* An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
* The current version of <a href="https://dotnet.microsoft.com/download/dotnet-core" target="_blank">.NET Core</a>
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and select the **Go to resource** button. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Set up

### Create a new .NET Core application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `anomaly-detector-quickstart`. This command creates a simple "Hello World" project with a single C# source file: *Program.cs*.

```dotnetcli
dotnet new console -n anomaly-detector-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```dotnetcli
dotnet build
```

The build output should contain no warnings or errors.

```output
...
Build succeeded.
 0 Warning(s)
 0 Error(s)
...
```

### Install the client library

Within the application directory, install the Anomaly Detector client library for .NET with the following command:

```dotnetcli
dotnet add package Azure.AI.AnomalyDetector --prerelease
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

From the project directory, open the *program.cs* file and replace with the following code:

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Azure;
using Azure.AI.AnomalyDetector;
using static System.Environment;

namespace anomaly_detector_quickstart
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string endpoint = GetEnvironmentVariable("ANOMALY_DETECTOR_ENDPOINT");
            string apiKey = GetEnvironmentVariable("ANOMALY_DETECTOR_API_KEY");

            var endpointUri = new Uri(endpoint);
            var credential = new AzureKeyCredential(apiKey);

            //create client
            AnomalyDetectorClient client = new AnomalyDetectorClient(endpointUri, credential);

            //read data
            //example: string datapath = @"c:\test\request-data.csv";
            string datapath = @"REPLACE_WITH_YOUR_LOCAL_SAMPLE_REQUEST_DATA_PATH";

            List<TimeSeriesPoint> list = File.ReadAllLines(datapath, Encoding.UTF8)
                .Where(e => e.Trim().Length != 0)
                .Select(e => e.Split(','))
                .Where(e => e.Length == 2)
                .Select(e => new TimeSeriesPoint(float.Parse(e[1])) { Timestamp = DateTime.Parse(e[0]) }).ToList();

              //create request
            UnivariateDetectionOptions request = new UnivariateDetectionOptions(list)
            {
                Granularity = TimeGranularity.Daily
            };

            UnivariateEntireDetectionResult result = client.DetectUnivariateEntireSeries(request);

            bool hasAnomaly = false;
            for (int i = 0; i < request.Series.Count; ++i)
            {
                if (result.IsAnomaly[i])
                {
                    Console.WriteLine("Anomaly detected at index: {0}.", i);
                    hasAnomaly = true;
                }
            }
            if (!hasAnomaly)
            {
                Console.WriteLine("No anomalies detected in the series.");
            }
        }
    }
}


```

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../../security-features.md) article.

```cmd
dotnet run program.cs
```

### Output

```console
Anomaly detected at index:      3
Anomaly detected at index:      18
Anomaly detected at index:      21
Anomaly detected at index:      22
Anomaly detected at index:      23
Anomaly detected at index:      24
Anomaly detected at index:      25
Anomaly detected at index:      28
Anomaly detected at index:      29
Anomaly detected at index:      30
Anomaly detected at index:      31
Anomaly detected at index:      32
Anomaly detected at index:      35
Anomaly detected at index:      44
```

## Code details

### Understanding your results

In the code above, the sample data is read and converted to a `DetectRequest` object. We call `File.ReadAllLines` with the file path and create a list of `TimeSeriesPoint` objects, and strip any new line characters. Extract the values and separate the timestamp from its numerical value, and add them to a new `TimeSeriesPoint` object. The `DetectRequest` object consists of a series of data points, with `TimeGranularity.Daily` for the granularity (or periodicity) of the data points.
Next we call the client's `DetectEntireSeriesAsync` method with the `DetectRequest` object and await the response as an `EntireDetectResponse` object. We then, iterate through the response's `IsAnomaly` values and print any that are true. These values correspond to the index of anomalous data points, if any were found.

## Clean up resources

If you want to clean up and remove an Anomaly Detector resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. You also may want to consider [deleting the environment variables](/powershell/module/microsoft.powershell.core/about/about_environment_variables#using-the-environment-provider-and-item-cmdlets) you created if you no longer intend to use them.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

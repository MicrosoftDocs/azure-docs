---
title: Anomaly Detector .NET client library quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 01/26/2022
ms.author: mbullwin
---

Get started with the Anomaly Detector client library for C#. Follow these steps to install the package start using the algorithms provided by the service. The Anomaly Detector service enables you to find abnormalities in your time series data by automatically using the best-fitting models on it, regardless of industry, scenario, or data volume.

Use the Anomaly Detector client library for C# to:

* Detect anomalies throughout your time series data set, as a batch request
* Detect the anomaly status of the latest data point in your time series
* Detect trend change points in your data set.

[Library reference documentation](https://aka.ms/anomaly-detector-dotnet-ref) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/anomalydetector) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.AnomalyDetector/3.0.0-preview.5) | [Find the code on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/anomalydetector/Azure.AI.AnomalyDetector/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to the Anomaly Detector API. You'll paste your key and endpoint into the code below later in the quickstart.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

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
dotnet add package Azure.AI.AnomalyDetector --version 3.0.0-preview.5
```

## Detect an anomaly from an entire time series


You will need to update the code below and provide your own values for the following variables.

|Variable name | Value |
|--------------------------|-------------|
| `your-endpoint`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal.An example endpoint is: `https://contoso-new-001.cognitiveservices.azure.com/`|
| `your-apikey` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys allows for secure key rotation with zero downtime.|
| `request-data.csv` | You need to provide a path to your own sample data stored in csv format to detect an anomaly from. If you would like to use our sample data you can [download sample data here](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/anomalydetector/Azure.AI.AnomalyDetector/tests/samples/data/request-data.csv) |

From the project directory, open the *program.cs* file and replace with the following code:

```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Azure.AI.AnomalyDetector;
using Azure.AI.AnomalyDetector.Models;
using Azure.Core.TestFramework;
using NUnit.Framework;

namespace Azure.AI.AnomalyDetector.Tests.Samples
{
    public partial class AnomalyDetectorSamples : SamplesBase<AnomalyDetectorTestEnvironment>
    {
        [Test]
        public async Task DetectEntireSeriesAnomaly()
        {
            //read endpoint and apiKey
            string endpoint = "your-endpoint";
            string apiKey = "your-apikey";

            var endpointUri = new Uri(endpoint);
            var credential = new AzureKeyCredential(apiKey);

            //create client
            AnomalyDetectorClient client = new AnomalyDetectorClient(endpointUri, credential);

            //read data
            string datapath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "samples", "data", "request-data.csv");

            List<TimeSeriesPoint> list = File.ReadAllLines(datapath, Encoding.UTF8)
                .Where(e => e.Trim().Length != 0)
                .Select(e => e.Split(','))
                .Where(e => e.Length == 2)
                .Select(e => new TimeSeriesPoint(float.Parse(e[1])){ Timestamp = DateTime.Parse(e[0])}).ToList();

            //create request
            DetectRequest request = new DetectRequest(list)
            {
                Granularity = TimeGranularity.Daily
            };

            //detect
            Console.WriteLine("Detecting anomalies in the entire time series.");

            try
            {
                EntireDetectResponse result = await client.DetectEntireSeriesAsync(request).ConfigureAwait(false);

                bool hasAnomaly = false;
                for (int i = 0; i < request.Series.Count; ++i)
                {
                    if (result.IsAnomaly[i])
                    {
                        Console.WriteLine("An anomaly was detected at index: {0}.", i);
                        hasAnomaly = true;
                    }
                }
                if (!hasAnomaly)
                {
                    Console.WriteLine("No anomalies detected in the series.");
                }
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine(String.Format("Entire detection failed: {0}", ex.Message));
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine(String.Format("Detection error. {0}", ex.Message));
                throw;
            }
        }
    }
}
```

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../cognitive-services-security.md) article for more information.

## Code details

### Load time series and create DetectRequest

You could download our [sample data](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/anomalydetector/Azure.AI.AnomalyDetector/tests/samples/data/request-data.csv), read in the time series data and add it to a `DetectRequest` object.

Call `File.ReadAllLines` with the file path and create a list of `TimeSeriesPoint` objects, and strip any new line characters. Extract the values and separate the timestamp from its numerical value, and add them to a new `TimeSeriesPoint` object.

Make a `DetectRequest` object with the series of points, and `TimeGranularity.Daily` for the granularity (or periodicity) of the data points.

```c#
//read data
string datapath = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "samples", "data", "request-data.csv");

List<TimeSeriesPoint> list = File.ReadAllLines(datapath, Encoding.UTF8)
    .Where(e => e.Trim().Length != 0)
    .Select(e => e.Split(','))
    .Where(e => e.Length == 2)
    .Select(e => new TimeSeriesPoint(float.Parse(e[1])){ Timestamp = DateTime.Parse(e[0])}).ToList();

//create request
DetectRequest request = new DetectRequest(list)
{
    Granularity = TimeGranularity.Daily
};
```

### Detect anomalies of the entire series

Call the client's `DetectEntireSeriesAsync` method with the `DetectRequest` object and await the response as an `EntireDetectResponse` object. Iterate through the response's `IsAnomaly` values and print any that are true. These values correspond to the index of anomalous data points, if any were found.

```C# Snippet:DetectEntireSeriesAnomaly
//detect
Console.WriteLine("Detecting anomalies in the entire time series.");

try
{
    EntireDetectResponse result = await client.DetectEntireSeriesAsync(request).ConfigureAwait(false);

    bool hasAnomaly = false;
    for (int i = 0; i < request.Series.Count; ++i)
    {
        if (result.IsAnomaly[i])
        {
            Console.WriteLine("An anomaly was detected at index: {0}.", i);
            hasAnomaly = true;
        }
    }
    if (!hasAnomaly)
    {
        Console.WriteLine("No anomalies detected in the series.");
    }
}
catch (RequestFailedException ex)
{
    Console.WriteLine(String.Format("Entire detection failed: {0}", ex.Message));
    throw;
}
catch (Exception ex)
{
    Console.WriteLine(String.Format("Detection error. {0}", ex.Message));
    throw;
}
```

[!INCLUDE [anomaly-detector-next-steps](../quickstart-cleanup-next-steps.md)]

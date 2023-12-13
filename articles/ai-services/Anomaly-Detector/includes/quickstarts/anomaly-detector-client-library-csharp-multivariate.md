---
title: Anomaly Detector .NET multivariate client library quickstart
titleSuffix: Azure AI services
#services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-anomaly-detector
ms.topic: include
ms.date: 03/30/2023
ms.author: mbullwin
---

Get started with the Anomaly Detector multivariate client library for C#. Follow these steps to install the package and start using the algorithms provided by the service. The new multivariate anomaly detector APIs enable developers by easily integrating advanced AI for detecting anomalies from groups of metrics, without the need for machine learning knowledge or labeled data. Dependencies and inter-correlations between different signals are automatically counted as key factors. This helps you to proactively protect your complex systems from failures.

Use the Anomaly Detector multivariate client library for C# to:

* Detect system level anomalies from a group of time series.
* When any individual time series won't tell you much and you have to look at all signals to detect a problem.
* Predicative maintenance of expensive physical assets with tens to hundreds of different types of sensors measuring various aspects of system health.

[Library reference documentation](/dotnet/api/azure.ai.anomalydetector) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/anomalydetector) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.AnomalyDetector/3.0.0-preview.3)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector"  title="Create an Anomaly Detector resource"  target="_blank">create an Anomaly Detector resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and select the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to the Anomaly Detector API. Paste your key and endpoint into the code below later in the quickstart.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Set up

### Create a storage account

Multivariate Anomaly Detector requires your sample file to be stored in Azure Blob Storage.

1. Create an <a href="https://portal.azure.com/#create/Microsoft.StorageAccount-ARM" target="_blank">Azure Storage account</a>.
2. Go to Access Control(IAM), and select **ADD** to Add role assignment.
3. Search role of **Storage Blob Data Reader**, highlight this account type and then select **Next**.
4. Select **assign access to Managed identity**, and Select **Members**, then choose the **Anomaly Detector resource** that you created earlier, then select **Review + assign**.

This configuration can sometimes be a little confusing, if you have trouble we recommend consulting our [multivariate Jupyter Notebook sample](https://github.com/Azure-Samples/AnomalyDetector/blob/master/ipython-notebook/SDK%20Sample/%F0%9F%86%95MVAD-SDK-Demo.ipynb), which walks through this process more in-depth.

### Download sample data

This quickstart uses one file for sample data `sample_data_5_3000.csv`. This file can be downloaded from our [GitHub sample data](https://github.com/Azure-Samples/AnomalyDetector/blob/master/sampledata/multivariate/)

 You can also download the sample data by running:

```cmd
curl "https://github.com/Azure-Samples/AnomalyDetector/blob/master/sampledata/multivariate/sample_data_5_3000.csv" --output sample_data_5_3000_.csv
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

## Create a new .NET Core application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `anomaly-detector-quickstart-multivariate`. This command creates a simple "Hello World" project with a single C# source file: *Program.cs*.

```dotnetcli
dotnet new console -n anomaly-detector-quickstart-multivariate
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

From the project directory, open the *program.cs* file and replace with the following code:

```csharp
using Azure.AI.AnomalyDetector;
using Azure;
using static System.Environment;

internal class Program
{
    private static void Main(string[] args)
    {
        string endpoint = GetEnvironmentVariable("ANOMALY_DETECTOR_ENDPOINT"); 
        string apiKey = GetEnvironmentVariable("ANOMALY_DETECTOR_API_KEY");
        string datasource = "Path-to-sample-file-in-your-storage-account";  // example path:https://docstest001.blob.core.windows.net/test/sample_data_5_3000.csv
        Console.WriteLine(endpoint);
        var endpointUri = new Uri(endpoint);
        var credential = new AzureKeyCredential(apiKey);

        //create client
        AnomalyDetectorClient client = new AnomalyDetectorClient(endpointUri, credential);

        // train
        TimeSpan offset = new TimeSpan(0);
        DateTimeOffset start_time = new DateTimeOffset(2021, 1, 2, 0, 0, 0, offset);
        DateTimeOffset end_time = new DateTimeOffset(2021, 1, 2, 5, 0, 0, offset);
        string model_id = null;
        try
        {
            model_id = TrainModel(client, datasource, start_time, end_time);

            // detect
            end_time = new DateTimeOffset(2021, 1, 2, 1, 0, 0, offset);
            MultivariateDetectionResult result = BatchDetect(client, datasource, model_id, start_time, end_time);
            if (result != null)
            {
                Console.WriteLine(string.Format("Result ID: {0}", result.ResultId.ToString()));
                Console.WriteLine(string.Format("Result summary: {0}", result.Summary.ToString()));
                Console.WriteLine(string.Format("Result length: {0}", result.Results.Count));
            }

            // delete
            DeleteModel(client, model_id);
        }
        catch (Exception e)
        {
            string msg = string.Format("Multivariate error. {0}", e.Message);
            Console.WriteLine(msg);
            throw;
        }

        int GetModelNumber(AnomalyDetectorClient client)
        {
            int model_number = 0;
            foreach (var multivariateModel in client.GetMultivariateModels())
            {
                model_number++;
            }
            return model_number;
        }

        string TrainModel(AnomalyDetectorClient client, string datasource, DateTimeOffset start_time, DateTimeOffset end_time, int max_tryout = 500)
        {
            try
            {
                Console.WriteLine("Training new model...");

                Console.WriteLine(string.Format("{0} available models before training.", GetModelNumber(client)));

                ModelInfo request = new ModelInfo(datasource, start_time, end_time);
                request.SlidingWindow = 200;

                Console.WriteLine("Training new model...(it may take a few minutes)");
                AnomalyDetectionModel response = client.TrainMultivariateModel(request);
                string trained_model_id = response.ModelId;
                Console.WriteLine(string.Format("Training model id is {0}", trained_model_id));

                // Wait until the model is ready. It usually takes several minutes
                ModelStatus? model_status = null;
                int tryout_count = 1;
                response = client.GetMultivariateModel(trained_model_id);
                while (tryout_count < max_tryout & model_status != ModelStatus.Ready & model_status != ModelStatus.Failed)
                {
                    Thread.Sleep(1000);
                    response = client.GetMultivariateModel(trained_model_id);
                    model_status = response.ModelInfo.Status;
                    Console.WriteLine(string.Format("try {0}, model_id: {1}, status: {2}.", tryout_count, trained_model_id, model_status));
                    tryout_count += 1;
                };

                if (model_status == ModelStatus.Ready)
                {
                    Console.WriteLine("Creating model succeeds.");
                    Console.WriteLine(string.Format("{0} available models after training.", GetModelNumber(client)));
                    return trained_model_id;
                }

                if (model_status == ModelStatus.Failed)
                {
                    Console.WriteLine("Creating model failed.");
                    Console.WriteLine("Errors:");
                    try
                    {
                        Console.WriteLine(string.Format("Error code: {0}, Message: {1}", response.ModelInfo.Errors[0].Code.ToString(), response.ModelInfo.Errors[0].Message.ToString()));
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(string.Format("Get error message fail: {0}", e.Message));
                    }
                }
                return null;
            }
            catch (Exception e)
            {
                Console.WriteLine(string.Format("Train error. {0}", e.Message));
                throw;
            }
        }

        MultivariateDetectionResult BatchDetect(AnomalyDetectorClient client, string datasource, string model_id, DateTimeOffset start_time, DateTimeOffset end_time, int max_tryout = 500)
        {
            try
            {
                Console.WriteLine("Start batch detect...");
                MultivariateBatchDetectionOptions request = new MultivariateBatchDetectionOptions(datasource, 10, start_time, end_time);

                Console.WriteLine("Start batch detection, this might take a few minutes...");
                MultivariateDetectionResult response = client.DetectMultivariateBatchAnomaly(model_id, request);
                string result_id = response.ResultId;
                Console.WriteLine(string.Format("result id is: {0}", result_id));

                // get detection result
                MultivariateDetectionResult resultResponse = client.GetMultivariateBatchDetectionResult(result_id);
                MultivariateBatchDetectionStatus result_status = resultResponse.Summary.Status;
                int tryout_count = 0;
                while (tryout_count < max_tryout & result_status != MultivariateBatchDetectionStatus.Ready & result_status != MultivariateBatchDetectionStatus.Failed)
                {
                    Thread.Sleep(1000);
                    resultResponse = client.GetMultivariateBatchDetectionResult(result_id);
                    result_status = resultResponse.Summary.Status;
                    Console.WriteLine(string.Format("try: {0}, result id: {1} Detection status is {2}", tryout_count, result_id, result_status.ToString()));
                    Console.Out.Flush();
                }

                if (result_status == MultivariateBatchDetectionStatus.Failed)
                {
                    Console.WriteLine("Detection failed.");
                    Console.WriteLine("Errors:");
                    try
                    {
                        Console.WriteLine(string.Format("Error code: {}. Message: {}", resultResponse.Summary.Errors[0].Code.ToString(), resultResponse.Summary.Errors[0].Message.ToString()));
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(string.Format("Get error message fail: {0}", e.Message));
                    }
                    return null;
                }
                return resultResponse;
            }
            catch (Exception e)
            {
                Console.WriteLine(string.Format("Detection error. {0}", e.Message));
                throw;
            }
        }

        void DeleteModel(AnomalyDetectorClient client, string model_id)
        {
            client.DeleteMultivariateModel(model_id);
            int model_number = GetModelNumber(client);
            Console.WriteLine(string.Format("{0} available models after deletion.", model_number));
        }
 
    }
}
```

## Run the application

Run the application with the `dotnet run` command from your application directory.

```dotnetcli
dotnet run
```

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with the resource group.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* [What is the Anomaly Detector API?](../../overview.md)
* [Best practices when using the Anomaly Detector API.](../../concepts/best-practices-multivariate.md)

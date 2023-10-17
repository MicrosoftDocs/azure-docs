---
title: Metrics Advisor C# quickstart
titleSuffix: Azure AI services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-metrics-advisor
ms.topic: include
ms.date: 11/04/2022
ms.author: mbullwin
---

[Reference documentation](/dotnet/api/overview/azure/ai.metricsadvisor-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/src) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.MetricsAdvisor) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/samples/README.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://go.microsoft.com/fwlink/?linkid=2142156"  title="Create a Metrics Advisor resource"  target="_blank">create a Metrics Advisor resource </a> in the Azure portal to deploy your Metrics Advisor instance.  
* Your own SQL database with time series data.
   
> [!TIP]
> * You can find .NET Metrics Advisor samples on [GitHub](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/samples/README.md).
> * It may take 10 to 30 minutes for your Metrics Advisor resource to deploy a service instance for you to use. Select **Go to resource** once it successfully deploys. After deployment, you can start using your Metrics Advisor instance with both the web portal and REST API. 
> * You can find the URL for the REST API in Azure portal, in the **Overview** section of your resource. It will look like this:
> * `https://<instance-name>.cognitiveservices.azure.com/`

## Set up

### Install the client library 

Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Azure.AI.MetricsAdvisor`. Select version `1.0.0`, and then **Install**. 

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `metrics-advisor-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *program.cs*. 

```console
dotnet new console -n metrics-advisor-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```console
dotnet build
```

The build output should contain no warnings or errors. 

```console
...
Build succeeded.
 0 Warning(s)
 0 Error(s)
...
```

If you are using an IDE other than Visual Studio you can install the Metrics Advisor client library for .NET with the following command:

```console
dotnet add package Azure.AI.MetricsAdvisor --version 1.1.0
```

## Environment variables

To successfully make a call against the Anomaly Detector service, you'll need the following values:

|Variable name | Value |
|--------------------------|-------------|
| `METRICS_ADVISOR_ENDPOINT` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Example endpoint: `https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/`|
| `METRICS_ADVISOR_KEY` | The key value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
|`METRICS_ADVISOR_API_KEY` |The key value can be found under **Settings** >  **API keys** when examining your resource from the [Metrics Advisor portal](https://metricsadvisor.azurewebsites.net/). You can use either `KEY1` or `KEY2`.  |
|`SQL_CONNECTION_STRING` | This quickstart requires you to have your own SQL Database + connection string. An example connection string would look similar to the following example:`Data Source=<Server>;Initial Catalog=<db-name>;User ID=<user-name>;Password=<password>` for more information on constructing SQL connection strings, see the [SQL documentation](../../data-feeds-from-different-sources.md#azure-sql-database--sql-server).  |
|`SQL_QUERY`| Unique query specific to your dataset.|

### Create environment variables

Create and assign persistent environment variables for your key and endpoint.

# [Command Line](#tab/command-line)

```CMD
setx METRICS_ADVISOR_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
setx METRICS_ADVISOR_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
setx METRICS_ADVISOR_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
setx SQL_CONNECTION_STRING "REPLACE_WITH_YOUR_UNIQUE_SQL_CONNECTION_STRING" 
setx SQL_QUERY "REPLACE_WITH_YOUR_UNIQUE_SQL_QUERY_BASED_ON_THE_UNDERLYING_STRUCTURE_OF_YOUR_DATA" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('METRICS_ADVISOR_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('METRICS_ADVISOR_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('METRICS_ADVISOR_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
[System.Environment]::SetEnvironmentVariable('SQL_CONNECTION_STRING', 'REPLACE_WITH_YOUR_UNIQUE_SQL_CONNECTION_STRING', 'User')
[System.Environment]::SetEnvironmentVariable('SQL_QUERY', 'REPLACE_WITH_YOUR_UNIQUE_SQL_QUERY_BASED_ON_THE_UNDERLYING_STRUCTURE_OF_YOUR_DATA', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export METRICS_ADVISOR_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
echo export METRICS_ADVISOR_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
echo export METRICS_ADVISOR_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
echo export SQL_CONNECTION_STRING="REPLACE_WITH_YOUR_UNIQUE_SQL_CONNECTION_STRING" >> /etc/environment && source /etc/environment
echo export SQL_QUERY="REPLACE_WITH_YOUR_UNIQUE_SQL_QUERY_BASED_ON_THE_UNDERLYING_STRUCTURE_OF_YOUR_DATA" >> /etc/environment && source /etc/environment
```

---

## Create your application

Edit your program.cs file and replace with the following:

```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System;
using System.Threading.Tasks;
using Azure.AI.MetricsAdvisor.Administration;
using Azure.AI.MetricsAdvisor.Models;
using Azure.AI.MetricsAdvisor.Tests;
using Azure.Core.TestFramework;
using NUnit.Framework;
using static System.Environment;

namespace Azure.AI.MetricsAdvisor.Samples
{
    [LiveOnly]
    public partial class MetricsAdvisorSamples : MetricsAdvisorTestEnvironment
    {
        [Test]
        public async Task CreateAndDeleteDataFeedAsync()
        {
            string endpoint =  GetEnvironmentVariable("METRICS_ADVISOR_ENDPOINT");
            string subscriptionKey = GetEnvironmentVariable("METRICS_ADVISOR_KEY");
            string apiKey = GetEnvironmentVariable("METRICS_ADVISOR_API_KEY");
            var credential = new MetricsAdvisorKeyCredential(subscriptionKey, apiKey);

            var adminClient = new MetricsAdvisorAdministrationClient(new Uri(endpoint), credential);

            #region Snippet:CreateDataFeedAsync
#if SNIPPET
            string sqlServerConnectionString = GetEnvironmentVariable("SQL_CONNECTION_STRING");
            string sqlServerQuery = GetEnvironmentVariable("SQL_QUERY");
#else
            string sqlServerConnectionString = SqlServerConnectionString;
            string sqlServerQuery = SqlServerQuery;
#endif

            var dataFeed = new DataFeed();

#if SNIPPET
            dataFeed.Name = "<dataFeedName>";
#else
            dataFeed.Name = GetUniqueName();
#endif
            dataFeed.DataSource = new SqlServerDataFeedSource(sqlServerConnectionString, sqlServerQuery);
            dataFeed.Granularity = new DataFeedGranularity(DataFeedGranularityType.Daily);

            dataFeed.Schema = new DataFeedSchema();
            dataFeed.Schema.MetricColumns.Add(new DataFeedMetric("cost"));
            dataFeed.Schema.MetricColumns.Add(new DataFeedMetric("revenue"));
            dataFeed.Schema.DimensionColumns.Add(new DataFeedDimension("category"));
            dataFeed.Schema.DimensionColumns.Add(new DataFeedDimension("region"));

            dataFeed.IngestionSettings = new DataFeedIngestionSettings(DateTimeOffset.Parse("2020-01-01T00:00:00Z"));

            Response<DataFeed> response = await adminClient.CreateDataFeedAsync(dataFeed);

            DataFeed createdDataFeed = response.Value;

            Console.WriteLine($"Data feed ID: {createdDataFeed.Id}");
            Console.WriteLine($"Data feed status: {createdDataFeed.Status.Value}");
            Console.WriteLine($"Data feed created time: {createdDataFeed.CreatedOn.Value}");

            Console.WriteLine($"Data feed administrators:");
            foreach (string admin in createdDataFeed.Administrators)
            {
                Console.WriteLine($" - {admin}");
            }

            Console.WriteLine($"Metric IDs:");
            foreach (DataFeedMetric metric in createdDataFeed.Schema.MetricColumns)
            {
                Console.WriteLine($" - {metric.Name}: {metric.Id}");
            }

            Console.WriteLine($"Dimensions:");
            foreach (DataFeedDimension dimension in createdDataFeed.Schema.DimensionColumns)
            {
                Console.WriteLine($" - {dimension.Name}");
            }
            #endregion

            // Delete the created data feed to clean up the Metrics Advisor resource. Do not perform this
            // step if you intend to keep using the data feed.

            await adminClient.DeleteDataFeedAsync(createdDataFeed.Id);
        }

        [Test]
        public async Task GetDataFeedAsync()
        {
            string endpoint = GetEnvironmentVariable("METRICS_ADVISOR_ENDPOINT");
            string subscriptionKey = GetEnvironmentVariable("METRICS_ADVISOR_KEY");
            string apiKey = GetEnvironmentVariable("METRICS_ADVISOR_API_KEY");
            var credential = new MetricsAdvisorKeyCredential(subscriptionKey, apiKey);

            var adminClient = new MetricsAdvisorAdministrationClient(new Uri(endpoint), credential);

            string dataFeedId = DataFeedId;

            Response<DataFeed> response = await adminClient.GetDataFeedAsync(dataFeedId);

            DataFeed dataFeed = response.Value;

            Console.WriteLine($"Data feed status: {dataFeed.Status.Value}");
            Console.WriteLine($"Data feed created time: {dataFeed.CreatedOn.Value}");

            Console.WriteLine($"Data feed administrators:");
            foreach (string admin in dataFeed.Administrators)
            {
                Console.WriteLine($" - {admin}");
            }

            Console.WriteLine($"Metric IDs:");
            foreach (DataFeedMetric metric in dataFeed.Schema.MetricColumns)
            {
                Console.WriteLine($" - {metric.Name}: {metric.Id}");
            }

            Console.WriteLine($"Dimensions:");
            foreach (DataFeedDimension dimension in dataFeed.Schema.DimensionColumns)
            {
                Console.WriteLine($" - {dimension.Name}");
            }
        }

        [Test]
        public async Task UpdateDataFeedAsync()
        {
            string endpoint = GetEnvironmentVariable("METRICS_ADVISOR_ENDPOINT");
            string subscriptionKey = GetEnvironmentVariable("METRICS_ADVISOR_KEY");
            string apiKey = GetEnvironmentVariable("METRICS_ADVISOR_API_KEY");
            var credential = new MetricsAdvisorKeyCredential(subscriptionKey, apiKey);

            var adminClient = new MetricsAdvisorAdministrationClient(new Uri(endpoint), credential);

            string dataFeedId = DataFeedId;

            Response<DataFeed> response = await adminClient.GetDataFeedAsync(dataFeedId);
            DataFeed dataFeed = response.Value;

            string originalDescription = dataFeed.Description;
            dataFeed.Description = "This description was generated by a sample.";

            // Some properties, such as IngestionStartOffset, can be reset to their default value
            // when set to null during an Update operation. Check the API documentation to verify
            // when a property supports this feature.

            TimeSpan? originalStartOffset = dataFeed.IngestionSettings.IngestionStartOffset;
            dataFeed.IngestionSettings.IngestionStartOffset = null;

            response = await adminClient.UpdateDataFeedAsync(dataFeed);
            DataFeed updatedDataFeed = response.Value;

            Console.WriteLine($"Updated description: {updatedDataFeed.Description}");
            Console.WriteLine($"Updated ingestion start offset: {updatedDataFeed.IngestionSettings.IngestionStartOffset}");

            // Undo the changes to leave the data feed unaltered. Skip this step if you intend to keep
            // the changes.

            dataFeed.Description = originalDescription;
            dataFeed.IngestionSettings.IngestionStartOffset = originalStartOffset;

            await adminClient.UpdateDataFeedAsync(dataFeed);
        }

        [Test]
        public async Task GetDataFeedsAsync()
        {
            string endpoint = GetEnvironmentVariable("METRICS_ADVISOR_ENDPOINT");
            string subscriptionKey = GetEnvironmentVariable("METRICS_ADVISOR_KEY");
            string apiKey = GetEnvironmentVariable("METRICS_ADVISOR_API_KEY");
            var credential = new MetricsAdvisorKeyCredential(subscriptionKey, apiKey);

            var adminClient = new MetricsAdvisorAdministrationClient(new Uri(endpoint), credential);

            var filter = new DataFeedFilter()
            {
                Status = DataFeedStatus.Active,
                GranularityType = DataFeedGranularityType.Daily
            };
            var options = new GetDataFeedsOptions()
            {
                Filter = filter,
                MaxPageSize = 5
            };

            int dataFeedCount = 0;

            await foreach (DataFeed dataFeed in adminClient.GetDataFeedsAsync(options))
            {
                Console.WriteLine($"Data feed ID: {dataFeed.Id}");
                Console.WriteLine($"Name: {dataFeed.Name}");
                Console.WriteLine($"Description: {dataFeed.Description}");
                Console.WriteLine();

                // Print at most 5 data feeds.
                if (++dataFeedCount >= 5)
                {
                    break;
                }
            }
        }
    }
}
```

### Run the application

Run the application from your application directory with the `dotnet run` command.

```dotnet
dotnet run
```

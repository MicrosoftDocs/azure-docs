---
title: Metrics Monitor C# quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-advisor
ms.topic: include
ms.date: 10/14/2020
ms.author: mbullwin
---

[Reference documentation](https://aka.ms/azsdk/net/docs/ref/metricsadvisor) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/src) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.MetricsAdvisor) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/samples/README.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://go.microsoft.com/fwlink/?linkid=2142156"  title="Create a Metrics Advisor resource"  target="_blank">create a Metrics Advisor resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to deploy your Metrics Advisor instance.  
  
> [!TIP]
> * You can find .NET Metrics Advisor samples on [GitHub](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/samples/README.md).
> * It may take 10 to 30 minutes for your Metrics Advisor resource to deploy a service instance for you to use. Click **Go to resource** once it successfully deploys. After deployment, you can start using your Metrics Advisor instance with both the web portal and REST API. 
> * You can find the URL for the REST API in Azure portal, in the **Overview** section of your resource. It will look like this:
>    * `https://<instance-name>.cognitiveservices.azure.com/`
   
## Setting up

### Install the client library 

Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Azure.AI.MetricsAdvisor`. Select version `1.0.0-beta.1`, and then **Install**. 

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

### Install the client library 

If you are using an IDE other than Visual Studio you can install the Metrics Advisor client library for .NET with the following command:

```console
dotnet add package Azure.AI.MetricsAdvisor --version 1.0.0-beta.1
```

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.MetricsAdvisor_1.0.0-beta.1/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/samples), which contains the code examples in this quickstart.

From the project directory, open the *program.cs* file and add the following `using` directives:

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Azure.AI.MetricsAdvisor.Administration;
using Azure.AI.MetricsAdvisor.Models;
```

In the application’s `Main()` method, add calls for the methods used in this quickstart. You will create these later.

```csharp
static void Main(string[] args){
    // You will create the below methods later in the quickstart
    exampleTask1();
}
```

## Object model

The following classes handle some of the major features of the Metrics Advisor C# SDK.

|Name|Description|
|---|---|
| [MetricsAdvisorClient](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/src/MetricsAdvisorClient.cs) | **Used for**: <br> - Listing incidents <br> - Listing root cause of incidents <br> - Retrieving original time series data and time series data enriched by the service. <br> - Listing alerts <br> - Adding feedback to tune your model |
| [MetricsAdvisorAdministrationClient](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/src/MetricsAdvisorAdministrationClient.cs)| **Allows you to:** <br> - Manage data feeds <br> - Configure anomaly detection configurations <br> - Configure anomaly alerting configurations <br> - Manage hooks  |
| [DataFeed](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/src/Models/DataFeed/DataFeed.cs)| **What Metrics Advisor ingests from your datasource. A `DataFeed` contains rows of:** <br> - Timestamps <br> - Zero or more dimensions <br> - One or more measures  |
| [Metric](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/src/Models/DataFeedMetric.cs)| A `Metric` is a quantifiable measure that is used to monitor and assess the status of a specific business process. It can be a combination of multiple time series values divided into dimensions. For example a web health metric might contain dimensions for user count and the en-us market. |

## Code examples

These code snippets show you how to do the following tasks with the Metrics Advisor client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Add a datafeed](#add-datafeed)
* [Check the ingestion status](#check-the-ingestion-status)
* [Configure anomaly detection](#configure-anomaly-detection)
* [Create a hook](#create-a-hook)
* [Create an alert configuration](#create-an-alert-configuration)
* [Query the alert](#query-the-alert)

## Authenticate the client

In the application's `Program` class, create variables for your resource's keys and endpoint.

> [!IMPORTANT]
> Go to the Azure portal. If the Metrics Advisor resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**. 
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-security) article for more information.

Once you have the subscription and API keys, create a MetricsAdvisorKeyCredential. With the endpoint and the key credential, you can create a [`MetricsAdvisorClient`](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/src/MetricsAdvisorClient.cs):

```csharp
string endpoint = "<endpoint>";
string subscriptionKey = "<subscriptionKey>";
string apiKey = "<apiKey>";
var credential = new MetricsAdvisorKeyCredential(subscriptionKey, apiKey);
var client = new MetricsAdvisorClient(new Uri(endpoint), credential);
```

You can also create a [`MetricsAdvisorAdministrationClient`](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/src/MetricsAdvisorAdministrationClient.cs) to perform administration operations:

```csharp
string endpoint = "<endpoint>";
string subscriptionKey = "<subscriptionKey>";
string apiKey = "<apiKey>";
var credential = new MetricsAdvisorKeyCredential(subscriptionKey, apiKey);
var adminClient = new MetricsAdvisorAdministrationClient(new Uri(endpoint), credential);
```

## Add a data feed

Metrics Advisor supports multiple types of data sources. In this sample we'll illustrate how to create a `DataFeed` that extracts data from a SQL server.

```csharp
string sqlServerConnectionString = "<connectionString>";
string sqlServerQuery = "<query>";

var dataFeedName = "Sample data feed";
var dataFeedSource = new MySqlDataFeedSource(sqlServerConnectionString, sqlServerQuery);
var dataFeedGranularity = new DataFeedGranularity(DataFeedGranularityType.Daily);

var dataFeedMetrics = new List<DataFeedMetric>()
{
    new DataFeedMetric("cost"),
    new DataFeedMetric("revenue")
};
var dataFeedDimensions = new List<MetricDimension>()
{
    new MetricDimension("category"),
    new MetricDimension("city")
};
var dataFeedSchema = new DataFeedSchema(dataFeedMetrics)
{
    DimensionColumns = dataFeedDimensions
};

var ingestionStartTime = DateTimeOffset.Parse("2020-01-01T00:00:00Z");
var dataFeedIngestionSettings = new DataFeedIngestionSettings(ingestionStartTime);

Response<DataFeed> response = await adminClient.CreateDataFeedAsync(dataFeedName, dataFeedSource,
    dataFeedGranularity, dataFeedSchema, dataFeedIngestionSettings);

DataFeed dataFeed = response.Value;

Console.WriteLine($"Data feed ID: {dataFeed.Id}");

// Only the ID of the data feed is known at this point. You can perform another service
// call to get more information, such as status, created time, the list of administrators,
// or the metric IDs.

response = await adminClient.GetDataFeedAsync(dataFeed.Id);

dataFeed = response.Value;

Console.WriteLine($"Data feed status: {dataFeed.Status.Value}");
Console.WriteLine($"Data feed created time: {dataFeed.CreatedTime.Value}");

Console.WriteLine($"Data feed administrators:");
foreach (string admin in dataFeed.Options.Administrators)
{
    Console.WriteLine($" - {admin}");
}

Console.WriteLine($"Metric IDs:");
foreach (DataFeedMetric metric in dataFeed.Schema.MetricColumns)
{
    Console.WriteLine($" - {metric.MetricName}: {metric.MetricId}");
}
```

## Check the ingestion status

Check the ingestion status of a previously created `DataFeed`

```csharp
string dataFeedId = "<dataFeedId>";

var startTime = DateTimeOffset.Parse("2020-01-01T00:00:00Z");
var endTime = DateTimeOffset.Parse("2020-09-09T00:00:00Z");
var options = new GetDataFeedIngestionStatusesOptions(startTime, endTime);

Console.WriteLine("Ingestion statuses:");
Console.WriteLine();

int statusCount = 0;

await foreach (DataFeedIngestionStatus ingestionStatus in adminClient.GetDataFeedIngestionStatusesAsync(dataFeedId, options))
{
    Console.WriteLine($"Timestamp: {ingestionStatus.Timestamp}");
    Console.WriteLine($"Status: {ingestionStatus.Status.Value}");
    Console.WriteLine($"Service message: {ingestionStatus.Message}");
    Console.WriteLine();

    // Print at most 10 statuses.
    if (++statusCount >= 10)
    {
        break;
    }
}
```

## Configure anomaly detection 

Create an anomaly detection configuration to tell the service which data points should be considered anomalies.

```csharp
string metricId = "<metricId>";
string configurationName = "Sample anomaly detection configuration";

var hardThresholdSuppressCondition = new SuppressCondition(1, 100);
var hardThresholdCondition = new HardThresholdCondition(AnomalyDetectorDirection.Down, hardThresholdSuppressCondition)
{
    LowerBound = 5.0
};

var smartDetectionSuppressCondition = new SuppressCondition(4, 50);
var smartDetectionCondition = new SmartDetectionCondition(10.0, AnomalyDetectorDirection.Up, smartDetectionSuppressCondition);

var detectionCondition = new MetricWholeSeriesDetectionCondition()
{
    HardThresholdCondition = hardThresholdCondition,
    SmartDetectionCondition = smartDetectionCondition,
    CrossConditionsOperator = DetectionConditionsOperator.Or
};

var detectionConfiguration = new AnomalyDetectionConfiguration(metricId, configurationName, detectionCondition);

Response<AnomalyDetectionConfiguration> response = await adminClient.CreateMetricAnomalyDetectionConfigurationAsync(detectionConfiguration);

detectionConfiguration = response.Value;

Console.WriteLine($"Anomaly detection configuration ID: {detectionConfiguration.Id}");
```

### Create a hook

Metrics Advisor supports the `EmailHook` and `WebHook` classes as means of subscribing to alerts notifications. In this example we'll illustrate how to create an `EmailHook`. You need to pass the hook to an anomaly alert configuration to start getting notifications. See the sample [create an anomaly alert configuration](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor#create-an-anomaly-alert-configuration) for more information.

```csharp
string hookName = "Sample hook";
var emailsToAlert = new List<string>()
{
    "email1@sample.com",
    "email2@sample.com"
};

var emailHook = new EmailNotificationHook(hookName, emailsToAlert);

Response<NotificationHook> response = await adminClient.CreateHookAsync(emailHook);

NotificationHook hook = response.Value;

Console.WriteLine($"Hook ID: {hook.Id}");
```

##  Create an alert configuration

Create an `AnomalyAlertConfiguration` to tell the service which anomalies should trigger alerts.

```csharp
string hookId = "<hookId>";
string anomalyDetectionConfigurationId = "<anomalyDetectionConfigurationId>";

string configurationName = "Sample anomaly alert configuration";
var idsOfHooksToAlert = new List<string>() { hookId };

var scope = MetricAnomalyAlertScope.GetScopeForWholeSeries();
var metricAlertConfigurations = new List<MetricAnomalyAlertConfiguration>()
{
    new MetricAnomalyAlertConfiguration(anomalyDetectionConfigurationId, scope)
};

AnomalyAlertConfiguration alertConfiguration = new AnomalyAlertConfiguration(configurationName, idsOfHooksToAlert, metricAlertConfigurations);

Response<AnomalyAlertConfiguration> response = await adminClient.CreateAnomalyAlertConfigurationAsync(alertConfiguration);

alertConfiguration = response.Value;

Console.WriteLine($"Alert configuration ID: {alertConfiguration.Id}");
```

### Query the alert

Look through the alerts created by a given anomaly alert configuration, and list the anomalies that triggered these alerts.

```csharp
string anomalyAlertConfigurationId = "<anomalyAlertConfigurationId>";

var startTime = DateTimeOffset.Parse("2020-01-01T00:00:00Z");
var endTime = DateTimeOffset.UtcNow;
var options = new GetAlertsOptions(startTime, endTime, TimeMode.AnomalyTime);

int alertCount = 0;

await foreach (AnomalyAlert alert in client.GetAlertsAsync(anomalyAlertConfigurationId, options))
{
    Console.WriteLine($"Alert at timestamp: {alert.Timestamp}");
    Console.WriteLine($"Id: {alert.Id}");
    Console.WriteLine($"Anomalies that triggered this alert:");

    await foreach (DataAnomaly anomaly in client.GetAnomaliesForAlertAsync(anomalyAlertConfigurationId, alert.Id))
    {
        Console.WriteLine("  Anomaly:");
        Console.WriteLine($"    Status: {anomaly.Status.Value}");
        Console.WriteLine($"    Severity: {anomaly.Severity}");
        Console.WriteLine($"    Series key:");

        foreach (KeyValuePair<string, string> keyValuePair in anomaly.SeriesKey.AsDictionary())
        {
            Console.WriteLine($"      Dimension '{keyValuePair.Key}': {keyValuePair.Value}");
        }

        Console.WriteLine();
    }

    // Print at most 3 alerts.
    if (++alertCount >= 3)
    {
        break;
    }
}
```

## Run the application

Run the application from your application directory with the `dotnet run` command.

```dotnet
dotnet run
```
---
title: Metrics Advisor C# quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-advisor
ms.topic: include
ms.date: 11/09/2020
ms.author: mbullwin
---

[Reference documentation](/dotnet/api/overview/azure/ai.metricsadvisor-readme-pre) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/src) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.MetricsAdvisor) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/samples/README.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://go.microsoft.com/fwlink/?linkid=2142156"  title="Create a Metrics Advisor resource"  target="_blank">create a Metrics Advisor resource </a> in the Azure portal to deploy your Metrics Advisor instance.  
* Your own SQL database with time series data.
   
> [!TIP]
> * You can find .NET Metrics Advisor samples on [GitHub](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/samples/README.md).
> * It may take 10 to 30 minutes for your Metrics Advisor resource to deploy a service instance for you to use. Click **Go to resource** once it successfully deploys. After deployment, you can start using your Metrics Advisor instance with both the web portal and REST API. 
> * You can find the URL for the REST API in Azure portal, in the **Overview** section of your resource. It will look like this:
>    * `https://<instance-name>.cognitiveservices.azure.com/`
   
## Setting up

### Install the client library 

Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Azure.AI.MetricsAdvisor`. Select version `1.0.0-beta.2`, and then **Install**. 

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
dotnet add package Azure.AI.MetricsAdvisor --version 1.0.0-beta.2
```

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure/azure-sdk-for-net/tree/Azure.AI.MetricsAdvisor_1.0.0-beta.1/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/samples), which contains the code examples in this quickstart.

From the project directory, open the *program.cs* file and add the following `using` directives:

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Azure.AI.MetricsAdvisor.Administration;
using Azure.AI.MetricsAdvisor;
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
| [DataFeedMetric](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/src/Models/DataFeed/DataFeedMetric.cs)| A `DataFeedMetric` is a quantifiable measure that is used to monitor and assess the status of a specific business process. It can be a combination of multiple time series values divided into dimensions. For example a web health metric might contain dimensions for user count and the en-us market. |

## Code examples

These code snippets show you how to do the following tasks with the Metrics Advisor client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Add a data feed](#add-a-data-feed)
* [Check the ingestion status](#check-the-ingestion-status)
* [Configure anomaly detection](#configure-anomaly-detection)
* [Create a hook](#create-a-hook)
* [Create an alert configuration](#create-an-alert-configuration)
* [Query the alert](#query-the-alert)

## Authenticate the client

In the application's `Program` class, create variables for your resource's keys and endpoint.

> [!IMPORTANT]
> Go to the Azure portal. If the Metrics Advisor resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your subscription keys and endpoint in the resource's **Key and Endpoint** page, under **Resource Management**. <br><br>To retrieve your API key you must go to [https://metricsadvisor.azurewebsites.net](https://metricsadvisor.azurewebsites.net). Select the appropriate: **Directory**, **Subscriptions**, and **Workspace** for your resource and choose **Get started**. You will then be able to retrieve your API keys from [https://metricsadvisor.azurewebsites.net/api-key](https://metricsadvisor.azurewebsites.net/api-key).   
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](../../../cognitive-services-security.md) article for more information.

Once you have the subscription and API keys, create a MetricsAdvisorKeyCredential. With the endpoint and the key credential, you can create a [`MetricsAdvisorClient`](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/src/MetricsAdvisorClient.cs):

```csharp
string endpoint = "<endpoint>";
string subscriptionKey = "<subscriptionKey>";
string apiKey = "<apiKey>";
var credential = new MetricsAdvisorKeyCredential(subscriptionKey, apiKey);
var client = new MetricsAdvisorClient(new Uri(endpoint), credential);
```

You can also create a [`MetricsAdvisorAdministrationClient`](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/src/MetricsAdvisorAdministrationClient.cs) to perform administrative operations:

```csharp
string endpoint = "<endpoint>";
string subscriptionKey = "<subscriptionKey>";
string apiKey = "<apiKey>";
var credential = new MetricsAdvisorKeyCredential(subscriptionKey, apiKey);
var adminClient = new MetricsAdvisorAdministrationClient(new Uri(endpoint), credential);
```

## Add a data feed

Metrics Advisor supports multiple types of data sources. In this sample we'll illustrate how to create a `DataFeed` that extracts data from a SQL server. Replace `connection_String` with your own SQL server connection string, and replace `query` with a query that returns your data at a single timestamp. You will also need to adjust the `DataFeedMetric` and `DataFeedDimension` values based on your custom data.


```csharp
string sqlServerConnectionString = "<connection_String>";
string sqlServerQuery = "<query>";

var dataFeedName = "Sample data feed";
var dataFeedSource = new SqlServerDataFeedSource(sqlServerConnectionString, sqlServerQuery);
var dataFeedGranularity = new DataFeedGranularity(DataFeedGranularityType.Daily);

var dataFeedMetrics = new List<DataFeedMetric>()
{
    new DataFeedMetric("cost"),
    new DataFeedMetric("revenue")
};
var dataFeedDimensions = new List<DataFeedDimension>()
{
    new DataFeedDimension("category"),
    new DataFeedDimension("city")
};
var dataFeedSchema = new DataFeedSchema(dataFeedMetrics)
{
    DimensionColumns = dataFeedDimensions
};

var ingestionStartTime = DateTimeOffset.Parse("2020-01-01T00:00:00Z");
var dataFeedIngestionSettings = new DataFeedIngestionSettings(ingestionStartTime);

var dataFeed = new DataFeed(dataFeedName, dataFeedSource, dataFeedGranularity, dataFeedSchema, dataFeedIngestionSettings);

Response<string> response = await adminClient.CreateDataFeedAsync(dataFeed);

string dataFeedId = response.Value;

Console.WriteLine($"Data feed ID: {dataFeedId}");

// Note that only the ID of the data feed is known at this point. You can perform another
// service call to GetDataFeedAsync or GetDataFeed to get more information, such as status,
// created time, the list of administrators, or the metric IDs.

Response<DataFeed> response = await adminClient.GetDataFeedAsync(dataFeedId);

DataFeed dataFeed = response.Value;

Console.WriteLine($"Data feed status: {dataFeed.Status.Value}");
Console.WriteLine($"Data feed created time: {dataFeed.CreatedTime.Value}");

Console.WriteLine($"Data feed administrators:");
foreach (string admin in dataFeed.Administrators)
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
var options = new GetDataFeedIngestionStatusesOptions(startTime, endTime)
{
    TopCount = 5
};

Console.WriteLine("Ingestion statuses:");
Console.WriteLine();

int statusCount = 0;

await foreach (DataFeedIngestionStatus ingestionStatus in adminClient.GetDataFeedIngestionStatusesAsync(dataFeedId, options))
{
    Console.WriteLine($"Timestamp: {ingestionStatus.Timestamp}");
    Console.WriteLine($"Status: {ingestionStatus.Status}");
    Console.WriteLine($"Service message: {ingestionStatus.Message}");
    Console.WriteLine();

    // Print at most 5 statuses.
    if (++statusCount >= 5)
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

Response<string> response = await adminClient.CreateDetectionConfigurationAsync(detectionConfiguration);

string detectionConfigurationId = response.Value;

Console.WriteLine($"Anomaly detection configuration ID: {detectionConfigurationId}");
```

### Create a hook

Metrics Advisor supports the `EmailNotificationHook` and `WebNotificationHook` classes as means of subscribing to alerts notifications. In this example we'll illustrate how to create an `EmailNotificationHook`. You need to pass the hook to an anomaly alert configuration to start getting notifications. See the sample [create an anomaly alert configuration](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor#create-an-anomaly-alert-configuration) for more information.

```csharp
string hookName = "Sample hook";
var emailsToAlert = new List<string>()
{
    "email1@sample.com",
    "email2@sample.com"
};

var emailHook = new EmailNotificationHook(hookName, emailsToAlert);

Response<string> response = await adminClient.CreateHookAsync(emailHook);

string hookId = response.Value;

Console.WriteLine($"Hook ID: {hookId}");
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

Response<string> response = await adminClient.CreateAlertConfigurationAsync(alertConfiguration);

string alertConfigurationId = response.Value;

Console.WriteLine($"Alert configuration ID: {alertConfigurationId}");
```

### Query the alert

Look through the alerts created by a given anomaly alert configuration.

```csharp
string anomalyAlertConfigurationId = "<anomalyAlertConfigurationId>";

var startTime = DateTimeOffset.Parse("2020-01-01T00:00:00Z");
var endTime = DateTimeOffset.UtcNow;
var options = new GetAlertsOptions(startTime, endTime, AlertQueryTimeMode.AnomalyTime)
{
    TopCount = 5
};

int alertCount = 0;

await foreach (AnomalyAlert alert in client.GetAlertsAsync(anomalyAlertConfigurationId, options))
{
    Console.WriteLine($"Alert created at: {alert.CreatedTime}");
    Console.WriteLine($"Alert at timestamp: {alert.Timestamp}");
    Console.WriteLine($"Id: {alert.Id}");
    Console.WriteLine();

    // Print at most 5 alerts.
    if (++alertCount >= 5)
    {
        break;
    }
}
```

Once you know an alert's ID, list the [anomalies](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/metricsadvisor/Azure.AI.MetricsAdvisor/README.md#data-point-anomaly) that triggered this alert.

```csharp
string alertConfigurationId = "<alertConfigurationId>";
string alertId = "<alertId>";

var options = new GetAnomaliesForAlertOptions() { TopCount = 3 };

int anomalyCount = 0;

await foreach (DataPointAnomaly anomaly in client.GetAnomaliesAsync(alertConfigurationId, alertId, options))
{
    Console.WriteLine($"Anomaly detection configuration ID: {anomaly.AnomalyDetectionConfigurationId}");
    Console.WriteLine($"Metric ID: {anomaly.MetricId}");
    Console.WriteLine($"Anomaly at timestamp: {anomaly.Timestamp}");
    Console.WriteLine($"Anomaly detected at: {anomaly.CreatedTime}");
    Console.WriteLine($"Status: {anomaly.Status}");
    Console.WriteLine($"Severity: {anomaly.Severity}");
    Console.WriteLine("Series key:");

    foreach (KeyValuePair<string, string> keyValuePair in anomaly.SeriesKey.AsDictionary())
    {
        Console.WriteLine($"  Dimension '{keyValuePair.Key}': {keyValuePair.Value}");
    }

    Console.WriteLine();

    // Print at most 3 anomalies.
    if (++anomalyCount >= 3)
    {
        break;
    }
}
```


### Run the application

Run the application from your application directory with the `dotnet run` command.

```dotnet
dotnet run
```
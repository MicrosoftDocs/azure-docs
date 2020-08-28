---
title: Metrics Monitor C# quickstart
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: metrics-advisor
ms.topic: include
ms.date: 07/30/2020
ms.author: aahi
---

[Reference documentation](https://docs.microsoft.com/dotnet/api/Microsoft.Azure.CognitiveServices.AnomalyDetector?view=azure-dotnet-preview) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/AnomalyDetector) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.AnomalyDetector/) | [Samples](https://github.com/Azure-Samples/anomalydetector)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Metrics Advisor resource"  target="_blank">create a Metrics Advisor resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to Metrics Advisor. You'll paste your key and endpoint into the code below later in the quickstart.
    You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
   
## Setting up

### Install the client library 

Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `[package-name]`. Select version `[version]`, and then **Install**. 

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

Within the application directory, install the Metrics Advisor client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.[ TBD] --version x.y
```

---

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](), which contains the code examples in this quickstart.

From the project directory, open the *program.cs* file and add the following `using` directives:

```csharp
using ...
using ...
```

In the application's `Program` class, create variables for your resource's key and endpoint.

> [!IMPORTANT]
> Go to the Azure portal. If the Metrics Advisor resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**. 
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-security) article for more information.



```csharp
private static readonly AzureKeyCredential credentials = new AzureKeyCredential("<replace-with-your-metrics-advisor-key-here>");
private static readonly Uri endpoint = new Uri("<replace-with-your-metrics-advisor-endpoint-here>");
```

in the application’s `main()` method, add calls for the methods used in this quickstart. You will create these later.

```csharp
static void Main(string[] args){
    // You will create the below methods later in the quickstart
    exampleTask1();
}
```

## Object model

## Code examples

These code snippets show you how to do the following tasks with the Metrics Adivsor client library for .NET:

* [Authenticate the client](#)
* [Check ingestion status](#)
* [Setup detection configuration and alert configuration](#)
* [Query anomaly detection results](#)
* [Diagnose Anomalies](#)

### Authenticate the client

In a new method, instantiate a client with your endpoint and key. Create an object with your key, and use it with your endpoint to create an [ApiClient]() object.

```csharp

```

### Add a data feed from a sample or data source

### Check ingestion status

###	Setup detection configuration and alert configuration

###	Query anomaly detection results

###	Diagnose anomalies


## Run the application

Run the application from your application directory with the `dotnet run` command.

```dotnet
dotnet run
```

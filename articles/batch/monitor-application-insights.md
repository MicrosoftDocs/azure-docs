---
title: Monitor Batch with Azure Application Inisghts | Microsoft Docs
description: Learn about how to instrument an Azure Batch solution with Azure Application Insights.
services: batch
author: paselem
manager: jeconnoc

ms.assetid: 
ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.workload: na
ms.date: 03/16/2018
ms.author: danlep
---

# Monitor and debug an Azure Batch application with Application Insights

[Application Insights](../application-insights/app-insights-overview.md) provides an elegant and powerful way for developers to monitor and debug 
applications deployed to Azure services. Using Application Insights you can 
monitor performance counters and exceptions as well as instrument your code 
with custom metrics and tracing. Integrating Application Insights with your 
Azure Batch application allows you to gain deep insights into behaviors 
and investigate issues in near-real-time.

This article shows how to add and configure the Application Insights library 
into your Azure Batch .NET solution and instrument your application code. It also provides
examples on how to monitor your application via the Azure portal and build 
custom dashboards.

A sample C-sharp solution is available on [GitHub](https://github.com/Azure/azure-batch-samples/tree/master/CSharp/ArticleProjects/ApplicationInsights).

## Prerequisites
* [Batch account](batch-account-create-portal.md)
* [Application Insights resource](../application-insights/app-insights-create-new-resource.md)
  
  To persist your application logs and performance counters, you must create an Application Insights resource where Azure stores data.

  Copy the [instrumentation 
key](../application-insights/app-insights-create-new-resource.md#copy-the-instrumentation-key) from the portal. It is required later in this article.
  
  > [!NOTE]
  > You may be [charged](https://azure.microsoft.com/pricing/details/application-insights/) for the data stored in your Application Insights account. 
  > This includes the diagnostic and monitoring data discussed in this article.
  > 

## Add Application Insights to your project

Add the Microsoft.ApplicationInsights.WindowsServer NuGet package to your application's project.

```powershell
PM> Install-Package Microsoft.ApplicationInsights.WindowsServer
```

## Instrumenting your code

Now that you have added the required packages to your project, you can reference them using the **Microsoft.ApplicationInsights** namespace.

First off, we'll need to update the ApplicationInsights.config file with your instrumentation key.

```xml
<InstrumentationKey>YOUR-KEY-GOES-HERE</InstrumentationKey>
```

This example uses the following instrumentation calls:
* TrackMetric() to understand how long, on average, a Compute Node takes to download the required text file.
* TrackTrace() to add debugging calls to our code.
* TrackEvent() to track interesting events we want to capture.

We also inherently track exceptions. This sample purposely leaves out exception 
handling to see how Application Insights automatically reports unhandled 
exceptions for us and significantly improves the debugging experience. The 
following sample illustrates how to use these methods.

```csharp
public void CountWords(string blobName, int numTopN, string storageAccountName, string storageAccountKey)
{
    // simulate exception for some  set of tasks
    Random rand = new Random();
    if (rand.Next(0, 10) % 10 == 0)
    {
        blobName += ".badUrl";
    }

    // log the url we are downloading the file from
    insightsClient.TrackTrace(new TraceTelemetry(string.Format("Task {0}: Download file from: {1}", this.taskId, blobName), SeverityLevel.Verbose));

    // open the cloud blob that contains the book
    var storageCred = new StorageCredentials(storageAccountName, storageAccountKey);
    CloudBlockBlob blob = new CloudBlockBlob(new Uri(blobName), storageCred);
    using (Stream memoryStream = new MemoryStream())
    {
        // calculate blob download time
        DateTime start = DateTime.Now;
        blob.DownloadToStream(memoryStream);
        TimeSpan downloadTime = DateTime.Now.Subtract(start);

        // track how long the blob takes to download on this node
        // this will help debug timing issues or identify poorly performing nodes
        insightsClient.TrackMetric("Blob download in seconds", downloadTime.TotalSeconds, this.CommonProperties);

        memoryStream.Position = 0; //Reset the stream
        var sr = new StreamReader(memoryStream);
        var myStr = sr.ReadToEnd();
        string[] words = myStr.Split(' ');

        // log how many words were found in the text file
        insightsClient.TrackTrace(new TraceTelemetry(string.Format("Task {0}: Found {1} words", this.taskId, words.Length), SeverityLevel.Verbose));
        var topNWords =
            words.
                Where(word => word.Length > 0).
                GroupBy(word => word, (key, group) => new KeyValuePair<String, long>(key, group.LongCount())).
                OrderByDescending(x => x.Value).
                Take(numTopN).
                ToList();
        foreach (var pair in topNWords)
        {
            Console.WriteLine("{0} {1}", pair.Key, pair.Value);
        }

        // emit an event to track the completion of the task
        insightsClient.TrackEvent("Done counting words");
    }
}
```

### Azure Batch telemetry initializer helper
When reporting telemetry for a given server and instance, Application Insights 
uses the Azure VM Role and VM name for the default values. Since we're running 
in the context of Azure Batch, we would like to use the Pool name and Compute 
Node name instead. A telemetry initializer allows us to override the default 
values. You can learn more about telemetry initializers 
[here](http://apmtips.com/blog/2014/12/01/telemetry-initializers/) or see an 
example on [github](https://github.com/Microsoft/ApplicationInsights-dotnet-server/blob/develop/Src/WindowsServer/WindowsServer.Shared/AzureWebAppRoleEnvironmentTelemetryInitializer.cs).

```csharp

using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using System;
using System.Threading;

namespace Microsoft.Azure.Batch.Samples.TopNWordsSample
{
    public class AzureBatchNodeTelemetryInitializer : ITelemetryInitializer
    {
        // Azure Batch environment variables
        private const string PoolIdEnvironmentVariable = "AZ_BATCH_POOL_ID";
        private const string NodeIdEnvironmentVariable = "AZ_BATCH_NODE_ID";

        private string roleInstanceName;
        private string roleName;

        public void Initialize(ITelemetry telemetry)
        {
            if (string.IsNullOrEmpty(telemetry.Context.Cloud.RoleName))
            {
                // override the role name with the Azure Batch Pool name
                string name = LazyInitializer.EnsureInitialized(ref this.roleName, this.GetPoolName);
                telemetry.Context.Cloud.RoleName = name;
            }

            if (string.IsNullOrEmpty(telemetry.Context.Cloud.RoleInstance))
            {
                // override the role instance with the Azure Batch Compute Node name
                string name = LazyInitializer.EnsureInitialized(ref this.roleInstanceName, this.GetNodeName);
                telemetry.Context.Cloud.RoleInstance = name;
            }
        }

        private string GetPoolName()
        {
            return Environment.GetEnvironmentVariable(PoolIdEnvironmentVariable) ?? string.Empty;
        }

        private string GetNodeName()
        {
            return Environment.GetEnvironmentVariable(NodeIdEnvironmentVariable) ?? string.Empty;
        }
    }
}
```

To enable the telemetry initializer update the Application Insights config.

```xml
<TelemetryInitializers>
    <Add Type="Microsfot.Azure.Batch.Samples.TopNWordsSample.AzureBatchNodeTelemetryInitializer, TopNWordsSample"/>
</TelemetryInitializers>
```

## Update your job and tasks to include the necessary binaries

In order for Application Insights to run correctly on your Compute Nodes, you 
must make sure the binaries are correctly placed. Add the required 
binaries to your task's resource files collection and they will get downloaded 
when your task executes.

First, create a static list of files we need to upload.
```csharp
// application insights config file and assemblies
private const string AIConfig = "ApplicationInsights.config";
private const string AIDllName = "Microsoft.ApplicationInsights.dll";
private const string AIInterceptDllAgentName = "Microsoft.AI.Agent.Intercept.dll";
private const string AIDependencyCollectorName = "Microsoft.AI.DependencyCollector.dll";
private const string AIPerfCounterCollectorName = "Microsoft.AI.PerfCounterCollector.dll";
private const string AIServerTelemetryName = "Microsoft.AI.ServerTelemetryChannel.dll";
private const string AIWindowsServerName = "Microsoft.AI.WindowsServer.dll";
```

Next, create the staging files that are used by the task.
```csharp
// create file staging objects that represent the executable and its dependent assembly to run as the task.
// These files are copied to every node before the corresponding task is scheduled to run on that node.
FileToStage topNWordExe = new FileToStage(TopNWordsExeName, stagingStorageAccount);
FileToStage storageDll = new FileToStage(StorageClientDllName, stagingStorageAccount);

// Upload application insights assemblies
FileToStage applicationInsightsConfig = new FileToStage(AIConfig, stagingStorageAccount);
FileToStage applicationInsightsDll = new FileToStage(AIDllName, stagingStorageAccount);
FileToStage applicationInsightsCollectorDll = new FileToStage(AIDependencyCollectorName, stagingStorageAccount);
FileToStage applicationInsightsInterceptorDll = new FileToStage(AIInterceptDllAgentName, stagingStorageAccount);
FileToStage applicationInsightsPerfCounterCollectorDll = new FileToStage(AIPerfCounterCollectorName, stagingStorageAccount);
FileToStage applicationInsightsServerTelemetryDll = new FileToStage(AIServerTelemetryName, stagingStorageAccount);
FileToStage applicationInsightsWindowsServerDll = new FileToStage(AIWindowsServerName, stagingStorageAccount);
```

> The FileToStage method is a helper function in the code 
> sample that allows you to easily upload a file from local disk to an 
> Azure Storage blob. This is later referenced downloaded to a Compute Node 
> and referenced by a task.

Finally add the tasks to the job and include the necessary Application Insights binaries.
```csharp
// initialize a collection to hold the tasks that will be submitted in their entirety
List<CloudTask> tasksToRun = new List<CloudTask>(topNWordsConfiguration.NumberOfTasks);
for (int i = 1; i <= topNWordsConfiguration.NumberOfTasks; i++)
{
    CloudTask task = new CloudTask("task_no_" + i, String.Format("{0} --Task {1} {2} {3} {4}",
        TopNWordsExeName,
        bookFileUri,
        topNWordsConfiguration.TopWordCount,
        accountSettings.StorageAccountName,
        accountSettings.StorageAccountKey));

    //This is the list of files to stage to a container -- for each job, one container is created and 
    //files all resolve to Azure Blobs by their name (so two tasks with the same named file will create just 1 blob in
    //the container).
    task.FilesToStage = new List<IFileStagingProvider>
                        {
                            // required application binaries
                            topNWordExe,
                            storageDll,
                            // Application Insights config file an binaries
                            applicationInsightsConfig,
                            applicationInsightsDll,
                            applicationInsightsCollectorDll,
                            applicationInsightsInterceptorDll,
                            applicationInsightsPerfCounterCollectorDll,
                            applicationInsightsServerTelemetryDll,
                            applicationInsightsWindowsServerDll
                        };

    task.RunElevated = false;
    tasksToRun.Add(task);
}
```

## Viewing data in the Azure portal

Now that we have our job and tasks configured to use Application Insights, run 
the job in your pool. Navigate to the Azure portal and open the Application 
Insghts service that you provisioned. At this point, you should start to see 
data flowing and getting logged. In this article we'll only touch on a few 
features, but feel free to explore the full feature set provided by the 
Application Insights service.

### View live stream data

The following screenshot shows how we can view live data coming from the 
Compute Nodes in the pool, for example the CPU usage per Compute Node.

![Live stream compute node data](./media/batch-monitoring-with-application-insights/ApplicationInsightsLiveStream.png)

### Viewing trace logs

Opening up the Search blade in the portal reveals a list of diagnostic data 
captured by Application Insights including traces, events, exceptions, and more. 
In the following screenshot, we see how a single trace for a task is logged and 
can later be queried for debugging purposes.

![Trace logs image](./media/batch-monitoring-with-application-insights/TraceLogsForTask.png)

### View unhandled exceptions

The following image shows how Application Insights logs exceptions thrown from your application. In this case, within seconds of the application throwing the exception we are able to drill into a specific exception and diagnose the issue.

![Unhandled exceptions](./media/batch-monitoring-with-application-insights/Exception.png)

### Measuring blob download time

Custom metrics are also a valuable tool in the portal. The following image shows how the average time it took each Compute Node to download the required text file it was operating against.

![Blob download time per node](./media/batch-monitoring-with-application-insights/BlobDownloadTime.png)

To create a chart such as the one above you can:
1. Open the Metrics blade in your Application Insights account.
2. Click 'Add chart'.
3. Click 'Edit' on the chart that was added.
4. Update the chart details as shown in the image above.

## Getting performance counters from Compute Nodes when no tasks are running

You may have noticed that all metrics, including performance counters are only 
logged when the tasks are running. This behavior is useful because it limits 
data getting logged to your Application Insights account. There are cases 
when you would always like to monitor the Compute Nodes, for example they are 
running background work which is not scheduled via the Batch service. In this 
case it can be useful to have a monitoring process running for the life of the 
Compute Node. One way to achieve this behavior is to spawn a process that loads 
the Application Insights library and runs in the background. We can set the 
Application Insights configuration file to emit data we're interested in, such 
as performance counters. In the samples we use the start task to load the 
binaries on the machine and keep a process running indefinitely.

```csharp
CloudPool pool = client.PoolOperations.CreatePool(
    topNWordsConfiguration.PoolId,
    targetDedicated: topNWordsConfiguration.PoolNodeCount,
    virtualMachineSize: "small",
    cloudServiceConfiguration: new CloudServiceConfiguration(osFamily: "4"));

// Create file staging objects that represent the executable and its dependent assembly to run as the task.
// These files are copied to every node before the corresponding task is scheduled to run on that node.
FileToStage applicationMonitoringExe = new FileToStage(BatchApplicationInsightsAssemblyExeName, stagingStorageAccount);
FileToStage applicationMonitoringConfig = new FileToStage(ApplicationInsightsConfigName, stagingStorageAccount);

// List of files required to run the start task.
List<string> files = new List<string>
{
    BatchApplicationInsightsAssemblyExeName,
    ApplicationInsightsConfigName,
    AIDllName,
    AIDependencyCollectorName,
    AIInterceptDllAgentName,
    AIPerfCounterCollectorName,
    AIServerTelemetryName,
    AIWindowsServerName

};

var resourceHelperTask = SampleHelpers.UploadResourcesAndCreateResourceFileReferencesAsync(
    cloudStorageAccount,
    "monitoringdemo",
    files);

List<ResourceFile> resourceFiles = resourceHelperTask.Result;

// Create a start task which will run a dummy exe in background that simply emit performance
// counter data as defined in the relevant ApplicationInsights.config.
// Note that the waitForSuccess on the start task was not set so the Compute Node will be
// available immediately after this command is run.
pool.StartTask = new StartTask()
{
    CommandLine = "cmd /c BatchApplicationInsightsAssembly.exe",
    ResourceFiles = resourceFiles
};
```

> Tip: To increase the manageability of your solution, you can bundle this up 
> into an [application package](./batch-application-packages.md). The application package can then be deployed 
> automatically to your pools by adding an application package reference.

## Throttling and sampling data in Application Insights

Due to the large-scale nature of Azure Batch workloads, for applications 
running in production you may want to limit the amount of data collected by 
Application Insights to manage costs. 
This [article](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-sampling) provides some mechanisms to achieve this.


## More reading ...
Learn more about [Application Insights](https://docs.microsoft.com/en-us/azure/application-insights/).

For Application Insights support in other languages look at the 
[languages, platforms and integrations documentation](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-platforms).
<properties
   pageTitle="Use Performance Counters in Azure Diagnostics | Microsoft Azure"
   description="Use performance counters in Azure cloud services or virtual machine to find bottlenecks and tune performance."
   services="cloud-services"
   documentationCenter=".net"
   authors="rboucher"
   manager="jwhit"
   editor="tysonn" />
<tags
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/29/2016"
   ms.author="robb" />

# Create and use performance counters in an Azure application

This article describes the benefits of and how to put performance counters into your Azure application. You can use them to collect data, find bottlenecks, and tune system and application performance.

Performance counters available for Windows Server, IIS and ASP.NET can also be collected and used to determine the health of your Azure web roles, worker roles and Virtual Machines. You can also create and use custom performance counters.  

You can examine performance counter data
1. Directly on the application host with the Performance Monitor tool accessed using Remote Desktop
2. With System Center Operations Manager using the Azure Management Pack
3. With other monitoring tools that access the diagnostic data transferred to Azure storage. See [Store and View Diagnostic Data in Azure Storage](https://msdn.microsoft.com/library/azure/hh411534.aspx) for more information.  

For more information on monitoring the performance of your application in the [Azure classic portal](http://manage.azure.com/), see [How to Monitor Cloud Services](https://www.azure.com/manage/services/cloud-services/how-to-monitor-a-cloud-service/).

For additional in-depth guidance on creating a logging and tracing strategy and using diagnostics and other techniques to troubleshoot problems and optimize Azure applications, see [Troubleshooting Best Practices for Developing Azure Applications](https://msdn.microsoft.com/library/azure/hh771389.aspx).


## Enable performance counter monitoring

Performance counters are not enabled by default. Your application or a startup task must modify the default diagnostics agent configuration to include the specific performance counters that you wish to monitor for each role instance.

### Performance counters available for Microsoft Azure

Azure provides a subset of the performance counters available for Windows Server, IIS and the ASP.NET stack. The following table lists some of the performance counters of particular interest for Azure applications.

|Counter Category: Object (Instance)|Counter Name      |Reference|
|---|---|---|
|.NET CLR Exceptions(_Global_)|# Exceps Thrown / sec   |Exception Performance Counters|
|.NET CLR Memory(_Global_)    |% Time in GC            |Memory Performance Counters|
|ASP.NET                      |Application Restarts    |Performance Counters for ASP.NET|
|ASP.NET                      |Request Execution Time  |Performance Counters for ASP.NET|
|ASP.NET                      |Requests Disconnected   |Performance Counters for ASP.NET|
|ASP.NET                      |Worker Process Restarts |Performance Counters for ASP.NET|
|ASP.NET Applications(__Total__)|Requests Total        |Performance Counters for ASP.NET|
|ASP.NET Applications(__Total__)|Requests/Sec          |Performance Counters for ASP.NET|
|ASP.NET v4.0.30319           |Request Execution Time  |Performance Counters for ASP.NET|
|ASP.NET v4.0.30319           |Request Wait Time       |Performance Counters for ASP.NET|
|ASP.NET v4.0.30319           |Requests Current        |Performance Counters for ASP.NET|
|ASP.NET v4.0.30319           |Requests Queued         |Performance Counters for ASP.NET|
|ASP.NET v4.0.30319           |Requests Rejected       |Performance Counters for ASP.NET|
|Memory                       |Available MBytes        |Memory Performance Counters|
|Memory                       |Committed Bytes         |Memory Performance Counters|
|Processor(_Total)            |% Processor Time        |Performance Counters for ASP.NET|
|TCPv4                        |Connection Failures     |TCP Object|
|TCPv4                        |Connections Established |TCP Object|
|TCPv4                        |Connections Reset       |TCP Object|
|TCPv4                        |Segments Sent/sec       |TCP Object|
|Network Interface(*)         |Bytes Received/sec      |Network Interface Object|
|Network Interface(*)         |Bytes Sent/sec          |Network Interface Object|
|Network Interface(Microsoft Virtual Machine Bus Network Adapter _2)|Bytes Received/sec|Network Interface Object|
|Network Interface(Microsoft Virtual Machine Bus Network Adapter _2)|Bytes Sent/sec|Network Interface Object|
|Network Interface(Microsoft Virtual Machine Bus Network Adapter _2)|Bytes Total/sec|Network Interface Object|

## Create and add custom performance counters to your application

Azure has support to create and modify custom performance counters for web roles and worker roles. The counters may be used to track and monitor application-specific behavior. You can create and delete custom performance counter categories and specifiers from a startup task, web role, or worker role with elevated permissions.

>[AZURE.NOTE] Code that makes changes to custom performance counters must have elevated permissions to run. If the code is in a web role or worker role, the role must include the tag <Runtime executionContext="elevated" /> in the ServiceDefinition.csdef file for the role to initialize properly.

You can send custom performance counter data to Azure storage using the diagnostics agent.

The standard performance counter data is generated by the Azure processes. Custom performance counter data must be created by your web role or worker role application. See [Performance Counter Types](https://msdn.microsoft.com/library/z573042h.aspx) for information on the types of data that can be stored in custom performance counters. See [PerformanceCounters Sample](http://code.msdn.microsoft.com/azure/) for an example that creates and sets custom performance counter data in a web role.

## Store and view performance counter data

Azure caches performance counter data with other diagnostic information. This data is available for remote monitoring while the role instance is running using remote desktop access to view tools such as Performance Monitor. To persist the data outside of the role instance, the diagnostics agent must transfer the data to Azure storage. The size limit of the cached performance counter data can be configured in the diagnostics agent, or it may be configured to be part of a shared limit for all the diagnostic data. For more information about setting the buffer size, see [OverallQuotaInMB](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.diagnostics.diagnosticmonitorconfiguration.overallquotainmb.aspx) and [DirectoriesBufferConfiguration](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.diagnostics.directoriesbufferconfiguration.aspx). See [Store and View Diagnostic Data in Azure Storage](https://msdn.microsoft.com/library/azure/hh411534.aspx) for an overview of setting up the diagnostics agent to transfer data to a storage account.

Each configured performance counter instance is recorded at a specified sampling rate, and the sampled data is transferred to the storage account either by a scheduled transfer request or an on-demand transfer request. Automatic transfers may be scheduled as often as once per minute. Performance counter data transferred by the diagnostics agent is stored in a table, WADPerformanceCountersTable, in the storage account. This table may be accessed and queried with standard Azure storage API methods. See [Microsoft Azure PerformanceCounters Sample](http://code.msdn.microsoft.com/Windows-Azure-PerformanceCo-7d80ebf9) for an example of querying and displaying performance counter data from the WADPerformanceCountersTable table.

>[AZURE.NOTE] Depending on the diagnostics agent transfer frequency and queue latency, the most recent performance counter data in the storage account may be several minutes out of date.

## Enable performance counters using diagnostics configuration file

Use the following procedure to enable performance counters in your Azure application.

## Prerequisites

This section assumes that you have imported the Diagnostics monitor into your application and added the diagnostics configuration file to your Visual Studio solution (diagnostics.wadcfg in SDK 2.4 and below or diagnostics.wadcfgx in SDK 2.5 and above). See steps 1 and 2 in [Enabling Diagnostics in Azure Cloud Services and Virtual Machines](./cloud-services-dotnet-diagnostics.md)) for more information.

## Step 1: Collect and store data from performance counters

After you have added the diagnostics file to your Visual Studio solution you can configure the collection and storage of performance counter data in a Azure application. This is done by adding performance counters to the diagnostics file. Diagnostics data, including performance counters, is first collected on the instance. The data is then persisted to the WADPerformanceCountersTable table in the Azure Table service, so you will also need to specify the storage account in your application. If you're testing your application locally in the Compute Emulator, you can also store diagnostics data locally in the Storage Emulator. Before you store diagnostics data you must first go to the [Azure classic portal](http://manage.windowsazure.com/) and create a storage account. A best practice is to locate your storage account in the same geo-location as your Azure application in order to avoid paying external bandwidth costs and to reduce latency.

### Add performance counters to the diagnostics file

There are many counters you can use. The following example shows several performance counters that are recommended for web and worker role monitoring.

Open the diagnostics file (diagnostics.wadcfg in SDK 2.4 and below or diagnostics.wadcfgx in SDK 2.5 and above) and add the following to the DiagnosticMonitorConfiguration element:

```
    <PerformanceCounters bufferQuotaInMB="0" scheduledTransferPeriod="PT30M">
       <PerformanceCounterConfiguration counterSpecifier="\Memory\Available Bytes" sampleRate="PT30S" />
       <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT30S" />

    <!-- Use the Process(w3wp) category counters in a web role -->

       <PerformanceCounterConfiguration counterSpecifier="\Process(w3wp)\% Processor Time" sampleRate="PT30S" />
       <PerformanceCounterConfiguration counterSpecifier="\Process(w3wp)\Private Bytes" sampleRate="PT30S" />
       <PerformanceCounterConfiguration counterSpecifier="\Process(w3wp)\Thread Count" sampleRate="PT30S" />

    <!-- Use the Process(WaWorkerHost) category counters in a worker role.
       <PerformanceCounterConfiguration counterSpecifier="\Process(WaWorkerHost)\% Processor Time" sampleRate="PT30S" />
       <PerformanceCounterConfiguration counterSpecifier="\Process(WaWorkerHost)\Private Bytes" sampleRate="PT30S" />
       <PerformanceCounterConfiguration counterSpecifier="\Process(WaWorkerHost)\Thread Count" sampleRate="PT30S" />
    -->

       <PerformanceCounterConfiguration counterSpecifier="\.NET CLR Interop(_Global_)\# of marshalling" sampleRate="PT30S" />
       <PerformanceCounterConfiguration counterSpecifier="\.NET CLR Loading(_Global_)\% Time Loading" sampleRate="PT30S" />
       <PerformanceCounterConfiguration counterSpecifier="\.NET CLR LocksAndThreads(_Global_)\Contention Rate / sec" sampleRate="PT30S" />
       <PerformanceCounterConfiguration counterSpecifier="\.NET CLR Memory(_Global_)\# Bytes in all Heaps" sampleRate="PT30S" />
       <PerformanceCounterConfiguration counterSpecifier="\.NET CLR Networking(_Global_)\Connections Established" sampleRate="PT30S" />
       <PerformanceCounterConfiguration counterSpecifier="\.NET CLR Remoting(_Global_)\Remote Calls/sec" sampleRate="PT30S" />
       <PerformanceCounterConfiguration counterSpecifier="\.NET CLR Jit(_Global_)\% Time in Jit" sampleRate="PT30S" />
    </PerformanceCounters>
```

The bufferQuotaInMB attribute, which specifies the maximum amount of file system storage that is available for the data collection type (Azure logs, IIS logs, etc.). The default is 0. When the quota is reached, the oldest data is deleted as new data is added. The sum of all the bufferQuotaInMB properties must be greater than the value of the OverallQuotaInMB attribute. For a more detailed discussion of determining how much storage will be required for the collection of diagnostics data, see the Setup WAD section of [Troubleshooting Best Practices for Developing Azure Applications](https://msdn.microsoft.com/library/windowsazure/hh771389.aspx).

The scheduledTransferPeriod attribute, which specifies the interval between scheduled transfers of data, rounded up to the nearest minute. In the following examples it is set to PT30M (30 minutes). Setting the transfer period to a small value, such as 1 minute, will adversely impact your application's performance in production but can be useful for seeing diagnostics working quickly when you are testing. The scheduled transfer period should be small enough to ensure that diagnostic data is not overwritten on the instance, but large enough that it will not impact the performance of your application.

The counterSpecifier attribute specifies the performance counter to collect.The sampleRate attribute specifies the rate at which the performance counter should be sampled, in this case 30 seconds.

Once you've added the performance counters that you want to collect, save your changes to the diagnostics file. Next, you need to specify the storage account that the diagnostics data will be persisted to.

### Specify the storage account

To persist your diagnostics information to your Azure Storage account, you must specify a connection string in your service configuration (ServiceConfiguration.cscfg) file.

For Azure SDK 2.5 the Storage Account can be specified in the diagnostics.wadcfgx file.

>[AZURE.NOTE] These instructions only apply to Azure SDK 2.4 and below. For Azure SDK 2.5 the Storage Account can be specified in the diagnostics.wadcfgx file.

To set the connection strings:

1. Open the ServiceConfiguration.Cloud.cscfg file using your favorite text editor and set the connection string for your storage. The *AccountName* and *AccountKey* values are found in the Azure classic portal in the storage account dashboard, under Manage Keys.

    ```
    <ConfigurationSettings>
       <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="DefaultEndpointsProtocol=https;AccountName=<name>;AccountKey=<key>"/>
    </ConfigurationSettings>
    ```
2. Save the ServiceConfiguration.Cloud.cscfg file.

3. Open the ServiceConfiguration.Local.cscfg file and verify that UseDevelopmentStorage is set to true.

    ```
    <ConfigurationSettings>
      <Settingname="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="UseDevelopmentStorage=true"/>
    </ConfigurationSettings>
    ```
Now that the connection strings are set, your application will persist diagnostics data to your storage account when your application is deployed.
4. Save and build your project, then deploy your application.

## Step 2: (Optional) Create custom performance counters

In addition to the pre-defined performance counters, you can add your own custom performance counters to monitor web or worker roles. Custom performance counters may be used to track and monitor application-specific behavior and can be created or deleted in a startup task, web role, or worker role with elevated permissions.

The Azure diagnostics agent refreshes the performance counter configuration from the .wadcfg file one minute after starting.  If you create custom performance counters in the OnStart method and your startup tasks take longer than one minute to execute, your custom performance counters will not have been created when the Azure Diagnostics agent tries to load them.  In this scenario you will see that Azure Diagnostics correctly captures all diagnostics data except your custom performance counters.  To resolve this issue, create the performance counters in a startup task or move some of your startup task work to the OnStart method after creating the performance counters.

Perform the following steps to create a simple custom performance counter named "\MyCustomCounterCategory\MyButton1Counter":

1. Open the service definition file (CSDEF) for your application.
2. Add the Runtime element to the WebRole or WorkerRole element to allow execution with elevated privileges:

    ```
    <runtime executioncontext="elevated"/>
    ```
3. Save the file.
4. Open the diagnostics file (diagnostics.wadcfg in SDK 2.4 and below or diagnostics.wadcfgx in SDK 2.5 and above) and add the following to the DiagnosticMonitorConfiguration 

    ```
    <PerformanceCounters bufferQuotaInMB="0" scheduledTransferPeriod="PT30M">
     <PerformanceCounterConfiguration counterSpecifier="\MyCustomCounterCategory\MyButton1Counter" sampleRate="PT30S"/>
    </PerformanceCounters>
    ```
5. Save the file.
6. Create the custom performance counter category in the OnStart method of your role, before invoking base.OnStart. The following C# example creates a custom category, if it does not already exist:

    ```
    public override bool OnStart()
    {
    if (!PerformanceCounterCategory.Exists("MyCustomCounterCategory"))
    {
       CounterCreationDataCollection counterCollection = new CounterCreationDataCollection();

       // add a counter tracking user button1 clicks
       CounterCreationData operationTotal1 = new CounterCreationData();
       operationTotal1.CounterName = "MyButton1Counter";
       operationTotal1.CounterHelp = "My Custom Counter for Button1";
       operationTotal1.CounterType = PerformanceCounterType.NumberOfItems32;
       counterCollection.Add(operationTotal1);

       PerformanceCounterCategory.Create(
         "MyCustomCounterCategory",
         "My Custom Counter Category",
         PerformanceCounterCategoryType.SingleInstance, counterCollection);

       Trace.WriteLine("Custom counter category created.");
    }
    else{
       Trace.WriteLine("Custom counter category already exists.");
    }

    return base.OnStart();
    }
    ```
7. Update the counters within your application. The following example updates a custom performance counter on Button1_Click events:

    ```
    protected void Button1_Click(object sender, EventArgs e)
        {
         PerformanceCounter button1Counter = new PerformanceCounter(
           "MyCustomCounterCategory",
           "MyButton1Counter",
           string.Empty,
           false);
         button1Counter.Increment();
        this.Button1.Text = "Button 1 count: " +
           button1Counter.RawValue.ToString();
        }
    ```
8. Save the file.  

Custom performance counter data will now be collected by the Azure diagnostics monitor.

## Step 3: Query performance counter data

Once your application is deployed and running the Diagnostics monitor will begin collecting performance counters and persisting that data to Azure storage. You use tools such as Server Explorer in Visual Studio,  [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/), or [Azure Diagnostics Manager](http://www.cerebrata.com/Products/AzureDiagnosticsManager/Default.aspx) by Cerebrata to view the performance counters data in the WADPerformanceCountersTable table. You can also programatically query the Table service using [C#](../storage/storage-dotnet-how-to-use-tables.d),  [Java](../storage/storage-java-how-to-use-table-storage.md),  [Node.js](../storage/storage-nodejs-how-to-use-table-storage.md), [Python](../storage/storage-python-how-to-use-table-storage.md), [Ruby](../storage/storage-ruby-how-to-use-table-storage.md), or [PHP](../storage/storage-php-how-to-use-table-storage.md).

The following C# example shows a simple query against the WADPerformanceCountersTable table and saves the diagnostics data to a CSV file. Once the performance counters are saved to a CSV file you can use the graphing capabilities in Microsoft Excel or some other tool to visualize the data. Be sure to add a reference to Microsoft.WindowsAzure.Storage.dll, which is included in the Azure SDK for .NET October 2012 and later. The assembly is installed to the %Program Files%\Microsoft SDKs\Microsoft Azure.NET SDK\version-num\ref\ directory.

```
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Auth;
    using Microsoft.WindowsAzure.Storage.Table;
    ...

    // Get the connection string. When using Microsoft Azure Cloud Services, it is recommended
    // you store your connection string using the Microsoft Azure service configuration
    // system (*.csdef and *.cscfg files). You can you use the CloudConfigurationManager type
    // to retrieve your storage connection string.  If you're not using Cloud Services, it's
    // recommended that you store the connection string in your web.config or app.config file.
    // Use the ConfigurationManager type to retrieve your storage connection string.

    string connectionString = Microsoft.WindowsAzure.CloudConfigurationManager.GetSetting("StorageConnectionString");
    //string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString;

    // Get a reference to the storage account using the connection string.  You can also use the development
    // storage account (Storage Emulator) for local debugging.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
    //CloudStorageAccount storageAccount = CloudStorageAccount.DevelopmentStorageAccount;

    // Create the table client.
    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();

    // Create the CloudTable object that represents the "WADPerformanceCountersTable" table.
    CloudTable table = tableClient.GetTableReference("WADPerformanceCountersTable");

    // Create the table query, filter on a specific CounterName, DeploymentId and RoleInstance.
    TableQuery<PerformanceCountersEntity> query = new TableQuery<PerformanceCountersEntity>()
       .Where(
          TableQuery.CombineFilters(
          TableQuery.GenerateFilterCondition("CounterName", QueryComparisons.Equal, @"\Processor(_Total)\% Processor Time"),
          TableOperators.And,
          TableQuery.CombineFilters(
          TableQuery.GenerateFilterCondition("DeploymentId", QueryComparisons.Equal, "ec26b7a1720447e1bcdeefc41c4892a3"),
          TableOperators.And,
          TableQuery.GenerateFilterCondition("RoleInstance", QueryComparisons.Equal, "WebRole1_IN_0")
          )
       )
    );

    // Execute the table query.
    IEnumerable<PerformanceCountersEntity> result = table.ExecuteQuery(query);

    // Process the query results and build a CSV file.
    StringBuilder sb = new StringBuilder("TimeStamp,EventTickCount,DeploymentId,Role,RoleInstance,CounterName,CounterValue\n");

    foreach (PerformanceCountersEntity entity in result)
    {
       sb.Append(entity.Timestamp + "," + entity.EventTickCount + "," + entity.DeploymentId + ","
          + entity.Role + "," + entity.RoleInstance + "," + entity.CounterName + "," + entity.CounterValue+"\n");
    }

    StreamWriter sw = File.CreateText(@"C:\temp\PerfCounters.csv");
    sw.Write(sb.ToString());
    sw.Close();
```

Entities map to C# objects using a custom class derived from **TableEntity**. The following code defines an entity class that represents a performance counter in the **WADPerformanceCountersTable** table.


    public class PerformanceCountersEntity : TableEntity
    {
       public long EventTickCount { get; set; }
       public string DeploymentId { get; set; }
       public string Role { get; set; }
       public string RoleInstance { get; set; }
       public string CounterName { get; set; }
       public double CounterValue { get; set; }
    }


## Next Steps
[View additional articles on Azure Diagnostics] (../azure-diagnostics.md)

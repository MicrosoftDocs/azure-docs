<properties linkid="dev-net-commons-tasks-profiling" urlDisplayName="Performance Profiling" pageTitle="Use Performance Counters in Azure (.NET)" metaKeywords="Azure performance counters, Azure performance profiling, Azure performance counters C#, Azure performance profiling C#" description="Learn how to enable and collect data from performance counters in Azure applications. " metaCanonical="" services="cloud-services" documentationCenter=".NET" title="Using performance counters in Azure" authors="ryanwi" solutions="" manager="" editor="" />





# Using performance counters in Azure

You can use performance counters in an Azure application to
collect data that can help determine system bottlenecks and fine-tune
system and application performance. Performance counters available for Windows Server 2008, Windows Server 2012, IIS and ASP.NET can be collected and used to determine the health of your Azure application. 

This topic explains how to enable performance counters in your application using the diagnostics.wadcfg configuration file. For information on monitoring the performance of your application in the [Azure Management Portal][], see [How to Monitor Cloud Services][]. For additional in-depth guidance on creating a logging and tracing strategy and using diagnostics and other techniques to troubleshoot problems and optimize Azure applications, see [Troubleshooting Best Practices for Developing Azure Applications][].

This task includes the following steps:

-   [Prerequisites][]
-   [Step 1: Collect and store data from performance counters][]
-   [Step 2: (Optional) Create custom performance counters][]
-   [Step 3: Query performance counter data][]
-   [Next Steps][]
-   [Additional Resources][]

## <a name="prereqs"> </a>Prerequisites

This article assumes that you have imported the Diagnostics monitor into your application and added the diagnostics.wadcfg configuration file to your Visual Studio solution.  See steps 1 and 2 in [Enabling Diagnostics in Azure][] for more information.

## <a name="step1"> </a>Step 1: Collect and store data from performance counters

After you have added the diagnostics.wadcfg file to your Visual Studio solution you can configure the collection and storage of performance counter data in an Azure application.  This is done by adding performance counters to the diagnostics.wadcfg file.  Diagnostics data, including performance counters, is first collected on the instance.  The data is then persisted to the **WADPerformanceCountersTable** table in the Azure Table service, so you will also need to specify the storage account in your application. If you're testing your application locally in the Compute Emulator, you can also store diagnostics data locally in the Storage Emulator. Before you store diagnostics data you must first go to the [Azure Management Portal][] and create a storage account. A best practice is to locate your storage account in the same geo-location as your Azure application in order to avoid paying external bandwidth costs and to reduce latency.

### Add performance counters to the diagnostics.wadcfg file

There are many performance counters that you can collect, the following example shows several performance counters that are recommended for web and worker role monitoring. 

Open the diagnostics.wadcfg file and add the following to the **DiagnosticMonitorConfiguration** element:

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

The **bufferQuotaInMB** attribute, which specifies the maximum amount of file system storage that is available for the data collection type (Azure logs, IIS logs, etc.). The default is 0.  When the quota is reached, the oldest data is deleted as new data is added. The sum of all the **bufferQuotaInMB** properties must be greater than the value of the **OverallQuotaInMB** attribute.  For a more detailed discussion of determining how much storage will be required for the collection of diagnostics data, see the Setup WAD section of [Troubleshooting Best Practices for Developing Azure Applications][].

The **scheduledTransferPeriod** attribute, which specifies the interval between scheduled transfers of data, rounded up to the nearest minute. In the following examples it is set to PT30M (30 minutes). Setting the transfer period to a small value, such as 1 minute, will adversely impact your application's performance in production but can be useful for seeing diagnostics working quickly when you are testing.  The scheduled transfer period should be small enough to ensure that diagnostic data is not overwritten on the instance, but large enough that it will not impact the performance of your application.

The **counterSpecifier** attribute specifies the performance counter to collect.

The **sampleRate** attribute specifies the rate at which the performance counter should be sampled, in this case 30 seconds.

Once you've added the performance counters that you want to collect, save your changes to the diagnostics.wadcfg file.  Next, you need to specify the storage account that the diagnostics data will be persisted to.

### Specify the storage account

To persist your diagnostics information to your Azure Storage account, you must specify a connection string in your service configuration (ServiceConfiguration.cscfg) file.  Azure Tools for Visual Studio version 1.4 (August 2011) and later allows you to have different configuration files (ServiceConfiguration.cscfg) for Local and Cloud. Multiple service configurations are useful for diagnostics because you can use the Storage Emulator for local testing free of charge while maintaining a separate configuration file for production.

To set the connection strings:

1.  Open the ServiceConfiguration.Cloud.cscfg file using your favorite text editor and set the connection string for your storage account:

        <ConfigurationSettings>
          <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="DefaultEndpointsProtocol=https;AccountName=<name>;AccountKey=<key>"/>
        </ConfigurationSettings>

    The **AccountName** and **AccountKey** values are found in the Management Portal in the storage account dashboard, under **Manage Keys**.

2.  Save the ServiceConfiguration.Cloud.cscfg file.
3.  Open the ServiceConfiguration.Local.cscfg file and verify that **UseDevelopmentStorage** is set to true (the default).

		<ConfigurationSettings>
      	   <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="UseDevelopmentStorage=true" />
		</ConfigurationSettings>

	Now that the connection strings are set, your application will persist diagnostics data to your storage account when your application is deployed.  
4. Save and build your project, then deploy your application.

## <a name="step2"> </a>Step 2: (Optional) Create custom performance counters

In addition to the pre-defined performance counters, you can add your own custom performance counters to monitor web or worker roles.  Custom performance counters may be used to track and monitor application-specific behavior and can be created or deleted in a startup task, web role, or worker role with elevated permissions.

Perform the following steps to create a simple custom performance counter named "\MyCustomCounterCategory\MyButton1Counter":

1.  Open the service definition file (CSDEF) for your application.
2.  Add the **Runtime** element to the **WebRole** or **WorkerRole**
    element to allow execution with elevated privileges:

        <Runtime executionContext="elevated" />

3.  Save the file.
4.  Open the diagnostics.wadcfg file and add the following to the **DiagnosticMonitorConfiguration** element:

		<PerformanceCounters bufferQuotaInMB="0" scheduledTransferPeriod="PT30M">
		<PerformanceCounterConfiguration counterSpecifier="\MyCustomCounterCategory\MyButton1Counter" sampleRate="PT30S"/>
		</PerformanceCounters>		

5.	Save the file.
6.  Create the custom performance counter category in the **OnStart**
    method of your role, before invoking **base.OnStart**. The following C# example creates a custom category, if it does not already exist:

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

7.  Update the counters within your application. The following example
    updates a custom performance counter on **Button1_Click** events:

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

8.  Save the file.

When these steps have been completed, custom performance counter data is
collected by the Azure diagnostics monitor.

## <a name="step3"> </a>Step 3: Query performance counter data

Once your application is deployed and running the Diagnostics monitor will begin collecting performance counters and persisting that data to Azure storage. You use tools such as **Server Explorer in Visual Studio**, [Azure Storage Explorer][], or [Azure Diagnostics Manager][] by Cerebrata to view the performance counters data in the **WADPerformanceCountersTable** table.  You can also programatically query the Table service using [C#][], [Java][], [Node.js][], [Python][], or [PHP][].  

The following C# example shows a simple query against the **WADPerformanceCountersTable** table and saves the diagnostics data to a CSV file. Once the performance counters are saved to a CSV file you can use the graphing capabilities in Microsoft Excel or some other tool to visualize the data.  Be sure to add a reference to Microsoft.WindowsAzure.Storage.dll, which is included in the Azure SDK for .NET October 2012 and later. The assembly is installed to the %Program Files%\Microsoft SDKs\Windows Azure\.NET SDK\version-num\ref\ directory.

		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Auth;
		using Microsoft.WindowsAzure.Storage.Table;

		...

		// Get the connection string. When using Azure Cloud Services, it is recommended 
		// you store your connection string using the Azure service configuration
		// system (*.csdef and *.cscfg files). You can you use the CloudConfigurationManager type 
		// to retrieve your storage connection string.  If you're not using Cloud Services, it's
		// recommended that you store the connection string in your web.config or app.config file.
		// Use the ConfigurationManager type to retrieve your storage connection string.
		
		string connectionString = Microsoft.WindowsAzure.CloudConfigurationManager.GetSetting("StorageConnectionString");
		//string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString;
            
		// Get a reference to the storage account using the connection string.  You can also use the development storage account (Storage Emulator)
		// for local debugging.              
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

Entities map to C# objects using a custom class derived from **TableEntity**. The following code defines an entity class that represents a performance counter in the **WADPerformanceCountersTable** table.

		public class PerformanceCountersEntity : TableEntity
		{
			public long EventTickCount { get; set; }
			public string DeploymentId { get; set; }
			public string Role { get; set; }
			public string RoleInstance { get; set; }
			public string CounterName { get; set; }
			public double CounterValue { get; set; }                
		}

## <a name="nextsteps"> </a>Next Steps

Now that you've learned the basics of collecting performance counters, follow these links to learn how to implement more complex troubleshooting scenarios.

- [Troubleshooting Best Practices for Developing Azure Applications][]
- [How to Monitor Cloud Services][]
- [How to Use the Autoscaling Application Block][]
- [Building Elastic and Resilient Cloud Apps]

## <a name="additional"> </a>Additional Resources

- [Enabling Diagnostics in Azure][]
- [Collecting Logging Data by Using Azure Diagnostics][]
- [Debugging an Azure Application][]


  [Overview of Creating and Using Performance Counters in an Azure Application]: http://msdn.microsoft.com/en-us/library/windowsazure/hh411520.aspx
  [Prerequisites]: #prereqs
  [Step 1: Collect and store data from performance counters]: #step1
  [Step 2: (Optional) Create custom performance counters]: #step2
  [Step 3: Query performance counter data]: #step3
  [Next Steps]: #nextsteps
  [Additional Resources]: #additional
  
  [Collecting Logging Data by Using Azure Diagnostics]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433048.aspx
  [Debugging an Azure Application]: http://msdn.microsoft.com/en-us/library/windowsazure/ee405479.aspx
  [How to Use the Autoscaling Application Block]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/autoscaling/
  [Troubleshooting Best Practices for Developing Azure Applications]: http://msdn.microsoft.com/en-us/library/windowsazure/hh771389.aspx
  [Enabling Diagnostics in Azure]: https://www.windowsazure.com/en-us/develop/net/common-tasks/diagnostics/
  [How to use the Table Storage Service]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/table-services/
  [Azure Storage Explorer]: http://azurestorageexplorer.codeplex.com/
  
  [Java]: http://www.windowsazure.com/en-us/develop/java/how-to-guides/table-service/
  [Python]: http://www.windowsazure.com/en-us/develop/python/how-to-guides/table-service/
  [PHP]: http://www.windowsazure.com/en-us/develop/php/how-to-guides/table-service/
  
  [Building Elastic and Resilient Cloud Apps]: http://msdn.microsoft.com/en-us/library/hh680949(PandP.50).aspx
  [Azure Management Portal]: http://manage.windowsazure.com
  [Azure Diagnostics Manager]: http://www.cerebrata.com/Products/AzureDiagnosticsManager/Default.aspx
  [How to Monitor Cloud Services]: https://www.windowsazure.com/en-us/manage/services/cloud-services/how-to-monitor-a-cloud-service/

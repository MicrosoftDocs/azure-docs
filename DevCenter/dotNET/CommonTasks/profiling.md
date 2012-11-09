<properties linkid="dev-net-commons-tasks-profiling" urlDisplayName="Performance Profiling" pageTitle="Use Performance Counters in Windows Azure (.NET)" metaKeywords="Azure performance counters, Azure performance profiling, Azure performance counters C#, Azure performance profiling C#" metaDescription="Learn how to enable and collect data from performance counters in Windows Azure applications. " metaCanonical="" disqusComments="1" umbracoNaviHide="1" />


<div chunk="../chunks/article-left-menu.md" />
# Using performance counters in Windows Azure

You can use performance counters in a Windows Azure application to
collect data that can help determine system bottlenecks and fine-tune
system and application performance. Windows Azure provides a subset of
the performance counters available for Windows Server 2008, IIS and
ASP.NET. For a list of the performance counters that might be of
interest in Windows Azure applications, see [Overview of Creating and Using Performance Counters in a Windows Azure Application][].

This task includes the following steps:

-   [Step 1: Collect data from performance counters][]
-   [Step 2: (Optional) Create custom performance counters][]
-   [Step 3: Query performance counter data][]

## <a name="step1"> </a>Step 1: Collect data from performance counters

You configure the collection of performance counter data in a Windows
Azure application by using the [GetDefaultInitialConfiguration][]
method, adding the [PerformanceCounters][] data source with an instance
of a [PerformanceCounterConfiguration][], and then calling the [Start][]
method with the changed configuration. Perform the following steps to
collect data from performance counters.

1.  Open the source file for the role.

    **Note**: The code in the following steps is typically added to
    the **OnStart** method of the role.

2.  Get an instance of the diagnostic monitor configuration. The
    following code example shows how to get the default diagnostic
    monitor configuration object:

        var config = DiagnosticMonitor.GetDefaultInitialConfiguration();

3.  Specify the performance counters to monitor. The following example
    shows the performance counter being added to the diagnostic monitor
    configuration:

        config.PerformanceCounters.DataSources.Add(
         new PerformanceCounterConfiguration())
         {
             CounterSpecifier = @"\Processor(_Total)\% Processor Time",
             SampleRate = TimeSpan.FromSeconds(5)
         });

4.  Start the diagnostic monitor with the changed configuration. The
    following code example shows how to start the monitor:

        DiagnosticMonitor.Start("Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString", config);

    **Note**: This code example shows the use of a connection string.
    For more information about using connection strings, see [How to Configure Connection Strings][].

5.  Save and build the project, and then deploy the application.

When these steps have been completed, performance counter data is
collected by the Windows Azure diagnostics monitor.

## <a name="step2"> </a>Step 2: (Optional) Create custom performance counters

You can add new custom performance counters to the diagnostic monitor
configuration from within your application by using the custom category
and counter names to create [PerformanceCounterConfiguration][1]
instances for each counter and adding them to the
[PerformanceCounters][] data source collection in the
[DiagnosticMonitorConfiguration][]. Perform the following steps to
create custom performance counters.

1.  Open the service definition file (CSDEF) for your application.
2.  Add the **Runtime** element to the **WebRole** or **WorkerRole**
    element to allow execution with elevated privileges:

        <Runtime executionContext="elevated" />

3.  Save the file.
4.  Open the source file for the role.
5.  Add the following **using** statement if not already present:

        using System.Diagnostics;

6.  Create the custom performance counter category in the **OnStart**
    method of your role. The following example creates a custom category
    with two counters, if it does not already exist:

        if (!PerformanceCounterCategory.Exists("MyCustomCounterCategory"))
        {
           CounterCreationDataCollection counterCollection = new CounterCreationDataCollection();

           // add a counter tracking user button1 clicks
           CounterCreationData operationTotal1 = new CounterCreationData();
           operationTotal1.CounterName = "MyButton1Counter";
           operationTotal1.CounterHelp = "My Custom Counter for Button1";
           operationTotal1.CounterType = PerformanceCounterType.NumberOfItems32;
           counterCollection.Add(operationTotal1);

           // add a counter tracking user button2 clicks
           CounterCreationData operationTotal2 = new CounterCreationData();
           operationTotal2.CounterName = "MyButton2Counter";
           operationTotal2.CounterHelp = "My Custom Counter for Button2";
           operationTotal2.CounterType = PerformanceCounterType.NumberOfItems32;
           counterCollection.Add(operationTotal2);

           PerformanceCounterCategory.Create(
             "MyCustomCounterCategory",
             "My Custom Counter Category",
             PerformanceCounterCategoryType.SingleInstance, counterCollection);

           Trace.WriteLine("Custom counter category created.");
        }
        else{
           Trace.WriteLine("Custom counter category already exists.");
        }

7.  Add the new custom performance counters to the Diagnostic Monitor
    configuration and start the Diagnostic Monitor in the **OnStart**
    method before invoking **base.OnStart**:

        DiagnosticMonitorConfiguration config =
          DiagnosticMonitor.GetDefaultInitialConfiguration();
        config.PerformanceCounters.ScheduledTransferPeriod =
          TimeSpan.FromMinutes(2D);
        config.PerformanceCounters.BufferQuotaInMB = 512;
        TimeSpan perfSampleRate = TimeSpan.FromSeconds(30D);

        // Add configuration settings for custom performance counters.
        config.PerformanceCounters.DataSources.Add(
          new PerformanceCounterConfiguration()
        {
          CounterSpecifier = @"\MyCustomCounterCategory\MyButton1Counter",
                SampleRate = perfSampleRate
        });

        config.PerformanceCounters.DataSources.Add(
          new PerformanceCounterConfiguration()
        {
          CounterSpecifier = @"\MyCustomCounterCategory\MyButton2Counter",
                SampleRate = perfSampleRate
        });

        // Apply the updated configuration to the diagnostic monitor.    
        DiagnosticMonitor.Start("Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString", config);

8.  Update the counters within your application. The following example
    updates a custom performance counter on **Button1_Click** events:

        protected void Button1_Click(object sender, EventArgs e)
        {
          button1Counter = new PerformanceCounter(
            "MyCustomCounterCategory",
            "MyButton1Counter",
            string.Empty,
            false);

          button1Counter.Increment();
          this.Button1.Text = "Button 1 count: " +
            button1Counter.RawValue.ToString();
        }

9.  Save and build the project, and then deploy the application.

When these steps have been completed, custom performance counter data is
collected by the Windows Azure diagnostics monitor.

## <a name="step3"> </a>Step 3: Query performance counter data

After you configure the Windows Azure diagnostic monitor to collect and
transfer performance counter data to Windows Azure storage, you can
access that data for reporting. You report performance counter data in a
Windows Azure application by enumerating the results of executing a
[CloudTableQuery][] query against the **WADPerformanceCountersTable** in
Windows Azure storage. Perform the following steps to query performance
counter data.

1.  Open the source file for the role to contain the code.
2.  Add the following **using** statements if they have not already been
    added:

        using System.Linq;
        using Microsoft.WindowsAzure;
        using Microsoft.WindowsAzure.StorageClient;

3.  Create a class to represent the table schema for performance counter
    table queries:

        public class PerformanceCountersEntity : TableServiceEntity
        {
          public long EventTickCount { get; set; }
          public string DeploymentId { get; set; }
          public string Role { get; set; }
          public string RoleInstance { get; set; }
          public string CounterName { get; set; }
          public string CounterValue { get; set; }
        }

4.  Get an instance of the table service context. The following code
    example shows how to get the default diagnostic monitor table
    service context:

        CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
          "Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString");
              CloudTableClient cloudTableClient =
          storageAccount.CreateCloudTableClient();
              TableServiceContext serviceContext =
          cloudTableClient.GetDataServiceContext();

5.  Create a query to specify which table entries to return. The
    following example returns processor CPU utilization entries from the
    last five minutes for the current role instance:

        IQueryable<PerformanceCountersEntity> performanceCountersTable =
          serviceContext.CreateQuery<PerformanceCountersEntity>(
            "WADPerformanceCountersTable");
        var selection = from row in performanceCountersTable
          where row.EventTickCount > DateTime.UtcNow.AddMinutes(-5.0).Ticks
          && row.CounterName.Equals(@"\Processor(_Total)\% Processor Time")
          select row;

        CloudTableQuery<PerformanceCountersEntity> query =
          selection.AsTableServiceQuery<PerformanceCountersEntity>();

        // Use the Execute command explicitly on the TableServiceQuery to
        // take advantage of continuation tokens automatically and get all the data.
        IEnumerable<PerformanceCountersEntity> result = query.Execute();

    **Note:** For more information about query syntax, see [LINQ: .NET Language-Integrated Query][].

6.  Use the result to analyze and report on application performance:

        List<PerformanceCountersEntity> list = result.ToList();
            // Display list members here.

7.  Save and build the project, and then deploy the application.

When these steps have been completed, performance counter data is
available for reporting.

## Additional Resources

- [Collecting Logging Data by Using Windows Azure Diagnostics][]
- [Debugging a Windows Azure Application][]
- [How to Use the Autoscaling Application Block][]

  [Overview of Creating and Using Performance Counters in a Windows Azure Application]: http://msdn.microsoft.com/en-us/library/windowsazure/hh411520.aspx
  [Step 1: Collect data from performance counters]: #step1
  [Step 2: (Optional) Create custom performance counters]: #step2
  [Step 3: Query performance counter data]: #step3
  [GetDefaultInitialConfiguration]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitor.getdefaultinitialconfiguration.aspx
  [PerformanceCounters]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitorconfiguration.performancecounters.aspx
  [PerformanceCounterConfiguration]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.diagnostics.performancecounterconfiguration.aspx
  [Start]: http://msdn.microsoft.com/en-us/library/windowsazure/ee772721.aspx
  [How to Configure Connection Strings]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758697.aspx
  [1]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.performancecounterconfiguration.aspx
  [DiagnosticMonitorConfiguration]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitorconfiguration.aspx
  [CloudTableQuery]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758648.aspx
  [LINQ: .NET Language-Integrated Query]: http://msdn.microsoft.com/en-us/library/bb308959.aspx
  [Collecting Logging Data by Using Windows Azure Diagnostics]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433048.aspx
  [Debugging a Windows Azure Application]: http://msdn.microsoft.com/en-us/library/windowsazure/ee405479.aspx
  [How to Use the Autoscaling Application Block]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/autoscaling/

<?xml version="1.0" encoding="utf-8"?>
<body>
  <properties linkid="dev-net-commons-tasks-profiling" urlDisplayName="Performance Profiling" headerExpose="" pageTitle="Enable Profiling - .NET - Develop" metaKeywords="Azure performance counters, Azure performance profiling, Azure performance counters C#, Azure performance profiling C#" footerExpose="" metaDescription="Learn how to enable and collect data from performance counters in Windows Azure applications. " umbracoNaviHide="0" disqusComments="1" />
  <h1>Using Performance Counters in Windows Azure</h1>
  <p>You can use performance counters in a Windows Azure application to collect data that can help determine system bottlenecks and fine-tune system and application performance. Windows Azure provides a subset of the performance counters available for Windows Server 2008, IIS and ASP.NET. For a list of the performance counters that might be of interest in Windows Azure applications, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh411520.aspx">Overview of Creating and Using Performance Counters in a Windows Azure Application</a>.</p>
  <p>This task includes the following steps:</p>
  <ul>
    <li>
      <a href="#step1">Step 1: Collect data from performance counters</a>
    </li>
    <li>
      <a href="#step2">Step 2: (Optional) Create custom performance counters</a>
    </li>
    <li>
      <a href="#step3">Step 3: Query performance counter data</a>
    </li>
  </ul>
  <h2>
    <a name="step1">
    </a>Step 1: Collect data from performance counters</h2>
  <p>You configure the collection of performance counter data in a Windows Azure application by using the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitor.getdefaultinitialconfiguration.aspx">GetDefaultInitialConfiguration</a> method, adding the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitorconfiguration.performancecounters.aspx">PerformanceCounters</a> data source with an instance of a <a href="http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.diagnostics.performancecounterconfiguration.aspx">PerformanceCounterConfiguration</a>, and then calling the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee772721.aspx">Start</a> method with the changed configuration. Perform the following steps to collect data from performance counters.</p>
  <ol>
    <li>
      <p>Open the source file for the role.</p>
      <p>
        <strong>Note</strong>: The code in the following steps is typically added to the<strong> OnStart </strong> method of the role.</p>
    </li>
    <li>
      <p>Get an instance of the diagnostic monitor configuration. The following code example shows how to get the default diagnostic monitor configuration object:</p>
      <pre class="prettyprint">var config = DiagnosticMonitor.GetDefaultInitialConfiguration();</pre>
    </li>
    <li>
      <p>Specify the performance counters to monitor. The following example shows the performance counter being added to the diagnostic monitor configuration:</p>
      <pre class="prettyprint">config.PerformanceCounters.DataSources.Add(
 new PerformanceCounterConfiguration())
 {
     CounterSpecifier = @"\Processor(_Total)\% Processor Time",
     SampleRate = TimeSpan.FromSeconds(5)
 });
</pre>
    </li>
    <li>
      <p>Start the diagnostic monitor with the changed configuration. The following code example shows how to start the monitor:</p>
      <pre class="prettyprint">DiagnosticMonitor.Start("Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString", config);</pre>
      <p>
        <strong>Note</strong>: This code example shows the use of a connection string. For more information about using connection strings, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee758697.aspx">How to Configure Connection Strings</a>.</p>
    </li>
    <li>Save and build the project, and then deploy the application.</li>
  </ol>
  <p>When these steps have been completed, performance counter data is collected by the Windows Azure diagnostics monitor.</p>
  <p> </p>
  <h2>
    <a name="step2">
    </a>Step 2: (Optional) Create custom performance counters</h2>
  <p>You can add new custom performance counters to the diagnostic monitor configuration from within your application by using the custom category and counter names to create <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.performancecounterconfiguration.aspx">PerformanceCounterConfiguration</a> instances for each counter and adding them to the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitorconfiguration.performancecounters.aspx">PerformanceCounters</a> data source collection in the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitorconfiguration.aspx">DiagnosticMonitorConfiguration</a>. Perform the following steps to create custom performance counters.</p>
  <ol>
    <li>Open the service definition file (CSDEF) for your application.</li>
    <li>
      <p>Add the <strong>Runtime</strong> element to the <strong>WebRole</strong> or <strong>WorkerRole</strong> element to allow execution with elevated privileges:</p>
      <pre class="prettyprint">&lt;Runtime executionContext="elevated" /&gt;</pre>
    </li>
    <li>Save the file.</li>
    <li>Open the source file for the role.</li>
    <li>
      <p>Add the following <strong>using</strong> statement if not already present:</p>
      <pre class="prettyprint">using System.Diagnostics;</pre>
    </li>
    <li>
      <p>Create the custom performance counter category in the <strong>OnStart</strong> method of your role. The following example creates a custom category with two counters, if it does not already exist:</p>
      <pre class="prettyprint">if (!PerformanceCounterCategory.Exists("MyCustomCounterCategory"))
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
</pre>
    </li>
    <li>
      <p>Add the new custom performance counters to the Diagnostic Monitor configuration and start the Diagnostic Monitor in the <strong>OnStart</strong> method before invoking <strong>base.OnStart</strong>:</p>
      <pre class="prettyprint">DiagnosticMonitorConfiguration config =
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
</pre>
    </li>
    <li>
      <p>Update the counters within your application. The following example updates a custom performance counter on <strong>Button1</strong><strong>Click</strong> events:</p>
      <pre class="prettyprint">protected void Button1_Click(object sender, EventArgs e)
{
  button1Counter = new PerformanceCounter(
    "MyCustomCounterCategory",
    "MyButton1Counter",
    string.Empty,
    false);

  button1Counter.Increment();
  this.Button1.Text = "Button 1 count: " +
    button1Counter.RawValue.ToString();
}</pre>
    </li>
    <li>Save and build the project, and then deploy the application.</li>
  </ol>
  <p>When these steps have been completed, custom performance counter data is collected by the Windows Azure diagnostics monitor.</p>
  <p> </p>
  <h2>
    <a name="step3">
    </a>Step 3: Query performance counter data</h2>
  <p>After you configure the Windows Azure diagnostic monitor to collect and transfer performance counter data to Windows Azure storage, you can access that data for reporting. You report performance counter data in a Windows Azure application by enumerating the results of executing a <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee758648.aspx">CloudTableQuery</a> query against the <strong>WADPerformanceCountersTable</strong> in Windows Azure storage. Perform the following steps to query performance counter data.</p>
  <ol>
    <li>Open the source file for the role to contain the code.</li>
    <li>
      <p>Add the following <strong>using</strong> statements if they have not already been added:</p>
      <pre class="prettyprint">using System.Linq;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;</pre>
    </li>
    <li>
      <p>Create a class to represent the table schema for performance counter table queries:</p>
      <pre class="prettyprint">public class PerformanceCountersEntity : TableServiceEntity
{
  public long EventTickCount { get; set; }
  public string DeploymentId { get; set; }
  public string Role { get; set; }
  public string RoleInstance { get; set; }
  public string CounterName { get; set; }
  public string CounterValue { get; set; }
}</pre>
    </li>
    <li>
      <p>Get an instance of the table service context. The following code example shows how to get the default diagnostic monitor table service context:</p>
      <pre class="prettyprint">CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
  "Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString");
      CloudTableClient cloudTableClient =
  storageAccount.CreateCloudTableClient();
      TableServiceContext serviceContext =
  cloudTableClient.GetDataServiceContext();
</pre>
    </li>
    <li>
      <p>Create a query to specify which table entries to return. The following example returns processor CPU utilization entries from the last five minutes for the current role instance:</p>
      <pre class="prettyprint">IQueryable&lt;PerformanceCountersEntity&gt; performanceCountersTable =
  serviceContext.CreateQuery&lt;PerformanceCountersEntity&gt;(
    "WADPerformanceCountersTable");
var selection = from row in performanceCountersTable
  where row.EventTickCount &gt; DateTime.UtcNow.AddMinutes(-5.0).Ticks
  &amp;&amp; row.CounterName.Equals(@"\Processor(_Total)\% Processor Time")
  select row;

CloudTableQuery&lt;PerformanceCountersEntity&gt; query =
  selection.AsTableServiceQuery&lt;PerformanceCountersEntity&gt;();

// Use the Execute command explicitly on the TableServiceQuery to
// take advantage of continuation tokens automatically and get all the data.
IEnumerable&lt;PerformanceCountersEntity&gt; result = query.Execute();
</pre>
      <p>
        <strong>Note:</strong> For more information about query syntax, see <a href="http://msdn.microsoft.com/en-us/library/bb308959.aspx" target="_blank">LINQ: .NET Language-Integrated Query</a>.</p>
    </li>
    <li>
      <p>Use the result to analyze and report on application performance:</p>
      <pre class="prettyprint">List&lt;PerformanceCountersEntity&gt; list = result.ToList();
    // Display list members here.</pre>
    </li>
    <li>Save and build the project, and then deploy the application.</li>
  </ol>
  <p>When these steps have been completed, performance counter data is available for reporting.</p>
  <h2>Additional Resources</h2>
  <p>
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433048.aspx">Collecting Logging Data by Using Windows Azure Diagnostics</a>
  </p>
  <p>
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee405479.aspx">Debugging a Windows Azure Application</a>
  </p>
  <p>
    <a href="http://www.windowsazure.com/en-us/develop/net/how-to-guides/autoscaling/">How to Use the Autoscaling Application Block</a>
  </p>
</body>
<properties linkid="dev-net-commons-tasks-diagnostics" urlDisplayName="Diagnostics" pageTitle="How to use diagnostics (.NET) - Windows Azure feature guide" metaKeywords="Azure diagnostics monitoring  logs crash dumps C#" metaDescription="Learn how to use diagnostic data in Windows Azure for debugging, measuring performance, monitoring, traffic analysis, and more." metaCanonical="" disqusComments="1" umbracoNaviHide="1" writer="ryanwi"/>



<div chunk="../chunks/article-left-menu.md" />

# Enabling Diagnostics in Windows Azure

Windows Azure Diagnostics enables you to collect diagnostic data from a worker role or web role running in Windows Azure. You can use diagnostic data for debugging and troubleshooting, measuring performance, monitoring resource usage, traffic analysis and capacity planning, and auditing.

This topic explains how to enable and configure Diagnostics in your application by creating and editing the diagnostics.wadcfg configuration file.  You can also configure Diagnostics before deployment or at run-time within Visual Studio 2012 using the Windows Azure Tools 2.0 or later.  For more information, see [Configuring Windows Azure Diagnostics][]. 

For additional in-depth guidance on creating a logging and tracing strategy and using diagnostics and other techniques to troubleshoot problems, see [Troubleshooting Best Practices for Developing Windows Azure Applications][].

This task includes the following steps:

-   [Step 1: Import the Diagnostics module][]
-   [Step 2: Add the diagnostics.wadcfg file to your Visual Studio solution][]
-   [Step 3: Configure diagnostics for your application][]
-   [Step 4: Configure storage of your diagnostics data][]
-   [Step 5: Add tracing to your application][]
-   [Step 6: Build and run your application][]
-   [Step 7: View stored diagnostic data][]
-	[Next steps] []

<h2><a name="step1"> </a><span class="short-header">Import the module</span>Step 1: Import the Diagnostics module</h2>

The Windows Azure diagnostic monitor runs in Windows Azure and in the compute emulator to collect diagnostic data for a role instance. The diagnostics monitor is imported into a role by specifying an **Import** element with a **moduleName** of "Diagnostics" in the **Imports** section of the service definition file. If the Diagnostics module has been imported into the service model for a role, the diagnostic monitor automatically starts when a role instance starts. Perform the following steps to import the Diagnostics module:

1. Open the service definition file (ServiceDefinition.csdef) and add the **Import** element for the Diagnostics module. The following example shows the **Import** element added to the definition of a web role (for a worker role, add the **Import** element to the **WorkerRole** element):

        <?xml version="1.0" encoding="utf-8"?>
        <ServiceDefinition name="MyHostedService" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" schemaVersion="2012-10.1.8">
          <WebRole name="WebRole1">
			<!--<Sites> ... </Sites> -->
			<!-- <Endpoints> ... </Endpoints> -->
            <Imports>
              <Import moduleName="Diagnostics" />
            </Imports>
          </WebRole>
        </ServiceDefinition>
2. Save the ServiceDefinition.csdef file.

After you've imported the Diagnostics module you must configure diagnostics data collection in your application using the diagnostics.wadcfg file.

<h2><a name="step2"> </a><span class="short-header">Add the diagnostics.wadcfg file</span>Step 2: Add the diagnostics.wadcfg file to your Visual Studio solution</h2>

The Windows Azure SDK gives you the ability to configure Diagnostics using an XML configuration file (diagnostics.wadcfg) instead of programmatically configuring diagnostics in the [OnStart method][] of your role. This approach has several advantages over writing code:

1. Diagnostics starts before the [OnStart method][] is called, so errors in start-up tasks can be caught and logged.
2. Any changes made to the configuration at run time will remain after a restart.
3. Diagnostics configuration changes do not require the code to be rebuilt.
4. You can automatically start the diagnostics monitor in a specific configuration without needing additional code (which might cause an exception that would prevent your role from starting).

For web roles, the diagnostics.wadcfg configuration file is placed in the bin directory under the root directory of the role. For worker roles, the diagnostics.wadcfg configuration file is placed in the root directory of the role. If the configuration file exists in one of these locations when the Diagnostics module is imported, the diagnostics monitor configures settings using the configuration file instead of the default settings. When your web or worker role is deployed the configuration information in the diagnostics.wadcfg file is written to the **wad-control-container**  container in your storage account.

See [Use the Windows Azure Diagnostics Configuration File][] for an example diagnostics.wadcfg XML file.  See [Windows Azure Diagnostics Configuration Schema][] for more information on the diagnostics.wadcfg file format. 

###To add a diagnostics.wadcfg file to your Visual Studio project:

1. Right click on your worker role or web role project in Solution Explorer and select **Add** -> **New Item** -> **XML File**.
2. Enter "diagnostics.wadcfg" for the name and click **Add**.
3. To start with an empty diagnostics.wadcfg file, replace the default XML generated by Visual Studio with the following:

		<?xml version="1.0" encoding="utf-8" ?>
		<DiagnosticMonitorConfiguration xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration"
		   configurationChangePollInterval="PT1M"
		   overallQuotaInMB="4096">
		</DiagnosticMonitorConfiguration>

	The **configurationChangePollInterval** attribute specifies the interval at which the diagnostic monitor polls for diagnostic configuration changes. The default is PT1M (1 minute). The **overallQuotaInMB** attribute specifies the total amount of file system storage allocated for all logging buffers. 

	Instead of starting with an empty diagnostics.wadcfg file, you can replace the default XML with the example diagnostics.wadcfg file from [Use the Windows Azure Diagnostics Configuration File][]. 
4. Save your changes.
5. In the Properties pane, change the diagnostics.wadcfg file properties so that **Build Action** is set to **Content** and **Copy to Output Directory** is set to **Copy always**.
6. Save your changes.

###To add IntelliSense and XML schema validation support for diagnostics.wadcfg:

1. Click the **XML** menu and then **Schemas...**
2. In the **XML Schemas** windows, click **Add...**.
3. Navigate to *%ProgramFiles%\Microsoft SDKs\Windows Azure\\.NET SDK\version\schemas\DiagnosticsConfig201010.xsd* (where *version* is your installed SDK version number) and click **Open**.
4. Verify that the DiagnosticsConfig201010.xsd has been added to the XML schema set and click **OK**.
5. IntelliSense and schema validation are now enabled for your diagnostics.wadcfg configuration file.

Now that you've added the diagnostics.wadcfg file to your Visual Studio project, you need to modify it in order to collect different diagnostics data sources in your application.

<h2><a name="step3"> </a><span class="short-header">Configure diagnostics</span>Step 3: Configure diagnostics for your application</h2>

You configure the collection of different diagnostics data sources by modifying the diagnostics.wadcfg file. Only Windows Azure logs, IIS logs, and Diagnostics infrastructure logs are collected by the diagnostic monitor by default.  By setting configuration using the diagnostics.wadcfg file, however, you can override the default behavior and explicitly add sources to collect specific types of diagnostic data. This section describes the types of diagnostic data sources that you can configure your application to collect and how to modify the diagnostics.wadcfg file.  

Note: The example diagnostics.wadcfg file at [Use the Windows Azure Diagnostics Configuration File][] collects all types of diagnostics information.  If you're using the example diagnostics.wadcfg file, be sure to remove the data sources you do not want to collect in your application.

### Diagnostics Data Sources
<table border="1">
<tr>
<th>Data source</th>
<th>Default Collection</th>
<th>Role types supported</th>
<th>Format</th>
<th>Description</th>

</tr>
<tr>
<td>Windows Azure logs</td>
<td>Yes</td>
<td>Web and worker roles</td>
<td>Table</td>
<td>Logs trace messages sent from your code to the trace listener (a trace listener must be added to the web.config or app.config file). Log data will be transferred at the scheduledTransferPeriod transfer interval to storage table WADLogsTable.</td>
</tr>
<tr>
<td>IIS logs</td>
<td>Yes</td>
<td>Web roles only</td>
<td>Blob</td>
<td>Logs information about IIS sites. Log data will be transferred at the scheduledTransferPeriod transfer interval to the container you specify.</td>
</tr>
<tr><td>Windows Azure Diagnostic infrastructure logs</td>
<td>Yes</td>
<td>Web and worker roles</td>
<td>Table</td>
<td>Logs information about the platform infrastructure, the RemoteAccess module, and the RemoteForwarder module, which can be helpful in debugging role starts and platform related failures.  Collecting Diagnostic infrastructure logs will generate a high volume of records.  Log data will transferred at the scheduledTransferPeriod transfer interval to storage table WADDiagnosticInfrastructureLogsTable.</td>
</tr>
<tr>
<td>IIS Failed Request logs</td>
<td>No</td>
<td>Web roles only</td>
<td>Blob</td>
<td>Logs information about failed requests to an IIS site or application. You must also enable by setting tracing options under system.WebServer in Web.config. Log data will be transferred at the scheduledTransferPeriod transfer interval to the container you specify.</td>
</tr>
<tr>
<td>Windows Event logs</td>
<td>No</td>
<td>Web and worker roles</td>
<td>Table</td>
<td>Logs events that are typically used for troubleshooting application and driver software. Log data will be transferred at the scheduledTransferPeriod transfer interval to storage table WADWindowsEventLogsTable.</td>
</tr>
<tr>
<td>Performance counters</td>
<td>No</td>
<td>Web and worker roles</td>
<td>Table</td>
<td>Logs information about how well the operating system, application, or driver is performing. Performance counters must be specified explicitly. When these are added, performance counter data will be transferred at the scheduledTransferPeriod transfer interval to storage table WADPerformanceCountersTable.</td>
</tr>
<tr>
<td>Crash dumps</td>
<td>No</td>
<td>Web and worker roles</td>
<td>Blob</td>
<td>Logs information about the state of the operating system in the event of a system crash. Mini crash dumps are collected locally. Call the EnableCollectionToDirectory method to  enable crash dumps (pass in true to get full crash dumps, false to get mini crash dumps). Log data will be transferred at the scheduledTransferPeriod transfer interval to the container you specify. Because ASP.NET handles most exceptions, this is generally useful only for a worker role.</td>
</tr>
<tr>
<td>Custom error logs</td>
<td>No</td>
<td>Web and worker roles</td>
<td>Blob</td>
<td>By using local storage resources, custom data can be logged and transferred immediately to the container you specify.</td>
</tr>
</table>

### Some common configuration XML attributes

There are several XML element attributes which are common to many of the diagnostic data source collection settings in the diagnostics.wadcfg file.  These are:

- The **bufferQuotaInMB** attribute, which specifies the maximum amount of file system storage that is available for the data collection type (Windows Azure logs, IIS logs, etc.). The default is 0.  When the quota is reached, the oldest data is deleted as new data is added. The sum of all the **bufferQuotaInMB** and **directoryQuotaInMB** properties must not be greater than the value of the **overallQuotaInMB** attribute.  Also, the **overallQuotaInMB** amount cannot exceed the  **LocalStorage** amount in the service definition (.csdef) file in your project.  For a more detailed discussion of determining how much storage will be required for the collection of diagnostics data, see the Setup WAD section of [Troubleshooting Best Practices for Developing Windows Azure Applications][].
- The **scheduledTransferLogLevelFilter** attribute, which specifies the minimum severity level for log entries. For a description of log level filter settings, see [LogLevel Enumeration][]. The logging level setting you choose will affect the amount of data that is collected.
- The **scheduledTransferPeriod** attribute, which specifies the interval between scheduled transfers of data, rounded up to the nearest minute. In the following examples it is set to PT30M (30 minutes). Setting the transfer period to a small value, such as 1 minute, will adversely impact your application's performance in production but can be useful for seeing diagnostics working quickly when you are testing.  The scheduled transfer period should be small enough to ensure that diagnostic data is not overwritten on the instance, but large enough that it will not impact the performance of your application.
- The **directoryQuotaInMB** attribute specifies the maximum size of the directory in megabytes (default is 0). The sum of all the **bufferQuotaInMB** and **directoryQuotaInMB** properties must not be greater than the value of the **overallQuotaInMB** attribute.

### <a name="wad-logs"> </a>Windows Azure Logs

To collect Windows Azure logs, open diagnostics.wadcfg and add the following to the **DiagnosticMonitorConfiguration** element:

		<Logs bufferQuotaInMB="0"
		   scheduledTransferLogLevelFilter="Verbose"
		   scheduledTransferPeriod="PT30M" />

Trace messages from application code are persisted to the **WADLogsTable** table.  If you are going to add tracing to your 
application, which is very useful for debugging applications, you will also need to add a trace listener.  See [Step 4: Add tracing to your application][] for more information.

### <a name="iis-logs"> </a>IIS Logs

To collect IIS logs from you web role, open diagnostics.wadcfg and add the **Directories** element to the **DiagnosticMonitorConfiguration** element (if it doesn't alreaady exist) and then add the **IISLogs** element:

		<Directories bufferQuotaInMB="0" scheduledTransferPeriod="PT30M">
		   <IISLogs container="wad-iis" directoryQuotaInMB="0" />
		</Directories>

The **container** attribute specifies the name of the container in storage where the contents of the directory are to be transferred. 

Once the collection of IIS logs is configured, log data will be transferred to the **wad-iis** container (or the container you specify) in your storage account.

### <a name="wad-infra-logs"> </a>Windows Azure Diagnostic infrastructure logs

To collect Windows Azure diagnostic infrastructure logs, open diagnostics.wadcfg and add the following to the **DiagnosticMonitorConfiguration** element:

		<DiagnosticInfrastructureLogs bufferQuotaInMB="0"
		                              scheduledTransferLogLevelFilter="Verbose"
		                              scheduledTransferPeriod="PT30M" />

Once the collection of Windows Azure diagnostic infrastructure logs is configured, log data will be transferred to the **WADDiagnosticInfrastructureLogsTable** table in your storage account. 

### <a name="fail-reqs"> </a>IIS Failed Request Trace Logs

To collect IIS failed request trace logs, open diagnostics.wadcfg and add the **Directories** element to the **DiagnosticMonitorConfiguration** element (if it doesn't alreaady exist) and then add the **FailedRequestLogs** element:

		<Directories bufferQuotaInMB="0" scheduledTransferPeriod="PT30M">
		   <FailedRequestLogs container="wad-frq" directoryQuotaInMB="0" />
		</Directories>

The **container** attribute specifies the name of the container in storage where the contents of the directory are to be transferred. 

You must also define a **tracing** element in the configuration file for the web role. Perform the following steps to initialize the collection of failed request data.

1.  Open the web.config file for the web role.
2.  Add the following code to the **system.webServer** element and change the list of providers to reflect the data that you want to collect:

        <tracing>
          <traceFailedRequests>
            <add path="*">
              <traceAreas>
                 <add provider="ASP" verbosity="Verbose" />
                 <add provider="ASPNET" areas="Infrastructure,Module,Page,AppServices" verbosity="Verbose" />
                 <add provider="ISAPI Extension" verbosity="Verbose" />
                 <add provider="WWW Server"
                 areas="Authentication,
                                              Security,
                                              Filter,
                                              StaticFile,
                                              CGI,
                        Compression,
                        Cache,
                        RequestNotifications,
                        Module"
                 verbosity="Verbose" />
            </traceAreas>
            <failureDefinitions statusCodes="400-599" />
           </add>
            </traceFailedRequests>
           </tracing>
3.  Save the file.

After you add the configuration information in the web.config and diagnostics.wadcfg files, failed requests will be automatically collected and transferred to the **wad-frq** container in your storage account; no additional API calls are required. For more information about configuring failed request tracing, see [Adding Trace Failed Requests in the IIS 7.0 Configuration Reference][].

### <a name="winlogs"> </a>Windows Event Logs

To collect event data from the Windows Event logs, open the diagnostics.wadcfg file and add the following to the **DiagnosticMonitorConfiguration** element:

		<WindowsEventLog bufferQuotaInMB="0" 
		                 scheduledTransferLogLevelFilter="Verbose
		                 scheduledTransferPeriod="PT30M">
            <DataSource name="Application!*" />
		    <DataSource name="System!*" />
 		</WindowsEventLog>
		

The **DataSource** elements specify that the Application and System channels will be monitored. 

Windows Azure Diagnostics cannot be used to read the Security channel in the Windows Event logs. An application runs in Windows Azure under a restricted Windows service account that does not have permissions to read the security channel. If you request log information from the Security channel, the diagnostic configuration will not work properly until you remove the code that makes the request.

Once the collection of Windows Event logs is configured, log data will be transferred to the **WADWindowsEventLogsTable** table in your storage account.

### <a name="perf"> </a>Performance Counters

You can configure the collection of performance counter data in a Windows Azure application. You can also create custom performance counters in a Windows Azure application by adding the custom category and one or more custom counters to the definition of your web role or worker role. For more information about creating and using performance
counters, see [Using Performance Counters in Windows Azure][].

### <a name="crash"> </a>Crash Dumps

You collect crash dump data by specifying local storage resources in the ServiceDefinition.csdef file and programmatically enabling crash dumps in the [OnStart method] of your role (there is no declarative mechanism for enabling crash dumps). Perform the following steps to enable crash dumps: 

1. Open the ServiceDefinition.csdef file, add the **LocalStorage** element, then save your changes. The following example shows the element added to the definition of a worker role:

		<?xml version="1.0" encoding="utf-8"?>
		<ServiceDefinition name="DiagWorkerRole" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" schemaVersion="2012-10.1.8">
		<WorkerRole name="WorkerRole1" vmsize="Small">
		<Imports> ... </Imports>
		<LocalResources>
		   <LocalStorage name="MyCustomCrashDumpsLocation" sizeInMB="1024" cleanOnRoleRecycle="false" />
		</LocalResources>
		</WorkerRole>
		</ServiceDefinition>

	Set the **name** attribute to any value desired.  Set the **sizeInMB** attribute value large enough to hold the anticipated crash dump data.  By setting the **cleanOnRoleRecycle** attribute value to false, you ensure that the local storage "MyCustomLogs" is not deleted when the role recycles. For more information about local storage resources, see [How to Configure Local Storage Resources][].

2. Add the following code to the [OnStart method][] of your role. The following code snippet creates a DiagnosticMonitorConfiguration object, enables full crash dump collection to the *MyCustomCrashDumpsLocation* resource, adds the path to the list of directories that are monitored for diagnostic data, and sets a transfer interval of 30 minutes.

		public override bool OnStart()
		{
		// Get the default initial configuration for DiagnosticMonitor.
		DiagnosticMonitorConfiguration diagnosticConfiguration = DiagnosticMonitor.GetDefaultInitialConfiguration();

		// Create a custom logging path for crash dumps.
		string customCrashDumpsPath = RoleEnvironment.GetLocalResource("MyCustomCrashDumpsLocation").RootPath;

		// Enable full crash dump collection to the custom path. Pass in false
		// to enable mini crash dump collection. 
		CrashDumps.EnableCollectionToDirectory(customCrashDumpsPath, true);

		// Create a new DirectoryConfiguration object.
		DirectoryConfiguration directoryConfiguration = new DirectoryConfiguration();

		// Add the name for the blob container in Windows Azure storage.
		directoryConfiguration.Container = "wad-crash-dumps";

		// Add the directory size quota.
		directoryConfiguration.DirectoryQuotaInMB = RoleEnvironment.GetLocalResource("MyCustomCrashDumpsLocation").MaximumSizeInMegabytes;

		// Add the crash dumps path.
		directoryConfiguration.Path = customCrashDumpsPath;

		// Schedule a transfer period of 30 minutes.
		diagnosticConfiguration.Directories.ScheduledTransferPeriod = TimeSpan.FromMinutes(30.0);

		// Add the directoryConfiguration to the Directories collection.
		diagnosticConfiguration.Directories.DataSources.Add(directoryConfiguration);

		// Start the DiagnosticMonitor using the diagnosticConfig and our connection string.
		DiagnosticMonitor.Start("Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString", diagnosticConfiguration);

		return base.OnStart();
		}


### <a name="custom"> </a>Custom Error Logs

You can collect data in a custom log file. The custom log file is created in a local storage resource. You create the local storage resource by adding a **LocalResources** element to the service definition file and then updating the configuration of the Windows Azure diagnostic monitor. Perform the following steps to initialize the collection of custom log data.

1.  Open the service definition file (CSDEF) using your favorite text editor, add the **LocalStorage** element, then save your changes. The following example shows the element added to the definition of a web role:

        <?xml version="1.0" encoding="utf-8"?>
        <ServiceDefinition xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" name="MyService">
          <WebRole name="WebRole1">
            <LocalResources>
              <LocalStorage name="MyCustomLogs" sizeInMB="10" cleanOnRoleRecycle="false" />
            </LocalResources>
          </WebRole>
        </ServiceDefinition>

    Set the **name** attribute to any value desired.  Set the **sizeInMB** attribute value large enough to hold the anticipated log data.  By setting the **cleanOnRoleRecycle** attribute value to false, you ensure that the local storage "MyCustomLogs" is not deleted when the role recycles. For more information about local storage resources, see [How to Configure Local Storage Resources][].

2.  Open the diagnostics.wadcfg file, add the following to the **DiagnosticMonitorConfiguration** element, and save your changes:

		<Directories bufferQuotaInMB="0" scheduledTransferPeriod="PT30M">
		   <DataSources>
		      <DirectoryConfiguration container="diagnostics-custom-logs" directoryQuotaInMB="128">
		         <LocalResource name="MyCustomLogs" relativePath="." />
		      </DirectoryConfiguration>
		   </DataSources>
		</Directories>

	Set the **container** attribute value to the name of the Windows Azure Storage container you want Diagnostics to use.  Diagnostics automatically creates the container if it does not exist.  Set the **name** and **directoryQuotaInMB** attribute value to the same value used for the **LocalStorage** attribute values in step 1. Set the **relativePath** attribute value, “.” means from the root of the local storage.

When a file is created in the directory that is specified in the **relativePath** attribute of the **LocalResource** element, it is transferred automatically as a blob to the container that is defined in the **container** attribute of the **DirectoryConfiguration** element when the scheduled transfer period ends. The file is not removed from the file system when it is transferred to storage, so you’ll need to implement a cleanup strategy. The file is removed by the Windows Azure diagnostic monitor if the size exceeds the diagnostics quota size that you configure.

<h2><a name="step4"> </a><span class="short-header">Configure storage of your diagnostics data</span>Step 4: Configure storage of your diagnostics data</h2>

After you've set your diagnostics configuration, you need to set up storage to persist your diagnostics data.  Diagnostics data is first collected on the instance and then it is persisted to Windows Azure Storage.  If you're testing your application locally in the Compute Emulator, you can also store diagnostics data locally in the Storage Emulator. Before you store diagnostics data you must first go to the [Windows Azure Management Portal][] and create a storage account. A best practice is to locate your storage account in the same geo-location as your Windows Azure application in order to avoid paying external bandwidth costs and to reduce latency.

### Specify the storage account

To persist your diagnostics information to your Azure Storage account, you must specify a connection string in your service configuration (ServiceConfiguration.cscfg) file.

Windows Azure Tools for Visual Studio version 1.4 (August 2011) and later allows you to have different configuration files (ServiceConfiguration.cscfg) for Local and Cloud. Multiple service configurations are useful for diagnostics because you can use the Storage Emulator for local testing free of charge while maintaining a separate configuration file for production.

To set the connection strings:

1.  Open the ServiceConfiguration.Cloud.cscfg file using your favorite text editor and set the connection string for your storage account:

        <ConfigurationSettings>
          <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="DefaultEndpointsProtocol=https;AccountName=<name>;AccountKey=<key>"/>
        </ConfigurationSettings>

    The **AccountName** and **AccountKey** values are found in the [Windows Azure Management Portal][] in the storage account dashboard, under **Manage Access Keys**.

2.  Save the ServiceConfiguration.Cloud.cscfg file.
3.  Open the ServiceConfiguration.Local.cscfg file and verify that **UseDevelopmentStorage** is set to true (the default).

		<ConfigurationSettings>
      	   <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="UseDevelopmentStorage=true" />
		</ConfigurationSettings>

Now that the connection strings are set, your application will persist diagnostics data to your storage account when your application is deployed.  

<h2><a name="step5"> </a><span class="short-header">Add tracing</span>Step 5: Add tracing to your application</h2>

Perhaps the most important diagnostic data is the trace messages that you as a developer add to your own code. System data may show exceptions or log error messages. You can trace down to specific calls to dependent systems. The best practice would be to add a trace message when calling a dependent system that may fail; for example, a third-party authentication service.  Simply add the **System.Diagnostics** namespace to your code and then add trace messages, which in C# would look like the following:

		Trace.WriteLine("LoggingWorkerRole entry point called", "Information");

Trace messages are persisted to the **WADLogsTable** table (make sure you enabled this in the diagnostics.wadcfg file in **Step 3**). Windows Azure automatically associates the following information with each logged event: a timestamp, a tick count (which provides more detailed timing with 100-nanosecond granularity), and information about the deployment, role and role instance. This allows you to narrow down logs to specific instances.

When using Trace, Debug and TraceSource, you must have a mechanism for collecting and recording the messages that are sent. Trace messages are received by listeners. The purpose of a listener is to collect, store, and route tracing messages. Listeners direct the tracing output to an appropriate target, such as a log, window, or text file. For Diagnostics, the [DiagnosticMonitorTraceListener Class][] class is used.  

To add a trace listener to your Windows Azure application:

1. Open the web.config file (for a web role) or app.config file (for a worker role) for your application.
2. Add the following to the **configuration** element.

		<system.diagnostics>
		<trace>
		<listeners>
			<add type="Microsoft.WindowsAzure.Diagnostics.DiagnosticMonitorTraceListener, Microsoft.WindowsAzure.Diagnostics, Version=1.8.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"
                 name="AzureDiagnostics">
				<filter type="" />
			</add>
		</listeners>
		</trace>
		</system.diagnostics>		
3. Save the web.config or app.config

After you add the configuration information in the web.config, trace messages will be transferred to the **WADLogsTable** table.

<h2><a name="step6"> </a><span class="short-header">Build and run</span>Step 6: Build and run your application</h2>

Once you've configured diagnostics for your application save your changes, build your application, and then deploy to Windows Azure.  When each role instance starts up the diagnostics monitor will begin collecting the diagnostics data you specified and persisting it to storage at periodic intervals.  Instead of deploying your application to Windows Azure, you can also run it locally in the Compute Emulator for testing.  Diagnostics data would then be persisted to the Storage Emulator.

<h2><a name="step7"> </a><span class="short-header">View data</span>Step 7: View stored diagnostic data</h2>

Once your application is deployed and running the Diagnostics monitor will begin collecting performance counters and persisting that data to Windows Azure storage.  The following tools are some of the many options available to view data in a storage account:

-   **Server Explorer in Visual Studio** - If you install the Windows Azure Tools 2.0 or later for Visual Studio 2010 or Visual Studio 2012, you can use the Windows Azure Storage node in Server Explorer to view read-only blob and table data from your Windows Azure storage accounts. You can display data from your local storage emulator account and also from storage accounts you have created for Windows Azure. For more information, see [Browsing Storage Resources with Server Explorer][].
-   **Azure Storage Explorer by Neudesic** - Azure Storage Explorer is a useful graphical user interface tool for inspecting and altering the data in your Windows Azure storage projects including the logs of your Windows Azure applications. To download the tool, see [Azure Storage Explorer][].
-   **Azure Diagnostics Manager by Cerebrata** - Azure Diagnostics Manager is a Windows (WPF) based client for managing Windows Azure Diagnostics. It lets you view, download, and manage the diagnostics data collected by the applications running in Windows Azure. To download the tool, see [Azure Diagnostics Manager][].

You can also programmatically access the diagnostics data in Windows Azure Storage using the Windows Azure Storage Client Library for .NET.  For more information, see [How to use the Windows Azure Blob Storage Service][] and [How to use the Table Storage Service][].

<h2><a name="nextsteps"> </a><span class="short-header">Next steps</span>Next steps</h2>

-	[Remotely Change the Diagnostic Monitor Configuration][] - Once you've deployed your application you can modify the Diagnostics configuration.
-	[Using performance counters in Windows Azure] [] - You can use performance counters in a Windows Azure application to collect data that can help determine system bottlenecks and fine-tune system and application performance.
-	[How to monitor cloud services] [] - You can monitor key performance metrics for your cloud services in the [Windows Azure Management Portal][].

<h2><a name="additional"> </a><span class="short-header">Additional resources</span>Additional resources</h2> 

- [Collecting Logging Data by Using Windows Azure Diagnostics][]
- [Debugging a Windows Azure Application][]
- [Configuring Windows Azure Diagnostics][]

  [Troubleshooting Best Practices for Developing Windows Azure Applications]: http://msdn.microsoft.com/en-us/library/windowsazure/hh771389.aspx
  [Step 1: Import the Diagnostics module]: #step1
  [Step 2: Add the diagnostics.wadcfg file to your Visual Studio solution]: #step2
  [Step 3: Configure diagnostics for your application]: #step3
  [Step 4: Configure storage of your diagnostics data]: #step4
  [Step 5: Add tracing to your application]: #step5
  [Step 6: Build and run your application]: #step6
  [Step 7: View stored diagnostic data]: #step7
  [Next steps]: #nextsteps
  [Additional resources]: #additional

  [Using performance counters in Windows Azure]: ./profiling.md
  [How to monitor cloud services]: ../../../ITPro/Services/cloud-services/howto-monitor-cloud-service.md
  [DiagnosticMonitorTraceListener Class]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitortracelistener.aspx
  [How to Use the Windows Azure Diagnostics Configuration File]: http://msdn.microsoft.com/en-us/library/windowsazure/hh411551.aspx
  [Adding Trace Failed Requests in the IIS 7.0 Configuration Reference]: http://www.iis.net/ConfigReference/system.webServer/tracing/traceFailedRequests/add
  [Using Performance Counters in Windows Azure]: /en-us/develop/net/common-tasks/performance-profiling/
  [How to Configure Local Storage Resources]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758708.aspx
  [Browsing Storage Resources with Server Explorer]: http://msdn.microsoft.com/en-us/library/windowsazure/ff683677.aspx
  [Azure Storage Explorer]: http://azurestorageexplorer.codeplex.com/
  [Azure Diagnostics Manager]: http://www.cerebrata.com/Products/AzureDiagnosticsManager/Default.aspx
  [Collecting Logging Data by Using Windows Azure Diagnostics]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433048.aspx
  [Debugging a Windows Azure Application]: http://msdn.microsoft.com/en-us/library/windowsazure/ee405479.aspx
  [Use the Windows Azure Diagnostics Configuration File]: http://msdn.microsoft.com/en-us/library/windowsazure/hh411551.aspx
  [LogLevel Enumeration]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.loglevel.aspx
  [OnStart method]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.serviceruntime.roleentrypoint.onstart.aspx
  [Windows Azure Diagnostics Configuration Schema]: http://msdn.microsoft.com/en-us/library/gg593185.aspx
  [How to use the Table Storage Service]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/table-services/
  [How to use the Windows Azure Blob Storage Service]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/blob-storage/
  [Windows Azure Management Portal]: http://manage.windowsazure.com
  [Remotely Change the Diagnostic Monitor Configuration]: http://msdn.microsoft.com/en-us/library/windowsazure/gg432992.aspx
  [Configuring Windows Azure Diagnostics]: http://msdn.microsoft.com/en-us/library/windowsazure/dn186185.aspx  
   
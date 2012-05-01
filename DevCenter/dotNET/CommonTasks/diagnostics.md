  <properties linkid="dev-net-commons-tasks-diagnostics" urlDisplayName="Diagnostics" headerExpose="" pageTitle="Enable Diagnostics - .NET" metaKeywords="Azure diagnostics, Azure monitoring, Azure logs, Azure event logs, Azure logging, Azure crash dumps, Azure diagnostics C#, Azure monitoring C#, Azure logs C#, Azure event logs C#, Azure logging C#, Azure crash dumps C#" footerExpose="" metaDescription="Learn how to collect and view diagnostic data from an application running in Windows Azure. You can use diagnostic data for debugging and troubleshooting, measuring performance, monitoring resource usage, traffic analysis and capacity planning, and auditing." umbracoNaviHide="0" disqusComments="1" />
  <h1>Enabling Diagnostics in Windows Azure</h1>
  <p>Windows Azure Diagnostics enables you to collect diagnostic data from an application running in Windows Azure. You can use diagnostic data for debugging and troubleshooting, measuring performance, monitoring resource usage, traffic analysis and capacity planning, and auditing.</p>
  <p>For additional in-depth guidance about using diagnostics and other techniques to troubleshoot problems and optimize Windows Azure applications, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh771389.aspx">Troubleshooting Best Practices for Developing Windows Azure Applications</a>.</p>
  <p>This task includes the following steps:</p>
  <ul>
    <li>
      <a href="#step1">Step 1: Import the Diagnostics module</a>
    </li>
    <li>
      <a href="#step2">Step 2: Configure diagnostics for your application</a>
    </li>
    <li>
      <a href="#step3">Step 3: (Optional) Permanently store diagnostic data</a>
    </li>
    <li>
      <a href="#step4">Step 4: (Optional) View stored diagnostic data</a>
    </li>
  </ul>
  <h2>
    <a name="step1">
    </a>Step 1: Import the Diagnostics module</h2>
  <p>The Windows Azure diagnostic monitor runs in Windows Azure and in the compute emulator to collect diagnostic data for a role instance. You collect diagnostic data by importing the Diagnostics module into the service model. If the Diagnostics module has been imported into the service model for a role, the diagnostic monitor automatically starts when a role instance starts. Perform the following steps to import the Diagnostics module.</p>
  <ol>
    <li>
      <p>Open the service definition file (CSDEF) and add the <strong>Import </strong> element for the Diagnostics module. The following example shows the element added to the definition of a web role:</p>
      <pre class="prettyprint">&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;ServiceDefinition name="MyHostedService" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition"&gt;
  &lt;WebRole name="WebRole1"&gt;
    &lt;Imports&gt;
      &lt;Import moduleName="Diagnostics" /&gt;
    &lt;/Imports&gt;
  &lt;/WebRole&gt;
&lt;/ServiceDefinition&gt;
</pre>
    </li>
    <li>
      <p>Save the file.</p>
    </li>
  </ol>
  <p>When these steps have been completed, the Diagnostics module has been imported and you can configure your application to collect diagnostic data.</p>
  <h2>
    <a name="step2">
    </a>Step 2: Configure diagnostics for your application</h2>
  <p>Only some of the available sources for collecting diagnostic data are added to the diagnostic monitor by default, you must add others to collect specific types of diagnostic data. The following table lists the types of diagnostic data that you can configure your application to collect.</p>
  <table border="2" cellspacing="0" cellpadding="5" align="left" style="border: 2px solid #000000;">
    <tbody>
      <tr>
        <td style="width: 200px;">
          <strong>Data source</strong>
        </td>
        <td style="width: 400px;">
          <strong>Description</strong>
        </td>
        <td style="width: 200px;">
          <strong>Role types supported</strong>
        </td>
      </tr>
      <tr>
        <td>Windows Azure logs</td>
        <td>Collected by default. Logs trace messages sent to the trace listener (added to the web.config or app.config file). For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitortracelistener.aspx">DiagnosticMonitorTraceListener Class</a>.</td>
        <td>Web and worker roles</td>
      </tr>
      <tr>
        <td>IIS 7.0 logs</td>
        <td>Collected by default. Logs information about IIS sites.</td>
        <td>Web roles only</td>
      </tr>
      <tr>
        <td>Windows Azure Diagnostic infrastructure logs</td>
        <td>Collected by default. Logs information about the diagnostic infrastructure, the <strong>RemoteAccess</strong> module, and the <strong>RemoteForwarder</strong> module.</td>
        <td>Web and worker roles</td>
      </tr>
      <tr>
        <td>
          <a href="#fail-reqs">Failed Request logs</a>
        </td>
        <td>Logs information about failed requests to an IIS site or application.</td>
        <td>Web roles only</td>
      </tr>
      <tr>
        <td>
          <a href="#winlogs">Windows Event logs</a>
        </td>
        <td>Logs events that are typically used for troubleshooting application and driver software.</td>
        <td>Web and worker roles</td>
      </tr>
      <tr>
        <td>
          <a href="#perf">Performance counters</a>
        </td>
        <td>Logs information about how well the operating system, application, or driver is performing.</td>
        <td>Web and worker roles</td>
      </tr>
      <tr>
        <td>
          <a href="#crash">Crash dumps</a>
        </td>
        <td>Logs information about the state of the operating system in the event of a system crash.</td>
        <td>Web and worker roles</td>
      </tr>
      <tr>
        <td>
          <a href="#custom">Custom error logs</a>
        </td>
        <td>By using local storage resources, custom data can be logged.</td>
        <td>Web and worker roles</td>
      </tr>
    </tbody>
  </table>
  <p style="clear: both;">
    <strong>Note</strong>: If you are creating an application that uses the VM role, you can use the Windows Azure diagnostics configuration file to configure the data sources. For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh411551.aspx">How to Use the Windows Azure Diagnostics Configuration File</a>.</p>
  <h3>
    <a name="fail-reqs">
    </a>IIS 7.0 Failed Request Trace Logs</h3>
  <p>You can collect data from the failed request trace logs by defining a <strong> tracing</strong> element in the configuration file for the web role. Perform the following steps to initialize the collection of failed request data.</p>
  <ol>
    <li>Open the web.config file for the web role.</li>
    <li>
      <p>Add the following code to the <strong>system.webServer</strong> section and change the list of providers to reflect the data that you want to collect:</p>
      <pre class="prettyprint">&lt;tracing&gt;
  &lt;traceFailedRequests&gt;
    &lt;add path="*"&gt;
      &lt;traceAreas&gt;
         &lt;add provider="ASP" verbosity="Verbose" /&gt;
         &lt;add provider="ASPNET" areas="Infrastructure,Module,Page,AppServices" verbosity="Verbose" /&gt;
         &lt;add provider="ISAPI Extension" verbosity="Verbose" /&gt;
         &lt;add provider="WWW Server"
         areas="Authentication,
                                      Security,
                                      Filter,
                                      StaticFile,
                                      CGI,
                Compression,
                Cache,
                RequestNotifications,
                Module"
         verbosity="Verbose" /&gt;
    &lt;/traceAreas&gt;
    &lt;failureDefinitions statusCodes="400-599" /&gt;
   &lt;/add&gt;
    &lt;/traceFailedRequests&gt;
   &lt;/tracing&gt;

</pre>
    </li>
    <li>Save the file.</li>
  </ol>
  <p>After you add the configuration information in the web.config, failed requests are automatically collected; no additional API calls are required. For more information about configuring failed request tracing, see <a href="http://www.iis.net/ConfigReference/system.webServer/tracing/traceFailedRequests/add" target="_blank">Adding Trace Failed Requests in the IIS 7.0 Configuration Reference</a>.</p>
  <h3>
    <a name="winlogs">
    </a>Windows Event Logs</h3>
  <p>You can collect event data from the Windows Event logs by calling the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitor.getdefaultinitialconfiguration.aspx">GetDefaultInitialConfiguration</a> method, adding the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitorconfiguration.windowseventlog.aspx">WindowsEventLog</a> data source, and then calling the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee772717.aspx">Start</a> method with the changed configuration. Perform the following steps to initialize the collection of event data.</p>
  <ol>
    <li>
      <p>Open the source file that contains the entry point for the role.</p>
    </li>
    <li>
      <p>Ensure that the project references the <strong>Microsoft.WindowsAzure.Diagnostics.dll </strong>file and that the following <strong>using</strong> statement is added to the file:</p>
      <pre class="prettyprint">using Microsoft.WindowsAzure.Diagnostics;</pre>
      <p>
        <strong>Note</strong>: The code in the following steps is typically added to the <strong>OnStart</strong> method of the role.</p>
    </li>
    <li>
      <p>Get an instance of the configuration. The following code example shows how to get the configuration object:</p>
      <pre class="prettyprint">var config = DiagnosticMonitor.GetDefaultInitialConfiguration();</pre>
    </li>
    <li>
      <p>Specify the data buffer for collecting event data. For more information about the data buffers that can be added, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitorconfiguration.aspx">DiagnosticMonitorConfiguration</a>. The following example shows the <strong>WindowsEventLog</strong> data buffer being added to the configuration, which is defined to collect event data from the System channel:</p>
      <pre class="prettyprint">config.WindowsEventLog.DataSources.Add("System!*");</pre>
      <p>
        <strong>Note</strong>: Windows Azure Diagnostics cannot be used to read the Security channel in the Windows Event logs. An application runs in Windows Azure under a restricted Windows service account that does not have permissions to read the security channel. If you request log information from the Security channel, the diagnostic configuration will not work properly until you remove the code that makes the request.</p>
    </li>
    <li>
      <p>Restart the diagnostic monitor with the changed configuration. The following code example shows how to restart the monitor:</p>
      <pre class="prettyprint">DiagnosticMonitor.Start("Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString", config);</pre>
      <p>
        <strong>Note</strong>: This code example shows the use of a connection string. For more information about using connection strings, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee758697.aspx">How to Configure Connection Strings</a>.</p>
    </li>
    <li>
      <p>Save and build the project, and then deploy the application.</p>
    </li>
  </ol>
  <h3>
    <a name="perf">
    </a>Performance Counters</h3>
  <p>You can configure the collection of performance counter data in a Windows Azure application. You can also create custom performance counters in a Windows Azure application by adding the custom category and one or more custom counters to the definition of your web role or worker role. For more information about creating and using performance counters, see ,<a id="dev-net-commons-tasks-profiling" href="/en-us/develop/net/common-tasks/performance-profiling/">Using Performance Counters in Windows Azure</a>.</p>
  <h3>
    <a name="crash">
    </a>Crash Dumps</h3>
  <p>You collect crash dump data by calling either the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.crashdumps.enablecollection.aspx">EnableCollection</a> or <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.crashdumps.enablecollectiontodirectory.aspx">EnableCollectionToDirectory</a> method from the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.crashdumps.aspx">CrashDumps</a> class. By default, these methods enable collection of a subset of crash dump information. You can also specify collection of complete crash dump information. Perform the following steps to initialize the collection of crash dump data.</p>
  <ol>
    <li>
      <p>Open the source file for the role.</p>
    </li>
    <li>
      <p>Ensure that the project references the <strong>Microsoft.WindowsAzure.Diagnostics.dll</strong> file and that the following using statement is added to the file:</p>
      <pre class="prettyprint">using Microsoft.WindowsAzure.Diagnostics;</pre>
    </li>
    <li>
      <p>Call the <strong>EnableCollection</strong> method of the <strong>CrashDumps</strong> class with the <strong>true</strong> parameter to collect the complete crash dump data:</p>
      <pre class="prettyprint">Microsoft.WindowsAzure.Diagnostics.CrashDumps.EnableCollection(true);</pre>
      <p>
        <strong>- Or -</strong>
      </p>
      <p>Add the code to call the <strong>EnableCollection</strong> method of the <strong>CrashDumps</strong> class with the <strong>false</strong> parameter to collect the partial crash dump data:</p>
      <pre class="prettyprint">Microsoft.WindowsAzure.Diagnostics.CrashDumps.EnableCollection(false);</pre>
    </li>
    <li>
      <p>Save and build the project, and then deploy the application.</p>
    </li>
  </ol>
  <h3>
    <a name="custom">
    </a>Custom Error Logs</h3>
  <p>You can collect data in a custom log file. The custom log file is created in a local storage resource. You create the local storage resource by using the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.serviceruntime.localresource.aspx">LocalResource Class</a> and adding the local storage resource to the configuration of the Windows Azure diagnostic monitor. Perform the following steps to initialize the collection of custom log data.</p>
  <ol>
    <li>
      <p>Open the service definition file (CSDEF) using your favorite text editor and add the <strong>LocalStorage</strong> element. The following example shows the element added to the definition of a web role:</p>
      <pre class="prettyprint">&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;ServiceDefinition xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" name="MyService"&gt;
  &lt;WebRole name="WebRole1"&gt;
    &lt;LocalResources&gt;
      &lt;LocalStorage name="MyCustomLogs" sizeInMB="10" cleanOnRoleRecycle="false" /&gt;
    &lt;/LocalResources&gt;
  &lt;/WebRole&gt;
&lt;/ServiceDefinition&gt;
</pre>
      <p>For more information about local storage resources, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee758708.aspx">How to Configure Local Storage Resources</a>.</p>
    </li>
    <li>
      <p>Save the file.</p>
    </li>
    <li>
      <p>Open the source file that contains the entry point for the role.</p>
    </li>
    <li>
      <p>Ensure that the project references the <strong>Microsoft.WindowsAzure.Diagnostics.dll </strong>file and that the following <strong>using</strong> statement is added to the file:</p>
      <pre class="prettyprint">using Microsoft.WindowsAzure.Diagnostics;</pre>
      <p>
        <strong>Note</strong>: The code in the following steps is typically added to the <strong>OnStart</strong> method of the role.</p>
    </li>
    <li>
      <p>Add the following code to initialize the local storage resource object:</p>
      <pre class="prettyprint">LocalResource localResource = RoleEnvironment.GetLocalResource("MyCustomLogs");</pre>
    </li>
    <li>
      <p>Create a <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.directoryconfiguration.aspx">DirectoryConfiguration</a> object by using the local storage resource object. The following example shows the creation of the object:</p>
      <pre class="prettyprint">DirectoryConfiguration dirConfig = new DirectoryConfiguration();
dirConfig.Container = "wad-mycustomlogs-container";
dirConfig.DirectoryQuotaInMB = localResource.MaximumSizeInMegabytes;
dirConfig.Path = localResource.RootPath;</pre>
      <p>For more information about the naming of containers, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dd135715.aspx">Naming Containers, Blobs, and Metadata</a>.</p>
    </li>
    <li>
      <p>Add the <strong>DirectoryConfiguration</strong> object to the configuration of the diagnostic monitor. The following example shows the creation of an <strong>DiagnosticMonitorConfiguration</strong> object:</p>
      <pre class="prettyprint">DiagnosticMonitorConfiguration diagMonitorConfig = DiagnosticMonitor.GetDefaultInitialConfiguration();
diagMonitorConfig.Directories.ScheduledTransferPeriod = TimeSpan.FromMinutes(1.0);
diagMonitorConfig.Directories.DataSources.Add(dirConfig);</pre>
    </li>
    <li>
      <p>Restart the diagnostic monitor with the new configuration:</p>
      <pre class="prettyprint">CloudStorageAccount storageAccount = CloudStorageAccount.DevelopmentStorageAccount;
DiagnosticMonitor diagMonitor = DiagnosticMonitor.Start(storageAccount, diagMonitorConfig);</pre>
      <p>The previous code example shows the creation of a <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.cloudstorageaccount.aspx">CloudStorageAccount</a>object by using credentials for the storage emulator. To use Windows Azure storage, you can use the following:</p>
      <pre class="prettyprint">StorageCredentialsAccountAndKey credentials = new StorageCredentialsAccountAndKey(accountName, accountKey);
CloudStorageAccount storageAccount = new CloudStorageAccount(credentials, true);</pre>
      <p>Where <strong>accountName</strong> and <strong>accountKey</strong> are the values that are associated with your storage account.</p>
    </li>
  </ol>
  <p>When a file is created in the directory that is specified in the Path property of the <strong>DirectoryConfiguration</strong> object, it is transferred automatically as a blob to the container that is defined in the <strong>Container</strong> property when the scheduled transfer period ends. The file is not removed from the file system when it is transferred to storage. The file is removed by the Windows Azure diagnostic monitor based on the diagnostics quota size that you configure.</p>
  <p>After you configure the data sources, your application is ready to collect diagnostic data. You can now decide whether you want to permanently store the diagnostic data.</p>
  <h2>
    <a name="step3">
    </a>Step 3: (Optional) Permanently store diagnostic data</h2>
  <p>Diagnostic data is not permanently stored unless you transfer the data to Windows Azure storage. If you intend to transfer diagnostic data to Windows Azure storage, you must ensure that the correct account name and account key are used.</p>
  <h3>Specify the storage account</h3>
  <p>To configure the storage account information, you provide a value for the <strong>Setting</strong> element in the service configuration file (CSCFG). Perform the following steps to specify the storage account information.</p>
  <p>
    <strong>Note</strong>: The <strong>Setting</strong> element is automatically added when the Diagnostics module is imported. The default value is <strong>UseDevelopmentStorage=true</strong>.</p>
  <ol>
    <li>
      <p>Open the service configuration file using your favorite text editor and change the value of the <strong>Setting</strong> element:</p>
      <pre class="prettyprint">&lt;ConfigurationSettings&gt;
  &lt;Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="DefaultEndpointsProtocol=https;AccountName=AccountName;AccountKey=AccountKey"/&gt;
&lt;/ConfigurationSettings&gt;
</pre>
      <p>Where <strong>AccountName</strong> is the name of the Windows Azure storage account, and <strong>AccountKey</strong> is the access key for the storage account.</p>
    </li>
    <li>
      <p>Save the file.</p>
    </li>
  </ol>
  <h3>Schedule the transfer of data</h3>
  <p>You can change the configuration of the Windows Azure diagnostic monitor to schedule the transfer of diagnostic data. You transfer data by assigning a <strong>TimeSpan</strong> to the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticdatabufferconfiguration.scheduledtransferperiod.aspx">ScheduledTransferPeriod</a> property of the data buffer, and then calling the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee772721.aspx">Start</a> method with the changed configuration. Perform the following steps to schedule the transfer of data.</p>
  <ol>
    <li>
      <p>Open the source file for the role.</p>
    </li>
    <li>
      <p>Ensure that the project references the <strong>Microsoft.WindowsAzure.Diagnostics.dll </strong>file and that the following using statement is added to the file:</p>
      <pre class="prettyprint">using Microsoft.WindowsAzure.Diagnostics;</pre>
    </li>
    <li>
      <p>Get an instance of the configuration. The following code example shows how to get the configuration object:</p>
      <pre class="prettyprint">var config = DiagnosticMonitor.GetDefaultInitialConfiguration();</pre>
    </li>
    <li>
      <p>Specify the transfer time period. The following code example shows how to schedule a transfer that occurs every minute:</p>
      <pre class="prettyprint">config.WindowsEventLog.ScheduledTransferPeriod = System.TimeSpan.FromMinutes(1.0);</pre>
      <p>
        <strong>Note</strong>: You must specify a data source to be transferred, see <a href="#step2">Step 2: Configure diagnostics for your application</a>.</p>
    </li>
    <li>
      <p>Start the diagnostic monitor with the changed configuration. The following code example shows how to start the monitor:</p>
      <pre class="prettyprint">DiagnosticMonitor.Start("Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString", config);</pre>
      <p>
        <strong>Note</strong>: This code example shows the use of a connection string. For more information about using connection strings, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee758697.aspx">How to Configure Connection Strings</a>.</p>
    </li>
    <li>
      <p>Save and build the project, and then deploy the application.</p>
    </li>
  </ol>
  <p>After you transfer diagnostic data to storage, you can view the data by using one of several tools that are available.</p>
  <h2>
    <a name="step4">
    </a>Step 4: (Optional) View stored diagnostic data</h2>
  <p>The following tools are some of the many options available to view data in a storage account:</p>
  <ul>
    <li>
      <strong>Server Explorer in Visual Studio</strong> - If you install the Windows Azure Tools for Microsoft Visual Studio 2010, you can use the Windows Azure Storage node in Server Explorer to view read-only blob and table data from your Windows Azure storage accounts. You can display data from your local storage emulator account and also from storage accounts you have created for Windows Azure. For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ff683677.aspx">Browsing Storage Resources with Server Explorer</a>.</li>
    <li>
      <strong>Azure Storage Explorer by Neudesic</strong> - Azure Storage Explorer is a useful graphical user interface tool for inspecting and altering the data in your Windows Azure storage projects including the logs of your Windows Azure applications. To download the tool, see <a href="http://azurestorageexplorer.codeplex.com/" target="_blank">Azure Storage Explorer, Version 4 Beta 1 (October 2010)</a>.</li>
    <li>
      <strong>Azure Diagnostics Manager by Cerebrata</strong> - Azure Diagnostics Manager is a Windows (WPF) based client for managing Windows Azure Diagnostics. It lets you view, download, and manage the diagnostics data collected by the applications running in Windows Azure. To download the tool, see <a href="http://www.cerebrata.com/Products/AzureDiagnosticsManager/Default.aspx" target="_blank">Azure Diagnostics Manager</a>.</li>
  </ul>
  <h2>Additional Resources</h2>
  <p>
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433048.aspx">Collecting Logging Data by Using Windows Azure Diagnostics</a>
  </p>
  <p>
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee405479.aspx">Debugging a Windows Azure Application</a>
  </p>
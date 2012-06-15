<properties linkid="dev-net-commons-tasks-diagnostics" urldisplayname="Diagnostics" headerexpose="" pagetitle="Enable Diagnostics - .NET" metakeywords="Azure diagnostics, Azure monitoring, Azure logs, Azure event logs, Azure logging, Azure crash dumps, Azure diagnostics C#, Azure monitoring C#, Azure logs C#, Azure event logs C#, Azure logging C#, Azure crash dumps C#" footerexpose="" metadescription="Learn how to collect and view diagnostic data from an application running in Windows Azure. You can use diagnostic data for debugging and troubleshooting, measuring performance, monitoring resource usage, traffic analysis and capacity planning, and auditing." umbraconavihide="0" disquscomments="1"></properties>

# Enabling Diagnostics in Windows Azure

Windows Azure Diagnostics enables you to collect diagnostic data from an
application running in Windows Azure. You can use diagnostic data for
debugging and troubleshooting, measuring performance, monitoring
resource usage, traffic analysis and capacity planning, and auditing.

For additional in-depth guidance about using diagnostics and other
techniques to troubleshoot problems and optimize Windows Azure
applications, see [Troubleshooting Best Practices for Developing Windows Azure Applications][].

This task includes the following steps:

-   [Step 1: Import the Diagnostics module][]
-   [Step 2: Configure diagnostics for your application][]
-   [Step 3: (Optional) Permanently store diagnostic data][]
-   [Step 4: (Optional) View stored diagnostic data][]

## <a name="step1"> </a>Step 1: Import the Diagnostics module

The Windows Azure diagnostic monitor runs in Windows Azure and in the
compute emulator to collect diagnostic data for a role instance. You
collect diagnostic data by importing the Diagnostics module into the
service model. If the Diagnostics module has been imported into the
service model for a role, the diagnostic monitor automatically starts
when a role instance starts. Perform the following steps to import the
Diagnostics module.

1.  Open the service definition file (CSDEF) and add the **Import**
    element for the Diagnostics module. The following example shows the
    element added to the definition of a web role:

        <?xml version="1.0" encoding="utf-8"?>
        <ServiceDefinition name="MyHostedService" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition">
          <WebRole name="WebRole1">
            <Imports>
              <Import moduleName="Diagnostics" />
            </Imports>
          </WebRole>
        </ServiceDefinition>

2.  Save the file.

When these steps have been completed, the Diagnostics module has been
imported and you can configure your application to collect diagnostic
data.

## <a name="step2"> </a>Step 2: Configure diagnostics for your application

Only some of the available sources for collecting diagnostic data are
added to the diagnostic monitor by default, you must add others to
collect specific types of diagnostic data. The following table lists the
types of diagnostic data that you can configure your application to
collect.

  ---------------------------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- --------------------------
  **Data source**                                **Description**                                                                                                                                                                          **Role types supported**
  Windows Azure logs                             Collected by default. Logs trace messages sent to the trace listener (added to the web.config or app.config file). For more information, see [DiagnosticMonitorTraceListener Class][].   Web and worker roles
  IIS 7.0 logs                                   Collected by default. Logs information about IIS sites.                                                                                                                                  Web roles only
  Windows Azure Diagnostic infrastructure logs   Collected by default. Logs information about the diagnostic infrastructure, the **RemoteAccess** module, and the **RemoteForwarder** module.                                             Web and worker roles
  [Failed Request logs][]                        Logs information about failed requests to an IIS site or application.                                                                                                                    Web roles only
  [Windows Event logs][]                         Logs events that are typically used for troubleshooting application and driver software.                                                                                                 Web and worker roles
  [Performance counters][]                       Logs information about how well the operating system, application, or driver is performing.                                                                                              Web and worker roles
  [Crash dumps][]                                Logs information about the state of the operating system in the event of a system crash.                                                                                                 Web and worker roles
  [Custom error logs][]                          By using local storage resources, custom data can be logged.                                                                                                                             Web and worker roles
  ---------------------------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- --------------------------

**Note**: If you are creating an application that uses the VM role, you
can use the Windows Azure diagnostics configuration file to configure
the data sources. For more information, see [How to Use the Windows Azure Diagnostics Configuration File][].

### <a name="fail-reqs"> </a>IIS 7.0 Failed Request Trace Logs

You can collect data from the failed request trace logs by defining a
**tracing** element in the configuration file for the web role. Perform
the following steps to initialize the collection of failed request data.

1.  Open the web.config file for the web role.
2.  Add the following code to the **system.webServer** section and
    change the list of providers to reflect the data that you want to
    collect:

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

After you add the configuration information in the web.config, failed
requests are automatically collected; no additional API calls are
required. For more information about configuring failed request tracing,
see [Adding Trace Failed Requests in the IIS 7.0 Configuration Reference][].

### <a name="winlogs"> </a>Windows Event Logs

You can collect event data from the Windows Event logs by calling the
[GetDefaultInitialConfiguration][] method, adding the
[WindowsEventLog][] data source, and then calling the [Start][] method
with the changed configuration. Perform the following steps to
initialize the collection of event data.

1.  Open the source file that contains the entry point for the role.

2.  Ensure that the project references the
    **Microsoft.WindowsAzure.Diagnostics.dll**file and that the
    following **using** statement is added to the file:

        using Microsoft.WindowsAzure.Diagnostics;

    **Note**: The code in the following steps is typically added to the
    **OnStart** method of the role.

3.  Get an instance of the configuration. The following code example
    shows how to get the configuration object:

        var config = DiagnosticMonitor.GetDefaultInitialConfiguration();

4.  Specify the data buffer for collecting event data. For more
    information about the data buffers that can be added, see
    [DiagnosticMonitorConfiguration][]. The following example shows the
    **WindowsEventLog** data buffer being added to the configuration,
    which is defined to collect event data from the System channel:

        config.WindowsEventLog.DataSources.Add("System!*");

    **Note**: Windows Azure Diagnostics cannot be used to read the
    Security channel in the Windows Event logs. An application runs in
    Windows Azure under a restricted Windows service account that does
    not have permissions to read the security channel. If you request
    log information from the Security channel, the diagnostic
    configuration will not work properly until you remove the code that
    makes the request.

5.  Restart the diagnostic monitor with the changed configuration. The
    following code example shows how to restart the monitor:

        DiagnosticMonitor.Start("Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString", config);

    **Note**: This code example shows the use of a connection string.
    For more information about using connection strings, see [How to Configure Connection Strings][].

6.  Save and build the project, and then deploy the application.

### <a name="perf"> </a>Performance Counters

You can configure the collection of performance counter data in a
Windows Azure application. You can also create custom performance
counters in a Windows Azure application by adding the custom category
and one or more custom counters to the definition of your web role or
worker role. For more information about creating and using performance
counters, see ,[Using Performance Counters in Windows Azure][].

### <a name="crash"> </a>Crash Dumps

You collect crash dump data by calling either the [EnableCollection][]
or [EnableCollectionToDirectory][] method from the [CrashDumps][] class.
By default, these methods enable collection of a subset of crash dump
information. You can also specify collection of complete crash dump
information. Perform the following steps to initialize the collection of
crash dump data.

1.  Open the source file for the role.

2.  Ensure that the project references the
    **Microsoft.WindowsAzure.Diagnostics.dll** file and that the
    following using statement is added to the file:

        using Microsoft.WindowsAzure.Diagnostics;

3.  Call the **EnableCollection** method of the **CrashDumps** class
    with the **true** parameter to collect the complete crash dump data:

        Microsoft.WindowsAzure.Diagnostics.CrashDumps.EnableCollection(true);

    **- Or -**

    Add the code to call the **EnableCollection** method of the
    **CrashDumps** class with the **false** parameter to collect the
    partial crash dump data:

        Microsoft.WindowsAzure.Diagnostics.CrashDumps.EnableCollection(false);

4.  Save and build the project, and then deploy the application.

### <a name="custom"> </a>Custom Error Logs

You can collect data in a custom log file. The custom log file is
created in a local storage resource. You create the local storage
resource by using the [LocalResource Class][] and adding the local
storage resource to the configuration of the Windows Azure diagnostic
monitor. Perform the following steps to initialize the collection of
custom log data.

1.  Open the service definition file (CSDEF) using your favorite text
    editor and add the **LocalStorage** element. The following example
    shows the element added to the definition of a web role:

        <?xml version="1.0" encoding="utf-8"?>
        <ServiceDefinition xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" name="MyService">
          <WebRole name="WebRole1">
            <LocalResources>
              <LocalStorage name="MyCustomLogs" sizeInMB="10" cleanOnRoleRecycle="false" />
            </LocalResources>
          </WebRole>
        </ServiceDefinition>

    For more information about local storage resources, see [How to Configure Local Storage Resources][].

2.  Save the file.

3.  Open the source file that contains the entry point for the role.

4.  Ensure that the project references the
    **Microsoft.WindowsAzure.Diagnostics.dll**file and that the
    following **using** statement is added to the file:

        using Microsoft.WindowsAzure.Diagnostics;

    **Note**: The code in the following steps is typically added to the
    **OnStart** method of the role.

5.  Add the following code to initialize the local storage resource
    object:

        LocalResource localResource = RoleEnvironment.GetLocalResource("MyCustomLogs");

6.  Create a [DirectoryConfiguration][] object by using the local
    storage resource object. The following example shows the creation of
    the object:

        DirectoryConfiguration dirConfig = new DirectoryConfiguration();
        dirConfig.Container = "diagnostics-mycustomlogs-container";
        dirConfig.DirectoryQuotaInMB = localResource.MaximumSizeInMegabytes;
        dirConfig.Path = localResource.RootPath;

    For more information about the naming of containers, see [Naming Containers, Blobs, and Metadata][].

7.  Add the **DirectoryConfiguration** object to the configuration of
    the diagnostic monitor. The following example shows the creation of
    an **DiagnosticMonitorConfiguration** object:

        DiagnosticMonitorConfiguration diagMonitorConfig = DiagnosticMonitor.GetDefaultInitialConfiguration();
        diagMonitorConfig.Directories.ScheduledTransferPeriod = TimeSpan.FromMinutes(1.0);
        diagMonitorConfig.Directories.DataSources.Add(dirConfig);

8.  Restart the diagnostic monitor with the new configuration:

        CloudStorageAccount storageAccount = CloudStorageAccount.DevelopmentStorageAccount;
        DiagnosticMonitor diagMonitor = DiagnosticMonitor.Start(storageAccount, diagMonitorConfig);

    The previous code example shows the creation of a
    [CloudStorageAccount][] object by using credentials for the storage
    emulator. To use Windows Azure storage, you can use the following:

        StorageCredentialsAccountAndKey credentials = new StorageCredentialsAccountAndKey(accountName, accountKey);
        CloudStorageAccount storageAccount = new CloudStorageAccount(credentials, true);

    Where **accountName** and **accountKey** are the values that are
    associated with your storage account.

When a file is created in the directory that is specified in the Path
property of the **DirectoryConfiguration** object, it is transferred
automatically as a blob to the container that is defined in the
**Container** property when the scheduled transfer period ends. The file
is not removed from the file system when it is transferred to storage.
The file is removed by the Windows Azure diagnostic monitor based on the
diagnostics quota size that you configure.

After you configure the data sources, your application is ready to
collect diagnostic data. You can now decide whether you want to
permanently store the diagnostic data.

## <a name="step3"> </a>Step 3: (Optional) Permanently store diagnostic data

Diagnostic data is not permanently stored unless you transfer the data
to Windows Azure storage. If you intend to transfer diagnostic data to
Windows Azure storage, you must ensure that the correct account name and
account key are used.

### Specify the storage account

To configure the storage account information, you provide a value for
the **Setting** element in the service configuration file (CSCFG).
Perform the following steps to specify the storage account information.

**Note**: The **Setting** element is automatically added when the
Diagnostics module is imported. The default value is
**UseDevelopmentStorage=true**.

1.  Open the service configuration file using your favorite text editor
    and change the value of the **Setting** element:

        <ConfigurationSettings>
          <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="DefaultEndpointsProtocol=https;AccountName=AccountName;AccountKey=AccountKey"/>
        </ConfigurationSettings>

    Where **AccountName** is the name of the Windows Azure storage
    account, and **AccountKey** is the access key for the storage
    account.

2.  Save the file.

### Schedule the transfer of data

You can change the configuration of the Windows Azure diagnostic monitor
to schedule the transfer of diagnostic data. You transfer data by
assigning a **TimeSpan** to the [ScheduledTransferPeriod][] property of
the data buffer, and then calling the [Start][1] method with the changed
configuration. Perform the following steps to schedule the transfer of
data.

1.  Open the source file for the role.

2.  Ensure that the project references the
    **Microsoft.WindowsAzure.Diagnostics.dll**file and that the
    following using statement is added to the file:

        using Microsoft.WindowsAzure.Diagnostics;

3.  Get an instance of the configuration. The following code example
    shows how to get the configuration object:

        var config = DiagnosticMonitor.GetDefaultInitialConfiguration();

4.  Specify the transfer time period. The following code example shows
    how to schedule a transfer that occurs every minute:

        config.WindowsEventLog.ScheduledTransferPeriod = System.TimeSpan.FromMinutes(1.0);

    **Note**: You must specify a data source to be transferred, see
    [Step 2: Configure diagnostics for your application][].

5.  Start the diagnostic monitor with the changed configuration. The
    following code example shows how to start the monitor:

        DiagnosticMonitor.Start("Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString", config);

    **Note**: This code example shows the use of a connection string.
    For more information about using connection strings, see [How to Configure Connection Strings][].

6.  Save and build the project, and then deploy the application.

After you transfer diagnostic data to storage, you can view the data by
using one of several tools that are available.

## <a name="step4"> </a>Step 4: (Optional) View stored diagnostic data

The following tools are some of the many options available to view data
in a storage account:

-   **Server Explorer in Visual Studio** - If you install the Windows
    Azure Tools for Microsoft Visual Studio 2010, you can use the
    Windows Azure Storage node in Server Explorer to view read-only blob
    and table data from your Windows Azure storage accounts. You can
    display data from your local storage emulator account and also from
    storage accounts you have created for Windows Azure. For more
    information, see [Browsing Storage Resources with Server Explorer][].
-   **Azure Storage Explorer by Neudesic** - Azure Storage Explorer is a
    useful graphical user interface tool for inspecting and altering the
    data in your Windows Azure storage projects including the logs of
    your Windows Azure applications. To download the tool, see [Azure Storage Explorer, Version 4 Beta 1 (October 2010)][].
-   **Azure Diagnostics Manager by Cerebrata** - Azure Diagnostics
    Manager is a Windows (WPF) based client for managing Windows Azure
    Diagnostics. It lets you view, download, and manage the diagnostics
    data collected by the applications running in Windows Azure. To
    download the tool, see [Azure Diagnostics Manager][].

## Additional Resources

- [Collecting Logging Data by Using Windows Azure Diagnostics][]
- [Debugging a Windows Azure Application][]

  [Troubleshooting Best Practices for Developing Windows Azure Applications]: http://msdn.microsoft.com/en-us/library/windowsazure/hh771389.aspx
  [Step 1: Import the Diagnostics module]: #step1
  [Step 2: Configure diagnostics for your application]: #step2
  [Step 3: (Optional) Permanently store diagnostic data]: #step3
  [Step 4: (Optional) View stored diagnostic data]: #step4
  [DiagnosticMonitorTraceListener Class]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitortracelistener.aspx
  [Failed Request logs]: #fail-reqs
  [Windows Event logs]: #winlogs
  [Performance counters]: #perf
  [Crash dumps]: #crash
  [Custom error logs]: #custom
  [How to Use the Windows Azure Diagnostics Configuration File]: http://msdn.microsoft.com/en-us/library/windowsazure/hh411551.aspx
  [Adding Trace Failed Requests in the IIS 7.0 Configuration Reference]:
    http://www.iis.net/ConfigReference/system.webServer/tracing/traceFailedRequests/add
  [GetDefaultInitialConfiguration]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitor.getdefaultinitialconfiguration.aspx
  [WindowsEventLog]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitorconfiguration.windowseventlog.aspx
  [Start]: http://msdn.microsoft.com/en-us/library/windowsazure/ee772717.aspx
  [DiagnosticMonitorConfiguration]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitorconfiguration.aspx
  [How to Configure Connection Strings]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758697.aspx
  [Using Performance Counters in Windows Azure]: /en-us/develop/net/common-tasks/performance-profiling/
  [EnableCollection]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.crashdumps.enablecollection.aspx
  [EnableCollectionToDirectory]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.crashdumps.enablecollectiontodirectory.aspx
  [CrashDumps]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.crashdumps.aspx
  [LocalResource Class]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.serviceruntime.localresource.aspx
  [How to Configure Local Storage Resources]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758708.aspx
  [DirectoryConfiguration]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.directoryconfiguration.aspx
  [Naming Containers, Blobs, and Metadata]: http://msdn.microsoft.com/en-us/library/windowsazure/dd135715.aspx
  [CloudStorageAccount]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.cloudstorageaccount.aspx
  [ScheduledTransferPeriod]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticdatabufferconfiguration.scheduledtransferperiod.aspx
  [1]: http://msdn.microsoft.com/en-us/library/windowsazure/ee772721.aspx
  [Browsing Storage Resources with Server Explorer]: http://msdn.microsoft.com/en-us/library/windowsazure/ff683677.aspx
  [Azure Storage Explorer, Version 4 Beta 1 (October 2010)]: http://azurestorageexplorer.codeplex.com/
  [Azure Diagnostics Manager]: http://www.cerebrata.com/Products/AzureDiagnosticsManager/Default.aspx
  [Collecting Logging Data by Using Windows Azure Diagnostics]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433048.aspx
  [Debugging a Windows Azure Application]: http://msdn.microsoft.com/en-us/library/windowsazure/ee405479.aspx

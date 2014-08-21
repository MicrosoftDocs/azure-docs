<properties linkid="dev-net-commons-tasks-diagnostics" urlDisplayName="Diagnostics" pageTitle="How to use diagnostics (.NET) - Azure feature guide" metaKeywords="Azure diagnostics monitoring,logs crash dumps C#" description="Learn how to use diagnostic data in Azure for debugging, measuring performance, monitoring, traffic analysis, and more." metaCanonical="" services="cloud-services" documentationCenter=".NET" title="Enabling Diagnostics in Azure" authors="ryanwi" solutions="" manager="" editor="" />

<tags ms.service="cloud-services" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="01/01/1900" ms.author="ryanwi" />






# Enabling Diagnostics in Azure Cloud Services

Azure Diagnostics enables you to collect diagnostic data from a worker role or web role running in Azure. You can use diagnostic data for debugging and troubleshooting, measuring performance, monitoring resource usage, traffic analysis and capacity planning, and auditing.

You can configure Diagnostics before deployment or at run-time within Visual Studio 2012 or Visual Studio 2013 using the Azure SDK 2.0 or later.  For more information, see [Configuring Azure Diagnostics][]. 

For additional in-depth guidance on creating a logging and tracing strategy and using diagnostics and other techniques to troubleshoot problems, see [Troubleshooting Best Practices for Developing Azure Applications][].

For information on manually configuring Diagnostics in your application or remotely changing the Diagnostics monitor configuration, see [Collect Logging Data by Using Azure Diagnostics][].

<h2>Next steps</h2>

-	[Remotely Change the Diagnostic Monitor Configuration][] - Once you've deployed your application you can modify the Diagnostics configuration.
-	[How to monitor cloud services] [] - You can monitor key performance metrics for your cloud services in the [Azure Management Portal][].

<h2>Additional resources</h2> 

- [Collect Logging Data by Using Azure Diagnostics][]
- [Debugging an Azure Application][]
- [Configuring Azure Diagnostics][]

  [Troubleshooting Best Practices for Developing Azure Applications]: http://msdn.microsoft.com/en-us/library/windowsazure/hh771389.aspx
  

  [Using performance counters in Azure]: ../cloud-services-performance-testing-visual-studio-profiler/
  [How to monitor cloud services]: ../cloud-services-how-to-monitor/
  [DiagnosticMonitorTraceListener Class]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.diagnosticmonitortracelistener.aspx
  [How to Use the Azure Diagnostics Configuration File]: http://msdn.microsoft.com/en-us/library/windowsazure/hh411551.aspx
  [Adding Trace Failed Requests in the IIS 7.0 Configuration Reference]: http://www.iis.net/ConfigReference/system.webServer/tracing/traceFailedRequests/add
  [Using performance counters in Azure]: /en-us/develop/net/common-tasks/performance-profiling/
  [How to Configure Local Storage Resources]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758708.aspx
  [Browsing Storage Resources with Server Explorer]: http://msdn.microsoft.com/en-us/library/windowsazure/ff683677.aspx
  [Azure Storage Explorer]: http://azurestorageexplorer.codeplex.com/
  [Azure Diagnostics Manager]: http://www.cerebrata.com/Products/AzureDiagnosticsManager/Default.aspx
  [Collect Logging Data by Using Azure Diagnostics]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433048.aspx
  [Debugging an Azure Application]: http://msdn.microsoft.com/en-us/library/windowsazure/ee405479.aspx
  [Use the Azure Diagnostics Configuration File]: http://msdn.microsoft.com/en-us/library/windowsazure/hh411551.aspx
  [LogLevel Enumeration]: http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.diagnostics.loglevel.aspx
  [OnStart method]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.serviceruntime.roleentrypoint.onstart.aspx
  [Azure Diagnostics Configuration Schema]: http://msdn.microsoft.com/en-us/library/gg593185.aspx
  [How to use the Table Storage Service]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/table-services/
  [How to use the Azure Blob Storage Service]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/blob-storage/
  [Azure Management Portal]: http://manage.windowsazure.com
  [Remotely Change the Diagnostic Monitor Configuration]: http://msdn.microsoft.com/en-us/library/windowsazure/gg432992.aspx
  [Configuring Azure Diagnostics]: http://msdn.microsoft.com/en-us/library/windowsazure/dn186185.aspx  
   

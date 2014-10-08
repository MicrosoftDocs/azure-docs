<properties urlDisplayName="Performance Profiling" pageTitle="Use Performance Counters in Azure (.NET)" metaKeywords="Azure performance counters, Azure performance profiling, Azure performance counters C#, Azure performance profiling C#" description="Learn how to enable and collect data from performance counters in Azure applications. " metaCanonical="" services="cloud-services" documentationCenter=".NET" title="Using performance counters in Azure" authors="ryanwi" solutions="" manager="timlt" editor="" />

<tags ms.service="cloud-services" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="01/01/1900" ms.author="ryanwi" />





# Using performance counters in Azure

You can use performance counters in an Azure application to
collect data that can help determine system bottlenecks and fine-tune
system and application performance. Performance counters available for Windows Server 2008, Windows Server 2012, IIS and ASP.NET can be collected and used to determine the health of your Azure application. 

You can configure performance counters before deployment or at run-time within Visual Studio 2012 or Visual Studio 2013 using the Azure SDK 2.0 or later.  For more information, see [Configuring Azure Diagnostics][]. For information on manually configuring performance counters in your application, see [How to Configure Performance Counters][].

For additional in-depth guidance on creating a logging and tracing strategy and using diagnostics and other techniques to troubleshoot problems, see [Troubleshooting Best Practices for Developing Azure Applications][].



## <a name="nextsteps"> </a>Next Steps

Follow these links to learn how to implement more complex troubleshooting scenarios.

- [Testing the Performance of a Cloud Service][]
- [Troubleshooting Best Practices for Developing Azure Applications][]
- [How to Monitor Cloud Services][]
- [How to Use the Autoscaling Application Block][]
- [Building Elastic and Resilient Cloud Apps][]

## <a name="additional"> </a>Additional Resources

- [Enabling Diagnostics in Azure][]
- [Collecting Logging Data by Using Azure Diagnostics][]
- [Debugging an Azure Application][]


  
  [Next Steps]: #nextsteps
  [Additional Resources]: #additional    
   
  
  [Azure Management Portal]: http://manage.windowsazure.com
  [Azure Diagnostics Manager]: http://www.cerebrata.com/Products/AzureDiagnosticsManager/Default.aspx
  [How to Monitor Cloud Services]: http://azure.microsoft.com/en-us/documentation/articles/cloud-services-how-to-monitor/

  [Configuring Azure Diagnostics]: http://msdn.microsoft.com/en-us/library/windowsazure/dn186185.aspx 
  [Troubleshooting Best Practices for Developing Azure Applications]: http://msdn.microsoft.com/en-us/library/windowsazure/hh771389.aspx
  [How to Configure Performance Counters]: http://msdn.microsoft.com/en-us/library/azure/dn535595.aspx
  [Building Elastic and Resilient Cloud Apps]: http://msdn.microsoft.com/en-us/library/hh680949(PandP.50).aspx
  [Collecting Logging Data by Using Azure Diagnostics]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433048.aspx
  [Debugging an Azure Application]: http://msdn.microsoft.com/en-us/library/windowsazure/ee405479.aspx
  [How to Use the Autoscaling Application Block]: http://azure.microsoft.com/en-us/documentation/articles/cloud-services-dotnet-autoscaling-application-block/
  [Enabling Diagnostics in Azure]: http://azure.microsoft.com/en-us/documentation/articles/cloud-services-dotnet-diagnostics/
  [Testing the Performance of a Cloud Service]: http://msdn.microsoft.com/en-us/library/azure/hh369930.aspx
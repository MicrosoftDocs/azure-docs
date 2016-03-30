<properties 
   pageTitle="Streaming Azure diagnostics data in the hot path using Event Hubs"
   description="Illustrates how to configure Azure diagnostics with Event Hubs from end to end, including guidance for common scenarios."
   services="event-hubs"
   documentationCenter="na"
   authors="tomarcher"
   manager="douge"
   editor="" />
<tags 
   ms.service="event-hubs"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="03/30/2016"
   ms.author="tarcher" />

# Streaming Azure diagnostics data in the hot path using Event Hubs

## Overview
Azure diagnostics provides flexible ways to collect metrics and logs from compute VMs, and transfer to Azure Storage.  Starting in March 2016 (SDK 2.9) time frame, there is now the ability to sink Azure diagnostics to completely custom data sources and transfer hot path data in seconds using Azure Event Hubs.  

Supported data types include:

- ETW events
- Performance Counters
- Windows Event Logs 
- Application Logs
- Azure diagnostics infrastructure logs
 
This article will show you how to configure Azure diagnostics with Event Hubs from end to end.  Guidance is also provided for common scenarios such as customizing which logs and metrics get sinked to Event Hubs, how to change configuration in each environment, one example of many how you can view Event Hubs stream data, and how to troubleshoot the connection.    

## Prerequisites
Event Hubs sinking in Azure diagnostics is supported in all compute types - Cloud Service, VM, VMSS, and Servic Fabric - that support WAD, starting in the Azure SDK 2.9 and corresponding Azure Tools for Visual Studio.
  
- Azure Diagnostics extension 1.6 ([Azure SDK for .NET 2.9 or higher](https://azure.microsoft.com/downloads/) targets this by default)
- [Visual Studio 2013 or higher](https://www.visualstudio.com/downloads/download-visual-studio-vs.aspx)
- Prior successful configuration of Azure diagnostics configuration in the application using a *.wadcfgx* file using one of the following methods:
	- Visual Studio: [Configuring Diagnostics for Azure Cloud Services and Virtual Machines](../vs-azure-tools-diagnostics-for-cloud-services-and-virtual-machines.md)
	- Windows PowerShell: [Enable diagnostics in Azure Cloud Services using PowerShell](../cloud-services/cloud-services-diagnostics-powershell.md)
- Event Hubs namespace provisioned per the article, [Get started with Event Hubs](./event-hubs-csharp-ephcs-getstarted.md)

## Connecting Azure diagnostics to the Event Hubs sink
Azure diagnostics always sinks logs and metrics, by default, to an Azure Storage account.  An application may additionally sink to Event Hubs by adding a new **Sinks** section to the **WadCfg** element in the **PublicConfig** section of the *.wadcfgx* file.  In Visual Studio, the *.wadcfgx* file is stored in the *Cloud Service Project > Roles >  (RoleName) > diagnostics.wadcfgx* file.
  
	  <SinksConfig>
	    <Sink name="HotPath">
	      <EventHub Url="https://diags-mycompany-ns.servicebus.windows.net/diageventhub" SharedAccessKeyName="SendRule" />
	    </Sink>
	  </SinksConfig>

In this example, the event hub URL is set to the fully qualified namespace of the event hub (ServiceBus namespace  + “/” + event hub name).  

The event hub URL is displayed in the [classic Azure portal](https://manage.windowsazure.com) on the Event Hubs dashboard.  

The **Sink** name can be set to any valid string as long as the same value is used consistently throughout the config file. 

**Note:** There may be additional sinks configured in this section such as "applicationInsights".  Azure diagnostics allows one or more sinks to be defined, provided that each sink is also declared in the **PrivateConfig** section.  

The Event Hubs sink must also be declared and defined in the **PrivateConfig** section of the *.wadcfgx* config file.

	  <PrivateConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
	    <StorageAccount name="" key="" endpoint="" />
	    <EventHub Url="https://diags-mycompany-ns.servicebus.windows.net/diageventhub" SharedAccessKeyName="SendRule" SharedAccessKey="9B3SwghJOGEUvXigc6zHPInl2iYxrgsKHZoy4nm9CUI=" />
	  </PrivateConfig>

The **SharedAccessKeyName** must match a SAS key and policy that has been defined in the **ServiceBus/EventHub** namespace.  This can be done by browsing to the event hub dashboard in the [classic Azure portal](https://manage.windowsazure.com), clicking on the **Configure** tab, and setting up a named policy (e.g. “SendRule”) that has *Send* permissions.  The **StorageAccount** is also declared in the **PrivateConfig**.  There is no need to change values here especially if they are working.  In this example we leave the values empty, which is a sign that a downstream asset will set the values; e.g. the *ServiceConfiguration.Cloud.cscfg* environment config file will set the environment appropriate names and keys.  

>[AZURE.WARNING] Be aware that the event hub SAS key is stored in plain text in the *.wadcfgx* file.  Oftentimes this is checked in to source code control or as an asset in your build server, so you should protect as appropriate.  It is recommended to use a SAS key here with *Send only* permissions so that any malicious user could - at most - only write to the event hub, but never listen to, or manage it. 

## Configuring Azure diagnostics logs and metrics to sink with Event Hubs
As discussed earlier, all default and custom diagnostics data (i.e., metrics and logs) is automatically sinked to Azure Storage in the configured intervals.  With Event Hubs (and any additional sink), you have the option to specify any root or leaf node in the hierarchy to be sinked with the event hub.  This includes ETW events, Performance Counters, Windows Event Logs and Application Logs.   

It is important to consider how many data points should actually be transferred to Event Hubs.  Typically developers use this for low-latency hot path data that must be consumed and interpreted quickly (e.g. by monitoring alerting systems or AutoScale rules).  It may also be used to configure an alternate analysis or search store - for example, Stream Analytics, ElasticSearch, a custom monitoring system, or your favorite 3rd party monitoring system. 

The following are some example configurations.

        <PerformanceCounters scheduledTransferPeriod="PT1M" sinks="HotPath">
          <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\ISAPI Extension Requests/sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\Bytes Total/Sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Requests/Sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Errors Total/Sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Queued" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Rejected" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT3M" />
        </PerformanceCounters>

In the following example, the sink is applied to the parent **PerformanceCounters** node in the hierarchy, which means all child **PerformanceCounters** will be sent to Event Hubs.  

        <PerformanceCounters scheduledTransferPeriod="PT1M">
          <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\ISAPI Extension Requests/sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\Bytes Total/Sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Requests/Sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Errors Total/Sec" sampleRate="PT3M" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Queued" sampleRate="PT3M" sinks="HotPath" />
          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Rejected" sampleRate="PT3M" sinks="HotPath"/>
          <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT3M" sinks="HotPath"/>
        </PerformanceCounters>

In example listed above, the sink is applied to only three counters: Requests Queued, Requests Rejected and % Processor time.  

The following example shows how a developer can take control and limit the amount of data sent to be the critical metrics used for this service’s health.  

        <Logs scheduledTransferPeriod="PT1M" sinks="HotPath" scheduledTransferLogLevelFilter="Error" />

In this example, the sink is applied to logs and is filtered only to Error level trace.
 
## Deploying and Updating a Cloud Service application & diagnostics config

The easiest path to deploying the application along with Event Hubs sink configuration is using Visual Studio.  To view and make desired edits, open the *.wadcfgx* file in Visual Studio, which is stored in the *Cloud Service Project -> Roles -> (RoleName) -> diagnostics.wadcfgx* file, and save when complete.  

At this point, all deployment and deployment update actions in Visual Studio, Visual Studio Team System, or MSBUILD-based commands or scripts (using /t:publish target), will include the *.wadcfgx* in the packaging process and ensure that it is deployed to Azure using the appropriate WAD agent extension sitting with your VMs.
  
Upon successful deployment of the application and Azure diagnostics configuration, you will immediately see activity in the dashboard of the event hub.  This is an indication you’re ready to move on to viewing the hot path data in the listener client or analysis tool of your choice.  
 
In the following figure, the event hub dashboard shows healthy sending of diagnostics data to the event hub starting sometime after 11 PM, when the application was deployed with an updated *.wadcfgx* and the sink configured properly.

![][0]  
  
>[AZURE.NOTE] When you make updates to the Azure diagnostics config file (.wadcfgx), it is recommended to push the updates to the entire application plus the config using either Visual Studio publish or Windows PowerShell script.  

## Viewing hot path data

As discussed earlier, there are many use-cases for listening to and processing Event Hubs data.
  
One simple approach is to create a small test console application to listen to the event hub and print the output stream.  The following code (that is explained in more detail
in the article, [Get started with Event Hubs](./event-hubs-csharp-ephcs-getstarted.md)) may be placed in a console application.  

Note that the console application must include the [EventProcessor Nuget package](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost/).  

Remember to replace the the values in angle brackets in the **Main** function below with values for your resources.   

	//Console application code for EventHub test client
	using System;
	using System.Collections.Generic;
	using System.Diagnostics;
	using System.Linq;
	using System.Text;
	using System.Threading.Tasks;
	using Microsoft.ServiceBus.Messaging;
	
	namespace EventHubListener
	{
	    class SimpleEventProcessor : IEventProcessor
	    {
	        Stopwatch checkpointStopWatch;
	
	        async Task IEventProcessor.CloseAsync(PartitionContext context, CloseReason reason)
	        {
	            Console.WriteLine("Processor Shutting Down. Partition '{0}', Reason: '{1}'.", context.Lease.PartitionId, reason);
	            if (reason == CloseReason.Shutdown)
	            {
	                await context.CheckpointAsync();
	            }
	        }
	
	        Task IEventProcessor.OpenAsync(PartitionContext context)
	        {
	            Console.WriteLine("SimpleEventProcessor initialized.  Partition: '{0}', Offset: '{1}'", context.Lease.PartitionId, context.Lease.Offset);
	            this.checkpointStopWatch = new Stopwatch();
	            this.checkpointStopWatch.Start();
	            return Task.FromResult<object>(null);
	        }
	
	        async Task IEventProcessor.ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
	        {
	            foreach (EventData eventData in messages)
	            {
	                string data = Encoding.UTF8.GetString(eventData.GetBytes());
	
	                Console.WriteLine(string.Format("Message received.  Partition: '{0}', Data: '{1}'",
	                    context.Lease.PartitionId, data));
	
	                foreach (var x in eventData.Properties)
	                {
	                    Console.WriteLine(string.Format("    {0} = {1}", x.Key, x.Value));
	                }
	            }
	
	            //Call checkpoint every 5 minutes, so that worker can resume processing from 5 minutes back if it restarts.
	            if (this.checkpointStopWatch.Elapsed > TimeSpan.FromMinutes(5))
	            {
	                await context.CheckpointAsync();
	                this.checkpointStopWatch.Restart();
	            }
	        }
	    }
	
	    class Program
	    {
	        static void Main(string[] args)
	        {
	            string eventHubConnectionString = "Endpoint= <Your Connection String>”
	            string eventHubName = "<EventHub Name>";
	            string storageAccountName = "<Storage Account Name>";
	            string storageAccountKey = "<Storage Account Key>”;
	            string storageConnectionString = string.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}", storageAccountName, storageAccountKey);
	
	            string eventProcessorHostName = Guid.NewGuid().ToString();
	            EventProcessorHost eventProcessorHost = new EventProcessorHost(eventProcessorHostName, eventHubName, EventHubConsumerGroup.DefaultGroupName, eventHubConnectionString, storageConnectionString);
	            Console.WriteLine("Registering EventProcessor...");
	            var options = new EventProcessorOptions();
	            options.ExceptionReceived += (sender, e) => { Console.WriteLine(e.Exception); };
	            eventProcessorHost.RegisterEventProcessorAsync<SimpleEventProcessor>(options).Wait();
	
	            Console.WriteLine("Receiving. Press enter key to stop worker.");
	            Console.ReadLine();
	            eventProcessorHost.UnregisterEventProcessorAsync().Wait();
	        }
	    }
	}

## Troubleshooting the Event Hubs sink

- The event hub does not show incoming or outgoing event activity as expected

	Check that your event hub is successfully provisioned.  All connection info in the **PrivateConfig** section of *.wadcfgx* must match the values of your resource as seen in the portal.  Ensure you have a SAS policy defined (“SendRule” in the example) in the portal and that Send permission is granted.  

- After performing an update, the event hub no longer shows incoming or outgoing event activity

	First, ensure the event hub and configuration info all matches per above.  Some issues are caused by the **PrivateConfig** being reset in a deployment update.  The recommended fix is to make all changes to *.wadcfgx* in the project, and then push a complete application update.  If this is not possible, ensure that the diagnostics update pushes a complete **PrivateConfig** including the SAS key.  

- I tried the above, and event hub is still not working

	Try looking in the Azure Storage table that contains logs and errors for Azure diagnostics itself: **WADDiagnosticInfrastructureLogsTable**.  One option is to use a tool such as [Azure Storage Explorer](http://www.storageexplorer.com) to connect to this storage account, view this table, and add a Query for TimeStamp in the last 24 hours.  You can use the tool to export the CSV, and open it in an application such as Microsoft Excel, as Excel makes it easy to search for calling-card strings like "EventHubs" to see what error is reported.  

## Next steps
•	[Learn more about Event Hubs](https://azure.microsoft.com/services/event-hubs/) 

## Appendix: Complete Azure diagnostics configuration file (.wadcfgx) example
	<?xml version="1.0" encoding="utf-8"?>
	<DiagnosticsConfiguration xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
	  <PublicConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
	    <WadCfg>
	      <DiagnosticMonitorConfiguration overallQuotaInMB="4096" sinks="applicationInsights.errors">
	        <DiagnosticInfrastructureLogs scheduledTransferLogLevelFilter="Error" />
	        <Directories scheduledTransferPeriod="PT1M">
	          <IISLogs containerName="wad-iis-logfiles" />
	          <FailedRequestLogs containerName="wad-failedrequestlogs" />
	        </Directories>
	        <PerformanceCounters scheduledTransferPeriod="PT1M" sinks="HotPath">
	          <PerformanceCounterConfiguration counterSpecifier="\Memory\Available MBytes" sampleRate="PT3M" />
	          <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\ISAPI Extension Requests/sec" sampleRate="PT3M" />
	          <PerformanceCounterConfiguration counterSpecifier="\Web Service(_Total)\Bytes Total/Sec" sampleRate="PT3M" />
	          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Requests/Sec" sampleRate="PT3M" />
	          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET Applications(__Total__)\Errors Total/Sec" sampleRate="PT3M" />
	          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Queued" sampleRate="PT3M" />
	          <PerformanceCounterConfiguration counterSpecifier="\ASP.NET\Requests Rejected" sampleRate="PT3M" />
	          <PerformanceCounterConfiguration counterSpecifier="\Processor(_Total)\% Processor Time" sampleRate="PT3M" />
	        </PerformanceCounters>
	        <WindowsEventLog scheduledTransferPeriod="PT1M">
	          <DataSource name="Application!*" />
	        </WindowsEventLog>
	        <CrashDumps>
	          <CrashDumpConfiguration processName="WaIISHost.exe" />
	          <CrashDumpConfiguration processName="WaWorkerHost.exe" />
	          <CrashDumpConfiguration processName="w3wp.exe" />
	        </CrashDumps>
	        <Logs scheduledTransferPeriod="PT1M" sinks="HotPath" scheduledTransferLogLevelFilter="Error" />
	      </DiagnosticMonitorConfiguration>
	      <SinksConfig>
	        <Sink name="HotPath">
	          <EventHub Url="https://diageventhub-py-ns.servicebus.windows.net/diageventhub-py" SharedAccessKeyName="SendRule" />
	        </Sink>
	        <Sink name="applicationInsights">
	          <ApplicationInsights />
	          <Channels>
	            <Channel logLevel="Error" name="errors" />
	          </Channels>
	        </Sink>
	      </SinksConfig>
	    </WadCfg>
	    <StorageAccount />
	  </PublicConfig>
	  <PrivateConfig xmlns="http://schemas.microsoft.com/ServiceHosting/2010/10/DiagnosticsConfiguration">
	    <StorageAccount name="" key="" endpoint="" />
	    <EventHub Url="https://diageventhub-py-ns.servicebus.windows.net/diageventhub-py" SharedAccessKeyName="SendRule" SharedAccessKey="YOUR_KEY_HERE" />
	  </PrivateConfig>
	  <IsEnabled>true</IsEnabled>
	</DiagnosticsConfiguration>

The complementary *ServiceConfiguration.Cloud.cscfg* for this example looks like the following.

	<?xml version="1.0" encoding="utf-8"?>
	<ServiceConfiguration serviceName="MyFixItCloudService" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceConfiguration" osFamily="3" osVersion="*" schemaVersion="2015-04.2.6">
	  <Role name="MyFixIt.WorkerRole">
	    <Instances count="1" />
	    <ConfigurationSettings>
	      <Setting name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" value="YOUR_CONNECTION_STRING" />
	    </ConfigurationSettings>
	  </Role>
	</ServiceConfiguration>

<!-- Images. -->
[0]: ./media/event-hubs-streaming-azure-diags-data/dashboard.png

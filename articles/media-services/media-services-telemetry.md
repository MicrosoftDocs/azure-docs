<properties pageTitle="Azure Media Services Telemetry with .NET | Microsoft Azure" 
	description="This article shows you how to use the Azure Media Services telemetry." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="07/27/2016"   
	ms.author="juliako"/>

# Azure Media Services Telemetry with .NET
 
## Overview

Media Services telemetry/monitoring allows Media Services customers to access metrics data for its services. The current version supports telemetry data for "Channel" and "StreamingEndpoint" entities. You can configure telemetry on a component level granularity. There are two detail levels "Normal" and "Verbose". The current version only supports "Normal".

Telemetry is written to a storage table in an Azure Storage account provided by the customer (the storage account must be attached to the Media Services account). Telemetry system will create a separate table for each new day based at 00:00 UTC. As an example "TelemetryMetrics20160321" where "20160321" is date of table created. For each day there will be a separate table.

Note that the telemetry system does not manage data retention. You can remove the old telemetry data by deleting the storage tables.

You can consume telemetry data in one of the following ways:

- Read data directly from Azure Table Storage (e.g. using the Storage SDK). For the description of telemetry storage tables, see the **Consuming telemetry information** in [this](https://msdn.microsoft.com/library/mt742089.aspx) topic.

Or

- Use the support in the Media Services .NET SDK for reading storage data. This topic shows how to enable telemetry for the specified AMS account and how to query the metrics using the Azure Media Services .NET SDK.  

## Configuring telemetry for a Media Services account

The following steps are needed to enable telemetry:

- Get the credentials of the storage account attached to the Media Services account. 
- Create a Notification Endpoint with **EndPointType** set to **AzureTable** and endPointAddress pointing to the storage table.

	    INotificationEndPoint notificationEndPoint = 
	                  _context.NotificationEndPoints.Create("monitoring", 
	                  NotificationEndPointType.AzureTable,
	                  "https://" + _mediaServicesStorageAccountName + ".table.core.windows.net/");

- Create a monitoring configuration settings for the services you want to monitor. No more than one monitoring configuration settings is allowed. 
  
        IMonitoringConfiguration monitoringConfiguration = _context.MonitoringConfigurations.Create(notificationEndPoint.Id,
            new List<ComponentMonitoringSetting>()
            {
                new ComponentMonitoringSetting(MonitoringComponent.Channel, MonitoringLevel.Normal),
                new ComponentMonitoringSetting(MonitoringComponent.StreamingEndpoint, MonitoringLevel.Normal)
            });

## Consuming telemetry information

Telemetry is written to an Azure Storage Table in the storage account specified when configuring telemetry for the Media Services account. Telemetry system will create a separate table for each new day based at 00:00 UTC. As an example "TelemetryMetrics20160321" where "20160321" is date of table created. For each day there will be separate table.

You can query telemetry tables for the following metrics information. The example, shown later in this topic, demonstrates how to use the Media Services .NET SDK to query metrics. 

### StreamingEndpoint log

You can query for the following StreamingEndPoint metrics. 

Property|Description|Sample value
---|---|---
**PartitionKey**|Gets the partition key of the record.|60b71b0f6a0e4d869eb0645c16d708e1_6efed125eef44fb5b61916edc80e6e23
**RowKey**|Gets the row key of the record.|00959_00000
**AccountId**|Gets the Media Services account ID.|6efed125-eef4-4fb5-b619-16edc80e6e23
**StreamingEndpointId**|Gets the Media Services Streaming Endpoint ID.|d17ec9e4-a5d4-033d-0c36-def70229f06f
**ObservedTime**|Gets the observed time of the metric.|1/20/16 23:44:01
**HostName**|Gets the Streaming Endpoint host name.|builddemoserver.origin.mediaservices.windows.net
**StatusCode**|Gets the status code.|200
**ResultCode**|Gets the result code.|S_OK
**RequestCount**|Gets the request count.|3
**BytesSent**|Gets the bytes sent.|2987358
**ServerLatency**|Gets the server latency (including storage).|129
**EndToEndLatency**|Gets the end to end request time.|250


### Live channel heartbeat

You can query for the following live channel metrics. 

Property|Description|Sample value
---|---|---
**PartitionKey**|Gets the partition key of the record.|60b71b0f6a0e4d869eb0645c16d708e1_0625cc45918e4f98acfc9a33e8066628
**RowKey**|Gets the row key of the record.|13872_00005
**AccountId**|Gets the Media Services account ID.|6efed125-eef4-4fb5-b619-16edc80e6e23
**ChannelId**|Gets the Media Services channel ID.|
**ObservedTime**|Gets the observed time of the metric.|1/21/2016 20:08:49
**CustomAttributes**|Gets the custom attributes.|
**TrackType**|Gets the track type.|video
**TrackName**|Gets the track name.|video
**Bitrate**|Gets the bitrate.|785000
**IncomingBitrate**|Gets the incoming bitrate.|784548
**OverlapCount**|Gets the overlap count.|0
**DiscontinuityCount**|Gets the discontinuity count.|0
**LastTimestamp**|Gets the last time stamp.|1800488800
 
## Example  
	
The following example shows how to enable telemetry for the specified AMS account and how to query the metrics using the Azure Media Services .NET SDK.  	

	using System;
	using System.Collections.Generic;
	using System.Configuration;
	using System.Linq;
	using Microsoft.WindowsAzure.MediaServices.Client;
	
	namespace AMSMetrics
	{
	    class Program
	    {
	        // Read values from the App.config file.
	        private static readonly string _mediaServicesAccountName =
	            ConfigurationManager.AppSettings["MediaServicesAccountName"];
	        private static readonly string _mediaServicesAccountKey =
	            ConfigurationManager.AppSettings["MediaServicesAccountKey"];
	        private static readonly string _mediaServicesAccountID =
	            ConfigurationManager.AppSettings["MediaServicesAccountID"];
	        private static readonly string _streamingEndpointID =
	            ConfigurationManager.AppSettings["StreamingEndpointID"];
	        private static readonly string _mediaServicesStorageAccountName =
	            ConfigurationManager.AppSettings["StorageAccountName"];
	        private static readonly string _mediaServicesStorageAccountKey =
	            ConfigurationManager.AppSettings["StorageAccountKey"];
	
	        // Field for service context.
	        private static CloudMediaContext _context = null;
	        private static MediaServicesCredentials _cachedCredentials = null;
	
	        static void Main(string[] args)
	        {
	            // Create and cache the Media Services credentials in a static class variable.
	            _cachedCredentials = new MediaServicesCredentials(
	                            _mediaServicesAccountName,
	                            _mediaServicesAccountKey);
	            // Used the cached credentials to create CloudMediaContext.
	            _context = new CloudMediaContext(_cachedCredentials);
	

	
	            var monitoringConfigurations = _context.MonitoringConfigurations;
	            IMonitoringConfiguration monitoringConfiguration = null;
	
	            // No more than one monitoring configuration settings is allowed.
	            if (monitoringConfigurations.ToArray().Length != 0)
	            {
	                monitoringConfiguration = _context.MonitoringConfigurations.FirstOrDefault();
	            }
	            else
	            {
		            INotificationEndPoint notificationEndPoint = 
		                          _context.NotificationEndPoints.Create("monitoring", 
								  NotificationEndPointType.AzureTable, GetTableEndPoint());

	                monitoringConfiguration = _context.MonitoringConfigurations.Create(notificationEndPoint.Id,
	                    new List<ComponentMonitoringSetting>()
	                    {
	                        new ComponentMonitoringSetting(MonitoringComponent.StreamingEndpoint, MonitoringLevel.Normal)
	                    });
	            }
	
	            //Print metrics for a Streaming Endpoint.
	            PrintStreamingEndpointMetrics();
	
	            Console.ReadLine();
	        }
	
	        private static string GetTableEndPoint()
	        {
	            return "https://" + _mediaServicesStorageAccountName + ".table.core.windows.net/";
	        }
	
	        private static void PrintStreamingEndpointMetrics()
	        {
	            var end = DateTime.UtcNow;
	            var start = DateTime.UtcNow.AddHours(-5);
	
	            // Get some streaming endpoint metrics.
	            var res = _context.StreamingEndPointRequestLogs.GetStreamingEndPointMetrics(
	                    GetTableEndPoint(),
	                    _mediaServicesStorageAccountKey,
	                    _mediaServicesAccountID,
	                    _streamingEndpointID,
	                    start,
	                    end);
	
	
	            Console.Title = "Streaming endpoint metrics:";
	
	            foreach (var log in res)
	            {
	                Console.WriteLine("AccountId: {0}", log.AccountId);
	                Console.WriteLine("BytesSent: {0}", log.BytesSent);
	                Console.WriteLine("EndToEndLatency: {0}", log.EndToEndLatency);
	                Console.WriteLine("HostName: {0}", log.HostName);
	                Console.WriteLine("ObservedTime: {0}", log.ObservedTime);
	                Console.WriteLine("PartitionKey: {0}", log.PartitionKey);
	                Console.WriteLine("RequestCount: {0}", log.RequestCount);
	                Console.WriteLine("ResultCode: {0}", log.ResultCode);
	                Console.WriteLine("RowKey: {0}", log.RowKey);
	                Console.WriteLine("ServerLatency: {0}", log.ServerLatency);
	                Console.WriteLine("StatusCode: {0}", log.StatusCode);
	                Console.WriteLine("StreamingEndpointId: {0}", log.StreamingEndpointId);
	                Console.WriteLine();
	            }
	
	            Console.WriteLine();
	        }

	        private static void PrintChannelMetrics()
	        {
	            var end = DateTime.UtcNow;
	            var start = DateTime.UtcNow.AddHours(-5);
	
	            // Get some channel metrics.
	            var channelMetrics = _context.ChannelMetrics.GetChannelMetrics(
	                GetTableEndPoint(),
	                _mediaServicesStorageAccountKey,
	                _mediaServicesAccountName,
	                _context.Channels.FirstOrDefault().Id,
	                start,
	                end);
	
	            // Print the channel metrics.
	            Console.WriteLine("Channel metrics:");
	
	            foreach (var channelHeartbeat in channelMetrics.OrderBy(x => x.ObservedTime))
	            {
	                Console.WriteLine(
	                    "    Observed time: {0}, Last timestamp: {1}, Incoming bitrate: {2}",
	                    channelHeartbeat.ObservedTime,
	                    channelHeartbeat.LastTimestamp,
	                    channelHeartbeat.IncomingBitrate);
	            }
	
	            Console.WriteLine();
	        }
	    }
	}


##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

##Next step
 
See Azure Media Services learning paths to help you learn about great features offered by AMS.  

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

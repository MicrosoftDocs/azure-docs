---
# Required metadata
		# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
		# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

		title:       # Add a title for the browser tab
description: # Add a meaningful description for search results
author:      Saglodha # GitHub alias
ms.author:   saglodha # Microsoft alias
ms.service:  # Add the ms.service or ms.prod value
# ms.prod:   # To use ms.prod, uncomment it and delete ms.service
ms.topic:    # Add the ms.topic value
ms.date:     05/15/2023
---

# QuickStart: Send and Receive Events using Azure Event Hubs Data Generator

In this QuickStart, you learn how to Send and Receive Events using Azure Event Hubs Data Generator.  

### Prerequisites 

If you're new to Azure Event Hubs, see the Event Hubs overview before you go through this QuickStart. 

To complete this QuickStart, you need the following prerequisites: 

Microsoft Azure subscription. To use Azure services, including Azure Event Hubs, you need a subscription. If you don't have an existing Azure account, you can sign up for a free trial or use your MSDN subscriber benefits when you create an account. // existing content on all Quick starts 

Create Event Hubs namespace and an event hub. The first step is to use the Azure portal to create an Event Hubs namespace and an event hub in the namespace. To create a namespace and an event hub, see QuickStart: Create an event hub using Azure portal. 

> [!NOTE] 
> Data Generator for Azure Event Hubs is in Public Preview phase. 

## Sending Events with Azure Event Hubs Data Generator 

You could follow the steps below to send events to Azure Event Hubs Data Generator: 

Click on Generate data blade under “Overview” section of Event Hubs namespace. 

< Portal Snapshot> 

On Generate Data blade, you would find below properties for Data generation: 

1. Select Event Hub – Since you would be sending data to event hub, you could use the dropdown to send the data into event hubs of your choice. If there is no event hub created within event hubs namespaces, you could use “Create Event Hub” to create a new event hub within namespace and stream data post creation of event hub.  

2. Select Payload – You could choose “User defined Payload” in case you want to send event tailored to your business needs. Additionally, you could choose from any of the pre-canned datasets provided in the Select Payload drop down list.  

3. Select Content-Type: Based on the type of data you’re sending; you could choose the Content-type Option. As of today, Data generator supports sending data in following content-type - JSON, XML, Text and Binary. 

4. Repeat Send: If you want to send the same payload as multiple events, you can enter the number of repeat events that you wish to send. Repeat Send supports sending up to 100 events to event hub in one go.   


You can also generate events at event hub level by clicking on “generate data” tab under Features section at Event Hub level. 

<Portal snapshot for Event Hubs entity level Data generator> 

### Maximum Message size support with different SKU

You could send data until the permitted payload size with Data Generator. Below table talks about maximum message/payload size that you could send with Data Generator.

SKU 				|	 Basic    | 	Standard | Premium | Dedicated
--------------------|-------------|--------------|---------|----------|
Maximum Payload Size| 	256Kb		| 	1MB 	     | 1MB     | 1MB 

## Receive Events using Azure Event Hubs Data Generator  

As soon as you Click send, the Data generator would take care of sending the events to event hubs of your choice and new collapsible “View Events” window would load automatically. 

View Events is meant to act like a magnifying glass to the stream of events that you had sent. The tabular section under View events would let you glance at the last 15 events that have been sent to Azure Event hubs.  

Snapshot for View Events window

You could expand any tabular row to glance through the content of events in JSON format as well.  

Snapshot for event in JSON view 

If the event has been sent in a format which cannot be loaded into tabular view, you would be able to look at metadata for the last 15 events that have been sent.  

Snapshot for metadata load in binary data

## Frequently Asked Questions

1. I am getting the error “We couldn’t find any events in Event Hub. Please make sure that there is no other consumer reading events from $Default Consumer group”
Data generator makes use of $Default consumer group (link to consumer group doc) to view events that have been sent to Event hubs. If you have an active consumer silently listening to the events and checkpointing them, then Data generator would not be able to read anything. Please make sure that no other application is reading from $Default consumer group.

2. I am getting the error: “We couldn’t make connection to receive the events. Please make sure that there is no active consumer reading events from $Default consumer group”.   
To start receiving events from event hubs, a receiver needs to connect to Consumer group and take ownership of the underlying partition. If in case, there is already a consumer reading from $Default consumer group, then Data generator wouldn’t be able to establish a connection and view events.  

Please disconnect any active consumer reading from $Default consumer group and try again  

3. I am observing additional events in the View events section from the ones I had sent using Data Generator. Where are those events coming from?

Multiple applications can connect to Azure Event Hubs at the same time. If in case, there are multiple applications sending data parallelly to event hubs alongside Data generator, View events section would also  show events sent by other clients. At any instance, View Events would let you read last 15 events that have sent to Azure Event Hubs

To know more:  

//Send and Receive Events using .NET SDk

//Send and Receive Events using Kafka  






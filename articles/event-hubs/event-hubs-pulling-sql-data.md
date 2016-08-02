<properties
   pageTitle="Pulling SQL data into Azure Event Hubs | Microsoft Azure"
   description="Overview of the Event Hubs import from SQL sample"
   services="event-hubs"
   documentationCenter="na"
   authors="spyrossak"
   manager="timlt"
   editor=""/>

<tags 
   ms.service="event-hubs"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/31/2016"
   ms.author="spyros;sethm" />

# Pulling data from SQL into an Azure Event Hub

A typical architecture for an application for processing real-time data involves 
first pushing it to an Azure Event Hub. It may be an IoT scenario, such as 
monitoring the traffic on different stretches of a highway, or a gaming scenario, monitoring 
the actions of a horde of frenzied contestants, or an enterprise scenario, such as
monitoring building occupancy. In these cases, the data producers are generally external 
objects producing time-series data that you need to collect, analyse, store, and act upon, 
and you may have invested a lot of effort into building out the infrastructure for these
processes. What do you do if you want to bring in data from something like a database rather
than a source of streaming data, and use it in conjunction with your other streaming data? 
Consider the case where you want to use Azure Stream Analytics, Remote Data Explorer (RDX), or 
some other tool to analyze and act on slowly-changing data from Microsoft Dynamics AX or a 
custom facilities-management system? To solve this problem, we've written and open-sourced a small cloud 
sample that you can modify and deploy that will pull the data from a SQL table and push it
to an Azure Event Hub to use as an input in your downstream analytical applications. Do realize that this is a 
rare scenario, and the opposite of what you normally do with an Event Hub. However, if you 
do find yourself in the situation where this is what you need to do, you can find the code in the Azure
Samples gallery, [here](https://azure.microsoft.com/documentation/samples/event-hubs-dotnet-import-from-sql/).  

Note that the code in this sample is just that, a sample. It is **not** intended to be a production application, and no attempts have been made to make it suitable for use
in such an environment - it is stricly a DIY, developer-focused, example. 
You need to review all sorts of security, performance, functionality, and cost factors before settling on 
an end-to-end architecture.

## Application structure

The application is written in C#, and the readme.md file in the sample contains all the information you need to
modify, build, and publish the application. The following sections provide a high level overview of what the 
application does.

We start with the assumption that you have access to a SQL Azure table. You'll also need to have set
up an Azure Event Hub, and know the connection string needed to access it.

When the SqlToEventHub solution starts up, it reads a configuration file (App.config) 
to get a number of things, as outlined in the readme.md file. These are pretty self-explanatory,
such as the name of the data table, etc, and there is no need to rehash the explanations
here. 

Once the application has read the config file, it goes into a loop, reading the SQL table and 
pushing records to the event hub, then waiting for a user-defined sleep interval before doing it 
all over again. A few things are worth noting:

1. The application is based upon the assumption that the SQL table is being updated by some
external process, and you want to send all and only the updates to an Event Hub.
2. The SQL table needs to have a field that has a unique and increasing number, for example,
a record numer. This can be as simple as a field called "Id", or anything else that is 
incremented as whatever updates that database adds records such as "Creation_time" or "Sequence_number". The application notes and stores
the value of that field in each iteration. In each subsequent pass through the loop, the
application essentially queries the table for all records where the value of that field exceeds
the value it saw the last time through the loop. We are calling this last value the "offset".
3. The application creates a table "TableOffsets" when it starts up, to store the offsets. The
table is created with the query "CreateOffsetTableQuery" defined in the config file. 
4. There are several queries used for working with the offset table, defined in the config
file as "OffsetQuery", "UpdateOffsetQuery", and "InsertOffsetQuery". You should not change these.
5. Finally, the query "DataQuery" defined in the config file is the query that will be run to
pull the records from your SQL table. It is currently limited to the top 1,000 records in each pass
through the loop for optimization purposes - if, for example, 25,000 records have been added
to the database since the last query, it could take a while to execute the query. By limiting
the query to 1,000 records each time, the queries are much faster. Selecting 
the top 1,000 simple pushes successive batches of 1,000 records to the event hub.    

## Next Steps

To deploy the solution, clone or download the SqlToEventHub 
application, edit the App.config file, build it, and finally publish it. Once you have published the application, 
you can see it running in the Azure classic portal under Cloud Services, and monitor the events
coming in to your event hub. Note that the frequency will be determined by two things: the
frequency of the updates to the SQL table, and the sleep interval you have specified in the
config file for the application.
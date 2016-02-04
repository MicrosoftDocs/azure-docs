<properties
   pageTitle="Pulling public data into Azure Event Hubs | Microsoft Azure"
   description="Overview of the Event Hubs import from web sample"
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
   ms.date="02/04/2016"
   ms.author="spyros;sethm" />

# Pulling public data into Azure Event Hubs

In typical Internet of Things (IoT) scenarios, you have devices that you can program to push data to Azure, 
either to an Azure Event Hub or an IoT hub. Both of those hubs are entry points into Azure for storing, 
analyzing, and visualizing with a myriad of tools made available on Microsoft Azure. However, they both require
that you push data to them, formatted as JSON and secured in specific ways. 
This brings up the following question. What do you do if you want to bring in data from either public or private
sources where the data is exposed as a web service or feed of some sort, but you do not have the ability to 
change how the data is published? Consider the weather, or traffic, or stock quotes - you can't tell NOAA, 
or WSDOT, or NASDAQ to configure a push to your Event Hub. To solve this problem, we've written and open-sourced 
a small cloud sample that you can modify and deploy that will pull the data from some such source and push 
it to your Event Hub. From there, you can do whatever you want with it, subject, of course, to the license 
terms from the producer. You can find the application [here](https://github.com/Azure-Samples/event-hubs-dotnet-importfromweb).

## Application structure

The application is written in C#, and the readme.md file in the sample contains all the information you need to
modify, build, and publish the application. The following sections provide a high level overview of what the 
application does.

We start with the assumption that you have access to a data feed. For example, you might want to pull in the
traffic data from the Washington State Department of Transportation, or the weather data from NOAA, either to 
display custom reports or to combine that data with other data in your application. You'll also need to have set
up an Azure Event Hub, and know the connection string needed to access it.

When the GenericWebToEH solution starts up, it reads a configuration file (App.config) to get a number of things:

1. The URL, or a list of URLs, for the site publishing the data. Ideally, this is a site that publishes data 
in JSON, such as those referenced by WSDOT [here](http://www.wsdot.wa.gov/Traffic/api/). 
2. Credentials for the URL, if needed. Many public sources do not need credentials, or you can put the credentials
in the URL string. Others require that you supply separately. (Note that you can only specify one set of credentials
in this application, so it will only work if you specify only one URL, not a list of URLs.)
3. The Service Bus connection string and the name of the Event Hub in that Service Bus namespace, to which you will push the data. You can
find this information in the Azure classic portal.
4. A sleep interval, in milliseconds, for the interval between polling the public data site. Setting this requires
some thought. If you poll too infrequently, you may miss data; on the other hand, if you poll too frequently, you may
get a lot of repetitive data, or worse yet, you may be blocked as a nefarious bot. Consider how often the data 
source is updated - weather or traffic data may be refreshed every 15 minutes, but stock quotes maybe every few
seconds, depending upon where you get them. 
5. A flag to tell the application whether the data is coming in as JSON or XML. Since you need to push the
data to an Event Hub, the application has a module to convert XML into JSON before sending.

After reading the configuration file, the application goes into a loop - accessing the public web site, converting
the data if necessary, writing it to your Event Hub, and then waiting for the sleep interval before doing it all over
again. Specifically:

  * Reading the public website. For receiving ready-to-send data the instance of RawXMLWithHeaderToJsonReader 
  class is used from Azure/GenericWebToEH/ApiReaders/RawXMLWithHeaderToJsonReader.cs. It reads source stream 
  in the GetData() method, and then splits it to smaller pieces (i.e. records) using GetXmlFromOriginalText. 
  This method will read XML as well as well-formed JSON or JSON array. Then processing is started 
  using MergeToXML configuration from App.config (default=empty).
  * The receiving and sending data is implemented as a loop in the Process() method in Program.cs. 
  After receiving output results from GetData(), the method enqueues separated values to the Event Hub.

## Disclaimer

The code in this sample only shows how to pull data from typical web feeds, and how to write to an Azure Event Hub. 
This is NOT intended to be a production-ready application, and no attempts have been made to make it suitable for use
in such an environment - it is stricly a DIY, developer-focused example. Furthermore, the existence of 
this sample is NOT tantamount to a recommendation that you should **pull** data into Azure rather than **push** it.
You need to review all sorts of security, performance, functionality, and cost factors before settling on 
an end-to-end architecture.

## Next Steps

To deploy the solution, clone or download the [GenericWebToEH](https://github.com/Azure-Samples/event-hubs-dotnet-importfromweb) 
application, edit the App.config file, build it, and finally publish it. Once you have published the application, 
you can see it running in the Azure classic portal under Cloud Services, and you can change some of the configuration
settings (such as the Event Hub target and the sleep interval) in the **Configure** tab.

For more information about Azure Event Hubs and Iot Hubs, see the following articles:
  * [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/)
  * [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/)
  * Get started with an [Event Hubs tutorial](event-hubs-csharp-ephcs-getstarted.md).
  * Try a complete [sample application that uses Event Hubs](https://code.msdn.microsoft.com/Service-Bus-Event-Hub-286fd097).
  * Deploy a [queued messaging solution](../service-bus/service-bus-dotnet-multi-tier-app-using-service-bus-queues.md) using Service Bus queues.
  * Notify users of alerts from your Event Hubs based upon [AppToNotifyUsers](https://github.com/Azure-Samples/event-hubs-dotnet-user-notifications)

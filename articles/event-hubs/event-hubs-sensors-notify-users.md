<properties 
   pageTitle="Notify users of data received from sensors or other systems | Microsoft Azure"
   description="Describes how to use Event Hubs to notify users of sensor data."
   services="event-hubs"
   documentationCenter="na"
   authors="spyrossak"
   manager="timlt"
   editor="" />
<tags 
   ms.service="event-hubs"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/31/2016"
   ms.author="spyros;sethm" />

# Notify users of data received from sensors or other systems

Suppose you have an application that monitors data in real time, or produces reports on a schedule. If you look at the website on which those real-time charts or reports are displayed, you might see something that requires action. What if you need to be alerted to those situations, rather than relying on remembering to check the website? Imagine that you have a grow light in a greenhouse, and you need to know immediately if the light goes out. One way to do that would be with a light sensor in the greenhouse, arranging to be sent an email if the light is off.

![][1]

In another scenario, imagine that you run a pet boarding facility, and you must be alerted to low inventory supply levels. For example, you might arrange to be sent a text message from your ERP system if your warehouse inventory of dog food has fallen to a critical level. 

![][2]

The problem is how to get critical information when certain conditions are met, not when you get around to checking out a static report. If you are using an [Azure Event Hub][] or [Azure IoT Hub][] to receive data from devices or enterprise applications such as [Dynamics AX][], you have several options for how to process them. You can view them on a website, you can analyze them, you can store them, and you can use them to trigger commands to do something. To do this, you can use powerful tools such as [Azure Websites][], [SQL Azure][], [HDInsight][], [Cortana Intelligence Suite][], [IoT Suite][], [Logic Apps][], or [Azure Notification Hubs][]. But sometimes all you want to do is to send that data to someone with a minimum of overhead. To show you how to do that with just a little bit of code, we’ve provided a new sample, [AppToNotifyUsers][]. Options included are email (SMTP), SMS, and phone.

## Application structure

The application is written in C#, and the readme file in the sample contains all the info you need to modify, build, and publish the application. The following sections provide a high-level overview of what the application does.

We start with the assumption that you have critical events being pushed to an Azure Event Hub or IoT Hub. Any hub will do, as long as you have access to it and know the connection string.

If you do not already have an Event Hub or IoT hub, you can easily set up a test bed with an Arduino shield and a Raspberry Pi, following the instructions in the [Connect The Dots](https://github.com/Azure/connectthedots) project. The light sensor on the Arduino shield sends the light levels through the Pi to an [Azure Event Hub][] (**ehdevices**), and an [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) job pushes alerts to a second event hub (**ehalerts**) if the light levels received fall below a certain level.

When **AppToNotify** starts, it reads a configuration file (App.config) to get the URL and credentials for the Event Hub receiving the alerts. It then spawns a process to continuously monitor that Event Hub for any message that comes through – as long as you have can access the URL for the Event Hub or IoT hub and valid credentials, this Event Hubs reader code will continuously read what's coming in. During startup, the application also reads the URL and credentials for the messaging service (email, SMS, phone) you want to use, and the name/address of the sender and a list of recipients.

Once the Event Hub monitor detects a message, it triggers a process that sends that message using the method specified in the configuration file. Note that it sends every message it detects. If you set the monitor to point to an Event Hub that receives ten messages per second, the sender will send ten messages per second – ten emails per second, ten SMS messages per second, ten phone calls per second. For that reason, make sure that you monitor an Event Hub that only receives the alerts that need to be sent out, not an Event Hub that receives all the raw data from your sensors or applications.

## Applicability

The code in this sample only shows how to monitor Event Hubs and how to call external messaging services in the event that you want to add this functionality to your application. Note that this solution is a DIY, developer-focused example only. It does not address enterprise requirements such as redundancy, fail-over, restart upon failure, etc. For more comprehensive and production solutions, see the following:

- Using connectors or push notifications using the [Azure Logic Apps](../app-service-logic/app-service-logic-connectors-list.md) service.
- Using [Azure Notification Hubs](https://msdn.microsoft.com/library/azure/jj927170.aspx), as described the blog [Broadcast push notifications to millions of mobile devices using Azure Notification Hubs](http://weblogs.asp.net/scottgu/broadcast-push-notifications-to-millions-of-mobile-devices-using-windows-azure-notification-hubs). 

## Next steps

It is straightforward to create a simple notification service that sends emails or text messages to recipients, or calls them, to relay data received by an Event Hub or IoT Hub. To deploy the solution to notify users based upon data received by these hubs, visit [AppToNotifyUsers][].

For more information about these hubs, see the following articles:

- [Azure Event Hubs]
- [Azure IoT Hub]
- Get started with an [Event Hubs tutorial].
- A complete [sample application that uses Event Hubs].
- A [queued messaging solution] using Service Bus queues.

To deploy the solution to notify users based on data received by these hubs, visit:

- [AppToNotifyUsers][]

[Event Hubs tutorial]: event-hubs-csharp-ephcs-getstarted.md
[Azure IoT Hub]: https://azure.microsoft.com/services/iot-hub/
[Azure Event Hubs]: https://azure.microsoft.com/services/event-hubs/
[Azure Event Hub]: https://azure.microsoft.com/services/event-hubs/
[sample application that uses Event Hubs]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-286fd097
[queued messaging solution]: ../service-bus/service-bus-dotnet-multi-tier-app-using-service-bus-queues.md
[AppToNotifyUsers]: https://github.com/Azure-Samples/event-hubs-dotnet-user-notifications
[Dynamics AX]: http://www.microsoft.com/dynamics/erp-ax-overview.aspx
[Azure Websites]: https://azure.microsoft.com/services/app-service/web/
[SQL Azure]: https://azure.microsoft.com/services/sql-database/
[HDInsight]: https://azure.microsoft.com/services/hdinsight/
[Cortana Intelligence Suite]: http://www.microsoft.com/server-cloud/cortana-analytics-suite/Overview.aspx?WT.srch=1&WT.mc_ID=SEM_lLFwOJm3&bknode=BlueKai
[IoT Suite]: https://azure.microsoft.com/solutions/iot-suite/
[Logic Apps]: https://azure.microsoft.com/services/app-service/logic/
[Azure Notification Hubs]: https://azure.microsoft.com/services/notification-hubs/
[Azure Stream Analytics]: https://azure.microsoft.com/services/stream-analytics/
 
[1]: ./media/event-hubs-sensors-notify-users/event-hubs-sensor-alert.png
[2]: ./media/event-hubs-sensors-notify-users/event-hubs-erp-alert.png
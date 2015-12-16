<properties 
   pageTitle="Notify users of data received from sensors or other systems | Microsoft Azure"
   description="Describes how to use Event Hubs to notify users of sensor data."
   services="event-hubs"
   documentationCenter="na"
   authors="sethmanheim"
   manager="timlt"
   editor="" />
<tags 
   ms.service="event-hubs"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="12/16/2015"
   ms.author="sethm" />

# Introduction

Microsoft Azure [Event Hubs][] or [IoT Hub][] provide perfect endpoints for collecting the massive quantities of data coming from devices and tiny sensors, or from line of business systems such as Microsoft Dynamics. For example, a company might want to continuously monitor the temperature in conference rooms in all its buildings, which it can do by sending all the thermostat data to an Event Hub for processing using any number of cloud-based tools such as Azure Stream Analytics, Azure Machine Learning, Power BI, and so on. Or, a farmer might want to monitor or control the status of the lights in a greenhouse, or a fleet services company might want to record the driving characteristics of all their drivers. This article describes a simple example and provides documentation on how to alert users to certain conditions, such as a temperature being too low or a light being turned off. Suppose you want an easy way to send the following message a the service manager. How can you do this in the simplest manner?

A new sample in the Azure Samples Gallery shows just how to do this, using either email, SMS, or even a phone.  Check out the full post at [AppToNotifyUsers][].

## Scenario description

Take the scenario in which you have a light sensor in a room, and you want to receive an email if the light is turned off, as in the following image.

![][1]

Perhaps you want to receive a text message from your ERP system if your warehouse inventory of dog food has fallen to a critical level, as in the following image.

![][2]

If you are using an Azure Event Hub or IoT Hub to receive data from devices or enterprise applications such as [Dynamics AX][], you have several options for how to process them. You can view them on a website, you can analyze them, you can store them, and you can use them to trigger commands to do something. To do this, you can use powerful tools such as [Azure Websites][], [SQL Azure][], [HDInsight][], [Cortana Analytics Suite][], [IoT Suite][], [Logic Apps][], or [Azure Notification Hubs][]. But sometimes all you want to do is to send that data to someone. This article shows you how to do that with code for a simple cloud service.

## Application structure

Let's look at the case of a light sensor, as previously mentioned. There are three steps involved. We’ve just published sample code for this step in the **Connect The Dots** project, in the [Azure/AppToNotifyUsers][] folder. The readme file contains all the info you need to modify, build, and publish the application; this article just describes the basics. The application is written in C#, and we’re going to assume that you understand how to use Visual Studio to open, build, and deploy a C# solution to Azure.

## Prerequisite: push alerts to an Event Hub

Any Event Hub or IoT Hub will do, as long as you have access to it. To test this for the real-time data case (sensors), you can start by connecting the light sensor to a device that sends the light levels in the room to an Event Hub. You can then use [Azure Stream Analytics][] to monitor the data for levels that indicate that the light has been turned off, and finally push an alert to that effect to a second Event Hub. Simple steps and code showing how to do this with an Arduino shield and a Raspberry Pi are described in the [Getting Started](https://github.com/Azure/connectthedots/blob/master/GettingStarted.md) section of the [Connect The Dots](https://github.com/Azure/connectthedots) project, published as open source on GitHub. In that code sample, the message "The Light is turned OFF" is sent to an Event Hub called **ehalerts**, and all we need to do now is to send that message to someone using email, SMS, or some other communications network.

## Step 1: monitor the Event Hub

The code in the [AppToNotifyUsers][] solution creates an Azure Cloud Service (worker role) that monitors an Event Hub identified by a URL you list in App.config, together with the shared key that grants you access. You must modify the following strings in App.config:

```
<add key="Microsoft.ServiceBus.EventHubToMonitor" value="[event hub name]" />
<add key="Microsoft.ServiceBus.EventHubConnectionString" value="[event hub connection string]" />
```

If you deploy the example in Connect The Dots, that Event Hub is called **ehalerts**, and you replace `[event hub name]` with **ehalerts**, and the `EventHubConnectionString` string with the connection string obtained from the [Azure classic portal][]. The App.config entry should look something like this:
 
```
<add key="Microsoft.ServiceBus.EventHubToMonitor" value="ehalerts" />
<add key="Microsoft.ServiceBus.EventHubConnectionString" value="Endpoint=sb://mynamespace-ns.servicebus.windows.net/;SharedAccessKeyName=StreamingAnalytics;SharedAccessKey=<your key from the portal>" />
```

The **EventHubReader** uses this information to get messages from **ehalerts**, and put it in a queue to be sent by whatever method you specify.

## Step 2: select the outbound messaging service

Notification options in the solution are encoded as separate subroutines that are called depending upon entries in the App.Config file. Currently there are three options included in the sample code:

- SMTP
- SMS
- Phone

As with the Event Hub, in App.Config you must specify the service you will be using to push the alerts and the credentials for that service. The keys are as follows:

```
<add key="NotificationService" value="[Service option]" />
<add key="SmtpHost" value="[host name]" />
<add key="SenderUserName" value="[user name]" />
<add key="SenderPassword" value="[user password]" />
<add key="SmtpEnableSSL" value="true" />
```

If you want to use email to send your alerts, replace `[Service option]` with **SMTP**, the SMTPHost with your email server name, and enter the credentials that are allowed to use that service. If you want to use SMS, and have a subscription to a service such as Twilio, replace `[Service option`] with **SMS**, and so on. You can easily add additional or alternative notification options, following the workflow in the current solution. A different architecture, for example, that uses Twitter for notifications is shown in Olivier Bloch's sample [Tweet vibration anomalies detected by Azure IoT services on data from an Intel Edison running Node.js](https://azure.microsoft.com/documentation/samples/iot-hub-nodejs-intel-edison-vibration-anomaly-detection/). Note that each of these solutions requires a subscription to an external service (for example, an email service if notifying users over email).

Note that this solution is a DIY, developer-focused example only. It does not address enterprise requirements such as redundancy, fail-over, restart upon failure, etc. For more comprehensive and production solutions, you should review options such as using connectors available in [Logic Apps](https://azure.microsoft.com/documentation/articles/app-service-logic-connectors-list), or push notifications from an Azure Notification Hub. For more information about Notification Hubs, see the [Notification Hubs Overview](https://msdn.microsoft.com/library/azure/jj927170.aspx) and [Scott Guthrie's blog](http://weblogs.asp.net/scottgu/broadcast-push-notifications-to-millions-of-mobile-devices-using-windows-azure-notification-hubs).

## Step 3: identify the sender and recipients of the messages

Once you have specified how messages will be sent, you must identify from whom, and to whom, they will be sent. If the notification service is SMTP, either using an SMTP host to which you have access, or using **SendGrid**, you can specify an email address in the **sendFrom** address in App.Config:

```
<sendFrom
    address="sender@outlook.com"
    displayName="Sender Name"
    subject="CTD Alerts" />
```

If you are using an SMTP (email) sender, this is the display name and email alias shown on the **From:** and **Subject:** lines of the email. If you are using a service such as Twilio to send SMS messages, this is the phone number Twilio assigns to you for the sender of the SMS. Similarly for the recipient list:

```
<sendToList>
<add address="operator1@outlook.com" />
<add address="operator2@outlook.com" />
</sendToList>
```

## Step 4: deploy the cloud service

Having completed all the necessary fields in the App.config file, you must deploy the application. Since we assume you know how to do that, we won’t go over those details. The reason for including this step in this blog is to bring to your attention the following warning:

> [AZURE.WARNING] This application runs in the cloud, and will push ALL the data that the event hub receives to the users you list.
> 
> The anticipated scenario is that you monitor an Event Hub that is dedicated to receiving alerts on a sporadic basis (maybe once a day or once a week), in which case your targeted users will get an alert pushed to them once a day or once a week. If, however, you monitor an Event Hub that is getting data every second then your users will get an alert once a second.
> 
> Realize that it may take a few minutes to stop a cloud service once it is running, so that your user(s) may get 60 emails a minute until the service is fully shut down if you make the wrong choice - assuming you are at a computer and able to connect to the Azure classic portal to stop the service. We strongly recommend that you do not set this up and then go away without testing anticipated scenarios.

## Next steps

It is straightforward to create a simple notification service that sends emails or text messages to recipients, or calls them, to relay data received by an Event Hub or IoT Hub. To deploy the solution to notify users based upon data received by these hubs, visit [AppToNotifyUsers][].

For more information, see the following articles:

- [Azure Event Hubs]
- [Azure IoT Hub]
- Get started with an [Event Hubs tutorial].
- A complete [sample application that uses Event Hubs].
- A [queued messaging solution] using Service Bus queues.

[Azure classic portal]: http://manage.windowsazure.com
[Event Hubs tutorial]: event-hubs-csharp-ephcs-getstarted.md
[Azure IoT Hub]: https://azure.microsoft.com/services/iot-hub/
[Azure Event Hubs]: https://azure.microsoft.com/services/event-hubs/
[sample application that uses Event Hubs]: https://code.msdn.microsoft.com/windowsazure/Service-Bus-Event-Hub-286fd097
[queued messaging solution]: ../service-bus-dotnet-multi-tier-app-using-service-bus-queues.md
[Event Hubs]: https://azure.microsoft.com/services/event-hubs/
[IoT Hub]: https://azure.microsoft.com/services/iot-hub/
[AppToNotifyUsers]: https://github.com/Azure-Samples/event-hubs-dotnet-user-notifications
[Dynamics AX]: http://www.microsoft.com/en-us/dynamics/erp-ax-overview.aspx
[Azure Websites]: https://azure.microsoft.com/services/app-service/web/
[SQL Azure]: https://azure.microsoft.com/services/sql-database/
[HDInsight]: https://azure.microsoft.com/services/hdinsight/
[Cortana Analytics Suite]: http://www.microsoft.com/server-cloud/cortana-analytics-suite/Overview.aspx?WT.srch=1&WT.mc_ID=SEM_lLFwOJm3&bknode=BlueKai
[IoT Suite]: https://azure.microsoft.com/solutions/iot-suite/
[Logic Apps]: https://azure.microsoft.com/services/app-service/logic/
[Azure Notification Hubs]: https://azure.microsoft.com/services/notification-hubs/
[Azure/AppToNotify]: https://github.com/Azure/connectthedots/tree/master/Azure/AppToNotifyUsers
[Azure Stream Analytics]: https://azure.microsoft.com/services/stream-analytics/
 
[1]: ./media/event-hubs-sensors-notify-users/event-hubs-sensor-alert.png
[2]: ./media/event-hubs-sensors-notify-users/event-hubs-erp-alert.png
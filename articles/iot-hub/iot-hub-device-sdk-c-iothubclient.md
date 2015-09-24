<properties
	pageTitle="Get Started with IoT Hub"
	description="Follow this tutorial to get started using Azure IoT Hub with C#."
	services="iot-hub"
	documentationCenter=".net"
	authors="yourGitHub username"
	manager="kevinmil"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="csharp"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="tbd"
     ms.date="09/29/2015"
     ms.author="your MS email without domain"/>

# Microsoft Azure IoT Device SDK for C – More about IoTHubClient

In the first article in this series I introduced the **Microsoft Azure IoT Device SDK for C**. In that article I explained that there are two architectural layers in SDK. There’s a lower layer called **IoTHub\_Client** and a higher layer called **serializer**. In this article I want to focus on the **IoTHub\_Client** layer.

In my introductory article I described how to use the **IoTHub\_Client** library to send messages to IoT Hub and receive notifications. In this article I’ll extend that discussion by explaining how to more precisely manage when you send and receive data by introducing you to the **Lower Level APIs**. I’ll also explain how to attach properties to messages (and retrieve them from notifications) using the property handling features in the **IoTHub\_Client**. And then I’ll provide some additional explanation on notifications—including some different ways to handle notifications received from IoT Hub.

I’ll finish the article by covering a couple of miscellaneous topics, including more about device credentials and how to change the behavior of the **IoTHub\_Client** through configuration options.

I’ll use the **IoTHub\_Client** SDK samples to explain these topics. So if you want to follow along, check out the **iothub\_client\_sample\_http** and **iothub\_client\_sample\_amqp** applications that are included in the Azure IoT Device SDK for C. Everything I describe below is demonstrated in these samples.

## The Lower Level APIs

In my previous article I described the basic operation of the **IotHub\_Client** within the context of the **iothub\_client\_sample\_amqp** application. I explained how to initialize the library using this code…

IOTHUB\_CLIENT\_HANDLE iotHubClientHandle;

iotHubClientHandle = IoTHubClient\_CreateFromConnectionString(connectionString, IoTHubTransportAmqp\_ProvideTransportInterface);

…how to send data using this function call…

IoTHubClient\_SendTelemetryAsync(iotHubClientHandle, message.messageHandle, SendConfirmationCallback, &message);

… I also described how to receive data by registering a notification callback…

int receiveContext = 0;

IoTHubClient\_SetNotificationCallback(iotHubClientHandle, ReceiveNotificationCallback, &receiveContext);

… and how to free resources using code like this…

IoTHubClient\_Destroy(iotHubClientHandle);

However there’s are companion functions to each of these APIs:

-   IoTHubClient\_LL\_CreateFromConnectionString

-   IoTHubClient\_LL\_SendTelemetryAsync

-   IoTHubClient\_LL\_SetNotificationCallback

-   IoTHubClient\_LL\_Destroy

These functions all include “LL” in the API name. Other than that, the parameters of each of these functions are identical to their non-LL analog. However, the behavior of these function is different in one important way…

When we call **IoTHubClient\_SetNotificationCallback** the underlying libraries create a new thread that runs in the background that handles sending data to IoT Hub and receiving notifications coming from it. No such thread is created with working with the “LL” APIs. The creation of the background thread is a convenience to the developer. You don’t have to worry about explicitly sending and receiving data from IoT Hub—it just happens automatically in the background. But the “LL” APIs give us explicit control over communication with IoT Hub if we need it.

To understand this better, let’s look at an example:

When we call **IoTHubClient\_SendTelemetryAsync** what we’re actually doing is putting the data in a buffer. The background thread created when we called **IoTHubClient\_CreateFromConnectionString** continually monitors this buffer and sends any data that it contains to IoT Hub. This happens in the background at the same time that the main thread is performing other work.

Similarly when we register a callback function for notifications using **IoTHubClient\_SetNotificationCallback**, we’re cueing the SDK to have that background thread invoke our callback function when a notification is received—independent of the main thread. Once again, this is happening continually in the background thread.

The “LL” APIs don’t create a background thread. Instead, a new API must be called to explicitly send and receive data from IoT Hub. Once again, let’s take a look at an example…

The **iothub\_client\_sample\_http** application that’s included in the SDKs shows off the lower level APIs. In that sample, we send data by running code that looks like this:

TELEMETRY\_INSTANCE message;

sprintf\_s(msgText, sizeof(msgText), "Message\_%d\_From\_IoTHubClient\_LL\_Over\_HTTP", i);

message.messageHandle = IoTHubMessage\_CreateFromByteArray(

(const unsigned char\*)msgText, strlen(msgText));

IoTHubClient\_LL\_SendTelemetryAsync(iotHubClientHandle, message.messageHandle,

SendConfirmationCallback, &message)

The first three lines create the message and the last line sends the data. However, as mentioned above, “sending” the data means that the data is simply placed in a buffer. Nothing is being transmitted on the network when we call **IoTHubClient\_LL\_SendTelemetryAsync**. In order to actually ingress the data to IoT Hub you need to call **IoTHubClient\_LL\_DoWork** as in this example:

while (1)

{

IoTHubClient\_LL\_DoWork(iotHubClientHandle);

ThreadAPI\_Sleep(1);

}

This code snippet (from the **iothub\_client\_sample\_http** application) repeatedly calls **IoTHubClient\_LL\_DoWork**. Each time **IoTHubClient\_LL\_DoWork** is called it sends some data from the buffer to IoT Hub and it retrieves a notification from IoT Hub. In the latter case it means that if we registered a callback function for notifications then the callback is invoked (assuming notifications are queued up for the device). We would have registered such a callback function with code such as this:

IoTHubClient\_LL\_SetNotificationCallback(iotHubClientHandle,

ReceiveNotificationCallback, &receiveContext)

The reason that **IoTHubClient\_LL\_DoWork** is often called in a loop is because each time it’s called it sends *some* buffered data to IoT Hub and retrieves *the next* notification queued up for the device. Each call isn’t guaranteed to send all buffered data or to retrieve all queued notifications. If you want to send all data in the buffer and then continue on with other processing you can replace the loop above with code like this:

IOTHUB\_CLIENT\_STATUS status;

while ((IoTHubClient\_LL\_GetSendStatus(iotHubClientHandle, &status) == IOTHUB\_CLIENT\_OK)

&& (status == IOTHUB\_CLIENT\_SEND\_STATUS\_BUSY))

{

IoTHubClient\_LL\_DoWork(iotHubClientHandle);

ThreadAPI\_Sleep(1);

}

This logic calls **IoTHubClient\_LL\_DoWork** until all data in the buffer has been sent to IoT Hub. Note that this doesn’t also means that all queued notifications have been processed. Part of this is because checking for “all” notifications isn’t as deterministic an action—what happens if you retrieve “all” of the notifications but then another one is sent to the device immediately after? A better way to deal with that is with a programmed timeout. For example, the notification callback function could reset a timer every time it’s called. And then you can write logic to continue processing if, for example, no notification has been received in the last X seconds.

When you’re done ingressing data and receiving notifications be sure to call the corresponding function to clean up resources.

IoTHubClient\_LL\_Destroy(iotHubClientHandle);

That’s all there is to it. Basically there’s one set of APIs to send and receive data with a background thread and another set of APIs that does the same thing without the background thread. A lot of developers may prefer the non-LL APIs, but the lower level APIs are useful when the developer wants explicit control over network transmissions. For example, some devices will collect data over time and only ingress data at specified intervals (e.g., once an hour or once a day). The lower level APIs give you the ability to explicitly control when you send and receive data from IoT Hub. Others will simply prefer the simplicity that the lower level APIs provide—everything happens on the main thread rather than some work happening in the background.

Whichever model you choose be sure to be consistent in which APIs you use. If you start by calling **IoTHubClient\_LL\_CreateFromConnectionString**, be sure you only use the corresponding lower level APIs for any follow-on work:

-   IoTHubClient\_LL\_CreateFromConnectionString

-   IoTHubClient\_LL\_SendTelemetryAsync

-   IoTHubClient\_LL\_SetNotificationCallback

-   IoTHubClient\_LL\_Destroy

-   IoTHubClient\_LL\_DoWork

And then the opposite is true as well… if you start with **IoTHubClient\_CreateFromConnectionString** then stick with the non-LL APIs for any additional processing.

In the Azure IoT Suite SDK check out the **iothub\_client\_sample\_http** application for a complete example of the lower level APIs. The **iothub\_client\_sample\_amqp** application can be referenced for a full example of the non-LL APIs.

## Property Handling

So far when I’ve described sending data, I’ve been referring to the body of the message. For example, consider this code snippet:

TELEMETRY\_INSTANCE message;

sprintf\_s(msgText, sizeof(msgText), "Hello World");

message.messageHandle = IoTHubMessage\_CreateFromByteArray(

(const unsigned char\*)msgText, strlen(msgText));

IoTHubClient\_LL\_SendTelemetryAsync(iotHubClientHandle, message.messageHandle,

SendConfirmationCallback, &message)

This example sends a message to IoT Hub with the text “Hello World”. But IoT Hub also allows properties to be attached to each message. Properties are just named value pairs that can be attached to the message. For example, we can modify the code above to attach a property to the message:

MAP\_HANDLE propMap = IoTHubMessage\_Properties(message.messageHandle);

sprintf\_s(propText, sizeof(propText), "%d", i);

Map\_AddOrUpdate(propMap, "SequenceNumber", propText);

We start by calling **IoTHubMessage\_Properties** and passing it the handle of our message. What we get back is a **MAP\_HANDLE** reference that allows us start adding properties. The latter is accomplished by calling **Map\_AddOrUpdate** which takes a reference to a MAP\_HANDLE, the property name, and the property value. With this API we can add as many properties as we like.

When the message is read from **Event Hub** the receiver can enumerate the properties and retrieve their corresponding values. For example, in .NET this would be accomplished by accessing the [Properties collection on the EventData object][].

In the example above, we’re attaching properties to data that we send to IoT Hub. But properties can also be attached to notifications received from IoT Hub. If we want to retrieve properties from a notification message we can use code like this in our notification callback function:

static IOTHUBMESSAGE\_DISPOSITION\_RESULT ReceiveNotificationCallback(

IOTHUB\_MESSAGE\_HANDLE notificationMessage, void\* userContextCallback)

{

. . .

// Retrieve properties from the message

MAP\_HANDLE mapProperties = IoTHubMessage\_Properties(notificationMessage);

if (mapProperties != NULL)

{

const char\*const\* keys;

const char\*const\* values;

size\_t propertyCount = 0;

if (Map\_GetInternals(mapProperties, &keys, &values, &propertyCount) == MAP\_OK)

{

if (propertyCount \> 0)

{

printf("Message Properties:\\r\\n");

for (size\_t index = 0; index \< propertyCount; index++)

{

printf("\\tKey: %s Value: %s\\r\\n", keys[index], values[index]);

}

printf("\\r\\n");

}

}

}

. . .

}

The call to **IoTHubMessage\_Properties** gives us our **MAP\_HANDLE** reference. And then we pass that reference to **Map\_GetInternals** to get a reference to an array of the name/value pairs as well as a count of the properties. At that point it’s a simple matter of enumerating through the properties to get to the values we want.

You don’t have to use properties to send and receive messages. But if you need to set them on messages or retrieve them from notifications, the **IoTHub\_Client** library make doing so fairly easy.

## Notification Handling

Earlier I explained that when notifications arrive from IoT Hub the **IoTHub\_Client** library responds by invoking a registered callback function. But there’s a return parameter of this function that deserves some additional explanation. Here’s an excerpt of the callback function in the **iothub\_client\_sample\_http** sample application:

static IOTHUBMESSAGE\_DISPOSITION\_RESULT ReceiveNotificationCallback(

IOTHUB\_MESSAGE\_HANDLE notificationMessage, void\* userContextCallback)

{

return IOTHUBMESSAGE\_ACCEPTED;

}

Notice that the return type is **IOTHUBMESSAGE\_DISPOSITION\_RESULT** and in this particular case we return **IOTHUBMESSAGE\_ACCEPTED**. It turns out there are other values we can return from this function that change how the **IoTHub\_Client** library reacts to the notification callback. Here are the options.

-   **IOTHUBMESSAGE\_ACCEPTED** – The notification has been processed successfully. The **IoTHub\_Client** library will not invoke the callback function again for the same notification.

-   **IOTHUBMESSAGE\_REJECTED** – The notification wasn’t processed and there’s no desire to do so in the future. The **IoTHub\_Client** library should not invoke the callback function again for the same notification.

-   **IOTHUBMESSAGE\_ABANDONED** – The notification wasn’t processed successfully. But the **IoTHub\_Client** library should invoke the callback function again for the same notification.

For the first two return codes the **IoTHub\_Client** library sends a message to IoT Hub indicating that the notification should be deleted from the device’s queue and not delivered again. In the last case a message is also sent to IoT Hub but it indicates that the notification should be redelivered. Typically you’ll abandon a notification if you encounter some error but want to try to process the message again. Rejecting a notification is appropriate when you encounter an unrecoverable error (or if you simply decide you don’t want to process the notification).

In any case just be aware of the different return codes so that you can elicit the behavior you want from the **IoTHub\_Client** library.

## Alternate Device Credentials

Before we can do anything with the **IoTHub\_Client** library we need to obtain a **IOTHUB\_CLIENT\_HANDLE** with a call such as this:

IOTHUB\_CLIENT\_HANDLE iotHubClientHandle;

iotHubClientHandle = IoTHubClient\_CreateFromConnectionString(connectionString,

IoTHubTransportAmqp\_ProvideTransportInterface);

Basically, the argument of **IoTHubClient\_CreateFromConnectionString** is the connection string of our device and a parameter that indicates the protocol we’ll use to send and receive data from IoT Hub. The connection string has a format that looks like this:

> HostName=\<IoTHubName\>.\<IotHubSuffix\>;CredentialScope=Device; DeviceId=\<DeviceId\>;SharedAccessKey=\<SharedAccessKey\>

There are basically four pieces of information here: IoT Hub Name, IoT Hub Suffix, DeviceId, and Shared Access Key. You get the fully qualified domain name (FQDN) of the IoT Hub when you create your IoT Hub instance in the Azure Management Portal—this gives you the IoT Hub Name (the first part of the FQDN) and the IoT Hub Suffix (the rest of the FQDN). You get the Device Id and the Shared Access Key when you register your device with IoT Hub (as described in my previous article). If you prefer, you can create a new **IOTHUB\_CLIENT\_HANDLE** by using these individual parameters rather than the connection string. This is done with the following code:

IOTHUB\_CLIENT\_CONFIG iotHubClientConfig;

iotHubClientConfig.iotHubName = "";

iotHubClientConfig.deviceId = "";

iotHubClientConfig.deviceKey = "";

iotHubClientConfig.iotHubSuffix = "";

iotHubClientConfig.protocol = IoTHubTransportHttp\_ProvideTransportInterface;

IOTHUB\_CLIENT\_HANDLE iotHubClientHandle = IoTHubClient\_LL\_Create(&iotHubClientConfig);

This accomplishes the same thing as **IoTHubClient\_CreateFromConnectionString**.

It may seem obvious that you would want to use **IoTHubClient\_CreateFromConnectionString** rather than this more verbose method of initialization. But keep in mind that when we register a device in IoT Hub what we get is a device id and device key (not a connection string). The **Device Manager** SDK tool that I introduced in a previous article uses APIs in the managed **Azure Device SDK** to create the connection string from the device id, device key, and IoT Hub host name. So calling **IoTHubClient\_LL\_Create** may be preferable because it saves you the step of generating a connection string. But use whichever method is convenient.

## Configuration Options

So far everything I’ve described about the way the **IoTHub\_Client** library works reflects its default behavior. But there are a few options that you can set to change how the library works. This is accomplished by leveraging the **IoTHubClient\_LL\_SetOption** API as in this example:

unsigned int timeout = 30000;

IoTHubClient\_LL\_SetOption(iotHubClientHandle, "timeout", &timeout);

Presently these are the options you can change:

-   **SetBatching** (bool) – If true then data sent to IoT Hub is sent in batches. If false then messages are sent individually. The default is false.

-   **Timeout** (unsigned int) – This value is represented in milliseconds. If sending an HTTP request or receiving a response takes longer than this time, then the connection times out.

The batching option is important to know about. By default the library ingresses messages individually (a single message is whatever you pass to **IoTHubClient\_LL\_SendTelemetryAsync**). But if the batching option is true, the library will collect as many messages as it can from the buffer (up to the maximum message size that IoT Hub will accept) and send those message to IoT Hub in a single HTTP call (the individual messages are bundled into a JSON array). Turning on batching typically results in big performance gains since you’re reducing roundtrips. And it significantly reduces bandwidth since you’re sending one set of HTTP headers with a message batch rather than a set of headers for each individual message. Unless you have a specific reason to do otherwise, typically you’ll want to turn batching on.

## Summary

This article goes into detail on the **IoTHub\_Client** layer of the **Azure IoT Device SDK for C**. With the information I’ve provided you should have a good understanding of the full capabilities of this part of the SDK. In future articles I’ll provide similar detail on the **serializer** libraries in the SDK—which provide an even easier way to deal with the data we send and receive from IoT Hub.

  [Properties collection on the EventData object]: https://msdn.microsoft.com/en-us/library/microsoft.servicebus.messaging.eventdata.properties.aspx

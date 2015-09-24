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

# Introducing the Azure IoT Device SDK for C

The Azure IoT platform provides different ways for you to connect devices to the cloud and Microsoft has developed a set of SDKs to make the process of connecting those devices easier for you. This article focuses on an introduction to one of those SDKs- the **Azure IoT Device SDK for C**.

The **Azure IoT Device SDK for C** is a set of a libraries designed to simplify the process of sending and receiving data from the Azure cloud. While different Azure services can be used for this purpose, the **Azure IoT Device SDK for C** is designed specifically to enable communication with the **Azure IoT Hub** service. And as the name of the SDK implies, these libraries target the C programming language.

Rather than using the SDK you could write your own software to communicate directly with **IoT Hub** using one of the communications protocols that it supports. However, taking on an effort like this involves writing a lot of "plumbing" code that’s probably not relevant to your solution. This is where the **Azure IoT Device SDK for C** comes in. These libraries abstract the technical details of communicating with **IoT Hub** using a simple set of APIs that enable you to send and receive data. The SDK allows you to easily write code to exchange data with **IoT Hub**, without having to worry about the details of how the underlying communication takes place.

The **Azure IoT Device SDK for C** includes support for a variety of hardware and software platforms. A complete list can be found in the readme in the GitHub repository. At the time of this writing, the supported platforms include Windows desktop and [Windows IoT][], various flavors of Linux, and mbed. The supported programming language is C and the libraries themselves are written to the C99 standard to ensure portability. This list is just the start. The number of supported operating systems will grow in the future.

This article focuses more on the Windows platform. But check back here again, as future articles will address other platforms.

The **Azure IoT Device SDK for C** is constantly being updated. This article was written for the version of the SDK released with the public preview of IoT Suite (which contains IoT Hub).

Be aware that if you’re using a newer release, the APIs described in this article may differ from those in your copy of the code.

## SDK architecture

You can find the **Azure IoT Device SDK for C** in the following GitHub repository:

<https://github.com/Azure/azure-iot-suite-sdks>.

You should always use the code in the **master** branch of this repository:

![][]

This repository contains SDKs that support different languages and platforms. But this article is about the **Azure IoT Device SDK for C** which can be found in the **c** folder:

![][1]

The core implementation is in the **common**, **iothub\_client**, and **serializer** folders in the repository. The **common** folder contains shared code used throughout the libraries and other tools (typically you don’t use the code in the **common** folder directly). However, the **iothub\_client** and **serializer** folders contain implementations of the two distinct layers of the SDK that you will use in your code.

-   **IoTHub\_Client** -- The **iothub\_client** folder contains the implementation of the lowest API layer in the library. This layer contains APIs for sending data to **IoT Hub** as well as receiving notifications from it. If you use this layer you are responsible for implementing message serialization, but other details of communicating with **IoT Hub** are handled for you.

-   **serializer** -- The **serializer** folder contains the implementation of a layer that sits on top of **iothub\_client**. The **serializer** layer adds modeling capabilities on top of **iothub\_client**. If you use the **serializer** layer, you start by defining a model that specifies the data you want to send to IoT Hub as well as the notifications you expect to receive from it. Once the model is defined, the SDK gives you an API surface that makes it as easy to send data as setting members of a C struct and calling simple functions to send your data to the cloud. Details such as data serialization are handled for you.

All of this is easier to understand by looking at some example code. The following sections walk you through a couple of the sample applications that are included in the SDK. This should give you a good feel for the various capabilities of the architectural layers of the SDK as well as an introduction to how the APIs work.

## Before running the samples

Before you can run the samples in the **Azure IoT Device SDK for C** repository you must complete two tasks: build the SDK and obtain device credentials.

## Build the SDK

First, you’ll need to get a copy of the **Azure IoT Device SDK for C** from GitHub and then build the source. You should fetch a copy of the source from the **master** branch of the GitHub repository:

<https://github.com/Azure/azure-iot-suite-sdks>

When you’ve downloaded a copy of the source, you can build the SDK. There are build instructions for each of the supported platforms in the [doc][] folder of the repository. As an example, you can find the setup instructions for Windows here:

https://github.com/Azure/azure-iot-suite-sdks/blob/master/c/doc/windows\_setup.md

Be sure to follow the procedure **Build Proton Libraries** in the installation guide.

The **Build Proton Libraries** procedure includes instructions for installing the *Proton Qpid* libraries that are used when communicating with IoT Hub using the AMQP protocol. You must follow this procedure regardless of whether you plan to use either the AMQP or the HTTP protocol, because the Proton libraries are required to compile the SDK. Here are a few tips to help you complete this procedure:

-   When you create your **PROTON\_PATH** environment variable, make it a system environment variable as shown here:

> ![][2]

-   When you install the **CMake** utility, choose the option to add **CMake** to the system PATH for **all users** (adding to **the current user** works as well):

> ![][3]

-   Be sure to install the correct version of Python. Typically in Windows, you should install the x86 version:

> ![][4]
>
> You can use the default options in the installer.

-   Before you open the **Developer Command Prompt for VS2015**, install the *Git command prompt tools*. To install, complete the following steps:

    1.  Launch the **Visual Studio 2015** setup program (or chose **Microsoft Visual Studio 2015** from the **Programs and Features** control panel and select **Change**).

    2.  Make sure the **Git for Windows** feature is selected in the installer:

> ![][5]

1.  Complete the setup wizard to install the tools.

2.  Add the Git tools **bin** directory to the system **PATH** environment variable. On Windows, this looks like the following:

> ![][6]

When you run the **build\_proton.cmd** script from the command prompt, the script fetches the Proton source from its GitHub repository and then builds the Proton libraries.

When you have completed the previous steps, you can build the Windows samples included in the repository by opening the Visual Studio solution file and selecting **Build Solution** from the **Build** menu. This article walks you through a couple of these Visual Studio solutions.

## Obtaining credentials

The **Azure IoT Device SDK for C** includes libraries that enable you to communicate with **IoT Hub**. For a device to be able to access an **IoT Hub** endpoint, you must register the device in the **IoT Hub** *device registry*. When you register your device you should make a note of the device credentials, which you will need when you build the samples. In all, you need the following information for each device in order to build and run the samples:

-   Device ID

-   IoT Hub name

-   IoT Hub suffix name (the domain name of the IoT Hub)

-   Device key

The sample applications that we’ll look at in the next section expect these pieces of information to be combined into a single connection string.

You can register your own devices by using the **Device Explorer** tool included with the A**zure IoT Device SDK for C**. You can find the source for this tool in this folder:

![][7]

Open **DeviceExplorer.sln** in **Visual Studio 2015** and build the solution. When you run the program you’ll see this interface:

![][8]

Enter your **IoT Hub Connection String** into the first field and click the **Update** button. This configures the tool so that it can communicate with IoT Hub.

Once the IoT Hub connection string is configured click on the **Management** tab:

![][9]

This is where you’ll manage the devices registered in IoT Hub.

You can create a device by clicking the **Create** button. A dialog is displayed with a set of keys (primary and secondary) all filled out. All you have to do is enter a **Device ID** and click the **Create** button.

![][10]

Once the device is created the Devices list is updated with all registered devices, including the one you just created. If you right click your new device you’ll see this menu:

![][11]

If you choose the **Copy connection string** option the connection string for your device is copied to the clipboard. Keep a copy of this. You’ll need it when we run the sample applications later on.

The following sections walk you through two of the sample solutions in the **Azure IoT Device SDK for C** that demonstrate the capabilities of the framework.

## IoTHub\_Client

Within the **iothub\_client** folder in the **azure-iot-suite-sdks** repository there is a **samples** folder that contains a sample called **iothub\_client\_sample\_amqp**.

The Windows version of the **iothub\_client\_sample\_ampq** application includes the following Visual Studio solution:

![][12]

The **iothub\_client\_sample\_amqp** project contains the sample itself. The solution also includes the **common** and **iothub\_client** projects from the **Azure IoT Device SDK for C** SDK. You always need the **common** project when you are working with the SDK, and because the sample uses the **iothub\_client** API layer, you must also include that project in your solution.

You can find the implementation for the sample application in the **iothub\_client\_sample\_amqp.c** source file:

![][13]

The following sections use this sample application to walk you through what’s required to use the **iothub\_client** library.

## Initializing the library

To start working with the libraries you must first create an IoT Hub client handle with code such as this:

IOTHUB\_CLIENT\_HANDLE iotHubClientHandle;

iotHubClientHandle = IoTHubClient\_CreateFromConnectionString(connectionString, IoTHubTransportAmqp\_ProvideTransportInterface);

Notice that we’re passing a copy of our device connection string (the one we got from Device Explorer). We also designate the protocol that we want to use—we’re using AMQP in this example but HTTP is an option as well.

When you have a valid **IOTHUB\_CLIENT\_HANDLE**, you can start calling the APIs to send and receive data from IoT Hub. We’ll look at that next.

## Sending data

Sending data to IoT Hub requires you to complete the following steps:

First, create a message:

TELEMETRY\_INSTANCE message;

sprintf\_s(msgText, sizeof(msgText), "Message\_%d\_From\_IoTHubClient\_Over\_AMQP", i);

message.messageHandle = IoTHubMessage\_CreateFromByteArray((const unsigned char\*)msgText, strlen(msgText);

Next, send the message:

IoTHubClient\_SendEventAsync(iotHubClientHandle, message.messageHandle, SendConfirmationCallback, &message);

Every time you send a message, you specify a reference to a callback function that’s invoked when the data is sent:

static void SendConfirmationCallback(IOTHUB\_CLIENT\_CONFIRMATION\_RESULT result,

void\* userContextCallback)

{

EVENT\_INSTANCE\* eventInstance = (EVENT\_INSTANCE\*)userContextCallback;

(void)printf("Confirmation[%d] received for message tracking id = %d with result =

%s\\r\\n", callbackCounter, eventInstance-\>messageTrackingId,

> ENUM\_TO\_STRING(IOTHUB\_CLIENT\_CONFIRMATION\_RESULT, result));

/\* Some device specific action code goes here... \*/

callbackCounter++;

IoTHubMessage\_Destroy(eventInstance-\>messageHandle);

}

Notice the call to the **IoTHubMessage\_Destroy** function when you’re done with the message. You must do this to free the resources allocated when you created the message.

## Receiving notifications

Receiving a notification is an asynchronous operation. First, you register a callback to be invoked when the device receives a notification which the following code illustrates:

int receiveContext = 0;

IoTHubClient\_SetNotificationCallback(iotHubClientHandle, ReceiveNotificationCallback, &receiveContext);

The last parameter is a void pointer to whatever you want. In this case, it’s a pointer to an integer but it could be a pointer to a more complex data structure. This enables the callback function to operate on shared state.

When the device receives a notification, the registered callback function is invoked:

static IOTHUBMESSAGE\_DISPOSITION\_RESULT ReceiveNotificationCallback(IOTHUB\_MESSAGE\_HANDLE notificationMessage, void\* userContextCallback)

{

int\* counter = (int\*)userContextCallback;

const char\* buffer;

size\_t size;

IoTHubMessage\_GetByteArray(notificationMessage, (const unsigned char\*\*)&buffer, &size);

(void)printf("Received Notification [%d] with Data: \<\<\<%.\*s\>\>\> & Size=%d\\r\\n", \*counter, (int)size, buffer, (int)size);

/\* Some device specific action code goes here... \*/ (\*counter)++;

return IOTHUBMESSAGE\_ACCEPTED;

}

Notice how you use the **IoTHubMessage\_GetByteArray** function to retrieve the notification message, which in this example is a string.

## Uninitializing the library

When you’re done sending data and receiving notifications you can uninitialize the IoT library—which is accomplished with the following API call:

IoTHubClient\_Destroy(iotHubClientHandle);

This frees up the resources previously allocated by the **IoTHubClient\_CreateFromConnectionString** function call.

As you can see, it’s easy to send and receive data with the **iothub\_client** library. The library takes care of the details of communicating with IoT Hub—including which protocol to use (which from the perspective of the developer is a simple configuration option).

The **iothub\_client** library also provides you with precise control over how to serialize the data your device sends to IoT Hub. In some cases this is an advantage, but in other cases this is an implementation detail with which you don’t want to be concerned. If that's the case, you might consider using the **serializer** library, which the next section covers.

## Serializer

The **serializer** library sits on top of the **IoTHub\_Client** layer in the SDK. It uses the **IoTHub\_Client** layer for the underlying communication with IoT Hub, but it adds modeling capabilities that remove the burden of dealing with message serialization from the developer. How this layer works is best demonstrated by an example.

Within the **serializer** folder in the **azure-iot-suite-sdks** repository is a **samples** folder that contains a sample called **simplesample\_amqp**. The Windows version of this sample includes the following Visual Studio solution:

![][14]

The sample itself is the **simplesample\_amqp** project. As you've seen previously, the solution includes the **common** and **iothub\_client** projects from the **Azure IoT Device SDK for C** SDK. However, this sample solution includes an extra project called **serializer**: this is the higher level API that adds modeling support on top of the **iothub\_client** layer.

You can find the implementation of the sample application in the **simplesample\_amqp.c** code file:

![][15]

The following sections walk you through the key parts of this sample.

## Initializing the library

To start working with the libraries, you must call the initialization APIs:

serializer\_init(NULL);

IOTHUB\_CLIENT\_HANDLE iotHubClientHandle =

IoTHubClient\_CreateFromConnectionString(connectionString,

IoTHubTransportAmqp\_ProvideTransportInterface);

ContosoThermostat505\* Thermostat = CREATE\_MODEL\_INSTANCE(MyThermostat, ContosoThermostat505);

The call to the **serializer\_init** function is a one-time call used to initialize the underlying library. Then you call the **IoTHubClient\_CreateFromConnectionString** function, which is the same API you saw in the **iothub\_client** sample. This call sets your device connection string and this is where you choose the protocol you want to use. Notice that this sample uses AMQP as the transport but you could have use HTTP.

Finally, call the **CREATE\_MODEL\_INSTANCE** function. **MyThermostat** is the namespace of the model and **ContosoThermostat505** is the name of the model. Once the model is defined you can use it to start sending data and receiving notifications. But first, you must understand what a model is.

## Defining the model

A model in the **serializer** library defines the data that your device can send to IoT Hub and the notifications, called *actions* in the modeling language, which it can receive. You define a model using a set of C macros as in the **simplesample\_amqp** sample application:

BEGIN\_NAMESPACE(MyThermostat);

DECLARE\_MODEL(ContosoThermostat505,

WITH\_DATA(int, Temperature),

WITH\_DATA(int, Humidity),

WITH\_DATA(bool, LowTemperatureAlarm),

WITH\_ACTION(TurnFanOn),

WITH\_ACTION(TurnFanOff),

WITH\_ACTION(SetTemperature, int, DesiredTemperature)

);

END\_NAMESPACE(MyThermostat);

The **BEGIN\_NAMESPACE** and **END\_NAMESPACE** macros both take the namespace of the model as an argument. It’s expected that anything between these macros is the definition of your model(s) and the data structures that the models use.

In this example, there is a single model called **ContosoThermostat505**. This model defines three pieces of data that your device can send to IoT Hub: **Temperature**, **Humidity**, and **LowTemperatureAlarm**. It also defines three actions (notifications) that your device can receive: **TurnFanOn**, **TurnFanOff**, and **SetTemperature**. Each piece of data (from now on called "data events" or simply "events") has a type, and each action has a name and optionally a set of parameters.

The data events and actions defined in the model define an API surface that you can use to send data to IoT Hub as well as receive notifications from it. This is best understood through an example.

## Sending data

The model defines the data you can send to IoT Hub. In this sample, that means one of the three data events. For example, if you want to send a **Temperature** event to an IoT Hub, there are a few steps involved in making this happen. The first is to set the data we want to send:

Thermostat-\>Temperature = 67;

The model we defined earlier allows us to do this simply by setting a member of a struct. Next, we need to serialize the data we want to send:

unsigned char\* destination;

size\_t destinationSize;

SERIALIZE(&destination, &destinationSize, Thermostat-\>Temperature);

This code serializes the data to a buffer (referenced by **destination**). Finally, we’ll send the data to IoT Hub with this code:

sendMessage(iotHubClientHandle, destination, destinationSize);

This is a help function in the sample application sends our serialized event to IoT Hub:

static void sendMessage(IOTHUB\_CLIENT\_HANDLE iotHubClientHandle,

const unsigned char\* buffer, size\_t size)

{

static unsigned int messageTrackingId;

IOTHUB\_MESSAGE\_HANDLE messageHandle = IoTHubMessage\_CreateFromByteArray(buffer,

size);

if (messageHandle == NULL)

{

printf("unable to create a new IoTHubMessage\\r\\n");

}

else

{

if (IoTHubClient\_SendEventAsync(iotHubClientHandle, messageHandle, sendCallback,

> (void\*)(uintptr\_t)messageTrackingId) != IOTHUB\_CLIENT\_OK)

{

printf("failed to hand over the message to IoTHubClient");

}

else

{

printf("IoTHubClient accepted the message for delivery\\r\\n");

}

IoTHubMessage\_Destroy(messageHandle);

}

free((void\*)buffer);

messageTrackingId++;

}

This code is very similar to what we saw in the **iothub\_client\_sample\_amqp** sample where we created a message from a byte array and then used **IoTHubClient\_LL\_SendEventAsync** to send it to IoT Hub. After that we just have to free the message handle and serialized data buffer we allocated earlier.

The second to last parameter of **IoTHubClient\_SendEventAsync** is a reference to a callback function that’s called when the data is successfully sent. Here’s an example of a callback function:

void sendCallback(IOTHUB\_CLIENT\_CONFIRMATION\_RESULT result, void\* userContextCallback)

{

int messageTrackingId = (intptr\_t)userContextCallback;

(void)printf("Message Id: %d Received.\\r\\n", messageTrackingId);

(void)printf("Result Call Back Called! Result is: %s \\r\\n",

ENUM\_TO\_STRING(IOTHUB\_CLIENT\_CONFIRMATION\_RESULT, result));

}

The second parameter is a pointer to user context—the same pointer we passed to **IoTHubClient\_SendEventAsync**. In this case this context is a simple counter, but it could be anything you want.

That’s all there is to sending data. The only thing left to cover is how to receive notifications.

## Receiving notifications

Receiving a notification works very similarly to the way notifications work in the **iothub\_client** layer of the SDK. First you register a notification callback function:

IoTHubClient\_SetNotificationCallback(iotHubClientHandle,

IoTHubNotification, Thermostat);

And then you write the callback function that’s invoked when a notification is received:

static IOTHUBMESSAGE\_DISPOSITION\_RESULT IoTHubNotification(

IOTHUB\_MESSAGE\_HANDLE notificationMessage, void\* userContextCallback)

{

IOTHUBMESSAGE\_DISPOSITION\_RESULT result;

const unsigned char\* buffer;

size\_t size;

if (IoTHubMessage\_GetByteArray(notificationMessage, &buffer, &size) !=

IOTHUB\_MESSAGE\_OK)

{

printf("unable to IoTHubMessage\_GetByteArray\\r\\n");

result = EXECUTE\_COMMAND\_ERROR;

}

else

{

/\*buffer is not zero terminated\*/

char\* temp = malloc(size + 1);

if (temp == NULL)

{

printf("failed to malloc\\r\\n");

result = EXECUTE\_COMMAND\_ERROR;

}

else

{

memcpy(temp, buffer, size);

temp[size] = '\\0';

EXECUTE\_COMMAND\_RESULT executeCommandResult =

> EXECUTE\_COMMAND(userContextCallback, temp);

result =

(executeCommandResult == EXECUTE\_COMMAND\_ERROR) ?

> IOTHUBMESSAGE\_ABANDONED :

(executeCommandResult == EXECUTE\_COMMAND\_SUCCESS) ?

> IOTHUBMESSAGE\_ACCEPTED :

IOTHUBMESSAGE\_REJECTED;

free(temp);

}

}

return result;

}

This code is boilerplate meaning it’s the same for any solution. This function receives the notification message and takes care of routing it to the appropriate function through the call to **EXECUTE\_COMMAND**. Basically what function is called at this point depends on the definition of the actions in our model…

When you define an action in your model, you’re required to implement a corresponding function that’s called when your device receives a notification that corresponds to the action. For example, if your model defines this action:

WITH\_ACTION(SetTemperature, int, DesiredTemperature)

You must define a function with this signature:

EXECUTE\_COMMAND\_RESULT SetTemperature(ContosoThermostat505\* device, int DesiredTemperature)

{

(void)device;

(void)printf("Setting home temperature to %d degrees.\\\\r\\\\n", DesiredTemperature);

return EXECUTE\_COMMAND\_SUCCESS;

}

Notice that the name of the function matches the name of the action in the model and that the parameters of the function match the parameters specified for the action.

When the device receives a notification that matches this signature, the corresponding function is called. So aside from having to include the boilerplate code from **IoTHubNotification**, receiving notifications is just a matter of defining a simple function for each action defined in your model.

## Uninitializing the library

When you’re done sending data and receiving notifications, you can uninitialize the IoT library. Do this with the following API calls:

DESTROY\_MODEL\_INSTANCE(Thermostat);

}

IoTHubClient\_Destroy(iotHubClientHandle);

}

serializer\_deinit();

Each of these three functions aligns with the three initialization functions described previously. Calling these APIs ensures that you free previously allocated resources.

## Summary

This article covers the basics of using the libraries in the **Azure IoT Device SDK for C**. It should provide you with enough information to understand what’s included in the SDK, its architecture, and how to get started working with the Windows samples. Future articles will discuss using the SDK on other platforms as well as describe additional capabilities of the libraries.

  [Windows IoT]: http://ms-iot.github.io/content/en-US/GetStarted.htm
  []: media/image1.png
  [1]: media/image2.png
  [doc]: https://github.com/Azure/azure-iot-suite-sdks/tree/master/doc
  [2]: media/image3.png
  [3]: media/image4.png
  [4]: media/image5.png
  [5]: media/image6.png
  [6]: media/image7.png
  [7]: media/image8.png
  [8]: media/image9.png
  [9]: media/image10.png
  [10]: media/image11.png
  [11]: media/image12.png
  [12]: media/image13.png
  [13]: media/image14.png
  [14]: media/image15.png
  [15]: media/image16.png

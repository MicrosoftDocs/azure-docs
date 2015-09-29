<properties
	pageTitle="Introducing the Azure IoT device SDK for C"
	description="Learn about and get started working with the sample code in the Azure IoT device SDK for C"
	services="iot-hub"
	documentationCenter="na"
	authors="MichelBarnett"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="na"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="tbd"
     ms.date="09/29/2015"
     ms.author="michelb"/>

# Introducing the Azure IoT device SDK for C

The **Azure IoT device SDK** is a set of libraries designed to simplify the process of sending events and receiving messages from the **Azure IoT Hub** service. There are different variations of the SDK, each targeting a specific platform, but in this article will focus on introducing the **Azure IoT device SDK for C**.

The Azure IoT device SDK for C is written in ANSI C (C99) to maximize portability.  This makes it well suited to operate on a number of platforms and devices- especially where minimizing disk and memory footprint is a priority.  

There's a broad range of platforms on which the SDK has been tested (see the [SDK documentation](https://github.com/Azure/azure-iot-sdks/tree/master/c) for details).  Although this article includes walkthroughs of sample code running on the *Windows* platform, keep in mind that the code described below is the exactly the same across the range of supported platforms.

In this article you'll be introduced to the architecture of the Azure IoT device SDK for C.  We'll demonstrate how to initialize the device library, send events to IoT Hub as well as receive messages from it. The information in this article should be enough to get your started using the SDK but also provide you pointers where you can get additional information on the libraries.


## SDK architecture

You can find the **Azure IoT device SDK for C** in the following GitHub repository:

[azure-iot-sdks](https://github.com/Azure/azure-iot-sdks)

The latest version of the libraries can be found in the **master** branch of this repository:

  ![](media/iot-hub-device-sdk-c-intro/01-MasterBranch.PNG)

This repository contains the entire family of Azure IoT device SDKs.  But this article is about the Azure IoT device SDK *for C* which can be found in the **c** folder.

  ![](media/iot-hub-device-sdk-c-intro/02-CFolder.PNG)

The core implementation of the SDK can be found in the **common**, **iothub\_client**, and **serializer** folders in the repository. The **common** folder contains shared code used throughout the libraries (typically you don’t use the code in the **common** folder directly). However, the **iothub\_client** and **serializer** folders contain implementations of the two distinct layers of the SDK that you will use in your code.

-   **IoTHubClient** -- The **iothub\_client** folder contains the implementation of the lowest API layer in the library. This layer contains APIs for sending events to IoT Hub as well as receiving messages from it. If you use this layer you are responsible for implementing message serialization, but other details of communicating with IoT Hub are handled for you.

-   **serializer** -- The **serializer** folder contains the implementation of a library that builds on top of **IoTHubClient**. Specifically, the **serializer** library adds modeling capabilities on top of the features provided by **IoTHubClient**. If you use the **serializer** library, you start by defining a model that specifies the events you want to send to IoT Hub as well as the messages you expect to receive from it. But once the model is defined, the SDK provides you an API surface that allows you to easily work with events and messages without having to worry about serialization details.

All of this is easier to understand by looking at some example code. The following sections walk you through a couple of the sample applications that are included in the SDK. This should give you a good feel for the various capabilities of the architectural layers of the SDK as well as an introduction to how the APIs work.

## Before running the samples

Before you can run the samples in the Azure IoT device SDK for C you must complete two tasks: prepare your development environment and obtain device credentials. The [readme file](https://github.com/Azure/azure-iot-sdks/tree/master/c) included with the SDK provides instructions for both tasks.  But the following sections include some additional commentary on those instructions.

### Preparing your development environment

First, you'll need to obtain a copy of the SDK from GitHub and then build the source. You should fetch a copy of the source from the **master** branch of the GitHub repository:

<https://github.com/Azure/azure-iot-sdks>

When you’ve downloaded a copy of the source, there are some steps you need to complete before you run your code.  There's a summary of these steps found in the SDK article titled [Prepare your development environment](https://github.com/Azure/azure-iot-sdks/blob/master/c/doc/devbox_setup.md). Most of the work you'll have to do for Windows involves [building the QPID Proton libraries](https://github.com/Azure/azure-iot-sdks/blob/master/c/doc/devbox_setup.md#rebuilding-the-qpid-proton-library-in-windows). But here are a few tips to help you complete the procedure described in the preparation guide:

-   When you create your **PROTON\_PATH** environment variable, make it a **system** environment variable as shown here:

  ![](media/iot-hub-device-sdk-c-intro/07-EnvironmentVariables.PNG)

-   When you install the **CMake** utility, choose the option to add **CMake** to the system PATH for **all users** (adding to **the current user** works as well):

  ![](media/iot-hub-device-sdk-c-intro/08-CMake.PNG)

-   Be sure to install the correct version of Python. Typically in Windows, you should install the x86 version:

  ![](media/iot-hub-device-sdk-c-intro/09-Python.PNG)

You can use the default options in the installer.

-   Before you open the **Developer Command Prompt for VS2015**, install the *Git command line tools*. To install these tools, complete the following steps:

	1. Launch the **Visual Studio 2015** setup program (or chose **Microsoft Visual Studio 2015** from the **Programs and Features** control panel and select **Change**).
	2. Make sure the **Git for Windows** feature is selected in the installer:
  ![](media/iot-hub-device-sdk-c-intro/10-GitTools.PNG)
	3. Complete the setup wizard to install the tools.
	4. Add the Git tools **bin** directory to the system **PATH** environment variable. On Windows, this looks like the following:
  ![](media/iot-hub-device-sdk-c-intro/11-GitToolsPath.PNG)

When you run the **build\_proton.cmd** script from the command prompt, the script fetches the Proton source from its GitHub repository and then builds the Proton libraries.

When you have completed the previous steps, you can build the Windows samples that rely on AMQP by opening the corresponding Visual Studio solution file and selecting **Build Solution** from the **Build** menu. 

### Obtaining device credentials

Now that your development environment is setup, the last thing to do is to get a set of device credentials.  For a device to be able to access an IoT hub, you must first add the device to the IoT hub device registry. When you add your device you'll get a set of device credentials which you'll need in order for the device to be able to connect to an IoT hub.  The sample applications that we’ll look at in the next section expect these credentials in the form of a **device connection string**.

The [Device Explorer](https://github.com/Azure/azure-iot-sdks/tree/master/tools/DeviceExplorer) tool (included the Azure IoT device SDK) uses the Azure IoT service libraries to perform various functions on IoT Hub—including adding devices. If you use Device Explorer to add a device, you’ll get a corresponding connection string— and this  connection string is what you’ll need to make the sample applications run.

In case you're not already familiar with the process, the following procedure describes how to use Device Explorer to add a device and obtain a device connection string.

Open **[DeviceExplorer.sln](https://github.com/Azure/azure-iot-sdks/blob/master/tools/DeviceExplorer/DeviceExplorer.sln)** in **Visual Studio 2015** and build the solution. When you run the program you’ll see this interface:

  ![](media/iot-hub-device-sdk-c-intro/03-DeviceExplorer.PNG)

Enter your **IoT Hub Connection String** into the first field and click the **Update** button. This configures the tool so that it can communicate with IoT Hub.

Once the IoT Hub connection string is configured click on the **Management** tab:

  ![](media/iot-hub-device-sdk-c-intro/04-ManagementTab.PNG)

This is where you’ll manage the devices registered in your IoT hub.

You can create a device by clicking the **Create** button. A dialog is displayed with a set of keys (primary and secondary) all filled out. All you have to do is enter a **Device ID** and click the **Create** button.

  ![](media/iot-hub-device-sdk-c-intro/05-CreateDevice.PNG)

Once the device is created the Devices list is updated with all registered devices, including the one you just created. If you right click your new device you’ll see this menu:

  ![](media/iot-hub-device-sdk-c-intro/06-RightClickDevice.PNG)

If you choose the **Copy connection string for selected device** option the connection string for your device is copied to the clipboard. Keep a copy of this. You’ll need it when running the sample applications described below.

Once you've completed the steps above, you're ready to start running some code.  The following sections walk you through two of the sample solutions in the Azure device SDK for C that demonstrate the capabilities of the libraries.  Note that both samples described below have a constant at the top of the main source file that allow you to enter a connection string.  For example, here's the corresponding line from the **iothub\_client\_sample\_amqp** application.

```
static const char* connectionString = "[device connection string]";
```

If you want to follow along with the description below, enter your device connection string here, recompile the solution, and you'll be able to run the sample.

## IoTHubClient

Within the **iothub\_client** folder in the azure-iot-sdks repository there is a **samples** folder that contains an application called **iothub\_client\_sample\_amqp**.

The Windows version of the **iothub\_client\_sample\_ampq** application includes the following Visual Studio solution:

  ![](media/iot-hub-device-sdk-c-intro/12-iothub-client-sample-amqp.PNG)

The **iothub\_client\_sample\_amqp** project contains four projects.  The sample code is found in the **iothub_client_sample_amqp project**. But the solution also includes the **common**, **iothub_amqp_transport**, and **iothub\_client** projects from the Azure IoT device SDK for C. You always need the **common** project when you are working with the SDK.  Since this sample relies on AMQP we also need to include the **iothub_amqp_transport** project (there's an equivalent project for HTTP).  And because the sample uses the **IoTHubClient** libraries, we must also include the **iothub_client** project in our solution.

You can find the implementation for the sample application in the **iothub\_client\_sample\_amqp.c** source file:

  ![](media/iot-hub-device-sdk-c-intro/13-iothub_client_sample_amqp_c.PNG)

We'll use this sample application to walk you through what’s required to use the **IoTHubClient** library.


### Initializing the library

To start working with the libraries you must first create an IoT Hub client handle:

```
IOTHUB_CLIENT_HANDLE iotHubClientHandle;
iotHubClientHandle = IoTHubClient_CreateFromConnectionString(connectionString, AMQP_Protocol);
```

Notice that we’re passing a copy of our device connection string to this function (the one we got from Device Explorer). We also designate the protocol that we want to use— we’re using AMQP in this example but HTTP is an option as well.

When you have a valid **IOTHUB\_CLIENT\_HANDLE**, you can start calling the APIs to send events and receive messages from IoT Hub. We’ll look at that next.

### Sending events

Sending events to IoT Hub requires you to complete the following steps:

First, create a message:

```
EVENT_INSTANCE message;
sprintf_s(msgText, sizeof(msgText), "Message_%d_From_IoTHubClient_Over_AMQP", i);
message.messageHandle = IoTHubMessage_CreateFromByteArray((const unsigned char*)msgText, strlen(msgText);
```

Next, send the message:

```
IoTHubClient_SendEventAsync(iotHubClientHandle, message.messageHandle, SendConfirmationCallback, &message);
```

Every time you send a message, you specify a reference to a callback function that’s invoked when the data is sent:

```
static void SendConfirmationCallback(IOTHUB_CLIENT_CONFIRMATION_RESULT result, void* userContextCallback)
{
    EVENT_INSTANCE* eventInstance = (EVENT_INSTANCE*)userContextCallback;
    (void)printf("Confirmation[%d] received for message tracking id = %d with result = %s\r\n", callbackCounter, eventInstance->messageTrackingId, ENUM_TO_STRING(IOTHUB_CLIENT_CONFIRMATION_RESULT, result));
    /* Some device specific action code goes here... */
    callbackCounter++;
    IoTHubMessage_Destroy(eventInstance->messageHandle);
}
```

Notice the call to the **IoTHubMessage\_Destroy** function when you’re done with the message. You must do this to free the resources allocated when you created the message.

### Receiving messages

Receiving a message is an asynchronous operation. First, you register a callback to be invoked when the device receives a message:

```
int receiveContext = 0;
IoTHubClient_SetMessageCallback(iotHubClientHandle, ReceiveMessageCallback, &receiveContext);
```

The last parameter is a void pointer to whatever you want. In the sample, it’s a pointer to an integer but it could be a pointer to a more complex data structure. This enables the callback function to operate on shared state with the caller of this function.

When the device receives a message, the registered callback function is invoked:

```
static IOTHUBMESSAGE_DISPOSITION_RESULT ReceiveMessageCallback(IOTHUB_MESSAGE_HANDLE message, void* userContextCallback)
{
    int* counter = (int*)userContextCallback;
    const char* buffer;
    size_t size;
    if (IoTHubMessage_GetByteArray(message, (const unsigned char**)&buffer, &size) == IOTHUB_MESSAGE_OK)
    {
        (void)printf("Received Message [%d] with Data: <<<%.*s>>> & Size=%d\r\n", *counter, (int)size, buffer, (int)size);
    }

    /* Some device specific action code goes here... */
    (*counter)++;
    return IOTHUBMESSAGE_ACCEPTED;
}
```

Notice how you use the **IoTHubMessage\_GetByteArray** function to retrieve the message, which in this example is a string.

### Uninitializing the library

When you’re done sending events and receiving messages you can uninitialize the IoT library—which is accomplished with the following function call:

```
IoTHubClient_Destroy(iotHubClientHandle);
```

This frees up the resources previously allocated by the **IoTHubClient\_CreateFromConnectionString** function.

As you can see, it’s easy to send events and receive messages with the **IoTHubClient** library. The library takes care of the details of communicating with IoT Hub— including which protocol to use (which from the perspective of the developer is a simple configuration option).

The **IoTHubClient** library also provides you with precise control over how to serialize the events your device sends to IoT Hub. In some cases this is an advantage, but in other cases this is an implementation detail with which you don’t want to be concerned. If that's the case, you might consider using the **serializer** library, which we'll cover next.

## Serializer

Conceptually the **serializer** library sits on top of the **IoTHubClient** library in the SDK. It uses the **IoTHubClient** library for the underlying communication with IoT Hub, but it adds modeling capabilities that remove the burden of dealing with message serialization from the developer. How this library works is best demonstrated by an example.

Within the **serializer** folder in the azure-iot-sdks repository is a **samples** folder that contains an application called **simplesample\_amqp**. The Windows version of this sample includes the following Visual Studio solution:

  ![](media/iot-hub-device-sdk-c-intro/14-simplesample_amqp.PNG)

The sample itself is the **simplesample\_amqp** project. As we've seen previously, the solution includes the **common**, **iothub_amqp_transport**, and **iothub\_client** projects from the Azure IoT device SDK for C. However, this sample solution also includes an extra project called **serializer**: this is the library that adds modeling support on top of the **IoTHubClient** library.

You can find the implementation of the sample application in the **simplesample\_amqp.c** code file:

  ![](media/iot-hub-device-sdk-c-intro/15-simplesample_amqp_c.PNG)

The following sections walk you through the key parts of this sample.

### Initializing the library

To start working with the libraries, you must call the initialization APIs:

```
serializer_init(NULL);

IOTHUB_CLIENT_HANDLE iotHubClientHandle = IoTHubClient_CreateFromConnectionString(connectionString, AMQP_Protocol);

ContosoAnemometer* myWeather = CREATE_MODEL_INSTANCE(WeatherStation, ContosoAnemometer);
```

The call to the **serializer\_init** function is a one-time call used to initialize the underlying library. Then you call the **IoTHubClient\_CreateFromConnectionString** function, which is the same API you saw in the **IoTHubClient** sample. This call sets your device connection string (this is also where you choose the protocol you want to use). Notice that this sample uses AMQP as the transport but you could have used HTTP.

Finally, call the **CREATE\_MODEL\_INSTANCE** function. **WeatherStation** is the namespace of the model and **ContosoAnemometer** is the name of the model. Once the model is defined you can use it to start sending events and receiving messages. But first, it's important to understand what a model is.

### Defining the model

A model in the **serializer** library defines the events that your device can send to IoT Hub and the messages, called *actions* in the modeling language, which it can receive. You define a model using a set of C macros as in the **simplesample\_amqp** sample application:

```
BEGIN_NAMESPACE(WeatherStation);

DECLARE_MODEL(ContosoAnemometer,
WITH_DATA(ascii_char_ptr, DeviceId),
WITH_DATA(double, WindSpeed),
WITH_ACTION(TurnFanOn),
WITH_ACTION(TurnFanOff),
WITH_ACTION(SetAirResistance, int, Position)
);

END_NAMESPACE(WeatherStation);
```

The **BEGIN\_NAMESPACE** and **END\_NAMESPACE** macros both take the namespace of the model as an argument. It’s expected that anything between these macros is the definition of your model(s) and the data structures that the models use.

In this example, there is a single model called **ContosoAnemometer**. This model defines two events that your device can send to IoT Hub: **DeviceId** and **WindSpeed**. It also defines three actions (messages) that your device can receive: **TurnFanOn**, **TurnFanOff**, and **SetAirResistance**. Each event has a type, and each action has a name (and optionally a set of parameters).

The events and actions defined in the model define an API surface that you can use to send events to IoT Hub as well as respond to messages being sent to the device. This is best understood through an example.

### Sending events

The model defines the events that you can send to IoT Hub. In this sample, that means one of the two events defined using the **WITH_DATA** macro. For example, if you want to send a **WindSpeed** event to an IoT Hub, there are a few steps involved in making this happen. The first is to set the data we want to send:

```
myWeather->WindSpeed = 15;
```

The model we defined earlier allows us to do this simply by setting a member of a struct. Next, we need to serialize the event we want to send:

```
unsigned char* destination;
size_t destinationSize;

SERIALIZE(&destination, &destinationSize, myWeather->WindSpeed);
```

This code serializes the event to a buffer (referenced by **destination**). Finally, we’ll send the event to IoT Hub with this code:

```
sendMessage(iotHubClientHandle, destination, destinationSize);
```

This is a helper function in the sample application that sends our serialized event to IoT Hub:

```
static void sendMessage(IOTHUB_CLIENT_HANDLE iotHubClientHandle, const unsigned char* buffer, size_t size)
{
    static unsigned int messageTrackingId;
    IOTHUB_MESSAGE_HANDLE messageHandle = IoTHubMessage_CreateFromByteArray(buffer, size);
    if (messageHandle != NULL)
    {
        if (IoTHubClient_SendEventAsync(iotHubClientHandle, messageHandle, sendCallback, (void*)(uintptr_t)messageTrackingId) != IOTHUB_CLIENT_OK)
        {
            printf("failed to hand over the message to IoTHubClient");
        }
        else
        {
            printf("IoTHubClient accepted the message for delivery\r\n");
        }

        IoTHubMessage_Destroy(messageHandle);
    }
    free((void*)buffer);
    messageTrackingId++;
}
```

This code is very similar to what we saw in the **iothub\_client\_sample\_amqp** application where we created a message from a byte array and then used **IoTHubClient\_SendEventAsync** to send it to IoT Hub. After that we just have to free the message handle and serialized data buffer we allocated earlier.

The second to last parameter of **IoTHubClient\_SendEventAsync** is a reference to a callback function that’s called when the data is successfully sent. Here’s an example of a callback function:

```
void sendCallback(IOTHUB_CLIENT_CONFIRMATION_RESULT result, void* userContextCallback)
{
    int messageTrackingId = (intptr_t)userContextCallback;

    (void)printf("Message Id: %d Received.\r\n", messageTrackingId);

    (void)printf("Result Call Back Called! Result is: %s \r\n", ENUM_TO_STRING(IOTHUB_CLIENT_CONFIRMATION_RESULT, result));
}
```

The second parameter is a pointer to user context— the same pointer we passed to **IoTHubClient\_SendEventAsync**. In this case this context is a simple counter, but it could be anything you want.

That’s all there is to sending events. The only thing left to cover is how to receive messages.

### Receiving messages

Receiving a message works similarly to the way messages work in the **IoTHubClient** library. First you register a message callback function:

```
IoTHubClient_SetMessageCallback(iotHubClientHandle, IoTHubMessage, myWeather)
```

And then you write the callback function that’s invoked when a message is received:

```
static IOTHUBMESSAGE_DISPOSITION_RESULT IoTHubMessage(IOTHUB_MESSAGE_HANDLE message, void* userContextCallback)
{
    IOTHUBMESSAGE_DISPOSITION_RESULT result;
    const unsigned char* buffer;
    size_t size;
    if (IoTHubMessage_GetByteArray(message, &buffer, &size) != IOTHUB_MESSAGE_OK)
    {
        printf("unable to IoTHubMessage_GetByteArray\r\n");
        result = EXECUTE_COMMAND_ERROR;
    }
    else
    {
        /*buffer is not zero terminated*/
        char* temp = malloc(size + 1);
        if (temp == NULL)
        {
            printf("failed to malloc\r\n");
            result = EXECUTE_COMMAND_ERROR;
        }
        else
        {
            memcpy(temp, buffer, size);
            temp[size] = '\0';
            EXECUTE_COMMAND_RESULT executeCommandResult = EXECUTE_COMMAND(userContextCallback, temp);
            result =
                (executeCommandResult == EXECUTE_COMMAND_ERROR) ? IOTHUBMESSAGE_ABANDONED :
                (executeCommandResult == EXECUTE_COMMAND_SUCCESS) ? IOTHUBMESSAGE_ACCEPTED :
                IOTHUBMESSAGE_REJECTED;
            free(temp);
        }
    }
    return result;
}
```

This code is boilerplate- meaning it’s the same for any solution. This function receives the message and takes care of routing it to the appropriate function through the call to **EXECUTE\_COMMAND**. Basically what function is called at this point depends on the definition of the actions in our model…

When you define an action in your model, you’re required to implement a corresponding function that’s called when your device receives a message. For example, if your model defines this action:

```
WITH_ACTION(SetAirResistance, int, Position)
```

You must define a function with this signature:

```
EXECUTE_COMMAND_RESULT SetAirResistance(ContosoAnemometer* device, int Position)
{
    (void)device;
    (void)printf("Setting Air Resistance Position to %d.\r\n", Position);
    return EXECUTE_COMMAND_SUCCESS;
}
```

Notice that the name of the function matches the name of the action in the model and that the parameters of the function match the parameters specified for the action.  The first parameter is always required and contains a pointer to the instance of our model.

When the device receives a message that matches this signature, the corresponding function is called. So aside from having to include the boilerplate code from **IoTHubMessage**, receiving messages is just a matter of defining a simple function for each action defined in your model.

### Uninitializing the library

When you’re done sending data and receiving messages, you can uninitialize the IoT library:

```
        DESTROY_MODEL_INSTANCE(myWeather);
    }
    IoTHubClient_Destroy(iotHubClientHandle);
}
serializer_deinit();
```

Each of these three functions align with the three initialization functions described previously. Calling these APIs ensures that you free previously allocated resources.

## Next Steps

This article covers the basics of using the libraries in the **Azure IoT device SDK for C**. It should provide you with enough information to understand what’s included in the SDK, its architecture, and how to get started working with the Windows samples. The next article continues the description of the SDK by explaining [more about the IoTHubClient library](iot-hub-device-sdk-c-iothubclient.md).


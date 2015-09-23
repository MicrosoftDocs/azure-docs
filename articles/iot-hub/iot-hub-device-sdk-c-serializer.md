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

# Microsoft Azure IoT Device SDK for C – More about Serializer

In a previous article I introduced the **Azure IoT Device SDK for C**. And then I followed that up with a more detailed description of the **IoTHubClient** layer of the SDK. In this article I’ll complete my coverage of the SDK by providing a more detailed description of the remaining component: the **serializer** library.

In my introductory article I described how to use the **serializer** library to send messages to IoT Hub and receive notifications. In this article I’ll extend that discussion by providing a more complete explanation of how to model your data with the **serializer** macro language. I’ll also include more detail about how the library serializes messages (and in some cases how you can control that serialization through the APIs). I’ll also describe some parameters you can modify that determine the size of the models you create.

I’ll wrap-up by revisiting some topics covered in my previous article such as notification and property handling features. But as I’ll explain, those features work the same when you use the **serializer** library as they do with the **IoTHubClient** layer of the SDK.

Everything I describe below is demonstrated in the **serializer** SDK samples. So if you want to follow along, check out the **simplesample\_amqp** and **simplesample\_http** applications that are included in the Azure IoT Device SDK for C.

## The Modeling Language

In my introductory article on the **Azure IoT Device SDK for C** I introduced the modeling language through the example provided in the **simplesample\_amqp** application:

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

As you can see, the modeling language is based on C macros. You always begin your definition with **BEGIN\_NAMESPACE** and always end with **END\_NAMESPACE**. The namespace you provide is up to you but a common convention is to name the namespace for your company or project (in this example, it may have been more appropriate to make the namespace **Contoso**).

What goes inside the namespace are model definitions. In this case there’s a single model for a thermostat. Once again, the model can be named anything but typically this is named for the device or type of data you want to exchange with IoT Hub. In this example, our model is for a thermostat (presumably 505 refers to a model number).

Models contain a definition of the data you can ingress to IoT Hub (the data events) as well as the notifications you can receive from IoT Hub (the actions). As you can see from the example, data events have a type and a name; actions have a name and optional parameters (each with a type).

What’s not demonstrated in this sample are additional data types that are supported by the SDK. I’ll cover that next.

## Supported Data Types

The following data types are supported in models created with the **serializer** library:

| Type                    | Description                            |
|-------------------------|----------------------------------------|
| double                  | double precision floating point number |
| int                     | 32 bit integer                         |
| float                   | single precision floating point number |
| long                    | long integer                           |
| int8\_t                 | 8 bit integer                          |
| int16\_t                | 16 bit integer                         |
| int32\_t                | 32 bit integer                         |
| int64\_t                | 64 bit integer                         |
| bool                    | boolean                                |
| ascii\_char\_ptr        | ASCII string                           |
| EDM\_DATE\_TIME\_OFFSET | date time offset                       |
| EDM\_GUID               | GUID                                   |
| EDM\_BINARY             | binary                                 |
| DECLARE\_STRUCT         | complex data type                      |

Let’s start with the last data type. The DECLARE\_STRUCT allows you to define complex data types-- which are just sets of the other primitive types. This allows us to define a model that looks like this:

DECLARE\_STRUCT(TestType,

double, aDouble,

int, aInt,

float, aFloat,

long, aLong,

int8\_t, aInt8,

uint8\_t, auInt8,

int16\_t, aInt16,

int32\_t, aInt32,

int64\_t, aInt64,

bool, aBool,

ascii\_char\_ptr, aAsciiCharPtr,

EDM\_DATE\_TIME\_OFFSET, aDateTimeOffset,

EDM\_GUID, aGuid,

EDM\_BINARY, aBinary

);

DECLARE\_MODEL(TestModel,

WITH\_DATA(TestType, Test)

);

Our model contains a single data event of type **TestType**. And **TestType** is a complex type that includes a set members—which collectivity demonstrate the primitive types supported by the **serializer** modeling language.

With a model like the one above we can write code to send data to IoT Hub that looks like this:

TestModel\* testModel = CREATE\_MODEL\_INSTANCE(MyThermostat, TestModel);

testModel-\>Test.aDouble = 1.1;

testModel-\>Test.aInt = 2;

testModel-\>Test.aFloat = 3;

testModel-\>Test.aLong = 4;

testModel-\>Test.aInt8 = 5;

testModel-\>Test.auInt8 = 6;

testModel-\>Test.aInt16 = 7;

testModel-\>Test.aInt32 = 8;

testModel-\>Test.aInt64 = 9;

testModel-\>Test.aBool = true;

testModel-\>Test.aAsciiCharPtr = "ascii string 1";

time\_t now;

time(&now);

testModel-\>Test.aDateTimeOffset = GetDateTimeOffset(now);

EDM\_GUID guid = { { 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F } };

testModel-\>Test.aGuid = guid;

unsigned char binaryArray[3] = { 0x01, 0x02, 0x03 };

EDM\_BINARY binaryData = { sizeof(binaryArray), &binaryArray };

testModel-\>Test.aBinary = binaryData;

SendAsync(iotHubClientHandle, (const void\*)&(testModel-\>Test));

Basically we’re assigning a value to every member of the **Test** structure and then calling **SendAsync** to send the **Test** data event to the cloud. **SendAsync** is a helper function that sends a single data event to IoT Hub:

void SendAsync(IOTHUB\_CLIENT\_LL\_HANDLE iotHubClientHandle, const void \*dataEvent)

{

unsigned char\* destination;

size\_t destinationSize;

if (SERIALIZE(&destination, &destinationSize, \*(const unsigned char\*)dataEvent) ==

{

// null terminate the string

char\* destinationAsString = (char\*)malloc(destinationSize + 1);

if (destinationAsString != NULL)

{

memcpy(destinationAsString, destination, destinationSize);

destinationAsString[destinationSize] = '\\0';

IOTHUB\_MESSAGE\_HANDLE messageHandle =

> IoTHubMessage\_CreateFromString(destinationAsString);

if (messageHandle != NULL)

{

IoTHubClient\_SendEventAsync(iotHubClientHandle,

> messageHandle, sendCallback, (void\*)0);

IoTHubMessage\_Destroy(messageHandle);

}

free(destinationAsString);

}

free(destination);

}

}

Basically this function serializes the given data event and sends it to IoT Hub using **IoTHubClient\_SendEventAsync**. I’ve gone over this code in previous articles (**SendAsync** just encapsulates it into a convenient function).

One other helper function I used is called **GetDateTimeOffset**. This function transforms the given time into a value of type **EDM\_DATE\_TIME\_OFFSET**:

EDM\_DATE\_TIME\_OFFSET GetDateTimeOffset(time\_t time)

{

struct tm newTime;

gmtime\_s(&newTime, &time);

EDM\_DATE\_TIME\_OFFSET dateTimeOffset;

dateTimeOffset.dateTime = newTime;

dateTimeOffset.fractionalSecond = 0;

dateTimeOffset.hasFractionalSecond = 0;

dateTimeOffset.hasTimeZone = 0;

dateTimeOffset.timeZoneHour = 0;

dateTimeOffset.timeZoneMinute = 0;

return dateTimeOffset;

}

If we run the code above, the following message is sent to IoT Hub:

{"aDouble":1.100000000000000, "aInt":2, "aFloat":3.000000, "aLong":4, "aInt8":5, "auInt8":6, "aInt16":7, "aInt32":8, "aInt64":9, "aBool":true, "aAsciiCharPtr":"ascii string 1", "aDateTimeOffset":"2015-09-14T21:18:21Z", "aGuid":"00010203-0405-0607-0809-0A0B0C0D0E0F", "aBinary":"AQID"}

Notice the serialization is JSON—which is the format generated by the **serializer** library. Also notice that each member of the serialized JSON object matches the members of the **TestType** that we defined in our model. The values also exactly match those that we used in the code. However, notice that the binary data is base64 encoded—“AQID” is the base64 encoding of {0x01, 0x02, 0x03}.

This example demonstrates the advantage of using the **serializer** library. It allows us to send JSON to the cloud, without having to explicitly deal with serialization in our application. All we have to worry about is setting the values of the data events in our model and then calling simple APIs to send those events to the cloud.

With the information above we can define models that include the range of supported data types—including complex types. And if we wanted to we could even include complex types within other complex types.

But the serialized JSON generated by the example above brings up an important point. *How* we send data with the **serializer** library determines exactly how the JSON is formed. That particular point is what I want to cover next.

## More about Serialization

In the previous section I provided an example of the output generated by the **serializer** library. In this section I want to focus on that topic—explaining how the library serializes data and how you can control that behavior depending on how you use the **serialization** APIs.

In order to facilitate the discussion on serialization I’m going to return to the **simplesample\_amqp** application included with the **serializer** library. But in order to explain this topic further, I’m going to alter the model in that sample. But first I’ll provide a little background on the scenario I’m trying to address.

As in the original sample I still want to model a Thermostat that measures temperature and humidity. But each piece of data is going to be sent to IoT Hub differently. By default, my thermostat will ingress temperature data once every 2 minutes; humidity data will be ingressed once every 15 minutes. When either event is ingressed, it must include a timestamp that signifies the time that the corresponding temperature or humidity was measured.

Given this scenario I want to show two different ways to model the data, and what effect that modeling has on the serialized output.

## Model \#1

I’ll start with this version of the model:

BEGIN\_NAMESPACE(Contoso);

DECLARE\_STRUCT(TemperatureEvent,

int, Temperature,

EDM\_DATE\_TIME\_OFFSET, Time);

DECLARE\_STRUCT(HumidityEvent,

int, Humidity,

EDM\_DATE\_TIME\_OFFSET, Time);

DECLARE\_MODEL(Thermostat,

WITH\_DATA(TemperatureEvent, Temperature),

WITH\_DATA(HumidityEvent, Humidity)

);

END\_NAMESPACE(Contoso);

Notice that my model includes two data events: Temperature and Humidity. But unlike in the original sample the type of each event is a structure defined using **DECLARE\_STRUCT**. **TemperatureEvent** includes a temperature measurement and a timestamp; **HumidityEvent** contains a humidity measurement and a timestamp. This model gives me a natural way to model the data for the scenario I described above. When I send data to the cloud I’ll either send a temperature/timestamp or a humidity/timestamp pair.

When I send a temperature event to the cloud, I can use code like this:

time\_t now;

time(&now);

thermostat-\>Temperature.Temperature = 75;

thermostat-\>Temperature.Time = GetDateTimeOffset(now);

unsigned char\* destination;

size\_t destinationSize;

if (SERIALIZE(&destination, &destinationSize, thermostat-\>Temperature) == IOT\_AGENT\_OK)

{

sendMessage(iotHubClientHandle, destination, destinationSize);

}

I’ll use hard-coded values for temperature and humidity in the sample code but imagine that we’re actually retrieving these values by sampling the corresponding sensors on the thermostat.

The code above uses the **GetDateTimeOffset** helper that I introduced previously. And, for reasons that will become clear later, this code explicitly separates the task of serializing and sending the data. The code above serializes the temperature event into a buffer. And then **sendMessage** is a helper function included in **simplesample\_amqp** that sends the data to IoT Hub:

static void sendMessage(IOTHUB\_CLIENT\_HANDLE iotHubClientHandle,

const unsigned char\* buffer, size\_t size)

{

static unsigned int messageTrackingId;

IOTHUB\_MESSAGE\_HANDLE messageHandle = IoTHubMessage\_CreateFromByteArray(buffer,

size);

if (messageHandle != NULL)

{

IoTHubClient\_SendEventAsync(iotHubClientHandle, messageHandle, sendCallback,

> (void\*)(uintptr\_t)messageTrackingId);

IoTHubMessage\_Destroy(messageHandle);

}

free((void\*)buffer);

}

This code is a subset of the **SendAsync** helper I described in the previous section. So I won’t go over it again here.

When we run the previous code to send the Temperature event, this message is sent to IoT Hub:

{"Temperature":75, "Time":"2015-09-17T18:45:56Z"}

We’re sending a temperature which is of type **TemperatureEvent** and that struct contains a **Temperature** and **Time** member. This is directly reflected in the serialized data. No surprises here.

Likewise we can send humidity data with this code:

thermostat-\>Humidity.Humidity = 45;

thermostat-\>Humidity.Time = GetDateTimeOffset(now);

if (SERIALIZE(&destination, &destinationSize, thermostat-\>Humidity) == IOT\_AGENT\_OK)

{

sendMessage(iotHubClientHandle, destination, destinationSize);

}

And the data that’s sent to IoT Hub looks like this:

{"Humidity":45, "Time":"2015-09-17T18:45:56Z"}

Again, this is as expected.

With the model above you can imagine how additional events could easily be added—you just define more structures using **DECLARE\_STRUCT**, and include the corresponding event in the model using **WITH\_DATA**. But now let’s modify the model so that it includes the same data but has a different structure.

## Model \#2

Consider this model as the one we choose to implement the same scenario I described earlier:

DECLARE\_MODEL(Thermostat,

WITH\_DATA(int, Temperature),

WITH\_DATA(int, Humidity),

WITH\_DATA(EDM\_DATE\_TIME\_OFFSET, Time)

);

This is more like the original model in the **simplesample\_amqp** application. In fact the definitions of the **Temperature** and **Humidity** data events are exactly the same. The main difference is the addition of the **Time** data event.

Just for the moment let’s ignore the **Time** data event. And with that aside, here’s the code to ingress **Temperature**:

time\_t now;

time(&now);

thermostat-\>Temperature = 75;

unsigned char\* destination;

size\_t destinationSize;

if (SERIALIZE(&destination, &destinationSize, thermostat-\>Temperature) == IOT\_AGENT\_OK)

{

sendMessage(iotHubClientHandle, destination, destinationSize);

}

This code sends the following data to IoT Hub:

{"Temperature":75}

And the code for sending the Humidity data event looks like this:

thermostat-\>Humidity = 45;

if (SERIALIZE(&destination, &destinationSize, thermostat-\>Humidity) == IOT\_AGENT\_OK)

{

sendMessage(iotHubClientHandle, destination, destinationSize);

}

This code sends this data to IoT Hub:

{"Humidity":45}

So far there’s still no surprises. But this is where that may change…

The **SERIALIZE** macro can take multiple data events as arguments. This allows us to serialize the **Temperature** and **Humidity** event together and send them to IoT Hub in one call:

if (SERIALIZE(&destination, &destinationSize, thermostat-\>Temperature,

thermostat-\>Humidity) == IOT\_AGENT\_OK)

{

sendMessage(iotHubClientHandle, destination, destinationSize);

}

Some may guess that the result of this code is that two data events are sent to IoT Hub:

[

{"Temperature":75},

{"Humidity":45}

]

In other words, you might expect that this code is the same as sending **Temperature** and **Humidity** separately—it’s just a convenience to pass both events to **SERIALIZE** in the same call. However, that’s not the case. Instead, the code above sends this single data event to IoT Hub:

{"Temperature":75, "Humidity":45}

This may seem strange because our model defines **Temperature** and **Humidity** as two *separate* events:

DECLARE\_MODEL(Thermostat,

WITH\_DATA(int, Temperature),

WITH\_DATA(int, Humidity),

WITH\_DATA(EDM\_DATE\_TIME\_OFFSET, Time)

);

More to the point, we didn’t model these events where Temperature and Humidity are in the same structure:

DECLARE\_STRUCT(TemperatureAndHumidityEvent,

int, Temperature,

int, Humidity,

);

DECLARE\_MODEL(Thermostat,

WITH\_DATA(TemperatureAndHumidityEvent, TemperatureAndHumidity),

);

If we used this model, it would be easier to understand how Temperature and Humidity would be sent in the same serialized message. But it’s not clear why it works that way when you pass both data events to SERIALIZE using model \#2.

This behavior is easier to understand if you know the assumptions that the serializer library is making. To make sense of this let’s go back to our model:

DECLARE\_MODEL(Thermostat,

WITH\_DATA(int, Temperature),

WITH\_DATA(int, Humidity),

WITH\_DATA(EDM\_DATE\_TIME\_OFFSET, Time)

);

Think of this model in object-oriented terms. In this case we’re modeling a physical device (a Thermostat) and that device includes attributes like **Temperature** and **Humidity**.

If we want we can send the entire state of our model with code such as this:

if (SERIALIZE(&destination, &destinationSize, thermostat-\>Temperature,

thermostat-\>Humidity, thermostat-\>Time) == IOT\_AGENT\_OK)

{

sendMessage(iotHubClientHandle, destination, destinationSize);

}

Assuming the values of Temperature, Humidity and Time are set, we would see a message like this sent to IoT Hub:

{"Temperature":75, "Humidity":45, "Time":"2015-09-17T18:45:56Z"}

But many times you may only want to send some properties of the model to the cloud (this is especially true if your model contains a large number of data events). That’s where it’s useful to send only a subset of data events such as in our earlier example:

{"Temperature":75, "Time":"2015-09-17T18:45:56Z"}

This generates exactly the same serialized message as if we had defined a **TemperatureEvent** with a **Temperature** and **Time** member—just as we did with model \#1. But we were able to generate exactly the same serialized message by using a different model (model \#2) just because we called **SERIALIZE** in a different way.

The takeaway here is that if you pass multiple data events to **SERIALIZE,** then it assumes each data event is a property in a single JSON object.

Which approach is best depends on you and how you think about your model. If your mindset is that you’re sending “events” to the cloud and each event contains a defined set of properties, then the first approach makes a lot of sense. In that case you would use **DECLARE\_STRUCT** to define the structure of each event and then include them in your model with the **WITH\_DATA** macro. Then you send each event as we did in the first example above. In this approach you would only ever pass a single data event to **SERIALIZER**.

If you think about your model in an object-oriented fashion where the elements defined using WITH\_DATA are the “properties” of that object, then the second approach makes more sense. In this case you pass whatever subset of data events to **SERIALIZE** that you like—depending on how much of your “object’s” state you want to send to the cloud.

Nether approach is right or wrong. Just be aware of how the **serializer** library works, and pick the modeling approach that best suits your needs.

Everything I’ve described so far explains how modeling works in the **serializer** library. But there are parameters you can configure that control how large your model is. I’ll cover that next.

## Macro Configuration

If you’re using the **Serializer** library an important part of the code base to be aware of is found here:

> .\\c\\common\\tools\\macro\_utils\_h\_generator.

This folder contains a Visual Studio solution called **macro\_utils\_h\_generator.sln**:

![][]
The program in this solution generates the **macro\_utils.h** file found in the .\\c\\common\\inc directory. There’s a default macro\_utils.h file included with the SDK. But this solution allows you to modify parameters used to generate this file and then recreate the header file based on these parameters.

The two key parameters you need to be concerned with are **nArithmetic** and **nMacroParameters** which are defined in these two lines found in macro\_utils.tt:

\<\#int nArithmetic=1024;\#\>

\<\#int nMacroParameters=124;/\*127 parameters in one macro deﬁnition in C99 in chapter 5.2.4.1 Translation limits\*/\#\>

The values above are the default parameters included with the SDK. Each parameter has the following meaning:

-   nArithmetic – TBD

-   nMacroParameters – Controls how many parameters you can have in one DECLARE\_MODEL macro definition.

The reason these parameters are important is because they govern how large your model can be. For example, take this model definition:

DECLARE\_MODEL(MyModel,

WITH\_DATA(int, MyData)

);

As mentioned before, **DECLARE\_MODEL** is just a C macro. The name of the model and the **WITH\_DATA** statement (yet another macro) are parameters of **DECLARE\_MODEL**. **nMacroParameters** defines how many parameters can be included in **DECLARE\_MODEL**. Effectively this defines how many data event and action declarations you can have.

So with the default limit of 124 this means that you’ll be able to define a model with a combination of about 60 actions and data events. If you try to exceed this limit you’ll get compiler errors that looks like this:

![][1]

If you want to change these parameters, then modify the values in the macro\_utils.tt file, recompile the macro\_utils\_h\_generator.sln solution, and run the compiled program. When you do so, a new macro\_utils.h file is generated and placed in the .\\common\\inc directory.

The main thing to be aware of is that increasing these values high enough may exceed compiler limits. With this in mind **nMacroParameters** is the main parameter to be concerned with. The C99 spec specifies that a maximum of 127 parameters are allowed in a macro definition. The Microsoft compiler happens to follow the spec in this regard so you won’t be able to increase **nMacroParameters** beyond the default. But other compilers may allow you to do so (for example, the GNU compiler supports a higher limit).

So far I’ve covered just about everything you need to know to write code with the **serializer** library. Before I wrap-up I want to revisit some topics from previous articles that you may be wondering about. I’ll start with the lower level APIs.

## The Lower Level APIs

The sample application that I’ve focused on in this article is **simplesample\_amqp**. This sample uses the higher level (the non-“LL”) APIs to send data and receive notifications. This means a background thread is running which takes care of both of these activities. However, if we want we can use the lower level (LL) APIs to eliminate this background thread and take explicit control over when we send data or receive notifications from the cloud.

As I described in my previous article there are set of functions that consist of the higher level APIs:

-   IoTHubClient\_CreateFromConnectionString

-   IoTHubClient\_SendEventAsync

-   IoTHubClient\_SetNotificationCallback

-   IoTHubClient\_Destroy

These APIs are demonstrated in **simplesample\_amqp**. But as I discussed in my previous article there are an analogous set of lower level APIs.

-   IoTHubClient\_LL\_CreateFromConnectionString

-   IoTHubClient\_LL\_SendEventAsync

-   IoTHubClient\_LL\_SetNotificationCallback

-   IoTHubClient\_LL\_Destroy

The point I want to make here is that these lower level APIs work exactly the same as I described in my previous article. You can use the first set of APIs if you want a background thread to handle sending data and receiving notifications. And you’ll use the second set of APIs if you want explicit control over when you send data and receive notifications. Either set of APIs work equally well with the **serializer** library.

For an example of how the lower level APIs are used with the **serializer** library see the **simplesample\_http** application. And for a more detailed explanation of each API see my previous article.

**Other Topics **

A few other topics I want to mention again are property handling, notification handling, using alternate device credentials, and configuration options. These are all topics I covered in my previous article. Similar to the lower level APIs the main point I want to make here is that all of these features work the same with the **serializer** library as they do with the **IoTHubClient library**. For example, if you want to attach properties to an event from your model, you’ll use **IoTHubMessage\_Properties** and **Map**\_**AddorUpdate** the same way I’ve described previously:

MAP\_HANDLE propMap = IoTHubMessage\_Properties(message.messageHandle);

sprintf\_s(propText, sizeof(propText), "%d", i);

Map\_AddOrUpdate(propMap, "SequenceNumber", propText);

Whether the event was generated from the **serializer** library or hand-crafted using the IoTHubClient library doesn’t matter.

Likewise, notification handling works just as I described in my introductory article. We just use **IoTHubClient\_SetNotificationCallback** to register a callback function. And the boilerplate code found in the **IoTHubNotification** function (demonstrated in the simplesample apps) maps the incoming notification to a function representing one of the actions in our model.

As for the alternate device credentials, using **IoTHubClient\_LL\_Create** works just as well as **IoTHubClient\_CreateFromConnectionString** for creating an **IOTHUB\_CLIENT\_HANDLE**.

Finally, if you’re using the **serializer** library, you can set configuration options with **IoTHubClient\_LL\_SetOption** just as you did when using **IoTHubClient** library.

One minor feature that is unique to the **serializer** library are the initialization APIs. Before you can start working with the library you need to call **serializer\_init**:

serializer\_init(NULL);

This is done just before you call **IoTHubClient\_CreateFromConnectionString**.

Likewise, when you’re done working with the library the last call you’ll normally make is to **serializer\_deinit**:

serializer\_deinit();

Otherwise all of the other features I list above work the same in the **serializer** library as they do in the **IoTHubClient** library. For more detail on any of these topics see my previous article.

**Summary**

This article goes into detail on the unique aspects of the **serializer** layer of the **Azure IoT Device SDK for C**. With the information I’ve provided you should have a good understanding of how to use models to send data and receive notifications from IoT Hub.

This concludes my three part series on how to develop applications with the **Azure IoT Device SDK for C**. This should be enough information to not only get you started but give you a pretty thorough understanding of how the APIs work. If you’re still looking for additional detail, there are a few samples in the SDK that I didn’t cover. And the SDK includes source code for all of the libraries that I described—and that’s always the definitive source for how the SDK really works.

  []: media/image1.png
  [1]: media/image2.png

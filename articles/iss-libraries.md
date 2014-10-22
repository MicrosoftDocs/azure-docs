<properties title="Connect your device application to ISS by using the ISS agent libraries" pageTitle="Connect your device application to ISS by using the ISS agent libraries" description="Connect your device application to ISS by using the ISS agent libraries." metaKeywords="Intelligent Systems,ISS,IoT,develop,connect" services="intelligent-systems" solutions="" documentationCenter="" authors="kevinasg" manager="jillfra" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="multiple" ms.topic="article" ms.tgt_pltfrm="multiple" ms.workload="tbd" ms.date="11/13/2014" ms.author="kevinasg" ms.prod="azure">


#Connect your device application to ISS by using the ISS client libraries
In order to connect your devices to your Azure Intelligent Systems Service (ISS) account, the devices must be able to send data to ISS and receive commands from ISS. While you can write your own code to use the REST APIs to get your devices to communicate with ISS, it requires knowledge of several technologies, including HTTP protocols, Microsoft Azure Service Bus topics and queues, OData, and Unity.  

Fortunately, Microsoft Azure provides several ISS client libraries that you can use in an application on your device to simplify connecting your device to ISS.  

These ISS client libraries provide a bi-directional secure channel to ISS and simplify the following key tasks related to managing groups of devices:  

-	Easy to write code to define a data model for your device that contains the structure of the information that the device can send and receive from ISS.
-	Easy to register instances of devices that implement a data model.
-	Easy to invoke actions on devices to manage device operation.
-	Easy to communicate device state changes and device events to ISS for use in reporting and data analytics applications.  

This topic describes how to use the ISS client libraries in your device application.  

##Choose the development language for your device
The ISS agent libraries are available in the following formats:  

-	C# ISS client libraries for use with .NET Framework version 4
-	C ISS client libraries for Windows
-	C ISS client libraries for Linux
-	C ISS client libraries for Windows Embedded CE 6.0
-	C ISS client libraries for Windows Embedded Compact 2013  

In addition, source code is available for the C ISS client libraries, and they can be ported to additional platforms that support the C language.  

##Design the data model for your device
A data model represents the data that a device can send, and the actions that a device can be requested to perform. Before you can write your application, you must first design the data model for your device.  

A data model for ISS contains state, events, and actions.  

###State
The state of a device is defined as the collection of discrete data that the device can capture. Device state is implemented as a collection of properties. Think of properties as data that you can query the device for at any given time.  

A property can be a simple value, a complex value composed of multiple parts, or a reference to another data model. A single property should contain enough information to be a useful and complete piece of data by itself. Your application can send individual properties to ISS, but cannot send parts of a complex property; it must send the entire property.  

If the property is a reference to another data model, you can choose to send the individual properties of that data model's state.  

In ISS, state values represent persistent data provided by a device, and you can define rule sets to compare previous values of a property against the current values of a property.  

>[AZURE.NOTE] ISS currently does not support data models that contain state models with more than 120 simple data fields, including any fields that exist in complex properties; or in the state of any referenced data models including events and alarms. Note that the C agent will only support 61 members in the structures. For example, if a device state contained an integer property and a complex property that consisted of a string value and another integer, the device state would consist of 3 simple data fields.   

###Events
An event occurs when your device needs to notify ISS about something happening, such as a change in state or as a response to an external trigger. When designing your data model, consider what events are useful to track. An event can contain data that indicated what triggered the event, or what the new state of the device is as a result of the event. For example, if a device moves its physical location, it might send a DeviceMoved event that also contains information about the new location.  

In ISS, you can define rule sets to react to an event; however a rule set cannot compare events with previous events that have occurred.  

>[AZURE.NOTE] ISS currently does not support events that contain more than 120 simple data fields. Note that the C agent will only support 61 members in the structures.  

###Alarms
If an event can be acted upon by an operator, you can use a special type of event called an alarm. In addition to any other data, an alarm also contains a severity which indicates a relative priority of the alarm. ISS handles alarms differently than non-alarm events. ISS tracks the state of the alarm, which can be active, ignored, or closed, and also exposes alarm information through the management endpoint, which allows a remote operator to review and update alarms by using a management portal. ISS also tracks how many times an alarm has been raised by a device since the alarm was last closed.

###Actions
An action is a command to your device that can be remotely invoked by an operator by using ISS, or as a result of a rule set. For example, your device might be able to receive a command from ISS to change its state from non-debug to debug mode in order to receive additional diagnostic information data from the device.

###Composite models
A model can also contain sub models, each with their own states, events, and commands, as well as potentially their own sub models. The state of a model includes all the states of its sub models as well.  

A composite model allows you to model a device that is a composed of several other devices or systems, each of which can have their own data model. For example, a car is composed of many systems and parts. You might define one data model for the engine, one for the braking system, one for the entertainment system, and another model for the exhaust system. Each of these data models has their own state, events, and actions. You can then define a data model for a car that contains references to each of those data models, and the state of the car includes the state of each of the component systems.  

You can define a composite model by defining a root model that contains properties that are references to other models.  

>[AZURE.NOTE] Currently, only the managed C# libraries support the ability to implement composite models.

##Create your device application
Before you can implement your data model, you must create an application that includes the ISS client libraries. You may be able to modify an existing application on the device to use the ISS agent client libraries.  

##Implement your data model in your application
Once you have defined your data model, you must then implement the data model in your device application. The actual implementation of your data model varies depending on if you are using the managed C# libraries or the native C libraries, but the development work flow is similar.

###Define complex property types, events, and alarms
Before you can implement your data model, you must define any complex property types, events, and alarms that are used by your data model.

###Define model definitions
You must create an interface or structure that represents your data model, which defines the state (properties), events, actions, and sub models. Every data model must define the root model, which is the data model that represents the entire device.

##Implement your data model
Next, you need to create an implementation of your data model. Your device object must implement the data model that you defined earlier. This includes implementing the code for the actions that you defined in the data model.  

Your device object can include additional properties and methods beyond what is defined in the data model; however you will not be able to send those properties directly to ISS. For example, your device object may contain methods to start a timer for periodically sending data to ISS.  

If you are writing a managed C# application, your application must create an object that is an instance of your device. Your application can use this object to keep track of the state of the device, send events and alarms, and respond to actions that have been invoked on the device by ISS.  

##Generate and upload the schema for your data model
The next step is to validate that you implemented your data model correctly by generating a schema for your data model and uploading the schema to ISS. Once you have generated and uploaded the schema for the data model, you do not need to do this again unless the data model changes.  

During development, the schema is tagged as a scratch schema, which means that uploading the schema a second time deletes any previous implementations of the schema, along with any device registrations, alarms, and data that may have already been sent to ISS. You can only register 5 devices to a scratch schema.  

Since you only need to generate and upload the schema once for each revision of the data model, you may want to add a command line option to tell your application to generate an upload the schema, or you can port your data model to a separate application that handles the schema generation and upload to ISS.  

If your ISS account does not contain the schema for your data model, your device will not be able to send data to ISS.  

##Register your device and start the ISS agent.
Next, you must create an instance of the ISS agent and register your device with the ISS agent. When you register your device with the ISS agent, you must provide the name of your device.  

After you register your device with the ISS agent, you can then start the agent.  

Since the ISS agent can take a few seconds to start up and register your device with ISS, you want to make sure the ISS agent is ready to receive data before you start sending data and events. You can do this by specifying a method callback that the ISS agent calls when registration is complete.  

When you register your device to your ISS account, you receive a device security token that you can use to authenticate that device.  

##Send device state and events to ISS
Once the ISS agent has successfully started and registered your device, your application can start sending state data, notify about events, and respond to action invocations.  

###Send the device state to ISS
You can send the entire state of your device to ISS in a single API call, or you can send one or more individual properties to ISS in a single API call. If your device uses a composite data model, the state of all referenced data models is considered part of the state of your device.

###Notify ISS about events
You can notify ISS about an event or alarm in a single API call. If your device needs to notify ISS about several events and alarms, you must have a separate notify API call for each event and alarm.

##Develop
To create an ISS agent using the C# ISS client libraries, see [Developer guide for managed ISS client libraries](./iss-C#-dev-guide.md). To create an ISS agent using the C ISSclient libraries, see [Developer guide for C client libraries]().

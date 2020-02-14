---
# Mandatory fields.
title: What is Azure Digital Twins?
description: Overview of when you should use Azure Digital Twins, and what you can do with it.
author: philmea
ms.author: philmea # Microsoft employees only
ms.date: 2/12/2020
ms.topic: overview
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---
# What is Azure Digital Twins?

*CORE VALUE PROP
What is Azure Digital Twins
Azure Digital Twins (ADT) is a developer platform for next-generation IoT solutions. With Azure Digital Twins, you can quickly and cost-effectively create digital models of your business environment and drive these models with real time data from IoT and other data sources.
Using ADT’s flexible modeling system, you can use digital twins to represent factory floors, bulk manufacturing processes in chemistry, buildings, construction or energy grids. Digital Twins-based IoT solutions can support remote monitoring, maintenance, prediction, forecasting, simulation and optimization of operations. 
 
ADT does a lot of the hard work of translating a device-centric view of the world into always-up-to-date business-focused insights, allowing you to focus on your business problems instead of complex distributed systems infrastructure. Digital twins deliver a live operational state model of your environment, driven and kept current by data from IoT and other data sources.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*Needed: Applicable scenarios

*Needed: Compare to other IoT solutions
    - When to use what solution? What is ADT niche?​

    - Clear message of relationship with IoT Central – if you need a pre-built ​

    - Positioning with IoT Hub – if you have developer skills / experience​

    - See https://docs.microsoft.com/en-us/azure/digital-twins/about-digital-twins#azure-digital-twins-in-the-context-of-other-iot-services

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

*CORE FEATURES/CAPABILITIES
Azure Digital Twins Scope
The Azure Digital Twins service is a Platform-as-a-Service (PaaS) offering that lets you create, run and manage your digital twins securely and efficiently in the cloud. ADT allows you to: 
	Model your real-world business environment.
With ADT, you can define twin types that represent the things, places and people in your physical environment, as well as the relationships between them. You can think of these types as a custom vocabulary to describe your business. Twin types are expressed in terms of properties (that represent the persistent state of your twins), telemetry events, commands, relationships and components.
For a building management solution, for instance, you might define types such as “building”, “floor”, “room”, “elevator” and “HVAC system”.
Once you have defined the vocabulary for your business, you can model your concrete environment by creating a graph of twins from the types you previously defined.  
For example, using the simple vocabulary from the previous paragraph, you can create a model that represent the office building you are in. 
The arrows in the illustration below show different semantic relationships between the twins in the model. For example, the Building “contains” three floors, and each floor contains several rooms. The building also “is-equipped-with” an HVAC system and an elevator. The HVAC system “cools” specific floors. You can think of the twin types as nouns in a description of your world, and the relationships as verbs.
 
	Process incoming data and propagate state through the Digital Twins Graph
Digital Twins models are meant to be live, up-to-date representations of the state of the real world – or of simulations thereof. To keep twins updated, Digital Twins provides a comprehensive event processing system. You can, for example, provide event handlers to process incoming telemetry from devices, state changes within your ADT graph, or life cycle events generated when twins are created or modified. ADT provides a convenient data processing framework for you to apply custom code to incoming data streams of IoT and business data. 
You might, for example, use event handlers to:
	Compute properties on a twin from sensor input (e.g. aggregate data from temperature, CO2, humidity and noise sensors into a comfort property on a “room” twin)
	Propagate state through the ADT graph (e.g. calculate an average comfort for a floor in a building when the comfort property of any of the rooms on the floor changes)
	Apply complex external simulation or machine learning processors (e.g. to calculate the energy efficiency of a wind turbine based on current operational parameters)
	Route data to downstream destination (e.g. to store for long-term bulk analytics, or to trigger workflow integrations).   
	Query the model of your environment to answer business questions
Once you have created a graph of twins, you can run queries against the twins, their state and their relationships. Depending on the state information you modeled and the sensors you have connected to drive your model, queries might be used to answer a broad range of questions about your model, such as:
	Which zones or floors in building 7 are warmer than 75 degrees F? 
	Which campus is meeting room 47 in?
	Which power station has surplus capacity that is accessible to a particular customer?   
	Manage access
Using fine-grained, twin-level access control, you can define the policies for data access in ADT.
	Integrate with IoT Hub for device-centric scenarios
ADT will automatically mirror devices connected to an attached IoT Hub into your ADT graph. For PnP devices, it will also automatically replicate their state and proxy their commands, so that you can program against devices in virtually exactly the same way you program against all other twins.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

*Needed: Key integration technologies

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

*COMPARE TO ADT V1
ADT: Differences from Public Preview 1
This section assumes that you have experience with the previous public preview of ADT, released in October 2018. The new version of ADT, as described in this document, marks a significant departure from the previous architecture. While all the core concepts are still the same, the developer interfaces and APIs are different, and the service provides much improved capabilities and flexibility. The changes were strongly motivated by customer feedback. 
The main changes are:
	Free Modeling of Twin Types and Topology. ADT Public Preview 1 (ADT PP1) evolved from a solution designed for building management and came with a built-in vocabulary for building management. Twins could be connected using hierarchical relationships, effectively creating a tree topology. 
Customers expressed great interest in applying the Digital Twins design pattern to a much broader set of business solutions. In response, the new ADT preview provides a modeling environment that lets you define your own custom vocabulary (your own custom twin types) for your solution – out of the box, ADT is completely domain agnostic. In addition, the individual digital twins you define can be connected into arbitrary graph topologies, giving you much more flexibility to express the complex relationships that prevail in real world environments.
	Flexible Compute and Event Processing Model. ADT PP1 had a compute model that relied on JavaScript UDFs. Based on customer feedback, this model has been replaced with a new compute model that relies on external, customer-provided processing such as Azure Functions. The enables developers to:
	Use a programming language of their choice 
	Access custom code libraries without restriction
	With supported serverless compute platforms such as Azure Functions, have access to a robust development and debugging story
	Take advantage of a flexible event processing and routing model throughout the platform   
	Full access to IoT Hub. In ADT PP1, IoT Hub was integrated into ADT, and not fully accessible to developers. In the new version of ADT, you bring your own IoT Hub and attach it to ADT. This leaves you in full control of all device management and gives you full access to IoT Hub’s capabilities. ADT automatically reflects PnP devices connected to IoT Hub into the Digital Twins graph.
	Greater Scale. The new version of ADT is designed to run at greater scale.
ADT: A Simple Example
In hospitals, it is crucial that medical personnel wash their hands regularly. However, actual compliance with hand-washing policies is traditionally hard to measure. Using IoT technology, a hospital aims to solve multiple business problems at once:
	Measure compliance with hand washing policies to control spread of germs
	Make sure that sanitation equipment and soap and towel dispensers are always filled and operational
	Reduce maintenance costs, by making sure that only sanitation equipment that needs maintenance is visited by facilities management for repair or refill
	Collect long term data about the aggregate behavior of medical personnel that can be used for research, with the goal of designing more effective policies that can protect patients and providers alike
The desired solution provides a dashboard that can display current and historical information for each patient room, as well as roll-ups for each ward in the hospital, each floor, and the hospital as a whole. A separate dashboard informs maintenance staff about device operability as well as requests for refills, etc.
From an IoT perspective, the solution is built around motion sensors that can detect and count people traffic into and out of patient rooms, as well as sensors that can check the fill status of soap and towel dispensers. The data collected by the sensors might also be correlated with scheduling information originating from a different business system.
[TBA – add block diagram that shows the concepts from a biz perspective]
The following sections are intended to give you a first taste of the artifacts that make up an ADT solution. We will discuss details as we progress.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

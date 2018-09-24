---
title: Data processing and user-defined functions with Azure Digital Twins| Microsoft Docs
description: Overview of data processing, matchers and user-defined functions with Azure Digital Twins
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: alinast
---

# Data processing and User-Defined Functions

Once devices are sending telemetry data to Digital Twins, data processing can take place. This processing takes place in four phases: _parse_, _match_, _compute_, and _dispatch_: 

![Digital Twins Data Processing Flow][1]

1. The parse phase involves transforming incoming telemetry message to a commonly understood [`data transfer object`](https://en.wikipedia.org/wiki/Data_transfer_object) format. Device and sensor validation are executed.
1. The match phase uses the device and sensor information to match the telemetry message with an appropriate User-Defined Function. 
1. The compute phase runs any selected User-Defined Function. It could read spatial graph nodes, update it with computed values and dispatching the notifications to next step.
1. Finally, the dispatch step enqueues notifications and actions to the Dispatcher service.

A `User-Defined Function` (**UDF**) is a custom JavaScript function that runs within an isolated environment and has access both to the sensor telemetry message as it was received, as well as to the graph and dispatcher service.  When new telemetry from a sensor is received, a UDF may choose to calculate a moving average of the last few sensor readings, for instance. Once the UDF is registered within the graph, a matcher must be created to specify when to run the UDF.  A matcher specifies a condition on which to run a specific UDF.
 
The role assignments of the UDF is what tells Digital Twins system which data the UDF itself can access. This access is checked at the time that the UDF code itself asks the graph for data. The matchers are responsible for deciding whether to invoke an UDF for a given piece of sensor telemetry, and this is checked when we receive the telemetry but before the UDF execution has begun.  
 
It is possible, for example, for a matcher to invoke a UDF that has no role assignments which would mean it would fail to read any data from the graph. It is also possible to give a UDF access to the whole graph but fail to be invoked because it has no appropriate matcher for a given piece of telemetry.


<!-- Images -->
[1]: media/concepts/digital-twins-data-processing-flow.png

<!-- ## Next steps

Read more about how to create User-Defined Functions:

> [!div class="nextstepaction"]
> [How to create User-Defined Functions](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-javascript-user-defined-functions) -->

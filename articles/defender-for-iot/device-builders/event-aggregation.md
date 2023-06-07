---
title: Defender-IoT-micro-agent legacy event aggregation
description: Learn about Defender for IoT event aggregation.
ms.topic: conceptual
ms.date: 03/28/2022
---

# Defender-IoT-micro-agent legacy event aggregation

Defender for IoT security agents collects data and system events from your local device and send this data to the Azure cloud for processing and analytics. The security agent collects many types of device events including new process and new connection events. Both new process and new connection events may legitimately occur frequently on a device within a second, and while important for robust and comprehensive security, the number of messages the security agents are forced to send may quickly reach or exceed your IoT Hub quota and cost limits. However, these events contain highly valuable security information that is crucial to protecting your device.

To reduce the extra quota, and costs while keeping your devices protected, Defender for IoT Agents aggregates these types of events.

Event aggregation is **On** by default, and although not recommended, can be manually turned **Off** at any time.

Aggregation is currently available for the following types of events:

* ProcessCreate
* ConnectionCreate
* ProcessTerminate (Windows only)

## How does event aggregation work?

When event aggregation is left **On**, Defender for IoT agents aggregate events for the interval period or time window.
Once the interval period has passed, the agent sends the aggregated events to the Azure cloud for further analysis.
The aggregated events are stored in memory until being sent to the Azure cloud.

To reduce the memory footprint of the agent, whenever the agent collects an identical event to one that is already being kept in memory, the agent increases the hit count of this specific event. When the aggregation time window passes, the agent sends the hit count of each specific type of event that occurred. Event aggregation is simply the aggregation of the hit counts of each collected type of event.

Events are considered identical only when the following conditions are met:

* ProcessCreate events - when **commandLine**, **executable**, **username**, and **userid** are identical
* ConnectionCreate events - when **commandLine**, **userId**, **direction**, **local address**, **remote address**, **protocol**, and **destination port** are identical.
* ProcessTerminate events - when **executable** and **exit status** are identical

### Working with aggregated events

During aggregation, event properties that are not aggregated are discarded, and appear in log analytics with a value of 0.

* ProcessCreate events - **processId**, and **parentProcessId** are set to 0
* ConnectionCreate events - **processId**, and **source port** are set to 0

## Event aggregation-based alerts

After analysis, Defender for IoT creates security alerts for suspicious aggregated events. Alerts created from aggregated events appear only once for each aggregated event.

Aggregation start time, end time, and hit count for each event are logged in the event **ExtraDetails** field within Log Analytics for use during investigations.

Each aggregated event represents a 24-hour period of collected alerts. Using the event options menu on the upper left of each event, you can **dismiss** each individual aggregated event.

## Event aggregation twin configuration

Make changes to the configuration of Defender for IoT event aggregation inside the [agent configuration object](how-to-agent-configuration.md) of the module twin identity of the **azureiotsecurity** module.

| Configuration name | Possible values | Details | Remarks |
|:-----------|:---------------|:--------|:--------|
| aggregationEnabledProcessCreate | boolean | Enable / disable event aggregation for process create events |
| aggregationIntervalProcessCreate | ISO8601 Timespan string | Aggregation interval for process creates events |
| aggregationEnabledConnectionCreate | boolean| Enable / disable event aggregation for connection create events |
| aggregationIntervalConnectionCreate | ISO8601 Timespan string | Aggregation interval for connection creates events |
| aggregationEnabledProcessTerminate | boolean | Enable / disable event aggregation for process terminate events | Windows only|
| aggregationIntervalProcessTerminate | ISO8601 Timespan string | Aggregation interval for process terminates events | Windows only|
|

## Default configurations settings

| Configuration name | Default values |
|:-----------|:---------------|
| aggregationEnabledProcessCreate | true |
| aggregationIntervalProcessCreate | "PT1H"|
| aggregationEnabledConnectionCreate | true |
| aggregationIntervalConnectionCreate | "PT1H"|
| aggregationEnabledProcessTerminate | true |
| aggregationIntervalProcessTerminate | "PT1H"|
|

## Next steps

In this article, you learned about Defender for IoT security agent aggregation, and the available event configuration options.

To continue getting started with Defender for IoT deployment, use the following articles:

- Understand [Security agent authentication methods](concept-security-agent-authentication-methods.md)
- Select and deploy a [security agent](how-to-deploy-agent.md)
- Learn how to [Enable Defender for IoT service in your IoT Hub](quickstart-onboard-iot-hub.md)
- Learn more about the service from the [Defender for IoT FAQ](resources-agent-frequently-asked-questions.md)

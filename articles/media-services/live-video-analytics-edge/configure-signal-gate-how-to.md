---
title: Configure a signal gate for event-based video recording - Azure
description: This article provides guidance on how to configure a signal gate in a media graph.
ms.topic: how-to
ms.date: 11/3/2020

---

# Configure a signal gate for event-based video recording

Within a media graph, a [signal gate processor node](media-graph-concept.md#signal-gate-processor) allows you to forward media from one node to another, when the gate is triggered by an event. When triggered, the gate opens and lets media flow through for a specified duration. In the absence of events to trigger the gate, the gate will close and media stops flowing. The signal gate processor is applicable for event-based video recording.
In this article, you will learn the details about how to configure a signal gate processor.

## Suggested pre-reading
-	[Media graph](media-graph-concept.md)
-	[Event-based video recording](event-based-video-recording-concept.md)


## Problem
The user may want to start recording a particular time before or after the gate was triggered by an event. The user knows the acceptable latency within their system, so the user wants to specify the latency of the signal gate processor. The user wants to specify the shortest and longest that the duration of their recording can be no matter how many new events are received.
 
### Use case scenario
Suppose you want to record video every time the front door of your building opens. You want the **X** seconds prior to the door being opened included in the recording. You want the recording to last at least **Y** seconds, if the door is not opened again. You want the recording to last at most **Z** seconds, if the door is repeatedly opened. You know that your door sensor has a latency of **K** seconds and want to decrease the chance of events being disregarded ("late arrivals"), so you want to allow at least **K** seconds for the events to arrive.


## Solution

***Modifying Signal Gate Processor Parameters***

A signal gate processor is configured by 4 parameters:
- **activation evaluation window**
- **activation signal offset**
- **minimum activation window**
- **maximum activation window**. 

When the signal gate processor is triggered, it will stay open for the minimum activation time. The activation event begins at the timestamp for the earliest event, plus the activation signal offset. If the signal gate processor is triggered again, while it is open, the timer resets and the gate will stay open for at least the minimum activation time. The signal gate processor will never stay open longer than the maximum activation time. An event **(Event 1)** that occurs before another event **(Event 2)**, based on media timestamps, is subject to being disregarded, if the system lags and **Event 1** arrives to the signal gate processor after **Event 2**. If **Event 1** does not arrive between the arrival of **Event 2** and the **activation evaluation window**, **Event 1** will be disregarded and not passed through the signal gate processor. Correlation IDs are set for every event. These IDs are set from the initial event and are sequential for each following event.

> [!IMPORTANT]
> Media time is based on the media timestamp of when an event occurred in the media. The sequence of events arriving to the signal gate may not reflect the sequence of events arriving in media time.


### Parameters: (Based on when events arrive in physical time to the signal gate)

* **minimumActivationTime (shortest possible duration of a recording)** = the minimum number of seconds that the signal gate processor will remain open after being triggered to receive new events, unless interrupted by the **maximumActivationTime**
* **maximumActivationTime (longest possible duration of a recording)** = the maximum number of seconds from the initial event that the signal gate processor will remain open after being triggered to receive new events, regardless of what events are received
* **activationSignalOffset** = the number of seconds between the activation of the signal gate processor and when the video recording begins, typically this value is negative, in order to start the recording before the triggering event
* **activationEvaluationWindow** = the number of seconds starting from the initial triggering event, in which an event that occurred before the initial event, in media time, must arrive to the signal gate processor before being disregarded and considered a “late arrival”

> [!NOTE]
> A late arrival is any event that arrives once the activation evaluation window has passed but this event arrived before the initial event in media time.

### Limits of parameters

* **activationEvaluationWindow: 0 seconds to 10 seconds**

* **activationSignalOffset: -1 minute to 1 minute**

* **minimumActivationTime: 1 second to 1 hour**

* **maximumActivationTime: 1 second to 1 hour**


Based on the use case, the parameters would be set as follows:

* **activationEvaluationWindow = K sec**
* **activationSignalOffset = - X sec**
* **minimumActivationWindow = Y sec**
* **maximumActivationWindow = Z sec**


Here is an example of what the Signal Gate Processor node section would like in a media graph topology for the following parameter values:
* **activationEvaluationWindow = 1 second**
* **activationSignalOffset = -5 seconds**
* **minimumActivationTime = 20 seconds**
* **maximumActivationTime = 40 seconds**

> [!IMPORTANT]
> [ISO 8601 duration format](https://en.wikipedia.org/wiki/ISO_8601#Durations
) is expected for each parameter value. 
**Ex: PT1S = 1 second**


```
"processors":              
[
	      {
	        "@type": "#Microsoft.Media.MediaGraphSignalGateProcessor",
	        "name": "signalGateProcessor",
	        "inputs": [
	          {
	            "nodeName": "iotMessageSource"
	          },
	          {
	            "nodeName": "rtspSource"
	          }
	        ],
	        "activationEvaluationWindow": "PT1S",
	        "activationSignalOffset": "-PT5S",
	        "minimumActivationTime": "PT20S",
	        "maximumActivationTime": "PT40S"
	      }
]
```


Let’s consider how this signal gate processor configuration will behave in different recording scenarios.


**1 Event from 1 Source (*Normal Activation*)**

A signal gate processor receiving one event would result in a recording that starts “activation signal offset” (5) seconds before the event arrived at the gate. The remainder of the recording is “minimum activation time” (20) seconds long since no other events arrive before the minimum activation time completes to retrigger the gate.

Example Diagram:
> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/configure-signal-gate-how-to/normal-activation.svg" alt-text="Normal Activation":::

* Duration of Recording = -offset + minimumActivationTime = [E1+offset, E1+minimumActivationTime]


**2 Events from 1 Source (*Retriggered Activation*)**

A signal gate processor receiving two events would result in a recording that starts “activation signal offset” (five) seconds before the first event arrived at the gate. The second event arrives five seconds after the first event, which is before the “minimum activation time” (20) seconds from the first event completes, therefore the gate is retriggered to stay open. The remainder of the recording is “minimum activation time” (20) seconds long, since no other events arrive before the minimum activation time from the 2nd event completes to retrigger the gate again.

Example Diagram:
> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/configure-signal-gate-how-to/retriggering-activation.svg" alt-text="Retriggered Activation":::

* Duration of Recording = -offset + (arrival of 2nd event - arrival of 1st event) + minimumActivationTime


**N Events from 1 Source (*Maximum Activation*)**

A signal gate processor receiving N events would result in a recording that starts “activation signal offset” (5) seconds before the first event arrived at the gate. As each event arrives before the completion of the “minimum activation time” (20) seconds from the previous event, the gate would continuously be retriggered and remain open until “maximum activation time” (40) seconds after the first event, in which the gate would close and no longer accept any new events.

Example Diagram:
> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/configure-signal-gate-how-to/maximum-activation.svg" alt-text="Max Activation":::
 
* Duration of Recording = -offset + maximumActivationTime

> [!IMPORTANT]
> Diagrams assume every event arrives at the same instance in physical and media time. (No late arrivals)

## Next steps

### Try It Out

[Event-based video recording tutorial](event-based-video-recording-tutorial.md)

Using the event-based video recording tutorial, edit the [topology.json](https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/evr-hubMessage-assets/topology.json), modify the parameters for the signalgateProcessor node, then follow the remainder of the tutorial. Review the video recordings to analyze the effect of the parameters.




---
title: Configure a signal gate for event-based video recording - Azure
description: This article provides guidance about how to configure a signal gate in a media graph.
ms.topic: how-to
ms.date: 11/3/2020

---

# Configure a signal gate for event-based video recording

Within a media graph, a [signal gate processor node](media-graph-concept.md#signal-gate-processor) allows you to forward media from one node to another when the gate is triggered by an event. When it's triggered, the gate opens and lets media flow through for a specified duration. In the absence of events to trigger the gate, the gate closes, and media stops flowing. You can use the signal gate processor for event-based video recording.

In this article, you'll learn how to configure a signal gate processor.

## Suggested prereading
-	[Media graph](media-graph-concept.md)
-	[Event-based video recording](event-based-video-recording-concept.md)


## Problem
A user might want to start recording at a particular time before or after the gate is triggered by an event. The user knows the acceptable latency within their system. So they want to specify the latency of the signal gate processor. They also want to specify the minimum and maximum duration of their recording, no matter how many new events are received.
 
### Use case scenario
Suppose you want to record video every time the front door of your building opens. You want the recording to: 

- Include the *X* seconds before the door opens. 
- Last at least *Y* seconds if the door isn't opened again. 
- Last at most *Z* seconds if the door is repeatedly opened. 
 
You know that your door sensor has a latency of *K* seconds. To reduce the chance of events being disregarded as late arrivals, you want to allow at least *K* seconds for the events to arrive.


## Solution

To address the problem, modify your signal gate processor parameters.

To configure a signal gate processor, use these four parameters:
- Activation evaluation window
- Activation signal offset
- Minimum activation window
- Maximum activation window

When the signal gate processor is triggered, it stays open for the minimum activation time. The activation event begins at the time stamp for the earliest event, plus the activation signal offset. 

If the signal gate processor is triggered again while it's open, the timer resets and the gate stays open for at least the minimum activation time. The signal gate processor never stays open longer than the maximum activation time. 

An event (event 1) that occurs before another event (event 2), based on media time stamps, could be disregarded if the system lags and event 1 arrives at the signal gate processor after event 2. If event 1 doesn't arrive between the arrival of event 2 and the activation evaluation window, event 1 is disregarded. It isn't passed through the signal gate processor. 

Correlation IDs are set for every event. These IDs are set from the initial event. They're sequential for each following event.

> [!IMPORTANT]
> Media time is based on the media time stamp of when an event occurs in the media. The sequence of events that arrive at the signal gate might not reflect the sequence of events that arrive in media time.


### Parameters, based on the physical time that events arrive at the signal gate

* **minimumActivationTime (shortest possible duration of a recording)**: The minimum number of seconds that the signal gate processor remains open after it's triggered to receive new events, unless it's interrupted by the maximumActivationTime.
* **maximumActivationTime (longest possible duration of a recording)**: The maximum number of seconds from the initial event that the signal gate processor remains open after being triggered to receive new events, regardless of what events are received.
* **activationSignalOffset**: The number of seconds between the activation of the signal gate processor and the start of the video recording. Typically, this value is negative because it starts the recording before the triggering event.
* **activationEvaluationWindow**: Starting from the initial triggering event, the number of seconds in which an event that occurred before the initial event, in media time, must arrive at the signal gate processor before it's disregarded and considered a late arrival.

> [!NOTE]
> A *late arrival* is any event that arrives after the activation evaluation window has passed but that arrives before the initial event in media time.

### Limits of parameters

* **activationEvaluationWindow**: 0 seconds to 10 seconds
* **activationSignalOffset**: -1 minute to 1 minute
* **minimumActivationTime**: 1 second to 1 hour
* **maximumActivationTime**: 1 second to 1 hour


In the use case, you would set the parameters as follows:

* **activationEvaluationWindow**: *K* seconds
* **activationSignalOffset**: *-X* seconds
* **minimumActivationWindow**: *Y* seconds
* **maximumActivationWindow**: *Z* seconds


Here's an example of how the **Signal Gate Processor** node section would look in a media graph topology for the following parameter values:
* **activationEvaluationWindow**: 1 second
* **activationSignalOffset**: -5 seconds
* **minimumActivationTime**: 20 seconds
* **maximumActivationTime**: 40 seconds

> [!IMPORTANT]
> [ISO 8601 duration format](https://en.wikipedia.org/wiki/ISO_8601#Durations
) is expected for each parameter value. For example, PT1S = 1 second.


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


Now consider how this signal gate processor configuration will behave in different recording scenarios.

### Recording scenarios

**One event from one source (*normal activation*)**

A signal gate processor that receives one event results in a recording that starts 5 seconds (activation signal = 5 seconds) before the event arrives at the gate. The rest of the recording is 20 seconds (minimum activation time = 20 seconds) because no other events arrive before the end of the minimum activation time to retrigger the gate.

Example diagram:
> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/configure-signal-gate-how-to/normal-activation.svg" alt-text="Diagram showing the normal activation of one event from one source.":::

* Duration of recording = -offset + minimumActivationTime = [E1+offset, E1+minimumActivationTime]


**Two events from one source (*retriggered activation*)**

A signal gate processor that receives two events results in a recording that starts 5 seconds (activation signal offset = 5 seconds) before the event arrives at the gate. Also, event 2 arrives 5 seconds after event 1. Because event 2 arrives before the end of event 1's minimum activation time (20 seconds), the gate is retriggered. The rest of the recording is 20 seconds (minimum activation time = 20 seconds) because no other events arrive before the end of the minimum activation time from event 2 to retrigger the gate.

Example diagram:
> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/configure-signal-gate-how-to/retriggering-activation.svg" alt-text="Diagram showing the retriggered activation of two events from one source.":::

* Duration of recording = -offset + (arrival of second event - arrival of first event) + minimumActivationTime


***N* events from one source (*maximum activation*)**

A signal gate processor that receives *N* events results in a recording that starts 5 seconds (activation signal offset = 5 seconds) before the first event arrives at the gate. As each event arrives before the end of the minimum activation time of 20 seconds from the previous event, the gate is continuously retriggered. It remains open until the maximum activation time of 40 seconds after the first event. Then the gate closes and no longer accepts any new events.

Example diagram:
> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/configure-signal-gate-how-to/maximum-activation.svg" alt-text="Diagram showing the maximum activation of N events from one source.":::
 
* Duration of recording = -offset + maximumActivationTime

> [!IMPORTANT]
> The preceding diagrams assume that every event arrives at the same instant in physical time and media time. That is, they assume that there are no late arrivals.

## Next steps

Try out the [Event-based video recording tutorial](event-based-video-recording-tutorial.md). Start by editing the [topology.json](https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/evr-hubMessage-assets/topology.json). Modify the parameters for the signalgateProcessor node, and then follow the rest of the tutorial. Review the video recordings to analyze the effect of the parameters.




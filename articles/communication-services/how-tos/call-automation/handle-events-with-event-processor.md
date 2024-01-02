---
title: Azure Communication Services Call Automation Events handling with Event Processor
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to guide on using Call Automation's Event Processor
author: minwoolee-msft
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 05/31/2023
ms.author: minwoolee
---

# Handling Events with Call Automation's Event Processor Overview

Once the call is established with Call Automation, further state update of the on-going call is sent as separate event via [Webhook Callback](../../concepts/call-automation/call-automation.md#call-automation-webhook-events). These events have important information, such as latest state of the call and outcome of the request that was sent.

Call Automation's EventProcessor helps easily processing these Webhook Callback events for your applications. It helps corelate each event to its respective call, and allow you to build applications with ease.

## Benefits

EventProcessor features allow developers to easily build robust application that can handle call automation events.

- Associating events to its respective calls
- Easily able to write code linearly
- Handling events that could happen anytime during the call (such as, CallDisconnected or ParticipantsUpdated)
- Handling rare case where events arriving earlier than the request's response
- Set custom timeout for waiting on events

## Passing events to Call Automation's EventProcessor

Call Automation's EventProcessor first need to consume events that were sent from the service. Once the event arrives in callback endpoint, pass the event to EventProcessor.

> [!IMPORTANT]
> Have you established webhook callback events endpoint? EventProcessor still needs to consume callback events through webhook callback. See **[quickstart](../../quickstarts/call-automation/quickstart-make-an-outbound-call.md)** that describes establishing webhook endpoints.

```csharp
using Azure.Communication.CallAutomation;

[HttpPost]
public IActionResult CallbackEvent([FromBody] CloudEvent[] cloudEvents)
{
    // Use your call automation client that established the call
    CallAutomationEventProcessor eventProcessor = callAutomationClient.GetEventProcessor();

    // Let event be processed in EventProcessor
    eventProcessor.ProcessEvents(cloudEvents);
    return Ok();
}
```

Now we're ready to use the EventProcessor.

## Using Create Call request's response to wait for Call Connected event

First scenario is to create an outbound call, then wait until the call is established with the EventProcessor.

```csharp
// Creating an outbound call here
CreateCallResult createCallResult = await callAutomationClient.CreateCallAsync(callInvite, callbackUri);
CallConnection callConnection = createCallResult.CallConnection;

// Wait for 40 seconds before throwing timeout error.
var tokenSource = new CancellationTokenSource(TimeSpan.FromSeconds(40));

// We can wait for EventProcessor that related to outbound call here. In this case, we are waiting for CreateCallEventResult, upto 40 seconds.
CreateCallEventResult eventResult = await createCallResult.WaitForEventProcessorAsync(tokenSource);

// Once EventResult comes back, we can get SuccessResult of CreateCall - which is, CallConnected event.
CallConnected returnedEvent = eventResult.SuccessResult;
```

With EventProcessor, we can easily wait CallConnected event until the call is established. If the call was never established (that is, callee never picked up the phone), it throws Timeout Exception.

> [!NOTE]
> If specific timeout was not given when waiting on EventProcessor, it will wait until its default timeout happens. The default timeout is 4 minutes.

## Using Play request's response to wait for Play events

Now the call is established, let's try to play some audio in the call, then wait until the media is played.

```csharp
// play my prompt to everyone
FileSource fileSource = new FileSource(playPrompt);
PlayResult playResult = await callConnection.GetCallMedia().PlayToAllAsync(fileSource);

// wait for play to complete
PlayEventResult playEventResult = await playResult.WaitForEventProcessorAsync();

// check if the play was completed successfully
if (playEventResult.IsSuccess)
{
    // success play!
    PlayCompleted playCompleted = playEventResult.SuccessResult;
}
else
{
    // failed to play the audio.
    PlayFailed playFailed = playEventResultResult.FailureResult;
}
```

> [!WARNING]
> EventProcessor utilizes OperationContext to track event with its related request. If OperationContext was not set during request, EventProcessor will set generated GUID to track future events to the request. If you are setting your own OperationContext during reuest, EventProcessor will still work - but it's advised to set them differently from request to request, to allow EventProcessor to distinguish request 1's event and request 2's event.

## Handling events with Ongoing EventProcessor

Some events could happen anytime during the call, such as CallDisconnected or ParticipantsUpdated, when other caller leaves the call. EventProcessor provides a way to handle these events easily with ongoing event handler.

```csharp
// Use your call automation client that established the call
CallAutomationEventProcessor eventProcessor = callAutomationClient.GetEventProcessor();

// attatch ongoing EventProcessor for this particular call,
// then prints out # of participants in the call
eventProcessor.AttachOngoingEventProcessor<ParticipantsUpdated>(callConnectionId, recievedEvent => {
    logger.LogInformation($"Number of participants in this Call: [{callConnectionId}], Number Of Participants[{recievedEvent.Participants.Count}]");
});
```

With this given ongoing EventProcessor, we can now print number or participant in the call whenever people join or leave the call.

> [!TIP]
> You can attach ongoing handler to any event type! This opens possibility to build your application with callback design pattern.

## Advanced: Using predicate to wait for specific event

If you would like to wait for specific event with given predicate without relying on EventResult returned from request, it's also possible to do so with predicate. Let's try to wait for CallDisconnected event with matching CallConnectionId and its type.

```csharp
// Use your call automation client that established the call
CallAutomationEventProcessor eventProcessor = callAutomationClient.GetEventProcessor();

// With given matching informations, wait for this specific event
CallDisconnected disconnectedEvent = (CallDisconnected)await eventProcessor.WaitForEvent(predicate
=>
    predicate.CallConnectionId == myConnectionId
    && predicate.GetType() == typeof(CallDisconnected)
);
```

## Advanced: Detailed specification

- The default timeout for waiting on EventProcessor is 4 minutes. After that, it will throw timeout exception.
- The same call automation client that made the request must be used to wait on event using EventProcessor.
- Once the CallDisconnect event is received for the call, all of the call's events are removed from the memory.
- In some rare cases, event may arrive earlier than the response of the request. In these cases, it's saved in backlog for 5 seconds.
- You may have multiple EventProcessor wait on the same event. Once the matching event arrives, all of EventProcessors waiting on that event returns with arrived event.

## Next steps

- Learn more about [How to control and steer calls with Call Automation](../call-automation/actions-for-call-control.md).

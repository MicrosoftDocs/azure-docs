---
title: Azure Communication Services Call Automation Events Handling with the Event Processor
titleSuffix: An Azure Communication Services how-to document
description: The article shows how to use the Call Automation event processor.
author: minwoolee-msft
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 05/31/2023
ms.author: minwoolee
---

# Handle events with the Call Automation event processor

After a call is established with Call Automation, a further update of the ongoing call is sent as a separate event via a [webhook callback](../../concepts/call-automation/call-automation.md#call-automation-webhook-events). These events have important information, such as the latest state of the call and the outcome of the request that was sent.

The Call Automation event processor helps to easily process webhook callback events for your applications. It helps to correlate each event to its respective call so that you can build applications with ease.

## Benefits

By using event processor features, you can easily build robust applications that can handle Call Automation events. They can:

- Associate an event to its respective calls.
- Write code linearly.
- Handle events that could happen anytime during the call (such as `CallDisconnected` or `ParticipantsUpdated`).
- Handle rare cases where events arrive earlier than the request's response.
- Set a custom timeout for waiting on events.

## Pass events to the Call Automation event processor

The Call Automation event processor first needs to consume events that were sent from the service. After the event arrives at the callback endpoint, pass the event to the event processor.

> [!IMPORTANT]
> Have you established a webhook callback events endpoint? The event processor still needs to consume callback events through a webhook callback. For information on how to establish webhook endpoints, see [Make an outbound call by using Call Automation](../../quickstarts/call-automation/quickstart-make-an-outbound-call.md).

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

Now you're ready to use the event processor.

## Use the Create Call request response to wait for a Call Connected event

The first scenario is to create an outbound call and then wait until the call is established with the event processor.

```csharp
// Creating an outbound call here
CreateCallResult createCallResult = await callAutomationClient.CreateCallAsync(callInvite, callbackUri);
CallConnection callConnection = createCallResult.CallConnection;

// Wait for 40 seconds before throwing timeout error.
var tokenSource = new CancellationTokenSource(TimeSpan.FromSeconds(40));

// We can wait for EventProcessor that related to outbound call here. In this case, we are waiting for CreateCallEventResult, up to 40 seconds.
CreateCallEventResult eventResult = await createCallResult.WaitForEventProcessorAsync(tokenSource);

// Once EventResult comes back, we can get SuccessResult of CreateCall - which is, CallConnected event.
CallConnected returnedEvent = eventResult.SuccessResult;
```

With the event processor, you can easily wait for the `CallConnected` event until the call is established. If the call was never established (that is, the caller never picked up the phone), it throws a timeout exception. If the creation of the call otherwise fails, you receive `CallDisconnected` and `CreateCallFailed` events with error codes for further troubleshooting. For more information on Call Automation error codes, see [Troubleshooting call end response codes](./../../resources/troubleshooting/voice-video-calling/troubleshooting-codes.md).

If a specific timeout wasn't given when you waited on the event processor, it waits until its default timeout happens. The default timeout is four minutes.

## Use the Play request response to wait for Play events

Now that the call is established, try to play some audio in the call, and then wait until the media plays.

```csharp
// Play my prompt to everyone.
FileSource fileSource = new FileSource(playPrompt);
PlayResult playResult = await callConnection.GetCallMedia().PlayToAllAsync(fileSource);

// Wait for play to complete.
PlayEventResult playEventResult = await playResult.WaitForEventProcessorAsync();

// Check if the play was completed successfully.
if (playEventResult.IsSuccess)
{
    // Success play!
    PlayCompleted playCompleted = playEventResult.SuccessResult;
}
else
{
    // Failed to play the audio.
    PlayFailed playFailed = playEventResultResult.FailureResult;
}
```

> [!WARNING]
> The event processor uses `OperationContext` to track an event with its related request. If `OperationContext` wasn't set during the request, the event processor sets generated GUID to track future events to the request. If you set `OperationContext` during the request, the event processor still works, but we recommend that you set them differently from request to request. In this way, the event processor can distinguish the first request's event and the second request's event.

## Handle events with the ongoing event processor

Some events could happen anytime during the call, such as `CallDisconnected` or `ParticipantsUpdated`, when other callers leave the call. The event processor provides a way to handle these events easily with the ongoing event handler.

```csharp
// Use your call automation client that established the call
CallAutomationEventProcessor eventProcessor = callAutomationClient.GetEventProcessor();

// attach ongoing EventProcessor for this particular call,
// then prints out # of participants in the call
eventProcessor.AttachOngoingEventProcessor<ParticipantsUpdated>(callConnectionId, receivedEvent => {
    logger.LogInformation($"Number of participants in this Call: [{callConnectionId}], Number Of Participants[{receivedEvent.Participants.Count}]");
});
```

With this specific ongoing event processor, you can now print the number of participants or the participants on the call whenever people join or leave the call.

You can attach an ongoing handler to any event type. This capability opens the possibility to build your application with a callback design pattern.

## Advanced: Use a predicate to wait for a specific event

If you want to wait for a specific event with a specific predicate without the need to rely on `EventResult` returned from the request, it's also possible to do so with a predicate. Try to wait for a `CallDisconnected` event with the matching `CallConnectionId` and its type.

```csharp
// Use your call automation client that established the call
CallAutomationEventProcessor eventProcessor = callAutomationClient.GetEventProcessor();

// With given matching information, wait for this specific event
CallDisconnected disconnectedEvent = (CallDisconnected)await eventProcessor.WaitForEvent(predicate
=>
    predicate.CallConnectionId == myConnectionId
    && predicate.GetType() == typeof(CallDisconnected)
);
```

## Advanced: Detailed specifications

- The default timeout for waiting on the event processor is four minutes. After that, it throws a timeout exception.
- The same call automation client that made the request must be used to wait on an event by using the event processor.
- After the `CallDisconnect` event is received for the call, all the call's events are removed from the memory.
- In some rare cases, an event might arrive earlier than the response of the request. In these cases, it's saved in backlog for five seconds.
- You might have multiple event processors waiting on the same event. After the matching event arrives, all the event processors waiting on that event return with the arrived event.

## Related content

- Learn more about how to [control and steer calls with Call Automation](../call-automation/actions-for-call-control.md).

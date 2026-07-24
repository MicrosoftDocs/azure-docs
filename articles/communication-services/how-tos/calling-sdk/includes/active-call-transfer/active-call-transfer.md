---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/03/2025
ms.author: dmceachern
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Active Call Management
Active Call Transfer is a feature of the `CallAgent` on its `feature` API. This guide talks about how you can manage and track any ongoing calls for your users and how to transfer their client to that active call.

> [!NOTE] 
> This feature is also enabled for the `TeamsCallAgent` as this feature is supported for Teams users as well. This feature is not supported for [Teams Phone Extensibility](../../../../quickstarts/tpe/teams-phone-extensibility-quickstart.md) users.

This guide assumes you went through the QuickStart or that you implemented an application that is able to make and receive calls. If you didn't complete the getting starting guide, refer to our [Quickstart](../../../../quickstarts/voice-video-calling/getting-started-with-calling.md).

### Create CallAgentFeature for Active Call Transfer

The first thing you need to do when setting up Active Call Transfer is you need to create the `CallAgentFeature` for it. Creating this feature does the setup needed to start using the underlying APIs for the functionality of Active Call Transfer. It also holds all the functions and events for Active Call Transfer. 

```js
const activeCallTransferFeature = callAgent.feature(ActiveCallTransfer);
```

### Fetch your Active Calls

After you create the feature API, there is a method that you can use to fetch the ongoing calls `getActiveCallDetails`. The response returns the active calls, or active meetings that your users are in.

```js
const activeCallTransferFeature = callAgent.feature(ActiveCallTransfer);
const activeCallDetails = await activeCallTransferFeature.getActiveCallDetails();
```

The function `getActiveCallDetails` is a way that you can manually query for this data. Once you have the active call details, you can use it to switch the client to any of the calls that were found. If there are ongoing calls this returns an array of `ActiveCallDetails` and `ActiveMeetingDetails`. To be considered in an active call the user can also be in a call that is on hold. This function returns `undefined` if there is no active call ongoing for your user. Best practice is to use `getActiveCallDetails` to fetch any ongoing calls when you first sign into the `CallAgent` to pick up on any calls that are already ongoing.

### Switch your Active Call

Once you have your active call data, you can switch the client over to the new call. This call switching behavior can be done with the `activeCallTransfer` function. Here you can also pass in your `joinCallOptions` to choose the [device configuration](../../../../how-tos/calling-sdk/manage-video.md) of the joining client.

> [!NOTE] 
> When transferring a client that is already in a call to a different call it is important to make sure you put the ongoing call for the client on hold before initiating the transfer.

```js
const joinCallOptions = {
    audioOptions: { isMuted: false },
    videoOptions: { localVideoStreams: [yourLocalVideoStream]}
}
const activeCallTransferFeature = callAgent.feature(ActiveCallTransfer);
const activeCallDetails = await activeCallTransferFeature.getActiveCallDetails();
const call = await activeCallTransferFeature.activeCallTransfer(activeCallDetails[0], {isTransfer: true, joinCallOptions});
```

This function returns the call object for your applications state.

### Companion mode

When transferring the active call to your client, you can just bring the client into the call without hanging up on the device that initiated the call the user is in.

```js
const activeCallTransferFeature = callAgent.feature(ActiveCallTransfer);
const activeCallDetails = await activeCallTransferFeature.getActiveCallDetails();
const call = await activeCallTransferFeature.activeCallTransfer(activeCallDetails[0], { isTransfer: false }); // <-- isTransfer: false - does not remove the original client. 
```

### Subscribe to Active Call Notification events

There are two new events that you can subscribe to so you can receive events notifying you of your user joining a call on another client. The first event `"activeCallsUpdated"` notifies the application that the user is in a call on another device. Since the feature needs to be initialized to get these events best practice is to manually fetch the active calls after creating the `CallAgent` with `getActiveCallDetails`. The third case where this event fires is when a call ends for the user but they are still in another call. In all of the cases the event fires it returns an array of `ActiveCallDetails` and `ActiveMeetingDetails` representing the calls that the user is in. 

```js
const activeCallTransferFeature = callAgent.feature(ActiveCallTransfer);
activeCallTransferFeature.on("activeCallsUpdated", (args) => {
    // show UI indicating that the user is in another call on another device
    await activeCallTransferFeature.activeCallTransfer(args.activeCallDetails[0], { isTransfer: true });
});
```
The second event `"NoActiveCalls"` notifies the application that the user is no longer in an active call anywhere else. This event is to be used to hide any UI indicating that they are in a call elsewhere, and any controls to manually transfer the call over.

```js
const activeCallTransferFeature = callAgent.feature(ActiveCallTransfer);
activeCallTransferFeature.on("NoActiveCalls", () => {
    // hide UI indicating that the user is in a call elsewhere
});
```







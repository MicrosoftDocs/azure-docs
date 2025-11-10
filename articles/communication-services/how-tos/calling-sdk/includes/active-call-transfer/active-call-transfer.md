---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 10/03/2025
ms.author: dmceachern
---

[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Active Call Management
Active Call Transfer is a feature of the core `CallAgent` API. This guide talks about how you can manage and track any ongoing calls for your users and how to transfer their client to that active call.

**Note:** This feature is also enabled for the `TeamsCallAgent` as this feature is supported for Teams users as well.

This guide assumes you went through the QuickStart or that you implemented an application that is able to make and receive calls. If you didn't complete the getting starting guide, refer to our [Quickstart](../../../../quickstarts/voice-video-calling/getting-started-with-calling.md).

### Fetch your Active Call

When your user signs to the `CallAgent` there is a new method that you can use to fetch the ongoing calls `getActiveCallDetails` the response will return to you the active call, or active meeting that your users are in.

```js
const activeCallDetails = await callAgent.getActiveCallDetails();
```

The function `getActiveCallDetails` a way that you can manually query for this data. Once you have the active call details, you can use it to switch the client to the call that was found. This function returns `undefined` if there is no active call ongoing for your user. You can use `getActiveCallDetails` to fetch any ongoing calls when you first sign into the `CallAgent` to pick up on any calls that are already ongoing.

### Switch your Active Call

Once you have your active call data, you can switch the client over to the new call. This call switching behavior can be done with the `activeCallTransfer` function.

```js
const activeCallDetails = await callAgent.getActiveCallDetails();
const call = await callAgent.activeCallTransfer(activeCallDetails, {isTransfer: true});
```

This function returns the call object for your applications state.

### Companion mode

When transferring the active call to your client, you can just bring the client into the call without hanging up on the device that initiated the call the user is in.

```js
const activeCallDetails = await callAgent.getActiveCallDetails();
const call = await callAgent.activeCallTransfer(activeCallDetails, {isTransfer: false}); // <-- isTransfer: false - does not remove the original client. 
```

### Subscribe to Active Call Notification events

There are two new events that you can subscribe to so you can receive events notifying you of your user joining a call on another client. The first event notifies the application that the user is in a call on another device. This event is also emitted when the user logs into the `CallAgent` if they are on a call already elsewhere.

```js
callAgent.on("activeCallsUpdated", (args) => {
    // show UI indicating that the user is in another call on another device
    await callAgent.activeCallTransfer(args.activeCallDetails, {isTransfer: true});
});
```
The second event notifies the application that the user is no longer in an active call anywhere else. This event is to be used to hide any UI indicating that they are in a call elsewhere, and any controls to manually transfer the call over.

```js
callAgent.on("NoActiveCalls", () => {
    // hide UI indicating that the user is in a call elsewhere
});
```







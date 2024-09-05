---
author: aakanmu
ms.service: azure-communication-services
ms.topic: include
ms.date: 05/14/2024
ms.author: aakanmu
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Place a call with contextual Information

```js
// Set up customContext
this.callOptions.customContext = {
    userToUser: <USER_TO_USER_VALUE>,
    xHeaders: [
        { key: <CUSTOM_HEADER_KEY>, value: <CUSTOM_HEADER_VALUE> },
    ]
};
```
For a "1:1" call to a user, use the following code:

```js
const userId = { communicationUserId: 'ACS_USER_ID' };
this.currentCall = this.callAgent.startCall([userId], this.callOptions);
```

To place a call to a public switched telephone network (PSTN), use the `startCall` method on `callAgent` and pass the recipient's `PhoneNumberIdentifier`. Your Communication Services resource must be configured to allow PSTN calling.

When you call a PSTN number, specify your alternate caller ID. An alternate caller ID is a phone number (based on the E.164 standard) that identifies the caller in a PSTN call. It's the phone number the call recipient sees for an incoming call.

For a 1:1 call to a PSTN number, use the following code:
```js
const phoneNumber = { phoneNumber: <ACS_PHONE_NUMBER> };
this.callOptions.alternateCallerId = { phoneNumber: <ALTERNATE_CALLER_ID>}
this.currentCall = this.callAgent.startCall([phoneNumber], this.callOptions);
```

> [!NOTE]
> Passing contextual information in group call and add participant scenarios are not supported

## Receive an incoming call

The `callAgent` instance emits an `incomingCall` event when the logged-in identity receives an incoming call. To listen to this event and extract contextual info, subscribe by using one of these options:

```js
const incomingCallHandler = async (args: { incomingCall: IncomingCall }) => {
    const incomingCall = args.incomingCall;

    // receiving customContext
    const customContext = args.incomingCall.customContext;

    // Get incoming call ID
    var incomingCallId = incomingCall.id

    // Get information about this Call. This API is provided as a preview for developers
    // and may change based on feedback that we receive. Do not use this API in a production environment.
    // To use this api please use 'beta' release of Azure Communication Services Calling Web SDK
    var callInfo = incomingCall.info;

    // Get information about caller
    var callerInfo = incomingCall.callerInfo

    // Accept the call
    var call = await incomingCall.accept();

    // Reject the call
    incomingCall.reject();

    // Subscribe to callEnded event and get the call end reason
     incomingCall.on('callEnded', args => {
        console.log(args.callEndReason);
    });

    // callEndReason is also a property of IncomingCall
    var callEndReason = incomingCall.callEndReason;
};
callAgentInstance.on('incomingCall', incomingCallHandler);
```
---
author: sloanster
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/13/2024
ms.author: micahvivion
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]

## Technical parameters
The calling SDK supports adding up to 5 custom SIP headers and 1000 custom VOIP headers. Additionally, developers can include a dedicated User-To-User header as part of SIP headers list.

The maximum length of a SIP header key is 64 chars, including the X-MS-Custom prefix. Due note that when the SIP header is added the calling SDK will automatically add the ‘X-MS-Custom-’ prefix (which can be seeing if you inspect the SIP header with packet inspector).

The SIP header key may consist of alphanumeric characters and a few selected symbols which include `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`. The maximum length of SIP header value is 256 chars. The same limitations apply when configuring the SIP headers on your SBC. The SIP header value may consist of alphanumeric characters and a few selected symbols which include `=`, `;`, `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`.

The maximum length of a VOIP header key is 64 chars. The maximum length of VOIP header value is 1024 chars.

When adding these custom headers as a developer you can choose to add only SIP headers, only VoIP headers or both can be included.

Currently, adding custom User-to-User Information headers is only supported when initiating a 1:1 call. After starting the 1:1 call, you can include additional participants while maintaining the User-to-User Information within the calls. 

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
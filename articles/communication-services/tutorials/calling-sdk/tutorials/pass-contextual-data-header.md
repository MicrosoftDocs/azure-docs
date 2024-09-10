---
title: Tutorial on how to pass call contextual data information using your Azure Communication Services WebJS SDK
titleSuffix: An Azure Communication Services tutorial document
description: Provides a tutorial guide for passing contextual information using 
author: sloanster
ms.topic: tutorial
ms.service: azure-communication-services
ms.date: 09/10/2024
ms.author: micahvivion
services: azure-communication-services
---

# How to pass contextual data between calls

The ACS WebJS SDK allows developers to pass along custom contextual information when routing calls. Developers can pass metadata about the call, callee or any other information that is relevant to their application or business logic. This allows businesses to manage, and route calls across networks without having to worry about losing context.

Passing context is supported by specifying custom headers. These are an optional list of key-value pairs that can be included as part of `AddParticipant` or `Transfer` actions. The context can be later retrieved as part of the `IncomingCall` event payload.

Custom call context is also forwarded to the SIP protocol, this includes both the freeform custom headers as well as the standard User-to-User Information (UUI) SIP header. When routing an inbound call from your telephony network, the data set from your SBC in the custom headers and UUI is similarly included in the `IncomingCall` event payload. 

All custom context data is opaque to the calling SDK and when used in SIP protocols and its content is unrelated to any basic functions.

Below are samples on how to get started using custom context headers using the WebJS SDK. 

## Technical parameters
The calling SDK  support adding up to 5 custom SIP headers and 1000 custom VOIP headers. Additionally, developers can include a dedicated User-To-User header as part of SIP headers list.

The custom SIP header key must start with a mandatory ‘X-MS-Custom-’ prefix.  The maximum length of a SIP header key is 64 chars, including the X-MS-Custom prefix. The SIP header key may consist of alphanumeric characters and a few selected symbols which includes `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`. The maximum length of SIP header value is 256 chars. The same limitations apply when configuring the SIP headers on your SBC. The SIP header value may consist of alphanumeric characters and a few selected symbols which includes `=`, `;`, `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`.

The maximum length of a VOIP header key is 64 chars. These headers can be sent without ‘x-MS-Custom’ prefix. The maximum length of VOIP header value is 1024 chars.

## Adding custom context when inviting a participant

### Setting custom context.

```js
 
    const callOptions = {
        customContext: {
            voipHeaders: [
                {key: 'voip-key-1', value: 'voip-value-1'},
                {key: 'voip-key-2', value: 'voip-value-2'}
            ],
            // Sip headers have a max limit of 5 headers.
            // SDK is prefixing them with 'x-ms-client-' to avoid conflicts with existing headers.
            sipHeaders: [
                {key: 'sip-key-1', value: 'sip-value-1'},
                {key: 'sip-key-2', value: 'sip-value-2'}
            ],
            userToUser: 'userToUserHeader',
        },
    };
 
    // you can specify only sipHeaders or voipHeaders or both.
 
    // starting a call with custom context.
    callAgent.startCall("USER_ID", callOptions);
    
    // adding participant to existing call or transfer with custom context.
    call.addParticipant("USER_ID", callOptions);
 
    // Parsing custom context on the receiver side.
    
    let info = '';
 
    callAgent.on("incomingCall", (args) => {
        const incomingCall = args.incomingCall;
        if (incomingCall.customContext) {
            if (incomingCall.customContext.userToUser) {
                info += `userToUser: '${incomingCall.customContext.userToUser}'\n`;
            }
            if (incomingCall.customContext.sipHeaders) {
                incomingCall.customContext.sipHeaders.forEach(header => info += `sip: ${header.key}: '${header.value}'\n`);
            }
            if (incomingCall.customContext.voipHeaders) {
                incomingCall.customContext.voipHeaders.forEach(header => info += `voip: ${header.key}: '${header.value}'\n`);
            }
        }
    });

```

## Reading custom context from an incoming call event


## Additional resources

- For a sample payload of the incoming call, refer to this [guide](../../../event-grid/communication-services-voice-video-events.md#microsoftcommunicationincomingcall).

- Learn more about [SIP protocol details for direct routing](../../concepts/telephony/direct-routing-sip-specification.md).

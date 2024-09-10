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

# Using the ACS calling SDK to pass contextual data between calls

The Azure Communication Services (ACS) WebJS SDK provides the ability to allow developers to include custom contextual data (included as a header on the calllin object) when directing and routing calls from one person to another. This functionality allows for the inclusion of metadata related to the call, the recipient, or any other pertinent information that aligns with the application’s needs or the company’s operational logic.

To pass this context, developers can utilize custom headers, which are a set of optional key-value pairs. These pairs can be incorporated into the 'AddParticipant' or 'Transfer' actions within the calling SDK. After this Content has been added you can. access this. payload. through Apis to inspect his context can be accessed as part of the payload for the IncomingCall event. By using the ability to look up metadata quickly and have it be associated with a call developers can eliminate additional external database lookups and instead have content information be available within the call object.

Moreover, the custom call context is also transmitted to the SIP protocol. This transmission includes both the custom headers and the standard User-to-User Information (UUI) SIP header. When an inbound call is routed from your telephony network, the data from your Session Border Controller (SBC) in the custom headers and UUI is also included in the IncomingCall event payload.

It’s important to note that all custom context data remains transparent to the calling SDK and is not related to any of the SDK’s fundamental functions when used in SIP protocols.
Below are tutorials to assist you in implementing custom context headers with the WebJS SDK.


## Technical parameters
The calling SDK  support adding up to 5 custom SIP headers and 1000 custom VOIP headers. Additionally, developers can include a dedicated User-To-User header as part of SIP headers list.

The custom SIP header key must start with a mandatory ‘X-MS-Custom-’ prefix.  The maximum length of a SIP header key is 64 chars, including the X-MS-Custom prefix. The SIP header key may consist of alphanumeric characters and a few selected symbols which includes `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`. The maximum length of SIP header value is 256 chars. The same limitations apply when configuring the SIP headers on your SBC. The SIP header value may consist of alphanumeric characters and a few selected symbols which includes `=`, `;`, `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`.

The maximum length of a VOIP header key is 64 chars. These headers can be sent without ‘x-MS-Custom’ prefix. The maximum length of VOIP header value is 1024 chars.

## Adding custom context when inviting a participant

### Setting custom context headings using the WebJS calling SDK

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
 ```

 ### Parsing and reading custom context headers using the WebJS calling SDK
```js
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

## Additional resources

- For more details on how to pass contextual data using ACS Call automation see this [guide](../../../how-tos/call-automation/custom-context.md).

- Learn more about [SIP protocol details for direct routing](../../concepts/telephony/direct-routing-sip-specification.md).

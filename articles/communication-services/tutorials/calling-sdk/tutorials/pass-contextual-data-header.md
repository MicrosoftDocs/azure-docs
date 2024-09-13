---
title: Tutorial on how to pass User-to-User Information (UUI) data using your Azure Communication Services WebJS SDK
titleSuffix: An Azure Communication Services tutorial document
description: Provide a tutorial on how to pass contextual User-to-User Information (UUI) information using calling SDK
author: sloanster
ms.topic: tutorial
ms.service: azure-communication-services
ms.date: 09/13/2024
ms.author: micahvivion
services: azure-communication-services
---

# Using the ACS calling SDK to pass contextual User-to-User Information (UUI) data between calls

The Azure Communication Services (ACS) WebJS SDK provides developers to include custom contextual data (included as a header on the calling object) when directing and routing calls from one person to another.  This information, also known as User-to-User Information (UUI) data or call control UUI data, is a small piece of data inserted by an application initiating the call. The UUI data is opaque to end users making a call.

Developers can pass this context by using custom headers, which consist of optional key-value pairs. These pairs can be included in the 'AddParticipant' or 'Transfer' actions within the calling SDK. Once added, you can read the data payload as the call moves between endpoints. By efficiently looking up this metadata and associating it with the call, developers can avoid external database lookups and have the content information readily available within the call object.

The custom call context can be transmitted to SIP endpoints using the SIP protocol. This transmission includes both the custom headers and the standard User-to-User Information (UUI) SIP header. When an inbound call is routed from your telephony network, the data from your Session Border Controller (SBC) in the custom headers and UUI is also included in the IncomingCall event payload.

It’s important to note that all custom context data remains transparent to the calling SDK and isn't related to any of the SDK’s fundamental functions when used in SIP protocols. Here's a tutorial to assist you in adding custom context headers when using the WebJS SDK.


> [!IMPORTANT]
> To use the ability to pass User-to-User Information (UUI) data using the calling SDK you must use the calling WebJS SDK GA or public preview version `1.29.1` or later.

## Technical parameters
The calling SDK supports adding up to 5 custom SIP headers and 1000 custom VOIP headers. Additionally, developers can include a dedicated User-To-User header as part of SIP headers list.

The maximum length of a SIP header key is 64 chars, including the X-MS-Custom prefix. Due note that when the SIP header is added the calling SDK will automatically add the ‘X-MS-Custom-’ prefix (which can be seeing if you inspect the SIP header with packet inspector).

The SIP header key may consist of alphanumeric characters and a few selected symbols which include `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`. The maximum length of SIP header value is 256 chars. The same limitations apply when configuring the SIP headers on your SBC. The SIP header value may consist of alphanumeric characters and a few selected symbols which include `=`, `;`, `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`.

The maximum length of a VOIP header key is 64 chars. The maximum length of VOIP header value is 1024 chars.

When adding these custom headers as a developer you can choose to add only SIP headers, only VoIP headers or both can be included.

Currently, adding custom User-to-User Information headers is only supported when initiating a 1:1 call. After starting the 1:1 call, you can include additional participants while maintaining the User-to-User Information within the calls. 

## Adding custom context when inviting a participant

### Adding custom context headings using the WebJS calling SDK

```js
    const callOptions = {
        customContext: {
            voipHeaders: [
                {key: 'voip-key-1', value: 'voip-value-1'},
                {key: 'voip-key-2', value: 'voip-value-2'}
            ],
            sipHeaders: [
                {key: 'sip-key-1', value: 'sip-value-1'},
                {key: 'sip-key-2', value: 'sip-value-2'}
            ],
            userToUser: 'userToUserHeader',
        },
    };
 

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

## More resources

- You can find more details on how to pass contextual data using Azure Communication Services Call automation in this [guide](../../../how-tos/call-automation/custom-context.md).

- Youn can learn more about SIP protocol details for direct routing in this [guide](../../../concepts/telephony/direct-routing-sip-specification.md).

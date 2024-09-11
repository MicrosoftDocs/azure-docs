---
title: Tutorial on how to pass User-to-User Information (UUI) data using your Azure Communication Services WebJS SDK
titleSuffix: An Azure Communication Services tutorial document
description: Provide a tutorial on how to pass contextual User-to-User Information (UUI) information using calling SDK
author: sloanster
ms.topic: tutorial
ms.service: azure-communication-services
ms.date: 09/11/2024
ms.author: micahvivion
services: azure-communication-services
---

# Using the ACS calling SDK to pass contextual User-to-User Information (UUI) data between calls

The Azure Communication Services (ACS) WebJS SDK provide the ability to allow developers to include custom contextual data (included as a header on the calllin object) when directing and routing calls from one person to another.  This informaiton, also known as User-to-User Information (UUI) data or call control UUI data, is a small piece of data inserted by an application initiating the This UUI data is opaque to SIP and its

Developers can pass this context by using custom headers, which consist of optional key-value pairs. These pairs can be included in the 'AddParticipant' or 'Transfer' actions within the calling SDK. Once added, you can read the data payload as the call moves between endpoints. By efficiently looking up this metadata and associating it with the call, developers can avoid external database lookups and have the content information readily available within the call object.

Moreover, the custom call context can also also transmitted to to SIP endpoints using SIP protocol. This transmission includes both the custom headers and the standard User-to-User Information (UUI) SIP header. When an inbound call is routed from your telephony network, the data from your Session Border Controller (SBC) in the custom headers and UUI is also included in the IncomingCall event payload.

It’s important to note that all custom context data remains transparent to the calling SDK and is not related to any of the SDK’s fundamental functions when used in SIP protocols. Here is a tutorial to assist you in adding custom context headers when using the WebJS SDK.

[!INCLUDE [Public Preview Disclaimer](../../../includes/public-preview-include.md)]

> [!IMPORTANT]
> To use the ability to pass User-to-User Information (UUI) data using the calling SDK you must use the public preview calling SDK version `1.29.1` or later.

## Technical parameters
The calling SDK supports adding up to 5 custom SIP headers and 1000 custom VOIP headers. Additionally, developers can include a dedicated User-To-User header as part of SIP headers list.

The maximum length of a SIP header key is 64 chars, including the X-MS-Custom prefix. Due note that when the SIP header is added the calling SDK will automatically add ‘X-MS-Custom-’ prefix (which can be seeing if you insspect the SIP header with packet inspector).

The SIP header key may consist of alphanumeric characters and a few selected symbols which includes `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`. The maximum length of SIP header value is 256 chars. The same limitations apply when configuring the SIP headers on your SBC. The SIP header value may consist of alphanumeric characters and a few selected symbols which includes `=`, `;`, `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`.

The maximum length of a VOIP header key is 64 chars. The maximum length of VOIP header value is 1024 chars.

When adding these custom headers as a developer you can choose to add only SIP headers, only VoIP headers or both can be included.

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

## Additional resources

- For more details on how to pass contextual data using ACS Call automation see this [guide](../../../how-tos/call-automation/custom-context.md).

- Learn more about [SIP protocol details for direct routing](../../../concepts/telephony/direct-routing-sip-specification.md).

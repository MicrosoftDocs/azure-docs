---
author: sloanster
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/13/2024
ms.author: micahvivion
---


## Technical parameters
The calling SDK supports adding up to 5 custom SIP headers and 1000 custom VOIP headers. Additionally, developers can include a dedicated User-To-User header as part of SIP headers list.

The maximum length of a SIP header key is 64 chars, including the X-MS-Custom prefix. Due note that when the SIP header is added the calling SDK will automatically add the ‘X-MS-Custom-’ prefix (which can be seeing if you inspect the SIP header with packet inspector).

The SIP header key may consist of alphanumeric characters and a few selected symbols which include `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`. The maximum length of SIP header value is 256 chars. The same limitations apply when configuring the SIP headers on your SBC. The SIP header value may consist of alphanumeric characters and a few selected symbols which include `=`, `;`, `.`, `!`, `%`, `*`, `_`, `+`, `~`, `-`.

The maximum length of a VOIP header key is 64 chars. The maximum length of VOIP header value is 1024 chars.

When adding these custom headers as a developer you can choose to add only SIP headers, only VoIP headers or both can be included.

> [!NOTE]
> Currently, adding custom User-to-User Information headers is only supported when initiating a 1:1 call. Passing User-to-User Information headers in group calls is not currently supported. To work around this after starting the 1:1 call, you can include additional participants while maintaining the User-to-User Information within the calls. 

For details othe custom context interface API, consult the [custom context API resource](/javascript/api/azure-communication-services/@azure/communication-calling/customcontext?view=azure-communication-services-js&preserve-view=true) page.

## Place a call with User-to-User Information (UUI) data

```js
// Setting custom context UUI Headers
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
});
```


## Read and parse User-to-User Information headers in a call

The `callAgent` instance emits an `incomingCall` event when the logged-in identity receives an incoming call. To listen to this event and extract contextual info, subscribe by using one of these options:

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

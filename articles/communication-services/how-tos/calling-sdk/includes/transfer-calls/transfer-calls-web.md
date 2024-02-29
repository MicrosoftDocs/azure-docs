---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 2/13/2024
ms.author: cnwankwo
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-web.md)]


Call transfer is an extended feature of the core `Call` API. You first need to import calling Features from the Calling SDK:

```js
import { Features} from "@azure/communication-calling";
```

Then you can get the transfer feature API object from the call instance:

```js
const callTransferApi = call.feature(Features.Transfer);
```

Call transfers involve three parties:

- *Transferor*: The person who initiates the transfer request.
- *Transferee*: The person who is being transferred.
- *Transfer target*: The person who is being transferred to.

### Transfer to participant:

1. There's already a connected call between the *transferor* and the *transferee*. The *transferor* decides to transfer the call from the *transferee* to the *transfer target*.
1. The *transferor* calls the `transfer` API.
1. The *transfer target* receives an incoming call only if the *transferee* accepts the transfer request.

To transfer a current call, you can use the `transfer` API. `transfer` takes the optional `transferCallOptions`, which allows you to set a `disableForwardingAndUnanswered` flag:

- `disableForwardingAndUnanswered = false`: If the *transfer target* doesn't answer the transfer call, the transfer follows the *transfer target* forwarding and unanswered settings.
- `disableForwardingAndUnanswered = true`: If the *transfer target* doesn't answer the transfer call, the transfer attempt ends.

```js
// transfer target can be an Azure Communication Services user
const id = { communicationUserId: <ACS_USER_ID> };
```

```js
// call transfer API
const transfer = callTransferApi.transfer({targetParticipant: id});
```

### Transfer to call:

1. There's already a connected call between the *transferor* and the *transferee*. 
2. There's already a connected call between the *transferor* and the *transfer target*.
3. The *transferor* decides to transfer the call with the *transferee* to the call with *transfer target*.
4. The *transferor* calls the `transfer` API.
6. The *transfer target* receives an incoming call only if the *transferee* accepts the transfer request.

To transfer a current call, you can use the `transfer` API.

```js
// transfer to the target call specifying the call id
const id = { targetCallId: <CALL_ID> };
```

```js
// call transfer API
const transfer = callTransferApi.transfer({ targetCallId: <CALL_ID> });
```

The `transfer` API allows you to subscribe to `stateChanged`. It also comes with a  transfer `state` and `error` properties

```js
// transfer state
const transferState = transfer.state; // None | Transferring | Transferred | Failed

// to check the transfer failure reason
const transferError = transfer.error; // transfer error code that describes the failure if a transfer request failed
```

The *transferee* can listen to a `transferAccepted` event. The listener for this event has a `TransferEventArgs` which contains the call object of the new transfer call
between the  *transferee* and the *transfer target*. 

```js
// Transferee can subscribe to the transferAccepted event
callTransferApi.on('transferAccepted', args => {
    const newTransferCall =  args.targetCall;
});
```

The *transferor* can subscribe to events for change of the state of the transfer. If the call to the *transferee* was successfully connected with *Transfer target*, *transferor* can hang up the original call with *transferee*.

```js
transfer.on('stateChanged', () => {
   if (transfer.state === 'Transferred') {
       call.hangUp();
   }
});
```


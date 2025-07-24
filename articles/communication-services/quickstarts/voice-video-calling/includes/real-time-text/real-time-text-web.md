---
author: Edward
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: include
ms.date: 12/4/2024
ms.author: edwardlee
---

## Models
| Name | Description |
| ---- | ----------- |
| RealTimeTextFeature | API for RealTimeText |
| RealTimeTextInfo | Data structure received for each RealTimeText event |
| RealTimeTextReceivedEventHandler | Callback definition for handling RealTimeTextReceivedEventType event |

## Get RealTimeText feature

``` typescript
let realTimeTextFeature: SDK.RealTimeTextFeature = call.feature(SDK.Features.RealTimeText);
```

## Subscribe to listeners

### Add a listener for RealTimeText data received
Handle the returned RealTimeTextInfo data object. Ideally, you would have this on handler set once call is connected.

Note: The object contains a resultType prop that indicates whether the data is a partial text or a finalized version of the text. ResultType `Partial` indicates live messages that are subject to change, while `Final` indicates completed messages with no further changes pending.

```typescript
const realTimeTextReceivedHandler: SDK.RealTimeTextReceivedEventHandler = (data: SDK.RealTimeTextInfo) => { 
    /** USER CODE HERE - E.G. RENDER TO DOM 
     *  data.sequenceId
     *  data.sender
     *  data.text
     *  data.resultType
     *  data.receivedTimestamp
     *  data.updatedTimestamp
     *  data.isLocal
    */
    // Example code:
    // Create a dom element, i.e. div, with id "rttArea" before proceeding with the sample code
    let mri: string = '';
    let displayName: string = '';
    switch (data.sender.identifier.kind) {
        case 'communicationUser': { mri = data.sender.identifier.communicationUserId; displayName = data.sender.displayName; break; }
        case 'microsoftTeamsUser': { mri = data.sender.identifier.microsoftTeamsUserId; displayName = data.sender.displayName; break; }
        case 'phoneNumber': { mri = data.sender.identifier.phoneNumber;  displayName = data.sender.displayName; break; }
    }

    const newClassName = `prefix${mri.replace(/:/g, '').replace(/-/g, '').replace(/\+/g, '')}`;
    const rttText = `${(data.receivedTimestamp).toUTCString()} ${displayName ?? mri}: `;

    let foundRTTContainer = this.elements.rttArea.querySelector(`.${newClassName}[isNotFinal='true']`);
    if (!foundRTTContainer) {
        let rttContainer = document.createElement('div');
        rttContainer.setAttribute('isNotFinal', 'true');
        rttContainer.style['borderBottom'] = '1px solid';
        rttContainer.style['whiteSpace'] = 'pre-line';
        rttContainer.textContent = rttText + data.text;
        rttContainer.classList.add(newClassName);

        this.elements.rttArea.appendChild(rttContainer);

        setTimeout(() => {
            this.elements.rttArea.removeChild(rttContainer);
        }, 40000);
    } else {
        if (data.text === '') {
            this.elements.rttArea.removeChild(foundRTTContainer);
        }
        if (data.resultType === 'Final') {
            foundRTTContainer.setAttribute('isNotFinal', 'false');
            if (data.isLocal) {
                let rttTextField = this.elements.rttMessage;
                rttTextField.value = '';
            }
        } else {
            foundRTTContainer.textContent = rttText + data.text;
        }
    }
}; 
realTimeTextFeature.on('realTimeTextReceived', realTimeTextReceivedHandler); 
```

## Send RealTimeText live handler
In order to simulate live messaging, you will need to set up a live handler to send RealTimeText as the user types.

```typescript
let rttTextField = document.getElementById("rttMessage") as HTMLInputElement;
rttTextField.addEventListener('keyup', (event) => {
    await realTimeTextFeature.sendRealTimeText(rttTextField.value);
});
```

### Send Finalized RealTimeText
Once you are certain that the message has been finalized, for example, the user clicks on send message or presses enter, pass `true` to the sendRealTimeText function.
``` typescript
try {
    let rttTextField = document.getElementById("rttMessage") as HTMLInputElement;
    await realTimeTextFeature.sendRealTimeText(rttTextField.value, true);
    rttTextField.value = '';
} catch (e) {
    console.log('ERROR Send RTT failed', e);
}
```

## Unsubscribe to listeners
```typescript
realTimeTextFeature.off('realTimeTextReceived', realTimeTextReceivedHandler); 
```

## RealTimeTextInfo Class

The `RealTimeTextInfo` class provides detailed information about each real-time text message:

- **sender**: Information about who sent the message.
- **sequenceId**: Unique identifier for the message.
- **text**: The content of the message.
- **resultType**: Indicates if the message is partial or finalized.
- **receivedTimestamp**: Timestamp when the message was received.
- **updatedTimestamp**: Timestamp when the message was last updated.
- **isLocal**: Indicates if the message was sent by the local user.

## Other Links

- Get started with RTT in the [UI Library](https://azure.github.io/communication-ui-library/?path=/docs/concepts-real-time-text--docs)

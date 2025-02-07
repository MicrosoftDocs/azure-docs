---
author: ahammer
ms.service: azure-communication-services
ms.topic: include
ms.subservice: calling
ms.date: 12/4/2024
ms.author: adam.hammer
---

## Models

| Name               | Description                                      |
| ------------------ | ------------------------------------------------ |
| `RealTimeTextInfo` | Represents a real-time text message entry, including sender information, message content, sequence ID, and status. |

## Get Real Time Text Feature

Access the Real Time Text feature from your `Call` object:

```swift
let rttFeature = call.feature(Features.realTimeText)
```

## Feature Usage

### Sending Real Time Text Messages

Bind a text input field to the `send` method to transmit messages as the user types:

```swift
@State var messageText: String = ""

TextField("Type your message", text: $messageText)
    .onChange(of: messageText) { newText in
        rttFeature?.send(newText)
    }
```

### Receiving Real Time Text Messages

Subscribe to the `OnInfoReceived` event to handle incoming messages:

```swift
rttFeature?.addOnInfoReceivedListener { eventArgs in
    if let info = eventArgs.info {
        // Update your message list with the new info
        updateMessageList(info)
        
        // Clear the text input if the message is local and finalized
        if info.isLocal && info.resultType == .final {
            self.messageText = ""
        }
    }
}
```

## RealTimeTextInfo Class

The `RealTimeTextInfo` class provides detailed information about each real-time text message:

- **Sender**: Information about who sent the message.
- **SequenceId**: Unique identifier for the message.
- **Text**: The content of the message.
- **ResultType**: Indicates if the message is partial or finalized.
- **ReceivedTime**: Timestamp when the message was received.
- **UpdatedTime**: Timestamp when the message was last updated.
- **IsLocal**: Indicates if the message was sent by the local user.

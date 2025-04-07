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

To access the Real Time Text feature, retrieve it from the `Call` object:

```java
RealTimeTextCallFeature rttFeature = call.feature(Features.REAL_TIME_TEXT);
```

## Feature Usage

### Sending Real Time Text Messages

Bind a text input field to the `send()` method to transmit messages as the user types:

```java
EditText messageEditText = findViewById(R.id.messageEditText);
messageEditText.addTextChangedListener(new TextWatcher() {
    @Override
    public void afterTextChanged(Editable s) {
        String text = s.toString();
        rttFeature.send(text);
    }
    // Other overridden methods...
});
```

### Receiving Real Time Text Messages

Subscribe to the `OnInfoReceived` event to handle incoming messages:

```java
rttFeature.addOnInfoReceivedListener((eventArgs) -> {
    RealTimeTextInfo info = eventArgs.getInfo();
    
    // Update your message list with the new info
    updateMessageList(info);
    
    // Clear the text input if the message is local and finalized
    if (info.isLocal() && info.getResultType() == RealTimeTextResultType.FINAL) {
        messageEditText.getText().clear();
    }
});
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

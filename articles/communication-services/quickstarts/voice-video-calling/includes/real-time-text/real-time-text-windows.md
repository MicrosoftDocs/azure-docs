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
| `RealTimeTextDetails` | Represents a real-time text message entry, including sender information, message content, sequence ID, and status. |

## Get Real Time Text Feature

Retrieve the Real Time Text feature from the `Call` object:

```csharp
RealTimeTextCallFeature rttFeature = call.GetRealTimeTextCallFeature();
```

## Feature Usage

### Sending Real Time Text Messages

Connect a text input field to the `Send` method to transmit messages as the user types:

```csharp
TextBox messageTextBox = new TextBox();
messageTextBox.TextChanged += (sender, args) => {
    string text = messageTextBox.Text;
    rttFeature.Send(text);
};
```

### Receiving Real Time Text Messages

Subscribe to the `DetailsReceived` event to handle incoming messages:

```csharp
rttFeature.DetailsReceived += (sender, e) => {
    RealTimeTextDetails details = e.Details;
    
    // Update your message list with the new details
    UpdateMessageList(details);
    
    // Clear the text input if the message is local and finalized
    if (details.IsLocal && details.Kind == RealTimeTextResultKind.Final) {
        messageTextBox.Text = string.Empty;
    }
};
```

## RealTimeTextDetails Class

The `RealTimeTextDetails` class provides comprehensive information about each real-time text message:

- **Sender**: Information about who sent the message.
- **SequenceId**: Unique identifier for the message.
- **Text**: The content of the message.
- **Kind**: Indicates if the message is partial or finalized.
- **ReceivedTime**: Timestamp when the message was received.
- **UpdatedTime**: Timestamp when the message was last updated.
- **IsLocal**: Indicates if the message was sent by the local user.
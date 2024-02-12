---
title:  Integrate Azure Communication Services with Microsoft Teams Data Loss Prevention
titleSuffix: An Azure Communication Services how-to guide
description: Learn how to integrate with Microsoft Teams Data Loss Prevention policies by subscribing to Real-time Chat Notifications 
author: angiurgiu
ms.author: agiurg
ms.date: 01/10/2023
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: chat
ms.custom: template-how-to
---
# How to integrate with Microsoft Teams Data Loss Prevention policies

Microsoft Teams administrator can configure policies for data loss prevention (DLP) to prevent leakage of sensitive information from Teams users in Teams meetings. Developers can integrate chat in Teams meetings with Azure Communication Services for Communication Services users via the Communication Services UI library or custom integration. This article describes how to incorporate data loss prevention without a UI library.

You need to subscribe to real-time notifications and listen for message updates. If a chat message from a Teams user contains sensitive content, the message content is updated to blank. The Azure Communication Services user interface has to be updated to indicate that the message cannot be displayed, for example, "Message was blocked as it contains sensitive information.". There could be a delay of a couple of seconds before a policy violation is detected and the message content is updated. You can find an example of such code below.

Data Loss Prevention policies only apply to messages sent by Teams users and aren't meant to protect Azure Communications users from sending out sensitive information.

####  Data Loss Prevention with subscribing to real-time chat notifications
```javascript
let endpointUrl = '<replace with your resource endpoint>'; 

// The user access token generated as part of the pre-requisites 
let userAccessToken = '<USER_ACCESS_TOKEN>'; 

let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAccessToken)); 

await chatClient.startRealtimeNotifications(); 
chatClient.on("chatMessageEdited", (e) => { 
    if (e.messageBody == "" &&
        e.sender.kind == "microsoftTeamsUser") {
        // Show UI message blocked
    }
});
```

####  Data Loss Prevention with retrieving previous chat messages 
```javascript
const messages = chatThreadClient.listMessages();
for await (const message of messages) {
    if (message.content?.message == "" &&
        message.sender?.kind == "microsoftTeamsUser") {
        // Show UI message blocked 
    }
}
```

## Next steps
- [Learn how to enable Microsoft Teams Data Loss Prevention](/microsoft-365/compliance/dlp-microsoft-teams)

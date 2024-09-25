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
[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

Microsoft Teams administrator can configure policies for data loss prevention (DLP) to prevent leakage of sensitive information from Teams users during Teams meetings. Developers have the option to integrate chat functionality in Teams meetings with Azure Communication Services. This can be done either through the Azure Communication Services UI library or through a custom integration. This article describes how to incorporate data loss prevention without using the UI library.

You need to set up your application to listen for real-time updates on message edits. If a Teams user sends a message containing sensitive content, the message will be automatically replaced with a blank message and flagged with a "policyViolation" result. Your application should update its user interface to reflect that the message has been blocked. For example, display a message such as "Message was blocked as it contains sensitive information." Be aware that there may be a brief delay, usually a couple of seconds, between when a message is sent and when a policy violation is detected and applied. You can find an example of such code below.

It's important to note that DLP policies apply only to messages sent by Teams users and do not prevent Azure Communications users from sending out sensitive information.

####  Data Loss Prevention with subscribing to real-time chat notifications
```javascript
let endpointUrl = '<replace with your resource endpoint>'; 

// The user access token generated as part of the pre-requisites 
let userAccessToken = '<USER_ACCESS_TOKEN>'; 

let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAccessToken)); 

await chatClient.startRealtimeNotifications(); 
chatClient.on("chatMessageEdited", (e) => { 
    if (e.policyViolation?.result == "contentBlocked") {
        // Show UI message blocked
    }
});
```

####  Data Loss Prevention with retrieving previous chat messages 
```javascript
const messages = chatThreadClient.listMessages();
for await (const message of messages) {
    if (message.policyViolation?.result == "contentBlocked") {
        // Show UI message blocked 
    }
}
```

## Next steps
- [Learn how to enable Microsoft Teams Data Loss Prevention](/microsoft-365/compliance/dlp-microsoft-teams)

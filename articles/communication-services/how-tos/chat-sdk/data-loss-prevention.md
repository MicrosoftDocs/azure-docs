---
title:  Integrate with Microsoft Teams Data Loss Prevention
titleSuffix: An Azure Communication Services how-to guide
description: Learn how to integrate with Microsoft Teams Data Loss Prevention policies by subscribing to Real-time Chat Notifications 
ms.author: agiurg
ms.date: 01/10/2023
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: chat
ms.custom: template-how-to
---



# How to integrate with Microsoft Teams Data Loss Prevention policies by subscribing to Real-time Chat Notifications

As long as the Microsoft Teams administrator has configured policies for Data loss prevention, the Azure Communications Developer has to subscribe to real-time notifications and listen for message updates. If a chat message from a Teams user contains sensitive content, the message content is updated to blank. The Azure Communication Services interface has to be updated to indicate that the message cannot be displayed, i.e "Message was blocked as it contains sensitive information.". There could be a delay of a couple of seconds before a policy violation is detected and the message content is updated. In the future, Azure Communication Services will expose a new property to indicate to clients that a message content has been edited as a result of a policy violation.

Data Loss Prevention policies only apply to messages sent by Teams users and aren't meant to protect Azure Communications users from sending out sensitive information.

For more information on enabling Microsoft Teams Data Loss Prevention, you can refer to [Data loss prevention and Microsoft Teams](https://learn.microsoft.com/en-us/microsoft-365/compliance/dlp-microsoft-teams?view=o365-worldwide).

```javascript
let endpointUrl = '<replace with your resource endpoint>'; 

// The user access token generated as part of the pre-requisites 
let userAccessToken = '<USER_ACCESS_TOKEN>'; 

let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAccessToken)); 

await chatClient.startRealtimeNotifications(); 
chatClient.on("chatMessageEdited", (e) => { 
	if(e.messageBody == “” && e.sender.kind == "microsoftTeamsUser") 
  	// Show UI message blocked 
});
```

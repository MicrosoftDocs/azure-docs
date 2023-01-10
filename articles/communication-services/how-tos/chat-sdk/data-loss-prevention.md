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



# How to integrate with Microsoft Teams Data Loss Prevention policies by subscribing to Rea-ltime Chat Notifications

As long as the Microsoft Teams administrator has configured policies for Data loss prevention, the Azure Communications Developer has to subscribe to real-time notifications and listen for message updates. If the chat message content is updated to be empty and the sender is a Teams user, the UI has to be updated to display that the message cannot be shown to ACS users, i.e "Message was blocked as it contains sensitive information.". In the future, Microsoft will expose a new property to indicate to ACS clients that a message content has been edited as a result of a DLP violation.

Data Loss Prevention policies only apply to messages sent by Teams users and aren't meant to protect ACS users from sending out sensisitive information.

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

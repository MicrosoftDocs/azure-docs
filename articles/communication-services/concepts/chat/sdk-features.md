---	
title: Chat SDK overview for Azure Communication Services	
titleSuffix: An Azure Communication Services concept document	
description: Learn about the Azure Communication Services Chat SDK.	
author: mikben	
manager: jken	
services: azure-communication-services	
ms.author: mikben	
ms.date: 09/30/2020	
ms.topic: overview	
ms.service: azure-communication-services	
---	

# Chat SDK overview	

Azure Communication Services Chat SDKs can be used to add rich, real-time chat to your applications.
	
## Chat SDK capabilities	

The following list presents the set of features which are currently available in the Communication Services chat SDKs.	

| Group of features | Capability | JavaScript  | Java | .NET | Python | iOS | Android |
|-----------------|-------------------|---|-----|----|-----|----|----|
| Core Capabilities | Create a chat thread between 2 or more users (up to 250 users)                                                       | ✔️   | ✔️  | ✔️    | ✔️   |  ✔️    | ✔️   |	
|                   | Update the topic of a chat thread                                                                              | ✔️   | ✔️ | ✔️    | ✔️   |  ✔️    | ✔️   |	
|                   | Add or remove participants from a chat thread                                                                           | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Choose whether to share chat message history with the participant being added                                   | ✔️   | ✔️   | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Get a list of participants in a chat thread                                                                          | ✔️   | ✔️  | ✔️ | ✔️ |  ✔️    | ✔️   |	
|                   | Delete a chat thread                                                                                              | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Given a communication user, get the list of chat threads the user is part of                                           | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Get info for a particular chat thread                                                                              | ✔️   | ✔️  | ✔️ | ✔️ |  ✔️    | ✔️   |	
|                   | Send and receive messages in a chat thread                                                                            | ✔️   | ✔️   | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Edit the contents of a sent message                                                                                | ✔️   | ✔️  | ✔️ | ✔️ |  ✔️    | ✔️   |	
|                   | Delete a message                                                                                                       | ✔️   | ✔️  | ✔️ | ✔️ |  ✔️    | ✔️   |	
|                   | Read receipts for messages that have been read by other participants in a chat <br/> *Not available when there are more than 20 participants in a chat thread*    | ✔️   | ✔️  | ✔️    | ✔️   |  ✔️    | ✔️   |	
|                   | Get notified when participants are actively typing a message in a chat thread <br/> *Not available when there are more than 20 members in a chat thread*      | ✔️   | ✔️   | ✔️    | ✔️    |  ✔️    | ✔️   |	
|                   | Get all messages in a chat thread <br/>                                                                         | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Send Unicode emojis as part of message content                                                                            | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|Real-time signaling (enabled by proprietary signaling package**)|  Subscribe to get real-time updates for incoming messages and other operations in your chat app. To see a list of supported updates for real-time signaling, see [Chat concepts](concepts.md#real-time-signaling)                                     | ✔️   | ❌    | ❌  | ❌  | ❌  | ❌  |	
| Event Grid support             | Use integration with Azure Event Grid and configure your communication service to execute business logic based on chat activity or to plug in a custom push notification service   | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
| Monitoring        | Use the API request metrics emitted in the Azure portal to build dashboards, monitor the health of your chat app, and set alerts to detect abnormalities      | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	
|                   | Configure your Communication Services resource to receive chat operational logs for monitoring and diagnostic purposes          | ✔️   | ✔️  | ✔️    | ✔️  |  ✔️    | ✔️   |	


**The proprietary signaling package is implemented using web sockets. It will fallback to long polling if web sockets are unsupported.	

## JavaScript Chat SDK support by OS and browser	

The following table represents the set of supported browsers and versions which are currently available.
	
|                                  | Windows          | macOS          | Ubuntu | Linux  | Android | iOS    | iPad OS|
|--------------------------------|----------------|--------------|-------|------|------|------|-------|
| **Chat SDK** | Firefox*, Chrome*, new Edge | Firefox*, Chrome*, Safari* | Chrome*  | Chrome* | Chrome* | Safari* | Safari* |

*Note that the latest version is supported in addition to the previous two releases.<br/>	

## Next steps	

> [!div class="nextstepaction"]	
> [Get started with chat](../../quickstarts/chat/get-started.md)	

The following documents may be interesting to you:	
- Familiarize yourself with [chat concepts](../chat/concepts.md)
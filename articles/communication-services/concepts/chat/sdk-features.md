---
title: Chat client library overview for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services chat client library.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 09/30/2020
ms.topic: overview
ms.service: azure-communication-services
---
# Chat client library overview

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

Azure Communication Services Chat client libraries can be used to add rich, real-time chat to your applications.

## Chat client library capabilities

The following list presents the set of features which are currently available in the Communication Services chat client libraries.

| Group of features | Capability                                                                                                          | JS  | Java | .NET | Python |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | --- | ----- | ---- | -----  |
| Core Capabilities | Create a chat thread between 2 or more users (up to 250 users)                                                       | ✔️   | ✔️  | ✔️    | ✔️   |
|                   | Update the topic of a chat thread                                                                              | ✔️   | ✔️ | ✔️    | ✔️   |
|                   | Add or remove members from a chat thread                                                                           | ✔️   | ✔️  | ✔️    | ✔️  |
|                   | Choose whether to share chat message history with newly added members - *all/none/up to certain time* | ✔️   | ✔️   | ✔️    | ✔️  |
|                   | Get a list of all chat members thread                                                                          | ✔️   | ✔️  | ✔️ | ✔️ |
|                   | Delete a chat thread                                                                                              | ✔️   | ✔️  | ✔️    | ✔️  |
|                   | Get a list of a user's chat thread memberships                                                                  | ✔️   | ✔️  | ✔️    | ✔️  |
|                   | Get info for a particular chat thread                                                                              | ✔️   | ✔️  | ✔️ | ✔️ |
|                   | Send and receive messages in a chat thread                                                                            | ✔️   | ✔️   | ✔️    | ✔️  |
|                   | Edit the content of a message after it's been sent                                                                   | ✔️   | ✔️  | ✔️ | ✔️ |
|                   | Delete a message                                                                                                       | ✔️   | ✔️  | ✔️ | ✔️ |
|                   | Tag a message with priority as normal or high at the time of sending                                               | ✔️   | ✔️  | ✔️    | ✔️   |
|                   | Send and receive read receipts for messages that have been read by members <br/> *Not available when there are more than 20 members in a chat thread*    | ✔️   | ✔️  | ✔️    | ✔️   |
|                   | Send and receive typing notifications when a member is actively typing a message in a chat thread <br/> *Not available when there are more than 20 members in a chat thread*      | ✔️   | ✔️   | ✔️    | ✔️    |
|                   | Get all messages in a chat thread <br/> *Unicode emojis supported*                                                  | ✔️   | ✔️  | ✔️    | ✔️  |
|                   | Send emojis as part of message content                                                                              | ✔️   | ✔️  | ✔️    | ✔️  |
|Real-time signaling (enabled by proprietary signalling package)| Get notified when a user receives a new message in a chat thread they're a member of                                     | ✔️   | ❌    | ❌  | ❌  |
|                    | Get notified when a message has been edited by another member in a chat thread they're a member of                | ✔️   | ❌    | ❌    | ❌  |
|                    | Get notified when a message has been deleted by another member in a chat thread they're a member of                | ✔️   | ❌    | ❌    | ❌  |
|                    | Get notified when another chat thread member is typing                                                             | ✔️   | ❌    | ❌    | ❌  |
|                    | Get notified when another member has read a message (read receipt) in the chat thread                               | ✔️   | ❌    | ❌    | ❌  |
| Events             | Use Event Grid to subscribe to user activity happening in chat threads and integrate custom notification services or business logic     | ✔️   | ✔️  | ✔️    | ✔️  |
| Monitoring        | Monitor usage in terms of messages sent                                                                               | ✔️   | ✔️  | ✔️    | ✔️  |
|                    | Monitor the quality and status of API requests made by your app and configure alerts via the portal                                                          | ✔️   | ✔️  | ✔️    | ✔️  |
|Additional features | Use [Cognitive Services APIs](https://docs.microsoft.com/azure/cognitive-services/) along with chat client library to enable intelligent features - *language translation & sentiment analysis of the incoming message on a client, speech to text conversion to compose a message while the member speaks, etc.*                                                                                         | ✔️   | ✔️  | ✔️    | ✔️  |

## Next steps

> [!div class="nextstepaction"]
> [Get started with chat](../../quickstarts/chat/get-started.md)

The following documents may be interesting to you:

- Familiarize yourself with [chat concepts](../chat/concepts.md)

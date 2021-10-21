---
title: Teams calling and chat interoperability
titleSuffix: An Azure Communication Services concept document
description:Teams calling and chat interoperability
author: tomkau
ms.author: tomkau
ms.date: 10/15/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Teams Interoperability: Calling and chat

> [!IMPORTANT]
> Calling and chat interoperability is in private preview, and restricted to selected Azure Communication Services early adopters. To join early access program, <insert instructions/process>, and to request access to this preview, <insert instructions>, with details of your scenario to be considered for inclusion.
>
> Private Preview APIs and SDKs are provided without a service-level agreement, and are not appropriate for production workloads and should only be used with test users and test data. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

As part of this preview, the Azure Communication Services SDKs can be used to build applications that enable bring your own identity (BYOI) users to initiate ad hoc 1:1 calls or ad hoc 1:1 and group chats with Teams users, outside the context of a scheduled Teams meeting. [Standard ACS pricing](https://azure.microsoft.com/pricing/details/communication-services/) applies to these users, but there's no additional fee for the interoperability capability itself.



## Enabling calling and chat interoperability in your Teams tenant
To enable ad hoc calling and chat between your Communication Services users and your Teams tenant, use the new Teams PowerShell cmdlet [Set-CsTeamsAcsFederationConfiguration](https://docs.microsoft.com/powershell/module/teams/set-csteamsacsfederationconfiguration?view=teams-ps). This cmdlet is only available to participants in the private preview. 

Custom applications built with Azure Communication Services to connect and communicate with Teams users may be used by end users or by bots, and there is no differentiation in how they appear to Teams users unless the developer of the application explicitly indicates this as part of the communication.

To initiate a call or chat with a Teams user, the user’s Azure Active Directory (AAD) object ID is required. This can be obtained using [Microsoft Graph API](https://docs.microsoft.com/graph/api/resources/users?view=graph-rest-1.0) or from your on-premises directory if you are using [Azure AD Connect](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-sync-whatis) (or some other mechanism) to synchronize your identity data between your on-premises environment and AAD.

## Calling
With ad hoc calling, an ACS user or endpoint can initiate a 1:1 call with a Teams, identified by the user’s Azure Active Directory (AAD) object ID. You can easily modify an existing application that calls other ACS users to instead call a Teams user.
 
[Manage calls - An Azure Communication Services how-to guide | Microsoft Docs](../how-tos/calling-sdk/manage-calls?pivots=platform-web)

Calling another ACS user:
```js
const acsCallee = { communicationUserId: <'ACS_USER_ID>' }
const call = callAgent.startCall([acsCallee]);
```

Calling a Teams user:
```js
const teamsCallee = { microsoftTeamsUserId: '<Teams User AAD Object ID>' }
const call = callAgent.startCall([teamsCallee]);
```
 
**Limitations and known issues**
- Communication Services users are not displayed correctly in the Call history


## Chat
With ad hoc chat, Communication Services users or endpoints can initiate 1:n chat with Teams users, identified by the user’s Azure Active Directory (AAD) object ID. You can easily modify an existing application that creates chats with other ACS users, to instead create chats with Teams users:
                                            
[Quickstart: Add Chat to your App](../quickstarts/chat/get-started?pivots=programming-language-javascript)

Creating a chat with a Teams user:
```js
async function createChatThread() { 
const createChatThreadRequest = {  topic: "Hello, World!"  }; 
const createChatThreadOptions = {
    participants: [ { 
        id: { microsoftTeamsUserId: '<TEAMS_USER_ID>' }, 
        displayName: '<USER_DISPLAY_NAME>' }
    ] }; 
const createChatThreadResult = await chatClient.createChatThread( 
createChatThreadRequest, createChatThreadOptions ); 
const threadId = createChatThreadResult.chatThread.id; return threadId; }
```                                         

**Supported functionality**
-	Send/receive messages (type: text, rich text, emoticons) 
-	Communication Services user cand edit sent messages
-	Delete sent messages
-	Receive real-time notifications via trouter (Thread and message related events supported by ACS currently)
-	Send & receive Typing indicators
-	Send & receive Read receipts
-	Add participant and share message history: Teams user can add Teams users only. Communication Services user can add Teams and Communication Services users.
-	Remove existing participant from chat
-	Leave chat
-	Update chat topic
-	Communication Services user can delete the chat.


**Limitations and known issues**
- Editing of messages by the Teams user fails.
- Deletion of a thread by the Communication Services user removes the message history for the Teams user and removes the Teams user from the thread.
- The Teams client UI for external users is inconsistent.


## Privacy
Interoperability between Azure Communication Services and Microsoft Teams enables your applications and users to participate in Teams calls, meetings, and chat. It is your responsibility to ensure that the users of your application are notified when recording or transcription are enabled in a Teams call or meeting.

Microsoft will indicate to you via the Azure Communication Services API that recording or transcription has commenced and you must communicate this fact, in real time, to your users within your application's user interface. You agree to indemnify Microsoft for all costs and damages incurred as a result of your failure to comply with this obligation.





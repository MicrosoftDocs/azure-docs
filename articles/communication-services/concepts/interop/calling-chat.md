---
title: Teams calling and chat interoperability
titleSuffix: An Azure Communication Services concept document
description: Teams calling and chat interoperability
author: tomkau
ms.author: tomkau
ms.date: 10/15/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Teams Interoperability: Calling and chat

> [!IMPORTANT]
> Calling and chat interoperability is in private preview, and restricted to a limited number of Azure Communication Services early adopters. You can [submit this form to request participation in the preview](https://forms.office.com/r/F3WLqPjw0D) and we will review your scenario(s) and evaluate your participation in the preview.
>
> Private Preview APIs and SDKs are provided without a service-level agreement, and are not appropriate for production workloads and should only be used with test users and test data. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> For support, questions or to provide feedback or report issues, please use the [Teams Interop ad hoc calling and chat channel](https://teams.microsoft.com/l/channel/19%3abfc7d5e0b883455e80c9509e60f908fb%40thread.tacv2/Teams%2520Interop%2520ad%2520hoc%2520calling%2520and%2520chat?groupId=d78f76f3-4229-4262-abfb-172587b7a6bb&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47). You must be a member of the Azure Communication Service TAP team.

As part of this preview, the Azure Communication Services SDKs can be used to build applications that enable bring your own identity (BYOI) users to start 1:1 calls or 1:n chats with Teams users. [Standard Azure Communication Services pricing](https://azure.microsoft.com/pricing/details/communication-services/) applies to these users, but there's no extra fee for the interoperability capability itself.



## Enabling calling and chat interoperability in your Teams tenant
To enable calling and chat between your Communication Services users and your Teams tenant, use the new Teams PowerShell cmdlet [Set-CsTeamsAcsFederationConfiguration](/powershell/module/teams/set-csteamsacsfederationconfiguration). This cmdlet is only available to participants in the private preview. 

Custom applications built with Azure Communication Services to connect and communicate with Teams users can be used by end users or by bots, and there's no differentiation in how they appear to Teams users, unless explicitly indicated by the developer of the application.

To start a call or chat with a Teams user, the user's Azure Active Directory (Azure AD) object ID is required. This can be obtained using [Microsoft Graph API](/graph/api/resources/users) or from your on-premises directory if you are using [Azure AD Connect](../../../active-directory/hybrid/how-to-connect-sync-whatis.md) (or some other mechanism) to synchronize between your on-premises directory and Azure AD.

## Calling
With the Calling SDK, a Communication Services user or endpoint can start a 1:1 call with Teams users, identified by their Azure Active Directory (Azure AD) object ID. You can easily modify an existing application that calls other Communication Services users to instead call a Teams user.
 
[Manage calls - An Azure Communication Services how-to guide | Microsoft Docs](../../how-tos/calling-sdk/manage-calls.md?pivots=platform-web)

Calling another Communication Services endpoint using [communicationUserId](/javascript/api/@azure/communication-common/communicationuseridentifier#communicationUserId):
```js
const acsCallee = { communicationUserId: '<Azure Communication Services User ID>' }
const call = callAgent.startCall([acsCallee]);
```

Calling a Teams user using [microsoftTeamsUserId](/javascript/api/@azure/communication-common/microsoftteamsuseridentifier#microsoftTeamsUserId):
```js
const teamsCallee = { microsoftTeamsUserId: '<Teams User AAD Object ID>' }
const call = callAgent.startCall([teamsCallee]);
```
**Voice and video calling events**

[Communication Services voice and video calling events](../../../event-grid/communication-services-voice-video-events.md) are raised for calls between a Communication Services user and Teams users.

**Limitations and known issues**
- This functionality is not currently available in the .NET Calling SDK.
- Teams users must be in "TeamsOnly" mode. Skype for Business users can't receive 1:1 calls from Communication Services users.
- Escalation to a group call isn't supported.
- Communication Services call recording isn't available for 1:1 calls.
- Advanced call routing capabilities such as call forwarding, group call pickup, simulring, and voice mail are not supported.
- Teams users can't set Communication Services users as forwarding/transfer targets.
- There are a number of features in the Teams client that do not work as expected during 1:1 calls with Communication Services users.
- Third-party [devices for Teams](/MicrosoftTeams/devices/teams-ip-phones) and [Skype IP phones](/skypeforbusiness/certification/devices-ip-phones) are not supported.

## Chat
With the Chat SDK, Communication Services users or endpoints can have group chats with Teams users, identified by their Azure Active Directory (AAD) object ID. You can easily modify an existing application that creates chats with other Communication Services users, to instead create chats with Teams users. Below is an example on how to use the Chat SDK to add Teams users as participants. To learn how to use Chat SDK to send a message, manage participants and more, see our [quickstart](../../quickstarts/chat/get-started.md?pivots=programming-language-javascript).

Creating a chat with a Teams user:
```js
async function createChatThread() { 
const createChatThreadRequest = {  topic: "Hello, World!"  }; 
const createChatThreadOptions = {
    participants: [ { 
        id: { microsoftTeamsUserId: '<Teams User AAD Object ID>' }, 
        displayName: '<USER_DISPLAY_NAME>' }
    ] }; 
const createChatThreadResult = await chatClient.createChatThread( 
createChatThreadRequest, createChatThreadOptions ); 
const threadId = createChatThreadResult.chatThread.id; return threadId; }
```                                         

To make it easier to test, we have published a sample app [here](https://github.com/Azure-Samples/communication-services-web-chat-hero/tree/teams-interop-chat-adhoc). Update the app with your Communication Services resource and interop enabled Teams tenant to get started. 

**Limitations and known issues** </br>
While in private preview, a Communication Services user can do various actions using the Communication Services Chat SDK, including sending and receiving of plain and rich text messages, typing indicators, read receipts, real-time notifications and more. However, most of the Teams chat features aren't supported. Here are some key behaviors and known issues:
-    Chats can only be initiated by Communication Services users. 
-    Communication Services users can't send or receive gifs, images, or files. Links to files and images can be shared.
-    Communication Services users can delete the chat. This removes the Teams user from the chat thread and hides the message history from the Teams client.
- Known issue: Communication Services users aren't displayed correctly in the participant list. They are currently displayed as External but their people card might be inconsistent. 
- Known issue: A chat can't be escalated to a call from within the Teams app. 
- Known issue: Editing of messages by the Teams user is not supported. 

## Privacy
Interoperability between Azure Communication Services and Microsoft Teams enables your applications and users to participate in Teams calls, meetings, and chat. It is your responsibility to ensure that the users of your application are notified when recording or transcription are enabled in a Teams call or meeting.

Microsoft will indicate to you via the Azure Communication Services API that recording or transcription has commenced and you must communicate this fact in real time to your users within your application's user interface. You agree to indemnify Microsoft for all costs and damages incurred as a result of your failure to comply with this obligation.

---
title: Teams calling and chat interoperability
titleSuffix: An Azure Communication Services concept document
description: Teams calling and chat interoperability
author: tomaschladek
ms.author: tchladek
ms.date: 10/15/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Teams Interoperability: Calling and chat

> [!IMPORTANT]
> Calling and chat interoperability is in private preview and restricted to a limited number of Azure Communication Services early adopters. You can [submit this form to request participation in the preview](https://forms.office.com/r/F3WLqPjw0D), and we'll review your scenario(s) and evaluate your participation in the preview.
>
> Private Preview APIs and SDKs are provided without a service-level agreement, aren't appropriate for production workloads, and should only be used with test users and data. Certain features may not be supported or have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> For support, questions, or to provide feedback or report issues, please use the [Teams interop ad hoc calling and chat channel](https://teams.microsoft.com/l/channel/19%3abfc7d5e0b883455e80c9509e60f908fb%40thread.tacv2/Teams%2520Interop%2520ad%2520hoc%2520calling%2520and%2520chat?groupId=d78f76f3-4229-4262-abfb-172587b7a6bb&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47). You must be a member of the Azure Communication Service TAP team.

As part of this preview, the Azure Communication Services SDKs can be used to build applications that enable bring your own identity (BYOI) users to start 1:1 calls or 1:n chats with Teams users. [Standard Azure Communication Services pricing](https://azure.microsoft.com/pricing/details/communication-services/) applies to these users, but there's no extra fee for the interoperability capability. Custom applications built with Azure Communication Services to connect and communicate with Teams users or Teams voice applications can be used by end users or by bots, and there's no differentiation in how they appear to Teams users in Teams applications unless explicitly indicated by the developer of the application with a display name.

To enable calling and chat between your Communication Services users and Teams tenant, allow your tenant via the [form](https://forms.office.com/r/F3WLqPjw0D) and enable the connection between the tenant and Communication Services resource.

[!INCLUDE [Enable interoperability in your Teams tenant](./../includes/enable-interoperability-for-teams-tenant.md)]
## Get Teams user ID

To start a call or chat with a Teams user or Teams Voice application, you need an identifier of the target. You have the following options to retrieve the ID:
- User interface of [Microsoft Entra ID](../troubleshooting-info.md?#getting-user-id) or with on-premises directory synchronization [Microsoft Entra Connect](../../../active-directory/hybrid/how-to-connect-sync-whatis.md)
- Programmatically via [Microsoft Graph API](/graph/api/resources/users)

## Calling
With the Calling SDK, a Communication Services user or endpoint can start a 1:1 call with Teams users, identified by their Microsoft Entra object ID. You can easily modify an existing application that calls other Communication Services users to call Teams users.
 
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
- This functionality isn't currently available in the .NET Calling SDK.
- Teams users must be in "TeamsOnly" mode. Skype for Business users can't receive 1:1 calls from Communication Services users.
- Escalation to a group call isn't supported.
- Communication Services call recording isn't available for 1:1 calls.
- Advanced call routing capabilities such as call forwarding, group call pickup, simultaneous ringing, and voice mail aren't supported.
- Teams users can't set Communication Services users as forwarding/transfer targets.
- Many features in the Teams client don't work as expected during 1:1 calls with Communication Services users.
- Third-party [devices for Teams](/MicrosoftTeams/devices/teams-ip-phones) and [Skype IP phones](/skypeforbusiness/certification/devices-ip-phones) aren't supported.

## Chat
With the Chat SDK, Communication Services users or endpoints can have group chats with Teams users, identified by their Microsoft Entra object ID. You can easily modify an existing application that creates chats with other Communication Services users to create chats with Teams users instead. Here is an example of how to use the Chat SDK to add Teams users as participants. To learn how to use Chat SDK to send a message, manage participants, and more, see our [quickstart](../../quickstarts/chat/get-started.md?pivots=programming-language-javascript).

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

To make testing easier, we've published a sample app [here](https://github.com/Azure-Samples/communication-services-web-chat-hero/tree/teams-interop-chat-adhoc). Update the app with your Communication Services resource, and interop enabled Teams tenant to get started. 

**Limitations and known issues** </br>
While in private preview, a Communication Services user can do various actions using the Communication Services Chat SDK, including sending and receiving plain and rich text messages, typing indicators, read receipts, real-time notifications, and more. However, most of the Teams chat features aren't supported. Here are some key behaviors and known issues:
- Communication Services users can only initiate chats. 
-    Communication Services users can't send images, or files to the Teams user. But they can receive images and files from the Teams user. Links to files and images can also be shared.
-    Communication Services users can delete the chat. This action removes the Teams user from the chat thread and hides the message history from the Teams client.
- Known issue: Communication Services users aren't displayed correctly in the participant list. They're currently displayed as External, but their people cards show inconsistent data. In addition, their displayname might not be shown properly in the Teams client.
- Known issue: The typing event from Teams side might contain a blank display name.
- Known issue: A chat can't be escalated to a call from within the Teams app. 
- Known issue: Editing of messages by the Teams user isn't supported. 

Please refer to [Chat Capabilities](../interop/guest/capabilities.md) to learn more. 

## Privacy
Interoperability between Azure Communication Services and Microsoft Teams enables your applications and users to participate in Teams calls, meetings, and chats. It is your responsibility to ensure that the users of your application are notified when recording or transcription are enabled in a Teams call or meeting.

Microsoft will indicate via the Azure Communication Services API that recording or transcription has commenced. You must communicate this fact in real time to your users within your application's user interface. You agree to indemnify Microsoft for all costs and damages incurred due to your failure to comply with this obligation.

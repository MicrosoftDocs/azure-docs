---
title: Teams calling interoperability
titleSuffix: An Azure Communication Services concept document
description: Teams calling interoperability
author: tomaschladek
ms.author: tchladek
ms.date: 10/15/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Teams Interoperability: Calling

[!INCLUDE [Public Preview](../../../communication-services/includes/public-preview-include-document.md)]

As part of this preview, the Azure Communication Services SDKs can be used to build applications that enable bring your own identity (BYOI) users to start 1:1 calls with Teams users. [Standard Azure Communication Services pricing](https://azure.microsoft.com/pricing/details/communication-services/) applies to these users, but there's no extra fee for the interoperability capability. Custom applications built with Azure Communication Services to connect and communicate with Teams users or Teams voice applications can be used by end users or by bots, and there's no differentiation in how they appear to Teams users in Teams applications unless explicitly indicated by the developer of the application with a display name.

To enable calling between your Communication Services users and Teams tenant, allow your tenant via the [form](https://forms.office.com/r/F3WLqPjw0D) and enable the connection between the tenant and Communication Services resource.

[!INCLUDE [Enable interoperability in your Teams tenant](./../includes/enable-interoperability-for-teams-tenant.md)]
## Get Teams user ID

To start a call with a Teams user or Teams Voice application, you need an identifier of the target. You have the following options to retrieve the ID:
- User interface of [Microsoft Entra ID](../troubleshooting-info.md?#getting-user-id) or with on-premises directory synchronization [Microsoft Entra Connect](/entra/identity/hybrid/connect/how-to-connect-sync-whatis)
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

## Privacy
Interoperability between Azure Communication Services and Microsoft Teams enables your applications and users to participate in Teams calls and meetings. It is your responsibility to ensure that the users of your application are notified when recording or transcription are enabled in a Teams call or meeting.

Microsoft will indicate via the Azure Communication Services API that recording or transcription has commenced. You must communicate this fact in real time to your users within your application's user interface. You agree to indemnify Microsoft for all costs and damages incurred due to your failure to comply with this obligation.

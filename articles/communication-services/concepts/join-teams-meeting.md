---
title: Teams meeting interoperability
titleSuffix: An Azure Communication Services concept document
description: Join Teams meetings
author: tomkau
ms.author: tomkau
ms.date: 10/15/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Join a Teams meeting

> [!IMPORTANT]
> BYOI interoperability is in public preview and available to all Communication Services applications and Teams organizations.
>
> Preview APIs and SDKs are provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Communication Services can be used to build applications that enable users to join and participate in Teams meetings. [Standard ACS pricing](https://azure.microsoft.com/pricing/details/communication-services/) applies to these users, but there's no additional fee for the interoperability capability itself. With the bring your own identity (BYOI) model, you control user authentication and users of your applications don't need Teams licenses to join Teams meetings. This is ideal for business-to-consumer solutions that enable licensed Teams users (for example, healthcare providers or financial advisors) and external users (for example, patients or clients) using a custom application to join into a virtual consultation experience.

It's also possible to use Microsoft 365 Teams identities with the Azure Communication Services SDKs. More information is available [here](./teams-interop.md).

It's currently not possible for a Teams user to join a call that was initiated using the Azure Communication Services Calling SDK.

## Enabling anonymous meeting join in your Teams tenant

When a BYOI user joins a Teams meeting, they're treated as an anonymous external user, similar to users that join a Teams meeting anonymously using the Teams web application. The ability for BYOI users to join Teams meetings as anonymous users is controlled by the existing "allow anonymous meeting join" configuration, which also controls the existing Teams anonymous meeting join. This setting can be updated in the [Teams admin center](https://admin.teams.microsoft.com/meetings/settings) or with the Teams PowerShell cmdlet [Set-CsTeamsMeetingConfiguration](/powershell/module/skype/set-csteamsmeetingconfiguration). Your custom application should consider user authentication and other security measures to protect Teams meetings. Be mindful of the security implications of enabling anonymous users to join meetings, and use the [Teams security guide](/microsoftteams/teams-security-guide#addressing-threats-to-teams-meetings) to configure capabilities available to anonymous users.

## Meeting experience

As with Teams anonymous meeting join, your application must have the meeting link to join, which can be retrieved via the Graph API or from the calendar in Microsoft Teams. The name of BYOI users displayed in Teams is configurable via the Communication Services Calling SDK and they're labeled as “external” to let Teams users know they haven't been authenticated using Azure Active Directory.

During a meeting, Communication Services users will be able to use core audio, video, screen sharing, and chat functionality via Azure Communication Services SDKs. Once a Communication Services user leaves the meeting or the meeting ends, they can no longer send or receive new chat messages, but they will have access to messages sent and received during the meeting. Anonymous Communication Services users cannot add additional participants to the meeting and they cannot start recording or transcription for the meeting.

Additional information on required dataflows for joining Teams meetings is available at the [client and server architecture page](client-and-server-architecture.md). The [Group Calling Hero Sample](../samples/calling-hero-sample.md) provides example code for joining a Teams meeting from a web application.

## Privacy
Interoperability between Azure Communication Services and Microsoft Teams enables your applications and users to participate in Teams calls, meetings, and chat. It is your responsibility to ensure that the users of your application are notified when recording or transcription are enabled in a Teams call or meeting.

Microsoft will indicate to you via the Azure Communication Services API that recording or transcription has commenced and you must communicate this fact, in real time, to your users within your application's user interface. You agree to indemnify Microsoft for all costs and damages incurred as a result of your failure to comply with this obligation.

## Limitations and known issues

- A BYOI user may join a Teams meeting that is scheduled for a Teams channel and use audio and video, but they will not be able to send or receive any chat messages, since they are not members of the channel.
- When using Microsoft Graph to [list the participants in a Teams meeting](https://docs.microsoft.com/graph/api/call-list-participants), details for Communication Services users are not currently included.
- Teams meetings support up to 1000 participants, but the Azure Communication Services Calling SDK currently only supports 350 participants.
- With [Cloud Video Interop for Microsoft Teams](https://docs.microsoft.com/microsoftteams/cloud-video-interop), some devices have seen issues when a Communication Services user shares their screen.
- Features such as raised hand, together mode, and breakout rooms are only available for Teams users.
- The Calling SDK does not currently support closed captions for Teams meetings.
- Communication Services users cannot join [Teams live events](https://docs.microsoft.com/microsoftteams/teams-live-events/what-are-teams-live-events)
- [Teams activity handler events](https://docs.microsoft.com/microsoftteams/platform/bots/bot-basics?tabs=csharp) for bots do not fire when Communication Services users join a Teams meeting.

## Next steps

> [!div class="nextstepaction"]
> [Join a BYOI calling app to a Teams meeting](../quickstarts/voice-video-calling/get-started-teams-interop.md)
> [Join a BYOI chat app to a Teams meeting](../quickstarts/chat/meeting-interop.md)

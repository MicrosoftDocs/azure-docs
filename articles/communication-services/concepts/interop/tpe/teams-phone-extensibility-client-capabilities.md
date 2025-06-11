---
title: Microsoft Teams Phone client capabilities in Calling client and Call Automation SDK
titleSuffix: An Azure Communication Services article
description: Conceptual documentation describing which capabilities Azure Communication Services Calling client and Call Automation SDKs support for Teams users in Teams Phone calls.
author: jacadd
manager: chpalm
services: azure-communication-services
ms.author: jacadd
ms.date: 05/20/2025
ms.topic: conceptual
ms.custom: public_preview
ms.service: azure-communication-services
---

# Microsoft Teams Phone client capabilities in Calling client and Call Automation SDK
    
This article describes which Microsoft Teams Phone client capabilities Azure Communication Services Calling client and Call Automation SDKs support for Teams Phone extensibility.

[!INCLUDE [public-preview-notice.md](../../../includes/public-preview-include-document.md)]

## Prerequisites

- Teams users must have a Teams Phone license.
- Teams users must be Enterprise Voice enabled.
- Agents in Azure Communication Services applications support the capabilities in the following table. Teams users aren't supported.

## Teams Phone client capabilities

The following list of capabilities is supported for scenarios where at least one phone number participates in 1:1 or group calls:

| **Group of features** | **Capability (from TPE perspective)** | **Client Calling SDK** | **Call Automation**  |
| --- | --- | --- | --- |
| Connectivity | Teams calling plans | ✔️ | ✔️ |
| | Teams direct routings | ✔️ | ✔️ |
| | Teams operator connect | ✔️ | ✔️ |
| Outbound Calling | Place outbound calls using Teams service phone number | ✔️ | ✔️ |
| | Receive early media when placing outbound calls | ✔️ | N/A |
| Inbound calling  | Support incoming PSTN call to Teams service phone number answered by call automation app and routed to agent | ✔️ | ✔️ |
| | Reject inbound call to Teams service phone number | ✔️ | ✔️ |
| Mid-call actions (signaling)  | Leave a connected call (without terminating the call) | ✔️  | ✔️  |
| | Terminate the entire call (ending the call for all participants) | ✔️ | ✔️ |
| | Add an agent to an ongoing call | ✔️ | ✔️ |
| | Add external phone number from an ongoing call | ✔️  | ✔️ |
| | Cancel an already initiated add participant request, as long as the the target agent / phone number has yet to accept the call invite | ❌ | ✔️ |
| | Remove a call participant from ongoing call | ✔️ | ✔️  |
| | Dial out to same phone number multiple times in a call | ❌ | ❌ |
| | Transfer the end user from ongoing 1:1 call to another agent or external phone number | ✔️ | ✔️ |
| | Transfer the end user from ongoing group call to another agent or external phone number | ❌ | ✔️ |
| | Retrieve call properties (`GetCall`) | N/A  | ✔️ |
| | Send custom context as part of call invite  (AddParticipant and Transfer) | ❌ | ✔️ |
| | Receive custom context as part of call invite (AddParticipant and Transfer) | ✔️ | ✔️ |
| | Send and receive SIP headers (UUI and X-header) as part of call invite to and from SIP endpoints | N/A | ✔️ |
| Mid-call actions (media)  | Developer can play audio (from audio file or text/SSML) to target participant (end user or an agent) | N/A | ✔️ |
| | Developer can play audio (from audio file or text/SSML) to all call participants | N/A | ✔️ |
| | Developer can recognize DTMF input from a particular call participant (end user or agent) | N/A | ✔️ |
| | Developer can recognize speech (phrases or free form using speech-to-text feature) input from a particular participant (end user or agent) | N/A | ✔️ |
| | Send DTMF tones, manually, to a PSTN participant in a 1:1 call to navigate the calling party’s IVR (no DTMF buffering) | ✔️ | ✔️ |
| | Send DTMF tones, manually, to a specific PSTN participant in a group call to navigate the calling party’s IVR (no DTMF buffering) | ❌ | ✔️ |
| | DTMF buffering support | ❌ | ❌ |
| | Cancel all Media Operations | ❌ | ✔️ |
| | Start continuous DTMF Recognition from end user | N/A  | ✔️ |
| | Stream real-time transcript of the call to a WebSocket | N/A | ✔️ |
| | Mute other VoIP participants (such as other agents) | ✔️ | ✔️ |
| | Mute other PSTN users | ❌ | ❌ |
| | Place call on hold and take call off hold (1:1 call only) | ✔️ | ❌ |
| | Play music to the participant put on hold | ❌ | ✔️ |
| | Developer/agent can stream real-time audio out of the call to a WebSocket| N/A | ✔️ |
| Mid call media controls and device management | Existing Client Calling capabilities conform to [Calling SDK Features](../../../concepts/voice-video-calling/calling-sdk-features.md) | ✔️ | ❌ |
| Accessibility  | Agent can turn on Teams closed captions | ❌ | N/A |
| Emergency calling  | Agent can make an emergency call | ✔️ | N/A |
| | Honor Security desk policy for emergency calls | ✔️ | N/A |
| | Provide a statically registered emergency address for Teams calling plans, Operator Connect, and Direct Routing for emergency calls | ✔️ | N/A |
| Roster management  | List call participants | ✔️  | ✔️  |
| | Adding Teams user honors Teams federation & external access configuration (tenant to tenant federation) | ❌ | ❌ |
| Recording | Teams convenience and compliance recording | ❌  | ❌  |
| | Azure Communication Services Recording | ✔️ | ✔️ |
| Conversational AI | Developers can use the Recognize API to build conversational AI experiences in their IVRs or conversational AI bots. Recognize API uses Azure AI speech models for NLU | N/A | ✔️ |
| | Developers can use their custom AI models when using the Recognize API so that industry/organization specific speech recognition can be used for conversational AI experiences. Recognize API would use custom AI speech models for NLU | N/A | ✔️  |
| | Developers can use Outbound Audio Streaming to connect their IVRs for conversational AI experiences | N/A | ✔️ |
| | Developers can use Play API to play audio prompts for conversational AI experiences | N/A | ✔️ |
| Advanced call routing | Does start a call and add user operations honor forwarding rules | ❌ | ❌ |
| | Read and configure call forwarding rules | ❌ | ❌ |
| | Does start a call and add user operations honor simultaneous ringing| ❌ | ❌ |
| | Place a phone call honors location-based routing | ❌ | ❌ |
| | Does start a call and add user operations honor shared line configuration | ❌ | ❌ |
| | Start a phone call honoring dial plan policy | ✔️ | ✔️ |
| | Park a call | ❌ | ❌ |
| | Be parked | ❌ | ❌ |
| DevOps | Developers can access API operational metrics under Azure Metrics | ✔️ | ✔️ |
| | Developer can access call diagnostics under [Call Diagnostics Center](../../../concepts/voice-video-calling/call-diagnostics.md) | ✔️ | ✔️ |
| | Developers can subscribe to get API and call logs under [Azure Monitor](../../analytics/logs/voice-and-video-logs.md) | ✔️ | ✔️ |
| | Developers can get insights about their resource usage under [Azure Communication Services Insights](../../analytics/logs/voice-and-video-logs.md) | ✔️ | ✔️ |
| | Developers can subscribe to receive call state and roster changes events via Event Grid: [Azure Communication Services Voice and video calling events](../../../quickstarts/voice-video-calling/handle-calling-events.md) | ❌  | ❌  |
| Call restrictions  | Call restriction policies assigned to the Teams Resource account are honored | ✔️ | ✔️ |

<!-- | Teams caller ID policies | Replace the caller ID with Replace the caller ID with this service number (Outbound PSTN call from the Teams Resource account honors its assigned Caller ID policy in the Teams Admin Center) | ✔️ | N/A |
| | Block incoming caller ID | ✔️  | ✔️ |
| | Override the caller ID policy | ✔️ | ✔️ |
| | Calling Party Name | ✔️ | ✔️ |
| | Replace the caller ID with Direct Routing or Operator Connect service number | ✔️ | ✔️ |
| | Replace the caller ID with Teams Phone service number | ✔️ | ✔️ |
| Dial Plan | Outbound PSTN call from the Teams Resource account honors its assigned Dial plan policy in the Teams Admin Center | N/A | ✔️ |
| | Outbound emergency call from the Teams user account honors its assigned dial plan policy in the Teams Admin center | ✔️ | N/A | -->

- \* Participants joining via phone number can't see video content. So actions involving video don't affect them but can apply when VoIP participants join.

## Next Steps

- [Microsoft Teams Phone overview](/microsoftteams/what-is-phone-system-in-office-365)
- [Set up Microsoft Teams Phone in your organization](/microsoftteams/setting-up-your-phone-system)
- [Access a user's Teams Phone separate from their Teams client](https://github.com/Azure/communication-preview/blob/master/Teams%20Phone%20Extensibility/teams-phone-extensibility-access-teams-phone.md)
- [Answer Teams Phone calls from Call Automation](https://github.com/Azure/communication-preview/blob/master/Teams%20Phone%20Extensibility/teams-phone-extensibility-answer-teams-calls.md)

## Related articles

- [Teams Phone extensibility overview](./teams-phone-extensibility-overview.md)
- [Teams Phone extensibility FAQ](./teams-phone-extensibility-faq.md)

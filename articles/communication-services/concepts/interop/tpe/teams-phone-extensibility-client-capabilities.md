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
- PP: Private Preview
- PuP: Public Preview
- GA: General Availability

| **Group of features** | **Capability (from TPE perspective)**  | **Release** | **Client Calling SDK** | **Call Automation**  |
| --- | --- | --- | --- | --- |
| Connectivity | Teams calling plans | PP | ✔️  | ✔️  |
| | Teams direct routings | PP | ✔️  | ✔️  |
| | Teams operator connect  | PP | ✔️  | ✔️  |
| Outbound Calling | Place outbound calls using Teams service phone number | PP | ✔️  | ✔️  |
| | Receive early media when placing outbound calls  | PP | ✔️  | N/A |
| Inbound calling  | Support incoming PSTN call to Teams service phone number answered by call automation app and routed to agent | PP | ✔️  | ✔️  |
| | Reject inbound call to Teams service phone number  | PP | ✔️  | ✔️  |
| Mid-call actions (signaling)  | Leave a connected call (without terminating the call)  | PP | ✔️  | ✔️  |
| | Terminate the entire call (ending the call for all participants)  | PP | ✔️  | ✔️  |
| | Add an agent to an ongoing call | PP | ✔️  | ✔️  |
| | Add external phone number from an ongoing call  | PP | ✔️  | ✔️  |
| | Cancel an already initiated add participant request, as long as the the target agent / phone number has yet to accept the call invite | PP | ❌  | ✔️  |
| | Remove a call participant from ongoing call | PP | ✔️  | ✔️  |
| | Dial out to same phone number multiple times in a call | N/A | ❌  | ❌  |
| | Transfer the end user from ongoing 1:1 call to another agent or external phone number  | PP | ✔️  | ✔️  |
| | Transfer the end user from ongoing group call to another agent or external phone number  | PP | ❌ | ✔️  |
| | Retrieve call properties (`GetCall`)  | PP | N/A  | ✔️  |
| | Send custom context as part of call invite  (AddParticipant and Transfer)  | PP | ❌  | ✔️  |
| | Receive custom context as part of call invite (AddParticipant and Transfer)  | PP | ✔️  | ✔️  |
| | Send and receive SIP headers (UUI and X-header) as part of call invite to and from SIP endpoints  | PP | N/A | ✔️  |
| Mid-call actions (media)  | Developer can play audio (from audio file or text/SSML) to target participant (end user or an agent) | PP | N/A | ✔️  |
| | Developer can play audio (from audio file or text/SSML) to all call participants  | PP | N/A | ✔️  |
| | Developer can recognize DTMF input from a particular call participant (end user or agent) | PP | N/A | ✔️  |
| | Developer can recognize speech (phrases or free form using speech-to-text feature) input from a particular participant (end user or agent)  | PP | N/A | ✔️  |
| | Send DTMF tones, manually, to a PSTN participant in a 1:1 call to navigate the calling party’s IVR (no DTMF buffering) | PP | ✔️  | ✔️  |
| | Send DTMF tones, manually, to a specific PSTN participant in a group call to navigate the calling party’s IVR (no DTMF buffering) | PP | ❌  | ✔️  |
| | DTMF buffering support | N/A | ❌  | ❌  |
| | Cancel all Media Operations | PP | ❌  | ✔️  |
| | Start continuous DTMF Recognition from end user  | PP | N/A  | ✔️  |
| | Stream real-time transcript of the call to a WebSocket  | PP | N/A | ✔️  |
| | Mute other VoIP participants (such as other agents)  | PP | ✔️  | ✔️  |
| | Mute other PSTN users  | N/A | ❌  | ❌  |
| | Place call on hold and take call off hold (1:1 call only)   | PP | ✔️  | ❌ |
| | Play music to the participant put on hold  | N/A | ❌  | ✔️ |
| | Developer/agent can stream real-time audio out of the call to a WebSocket | PP | N/A | ✔️  |
| Mid call media controls and device management | Existing Client Calling capabilities conform to [Calling SDK Features](../../../concepts/voice-video-calling/calling-sdk-features.md) | N/A | ✔️ | ❌ |
| Accessibility  | Agent can turn on Teams closed captions  | N/A | ❌  | N/A |
| Emergency calling  | Agent can make an emergency call | PP | ✔️  | N/A |
| | Honor Security desk policy for emergency calls  | PP | ✔️  | N/A |
| | Provide a statically registered emergency address for Teams calling plans, Operator Connect, and Direct Routing for emergency calls | PP | ✔️  | N/A |
| Roster management  | List call participants  | PP | ✔️  | ✔️  |
| | Adding Teams user honors Teams federation & external access configuration (tenant to tenant federation)  | N/A | ❌ | ❌ |
| Recording  | Teams convenience and compliance recording | N/A | ❌  | ❌  |
| | Azure Communication Services Recording | PP | ✔️  | ✔️  |
| Conversational AI | Developers can use the Recognize API to build conversational AI experiences in their IVRs or conversational AI bots. Recognize API uses Azure AI speech models for NLU  | PP | N/A | ✔️  |
| | Developers can use their custom AI models when using the Recognize API so that industry/organization specific speech recognition can be used for conversational AI experiences. Recognize API would use custom AI speech models for NLU  | PP | N/A | ✔️  |
| | Developers can use Outbound Audio Streaming to connect their IVRs for conversational AI experiences  | PP | N/A | ✔️  |
| | Developers can use Play API to play audio prompts for conversational AI experiences | PP | N/A | ✔️  |
| Advanced call routing | Does start a call and add user operations honor forwarding rules | N/A | ❌  | ❌  |
| | Read and configure call forwarding rules | N/A | ❌  | ❌  |
| | Does start a call and add user operations honor simultaneous ringing | N/A | ❌  | ❌  |
| | Place a phone call honors location-based routing  | N/A | ❌  | ❌  |
| | Does start a call and add user operations honor shared line configuration | N/A | ❌  | ❌  |
| | Start a phone call honoring dial plan policy  | PP | ✔️  | ✔️  |
| | Park a call  | N/A | ❌  | ❌  |
| | Be parked  | N/A | ❌  | ❌  |
| DevOps | Developers can access API operational metrics under Azure Metrics  | PuP | ✔️  | ✔️  |
| | Developer can access call diagnostics under [Call Diagnostics Center](../../../concepts/voice-video-calling/call-diagnostics.md) | PuP | ✔️  | ✔️  |
| | Developers can subscribe to get API and call logs under [Azure Monitor](../../analytics/logs/voice-and-video-logs.md) | PuP | ✔️  | ✔️  |
| | Developers can get insights about their resource usage under [Azure Communication Services Insights](../../analytics/logs/voice-and-video-logs.md)  | PuP | ✔️  | ✔️  |
| | Developers can subscribe to receive call state and roster changes events via Event Grid: [Azure Communication Services Voice and video calling events](../../../quickstarts/voice-video-calling/handle-calling-events.md) | N/A | ❌  | ❌  |
| Call restrictions  | Call restriction policies assigned to the Teams Resource account are honored | PP | ✔️  | ✔️  |

<!-- | Teams caller ID policies  | Replace the caller ID with Replace the caller ID with this service number (Outbound PSTN call from the Teams Resource account honors its assigned Caller ID policy in the Teams Admin Center) | GA  | ✔️  | N/A |
| | Block incoming caller ID  | GA  | ✔️  | ✔️  |
| | Override the caller ID policy  | GA  | ✔️  | ✔️  |
| | Calling Party Name  | GA  | ✔️  | ✔️  |
| | Replace the caller ID with Direct Routing or Operator Connect service number  | GA  | ✔️  | ✔️  |
| | Replace the caller ID with Teams Phone service number | GA  | ✔️  | ✔️  |
| Dial Plan  | Outbound PSTN call from the Teams Resource account honors its assigned Dial plan policy in the Teams Admin Center  | PP | N/A  | ✔️  |
| | Outbound emergency call from the Teams user account honors its assigned dial plan policy in the Teams Admin center | PP | ✔️  | N/A | -->

- \* Participants joining via phone number can't see video content. So actions involving video don't affect them but can apply when VoIP participants join.

## Next Steps

- [Microsoft Teams Phone overview](/microsoftteams/what-is-phone-system-in-office-365)
- [Set up Microsoft Teams Phone in your organization](/microsoftteams/setting-up-your-phone-system)
- [Access a user's Teams Phone separate from their Teams client](https://github.com/Azure/communication-preview/blob/master/Teams%20Phone%20Extensibility/teams-phone-extensibility-access-teams-phone.md)
- [Answer Teams Phone calls from Call Automation](https://github.com/Azure/communication-preview/blob/master/Teams%20Phone%20Extensibility/teams-phone-extensibility-answer-teams-calls.md)

## Related articles

- [Teams Phone extensibility overview](./teams-phone-extensibility-overview.md)
- [Teams Phone extensibility FAQ](./teams-phone-extensibility-faq.md)

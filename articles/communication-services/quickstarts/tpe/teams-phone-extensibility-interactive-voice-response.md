---
title: Teams Phone Extensibility IVR for Teams Auto Attendant
titleSuffix: An Azure Communication Services article
description: Learn how to build an IVR bot that integrates with Microsoft Teams Auto Attendant using Azure Communication Services and Teams Phone Extensibility
author: henikaraa
manager: dariac
services: azure-communication-services
ms.author: henikaraa
ms.date: 06/10/2026
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: call-automation
---

# Build an IVR Bot for Teams Auto Attendant
This guide shows how to build an IVR (Interactive Voice Response) bot that works with a Microsoft Teams Auto Attendant by using Azure Communication Services Call Automation and Teams Phone Extensibility.
After completing this quickstart, you can:
- Answer calls routed from a Teams Auto Attendant
- Play prompts and collect caller input
- Transfer or conference the call to a person or department


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A Communication Services resource, see [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A configured Event Grid endpoint. [Incoming call concepts - An Azure Communication Services concept document](../../concepts/call-automation/incoming-call-notification.md#receiving-an-incoming-call-notification-from-event-grid)
- A Microsoft [Teams Auto Attendant configured with a resource account](/microsoftteams/aa-cq-plan-third-party-voice-agents) and phone number, linked to your ACS resource.
- An Azure AI Services (Cognitive Services) resource linked to your Communication Services resource. This is required for the text-to-speech (`TextSource`) and speech recognition used later in this quickstart. See [Connect Azure Communication Services with Azure AI services](../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- An application or service endpoint to host your IVR bot logic. This must be reachable by Azure Communication Services events.

## Receive and answer the incoming call

When a Teams Auto Attendant routes a call, Azure Communication Services sends an `IncomingCall` event to your webhook.

The event includes caller details and custom context from Teams. Your IVR bot must handle this event and answer the call by using the Call Automation client.

```csharp
// The opaque IncomingCallContext token comes from the AcsIncomingCallEventData
// payload (Event Grid system event) and must be passed verbatim to AnswerCallAsync.
string incomingCallContext = incomingCallEvent.IncomingCallContext;

// Use AnswerCallOptions to point the Call Intelligence subsystem at your Azure AI
// Services endpoint so that TextSource (TTS) and the recognize operation work.
var answerOptions = new AnswerCallOptions(
    incomingCallContext,
    new Uri("<YOUR_IVR_CALLBACK_ENDPOINT>"))
{
    CallIntelligenceOptions = new CallIntelligenceOptions
    {
        CognitiveServicesEndpoint = new Uri("<YOUR_AZURE_AI_SERVICES_ENDPOINT>")
    }
};

AnswerCallResult answerResult = await callAutomationClient.AnswerCallAsync(answerOptions);

// Get a reference to the live call connection.
CallConnection callConnection = answerResult.CallConnection;
```

## Play a greeting to the caller
Once the call is answered, your IVR bot can play a welcome message or menu prompt to the caller. You can use the Play operation to play an audio file or spoken text (using text-to-speech). 
```csharp
// Prepare a text-to-speech prompt to play to the caller
var ttsPrompt = new TextSource(
    "Welcome to Contoso IVR. Press 1 for Sales, or 2 for Support."
);

// Get CallMedia from the CallConnection
var callMedia = callConnection.GetCallMedia();

// Play the prompt to all participants
await callMedia.PlayToAllAsync(ttsPrompt);
```
Azure uses text-to-speech to play the prompt to the caller. The prompt presents the available menu options.

## Collect caller input by using DTMF or speech
After playing the menu, the IVR collects input from the caller.
You can collect input in two ways:
- DTMF tones
- Speech recognition
This example uses DTMF for simplicity. Azure Communication Services provides the Recognize operation to play a prompt and listen for caller input
```csharp
// Start DTMF recognition and handle results via events (Call Automation is event-driven)

// 1. Start recognizing a single DTMF digit.
var callMedia = callConnection.GetCallMedia();
// The caller identity comes from the 'fromCommunicationIdentifier' field on the
// AcsIncomingCallEventData payload. Convert its RawId into a CommunicationIdentifier.
CommunicationIdentifier caller = CommunicationIdentifier.FromRawId(
  incomingCallEvent.FromCommunicationIdentifier.RawId);

var recognizeOptions = new CallMediaRecognizeDtmfOptions(
    targetParticipant: caller,
    maxTonesToCollect: 1)
{
    InterToneTimeout = TimeSpan.FromSeconds(5),
    InterruptPrompt = true,
    InitialSilenceTimeout = TimeSpan.FromSeconds(5),
    Prompt = new TextSource("Please enter your selection now."),
    StopTones = new List<DtmfTone> { DtmfTone.Pound }
};

await callMedia.StartRecognizingAsync(recognizeOptions);

// -------------------------------------------------------------------
// 2. Handle recognition results in your callback endpoint.
//    'parsedEvent' is produced from the webhook request body via
//    CallAutomationEventParser.Parse(BinaryData) — or ParseMany(BinaryData)
//    when the payload contains a batch of CloudEvents.
// -------------------------------------------------------------------

if (parsedEvent is RecognizeCompleted recognizeCompleted &&
    recognizeCompleted.RecognizeResult is DtmfResult dtmfResult)
{
    var tones = dtmfResult.Tones;

    if (tones.Contains(DtmfTone.One))
    {
        // User pressed 1 → handle "Sales" option.
    }
    else if (tones.Contains(DtmfTone.Two))
    {
        // User pressed 2 → handle "Support" option.
    }
    else
    {
        // Unrecognized input → repeat menu or take fallback action.
    }
}
else if (parsedEvent is RecognizeFailed)
{
    // Handle timeout, silence, or invalid input scenarios.
}
```

## Transfer the call to a person or queue

Azure Communication Services supports two ways to hand off the call to Teams:

- AddParticipant: add a Teams user (for example, a human agent) to the active call. The IVR stays on the call, so it can continue narrating, hand back, or collect more input.
- TransferCallToParticipant: transfer the call to a Teams Call Queue resource account (or any other target). The IVR is removed from the call when the transfer succeeds.

Custom calling context attached to the operation flows through to the receiving Teams client. For Teams identifiers (MicrosoftTeamsUserIdentifier, MicrosoftTeamsAppIdentifier, TeamsExtensionUserIdentifier) only VoIP headers are supported — SIP X-headers and SIP UUI are PSTN-only. Use VoIP headers to carry IVR selections, correlation IDs, or any other handoff metadata.

### Add a Teams agent to the call

```csharp
// Wrap the Teams user identity in a CallInvite.
var agent = new MicrosoftTeamsUserIdentifier("<entra-user-object-id>");
var callInvite = new CallInvite(agent);

// Attach VoIP headers — these propagate to the receiving Teams client.
// (SIP headers are not supported for Teams identifiers; only the PSTN CallInvite
//  overload exposes a non-null SipHeaders dictionary.)
callInvite.CustomCallingContext.AddVoip("IVR-Selection", "Support");
callInvite.CustomCallingContext.AddVoip("IVR-CallId", callConnection.CallConnectionId);

var addParticipantOptions = new AddParticipantOptions(callInvite)
{
    OperationContext = "AddSupportAgent"
};

await callConnection.AddParticipantAsync(addParticipantOptions);
```

### Transfer the call to a Teams Call Queue

A Teams Call Queue is a Teams Voice application backed by a resource account; target it via `MicrosoftTeamsAppIdentifier` using the bot object ID for the queue's underlying app, and call `TransferCallToParticipantAsync`. After the transfer succeeds, the IVR is no longer on the call.

```csharp
var queue = new MicrosoftTeamsAppIdentifier("<entra-bot-object-id>");

var transferOptions = new TransferToParticipantOptions(queue)
{
    OperationContext = "TransferToSupportQueue"
};

// Optional: forward IVR context to the receiving Teams agent via VoIP headers
// (the only header type supported for Teams identifiers on transfer).
transferOptions.CustomCallingContext.AddVoip("IVR-Selection", "Support");

await callConnection.TransferCallToParticipantAsync(transferOptions);
```

## Pass call context between Teams and the IVR
Azure Communication Services can deliver call context to your IVR through the **IncomingCall** event payload:
### From Teams AA to IVR
When the call is transferred to the Teams resource account associated with your ACS resource, your application receives an **IncomingCall** event (via Event Grid). The event payload exposes a customContext object (with voipHeaders and sipHeaders dictionaries) and a sibling correlationId field. Your IVR can read these for logging and event correlation.
> [!NOTE]
> Teams Auto Attendant does not automatically serialize DTMF menu selections into the custom context passed to the next hop. To forward caller intent to your IVR, configure your AA call flow to populate custom context (for example, via SIP UUI headers) before the transfer. Your IVR can then read this from customContext.sipHeaders in the IncomingCall event payload. 

### Correlate Call Automation events to your business logic
Call Automation actions are event-driven. Set an OperationContext value on each action (AddParticipant, TransferCallToParticipant, Play, StartRecognizing, and so on) and use it to match the subsequent callback events back to the originating IVR step.

## Custom context schema

When the third-party IVR transfers a call into Teams, it can populate a CustomContext.CallDetails payload that's delivered to the Teams client and rendered in the call notification and the agent side panel. Populate these fields by attaching VoIP headers to the custom calling context on the CallInvite (for AddParticipant) or on TransferToParticipantOptions (for TransferCallToParticipant) before invoking the operation. SIP headers aren't supported for Teams identifiers — only VoIP headers propagate to Teams clients. The Teams Phone Unify integration program defines the specific VoIP header-key serialization that maps to each field below.

The supported fields are:

### Call details

| Field | Type | Populated by | Description |
|---|---|---|---|
| CustomContext.CallDetails.SessionId | string | Auto Attendant (during the incoming call flow) | ID identifying this call session. The call-id is passed in this field. The IVR can use it for telemetry and reporting. |
| CustomContext.CallDetails.CallTopic | string | IVR (based on caller interaction) | Short description of the reason for the call (max 48 characters), shown in the Teams call notification and on the side panel. Example: "Concern with medication". |
| CustomContext.CallDetails.CallContext | string | IVR (based on caller interaction) | Summary of the call so far. Displayed on the side panel in the Teams UI. |
| CustomContext.CallDetails.CallSentiment | string | IVR (based on caller interaction) | Caller's sentiment during their interaction with the IVR (for example, Neutral, Agitated). Displayed on the side panel in the Teams UI. |

### Caller details

| Field | Type | Populated by | Description |
|---|---|---|---|
| CustomContext.CallDetails.CallerDetails.Name | string | IVR (from CRM records or other sources) | Caller's name. Displayed on the side panel in the Teams UI. |
| CustomContext.CallDetails.CallerDetails.PhoneNumber | string | IVR (from CRM records or other sources) | Caller's phone number. Displayed on the side panel in the Teams UI. |
| CustomContext.CallDetails.CallerDetails.RecordId | string | IVR (from CRM records or other sources) | Caller's record ID in CRM or other sources. Displayed on the side panel in the Teams UI. |
| CustomContext.CallDetails.CallerDetails.ScreenPopUrl | string | IVR | CRM URL where the Teams agent can access the caller's records. Displayed on the side panel in the Teams UI. |
| CustomContext.CallDetails.CallerDetails.IsAuthenticated | bool | IVR | Indicates whether the caller was authenticated by the IVR. |
| CustomContext.CallDetails.CallerDetails.AdditionalCallerInformation | IDictionary<string, string> | IVR | Set of key/value pairs (max 10 — additional entries are ignored) that the bot author wants to surface to the Teams agent. |

> [!NOTE]
> All CallDetails fields are optional. If a field isn't populated, the corresponding row is omitted from the Teams side panel. CallTopic is the field most prominently surfaced — populate it for every transfer when possible.


## Next steps

- [Microsoft Teams Phone overview](/microsoftteams/what-is-phone-system-in-office-365)
- [Set up Microsoft Teams Phone in your organization](/microsoftteams/setting-up-your-phone-system)
- [Access a user's Teams Phone separate from their Teams client](/azure/communication-services/quickstarts/tpe/teams-phone-extensibility-access-teams-phone)
- [Answer Teams Phone calls from Call Automation](/azure/communication-services/quickstarts/tpe/teams-phone-extensibility-answer-teams-calls)

## Related articles

- [Teams Phone extensibility overview](/azure/communication-services/concepts/interop/tpe/teams-phone-extensibility-overview)
- [Teams Phone extensibility FAQ](/azure/communication-services/concepts/interop/tpe/teams-phone-extensibility-faq)

---
title: Quickstart - Make an outbound call using Call Automation
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to make an outbound PSTN call using Azure Communication Services Call Automation
author: anujb-msft
ms.author: anujb-msft
ms.date: 11/29/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: call-automation
ms.custom: mode-other
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A [phone number](../../telephony/get-phone-number.md) in your Azure Communication Services resource that can make outbound calls. If you have a free subscription, you can [get a trial phone number](../../telephony/get-trial-phone-number.md).
- Create and host an Azure Dev Tunnel. Instructions [here](/azure/developer/dev-tunnels/get-started).
- Create and connect [a Multi-service Azure AI services to your Azure Communication Services resource](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](../../../../ai-services/cognitive-services-custom-subdomains.md) for your Azure AI services resource. 
- (Optional) A Microsoft Teams user with a phone license that is `voice` enabled. Teams phone license is required to add Teams users to the call. Learn more about Teams licenses [here](https://www.microsoft.com/microsoft-teams/compare-microsoft-teams-bundle-options).  Learn about enabling phone system with `voice` [here](/microsoftteams/setting-up-your-phone-system).

## Sample code

Download or clone quickstart sample code from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/CallAutomation_OutboundCalling).

Navigate to `CallAutomation_OutboundCalling` folder and open the solution in a code editor.

## Setup and host your Azure DevTunnel

[Azure DevTunnels](/azure/developer/dev-tunnels/overview) is an Azure service that enables you to share local web services hosted on the internet. Run the commands to connect your local development environment to the public internet. DevTunnels creates a persistent endpoint URL and which allows anonymous access. We use this endpoint to notify your application of calling events from the Azure Communication Services Call Automation service.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```

## Update your application configuration

Next update your `Program.cs` file with the following values:

- `acsConnectionString`: The connection string for your Azure Communication Services resource. You can find your Azure Communication Services connection string using the instructions [here](../../create-communication-resource.md). 
- `callbackUriHost`: Once you have your DevTunnel host initialized, update this field with that URI.
- `acsPhonenumber`: update this field with the Azure Communication Services phone number you have acquired. This phone number should use the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)
- `targetPhonenumber`: update field with the phone number you would like your application to call. This phone number should use the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)
- `cognitiveServiceEndpoint`: update field with your Azure AI services endpoint.
- `targetTeamsUserId`: (Optional) update field with the Microsoft Teams user Id you would like to add to the call. See [Use Graph API to get Teams user Id](../../../how-tos/call-automation/teams-interop-call-automation.md#step-2-use-the-graph-api-to-get-microsoft-entra-object-id-for-teams-users-and-optionally-check-their-presence).

```csharp
// Your ACS resource connection string 
var acsConnectionString = "<ACS_CONNECTION_STRING>"; 

// Your ACS resource phone number will act as source number to start outbound call 
var acsPhonenumber = "<ACS_PHONE_NUMBER>"; 
 
// Target phone number you want to receive the call. 
var targetPhonenumber = "<TARGET_PHONE_NUMBER>";

// Base url of the app 
var callbackUriHost = "<CALLBACK_URI_HOST_WITH_PROTOCOL>"; 

// Your cognitive service endpoint 
var cognitiveServiceEndpoint = "<COGNITIVE_SERVICE_ENDPOINT>";

// (Optional) User Id of the target teams user you want to receive the call.
var targetTeamsUserId = "<TARGET_TEAMS_USER_ID>";
```

## Make an outbound call

To make the outbound call from Azure Communication Services, this sample uses the `targetPhonenumber` you defined earlier in the application to create the call using the `CreateCallAsync` API. This code will make an outbound call using the target phone number.

```csharp
PhoneNumberIdentifier target = new PhoneNumberIdentifier(targetPhonenumber);
PhoneNumberIdentifier caller = new PhoneNumberIdentifier(acsPhonenumber);
var callbackUri = new Uri(callbackUriHost + "/api/callbacks");
CallInvite callInvite = new CallInvite(target, caller);
var createCallOptions = new CreateCallOptions(callInvite, callbackUri) {
  CallIntelligenceOptions = new CallIntelligenceOptions() {
    CognitiveServicesEndpoint = new Uri(cognitiveServiceEndpoint)
  }
};
CreateCallResult createCallResult = await callAutomationClient.CreateCallAsync(createCallOptions);
```

## Handle call automation events

Earlier in our application, we registered the `callbackUriHost` to the Call Automation Service. The host indicates the endpoint the service requires to notify us of calling events that happen. We can then iterate through the events and detect specific events our application wants to understand. In the code be below we respond to the `CallConnected` event.

```csharp
app.MapPost("/api/callbacks", async (CloudEvent[] cloudEvents, ILogger < Program > logger) => {
  foreach(var cloudEvent in cloudEvents) {
    logger.LogInformation($"Event received: {JsonConvert.SerializeObject(cloudEvent)}");
    CallAutomationEventBase parsedEvent = CallAutomationEventParser.Parse(cloudEvent);
    logger.LogInformation($"{parsedEvent?.GetType().Name} parsedEvent received for call connection id: {parsedEvent?.CallConnectionId}");
    var callConnection = callAutomationClient.GetCallConnection(parsedEvent.CallConnectionId);
    var callMedia = callConnection.GetCallMedia();
    if (parsedEvent is CallConnected) {
      //Handle Call Connected Event
    }
  }
});
```

## (Optional) Add a Microsoft Teams user to the call

You can add a Microsoft Teams user to the call using the `AddParticipantAsync` method with a `MicrosoftTeamsUserIdentifier` and the Teams user's Id. You first need to complete the prerequisite step [Authorization for your Azure Communication Services Resource to enable calling to Microsoft Teams users](../../../how-tos/call-automation/teams-interop-call-automation.md#step-1-authorization-for-your-azure-communication-services-resource-to-enable-calling-to-microsoft-teams-users). Optionally, you can also pass in a `SourceDisplayName` to control the text displayed in the toast notification for the Teams user.

```csharp
await callConnection.AddParticipantAsync(
    new CallInvite(new MicrosoftTeamsUserIdentifier(targetTeamsUserId))
    {
        SourceDisplayName = "Jack (Contoso Tech Support)"
    });
```

## Start recording a call

The Call Automation service also enables the capability to start recording and store recordings of voice and video calls. You can learn more about the various capabilities in the Call Recording APIs [here](../../voice-video-calling/get-started-call-recording.md).

```csharp
CallLocator callLocator = new ServerCallLocator(parsedEvent.ServerCallId);
var recordingResult = await callAutomationClient.GetCallRecording().StartAsync(new StartRecordingOptions(callLocator));
recordingId = recordingResult.Value.RecordingId;
```

## Play welcome message and recognize

Using the `TextSource`, you can provide the service with the text you want synthesized and used for your welcome message. The Azure Communication Services Call Automation service plays this message upon the `CallConnected` event.

Next, we pass the text into the `CallMediaRecognizeChoiceOptions` and then call `StartRecognizingAsync`. This allows your application to recognize the option the caller chooses.

```csharp
if (parsedEvent is CallConnected callConnected) {
  logger.LogInformation($"Start Recording...");
  CallLocator callLocator = new ServerCallLocator(parsedEvent.ServerCallId);
  var recordingResult = await callAutomationClient.GetCallRecording().StartAsync(new StartRecordingOptions(callLocator));
  recordingId = recordingResult.Value.RecordingId;

  var choices = GetChoices();

  // prepare recognize tones 
  var recognizeOptions = GetMediaRecognizeChoiceOptions(mainMenu, targetPhonenumber, choices);

  // Send request to recognize tones 
  await callMedia.StartRecognizingAsync(recognizeOptions);
}

CallMediaRecognizeChoiceOptions GetMediaRecognizeChoiceOptions(string content, string targetParticipant, List < RecognitionChoice > choices, string context = "") {
  var playSource = new TextSource(content) {
    VoiceName = SpeechToTextVoice
  };

  var recognizeOptions = new CallMediaRecognizeChoiceOptions(targetParticipant: new PhoneNumberIdentifier(targetParticipant), choices) {
    InterruptCallMediaOperation = false,
      InterruptPrompt = false,
      InitialSilenceTimeout = TimeSpan.FromSeconds(10),
      Prompt = playSource,
      OperationContext = context
  };
  return recognizeOptions;
}

List < RecognitionChoice > GetChoices() {
  return new List < RecognitionChoice > {
    new RecognitionChoice("Confirm", new List < string > {
      "Confirm",
      "First",
      "One"
    }) {
      Tone = DtmfTone.One
    },
    new RecognitionChoice("Cancel", new List < string > {
      "Cancel",
      "Second",
      "Two"
    }) {
      Tone = DtmfTone.Two
    }
  };
}
```

## Handle Choice Events

Azure Communication Services Call Automation triggers the `api/callbacks` to the webhook we have setup and will notify us with the `RecognizeCompleted` event. The event gives us the ability to respond to input received and trigger an action. The application then plays a message to the caller based on the specific input received.

```csharp
if (parsedEvent is RecognizeCompleted recognizeCompleted) {
  var choiceResult = recognizeCompleted.RecognizeResult as ChoiceResult;
  var labelDetected = choiceResult?.Label;
  var phraseDetected = choiceResult?.RecognizedPhrase;

  // If choice is detected by phrase, choiceResult.RecognizedPhrase will have the phrase detected,  
  // If choice is detected using dtmf tone, phrase will be null  
  logger.LogInformation("Recognize completed succesfully, labelDetected={labelDetected}, phraseDetected={phraseDetected}", labelDetected, phraseDetected);

  var textToPlay = labelDetected.Equals(ConfirmChoiceLabel, StringComparison.OrdinalIgnoreCase) ? ConfirmedText : CancelText;

  await HandlePlayAsync(callMedia, textToPlay);
}

async Task HandlePlayAsync(CallMedia callConnectionMedia, string text) {
  // Play goodbye message 
  var GoodbyePlaySource = new TextSource(text) {
    VoiceName = "en-US-NancyNeural"
  };
  await callConnectionMedia.PlayToAllAsync(GoodbyePlaySource);
}
```

## Hang up and stop recording

Finally, when we detect a condition that makes sense for us to terminate the call, we can use the `HangUpAsync` method to hang up the call.

```csharp
if ((parsedEvent is PlayCompleted) || (parsedEvent is PlayFailed))
{
    logger.LogInformation($"Stop recording and terminating call.");
    callAutomationClient.GetCallRecording().Stop(recordingId);
    await callConnection.HangUpAsync(true);
}
```

## Run the code

# [Visual Studio Code](#tab/visual-studio-code)

To run the application with VS Code, open a Terminal window and run the following command

```bash
dotnet run
```

# [Visual Studio](#tab/visual-studio)

Press Ctrl+F5 to run without the debugger.

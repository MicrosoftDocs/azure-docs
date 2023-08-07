---
title: include file
description: C# recognize ai action how-to
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 02/15/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Note the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Obtain the NuGet package from the [Azure SDK Dev Feed](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed).
- Create and connect [Azure AI services to your Azure Communication Services resource](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](../../../../../articles/cognitive-services/cognitive-services-custom-subdomains.md) for your Azure AI services resource. 

## Technical specifications

The following parameters are available to customize the Recognize function:

| Parameter | Type|Default (if not specified) | Description | Required or Optional |
| ------- |--| ------------------------ | --------- | ------------------ |
| Prompt <br/><br/> *(for details on Play action, refer to [this how-to guide](../play-ai-action.md))* | FileSource, TextSource | Not set |This will be the message you wish to play before recognizing input. | Optional |
| InterToneTimeout | TimeSpan | 2 seconds <br/><br/>**Min:** 1 second <br/>**Max:** 60 seconds | Limit in seconds that ACS will wait for the caller to press another digit (inter-digit timeout). | Optional |
| InitialSegmentationSilenceTimeoutInSeconds | Integer | 0.5 seconds | How long recognize action will wait for input before considering it a timeout. [Read more here](../../../../../articles/cognitive-services/Speech-Service/how-to-recognize-speech.md). | Optional |
| RecognizeInputsType | Enum | dtmf | Type of input that will be recognized. Options will be dtmf, choices, speech and speechordtmf. | Required |
| InitialSilenceTimeout | TimeSpan | 5 seconds<br/><br/>**Min:** 0 seconds <br/>**Max:** 300 seconds (DTMF) <br/>**Max:** 20 seconds (Choices) <br/>**Max:** 20 seconds (Speech)| Initial silence timeout adjusts how much non-speech audio is allowed before a phrase before the recognition attempt ends in a "no match" result. [Read more here](../../../../../articles/cognitive-services/Speech-Service/how-to-recognize-speech.md). | Optional |
| MaxTonesToCollect | Integer | No default<br/><br/>**Min:** 1|Number of digits a developer expects as input from the participant.| Required |
| StopTones |IEnumeration\<DtmfTone\> | Not set | The digit participants can press to escape out of a batch DTMF event. | Optional |
| InterruptPrompt | Bool | True | If the participant has the ability to interrupt the playMessage by pressing a digit. | Optional |
| InterruptCallMediaOperation | Bool | True | If this flag is set it will interrupt the current call media operation. For example if any audio is being played it will interrupt that operation and initiate recognize. | Optional |
| OperationContext | String | Not set | String that developers can pass mid action, useful for allowing developers to store context about the events they receive. | Optional |
| Phrases | String | Not set | List of phrases that associate to the label, if any of these are heard it will be considered a successful recognition. | Required | 
| Tone | String | Not set | The tone to recognize if user decides to press a number instead of using speech. | Optional |
| Label | String | Not set | The key value for recognition. | Required |
| Language | String | En-us | The language that will be used for recognizing speech. | Optional |
| EndSilenceTimeout| TimeSpan | 0.5 seconds | The final pause of the speaker used to detect the final result that gets generated as speech. | Optional |

>[!NOTE] 
>In situations where both dtmf and speech are in the recognizeInputsType, the recognize action will action on the first input type received, i.e. if the user presses a keypad number first then the recognize action will consider it a dtmf event and continue listening for dtmf tones. If the user speaks first then the recognize action will consider it a speech recognition and listen for voice input. 

## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application.

```console
dotnet new web -n MyApplication
```

## Install the NuGet package

During the preview phase, the NuGet package can be obtained by configuring your package manager to use the Azure SDK Dev Feed from [here](https://github.com/Azure/azure-sdk-for-net/blob/main/CONTRIBUTING.md#nuget-package-dev-feed).

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about how to start a call view our [quickstart](../../../quickstarts/call-automation/callflows-for-customer-interactions.md). In this instance, we'll answer an incoming call.

``` csharp
var callAutomationClient = new CallAutomationClient("<ACS connection string>");

var answerCallOptions = new AnswerCallOptions("<Incoming call context once call is connected>", new Uri("<https://sample-callback-uri>"))
    {
        AzureCognitiveServicesEndpointUrl = new Uri("https://sample-cognitive-service-resource.cognitiveservices.azure.com/") // for Speech-To-Text (choices)
    };
    var answerCallResult = await callAutomationClient.AnswerCallAsync(answerCallOptions);
```

## Call the recognize action

When your application answers the call, you can provide information about recognizing participant input and playing a prompt.

### DTMF 
``` csharp
var targetParticipant = new PhoneNumberIdentifier("+1XXXXXXXXXXX");
                var recognizeOptions = new CallMediaRecognizeDtmfOptions(targetParticipant, maxTonesToCollect)
                {
                    InterruptCallMediaOperation = true,
                    InitialSilenceTimeout = TimeSpan.FromSeconds(30),
                    Prompt = new FileSource(new System.Uri("file://path/to/file")),
                    InterToneTimeout = TimeSpan.FromSeconds(5),
                    InterruptPrompt = true,
                    StopTones = new DtmfTone[] { DtmfTone.Pound },
                };
                await _callConnection.GetCallMedia().StartRecognizingAsync(recognizeOptions).ConfigureAwait(false);
```
**Note:** If parameters aren't set, the defaults will be applied where possible.

### Speech-To-Text (Choices) 
``` csharp
var choices = new List<RecognizeChoice>
            {
                new RecognizeChoice("Confirm", new List<string> { "Confirm", "First", "One"})
                {
                    Tone = DtmfTone.One
                },
                new RecognizeChoice("Cancel", new List<string> { "Cancel", "Second", "Two"})
                {
                    Tone = DtmfTone.Two
                }
            };
var targetParticipant = new PhoneNumberIdentifier("+1XXXXXXXXXXX");
           var playSource = new TextSource("Hello, This is a reminder for your appointment at 2 PM, Say Confirm to confirm your appointment or Cancel to cancel the appointment. Thank you!");

            var recognizeOptions =
                new CallMediaRecognizeChoiceOptions(
                    targetParticipant: targetParticipant,
                    recognizeChoices: choices)
                {
                    InterruptPrompt = true,
                    InitialSilenceTimeout = TimeSpan.FromSeconds(5),
                    Prompt = playSource,
                    OperationContext = "AppointmentReminderMenu"
                };

            var response = await _callConnection
                                    .GetCallMedia()
                                    .StartRecognizingAsync(recognizeOptions)
                                    .ConfigureAwait(false);
```                                    

### Speech-To-Text
``` csharp
var prompt = “Hi, how can I help you today?”
var ssml = <speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="{locale}">" +
        $ "<voice name=\"{voiceName}\">" +
        $ "<mstts:express-as style="{expression}">{payload}</mstts:express-as><s />" +
        "</voice>" +
        "</speak>";
      var greetingPrompt = new SsmlSource(ssml) {
        PlaySourceId = "playSourceId"
      };

var recognizeOptions = new CallMediaRecognizeSpeechOptions(
                                                   targetParticipant: targetParticipant)
{
      InterruptCallMediaOperation = true,
      InterrupPrompt = false, 
      Prompt = greetingPrompt,
      EndSilenceTimeoutInMS = TimeSpan.FromMilliseconds(1000),
      OperationContext = “OpenQuestionSpeech”
};

await callConnectionMedia.StartRecognizingAsync(recognizeOptions)
```
**Note:** If parameters aren't set, the defaults will be applied where possible.

## Receiving recognize event updates

Developers can subscribe to the *RecognizeCompleted* and *RecognizeFailed* events on the webhook callback they registered for the call to create business logic in their application for determining next steps when one of the previously mentioned events occurs. 

### Example of how you can deserialize the *RecognizeCompleted* event:
``` csharp
        if (@event is RecognizeCompleted { OperationContext: "AppointmentReminderMenu" })
        {
            logger.LogInformation($"RecognizeCompleted event received for call connection id: {@event.CallConnectionId}");
            var recognizeCompletedEvent = (RecognizeCompleted)@event;
            string labelDetected = null;
            string phraseDetected = null;
            switch (recognizeCompletedEvent.RecognizeResult)
            {
                // Take action for Recongition through Choices
                case ChoiceResult choiceResult:
                    labelDetected = choiceResult.Label;
                    phraseDetected = choiceResult.RecognizedPhrase;
                    //If choice is detected by phrase, choiceResult.RecognizedPhrase will have the phrase detected,
                    // if choice is detected using dtmf tone, phrase will be null
                    break;
                //Take action for Recongition through DTMF
                case DtmfResult dtmfResult: 
                    var tones = dtmfResult.Tones;
                    break;
               //Take action for Recognition through Speech
               case SpeechResult speechResult:
                    var address = ((SpeechResult)((RecognizeCompletedEventData) @event).RecognizeResult).Speech;

                default:
                    logger.LogError($"Unexpected recognize event result identified for connection id: {@event.CallConnectionId}");
                    break;
            }
        }
```

### Example of how you can deserialize the *RecognizeFailed* event:
``` csharp
if (@event is RecognizeFailed { OperationContext: "AppointmentReminderMenu" })
        {
            logger.LogInformation($"RecognizeFailed event received for call connection id: {@event.CallConnectionId}");
            var recognizeFailedEvent = (RecognizeFailed)@event;

            // Check for time out, and then take action like play audio
            if (ReasonCode.RecognizeInitialSilenceTimedOut.Equals(recognizeFailedEvent.ReasonCode))
            {
                logger.LogInformation($"Recognition timed out for call connection id: {@event.CallConnectionId}");
                var playSource = new TextSource("No input recieved and recognition timed out, Disconnecting the call. Thank you!");
                //Play audio for time out
                await callConnectionMedia.PlayToAllAsync(playSource, new PlayOptions { OperationContext = "ResponseToChoice", Loop = false });
            }

            //Check for invalid speech or tone detection and take action like playing audio
            if (ReasonCode.RecognizeSpeechOptionNotMatched.Equals(recognizeFailedEvent.ReasonCode) ||
            ReasonCode.RecognizeIncorrectToneDetected.Equals(recognizeFailedEvent.ReasonCode))
            {
                logger.LogInformation($"Recognition failed for invalid speech or incorrect tone detected, connection id: {@event.CallConnectionId}");
                var playSource = new TextSource("Invalid speech phrase detected, Disconnecting the call. Thank you!");

                //Play text prompt for speech option not matched
                await callConnectionMedia.PlayToAllAsync(playSource, new PlayOptions { OperationContext = "ResponseToChoice", Loop = false });
            }
        }
```

### Example of how you can deserialize the *RecognizeCanceled* event:
``` csharp
if (@event is RecognizeCanceled { OperationContext: "AppointmentReminderMenu" })
        {
            logger.LogInformation($"RecognizeCanceled event received for call connection id: {@event.CallConnectionId}");
            //Take action on recognize canceled operation
           await callConnection.HangUpAsync(forEveryone: true);
        }
```

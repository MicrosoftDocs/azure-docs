---
title: include file
description: Java recognize ai action how-to
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 02/16/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp)
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- [Java Development Kit](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- Create and connect [Azure AI services to your Azure Communication Services resource](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](../../../../../articles/cognitive-services/cognitive-services-custom-subdomains.md) for your Azure AI services resource. 

## Technical specifications

The following parameters are available to customize the Recognize function:

| Parameter | Type|Default (if not specified) | Description | Required or Optional |
| ------- |--| ------------------------ | --------- | ------------------ |
| Prompt <br/><br/> *(for details on Play action, refer to [this how-to guide](../play-ai-action.md))* | FileSource, TextSource | Not set |This is the message you wish to play before recognizing input. | Optional |
| InterToneTimeout | TimeSpan | 2 seconds <br/><br/>**Min:** 1 second <br/>**Max:** 60 seconds | Limit in seconds that ACS waits for the caller to press another digit (inter-digit timeout). | Optional |
| InitialSegmentationSilenceTimeoutInSeconds | Integer | 0.5 seconds | How long recognize action waits for input before considering it a timeout. [Read more here](../../../../../articles/cognitive-services/Speech-Service/how-to-recognize-speech.md). | Optional |
| RecognizeInputsType | Enum | dtmf | Type of input to be recognized. Options are dtmf, choices, speech and speechordtmf. | Required |
| InitialSilenceTimeout | TimeSpan | 5 seconds<br/><br/>**Min:** 0 seconds <br/>**Max:** 300 seconds (DTMF) <br/>**Max:** 20 seconds (Choices) <br/>**Max:** 20 seconds (Speech)| Initial silence timeout adjusts how much nonspeech audio is allowed before a phrase before the recognition attempt ends in a "no match" result. [Read more here](../../../../../articles/cognitive-services/Speech-Service/how-to-recognize-speech.md). | Optional |
| MaxTonesToCollect | Integer | No default<br/><br/>**Min:** 1|Number of digits a developer expects as input from the participant.| Required |
| StopTones |IEnumeration\<DtmfTone\> | Not set | The digit participants can press to escape out of a batch DTMF event. | Optional |
| InterruptPrompt | Bool | True | If the participant has the ability to interrupt the playMessage by pressing a digit. | Optional |
| InterruptCallMediaOperation | Bool | True | If this flag is set it will interrupt the current call media operation. For example if any audio is being played it interrupts that operation and initiates recognize. | Optional |
| OperationContext | String | Not set | String that developers can pass mid action, useful for allowing developers to store context about the events they receive. | Optional |
| Phrases | String | Not set | List of phrases that associate to the label, if any of these are heard is considered a successful recognition. | Required | 
| Tone | String | Not set | The tone to recognize if user decides to press a number instead of using speech. | Optional |
| Label | String | Not set | The key value for recognition. | Required |
| Language | String | En-us | The language that is used for recognizing speech. | Optional |
| EndSilenceTimeout| TimeSpan | 0.5 seconds | The final pause of the speaker used to detect the final result that gets generated as speech. | Optional |

>[!NOTE] 
>In situations where both dtmf and speech are in the recognizeInputsType, the recognize action will action on the first input type received, i.e. if the user presses a keypad number first then the recognize action will consider it a dtmf event and continue listening for dtmf tones. If the user speaks first then the recognize action will consider it a speech recognition and listen for voice input. 

## Create a new Java application

In your terminal or command window, navigate to the directory where you would like to create your Java application. Run the command to generate the Java project from the maven-archetype-quickstart template. 

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The command above creates a directory with the same name as `artifactId` argument. Under this directory, `src/main/java` directory contains the project source code, `src/test/java` directory contains the test source. 

You notice that the 'generate' step created a directory with the same name as the artifactId. Under this directory, `src/main/java` directory contains source code, `src/test/java` directory contains tests, and `pom.xml` file is the project's Project Object Model, or POM.

Update your applications POM file to use Java 8 or higher.

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

## Configure Azure SDK dev feed

Add the [azure-sdk-for-java feed](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java) to your `pom.xml`. Follow the instructions after clicking the "Connect to Feed" button.

## Add package references

In your POM file, add the following reference for the project

**azure-communication-callautomation**

``` xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-callautomation</artifactId>
  <version>1.0.0-alpha.20230210.2</version>
</dependency>
```

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about how to start a call view our [quickstart](../../../quickstarts/call-automation/callflows-for-customer-interactions.md). In this instance, we'll answer an incoming call.

``` java
AnswerCallOptions answerCallOptions = new AnswerCallOptions("<Incoming call context>", "<https://sample-callback-uri>");
answerCallOptions.setAzureCognitiveServicesEndpointUrl("https://sample-cognitive-service-resource.cognitiveservices.azure.com/");
Response<AnswerCallResult> answerCallResult = callAutomationClient
                                               .answerCallWithResponse(answerCallOptions)
                                               .block();
```

## Call the recognize action

When your application answers the call, you can provide information about recognizing participant input and playing a prompt.

### DTMF
``` java
CallMediaRecognizeOptions callMediaRecognizeOptions = new CallMediaRecognizeDtmfOptions(targetParticipant, maxTonesToCollect)
        .setInterToneTimeout(Duration.ofSeconds(5))
        .setInterruptCallMediaOperation(true)
        .setInitialSilenceTimeout(Duration.ofSeconds(30))
        .setPlayPrompt(new FileSource().setUri("file://path/to/file"))
        .setInterruptPrompt(true);
callMedia.startRecognizing(callMediaRecognizeOptions).block();
```

### Speech-To-Text (Choices)

``` java
PlaySource reminderMessage = new TextSource()
        .setText("Hello, Say confirm to confirm or cancel to cancel the appointment. Thanks you!")
        .setPlaySourceId("ReminderMessage");

RecognizeChoice recognizeChoice1 = new RecognizeChoice();
recognizeChoice1.setLabel("Confirm").setPhrases(Arrays.asList("Confirm", "One", "First")).setTone(DtmfTone.ONE);
RecognizeChoice recognizeChoice2 = new RecognizeChoice();
recognizeChoice2.setLabel("Cancel").setPhrases(Arrays.asList("Cancel", "Two", "Second")).setTone(DtmfTone.TWO);

List < RecognizeChoice > recognizeChoices = Arrays.asList(recognizeChoice1, recognizeChoice2);

CallMediaRecognizeOptions recognizeOptions = new CallMediaRecognizeChoiceOptions(
        new PhoneNumberIdentifier(targetPhoneNumber),
            recognizeChoices)
            .setPlayPrompt(reminderMessage)
            .setOperationContext("ReminderMenu");

Response < ? > response = callMedia.startRecognizingWithResponse(recognizeOptions, null);
Logger.logMessage(
        Logger.MessageType.INFORMATION,
        "startRecognizingWithResponse --> " + getResponse(response)
```

### Speech-To-Text
``` java
 CallMediaRecognizeSpeechOrDtmfOptions recognizeOptions = new CallMediaRecognizeSpeechOrDtmfOptions(new CommunicationUserIdentifier("id"), 6, Duration.ofMillis(1000));

 String ssmlText = "<speak version=\"1.0\" xmlns=\"http://www.w3.org/2001/10/synthesis\" xml:lang=\"en-US\"><voice name=\"en-US-JennyNeural\">Hi, welcome to Contoso. How can I help you today?</voice></speak>";
 recognizeOptions.setRecognizeInputType(RecognizeInputType.SPEECH_OR_DTMF);
 recognizeOptions.setPlayPrompt(new SsmlSource().setSsmlText(ssmlText));
 recognizeOptions.setInterruptCallMediaOperation(true);
 recognizeOptions.setStopCurrentOperations(true);
 recognizeOptions.setOperationContext("operationContext");
 recognizeOptions.setInterruptPrompt(true);
 recognizeOptions.setInitialSilenceTimeout(Duration.ofSeconds(4));

 Response<Void> response = callMedia.startRecognizingWithResponse(recognizeOptions, Context.NONE);
```
When `SpeechorDtmf` option is used for recognize, the recognize action will pick up on which ever method the participant uses first. If the participant uses DTMF, then the Recognize action will use DTMF tones as the method of recognition. If speech is detected then the recognize action will continue to use speech as the method of recognition. 

**Note:** If parameters aren't set, the defaults are applied where possible.

## Receiving recognize event updates

Developers can subscribe to *RecognizeCompleted* and *RecognizeFailed* events on the webhook callback they registered for the call to create business logic in their application for determining next steps when one of the aforementioned events occurs. 

### Example of how you can deserialize the *RecognizeCompleted* event:
``` java
if (callEvent instanceof RecognizeCompleted) {
                RecognizeCompleted recognizeCompleted = (RecognizeCompleted) callEvent;
                RecognizeResult recognizeResult = recognizeCompleted.getRecognizeResult().get();
                if(recognizeResult instanceof CollectChoiceResult)
                {
                    // Take action on collect choices
                    CollectChoiceResult collectChoiceResult = (CollectChoiceResult) recognizeResult;
                    String LabelDetected = collectChoiceResult.getLabel();
                    String PhraseDetected = collectChoiceResult.getRecognizedPhrase();
                }
                else if(recognizeResult instanceof DtmfResult)
                {
                    // Take action on collect tones
                    DtmfResult dtmfResult = (DtmfResult) recognizeResult;
                    List<DtmfTone> tones = dtmfResult.getTones();
                }
                else if(recognizeResult instanceof SpeechResult)
                {
                    // Take action on speech
                    logger.LogInformation($"Speech result received for call connection id: {@event.CallConnectionId}");
                    phraseDetected = speechResult.Speech;
                    logger.LogInformation($"Phrased Detected: {phraseDetected ?? "Continuous speech detected using speech recognition"}");
                }
            }
```

### Example of how you can deserialize the *RecognizeFailed* event:
``` java 
if (callEvent instanceof RecognizeFailed) {
          
                Logger.logMessage(Logger.MessageType.INFORMATION, "Recognize timed out");
                RecognizeFailed recognizeFailed = (RecognizeFailed) callEvent;
                
                if(ReasonCode.Recognize.INITIAL_SILENCE_TIMEOUT.equals(recognizeFailed.getReasonCode()))
                {
                    PlaySource playSource = new TextSource()
                        .setText("No input recieved and recognition timed out, Disconnecting the call. Thank you!")
                        .setPlaySourceId("RecognitionTimedOut");
                    Response<?> response = callMedia.playToAllWithResponse(playSource, new PlayOptions(), null);
                }
                
                if(ReasonCode.Recognize.SPEECH_OPTION_NOT_MATCHED.equals(recognizeFailed.getReasonCode()) ||
                 ReasonCode.Recognize.INCORRECT_TONE_DETECTED.equals(recognizeFailed.getReasonCode()))
                {
                    PlaySource playSource = new TextSource()
                        .setText("Invalid speech phrase or tone detected, Disconnecting the call. Thank you!")
                        .setPlaySourceId("InavlidInput");
                    Response<?> response = callMedia.playToAllWithResponse(playSource, new PlayOptions(), null);
                }
            }
```

### Example of how you can deserialize the *RecognizeCanceled* event:
``` java
if (callEvent instanceof RecognizeCanceled) { 

            //Take action on Canceled notification, like terinating a call
            callConnection.hangUp(true);
         }
```

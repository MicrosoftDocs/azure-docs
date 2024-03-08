---
title: include file
description: Java Recognize action quickstart
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 11/20/2023
ms.topic: include
ms.author: kpunjabi
---

## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp)
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- [Java Development Kit](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).

### For AI features
- Create and connect [Azure AI services to your Azure Communication Services resource](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](../../../../ai-services/cognitive-services-custom-subdomains.md) for your Azure AI services resource. 


## Technical specifications

The following parameters are available to customize the Recognize function:

| Parameter | Type|Default (if not specified) | Description | Required or Optional |
| ------- |--| ------------------------ | --------- | ------------------ |
| Prompt <br/><br/> *(for details on Play action, refer to [this how-to guide](../play-ai-action.md))* | FileSource, TextSource | Not set |This is the message you wish to play before recognizing input. | Optional |
| InterToneTimeout | TimeSpan | 2 seconds <br/><br/>**Min:** 1 second <br/>**Max:** 60 seconds | Limit in seconds that Azure Communication Services waits for the caller to press another digit (inter-digit timeout). | Optional |
| InitialSegmentationSilenceTimeoutInSeconds | Integer | 0.5 second | How long recognize action waits for input before considering it a timeout. [Read more here](../../../../../articles/cognitive-services/Speech-Service/how-to-recognize-speech.md). | Optional |
| RecognizeInputsType | Enum | dtmf | Type of input that is recognized. Options are dtmf, choices, speech and speechordtmf. | Required |
| InitialSilenceTimeout | TimeSpan | 5 seconds<br/><br/>**Min:** 0 seconds <br/>**Max:** 300 seconds (DTMF) <br/>**Max:** 20 seconds (Choices) <br/>**Max:** 20 seconds (Speech)| Initial silence timeout adjusts how much nonspeech audio is allowed before a phrase before the recognition attempt ends in a "no match" result. [Read more here](../../../../../articles/cognitive-services/Speech-Service/how-to-recognize-speech.md). | Optional |
| MaxTonesToCollect | Integer | No default<br/><br/>**Min:** 1|Number of digits a developer expects as input from the participant.| Required |
| StopTones |IEnumeration\<DtmfTone\> | Not set | The digit participants can press to escape out of a batch DTMF event. | Optional |
| InterruptPrompt | Bool | True | If the participant has the ability to interrupt the playMessage by pressing a digit. | Optional |
| InterruptCallMediaOperation | Bool | True | If this flag is set it interrupts the current call media operation. For example if any audio is being played it interrupts that operation and initiates recognize. | Optional |
| OperationContext | String | Not set | String that developers can pass mid action, useful for allowing developers to store context about the events they receive. | Optional |
| Phrases | String | Not set | List of phrases that associate to the label, if any of these are heard it is considered a successful recognition. | Required | 
| Tone | String | Not set | The tone to recognize if user decides to press a number instead of using speech. | Optional |
| Label | String | Not set | The key value for recognition. | Required |
| Language | String | En-us | The language that is used for recognizing speech. | Optional |
| EndSilenceTimeout| TimeSpan | 0.5 second | The final pause of the speaker used to detect the final result that gets generated as speech. | Optional |

>[!NOTE] 
>In situations where both dtmf and speech are in the recognizeInputsType, the recognize action will act on the first input type received, i.e. if the user presses a keypad number first then the recognize action will consider it a dtmf event and continue listening for dtmf tones. If the user speaks first then the recognize action will consider it a speech recognition and listen for voice input. 

## Create a new Java application

In your terminal or command window, navigate to the directory where you would like to create your Java application. Run the `mvn` command to generate the Java project from the maven-archetype-quickstart template. 

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The `mvn` command creates a directory with the same name as `artifactId` argument. Under this directory, `src/main/java` directory contains the project source code, `src/test/java` directory contains the test source. 

You notice that the 'generate' step created a directory with the same name as the artifactId. Under this directory, `src/main/java` directory contains source code, `src/test/java` directory contains tests, and `pom.xml` file is the project's Project Object Model, or POM.

Update your applications POM file to use Java 8 or higher.

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

## Add package references

In your POM file, add the following reference for the project

**azure-communication-callautomation**

``` xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-callautomation</artifactId>
  <version>1.0.0</version>
</dependency>
```

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). You can also use the code snippet provided here to understand how to answer a call.

``` java
CallIntelligenceOptions callIntelligenceOptions = new CallIntelligenceOptions().setCognitiveServicesEndpoint("https://sample-cognitive-service-resource.cognitiveservices.azure.com/"); 
answerCallOptions = new AnswerCallOptions("<Incoming call context>", "<https://sample-callback-uri>").setCallIntelligenceOptions(callIntelligenceOptions); 
Response < AnswerCallResult > answerCallResult = callAutomationClient
  .answerCallWithResponse(answerCallOptions)
  .block();
```

## Call the recognize action

When your application answers the call, you can provide information about recognizing participant input and playing a prompt.

### DTMF
``` java
var maxTonesToCollect = 3;
String textToPlay = "Welcome to Contoso, please enter 3 DTMF.";
var playSource = new TextSource() 
    .setText(textToPlay) 
    .setVoiceName("en-US-ElizabethNeural");

var recognizeOptions = new CallMediaRecognizeDtmfOptions(targetParticipant, maxTonesToCollect) 
    .setInitialSilenceTimeout(Duration.ofSeconds(30)) 
    .setPlayPrompt(playSource) 
    .setInterToneTimeout(Duration.ofSeconds(5)) 
    .setInterruptPrompt(true) 
    .setStopTones(Arrays.asList(DtmfTone.POUND));

var recognizeResponse = callAutomationClient.getCallConnectionAsync(callConnectionId) 
    .getCallMediaAsync() 
    .startRecognizingWithResponse(recognizeOptions) 
    .block(); 

log.info("Start recognizing result: " + recognizeResponse.getStatusCode()); 
```
For speech-to-text flows, Call Automation recognize action also supports the use of custom speech models. Features like custom speech models can be useful when you're building an application that needs to listen for complex words which the default speech-to-text models may not be capable of understanding, a good example of this can be when you're building an application for the telemedical industry and your virtual agent needs to be able to recognize medical terms. You can learn more about creating and deploying custom speech models [here](../../../../ai-services/speech-service/how-to-custom-speech-create-project.md).

### Speech-to-Text Choices 
``` java
var choices = Arrays.asList(
  new RecognitionChoice()
  .setLabel("Confirm")
  .setPhrases(Arrays.asList("Confirm", "First", "One"))
  .setTone(DtmfTone.ONE),
  new RecognitionChoice()
  .setLabel("Cancel")
  .setPhrases(Arrays.asList("Cancel", "Second", "Two"))
  .setTone(DtmfTone.TWO)
);

String textToPlay = "Hello, This is a reminder for your appointment at 2 PM, Say Confirm to confirm your appointment or Cancel to cancel the appointment. Thank you!";
var playSource = new TextSource()
  .setText(textToPlay)
  .setVoiceName("en-US-ElizabethNeural");
var recognizeOptions = new CallMediaRecognizeChoiceOptions(targetParticipant, choices)
  .setInterruptPrompt(true)
  .setInitialSilenceTimeout(Duration.ofSeconds(30))
  .setPlayPrompt(playSource)
  .setOperationContext("AppointmentReminderMenu")
  //Only add the SpeechRecognitionModelEndpointId if you have a custom speech model you would like to use
  .setSpeechRecognitionModelEndpointId("YourCustomSpeechModelEndpointID"); 
var recognizeResponse = callAutomationClient.getCallConnectionAsync(callConnectionId)
  .getCallMediaAsync()
  .startRecognizingWithResponse(recognizeOptions)
  .block();
```

### Speech-to-Text 

``` java
String textToPlay = "Hi, how can I help you today?"; 
var playSource = new TextSource() 
    .setText(textToPlay) 
    .setVoiceName("en-US-ElizabethNeural"); 
var recognizeOptions = new CallMediaRecognizeSpeechOptions(targetParticipant, Duration.ofMillis(1000)) 
    .setPlayPrompt(playSource) 
    .setOperationContext("OpenQuestionSpeech")
    //Only add the SpeechRecognitionModelEndpointId if you have a custom speech model you would like to use
    .setSpeechRecognitionModelEndpointId("YourCustomSpeechModelEndpointID");  
var recognizeResponse = callAutomationClient.getCallConnectionAsync(callConnectionId) 
    .getCallMediaAsync() 
    .startRecognizingWithResponse(recognizeOptions) 
    .block(); 
```

### Speech-to-Text or DTMF 

``` java
var maxTonesToCollect = 1; 
String textToPlay = "Hi, how can I help you today, you can press 0 to speak to an agent?"; 
var playSource = new TextSource() 
    .setText(textToPlay) 
    .setVoiceName("en-US-ElizabethNeural"); 
var recognizeOptions = new CallMediaRecognizeSpeechOrDtmfOptions(targetParticipant, maxTonesToCollect, Duration.ofMillis(1000)) 
    .setPlayPrompt(playSource) 
    .setInitialSilenceTimeout(Duration.ofSeconds(30)) 
    .setInterruptPrompt(true) 
    .setOperationContext("OpenQuestionSpeechOrDtmf")
    //Only add the SpeechRecognitionModelEndpointId if you have a custom speech model you would like to use
    .setSpeechRecognitionModelEndpointId("YourCustomSpeechModelEndpointID");  
var recognizeResponse = callAutomationClient.getCallConnectionAsync(callConnectionId) 
    .getCallMediaAsync() 
    .startRecognizingWithResponse(recognizeOptions) 
    .block(); 
```
> [!Note]
> If parameters aren't set, the defaults are applied where possible.

## Receiving recognize event updates

Developers can subscribe to *RecognizeCompleted* and *RecognizeFailed* events on the registered webhook callback. This callback can be used with business logic in your application for determining next steps when one of the events occurs. 


### Example of how you can deserialize the *RecognizeCompleted* event:
``` java
if (acsEvent instanceof RecognizeCompleted) { 
    RecognizeCompleted event = (RecognizeCompleted) acsEvent; 
    RecognizeResult recognizeResult = event.getRecognizeResult().get(); 
    if (recognizeResult instanceof DtmfResult) { 
        // Take action on collect tones 
        DtmfResult dtmfResult = (DtmfResult) recognizeResult; 
        List<DtmfTone> tones = dtmfResult.getTones(); 
        log.info("Recognition completed, tones=" + tones + ", context=" + event.getOperationContext()); 
    } else if (recognizeResult instanceof ChoiceResult) { 
        ChoiceResult collectChoiceResult = (ChoiceResult) recognizeResult; 
        String labelDetected = collectChoiceResult.getLabel(); 
        String phraseDetected = collectChoiceResult.getRecognizedPhrase(); 
        log.info("Recognition completed, labelDetected=" + labelDetected + ", phraseDetected=" + phraseDetected + ", context=" + event.getOperationContext()); 
    } else if (recognizeResult instanceof SpeechResult) { 
        SpeechResult speechResult = (SpeechResult) recognizeResult; 
        String text = speechResult.getSpeech(); 
        log.info("Recognition completed, text=" + text + ", context=" + event.getOperationContext()); 
    } else { 
        log.info("Recognition completed, result=" + recognizeResult + ", context=" + event.getOperationContext()); 
    } 
} 
```

### Example of how you can deserialize the *RecognizeFailed* event:
``` java
if (acsEvent instanceof RecognizeFailed) { 
    RecognizeFailed event = (RecognizeFailed) acsEvent; 
    if (ReasonCode.Recognize.INITIAL_SILENCE_TIMEOUT.equals(event.getReasonCode())) { 
        // Take action for time out 
        log.info("Recognition failed: initial silence time out"); 
    } else if (ReasonCode.Recognize.SPEECH_OPTION_NOT_MATCHED.equals(event.getReasonCode())) { 
        // Take action for option not matched 
        log.info("Recognition failed: speech option not matched"); 
    } else if (ReasonCode.Recognize.DMTF_OPTION_MATCHED.equals(event.getReasonCode())) { 
        // Take action for incorrect tone 
        log.info("Recognition failed: incorrect tone detected"); 
    } else { 
        log.info("Recognition failed, result=" + event.getResultInformation().getMessage() + ", context=" + event.getOperationContext()); 
    } 
} 
```

### Example of how you can deserialize the *RecognizeCanceled* event:
``` java
if (acsEvent instanceof RecognizeCanceled) { 
    RecognizeCanceled event = (RecognizeCanceled) acsEvent; 
    log.info("Recognition canceled, context=" + event.getOperationContext()); 
}
```

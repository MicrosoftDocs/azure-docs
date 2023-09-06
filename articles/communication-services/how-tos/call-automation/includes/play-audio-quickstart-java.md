---
title: include file
description: play audio quickstart java
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/06/2022
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
  
### For AI features (Public preview)
- Create and connect [Azure AI services to your Azure Communication Services resource](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](../../../../ai-services/cognitive-services-custom-subdomains.md) for your Azure AI services resource. 


## Create a new Java application

In your terminal or command window, navigate to the directory where you would like to create your Java application. Run the command shown here to generate the Java project from the maven-archetype-quickstart template. 

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The previous command creates a directory with the same name as `artifactId` argument. Under this directory, `src/main/java` directory contains the project source code, `src/test/java` directory contains the test source. 

You notice that the 'generate' step created a directory with the same name as the artifactId. Under this directory, `src/main/java` directory contains source code, `src/test/java` directory contains tests, and `pom.xml` file is the project's Project Object Model, or POM.

Update your applications POM file to use Java 8 or higher.

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

## Configure Azure SDK Dev Feed

For AI features in public preview, add the [azure-sdk-for-java feed](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java) to your `pom.xml`. Follow the instructions after clicking the "Connect to Feed" button.

## Add package references

In your POM file, add the following reference for the project. 

**azure-communication-callautomation**

Azure Communication Services Call Automation SDK package is retrieved from the Azure SDK Dev Feed.

``` xml 
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-callautomation</artifactId>
  <version>1.0.0</version>
</dependency>
```

## (Optional) Prepare your audio file if you wish to use audio files for playing prompts

Create an audio file, if you don't already have one, to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file that ACS supports needs to be **WAV, mono and 16 KHz sample rate**. 
    
You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](../../../../ai-services/Speech-Service/how-to-audio-content-creation.md).

## (Optional) Connect your Azure Cognitive Service to your Azure Communication Service (Public Preview)

If you would like to use Text-To-Speech capabilities, then it's required for you to connect your [Azure Cognitive Service to your Azure Communication Service](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).

## Update App.java with code

In your editor of choice, open App.java file and update it with the code provided in [Update app.java with code](../../../quickstarts/call-automation/callflows-for-customer-interactions.md) section.

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md).  You can also use the code snippet provided here to understand how to answer a call.

``` java
AnswerCallOptions answerCallOptions = new AnswerCallOptions("<Incoming call context>", "<https://sample-callback-uri>"); 
answerCallOptions.setCognitiveServicesEndpoint("https://sample-cognitive-service-resource.cognitiveservices.azure.com/"); //Optional step for Text-To-Speech 
Response<AnswerCallResult> answerCallResult = callAutomationClient 
    .answerCallWithResponse(answerCallOptions) 
    .block(); 
```

## Play audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has joined the call or play audio to all the participants in the call.

### Play source - Audio file

To play audio to participants using audio files, you need to make sure the audio file is a WAV file, mono and 16 KHz. To play audio files, you need to make sure you provide ACS with a uri to a file you host in a location where ACS can access it. The FileSource type in our SDK can be used to specify audio files for the play action.

``` java
var playSource = new FileSource(new Uri(audioUri));
```

### Play source - Text-To-Speech (Public Preview)

To play audio using Text-To-Speech through Azure AI services, you need to provide the text you wish to play, as well either the SourceLocale, and VoiceKind or the VoiceName you wish to use. We support all voice names supported by Azure AI services, full list [here](../../../../ai-services/Speech-Service/language-support.md?tabs=tts).

``` java
// Provide SourceLocale and VoiceKind to select an appropriate voice.
var playSource = new TextSource() 
    .setText(textToPlay) 
    .setSourceLocale("en-US") 
    .setVoiceKind(VoiceKind.FEMALE); 
```

``` java
// Provide VoiceName to select a specific voice.
var playSource = new TextSource() 
    .setText(textToPlay) 
    .setVoiceName("en-US-ElizabethNeural"); 
```

### Play source - Text-to-Speech SSML (Public Preview)

``` java
String ssmlToPlay = "<speak version=\"1.0\" xmlns=\"http://www.w3.org/2001/10/synthesis\" xml:lang=\"en-US\"><voice name=\"en-US-JennyNeural\">Hello World!</voice></speak>"; 
var playSource = new SsmlSource() 
    .setSsmlText(ssmlToPlay);
```

Once you've decided on which playSource you wish to use for playing audio, you can then choose whether you want to play it to a specific participant or to all participants.

## Play audio to all participants

In this scenario, audio is played to all participants on the call.

``` java
var playOptions = new PlayToAllOptions(playSource); 
var playResponse = callAutomationClient.getCallConnectionAsync(callConnectionId) 
    .getCallMediaAsync() 
    .playToAllWithResponse(playOptions) 
    .block(); 
log.info("Play result: " + playResponse.getStatusCode()); 
```

## Play audio to a specific participant

In this scenario, audio is played to a specific participant. 

``` java 
var playTo = Arrays.asList(targetParticipant); 
var playOptions = new PlayOptions(playSource, playTo); 
var playResponse = callAutomationClient.getCallConnectionAsync(callConnectionId) 
    .getCallMediaAsync() 
    .playWithResponse(playOptions) 
    .block(); 
```

## Play audio on loop

You can use the loop option to play hold music that loops until your application is ready to accept the caller. Or progress the caller to the next logical step based on your applications business logic.

``` java
var playOptions = new PlayToAllOptions(playSource) 
    .setLoop(true); 
var playResponse = callAutomationClient.getCallConnectionAsync(callConnectionId) 
    .getCallMediaAsync() 
    .playToAllWithResponse(playOptions) 
    .block(); 
```

## Enhance play with audio file caching

If you're playing the same audio file multiple times, your application can provide ACS with the sourceID for the audio file. ACS caches this audio file for 1 hour.
> [!Note]
> Caching audio files isn't suitable for dynamic prompts. If you change the URL provided to ACS, it does not update the cached URL straight away. The update will occur after the existing cache expires.

``` java
var playTo = Arrays.asList(targetParticipant); 
var playSource = new FileSource() 
    .setUrl(audioUri) \
    .setPlaySourceCacheId("<playSourceId>"); 
var playOptions = new PlayOptions(playSource, playTo); 
var playResponse = callAutomationClient.getCallConnectionAsync(callConnectionId) 
    .getCallMediaAsync() 
    .playWithResponse(playOptions) 
    .block(); 
```

## Handle play action event updates 

Your application receives action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. An example of a successful play event update.

### Example of how you can deserialize the *PlayCompleted* event:

``` java
if (acsEvent instanceof PlayCompleted) { 
    PlayCompleted event = (PlayCompleted) acsEvent; 
    log.info("Play completed, context=" + event.getOperationContext()); 
} 
```

### Example of how you can deserialize the *PlayFailed* event:

``` java
if (acsEvent instanceof PlayFailed) { 
    PlayFailed event = (PlayFailed) acsEvent; 
    if (ReasonCode.Play.DOWNLOAD_FAILED.equals(event.getReasonCode())) { 
        log.info("Play failed: download failed, context=" + event.getOperationContext()); 
    } else if (ReasonCode.Play.INVALID_FILE_FORMAT.equals(event.getReasonCode())) { 
        log.info("Play failed: invalid file format, context=" + event.getOperationContext()); 
    } else { 
        log.info("Play failed, result=" + event.getResultInformation().getMessage() + ", context=" + event.getOperationContext()); 
    } 
} 
```

To learn more about other supported events, visit the [Call Automation overview document](../../../concepts/call-automation/call-automation.md#call-automation-webhook-events).

## Cancel play action

Cancel all media operations, all pending media operations are canceled. This action also cancels other queued play actions.

```java
var cancelResponse = callAutomationClient.getCallConnectionAsync(callConnectionId) 
    .getCallMediaAsync() 
    .cancelAllMediaOperationsWithResponse() 
    .block(); 
log.info("Cancel result: " + cancelResponse.getStatusCode()); 
```

### Example of how you can deserialize the *PlayCanceled* event:

``` java
if (acsEvent instanceof PlayCanceled) { 
    PlayCanceled event = (PlayCanceled) acsEvent; 
    log.info("Play canceled, context=" + event.getOperationContext()); 
} 
```

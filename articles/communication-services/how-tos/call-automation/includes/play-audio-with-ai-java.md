---
title: include file
description: Java play ai action how-to
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 02/20/2023
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
- Create a [custom subdomain](../../../../ai-services/cognitive-services-custom-subdomains.md) for your Azure AI services resource. 

## Create a new Java application

In your terminal or command window, navigate to the directory where you would like to create your Java application. Run the command to generate the Java project from the maven-archetype-quickstart template. 

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The previous command creates a directory with the same name as `artifactId` argument. Under this directory, `src/main/java` directory contains the project source code, `src/test/java` directory contains the test source. 

You can notice that the 'generate' step created a directory with the same name as the artifactId. Under this directory, `src/main/java` directory contains source code, `src/test/java` directory contains tests, and `pom.xml` file is the project's Project Object Model, or POM.

Update your applications POM file to use Java 8 or higher.

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

## Configure Azure feed

Add the [azure-sdk-for-java feed](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java) to your `pom.xml`. Follow the instructions after clicking the "Connect to Feed" button.

## Add package references

In your POM file, add the following reference for the project. 

**azure-communication-callautomation**

Azure Communication Services Call Automation SDK package is retrieved from the Azure SDK Dev Feed.

``` xml 
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-callautomation</artifactId>
  <version>1.0.0-alpha.20230228.1</version>
</dependency>
```

## (Optional) Prepare your audio file if you wish to use audio files for playing prompts

Create an audio file, if you don't already have one, to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file that ACS supports needs to be **WAV, mono and 16 KHz sample rate**. 

You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](../../../../ai-services/Speech-Service/how-to-audio-content-creation.md).

## (Optional) Connect your Azure Cognitive Service to your Azure Communication Service

If you would like to use Text-To-Speech capabilities, then it's required for you to connect your [Azure Cognitive Service to your Azure Communication Service](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).

## Update App.java with code

In your editor of choice, open App.java file and update it with the code provided in [Update app.java with code](../../../quickstarts/call-automation/callflows-for-customer-interactions.md) section.

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/callflows-for-customer-interactions.md). In this quickstart, we answer an incoming call.

``` java
AnswerCallOptions answerCallOptions = new AnswerCallOptions("<Incoming call context>", "<https://sample-callback-uri>");
answerCallOptions.setAzureCognitiveServicesEndpointUrl("https://sample-cognitive-service-resource.cognitiveservices.azure.com/"); //Optional step for Text-To-Speech
Response<AnswerCallResult> answerCallResult = callAutomationClient
                                               .answerCallWithResponse(answerCallOptions)
                                               .block();
```

## Play Audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has joined the call or play audio to all the participants in the call.

### Play source - Audio file

To play audio to participants using audio files, you need to make sure the audio file is a WAV file, mono and 16 KHz. To play audio files you need to make sure you provide ACS with a uri to a file you host in a location where ACS can access it. 

``` java
FileSource playSource = new FileSource().setUri(<audioUri>);
```

### Play source - Text-To-Speech

To play audio using Text-To-Speech through Azure AI services you need to provide the text you wish to play as well either the SourceLocale, and VoiceGender or the VoiceName you wish to use.

```java
var playSource = new TextSource();
playSource.setText("some text to play");

//you can provide SourceLocale and VoiceGender as one option for playing audio
playSource.setSourceLocale("en-US");
playSource.setVoiceGender(GenderType.M);
```

```java
var playSource = new TextSource();
playSource.setText("Welcome to Contoso");

//you can provide VoiceName
playSource.setVoiceName("en-US-ElizabethNeural");
```

### Play source - Text-To-Speech with SSML

If you want to customize your Text-To-Speech output even more with Azure AI services you can use [Speech Synthesis Markup Language SSML](../../../../ai-services/Speech-Service/speech-synthesis-markup.md) when invoking your play action through Call Automation. With SSML you can fine-tune the pitch, pause, improve pronunciation, change speaking rate, adjust volume and attribute multiple voices.

``` java
playSsmlSource = new SsmlSource();
        playSsmlSource.setSsmlText("<speak></speak>");
        playOptions = new PlayOptions(playSsmlSource, Collections.singletonList(new CommunicationUserIdentifier("id")))
            .setLoop(false)
            .setOperationContext("operationContext");
```

Once you've decided on which playSource you wish to use for playing audio you can then choose whether you want to play it to a specific participant or to all participants.

## Play audio to all participants

In this scenario audio is played to all participants on the call.

``` java
var callConnection = callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);

var playOptions = new PlayOptions()
    .setLoop(false)
    .setOperationContext("operationContext");

var playResponse = callConnection.getCallMediaAsync().playToAllWithResponse(
    playSource,
    playOptions
).block();
assertEquals(202, playResponse.getStatusCode()); // The request was accepted
```

## Play audio to a specific participant

In this scenario audio is played to a specific participant. 

``` java 
var targetUser = new PhoneNumberIdentifier(<target>);
var callConnection = callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);

var playOptions = new PlayOptions()
    .setLoop(false)
    .setOperationContext("operationContext");

var playResponse = callConnection.getCallMediaAsync().playWithResponse(
    playSource,
    Collections.singletonList(targetUser), // Can be a list of multiple users
    playOptions
).block();
assertEquals(202, playResponse.getStatusCode()); // The request was accepted
```


## Handle play action event updates 

Your application receives action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. An example of a successful play event update.

### Example of how you can deserialize the *PlayCompleted* event:

``` java
if (callEvent instanceof PlayCompleted) {
     CallAutomationEventWithReasonCodeBase playCompleted= (CallAutomationEventWithReasonCodeBase) callEvent;
     Reasoncode reasonCode = playCompleted.getReasonCode();
     ResultInformation = playCompleted.getResultInformation();
     //Play audio completed, Take some action on completed event.
     // Hang up call
     callConnection.hangUp(true);
}
```

### Example of how you can deserialize the *PlayFailed* event:

``` java
if (callEvent instanceof PlayFailed) {
     CallAutomationEventWithReasonCodeBase playFailed = (CallAutomationEventWithReasonCodeBase) callEvent;
     Reasoncode reasonCode = playFailed.getReasonCode();
     ResultInformation = playFailed.getResultInformation();
     //Play audio failed, Take some action on failed event.
     // Hang up call
     callConnection.hangUp(true);
}
```

To learn more about other supported events, visit the [Call Automation overview document](../../../concepts/call-automation/call-automation.md#call-automation-webhook-events).

## Cancel play action

Cancel all media operations, all pending media operations are canceled. This action also cancels other queued play actions.

```console
var callConnection = callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);
var cancelResponse = callConnection.getCallMediaAsync().cancelAllMediaOperationsWithResponse().block();
assertEquals(202, cancelResponse.getStatusCode()); // The request was accepted
```

### Example of how you can deserialize the *PlayCanceled* event:

``` java
if (callEvent instanceof PlayCanceled {
     CallAutomationEventWithReasonCodeBase playCanceled= (CallAutomationEventWithReasonCodeBase) callEvent;
     Reasoncode reasonCode = playCanceled.getReasonCode();
     ResultInformation = playCanceled.getResultInformation();
     //Play audio completed, Take some action on canceled event.
     // Hang up call
     callConnection.hangUp(true);
}
```

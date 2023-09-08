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

## Create a new Java application

In your terminal or command window, navigate to the directory where you would like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template. 

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The previous command creates a directory with the same name as `artifactId` argument. Under this directory, `src/main/java` directory contains the project source code, `src/test/java` directory contains the test source. 

You'll notice that the 'generate' step created a directory with the same name as the artifactId. Under this directory, `src/main/java` directory contains source code, `src/test/java` directory contains tests, and `pom.xml` file is the project's Project Object Model, or POM.

Update your applications POM file to use Java 8 or higher.

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

## Configure Azure SDK Dev Feed

Since the Call Automation SDK version used in this quickstart isn't yet available in Maven Central Repository, we need to add an Azure Artifacts development feed, which contains the latest version of Call Automation SDK.

Add the [azure-sdk-for-java feed](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java) to your `pom.xml`. Follow the instructions after clicking the "Connect to Feed" button.

## Add package references

In your POM file, add the following reference for the project. 

**azure-communication-callautomation**

Azure Communication Services Call Automation SDK package is retrieved from the Azure SDK Dev Feed configured above.

``` xml 
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-callautomation</artifactId>
  <version>1.0.0</version>
</dependency>
```

## Prepare your audio file

Create an audio file, if you don't already have one, to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file ACS supports needs to be **WAV, mono and 16 KHz sample rate**.

You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](../../../../ai-services/Speech-Service/how-to-audio-content-creation.md).

## Update App.java with code

In your editor of choice, open App.java file and update it with the code provided in [Update app.java with code](../../../quickstarts/call-automation/callflows-for-customer-interactions.md) section.

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). In this quickstart, we'll create an outbound call.

## Play audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has just joined the call or play audio to all the participants in the call.

## Play source - Audio file

To play audio to participants using audio files, you need to make sure the audio file is a WAV file, mono and 16 KHz. To play audio files you need to make sure you provide ACS with a uri to a file you host in a location where ACS can access it. 

``` java
FileSource playSource = new FileSource().setUri(<audioUri>);
```

## Play audio to all participants

In this scenario audio is played to all participants on the call.

``` java
var callConnection = callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);

var playOptions = new PlayToAllOptions(playSource)
    .setLoop(false)
    .setOperationContext("operationContext");

var playResponse = callConnection.getCallMediaAsync().playToAllWithResponse(
    playOptions
).block();
assertEquals(202, playResponse.getStatusCode()); // The request was accepted
```

## Play audio to a specific participant

In this scenario audio is played to a specific participant. 

``` java 
var targetUser = new PhoneNumberIdentifier(<target>);
var callConnection = callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);

var playOptions = new PlayOptions(playSource)
    .setLoop(false)
    .setOperationContext("operationContext");

var playResponse = callConnection.getCallMediaAsync().playWithResponse(
    playOptions
).block();
assertEquals(202, playResponse.getStatusCode()); // The request was accepted
```

## Play audio on loop

You can use the loop option to play hold music that loops until your application is ready to accept the caller or progress the caller to the next logical step based on your applications business logic. 

``` java
var callConnection = callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);
var playOptions = new PlayOptions(playSource).setLoop(true);
var playResponse = callConnection.getCallMediaAsync().playToAllWithResponse(
    playOptions
).block();
assertEquals(202, playResponse.getStatusCode()); // The request was accepted
```

## Enhance play with audio file caching

If you are playing the same audio file multiple times, your application can provide ACS with the sourceID for the audio file. ACS caches this audio file for 1 hour. **Note:** Caching audio files is not suitable for dynamic prompts. If you change the URL provided to ACS, it will not update the cached URL straight away. The update will occur after the existing cache expires.

``` java
var targetUser = new PhoneNumberIdentifier(<target>);
var callConnection= callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);
var playResponse = callConnection.getCallMediaAsync().playWithResponse(
    new PlayOptions(playSource)
).block();
assertEquals(202, playResponse.getStatusCode()); // The request was accepted
```

## Handle play action event updates 

Your application will receive action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. Below is an example of a successful play event update.

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

```java
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
     //Play cancel action completed, Take some action on canceled event.
     // Hang up call
     callConnection.hangUp(true);
}
```

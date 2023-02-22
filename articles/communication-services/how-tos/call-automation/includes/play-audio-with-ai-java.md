---
title: include file
description: Java play ai action how-to
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
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
- Create and connect Azure Cognitive Services to your Azure Communication Services resource.
- Create a [custom subdomain](../../../../cognitive-services/cognitive-services-custom-subdomains.md) for your Azure Cognitive Services resource. 

## Create a new Java application

In your terminal or command window, navigate to the directory where you would like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template. 

```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The command above creates a directory with the same name as `artifactId` argument. Under this directory, `src/main/java` directory contains the project source code, `src/test/java` directory contains the test source. 

You'll notice that the 'generate' step created a directory with the same name as the artifactId. Under this directory, `src/main/java` directory contains source code, `src/test/java` directory contains tests, and `pom.xml` file is the project's Project Object Model, or POM.

Update your applications POM file to use Java 8 or higher.

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

## Configure Azure feed

//Replace this text.

## Add package references

In your POM file, add the following reference for the project. 

**azure-communication-callingserver**

Azure Communication Services Call Automation SDK package is retrieved from the Azure SDK Dev Feed configured above.

``` xml 
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-callingserver</artifactId>
  <version>1.0.0-alpha.20220829.1</version>
</dependency>
```

## (Optional) Prepare your audio file if you wish to use audio files for playing prompts

Create an audio file, if you don't already have one, to use for playing prompts and messages to participants. The audio file must be hosted in a location that is accessible to ACS with support for authentication. Keep a copy of the URL available for you to use when requesting to play the audio file. The audio file that ACS supports needs to be **WAV, mono and 16 KHz sample rate**. 

You can test creating your own audio file using our [Speech synthesis with Audio Content Creation tool](../../../../cognitive-services/Speech-Service/how-to-audio-content-creation.md).

## (Optional) Connect your Azure Cognitive Service to your Azure Communication Service

If you would like to use Text-To-Speech Capabilities then it is required for you to connect your Azure Cognitive Service to your Azure Communication Service.

``` code
az communication bind-cognitive-service --name “{Azure Communication resource name}” --resource-group “{Azure Communication resource group}” --resource-id “{Cognitive service resource id}” --subscription{subscription Name of Cognitive service} –identity{Cognitive Services Identity}

```

## Update App.java with code

In your editor of choice, open App.java file and update it with the code provided in [Update app.java with code](../../../quickstarts/call-automation/callflows-for-customer-interactions.md) section.

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/callflows-for-customer-interactions.md). In this quickstart, we'll answer an incoming call.

``` java
AnswerCallOptions answerCallOptions = new AnswerCallOptions("<Incoming call context>", "<https://sample-callback-uri>");
answerCallOptions.setAzureCognitiveServicesEndpointUrl("https://sample-cognitive-service-resource.cognitiveservices.azure.com/"); //Optional step for Text-To-Speech
Response<AnswerCallResult> answerCallResult = callAutomationClient
                                               .answerCallWithResponse(answerCallOptions)
                                               .block();
```

## Play Audio

Once the call has been established, there are multiple options for how you may wish to play the audio. You can play audio to the participant that has just joined the call or play audio to all the participants in the call.

### Play source - Audio file

To play audio to participants using audio files you will need to make sure the audio file is a WAV file, mono and 16KHz. To play audio files you will need to make sure you provide ACS with a uri to a file you host in a location where ACS can access it. 

``` java
FileSource playSource = new FileSource().setUri(<audioUri>);
```

### Play source - Text-To-Speech

To play audio using Text-To-Speech through Azure Cognitive Services you will need to provide the text you wish to play as well either the SourceLocale and VoiceGender or the VoiceName you wish to use.

```java
var playSource = new TextSource();
playSource.setText("some text to play");
playSource.setSourceLocale("en-US");
playSource.setVoiceGender(GenderType.M);
playSource.setVoiceName("LULU");
```

## Play audio to a specific participant

In this scenario audio will be played to a specific participant. 

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

## Play audio to all participants

In this scenario audio will be played to all participants on the call.

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

## Handle play action event updates 

Your application will receive action lifecycle event updates on the callback URL that was provided to Call Automation service at the time of answering the call. Below is an example of a successful play event update.

```json 
[{
    "id": "704a7a96-4d74-4ebe-9cd0-b7cc39c3d7b1",
    "source": "calling/callConnections/<callConnectionId>/PlayCompleted",
    "type": "Microsoft.Communication.PlayCompleted",
    "data": {
        "resultInfo": {
            "code": 200,
            "subCode": 0,
            "message": "Action completed successfully."
        },
        "type": "playCompleted",
        "callConnectionId": "<callConnectionId>",
        "serverCallId": "<serverCallId>",
        "correlationId": "<correlationId>"
        },
    "time": "2022-08-12T03:13:25.0252763+00:00",
    "specversion": "1.0",
    "datacontenttype": "application/json",
    "subject": "calling/callConnections/<callConnectionId>/PlayCompleted"
}]
```

To learn more about other supported events, visit the [Call Automation overview document](../../../concepts/call-automation/call-automation.md#call-automation-webhook-events).

## Cancel play action

Cancel all media operations, all pending media operations will be canceled. This action will also cancel other queued play actions.

```console
var callConnection = callAutomationAsyncClient.getCallConnectionAsync(<callConnectionId>);
var cancelResponse = callConnection.getCallMediaAsync().cancelAllMediaOperationsWithResponse().block();
assertEquals(202, cancelResponse.getStatusCode()); // The request was accepted
```

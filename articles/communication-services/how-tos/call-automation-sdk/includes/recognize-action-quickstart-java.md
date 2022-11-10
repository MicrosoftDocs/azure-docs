---
title: include file
description: Java Recognize action quickstart
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/16/2022
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp)
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/voice-video-calling/callflows-for-customer-interactions.md).
- [Java Development Kit](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Technical specifications

The following parameters are available to customize the Recognize function:

| Parameter | Type | Default (if not specified) | Description | Required or Optional |
| ------- | -- | ------------------------ | --------- | ------------------ |
| Prompt <br/><br/> *(for details on Play action, refer to [this quickstart](../play-action.md))* | FileSource | Not set | This will be the message you wish to play before recognizing input. | Optional |
| InterToneTimeout | TimeSpan | 2 seconds <br/><br/>**Min:** 1 second <br/>**Max:** 60 seconds | Limit in seconds that ACS will wait for the caller to press another digit (inter-digit timeout). | Optional |
| InitialSilenceTimeout | TimeSpan | 5seconds<br/><br/>**Min:** 0 seconds <br/>**Max:** 300 seconds | How long recognize action will wait for input before considering it a timeout. | Optional |
| MaxTonesToCollect | Integer | No default<br/><br/>**Min:** 1 | Number of digits a developer expects as input from the participant.| Required |
| StopTones | IEnumeration\<DtmfTone\> | Not set | The digit participants can press to escape out of a batch DTMF event. | Optional |
| InterruptPrompt | Bool | True | If the participant has the ability to interrupt the playMessage by pressing a digit. | Optional |
| InterruptCallMediaOperation | Bool | True | If this flag is set it will interrupt the current call media operation if any (for example if play is going on) and initiate recognize. | Optional |
| OperationContext | String | Not set | String that developers can pass mid action, useful for allowing developers to store context about the events they receive. | Optional |

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

## Configure azure SDK dev feed

Since the Call Automation SDK version used in this quickstart isn't yet available in Maven Central Repository, we need to add an Azure Artifacts development feed, which contains the latest version of Call Automation SDK. 

Add the [azure-sdk-for-java feed](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java) to your `pom.xml`. Follow the instructions after clicking the "Connect to Feed" button.


## Add package references

In your POM file, add the following reference for the project

**azure-communication-callautomation**

``` xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-callautomation</artifactId>
  <version>1.0.0-alpha.20220915.1</version>
</dependency>
```

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about how to start a call view our [quickstart](../../../quickstarts/voice-video-calling/callflows-for-customer-interactions.md). In this instance we'll answer an incoming call.

## Call the recognize action

When your application answers the call, you can provide information about recognizing participant input and playing a prompt.

``` java
CallMediaRecognizeOptions callMediaRecognizeOptions = new CallMediaRecognizeDtmfOptions(targetParticipant, maxTonesToCollect)
        .setInterToneTimeout(Duration.ofSeconds(5))
        .setInterruptCallMediaOperation(true)
        .setInitialSilenceTimeout(Duration.ofSeconds(30))
        .setPlayPrompt(new FileSource().setUri("file://path/to/file"))
        .setInterruptPrompt(true);
callMedia.startRecognizing(callMediaRecognizeOptions).block();
```

**Note:** If parameters aren't set, the defaults will be applied where possible.

## Receiving recognize event updates

Developers can subscribe to *RecognizeCompleted* and *RecognizeFailed* events on the webhook callback they registered for the call to create business logic in their application for determining next steps when one of the aforementioned events occurs. 

Example of *RecognizeCompleted* event:
``` json
[
    {
        "id": "e9cf1c71-f119-48db-86ca-4f2530a2004d",
        "source": "calling/callConnections/411f0b00-d97f-49ad-a6ff-3f8c05dc64d7/RecognizeCompleted",
        "type": "Microsoft.Communication.RecognizeCompleted",
        "data": {
            "eventSource": "calling/callConnections/411f0b00-d97f-49ad-a6ff-3f8c05dc64d7/RecognizeCompleted",
            "operationContext": "267e33a9-c28e-4ecf-a33e-b3abd9526e32",
            "resultInformation": {
                "code": 200,
                "subCode": 8531,
                "message": "Action completed, max digits received."
            },
            "recognitionType": "dtmf",
            "collectTonesResult": {
                "tones": [
                    "nine",
                    "eight",
                    "zero",
                    "five",
                    "two"
                ]
            },
            "callConnectionId": "411f0b00-d97f-49ad-a6ff-3f8c05dc64d7",
            "serverCallId": "aHR0cHM6Ly9hcGkuZmxpZ2h0cHJveHkuc2t5cGUuY29tL2FwaS92Mi9jcC9jb252LXVzZWEyLTAxLmNvbnYuc2t5cGUuY29tL2NvbnYvQzNuT3lkY3E0VTZCV0gtcG1GNmc1Zz9pPTQmZT02Mzc5ODYwMDMzNDQ2MTA5MzM=",
            "correlationId": "53be6977-d832-4c42-8527-fb2aa4a78b74"
        },
        "time": "2022-09-13T00:55:08.2240104+00:00",
        "specversion": "1.0",
        "datacontenttype": "application/json",
        "subject": "calling/callConnections/411f0b00-d97f-49ad-a6ff-3f8c05dc64d7/RecognizeCompleted"
    }
]
```

Example of *RecognizeFailed* event:
``` json
[
    {
        "id": "47d9cb04-7039-427b-af50-aebdd94db054",
        "source": "calling/callConnections/411f0b00-bb72-4d5b-9524-ae1c29713335/RecognizeFailed",
        "type": "Microsoft.Communication.RecognizeFailed",
        "data": {
            "eventSource": "calling/callConnections/411f0b00-bb72-4d5b-9524-ae1c29713335/RecognizeFailed",
            "operationContext": "267e33a9-c28e-4ecf-a33e-b3abd9526e32",
            "resultInformation": {
                "code": 500,
                "subCode": 8511,
                "message": "Action failed, encountered failure while trying to play the prompt."
            },
            "callConnectionId": "411f0b00-bb72-4d5b-9524-ae1c29713335",
            "serverCallId": "aHR0cHM6Ly9hcGkuZmxpZ2h0cHJveHkuc2t5cGUuY29tL2FwaS92Mi9jcC9jb252LXVzZWEyLTAxLmNvbnYuc2t5cGUuY29tL2NvbnYvQzNuT3lkY3E0VTZCV0gtcG1GNmc1Zz9pPTQmZT02Mzc5ODYwMDMzNDQ2MTA5MzM=",
            "correlationId": "53be6977-d832-4c42-8527-fb2aa4a78b74"
        },
        "time": "2022-09-13T00:55:37.0660233+00:00",
        "specversion": "1.0",
        "datacontenttype": "application/json",
        "subject": "calling/callConnections/411f0b00-bb72-4d5b-9524-ae1c29713335/RecognizeFailed"
    }
]
```
Example of how you can deserialize the *RecognizeCompleted* and *RecognizeFailed* event:
``` java
post("/api/callback", (request, response) -> {
    
   List<CallAutomationEventBase> acsEvents = EventHandler.parseEventList(request.body());

    for (CallAutomationEventBase acsEvent : acsEvents) {
        
       if (acsEvent.getClass() == RecognizeCompleted.class) {

            RecognizeCompleted recognizeCompleted = (RecognizeCompleted) acsEvent;

            for (Tone tone : recognizeCompleted.getCollectTonesResult().getTones()) {
                // work on each of the Dtmf tones
            }

        } else if (acsEvent.getClass() == RecognizeFailed.class) {
            
           RecognizeFailed recognizeFailed = (RecognizeFailed) acsEvent;
            
           Logger.getAnonymousLogger().info("Recognize failed due to: " + recognizeFailed.getResultInformation().getMessage());
            
       }

    }

});
```

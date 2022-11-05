---
title: include file
description: Provides a quickstart on how to use Call Automation Java SDK to build call flow for customer interactions.
services: azure-communication-services
author: ashwinder

ms.service: azure-communication-services
ms.subservice: call-automation
ms.date: 09/06/2022
ms.topic: include
ms.custom: include file
ms.author: askaur
---

## Prerequisites

- Azure account with an active subscription.
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../create-communication-resource.md?tabs=windows&pivots=platform-azp). We'll use the resource connection string for this quickstart.
- [Acquire a PSTN phone number from Azure Communication Services.](../../../telephony/get-phone-number.md?pivots=programming-language-java&tabs=windows) This can be done under the Phone Numbers blade of your resource on Azure portal.
- [Java Development Kit (JDK)](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi)

## Create a new Java Spring application

Configure the [Spring Initializr](https://start.spring.io/) to create a new Java Spring application.

1. Set the Project to be a Maven Project.
2. Leave the rest as default unless you want to have your own customization.
3. Add Spring Web to Dependencies section.
4. Generate the application and it will be downloaded as a zip file. Unzip the file and start coding.

:::image type="content" source="./../../media/call-automation/springBootInitializer.png" alt-text="Screenshot of Spring initializer page to create a new Java Spring application":::

## Install the Maven package

**Configure Azure Artifacts development feed:**

Since the Call Automation SDK version used in this QuickStart isn't yet available in Maven Central Repository, we need to configure an Azure Artifacts development feed, which contains the latest version of the Call Automation SDK.

Follow the instruction [here](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java/connect/maven) for adding [azure-sdk-for-java](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java) feed to your POM file.

**Add Call Automation package references:**

*azure-communication-callautomation* - Azure Communication Services Call Automation SDK package is retrieved from the Azure SDK Dev Feed configured above.

Look for the recently published version from [here](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java/maven/com.azure%2Fazure-communication-callautomation/versions)

And then add it to your POM file like this (using version 1.0.0-alpha.20221101.1 as example)

```xml
<dependency>
<groupId>com.azure</groupId>
<artifactId>azure-communication-callautomation</artifactId>
<version>1.0.0-alpha.20221101.1</version>
</dependency>
```

**Add other packages’ references:** 

This section is for adding references for packages that will be used in the following examples.

*azure-messaging-eventgrid* - Azure Event Grid SDK package: [com.azure : azure-messaging-eventgrid](https://search.maven.org/artifact/com.azure/azure-messaging-eventgrid). Data types from this package are used to handle Call Automation IncomingCall event received from the Event Grid.

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-messaging-eventgrid</artifactId>
    <version>4.11.2</version>
</dependency>
```

*gson* - Google Gson package: [com.google.code.gson : gson](https://search.maven.org/artifact/com.google.code.gson/gson) is a serialization/deserialization library to handle conversion between Java Objects and JSON.

```xml
<dependency>
  <groupId>com.google.code.gson</groupId>
  <artifactId>gson</artifactId>
  <version>2.9.0</version>
</dependency>
```

## Obtain your connection string and phone number

From the Azure portal, locate your Communication Service resource.

1. Select on the Keys section to obtain your connection string.
:::image type="content" source="./../../media/call-automation/Key.png" alt-text="Screenshot of Communication Services resource page on portal to access keys":::
2. Then select on the Phone numbers section to obtain your ACS phone number.

## Add Controller.java

In your project folder, create a Controller.java file and update it to handle incoming calls. A callback URI is required so the service knows how to contact your web server for subsequent calls state events such as `CallConnected` and `PlayCompleted`.  

In this code snippet, /api/incomingCall is the default route which will be used to listen for and answer incoming calls. At a later step, we will register this url with EventGrid. Since Event Grid requires you to prove ownership of your Webhook endpoint before it starts delivering events to that endpoint, the code sample also handles this one time validation by processing SubscriptionValidationEvent. This requirement prevents a malicious user from flooding your endpoint with events. For more details, see this [guide](../../../event-grid/webhook-event-delivery.md).

The code sample also illustrates how you can control the callback URI by setting your own context/ID when you answer the call. All events generated by the call will be sent to the specific route you provide when answering an inbound call and the same applies to when you place an outbound call.

```Java
package com.example.demo;

import com.azure.communication.callautomation.*;
import com.azure.communication.callautomation.models.*;
import com.azure.communication.callautomation.models.events.*;
import com.azure.communication.common.CommunicationIdentifier;
import com.azure.communication.common.CommunicationUserIdentifier;
import com.azure.messaging.eventgrid.EventGridEvent;
import com.azure.messaging.eventgrid.systemevents.SubscriptionValidationEventData;
import com.azure.messaging.eventgrid.systemevents.SubscriptionValidationResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.util.*;

@RestController
public class ActionController {
    @Autowired
    private Environment environment;
    private CallAutomationAsyncClient client;

    private CallAutomationAsyncClient getCallAutomationAsyncClient() {
        if (client == null) {
            client = new CallAutomationClientBuilder()
                .connectionString(environment.getProperty("connectionString"))
                .buildAsyncClient();
        }
        return client;
    }

    @RequestMapping(value = "/api/incomingCall", method = POST)
    public ResponseEntity<?> handleIncomingCall(@RequestBody(required = false) String requestBody) {
        List<EventGridEvent> eventGridEvents = EventGridEvent.fromString(requestBody);

        for (EventGridEvent eventGridEvent : eventGridEvents) {
            // Handle the subscription validation event
            if (eventGridEvent.getEventType().equals("Microsoft.EventGrid.SubscriptionValidationEvent")) {
                SubscriptionValidationEventData subscriptionValidationEventData = eventGridEvent.getData().toObject(SubscriptionValidationEventData.class);
                SubscriptionValidationResponse subscriptionValidationResponse = new SubscriptionValidationResponse()
                        .setValidationResponse(subscriptionValidationEventData.getValidationCode());
                ResponseEntity<SubscriptionValidationResponse> ret = new ResponseEntity<>(subscriptionValidationResponse, HttpStatus.OK);
                return ret;
            }

            // Answer the incoming call and pass the callbackUri where Call Automation events will be delivered
            JsonObject data = new Gson().fromJson(eventGridEvent.getData().toString(), JsonObject.class); // Extract body of the event
            String incomingCallContext = data.get("incomingCallContext").getAsString(); // Query the incoming call context info for answering
            String callerId = data.getAsJsonObject("from").get("rawId").getAsString(); // Query the id of caller for preparing the Recognize prompt.

            // Call events of this call will be sent to an url with unique id.
            String callbackUri = environment.getProperty("callbackUriBase") + String.format("/api/calls/%s?callerId=%s", UUID.randomUUID(), callerId);

            AnswerCallResult answerCallResult = getCallAutomationAsyncClient().answerCall(incomingCallContext, callbackUri).block();
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @RequestMapping(value = "/api/calls/{contextId}", method = POST)
    public ResponseEntity<?> handleCallEvents(@RequestBody String requestBody, @PathVariable String contextId, @RequestParam(name = "callerId", required = true) String callerId) {
        List<CallAutomationEventBase> acsEvents = EventHandler.parseEventList(requestBody);

        for (CallAutomationEventBase acsEvent : acsEvents) {
            if (acsEvent instanceof CallConnected) {
                CallConnected event = (CallConnected) acsEvent;

                // Call was answered and is now established
                String callConnectionId = event.getCallConnectionId();
                CommunicationIdentifier target = CommunicationIdentifier.fromRawId(callerId);

                // Play audio then recognize 3-digit DTMF input with pound (#) stop tone
                CallMediaRecognizeDtmfOptions recognizeOptions = new CallMediaRecognizeDtmfOptions(target, 3);
                recognizeOptions.setInterToneTimeout(Duration.ofSeconds(10))
                        .setStopTones(new ArrayList<>(Arrays.asList(DtmfTone.POUND)))
                        .setInitialSilenceTimeout(Duration.ofSeconds(5))
                        .setInterruptPrompt(true)
                        .setPlayPrompt(new FileSource().setUri(environment.getProperty("mediaSource")))
                        .setOperationContext("MainMenu");

                getCallAutomationAsyncClient().getCallConnectionAsync(callConnectionId)
                        .getCallMediaAsync()
                        .startRecognizing(recognizeOptions)
                        .block();
            } else if (acsEvent instanceof RecognizeCompleted) {
                RecognizeCompleted event = (RecognizeCompleted) acsEvent;

                // This RecognizeCompleted correlates to the previous action as per the OperationContext value
                if (event.getOperationContext().equals("MainMenu")) {
                    CallConnectionAsync callConnectionAsync = getCallAutomationAsyncClient().getCallConnectionAsync(event.getCallConnectionId());

                    // Invite other participants to the call
                    List<CommunicationIdentifier> participants = new ArrayList<>(
                            Arrays.asList(new CommunicationUserIdentifier(environment.getProperty("participantToAdd"))));
                    AddParticipantsOptions options = new AddParticipantsOptions(participants);
                    AddParticipantsResult addParticipantsResult = callConnectionAsync.addParticipants(participants).block();
                }
            }
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

```

## Setup a public URI for the local application

In this quick-start, you will use [Ngrok tool](https://ngrok.com/) to project a public URI to a local port so that your local application can be visited by the internet. This is needed to receive the Event Grid `IncomingCall` event and Call Automation events using webhooks.

First, determine the port of your java application. `8080` is the default endpoint of a spring boot application.

Then, [install Ngrok](https://ngrok.com/download) and run Ngrok with the following command: `ngrok http <port>`. This command will create a public URI like `https://ff2f-75-155-253-232.ngrok.io/`, and it is your Ngrok Fully Qualified Domain Name(Ngrok_FQDN). Keep Ngrok running while following the rest of this quick-start.

## Set up environment variables

Some environment variables are used in the shown code snippet, configure them in <PROJECT_ROOT>\src\main\resources\application.properties file.

```java
connectionString=Your_ACS_resource_connection_string
callbackUriBase=Your_Ngrok_FQDN
mediaSource=Link_to_media_file_for_play_prompt
participantToAdd=The_participant_to_be_added_after_recognizing_tones
```

Input phone number with country code, for example: +18001234567. ParticipantToAdd used in the code snippet is assumed to be an ACS User MRI.

## Run the app

To run your Java application, run maven compile, package, and execute commands.

```console
mvn compile
mvn package
mvn exec:java -Dexec.mainClass=com.example.demo.DemoApplication -Dexec.cleanupDaemonThreads=false
```

## Set up IncomingCall event

IncomingCall is an Azure Event Grid event for notifying incoming calls to your Communication Services resource, like the phone number purchased in pre-requisites. Follow [this guide](../../../../how-tos/call-automation-sdk/subscribe-to-incoming-call.md) to set up your IncomingCall event.

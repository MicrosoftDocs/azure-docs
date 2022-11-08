---
title: include file
description: Java Call Automation how-to for redirecting inbound PSTN calls
services: azure-communication-services
author: ashwinder
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/06/2022
ms.topic: include
ms.custom: include file
ms.author: askaur
---

## Prerequisites

- An Azure account with an active subscription.
- A deployed [Communication Service resource](../../../quickstarts/create-communication-resource.md) and valid connection string found by selecting Keys in left side menu on Azure portal.
- [Acquire a PSTN phone number from the Communication Service resource](../../../quickstarts/telephony/get-phone-number.md). Note the phone number you acquired to use in this quickstart.
- [Java Development Kit (JDK)](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Create a new Java Spring application

Configure the [Spring Initializr](https://start.spring.io/) to create a new Java Spring application.

1. Set the Project to be a Maven Project.
2. Leave the rest as default unless you want to have your own customization.
3. Add Spring Web to Dependencies section.
4. Generate the application and it will be downloaded as a zip file. Unzip the file and start coding.

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

## Set up a public URI for the local application

In this quick-start, you'll use [Ngrok tool](https://ngrok.com/) to project a public URI to the local port so that your local application can be visited by the internet. The public URI is needed to receive the Event Grid `IncomingCall` event and Call Automation events using webhooks.

First, determine the port of your java application. `8080` is the default endpoint of a spring boot application.

Then, [install Ngrok](https://ngrok.com/download) and run Ngrok with the following command: `ngrok http <port>`. This command will create a public URI like `https://ff2f-75-155-253-232.ngrok.io/`, and it is your Ngrok Fully Qualified Domain Name(Ngrok_FQDN). Keep Ngrok running while following the rest of this quick-start.

## Redirect incoming call

In your project folder, create a Controller.java file and update it to handle incoming calls. 

In this code snippet, /api/incomingCall is the default route that will be used to listen for incoming calls. At a later step, we'll register this url with Event Grid. Since Event Grid requires you to prove ownership of your Webhook endpoint before it starts delivering events to that endpoint, the code sample also handles this one time validation by processing SubscriptionValidationEvent. This requirement prevents a malicious user from flooding your endpoint with events. For more information, see this [guide](../../../../../event-grid/webhook-event-delivery.md).

```Java
package com.example.demo;

import com.azure.communication.callautomation.*;
import com.azure.communication.callautomation.models.*;
import com.azure.communication.callautomation.models.events.*;
import com.azure.communication.common.CommunicationIdentifier;
import com.azure.communication.common.PhoneNumberIdentifier;
import com.azure.messaging.eventgrid.EventGridEvent;
import com.azure.messaging.eventgrid.systemevents.SubscriptionValidationEventData;
import com.azure.messaging.eventgrid.systemevents.SubscriptionValidationResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.util.*;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
public class ActionController {
    @Autowired
    private CallAutomationAsyncClient client;
 
    private String connectionString = "<resource_connection_string>"); //noted from pre-requisite step
    
    private CallAutomationAsyncClient getCallAutomationAsyncClient() {
        if (client == null) {
            client = new CallAutomationClientBuilder()
                .connectionString(connectionString)
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
                
          JsonObject data = new Gson().fromJson(eventGridEvent.getData().toString(), JsonObject.class);
                
          String incomingCallContext = data.get("incomingCallContext").getAsString();
          CommunicationIdentifier target = new PhoneNumberIdentifier("<phone_number_to_redirect_to>");
          RedirectCallOptions redirectCallOptions = new RedirectCallOptions(incomingCallContext, target); 
          Response<Void> response = client.redirectCallWithResponse(redirectCallOptions).block();                               
        }

        return new ResponseEntity<>(HttpStatus.OK);
      }
}
```
Update the placeholders in the code above for connection string and phone number to redirect to. 

## Run the app

To run your Java application, run maven compile, package, and execute commands.

```console
mvn compile
mvn package
mvn exec:java -Dexec.mainClass=com.example.demo.DemoApplication -Dexec.cleanupDaemonThreads=false
```

---
title: include file
description: Provides a quickstart on how to use Call Automation Java SDK to build call flow for customer interactions.
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

- Azure account with an active subscription.
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../create-communication-resource.md?tabs=windows&pivots=platform-azp). We'll use the resource connection string for this quickstart.
- [Acquire a PSTN phone number from Azure Communication Services.](../../../telephony/get-phone-number.md?pivots=programming-language-java&tabs=windows)
- [Java Development Kit (JDK)](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi)

## Create a new Java application

Open your terminal or command window and navigate to the directory where you would like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template.
```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The command above creates a directory with the same name as `artifactId` argument. Under this directory, `src/main/java` directory contains the project source code, `src/test/java` directory contains the test source

You'll notice that the 'generate' goal created a directory with the same name as the artifactId. Under this directory, `src/main/java` directory contains source code, `src/test/java` directory contains tests, and `pom.xml` file is the project's Project Object Model, or POM.

Update your application's POM file to use Java 8 or higher:
```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

## Configure Azure SDK Dev Feed

Since the Call Automation SDK version used in this QuickStart isn't yet available in Maven Central Repository, we need to add an Azure Artifacts development feed, which contains the latest version of the Call Automation SDK.  

Add the [azure-sdk-for-java](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java) feed to your `pom.xml` and follow the instructions after clicking the “Connect to Feed” button.

## Add package references

In your POM file, add the following dependencies for the project.

**azure-communication-callingserver**

Azure Communication Services Call Automation SDK package is retrieved from the Azure SDK Dev Feed configured above.

Look for the recently published version from [here](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java/maven/com.azure%2Fazure-communication-callingserver/overview/1.0.0-alpha.20220829.1)

And then add it to your POM file like this (using version 1.0.0-alpha.20220829.1 as example)
```xml
<dependency>
<groupId>com.azure</groupId>
<artifactId>azure-communication-callingserver</artifactId>
<version>1.0.0-alpha.20220829.1</version>
</dependency>
```

**azure-messaging-eventgrid**

Azure Event Grid SDK package: [com.azure : azure-messaging-eventgrid](https://search.maven.org/artifact/com.azure/azure-messaging-eventgrid). Data types from this package are used to handle Call Automation IncomingCall event received from the Event Grid.
```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-messaging-eventgrid</artifactId>
    <version>4.11.2</version>
</dependency>
```

**spark-core**

Spark framework: [com.sparkjava : spark-core](https://search.maven.org/artifact/com.sparkjava/spark-core). We’ll use this micro-framework to create a webhook (web api endpoint) to handle Event Grid events. You can use any framework to create a web api.
```xml
<dependency>
  <groupId>com.sparkjava</groupId>
  <artifactId>spark-core</artifactId>
  <version>2.9.4</version>
</dependency>
```

**gson**

Google Gson package: [com.google.code.gson : gson](https://search.maven.org/artifact/com.google.code.gson/gson) is a serialization/deserialization library to handle conversion between Java Objects and JSON.
```xml
<dependency>
  <groupId>com.google.code.gson</groupId>
  <artifactId>gson</artifactId>
  <version>2.9.0</version>
</dependency>
```

## Create a Communication Services User

You'll need a Communication Services user to try out the functionality of adding participants to a call. If you don’t have a Communication Services user yet, you can read [here](../../../identity/quick-create-identity.md) how to create one.

## Update App.java with code

In your editor of choice, open App.java file and update it with the following code. For more addition details, see the comments in the code snipped below.
```Java
package com.communication.quickstart;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;
import java.time.Duration;
import com.azure.communication.callingserver.*;
import com.azure.communication.callingserver.models.*;
import com.azure.communication.callingserver.models.events.*;
import com.azure.communication.common.CommunicationIdentifier;
import com.azure.communication.common.CommunicationUserIdentifier;
import com.azure.communication.common.PhoneNumberIdentifier;
import com.azure.messaging.eventgrid.*;
import com.google.gson.*;
import static spark.Spark.*;
public class App
{
    public static void main( String[] args ) throws URISyntaxException
    {
        // args[0] - the Ngrok base URI
        // callbackUri - location where CallingServer platform's events will be delivered
        // The endpoint must be reachable from the internet, therefore, the base address is Ngrok URI
        URI callbackUri = new URI(args[0] + "/api/callback");
        String connectionString = "[connectionString]";
        CallAutomationClient client = new CallAutomationClientBuilder()
            .connectionString(connectionString)
            .buildClient();
        // Endpoint to receive Event Grid IncomingCall event
        post("/api/incomingCall", (request, response) -> {
            Logger.getAnonymousLogger().info(request.body());
            List<EventGridEvent> eventGridEvents = EventGridEvent.fromString(request.body());
            for (EventGridEvent eventGridEvent : eventGridEvents) {
                JsonObject data = new Gson().fromJson(eventGridEvent.getData().toString(), JsonObject.class);
                // When registering an Event Grid subscription, Event Grid sends a specific request to validate the ownership of the endpoint
                if (eventGridEvent.getEventType().equals("Microsoft.EventGrid.SubscriptionValidationEvent")) {
                    String validationCode = data.get("validationCode").getAsString();
                    return "{\"validationResponse\": \"" + validationCode + "\"}";
                }
                // Answer the incoming call and pass the callbackUri where ServerCalling events will be delivered
                String incomingCallContext = data.get("incomingCallContext").getAsString();
                client.answerCall(incomingCallContext, callbackUri);
            }
            return "";
        });
        // Endpoint to receive CallingServer events
        post("/api/callback", (request, response) -> {
            Logger.getAnonymousLogger().info(request.body());
            List<CallAutomationEventBase> acsEvents = EventHandler.parseEventList(request.body());
            if (acsEvents.isEmpty()) {
                return "";
            }
            for (CallAutomationEventBase acsEvent : acsEvents) {
                if (acsEvent.getClass() == CallConnectedEvent.class) {
                    CallConnectedEvent event = (CallConnectedEvent) acsEvent;
                    // Call was answered and is now established
                    String callConnectionId = event.getCallConnectionId();
                    CallConnection callConnection = client.getCallConnection(callConnectionId);
                    // Play audio to participants in the call
                    CallMedia callMedia = callConnection.getCallMedia();
                    FileSource fileSource = new FileSource().setUri("<Audio file URL>");
                    PlayOptions playOptions = new PlayOptions.setLoop(false);
                    callMedia.playToAllWithResponse(fileSource, playOptions);
                } else if (event.getClass() == CallDisconnectedEvent.class) {
                    // Call disconnected, perform some custom logic
                } else if (event.getClass() == AddParticipantsSucceededEvent.class) {
                    // CommunicationUser was added to the call
                } else if (event.getClass() == AddParticipantsFailedEvent.class) {
                    // CommunicationUser failed to be added to the call
                } else if (event.getClass() == ParticipantsUpdatedEvent.class) {
                    // Participant list of the call is updated
                } else if (event.getClass() == PlayCompleted.class) {
                    PlayCompleted event = (PlayCompleted) acsEvent;
                    // Add participant to the call after audio has completed playing.
                    String callConnectionId = event.getCallConnectionId();
                    CallConnection callConnection = client.getCallConnection(callConnectionId);
                    // Invite other participants to the call
                    List<CommunicationIdentifier> participants = new ArrayList<>(
                        Arrays.asList(new CommunicationUserIdentifier("[acsUserId]")));
                    AddParticipantsOptions options = new AddParticipantsOptions(participants)
                        .setInvitationTimeout(Duration.ofSeconds(30))
                        .setOperationContext(UUID.randomUUID().toString())
                        .setSourceCallerId(new PhoneNumberIdentifier("[phoneNumber]"));
                    callConnection.addParticipants(options);
                }
            }
            return "";
        });
    }
}
```

## Start Ngrok

In this quickstart, we'll use [Ngrok tool](https://ngrok.com/) to make our localhost java application reachable from the internet. This tool will be needed to receive the Event Grid `IncomingCall` event and the Call Automation events using webhooks.

Determine the root URI of the java application. By default, it should be `http://localhost:4567/` where the port is 4567.

Install and run Ngrok with the following command: `ngrok http <port>`. This command will create a public URI like `https://ff2f-75-155-253-232.ngrok.io/`, we’ll need this URI in the next sections. Keep Ngrok running while following the rest of this quickstart.

## Run the code

To run your Java application, run maven compile, package, and execute commands. By default, SparkJava runs on port 4567, so the endpoints will be available at `http://localhost:4567/api/incomingCall` and `http://localhost:4567/api/callback`.

The application expects Ngrok base address URI to be passed as the first argument to the main method. This URI is used to register the webhook for receiving Call Automation events. Remember to replace `ngrokBaseUri` with your Ngrok URI, for example, `https://ff2f-75-155-253-232.ngrok.io`  
```console
mvn compile
mvn package
mvn exec:java -Dexec.mainClass=com.communication.quickstart.App -Dexec.cleanupDaemonThreads=false -Dexec.args=<ngrokBaseUri>
```

## Subscribe to Event Grid IncomingCall event using a webhook

Call Automation uses Event Grid to deliver the `IncomingCall` event. In this section, we configure a webhook to receive events from the Event Grid.

1. Find the following identifiers used in the next step: Azure subscription ID, resource group name, Communication Services resource name.
2. Since the `IncomingCall` event isn't yet published in the Azure portal, you need run the following Azure CLI command to configure an event subscription (replace with your identifiers and Ngrok URI).
```console
az eventgrid event-subscription create --name <eventSubscriptionName> \
    --endpoint-type webhook \
    --endpoint <ngrokUri> \
    --included-event-types Microsoft.Communication.IncomingCall \
    --source-resource-id "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>"
```

## Test the scenario

Now, given that all setup is completed, you can test your application:

1. Call the number you acquired in the prerequisites section of this guide.
2. The incoming call event is sent to the application’s `/api/incomingCall` endpoint. Application answers the call using Call Automation SDK.
3. `CallConnected` event is delivered to `/api/callback` endpoint.
4. Play audio on a loop to all participants on the call.
5. When the audio file has played, a `PlayCompleted` event is received. 
6. Application adds a participant to the call (web app user created earlier in this quickstart).
7. User accepts the invitation to join the call. 
8. `AddParticipantsSucceeded` event is delivered to `/api/callback` endpoint.
9. After all participants have left the call, `CallDisconnected` event is delivered to `/api/callback` endpoint.

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
- A deployed [Communication Service resource](../../../quickstarts/create-communication-resource.md) and valid Connection String
- [Acquire a PSTN phone number from the Communication Service resource](../../../quickstarts/telephony/get-phone-number.md).
- Optional: [NGROK application](https://ngrok.com/) to proxy HTTP/S requests to a local development machine.
- [Java Development Kit (JDK)](/java/azure/jdk/?preserve-view=true&view=azure-java-stable) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi).
- An Event Grid subscription for Incoming Call. 

## Create a new Java application

Open your terminal or command window and navigate to the directory where you would like to create your Java application. Run the command below to generate the Java project from the maven-archetype-quickstart template.
```console
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

The command above creates a directory with the same name as `artifactId` argument. Under this directory, `src/main/java` directory contains the project source code, `src/test/java` directory contains the test source.

You'll notice that the 'generate' step created a directory with the same name as the artifactId. Under this directory, `src/main/java` directory contains source code, `src/test/java` directory contains tests, and `pom.xml` file is the project's Project Object Model, or POM.

Update your application's POM file to use Java 8 or higher.
```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

## Configure Azure SDK Dev Feed

Since the Call Automation SDK version used in this quick start isn't yet available in Maven Central Repository, we need to add an Azure Artifacts development feed, which contains the latest version of the Call Automation SDK.  

Add the [azure-sdk-for-java feed](https://dev.azure.com/azure-sdk/public/_artifacts/feed/azure-sdk-for-java) to your `pom.xml`. Follow the instructions after clicking the “Connect to Feed” button.

## Add package references

In your POM file, add the following dependencies for the project.

**azure-communication-callautomation**

Azure Communication Services Call Automation SDK package is retrieved from the Azure SDK Dev Feed configured above.
```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-callautomation</artifactId>
  <version>1.0.0-alpha.20220928.2</version>
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

Spark framework: com.sparkjava : spark-core. We’ll use this micro-framework to create a webhook (web api endpoint) to handle Event Grid events. You can use any framework to create a web api.
```xml
<dependency>
  <groupId>com.sparkjava</groupId>
  <artifactId>spark-core</artifactId>
  <version>2.9.4</version>
</dependency>
```

**gson**

Google Gson package: [com.google.code.gson : gson](https://search.maven.org/artifact/com.sparkjava/spark-core). A serialization/deserialization library to handle conversion between Java Objects and JSON.
```xml
<dependency>
  <groupId>com.google.code.gson</groupId>
  <artifactId>gson</artifactId>
  <version>2.9.0</version>
</dependency>
```

## Redirect incoming call

In your editor of choice, open App.java file and update it with the following code to create an endpoint to receive IncomingCall events and redirect calls to another user.
```java
package com.communication.quickstart;

import java.util.List;
import com.azure.communication.callautomation.*;
import com.azure.communication.common.CommunicationUserIdentifier;
import com.azure.messaging.eventgrid.*;
import com.google.gson.*;
import static spark.Spark.*;

public class App 
{
    public static void main( String[] args )
    {
        String connectionString = "<acsConnectionString>";
        CallAutomationClient client = new CallAutomationClientBuilder().connectionString(connectionString).buildClient(false);

        post("/api/incomingCall", (request, response) -> {
            List<EventGridEvent> eventGridEvents = EventGridEvent.fromString(request.body());

            for (EventGridEvent eventGridEvent : eventGridEvents) {

                // Webhook validation is assumed to be complete
                JsonObject data = new Gson().fromJson(eventGridEvent.getData().toString(), JsonObject.class);
                                               
                String incomingCallContext = data.get("incomingCallContext").getAsString();
                client.redirectCall(incomingCallContext, new CommunicationUserIdentifier("<userId>"));
            }

            return "";
        });
    }
}
```

## Run the code

To run your Java application, run maven compile, package, and execute commands. By default, SparkJava runs on port 4567, so the endpoint will be available at `http://localhost:4567/api/incomingCall`.

---
title: Receive events using namespace topics with Java
description: This article provides step-by-step instructions to consume events from Event Grid namespace topics using pull delivery.
ms.topic: quickstart
ms.custom: ignite-2023, devx-track-extended-java
ms.author: jafernan
author: jfggdl
ms.date: 11/15/2023
---

# Receive events using pull delivery with Java

This article provides quick, step-by-step guide to receive CloudEvents using Event Grid's pull delivery. It provides sample code to receive, acknowledge (delete events from Event Grid).

## Prerequisites

The prerequisites you need to have in place before proceeding are:

* Understand what pull delivery is. For more information, see [pull delivery concepts](concepts-event-grid-namespaces.md#pull-delivery) and [pull delivery overview](pull-delivery-overview.md).

* A namespace, topic, and event subscription.

    * Create and manage a [namespace](create-view-manage-namespaces.md)
    * Create and manage a [namespace topic](create-view-manage-namespace-topics.md)
    * Create and manage an [event subscription](create-view-manage-event-subscriptions.md)

* The latest ***beta*** SDK package. If you're using maven, you can consult the [maven central repository](https://central.sonatype.com/artifact/com.azure/azure-messaging-eventgrid/versions).

    >[!IMPORTANT]
    >Pull delivery data plane SDK support is available in ***beta*** packages. You should use the latest beta package in your project.

* An IDE that support Java like IntelliJ IDEA, Eclipse IDE, or Visual Studio Code.

* Java JRE running Java 8 language level.

* You should have events available on a topic. See [publish events](publish-events-to-namespace-topics-java.md) to namespace topics.

## Sample code

The sample code used in this article is found in this location:

```bash
    https://github.com/jfggdl/event-grid-pull-delivery-quickstart
```

## Receive events using pull delivery

You read events from Event Grid by specifying a namespace topic and a *queue* event subscription with the *receive* operation. The event subscription is the resource that effectively defines the collection of CloudEvents that a consumer client can read.
This sample code uses key-based authentication as it provides a quick and simple approach for authentication. For production scenarios, you should use Microsoft Entry ID authentication because it provides a much more robust authentication mechanism.

```java
package com.azure.messaging.eventgrid.samples;

import com.azure.core.credential.AzureKeyCredential;
import com.azure.core.http.HttpClient;
import com.azure.core.models.CloudEvent;
import com.azure.messaging.eventgrid.EventGridClient;
import com.azure.messaging.eventgrid.EventGridClientBuilder;
import com.azure.messaging.eventgrid.EventGridMessagingServiceVersion;
import com.azure.messaging.eventgrid.models.*;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>Simple demo consumer app of CloudEvents from queue event subscriptions created for namespace topics.
 * This code samples should use Java 1.8 level or above to avoid compilation errors.
 * You should consult the resources below to use the client SDK and set up your project using maven.
 * @see <a href="https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/eventgrid/azure-messaging-eventgrid">Event Grid data plane client SDK documentation</a>
 * @see <a href="https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/boms/azure-sdk-bom/README.md">Azure BOM for client libraries</a>
 * @see <a href="https://aka.ms/spring/versions">Spring Version Mapping</a> if you are using Spring.
 * @see <a href="https://aka.ms/azsdk">Tool with links to control plane and data plane SDKs across all languages supported</a>.
 *</p>
 */
public class NamespaceTopicConsumer {
    private static final String TOPIC_NAME = "<yourNamespaceTopicName>";
    public static final String EVENT_SUBSCRIPTION_NAME = "<yourEventSusbcriptionName>";
    public static final String ENDPOINT =  "<yourFullHttpsUrlToTheNamespaceEndpoint>";
    public static final int MAX_NUMBER_OF_EVENTS_TO_RECEIVE = 10;
    public static final Duration MAX_WAIT_TIME_FOR_EVENTS = Duration.ofSeconds(10);

    private static EventGridClient eventGridClient;
    private static List<String> receivedCloudEventLockTokens = new ArrayList<>();
    private static List<CloudEvent> receivedCloudEvents = new ArrayList<>();

    //TODO  Do NOT include keys in source code. This code's objective is to give you a succinct sample about using Event Grid, not to provide an authoritative example for handling secrets in applications.
    /**
     * For security concerns, you should not have keys or any other secret in any part of the application code.
     * You should use services like Azure Key Vault for managing your keys.
     */
    public static final AzureKeyCredential CREDENTIAL = new AzureKeyCredential("<namespace key>");
    public static void main(String[] args) {
        //TODO Update Event Grid version number to your desired version. You can find more information on data plane APIs here:
        //https://learn.microsoft.com/en-us/rest/api/eventgrid/.
        eventGridClient = new EventGridClientBuilder()
                .httpClient(HttpClient.createDefault())  // Requires Java 1.8 level
                .endpoint(ENDPOINT)
                .serviceVersion(EventGridMessagingServiceVersion.V2023_06_01_PREVIEW)
                .credential(CREDENTIAL).buildClient();   // you may want to use .buildAsyncClient() for an asynchronous (project reactor) client.

        System.out.println("Waiting " +  MAX_WAIT_TIME_FOR_EVENTS.toSecondsPart() + " seconds for events to be read...");
        List<ReceiveDetails> receiveDetails = eventGridClient.receiveCloudEvents(TOPIC_NAME, EVENT_SUBSCRIPTION_NAME,
                MAX_NUMBER_OF_EVENTS_TO_RECEIVE, MAX_WAIT_TIME_FOR_EVENTS).getValue();

        for (ReceiveDetails detail : receiveDetails) {
            // Add order message received to a tracking list
            CloudEvent orderCloudEvent = detail.getEvent();
            receivedCloudEvents.add(orderCloudEvent);
            // Add lock token to a tracking list. Lock token functions like an identifier to a cloudEvent
            BrokerProperties metadataForCloudEventReceived = detail.getBrokerProperties();
            String lockToken = metadataForCloudEventReceived.getLockToken();
            receivedCloudEventLockTokens.add(lockToken);
        }
        System.out.println("<-- Number of events received: " + receivedCloudEvents.size());
```

## Acknowledge events

To acknowledge events, use the same code used for receiving events and add the following lines to call an acknowledge private method:

```java
        // Acknowledge (i.e. delete from Event Grid the) events
        acknowledge(receivedCloudEventLockTokens);
```

A sample implementation of an acknowledge method along with a utility method to print information about failed lock tokens follows:

```java
    private static void acknowledge(List<String> lockTokens) {
        AcknowledgeResult acknowledgeResult = eventGridClient.acknowledgeCloudEvents(TOPIC_NAME, EVENT_SUBSCRIPTION_NAME, new AcknowledgeOptions(lockTokens));
        List<String> succeededLockTokens = acknowledgeResult.getSucceededLockTokens();
        if (succeededLockTokens != null && lockTokens.size() >= 1)
            System.out.println("@@@ " + succeededLockTokens.size() + " events were successfully acknowledged:");
        for (String lockToken : succeededLockTokens) {
            System.out.println("    Acknowledged event lock token: " + lockToken);
        }
        // Print the information about failed lock tokens
        if (succeededLockTokens.size() < lockTokens.size()) {
            System.out.println("    At least one event was not acknowledged (deleted from Event Grid)");
            writeFailedLockTokens(acknowledgeResult.getFailedLockTokens());
        }
    }

    private static void writeFailedLockTokens(List<FailedLockToken> failedLockTokens) {
        for (FailedLockToken failedLockToken : failedLockTokens) {
            System.out.println("    Failed lock token: " + failedLockToken.getLockToken());
            System.out.println("    Error code: " + failedLockToken.getErrorCode());
            System.out.println("    Error description: " + failedLockToken.getErrorDescription());
        }
    }
```

## Release events

Release events to make them available for redelivery. Similar to what you did for acknowledging events, you can add the following static method and a line to invoke it to release events identified by the lock tokens passed as argument. You need the ```writeFailedLockTokens``` method for this method to compile.
 
```java
   private static void release(List<String> lockTokens) {
        ReleaseResult releaseResult = eventGridClient.releaseCloudEvents(TOPIC_NAME, EVENT_SUBSCRIPTION_NAME, new ReleaseOptions(lockTokens));
        List<String> succeededLockTokens = releaseResult.getSucceededLockTokens();
        if (succeededLockTokens != null && lockTokens.size() >= 1)
            System.out.println("^^^ " + succeededLockTokens.size() + " events were successfully released:");
        for (String lockToken : succeededLockTokens) {
            System.out.println("    Released event lock token: " + lockToken);
        }
        // Print the information about failed lock tokens
        if (succeededLockTokens.size() < lockTokens.size()) {
            System.out.println("    At least one event was not released back to Event Grid.");
            writeFailedLockTokens(releaseResult.getFailedLockTokens());
        }
    }
```

## Reject events

Reject events that your consumer application can't process. Conditions for which you reject an event include a malformed event that can't be parsed or problems with the application that process the events.

```java
    private static void reject(List<String> lockTokens) {
        RejectResult rejectResult = eventGridClient.rejectCloudEvents(TOPIC_NAME, EVENT_SUBSCRIPTION_NAME, new RejectOptions(lockTokens));
        List<String> succeededLockTokens = rejectResult.getSucceededLockTokens();
        if (succeededLockTokens != null && lockTokens.size() >= 1)
            System.out.println("--- " + succeededLockTokens.size() + " events were successfully rejected:");
        for (String lockToken : succeededLockTokens) {
            System.out.println("    Rejected event lock token: " + lockToken);
        }
        // Print the information about failed lock tokens
        if (succeededLockTokens.size() < lockTokens.size()) {
            System.out.println("    At least one event was not rejected.");
            writeFailedLockTokens(rejectResult.getFailedLockTokens());
        }
    }
```

## Next steps

* To learn more about pull delivery model, see [Pull delivery overview](pull-delivery-overview.md).

 

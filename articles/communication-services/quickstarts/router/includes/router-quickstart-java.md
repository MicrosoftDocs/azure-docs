---
title: include file
description: include file
services: azure-communication-services
author: williamzhao
manager: bga

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/09/2023
ms.topic: include
ms.custom: include file
ms.author: williamzhao
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).
- [Java Development Kit (JDK)](/java/azure/jdk/?view=azure-java-stable&preserve-view=true) version 8 or above.
- [Apache Maven](https://maven.apache.org/download.cgi)

## Sample code

You can review and download the sample code for this quick start on [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/jobrouter-quickstart-java).

## Setting up

### Create a new Java application

In a console window (such as cmd, PowerShell, or Bash), use the `mvn` command below to create a new console app with the name `router-quickstart`. This command creates a simple "Hello World" Java project with a single source file: **App.java**.

```console
mvn archetype:generate -DgroupId=com.communication.jobrouter.quickstart -DartifactId=jobrouter-quickstart-java -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

### Include the package

You'll need to use the Azure Communication Job Router client library for Java [version 1.0.0-beta.1](https://search.maven.org/artifact/com.azure/azure-communication-jobrouter/1.0.0-beta.1/jar) or above.

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-jobrouter</artifactId>
  <version>1.0.0-beta.1</version>
</dependency>
```

### Set up app framework

Go to the /src/main/java/com/communication/quickstart directory and open the `App.java` file. Add the following code:

```java
package com.communication.quickstart;

import com.azure.communication.jobrouter.JobRouterAdministrationClient;
import com.azure.communication.jobrouter.JobRouterAdministrationClientBuilder;
import com.azure.communication.jobrouter.JobRouterClient;
import com.azure.communication.jobrouter.JobRouterClientBuilder;
import com.azure.communication.jobrouter.*;
import com.azure.communication.jobrouter.models.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;

public class App
{
    public static void main(String[] args) throws IOException
    {
        System.out.println("Azure Communication Services - Job Router Quickstart");
        // Quickstart code goes here
    }
}
```

## Initialize the Job Router client and administration client

Job Router clients can be authenticated using your connection string acquired from an Azure Communication Services resource in the Azure portal.  We generate both a client and an administration client to interact with the Job Router service.  The admin client is used to provision queues and policies, while the client is used to submit jobs and register workers. For more information on connection strings, see [access-your-connection-strings-and-service-endpoints](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```java
// Get a connection string to our Azure Communication Services resource.
String connectionString = "your_connection_string";
JobRouterAdministrationClient routerAdminClient = new JobRouterAdministrationClientBuilder().connectionString(connectionString).buildClient();
JobRouterClient routerClient = new JobRouterClientBuilder().connectionString(connectionString).buildClient();
```

## Create a distribution policy

Job Router uses a distribution policy to decide how Workers will be notified of available Jobs and the time to live for the notifications, known as **Offers**. Create the policy by specifying the **ID**, a **name**, an **offerExpiresAfter**, and a distribution **mode**.

```java
DistributionPolicy distributionPolicy = routerAdminClient.createDistributionPolicy(
    new CreateDistributionPolicyOptions("distribution-policy-1", Duration.ofMinutes(1), new LongestIdleMode())
        .setName("My distribution policy"));
```

## Create a queue

Create the Queue by specifying an **ID**, **name**, and provide the **Distribution Policy** object's ID you created above.

```java
RouterQueue queue = routerAdminClient.createQueue(
    new CreateQueueOptions("queue-1", distributionPolicy.getId()).setName("My queue")
);
```

## Submit a job

Now, we can submit a job directly to that queue, with a worker selector that requires the worker to have the label `Some-Skill` greater than 10.

```java
RouterJob job = routerClient.createJob(new CreateJobOptions("job-1", "voice", queue.getId())
    .setPriority(1)
    .setRequestedWorkerSelectors(List.of(
        new RouterWorkerSelector("Some-Skill", LabelOperator.GREATER_THAN, new LabelValue(10)))));
```

## Create a worker

Now, we create a worker to receive work from that queue, with a label of `Some-Skill` equal to 11 and capacity on `my-channel`.

```java
RouterWorker worker = routerClient.createWorker(
    new CreateWorkerOptions("worker-1", 1)
        .setQueueAssignments(Map.of(queue.getId(), new RouterQueueAssignment()))
        .setLabels(Map.of("Some-Skill", new LabelValue(11)))
        .setChannelConfigurations(Map.of("voice", new ChannelConfiguration(1))));
```

## Receive an offer

We should get a [RouterWorkerOfferIssued][offer_issued_event] from our [Event Grid subscription][subscribe_events].
However, we could also wait a few seconds and then query the worker directly against the JobRouter API to see if an offer was issued to it.

```java
Thread.sleep(10000);
worker = routerClient.getWorker(worker.getId());
for (RouterJobOffer offer : worker.getOffers()) {
    System.out.printf("Worker %s has an active offer for job %s\n", worker.getId(), offer.getJobId());
}
```

## Accept the job offer

Then, the worker can accept the job offer by using the SDK, which assigns the job to the worker.

```java
AcceptJobOfferResult accept = routerClient.acceptJobOffer(worker.getId(), worker.getOffers().get(0).getOfferId());
System.out.printf("Worker %s is assigned job %s\n", worker.getId(), accept.getJobId());
```

## Complete the job

Once the worker has completed the work associated with the job (for example, completed the call), we complete the job.

```java
routerClient.completeJob(new CompleteJobOptions(accept.getJobId(), accept.getAssignmentId()));
System.out.printf("Worker %s has completed job %s\n", worker.getId(), accept.getJobId());
```

## Close the job

Once the worker is ready to take on new jobs, the worker should close the job.  Optionally, the worker can provide a disposition code to indicate the outcome of the job.

```java
routerClient.closeJob(new CloseJobOptions(accept.getJobId(), accept.getAssignmentId())
    .setDispositionCode("Resolved"));
System.out.printf("Worker %s has closed job %s\n", worker.getId(), accept.getJobId());
```

## Delete the job

Once the job has been closed, we can delete the job so that we can re-create the job with the same ID if we run this sample again

```javascript
routerClient.deleteJob(accept.getJobId());
System.out.printf("Deleting job %s\n", accept.getJobId());
```

## Run the code

To run the code, go to the directory that contains the `pom.xml` file and compile the program.

```console
mvn compile
```

Then, build the package:

```console
mvn package
```

Execute the app

```console
mvn exec:java -Dexec.mainClass="com.communication.jobrouter.quickstart.App" -Dexec.cleanupDaemonThreads=false
```

The expected output describes each completed action:

```console
Azure Communication Services - Job Router Quickstart
Worker worker-1 has an active offer for job job-1
Worker worker-1 is assigned job job-1
Worker worker-1 has completed job job-1
Worker worker-1 has closed job job-1
Deleting job job-1
```

> [!NOTE]
> Running the application more than once will cause a new Job to be placed in the queue each time. This can cause the Worker to be offered a Job other than the one created when you run the above code. Since this can skew your request, considering deleting Jobs in the queue each time. Refer to the SDK documentation for managing a Queue or a Job.

## Reference documentation

Read about the full set of capabilities of Azure Communication Services Job Router from the [Java SDK reference](/azure/developer/java/sdk/) or [REST API reference](/rest/api/communication/jobrouter/job-router).

<!-- LINKS -->

[subscribe_events]: ../../../how-tos/router-sdk/subscribe-events.md
[offer_issued_event]: ../../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued

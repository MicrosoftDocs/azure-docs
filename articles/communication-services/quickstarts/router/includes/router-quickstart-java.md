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
mvn archetype:generate -DgroupId=com.communication.quickstart -DartifactId=communication-quickstart -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

### Include the package

You'll need to use the Azure Communication Job Router client library for Java [version 1.0.0-beta.1](https://search.maven.org/artifact/com.azure/azure-communication-job-router/1.0.0-beta.1/jar) or above.

#### Include the BOM file

Include the `azure-sdk-bom` to your project to take dependency on the Public Preview version of the library. In the following snippet, replace the {bom_version_to_target} placeholder with the version number.
To learn more about the BOM, see the [Azure SDK BOM readme](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/boms/azure-sdk-bom/README.md).

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-sdk-bom</artifactId>
            <version>{bom_version_to_target}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

and then include the direct dependency in the dependencies section without the version tag.

```xml
<dependencies>
  <dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-job-router</artifactId>
  </dependency>
</dependencies>
```

#### Include direct dependency

If you want to take dependency on a particular version of the library that isn't present in the BOM, add the direct dependency to your project as follows.

[//]: # ({x-version-update-start;com.azure:azure-communication-job-router;current})

```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-communication-job-router</artifactId>
  <version>1.0.0-beta.1</version>
</dependency>
```

### Set up app framework

Go to the /src/main/java/com/communication/quickstart directory and open the `App.java` file. Add the following code:

```java
package com.communication.quickstart;

import com.azure.communication.common.*;
import com.azure.communication.identity.*;
import com.azure.communication.identity.models.*;
import com.azure.core.credential.*;
import com.azure.communication.jobrouter.*;

import java.io.IOException;
import java.time.*;
import java.util.*;

public class App
{
    public static void main( String[] args ) throws IOException
    {
        System.out.println("Azure Communication Services - Job Router Quickstart");
        // Quickstart code goes here
    }
}
```

## Initialize the Job Router client and administration client

Job Router clients can be authenticated using your connection string acquired from an Azure Communication Services resource in the Azure portal.  We will generate both a client and an administration client to interact with the Job Router service.  The admin client will be used to provision queues and policies, while the client will be used to submit jobs and register workers.  For more information on connection strings, see [access-your-connection-strings-and-service-endpoints](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```java
// Get a connection string to our Azure Communication Services resource.
String connectionString = "your_connection_string";
JobRouterAdministrationClient routerAdminClient = new JobRouterAdministrationClientBuilder().connectionString(connectionString).buildClient();
JobRouterClient routerClient = new JobRouterClientBuilder().connectionString(connectionString).buildClient();
```

## Create a distribution policy

Job Router uses a distribution policy to decide how Workers will be notified of available Jobs and the time to live for the notifications, known as **Offers**. Create the policy by specifying the **ID**, a **name**, an **offerTTL**, and a distribution **mode**.

```java
DistributionPolicy distributionPolicy = JobRouterAdministrationClient.createDistributionPolicy(
    new CreateDistributionPolicyOptions(
        "distribution-policy-1",
        Duration.ofMinutes(1),
        new LongestIdleMode())
    .setName("My distribution policy"));
```

## Create a queue

Create the Queue by specifying an **ID**, **name**, and provide the **Distribution Policy** object's ID you created above.

```java
Queue queue = routerAdminClient.createQueue(
    new CreateQueueOptions("queue-1",distributionPolicy.getId())
        .setName("My queue")
);
```

## Submit a job

Now, we can submit a job directly to that queue, with a worker selector that requires the worker to have the label `Some-Skill` greater than 10.

```java
RouterJob job = routerClient.createJob(
    new CreateJobOptions("job-1", "voice", queue.getId())
        .setPriority(1)
        .setRequestedWorkerSelectors(new ArrayList<WorkerSelector>() {{
            add(new WorkerSelector("Some-Skill", LabelOperator.GREATER_THAN, new LabelValue(10)));
        }}));
```

## Create a worker

Now, we create a worker to receive work from that queue, with a label of `Some-Skill` equal to 11 and capacity on `my-channel`.

```java
RouterWorker worker = routerClient.createWorker(
    new CreateWorkerOptions("worker-1", 1)
        .setQueueIds(new HashMap<String, QueueAssignment>() {{
            put(queue.getId(), new QueueAssignment());
        }})
        .setLabels(new HashMap<String, LabelValue>() {{
            put("Some-Skill", new LabelValue(11));
        }})
        .setChannelConfigurations(new HashMap<String, ChannelConfiguration>() {{
            put("voice", new ChannelConfiguration(1));
        }}));
```

## Receive an offer

We should get a [RouterWorkerOfferIssued][offer_issued_event] from our [Event Grid subscription][subscribe_events].
However, we could also wait a few seconds and then query the worker directly against the JobRouter API to see if an offer was issued to it.

```java
Thread.sleep(3000);
worker = routerClient.getWorker(worker.getId());
for (RouterWorkerOffer offer : worker.getOffers()) {
    System.out.printf("Worker %s has an active offer for job %s", worker.getId(), offer.getJobId());
}
```

## Accept the job offer

Then, the worker can accept the job offer by using the SDK, which will assign the job to the worker.

```java
AcceptJobOfferResult accept = routerClient.acceptJobOffer(worker.getId(), worker.getOffers().get(0).getOfferId());
System.out.printf("Worker %s is assigned job %s", worker.getId(), accept.getJobId());
```

## Complete the job

Once the worker has completed the work associated with the job (e.g. completed the call).

```java
routerClient.completeJob(new CompleteJobOptions("job-1", accept.getAssignmentId()));
System.out.printf("Worker %s has completed job %s", worker.getId(), accept.getJobId());
```

## Close the job

Once the worker is ready to take on new jobs, the worker should close the job.  Optionally, the worker can provide a disposition code to indicate the outcome of the job.

```java
routerClient.closeJob(new CloseJobOptions("job-1", accept.getAssignmentId())
    .setDispositionCode("Resolved"));
System.out.printf("Worker %s has closed job %s", worker.getId(), accept.getJobId());
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
mvn exec:java -Dexec.mainClass="com.communication.quickstart.App" -Dexec.cleanupDaemonThreads=false
```

The expected output describes each completed action:

```console
Azure Communication Services - Job Router Quickstart

Worker worker-1 has an active offer for job 6b83c5ad-5a92-4aa8-b986-3989c791be91
Worker worker-1 is assigned job 6b83c5ad-5a92-4aa8-b986-3989c791be91
Worker worker-1 has completed job 6b83c5ad-5a92-4aa8-b986-3989c791be91
Worker worker-1 has closed job 6b83c5ad-5a92-4aa8-b986-3989c791be91
```

> [!NOTE]
> Running the application more than once will cause a new Job to be placed in the queue each time. This can cause the Worker to be offered a Job other than the one created when you run the above code. Since this can skew your request, considering deleting Jobs in the queue each time. Refer to the SDK documentation for managing a Queue or a Job.

## Reference documentation

Read about the full set of capabilities of Azure Communication Services Job Router from the [Java SDK reference](/java/api/overview/azure/communication.jobrouter-readme) or [REST API reference](/rest/api/communication/job-router).

<!-- LINKS -->

[subscribe_events]: ../../../how-tos/router-sdk/subscribe-events.md
[offer_issued_event]: ../../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued

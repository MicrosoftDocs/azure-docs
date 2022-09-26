---
title: Quickstart - Submit a Job for queuing and routing
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to create a Job Router client, Distribution Policy, Queue, and Job within your Azure Communication Services resource.
author: jasonshave
manager: phans
services: azure-communication-services
ms.author: jassha
ms.date: 10/18/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---
# Quickstart: Submit a job for queuing and routing

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

Get started with Azure Communication Services Job Router by setting up your client. Then can configure core functionality such as queues, policies, workers, and Jobs. To learn more about Job Router concepts, visit [Job Router conceptual documentation](../../concepts/router/concepts.md)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../create-communication-resource.md).

## Setting up

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `JobRouterQuickstart`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o JobRouterQuickstart
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd JobRouterQuickstart
dotnet build
```

### Install the package

During private preview, please download the SDK from [GitHub](https://github.com/Azure/communication-preview/releases/tag/communication-job-router-net-v1.0.0-alpha.20211012.1).

> [!NOTE]
> You must be a member of the private preview group to download the SDKs.

Add the following `using` directives to the top of **Program.cs** to include the JobRouter namespaces.

```csharp
using Azure.Communication.JobRouter;
using Azure.Communication.JobRouter.Models;
```

Update `Main` function signature to be `async` and return a `Task`.

```csharp
static async Task Main(string[] args)
{
  ...
}
```

## Authenticate the Job Router client

Job Router clients can be authenticated using your connection string acquired from an Azure Communication Services resource in the Azure portal.

```csharp
// Get a connection string to our Azure Communication Services resource.
var connectionString = "your_connection_string";
var client = new RouterClient(connectionString);
```

## Create a distribution policy

Job Router uses a distribution policy to decide how Workers will be notified of available Jobs and the time to live for the notifications, known as **Offers**. Create the policy by specifying the **ID**, a **name**, an **offerTTL**, and a distribution **mode**.

```csharp
var distributionPolicy = await routerClient.SetDistributionPolicyAsync(
    id: "distribution-policy-1",
    name: "My Distribution Policy",
    offerTTL: TimeSpan.FromSeconds(30),
    mode: new LongestIdleMode()
);
```

## Create a queue

Create the Queue by specifying an **ID**, **name**, and provide the **Distribution Policy** object's ID you created above.

```csharp
var queue = await routerClient.SetQueueAsync(
    id: "queue-1",
    name: "My Queue",
    distributionPolicyId: distributionPolicy.Value.Id
);
```

## Submit a job

Now, we can submit a job directly to that queue, with a worker selector the requires the worker to have the label `Some-Skill` greater than 10.

```csharp
var job = await routerClient.CreateJobAsync(
    channelId: "my-channel",
    queueId: queue.Value.Id,
    priority: 1,
    workerSelectors: new List<LabelSelector>
    {
        new LabelSelector(
            key: "Some-Skill", 
            @operator: LabelOperator.GreaterThan, 
            value: 10)
    });
```

## Register a worker

Now, we register a worker to receive work from that queue, with a label of `Some-Skill` equal to 11 and capacity on `my-channel`.

```csharp
var worker = await routerClient.RegisterWorkerAsync(
    id: "worker-1",
    queueIds: new[] { queue.Value.Id },
    totalCapacity: 1,
    labels: new LabelCollection()
    {
        ["Some-Skill"] = 11
    },
    channelConfigurations: new List<ChannelConfiguration>
    {
        new ChannelConfiguration("my-channel", 1)
    }
);
```

### Offer

We should get a [RouterWorkerOfferIssued][offer_issued_event] from our [EventGrid subscription][subscribe_events].
However, we could also wait a few seconds and then query the worker directly against the JobRouter API to see if an offer was issued to it.

```csharp
await Task.Delay(TimeSpan.FromSeconds(2));
var result = await routerClient.GetWorkerAsync(worker.Value.Id);
foreach (var offer in result.Value.Offers)
{
    Console.WriteLine($"Worker {worker.Value.Id} has an active offer for job {offer.JobId}");
}
```

Run the application using `dotnet run` and observe the results.

```console
dotnet run


Worker worker-1 has an active offer for job 6b83c5ad-5a92-4aa8-b986-3989c791be91
```

> [!NOTE]
> Running the application more than once will cause a new Job to be placed in the queue each time. This can cause the Worker to be offered a Job other than the one created when you run the above code. Since this can skew your request, considering removing Jobs in the queue each time. Refer to the SDK documentation for managing a Queue or a Job.

<!-- LINKS -->
[subscribe_events]: ../../how-tos/router-sdk/subscribe-events.md
[worker_registered_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerregistered
[job_classified_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterjobclassified
[offer_issued_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued
[offer_accepted_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferaccepted

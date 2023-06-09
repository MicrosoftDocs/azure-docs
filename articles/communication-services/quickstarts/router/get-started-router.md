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

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

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

## Authenticate the Job Router client and administration client

Job Router clients can be authenticated using your connection string acquired from an Azure Communication Services resource in the Azure portal.  We will generate both a client and an administration client to interact with the Job Router service.  The admin client will be used to provision queues and policies, while the client will be used to submit jobs and register workers.

```csharp
// Get a connection string to our Azure Communication Services resource.
var connectionString = "your_connection_string";
var routerAdminClient = new RouterAdministrationClient(connectionString);
var routerClient = new RouterClient(connectionString);
```

## Create a distribution policy

Job Router uses a distribution policy to decide how Workers will be notified of available Jobs and the time to live for the notifications, known as **Offers**. Create the policy by specifying the **ID**, a **name**, an **offerTTL**, and a distribution **mode**.

```csharp
var distributionPolicy = await routerAdministrationClient.CreateDistributionPolicyAsync(
    new CreateDistributionPolicyOptions(
        distributionPolicyId: "distribution-policy-1",
        offerTtl: TimeSpan.FromMinutes(1),
        mode: new LongestIdleMode())
    {
        Name = "My distribution policy"
    }
);
```

## Create a queue

Create the Queue by specifying an **ID**, **name**, and provide the **Distribution Policy** object's ID you created above.

```csharp
var queue = await routerAdminClient.CreateQueueAsync(
    new CreateQueueOptions(queueId: "queue-1", distributionPolicyId: distributionPolicy.Value.Id)
    {
        Name = "My Queue" 
    });
```

## Submit a job

Now, we can submit a job directly to that queue, with a worker selector that requires the worker to have the label `Some-Skill` greater than 10.

```csharp
var job = await routerClient.CreateJobAsync(
    new CreateJobOptions(jobId: "job-1", channelId: "voice", queueId: queue.Value.Id)
    {
        priority: 1,
        requestedWorkerSelectors: new List<WorkerSelector>
        {
            new (key: "Some-Skill", labelOperator: LabelOperator.GreaterThan, value: new LabelValue(10))
        }
    });
```

## Create a worker

Now, we create a worker to receive work from that queue, with a label of `Some-Skill` equal to 11 and capacity on `my-channel`.

```csharp
var worker = await client.CreateWorkerAsync(
    new CreateWorkerOptions(workerId: "worker-1", totalCapacity: 1)
    {
        QueueIds = new Dictionary<string, QueueAssignment>
        {
            [queue.Value.Id] = new()
        },
        Labels = new Dictionary<string, LabelValue>
        {
            ["Some-Skill"] = new(11)
        },
        ChannelConfigurations = new Dictionary<string, ChannelConfiguration>
        {
            ["voice"] = new (capacityCostPerJob: 1)
        }
    });
```

### Offer

We should get a [RouterWorkerOfferIssued][offer_issued_event] from our [Event Grid subscription][subscribe_events].
However, we could also wait a few seconds and then query the worker directly against the JobRouter API to see if an offer was issued to it.

```csharp
await Task.Delay(TimeSpan.FromSeconds(3));
worker = await routerClient.GetWorkerAsync(worker.Value.Id);
foreach (var offer in worker.Value.Offers)
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

## Accept the job offer

Then, the worker can accept the job offer by using the SDK, which will assign the job to the worker.

```csharp
var accept = await routerClient.AcceptJobOfferAsync(worker.Value.Id, worker.Value.Offers.FirstOrDefault().OfferId);
```

## Complete the job

Once the worker has completed the work associated with the job (e.g. completed the call).

```csharp
var complete = await routerClient.CompleteJobAsync(new CompleteJobOptions("job-1", accept.Value.AssignmentId));
```

## Close the job

Once the worker is ready to take on new jobs, the worker should close the job.  Optionally, the worker can provide a disposition code to indicate the outcome of the job.

```csharp
var close = await routerClient.CloseJobAsync(new CloseJobOptions("job-1", accept.Value.AssignmentId) {
    DispositionCode = "Resolved"
});
```

<!-- LINKS -->
[subscribe_events]: ../../how-tos/router-sdk/subscribe-events.md
[worker_registered_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerregistered
[job_classified_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterjobclassified
[offer_issued_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued
[offer_accepted_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferaccepted

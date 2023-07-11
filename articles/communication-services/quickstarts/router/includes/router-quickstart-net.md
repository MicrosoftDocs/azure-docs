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

Install the Azure Communication Job Router client library for .NET with [NuGet](https://www.nuget.org/):

```console
dotnet add package Azure.Communication.JobRouter
```

You'll need to use the Azure Communication Job Router client library for .NET [version 1.0.0-beta.2](https://www.nuget.org/packages/Azure.Communication.JobRouter/1.0.0-beta.2) or above.

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

## Initialize the Job Router client and administration client

Job Router clients can be authenticated using your connection string acquired from an Azure Communication Services resource in the Azure portal.  We will generate both a client and an administration client to interact with the Job Router service.  The admin client will be used to provision queues and policies, while the client will be used to submit jobs and register workers.  For more information on connection strings, see [access-your-connection-strings-and-service-endpoints](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```csharp
// Get a connection string to our Azure Communication Services resource.
var connectionString = "your_connection_string";
var routerAdminClient = new JobRouterAdministrationClient(connectionString);
var routerClient = new JobRouterClient(connectionString);
```

## Create a distribution policy

Job Router uses a distribution policy to decide how Workers will be notified of available Jobs and the time to live for the notifications, known as **Offers**. Create the policy by specifying the **ID**, a **name**, an **offerTTL**, and a distribution **mode**.

```csharp
var distributionPolicy = await routerAdminClient.CreateDistributionPolicyAsync(
    new CreateDistributionPolicyOptions(
        distributionPolicyId: "distribution-policy-1",
        offerExpiresAfter: TimeSpan.FromMinutes(1),
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
        Priority = 1,
        RequestedWorkerSelectors =
        {
            new WorkerSelector(key: "Some-Skill", labelOperator: LabelOperator.GreaterThan, value: new LabelValue(10))
        }
    });
```

## Create a worker

Now, we create a worker to receive work from that queue, with a label of `Some-Skill` equal to 11 and capacity on `my-channel`.

```csharp
var worker = await client.CreateWorkerAsync(
    new CreateWorkerOptions(workerId: "worker-1", totalCapacity: 1)
    {
        QueueIds =
        {
            [queue.Value.Id] = new RouterQueueAssignment()
        },
        Labels =
        {
            ["Some-Skill"] = new LabelValue(11)
        },
        ChannelConfigurations =
        {
            ["voice"] = new ChannelConfiguration(capacityCostPerJob: 1)
        }
    });
```

## Receive an offer

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

## Accept the job offer

Then, the worker can accept the job offer by using the SDK, which will assign the job to the worker.

```csharp
var accept = await routerClient.AcceptJobOfferAsync(worker.Value.Id, worker.Value.Offers.FirstOrDefault().OfferId);
Console.WriteLine($"Worker {worker.Value.Id} is assigned job {offer.JobId}");
```

## Complete the job

Once the worker has completed the work associated with the job (e.g. completed the call).

```csharp
await routerClient.CompleteJobAsync(new CompleteJobOptions("job-1", accept.Value.AssignmentId));
Console.WriteLine($"Worker {worker.Value.Id} has completed job {offer.JobId}");
```

## Close the job

Once the worker is ready to take on new jobs, the worker should close the job.  Optionally, the worker can provide a disposition code to indicate the outcome of the job.

```csharp
await routerClient.CloseJobAsync(new CloseJobOptions("job-1", accept.Value.AssignmentId) {
    DispositionCode = "Resolved"
});
Console.WriteLine($"Worker {worker.Value.Id} has closed job {offer.JobId}");
```

## Run the code

Run the application using `dotnet run` and observe the results.

```console
dotnet run

Worker worker-1 has an active offer for job 6b83c5ad-5a92-4aa8-b986-3989c791be91
Worker worker-1 is assigned job 6b83c5ad-5a92-4aa8-b986-3989c791be91
Worker worker-1 has completed job 6b83c5ad-5a92-4aa8-b986-3989c791be91
Worker worker-1 has closed job 6b83c5ad-5a92-4aa8-b986-3989c791be91
```

> [!NOTE]
> Running the application more than once will cause a new Job to be placed in the queue each time. This can cause the Worker to be offered a Job other than the one created when you run the above code. Since this can skew your request, considering deleting Jobs in the queue each time. Refer to the SDK documentation for managing a Queue or a Job.

## Reference documentation

Read about the full set of capabilities of Azure Communication Services Job Router from the [.NET SDK reference](/dotnet/api/overview/azure/communication.jobrouter-readme) or [REST API reference](/rest/api/communication/jobrouter).

<!-- LINKS -->

[subscribe_events]: ../../../how-tos/router-sdk/subscribe-events.md
[offer_issued_event]: ../../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued

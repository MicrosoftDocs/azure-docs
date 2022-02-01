---
title: Job Router overview for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Job Router.
author: jasonshave
manager: phans
services: azure-communication-services

ms.author: jassha
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Job Router key concepts

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

Azure Communication Services Job Router solves the problem of matching supply with demand.

A real-world example of this may be call center agents (supply) being matched to incoming support calls (demand).

## Job

A Job represents a unit of work (demand), which needs to be routed to an available Worker (supply).

A real-world example of this may be an incoming call or chat in the context of a call center.

### Job submission flow

1. Your application submits a Job via the Job Router SDK.
2. The Job is classified and a [JobClassified Event][job_classified_event] is sent via EventGrid, which includes all the information about the Job and how the classification process may have modified its properties.
 
    :::image type="content" source="../media/router/acs-router-job-submission.png" alt-text="Diagram showing Communication Services' Job Router submitting a job.":::

## Worker

A Worker represents the supply available to handle a Job. Each worker registers with one or more queues to receive jobs.

A real-world example of this may be an agent working in a call center.

### Worker registration flow

1. When your Worker is ready to take on work, you can register the worker via the Job Router SDK.
2. Job Router then sends a [WorkerRegistered Event][worker_registered_event]

    :::image type="content" source="../media/router/acs-router-worker-registration.png" alt-text="Diagram showing Communication Services' Job Router worker registration.":::

## Queue

A Queue represents an ordered list of jobs waiting to be served by a worker.  Workers will register with a queue to receive work from it.

A real-world example of this may be a call queue in a call center.

## Channel

A Channel represents a grouping of jobs by some type.  When a worker registers to receive work, they must also specify for which channels they can handle work, and how much of each can they handle concurrently.  Channels are just a string discriminator and aren't explicitly created.

A real-world example of this may be `voice calls` or `chats` in a call center.

## Offer

An Offer is extended by JobRouter to a worker to handle a particular job when it determines a match.  When this happens, you'll be notified via [EventGrid][subscribe_events].  You can either accept or decline the offer using the JobRouter SDK, or it will expire according to the time to live configured on the Distribution Policy.

A real-world example of this may be the ringing of an agent in a call center.

### Offer flow

1. When Job Router finds a matching Worker for a Job, it offers the work by sending a [OfferIssued Event][offer_issued_event] via EventGrid.
2. The Offer is accepted via the Job Router API.
3. Job Router sends a [OfferAccepted Event][offer_accepted_event] signifying to the Contoso Application the Worker is assigned to the Job.

    :::image type="content" source="../media/router/acs-router-accept-offer.png" alt-text="Diagram showing Communication Services' Job Router accept offer.":::

## Distribution Policy

A Distribution Policy represents a configuration set that controls how jobs in a queue are distributed to workers registered with that queue.
This configuration includes:

- How long an Offer is valid before it expires.
- The distribution mode, which define the order in which workers are picked when there are multiple available.
- How many concurrent offers can there be for a given job.

### Distribution modes

The 3 types of modes are

- **Round Robin**: Workers are ordered by `Id` and the next worker after the previous one that got an offer is picked.
- **Longest Idle**: The worker that has not been working on a job for the longest.
- **Best Worker**: The workers that are best able to handle the job will be picked first.  The logic to determine this can be optionally customized by specifying an expression or azure function to compare 2 workers and determine which one to pick.

## Labels

You can attach labels to workers, jobs, and queues.  These are key value pairs that can be of `string`, `number` or `boolean` data types.

A real-world example of this may be the skill level of a particular worker or the team or geographic location.

## Label selectors

Label selectors can be attached to a job in order to target a subset of workers serving the queue.

A real-world example of this may be a condition on an incoming call that the agent must have a minimum level of knowledge of a particular product.

## Classification policy

A classification policy can be used to dynamically select a queue, determine job priority and attach worker label selectors to a job by leveraging a rules engine.

## Exception policy

An exception policy controls the behavior of a Job based on a trigger and executes a desired action. The exception policy is attached to a Queue so it can control the behavior of Jobs in the Queue.

## Next steps

- [How jobs are matched to workers](matching-concepts.md)
- [Router Rule concepts](router-rule-concepts.md)
- [Classification concepts](classification-concepts.md)
- [Exception Policies](exception-policy.md)
- [Quickstart guide](../../quickstarts/router/get-started-router.md)
- [Manage queues](../../how-tos/router-sdk/manage-queue.md)
- [Classifying a Job](../../how-tos/router-sdk/job-classification.md)
- [Escalate a Job](../../how-tos/router-sdk/escalate-job.md)
- [Subscribe to events](../../how-tos/router-sdk/subscribe-events.md)

<!-- LINKS -->
[azure_sub]: https://azure.microsoft.com/free/dotnet/
[cla]: https://cla.microsoft.com
[nuget]: https://www.nuget.org/
[netstandars2mappings]:https://github.com/dotnet/standard/blob/master/docs/versions.md
[useraccesstokens]:https://docs.microsoft.com/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-csharp
[communication_resource_docs]: https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp
[communication_resource_create_portal]:  https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp
[communication_resource_create_power_shell]: https://docs.microsoft.com/powershell/module/az.communication/new-azcommunicationservice
[communication_resource_create_net]: https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-net

[subscribe_events]: ../../how-tos/router-sdk/subscribe-events.md
[worker_registered_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerregistered
[job_classified_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterjobclassified
[offer_issued_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued
[offer_accepted_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferaccepted

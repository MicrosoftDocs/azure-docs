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

A real-world example of this is matching call center agents (supply) to incoming support calls (demand).

## Job

A Job is a unit of work (demand), which must be routed to an available Worker (supply).

A real-world example is an incoming call or chat in the context of a call center.

### Job lifecycle

1. Your application submits a Job via the Job Router SDK.
1. (Optional) If you specified a [Classification Policy](#classification-policy), the Job is classified and a [JobClassified Event][job_classified_event] is sent via Event Grid.
1. The Job is added to the queue that you specified or that was determined by the Classification Policy, and a [JobQueued Event][job_queued_event] is sent via Event Grid.
1. Job Router searches for matching workers based upon any [Label selectors](#label-selectors) and the [Distribution Policy](#distribution-policy) if the queue.
1. When a matching Worker is found, an [Offer](#offer) is issued and an [OfferIssued Event][offer_issued_event] is sent.
1. Your application can accept the [Offer](#offer) via the SDK and the Job will be removed from the queue and an [OfferAccepted Event][offer_accepted_event] will be sent that contains an `assignmentId`.
1. Once the Worker has completed the Job, the SDK can be used to complete and close it, using the `assignmentId`. This will free the Worker up to take on the next Job.

:::image type="content" source="./media/job-lifecycle.svg" alt-text="Diagram that shows the Job lifecycle.":::

## Worker

A Worker is the supply available to handle a Job. When you use the SDK to register a Worker to receive jobs, you can specify:

- One or more queues to listen on.
- The number of concurrent jobs per [Channel](#channel) that the Worker can handle.
- A set of [Labels](#labels) that can be used to group and [select](#label-selectors) workers.

A real-world example is an agent in a call center.

## Queue

A Queue is an ordered list of jobs, that are waiting to be served to a worker. Workers register with a queue to receive work from it.

A real-world example is a call queue in a call center.

## Channel

A Channel is a grouping of jobs by some type. When a worker registers to receive work, they must also specify for which channels they can handle work, and how much of each can they handle concurrently. Channels are just a string discriminator and aren't explicitly created.

Real-world examples are `voice calls` or `chats` in a call center.

## Offer

An Offer is extended by Job Router to a worker to handle a particular job when it determines a match. You can either accept or decline the offer with the JobRouter SDK. If you ignore the offer, it expires according to the time to live configured on the Distribution Policy.

A real-world example is the ringing of an agent in a call center.

### Offer acceptance flow

1. When Job Router finds a matching Worker for a Job, it creates an Offer and sends an [OfferIssued Event][offer_issued_event] via [Event Grid][subscribe_events].
1. The Offer is accepted via the Job Router API.
1. The job is removed from the queue and assigned to the worker.
1. Job Router sends an [OfferAccepted Event][offer_accepted_event].
1. Any existing offers to other workers for this same job will be revoked and an [OfferRevoked Event][offer_revoked_event] will be sent.

### Offer decline flow

1. When Job Router finds a matching Worker for a Job, it creates an Offer and sends an [OfferIssued Event][offer_issued_event] via [Event Grid][subscribe_events].
1. The Offer is declined via the Job Router API.
1. The Offer is removed from the worker, opening up capacity for another Offer for a different job.
1. Job Router sends an [OfferDeclined Event][offer_declined_event].
1. Job Router won't reoffer the declined Offer to the worker unless they deregister and re-register.

### Offer expiry flow

1. When Job Router finds a matching Worker for a Job, it creates an Offer and sends an [OfferIssued Event][offer_issued_event] via [Event Grid][subscribe_events].
1. The Offer is not accepted or declined within the TTL period defined by the Distribution Policy.
1. Job Router will expire the Offer and an [OfferExpired Event][offer_expired_event] will be sent.
1. The worker is considered unavailable and will be automatically deregistered.
1. A [WorkerDeregistered Event][worker_deregistered_event] will be sent.

## Distribution Policy

A Distribution Policy is a configuration set that controls how jobs in a queue are distributed to workers registered with that queue.
This configuration includes:

- How long an Offer is valid before it expires.
- The distribution mode, which define the order in which workers are picked when there are multiple available.
- How many concurrent offers can there be for a given job.

### Distribution modes

The three types of modes are

- **Round Robin**: Workers are ordered by `Id` and the next worker after the previous one that got an offer is picked.
- **Longest Idle**: The worker that has not been working on a job for the longest.
- **Best Worker**: The workers that are best able to handle the job are picked first.  The logic to rank Workers can be customized, with an expression or Azure function to compare two workers. [See example][worker-scoring]

## Labels

You can attach labels to workers, jobs, and queues.  Labels are key value pairs that can be of `string`, `number`, or `boolean` data types.

A real-world example is the skill level of a particular worker or the team or geographic location.

## Label selectors

Label selectors can be attached to a job in order to target a subset of workers on the queue.

A real-world example is a condition on an incoming call that the agent must have a minimum level of knowledge of a particular product.

## Classification policy

A classification policy can be used to programmatically select a queue, determine job priority, or attach worker label selectors to a job.

## Exception policy

An exception policy controls the behavior of a Job based on a trigger and executes a desired action. The exception policy is attached to a Queue so it can control the behavior of Jobs in the Queue.

## Next steps

- [How jobs are matched to workers](matching-concepts.md)
- [Router Rule concepts](router-rule-concepts.md)
- [Classification concepts](classification-concepts.md)
- [Distribution modes](distribution-concepts.md)
- [Exception Policies](exception-policy.md)
- [Quickstart guide](../../quickstarts/router/get-started-router.md)
- [Manage queues](../../how-tos/router-sdk/manage-queue.md)
- [How to classify a Job](../../how-tos/router-sdk/job-classification.md)
- [Target a preferred worker](../../how-tos/router-sdk/preferred-worker.md)
- [Escalate a Job](../../how-tos/router-sdk/escalate-job.md)
- [Subscribe to events](../../how-tos/router-sdk/subscribe-events.md)

<!-- LINKS -->
[azure_sub]: https://azure.microsoft.com/free/dotnet/
[cla]: https://cla.microsoft.com
[nuget]: https://www.nuget.org/
[netstandars2mappings]: https://github.com/dotnet/standard/blob/master/docs/versions.md
[useraccesstokens]: ../../quickstarts/access-tokens.md?pivots=programming-language-csharp
[communication_resource_docs]: ../../quickstarts/create-communication-resource.md?pivots=platform-azp&tabs=windows
[communication_resource_create_portal]:  ../../quickstarts/create-communication-resource.md?pivots=platform-azp&tabs=windows
[communication_resource_create_power_shell]: /powershell/module/az.communication/new-azcommunicationservice
[communication_resource_create_net]: ../../quickstarts/create-communication-resource.md?pivots=platform-net&tabs=windows

[subscribe_events]: ../../how-tos/router-sdk/subscribe-events.md
[worker_registered_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerregistered
[worker_deregistered_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerderegistered
[job_classified_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterjobclassified
[job_queued_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterjobqueued
[offer_issued_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued
[offer_accepted_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferaccepted
[offer_declined_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferdeclined
[offer_expired_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferexpired
[offer_revoked_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferrevoked
[worker-scoring]: ../../how-tos/router-sdk/customize-worker-scoring.md
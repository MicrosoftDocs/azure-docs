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

# Job Router overview

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

Azure Communication Services Job Router is a robust tool designed to optimize the management of customer interactions across various communication applications. Accessible via a suite of SDKs and APIs, Job Router directs each customer interaction, or "job," to the most suitable agent or automated service, or "worker," based on a mix of pre-defined and runtime rules and policies. This ensures a timely and effective response to every customer's needs, leading to improved customer satisfaction, increased productivity, and more efficient use of resources.

At its core, Job Router operates on a set of key concepts that together create a seamless and efficient communication management system. These include Job, Worker, Queue, Channel, Offer, and Distribution Policy. Whether it's managing high volumes of customer interactions in a contact center, routing customer queries to the right department in a large organization, or efficiently handling customer service requests in a retail business, Job Router can do it all. It ensures that every customer interaction is handled by the most suitable agent or automated service, leading to business efficiency.

:::image type="content" source="./media/acs-router-architecture-diagram-1.png" alt-text="Diagram that shows the Job Router Architecture." lightbox="./media/acs-router-architecture-diagram.png":::

Job Router is agnostic to any Azure Communication Services channel primitive helping developers to build a comprehensive omnichannel communication solution. With Job Router, businesses can ensure that every customer interaction is handled efficiently, at the right time and in the right channel.

## Key Concepts

### Job

A Job is a unit of work (demand), which must be routed to an available Worker (supply).
An actual instance would be an incoming call or chat in the context of a call center, customer engagement or customer support.

#### Job lifecycle

1. Your application submits a Job via the Job Router SDK.
1. (Optional) If you specified a [Classification Policy](#classification-policy), the Job is classified and a [JobClassified Event][job_classified_event] is sent via Event Grid.
1. The Job is added to the queue that you specified or that was determined by the Classification Policy, and a [JobQueued Event][job_queued_event] is sent via Event Grid.
1. Job Router searches for matching workers based upon any [Label selectors](#label-selectors) and the [Distribution Policy](#distribution-policy) if the queue.
1. When a matching Worker is found, an [Offer](#offer) is issued and an [OfferIssued Event][offer_issued_event] is sent.
1. Your application can accept the [Offer](#offer) via the SDK and the Job will be removed from the queue and an [OfferAccepted Event][offer_accepted_event] will be sent that contains an `assignmentId`.
1. Once the Worker has completed the Job, the SDK can be used to complete and close it, using the `assignmentId`. This will free the Worker up to take on the next Job.

:::image type="content" source="./media/acs-router-job-lifecycle.png" alt-text="Diagram that shows the Job lifecycle."  lightbox="./media/acs-router-job-lifecycle.png":::

### Worker

A Worker is the supply available to handle a Job. When you use the SDK to register a Worker to receive jobs, you can specify:

- One or more queues to listen on.
- The number of concurrent jobs per [Channel](#channel) that the Worker can handle.
- A set of [Labels](#labels) that can be used to group and [select](#label-selectors) workers.

A concrete example of a worker would be a human agent in a customer interaction or contact center scenario.

### Queue

A Queue is an ordered list of jobs, that are waiting to be served to a worker. Workers register with a queue to receive work from it.

To illustrate the concept of a queue let's use a contact center scenario, imagine a situation where multiple callers are placed on hold until a representative, with the right skills, becomes available to handle their calls.

### Channel

A Channel is a grouping of jobs by some type. When a worker registers to receive work, they must also specify for which channels they can handle work, and how much of each can they handle concurrently. Channels are just a string discriminator and aren't explicitly created. A channel could be `voice calls` or `chats`.

By assigning jobs to different channels, it becomes possible to streamline workflows and allocate resources efficiently based on the specific needs or requirements associated with each channel. 

### Offer

An Offer is extended by Job Router to a worker to handle a particular job when it determines a match. You can either accept or decline the offer with the JobRouter SDK. If you ignore the offer, it expires according to the time to live configured on the Distribution Policy.

The ringing serves as a tangible example of an offer extended to a worker, and it's an indicator that an interaction is about to take place, signaling the agent to answer the call promptly and engage in a conversation with the customer.

#### Offer acceptance flow

1. When Job Router finds a matching Worker for a Job, it creates an Offer and sends an [OfferIssued Event][offer_issued_event] via [Event Grid][subscribe_events].
1. The Offer is accepted via the Job Router API.
1. The job is removed from the queue and assigned to the worker.
1. Job Router sends an [OfferAccepted Event][offer_accepted_event].
1. Any existing offers to other workers for this same job will be revoked and an [OfferRevoked Event][offer_revoked_event] will be sent.

#### Offer decline flow

1. When Job Router finds a matching Worker for a Job, it creates an Offer and sends an [OfferIssued Event][offer_issued_event] via [Event Grid][subscribe_events].
1. The Offer is declined via the Job Router API.
1. The Offer is removed from the worker, opening up capacity for another Offer for a different job.
1. Job Router sends an [OfferDeclined Event][offer_declined_event].
1. Job Router won't reoffer the declined Offer to the worker unless they deregister and re-register.

#### Offer expiry flow

1. When Job Router finds a matching Worker for a Job, it creates an Offer and sends an [OfferIssued Event][offer_issued_event] via [Event Grid][subscribe_events].
1. The Offer is not accepted or declined within the ExpiresAfter period defined by the Distribution Policy.
1. Job Router will expire the Offer and an [OfferExpired Event][offer_expired_event] will be sent.
1. The worker is considered unavailable and will be automatically deregistered.
1. A [WorkerDeregistered Event][worker_deregistered_event] will be sent.

### Distribution Policy

A Distribution Policy is a configuration set that controls how jobs in a queue are distributed to workers registered with that queue.
This configuration includes:

- How long an Offer is valid before it expires.
- The distribution mode, which define the order in which workers are picked when there are multiple available.
- How many concurrent offers can there be for a given job.

#### Distribution modes

The three types of modes are

- **Round Robin**: Workers are ordered by `Id` and the next worker after the previous one that got an offer is picked.
- **Longest Idle**: The worker that has not been working on a job for the longest.
- **Best Worker**: The workers that are best able to handle the job are picked first.  The logic to rank Workers can be customized, with an expression or Azure function to compare two workers. [See example][worker-scoring]

### Labels

You can attach labels to workers, jobs, and queues.  Labels are key value pairs that can be of `string`, `number`, or `boolean` data types.

A real-world example is the skill level of a particular worker or the team or geographic location.

### Label selectors

Label selectors can be attached to a job in order to target a subset of workers on the queue.

As an example, in the context of a chat channel, consider a real-world scenario where an incoming chat message is subjected to a condition. This condition specifies that the assigned agent must have a minimum level of expertise or knowledge concerning a particular product. This example highlights how label selectors, similar to filters, can be employed to target a subset of agents within the chat channel who possess the required proficiency in the designated product.

### Classification policy

A classification policy can be used to programmatically select a queue, determine job priority, or attach worker label selectors to a job.

### Exception policy

An exception policy controls the behavior of a Job based on a trigger and executes a desired action. The exception policy is attached to a Queue so it can control the behavior of Jobs in the Queue.

### Next steps

> [!div class="nextstepaction"]
> [Get started with Job Router](../../quickstarts/router/get-started-router.md)

#### Learn more about these key Job Router concepts

- [How jobs are matched to workers](matching-concepts.md)
- [How worker capacity is configured](worker-capacity-concepts.md)
- [Router Rule concepts](router-rule-concepts.md)
- [Classification concepts](classification-concepts.md)
- [Distribution modes](distribution-concepts.md)
- [Exception Policies](exception-policy.md)

#### Check out our How To Guides

- [Manage queues](../../how-tos/router-sdk/manage-queue.md)
- [How to classify a Job](../../how-tos/router-sdk/job-classification.md)
- [Target a preferred worker](../../how-tos/router-sdk/preferred-worker.md)
- [Escalate a Job](../../how-tos/router-sdk/escalate-job.md)
- [Accept or decline a Job](../../how-tos/router-sdk/accept-decline-offer.md)
- [Subscribe to events](../../how-tos/router-sdk/subscribe-events.md)
- [Scheduling a job](../../how-tos/router-sdk/scheduled-jobs.md)
- [How to get estimated wait time and job position](../../how-tos/router-sdk/estimated-wait-time.md)
- [Customize workers scoring](../../how-tos/router-sdk/customize-worker-scoring.md)
- [Use Azure Function rule engine](../../how-tos/router-sdk/azure-function.md)

<!-- LINKS -->

[subscribe_events]: ../../how-tos/router-sdk/subscribe-events.md
[worker_deregistered_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerderegistered
[job_classified_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterjobclassified
[job_queued_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterjobqueued
[offer_issued_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued
[offer_accepted_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferaccepted
[offer_declined_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferdeclined
[offer_expired_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferexpired
[offer_revoked_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferrevoked
[worker-scoring]: ../../how-tos/router-sdk/customize-worker-scoring.md

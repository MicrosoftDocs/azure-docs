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

# Job Router concepts

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

Azure Communication Services Job Router solves the problem of matching some abstract supply with some abstract demand on a system. Integrated with Azure Event Grid, Job Router delivers near real-time notifications to you, enabling you to build reactive applications to control the behavior of your Job Router instance.

## Job Router overview

The Job Router SDKs can be used to build various business scenarios where you have the need to match a unit of work to a particular resource. For example, the work could be defined as a series of phone calls with many potential contact center agents, or a web chat request with a live agent handling multiple concurrent sessions with other people. The need to route some abstract unit of work to an available resource requires you to define the work, known as a [Job](#job), a [Queue](#queue), the [Worker](#worker), and a set of [Policies](#policies), which define the behavioral aspects of how these components interact with each other.

## Job Router architecture

Azure Communication Services Job Router uses events to notify your applications about actions within the service. The following diagrams illustrate a simplified flow common to Job Router; submitting a Job, registering a Worker, handling the Job Offer.

### Job submission flow

1. The Contoso application submits a Job to the Job Router in the Azure Communication Services instance.
2. The Job is classified and an event is raised called **RouterJobClassified** which includes all the information about the Job and how the classification process may have modified its properties.
 
    :::image type="content" source="../media/router/acs-router-job-submission.png" alt-text="Diagram showing Communication Services' Job Router submitting a job.":::

### Worker registration flow

1. When a Worker is ready to accept a Job, they register with the Job Router via Contoso's Application.
2. Job Router then sends back a **RouterWorkerRegistered**

    :::image type="content" source="../media/router/acs-router-worker-registration.png" alt-text="Diagram showing Communication Services' Job Router worker registration.":::

### Matching and accepting a job flow

1. When Job Router finds a matching Worker for a Job, it offers the work by sending a **RouterWorkerOfferIssued** which the Contoso Application would receive and send a signal to the connected user using a platform such as the Azure SignalR Service.
2. The Worker accepts the Offer.
3. Job Router sends an **RouterWorkerOfferAccepted** signifying to the Contoso Application the Worker is assigned to the Job.

    :::image type="content" source="../media/router/acs-router-accept-offer.png" alt-text="Diagram showing Communication Services' Job Router accept offer.":::

## Real-time notifications

Azure Communication Services relies on Event Grid's messaging platform to send notifications about what actions Job Router is taking on the workload you send. Job Router sends messages in the form of events whenever an important action happens such as Job lifecycle events including job creation, completion, offer acceptance, and many more.

## Job

A Job represents the unit of work, which needs to be routed to an available Worker. Jobs are defined using the Azure Communication Services Job Router SDKs or by submitting an authenticated request to the REST API. Jobs often contain a reference to some unique identifier you may have such as a call ID or a ticket number, along with the characteristics of the work being performed.

## Queue

When a Job is created it is assigned to a Queue, either statically at the time of submission, or dynamically through the application of a classification policy. Jobs are grouped together by their assigned Queue and can take on different characteristics depending on how you intend on distributing the workload. Queues require a **Distribution Policy** to determine how jobs are offered to eligible workers.

Queues in the Job Router can also contain Exception Policies that determine the behavior of Jobs when certain conditions arise. For example, you may want a Job to be moved to a different Queue, the priority increased, or both based on a timer or some other condition.

## Worker

A Worker represents the supply available to handle a Job for a particular Queue. Each Worker registered with the Job Router comes with a set of **Labels**, their associated **Queues**, **channel configurations**, and a **total capacity score**. The Job Router uses these factors to determine when and how to route Jobs to a worker in real time.

Azure Communication Services Job Router maintains and uses the status of a Worker using simple **Active**, **Inactive**, or **Draining** states to determine when available Jobs can be matched to a worker. Together with the status, the channel configuration, and the total capacity score, Job Router calculates viable Workers and issues Offers related to the Job.

## Policies

Azure Communication Services Job Router applies flexible Policies to attach dynamic behavior to various aspects of the system. Depending on the policy, a Job's Labels can be consumed & evaluated to alter a Job's priority, which Queue it should be in, and much more. Certain Policies in the Job Router offer inline function processing using PowerFx, or for more complex scenarios, a callback to an Azure Function.

**Classification policy -** A classification policy helps Job Router define the Queue, the Priority, and can alter the Worker Selectors when the sender is unable or unaware of these parameters at the time of submission. For more information about classification, see the [classification concepts](classification-concepts.md) page.

**Distribution policy -** When the Job Router receives a new Job, the Distribution Policy is used to locate a suitable Worker and manage the Job Offers. Workers are selected using different **modes**, and based on the policy, Job Router can notify one or more Workers concurrently.

**Exception policy -** An exception policy controls the behavior of a Job based on a trigger and executes a desired action. The exception policy is attached to a Queue so it can control the behavior of Jobs in the Queue.

## Next steps

- [Router Rule concepts](router-rule-concepts.md)
- [Classification concepts](classification-concepts.md)
- [Distribution concepts](distribution-concepts.md)
- [Quickstart guide](../../quickstarts/router/get-started-router.md)
- [Manage queues](../../how-tos/router-sdk/manage-queue.md)
- [Classifying a Job](../../how-tos/router-sdk/job-classification.md)
- [Escalate a Job](../../how-tos/router-sdk/escalate-job.md)
- [Subscribe to events](../../how-tos/router-sdk/subscribe-events.md)
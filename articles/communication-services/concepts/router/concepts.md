---	
title: Router overview for Azure Communication Services	
titleSuffix: An Azure Communication Services concept document	
description: Learn about the Azure Communication Services Router.	
author: jasonshave	
manager: phans
services: azure-communication-services

ms.author: jassha
ms.date: 10/18/2021
ms.topic: conceptual
ms.service: azure-communication-services	
---	

# Job Router concepts

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

The Azure Communication Services Job Router, put simply, solves the problem of matching some abstract supply with some abstract demand on a system. Using the power of an event-driven architecture, combined with Azure Communication Services Event Grid messaging, Job Router provides real-time notifications to your custom applications so you can respond and react to key events.

## Job Router overview

The Job Router SDKs can be used to build various business scenarios where the need to match a unit of work to a resource exists. For example, the work could be defined as a series of phone calls with many potential contact center agents, or a web chat request with a live agent handling multiple concurrent sessions with other people. The need to route some abstract unit of work to an available resource requires you to define the work, known as a [Job](#job), a [Queue](#queue), the [Worker](#worker), and a set of [Policies](#policies), which define the behavioral aspects of how these constructs interact with each other. Event Grid notifications provide your application with awareness about the key steps involved in the lifecycle of your Job and how Workers are interacting with the Job Router.

## Job Router architecture

TBD

## Real-time notifications

TBD

## Job

A Job represents the unit of work, which needs to be routed to an available Worker. Jobs are defined using the Azure Communication Services Router SDKs or by submitting an authenticated request to the REST API. Jobs often contain a reference to some unique identifier you may have such as a call ID or a ticket number, along with the characteristics of the work being performed. Each Job you create can be submitted with an explicit definition or you can let the Job Router dynamically define them based on a policy and property bag.

Jobs with static characteristics will typically have a pre-defined **Priority**, **Queue**, and **Worker Requirements** whereas dynamic Jobs will trade these properties for selection of a pre-defined **Classification Policy**. Job Router's extensible policy and rules engine allows customers to control the Job lifecycle, from classification to closure.

## Queue

When a Job is created it is assigned to a Queue, either statically at the time of submission, or dynamically through the application of a policy. Jobs are grouped together by their defined Queue ID and can take on different characteristics depending on how you intend on distributing the workload. Job Router uses a **Distribution Policy** defined on each Queue to determine how workers are selected and offered Jobs at runtime. For example, a policy which generates only one **Job Offer** to a Worker at a time will behave like a First-In/First-Out (FIFO) queue whereas a policy permitting multiple concurrent offers will distribute the work more evenly like a fan-out model.

Queues in the Job Router can also contain Exception Policies which determine the behavior of Jobs when certain conditions arise. For example, you may want a Job to be moved to a different Queue, the priority increased, or both based on a timer or some other condition.

## Worker

A Worker represents the supply available to handle a Job for a particular Queue. Each Worker registered with the Job Router comes with a set of **Labels**, their associated **Queues**, **Socket Configurations**, and a **Total Capacity Score**. The Job Router uses these factors to determine when and how to route Jobs to a worker in real time.

Azure Communication Services Job Router maintains and uses the status of a Worker using simple **Active**, **Inactive**, or **Draining** states to determine when available Jobs can be matched to a worker. A Worker must be registered with the Job Router to receive a Job Offer but can de-register at any time, removing their eligibility for an Offer.

## Policies

Azure Communication Services Router applies flexible Policies to attach dynamic behavior to various aspects of the system. Depending on the policy, a Job's Labels can be consumed & evaluated to alter a Job's priority, which Queue it should be in, and much more. Certain Policies in the Job Router offer inline function processing using PowerFx, or for more complex scenarios, a callback to an Azure Function.

## Next steps

- [Quickstart guide](../../quickstarts/router/get-started-router.md)
- [Manage queues](../../how-tos/router-sdk/manage-queue.md)
- [Job classification](../../how-tos/router-sdk/job-classification.md)
---	
title: Job classification concepts for Azure Communication Services
titleSuffix: An Azure Communication Services concept document	
description: Learn about the Azure Communication Services Job Router.	
author: jasonshave	
manager: phans
services: azure-communication-services

ms.author: jassha
ms.date: 10/18/2021
ms.topic: conceptual
ms.service: azure-communication-services
---	

# Job classification concepts

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

Azure Communication Services Job Router uses a process called **classification** when a Job is submitted. This article describes the different ways a Job can be classified and the effect this process has on it.

## Job classification overview

Job Router uses two primary methods for classifying a Job; static or dynamic. If the calling application has knowledge about the Queue ID, Priority, or Worker Requirements, the Job can be submitted without a Classification Policy; known as **static classification**. If you prefer to let Job Router decide the Queue ID, a Classification Policy can be used to modify the Job's properties; known as **dynamic classification**.

When you submit a Job using the Job Router SDK, the process of classification will result in an event being sent to your Azure Communication Services Event Grid subscription. The events generated as part of the classification lifecycle give insights into what actions the Job Router is taking. For example, a successful classification will produce a **JobClassifiedEvent** and a failure will produce a **JobClassificationFailedEvent**.

The process of classifying a Job involves optionally setting the following properties:

- Queue ID
- Priority
- Worker Requirements

## Static classification lifecycle

Submitting a Job with a pre-defined Queue ID, Priority, and Worker Requirements allows you to get started quickly but may not be a desirable long-term approach. For example, your calling application may not know which Queues have been defined in your Job Router instance. Additionally, a Classification Policy can help with more advanced scenarios such as Job reclassification before Queue assignment or after a certain amount of time spent in a Queue.

Use the static classification method when you know the Job properties during submission. You can also modify an existing Job, specifying a Classification Policy which will result in a reclassification.


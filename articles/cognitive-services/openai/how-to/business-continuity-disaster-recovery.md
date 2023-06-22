---
title: 'Business Continuity and Disaster Recovery (BCDR) with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Considerations for implementing Business Continuity and Disaster Recovery (BCDR) with Azure OpenAI 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: how-to
ms.date: 6/21/2023
author: mrbullwinkle    
ms.author: mbullwin
recommendations: false
keywords: 

---

# Business Continuity and Disaster Recovery (BCDR) considerations with Azure OpenAI Service

Azure OpenAI is available in multiple regions. Since subscription keys are region bound, when a customer acquires a key, they select the region in which their deployments will reside and from then on, all operations stay associated with that Azure server region.  

It's rare, but not impossible, to encounter a network issue that hits an entire region. If your service needs to always be available, then you should design it to either fail-over into another region or split the workload between two or more regions. Both approaches require at least two Azure OpenAI resources in different regions. This article provides general recommendations for how to implement  Business Continuity and Disaster Recovery (BCDR) for your Azure OpenAI applications.

## Best practices

Today customers will call the endpoint provided during deployment for both deployments and inference. These operations are stateless, so no data is lost in the case that a region becomes unavailable.  

If a region is non-operational customers must take steps to ensure service continuity.

## Business continuity

The following set of instructions applies both customers using default endpoints and those using custom endpoints.

### Default endpoint recovery

If you're using a default endpoint, you should configure your client code to monitor errors, and if the errors persist, be prepared to redirect to another region of your choice where you have an Azure OpenAI subscription.

Follow these steps to configure your client to monitor errors:

1. Use the [models page](../concepts/models.md) to identify the list of available regions for Azure OpenAI.

2. Select a primary and one secondary/backup regions from the list.

3. Create Azure OpenAI resources for each region selected.

4. For the primary region and any backup regions your code will need to know:

      a. Base URI for the resource

      b. Regional access key or Azure Active Directory access

5. Configure your code so that you monitor connectivity errors (typically connection timeouts and service unavailability errors).  

      a. Given that networks yield transient errors, for single connectivity issue occurrences, the suggestion is to retry.  

      b. For persistence redirect traffic to the backup resource in the region you've created.

## BCDR requires custom code

The recovery from regional failures for this usage type can be performed instantaneously and at a very low cost. This does however, require custom development of this functionality on the client side of your application.

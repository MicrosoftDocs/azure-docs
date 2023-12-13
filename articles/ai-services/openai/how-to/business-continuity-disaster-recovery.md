---
title: 'Business Continuity and Disaster Recovery (BCDR) with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Considerations for implementing Business Continuity and Disaster Recovery (BCDR) with Azure OpenAI 
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 8/17/2023
author: mrbullwinkle    
ms.author: mbullwin
recommendations: false
keywords: 

---

# Business Continuity and Disaster Recovery (BCDR) considerations with Azure OpenAI Service

Azure OpenAI is available in multiple regions. When you create an Azure OpenAI resource, you specify a region. From then on, your resource and all its operations stay associated with that Azure server region.  

It's rare, but not impossible, to encounter a network issue that hits an entire region. If your service needs to always be available, then you should design it to either failover into another region or split the workload between two or more regions. Both approaches require at least two Azure OpenAI resources in different regions. This article provides general recommendations for how to implement Business Continuity and Disaster Recovery (BCDR) for your Azure OpenAI applications.

## BCDR requires custom code

Today customers will call the endpoint provided during deployment for inferencing. Inferencing operations are stateless, so no data is lost if a region becomes unavailable.

If a region is nonoperational customers must take steps to ensure service continuity.

## BCDR for base model & customized model

If you're using the base models, you should configure your client code to monitor errors, and if the errors persist, be prepared to redirect to another region of your choice where you have an Azure OpenAI subscription.

Follow these steps to configure your client to monitor errors:

1. Use the [models](/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability) page to choose the datacenters and regions that are right for you.

2. Select a primary and one (or more) secondary/backup regions from the list.

3. Create Azure OpenAI resources for each region(s) selected.

4. For the primary region and any backup regions your code will need to know:

    - Base URI for the resource
    - Regional access key or Microsoft Entra ID access

5. Configure your code so that you monitor connectivity errors (typically connection timeouts and service unavailability errors).

    - Given that networks yield transient errors, for single connectivity issue occurrences, the suggestion is to retry.
    - For persistent connectivity issues, redirect traffic to the backup resource in the region(s) you've created.

If you have fine-tuned a model in your primary region, you will need to retrain the base model in the secondary region(s) using the same training data. And then follow the above steps.

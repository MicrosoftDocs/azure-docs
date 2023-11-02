---
title: Azure Face service quotas and limits
titleSuffix: Azure AI services
description: Quick reference, detailed description, and best practices on the quotas and limits for the Face service in Azure AI Vision.
author: PatrickFarley
manager: nitinme

ms.service: ai-vision
ms.subservice: azure-ai-face
ms.topic: conceptual
ms.date: 10/24/2023
ms.author: pafarley
---

# Azure Face service quotas and limits

This article contains a quick reference and a detailed description of the quotas and limits for Azure Face in Azure AI Vision.

## Quotas and limits reference

The following table summarizes the default quotas and limits that apply to Azure AI Face Service. 



**Default rate limits**
| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0),</br>Standard (S0),</br>Enterprise (E0) | 10</br>See the [how-to guides](tbd) if you want to increase this limit. |

In free it's 20 per minute.


**Default Face resource quantity limits**

| **Pricing tier** | **Limit value** |
| --- | --- |
|Free (F0)| 1 resource|
| Standard (S0),</br>Enterprise (E0) | <ul><li>5 resource limits in UAE North, Brazil South.</li><li>10 resource limits in other regions.</li><li>See the [how-to guides](tbd) if you want to increase this limit.</li></ul> |

In enterprise it's 15.


**Quota of PersonDirectory**

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0) |<ul><li>1 PersonDirectory</li><li>1,000 persons.</li><li>Each holds up to 248 faces.</li></ul>|
| Standard (S0),</br>Enterprise (E0) | <ul><li>75,000,000 persons.</li><li>Each holds up to 248 faces.</li></ul> |
TBD add note on how it can be changed. "reach out to support if you want to increase this limit"

**Quota of FaceList**

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0),</br>Standard (S0),</br>Enterprise (E0) |<ul><li>64 face lists.</li><li>Each holds up to 1,000 faces.</li></ul>|

**Quota of LargeFaceList**

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0) | <ul><li>64 large face lists.</li><li>Each holds up to 1,000 faces.</li></ul>|
| Standard (S0),</br>Enterprise (E0)  | <ul><li>1,000,000 large face lists.</li><li>Each holds up to 1,000,000 faces.</li></ul> |

**Quota of PersonGroup** 

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0) |<ul><li>1,000 person groups. Each holds up to 1,000 persons.</li><li>Each Person can hold up to 248 faces.</li></ul>|
| Standard (S0),</br>Enterprise (E0)  |<ul><li>1,000,000 person groups. Each holds up to 10,000 persons.</li><li>Each Person can hold up to 248 faces.</li></ul>|

**Quota of LargePersonGroup** 

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0) | <ul><li>1,000 large person groups. Each holds up to 1,000 persons.</li><li>Each Person can hold up to 248 faces.</li></ul> |
| Standard (S0),</br>Enterprise (E0) | <ul><li>1,000,000 large person groups. Each can hold up to 1,000,000 persons.</li><li>Each Person can hold up to 248 faces.</li><li>The total persons in all large person groups shouldn't be larger than 1,000,000,000.</li></ul> |

**[Customer-managed keys (CMK)](/azure/ai-services/computer-vision/identity-encrypt-data-at-rest)**

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0),</br>Standard (S0)  | Not supported |
| Enterprise (E0) | Supported |

## How to request an increase to the default limits 

To increase rate limits and resource limits, you can submit a support request. However, for other quota limits, you need to switch to a higher pricing tier to increase those quotas. 

Please [submit a support request](/azure/ai-services/cognitive-services-support-options?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext) and answer the following questions: 
- The reason for requesting an increase in your current limits. 
- Which of your subscriptions or resources are affected? 
- What limits would you like to increase? (rate limits or resource limits) 
- For rate limits increase: 
    - How much TPS (Transaction per second) would you like to increase? 
    - How often do you experience throttling? 
    - Have you reviewed your call history to better anticipate your future requirements? To view your usage history, see the monitoring metrics on Azure Portal. 
- For resource limits: 
    - How much resources limit do you want to increase? 
    - How many Face resources do you currently have? Have you attempted to integrate your application with fewer Face resources? 

> [!NOTE]
> Due to our Responsible AI principles, your request may be denied, or only a partial increase may be approved if this condition is not met. TBD what condition?

TBD what is "resources limit"
---
title: Azure Face service quotas and limits
titleSuffix: Azure AI services
description: Quick reference, detailed description, and best practices on the quotas and limits for the Face service in Azure AI Vision.
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.topic: conceptual
ms.date: 10/24/2023
ms.author: pafarley
---

# Azure Face service quotas and limits

This article contains a reference and a detailed description of the quotas and limits for Azure Face in Azure AI Vision. The following tables summarize the different types of quotas and limits that apply to Azure AI Face service.

## Extendable limits

**Default rate limits**

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0) | 20 transactions per minute |
| Standard (S0),</br>Enterprise (E0) | 10 transactions per second, and 200 TPS across all resources in a single region.</br>See the next section if you want to increase this limit. |


**Default Face resource quantity limits**

| **Pricing tier** | **Limit value** |
| --- | --- |
|Free (F0)| 1 resource|
| Standard (S0) | <ul><li>5 resources in UAE North, Brazil South, and Qatar.</li><li>10 resources in other regions.</li></ul> |
| Enterprise (E0) | <ul><li>5 resources in UAE North, Brazil South, and Qatar.</li><li>15 resources in other regions.</li></ul> |


### How to request an increase to the default limits 

To increase rate limits and resource limits, you can submit a support request. However, for other quota limits, you need to switch to a higher pricing tier to increase those quotas. 

[Submit a support request](/azure/ai-services/cognitive-services-support-options?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext) and answer the following questions: 
- The reason for requesting an increase in your current limits. 
- Which of your subscriptions or resources are affected? 
- What limits would you like to increase? (rate limits or resource limits) 
- For rate limits increase: 
    - How much TPS (Transaction per second) would you like to increase? 
    - How often do you experience throttling? 
    - Did you review your call history to better anticipate your future requirements? To view your usage history, see the monitoring metrics on Azure portal. 
- For resource limits: 
    - How much resources limit do you want to increase? 
    - How many Face resources do you currently have? Did you attempt to integrate your application with fewer Face resources? 

## Other limits

**Quota of PersonDirectory**

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0) |<ul><li>1 PersonDirectory</li><li>1,000 persons</li><li>Each holds up to 248 faces.</li><li>Unlimited DynamicPersonGroups</li></ul>|
| Standard (S0),</br>Enterprise (E0) | <ul><li>1 PersonDirectory</li><li>75,000,000 persons<ul><li>Contact support if you want to increase this limit.</li></ul></li><li>Each holds up to 248 faces.</li><li>Unlimited DynamicPersonGroups</li></ul> |


**Quota of FaceList**

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0),</br>Standard (S0),</br>Enterprise (E0) |<ul><li>64 FaceLists.</li><li>Each holds up to 1,000 faces.</li></ul>|

**Quota of LargeFaceList**

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0) | <ul><li>64 LargeFaceLists.</li><li>Each holds up to 1,000 faces.</li></ul>|
| Standard (S0),</br>Enterprise (E0)  | <ul><li>1,000,000 LargeFaceLists.</li><li>Each holds up to 1,000,000 faces.</li></ul> |

**Quota of PersonGroup** 

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0) |<ul><li>1,000 PersonGroups. </li><li>Each holds up to 1,000 Persons.</li><li>Each Person can hold up to 248 faces.</li></ul>|
| Standard (S0),</br>Enterprise (E0)  |<ul><li>1,000,000 PersonGroups.</li> <li>Each holds up to 10,000 Persons.</li><li>Each Person can hold up to 248 faces.</li></ul>|

**Quota of LargePersonGroup** 

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0) | <ul><li>1,000 LargePersonGroups</li><li> Each holds up to 1,000 Persons.</li><li>Each Person can hold up to 248 faces.</li></ul> |
| Standard (S0),</br>Enterprise (E0) | <ul><li>1,000,000 LargePersonGroups</li><li> Each holds up to 1,000,000 Persons.</li><li>Each Person can hold up to 248 faces.</li><li>The total Persons in all LargePersonGroups shouldn't exceed 1,000,000,000.</li></ul> |

**[Customer-managed keys (CMK)](/azure/ai-services/computer-vision/identity-encrypt-data-at-rest)**

| **Pricing tier** | **Limit value** |
| --- | --- |
| Free (F0),</br>Standard (S0)  | Not supported |
| Enterprise (E0) | Supported |




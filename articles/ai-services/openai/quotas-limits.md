---
title: Azure OpenAI Service quotas and limits
titleSuffix: Azure AI services
description: Quick reference, detailed description, and best practices on the quotas and limits for the OpenAI service in Azure AI services.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 10/06/2023
ms.author: mbullwin
---

# Azure OpenAI Service quotas and limits

This article contains a quick reference and a detailed description of the quotas and limits for Azure OpenAI in Azure AI services.

## Quotas and limits reference

The following sections provide you with a quick guide to the default quotas and limits that apply to Azure OpenAI:

| Limit Name | Limit Value |
|--|--|
| OpenAI resources per region per Azure subscription | 30 |
| Default DALL-E quota limits | 2 concurrent requests |
| Maximum prompt tokens per request | Varies per model. For more information, see [Azure OpenAI Service models](./concepts/models.md)|
| Max fine-tuned model deployments | 2 |
| Total number of training jobs per resource | 100 |
| Max simultaneous running training jobs per resource | 1 |
| Max training jobs queued | 20 | 
| Max Files per resource | 30 |
| Total size of all files per resource | 1 GB | 
| Max training job time (job will fail if exceeded) | 720 hours |
| Max training job size (tokens in training file) x (# of epochs) | 2 Billion |
| Max size of all files per upload (Azure OpenAI on your data) | 16 MB |

## Regional quota limits

The default quota for models varies by model and region. Default quota limits are subject to change.

<table>  
  <tr>  
    <th>Model</th>  
    <th>Regions</th>  
    <th>Tokens per minute</th>  
  </tr>  
  <tr>  
    <td rowspan="2">gpt-35-turbo</td>  
    <td>East US, South Central US, West Europe, France Central, UK South</td>  
    <td>240 K</td>  
  </tr>  
  <tr>  
    <td>North Central US, Australia East, East US 2, Canada East, Japan East, Sweden Central, Switzerland North</td>  
    <td>300 K</td>  
  </tr>  
  <tr>  
    <td rowspan="2">gpt-35-turbo-16k</td>  
    <td>East US, South Central US, West Europe, France Central, UK South</td>  
    <td>240 K</td>  
  </tr>  
  <tr>  
    <td>North Central US, Australia East, East US 2, Canada East, Japan East, Sweden Central, Switzerland North</td>  
    <td>300 K</td>  
  </tr> 
   <tr>  
    <td>gpt-35-turbo-instruct</td>  
    <td>East US, Sweden Central</td>  
    <td>240 K</td>  
  </tr>  
  <tr>  
    <td rowspan="2">gpt-4</td>  
    <td>East US, South Central US, West Europe, France Central</td>  
    <td>20 K</td>  
  </tr>  
  <tr>  
    <td>North Central US, Australia East, East US 2, Canada East, Japan East, UK South, Sweden Central, Switzerland North</td>  
    <td>40 K</td>  
  </tr>  
  <tr>  
    <td rowspan="2">gpt-4-32k</td>  
    <td>East US, South Central US, West Europe, France Central</td>  
    <td>60 K</td>  
  </tr>  
  <tr>  
    <td>North Central US, Australia East, East US 2, Canada East, Japan East, UK South,  Sweden Central, Switzerland North</td>  
    <td>80 K</td>  
  </tr>  
  <tr>  
    <td rowspan="2">text-embedding-ada-002</td>  
    <td>East US, South Central US, West Europe, France Central</td>  
    <td>240 K</td>  
  </tr>  
  <tr>  
    <td>North Central US, Australia East, East US 2, Canada East, Japan East, UK South, Switzerland North</td>  
    <td>350 K</td>  
  </tr>  
  <tr>  
    <td>all other models</td>  
    <td>East US, South Central US, West Europe, France Central</td>  
    <td>120 K</td>  
  </tr>  
</table>  


### General best practices to remain within rate limits

To minimize issues related to rate limits, it's a good idea to use the following techniques:

- Implement retry logic in your application.
- Avoid sharp changes in the workload. Increase the workload gradually.
- Test different load increase patterns.
- Increase the quota assigned to your deployment. Move quota from another deployment, if necessary.

### How to request increases to the default quotas and limits

Quota increase requests can be submitted from the [Quotas](./how-to/quota.md) page of Azure OpenAI Studio. Please note that due to overwhelming demand, we are not currently approving new quota increase requests. Your request will be queued until it can be filled at a later time.

For other rate limits, please [submit a service request](../cognitive-services-support-options.md?context=/azure/ai-services/openai/context/context).

## Next steps

Explore how to [manage quota](./how-to/quota.md) for your Azure OpenAI deployments.
Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).

---
title: 'Quickstart - Get started using Provisioned Deployments with Azure OpenAI Service'
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started provisioned deployments on Azure OpenAI Service.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.custom: openai
ms.topic: how-to
author: ChrisHMSFT
ms.author: chrhoder
ms.date: 12/15/2023
recommendations: false
---

# Get started using Provisioned Deployments on the Azure OpenAI Service

The following guide walks you through setting up your provisioned deployment on the Azure OpenAI service. 

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to the Azure OpenAI service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- Quota for a provisioned deployment. 
- Purchased commitment for the provisioned deployment

> [!NOTE]
> Provisioned throughput units (PTU) are different from standard quota in Azure OpenAI and are not available by default. To learn more about this offering contact your Microsoft Account Team.


## Deploy your provisioned deployment



## Make your first calls
You can follow the steps outlined in the getting started guide 

```python
    #Note: The openai-python library support for Azure OpenAI is in preview.
    import os
    import openai
    openai.api_type = "azure"
    openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT") 
    openai.api_version = "2023-12-01-preview"
    openai.api_key = os.getenv("AZURE_OPENAI_KEY")

    response = openai.ChatCompletion.create(
        engine="gpt-4", # engine = "deployment_name".
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
            {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
            {"role": "user", "content": "Do other Azure AI services support this too?"}
        ]
    )

    print(response['choices'][0]['message']['content'])

```

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.



## Measuring your deployment utilization
When you deploy a specified number of provisioned throughput units (PTUs), a set amount of inference throughput is made available to that endpoint. Utilization of this throughput is a complex formula based on the model, model-version call rate, prompt size, generation size. To simplify this calculation, we provide a utilization metric in Azure Monitor. The LLM Utilization will be unique to each model+-version pair and cannot be compared across models. Your deployment will start to receive 429 signalserrors when the utilization is above 100%. 

PTU deployment utilization = (PTUs consumed in the time period) / (PTUs deployed in the time period)


## Handling high utilization
Provisioned deployments provide customers with an allocated amount of compute capacity to run a given model. The utilization of the deployment is measured by the ‘Provisioned-Managed Utilization’ metric in Azure Monitor. Provisioned-Managed deployments are also optimized so that calls accepted are processed with a consistent per-call max latency. When the workload exceeds its allocated capacity, the service will return a 429 HTTP status code until the utilization drops down below 100%. The time before retrying is provided in the retry-after and retry-after-ms response headers which provide the time in seconds and milliseconds respectively.  This maintains the per-call latency targets while giving the developer control over how to handle high-load situations – for example retry or divert to another experience/endpoint. 

### What should  I do when I receive a 429 response?
A 429 response indicates that the allocated PTUs are fully consumed at the time of the call. The response includes the `retry-after-ms` and `retry-after` headers which tell you the time to wait before the next call will be accepted. How you choose to handle this depends on your application requirements. Here are some considerations:
-	If you are okay with longer per-call latencies, implement client-side retry logic to wait the retry-after-ms time and retry. This will let you maximize your throughput per PTU.
-	Consider re-directing the traffic to other models, deployments or experiences. This is the lowest-latency solution because this action can be taken as soon as you receive the 429 signal.
The 429 signal is not an unexpected error response when pushing to high utilizaiton but instead part of the design for managing queuing and high load for provisioned deployments. 

Any call accepted, will aim to be served by the model without queueing. When the deployment is fully utilized we will fast-respond with the 429 error response so that the you can make an decision on how to best handle.

### Modifying retry logic within the client libraries
The Azure OpenAI SDKs retry 429 responses by default and will happen without error in the client (upt to the maximum retries). The library will also respect the retry-after time. You can also modify the retry-behavior. Here's an example with the python library. 


You can use the `max_retries` option to configure or disable retry settings:

```python
from openai import OpenAI

# Configure the default for all requests:
client = OpenAI(
    # default is 2
    max_retries=0,
)

# Or, configure per-request:
client.with_options(max_retries=5).chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "How can I get the name of the current day in Node.js?",
        }
    ],
    engine="gpt-4",
)
```



## Run a Benchmark
The exact performance and throughput capabilities of your instance will depend on the kind of requests you make and the exact workload. The best way to determine this is to run a benchmark on your own data. To assist you in this work, we have created a benchmarking tool which will run against a provisioned deployment. The tool comes with several possible pre-configured workload shapes and outputs key performance metrics. 

Learn more about the tool and configuration settings in our GitHub Repo: https://aka.ms/aoai/benchmarking.


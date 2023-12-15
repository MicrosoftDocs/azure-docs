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
- Obtained Quota for a provisioned deployment and purchased a commiment. 

> [!NOTE]
> Provisioned throughput units (PTU) are different from standard quota in Azure OpenAI and are not available by default. To learn more about this offering contact your Microsoft Account Team.


## Deploy your provisioned deployment

After you have purchased a commitment on your quota, you can create a deployment. To create a provisioned deployment, you can follow these steps; the choices described below reflect those shown in the screenshot 

:::image type="content" source="../media/provisioned/deployment-screen.jpg" alt-text="Screenshot of the Azure OpenAI Studio deployment page for a provisioned deployment." lightbox="../media/provisioned/deployment-screen.jpg":::



1.	Sign into the [Azure OpenAI studio](https://oai.azure.com)
2.	Choose the subscription that was enabled for provisioned deployments & select the desired resource in a region where you have the quota.
3.	Under Management in the left-nav select Deployments
4.	Select Create new deployment and configure the following fields. You will need to expand the ‘advanced options’ drop down.
5.	Fill out the values in each field. We have provided an example below:

| Field | Description |	Example |
| -- | -- | --| 
| Select a model|	Choose the specific model you wish to deploy	| GPT-4 |
| Model version |	Version of the model to deploy	 | 0613 |
| Deployment Name	 | The deployment name is used in your code to call the model by using the client libraries and the REST APIs.	| gpt-4|
| Content filter	| Specify the filtering policy to apply to the deployment | 	Default |
| Deployment Type	| Type of deployment you will enable. This impacts the throughput and performance. 	| Provisioned-Managed |
| Provisioned Throughput units |	Amount of throughput to provision |	100 |


If you wish to deploy your endpoint programmatically you can do so with the following Azure CLI command. You will just need to update the sku-capacity with the desired amout of provisioned throughput units.

```cli
az cognitiveservices account deployment create \
--name <myResourceName> \
--resource-group  <myResourceGroupName> \
--deployment-name MyModel \
--model-name GPT-4 \
--model-version "0613"  \
--model-format OpenAI \
--sku-capacity "100" \
--sku-name "Provisioned-Managed" 
```

REST, ARM, Bicep and Terraform can also be used to create deployments.  Use the instructions in the public documentation for Standard deployments and replace the sku.name with “Provisioned-Managed” rather than “Standard”.  See the section on automating deployments in the [Managing Quota](https://learn.microsoft.com/azure/ai-services/openai/how-to/quota?tabs=rest#automate-deployment) how-to guide.

## Make your first calls
The inferencing code for provisioned deployments is the same a standard deployment type. The followign code snippet shows a chat completions call to a GPT-4 model.  If this is your first time using these models programmatically, we recommend starting with our [quickstart start guide](../quickstart.md). 



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


## Understanding expected throughput
The amount of throughput that you can achieve on the endpoint is a factor of the number of PTUs deployed, input size, output size, call rate and cache match rate. The number of concurrent calls and total tokens processed can vary significantly based on these values. The most accurate way to assess this for Provisioned-Managed is as follows:
1.	Use the Capacity calculator for a sizing estimate. You can find the capacity calculator in the Azure OpenAI Studio under the quotas page and Provisioned tab.  
2.	Benchmark the load using real traffic workload. see the [benchmarking](#run-a-benchmark) section below for more guidance.


## Measuring your deployment utilization
When you deploy a specified number of provisioned throughput units (PTUs), a set amount of inference throughput is made available to that endpoint. Utilization of this throughput is a complex formula based on the model, model-version call rate, prompt size, generation size. To simplify this calculation, we provide a utilization metric in Azure Monitor. The LLM Utilization will be unique to each model+-version pair and cannot be compared across models. Your deployment will start to receive 429 signals  when the utilization is above 100%. The Provisioned utilization is defined as follows:

PTU deployment utilization = (PTUs consumed in the time period) / (PTUs deployed in the time period)

You can find the utilization measure in the Azure-Monitor section for your resource. To access the monitoring dashboards sign-in to [https://portal.azure.com](https://portal.azure.com), go to your Azure OpenAI resource and select select the Metrics page from the left nav.  On the metrics page, select the 'Provisioned-managed utilization' measure. If you have more than one deployment in the resource, you should also split the values by each deployment by clicking the 'Apply Splitting' button.

:::image type="content" source="../media/provisioned/azure-monitor-utilization.jpg" alt-text="Screenshot of the provisioned managed utilization on the resource's metrics blade in the Azure portal" lightbox="../media/provisioned/azure-monitor-utilization.jpg":::

See our [Monitoring Azure OpenAI Service](./monitoring.md) page for more details on monitoring your deployment.


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
    engine="gpt-4", # engine = "deployment_name".
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
        {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
        {"role": "user", "content": "Do other Azure AI services support this too?"}
    ]
)
```


## Run a Benchmark
The exact performance and throughput capabilities of your instance will depend on the kind of requests you make and the exact workload. The best way to determine this is to run a benchmark on your own data once you have your provisioned deployment set up. 

To assist you in this work, we have created a benchmarking tool which will run against a provisioned deployment. Learn more about the tool and configuration settings in our GitHub Repo: [https://aka.ms/aoai/benchmarking](https://aka.ms/aoai/benchmarking). The tool comes with several possible pre-configured workload shapes and outputs key performance metrics. 

We recommend the following workflow:
1. Estimate your throughput using the capacity calculator
1. Run a benchmark with this trafic shape for an extended period of time (10+ min) to measure the results in a steady state
1. Measure the utilization, tokens processed and call rate values from Azure Monitor.
1. Run a benchmark with your own traffic shape & workloads. Be sure to implement retry logic using either an Azure Openai client library or custom logic. 



## Next Steps

* For more information on cloud application best practices, check out [Best practices in cloud applications](https://learn.microsoft.com/azure/architecture/best-practices/index-best-practices)
* For more information on provisioned dployments, check out [What is provisioned throughput?](../concepts/provisioned-throughput.md)
* For more information on retry logic within each SDK, check out:
    * Python reference documetnation
    * .NET reference documentation
    * Java reference documentation
    * Javascript reference documetnation
    * GO reference documntation
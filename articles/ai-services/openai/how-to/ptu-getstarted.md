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

The following guide walks you through setting up a provisioned deployment with your Azure OpenAI Service resource. 

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- Obtained Quota for a provisioned deployment and purchased a commitment. 

> [!NOTE]
> Provisioned Throughput Units (PTU) are different from standard quota in Azure OpenAI and are not available by default. To learn more about this offering contact your Microsoft Account Team.


## Create your provisioned deployment

After you purchase a commitment on your quota, you can create a deployment. To create a provisioned deployment, you can follow these steps; the choices described reflect the entries shown in the screenshot. 

:::image type="content" source="../media/provisioned/deployment-screen.jpg" alt-text="Screenshot of the Azure OpenAI Studio deployment page for a provisioned deployment." lightbox="../media/provisioned/deployment-screen.jpg":::



1.	Sign into the [Azure OpenAI Studio](https://oai.azure.com)
2.	Choose the subscription that was enabled for provisioned deployments & select the desired resource in a region where you have the quota.
3.	Under **Management** in the left-nav select **Deployments**.
4.	Select Create new deployment and configure the following fields. Expand the ‘advanced options’ drop-down.
5.	Fill out the values in each field. Here's an example:

| Field | Description |	Example |
|--|--|--| 
| Select a model|	Choose the specific model you wish to deploy.	| GPT-4 |
| Model version |	Choose the version of the model to deploy.	 | 0613 |
| Deployment Name	 | The deployment name is used in your code to call the model by using the client libraries and the REST APIs.	| gpt-4|
| Content filter	| Specify the filtering policy to apply to the deployment. Learn more on our [Content Filtering](../concepts/content-filter.md) how-tow | 	Default |
| Deployment Type	|This impacts the throughput and performance. Choose Provisioned-Managed for your provisioned deployment 	| Provisioned-Managed |
| Provisioned Throughput Units |	Choose the amount of throughput you wish to include in the deployment. |	100 |


If you wish to create your deployment programmatically, you can do so with the following Azure CLI command. Update the `sku-capacity` with the desired number of provisioned throughput units.

```cli
az cognitiveservices account deployment create \
--name <myResourceName> \
--resource-group <myResourceGroupName> \
--deployment-name MyModel \
--model-name GPT-4 \
--model-version 0613  \
--model-format OpenAI \
--sku-capacity 100 \
--sku-name Provisioned-Managed
```

REST, ARM template, Bicep and Terraform can also be used to create deployments. See the section on automating deployments in the [Managing Quota](https://learn.microsoft.com/azure/ai-services/openai/how-to/quota?tabs=rest#automate-deployment) how-to guide and replace the `sku.name` with "Provisioned-Managed" rather than "Standard." 

## Make your first calls
The inferencing code for provisioned deployments is the same a standard deployment type. The following code snippet shows a chat completions call to a GPT-4 model.  For your first time using these models programmatically, we recommend starting with our [quickstart start guide](../quickstart.md). Our recommendation is to use the OpenAI library with version 1.0 or greater since this includes retry logic within the library.


```python
    #Note: The openai-python library support for Azure OpenAI is in preview. 
    import os
    from openai import AzureOpenAI

    client = AzureOpenAI(
        azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
        api_key=os.getenv("AZURE_OPENAI_KEY"),  
        api_version="2023-05-15"
    )

    response = client.chat.completions.create(
        model="gpt-4", # model = "deployment_name".
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
            {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
            {"role": "user", "content": "Do other Azure AI services support this too?"}
        ]
    )

    print(response.choices[0].message.content)
```

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.


## Understanding expected throughput
The amount of throughput that you can achieve on the endpoint is a factor of the number of PTUs deployed, input size, output size and call rate. The number of concurrent calls and total tokens processed can vary based on these values. Our recommended way for determining the throughput for your deployment is as follows:
1.	Use the Capacity calculator for a sizing estimate. You can find the capacity calculator in the Azure OpenAI Studio under the quotas page and Provisioned tab.  
2.	Benchmark the load using real traffic workload. For more information about benchmarking, see the [benchmarking](#run-a-benchmark) section.


## Measuring your deployment utilization
When you deploy a specified number of provisioned throughput units (PTUs), a set amount of inference throughput is made available to that endpoint. Utilization of this throughput is a complex formula based on the model, model-version call rate, prompt size, generation size. To simplify this calculation, we provide a utilization metric in Azure Monitor. Your deployment returns a 429 on any new calls after the utilization rises above 100%. The Provisioned utilization is defined as follows:

PTU deployment utilization = (PTUs consumed in the time period) / (PTUs deployed in the time period)

You can find the utilization measure in the Azure-Monitor section for your resource. To access the monitoring dashboards sign-in to [https://portal.azure.com](https://portal.azure.com), go to your Azure OpenAI resource and select the Metrics page from the left nav.  On the metrics page, select the 'Provisioned-managed utilization' measure. If you have more than one deployment in the resource, you should also split the values by each deployment by clicking the 'Apply Splitting' button.

:::image type="content" source="../media/provisioned/azure-monitor-utilization.jpg" alt-text="Screenshot of the provisioned managed utilization on the resource's metrics blade in the Azure portal" lightbox="../media/provisioned/azure-monitor-utilization.jpg":::

For more information about monitoring your deployments, see the [Monitoring Azure OpenAI Service](./monitoring.md) page.


## Handling high utilization
Provisioned deployments provide you with an allocated amount of compute capacity to run a given model. The ‘Provisioned-Managed Utilization’ metric in Azure Monitor measures the utilization of the deployment in one-minute increments. Provisioned-Managed deployments are also optimized so that calls accepted are processed with a consistent per-call max latency. When the workload exceeds its allocated capacity, the service returns a 429 HTTP status code until the utilization drops down below 100%. The time before retrying is provided in the `retry-after` and `retry-after-ms` response headers that provide the time in seconds and milliseconds respectively.  This approach maintains the per-call latency targets while giving the developer control over how to handle high-load situations – for example retry or divert to another experience/endpoint. 

### What should  I do when I receive a 429 response?
A 429 response indicates that the allocated PTUs are fully consumed at the time of the call. The response includes the `retry-after-ms` and `retry-after` headers that tell you the time to wait before the next call will be accepted. How you choose to handle a 429 response depends on your application requirements. Here are some considerations:
-	If you are okay with longer per-call latencies, implement client-side retry logic to wait the `retry-after-ms` time and retry. This approach lets you maximize the throughput on the deployment. Microsoft-supplied client SDKs already handle it with reasonable defaults. You might still need further tuning based on your use-cases.
-	Consider redirecting the traffic to other models, deployments or experiences. This approach is the lowest-latency solution because this action can be taken as soon as you receive the 429 signal.
The 429 signal isn't an unexpected error response when pushing to high utilization but instead part of the design for managing queuing and high load for provisioned deployments. 

### Modifying retry logic within the client libraries
The Azure OpenAI SDKs retry 429 responses by default and behind the scenes in the client (up to the maximum retries). The libraries respect the `retry-after` time. You can also modify the retry behavior to better suite your experience. Here's an example with the python library. 


You can use the `max_retries` option to configure or disable retry settings:

```python
from openai import AzureOpenAI

# Configure the default for all requests:
client = AzureOpenAI(
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2023-05-15",
    max_retries=5,# default is 2
)

# Or, configure per-request:
client.with_options(max_retries=5).chat.completions.create(
    model="gpt-4", # model = "deployment_name".
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
        {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
        {"role": "user", "content": "Do other Azure AI services support this too?"}
    ]
)
```


## Run a Benchmark
The exact performance and throughput capabilities of your instance depends on the kind of requests you make and the exact workload. The best way to determine the throughput for your workload is to run a benchmark on your own data. 

To assist you in this work, the benchmarking tool provides a way to easily run benchmarks on your deployment. The tool comes with several possible preconfigured workload shapes and outputs key performance metrics. Learn more about the tool and configuration settings in our GitHub Repo: [https://aka.ms/aoai/benchmarking](https://aka.ms/aoai/benchmarking). 

We recommend the following workflow:
1. Estimate your throughput PTUs using the capacity calculator.
1. Run a benchmark with this traffic shape for an extended period of time (10+ min) to observe the results in a steady state.
1. Observe the utilization, tokens processed and call rate values from benchmark tool and Azure Monitor.
1. Run a benchmark with your own traffic shape and workloads using your client implementation. Be sure to implement retry logic using either an Azure Openai client library or custom logic. 



## Next Steps

* For more information on cloud application best practices, check out [Best practices in cloud applications](https://learn.microsoft.com/azure/architecture/best-practices/index-best-practices)
* For more information on provisioned deployments, check out [What is provisioned throughput?](../concepts/provisioned-throughput.md)
* For more information on retry logic within each SDK, check out:
    * [Python reference documentation](https://github.com/openai/openai-python?tab=readme-ov-file#retries)
    * [.NET reference documentation](https://learn.microsoft.com/dotnet/api/azure.ai.openai.openaiclientoptions?view=azure-dotnet-preview)
    * [Java reference documentation](https://learn.microsoft.com/java/api/com.azure.ai.openai.openaiclientbuilder?view=azure-java-preview#com-azure-ai-openai-openaiclientbuilder-retryoptions(com-azure-core-http-policy-retryoptions))
    * [JavaScript reference documentation](https://learn.microsoft.com/javascript/api/@azure/openai/openaiclientoptions?view=azure-node-preview#@azure-openai-openaiclientoptions-retryoptions)
    * [GO reference documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#ChatCompletionsOptions)
---
title: 'Quickstart - Get started using Provisioned Deployments with Azure OpenAI Service'
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started provisioned deployments on Azure OpenAI Service.
manager: nitinme
ms.service: azure-ai-openai
ms.custom: openai
ms.topic: how-to
author: ChrisHMSFT
ms.author: chrhoder
ms.date: 08/07/2024
recommendations: false
---

# Get started using Provisioned Deployments on the Azure OpenAI Service

The following guide walks you through key steps in creating a provisioned deployment with your Azure OpenAI Service resource. For more details on the concepts discussed here, see:
* [Azure OpenAI Provisioned Onboarding Guide](./provisioned-throughput-onboarding.md)
* [Azure OpenAI Provisioned Concepts](../concepts/provisioned-throughput.md) 

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Azure Contributor or Cognitive Services Contributor role 
- Access to Azure OpenAI Studio

## Obtain/verify PTU quota availability.

Provisioned throughput deployments are sized in units called Provisioned Throughput Units (PTUs). PTU quota is granted to a subscription regionally and limits the total number of PTUs that can be deployed in that region across all models and versions. 

Creating a new deployment requires available (unused) quota to cover the desired size of the deployment. For example: If a subscription has the following in South Central US: 

* Total PTU Quota = 500 PTUs 
* Deployments: 
    * 100 PTUs: GPT-4o, 2024-05-13 
    * 100 PTUs: GPT-4, 0613 

Then 200 PTUs of quota are considered used, and there are 300 PTUs available for use to create new deployments. 

A default amount of PTU quota is assigned to all subscriptions in several regions. You can view the quota available to you in a region by visiting the Quotas blade in Azure OpenAI Studio and selecting the desired subscription and region. For example, the screenshot below shows a quota limit of 500 PTUs in West US for the selected subscription. Note that you might see lower values of available default quotas. 
 
:::image type="content" source="../media/provisioned/available-quota.png" alt-text="A screenshot of the available quota in Azure OpenAI studio." lightbox="../media/provisioned/available-quota.png":::

Additional quota can be requested by clicking the Request Quota link to the right of the “Usage/Limit” column.  (This is off-screen in the screenshot above). 

## Create an Azure OpenAI resource 

Provisioned Throughput deployments are created via Azure OpenAI resource objects within Azure. You must have an Azure OpenAI resource in each region where you intend to create a deployment. Use the Azure portal to [create a resource](./create-resource.md) in a region with available quota, if required.  

> [!NOTE]
> Azure OpenAI resources can support multiple types of Azure OpenAI deployments at the same time.  It is not necessary to dedicate new resources for your provisioned deployments. 

## Create your provisioned deployment - capacity is available

After you purchase a commitment on your quota, you can create a deployment. To create a provisioned deployment, you can follow these steps; the choices described reflect the entries shown in the screenshot. 

:::image type="content" source="../media/provisioned/deployment-screen.png" alt-text="Screenshot of the Azure OpenAI Studio deployment page for a provisioned deployment." lightbox="../media/provisioned/deployment-screen.png":::



1.	Sign into the [Azure OpenAI Studio](https://oai.azure.com)
2.	Choose the subscription that was enabled for provisioned deployments & select the desired resource in a region where you have the quota.
3.	Under **Management** in the left-nav select **Deployments**.
4.	Select Create new deployment and configure the following fields. Expand the **advanced options** drop-down menu.
5.	Fill out the values in each field. Here's an example:

| Field | Description |	Example |
|--|--|--| 
| Select a model|	Choose the specific model you wish to deploy.	| GPT-4 |
| Model version |	Choose the version of the model to deploy.	 | 0613 |
| Deployment Name	 | The deployment name is used in your code to call the model by using the client libraries and the REST APIs.	| gpt-4|
| Content filter	| Specify the filtering policy to apply to the deployment. Learn more on our [Content Filtering](../concepts/content-filter.md) how-to. | 	Default |
| Deployment Type	|This impacts the throughput and performance. Choose Provisioned-Managed for your provisioned deployment 	| Provisioned-Managed |
| Provisioned Throughput Units |	Choose the amount of throughput you wish to include in the deployment. |	100 |

Important things to note: 
* The deployment dialog contains a reminder that you can purchase an Azure Reservation for Azure OpenAI Provisioned to obtain a significant discount for a term commitment. 
* There is a message that tells you the list, hourly price of the deployment that you would be charged if this deployment is not covered by a reservation.  This is a list price that does not include any negotiated discounts for your company. 

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
--sku-name ProvisionedManaged
```

REST, ARM template, Bicep, and Terraform can also be used to create deployments. See the section on automating deployments in the [Managing Quota](quota.md?tabs=rest#automate-deployment) how-to guide and replace the `sku.name` with "ProvisionedManaged" rather than "Standard."

## Create your provisioned deployment – Capacity is not available 

Due to the dynamic nature of capacity availability, it is possible that the region of your selected resource might not have the service capacity to create the deployment of the specified model, version, and number of PTUs. 

In this event, Azure OpenAI Studio will direct you to other regions with available quota and capacity to create a deployment of the desired model. If this happens, the deployment dialog will look like this: 

:::image type="content" source="../media/provisioned/deployment-screen-2.png" alt-text="Screenshot of the Azure OpenAI Studio deployment page for a provisioned deployment with no capacity available." lightbox="../media/provisioned/deployment-screen-2.png":::

Things to notice: 

* A message displays showing you many PTUs you have in available quota, and how many can currently be deployed at this time. 
* If you select a number of PTUs greater than service capacity, a message will appear that provides options for you to obtain more capacity, and a button to allow you to select an alternate region. Clicking the "See other regions" button will display a dialog that shows a list of Azure OpenAI resources where you can create a deployment, along with the maximum sized deployment that can be created based on available quota and service capacity in each region. 

:::image type="content" source="../media/provisioned/choose-different-resource.png" alt-text="Screenshot of the Azure OpenAI Studio deployment page for choosing a different resource and region." lightbox="../media/provisioned/choose-different-resource.png":::

Selecting a resource and clicking **Switch resource** will cause the deployment dialog to redisplay using the selected resource. You can then proceed to create your deployment in the new region. 

Learn more about the purchase model and how to purchase a reservation: 

* [Azure OpenAI provisioned onboarding guide](./provisioned-throughput-onboarding.md) 
* [Guide for Azure OpenAI provisioned reservations](../concepts/provisioned-throughput.md) 

## Make your first inferencing calls
The inferencing code for provisioned deployments is the same a standard deployment type. The following code snippet shows a chat completions call to a GPT-4 model. For your first time using these models programmatically, we recommend starting with our [quickstart guide](../quickstart.md). Our recommendation is to use the OpenAI library with version 1.0 or greater since this includes retry logic within the library.


```python
    #Note: The openai-python library support for Azure OpenAI is in preview. 
    import os
    from openai import AzureOpenAI

    client = AzureOpenAI(
        azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
        api_version="2024-02-01"
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
The amount of throughput that you can achieve on the endpoint is a factor of the number of PTUs deployed, input size, output size, and call rate. The number of concurrent calls and total tokens processed can vary based on these values. Our recommended way for determining the throughput for your deployment is as follows:
1.	Use the Capacity calculator for a sizing estimate. You can find the capacity calculator in the Azure OpenAI Studio under the quotas page and Provisioned tab.  
2.	Benchmark the load using real traffic workload. For more information about benchmarking, see the [benchmarking](#run-a-benchmark) section.


## Measuring your deployment utilization
When you deploy a specified number of provisioned throughput units (PTUs), a set amount of inference throughput is made available to that endpoint. Utilization of this throughput is a complex formula based on the model, model-version call rate, prompt size, generation size. To simplify this calculation, we provide a utilization metric in Azure Monitor. Your deployment returns a 429 on any new calls after the utilization rises above 100%. The Provisioned utilization is defined as follows:

PTU deployment utilization = (PTUs consumed in the time period) / (PTUs deployed in the time period)

You can find the utilization measure in the Azure-Monitor section for your resource. To access the monitoring dashboards sign-in to [https://portal.azure.com](https://portal.azure.com), go to your Azure OpenAI resource and select the Metrics page from the left nav. On the metrics page, select the 'Provisioned-managed utilization' measure. If you have more than one deployment in the resource, you should also split the values by each deployment by clicking the 'Apply Splitting' button.

:::image type="content" source="../media/provisioned/azure-monitor-utilization.jpg" alt-text="Screenshot of the provisioned managed utilization on the resource's metrics blade in the Azure portal." lightbox="../media/provisioned/azure-monitor-utilization.jpg":::

For more information about monitoring your deployments, see the [Monitoring Azure OpenAI Service](./monitoring.md) page.


## Handling high utilization
Provisioned deployments provide you with an allocated amount of compute capacity to run a given model. The ‘Provisioned-Managed Utilization’ metric in Azure Monitor measures the utilization of the deployment in one-minute increments. Provisioned-Managed deployments are also optimized so that calls accepted are processed with a consistent per-call max latency. When the workload exceeds its allocated capacity, the service returns a 429 HTTP status code until the utilization drops down below 100%. The time before retrying is provided in the `retry-after` and `retry-after-ms` response headers that provide the time in seconds and milliseconds respectively. This approach maintains the per-call latency targets while giving the developer control over how to handle high-load situations – for example retry or divert to another experience/endpoint. 

### What should  I do when I receive a 429 response?
A 429 response indicates that the allocated PTUs are fully consumed at the time of the call. The response includes the `retry-after-ms` and `retry-after` headers that tell you the time to wait before the next call will be accepted. How you choose to handle a 429 response depends on your application requirements. Here are some considerations:
-	If you are okay with longer per-call latencies, implement client-side retry logic to wait the `retry-after-ms` time and retry. This approach lets you maximize the throughput on the deployment. Microsoft-supplied client SDKs already handle it with reasonable defaults. You might still need further tuning based on your use-cases.
-	Consider redirecting the traffic to other models, deployments, or experiences. This approach is the lowest-latency solution because this action can be taken as soon as you receive the 429 signal.
The 429 signal isn't an unexpected error response when pushing to high utilization but instead part of the design for managing queuing and high load for provisioned deployments. 

### Modifying retry logic within the client libraries
The Azure OpenAI SDKs retry 429 responses by default and behind the scenes in the client (up to the maximum retries). The libraries respect the `retry-after` time. You can also modify the retry behavior to better suit your experience. Here's an example with the python library. 


You can use the `max_retries` option to configure or disable retry settings:

```python
from openai import AzureOpenAI

# Configure the default for all requests:
client = AzureOpenAI(
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-02-01",
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


## Run a benchmark
The exact performance and throughput capabilities of your instance depends on the kind of requests you make and the exact workload. The best way to determine the throughput for your workload is to run a benchmark on your own data. 

To assist you in this work, the benchmarking tool provides a way to easily run benchmarks on your deployment. The tool comes with several possible preconfigured workload shapes and outputs key performance metrics. Learn more about the tool and configuration settings in our GitHub Repo: [https://aka.ms/aoai/benchmarking](https://aka.ms/aoai/benchmarking). 

We recommend the following workflow:
1. Estimate your throughput PTUs using the capacity calculator.
1. Run a benchmark with this traffic shape for an extended period of time (10+ min) to observe the results in a steady state.
1. Observe the utilization, tokens processed and call rate values from benchmark tool and Azure Monitor.
1. Run a benchmark with your own traffic shape and workloads using your client implementation. Be sure to implement retry logic using either an Azure OpenAI client library or custom logic. 



## Next Steps

* For more information on cloud application best practices, check out [Best practices in cloud applications](/azure/architecture/best-practices/index-best-practices)
* For more information on provisioned deployments, check out [What is provisioned throughput?](../concepts/provisioned-throughput.md)
* For more information on retry logic within each SDK, check out:
    * [Python reference documentation](https://github.com/openai/openai-python?tab=readme-ov-file#retries)
    * [.NET reference documentation](/dotnet/api/overview/azure/ai.openai-readme)
    * [Java reference documentation](/java/api/com.azure.ai.openai.openaiclientbuilder?view=azure-java-preview&preserve-view=true#com-azure-ai-openai-openaiclientbuilder-retryoptions(com-azure-core-http-policy-retryoptions))
    * [JavaScript reference documentation](/javascript/api/@azure/openai/openaiclientoptions?view=azure-node-preview&preserve-view=true#@azure-openai-openaiclientoptions-retryoptions)
    * [GO reference documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai#ChatCompletionsOptions)

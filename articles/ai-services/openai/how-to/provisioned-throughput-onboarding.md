---
title: Azure OpenAI Service Provisioned Throughput Units (PTU) onboarding
description: Learn about provisioned throughput units onboarding and Azure OpenAI. 
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 08/07/2024
manager: nitinme
author: mrbullwinkle 
ms.author: mbullwin 
recommendations: false
---

# Provisioned throughput units onboarding

This article walks you through the process of onboarding to [Provisioned Throughput Units (PTU)](../concepts/provisioned-throughput.md). Once you complete the initial onboarding, we recommend referring to the PTU [getting started guide](./provisioned-get-started.md).

## When to use provisioned throughput units (PTU)

You should consider switching from pay-as-you-go to provisioned throughput when you have well-defined, predictable throughput requirements. Typically, this occurs when the application is ready for production or has already been deployed in production and there's an understanding of the expected traffic. This allows users to accurately forecast the required capacity and avoid unexpected billing. 

### Typical PTU scenarios

- An application that is ready for production or in production. 
- An application that has predictable capacity/usage expectations. 
- An application has real-time/latency sensitive requirements. 

> [!NOTE]
> In function calling and agent use cases, token usage can be variable. You should understand your expected Tokens Per Minute (TPM) usage in detail prior to migrating workloads to PTU.

## Sizing and estimation: provisioned managed only

Determining the right amount of provisioned throughput, or PTUs, you require for your workload is an essential step to optimizing performance and cost. This section describes how to use the Azure OpenAI capacity planning tool. The tool provides you with an estimate of the required PTU to meet the needs of your workload.

### Estimate provisioned throughput and cost

To get a quick estimate for your workload, open the capacity planner in the [Azure OpenAI Studio](https://oai.azure.com). The capacity planner is under **Management** > **Quotas** > **Provisioned**.

The **Provisioned** option and the capacity planner are only available in certain regions within the Quota pane, if you don't see this option setting the quota region to *Sweden Central* will make this option available. Enter the following parameters based on your workload.

| Input | Description |
|---|---|
|Model | OpenAI model you plan to use. For example: GPT-4 |
| Version | Version of the model you plan to use, for example 0614 |
| Peak calls per min | The number of calls per minute that are expected to be sent to the model |
| Tokens in prompt call | The number of tokens in the prompt for each call to the model. Calls with larger prompts utilize more of the PTU deployment. Currently this calculator assumes a single prompt value so for workloads with wide variance. We recommend benchmarking your deployment on your traffic to determine the most accurate estimate of PTU needed for your deployment. |
| Tokens in model response | The number of tokens generated from each call to the model. Calls with larger generation sizes will utilize more of the PTU deployment. Currently this calculator assumes a single prompt value so for workloads with wide variance. We recommend benchmarking your deployment on your traffic to determine the most accurate estimate of PTU needed for your deployment. |

After you fill in the required details, select **Calculate** button in the output column.

The values in the output column are the estimated value of PTU units required for the provided workload inputs. The first output value represents the estimated PTU units required for the workload, rounded to the nearest PTU scale increment. The second output value represents the raw estimated PTU units required for the workload. The token totals are calculated using the following equation: `Total = Peak calls per minute * (Tokens in prompt call + Tokens in model response)`.

:::image type="content" source="../media/how-to/provisioned-onboarding/capacity-calculator.png" alt-text="Screenshot of the Azure OpenAI Studio landing page." lightbox="../media/how-to/provisioned-onboarding/capacity-calculator.png":::

> [!NOTE]
> The capacity calculator provides an estimate based on simple input criteria. The most accurate way to determine your capacity is to benchmark a deployment with a representational workload for your use case.

## Understanding the Provisioned Throughput Purchase Model 

Azure OpenAI Provisioned is purchased on-demand at an hourly basis based on the number of deployed PTUs, with substantial term discount available via the purchase of Azure Reservations.   

The hourly model is useful for short-term deployment needs, such as validating new models or acquiring capacity for a hackathon.  However, the discounts provided by the Azure Reservation for Azure OpenAI Provisioned are considerable and most customers with consistent long-term usage will find a reserved model to be a better value proposition. 

> [!NOTE]
> Azure OpenAI Provisioned customers onboarded prior to the August self-service update use a purchase model called the Commitment model.  These customers may continue to use this older purchase model alongside the Hourly/reservation purchase model.  The Commitment model is not available for new customers.  For details on the Commitment purchase model and options for coexistence and migration, please see the [Azure OpenAI Provisioned August Update](./provisioned-migration.md).

## Hourly Usage  

Provisioned Throughput deployments are charged an hourly rate ($/PTU/hr) on the number of PTUs that have been deployed.  For example, a 300 PTU deployment will be charged the hourly rate times 300.  All Azure OpenAI pricing is available in the Azure Pricing Calculator. 

If a deployment exists for a partial hour, it will receive a prorated charge based on the number of minutes it was deployed during the hour.  For example, a deployment that exists for 15 minutes during an hour will receive 1/4th the hourly charge.  

If the deployment size is changed, the costs of the deployment will adjust to match the new number of PTUs.   

:::image type="content" source="../media/provisioned/hourly-billing.png" alt-text="A diagram showing hourly billing." lightbox="../media/provisioned/hourly-billing.png":::

Paying for provisioned deployments on an hourly basis is ideal for short-term deployment scenarios.  For example: Quality and performance benchmarking of new models, or temporarily increasing PTU capacity to cover an event such as a hackathon.  

Customers that require long-term usage of provisioned deployments, however, might pay significantly less per month by purchasing a term discount via an Azure Reservation as discussed in the next section. 

> [!NOTE]
> It is not recommended to scale production deployments according to incoming traffic and pay for them purely on an hourly basis. There are two reasons for this:
> * The cost savings achieved by purchasing an Azure Reservation for Azure OpenAI Provisioned are significant, and it will be less expensive in many cases to maintain a deployment sized for full production volume paid for via a reservation than it would be to scale the deployment with incoming traffic.
> * Having unused provisioned quota (PTUs) does not guarentee that capacity will be available to support increasing the size of the deployment when required. Quota limits the maximum number of PTUs that may be deployed, but it is not a capacity guarantee. Provisioned capacity for each region and modal dynamically changes throughout the day and may not be available when required. As a result, it is recommended to maintain a permanant deployment to cover your traffic needs (paid for via a reservation).

## Azure Reservations for Azure OpenAI Provisioned   

Discounts on top of the hourly usage price may be obtained by purchasing an Azure Reservation for Azure OpenAI Provisioned. An Azure Reservation is a term-discounting mechanism shared by many Azure products. For example, Compute and Cosmos DB. For Azure OpenAI Provisioned, the reservation provides a discount for committing to payment for fixed number of PTUs for a one-month or one-year period.  

* Azure Reservations are purchased via the Azure portal, not Azure OpenAI Studio  Link to Azure reservation portal. 

* Reservations are purchased regionally and can be flexibly scoped to cover usage from a group of deployments. Reservation scopes include: 

    * Individual resource groups or subscriptions 

    * A group of subscriptions in a Management Group 

    * All subscriptions in a billing account 

* New reservations can be purchased to cover the same scope as existing reservations, to allow for discounting of new provisioned deployments.  The scope of existing reservations can also be updated at any time without penalty, for example to cover a new subscription. 

* Reservations may be canceled after purchase, but credits are limited.   

* If the size of provisioned deployments within the scope of a reservation exceeds the amount of the reservation, the excess is charged at the hourly rate. For example, if deployments amounting to 250 PTUs exist within the scope of a 200 PTU reservation, 50 PTUs will be charged on an hourly basis until the deployment sizes are reduced to 200 PTUs, or a new reservation is created to cover the remaining 50. 

* Reservations guarantee a discounted price for the selected term.  They do not reserve capacity on the service or guarantee that it will be available when a deployment is created.  It is highly recommended that customers create deployments prior to purchasing a reservation to prevent from over-purchasing a reservation. 
 
> [!NOTE]
> The Azure role and tenant policy requirements to purchase a reservation are different than those required to create a deployment or Azure OpenAI resource. See Azure OpenAI [Provisioned reservation documentation](/azure/cost-management-billing/reservations/azure-open-ai) for more details.

## Important: Sizing Azure OpenAI Provisioned Reservations 

The PTU amounts in reservation purchases are independent of PTUs allocated in quota or used in deployments. It is possible to purchase a reservation for more PTUs than you have in quota, or can deploy for the desired region, model, or version.   Credits for over-purchasing a reservation are limited, and customers must take steps to ensure they maintain their reservation sizes in line with their deployed PTUs.  
 
The best practice is to always purchase a reservation after deployments have been created.  This prevents purchasing a reservation and then finding out that the required capacity is not available for the desired region or model. 
 
To assist customers with purchasing the correct reservation amounts. The total number of PTUs in a subscription and region that can be covered by a reservation are listed on the Quotas page of Azure OpenAI Studio. See the message "PTUs Available for reservation." 

:::image type="content" source="../media/provisioned/available-quota.png" alt-text="A screenshot showing available PTU quota." lightbox="../media/provisioned/available-quota.png":::


## Next steps

- [Provisioned Throughput Units (PTU) getting started guide](./provisioned-get-started.md)
- [Provisioned Throughput Units (PTU) concepts](../concepts/provisioned-throughput.md)
- [Provisioned Throughput reservation documentation](/azure/cost-management-billing/reservations/azure-open-ai) 
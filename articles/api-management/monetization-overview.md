---
title: Monetization with Azure API Management
description: Learn how to set up your monetization strategy for Azure API Management in six simple stages.
author: dlepow
ms.author: danlep
ms.date: 08/23/2021
ms.topic: article
ms.service: api-management
---

# Monetization with Azure API Management

Modern web APIs underpin the digital economy. They provide a company's intellectual property (IP) to third parties and generate revenue by:

- Packaging IP in the form of data, algorithms, or processes.
- Allowing other parties to discover and consume useful IP in a consistent, frictionless manner.
- Offering a mechanism for direct or indirect payment for this usage.

A common theme across API success stories is a *healthy business model*. Value is created and exchanged between all parties, in a sustainable way.

Start-ups, established organizations, and everything in-between typically seek to digitally transform starting with the business model. APIs allow the business model to be realized, enabling an easier and more cost-efficient way for marketing, adopting, consuming, and scaling the underlying IP.

Organizations publishing their first API face a complex set of decisions. While the Azure API Management platform de-escalates risk and accelerates key elements, organizations still need to configure and build their API around their unique technical and business model.

## Developing a monetization strategy

*Monetization* is the process of converting something into money - in this case, the API value. API interactions typically involve three distinct parties in the value chain:

:::image type="content" source="media/monetization-overview/values-overview.png" alt-text="Diagram of the monetization value chain":::

Categories of API monetization strategy include:

| API monetization strategy | Description |
| ----- | ----- |
| **Free** | An API facilitates business to business integration, such as streamlining a supply chain. The API is not monetized, but delivers significant value by enabling business processes efficiencies for both the API provider and API consumer. |
| **Consumer pays** | API consumers pay based on the number of interactions they have with the API. We focus on this approach in this document. |
| **Consumer gets paid** | For example, an API consumer uses the API to embed advertising in their website and receives a share of the generated revenue. |
| **Indirect monetization** | API monetization is not driven by the number of interactions with the API, but through other sources of revenue facilitated by the API. |

>[!NOTE]
>The monetization strategy is set by the API provider and should be designed to meet the needs of the API consumer.

Since a wide range of factors influence the design, API monetization doesn't come as a one-size-fits-all solution. Monetization strategy differentiates your API from your competitors and maximizes your generated revenue.

The following steps explain how to implement a monetization strategy for your API.

:::image type="content" source="media/monetization-overview/implementing-strategy.png" alt-text="Diagram of the steps for implementing your monetization strategy":::

### Step 1: Understand your customer

1. Map out the stages in your API consumers' likely journey, from first discovery of your API to maximum scale.

    For example, a set of customer stages could be:

    | Customer stage | Description |
    | ----- | ----- |
    | **Investigation** | Enable the API Consumer to try out your API with zero cost and friction. |
    | **Implementation** | Provide sufficient access to the API to support the development and testing work required to integrate with it. |
    | **Preview** | Allow the customer to launch their offering and understand initial demand. |
    | **Initial production usage** | Support early adoption of the API in production when usage levels aren't fully understood and a risk-adverse approach may be necessary. |
    | **Initial growth** | Enable the API Consumer to ramp up usage of the API in response to increased demand from end users. |
    | **Scale** | Incentivize the API Consumer to commit to a higher volume of purchase once the API is consistently reaching high levels of usage each month. |
    | **Global growth** | Reward the API users who are using the API at global scale by offering the optimal wholesale price. |

1. Analyze the value that your API will be generating for the customer at each stage in their journey. 
1. Consider applying a value-based pricing strategy if the direct value of the API to the customer is well understood.
1. Calculate the anticipated lifetime usage levels of the API for a customer and your expected number of customers over the lifetime of the API.

### Step 2: Quantify the costs

Calculate the total cost of ownership for your API.

| Cost | Description |
| ----- | ----- |
| **Cost of customer acquisition (COCA)** | The cost of marketing, sales, and onboarding. The most successful APIs tend to have a COCA with zero as adoption levels increase. APIs should be largely self-service in onboarding. Factors include documentation and frictionless integration with payment systems. |
| **Engineering costs** | The human resources required to build, test, operate, and maintain the API over its lifetime. Tends to be the most significant cost component. Where possible, exploit cloud PaaS and serverless technologies to minimize. |
| **Infrastructure costs** | The costs for the underlying platforms, compute, network, and storage required to support the API over its lifetime. Exploit cloud platforms to achieve an infrastructure cost model that scales up proportionally in line with API usage levels. |

### Step 3: Conduct market research

1. Research the market to identify competitors. 
1. Analyze competitors' monetization strategies. 
1. Understand the specific features (functional and non-functional) that they are offering with their API.

### Step 4: Design the revenue model

Design a revenue model based on the outcome of the steps above. You can work across two dimensions:

| Dimension | Description |
| --------- | ----------- |
| **Quality of service** | Put constraints on the service level you are offering by setting a cap on API usage. Define a quota for the API calls that can be made over a period of time (for example, 50,000 calls per month) and then block calls once that quota is reached. <br> You can also set a rate limit, throttling the number of calls that can be made in a short period (for example, 100 calls per second). <br> Caps and rate limits are applied in conjunction, preventing users from consuming their monthly quota in a short intensive burst of API calls. |
| **Price** | Define the unit price to be paid for each API call. |

Maximize the lifetime value (LTV) you generate from each customer by designing a revenue model that supports your customer at each stage of the customer journey.

1. Make it as easy as possible for your customers to scale and grow:
    - Suggest customers move up to the next tier in the revenue model. 
    - For example, reward customers who purchase a higher volume of API calls with a lower unit price.
1. Keep the revenue model as simple as possible:
    - Balance the need to provide choice with the risk of overwhelming customers with an array of options. 
    - Keep down the number of dimensions used to differentiate across the revenue model tiers.
1. Be transparent:
    - Provide clear documentation about the different options.
    - Give your customers tools for choosing the revenue model that best suits their needs.

Identify the range of required pricing models. A *pricing model* describes a specific set of rules for the API provider to turn consumption by the API consumer into revenue.

For example, to support the [customer stages above](#step-1-understand-your-customer), we would need six types of subscription:

| Subscription type | Description |
| ----- | ----- |
| `Free` | Enables the API consumer to trial the API in an obligation and cost free way, to determine whether it fulfills a use case. Removes all barriers to entry. |
| `Freemium` | Allows the API consumer to use the API for free, but to transition into a paid service as demand increases. |
| `Metered` | The API consumer can make as many calls as they want per month, and will pay a fixed amount per call. |
| `Tier` | The API consumer pays for a set number of calls per month. If they exceed this limit, they pay an overage amount per extra call. If they regularly incur overage, they can upgrade to the next tier. |
| `Tier + Overage` | The API consumer pays for a set number of calls per month. If they exceed this limit, they pay a set amount per extra call. |
| `Unit` | The API consumer pays for a set amount of call per month. If they exceed this limit, they have to pay for another unit of calls. |

Your revenue model will define the set of API products. Each API product implements a specific pricing model to target a specific stage in the API consumer lifecycle.

While pricing models generally shouldn't change, you may need to adapt the configuration and application of pricing models for your revenue model. For example, you may want to adjust your prices to match a competitor.

Building on the examples above, the pricing models could be applied to create an overall revenue model as follows:

| Customer lifecycle stage | Pricing model | Pricing model configuration | Quality of Service |
| ------------------------ | ------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| Investigation | Free | Not implemented. | Quota set to limit the Consumer to 100 calls/month. |
| Implementation | Freemium | Graduated tiers: <ul> <li>First tier flat amount is $0.</li> <li>Next tiers per unit amount charge set to charge $0.20/100 calls.</li></ul> | No quotas set. Consumer can continue to make and pay for calls with a rate limit of 100 calls/minute. |
| Preview | Metered | Price set to charge consumer $0.15/100 calls. | No quotas set. Consumer can continue to make and pay for calls at a rate limit of 200 calls/minute. |
| Initial production usage | Tier | Price set to charge consumer $14.95/month. | Quota set to limit the consumer to 50,000 calls/month with a rate limit of 100 calls/minute. |
| Initial growth | Tier + Overage | Graduated tiers: <ul><li>First tier flat amount is $89.95/month for first 100,000 calls.</li><li>Next tiers per unit amount charge set to charge $0.10/100 calls.</li></ul> | No quotas set. Consumer can continue to make and pay for extra calls at a rate limit of 100 calls/minute. |
| Scale | Tier + Overage | Graduated tiers:<ul><li>First tier flat amount is $449.95/month for first 500,000 calls.</li><li>Next tiers per unit amount charge set to charge $0.06/100 calls.</li></ul> | No quotas set. Consumer can continue to make and pay for extra calls at a rate limit of 1,200 calls/minute. |
| Global growth | Unit | Graduated tiers, where every tier flat amount is $749.95/month for 1,500,000 calls. | No quotas set. Consumer can continue to make and pay for extra calls at a rate limit of 3,500 calls/minute. |

**Two examples of how to interpret the revenue model based on the table above:**

* **Tier pricing model**  
   Applied to support API consumers during the **Initial production phase** of the lifecycle. With the Tier pricing model configuration, the consumer:  
    * Pays $14.95/month.  
    * Can make up to a maximum of 50,000 calls/month. 
    * Be rate limited to 100 calls/minute.

* **Scale phase of the lifecycle**
   Implemented by applying the **Tier + Overage** pricing model, where consumers:
    * Pay $449.95/month for first 500,000 calls. 
    * Are charged an extra $0.06/100 calls past the first 50,000. 
    * Rate limited to 1,200 calls/minute.

### Step 5: Calibrate

Calibrate the pricing across the revenue model to:

- Set the pricing to prevent overpricing or underpricing your API, based on the market research in step 3 above.
- Avoid any points in the revenue model that appear unfair or encourage customers to work around the model to achieve more favorable pricing.
- Ensure the revenue model is geared to generate a total lifetime value (TLV) sufficient to cover the total cost of ownership plus margin.
- Verify the quality of your service offerings in each revenue model tier can be supported by your solution. 
    - For example, if you are offering to support 3,500 calls/minute, make sure your end-to-end solution can scale to support that throughput level.

### Step 6: Release and monitor

Choose an appropriate solution to collect payment for usage of your APIs.  Providers tend to fall into two groups:

- **Payment platforms, like [Stripe](https://stripe.com/)**
    
    Calculate the payment based on the raw API usage metrics by applying the specific revenue model that the customer has chosen. Configure the payment platform to reflect your monetization strategy.
- **Payment providers, like [Adyen](https://www.adyen.com/)**

    Only concerned with the facilitating the payment transaction. You will need to apply your monetization strategy (like, translate API usage metrics into a payment) before calling this service.

Use Azure API Management to accelerate and de-risk the implementation by using built-in capabilities provided in API Management. For more information about the specific features in API Management, see [how API Management supports monetization](monetization-support.md).

Implement a solution that builds flexibility into how you codify your monetization strategy in the underlying systems using the same approach as the sample project. With flexible coding, you can respond dynamically and minimize the risk and cost of making changes.

Follow the [monetization GitHub repo documentation](https://github.com/microsoft/azure-api-management-monetization) to implement the sample project in your own Azure subscription.

Regularly monitor how your API is being consumed to enable you to make evidence-based decisions. For example, if evidence shows you are churning customers, repeat steps 1 to 5 above to uncover and address the source.

## Ongoing evolution

Review your monetization strategy regularly by revisiting and re-evaluating all of the steps above. You may need to evolve your monetization strategy over time as you learn more about your customers, what it costs to provide the API, and how you respond to shifting competition in the market.

Remember that the monetization strategy is only one facet of a successful API implementation. Other facets include:
* The developer experience
* The quality of your documentation
* The legal terms
* Your ability to scale the API to meet the committed service levels.

## Next Steps
* [How API Management supports monetization](monetization-support.md).
* Deploy a demo Adyen or Stripe integration via the associated [Git repo](https://github.com/microsoft/azure-api-management-monetization).
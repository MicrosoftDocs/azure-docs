---
title: Monetization with Azure API Management
description: Learn how to set up your monetization strategy for Azure API Management in six simple stages.
author: v-hhunter
ms.author: v-hhunter
ms.date: 08/13/2021
ms.topic: article
ms.service: api-management
---

# Monetization with Azure API Management

Modern web APIs underpin the digital economy. They generate revenue by:

- Providing a company's intellectual property (IP) to third parties.
- Packaging IP in the form of data, algorithms, or processes.
- Allowing other parties to discover and consume useful IP in a consistent, frictionless manner.
- Offering a mechanism for direct or indirect payment for this usage.

A common theme across API success stories is a *healthy business model*. Value is created and exchanged between all parties, in a sustainable way.

Start-ups, established organizations, and everything in-between typically seek to digitally transform starting with the business model. APIs allow the business model to be realized, enabling an easier and more cost-efficient way for marketing, adopting, consuming, and scaling the underlying IP.

Organizations publishing their first API face a complex set of decisions. While the Azure API Management platform de-escalates risk and accelerates key elements, organizations still need to configure and build their API around their unique technical and business model.

## Developing a monetization strategy

*Monetization* is the process of converting something into money - in this case, the API value. API interactions typically involve three distinct parties in the value chain:

![monetization strategy](./media/monetization-overview/illustration1.png)

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

![implementing monetization strategy steps](./media/monetization-overview/illustration2.png)

### Step 1 - Understand your customer

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

### Step 2 - Quantify the costs

Calculate the total cost of ownership for your API.

| Cost | Description |
| ----- | ----- |
| **Cost of customer acquisition (COCA)** | The cost of marketing, sales, and onboarding. The most successful APIs tend to have a COCA with zero as adoption level increase. APIs should be largely self-service in onboarding. Factors include documentation and frictionless integration with payment systems. |
| **Engineering costs** | The human resources required to build, test, operate, and maintain the API over its lifetime. Tends to be the most significant cost component. Where possible, exploit cloud PaaS and serverless technologies to minimize. |
| **Infrastructure costs** | The costs for the underlying platforms, compute, network, and storage required to support the API over its lifetime. Exploit cloud platforms to achieve an infrastructure cost model that scales up proportionally in line with API usage levels. |

### Step 3 - Conduct market research

1. Research the market to identify competitors. 
1. Analyze competitors' monetization strategies. 
1. Understand the specific features (functional and non-functional) that they are offering with their API.

### Step 4 - Design the revenue model

Design a revenue model based on the outcome of the steps above. You can work across two dimensions:

- **Quality of service**, controlled by setting caps and rate limits.
- **Price**.

Your goal is to maximize the lifetime value (LTV) that you generate from each customer by designing a revenue model that supports your customer at each stage of the customer journey.

1. Make it as easy as possible for your customers to scale and grow:
    - Suggest customers move up to the next tier in the revenue model. 
    - For example, reward customers who purchase a higher volume of API calls with a lower unit price.
1. Keep the revenue model as simple as possible:
    - Balance the need to provide choice with the risk of overwhelming customers with an array of options. 
    - Keep down the number of dimensions used to differentiate across the revenue model tiers.
1. Be transparent:
    - Provide clear documentation about the different options.
    - Give your customers tools for choosing the revenue model that best suits their needs.

For example, to support the customer stages above, we would need six types of subscription:

| Subscription type | Description |
| ----- | ----- |
| `Free` | Enables the API consumer to trial the API in an obligation and cost free way, to determine whether it fulfills a use case. Removes all barriers to entry. |
| `Freemium` | Allows the API consumer to use the API for free, but to transition into a paid service as demand increases. |
| `Metered` | The API consumer can make as many calls as they want per month, and will pay a fixed amount per call. |
| `Tier` | The API consumer pays for a set number of calls per month. If they exceed this limit, they pay an overage amount per extra call. If they regularly incur overage, they can upgrade to the next tier. |
| `Tier + Overage` | The API consumer pays for a set number of calls per month. If they exceed this limit, they pay a set amount per extra call. |
| `Unit` | The API consumer pays for a set amount of call per month. If they exceed this limit, they have to pay for another unit of calls. |

These subscription types are modeled in the sample project and are applied to the customer stages as follows:

| Customer Lifecycle Stage | Revenue model (APIM Product) | Subscription type  | Quality of Service (APIM Product Policies)                                                                  |
|--------------------------|------------------------------|--------------------|-------------------------------------------------------------------------------------------------------------|
| Investigation            | Free                         | Free               | Quota set to limit the Consumer to 100 calls / month                                                        |
| Implementation           | Developer                    | Freemium           | No quota set - Consumer can continue to make & pay for calls, rate limit of 100 calls / minute              |
| Preview                  | PAYG                         | Metered            | No quota set - Consumer can continue to make & pay for calls, rate limit of 200 calls / minute              |
| Initial production usage | Basic                        | Tier               | Quota set to limit the Consumer to 50,000 calls / month, rate limit of 100 calls / minute                   |
| Initial growth           | Standard                     | Tier + Overage     | No quota set - Consumer can continue to make & pay for additional calls, rate limit of 100 calls / minute   |
| Scale                    | Pro                          | Tier + Overage     | No quota set - Consumer can continue to make & pay for additional calls, rate limit of 1,200 calls / minute |
| Global growth            | Enterprise                   | Unit               | No quota set - Consumer can continue to make & pay for additional calls, rate limit of 3,500 calls / minute |

**Example scenarios:**

* `Tier` pricing
   
    The Basic product, in which a consumer pays $14.95 / month and can make up to 50,000 calls.
* `Metered` pricing
   
    The PAYG product, in which consumers are charged a flat rate of $0.15 / 100 calls. 
* `Tier + Overage` pricing 

    The Standard product, in which consumers are charged $89.95 / month for 100,000 calls and charged an additional $0.10 / 100 additional calls.

### Step 5 - Calibrate

Calibrate the pricing across the revenue model to:

- Set the pricing to prevent overpricing or underpricing your API, based on the market research in step 3 above.
- Avoid any points in the revenue model that appear unfair or encourage customers to work around the model to achieve more favorable pricing.
- Ensure the revenue model is geared to generate a total lifetime value (TLV) sufficient to cover the total cost of ownership plus margin.

### Step 6 - Release and monitor

Choose an appropriate solution to collect payment for usage of your APIs.  Providers tend to fall into two groups:

- **Payment platforms, like Stripe**
    
    Calculate the payment based on the raw API usage metrics by applying the specific revenue model that the customer has chosen. Configure the payment platform to reflect your monetization strategy.
- **Payment providers, like Adyen**

    Only concerned with the facilitating the payment transaction. You will need to apply your monetization strategy (like, translate API usage metrics into a payment) before calling this service.

Use Azure API Management to accelerate and de-risk the implementation by using built-in capabilities provided in API Management.  For more information about the specific features in API Management, see [how API Management supports monetization](monetization-support.md).

Use the same approach as the sample project to implement a solution that builds flexibility into how you codify your monetization strategy in the underlying systems. This will enable you to respond dynamically and to minimize the risk and cost of making changes.

For a description of how the sample project works from an API consumer perspective see [how the sample project works in practice].

Follow the README() and Deployment and initialization() articles to implement the sample project in your own Azure subscription.

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
* Run the initialization and deployment processes using our [Deploy demo with Stripe] or [Deploy demo with Adyen] tutorials.